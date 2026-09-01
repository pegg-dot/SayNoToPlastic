import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { emailOutbox, subscribers } from "../../../db/schema";
import { POLICY_VERSION } from "../../config";
import { audienceConfiguration, syncAudienceSubscriber } from "../../lib/audience-service";
import { deliverEmailOutboxJob } from "../../lib/email-outbox";
import { enrollInLearningSeries } from "../../lib/learning-series";
import { bodyIsReasonable, isSameOrigin, readJsonBody } from "../../lib/request-safety";
import { createUnsubscribeToken, hashUnsubscribeToken, publicSiteOrigin } from "../../lib/subscription";

export const dynamic = "force-dynamic";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type SignupProgram = "field-notes" | "learning-series";

async function configuredSiteUrl() {
  try { const { env } = await import("cloudflare:workers"); return typeof env.PUBLIC_SITE_URL === "string" ? env.PUBLIC_SITE_URL : undefined; }
  catch { return process.env.PUBLIC_SITE_URL; }
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request) || !bodyIsReasonable(request)) return Response.json({ error: "Request rejected." }, { status: 400 });
    const payload = await readJsonBody<{ firstName?: unknown; email?: unknown; source?: unknown; website?: unknown; consent?: unknown; program?: unknown }>(request);
    if (typeof payload.website === "string" && payload.website.trim()) return Response.json({ ok: true }, { status: 201 });
    const firstName = typeof payload.firstName === "string" ? payload.firstName.trim().slice(0, 80) : "";
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase().slice(0, 254) : "";
    const source = typeof payload.source === "string" ? payload.source.trim().slice(0, 120) : "/";
    const program: SignupProgram = payload.program === "learning-series" ? "learning-series" : "field-notes";
    if (!firstName) return Response.json({ error: "Please enter your first name." }, { status: 400 });
    if (!EMAIL.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (payload.consent !== true) return Response.json({ error: "Please confirm that you want to receive Say No to Plastic emails." }, { status: 400 });

    const audience = await audienceConfiguration();
    if (!audience.configured) return Response.json({ error: "Newsletter signup is temporarily unavailable. Please try again shortly." }, { status: 503 });

    const db = await getDb();
    const [existingSubscriber] = await db.select({ status: subscribers.status, providerStatus: subscribers.providerStatus }).from(subscribers).where(eq(subscribers.email, email)).limit(1);
    const now = new Date().toISOString();
    const unsubscribeToken = createUnsubscribeToken();
    const unsubscribeTokenHash = await hashUnsubscribeToken(unsubscribeToken);
    const siteOrigin = publicSiteOrigin(request.url, await configuredSiteUrl());

    if (existingSubscriber?.status === "active" && program === "field-notes") {
      if (existingSubscriber.providerStatus !== "synced") {
        const contact = await syncAudienceSubscriber({ email, firstName, source });
        if (!contact.configured) return Response.json({ error: "Newsletter signup is temporarily unavailable. Please try again shortly." }, { status: 503 });
        await db.update(subscribers).set({ firstName, source, providerStatus: "synced", providerId: contact.id || null, updatedAt: now }).where(eq(subscribers.email, email));
      }
      return Response.json({ ok: true, delivery: "synced" }, { status: 200 });
    }

    if (existingSubscriber?.status === "active" && program === "learning-series") {
      await db.update(subscribers).set({ firstName, source, consentVersion: POLICY_VERSION, consentAt: now, unsubscribeTokenHash, updatedAt: now }).where(eq(subscribers.email, email));
      let delivery: "sent" | "queued" = existingSubscriber.providerStatus === "synced" ? "sent" : "queued";
      if (existingSubscriber.providerStatus !== "synced") {
        await db.update(emailOutbox).set({ status: "dead", updatedAt: now, lastError: "welcome_replaced_after_token_rotation", nextAttemptAt: null }).where(and(eq(emailOutbox.kind, "welcome"), eq(emailOutbox.recipient, email), inArray(emailOutbox.status, ["pending", "queued", "failed"])));
        const [replacementWelcome] = await db.insert(emailOutbox).values({ kind: "welcome", recipient: email, status: "pending", payload: JSON.stringify({ firstName, source, unsubscribeToken, siteOrigin }), updatedAt: now }).returning({ id: emailOutbox.id });
        const replacementState = replacementWelcome?.id ? await deliverEmailOutboxJob(replacementWelcome.id) : "queued";
        delivery = replacementState === "sent" ? "sent" : "queued";
      }
      const series = await enrollInLearningSeries({ email, firstName, unsubscribeToken, siteOrigin });
      return Response.json({ ok: true, delivery, series }, { status: 200 });
    }

    await db.insert(subscribers).values({ firstName, email, source, status: "active", consentVersion: POLICY_VERSION, consentAt: now, providerStatus: "pending", unsubscribeTokenHash, unsubscribedAt: null, updatedAt: now }).onConflictDoUpdate({ target: subscribers.email, set: { firstName, source, status: "active", consentVersion: POLICY_VERSION, consentAt: now, providerStatus: "pending", unsubscribeTokenHash, unsubscribedAt: null, updatedAt: now } });

    if (program === "field-notes") {
      const contact = await syncAudienceSubscriber({ email, firstName, source });
      if (!contact.configured) return Response.json({ error: "Newsletter signup is temporarily unavailable. Please try again shortly." }, { status: 503 });
      await db.update(subscribers).set({ providerStatus: "synced", providerId: contact.id || null, updatedAt: now }).where(eq(subscribers.email, email));
      return Response.json({ ok: true, delivery: "synced" }, { status: 201 });
    }

    const [job] = await db.insert(emailOutbox).values({ kind: "welcome", recipient: email, status: "pending", payload: JSON.stringify({ firstName, source, unsubscribeToken, siteOrigin }), updatedAt: now }).returning({ id: emailOutbox.id });
    const delivery = job?.id ? await deliverEmailOutboxJob(job.id) : "queued";
    const series = await enrollInLearningSeries({ email, firstName, unsubscribeToken, siteOrigin });
    return Response.json({ ok: true, delivery: delivery === "sent" ? "sent" : "queued", series }, { status: 201 });
  } catch (error) {
    console.error("subscribe_failed", error);
    return Response.json({ error: "We could not save your subscription. Please try again shortly." }, { status: 500 });
  }
}

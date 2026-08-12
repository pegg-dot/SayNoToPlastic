import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { emailOutbox, subscribers } from "../../../../db/schema";
import { deliverEmailOutboxJob } from "../../../lib/email-outbox";
import { readBodyText } from "../../../lib/request-safety";
import { cancelLearningSeries } from "../../../lib/learning-series";
import { hashUnsubscribeToken, unsubscribeTokenIsValid } from "../../../lib/subscription";

function wantsJson(request: Request) {
  return (request.headers.get("content-type") || "").includes("application/json");
}

async function requestToken(request: Request) {
  const queryToken = new URL(request.url).searchParams.get("token");
  if (queryToken) return queryToken;
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json") && !contentType.includes("application/x-www-form-urlencoded")) return "";
  try {
    const text = await readBodyText(request, 2_048);
    if (contentType.includes("application/json")) {
      const payload = JSON.parse(text) as { token?: unknown };
      return typeof payload.token === "string" ? payload.token : "";
    }
    return new URLSearchParams(text).get("token") || "";
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const json = wantsJson(request);
  try {
    const token = await requestToken(request);
    if (unsubscribeTokenIsValid(token)) {
      const db = await getDb();
      const tokenHash = await hashUnsubscribeToken(token);
      const [subscriber] = await db.select({ email: subscribers.email, providerStatus: subscribers.providerStatus }).from(subscribers).where(eq(subscribers.unsubscribeTokenHash, tokenHash)).limit(1);
      if (subscriber) {
        const now = new Date().toISOString();
        await db.update(subscribers).set({
          status: "unsubscribed",
          unsubscribedAt: now,
          providerStatus: "unsubscribe_pending",
          updatedAt: now,
        }).where(eq(subscribers.email, subscriber.email));
        await cancelLearningSeries(subscriber.email);
        if (!["unsubscribe_pending", "unsubscribed"].includes(subscriber.providerStatus)) {
          const [job] = await db.insert(emailOutbox).values({
            kind: "subscriber_unsubscribe",
            recipient: subscriber.email,
            status: "pending",
            payload: JSON.stringify({ requestedAt: now }),
            updatedAt: now,
          }).returning({ id: emailOutbox.id });
          if (job?.id) await deliverEmailOutboxJob(job.id);
        }
      }
    }
    if (json) return Response.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
    return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("subscription_unsubscribe_failed", error);
    // Keep the public response non-enumerating. A protected outbox drain can retry provider synchronization.
    if (json) return Response.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
    return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}

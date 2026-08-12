import { and, asc, eq, inArray, isNull, lte, or } from "drizzle-orm";
import { getDb } from "../../db";
import { contactInquiries, emailOutbox, learningSeriesEnrollments, recoveryRequests, subscribers } from "../../db/schema";
import { sendContactNotification, sendLearningSeriesEmail, sendWelcome } from "./email-service";
import { syncAudienceSubscriber, unsubscribeAudienceSubscriber } from "./audience-service";
import { unsubscribeUrls } from "./subscription";
import { getLearningSeriesItem, learningSeries } from "../content/community-programs";
import { failLearningSeries, markLearningSeriesStep } from "./learning-series";

const SUPPORTED_KINDS = ["welcome", "learning_series", "contact_notification", "subscriber_unsubscribe", "ebook_recovery"] as const;
type SupportedKind = typeof SUPPORTED_KINDS[number];
type DeliveryState = "sent" | "queued" | "failed" | "skipped";

const LEASE_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function sqliteTimestamp(date = new Date()) {
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

function nextAttempt(attemptCount: number) {
  const minutes = Math.min(24 * 60, 5 * 2 ** Math.max(0, attemptCount - 1));
  return sqliteTimestamp(new Date(Date.now() + minutes * 60 * 1000));
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message.slice(0, 240) : "email_delivery_failed";
}

function parsePayload<T>(payload: string): T {
  const parsed = JSON.parse(payload) as T;
  if (!parsed || typeof parsed !== "object") throw new Error("email_outbox_payload_invalid");
  return parsed;
}

async function claimJob(id: number) {
  const db = await getDb();
  const [current] = await db.select().from(emailOutbox).where(eq(emailOutbox.id, id)).limit(1);
  if (!current || !SUPPORTED_KINDS.includes(current.kind as SupportedKind)) return null;
  if (current.status === "sent" || current.attemptCount >= MAX_ATTEMPTS) return null;

  const now = sqliteTimestamp();
  const staleBefore = sqliteTimestamp(new Date(Date.now() - LEASE_MS));
  const normalClaim = ["pending", "queued", "failed"].includes(current.status);
  const staleClaim = current.status === "processing" && Boolean(current.claimedAt && current.claimedAt <= staleBefore);
  if (!normalClaim && !staleClaim) return null;
  if (current.nextAttemptAt && current.nextAttemptAt > now && !staleClaim) return null;

  const claimCondition = staleClaim
    ? and(eq(emailOutbox.id, id), eq(emailOutbox.status, "processing"), eq(emailOutbox.claimedAt, current.claimedAt!))
    : and(eq(emailOutbox.id, id), eq(emailOutbox.status, current.status));
  const [claimed] = await db.update(emailOutbox).set({
    status: "processing",
    claimedAt: now,
    updatedAt: now,
    attemptCount: current.attemptCount + 1,
    lastError: null,
    nextAttemptAt: null,
  }).where(claimCondition).returning();
  return claimed || null;
}

async function markQueued(id: number, attemptCount: number, message: string): Promise<"queued" | "failed"> {
  const now = sqliteTimestamp();
  const terminal = attemptCount >= MAX_ATTEMPTS;
  await (await getDb()).update(emailOutbox).set({
    status: terminal ? "dead" : "queued",
    updatedAt: now,
    lastError: message.slice(0, 240),
    nextAttemptAt: terminal ? null : nextAttempt(attemptCount),
  }).where(eq(emailOutbox.id, id));
  return terminal ? "failed" : "queued";
}

async function markDeferred(id: number, attemptCount: number, message: string, delayMinutes = 6 * 60): Promise<"queued"> {
  const now = sqliteTimestamp();
  await (await getDb()).update(emailOutbox).set({
    status: "pending",
    claimedAt: null,
    updatedAt: now,
    attemptCount: Math.max(0, attemptCount - 1),
    lastError: message.slice(0, 240),
    nextAttemptAt: sqliteTimestamp(new Date(Date.now() + delayMinutes * 60 * 1000)),
  }).where(eq(emailOutbox.id, id));
  return "queued";
}

async function markFailed(id: number, attemptCount: number, message: string) {
  const terminal = attemptCount >= MAX_ATTEMPTS;
  await (await getDb()).update(emailOutbox).set({
    status: terminal ? "dead" : "failed",
    updatedAt: sqliteTimestamp(),
    lastError: message.slice(0, 240),
    nextAttemptAt: terminal ? null : nextAttempt(attemptCount),
  }).where(eq(emailOutbox.id, id));
}

async function markSent(id: number, providerId: string | null | undefined) {
  const sentAt = sqliteTimestamp();
  await (await getDb()).update(emailOutbox).set({
    status: "sent",
    providerId: providerId || null,
    sentAt,
    updatedAt: sentAt,
    lastError: null,
    nextAttemptAt: null,
    payload: "{}",
  }).where(eq(emailOutbox.id, id));
}

export async function deliverEmailOutboxJob(id: number): Promise<DeliveryState> {
  const job = await claimJob(id);
  if (!job) return "skipped";
  const db = await getDb();

  try {
    if (job.kind === "welcome") {
      const payload = parsePayload<{ firstName: string; source: string; unsubscribeToken: string; siteOrigin: string }>(job.payload);
      const urls = unsubscribeUrls(payload.siteOrigin, payload.unsubscribeToken);
      const contact = await syncAudienceSubscriber({ email: job.recipient, firstName: payload.firstName, source: payload.source });
      if (!contact.configured) {
        const queuedState = await markQueued(job.id, job.attemptCount, "audience_provider_not_configured");
        await db.update(subscribers).set({ providerStatus: "pending", updatedAt: sqliteTimestamp() }).where(eq(subscribers.email, job.recipient));
        return queuedState;
      }
      const welcome = await sendWelcome({
        email: job.recipient,
        firstName: payload.firstName,
        unsubscribeUrl: urls.preferences,
        oneClickUrl: urls.oneClick,
        idempotencyKey: `welcome:${job.id}`,
      });
      if (!welcome.configured) {
        const queuedState = await markQueued(job.id, job.attemptCount, "transactional_email_provider_not_configured");
        await db.update(subscribers).set({ providerStatus: "pending", updatedAt: sqliteTimestamp() }).where(eq(subscribers.email, job.recipient));
        return queuedState;
      }
      await markSent(job.id, welcome.id || contact.id);
      await db.update(subscribers).set({ providerStatus: "synced", providerId: contact.id || null, updatedAt: sqliteTimestamp() }).where(eq(subscribers.email, job.recipient));
      return "sent";
    }

    if (job.kind === "learning_series") {
      const payload = parsePayload<{ firstName: string; sequenceKey: string; step: number; unsubscribeToken: string; siteOrigin: string }>(job.payload);
      const [subscriber] = await db.select({ status: subscribers.status }).from(subscribers).where(eq(subscribers.email, job.recipient)).limit(1);
      const [enrollment] = await db.select({ status: learningSeriesEnrollments.status, nextStep: learningSeriesEnrollments.nextStep })
        .from(learningSeriesEnrollments)
        .where(and(
          eq(learningSeriesEnrollments.email, job.recipient),
          eq(learningSeriesEnrollments.sequenceKey, payload.sequenceKey),
        ))
        .limit(1);
      if (!subscriber || subscriber.status !== "active" || !enrollment || enrollment.status !== "active") {
        await markSent(job.id, null);
        return "sent";
      }
      if (payload.step < enrollment.nextStep) {
        await markSent(job.id, null);
        return "sent";
      }
      if (payload.step > enrollment.nextStep) {
        return markDeferred(job.id, job.attemptCount, "learning_series_waiting_for_prior_step");
      }
      const item = getLearningSeriesItem(payload.step);
      if (!item) throw new Error("learning_series_step_invalid");
      const urls = unsubscribeUrls(payload.siteOrigin, payload.unsubscribeToken);
      const result = await sendLearningSeriesEmail({
        email: job.recipient,
        firstName: payload.firstName,
        item,
        siteOrigin: payload.siteOrigin,
        unsubscribeUrl: urls.preferences,
        oneClickUrl: urls.oneClick,
        idempotencyKey: `learning-series:${payload.sequenceKey}:${payload.step}:${job.id}`,
      });
      if (!result.configured) {
        const queuedState = await markQueued(job.id, job.attemptCount, "transactional_email_provider_not_configured");
        if (queuedState === "failed") {
          await failLearningSeries({
            email: job.recipient,
            sequenceKey: payload.sequenceKey,
            reason: "learning_series_paused_provider_not_configured",
          });
        }
        return queuedState;
      }
      await markLearningSeriesStep({ email: job.recipient, sequenceKey: payload.sequenceKey, step: payload.step, finalStep: learningSeries.length });
      await markSent(job.id, result.id);
      return "sent";
    }

    if (job.kind === "contact_notification") {
      const payload = parsePayload<{ inquiryId?: number | null; name: string; email: string; topic: string; message: string }>(job.payload);
      const result = await sendContactNotification({
        name: payload.name,
        email: payload.email,
        topic: payload.topic,
        message: payload.message,
        idempotencyKey: `contact:${job.id}`,
      });
      if (!result.configured) {
        const queuedState = await markQueued(job.id, job.attemptCount, "email_provider_not_configured");
        if (payload.inquiryId) await db.update(contactInquiries).set({ deliveryStatus: "queued" }).where(eq(contactInquiries.id, payload.inquiryId));
        return queuedState;
      }
      await markSent(job.id, result.id);
      if (payload.inquiryId) await db.update(contactInquiries).set({ deliveryStatus: "sent" }).where(eq(contactInquiries.id, payload.inquiryId));
      return "sent";
    }

    if (job.kind === "subscriber_unsubscribe") {
      const result = await unsubscribeAudienceSubscriber(job.recipient);
      if (!result.configured) {
        const queuedState = await markQueued(job.id, job.attemptCount, "email_provider_not_configured");
        await db.update(subscribers).set({ providerStatus: "unsubscribe_pending", updatedAt: sqliteTimestamp() }).where(eq(subscribers.email, job.recipient));
        return queuedState;
      }
      await markSent(job.id, result.id);
      await db.update(subscribers).set({ providerStatus: "unsubscribed", providerId: result.id || null, updatedAt: sqliteTimestamp() }).where(eq(subscribers.email, job.recipient));
      return "sent";
    }


    if (job.kind === "ebook_recovery") {
      const payload = parsePayload<{ orderId: string; requestId?: number | null; siteOrigin: string; issuedAt: string }>(job.payload);
      const { sendRecoveryAccessEmail } = await import("./commerce");
      const result = await sendRecoveryAccessEmail({
        email: job.recipient,
        orderId: payload.orderId,
        siteOrigin: payload.siteOrigin,
        issuedAt: payload.issuedAt,
        idempotencyKey: `ebook-recovery:${payload.requestId || job.id}:${payload.orderId}`,
      });
      if (result.skipped) {
        await markSent(job.id, null);
        if (payload.requestId) await db.update(recoveryRequests).set({ status: "not_found" }).where(eq(recoveryRequests.id, payload.requestId));
        return "sent";
      }
      if (!result.configured) {
        const queuedState = await markQueued(job.id, job.attemptCount, "email_provider_not_configured");
        if (payload.requestId) await db.update(recoveryRequests).set({ status: "queued" }).where(eq(recoveryRequests.id, payload.requestId));
        return queuedState;
      }
      await markSent(job.id, result.id);
      if (payload.requestId) await db.update(recoveryRequests).set({ status: "sent" }).where(eq(recoveryRequests.id, payload.requestId));
      return "sent";
    }
    return "skipped";
  } catch (error) {
    const message = errorMessage(error);
    await markFailed(job.id, job.attemptCount, message);
    if (job.kind === "learning_series" && job.attemptCount >= MAX_ATTEMPTS) {
      try {
        const payload = parsePayload<{ sequenceKey: string }>(job.payload);
        await failLearningSeries({
          email: job.recipient,
          sequenceKey: payload.sequenceKey,
          reason: "learning_series_paused_after_terminal_failure",
        });
      } catch {
        // The terminal outbox record already retains the delivery failure.
      }
    }
    if (job.kind === "contact_notification") {
      try {
        const payload = parsePayload<{ inquiryId?: number | null }>(job.payload);
        if (payload.inquiryId) await db.update(contactInquiries).set({ deliveryStatus: "failed" }).where(eq(contactInquiries.id, payload.inquiryId));
      } catch {
        // The outbox record already contains the failure reason.
      }
    }
    if (job.kind === "ebook_recovery") {
      try {
        const payload = parsePayload<{ requestId?: number | null }>(job.payload);
        if (payload.requestId) await db.update(recoveryRequests).set({ status: "failed" }).where(eq(recoveryRequests.id, payload.requestId));
      } catch {
        // The outbox record already contains the failure reason.
      }
    }
    console.error("email_outbox_delivery_failed", { id: job.id, kind: job.kind, message });
    return "failed";
  }
}

export async function drainEmailOutbox(limit = 10) {
  const db = await getDb();
  const now = sqliteTimestamp();
  const staleBefore = sqliteTimestamp(new Date(Date.now() - LEASE_MS));
  const rows = await db.select({ id: emailOutbox.id }).from(emailOutbox).where(and(
    inArray(emailOutbox.kind, [...SUPPORTED_KINDS]),
    or(
      and(inArray(emailOutbox.status, ["pending", "queued", "failed"]), or(isNull(emailOutbox.nextAttemptAt), lte(emailOutbox.nextAttemptAt, now))),
      and(eq(emailOutbox.status, "processing"), lte(emailOutbox.claimedAt, staleBefore)),
    ),
  )).orderBy(asc(emailOutbox.nextAttemptAt), asc(emailOutbox.createdAt), asc(emailOutbox.id)).limit(Math.max(1, Math.min(50, limit)));

  const summary = { selected: rows.length, sent: 0, queued: 0, failed: 0, skipped: 0 };
  for (const row of rows) {
    const state = await deliverEmailOutboxJob(row.id);
    summary[state] += 1;
  }
  return summary;
}

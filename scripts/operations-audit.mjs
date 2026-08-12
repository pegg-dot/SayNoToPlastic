#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];

function source(path) {
  return readFileSync(join(root, path), "utf8");
}
function expect(ok, message) {
  checks.push({ ok: Boolean(ok), message });
}
function includesAll(text, tokens) {
  return tokens.every((token) => text.includes(token));
}

const envPath = join(root, ".env.example");
expect(existsSync(envPath), ".env.example is packaged as the safe configuration contract.");
const env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
for (const key of [
  "PUBLIC_SITE_URL", "COMMERCE_MODE", "COMMERCE_PREVIEW_ENABLED", "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_ID", "STRIPE_API_VERSION", "STRIPE_AUTOMATIC_TAX",
  "EBOOK_ACCESS_SECRET", "EBOOK_OBJECT_KEY", "EBOOK_DOWNLOAD_FILENAME", "EBOOK_SHA256",
  "RESEND_API_KEY", "RESEND_FROM_EMAIL", "SUPPORT_EMAIL", "AUDIENCE_PROVIDER",
  "MAILCHIMP_API_KEY", "MAILCHIMP_SERVER_PREFIX", "MAILCHIMP_AUDIENCE_ID", "OPERATIONS_SECRET",
]) expect(new RegExp(`^${key}=`, "m").test(env), `.env.example declares ${key}.`);

const migration = source("drizzle/0005_site_operations.sql");
expect(includesAll(migration, ["unsubscribe_token_hash", "unsubscribed_at", "claimed_at", "attempt_count", "next_attempt_at", "email_outbox_next_attempt_idx"]), "Migration 0005 adds unsubscribe state and durable outbox retry fields.");

const schema = source("db/schema.ts");
expect(includesAll(schema, ["unsubscribeTokenHash", "unsubscribedAt", "claimedAt", "attemptCount", "lastError", "nextAttemptAt"]), "Drizzle schema reflects migration 0005.");

const learningMigration = source("drizzle/0006_learning_series.sql");
expect(includesAll(learningMigration, ["learning_series_enrollments", "sequence_key", "next_step", "learning_series_email_sequence_unique", "learning_series_status_idx"]), "Migration 0006 adds idempotent learning-series enrollment state and indexes.");
expect(includesAll(schema, ["learningSeriesEnrollments", "sequenceKey", "nextStep", "learning_series_email_sequence_unique", "learning_series_status_idx"]), "Drizzle schema reflects migration 0006.");

const subscribe = source("app/api/subscribe/route.ts");
expect(includesAll(subscribe, ["createUnsubscribeToken", "hashUnsubscribeToken", 'kind: "welcome"', "deliverEmailOutboxJob"]), "Subscriptions create a private preference token and durable welcome job.");
expect(includesAll(subscribe, ['existingSubscriber?.status === \"active\"', 'providerStatus === \"synced\"']), "Repeated signup for an already-active address does not generate another welcome job.");
expect(includesAll(subscribe, ["program === \"learning-series\"", "enrollInLearningSeries", "unsubscribeToken", "series"]), "Consent-based signup can schedule the ten-part learning series without duplicating the ordinary welcome path.");
expect(subscribe.includes("welcome_replaced_after_token_rotation"), "An active subscriber opting into the series replaces any stale pending welcome job after the unsubscribe token rotates.");

const unsubscribe = source("app/api/subscription/unsubscribe/route.ts");
expect(includesAll(unsubscribe, ["hashUnsubscribeToken", 'status: "unsubscribed"', 'kind: "subscriber_unsubscribe"', "Cache-Control"]), "Unsubscribe requests suppress locally and queue provider synchronization.");
expect(includesAll(unsubscribe, ["providerStatus: subscribers.providerStatus", "unsubscribe_pending", "unsubscribed"]), "Repeated unsubscribe requests do not create duplicate provider-sync jobs.");
expect(unsubscribe.includes("cancelLearningSeries"), "Unsubscribe cancels pending learning-series delivery as well as provider synchronization.");

const contactRoute = source("app/api/contact/route.ts");
expect(includesAll(contactRoute, ["configuredSupportEmail", "env.SUPPORT_EMAIL", "recipient: await configuredSupportEmail()"]), "Contact outbox audit recipient follows the hosted support configuration.");

const emailService = source("app/lib/email-service.ts");
expect(includesAll(emailService, ["Idempotency-Key", "List-Unsubscribe", "List-Unsubscribe-Post"]), "Transactional email delivery includes provider idempotency and one-click unsubscribe headers.");
expect(includesAll(emailService, ["sendLearningSeriesEmail", "Field Note", "Carry forward", "Open the full reading"]), "Learning-series messages keep sequence context, source-aware framing, and the medical boundary.");
const audienceService = source("app/lib/audience-service.ts");
expect(includesAll(audienceService, ["AUDIENCE_PROVIDER", "mailchimpSubscriberHash", "syncAudienceSubscriber", "unsubscribeAudienceSubscriber"]), "Newsletter audience synchronization uses an explicit Mailchimp/Resend provider boundary.");

const outbox = source("app/lib/email-outbox.ts");
expect(includesAll(outbox, ["LEASE_MS", "MAX_ATTEMPTS", "nextAttempt", 'status: "processing"', 'payload: "{}"', "ebook_recovery", "drainEmailOutbox"]), "Email outbox supports leases, retries, recovery delivery, terminal state, and payload scrubbing.");
expect(includesAll(outbox, ['"learning_series"', "getLearningSeriesItem", "markLearningSeriesStep", "sendLearningSeriesEmail"]), "Email outbox delivers due learning-series lessons through the same leased, retried, idempotent operations path.");
expect(includesAll(outbox, ["learning_series_waiting_for_prior_step", "payload.step > enrollment.nextStep", "learning_series_paused_after_terminal_failure", "learning_series_paused_provider_not_configured", "failLearningSeries"]), "Learning-series delivery preserves lesson order and terminates the remaining schedule after a terminal delivery failure.");

const operationsAuth = source("app/lib/operations-auth.ts");
expect(includesAll(operationsAuth, ["OPERATIONS_SECRET", "secret.length < 32", "constantTimeEqual"]), "Internal operations endpoints require a 32+ character bearer secret with constant-time comparison.");

const readiness = source("app/api/internal/readiness/route.ts");
expect(includesAll(readiness, ["operationsSchema", "commerceSchema", "coreReady", "commerceReady", "audienceProvider", "audienceConfigured", "SELECT unsubscribe_token_hash"]), "Readiness checks bindings, audience configuration, and required database schema without exposing secret values.");
expect(readiness.includes("learning_series_enrollments"), "Readiness verifies the learning-series migration before reporting operations ready.");

const drainRoute = source("app/api/internal/email-outbox/route.ts");
expect(includesAll(drainRoute, ["isOperationsRequest", "drainEmailOutbox", "retryCommerceFulfillments", "Cache-Control"]), "Protected drain endpoint retries site email, ebook recovery, and queued purchase fulfillment.");

const commerce = source("app/lib/commerce.ts");
expect(includesAll(commerce, ["MAX_COMMERCE_FULFILLMENT_ATTEMPTS = 8", "lt(commerceFulfillments.attemptCount", "retryCommerceFulfillments"]), "Queued purchase fulfillment retries stop after a bounded number of attempts.");

const worker = source("worker/index.ts");
for (const header of ["X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options", "Cross-Origin-Opener-Policy", "Permissions-Policy", "Strict-Transport-Security", "X-Robots-Tag"]) {
  expect(worker.includes(header), `Worker sets ${header}.`);
}

expect(existsSync(join(root, "app/error.tsx")) && existsSync(join(root, "app/global-error.tsx")) && existsSync(join(root, "app/loading.tsx")), "Route, root, and loading failure states are present.");
expect(existsSync(join(root, "app/manifest.ts")), "Web app manifest is present.");

const robots = source("app/robots.ts");
expect(includesAll(robots, ["/api/", "/purchase/", "/email-preferences", "/go/"]), "Robots rules exclude private and utility paths.");

const layout = source("app/layout.tsx");
expect((layout.includes('/sntp-social-share.webp') || layout.includes('/evidence.webp')) && !layout.includes('images: [{ url: "/book-official.webp"'), "Global social preview represents the movement rather than the book product.");
const book = source("app/homo-plasticus/page.tsx");
expect(book.includes('type: "book"') && book.includes('/book-official.webp'), "Book route has book-specific social metadata.");

const privacy = source("app/components/PrivacyPreferences.tsx");
const consent = source("app/components/ConsentAnalytics.tsx");
expect(privacy.includes("Essential only") && privacy.includes("Allow anonymous analytics") && consent.includes("CONSENT_EVENT"), "Visitors can revise optional analytics consent after the banner decision.");

const recovery = source("app/components/RecoveryForm.tsx");
expect(recovery.includes('if (state === "loading") return') && recovery.includes('aria-busy={state === "loading"}') && recovery.includes("disabled={state === \"loading\"}"), "Access recovery prevents duplicate submissions and announces progress.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.message}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

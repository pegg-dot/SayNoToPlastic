import { isOperationsRequest } from "../../../lib/operations-auth";

interface ReadinessEnv {
  DB?: D1Database;
  EBOOKS?: R2Bucket;
  COMMERCE_MODE?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_ID?: string;
  EBOOK_ACCESS_SECRET?: string;
  EBOOK_OBJECT_KEY?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  SUPPORT_EMAIL?: string;
  PUBLIC_SITE_URL?: string;
  AUDIENCE_PROVIDER?: string;
  MAILCHIMP_API_KEY?: string;
  MAILCHIMP_SERVER_PREFIX?: string;
  MAILCHIMP_AUDIENCE_ID?: string;
}

async function databaseChecks(database?: D1Database) {
  if (!database) return { connected: false, operationsSchema: false, commerceSchema: false };
  try {
    await database.prepare("SELECT 1 AS ok").first();
    let operationsSchema = false;
    let commerceSchema = false;
    try {
      await database.prepare("SELECT unsubscribe_token_hash, unsubscribed_at, updated_at FROM subscribers LIMIT 0").all();
      await database.prepare("SELECT claimed_at, attempt_count, last_error, next_attempt_at, updated_at FROM email_outbox LIMIT 0").all();
      await database.prepare("SELECT email, sequence_key, status, next_step, started_at, completed_at, updated_at FROM learning_series_enrollments LIMIT 0").all();
      operationsSchema = true;
    } catch {
      operationsSchema = false;
    }
    try {
      await database.prepare("SELECT access_state, fulfilled_at, refunded_at FROM commerce_orders LIMIT 0").all();
      await database.prepare("SELECT claimed_at, attempt_count, updated_at FROM commerce_fulfillments LIMIT 0").all();
      commerceSchema = true;
    } catch {
      commerceSchema = false;
    }
    return { connected: true, operationsSchema, commerceSchema };
  } catch {
    return { connected: false, operationsSchema: false, commerceSchema: false };
  }
}

export async function GET(request: Request) {
  if (!(await isOperationsRequest(request))) return Response.json({ error: "Not found." }, { status: 404 });
  const { env } = await import("cloudflare:workers");
  const runtime = env as unknown as ReadinessEnv;
  const database = await databaseChecks(runtime.DB);
  const commerceMode = runtime.COMMERCE_MODE || "woocommerce";
  const audienceProvider = ["resend", "mailchimp"].includes((runtime.AUDIENCE_PROVIDER || "").toLowerCase())
    ? (runtime.AUDIENCE_PROVIDER || "").toLowerCase()
    : "none";
  const audienceConfigured = audienceProvider === "resend"
    ? Boolean(runtime.RESEND_API_KEY)
    : audienceProvider === "mailchimp"
      ? Boolean(runtime.MAILCHIMP_API_KEY && runtime.MAILCHIMP_SERVER_PREFIX && runtime.MAILCHIMP_AUDIENCE_ID)
      : false;
  const checks = {
    databaseConnected: database.connected,
    operationsSchema: database.operationsSchema,
    commerceSchema: database.commerceSchema,
    privateEbookBinding: Boolean(runtime.EBOOKS),
    emailConfigured: Boolean(runtime.RESEND_API_KEY && runtime.RESEND_FROM_EMAIL && runtime.SUPPORT_EMAIL),
    audienceProvider,
    audienceConfigured,
    publicSiteUrlConfigured: Boolean(runtime.PUBLIC_SITE_URL),
    stripeConfigured: Boolean(runtime.STRIPE_SECRET_KEY && runtime.STRIPE_WEBHOOK_SECRET && runtime.STRIPE_PRICE_ID),
    ebookAccessConfigured: Boolean(runtime.EBOOK_ACCESS_SECRET && runtime.EBOOK_OBJECT_KEY),
  };
  const coreReady = checks.databaseConnected && checks.operationsSchema;
  const commerceReady = checks.databaseConnected
    && checks.commerceSchema
    && checks.privateEbookBinding
    && checks.emailConfigured
    && checks.publicSiteUrlConfigured
    && checks.stripeConfigured
    && checks.ebookAccessConfigured;
  const readyForCurrentMode = commerceMode === "stripe" ? commerceReady : coreReady;
  return Response.json({ ok: readyForCurrentMode, commerceMode, coreReady, commerceReady, checks }, {
    status: readyForCurrentMode ? 200 : 503,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

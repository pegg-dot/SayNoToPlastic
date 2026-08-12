import { and, asc, desc, eq, gte, inArray, lt, lte, or } from "drizzle-orm";
import { getDb } from "../../db";
import {
  commerceEvents,
  commerceFulfillments,
  commerceOrders,
  ebookDownloads,
  emailOutbox,
  recoveryRequests,
} from "../../db/schema";
import { BOOK } from "../config";
import { sendPurchaseAccess } from "./email-service";
import { readBodyText } from "./request-safety";

type R2ObjectBodyLike = {
  body: ReadableStream;
  httpEtag?: string;
  writeHttpMetadata?: (headers: Headers) => void;
};

type R2BucketLike = {
  get: (key: string) => Promise<R2ObjectBodyLike | null>;
};

type RuntimeCommerceEnv = {
  COMMERCE_MODE?: string;
  COMMERCE_PREVIEW_ENABLED?: string;
  PUBLIC_SITE_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_ID?: string;
  STRIPE_API_VERSION?: string;
  STRIPE_AUTOMATIC_TAX?: string;
  EBOOK_ACCESS_SECRET?: string;
  EBOOK_OBJECT_KEY?: string;
  EBOOK_DOWNLOAD_FILENAME?: string;
  RESEND_API_KEY?: string;
  EBOOKS?: R2BucketLike;
};

type StripeCheckoutSession = {
  id: string;
  url?: string | null;
  status?: string | null;
  payment_status?: string | null;
  payment_intent?: string | { id?: string } | null;
  amount_total?: number | null;
  currency?: string | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
};

type StripeCharge = {
  id: string;
  payment_intent?: string | { id?: string } | null;
  refunded?: boolean;
  amount_refunded?: number;
};

type StripePaymentIntent = {
  id: string;
  status?: string | null;
  metadata?: Record<string, string> | null;
};

type StripeEvent = {
  id: string;
  type: string;
  livemode?: boolean;
  data: { object: StripeCheckoutSession | StripeCharge | StripePaymentIntent };
};

type AccessChannel = "success" | "email" | "recovery";

type AccessPayload = {
  v: 1;
  orderId: string;
  exp: number;
  purpose: "ebook";
  channel: AccessChannel;
};

export type CheckoutResult = {
  mode: "stripe" | "woocommerce" | "preview";
  url: string;
  orderId?: string;
};

export type PurchaseSuccessState = {
  status: "ready" | "processing" | "configuration_error" | "invalid";
  orderId?: string;
  email?: string;
  accessUrl?: string;
  amountTotal?: number | null;
  currency?: string;
  message: string;
};

export type AccessPageState = {
  status: "ready" | "invalid" | "revoked" | "configuration_error";
  orderId?: string;
  email?: string;
  token?: string;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN_TOLERANCE_SECONDS = 5 * 60;
const FULFILLMENT_LEASE_MS = 5 * 60 * 1000;
const MAX_COMMERCE_FULFILLMENT_ATTEMPTS = 8;
const ACTIVE_ACCESS_STATUSES = new Set(["paid", "partially_refunded"]);

async function runtimeCommerceEnv(): Promise<RuntimeCommerceEnv> {
  try {
    const { env } = await import("cloudflare:workers");
    return env as unknown as RuntimeCommerceEnv;
  } catch {
    return process.env as unknown as RuntimeCommerceEnv;
  }
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sqliteTimestamp(date: Date) {
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

function parseStoredTimestamp(value: string) {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return Date.parse(normalized);
}

function commerceMode(env: RuntimeCommerceEnv): "stripe" | "woocommerce" | "preview" {
  const requested = env.COMMERCE_MODE?.trim().toLowerCase();
  if (requested === "stripe") return "stripe";
  if (requested === "preview" && env.COMMERCE_PREVIEW_ENABLED?.trim().toLowerCase() === "true") return "preview";
  return "woocommerce";
}

function requestOrigin(requestUrl: string, env: RuntimeCommerceEnv) {
  const configured = env.PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return new URL(requestUrl).origin;
}

function paymentIntentId(value: StripeCheckoutSession["payment_intent"] | StripeCharge["payment_intent"]) {
  if (typeof value === "string") return value;
  return value?.id || null;
}

function expectedStripeLivemode(env: RuntimeCommerceEnv) {
  if (env.STRIPE_SECRET_KEY?.startsWith("sk_live_")) return true;
  if (env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) return false;
  return null;
}

function hasActiveAccess(status: string, accessState: string) {
  return ACTIVE_ACCESS_STATUSES.has(status) && accessState !== "revoked";
}

function validatePaidSessionAmount(session: StripeCheckoutSession, env: RuntimeCommerceEnv) {
  const currency = cleanText(session.currency, 10).toLowerCase();
  if (currency !== BOOK.currency.toLowerCase()) throw new Error("commerce_currency_mismatch");
  if (typeof session.amount_total !== "number") throw new Error("commerce_amount_missing");
  const automaticTax = env.STRIPE_AUTOMATIC_TAX?.trim().toLowerCase() === "true";
  if (automaticTax ? session.amount_total < BOOK.amountCents : session.amount_total !== BOOK.amountCents) {
    throw new Error("commerce_amount_mismatch");
  }
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function sha256(value: string) {
  return bytesToHex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}

function requireStripeConfiguration(env: RuntimeCommerceEnv) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) throw new Error("stripe_checkout_not_configured");
  return { secretKey: env.STRIPE_SECRET_KEY, priceId: env.STRIPE_PRICE_ID };
}

function accessConfiguration(env: RuntimeCommerceEnv) {
  if (!env.EBOOK_ACCESS_SECRET || env.EBOOK_ACCESS_SECRET.length < 32) return null;
  if (!env.EBOOK_OBJECT_KEY || !env.EBOOKS) return null;
  return {
    secret: env.EBOOK_ACCESS_SECRET,
    objectKey: env.EBOOK_OBJECT_KEY,
    bucket: env.EBOOKS,
    filename: env.EBOOK_DOWNLOAD_FILENAME?.trim() || "Homo-Plasticus.pdf",
  };
}

async function stripeRequest<T>(env: RuntimeCommerceEnv, path: string, init?: { method?: "GET" | "POST"; body?: URLSearchParams; idempotencyKey?: string }) {
  const { secretKey } = requireStripeConfiguration(env);
  const response = await fetch(`https://api.stripe.com${path}`, {
    method: init?.method || "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(env.STRIPE_API_VERSION ? { "Stripe-Version": env.STRIPE_API_VERSION } : {}),
      ...(init?.body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(init?.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
    },
    body: init?.body,
  });
  const payload = await response.json() as T & { error?: { message?: string; type?: string } };
  if (!response.ok) {
    const detail = payload.error?.type || payload.error?.message || `stripe_${response.status}`;
    throw new Error(`stripe_request_failed:${detail}`);
  }
  return payload;
}

export async function createBookCheckout(request: Request, rawSource: unknown, rawAttemptId?: unknown): Promise<CheckoutResult> {
  const env = await runtimeCommerceEnv();
  const mode = commerceMode(env);
  if (mode === "preview") {
    const source = cleanText(rawSource, 120) || "unknown";
    return { mode: "preview", url: `/purchase/preview?source=${encodeURIComponent(source)}` };
  }
  if (mode !== "stripe") return { mode: "woocommerce", url: BOOK.legacyCheckoutUrl };

  const { priceId } = requireStripeConfiguration(env);
  const db = await getDb();
  const suppliedAttemptId = cleanText(rawAttemptId, 80);
  const orderId = UUID.test(suppliedAttemptId) ? suppliedAttemptId : crypto.randomUUID();
  const source = cleanText(rawSource, 120) || "unknown";
  const now = new Date().toISOString();
  const [created] = await db.insert(commerceOrders).values({
    id: orderId,
    productKey: BOOK.productKey,
    provider: "stripe",
    currency: BOOK.currency.toLowerCase(),
    source,
    status: "checkout_creating",
    accessState: "pending",
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing().returning({ id: commerceOrders.id });

  const origin = requestOrigin(request.url, env);
  if (!created) {
    const [existing] = await db.select().from(commerceOrders).where(eq(commerceOrders.id, orderId)).limit(1);
    if (!existing || existing.productKey !== BOOK.productKey) throw new Error("checkout_attempt_conflict");
    if (existing.providerSessionId) {
      const existingSession = await retrieveStripeCheckoutSession(env, existing.providerSessionId);
      const existingUrl = existingSession.url || `${origin}/purchase/success?session_id=${encodeURIComponent(existingSession.id)}`;
      return { mode: "stripe", url: existingUrl, orderId };
    }
  }

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("line_items[0][price]", priceId);
  body.set("line_items[0][quantity]", "1");
  body.set("client_reference_id", orderId);
  body.set("metadata[order_id]", orderId);
  body.set("metadata[product_key]", BOOK.productKey);
  body.set("payment_intent_data[metadata][order_id]", orderId);
  body.set("payment_intent_data[metadata][product_key]", BOOK.productKey);
  body.set("success_url", `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${origin}/homo-plasticus?checkout=cancelled`);
  body.set("customer_creation", "always");
  body.set("billing_address_collection", "auto");
  body.set("submit_type", "pay");
  if (env.STRIPE_AUTOMATIC_TAX?.trim().toLowerCase() === "true") body.set("automatic_tax[enabled]", "true");

  try {
    const session = await stripeRequest<StripeCheckoutSession>(env, "/v1/checkout/sessions", { method: "POST", body, idempotencyKey: `ebook-checkout:${orderId}` });
    if (!session.url) throw new Error("stripe_checkout_url_missing");
    await db.update(commerceOrders).set({ providerSessionId: session.id, status: "checkout_open", updatedAt: new Date().toISOString() }).where(eq(commerceOrders.id, orderId));
    return { mode: "stripe", url: session.url, orderId };
  } catch (error) {
    await db.update(commerceOrders).set({ status: "checkout_failed", updatedAt: new Date().toISOString() }).where(eq(commerceOrders.id, orderId));
    throw error;
  }
}

async function retrieveStripeCheckoutSession(env: RuntimeCommerceEnv, sessionId: string) {
  if (!/^cs_(?:test_|live_)?[A-Za-z0-9_]+$/.test(sessionId)) throw new Error("invalid_checkout_session_id");
  return stripeRequest<StripeCheckoutSession>(env, `/v1/checkout/sessions/${encodeURIComponent(sessionId)}`);
}

async function signAccessToken(orderId: string, channel: AccessChannel, expiresAtSeconds: number, env: RuntimeCommerceEnv) {
  const config = accessConfiguration(env);
  if (!config) throw new Error("ebook_access_not_configured");
  const payload: AccessPayload = {
    v: 1,
    orderId,
    exp: expiresAtSeconds,
    purpose: "ebook",
    channel,
  };
  const encodedPayload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = bytesToBase64Url(await hmac(config.secret, encodedPayload));
  return `${encodedPayload}.${signature}`;
}

async function verifyAccessToken(token: string, env: RuntimeCommerceEnv): Promise<AccessPayload | null> {
  const config = accessConfiguration(env);
  if (!config) return null;
  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra) return null;
  const expected = bytesToBase64Url(await hmac(config.secret, encodedPayload));
  if (!constantTimeEqual(encodedSignature, expected)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload))) as AccessPayload;
    if (
      payload.v !== 1
      || payload.purpose !== "ebook"
      || !payload.orderId
      || !payload.exp
      || !["success", "email", "recovery"].includes(payload.channel)
    ) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function createAccessUrl(
  orderId: string,
  channel: AccessChannel,
  origin: string,
  env: RuntimeCommerceEnv,
  lifetimeSeconds: number,
  anchorTimestamp?: string | null,
) {
  const parsedAnchor = anchorTimestamp ? parseStoredTimestamp(anchorTimestamp) : Number.NaN;
  const anchorMilliseconds = Number.isFinite(parsedAnchor) ? parsedAnchor : Date.now();
  const expiresAtSeconds = Math.floor(anchorMilliseconds / 1000) + lifetimeSeconds;
  const token = await signAccessToken(orderId, channel, expiresAtSeconds, env);
  return `${origin}/purchase/access?token=${encodeURIComponent(token)}`;
}

async function claimFulfillment(orderId: string, email: string, env: RuntimeCommerceEnv) {
  const db = await getDb();
  const now = new Date().toISOString();
  const [created] = await db.insert(commerceFulfillments).values({
    orderId,
    email,
    state: "sending",
    claimedAt: now,
    updatedAt: now,
    attemptCount: 1,
  }).onConflictDoNothing().returning({ orderId: commerceFulfillments.orderId });
  if (created) return true;

  const [existing] = await db.select({
    state: commerceFulfillments.state,
    claimedAt: commerceFulfillments.claimedAt,
    attemptCount: commerceFulfillments.attemptCount,
  }).from(commerceFulfillments).where(eq(commerceFulfillments.orderId, orderId)).limit(1);
  if (!existing) return false;
  if (existing.state === "queued" && !env.RESEND_API_KEY) return false;

  if (["failed", "queued"].includes(existing.state)) {
    const [claimed] = await db.update(commerceFulfillments).set({
      state: "sending",
      email,
      claimedAt: now,
      updatedAt: now,
      attemptCount: existing.attemptCount + 1,
      error: null,
    }).where(and(
      eq(commerceFulfillments.orderId, orderId),
      eq(commerceFulfillments.state, existing.state),
    )).returning({ orderId: commerceFulfillments.orderId });
    return Boolean(claimed);
  }

  const claimedAt = existing.claimedAt ? parseStoredTimestamp(existing.claimedAt) : Number.NaN;
  const staleSending = existing.state === "sending"
    && Number.isFinite(claimedAt)
    && Date.now() - claimedAt > FULFILLMENT_LEASE_MS;
  if (!staleSending || !existing.claimedAt) return false;
  const [reclaimed] = await db.update(commerceFulfillments).set({
    email,
    claimedAt: now,
    updatedAt: now,
    attemptCount: existing.attemptCount + 1,
    error: null,
  }).where(and(
    eq(commerceFulfillments.orderId, orderId),
    eq(commerceFulfillments.state, "sending"),
    eq(commerceFulfillments.claimedAt, existing.claimedAt),
  )).returning({ orderId: commerceFulfillments.orderId });
  return Boolean(reclaimed);
}

async function sendFulfillmentEmail(order: { id: string; customerEmail: string; amountTotal: number | null; currency: string; paidAt: string }, origin: string, env: RuntimeCommerceEnv) {
  if (!(await claimFulfillment(order.id, order.customerEmail, env))) return;
  const db = await getDb();
  let jobId: number | null = null;
  try {
    const accessUrl = await createAccessUrl(order.id, "email", origin, env, BOOK.delivery.emailLinkDays * 24 * 60 * 60, order.paidAt);
    const [job] = await db.insert(emailOutbox).values({
      kind: "ebook_access",
      recipient: order.customerEmail,
      payload: JSON.stringify({ orderId: order.id, channel: "initial", amountTotal: order.amountTotal, currency: order.currency }),
    }).returning({ id: emailOutbox.id });
    jobId = job?.id || null;

    const result = await sendPurchaseAccess({
      email: order.customerEmail,
      orderId: order.id,
      accessUrl,
      amountTotal: order.amountTotal,
      currency: order.currency,
      recovery: false,
      expiresInDays: BOOK.delivery.emailLinkDays,
      idempotencyKey: `ebook-access:${order.id}`,
    });
    if (!result.configured) {
      const queuedAt = new Date().toISOString();
      await db.update(commerceFulfillments).set({ state: "queued", updatedAt: queuedAt }).where(eq(commerceFulfillments.orderId, order.id));
      if (jobId) await db.update(emailOutbox).set({ status: "queued" }).where(eq(emailOutbox.id, jobId));
      await db.update(commerceOrders).set({ accessState: "email_queued", updatedAt: queuedAt }).where(eq(commerceOrders.id, order.id));
      return;
    }
    const sentAt = new Date().toISOString();
    await db.update(commerceFulfillments).set({ state: "sent", providerId: result.id, sentAt, updatedAt: sentAt }).where(eq(commerceFulfillments.orderId, order.id));
    if (jobId) await db.update(emailOutbox).set({ status: "sent", providerId: result.id, sentAt }).where(eq(emailOutbox.id, jobId));
    await db.update(commerceOrders).set({ accessState: "email_sent", updatedAt: sentAt }).where(eq(commerceOrders.id, order.id));
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 240) : "email_delivery_failed";
    const failedAt = new Date().toISOString();
    await db.update(commerceFulfillments).set({ state: "failed", error: message, updatedAt: failedAt }).where(eq(commerceFulfillments.orderId, order.id));
    if (jobId) await db.update(emailOutbox).set({ status: "failed" }).where(eq(emailOutbox.id, jobId));
    throw error;
  }
}

async function findOrderForSession(session: StripeCheckoutSession) {
  const db = await getDb();
  const metadataOrderId = cleanText(session.metadata?.order_id, 80);
  if (metadataOrderId) {
    const [order] = await db.select().from(commerceOrders).where(eq(commerceOrders.id, metadataOrderId)).limit(1);
    if (order) return order;
  }
  const [order] = await db.select().from(commerceOrders).where(eq(commerceOrders.providerSessionId, session.id)).limit(1);
  return order || null;
}

async function fulfillStripeSession(session: StripeCheckoutSession, origin: string, env: RuntimeCommerceEnv, strictEmailDelivery = true) {
  const order = await findOrderForSession(session);
  if (!order) throw new Error("commerce_order_not_found");
  if (order.productKey !== BOOK.productKey || (session.metadata?.product_key && session.metadata.product_key !== BOOK.productKey)) throw new Error("commerce_product_mismatch");

  const email = cleanText(session.customer_details?.email || session.customer_email, 254).toLowerCase();
  const amountTotal = typeof session.amount_total === "number" ? session.amount_total : order.amountTotal;
  const currency = cleanText(session.currency, 10).toLowerCase() || order.currency;
  if (order.status === "refunded" || order.accessState === "revoked") {
    return { orderId: order.id, email: email || order.customerEmail || "", amountTotal, currency, ready: false as const, revoked: true as const };
  }
  const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (paid) validatePaidSessionAmount(session, env);
  const now = new Date().toISOString();
  if (!paid) {
    await (await getDb()).update(commerceOrders).set({
      providerSessionId: session.id,
      providerPaymentIntentId: paymentIntentId(session.payment_intent),
      customerEmail: email || order.customerEmail,
      amountTotal,
      currency,
      status: "payment_processing",
      updatedAt: now,
    }).where(eq(commerceOrders.id, order.id));
    return {
      orderId: order.id,
      email,
      amountTotal,
      currency,
      ready: false as const,
    };
  }

  const config = accessConfiguration(env);
  const accessState = config
    ? (["email_sent", "email_queued"].includes(order.accessState) ? order.accessState : "ready")
    : "blocked_configuration";
  const paidStatus = order.status === "partially_refunded" ? "partially_refunded" : "paid";
  const db = await getDb();
  const paidAt = order.paidAt || now;
  await db.update(commerceOrders).set({
    providerSessionId: session.id,
    providerPaymentIntentId: paymentIntentId(session.payment_intent),
    customerEmail: email || order.customerEmail,
    amountTotal,
    currency,
    status: paidStatus,
    accessState,
    paidAt,
    fulfilledAt: config ? order.fulfilledAt || now : order.fulfilledAt,
    updatedAt: now,
  }).where(eq(commerceOrders.id, order.id));

  if (config && email) {
    try {
      await sendFulfillmentEmail({ id: order.id, customerEmail: email, amountTotal, currency, paidAt }, origin, env);
    } catch (error) {
      if (strictEmailDelivery) throw error;
      console.error("purchase_access_email_failed", error);
    }
  }
  return {
    orderId: order.id,
    email,
    amountTotal,
    currency,
    ready: Boolean(config),
  };
}

export async function completeStripeCheckout(sessionId: string, requestUrl: string): Promise<PurchaseSuccessState> {
  const env = await runtimeCommerceEnv();
  if (commerceMode(env) !== "stripe") {
    return { status: "invalid", message: "This purchase was completed through the legacy store. Use the access details from that order email." };
  }
  try {
    const session = await retrieveStripeCheckoutSession(env, cleanText(sessionId, 200));
    const origin = requestOrigin(requestUrl, env);
    const result = await fulfillStripeSession(session, origin, env, false);
    if ("revoked" in result && result.revoked) {
      return { status: "invalid", orderId: result.orderId, email: result.email, amountTotal: result.amountTotal, currency: result.currency, message: "This order was refunded or its access was revoked. Contact support if this appears incorrect." };
    }
    if (!result.ready) {
      if (session.payment_status === "unpaid") return { status: "processing", orderId: result.orderId, email: result.email, amountTotal: result.amountTotal, currency: result.currency, message: "Your payment is still processing. Access will be issued after Stripe confirms payment." };
      return { status: "configuration_error", orderId: result.orderId, email: result.email, amountTotal: result.amountTotal, currency: result.currency, message: "Payment was confirmed, but ebook delivery is not configured yet. Contact support with your order number." };
    }
    const accessUrl = await createAccessUrl(result.orderId, "success", origin, env, BOOK.delivery.successLinkDays * 24 * 60 * 60);
    return { status: "ready", orderId: result.orderId, email: result.email, accessUrl, amountTotal: result.amountTotal, currency: result.currency, message: "Payment confirmed. Your ebook is ready." };
  } catch (error) {
    console.error("checkout_completion_failed", error);
    return { status: "invalid", message: "We could not verify this checkout session. Use access recovery or contact support." };
  }
}

async function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const entries = signatureHeader.split(",").map((part) => part.trim().split("=", 2));
  const timestamp = entries.find(([key]) => key === "t")?.[1];
  const signatures = entries.filter(([key]) => key === "v1").map(([, value]) => value).filter((value): value is string => Boolean(value));
  if (!timestamp || signatures.length === 0) return false;
  const time = Number(timestamp);
  if (!Number.isFinite(time) || Math.abs(Math.floor(Date.now() / 1000) - time) > TOKEN_TOLERANCE_SECONDS) return false;
  const expected = bytesToHex(await hmac(secret, `${timestamp}.${payload}`));
  return signatures.some((signature) => constantTimeEqual(signature, expected));
}

async function markEventProcessed(eventRowId: number, orderId?: string | null) {
  const db = await getDb();
  await db.update(commerceEvents).set({ status: "processed", orderId: orderId || null, processedAt: new Date().toISOString(), error: null }).where(eq(commerceEvents.id, eventRowId));
}

async function markEventFailed(eventRowId: number, error: unknown) {
  const message = error instanceof Error ? error.message.slice(0, 400) : "commerce_event_failed";
  const db = await getDb();
  await db.update(commerceEvents).set({ status: "failed", error: message }).where(eq(commerceEvents.id, eventRowId));
}

export async function handleStripeWebhook(request: Request) {
  const env = await runtimeCommerceEnv();
  if (!env.STRIPE_WEBHOOK_SECRET) return Response.json({ error: "Webhook not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });
  let rawBody: string;
  try {
    rawBody = await readBodyText(request, 1_000_000);
  } catch {
    return Response.json({ error: "Payload too large." }, { status: 413 });
  }
  if (!(await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET))) return Response.json({ error: "Invalid signature." }, { status: 400 });

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }
  if (!event.id || !event.type || !event.data?.object) return Response.json({ error: "Invalid event." }, { status: 400 });
  const expectedLivemode = expectedStripeLivemode(env);
  if (expectedLivemode !== null && typeof event.livemode === "boolean" && event.livemode !== expectedLivemode) {
    return Response.json({ error: "Stripe mode mismatch." }, { status: 400 });
  }

  const db = await getDb();
  const [insertedEvent] = await db.insert(commerceEvents).values({
    provider: "stripe",
    providerEventId: event.id,
    eventType: event.type,
    payloadHash: await sha256(rawBody),
    status: "processing",
  }).onConflictDoNothing().returning({ id: commerceEvents.id });
  let eventRow = insertedEvent;
  if (!eventRow) {
    const [existing] = await db.select({ id: commerceEvents.id, status: commerceEvents.status, claimedAt: commerceEvents.claimedAt }).from(commerceEvents).where(and(eq(commerceEvents.provider, "stripe"), eq(commerceEvents.providerEventId, event.id))).limit(1);
    if (!existing) return Response.json({ error: "Event state unavailable." }, { status: 500 });
    const claimedAt = parseStoredTimestamp(existing.claimedAt);
    const staleProcessing = existing.status === "processing" && Number.isFinite(claimedAt) && Date.now() - claimedAt > 5 * 60 * 1000;
    if (existing.status === "failed" || existing.status === "received") {
      const [claimed] = await db.update(commerceEvents).set({ status: "processing", claimedAt: new Date().toISOString(), error: null }).where(and(eq(commerceEvents.id, existing.id), eq(commerceEvents.status, existing.status))).returning({ id: commerceEvents.id });
      if (claimed) eventRow = claimed;
    } else if (staleProcessing) {
      const [claimed] = await db.update(commerceEvents).set({ claimedAt: new Date().toISOString(), error: null }).where(and(eq(commerceEvents.id, existing.id), eq(commerceEvents.status, "processing"), eq(commerceEvents.claimedAt, existing.claimedAt))).returning({ id: commerceEvents.id });
      if (claimed) eventRow = claimed;
    }
    if (!eventRow) return Response.json({ received: true, duplicate: true, status: existing.status });
  }

  let orderId: string | null = null;
  try {
    const origin = requestOrigin(request.url, env);
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      const session = event.data.object as StripeCheckoutSession;
      const result = await fulfillStripeSession(session, origin, env);
      orderId = result.orderId;
    } else if (["checkout.session.async_payment_failed", "checkout.session.expired"].includes(event.type)) {
      const session = event.data.object as StripeCheckoutSession;
      const order = await findOrderForSession(session);
      if (order) {
        orderId = order.id;
        await db.update(commerceOrders).set({ status: event.type.endsWith("expired") ? "checkout_expired" : "payment_failed", updatedAt: new Date().toISOString() }).where(eq(commerceOrders.id, order.id));
      }
    } else if (["payment_intent.payment_failed", "payment_intent.canceled"].includes(event.type)) {
      const intent = event.data.object as StripePaymentIntent;
      const metadataOrderId = cleanText(intent.metadata?.order_id, 80);
      const [order] = metadataOrderId
        ? await db.select().from(commerceOrders).where(eq(commerceOrders.id, metadataOrderId)).limit(1)
        : await db.select().from(commerceOrders).where(eq(commerceOrders.providerPaymentIntentId, intent.id)).limit(1);
      if (order) {
        orderId = order.id;
        await db.update(commerceOrders).set({
          providerPaymentIntentId: intent.id,
          status: event.type.endsWith("canceled") ? "payment_canceled" : "payment_failed",
          updatedAt: new Date().toISOString(),
        }).where(eq(commerceOrders.id, order.id));
      }
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as StripeCharge;
      const intentId = paymentIntentId(charge.payment_intent);
      if (intentId) {
        const [order] = await db.select().from(commerceOrders).where(eq(commerceOrders.providerPaymentIntentId, intentId)).limit(1);
        if (order) {
          orderId = order.id;
          const now = new Date().toISOString();
          const fullyRefunded = charge.refunded === true || (typeof charge.amount_refunded === "number" && typeof order.amountTotal === "number" && charge.amount_refunded >= order.amountTotal);
          await db.update(commerceOrders).set({
            status: fullyRefunded ? "refunded" : "partially_refunded",
            accessState: fullyRefunded ? "revoked" : order.accessState,
            refundedAt: fullyRefunded ? now : order.refundedAt,
            updatedAt: now,
          }).where(eq(commerceOrders.id, order.id));
        }
      }
    }
    await markEventProcessed(eventRow.id, orderId);
    return Response.json({ received: true });
  } catch (error) {
    await markEventFailed(eventRow.id, error);
    console.error("stripe_webhook_failed", error);
    return Response.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

export async function getAccessPageState(rawToken: unknown): Promise<AccessPageState> {
  const token = cleanText(rawToken, 4_000);
  const env = await runtimeCommerceEnv();
  if (!accessConfiguration(env)) return { status: "configuration_error", message: "Ebook delivery is not configured. Contact support with your order number." };
  const payload = await verifyAccessToken(token, env);
  if (!payload) return { status: "invalid", message: "This access link is invalid or expired. Request a new link below." };
  const db = await getDb();
  const [order] = await db.select().from(commerceOrders).where(eq(commerceOrders.id, payload.orderId)).limit(1);
  if (!order) return { status: "invalid", message: "This access link could not be verified. Request a new link below." };
  if (order.status === "refunded" || order.accessState === "revoked") return { status: "revoked", orderId: order.id, message: "Access for this order is no longer active. Contact support if this appears incorrect." };
  if (!hasActiveAccess(order.status, order.accessState)) return { status: "invalid", orderId: order.id, message: "Payment for this order has not been confirmed." };
  return { status: "ready", orderId: order.id, email: order.customerEmail || undefined, token, message: "Your verified ebook copy is ready to download." };
}

export async function downloadEbook(rawToken: unknown) {
  const token = cleanText(rawToken, 4_000);
  const env = await runtimeCommerceEnv();
  const config = accessConfiguration(env);
  if (!config) return new Response("Ebook delivery is not configured.", { status: 503 });
  const payload = await verifyAccessToken(token, env);
  if (!payload) return new Response("Access link is invalid or expired.", { status: 403 });
  const db = await getDb();
  const [order] = await db.select().from(commerceOrders).where(eq(commerceOrders.id, payload.orderId)).limit(1);
  if (!order || !hasActiveAccess(order.status, order.accessState)) return new Response("Access is not available for this order.", { status: 403 });

  const object = await config.bucket.get(config.objectKey);
  if (!object) return new Response("The ebook file is not available. Contact support with your order number.", { status: 503 });
  await db.insert(ebookDownloads).values({ orderId: order.id, channel: payload.channel });

  const headers = new Headers();
  object.writeHttpMetadata?.(headers);
  if (object.httpEtag) headers.set("ETag", object.httpEtag);
  headers.set("Content-Type", headers.get("Content-Type") || "application/pdf");
  headers.set("Content-Disposition", `attachment; filename="${config.filename.replace(/["\\\r\n]/g, "-")}"`);
  headers.set("Cache-Control", "private, no-store");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(object.body, { status: 200, headers });
}

async function recoveryHash(email: string, env: RuntimeCommerceEnv) {
  const config = accessConfiguration(env);
  if (!config) throw new Error("ebook_access_not_configured");
  return bytesToHex(await hmac(config.secret, `recovery:${email}`));
}

export async function sendRecoveryAccessEmail(input: {
  email: string;
  orderId: string;
  siteOrigin: string;
  issuedAt: string;
  idempotencyKey: string;
}) {
  const env = await runtimeCommerceEnv();
  const config = accessConfiguration(env);
  if (!config) return { configured: false, id: null as string | null, skipped: false };
  const db = await getDb();
  const [order] = await db.select().from(commerceOrders).where(and(
    eq(commerceOrders.id, input.orderId),
    eq(commerceOrders.customerEmail, input.email),
  )).limit(1);
  if (!order || !hasActiveAccess(order.status, order.accessState)) {
    return { configured: true, id: null as string | null, skipped: true };
  }
  const accessUrl = await createAccessUrl(
    order.id,
    "recovery",
    input.siteOrigin,
    env,
    BOOK.delivery.emailLinkDays * 24 * 60 * 60,
    input.issuedAt,
  );
  const result = await sendPurchaseAccess({
    email: input.email,
    orderId: order.id,
    accessUrl,
    amountTotal: order.amountTotal,
    currency: order.currency,
    recovery: true,
    expiresInDays: BOOK.delivery.emailLinkDays,
    idempotencyKey: input.idempotencyKey,
  });
  return { ...result, skipped: false };
}

export async function recoverBookAccess(input: { email: unknown; orderId?: unknown; requestUrl: string }) {
  const email = cleanText(input.email, 254).toLowerCase();
  const requestedOrderId = cleanText(input.orderId, 80);
  if (!EMAIL.test(email)) return;
  const env = await runtimeCommerceEnv();
  const config = accessConfiguration(env);
  if (!config) {
    console.error("ebook_recovery_not_configured");
    return;
  }
  const db = await getDb();
  const emailHash = await recoveryHash(email, env);
  const since = sqliteTimestamp(new Date(Date.now() - 15 * 60 * 1000));
  const createdAt = sqliteTimestamp(new Date());
  const recent = await db.select({ id: recoveryRequests.id }).from(recoveryRequests).where(and(eq(recoveryRequests.emailHash, emailHash), gte(recoveryRequests.createdAt, since))).limit(3);
  if (recent.length >= 3) {
    await db.insert(recoveryRequests).values({ emailHash, orderId: requestedOrderId || null, status: "rate_limited", createdAt });
    return;
  }

  const [requestRow] = await db.insert(recoveryRequests).values({ emailHash, orderId: requestedOrderId || null, status: "received", createdAt }).returning({ id: recoveryRequests.id });
  const activeStatus = or(eq(commerceOrders.status, "paid"), eq(commerceOrders.status, "partially_refunded"));
  const conditions = requestedOrderId
    ? and(eq(commerceOrders.id, requestedOrderId), eq(commerceOrders.customerEmail, email), activeStatus)
    : and(eq(commerceOrders.customerEmail, email), activeStatus);
  const [order] = await db.select().from(commerceOrders).where(conditions).orderBy(desc(commerceOrders.createdAt)).limit(1);
  if (!order || order.accessState === "revoked") {
    if (requestRow?.id) await db.update(recoveryRequests).set({ status: "not_found" }).where(eq(recoveryRequests.id, requestRow.id));
    return;
  }

  const origin = requestOrigin(input.requestUrl, env);
  const [job] = await db.insert(emailOutbox).values({
    kind: "ebook_recovery",
    recipient: email,
    status: "pending",
    payload: JSON.stringify({ orderId: order.id, requestId: requestRow?.id || null, siteOrigin: origin, issuedAt: createdAt }),
    updatedAt: createdAt,
  }).returning({ id: emailOutbox.id });
  if (!job?.id) {
    if (requestRow?.id) await db.update(recoveryRequests).set({ status: "failed" }).where(eq(recoveryRequests.id, requestRow.id));
    return;
  }
  const { deliverEmailOutboxJob } = await import("./email-outbox");
  await deliverEmailOutboxJob(job.id);
}

export async function retryCommerceFulfillments(limit = 10) {
  const env = await runtimeCommerceEnv();
  const db = await getDb();
  const staleBefore = sqliteTimestamp(new Date(Date.now() - FULFILLMENT_LEASE_MS));
  const rows = await db.select({
    orderId: commerceFulfillments.orderId,
    state: commerceFulfillments.state,
    updatedAt: commerceFulfillments.updatedAt,
  }).from(commerceFulfillments).where(and(
    lt(commerceFulfillments.attemptCount, MAX_COMMERCE_FULFILLMENT_ATTEMPTS),
    or(
      inArray(commerceFulfillments.state, ["queued", "failed"]),
      and(eq(commerceFulfillments.state, "sending"), lte(commerceFulfillments.claimedAt, staleBefore)),
    ),
  )).orderBy(asc(commerceFulfillments.updatedAt)).limit(Math.max(1, Math.min(50, limit)));

  const summary = { selected: rows.length, sent: 0, queued: 0, failed: 0, skipped: 0 };
  const origin = requestOrigin(env.PUBLIC_SITE_URL || "https://saynotoplastic.com", env);
  for (const row of rows) {
    const [order] = await db.select().from(commerceOrders).where(eq(commerceOrders.id, row.orderId)).limit(1);
    if (!order || !order.customerEmail || !order.paidAt || !hasActiveAccess(order.status, order.accessState)) {
      summary.skipped += 1;
      continue;
    }
    try {
      await sendFulfillmentEmail({
        id: order.id,
        customerEmail: order.customerEmail,
        amountTotal: order.amountTotal,
        currency: order.currency,
        paidAt: order.paidAt,
      }, origin, env);
    } catch (error) {
      console.error("commerce_fulfillment_retry_failed", { orderId: order.id, error });
    }
    const [latest] = await db.select({ state: commerceFulfillments.state }).from(commerceFulfillments).where(eq(commerceFulfillments.orderId, order.id)).limit(1);
    if (latest?.state === "sent") summary.sent += 1;
    else if (latest?.state === "queued") summary.queued += 1;
    else if (latest?.state === "failed") summary.failed += 1;
    else summary.skipped += 1;
  }
  return summary;
}


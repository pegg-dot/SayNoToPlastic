import type { LearningSeriesItem } from "../content/community-programs";

type RuntimeEnv = {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  SUPPORT_EMAIL?: string;
  PUBLIC_SITE_URL?: string;
};

type ResendResult = {
  configured: boolean;
  id?: string | null;
  status?: number;
  conflict?: boolean;
};

async function runtimeEnv(): Promise<RuntimeEnv> {
  try {
    const { env } = await import("cloudflare:workers");
    return env as unknown as RuntimeEnv;
  } catch {
    return process.env as unknown as RuntimeEnv;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

async function resend(
  path: string,
  body: Record<string, unknown>,
  options: { method?: "POST" | "PATCH"; idempotencyKey?: string; allowConflict?: boolean } = {},
): Promise<ResendResult> {
  const env = await runtimeEnv();
  if (!env.RESEND_API_KEY) return { configured: false };
  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey.slice(0, 256);
  const response = await fetch(`https://api.resend.com${path}`, {
    method: options.method || "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (response.status === 409 && options.allowConflict) {
    return { configured: true, status: response.status, conflict: true, id: null };
  }
  if (!response.ok) throw new Error(`email_provider_${response.status}`);
  const data = await response.json() as { id?: string };
  return { configured: true, status: response.status, id: data.id || null };
}

export async function sendWelcome(input: {
  email: string;
  firstName: string;
  unsubscribeUrl: string;
  oneClickUrl: string;
  idempotencyKey: string;
}) {
  const env = await runtimeEnv();
  const from = env.RESEND_FROM_EMAIL || "Say No to Plastic <updates@saynotoplastic.com>";
  const siteUrl = env.PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://saynotoplastic.com";
  return resend("/emails", {
    from,
    to: [input.email],
    subject: "Welcome to Say No to Plastic",
    headers: {
      "List-Unsubscribe": `<${input.oneClickUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: `<div style="font-family:Georgia,serif;color:#111;line-height:1.65;max-width:620px;margin:auto"><p style="font:12px Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#9a6d32">Science. Clarity. Action.</p><h1 style="font-size:42px;font-weight:400">Welcome, ${escapeHtml(input.firstName)}.</h1><p>You are now part of a physician-led effort to understand plastic exposure with rigor and respond with practical action.</p><p>We will send evidence updates, useful household guidance, and new work from Say No to Plastic. Every message will keep uncertainty visible and action realistic.</p><p><a href="${escapeHtml(`${siteUrl}/resources`)}" style="color:#8a5f28">Begin in the reading room</a></p><p style="font-size:13px;color:#666">This is educational information and does not provide personal medical advice.</p><p style="font-size:12px;color:#777">You requested these field notes. <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#777">Unsubscribe or review your email preference</a>.</p></div>`,
  }, { idempotencyKey: input.idempotencyKey });
}

export async function sendContactNotification(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
  idempotencyKey: string;
}) {
  const env = await runtimeEnv();
  const from = env.RESEND_FROM_EMAIL || "Say No to Plastic <updates@saynotoplastic.com>";
  const support = env.SUPPORT_EMAIL || "support@saynotoplastic.com";
  return resend("/emails", {
    from,
    to: [support],
    reply_to: input.email,
    subject: `[Say No to Plastic] ${input.topic}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h1>New ${escapeHtml(input.topic)} inquiry</h1><p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p><p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p></div>`,
  }, { idempotencyKey: input.idempotencyKey });
}
export async function sendPurchaseAccess(input: {
  email: string;
  orderId: string;
  accessUrl: string;
  amountTotal: number | null;
  currency: string;
  recovery: boolean;
  expiresInDays: number;
  idempotencyKey: string;
}) {
  const env = await runtimeEnv();
  const from = env.RESEND_FROM_EMAIL || "Homo Plasticus <updates@saynotoplastic.com>";
  const amount = typeof input.amountTotal === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: input.currency.toUpperCase() }).format(input.amountTotal / 100)
    : null;
  const subject = input.recovery ? "Your Homo Plasticus access link" : "Your Homo Plasticus ebook is ready";
  const intro = input.recovery
    ? "A new access link was requested for this purchase."
    : "Payment has been confirmed and your digital edition is ready.";
  let siteUrl = env.PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://saynotoplastic.com";
  try {
    siteUrl = new URL(input.accessUrl).origin;
  } catch {
    // Keep the configured public site URL when a malformed URL is supplied.
  }
  const support = env.SUPPORT_EMAIL || "support@saynotoplastic.com";
  return resend("/emails", {
    from,
    to: [input.email],
    reply_to: support,
    subject,
    html: `<div style="font-family:Georgia,serif;color:#111;line-height:1.65;max-width:620px;margin:auto"><p style="font:12px Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#9a6d32">Homo Plasticus · Digital edition</p><h1 style="font-size:42px;font-weight:400">Your ebook is ready.</h1><p>${intro}</p><p><a href="${escapeHtml(input.accessUrl)}" style="display:inline-block;background:#b7843f;color:#07111d;padding:15px 22px;text-decoration:none;font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">Open your secure access page</a></p><p><strong>Order:</strong> ${escapeHtml(input.orderId)}${amount ? `<br><strong>Total:</strong> ${escapeHtml(amount)}` : ""}</p><p>This link expires in ${escapeHtml(String(input.expiresInDays))} days. You can request a fresh link at <a href="${escapeHtml(`${siteUrl}/purchase/recover`)}" style="color:#8a5f28">${escapeHtml(`${siteUrl}/purchase/recover`)}</a>.</p><p style="font-size:13px;color:#666">Keep this message for your records. For payment or access support, reply to this email or contact ${escapeHtml(support)}.</p></div>`,
  }, { idempotencyKey: input.idempotencyKey });
}

export async function sendLearningSeriesEmail(input: {
  email: string;
  firstName: string;
  item: LearningSeriesItem;
  siteOrigin: string;
  unsubscribeUrl: string;
  oneClickUrl: string;
  idempotencyKey: string;
}) {
  const env = await runtimeEnv();
  const from = env.RESEND_FROM_EMAIL || "Say No to Plastic <updates@saynotoplastic.com>";
  const siteUrl = input.siteOrigin.replace(/\/$/, "") || env.PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://saynotoplastic.com";
  const readingUrl = `${siteUrl}${input.item.href}`;
  return resend("/emails", {
    from,
    to: [input.email],
    subject: input.item.emailSubject,
    headers: {
      "List-Unsubscribe": `<${input.oneClickUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: `<div style="font-family:Georgia,serif;color:#111;line-height:1.68;max-width:640px;margin:auto"><p style="font:12px Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#9a6d32">Say No to Plastic · Field Note ${escapeHtml(input.item.number)} of 10</p><h1 style="font-size:40px;line-height:1.08;font-weight:400">${escapeHtml(input.item.title)}</h1><p style="font-style:italic;color:#8a5f28">${escapeHtml(input.item.eyebrow)}</p><p>Hello ${escapeHtml(input.firstName)},</p><p>${escapeHtml(input.item.emailLead)}</p><div style="border-left:3px solid #b7843f;background:#f3eee5;padding:18px 20px;margin:24px 0"><strong style="display:block;font:12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8a5f28;margin-bottom:8px">Carry forward</strong><span>${escapeHtml(input.item.carryForward)}</span></div><p><a href="${escapeHtml(readingUrl)}" style="display:inline-block;background:#07111d;color:#fff;padding:14px 20px;text-decoration:none;font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">Open the full reading</a></p><p style="font-size:13px;color:#666">This is general educational information. It does not diagnose, treat, or replace advice from a qualified healthcare professional.</p><p style="font-size:12px;color:#777">You enrolled in the ten-part Say No to Plastic learning series. <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#777">Unsubscribe or review your email preference</a>.</p></div>`,
  }, { idempotencyKey: input.idempotencyKey });
}

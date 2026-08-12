type AudienceProvider = "none" | "resend" | "mailchimp";

type AudienceEnv = {
  AUDIENCE_PROVIDER?: string;
  RESEND_API_KEY?: string;
  MAILCHIMP_API_KEY?: string;
  MAILCHIMP_SERVER_PREFIX?: string;
  MAILCHIMP_AUDIENCE_ID?: string;
};

export type AudienceResult = {
  configured: boolean;
  provider: AudienceProvider;
  id?: string | null;
  status?: number;
};

async function runtimeEnv(): Promise<AudienceEnv> {
  try {
    const { env } = await import("cloudflare:workers");
    return env as unknown as AudienceEnv;
  } catch {
    return process.env as unknown as AudienceEnv;
  }
}

export function resolveAudienceProvider(value?: string): AudienceProvider {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "resend" || normalized === "mailchimp") return normalized;
  return "none";
}

// Mailchimp identifies a member by the MD5 digest of the lowercased email.
// Kept dependency-free so it works in the Worker and in local validation.
export function mailchimpSubscriberHash(email: string) {
  const input = new TextEncoder().encode(email.trim().toLowerCase());
  const bitLength = input.length * 8;
  const paddedLength = Math.ceil((input.length + 9) / 64) * 64;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(input);
  bytes[input.length] = 0x80;
  const view = new DataView(bytes.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const constants = Array.from({ length: 64 }, (_, index) =>
    Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0,
  );
  const rotateLeft = (value: number, amount: number) => ((value << amount) | (value >>> (32 - amount))) >>> 0;

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = Array.from({ length: 16 }, (_, index) => view.getUint32(offset + index * 4, true));
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    for (let index = 0; index < 64; index += 1) {
      let f: number;
      let wordIndex: number;
      if (index < 16) {
        f = (b & c) | (~b & d);
        wordIndex = index;
      } else if (index < 32) {
        f = (d & b) | (~d & c);
        wordIndex = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        wordIndex = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        wordIndex = (7 * index) % 16;
      }
      const nextD = c;
      c = b;
      const sum = (a + f + constants[index] + words[wordIndex]) >>> 0;
      b = (b + rotateLeft(sum, shifts[index])) >>> 0;
      a = d;
      d = nextD;
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  return [a0, b0, c0, d0]
    .flatMap((value) => [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff])
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function basicAuthorization(apiKey: string) {
  return `Basic ${btoa(`say-no-to-plastic:${apiKey}`)}`;
}

async function mailchimpRequest(
  env: AudienceEnv,
  path: string,
  body: Record<string, unknown>,
  method: "PUT" | "PATCH",
): Promise<AudienceResult> {
  if (!env.MAILCHIMP_API_KEY || !env.MAILCHIMP_SERVER_PREFIX || !env.MAILCHIMP_AUDIENCE_ID) {
    return { configured: false, provider: "mailchimp" };
  }
  const response = await fetch(`https://${env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0${path}`, {
    method,
    headers: {
      Authorization: basicAuthorization(env.MAILCHIMP_API_KEY),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`mailchimp_audience_${response.status}`);
  const data = await response.json() as { id?: string };
  return { configured: true, provider: "mailchimp", status: response.status, id: data.id || null };
}

async function resendContactRequest(
  env: AudienceEnv,
  path: string,
  body: Record<string, unknown>,
  method: "POST" | "PATCH",
  allowConflict = false,
): Promise<AudienceResult & { conflict?: boolean }> {
  if (!env.RESEND_API_KEY) return { configured: false, provider: "resend" };
  const response = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (allowConflict && response.status === 409) {
    return { configured: true, provider: "resend", conflict: true, status: 409, id: null };
  }
  if (!response.ok) throw new Error(`resend_audience_${response.status}`);
  const data = await response.json() as { id?: string };
  return { configured: true, provider: "resend", status: response.status, id: data.id || null };
}

export async function audienceConfiguration() {
  const env = await runtimeEnv();
  const provider = resolveAudienceProvider(env.AUDIENCE_PROVIDER);
  const configured = provider === "resend"
    ? Boolean(env.RESEND_API_KEY)
    : provider === "mailchimp"
      ? Boolean(env.MAILCHIMP_API_KEY && env.MAILCHIMP_SERVER_PREFIX && env.MAILCHIMP_AUDIENCE_ID)
      : false;
  return { provider, configured };
}

export async function syncAudienceSubscriber(input: { email: string; firstName: string; source: string }) {
  const env = await runtimeEnv();
  const provider = resolveAudienceProvider(env.AUDIENCE_PROVIDER);
  if (provider === "none") return { configured: false, provider } satisfies AudienceResult;
  if (provider === "mailchimp") {
    const hash = mailchimpSubscriberHash(input.email);
    return mailchimpRequest(
      env,
      `/lists/${encodeURIComponent(env.MAILCHIMP_AUDIENCE_ID || "")}/members/${hash}`,
      {
        email_address: input.email,
        status_if_new: "subscribed",
        status: "subscribed",
        merge_fields: { FNAME: input.firstName },
      },
      "PUT",
    );
  }

  const properties = { source: input.source, joined_at: new Date().toISOString() };
  const created = await resendContactRequest(
    env,
    "/contacts",
    { email: input.email, first_name: input.firstName, unsubscribed: false, properties },
    "POST",
    true,
  );
  if (!created.configured || !created.conflict) return created;
  return resendContactRequest(
    env,
    `/contacts/${encodeURIComponent(input.email)}`,
    { first_name: input.firstName, unsubscribed: false, properties },
    "PATCH",
  );
}

export async function unsubscribeAudienceSubscriber(email: string) {
  const env = await runtimeEnv();
  const provider = resolveAudienceProvider(env.AUDIENCE_PROVIDER);
  if (provider === "none") return { configured: false, provider } satisfies AudienceResult;
  if (provider === "mailchimp") {
    const hash = mailchimpSubscriberHash(email);
    return mailchimpRequest(
      env,
      `/lists/${encodeURIComponent(env.MAILCHIMP_AUDIENCE_ID || "")}/members/${hash}`,
      { status: "unsubscribed" },
      "PATCH",
    );
  }
  return resendContactRequest(
    env,
    `/contacts/${encodeURIComponent(email)}`,
    { unsubscribed: true },
    "PATCH",
  );
}

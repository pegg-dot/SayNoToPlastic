const TOKEN_BYTES = 32;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{40,80}$/;

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

export function createUnsubscribeToken() {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export function unsubscribeTokenIsValid(token: unknown): token is string {
  return typeof token === "string" && TOKEN_PATTERN.test(token);
}

export async function hashUnsubscribeToken(token: string) {
  return bytesToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
}

export function publicSiteOrigin(requestUrl: string, configuredSiteUrl?: string) {
  const preferred = configuredSiteUrl?.trim();
  if (preferred) {
    try {
      const url = new URL(preferred);
      if (url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1") return url.origin;
    } catch {
      // Fall back to the request origin below.
    }
  }
  return new URL(requestUrl).origin;
}

export function unsubscribeUrls(siteOrigin: string, token: string) {
  const origin = siteOrigin.replace(/\/$/, "");
  const encoded = encodeURIComponent(token);
  return {
    preferences: `${origin}/email-preferences?token=${encoded}`,
    oneClick: `${origin}/api/subscription/unsubscribe?token=${encoded}`,
  };
}

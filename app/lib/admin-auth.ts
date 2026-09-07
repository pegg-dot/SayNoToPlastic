import { headers } from "next/headers";

const ADMIN_EMAILS = new Set([
  "dreliebeyondplastic@gmail.com",
  "pegg@gymfinityapp.com",
]);

type AccessJwtPayload = {
  aud?: string | string[];
  email?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  nbf?: number;
  sub?: string;
};

type AccessJwk = JsonWebKey & { kid?: string };
type AccessJwks = { keys?: AccessJwk[] };

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function decodeJsonPart<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(value))) as T;
}

function normalizeTeamDomain(value: string) {
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed) return "";
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function audienceMatches(payload: AccessJwtPayload, expected: string) {
  const audiences = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
  return audiences.includes(expected);
}

async function runtimeAdminEnv() {
  try {
    const { env } = await import("cloudflare:workers");
    return env as unknown as Record<string, string | undefined>;
  } catch {
    return process.env as Record<string, string | undefined>;
  }
}

async function verifyAccessJwt(token: string, teamDomain: string, expectedAudience: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const jwtHeader = decodeJsonPart<{ alg?: string; kid?: string }>(encodedHeader);
  if (jwtHeader.alg !== "RS256" || !jwtHeader.kid) return null;

  const base = normalizeTeamDomain(teamDomain);
  if (!base) return null;

  const response = await fetch(`${base}/cdn-cgi/access/certs`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;

  const jwks = await response.json() as AccessJwks;
  const jwk = jwks.keys?.find((candidate) => candidate.kid === jwtHeader.kid);
  if (!jwk) return null;

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );
  if (!verified) return null;

  const payload = decodeJsonPart<AccessJwtPayload>(encodedPayload);
  const now = Math.floor(Date.now() / 1000);
  if (!payload.email || !payload.exp || payload.exp <= now) return null;
  if (payload.nbf && payload.nbf > now) return null;
  if (!audienceMatches(payload, expectedAudience)) return null;
  if (payload.iss && payload.iss.replace(/\/$/, "") !== base) return null;

  const email = payload.email.trim().toLowerCase();
  if (!ADMIN_EMAILS.has(email)) return null;

  return { email, subject: payload.sub ?? null };
}

export async function getAdminUser() {
  const requestHeaders = await headers();
  const token = requestHeaders.get("cf-access-jwt-assertion");
  if (!token) return null;

  const env = await runtimeAdminEnv();
  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN?.trim();
  const audience = env.CF_ACCESS_AUD?.trim();
  if (!teamDomain || !audience) return null;

  try {
    return await verifyAccessJwt(token, teamDomain, audience);
  } catch (error) {
    console.error("admin_access_verification_failed", error);
    return null;
  }
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) throw new Error("ADMIN_ACCESS_DENIED");
  return user;
}

export function adminAllowlist() {
  return Array.from(ADMIN_EMAILS);
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function bodyIsReasonable(request: Request, maxBytes = 12_000) {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) return true;
  const length = Number(rawLength);
  return Number.isFinite(length) && length >= 0 && length <= maxBytes;
}

export async function readBodyText(request: Request, maxBytes = 12_000) {
  if (!bodyIsReasonable(request, maxBytes)) throw new Error("request_body_too_large");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new Error("request_body_too_large");
  return text;
}

export async function readJsonBody<T>(request: Request, maxBytes = 12_000): Promise<T> {
  const text = await readBodyText(request, maxBytes);
  return JSON.parse(text) as T;
}

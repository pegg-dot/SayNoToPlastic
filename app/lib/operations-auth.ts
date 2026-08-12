type OperationsEnv = { OPERATIONS_SECRET?: string };

async function operationsSecret() {
  try {
    const { env } = await import("cloudflare:workers");
    return (env as unknown as OperationsEnv).OPERATIONS_SECRET || "";
  } catch {
    return process.env.OPERATIONS_SECRET || "";
  }
}

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  const length = Math.max(a.length, b.length);
  let mismatch = a.length ^ b.length;
  for (let index = 0; index < length; index += 1) mismatch |= (a[index] || 0) ^ (b[index] || 0);
  return mismatch === 0;
}

export async function isOperationsRequest(request: Request) {
  const secret = await operationsSecret();
  if (secret.length < 32) return false;
  const provided = request.headers.get("authorization") || "";
  return constantTimeEqual(provided, `Bearer ${secret}`);
}

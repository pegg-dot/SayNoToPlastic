import { recoverBookAccess } from "../../../lib/commerce";
import { isSameOrigin, readJsonBody } from "../../../lib/request-safety";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Request rejected." }, { status: 400 });
  try {
    const payload = await readJsonBody<{ email?: unknown; orderId?: unknown; website?: unknown }>(request, 4_000);
    if (!(typeof payload.website === "string" && payload.website.trim())) {
      await recoverBookAccess({ email: payload.email, orderId: payload.orderId, requestUrl: request.url });
    }
    return Response.json({ ok: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("purchase_recovery_failed", error);
    return Response.json({ ok: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
  }
}

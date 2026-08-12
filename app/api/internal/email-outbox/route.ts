import { retryCommerceFulfillments } from "../../../lib/commerce";
import { drainEmailOutbox } from "../../../lib/email-outbox";
import { isOperationsRequest } from "../../../lib/operations-auth";

export async function POST(request: Request) {
  if (!(await isOperationsRequest(request))) return Response.json({ error: "Not found." }, { status: 404 });
  const limitValue = Number(new URL(request.url).searchParams.get("limit") || "10");
  const limit = Number.isFinite(limitValue) ? Math.max(1, Math.min(50, limitValue)) : 10;
  const siteEmail = await drainEmailOutbox(limit);
  const commerceFulfillment = await retryCommerceFulfillments(limit);
  return Response.json({ ok: true, summary: { siteEmail, commerceFulfillment } }, { headers: { "Cache-Control": "no-store" } });
}

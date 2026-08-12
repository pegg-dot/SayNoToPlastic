import { createBookCheckout } from "../../lib/commerce";
import { isSameOrigin, readJsonBody } from "../../lib/request-safety";

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) return Response.json({ error: "Request rejected." }, { status: 400 });
    const payload = await readJsonBody<{ source?: unknown; attemptId?: unknown; website?: unknown }>(request, 4_000);
    if (typeof payload.website === "string" && payload.website.trim()) return Response.json({ error: "Request rejected." }, { status: 400 });
    const result = await createBookCheckout(request, payload.source, payload.attemptId);
    return Response.json(result, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("checkout_creation_failed", error);
    const message = error instanceof Error && error.message === "stripe_checkout_not_configured"
      ? "Checkout is not configured yet."
      : error instanceof Error && error.message === "request_body_too_large"
        ? "Request rejected."
        : "Checkout could not be started. Please try again or contact support.";
    const status = error instanceof Error && error.message === "stripe_checkout_not_configured"
      ? 503
      : error instanceof Error && error.message === "request_body_too_large"
        ? 400
        : 502;
    return Response.json({ error: message }, { status });
  }
}

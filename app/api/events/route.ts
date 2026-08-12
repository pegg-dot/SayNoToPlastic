import { getDb } from "../../../db";
import { analyticsEvents } from "../../../db/schema";
import { bodyIsReasonable, isSameOrigin, readJsonBody } from "../../lib/request-safety";

const ALLOWED_EVENTS = new Set(["page_view", "view_book", "begin_checkout", "purchase", "generate_lead", "contact_submit", "affiliate_click", "resource_open", "outbound_source", "cta_click", "form_start", "form_error", "video_start"]);

function safeText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request) || !bodyIsReasonable(request, 4_000)) return Response.json({ error: "Request rejected." }, { status: 400 });
    const payload = await readJsonBody<Record<string, unknown>>(request, 4_000);
    const eventName = safeText(payload.eventName, 40);
    const path = safeText(payload.path, 240) || "/";
    if (!ALLOWED_EVENTS.has(eventName)) return Response.json({ error: "Unsupported event." }, { status: 400 });
    const db = await getDb();
    await db.insert(analyticsEvents).values({
      eventName,
      path,
      label: safeText(payload.label, 160) || null,
      destination: safeText(payload.destination, 500) || null,
      sessionId: safeText(payload.sessionId, 80) || null,
      referrer: safeText(payload.referrer, 500) || null,
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("analytics_event_failed", error);
    return Response.json({ error: "Event could not be recorded." }, { status: 500 });
  }
}

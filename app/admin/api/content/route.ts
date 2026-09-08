import { getAdminUser } from "../../../lib/admin-auth";
import {
  isAdminContentKey,
  listAdminContent,
  setAdminContentValue,
} from "../../../lib/admin-content";
import { bodyIsReasonable, isSameOrigin, readJsonBody } from "../../../lib/request-safety";

export const dynamic = "force-dynamic";
const MAX_ADMIN_BODY_BYTES = 32_000;

export async function GET() {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });

  try {
    const content = await listAdminContent();
    return Response.json({ ok: true, user, content }, { status: 200 });
  } catch (error) {
    console.error("admin_content_list_failed", error);
    return Response.json({ error: "Admin content is temporarily unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });
  if (!isSameOrigin(request) || !bodyIsReasonable(request, MAX_ADMIN_BODY_BYTES)) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
  }

  try {
    const body = await readJsonBody<{ key?: unknown; value?: unknown; expectedVersion?: unknown }>(request, MAX_ADMIN_BODY_BYTES);
    if (!isAdminContentKey(body.key)) {
      return Response.json({ error: "Unknown admin field." }, { status: 400 });
    }

    const expectedVersion = typeof body.expectedVersion === "number" ? body.expectedVersion : undefined;
    const saved = await setAdminContentValue({
      key: body.key,
      value: body.value,
      updatedBy: user.email,
      expectedVersion,
    });

    return Response.json({ ok: true, saved }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === "AdminContentConflict") {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof Error && !error.message.startsWith("request_body_")) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("admin_content_save_failed", error);
    return Response.json({ error: "Unable to save that change." }, { status: 500 });
  }
}

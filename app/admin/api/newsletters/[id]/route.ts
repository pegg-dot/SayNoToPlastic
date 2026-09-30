import { getAdminUser } from "../../../../lib/admin-auth";
import { deleteNewsletter, updateNewsletter } from "../../../../lib/newsletters";
import { bodyIsReasonable, isSameOrigin, readJsonBody } from "../../../../lib/request-safety";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 4_000;

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });
  if (!isSameOrigin(request) || !bodyIsReasonable(request, MAX_BODY_BYTES)) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid newsletter." }, { status: 400 });

  try {
    const body = await readJsonBody<{ title?: unknown; excerpt?: unknown; published?: unknown }>(request, MAX_BODY_BYTES);
    const newsletter = await updateNewsletter({
      id,
      title: typeof body.title === "string" ? body.title : undefined,
      excerpt: typeof body.excerpt === "string" ? body.excerpt : undefined,
      published: typeof body.published === "boolean" ? body.published : undefined,
    });
    return Response.json({ ok: true, newsletter });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update newsletter." }, { status: 400 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });
  if (!isSameOrigin(request)) return Response.json({ error: "Request rejected." }, { status: 400 });

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid newsletter." }, { status: 400 });

  try {
    const deleted = await deleteNewsletter(id);
    return Response.json({ ok: true, deleted });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to remove newsletter." }, { status: 400 });
  }
}

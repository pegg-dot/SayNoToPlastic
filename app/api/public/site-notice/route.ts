import { getAdminContentValue } from "../../../lib/admin-content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const notice = await getAdminContentValue("site.notice");
    return Response.json({ notice }, {
      status: 200,
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
    });
  } catch {
    return Response.json({ notice: "" }, {
      status: 200,
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
    });
  }
}

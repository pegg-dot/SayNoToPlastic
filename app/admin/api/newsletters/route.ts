import { getAdminUser } from "../../../lib/admin-auth";
import { createNewsletterFromDocx, listNewslettersForAdmin } from "../../../lib/newsletters";
import { bodyIsReasonable, isSameOrigin } from "../../../lib/request-safety";

export const dynamic = "force-dynamic";
const MAX_UPLOAD_BYTES = 4_500_000;

export async function GET() {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });
  try {
    return Response.json({ ok: true, newsletters: await listNewslettersForAdmin() });
  } catch (error) {
    console.error("newsletter_list_failed", error);
    return Response.json({ error: "Newsletters are temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });
  if (!isSameOrigin(request) || !bodyIsReasonable(request, MAX_UPLOAD_BYTES)) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Choose a Word .docx file." }, { status: 400 });
    if (!/\.docx$/i.test(file.name)) return Response.json({ error: "Only Word .docx files are supported." }, { status: 400 });
    if (file.size > 4_000_000) return Response.json({ error: "Use a Word .docx file smaller than 4 MB." }, { status: 400 });

    const result = await createNewsletterFromDocx({
      filename: file.name,
      bytes: new Uint8Array(await file.arrayBuffer()),
      createdBy: user.email,
    });

    return Response.json({
      ok: true,
      newsletter: result.newsletter,
      warnings: result.imageCount > 0
        ? [`The document contains ${result.imageCount} embedded image${result.imageCount === 1 ? "" : "s"}. This first version imports text, headings, links, and lists only. Embedded images will not appear on the website or in the Mailchimp draft, so add any important images in Mailchimp before sending.`]
        : [],
    }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to import that newsletter." }, { status: 400 });
  }
}

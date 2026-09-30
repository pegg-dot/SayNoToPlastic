import { getAdminUser } from "../../../../../lib/admin-auth";
import { createNewsletterCampaignDraft } from "../../../../../lib/newsletter-mailchimp";
import { getNewsletterById, markNewsletterMailchimpDraft } from "../../../../../lib/newsletters";
import { isSameOrigin } from "../../../../../lib/request-safety";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });
  if (!isSameOrigin(request)) return Response.json({ error: "Request rejected." }, { status: 400 });

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid newsletter." }, { status: 400 });

  try {
    const newsletter = await getNewsletterById(id);
    if (!newsletter) return Response.json({ error: "Newsletter not found." }, { status: 404 });
    if (!newsletter.published) {
      return Response.json({ error: "Publish the newsletter to the website before creating its Mailchimp draft." }, { status: 409 });
    }
    if (newsletter.mailchimpCampaignId) {
      return Response.json({
        error: "A Mailchimp draft already exists for this newsletter. Open Mailchimp to review that draft instead of creating a duplicate.",
      }, { status: 409 });
    }

    const draft = await createNewsletterCampaignDraft({
      title: newsletter.title,
      slug: newsletter.slug,
      contentHtml: newsletter.contentHtml,
    });
    const updated = await markNewsletterMailchimpDraft(id, draft.id);
    return Response.json({ ok: true, newsletter: updated, mailchimpUrl: draft.mailchimpUrl });
  } catch (error) {
    console.error("newsletter_mailchimp_draft_failed", error);
    return Response.json({ error: error instanceof Error ? error.message : "Unable to create the Mailchimp draft." }, { status: 500 });
  }
}

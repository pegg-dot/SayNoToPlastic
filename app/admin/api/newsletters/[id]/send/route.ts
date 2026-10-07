import { getAdminUser } from "../../../../../lib/admin-auth";
import { createNewsletterCampaignDraft, sendNewsletterCampaign } from "../../../../../lib/newsletter-mailchimp";
import {
  getNewsletterById,
  markNewsletterMailchimpDraft,
  markNewsletterMailchimpSent,
  updateNewsletter,
} from "../../../../../lib/newsletters";
import { bodyIsReasonable, isSameOrigin, readJsonBody } from "../../../../../lib/request-safety";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 1_000;

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 401 });
  if (!isSameOrigin(request) || !bodyIsReasonable(request, MAX_BODY_BYTES)) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid newsletter." }, { status: 400 });

  try {
    const body = await readJsonBody<{ acknowledgeMissingImages?: unknown }>(request, MAX_BODY_BYTES);
    let newsletter = await getNewsletterById(id);
    if (!newsletter) return Response.json({ error: "Newsletter not found." }, { status: 404 });
    if (newsletter.mailchimpSentAt) {
      return Response.json({ error: "This Field Note has already been sent to subscribers." }, { status: 409 });
    }
    if (newsletter.sourceImageCount > 0 && body.acknowledgeMissingImages !== true) {
      return Response.json({
        error: `This Word file contains ${newsletter.sourceImageCount} embedded image${newsletter.sourceImageCount === 1 ? "" : "s"}. The importer does not include embedded Word images in the email. Confirm that you want to send the text-only version.`,
        needsImageAcknowledgement: true,
      }, { status: 409 });
    }

    if (!newsletter.published) {
      newsletter = await updateNewsletter({ id, published: true });
    }

    let campaignId = newsletter.mailchimpCampaignId;
    let mailchimpUrl: string | undefined;
    if (!campaignId) {
      const draft = await createNewsletterCampaignDraft({
        title: newsletter.title,
        slug: newsletter.slug,
        contentHtml: newsletter.contentHtml,
      });
      campaignId = draft.id;
      mailchimpUrl = draft.mailchimpUrl;
      newsletter = await markNewsletterMailchimpDraft(id, campaignId);
    }

    const result = await sendNewsletterCampaign(campaignId);
    newsletter = await markNewsletterMailchimpSent(id, result.sentAt);

    return Response.json({
      ok: true,
      newsletter,
      mailchimpUrl: result.mailchimpUrl || mailchimpUrl,
      alreadySentAtMailchimp: result.alreadySent,
    });
  } catch (error) {
    console.error("newsletter_mailchimp_send_failed", error);
    const current = await getNewsletterById(id).catch(() => null);
    return Response.json({
      error: error instanceof Error ? error.message : "Unable to send this Field Note.",
      newsletter: current,
    }, { status: 502 });
  }
}

import { SITE_URL } from "../config";

type MailchimpEnv = {
  MAILCHIMP_API_KEY?: string;
  MAILCHIMP_AUDIENCE_ID?: string;
  MAILCHIMP_SERVER_PREFIX?: string;
};

async function runtimeEnv(): Promise<MailchimpEnv> {
  try {
    const { env } = await import("cloudflare:workers");
    return env as unknown as MailchimpEnv;
  } catch {
    return process.env as unknown as MailchimpEnv;
  }
}

function serverPrefix(env: MailchimpEnv) {
  const explicit = env.MAILCHIMP_SERVER_PREFIX?.trim();
  if (explicit) return explicit;
  return env.MAILCHIMP_API_KEY?.trim().match(/-([a-z0-9]+)$/i)?.[1] || "";
}

function authHeader(apiKey: string) {
  return `Basic ${btoa(`say-no-to-plastic:${apiKey}`)}`;
}

function escapeEmailHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailHtml(title: string, contentHtml: string, webUrl: string) {
  const safeTitle = escapeEmailHtml(title);
  const safeWebUrl = escapeEmailHtml(webUrl);
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#07111d;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#07111d">
<tr><td align="center">
<table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" style="width:620px;max-width:100%;background:#0b1725;color:#d8dde2;">
<tr><td style="padding:34px 42px;border-bottom:1px solid #263442;">
<img src="${SITE_URL}/brand/sntp-wordmark-microplastic-nav.png" width="220" alt="Say No To Plastic" style="display:block;width:220px;max-width:100%;height:auto;">
</td></tr>
<tr><td style="padding:48px 42px 14px;">
<div style="font:700 10px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#d7a967;">FIELD NOTES</div>
<h1 style="margin:15px 0 0;font:400 42px/1.08 Georgia,serif;color:#fff;">${safeTitle}</h1>
</td></tr>
<tr><td style="padding:10px 42px 36px;font:17px/1.7 Georgia,serif;color:#d3d8dd;">
<div class="newsletter-content">${contentHtml}</div>
</td></tr>
<tr><td style="padding:0 42px 42px;">
<a href="${safeWebUrl}" style="display:inline-block;padding:14px 20px;background:#d7a967;color:#07111d;font:700 11px Arial,sans-serif;letter-spacing:1.3px;text-transform:uppercase;text-decoration:none;">Read on the website →</a>
</td></tr>
<tr><td style="padding:30px 42px 38px;background:#07111d;text-align:center;color:#8d969f;font:10px/1.7 Arial,sans-serif;">
<p>You’re receiving this email because you subscribed to Say No To Plastic Field Notes.</p>
<p>*|LIST:ADDRESS|*</p>
<p><a href="*|UPDATE_PROFILE|*" style="color:#d7a967;">Update preferences</a> &nbsp;·&nbsp; <a href="*|UNSUB|*" style="color:#d7a967;">Unsubscribe</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function getNewsletterMailchimpAdminUrl() {
  const env = await runtimeEnv();
  const prefix = serverPrefix(env);
  return prefix ? `https://${prefix}.admin.mailchimp.com/campaigns/` : "https://mailchimp.com/";
}

async function mailchimpError(response: Response, fallback: string) {
  try {
    const body = await response.json() as { title?: string; detail?: string };
    const detail = body.detail?.trim() || body.title?.trim();
    return detail ? `${fallback} ${detail}` : fallback;
  } catch {
    return fallback;
  }
}

export async function createNewsletterCampaignDraft(input: {
  title: string;
  slug: string;
  contentHtml: string;
}) {
  const env = await runtimeEnv();
  const prefix = serverPrefix(env);
  const apiKey = env.MAILCHIMP_API_KEY?.trim();
  const audienceId = env.MAILCHIMP_AUDIENCE_ID?.trim();
  if (!apiKey || !prefix || !audienceId) throw new Error("Mailchimp is not configured.");

  const headers = {
    Authorization: authHeader(apiKey),
    "Content-Type": "application/json",
  };
  const subject = input.title.slice(0, 150);
  const campaignResponse = await fetch(`https://${prefix}.api.mailchimp.com/3.0/campaigns`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "regular",
      recipients: { list_id: audienceId },
      settings: {
        subject_line: subject,
        preview_text: "A new Field Note from Dr. Elie Haddad and Say No To Plastic.",
        title: `Field Notes · ${subject}`,
        from_name: "Dr. Elie Haddad | Say No To Plastic",
        reply_to: "DrElieBeyondPlastic@gmail.com",
      },
    }),
  });
  if (!campaignResponse.ok) throw new Error(`Mailchimp could not create the draft (${campaignResponse.status}).`);
  const campaign = await campaignResponse.json() as { id?: string };
  if (!campaign.id) throw new Error("Mailchimp created a draft without a campaign ID.");

  const webUrl = `${SITE_URL}/newsletters/${encodeURIComponent(input.slug)}`;
  const contentResponse = await fetch(`https://${prefix}.api.mailchimp.com/3.0/campaigns/${encodeURIComponent(campaign.id)}/content`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ html: emailHtml(input.title, input.contentHtml, webUrl) }),
  });
  if (!contentResponse.ok) throw new Error(`Mailchimp created the draft but could not attach the newsletter content (${contentResponse.status}).`);

  return {
    id: campaign.id,
    mailchimpUrl: `https://${prefix}.admin.mailchimp.com/campaigns/`,
  };
}

export async function sendNewsletterCampaign(campaignId: string) {
  const env = await runtimeEnv();
  const prefix = serverPrefix(env);
  const apiKey = env.MAILCHIMP_API_KEY?.trim();
  if (!apiKey || !prefix) throw new Error("Mailchimp is not configured.");

  const headers = { Authorization: authHeader(apiKey) };
  const encodedId = encodeURIComponent(campaignId);
  const campaignResponse = await fetch(`https://${prefix}.api.mailchimp.com/3.0/campaigns/${encodedId}?fields=status,send_time`, {
    method: "GET",
    headers,
  });
  if (!campaignResponse.ok) {
    throw new Error(await mailchimpError(campaignResponse, `Mailchimp could not read the campaign status (${campaignResponse.status}).`));
  }

  const campaign = await campaignResponse.json() as { status?: string; send_time?: string };
  if (campaign.status === "sent") {
    return {
      sent: true as const,
      alreadySent: true as const,
      sentAt: campaign.send_time || null,
      mailchimpUrl: `https://${prefix}.admin.mailchimp.com/campaigns/`,
    };
  }

  const checklistResponse = await fetch(`https://${prefix}.api.mailchimp.com/3.0/campaigns/${encodedId}/send-checklist`, {
    method: "GET",
    headers,
  });
  if (!checklistResponse.ok) {
    throw new Error(await mailchimpError(checklistResponse, `Mailchimp could not verify the campaign before sending (${checklistResponse.status}).`));
  }

  const checklist = await checklistResponse.json() as {
    is_ready?: boolean;
    items?: Array<{ type?: string; heading?: string; details?: string }>;
  };
  if (!checklist.is_ready) {
    const blockers = (checklist.items || [])
      .filter((item) => item.type !== "success")
      .map((item) => item.heading?.trim() || item.details?.trim())
      .filter(Boolean)
      .slice(0, 3);
    const suffix = blockers.length ? ` Fix: ${blockers.join("; ")}.` : "";
    throw new Error(`Mailchimp says this campaign is not ready to send.${suffix}`);
  }

  const sendResponse = await fetch(`https://${prefix}.api.mailchimp.com/3.0/campaigns/${encodedId}/actions/send`, {
    method: "POST",
    headers,
  });
  if (!sendResponse.ok) {
    throw new Error(await mailchimpError(sendResponse, `Mailchimp could not send the campaign (${sendResponse.status}).`));
  }

  return {
    sent: true as const,
    alreadySent: false as const,
    sentAt: new Date().toISOString(),
    mailchimpUrl: `https://${prefix}.admin.mailchimp.com/campaigns/`,
  };
}

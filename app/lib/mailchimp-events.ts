import { mailchimpSubscriberHash, resolveAudienceProvider } from "./audience-service";

type MailchimpEventEnv = {
  AUDIENCE_PROVIDER?: string;
  MAILCHIMP_API_KEY?: string;
  MAILCHIMP_SERVER_PREFIX?: string;
  MAILCHIMP_AUDIENCE_ID?: string;
};

export const FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup";

async function runtimeEnv(): Promise<MailchimpEventEnv> {
  try {
    const { env } = await import("cloudflare:workers");
    return env as unknown as MailchimpEventEnv;
  } catch {
    return process.env as unknown as MailchimpEventEnv;
  }
}

function mailchimpServerPrefix(env: MailchimpEventEnv) {
  const explicit = env.MAILCHIMP_SERVER_PREFIX?.trim();
  if (explicit) return explicit;
  const match = env.MAILCHIMP_API_KEY?.trim().match(/-([a-z0-9]+)$/i);
  return match?.[1] || "";
}

function basicAuthorization(apiKey: string) {
  return `Basic ${btoa(`say-no-to-plastic:${apiKey}`)}`;
}

export async function emitFieldNotesSignupEvent(input: { email: string; source: string }) {
  const env = await runtimeEnv();
  const provider = resolveAudienceProvider(env.AUDIENCE_PROVIDER);
  if (provider !== "mailchimp") return { configured: false, recorded: false, provider } as const;

  const serverPrefix = mailchimpServerPrefix(env);
  if (!env.MAILCHIMP_API_KEY || !serverPrefix || !env.MAILCHIMP_AUDIENCE_ID) {
    return { configured: false, recorded: false, provider } as const;
  }

  const subscriberHash = mailchimpSubscriberHash(input.email);
  const response = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${encodeURIComponent(env.MAILCHIMP_AUDIENCE_ID)}/members/${subscriberHash}/events`,
    {
      method: "POST",
      headers: {
        Authorization: basicAuthorization(env.MAILCHIMP_API_KEY),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: FIELD_NOTES_SIGNUP_EVENT,
        properties: { source: input.source || "/" },
      }),
    },
  );

  if (!response.ok) throw new Error(`mailchimp_event_${response.status}`);
  return { configured: true, recorded: true, provider, status: response.status } as const;
}

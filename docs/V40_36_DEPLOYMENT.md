# v40.36 production deployment

This runbook deploys the final client pass to the existing `say-no-to-plastic` Cloudflare Worker. It preserves the existing D1 database, public origin, WooCommerce commerce mode, and Worker identity.

## Required external inputs

Production deployment is intentionally blocked until the Worker has both Mailchimp secrets:

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_AUDIENCE_ID`

`MAILCHIMP_SERVER_PREFIX` is optional because the application derives it from the API-key suffix when omitted.

Do not commit or paste secret values into source control or chat logs.

## Owner decision before launch

The current Mailchimp adapter uses immediate subscription (`subscribed`) for new Field Notes members. Confirm whether the owner wants this single-opt-in flow or Mailchimp double opt-in (`pending`) before production deployment.

## Authenticated deployment sequence

From an up-to-date checkout of `main` after the v40.36 release PR is merged:

1. `npm run install:ci`
2. `npm run release:audit`
3. `npm run audience:preflight`
4. `npm run audience:test`
5. `npm run syntax:audit`
6. `npm run build`
7. `npx wrangler whoami`
8. `npx wrangler secret put MAILCHIMP_API_KEY`
9. `npx wrangler secret put MAILCHIMP_AUDIENCE_ID`
10. `npx wrangler deploy`

Enter secrets only into Wrangler's hidden interactive prompt. Do not use command-line `--value` flags or paste values into shell history.

## Production acceptance

Immediately after deployment:

1. Open `/`, `/podcast`, `/tedx`, `/community`, and `/media` on desktop and mobile.
2. Confirm the supplied Beyond Plastic artwork is shown and the platform fine-print line is absent.
3. Confirm TEDx Talk is visible in the primary navigation and the dedicated page contains the supplied title/copy.
4. Submit one real Field Notes signup from the public site.
5. Confirm the subscriber appears in the intended Mailchimp Audience and in the D1 subscriber record.
6. Submit the same address again and confirm the flow remains idempotent.
7. Use the unsubscribe path and confirm the Mailchimp member becomes unsubscribed.
8. Confirm the existing book checkout route still opens the configured WooCommerce flow.

## Follow-up inputs that do not block v40.36

- Replace the temporary audience TEDx recording with the official TEDx video when released.
- Replace Spotify / Apple platform-search fallbacks with exact show URLs when confirmed.
- Before sending Mailchimp campaigns, confirm sender/reply-to identity, required physical mailing address, and domain authentication.
- Resend remains separately required only for transactional/learning-series email features that are activated later; ordinary Field Notes capture does not depend on it.

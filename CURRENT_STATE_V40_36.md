# Current State — v40.36 final client pass

v40.36 reconciles the latest Dr. Haddad finalization request with the current Cloudflare/GitHub source candidate without replacing the site's existing architecture.

## Completed

- Dedicated public TEDx page with the supplied title, speaker line, body copy, video-centered structure, homepage feature, primary-nav entry, and sitemap entry.
- Transparent temporary TEDx recording status until the official release is available.
- Dedicated Beyond Plastic podcast route restored from the prior v40.35 work and reconciled with current main.
- Exact corrected owner-supplied podcast artwork prepared for the build.
- Requested explanatory fine print below Spotify / Apple Podcasts / YouTube removed.
- Field Notes / Newsletter signup restored on Home, footer, Community, and Events & Media.
- `/api/subscribe` restored with consent/D1 persistence and direct Mailchimp audience sync for ordinary Field Notes capture.
- Mailchimp server prefix derivation added; production requires only API key and Audience ID secrets.
- Privacy policy updated for Mailchimp audience processing.
- Existing D1 database, `saynotoplastic.com` origin, WooCommerce mode, and Cloudflare Worker identity preserved.

## Validation

Portable v40.36 source validation passes:

- v40.36 release audit: 21/21
- inherited complete anatomy audit: 37/37
- Podcast/TEDx/newsletter audit: 14/14
- audience preflight: 13/13
- audience adapter contract: pass
- syntax audit: 127 files, 0 failures

A dependency-backed Vinext build could not be completed in the current sandbox because the environment cannot resolve `registry.npmjs.org`; `npm run install:ci` fails at the network/DNS download step before application compilation. The production runbook therefore requires the build to be repeated from an authenticated, networked deployment environment before `wrangler deploy`.

## Remaining production gates

1. Confirm Mailchimp single opt-in versus double opt-in.
2. Configure `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` as Cloudflare Worker secrets.
3. Complete the full dependency-backed build in the networked deployment environment.
4. Deploy the existing Worker and perform the production acceptance checks in `docs/V40_36_DEPLOYMENT.md`.

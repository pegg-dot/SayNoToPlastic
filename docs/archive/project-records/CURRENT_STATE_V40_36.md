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
- Privacy policy updated for Mailchimp processing.
- Existing D1 database, `saynotoplastic.com` origin, WooCommerce mode, and Cloudflare Worker identity preserved.
- Single opt-in confirmed for new Field Notes subscribers.
- Cloudflare authorization to the existing `say-no-to-plastic` Worker verified with Wrangler.

## Validation

v40.36 validation passes:

- v40.36 release audit: 21/21
- inherited complete anatomy audit: 37/37
- Podcast/TEDx/newsletter audit: 14/14
- audience preflight: 13/13
- audience adapter contract: pass
- syntax audit: 127 files, 0 failures
- clean macOS `npm run install:ci`: pass; locked dependencies installed and Vinext available
- dependency-backed `npm run build`: pass; Cloudflare deployment artifact produced successfully

The build emits the expected warning that the two required Mailchimp Worker secrets are absent from the local environment. Those values are intentionally not committed and remain the production activation gate.

## Remaining production gates

1. Obtain the Mailchimp Marketing API credential and intended Audience/List ID.
2. Configure the two required Mailchimp values securely on the existing Cloudflare Worker.
3. Deploy the existing Worker and perform the production acceptance checks in `docs/V40_36_DEPLOYMENT.md`.
4. Verify a real test signup reaches both Mailchimp and D1, and verify unsubscribe behavior.

# v40.36 final client pass

## Scope

This release candidate reconciles the latest Dr. Haddad finalization request with the current Cloudflare/GitHub source of truth.

## Client-requested changes

- Publish a dedicated `/tedx` experience and expose **TEDx Talk** in primary navigation now.
- Add the compact TEDx feature to Home.
- Restore the dedicated **Beyond Plastic** podcast route and keep Podcast directly visible in navigation.
- Replace temporary podcast reference artwork with the exact image supplied by Dr. Haddad.
- Remove the explanatory fine-print line beneath Spotify / Apple Podcasts / YouTube.
- Restore visible Field Notes / Newsletter signup surfaces.
- Restore `/api/subscribe` and make ordinary Field Notes signup sync directly to the configured audience provider without requiring transactional Resend merely to capture the subscriber.
- Select Mailchimp as the deployment audience provider while keeping API credentials server-side and uncommitted.
- Update privacy language for Mailchimp audience processing.

## External activation gates

Before production newsletter capture is considered live:

1. Configure a Mailchimp Marketing API key as a Cloudflare secret.
2. Configure the Mailchimp Audience ID as a Cloudflare secret.
3. Confirm single-opt-in versus double-opt-in policy. The current candidate uses immediate subscription for new members.
4. Verify a real signup reaches Mailchimp and D1, then verify unsubscribe behavior.
5. Confirm Mailchimp sender/reply-to identity, required physical mailing address, and campaign-domain authentication before sending campaigns.

The official TEDx video and exact direct Spotify / Apple show URLs remain replaceable follow-up inputs and are not blockers for this release candidate.

## Validation

- Release audit: 45/45
- Final anatomy audit: 24/24
- Podcast / TEDx / newsletter audit: 14/14
- Syntax audit: 127 files, 0 failures
- Mailchimp audience preflight and adapter contract: pass

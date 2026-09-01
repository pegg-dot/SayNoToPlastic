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

1. Configure the Mailchimp Marketing API credential as a Cloudflare Worker secret.
2. Configure the intended Mailchimp Audience/List ID as a Cloudflare Worker secret.
3. Verify a real signup reaches Mailchimp and D1, then verify unsubscribe behavior.
4. Confirm Mailchimp sender/reply-to identity, required physical mailing address, and campaign-domain authentication before sending campaigns.

Single opt-in is confirmed for new Field Notes subscribers. Cloudflare authorization to the existing Worker has been verified. The official TEDx video and exact direct Spotify / Apple show URLs remain replaceable follow-up inputs and are not blockers for this release candidate.

## Validation

- v40.36 release audit: 21/21
- inherited complete anatomy audit: 37/37
- Podcast / TEDx / newsletter audit: 14/14
- audience preflight: 13/13
- audience adapter contract: pass
- syntax audit: 127 files, 0 failures
- clean macOS locked install: pass
- dependency-backed Vinext production build: pass

# v40.36 external inputs

## Required before production deployment

### Mailchimp access

The final client pass activates visible Field Notes signup surfaces and selects Mailchimp as the audience provider. The remaining production inputs are:

- a Mailchimp Marketing API credential entered as the existing Cloudflare Worker's `MAILCHIMP_API_KEY` secret
- the intended Mailchimp Audience/List ID entered as the existing Cloudflare Worker's `MAILCHIMP_AUDIENCE_ID` secret

Single opt-in has been confirmed for launch. Secret values must not be committed to GitHub or pasted into ordinary chat history.

### Cloudflare authorization

Authorization has been verified through Wrangler for the existing `say-no-to-plastic` Worker. The authenticated account can read the current deployment history and has Worker/D1 write permissions. No new Worker or Cloudflare project is required.

### Build validation

A clean macOS clone completed `npm run install:ci` and the full dependency-backed `npm run build` successfully. The generated deployment artifact preserves the existing D1 binding and Worker configuration. The remaining build warning about missing Mailchimp secrets is expected until those production values are configured securely.

## Required before sending Mailchimp campaigns

These are not blockers for capturing website subscribers, but they are required before real newsletter campaigns are sent:

- approved From name and From email
- reply-to address
- physical mailing address required in campaign footers
- Mailchimp domain/email authentication as appropriate
- final welcome/campaign content and sender approval

## Follow-up, not deployment blockers

### Official TEDx release

The dedicated TEDx page is public-ready now using the existing authorized temporary audience recording and an explicit temporary-status message. When the official TEDx video is released, replace the media registry entry without redesigning the page.

### Direct podcast platform URLs

The Podcast page provides Spotify and Apple Podcasts platform-search destinations plus the confirmed YouTube channel. Replace the Spotify / Apple fallbacks with exact show URLs when the canonical links are confirmed. Do not invent them.

## Already supplied / no longer needed from the owner

- The corrected Beyond Plastic artwork has been recovered from the owner-supplied file and is included in the v40.36 build preparation.
- Dr. Haddad's exact TEDx title, speaker line, body copy, homepage feature copy, and primary-navigation direction are implemented.
- The requested explanatory small-print line under the podcast platforms is removed.
- Single opt-in policy is confirmed.
- Cloudflare deployment authorization is verified.

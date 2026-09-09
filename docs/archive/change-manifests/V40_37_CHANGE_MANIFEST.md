# v40.37 owner review

Date: 2026-09-03

## Owner-requested changes implemented

- Events & Media no longer displays the sentence `High-resolution owner-approved media assets are still parked.`
- Primary navigation now includes **Guides** immediately after **Take Action**, linking directly to the authored 12-step action card at `/quick-action-card`.
- The current temporary TEDx recording is replaced with the owner-supplied YouTube Shorts URL `https://www.youtube.com/shorts/6juPFhIh68I` while retaining its temporary status until the official TEDx release arrives.
- Field Notes signup success messaging now explicitly explains the approved single-opt-in behavior: the visitor is subscribed immediately and no confirmation email is required.

## Newsletter verification

The production signup flow was previously proven end to end: website success state, Mailchimp subscribed contact, and production D1 subscriber status `active` / provider status `synced`. The absence of an immediate email is not a failed signup. No automatic Mailchimp welcome campaign is currently configured by the website.

## Still requiring external work or input

- **Welcome-film captions/transcript:** the current welcome MP4 has no subtitle stream. Accurate captions require the spoken audio or an approved transcript; captions must not be invented from surrounding website copy.
- **Spanish localization:** this should be implemented as a reviewed site localization, not a browser auto-translate overlay, especially for scientific, medical, policy, and legal wording.
- **Owner site admin:** the current application has no CMS/admin interface. A safe owner editor requires a separate authenticated content-management feature rather than sharing deployment credentials.

## Preserved

- Existing Cloudflare Worker identity and deployment history
- D1 `saynotoplastic-db`
- `https://saynotoplastic.com` production origin
- Mailchimp secrets and audience integration
- WooCommerce production commerce mode
- Existing Podcast, TEDx, Science, anatomy, book, and newsletter architecture

# v40.13 — Microplastic wordmark

Date: 2026-08-08

## Rendered direction
The user approved the one-line `Say No To Plastic` serif treatment whose pale plastic letterforms contain colored microplastic fragments and shed a small number of particles below the baseline.

## Implementation
- Preserved the exact approved image as review provenance.
- Cropped the approved transparent artwork into a production runtime asset without redesigning the lettering.
- Added a smaller navbar derivative from the same approved image; no new generative variation is used in the site.
- Replaced the prior live two-part text lockup in the shared `Wordmark` component with the approved image asset.
- Header and footer therefore inherit the new wordmark sitewide through shared chrome.
- The small footer movement mark also uses the approved artwork instead of repeating the old plain-text brand lockup.
- Prose references to Say No to Plastic, page metadata, legal/copyright copy, and accessibility labels remain live text rather than images.
- The wordmark anchor keeps an explicit accessible home label; the decorative image itself is hidden from assistive technology to avoid duplicate announcements.

## Responsive treatment
The same approved artwork is scaled rather than redrawn:
- desktop header: approximately 205 px wide;
- smaller desktop: approximately 182 px;
- tablet/mobile header: approximately 190/172 px;
- footer primary wordmark: approximately 210 px desktop and 190 px mobile;
- footer movement mark: approximately 112/104 px.

The source PNG remains high-resolution so the serif edges and microplastic detail stay crisp on high-density screens.

## Unchanged
- page prose and scientific content;
- navigation destinations and behavior;
- footer signup, privacy, and legal behavior;
- v40.12 compact footer geometry;
- v40.10 one-viewport welcome-film geometry and playback behavior;
- commerce, dependencies, package lock, and production Sites v30.

## Acceptance
The remaining gate is rendered visual proof in the real local site: confirm the header wordmark is legible on the navy background at desktop/tablet/mobile sizes, does not crowd navigation, and the footer mark reads cleanly without increasing footer height materially.

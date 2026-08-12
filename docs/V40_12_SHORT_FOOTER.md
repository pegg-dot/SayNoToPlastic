# v40.12 — Short footer

Date: 2026-08-08

## Rendered defect
The v40.11 desktop review showed that the footer still occupied too much of the viewport. The previous pass reduced type size, but intentionally left the inheritance quote panel unchanged and also inherited a global rule that kept the footer Field Notes form in a single column. Those structural choices kept the bottom of the page visually tall.

## Correction
- The inheritance quote panel is now explicitly shortened on desktop, tablet, and mobile instead of inheriting the old 470px height.
- The desktop footer grid uses substantially less vertical padding and tighter link rows.
- Footer body/navigation type is reduced another step while staying in the UI sans family.
- First name and email fields sit side by side on desktop, removing one full input row of vertical height.
- Consent text, CTA, unsubscribe note, and legal row are tightened on desktop.
- Mobile retains larger tap targets and returns the signup fields to one column.

## Intentionally unchanged
- all footer words, links, signup fields, consent requirement, privacy action, and API behavior;
- footer wordmark and movement mark;
- welcome-film behavior and v40.10 one-viewport correction;
- package lock, dependencies, commerce mode, and production Sites v30.

## Acceptance
At the supplied desktop viewport, the quote band plus footer should read as a deliberate closing area rather than another full content section. The main footer itself should feel comparable to normal site chrome: approximately one compact information band plus a thin legal row, with no oversized stacked form driving its height.

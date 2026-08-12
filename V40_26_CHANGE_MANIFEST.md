# v40.26 Change Manifest — Inline Navigation Final

Base: `homo_plasticus_v40_25`

## User-visible changes

1. Science `/science/body/[slug]`
   - Replaced long dynamic navigation labels with concise reader labels.
   - Forces `On this page` to remain one horizontal row.
   - Narrow screens scroll the row horizontally rather than wrapping.

2. Guide `/resources/[slug]`
   - Forces `In this guide` to remain one horizontal row.
   - Explicitly removes inherited sticky positioning and column direction from the legacy `.guide-article > nav` selector.
   - The navigation no longer follows the viewport or overlays Guide headings/text.

3. Anchor behavior
   - Preserved header clearance for section links.

## Files intentionally changed

- `app/science/body/[slug]/page.tsx`
- `app/resources/[slug]/page.tsx`
- `app/globals.css`
- `app/build-version.ts`
- `package.json` (audit command only; dependencies unchanged)
- `scripts/v40-25-reading-flow-audit.mjs` (later-release compatibility only)
- `scripts/haddad-content-integration-audit.mjs` (later-release compatibility only)
- `scripts/v40-17-anatomy-viewer-audit.mjs` (later-release compatibility only)
- `scripts/v40-18-homepage-final-audit.mjs` (later-release compatibility only)
- `scripts/v40-19-complete-atlas-audit.mjs` (later-release compatibility only)
- `scripts/v40-20-integrated-scroll-atlas-audit.mjs` (later-release compatibility only)
- `scripts/v40-22-final-layout-audit.mjs` (later-release compatibility only)
- `scripts/v40-24-content-architecture-audit.mjs` (later-release compatibility only)
- `scripts/v40-26-inline-navigation-audit.mjs`
- `docs/V40_26_INLINE_NAVIGATION_FINAL.md`
- `V40_26_CHANGE_MANIFEST.md`
- `VALIDATION_REPORT_V40_26.md`

## Explicitly unchanged

- Approved site identity and wordmark
- Homepage anatomy and Complete Body Atlas
- Science article substance and source records
- Guide article substance, actions, sources, and related links
- Community, Book, Dr. Haddad, Events & Media, commerce, audience, and email infrastructure
- Dependencies and `package-lock.json`
- Production/deployed site

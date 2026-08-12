# v40 → v40.1 change manifest

## Runtime/source

- `app/page.tsx` — removes the Home `hp-join-image` generations picture while preserving the Join/newsletter section.
- `app/community/page.tsx` — upgrades the dedicated Community visual to a responsive lazy-loaded `<picture>` using desktop/mobile generations derivatives.
- `app/globals.css` — makes Events & Media full-bleed, keeps inner content editorially aligned, styles the Community responsive picture, and preserves mobile padding.
- `app/build-version.ts` — records v40.1 lower-home polish.

## Regression/audit

- `scripts/homepage-polish-audit.mjs` — adds full-bleed Events & Media, Home-image-removal, preserved newsletter, and Community-responsive-asset checks.
- `scripts/nothing-left-behind-audit.mjs` — updates the older Home-generations assumptions to the latest explicit rendered decision while preserving responsive Community asset coverage.
- `docs/DEFINITIVE_COMPLETION_MATRIX.csv` — updates HV-03 to record the Home-placement supersession and Community acceptance boundary.
- `docs/DEFINITIVE_COMPLETION_AUDIT.md`, `docs/BLUEPRINT_TRACEABILITY.md`, `docs/RAW_TRANSCRIPT_TRACEABILITY.md` — reconcile the same decision without erasing historical authority.

## Review evidence

- `docs/reviews/v40.1-homepage/review-7.png` through `review-10.png`
- `docs/reviews/v40.1-homepage/REVIEW_MANIFEST.md`

No production provider, commerce mode, database schema, scientific evidence record, book flow, or lockfile dependency was changed by this batch.

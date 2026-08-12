# v40.2 change manifest

Base: v40.1 lower-home polish.

## Application/source changes

- `app/science/page.tsx`
  - removed hero helper block;
  - added subtle supplied hero figure;
  - wired six independent supplied evidence visuals.
- `app/globals.css`
  - Science hero visual blending;
  - evidence image framing/responsive rules;
  - Science-only subdued Earth footer treatment.
- `app/build-version.ts`
  - v40.2 build identifier.
- `package.json`
  - added `science:polish` audit command.
- `scripts/science-polish-audit.mjs`
  - new rendered-feedback regression audit.

## Runtime assets added

- `public/images/science/science-body-overview.webp`
- `public/images/science/brain.webp`
- `public/images/science/heart.webp`
- `public/images/science/placenta.webp`
- `public/images/science/testicular-tissue.webp`
- `public/images/science/ovary.webp`
- `public/images/science/blood.webp`

## Documentation/provenance

- `docs/V40_2_SCIENCE_POLISH.md`
- `docs/V40_2_CHANGE_MANIFEST.md`
- `docs/reviews/v40.2-science/REVIEW_MANIFEST.md`
- `docs/reviews/v40.2-science/science-page-before.png`
- `docs/reviews/v40.2-science/body-reference.png`
- `docs/reviews/v40.2-science/organ-reference-collage.png`
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `ASSET_INVENTORY.md`
- `VALIDATION_REPORT.md` updated after final verification.

## Explicit exclusions

- No AI-generated image created during chat review is included in v40.2.
- No science claims, study figures, DOI/source URLs or publication years were rewritten for visual reasons.
- No production deployment/provider settings changed.

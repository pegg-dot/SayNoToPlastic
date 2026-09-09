# v40.21 change manifest — Anatomy and Science layout polish

Date: 2026-08-09

## Changed

- `app/build-version.ts`
  - advances the candidate identifier to `v40.21-anatomy-science-layout-polish`.
- `app/content/anatomy-system-models.ts`
  - adds one shared brain-to-head calibration and applies it to the complete atlas.
- `app/components/AnatomyScene.tsx`
  - reuses the shared brain calibration in the scroll scene;
  - strengthens focused visibility for endocrine, urinary, skin, and digestive chapters.
- `app/content/evidence.ts`
  - replaces abstract chapter statistics with counts of represented tissues, structures, surfaces, and organs;
  - replaces the four affected chapter headlines with concrete visible-anatomy language.
- `app/components/BodyJourney.tsx`
  - replaces the long technical sticky-stage badge with a short active-anatomy label;
  - replaces the circular `ALL` handoff graphic with the transparent body silhouette and labeled anatomy points.
- `app/components/BodySystemLibrary.tsx`
  - marks Pregnancy and Early Life as an intentional full-width life-stage entry in the noncompact library.
- `app/science/page.tsx`
  - replaces the repeated interactive Exposome dashboard with a compact shared-data flow.
- `app/globals.css`
  - adds v40.21 responsive styles for the sticky label, complete-body handoff, balanced body-system library, and compact Exposome flow.
- `scripts/v40-21-layout-polish-audit.mjs`
  - adds dedicated source-level regression checks.
- inherited v40.16–v40.20 audit build-version allowances
  - accept v40.21 while preserving their original feature contracts.
- `package.json`
  - registers `npm run layout:polish`.
- `docs/V40_21_ANATOMY_SCIENCE_LAYOUT.md`
  - records architecture, visual intent, boundaries, and responsive behavior.
- `VALIDATION_REPORT_V40_21.md`
  - records the final audit and packaging result.

## Preserved

- existing v40.20 ten-chapter anatomy architecture;
- complete movable atlas and controls;
- external HRA model registry, attribution, and loading cache;
- all body-system evidence routes and source-review states;
- Dr. Haddad content integration;
- welcome film, wordmark, footer, guides, book, media, community, commerce, learning-series, and operations infrastructure;
- `package-lock.json` and dependency versions;
- published Sites v30 and all production resources.

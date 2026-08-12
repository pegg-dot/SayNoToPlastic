# v40.5 change manifest

Base: v40.4 Solutions kitchen-image scale correction
Date: 2026-08-07

## Application/runtime
- `app/resources/page.tsx` — scopes the Guides route and adds the contained `resource-library-inner` wrapper.
- `app/globals.css` — full-bleed reading-room field and corrected featured-read/search/library geometry.
- `app/build-version.ts` — v40.5 build marker.
- `package.json` — adds `guides:polish` audit command only; dependency lists unchanged.

## Audit/provenance
- `scripts/guides-polish-audit.mjs`
- `docs/V40_5_GUIDES_POLISH.md`
- `docs/V40_5_CHANGE_MANIFEST.md`
- `docs/reviews/v40.5-guides/guides-layout-01.png`
- `docs/reviews/v40.5-guides/guides-layout-02.png`
- `docs/reviews/v40.5-guides/REVIEW_MANIFEST.md`

## Project records
- `README.md`
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `HANDOFF.md`
- `DECISIONS.md`
- `VALIDATION_REPORT.md`
- `QA_CHECKLIST.md`
- `PROJECT_TREE.txt`

## Protected non-changes
No guide records, individual guide content, Homepage, Science, Solutions, commerce/provider settings, package dependencies, or `package-lock.json` entries were intentionally changed.

# v39.1 → v40 change manifest

Date: 2026-08-07

## Scope

v40 is a screenshot-driven homepage polish and local-verification portability batch. It does not activate providers or change production.

Changed existing files: **21**
Added files: **11**
Removed files: **0**

## Changed existing files

- `CURRENT_STATE.md`
- `DECISIONS.md`
- `HANDOFF.md`
- `QA_CHECKLIST.md`
- `README.md`
- `ROADMAP.md`
- `VALIDATION_REPORT.md`
- `app/build-version.ts`
- `app/components/BodyJourney.tsx`
- `app/components/SiteChrome.tsx`
- `app/content/evidence.ts`
- `app/globals.css`
- `app/page.tsx`
- `docs/DEFINITIVE_COMPLETION_AUDIT.md`
- `docs/DEFINITIVE_COMPLETION_MATRIX.csv`
- `docs/DEFINITIVE_COMPLETION_STATUS.json`
- `docs/REMAINING_INTERNAL_WORK.md`
- `package.json`
- `scripts/build-verified.sh`
- `scripts/clarity-audit.mjs`
- `scripts/install-ci.sh`

## Added files

- `docs/V40_HOMEPAGE_POLISH.md`
- `docs/reviews/v40-homepage/REVIEW_MANIFEST.md`
- `docs/reviews/v40-homepage/review-1.png`
- `docs/reviews/v40-homepage/review-2.png`
- `docs/reviews/v40-homepage/review-3.png`
- `docs/reviews/v40-homepage/review-4.png`
- `docs/reviews/v40-homepage/review-5.png`
- `docs/reviews/v40-homepage/review-6.png`
- `scripts/homepage-polish-audit.mjs`
- `scripts/local-portability-audit.mjs`
- `scripts/run-with-timeout.mjs`

## Removed files

None.

## Lockfile boundary

`package-lock.json` remains byte-identical to v39.1:

`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

## Functional summary

- Homepage wordmark, hero density/image integration, anatomy overlay, heart density, exposure labels, and practical-action alignment were corrected from user-supplied local screenshots.
- Primary cardiovascular evidence records remain intact; only Home presentation was shortened.
- New `homepage:polish` and `local:preflight` gates were added.
- `install:ci` now has a safe macOS path while retaining the existing defensive Linux/Sites path.
- `build-verified.sh` now falls back to a cross-platform Node timeout wrapper when GNU `timeout` is absent.
- Six defect screenshots and their SHA-256 manifest are preserved in `docs/reviews/v40-homepage/`.

## Deployment boundary

- Published v30: unchanged.
- Existing Sites candidates: unchanged.
- Commerce/provider production settings: unchanged.
- Final ebook/secrets: absent.

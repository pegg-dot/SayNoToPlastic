# v40.18 change manifest — Home anatomy finalization

Date: 2026-08-09

## Changed

- `app/page.tsx`
  - removes the Home Exposome feature and unused `ExposomeMap` import;
  - preserves the dedicated exposure-route section;
  - replaces the light compact body-system library with `HomeAnatomySystemShowcase`.
- `app/components/HomeAnatomySystemShowcase.tsx`
  - adds a full-viewport continuation of the six-scene anatomy journey;
  - numbers the additional systems 07–10;
  - opens Endocrine, Kidneys/Urinary, Skin, and Digestive directly in the existing full-screen 3D viewer;
  - retains separate evidence-overview routes and focus return.
- `app/globals.css`
  - removes the unused Home-only Exposome styling;
  - adds the full-viewport dark anatomy atlas, 2×2 desktop system grid, responsive tablet/mobile layouts, focus styles, hover treatment, and reduced-motion rules.
- `app/build-version.ts`
  - advances the candidate identifier to v40.18.
- `package.json`
  - registers `npm run homepage:final`; dependencies remain unchanged.
- `scripts/v40-18-homepage-final-audit.mjs`
  - protects Home Exposome removal, Exposome route preservation, four-system 3D entry, full-viewport layout, responsive behavior, accessibility hooks, versioning, and lockfile integrity.
- inherited v40.16/v40.17 audit scripts
  - accept the later compatible v40.18 build identifier.
- current-state, handoff, roadmap, QA, implementation, and validation records
  - advance the working candidate to v40.18.

## Preserved

- all v40.17 full-screen anatomy viewer controls, reference models, provenance, retry, fallback, and accessibility behavior;
- the approved six-scene anatomy journey and floating microplastics;
- the dedicated Exposome page and non-home Exposome uses;
- Dr. Haddad content integration, exposure tools, Community programs, press briefs, generated PDFs, email architecture, and science boundaries;
- welcome film, wordmark, compact footer, commerce mode, package dependencies, package lock, production resources, and rollback ability;
- published Sites v30.

## Production status

No deployment or publish action was performed. The package is a portable local/unpublished candidate.

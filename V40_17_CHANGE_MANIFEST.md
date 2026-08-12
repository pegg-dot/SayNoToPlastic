# v40.17 change manifest — Interactive extended-system anatomy

Date: 2026-08-09

## Changed

- `app/components/AnatomySystemExplorer.tsx`
  - replaces the four text-only reference drawers with direct entry into interactive 3D viewers;
  - preserves the existing optional hotspot toggle and hotspot positions;
  - adds dialog semantics and focus return to the activating hotspot.
- `app/components/AnatomySystemViewer.tsx`
  - adds a full-screen, accessible React Three Fiber viewer;
  - supports rotation, pan, wheel/pinch zoom, exterior/cutaway/system-only layers, full-body/system framing, front/rear views, zoom controls, and reset;
  - adds HRA runtime loading, official repository fallback, browser-level promise caching, visible progress, partial-load handling, retry, conceptual fallback, provenance, and educational boundaries;
  - keeps the complete exterior body surface available in every viewer.
- `app/content/anatomy-system-models.ts`
  - registers the four system assemblies and their exact HRA v1.2 model files;
  - records visible structure lists, scope notes, colors, canonical routes, official CDN URLs, and official repository fallback URLs;
  - explicitly prevents unsupported endocrine structures from being fabricated.
- `app/globals.css`
  - adds full-screen viewer, canvas, control rail, legend, information panel, loading/error states, mobile layouts, and reduced-motion rules;
  - suppresses the welcome replay control while the modal owns focus.
- `public/models/anatomy/LICENSES.txt`
  - adds exact runtime model attribution, CC BY 4.0 license, delivery paths, modification statement, and offline/fallback behavior.
- `app/build-version.ts`
  - advances the local release identifier to v40.17.
- `package.json`
  - registers `npm run anatomy:viewer`; dependencies are unchanged.
- `scripts/v40-17-anatomy-viewer-audit.mjs`
  - adds source-level regression checks for all four viewers, model provenance, camera controls, exterior view, fallback behavior, accessibility, responsive CSS, reduced motion, build version, and lockfile integrity.
- `scripts/v40-16-completion-audit.mjs`
  - advances the inherited anatomy completion check from the former nonmodal drawer to the new accessible modal viewer.
- `docs/V40_17_INTERACTIVE_ANATOMY.md`
  - records architecture, model scope, delivery behavior, interaction design, accessibility, and scientific boundaries.
- current-state, handoff, roadmap, QA, and validation records
  - advance the working candidate to v40.17 and record remaining real-browser proof.

## Preserved

- existing v40.16 page architecture and visual identity;
- six-scene scroll anatomy journey and its verified evidence chapters;
- existing local anatomy assets and floating microplastics;
- Dr. Haddad content integration, action tools, community learning system, press briefs, and generated PDFs;
- welcome film, one-viewport modal, microplastic wordmark, compact footer, commerce mode, provider architecture, database schema, routes, and rollback state;
- package dependencies and `package-lock.json`;
- published Sites v30.

## External runtime requirement

The first open of the kidney, digestive, or endocrine viewer requires network access to retrieve HRA organ surfaces. The skin viewer and complete exterior shell are local. The interface states this requirement, retries through the official source repository, and supplies a conceptual fallback if the remote surfaces are unavailable.

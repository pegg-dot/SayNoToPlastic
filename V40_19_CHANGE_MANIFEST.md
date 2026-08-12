# v40.19 change manifest — Ten-chapter anatomy and complete atlas

Date: 2026-08-09

## Changed

- `app/components/BodyJourney.tsx`
  - keeps the existing homepage anatomy journey in place;
  - expands it from six to ten synchronized chapters;
  - condenses the default evidence display to a short finding and causal/uncertainty boundary;
  - moves methods, limits, companion findings, and sources into progressive disclosure;
  - opens focused 3D viewers from Endocrine, Kidneys/Urinary, Skin, and Digestive chapters;
  - adds the final full-width **Show the complete body** handoff and focus-return behavior.
- `app/content/evidence.ts`
  - adds concise display fields to the shared homepage evidence registry;
  - registers Endocrine, Kidneys/Urinary, Skin, and Digestive as chapters 07–10;
  - preserves fuller source-grounded text for expanded context.
- `app/components/AnatomyScene.tsx`
  - advances the scroll renderer from six to ten synchronized camera/layer states;
  - adds lazy-loaded Endocrine, Kidney/Urinary, and Digestive reference geometry;
  - uses the exterior body shell for the Skin chapter;
  - preserves local brain, heart, circulation, pregnancy, reproductive, pelvic, fetal, and testicular layers;
  - expands the non-WebGL/reduced-motion fallback to ten chapters.
- `app/components/AnatomySystemViewer.tsx`
  - supports focused viewers and the composite Complete Body Atlas through one viewer architecture;
  - adds system-group filtering for composite mode;
  - simplifies the right-side panel to concise known/uncertain summaries;
  - retains exterior, cutaway, system-only, focus/full-body, front/rear, zoom, reset, retry, fallback, focus trap, Escape, inert-background, scroll-lock, and focus-return behavior.
- `app/content/anatomy-system-models.ts`
  - registers the `whole-body-atlas` composite configuration;
  - groups exterior, brain, circulation, heart, pelvic skeleton, pregnancy, reproductive, represented endocrine, urinary, and digestive layers;
  - records concise panel copy, visible structures, source URLs, transformations, review states, and explicit anatomical boundaries.
- `app/lib/anatomy-model-loader.ts`
  - provides a shared cacheable loader for the scroll journey and all viewer modes;
  - tries the registered HRA CDN URL before the registered GitHub release fallback;
  - exposes cache reset for deliberate retry.
- `app/globals.css`
  - styles the ten-item chapter navigation, concise evidence cards, focused-viewer actions, full-width complete-atlas handoff, system group controls, condensed viewer panel, responsive layouts, and reduced-motion behavior.
- `app/build-version.ts`
  - advances the candidate identifier to `v40.19-ten-chapter-complete-atlas`.
- `package.json`
  - registers `npm run anatomy:complete`; dependencies remain unchanged.
- `scripts/v40-19-complete-atlas-audit.mjs`
  - protects the integrated ten-chapter sequence, concise copy, shared loader, complete atlas, requested controls and groups, source boundaries, responsive behavior, documentation, and lockfile integrity.
- `scripts/v40-17-anatomy-viewer-audit.mjs`
  - advances the viewer audit to the shared-loader, focused-viewer, and composite-atlas architecture.
- `scripts/v40-18-homepage-final-audit.mjs`
  - advances the homepage audit from the retired four-card continuation to the integrated ten-chapter experience.
- `scripts/homepage-polish-audit.mjs`
  - aligns protected homepage evidence checks with the approved concise cardiovascular wording.
- `public/models/anatomy/LICENSES.txt`
  - updates the operational note for scroll-triggered lazy loading, composite atlas loading, caching, retry, and fallback;
  - explicitly lists every runtime HRA organ surface, including both fallopian-tube models used by the complete atlas.
- `docs/V40_19_TEN_CHAPTER_COMPLETE_ATLAS.md`
  - records architecture, scope, anatomy boundaries, sources, controls, accessibility, performance, and acceptance gates.
- current-state, handoff, roadmap, QA, validation, and project-tree records
  - advance the portable working candidate to v40.19.

## Removed or superseded

- the separate light anatomy continuation and its retired component remain removed from Home;
- the text-only four-system popup architecture remains superseded by focused full-screen 3D viewers;
- the large Home Exposome block remains removed while `/science/exposome` and non-home uses remain intact;
- no duplicate anatomy viewer, second site, or parallel homepage was added.

## Preserved

- the existing homepage, navigation, page order, identity, wordmark, welcome film, one-viewport welcome modal, compact footer, floating microplastics, and six original evidence chapters;
- Dr. Haddad content integration, Science routes, fourteen-guide catalog, Solutions tools, Community programs, press briefs, generated PDFs, learning-series architecture, editorial boundaries, and noindex source-review states;
- WooCommerce default mode, package dependencies, package lock, runtime resources, rollback ability, and production Sites v30;
- all registered anatomy source attribution and licensing.

## Known acceptance gates

- real-browser confirmation of all ten scroll scenes and every complete-atlas layer;
- final visual alignment of remote HRA models;
- desktop, tablet, mobile, keyboard, touch, reduced-motion, slow-network, offline fallback, and 200% zoom QA;
- Dr. Haddad/source review for topics still marked partial or source-review;
- unpublished Sites import and connected-runtime QA before any production publish.

## Production status

No deployment, publication, DNS, storage, commerce, secret, or production-resource change was performed. The package is a portable local/unpublished candidate.

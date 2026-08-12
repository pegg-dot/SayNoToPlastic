# v40.20 change manifest — Integrated scroll atlas

Date: 2026-08-09

## Purpose

v40.20 is a focused correction built directly on v40.19. It responds to the rendered review that the added Endocrine, Kidney/Urinary, Skin, and Digestive systems must be visibly part of the main scroll-controlled anatomy—not merely available in focused viewers or in the complete-body viewer after the scroll.

## Changed

- `app/components/BodyJourney.tsx`
  - begins loading the extended Human Reference Atlas context before the anatomy section enters view;
  - passes that readiness state into the existing scroll renderer;
  - makes chapter 01 explicitly identify the connected-body overview;
  - adds direct Endocrine, Kidneys, Skin, and Digestive pins inside the opening body scene;
  - retains a compact complete-atlas context message during later chapters;
  - lets chapter 01 open the Complete Body Atlas directly through **Open complete 3D**, so the movable combined model is not available only after chapter 10;
  - preserves the same ten chapter navigation, concise evidence text, progressive-disclosure sources, focused viewers, and final complete-body handoff.
- `app/components/AnatomyScene.tsx`
  - retains all compatible body layers at contextual opacity throughout the guided sequence;
  - balances chapter 01 so brain, circulation, heart, pelvis, pregnancy/reproductive anatomy, endocrine, urinary, digestive, and exterior context can be seen together;
  - reduces the pregnancy layer’s dominance in the opening overview so kidneys and digestive structures remain readable;
  - keeps Endocrine, Kidney/Urinary, Skin, and Digestive focused during their own synchronized chapters;
  - adds fallopian-tube context from the existing complete-atlas registry;
  - reuses the complete-atlas model registry and shared loader rather than creating a second anatomy implementation;
  - avoids competing duplicate endocrine pancreas/ovary surfaces in the general overview while allowing them to appear when Endocrine is focused;
  - keeps the separate male testicular chapter scientifically distinct rather than falsely merging it into the female whole-body composite.
- `app/globals.css`
  - styles the opening integrated-system pins and overview statement;
  - preserves the later complete-atlas context badge;
  - includes desktop, tablet, mobile, keyboard-focus, and reduced-motion rules.
- `scripts/v40-20-integrated-scroll-atlas-audit.mjs`
  - protects preload behavior, persistent context, chapter-01 layer visibility, direct Complete Body Atlas access, model-registry reuse, duplicate-surface handling, responsive styling, build identity, lockfile integrity, and packaged records.
- `app/build-version.ts`
  - advances the candidate identifier to `v40.20-integrated-scroll-atlas`.
- `package.json`
  - registers `npm run anatomy:integrated`; dependencies remain unchanged.
- `docs/V40_20_INTEGRATED_SCROLL_ATLAS.md`
  - records the relationship between the guided scroll and the freely movable atlas, loading behavior, accessibility, scientific boundaries, and browser acceptance gates.
- current-state, handoff, roadmap, QA, and validation records
  - advance the portable working candidate to v40.20.

## Preserved

- the existing homepage and route architecture;
- the ten evidence chapters and concise right-side copy;
- all four focused 3D system viewers;
- the final Complete Body Atlas and all of its controls;
- welcome film, wordmark, footer, guides, Science content, Solutions tools, Community programs, commerce mode, learning-series architecture, and generated downloads;
- package dependencies and the approved package lock;
- production Sites v30 and every production resource, secret, URL, storage binding, DNS setting, and rollback path.

## External acceptance boundary

The HRA organ models remain network-loaded on first use and browser-cached afterward. Real-browser review must still confirm first-load delivery, anatomical alignment, opacity balance, direct pin navigation, chapter-01 Complete Body Atlas opening, slow-network behavior, offline fallback, mobile layout, keyboard use, reduced motion, touch controls, and 200% zoom.

## Production status

No deployment, publication, DNS, storage, commerce, secret, or production-resource change was performed. v40.20 is a portable local/unpublished candidate.

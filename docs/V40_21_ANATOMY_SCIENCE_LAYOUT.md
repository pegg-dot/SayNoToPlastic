# v40.21 — Anatomy calibration and Science layout refinement

Date: 2026-08-09

## Purpose

v40.21 is a targeted visual-correction pass on top of v40.20. It preserves the ten-chapter anatomy journey, the complete interactive atlas, the Dr. Haddad content system, the welcome film, the microplastic wordmark, commerce rails, learning-series infrastructure, and all existing routes.

The pass addresses issues visible in real-browser review:

- the brain surface sat too high relative to the exterior head;
- chapters 07–10 did not isolate their represented anatomy clearly enough;
- the right-hand chapter statistics used abstract language that wrapped awkwardly;
- the sticky-stage context label was too technical;
- the complete-atlas handoff used an ambiguous circular `ALL` graphic;
- the Science body-system library created excessive whitespace and an orphan final card;
- the Science page repeated a large box-heavy Exposome dashboard already available on its dedicated route.

## Shared brain calibration

`BRAIN_ALIGNMENT` is registered once in `app/content/anatomy-system-models.ts` and reused by both:

- the scroll-controlled anatomy scene; and
- the complete interactive body atlas.

The local brain reference is scaled to `0.86` and lowered by `0.16` reference units, with a small depth adjustment. This keeps the surface inside the head instead of floating above it while maintaining one calibration contract across both experiences.

## Chapter focus behavior

The scroll retains the complete-body context architecture introduced in v40.20, but chapters 07–10 now suppress unrelated anatomy more aggressively:

- **Endocrine:** pancreas, thymus, and both ovaries come forward.
- **Kidneys and urinary:** two kidneys, two ureters, and bladder come forward.
- **Skin:** the complete exterior surface becomes the dominant layer.
- **Digestive:** small intestine, large intestine, liver, and pancreas come forward.

No missing glands, organs, bones, or microscopic layers are fabricated.

## Chapter copy

The large statistical treatment now describes visible anatomy rather than abstract concepts:

- `4 tissues` for the represented endocrine scene;
- `5 structures` for the urinary scene;
- `1 surface` for the skin scene;
- `4 organs` for the digestive scene.

The evidence summary and uncertainty statement remain below, while methods, limitations, and sources stay in the expandable context disclosure.

## Sticky-stage label

The technical atlas badge was replaced with one short label:

- **Visible anatomy**
- the active chapter's `modelLabel`

Opening pins for Endocrine, Kidneys, Skin, and Digestive remain available in chapter 01.

## Complete-atlas handoff

The circular `ALL` motif was replaced by the existing transparent reference-body silhouette with eight labeled points:

- Exterior
- Brain
- Circulation
- Heart
- Pelvis + pregnancy
- Endocrine
- Kidneys
- Digestive

The handoff still opens the same complete movable atlas and preserves the educational-composite boundary.

## Science page

### Body-system library

The first six body-system entries form a balanced three-column by two-row desktop grid. Pregnancy and Early Life becomes an intentional full-width life-stage pathway below them. Tablet and mobile layouts collapse to two and one columns respectively.

The section heading is constrained and reduced so it does not create a large empty field or break into an excessive number of lines.

### Exposome bridge

The Science page no longer embeds the full interactive Exposome dashboard. Instead, it renders the five canonical domains from the shared content registry in one compact horizontal flow:

`Air · Water · Food · Products · Lifestyle → Lifetime exposure → How the body responds`

The full interactive Exposome remains available on `/science/exposome`.

## Boundaries

- No dependency or lockfile changes.
- No production deployment.
- No change to the published Sites v30 application.
- No invented clinical interpretation.
- No removal of canonical science routes or source-review labels.

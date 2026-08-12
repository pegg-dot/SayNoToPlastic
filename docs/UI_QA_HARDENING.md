# v35 UI and accessibility hardening

## Purpose

v35 is the portable source-hardening pass that follows the v34 transcript reconciliation. The intended next step was a clean build and browser review. The current container cannot complete `npm ci` because its configured package mirror does not contain a locked transitive package (`zustand@5.0.14`), so v35 closes source-detectable interaction and accessibility gaps without pretending that rendered QA has passed.

## Changes completed

### Global navigation and landmark behavior

- Every route that renders the shared header now exposes `#main-content` as the skip-navigation target.
- Main targets use `tabIndex={-1}` so skip navigation can move programmatic focus reliably.
- The homepage header and footer now sit outside the main landmark.
- Media child routes retain the Events & Media active state.
- Mobile navigation uses explicit button semantics, a focus trap, Escape close, inert background regions, and a shared body scroll lock.

### Shared overlay safety

- Added `useBodyScrollLock`, with reference counting and exact restoration of the prior body overflow value.
- The root app is wrapped in `#site-shell`, allowing the welcome dialog to make the entire underlying interface inert.
- The welcome dialog now has a local focus trap, labelled description, Escape close, focus return, pointer-safe backdrop handling, and a replay trigger that announces dialog behavior.
- Opening the welcome film dispatches an overlay-coordination event that closes the mobile menu first, preventing competing focus traps and incorrect scroll restoration.

### Anatomy journey resilience

- Chapter buttons update the visual state immediately instead of waiting for scroll observation.
- Buttons expose the chapter-to-finding relationship with `aria-controls`.
- Missing `IntersectionObserver` reveals the journey rather than leaving content hidden.
- Reduced-motion users receive a static anatomy state instead of an animation loop.
- Missing WebGL, model-loading errors, or Canvas rendering errors fall back to the static image treatment.
- Fallback images use stable unique keys.

### Book journey operation

- The chapter rail is a named navigation region made of real buttons.
- Each button can move directly to its chapter by keyboard, touch, or pointer.
- The current chapter exposes `aria-current="step"`.
- Direct navigation uses instant scrolling when reduced motion is requested.

### Forms, checkout, guides, and recommendations

- Signup and contact forms expose pending state with `aria-busy`, stable status descriptions, explicit submit buttons, and duplicate-submit guards.
- Contact success copy now uses the Say No to Plastic movement identity and the configured support address.
- Commerce preview is a real non-payment form with a named, required email field and browser validation.
- Checkout error IDs no longer depend on visible button copy.
- Guide and recommendation filters expose named button groups.
- Movement-level utility and policy copy now consistently identifies Say No to Plastic; *Homo Plasticus* remains the book/product identity.

## Automated source contracts

- `npm run syntax:audit`
- `npm run ui:audit`
- `npm run source:audit`
- `npm run links:audit`
- `npm run affiliate:preflight`
- `npm run commerce:preflight` with the approved test configuration and final private PDF

The new `ui:audit` verifies landmarks, overlay isolation, scroll locking, anatomy fallback behavior, direct book navigation, form semantics, checkout state, filter groups, and supporting CSS.

## Still requires a real browser

Source checks cannot prove visual rendering. The following remain mandatory in a registry-complete environment:

- clean install, lint, production build, artifact validation, and rendered-route tests;
- welcome modal/video sizing, focus order, and background isolation;
- mobile menu layout and overlay stacking;
- anatomy model registration, chapter synchronization, static fallback quality, and clinical recognizability;
- premium book center line, crop, page turns, and chapter navigation;
- form validation, error, loading, success, and network-failure states;
- 200% zoom/reflow, keyboard-only flow, touch, reduced motion, no-WebGL mode, and representative screen-reader checks;
- required desktop, tablet, and mobile viewports in `docs/VISUAL_QA_RUNBOOK.md`.

## Acceptance boundary

v35 is **source-hardened and ready for rendered QA**. It is not described as visually approved, dependency-built, production activated, or clinically approved.

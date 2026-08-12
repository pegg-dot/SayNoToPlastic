# v40.19 — Ten-Chapter Anatomy Journey and Complete Body Atlas

Date: 2026-08-09

## Purpose

v40.19 extends the existing v40.18 homepage anatomy experience instead of adding another disconnected card section or creating a new site. The original six evidence chapters remain in the same scroll-controlled journey, while Endocrine, Kidneys/Urinary, Skin, and Digestive become chapters 07–10 in that same sequence.

The release also adds a final **Complete Body Atlas** handoff after the ten chapters. That viewer combines the available exterior and registered anatomical reference layers into one movable educational assembly.

## One integrated ten-chapter journey

The homepage sequence is now:

1. Whole body and circulation
2. Brain
3. Heart and arteries
4. Pregnancy and placenta
5. Ovary and developing eggs
6. Testicular tissue
7. Endocrine and metabolic
8. Kidneys and urinary system
9. Skin
10. Digestive system

The existing scroll progress, chapter navigation, camera interpolation, source links, and anatomy-credit treatment remain. The four added chapters use the same progress value and the same left-side stage as the original six.

Remote Human Reference Atlas surfaces are requested only when their extended chapter approaches or a related viewer opens. The scroll experience and full-screen viewers use the same cacheable loader so a successfully loaded model can be reused rather than downloaded and parsed repeatedly.

## Concise evidence presentation

The rendered review showed that the right-hand evidence column contained too much small text. v40.19 therefore keeps the default chapter view to two short statements:

- **Finding** — the main supported observation;
- **What it does not prove** — the key uncertainty or causal boundary.

Study design, methods, sample information, limitations, companion findings, and source links remain available under the collapsed **Study context, limits, and sources** control. No evidence or provenance was deleted; it was moved behind progressive disclosure.

The Skin, Endocrine, Kidneys, and Digestive full-screen viewers use the same quick-read pattern: one short system summary, one known point, and one uncertain point. Structure lists, provenance, and medical boundaries remain available without occupying the primary reading area.

## Focused viewers

Chapters 07–10 retain direct access to their focused full-screen 3D viewers:

- Endocrine and metabolic
- Kidneys and urinary system
- Skin and exterior surface
- Digestive system

Each focused viewer supports:

- pointer or touch rotation;
- wheel or pinch zoom;
- Shift-drag panning;
- exterior, cutaway, and system-only modes;
- Focus System and Full Body framing;
- Front, Rear, Zoom In, Zoom Out, and Reset controls;
- keyboard focus trapping, Escape closure, inert background, scroll locking, and focus return;
- loading progress, partial-load reporting, retry, and readable fallback behavior.

## Complete Body Atlas

A full-width handoff follows the tenth chapter. Selecting **Show the complete body** opens the composite atlas with the available registered layers:

- exterior skin surface;
- brain;
- blood vasculature;
- heart;
- female pelvic skeleton;
- uterus;
- placenta;
- fetal reference surface;
- ovaries and fallopian tubes;
- thymus and pancreas as the represented endocrine structures;
- left and right kidneys;
- left and right ureters;
- urinary bladder;
- small intestine;
- large intestine;
- liver;
- pancreas.

The complete atlas includes focus filters for Skin, Brain, Circulation, Heart, Skeleton, Pregnancy, Reproductive, Endocrine, Urinary, and Digestive systems. It retains exterior, cutaway, and system-only modes and the same camera controls used by the focused viewers.

## Scientific and anatomical boundaries

The complete atlas is an educational composite, not a single-patient reconstruction, complete clinical anatomy product, diagnostic model, or microscopic tissue atlas.

Important scope limits remain explicit:

- the pelvic skeleton is shown, not every bone in the body;
- the available endocrine overlay includes the registered pancreas, thymus, and ovarian surfaces, not every endocrine gland;
- the separate male testicular chapter remains available in the scroll journey but is not overlaid into the female composite body;
- the maternal, fetal, reproductive, circulatory, and other layers originate from different reference datasets and are aligned for orientation rather than measurement;
- missing structures are not fabricated;
- system evidence pages retain their verified, partial, or source-review publication state.

## Sources and licensing

Local and runtime anatomy assets continue to use the registered sources and licenses recorded in `public/models/anatomy/LICENSES.txt`:

- NIH Human Reference Atlas / HuBMAP reference objects — CC BY 4.0;
- BodyParts3D testicular surfaces — CC BY-SA 2.1 JP;
- Medical Vision Group fetal MRI demonstration surface — MIT.

A working internet connection is required for the first load of remote HRA organ surfaces. The local exterior shell and six core local layers remain available, and later visits may benefit from browser caching.

## Accessibility and performance architecture

- The left stage remains sticky while the right evidence chapters scroll.
- Chapter buttons can move directly to any of the ten scenes.
- The complete-atlas opener is a real button with dialog semantics.
- Viewer dialogs trap focus, close with Escape, return focus, lock background scrolling, and mark the site shell inert.
- Reduced-motion users receive nonanimated transitions and the existing readable anatomy fallback.
- Tablet and mobile layouts preserve chapter access and viewer controls.
- Remote reference objects are lazy-loaded and shared through one model cache.

## Acceptance boundary

Source-level audits can prove route continuity, chapter count, model registration, loader sharing, controls, progressive disclosure, accessibility hooks, licensing, responsive rules, and package integrity. They cannot replace real-browser inspection of:

- final alignment of every remote HRA surface;
- touch rotation, pinch zoom, and pan behavior;
- visual balance at desktop, tablet, mobile, and 200% zoom;
- retry and fallback behavior on a slow or unavailable network;
- exterior, cutaway, system-only, and every group filter;
- final readability of the condensed chapter copy.

Nothing in this release is published automatically. Production Sites v30 remains untouched until local and unpublished-Sites acceptance is complete.

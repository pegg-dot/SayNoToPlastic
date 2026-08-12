# v40.18 — Home anatomy showcase finalization

Date: 2026-08-09

## User-directed correction

The previous homepage placed a large Exposome module immediately after the anatomy journey and followed it with a light four-card body-system library. The rendered review asked for two changes:

1. remove the Exposome module from Home; and
2. make the four additional systems feel like a complete, full-screen continuation of the anatomy experience.

The dedicated `/science/exposome` route and every non-home use of the Exposome remain intact.

## Implemented architecture

Home now mounts `HomeAnatomySystemShowcase` directly after the existing six-scene `BodyJourney`.

The showcase:

- occupies a full desktop viewport below the persistent header;
- uses the existing canonical `moreSystemCards` registry rather than duplicating text;
- presents Endocrine, Kidneys/Urinary, Skin, and Digestive as systems 07–10;
- reuses the existing conceptual `BodySystemVisual` art for immediate visual recognition;
- opens the same full-screen `AnatomySystemViewer` used by the in-journey hotspots;
- keeps a separate evidence-overview link for visitors who want the full written record;
- preserves focus return to the card that opened the 3D viewer;
- keeps explicit exterior, cutaway, system-only, rotation, pan, and zoom instructions visible;
- adapts from a two-column desktop atlas to a single-column mobile sequence;
- disables nonessential transitions under reduced motion.

## Homepage Exposome removal

Removed from `app/page.tsx`:

- the `ExposomeMap` import;
- the Home-only `home-exposome` feature block;
- the Home-only Exposome CTA.

Preserved:

- `/science/exposome`;
- `app/components/ExposomeMap.tsx`;
- Exposome modules on Science, About, and other intended routes;
- the everyday exposure-route section that follows the anatomy showcase.

## Scientific and accessibility boundary

The 3D models remain educational reference surfaces, not diagnostic or patient-specific scans. The endocrine scene continues to disclose that only the available pancreas, thymus, and ovary reference surfaces are represented. No unsupported organ geometry was invented.

The showcase card itself is a button with dialog semantics. The written-evidence route remains a separate link, avoiding nested interactive controls. Keyboard focus styles, focus return, reduced-motion handling, and the existing viewer focus trap remain preserved.

## Acceptance boundary

Source-level and portable audits can prove architecture, route preservation, accessibility hooks, responsive CSS, provenance, and lockfile integrity. They cannot replace real-browser confirmation of final visual balance, HRA model alignment, touch interaction, or network retry behavior. Those remain local and unpublished-Sites acceptance gates.

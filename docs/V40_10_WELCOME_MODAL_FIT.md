# v40.10 — One-viewport Welcome Modal

Date: 2026-08-08

## Rendered defect
The v40.9 real welcome-film dialog was technically contained but visually too large on the user's laptop. The portrait film plus right-hand copy created a tall modal that required scrolling before the visitor could see the complete popup experience.

## Correction
v40.10 changes layout only; it does not change the supplied film, poster, copy, first-visit memory, replay behavior, analytics, Media placement, or playback policy.

- Standard desktop dialog is capped at `720px` and `100svh - 32px`.
- The portrait film receives a dedicated narrow column instead of inheriting a wide media pane.
- The old `640px` minimum height is explicitly neutralized so the film surface can shrink with the viewport.
- Dialog overflow is hidden at standard viewports, preventing a second internal scroll surface.
- Copy spacing/type is compressed enough to keep Play and Continue visible inside the same modal.
- Tablet remains two-column instead of stacking the portrait film over the copy into a tall sheet.
- Mobile uses bounded video/copy rows inside a single viewport.
- At genuinely tiny effective viewports / heavy browser zoom, an accessibility exception permits scrolling so controls are never clipped or unreachable.

The film still uses `object-fit: contain`; no video pixels are cropped or stretched.

## Acceptance
Requirement `HM-19` was added to the definitive matrix from the rendered user review. It remains proof-gated until the corrected dialog is viewed locally at the required viewport/zoom matrix.

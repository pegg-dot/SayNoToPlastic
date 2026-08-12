# v40.5 Guides reading-room layout correction

Date: 2026-08-07

## User-reviewed defect
The user approved the Guides page overall but identified the central reading-room section as visibly broken: the ivory field ended as a centered block instead of filling the viewport, the “Three useful first reads” heading and three cards were squeezed into a narrow side-by-side split, and the resulting line wrapping/text placement made the section look cut off and unfinished.

## Root cause
Two layout decisions compounded each other:

1. the late blueprint geometry rule capped `.resource-library` itself at the shared `--content-max`, leaving navy gutters around the ivory field; and
2. `.guide-starters` reserved a large left column for the heading while forcing all three long featured-guide cards into the remaining right column.

The content was correct, but the container hierarchy made it visually cramped.

## Correction
- Scope the route with `resources-v2` so visual corrections cannot leak into unrelated pages.
- Make the ivory reading-room field full-bleed.
- Add `resource-library-inner` so the actual reading content still respects the 1240px editorial grid.
- Recompose “Three useful first reads” as a full-width heading followed by three equal desktop cards.
- Increase top/bottom breathing room and normalize title wrapping.
- Keep search, category filters, result count, and the full 14-guide grid intact.
- Stack the three featured cards before cramped tablet widths.

## Protected non-changes
The Guides hero, “Choose a route” pathways, all 14 guide records, guide URLs, search/filter behavior, individual guide-page content, Home, Science, Solutions, footer treatment, commerce, providers, dependencies, and lockfile remain unchanged.

## Proof boundary
Source/regression audits prove the corrected hierarchy and preserve functionality. Final pixel acceptance still requires the user's local browser render.

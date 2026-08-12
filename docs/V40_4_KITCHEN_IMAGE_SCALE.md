# v40.4 Solutions kitchen-image scale correction

Date: 2026-08-07

## User-reviewed defect
The user approved the rest of the rendered Solutions page but identified one clear regression: the kitchen visual had collapsed into a tiny thumbnail beside the caption/headline.

## Root cause
An older selector, `.solutions-direct>div:first-of-type`, has greater CSS specificity than the v40.3 `.solutions-direct-inner` override. In the real browser it therefore re-applied a two-column grid to the entire inner wrapper. That split the lead copy and guide-card grid into unintended grid columns and squeezed the kitchen figure into a narrow cell.

## Correction
- The inner wrapper override is now `.solutions-v2 .solutions-direct>.solutions-direct-inner`, which intentionally outranks the legacy selector and restores block flow.
- The lead row gives the kitchen visual the larger desktop share (`1.22fr / .78fr`).
- The figure and picture explicitly fill their lead column.
- Responsive high-specificity width rules were updated to match the corrected selector.

## Protected non-changes
No Solutions copy, action rules, guide URLs, planner behavior, footer treatment, Science content, Home content, commerce settings, dependencies, or lockfile entries were changed.

## Proof boundary
Source/regression audits can prove the CSS conflict is removed. Final visual scale still requires the user's local browser render.

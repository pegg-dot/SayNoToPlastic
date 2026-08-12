# v40.2 → v40.3 change manifest

## Runtime/source changes

- `app/solutions/page.tsx`
  - reorganized the lower kitchen/guides section into one coherent lead + card layout;
  - removed the visible Solutions `Evidence boundary` strip;
  - retained existing guide wording, routes, core rules, planner, and optional-depth bridge.
- `app/components/SiteChrome.tsx`
  - removed the live Earth-at-night `<img>` from the inheritance quote footer while preserving the quote as live text.
- `app/globals.css`
  - added a labeled v40.3 Solutions rendered-feedback override block;
  - made the lower ivory action field full-bleed with a contained editorial grid;
  - aligned kitchen image/caption/headline and guide cards;
  - tightened planner/optional-depth spacing;
  - replaced the footer photo with a flat dark field and faint abstract Earth curve.
- `app/build-version.ts`
  - advanced to `hp-solutions-2026-08-07-v40.3-solutions-polish`.
- `package.json`
  - added `solutions:polish` source regression command.
- `scripts/solutions-polish-audit.mjs`
  - new targeted regression audit for this rendered-feedback batch.
- `scripts/science-polish-audit.mjs`
  - updated footer expectations to the later user-approved flat treatment.
- `scripts/nothing-left-behind-audit.mjs`
  - preserved the original Earth source asset while updating the live-footer acceptance rule.

## Traceability/audit records

- `docs/DEFINITIVE_COMPLETION_MATRIX.csv`
- `docs/DEFINITIVE_COMPLETION_STATUS.json`
- `docs/DEFINITIVE_COMPLETION_AUDIT.md`
- `docs/REMAINING_INTERNAL_WORK.md`
- `docs/RAW_TRANSCRIPT_TRACEABILITY.md`
- `docs/BLUEPRINT_TRACEABILITY.md`
- `docs/BLUEPRINT_TRACEABILITY.csv`
- `docs/SOURCE_VISUAL_REVIEW.md`
- `docs/reviews/v40.3-solutions/*`

The older blueprint Earth-at-night direction is not deleted from history; it is explicitly marked as superseded by the later rendered user decision.

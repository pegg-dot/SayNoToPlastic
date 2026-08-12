# v40.10 change manifest — Welcome modal fit

Changed:
- `app/globals.css` — standard-view one-viewport welcome dialog geometry, compact copy spacing, tablet/mobile fit rules, and extreme-zoom accessibility escape hatch.
- `app/build-version.ts` — v40.10 build identifier.
- `scripts/welcome-film-audit.mjs` — regression checks for one-viewport fit, non-scroll standard layout, shrinkable portrait surface, tablet/mobile rules, and zoom accessibility.
- `scripts/nothing-left-behind-audit.mjs` — authoritative requirement count advanced to 179 and HM-19 protected.
- `docs/DEFINITIVE_COMPLETION_MATRIX.csv` — adds HM-19 from the 2026-08-08 rendered review.
- `docs/DEFINITIVE_COMPLETION_STATUS.json` — 179 total / 99 proven / 48 proof-gated / 32 external blockers.
- `docs/V40_10_WELCOME_MODAL_FIT.md` — implementation/acceptance record.
- Current-state, roadmap, handoff, QA, welcome-film integration and validation records — advanced to v40.10.

Unchanged:
- supplied welcome MP4 and poster bytes;
- Events & Media inline film placement;
- first-visit localStorage behavior and replay trigger;
- no-sound-autoplay policy;
- Home/Science/Solutions/Guides/Book/About/Community accepted layouts;
- package lock and dependencies;
- production Sites v30.

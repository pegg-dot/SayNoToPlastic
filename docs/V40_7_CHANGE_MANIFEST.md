# v40.7 change manifest

## Application

- `app/content/media-items.json` — restore current TEDx and long-form YouTube entries with explicit approval/status metadata.
- `app/content/media-content.ts` — distinguish project-user publication authorization from owner confirmation; support per-entry status/play labels; update welcome-film link status.
- `app/media/page.tsx` — temporary TEDx labeling, current long-form conversation, welcome-link pending copy.
- `app/community/page.tsx` — eager/high-priority generations hero image.
- `app/globals.css` — full/natural-ratio Community image treatment; no cover crop.

## Safety / tests

- `scripts/media-preflight.mjs` — allow explicitly authorized interim publication without fabricating owner approval; missing dates remain warnings only when explicitly pending verification.
- `scripts/media-community-polish-audit.mjs` — new targeted regression audit.
- `scripts/nothing-left-behind-audit.mjs` — 178-row ruler + MC-19 + eager Community visual contract.
- `tests/rendered-html.test.mjs` — latest explicit TEDx/conversation behavior.
- `package.json` — `media-community:polish`.

## Governance/docs

- `docs/DEFINITIVE_COMPLETION_MATRIX.csv` — latest temporary-TEDx decision, current long-form requirement, Community crop state.
- `docs/DEFINITIVE_COMPLETION_STATUS.json` — recomputed counts.
- `DECISIONS.md` — authority/temporary-media decision recorded.
- `docs/V40_7_MEDIA_COMMUNITY_POLISH.md` — implementation and proof record.
- `CURRENT_STATE.md`, `ROADMAP.md`, `HANDOFF.md`, `QA_CHECKLIST.md`, `VALIDATION_REPORT.md` — release-state updates.
## Additional release-hardening

- `app/build-version.ts` — bumps the source marker to v40.7.
- `docs/content-templates/media-intake.json` — adds fail-closed publication authority, date-verification, temporary/replacement, and media-ID fields.
- `scripts/content-intake-audit.mjs` — verifies the expanded media intake contract and safe defaults.
- `docs/DEFINITIVE_COMPLETION_STATUS.json` — reconciles the 33 blocked rows into 23 owner/approval + 8 provider/domain + 2 missing-source rows.
- `scripts/nothing-left-behind-audit.mjs` — now proves blocked subtype totals match the 178-row matrix and sum to the top-level blocked count.
- `docs/TRANSCRIPT_LINE_BY_LINE_AUDIT.md`, `docs/TRANSCRIPT_CONFLICT_LOG.md`, `docs/TRANSCRIPT_OPEN_ITEMS.md` — remove stale pre-v40.7 media assumptions while preserving the original transcript conflict and later user-authorized temporary exception.


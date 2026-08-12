# v40.9 change manifest — Welcome film integration

Base: v40.8 Community full-artwork correction.

## Runtime/media changes
- `public/media/welcome-dr-haddad.mp4` — browser-compatible H.264/AAC 540×960 derivative of the user-supplied 1080×1920 HEVC welcome film; 3:28; MP4 faststart.
- `public/media/welcome-dr-haddad-poster.webp` — poster frame derived from the supplied film.
- `app/content/welcome-film-metadata.json` — master/derivative filename, dimensions, duration, byte size, codec and SHA-256 provenance.
- `app/content/media-content.ts` — `WELCOME_FILM` changes from pending placeholder to the real hosted video/poster.
- `app/components/WelcomeVideoModal.tsx` — hosted source explicitly declares `video/mp4`; existing first-visit/replay behavior remains.
- `app/media/page.tsx` — Welcome Film section now plays the same hosted film inline with controls and metadata-only preload; captions/transcript status remains visible.
- `app/globals.css` — 9:16 contain rendering for the modal/poster and Events & Media player; no crop/stretch.
- `app/build-version.ts` — v40.9 build identifier.

## Audit/governance changes
- `scripts/welcome-film-audit.mjs` — 24-contract source/media/provenance/accessibility-regression audit.
- `scripts/media-community-polish-audit.mjs` — welcome expectations updated from pending placeholder to supplied hosted film.
- `scripts/nothing-left-behind-audit.mjs` — requires welcome runtime/provenance files and asserts HM-07 moved out of the owner-asset blocker bucket.
- `package.json` — adds `npm run welcome:film`.
- `docs/WELCOME_FILM_INTEGRATION.md` — canonical integration/provenance record.
- `docs/DEFINITIVE_COMPLETION_MATRIX.csv` / `docs/DEFINITIVE_COMPLETION_STATUS.json` — HM-07 moves from owner-blocked to proof-gated; counts become 99 / 47 / 32 across 178 requirements.
- `CURRENT_STATE.md`, `ROADMAP.md`, `HANDOFF.md`, `README.md`, `SETUP.md`, `QA_CHECKLIST.md`, `ASSET_INVENTORY.md`, `DECISIONS.md`, `docs/REMAINING_INTERNAL_WORK.md`, `docs/OWNER_PROVIDER_BLOCKERS.md`, `docs/PARKED_OWNER_ACTIONS.md`, `docs/TRANSCRIPT_OPEN_ITEMS.md`, `docs/TRANSCRIPT_LINE_BY_LINE_AUDIT.md`, `docs/TRANSCRIPT_RECONCILIATION_AUDIT.md`, and `docs/DEFINITIVE_COMPLETION_AUDIT.md` updated to reflect the real asset rather than a pending placeholder.

## Explicit non-changes
- No live deployment.
- No change to WooCommerce/native-commerce production mode.
- No TEDx/media-registry status change.
- No Community/Home/Science/Solutions/Guides/Book/About redesign.
- No package-lock or dependency change.
- The original 248 MB master is not bundled in the portable ZIP; its SHA-256 and metadata are preserved and the user already owns the supplied source file.

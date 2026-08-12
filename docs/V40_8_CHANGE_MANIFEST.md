# v40.8 change manifest

Changed runtime/source files:
- `app/community/page.tsx` — points Community and social metadata to complete full-frame generations derivatives.
- `app/globals.css` — fits the complete 2:3 poster inside the desktop viewport without crop; preserves responsive contain behavior.
- `app/build-version.ts` — v40.8 build identifier.
- `scripts/media-community-polish-audit.mjs` — regression checks for full authoritative asset, viewport-fit behavior, and no cover crop.
- `public/generations-full.webp` — complete desktop poster derivative from Chapter 2 blueprint source.
- `public/generations-full-mobile.webp` — complete mobile poster derivative from the same supplied source.

Governance/docs updated:
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `docs/DEFINITIVE_COMPLETION_MATRIX.csv` (HV-03 evidence only; counts unchanged)
- `docs/DEFINITIVE_COMPLETION_STATUS.json`
- `docs/DEFINITIVE_COMPLETION_AUDIT.md`
- `docs/V40_8_COMMUNITY_FULL_ARTWORK.md`
- review manifest/screenshots

No dependency, lockfile, provider, commerce, science, or other page behavior is intentionally changed.

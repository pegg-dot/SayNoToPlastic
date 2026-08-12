# v40.5 → v40.6 change manifest

Date: 2026-08-07

## Product/runtime changes

- `app/homo-plasticus/page.tsx`
  - replaces the old four-card shorthand with six broad book territories;
  - explicitly states the territory map is not the book's table of contents;
  - preserves official cover, price, purchase, FAQ, recovery, refund, and final CTA.
- `app/components/BookJourney.tsx`
  - keeps the premium four-state scroll interaction;
  - reframes those states as preview windows into a wider inquiry rather than a complete reading map/chapter structure.
- `app/about-dr-elie-haddad/page.tsx`
  - substantially reduces copy density while retaining the five-stage narrative arc;
  - keeps Education and all six philosophy principles;
  - removes visible owner-confirmation workflow language;
  - rebuilds the closing reflection into a wide desktop layout.
- `app/content/owner-facts.ts`
  - uses `Jackson Memorial / Jackson Health` for current public display based on the higher-authority transcript/Register;
  - keeps the older conflicting profile source recorded internally and does not promote the fact status to confirmed.
- `app/globals.css`
  - adds v40.6 Book territory layout and responsive rules;
  - reduces About chapter vertical load;
  - adds the horizontal closing-reflection composition and compact farewell.
- `app/build-version.ts`
  - bumps the source marker to v40.6.

## Audit/tooling changes

- `scripts/book-about-polish-audit.mjs` — new 23-check Book/About regression audit.
- `scripts/source-audit.mjs` — public Education presentation and internal provenance handling updated for the latest user decision.
- `scripts/transcript-priority-audit.mjs` — T08 now verifies that the conflict remains internal while the public workflow warning is absent.
- `scripts/ui-readiness-audit.mjs` — accepts the Book interaction's new `Book journey preview` navigation label.
- `scripts/nothing-left-behind-audit.mjs` — authoritative matrix count updated from 175 to 177.
- `package.json` — adds `npm run book-about:polish` only; dependencies unchanged.
- `package-lock.json` — **byte-identical to v40.5**.

## Requirements / project records

- Adds `BK-13` and `AB-14` to `docs/DEFINITIVE_COMPLETION_MATRIX.csv`.
- Updates authoritative count to **177 = 102 done/proven + 43 proof-gated + 32 owner/provider/source blocked**.
- Updates Education provenance notes without erasing the unresolved source conflict.
- Updates current state, roadmap, handoff, setup, QA checklist, decisions, validation, owner blockers, and remaining proof queue.
- Adds `docs/V40_6_BOOK_ABOUT_POLISH.md`.

## Non-changes / protections

- No checkout architecture change.
- No commerce mode change.
- No affiliate/media publication change.
- No TEDx publication change.
- No final education chronology/dates invented.
- No final book TOC/sample invented.
- No package dependency or lockfile change.
- No production deployment.

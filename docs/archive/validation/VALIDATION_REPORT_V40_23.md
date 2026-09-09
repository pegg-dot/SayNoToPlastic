# Validation Report — v40.23 Framing and Density Polish

Date: 2026-08-10

## Scope

v40.23 is a surgical rendered-review pass built directly on v40.22. It changes only three public-facing areas:

- Book-page framing for the science reading path;
- density and layout of the Dr. Haddad Exposome section;
- the Evidence Briefings introduction on Events & Media.

No route, source record, evidence state, briefing card, downloadable PDF, anatomy feature, guide, database migration, provider setting, commerce mode, dependency, or production resource was removed or replaced.

See `V40_23_CHANGE_MANIFEST.md` and `docs/V40_23_FRAMING_DENSITY_POLISH.md`.

## Dedicated v40.23 regression

`npm run framing:polish` => **18/18 passed**.

The dedicated audit confirms:

- the rejected Book and Media wording is absent from the rendered source;
- the replacement Book heading frames the section as science behind the book’s central questions;
- the reading-path and non-table-of-contents boundary remain explicit;
- all linked body-system topics and the detection-method page remain available;
- the Dr. Haddad page still contains the interactive Exposome map and its canonical route;
- desktop uses a tighter two-column section with a vertical category rail beside one focused panel;
- small screens preserve stacked content and horizontally reachable categories;
- tablist, tabpanel, arrow-key, Home, and End semantics remain intact;
- the Media page uses concise public-facing language;
- every briefing card still exposes its topic route and one-page PDF download;
- the v40.23 script, records, build identifier, and approved lockfile are present.

## Complete portable audit stack

All passed on the final working source:

- `syntax:audit` — **124 TypeScript/TSX files, 0 parser failures**.
- `ui:audit` — **12/12**.
- `clarity:audit` — **28/28**.
- `source:audit` — **32/32**.
- `links:audit` — **193 internal references, 0 broken** across 66 routes and 71 public assets.
- `homepage:polish` — **34/34**.
- `science:polish` — **33/33**.
- `solutions:polish` — **33/33**.
- `guides:polish` — **21/21**.
- `book-about:polish` — **23/23**.
- `media-community:polish` — **25/25**.
- `welcome:film` — **32/32**.
- `local:preflight` — **9/9**.
- `operations:audit` — **58/58**.
- `transcript:priority` — **15 resolved checks + 2 explicit rendered gates, 0 failures**.
- `transcript:complete` — **319/319**.
- `content:integration` — **141/141**.
- `completion:audit` — **45/45**.
- `anatomy:viewer` — **58/58**.
- `homepage:final` — **24/24**.
- `anatomy:complete` — **59/59**.
- `anatomy:integrated` — **24/24**.
- `layout:v40-21` — **42/42**.
- `layout:polish` — **22/22**.
- `framing:polish` — **18/18**.

Additional contracts:

- audience preflight — **12/12**;
- audience adapter contract — PASS for none, Resend, and Mailchimp;
- learning-series registry/scheduling/restart/unsubscribe contract — PASS;
- media preflight — **0 errors, 4 intentional verification warnings**;
- affiliate preflight — **0 errors, 1 unpublished-catalog warning**;
- commerce preflight — **16 passed, 6 parked warnings, 0 failures**;
- content-intake preflight — PASS for all four templates and publication boundaries.

## Script and database verification

- **36** `.mjs` files passed `node --check`.
- **5** Python files passed AST parsing without creating bytecode caches.
- **4** shell files passed `bash -n`.
- all seven SQL migrations (`0000` through `0006`) replayed in order against a fresh isolated SQLite database;
- **10 application tables**;
- **20 non-auto indexes**;
- `PRAGMA integrity_check` => **ok**;
- no production database or D1 resource was touched.

## Lockfile and dependency boundary

`package-lock.json` remains byte-identical to the approved baseline:

```text
7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e
```

One authentic `npm run install:ci` attempt was made. The unchanged locked `vinext` tarball URL returned HTTP 404 in this environment. No lockfile edit, dependency substitution, fake package, or bypass was used. Dependency-backed browser/build proof therefore remains a local acceptance gate.

## Browser acceptance still required

1. Review the Book reading-path heading and line breaks at desktop, tablet, phone, and 200% zoom.
2. Confirm the Dr. Haddad Exposome section is materially shorter and visually balanced at the owner’s laptop viewport.
3. Test all Exposome categories by click, Arrow keys, Home, and End; verify focus and selected-state contrast.
4. Confirm the compact map becomes a usable touch-scroll row on small screens without page-level horizontal overflow.
5. Review the Media briefing introduction and ensure every card, topic route, status note, and PDF download remains reachable.
6. Repeat connected-runtime QA after importing only as an unpublished Sites candidate.

Nothing was deployed or published. Production Sites v30 remains untouched.

## Archive cleanliness and replay

Before final packaging:

- npm debug logs, install locks, Node compile caches, Python bytecode, editor litter, `node_modules`, `.next`, `dist`, and `.wrangler` output were removed;
- the release source contained **603 clean project files**;
- a sorted SHA-256 manifest was generated for every packaged file;
- the ZIP passed compressed-file integrity testing;
- the archive was extracted into a completely clean directory;
- the extracted file manifest matched the source manifest byte-for-byte before any replay audit ran.

The clean extracted copy then passed the critical syntax, links, source, Book/About, Media/Community, content-integration, v40.22 layout, v40.23 framing, UI, clarity, and lockfile checks. The definitive archive checksum is distributed in the adjacent `.zip.sha256.txt` sidecar so the ZIP does not contain a self-referential checksum.

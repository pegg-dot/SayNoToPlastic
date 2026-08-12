# Validation Report — v40.22 Anatomy Navigation and Guides Reading-Room Polish

Date: 2026-08-09

## Scope

v40.22 is a rendered-review correction built directly on v40.21. It preserves the ten-chapter connected anatomy journey, Complete Body Atlas, Dr. Haddad content integration, practical tools, generated PDFs, learning-series architecture, welcome film, microplastic wordmark, commerce rails, and production rollback state.

The release corrects four specific presentation issues:

- removes the redundant floating Endocrine, Kidneys, Skin, and Digestive pills from the opening anatomy image while preserving chapters 07–10 in the main chapter navigation;
- recalibrates the shared brain transform so the brain remains inside the exterior head in both the scroll scene and Complete Body Atlas;
- removes the duplicated Exposome block from the main Science landing page while preserving the canonical `/science/exposome` route and cross-site entry points;
- balances the four Guides entry routes as a two-by-two grid and replaces the awkward pale reading-room field with a warmer, tighter editorial surface.

See `docs/V40_22_NAVIGATION_READING_ROOM.md` for the architecture and `V40_22_CHANGE_MANIFEST.md` for the change record.

## Dedicated v40.22 regression

`npm run layout:polish`:

- **22/22 passed**;
- redundant floating pills and their dead interface CSS are absent;
- all ten anatomy chapters remain available through the primary navigation;
- one shared brain calibration is consumed by both anatomy presentations;
- the audit parses the packaged body and brain GLB bounds and confirms the calibrated brain stays below the exterior head top and within the upper-head region;
- the main Science route no longer duplicates the Exposome experience;
- the canonical Exposome route and its practical/shared discovery paths remain available;
- four Guides entry routes use a balanced two-by-two desktop grid and one-column small-screen fallback;
- the reading room uses the warmer paper gradient, compressed vertical rhythm, compact featured cards, and restrained card interaction treatment;
- documentation, package script, build identifier, and approved lockfile are verified.

The inherited v40.21 layout contract also passed **42/42**, confirming that the chapter 07–10 focus states, concise visible-anatomy language, silhouette handoff, balanced Science system library, responsive rules, and earlier anatomy corrections remain intact.

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

Additional contracts:

- audience preflight — **12/12**;
- audience adapter contract — PASS for none, Resend, and Mailchimp;
- learning-series registry/scheduling/restart/unsubscribe contract — PASS;
- media preflight — **0 errors, 4 intentional verification warnings**;
- affiliate preflight — **0 errors, 1 unpublished-catalog warning**;
- commerce preflight — **16 passed, 6 parked warnings, 0 failures**;
- content-intake preflight — PASS for all four templates and publication boundaries.

## Script and database verification

- **35** `.mjs` files passed `node --check`.
- **5** Python files passed `py_compile`.
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

No dependency, lockfile, package stub, provider secret, production resource, or commerce mode was changed.

The environment still cannot provide dependency-backed browser/build proof because the unchanged locked `vinext` package path has returned HTTP 404 in this container. No lockfile edit, substitution, fake package, or bypass was used. Real-browser validation remains an explicit acceptance gate.

## Archive cleanliness and replay

Before final packaging:

- generated npm debug logs were removed from `.sites-runtime/npm-cache/_logs`;
- Python `__pycache__` and `.pyc` files were removed;
- no `node_modules`, `.next`, `dist`, `.wrangler`, `.DS_Store`, editor swap file, or temporary build artifact was included.

The definitive ZIP contains **563 clean project files**. It was:

1. tested for compressed-file integrity;
2. extracted into a completely clean directory;
3. compared against the final source SHA-256 manifest;
4. checked for unexpected extra or missing files;
5. rerun through the critical syntax, link, Science, Guides, content-integration, anatomy, v40.21 compatibility, v40.22 layout, and lockfile gates.

The clean extraction matched the final source manifest **byte-for-byte** and passed every replay check. The definitive SHA-256 checksum is distributed in the adjacent `.zip.sha256.txt` sidecar so the archive does not contain a self-referential checksum.

## Browser acceptance still required

1. Inspect brain placement in the opening body, Brain chapter, and Complete Body Atlas at normal zoom and 200% browser zoom.
2. Confirm chapters 07–10 remain reachable through the main ten-chapter navigation with no floating duplicate pills.
3. Review the Science transition after removing the duplicate Exposome block and confirm the dedicated Exposome route remains easy to find.
4. Review Guides at desktop, tablet, mobile, keyboard-only, reduced motion, and 200% zoom, especially the two-by-two route grid and warm reading-room transition.
5. Repeat connected-runtime QA after importing only as an unpublished Sites candidate.

Nothing was deployed or published. Production Sites v30 remains untouched.

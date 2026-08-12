# Validation Report — v40.21 Anatomy and Science Layout Polish

Date: 2026-08-09

## Scope

v40.21 is a rendered-review correction built directly on v40.20. It preserves the ten-chapter connected anatomy, Complete Body Atlas, Dr. Haddad content integration, practical tools, generated PDFs, learning-series architecture, welcome film, microplastic wordmark, commerce rails, and production rollback state.

The release corrects:

- brain-to-head alignment in the scroll scene and complete atlas;
- weak visual isolation in Endocrine, Kidney/Urinary, Skin, and Digestive chapters;
- abstract or awkward chapter statistics;
- technical sticky-stage copy;
- the ambiguous circular `ALL` atlas handoff;
- excessive whitespace and the orphan card in the Science body-system library;
- the repeated box-heavy Exposome dashboard on the main Science page.

See `docs/V40_21_ANATOMY_SCIENCE_LAYOUT.md` for the architecture and `V40_21_CHANGE_MANIFEST.md` for the changed-file record.

## Dedicated v40.21 regression

`node scripts/v40-21-layout-polish-audit.mjs`:

- **43/43 passed**
- shared brain calibration registered and reused;
- chapter 07–10 focus contracts preserved;
- concrete visible-anatomy counts present;
- short sticky-stage label present;
- silhouette-based complete-atlas handoff present;
- balanced Science library and compact Exposome flow present;
- responsive rules, documentation, lockfile, and package script verified.

## Complete portable audit stack

All passed on the final working source:

- `syntax:audit` — **124 TypeScript/TSX files, 0 parser failures**.
- `ui:audit` — **12/12**.
- `clarity:audit` — **28/28**.
- `source:audit` — **32/32**.
- `links:audit` — **194 internal references, 0 broken** across 66 routes and 71 public assets.
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
- `content:integration` — **140/140**.
- `completion:audit` — **45/45**.
- `anatomy:viewer` — **58/58**.
- `homepage:final` — **24/24**.
- `anatomy:complete` — **59/59**.
- `anatomy:integrated` — **22/22**.
- `layout:polish` — **43/43**.

Additional contracts:

- audience preflight — **12/12**;
- audience adapter contract — PASS for none, Resend, and Mailchimp;
- learning-series registry/scheduling/restart/unsubscribe contract — PASS;
- media preflight — **0 errors, 4 intentional verification warnings**;
- affiliate preflight — **0 errors, 1 unpublished-catalog warning**;
- commerce preflight — **16 passed, 6 parked warnings, 0 failures**;
- content-intake preflight — PASS for all four templates and publication boundaries.

## Script and database verification

- **34** `.mjs` files passed `node --check`.
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

The environment still cannot provide dependency-backed browser/build proof because the unchanged locked `vinext` package path has previously returned HTTP 404 in this container. No bypass was used. Real-browser validation remains an explicit acceptance gate.

## Archive cleanliness and replay

Before final packaging:

- generated npm debug logs were removed from `.sites-runtime/npm-cache/_logs`;
- Python `__pycache__` and `.pyc` files were removed;
- no `node_modules`, `.next`, `dist`, `.wrangler`, `.DS_Store`, or editor-temporary files were included.

The final ZIP was then:

1. tested for compressed-file integrity;
2. extracted into a clean directory;
3. compared against the final source manifest;
4. checked for unexpected extra or missing files;
5. rerun through the critical syntax, link, content-integration, anatomy, layout-polish, and lockfile gates.

The extracted package matched the final source manifest and passed the replay checks.

## Remaining acceptance gates

1. Open the final package on the owner’s Mac and verify the brain calibration and all remote HRA model alignment.
2. Review all ten chapter transitions and the complete atlas at desktop, tablet, mobile, keyboard-only, reduced motion, slow network, retry/fallback, and 200% zoom.
3. Obtain Dr. Haddad/editorial approval for the existing source-review topics and anatomy scope.
4. Import only as an unpublished Sites candidate and repeat connected-runtime QA before any production decision.

Nothing was deployed or published. Production Sites v30 remains untouched.

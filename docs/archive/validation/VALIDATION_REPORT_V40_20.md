# Validation Report — v40.20 Integrated Scroll Atlas

Date: 2026-08-09

## Scope

v40.20 is an incremental correction built directly on the existing v40.19 candidate. It does not create a new website or replace the approved homepage architecture.

The release makes the complete supported anatomy set visibly part of the main ten-chapter scroll while preserving the Complete Body Atlas after the scroll as an optional free-exploration mode.

## User-directed acceptance points

Source-level checks confirm that:

- chapter 01 shows the compatible female atlas layers together inside one body;
- reproductive, endocrine, urinary, and digestive geometry is loaded before the anatomy section reaches the viewport;
- brain, circulation, heart, pelvic skeleton, pregnancy/reproductive anatomy, exterior context, endocrine, urinary, and digestive layers share the same sticky stage;
- pregnancy anatomy remains present in the overview without obscuring the newly added systems;
- the opening body contains direct Endocrine, Kidneys, Skin, and Digestive chapter pins;
- the Complete Body Atlas can be opened directly from chapter 01 through **Open complete 3D**, not only from the handoff after chapter 10;
- later chapters keep the other compatible layers at contextual opacity while the active system brightens and the camera moves closer;
- chapters 07–10 continue to use the same registered geometry as their focused 3D viewers;
- the scroll, focused viewers, and Complete Body Atlas share one model registry and cache;
- competing duplicate endocrine pancreas/ovary surfaces are suppressed in the general overview and become prominent when the Endocrine chapter is focused;
- the male testicular specimen remains a separate scientific reference rather than being falsely merged into the female whole-body composite;
- responsive, keyboard-focus, reduced-motion, retry, fallback, attribution, and medical-boundary hooks remain present.

## Dedicated v40.20 and inherited anatomy audits

- `npm run anatomy:integrated` — **22/22 passed**.
- `npm run anatomy:complete` — **59/59 passed**.
- `npm run anatomy:viewer` — **58/58 passed**.
- `npm run homepage:final` — **24/24 passed**.
- `npm run completion:audit` — **45/45 passed**.
- `npm run content:integration` — **140/140 passed**.

## Complete portable regression stack

All source-level and contract checks passed:

- `npm run syntax:audit` — **124 TypeScript/TSX files, 0 parser failures**.
- `npm run ui:audit` — **12/12**.
- `npm run clarity:audit` — **28/28**.
- `npm run source:audit` — **32/32**.
- `npm run links:audit` — **194 internal references across 66 routes and 71 public assets, 0 broken**.
- `npm run homepage:polish` — **34/34**.
- `npm run science:polish` — **33/33**.
- `npm run solutions:polish` — **33/33**.
- `npm run guides:polish` — **21/21**.
- `npm run book-about:polish` — **23/23**.
- `npm run media-community:polish` — **25/25**.
- `npm run welcome:film` — **32/32**.
- `npm run local:preflight` — **9/9**.
- `npm run operations:audit` — **58/58**.
- `npm run transcript:priority` — **15 resolved checks + 2 explicit owner/rendered-review gates, 0 failures**.
- `npm run transcript:complete` — **319/319**.
- `npm run audience:preflight` — **12/12**.
- `npm run audience:test` — PASS for none, Resend, and Mailchimp adapter contracts.
- `npm run learning-series:test` — PASS.
- `npm run media:preflight` — **0 errors, 4 intentional verification warnings**.
- `npm run affiliate:preflight` — **0 errors, 1 expected unpublished-catalog warning**.
- `npm run commerce:preflight` — **16 passed / 6 parked warnings / 0 failures**.
- `npm run content:preflight` — PASS.

Additional code-file checks passed:

- all **33** `.mjs` files under `scripts/` and `tests/` passed `node --check`;
- all **4** packaged shell scripts passed `bash -n`;
- all **5** packaged Python scripts passed bytecode compilation;
- generated Python cache files were removed before packaging.

Detailed command output is packaged under `audit_logs_v40_20/`.

## Database migration replay

All seven migrations (`0000` through `0006`) were applied in order to a fresh isolated SQLite database using Python's built-in SQLite engine.

Result:

- **10 application tables**;
- **20 non-auto indexes**;
- learning-series uniqueness and operational indexes present;
- `PRAGMA integrity_check` => **ok**.

No production D1 resource was touched.

## Lockfile and dependency boundary

`package-lock.json` remains byte-identical to the approved baseline:

`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

One authentic `npm run install:ci` attempt was made against the final working source. The isolated install environment passed its writable-environment checks, then the unchanged locked `vinext` tarball URL returned HTTP 404. No dependency, lockfile, package stub, registry, source file, or build script was altered to bypass that environment limitation. Consequently, this report does not claim dependency-backed production build or full-browser proof from this container.

## Expected warnings and external gates

The passing preflight stack still records intentional external gates:

- two media publication dates remain pending verification;
- final owner confirmation remains separate for two authorized media entries;
- no recommendation catalog records are published yet;
- book `publicationDate`, `pageCount`, `isbn`, preview/sample permission, and final ebook checksum remain pending;
- native commerce activation is intentionally not enforced because normal mode remains `woocommerce`;
- final signature wordmark and reproductive/anatomy presentation retain explicit rendered-review/owner-approval gates;
- several Dr. Haddad body-system pages remain partial or source-review until their primary bibliographies are completed.

These warnings do not represent source-level failures and were not bypassed.

## Clean archive replay

The final delivery ZIP was tested with `unzip -t` and extracted into a fresh directory. Before any audit command was executed in the extracted copy, a sorted SHA-256 manifest of every regular file matched the cleaned working source byte-for-byte.

The extracted final archive then passed the critical release replay:

- `npm run syntax:audit` — **124 TypeScript/TSX files / 0 parser failures**;
- `npm run source:audit` — **32/32**;
- `npm run links:audit` — **194 internal references / 0 broken**;
- `npm run content:integration` — **140/140**;
- `npm run completion:audit` — **45/45**;
- `npm run anatomy:viewer` — **58/58**;
- `npm run homepage:final` — **24/24**;
- `npm run anatomy:complete` — **59/59**;
- `npm run anatomy:integrated` — **22/22**;
- extracted-copy `package-lock.json` SHA-256 matched the approved baseline.

The archive replay was performed from the packaged source itself, not from the working directory. Audit-generated npm debug logs and regenerated runtime files were not used as source-of-truth inputs to the pre-audit manifest comparison.

## Browser and visual proof boundary

Final local acceptance still requires the owner's Mac and an unpublished Sites candidate. The browser matrix must verify:

- chapter 01 after every remote HRA layer finishes loading;
- visual balance and anatomical alignment of the combined overview;
- direct opening pins and chapter-01 **Open complete 3D** behavior;
- all ten chapter transitions;
- each focused viewer and every Complete Body Atlas system filter;
- exterior, cutaway, system-only, full-body, focus-system, front, rear, zoom, reset, rotation, pan, wheel zoom, and pinch zoom;
- keyboard-only use, focus return, Escape, reduced motion, and 200% zoom;
- phone and tablet layouts;
- slow-network retry, partial-load disclosure, cached reuse, and offline fallback.

## Production status

Nothing was deployed or published. Production Sites v30, its URL, identity, hosting, storage, DNS, secrets, commerce default, and rollback state remain untouched.

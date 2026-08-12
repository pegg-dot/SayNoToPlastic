# Validation Report — v40.19 Ten-Chapter Anatomy and Complete Body Atlas

Date: 2026-08-09

## Scope

v40.19 is an incremental anatomy and readability correction built directly on the existing v40.18 candidate. It does not create a new website or replace the approved homepage architecture.

The release:

- condenses the right-side anatomy evidence display;
- integrates Endocrine, Kidneys/Urinary, Skin, and Digestive into the same scroll-controlled journey as the original six chapters;
- preserves direct focused 3D viewers for those four systems;
- adds a final Complete Body Atlas that combines the available exterior, brain, circulation, heart, pelvic skeleton, pregnancy, reproductive, represented endocrine, urinary, and digestive layers;
- preserves all existing non-anatomy routes, features, source states, provider architecture, commerce settings, package dependencies, and production rollback state.

## User-directed acceptance points

Source-level checks confirm that:

- the homepage has one integrated ten-chapter anatomy journey;
- the visible evidence view uses concise finding and uncertainty statements;
- methods, limits, and sources remain available on demand;
- each extended system occupies a synchronized chapter and can open its focused 3D viewer;
- the final complete-atlas handoff follows the scroll sequence;
- the complete viewer supports exterior, cutaway, system-only, full-body, focus-system, front, rear, zoom, reset, drag rotation, pan, and pinch/wheel zoom;
- composite system filters cover Skin, Brain, Circulation, Heart, Skeleton, Pregnancy, Reproductive, Endocrine, Urinary, and Digestive;
- focused viewers, scroll chapters, and the complete viewer share one lazy, cacheable model loader;
- missing anatomy is disclosed rather than fabricated;
- the separate male testicular chapter is not falsely overlaid into the female composite body;
- keyboard, focus trap, Escape, inert background, scroll lock, focus return, responsive layout, reduced motion, retry, and fallback hooks remain present.

## Dedicated v40.19 and inherited anatomy audits

- `npm run anatomy:complete` — **59/59 passed**.
- `npm run anatomy:viewer` — **58/58 passed**.
- `npm run homepage:final` — **24/24 passed**.
- `npm run completion:audit` — **45/45 passed**.
- `npm run content:integration` — **140/140 passed**.

The anatomy attribution record includes every runtime-loaded HRA surface, CC BY 4.0 licensing, primary and fallback delivery paths, first-load network behavior, caching, retry, and readable fallback behavior.

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

- all **32** `.mjs` files under `scripts/` and `tests/` passed `node --check`;
- all **4** packaged shell scripts passed `bash -n`;
- all **5** packaged Python scripts passed bytecode compilation;
- generated Python cache files were removed before packaging.

Detailed command output is packaged under `audit_logs_v40_19/`.

## Audit correction loop

The first complete-stack run exposed one documentation-level attribution mismatch. The runtime delivery wording was corrected, and both fallopian-tube surfaces used by the composite were added to the attribution list and regression expectations. The full portable stack was then rerun from the final source with every command passing. No model, dependency, lockfile, build bypass, or production resource was changed to resolve the finding.

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

The passing preflight stack still records several intentional external gates:

- two media publication dates remain pending verification;
- final owner confirmation remains separate for two authorized media entries;
- no recommendation catalog records are published yet;
- book `publicationDate`, `pageCount`, `isbn`, preview/sample permission, and final ebook checksum remain pending;
- native commerce activation is intentionally not enforced because normal mode remains `woocommerce`;
- the final signature wordmark and reproductive/anatomy presentation retain explicit rendered-review/owner-approval gates.

These warnings do not represent source-level failures and were not bypassed.

## Clean archive replay

The completed ZIP was tested with `unzip -t`, extracted into a fresh directory, and audited from the extracted copy. The clean archive passed:

- `npm run syntax:audit` — **124 files, 0 failures**;
- `npm run source:audit` — **32/32**;
- `npm run links:audit` — **194 internal references, 0 broken**;
- `npm run content:integration` — **140/140**;
- `npm run completion:audit` — **45/45**;
- `npm run anatomy:viewer` — **58/58**;
- `npm run homepage:final` — **24/24**;
- `npm run anatomy:complete` — **59/59**;
- package-lock SHA-256 — `7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`.

This confirms that the v40.19 source, audit scripts, documentation, routes, public assets, and anatomy registry survive packaging without relying on the original working directory.

## Browser and visual proof boundary

Final local acceptance still requires the owner's Mac and an unpublished Sites candidate. The browser matrix must verify:

- all ten scroll chapters and their camera transitions;
- condensed right-side copy at normal and 200% zoom;
- all four focused viewers;
- every complete-atlas group filter;
- exterior, cutaway, and system-only modes;
- focus-system, full-body, front, rear, zoom, reset, rotation, pan, wheel zoom, and pinch zoom;
- keyboard-only use, focus return, Escape, and reduced motion;
- phone and tablet layouts;
- slow-network retry, partial-load disclosure, and offline fallback;
- final anatomical alignment of every externally loaded HRA reference object.

## Production status

Nothing was deployed or published. Production Sites v30, its URL, identity, hosting, storage, DNS, secrets, commerce default, and rollback state remain untouched.

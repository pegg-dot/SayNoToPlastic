# Validation Report — v40.18 Home Anatomy Finalization

Date: 2026-08-09

## Scope

v40.18 is a rendered-review correction built directly on the existing v40.17 candidate. It removes the Home-only Exposome block and replaces the light four-card continuation with a full-viewport interactive anatomy showcase for Endocrine, Kidneys/Urinary, Skin, and Digestive systems.

The dedicated Exposome page and every non-home Exposome use remain intact. The six-scene anatomy journey, floating microplastics, full-screen v40.17 3D viewers, evidence routes, welcome film, wordmark, footer, content integration, action tools, Community programs, commerce configuration, and production rollback state remain preserved.

## User-directed acceptance points

Source-level checks confirm that:

- Home no longer imports or renders `ExposomeMap`;
- `/science/exposome` and the reusable Exposome component still exist;
- `HomeAnatomySystemShowcase` appears immediately after the existing `BodyJourney`;
- the showcase is sized to fill a desktop viewport below the 82px header;
- systems 07–10 are arranged in a balanced two-by-two desktop atlas;
- each system has a direct **Open 3D anatomy** action and a separate evidence-overview link;
- all four actions reuse the existing accessible `AnatomySystemViewer` rather than creating a second viewer architecture;
- focus returns to the opening card after the dialog closes;
- tablet, mobile, keyboard-focus, and reduced-motion rules are present.

## Complete portable regression stack

All commands below completed successfully against the final working source:

- `npm run syntax:audit` — **125 TypeScript/TSX files, 0 parser failures**.
- `npm run ui:audit` — **12/12**.
- `npm run clarity:audit` — **28/28**.
- `npm run source:audit` — **32/32**.
- `npm run links:audit` — **187 internal references, 0 broken** across 66 routes and 71 public assets.
- `npm run homepage:polish` — **34/34**.
- `npm run science:polish` — **33/33**.
- `npm run solutions:polish` — **33/33**.
- `npm run guides:polish` — **21/21**.
- `npm run book-about:polish` — **23/23**.
- `npm run media-community:polish` — **25/25**.
- `npm run welcome:film` — **32/32**.
- `npm run local:preflight` — **9/9**.
- `npm run operations:audit` — **58/58**.
- `npm run transcript:priority` — **15 resolved checks + 2 explicit gates, 0 failures**.
- `npm run transcript:complete` — **319/319**.
- `npm run content:preflight` — PASS for all four intake templates and publication boundaries.
- `npm run content:integration` — **140/140**.
- `npm run completion:audit` — **45/45**.
- `npm run anatomy:viewer` — **50/50**.
- `npm run homepage:final` — **21/21**.
- `npm run audience:preflight` — **12/12**.
- `npm run audience:test` — PASS for none, Resend, and Mailchimp adapter contracts.
- `npm run learning-series:test` — PASS.
- `npm run commerce:preflight` — **16 passed / 6 parked warnings / 0 failures**.
- `npm run affiliate:preflight` — **0 errors**, expected unpublished-catalog warning.
- `npm run media:preflight` — **0 errors / 4 intentional verification warnings**.

The v40.18-specific audit additionally verifies Exposome removal from Home, preservation of the dedicated Exposome route, canonical system reuse, direct 3D entry, the full-viewport geometry, responsive breakpoints, focus styling, reduced-motion handling, versioning, and lockfile integrity.

## Lockfile and dependency gate

`package-lock.json` remains byte-identical to the approved v40.9+ baseline:

`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

One authentic `npm run install:ci` attempt was made. The isolated install environment passed its writable-environment checks, then the unchanged locked `vinext` tarball URL returned HTTP 404. No dependency, lockfile, registry, package stub, or build script was changed to bypass the failure.

Therefore this environment does **not** claim dependency-backed production build or full-browser proof.

## Visual/browser proof boundary

A lightweight headless-Chromium fixture was attempted as an additional geometry check, but this container cannot complete Chromium rendering reliably because its desktop/DBus environment is unavailable. That environment-only failure is not counted as browser proof.

Final acceptance still requires running v40.18 on the owner's Mac and checking:

- desktop, tablet, and mobile layout;
- each of the four 3D viewers;
- exterior, cutaway, and system-only modes;
- rotation, pan, wheel zoom, and pinch zoom;
- front, rear, focus-system, full-body, and reset controls;
- keyboard-only operation and focus return;
- 200% zoom and reduced motion;
- slow-network retry and offline fallback;
- final anatomical alignment of every externally loaded HRA surface.


## Clean archive replay

A provisional v40.18 ZIP was created, tested with `unzip -t`, extracted into a new clean directory, and audited from the extracted copy. The archive copy passed:

- `npm run syntax:audit`;
- `npm run links:audit`;
- `npm run content:integration`;
- `npm run anatomy:viewer`;
- `npm run homepage:final`.

This confirms that the final source changes, audit scripts, routes, documentation, and public assets survive packaging without relying on the original working directory.

## Warnings that remain intentionally parked

- Publication date, page count, ISBN, final ebook PDF, and preview permission remain owner/source inputs.
- Media dates and final owner confirmation remain verification items.
- Affiliate catalog remains intentionally unpublished.
- HRA organ surfaces load at runtime from the registered official release/fallback URLs; the first open therefore requires a working network connection.

## Production status

Nothing was deployed or published. Production Sites v30, its URL, hosting identity, resources, DNS, secrets, storage, commerce default, and rollback state remain untouched.

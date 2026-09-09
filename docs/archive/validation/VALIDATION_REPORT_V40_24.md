# v40.24 Validation Report

Status: portable source and archive validation complete. Browser acceptance remains a local/connected-runtime gate.

## Scope

v40.24 is a content-architecture and reading-density cleanup built directly on v40.23. It does not replace the site or change the production deployment. The release reduces repeated public content, tightens body-system and Guide layouts, removes reader-facing editorial workflow labels, and centralizes press briefings in the Press Kit.

## Working-source validation

The final working source passed the current portable audit stack:

- syntax audit: 124 TypeScript/TSX files checked, 0 failures;
- UI readiness: 12/12;
- clarity: 28/28;
- source audit: 32/32;
- link audit: 194 internal references across 66 routes and 71 public assets, 0 broken;
- homepage: 34/34;
- Science: 33/33;
- Solutions: 33/33;
- Guides: 20/20;
- Book/About: 23/23;
- Media/Community: 25/25;
- welcome film: 32/32;
- v40.16 completion-compatibility audit: 39/39;
- v40.17 anatomy viewer: 58/58;
- v40.18 homepage-final compatibility: 24/24;
- v40.19 complete atlas: 59/59;
- v40.20 integrated atlas: 24/24;
- v40.21 layout compatibility: 42/42;
- v40.22 layout compatibility: 22/22;
- v40.23 framing compatibility: 18/18;
- v40.24 content-architecture cleanup: 24/24;
- Haddad content integration: 141/141;
- nothing-left-behind: 319/319;
- local portability: 9/9;
- operations: 58/58;
- audience adapter contract: passed for none, Resend, and Mailchimp;
- learning-series backend contract: passed;
- content-intake templates: passed;
- transcript priority: 15 resolved checks, 2 explicit gates, 0 failures;
- commerce preflight: 16 passed, 6 parked warnings, 0 failures;
- media preflight: 2 entries, 0 errors, 4 explicit verification warnings;
- affiliate preflight: 0 errors, 1 expected empty-catalog warning.

All 37 packaged `.mjs` audit/test files passed `node --check`, all five Python files passed bytecode compilation, and all four shell scripts passed `bash -n`.

## Database replay

All seven SQL migrations were replayed in order against a fresh isolated SQLite database:

- 10 application tables;
- 20 indexes;
- `PRAGMA integrity_check`: `ok`.

No production database was touched.

## Dependency-backed browser/build boundary

An authentic `npm run install:ci` attempt was made with Node v22.16.0. The packaged install guard passed, then the unchanged locked `vinext` tarball URL returned HTTP 404. The package lock was not edited, no dependency was substituted, and the failure was not bypassed. For that reason this environment does not claim a dependency-backed Vite/vinext browser or production build.

Local browser acceptance should still cover desktop, tablet, mobile, keyboard navigation, reduced motion, 200% zoom, Guide readability, body-system image crops, and the anatomy viewers.

## Lockfile and production boundary

`package-lock.json` SHA-256 remains:

`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

Commerce remains in WooCommerce mode. No production Sites deployment, URL, DNS, storage binding, secret, or rollback state was changed.

## Archive validation

Archive validation is complete. Temporary runtime/install artifacts and Python bytecode were removed before packaging. The final source contains 607 files. The ZIP passed compressed-file integrity testing, was extracted into a fresh directory, and the extracted SHA-256 file manifest matched the working source byte-for-byte before any packaged-copy audits ran.

The extracted package then passed the critical current checks again: 124-file syntax audit, 0 broken internal links, 32/32 source audit, 20/20 Guides, 33/33 Science, 23/23 Book/About, 25/25 Media/Community, 24/24 v40.24 cleanup, 141/141 Haddad integration, 319/319 nothing-left-behind, 58/58 anatomy viewer, 59/59 Complete Body Atlas, and 24/24 integrated-scroll atlas. The extracted `package-lock.json` also matched the approved baseline hash.

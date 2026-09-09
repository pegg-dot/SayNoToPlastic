# Validation report — v40.27 final pre-deploy polish

Date: 2026-08-10
Base: v40.26
Production deployment: **not performed**

## Scope

This pass implements the final user-requested cleanup before deployment planning:

1. Remove the large public Quick Action Card “Editorial note” panel.
2. Preserve concise item-level evidence cautions on contested authored Quick Action Card items 10 and 11.
3. Fix the Community hero/header collision so the “Say No To Plastic” eyebrow and hero copy begin below the fixed header.
4. Package a clear owner/provider checklist separating preview deployment, WooCommerce launch, optional native Stripe activation, and remaining Dr. Haddad/provider inputs.

## Dedicated v40.27 audit

`node scripts/v40-27-final-predeploy-audit.mjs`

Result: **13/13 passed**.

The audit verifies:

- the v40.27 build identifier;
- removal of the large editorial-note panel and its dead CSS;
- continued rendering of inline review notes;
- retention of the two explicit contested-claim evidence cautions;
- Community v40.27 scope and fixed-header clearance on desktop/mobile;
- preservation of the approved full generations artwork, eager loading, signup, and hero message;
- owner-action record alignment;
- inclusion of the pre-deployment checklist;
- byte-identical approved package lock.

## Full portable source audit suite

The complete non-build portable audit suite was rerun after the final changes. **All 32 registered portable npm audit/preflight scripts passed**, plus the dedicated v40.27 audit.

Selected results:

- Source audit: **32/32**
- TypeScript/TSX syntax audit: **124 files / 0 parser failures**
- Internal-link audit: **193 references / 0 broken links**
- UI readiness: **12/12**
- Clarity: **28/28**
- Operations: **58/58**
- Solutions polish: **33/33**
- Media + Community polish: **25/25**
- Welcome film: **32/32**
- Dr. Haddad content integration: **141/141**
- v40.16 completion preservation: passed after later user-approved replacements were recognized
- v40.17 viewer preservation: passed
- v40.18 homepage preservation: passed
- v40.19 Complete Body Atlas preservation: passed
- v40.20 integrated anatomy preservation: passed
- v40.21 layout preservation: **42/42**
- v40.22 final layout preservation: **22/22**
- v40.23 framing preservation: **18/18**
- v40.24 content architecture: **24/24**
- v40.25 reading flow: **22/22**
- v40.26 inline navigation: **15/15**
- v40.27 final pre-deploy polish: **13/13**

Historical regression scripts were updated only where later explicit user decisions superseded the earlier presentation (for example: public Community curriculum removal, press-brief centralization, anatomical-image replacement, v40.27 editorial-note removal, and later version identifiers). The underlying evidence and operational gates remain preserved.

## Script syntax validation

- JavaScript `.mjs` audit/test files checked with `node --check`: **40**
- Python scripts compiled: **5**
- Shell scripts checked with `bash -n`: **4**

All passed. Generated Python bytecode was deleted before packaging.

## Database migration replay

All seven packaged SQL migrations were replayed in order against a fresh isolated SQLite database using Python's standard SQLite driver.

Result:

- migrations: **7**
- application tables: **10**
- indexes: **20**
- `PRAGMA integrity_check`: **ok**

No connected or production database was touched.

## Package-lock integrity

`package-lock.json` SHA-256 remains:

`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

Dependencies were not changed.

## Runtime/browser boundary

The source-level and portable audits do not replace final browser QA in the owner's actual runtime. Before public cutover, visually verify at minimum:

- `/quick-action-card` — no large Editorial note panel; item-level cautions remain readable;
- `/community` — eyebrow, heading, artwork, signup, and header no longer overlap;
- desktop, tablet, mobile, keyboard-only, reduced motion, and 200% zoom;
- the existing anatomy/3D model network-loading and fallback behavior;
- checkout/email behavior for the production mode actually selected.

The connected/native production providers remain intentionally inactive. Nothing in this package deploys automatically.

## Deployment handoff

Use `docs/V40_27_PREDEPLOY_CHECKLIST.md` as the canonical checklist for the remaining owner/provider work. The most important architecture decision remains:

- **WooCommerce launch:** native Stripe/D1/R2 commerce is not required; verify the existing WooCommerce purchase/download/recovery flow.
- **Native Stripe launch:** requires explicit approval and the full Stripe + D1 + private R2 + Resend + scheduler + smoke-test activation gate before changing `COMMERCE_MODE=stripe`.


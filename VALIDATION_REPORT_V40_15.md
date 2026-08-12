# Validation Report — v40.15 Dr. Haddad Content Integration

Date: 2026-08-08

## Scope

v40.15 is an incremental content and information-architecture expansion built directly on `homo_plasticus_v40_14`. It does not replace the existing site. The approved wordmark, welcome film, one-viewport modal, compact footer, six-scene anatomy journey, 14-guide library, WooCommerce production default, provider boundaries, and published Sites v30 remain unchanged.

The candidate integrates ten Dr. Haddad-supplied PDFs through one canonical content layer rather than pasting all prose into one page:

1. practical exposure reduction;
2. female reproductive health;
3. endocrine and metabolic system;
4. kidneys and urinary system;
5. skin;
6. detection methods;
7. digestive system;
8. the exposome;
9. pregnancy, placenta, and early life;
10. cardiovascular system.

Exact PDF copies and layout-preserving text extracts are preserved under `docs/sources/haddad-content/`, and each PDF hash is registered in `docs/sources/SOURCE_MANIFEST.md`.

## Implemented architecture

- Seven canonical body-system pages under `/science/body/[slug]`.
- A detection-method explainer at `/science/how-detection-works`.
- An interactive exposome route at `/science/exposome`.
- A long-form practical-action route at `/solutions/reduce-exposure`.
- Compact reuse across Home, the existing anatomy journey, Science, Solutions, Guides, Book, About, Media, Press Kit, Community, Recommendations, Editorial Policy, Medical Disclaimer, footer discovery, sitemap, RSS, and `llms.txt`.
- One structured source of truth in `app/content/body-systems.ts`, `app/content/haddad-topics.ts`, and `app/content/science-connections.ts`.

The existing verified Science evidence ledger remains authoritative for study-specific statistics, methods, limitations, and primary links. Narrative source states are explicit:

- **1 verified:** cardiovascular system;
- **2 partial:** female reproductive health; pregnancy and early life;
- **4 source-review:** endocrine/metabolic; kidneys/urinary; skin; digestive.

All `source-review` body-system pages use `noindex,follow` until their missing primary bibliographies are attached and approved. No lungs page was invented because no lungs source PDF was supplied.

## Content-preservation audit

`npm run content:integration` => **140/140 passed, 0 failed**.

The audit verifies:

- all seven body-system records, canonical routes, reusable components, route reuse, source states, and publication gates;
- preservation of the major ideas and explicit uncertainty boundaries in all ten supplied PDFs;
- exact source-file presence and SHA-256 registration;
- sitewide reuse across the approved existing architecture;
- unchanged package lock, WooCommerce default, welcome-film mount, and shared approved wordmark.

## Complete portable regression stack

All source-level and portable checks passed:

- `npm run syntax:audit` — **114 files, 0 parser failures**.
- `npm run ui:audit` — **12/12**.
- `npm run clarity:audit` — **28/28**.
- `npm run source:audit` — **32/32**.
- `npm run links:audit` — **183 internal references / 66 routes / 62 public assets, 0 broken**.
- `npm run homepage:polish` — **34/34**.
- `npm run science:polish` — **33/33**.
- `npm run solutions:polish` — **33/33**.
- `npm run guides:polish` — **21/21**.
- `npm run book-about:polish` — **23/23**.
- `npm run media-community:polish` — **25/25**.
- `npm run welcome:film` — **32/32**.
- `npm run local:preflight` — **9/9**.
- `npm run operations:audit` — **49/49**.
- `npm run transcript:priority` — **15 resolved checks + 2 explicit gates, 0 failures**.
- `npm run transcript:complete` — **319/319**.
- `npm run audience:preflight` — **12/12**.
- `npm run audience:test` — **PASS** for none, Resend, and Mailchimp adapter contracts.
- `npm run media:preflight` — **0 errors, 4 intentional warnings**.
- `npm run affiliate:preflight` — **0 errors, 1 expected unpublished-catalog warning**.
- `npm run commerce:preflight` — **16 passed / 6 parked warnings / 0 failures**.
- `npm run content:preflight` — **PASS**.
- `npm run content:integration` — **140/140**.
- every `.mjs` file under `scripts/` and `tests/` passed `node --check` — **27 files**.

## Database migration replay

All six migrations (`0000` through `0005`) were applied in order to a fresh isolated SQLite database.

Result:

- **9 application tables**;
- **18 non-auto indexes**;
- `PRAGMA integrity_check` => **ok**.

No production D1 resource was touched.

## Lockfile and dependency gate

`package-lock.json` remains byte-identical to the approved v40.9+ lock:

`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

One authentic `npm run install:ci` attempt was made after the content integration. The install environment passed its writable-runtime checks, then the unchanged locked `vinext` tarball download returned HTTP 404:

`[sites] downloading the complete locked vinext tarball`

`curl: (22) The requested URL returned error: 404`

No lockfile edits, dependency substitutions, fake package stubs, registry bypasses, or alternate builds were used. This environment therefore cannot claim dependency-backed lint, production build, rendered HTML tests, or full-app browser proof.

## Remaining acceptance work

Source-level implementation is complete, but code presence is not publication approval. Before any unpublished Sites import or production publish:

1. run the candidate locally in a dependency-capable environment;
2. inspect desktop, tablet, mobile, keyboard order, reduced motion, and 200% zoom;
3. test all seven body-system slugs, detection, exposome, and exposure-reduction routes;
4. confirm the existing Home/anatomy/header/footer/welcome-film experiences remain visually intact;
5. obtain Dr. Haddad/editorial approval of wording and source-state labels;
6. attach and review missing primary papers before promoting `source-review` pages;
7. preserve production Sites v30 and import only as an unpublished candidate until accepted.

Production Sites v30 remains unchanged.

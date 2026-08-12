# v40.15 — layered content integration record

v40.15 is a content-and-information-architecture expansion of the existing v40.14 site. It is not a new build and does not replace accepted layouts or interactions.

## Input

Ten short-form PDFs supplied by the user on behalf of Dr. Haddad:

1. Reduce exposure
2. Female reproductive health
3. Endocrine and metabolic system
4. Kidneys and urinary system
5. Skin
6. Detecting microplastics
7. Digestive system
8. Exposome diagram
9. Pregnancy, placenta, and early life
10. Cardiovascular system

## Integration rule

Each topic receives one canonical route. Home, anatomy, Guides, Book, About, Media, Community, and policy pages reuse compact representations and route visitors to the canonical page. This prevents walls of text, duplicate claims, and inconsistent future updates.

## Evidence rule

The supplied PDFs define narrative intent. The existing verified evidence ledger remains authoritative for study-specific statistics, methods, limitations, and primary paper links. Missing bibliographies stay visible as source gates. No source-review page is treated as production-approved by the existence of code alone.

## Architecture

See:

- `docs/HADDAD_CONTENT_INTEGRATION_MAP.md`
- `docs/sources/haddad-content/README.md`
- `docs/HADDAD_PRIMARY_SOURCE_REVIEW_QUEUE.md`
- `app/content/body-systems.ts`
- `app/content/haddad-topics.ts`

## Acceptance

Source-level completeness is enforced by `npm run content:integration`, which now covers **140/140** architecture, preservation, source-state, route, and topic-substance checks. The full portable audit stack also passed, including **319/319** nothing-left-behind checks and **0 broken internal links**.

Visual/browser acceptance remains separate and must cover desktop, tablet, mobile, keyboard, reduced motion, and 200% zoom before any production import. The unchanged locked `vinext` tarball returned HTTP 404 in this container, so this package does not claim dependency-backed build or browser proof. See `VALIDATION_REPORT_V40_15.md`.

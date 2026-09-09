# v40.15 change manifest — Dr. Haddad content integration

**Date:** 2026-08-08  
**Base:** `homo_plasticus_v40_14`  
**Candidate:** `homo_plasticus_v40_15`  
**Production:** Sites v30 unchanged

## Purpose

Integrate the substance of ten Dr. Haddad-supplied PDFs into the existing website without creating a replacement site, a single wall-of-text page, or uncontrolled duplicate copy.

## Added — structured content

- `app/content/body-systems.ts` — seven canonical body-system narratives with known/uncertain boundaries, takeaways, cross-links, primary-source state, and source-document provenance.
- `app/content/haddad-topics.ts` — detection-method, exposome, and practical exposure-reduction data.
- `app/content/science-connections.ts` — category-based science connections for the existing guide system.

## Added — reusable components

- `app/components/BodySystemLibrary.tsx`
- `app/components/DetectionPrimer.tsx`
- `app/components/ExposomeMap.tsx`

## Added — canonical routes

- `app/science/body/[slug]/page.tsx`
  - cardiovascular system
  - female reproductive health
  - endocrine and metabolic system
  - kidneys and urinary system
  - skin
  - digestive system
  - pregnancy and early life
- `app/science/how-detection-works/page.tsx`
- `app/science/exposome/page.tsx`
- `app/solutions/reduce-exposure/page.tsx`

## Enhanced — existing site routes

- Home: compact Exposome module, more-systems library, and topic-aware exposure links.
- Anatomy journey: deep links from the existing Heart, Pregnancy, and Ovary chapters.
- Science: detection primer, seven-system library, and Exposome bridge around the unchanged verified study ledger.
- Solutions: exposure framework and canonical long-form route while preserving the exact core rules and one-change planner.
- Guides: every existing guide can display connected science; catalog remains 14 records.
- Book: project-question cards without inventing a table of contents.
- About: Exposome connection within the existing narrative.
- Media and Press Kit: evidence briefing routes.
- Community: ten-reading Field Notes curriculum and Learn → Act → Share pathway.
- Recommendations: science-to-product boundary.
- Editorial policy: claim ladder, evidence type, contamination control, source-status, and product rules.
- Medical disclaimer: pregnancy, fertility, cardiovascular, kidney, digestive, endocrine, skin, and practical-action boundaries.
- Header/footer Explore links, sitemap, RSS feed, and `llms.txt`: canonical discovery routes added.

## Source and publication safety

- Exact ten PDFs preserved under `docs/sources/haddad-content/pdf/`.
- Layout-preserving text extracts preserved under `docs/sources/haddad-content/text/`.
- SHA-256 hashes added to `docs/sources/SOURCE_MANIFEST.md`.
- Each body-system page visibly reports `verified`, `partial`, or `source-review` status.
- `source-review` pages use `noindex,follow` until the primary bibliography is attached and approved.
- Supplied prose is not presented as a substitute for original papers.
- No lungs content was invented because no lungs PDF was supplied.

## Added — documentation and audit

- `docs/HADDAD_CONTENT_INTEGRATION_BLUEPRINT.md`
- `docs/HADDAD_CONTENT_INTEGRATION_MAP.md`
- `docs/HADDAD_PRIMARY_SOURCE_REVIEW_QUEUE.md`
- `docs/sources/haddad-content/README.md`
- `scripts/haddad-content-integration-audit.mjs`
- `npm run content:integration`

## Updated audit rails

- Link audit now registers data-backed body-system routes and Science chapter IDs.
- Science polish audit recognizes seven canonical system overviews while retaining seven human research studies.
- Source audit accepts the broader Say No to Plastic Field Notes feed while retaining movement-level publisher identity.

## Final source validation

- `npm run content:integration` — **140/140**.
- `npm run transcript:complete` — **319/319**.
- `npm run links:audit` — **183 references / 66 routes / 62 assets, 0 broken**.
- All other portable audit commands passed; see `VALIDATION_REPORT_V40_15.md` for the complete stack.
- All six database migrations replayed successfully to an isolated SQLite database: **9 tables / 18 indexes / integrity ok**.
- One authentic locked dependency install attempt reached the unchanged `vinext` tarball and received HTTP 404. No lockfile or dependency workaround was used.

## Explicitly unchanged

- Existing visual identity, approved microplastic wordmark, header/footer design, welcome film, modal behavior, anatomy models, and six synchronized anatomy chapters.
- Existing verified evidence records and study statistics.
- Existing 14-guide catalog.
- Existing WooCommerce production default.
- Existing package dependencies and `package-lock.json`.
- Existing Sites URL, hosting/storage resources, and published Sites v30.
- No production publish, deployment, DNS change, secret, provider activation, final ebook file, or commerce-mode change.

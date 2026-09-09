# Validation Report — v40.16 Completion Pass

**Date:** 2026-08-09  
**Base:** `homo_plasticus_v40_15`  
**Candidate:** `homo_plasticus_v40_16`  
**Production:** Sites v30 unchanged  
**Build identifier:** `hp-site-2026-08-09-v40.16-completion-pass`

## Scope

v40.16 is an additive completion pass on the existing v40.15 site. It closes the tangible omissions identified after the ten-document Dr. Haddad content integration without replacing the approved site architecture, visual identity, canonical science pages, six-scene anatomy journey, welcome film, wordmark, footer, guide catalog, commerce mode, or production resources.

Implemented in this pass:

- optional digestive, kidneys, endocrine, and skin anatomy reference points with an accessible nonmodal drawer;
- seven topic-specific conceptual body-system diagrams;
- the explicit Home “Progress, not perfection” bridge;
- a Quick Action Card route into the complete exposure guide;
- a device-local exposure worksheet with print, reset, and blank-PDF download;
- device-local ten-reading progress, seven-day reset, and 30-day practice tools;
- a consent-based ten-part learning-series registry and durable operations path;
- six downloadable evidence-aware press briefings;
- reproducible PDF generation, asset hashes, completion audits, and activation documentation.

No dedicated lungs/respiratory article was added because the supplied source set did not contain a dedicated lungs document.

## Source and editorial boundaries

The v40.16 experience continues to use the ten source documents registered under `docs/sources/haddad-content/`:

- cardiovascular system;
- detecting microplastics;
- digestive system;
- endocrine and metabolic system;
- exposome diagram;
- female reproductive health;
- kidneys and urinary system;
- pregnancy, placenta, and early life;
- reduce exposure;
- skin.

The implementation preserves the v40.15 evidence states. Pages without a complete primary bibliography remain `noindex,follow`; the generated press briefings visibly carry their source-review state; practical tools are educational rather than medical treatment, diagnosis, detox, or outcome guarantees; and established medical care, hygiene, food safety, infant feeding, accessibility, and emergency needs remain first.

## v40.16 completion audit

`npm run completion:audit` proves the completion-pass invariants at source and artifact level:

- anatomy explorer mounted without replacing the six approved chapters;
- accessible nonmodal drawer with known/uncertain framing and keyboard closure;
- seven conceptual body-system visuals mounted by the canonical article template;
- Home, Quick Action Card, and exposure worksheet connections;
- device-local worksheet and challenge fallbacks when browser storage is unavailable;
- ten-reading registry, consent-based series enrollment, and 7/30-day challenge plans;
- strict lesson ordering, stale-welcome replacement after token rotation, recoverable post-send state ordering, terminal-series shutdown, and unsubscribe cancellation;
- migration, readiness, operations runbook, and contract test;
- Media and Press Kit brief downloads;
- all nine generated PDFs, generator, and manifest;
- no invented lungs route;
- v40.16 build identifier and unchanged package lock.

Result: **45 passed / 0 failed**.

## Complete portable regression stack

All commands below passed against the final working source:

- `npm run syntax:audit` — **122 TypeScript/TSX files, 0 parser failures**.
- `npm run ui:audit` — **12/12**.
- `npm run clarity:audit` — **28/28**.
- `npm run source:audit` — **32/32**.
- `npm run links:audit` — **188 internal references across 66 routes and 71 public assets, 0 broken**.
- `npm run homepage:polish` — **34/34**.
- `npm run science:polish` — **33/33**.
- `npm run solutions:polish` — **33/33**.
- `npm run guides:polish` — **21/21**.
- `npm run book-about:polish` — **23/23**.
- `npm run media-community:polish` — **25/25**.
- `npm run welcome:film` — **32/32**.
- `npm run local:preflight` — **9/9**.
- `npm run operations:audit` — **58/58**.
- `npm run transcript:priority` — **15 resolved checks + 2 explicit rendered/owner gates, 0 failures**.
- `npm run transcript:complete` — **319/319**.
- `npm run audience:preflight` — **12/12**.
- `npm run audience:test` — PASS for none, Resend, and Mailchimp adapter contracts.
- `npm run learning-series:test` — PASS for registry, schedule, restart, ordering, unsubscribe, and challenge contracts.
- `npm run media:preflight` — **0 errors / 4 intentional verification warnings**.
- `npm run affiliate:preflight` — **0 errors / 1 expected unpublished-catalog warning**.
- `npm run commerce:preflight` — **16 passed / 6 parked warnings / 0 failures**.
- `npm run content:preflight` — PASS.
- `npm run content:integration` — **140/140**.
- `npm run completion:audit` — **45/45**.

Additional syntax verification:

- all **29** `.mjs` files under `scripts/` and `tests/` passed `node --check`;
- all **5** packaged Python scripts passed `python -m py_compile`;
- all **4** packaged shell scripts passed `bash -n`.

The warning-only gates remain intentional: temporary/current media verification, an unpublished recommendations catalog, parked native-commerce activation values, final ebook verification, final owner wordmark status in the historic transcript ruler, and rendered clinical/anatomy acceptance.

## Learning-series operations verification

The v40.16 operations path includes:

- consent-specific `program="learning-series"` enrollment;
- a unique email + sequence enrollment record;
- ten dated outbox jobs over 30 days;
- explicit restart that kills and replaces unsent series work;
- stale pending-welcome replacement when a token rotates for an already-active subscriber;
- leased claims, bounded retries, provider idempotency, and payload scrubbing;
- strict `next_step` delivery ordering;
- enrollment advancement before final job scrubbing after provider success, allowing a retry to self-heal if the last database update fails;
- terminal shutdown when provider configuration or delivery exhausts retries;
- local unsubscribe plus cancellation of unsent series work;
- protected readiness and drain routes;
- an activation, monitoring, test, pause, and rollback runbook in `docs/LEARNING_SERIES_OPERATIONS.md`.

The series is implemented but remains inactive until the owner applies migration `0006`, configures the D1 binding, approved email provider, secrets, scheduler, final HTTPS origin, and a test recipient.

## Generated PDF verification

Nine PDFs were generated reproducibly with `scripts/generate-v40-16-pdfs.py`:

- two-page exposure worksheet;
- two-page seven-day challenge;
- five-page 30-day challenge;
- six one-page evidence briefings.

`docs/V40_16_GENERATED_ASSET_MANIFEST.csv` records the path, byte count, SHA-256 hash, page count, generator, and review state for every file.

Final validation confirmed for all nine files:

- valid `%PDF-` header and `%%EOF` marker;
- byte count and SHA-256 match the manifest;
- declared page count matches `pdfinfo`;
- US Letter page size;
- public URLs use `saynotoplastic.com` rather than the stale `.org` form;
- all **15 pages** render successfully at 150 dpi with the PDF skill renderer;
- rendered contact-sheet and full-page visual inspection found no obvious clipping, overlap, black boxes, or broken glyphs.

These are editorial companion assets and review candidates. They do not replace final medical/source approval.

## Database migration replay

All seven migrations (`0000` through `0006`) were applied in order to a fresh isolated SQLite database using Python's built-in SQLite engine.

Result:

- **10 application tables**;
- **20 non-auto indexes**;
- learning-series unique email + sequence constraint confirmed;
- `PRAGMA integrity_check` => **ok**.

No production D1 resource was read, written, or migrated.

## Lockfile and dependency gate

`package-lock.json` remains byte-identical to the approved v40.9+ lock:

```text
7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e
```

One authentic `npm run install:ci` attempt was made in the packaged writable Sites environment. It passed the environment checks but the unchanged locked `vinext` tarball URL returned HTTP 404. No lockfile edit, dependency substitution, fake package, vendored stub, or bypass was used.

Because the dependency graph could not be installed in this container, this report does **not** claim dependency-backed lint, production build, or full-app browser proof here.

## Browser-fixture attempt

A supplementary headless Chromium component-fixture attempt was made, but the browser zygote/DBus environment stalled and produced no screenshots. That environment-only attempt is not counted as rendered proof and no failed fixture artifact is packaged.

## Final archive validation

The complete candidate was compressed, extracted into a fresh directory, and validated from the archive rather than the working tree. The extracted package passed:

- syntax audit: **122 files / 0 failures**;
- internal-link audit: **188 references / 0 broken**;
- source audit: **32/32**;
- operations audit: **58/58**;
- Dr. Haddad content-integration audit: **140/140**;
- v40.16 completion audit: **45/45**;
- learning-series contract test: PASS;
- nothing-left-behind audit: **319/319**;
- package-lock SHA-256 verification;
- all nine generated-PDF manifest hashes and page counts.

After this report was finalized, the release archive was rebuilt and the same key archive checks were repeated against the final ZIP. No transient `.sites-runtime`, cache, compiled Python, `node_modules`, `.next`, or `dist` content is included.

## Remaining acceptance gates

Before production publication:

1. Run `npm run install:ci` and `npm run dev` on the owner's dependency-capable Mac.
2. Review Home, anatomy explorer/drawer, all seven body-system visuals, exposure worksheet, Community learning/challenges, Media, and Press Kit at desktop, tablet, mobile, 200% zoom, keyboard-only navigation, and reduced motion.
3. Confirm print behavior for the worksheet and both challenge plans.
4. Obtain Dr. Haddad's wording approval and complete the primary-source queue for partial/source-review topics.
5. Configure and test the learning-series migration, provider, operations secret, scheduler, test recipient, unsubscribe, retry, ordering, terminal failure, monitoring, and rollback flows before activating delivery.
6. Import as an unpublished Sites candidate, preserving the existing site identity, URL, resources, and rollback, then repeat browser and interaction proof in the connected runtime.

Production Sites v30 remains unchanged. No domain, DNS, hosting, storage, provider secret, commerce activation, or publication action was performed.

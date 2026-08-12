# v40.16 change manifest — completion pass

**Date:** 2026-08-09  
**Base:** `homo_plasticus_v40_15`  
**Candidate:** `homo_plasticus_v40_16`  
**Production:** Sites v30 unchanged

## Added — anatomy and science experience

- `app/components/AnatomySystemExplorer.tsx` — optional digestive/kidneys/endocrine/skin hotspots and accessible nonmodal reference drawer.
- `app/components/BodySystemVisual.tsx` — seven topic-specific conceptual diagrams.
- Existing `BodyJourney` and canonical body-system template now mount those additions without replacing the approved six-scene journey or article structure.

## Added — practical tools

- `app/components/ExposureWorksheet.tsx` — device-local interactive exposure worksheet.
- Quick Action Card link to the full exposure guide.
- Home “Progress, not perfection” bridge and worksheet link.
- Printable `public/downloads/reduce-exposure-worksheet.pdf`.

## Added — Community programs

- `app/content/community-programs.ts` — ten-part reading/email registry, seven-day reset, and 30-day practice.
- `app/components/CommunityLearningPath.tsx` — device-local reading progress.
- `app/components/CommunityChallenge.tsx` — accessible 7/30-day plans, device-local progress, print, and PDFs.
- Community route enrollment and challenge sections.
- `public/downloads/sntp-7-day-challenge.pdf` and `sntp-30-day-challenge.pdf`.

## Added — learning-series operations

- `drizzle/0006_learning_series.sql` and matching Drizzle schema.
- `app/lib/learning-series.ts` — enrollment, explicit restart, advancement, completion, cancellation, and terminal-series shutdown.
- Learning-series support in subscribe, unsubscribe, email service, durable outbox, and readiness routes, with strict lesson ordering, stale-welcome replacement after token rotation, recoverable post-send state ordering, and shutdown after terminal provider or delivery failure.
- `docs/LEARNING_SERIES_OPERATIONS.md`.
- `scripts/learning-series-contract-test.mjs` and `npm run learning-series:test`.

## Added — press resources

- `app/content/press-briefs.ts`.
- Download cards on Media and Press Kit.
- Six one-page PDFs under `public/press-briefs/`.

## Added — reproducible asset and completion audit

- `scripts/generate-v40-16-pdfs.py`.
- `scripts/v40-16-completion-audit.mjs` and `npm run completion:audit`.
- `docs/V40_16_COMPLETION_PASS.md`.

## Updated — policy, discovery, and documentation

- Privacy Policy describes requested email program state and device-local tools.
- Terms clarify that worksheets, challenges, and the learning series are educational.
- `public/llms.txt`, README, Current State, Handoff, Roadmap, QA checklist, project tree, and asset inventory advance to v40.16.

## Explicitly unchanged

- Existing site identity and approved design system.
- Header/footer microplastic wordmark.
- Welcome film, first-visit memory, replay, and one-viewport modal.
- Existing six-scene anatomy journey, models, and floating microplastic field.
- Existing canonical v40.15 content and verified evidence ledger.
- Fourteen-guide catalog.
- `COMMERCE_MODE=woocommerce` default.
- Dependencies and `package-lock.json`.
- Production Sites v30, URL, hosting, storage, secrets, DNS, and rollback state.

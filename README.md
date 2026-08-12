# Homo Plasticus / Say No to Plastic — v40.34 deployment release candidate

v40.34 is the final portable release-candidate handoff built directly on v40.33. The visible site behavior is unchanged from v40.33. This pass aligns the historical regression suite and release documentation with the final approved architecture and provides the definitive deployment/owner-input runbooks.

Start with:
- `VALIDATION_REPORT_V40_34.md`
- `docs/V40_34_SITES_DEPLOYMENT.md`
- `docs/V40_34_EXTERNAL_INPUTS_FROM_DR_HADDAD.md`

Production remains unchanged until an explicit publish in the existing ChatGPT Site.

---

# Homo Plasticus / Say No to Plastic — v40.23

This package is a rendered-review refinement built directly on v40.22. It replaces awkward Book and Media framing and compacts the Dr. Haddad Exposome section into a denser vertical-control layout without changing routes, evidence, interactive behavior, dependencies, or production.

Run:

```bash
npm run install:ci
npm run framing:polish
npm run dev
```

See `VALIDATION_REPORT_V40_23.md`, `V40_23_CHANGE_MANIFEST.md`, `docs/V40_23_FRAMING_DENSITY_POLISH.md`, and `QA_CHECKLIST.md`. Nothing in this package deploys automatically.

---

# Homo Plasticus / Say No to Plastic — v40.22

This package is a rendered-review correction built directly on v40.21. It removes redundant floating anatomy pills, shares a head-aligned brain calibration across the scroll and Complete Body Atlas, removes the duplicated Exposome bridge from the main Science page, balances the four Guides entry routes two-by-two, and refines the ivory reading-room rhythm. No existing route, evidence record, guide, anatomy chapter, interactive atlas control, dependency, or production resource is replaced.

Run:

```bash
npm run install:ci
npm run dev
```

Primary release gates:

```bash
npm run layout:polish
npm run anatomy:integrated
npm run anatomy:complete
npm run science:polish
npm run guides:polish
```

See `VALIDATION_REPORT_V40_22.md`, `V40_22_CHANGE_MANIFEST.md`, `docs/V40_22_NAVIGATION_READING_ROOM.md`, and `QA_CHECKLIST.md`. Nothing in this package is deployed automatically.

---

---

# Homo Plasticus / Say No to Plastic — v40.20

This package extends the existing v40.19 site. The ten-chapter homepage anatomy now keeps the complete supported atlas visible within the same sticky scroll experience: the selected organ/system comes forward, but the rest of the represented body no longer disappears. The final movable Complete Body Atlas remains available after chapter ten.

Run:

```bash
npm run install:ci
npm run dev
```

Primary release gate:

```bash
npm run anatomy:integrated
```

See `VALIDATION_REPORT_V40_20.md`, `V40_20_CHANGE_MANIFEST.md`, `docs/V40_20_INTEGRATED_SCROLL_ATLAS.md`, and `QA_CHECKLIST.md`. Nothing in this package is deployed automatically.

---

# Say No to Plastic / Homo Plasticus — v40.19 ten-chapter anatomy and complete atlas

**Current source candidate:** v40.19, built directly on v40.18. The existing homepage anatomy journey now contains ten synchronized chapters, concise evidence summaries, four focused extended-system viewers, and a final Complete Body Atlas containing every available registered system. Production Sites v30 remains unchanged.

See `V40_19_CHANGE_MANIFEST.md`, `VALIDATION_REPORT_V40_19.md`, and `docs/V40_19_TEN_CHAPTER_COMPLETE_ATLAS.md`.

## Quick local review

```bash
npm run install:ci
npm run anatomy:complete
npm run anatomy:viewer
npm run homepage:final
npm run dev
```

Open `/`, complete chapters 01–10, open each focused viewer, then select **Show the complete body** and test every layer, filter, view mode, camera control, rotation, pan, wheel/pinch zoom, retry, and focus return.

The first opening of remote HRA organ surfaces requires internet access. The composite is an educational reference assembly, not a patient scan or complete clinical anatomy product.

---

## Prior v40.18 record

# Say No to Plastic / Homo Plasticus — v40.18 Home anatomy finalization

**Current source candidate:** v40.18, built directly on v40.17. The Home Exposome feature has been removed after rendered review. In its place, the four extended systems now form a full-viewport anatomy atlas with direct entry into the existing accessible 3D viewers and separate evidence-overview links. The dedicated Exposome route remains intact. Production Sites v30 remains unchanged.

See `V40_18_CHANGE_MANIFEST.md`, `VALIDATION_REPORT_V40_18.md`, and `docs/V40_18_HOME_ANATOMY.md`.

## Quick local review

```bash
npm run install:ci
npm run homepage:final
npm run anatomy:viewer
npm run dev
```

Open `/`, complete the six-scene anatomy journey, then review systems 07–10 and open all four 3D viewers.

---

## Prior v40.17 record

# Say No to Plastic / Homo Plasticus — v40.17 interactive anatomy

**Current source candidate:** v40.17, built directly on the existing v40.16 completion pass. The four optional Skin, Endocrine, Kidneys, and Digestive hotspots now open accessible full-screen 3D viewers with rotation, zoom, pan, exterior/cutaway/system-only modes, full-body/system framing, front/rear/reset controls, licensed HRA reference surfaces, retry/fallback handling, and explicit anatomical scope. Production Sites v30 remains unchanged.

See `V40_17_CHANGE_MANIFEST.md`, `VALIDATION_REPORT_V40_17.md`, and `docs/V40_17_INTERACTIVE_ANATOMY.md`.

## Quick local review

```bash
npm run install:ci
npm run anatomy:viewer
npm run dev
```

Open `/`, scroll to the anatomy journey, select **Explore four more systems**, and test each hotspot. The first open of the kidney, digestive, or endocrine viewer requires internet access for official HRA organ surfaces; skin and the exterior shell are local.

---


## Prior v40.15 record


# Say No to Plastic / Homo Plasticus — v40.13 Microplastic wordmark

**Current source candidate:** v40.13. It inherits the accepted v40.12 short-footer work and replaces the shared live text lockup with the exact one-line microplastic wordmark selected by the user on 2026-08-08. Header, footer, and the small footer movement mark now use transparent derivatives from that approved artwork. Production remains unchanged on Sites v30.

Immediate visual gate: run the site locally and confirm the new wordmark is crisp and uncrowded in the desktop/mobile header and remains proportionate in the compact footer.

---

## Prior v40.12 record

# Say No to Plastic / Homo Plasticus — v40.12 Short footer

**Current source candidate:** v40.12. It inherits v40.11 and applies the second rendered-review correction: a substantially shorter inheritance band and footer, including a side-by-side desktop Field Notes form. Production remains unchanged on Sites v30.

---

## Prior v40.11 record

# Say No to Plastic / Homo Plasticus — v40.11 Compact footer

**Current source candidate:** v40.11. It inherits v40.10 and compacts footer typography/spacing after local rendered review. Production remains unchanged on Sites v30.

---

## Prior v40.10 record

# Say No to Plastic / Homo Plasticus — v40.10 One-viewport welcome modal

**Current source candidate:** v40.10, built from v40.9 after local rendered review found the real welcome-film popup too tall. The real film remains integrated in the first-visit/replay dialog and Events & Media; v40.10 changes only the modal geometry so standard viewports fit the complete popup without normal scrolling. Production remains unchanged on Sites v30.

The current visual-proof sequence is screenshot-driven and surgical: accepted areas are preserved, concrete rendered defects are corrected, and every correction is regression-audited against the transcript/Register ruler. See `CURRENT_STATE.md`, `ROADMAP.md`, `docs/WELCOME_FILM_INTEGRATION.md`, and `VALIDATION_REPORT.md`.

---

# Say No to Plastic / Homo Plasticus

Portable application source for the **Say No to Plastic** science-to-action website and the *Homo Plasticus* ebook experience.

## Version boundary

- **Published site:** Sites v30 at the existing ChatGPT Sites URL; unchanged by this package.
- **Connected unpublished Sites candidate:** imported v37 operational-resilience candidate; not deployed.
- **Portable reconstruction baseline:** complete v38 source + preserved v39 audit/completion records.
- **This source:** **v40.16 completion pass**; built on the existing v40.15 candidate, source/PDF/database-audited, not deployed or published.
- **Production commerce default:** `COMMERCE_MODE=woocommerce`.

The full earlier v39 source ZIP was not present in the active runtime when this pass began. v39.1 therefore does not claim byte-for-byte descent from that artifact: it reconstructs the recorded v39 improvements on the complete v38 codebase, then adds the newly recovered transcript/blueprint requirements and audit rails.

## Product rule

1. **Use less plastic where practical.**
2. Start with the exact book rules: **don’t heat plastic, don’t store food in plastic, don’t drink from plastic.**
3. Choose one realistic change at a time.
4. Keep science, the full Quick Action Card, and detailed guides as optional depth.
5. Do not present source/code presence as visual, clinical, owner, or provider approval.

## What the current v40.16 candidate carries forward

- Integrates the user-supplied Dr. Haddad welcome film as a 9:16 H.264/AAC web asset with a matching poster; the original 248 MB HEVC master is identified by filename/hash in provenance metadata but is not duplicated inside every portable ZIP.
- Uses the real film in the first-visit homepage dialog, homepage replay control, and Events & Media; playback is click-to-start with no sound autoplay and portrait framing is contained rather than cropped.
- Corrects the rendered welcome-popup height defect: standard laptop/tablet/mobile layouts are bounded to one viewport, while heavy zoom/tiny effective viewports retain a controlled accessibility scroll escape hatch.
- Keeps captions/transcript and spoken-content verification as explicit launch-proof work rather than pretending the asset placement finishes accessibility.
- Corrects the acceptance ruler from 150 to **179 explicitly tracked requirements**, including two later Book/About rendered-review requirements.
- Adds line-range traceability back to the raw meeting transcript and section-level traceability to the Master Delivery Register and both blueprint chapters.
- Preserves the original 53-minute meeting audio and keeps independent audio-to-transcript fidelity review as explicit proof gate `SG-02`.
- Restores the approved maternal/fetal hero art as the active Home visual with responsive derivatives and live UI.
- Adds concrete exposure-route visuals matching Dr. Haddad’s examples and increases exposure copy scale.
- Restores the approved kitchen/reverse-osmosis visual on **Solutions**, preserving the later instruction to keep Home brief.
- Preserves the approved three-generations visual on the dedicated `/community` route with responsive desktop/mobile derivatives and live form/copy; the latest rendered review explicitly removes the giant generations panel from Home.
- Preserves the inheritance quote as live text while the later rendered review supersedes the Earth-photo treatment with a flat dark field and faint abstract Earth curve; the original Earth asset remains preserved for provenance.
- Uses the user-approved one-line microplastic wordmark in shared header/footer chrome, with transparent high-resolution raster derivatives and preserved accessible text labels.
- Preserves and hashes all ten Dr. Haddad-supplied content PDFs, with layout-preserving text extracts and a route/source-state register.
- Adds seven canonical body-system pages, a detection-method explainer, an interactive Exposome route, and a long-form exposure-reduction route.
- Reuses the new material across the existing site through compact modules and cross-links instead of duplicating full articles.
- Keeps verified study data separate from supplied narrative and protects source-review pages from indexing until bibliography approval.
- Adds `npm run content:integration`, a 140-check source, architecture, preservation, and topic-coverage audit.
- Adds an optional four-system anatomy explorer and seven conceptual body-system diagrams without replacing the approved six-scene journey.
- Adds a device-local exposure worksheet plus seven-day and 30-day Community plans with reproducible printable PDFs.
- Adds a consent-based ten-part learning-series registry, durable scheduling/outbox state, unsubscribe cancellation, readiness checks, and operations runbook; production delivery remains configuration-gated.
- Adds six source-status one-page press briefs to Media and Press Kit.
- Adds `npm run completion:audit` and `npm run learning-series:test` for v40.16 invariants.
- Restores blueprint-aligned Home SEO intent and a 1200×630 social-card candidate.
- Formalizes design-system, viewport, media-video, newsletter, sculpture-photo, About-source-conflict, source-gap, and post-launch-review requirements that the old 150-row matrix under-tracked.
- Adds `npm run transcript:complete`, a machine-checkable nothing-left-behind audit.
- Preserves the v38/v39 simplification, native-commerce, operations, guide/media/affiliate, accessibility, and provider-boundary infrastructure.
- Makes the Home Events & Media navy band full-bleed while keeping its content grid-aligned.
- Removes the oversized generations artwork from Home without deleting the Community visual requirement.
- Removes the Science “How to read this page” helper block.
- Uses the supplied full-body science illustration as a subdued hero background behind live text.
- Splits the supplied Brain/Heart/Placenta/Testicle/Ovary/Blood reference collage into six independent chapter visuals instead of rendering one combined image.
- Preserves the v40.2 Science imagery integration and now applies the later flat footer treatment globally after repeated rendered feedback.
- Rebuilds the lower Solutions kitchen/guides sequence into one full-bleed ivory field with a contained editorial grid, removes the visible Solutions Evidence Boundary strip, and tightens planner/optional-depth flow.
- Fixes the browser-discovered CSS specificity conflict that collapsed the kitchen visual into a thumbnail, and adds a regression guard for that exact failure.
- Makes the Guides reading-room ivory field full-bleed while keeping its content on the shared editorial grid, and reflows the featured reads into a full-width three-card row.
- Reframes the Book page so four preview states are not mistaken for the whole book; the dedicated page now shows six broad territories without inventing a table of contents.
- Cuts the Dr. Haddad page literal copy roughly in half while preserving the five-stage narrative arc, Education, all six philosophy principles, and final actions.
- Removes visible owner-confirmation workflow language from Education while preserving unresolved provenance internally and avoiding invented fellowship institutions/dates.
- Rebuilds the closing reflection into a wide desktop composition instead of a tall one-sided quote stack.

See:

- `docs/V39_1_NOTHING_LEFT_BEHIND.md`
- `docs/DEFINITIVE_COMPLETION_AUDIT.md`
- `docs/DEFINITIVE_COMPLETION_MATRIX.csv`
- `docs/RAW_TRANSCRIPT_TRACEABILITY.md`
- `docs/BLUEPRINT_TRACEABILITY.md`
- `docs/REGISTER_TRACEABILITY.md`

## Portable source checks

```bash
npm run syntax:audit
npm run ui:audit
npm run clarity:audit
npm run source:audit
npm run links:audit
npm run homepage:polish
npm run science:polish
npm run solutions:polish
npm run guides:polish
npm run book-about:polish
npm run local:preflight
npm run operations:audit
npm run transcript:priority
npm run transcript:complete
npm run audience:preflight
npm run audience:test
npm run media:preflight
npm run welcome:film
npm run affiliate:preflight
npm run commerce:preflight
npm run content:preflight
npm run content:integration
```

## Full build and browser gate

```bash
npm run install:ci
npm run lint
npm run build
npm test
npm run dev:commerce-preview
```

The final browser gate must use the 179-row completion matrix and `QA_CHECKLIST.md`; it must not regress to the older 150-row count.

# Handoff — v40.34 deployment release candidate

**Authoritative source:** `homo_plasticus_v40_34`

This is the final portable release candidate built on v40.33. No new visual redesign is introduced here. The final source preserves the user-approved anatomy, system-aware microplastic flow, reading architecture, content deduplication, and WooCommerce-safe default while making the regression suite and release documentation agree with the final product.

## Next operator action

1. Read `VALIDATION_REPORT_V40_34.md` and `docs/V40_34_SITES_DEPLOYMENT.md`.
2. Collect the required owner inputs in `docs/V40_34_EXTERNAL_INPUTS_FROM_DR_HADDAD.md`.
3. Open the **existing** connected ChatGPT Site (original Site chat or Sites sidebar → edit), attach the v40.34 ZIP, preserve project/storage/domain/rollback identity, and request a review build without publishing.
4. Run the connected build and browser QA matrix.
5. Configure only the external providers approved for launch.
6. Publish only after explicit owner/editorial approval and a saved rollback/version point.

Production Sites v30 remains unchanged until that explicit publish step.

---

# Handoff — v40.23 framing and density polish

Current candidate: **v40.23**, built directly on v40.22. Production remains unchanged on Sites v30.

This pass changes only public-facing framing and section density on the Book, Dr. Haddad, and Media pages. It preserves the site architecture, content sources, evidence states, routes, interactive Exposome behavior, downloads, dependencies, and rollback boundary.

Immediate next step: run the candidate locally and visually approve the three corrected sections before any unpublished Sites import.

---

# Handoff — v40.22 anatomy navigation and Guides reading-room polish

Current candidate: **v40.22**, built directly on v40.21. Production remains unchanged on Sites v30.

The opening anatomy body now uses one interaction model: the ten-chapter navigation. The redundant floating system pills are gone, the brain uses one head-aligned transform in both 3D contexts, the main Science page no longer repeats the Exposome feature, and the four Guides routes now form a balanced two-by-two grid. The full Exposome route, all ten anatomy chapters, Complete Body Atlas, body-system pages, fourteen guides, welcome film, wordmark, footer, commerce configuration, and rollback state remain intact.

Next operator sequence:

1. Read `VALIDATION_REPORT_V40_22.md`, `V40_22_CHANGE_MANIFEST.md`, and `docs/V40_22_NAVIGATION_READING_ROOM.md`.
2. Run `npm run layout:polish`, `npm run anatomy:integrated`, `npm run anatomy:complete`, `npm run science:polish`, and `npm run guides:polish`.
3. Run the site locally and inspect the brain placement, ten-chapter navigation, Science transition, two-by-two Guides routes, and ivory reading room across desktop/tablet/mobile, keyboard, reduced motion, and 200% zoom.
4. Import only as an unpublished Sites candidate; preserve production v30 and rollback.

---

---

# Handoff — v40.20 integrated scroll atlas

## Authoritative source

Use `homo_plasticus_v40_20` as the working source. It is an incremental update on v40.19, not a replacement site.

## Owner-rendered defect addressed

The owner clarified that the complete anatomy should not appear only in the final free-exploration atlas. The main ten-chapter scroll must also show the added systems inside one connected body. v40.20 gives every scene a persistent atlas context and raises the extended systems in chapter 01.

## Key implementation files

- `app/components/AnatomyScene.tsx` — context floors, opening-scene opacities, shared registry groups, section-near loading, and continuous transitions.
- `app/components/BodyJourney.tsx` — preload trigger, opening pins, context messaging, and ten-chapter narrative.
- `app/content/anatomy-system-models.ts` — shared complete-atlas model registry and provenance.
- `app/globals.css` — opening pin/context badge styling and responsive behavior.
- `scripts/v40-20-integrated-scroll-atlas-audit.mjs` — release regression gate.

## Safety and truthfulness

The body remains a cross-dataset educational composite. It does not imply one patient, a complete clinical atlas, or causation. Missing anatomy is not fabricated. Remote HRA failures retain local/fallback behavior. `package-lock.json`, dependencies, commerce mode, provider settings, production resources, and Sites v30 are unchanged.

## Next operator action

Run locally, inspect chapter 01 after the remote layers finish loading, navigate every chapter, test the four direct pins and final Complete Body Atlas, then complete the acceptance matrix in `QA_CHECKLIST.md`. Do not publish before connected-runtime and editorial approval.

---

# Handoff — v40.19 ten-chapter anatomy and complete atlas

Current candidate: **v40.19**, built directly on the existing v40.18 site. Production remains unchanged on Sites v30.

The homepage now contains one continuous ten-chapter anatomy journey. The original six chapters remain, while Endocrine, Kidneys/Urinary, Skin, and Digestive are integrated as chapters 07–10. The right-side evidence presentation is concise by default, with full study context, limitations, and sources preserved under progressive disclosure. After chapter ten, **Show the complete body** opens a composite interactive atlas with the available exterior and registered anatomical systems.

Next operator sequence:

1. Read `VALIDATION_REPORT_V40_19.md`, `V40_19_CHANGE_MANIFEST.md`, and `docs/V40_19_TEN_CHAPTER_COMPLETE_ATLAS.md`.
2. Run `npm run anatomy:complete`, `npm run anatomy:viewer`, `npm run homepage:final`, and the complete portable audit stack.
3. Run the site locally and inspect all ten scroll chapters, four focused viewers, and the Complete Body Atlas at desktop/tablet/mobile, keyboard, touch, reduced motion, and 200% zoom.
4. Verify exterior/cutaway/system-only modes, every system filter, full-body/focus framing, front/rear/zoom/reset, rotation, pan, wheel/pinch zoom, retry, partial-load disclosure, and offline fallback.
5. Confirm every remote HRA surface aligns acceptably within the educational composite and that no missing structure is implied.
6. Obtain Dr. Haddad/editorial approval, then import only as an unpublished Sites candidate while preserving production v30 and rollback.

The first load of remote HRA organ surfaces requires internet access. The complete atlas is an educational composite assembled from multiple reference datasets; it is not a patient reconstruction, complete clinical anatomy product, or diagnostic model.

---

# Handoff — v40.18 Home anatomy finalization

Current candidate: **v40.18**, built on the existing v40.17 site. Production remains unchanged on Sites v30.

The rendered-review corrections are complete: the Home Exposome module is gone, while the dedicated Exposome route remains. The former light four-card continuation is now a full-viewport dark anatomy atlas. Endocrine, Kidneys/Urinary, Skin, and Digestive are numbered 07–10, reuse the canonical content registry, open the existing full-screen 3D viewer directly, and retain separate evidence links.

Next operator sequence:

1. Read `VALIDATION_REPORT_V40_18.md`, `V40_18_CHANGE_MANIFEST.md`, and `docs/V40_18_HOME_ANATOMY.md`.
2. Run `npm run homepage:final`, `npm run anatomy:viewer`, and the complete portable audit stack.
3. Start the site locally and visually inspect the new full-screen section at desktop, tablet, mobile, keyboard, reduced motion, and 200% zoom.
4. Open all four viewers from both the anatomy hotspot layer and the new Home cards; verify full-body/system framing, outside/cutaway/system modes, model alignment, retry, and focus return.
5. Import only as an unpublished Sites candidate; preserve production v30 and rollback.

---

# Handoff — v40.17 interactive extended-system anatomy

Current candidate: **v40.17**, built on the existing v40.16 site. Production remains unchanged on Sites v30.

The four optional anatomy reference points are no longer text-only drawers. Skin, Endocrine, Kidneys, and Digestive now open full-screen interactive 3D viewers with a complete exterior body shell, cutaway and isolated-system modes, model-aware camera fitting, rotation, zoom, pan, front/rear/reset controls, provenance, retry, partial-load handling, and an honest fallback. No existing chapter, source article, action tool, Community feature, press brief, email workflow, or commerce behavior was replaced.

The organ surfaces are intentionally lazy-loaded from official Human Reference Atlas v1.2 endpoints only when a visitor opens a viewer. The skin surface and exterior shell remain local. The first open of a non-skin viewer therefore requires internet access; this is disclosed in the interface and must be tested in the real browser. Do not substitute decorative geometry for a missing organ or describe the reference surfaces as patient scans.

Next operator sequence:

1. Read `VALIDATION_REPORT_V40_17.md`, `V40_17_CHANGE_MANIFEST.md`, and `docs/V40_17_INTERACTIVE_ANATOMY.md`.
2. Run `npm run anatomy:viewer` and the complete portable audit stack.
3. Run the site locally and test all four viewers at desktop/tablet/mobile, keyboard, reduced motion, 200% zoom, touch/pinch, slow network, retry, and offline fallback.
4. Confirm the HRA surfaces align within the local exterior shell and that each structure listed in the legend is actually visible.
5. Obtain Dr. Haddad/editorial approval, then import only as an unpublished Sites candidate while preserving production v30 and rollback.

---

# Handoff — v40.16 completion pass

Current candidate: **v40.16**, built on the existing v40.15 site. Production remains unchanged on Sites v30.

The post-integration completion pass is implemented: optional anatomy hotspots, seven body-system visuals, exposure worksheet, 7/30-day Community plans, a durable ten-part learning-series path, and six downloadable press briefs. Existing design, content routes, welcome film, wordmark, footer, commerce default, and production resources are preserved.

The learning series is code-complete but intentionally inactive until migration `0006`, Resend, `PUBLIC_SITE_URL`, `OPERATIONS_SECRET`, a protected scheduler, and a test recipient are approved. Source-review pages remain noindex. Do not confuse code presence, generated PDFs, or supplied narrative with medical/publication approval.

Next operator sequence:

1. Read `VALIDATION_REPORT_V40_16.md` and `V40_16_CHANGE_MANIFEST.md`.
2. Run the site locally in a dependency-capable environment and complete the v40.16 QA block in `QA_CHECKLIST.md`.
3. Obtain Dr. Haddad/editorial approval and attach missing primary sources.
4. Follow `docs/LEARNING_SERIES_OPERATIONS.md` only after provider activation is approved.
5. Import as an unpublished Sites candidate; preserve production v30 and rollback.

---

## Prior v40.15 record

# Handoff — v40.15 Dr. Haddad content integration

Current candidate: **v40.15**, built on the existing v40.14 site. Production remains unchanged on Sites v30.

The ten supplied Dr. Haddad PDFs are now a structured, reusable content layer rather than one pasted document. The verified Science ledger remains intact. New canonical body-system, detection, exposome, and exposure-reduction routes feed compact modules across the rest of the site. Every body-system page states what is known, what remains uncertain, which source document it came from, and whether the primary-source record is verified, partial, or still under review.

Do not treat code presence as publication approval. Source-review pages are protected from indexing, and a candidate bibliography queue is documented separately. The complete portable audit stack has passed. The next operator should review `VALIDATION_REPORT_V40_15.md`, conduct real-browser QA in a dependency-capable environment, obtain Dr. Haddad/editorial signoff, and attach missing primary papers before any production publish.

Key files: `V40_15_CHANGE_MANIFEST.md`, `VALIDATION_REPORT_V40_15.md`, `docs/HADDAD_CONTENT_INTEGRATION_MAP.md`, `docs/HADDAD_PRIMARY_SOURCE_REVIEW_QUEUE.md`, and `docs/sources/haddad-content/README.md`.

---

# Handoff — v40.13 microplastic wordmark

Current candidate: **v40.13**. Production remains unchanged on Sites v30.

Latest correction: the user selected the one-line serif `Say No To Plastic` treatment made from pale plastic with colorful microplastic fragments and small particles shedding from the baseline. v40.13 uses the exact approved image as provenance, creates cropped transparent runtime derivatives, and wires them into the shared header/footer wordmark. Editorial prose, metadata, copyright/legal copy, and accessibility names remain live text.

Immediate next action: open the local site and visually accept the header at desktop/tablet/mobile widths plus the compact footer. If accepted, spot-check the welcome popup and then package/import the candidate without touching production v30.

---

## Prior v40.12 record

# Handoff — v40.12 short footer

Current candidate: **v40.12**. Production remains unchanged on Sites v30.

Latest correction: the second rendered footer review showed that v40.11 did not go far enough. The issue is structural, not just typography: the inheritance quote area stayed tall and the footer signup stayed stacked. v40.12 shortens the quote band, reduces footer spacing/link rows, uses side-by-side desktop signup fields, and thins the legal row without changing content or behavior.

Immediate next action: open the same local desktop view and compare overall footer height. If accepted, spot-check mobile and the v40.10 welcome popup before any Sites import or domain work.

---

## Prior v40.11 record

# Handoff — v40.11 compact footer

Current candidate: **v40.11**. Production remains unchanged on Sites v30.

Latest correction: the user rendered the desktop footer locally and found its text too large, vertically loose, and too serif/editorial. v40.11 reduces footer type and spacing, switches footer descriptive copy to the site UI sans, and preserves larger touch targets on mobile.

---

## Prior v40.10 record

# Handoff — v40.10 one-viewport welcome modal

Current candidate: **v40.10**. Production remains unchanged on Sites v30.

Latest correction: the user rendered v40.9 locally and found the real portrait welcome dialog too tall, requiring scroll. v40.10 keeps the exact film and behavior but caps the standard dialog to one viewport, gives the portrait film a narrower dedicated column, removes the inherited 640px minimum, compacts copy spacing, keeps tablet two-column, and uses bounded mobile rows. Extreme zoom/tiny effective viewports may scroll as an accessibility escape hatch.

New acceptance row: `HM-19`. Ruler: **179 total / 99 proven / 48 proof-gated / 32 external blockers**.

Immediate next action: render the first-visit/replay modal locally and confirm no scrolling is needed at a normal laptop viewport while all controls and the complete portrait frame remain visible.

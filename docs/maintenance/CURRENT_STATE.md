# Current State — v40.34 deployment release candidate

The current authoritative portable source candidate is **v40.34**, built directly on v40.33. The visible product is the accepted v40.33 site: ten-chapter connected anatomy, testicular tissue as chapter 10, diverse system-aware microplastic motion, compact complete-atlas handoff, long-form Guides, deduplicated content architecture, current Book/About/Media/Community framing, and the existing WooCommerce-safe commerce default.

v40.34 changes release hygiene rather than product design: it reconciles stale historical regression audits with the later user-approved replacements, updates handoff documentation, and adds the definitive deployment/external-input checklist. Production Sites v30 remains unchanged.

## Current release gates

1. Connected Sites import into the **existing** Site and connected-runtime clean build/browser QA.
2. Dr. Haddad/authorized-owner approvals and assets listed in `docs/V40_34_EXTERNAL_INPUTS_FROM_DR_HADDAD.md`.
3. Provider/domain configuration for any features that will be live at launch.
4. Final owner/editorial approval before public publish.

See `VALIDATION_REPORT_V40_34.md`, `V40_34_CHANGE_MANIFEST.md`, `docs/V40_34_SITES_DEPLOYMENT.md`, and `docs/V40_34_EXTERNAL_INPUTS_FROM_DR_HADDAD.md`.

---

# Current State — v40.23 framing and density polish

The current source candidate is **v40.23**, built directly on v40.22. It preserves the full current site while improving the Book’s project-reading framing, tightening the Dr. Haddad Exposome composition, and replacing the rejected Media briefing headline. Production remains unchanged on Sites v30.

## Completed in this pass

- Reframed the Book body-system section as science behind the book’s central questions, not as a website-versus-book comparison.
- Preserved the non-table-of-contents boundary and all topic links.
- Compressed the About Exposome section and organized its controls vertically beside one focused panel on desktop.
- Preserved accessible tab behavior and mobile horizontal scrolling.
- Replaced the Media interview phrase with concise public-facing evidence language.
- Added a dedicated v40.23 audit and retained the approved lockfile.

## Remaining acceptance gates

1. Visual review of Book, About, and Media at desktop, tablet, mobile, keyboard-only, reduced motion, and 200% zoom.
2. Confirm the About Exposome density and category-panel balance on the owner’s Mac.
3. Repeat connected-runtime QA after an unpublished Sites import.

See `VALIDATION_REPORT_V40_23.md`, `V40_23_CHANGE_MANIFEST.md`, and `docs/V40_23_FRAMING_DENSITY_POLISH.md`.

---

# Current State — v40.22 anatomy navigation and Guides reading-room polish

The current source candidate is **v40.22**, built directly on v40.21. It preserves the ten-chapter connected anatomy, Complete Body Atlas, verified Science ledger, body-system library, and fourteen-guide catalog while applying the latest rendered-review corrections. Production remains unchanged on Sites v30.

## Completed in this pass

- Removed the floating Endocrine, Kidney, Skin, and Digestive pills from the opening body image; chapters 07–10 remain in the primary ten-chapter navigation.
- Recalibrated one shared brain transform for both the scroll scene and Complete Body Atlas. Source-level GLB-bound checks keep the brain below the exterior head top and in the upper-head region.
- Removed the duplicate Exposome bridge from the main Science page while preserving `/science/exposome` and its cross-site links.
- Balanced the four Guides entry routes into a two-by-two desktop grid with a one-column mobile layout.
- Refined the ivory reading room with a warmer paper field, shorter gaps, compact featured cards, and restrained guide-card hover treatment.
- Added and passed a dedicated v40.22 layout audit plus the inherited anatomy, homepage, Science, Guides, content-integration, link, and syntax checks.

## Remaining acceptance gates

1. Confirm the brain placement in the opening view, brain chapter, and Complete Body Atlas on the owner’s Mac.
2. Review the four-route Guides grid and ivory reading-room rhythm at desktop, tablet, mobile, keyboard-only, reduced motion, and 200% zoom.
3. Confirm the Science page transition remains coherent after Exposome deduplication.
4. Repeat connected-runtime QA after an unpublished Sites import and obtain Dr. Haddad/editorial approval before production.

See `VALIDATION_REPORT_V40_22.md`, `V40_22_CHANGE_MANIFEST.md`, and `docs/V40_22_NAVIGATION_READING_ROOM.md`.

---

---

# Current State — v40.20 integrated scroll atlas

The current source candidate is **v40.20**, built directly on v40.19. It keeps the ten-chapter evidence journey and final movable Complete Body Atlas, but now makes every supported system part of the main sticky scroll-stage body from the opening chapter onward. Production remains unchanged on Sites v30.

## Completed in this pass

- All scroll scenes inherit a low-opacity complete-atlas context.
- Chapter 01 visibly includes reproductive, represented endocrine, urinary, digestive, circulatory, brain, heart, pelvic, pregnancy, and exterior layers together.
- Endocrine, Kidney/Urinary, Digestive, and fallopian-tube geometry loads as the anatomy section approaches rather than waiting for chapters 07–10.
- The active chapter still brightens and receives the focused camera while other systems remain visible as context.
- The ovary-to-testis transition no longer clears the surrounding body.
- Chapter 01 includes direct pins to Endocrine, Kidneys, Skin, and Digestive.
- The final Complete Body Atlas remains available for free rotation, layer modes, group filters, and camera controls.
- A dedicated `npm run anatomy:integrated` regression audit protects the new contract.

## Remaining acceptance gates

1. Confirm real HRA model loading/alignment and visual density in chapter 01 on the owner’s Mac.
2. Review all ten focus transitions, opening pins, tablet/mobile layouts, keyboard, reduced motion, slow network, retry, fallback, and 200% zoom.
3. Repeat connected-runtime QA after an unpublished Sites import.
4. Obtain Dr. Haddad/editorial approval before production.

See `VALIDATION_REPORT_V40_20.md`, `V40_20_CHANGE_MANIFEST.md`, and `docs/V40_20_INTEGRATED_SCROLL_ATLAS.md`.

---

# Current State — v40.19 ten-chapter anatomy and complete atlas

The current source candidate is **v40.19**, built directly on the existing v40.18 site. It keeps the approved homepage and expands the existing anatomy journey from six to ten synchronized chapters, condenses the visible evidence copy, and adds a final movable Complete Body Atlas. Production remains unchanged on Sites v30.

## Completed in this pass

- The original six anatomy chapters remain in the same scroll-controlled experience.
- Endocrine, Kidneys/Urinary, Skin, and Digestive are now chapters 07–10 in that same journey rather than a separate card section.
- The default right-side evidence view is reduced to a concise finding and a concise uncertainty/causal boundary; methods, limitations, companion findings, and sources remain available under progressive disclosure.
- Chapters 07–10 retain direct focused 3D viewers.
- A final **Show the complete body** handoff opens one composite interactive atlas with the available exterior, brain, circulation, heart, pelvic skeleton, pregnancy, reproductive, represented endocrine, urinary, and digestive layers.
- The composite supports Exterior, Cutaway, System Only, Full Body, Focus System, Front, Rear, Zoom In, Zoom Out, Reset, rotation, pan, wheel zoom, and pinch zoom.
- Focus filters cover Skin, Brain, Circulation, Heart, Skeleton, Pregnancy, Reproductive, Endocrine, Urinary, and Digestive.
- Focused viewers, scroll chapters, and the complete atlas share one lazy, cacheable model loader.
- Missing anatomy and cross-dataset compositing limits are disclosed instead of fabricated.
- The complete portable audit stack passes, the package lock remains byte-identical, and all seven database migrations replay cleanly in an isolated SQLite database.

## Remaining acceptance gates

1. Run the final package locally and inspect all ten chapters at desktop, tablet, mobile, and 200% zoom.
2. Open all four focused viewers and the Complete Body Atlas; verify every layer, filter, mode, camera control, rotation, pan, wheel/pinch zoom, retry, and focus return.
3. Test keyboard-only, reduced motion, slow network, partial model failure, retry, and offline fallback.
4. Obtain Dr. Haddad/editorial approval for anatomical scope and the existing source-review topics.
5. Import only as an unpublished Sites candidate and repeat connected-runtime QA before any production decision.

See `VALIDATION_REPORT_V40_19.md`, `V40_19_CHANGE_MANIFEST.md`, and `docs/V40_19_TEN_CHAPTER_COMPLETE_ATLAS.md`.

---

# Current State — v40.18 Home anatomy finalization

The current source candidate is **v40.18**, built directly on v40.17. It removes the Home-only Exposome feature after rendered review and turns the four additional body systems into a full-viewport, direct-entry 3D anatomy continuation. Production remains unchanged on Sites v30.

## Completed in this pass

- The Home Exposome block and its unused import are removed.
- The dedicated `/science/exposome` route and non-home Exposome uses remain intact.
- Endocrine, Kidneys/Urinary, Skin, and Digestive now appear as systems 07–10 in a full-screen dark anatomy atlas.
- Each card opens the existing full-screen interactive viewer and retains a separate canonical evidence link.
- The showcase reuses canonical body-system content and conceptual visuals rather than duplicating claims.
- Desktop uses a complete two-by-two atlas; tablet/mobile use responsive one-column flows.
- Keyboard focus, focus return, modal semantics, reduced motion, and the educational/non-diagnostic boundary are preserved.
- A dedicated `npm run homepage:final` audit protects the new Home contract.

## Remaining acceptance gates

1. Run the completed package locally and review the full-screen showcase at desktop, tablet, mobile, and 200% zoom.
2. Open all four viewers from the new Home cards and verify rotation, zoom, pan, exterior/cutaway/system-only modes, focus return, and model alignment.
3. Test slow network, retry, partial load, and offline fallback.
4. Import only as an unpublished Sites candidate and repeat connected-runtime QA before any production decision.

See `VALIDATION_REPORT_V40_18.md`, `V40_18_CHANGE_MANIFEST.md`, and `docs/V40_18_HOME_ANATOMY.md`.

---

# Current State — v40.17 interactive extended-system anatomy

The current source candidate is **v40.17**, built directly on v40.16. It upgrades the existing Skin, Endocrine, Kidneys, and Digestive hotspots into full-screen interactive 3D reference viewers while preserving the approved six-scene anatomy journey and all v40.16 content, tools, routes, PDFs, email architecture, commerce configuration, and production rollback state. Live Sites v30 remains unchanged.

## Completed in this pass

- Each of the four optional hotspots now opens its own keyboard-accessible full-screen 3D viewer.
- Visitors can drag to rotate, wheel or pinch to zoom, Shift-drag to pan, switch among exterior/cutaway/system-only layers, frame the complete body or selected system, jump to front/rear views, zoom with buttons, and reset.
- The full exterior body remains available so every internal system can be understood from outside the body as requested.
- Kidney/urinary, digestive, and endocrine scenes lazily load exact Human Reference Atlas v1.2 reference surfaces from official open endpoints; the skin viewer uses the existing local complete female exterior surface.
- The endocrine viewer truthfully limits itself to available pancreas, thymus, and ovary surfaces rather than inventing thyroid, adrenal, pituitary, or testicular geometry.
- Loading progress, partial success, retry, official-source fallback, conceptual fallback, provenance, license, educational boundaries, focus trapping, focus return, reduced motion, mobile controls, and welcome-trigger suppression are implemented.
- A dedicated 50-check `npm run anatomy:viewer` regression audit protects the interaction and provenance contract.

## Current proof state

Portable source and regression audits pass. Exact open-reference file names and license records are registered. Package dependencies and `package-lock.json` remain unchanged. Because the unchanged locked dependency path is still unavailable in this container, real WebGL/browser acceptance remains a local-Mac and connected-runtime gate.

## Remaining gates

1. Open all four viewers locally and verify real HRA file loading, model alignment, outside/cutaway/system views, drag, pinch/wheel zoom, pan, front/rear/reset, and focus return.
2. Test desktop, tablet, mobile, keyboard-only, reduced motion, 200% zoom, slow network, partial failure, retry, and offline/fallback behavior.
3. Obtain Dr. Haddad/editorial approval of anatomical scope and the existing evidence language.
4. Import only as an unpublished Sites candidate and repeat connected-runtime QA before any production decision.

See `VALIDATION_REPORT_V40_17.md`, `V40_17_CHANGE_MANIFEST.md`, and `docs/V40_17_INTERACTIVE_ANATOMY.md`.

---

# Current State — v40.16 completion pass

The current source candidate is **v40.16**, built directly on v40.15. It closes the tangible post-integration gaps without replacing the site. Live Sites v30 remains unchanged.

## Completed in this pass

- Optional four-system anatomy hotspots and known/uncertain drawer.
- Seven conceptual body-system diagrams inside the existing canonical articles.
- Quick Action Card deep link, Home progress bridge, interactive exposure worksheet, and printable blank worksheet.
- Ten-reading progress, consent-based ten-part learning-series operations, and device-local 7-day/30-day challenges.
- Six downloadable source-status press briefs.
- Privacy/Terms updates, migration `0006`, operations/readiness coverage, PDF generation, and completion audit.

## Current proof state

Portable source audits, the seven-migration SQLite replay, generated-PDF rendering/inspection, and learning-series contracts pass. `package-lock.json` is unchanged. The dependency-backed app could not be booted in this container because the locked `vinext` tarball still returns HTTP 404 from the runtime registry path; no workaround was used.

## Remaining gates

1. Real-browser review on the user's Mac at desktop/tablet/mobile, keyboard, reduced motion, and 200% zoom.
2. Dr. Haddad/editorial approval and missing primary bibliographies for source-review topics.
3. Provider, migration, operations secret, scheduler, and test-recipient acceptance before the email series can go live.
4. Unpublished Sites import and connected-runtime QA before any production decision.

See `VALIDATION_REPORT_V40_16.md` and `docs/LEARNING_SERIES_OPERATIONS.md`.

---

## Prior v40.15 record

# Current State — v40.15 Dr. Haddad content integration

The current source candidate is **v40.15**, built directly on the approved v40.14 working site. It is an incremental information-architecture and content expansion; it does not replace the existing site. Published Sites v30 remains unchanged.

## What is now implemented

- All ten supplied PDFs are preserved, hashed, and mapped to canonical routes.
- Seven body-system pages share one source-aware template.
- Detection methods, the Exposome, and practical exposure reduction have dedicated canonical routes.
- Home, anatomy, Science, Solutions, Guides, Book, About, Media, Press Kit, Community, Recommendations, Editorial Policy, and Medical Disclaimer reuse the new material at the appropriate depth.
- Existing verified study cards remain authoritative for study-level statistics, methods, limitations, and source links.
- Body-system pages visibly distinguish `verified`, `partial`, and `source-review` records; source-review pages are `noindex,follow` until their primary bibliographies are approved.

## Preserved baseline

The approved microplastic wordmark, welcome film, one-viewport modal, compact footer, six-scene anatomy journey, 14-guide library, commerce mode, provider boundaries, package lock, and production Sites v30 are unchanged.

## Validation status

- The complete portable audit stack passed, including **140/140** content-integration checks, **319/319** nothing-left-behind checks, and **0 broken internal links**.
- All six database migrations replayed successfully to an isolated SQLite database with integrity `ok`.
- The unchanged locked `vinext` tarball still returns HTTP 404 in this container, so dependency-backed build and real-browser proof remain unavailable here.

## Immediate gates

1. Render locally and inspect the new long-form pages at desktop, tablet, mobile, keyboard, reduced motion, and 200% zoom.
2. Dr. Haddad/editorial review of wording and source-state labels.
3. Attach and review missing primary bibliographies before promoting source-review pages.
4. Import only as an unpublished Sites candidate; do not overwrite production until acceptance.

---

# Current State — v40.13 microplastic wordmark

The current source candidate is **v40.13**. It carries forward v40.12 and implements the exact one-line `Say No To Plastic` microplastic wordmark selected by the user. Live Sites v30 remains unchanged.

## Latest rendered correction
The shared header/footer brand component no longer reconstructs the identity from plain text. It now renders transparent derivatives of the approved serif artwork: pale plastic letterforms, visible colored microplastic fragments, and restrained falling particles. Prose and accessible/metadata uses of the name remain text.

## Immediate gate
Render the site locally at the same desktop viewport plus tablet/mobile. Confirm the header mark is crisp, does not crowd navigation, and the footer identity stays compact. Then spot-check the existing v40.10 welcome modal before any Sites import.

---

## Prior v40.12 record

# Current State — v40.12 short footer

The current source candidate is **v40.12**. It carries forward v40.11 and makes the bottom-of-page system structurally shorter after the second local rendered review. Live Sites v30 remains unchanged.

## Latest rendered correction
v40.11 reduced footer typography but left the tall inheritance quote panel and a forced single-column footer signup intact. v40.12 shortens the quote band, materially reduces footer grid/legal-row height, and places First name + Email side by side on desktop. Mobile keeps one-column fields and larger tap targets.

## Immediate gate
Render the same desktop bottom-of-page view locally. The quote band should be noticeably shallower and the main footer should now read as compact site chrome rather than another content section. Then spot-check mobile and the welcome modal.

---

## Prior v40.11 record

# Current State — v40.11 compact footer

The current source candidate is **v40.11**. It carries forward v40.10 and only compacts footer typography/spacing. Live Sites v30 remains unchanged.

---

## Prior v40.10 record

# Current State — v40.10 one-viewport welcome modal

The current source candidate is **v40.10**. Live Sites v30 remains unchanged.

## Latest rendered correction
The real portrait welcome film remains integrated exactly as in v40.9, but the first-visit/replay dialog has been resized after local rendered review. Standard laptop/tablet/mobile layouts are now bounded to one viewport with no internal modal scrolling; the full film frame, close control, welcome copy, Play action and Continue action are designed to remain visible together. Heavy zoom/tiny effective viewports retain a controlled scroll escape hatch for accessibility.

The Events & Media inline film player is unchanged.

## Acceptance ruler
179 requirements: **99 done/proven · 48 require rendered/workflow proof · 32 owner/provider/source blocked**.

`HM-19` is the new rendered-review requirement. It stays proof-gated until the user verifies the corrected popup locally.

## Immediate gate
Render `/` at normal laptop size first. Confirm the welcome popup fits in one screen without scrolling and the complete portrait film remains visible. Then spot-check tablet/mobile and 200% zoom. Captions/transcript and five-point spoken-content verification remain open before production signoff.

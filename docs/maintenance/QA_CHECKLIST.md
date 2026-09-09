# v40.23 browser acceptance block

## Book

- [ ] The project-reading section says “Explore the science behind the book’s central questions.”
- [ ] It does not describe the website as carrying depth “beside” the book.
- [ ] The non-table-of-contents boundary and all six links remain clear.

## Dr. Haddad

- [ ] The dark Exposome section is visibly shorter and more balanced.
- [ ] Desktop categories form a vertical rail beside one focused panel.
- [ ] Arrow keys, Home, End, click, and focus states work.
- [ ] Tablet/phone controls remain reachable and do not cause page-level horizontal scrolling.

## Events & Media

- [ ] The rejected interview phrase is absent.
- [ ] “Clear evidence for public conversations.” wraps cleanly.
- [ ] All briefing cards, topic routes, status notes, and PDF downloads remain available.

## General

- [ ] Desktop, tablet, phone, keyboard-only, reduced motion, and 200% zoom.
- [ ] No visual regression to the header, footer, wordmark, welcome film, or page transitions.

---

# v40.22 browser acceptance block

## Homepage anatomy

- [ ] Opening body shows no floating Endocrine, Kidneys, Skin, or Digestive pills.
- [ ] All ten chapter buttons remain visible and operable.
- [ ] Brain sits fully inside the exterior head in chapter 01, chapter 02, and Complete Body Atlas.
- [ ] Brain remains aligned in Front, Rear, Exterior, Cutaway, and System Only modes.
- [ ] Chapters 07–10 remain accessible through the standard chapter navigation and their focused 3D buttons.
- [ ] Complete Body Atlas still opens and retains layer, system, camera, rotation, pan, zoom, reset, Escape, and focus-return controls.

## Science

- [ ] Main Science page moves from body-system overviews directly into institutional context without an extra Exposome dashboard.
- [ ] Six body-system cards remain balanced at desktop widths and Pregnancy/Early Life remains an intentional full-width pathway.
- [ ] `/science/exposome` remains reachable from the footer and practical-action pathways.

## Guides

- [ ] Four “Choose a route” cards render as two-by-two at desktop widths.
- [ ] Route cards become one column on small screens.
- [ ] Ivory reading-room transition, featured reads, search, filters, and guide grid have no excessive blank gap or clipped headings.
- [ ] Hover and keyboard focus remain visible.

## Responsive and accessibility

- [ ] Desktop, tablet, and mobile.
- [ ] Keyboard-only navigation and focus order.
- [ ] Reduced motion.
- [ ] 200% browser zoom.
- [ ] VoiceOver or equivalent screen-reader spot check.

---

---

# v40.20 rendered acceptance — integrated scroll atlas

- [ ] Chapter 01 shows the exterior plus brain, circulation, heart, pelvis, pregnancy anatomy, reproductive structures, represented endocrine tissues, kidneys/urinary tract, and digestive organs after loading completes.
- [ ] Endocrine, Kidneys, Skin, and Digestive opening pins move to chapters 07–10 and leave keyboard focus visible.
- [ ] All ten chapter buttons select the matching scene and right-side evidence chapter.
- [ ] Non-active systems remain visible as context without overpowering the focused chapter.
- [ ] Pancreas and ovary surfaces do not visibly flicker or double in the opening overview.
- [ ] Direct `/#evidence` entry begins HRA loading and reaches the complete overview without a refresh.
- [ ] Slow-network loading does not block the original local anatomy layers or page scrolling.
- [ ] A failed remote layer does not crash the journey; focused viewers still provide retry/fallback.
- [ ] Desktop, tablet, phone, 200% zoom, keyboard-only, touch, and reduced-motion layouts remain usable.
- [ ] The complete-body viewer below the scroll still supports all filters, layer modes, camera controls, rotation, pan, zoom, reset, Escape, and focus return.

---

# v40.20 integrated scroll atlas — acceptance checklist

## Opening whole-body scene

- [ ] Wait for remote context loading; chapter 01 visibly includes brain, circulation, heart, pelvic skeleton, pregnancy/fetal structures, reproductive context, represented endocrine structures, kidneys/urinary structures, digestive structures, and the exterior shell.
- [ ] The combined body remains readable rather than becoming an opaque visual pileup.
- [ ] Endocrine, Kidneys, Skin, and Digestive pins are visible, accurately positioned, and jump to chapters 07–10.
- [ ] Pins have visible keyboard focus and do not obscure essential anatomy or chapter controls.
- [ ] The opening message clearly says that all ten chapters are represented in the same body.

## Continuous chapter context

- [ ] Each active system becomes visually dominant while the rest of the represented body remains faintly visible.
- [ ] Brain, Heart, Pregnancy, Ovary, Testicular, Endocrine, Kidney, Skin, and Digestive camera transitions remain smooth and correctly framed.
- [ ] The ovary-to-testis transition does not blank the body before the male reference surface appears.
- [ ] Skin shows the exterior while internal context remains restrained and readable.
- [ ] Duplicate pancreas/ovary representations do not create obvious visual artifacts outside endocrine focus.

## Loading and resilience

- [ ] Remote context begins loading before the section enters the viewport and does not delay first page paint.
- [ ] Successful models remain reusable by focused viewers and the final Complete Body Atlas.
- [ ] Slow loading adds structures progressively without breaking scrolling.
- [ ] Partial or total remote failure leaves the local anatomy/fallback usable.
- [ ] Retrying in the full viewer still works after a scroll-layer failure.

## Responsive and accessibility

- [ ] Owner laptop viewport and 1440×900.
- [ ] 1024×768 and 768×1024.
- [ ] 430×932 and 375×667; opening pins/badge are removed and chapter navigation remains sufficient.
- [ ] 200% zoom has no horizontal page scroll or unreachable controls.
- [ ] Keyboard-only and visible-focus pass.
- [ ] Reduced motion removes nonessential pin transitions and preserves readable anatomy.
- [ ] Screen-reader flow remains focused on evidence text and chapter controls; decorative context messaging is not duplicated.

## Regression

- [ ] All ten evidence chapters, concise right-side copy, source details, and focused 3D viewer buttons remain correct.
- [ ] Final Complete Body Atlas retains Exterior, Cutaway, System Only, Full Body, Focus System, Front, Rear, zoom, reset, rotation, pan, and system filters.
- [ ] Welcome film, wordmark, footer, guides, Science/Solutions content, generated PDFs, Community tools, learning-series architecture, commerce mode, and production rollback state remain unchanged.

---

# v40.19 ten-chapter anatomy and complete atlas — acceptance checklist

## Integrated scroll journey

- [ ] The homepage presents one continuous ten-chapter anatomy journey.
- [ ] Chapters 01–06 remain intact and correctly synchronized.
- [ ] Chapters 07 Endocrine, 08 Kidneys/Urinary, 09 Skin, and 10 Digestive use the same sticky stage, progress, and chapter navigation.
- [ ] Each chapter shows a concise Finding and concise What it does not prove statement.
- [ ] Study context, methods, limitations, companion findings, and source links remain reachable under progressive disclosure.
- [ ] Chapter navigation moves directly to all ten scenes without losing scroll control.

## Focused viewers

- [ ] Endocrine, Kidneys/Urinary, Skin, and Digestive open the correct focused viewer.
- [ ] Exterior, Cutaway, and System Only modes work.
- [ ] Full Body, Focus System, Front, Rear, Zoom In, Zoom Out, and Reset work.
- [ ] Drag rotation, Shift-drag pan, wheel zoom, and pinch zoom work without scrolling the page underneath.
- [ ] Close and Escape return focus to the exact opener.

## Complete Body Atlas

- [ ] The **Show the complete body** handoff appears after chapter ten and fills the intended viewport.
- [ ] The composite loads the available exterior, brain, circulation, heart, pelvic skeleton, pregnancy, reproductive, endocrine, urinary, and digestive layers.
- [ ] Skin, Brain, Circulation, Heart, Skeleton, Pregnancy, Reproductive, Endocrine, Urinary, and Digestive filters work independently.
- [ ] Exterior, Cutaway, and System Only modes behave coherently with every filter.
- [ ] Full Body and Focus System framing contain the target without clipping.
- [ ] Front, Rear, Zoom In, Zoom Out, Reset, rotation, pan, wheel zoom, and pinch zoom work.
- [ ] The viewer clearly states that it is an educational composite rather than a patient reconstruction or complete clinical anatomy product.
- [ ] Male testicular anatomy is not falsely overlaid into the female composite.

## Network and fallback

- [ ] First remote HRA load shows progress and a truthful internet requirement.
- [ ] Successful models are reused from the shared cache.
- [ ] Partial model failure identifies what did and did not load.
- [ ] Retry clears the failed cache entry and makes a bounded new attempt.
- [ ] Offline or complete failure produces a readable conceptual fallback.

## Responsive and accessibility

- [ ] Desktop: owner laptop and 1440×900.
- [ ] Tablet: 1024×768 and 768×1024.
- [ ] Mobile: 430×932 and 375×667.
- [ ] Browser zoom: 200%, with all chapter, disclosure, filter, and viewer controls reachable.
- [ ] Keyboard focus is visible; Tab remains trapped inside an open viewer.
- [ ] Escape closes the viewer; background content is inert and page scrolling is locked.
- [ ] Reduced motion disables nonessential inertia and animation.
- [ ] No horizontal page scrolling or clipped controls.

## Regression

- [ ] Welcome film, wordmark, footer, all content routes, PDFs, Community tools, email architecture, commerce default, and rollback state remain unchanged.
- [ ] `/science/exposome` remains available while the large Home Exposome block stays removed.
- [ ] Production Sites v30 remains untouched.

---

# v40.18 Home anatomy finalization — acceptance checklist

## Homepage structure

- [ ] Home no longer renders the Exposome map, Exposome CTA, or a blank gap where it used to be.
- [ ] `/science/exposome` still opens normally and non-home Exposome modules remain intact.
- [ ] The anatomy continuation fills the desktop viewport below the persistent header.
- [ ] The heading, instructions, and 2×2 system atlas feel balanced at the owner’s actual laptop size.
- [ ] Endocrine, Kidneys/Urinary, Skin, and Digestive are visible as systems 07–10.
- [ ] Each card has a distinct conceptual visual and readable summary.

## Direct 3D entry

- [ ] Each “Open 3D anatomy” control opens the correct full-screen viewer.
- [ ] Close returns focus to the exact card that launched the viewer.
- [ ] The separate evidence-overview link opens the matching canonical article and never triggers the viewer.
- [ ] Exterior, cutaway, system-only, full-body, focus-system, front, rear, zoom, pan, and reset controls remain functional.

## Responsive and accessibility

- [ ] Desktop: owner’s laptop and 1440×900.
- [ ] Tablet: 1024×768 and 768×1024.
- [ ] Mobile: 430×932 and 375×667.
- [ ] Browser zoom: 200%, with every card, link, and viewer control reachable.
- [ ] Keyboard focus is visible on both 3D buttons and evidence links.
- [ ] Reduced motion removes nonessential transition movement.
- [ ] No horizontal page scrolling or clipped card content.

## Regression

- [ ] Original six-scene anatomy journey and its hotspot toggle still work.
- [ ] Everyday exposure routes follow directly after the new anatomy section.
- [ ] Welcome film, wordmark, footer, content routes, PDFs, Community tools, email architecture, commerce default, and rollback state are unchanged.

---

# v40.17 interactive anatomy — acceptance checklist

## Four-system entry and routing

- [ ] “Explore four more systems” exposes Skin, Endocrine, Kidneys, and Digestive hotspots without obscuring the six original chapter controls.
- [ ] Each hotspot opens the correct viewer and returns focus to the activating hotspot after close.
- [ ] Escape, close button, and backdrop close the viewer; focus stays trapped while open.
- [ ] The welcome-film replay control is hidden while the viewer owns focus.

## 3D interaction

Test all four viewers with mouse and touch where available.

- [ ] Drag rotates smoothly through front, side, and rear orientations.
- [ ] Wheel and pinch zoom in and out without scrolling the page underneath.
- [ ] Shift-drag pans.
- [ ] Focus system, Full body, Front, Rear, Zoom in, Zoom out, and Reset all work.
- [ ] Camera fitting contains the complete target without clipping after first load and after retry.
- [ ] Exterior mode shows the complete outside body and a readable x-ray system overlay.
- [ ] Cutaway mode makes the shell translucent while preserving anatomical context.
- [ ] System-only mode removes the shell and leaves the selected structures visible.
- [ ] Skin provides a rotatable complete exterior surface and does not pretend to be a microscopic skin-layer model.

## Structure and alignment proof

- [ ] Kidneys viewer visibly includes left/right kidneys, left/right ureters, and bladder.
- [ ] Digestive viewer visibly includes small intestine, large intestine, liver, and pancreas.
- [ ] Endocrine viewer visibly includes pancreas, thymus, and both ovaries.
- [ ] Endocrine scope note clearly states that thyroid, adrenal, pituitary, testicular, and other endocrine tissues are not represented.
- [ ] Each remote organ is positioned plausibly within the exterior shell; no organ floats outside the body or disappears inside unrelated anatomy.
- [ ] Legend colors match visible structures.

## Loading and failure behavior

- [ ] First open clearly shows licensed-anatomy progress.
- [ ] A successful first load can be reopened without a full network wait where browser caching permits.
- [ ] One failed file produces a truthful partial-load notice and retry control.
- [ ] Complete remote failure produces the conceptual fallback and retry control rather than a blank canvas.
- [ ] Skin and the local exterior shell remain available without remote organ files.
- [ ] Provenance links open the HRA library, exact release directory, and CC BY 4.0 license.

## Responsive and accessibility

- [ ] Desktop: 1440×900 and the owner’s laptop viewport.
- [ ] Tablet: 1024×768 and 768×1024.
- [ ] Mobile: 430×932 and 375×667.
- [ ] Browser zoom: 200% with every control reachable.
- [ ] Keyboard-only operation reaches all controls, links, details, and close action in a logical order.
- [ ] Screen-reader labels identify the viewer, system, and interaction instructions.
- [ ] Reduced motion disables inertial damping and nonessential loading animation.
- [ ] No horizontal page scroll, clipped control rail, hidden close button, or inaccessible panel content.

## Regression

- [ ] Six-scene anatomy journey still scrolls and navigates correctly.
- [ ] Floating anatomy microplastics remain visible.
- [ ] Canonical Science links, known/uncertain language, source status, and medical boundary remain correct.
- [ ] Welcome film, header/footer wordmark, compact footer, action tools, Community programs, PDFs, email architecture, commerce mode, and production rollback state are unchanged.

---

# v40.16 completion pass — acceptance checklist

## Portable proof completed

- [x] All source, syntax, UI, clarity, content, route, operations, and preservation audits pass.
- [x] All seven migrations replay to a fresh isolated SQLite database.
- [x] Learning-series unique enrollment, explicit restart, due-job scheduling, advancement, and unsubscribe contracts are audited.
- [x] Nine generated PDFs have valid PDF structure and render without observed clipping or overlap in the review contact sheet.
- [x] `package-lock.json` remains byte-identical.
- [x] Production Sites v30, commerce mode, provider settings, secrets, DNS, and storage remain untouched.

## Local browser review — required

- [ ] Anatomy explorer opens from the existing journey without covering essential copy; all four hotspots are reachable.
- [ ] Escape closes the anatomy drawer and focus returns to the initiating hotspot.
- [ ] Seven body-system diagrams remain readable at desktop, tablet, mobile, and 200% zoom.
- [ ] Worksheet selections, priority, notes, reset, blocked-storage fallback, print, and blank-PDF download work.
- [ ] Community reading progress and both challenge lengths persist locally, reset correctly, print cleanly, and remain usable when storage is unavailable.
- [ ] Challenge tabs expose correct selected state and tabpanel labeling.
- [ ] All six press briefs download from Media and Press Kit and preserve source-status language.
- [ ] Existing header/footer, wordmark, welcome modal, film, anatomy scroll, guides, checkout links, and legal routes show no regressions.
- [ ] Keyboard-only and visible-focus pass.
- [ ] Reduced-motion pass.
- [ ] WebGL-disabled anatomy fallback pass.

## Editorial and medical review — required

- [ ] Dr. Haddad approves each body-system diagram as conceptual—not patient-specific or mechanism proof.
- [ ] Dr. Haddad approves the exposure worksheet and challenge wording.
- [ ] Dr. Haddad approves all six press briefs and “language to avoid.”
- [ ] Missing primary bibliographies are attached and reviewed before any source-state promotion.
- [ ] No lungs/respiratory content is added without a dedicated source.

## Learning-series staging — required before activation

- [ ] Migration `0006` applied to staging.
- [ ] Resend and public origin configured with approved sender identity.
- [ ] `OPERATIONS_SECRET` is 32+ characters and stored server-side only.
- [ ] Protected scheduler configured at an approved interval.
- [ ] Readiness returns core operations ready.
- [ ] Test signup creates exactly ten ascending jobs.
- [ ] Re-enrollment restarts the unsent sequence without duplicate live schedules.
- [ ] First message, preferences link, one-click unsubscribe, cancellation, retries, completion, and payload scrubbing pass.
- [ ] Program remains inactive until owner acceptance.

---

## Prior v40.15 checks

# v40.15 Dr. Haddad content integration — rendered and editorial checks

## Existing-site preservation

- [ ] The v40.14 header, approved wordmark, welcome film, modal, anatomy, footer, routes, and interactions remain visually intact.
- [ ] Home still has six anatomy chapters, not an inflated ten-plus chapter journey.
- [ ] The guide library still contains 14 guides.
- [ ] Production commerce remains WooCommerce and no production resource is touched.

## Home and anatomy

- [ ] The compact Exposome module fits naturally inside the existing exposure section.
- [ ] The four-card More Systems rail is readable and does not create another giant homepage block.
- [ ] Heart, Pregnancy, and Ovary anatomy deep links are visible but not distracting.
- [ ] Existing floating anatomy microplastics, mobile fallback, and reduced-motion path remain stable.

## Science and canonical pages

- [ ] Detection Primer reads as optional context, not a barrier before the verified studies.
- [ ] Seven body-system cards are balanced at desktop, tablet, and mobile.
- [ ] Each body-system page shows Evidence status, source draft, known, uncertain, takeaways, sources, and medical boundary.
- [ ] Source-review pages visibly say the bibliography is still required.
- [ ] Long-form page TOCs remain usable and do not obscure content.
- [ ] Exposome tabs work by pointer and keyboard and expose a coherent selected state.
- [ ] Dynamic body routes render for all seven slugs and unknown slugs return not found.

## Solutions and guides

- [ ] Existing direct principle and three exact core rules remain first.
- [ ] The exposure framework routes cleanly to `/solutions/reduce-exposure`.
- [ ] The long-form reduction page does not imply purity, guaranteed risk reduction, or abandonment of safer established practices.
- [ ] The planner anchor lands on the existing one-change planner.
- [ ] Every guide's Connected Science cards fit without overwhelming the practical article.

## Book, About, Media, Community, and policy

- [ ] Book topic cards are clearly project questions, not an invented table of contents.
- [ ] About Exposome module supports rather than replaces the biography.
- [ ] Media/Press briefing cards route to the correct canonical topics.
- [ ] Community shows ten readings and preserves the accepted generations image/signup.
- [ ] Recommendation product boundary is visible and unambiguous.
- [ ] Editorial Policy and Medical Disclaimer remain readable at all widths.

## Accessibility and resilience

- [ ] Keyboard order follows visual order on every new module.
- [ ] Focus indicators remain visible.
- [ ] 200% zoom creates no horizontal scrolling or clipped controls.
- [ ] Reduced motion removes decorative transitions without hiding content.
- [ ] Noindex metadata is present only on `source-review` body pages.
- [ ] Source and medical status are conveyed in text, not color alone.

## Editorial/medical approval

- [ ] Dr. Haddad approves the narrative hierarchy and cross-site reuse.
- [ ] Medical/editorial reviewer approves every verified/partial/source-review label.
- [ ] Missing primary papers are attached before source-review pages are promoted.
- [ ] Lungs/respiratory content remains absent until a source is supplied.

---

# v40.10 immediate Welcome Modal rendered checks

- [ ] First homepage visit opens the real Dr. Haddad welcome dialog.
- [ ] At a normal laptop viewport the entire popup is visible at once; no dialog/page scrolling is needed.
- [ ] Full portrait frame is visible with no stretch or crop.
- [ ] Close, Play, description and Continue are visible in the same popup.
- [ ] Playback/audio begins only after explicit Play.
- [ ] Escape, backdrop close, focus trap/return, inert background and body-scroll restoration still work.
- [ ] Replay chip reopens the same fitted dialog after dismissal.
- [ ] 1024×768 and 768×1024 remain usable without turning into the old tall stacked dialog.
- [ ] 430×932 and 375×667 keep the popup bounded to the viewport.
- [ ] At 200% zoom / extremely constrained viewport, all controls remain reachable even if the accessibility scroll escape hatch activates.
- [ ] Reduced motion preserves the final stable layout.
- [ ] `/media` still uses the same welcome film inline and does not autoplay.
- [ ] Temporary TEDx, long-form conversation, Community artwork, and all previously accepted page layouts remain unchanged.

---

# v40.9 immediate Welcome + Media + Community rendered checks

- [ ] `/media` preserves the approved layout and does not reintroduce TEDx on Home.
- [ ] TEDx player visibly says **temporary audience recording** and never calls the current phone-recorded link official.
- [ ] TEDx current link opens/plays YouTube ID `MVnY2vw99SY`; the official replacement can be swapped in the registry without redesign.
- [ ] Long-form conversation opens/plays YouTube ID `DJuZBIXeiM8` and remains visually separate from TEDx.
- [ ] Missing publication dates display no fabricated date; metadata remains explicitly pending verification.
- [ ] Real welcome film opens from the first-visit homepage dialog and replay chip; portrait frame is complete, sound starts only after Play, Escape/backdrop/focus return work, and dismissal memory persists.
- [ ] Media keyboard interaction, Escape/focus return where applicable, responsive layout, and analytics events are tested.
- [ ] `/community` shows the complete grandmother / mother / boy composition at desktop, tablet, and mobile; no person is cover-cropped.
- [ ] Community copy/signup remain live HTML and the image does not become awkwardly oversized.
- [ ] Home still contains no giant generations image panel.

## v40.5 Guides rendered-review checks

- [ ] `/resources` ivory reading-room field reaches both viewport edges; no navy side gutters around the library.
- [ ] “Three useful first reads” appears above, not beside, the three featured cards.
- [ ] Featured cards use three equal desktop columns with readable, non-cramped title wrapping.
- [ ] At tablet width the featured cards stack before titles become narrow or clipped.
- [ ] Search label/input/example align cleanly with the foundational-guide note.
- [ ] Category filters remain usable and result count updates after filtering/search.
- [ ] All 14 guide records remain reachable.
- [ ] Guides hero and “Choose a route” pathways remain visually unchanged from the user-approved version.
- [ ] No Home, Science, Solutions, footer, or commerce regression is introduced by the Guides-only pass.

## v40.3 Solutions rendered-review checks

- [ ] `/solutions` lower ivory field reaches both viewport edges; content remains aligned to the editorial grid.
- [ ] Kitchen image uses a clean crop and does not float separately from its headline/caption.
- [ ] Water / Kitchen / Single-use cards feel equal and aligned; no accidental giant gaps.
- [ ] Planner still selects only one change and transitions naturally from the direct-guide section.
- [ ] No visible `Evidence boundary` strip appears on `/solutions`.
- [ ] Quick Action Card still shows its explicit evidence/source note.
- [ ] Optional-depth bridge is visually calm and not oversized.
- [ ] Footer quote uses a flat dark field; no Earth-at-night photo is visible.
- [ ] Faint Earth curve, if perceptible, stays atmospheric and never competes with quote or links.
- [ ] Repeat at desktop, tablet, mobile, keyboard navigation and 200% zoom.

# v40.2 immediate Science rendered checks

- [ ] “How to read this page” is completely absent from the Science hero.
- [ ] The supplied full-body figure is visible only as a subtle/translucent background and never competes with the H1.
- [ ] Hero H1/deck/fact counts remain readable at 1440, 1280, 1024, 768 and mobile widths.
- [ ] Blood, Brain, Heart & arteries, Placenta, Ovary and Testicular tissue each display their own supplied visual; no six-panel collage appears in the live page.
- [ ] Individual chapter visuals are not oversized and do not make the already-liked Science page feel heavier or longer than necessary.
- [ ] Heart & arteries still distinguishes the 2026 coronary-blood study from the separate 2024 carotid-plaque study.
- [ ] Science footer uses the later flat dark inheritance-quote field; no Earth-at-night photo is visible, and the faint abstract curve does not distract.
- [ ] Images remain well-cropped at mobile widths and do not introduce horizontal overflow.
- [ ] Re-check direct original-study links after the visual integration.

---

# v40.1 immediate rendered checks

- [ ] Home Events & Media navy background touches both viewport edges at desktop widths.
- [ ] Events & Media content remains aligned/readable rather than stretching excessively on wide displays.
- [ ] No `generations` image panel appears on Home after Events & Media.
- [ ] Home newsletter/community form follows cleanly without a giant visual gap.
- [ ] `/community` uses the responsive generations artwork and keeps elderly woman + adult woman + young boy identifiable on mobile.
- [ ] Re-check all six v40 screenshot fixes; no regression from this narrow batch.

---

# v40 targeted homepage proof gate

Before using the broader checklist below, re-test the six defects that triggered v40:

- [ ] Header wordmark reads as a deliberate horizontal identity and does not crowd nav.
- [ ] Hero setup line is gone, deck is concise, and first screen does not feel text-heavy.
- [ ] Hero image fills vertically and fades into the page with no visible rectangular edge.
- [ ] Anatomy stage shows only a compact chapter locator; no technical label pileup or model-note collision.
- [ ] Heart chapter is materially shorter on Home; 16/19 comparison and separate 4.53× plaque study remain discoverable.
- [ ] Exposure cards read as Air / Water / Food storage / Heat / Fast fashion / Skincare and cosmetics.
- [ ] Practical-action columns feel balanced; right column does not repeat the three rules; CTA has clear spacing.
- [ ] Re-test the above at desktop, tablet, mobile, 200% zoom, and reduced motion.

---

# QA and release checklist — v39.1 nothing-left-behind

## A. Source authority

- [ ] Raw transcript, Master Delivery Register, supplied images, and later decisions are available.
- [ ] Any source conflict is listed rather than silently resolved.
- [ ] Passing tests are not treated as visual, clinical, or owner approval.

## B. Transcript-priority content

- [ ] Quick Action Card displays all 12 supplied items in source order.
- [ ] Exact core rules display correctly.
- [ ] Editorial note is visible beside contested health/detox wording.
- [ ] Rejected “cool then transfer to plastic” instruction is absent.
- [ ] Water guide begins with direct bottle guidance and explains reverse osmosis plainly.
- [ ] Kitchen-conversion guide covers storage, drinkware, utensils, plates/cups, and high-use items around heat.
- [ ] Single-use guide covers cups, plates, utensils, containers, takeout, and events.
- [ ] Home remains brief and links to deeper action rather than duplicating full guides.

## C. Identity and owner facts

- [ ] Say No to Plastic is movement identity in metadata, schema, policies, email, and support.
- [ ] *Homo Plasticus* is limited to book/product contexts.
- [ ] Collaborator credit is limited to approved book contexts.
- [ ] Education shows only the higher-authority transcript/Register facts currently available; unresolved chronology/dates remain an internal provenance gate and no public owner-workflow warning is shown.
- [ ] Media publication state is honest: current user-authorized links are playable without being mislabeled owner-approved; temporary TEDx is non-official and replacement-gated; unapproved future entries remain unpublished.
- [ ] Recommendations remain unpublished until records and agreements exist.

## D. Anatomy

- [ ] Full body, brain, heart/arteries, maternal-fetal, ovary/follicle, and testicular structures are recognizable.
- [ ] Cardiovascular studies remain distinct.
- [ ] Human follicular-fluid evidence leads animal/cell context.
- [ ] Ovary fallback labels follicle, oocyte, follicular fluid, and tube clearly.
- [ ] Testis fallback identifies testis and epididymis clearly.
- [ ] Scroll, buttons, keyboard, touch, and labels remain synchronized.
- [ ] Reduced-motion and no-WebGL paths contain the same information.
- [ ] A clinically qualified reviewer approves visual accuracy before launch.

## E. Viewports and accessibility

Test at 1440×900, 1366×768 (laptop), 1280×800, 1024×768, 768×1024, 430×932, 390×844, 375×667, 360×800, and 320px width.

- [ ] No horizontal overflow or clipped controls.
- [ ] One H1 and logical heading order.
- [ ] Body text remains at least 16px.
- [ ] Keyboard focus is visible.
- [ ] Skip link works on every route.
- [ ] Modals/menu trap or manage focus correctly and close with Escape.
- [ ] Site remains usable at 200% zoom.
- [ ] Reduced motion removes nonessential animation.
- [ ] Color contrast meets WCAG AA.
- [ ] Forms expose labels, inline errors, pending state, and success state.


## E2. Blueprint visual acceptance recovered in v39.1

- [ ] Approved mother/fetus/placenta hero art keeps mother, fetus, placenta, hands/face, and negative space readable on desktop/mobile.
- [ ] Exposure visuals read immediately: breathing/airflow, water/bottle, packaged food, heat, textiles, personal care.
- [ ] Exposure copy is not undersized.
- [ ] Approved kitchen visual shows the stainless reverse-osmosis unit plus glass/steel/wood/cast-iron cues.
- [ ] Join visual keeps elderly woman, adult woman, and young boy identifiable; embedded image text/button is never relied upon as functional UI.
- [ ] Earth-at-night footer preserves the Earth curve and live quote/navigation contrast.
- [ ] Wordmark candidate reads as professional/distinctive/not groovy; movement mark is gold while surrounding navigation/copy can remain white/ivory.
- [ ] Header top/scrolled states match the transparent → ~92% navy behavior.
- [ ] Mobile menu uses large links, a single gold primary CTA, scroll lock, Escape, and focus return.
- [ ] No major section depends on automatic scaling alone; desktop/tablet/mobile compositions are intentional.

## F. Routes and forms

- [ ] Home, Science, Solutions, Book, Guides, Media, About, Community, Contact, policy, preference, recovery, and purchase routes render.
- [ ] Signup records consent before provider delivery.
- [ ] Repeated active signup does not duplicate welcome delivery.
- [ ] Unsubscribe suppresses locally before provider sync and remains non-enumerating.
- [ ] Contact inquiry is durable before notification delivery.
- [ ] Audience adapter matches the explicitly selected provider.

## G. Commerce

- [ ] Normal build remains WooCommerce mode.
- [ ] Every book CTA enters `/api/checkout`.
- [ ] Preview mode creates no charge/order/email/download.
- [ ] Native test activation, if approved, uses test credentials and isolated D1/R2.
- [ ] Confirmation page and email both provide controlled access.
- [ ] Recovery, duplicate clicks, failed payment, refund revocation, stale jobs, and retry ceiling are tested.
- [ ] Final PDF checksum and object privacy are verified.

## H. Performance and security

- [ ] Large client chunk is profiled and safely reduced where measurable.
- [ ] Hero is eager and dimensioned; below-fold imagery is optimized/lazy.
- [ ] Video player loads after interaction.
- [ ] Core content remains readable if 3D/video fails.
- [ ] Security/no-cache/noindex headers are verified in the deployed preview.
- [ ] No secrets, paid PDF, database, logs, caches, or populated environment files are packaged.

## I. Owner/provider approval

- [ ] Education/career chronology.
- [ ] Wordmark/font/license.
- [x] Current welcome-film MP4 + poster integrated.
- [ ] Welcome-film captions/transcript and spoken-content verification.
- [ ] TEDx/media links/rights/dates.
- [ ] Final ebook/metadata/price/tax/territories/refund language.
- [ ] Quick Action Card clinical/editorial signoff.
- [ ] Audience-provider selection and sender/domain.
- [ ] Portrait and asset rights.

## J. Release

- [ ] All audits, lint, build, and rendered tests pass.
- [ ] Preview D1 migration is proven.
- [ ] Screenshots and defects are reviewed.
- [ ] v30 remains unchanged until explicit publish approval.
- [ ] Rollback is documented.


## Source-fidelity gate

- [ ] Close `SG-02`: independently transcribe or human-review the full original meeting audio in a capable environment and diff it against `docs/sources/RAW_MEETING_TRANSCRIPT.txt`.
- [ ] For every substantive audio-only or mis-transcribed instruction, add/correct a requirement row before final transcript-completeness approval.
- [ ] Re-run `npm run transcript:complete` after any source-fidelity correction.

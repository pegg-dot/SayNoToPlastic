# v40.10 immediate rendered proof queue

- **HM-19 · High** — The real portrait welcome-film popup must fit inside one standard browser viewport without normal scrolling while keeping the full film frame, close, copy, Play and Continue visible. v40.10 implements the bounded geometry; local rendered acceptance is still required. Heavy zoom/tiny effective viewports intentionally retain a scroll escape hatch for accessibility.

---

# v40.9 immediate rendered proof queue

- **HM-06 / HM-07 · Real welcome-film proof** — Render the first-visit homepage modal, homepage replay chip and `/media` inline player at desktop/tablet/mobile. Verify the full portrait frame is visible, audio starts only after explicit Play, dismissal memory/focus return/close behavior work, and the spoken film is checked against the five-point brief. Create or verify captions/transcript before production signoff.

- **MC-02 / MC-03 · TEDx temporary-publication proof** — Render `/media`; verify the phone-recorded link is visibly temporary/non-official, plays correctly, and is structurally replaceable when the official release arrives.
- **MC-19 · Long-form conversation proof** — Render/test the current long-form YouTube conversation on desktop/tablet/mobile, including click-to-play/external-link behavior and analytics.
- **HV-03 · Community generations proof** — Render `/community` at desktop/tablet/mobile; verify grandmother, mother, and boy are all visible at natural ratio and the artwork does not create an excessively tall/awkward hero.

# v40 immediate rendered re-check

The first post-fix proof is the six screenshot-backed Home defects documented in `docs/V40_HOMEPAGE_POLISH.md`. Those changes are implemented but remain in the rendered-proof bucket until the user/Sites preview confirms them. The broader 41-item queue below is still authoritative.

---

# Remaining internal work — v39.1

This file contains only requirements whose source implementation exists but whose acceptance condition still requires authentic rendered/browser/interaction/performance/workflow proof. It is not an owner-blocker list.

**Count: 47**

No requirement in this file may be promoted because its code exists. Promotion requires the proof named in the matrix.

- **BK-13 · Medium** — Book preview must not read like the entire book or an invented four-chapter table of contents.
  Current evidence: v40.6 labels the homepage interaction as four preview windows and expands the dedicated Book page to six broad territories with an explicit “reading map, not the table of contents” note.
  Proof still required: Render both Book experiences and confirm the richer scope feels accurate, useful, and non-redundant.
- **AB-14 · High** — About must retain the narrative/education/philosophy while carrying materially less text and a balanced closing reflection.
  Current evidence: v40.6 reduces literal About copy from roughly 1,254 to 642 words in source, keeps all five story stages and six principles, removes visible education-confirmation workflow copy, and spreads the closing reflection across three columns on desktop.
  Proof still required: Render at target desktop/tablet/mobile widths; verify reading density, Education presentation, closing alignment, and CTA spacing.

- **BR-06 · Medium** — Use navy, ivory, restrained gold; professional, inviting, not boring.
  Current evidence: v39.1 defines the exact blueprint token values (#09121F, #202020, #F5F1E8, #B4823A, #C79A55) in the active design layer and defines an Inter + Cormorant/DM Serif-ready typography stack with system fallbacks. Older legacy selectors still contain close predecessor values, so real rendered review is required to prove the final visual system is coherent rather than mixed.
  Proof still required: Render every major route and verify the active navy/ivory/gold and type hierarchy feels coherent, professional, and inviting; identify and remove any visible legacy-style drift before approval.
- **BR-07 · Medium** — Titles, navigation identity, conversion actions, and exposure-section copy must have strong readable visual scale; Dr. Haddad specifically said titles/Get the Book and the exposure text felt too small.
  Current evidence: v39.1 uses clamp-based large headings, enlarged exposure-card copy (16px), and prominent gold/navy CTAs. Source cannot prove perceived scale across viewports.
  Proof still required: Verify title, wordmark, Get the Book CTA, exposure labels/body, and footer/legal text at every target viewport and 200% zoom; correct any undersized treatment.
- **HM-05 · Low** — Clear scroll prompt for older/nontechnical visitors.
  Current evidence: Hero has “Enter the body ↓”; anatomy intro explicitly says scroll and select chapters.
  Proof still required: Verify prompt remains visible and understandable at mobile/tablet.
- **HM-06 · Low** — First-visit welcome video popup with replay; placeholder until filmed.
  Current evidence: First-visit modal/replay/focus/scroll-lock behavior is present in source and passes UI audit; browser proof is still required.
  Proof still required: Verify first visit, dismissal memory, replay, mobile, focus return, and reduced motion in the Sites preview.
- **HM-07 · High** — Real welcome film content and accessibility proof.
  Current evidence: the user-supplied 2026-08-08 MP4 is integrated as a web-optimized H.264/AAC asset with a matching poster in both the first-visit/replay modal and Events & Media.
  Proof still required: render/test the film across target viewports; confirm the spoken content covers the five-point welcome brief; create or verify captions/transcript before production signoff.
- **HM-08 · Low** — Home book CTA must work.
  Current evidence: Hero uses central CheckoutButton; WooCommerce remains default.
  Proof still required: Retest in connected preview and live merchant before launch.
- **HM-11 · Medium** — Each exposure route needs a clear representative visual and readable copy; examples from the meeting include a person breathing for air, ocean/plastic bottle for water, and plastic-packaged food for food, plus fast fashion and skincare/cosmetics.
  Current evidence: v39.1 adds route-specific SVG editorial visuals for air (breathing profile/airflow), water (bottle/drop/waves), food (packaged-food container), heat, textiles, and personal care, and enlarges card copy.
  Proof still required: Render all six exposure cards at target desktop/tablet/mobile widths; verify each visual reads immediately, the text is not too small, and no icon feels abstract or decorative-only.
- **HM-17 · Medium** — Avoid excessive repeated headline/copy blocks.
  Current evidence: Core premise appears in both hero and immediate “realization” section; action framing also appears in hero, action section, and later pages.
  Proof still required: During rendered review, test whether the realization section earns its space; remove or merge if it merely restates the hero.
- **HM-18 · High** — Primary story should stay focused and not become too long.
  Current evidence: TEDx removed, action preview shortened, but homepage still contains hero, realization, long anatomy, exposure, action, long book journey, author, media bridge, signup.
  Proof still required: Measure scroll length and comprehension; preserve premium anatomy/book but compress any section that repeats a point without new value.
- **AN-01 · Medium** — Chapter 1 full body/circulation with blood finding.
  Current evidence: Homepage journey starts with full maternal body, vasculature, and blood study.
  Proof still required: Rendered clinical review required; opening context should not imply all later evidence belongs to a pregnant body.
- **AN-02 · Medium** — Chapter 2 recognizable brain with Nature Medicine study.
  Current evidence: Licensed brain model/fallback and direct source are present.
  Proof still required: Verify recognizability and camera transition in rendered preview.
- **AN-03 · High** — Chapter 3 actual heart and coronary/vascular context.
  Current evidence: 3D heart and vasculature are included; fallback heart is simplified but recognizable.
  Proof still required: Conduct rendered clinical-art review and improve fallback if it reads as an abstract mass.
- **AN-06 · High** — Pregnancy scene must show female torso, uterus, fetus, umbilical connection, placenta.
  Current evidence: Scene layers include body, pelvis, uterus, fetus, placenta; hero/fallback image shows cutaway.
  Proof still required: Clinical-art review must confirm registration, umbilical/placental clarity, and biological plausibility.
- **AN-07 · Low** — Pregnancy and placenta should be one coherent maternal-fetal scene.
  Current evidence: Homepage combines them into one chapter.
  Proof still required: No change.
- **AN-08 · Blocker** — Ovary must be recognizable and followed by follicular magnification.
  Current evidence: v38 replaced the rejected generic fallback with a labeled ovary/follicle cross-section and follicular-fluid context. Source audit passes; recognizability and clinical quality are unproven in the rendered site.
  Proof still required: Render at all target viewports; confirm ovary, follicles, developing egg, and follicular-fluid magnification are immediately understandable; revise after clinical review if needed.
- **AN-10 · Blocker** — Testicular anatomy identifiable to non-scientists, with labels.
  Current evidence: v38 replaced the low-detail fallback with a labeled testis/epididymis view generated from licensed BodyParts3D surfaces.
  Proof still required: Render at all target viewports and obtain clinical/anatomy approval; revise if a non-scientist cannot identify the structure.
- **AN-13 · Low** — Scroll drives primary story.
  Current evidence: Scroll progress drives active state and 3D camera.
  Proof still required: Browser QA still required.
- **AN-14 · Low** — Chapter navigation clickable, keyboard, touch.
  Current evidence: Real buttons move to steps and are keyboard/touch operable.
  Proof still required: Browser QA still required.
- **AN-15 · Medium** — Scroll, highlighted label, structure, finding stay synchronized.
  Current evidence: Single active index drives navigation, copy, and scene.
  Proof still required: Rendered interaction QA required for rapid scrolling, resize, and touch.
- **AN-16 · High** — Reduced-motion equivalent has same information in stable panels.
  Current evidence: Reduced motion uses image fallback while text remains; no camera motion.
  Proof still required: Test OS reduced motion at all viewports and ensure every stage image is recognizable.
- **AN-17 · High** — Use real licensed recognizable models/clinical illustration; no decorative primitives as anatomy.
  Current evidence: NIH/BodyParts3D/fetal model licenses are documented; particles are decorative, anatomy is model-based. Ovary/testis visual quality remains insufficient.
  Proof still required: Complete clinical review and replace weak assets before approval.
- **SO-02 · Medium** — Avoid multiple adjacent frameworks/checklists.
  Current evidence: v39 limits the planner to the same three core-rule applications and explicitly frames it as choosing one of those rules rather than introducing another six-step system.
  Proof still required: Rendered comprehension review: confirm the three-rule block and one-choice planner read as one hierarchy, not two competing frameworks.
- **BK-01 · High** — Maintain premium scroll/read-map journey.
  Current evidence: BookJourney exists with scroll-driven cover/open spread/page turns and chapter controls.
  Proof still required: Rendered collision, crop, touch, keyboard, and reduced-motion QA required.
- **BK-03 · High** — Remove redundant book-introduction blocks.
  Current evidence: v39 merges duplicate book premise/audience material into one “Why this book” section, removes the standalone collaborator profile treatment, and preserves distinct hero, inquiry journey, FAQ, and conversion roles.
  Proof still required: Rendered content-purpose review: confirm each surviving book section adds new value and the page does not feel repetitive at target viewports.
- **BK-04 · Medium** — Desktop composition left book/right title, price, delivery, CTA.
  Current evidence: Book page source follows left visual/right copy.
  Proof still required: Verify at 1440/1280/1024 and fix overlap/crop.
- **BK-06 · Medium** — Reduced-motion stable alternative.
  Current evidence: Reduced summary exists.
  Proof still required: Browser test with reduced motion.
- **OP-11 · Medium** — Nontechnical owner can add studies, guides, media, field notes, products without breaking site.
  Current evidence: v39 adds four nontechnical JSON intake templates, a content operations runbook, safe publication defaults, and a dependency-free content:preflight gate. Existing media/affiliate publication gates are also audited.
  Proof still required: Run one usability handoff with a nontechnical owner/editor and confirm they can complete each intake template without developer interpretation; keep publication behind review/build gates.
- **OP-12 · High** — Split heavy visuals, optimized media, fallbacks, slow-mobile tests.
  Current evidence: Dynamic anatomy split/fallbacks exist; build reports >500k client chunk; no slow-network/LCP proof.
  Proof still required: The 3D anatomy module is already dynamically split and fallbacks exist. Use the real Sites production build to profile the oversized chunk, image weights, LCP/CLS, and slow-mobile behavior before deciding whether further code splitting is necessary.
- **OP-13 · High** — Keyboard, focus, semantic headings, forms, contrast, 200% zoom/reflow, reduced motion, and exact responsive viewport checks including 1440, 1366, 1280, 1024, 768, 430, 390, 375, 360, and 320 widths.
  Current evidence: Source-level UI audits and accessibility patterns exist; the exact browser/device/zoom matrix is not yet completed.
  Proof still required: Run manual browser QA at the full viewport matrix, 200% zoom, keyboard-only, reduced-motion, and no-WebGL states; record screenshots and defects.
- **DS-01 · High** — Use the approved global geometry: 1240px max content width, 12/8/4-column desktop/tablet/mobile grid logic, deliberate side padding, intentional breakpoint compositions, body text never below 16px, and 48px minimum touch targets.
  Current evidence: v39.1 defines blueprint-aligned color/spacing/content-width tokens and responsive overrides, but source code alone cannot prove every composition follows the intended grid and density.
  Proof still required: Render and measure the major routes at all required widths; fix any section that stretches, crowds, scales automatically, drops below 16px body text, or creates sub-48px tap targets.
- **DS-02 · Medium** — Header is sticky/overlaid on the hero, visually transparent at the top, then becomes about 92% Midnight Navy with a low-opacity bottom border after roughly 40-60px of scroll.
  Current evidence: Header state is driven by window.scrollY > 48; v39.1 CSS uses transparent-gradient top state and rgba(9,18,31,.92) scrolled state with a 1px border.
  Proof still required: Browser-test top/scrolled transitions, sticky behavior, anchor offsets, and contrast on Home and inner routes.
- **DS-03 · High** — Mobile navigation uses an intentional full-height navy panel with large 28-34px links, one filled gold primary CTA, background scroll lock, keyboard focus trapping, Escape close, and focus return.
  Current evidence: SiteChrome implements scroll lock, focus trap, Escape/focus return, inert background, large mobile links, and a single gold checkout control.
  Proof still required: Test keyboard, touch, screen-size, welcome-modal interaction, focus return, and scroll lock on real mobile/tablet viewports.
- **DS-04 · High** — Major editorial images use intentional responsive crops/variants; important copy and controls remain live; below-fold media is lazy where appropriate; hero media loads eagerly and no essential face/fetus/organ/book/CTA is cropped.
  Current evidence: v39.1 adds dedicated desktop/mobile derivatives for the approved hero, kitchen, and generations visuals and keeps controls/copy live; other imagery has explicit dimensions/fallbacks but still needs rendered crop/performance proof.
  Proof still required: Verify responsive crops, eager/lazy behavior, image dimensions/layout shift, and preservation of all essential subjects across the exact viewport matrix.
- **DS-05 · Medium** — Motion stays restrained: grouped opacity/translate or tiny image scale only; no bounce, spinning, rapid parallax, or line-by-line spectacle; reduced-motion shows the final stable state immediately.
  Current evidence: Existing motion/reduced-motion source rails and anatomy static fallback implement the intended pattern; source audits cannot prove subjective pacing.
  Proof still required: Review animation pacing on desktop/mobile and reduced-motion; remove any effect that competes with reading or feels theatrical rather than editorial.
- **DS-06 · Medium** — Footer and mobile legal/navigation content remain legible: legal text at least 14px, touch targets about 48px, and Contact/Newsletter remain discoverable.
  Current evidence: v39.1 CSS raises footer-bottom text to 14px and gives footer links/buttons 48px minimum height; footer retains Contact and signup.
  Proof still required: Verify footer density, wrapping, touch targets, and readability at 320-430px and 200% zoom.
- **HV-01 · High** — Use the approved maternal/fetal hero artwork with mother, fetus, placenta, hands/face and dark negative space preserved; essential UI remains live rather than baked into the image.
  Current evidence: v39.1 activates the supplied approved mother/fetus/placenta artwork in the Home hero, creates desktop/mobile derivatives, and keeps all headline/CTA text live.
  Proof still required: Render desktop/tablet/mobile hero; confirm fetus/placenta/mother remain legible, copy sits in usable negative space, hero is not blurry, and no key subject is cropped.
- **HV-02 · High** — Use the approved lower-plastic kitchen visual with a visible stainless reverse-osmosis unit, glass storage, stainless drinkware, wood, and cast iron; because the transcript says Home should stay brief, place the detailed visual in Solutions rather than re-bloating Home.
  Current evidence: v39.1 puts the approved kitchen visual on Solutions with desktop/mobile crops and live explanatory text; the transcript-priority conflict is resolved in favor of a brief Home action preview.
  Proof still required: Render Solutions across breakpoints and confirm the RO unit and material cues remain visible and the image helps rather than overwhelms the direct action copy.
- **HV-03 · High** — The Join/Community generational visual shows an elderly woman, an adult woman, and a young boy; the boy must remain visible on mobile and embedded artwork text/buttons must not replace live form content.
  Current evidence: v40.8 replaces the previously cropped derivative with the complete 1024×1536 blueprint poster plus a full-frame mobile derivative, loads it eagerly on `/community`, caps desktop display height, and uses contain rendering so all three people can remain visible. Home intentionally omits the oversized panel per later local review.
  Proof still required: Render `/community` at desktop/tablet/mobile; verify all three generations remain identifiable, especially the boy on mobile, with no cover crop or awkward oversizing. Confirm live signup/copy remain clearly separate from artwork.
- **HV-04 · Medium** — Keep the live inheritance quote on a calm flat dark footer field. The earlier Earth-at-night photo treatment is superseded by later rendered review; prove that the faint abstract Earth curve remains unobtrusive and the quote/navigation retain strong contrast.
  Current evidence: v39.1 uses a cropped Earth-at-night derivative without the embedded quote plus a live quote/navigation layer and dark gradient.
  Proof still required: Render footer desktop/mobile/200% zoom; confirm Earth curve remains visible, quote does not duplicate, and links retain contrast over the image.
- **QA-01 · Blocker** — The final visual QA matrix includes 1440x900, 1366 laptop, 1280x800, 1024x768/landscape behavior, 768x1024 portrait, 430x932, 390x844, 375x667, 360 mobile, and 320 minimum width, plus 200% zoom and reduced motion.
  Current evidence: The QA runbook exists and v39.1 expands the required viewport list, but real rendered proof is pending the Sites/browser environment.
  Proof still required: Run and archive screenshots/results for the complete viewport/accessibility matrix; any overflow/crop/collision or hierarchy problem becomes a release-blocking defect until corrected.
- **CF-08 · Medium** — Home SEO should preserve the blueprint’s physician-led microplastics/human-health/practical-solutions search intent while later movement identity remains Say No to Plastic and TEDx-specific conversion is not forced into the hero.
  Current evidence: v39.1 restores the blueprint-aligned Home title/meta intent and adds a 1200x630 candidate social-share image using the approved hero artwork; final social-card visual polish still needs rendered review.
  Proof still required: Inspect generated search/social metadata and social-card crop in a real preview; verify title/description are not overlong and the candidate social image is legible before production.
- **SG-02 · High** — Before final transcript-completeness signoff, independently compare the preserved original meeting audio with the written transcript. Any substantive instruction, correction, visual reference, wording change, or source detail present in audio but absent/mis-transcribed in the written record must be added to the completion matrix before approval.
  Current evidence: The original M4A and written transcript are both preserved in docs/sources with SHA-256 integrity hashes. The current runtime can inspect audio metadata but has no installed speech-transcription model/engine, so no independent audio-to-text fidelity claim is made.
  Proof still required: In a transcription-capable environment, transcribe or human-review the full original audio, diff it against RAW_MEETING_TRANSCRIPT.txt, and add/correct matrix rows for every substantive delta before final requirements signoff. Specifically re-check any remembered but text-absent phrase such as “airplanes/flapping” rather than inventing it now.

## Exit condition

This file reaches zero only after the required Sites/browser QA evidence has been captured and every resulting defect has been corrected and re-tested.

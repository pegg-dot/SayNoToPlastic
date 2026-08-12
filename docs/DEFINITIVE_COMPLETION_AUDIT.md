# v40.10 addendum — Welcome modal one-viewport fit

Rendered local review on 2026-08-08 found the v40.9 real welcome-film popup too tall for a normal laptop viewport. v40.10 keeps the supplied film, poster and first-visit/replay behavior unchanged but adds requirement `HM-19`: the standard popup must fit in one viewport without normal scrolling while keeping the complete portrait film and all controls visible. Extreme zoom/tiny effective viewports may scroll only as an accessibility escape hatch.

The authoritative ruler is now **179 requirements: 99 proven / 48 proof-gated / 32 externally blocked**. HM-19 remains proof-gated until the corrected render is accepted locally.

---

# v40.9 addendum — Real welcome film supplied and integrated

The acceptance ruler remains **178 requirements**, but HM-07 moves from an owner-asset blocker into the internal proof queue because the project user supplied the current welcome MP4 on 2026-08-08. Current counts are **99 done/proven · 47 requiring rendered/interaction/workflow proof · 32 owner/provider/source blocked**.

v40.9 ships a browser-compatible H.264/AAC derivative and poster, uses the same canonical film configuration for the first-visit/replay homepage dialog and Events & Media, and preserves click-to-play behavior with no sound autoplay. The source film has no subtitle track and this environment cannot independently transcribe its spoken content, so captions/transcript plus five-point content verification remain explicit launch proof.

See `docs/WELCOME_FILM_INTEGRATION.md`, `app/content/welcome-film-metadata.json`, and `scripts/welcome-film-audit.mjs`.

---

# v40.7 addendum — Media + Community rendered review incorporated

The acceptance ruler now contains **178 requirements**: **99 done/proven · 46 requiring rendered/interaction/workflow proof · 33 owner/provider/source blocked**.

Latest explicit user direction authorizes the previously supplied phone-recorded TEDx YouTube link **temporarily** while the official TEDx release is pending. v40.7 records that exception without calling it official or owner-approved, restores the preserved long-form Homo Plasticus conversation as MC-19, leaves exact dates/rights verification open, and renders the approved Community generations artwork at natural ratio.

See `docs/V40_7_MEDIA_COMMUNITY_POLISH.md`, `docs/DEFINITIVE_COMPLETION_MATRIX.csv`, and `scripts/media-community-polish-audit.mjs`.

---

# v40.6 addendum — Book + Dr. Haddad rendered review incorporated

The authoritative acceptance ruler now contains **177 requirements**. Two later rendered-review requirements were added without rewriting the historical 175-row audit: **BK-13** prevents the four Book preview states from being presented as the full book/table of contents, and **AB-14** preserves the About narrative/education/philosophy while requiring materially lower text density, no visible owner-confirmation workflow box, and a balanced closing reflection.

Current bucket counts: **102 done and proven / 43 requiring rendered or workflow proof / 32 blocked on owner, provider, rights, or missing source input.** No item is promoted solely because source code changed.

The education provenance conflict remains recorded internally under AB-06. The latest user direction changes the *public presentation* of that uncertainty; it does not fabricate final dates or silently erase the underlying source conflict.

See `docs/V40_6_BOOK_ABOUT_POLISH.md` and `scripts/book-about-polish-audit.mjs`.

---

# v40.1 addendum — second local homepage review incorporated

The user reviewed the lower Home page in the real local v40 render and explicitly approved the overall direction except for two visible defects: the Events & Media navy band was capped to the 1240px content width instead of filling the viewport, and the approved generations artwork consumed multiple full screens immediately below it. v40.1 makes the media background full-bleed while retaining editorial-grid alignment, removes the giant generations panel from Home, preserves the Home newsletter/community path, and retains the responsive approved generations artwork on `/community`. This later explicit rendered decision supersedes the older blueprint's Home placement without deleting the underlying asset requirement.

The 175-requirement ruler and counts remain **102 / 41 / 32**. No visual item is promoted solely because source changed. See `docs/V40_1_LOWER_HOME_POLISH.md` and `docs/reviews/v40.1-homepage/REVIEW_MANIFEST.md`.

---

# v40 addendum — local rendered feedback incorporated

The 175-requirement ruler remains authoritative and the bucket counts remain 102 / 41 / 32. v40 does **not** promote the changed visual items to done; it amends their evidence/acceptance notes after a real local v39.1 review. In particular, HM-01 and HM-09 now record the later explicit presentation decisions: remove the environmental-problem setup line from the first-screen hero, and label the overlapping exposure pair as Food storage + Heat. See `docs/V40_HOMEPAGE_POLISH.md`.

---

# Definitive v39.1 nothing-left-behind completion audit

**Audit date:** 2026-08-07

**Authority basis:** preserved raw written Dr. Haddad meeting transcript; original meeting audio; Master Delivery Register; supplied Quick Action Card/book imagery; both blueprint chapters; later explicit project decisions; reconstructed v39.1 source.

**Rule:** code existence is not visual, clinical, owner, or provider proof. A requirement is promoted only when its acceptance condition has actually been demonstrated.

## Executive truth

- **175** requirements are now explicitly tracked, up from 150.
- **102 — Done and proven** at the available source/structure level.
- **41 — Built, but real rendered/browser/interaction/performance/workflow proof remains.**
- **32 — Blocked on owner, provider, rights, clinical approval, or missing source/context.**
- **25** requirements were added because the prior 150-row ruler under-tracked concrete visual/design/workflow/source-conflict instructions.

v39.1 is therefore **not a claim that the public site is finished**. It is a corrected traceability boundary: no known development-controlled source implementation from this pass is intentionally left as a vague TODO, while visual acceptance and genuine blockers remain explicit.

## Reconstruction provenance

The full binary/source ZIP previously labeled v39 was not present in the active runtime when this pass began. v39.1 was reconstructed from the complete v38 source package plus the preserved v39 audit/completion records, then the claimed v39 source improvements were reapplied and extended with the newly recovered visual/design requirements. The package does not pretend to be byte-identical to the earlier v39 artifact.

## Newly tracked / strengthened requirements

- **DS-01 · High** — Use the approved global geometry: 1240px max content width, 12/8/4-column desktop/tablet/mobile grid logic, deliberate side padding, intentional breakpoint compositions, body text never below 16px, and 48px minimum touch targets.
  Current evidence: v39.1 defines blueprint-aligned color/spacing/content-width tokens and responsive overrides, but source code alone cannot prove every composition follows the intended grid and density.
  Status action: Render and measure the major routes at all required widths; fix any section that stretches, crowds, scales automatically, drops below 16px body text, or creates sub-48px tap targets.
- **DS-02 · Medium** — Header is sticky/overlaid on the hero, visually transparent at the top, then becomes about 92% Midnight Navy with a low-opacity bottom border after roughly 40-60px of scroll.
  Current evidence: Header state is driven by window.scrollY > 48; v39.1 CSS uses transparent-gradient top state and rgba(9,18,31,.92) scrolled state with a 1px border.
  Status action: Browser-test top/scrolled transitions, sticky behavior, anchor offsets, and contrast on Home and inner routes.
- **DS-03 · High** — Mobile navigation uses an intentional full-height navy panel with large 28-34px links, one filled gold primary CTA, background scroll lock, keyboard focus trapping, Escape close, and focus return.
  Current evidence: SiteChrome implements scroll lock, focus trap, Escape/focus return, inert background, large mobile links, and a single gold checkout control.
  Status action: Test keyboard, touch, screen-size, welcome-modal interaction, focus return, and scroll lock on real mobile/tablet viewports.
- **DS-04 · High** — Major editorial images use intentional responsive crops/variants; important copy and controls remain live; below-fold media is lazy where appropriate; hero media loads eagerly and no essential face/fetus/organ/book/CTA is cropped.
  Current evidence: v39.1 adds dedicated desktop/mobile derivatives for the approved hero, kitchen, and generations visuals and keeps controls/copy live; other imagery has explicit dimensions/fallbacks but still needs rendered crop/performance proof.
  Status action: Verify responsive crops, eager/lazy behavior, image dimensions/layout shift, and preservation of all essential subjects across the exact viewport matrix.
- **DS-05 · Medium** — Motion stays restrained: grouped opacity/translate or tiny image scale only; no bounce, spinning, rapid parallax, or line-by-line spectacle; reduced-motion shows the final stable state immediately.
  Current evidence: Existing motion/reduced-motion source rails and anatomy static fallback implement the intended pattern; source audits cannot prove subjective pacing.
  Status action: Review animation pacing on desktop/mobile and reduced-motion; remove any effect that competes with reading or feels theatrical rather than editorial.
- **DS-06 · Medium** — Footer and mobile legal/navigation content remain legible: legal text at least 14px, touch targets about 48px, and Contact/Newsletter remain discoverable.
  Current evidence: v39.1 CSS raises footer-bottom text to 14px and gives footer links/buttons 48px minimum height; footer retains Contact and signup.
  Status action: Verify footer density, wrapping, touch targets, and readability at 320-430px and 200% zoom.
- **HV-01 · High** — Use the approved maternal/fetal hero artwork with mother, fetus, placenta, hands/face and dark negative space preserved; essential UI remains live rather than baked into the image.
  Current evidence: v39.1 activates the supplied approved mother/fetus/placenta artwork in the Home hero, creates desktop/mobile derivatives, and keeps all headline/CTA text live.
  Status action: Render desktop/tablet/mobile hero; confirm fetus/placenta/mother remain legible, copy sits in usable negative space, hero is not blurry, and no key subject is cropped.
- **HV-02 · High** — Use the approved lower-plastic kitchen visual with a visible stainless reverse-osmosis unit, glass storage, stainless drinkware, wood, and cast iron; because the transcript says Home should stay brief, place the detailed visual in Solutions rather than re-bloating Home.
  Current evidence: v39.1 puts the approved kitchen visual on Solutions with desktop/mobile crops and live explanatory text; the transcript-priority conflict is resolved in favor of a brief Home action preview.
  Status action: Render Solutions across breakpoints and confirm the RO unit and material cues remain visible and the image helps rather than overwhelms the direct action copy.
- **HV-03 · High** — The Join/Community generational visual shows an elderly woman, an adult woman, and a young boy on the dedicated Community experience; the boy must remain visible on mobile and embedded artwork text/buttons must not replace live form content. The latest local homepage review explicitly removes the giant generational image from Home.
  Current evidence: v40.1 removes the oversized generations panel from Home per the latest rendered user review while retaining the live Home newsletter/community path. /community still uses the approved generational visual and keeps signup/headline/consent as live HTML.
  Status action: Render /community at desktop/tablet/mobile; verify all three generations remain identifiable, especially the boy on mobile, and no embedded fake control is mistaken for the real form. Verify Home transitions cleanly from full-bleed Events & Media into the text/form Join section with no oversized image.
- **HV-04 · Medium** — Keep the live inheritance quote on a calm flat dark footer field. The earlier Earth-at-night photo treatment is superseded by later rendered review; prove that the faint abstract Earth curve remains unobtrusive and the quote/navigation retain strong contrast.
  Current evidence: v39.1 uses a cropped Earth-at-night derivative without the embedded quote plus a live quote/navigation layer and dark gradient.
  Status action: Render footer desktop/mobile/200% zoom; confirm Earth curve remains visible, quote does not duplicate, and links retain contrast over the image.
- **AS-01 · Low** — Preserve the planned professional sculpture photography as a possible authored visual/media asset; do not invent or substitute it if the photos have not been supplied.
  Current evidence: The project record now explicitly tracks the sculpture-photo request; no final professional sculpture photographs are present in the source package.
  Status action: When Dr. Haddad provides the professional sculpture photographs and rights, art-direct their use or explicitly decide they are not needed for launch.
  Blocked by: Dr. Haddad / photographer
- **CF-05 · High** — Preserve the About content Dr. Haddad said he liked together with its image, while honoring the later blueprint accessibility rule that important biography copy should be live text rather than flattened into an image.
  Current evidence: The current About page uses live biography content and portrait treatment, but the referenced Chapter 3 Parts I/II / exact approved composite content is not preserved in the available source package.
  Status action: Recover the Chapter 3 Parts I/II / approved About source, then recreate the approved text-content relationship as accessible live content beside approved imagery rather than shipping a flattened text image.
  Blocked by: Missing Chapter 3 / approved About source
- **MC-16 · Low** — A Linktree-style share/contact collection is optional and should exist only if it serves a real user purpose without duplicating primary navigation.
  Current evidence: The current site provides direct Community, Contact, Media, Guides, and social/share paths without adding a redundant Linktree clone; the conditional idea is preserved in documentation.
  Status action: No implementation required unless a concrete future share/contact use case emerges; reassess then rather than adding duplicate navigation.
- **CP-01 · Medium** — Keep specifically rejected AI/meta phrasing out of public reading paths, including “caution can be practical without pretending…,” “build a common relationship with evolving science,” and major “do not turn caution into panic” framing. Do not incorrectly blacklist “small enough to begin, meaningful enough to repeat,” which Dr. Haddad accepted after clarification.
  Current evidence: The rejected phrases are absent from app source in v39.1; the accepted phrase is not treated as a prohibited regression rule.
  Status action: Maintain the rejected-phrase regression audit; if the accepted phrase is reused, judge it in context rather than automatically deleting it.
- **LA-01 · Low** — After the public-domain launch, Dr. Haddad wanted his own long-context ChatGPT Pro to review the live site for missing, redundant, or incorrect elements; its output becomes a tracked review batch rather than ad-hoc edits.
  Current evidence: The post-launch independent review is now preserved as an explicit launch-stage requirement.
  Status action: After public launch and owner access, run Dr. Haddad’s independent review against the public domain and triage recommendations into a versioned change batch.
  Blocked by: Dr. Haddad / public launch
- **MC-17 · High** — Newsletter activation requires a real audience-provider flow: Landing Page - Join Movement source attribution, provider/account decision, double-opt-in decision where appropriate, spam protection, correct welcome flow, and successful tests to at least two external email addresses.
  Current evidence: v39.1 has provider abstraction, consent storage, welcome/outbox infrastructure, and provider preflight; real provider/account delivery is intentionally inactive.
  Status action: Choose/configure the marketing audience provider, set source tagging/double-opt-in/spam policy, authenticate sender/domain, and prove signup + welcome + unsubscribe using at least two external addresses.
  Blocked by: Audience provider / DNS / owner
- **MC-18 · Medium** — When official video is published, use a lightweight poster first, no sound autoplay, accessible lightbox/dedicated route, captions/transcript when available, Escape close, and focus return.
  Current evidence: Media infrastructure supports poster/metadata/pending publication, but the official TEDx video and transcript/caption assets are not yet approved/published.
  Status action: After owner confirms the official public video and rights, wire the accessible player/link behavior and test captions/transcript/Escape/focus return.
  Blocked by: Official media asset / owner approval
- **QA-01 · Blocker** — The final visual QA matrix includes 1440x900, 1366 laptop, 1280x800, 1024x768/landscape behavior, 768x1024 portrait, 430x932, 390x844, 375x667, 360 mobile, and 320 minimum width, plus 200% zoom and reduced motion.
  Current evidence: The QA runbook exists and v39.1 expands the required viewport list, but real rendered proof is pending the Sites/browser environment.
  Status action: Run and archive screenshots/results for the complete viewport/accessibility matrix; any overflow/crop/collision or hierarchy problem becomes a release-blocking defect until corrected.
- **AB-13 · Low** — Any About-page trust row using media, book, speaking, hospital, or TEDx marks must use only verified affiliations/rights and consistent restrained presentation.
  Current evidence: The site does not fabricate an unverified logo trust row; media/press assets remain gated by verification and rights.
  Status action: Add a trust row only after Dr. Haddad confirms the affiliations/marks and usage rights; otherwise omit it.
  Blocked by: Dr. Haddad / rights approval
- **CF-06 · High** — The older blueprint’s static hero/evidence/TEDx-heavy nine-section Home architecture is superseded where it conflicts with later transcript/Register decisions: interactive anatomy remains the primary body story and TEDx belongs under Events & Media, not a large Home section.
  Current evidence: Current Home keeps the interactive anatomy journey and a restrained Events & Media bridge; no large TEDx section is present. The approved maternal/fetal hero art is reused without restoring superseded TEDx/Home architecture.
  Status action: Preserve this authority rule in future redesigns; do not reintroduce the superseded large Home TEDx/static-evidence blueprint merely because it appears in an older document.
- **CF-07 · Medium** — The blueprint’s detailed kitchen “Where to Start” Home section is superseded in placement—not content—by Dr. Haddad’s later request to keep Home shorter and send detailed action guidance to Solutions.
  Current evidence: v39.1 keeps Home action guidance compact and places the approved kitchen/RO visual and detailed material guidance on Solutions.
  Status action: Keep detailed kitchen guidance in Solutions unless a later explicit owner decision reopens Home length/sequence.
- **CF-08 · Medium** — Home SEO should preserve the blueprint’s physician-led microplastics/human-health/practical-solutions search intent while later movement identity remains Say No to Plastic and TEDx-specific conversion is not forced into the hero.
  Current evidence: v39.1 restores the blueprint-aligned Home title/meta intent and adds a 1200x630 candidate social-share image using the approved hero artwork; final social-card visual polish still needs rendered review.
  Status action: Inspect generated search/social metadata and social-card crop in a real preview; verify title/description are not overlong and the candidate social image is legible before production.
- **CF-09 · High** — The meeting transcript and Master Delivery Register describe the newer European Heart Journal acute-heart-attack/coronary-blood study as 2025, but the verified primary publication used by the site is dated 2026; public evidence must follow the verified primary record while preserving the source conflict.
  Current evidence: The evidence record uses year 2026, journal European Heart Journal, DOI 10.1093/eurheartj/ehag447, and the primary Oxford Academic URL. The reconciliation audit explicitly records that the Register says 2025 while the primary publication is dated 2026.
  Status action: Preserve this conflict row and SC-04 as regression protection. Do not change the public year back to the meeting/Register wording unless the primary publication record itself changes or a documented correction is issued.
- **SG-01 · Medium** — A meeting visual was explicitly called “not complete” just before the discussion moved into Guides/Book, but the written transcript alone does not identify which image or what completion was required. This ambiguity must remain visible rather than being guessed away.
  Current evidence: The ambiguity is now preserved as a source-gap requirement instead of being silently omitted from the completion count.
  Status action: Recover the original meeting screen/context or ask Dr. Haddad which image was incomplete; map the correction only after the target is identifiable.
  Blocked by: Missing meeting visual context
- **SG-02 · High** — Before final transcript-completeness signoff, independently compare the preserved original meeting audio with the written transcript. Any substantive instruction, correction, visual reference, wording change, or source detail present in audio but absent/mis-transcribed in the written record must be added to the completion matrix before approval.
  Current evidence: The original M4A and written transcript are both preserved in docs/sources with SHA-256 integrity hashes. The current runtime can inspect audio metadata but has no installed speech-transcription model/engine, so no independent audio-to-text fidelity claim is made.
  Status action: In a transcription-capable environment, transcribe or human-review the full original audio, diff it against RAW_MEETING_TRANSCRIPT.txt, and add/correct matrix rows for every substantive delta before final requirements signoff. Specifically re-check any remembered but text-absent phrase such as “airplanes/flapping” rather than inventing it now.

## Built, but proof still required

These **41** requirements are not hidden implementation TODOs. They require authentic rendered, interaction, performance, accessibility, workflow, or device proof before promotion.

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
- **HV-03 · High** — The Join/Community generational visual shows an elderly woman, an adult woman, and a young boy on the dedicated Community experience; the boy must remain visible on mobile and embedded artwork text/buttons must not replace live form content. The latest local homepage review explicitly removes the giant generational image from Home.
  Current evidence: v40.1 removes the oversized generations panel from Home per the latest rendered user review while retaining the live Home newsletter/community path. /community still uses the approved generational visual and keeps signup/headline/consent as live HTML.
  Proof still required: Render /community at desktop/tablet/mobile; verify all three generations remain identifiable, especially the boy on mobile, and no embedded fake control is mistaken for the real form. Verify Home transitions cleanly from full-bleed Events & Media into the text/form Join section with no oversized image.
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

## Owner / provider / source blockers

These **32** requirements cannot honestly be completed from source work alone.

- **BR-05 · High** — Create a distinctive, professional Say No to Plastic signature wordmark—not groovy—with the movement mark itself in the established gold family while surrounding navigation/copy can remain white/ivory; provide a reusable kit for site, social, email, print, and future merchandise.
  Current evidence: v39.1 includes horizontal, compact, and monochrome candidates plus a live gold HTML wordmark; surrounding navigation remains ivory/white. Clear-space guidance and a typography boundary are documented. Final typeface/license and owner approval remain open.
  Required action: Render the live lockup at header/footer/social sizes, verify the gold/ivory hierarchy is distinctive and professional, then obtain Dr. Haddad/owner approval and final font/license decision before labeling the identity final.
  Blocked by: Dr. Haddad / authorized owner
- **BR-08 · Blocker** — Use saynotoplastic.com as final domain identity.
  Current evidence: Source defaults now use https://saynotoplastic.com; legacy homoplasticus.com remains only as the WooCommerce fallback. DNS/domain connection is not yet proven.
  Required action: Connect and verify the real domain/canonical redirects before launch.
  Blocked by: External account / provider / domain
- **BR-09 · High** — Separate public contact/sender identity from the old Homo Plasticus address.
  Current evidence: Source defaults now use support@saynotoplastic.com and separate movement identity, but the actual public inbox/sender has not been owner/provider verified.
  Required action: Owner chooses/approves the public support and sender identities; verify delivery on the domain.
  Blocked by: Dr. Haddad / authorized owner
- **HM-07 · High** — Welcome film should cover who he is, mission, what microplastics are, sources, and why it matters.
  Current evidence: Pending description mentions project purpose and where to begin, but final video content cannot be verified.
  Required action: Use a filming brief that explicitly covers all five topics; require captions/transcript/poster.
  Blocked by: Dr. Haddad / authorized owner
- **HM-16 · High** — Use approved real portrait and media imagery.
  Current evidence: Homepage uses /portrait.webp; approval provenance is not documented in source.
  Required action: Confirm portrait approval/rights and replace with final photography if needed.
  Blocked by: Dr. Haddad / authorized owner
- **SO-07 · High** — Water: explain reverse osmosis simply where appropriate.
  Current evidence: Reverse osmosis is now named and explained plainly in the guide while retaining local-water/maintenance context.
  Required action: Dr. Haddad approves final clinical/product-guidance wording before launch.
  Blocked by: Dr. Haddad / authorized owner
- **SO-13 · Medium** — Canned/heavily packaged foods included with precise, sourced wording.
  Current evidence: Packaging guide mentions polymer can liners and favors less packaging, but avoids the direct “avoid canned” instruction.
  Required action: Draft source-backed can-liner guidance for Dr. Haddad approval; avoid unsupported blanket claims.
  Blocked by: Dr. Haddad / authorized owner
- **SO-19 · High** — 12-action card items 10-11 need author attribution/approval rather than unsupported medical promises.
  Current evidence: The authored sauna/detox-food/health-protection wording is preserved with visible evidence-boundary notes rather than silently rewritten.
  Required action: Dr. Haddad provides final clinical/editorial approval or revised author wording.
  Blocked by: Dr. Haddad / authorized owner
- **BK-05 · High** — Open-spread content must use approved themes/sample, not invented filler.
  Current evidence: Current read-map copy is editorially invented from general themes; no owner-approved excerpt/sample is available.
  Required action: Replace with approved chapter themes or excerpt once permission is provided.
  Blocked by: Dr. Haddad / authorized owner
- **BK-08 · Blocker** — Buyer gets download on confirmation and email; recovery/support path.
  Current evidence: Native infrastructure supports success/access/recovery; WooCommerce production route is still external and actual fulfillment is unverified.
  Required action: Test real WooCommerce/native preview flows and confirm download availability beyond email-only access.
  Blocked by: External account / provider / domain
- **BK-11 · Blocker** — Final price, publication metadata, file, tax/territory require owner approval.
  Current evidence: Price is 9.97; publication date/page count/ISBN/preview are pending; final PDF absent.
  Required action: Obtain and insert approved product inputs; run preflight.
  Blocked by: Dr. Haddad / authorized owner
- **AB-02 · Medium** — Use supplied personal narrative as primary source.
  Current evidence: The current About page contains a detailed narrative arc, but the Master Delivery Register says supplied Chapter 3 Parts I and II are the primary source of truth. Those source files are not preserved in the v38 source set, so exact alignment cannot be independently proven from this package.
  Required action: Recover the supplied Chapter 3 Part I/II biography source from the old Work chat or Dr. Haddad, then compare the About page line by line before signoff.
  Blocked by: Dr. Haddad / authorized owner
- **AB-06 · Blocker** — Approved education timeline: St. George’s; Jackson Memorial/Health; cardiovascular; electrophysiology; current work after confirmation.
  Current evidence: St. George’s is retained where consistent; disputed residency/fellowship institutions are withheld rather than publishing either conflicting version.
  Required action: Dr. Haddad confirms the exact education/career chronology in writing.
  Blocked by: Dr. Haddad / authorized owner
- **AB-07 · High** — Current professional work only after confirmation.
  Current evidence: Current-work details are intentionally not expanded into unverified institutions/titles.
  Required action: Dr. Haddad confirms approved current professional wording and dates.
  Blocked by: Dr. Haddad / authorized owner
- **AB-08 · High** — Use real approved photographs: portrait, TEDx, reflective nature, workspace; family only with permission.
  Current evidence: Only portrait/TEDx assets are present; nature/workspace/family assets are absent.
  Required action: Collect final approved photo set and rights.
  Blocked by: Dr. Haddad / authorized owner
- **AB-09 · Medium** — Portrait should be natural/recognizable; blueprint preferred no white coat/stethoscope.
  Current evidence: About hero uses a real-looking white-coat profile image; homepage uses scrubs portrait.
  Required action: Confirm whether white-coat image is approved; otherwise replace with final professional dark-shirt/scrubs portrait.
  Blocked by: Dr. Haddad / authorized owner
- **AB-12 · Low** — Avoid generic AI credential framing.
  Current evidence: The specifically rejected “Training built for complexity” framing is gone, but the Register says the About page should use supplied Chapter 3 Parts I/II as its primary source. Those files are absent from v38, so a full generic-AI-framing comparison cannot be independently completed.
  Required action: Recover Chapter 3 Parts I/II, then perform a line-by-line About copy provenance/tone pass before signoff.
  Blocked by: Dr. Haddad / authorized owner
- **MC-06 · Medium** — NBC/news and other appearances included when provided.
  Current evidence: Not present.
  Required action: Request links, dates, thumbnails, rights.
  Blocked by: Dr. Haddad / authorized owner
- **MC-10 · Blocker** — Newsletter provider/account must be truly configured before described as live.
  Current evidence: Resend/D1 outbox infrastructure exists; Mailchimp audience is not configured. Signup UI appears operational, but provider activation is pending.
  Required action: Choose/approve provider, sender domain, audience/contact model, double opt-in strategy, and run test deliveries.
  Blocked by: External account / provider / domain
- **MC-15 · High** — Route inquiries to correct inbox/category.
  Current evidence: Category captured and durable outbox exists; real routing/delivery not provider-tested.
  Required action: Configure support recipients and test each category end to end.
  Blocked by: External account / provider / domain
- **OP-01 · High** — Privacy policy matches actual analytics, email, checkout, data.
  Current evidence: Detailed policies and consent controls exist; production providers/modes are not active, so final match is pending.
  Required action: Reconcile policy immediately before activation and launch.
  Blocked by: External account / provider / domain
- **OP-08 · High** — Sitemap, robots, canonical, Organization/Person/Book/Article schema.
  Current evidence: All exist.
  Required action: Correct canonical domain and validate rich results/Search Console.
  Blocked by: External account / provider / domain
- **OP-10 · High** — Privacy-aware events for science, book, checkout, order, signup, media, guide, affiliate.
  Current evidence: Consent-aware event endpoint and tracked links exist; live analytics platform verification is absent.
  Required action: Configure provider and verify event matrix without health/payment data.
  Blocked by: External account / provider / domain
- **CF-03 · High** — Older blueprint requires Inter + Cormorant/DM Serif; current code uses Arial + Georgia/Palatino.
  Current evidence: v39 defines an Inter/Cormorant/DM-Serif-ready typography stack with system fallbacks and a matching wordmark candidate, without introducing a third-party font fetch. The final signature typeface is not owner-approved.
  Required action: Approve the final signature/body/display typeface and licensing/hosting approach, then visually sign off the wordmark/typography system.
  Blocked by: Dr. Haddad / authorized owner
- **CF-04 · Blocker** — Education timeline conflict: transcript/register Jackson vs current official-profile Drexel.
  Current evidence: v38 no longer silently chooses either conflicting residency/fellowship timeline; disputed fields are visibly pending.
  Required action: Dr. Haddad resolves the source conflict in writing.
  Blocked by: Dr. Haddad / authorized owner
- **AS-01 · Low** — Preserve the planned professional sculpture photography as a possible authored visual/media asset; do not invent or substitute it if the photos have not been supplied.
  Current evidence: The project record now explicitly tracks the sculpture-photo request; no final professional sculpture photographs are present in the source package.
  Required action: When Dr. Haddad provides the professional sculpture photographs and rights, art-direct their use or explicitly decide they are not needed for launch.
  Blocked by: Dr. Haddad / photographer
- **CF-05 · High** — Preserve the About content Dr. Haddad said he liked together with its image, while honoring the later blueprint accessibility rule that important biography copy should be live text rather than flattened into an image.
  Current evidence: The current About page uses live biography content and portrait treatment, but the referenced Chapter 3 Parts I/II / exact approved composite content is not preserved in the available source package.
  Required action: Recover the Chapter 3 Parts I/II / approved About source, then recreate the approved text-content relationship as accessible live content beside approved imagery rather than shipping a flattened text image.
  Blocked by: Missing Chapter 3 / approved About source
- **LA-01 · Low** — After the public-domain launch, Dr. Haddad wanted his own long-context ChatGPT Pro to review the live site for missing, redundant, or incorrect elements; its output becomes a tracked review batch rather than ad-hoc edits.
  Current evidence: The post-launch independent review is now preserved as an explicit launch-stage requirement.
  Required action: After public launch and owner access, run Dr. Haddad’s independent review against the public domain and triage recommendations into a versioned change batch.
  Blocked by: Dr. Haddad / public launch
- **MC-17 · High** — Newsletter activation requires a real audience-provider flow: Landing Page - Join Movement source attribution, provider/account decision, double-opt-in decision where appropriate, spam protection, correct welcome flow, and successful tests to at least two external email addresses.
  Current evidence: v39.1 has provider abstraction, consent storage, welcome/outbox infrastructure, and provider preflight; real provider/account delivery is intentionally inactive.
  Required action: Choose/configure the marketing audience provider, set source tagging/double-opt-in/spam policy, authenticate sender/domain, and prove signup + welcome + unsubscribe using at least two external addresses.
  Blocked by: Audience provider / DNS / owner
- **MC-18 · Medium** — When official video is published, use a lightweight poster first, no sound autoplay, accessible lightbox/dedicated route, captions/transcript when available, Escape close, and focus return.
  Current evidence: Media infrastructure supports poster/metadata/pending publication, but the official TEDx video and transcript/caption assets are not yet approved/published.
  Required action: After owner confirms the official public video and rights, wire the accessible player/link behavior and test captions/transcript/Escape/focus return.
  Blocked by: Official media asset / owner approval
- **AB-13 · Low** — Any About-page trust row using media, book, speaking, hospital, or TEDx marks must use only verified affiliations/rights and consistent restrained presentation.
  Current evidence: The site does not fabricate an unverified logo trust row; media/press assets remain gated by verification and rights.
  Required action: Add a trust row only after Dr. Haddad confirms the affiliations/marks and usage rights; otherwise omit it.
  Blocked by: Dr. Haddad / rights approval
- **SG-01 · Medium** — A meeting visual was explicitly called “not complete” just before the discussion moved into Guides/Book, but the written transcript alone does not identify which image or what completion was required. This ambiguity must remain visible rather than being guessed away.
  Current evidence: The ambiguity is now preserved as a source-gap requirement instead of being silently omitted from the completion count.
  Required action: Recover the original meeting screen/context or ask Dr. Haddad which image was incomplete; map the correction only after the target is identifiable.
  Blocked by: Missing meeting visual context

## Done/proven requirements by category

### About

- **AB-01 · Low** — Hero: Meet the Physician Behind the Movement.
- **AB-03 · Low** — Narrative arc: cardiology → environmental inquiry → public education.
- **AB-04 · Low** — Philosophy includes science before sensation, curiosity, progress, future generations, causes/prevention, hope.
- **AB-05 · Low** — Credentials section should be titled Education; remove “Training built for complexity.”
- **AB-10 · Low** — Include Explore the Science and Join the Movement actions.
- **AB-11 · Low** — Do not position collaborator as movement participant.

### Affiliate

- **OP-04 · Medium** — Do not publish empty shelves or invented recommendations.
- **OP-05 · Low** — Merchant/product registry with required fields.
- **OP-06 · Low** — Initial categories: clothing, kitchen, water filtration, skincare/cosmetics, household.
- **OP-07 · High** — Affiliate disclosure uses movement identity.

### Anatomy

- **AN-04 · Low** — Keep carotid plaque and coronary blood studies distinct.
- **AN-05 · Low** — Do not use unsupported “three times higher” claim.
- **AN-09 · Low** — Human follicular-fluid study leads; mouse/cell secondary.
- **AN-11 · Low** — Human testicular finding first, methods secondary.
- **AN-12 · Low** — Chapter 7 exits to action/Science.
- **AN-18 · Low** — Each chapter includes caption, finding, meaning, context/limits, direct source.

### Book

- **BK-02 · Low** — Use correct published cover with collaborator credit.
- **BK-07 · Low** — FAQ covers digital format, audience, medical boundary, delivery, support, final sale.
- **BK-09 · Low** — Preserve WooCommerce unless explicit platform replacement.
- **BK-10 · Low** — Native checkout infrastructure connected but inactive until approval.
- **BK-12 · Low** — Do not collect cards in application.

### Brand

- **BR-01 · High** — Use Say No to Plastic as the movement/site identity.
- **BR-02 · Low** — Preserve Homo Plasticus as the book/product identity.
- **BR-03 · Low** — Use Elie R. Haddad, MD as author.
- **BR-04 · Medium** — Keep Dr. Rudolph Eberwein credit limited to the published book context.
- **BR-10 · Medium** — Purpose: educate, sell ebook, collect audience, later disclosed affiliate commerce.

### Community

- **MC-08 · Low** — Newsletter signup and Learn/Reduce/Share/Advocate.
- **MC-09 · Medium** — Keep field-notes proposition human, useful, not wordy.
- **MC-11 · High** — Mailchimp plug-in infrastructure requested by Dr. Haddad.
- **MC-16 · Low** — A Linktree-style share/contact collection is optional and should exist only if it serves a real user purpose without duplicating primary navigation.

### Contact

- **MC-12 · Low** — Lead with Ask a question.
- **MC-13 · Low** — Five inquiry categories.
- **MC-14 · Low** — Medical disclaimer must not dominate.

### Copy governance

- **CP-01 · Medium** — Keep specifically rejected AI/meta phrasing out of public reading paths, including “caution can be practical without pretending…,” “build a common relationship with evolving science,” and major “do not turn caution into panic” framing. Do not incorrectly blacklist “small enough to begin, meaningful enough to repeat,” which Dr. Haddad accepted after clarification.

### Homepage

- **HM-01 · Low** — Core premise: “Plastic is not just an environmental problem.”
- **HM-02 · Low** — Keep the book line: “The most dangerous pollutant is the one already inside us.”
- **HM-03 · Low** — Remove “From Environmental Crisis to Human Biology,” “Story of Plastics Engine,” and decorative explanation box.
- **HM-04 · Low** — Introduce project as physician-led without a caveat wall.
- **HM-09 · Low** — Exposure routes: air, water, food, heat/food contact, fast fashion, skincare/cosmetics.
- **HM-10 · Low** — Exposure wording must not use ambiguous “routes repeat” / repetition principle.
- **HM-12 · Low** — Home action preview should be brief and link to Solutions.
- **HM-13 · High** — Use the Quick Action Card’s authored three core rules: do not heat, store, or drink from plastic.
- **HM-14 · Low** — Lower-page order: action, book, Dr. Haddad, Events & Media, community.
- **HM-15 · Low** — Greatest inheritance quote belongs near lower site/footer, not repeated randomly.

### Information architecture

- **IA-01 · Low** — Explicit Home navigation and logo returns Home.
- **IA-02 · Low** — Science is the evidence deep-dive and may repeat anatomy findings.
- **IA-03 · Low** — Solutions is the action hub and Guides is the deeper library.
- **IA-04 · Low** — Dedicated book page.
- **IA-05 · Low** — Dedicated Dr. Haddad/About page.
- **IA-06 · Low** — Events & Media destination, not TEDx-only.
- **IA-07 · Low** — TEDx should not be a large homepage section; it belongs under Media.
- **IA-08 · Low** — Community contains signup and movement actions.
- **IA-09 · Medium** — Community should offer a discoverable inquiry/contact path.
- **IA-10 · Low** — Separate Contact route for ebook, media, research, partnerships, general questions.
- **IA-11 · Low** — Resources label should not remain ambiguous.
- **IA-12 · Medium** — Recommendations must not appear as an unexplained primary destination before products are approved.

### Legal

- **OP-02 · Low** — Digital sales final; genuine technical access problems receive support.
- **OP-03 · Low** — Affiliate disclosure near links and dedicated page.

### Media

- **MC-01 · High** — Events & Media supports TEDx, news, interviews, podcasts, panels, events.
- **MC-02 · Blocker** — Use official TEDx video only after owner confirms link.
- **MC-03 · High** — Do not use informal phone recording as main talk.
- **MC-04 · Medium** — Podcast/Spotify can be added later without redesign.
- **MC-05 · High** — Every media item needs verified URL, date, platform, thumbnail/right-to-use status.
- **MC-07 · Low** — Press kit with biography, topics, facts, assets.

### Operations

- **OP-14 · Low** — Newsletter/contact/commerce intent should survive provider failure.
- **OP-15 · Low** — Production activation and monitoring remain parked until accounts/assets approved.
- **OP-16 · Blocker** — D1 migrations verified in isolated environment before activation.
- **OP-17 · Low** — Final ebook, welcome video, media links, affiliates, domain, sender ownership remain visible open items.

### SEO

- **OP-09 · Medium** — No accidental noindex and indexable guide pages.

### Science

- **SC-01 · Low** — Lead with findings, plain language, original sources.
- **SC-02 · Low** — Brain Nature Medicine human tissue finding.
- **SC-03 · Low** — 2024 carotid plaque study distinct.
- **SC-04 · Low** — Coronary blood/acute heart attack study included accurately.
- **SC-05 · Low** — Placenta maternal/fetal-facing context.
- **SC-06 · Low** — Human follicular fluid 14/18 and concentration leads.
- **SC-07 · Low** — Explain follicular fluid in everyday language.
- **SC-08 · Low** — Testicular evidence consumer meaning before method.
- **SC-09 · Medium** — Keep reputable WHO/FDA/MD Anderson context only when useful.
- **SC-10 · Medium** — Remove generic “how we are honest/how we verify” sermon before findings.
- **SC-11 · Low** — Do not overstate causation, disease, fertility, detox, treatment.
- **SC-12 · Low** — Technical terms explained where they matter.

### Solutions

- **SO-01 · Low** — First practical message is simply use less plastic.
- **SO-03 · Low** — Choose one realistic change at a time.
- **SO-04 · Blocker** — Preserve Dr. Haddad’s 12-action Quick Action Card as authored.
- **SO-05 · High** — Original core rules: do not heat plastic, do not store food in plastic, do not drink from plastic.
- **SO-06 · High** — Water: avoid plastic bottles.
- **SO-08 · Low** — Do not heat/microwave food in plastic.
- **SO-09 · Blocker** — Do not recommend cooling hot food before moving it into plastic storage.
- **SO-10 · Medium** — Use glass, ceramic, or steel for storage.
- **SO-11 · High** — Kitchen conversion should include tools, plates, cups, spatulas, storage supplies.
- **SO-12 · High** — Direct memorable message eliminating single-use cups, plates, and foodware where possible.
- **SO-14 · Low** — Indoor dust: HEPA and ventilation.
- **SO-15 · Low** — Fast fashion/synthetic textiles across home, solutions/guides, affiliates.
- **SO-16 · Low** — Skincare/cosmetics across home, solutions/guides, affiliates.
- **SO-17 · Medium** — People should choose cleaner personal-care products in plain language.
- **SO-18 · High** — Avoid “do not turn precaution into panic” and formula-like language as major sections.
- **SO-20 · High** — Printable/downloadable branded Quick Action Card.

### Source conflict

- **CF-01 · Low** — Older blueprint placed a full TEDx section and hero TEDx CTA on Home.
- **CF-02 · Low** — Older blueprint hero headline “The greatest pollution crisis…” vs transcript shorter premise.
- **CF-06 · High** — The older blueprint’s static hero/evidence/TEDx-heavy nine-section Home architecture is superseded where it conflicts with later transcript/Register decisions: interactive anatomy remains the primary body story and TEDx belongs under Events & Media, not a large Home section.
- **CF-07 · Medium** — The blueprint’s detailed kitchen “Where to Start” Home section is superseded in placement—not content—by Dr. Haddad’s later request to keep Home shorter and send detailed action guidance to Solutions.
- **CF-09 · High** — The meeting transcript and Master Delivery Register describe the newer European Heart Journal acute-heart-attack/coronary-blood study as 2025, but the verified primary publication used by the site is dated 2026; public evidence must follow the verified primary record while preserving the source conflict.

## Non-negotiable conclusion

The next Sites review must use this **175-row matrix**—not the older 150-row count—as the acceptance ruler. Any future requirement discovered from a preserved source must be added as a row before completion counts are updated.

The new **CF-09** row permanently preserves the 2025 meeting/Register wording versus the verified 2026 European Heart Journal publication date so future editing does not accidentally regress the scientific metadata.


## v40.8 Community source-artwork correction — 2026-08-07
The local v40.7 render proved that the generations poster was still visibly cut off. Inspection of the authoritative Chapter 2 DOCX showed the website had been using a previously cropped 700×1536 derivative rather than the complete supplied 1024×1536 poster. v40.8 extracts that complete source image from the blueprint, produces full-frame WebP desktop/mobile derivatives, and fits the 2:3 poster within the desktop viewport using contain rendering. HV-03 remains proof-gated until the real desktop/mobile render is accepted. No generated replacement art is used.

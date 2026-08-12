# v40.9 current-state addendum — Welcome film received

The historical sections below correctly document that the film was previously unavailable. On 2026-08-08 the project user supplied the current welcome MP4. v40.9 integrates a browser-compatible hosted derivative plus poster into the existing first-visit/replay modal and the Events & Media welcome-film section. Asset placement is no longer owner-blocked; captions/transcript, five-point spoken-content verification, and real-browser playback remain open proof.

---

# Transcript-to-code reconciliation audit

**Version reviewed:** v34 working continuation of v33  
**Audit date:** August 6, 2026  
**Status:** active source-of-truth register; do not remove open requirements during later feature work

## Goal anchor

**North star:** Say No to Plastic should help a general reader understand emerging human evidence, make practical changes, obtain *Homo Plasticus* reliably, and return for useful guidance.

**Primary audience:** households, general readers, clinicians, educators, journalists, and advocates.

**Core value:** calm, evidence-first public education connected to practical action and dependable supporter systems.

**Non-goals:** a generic online store, a fear funnel, a detox product, a diagnostic service, or an empty affiliate shelf.

## Sources and precedence

This audit reconciles the portable source against the **Say No to Plastic Master Delivery Register**, which states that it translates the complete Dr. Haddad transcript, Design Bible, supplied assets, and later decisions into acceptance-tested requirements.

Use this precedence when sources conflict:

1. The user's later explicit decision in the active project conversation.
2. The Master Delivery Register derived from the complete transcript.
3. Verified primary sources and current official professional records for factual details.
4. The older landing-page blueprint where it has not been superseded.
5. Existing implementation only when it does not conflict with the items above.

**Historical note:** this v34-era paragraph is superseded. The v39.1 package now preserves the raw written meeting transcript, original audio, Master Delivery Register, both blueprint chapters, and supplied source images under `docs/sources/` with SHA-256 integrity hashes. The current acceptance authority is `docs/DEFINITIVE_COMPLETION_MATRIX.csv` plus the preserved source set.

## Conflict log

| Topic | Earlier source | Later / stronger source | Decision in v34 |
| --- | --- | --- | --- |
| TEDx on Home | Older landing-page blueprint included a TEDx homepage section and CTA. | User explicitly said TEDx must be on Media only. | TEDx remains absent from Home. A generic Events & Media bridge links to `/media`; `/tedx` redirects to the featured media area. |
| Checkout platform | Register says preserve WooCommerce unless Dr. Haddad explicitly approves replacement. | User requested native checkout infrastructure but agreed production activation stays parked. | Native Stripe lifecycle exists behind an opt-in mode; WooCommerce remains the production default and rollback. |
| Coronary-blood study year | Register describes the supplied result as a 2025 study. | The primary European Heart Journal publication is dated 2026. | Display 2026 and preserve the exact groups/result without implying causation. |
| Dr. Haddad training | Register contains a Jackson Memorial / Jackson Health timeline marked for confirmation. | Current official professional profile supports St. George's plus Drexel residency and fellowships. | Keep the source-backed current timeline; final owner confirmation remains required before launch signoff. |
| Welcome film | Final film was discussed but is not available. | User asked to build the first-visit popup now with a placeholder. | Accessible first-visit modal is complete; final asset is a configuration-only swap. |

## August 6, 2026 clarification — simplicity and redundancy

The user restated Dr. Haddad's feedback that some site language was useful but other parts became redundant, confusing, or too complex. This later explicit clarification has highest precedence under the source rules above.

The practical message must now follow this hierarchy:

1. **First: use less plastic where practical.**
2. Prioritize heat and the plastic used most often around food and drinks.
3. Ask the visitor to choose one repeatable change, not manage several frameworks at once.
4. Keep the 12-action card, guides, and science as optional depth.

The homepage and Solutions page must not show multiple adjacent action ledgers that repeat the same advice. Future copy should prefer direct verbs over named formulas, abstract hierarchies, or overlapping lists. See `docs/CLARITY_AND_REDUNDANCY_PASS.md`.

## Status key

- **Complete:** source implementation matches the requirement at the code/content boundary.
- **Partial — visual QA:** implementation exists, but browser/device review or clinical-art review is still required.
- **Owner blocked:** needs Dr. Haddad's asset, wording, permission, or approval.
- **Provider blocked:** needs an authorized external account or real transaction.
- **Open build:** not yet implemented or not yet sufficient.

## Executive status

| Workstream | Status | Current truth |
| --- | --- | --- |
| Movement/book brand separation | Complete at core system boundary | Header, footer, guide schema, RSS, legal metadata, contact, community, media, and recommendations use Say No to Plastic; *Homo Plasticus* remains the book/product. Domain migration remains open. |
| Global information architecture | Complete at source level | Explicit Home, Science, Solutions, Guides, The Book, Dr. Haddad, Events & Media, Community, Contact/footer routes. |
| Homepage narrative | Complete at source level; visual QA pending | Core premise and book line, anatomy, exposure routes, actions, book journey, author, media bridge, and community signup are ordered deliberately. TEDx is not on Home. |
| Welcome film | Complete infrastructure; owner blocked asset | First-visit modal, replay, focus/keyboard handling, reduced motion, placeholder, and configuration fields exist. |
| Anatomy narrative | Structurally reconciled; partial visual QA | Six evidence chapters plus Chapter 07 exit-to-action now match the register. Uterus, fetus, placenta, heart, brain, vasculature, ovary, and separate testicular specimen are wired. Exact organ recognizability still needs clinical/visual review and likely a better licensed ovary/follicle asset. |
| Science system | Substantially complete; editorial QA pending | Human finding-first content, direct primary links, cardiovascular studies kept distinct, limitations visible. Final scientific wording review remains. |
| Solutions and Quick Action Card | Complete at source level; final clinical approval pending | Three core rules, 12 actions, web/print card, action planner, water, food heat/storage, packaging/cans, dust, textiles, cosmetics, children, and laundry guidance exist. |
| Book experience | Substantially complete; visual/owner QA pending | Premium homepage read-map, official cover on product page, price/delivery, checkout boundary, FAQ, recovery, technical support, and refund guidance exist. Final ebook/sample material and visual collision QA remain. |
| About Dr. Haddad | Substantially complete; owner confirmation pending | Story, philosophy, Education section, actions, and official-profile links exist. Final portrait set and career wording require approval. |
| Events & Media | Complete infrastructure; owner blocked inventory | Dedicated media center and press kit exist; TEDx centralized there. Final official links, dates, rights, and high-resolution assets remain. |
| Community/newsletter/contact | Source UI complete; provider blocked | Community and categorized “Ask a question” contact experience exist. Live newsletter/contact routing requires account and delivery tests. |
| Affiliate infrastructure | Complete infrastructure; owner blocked catalog | Fail-closed registry, disclosures, redirects, review records, and preflight exist. No products publish without approved records. |
| Native ebook commerce | Complete infrastructure; provider/owner blocked activation | Stripe/D1/R2/Resend lifecycle, access, recovery, refunds, preview, preflight, and Woo fallback exist. Real provider lifecycle and final PDF remain open. |
| SEO, analytics, domain, launch operations | Partial | Metadata, schemas, sitemap, RSS, consent-aware events exist. Final domain, Search Console, live analytics verification, performance, accessibility, and incident/rollback drills remain. |

## Requirement-by-requirement reconciliation

### 1. Brand, product, and conversion

| Requirement | Status | Evidence / remaining work |
| --- | --- | --- |
| Say No to Plastic is the public movement identity. | Complete at source level | Wordmark, navigation, footer, organization schema, guide publisher schema, RSS, contact, community, media, policies, and affiliate copy use the movement brand. |
| *Homo Plasticus* is the book/product identity. | Complete | Book cover, title, product page, checkout content, schema, and access routes preserve the title. |
| Published collaborator credit stays with the book. | Complete in book contexts; owner approval pending | Product copy and cover preserve Dr. Rudolph Eberwein's collaborator credit without making him a movement co-founder. |
| Professional wordmark kit. | Open build / design gate | Current live wordmark is text-based and functional. Horizontal/compact/monochrome export kit, font/license record, and clear-space rules are not yet delivered. |
| Education, ebook conversion, audience growth, later affiliate support are measured separately. | Partial | Event boundaries exist; real analytics-platform verification remains provider blocked. |

### 2. Global information architecture

| Destination | Status | Notes |
| --- | --- | --- |
| Home | Complete | Explicit Home link and logo-home behavior exist. |
| Science | Complete source route | Finding-first evidence system exists; final science/editorial QA remains. |
| Solutions | Complete source route | Short practical action system and Quick Action Card are discoverable. |
| Guides | Complete source route | Searchable 12-guide library remains a distinct, explained destination. |
| The Book | Complete source route | Dedicated product page plus homepage premium journey. |
| Dr. Haddad | Complete source route | Story, philosophy, Education, and CTAs. |
| Events & Media | Complete source route | Named consistently in desktop/mobile navigation; TEDx lives here only. |
| Community | Complete source route | Field notes and movement actions exist. |
| Contact | Complete source route | “Ask a question” with five routing categories and a secondary medical boundary. |

### 3. Homepage

| Requirement | Status | v34 result |
| --- | --- | --- |
| Core premise plus larger book line. | Complete | H1 now contains “Plastic is not just an environmental problem” and “The most dangerous pollutant is the one already inside us.” |
| Physician-led introduction without a wall of caveats. | Complete | Hero uses a short physician-led eyebrow/deck and direct CTAs. |
| Scroll prompt. | Complete | “Enter the body” points to the anatomy story. |
| First-visit welcome film entry. | Complete infrastructure | Automatic modal plus replay button; placeholder remains honest. |
| Working book purchase path. | Complete boundary | All CTAs call `/api/checkout`; production fallback remains WooCommerce. |
| Six exposure routes. | Complete | Air, water, food, heat/food contact, fast fashion, skincare/cosmetics. |
| Three compact core rules. | Complete | No heating plastic, food storage alternatives, routine drinkware change. |
| Ordered lower-page sequence. | Complete | Solutions → book → Dr. Haddad → Events & Media → community/newsletter. |
| TEDx absent from Home. | Complete | No TEDx content or anchor is present in the homepage source. |

### 4. Anatomy story

| Chapter | Status | v34 implementation / remaining visual gate |
| --- | --- | --- |
| 01 Whole body / circulation | Complete source; visual QA | Full maternal body, vasculature, brain, heart, pelvis, fetus, placenta, and particles share the opening frame; blood study leads. |
| 02 Brain | Complete source; visual QA | Recognizable licensed brain layer, camera focus, Nature Medicine source. |
| 03 Heart and arteries | Complete source; visual QA | Heart/coronary scene leads with the coronary-blood groups and also shows the distinct 2024 plaque study/source. |
| 04 Pregnancy and placenta | Structurally complete; clinical-art QA | Pregnancy and placenta are now one chapter. Uterus, fetus, umbilical/placental assembly, pelvis, and maternal torso are shown together. Exact registration must be reviewed on rendered devices. |
| 05 Ovary and follicular fluid | Partial — visual asset | Human 14-of-18 finding leads and the term is explained. The current licensed ovary layer/fallback is not yet strong enough for final clinical-art signoff; add a reviewed ovary plus follicular inset. |
| 06 Testicular tissue | Complete source; visual QA | Separate male atlas, human finding first, methods/limitations secondary. |
| 07 Exit to action | Complete | Explicit Solutions and Science routes end the journey. |
| Scroll/click/keyboard/touch synchronization | Complete source; browser QA | Buttons, scroll progress, active text, and scene progress share one state. |
| Reduced-motion equivalent | Partial — browser QA | Stable content and fallback behavior exist; must be tested with OS reduced motion and without WebGL. |
| Direct primary sources per chapter | Complete | Source lists support more than one source where the narrative requires it. |

### 5. Science

- **Complete in source:** blood, brain, coronary blood, carotid plaque, pregnancy anatomy, placenta, follicular fluid, and testicular tissue records; finding-first headlines; sample/method/limits; direct primary sources.
- **Corrected in v34:** heart/artery evidence is no longer collapsed into one study, and pregnancy/placenta is no longer split into two competing visual stops.
- **Still required:** Dr. Haddad's final wording approval; rendered readability; primary-link spot check; ensure any future health outcome wording remains association-aware.

### 6. Solutions, action card, and guides

- Three core rules and 12 authored actions exist as a readable web page and print/save-to-PDF experience.
- Water filtration, food heating/storage, reusable kitchen materials, single-use/takeout, can/package liners, indoor dust, fast fashion, cosmetics, children, and microfiber capture are represented.
- v34 removes the rejected formula-like “frequency, heat, and food contact” major heading and uses direct language.
- v34 connects the personal-care action directly to the cosmetics guide.
- **Owner/editorial gate:** medical or “detox” language stays conservative until Dr. Haddad approves final phrasing. No supplement or cleanse promise is published.

### 7. Book and ecommerce

- Homepage premium read-map and page-turn experience remain intact.
- The product page now uses the official cover asset rather than the alternate `book.webp` asset.
- Desktop left-cover/right-copy structure, price, format, delivery, checkout, FAQ, recovery, support, and refund guidance exist.
- Reduced-motion summary exists for the premium homepage journey.
- **Owner blocked:** final sale-ready file, exact page/publication/ISBN metadata, preview permission, and any approved excerpt/sample.
- **Provider blocked:** real Stripe test, D1/R2/Resend/DNS setup, live smoke purchase/refund, and monitoring.

### 8. Dr. Haddad

- Hero, narrative arc, philosophy, Education, evidence/community actions, and official profile references exist.
- Current timeline uses publicly supported St. George's/Drexel information rather than silently adopting the conflicting unconfirmed register timeline.
- **Owner blocked:** final biography signoff, current-work wording, portrait selection, reflective/workspace imagery, and any family image permission.

### 9. Events, media, community, and contact

- Events & Media is a named destination and the only home for TEDx-specific content.
- The media content model supports future talks, interviews, podcasts, panels, and appearances without redesign.
- The press kit distinguishes current web assets from pending high-resolution/rights-approved files.
- Community and field-note UI exist but are not described as operationally live before Mailchimp/sender/domain tests.
- Contact now leads with “Ask a question,” includes the required five categories, and moves the medical boundary beneath the form rather than making it the page's dominant message.

### 10. Affiliate, legal, SEO, and operations

- Affiliate catalog is fail-closed, includes review/disclosure fields, uses safe known-destination redirects, and emits consent-aware events.
- Legal metadata and movement-level policy wording use Say No to Plastic; book-specific refund/access language remains tied to *Homo Plasticus*.
- Organization/Person/Book/Article schema, sitemap, RSS, policies, and consent-aware first-party analytics boundaries exist.
- **Open external work:** affiliate agreements/products, Mailchimp or chosen newsletter provider, domain/DNS, Search Console, live analytics verification, support routing, performance profiling, accessibility audit, backups, and incident drills.

## Corrections made during this reconciliation

1. Rebuilt the homepage evidence journey as six anatomical chapters plus a seventh exit-to-action chapter.
2. Combined pregnancy and placenta into one coherent maternal-fetal stage and activated the uterus model layer.
3. Preserved coronary-blood and carotid-plaque studies as distinct evidence within one heart/arteries chapter.
4. Added multiple direct source links where one chapter depends on more than one record.
5. Added the core premise to the hero while retaining the published book line.
6. Added a restrained Events & Media bridge after Dr. Haddad, without reintroducing TEDx on Home.
7. Renamed desktop navigation to Events & Media.
8. Reworked Contact to “Ask a question,” added all required categories, and demoted the medical boundary.
9. Swapped the book product page to the official cover and added recovery, technical-support, and refund FAQs.
10. Corrected movement-level guide schema, RSS, route metadata, policies, community, media, and affiliate language to Say No to Plastic.
11. Replaced the rejected formula-like Solutions heading with direct action language.
12. Connected the personal-care action to the dedicated cosmetics guide.
13. Fixed a latent duplicate-comma syntax error in `app/content/guides.ts` that source-only v33 checks did not catch.
14. Expanded the dependency-free audit to enforce the reconciled structure.

## Remaining work by dependency

### Can be completed without Dr. Haddad

1. Run the full dependency-backed build and rendered route suite in a registry-complete environment.
2. Perform visual QA at 1440×900, 1280×800, 1024×768, 768×1024, 430×932, and 375×667.
3. Replace or improve the ovary/follicular visual with a licensed, clinically recognizable asset and verify the maternal-fetal registration.
4. Complete keyboard, screen-reader, zoom/reflow, reduced-motion, WebGL-failure, and performance QA.
5. Produce the final wordmark kit and document font/licensing rules.
6. Complete a page-by-page copy and spacing pass after rendered screenshots exist.

### Requires Dr. Haddad / owner

- Final ebook and product metadata/permissions.
- Final welcome film, poster, captions, transcript, and publishing permission.
- Official TEDx and other media URLs, dates, thumbnails, and rights.
- Biography, education/current-work, portrait, and press-kit approval.
- Affiliate partners and product candidates.
- Newsletter/support/public email ownership and final policy approvals.

### Requires authorized provider access

- Connected Sites build/deploy environment.
- Stripe, D1, private R2, Resend, DNS, domain, analytics, Search Console, and newsletter configuration.
- Real test and live smoke transactions/deliveries.

## Roadmap ledger after reconciliation

- **Current phase:** render and visually verify the v34 transcript-reconciled build; correct anatomy/book/home/page-level issues found by browser QA.
- **Next phase:** insert approved owner assets and perform non-production provider integration tests.
- **Parking lot:** production Stripe cutover, monitoring, final welcome film, final media inventory, and published affiliate products.
- **Open decisions:** exact wordmark kit, final anatomy asset replacement, final PDF/metadata, provider ownership, tax/refund/territory choices, media rights, affiliate catalog, and launch domain.

**Goal check:** this reconciliation advances the core product, not merely an enabler. It restores the exact science-to-action narrative Dr. Haddad requested and makes remaining blockers explicit instead of allowing them to disappear from the roadmap.

## Next acceptance gate

A v34 preview is accepted only when:

1. source audit, syntax audit, lint, production build, and rendered tests pass;
2. six anatomy chapters and Chapter 07 remain synchronized on desktop, touch, keyboard, reduced motion, and WebGL fallback;
3. no TEDx-specific content appears on Home;
4. the book journey and product page have no overlap/crop/collision at all required viewport sizes;
5. every movement-level surface identifies Say No to Plastic and every product surface preserves *Homo Plasticus*;
6. remaining owner/provider items are still present in `docs/PARKED_OWNER_ACTIONS.md`.

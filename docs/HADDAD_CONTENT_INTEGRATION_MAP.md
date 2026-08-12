# Dr. Haddad content integration map — v40.15

**Base preserved:** `homo_plasticus_v40_14`  
**Working candidate:** `homo_plasticus_v40_15`  
**Production:** unchanged Sites v30  
**Supplied content set:** ten PDFs received 2026-08-08

## Product decision

The ten PDFs were not pasted into one long page and were not duplicated verbatim throughout the site. They were converted into a layered content system:

1. one canonical long-form route per subject;
2. compact discovery modules on Home and Science;
3. anatomy cross-links where the existing six-chapter journey already covers the system;
4. practical cross-links from Solutions and Guides;
5. short theme/briefing reuse on Book, About, Media, Press Kit, and Community;
6. policy and medical-boundary updates;
7. visible source states so supplied narrative is never silently promoted to verified evidence.

## Canonical route register

| Supplied PDF | Canonical route | Source state | Primary implementation |
|---|---|---|---|
| `The heart.pdf` | `/science/body/cardiovascular-system` | verified | Narrative around two existing verified cardiovascular studies |
| `Female reproductive.pdf` | `/science/body/female-reproductive-health` | partial | Follicular-fluid result linked; additional claims gated |
| `Endocrine.pdf` | `/science/body/endocrine-metabolic-system` | source review | Particle/chemical distinction, known/uncertain boundary |
| `Kidneys.pdf` | `/science/body/kidneys-urinary-system` | source review | Filtration narrative; no kidney-treatment or detox claims |
| `Skin.pdf` | `/science/body/skin` | source review | Barrier framing; does not equate skin with ingestion/inhalation |
| `GI system.pdf` | `/science/body/digestive-system` | source review | Ingestion/stool/barrier context with human-outcome boundary |
| `The first 1000 days.pdf` | `/science/body/pregnancy-early-life` | partial | Verified placenta record plus gated early-life claims |
| `Detecting microplastics.pdf` | `/science/how-detection-works` | methods explainer | Four-step primer, method differences, contamination controls |
| `Exposome diagram.pdf` | `/science/exposome` | conceptual framework | Interactive Air/Water/Food/Products/Lifestyle map |
| `Reduce exposure.pdf` | `/solutions/reduce-exposure` | practical guidance | Four priority groups, progress-not-perfection framing |

## Route-by-route implementation

### Home `/`

- Existing design, hero, wordmark, welcome film, and six-chapter anatomy remain intact.
- Anatomy chapters for heart, pregnancy, and ovary now link to their canonical system pages.
- A compact four-card `Explore more systems` library adds Digestive, Kidneys, Endocrine, and Skin without creating another long anatomy scroll.
- The exposure section now includes a condensed interactive Exposome map.
- Exposure cards point to the most relevant guide or system page.

### Science `/science`

- Existing verified study ledger remains authoritative for samples, methods, statistics, limits, and primary paper links.
- A reusable Detection Primer explains how studies measure particles.
- Seven canonical body-system overviews are discoverable as a library.
- An Exposome bridge supplies lifetime context.
- Existing chapter visuals and study records remain unchanged.

### Anatomy journey

- Existing six synchronized visual chapters remain the primary spatial experience.
- Heart, pregnancy, and follicular-fluid chapters include explicit deep links.
- Digestive, kidney, endocrine, and skin content is exposed through the post-journey system library rather than forcing the homepage into a 10+ chapter experience.
- No lungs content was invented because no lungs source PDF was supplied.

### Solutions `/solutions`

- The direct first principle and exact three core rules remain unchanged.
- A new exposure framework previews Food/Drink, Home/Air, Clothing/Personal Care, and One Change at a Time.
- `/solutions/reduce-exposure` provides the full narrative and routes visitors into existing guides and the one-change planner.
- The authored Quick Action Card remains separate and unchanged.

### Guides `/resources` and `/resources/[slug]`

- The guide catalog remains exactly 14 records.
- Each guide can render a `Connected science` section based on guide category.
- Practical guidance remains action-focused; long body-system explanation stays in Science.

### Book `/homo-plasticus`

- Adds a restrained `Questions explored across the project` module.
- Topics are not labeled as literal chapters or a table of contents.

### About `/about-dr-elie-haddad`

- Adds an Exposome bridge that supports the existing environmental-health narrative.
- Does not paste body-system articles into the biography.

### Media and Press Kit

- Adds six evidence-briefing routes for interview preparation.
- Media talking points now include detection, cardiovascular evidence, exposome, particles versus chemicals, pregnancy/early life, and practical action.
- Existing temporary/approval media boundaries remain intact.

### Community `/community`

- Adds a ten-reading Field Notes curriculum mapping the complete supplied content set.
- Adds a Learn → Act → Share pathway.
- Preserves the accepted three-generations visual and signup experience.

### Recommendations

- Adds a visible science-to-product boundary.
- Body-system content cannot be used to imply disease prevention, body detoxification, pregnancy protection, or medical outcome change.

### Editorial and medical policy

- Editorial policy now codifies the claim ladder, evidence type, particle-versus-chemical distinction, contamination control, body-system source states, and product boundary.
- Medical disclaimer now explicitly covers pregnancy/infant feeding, fertility, cardiovascular symptoms, kidney/digestive/endocrine/skin concerns, and practical-action constraints.

### Search, feeds, and machine-readable discovery

- Sitemap includes the four new canonical route families and all seven body-system pages.
- RSS/Field Notes feed includes body systems, detection, exposome, and exposure reduction.
- `public/llms.txt` documents canonical discovery routes and source-review indexing rules.
- Body-system pages marked `source-review` use `noindex,follow` until bibliography review is complete.

## Shared architecture

- `app/content/body-systems.ts` — canonical system narratives and source states.
- `app/content/haddad-topics.ts` — detection, exposome, and exposure-reduction structured content.
- `app/content/science-connections.ts` — guide-to-science routing.
- `app/components/BodySystemLibrary.tsx` — reusable discovery cards.
- `app/components/DetectionPrimer.tsx` — reusable method primer.
- `app/components/ExposomeMap.tsx` — keyboard-operable interactive map.
- `app/science/body/[slug]/page.tsx` — one template for all body-system articles.

## Source preservation

- Exact supplied PDFs: `docs/sources/haddad-content/pdf/`
- Layout-preserving text extracts: `docs/sources/haddad-content/text/`
- Hash and route register: `docs/sources/haddad-content/README.md`
- Original design blueprint: `docs/HADDAD_CONTENT_INTEGRATION_BLUEPRINT.md`
- Independent candidate-source queue: `docs/HADDAD_PRIMARY_SOURCE_REVIEW_QUEUE.md`

## Acceptance gates

### Source-level complete

- all ten PDFs accounted for;
- all planned canonical routes implemented;
- cross-site reuse implemented;
- source states visible;
- source-review pages protected from indexing;
- package lock unchanged;
- existing feature audits preserved;
- new integration audit present.

### Still requires real-browser proof

- desktop/tablet/mobile hierarchy and reading comfort;
- interactive Exposome keyboard/pointer behavior;
- anatomy-to-system link placement;
- long-page table-of-contents behavior;
- source-status visibility;
- no overflow at 200% zoom;
- reduced-motion behavior;
- final Dr. Haddad/medical/editorial wording approval.

### Still requires external source input

- complete bibliography for source-review and partial pages;
- lungs/respiratory source if that system is to be added;
- final production publication decision.

## v40.16 completion overlay

The v40.15 canonical route architecture remains unchanged. v40.16 adds the experience and operations layer that was intentionally left for the completion pass:

- the post-journey four-card library is now also represented as optional anatomy hotspots with a source-status drawer;
- each of the seven canonical system pages receives a conceptual visual;
- the exposure guide receives the device-local worksheet and printable PDF;
- the Community curriculum gains device-local progress, a consent-based ten-part delivery path, and 7/30-day practice plans;
- Media and Press Kit gain six downloadable source-status briefings;
- policy and operations documentation now cover device-local state and scheduled lessons.

The same publication boundaries still apply: source-review pages remain noindex, supplied narrative does not become a verified study, and no lungs route exists without a dedicated source.

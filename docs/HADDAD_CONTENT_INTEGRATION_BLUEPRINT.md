# Say No To Plastic — Dr. Haddad PDF Content Integration Blueprint

**Basis:** current v40.14 site source plus the ten PDFs supplied on 2026-08-08.

## Executive decision

Do **not** paste the ten PDFs into one long page and do **not** repeat the full text across multiple routes. Preserve the substance through a layered content system:

1. **Canonical full article** — one permanent home for the approved long-form text.
2. **Science/anatomy summary** — 80–180 words plus evidence status and a link to the full article.
3. **Homepage teaser** — one sentence or one statistic only.
4. **Action cross-link** — only where the topic supports a practical recommendation.
5. **Media/community excerpt** — a short talking point or learning prompt, never a second full copy.

This allows nearly all approved wording to live on the site without creating walls of text, duplicate claims, or an excessively long homepage.

---

## Recommended information architecture

### 1. Keep the existing verified evidence record

The current `app/content/evidence.ts` should remain the canonical source for verified primary studies, statistics, samples, methods, limitations, and direct paper links.

Do not replace those records with the PDFs. Use the PDFs as **plain-language body-system explainers** that point to the verified study cards.

### 2. Add a body-system explainer layer

Create:

- `app/content/body-systems.ts`
- `app/science/body/[slug]/page.tsx`
- `app/components/BodySystemLibrary.tsx`
- `app/components/BodySystemDrawer.tsx`
- `app/components/DetectionPrimer.tsx`
- `app/components/ExposomeMap.tsx`

Suggested data model:

```ts
export type BodySystemArticle = {
  slug: string;
  title: string;
  subtitle: string;
  shortSummary: string;
  anatomyTargets: string[];
  overview: string[];
  whyItMatters: string[];
  researchFindings: string[];
  whatItMeans: string[];
  keyTakeaways: string[];
  relatedEvidenceIds: string[];
  relatedGuideSlugs: string[];
  sourceRefs: Array<{ label: string; href: string }>;
  status: "draft" | "sources-pending" | "medical-review" | "approved";
  reviewedBy?: string;
  reviewedDate?: string;
};
```

The PDFs can supply the narrative fields. Primary papers must supply `sourceRefs` before publication.

### 3. Use progressive disclosure

- **Desktop:** cards or anatomy hotspots open a right-side drawer.
- **Mobile:** cards open inline accordions or a full article page.
- **Long copy:** always lives on a real page with a URL, headings, sources, and readable scrolling.
- **Popups:** reserve for a short preview only; do not put full articles inside modal windows.
- **Swipe cards:** useful for the body-system index on mobile, not as the only way to access content.

---

## PDF-by-PDF placement map

### A. How to Reduce Your Exposure

**Canonical home:** `/solutions` plus an optional long-form route `/solutions/reduce-exposure`.

**Use on:**

- Home exposure section: one short “progress, not perfection” line.
- Solutions hero: overall philosophy.
- Solutions priority ladder: food/drink, home/air, clothing/personal care.
- Existing Action Planner: convert recommendations into one-action choices.
- Quick Action Card: keep the authored 12-step card unchanged; link to the new long-form explainer rather than replacing the card.
- Existing guides: water, kitchen, dust, clothing, cosmetics, takeout, reusable containers.
- Recommendations: category priority and practical tradeoffs, not medical claims.
- Community: a 7-day or 30-day “change one repeated exposure” challenge.
- Field Notes: a multi-email practical series.

**UI:** priority ladder, checkable action cards, one-action planner, printable summary.

### B. Female Reproductive Health

**Canonical home:** `/science/body/female-reproductive-health`.

**Use on:**

- Home anatomy: enrich the existing ovary/follicular-fluid chapter with a short secondary panel about ovarian reserve, uterus, and the distinction between detection and demonstrated fertility effects.
- Science: add a “Female reproductive system” body-system card; link to the existing verified follicular-fluid study card.
- Pregnancy/family reading path: cross-link, but do not merge all fertility and pregnancy content into one page.
- Community/Field Notes: fertility and environmental health explainer.
- Media/press kit: interview topic.
- Book page: one theme card under human evidence/future generations.
- Medical disclaimer: make reproductive and pregnancy boundaries visible on related articles.

**UI:** anatomy hotspot, “What has been detected / What is not yet known” split panel.

### C. Endocrine & Metabolic System

**Canonical home:** `/science/body/endocrine-metabolic-system`.

**Use on:**

- Science: body-system card and dedicated explainer.
- Anatomy: represent it as a network, not a single organ. A small system map can connect thyroid, pancreas, adrenal glands, ovaries, and testes.
- Solutions: cross-link from personal care, food-contact, and packaging guidance.
- Resources: cross-link to cosmetics/personal-care and food-contact guides.
- Recommendations: inform product-review questions without claiming a product prevents endocrine disease.
- About Dr. Haddad: one supporting sentence in the environmental-health story, not a new long section.
- Media/press kit: “microplastics versus endocrine-disrupting chemicals” topic.
- Editorial policy: explicitly preserve the distinction between particles and plastic-associated chemicals.

**UI:** two-column comparison — “plastic particles” versus “plastic-associated chemicals.”

### D. Kidneys & Urinary System

**Canonical home:** `/science/body/kidneys-urinary-system`.

**Use on:**

- Science body-system library.
- Expanded anatomy atlas: kidney hotspot or “More systems” card.
- Home: teaser only in a compact “Explore more systems” rail; do not add another long homepage scroll chapter.
- Book page: supporting theme under “human evidence.”
- Media/Field Notes: secondary explainer.

**Do not:** create kidney-specific treatment, detox, or filtration claims from this draft.

**UI:** kidney visual with “detected / possible mechanism / human outcome unknown” labels.

### E. Skin

**Canonical home:** `/science/body/skin`.

**Use on:**

- Science body-system library.
- Home exposure section: link from the existing skincare/cosmetics route.
- Solutions/resources: personal-care and synthetic-clothing guides.
- Recommendations: personal-care category criteria.
- Media/Field Notes: myth-busting article explaining that intact skin is not currently considered a major entry route.

**Do not:** present skin as equivalent to inhalation or ingestion.

**UI:** barrier diagram with “intact skin,” “damaged skin,” and “chemicals associated with plastics” as separate concepts.

### F. How Scientists Detect Microplastics

**Canonical home:** `/science/how-detection-works`.

**Use on:**

- Science page: a compact methodology primer before the study chapters.
- Every study card: a “How this was measured” link or accordion.
- Body-system pages: reusable “How scientists know” component.
- Editorial policy: contamination control, method limits, and evolving standards.
- Media/press kit: approved talking points for “How do we know the particles are real?”
- Community/Field Notes: laboratory-method explainer.
- Book page: one theme card under detection/measurement.

**UI:** four-step visual: sample collection → biological material removal → instrument analysis → polymer identification, followed by a contamination-control callout.

### G. Digestive System

**Canonical home:** `/science/body/digestive-system`.

**Use on:**

- Science body-system library.
- Home: “Explore more systems” rail and cross-link from Food/Water exposure cards.
- Solutions: food, water, heat, storage, and packaging links.
- Resources: existing water, food packaging, kitchen, and container guides.
- Recommendations: container and filter evaluation categories.
- Community/Field Notes: gut exposure explainer.
- Book page: exposure route/human evidence theme.

**UI:** pathway diagram from food/water → digestive tract → elimination or possible barrier crossing, with the uncertainty clearly labeled.

### H. The Exposome

**Canonical home:** `/science/exposome` plus a condensed interactive module on Home.

**Use on:**

- Home exposure section: interactive diagram connecting Air, Water, Food, Products, and Lifestyle to lifetime exposure and individual response.
- Science: context page before body-system articles.
- About Dr. Haddad: directly supports the existing “health emerges from thousands of choices” philosophy.
- Book page: “the larger inquiry” theme.
- Community: campaign framing and discussion prompt.
- Media/press kit: a concise explanation of the project’s wider environmental-health lens.

**UI:** interactive branching diagram. Hover/tap reveals examples; the final node links to Science and Solutions.

### I. Pregnancy, Placenta & Early Life / First 1,000 Days

**Canonical home:** `/science/body/pregnancy-early-life`.

**Use on:**

- Home anatomy: expand the existing pregnancy/placenta chapter with a short “first environment” teaser and link.
- Science: retain the verified placenta study card, then add a separate early-life explainer around it.
- Resources: expand the existing pregnancy/placenta guide or create a family-focused companion page.
- Community: a dedicated “For expecting families and caregivers” learning pathway.
- Medical disclaimer: prominent no-blame, established-clinical-guidance-first boundary.
- Media/press kit: high-interest interview topic.
- Book page: future generations / early-life theme.
- Field Notes: a carefully sourced series.

**Important:** cord blood, amniotic fluid, meconium, breast milk, and fetal-tissue claims each need an original source before publication.

**UI:** timeline from pregnancy → birth → early infancy, with each detection claim tied to a source and an explicit “does not prove harm” label.

### J. Cardiovascular System / Heart

**Canonical home:** the current `/science` heart-and-arteries chapter, supported by `/science/body/cardiovascular-system` if a narrative page is desired.

**Use on:**

- Home anatomy: retain the current heart/arteries chapter and two-study structure.
- Science: use the PDF narrative as context around the existing coronary-blood and carotid-plaque study cards; do not duplicate or replace the verified statistics.
- Existing resource guide: expand `/resources/microplastics-carotid-plaque-study` or add a cardiovascular overview that links to it.
- About Dr. Haddad: link the topic to his cardiology background.
- Media/press kit: primary interview topic.
- Book page: flagship human-evidence theme.
- Field Notes: study update series.

**UI:** “two studies, two questions” comparison card — plaque follow-up versus coronary blood during acute heart attack.

---

## Route-by-route integration map

### `/` — Home

Keep the homepage focused. Do not paste the PDFs here.

Add only:

1. A condensed Exposome visual inside the existing exposure section.
2. Shorter supporting copy from the heart, female reproductive, and early-life PDFs inside existing anatomy chapters.
3. A compact “Explore more systems” rail after the six-chapter anatomy journey for Digestive, Kidneys, Endocrine, and Skin.
4. One “progress, not perfection” line from the exposure-reduction document near the Solutions handoff.

### `/science`

Make this the main discovery hub:

1. “How scientists detect microplastics” primer.
2. Existing verified human-study record.
3. New “Explore by body system” library.
4. Exposome context module.
5. Links to full body-system article pages.

### `/science/body/[slug]`

New canonical long-form pages for:

- cardiovascular system
- digestive system
- kidneys and urinary system
- endocrine and metabolic system
- skin
- female reproductive health
- pregnancy and early life

Future-ready for lungs, liver, male reproductive health, and other systems when source material is supplied.

### `/science/how-detection-works`

Full detection-method explainer.

### `/science/exposome`

Full exposome explanation and interactive diagram.

### `/solutions`

Use the exposure-reduction PDF as the narrative backbone, but preserve the existing three core rules first. Organize the rest into:

- Food and drink
- Home and indoor air
- Clothing and personal care
- Choose one change now

### `/quick-action-card`

Do not overwrite the authored card. Add a single link: “Read the fuller exposure-reduction guide.”

### `/resources`

Keep Resources action-focused. Add cross-links from guide cards to relevant body-system pages. Do not force every organ explainer into the action-guide template.

Potential new action guide:

- `/resources/reduce-exposure-priority-guide`

Expand existing guides instead of duplicating them:

- pregnancy/placenta
- carotid plaque
- personal care/cosmetics
- water
- food packaging
- kitchen
- indoor dust
- clothing

### `/homo-plasticus`

Add a short “Questions explored in the book” carousel using the major themes. Do not paste full articles or imply the PDFs are exact book chapters unless Dr. Haddad confirms that.

### `/about-dr-elie-haddad`

Use the exposome concept to strengthen the transition from cardiology to environmental health. Link to cardiovascular, endocrine, fertility, and early-life pages. Avoid adding long organ summaries.

### `/media`

Add topic cards and approved one-paragraph briefing summaries. The strongest topics are:

- heart and arteries
- pregnancy and early life
- female reproductive health
- detection methods
- endocrine-disrupting chemicals versus plastic particles
- practical exposure reduction

### `/media/press-kit`

Add downloadable one-page topic briefs once sourced and approved. Include “what the evidence shows / what it does not show” for each topic.

### `/community`

Create learning tracks:

- Understand the science
- Reduce one repeated exposure
- Protect early life without blame
- Share one credible fact

Use the PDFs as weekly Field Notes topics and discussion prompts.

### `/recommendations`

Use the exposure-reduction hierarchy to decide which product categories matter. Do not use body-system content as a product efficacy claim.

### `/contact`

Add inquiry categories: science/source question, pregnancy/family, media, speaking, partnership, ebook support.

### `/editorial-policy`

Add short sections on:

- detection versus health effect
- particle evidence versus chemical/additive evidence
- contamination control and method evolution
- source requirements for body-system explainers

### `/medical-disclaimer`

Add contextual links/boundaries for pregnancy, fertility, children, endocrine conditions, kidney disease, and cardiovascular disease. Keep the language general and non-diagnostic.

### Privacy, Terms, Refunds, Accessibility, Purchase pages

Do not paste scientific content into these pages. Add only normal cross-links where necessary.

### Footer and welcome modal

No substantive PDF copy. Use a single sentence and route people to Science, Solutions, or Guides. The welcome modal should remain focused and one-viewport.

### Field Notes, RSS, sitemap, SEO

Every approved body-system page should receive:

- title and meta description
- Article schema
- review date
- source list
- related-study links
- related-action links
- RSS entry when published
- sitemap entry
- internal links from at least two other routes

---

## Publication and scientific-review gates

The supplied PDFs are strong narrative drafts, but most do not include full bibliographies. Before publishing exact study claims, dates, prevalence numbers, or tissue-detection statements:

1. Attach the original paper or official source to each claim.
2. Record study type, sample, method, and limitations.
3. Separate human evidence from animal, cell, and laboratory evidence.
4. Distinguish particle detection from demonstrated health effects.
5. Distinguish microplastics from BPA, phthalates, and other plastic-associated chemicals.
6. Give Dr. Haddad a final wording approval screen.
7. Record reviewed date and reviewer.

The current site already follows this pattern for blood, brain, heart/arteries, placenta, follicular fluid, and testicular tissue. Preserve that standard.

---

## Recommended implementation order

### Phase 1 — Content normalization and sourcing

- Convert all ten PDFs into structured content records.
- Remove accidental duplication while preserving approved wording.
- Add primary sources and evidence status.
- Mark unsupported claims `sources-pending` and keep them unpublished.

### Phase 2 — Science system

- Build the body-system library and dynamic body-system pages.
- Add detection and exposome pages.
- Link new pages to existing evidence cards.

### Phase 3 — Homepage and anatomy

- Enrich existing heart, ovary, and pregnancy chapters.
- Add “Explore more systems” cards rather than lengthening the main scroll.
- Add Exposome visual to the exposure section.

### Phase 4 — Solutions and guides

- Integrate the exposure-reduction narrative.
- Add the priority guide.
- Cross-link action guides to body-system context.

### Phase 5 — Book, About, Media, Community

- Add theme cards, topic briefs, learning tracks, and Field Notes series.

### Phase 6 — QA

- Medical/editorial review.
- Source-link verification.
- Desktop/mobile/reduced-motion review.
- Accessibility and keyboard testing.
- Duplicate-content and internal-link audit.
- Search metadata and structured-data validation.

---

## Final recommendation

Treat the PDFs as a **content library**, not as one block of website copy. The site should preserve the full approved substance on dedicated science pages, then reuse concise, purpose-built excerpts across Home, anatomy, Solutions, Guides, Book, About, Media, Community, and policy pages. This satisfies the request to include the material while protecting readability, scientific accuracy, navigation, and conversion.

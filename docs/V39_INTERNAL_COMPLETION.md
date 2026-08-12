# v39 internal completion pass — HISTORICAL

**Status:** Historical v39 record. Superseded for current counts/acceptance by v39.1 `docs/DEFINITIVE_COMPLETION_MATRIX.csv`.  
**Date:** 2026-08-06  
**Purpose:** Close every development-controlled source gap identified by the definitive 150-requirement transcript audit without pretending that rendered, clinical, owner, or provider acceptance has occurred.

## What changed

### 1. Exposure-route visuals

The six homepage exposure routes now use one coherent editorial SVG system rather than text-only cards:

- air;
- water;
- food;
- heat / food contact;
- fast fashion / textiles;
- skincare / personal care.

Implementation: `app/components/ExposureRouteVisual.tsx` plus page/CSS integration. These are intentionally restrained editorial symbols, not stock photography or claims about dose.

### 2. Science and Resources redundancy

- Removed the standalone Science “editorial standard” sermon from the primary reading flow.
- Retained concise study-specific limitations after findings.
- Kept the purposeful public-health source context on Science.
- Removed the duplicated institutional-source list from Resources.

This preserves the transcript exception that scientific findings may repeat on Science while removing source/meta repetition that does not add a new reader purpose.

### 3. Solutions hierarchy

- The planner now offers only the same three core-rule applications rather than a separate six-option system.
- Its copy explicitly tells the visitor to choose one of the three core rules for the week.
- Personal-care guidance now gives a concrete label/product decision without relying on vague “clean” marketing.
- Repeated anti-panic/perfection framing was removed from primary action/community/media/book paths.

### 4. Book-page purpose pass

The duplicate premise/audience blocks were merged into one `Why this book` section. The standalone collaborator treatment remains removed; collaborator credit stays where the published book is credited. The remaining page roles are distinct:

1. product/price/delivery CTA;
2. why the book exists + audience;
3. inside-the-inquiry reading map;
4. purchase FAQ;
5. final conversion.

Rendered review still decides whether the page feels repetitive in practice.

### 5. Community/field-notes trim

Community, footer, and media-topic copy now state their utility directly instead of repeating evidence-honesty/anti-fear promises.

### 6. Wordmark and typography candidate

Added a reviewable movement-identity candidate:

- `public/brand/sntp-wordmark-horizontal.svg`
- `public/brand/sntp-wordmark-compact.svg`
- `public/brand/sntp-wordmark-monochrome.svg`
- `docs/BRAND_WORDMARK_CANDIDATE.md`

The live header uses selectable HTML text with the same SN/slash motif. CSS now exposes a display/sans typography stack compatible with the earlier Inter + Cormorant/DM Serif direction while retaining system fallbacks and avoiding a new third-party font fetch.

This is **not final identity approval**. Dr. Haddad/owner still chooses or approves the signature typeface and final lockup/licensing direction.

### 7. Nontechnical content intake

Added:

- `docs/CONTENT_OPERATIONS.md`
- `docs/content-templates/guide-intake.json`
- `docs/content-templates/evidence-study-intake.json`
- `docs/content-templates/media-intake.json`
- `docs/content-templates/affiliate-product-intake.json`
- `scripts/content-intake-audit.mjs`
- `npm run content:preflight`

The workflow intentionally separates **intake** from **publication**. A nontechnical owner can fill a stable template without editing application code; scientific/media/affiliate records still pass review and build gates before they can become public.

## Definitive audit movement

Starting v38.1 audit state:

- 92 done/proven
- 35 our work remained
- 23 owner/provider blocked
- 11 known internal source implementation/polish items

After v39 source completion:

- **97 done/proven**
- **28 implemented but still require rendered/browser/interaction/performance/workflow proof**
- **25 owner/provider/source blocked**
- **0 known internal source implementation/polish items remain unbuilt**

Two items moved from the development queue to owner approval rather than being falsely marked complete: the final wordmark and final typography system. v39 provides candidates; final identity is an owner decision.

## Important source gap

The Master Delivery Register says Dr. Haddad’s Chapter 3 Parts I/II biography files are the About-page primary source. Those files are not present in the preserved v38/v39 source set. The About page must not receive final provenance/tone signoff until those files are recovered.

## Proof still required

The remaining development-controlled work is **testing/acceptance**, not hidden implementation:

- authentic Sites install/lint/build/rendered tests;
- viewport review at 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 375×667, and 320px width;
- 200% zoom, keyboard, reduced-motion, no-WebGL and failure-state review;
- anatomy recognizability and clinical-art review;
- book/anatomy interaction and collision review;
- bundle/LCP/CLS/slow-mobile profiling;
- one nontechnical-owner content-intake usability test.

## Production boundary

Nothing in v39 authorizes a production deploy, D1 production migration, native-commerce activation, provider credential insertion, or publication of owner-pending media/affiliate records. The public v30 deployment remains outside this package and must remain unchanged until explicit approval.

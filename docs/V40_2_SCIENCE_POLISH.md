# v40.2 — Science rendered-feedback polish

## Why this pass exists

v40.2 implements the user's direct local review of `/science` from 2026-08-07. It is intentionally surgical: the user said the Science page is broadly liked and asked for four specific corrections rather than a redesign.

## Implemented corrections

1. **Removed “How to read this page.”**
   - Deleted the hero helper block entirely.
   - Removed its unused layout/CSS rules.
   - Kept the finding-first headline, study counts and primary-source promise unchanged.

2. **Added the supplied full-body science visual as a subtle hero background.**
   - Runtime derivative: `public/images/science/science-body-overview.webp`.
   - Derived only by cropping the white screenshot frame from the user-supplied image; no generative replacement is used in the website.
   - The image is decorative (`alt=""`, `aria-hidden`) and sits behind live headline/copy with a dark readability blend.

3. **Separated the supplied organ/system collage into individual visual assets.**
   - `blood.webp`
   - `brain.webp`
   - `heart.webp`
   - `placenta.webp`
   - `ovary.webp`
   - `testicular-tissue.webp`
   - These are crops of the user's supplied collage, with the embedded caption region excluded so the website keeps labels/copy as accessible live text.
   - The collage itself is review provenance only and is never rendered as one combined image.
   - Each visual is placed with the matching evidence chapter; Heart & arteries shares the single heart visual while preserving its two distinct study records.

4. **Subdued the Science-page Earth footer image.**
   - The global approved Earth asset is retained.
   - Only on `/science`, the image is darkened/desaturated and strongly reduced in opacity so the quote remains the primary visual element.
   - No global footer redesign was introduced.

## Protected requirements

The correction does **not** change the evidence records or scientific claims. Regression checks preserve:

- Brain human-tissue evidence and source.
- 2026 European Heart Journal coronary-blood record.
- Separate 2024 NEJM carotid-plaque record and 4.53× association.
- Human follicular-fluid 14/18 and 2,191 particles/mL figures.
- Human testicular-tissue 23/23 and 328.44 µg/g figures.
- Placenta 4/6 and 12-particle finding.
- Blood 17/22 finding.
- Direct original-paper links.

## Review boundary

This source pass is not a claim of pixel-perfect rendered approval. The next local browser review should verify:

- Hero body visual is subtle enough at 1440/1280/1024/mobile and never competes with the H1.
- Each chapter visual looks intentionally placed and not oversized.
- Heart image does not imply the two cardiovascular studies are the same study.
- Footer Earth image is now atmospheric rather than distracting.
- All supplied visuals remain legible and appropriately cropped on mobile.

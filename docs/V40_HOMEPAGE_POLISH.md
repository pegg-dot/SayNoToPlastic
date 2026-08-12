# v40 Homepage Polish — user-reviewed correction batch

Date: 2026-08-07
Status: source implementation complete; post-fix rendered signoff still required.
Production boundary: published v30 is unchanged. This package is not deployed.

## Authority for this batch

This correction batch is driven by the user's direct local review of v39.1 at `localhost:5173`, while preserving the raw Dr. Haddad transcript, Master Delivery Register, design blueprints, and scientific-source boundaries already encoded in v39.1.

The local review screenshots are preserved under `docs/reviews/v40-homepage/` so the defect evidence travels with the project.

## Defects observed and exact corrections

| Review evidence | Observed problem | v40 correction | Protected requirement |
|---|---|---|---|
| `review-1.png` | Header wordmark looked awkward/stacked; slash treatment read as accidental. | Replaced the stacked slash lockup with a calm horizontal `Say No` + `To Plastic` treatment. Final brand/typeface approval remains an owner gate. | Movement identity and professional, non-groovy gold wordmark direction remain intact. |
| `review-1.png` | Hero felt too wordy; “Plastic is not just an environmental problem.” was unnecessary on the first screen. | Removed that setup line from the hero, reduced the eyebrow, reduced the deck to one sentence, and removed the hero byline. The core book line remains the H1. | The project-level premise remains represented elsewhere; the exact book line remains unchanged. |
| `review-1.png` | Mother/fetus artwork read as a cut-off rectangle rather than part of the background. | Hero art now fills its vertical stage with `object-fit: cover`, uses a right-edge mask/gradient, and shares the page’s black field so the image dissolves into the background. | Mother/fetus/placenta remain the approved hero subject; UI remains live text. |
| `review-2.png`, `review-3.png` | “Pregnant female body · full anatomical map,” long model notes, and “REGISTERED 3D REFERENCE ASSEMBLY” created a jumbled technical overlay. | Removed model label/note rendering from the sticky anatomy visual. Replaced it with a small chapter number + chapter name locator. Removed the rejected first-chapter phrase from evidence data. | Chapter navigation, evidence copy, organ structure, sources, and accessibility remain intact. |
| `review-4.png` | Heart chapter contained too much visible text. | Shortened only the homepage presentation: shorter title, concise exact group comparison, concise meaning/causality line, and concise separate carotid-plaque companion text. Full study data remains unchanged in the Science evidence ledger and expandable context. | 2026 coronary-blood and 2024 carotid-plaque studies remain distinct; exact counts, association boundary, primary sources, and dates remain protected. |
| `review-5.png` | “Food” plus “Heat and food contact” felt duplicative. | Route 03 is now `Food storage`; route 04 is `Heat`. The six exposure concepts remain present. | Food/storage and heat remain separate exposure concepts; fast fashion and skincare/cosmetics remain included. |
| `review-6.png` | Practical-action bridge felt misaligned; CTA sat too close to copy; right side repeated left-side rules. | Rebalanced columns, aligned top spacing, reduced right headline scale, added explicit CTA breathing room, and reduced the right body copy to `Pick one routine to change first.` The canonical three rules remain visible on the left. | “First: use less plastic” and the exact three Quick Action Card core rules remain unchanged. |

## Regression protections added

`npm run homepage:polish` verifies the specific v40 corrections and also asserts that visual simplification did not weaken the protected science/action requirements.

`npm run local:preflight` verifies the cross-platform local workflow added after the macOS failures observed during this same review session.

The existing `clarity:audit` was tightened semantically: it now proves that Home renders `coreRules` from the canonical action source and that all three exact authored rules remain in that source, rather than requiring redundant duplicate prose in the right-hand column.

## Scientific integrity boundary

The homepage heart copy was shortened for reading density only. The underlying evidence records remain:

- European Heart Journal coronary-blood study: 2026, 16/19 acute-heart-attack group, distinct comparison groups, association-not-causation boundary.
- New England Journal of Medicine carotid-plaque study: 2024, 4.53× adjusted combined-risk result, observational/association boundary.

No primary study URL, DOI, year, sample field, method field, or full Science-page finding was removed to make Home shorter.

## Post-fix rendered acceptance gate

Do not mark this batch visually complete until the new v40 candidate is rendered and checked at minimum at:

- 1440×900
- 1280×800
- 1024×768
- 768×1024
- 430×932
- 390×844
- 375×667
- 320px width
- 200% browser zoom

For the six defect areas above, confirm:

1. Wordmark reads intentionally at normal header size and does not crowd navigation.
2. Hero art has no obvious rectangular edge and no key mother/fetus/placenta subject is lost.
3. Hero first screen is materially less text-dense.
4. Anatomy locator never collides with the rendered model, progress rail, or organ navigation.
5. Heart chapter is readable without feeling like an abstract, while both studies remain discoverable.
6. Exposure labels read as distinct concepts.
7. Practical-action columns align cleanly and the CTA has visible breathing room.

Any failed acceptance item becomes a tracked v40.x/v41 correction. Do not publish based on source audits alone.

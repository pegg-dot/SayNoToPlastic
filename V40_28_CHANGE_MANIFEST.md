# v40.28 Change Manifest — Testicular Tissue Final Chapter

Base: v40.27 final pre-deploy polish.

## Requested change
The homepage anatomy journey now ends with **Testicular tissue** as chapter **10**, the final scroll step.

## Implementation
- Reordered the shared `homepageJourney` registry so testicular tissue follows Digestive system.
- Reordered the ten synchronized 3D camera/layer scenes to match the visible chapter order.
- Shifted Endocrine, Kidneys, Skin, and Digestive to chapters 06–09.
- Moved the testicular 3D focus and fade transition to scene index 9 (chapter 10).
- Reordered particle centers/spreads and fallback imagery to remain synchronized.
- Moved testicular fallback styling to scene 10.
- Preserved the complete-body atlas boundary: the male testicular specimen remains a separate reference and is not falsely composited into the female atlas.
- Added a dedicated v40.28 anatomy-order audit.

No dependencies, commerce configuration, deployment settings, or `package-lock.json` were changed.

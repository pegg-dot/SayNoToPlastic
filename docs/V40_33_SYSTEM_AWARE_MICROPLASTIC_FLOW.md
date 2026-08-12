# v40.33 — System-Aware Microplastic Flow

## Design intent
The microplastics should read as part of the anatomy story rather than as a generic particle cloud. The active system therefore controls a spline-based particle pathway while a much quieter ambient field preserves depth and material diversity.

## Path behavior
1. Whole body / circulation — looped upper and systemic circulation cues.
2. Brain — local tissue-context loops around the brain reference.
3. Heart and arteries — looped motion around the heart and nearby arterial context.
4. Pregnancy and placenta — bounded local motion around the maternal-fetal reference.
5. Ovary and developing eggs — local loops around left/right ovarian context.
6. Endocrine and metabolic — local tissue-context loops rather than a false conduit.
7. Kidneys and urinary system — two directional kidney → ureter → bladder anatomy paths.
8. Skin and exterior surface — a closed path following the exterior silhouette.
9. Digestive system — a sequential descending GI/lumen path plus an outer intestinal path.
10. Testicular tissue — local tissue-context loops; remains the final chapter.

## Scientific boundary
The paths are visualization cues aligned to the displayed anatomy. They do not claim that individual microplastic particles have been observed following those exact trajectories in people. The urinary path in particular is not presented as proof of particle clearance into urine, and the skin path does not imply penetration through intact skin.

## Rendering architecture
- Existing v40.32 mixed-color microplastic renderer is preserved.
- Seven particle families remain active: shard, flake, chip, fiber, bead, film, grain.
- System-aware layers use `THREE.CatmullRomCurve3` paths and staggered per-instance phases/speeds.
- Fibers orient to path tangents.
- Path materials use unlit `MeshBasicMaterial`, per-instance color, transparency, and `toneMapped={false}` so color survives the anatomy lighting pipeline.
- The random ambient field is intentionally subdued; coherent paths are the dominant motion layer.
- Reduced-motion/WebGL fallback behavior remains unchanged.

## Complete-atlas handoff
The former full-screen promotional body graphic is removed. The handoff is now a compact section containing a short explanation, **Open anatomy atlas**, and **Explore the science**.

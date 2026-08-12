# v40.29 — Visible microplastics in the anatomy journey

This patch is applied directly on top of v40.28.

## Changes
- The ten-chapter homepage anatomy scrollytelling now renders a visible microplastic layer in every chapter.
- Particle shapes now include irregular fragments, thin fibers, and rounded bead-like particles.
- Particle density, opacity, spread, and drift are tuned by chapter so particles stay near the relevant anatomy rather than appearing as generic background decoration.
- Whole-body/circulation uses a wider field; brain, ovary, kidney, digestive, and testicular chapters use tighter organ-centered fields; skin uses a shallow exterior-oriented field.
- The reduced-motion / non-WebGL fallback now shows the same three particle families with greater visibility.
- Testicular tissue remains chapter 10 / the final anatomy step.

## Verification completed
- `node scripts/syntax-audit.mjs`: 124 TypeScript/TSX files, 0 parser diagnostics.
- `node scripts/v40-28-testicular-final-audit.mjs`: 11 passed, 0 failed.

## Browser acceptance still required
A final visual check in the user's local browser is still required to judge particle size/visibility at the actual rendered camera positions. No deployment has occurred.

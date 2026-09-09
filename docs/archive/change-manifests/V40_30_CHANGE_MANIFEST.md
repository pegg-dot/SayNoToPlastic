# v40.30 Change Manifest — Microplastic Diversity

This patch is applied directly on top of the v40.28/v40.29 anatomy work. It changes the live anatomy particle renderer, not a standalone illustration.

## Changes
- Replaced the three mostly uniform particle families with seven distinct 3D families: shards, flakes, chips, fibers, beads, films, and grains.
- Added weighted color palettes based on the supplied microplastic reference photos: clear/white dominates, with blue, orange, yellow, green, pink, purple, dark, and tan pieces mixed throughout.
- Increased size/aspect-ratio variation so particles no longer read as copies of one object.
- Removed the old amber emissive tint that visually flattened per-instance colors.
- Preserved scene-specific particle fields for all ten anatomy chapters.
- Expanded the non-WebGL/reduced-motion fallback to the same seven visual families.
- Preserved testicular tissue as chapter 10.

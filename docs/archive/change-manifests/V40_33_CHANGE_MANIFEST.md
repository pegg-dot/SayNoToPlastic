# v40.33 Change Manifest — System-Aware Microplastic Flow

## Scope
This release is built directly on v40.32. It changes only the homepage anatomy journey handoff and microplastic animation behavior. No production deployment, commerce mode, dependencies, secrets, or lockfile were changed.

## Changes
- Replaced the full-viewport complete-atlas promotional section with a compact horizontal handoff.
- Removed the redundant body silhouette and orbit labels from that handoff.
- Kept the full movable 3D atlas available through **Open anatomy atlas**.
- Added path-aware microplastic motion to all ten anatomy chapters.
- Added dedicated anatomical spline paths for circulation, brain context, heart/arteries, pregnancy/placenta, ovaries, endocrine context, urinary anatomy, skin surface, digestive anatomy, and testicular tissue.
- Urinary particles move from kidney regions down the ureter paths toward the bladder reference.
- Digestive particles move sequentially through an illustrative GI/lumen path.
- Skin particles move along the exterior body surface rather than floating only in the surrounding volume.
- Circulatory and heart particles follow looped vessel-context paths.
- Local tissue chapters use bounded loops/orbits rather than implying a known conduit.
- Path particles retain the full seven-family microplastic mix: shards, flakes, chips, fibers, beads, films, and grains.
- Reduced the opacity of the old random ambient field so system-aware motion is visually dominant.
- Added a small scientific boundary: path motion is an educational spatial cue, not a measured particle trajectory.
- Testicular tissue remains chapter 10 and the final anatomy step.

## Files materially changed
- `app/components/AnatomyScene.tsx`
- `app/components/BodyJourney.tsx`
- `app/globals.css`
- `app/build-version.ts`
- `package.json`
- `scripts/source-audit.mjs`
- `scripts/haddad-content-integration-audit.mjs`
- `scripts/v40-33-system-aware-microplastic-flow-audit.mjs`

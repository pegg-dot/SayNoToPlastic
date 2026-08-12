# v40.32 change manifest — microplastic renderer repair

- Removed the erroneous `vertexColors` flag from the instanced microplastic material. The particle geometries do not contain per-vertex colors; enabling the flag caused the instance tints to be multiplied by a missing black vertex-color attribute, producing the black silhouettes seen in browser QA.
- Initializes `InstancedMesh.instanceColor` in `useLayoutEffect` before shader compilation and marks the material for recompilation once instance colors exist.
- Keeps the seven live particle families (shard, flake, chip, fiber, bead, film, grain) and their mixed clear/blue/orange/yellow/green/pink/purple/tan palettes.
- Reduced particle dimensions so the anatomy reads as microplastic-scale debris rather than oversized confetti while preserving visible shape differences.
- No dependencies or lockfile changes.

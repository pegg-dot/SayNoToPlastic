# v40.31 change manifest — microplastic color rendering fix

- Replaced the anatomy microplastic `MeshStandardMaterial` with an unlit `MeshBasicMaterial` so instance colors are not washed out by the anatomy scene lights.
- Disabled tone mapping for the microplastic layer so saturated blue, orange, yellow, green, pink, purple, clear/white, dark, and tan pieces remain visibly distinct.
- Increased size/aspect-ratio diversity across shards, flakes, chips, films, beads, grains, and fibers.
- Changed fibers to curved torus-segment geometry so they no longer read like the same polygonal fragment family.
- Reduced neutral-color bias so clear/white particles remain common without dominating every scene.
- Updated fallback rendering to preserve the same saturated mixed-debris palette.
- Testicular tissue remains anatomy chapter 10.

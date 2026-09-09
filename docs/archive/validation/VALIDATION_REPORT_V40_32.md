# v40.32 validation report

This release repairs the browser rendering defect observed in v40.31 where live WebGL microplastics appeared as black silhouettes.

Primary acceptance conditions:
- no `vertexColors` flag on the microplastic `MeshBasicMaterial`;
- instance colors initialized before shader compilation;
- material marked for recompilation after `instanceColor` creation;
- seven geometry families and multicolor palettes retained;
- particle size ranges reduced;
- anatomy chapter order unchanged, with testicular tissue last.

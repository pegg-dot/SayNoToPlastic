import fs from "node:fs";
import crypto from "node:crypto";

let passed = 0;
let failed = 0;
function expect(condition, message) {
  if (condition) { console.log(`[PASS] ${message}`); passed += 1; }
  else { console.error(`[FAIL] ${message}`); failed += 1; }
}
const read = (file) => fs.readFileSync(file, "utf8");
const scene = read("app/components/AnatomyScene.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");

expect(build.includes("v40.30-microplastic-diversity"), "Build identifier records the microplastic-diversity patch.");
expect(scene.includes('type ParticleShape = "shard" | "flake" | "chip" | "fiber" | "bead" | "film" | "grain"'), "Seven visibly distinct microplastic shape families are registered.");
for (const shape of ["shard", "flake", "chip", "fiber", "bead", "film", "grain"]) {
  expect(scene.includes(`shape: "${shape}"`), `3D particle population includes ${shape}.`);
}
expect(scene.includes("#f48a36") && scene.includes("#64b764") && scene.includes("#e97aa8") && scene.includes("#8f6ad1") && scene.includes("#2e91d0"), "Particle palettes include orange, green, pink, purple, and blue reference colors.");
expect(scene.includes('emissive="#ffffff"') && scene.includes("emissiveIntensity={0.055}"), "Neutral low emissive lighting preserves per-particle colors instead of tinting everything amber.");
expect(!scene.includes('emissive="#8c5334"'), "Legacy amber emissive tint is removed from the microplastic layer.");
expect(scene.includes('count: 30') && scene.includes('count: 26') && scene.includes('count: 24'), "Particle populations use varied counts and densities rather than one repeated cloud.");
expect(scene.includes('Array.from({ length: 64 }'), "Fallback anatomy uses a denser mixed particle population.");
for (const kind of ["fiber", "film", "bead", "grain", "flake", "chip", "shard"]) {
  expect(css.includes(`data-kind="${kind}"`), `Fallback particle styling includes ${kind}.`);
}
expect(scene.includes('layers: layerState({ body: 0.05, testes: 1, particles: 0.24 })'), "Final testicular chapter retains visible particles.");
expect(scene.includes('layers: layerState({ body: 0.08, pregnantBody: 0.08') && scene.includes('brain: 1') && scene.includes('particles: 0.22'), "Brain chapter retains a visible particle field.");
expect(scene.includes('ovary: 1, reproductive: 0.48, particles: 0.26'), "Ovary chapter retains a visible particle field.");
expect(scene.includes('kidneys: 1, digestive: 0.03, particles: 0.24'), "Kidney chapter retains a visible particle field.");

const lockHash = crypto.createHash("sha256").update(fs.readFileSync("package-lock.json")).digest("hex");
expect(lockHash === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
process.exit(failed ? 1 : 0);

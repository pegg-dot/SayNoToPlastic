#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";

let passed = 0;
let failed = 0;
const expect = (condition, message) => {
  if (condition) { console.log(`[PASS] ${message}`); passed += 1; }
  else { console.error(`[FAIL] ${message}`); failed += 1; }
};
const read = (file) => fs.readFileSync(file, "utf8");

const scene = read("app/components/AnatomyScene.tsx");
const journey = read("app/components/BodyJourney.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");
const packageJson = JSON.parse(read("package.json"));

expect(build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate"), "Build preserves the v40.33 system-aware microplastic-flow contract or advances to v40.34.");
expect(scene.includes("MICROPLASTIC_FLOW_DEFINITIONS"), "System-aware particle pathway registry exists.");
for (const label of [
  "circulation",
  "brain tissue",
  "heart and arteries",
  "placenta and pregnancy anatomy",
  "ovary and follicular-fluid context",
  "endocrine tissue context",
  "kidney to ureter to bladder anatomy",
  "skin surface",
  "digestive lumen anatomy",
  "testicular tissue context",
]) expect(scene.includes(`label: "${label}"`), `Pathway registry includes ${label}.`);

expect(scene.includes("SystemAwareMicroplasticFlow"), "Dedicated path-following particle layer is rendered.");
for (const shape of ["shard", "flake", "chip", "fiber", "bead", "film", "grain"]) {
  expect(scene.includes(`shape="${shape}"`), `Path-following particles include ${shape} geometry.`);
}
expect(scene.includes("curve.getPointAt(t, position)") && scene.includes("curve.getTangentAt(t, tangent)"), "Particles travel continuously along anatomical spline paths.");
expect(scene.includes("definition.speed") && scene.includes("speedVariance"), "Path particles use sequential motion with staggered speeds.");
expect(scene.includes("setFromUnitVectors(up, tangent)"), "Fibers orient along the active anatomical path.");
expect(scene.includes("kidney to ureter to bladder anatomy") && scene.includes("[-0.38, 0.62, 0.24]") && scene.includes("[-0.05, -0.25, 0.22]"), "Urinary chapter includes kidney-to-bladder directional paths.");
expect(scene.includes("digestive lumen anatomy") && scene.includes("[0.02, 1.14, 0.24]") && scene.includes("[0, -0.47, 0.23]"), "Digestive chapter includes a descending GI path.");
expect(scene.includes("skin surface") && scene.includes("[-0.42, 2.54, 0.28]") && scene.includes("[0.42, -2.16, 0.28]"), "Skin chapter includes a surface-following body-outline path.");
expect(scene.includes("<MicroplasticField progress={progress} />") && scene.includes("<SystemAwareMicroplasticFlow progress={progress} />"), "Ambient diversity remains while coherent path motion is layered on top.");
expect(scene.includes("Math.min(0.38") && scene.includes("0.24, 0.42"), "Ambient random particles are deliberately subdued so anatomical path motion is dominant.");
expect(scene.includes("toneMapped={false}"), "Path particle colors remain outside anatomy tone mapping.");
expect(scene.includes("setColorAt(index, color.set(point.tint))"), "Path particles retain mixed instance colors.");
expect(scene.includes('layers: layerState({ body: 0.05, testes: 1, particles: 0.24 })'), "Testicular tissue remains the final particle-enabled chapter.");

expect(journey.includes('className="journey-complete-atlas-compact"'), "Complete-atlas handoff uses the compact layout.");
expect(!journey.includes('className="journey-complete-atlas-visual"'), "Oversized body graphic is removed from the atlas handoff.");
expect(journey.includes("Explore the complete anatomy atlas."), "Compact handoff has a direct anatomy-atlas heading.");
expect(journey.includes("Open anatomy atlas"), "Compact handoff retains the interactive atlas action.");
expect(journey.includes("not a measured transport trajectory"), "Particle motion is explicitly bounded as illustrative rather than measured transport.");
expect(css.includes(".journey-complete-atlas-compact{"), "Compact atlas styling is present.");
expect(css.includes("min-height:0") && css.includes("padding:clamp(68px,7vw,104px)"), "Atlas handoff no longer consumes a full viewport.");
expect(css.includes(".anatomy-motion-note{"), "Anatomy stage contains the small motion-boundary note.");

const lockHash = crypto.createHash("sha256").update(fs.readFileSync("package-lock.json")).digest("hex");
expect(lockHash === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(packageJson.scripts?.["anatomy:flow"] === "node scripts/v40-33-system-aware-microplastic-flow-audit.mjs", "Dedicated v40.33 audit is registered.");

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
process.exit(failed ? 1 : 0);

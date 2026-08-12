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
const css = read("app/globals.css");
const build = read("app/build-version.ts");

expect(build.includes("v40.31-microplastic-color-rendering"), "Build identifier records the color-rendering correction.");
expect(scene.includes('type ParticleShape = "shard" | "flake" | "chip" | "fiber" | "bead" | "film" | "grain"'), "Seven distinct microplastic shape families remain registered.");
for (const color of ["#ff7b28", "#67c95f", "#ff77ac", "#9a6cff", "#197fd1", "#ffd34d"]) {
  expect(scene.includes(color), `Saturated reference color ${color} is present in the live particle palettes.`);
}
expect(scene.includes("MeshBasicMaterial") && scene.includes("<meshBasicMaterial"), "Particles use unlit color-preserving material rather than anatomy lighting.");
expect(scene.includes("toneMapped={false}"), "Particle colors bypass ACES tone mapping so they stay saturated.");
expect(!scene.includes('emissive="#8c5334"'), "Legacy amber emissive tint remains removed.");
expect(scene.includes('<torusGeometry args={[0.54, 0.085, 5, 9, 1.85]} />'), "Fibers use a curved geometry rather than the same shard silhouette.");
expect(scene.includes('shape: "shard"') && scene.includes('shape: "flake"') && scene.includes('shape: "chip"') && scene.includes('shape: "fiber"') && scene.includes('shape: "bead"') && scene.includes('shape: "film"') && scene.includes('shape: "grain"'), "All seven particle populations are instantiated.");
expect(scene.includes('opacity: 0.84') && scene.includes('opacity: 0.5') && scene.includes('opacity: 0.7'), "Particle families use visibly different opacity levels.");
expect(scene.includes('size = 0.003 + n(4) * 0.009') && scene.includes('size = 0.007 + n(4) * 0.031') && scene.includes('stretch = 4.6 + n(8) * 7.4'), "Particle size and aspect-ratio ranges are materially different across families.");
expect(css.includes("mix-blend-mode:normal"), "Fallback particles preserve their assigned colors instead of washing through screen blending.");
for (const color of ["#62d1ff", "#1179c9", "#ff7b25", "#ffd74d", "#60c95e", "#ff73aa", "#7a5cc8"]) {
  expect(css.includes(color), `Fallback palette includes ${color}.`);
}
expect(scene.includes('layers: layerState({ body: 0.05, testes: 1, particles: 0.24 })'), "Testicular tissue remains final with visible microplastics.");

const lockHash = crypto.createHash("sha256").update(fs.readFileSync("package-lock.json")).digest("hex");
expect(lockHash === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
process.exit(failed ? 1 : 0);

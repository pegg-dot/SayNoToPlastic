#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });
const includesAll = (text, tokens) => tokens.every((token) => text.includes(token));
const hash = (path) => createHash("sha256").update(readFileSync(join(root, path))).digest("hex");

function glbJson(path) {
  const buffer = readFileSync(join(root, path));
  if (buffer.toString("ascii", 0, 4) !== "glTF") throw new Error(`${path} is not a GLB file`);
  let offset = 12;
  while (offset < buffer.length) {
    const length = buffer.readUInt32LE(offset);
    const type = buffer.readUInt32LE(offset + 4);
    offset += 8;
    const chunk = buffer.subarray(offset, offset + length);
    offset += length;
    if (type === 0x4e4f534a) return JSON.parse(chunk.toString("utf8").replace(/[\u0000\s]+$/g, ""));
  }
  throw new Error(`JSON chunk missing from ${path}`);
}

function normalizedValue(value, componentType, normalized) {
  if (!normalized) return value;
  if (componentType === 5122) return Math.max(value / 32767, -1);
  if (componentType === 5120) return Math.max(value / 127, -1);
  if (componentType === 5123) return value / 65535;
  if (componentType === 5121) return value / 255;
  return value;
}

function modelBounds(path) {
  const gltf = glbJson(path);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const node of gltf.nodes ?? []) {
    if (node.mesh === undefined) continue;
    const translation = node.translation ?? [0, 0, 0];
    const scale = node.scale ?? [1, 1, 1];
    const mesh = gltf.meshes[node.mesh];
    for (const primitive of mesh.primitives ?? []) {
      const accessorIndex = primitive.attributes?.POSITION;
      if (accessorIndex === undefined) continue;
      const accessor = gltf.accessors[accessorIndex];
      if (!accessor.min || !accessor.max) continue;
      for (let axis = 0; axis < 3; axis += 1) {
        const a = translation[axis] + scale[axis] * normalizedValue(accessor.min[axis], accessor.componentType, accessor.normalized);
        const b = translation[axis] + scale[axis] * normalizedValue(accessor.max[axis], accessor.componentType, accessor.normalized);
        min[axis] = Math.min(min[axis], a, b);
        max[axis] = Math.max(max[axis], a, b);
      }
    }
  }
  return { min, max };
}

const journey = read("app/components/BodyJourney.tsx");
const scene = read("app/components/AnatomyScene.tsx");
const registry = read("app/content/anatomy-system-models.ts");
const science = read("app/science/page.tsx");
const resources = read("app/resources/page.tsx");
const css = read("app/globals.css");
const footer = read("app/components/SiteChrome.tsx");
const packageJson = JSON.parse(read("package.json"));
const build = read("app/build-version.ts");

expect(build.includes("v40.22-navigation-and-reading-room-polish") || build.includes("v40.23-framing-and-density-polish") || build.includes("v40.24-content-architecture-cleanup") || build.includes("v40.25-reading-flow-polish") || build.includes("v40.26-inline-navigation-final") || build.includes("v40.27-final-predeploy-polish") || (build.includes("v40.28-testicular-final-chapter") || build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate")), "Build identifier preserves the v40.22 layout contract or advances to v40.23 framing polish.");

expect(!journey.includes("journey-integrated-systems") && !journey.includes("journey-integrated-pin"), "Floating Endocrine, Kidney, Skin, and Digestive pins are removed from the body image.");
expect(!css.includes(".journey-integrated-systems") && !css.includes(".journey-integrated-pin"), "Removed floating-pin interface CSS does not remain in the bundle.");
expect(includesAll(journey, ["organ-nav", "findings.map", "aria-controls={`finding-${item.slug}`}"]), "The ten-chapter anatomy navigation remains the clear route into every system.");

expect(includesAll(registry, ["position: [0, 0.035, 0.005]", "scale: 0.9"]), "Shared brain calibration is updated for the head-aligned placement.");
expect(includesAll(scene, ["BRAIN_ALIGNMENT", "<group position={BRAIN_ALIGNMENT.position} scale={BRAIN_ALIGNMENT.scale}>"]), "The scrollable anatomy uses the shared head alignment.");
expect(registry.includes('localModel("complete-brain"') && registry.includes("BRAIN_ALIGNMENT"), "The Complete Body Atlas uses the same head alignment.");

const alignmentMatch = registry.match(/BRAIN_ALIGNMENT:[\s\S]*?position:\s*\[\s*([^,]+),\s*([^,]+),\s*([^\]]+)\][\s\S]*?scale:\s*([0-9.]+)/);
if (alignmentMatch) {
  const alignment = { position: alignmentMatch.slice(1, 4).map(Number), scale: Number(alignmentMatch[4]) };
  const body = modelBounds("public/models/anatomy/body-female.glb");
  const brain = modelBounds("public/models/anatomy/brain.glb");
  const alignedMinY = alignment.position[1] + alignment.scale * brain.min[1];
  const alignedMaxY = alignment.position[1] + alignment.scale * brain.max[1];
  expect(alignedMaxY < body.max[1] - 0.01, "Calibrated brain top remains below the exterior head top.");
  expect(alignedMinY > body.max[1] - 0.2, "Calibrated brain remains in the upper head region rather than the face or neck.");
} else {
  expect(false, "Brain alignment transform can be parsed for geometry validation.");
  expect(false, "Brain alignment transform can be parsed for geometry validation.");
}

expect(!science.includes("science-exposome-bridge") && !science.includes("science-exposome-flow") && !science.includes("exposomeCategories"), "The redundant Exposome block is removed from the main Science page.");
expect(exists("app/science/exposome/page.tsx"), "The full Exposome remains available on its dedicated Science route.");
expect(footer.includes('/science/exposome') && read("app/solutions/reduce-exposure/page.tsx").includes('/science/exposome'), "The Exposome remains discoverable from shared navigation and practical action.");
expect(includesAll(science, ["<DetectionPrimer", "<BodySystemLibrary", 'id="body-system-overviews"']), "Science retains detection methods and body-system context after deduplication.");

expect((resources.match(/label:\s*"/g) ?? []).length >= 4, "All four guide-entry routes remain registered.");
expect(css.includes(".resource-pathways>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))"), "Guide entry routes use a balanced two-by-two desktop grid.");
expect(css.includes("@media(max-width:700px)") && css.includes(".resources-v2 .resource-pathways>div{grid-template-columns:1fr}"), "Guide entry routes collapse to one column on small screens.");
expect(includesAll(css, ["background:linear-gradient(180deg,#e9e0d2", ".resource-library:before", "padding:68px 0 92px"]), "The ivory reading room uses a deliberate paper gradient and tighter vertical rhythm.");
expect(includesAll(css, ["min-height:285px", "background:rgba(255,255,255,.18)", ".guide-starters a:hover"]), "Featured guide cards have a coherent surface treatment and compact proportions.");
expect(includesAll(css, [".resource-grid>a{background:rgba(255,255,255,.08)", ".resource-grid>a:hover{background:rgba(255,255,255,.32)"]), "Guide-library cards receive a restrained interactive paper treatment.");

expect(packageJson.scripts?.["layout:polish"] === "node scripts/v40-22-final-layout-audit.mjs", "The v40.22 final layout audit is registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_22_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_22.md") && exists("docs/V40_22_NAVIGATION_READING_ROOM.md"), "v40.22 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

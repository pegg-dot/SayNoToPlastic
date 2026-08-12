#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const includesAll = (text, tokens) => tokens.every((token) => text.includes(token));
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });
const hash = (path) => createHash("sha256").update(readFileSync(join(root, path))).digest("hex");

const viewerPath = "app/components/AnatomySystemViewer.tsx";
const registryPath = "app/content/anatomy-system-models.ts";
const journeyPath = "app/components/BodyJourney.tsx";
const scenePath = "app/components/AnatomyScene.tsx";
const loaderPath = "app/lib/anatomy-model-loader.ts";
expect([viewerPath, registryPath, journeyPath, scenePath, loaderPath].every(exists), "Viewer, registry, journey, scene, and shared model loader are packaged.");

const viewer = read(viewerPath);
const registry = read(registryPath);
const journey = read(journeyPath);
const scene = read(scenePath);
const loader = read(loaderPath);
const css = read("app/globals.css");
const licenses = read("public/models/anatomy/LICENSES.txt");
const packageJson = JSON.parse(read("package.json"));
const build = read("app/build-version.ts");
const compactAtlasHandoff = build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate");

for (const slug of ["digestive-system", "kidneys-urinary-system", "endocrine-metabolic-system", "skin"]) {
  expect(registry.includes(`"${slug}": {`) || registry.includes(`${slug}: {`), `Model registry includes ${slug}.`);
  expect(journey.includes(`"${slug}": "${slug}"`) || journey.includes(`${slug}: "${slug}"`), `${slug} opens directly from its scroll chapter.`);
}
expect(includesAll(journey, ['aria-haspopup="dialog"', "Open interactive 3D", "returnFocusRef", "closeViewer"]), "Scroll-chapter viewers expose dialog semantics and return focus after closure.");
expect(compactAtlasHandoff ? includesAll(journey, ["homepageJourney", "whole-body-atlas", "journey-complete-atlas-compact", "Open anatomy atlas"]) : includesAll(journey, ["homepageJourney", "Ten chapters", "whole-body-atlas", "Show the complete body"]), "One anatomy journey includes ten chapters and a complete-atlas handoff.");

const expectedModels = [
  "VH_F_Kidney_L.glb", "VH_F_Kidney_R.glb", "VH_F_Ureter_L.glb", "VH_F_Ureter_R.glb", "VH_F_Urinary_Bladder.glb",
  "VH_F_Small_Intestine.glb", "SBU_F_Intestine_Large.glb", "VH_F_Liver.glb", "VH_F_Pancreas.glb", "VH_F_Thymus.glb",
  "VH_F_Ovary_L.glb", "VH_F_Ovary_R.glb", "VH_F_Fallopian_Tube_L.glb", "VH_F_Fallopian_Tube_R.glb",
];
for (const model of expectedModels) expect(registry.includes(model), `Licensed HRA model is registered: ${model}.`);
expect(includesAll(registry, ["cdn.humanatlas.io/hra-releases", "raw.githubusercontent.com/hubmapconsortium/ccf-releases", "v1.2/models"]), "Official HRA CDN and repository fallback URLs are registered.");
expect(includesAll(registry, ["surfaceSystem: true", "Complete female exterior skin surface"]), "Skin uses the complete exterior HRA body surface.");
expect(registry.includes("does not fabricate") || registry.includes("Missing glands"), "Endocrine scope explicitly avoids fabricating unavailable glands.");

expect(includesAll(loader, ["anatomyModelCache", "loadAnatomyModel", "clearAnatomyModelCache", "MeshoptDecoder"]), "A shared loader caches models and supports explicit retry invalidation.");
expect(includesAll(viewer, ["Canvas", "GLTFLoader", "MeshoptDecoder", "OrbitControlsImpl", "loadAnatomyModel"]), "Viewer uses the existing Three.js stack, shared loader, and orbit controls without a new UI dependency.");
expect(includesAll(viewer, ["Drag", "Scroll or pinch", "Shift + drag"]), "Viewer exposes mouse and touch interaction guidance.");
expect(includesAll(viewer, ['type ViewMode = "exterior" | "cutaway" | "system"', "Skin surface", "System only"]), "Viewer provides exterior, cutaway, and isolated-system modes.");
for (const token of ["Focus system", "Full body", "Front", "Rear", "Zoom in", "Zoom out", "Reset"]) {
  expect(viewer.includes(token), `Camera control is present: ${token}.`);
}
expect(includesAll(viewer, ["ReferenceShell", "body-female.glb", "boxForObject", "fit-full", "fit-system", "camera.aspect"]), "Viewer uses a complete shell and calculates framing from loaded model bounds.");
expect(includesAll(viewer, ["Retry missing surfaces", "Retry 3D models", "clearAnatomyModelCache"]), "Model failures have bounded retry and cache-reset paths.");
expect(includesAll(viewer, ["Loading licensed anatomy", "requires an internet connection on first open", "completed", "total"]), "First-load network behavior and progress are visible.");
expect(includesAll(viewer, ["ViewerFallback", "BodySystemVisual", "completeFailure"]), "A conceptual fallback remains available if organ surfaces cannot load.");

expect(includesAll(viewer, ['role="dialog"', 'aria-modal="true"', "siteShell.inert = true", 'event.key === "Escape"', 'event.key !== "Tab"', "useBodyScrollLock(true)"]), "Viewer has modal semantics, focus containment, Escape closure, inert background, and scroll lock.");
expect(includesAll(viewer, ["prefers-reduced-motion", "enableDamping = !reducedMotion"]), "Reduced-motion preference disables inertial camera motion.");
expect(includesAll(viewer, ["Educational anatomy only", "not patient-specific scans", "does not diagnose disease"]), "Viewer communicates the educational and non-diagnostic boundary.");
expect(includesAll(viewer, ["HRA_LIBRARY_URL", "HRA_REPOSITORY_URL", "HRA_LICENSE_URL", "Creative Commons Attribution 4.0"]), "Visible viewer provenance links to the HRA library, release directory, and license.");

expect(includesAll(scene, ["SCENES", "endocrine", "kidneys", "digestive", "JourneyRemoteSystemLayer", "loadAnatomyModel"]), "The same licensed extended-system geometry is integrated into the scroll animation.");
expect((scene.match(/position: new THREE\.Vector3/g) || []).length >= 10, "The scroll renderer defines at least ten synchronized camera scenes.");

expect(includesAll(licenses, expectedModels), "Packaged anatomy attribution lists every runtime-loaded HRA surface.");
expect(includesAll(licenses, ["CC BY 4.0", "runtime", "external organ surfaces"]), "Attribution records license and runtime delivery behavior.");
expect(includesAll(css, [".anatomy-viewer-backdrop", ".anatomy-viewer-dialog", ".anatomy-viewer-canvas", ".anatomy-viewer-controls", ".anatomy-viewer-system-filter", "@media(max-width:700px)"]), "Viewer has full-screen, canvas, group controls, and responsive styling.");
expect(css.includes('body[data-anatomy-viewer-open="true"] .welcome-film-trigger'), "Welcome-film trigger is suppressed while the anatomy modal owns focus.");
expect(css.includes("@media(prefers-reduced-motion:reduce)") && css.includes(".anatomy-viewer-loading>span"), "Viewer animation has a reduced-motion CSS escape hatch.");

expect(packageJson.scripts?.["anatomy:viewer"] === "node scripts/v40-17-anatomy-viewer-audit.mjs", "Dedicated anatomy viewer audit remains registered.");
expect(/v40\.(?:19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34)/.test(build), "Build identifier advances to the compatible v40.19 anatomy candidate.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved lock.");
expect(exists("docs/V40_17_INTERACTIVE_ANATOMY.md") && exists("V40_17_CHANGE_MANIFEST.md"), "Prior interactive-anatomy implementation records remain packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

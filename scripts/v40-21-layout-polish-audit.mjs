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

const journey = read("app/components/BodyJourney.tsx");
const scene = read("app/components/AnatomyScene.tsx");
const registry = read("app/content/anatomy-system-models.ts");
const evidence = read("app/content/evidence.ts");
const library = read("app/components/BodySystemLibrary.tsx");
const science = read("app/science/page.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");
const packageJson = JSON.parse(read("package.json"));
const compactAtlasHandoff = build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate");

expect(build.includes("v40.21-anatomy-science-layout-polish") || build.includes("v40.22-navigation-and-reading-room-polish") || build.includes("v40.23-framing-and-density-polish") || (["v40.24-content-architecture-cleanup", "v40.25-reading-flow-polish", "v40.26-inline-navigation-final", "v40.27-final-predeploy-polish", "v40.28-testicular-final-chapter", "v40.33-system-aware-microplastic-flow", "v40.34-deployment-release-candidate"].some((token) => build.includes(token))), "Build identifier preserves v40.21 or advances to the compatible v40.23 polish candidate.");
expect(registry.includes("export const BRAIN_ALIGNMENT"), "A shared brain-to-head calibration is registered.");
expect(includesAll(registry, ["position: [0, 0.035, 0.005]", "scale: 0.9"]), "Brain calibration positions the local surface inside the upper head rather than the face or neck.");
expect(registry.includes('localModel("complete-brain"') && registry.includes("BRAIN_ALIGNMENT"), "The complete atlas uses the shared brain calibration.");
expect(scene.includes('import { anatomySystemModels, BRAIN_ALIGNMENT }'), "The scroll scene imports the same brain calibration.");
expect(includesAll(scene, ['<group position={BRAIN_ALIGNMENT.position} scale={BRAIN_ALIGNMENT.scale}>', 'kind="brain"']), "The scroll brain is rendered through the shared calibrated transform.");

expect(scene.includes("endocrine: 1") && scene.includes("body: 0.1"), "The endocrine chapter brings the endocrine layer forward against a restrained body shell.");
expect(scene.includes("kidneys: 1") && scene.includes("body: 0.11"), "The urinary chapter brings kidneys, ureters, and bladder forward.");
expect(scene.includes("body: 0.86") && scene.includes("digestive: 0.012"), "The skin chapter isolates the exterior surface and suppresses internal context.");
expect(scene.includes("digestive: 1") && scene.includes("kidneys: 0.03"), "The digestive chapter brings its registered organs forward while retaining minimal context.");

expect(includesAll(evidence, ['stat: "4 tissues"', 'pancreas, thymus, and both ovaries']), "Endocrine chapter reports the four actually represented tissues.");
expect(evidence.includes('title: "Four represented hormone-producing tissues come into view."'), "Endocrine headline describes visible anatomy rather than an abstract network.");
expect(includesAll(evidence, ['stat: "5 structures"', 'two kidneys, two ureters, and the urinary bladder']), "Urinary chapter reports its five visible structures.");
expect(includesAll(evidence, ['stat: "1 surface"', 'complete female exterior reference body']), "Skin chapter reports the single whole-body exterior surface.");
expect(includesAll(evidence, ['stat: "4 organs"', 'small and large intestine, liver, and pancreas']), "Digestive chapter reports its four represented organs.");

expect(includesAll(journey, ["journey-visible-anatomy", "Visible anatomy", "current.modelLabel"]), "The sticky stage uses one short visible-anatomy label tied to the active chapter.");
expect(!journey.includes("journey-atlas-badge"), "The long complete-atlas context badge is removed from the sticky stage.");
expect(!journey.includes("Every available layer remains in this body while the active chapter comes forward."), "Technical atlas explanation no longer crowds the sticky stage.");
expect(!journey.includes("journey-integrated-systems") && !journey.includes("journey-integrated-pin"), "Redundant floating Endocrine, Kidney, Skin, and Digestive pins are removed from the opening body view.");
expect(includesAll(journey, ["organ-nav", "findings.map", "finding-${item.slug}"]), "All ten chapters remain available through the primary anatomy navigation.");

expect(compactAtlasHandoff ? journey.includes("journey-complete-atlas-compact") : journey.includes('src="/images/anatomy/body.png"'), compactAtlasHandoff ? "Later compact handoff removes the redundant body silhouette." : "The complete-atlas handoff uses a transparent body silhouette.");
if (compactAtlasHandoff) {
  expect(includesAll(journey, ["Explore the complete anatomy atlas.", "Open anatomy atlas", "Explore the science"]), "Later compact handoff preserves atlas and science actions without repeated system labels.");
} else {
  for (const label of ["Exterior", "Brain", "Circulation", "Heart", "Pelvis + pregnancy", "Endocrine", "Kidneys", "Digestive"]) {
    expect(journey.includes(`>${label}</span>`), `Complete-atlas handoff labels ${label}.`);
  }
}
expect(!journey.includes("<b>ALL</b>"), "The ambiguous circular ALL graphic is removed.");

expect((["v40.24-content-architecture-cleanup", "v40.25-reading-flow-polish", "v40.26-inline-navigation-final", "v40.27-final-predeploy-polish", "v40.28-testicular-final-chapter", "v40.33-system-aware-microplastic-flow", "v40.34-deployment-release-candidate"].some((token) => build.includes(token))) ? !library.includes("is-life-stage") : (library.includes('item.slug === "pregnancy-early-life"') && library.includes("is-life-stage")), (["v40.24-content-architecture-cleanup", "v40.25-reading-flow-polish", "v40.26-inline-navigation-final", "v40.27-final-predeploy-polish", "v40.28-testicular-final-chapter", "v40.33-system-aware-microplastic-flow", "v40.34-deployment-release-candidate"].some((token) => build.includes(token))) ? "Later cleanup removes the orphan full-width pregnancy card for a balanced library." : "Pregnancy and early life receives an intentional full-width library treatment.");
expect(includesAll(css, ["#body-system-overviews .body-system-library-grid{grid-template-columns:repeat(3", ".body-system-card.is-life-stage{grid-column:1/-1"]), "Science body-system library is a balanced three-by-two grid plus one full-width life-stage pathway.");
expect(includesAll(css, ["max-width:1080px", "font-size:clamp(44px,4.2vw,64px)"]), "Science library heading is constrained to avoid excessive wrapping and whitespace.");
expect(css.includes("@media(max-width:900px)") && css.includes("grid-template-columns:repeat(2"), "Body-system library adapts to a balanced two-column tablet layout.");
expect(css.includes("@media(max-width:700px)") && css.includes("#body-system-overviews .body-system-library-grid{grid-template-columns:1fr}"), "Body-system library becomes one column on mobile.");

expect(!science.includes("ExposomeMap") && !science.includes("science-exposome-flow") && !science.includes("exposomeCategories"), "Science landing page no longer duplicates the dedicated Exposome experience.");
expect(exists("app/science/exposome/page.tsx"), "The complete Exposome remains available on its canonical route.");
const footer = read("app/components/SiteChrome.tsx");
const solutions = read("app/solutions/reduce-exposure/page.tsx");
expect(footer.includes('/science/exposome') && solutions.includes('/science/exposome'), "The Exposome remains discoverable from the footer and practical-action pathway.");

expect(includesAll(css, [".journey-visible-anatomy", ".journey-complete-atlas-visual img", ".atlas-point-brain", ".atlas-point-digestive"]), "v40.21 includes responsive sticky-stage and body-silhouette styling.");
expect(["node scripts/v40-21-layout-polish-audit.mjs", "node scripts/v40-22-final-layout-audit.mjs"].includes(packageJson.scripts?.["layout:polish"]), "Layout audit remains registered through the v40.22 superseding pass.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_21_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_21.md") && exists("docs/V40_21_ANATOMY_SCIENCE_LAYOUT.md"), "v40.21 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

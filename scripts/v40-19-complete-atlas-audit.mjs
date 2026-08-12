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

const journey = read("app/components/BodyJourney.tsx");
const evidence = read("app/content/evidence.ts");
const scene = read("app/components/AnatomyScene.tsx");
const viewer = read("app/components/AnatomySystemViewer.tsx");
const registry = read("app/content/anatomy-system-models.ts");
const loader = read("app/lib/anatomy-model-loader.ts");
const home = read("app/page.tsx");
const css = read("app/globals.css");
const licenses = read("public/models/anatomy/LICENSES.txt");
const packageJson = JSON.parse(read("package.json"));
const build = read("app/build-version.ts");
const compactAtlasHandoff = build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate");

expect(!home.includes("HomeAnatomySystemShowcase") && !home.includes("<ExposomeMap"), "Home contains neither the retired anatomy card showcase nor the large Exposome block.");
expect(includesAll(home, ["<BodyJourney />", '<section id="exposure" className="exposure-section">']), "The integrated anatomy journey remains in the existing homepage flow.");
expect((evidence.match(/slug: "/g) || []).length >= 10, "The shared homepage evidence registry contains ten anatomy chapters.");
for (const slug of ["endocrine-metabolic-system", "kidneys-urinary-system", "skin", "digestive-system"]) {
  expect(evidence.includes(`slug: "${slug}"`), `Extended scroll chapter exists: ${slug}.`);
}
expect(includesAll(journey, ["compactFinding", "compactMeaning", "finding-brief", "Study context, limits, and sources"]), "Visible chapter copy is concise while methods, limits, and sources remain accessible on demand.");
expect(includesAll(journey, ["chapterViewers", "Open interactive 3D", 'aria-haspopup="dialog"']), "All extended chapters can open a focused 3D viewer from the same scroll experience.");
expect(compactAtlasHandoff ? includesAll(journey, ["journey-complete-atlas-compact", "whole-body-atlas", "Open anatomy atlas"]) : includesAll(journey, ["journey-complete-atlas-full", "whole-body-atlas", "Show the complete body"]), "A complete-atlas handoff follows the scroll chapters.");
expect(compactAtlasHandoff ? journey.includes("Rotate the reference body, isolate systems") : includesAll(journey, ["Exterior", "Brain", "Circulation", "Heart", "Pelvis", "Pregnancy", "Endocrine", "Kidneys", "Digestive"]), "The handoff communicates the complete-atlas system exploration affordance.");

expect((scene.match(/position: new THREE\.Vector3/g) || []).length >= 10, "The scroll renderer defines at least ten camera states.");
for (const token of ['kind="endocrine"', 'kind="kidneys"', 'kind="digestive"', 'kind="body"']) {
  expect(scene.includes(token), `Scrollable anatomy renders ${token.replace(/.*="|"/g, "")} geometry.`);
}
expect(includesAll(scene, ["JourneyRemoteSystemLayer", "loadAnatomyModel"]) && (scene.includes("activeIndex >= focusIndex - 1") || scene.includes("useJourneySystemModels(definitions, enabled)")), "Remote HRA structures use the shared model cache and either chapter-near or section-near loading.");
expect(includesAll(scene, ["focusIndex={5}", "focusIndex={6}", "focusIndex={7}", "focusIndex={8}", "focusFor(progress.current, 9)"]), "Extended chapters occupy distinct synchronized positions, with testicular tissue closing the ten-scene sequence.");

expect(registry.includes('"whole-body-atlas"'), "Complete atlas has a registered viewer slug.");
expect(includesAll(registry, ["compositeSystem: true", "groups,", "completeModels"]), "Complete atlas declares composite mode, focus groups, and a combined model set.");
for (const label of ["Blood vasculature", "Brain", "Heart", "Pelvic skeleton", "Uterus", "Placenta", "Fetal reference surface", "Left fallopian tube", "Right fallopian tube", "Left kidney", "Small intestine", "Pancreas", "Thymus"]) {
  expect(registry.includes(`"${label}"`), `Complete atlas includes ${label}.`);
}
for (const group of ["skin", "brain", "circulation", "heart", "skeleton", "pregnancy", "reproductive", "endocrine", "urinary", "digestive"]) {
  expect(registry.includes(`id: "${group}"`), `Complete atlas exposes a ${group} focus control.`);
}
expect(registry.includes("The separate male testicular chapter is not overlaid"), "Complete atlas states the sex-specific compositing boundary instead of fabricating an overlay.");
expect(registry.includes("does not include every organ, gland, bone, or microscopic tissue layer"), "Complete atlas states that it is not a complete clinical body model.");

expect(includesAll(viewer, ["activeGroup", "selectGroup", "anatomy-viewer-system-filter", "definition.group === activeGroup"]), "Viewer can isolate or restore each registered system group.");
expect(includesAll(viewer, ['type ViewMode = "exterior" | "cutaway" | "system"', "Exterior", "Cutaway", "System only"]), "Viewer supports exterior, cutaway, and isolated-system modes.");
expect(includesAll(viewer, ["Focus system", "Full body", "Front", "Rear", "Zoom in", "Zoom out", "Reset"]), "Complete viewer retains all requested camera controls.");
expect(includesAll(viewer, ["panelKnown", "panelUncertain", "anatomy-viewer-quick-read", "Included anatomy"]), "Viewer panel uses a concise known/uncertain summary with optional structure details.");
expect(includesAll(viewer, ['role="dialog"', 'aria-modal="true"', "siteShell.inert = true", 'event.key === "Escape"', "useBodyScrollLock(true)"]), "Complete viewer preserves modal focus, Escape, inert-background, and scroll-lock behavior.");
expect(includesAll(viewer, ["ViewerFallback", "complete-atlas-fallback-map", "Retry 3D models"]), "Complete atlas has a readable fallback and retry path.");
expect(includesAll(loader, ["anatomyModelCache", "loadAnatomyModel", "clearAnatomyModelCache"]), "Focused viewers, scroll chapters, and the complete atlas share one cacheable model loader.");

expect(compactAtlasHandoff ? includesAll(css, [".finding-brief", ".finding-open-viewer", ".journey-complete-atlas-compact", ".anatomy-viewer-system-filter", ".anatomy-viewer-quick-read"]) : includesAll(css, [".finding-brief", ".finding-open-viewer", ".journey-complete-atlas-full", ".journey-complete-atlas-visual", ".anatomy-viewer-system-filter", ".anatomy-viewer-quick-read"]), "Concise chapters, atlas handoff, system controls, and quick-read panel are styled.");
expect(includesAll(css, ["@media(max-width:1180px)", "@media(max-width:800px)", "@media(max-width:700px)", "@media(prefers-reduced-motion:reduce)"]), "v40.19 includes desktop, tablet, mobile, and reduced-motion layout rules.");
expect(licenses.includes("Interactive extended-system viewer") && licenses.includes("CC BY 4.0"), "Runtime anatomy sources retain visible license attribution.");

expect(/v40\.(?:19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34)/.test(build), "Build identifier preserves the v40.19 complete-atlas contract or advances to a compatible successor.");
expect(packageJson.scripts?.["anatomy:complete"] === "node scripts/v40-19-complete-atlas-audit.mjs", "Dedicated v40.19 audit is registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_19_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_19.md") && exists("docs/V40_19_TEN_CHAPTER_COMPLETE_ATLAS.md"), "v40.19 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

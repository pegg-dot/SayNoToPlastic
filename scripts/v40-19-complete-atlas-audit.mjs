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

expect(!home.includes("HomeAnatomySystemShowcase") && !home.includes("<ExposomeMap"), "Home contains neither the retired anatomy card showcase nor the large Exposome block.");
expect(includesAll(home, ["<BodyJourney />", '<section id="exposure" className="exposure-section">']), "The anatomy journey remains in the homepage flow.");
expect((evidence.match(/slug: "/g) || []).length >= 10, "The shared homepage evidence registry contains ten anatomy chapters.");
expect(includesAll(journey, ["compactFinding", "compactMeaning", "finding-brief", "Study context, limits, and sources"]), "Visible chapter copy remains concise while methods, limits, and sources stay available on demand.");
expect(includesAll(journey, ["journey-complete-atlas-compact", "whole-body-atlas", "Open anatomy atlas", "Explore the anatomy reference atlas."]), "A reference-atlas handoff follows the scroll chapters.");
expect(journey.includes("Ten chapters. Anatomy in context.") && journey.includes("Sex- and life-stage-specific models are kept in their own context"), "Journey copy states the contextual anatomy boundary.");

expect((scene.match(/position: new THREE\.Vector3/g) || []).length >= 10, "The scroll renderer defines at least ten camera states.");
for (const token of ['kind="endocrine"', 'kind="kidneys"', 'kind="digestive"', 'kind="body"']) {
  expect(scene.includes(token), `Scrollable anatomy renders ${token.replace(/.*="|"/g, "")} geometry.`);
}
expect(includesAll(scene, ["JourneyRemoteSystemLayer", "loadAnatomyModel"]), "Remote HRA structures use the shared model loader.");

const groupsBlock = registry.slice(registry.indexOf("const groups:"), registry.indexOf("const localHraSource"));
const completeModelsBlock = registry.slice(registry.indexOf("const completeModels:"), registry.indexOf("export const anatomySystemModels"));
const atlasBlock = registry.slice(registry.indexOf('"whole-body-atlas": {'), registry.indexOf("export function getAnatomySystemModel"));
expect(registry.includes('"whole-body-atlas"'), "Reference atlas has a registered viewer slug.");
expect(includesAll(registry, ["compositeSystem: true", "groups,", "completeModels"]), "Reference atlas declares composite mode, focus groups, and a model set.");
for (const label of ["Blood vasculature", "Brain", "Heart", "Pelvic skeleton", "Left kidney", "Small intestine", "Pancreas", "Thymus"]) {
  expect(registry.includes(`"${label}"`), `Reference atlas includes ${label}.`);
}
expect(groupsBlock.includes('label: "General anatomy"') && !groupsBlock.includes('id: "pregnancy"') && !groupsBlock.includes('id: "reproductive"'), "Generic atlas controls exclude pregnancy and reproductive overlays.");
expect(!completeModelsBlock.includes("complete-placenta") && !completeModelsBlock.includes("complete-fetus") && !completeModelsBlock.includes("complete-uterus") && !completeModelsBlock.includes("complete-fallopian") && !completeModelsBlock.includes("complete-ovary"), "Generic reference body excludes sex- and life-stage-specific overlay models.");
expect(atlasBlock.includes('title: "Reference anatomy atlas"') && atlasBlock.includes("not a complete clinical atlas or a patient-specific reconstruction"), "Reference atlas does not claim clinical completeness.");
expect(atlasBlock.includes("Pregnancy, fetal, female-reproductive, and male testicular reference models remain in their dedicated chapters"), "Context-specific anatomy remains explicitly separated.");

expect(includesAll(viewer, ["activeGroup", "selectGroup", "anatomy-viewer-system-filter", "definition.group === activeGroup"]), "Viewer can isolate or restore each registered general system group.");
expect(includesAll(viewer, ['type ViewMode = "exterior" | "cutaway" | "system"', "Exterior", "Cutaway", "System only"]), "Viewer supports exterior, cutaway, and isolated-system modes.");
expect(includesAll(viewer, ["Focus system", "Full body", "Front", "Rear", "Zoom in", "Zoom out", "Reset"]), "Reference viewer retains camera controls.");
expect(includesAll(viewer, ["panelKnown", "panelUncertain", "anatomy-viewer-quick-read", "Included anatomy"]), "Viewer panel uses concise known/uncertain summaries with optional structure details.");
expect(includesAll(viewer, ['role="dialog"', 'aria-modal="true"', "siteShell.inert = true", 'event.key === "Escape"', "useBodyScrollLock(true)"]), "Viewer preserves modal accessibility behavior.");
expect(includesAll(loader, ["anatomyModelCache", "loadAnatomyModel", "clearAnatomyModelCache"]), "Focused viewers and atlas share one cacheable model loader.");
expect(includesAll(css, [".finding-brief", ".finding-open-viewer", ".journey-complete-atlas-compact", ".anatomy-viewer-system-filter", ".anatomy-viewer-quick-read"]), "Chapter, atlas, system-control, and quick-read styling remains packaged.");
expect(licenses.includes("Interactive extended-system viewer") && licenses.includes("CC BY 4.0"), "Runtime anatomy sources retain license attribution.");
expect(packageJson.scripts?.["anatomy:complete"] === "node scripts/v40-19-complete-atlas-audit.mjs", "Dedicated anatomy audit remains registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_19_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_19.md") && exists("docs/V40_19_TEN_CHAPTER_COMPLETE_ATLAS.md"), "Historical v40.19 records remain packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

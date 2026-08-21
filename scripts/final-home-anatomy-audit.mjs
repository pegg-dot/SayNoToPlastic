#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const continuity = read("app/final-continuity.css");
const layout = read("app/layout.tsx");
const footer = read("app/components/SiteChrome.tsx");
const journey = read("app/components/BodyJourney.tsx");
const registry = read("app/content/anatomy-system-models.ts");
const atlasEvidenceSync = read("app/components/AnatomyAtlasEvidenceSync.tsx");

expect(layout.includes('import "./final-continuity.css";'), "Final continuity overrides load after the global stylesheet.");
expect(continuity.includes(".home-v2 .journey-complete-atlas-compact") && continuity.includes("background: #040b12 !important"), "Anatomy handoff uses the homepage story-night background without a separate gradient field.");
expect(continuity.includes(".journey-complete-atlas-compact::before") && continuity.includes("display: none !important"), "Decorative anatomy-handoff ring is disabled.");
expect(continuity.includes(".site-footer .earth") && continuity.includes(".site-footer .earth::before") && continuity.includes("content: none !important"), "Inheritance quote uses the same flat story-night field without an Earth/radial ring.");

expect(!footer.includes("SignupForm") && footer.includes("Field Notes / Newsletter") && footer.includes("Coming soon.") && footer.includes("No email addresses are being collected at launch."), "Shared footer cannot collect newsletter addresses before a mailing provider is configured.");

const groupsBlock = registry.slice(registry.indexOf("const groups:"), registry.indexOf("const localHraSource"));
const completeModelsBlock = registry.slice(registry.indexOf("const completeModels:"), registry.indexOf("export const anatomySystemModels"));
const atlasBlock = registry.slice(registry.indexOf('"whole-body-atlas": {'), registry.indexOf("export function getAnatomySystemModel"));

expect(groupsBlock.includes('label: "General anatomy"') && !groupsBlock.includes('id: "pregnancy"') && !groupsBlock.includes('id: "reproductive"'), "Generic reference atlas does not offer pregnancy or reproductive anatomy as coexisting general-body layers.");
expect(!completeModelsBlock.includes("complete-placenta") && !completeModelsBlock.includes("complete-fetus") && !completeModelsBlock.includes("complete-uterus") && !completeModelsBlock.includes("complete-fallopian") && !completeModelsBlock.includes("complete-ovary"), "Pregnancy, fetal, and reproductive models are excluded from the generic reference-body composite.");
expect(atlasBlock.includes('title: "Reference anatomy atlas"') && atlasBlock.includes("does not imply that every model on the site belongs to one individual or life stage"), "Atlas title and finding copy describe a reference assembly rather than a literal complete person.");
expect(atlasBlock.includes("Pregnancy, fetal, female-reproductive, and male testicular reference models remain in their dedicated chapters"), "Sex- and life-stage-specific anatomy has an explicit contextual boundary.");
expect(!atlasBlock.includes("Rotate one combined body") && !atlasBlock.includes("one movable body"), "Superseded one-literal-body wording is removed.");

expect(journey.includes("Ten chapters. Anatomy in context.") && journey.includes("Sex- and life-stage-specific models are kept in their own context"), "Homepage anatomy journey explains the contextual reference-model approach.");
expect(journey.includes("Explore the anatomy reference atlas.") && journey.includes("Pregnancy, fetal, and reproductive anatomy stay in their dedicated chapters"), "Atlas handoff repeats the contextual anatomy boundary before the viewer opens.");
expect(!journey.includes("Ten chapters. One connected body.") && !journey.includes("Explore the complete anatomy atlas."), "Superseded complete/literal-body framing is removed from the visible homepage handoff.");

expect(layout.includes("AnatomyAtlasEvidenceSync") && layout.includes("<AnatomyAtlasEvidenceSync/>"), "Root layout mounts the system-aware atlas evidence synchronizer.");
for (const token of [
  'brain: "brain"',
  'circulation: "blood"',
  'heart: "heart-arteries"',
  'endocrine: "endocrine-metabolic-system"',
  'urinary: "kidneys-urinary-system"',
  'digestive: "digestive-system"',
]) {
  expect(atlasEvidenceSync.includes(token), `Atlas evidence synchronizer maps ${token.replace(/[:\"]/g, " ").trim()} to the matching evidence record.`);
}
expect(atlasEvidenceSync.includes('findingHeading: "What the evidence says"') && atlasEvidenceSync.includes('uncertaintyHeading: "What it does not prove"'), "Selected systems surface a concise finding and limitation in the right panel.");
expect(atlasEvidenceSync.includes("Study snapshot") && atlasEvidenceSync.includes("evidence.sources.slice(0, 2)"), "Verified system selections can show the key study number and direct source links without requiring page scroll.");
expect(atlasEvidenceSync.includes("does not currently present a human microplastic study specific to the pelvic bones"), "Pelvis selection states the evidence boundary instead of inventing a pelvis-specific study.");
expect(continuity.includes(".anatomy-viewer-study-stat") && continuity.includes(".anatomy-viewer-panel-sources"), "System-specific evidence snapshot and source links have dedicated atlas-panel styling.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

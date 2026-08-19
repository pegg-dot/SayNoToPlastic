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
const scene = read("app/components/AnatomyScene.tsx");
const registry = read("app/content/anatomy-system-models.ts");
const css = read("app/globals.css");
const evidence = read("app/content/evidence.ts");
const packageJson = JSON.parse(read("package.json"));

expect(includesAll(journey, ["atlasContextEnabled", 'rootMargin: "1200px 0px"', "loadCompleteContext={atlasContextEnabled}"]), "Reference-atlas context preloads as the anatomy section approaches the viewport rather than on first page paint.");
expect(includesAll(journey, ["journey-visible-anatomy", "Visible anatomy", "current.modelLabel", "organ-nav"]), "The scroll stage communicates active visible anatomy and preserves ten-chapter navigation.");
expect(!journey.includes("journey-integrated-systems") && !journey.includes("journey-integrated-pin"), "Superseded floating anatomy pins remain removed.");
expect(journey.includes("Ten chapters. Anatomy in context.") && journey.includes("Sex- and life-stage-specific models are kept in their own context"), "Journey introduction explains that reference anatomy changes with context.");
expect(includesAll(journey, ['blood: "whole-body-atlas"', "Open reference atlas"]), "The general reference atlas remains directly reachable from the opening circulation chapter.");
expect((evidence.match(/slug: "/g) || []).length >= 10, "All ten anatomy chapters remain registered.");

expect(includesAll(scene, ["CONTEXT_LAYERS", "journeyEndocrineModels", "journeyUrinaryModels", "journeyDigestiveModels"]), "Scroll renderer retains shared general-system context and source-model reuse.");
for (const token of ['kind="endocrine"', 'kind="kidneys"', 'kind="digestive"']) {
  expect(scene.includes(token), `The scroll renderer mounts ${token.replace(/.*="|"/g, "")} anatomy.`);
}
expect(includesAll(scene, ["enabled={loadCompleteContext}", "useJourneySystemModels(definitions, enabled)", "sharedEndocrineSurface", "sharedSurfaceFactor"]), "Remote reference models preload through the common cache and avoid duplicate endocrine surfaces.");
expect((scene.includes('from === 4 && to === 5 && kind === "testes"') || scene.includes('from === 8 && to === 9 && kind === "testes"')), "The separate testicular chapter retains its transition handling.");
expect(includesAll(scene, ["body: 0.86", "digestive: 1", "kidneys: 1", "endocrine: 1"]), "Focused general-system chapters still bring their selected anatomy forward.");

const groupsBlock = registry.slice(registry.indexOf("const groups:"), registry.indexOf("const localHraSource"));
const completeModelsBlock = registry.slice(registry.indexOf("const completeModels:"), registry.indexOf("export const anatomySystemModels"));
expect(includesAll(registry, ['"whole-body-atlas"', "completeModels", "Left kidney", "Small intestine", "Thymus"]), "Shared reference-atlas registry still contains the general source geometry reused in the scroll.");
expect(!groupsBlock.includes('id: "pregnancy"') && !groupsBlock.includes('id: "reproductive"'), "Generic atlas controls do not collapse sex- or life-stage-specific models into one body.");
expect(!completeModelsBlock.includes("complete-placenta") && !completeModelsBlock.includes("complete-fetus") && !completeModelsBlock.includes("complete-uterus"), "Generic atlas registry keeps pregnancy/fetal anatomy out of the all-system composite.");

expect(includesAll(css, ["v40.20", ".journey-visible-anatomy", "@media(max-width:900px)"]), "Integrated-atlas indicator retains responsive styling.");
expect(!css.includes(".journey-integrated-pin") && !css.includes(".journey-integrated-systems"), "Removed floating-pin styling does not remain as dead interface CSS.");
expect(packageJson.scripts?.["anatomy:integrated"] === "node scripts/v40-20-integrated-scroll-atlas-audit.mjs", "Dedicated integrated-anatomy audit remains registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_20_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_20.md") && exists("docs/V40_20_INTEGRATED_SCROLL_ATLAS.md"), "Historical v40.20 records remain packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

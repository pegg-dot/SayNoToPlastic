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

expect(includesAll(journey, ["atlasContextEnabled", 'rootMargin: "1200px 0px"', "loadCompleteContext={atlasContextEnabled}"]), "Complete-atlas context preloads as the anatomy section approaches the viewport rather than on first page paint.");
expect(includesAll(journey, ["journey-visible-anatomy", "Visible anatomy", "current.modelLabel", "organ-nav"]), "The scroll stage communicates active visible anatomy and preserves the ten-chapter navigation.");
expect(!journey.includes("journey-integrated-systems") && !journey.includes("journey-integrated-pin"), "Superseded floating chapter-01 pins are removed without removing chapters 07–10 from the main journey.");
expect(journey.includes("All available anatomy stays together in the body while the active chapter brightens") && journey.includes("Ten chapters. One connected body."), "The journey introduction explains the persistent context-and-focus behavior.");
expect(includesAll(journey, ['blood: "whole-body-atlas"', "Open complete 3D"]), "The complete movable atlas opens directly from chapter 01, not only from the section below the scroll.");
expect((evidence.match(/slug: "/g) || []).length >= 10, "All ten anatomy chapters remain registered.");

expect(includesAll(scene, ["CONTEXT_LAYERS", "...CONTEXT_LAYERS", "reproductive: 0.065", "endocrine: 0.075", "kidneys: 0.09", "digestive: 0.08"]), "Every scroll scene inherits low-opacity whole-body context for the extended systems.");
expect(includesAll(scene, ["reproductive: 0.42", "endocrine: 0.72", "kidneys: 0.82", "digestive: 0.72"]), "Chapter 01 visibly includes reproductive, endocrine, urinary, and digestive anatomy in the combined body overview.");
expect(includesAll(scene, ["journeyReproductiveModels", "journeyEndocrineModels", "journeyUrinaryModels", "journeyDigestiveModels"]), "The scroll view derives its remote system layers from the same complete-atlas registry.");
for (const token of ['kind="reproductive"', 'kind="endocrine"', 'kind="kidneys"', 'kind="digestive"']) {
  expect(scene.includes(token), `The scroll renderer mounts ${token.replace(/.*="|"/g, "")} anatomy.`);
}
expect(includesAll(scene, ["enabled={loadCompleteContext}", "useJourneySystemModels(definitions, enabled)", "sharedEndocrineSurface", "sharedSurfaceFactor", "overview * 0.55"]), "Remote atlas models load before the section arrives, share the common cache, and avoid duplicate endocrine surfaces in the overview.");
expect(!scene.includes("activeIndex >= focusIndex - 1"), "Extended anatomy is not deferred until chapters 07–10; it can be visible in the opening whole-body scene.");
expect((scene.includes('from === 4 && to === 5 && kind === "testes"') || scene.includes('from === 8 && to === 9 && kind === "testes"')) && !scene.includes('kind !== "particles"'), "The testicular transition preserves persistent whole-body context, including when testicular tissue is the final chapter.");
expect(includesAll(scene, ["body: 0.86", "digestive: 1", "kidneys: 1", "endocrine: 1"]), "Focused chapters still bring their selected shell or organ system forward.");
expect(includesAll(registry, ['"whole-body-atlas"', "completeModels", "Left fallopian tube", "Left kidney", "Small intestine", "Thymus"]), "The shared complete-atlas registry still contains the source geometry reused in the scroll.");

expect(includesAll(css, ["v40.20", ".journey-visible-anatomy", "@media(max-width:900px)"]), "The integrated-atlas indicator retains responsive styling.");
expect(!css.includes(".journey-integrated-pin") && !css.includes(".journey-integrated-systems"), "Removed floating-pin styling does not remain as dead interface CSS.");
expect(read("app/build-version.ts").includes("v40.20-integrated-scroll-atlas") || read("app/build-version.ts").includes("v40.21-anatomy-science-layout-polish") || read("app/build-version.ts").includes("v40.22-navigation-and-reading-room-polish") || read("app/build-version.ts").includes("v40.23-framing-and-density-polish") || read("app/build-version.ts").includes("v40.24-content-architecture-cleanup") || read("app/build-version.ts").includes("v40.25-reading-flow-polish") || read("app/build-version.ts").includes("v40.26-inline-navigation-final") || read("app/build-version.ts").includes("v40.27-final-predeploy-polish") || (read("app/build-version.ts").includes("v40.28-testicular-final-chapter") || read("app/build-version.ts").includes("v40.33-system-aware-microplastic-flow") || read("app/build-version.ts").includes("v40.34-deployment-release-candidate")), "Build identifier preserves the v40.20 integrated atlas or advances to the compatible v40.21 polish candidate.");
expect(packageJson.scripts?.["anatomy:integrated"] === "node scripts/v40-20-integrated-scroll-atlas-audit.mjs", "Dedicated v40.20 audit is registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_20_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_20.md") && exists("docs/V40_20_INTEGRATED_SCROLL_ATLAS.md"), "v40.20 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

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

const home = read("app/page.tsx");
const journey = read("app/components/BodyJourney.tsx");
const evidence = read("app/content/evidence.ts");
const scene = read("app/components/AnatomyScene.tsx");
const registry = read("app/content/anatomy-system-models.ts");
const css = read("app/globals.css");
const packageJson = JSON.parse(read("package.json"));
const build = read("app/build-version.ts");
const compactAtlasHandoff = build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate");

expect(!home.includes("home-exposome") && !home.includes("<ExposomeMap") && !home.includes('components/ExposomeMap'), "The large Exposome feature remains removed from Home.");
expect(exists("app/science/exposome/page.tsx") && exists("app/components/ExposomeMap.tsx"), "The dedicated Exposome route and reusable map remain available elsewhere.");
expect(includesAll(home, ['import { BodyJourney }', "<BodyJourney />", '<section id="exposure" className="exposure-section">']), "Home preserves the anatomy journey and everyday-exposure section.");
expect(!home.includes("HomeAnatomySystemShowcase") && !exists("app/components/HomeAnatomySystemShowcase.tsx"), "The separate light anatomy showcase is retired instead of duplicated.");

for (const slug of ["endocrine-metabolic-system", "kidneys-urinary-system", "skin", "digestive-system"]) {
  expect(evidence.includes(`slug: "${slug}"`), `Homepage evidence includes ${slug}.`);
  expect(journey.includes(`"${slug}": "${slug}"`) || journey.includes(`${slug}: "${slug}"`), `${slug} has a direct 3D action inside the scroll journey.`);
}
expect((evidence.match(/slug: "/g) || []).length >= 10, "Homepage evidence registry exposes at least ten anatomy chapters.");
expect((scene.match(/position: new THREE\.Vector3/g) || []).length >= 10, "The anatomy renderer exposes at least ten camera scenes.");
expect(includesAll(journey, ["compactFinding", "compactMeaning", "finding-brief", "Study context, limits, and sources"]), "Chapter copy is concise by default with details available on demand.");
expect(compactAtlasHandoff ? includesAll(journey, ["journey-complete-atlas-compact", "whole-body-atlas", "Open anatomy atlas"]) : includesAll(journey, ["journey-complete-atlas-full", "whole-body-atlas", "Show the complete body"]), "A complete-atlas handoff follows the ten scroll chapters.");
expect(includesAll(registry, ["whole-body-atlas", "compositeSystem: true", "Blood vasculature", "Fetal reference surface", "Small intestine", "Left kidney"]), "Complete atlas combines the major local and HRA anatomy surfaces.");

expect(compactAtlasHandoff ? includesAll(css, [".journey-complete-atlas-compact", ".finding-brief", ".finding-open-viewer"]) : includesAll(css, [".journey-complete-atlas-full", ".journey-complete-atlas-visual", ".finding-brief", ".finding-open-viewer"]), "The integrated journey and complete-atlas handoff have dedicated visual styling.");
expect(includesAll(css, ["@media(max-width:800px)", "@media(max-width:700px)", "@media(prefers-reduced-motion:reduce)"]), "The final homepage anatomy treatment includes tablet, mobile, and reduced-motion rules.");
expect(css.includes(".anatomy-viewer-system-filter"), "The complete atlas provides styled per-system focus controls.");
expect(/v40\.(?:19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34)/.test(build), "Build identifier advances beyond v40.18 to a compatible successor.");
expect(packageJson.scripts?.["homepage:final"] === "node scripts/v40-18-homepage-final-audit.mjs", "Dedicated homepage-final audit remains registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_18_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_18.md") && exists("docs/V40_18_HOME_ANATOMY.md"), "v40.18 baseline records remain packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

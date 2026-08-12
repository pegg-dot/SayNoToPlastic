#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });
const hash = (path) => createHash("sha256").update(readFileSync(join(root, path))).digest("hex");

const evidence = read("app/content/evidence.ts");
const scene = read("app/components/AnatomyScene.tsx");
const journey = read("app/components/BodyJourney.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");
const packageJson = JSON.parse(read("package.json"));

const journeyBlock = evidence.slice(evidence.indexOf("export const homepageJourney"), evidence.indexOf("export const homepageEvidence"));
const slugs = [...journeyBlock.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
const expected = [
  "blood",
  "brain",
  "heart-arteries",
  "pregnancy-placenta",
  "follicular-fluid",
  "endocrine-metabolic-system",
  "kidneys-urinary-system",
  "skin",
  "digestive-system",
  "testicular-tissue",
];
expect(JSON.stringify(slugs) === JSON.stringify(expected), "Homepage anatomy chapter order ends with testicular tissue as chapter 10.");
expect(slugs.length === 10 && slugs.at(-1) === "testicular-tissue", "Testicular tissue is the final of exactly ten anatomy chapters.");
expect(journey.includes("findings.map((item, index)") && journey.includes("String(index + 1).padStart(2, \"0\")"), "Visible chapter numbering and navigation derive from the reordered shared registry.");

expect(scene.includes("focusFor(progress.current, 9)"), "Testicular 3D focus is synchronized to final scene index 9.");
expect(scene.includes('from === 8 && to === 9 && kind === "testes"'), "Testicular layer fades into the final digestive-to-testicular transition.");
expect(scene.includes('kind="endocrine"\n          focusIndex={5}') && scene.includes('kind="kidneys"\n          focusIndex={6}') && scene.includes('kind="body" progress={progress} focusIndex={7}') && scene.includes('kind="digestive"\n          focusIndex={8}'), "Extended context chapters shift to positions 6 through 9 before the final testicular scene.");
expect(scene.includes('{ name: "testis-labeled.png", width: 1185, height: 1007 },\n  ];'), "Fallback testicular reference image is the final fallback scene.");
expect(css.includes('.anatomy-image-fallback[data-scene="9"] .fallback-scene-9'), "Fallback styling follows testicular tissue to scene 10.");
expect((build.includes("v40.28-testicular-final-chapter") || build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate")), "Build identifier advances to v40.28 testicular-final-chapter.");
expect(packageJson.scripts?.["anatomy:order"] === "node scripts/v40-28-testicular-final-audit.mjs", "Dedicated anatomy-order audit is registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

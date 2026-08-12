#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const sha = (path) => createHash("sha256").update(readFileSync(join(root, path))).digest("hex");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const body = read("app/science/body/[slug]/page.tsx");
const guide = read("app/resources/[slug]/page.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");

expect(build.includes("v40.26-inline-navigation-final") || build.includes("v40.27-final-predeploy-polish") || (build.includes("v40.28-testicular-final-chapter") || build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate")), "Build identifier preserves the v40.26 navigation contract or advances to v40.27.");
expect(body.includes("body-system-page-v26"), "Body-system pages opt into the v40.26 navigation scope.");
expect(guide.includes("guide-page-v26"), "Guide pages opt into the v40.26 navigation scope.");
expect(body.includes('const labels = ["Overview", "Why it matters", "Research", "Meaning"]'), "Body-system navigation uses concise labels that fit on one row.");
expect(body.includes("Known / uncertain") && body.includes("References"), "Body-system navigation preserves known/uncertain and references destinations.");
expect(guide.includes("Bottom line") && guide.includes("Evidence") && guide.includes("What to do") && guide.includes("Sources"), "Guide navigation preserves all four reading destinations.");
expect(css.includes("position:static!important") && css.includes("flex-direction:row!important") && css.includes("flex-wrap:nowrap!important"), "v40.26 explicitly neutralizes the legacy sticky/column guide navigation rules.");
expect(css.includes("overflow-x:auto") && css.includes("scrollbar-width:none"), "One-row navigation can scroll horizontally rather than wrap on narrow viewports.");
expect(css.includes(".guide-page-v26 .guide-inline-nav{max-width:760px"), "Guide navigation aligns to the readable article measure.");
expect(css.includes(".body-system-page-v26 .body-system-inline-nav{margin-bottom:44px}"), "Body-system navigation retains clear separation from article content.");
expect(css.includes("scroll-margin-top:112px"), "Anchor targets retain header clearance after navigation links are clicked.");
expect(!/guide-page-v26[\s\S]{0,400}position:sticky/.test(css), "The v40.26 guide navigation scope never reintroduces sticky positioning.");
expect(sha("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_25_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_25.md"), "v40.25 release records remain preserved for rollback provenance.");
expect(exists("V40_26_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_26.md") && exists("docs/V40_26_INLINE_NAVIGATION_FINAL.md"), "v40.26 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

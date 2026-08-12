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
const community = read("app/community/page.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");

expect(build.includes("v40.25-reading-flow-polish") || build.includes("v40.26-inline-navigation-final") || build.includes("v40.27-final-predeploy-polish") || (build.includes("v40.28-testicular-final-chapter") || build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate")), "Build identifier preserves the v40.25 reading-flow release or its v40.26 navigation refinement.");
expect(body.includes('className="body-system-inline-nav"') && body.includes("On this page"), "Body-system articles use a clean inline on-page navigation row.");
expect(!body.includes('className="body-system-toc"'), "Old stacked body-system table-of-contents navigation is removed from the page markup.");
expect(css.includes(".body-system-inline-nav{display:flex") && (css.includes("flex-wrap:wrap") || css.includes("flex-wrap:nowrap!important")), "Body-system navigation remains horizontal, including the v40.26 one-row refinement.");
expect(css.includes("overflow-x:auto") && css.includes(".body-system-inline-nav"), "Body-system navigation remains usable on narrow screens.");

expect(guide.includes('guide-page-v25'), "Guide detail pages preserve the v40.25 reading layout.");
expect(guide.includes('className="guide-inline-nav"') && guide.includes("In this guide"), "Guide navigation is an inline reading aid instead of a stacked index block.");
expect(!guide.includes("guide-evidence-pair") && !guide.includes("guide-actions-v24"), "Card-like paired evidence and action-grid layouts are removed from guide articles.");
expect(guide.includes("guide-prose-section") && guide.includes("guide-prose-copy"), "Guide evidence is rendered as continuous prose sections.");
expect(guide.includes("guide-actions-v25") && guide.includes("What you can do now"), "Guide actions remain present as a linear numbered section.");
expect(guide.includes("guide-deeper-science-v25") && guide.includes("Want the deeper science?"), "Optional science context is reduced to a compact bridge.");
expect(guide.includes("guide-sources-disclosure"), "Sources remain available without interrupting the main reading flow.");
expect(css.includes(".guide-reading-column{max-width:760px"), "Guide body measure is capped for comfortable reading.");
expect(css.includes(".guide-prose-copy p") && css.includes("font:17px/1.72 Georgia,serif"), "Guide paragraphs use a readable long-form line height and size.");
expect(css.includes(".guide-actions-v25 li{display:grid") && !css.includes(".guide-actions-v25 ol{display:grid;grid-template-columns:1fr 1fr"), "Actions are a single vertical reading list rather than a card grid.");
expect(css.includes(".related-guide-links-v25>a{display:grid") && css.includes("min-height:0!important"), "Related guides are compact text rows rather than large cards.");

expect(community.includes("community-practice-v25") && community.includes("Learn one idea. Change one routine. Share it accurately."), "Community practice section uses the shorter v40.25 framing.");
expect(css.includes(".community-v25 .community-practice-v25{padding:56px") && css.includes("font:clamp(38px,4.1vw,58px)"), "Community practice section is materially shorter and less oversized on desktop.");
expect(community.includes("Go deeper only when you want the science behind a question."), "Community guidance is concise rather than duplicating the site curriculum.");

expect(sha("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_24_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_24.md"), "Previous release records remain preserved for rollback provenance.");
expect(exists("V40_25_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_25.md") && exists("docs/V40_25_READING_FLOW_POLISH.md"), "v40.25 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

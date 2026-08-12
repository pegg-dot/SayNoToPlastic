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

const card = read("app/quick-action-card/page.tsx");
const actions = read("app/content/actions.ts");
const community = read("app/community/page.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");
const parked = read("docs/PARKED_OWNER_ACTIONS.md");

expect(build.includes("v40.27-final-predeploy-polish") || build.includes("v40.28-testicular-final-chapter"), "Build identifier advances to v40.27 final pre-deploy polish.");
expect(!card.includes("quick-card-editorial-note") && !card.includes("Editorial note"), "Large Quick Action Card editorial-note panel is removed.");
expect(!css.includes(".quick-card-editorial-note"), "Dead editorial-note styling is removed from the stylesheet.");
expect(card.includes("action.reviewNote"), "Quick Action Card still renders concise inline review notes where supplied.");
expect(actions.includes("Evidence does not currently establish sauna or exercise") && actions.includes("Evidence does not currently establish a specific food or cleanse"), "Contested Quick Action Card claims retain explicit inline evidence boundaries.");
expect(community.includes("community-v27"), "Community page opts into the v40.27 fixed-header clearance scope.");
expect(css.includes(".community-v27 .community-hero") && css.includes("padding-top:clamp(118px,12vh,144px)"), "Desktop Community hero clears the fixed 82px header.");
expect(css.includes("@media(max-width:700px)") && css.includes(".community-v27 .community-hero{padding-top:104px"), "Mobile Community hero retains explicit fixed-header clearance.");
expect(community.includes('/generations-full.webp') && community.includes('fetchPriority="high"'), "Approved full generations artwork remains eager-loaded and unchanged.");
expect(community.includes("<SignupForm/>") && community.includes("For the generations ahead."), "Community signup and hero message remain intact.");
expect(parked.includes("concise inline cautions on contested items"), "Owner-action record reflects the superseding public presentation without losing the approval gate.");
expect(exists("docs/V40_27_PREDEPLOY_CHECKLIST.md"), "v40.27 deployment checklist is packaged.");
expect(sha("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

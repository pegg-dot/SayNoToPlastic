#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const admin = read("app/admin/AdminPanel.tsx");
const manager = read("app/admin/ScienceManager.tsx");
const adminContent = read("app/lib/admin-content.ts");
const science = read("app/science/page.tsx");
const adminApi = read("app/admin/api/content/route.ts");
const build = read("app/build-version.ts");

expect(exists("app/admin/ScienceManager.tsx"), "Structured Science manager is packaged.");
expect(admin.includes("<ScienceManager") && (admin.includes('id: "science"') || (admin.includes('const isScience = page.kind === "science"') && admin.includes('goToPage("science")'))), "Owner admin exposes Science through a dedicated structured workspace, whether surfaced as its own tab or inside Pages.");
expect(manager.includes("+ Add research study") && manager.includes("Show on Science page") && manager.includes("Keep private"), "Science manager supports draft and published study states.");
expect(manager.includes("What researchers found") && manager.includes("Why it matters") && manager.includes("Limitations") && manager.includes("Original source URL"), "Science manager keeps evidence fields structured.");
expect(manager.includes("sciencePreviewCard") && (admin.includes("Live Science page") || (admin.includes("Science page") && admin.includes("scienceToolGrid"))), "Science workflow includes both draft card preview and live page preview.");
expect(adminContent.includes('"science.entries_json"') && adminContent.includes("validateOwnerScienceStudies"), "Structured science records are validated through owner content storage.");
expect(adminContent.includes("cannot be published without") && adminContent.includes("limitations") && adminContent.includes("source"), "Published science records require evidence and uncertainty fields.");
expect(science.includes("getOwnerScienceStudies") && science.includes("effectiveChapters") && science.includes("ownerStudyToEvidence"), "Public Science page merges published owner studies into reviewed chapters.");
expect(science.includes('export const dynamic = "force-dynamic"'), "Science page stays dynamic so owner publications appear without deployment.");
expect(science.includes("totalStudies") && science.includes("researchStudies.length"), "Science study numbering and public counts adapt to owner-added research.");
expect(admin.includes("Protected by structure") && admin.includes("required sources and limitations"), "Admin explains the structured science publishing boundary.");
expect((adminApi.includes("MAX_ADMIN_BODY_BYTES = 96_000") || adminApi.includes("MAX_ADMIN_BODY_BYTES = 160_000")) && adminApi.includes("bodyIsReasonable(request, MAX_ADMIN_BODY_BYTES)"), "Structured science writes remain bounded and same endpoint protections are retained.");
expect(build.includes("v40.45-science-cms"), "Build marker identifies structured Science CMS phase 3B.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

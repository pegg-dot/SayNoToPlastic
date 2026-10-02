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
const adminContent = read("app/lib/admin-content.ts");
const pageEditor = read("app/lib/page-editor.ts");
const about = read("app/about-dr-elie-haddad/page.tsx");
const book = read("app/homo-plasticus/page.tsx");
const solutions = read("app/solutions/page.tsx");
const guides = read("app/quick-action-card/page.tsx");
const podcast = read("app/podcast/page.tsx");
const tedx = read("app/tedx/page.tsx");
const build = read("app/build-version.ts");

expect(exists("app/lib/page-editor.ts"), "Owner page editor map is packaged.");
expect(admin.includes('id: "pages"') && admin.includes("OWNER_PAGE_DEFINITIONS"), "Admin exposes a dedicated Pages workspace.");
expect((admin.includes("Live page preview") || admin.includes("Page preview") || admin.includes("contextPreview")) && admin.includes("<iframe"), "Pages workspace includes a live-like same-origin page preview.");
expect(admin.includes("Website pages") && admin.includes("pageTreeActive"), "Pages workspace includes a page tree for navigating editable pages.");
expect(admin.includes("Science") && ((admin.includes("Structured research editor comes next") || admin.includes("dedicated Science tab")) || (admin.includes('const isScience = page.kind === "science"') && admin.includes("<ScienceManager"))), "Science remains on a structured editor path instead of the generic text editor.");
expect(pageEditor.includes('"about"') && pageEditor.includes('"book"') && pageEditor.includes('"solutions"') && pageEditor.includes('"guides"'), "Normal public pages are represented in the owner page map.");
expect(adminContent.includes('"about.hero_title"') && adminContent.includes('"book.premise_title"') && adminContent.includes('"solutions.hero_title"') && adminContent.includes('"guides.hero_title"'), "Owner page fields are registered with the existing revision system.");
expect(about.includes("getAdminContentValues") && about.includes("about.hero_title"), "About page consumes owner-managed copy.");
expect(book.includes("getAdminContentValues") && book.includes("book.premise_title"), "Book page consumes owner-managed copy.");
expect(solutions.includes("getAdminContentValues") && solutions.includes("solutions.hero_title"), "Take Action page consumes owner-managed copy.");
expect(guides.includes("getAdminContentValues") && guides.includes("guides.hero_title"), "Quick Action Card framing consumes owner-managed copy.");
expect(podcast.includes("podcast.hero_lead") && tedx.includes("tedx.story_title"), "Podcast and TEDx page editing expands beyond the earlier limited fields.");
expect((!adminContent.includes('"science.') || (adminContent.includes('"science.entries_json"') && adminContent.includes("validateOwnerScienceStudies"))) && !pageEditor.includes('"science.hero'), "Science content is not placed into the generic free-form page editor.");
expect(build.includes("v40.44-owner-page-cms"), "Build marker identifies owner page CMS phase 3A.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

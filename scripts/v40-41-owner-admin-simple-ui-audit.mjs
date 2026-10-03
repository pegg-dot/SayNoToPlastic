#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const build = read("app/build-version.ts");
const page = read("app/admin/page.tsx");
const panel = read("app/admin/AdminPanel.tsx");
const css = read("app/admin/admin.module.css");
const metrics = read("app/lib/admin-metrics.ts");
const auth = read("app/lib/admin-auth.ts");
const adminApi = read("app/admin/api/content/route.ts");
const wrangler = read("wrangler.jsonc");

expect(build.includes("v40.41-owner-admin-simple-ui") || build.includes("v40.42-owner-cms-phase-1") || build.includes("v40.43-newsletter-manager"), "Build retains the v40.41 simple owner admin baseline or phase 1 successor.");
expect(((page.includes("Manage the website") || page.includes("Website manager")) && (page.includes("Nothing updates on the live website until you press") || page.includes("Changes only go live"))) || (page.includes("Owner workspace") && panel.includes("Publish change") && panel.includes("Your change is only in this editor until you publish it")), "Entry page tells a non-technical owner exactly how publishing works.");
expect(panel.includes('type SectionId = "dashboard" | "homepage" | "media" | "podcast" | "press"') || (panel.includes('type SectionId = "dashboard" | "pages" | "media" | "press" | "newsletters"') || panel.includes('type SectionId = "dashboard" | "pages" | "science" | "media" | "press" | "newsletters"')), "Admin keeps a small task-based information architecture.");
expect((panel.includes("What do you want to change?") || panel.includes("What do you want to work on?") || panel.includes("What would you like to do?")) && (panel.includes("Edit the homepage") || panel.includes("Edit a website page") || panel.includes("Edit the website")) && (panel.includes("Add an event or appearance") || panel.includes("Add media or an appearance") || panel.includes("Media & appearances")) && panel.includes("Replace TEDx video") && panel.includes("Update podcast") && (panel.includes("Update bio or press contact") || panel.includes("Edit press kit")), "Dashboard starts with the likely owner tasks and common shortcuts.");
expect(panel.includes("editingKey") && panel.includes("pageFieldList") && panel.includes("Click highlighted text in the page to edit it") && panel.includes("This matches the live site") && panel.includes("Publish change"), "Fields are collapsed by default and explain current/live state before editing.");
expect(((panel.includes("Restore original") && panel.includes("Previous versions")) || (panel.includes("Reset to reviewed website text") && panel.includes("History &amp; restore"))) && panel.includes("window.confirm"), "Rollback and destructive actions remain understandable and guarded.");
expect((panel.includes("Draft only") || panel.includes("Keep private")) && panel.includes("Show on site") && (panel.includes("This will stay private after you save") || panel.includes("This item will stay private after you save")), "Event publishing clearly distinguishes private drafts from public items.");
expect(!panel.includes("Editable overrides") && !panel.includes("source default") && !panel.includes("Internal ID:"), "Developer-facing admin jargon is removed from the owner UI.");
expect(panel.includes("Site activity") && panel.includes("See more site stats") && panel.includes("Most viewed pages") && panel.includes("Recent changes"), "Metrics remain available without overwhelming the main task flow.");
expect(metrics.includes("analyticsEvents") && metrics.includes("subscribers") && metrics.includes("contactInquiries"), "Metrics continue to use existing first-party D1 data.");
expect((panel.includes("Protected for safety") && panel.includes("Scientific claims, medical content")) || (panel.includes("Protected by structure") && panel.includes("structured Science editor") && panel.includes("Payments, hosting, passwords, and code cannot be changed")) || (panel.includes("Why this workspace is safe") && panel.includes("Science keeps required sources and limitations") && panel.includes("Payments, hosting, passwords, and code cannot be changed here")), "Scientific publishing remains structured and technical boundaries remain explicit.");
expect(css.includes("background: #f5f3ee") && css.includes(".tabs") && css.includes(".settingSummary") && css.includes(".actionGrid") && css.includes("@media (max-width: 680px)"), "Admin uses the simplified light workspace and responsive layout.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Access remains restricted to the two approved owner identities.");
expect(adminApi.includes("getAdminUser") && adminApi.includes("isSameOrigin(request)"), "Simplified UI does not weaken protected write authorization.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing production database and commerce mode remain preserved.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

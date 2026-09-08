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

expect(build.includes("v40.41-owner-admin-simple-ui"), "Build is marked v40.41 simple owner admin UI.");
expect(page.includes("Manage the website") && page.includes("Nothing updates on the live website until you press"), "Entry page tells a non-technical owner exactly how publishing works.");
expect(panel.includes('type SectionId = "dashboard" | "homepage" | "media" | "podcast" | "press"'), "Admin keeps a small task-based information architecture.");
expect(panel.includes("What do you want to change?") && panel.includes("Edit the homepage") && panel.includes("Add an event or appearance") && panel.includes("Replace the TEDx video") && panel.includes("Update the podcast") && panel.includes("Update bio or press contact"), "Dashboard starts with the five likely owner tasks.");
expect(panel.includes("editingKey") && panel.includes("Click Edit beside only the item you want to change") && panel.includes("Live right now") && panel.includes("Update live site"), "Fields are collapsed by default and explain current/live state before editing.");
expect(panel.includes("Restore original") && panel.includes("Previous versions") && panel.includes("window.confirm"), "Rollback and destructive actions remain understandable and guarded.");
expect(panel.includes("Draft only") && panel.includes("Show on site") && panel.includes("This will stay private after you save"), "Event publishing clearly distinguishes private drafts from public items.");
expect(!panel.includes("Editable overrides") && !panel.includes("source default") && !panel.includes("Internal ID:"), "Developer-facing admin jargon is removed from the owner UI.");
expect(panel.includes("Site activity") && panel.includes("See more site stats") && panel.includes("Most viewed pages") && panel.includes("Recent changes"), "Metrics remain available without overwhelming the main task flow.");
expect(metrics.includes("analyticsEvents") && metrics.includes("subscribers") && metrics.includes("contactInquiries"), "Metrics continue to use existing first-party D1 data.");
expect(panel.includes("Protected for safety") && panel.includes("Scientific claims, medical content, payments, hosting, passwords, and code cannot be changed"), "Non-editable scientific and technical boundaries remain explicit.");
expect(css.includes("background: #f5f3ee") && css.includes(".tabs") && css.includes(".settingSummary") && css.includes(".actionGrid") && css.includes("@media (max-width: 680px)"), "Admin uses the simplified light workspace and responsive layout.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Access remains restricted to the two approved owner identities.");
expect(adminApi.includes("getAdminUser") && adminApi.includes("isSameOrigin(request)"), "Simplified UI does not weaken protected write authorization.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing production database and commerce mode remain preserved.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

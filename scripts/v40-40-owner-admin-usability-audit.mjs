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
const schema = read("db/schema.ts");
const wrangler = read("wrangler.jsonc");
const mailchimpEvents = read("app/lib/mailchimp-events.ts");

expect(build.includes("v40.40-owner-admin-usability-metrics") || build.includes("v40.41-owner-admin-simple-ui") || build.includes("v40.42-owner-cms-phase-1") || build.includes("v40.43-newsletter-manager"), "Build retains the v40.40 usability/metrics baseline or a validated successor.");
expect(((page.includes("Manage the website") || page.includes("Website manager")) && (page.includes("Nothing updates on the live website") || page.includes("Changes only go live")) && page.includes("Private")) || (page.includes("Owner workspace") && page.includes("Changes are protected by revision history and owner-only access")), "Owner landing copy explains the workspace in plain language.");
expect((panel.includes('type SectionId = "dashboard" | "homepage" | "media" | "podcast" | "press"') || panel.includes('type SectionId = "dashboard" | "pages" | "media" | "press" | "newsletters"') || panel.includes('type SectionId = "dashboard" | "pages" | "science" | "media" | "press" | "newsletters"')) && (panel.includes("What do you want to change?") || panel.includes("What do you want to work on?") || panel.includes("What would you like to do?")), "Admin opens to a task-oriented dashboard.");
expect((panel.includes("Edit the homepage") || panel.includes("Edit a website page") || panel.includes("Edit the website")) && (panel.includes("Add an event or appearance") || panel.includes("Add media or an appearance") || panel.includes("Media & appearances")) && panel.includes("Replace TEDx video") && panel.includes("Update podcast") && (panel.includes("Update bio or press contact") || panel.includes("Edit press kit")), "Dashboard exposes the owner's likely tasks directly.");
expect((panel.includes("Update live site") && panel.includes("Restore original") && panel.includes("Previous versions")) || (panel.includes("Publish change") && panel.includes("Reset to reviewed website text") && panel.includes("History &amp; restore")), "Editing language clearly explains publishing and rollback.");
expect(panel.includes("Show on site") && (panel.includes("Draft only") || panel.includes("Keep private")) && (panel.includes("This will stay private after you save") || panel.includes("This item will stay private after you save")), "Event and appearance publishing clearly distinguishes drafts from public items.");
expect(!panel.includes("Internal ID:"), "Internal media IDs are hidden from the owner UI.");
expect(panel.includes("window.confirm") && panel.includes("Remove"), "Removing an appearance requires an explicit confirmation step.");
expect(panel.includes("Site activity") && panel.includes("Visitors") && panel.includes("Newsletter subscribers") && panel.includes("Contact requests") && panel.includes("Book checkout starts") && panel.includes("Newsletter connection"), "Dashboard includes owner-relevant site and audience metrics.");
expect(panel.includes("only count visitors who allowed anonymous analytics"), "Dashboard clearly identifies consent-limited traffic metrics.");
expect(metrics.includes("analyticsEvents") && metrics.includes("subscribers") && metrics.includes("contactInquiries") && metrics.includes("count(distinct") && metrics.includes("topPages30d"), "Metrics are derived from existing first-party analytics, subscriber, and contact data.");
expect(metrics.includes('eq(analyticsEvents.eventName, "page_view")') && metrics.includes('eq(analyticsEvents.eventName, "begin_checkout")'), "Traffic and checkout-interest metrics use existing allowlisted analytics events.");
expect(!metrics.includes("subscribers.email") && !metrics.includes("contactInquiries.email") && !metrics.includes("contactInquiries.name"), "Owner metrics aggregate counts without exposing subscriber or inquiry PII.");
expect(schema.includes('sqliteTable("analytics_events"') && schema.includes('sqliteTable("subscribers"') && schema.includes('sqliteTable("contact_inquiries"'), "Metrics reuse existing D1 tables and require no new schema migration.");
expect(panel.includes("Most viewed pages") && panel.includes("Recent changes") && (panel.includes("View homepage") || panel.includes("Live page preview") || panel.includes("Page preview") || panel.includes("contextPreview")) && (panel.includes("View Events & Media") || panel.includes("Open live page") || panel.includes("View live")), "Dashboard includes useful page insights, change history, and live previews.");
expect(css.includes("actionGrid") && css.includes("metricGrid") && css.includes("tabs") && css.includes("@media (max-width: 680px)"), "Owner dashboard has dedicated responsive UI styling.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Admin access remains limited to the two approved owner identities.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"PUBLIC_SITE_URL": "https://saynotoplastic.com"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing production database, origin, and commerce mode remain preserved.");
expect(mailchimpEvents.includes('FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup"'), "Mailchimp welcome-event integration remains intact.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

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

expect(build.includes("v40.40-owner-admin-usability-metrics"), "Build is marked v40.40 owner admin usability and metrics.");
expect(page.includes("Welcome back.") && page.includes("Choose a task below") && page.includes("cannot accidentally edit the science"), "Owner landing copy explains the workspace in plain language.");
expect(panel.includes('type SectionId = "dashboard" | "homepage" | "media" | "podcast" | "press"') && panel.includes("What would you like to do today?"), "Admin opens to a task-oriented dashboard.");
expect(panel.includes("Change the homepage message") && panel.includes("Add an event or appearance") && panel.includes("Replace the TEDx video") && panel.includes("Update Beyond Plastic") && panel.includes("Update biography or contact"), "Dashboard exposes the owner's likely tasks directly.");
expect(panel.includes("Save to live site") && panel.includes("Restore original") && panel.includes("Undo or view previous versions"), "Editing language clearly explains publishing and rollback.");
expect(panel.includes("Show on site") && panel.includes("This item stays private after you save") && panel.includes("Save media changes"), "Event and appearance publishing clearly distinguishes drafts from public items.");
expect(!panel.includes("Internal ID:"), "Internal media IDs are hidden from the owner UI.");
expect(panel.includes("window.confirm") && panel.includes("Remove item"), "Removing an appearance requires an explicit confirmation step.");
expect(panel.includes("How the site is doing") && panel.includes("Visitors") && panel.includes("Page views") && panel.includes("Newsletter subscribers") && panel.includes("Contact requests") && panel.includes("Book checkout starts") && panel.includes("Newsletter sync"), "Dashboard includes owner-relevant site and audience metrics.");
expect(panel.includes("only include people who chose anonymous analytics") && panel.includes("Newsletter and contact totals come directly from the site database"), "Dashboard clearly distinguishes consented analytics from exact operational totals.");
expect(metrics.includes("analyticsEvents") && metrics.includes("subscribers") && metrics.includes("contactInquiries") && metrics.includes("count(distinct") && metrics.includes("topPages30d"), "Metrics are derived from existing first-party analytics, subscriber, and contact data.");
expect(metrics.includes('eq(analyticsEvents.eventName, "page_view")') && metrics.includes('eq(analyticsEvents.eventName, "begin_checkout")'), "Traffic and checkout-interest metrics use existing allowlisted analytics events.");
expect(!metrics.includes("subscribers.email") && !metrics.includes("contactInquiries.email") && !metrics.includes("contactInquiries.name"), "Owner metrics aggregate counts without exposing subscriber or inquiry PII.");
expect(schema.includes('sqliteTable("analytics_events"') && schema.includes('sqliteTable("subscribers"') && schema.includes('sqliteTable("contact_inquiries"'), "Metrics reuse existing D1 tables and require no new schema migration.");
expect(panel.includes("Most viewed pages") && panel.includes("Recent site changes") && panel.includes("Open homepage") && panel.includes("Open Events & Media"), "Dashboard includes useful page insights, change history, and live previews.");
expect(css.includes("metricsGrid") && css.includes("quickGrid") && css.includes("statusStrip") && css.includes("@media (max-width: 760px)"), "Owner dashboard has dedicated responsive UI styling.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Admin access remains limited to the two approved owner identities.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"PUBLIC_SITE_URL": "https://saynotoplastic.com"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing production database, origin, and commerce mode remain preserved.");
expect(mailchimpEvents.includes('FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup"'), "Mailchimp welcome-event integration remains intact.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

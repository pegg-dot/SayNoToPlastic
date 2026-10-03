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
const manager = read("app/admin/NewsletterManager.tsx");
const newsletterLib = read("app/lib/newsletters.ts");
const mailchimp = read("app/lib/newsletter-mailchimp.ts");
const archive = read("app/newsletters/page.tsx");
const importRoute = read("app/admin/api/newsletters/route.ts");
const detail = read("app/newsletters/[slug]/page.tsx");
const schema = read("db/newsletter-schema.ts");
const migration = read("drizzle/0008_newsletters.sql");
const build = read("app/build-version.ts");

expect(exists("app/admin/api/newsletters/route.ts") && exists("app/admin/api/newsletters/[id]/route.ts") && exists("app/admin/api/newsletters/[id]/mailchimp/route.ts"), "Owner newsletter import, publish, and Mailchimp API routes are packaged.");
expect(admin.includes('"newsletters"') && admin.includes("<NewsletterManager />"), "Owner website manager exposes a dedicated newsletters section.");
expect(manager.includes('accept=".docx') && (manager.includes("Preview ↗") || manager.includes("Preview issue ↗")) && manager.includes("Publish to website") && manager.includes("Create Mailchimp draft"), "Newsletter manager follows DOCX → preview → publish → Mailchimp draft workflow.");
expect((manager.includes("newsletterWorkflow") && manager.includes("Edit title &amp; archive description")) || (manager.includes("objectProgress") && manager.includes("Next step") && manager.includes("More actions")), "Newsletter manager presents a clearer step-by-step workflow with secondary details collapsed.");
expect(manager.includes("Delete") && newsletterLib.includes("deleteNewsletter") && read("app/admin/api/newsletters/[id]/route.ts").includes("deleteNewsletter"), "Owner can remove an imported newsletter with guarded website-manager deletion.");
expect(newsletterLib.includes("unzipSync") && newsletterLib.includes("word/document.xml") && newsletterLib.includes("Only Word") === false, "DOCX parser reads Word document XML without a server-side office dependency.");
expect(newsletterLib.includes("imageCount") && importRoute.includes("embedded image"), "Embedded Word images are detected and surfaced as an explicit import warning.");
expect(schema.includes("mailchimpCampaignId") && migration.includes("mailchimp_campaign_id") && migration.includes("newsletters_slug_unique"), "Newsletter persistence includes publication state and Mailchimp draft tracking.");
expect(archive.includes("Latest Field Notes") && detail.includes("dangerouslySetInnerHTML"), "Public Field Notes archive and individual issue pages are packaged.");
expect(mailchimp.includes("/3.0/campaigns") && mailchimp.includes("/content") && mailchimp.includes("DrElieBeyondPlastic@gmail.com"), "Mailchimp integration creates a regular campaign draft and attaches rendered newsletter HTML.");
expect(mailchimp.includes("*|UNSUB|*") && mailchimp.includes("*|LIST:ADDRESS|*"), "Mailchimp draft HTML retains required unsubscribe and audience-address merge tags.");
expect(build.includes("v40.43-newsletter-manager"), "Build marker identifies the newsletter manager release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

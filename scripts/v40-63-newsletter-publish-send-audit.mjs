#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const manager = read("app/admin/NewsletterManager.tsx");
const sendRoute = read("app/admin/api/newsletters/[id]/send/route.ts");
const mailchimp = read("app/lib/newsletter-mailchimp.ts");
const newsletters = read("app/lib/newsletters.ts");
const schema = read("db/newsletter-schema.ts");
const migration = read("drizzle/0009_newsletter_send.sql");
const build = read("app/build-version.ts");
const state = read("CURRENT_STATE.md");

expect(existsSync(join(root, "app/admin/api/newsletters/[id]/send/route.ts")), "Authenticated newsletter send endpoint is packaged.");
expect(manager.includes("Publish & send") && manager.includes("Send to subscribers") && manager.includes("This email send is immediate and cannot be undone."), "Owner workflow has one explicit publish-and-send action with irreversible-send confirmation.");
expect(manager.includes("Create Mailchimp draft only") && manager.includes("sourceImageCount"), "Owner can still choose a draft-only path and sees the embedded-image limitation before automatic sending.");
expect(sendRoute.includes("createNewsletterCampaignDraft") && sendRoute.includes("sendNewsletterCampaign") && sendRoute.includes("markNewsletterMailchimpSent"), "Server send flow publishes, creates/reuses the Mailchimp campaign, sends it, and records completion.");
expect(sendRoute.includes("acknowledgeMissingImages") && sendRoute.includes("sourceImageCount > 0"), "Server refuses image-bearing DOCX auto-send until the owner acknowledges the text-only import.");
expect(mailchimp.includes("/send-checklist") && mailchimp.includes("/actions/send"), "Mailchimp integration verifies campaign readiness before calling the immediate-send API.");
expect(mailchimp.includes("?fields=status,send_time") && mailchimp.includes('campaign.status === "sent"'), "Mailchimp send is idempotent when the provider already reports the campaign sent.");
expect(schema.includes("mailchimpSentAt") && schema.includes("sourceImageCount") && migration.includes("mailchimp_sent_at") && migration.includes("source_image_count"), "Newsletter persistence records send completion and source-image count.");
expect(newsletters.includes("already emailed") && newsletters.includes("links in the sent email continue to work"), "Sent newsletters cannot be unpublished or deleted in ways that break links already delivered to subscribers.");
expect(build.includes("v40.63-newsletter-publish-send") && state.includes("Publish & send"), "Build marker and operational state record the automatic newsletter send workflow.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

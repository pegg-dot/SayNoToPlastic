#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const build = read("app/build-version.ts");
const adminContent = read("app/lib/admin-content.ts");
const adminPanel = read("app/admin/AdminPanel.tsx");
const adminPage = read("app/admin/page.tsx");
const home = read("app/page.tsx");
const media = read("app/media/page.tsx");
const mediaCss = read("app/media/media.module.css");
const podcast = read("app/podcast/page.tsx");
const pressKit = read("app/media/press-kit/page.tsx");
const auth = read("app/lib/admin-auth.ts");
const wrangler = read("wrangler.jsonc");
const mailchimpEvents = read("app/lib/mailchimp-events.ts");

expect(build.includes("v40.39-owner-editorial-admin"), "Build is marked v40.39 owner editorial admin.");
expect(adminContent.includes('"home.hero_headline"') && adminContent.includes('"home.media_heading"') && adminContent.includes('"home.newsletter_heading"'), "Homepage owner-editable fields are registered.");
expect(adminContent.includes('"media.hero_heading"') && adminContent.includes('"media.entries_json"') && adminContent.includes("validateOwnerMediaItems"), "Events & Media includes validated structured owner-managed appearances.");
expect(adminContent.includes('"podcast.series_heading"') && adminContent.includes('"podcast.series_body"'), "Podcast series copy is owner-editable.");
expect(adminContent.includes('"press.short_bio"') && adminContent.includes('"press.long_bio"') && adminContent.includes('"press.contact_email"'), "Press biography and contact fields are owner-editable.");
expect(adminContent.includes("Keep the owner-managed media list to 20 items or fewer") && adminContent.includes('url.protocol !== "https:"') && adminContent.includes("validateEmail"), "Owner inputs retain bounded-list, HTTPS, and email validation.");
expect(adminContent.includes("db.batch([revisionInsert, currentUpsert])") && adminContent.includes("AdminContentConflict"), "New editorial fields inherit atomic history and optimistic concurrency protections.");
expect(adminPanel.includes('type SectionId = "overview" | "homepage" | "media" | "podcast" | "press"') && adminPanel.includes("Owner workspace"), "Admin is organized around owner workflows rather than raw configuration.");
expect(adminPanel.includes("+ Add appearance") && adminPanel.includes("Published") && adminPanel.includes("Draft") && adminPanel.includes("Save appearances"), "Admin supports draft/published appearance management.");
expect(adminPanel.includes("Science stays reviewed") && adminPage.includes("Scientific evidence, medical claims"), "Admin clearly keeps scientific and medical content outside owner self-publishing.");
expect(home.includes("getAdminContentValues") && home.includes('ownerCopy["home.hero_headline"]') && home.includes('ownerCopy["home.newsletter_heading"]'), "Homepage consumes owner-managed copy with source fallbacks.");
expect(media.includes("getOwnerMediaItems") && media.includes("publishedMedia") && media.includes("Latest appearances &amp; events") && mediaCss.includes("ownerTimelineGrid"), "Events & Media publishes only owner-marked appearances in a dedicated timeline.");
expect(media.includes('ownerCopy["media.hero_heading"]') && media.includes('ownerCopy["press.short_bio"]'), "Events & Media consumes owner-managed hero copy and press biography.");
expect(podcast.includes('ownerCopy["podcast.series_label"]') && podcast.includes('ownerCopy["podcast.series_heading"]') && podcast.includes('ownerCopy["podcast.series_body"]'), "Podcast page consumes owner-managed current-series copy.");
expect(pressKit.includes('ownerCopy["press.short_bio"]') && pressKit.includes('ownerCopy["press.long_bio"]') && pressKit.includes('ownerCopy["press.contact_email"]'), "Press kit consumes owner-managed biography and contact data.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Admin access remains restricted to the two approved owner identities.");
expect(!adminContent.includes('"science.') && !adminContent.includes('"medical.'), "No science or medical content keys were added to owner self-publishing.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing production database and commerce mode remain preserved.");
expect(mailchimpEvents.includes('FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup"'), "Mailchimp welcome-event integration remains intact.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

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
const adminApi = read("app/admin/api/content/route.ts");
const home = read("app/page.tsx");
const media = read("app/media/page.tsx");
const mediaCss = read("app/media/media.module.css");
const podcast = read("app/podcast/page.tsx");
const pressKit = read("app/media/press-kit/page.tsx");
const tedx = read("app/tedx/page.tsx");
const auth = read("app/lib/admin-auth.ts");
const setup = read("OWNER_ADMIN_SETUP.md");
const wrangler = read("wrangler.jsonc");
const mailchimpEvents = read("app/lib/mailchimp-events.ts");

expect(build.includes("v40.39-owner-editorial-admin") || build.includes("v40.40-owner-admin-usability-metrics"), "Build retains the v40.39 owner editorial baseline or a validated successor.");
expect(adminContent.includes('"home.hero_headline"') && adminContent.includes('"home.media_heading"') && adminContent.includes('"home.newsletter_heading"'), "Homepage owner-editable fields are registered.");
expect(adminContent.includes('"media.hero_heading"') && adminContent.includes('"media.entries_json"') && adminContent.includes("validateOwnerMediaItems"), "Events & Media includes validated structured owner-managed appearances.");
expect(adminContent.includes('"podcast.series_heading"') && adminContent.includes('"podcast.series_body"'), "Podcast series copy is owner-editable.");
expect(adminContent.includes('"press.short_bio"') && adminContent.includes('"press.long_bio"') && adminContent.includes('"press.contact_email"'), "Press biography and contact fields are owner-editable.");
expect(adminContent.includes("Keep the owner-managed media list to 20 items or fewer") && adminContent.includes('url.protocol !== "https:"') && adminContent.includes("validateEmail"), "Owner inputs retain bounded-list, HTTPS, and email validation.");
expect(adminApi.includes("MAX_ADMIN_BODY_BYTES = 32_000") && adminApi.includes("bodyIsReasonable(request, MAX_ADMIN_BODY_BYTES)"), "Admin write payloads remain bounded while supporting structured media lists.");
expect(adminContent.includes("db.batch([revisionInsert, currentUpsert])") && adminContent.includes("AdminContentConflict"), "New editorial fields inherit atomic history and optimistic concurrency protections.");
expect(adminPanel.includes('type SectionId = "dashboard" | "homepage" | "media" | "podcast" | "press"') && adminPanel.includes("Site manager"), "Admin remains organized around owner workflows rather than raw configuration.");
expect(adminPanel.includes("+ Add new item") && adminPanel.includes("Show on site") && adminPanel.includes("Draft") && adminPanel.includes("Save media changes"), "Admin supports draft/published appearance management with owner-friendly language.");
expect(adminPanel.includes("Scientific and medical content stays protected") && adminPage.includes("cannot accidentally edit the science"), "Admin clearly keeps scientific and medical content outside owner self-publishing.");
expect(home.includes('export const dynamic = "force-dynamic"') && media.includes('export const dynamic = "force-dynamic"') && podcast.includes('export const dynamic = "force-dynamic"') && pressKit.includes('export const dynamic = "force-dynamic"') && tedx.includes('export const dynamic = "force-dynamic"'), "All public surfaces backed by owner content render dynamically so saved changes are not baked into a deploy.");
expect(home.includes("getAdminContentValues") && home.includes('ownerCopy["home.hero_headline"]') && home.includes('ownerCopy["home.newsletter_heading"]'), "Homepage consumes owner-managed copy with source fallbacks.");
expect(media.includes("getOwnerMediaItems") && media.includes("publishedMedia") && media.includes("Latest appearances &amp; events") && mediaCss.includes("ownerTimelineGrid"), "Events & Media publishes only owner-marked appearances in a dedicated timeline.");
expect(media.includes('ownerCopy["media.hero_heading"]') && media.includes('ownerCopy["press.short_bio"]'), "Events & Media consumes owner-managed hero copy and press biography.");
expect(podcast.includes('ownerCopy["podcast.series_label"]') && podcast.includes('ownerCopy["podcast.series_heading"]') && podcast.includes('ownerCopy["podcast.series_body"]'), "Podcast page consumes owner-managed current-series copy.");
expect(pressKit.includes('ownerCopy["press.short_bio"]') && pressKit.includes('ownerCopy["press.long_bio"]') && pressKit.includes('ownerCopy["press.contact_email"]'), "Press kit consumes owner-managed biography and contact data.");
expect(tedx.includes("getEffectiveTedxEntry") && tedx.includes('export const dynamic = "force-dynamic"'), "TEDx page reads the owner-managed video/status live.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Admin access remains restricted to the two approved owner identities.");
expect(!adminContent.includes('"science.') && !adminContent.includes('"medical.'), "No science or medical content keys were added to owner self-publishing.");
expect(setup.includes("expanded v40.39 editorial workspace") && (setup.includes("does **not** need another schema migration") || setup.includes("neither needs another schema migration")), "Deployment guide documents that later owner-admin releases reuse the existing owner-admin tables.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing production database and commerce mode remain preserved.");
expect(mailchimpEvents.includes('FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup"'), "Mailchimp welcome-event integration remains intact.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

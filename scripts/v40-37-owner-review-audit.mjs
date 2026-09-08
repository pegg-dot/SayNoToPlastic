#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const build = read("app/build-version.ts");
const chrome = read("app/components/SiteChrome.tsx");
const home = read("app/page.tsx");
const podcast = read("app/podcast/page.tsx");
const publications = read("app/content/publications.ts");
const mediaItems = read("app/content/media-items.json");
const tedx = read("app/tedx/page.tsx");
const media = read("app/media/page.tsx");
const community = read("app/community/page.tsx");
const subscribe = read("app/api/subscribe/route.ts");
const audience = read("app/lib/audience-service.ts");
const mailchimpEvents = read("app/lib/mailchimp-events.ts");
const privacy = read("app/privacy-policy/page.tsx");
const sitemap = read("app/sitemap.ts");
const wrangler = read("wrangler.jsonc");
const env = read(".env.example");

expect(build.includes("v40.37.1-mailchimp-welcome-event") || build.includes("v40.38-owner-admin") || build.includes("v40.39-owner-editorial-admin"), "Build retains the v40.37.1 owner-review/Mailchimp baseline or a validated successor.");
expect(existsSync(join(root, "V40_37_CHANGE_MANIFEST.md")), "v40.37 owner-review manifest is packaged.");
expect(chrome.includes('{ href: "/science", label: "The Science" }') && chrome.includes('{ href: "/solutions", label: "Take Action" }') && chrome.includes('{ href: "/quick-action-card", label: "Guides" }') && chrome.includes('{ href: "/podcast", label: "Podcast" }') && chrome.includes('{ href: "/tedx", label: "TEDx Talk" }'), "Primary navigation includes Science, Take Action, 12-step Guides, Podcast, and TEDx.");
expect(chrome.indexOf('{ href: "/solutions", label: "Take Action" }') < chrome.indexOf('{ href: "/quick-action-card", label: "Guides" }'), "Guides appears immediately after Take Action in the primary navigation definition.");
expect(!media.includes("High-resolution owner-approved media assets are still parked"), "Owner-requested Events & Media parked-assets sentence is removed.");
expect(mediaItems.includes("https://www.youtube.com/shorts/6juPFhIh68I") && mediaItems.includes('"youtubeId": "6juPFhIh68I"'), "Media registry uses the owner-supplied replacement temporary TEDx recording.");
expect(publications.includes('officialVideoUrl: "https://www.youtube.com/shorts/6juPFhIh68I"') && publications.includes('officialYoutubeId: "6juPFhIh68I"'), "TEDx compatibility registry uses the replacement URL and ID.");
expect(!mediaItems.includes("MVnY2vw99SY") && !publications.includes("MVnY2vw99SY"), "Superseded TEDx temporary recording ID is removed from current registries.");
expect(tedx.includes("temporary audience recording") && tedx.includes("official TEDx video has not yet been released"), "TEDx page still labels the replacement as temporary until the official release arrives.");
expect(home.includes("No confirmation email is required") && chrome.includes("No confirmation email is required") && community.includes("No confirmation email is required") && media.includes("No confirmation email is required"), "Field Notes signup surfaces clearly explain single-opt-in success behavior.");
expect(subscribe.includes("syncAudienceSubscriber") && subscribe.includes('program === "field-notes"') && wrangler.includes('"AUDIENCE_PROVIDER": "mailchimp"'), "Field Notes remains wired to Mailchimp.");
expect(audience.includes('status_if_new: "subscribed"'), "Mailchimp adapter remains single opt-in for new contacts.");
expect(mailchimpEvents.includes('FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup"') && mailchimpEvents.includes('/events`') && mailchimpEvents.includes('method: "POST"'), "Field Notes has an explicit Mailchimp Event API trigger for the welcome automation.");
expect(subscribe.includes("emitFieldNotesSignupEvent") && subscribe.includes("welcomeTrigger"), "New Field Notes signups record the Mailchimp welcome trigger without making signup depend on email delivery.");
expect(wrangler.includes('"required"') && wrangler.includes('"MAILCHIMP_API_KEY"') && wrangler.includes('"MAILCHIMP_AUDIENCE_ID"'), "Wrangler continues to require both Mailchimp secrets.");
expect(!/"MAILCHIMP_API_KEY"\s*:\s*"[^\"]+"/.test(wrangler) && !/"MAILCHIMP_AUDIENCE_ID"\s*:\s*"[^\"]+"/.test(wrangler), "No Mailchimp secret values are committed.");
expect(env.includes("MAILCHIMP_API_KEY=") && env.includes("MAILCHIMP_AUDIENCE_ID="), "Mailchimp secret names remain documented without values.");
expect(publications.includes('artwork: "/podcast/beyond-plastic-artwork.webp"') && existsSync(join(root, "public/podcast/beyond-plastic-artwork.webp")), "Correct Podcast artwork remains packaged and referenced.");
expect(!podcast.includes("Spotify and Apple Podcasts are live platform-search links") && !podcast.includes("Find Beyond Plastic") && !podcast.includes("Open Beyond Plastic"), "Podcast platform small print remains removed.");
expect(sitemap.includes('"/podcast"') && sitemap.includes('routes.push("/tedx")'), "Podcast and TEDx remain represented in the sitemap.");
expect(privacy.includes("Mailchimp may process subscriber") && privacy.includes("Mailchimp for newsletter audience"), "Privacy policy still discloses Mailchimp processing.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"PUBLIC_SITE_URL": "https://saynotoplastic.com"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing D1, production origin, and WooCommerce mode remain preserved.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

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
const tedx = read("app/tedx/page.tsx");
const subscribe = read("app/api/subscribe/route.ts");
const audience = read("app/lib/audience-service.ts");
const privacy = read("app/privacy-policy/page.tsx");
const sitemap = read("app/sitemap.ts");
const wrangler = read("wrangler.jsonc");
const env = read(".env.example");

expect(build.includes("v40.36-final-client-pass"), "Build is marked v40.36 final client pass.");
expect(existsSync(join(root, "V40_36_CHANGE_MANIFEST.md")), "v40.36 change manifest is packaged.");
expect(chrome.includes('{ href: "/podcast", label: "Podcast" }') && chrome.includes('{ href: "/tedx", label: "TEDx Talk" }'), "Podcast and TEDx are first-class primary navigation items.");
expect(home.includes("Explore the podcast") && home.includes("Watch the talk"), "Home includes integrated Podcast and TEDx features.");
expect(podcast.includes("Beyond Plastic is a podcast about the ideas that shape our health, our lives, and ultimately, our humanity."), "Podcast preserves approved Beyond Plastic positioning.");
expect(!podcast.includes("Spotify and Apple Podcasts are live platform-search links"), "Requested podcast platform fine print is removed.");
expect(publications.includes('artwork: "/podcast/beyond-plastic-artwork.webp"'), "Podcast points to corrected supplied artwork.");
expect(existsSync(join(root, "public/podcast/beyond-plastic-artwork.webp")), "Corrected podcast artwork is prepared for the build.");
expect(tedx.includes("The Invisible Inheritance of Nanoplastics") && tedx.includes("What if one of the greatest environmental stories"), "Dedicated TEDx page contains Dr. Haddad's supplied content.");
expect(tedx.includes("temporary audience recording"), "TEDx page transparently labels the temporary recording until the official release arrives.");
expect(sitemap.includes('"/podcast"') && sitemap.includes('routes.push("/tedx")'), "Podcast and TEDx are represented in the sitemap.");
expect(home.includes("<SignupForm") && chrome.includes("<SignupForm"), "Newsletter capture is visible on Home and the global footer.");
expect(subscribe.includes("audienceConfiguration") && subscribe.includes("syncAudienceSubscriber") && !subscribe.includes("newsletter_coming_soon"), "Newsletter API is active and syncs the configured audience provider.");
expect(wrangler.includes('"AUDIENCE_PROVIDER": "mailchimp"') && env.includes("AUDIENCE_PROVIDER=mailchimp"), "Deployment configuration selects Mailchimp without embedding credentials.");
expect(audience.includes("mailchimpServerPrefix") && audience.includes("status_if_new: \"subscribed\""), "Mailchimp adapter can derive its server prefix and currently uses immediate subscription.");
expect(privacy.includes("Mailchimp may process subscriber") && privacy.includes("Mailchimp for newsletter audience"), "Privacy policy discloses Mailchimp processing.");
expect(wrangler.includes('"required"') && wrangler.includes('"MAILCHIMP_API_KEY"') && wrangler.includes('"MAILCHIMP_AUDIENCE_ID"'), "Wrangler blocks deployment until both Mailchimp secrets are configured.");
expect(!/"MAILCHIMP_API_KEY"\s*:\s*"[^\"]+"/.test(wrangler) && !/"MAILCHIMP_AUDIENCE_ID"\s*:\s*"[^\"]+"/.test(wrangler), "No Mailchimp secret values are committed in Wrangler configuration.");
expect(env.includes("MAILCHIMP_API_KEY=") && env.includes("MAILCHIMP_AUDIENCE_ID="), "Mailchimp secret names are documented without values.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"PUBLIC_SITE_URL": "https://saynotoplastic.com"'), "Existing Cloudflare D1 and production origin remain preserved.");
expect(wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing WooCommerce production commerce mode remains preserved.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

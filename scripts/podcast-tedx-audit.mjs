#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(root, p), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const chrome = read("app/components/SiteChrome.tsx");
const home = read("app/page.tsx");
const podcast = read("app/podcast/page.tsx");
const pub = read("app/content/publications.ts");
const tedx = read("app/tedx/page.tsx");
const sitemap = read("app/sitemap.ts");
const subscribe = read("app/api/subscribe/route.ts");
const community = read("app/community/page.tsx");
const media = read("app/media/page.tsx");
const privacy = read("app/privacy-policy/page.tsx");
const wrangler = read("wrangler.jsonc");

expect(existsSync(join(root, "public/podcast/beyond-plastic-artwork.webp")), "Correct Beyond Plastic artwork WebP is packaged.");
expect(pub.includes('artwork: "/podcast/beyond-plastic-artwork.webp"'), "Podcast registry uses the corrected artwork.");
expect(chrome.includes('label: "Podcast"') && chrome.includes('label: "TEDx Talk"') && chrome.includes('label: "The Science"') && chrome.includes('label: "Take Action"'), "Primary navigation exposes Podcast and TEDx alongside Science and Action.");
expect(home.includes("A podcast exploring the ideas that shape our health, our lives, and ultimately, our humanity.") && home.includes("Explore the podcast"), "Homepage carries the approved podcast feature.");
expect(podcast.includes("Beyond Plastic is a podcast about the ideas that shape our health, our lives, and ultimately, our humanity.") && podcast.includes("Future series will venture beyond plastic"), "Podcast page preserves supplied copy.");
expect(!podcast.match(/episode\s+[0-9]/i), "Podcast page does not duplicate an episode feed.");
expect(pub.includes('name: "Spotify"') && pub.includes('name: "Apple Podcasts"') && pub.includes('name: "YouTube"'), "Spotify, Apple Podcasts, and YouTube are represented.");
expect(!podcast.includes("Spotify and Apple Podcasts are live platform-search links"), "Requested podcast platform explanatory fine print is removed.");
expect(!podcast.includes("Find Beyond Plastic") && !podcast.includes("Open Beyond Plastic"), "Requested small platform sublabels are removed beneath Spotify, Apple Podcasts, and YouTube.");
expect(tedx.includes("The Invisible Inheritance of Nanoplastics") && tedx.includes("What if one of the greatest environmental stories") && tedx.includes("temporary audience recording") && !tedx.includes("notFound()"), "Dedicated TEDx page is public now with supplied copy and transparent temporary-video status.");
expect(chrome.includes('{ href: "/tedx", label: "TEDx Talk" }') && home.includes('href="/tedx"') && sitemap.includes('"/tedx"'), "TEDx is visible in navigation, homepage, and sitemap.");
expect(sitemap.includes('"/podcast"'), "Podcast is included in the sitemap.");
expect(home.includes("<SignupForm") && chrome.includes("<SignupForm") && community.includes("<SignupForm") && media.includes("<SignupForm"), "Newsletter capture is visible on Home, footer, Community, and Events & Media.");
expect(subscribe.includes("syncAudienceSubscriber") && subscribe.includes('program === "field-notes"') && wrangler.includes('"AUDIENCE_PROVIDER": "mailchimp"'), "Field Notes subscriber capture is wired to Mailchimp without requiring transactional email.");
expect(privacy.includes("Mailchimp may process subscriber") && privacy.includes("Mailchimp for newsletter audience"), "Privacy policy discloses Mailchimp newsletter processing.");

for (const c of checks) console.log(`[${c.ok ? "PASS" : "FAIL"}] ${c.label}`);
const failed = checks.filter((c) => !c.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

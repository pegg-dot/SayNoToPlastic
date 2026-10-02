#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const build = read("app/build-version.ts");
const tedx = read("app/tedx/page.tsx");
const media = read("app/media/page.tsx");
const adminPage = read("app/admin/page.tsx");
const auth = read("app/lib/admin-auth.ts");
const subscribe = read("app/api/subscribe/route.ts");
const audience = read("app/lib/audience-service.ts");
const mailchimpEvents = read("app/lib/mailchimp-events.ts");

expect(build.includes("v40.42-owner-cms-phase-1") || build.includes("v40.43-newsletter-manager"), "Build is marked owner CMS phase 1.");
expect(tedx.includes("TEDxMiami") && tedx.includes("<FeatureVideo") && !tedx.includes("temporary audience recording") && !tedx.includes("official TEDx video has not yet been released"), "TEDx page keeps the player while removing temporary-status copy.");
expect(media.includes("TEDxMiami") && media.includes("media-tedx-invisible-inheritance") && !media.includes("Temporary audience recording") && !media.includes("temporary audience-recorded"), "Events & Media keeps the TEDx player without temporary-status copy.");
expect(adminPage.includes("Cloudflare Access will send a one-time code") || (adminPage.includes("You do not need a Cloudflare account") && adminPage.includes("/owner-login")), "Admin sign-in fallback explains the one-time-code flow.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Owner allowlist remains unchanged.");
expect(subscribe.includes("syncAudienceSubscriber") && audience.includes('status_if_new: "subscribed"'), "Website newsletter signup still syncs directly to Mailchimp.");
expect(mailchimpEvents.includes('FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup"'), "Welcome automation event contract remains intact.");
expect(read("app/page.tsx").indexOf('id="join"') < read("app/page.tsx").indexOf('id="exposure"'), "Primary newsletter signup is surfaced before the longer exposure and content sections.");
expect(!read("app/page.tsx").includes("<BookJourney") && read("app/page.tsx").includes("homeStyles.bookFeature"), "Homepage uses a concise static book feature instead of the long book scrollytelling section.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

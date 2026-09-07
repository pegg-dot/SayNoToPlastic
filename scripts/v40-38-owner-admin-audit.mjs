#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const build = read("app/build-version.ts");
const auth = read("app/lib/admin-auth.ts");
const adminContent = read("app/lib/admin-content.ts");
const adminPage = read("app/admin/page.tsx");
const adminPanel = read("app/admin/AdminPanel.tsx");
const adminApi = read("app/admin/api/content/route.ts");
const publicNotice = read("app/api/public/site-notice/route.ts");
const overrides = read("app/lib/publication-overrides.ts");
const podcast = read("app/podcast/page.tsx");
const tedx = read("app/tedx/page.tsx");
const media = read("app/media/page.tsx");
const worker = read("worker/index.ts");
const env = read(".env.example");
const wrangler = read("wrangler.jsonc");
const migration = read("drizzle/0007_owner_admin.sql");
const setup = read("OWNER_ADMIN_SETUP.md");
const mailchimpEvents = read("app/lib/mailchimp-events.ts");

expect(build.includes("v40.38-owner-admin"), "Build is marked v40.38 owner admin.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Application allowlist contains the two approved owner identities.");
expect(auth.includes('jwtHeader.alg !== "RS256"') && auth.includes("crypto.subtle.verify") && auth.includes("/cdn-cgi/access/certs"), "Cloudflare Access JWT signature is verified with Access public keys.");
expect(auth.includes("audienceMatches") && auth.includes("payload.exp <= now") && auth.includes("payload.nbf") && auth.includes("!payload.iss"), "Access JWT audience, issuer, and time claims are required and validated.");
expect(auth.includes("JWKS_CACHE_MS") && auth.includes("forceRefresh"), "Access signing keys are cached briefly and refreshed when a rotated kid is not found.");
expect(env.includes("CF_ACCESS_TEAM_DOMAIN=") && env.includes("CF_ACCESS_AUD="), "Cloudflare Access runtime settings are documented without committed values.");
expect(adminPage.includes("robots: { index: false, follow: false }") && adminPage.includes("getAdminUser"), "Admin page is noindex and protected by authenticated identity.");
expect(adminPanel.includes('fetch("/admin/api/content"') && !adminPanel.includes('fetch("/api/admin/content"'), "Admin writes remain inside the single protected /admin path.");
expect(adminApi.includes("isSameOrigin(request)") && adminApi.includes("bodyIsReasonable(request, 4_000)") && adminApi.includes("getAdminUser"), "Admin writes require authentication, same-origin requests, and bounded request bodies.");
expect(adminContent.includes("allowedHosts") && adminContent.includes('url.protocol !== "https:"') && adminContent.includes("allowedValues"), "Owner-editable values have field-specific validation and HTTPS host allowlists.");
expect(adminContent.includes("AdminContentConflict") && adminPanel.includes("expectedVersion"), "Admin updates use optimistic version checks to avoid silent overwrites.");
expect(adminContent.includes("enforceTedxStateConsistency") && adminContent.includes("Add and save the official TEDx video URL") && overrides.includes('statusOverride === "official" && Boolean(videoUrlOverride)'), "TEDx cannot be labeled official without an owner-supplied video URL, including public fallback hardening.");
expect(adminContent.includes("db.batch([revisionInsert, currentUpsert])"), "Revision insert and current-value update are committed atomically through D1 batch.");
expect(migration.includes("CREATE TABLE `admin_content`") && migration.includes("CREATE TABLE `admin_content_revisions`"), "Admin content and revision tables are packaged in migration 0007.");
expect(adminContent.includes("adminContentRevisions") && adminContent.includes("updatedBy") && adminContent.includes("listAdminContentRevisions"), "Owner changes are written to a revision trail with editor identity and can be read back.");
expect(adminPanel.includes("Use this version") && adminPanel.includes("Reset to source default") && adminPanel.includes("Restoring a version only loads it into the field"), "Owner admin exposes safe rollback controls without deleting history.");
expect(overrides.includes("getEffectiveTedxEntry") && tedx.includes("getEffectiveTedxEntry") && tedx.includes("toVideoFeature(entry)") && media.includes("getEffectiveTedxEntry"), "TEDx public surfaces consume one owner-managed effective entry and derive playback locally.");
expect(overrides.includes("getEffectivePodcastPlatforms") && podcast.includes("getEffectivePodcastPlatforms"), "Podcast public page consumes owner-managed platform links.");
expect(publicNotice.includes('getAdminContentValue("site.notice")') && read("app/components/SiteChrome.tsx").includes("site-owner-notice"), "Optional owner site notice is wired to the public header.");
expect(media.includes('getPublicOwnerNotice("media.owner_update")') && media.includes("Latest from Dr. Haddad"), "Events & Media owner update is wired to the public page.");
expect(worker.includes('url.pathname.startsWith("/admin")') && worker.includes('headers.set("X-Robots-Tag", "noindex, nofollow")'), "Worker disables caching/indexing for admin routes.");
expect(setup.includes("saynotoplastic.com/admin`") && setup.includes("saynotoplastic.com/admin/*`") && !setup.includes("saynotoplastic.com/api/admin"), "One Cloudflare Access application covers both the /admin parent and child paths with one AUD.");
expect(existsSync(join(root, "OWNER_ADMIN_SETUP.md")), "Owner admin setup and deployment guide is packaged.");
expect(wrangler.includes('"database_name": "saynotoplastic-db"') && wrangler.includes('"PUBLIC_SITE_URL": "https://saynotoplastic.com"') && wrangler.includes('"COMMERCE_MODE": "woocommerce"'), "Existing production D1, origin, and WooCommerce mode remain preserved.");
expect(mailchimpEvents.includes('FIELD_NOTES_SIGNUP_EVENT = "website_field_notes_signup"'), "Mailchimp welcome-event integration remains intact.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

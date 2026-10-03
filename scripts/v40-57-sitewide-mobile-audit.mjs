#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const mobile = read("app/mobile-hardening.css");
const chrome = read("app/components/SiteChrome.tsx");
const welcome = read("app/components/WelcomeVideoModal.tsx");
const adminCss = read("app/admin/admin.module.css");
const ownerLoginCss = read("app/owner-login/owner-login.module.css");
const resourcesCss = read("app/resources/resources.module.css");
const homeCss = read("app/home-additions.module.css");
const bookEn = read("app/homo-plasticus/page.tsx");
const bookEs = read("app/es/homo-plasticus/page.tsx");
const buildVersion = read("app/build-version.ts");
const qaDoc = read("docs/MOBILE_QA_V40_57.md");
const pkg = JSON.parse(read("package.json"));

expect(buildVersion.includes("v40.57-sitewide-mobile"), "Build marker identifies the sitewide mobile release.");
expect(pkg.scripts["release:audit"].includes("v40-57-sitewide-mobile-audit.mjs"), "v40.57 mobile audit is part of the full release gate.");
expect(pkg.scripts["audit:mobile"] === "node scripts/v40-57-sitewide-mobile-audit.mjs", "Dedicated mobile audit command is packaged.");

expect(mobile.includes("v40.57 phase 1") && mobile.includes("v40.57 phases 2–3") && mobile.includes("v40.57 phase 3c"), "Shared, route-level, and anatomy mobile hardening layers are packaged.");
expect(mobile.includes('body[data-mobile-nav-open="true"] .welcome-film-trigger') && chrome.includes('document.body.dataset.mobileNavOpen = "true"'), "Open mobile navigation suppresses the floating welcome trigger.");
expect(chrome.includes('className="footer-legal"') && mobile.includes(".footer-legal a") && mobile.includes("min-width: 44px"), "Footer legal navigation has phone-sized touch targets.");
expect(welcome.includes('aria-label="Welcome from Dr. Haddad"') && mobile.includes(".welcome-film-close") && mobile.includes("min-height: 48px"), "Welcome trigger is named and the modal close control is touch-sized.");

expect(mobile.includes(".anatomy-viewer-system-filter button") && mobile.includes(".anatomy-viewer-controls button") && mobile.includes("min-width: 44px") && mobile.includes("min-height: 44px"), "Anatomy atlas system and camera controls meet the mobile touch floor.");
expect(mobile.includes("short-height mobile") && mobile.includes("grid-template-columns: minmax(0, 1.2fr) minmax(250px, .8fr)") && mobile.includes("max-height: 540px"), "Anatomy atlas has a dedicated short-height landscape layout.");
expect(mobile.includes(".consent-check") && mobile.includes('input[type="checkbox"]') && mobile.includes("flex: 0 0 20px"), "Newsletter consent uses a larger label and checkbox hit area on phones.");
expect(mobile.includes(".site-footer .footer-signup .signup-form.compact") && mobile.includes("height: 48px"), "Footer newsletter form becomes a full-width phone form with 48px fields.");

expect(resourcesCss.includes("overflow-x: auto") && resourcesCss.includes("min-height: 44px") && resourcesCss.includes("scrollbar-width: none"), "Resource guide filters are swipeable and touch-sized on phones.");
expect(homeCss.includes(".cta{min-height:44px") && homeCss.includes(".bookLink{min-height:44px"), "Homepage book, podcast, and TEDx feature links retain mobile touch targets.");
expect(bookEn.includes('className="book-policy-link"') && bookEs.includes('className="book-policy-link"'), "English and Spanish book policy disclosures share the mobile-safe target.");

expect(adminCss.includes("v40.57 dedicated mobile pass") && adminCss.includes("font-size: 16px !important") && adminCss.includes("min-height: 44px"), "Owner workspace form controls prevent iOS focus zoom and use phone-sized controls.");
expect(adminCss.includes(".pageStudioPreviewFrame") && adminCss.includes("height: 440px"), "Page Studio has a narrow-phone preview height override.");
expect(ownerLoginCss.includes("min-height: 48px"), "Owner sign-in action is touch-sized on phones.");
expect(adminCss.includes("v40.57.1 owner mobile polish") && adminCss.includes("gap: 12px") && adminCss.includes("font-size: 12px"), "Owner primary workspace tabs stay fully visible at 320px without shrinking touch height.");

expect(qaDoc.includes("64 sitemap routes") && qaDoc.includes("192 portrait route-width checks") && qaDoc.includes("430 px") && qaDoc.includes("320 px"), "Mobile QA record captures the complete portrait route matrix.");
expect(qaDoc.includes("844 × 390") && qaDoc.includes("667 × 375") && qaDoc.includes("Cloudflare Access JWT"), "Mobile QA record captures landscape testing and the authenticated-admin boundary.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

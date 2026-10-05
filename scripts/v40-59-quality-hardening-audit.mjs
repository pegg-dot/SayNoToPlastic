#!/usr/bin/env node
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const size = (path) => statSync(join(root, path)).size;
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const pkg = JSON.parse(read("package.json"));
const buildVersion = read("app/build-version.ts");
const worker = read("worker/index.ts");
const chrome = read("app/components/SiteChrome.tsx");
const mailchimp = read("app/lib/newsletter-mailchimp.ts");
const anatomy = read("app/components/AnatomyScene.tsx");
const exposure = read("app/components/ExposureRouteVisual.tsx");
const sitemap = read("app/sitemap.ts");
const feed = read("app/feed.xml/route.ts");
const globals = read("app/globals.css");
const guideCss = read("app/resources/[slug]/guide.module.css");
const doc = read("docs/QUALITY_HARDENING_V40_59.md");

expect(buildVersion.includes("v40.59-quality-hardening"), "Build marker identifies v40.59 quality hardening.");
expect(pkg.scripts?.["release:audit"]?.includes("v40-59-quality-hardening-audit.mjs"), "v40.59 audit is part of the full release gate.");
expect(worker.includes('headers.set("Content-Security-Policy"') && worker.includes("frame-ancestors 'self'") && worker.includes("object-src 'none'") && worker.includes("'wasm-unsafe-eval'"), "Worker applies the tested CSP boundary while preserving Meshopt/WASM and same-origin owner previews.");
expect(worker.includes("https://static.cloudflareinsights.com") && worker.includes("https://www.youtube-nocookie.com") && worker.includes("connect-src 'self' https://cdn.humanatlas.io https://raw.githubusercontent.com https://static.cloudflareinsights.com") && !worker.includes("\"connect-src 'self' https:\",") && worker.includes("manifest-src 'self' https://saynotoplastic.com"), "CSP limits browser connections to same-origin and the tested Human Reference Atlas/analytics hosts while preserving embedded video.");
expect(chrome.includes("sntp-wordmark-microplastic-nav.webp") && chrome.includes("sntp-wordmark-microplastic.webp"), "Website chrome serves optimized WebP wordmarks.");
expect(mailchimp.includes("sntp-wordmark-microplastic-nav.png"), "Email HTML retains PNG wordmark compatibility.");
expect(size("public/brand/sntp-wordmark-microplastic-nav.webp") < 45_000 && size("public/brand/sntp-wordmark-microplastic-nav.webp") < size("public/brand/sntp-wordmark-microplastic-nav.png") / 2, "Navigation WebP is a right-sized sub-45KB derivative and less than half its PNG source.");
expect(size("public/brand/sntp-wordmark-microplastic.webp") < 55_000 && size("public/brand/sntp-wordmark-microplastic.webp") < size("public/brand/sntp-wordmark-microplastic.png") / 2, "Footer WebP is a right-sized sub-55KB derivative and less than half its PNG source.");
expect(size("public/images/anatomy/maternal-fetal-cutaway-v1.webp") < 100_000 && size("public/images/anatomy/maternal-fetal-cutaway-v1.webp") < size("public/images/anatomy/maternal-fetal-cutaway-v1.png") / 5, "Maternal-fetal fallback is reduced to a modern sub-100KB asset without deleting the source PNG.");
expect(anatomy.includes('maternal-fetal-cutaway-v1.webp') && anatomy.includes("const safeIndex") && anatomy.includes("fallback-scene-${safeIndex}"), "Anatomy fallback mounts only the active scene and uses the optimized maternal asset.");
expect(exposure.includes("srcSet={`${src640} 640w, ${src960} 960w, ${src1400} 1400w`}") && exposure.includes('sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, 33vw"') && exposure.includes('url.searchParams.set("q", "74")'), "Exposure photography uses responsive Unsplash derivatives instead of one 1400px high-quality asset at every viewport.");
expect(!anatomy.includes("{images.map((image, index) => ("), "Hidden anatomy fallback scenes are no longer all mounted/downloaded at once.");
expect(sitemap.includes('filter((item) => item.reviewStatus !== "source-review")') && sitemap.includes('new Date("2026-10-05")'), "Sitemap excludes noindex source-review body pages and carries the current release date.");
expect(feed.includes('filter((item) => item.reviewStatus !== "source-review")') && feed.includes("Mon, 05 Oct 2026 12:00:00 GMT"), "RSS does not advertise source-review/noindex body pages and has a current build date.");
expect(globals.includes("v40.59 quality hardening") && globals.includes(".footer-bottom{color:#9aa0a5;font-size:14px") && globals.includes(".hp-actions-visual li>span{color:#7a5427}") && globals.includes(".body-system-sources>a>span{color:#7a5427}"), "Global v40.59 contrast fixes cover legal, action, science, body-system source indexes, and decorative exposure text.");
expect(guideCss.includes("v40.59") && guideCss.includes("color: #5f584e !important") && guideCss.includes("color: #6b4a20 !important"), "Ivory field-guide hero uses measured dark supporting colors rather than inherited white text.");
expect(doc.includes("Lighthouse") && doc.toLowerCase().includes("owner/provider") && doc.includes("192") && doc.includes("Content Security Policy"), "Quality record captures measured findings, regression scope, and honest owner/provider boundaries.");
expect(doc.includes("160/160 checks passed") && doc.includes("168/168 checks") && doc.includes("24/24 checks passed") && doc.includes("Accessibility | SEO | LCP") && doc.includes("93 KiB"), "Quality record preserves the final exact-viewport, noindex-page, and representative Lighthouse proof.");
expect(doc.includes("Page Studio same-origin preview iframe") && doc.includes("youtube-nocookie.com") && doc.includes("zero framing violations"), "Quality record preserves CSP proof for owner previews and media embeds.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

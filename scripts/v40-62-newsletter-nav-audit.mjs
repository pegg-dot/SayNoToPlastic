#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const build = read("app/build-version.ts");
const chrome = read("app/components/SiteChrome.tsx");
const i18n = read("app/lib/i18n.ts");
const newsletters = read("app/newsletters/page.tsx");
const newslettersEs = read("app/es/boletines/page.tsx");
const sitemap = read("app/sitemap.ts");
const state = read("CURRENT_STATE.md");

expect(build.includes("v40.62-newsletter-nav"), "Build marker identifies the newsletter navigation release.");
expect(chrome.includes('localizedPath("/newsletters", locale)') && chrome.includes("copy.newsletterNav"), "Primary navigation includes the localized Newsletter / Boletín destination.");
expect(i18n.includes('"/newsletters": "/es/boletines"') && i18n.includes('newsletterNav: "Newsletter"') && i18n.includes('newsletterNav: "Boletín"'), "Newsletter navigation label and route localize in both directions.");
expect(newsletters.includes('href="#archive-title"') && newsletters.includes('href="#subscribe-field-notes"'), "English newsletter hero offers immediate read and subscribe actions.");
expect(newsletters.includes("Every published issue is free to read.") && newsletters.includes("The full archive stays open to everyone."), "English archive explicitly remains open rather than subscription-gated.");
expect(newsletters.includes('id="subscribe-field-notes"') && newsletters.includes("<SignupForm"), "English archive has an in-page subscription target backed by the existing signup form.");
expect(newsletters.includes('"en-US": "/newsletters"') && newsletters.includes('"es-US": "/es/boletines"'), "English newsletter archive exposes reciprocal hreflang.");
expect(newslettersEs.includes('<Header locale="es"') && newslettersEs.includes('<Footer locale="es"') && newslettersEs.includes('locale="es"'), "Spanish newsletter archive keeps localized chrome and signup behavior.");
expect(newslettersEs.includes("Las ediciones del archivo se muestran en su idioma original.") && newslettersEs.includes("/newsletters/"), "Spanish archive transparently links original-language issues when translated issues do not exist.");
expect(sitemap.includes('"/es/boletines"') && state.includes("first-class primary-navigation destination"), "Sitemap and operational state record the bilingual newsletter destination.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

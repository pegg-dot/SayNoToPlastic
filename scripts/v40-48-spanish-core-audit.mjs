#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const chrome = read("app/components/SiteChrome.tsx");
const i18n = read("app/lib/i18n.ts");
const sitemap = read("app/sitemap.ts");
const build = read("app/build-version.ts");
const spanishRoutes = [
  "app/es/page.tsx",
  "app/es/ciencia/page.tsx",
  "app/es/accion/page.tsx",
  "app/es/guia-12-pasos/page.tsx",
  "app/es/homo-plasticus/page.tsx",
  "app/es/podcast/page.tsx",
  "app/es/tedx/page.tsx",
  "app/es/sobre-dr-elie-haddad/page.tsx",
];

expect(spanishRoutes.every(exists), "Spanish core public routes are packaged.");
expect(i18n.includes('export type SiteLocale = "en" | "es"') && i18n.includes('"/science": "/es/ciencia"'), "Locale routing maps English core routes to Spanish equivalents.");
expect(chrome.includes('locale = "en"') && chrome.includes("language-switcher") && chrome.includes("alternateHref"), "Global navigation exposes an EN/ES route-aware switcher.");
expect(chrome.includes('<SignupForm compact locale={locale}'), "Footer newsletter signup localizes labels while keeping the same subscribe API.");
expect(exists("app/content/es/evidence.ts") && read("app/content/es/evidence.ts").includes("evidenceChaptersEs"), "Human evidence has a structured Spanish translation record rather than browser translation.");
expect(exists("app/content/es/actions.ts") && read("app/content/es/actions.ts").includes("authoredQuickActionCardEs"), "Action guidance has explicit Spanish translations and evidence caveats.");
expect(read("app/es/ciencia/page.tsx").includes("study.source") && read("app/es/ciencia/page.tsx").includes("study.limits"), "Spanish Science page preserves source links and study limitations.");
expect(read("app/es/guia-12-pasos/page.tsx").includes("Traducción del texto del autor"), "Spanish action card labels translated author wording transparently.");
expect(read("app/page.tsx").includes('"es-US": "/es"') && read("app/science/page.tsx").includes('"es-US": "/es/ciencia"'), "English core pages expose Spanish hreflang alternates.");
expect(sitemap.includes('"/es/ciencia"') && sitemap.includes('"/es/accion"') && sitemap.includes('"/es/podcast"'), "Spanish core routes are included in the sitemap.");
expect(exists("app/es/layout.tsx") && exists("app/components/LocaleDocument.tsx"), "Spanish route subtree identifies Spanish language for accessibility and client document state.");
expect(build.includes("v40.48-spanish-core"), "Build marker identifies Spanish core localization.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

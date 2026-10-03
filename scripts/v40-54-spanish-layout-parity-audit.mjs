#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const aboutEs = read("app/es/sobre-dr-elie-haddad/page.tsx");
const aboutCss = read("app/about-dr-elie-haddad/about.module.css");
const actionEs = read("app/es/accion/page.tsx");
const scienceEs = read("app/es/ciencia/page.tsx");
const consent = read("app/components/ConsentAnalytics.tsx");
const checkout = read("app/components/CheckoutButton.tsx");
const featureVideo = read("app/components/FeatureVideo.tsx");
const tedxEs = read("app/es/tedx/page.tsx");
const exposureVisual = read("app/components/ExposureRouteVisual.tsx");
const homeEs = read("app/es/page.tsx");
const planner = read("app/components/ActionPlanner.tsx");
const worksheet = read("app/components/ExposureWorksheet.tsx");
const i18n = read("app/lib/i18n.ts");
const chrome = read("app/components/SiteChrome.tsx");
const sitemap = read("app/sitemap.ts");
const reduceEn = read("app/solutions/reduce-exposure/page.tsx");
const buildVersion = read("app/build-version.ts");
const globalCss = read("app/globals.css");

const staleAboutClasses = ["styles.kicker", "styles.why", "styles.eyebrow", "styles.work"];
expect(staleAboutClasses.every((token) => !aboutEs.includes(token)), "Spanish About no longer references retired CSS-module hooks.");
for (const className of ["reason", "sectionCopy", "storyHeading", "storyRows", "storyRow", "closing", "closingCopy", "linkList", "deeper", "deeperBody"]) {
  expect(aboutEs.includes(`styles.${className}`) && new RegExp(`\\.${className}(?:\\s|\\{|,|:)`).test(aboutCss), `Spanish About uses current ${className} layout hook backed by CSS.`);
}

expect(actionEs.includes('className="solutions-direct ivory"') && actionEs.includes('className="solutions-exposure-framework"'), "Spanish Action uses the current direct-action and exposure-framework layouts.");
expect(!actionEs.includes('className="solutions-exposure"') && !actionEs.includes('className="solutions-exposure-grid"'), "Spanish Action no longer references retired exposure layout classes.");
expect(actionEs.includes('<ActionPlanner locale="es"'), "Spanish Action uses the localized interactive planner.");
expect(globalCss.includes(".solutions-core{grid-template-columns:1fr;gap:55px}"), "Core action rules collapse to one column before narrow Spanish copy can clip.");
expect(actionEs.includes('/es/accion/reducir-exposicion'), "Spanish Action routes the full reduction workflow to a Spanish page.");

expect(scienceEs.includes("scienceChapterVisualsEs") && scienceEs.includes('className="science-v2-chapter-visual"'), "Spanish Science retains the chapter visual structure used by English Science.");

expect(consent.includes('pathname?.startsWith("/es")') && consent.includes("Tu lectura, tu elección."), "The global consent banner localizes itself on Spanish routes.");
expect(checkout.includes('pathname?.startsWith("/es")') && checkout.includes("Abriendo pago seguro..."), "Checkout loading and failure states localize on Spanish routes.");
expect(featureVideo.includes("Abrir en YouTube") && tedxEs.includes('locale="es"'), "Spanish TEDx localizes shared video controls.");
expect(exposureVisual.includes("labelEs") && homeEs.includes('<ExposureRouteVisual kind={route.kind} locale="es"'), "Spanish homepage exposure visuals have localized labels and alt text.");
expect(planner.includes("plannerActionsEs") && planner.includes('locale === "es" ? "/es/guia-12-pasos"'), "Action planner localizes copy, actions, and destination on Spanish routes.");
expect(worksheet.includes("reduceExposureGroupsEs") && worksheet.includes('locale = "en"') && worksheet.includes("Hoja de trabajo interactiva"), "Exposure worksheet supports a complete Spanish interactive state.");

expect(existsSync(join(root, "app/es/accion/reducir-exposicion/page.tsx")), "Spanish full exposure-reduction route is packaged.");
expect(i18n.includes('"/solutions/reduce-exposure": "/es/accion/reducir-exposicion"'), "Locale routing maps the full exposure-reduction guide in both languages.");
expect(i18n.includes("alternateLocalePath") && i18n.includes('return "/es";'), "Unsupported English pages fall back to Spanish home instead of a no-op language switch.");
expect(chrome.includes("alternateLocalePath(pathname, alternateLocale)"), "Site chrome uses the safe alternate-language route resolver.");
expect(sitemap.includes('"/es/accion/reducir-exposicion"'), "Spanish full exposure-reduction route is included in the sitemap.");
expect(reduceEn.includes('"es-US": "/es/accion/reducir-exposicion"'), "English exposure-reduction metadata exposes the Spanish hreflang alternate.");
expect(buildVersion.includes("v40.54-spanish-layout-parity"), "Build marker identifies the Spanish layout-parity release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

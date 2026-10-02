#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const detection = read("app/es/ciencia/como-funciona-la-deteccion/page.tsx");
const exposome = read("app/es/ciencia/exposoma/page.tsx");
const topics = read("app/content/es/haddad-topics.ts");
const englishDetection = read("app/science/how-detection-works/page.tsx");
const englishExposome = read("app/science/exposome/page.tsx");
const primer = read("app/components/DetectionPrimer.tsx");
const map = read("app/components/ExposomeMap.tsx");
const library = read("app/components/BodySystemLibrary.tsx");
const bodySystems = read("app/content/es/body-systems.ts");
const i18n = read("app/lib/i18n.ts");
const chrome = read("app/components/SiteChrome.tsx");
const sitemap = read("app/sitemap.ts");
const build = read("app/build-version.ts");

expect(exists("app/es/ciencia/como-funciona-la-deteccion/page.tsx") && exists("app/es/ciencia/exposoma/page.tsx"), "Spanish detection and exposome routes are packaged.");
expect(topics.includes("detectionStepsEs") && topics.includes("detectionContentEs") && topics.includes("commonPolymersEs"), "Detection content has a structured Spanish source record.");
expect(detection.includes("evidenceStudiesEs") && detection.includes("detectionContentEs.reviewNote") && detection.includes("detectionContentEs.sourceDocument"), "Spanish detection page keeps translated methods, review note, and source-document provenance.");
expect(detection.includes("Detectar no es diagnosticar") && detection.includes("Causalidad"), "Spanish detection page preserves the detection-to-causation evidence boundary.");
expect(topics.includes("exposomeCategoriesEs") && topics.includes("exposomeContentEs") && topics.includes('sourceDocument: "Exposome diagram.pdf"'), "Exposome content has a structured Spanish translation tied to the supplied source document.");
expect(exposome.includes('<ExposomeMap categories={exposomeCategoriesEs} locale="es"') && exposome.includes('<BodySystemLibrary') && exposome.includes('locale="es"'), "Spanish exposome uses localized interactive components and translated body-system cards.");
expect(map.includes("categories = exposomeCategories") && map.includes('locale === "es" ? "El mundo que te rodea"'), "Shared exposome map supports explicit Spanish categories without changing English defaults.");
expect(library.includes("localizedPath") && library.includes('locale === "es" ? "Abrir resumen"'), "Shared body-system library routes and labels localize by locale.");
expect(primer.includes('"/es/ciencia/como-funciona-la-deteccion"') && !primer.includes("detección (en inglés)"), "Spanish Science detection primer now stays inside the Spanish science layer.");
expect(!bodySystems.includes('Cómo detectan los científicos los microplásticos (en inglés)') && bodySystems.includes('href: "/es/ciencia/como-funciona-la-deteccion"'), "Spanish body systems point to the translated detection explainer.");
expect(!bodySystems.includes('El exposoma (en inglés)') && bodySystems.includes('href: "/es/ciencia/exposoma"'), "Spanish body systems point to the translated exposome.");
expect(i18n.includes('"/science/how-detection-works": "/es/ciencia/como-funciona-la-deteccion"') && i18n.includes('"/science/exposome": "/es/ciencia/exposoma"'), "Language switching maps both science context pages.");
expect(chrome.includes('localizedPath("/science/how-detection-works", locale)') && chrome.includes('localizedPath("/science/exposome", locale)'), "Spanish footer stays in Spanish for detection and exposome.");
expect(englishDetection.includes('"es-US": "/es/ciencia/como-funciona-la-deteccion"') && englishExposome.includes('"es-US": "/es/ciencia/exposoma"'), "English science explainers expose reciprocal Spanish hreflang.");
expect(sitemap.includes('"/es/ciencia/como-funciona-la-deteccion"') && sitemap.includes('"/es/ciencia/exposoma"'), "Spanish detection and exposome routes are included in the sitemap.");
expect(build.includes("v40.50-spanish-science-context"), "Build marker identifies the completed Spanish science context layer.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

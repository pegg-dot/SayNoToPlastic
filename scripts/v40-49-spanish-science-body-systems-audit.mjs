#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const english = read("app/content/body-systems.ts");
const spanish = read("app/content/es/body-systems.ts");
const spanishRoute = read("app/es/ciencia/cuerpo/[slug]/page.tsx");
const englishRoute = read("app/science/body/[slug]/page.tsx");
const spanishScience = read("app/es/ciencia/page.tsx");
const i18n = read("app/lib/i18n.ts");
const sitemap = read("app/sitemap.ts");
const build = read("app/build-version.ts");
const freshness = read("app/lib/spanish-body-system.ts");
const bodyVisual = read("app/components/BodySystemVisual.tsx");
const navigator = read("app/science/ScienceNavigator.tsx");
const primer = read("app/components/DetectionPrimer.tsx");

const slugList = (content) => [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const englishSlugs = slugList(english);
const spanishSlugs = slugList(spanish);

function segment(content, slug, slugs) {
  const start = content.indexOf(`slug: "${slug}"`);
  const index = slugs.indexOf(slug);
  const next = slugs[index + 1];
  const end = next ? content.indexOf(`slug: "${next}"`, start) : content.indexOf("];", start);
  return content.slice(start, end);
}

function value(block, key) {
  return block.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1] ?? "";
}

function sourceUrls(block) {
  const primary = block.match(/primarySources:\s*\[([\s\S]*?)\],\s*sourceDocument:/)?.[1] ?? "";
  return [...primary.matchAll(/href:\s*"(https:[^"]+)"/g)].map((match) => match[1]);
}

expect(exists("app/content/es/body-systems.ts") && exists("app/es/ciencia/cuerpo/[slug]/page.tsx"), "Spanish body-system data and route are packaged.");
expect(englishSlugs.length === 7 && spanishSlugs.length === 7 && JSON.stringify(englishSlugs) === JSON.stringify(spanishSlugs), "Spanish body-system records cover exactly the seven reviewed English records.");

for (const slug of englishSlugs) {
  const en = segment(english, slug, englishSlugs);
  const es = segment(spanish, slug, spanishSlugs);
  const statusMatches = value(en, "reviewStatus") === value(es, "reviewStatus");
  const dateMatches = value(en, "updatedDate") === value(es, "updatedDate");
  const sourceDocumentMatches = value(en, "sourceDocument") === value(es, "sourceDocument");
  const structurePresent = ["overview", "why-it-matters", "research", "meaning"].every((id) => es.includes(`id: "${id}"`))
    && ["known:", "uncertain:", "relatedEvidence:", "relatedGuides:", "primarySources:"].every((key) => es.includes(key));
  const urlsPreserved = sourceUrls(en).every((url) => es.includes(url));

  expect(statusMatches && dateMatches && sourceDocumentMatches, `${slug}: review status, source document, and source revision date remain aligned.`);
  expect(structurePresent, `${slug}: translated record preserves sections, known/uncertain boundaries, links, and sources.`);
  expect(urlsPreserved, `${slug}: every English primary-source URL is preserved in the Spanish record.`);
}

expect(spanishRoute.includes('locale="es"') && spanishRoute.includes("article.known") && spanishRoute.includes("article.uncertain") && spanishRoute.includes("article.primarySources"), "Spanish body-system template preserves evidence boundaries and source rendering.");
expect(spanishRoute.includes('article.reviewStatus === "source-review"') && spanishRoute.includes('article.reviewStatus !== "verified"'), "Spanish body-system template preserves indexing and editorial behavior by review status.");
expect(spanishRoute.includes("translationIsStale") && freshness.includes("ownerEditableSnapshot") && freshness.includes("getEffectiveBodySystem"), "Spanish body-system pages fail safe when owner edits make a reviewed translation stale.");
expect(spanishRoute.includes('<BodySystemVisual article={article} locale="es"') && bodyVisual.includes('locale === "es" ? "Referencia anatómica"'), "Spanish body-system anatomical visuals do not leak English labels.");
expect(spanishScience.includes('<ScienceNavigator locale="es"') && navigator.includes('"Explorar los hallazgos"'), "Spanish Science includes a localized evidence navigator.");
expect(spanishScience.includes('<DetectionPrimer locale="es"') && primer.includes('"¿Cómo saben los científicos que el plástico está ahí?"'), "Spanish Science includes a localized detection-method primer.");
expect(spanishRoute.includes('"en-US": `/science/body/${article.slug}`') && spanishRoute.includes('"es-US": `/es/ciencia/cuerpo/${article.slug}`'), "Spanish body-system metadata exposes reciprocal hreflang.");
expect(englishRoute.includes('"es-US": `/es/ciencia/cuerpo/${article.slug}`'), "English body-system metadata exposes the Spanish alternate.");
expect(spanishScience.includes('import { bodySystemsEs }') && spanishScience.includes('/es/ciencia/cuerpo/${item.slug}') && !spanishScience.includes("Página detallada en inglés"), "Spanish Science now routes body-system cards to translated detail pages.");
expect(i18n.includes('pathname.startsWith("/science/body/")') && i18n.includes('pathname.startsWith("/es/ciencia/cuerpo/")'), "Language switcher maps body-system routes in both directions.");
expect(sitemap.includes('bodySystemsEs.filter((item) => item.reviewStatus !== "source-review").map') && sitemap.includes('/es/ciencia/cuerpo/${item.slug}'), "Spanish body-system sitemap follows publication status: verified/partial pages are discoverable while source-review/noindex pages stay out.");
expect(build.includes("v40.49-spanish-science-body-systems"), "Build marker identifies Spanish body-system science phase.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

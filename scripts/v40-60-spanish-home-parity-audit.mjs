#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const enHome = read("app/page.tsx");
const esHome = read("app/es/page.tsx");
const reveal = read("app/components/HomeRevealObserver.tsx");
const journey = read("app/components/BodyJourney.tsx");
const esEvidence = read("app/content/es/evidence.ts");
const viewer = read("app/components/AnatomySystemViewer.tsx");
const css = read("app/globals.css");
const sync = read("app/components/AnatomyAtlasEvidenceSync.tsx");
const pkg = JSON.parse(read("package.json"));
const buildVersion = read("app/build-version.ts");
const state = read("CURRENT_STATE.md");
const doc = read("docs/SPANISH_HOME_PARITY_V40_60.md");

expect(buildVersion.includes("v40.60-spanish-home-parity"), "Build marker identifies the Spanish homepage parity release.");
expect(pkg.scripts["release:audit"].includes("v40-60-spanish-home-parity-audit.mjs"), "v40.60 parity audit is part of the full release gate.");
expect(pkg.scripts["audit:spanish-home"] === "node scripts/v40-60-spanish-home-parity-audit.mjs", "Dedicated Spanish-home audit command is packaged.");

expect(enHome.includes("<HomeRevealObserver />") && esHome.includes("<HomeRevealObserver />"), "English and Spanish Home share the same reveal observer.");
expect(reveal.includes('querySelectorAll<HTMLElement>("[data-reveal]")') && reveal.includes("new MutationObserver(register)") && reveal.includes("intersection?.unobserve(node)"), "Reveal observer handles both initial and late-mounted homepage sections.");
expect(!journey.includes('querySelectorAll<HTMLElement>("[data-reveal]")'), "BodyJourney no longer owns the global homepage reveal lifecycle.");

expect(journey.includes('locale?: JourneyLocale') && journey.includes('locale === "es" ? homepageJourneyEs : homepageJourney'), "BodyJourney selects localized evidence data through an explicit locale contract.");
expect(esHome.includes('<BodyJourney locale="es" />'), "Spanish Home renders the full localized anatomy journey.");
expect(esEvidence.includes("export const homepageJourneyEs: HomepageJourneyChapter[]"), "Spanish evidence module exports a dedicated homepage journey.");
const esJourneyBlock = esEvidence.split("export const homepageJourneyEs: HomepageJourneyChapter[] = [")[1]?.split("\n];")[0] ?? "";
expect((esJourneyBlock.match(/\n\s*slug: /g) ?? []).length === 10, "Spanish homepage evidence journey contains all ten chapters.");

for (const marker of [
  'id="exposure"',
  'id="solutions"',
  'homeStyles.bookFeature',
  'id="about"',
  'homeStyles.podcastFeature',
  'homeStyles.tedxFeature',
  'id="join"',
  'home-es-media-title',
]) expect(esHome.includes(marker), `Spanish Home includes ${marker}.`);
expect(esHome.includes('href="/es/homo-plasticus"'), "Spanish Home book detail CTA stays on the Spanish book route.");
expect(!esHome.includes('href="/es/media"'), "Spanish Home does not invent a nonexistent /es/media route.");
expect(css.includes('.hp-author-copy{padding:95px 8vw;align-self:stretch}'), "Mobile About copy stretches to the viewport instead of retaining desktop center alignment.");

expect(journey.includes('/es/ciencia/cuerpo/cardiovascular-system') && journey.includes('/es/ciencia/cuerpo/kidneys-urinary-system') && journey.includes('scienceHref: "/es/ciencia"'), "Spanish anatomy journey links into Spanish science/body-system routes.");
expect(viewer.includes('locale?: ViewerLocale') && viewer.includes('data-locale={locale}') && viewer.includes('data-anatomy-group={group.id}'), "Anatomy viewer carries explicit locale and stable anatomy-group identifiers.");
expect(viewer.includes('title: "Atlas anatómico de referencia"') && viewer.includes('route: "/es/ciencia"') && viewer.includes('finding: "Hallazgo"') && viewer.includes('openQuestion: "Pregunta abierta"'), "Anatomy viewer contains Spanish title, route, and evidence UI copy.");
expect(sync.includes('homepageJourneyEs') && sync.includes('dialog.dataset.locale === "es"') && sync.includes('activeButton?.dataset.anatomyGroup'), "Atlas evidence sync uses locale and stable group IDs instead of English button text.");
expect(sync.includes('"Lo que dice la evidencia"') && sync.includes('"Resumen del estudio"') && sync.includes('/es/ciencia#brain'), "Atlas evidence sync keeps Spanish system-switch copy and routes localized.");

expect(state.includes("v40.60 Spanish homepage parity"), "Current operational state names v40.60 as the active source line.");
expect(doc.includes("10 anatomy/evidence chapters") && doc.includes("1440") && doc.includes("390") && doc.includes("320") && doc.includes("EN→ES"), "Parity record captures chapter count, representative widths, and the actual language-switch flow.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

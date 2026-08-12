#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });
const includesAll = (text, tokens) => tokens.every((token) => text.includes(token));
const hash = (path) => createHash("sha256").update(readFileSync(join(root, path))).digest("hex");

const book = read("app/homo-plasticus/page.tsx");
const about = read("app/about-dr-elie-haddad/page.tsx");
const media = read("app/media/page.tsx");
const map = read("app/components/ExposomeMap.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");
const packageJson = JSON.parse(read("package.json"));

const isV24Cleanup = ["v40.24-content-architecture-cleanup", "v40.25-reading-flow-polish", "v40.26-inline-navigation-final", "v40.27-final-predeploy-polish", "v40.28-testicular-final-chapter", "v40.33-system-aware-microplastic-flow", "v40.34-deployment-release-candidate"].some((token) => build.includes(token));
expect(build.includes("v40.23-framing-and-density-polish") || isV24Cleanup, "Build identifier preserves v40.23 framing or advances to the compatible v40.24 cleanup.");

expect(!book.includes("The website now carries the body-system depth beside the book."), "The awkward website-versus-book framing is removed.");
expect(isV24Cleanup ? book.includes("Explore the evidence directly.") : book.includes("Explore the science behind the book&apos;s central questions."), isV24Cleanup ? "Later cleanup uses a compact direct bridge into Science." : "Book page uses a natural science-behind-the-questions heading.");
expect(isV24Cleanup ? book.includes("The book provides the wider narrative") : includesAll(book, ["This reading path connects the book&apos;s wider inquiry", "It is not presented as the book&apos;s table of contents."]), isV24Cleanup ? "Later cleanup avoids a duplicated pseudo-table-of-contents and keeps the book/Science boundary clear." : "Book page preserves the public reading-path and table-of-contents boundary.");
expect(isV24Cleanup ? includesAll(book, ["/science#body-system-overviews", "/science/how-detection-works"]) : (book.includes("projectQuestions.map") && book.includes("How scientists detect microplastics")), "The body-system and detection links remain on the book page.");

expect(about.includes('<section className="about-exposome"') && about.includes("<ExposomeMap compact />"), "Dr. Haddad page preserves the Exposome section and interactive map.");
expect(includesAll(css, [".about-exposome{padding-top:78px", "grid-template-columns:minmax(330px,.82fr) minmax(500px,1.18fr)", "gap:4vw"]), "About Exposome section has a tighter two-column desktop frame.");
expect(includesAll(css, [".about-exposome .exposome-map.is-compact{display:grid;grid-template-columns:168px minmax(0,1fr)", ".exposome-map-controls{grid-column:1;grid-row:2", ".exposome-map-panel{grid-column:2;grid-row:1/3"]), "Compact Exposome map uses a vertical control rail and one focused panel.");
expect(includesAll(css, ["@media(max-width:700px)", ".about-exposome .exposome-map.is-compact{display:block}", "overflow-x:auto"]), "Compact Exposome map keeps a usable small-screen fallback.");
expect(map.includes('role="tablist"') && map.includes('role="tabpanel"') && map.includes("handleTabKey"), "Exposome keyboard and tab semantics remain intact.");

expect(!media.includes("Give every interview a precise starting point."), "The rejected media heading is removed.");
expect(isV24Cleanup ? media.includes("Make the science clear enough to act on.") : media.includes("Clear evidence for public conversations."), "Media page uses concise public-facing framing.");
expect(isV24Cleanup ? includesAll(media, ["/media/press-kit", "Press resources"]) : media.includes("Each briefing separates verified findings from supplied narrative"), isV24Cleanup ? "Later cleanup centralizes detailed evidence briefings in the press kit." : "Media introduction still states the evidence and uncertainty boundary.");
const pressKit = read("app/media/press-kit/page.tsx");
expect(isV24Cleanup ? includesAll(pressKit, ["pressBriefs.map", "Open topic →", "Download PDF ↓"]) : includesAll(media, ["evidenceBriefings.map", "Open topic", "Download one-page PDF"]), isV24Cleanup ? "Briefing topic and PDF actions remain available in the canonical press kit." : "All briefing cards and both actions remain available.");
expect(includesAll(css, [".media-briefings{padding-top:92px", "grid-template-columns:.58fr 1.42fr", ".media-briefings>div:first-child h2{max-width:10ch"]), "Media briefing introduction is shorter and more proportionate.");

expect(packageJson.scripts?.["framing:polish"] === "node scripts/v40-23-framing-density-audit.mjs", "The v40.23 audit is registered.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_23_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_23.md") && exists("docs/V40_23_FRAMING_DENSITY_POLISH.md"), "v40.23 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const mediaItems = read("app/content/media-items.json");
const publications = read("app/content/publications.ts");
const tedx = read("app/tedx/page.tsx");
const tedxEs = read("app/es/tedx/page.tsx");
const home = read("app/page.tsx");
const homeEs = read("app/es/page.tsx");
const admin = read("app/admin/AdminPanel.tsx");
const state = read("CURRENT_STATE.md");
const build = read("app/build-version.ts");

const registry = JSON.parse(mediaItems);
const entry = registry.entries.find((item) => item.id === "tedx-invisible-inheritance");

expect(build.includes("v40.61-tedx-official-release"), "Build marker identifies v40.61 official TEDx release.");
expect(entry?.mediaUrl === "https://www.youtube.com/watch?v=solsGnKO1-c" && entry?.youtubeId === "solsGnKO1-c", "Media registry points to the verified official TEDxMiami video.");
expect(entry?.temporary === false && entry?.replaceWhenOfficialAvailable === false, "Official release is no longer marked temporary or replace-when-official.");
expect(entry?.displayStatus === "Official TEDxMiami release", "Media registry exposes official TEDxMiami status.");
expect(publications.includes('officialVideoUrl: "https://www.youtube.com/watch?v=solsGnKO1-c"') && publications.includes('officialYoutubeId: "solsGnKO1-c"'), "Compatibility registry uses the official URL and ID.");
expect(!mediaItems.includes("6juPFhIh68I") && !publications.includes("6juPFhIh68I"), "Superseded temporary Shorts ID is absent from current registries.");
expect(tedx.includes("The Future of Human Health (In the Age of Nanoplastics)") && home.includes("The Future of Human Health (In the Age of Nanoplastics)"), "English TEDx page and homepage use the official public talk title.");
expect(tedxEs.includes("El futuro de la salud humana (en la era de los nanoplásticos)") && homeEs.includes("El futuro de la salud humana (en la era de los nanoplásticos)"), "Spanish TEDx page and homepage use the localized official title.");
expect(admin.includes("This should remain Official for the current TEDxMiami public release."), "Owner CMS guidance reflects the official-release state.");
expect(state.includes("official TEDxMiami release") && state.includes("solsGnKO1-c"), "Current operational state records the official canonical release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

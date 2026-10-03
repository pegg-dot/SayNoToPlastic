#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const admin = read("app/admin/AdminPanel.tsx");
const css = read("app/admin/admin.module.css");
const pageEditor = read("app/lib/page-editor.ts");
const scienceManager = read("app/admin/ScienceManager.tsx");
const bodyManager = read("app/admin/BodySystemManager.tsx");
const build = read("app/build-version.ts");

expect(admin.includes('type SectionId = "dashboard" | "pages" | "media" | "press" | "newsletters"'), "Science no longer creates a separate top-level owner navigation concept.");
expect(pageEditor.includes('| "science";') && pageEditor.includes('kind: "science"'), "Science is represented as a website page with a specialized editor kind.");
expect(admin.includes('goToPage("science")') && admin.includes('const isScience = page.kind === "science"'), "Research tasks route into Science through the unified Pages workspace.");
expect(admin.includes("previewFrameRef") && admin.includes("preparePreview") && admin.includes("data-sntp-owner-field"), "Normal page preview is wired for contextual field selection.");
expect(admin.includes("focusPreview") && admin.includes("scrollIntoView") && (admin.includes("Show + edit") || admin.includes("Edit ›")), "Choosing an edit locates and highlights its destination in the page preview.");
expect(admin.includes("previewDraft") && pageEditor.includes("textPreview: true"), "Text changes can be previewed in context before publication.");
expect(pageEditor.includes("previewTargets") && pageEditor.includes('"solutions.hero_title"') && pageEditor.includes('"about.hero_title"') && pageEditor.includes('"book.premise_title"'), "Editable pages map owner fields to concrete preview locations.");
expect(admin.includes("<ScienceManager") && admin.includes("<BodySystemManager"), "Unified Pages workspace keeps both structured science managers intact.");
expect(scienceManager.includes("Limitations") && scienceManager.includes("Original source URL"), "Research study publishing retains evidence and uncertainty structure.");
expect(bodyManager.includes("What remains uncertain") && bodyManager.includes("Primary sources"), "Body-system publishing retains uncertainty and source structure.");
expect(css.includes(".contextEditorLayout") && css.includes(".contextPreview") && css.includes("position: sticky"), "Desktop page editing keeps the live preview beside the controls.");
expect(css.includes(".pageTreeActive") && css.includes("border-left: 2px solid #a97836"), "Page navigation is flatter and less card-like.");
expect(build.includes("v40.47-contextual-editor"), "Build marker identifies the contextual owner editor release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

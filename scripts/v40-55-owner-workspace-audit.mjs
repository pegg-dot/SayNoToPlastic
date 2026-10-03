#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const page = read("app/admin/page.tsx");
const panel = read("app/admin/AdminPanel.tsx");
const newsletter = read("app/admin/NewsletterManager.tsx");
const science = read("app/admin/ScienceManager.tsx");
const body = read("app/admin/BodySystemManager.tsx");
const css = read("app/admin/admin.module.css");
const pkg = JSON.parse(read("package.json"));
const buildVersion = read("app/build-version.ts");
const benchmark = read("docs/ADMIN_UX_AIRBNB_BENCHMARK.md");
const consent = read("app/components/ConsentAnalytics.tsx");
const welcome = read("app/components/WelcomeVideoModal.tsx");
const contentRoute = read("app/admin/api/content/route.ts");

expect(benchmark.includes("## v40.55 owner-workspace refinement") && benchmark.includes("one object, one context, one obvious next action"), "Airbnb benchmark records the v40.55 owner-feedback refinement and interaction model.");
expect(page.includes("ownerTopbar") && page.includes("Owner workspace"), "Owner admin uses compact application chrome instead of the old hero-style header.");
expect(panel.includes('{ id: "dashboard", label: "Today" }') && panel.includes('{ id: "pages", label: "Website" }') && panel.includes('{ id: "newsletters", label: "Field Notes" }') && panel.includes('{ id: "media", label: "Media" }'), "Primary owner navigation keeps four stable mental models.");
expect(panel.includes("What would you like to do?") && panel.includes("Other common tasks"), "Today prioritizes orientation and progressively discloses secondary shortcuts.");
expect(panel.includes("activitySummary") && panel.includes("Why this workspace is safe"), "Analytics and safety explanation are secondary disclosures instead of competing dashboard blocks.");

expect(panel.includes("Publish change") && panel.includes("History &amp; restore") && panel.includes("sourceValues"), "Website editing resolves live text into a direct editor while keeping history behind a safety drawer.");
expect(!panel.includes("Live right now") && !panel.includes("New version") && !panel.includes("Customized on the live site"), "Normal Website editing no longer exposes CMS override/version jargon.");
expect(panel.includes("Click highlighted text in the page to edit it") && panel.includes("What would you like to change?"), "Website remains preview-first and contextual.");
expect(panel.includes("Why some content is locked"), "Protected website content is explained only when the owner asks for the reason.");
expect(panel.includes("owner_preview=1") && consent.includes("ownerPreview") && welcome.includes("ownerPreview"), "Owner page previews suppress visitor-only consent and welcome overlays without changing public routes.");
expect(panel.includes("pageCmsLayoutScience") && panel.includes("← Website pages"), "Science becomes a focused workspace instead of showing the general Website page tree beside Science tools.");

expect(newsletter.includes("selectedId") && newsletter.includes("objectWorkbench") && newsletter.includes("objectNextAction"), "Field Notes is selection-first with one issue detail workspace.");
expect(newsletter.includes("Next step") && newsletter.includes("Publish to website") && newsletter.includes("Create Mailchimp draft") && newsletter.includes("Open Mailchimp"), "Field Notes advances through one obvious next action based on issue state.");
expect(newsletter.includes("More actions") && newsletter.includes("Unpublish from website") && newsletter.includes("Delete from website manager"), "Secondary and destructive Field Notes actions are progressively disclosed.");

expect(science.includes("What the study found") && science.includes("How the study was done") && science.includes("Limitations & source"), "Human evidence editor sequences complexity into three guided steps.");
expect(science.includes("Why Science has extra safeguards") && science.includes("<details className={styles.scienceGuardrail}>"), "Science guardrails remain visible but progressively disclosed.");
expect(body.includes("Page basics") && body.includes("Article sections") && body.includes("Evidence boundaries") && body.includes("Sources & review"), "Body-system editing sequences complexity into four understandable steps.");
expect(body.includes("Live preview") && body.includes("objectList"), "Body-system editor remains object-first with a live page preview.");

expect(panel.includes("mediaWorkbench") && panel.includes("selectedMediaId") && panel.includes("Save changes") && panel.includes("More actions") && panel.includes("Remove item"), "Media remains selection-first, preserves one save action, and keeps removal secondary.");
expect(css.includes("v40.55 owner workspace") && css.includes(".objectWorkbench") && css.includes(".guidedSection") && css.includes(".publishBar") && css.includes(".objectMore:not([open])") && css.includes(".guidedSection:not([open])"), "v40.55 visual system styles the shared object-first, guided, and progressive-disclosure patterns.");
expect(contentRoute.includes("isSameOrigin(request)") && contentRoute.includes("expectedVersion") && contentRoute.includes("getAdminUser()"), "Owner write authorization, same-origin protection, and optimistic concurrency are unchanged.");
expect(pkg.scripts["release:audit"].includes("v40-55-owner-workspace-audit.mjs"), "v40.55 owner workspace audit is part of the release gate.");
expect(buildVersion.includes("v40.55-owner-workspace"), "Build marker identifies the v40.55 owner workspace release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

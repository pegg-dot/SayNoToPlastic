#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const page = read("app/admin/page.tsx");
const admin = read("app/admin/AdminPanel.tsx");
const newsletter = read("app/admin/NewsletterManager.tsx");
const science = read("app/admin/ScienceManager.tsx");
const bodySystems = read("app/admin/BodySystemManager.tsx");
const css = read("app/admin/admin.module.css");
const adminContent = read("app/lib/admin-content.ts");
const adminApi = read("app/admin/api/content/route.ts");
const newsletterMailchimp = read("app/admin/api/newsletters/[id]/mailchimp/route.ts");
const auth = read("app/lib/admin-auth.ts");
const build = read("app/build-version.ts");

expect(exists("docs/ADMIN_UX_AIRBNB_BENCHMARK.md") && read("docs/ADMIN_UX_AIRBNB_BENCHMARK.md").includes("Official Airbnb references reviewed"), "Airbnb UX benchmark and source record are retained in the repository.");

expect(
  admin.includes('{ id: "dashboard", label: "Today" }') &&
  admin.includes('{ id: "pages", label: "Website" }') &&
  admin.includes('{ id: "newsletters", label: "Field Notes" }') &&
  admin.includes('{ id: "media", label: "Media" }'),
  "Primary owner navigation uses four stable work areas: Today, Website, Field Notes, and Media."
);
expect(!admin.includes('{ id: "press", label: "Press kit" }'), "Press kit is no longer a competing top-level navigation concept.");
expect(admin.includes("subTabs") && admin.includes("Events &amp; Media") && admin.includes("Press kit"), "Press kit is nested locally under Media.");

expect(
  admin.includes("What do you want to work on?") &&
  admin.includes("Edit the website") &&
  admin.includes("Publish Field Notes") &&
  admin.includes("Add media or an appearance") &&
  admin.includes("Review or add science"),
  "Today presents four primary owner jobs instead of a seven-choice task wall."
);
expect(admin.includes("quickLinks") && admin.includes("Replace TEDx video") && admin.includes("Update podcast") && admin.includes("Edit press kit"), "Less frequent jobs remain available as secondary shortcuts.");

expect(!admin.includes("<small>{item.href}</small>") && admin.includes("pageHint(item.id)"), "Website navigation hides raw route paths and uses owner-facing page descriptions.");
expect(
  admin.includes("contextPreview") &&
  admin.includes("contextInspector") &&
  admin.includes("pageFieldList") &&
  admin.includes("activeField") &&
  admin.includes("preparePreview") &&
  admin.includes("data-sntp-owner-field"),
  "Standard pages use a preview-first editor with one focused inspector and contextual click-to-edit wiring."
);
expect(admin.includes("Previous versions") && admin.includes("Restore original") && admin.includes("Update live site"), "Revision history, restore, and explicit live-update controls remain available.");

expect(
  admin.includes('scienceTool') &&
  admin.includes("scienceToolGrid") &&
  admin.includes("Human evidence studies") &&
  admin.includes("Body-system explainers") &&
  admin.includes("<ScienceManager") &&
  admin.includes("<BodySystemManager"),
  "Science is progressively disclosed into two explicit structured tools."
);
expect(
  science.includes("selectedStudyId") &&
  science.includes("scienceWorkbench") &&
  science.includes("scienceStudyNav") &&
  science.includes("selectedStudy") &&
  !science.includes("scienceStudyList"),
  "Human evidence editing is selection-first rather than rendering every study as a full form."
);
expect(
  science.includes("What researchers found") &&
  science.includes("Why it matters") &&
  science.includes("Limitations") &&
  science.includes("Original source URL") &&
  science.includes("Show on Science page") &&
  science.includes("Keep private"),
  "Science evidence fields and draft/publish boundaries are preserved."
);
expect(bodySystems.includes("What remains uncertain") && bodySystems.includes("Primary sources") && bodySystems.includes("Review status"), "Body-system editor retains uncertainty, sources, and review status.");

expect(
  admin.includes("selectedMediaId") &&
  admin.includes("mediaWorkbench") &&
  admin.includes("mediaItemNav") &&
  admin.includes("selectedMediaItem"),
  "Events and appearances are selection-first instead of a wall of full forms."
);
expect(admin.includes("Show on site") && admin.includes("Keep private") && admin.includes("Update live site"), "Media keeps explicit public/private and save semantics.");

expect(
  newsletter.includes("newsletterPrimaryActions") &&
  newsletter.includes("newsletterMore") &&
  newsletter.includes("Next: publish it to the website.") &&
  newsletter.includes("Next: create the email draft.") &&
  newsletter.includes("Open Mailchimp"),
  "Field Notes emphasizes the next valid workflow action and moves secondary actions into More."
);
expect(newsletter.includes("Preview ↗") && newsletter.includes("Publish to website") && newsletter.includes("Create Mailchimp draft"), "DOCX preview, website publish, and Mailchimp draft workflow remains intact.");
expect(newsletterMailchimp.includes("create") || newsletterMailchimp.includes("Mailchimp"), "Mailchimp draft endpoint remains packaged.");

expect(
  page.includes("Website manager") &&
  page.includes("View live website") &&
  page.includes("Signed in as"),
  "Admin chrome is compact and application-like while preserving owner identity and live-site access."
);
expect(css.includes("v40.51") && css.includes(".contextInspector") && css.includes(".scienceWorkbench") && css.includes(".mediaWorkbench") && css.includes(".newsletterMore"), "v40.51 desktop workspace styles cover focused page, science, media, and Field Notes workflows.");
expect(css.includes("Preserve the existing small-screen behavior until the dedicated mobile pass"), "This release explicitly preserves mobile behavior instead of silently starting the mobile redesign.");

expect(adminContent.includes('"science.entries_json"') && adminContent.includes('"science.body_systems_json"'), "Existing structured Science storage contracts are unchanged.");
expect(adminApi.includes("getAdminUser") && adminApi.includes("isSameOrigin(request)"), "Owner write authorization and same-origin protection remain intact.");
expect(auth.includes('"dreliebeyondplastic@gmail.com"') && auth.includes('"pegg@gymfinityapp.com"'), "Approved owner access remains limited to the existing allowlist.");
expect(build.includes("v40.51-airbnb-admin-ux"), "Build marker identifies the Airbnb-informed owner UX release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const panel = read("app/admin/AdminPanel.tsx");
const css = read("app/admin/admin.module.css");
const pageEditor = read("app/lib/page-editor.ts");
const benchmark = read("docs/ADMIN_UX_AIRBNB_BENCHMARK.md");
const contentRoute = read("app/admin/api/content/route.ts");
const buildVersion = read("app/build-version.ts");
const pkg = JSON.parse(read("package.json"));

expect(benchmark.includes("## v40.56 Page Studio refinement") && benchmark.includes("two-pane Page Studio"), "Airbnb benchmark records the v40.56 Page Studio pivot and why it was needed.");
expect(panel.includes("pageStudioToolbar") && panel.includes("pageStudioLayout") && panel.includes("pageStudioPanel") && panel.includes("pageStudioPreview"), "Standard Website editing is implemented as one Page Studio instead of three simultaneous navigation columns.");
expect(!panel.includes('<aside className={styles.pageTree}'), "Standard Website editing no longer renders the permanent page tree.");
expect(panel.includes('aria-label="Choose a website page"') && panel.includes("OWNER_PAGE_DEFINITIONS.map") && panel.includes("pageStudioPagePicker"), "Page selection is consolidated into one owner-facing page switcher.");
expect(!panel.includes("<small>{item.href}</small>"), "Page switching does not expose raw route paths to the owner.");

const openingIndex = panel.indexOf('{ id: "opening", label: "Opening message"');
const announcementIndex = panel.indexOf('{ id: "announcement", label: "Announcement"');
expect(openingIndex !== -1 && announcementIndex !== -1 && openingIndex < announcementIndex, "Homepage prioritizes common opening-message work ahead of the less frequent announcement task.");
expect(panel.includes('label: "Events & Media"') && panel.includes('label: "Field Notes signup"'), "Homepage groups are named after recognizable public sections rather than CMS concepts.");
expect(panel.includes("activePageGroup") && panel.includes("groupForField") && panel.includes("pageSectionList"), "Section-first progressive disclosure drives the Website editor.");
expect(panel.includes("setActivePageGroup(groupForField(page.id, key)?.id") && panel.includes("data-sntp-owner-field"), "Clicking editable preview text opens the correct Page Studio section and field context.");
expect(panel.includes("renderField(activeField, true)") && panel.includes("focusedFieldHeader"), "Selecting one field still opens the focused direct editor rather than an accordion of unrelated controls.");
expect(panel.includes("Publish change") && panel.includes("History &amp; restore") && panel.includes("Reset to reviewed website text"), "Explicit publishing, revision history, and safe reset remain available in the focused editor.");

expect(panel.includes('previewDevice') && panel.includes('>Desktop</button>') && panel.includes('>Phone</button>'), "Page Studio provides explicit desktop and phone preview modes.");
expect(css.includes(".pageStudioPreviewMobile .pageStudioPreviewFrame iframe") && css.includes("width: 390px"), "Phone preview is constrained to a real 390px editing viewport.");
expect(css.includes(".pageStudioLayout") && css.includes("grid-template-columns: 360px minmax(0, 1fr)"), "Wide desktop Page Studio gives most horizontal space to the public page preview.");
expect(css.includes("grid-template-columns: 320px minmax(0,1fr)") && css.includes("@media (max-width: 900px)"), "Page Studio remains two-pane at 1024-class widths and collapses cleanly below the desktop breakpoint.");
expect(css.includes(".pageStudioToolbar") && css.includes("position: sticky") && css.includes("top: 120px"), "Page, device, live state, and open-page controls stay anchored while editing.");
expect(panel.includes("Open this page ↗"), "Page-specific live navigation is clearly distinguished from the global View website action.");

expect(panel.includes('field.kind === "text" && field.maxLength > 120') && panel.includes('type={field.kind === "url" ? "url" : field.kind === "email" ? "email" : "text"}'), "Long editorial copy uses multi-line controls while URLs and emails remain proper inputs.");
expect(panel.includes("owner_preview=1") && panel.includes("preparePreview"), "The dominant preview keeps the existing same-origin owner-preview behavior and contextual click wiring.");
expect(panel.includes('const isScience = page.kind === "science"') && panel.includes("<ScienceManager") && panel.includes("<BodySystemManager"), "Science remains on its structured evidence editors rather than being flattened into Page Studio copy fields.");
expect(contentRoute.includes("isSameOrigin(request)") && contentRoute.includes("expectedVersion") && contentRoute.includes("getAdminUser()"), "Owner writes retain authentication, same-origin protection, and optimistic concurrency.");
expect(pageEditor.includes('kind?: "standard" | "science"') && pageEditor.includes('id: "science"'), "Page registry keeps the specialized Science boundary explicit.");
expect(!existsSync(join(root, "app/admin-qa")), "Temporary visual-QA route is absent from the release source.");
expect(pkg.scripts["release:audit"].includes("v40-56-page-studio-audit.mjs"), "v40.56 Page Studio audit is part of the full release gate.");
expect(buildVersion.includes("v40.56-page-studio"), "Build marker identifies the v40.56 Page Studio release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

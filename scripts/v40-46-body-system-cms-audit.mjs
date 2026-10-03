#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const admin = read("app/admin/AdminPanel.tsx");
const manager = read("app/admin/BodySystemManager.tsx");
const adminContent = read("app/lib/admin-content.ts");
const helper = read("app/lib/body-system-overrides.ts");
const bodyPage = read("app/science/body/[slug]/page.tsx");
const sciencePage = read("app/science/page.tsx");
const adminApi = read("app/admin/api/content/route.ts");
const build = read("app/build-version.ts");

expect(exists("app/admin/BodySystemManager.tsx"), "Body-system page manager is packaged.");
expect(admin.includes("<BodySystemManager") && admin.includes('"science.body_systems_json"'), "Science workspace includes the body-system page manager.");
expect((manager.includes("Edit the deeper science explainers") && manager.includes("Live page preview")) || (manager.includes("Body-system explainers") && manager.includes("Live preview")), "Body-system manager uses a page-based editing workflow with a live preview.");
expect(manager.includes("Article sections") && manager.includes("What we know") && manager.includes("What remains uncertain") && manager.includes("Primary sources"), "Body-system editor keeps scientific explanation fields structured.");
expect(manager.includes("Review status") && manager.includes("Review note") && (manager.includes("Restore original") || manager.includes("Reset page")), "Body-system editor preserves review state and rollback.");
expect(adminContent.includes('"science.body_systems_json"') && adminContent.includes("validateOwnerBodySystemOverrides"), "Body-system overrides use validated owner-content storage.");
expect(adminContent.includes("verified body-system page must include at least one primary source") && adminContent.includes("needs takeaways, known evidence, and uncertainty notes"), "Body-system validation requires evidence boundaries before a page can be marked verified.");
expect(adminContent.includes("Only the seven reviewed body-system pages can be managed here"), "Body-system editor is constrained to the existing reviewed page set.");
expect(helper.includes("getEffectiveBodySystems") && helper.includes("getEffectiveBodySystem") && helper.includes("applyOverride"), "Public body-system content resolves reviewed source plus owner override.");
expect(bodyPage.includes("getEffectiveBodySystem") && bodyPage.includes('export const dynamic = "force-dynamic"'), "Individual body-system pages load owner updates dynamically.");
expect(sciencePage.includes("getEffectiveBodySystems") && sciencePage.includes("effectiveBodySystems"), "Science library cards use effective owner-updated body-system content.");
expect(adminApi.includes("MAX_ADMIN_BODY_BYTES = 160_000") && adminApi.includes("bodyIsReasonable(request, MAX_ADMIN_BODY_BYTES)"), "Larger structured body-system writes remain bounded by the existing protected endpoint.");
expect(build.includes("v40.46-body-system-cms"), "Build marker identifies body-system CMS phase 3C.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

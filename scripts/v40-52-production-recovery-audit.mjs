#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const pkg = JSON.parse(read("package.json"));
const deploy = read("scripts/deploy-production.sh");
const worker = read("worker/index.ts");
const version = read("app/build-version.ts");
const home = read("app/page.tsx");
const chrome = read("app/components/SiteChrome.tsx");
const admin = read("app/admin/page.tsx");

expect(existsSync(join(root, "docs/PRODUCTION_DEPLOYMENT.md")), "Production deploy runbook is packaged.");
expect(pkg.scripts["deploy:production"] === "bash scripts/deploy-production.sh", "Production deploy has one named guarded command.");
expect(pkg.scripts["release:audit"].includes("v40-52-production-recovery-audit.mjs"), "Production recovery audit is part of the release gate.");

expect(deploy.includes("git fetch origin main") && deploy.includes('local_head="$(git rev-parse HEAD)"') && deploy.includes('main_head="$(git rev-parse origin/main)"'), "Deploy refuses stale checkouts by comparing local HEAD with origin/main.");
expect(deploy.includes("npm run release:audit") && deploy.includes("npm run build"), "Deploy re-runs release validation and performs a fresh build.");
expect(deploy.includes(".wrangler/deploy/config.json") && deploy.includes('npx wrangler deploy --config "$config_path"'), "Deploy uses the freshly generated Cloudflare configuration explicitly.");
expect(deploy.includes("say-no-to-plastic") && deploy.includes("saynotoplastic-db") && deploy.includes("https://saynotoplastic.com"), "Deploy validates the production Worker, D1 binding, and canonical origin before publishing.");
expect(deploy.includes("api/version") && deploy.includes("Scroll to turn the pages") && deploy.includes("saynotoplastic.com/es") && deploy.includes("saynotoplastic.com/admin"), "Post-deploy verification checks the build marker, book regression, Spanish route, and admin route.");

expect(worker.includes('url.hostname.toLowerCase() === "www.saynotoplastic.com"') && worker.includes('canonical.hostname = "saynotoplastic.com"') && worker.includes("Response.redirect(canonical.toString(), 308)"), "Worker canonicalizes www to the apex host.");
expect(home.includes("homeStyles.bookFeature") && !home.includes("<BookJourney"), "Current homepage keeps the static book feature and does not restore BookJourney.");
expect(chrome.includes("language-switcher") && chrome.includes('locale === "es" ? "EN" : "ES"'), "Current site chrome retains the EN/ES switcher.");
expect(admin.includes("Website manager"), "Current admin entry remains packaged.");
expect(version.includes("v40.52-production-recovery"), "Build marker identifies the production recovery release.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

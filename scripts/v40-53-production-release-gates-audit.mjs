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
const migrate = read("scripts/migrate-production.sh");
const revision = read("scripts/prepare-deploy-revision.mjs");
const versionRoute = read("app/api/version/route.ts");
const workflow = read(".github/workflows/release-validation.yml");
const buildVersion = read("app/build-version.ts");
const gitignore = read(".gitignore");

expect(pkg.scripts["db:migrate:production"] === "bash scripts/migrate-production.sh", "Production D1 migrations have one named guarded command.");
expect(pkg.scripts["prepare:deploy-revision"] === "node scripts/prepare-deploy-revision.mjs", "Exact Git revision generation has one named command.");
expect(pkg.scripts["release:audit"].includes("v40-53-production-release-gates-audit.mjs"), "v40.53 production release gates are part of the release audit.");

expect(migrate.includes("git rev-parse FETCH_HEAD") && migrate.includes("saynotoplastic-db") && migrate.includes("e38267d3-beee-4459-b890-3fa1b313e7c7"), "Production migration command refuses stale checkouts and validates the exact D1 database.");
expect(migrate.includes("d1 migrations list saynotoplastic-db --remote") && migrate.includes("d1 migrations apply saynotoplastic-db --remote"), "Production migration command lists, applies, and rechecks remote D1 migrations.");
expect(deploy.includes("d1 migrations list saynotoplastic-db --remote") && deploy.includes("db:migrate:production"), "Production deploy blocks when remote D1 migrations remain unapplied.");

expect(revision.includes('git", ["rev-parse", "HEAD"]') && revision.includes("deploy-revision.generated.ts"), "Build preparation records the exact Git commit in a generated source module.");
expect(versionRoute.includes("DEPLOY_REVISION") && versionRoute.includes("revision: DEPLOY_REVISION"), "Version endpoint reports the exact deployed Git revision.");
expect(deploy.includes("body.revision") && deploy.includes("local_head"), "Post-deploy verification checks the exact Git revision, not only the release label.");
expect(gitignore.includes("/app/deploy-revision.generated.ts"), "Generated deploy revision is excluded from source control.");

expect(workflow.includes("pull_request:") && workflow.includes("push:") && workflow.includes("npm ci") && workflow.includes("npm run release:audit") && workflow.includes("npm run build"), "GitHub validates locked dependencies, the full release audit, and a fresh build on PRs and main.");
expect(!workflow.includes("wrangler deploy") && !workflow.includes("deploy:production"), "GitHub validation cannot publish production without Cloudflare credentials.");
expect(buildVersion.includes("v40.53-production-release-gates"), "Build marker identifies the production release-gates hardening pass.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

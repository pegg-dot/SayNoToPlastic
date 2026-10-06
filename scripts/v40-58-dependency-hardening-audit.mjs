#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });

const pkg = JSON.parse(read("package.json"));
const workflow = read(".github/workflows/release-validation.yml");
const viteConfig = read("vite.config.ts");
const wrangler = read("wrangler.jsonc");
const buildVersion = read("app/build-version.ts");
const securityDoc = read("docs/DEPENDENCY_HARDENING_V40_58.md");
const lock = JSON.parse(read("package-lock.json"));
const patchedSecuritySuccessor =
  pkg.overrides?.sharp === "0.35.5" &&
  pkg.overrides?.["source-map-js"] === "1.2.2" &&
  lock.packages?.["node_modules/sharp"]?.version === "0.35.5" &&
  lock.packages?.["node_modules/source-map-js"]?.version === "1.2.2" &&
  lock.packages?.["node_modules/@img/sharp-linux-x64"]?.version === "0.35.5" &&
  lock.packages?.["node_modules/@img/sharp-libvips-linux-x64"]?.version === "1.3.4";

const expectedDependencies = {
  next: "16.3.8",
  react: "19.2.8",
  "react-dom": "19.2.8",
  fflate: "0.7.5",
};
const expectedDevDependencies = {
  "@cloudflare/vite-plugin": "1.62.5",
  "@vitejs/plugin-rsc": "0.5.26",
  "eslint-config-next": "16.3.8",
  "react-server-dom-webpack": "19.2.8",
  vinext: "0.0.50",
  vite: "8.3.2",
  wrangler: "4.147.0",
};

for (const [name, version] of Object.entries(expectedDependencies)) {
  expect(pkg.dependencies?.[name] === version, `${name} is pinned to the validated production security version ${version}.`);
}
for (const [name, version] of Object.entries(expectedDevDependencies)) {
  expect(pkg.devDependencies?.[name] === version, `${name} is pinned to the validated build-tool version ${version}.`);
}
expect(pkg.scripts?.["security:audit:production"] === "npm audit --omit=dev --audit-level=low", "Production dependency audit has one named command.");
expect(pkg.scripts?.["release:audit"]?.includes("v40-58-dependency-hardening-audit.mjs"), "v40.58 dependency hardening audit is part of the release gate.");
expect(workflow.includes("Audit production dependencies") && workflow.includes("npm run security:audit:production"), "GitHub release validation blocks PRs and main when production dependencies have a known npm advisory.");
expect(viteConfig.includes('from "./build/sites-vite-plugin.ts"'), "Vite config uses an explicit TypeScript extension for native config-loader compatibility.");
expect(patchedSecuritySuccessor, "Package lock retains the validated dependency baseline with the v40.62 patched sharp/source-map-js security successor.");
expect(wrangler.includes('"binding": "DB"') && wrangler.includes('"database_name": "saynotoplastic-db"'), "Existing production D1 binding remains unchanged.");
expect(wrangler.includes('"PUBLIC_SITE_URL": "https://saynotoplastic.com"') && wrangler.includes('"name": "say-no-to-plastic"'), "Existing production Worker identity and canonical origin remain unchanged.");
expect(buildVersion.includes("v40.58-dependency-hardening"), "Build marker identifies the dependency hardening release.");
expect(securityDoc.includes("0 production vulnerabilities") && securityDoc.includes("dev/build tooling") && securityDoc.includes("Vinext 1.0.1") && securityDoc.includes("HTTP 500"), "Security record distinguishes the clean production tree, remaining development-tool advisories, and the rejected incompatible Vinext upgrade.");
expect(securityDoc.includes("192 rendered checks, 0 flagged") && securityDoc.includes("14 findings confined to dev/build tooling"), "Security record captures the final rendered compatibility sweep and the bounded dev-tool advisory count.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

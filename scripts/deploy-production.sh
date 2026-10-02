#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

fail() {
  echo "PRODUCTION DEPLOY BLOCKED: $*" >&2
  exit 64
}

command -v git >/dev/null 2>&1 || fail "git is required."
command -v node >/dev/null 2>&1 || fail "node is required."
command -v npm >/dev/null 2>&1 || fail "npm is required."

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Run this from the Say No To Plastic Git checkout."

# Do not let an old Downloads folder or stale branch overwrite the live Worker.
git fetch origin main --quiet
local_head="$(git rev-parse HEAD)"
main_head="$(git rev-parse origin/main)"
if [[ "$local_head" != "$main_head" ]]; then
  fail "This checkout is not the current origin/main. Sync main before deploying."
fi

# Uncommitted tracked source changes should never be smuggled into production.
git diff --quiet || fail "Tracked files have uncommitted changes."
git diff --cached --quiet || fail "The index has uncommitted changes."

echo "Running full release audit..."
npm run release:audit

echo "Building a fresh Vinext / Cloudflare artifact..."
npm run build

pointer=".wrangler/deploy/config.json"
[[ -f "$pointer" ]] || fail "Build did not create $pointer."

config_path="$(
  node --input-type=module - "$pointer" <<'NODE'
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const pointerPath = process.argv[2];
const pointer = JSON.parse(readFileSync(pointerPath, "utf8"));
if (!pointer.configPath || typeof pointer.configPath !== "string") {
  throw new Error("generated deployment pointer has no configPath");
}
process.stdout.write(resolve(dirname(pointerPath), pointer.configPath));
NODE
)"

[[ -f "$config_path" ]] || fail "Generated Wrangler config is missing: $config_path"

node --input-type=module - "$config_path" <<'NODE'
import { readFileSync } from "node:fs";
const config = JSON.parse(readFileSync(process.argv[2], "utf8"));
if (config.name !== "say-no-to-plastic") throw new Error(`Unexpected Worker: ${config.name}`);
if (config.main !== "index.js") throw new Error(`Unexpected generated main: ${config.main}`);
if (config.d1_databases?.find((entry) => entry.binding === "DB")?.database_name !== "saynotoplastic-db") {
  throw new Error("Production D1 binding is missing or changed.");
}
if (config.vars?.PUBLIC_SITE_URL !== "https://saynotoplastic.com") {
  throw new Error("Production site URL is missing or changed.");
}
NODE

build_version="$(
  node --input-type=module <<'NODE'
import { readFileSync } from "node:fs";
const source = readFileSync("app/build-version.ts", "utf8");
const match = source.match(/BUILD_VERSION\s*=\s*"([^"]+)"/);
if (!match) throw new Error("Could not read BUILD_VERSION.");
process.stdout.write(match[1]);
NODE
)"

echo "Deploying fresh artifact for $build_version"
npx wrangler deploy --config "$config_path"

echo "Verifying production..."
version_body="$(curl -fsS --max-time 25 -H 'Cache-Control: no-cache' "https://saynotoplastic.com/api/version?deploy_check=$(date +%s)")"
printf '%s' "$version_body" | grep -Fq "$build_version" || fail "Production version endpoint does not report $build_version."

home_body="$(curl -fsS --max-time 25 -H 'Cache-Control: no-cache' "https://saynotoplastic.com/?deploy_check=$(date +%s)")"
if printf '%s' "$home_body" | grep -Fq "Scroll to turn the pages"; then
  fail "Old book-flip homepage is still being served."
fi
printf '%s' "$home_body" | grep -Eq 'href="/es"|href=/es' || fail "Homepage does not expose the Spanish route."

spanish_body="$(curl -fsS --max-time 25 -H 'Cache-Control: no-cache' "https://saynotoplastic.com/es?deploy_check=$(date +%s)")"
printf '%s' "$spanish_body" | grep -Eiq 'español|La contaminación|El contaminante|Inicio|Evidencia|Ciencia' || fail "Spanish homepage did not return expected localized content."

admin_status="$(curl -sS --max-time 25 -o /dev/null -w '%{http_code}' "https://saynotoplastic.com/admin")"
case "$admin_status" in
  200|301|302|303|307|308|401|403) ;;
  *) fail "Admin route returned unexpected HTTP status $admin_status." ;;
esac

www_status="$(curl -sS --max-time 25 -o /dev/null -w '%{http_code}' "https://www.saynotoplastic.com/")"
case "$www_status" in
  301|302|303|307|308) ;;
  000) echo "WARNING: www is not currently routed to this Worker. Fix the Cloudflare www DNS/custom-domain binding so it reaches say-no-to-plastic, then the Worker will canonicalize it to the apex." ;;
  *) echo "WARNING: www returned HTTP $www_status instead of a redirect. Check the Cloudflare www DNS/custom-domain binding." ;;
esac

echo "Production verification passed for $build_version"

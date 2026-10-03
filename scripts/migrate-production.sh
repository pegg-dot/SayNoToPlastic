#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

fail() {
  echo "PRODUCTION MIGRATION BLOCKED: $*" >&2
  exit 64
}

command -v git >/dev/null 2>&1 || fail "git is required."
command -v node >/dev/null 2>&1 || fail "node is required."
command -v npm >/dev/null 2>&1 || fail "npm is required."

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Run this from the Say No To Plastic Git checkout."

git fetch origin main --quiet
local_head="$(git rev-parse HEAD)"
main_head="$(git rev-parse FETCH_HEAD)"
if [[ "$local_head" != "$main_head" ]]; then
  fail "This checkout is not the current origin/main. Sync main before migrating production."
fi

git diff --quiet || fail "Tracked files have uncommitted changes."
git diff --cached --quiet || fail "The index has uncommitted changes."

node --input-type=module <<'NODE'
import { readFileSync } from "node:fs";
const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
const db = config.d1_databases?.find((entry) => entry.binding === "DB");
if (!db) throw new Error("Production DB binding is missing.");
if (db.database_name !== "saynotoplastic-db") throw new Error(`Unexpected production database: ${db.database_name}`);
if (db.database_id !== "e38267d3-beee-4459-b890-3fa1b313e7c7") throw new Error("Production database ID changed.");
NODE

echo "Unapplied production D1 migrations before apply:"
npx wrangler d1 migrations list saynotoplastic-db --remote

echo "Applying unapplied production D1 migrations..."
npx wrangler d1 migrations apply saynotoplastic-db --remote

echo "Rechecking production D1 migration state..."
remaining="$(npx wrangler d1 migrations list saynotoplastic-db --remote)"
printf '%s\n' "$remaining"
if printf '%s\n' "$remaining" | grep -Eq '[0-9]{4}_[A-Za-z0-9_.-]+\.sql'; then
  fail "One or more production D1 migrations are still unapplied."
fi

echo "Production D1 migrations are current."

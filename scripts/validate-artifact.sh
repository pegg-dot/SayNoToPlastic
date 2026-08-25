#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

project_root="${SITES_PROJECT_ROOT}"
deploy_pointer="${project_root}/.wrangler/deploy/config.json"
legacy_hosting="${project_root}/dist/.openai/hosting.json"

[[ -f "${deploy_pointer}" ]] || {
  echo "Missing generated Wrangler deployment pointer: .wrangler/deploy/config.json" >&2
  exit 66
}

[[ -f "${legacy_hosting}" ]] || {
  echo "Missing packaged legacy hosting manifest: dist/.openai/hosting.json" >&2
  exit 66
}

node --input-type=module - "${project_root}" "${deploy_pointer}" "${legacy_hosting}" <<'NODE'
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [projectRoot, deployPointerPath, legacyHostingPath] =
  process.argv.slice(2);

const fail = (message) => {
  throw new Error(message);
};

const assertFile = async (path, label) => {
  let info;
  try {
    info = await stat(path);
  } catch {
    fail(`Missing ${label}: ${path}`);
  }

  if (!info.isFile() || info.size === 0) {
    fail(`${label} is missing or empty: ${path}`);
  }
};

const assertDirectory = async (path, label) => {
  let info;
  try {
    info = await stat(path);
  } catch {
    fail(`Missing ${label}: ${path}`);
  }

  if (!info.isDirectory()) {
    fail(`${label} is not a directory: ${path}`);
  }
};

const pointer = JSON.parse(
  await readFile(deployPointerPath, "utf8")
);

if (!pointer.configPath || typeof pointer.configPath !== "string") {
  fail(".wrangler/deploy/config.json does not contain configPath");
}

const generatedConfigPath = resolve(
  dirname(deployPointerPath),
  pointer.configPath
);

await assertFile(
  generatedConfigPath,
  "generated Cloudflare Wrangler config"
);

const config = JSON.parse(
  await readFile(generatedConfigPath, "utf8")
);

if (config.name !== "say-no-to-plastic") {
  fail(
    `Unexpected Worker name: ${JSON.stringify(config.name)}`
  );
}

if (config.main !== "index.js") {
  fail(
    `Generated Worker main must be index.js; received ${JSON.stringify(config.main)}`
  );
}

if (config.workers_dev !== true) {
  fail("workers_dev must remain enabled for staging");
}

if (
  !Array.isArray(config.compatibility_flags) ||
  !config.compatibility_flags.includes("nodejs_compat")
) {
  fail("Generated config is missing nodejs_compat");
}

if (config.assets?.binding !== "ASSETS") {
  fail("Generated config is missing the ASSETS binding");
}

if (config.images?.binding !== "IMAGES") {
  fail("Generated config is missing the IMAGES binding");
}

const db = Array.isArray(config.d1_databases)
  ? config.d1_databases.find((entry) => entry.binding === "DB")
  : undefined;

if (!db) {
  fail("Generated config is missing the DB D1 binding");
}

if (db.database_name !== "saynotoplastic-db") {
  fail(
    `Unexpected D1 database name: ${JSON.stringify(db.database_name)}`
  );
}

if (
  db.database_id !==
  "e38267d3-beee-4459-b890-3fa1b313e7c7"
) {
  fail(
    `Unexpected D1 database ID: ${JSON.stringify(db.database_id)}`
  );
}

if (
  config.vars?.PUBLIC_SITE_URL !==
  "https://saynotoplastic.com"
) {
  fail(
    `Unexpected PUBLIC_SITE_URL: ${JSON.stringify(config.vars?.PUBLIC_SITE_URL)}`
  );
}

const workerPath = resolve(
  dirname(generatedConfigPath),
  config.main
);

await assertFile(
  workerPath,
  "generated Cloudflare Worker entry"
);

if (!config.assets?.directory) {
  fail("Generated config does not specify an assets directory");
}

const assetsPath = resolve(
  dirname(generatedConfigPath),
  config.assets.directory
);

await assertDirectory(
  assetsPath,
  "generated client assets directory"
);

// Keep validating the packaged legacy manifest while the repository still
// intentionally carries the old Sites compatibility layer. It is not the
// production deployment source of truth.
JSON.parse(
  await readFile(legacyHostingPath, "utf8")
);

console.log("Validated Cloudflare deployment artifact:");
console.log(`  Worker: ${workerPath}`);
console.log(`  Config: ${generatedConfigPath}`);
console.log(`  Assets: ${assetsPath}`);
console.log("  D1: DB -> saynotoplastic-db");
console.log("  Images: IMAGES");
console.log("  workers.dev staging: enabled");
NODE

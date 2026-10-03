#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();

if (!/^[0-9a-f]{40}$/.test(revision)) {
  throw new Error(`Unexpected Git revision: ${revision}`);
}

writeFileSync(
  join(root, "app/deploy-revision.generated.ts"),
  `export const DEPLOY_REVISION = "${revision}";\n`,
);
console.log(`Prepared deploy revision ${revision}`);

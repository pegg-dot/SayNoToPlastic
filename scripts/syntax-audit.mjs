#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));

function loadTypeScript() {
  try {
    return require("typescript");
  } catch {
    try {
      const globalRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
      return require(join(globalRoot, "typescript"));
    } catch {
      return null;
    }
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !["node_modules", ".sites-runtime", ".next", "dist"].includes(entry.name)) return walk(path);
    return entry.isFile() ? [path] : [];
  });
}

const ts = loadTypeScript();
if (!ts) {
  console.error("[FAIL] TypeScript is unavailable locally and globally; install dependencies before running syntax:audit.");
  process.exit(1);
}

const files = walk(root).filter((path) => /\.(ts|tsx|mts)$/.test(path) && !path.endsWith("next-env.d.ts"));
const failures = [];
for (const path of files) {
  const source = readFileSync(path, "utf8");
  const kind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const parsed = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, kind);
  for (const diagnostic of parsed.parseDiagnostics) {
    const position = diagnostic.start === undefined ? null : parsed.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
    failures.push(`${relative(root, path)}${position ? `:${position.line + 1}:${position.character + 1}` : ""} ${message}`);
  }
}

for (const failure of failures) console.error(`[FAIL] ${failure}`);
if (!failures.length) console.log(`[PASS] ${files.length} TypeScript/TSX files have no parser diagnostics.`);
console.log(`[SUMMARY] ${files.length} files checked, ${failures.length} syntax failures.`);
process.exitCode = failures.length ? 1 : 0;

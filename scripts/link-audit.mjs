#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appRoot = join(root, "app");
const publicRoot = join(root, "public");
const failures = [];
const checked = new Set();

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !["node_modules", ".sites-runtime", "dist", ".next"].includes(entry.name)) return walk(path);
    return entry.isFile() ? [path] : [];
  });
}

function normalizeRoute(value) {
  const withoutQuery = value.split(/[?#]/)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/$/, "");
}

const staticRoutes = new Set(["/"]);
for (const page of walk(appRoot).filter((path) => path.endsWith(`${sep}page.tsx`))) {
  let route = relative(appRoot, dirname(page)).split(sep).join("/");
  if (!route || route === ".") route = "/";
  else route = `/${route}`;
  if (!route.includes("[")) staticRoutes.add(route);
}
for (const routeFile of walk(appRoot).filter((path) => path.endsWith(`${sep}route.ts`))) {
  const route = `/${relative(appRoot, dirname(routeFile)).split(sep).join("/")}`.replace(/\/$/, "");
  staticRoutes.add(route || "/");
}

const guideSource = readFileSync(join(root, "app/content/guides.ts"), "utf8");
for (const match of guideSource.matchAll(/\bslug:\s*"([^"]+)"/g)) staticRoutes.add(`/resources/${match[1]}`);

const bodySystemSource = readFileSync(join(root, "app/content/body-systems.ts"), "utf8");
for (const match of bodySystemSource.matchAll(/\bslug:\s*"([^"]+)"/g)) staticRoutes.add(`/science/body/${match[1]}`);

const publicPaths = new Set(walk(publicRoot).map((path) => `/${relative(publicRoot, path).split(sep).join("/")}`));
const sourceFiles = walk(appRoot).filter((path) => /\.(?:ts|tsx)$/.test(path));
const internalLinks = [];
for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/\bhref\s*=\s*["'`]([^"'`$]+)["'`]/g)) {
    if (match[1].startsWith("/")) internalLinks.push({ file, href: match[1] });
  }
  for (const match of source.matchAll(/\bhref:\s*["'`]([^"'`$]+)["'`]/g)) {
    if (match[1].startsWith("/")) internalLinks.push({ file, href: match[1] });
  }
}

for (const { file, href } of internalLinks) {
  const route = normalizeRoute(href);
  const key = `${relative(root, file)} -> ${href}`;
  checked.add(key);
  if (staticRoutes.has(route) || publicPaths.has(route)) continue;
  if (/^\/go\/[a-z0-9-]+$/.test(route)) continue;
  if (route.startsWith("/api/")) continue;
  failures.push(`${key} does not match a known route or public asset`);
}

const routeIds = new Map();
for (const page of sourceFiles.filter((path) => path.endsWith(`${sep}page.tsx`))) {
  const source = readFileSync(page, "utf8");
  const ids = new Set([...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]));
  let route = relative(appRoot, dirname(page)).split(sep).join("/");
  route = !route || route === "." ? "/" : `/${route}`;
  if (!route.includes("[")) routeIds.set(route, ids);
}

// Science chapter IDs are rendered from the structured evidence registry rather than
// written as literal JSX id attributes on the page. Register those data-backed IDs so
// the audit checks the actual route contract instead of only static markup.
const evidenceSource = readFileSync(join(root, "app/content/evidence.ts"), "utf8");
const scienceIds = routeIds.get("/science") ?? new Set();
for (const match of evidenceSource.matchAll(/\{\s*id:\s*"([^"]+)",\s*navLabel:/g)) scienceIds.add(match[1]);
routeIds.set("/science", scienceIds);

for (const { file, href } of internalLinks.filter((item) => item.href.includes("#"))) {
  const [pathname, fragment] = href.split("#");
  if (!fragment || !pathname || pathname !== normalizeRoute(pathname)) continue;
  const ids = routeIds.get(pathname);
  if (ids && !ids.has(fragment)) failures.push(`${relative(root, file)} -> ${href} points to a missing route id`);
}

console.log(`[PASS] ${checked.size} internal link references checked against ${staticRoutes.size} routes and ${publicPaths.size} public assets.`);
if (failures.length) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  console.error(`[SUMMARY] ${failures.length} broken internal link references.`);
  process.exitCode = 1;
} else {
  console.log("[SUMMARY] 0 broken internal link references.");
}

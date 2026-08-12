#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

const envFile = resolve(argumentValue("--env-file") || ".env.example");
const ebookPath = argumentValue("--ebook") ? resolve(argumentValue("--ebook")) : null;
const strict = process.argv.includes("--strict");
const production = process.argv.includes("--production");
const failures = [];
const warnings = [];
const passes = [];

function pass(message) { passes.push(message); }
function warn(message) { warnings.push(message); }
function fail(message) { failures.push(message); }
function requireValue(env, key, predicate, message) {
  const value = env[key]?.trim();
  if (!value || !predicate(value)) fail(message || `${key} is missing or invalid.`);
  else pass(`${key} is present and structurally valid.`);
}

let fileEnv = {};
if (existsSync(envFile)) {
  fileEnv = parseEnv(await readFile(envFile, "utf8"));
  pass(`Loaded environment structure from ${envFile}.`);
} else {
  fail(`Environment file not found: ${envFile}`);
}
const env = { ...fileEnv, ...process.env };

const productPath = resolve("app/content/book-product.json");
let product;
try {
  product = JSON.parse(await readFile(productPath, "utf8"));
  pass("Book product data parses successfully.");
} catch (error) {
  fail(`Book product data could not be read: ${error instanceof Error ? error.message : String(error)}`);
}

if (product) {
  for (const key of ["title", "subtitle", "author", "collaborator", "productKey", "price", "currency", "format"]) {
    if (typeof product[key] !== "string" || !product[key].trim()) fail(`Book product field ${key} is missing.`);
    else pass(`Book product field ${key} is set.`);
  }
  const price = Number(product.price);
  if (!Number.isFinite(price) || price <= 0 || !/^\d+\.\d{2}$/.test(product.price)) fail("Book price must be a positive decimal with two digits.");
  else pass("Book price format is valid.");
  if (!/^[A-Z]{3}$/.test(product.currency || "")) fail("Book currency must be a three-letter uppercase code.");
  if (!Number.isInteger(product.delivery?.successLinkDays) || product.delivery.successLinkDays < 1) fail("successLinkDays must be a positive integer.");
  if (!Number.isInteger(product.delivery?.emailLinkDays) || product.delivery.emailLinkDays < 1) fail("emailLinkDays must be a positive integer.");
  const publication = product.publication || {};
  for (const key of ["publicationDate", "pageCount", "isbn"]) {
    if (publication[key] === null || publication[key] === "") warn(`Publication metadata still needs ${key}.`);
  }
  if (publication.previewPermission === "pending") warn("Preview/sample permission is still pending.");
}

try {
  const hosting = JSON.parse(await readFile(resolve(".openai/hosting.json"), "utf8"));
  if (hosting.d1 === "DB") pass("D1 binding is declared as DB.");
  else fail("D1 binding must be DB.");
  if (hosting.r2 === "EBOOKS") pass("R2 binding is declared as EBOOKS.");
  else fail("R2 binding must be EBOOKS.");
} catch (error) {
  fail(`Hosting bindings could not be read: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const migrations = await readdir(resolve("drizzle"));
  if (migrations.includes("0004_commerce_delivery_leases.sql")) pass("Commerce delivery lease migration is present.");
  else fail("Migration 0004_commerce_delivery_leases.sql is missing.");
  if (migrations.includes("0005_site_operations.sql")) pass("Site operations and subscription migration is present.");
  else fail("Migration 0005_site_operations.sql is missing.");
} catch (error) {
  fail(`Migration directory could not be read: ${error instanceof Error ? error.message : String(error)}`);
}

const mode = (env.COMMERCE_MODE || "woocommerce").trim().toLowerCase();
if (!["stripe", "woocommerce"].includes(mode)) fail("COMMERCE_MODE must be stripe or woocommerce.");
else pass(`COMMERCE_MODE is ${mode}.`);
const enforceActivation = strict || production || mode === "stripe";

if (enforceActivation) {
  requireValue(env, "PUBLIC_SITE_URL", (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || ["localhost", "127.0.0.1"].includes(url.hostname);
    } catch { return false; }
  });
  requireValue(env, "STRIPE_SECRET_KEY", (value) => /^sk_(test|live)_/.test(value));
  requireValue(env, "STRIPE_WEBHOOK_SECRET", (value) => value.startsWith("whsec_") && value.length > 12);
  requireValue(env, "STRIPE_PRICE_ID", (value) => value.startsWith("price_") && value.length > 8);
  requireValue(env, "STRIPE_API_VERSION", (value) => /^\d{4}-\d{2}-\d{2}\.[a-z]+$/.test(value));
  requireValue(env, "STRIPE_AUTOMATIC_TAX", (value) => ["true", "false"].includes(value.toLowerCase()));
  requireValue(env, "EBOOK_ACCESS_SECRET", (value) => value.length >= 32);
  requireValue(env, "EBOOK_OBJECT_KEY", (value) => Boolean(value) && !value.startsWith("/") && value.toLowerCase().endsWith(".pdf"));
  requireValue(env, "EBOOK_DOWNLOAD_FILENAME", (value) => value.toLowerCase().endsWith(".pdf") && !/[\\/\r\n]/.test(value));
  requireValue(env, "EBOOK_SHA256", (value) => /^[a-f0-9]{64}$/i.test(value));
  requireValue(env, "RESEND_API_KEY", (value) => value.startsWith("re_") && value.length > 10);
  requireValue(env, "RESEND_FROM_EMAIL", (value) => /<[^<>\s]+@[^<>\s]+\.[^<>\s]+>$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  requireValue(env, "SUPPORT_EMAIL", (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

  const stripeKey = env.STRIPE_SECRET_KEY || "";
  if (stripeKey.startsWith("sk_live_") && /test|preview|staging|localhost/i.test(env.PUBLIC_SITE_URL || "")) {
    fail("A live Stripe key must not be used on a test or preview URL.");
  }
  if (production) {
    if (mode !== "stripe") fail("--production requires COMMERCE_MODE=stripe.");
    if (!stripeKey.startsWith("sk_live_")) fail("--production requires a live Stripe secret key.");
    else pass("Production gate is using a live Stripe credential shape.");
  } else if (stripeKey.startsWith("sk_test_") && mode === "stripe") {
    pass("Stripe test-mode credentials are suitable for non-production activation.");
  }
} else {
  warn("Native commerce activation values were not enforced because COMMERCE_MODE is woocommerce. Run with --strict for a launch-readiness gate.");
}

if (ebookPath) {
  try {
    const info = await stat(ebookPath);
    const bytes = await readFile(ebookPath);
    const signature = bytes.subarray(0, 5).toString("ascii");
    const footer = bytes.subarray(Math.max(0, bytes.length - 2_048)).toString("latin1");
    const checksum = createHash("sha256").update(bytes).digest("hex");
    if (!info.isFile()) fail("The ebook path is not a file.");
    else if (signature !== "%PDF-") fail("The ebook does not begin with a PDF signature.");
    else if (info.size < 1_024) fail("The ebook PDF is unexpectedly small and may be incomplete.");
    else if (!footer.includes("%%EOF")) fail("The ebook PDF does not contain an end-of-file marker near its end.");
    else pass(`Ebook PDF signature/footer are valid; size is ${info.size} bytes.`);
    if (env.EBOOK_SHA256 && env.EBOOK_SHA256.toLowerCase() !== checksum) fail("EBOOK_SHA256 does not match the supplied ebook file.");
    else if (env.EBOOK_SHA256) pass("EBOOK_SHA256 matches the supplied ebook file.");
    else warn(`Set EBOOK_SHA256 to ${checksum}.`);
    console.log(`[INFO] Ebook SHA-256: ${checksum}`);
  } catch (error) {
    fail(`Ebook file could not be validated: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  warn("No --ebook path was supplied, so the final PDF and checksum were not verified.");
}

for (const message of passes) console.log(`[PASS] ${message}`);
for (const message of warnings) console.log(`[WARN] ${message}`);
for (const message of failures) console.error(`[FAIL] ${message}`);
console.log(`[SUMMARY] ${passes.length} passed, ${warnings.length} warnings, ${failures.length} failures.`);
process.exitCode = failures.length ? 1 : 0;

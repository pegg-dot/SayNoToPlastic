import { readFile } from "node:fs/promises";

const path = new URL("../app/content/affiliate-products.json", import.meta.url);
const data = JSON.parse(await readFile(path, "utf8"));
const errors = [];
const warnings = [];
const slugs = new Set();
const categorySlugs = new Set((data.categories || []).map((item) => item.slug));

for (const product of data.products || []) {
  if (!product.slug || !/^[a-z0-9-]+$/.test(product.slug)) errors.push(`Invalid product slug: ${product.slug || "missing"}`);
  if (slugs.has(product.slug)) errors.push(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);
  if (!categorySlugs.has(product.category)) errors.push(`${product.slug}: unknown category ${product.category}`);
  if (product.status !== "published") continue;
  for (const field of ["name", "brand", "summary", "useCase", "retailer", "destinationUrl", "relationship", "disclosure", "firsthandStatus", "lastReviewed"]) {
    if (!product[field]) errors.push(`${product.slug}: missing ${field}`);
  }
  try {
    const url = new URL(product.destinationUrl);
    if (url.protocol !== "https:") errors.push(`${product.slug}: destinationUrl must use https`);
  } catch {
    errors.push(`${product.slug}: destinationUrl is invalid`);
  }
  if (!Array.isArray(product.tradeoffs) || product.tradeoffs.length < 1) errors.push(`${product.slug}: at least one tradeoff is required`);
  if (!Array.isArray(product.evidence) || product.evidence.length < 1) errors.push(`${product.slug}: at least one evidence link is required`);
  if (product.relationship === "affiliate" && !/commission|affiliate/i.test(product.disclosure || "")) errors.push(`${product.slug}: affiliate disclosure must state the commission relationship`);
}

if (!(data.products || []).some((product) => product.status === "published")) warnings.push("No recommendations are published. The page will display the review-queue state.");

console.log(`Affiliate preflight: ${(data.products || []).length} catalog records, ${errors.length} errors, ${warnings.length} warnings.`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length) process.exit(1);

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const templates = [
  ["guide-intake.json", ["title","slug","category","readerQuestion","plainLanguageAction","primarySources","reviewedBy","reviewDate","publicationStatus"]],
  ["evidence-study-intake.json", ["studyTitle","primarySourceUrl","journal","publicationDate","humanStudy","sampleSize","findingPlainLanguage","meaningPlainLanguage","limitation","reviewedBy","publicationStatus"]],
  ["media-intake.json", ["id","type","title","platform","date","dateStatus","sourceUrl","mediaUrl","youtubeId","thumbnail","thumbnailRights","ownerApproved","publicationApproval","temporary","replaceWhenOfficialAvailable","published"]],
  ["affiliate-product-intake.json", ["id","product","category","materialsClaim","claimSource","retailer","commissionRelationship","disclosureCopy","priceCheckedAt","imageRights","destinationUrl","reviewedBy","published"]],
];
let failures = 0;
for (const [name, fields] of templates) {
  const file = path.join(root, "docs", "content-templates", name);
  if (!fs.existsSync(file)) { console.error(`FAIL missing ${name}`); failures++; continue; }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const missing = fields.filter((key) => !(key in data));
  if (missing.length) { console.error(`FAIL ${name}: missing ${missing.join(", ")}`); failures++; }
  else console.log(`PASS ${name}: ${fields.length} required fields present`);
  if ("published" in data && data.published !== false) { console.error(`FAIL ${name}: intake must default published=false`); failures++; }
  if ("ownerApproved" in data && data.ownerApproved !== false) { console.error(`FAIL ${name}: intake must default ownerApproved=false`); failures++; }
  if ("publicationStatus" in data && data.publicationStatus !== "draft") { console.error(`FAIL ${name}: intake must default publicationStatus=draft`); failures++; }
  if (name === "media-intake.json" && data.publicationApproval !== "pending") { console.error(`FAIL ${name}: intake must default publicationApproval=pending`); failures++; }
  if (name === "media-intake.json" && data.dateStatus !== "pending_verification") { console.error(`FAIL ${name}: intake must default dateStatus=pending_verification`); failures++; }
  if (name === "media-intake.json" && data.temporary !== false) { console.error(`FAIL ${name}: intake must default temporary=false`); failures++; }
}
const media = JSON.parse(fs.readFileSync(path.join(root,"app/content/media-items.json"),"utf8"));
for (const entry of media.entries ?? []) {
  const publicationApproved = entry.ownerApproved || entry.publicationApproval === "owner_confirmed" || entry.publicationApproval === "user_authorized";
  if (entry.published && (!publicationApproved || entry.status !== "ready" || !entry.sourceUrl)) {
    console.error(`FAIL media ${entry.id}: public record bypasses recorded approval/readiness/source URL`); failures++;
  }
  if (entry.published && entry.publicationApproval === "user_authorized" && entry.ownerApproved !== false) {
    console.error(`FAIL media ${entry.id}: user-authorized interim publication must not be rewritten as owner approval`); failures++;
  }
  if (entry.published && !entry.date && entry.dateStatus !== "pending_verification") {
    console.error(`FAIL media ${entry.id}: missing date must remain explicit pending-verification metadata`); failures++;
  }
}
const affiliate = JSON.parse(fs.readFileSync(path.join(root,"app/content/affiliate-products.json"),"utf8"));
for (const entry of affiliate.products ?? []) {
  if (entry.published && (!entry.ownerApproved || !entry.destinationUrl || !entry.disclosure)) {
    console.error(`FAIL affiliate ${entry.id}: public record bypasses approval/link/disclosure`); failures++;
  }
}
if (failures) process.exit(1);
console.log(`PASS content intake: ${templates.length} templates and public registries retain safe publication boundaries`);

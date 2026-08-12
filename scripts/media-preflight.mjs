#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const catalog = JSON.parse(readFileSync(join(root, "app/content/media-items.json"), "utf8"));
const errors = [];
const warnings = [];
const ids = new Set();

for (const entry of catalog.entries ?? []) {
  if (!entry.id || ids.has(entry.id)) errors.push(`Media id is missing or duplicated: ${entry.id || "<missing>"}`);
  ids.add(entry.id);
  if (!entry.title || !entry.type || !entry.platform || !entry.status) errors.push(`${entry.id}: required descriptive fields are incomplete.`);
  if (!entry.thumbnail || !existsSync(join(root, "public", entry.thumbnail.replace(/^\//, "")))) errors.push(`${entry.id}: thumbnail is missing.`);
  if (entry.published) {
    for (const field of ["sourceUrl", "mediaUrl", "thumbnailRights"]) if (!entry[field]) errors.push(`${entry.id}: published item is missing ${field}.`);
    const approval = entry.ownerApproved || entry.publicationApproval === "owner_confirmed" || entry.publicationApproval === "user_authorized";
    if (!approval) errors.push(`${entry.id}: published item has no recorded publication approval basis.`);
    if (!entry.ownerApproved && entry.publicationApproval === "user_authorized") warnings.push(`${entry.id}: published under explicit project-user authorization; final owner confirmation remains separate.`);
    if (!entry.date) {
      if (entry.dateStatus !== "pending_verification") errors.push(`${entry.id}: published item is missing a verified date or explicit pending-verification state.`);
      else warnings.push(`${entry.id}: publication date is still pending verification.`);
    }
    if (entry.mediaUrl?.includes("youtube") && !entry.youtubeId) errors.push(`${entry.id}: YouTube item is missing youtubeId.`);
    if (entry.status !== "ready") errors.push(`${entry.id}: published item status must be ready.`);
    if (entry.temporary && !entry.replaceWhenOfficialAvailable) errors.push(`${entry.id}: temporary media must declare replacement when the official asset arrives.`);
  } else {
    warnings.push(`${entry.id}: unpublished (${entry.status}).`);
  }
}

for (const warning of warnings) console.warn(`[WARN] ${warning}`);
for (const error of errors) console.error(`[FAIL] ${error}`);
console.log(`[SUMMARY] ${catalog.entries?.length ?? 0} media entries checked; ${errors.length} errors; ${warnings.length} warnings.`);
if (errors.length) process.exit(1);

#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (condition, id, message, status = "resolved") => checks.push({ ok: Boolean(condition), id, message, status });

const actions = read("app/content/actions.ts");
const card = read("app/quick-action-card/page.tsx");
const guides = read("app/content/guides.ts");
const solutions = read("app/solutions/page.tsx");
const anatomy = read("app/components/AnatomyScene.tsx");
const ownerFacts = read("app/content/owner-facts.ts");
const about = read("app/about-dr-elie-haddad/page.tsx");
const mediaData = JSON.parse(read("app/content/media-items.json"));
const media = read("app/media/page.tsx");
const config = read("app/config.ts");
const env = read(".env.example");
const audience = read("app/lib/audience-service.ts");
const book = read("app/homo-plasticus/page.tsx");
const affiliate = JSON.parse(read("app/content/affiliate-products.json"));

const authoredBlock = actions.match(/export const authoredQuickActionCard:[\s\S]*?export const authoredCardRemember/)?.[0] ?? "";
expect((authoredBlock.match(/number: "\d{2}"/g) || []).length === 12 && card.includes("authoredQuickActionCard.map"), "T01", "Supplied 12-step Quick Action Card is preserved as live content.");
expect(["Don’t heat plastic.", "Don’t store food in plastic.", "Don’t drink from plastic."].every((rule) => actions.includes(rule)), "T02", "Exact three core rules are preserved.");
expect(!guides.includes("Let very hot food cool before transferring it to plastic storage"), "T03", "Explicitly rejected plastic-storage sentence is removed.");
expect(guides.includes("Avoid routine plastic water bottles") && guides.includes("reverse osmosis"), "T04", "Water guidance is direct and still explains filter context.");
expect(guides.includes('slug: "plastic-kitchen-conversion"') && solutions.includes("Replace the plastic used around heat and food."), "T05", "Kitchen conversion has a dedicated direct guide and Solutions entry.");
expect(guides.includes('slug: "single-use-plastic-foodware"') && solutions.includes("Remove disposable plastic foodware"), "T06", "Single-use foodware has a direct guide and action bridge.");
expect(anatomy.includes("ovary-labeled.svg") && anatomy.includes("testis-labeled.png"), "T07", "Rejected reproductive fallback blobs are replaced with recognizable labeled views.");
expect(ownerFacts.includes("pending_owner_confirmation") && ownerFacts.includes("source conflict remains recorded internally") && about.includes("Jackson Memorial / Jackson Health") === false && !about.includes("Owner confirmation required") && !about.includes("Not presented as a final credential"), "T08", "Education keeps the source conflict internal while the public page follows the latest direction to remove owner-confirmation workflow language.");
const entries = mediaData.entries || [];
expect(entries.length >= 2 && entries.some((entry) => entry.id === "tedx-invisible-inheritance" && entry.published === true && entry.ownerApproved === false && entry.publicationApproval === "user_authorized" && entry.temporary === true && entry.replaceWhenOfficialAvailable === true) && media.includes("temporary recording") && media.includes("not the official TEDx release"), "T09", "Latest user-authorized TEDx exception is explicit: temporary phone recording is playable, not mislabeled official, and marked for replacement.");
expect(config.includes('DEFAULT_SITE_URL = "https://saynotoplastic.com"') && env.includes("PUBLIC_SITE_URL=https://saynotoplastic.com"), "T10", "Movement canonical and support configuration use Say No to Plastic.");
expect(env.includes("AUDIENCE_PROVIDER=none") && audience.includes('"resend" | "mailchimp"') && audience.includes("MAILCHIMP_AUDIENCE_ID"), "T11", "Mailchimp-versus-Resend is an explicit provider decision with both adapters available.");
expect(entries.every((entry) => "thumbnailRights" in entry && "status" in entry && "published" in entry), "T12", "Media uses an approval-aware editorial registry.");
expect(!book.includes("collaborator-section") && book.includes("With collaboration by"), "T13", "Collaborator credit is limited to the book byline rather than a movement profile.");
expect(Array.isArray(affiliate.products) && affiliate.products.length === 0, "T14", "Affiliate products remain unpublished until reviewed records exist.");
expect(card.includes("action.reviewNote") && actions.includes("Evidence does not currently establish sauna or exercise") && actions.includes("Evidence does not currently establish a specific food or cleanse"), "T15", "Contested detox wording is preserved with visible inline evidence boundaries rather than a separate editorial-note panel.");

// Owner/design gates are expected warnings rather than false completion claims.
checks.push({ ok: true, id: "O01", status: "owner_blocked", message: "Final signature wordmark remains an owner-approved design gate; current text treatment is not labeled final." });
checks.push({ ok: true, id: "O02", status: "review_blocked", message: "Reproductive fallbacks are improved, but final clinical/anatomy approval still requires rendered review." });

for (const check of checks) console.log(`[${check.ok ? (check.status === "resolved" ? "PASS" : "WARN") : "FAIL"}] ${check.id} ${check.message}`);
const failed = checks.filter((check) => !check.ok).length;
const resolved = checks.filter((check) => check.ok && check.status === "resolved").length;
const warnings = checks.filter((check) => check.ok && check.status !== "resolved").length;
console.log(`[SUMMARY] ${resolved} resolved checks, ${warnings} explicit gates, ${failed} failures.`);
if (failed) process.exit(1);

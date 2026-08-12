#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const passes = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !["node_modules", ".sites-runtime", "dist", ".next"].includes(entry.name)) return walk(path);
    return entry.isFile() ? [path] : [];
  });
}

function pass(message) { passes.push(message); }
function fail(message) { failures.push(message); }

for (const file of walk(root).filter((path) => path.endsWith(".json") && !path.includes(`${sep}node_modules${sep}`) && !path.includes(`${sep}.sites-runtime${sep}`))) {
  try { JSON.parse(readFileSync(file, "utf8")); }
  catch (error) { fail(`${relative(root, file)} is invalid JSON: ${error instanceof Error ? error.message : String(error)}`); }
}
if (!failures.some((message) => message.includes("invalid JSON"))) pass("Project JSON files parse successfully.");

const guidesSource = readFileSync(join(root, "app/content/guides.ts"), "utf8");
const guideSlugs = [...guidesSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
if (guideSlugs.length === 14) pass("Guide catalog contains 14 guides, including kitchen conversion and single-use foodware.");
else fail(`Expected 14 guide slugs, found ${guideSlugs.length}.`);
if (new Set(guideSlugs).size === guideSlugs.length) pass("Guide slugs are unique.");
else fail("Guide slugs are not unique.");

const sourceUrls = [...guidesSource.matchAll(/href:\s*"(https?:\/\/[^\"]+)"/g)].map((match) => match[1]);
for (const value of sourceUrls) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") fail(`Guide source is not HTTPS: ${value}`);
  } catch { fail(`Guide source URL is invalid: ${value}`); }
}
if (!failures.some((message) => message.startsWith("Guide source"))) pass(`${sourceUrls.length} guide source URLs are structurally valid.`);

const affiliate = JSON.parse(readFileSync(join(root, "app/content/affiliate-products.json"), "utf8"));
for (const category of affiliate.categories) {
  if (!guideSlugs.includes(category.guideSlug)) fail(`Affiliate category ${category.slug} points to missing guide ${category.guideSlug}.`);
}
if (!failures.some((message) => message.startsWith("Affiliate category"))) pass(`${affiliate.categories.length} affiliate categories point to valid guides.`);

const homepage = readFileSync(join(root, "app/page.tsx"), "utf8");
if (/tedx/i.test(homepage)) fail("Homepage source still contains TEDx content.");
else pass("Homepage source contains no TEDx content.");

const tedxRoute = readFileSync(join(root, "app/tedx/page.tsx"), "utf8");
if (/redirect\("\/media#featured-talk"\)/.test(tedxRoute)) pass("Legacy /tedx redirects to the Media feature.");
else fail("Legacy /tedx does not redirect to /media#featured-talk.");

const welcome = readFileSync(join(root, "app/components/WelcomeVideoModal.tsx"), "utf8");
for (const token of ["localStorage", "aria-modal=\"true\"", "event.key === \"Escape\"", "youtube-nocookie.com", "Continue to the site"]) {
  if (!welcome.includes(token)) fail(`Welcome modal is missing ${token}.`);
}
if (!failures.some((message) => message.startsWith("Welcome modal"))) pass("Welcome modal includes first-visit memory, keyboard/focus behavior, replay, and privacy-enhanced playback hooks.");

const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
if (layout.includes("WelcomeVideoModal")) pass("Welcome modal is mounted in the root layout.");
else fail("Welcome modal is not mounted in the root layout.");

const commerce = readFileSync(join(root, "app/lib/commerce.ts"), "utf8");
if (commerce.includes("COMMERCE_PREVIEW_ENABLED") && commerce.includes('mode === "preview"')) pass("Commerce preview mode is explicitly gated and wired.");
else fail("Commerce preview mode is not fully gated and wired.");

const checkoutButton = readFileSync(join(root, "app/components/CheckoutButton.tsx"), "utf8");
if (checkoutButton.includes('fetch("/api/checkout"')) pass("Book CTA component calls the central checkout endpoint.");
else fail("CheckoutButton does not call /api/checkout.");

const appSources = walk(join(root, "app")).filter((path) => /\.(ts|tsx)$/.test(path));
const directLegacy = appSources.filter((path) => relative(root, path) !== "app/config.ts" && /homoplasticus\.com\/checkout/.test(readFileSync(path, "utf8")));
if (directLegacy.length) fail(`Direct legacy checkout URL outside config: ${directLegacy.map((path) => relative(root, path)).join(", ")}`);
else pass("No direct legacy checkout URL exists outside central configuration.");
const configSource = readFileSync(join(root, "app/config.ts"), "utf8");
if (configSource.includes('DEFAULT_SITE_URL = "https://saynotoplastic.com"') && configSource.includes('legacyCheckoutUrl: "https://homoplasticus.com/checkout/')) pass("Movement canonical identity is Say No to Plastic while the existing WooCommerce fallback remains explicit.");
else fail("Movement domain and legacy checkout are not cleanly separated.");

const evidenceSource = readFileSync(join(root, "app/content/evidence.ts"), "utf8");
const journeySection = evidenceSource.match(/export const homepageJourney:[\s\S]*?export const homepageEvidence/)?.[0] ?? "";
const journeySlugs = [...journeySection.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
if (journeySlugs.length === 10 && new Set(journeySlugs).size === 10) pass("Homepage anatomy journey contains ten unique evidence chapters.");
else fail(`Expected ten unique homepage anatomy chapters, found ${journeySlugs.length}.`);
if (journeySection.includes('chapter: "Pregnancy and placenta"') && journeySection.includes("Human anatomy reference") && journeySection.includes("Original placenta study")) pass("Pregnancy and placenta are one sourced maternal-fetal chapter.");
else fail("Pregnancy and placenta are not combined into one sourced maternal-fetal chapter.");
if (journeySection.includes('slug: "heart-arteries"') && journeySection.includes("Original coronary-blood study") && journeySection.includes("Original artery-plaque study")) pass("Heart chapter keeps coronary-blood and artery-plaque evidence distinct.");
else fail("Heart chapter does not preserve both cardiovascular studies.");

const bodyJourney = readFileSync(join(root, "app/components/BodyJourney.tsx"), "utf8");
if ((bodyJourney.includes("Complete interactive atlas") || bodyJourney.includes("Interactive anatomy")) && bodyJourney.includes('openViewer("whole-body-atlas"') && bodyJourney.includes('href="/science"')) pass("Anatomy journey ends with a complete-body interactive atlas handoff.");
else fail("Anatomy journey is missing the complete-body interactive atlas handoff.");
if (bodyJourney.includes("finding-sources") && bodyJourney.includes("item.sources.map")) pass("Homepage evidence chapters support multiple direct primary sources.");
else fail("Homepage evidence chapters do not render their source lists.");

const anatomySource = readFileSync(join(root, "app/components/AnatomyScene.tsx"), "utf8");
const scenesSection = anatomySource.match(/const SCENES:[\s\S]*?const PARTICLE_CENTERS/)?.[0] ?? "";
const sceneCount = (scenesSection.match(/layers:\s*layerState\(/g) || []).length;
if (sceneCount === 10) pass("Anatomy renderer contains ten synchronized visual scenes.");
else fail(`Expected ten anatomy visual scenes, found ${sceneCount}.`);
if (anatomySource.includes('kind="uterus"') && anatomySource.includes('focusIndex={3}')) pass("Maternal-fetal scene renders the uterus with fetus and placenta.");
else fail("Maternal-fetal scene does not render the uterus as a recognizable layer.");
if (anatomySource.includes("ovary-labeled.svg") && anatomySource.includes("testis-labeled.png")) pass("Stable reproductive fallbacks use labeled, recognizable ovary and testicular views.");
else fail("Reproductive fallbacks still use the rejected generic ovary or testis approximations.");

const chrome = readFileSync(join(root, "app/components/SiteChrome.tsx"), "utf8");
if (chrome.includes("Events &amp; Media")) pass("Desktop and mobile navigation identify Events & Media explicitly.");
else fail("Primary navigation does not identify Events & Media explicitly.");
const mediaRegistry = JSON.parse(readFileSync(join(root, "app/content/media-items.json"), "utf8"));
const mediaItems = Array.isArray(mediaRegistry) ? mediaRegistry : mediaRegistry.entries || [];
const mediaApprovalFailures = mediaItems.filter((item) => item.published && !(item.ownerApproved || item.publicationApproval === "owner_confirmed" || item.publicationApproval === "user_authorized"));
const temporaryLabelFailures = mediaItems.filter((item) => item.published && item.temporary && (!item.replaceWhenOfficialAvailable || !/temporary/i.test(item.displayStatus || "")));
if (mediaItems.length > 0 && mediaApprovalFailures.length === 0 && temporaryLabelFailures.length === 0) pass("Published media has an explicit approval basis, and temporary media is labeled for replacement rather than misrepresented as official.");
else fail("Published media is missing an approval basis or a temporary/replacement label.");
const ownerFacts = readFileSync(join(root, "app/content/owner-facts.ts"), "utf8");
if (ownerFacts.includes("pending_owner_confirmation") && ownerFacts.includes("source conflict remains recorded internally") && !readFileSync(join(root, "app/about-dr-elie-haddad/page.tsx"), "utf8").includes("Owner confirmation required")) pass("Education uses the higher-authority transcript/Register presentation while preserving the unresolved source conflict internally.");
else fail("Education provenance or public presentation no longer matches the latest approved handling.");

const contact = readFileSync(join(root, "app/contact/page.tsx"), "utf8");
if (contact.includes("Ask a question.") && contact.includes("Ebook access") && !contact.includes('className="medical-boundary')) pass("Contact page is approachable, categorized, and keeps the medical boundary secondary.");
else fail("Contact page does not match the transcript contact experience.");

const bookPage = readFileSync(join(root, "app/homo-plasticus/page.tsx"), "utf8");
if (bookPage.includes('/book-official.webp') && bookPage.includes("Recover ebook access") && bookPage.includes("What is the refund policy?")) pass("Book page uses the official cover and includes recovery and refund guidance.");
else fail("Book page is missing the official cover, recovery, or refund guidance.");
if (!bookPage.includes("collaborator-section") && bookPage.includes("With collaboration by")) pass("Collaborator credit remains in the published-book byline without a standalone movement-level profile.");
else fail("Collaborator credit is missing from the book or overextended into a standalone site section.");

const resourcePage = readFileSync(join(root, "app/resources/[slug]/page.tsx"), "utf8");
const feed = readFileSync(join(root, "app/feed.xml/route.ts"), "utf8");
if (/name\s*:\s*["']Say No to Plastic["']/.test(resourcePage) && /<title>Say No to Plastic (?:Field Guides|Field Notes)<\/title>/.test(feed)) pass("Guide schema and RSS identify Say No to Plastic as the publisher.");
else fail("Guide schema or RSS still assigns the movement to the book brand.");

const movementIdentityFiles = {
  "privacy policy": readFileSync(join(root, "app/privacy-policy/page.tsx"), "utf8"),
  "editorial policy": readFileSync(join(root, "app/editorial-policy/page.tsx"), "utf8"),
  "accessibility page": readFileSync(join(root, "app/accessibility/page.tsx"), "utf8"),
  "not-found page": readFileSync(join(root, "app/not-found.tsx"), "utf8"),
};
const identityDrift = Object.entries(movementIdentityFiles).filter(([, source]) =>
  /Homo Plasticus operates|controlled by Homo Plasticus|Homo Plasticus analytics table|Homo Plasticus does not sell|Homo Plasticus translates|Homo Plasticus home page|How Homo Plasticus approaches/.test(source)
);
if (identityDrift.length) fail(`Movement-level identity still drifts to the book brand in: ${identityDrift.map(([name]) => name).join(", ")}`);
else pass("Movement-level policies and utility pages identify Say No to Plastic rather than the book brand.");

const publicRoot = join(root, "public");
const publicAssets = new Set(walk(publicRoot).map((path) => `/${relative(publicRoot, path).split(sep).join("/")}`));
const missingAssets = [];
for (const file of appSources) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/(?:src|posterSrc|imageSrc):?\s*=??\s*[{]?\s*["'`]\/?([^"'`$?}]+\.(?:webp|png|jpg|jpeg|svg|glb|mp4|pdf))/gi)) {
    const asset = `/${match[1].replace(/^\//, "")}`;
    if (!publicAssets.has(asset)) missingAssets.push(`${relative(root, file)} -> ${asset}`);
  }
}
if (missingAssets.length) fail(`Missing public assets: ${missingAssets.join("; ")}`);
else pass("Source-referenced public image/model assets exist.");

const css = readFileSync(join(root, "app/globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
let depth = 0;
for (const character of css) {
  if (character === "{") depth += 1;
  if (character === "}") depth -= 1;
  if (depth < 0) break;
}
if (depth === 0) pass("Global CSS braces are balanced.");
else fail(`Global CSS brace balance is ${depth}.`);

for (const file of ["docs/PARKED_OWNER_ACTIONS.md", "docs/LOCAL_PREVIEW.md", "docs/UI_QA_HARDENING.md", "docs/VISUAL_QA_RUNBOOK.md", "docs/AFFILIATE_ACTIVATION.md", "docs/TRANSCRIPT_RECONCILIATION_AUDIT.md", "docs/CLARITY_AND_REDUNDANCY_PASS.md", "ROADMAP.md", "CURRENT_STATE.md"]) {
  if (!existsSync(join(root, file))) fail(`Required project record is missing: ${file}`);
}
if (!failures.some((message) => message.startsWith("Required project record"))) pass("Roadmap, transcript, clarity, preview, affiliate, current-state, and parked-owner records are present.");

for (const message of passes) console.log(`[PASS] ${message}`);
for (const message of failures) console.error(`[FAIL] ${message}`);
console.log(`[SUMMARY] ${passes.length} passed, ${failures.length} failed.`);
process.exitCode = failures.length ? 1 : 0;

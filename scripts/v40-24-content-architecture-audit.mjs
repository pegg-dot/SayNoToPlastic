#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));
const expect = (ok, label) => checks.push({ ok: Boolean(ok), label });
const hasAll = (text, tokens) => tokens.every((token) => text.includes(token));
const hash = (path) => createHash("sha256").update(readFileSync(join(root, path))).digest("hex");

const bodyPage = read("app/science/body/[slug]/page.tsx");
const bodyVisual = read("app/components/BodySystemVisual.tsx");
const bodyLibrary = read("app/components/BodySystemLibrary.tsx");
const anatomyViewer = read("app/components/AnatomySystemViewer.tsx");
const science = read("app/science/page.tsx");
const guidePage = read("app/resources/[slug]/page.tsx");
const guideLibrary = read("app/components/GuideLibrary.tsx");
const community = read("app/community/page.tsx");
const book = read("app/homo-plasticus/page.tsx");
const media = read("app/media/page.tsx");
const css = read("app/globals.css");
const build = read("app/build-version.ts");
const packageJson = JSON.parse(read("package.json"));

expect(build.includes("v40.24-content-architecture-cleanup") || build.includes("v40.25-reading-flow-polish") || build.includes("v40.26-inline-navigation-final") || build.includes("v40.27-final-predeploy-polish") || (build.includes("v40.28-testicular-final-chapter") || build.includes("v40.33-system-aware-microplastic-flow") || build.includes("v40.34-deployment-release-candidate")), "Build identifier preserves the v40.24 cleanup lineage or advances to v40.25 reading-flow polish.");

expect(!bodyPage.includes("Evidence status") && !bodyPage.includes("Verified primary studies linked") && !bodyPage.includes("ReviewLabel"), "Public body-system pages no longer show internal evidence-status banners.");
expect(hasAll(bodyPage, ["What we know", "What we do not know yet", "References", "Original sources", "All body systems"]), "Body-system pages retain concise evidence boundaries, references, and navigation.");
expect(!bodyPage.includes("<BodySystemLibrary"), "Body-system detail pages no longer repeat a large related-system card library at the bottom.");
expect(hasAll(bodyVisual, ["/images/science/heart.webp", "/images/science/ovary.webp", "/images/science/placenta.webp", "/images/science/science-body-overview.webp", "/images/anatomy/body.png"]), "Body-system hero visuals use the existing anatomical image library instead of abstract CSS-only diagrams.");
expect(bodyVisual.includes("Educational illustration; not a patient scan or diagnostic image."), "Body-system visual boundary remains explicit.");
expect(!bodyLibrary.includes("Verified linked study record") && !bodyLibrary.includes("Primary-source review in progress") && !bodyLibrary.includes("Partially source-linked"), "Science body-system cards no longer expose editorial workflow labels.");
expect(!anatomyViewer.includes("anatomy-viewer-status") && !anatomyViewer.includes("statusLabel(status"), "Interactive anatomy viewers no longer surface editorial review-status badges to readers.");
expect(science.includes('heading="Explore the body system by system."'), "Science body-system navigation uses simple reader-facing framing.");

expect(hasAll(guidePage, ["What the evidence supports", "What you can do now", "guide-sources-disclosure"]) && (guidePage.includes("guide-evidence-pair") || guidePage.includes("guide-prose-section")), "Individual guides keep the evidence/action/source structure in either the v40.24 compact or v40.25 article form.");
expect(!guidePage.includes("guide-book-cta") && !guidePage.includes("CheckoutButton") && !guidePage.includes("Read <em>"), "Repeated book sales block is removed from every individual guide.");
expect(!guidePage.includes("uncertainty-box"), "Separate oversized uncertainty panel remains removed.");
expect(!guideLibrary.includes("guide-starters") && !guideLibrary.includes("Three useful first reads"), "Guide index no longer repeats a featured-reading layer before the actual library.");

expect(!community.includes("Ten connected readings") && !community.includes("Ten-part email course") && !community.includes("CommunityLearningPath") && !community.includes('program="learning-series"'), "Community page removes the repeated ten-reading curriculum and ten-part email-course UI.");
expect(hasAll(community, ["<CommunityChallenge />", "From information to practice", "For the generations ahead."]), "Community retains action, movement, and challenge functions after deduplication.");

expect(!book.includes("projectQuestions") && !book.includes("bodySystems") && book.includes("book-science-bridge"), "Book page replaces repeated body-system summaries with one compact Science bridge.");
expect(hasAll(book, ["Human studies", "Body systems", "How detection works"]), "Book Science bridge keeps three useful deep links.");

expect(!media.includes("media-pathways") && !media.includes("media-brief-list") && media.includes("/media/press-kit"), "Media page removes generic cross-site pathways and routes press resources through one canonical press kit.");
expect(!media.includes("pressBriefStatus") && !media.includes("evidenceBriefings"), "Media page no longer repeats evidence briefings or internal review-status labels.");
const pressKit = read("app/media/press-kit/page.tsx");
expect(hasAll(pressKit, ["pressBriefs", "Open topic →", "Download PDF ↓"]) && !pressKit.includes("pressBriefStatus"), "Press-kit briefings retain full-topic and PDF actions without workflow-status badges.");

expect(hasAll(css, ["body-system-page-v24", "body-system-plate-frame", "book-science-bridge", "media-briefings-v24"]) && (css.includes("guide-page-v24") || css.includes("guide-page-v25")), "v40.24 layout system remains present with the v40.25 guide successor allowed.");
expect(packageJson.scripts?.["content:cleanup"] === "node scripts/v40-24-content-architecture-audit.mjs", "v40.24 audit is registered in package scripts.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved baseline.");
expect(exists("V40_24_CHANGE_MANIFEST.md") && exists("VALIDATION_REPORT_V40_24.md") && exists("docs/V40_24_CONTENT_ARCHITECTURE.md"), "v40.24 change, validation, and architecture records are packaged.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

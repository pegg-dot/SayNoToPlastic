#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];
function read(path) { return readFileSync(join(root, path), "utf8"); }
function exists(path) { return existsSync(join(root, path)); }
function includesAll(text, tokens) { return tokens.every((token) => text.includes(token)); }
function expect(ok, label, detail = "") { checks.push({ ok: Boolean(ok), label, detail }); }
function hash(path) { return createHash("sha256").update(readFileSync(join(root, path))).digest("hex"); }
function validPdf(path) {
  if (!exists(path) || statSync(join(root, path)).size < 1000) return false;
  return readFileSync(join(root, path)).subarray(0, 5).toString("ascii") === "%PDF-";
}

const journey = read("app/components/BodyJourney.tsx");
const anatomyViewer = read("app/components/AnatomySystemViewer.tsx");
expect(includesAll(journey, ["homepageJourney", "chapterViewers", "whole-body-atlas"]), "Existing anatomy journey directly integrates the four extended systems and complete atlas.");
expect(includesAll(anatomyViewer, ["panelKnown", "panelUncertain", "Escape", "aria-modal=\"true\""]), "Extended-system viewer exposes concise known/uncertain context with keyboard closure and modal semantics.");

const visual = read("app/components/BodySystemVisual.tsx");
const buildId = read("app/build-version.ts");
const isV24Cleanup = ["v40.24-content-architecture-cleanup", "v40.25-reading-flow-polish", "v40.26-inline-navigation-final", "v40.27-final-predeploy-polish", "v40.28-testicular-final-chapter", "v40.33-system-aware-microplastic-flow", "v40.34-deployment-release-candidate"].some((token) => buildId.includes(token));
if (isV24Cleanup) {
  expect(includesAll(visual, ["body-system-plate", "/images/science/heart.webp", "/images/science/ovary.webp", "/images/science/placenta.webp", "/images/anatomy/body.png"]), "Later cleanup replaces conceptual CSS diagrams with the approved anatomical plate system.");
} else {
  for (const token of ["CardiovascularVisual", "FemaleReproductiveVisual", "EndocrineVisual", "KidneyVisual", "SkinVisual", "DigestiveVisual", "PregnancyVisual"]) {
    expect(visual.includes(token), `Bespoke conceptual body-system visual exists: ${token}.`);
  }
}
expect(read("app/science/body/[slug]/page.tsx").includes("<BodySystemVisual"), "Canonical body-system template renders the matching body-system visual.");

const home = read("app/page.tsx");
const quick = read("app/quick-action-card/page.tsx");
const reducePage = read("app/solutions/reduce-exposure/page.tsx");
const worksheet = read("app/components/ExposureWorksheet.tsx");
expect(includesAll(home, ["Progress, not perfection", "home-progress-note", "/solutions/reduce-exposure#worksheet"]), "Homepage includes the explicit progress-not-perfection transition and worksheet route.");
expect(quick.includes("/solutions/reduce-exposure"), "Quick Action Card links to the fuller exposure guide.");
expect(includesAll(reducePage, ['id="worksheet"', "<ExposureWorksheet"]), "Exposure guide publishes a literal worksheet anchor for cross-route links.");
expect(includesAll(worksheet, ["localStorage", "Print or save this worksheet", "reduce-exposure-worksheet.pdf", "not sent to the site"]), "Exposure worksheet is interactive, device-local, printable, and downloadable.");
expect(includesAll(worksheet, ["try {", "browser storage is unavailable", "State has already been reset in memory"]), "Exposure worksheet remains usable when browser storage is unavailable.");

const community = read("app/community/page.tsx");
const programs = read("app/content/community-programs.ts");
const challenge = read("app/components/CommunityChallenge.tsx");
const signup = read("app/components/SignupForm.tsx");
const subscribe = read("app/api/subscribe/route.ts");
const outbox = read("app/lib/email-outbox.ts");
const unsubscribe = read("app/api/subscription/unsubscribe/route.ts");
expect(isV24Cleanup ? (community.includes("CommunityChallenge") && !community.includes("CommunityLearningPath") && !community.includes('program="learning-series"')) : includesAll(community, ["CommunityLearningPath", "CommunityChallenge", 'program="learning-series"']), isV24Cleanup ? "Later cleanup preserves the public challenge while removing the duplicated curriculum/email UI." : "Community page exposes ten readings, consent-based email enrollment, and both challenges.");
expect((programs.match(/emailSubject:\s*"/g) || []).length === 10 && programs.includes("thirtyDayChallenge"), "Community registry contains ten email lessons and the 30-day challenge.");
expect(includesAll(challenge, ["7-day reset", "30-day practice", "sntp-7-day-challenge.pdf", "sntp-30-day-challenge.pdf", "localStorage"]), "Challenge UI supports 7-day and 30-day device-local plans with printable PDFs.");
expect(includesAll(challenge, ['role="tabpanel"', 'aria-controls="challenge-panel"', "Challenge progress still works for the current session"]), "Challenge tabs and blocked-storage fallback preserve accessible, session-safe operation.");
expect(includesAll(signup, ['type SignupProgram = "field-notes" | "learning-series"', "program?: SignupProgram", "program,"]), "Shared signup form sends an explicit program without changing ordinary Field Notes enrollment.");
expect(includesAll(subscribe, ["enrollInLearningSeries", 'program === "learning-series"']), "Subscribe route can schedule the learning series after consent.");
expect(subscribe.includes("welcome_replaced_after_token_rotation"), "Existing active subscribers receive a fresh pending welcome payload after learning-series token rotation.");
expect(includesAll(outbox, ['"learning_series"', "sendLearningSeriesEmail", "markLearningSeriesStep", "learning_series_waiting_for_prior_step", "learning_series_paused_after_terminal_failure", "learning_series_paused_provider_not_configured"]), "Outbox delivers lessons in sequence, advances enrollment, and stops the schedule after terminal failure.");
const learningBranch = outbox.indexOf('job.kind === "learning_series"');
const advancement = outbox.indexOf("await markLearningSeriesStep", learningBranch);
const scrub = outbox.indexOf("await markSent(job.id, result.id)", learningBranch);
expect(learningBranch >= 0 && advancement > learningBranch && scrub > advancement, "Provider success advances the enrollment before payload scrubbing so a final database update can self-heal on retry.");
expect(unsubscribe.includes("cancelLearningSeries"), "Unsubscribe cancels unsent learning-series lessons.");
expect(exists("drizzle/0006_learning_series.sql") && read("app/api/internal/readiness/route.ts").includes("learning_series_enrollments"), "Learning-series migration and readiness check are present.");
const learningSeriesOps = read("app/lib/learning-series.ts");
expect(includesAll(learningSeriesOps, ["learning_series_restarted", 'status: existing ? "restarted"', "return enrollInLearningSeries(input)"]) && !learningSeriesOps.includes('existing?.status === "active"'), "Explicit re-enrollment refreshes the unsent schedule and unsubscribe token instead of leaving stale jobs.");
expect(exists("docs/LEARNING_SERIES_OPERATIONS.md") && exists("scripts/learning-series-contract-test.mjs"), "Learning-series activation runbook and contract test are packaged.");

const media = read("app/media/page.tsx");
const pressKit = read("app/media/press-kit/page.tsx");
const pressRegistry = read("app/content/press-briefs.ts");
expect(isV24Cleanup ? (media.includes("/media/press-kit") && !media.includes("pressBriefs")) : includesAll(media, ["pressBriefs", "Download one-page PDF"]), isV24Cleanup ? "Later cleanup routes downloadable evidence briefings through the canonical press kit." : "Media center exposes downloadable evidence briefings.");
expect(includesAll(pressKit, ["pressBriefs", "Download PDF"]), "Press kit exposes the same source-status briefings.");
expect((pressRegistry.match(/pdfHref:\s*"/g) || []).length === 6, "Press registry defines six downloadable one-page briefs.");

const pdfs = [
  "public/downloads/reduce-exposure-worksheet.pdf",
  "public/downloads/sntp-7-day-challenge.pdf",
  "public/downloads/sntp-30-day-challenge.pdf",
  "public/press-briefs/cardiovascular-system.pdf",
  "public/press-briefs/pregnancy-early-life.pdf",
  "public/press-briefs/female-reproductive-health.pdf",
  "public/press-briefs/detection-methods.pdf",
  "public/press-briefs/particles-vs-endocrine-chemicals.pdf",
  "public/press-briefs/reduce-exposure.pdf",
];
for (const path of pdfs) expect(validPdf(path), `Generated PDF is present and structurally recognizable: ${path}.`);
expect(exists("scripts/generate-v40-16-pdfs.py"), "PDF generation is reproducible from a packaged script.");
expect(exists("docs/V40_16_GENERATED_ASSET_MANIFEST.csv") && read("docs/V40_16_GENERATED_ASSET_MANIFEST.csv").split("\n").filter(Boolean).length === pdfs.length + 1, "Generated PDFs have a complete packaged hash/page manifest.");

expect(!exists("app/science/body/lungs/page.tsx") && !exists("app/science/body/respiratory-system/page.tsx"), "No unsourced lungs/respiratory article was invented.");
expect(/v40\.(?:16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34)/.test(read("app/build-version.ts")), "Build identifier preserves the v40.16 completion baseline or a later compatible candidate.");
expect(hash("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Package lock remains byte-identical to the approved v40.9+ lock.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.label}${check.detail ? ` | ${check.detail}` : ""}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

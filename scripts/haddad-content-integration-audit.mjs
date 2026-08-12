#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bodySystems } from "../app/content/body-systems.ts";
import { commonPolymers, detectionContent, detectionSteps, exposomeCategories, exposomeContent, reduceExposureContent, reduceExposureGroups } from "../app/content/haddad-topics.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
let passed = 0;
let failed = 0;

function check(label, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`[PASS] ${label}${detail ? ` | ${detail}` : ""}`);
  } else {
    failed += 1;
    console.error(`[FAIL] ${label}${detail ? ` | ${detail}` : ""}`);
  }
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function exists(path) {
  return existsSync(join(root, path));
}

function includesAll(source, values) {
  return values.every((value) => source.includes(value));
}

function normalized(value) {
  return String(value).toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9%]+/g, " ").trim();
}

function covers(value, phrases) {
  const source = normalized(typeof value === "string" ? value : JSON.stringify(value));
  return phrases.every((phrase) => source.includes(normalized(phrase)));
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(join(root, path))).digest("hex");
}

const expectedSystems = [
  "cardiovascular-system",
  "female-reproductive-health",
  "endocrine-metabolic-system",
  "kidneys-urinary-system",
  "skin",
  "digestive-system",
  "pregnancy-early-life",
];
const expectedStatus = new Map([
  ["cardiovascular-system", "verified"],
  ["female-reproductive-health", "partial"],
  ["endocrine-metabolic-system", "source-review"],
  ["kidneys-urinary-system", "source-review"],
  ["skin", "source-review"],
  ["digestive-system", "source-review"],
  ["pregnancy-early-life", "partial"],
]);

check("Seven body-system narratives are present", bodySystems.length === 7, `${bodySystems.length} records`);
check("Body-system slugs are unique", new Set(bodySystems.map((item) => item.slug)).size === bodySystems.length);
check("Every planned body-system route is represented", expectedSystems.every((slug) => bodySystems.some((item) => item.slug === slug)));
for (const article of bodySystems) {
  check(`${article.slug}: canonical narrative has four sections`, article.sections.length === 4);
  check(`${article.slug}: known/uncertain boundary is substantive`, article.known.length >= 3 && article.uncertain.length >= 3);
  check(`${article.slug}: five takeaways retained`, article.keyTakeaways.length === 5);
  check(`${article.slug}: source and review provenance are explicit`, Boolean(article.sourceDocument && article.reviewNote && article.reviewStatus));
  check(`${article.slug}: review state matches the approved gate`, article.reviewStatus === expectedStatus.get(article.slug), article.reviewStatus);
}

check("Detection content preserves four-step method framing", detectionContent.sections.length === 4 && detectionContent.takeaways.length === 5);
check("Exposome content preserves the five-domain framework", exposomeContent.bodyResponse.length === 4);
check("Reduce-exposure content preserves the no-perfection action framework", reduceExposureContent.takeaways.length === 5 && reduceExposureContent.introduction.length >= 2);

const system = (slug) => bodySystems.find((item) => item.slug === slug);
const reduceRecord = { content: reduceExposureContent, groups: reduceExposureGroups };
const detectionRecord = { content: detectionContent, steps: detectionSteps, polymers: commonPolymers };
const exposomeRecord = { content: exposomeContent, categories: exposomeCategories };

check("Reduce exposure: no-perfection and biggest-source framing retained", covers(reduceRecord, ["not perfection", "biggest", "one decision at a time"]));
check("Reduce exposure: kitchen-material alternatives retained", covers(reduceRecord, ["wood", "ceramic", "stainless steel", "glass"]));
check("Reduce exposure: water, heat, storage, single-use, and food priorities retained", covers(reduceRecord, ["plastic water bottles", "reverse osmosis", "heating food", "leftovers", "single-use", "fresh or minimally processed"]));
check("Reduce exposure: clothing, dust, HEPA, ventilation, and personal care retained", covers(reduceRecord, ["cotton", "linen", "wool", "HEPA", "ventilate", "personal-care", "endocrine"]));
check("Reduce exposure: durable-habit and awareness conclusion retained", covers(reduceRecord, ["small, consistent changes", "awareness is the first step", "future generations"]));

check("Female reproductive: system functions and lifelong ovarian-reserve context retained", covers(system("female-reproductive-health"), ["hormone production", "ovulation", "fertilization", "pregnancy", "ovarian reserve", "decades", "future generations"]));
check("Female reproductive: ovary, follicular-fluid, uterus, fibroid, and endometriosis topics retained", covers(system("female-reproductive-health"), ["ovaries", "follicular fluid", "uterine tissue", "fibroids", "endometriosis"]));
check("Female reproductive: BPA/phthalate distinction and non-causation boundary retained", covers(system("female-reproductive-health"), ["BPA", "phthalates", "does not establish", "fertility"]));

check("Endocrine: connected gland network retained", covers(system("endocrine-metabolic-system"), ["thyroid", "pancreas", "adrenal glands", "ovaries", "testes"]));
check("Endocrine: broad hormone functions retained", covers(system("endocrine-metabolic-system"), ["growth", "metabolism", "reproduction", "sleep", "mood", "energy"]));
check("Endocrine: chemical evidence topics retained", covers(system("endocrine-metabolic-system"), ["BPA", "phthalates", "puberty", "obesity", "type 2 diabetes"]));
check("Endocrine: particle mechanisms and hormone questions retained", covers(system("endocrine-metabolic-system"), ["inflammation", "oxidative stress", "thyroid function", "insulin regulation", "testosterone", "estrogen"]));
check("Endocrine: particles and chemicals remain explicitly separate", covers(system("endocrine-metabolic-system"), ["distinguish these chemicals from microplastic particles", "different evidence standards"]));

check("Kidneys: filtration scale and core functions retained", covers(system("kidneys-urinary-system"), ["180 liters", "47 gallons", "waste", "minerals", "blood pressure", "fluid balance"]));
check("Kidneys: filter/retain/eliminate research question retained", covers(system("kidneys-urinary-system"), ["filter", "retain", "eliminate"]));
check("Kidneys: nanoplastic and laboratory mechanism context retained", covers(system("kidneys-urinary-system"), ["nanoplastics", "biological barriers", "inflammation", "oxidative stress", "cellular injury"]));
check("Kidneys: no-proven-disease boundary retained", covers(system("kidneys-urinary-system"), ["does not establish", "chronic kidney disease", "kidney failure", "reduced kidney function"]));

check("Skin: largest-organ and barrier functions retained", covers(system("skin"), ["largest organ", "protective barrier", "injury", "infection", "ultraviolet"]));
check("Skin: intact-skin, nanoplastic, and damaged-skin questions retained", covers(system("skin"), ["healthy", "intact skin", "nanoplastics", "damaged skin"]));
check("Skin: inhalation/ingestion priority and non-major-route framing retained", covers(system("skin"), ["not currently considered a major route", "inhalation and ingestion"]));
check("Skin: cosmetics, personal care, and chemical absorption remain distinct", covers(system("skin"), ["cosmetics", "personal-care", "chemical absorption", "particle penetration"]));

check("Detection: invisible-scale and reported human-sample context retained", covers(detectionRecord, ["too small to see", "blood", "brain", "arteries", "lungs", "reproductive organs", "placenta", "breast milk"]));
check("Detection: collect, prepare, analyze, identify workflow retained", covers(detectionRecord, ["collect a sample", "fats", "proteins", "analyze", "identify the polymer"]));
check("Detection: size, shape, mass, and spectral distinctions retained", covers(detectionRecord, ["size", "shape", "mass", "spectral"]));
check("Detection: PE, PP, PET, PS, and PVC retained", covers(detectionRecord, ["PE", "PP", "PET", "PS", "PVC"]));
check("Detection: contamination-control and QA safeguards retained", covers(detectionRecord, ["contamination", "blanks", "air controls", "instrument cleaning", "quality assurance"]));
check("Detection: detection-is-not-harm boundary retained", covers(detectionRecord, ["detection is the first step", "not the final conclusion", "whether it caused disease"]));

check("Digestive: food/water route and swallowed-air context retained", covers(system("digestive-system"), ["food", "drinking water", "swallowed from the air"]));
check("Digestive: immune, microbiome, and barrier context retained", covers(system("digestive-system"), ["70 percent", "immune", "microbial community", "barrier"]));
check("Digestive: stool, elimination, and possible crossing retained", covers(system("digestive-system"), ["human stool", "eliminated", "cross the intestinal barrier"]));
check("Digestive: inflammation and microbiome research retained", covers(system("digestive-system"), ["gut microbiome", "inflammation", "barrier integrity"]));
check("Digestive: no-proven-disease boundary retains named conditions", covers(system("digestive-system"), ["inflammatory bowel disease", "Crohn's disease", "ulcerative colitis", "colon cancer"]));

check("Exposome: all five supplied domains retained", covers(exposomeRecord, ["air", "water", "food", "products", "lifestyle"]));
check("Exposome: air examples retained", covers(exposomeRecord, ["PM2.5", "dust", "pollen", "microplastics"]));
check("Exposome: water and food examples retained", covers(exposomeRecord, ["drinking water", "bottled water", "packaging", "processing", "pesticides", "additives"]));
check("Exposome: product and lifestyle examples retained", covers(exposomeRecord, ["cosmetics", "cleaning products", "clothing", "furniture", "smoking", "exercise", "stress", "sleep"]));
check("Exposome: body-response and long-term framing retained", covers(exposomeRecord, ["genetics", "nutrition", "exercise", "age", "lifetime", "long-term health"]));

check("Pregnancy: placenta and rapid organ-development framing retained", covers(system("pregnancy-early-life"), ["placenta", "brain", "heart", "lungs", "kidneys", "immune system", "reproductive organs"]));
check("Pregnancy: cord blood, amniotic fluid, meconium, breast milk, and fetal tissue retained as source-review claims", covers(system("pregnancy-early-life"), ["umbilical cord blood", "amniotic fluid", "meconium", "breast milk", "fetal tissue", "source-review"]));
check("Pregnancy: before-birth and early-infancy framing retained", covers(system("pregnancy-early-life"), ["before birth", "early infancy"]));
check("Pregnancy: non-causation and no-blame boundaries retained", covers(system("pregnancy-early-life"), ["not prove miscarriage", "birth defects", "developmental disorders", "assign blame", "create fear"]));

check("Cardiovascular: established primary risk factors retained", covers(system("cardiovascular-system"), ["high blood pressure", "elevated cholesterol", "diabetes", "smoking", "obesity", "lack of exercise"]));
check("Cardiovascular: vessel-scale context retained", covers(system("cardiovascular-system"), ["60,000 miles"]));
check("Cardiovascular: plaque and 84/40/32 coronary findings retained", covers(system("cardiovascular-system"), ["more than half", "84 percent", "40 percent", "32 percent"]));
check("Cardiovascular: polyethylene and inflammatory-marker details retained", covers(system("cardiovascular-system"), ["polyethylene", "inflammatory markers"]));
check("Cardiovascular: association-not-causation boundary retained", covers(system("cardiovascular-system"), ["observational", "cannot determine whether plastic caused", "do not prove"]));

const routeFiles = [
  "app/science/body/[slug]/page.tsx",
  "app/science/how-detection-works/page.tsx",
  "app/science/exposome/page.tsx",
  "app/solutions/reduce-exposure/page.tsx",
];
for (const path of routeFiles) check(`Canonical route source exists: ${path}`, exists(path));

const componentFiles = [
  "app/components/BodySystemLibrary.tsx",
  "app/components/DetectionPrimer.tsx",
  "app/components/ExposomeMap.tsx",
];
for (const path of componentFiles) check(`Reusable integration component exists: ${path}`, exists(path));
const exposomeComponent = read("app/components/ExposomeMap.tsx");
check("Exposome tab pattern supports arrow, Home, and End keys", includesAll(exposomeComponent, ["ArrowRight", "ArrowLeft", "Home", "End", "tabIndex={active === item.id ? 0 : -1}"]));

const bodyPage = read("app/science/body/[slug]/page.tsx");
check("Body-system pages expose known/uncertain boundaries, references, and the medical boundary without reader-facing workflow labels", includesAll(bodyPage, ["What we know", "What we do not know yet", "References", "/medical-disclaimer"]) && !bodyPage.includes("Evidence status"));
check("Source-review body-system pages are protected from indexing until bibliography review", bodyPage.includes('article.reviewStatus === "source-review"') && bodyPage.includes("index: false"));
check("Body-system pages are statically generated from the shared registry", includesAll(bodyPage, ["generateStaticParams", "bodySystems.map", "getBodySystem"]));

const home = read("app/page.tsx");
check("Home integrates all ten body-system chapters into one scroll journey and removes the separate showcase", home.includes("<BodyJourney") && !home.includes("<HomeAnatomySystemShowcase") && !home.includes("<ExposomeMap"));
const science = read("app/science/page.tsx");
check("Science integrates detection methods and body-system context without duplicating the Exposome", includesAll(science, ["<DetectionPrimer", "<BodySystemLibrary", 'id="body-system-overviews"']) && !science.includes("science-exposome-flow"));
check("The Exposome remains on its canonical route and in cross-site pathways", exists("app/science/exposome/page.tsx") && read("app/components/SiteChrome.tsx").includes("/science/exposome") && read("app/solutions/reduce-exposure/page.tsx").includes("/science/exposome"));
const journey = read("app/components/BodyJourney.tsx");
check("Anatomy chapters cross-link to canonical body-system pages", includesAll(journey, ["systemLinks", "/science/body/cardiovascular-system", "/science/body/pregnancy-early-life", "/science/body/female-reproductive-health"]));
const solutions = read("app/solutions/page.tsx");
check("Solutions adds the long-form reduction framework and preserves the existing planner", includesAll(solutions, ["reduceExposureGroups", "/solutions/reduce-exposure", '<div id="planner"><ActionPlanner']));
const guidePage = read("app/resources/[slug]/page.tsx");
check("Every guide can render a small optional science bridge without changing the 14-guide catalog", includesAll(guidePage, ["getGuideScienceConnections", "Want the deeper science?", ".slice(0, 2)"]));
const book = read("app/homo-plasticus/page.tsx");
check("Book page uses a compact bridge into canonical Science rather than duplicating body-system summaries", includesAll(book, ["Explore the evidence directly.", "Human studies", "Body systems", "How detection works"]) && !book.includes("projectQuestions"));
const about = read("app/about-dr-elie-haddad/page.tsx");
check("About page connects Dr. Haddad's philosophy to the exposome", includesAll(about, ["<ExposomeMap", "The exposome"]));
const media = read("app/media/page.tsx");
const press = read("app/media/press-kit/page.tsx");
check("Media points to one canonical press kit, while downloadable evidence briefs live in the press kit", includesAll(media, ["/media/press-kit", "Open the press kit"]) && !media.includes("evidenceBriefings") && includesAll(press, ["pressBriefs", "press-kit-briefings", "Download PDF"]));
const community = read("app/community/page.tsx");
check("Community keeps the practical challenge and action path without repeating the ten-topic curriculum", includesAll(community, ["CommunityChallenge", "From information to practice", "/solutions/reduce-exposure"]) && !community.includes("CommunityLearningPath") && !community.includes("Ten connected readings") && !community.includes("learning-series"));
const editorial = read("app/editorial-policy/page.tsx");
check("Editorial policy codifies detection/causation, evidence type, contamination, and source-state rules", includesAll(editorial, ["Claim ladder", "Particles are not the same as chemicals", "Detection and contamination control", "Source-status labels"]));
const disclaimer = read("app/medical-disclaimer/page.tsx");
check("Medical disclaimer covers the new high-sensitivity topic areas", includesAll(disclaimer, ["Pregnancy, infant feeding, and children", "Fertility and reproductive health", "Heart and blood vessels", "Kidney, digestive, endocrine, and skin concerns"]));
const recommendations = read("app/recommendations/page.tsx");
check("Recommendations cannot convert body-system evidence into product-treatment claims", includesAll(recommendations, ["Science-to-product boundary", "cannot be used to imply that a product prevents disease"]));

const sitemap = read("app/sitemap.ts");
const feed = read("app/feed.xml/route.ts");
check("Sitemap publishes the new canonical route families", includesAll(sitemap, ["bodySystems.map", "/science/how-detection-works", "/science/exposome", "/solutions/reduce-exposure"]));
check("RSS/Field Notes feed includes body systems and new canonical topics", includesAll(feed, ["bodySystems.map", "How Scientists Detect Microplastics", "The Exposome", "How to Reduce Your Exposure"]));
check("LLM-readable site map explains source-review indexing boundaries", includesAll(read("public/llms.txt"), ["Body-system science library", "Detection methods", "Source-review pages"]));

const sourcePdfPaths = [
  "docs/sources/haddad-content/pdf/reduce-exposure.pdf",
  "docs/sources/haddad-content/pdf/female-reproductive-health.pdf",
  "docs/sources/haddad-content/pdf/endocrine-metabolic-system.pdf",
  "docs/sources/haddad-content/pdf/kidneys-urinary-system.pdf",
  "docs/sources/haddad-content/pdf/skin.pdf",
  "docs/sources/haddad-content/pdf/detecting-microplastics.pdf",
  "docs/sources/haddad-content/pdf/digestive-system.pdf",
  "docs/sources/haddad-content/pdf/exposome-diagram.pdf",
  "docs/sources/haddad-content/pdf/pregnancy-placenta-early-life.pdf",
  "docs/sources/haddad-content/pdf/cardiovascular-system.pdf",
];
const sourceManifest = read("docs/sources/SOURCE_MANIFEST.md");
for (const path of sourcePdfPaths) {
  check(`Supplied source is preserved: ${path}`, exists(path));
  const hash = exists(path) ? sha256(path) : "";
  check(`Supplied source hash is registered: ${path}`, Boolean(hash && sourceManifest.includes(`${hash}  ${path}`)));
}
check("Source register maps all ten PDFs to route and review state", exists("docs/sources/haddad-content/README.md") && sourcePdfPaths.every((path) => read("docs/sources/haddad-content/README.md").includes(path.split("/").at(-1))));
check("Original integration blueprint is preserved in project docs", exists("docs/HADDAD_CONTENT_INTEGRATION_BLUEPRINT.md"));

check("Package lock remains byte-identical to the v40.9+ approved lock", sha256("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e");
check("Build identifier advances without changing production", /v40\.(?:15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34)/.test(read("app/build-version.ts")));
check("Current production commerce default remains WooCommerce", read(".env.example").includes("COMMERCE_MODE=woocommerce"));
check("Existing welcome-film integration remains mounted", read("app/layout.tsx").includes("WelcomeVideoModal"));
check("Shared approved wordmark remains in site chrome", read("app/components/SiteChrome.tsx").includes("sntp-wordmark-microplastic"));

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
if (failed) process.exitCode = 1;

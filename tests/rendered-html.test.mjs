import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const coreRoutes = [
  "/", "/science", "/solutions", "/quick-action-card", "/resources", "/homo-plasticus", "/recommendations",
  "/about-dr-elie-haddad", "/media", "/media/press-kit", "/community", "/contact", "/editorial-policy",
  "/medical-disclaimer", "/affiliate-disclosure", "/privacy-policy", "/refunds-and-returns",
  "/terms", "/accessibility", "/purchase/success", "/purchase/access", "/purchase/recover", "/purchase/preview",
];
const guideRoutes = [
  "/resources/microplastics-drinking-water-filter-guide",
  "/resources/heating-food-in-plastic",
  "/resources/microplastics-indoor-dust",
  "/resources/infant-feeding-plastic-bottles",
  "/resources/microplastics-carotid-plaque-study",
  "/resources/microplastics-placenta-pregnancy",
  "/resources/synthetic-clothing-microfibers",
  "/resources/food-packaging-takeout-plastic",
  "/resources/personal-care-cosmetics-plastic",
  "/resources/reusable-food-drink-containers",
  "/resources/children-household-plastic-priorities",
  "/resources/laundry-microfiber-capture",
  "/resources/plastic-kitchen-conversion",
  "/resources/single-use-plastic-foodware",
];

async function request(path, accept = "text/html") {
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept } }), env, ctx);
}

test("renders the immersive, finding-first homepage", async () => {
  const response = await request("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i);
  assert.match(html, /The most dangerous pollutant is the one already inside us\./i);
  assert.match(html, /Say No/i);
  assert.match(html, /to Plastic/i);
  assert.match(html, /aria-label="Say No to Plastic home"/i);
  assert.match(html, /href=["']#main-content["']/i);
  assert.match(html, /id=["']main-content["']/i);
  assert.doesNotMatch(html, /checkout\/\?add-to-cart=27(?:&amp;|&)quantity=1/i);
  assert.match(html, /Get the ebook/i);
  assert.match(html, /Plastic was found in every human testicle sample\./i);
  assert.match(html, /The brain held far more plastic than the liver or kidneys\./i);
  assert.match(html, /Ovary and developing eggs/i);
  assert.match(html, /Plastic was found in the fluid surrounding developing human eggs\./i);
  assert.match(html, /16 of 19 acute-heart-attack patients/i);
  assert.match(html, /14 of 18 follicular-fluid samples/i);
  assert.match(html, /How we know/i);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  assert.match(html, /Elie R\. Haddad, MD/);
  assert.match(html, /Dr\. Rudolph Eberwein/);
  assert.match(html, /book-official\.webp/);
  assert.match(html, /hp-hero-anatomy/);
  assert.match(html, /maternal-fetal-cutaway-v1\.png/);
  assert.doesNotMatch(html, /hp-hero-book/);
  assert.match(html, /portrait\.webp/);
  assert.doesNotMatch(html, /id=["']tedx["']/i);
  assert.match(html, /A physician-led public-health project/i);
  assert.match(html, /First: use less plastic\./i);
  assert.match(html, /don.t heat plastic, don.t store food in plastic, and don.t drink from plastic/i);
  assert.match(html, /Scroll to turn the pages/i);
  assert.doesNotMatch(html, /(?:hero|kitchen|generations)\.webp/);
  const orderedIds = ["top", "evidence", "exposure", "solutions", "book", "about", "join"];
  let priorIndex = -1;
  for (const id of orderedIds) {
    const index = html.indexOf(`id="${id}"`);
    assert.ok(index > priorIndex, `homepage section ${id} must exist in blueprint order`);
    priorIndex = index;
  }
});

test("ships sourced anatomical geometry instead of procedural organ placeholders", async () => {
  const anatomyRoot = new URL("../public/models/anatomy/", import.meta.url);
  const modelFiles = [
    "body-female.glb", "vasculature-female.glb", "brain.glb", "heart.glb", "uterus-female.glb", "pelvis-female.glb", "placenta.glb", "ovary.glb",
    "fetus-mri.glb",
    "testis-left.stl", "testis-right.stl", "epididymis-left.stl", "epididymis-right.stl",
  ];
  for (const filename of modelFiles) {
    const file = new URL(filename, anatomyRoot);
    await access(file);
    assert.ok((await stat(file)).size > 1_000, `${filename} must contain real geometry`);
  }
  const sceneSource = await readFile(new URL("../app/components/AnatomyScene.tsx", import.meta.url), "utf8");
  const journeySource = await readFile(new URL("../app/components/BodyJourney.tsx", import.meta.url), "utf8");
  const evidenceSource = await readFile(new URL("../app/content/evidence.ts", import.meta.url), "utf8");
  assert.match(sceneSource, /GLTFLoader/);
  assert.match(sceneSource, /STLLoader/);
  assert.match(sceneSource, /MeshoptDecoder/);
  assert.match(sceneSource, /body-female\.glb/);
  assert.match(sceneSource, /vasculature-female\.glb/);
  assert.match(sceneSource, /fetus-mri\.glb/);
  assert.match(sceneSource, /kind="pregnantBody"/);
  assert.match(sceneSource, /FetalSurface/);
  assert.match(sceneSource, /class AnatomyErrorBoundary/);
  assert.match(sceneSource, /!webglAvailable \|\| reducedMotion/);
  assert.match(sceneSource, /data-scene=\{String\(activeIndex\)\}/);
  assert.doesNotMatch(sceneSource, /"\/models\/anatomy\/body\.glb"/);
  assert.doesNotMatch(sceneSource, /(?:sphere|capsule|cylinder)Geometry/i);
  assert.match(journeySource, /homepageJourney/);
  assert.match(evidenceSource, /modelLabel: "Pregnant body, fetus, placenta and amnion"/);
  assert.match(evidenceSource, /Two/);
  assert.doesNotMatch(journeySource, /journey-maternal-cutaway/);
  assert.doesNotMatch(sceneSource, /normalizedSize|normalize = false|object\.position\.sub\(center\)/);
  assert.match(sceneSource, /<group scale=\{3\.25\}>[\s\S]*kind="brain"[\s\S]*kind="pelvis"[\s\S]*kind="placenta"/);
  assert.match(evidenceSource, /modelLabel: "Whole ovary · eggs develop in microscopic follicles"/);
  assert.match(evidenceSource, /context: "male"/);
  assert.match(evidenceSource, /modelLabel: "Separate male reproductive specimen"/);
  assert.match(evidenceSource, /it is not part of the maternal model/);
  assert.match(evidenceSource, /Follicular fluid is the liquid immediately surrounding and supporting a developing egg inside the ovary/);
  const maternalCutaway = new URL("../public/images/anatomy/maternal-fetal-cutaway-v1.png", import.meta.url);
  await access(maternalCutaway);
  assert.ok((await stat(maternalCutaway)).size > 1_000_000, "maternal cutaway must be a production image asset");
  await access(new URL("LICENSES.txt", anatomyRoot));
  const anatomyLicenses = await readFile(new URL("LICENSES.txt", anatomyRoot), "utf8");
  assert.match(anatomyLicenses, /Medical Vision Group fetal MRI surface/);
  assert.match(anatomyLicenses, /MAP-C507, segmentation frame 50/);
  assert.match(anatomyLicenses, /not represented as a single-patient reconstruction/);
});

test("keeps the animated book spread isolated from the full book page", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const journey = await readFile(new URL("../app/components/BookJourney.tsx", import.meta.url), "utf8");
  const bookPage = await readFile(new URL("../app/homo-plasticus/page.tsx", import.meta.url), "utf8");
  assert.match(journey, /book-spread-page/);
  assert.match(journey, /aria-label="Book journey chapters"/);
  assert.match(journey, /aria-current={phase === index ? "step" : undefined}/);
  assert.match(bookPage, /book-detail-page/);
  assert.doesNotMatch(css, /(?:^|\n)\.book-page(?:,|\{)/);
  assert.match(css, /\.book-chapter-copy\{[^}]*display:grid[^}]*min-height:/);
  assert.doesNotMatch(css, /\.book-chapter-copy\{[^}]*(?:^|[;{])height:/m);
});

test("publishes an uncached build version for stale-tab recovery", async () => {
  const response = await request("/api/version", "application/json");
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/i);
  assert.match(payload.version, /^hp-home-/);
});

test("publishes a finding-first, source-linked human evidence record", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const scienceResponse = await request("/science");
  const scienceHtml = await scienceResponse.text();
  assert.equal(scienceResponse.status, 200);
  assert.equal((scienceHtml.match(/<h1\b/gi) || []).length, 1);
  assert.match(scienceHtml, /Plastic has been found throughout the human body/i);
  assert.match(scienceHtml, /Here is what researchers actually found/i);
  assert.match(scienceHtml, /href=["']#main-content["']/i);
  assert.match(scienceHtml, /id=["']main-content["']/i);
  for (const id of ["blood", "brain", "heart-arteries", "pregnancy", "placenta", "ovary", "testicular-tissue"]) {
    assert.match(scienceHtml, new RegExp(`href=["']#${id}["']`, "i"), `Science navigation must link to ${id}`);
    assert.match(scienceHtml, new RegExp(`id=["']${id}["']`, "i"), `Science chapter ${id} must exist`);
  }
  assert.match(scienceHtml, /17 of 22/i);
  assert.match(scienceHtml, /about 50 percent higher/i);
  assert.match(scienceHtml, /16 of 19 acute-heart-attack patients/i);
  assert.match(scienceHtml, /4\.53/i);
  assert.match(scienceHtml, /4 of 6/i);
  assert.match(scienceHtml, /14 of 18 follicular-fluid samples/i);
  assert.match(scienceHtml, /23 of 23/i);
  assert.match(scienceHtml, /liquid immediately surrounding and supporting a developing egg/i);
  assert.match(scienceHtml, /<details/i);
  assert.match(scienceHtml, /<summary[^>]*>How the study was done/i);
  assert.match(scienceHtml, /pubmed\.ncbi\.nlm\.nih\.gov\/35367073/i);
  assert.match(scienceHtml, /pubmed\.ncbi\.nlm\.nih\.gov\/38446676/i);
  assert.match(scienceHtml, /pubmed\.ncbi\.nlm\.nih\.gov\/39947063/i);
  assert.match(scienceHtml, /10\.1093\/eurheartj\/ehag447/i);
  assert.match(scienceHtml, /"@type":"CollectionPage"/i);
  assert.match(scienceHtml, /"@type":"ItemList"/i);
  assert.match(scienceHtml, /"dateModified":"2026-08-05"/i);
  assert.doesNotMatch(scienceHtml, /Human evidence ledger/i);
  assert.doesNotMatch(scienceHtml, /What was reported/i);
  assert.doesNotMatch(scienceHtml, /What it does not prove/i);
  assert.doesNotMatch(scienceHtml, /Six areas changing the conversation/i);
  assert.doesNotMatch(scienceHtml, /Take the uncertainty seriously/i);
  assert.doesNotMatch(scienceHtml, /(?:evidence|anatomy)\.webp/i);
  assert.match(css, /html:has\(\.science-v2\)\{scroll-behavior:auto\}/i);
  assert.match(css, /\.science-v2-nav\{[^}]*position:sticky/i);
  assert.match(css, /\.science-v2-nav-links\{[^}]*overflow-x:auto[^}]*scroll-snap-type:x proximity/i);
  assert.match(css, /@media\(max-width:900px\)[\s\S]*?\.science-v2-chapter\{display:block/i);
  assert.match(css, /@media\(max-width:620px\)[\s\S]*?\.science-v2-result\{display:block/i);
});

test("keeps practical action simple while preserving the authored printable card", async () => {
  const solutionsResponse = await request("/solutions");
  const solutionsHtml = await solutionsResponse.text();
  assert.equal(solutionsResponse.status, 200);
  assert.equal((solutionsHtml.match(/<h1\b/gi) || []).length, 1);
  assert.match(solutionsHtml, /First: use less plastic/i);
  assert.match(solutionsHtml, /Choose one change for this week/i);
  assert.match(solutionsHtml, /The first step is simple\. The rest is optional depth/i);
  assert.match(solutionsHtml, /Avoid routine plastic bottles/i);
  assert.match(solutionsHtml, /Replace the plastic used around heat and food/i);
  assert.match(solutionsHtml, /Remove disposable plastic foodware/i);
  assert.match(solutionsHtml, /href=["']\/quick-action-card["']/i);
  assert.match(solutionsHtml, /id=["']main-content["']/i);
  assert.doesNotMatch(solutionsHtml, /frequency × contact × heat/i);
  const cardResponse = await request("/quick-action-card");
  const cardHtml = await cardResponse.text();
  assert.equal(cardResponse.status, 200);
  assert.match(cardHtml, /12 Immediate Steps to Protect Yourself from Microplastics/i);
  assert.match(cardHtml, /Print or save as PDF/i);
  assert.match(cardHtml, /Don.t heat plastic/i);
  assert.match(cardHtml, /Don.t store food in plastic/i);
  assert.match(cardHtml, /Don.t drink from plastic/i);
  assert.match(cardHtml, /Sweat regularly.*sauna, exercise.*eliminate toxins/i);
  assert.match(cardHtml, /Evidence does not currently establish sauna or exercise/i);
  const actionSource = await readFile(new URL("../app/content/actions.ts", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.equal((actionSource.match(/number: "\d{2}", text:/g) || []).length >= 10, true);
  assert.match(css, /@media print/);
  assert.match(css, /\.action-plan-output\{position:sticky/i);
});

test("centralizes TEDx under Media and labels the interim recording honestly", async () => {
  const tedxResponse = await request("/tedx");
  assert.ok([307, 308].includes(tedxResponse.status));
  assert.match(tedxResponse.headers.get("location") || "", /\/media#featured-talk$/i);
  const mediaResponse = await request("/media");
  const mediaHtml = await mediaResponse.text();
  assert.equal(mediaResponse.status, 200);
  assert.match(mediaHtml, /The invisible inheritance of nanoplastics/i);
  assert.match(mediaHtml, /temporary audience-recorded YouTube video/i);
  assert.match(mediaHtml, /not the official TEDx release/i);
  assert.match(mediaHtml, /Long-form conversation · available now/i);
  assert.doesNotMatch(mediaHtml, /TEDxMiami · Official video/i);
  const registry = JSON.parse(await readFile(new URL("../app/content/media-items.json", import.meta.url), "utf8"));
  const tedx = registry.entries.find((entry) => entry.id === "tedx-invisible-inheritance");
  const conversation = registry.entries.find((entry) => entry.id === "homo-plasticus-conversation");
  assert.equal(tedx.youtubeId, "MVnY2vw99SY");
  assert.equal(tedx.published, true);
  assert.equal(tedx.ownerApproved, false);
  assert.equal(tedx.publicationApproval, "user_authorized");
  assert.equal(tedx.temporary, true);
  assert.equal(tedx.replaceWhenOfficialAvailable, true);
  assert.equal(conversation.youtubeId, "DJuZBIXeiM8");
  assert.equal(conversation.published, true);
  assert.equal(conversation.publicationApproval, "user_authorized");
});

test("publishes a functional field-guide library and a source-backed media route", async () => {
  const resources = await request("/resources");
  const resourcesHtml = await resources.text();
  const media = await request("/media");
  const mediaHtml = await media.text();
  assert.equal(resources.status, 200);
  assert.equal(media.status, 200);
  assert.match(resourcesHtml, /Search field guides/i);
  assert.match(resourcesHtml, /14[\s\S]*foundational guides/i);
  assert.match(mediaHtml, /Make the science clear enough to act on/i);
  assert.match(mediaHtml, /The Invisible Inheritance of Nanoplastics/i);
  assert.match(mediaHtml, /temporary audience-recorded YouTube video/i);
  assert.match(mediaHtml, /Welcome film link pending/i);
  const guideLibrary = await readFile(new URL("../app/components/GuideLibrary.tsx", import.meta.url), "utf8");
  const eventRoute = await readFile(new URL("../app/api/events/route.ts", import.meta.url), "utf8");
  assert.match(guideLibrary, /aria-pressed/);
  assert.match(guideLibrary, /role="group" aria-label="Filter field guides by topic"/);
  assert.match(guideLibrary, /Search field guides/);
  assert.match(eventRoute, /video_start/);
});

test("renders the complete physician story and every guiding principle", async () => {
  const response = await request("/about-dr-elie-haddad");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Meet the physician behind the movement/i);
  assert.match(html, /href=["']#my-story["']/i);
  assert.match(html, /Not a place built on fear\./i);
  assert.match(html, /A place built on curiosity, evidence, and hope\./i);
  assert.match(html, /Why were conditions I once associated with older age appearing in younger adults\?/i);
  assert.match(html, /creation of <em>Homo Plasticus<\/em>, my TEDx talk, and ultimately Say No To Plastic/i);
  assert.match(html, /Science Before Sensation/i);
  assert.match(html, /Curiosity Over Certainty/i);
  assert.match(html, /Progress Over Perfection/i);
  assert.match(html, /Protect Future Generations/i);
  assert.match(html, /Treat Causes, Not Only Symptoms/i);
  assert.match(html, /Hope Inspires Action/i);
  assert.match(html, /We cannot change what we do not see\./i);
  assert.match(html, /We cannot protect what we do not value\./i);
  assert.match(html, /elie-haddad-tedx-profile\.jpg/i);
  assert.doesNotMatch(html, /portrait\.webp/i);
  assert.doesNotMatch(html, /Training built for complexity/i);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
});

test("renders the traffic, trust, commerce, and policy routes", async () => {
  const expected = [
    ["/resources", "Useful answers. Visible uncertainty."],
    ["/resources/microplastics-drinking-water-filter-guide", "Drinking water: avoid plastic bottles and choose a filter you can maintain"],
    ["/homo-plasticus", "Homo Plasticus"],
    ["/recommendations", "Criteria first. Products second."],
    ["/media/press-kit", "Context before the conversation."],
    ["/purchase/preview", "See the flow before activation."],
    ["/editorial-policy", "Editorial and Evidence Policy"],
    ["/affiliate-disclosure", "Affiliate Disclosure"],
    ["/medical-disclaimer", "Medical Disclaimer"],
    ["/refunds-and-returns", "Refunds and Returns"],
    ["/privacy-policy", "Privacy Policy"],
    ["/terms", "Terms of Use"],
    ["/accessibility", "Access should be part of the work."],
    ["/purchase/recover", "Recover your ebook access."],
  ];
  for (const [path, heading] of expected) {
    const response = await request(path);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.match(html, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), path);
  }
});

test("ships the first-visit welcome film shell and keeps it replayable", async () => {
  const source = await readFile(new URL("../app/components/WelcomeVideoModal.tsx", import.meta.url), "utf8");
  const content = await readFile(new URL("../app/content/media-content.ts", import.meta.url), "utf8");
  assert.match(source, /hp_welcome_film_seen_v1/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /pathname !== "\/"/);
  assert.match(source, /welcome-film-replay/);
  assert.match(source, /siteShell\.inert = true/);
  assert.match(source, /useBodyScrollLock\(open\)/);
  assert.match(source, /aria-describedby="welcome-film-description"/);
  assert.match(source, /hp:welcome-opening/);
  assert.match(source, /youtube-nocookie\.com\/embed/);
  assert.match(content, /status: "pending"/);
  assert.match(content, /Replace only the media fields below/);
});

test("ships a gated commerce preview without weakening the live fallback", async () => {
  const commerceSource = await readFile(new URL("../app/lib/commerce.ts", import.meta.url), "utf8");
  const previewSource = await readFile(new URL("../app/purchase/preview/page.tsx", import.meta.url), "utf8");
  const packageData = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(commerceSource, /COMMERCE_PREVIEW_ENABLED/);
  assert.match(commerceSource, /mode === "preview"/);
  assert.match(previewSource, /no payment/i);
  const previewComponent = await readFile(new URL("../app/components/CommercePreview.tsx", import.meta.url), "utf8");
  assert.match(previewComponent, /<form className="commerce-preview-card"/);
  assert.match(previewComponent, /name="email"[\s\S]*required/);
  assert.match(packageData.scripts["dev:commerce-preview"], /COMMERCE_MODE=preview/);
});

test("coordinates overlays and preserves the movement identity in form success", async () => {
  const chrome = await readFile(new URL("../app/components/SiteChrome.tsx", import.meta.url), "utf8");
  const welcome = await readFile(new URL("../app/components/WelcomeVideoModal.tsx", import.meta.url), "utf8");
  const contact = await readFile(new URL("../app/components/ContactForm.tsx", import.meta.url), "utf8");
  assert.match(chrome, /window\.addEventListener\("hp:welcome-opening"/);
  assert.match(chrome, /\.site-header \.brand/);
  assert.match(welcome, /window\.dispatchEvent\(new Event\("hp:welcome-opening"\)\)/);
  assert.match(contact, /Say No to Plastic team/);
  assert.match(contact, /SUPPORT_EMAIL/);
  assert.match(contact, /aria-busy=\{state === "loading"\}/);
});

test("ships an affiliate catalog with publication gates and safe redirects", async () => {
  const catalog = JSON.parse(await readFile(new URL("../app/content/affiliate-products.json", import.meta.url), "utf8"));
  const library = await readFile(new URL("../app/components/RecommendationLibrary.tsx", import.meta.url), "utf8");
  const redirect = await readFile(new URL("../app/go/[slug]/route.ts", import.meta.url), "utf8");
  const preflight = await readFile(new URL("../scripts/affiliate-preflight.mjs", import.meta.url), "utf8");
  assert.equal(catalog.products.length, 0);
  assert.ok(catalog.categories.length >= 5);
  assert.match(library, /sponsored nofollow noopener noreferrer/);
  assert.match(library, /Commercial disclosure/);
  assert.match(redirect, /getPublishedAffiliateProduct/);
  assert.match(redirect, /destination.protocol !== "https:"/);
  assert.match(preflight, /status !== "published"/);
  assert.match(preflight, /at least one tradeoff is required/);
});

test("ships a first-party, recoverable commerce boundary with a safe legacy fallback", async () => {
  const checkoutSource = await readFile(new URL("../app/components/CheckoutButton.tsx", import.meta.url), "utf8");
  const commerceSource = await readFile(new URL("../app/lib/commerce.ts", import.meta.url), "utf8");
  const schemaSource = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const migration = await readFile(new URL("../drizzle/0003_native_commerce.sql", import.meta.url), "utf8");
  const leaseMigration = await readFile(new URL("../drizzle/0004_commerce_delivery_leases.sql", import.meta.url), "utf8");
  const emailSource = await readFile(new URL("../app/lib/email-service.ts", import.meta.url), "utf8");
  const productData = JSON.parse(await readFile(new URL("../app/content/book-product.json", import.meta.url), "utf8"));
  const preflightSource = await readFile(new URL("../scripts/commerce-preflight.mjs", import.meta.url), "utf8");
  const successSource = await readFile(new URL("../app/purchase/success/page.tsx", import.meta.url), "utf8");
  const privacySource = await readFile(new URL("../app/privacy-policy/page.tsx", import.meta.url), "utf8");
  const eventRoute = await readFile(new URL("../app/api/events/route.ts", import.meta.url), "utf8");

  assert.match(checkoutSource, /fetch\("\/api\/checkout"/);
  assert.match(checkoutSource, /begin_checkout/);
  assert.match(checkoutSource, /attemptId/);
  assert.match(commerceSource, /Stripe-Signature|stripe-signature/);
  assert.match(commerceSource, /Idempotency-Key/);
  assert.match(commerceSource, /commerceEvents/);
  assert.match(commerceSource, /onConflictDoNothing/);
  assert.match(commerceSource, /staleProcessing/);
  assert.match(commerceSource, /claimedAt/);
  assert.match(commerceSource, /FULFILLMENT_LEASE_MS/);
  assert.match(commerceSource, /anchorTimestamp/);
  assert.match(commerceSource, /paidAt \}/);
  assert.match(commerceSource, /Stripe-Version/);
  assert.match(commerceSource, /Stripe mode mismatch/);
  assert.match(commerceSource, /commerce_amount_mismatch/);
  assert.match(commerceSource, /channel: "initial"/);
  assert.match(commerceSource, /status: "queued"/);
  assert.match(commerceSource, /status: "failed"/);
  assert.doesNotMatch(commerceSource, /payload: JSON\.stringify\(\{ orderId: order\.id, accessUrl/);
  assert.match(commerceSource, /EBOOKS/);
  assert.match(commerceSource, /EBOOK_ACCESS_SECRET/);
  assert.match(commerceSource, /recoverBookAccess/);
  assert.match(commerceSource, /charge\.refunded/);
  assert.match(commerceSource, /partially_refunded/);
  assert.match(commerceSource, /hasActiveAccess/);
  assert.match(schemaSource, /commerceOrders/);
  assert.match(schemaSource, /commerceFulfillments/);
  assert.match(schemaSource, /attemptCount/);
  assert.match(schemaSource, /ebookDownloads/);
  assert.match(schemaSource, /recoveryRequests/);
  assert.match(migration, /CREATE TABLE `commerce_orders`/);
  assert.match(migration, /commerce_events_provider_event_unique/);
  assert.match(leaseMigration, /claimed_at/);
  assert.match(leaseMigration, /attempt_count/);
  assert.match(emailSource, /Idempotency-Key/);
  assert.match(emailSource, /reply_to: support/);
  assert.equal(productData.productKey, "homo-plasticus-ebook");
  assert.equal(productData.delivery.emailLinkDays, 30);
  assert.match(preflightSource, /EBOOK_SHA256/);
  assert.match(preflightSource, /--strict/);
  assert.match(preflightSource, /--production/);
  assert.match(preflightSource, /%%EOF/);
  assert.match(successSource, /PurchaseTracker/);
  assert.match(eventRoute, /"purchase"/);
  assert.match(privacySource, /does not store full payment-card numbers/i);
  assert.match(privacySource, /recovery requests use a protected email-derived value/i);

  const checkoutResponse = await worker.fetch(new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost" },
    body: JSON.stringify({ source: "test-suite" }),
  }), env, ctx);
  assert.equal(checkoutResponse.status, 201);
  const checkout = await checkoutResponse.json();
  assert.equal(checkout.mode, "woocommerce");
  assert.match(checkout.url, /checkout\/\?add-to-cart=27&quantity=1/);

  const recoveryResponse = await worker.fetch(new Request("http://localhost/api/purchase/recover", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost" },
    body: JSON.stringify({ email: "buyer@example.com" }),
  }), env, ctx);
  assert.equal(recoveryResponse.status, 202);
  assert.deepEqual(await recoveryResponse.json(), { ok: true });

  const webhookResponse = await worker.fetch(new Request("http://localhost/api/checkout/webhook", {
    method: "POST",
    body: "{}",
  }), env, ctx);
  assert.equal(webhookResponse.status, 503);

  const downloadResponse = await worker.fetch(new Request("http://localhost/api/ebook/download", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", origin: "http://localhost" },
    body: "token=invalid",
  }), env, ctx);
  assert.equal(downloadResponse.status, 503);
});

test("renders every core page and all fourteen field guides without accidental unfinished public copy", async () => {
  const incomplete = /coming soon|placeholder|official film link pending|will be added|will activate|under review|final photography will replace/i;
  for (const path of [...coreRoutes, ...guideRoutes]) {
    const response = await request(path);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.match(html, /<h1\b/i, `${path} must have an h1`);
    assert.doesNotMatch(html, incomplete, `${path} contains unfinished public copy`);
  }
});

test("resolves every internal link and every referenced anchor", async () => {
  const pageCache = new Map();
  async function htmlFor(path) {
    if (!pageCache.has(path)) {
      const response = await request(path);
      const html = await response.text();
      pageCache.set(path, { response, html });
    }
    return pageCache.get(path);
  }

  for (const sourcePath of [...coreRoutes, ...guideRoutes]) {
    const { html } = await htmlFor(sourcePath);
    const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']*)["'][^>]*>/gi)].map((match) => match[1].replaceAll("&amp;", "&"));
    for (const href of hrefs) {
      assert.ok(href && href !== "#", `${sourcePath} contains an empty link`);
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const target = new URL(href, "http://localhost");
      const { response, html: targetHtml } = await htmlFor(target.pathname);
      assert.ok([200, 308].includes(response.status), `${sourcePath} links to ${href}, which returned ${response.status}`);
      if (target.hash && response.status === 200) {
        const id = decodeURIComponent(target.hash.slice(1)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        assert.match(targetHtml, new RegExp(`\\bid=["']${id}["']`, "i"), `${sourcePath} links to missing anchor ${href}`);
      }
    }
  }
});

test("forms and event endpoints reject invalid input cleanly before persistence", async () => {
  const cases = [
    ["/api/subscribe", { firstName: "", email: "bad", consent: false }],
    ["/api/contact", { name: "", email: "bad", message: "short" }],
    ["/api/events", { eventName: "unsupported", path: "/" }],
  ];
  for (const [path, payload] of cases) {
    const response = await worker.fetch(new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost" },
      body: JSON.stringify(payload),
    }), env, ctx);
    assert.equal(response.status, 400, path);
    assert.match(response.headers.get("content-type") ?? "", /^application\/json/i, path);
  }
});

test("preserves old indexed URLs with permanent redirects", async () => {
  for (const [path, destination] of [["/impact", "/science"], ["/shop", "/homo-plasticus"], ["/refund_returns", "/refunds-and-returns"]]) {
    const response = await request(path);
    assert.equal(response.status, 308, path);
    assert.equal(new URL(response.headers.get("location")).pathname, destination, path);
  }
});

test("publishes an RSS feed for the field-guide engine", async () => {
  const response = await request("/feed.xml", "application/rss+xml");
  const xml = await response.text();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/rss\+xml/i);
  assert.match(xml, /<title>Say No to Plastic Field Guides<\/title>/);
  assert.equal((xml.match(/<item>/g) || []).length, 8);
});

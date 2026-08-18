#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];
const read = (p) => readFileSync(join(root,p),"utf8");
const exists = (p) => existsSync(join(root,p));
const expect = (ok,label) => checks.push({ok:Boolean(ok),label});
const sha = (p) => createHash("sha256").update(readFileSync(join(root,p))).digest("hex");
const build = read("app/build-version.ts");
const env = read(".env.example");
const current = read("CURRENT_STATE.md");
const handoff = read("HANDOFF.md");
const hosting = JSON.parse(read(".openai/hosting.json"));
const evidence = read("app/content/evidence.ts");
const scene = read("app/components/AnatomyScene.tsx");
const journey = read("app/components/BodyJourney.tsx");
const config = read("app/config.ts");
const mediaPage = read("app/media/page.tsx");
const mediaContent = read("app/content/media-content.ts");
const pressKitPage = read("app/media/press-kit/page.tsx");
const homePage = read("app/page.tsx");
const communityPage = read("app/community/page.tsx");
const subscribeRoute = read("app/api/subscribe/route.ts");
const actionPlans = read("app/components/CommunityChallenge.tsx");
const communityPrograms = read("app/content/community-programs.ts");
const reduceExposurePage = read("app/solutions/reduce-exposure/page.tsx");
expect(build.includes("v40.34-deployment-release-candidate"), "Build identifier is v40.34 deployment release candidate.");
expect(current.startsWith("# Current State — v40.34"), "CURRENT_STATE begins with the current v40.34 release.");
expect(handoff.startsWith("# Handoff — v40.34"), "HANDOFF begins with the current v40.34 release.");
expect(exists("docs/V40_34_SITES_DEPLOYMENT.md") && exists("docs/V40_34_EXTERNAL_INPUTS_FROM_DR_HADDAD.md"), "Final deployment and owner-input runbooks are packaged.");
expect(exists("V40_34_CHANGE_MANIFEST.md"), "v40.34 change manifest is packaged.");
expect(env.includes("COMMERCE_MODE=woocommerce") && env.includes("AUDIENCE_PROVIDER=none"), "Safe launch defaults keep WooCommerce active and audience provider unchosen.");
expect(env.includes("PUBLIC_SITE_URL=https://saynotoplastic.com"), "Canonical public origin defaults to saynotoplastic.com.");
expect(config.includes("https://homoplasticus.com/checkout/?add-to-cart=27&quantity=1"), "Legacy WooCommerce checkout fallback remains explicit for owner verification.");
expect(hosting.project_id === "appgprj_6a7123d6fe008191953f038d7221380e" && hosting.d1 === "DB" && hosting.r2 === "EBOOKS", "Existing Sites project identity and storage binding names remain preserved.");
expect(sha("package-lock.json") === "7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e", "Approved package lock remains byte-identical.");
const block=evidence.slice(evidence.indexOf("export const homepageJourney"),evidence.indexOf("export const homepageEvidence"));
const slugs=[...block.matchAll(/slug: "([^"]+)"/g)].map(m=>m[1]);
expect(slugs.length===10 && slugs.at(-1)==="testicular-tissue", "Anatomy remains ten chapters with testicular tissue last.");
expect(scene.includes("MICROPLASTIC_FLOW_DEFINITIONS") && scene.includes("SystemAwareMicroplasticFlow") && journey.includes("journey-complete-atlas-compact"), "v40.33 system-aware particle flow and compact atlas handoff remain intact.");
function walk(dir){const out=[];for(const name of readdirSync(dir)){const p=join(dir,name);const st=statSync(p);if(st.isDirectory())out.push(...walk(p));else out.push(p);}return out;}
const publicFiles=walk(join(root,"public")).map(p=>p.slice(join(root,"public").length+1));
expect(!publicFiles.some(p=>/(^|\/)(homo[-_ ]?plasticus|ebook|book)[^/]*\.pdf$/i.test(p)), "No final ebook PDF is packaged under public/.");
const trackedSecretFiles=walk(root).filter(p=>/(^|\/)(\.env|\.env\.local|credentials\.json)$/i.test(p.slice(root.length+1)));
expect(trackedSecretFiles.length===0, "No populated .env or credential file is packaged.");
const sculptureAssets=["public/media/homo-plasticus-full.webp","public/media/homo-plasticus-detail-side.webp","public/media/homo-plasticus-detail-front.webp"];
expect(sculptureAssets.every(exists), "All three owner-supplied Homo Plasticus sculpture views are packaged as web assets.");
expect(exists("app/media/media.module.css"), "Homo Plasticus media feature has dedicated responsive layout styling.");
expect(mediaPage.includes("Art makes the invisible visible."), "Homo Plasticus feature uses the approved art-makes-the-invisible-visible framing.");
expect(mediaPage.includes("The Silent Invasion of Human Health"), "Homo Plasticus feature carries the approved sculpture subtitle.");
expect(mediaPage.includes("The artwork is not presented as scientific evidence."), "Sculpture feature explicitly separates artistic interpretation from scientific evidence.");
expect(mediaPage.includes("Attention")&&mediaPage.includes("Curiosity")&&mediaPage.includes("Science")&&mediaPage.includes("Memory"), "Sculpture story preserves the attention-to-curiosity-to-science-to-memory sequence.");
expect(!mediaPage.includes("PendingMedia id=\"homo-plasticus-conversation\""), "The former long-form media slot is no longer rendered where the sculpture story belongs.");

// Phase 14: owner-approved Press Kit topic decisions.
const topicsBlock = mediaContent.slice(mediaContent.indexOf("topics: ["), mediaContent.indexOf("facts: ["));
const pressTopics = [...topicsBlock.matchAll(/^\s*"([^"]+)"/gm)].map((match) => match[1]);
expect(pressKitPage.includes("Media contact") && pressKitPage.includes("Short bio") && pressKitPage.includes("Extended bio") && pressKitPage.includes("Interview topics") && pressKitPage.includes("Downloadable evidence briefings") && pressKitPage.includes("Current web assets"), "Press Kit visibly includes contact, short bio, extended bio, interview topics, and press resources.");
expect(pressTopics.length===7, "Press Kit shows exactly seven approved interview topics after removal of topic #8.");
expect(pressTopics.includes("What are endocrine-disrupting chemicals?"), "Press Kit uses the approved endocrine-disrupting chemicals interview question verbatim.");
expect(!topicsBlock.includes("Why plastic particles and endocrine-disrupting chemicals require separate evidence standards"), "Superseded endocrine-disruptor topic wording is removed from the Press Kit source.");
expect(!topicsBlock.includes("Communicating emerging health science with accuracy and proportion"), "Removed topic #8 has zero survival in the Press Kit topic registry.");

// Phase 16: newsletter launch safety. No provider means no collection.
expect(homePage.includes("Field Notes / Newsletter") && homePage.includes("Coming soon.") && !homePage.includes("SignupForm"), "Homepage shows Field Notes / Newsletter as Coming Soon and does not render a signup form.");
expect(communityPage.includes("Field Notes / Newsletter") && communityPage.includes("Coming soon.") && !communityPage.includes("SignupForm"), "Community page shows Field Notes / Newsletter as Coming Soon and does not render a signup form.");
expect(subscribeRoute.includes("newsletter_coming_soon") && subscribeRoute.includes("No email addresses are collected at launch") && !subscribeRoute.includes("subscribers") && !subscribeRoute.includes("emailOutbox") && !subscribeRoute.includes("deliverEmailOutboxJob") && !subscribeRoute.includes("enrollInLearningSeries") && !subscribeRoute.includes("getDb"), "Newsletter API is hard-disabled at launch and cannot persist or queue subscriber data.");
const publicSignupPages=walk(join(root,"app")).filter(file=>file.endsWith("page.tsx")&&readFileSync(file,"utf8").includes("SignupForm")).map(file=>relative(root,file));
if(publicSignupPages.length){console.error("[DETAIL] Public signup forms detected while newsletter provider is disabled:");for(const hit of publicSignupPages)console.error(`  - ${hit}`);}
expect(publicSignupPages.length===0, "No public route renders SignupForm while the newsletter provider is unconfigured.");

// Phase 17: approved seven-day and thirty-day practical plans.
expect(actionPlans.includes('id="action-plans"') && actionPlans.includes(">7-day plan<") && actionPlans.includes(">30-day plan<"), "Community exposes distinct 7-day and 30-day action plans.");
expect(actionPlans.includes("Print / save {plan}-day plan") && actionPlans.includes("window.print()") && actionPlans.includes("data-print-section"), "Both action plans support browser print and Save as PDF through the dedicated print section.");
expect(actionPlans.includes("Use these as a guide, not a scorecard.") && actionPlans.includes("There is no score and no requirement to complete every item."), "Action-plan language stays useful and worksheet-like rather than homework-like.");
expect(communityPrograms.includes("Notice what repeats") && communityPrograms.includes("Change one hot-food habit") && communityPrograms.includes("Choose a reusable drink container") && communityPrograms.includes("Store one meal differently"), "Seven-day plan includes the approved recurring-contact, hot-food, reusable-drink, and meal-storage actions.");
expect(communityPrograms.includes("export const thirtyDayChallenge") && communityPrograms.includes("Close the loop") && communityPrograms.includes("Choose the next month’s habit"), "Thirty-day plan provides the approved extended practice path through day 30.");
expect(reduceExposurePage.includes('/community#action-plans') && reduceExposurePage.includes("Open the 7-day / 30-day plans"), "Reduce-exposure guidance links directly to the printable action plans.");

const forbiddenRuntimePattern=/\brudy\b/i;
const textExtensions=new Set([".ts",".tsx",".js",".jsx",".mjs",".cjs",".json",".html",".css",".txt",".xml",".map"]);
const runtimeRoots=["app","public","worker","build"].filter(exists);
const forbiddenRuntimeHits=[];
for(const runtimeRoot of runtimeRoots){for(const file of walk(join(root,runtimeRoot))){const rel=relative(root,file);if(forbiddenRuntimePattern.test(rel)){forbiddenRuntimeHits.push(`${rel} (path)`);continue;}if(!textExtensions.has(extname(file).toLowerCase()))continue;try{const body=readFileSync(file,"utf8");if(forbiddenRuntimePattern.test(body))forbiddenRuntimeHits.push(`${rel} (content)`);}catch{}}}
if(forbiddenRuntimeHits.length){console.error("[DETAIL] Removed podcast references detected:");for(const hit of forbiddenRuntimeHits.slice(0,20))console.error(`  - ${hit}`);}
expect(forbiddenRuntimeHits.length===0, "Removed Dr. Rudy podcast has zero public/runtime references, routes, metadata, cards, hidden navigation, or assets.");
for(const c of checks)console.log(`[${c.ok?"PASS":"FAIL"}] ${c.label}`);
const failed=checks.filter(c=>!c.ok).length;
console.log(`[SUMMARY] ${checks.length-failed} passed, ${failed} failed.`);
if(failed)process.exit(1);

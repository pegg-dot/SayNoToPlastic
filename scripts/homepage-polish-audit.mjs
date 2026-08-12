import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const home = read('app/page.tsx');
const community = read('app/community/page.tsx');
const journey = read('app/components/BodyJourney.tsx');
const chrome = read('app/components/SiteChrome.tsx');
const evidence = read('app/content/evidence.ts');
const actions = read('app/content/actions.ts');
const css = read('app/globals.css');

let passed = 0;
let failed = 0;
function expect(condition, label) {
  if (condition) {
    console.log(`[PASS] ${label}`);
    passed += 1;
  } else {
    console.error(`[FAIL] ${label}`);
    failed += 1;
  }
}

expect(!home.includes('Plastic is not just an environmental problem.'), 'Hero no longer repeats the environmental-problem setup line.');
expect(home.includes('The most dangerous pollutant is the one already inside us.'), 'Core book premise remains the hero headline.');
expect(home.includes('Human evidence, explained clearly—then practical places to start.'), 'Hero deck is reduced to one concise sentence.');
expect(!home.includes('hp-hero-note'), 'Hero byline was removed to reduce first-screen text density.');

expect(chrome.includes('brand-wordmark') && chrome.includes('/brand/sntp-wordmark-microplastic-nav.png'), 'Header uses the approved microplastic wordmark asset.');
expect(!chrome.includes('brand-prefix') && !chrome.includes('brand-lead') && !chrome.includes('brand-main'), 'Legacy text wordmark markup is gone.');
expect(css.includes('.brand:before,.brand:after{display:none!important;content:none!important}'), 'Legacy slash/underline decoration is explicitly disabled for the raster wordmark.');
expect(css.includes('v40.13 — user-approved microplastic wordmark') && css.includes('.brand-wordmark{'), 'Approved wordmark is sized as responsive site chrome.');

expect(journey.includes('journey-visible-anatomy') && journey.includes('current.modelLabel') && !journey.includes('current.modelNote'), 'Anatomy stage renders one short visible-anatomy label without the former technical note pileup.');
expect(!evidence.includes('Pregnant female body · full anatomical map'), 'Rejected first-chapter anatomical wording is removed from source.');
expect(journey.includes('{current.chapter}'), 'Anatomy stage keeps a compact chapter locator.');

expect(home.includes('name: "Food storage"'), 'Exposure route 03 is now Food storage.');
expect(home.includes('name: "Heat"'), 'Exposure route 04 is now Heat.');
expect(!home.includes('name: "Heat and food contact"'), 'Redundant Heat and food contact label is removed.');

expect(evidence.includes('title: "Particles were detected most often during acute heart attack."'), 'Homepage heart title is shortened.');
expect(evidence.includes('Particles were detected in 16 of 19 heart-attack patients'), 'Homepage heart finding keeps the acute group count in concise form.');
expect(evidence.includes('does not prove plastic caused the heart attack.'), 'Homepage heart meaning retains the causality boundary.');
expect(evidence.includes('Related artery-plaque evidence') && evidence.includes('The 2024 study was observational and did not prove causation.'), 'The distinct 2024 carotid-plaque study remains visible on Home.');
expect(evidence.includes('year: "2026"') && evidence.includes('European Heart Journal'), 'Primary coronary-blood metadata remains 2026 European Heart Journal.');
expect(evidence.includes('4.53×') && evidence.includes('The New England Journal of Medicine'), 'Distinct carotid-plaque evidence remains intact.');

expect(home.includes('coreRules.map') && ['Don’t heat plastic.', 'Don’t store food in plastic.', 'Don’t drink from plastic.'].every((rule) => actions.includes(`title: "${rule}"`)), 'Action bridge renders all three exact core rules from the canonical action source.');
expect(home.includes('className="button navy hp-actions-cta"'), 'Action CTA has a dedicated spacing hook.');
expect(css.includes('.hp-actions-cta{margin-top:32px}'), 'Desktop CTA receives explicit breathing room from body copy.');
expect(home.includes('<p className="lead">Pick one routine to change first.</p>'), 'Action copy no longer repeats the three rules already shown in the left column.');
expect(css.includes('grid-template-columns:minmax(430px,1fr) minmax(520px,1.06fr)'), 'Action bridge uses a more balanced two-column desktop grid.');

expect(css.includes('object-fit:cover') && css.includes('-webkit-mask-image:linear-gradient(90deg'), 'Hero artwork fills the stage and fades into the background instead of ending as a rectangle.');
expect(css.includes('v40 homepage polish'), 'v40 visual override block is present and labeled.');

expect(home.includes('className="hp-media-bridge"'), 'Events & Media bridge remains on the homepage.');
expect(css.includes('.home-v2 .hp-media-bridge{') && css.includes('max-width:none;') && css.includes('width:100%;'), 'Events & Media background is full-bleed instead of capped to the editorial content width.');
expect(css.includes('calc((100vw - var(--content-max))/2)'), 'Full-bleed Events & Media keeps its inner content aligned to the editorial grid on wide screens.');
expect(!home.includes('className="hp-join-image"'), 'Oversized generational image is removed from the homepage Join section.');
expect(home.includes('<section id="join" className="hp-join">') && home.includes('<SignupForm />'), 'Homepage still keeps the Community/newsletter path after removing the giant image.');
expect(community.includes('className="community-visual"') && community.includes('/generations-full-mobile.webp') && community.includes('/generations-full.webp') && community.includes('loading="eager"') && community.includes('fetchPriority="high"'), 'Generational visual remains as a responsive eager hero asset on the dedicated Community page without forcing it onto Home.');
expect(css.includes('v40.1 lower-home polish'), 'v40.1 lower-home visual override block is present and labeled.');

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
if (failed) process.exit(1);

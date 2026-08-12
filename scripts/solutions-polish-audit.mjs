import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const solutions = read('app/solutions/page.tsx');
const planner = read('app/components/ActionPlanner.tsx');
const chrome = read('app/components/SiteChrome.tsx');
const quickCard = read('app/quick-action-card/page.tsx');
const actions = read('app/content/actions.ts');
const css = read('app/globals.css');
const matrix = read('docs/DEFINITIVE_COMPLETION_MATRIX.csv');

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

expect(solutions.includes('className="solutions-direct-inner"'), 'Solutions lower action section has one contained inner editorial grid.');
expect(solutions.includes('className="solutions-direct-lead"'), 'Kitchen image and direct-change headline share one coherent lead row.');
expect(solutions.includes('className="solutions-direct-copy"'), 'Direct-change copy has an explicit aligned layout hook.');
expect(css.includes('.solutions-v2 .solutions-direct{') && css.includes('max-width:none;') && css.includes('background:var(--ivory)'), 'Ivory Solutions field is full-bleed instead of a floating capped block.');
expect(css.includes('.solutions-v2 .solutions-direct>.solutions-direct-inner{') && css.includes('display:block;') && css.includes('width:min(var(--content-max),calc(100% - 120px))'), 'Full-bleed field uses a higher-specificity block override so the legacy first-child grid cannot collapse the kitchen figure.');
expect(css.includes('.solutions-direct-lead{') && css.includes('grid-template-columns:minmax(0,1.22fr) minmax(320px,.78fr)'), 'Kitchen image receives the larger share of the desktop lead grid.');
expect(css.includes('.solutions-kitchen-figure{') && css.includes('grid-column:auto;') && css.includes('grid-template-columns:1fr;') && css.includes('width:100%;'), 'Kitchen figure fills its intended lead column instead of collapsing to a thumbnail.');
expect(!css.includes('.solutions-v2 .solutions-direct>.solutions-direct-inner{\n  display:grid;'), 'High-specificity Solutions inner override remains block layout, not the legacy grid.');
expect(css.includes('.solutions-kitchen-figure img{') && css.includes('aspect-ratio:16/10') && css.includes('object-fit:cover'), 'Kitchen image has a controlled editorial crop instead of arbitrary page height.');
expect(css.includes('.solutions-v2 .solutions-direct-grid>a{') && css.includes('min-height:310px'), 'Three direct guide cards use a consistent compact row rhythm.');
expect(css.includes('@media(max-width:1000px)') && css.includes('.solutions-direct-lead{grid-template-columns:1fr'), 'Direct Solutions section intentionally stacks on tablet/mobile.');

expect(!solutions.includes('solutions-editorial-note'), 'Visible Solutions Evidence Boundary strip is removed.');
expect(!solutions.includes('Evidence boundary'), 'Solutions page no longer prints the Evidence Boundary label.');
expect(!quickCard.includes('quick-card-editorial-note') && quickCard.includes('action.reviewNote'), 'Large editorial-note panel is removed while contested authored items retain inline review notes.');
expect(actions.includes('Evidence does not currently establish sauna or exercise') && actions.includes('Evidence does not currently establish a specific food or cleanse'), 'Quick Action Card still states the scientific limitations transparently beside contested items.');

expect(solutions.includes('/resources/microplastics-drinking-water-filter-guide'), 'Water guide route remains intact.');
expect(solutions.includes('/resources/plastic-kitchen-conversion'), 'Kitchen-conversion guide route remains intact.');
expect(solutions.includes('/resources/single-use-plastic-foodware'), 'Single-use guide route remains intact.');
expect(solutions.includes('<ActionPlanner />'), 'One-change planner remains on Solutions.');
expect(planner.includes('slice(0, 1)') && planner.includes('of 1 selected'), 'Planner still enforces one current change.');
expect(solutions.includes('Don’t heat plastic. Don’t store food in plastic. Don’t drink from plastic.'), 'Exact three core rules remain visible.');
expect(solutions.includes('The first step is simple. The rest is optional depth.'), 'Optional-depth bridge remains intact.');

expect(!chrome.includes('className="earth-image"'), 'Footer no longer renders the Earth-at-night image.');
expect(chrome.includes('The greatest inheritance we can leave our children'), 'Inheritance quote remains as live text.');
expect(css.includes('.site-footer .earth{') && css.includes('background:linear-gradient(180deg,#07111d 0%,#03080d 100%)!important'), 'Footer quote uses the requested flat dark field.');
expect(css.includes('.site-footer .earth:before{') && css.includes('border:1px solid rgba(133,166,180,.12)'), 'Only a faint abstract Earth curve remains as optional atmosphere.');
expect(exists('public/earth-footer.webp'), 'Earlier Earth-at-night asset remains preserved for provenance even though it is no longer rendered.');
expect(matrix.includes('later rendered user reviews 2026-08-07 (Science and Solutions)'), 'Completion ruler records the later footer visual decision instead of silently contradicting the blueprint.');

for (const file of [
  'docs/reviews/v40.3-solutions/solutions-flow-01.png',
  'docs/reviews/v40.3-solutions/solutions-flow-02.png',
  'docs/reviews/v40.3-solutions/solutions-flow-03.png',
  'docs/reviews/v40.3-solutions/solutions-flow-04.png',
]) expect(exists(file), `Rendered review provenance preserved: ${path.basename(file)}.`);

expect(css.includes('v40.3 Solutions rendered-feedback polish') && css.includes('v40.4 surgical correction'), 'Solutions visual override history is labeled for future traceability.');

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
if (failed) process.exit(1);

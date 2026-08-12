import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const page = read('app/resources/page.tsx');
const guidePage = read('app/resources/[slug]/page.tsx');
const library = read('app/components/GuideLibrary.tsx');
const guides = read('app/content/guides.ts');
const css = read('app/globals.css');

let passed = 0;
let failed = 0;
function expect(condition, label) {
  if (condition) { console.log(`[PASS] ${label}`); passed += 1; }
  else { console.error(`[FAIL] ${label}`); failed += 1; }
}

expect(page.includes('className="inner-page resources-v2"'), 'Guides route keeps its scoped reading-room identity.');
expect(page.includes('<section className="resource-library ivory"><div className="resource-library-inner">'), 'Guide library remains a dedicated full-width field with aligned inner content.');
expect(page.includes('Start simple. Go deeper when you need to.'), 'Guides hero remains focused on practical questions.');
expect(page.includes('Choose a route'), 'Four reading pathways remain available.');
expect(css.includes('@media(min-width:701px){.resources-v2 .resource-pathways>div{grid-template-columns:repeat(2,minmax(0,1fr))}}'), 'Desktop reading pathways remain a balanced two-by-two grid.');
expect(!library.includes('guide-starters') && !library.includes('Three useful first reads.'), 'Featured-read layer is removed to avoid repeating another set of recommendations.');
expect(library.includes('Search guides') && library.includes('type="search"'), 'Guide search remains visible and functional.');
expect(library.includes('role="group" aria-label="Filter field guides by topic"'), 'Accessible category filters remain intact.');
expect(library.includes('visibleGuides.length'), 'Search and filter result state remains dynamic.');
expect((guides.match(/\bslug:\s*"/g) || []).length === 14, 'All 14 guide records remain present.');

expect(guidePage.includes('guide-page-v25'), 'Individual guide pages opt into the v40.25 article-reading layout.');
expect(guidePage.includes('guide-prose-section') && guidePage.includes('What the evidence supports') && guidePage.includes('What remains uncertain'), 'Known and uncertain evidence are presented as readable article prose rather than cards.');
expect(guidePage.includes('guide-actions-v25') && guidePage.includes('What you can do now'), 'Practical actions remain a clear linear section after the evidence.');
expect(guidePage.includes('guide-sources-disclosure'), 'Sources remain available in a collapsible disclosure.');
expect(!guidePage.includes('guide-book-cta') && !guidePage.includes('CheckoutButton'), 'Repeated book-sales block is removed from every guide.');
expect(!guidePage.includes('uncertainty-box'), 'Old oversized uncertainty panel is removed.');
expect(css.includes('.resources-v2 .resource-grid>a{min-height:255px') && css.includes('.guide-article-v25{display:block!important'), 'Guide index and detail pages use denser spacing.');

for (const file of [
  'docs/reviews/v40.5-guides/guides-layout-01.png',
  'docs/reviews/v40.5-guides/guides-layout-02.png',
]) expect(exists(file), `Rendered Guides review provenance preserved: ${path.basename(file)}.`);

expect(css.includes('v40.25 — reading-flow polish'), 'Current guide visual override is labeled for traceability.');

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
if (failed) process.exit(1);

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const science = read('app/science/page.tsx');
const css = read('app/globals.css');
const evidence = read('app/content/evidence.ts');
const chrome = read('app/components/SiteChrome.tsx');

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

expect(!science.includes('How to read this page'), 'Removed the unnecessary “How to read this page” helper block.');
expect(!science.includes('science-v2-hero-note'), 'Science hero no longer reserves layout space for the removed helper block.');
expect(science.includes('Plastic has been found throughout the human body.'), 'Primary Science headline remains unchanged.');
expect(science.includes('07</dt><dd>Human research studies') && science.includes('07</dt><dd>Body-system overviews'), 'Science hero retains the evidence counts and advances the approved body-system library to seven overviews.');
expect(science.includes('100%</dt><dd>Original papers linked'), 'Science hero still communicates primary-source coverage.');

expect(science.includes('/images/science/science-body-overview.webp'), 'User-supplied full-body visual is wired into the Science hero.');
expect(science.includes('className="science-v2-hero-figure"') && science.includes('aria-hidden="true"'), 'Hero body visual is decorative and removed from the accessibility reading order.');
expect(css.includes('.science-v2-hero-figure') && css.includes('opacity:.29'), 'Hero body visual is deliberately subdued rather than pasted in at full strength.');
expect(css.includes('.science-v2-hero:after') && css.includes('linear-gradient(90deg'), 'Hero has a readability blend between live headline text and the background visual.');

const visualAssets = [
  ['blood', 'public/images/science/blood.webp'],
  ['brain', 'public/images/science/brain.webp'],
  ['heart-arteries', 'public/images/science/heart.webp'],
  ['placenta', 'public/images/science/placenta.webp'],
  ['ovary', 'public/images/science/ovary.webp'],
  ['testicular-tissue', 'public/images/science/testicular-tissue.webp'],
];
for (const [chapter, file] of visualAssets) {
  expect(exists(file), `Individual ${chapter} science visual exists as its own runtime asset.`);
}
expect(visualAssets.every(([, file]) => science.includes(`/${file.replace(/^public\//, '')}`)), 'All six supplied organ/system visuals are independently wired into the Science page.');
expect(!science.includes('organ-reference-collage') && !science.includes('science-collage'), 'The supplied collage is not rendered as one giant combined image.');
expect(science.includes('loading="lazy"'), 'Below-fold chapter imagery is lazy-loaded.');
expect(css.includes('.science-v2-chapter-visual') && css.includes('aspect-ratio:4/3'), 'Individual evidence visuals have a consistent editorial frame.');

expect(evidence.includes('Nature Medicine') && evidence.includes('brain tissue'), 'Brain study and source remain intact after visual integration.');
expect(evidence.includes('European Heart Journal') && evidence.includes('year: "2026"'), '2026 European Heart Journal coronary-blood record remains intact.');
expect(evidence.includes('The New England Journal of Medicine') && evidence.includes('4.53×'), 'Distinct 2024 carotid-plaque record remains intact.');
expect(evidence.includes('14 of 18') && evidence.includes('2,191'), 'Human follicular-fluid figures remain intact.');
expect(evidence.includes('23 of 23') && evidence.includes('328.44'), 'Human testicular-tissue figures remain intact.');
expect(evidence.includes('4 of 6') && evidence.includes('12 pigmented microparticles'), 'Placenta finding remains intact.');
expect(evidence.includes('17 of 22'), 'Blood finding remains intact.');

expect(!chrome.includes('className="earth-image"'), 'Later rendered review removes the distracting Earth-at-night photo from the live footer.');
expect(css.includes('.site-footer .earth{') && css.includes('background:linear-gradient(180deg,#07111d 0%,#03080d 100%)!important'), 'Science now inherits the calm flat footer field requested in rendered review.');
expect(css.includes('.site-footer .earth:before{') && css.includes('rgba(133,166,180,.12)'), 'Footer keeps only a very faint abstract Earth curve.');
expect(exists('public/earth-footer.webp'), 'Earlier Earth footer asset remains preserved as source provenance rather than being deleted.');

expect(exists('docs/reviews/v40.2-science/science-page-before.png'), 'Original Science screenshot is preserved as review provenance.');
expect(exists('docs/reviews/v40.2-science/body-reference.png'), 'User-supplied full-body reference is preserved as review provenance.');
expect(exists('docs/reviews/v40.2-science/organ-reference-collage.png'), 'User-supplied organ collage is preserved as review provenance.');

console.log(`[SUMMARY] ${passed} passed, ${failed} failed.`);
if (failed) process.exit(1);

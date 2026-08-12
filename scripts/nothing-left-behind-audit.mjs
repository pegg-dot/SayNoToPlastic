import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const rel = (p) => path.join(root, p);
const read = (p) => fs.readFileSync(rel(p), 'utf8');
const exists = (p) => fs.existsSync(rel(p));
const results = [];
function check(name, ok, detail='') { results.push({name, ok:Boolean(ok), detail}); }

function parseCsv(text) {
  const rows=[]; let row=[]; let field=''; let i=0; let quoted=false;
  while (i<text.length) {
    const c=text[i];
    if (quoted) {
      if (c==='"' && text[i+1]==='"') { field+='"'; i+=2; continue; }
      if (c==='"') { quoted=false; i++; continue; }
      field+=c; i++; continue;
    }
    if (c==='"') { quoted=true; i++; continue; }
    if (c===',') { row.push(field); field=''; i++; continue; }
    if (c==='\n') { row.push(field.replace(/\r$/,'')); rows.push(row); row=[]; field=''; i++; continue; }
    field+=c; i++;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/,'')); rows.push(row); }
  const header=rows.shift() ?? [];
  return rows.filter(r=>r.some(v=>v!=='')).map(r=>Object.fromEntries(header.map((h,j)=>[h,r[j]??''])));
}

const matrixPath='docs/DEFINITIVE_COMPLETION_MATRIX.csv';
const statusPath='docs/DEFINITIVE_COMPLETION_STATUS.json';
const matrix=parseCsv(read(matrixPath));
const status=JSON.parse(read(statusPath));

const ids=matrix.map(r=>r.id);
check('Matrix contains unique requirement IDs', new Set(ids).size===ids.length, `${ids.length} rows / ${new Set(ids).size} unique`);
check('Matrix total matches status JSON', matrix.length===status.totalRequirements, `${matrix.length} == ${status.totalRequirements}`);
check('Corrected nothing-left-behind matrix tracks 179 requirements', matrix.length===179, String(matrix.length));
const counts={}; for (const r of matrix) counts[r.bucket]=(counts[r.bucket]||0)+1;
check('Done count matches status', (counts['1 — Done and proven']||0)===status.doneAndProven, String(counts['1 — Done and proven']||0));
check('Our-work count matches status', (counts['2 — Our work remains']||0)===status.ourWorkRemains, String(counts['2 — Our work remains']||0));
check('Blocked count matches status', (counts['3 — Blocked on owner/provider/source input']||0)===status.blockedOnOwnerProviderSource, String(counts['3 — Blocked on owner/provider/source input']||0));
const blockedRows=matrix.filter(r=>r.bucket==='3 — Blocked on owner/provider/source input');
const blockedSubtypes={}; for (const r of blockedRows) blockedSubtypes[r.subtype]=(blockedSubtypes[r.subtype]||0)+1;
check('Owner/approval blocked subtype count matches status', (blockedSubtypes['Owner decision/asset/approval required']||0)===status.blockedOnOwner, String(blockedSubtypes['Owner decision/asset/approval required']||0));
check('External-provider blocked subtype count matches status', (blockedSubtypes['External account/provider/domain proof required']||0)===status.blockedOnExternalProvider, String(blockedSubtypes['External account/provider/domain proof required']||0));
check('Missing-source blocked subtype count matches status', (blockedSubtypes['Missing source/context required']||0)===status.blockedOnMissingSourceContext, String(blockedSubtypes['Missing source/context required']||0));
check('Blocked subtype counts sum to blocked total', status.blockedOnOwner+status.blockedOnExternalProvider+status.blockedOnMissingSourceContext===status.blockedOnOwnerProviderSource, `${status.blockedOnOwner}+${status.blockedOnExternalProvider}+${status.blockedOnMissingSourceContext} == ${status.blockedOnOwnerProviderSource}`);
check('Bucket counts sum to total', Object.values(counts).reduce((a,b)=>a+b,0)===matrix.length, JSON.stringify(counts));

const requiredNewIds=['DS-01','DS-02','DS-03','DS-04','DS-05','DS-06','HV-01','HV-02','HV-03','HV-04','AS-01','CF-05','MC-16','CP-01','LA-01','MC-17','MC-18','MC-19','QA-01','AB-13','CF-06','CF-07','CF-08','CF-09','SG-01','SG-02','HM-19'];
for (const id of requiredNewIds) check(`Nothing-left-behind row ${id} exists`, ids.includes(id));

const cf09=matrix.find(r=>r.id==='CF-09');
check('CF-09 preserves the European Heart Journal year conflict', Boolean(cf09) && /2025/.test(cf09.requirement) && /2026/.test(cf09.requirement) && cf09.bucket==='1 — Done and proven');

const hm07=matrix.find(r=>r.id==='HM-07');
check('HM-07 moves from owner-asset blocker to real-film proof queue', Boolean(hm07) && hm07.bucket==='2 — Our work remains' && /2026-08-08/.test(hm07.v38_evidence||'') && /captions\/transcript/.test(hm07.remaining_action||''));

const hm19=matrix.find(r=>r.id==='HM-19');
check('HM-19 protects one-viewport welcome-modal fit from regression', Boolean(hm19) && hm19.bucket==='2 — Our work remains' && /standard browser viewport/.test(hm19.requirement||'') && /accessibility/.test(hm19.requirement||''));

const evidence=read('app/content/evidence.ts');
check('Coronary-blood evidence record remains 2026', /id:\s*["']acute-heart-attack-study["'][\s\S]*?year:\s*["']2026["']/.test(evidence));

for (const r of matrix) {
  const required=['id','category','requirement','source','bucket','subtype','severity','remaining_action'];
  check(`Requirement ${r.id} required fields`, required.every(k=>String(r[k]??'').trim().length>0));
}

const requiredFiles=[
  'app/components/ExposureRouteVisual.tsx',
  'public/hero-desktop.webp','public/hero-mobile.webp',
  'public/kitchen-desktop.webp','public/kitchen-mobile.webp',
  'public/generations.webp','public/generations-mobile.webp','public/generations-full.webp','public/generations-full-mobile.webp',
  'public/earth-footer.webp','public/sntp-social-share.webp',
  'public/brand/sntp-wordmark-horizontal.svg','public/brand/sntp-wordmark-compact.svg','public/brand/sntp-wordmark-monochrome.svg',
  'docs/CONTENT_OPERATIONS.md','scripts/content-intake-audit.mjs','docs/RAW_TRANSCRIPT_TRACEABILITY.md','docs/RAW_TRANSCRIPT_TRACEABILITY.csv','docs/BLUEPRINT_TRACEABILITY.md','docs/BLUEPRINT_TRACEABILITY.csv','docs/REGISTER_TRACEABILITY.md','docs/REGISTER_TRACEABILITY.csv','docs/SOURCE_VISUAL_REVIEW.md','docs/AUDIT_OF_AUDIT.md','docs/V39_1_CHANGE_MANIFEST.md','docs/V39_1_NOTHING_LEFT_BEHIND.md',
  'docs/content-templates/guide-intake.json','docs/content-templates/evidence-study-intake.json','docs/content-templates/media-intake.json','docs/content-templates/affiliate-product-intake.json',
  'docs/sources/RAW_MEETING_TRANSCRIPT.txt','docs/sources/MASTER_DELIVERY_REGISTER.md',
  'docs/sources/audio/Dr-Haddad-website-review-recording.m4a',
  'docs/sources/blueprints/SayNoToPlastic_Master_Blueprint_Chapter_1_Designer_Setup.docx',
  'docs/sources/blueprints/SayNoToPlastic_Master_Blueprint_Chapter_2_Landing_Page_Build.docx',
  'docs/sources/images/quick-action-card-page-121.png','docs/sources/images/homo-plasticus-official-book-render.png',
  'public/media/welcome-dr-haddad.mp4','public/media/welcome-dr-haddad-poster.webp','app/content/welcome-film-metadata.json','docs/WELCOME_FILM_INTEGRATION.md'
];
for (const f of requiredFiles) check(`Required audit/source asset ${f}`, exists(f));

const manifest=read('docs/sources/SOURCE_MANIFEST.md');
const hashMatches=[...manifest.matchAll(/^([a-f0-9]{64})\s+(docs\/sources\/[^\s]+)$/gm)];
check('Source manifest exposes integrity hashes', hashMatches.length>=7, `${hashMatches.length} hashes`);
for (const [,expected,p] of hashMatches) {
  if (!exists(p)) { check(`Source hash ${p}`, false, 'missing'); continue; }
  const actual=crypto.createHash('sha256').update(fs.readFileSync(rel(p))).digest('hex');
  check(`Source hash ${p}`, actual===expected, actual===expected?'match':`${actual} != ${expected}`);
}

const appFiles=[];
function walk(dir) {
  for (const ent of fs.readdirSync(rel(dir),{withFileTypes:true})) {
    const p=path.posix.join(dir,ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|css|json)$/.test(ent.name)) appFiles.push(p);
  }
}
walk('app');
const publicSource=appFiles.map(p=>read(p)).join('\n');
const rejected=[
  'caution can be practical without pretending',
  'build a common relationship with evolving science',
  'do not turn caution into panic',
  'turn caution into panic'
];
for (const phrase of rejected) check(`Rejected phrase absent: ${phrase}`, !publicSource.toLowerCase().includes(phrase.toLowerCase()));
check('Accepted phrase not encoded as rejected', !rejected.some(p=>p.includes('small enough to begin, meaningful enough to repeat')));

const home=read('app/page.tsx');
const community=read('app/community/page.tsx');
check('Home uses approved hero art shell', home.includes('hp-hero-approved-art'));
check('Home hero uses eager responsive image derivatives', home.includes('/hero-mobile.webp') && home.includes('/hero-desktop.webp') && home.includes('fetchPriority="high"'));
check('Home intentionally omits the oversized generations panel after rendered user review', !home.includes('hp-join-image') && !home.includes('/generations.webp'));
check('Community generations visual uses eager responsive hero image derivatives', community.includes('/generations-full-mobile.webp') && community.includes('/generations-full.webp') && community.includes('loading="eager"') && community.includes('fetchPriority="high"'));
check('Home uses all six exposure visuals', home.includes('ExposureRouteVisual') && ['air','water','food','heat','textiles','personal-care'].every(k=>home.includes(`kind: "${k}"`)));
check('Dedicated Community page retains the approved generations visual shell', community.includes('community-visual'));
check('TEDx is not a homepage section', !/className=["']hp-tedx|id=["']tedx/i.test(home));
const idx=[home.indexOf('id="solutions"'),home.indexOf('<BookJourney'),home.indexOf('id="about"'),home.indexOf('hp-media-bridge'),home.indexOf('id="join"')];
check('Home lower-page order is action → book → about → media → community', idx.every((v,i)=>v>=0 && (i===0 || v>idx[i-1])), idx.join(' < '));

const solutions=read('app/solutions/page.tsx');
check('Solutions uses approved kitchen responsive picture', solutions.includes('/kitchen-desktop.webp') && solutions.includes('/kitchen-mobile.webp') && solutions.includes('reverse-osmosis'));
const chrome=read('app/components/SiteChrome.tsx');
check('Header scroll threshold is within 40-60px blueprint window', /window\.scrollY\s*>\s*48/.test(chrome));
check('Mobile menu implements focus return', chrome.includes('toggleRef.current?.focus()'));
check('Mobile menu implements background scroll lock', chrome.includes('useBodyScrollLock(menuOpen)'));
const css=read('app/globals.css');
check('Scrolled header uses ~92% Midnight Navy', css.includes('rgba(9,18,31,.92)'));
check('Exposure body copy minimum raised to 16px in restored layer', /\.exposure-grid p\{font-size:16px/.test(css));
check('Later rendered review supersedes the live Earth photo while preserving a flat quote field', !chrome.includes('className="earth-image"') && css.includes('.site-footer .earth{') && css.includes('background:linear-gradient(180deg,#07111d 0%,#03080d 100%)!important'));
check('Original Earth-at-night asset remains preserved for provenance', exists('public/earth-footer.webp'));
check('Footer legal text restored to 14px', /\.footer-bottom\{font-size:14px/.test(css));
check('Footer touch targets restored to 48px', /\.footer-bottom a,.footer-bottom button\{min-height:48px/.test(css));
check('Responsive hero derivative is wired', css.includes("url('/hero-mobile.webp')") && css.includes("url('/hero-desktop.webp')"));
check('Responsive generations derivative is wired on Community', community.includes('/generations-full-mobile.webp') && community.includes('/generations-full.webp'));

check('Home SEO title matches blueprint intent', home.includes('Say No To Plastic | Microplastics, Human Health & Practical Solutions'));
check('Home social share asset is 1200x630 candidate', home.includes('/sntp-social-share.webp') && exists('public/sntp-social-share.webp'));

const pkg=JSON.parse(read('package.json'));
check('Content preflight package command exists', pkg.scripts?.['content:preflight']==='node scripts/content-intake-audit.mjs');
check('Nothing-left-behind package command exists', pkg.scripts?.['transcript:complete']==='node scripts/nothing-left-behind-audit.mjs');



const blueprintRows=parseCsv(read('docs/BLUEPRINT_TRACEABILITY.csv'));
check('Blueprint traceability covers all 10 Chapter 1 and 16 Chapter 2 sections', blueprintRows.length===26 && blueprintRows.filter(r=>r.chapter==='ch1').length===10 && blueprintRows.filter(r=>r.chapter==='ch2').length===16, `${blueprintRows.length} mapped sections`);

const traceRows=parseCsv(read('docs/RAW_TRANSCRIPT_TRACEABILITY.csv'));
let expectedLine=1; let traceOk=true;
for (const r of traceRows) {
  const a=Number(r.start_line), b=Number(r.end_line);
  if (a!==expectedLine || b<a) { traceOk=false; break; }
  expectedLine=b+1;
}
check('Raw transcript traceability covers lines 1-528 without gaps', traceOk && expectedLine===529, `${traceRows.length} segments; next expected line ${expectedLine}`);
const referencedIds = (rows, field='requirement_ids') => rows.flatMap(r => String(r[field]||'').split(';').map(v=>v.trim()).filter(Boolean));
const transcriptIds=referencedIds(traceRows);
const blueprintIds=referencedIds(blueprintRows);
const missingTranscriptIds=[...new Set(transcriptIds.filter(id=>!ids.includes(id)))];
const missingBlueprintIds=[...new Set(blueprintIds.filter(id=>!ids.includes(id)))];
check('Every transcript traceability requirement ID exists in the completion matrix', missingTranscriptIds.length===0, missingTranscriptIds.join(', ')||`${new Set(transcriptIds).size} unique mapped IDs`);
check('Every blueprint traceability requirement ID exists in the completion matrix', missingBlueprintIds.length===0, missingBlueprintIds.join(', ')||`${new Set(blueprintIds).size} unique mapped IDs`);
const registerRows=parseCsv(read('docs/REGISTER_TRACEABILITY.csv'));
const registerIds=referencedIds(registerRows);
const missingRegisterIds=[...new Set(registerIds.filter(id=>!ids.includes(id)))];
check('Master Delivery Register traceability covers all 13 major sections', registerRows.length===13 && registerRows.map(r=>Number(r.section)).join(',')==='1,2,3,4,5,6,7,8,9,10,11,12,13', `${registerRows.length} mapped sections`);
check('Every Register traceability requirement ID exists in the completion matrix', missingRegisterIds.length===0, missingRegisterIds.join(', ')||`${new Set(registerIds).size} unique mapped IDs`);
check('CF-09 is mapped to the cardiovascular transcript segment', traceRows.some(r=>r.start_line==='33' && r.end_line==='46' && String(r.requirement_ids).split(';').includes('CF-09')));
check('SC-04 is mapped to the cardiovascular transcript segment', traceRows.some(r=>r.start_line==='33' && r.end_line==='46' && String(r.requirement_ids).split(';').includes('SC-04')));

const transcript=read('docs/sources/RAW_MEETING_TRANSCRIPT.txt').toLowerCase();
check('No literal airplane/flapping requirement in preserved written transcript', !/\bairplanes?\b|\bflapping\b|\bflap(?:ped|ping)?\b/.test(transcript), 'searched literal variants; none found');
const audioStat=fs.statSync(rel('docs/sources/audio/Dr-Haddad-website-review-recording.m4a'));
const sg02=matrix.find(r=>r.id==='SG-02');
check('SG-02 preserves independent audio-transcript fidelity review as an open proof gate', Boolean(sg02) && sg02.bucket==='2 — Our work remains' && audioStat.size>50_000_000, `${audioStat.size} bytes`);

const failures=results.filter(r=>!r.ok);
for (const r of results) console.log(`${r.ok?'PASS':'FAIL'} | ${r.name}${r.detail?` | ${r.detail}`:''}`);
console.log(`\nNothing-left-behind audit: ${results.length-failures.length}/${results.length} passed; ${failures.length} failed.`);
if (failures.length) process.exit(1);

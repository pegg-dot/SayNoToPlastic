# Asset inventory

All paths below are relative to the project root. File sizes are approximate at handoff. Assets are exported in the project ZIP.

## Editorial raster assets

| File | Depicts / used by | Status and source/licensing note |
| --- | --- | --- |
| `public/hero.webp` | Legacy hero treatment | Bundled editorial asset; provenance not recorded in code. Keep until replaced by licensed final art. |
| `public/anatomy.webp`, `public/evidence.webp` | Legacy/static editorial anatomy/evidence treatments | Bundled assets; current Home uses WebGL anatomy rather than these as the principal experience. |
| `public/book.webp`, `public/book-official.webp` | Book art and Open Graph/book views | `book-official.webp` is used in metadata/book page; confirm owner rights for print/marketing scale. |
| `public/earth.webp`, `public/generations.webp`, `public/kitchen.webp` | Editorial section/backdrop imagery | Bundled assets; keep rights/provenance record before broad campaign use. The Earth image is no longer rendered in the footer after the later 2026-08-07 visual review. |
| `public/portrait.webp` | Homepage author portrait | Bundled. About page intentionally uses the TEDx profile photo instead. Replace with owner-supplied licensed high-resolution portrait when available. |
| `public/elie-haddad-tedx-profile.jpg` | About page speaker-profile portrait | Sourced from official TEDxMiami profile; retain attribution/context and replace with owner-supplied photo for unambiguous reuse control. |
| `public/tedx.webp` | Home and TEDx video poster | TEDx still/poster treatment. Confirm source permission for any external reuse beyond the site. |
| `public/images/anatomy/maternal-fetal-cutaway-v1.png` | Educational maternal-fetal cutaway reference | Production image asset. It must not be used to imply a patient-specific reconstruction. |
| `public/images/anatomy/body.png`, `brain.png`, `heart.png`, `ovary.png`, `placenta.png`, `testis.png`, `testis.svg` | Anatomy fallback/reference assets | Supporting anatomy assets. `testis.svg` is a derived BodyParts3D fallback and inherits its attribution/share-alike obligation. |
| `public/favicon.svg`, `public/icon.svg` | Browser/site iconography | Project graphics. |

## 3D anatomy assets

| File(s) | Role | Source/license/required credit |
| --- | --- | --- |
| `public/models/anatomy/body-female.glb`, `brain.glb`, `heart.glb`, `vasculature-female.glb`, `placenta.glb`, `ovary.glb`, `uterus-female.glb`, `pelvis-female.glb` | Current female/maternal atlas in the Home journey | NIH Human Reference Atlas, CC BY 4.0. Modified for web delivery/materials/lighting; preserve attribution. |
| `public/models/anatomy/fetus-mri.glb` | Current fetal surface in maternal educational assembly | Medical Vision Group fetal-SMPL, MIT. Public demonstration MAP-C507 frame 50. Keep boundary: no gestational-age claim and not a single-patient reconstruction. |
| `public/models/anatomy/testis-left.stl`, `testis-right.stl`, `epididymis-left.stl`, `epididymis-right.stl` | Separate male comparison scene | BodyParts3D, CC BY-SA 2.1 JP; retain attribution/share-alike conditions. |
| `public/models/anatomy/body.glb`, `vasculature.glb` | Legacy male/reference files | Not current primary scene inputs. Retain only while provenance/regression reference is useful; audit before deletion. |
| `public/models/anatomy/LICENSES.txt` | Legal/provenance record | Mandatory companion file for anatomy export. |

## Non-raster public content

| File | Use |
| --- | --- |
| `public/llms.txt` | Machine-readable public guide to key pages and policies. |

## Asset production scripts

| File | Purpose |
| --- | --- |
| `scripts/export-fetal-mri-mesh.py` | Exports fetal MRI mesh. |
| `scripts/render-fetal-mri-contact-sheet.py` | Visual inspection contact sheet. |
| `scripts/render-pregnancy-assembly-qa.py`, `scripts/export-pregnancy-assembly-qa.mjs` | Pregnancy-assembly QA/render export. |
| `scripts/render-testis-fallback.mjs` | Derived testis fallback rendering. |

## Private commerce asset boundary

The final ebook PDF is intentionally absent from this source export. When approved, upload it only to the private R2 bucket bound as `EBOOKS`, at the exact `EBOOK_OBJECT_KEY`. Never place the paid file in `public/`, commit it to source control, expose a public bucket URL, or include it in future handoff archives. Record its release checksum and edition metadata in the private launch record before activation.

## Missing/non-exportable media

- Original Work-chat screenshots are not generally exportable, but the local v40/v40.1/v40.2/v40.3 rendered-review screenshots used for current visual corrections are preserved under `docs/reviews/`.
- The current welcome film and poster are now in the repository as optimized web assets. Captions/transcript, media-kit headshots, final ebook file, and formal press assets remain absent.
- No licensed full muscle-by-muscle anatomical atlas is represented. Do not imply otherwise.

## v33 asset status

- `public/portrait.webp` — web-resolution portrait/press asset; it is no longer the welcome-film poster.
- `public/book-official.webp` — current web book-cover asset exposed through the press kit with final print-use approval still pending.
- `public/tedx.webp` — used only within the media/press system; removed from the homepage.
- `public/media/welcome-dr-haddad.mp4` and `public/media/welcome-dr-haddad-poster.webp` are the current user-supplied welcome-film runtime assets. Captions/transcript, high-resolution press portrait, and formal press-use files remain open.
- No affiliate product imagery has been added because no product has cleared review.

## v34 anatomy and brand asset decisions

- `public/models/anatomy/uterus-female.glb` is now actively rendered in the pregnancy/placenta scene; preserve its attribution with the rest of the NIH/HRA-derived package.
- `public/models/anatomy/ovary.glb` and `public/images/anatomy/ovary.png` remain functional placeholders for the ovary stage but are **not approved final clinical art**. The final experience needs a licensed, recognizable ovary and a clear follicular-fluid/egg inset.
- `public/book-official.webp` is now used on the product page and commerce preview. `public/book.webp` remains an alternate asset and should not silently replace the approved cover.
- v39.1 includes **candidate** horizontal, compact, and monochrome Say No to Plastic wordmarks plus a live gold text lockup. Final typeface/lettering, font license, and owner approval remain open; the candidate is not a final logo-rights claim.

---

## v38 transcript-priority assets

| Asset | Path | Purpose | Status / rights |
|---|---|---|---|
| Supplied Quick Action Card photograph | `docs/sources/images/quick-action-card-page-121.png` | Source of the exact 12 actions, three core rules, and Remember wording | Owner-supplied reference; public website uses accessible live text rather than the screenshot as the only content |
| Official book render | `docs/sources/images/homo-plasticus-official-book-render.png` | Published cover/credit reference | Owner-supplied; final ecommerce/publication rights still require owner confirmation |
| Labeled ovary/follicle fallback | `public/images/anatomy/ovary-labeled.svg` | Stable reduced-motion/no-WebGL fallback | Generated for v38 from project requirements; clinical review candidate, not final approval |
| Labeled testis/epididymis fallback | `public/images/anatomy/testis-labeled.png` | Stable reduced-motion/no-WebGL fallback | Generated from licensed BodyParts3D surfaces already included in the project; attribution/license record remains in the model asset inventory; clinical review candidate |
| Reproductive fallback renderer | `scripts/render-reproductive-fallbacks.py` | Reproducible generation of review assets | Internal build tool; not served publicly |

Do not replace these review candidates with unlicensed stock anatomy or generic decorative primitives.


## v39.1 recovered visual derivatives

These derivatives are non-destructive working assets created from the preserved approved visuals so the Sites/browser review can test the blueprint's responsive requirements. Original source assets remain unchanged.

- `public/hero-desktop.webp` / `public/hero-mobile.webp` — approved maternal/fetal hero artwork, responsive review derivatives.
- `public/kitchen-desktop.webp` / `public/kitchen-mobile.webp` — approved kitchen/RO artwork, responsive Solutions derivatives.
- `public/generations-mobile.webp` — mobile derivative of the approved three-generations editorial composition. v40.1 removes the giant Home placement; the asset is retained for the dedicated Community experience. Embedded artwork copy/button remains decorative only; live form/copy must remain separate.
- `public/earth-footer.webp` — preserved shallow Earth-at-night source crop. The later rendered review supersedes its live footer use; v40.3 keeps it only for provenance while the quote renders on a flat dark field with a faint CSS Earth curve.
- `public/sntp-social-share.webp` — 1200×630 **candidate** social card using the approved hero art; final visual signoff remains part of rendered QA.
- `public/brand/sntp-wordmark-horizontal.svg`, `sntp-wordmark-compact.svg`, `sntp-wordmark-monochrome.svg` — review candidates only.

Still owner/source blocked: final professional sculpture photography; final Dr. Haddad photo set; official media stills/rights; final wordmark/typeface approval. Welcome-film asset placement is no longer blocked; captions/transcript/content verification remain proof work.

## v40.2 Science rendered-feedback assets

These are direct derivatives of the images supplied by the user during the 2026-08-07 local Science review. No generated replacement image is used in the v40.2 runtime.

| Asset | Runtime use | Derivation |
| --- | --- | --- |
| `public/images/science/science-body-overview.webp` | Subtle decorative background in the Science hero | Cropped white screenshot frame from the user-supplied full-body science image and converted to WebP. |
| `public/images/science/brain.webp` | Brain evidence chapter | Cropped from the user-supplied six-panel reference; embedded label/caption excluded. |
| `public/images/science/heart.webp` | Heart & arteries evidence chapter | Cropped from the user-supplied six-panel reference; embedded label/caption excluded. |
| `public/images/science/placenta.webp` | Placenta evidence chapter | Cropped from the user-supplied six-panel reference; embedded label/caption excluded. |
| `public/images/science/testicular-tissue.webp` | Testicular tissue evidence chapter | Cropped from the user-supplied six-panel reference; embedded label/caption excluded. |
| `public/images/science/ovary.webp` | Ovary/developing eggs evidence chapter | Cropped from the user-supplied six-panel reference; embedded label/caption excluded. |
| `public/images/science/blood.webp` | Bloodstream evidence chapter | Cropped from the user-supplied six-panel reference; embedded label/caption excluded. |

Review provenance is stored in `docs/reviews/v40.2-science/`. Final rights/approval for public launch should follow the owner's normal asset-approval process.

## v40.9 welcome-film assets

| Asset | Path | Purpose | Status |
|---|---|---|---|
| Current hosted welcome film | `public/media/welcome-dr-haddad.mp4` | Homepage first-visit/replay dialog + Events & Media inline playback | User-supplied source converted to H.264/AAC 540×960; 3:28; no subtitle track |
| Welcome-film poster | `public/media/welcome-dr-haddad-poster.webp` | Click-to-play poster for both welcome surfaces | Frame derived from supplied video; 540×960 |
| Provenance metadata | `app/content/welcome-film-metadata.json` | Source/master hash and derivative integrity | Master HEVC upload is not bundled; filename/hash/size preserved |

## v40.13 approved microplastic wordmark

| Asset | Path | Purpose | Status |
|---|---|---|---|
| Approved microplastic wordmark | `public/brand/sntp-wordmark-microplastic.png` | Primary footer/display brand lockup | User-selected in the 2026-08-08 branding review; cropped from the exact approved transparent artwork. Serif letters are pale plastic with embedded colored fragments and restrained falling particles. |
| Navbar wordmark derivative | `public/brand/sntp-wordmark-microplastic-nav.png` | Shared header/navigation lockup | Downsampled from the exact approved wordmark; no redesign or additional generation. |

The older v39.1 SVG candidates remain in the archive for provenance/reference but are no longer the live visual wordmark. The runtime uses the approved raster treatment because its microplastic texture is inherently image-based. Prose, metadata, legal/copyright copy, and accessible labels remain real text.

## v40.15 Dr. Haddad supplied content set

| Source group | Path | Purpose | Status |
|---|---|---|---|
| Exact supplied PDFs | `docs/sources/haddad-content/pdf/` | Authoritative wording/organization basis for ten new content topics | Bundled, SHA-256 registered; does not itself constitute primary-study verification |
| Layout-preserving text extracts | `docs/sources/haddad-content/text/` | Search, diff, and audit convenience | Generated from exact PDFs; PDFs remain authoritative |
| Source and route register | `docs/sources/haddad-content/README.md` | Original name, stored path, pages, bytes, hash, route, and source state | Current |
| Content integration blueprint | `docs/HADDAD_CONTENT_INTEGRATION_BLUEPRINT.md` | Planned layered placement across existing site | Preserved |
| Implementation map | `docs/HADDAD_CONTENT_INTEGRATION_MAP.md` | Actual v40.15 route-by-route implementation | Current |
| Primary-source candidate queue | `docs/HADDAD_PRIMARY_SOURCE_REVIEW_QUEUE.md` | Independent research candidates for reviewer follow-up | Internal queue only; not approval |

The PDFs are documentation sources and are not served from `public/`. No source-review page should be promoted merely because the narrative or PDF exists in the repository.

## v40.16 generated public resources

All files below are reproducible from `scripts/generate-v40-16-pdfs.py`. Exact bytes, page counts, and SHA-256 hashes are recorded in `docs/V40_16_GENERATED_ASSET_MANIFEST.csv`. They are review candidates until browser/download, editorial, accessibility, and owner approval are complete.

| Asset | Path | Purpose | Pages |
|---|---|---|---:|
| Exposure worksheet | `public/downloads/reduce-exposure-worksheet.pdf` | Blank printable companion to the device-local exposure worksheet | 2 |
| Seven-day reset | `public/downloads/sntp-7-day-challenge.pdf` | Printable Community action plan | 2 |
| Thirty-day practice | `public/downloads/sntp-30-day-challenge.pdf` | Printable Community learning/action plan | 5 |
| Cardiovascular press brief | `public/press-briefs/cardiovascular-system.pdf` | Verified/linked interview briefing | 1 |
| Pregnancy and early-life press brief | `public/press-briefs/pregnancy-early-life.pdf` | Partial-source interview briefing | 1 |
| Female reproductive press brief | `public/press-briefs/female-reproductive-health.pdf` | Partial-source interview briefing | 1 |
| Detection-methods press brief | `public/press-briefs/detection-methods.pdf` | Methods and contamination-control briefing | 1 |
| Particles vs endocrine chemicals | `public/press-briefs/particles-vs-endocrine-chemicals.pdf` | Evidence-boundary briefing | 1 |
| Exposure-reduction press brief | `public/press-briefs/reduce-exposure.pdf` | Practical progress-not-perfection briefing | 1 |


## v40.17 runtime anatomy references

The complete female exterior shell remains the local asset `public/models/anatomy/body-female.glb`. The extended-system viewers lazy-load the following Human Reference Atlas v1.2 GLB reference surfaces from the official HRA CDN, with the identical official GitHub release path as fallback:

- Kidneys/urinary: `VH_F_Kidney_L.glb`, `VH_F_Kidney_R.glb`, `VH_F_Ureter_L.glb`, `VH_F_Ureter_R.glb`, `VH_F_Urinary_Bladder.glb`
- Digestive: `VH_F_Small_Intestine.glb`, `SBU_F_Intestine_Large.glb`, `VH_F_Liver.glb`, `VH_F_Pancreas.glb`
- Endocrine/metabolic: `VH_F_Pancreas.glb`, `VH_F_Thymus.glb`, `VH_F_Ovary_L.glb`, `VH_F_Ovary_R.glb`
- Skin: local complete exterior shell only

The remote files are not embedded in the ZIP. Exact endpoints, license, attribution, and runtime modification notes are recorded in `public/models/anatomy/LICENSES.txt` and `docs/V40_17_INTERACTIVE_ANATOMY.md`.

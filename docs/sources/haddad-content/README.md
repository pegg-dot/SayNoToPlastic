# Dr. Haddad supplied-content source register

**Received:** 2026-08-08  
**Purpose:** preserve the exact ten PDFs used for the v40.15 content integration and distinguish supplied narrative from independently verified study records.

These files are authoritative for Dr. Haddad’s requested wording, organization, and emphasis. They did not arrive with a complete bibliography. The implementation therefore uses visible `verified`, `partial`, and `source-review` states rather than silently treating every sentence as independently proven.

| Original upload | Preserved PDF | Pages | Bytes | SHA-256 | Canonical route | Source state | Implementation note |
|---|---:|---:|---:|---|---|---|---|
| `Reduce exposure.pdf` | `pdf/reduce-exposure.pdf` | 3 | 69,191 | `9de326ca0db3b436c3346036cebfe378f4602d1656cae6d75b66a29a947d4efa` | `/solutions/reduce-exposure` | implemented | Practical recommendations preserve the supplied no-perfection framing and route into existing guides/planner. |
| `Female reproductive.pdf` | `pdf/female-reproductive-health.pdf` | 2 | 66,976 | `740d0e051966ef5e48536b1176908e5e1cb59d8321532db5157508b17a6b9f76` | `/science/body/female-reproductive-health` | partial source record | Verified follicular-fluid study linked; additional uterine/fibroid/endometriosis claims remain source-gated. |
| `Endocrine.pdf` | `pdf/endocrine-metabolic-system.pdf` | 2 | 68,229 | `490af6eeb0d52ca0544806fd7e18b0483e377f8f1133e07ebe1bab38d3e58473` | `/science/body/endocrine-metabolic-system` | source review | Narrative implemented with particles-versus-chemicals distinction; primary bibliography still required. |
| `Kidneys.pdf` | `pdf/kidneys-urinary-system.pdf` | 2 | 64,972 | `34fbe95c4d6a056a0188f7e7a53319db5a0f8f41f5cdfb5032e262dd7862af43` | `/science/body/kidneys-urinary-system` | source review | Narrative implemented; human kidney-tissue bibliography still required for production signoff. |
| `Skin.pdf` | `pdf/skin.pdf` | 2 | 63,007 | `2b65f4f607d226370019ebb3d809b92605497cc7aa29cad138e57e50c24c65c1` | `/science/body/skin` | source review | Barrier framing implemented; primary bibliography still required. |
| `Detecting microplastics.pdf` | `pdf/detecting-microplastics.pdf` | 3 | 68,920 | `0b3c9f92d0192f8fe1f8fc31f7babe43543f678914f69856796d64f71c5e1bc5` | `/science/how-detection-works` | implemented with method boundary | Methods primer cross-links to the existing verified study ledger. |
| `GI system.pdf` | `pdf/digestive-system.pdf` | 2 | 66,084 | `df12a219347038f45b3e7b4549cb4f4cc62abc915dabff6814d89b2e6e6c6fa5` | `/science/body/digestive-system` | source review | Narrative implemented; stool/barrier/microbiome bibliography still required. |
| `Exposome diagram.pdf` | `pdf/exposome-diagram.pdf` | 1 | 61,342 | `17d19336ff15cf5e102d430589f2a4239cd32872853dc95949c8633862793aa5` | `/science/exposome` | implemented as framework | Interactive map preserves Air, Water, Food, Products, Lifestyle, body response, and lifetime-health framing. |
| `The first 1000 days.pdf` | `pdf/pregnancy-placenta-early-life.pdf` | 3 | 71,796 | `5916a5f7eb42e34056f3c6a278d7a9ed8f0e3d659e00c15b6af04758b61784d4` | `/science/body/pregnancy-early-life` | partial source record | Verified placenta study linked; cord blood/amniotic fluid/meconium/breast milk/fetal-tissue claims remain source-gated. |
| `The heart.pdf` | `pdf/cardiovascular-system.pdf` | 3 | 77,821 | `48b091139f2b75847dda9580409b9b619b67ab83cc1f97cb040b2a8f8e9b3654` | `/science/body/cardiovascular-system` | verified study record | Both existing cardiovascular studies remain separate and linked. |

## Layered reuse rule

Each subject has one canonical long-form home. Other placements use only a teaser, short anatomy/science summary, action cross-link, or media/community excerpt. Full PDF prose is not duplicated across routes.

## Publication boundary

- `verified`: central human-study claims already point to reviewed primary papers in the existing evidence ledger.
- `partial`: at least one central claim is linked, while additional supplied claims remain source-gated.
- `source review`: the supplied narrative is implemented locally and clearly labeled, but primary papers must be attached before production signoff.

Text extracts under `text/` are generated from the exact PDFs for diffing and audit convenience. The PDFs remain the authoritative supplied artifacts.

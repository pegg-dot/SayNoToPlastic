# Source manifest

These files are preserved as audit/reference inputs. They do not automatically override later explicit decisions.

| Source | Path | Role |
|---|---|---|
| Raw written meeting transcript | `RAW_MEETING_TRANSCRIPT.txt` | Primary record of Dr. Haddad’s spoken review and requested corrections |
| Meeting audio | `audio/Dr-Haddad-website-review-recording.m4a` | Original recording supplied by the user; not independently transcribed in v38 |
| Master Delivery Register | `MASTER_DELIVERY_REGISTER.md` | Structured requirements and acceptance checks derived from transcript and later decisions |
| Designer setup blueprint | `blueprints/SayNoToPlastic_Master_Blueprint_Chapter_1_Designer_Setup.docx` | Design tokens, components, accessibility, SEO, and responsive baseline |
| Landing-page blueprint | `blueprints/SayNoToPlastic_Master_Blueprint_Chapter_2_Landing_Page_Build.docx` | Earlier landing-page construction plan; superseded where the transcript/later decisions conflict, including homepage TEDx placement |
| Quick Action Card image | `images/quick-action-card-page-121.png` | Exact authored card source |
| Official book render | `images/homo-plasticus-official-book-render.png` | Book-cover and collaborator-credit reference |

## Integrity hashes

```text
3c5e57fb30f41de6493b4689e9e89afef8ad8cd8afedc568bc17e95beca0fd9b  docs/sources/RAW_MEETING_TRANSCRIPT.txt
2ca2e0327d6506f699d220adcc1cf199210fa7087e3c8689077e80bd1508e52d  docs/sources/audio/Dr-Haddad-website-review-recording.m4a
3fa64e77be5ebaddcc3cf42f8714af694a330aca2a08475a7c4200cefa137df3  docs/sources/MASTER_DELIVERY_REGISTER.md
e7a4dda32ca606da5453bdd22bf1b96cf7f960ce2c51db941f73c8db6133cd38  docs/sources/blueprints/SayNoToPlastic_Master_Blueprint_Chapter_1_Designer_Setup.docx
6cf971878b835fdf555cf4f3c5abee4b8d852d1e2ee53a5164545dd976ba76f1  docs/sources/blueprints/SayNoToPlastic_Master_Blueprint_Chapter_2_Landing_Page_Build.docx
b55a820ab93de2bcdae2065032973d0ae4f4e8b1f07acf77ef90a57b124cebdc  docs/sources/images/quick-action-card-page-121.png
0c0115774b26a39cb9999689c1e2f3054324ae03dbcf980cc9c5573e5cd08de3  docs/sources/images/homo-plasticus-official-book-render.png
9de326ca0db3b436c3346036cebfe378f4602d1656cae6d75b66a29a947d4efa  docs/sources/haddad-content/pdf/reduce-exposure.pdf
740d0e051966ef5e48536b1176908e5e1cb59d8321532db5157508b17a6b9f76  docs/sources/haddad-content/pdf/female-reproductive-health.pdf
490af6eeb0d52ca0544806fd7e18b0483e377f8f1133e07ebe1bab38d3e58473  docs/sources/haddad-content/pdf/endocrine-metabolic-system.pdf
34fbe95c4d6a056a0188f7e7a53319db5a0f8f41f5cdfb5032e262dd7862af43  docs/sources/haddad-content/pdf/kidneys-urinary-system.pdf
2b65f4f607d226370019ebb3d809b92605497cc7aa29cad138e57e50c24c65c1  docs/sources/haddad-content/pdf/skin.pdf
0b3c9f92d0192f8fe1f8fc31f7babe43543f678914f69856796d64f71c5e1bc5  docs/sources/haddad-content/pdf/detecting-microplastics.pdf
df12a219347038f45b3e7b4549cb4f4cc62abc915dabff6814d89b2e6e6c6fa5  docs/sources/haddad-content/pdf/digestive-system.pdf
17d19336ff15cf5e102d430589f2a4239cd32872853dc95949c8633862793aa5  docs/sources/haddad-content/pdf/exposome-diagram.pdf
5916a5f7eb42e34056f3c6a278d7a9ed8f0e3d659e00c15b6af04758b61784d4  docs/sources/haddad-content/pdf/pregnancy-placenta-early-life.pdf
48b091139f2b75847dda9580409b9b619b67ab83cc1f97cb040b2a8f8e9b3654  docs/sources/haddad-content/pdf/cardiovascular-system.pdf
```


## Dr. Haddad supplied content set — v40.15

Ten short-form editorial PDFs supplied on 2026-08-08 are preserved under `docs/sources/haddad-content/`. They are the wording/structure basis for the new body-system, detection, exposome, and exposure-reduction experiences. See `docs/sources/haddad-content/README.md` for route mapping and source-review state.

## External supplied welcome-film master (not bundled)

The current welcome-film master was supplied on 2026-08-08 as `D93F9F07-B2C5-4261-968C-A0F9676B3B5B.mp4` (248,469,754 bytes; SHA-256 `08080a26a095c897dd7766efbc82ff493c97816b76212622ba1c96500f91fedb`). To avoid adding ~248 MB to every portable source handoff, the master is not duplicated under `docs/sources/`; v40.9 ships a web H.264/AAC derivative and records complete provenance in `app/content/welcome-film-metadata.json` and `docs/WELCOME_FILM_INTEGRATION.md`.

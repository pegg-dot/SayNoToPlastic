# v40.60 Spanish Homepage Parity

## Root cause

The production Spanish homepage contained many of the expected sections in its server-rendered DOM, but the reveal observer that adds `is-visible` to `[data-reveal]` content lived inside the English-only `BodyJourney` component. Because the old `/es` page omitted `BodyJourney`, its exposure cards, action copy, book feature, About, Podcast, TEDx, newsletter, and other reveal-controlled content could remain permanently at `opacity: 0`.

The old Spanish homepage also intentionally substituted a small Science bridge for the English ten-stage anatomy/evidence journey, so anatomy was genuinely absent rather than merely hidden.

A second localization leak existed inside the complete anatomy atlas: `AnatomyAtlasEvidenceSync` rewrote the React-rendered evidence panel after mount using hard-coded English headings, evidence data, and routes. That created a mixed-language modal even after the viewer itself was translated.

## Fix

v40.60 makes Spanish Home a first-class variant of the main Home architecture:

- `HomeRevealObserver` owns reveal behavior independently of any page section and uses a `MutationObserver` to register late-mounted client content after hydration.
- English and Spanish Home both mount that observer.
- Spanish Home renders `BodyJourney locale="es"` instead of a reduced Science bridge.
- `homepageJourneyEs` provides 10 anatomy/evidence chapters in Spanish while preserving evidence boundaries and the existing primary-study links where available.
- Spanish Home retains its six exposure cards, three action cards, book feature, About, Podcast, TEDx, newsletter, and media handoff.
- `AnatomySystemViewer` carries locale explicitly and localizes the complete atlas, system viewers, controls, fallbacks, evidence boundaries, and Spanish Science/body-system routes.
- `AnatomyAtlasEvidenceSync` now reads a stable `data-anatomy-group` ID rather than English button text and selects English or Spanish evidence data/routes based on the viewer locale.

## Rendered proof before release

The built Cloudflare artifact was exercised in a fresh Chrome profile, not only source-audited.

At **1440px, 390px, and 320px**, direct `/es` rendering confirmed:

- 10 anatomy/evidence chapters
- 6 exposure cards
- 3 action cards
- the book feature
- About
- Podcast
- TEDx
- newsletter / Field Notes signup
- Events & Media handoff
- no horizontal page overflow
- each reveal-controlled representative section reached `opacity: 1` after entering the viewport

The Spanish anatomy modal was opened at all three widths and confirmed:

- `Atlas anatómico de referencia`
- `Referencia 3D interactiva`
- `Hallazgo` / `Pregunta abierta`
- `Capas del cuerpo`
- Spanish close label
- Spanish Science destination `/es/ciencia`

The actual **EN→ES** language-switch control was clicked from `/`; the browser landed on `/es` with all 10 anatomy chapters, the book feature, and all six exposure cards present.

A deeper atlas regression switched the active complete-atlas system to **Cerebro** in both languages. English preserved `What the evidence says`, `Study snapshot`, and `/science#brain`; Spanish preserved `Lo que dice la evidencia`, `Resumen del estudio`, and `/es/ciencia#brain`.

The dedicated book flow was also verified: `/homo-plasticus` exposes `/es/homo-plasticus` through the language switch, and the Spanish destination renders Spanish book content.

Local-only manifest CORS warnings are expected because the QA origin is `http://localhost:8787` while the app intentionally advertises the canonical production manifest at `https://saynotoplastic.com/manifest.webmanifest`. Those warnings do not occur on the real production origin and are not Spanish-parity failures.

## Release requirement

Before deployment, this patch must still pass the production dependency audit, the complete historical release audit, the v40.57 mobile gate, v40.59 quality gate, this v40.60 parity gate, a fresh build, and the full route/mobile regression. After guarded deployment, the direct `/es` and real EN→ES switch checks must be repeated on the production domain.

## Final pre-merge regression

The parity patch was then run through the shared site regression, not only Spanish-specific checks:

- production dependency audit: **0 vulnerabilities**
- v40.57 mobile source gate: **20/20**
- v40.60 Spanish-home gate: **27/27**
- complete historical `release:audit`: **0 failures**
- source audit: **33/33**
- internal link audit: **293 references, 0 broken**
- syntax audit: **174 files, 0 failures**
- UI readiness: **12/12**
- clarity audit: **28/28**
- 56 indexable routes × 430/375/320: **168/168 passed, 0 flagged**
- 8 direct-access/noindex science routes × 430/375/320: **24/24 passed, 0 flagged**
- total shared phone regression: **192/192 passed**
- short-height anatomy layouts at 844×390 and 667×375: passed

The Spanish complete atlas additionally loaded ten Human Reference Atlas GLB surfaces from `cdn.humanatlas.io`; every request returned HTTP 200 `model/gltf-binary` and the enforced CSP produced zero violations. The only browser errors in localhost QA were the expected canonical-manifest CORS warnings caused by testing `http://localhost:8787` against the production manifest URL.

Visual screenshots at 390px and 320px were inspected after the automated checks. The anatomy journey and localized atlas are present and readable; the first-visit privacy sheet can cover part of the journey until the visitor makes the normal consent choice, but the underlying Spanish content is rendered rather than hidden.

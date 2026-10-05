# Current State — Say No to Plastic

**Authority date:** October 5, 2026
**Current source line:** v40.60.1 Spanish homepage mobile closure
**Production domain:** https://saynotoplastic.com
**Production Worker:** `say-no-to-plastic`
**Production D1:** `DB -> saynotoplastic-db`

This file is the current operational snapshot. Older audits, blueprints, and decision records remain useful for provenance, but later explicit client decisions and the current validated implementation take precedence when they conflict. The live deployment revision is always authoritative at `/api/version`.

## Product state

Say No to Plastic is a public educational site about microplastics, human exposure, evidence boundaries, and practical exposure reduction. It includes:

- English and Spanish public experiences;
- a ten-stage human-evidence journey and interactive anatomy atlas;
- deeper Science, detection, exposome, and body-system reading paths;
- practical Solutions, the 12-step guide, and evidence-first Field Guides;
- the *Homo Plasticus* ebook experience;
- Beyond Plastic podcast, TEDx, Events & Media, press resources, and Contact;
- consent-aware analytics, newsletter/community forms, legal/editorial pages, and owner tooling;
- a protected owner workspace with Today, Website/Page Studio, Field Notes, Media, and structured Science management.

## Current information-architecture authority

The later v40.36 Dr. Haddad client request supersedes the older v33/v34 TEDx placement rule only where they conflict:

- a **compact TEDx feature on Home** is current and intentional;
- `/tedx` and `/es/tedx` are current dedicated public routes;
- Podcast and TEDx are current primary-navigation destinations;
- `/media` remains the broader Events & Media / press hub;
- do not reintroduce the older large TEDx-heavy homepage blueprint.

The current public TEDx video is an authorized **temporary audience recording**, not the official TEDx release. Public playback surfaces must label it temporary and replace it when the official public release becomes available.

## Science publication boundary

Body-system pages carry a review status. Pages still marked `source-review` remain accessible to direct visitors but intentionally use `noindex` and are excluded from the sitemap/RSS. Verified or partial-review pages can remain discoverable according to their existing metadata.

Do not convert detection/association into diagnosis or causation. Primary sources, study limits, and uncertainty remain required publication boundaries.

## Production infrastructure

Preserve these identities unless an explicitly approved infrastructure migration says otherwise:

- Worker: `say-no-to-plastic`
- D1 database: `saynotoplastic-db`
- D1 binding: `DB`
- canonical origin: `https://saynotoplastic.com`
- production commerce mode: `woocommerce`
- audience provider: `mailchimp`
- Cloudflare Access protection for owner/admin surfaces
- existing version history and rollback capability

Do not create a replacement Worker/Site/database just to simplify deployment.

## Current quality/security baseline

The release path must preserve:

- `npm audit --omit=dev --audit-level=low` with **0 production vulnerabilities**;
- the full historical `release:audit` stack;
- v40.57 mobile audit;
- v40.58 dependency-hardening audit;
- v40.59 quality-hardening audit;
- v40.60 Spanish-home parity audit;
- clean lint, syntax, UI, source, links, and content-preflight gates;
- a fresh Cloudflare/Vinext production artifact from the exact merged `main` revision;
- the guarded production deploy command only.

The current Vinext compatibility boundary is intentional: Vinext 1.0.1 was tested and rejected because it produced HTTP 500 regressions on previously healthy routes. Keep the validated compatible line until an upstream version passes the full rendered route regression.

## v40.59 measured browser baseline

The v40.59 quality pass includes:

- CSP tested against public routes, YouTube privacy embeds, WebGL/reduced-motion fallbacks, and owner Page Studio same-origin previews;
- exact responsive matrix across desktop/tablet/mobile classes;
- separate QA for deliberately noindexed source-review body pages;
- keyboard focus trapping and Escape/focus return for mobile navigation and Welcome;
- 200% reflow surrogate checks;
- active-only anatomy fallback rendering;
- optimized maternal-fetal and wordmark WebP derivatives;
- responsive Unsplash exposure photography;
- Lighthouse representative accessibility and SEO scores at 100 after the measured contrast/search fixes.

See `docs/QUALITY_HARDENING_V40_59.md` for detailed evidence.

## v40.60 Spanish homepage parity

The Spanish homepage is a first-class variant of the main homepage rather than a reduced bridge page. `/es` now includes the same ten-stage anatomy/evidence journey, exposure cards, action cards, book feature, About, Podcast, TEDx, newsletter, and media handoff as the English Home architecture, with Spanish evidence copy and Spanish science/body-system routes where localized routes exist.

Homepage reveal behavior is owned by a shared mutation-aware observer rather than by the English anatomy component, so late-mounted localized sections cannot remain permanently transparent after hydration. The anatomy atlas and its evidence-sync layer both carry locale explicitly; changing atlas systems in Spanish keeps headings, study snapshots, sources, evidence links, and routes in Spanish.

The dedicated book language switch is also verified: `/homo-plasticus` switches to `/es/homo-plasticus`, which renders Spanish book content.

See `docs/SPANISH_HOME_PARITY_V40_60.md` for the root cause and rendered proof.

## Owner/provider/clinical acceptance still external

These are not hidden engineering defects and must not be invented or silently marked complete:

- official TEDx replacement video/date/rights when it becomes available;
- final clinical/anatomy approval where Dr. Haddad wants qualified review;
- unresolved biography/education provenance that requires written owner confirmation;
- final press/photography reuse rights where still pending;
- any real purchase, newsletter, campaign-send, or provider acceptance test that would create real-world records or messages and therefore requires owner authorization.

Engineering should keep the site safe and transparent until those inputs arrive rather than fabricating completion.

## Deployment truth

Only deploy from current, clean, merged `main` using:

```text
npm run db:migrate:production
npm run deploy:production
```

After deployment, verify `/api/version`, apex/www canonicalization, English/Spanish routes, protected admin behavior, and the live responsive/interaction smoke suite.

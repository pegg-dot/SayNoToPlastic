# v40.13 change manifest — Microplastic wordmark

Changed:
- `public/brand/sntp-wordmark-microplastic.png` — cropped transparent runtime asset from the exact user-approved wordmark.
- `public/brand/sntp-wordmark-microplastic-nav.png` — smaller derivative of the same approved artwork for navigation rendering.
- `app/components/SiteChrome.tsx` — shared header/footer wordmark now renders the approved image asset; decorative footer movement mark follows the same identity.
- `app/globals.css` — responsive wordmark sizing and removal of legacy text-lockup decoration.
- `scripts/homepage-polish-audit.mjs` — protects the approved image wordmark rather than the superseded two-part text lockup.
- `app/build-version.ts` — v40.13 build identifier.
- `ASSET_INVENTORY.md` — records the approved runtime wordmark and provenance boundary.
- `docs/V40_13_MICROPLASTIC_WORDMARK.md` and `docs/reviews/v40.13-wordmark/*` — implementation and review provenance.
- `VALIDATION_REPORT_V40_13.md` — portable regression results and remaining rendered proof.
- current-state / handoff / README release heading — advanced to v40.13.

Unchanged:
- editorial/prose uses of the Say No to Plastic name, metadata, legal copy, and accessibility names;
- navigation routes and interactions;
- v40.12 short-footer layout;
- v40.10 one-viewport welcome modal and media assets;
- package lock and dependencies;
- commerce settings;
- production Sites v30.

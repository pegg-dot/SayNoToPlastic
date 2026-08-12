# v38 change manifest

## Baseline

Compared against `Homo-Plasticus-Say-No-to-Plastic-v37.2-transcript-audited.zip`.

The comparison found 68 path-level differences, including documentation/source-set additions. `package-lock.json` is byte-identical to the baseline.

## Application changes

### Transcript-priority action system

- `app/content/actions.ts`
- `app/quick-action-card/page.tsx`
- `app/components/ActionPlanner.tsx`
- `app/solutions/page.tsx`
- `app/page.tsx`
- `app/content/guides.ts`
- `app/globals.css`

### Anatomy review candidates

- `app/components/AnatomyScene.tsx`
- `public/images/anatomy/ovary-labeled.svg`
- `public/images/anatomy/testis-labeled.png`
- `scripts/render-reproductive-fallbacks.py`

### Identity, biography, book, and media

- `app/config.ts`
- `app/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `public/llms.txt`
- `app/build-version.ts`
- `app/about-dr-elie-haddad/page.tsx`
- `app/content/owner-facts.ts`
- `app/content/media-items.json`
- `app/content/media-content.ts`
- `app/media/page.tsx`
- `app/components/FeatureVideo.tsx`
- removed `app/components/TedxVideo.tsx`
- `app/homo-plasticus/page.tsx`
- `app/community/page.tsx`
- `app/components/SiteChrome.tsx`

### Audience-provider boundary and operations

- `app/lib/audience-service.ts`
- `app/lib/email-outbox.ts`
- `app/lib/email-service.ts`
- `app/api/internal/readiness/route.ts`
- `app/lib/commerce.ts`
- `app/purchase/success/page.tsx`
- `.env.example`
- `scripts/audience-preflight.mjs`
- `scripts/audience-adapter-test.mjs`
- `scripts/operations-audit.mjs`

### Affiliate and publication boundaries

- `app/content/affiliate-products.json`
- `scripts/media-preflight.mjs`
- `package.json`

## Verification changes

- `scripts/clarity-audit.mjs`
- `scripts/source-audit.mjs`
- `scripts/ui-readiness-audit.mjs`
- `scripts/transcript-priority-audit.mjs`
- `scripts/link-audit.mjs`
- `tests/rendered-html.test.mjs`

## Portable source additions

- Raw meeting audio
- Both blueprint chapters
- Hashed source manifest
- v38 correction, audience, validation, handoff, roadmap, QA, and owner-action records

## Connected Sites caveat

The exact post-import five-file validation diff made inside the connected v37 Sites candidate was described by the builder but was never exported into the v37.2 portable baseline. v38 therefore does not claim byte-for-byte incorporation of that unpublished builder-only diff.

This is not hidden or treated as harmless. The v38 Sites import must run the full authentic build/test gate. If any of the same validation issues reappear, the builder must report and export the exact source diff before those changes become part of the next portable package.

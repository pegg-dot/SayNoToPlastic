# v40.59 Quality Hardening

## Why this release exists

v40.58 was production-safe and passed the full release, mobile, security, and rendered-route gates. A final adversarial closure review went beyond those gates rather than treating deployment as the finish line. It crawled the live site, inspected browser runtime errors and subresources, ran Lighthouse on representative routes, reviewed security headers, and reconciled older project blocker records with the current production state.

This pass is intentionally narrow. It does not redesign pages or rewrite Dr. Haddad's scientific content. It closes measurable engineering quality gaps in accessibility, search signaling, browser security, and fallback asset delivery.

## Live baseline measured before v40.59

The production crawl found:

- 64 sitemap URLs
- 122 same-origin links checked
- 0 broken internal links
- 0 sitemap pages missing the required title, description, canonical, language, or single-H1 contract
- 18 representative routes rendered in Chrome with 0 console exceptions, 0 failed network requests, 0 4xx/5xx subresources, and 0 desktop overflow
- the previously completed phone matrix remained 64 routes × 3 phone widths = 192 checks, 0 flagged

Representative mobile Lighthouse scores before this patch were:

| Route | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home | 84 | 100 | 100 | 100 |
| Science | 91 | 97 | 100 | 100 |
| Body-system example | 98 | 96 | 100 | 66 |
| Field-guide example | 98 | 96 | 100 | 100 |
| Spanish Home | 96 | 97 | 100 | 100 |

The body-system SEO score reflected an intentional `noindex` review boundary being contradicted by sitemap inclusion. Accessibility failures were measured color-contrast failures, not inferred from source.

## Changes

### Accessibility contrast

The release darkens small science labels, body-system section/source indexes, practical-action numbers, and footer legal/copyright text to measured WCAG-safe values. The footer legal row returns to readable 14px text with 48px controls. The field-guide hero remains visually ivory but now explicitly uses dark supporting copy rather than inheriting white text from the legacy dark-hero layer.

### Search and publication signaling

Body-system pages with `reviewStatus: "source-review"` already emit `noindex, follow`. They are now excluded from the XML sitemap and RSS feed so the site no longer sends contradictory crawl signals. Verified and partial-review pages keep their existing index behavior. The core sitemap and feed build dates are advanced to the current release date.

### Fallback performance

The no-WebGL / reduced-motion anatomy fallback previously mounted every fallback image at once. Under Lighthouse's no-WebGL environment that included a 1.2MB maternal-fetal PNG even when another scene was active. v40.59 mounts only the active fallback scene. The maternal-fetal browser fallback is a visually checked WebP of about 22KB, while the original PNG remains in the repository. Browser wordmarks also use right-sized WebP derivatives (640px navigation and 720px footer) while Mailchimp email HTML deliberately retains the PNG for email-client compatibility. Exposure-route photography now uses 640/960/1400px Unsplash `srcset` candidates at quality 74 instead of forcing every phone to download the 1400px/q82 source.

### Content Security Policy

The Worker now adds an enforced Content Security Policy on top of the existing HSTS, `nosniff`, referrer, frame, opener, and permissions policies. The policy defaults to same-origin, blocks plugins, constrains framing and form destinations, allows the application's inline framework bootstrap, permits Meshopt/WASM used by the 3D anatomy stack, allows Cloudflare Insights, and restricts browser network connections to same-origin plus the two tested Human Reference Atlas model hosts (`cdn.humanatlas.io` and `raw.githubusercontent.com`). External HTTPS images remain allowed because current exposure-route artwork includes Unsplash-hosted imagery; video frames are limited to the current YouTube/Spotify hosts.

This policy is accepted only if the final local/browser regression shows no CSP violations and all public/admin-preview/media/anatomy behavior continues to function. If it causes a runtime regression it must be removed or narrowed before merge rather than deployed because the header exists in source.

## Owner/provider boundary

The engineering release can prove code, browser behavior, routing, deployment state, security controls, accessibility mechanics, and the current evidence/publication boundaries. It cannot manufacture owner or clinical approval. Older project records contain some stale provider blockers that have since been resolved, but the following remain conceptually outside an engineering claim of completion when applicable:

- Dr. Haddad's final clinical/anatomy approval of representations that require expert judgment
- final rights/approval for owner-supplied photography or future official media assets
- biography/education details whose authoritative source still requires Dr. Haddad's confirmation
- a real paid commerce transaction or real subscriber/contact message when the owner has not authorized production test data
- future replacement of temporary media when an official asset is supplied

Those are acceptance or content-owner actions, not hidden code defects. v40.59 does not fill them with guesses or fake production records.

## Required release proof

Before merge/deployment this exact release must pass:

```text
npm run security:audit:production
npm run audit:mobile
npm run release:audit
npm run build
```

It must then pass the complete phone proof: 168 checks across the 56 indexable sitemap routes plus 24 checks across the eight direct-access/noindex source-review body pages, for 192 phone checks total. It must also pass representative desktop routes, reduced-motion and no-WebGL anatomy fallbacks, 200% reflow, keyboard/overlay behavior, browser-console/network inspection, CSP validation, malformed-request rejection, and a fresh representative Lighthouse rerun. Production must still report the exact merged Git revision after guarded deployment.

## Final pre-merge browser proof

The final v40.59 source was exercised as a built Cloudflare Worker, not only inspected statically.

### Responsive and accessibility matrix

- 16 representative public/owner-entry routes × 10 viewport classes = **160/160 checks passed** with no real page overflow or escaped content. The viewport set was 1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 375×667, 360px, and 320px.
- The filtered public sitemap contains 56 indexable routes after source-review/noindex science pages are removed from search discovery. Those sitemap routes passed the phone matrix with **168/168 checks** at 430, 375, and 320px.
- The eight English/Spanish source-review body-system URLs excluded from the sitemap were tested separately at the same phone widths: **24/24 checks passed**, with the pages still accessible and correctly carrying `noindex`. A direct sitemap/RSS consistency pass also confirmed all 56 sitemap URLs return 200 without `noindex`, all eight source-review URLs return 200 with `noindex`, none appears in the sitemap, and source-review English body pages are absent from RSS.
- A 200% desktop reflow surrogate on Home, Science, a Field Guide, About, and Spanish Home produced no horizontal overflow.
- Reduced-motion / no-WebGL testing showed a stable anatomy fallback with exactly one mounted fallback image and no marquee animation.
- Keyboard testing verified focus trapping and Escape/focus return for both mobile navigation and the Welcome dialog.

### CSP and interactive state proof

No Content Security Policy violations were observed in the tested application states. In particular:

- TEDx, Events & Media, and Spanish TEDx successfully created the `youtube-nocookie.com` iframe after an explicit play action and received HTTP 200.
- A temporary local AdminPanel QA harness rendered the real owner workspace at 390px and 320px under the enforced CSP. Page Studio, focused field editing, Phone preview, Today, Field Notes, and Media all rendered without horizontal overflow or undersized controls.
- At 320px, Today, Website, Field Notes, and Media remained simultaneously visible with 48px tab targets.
- The Page Studio same-origin preview iframe loaded the real Homepage DOM under CSP with zero framing violations.
- The reference anatomy atlas was opened under the narrowed CSP and requested ten remote Human Reference Atlas GLB models from `cdn.humanatlas.io`; all ten returned HTTP 200 as `model/gltf-binary`, with zero CSP violations.
- The temporary AdminPanel QA route was deleted before the release source was rebuilt and is never part of the committed/deployed application.

### Error-path and browser-runtime proof

The live v40.58 baseline had already produced zero browser exceptions, failed subresources, or unexpected 4xx/5xx resource responses across 18 representative production routes. The v40.59 local Worker additionally rejected non-destructive malformed/cross-origin requests before durable user/provider work on subscribe, contact, analytics events, checkout, and recovery endpoints. Privacy-preserving unsubscribe behavior intentionally returned the same public success response for a non-matching token. Protected internal/admin endpoints remained inaccessible without the required contract.

### Final representative Lighthouse rerun

The last v40.59 local-worker Lighthouse run after the contrast and image changes measured:

| Route | Performance | Accessibility | SEO | LCP | Estimated image-delivery savings |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 85 | 100 | 100 | 3.6s | 93 KiB |
| Science | 87 | 100 | 100 | 3.5s | 93 KiB |
| Verified body-system page | 91 | 100 | 100 | 2.9s | 90 KiB |
| Field guide | 92 | 100 | 100 | 2.8s | 68 KiB |
| Spanish Home | 86 | 100 | 100 | 3.5s | 351 KiB |

Local Best Practices measured 96 because the QA origin was `http://localhost:8787` while the application intentionally references its canonical production manifest at `https://saynotoplastic.com/manifest.webmanifest`; Chrome therefore reports a local cross-origin manifest CORS warning. The live v40.58 production baseline was 100 on Best Practices. v40.59 must be rechecked on the real same-origin production domain after deployment before final closure.

The Home image-delivery estimate improved from roughly **1.55 MiB** in the live baseline to about **93 KiB** after active-only fallback rendering and optimized browser assets. The largest remaining synthetic opportunities are not treated as release defects when fixing them would require a disproportionate architectural rewrite or materially alter approved imagery.

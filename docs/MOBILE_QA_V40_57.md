# v40.57 Sitewide Mobile QA

## Scope

v40.57 is the dedicated mobile hardening pass for the current Say No To Plastic application. It does not redesign the brand, alter scientific claims, weaken owner authentication, or change the production Worker, D1 database, commerce mode, or canonical origin.

The pass covers the public English and Spanish site, long-form Science and guide templates, forms and commerce surfaces, the full-screen anatomy atlas, global navigation and overlays, and the owner workspace responsive source.

## Portrait route matrix

The rendered public-site sweep used the 64 sitemap routes exposed by the application, including all core English routes, core Spanish routes, seven English body-system pages, seven Spanish body-system pages, and fourteen resource guides.

Widths tested:

- 430 px
- 375 px
- 320 px

That produced 192 portrait route-width checks. The final rebuilt artifact completed the refined sweep with 0 flagged layout, overflow, missing-heading, undersized-action, or mobile-input failures. The detector ignores deliberate clipped artwork and intentional horizontal scrollers while continuing to flag escaped content.

## Interactive states

The phone-state pass separately exercised UI that does not exist in the initial route render:

- mobile navigation at 390 px and 320 px
- Welcome film trigger and modal
- consent banner
- full-screen anatomy atlas
- anatomy system selection, body-layer controls, camera controls, zoom, provenance, and close
- owner sign-in and unauthenticated owner help surfaces

Primary navigation actions render at 48 px, secondary mobile navigation actions at 44 px, and the ebook action at 52 px. The floating Welcome control is suppressed while the mobile menu is open. The Welcome modal close control is 48 × 48 px. Anatomy atlas controls use a 44 px minimum touch floor and its close control is 48 × 48 px.

Public text-entry controls use a 16 px phone font where needed to avoid iOS focus zoom. The footer signup collapses to one column, uses 48 px fields, and gives consent a larger label and checkbox hit area.

## Short-height and landscape

Representative routes and the major overlay states were checked in phone-landscape viewports:

- 844 × 390
- 667 × 375

The mobile menu intentionally scrolls in these short viewports. The anatomy atlas switches to a side-by-side short-height layout so the stage remains fully inside the viewport and the evidence panel scrolls independently. Final measured stage sizes were 506 × 330 and 400 × 317 respectively.

## Owner workspace

The unauthenticated `/owner-login` and `/admin` entry surfaces were rendered at 390 px and 320 px with no horizontal overflow. The owner workspace source now uses 16 px phone form controls, 44–48 px interactive targets, horizontally scrollable primary tabs, stacked narrow-screen application chrome, mobile-safe Page Studio preview heights, and safe-area-aware publish/save bars.

The authenticated Page Studio was not bypassed for visual QA. Production owner access requires a signed Cloudflare Access JWT whose signature, issuer, audience, time claims, and allowlisted identity are validated by the application. v40.57 does not weaken or add a development bypass to that contract.

## Release evidence

Before release, run:

```text
npm run audit:mobile
npm run release:audit
npm run build
```

The production deployment path remains the existing guarded release workflow. Mobile QA does not authorize a production deployment by itself.

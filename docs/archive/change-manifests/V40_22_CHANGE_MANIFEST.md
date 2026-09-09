# v40.22 change manifest — anatomy navigation and Guides reading-room polish

Date: 2026-08-09

## Scope

v40.22 is a rendered-review correction on top of v40.21. It does not redesign the site, replace the ten-chapter anatomy journey, alter the Complete Body Atlas, change dependencies, or touch production.

## Changed

### Homepage anatomy

- Removed the four floating Endocrine, Kidneys, Skin, and Digestive pill buttons from the opening body image.
- Preserved all ten chapters in the primary chapter navigation below the anatomy.
- Recalibrated the shared brain transform so the surface remains inside the female exterior head in both the scroll scene and Complete Body Atlas.

### Science

- Removed the repeated compact Exposome bridge from `/science`.
- Preserved the complete Exposome experience at `/science/exposome`.
- Preserved cross-site Exposome links in the footer, practical-action pathway, body-system connections, About, Community, RSS, and sitemap.
- Preserved the detection primer, verified human-study ledger, and body-system library on the main Science page.

### Guides

- Changed the four “Choose a route” cards from a three-plus-one layout to a balanced two-by-two desktop grid.
- Preserved a one-column mobile layout.
- Refined the ivory reading-room field with a warmer paper gradient, shorter vertical gaps, more compact featured cards, and restrained hover surfaces.
- Preserved all fourteen guides, filters, search, categories, links, and editorial boundaries.

### Validation and records

- Added `scripts/v40-22-final-layout-audit.mjs` and registered it as `npm run layout:polish`.
- Updated inherited audits to recognize the superseding no-pin navigation and dedicated Exposome route.
- Advanced the build identifier to `hp-site-2026-08-09-v40.22-navigation-and-reading-room-polish`.

## Unchanged

- Ten-chapter anatomy order and scroll behavior.
- Complete Body Atlas controls, filters, and educational boundaries.
- Dr. Haddad content integration and evidence-state labels.
- Welcome film, wordmark, header, footer, commerce mode, audience architecture, generated PDFs, database migrations, package dependencies, and package lock.
- Production Sites v30, URL, hosting, storage, DNS, secrets, and rollback state.

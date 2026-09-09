# v40.25 Change Manifest — Reading Flow Polish

Date: 2026-08-10
Base: v40.24 content-architecture cleanup
Deployment state: local candidate only; nothing published or deployed

## Purpose

v40.25 is a focused reading-experience correction. It does not introduce a new site architecture. It keeps the existing v40.24 content system and removes the remaining dashboard/card-like presentation from long-form Science body-system pages and individual Guides, while shortening the Community practice section.

## User-facing changes

### Science body-system pages
- Replaced the awkward stacked "Jump to" presentation with a single compact horizontal "On this page" row.
- Kept every existing body-system section, known/uncertain boundary, source record, canonical route, and indexing gate.
- Kept the existing anatomical hero visual system.
- Mobile uses horizontal scrolling for the on-page navigation rather than stacking tiny labels vertically.

### Individual Guides
- Rebuilt Guides as conventional long-form reading pages rather than dashboard cards.
- Replaced paired evidence cards with continuous prose sections.
- Replaced the two-column action-card grid with one vertical numbered action list.
- Replaced the stacked "Jump to" block with one inline "In this guide" row.
- Reduced the science cross-link area to a compact optional bridge.
- Preserved expandable sources and the medical boundary.
- Changed Related Guides from large cards to compact text rows.
- Reduced hero and article spacing and capped the reading measure for more comfortable paragraph reading.

### Community
- Shortened the "From information to practice" section vertically.
- Reduced the headline to: "Learn one idea. Change one routine. Share it accurately."
- Tightened Read / Act / Share into compact rows while preserving the same practical intent and links.

## Preserved
- v40.24 content architecture and deduplication decisions
- all seven body-system narratives
- all 14 Guides and their sources/actions
- ten-chapter anatomy journey and complete atlas
- welcome film, footer, wordmark, commerce default, email/operations infrastructure
- package dependencies and package-lock.json
- production site identity and current published site

## Files materially changed
- `app/science/body/[slug]/page.tsx`
- `app/resources/[slug]/page.tsx`
- `app/community/page.tsx`
- `app/globals.css`
- `app/build-version.ts`
- `package.json` (audit script registration only)
- `scripts/guides-polish-audit.mjs`
- `scripts/haddad-content-integration-audit.mjs`
- `scripts/v40-16-completion-audit.mjs`
- `scripts/v40-17-anatomy-viewer-audit.mjs`
- `scripts/v40-18-homepage-final-audit.mjs`
- `scripts/v40-19-complete-atlas-audit.mjs`
- `scripts/v40-20-integrated-scroll-atlas-audit.mjs`
- `scripts/v40-21-layout-polish-audit.mjs`
- `scripts/v40-22-final-layout-audit.mjs`
- `scripts/v40-23-framing-density-audit.mjs`
- `scripts/v40-24-content-architecture-audit.mjs`
- `scripts/v40-25-reading-flow-audit.mjs`

Historical audits were updated only to recognize the later compatible v40.25 build and the intentional successor layouts; evidence and feature-preservation assertions remain in place.

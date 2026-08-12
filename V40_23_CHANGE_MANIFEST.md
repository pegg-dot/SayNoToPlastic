# v40.23 change manifest — framing and density polish

Date: 2026-08-10

## Scope

v40.23 is a small rendered-review correction built directly on v40.22. It preserves the current site, routes, body-system library, Exposome model, media briefing cards, anatomy, guides, commerce rails, content sources, and production rollback state.

## Changed

### Book

- Replaced the awkward “website carries the body-system depth beside the book” framing.
- Reframed the section as an optional science reading path behind the book’s central questions.
- Preserved the explicit statement that the links are not the book’s table of contents.
- Preserved all body-system and detection-method links.

### Dr. Haddad

- Reduced the dark Exposome section’s vertical padding, headline scale, paragraph measure, and column gap.
- Reorganized the compact Exposome interaction into a vertical category rail beside one focused content panel on desktop.
- Preserved horizontal touch scrolling and stacked content on small screens.
- Preserved the complete Exposome route, cardiovascular pathway, keyboard controls, and tab semantics.

### Events & Media

- Removed “Give every interview a precise starting point.”
- Replaced it with “Clear evidence for public conversations.”
- Shortened and tightened the introduction while preserving uncertainty, causation, topic links, and downloadable one-page PDFs.

### Validation

- Added `scripts/v40-23-framing-density-audit.mjs` as `npm run framing:polish`.
- Updated inherited version gates to recognize v40.23 as a compatible successor.
- Advanced the build identifier to `hp-site-2026-08-10-v40.23-framing-and-density-polish`.

## Unchanged

- Package dependencies and `package-lock.json`.
- Production Sites v30, URL, DNS, storage, secrets, and rollback state.
- Welcome film, microplastic wordmark, footer, anatomy journey, Complete Body Atlas, Science evidence ledger, fourteen guides, generated PDFs, learning-series architecture, and commerce mode.

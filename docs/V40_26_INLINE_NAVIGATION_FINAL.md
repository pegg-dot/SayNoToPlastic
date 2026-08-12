# v40.26 — Inline Navigation Final

## Purpose

This release is a surgical follow-up to v40.25. It keeps the long-form Science body-system and Guide reading layouts, but fixes the two inline article navigations that were still visually breaking in the browser.

## Root cause

The new `guide-inline-nav` introduced in v40.25 lived directly under `.guide-article`. An older base selector, `.guide-article > nav`, still applied desktop `position: sticky`, `top: 120px`, and `flex-direction: column`. The newer v40.25 rules changed the appearance but did not explicitly reset those legacy positioning and direction properties. As a result, the Guide navigation could follow the viewport and overlap article headings and paragraphs.

The body-system navigation was not sticky, but its full section titles could exceed the available line width and wrap `References` onto a second row.

## Final behavior

### Science body-system pages

The `On this page` navigation now uses concise labels:

- Overview
- Why it matters
- Research
- Meaning
- Known / uncertain
- References

The row is explicitly non-wrapping. If a viewport is too narrow, it scrolls horizontally instead of breaking into multiple lines.

### Guide pages

The `In this guide` navigation remains:

- Bottom line
- Evidence
- What to do
- Sources

v40.26 explicitly resets the legacy sticky selector with scoped `position: static`, `top: auto`, `flex-direction: row`, and `flex-wrap: nowrap`. The navigation appears once in normal document flow and no longer follows the reader down the article.

### Accessibility and responsive behavior

- Both navigations remain semantic `<nav>` elements with existing accessible labels.
- Links remain keyboard accessible.
- Horizontal overflow is available on small screens without wrapping or content overlap.
- Anchor destinations retain scroll margin for the fixed site header.
- No content, source links, Guide actions, body-system text, or routes were removed.

## Preservation

- Built directly on v40.25.
- No dependency changes.
- `package-lock.json` remains byte-identical to the approved baseline.
- No production deployment or publish action is part of this release.

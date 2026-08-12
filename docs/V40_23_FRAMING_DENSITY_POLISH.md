# v40.23 architecture record — framing and density polish

Date: 2026-08-10

## Purpose

This pass responds to three rendered-review concerns without changing the information architecture:

1. the Book page described the relationship between the website and the book in an awkward, self-referential way;
2. the Dr. Haddad Exposome section used too much space for the amount of information shown;
3. the Media briefing introduction sounded like internal interview-preparation language rather than public-facing editorial copy.

## Book relationship

The Book page now frames the linked body-system pages as a science reading path behind the book’s central questions. The section remains explicitly separate from the book’s table of contents, and it does not claim that the linked pages are literal chapters.

## Compact Exposome interaction

The About-page Exposome remains interactive and source-linked. On desktop, its five categories form a vertical rail beside one focused panel. This produces a denser, more balanced composition and reduces the empty horizontal band created by the previous five-tab row. At small widths, the categories return to a horizontally scrollable row above the panel so controls remain reachable.

The underlying WAI-ARIA tablist, tab, tabpanel, arrow-key, Home, and End behavior is unchanged.

## Media framing

The Media page now introduces the downloadable evidence briefings with public-facing language: “Clear evidence for public conversations.” The supporting copy continues to distinguish verified findings, supplied narrative, uncertainty, and causation.

## Boundaries

No content source, evidence status, route, briefing download, interactive-map behavior, provider setting, commerce mode, dependency, production resource, or deployment state changes in this pass.

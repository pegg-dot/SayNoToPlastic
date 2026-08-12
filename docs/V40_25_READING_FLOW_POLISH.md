# v40.25 Reading Flow Architecture

## Design rule

Long-form pages should read like articles, not dashboards.

The site still uses cards where cards help navigation and comparison. Once a visitor opens a body-system article or Field Guide, the page changes mode: narrower measure, conventional headings, paragraphs, simple lists, restrained navigation, and fewer competing boxes.

## Science body-system articles

The body-system template keeps the dark visual hero and anatomical reference. Below the hero, the prior stacked/segmented table of contents is replaced with one inline row. The article itself remains the canonical narrative source and continues to render the existing four sections, known/uncertain boundary, references, related science, practical guidance, and medical boundary.

Desktop: inline on-page navigation.
Mobile: horizontally scrollable navigation row.

## Field Guides

The v40.25 Field Guide reading order is:

1. Bottom line
2. What the evidence supports
3. What remains uncertain
4. What you can do now
5. Optional deeper science
6. Sources and further reading
7. General-education boundary
8. Compact related-guide links

Evidence statements are rendered as ordinary paragraphs. Practical steps use a single vertical numbered list. Sources remain collapsed by default so they are accessible without interrupting the main reading flow.

The maximum reading column is 760px to keep line length comfortable on large displays.

## Community practice section

The section is intentionally a short bridge, not a second curriculum. It keeps three actions—Read, Act, Share—and two routes: practical change and Science. The section's desktop padding and headline size are reduced so it no longer consumes nearly a full viewport.

## Accessibility

- Navigation remains semantic `nav` with descriptive labels.
- Hash targets remain intact.
- Mobile navigation can scroll horizontally rather than shrinking text excessively.
- Source disclosure remains native `details/summary`.
- Link and focus behavior remain inherited from the existing site system.

## Boundary

v40.25 changes presentation and a small amount of public framing only. It does not change the underlying scientific records, guide source arrays, review gates, anatomy data, commerce configuration, or provider architecture.

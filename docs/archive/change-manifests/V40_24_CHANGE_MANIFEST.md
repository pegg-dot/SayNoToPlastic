# v40.24 Change Manifest

Base: v40.23 framing-density polish.

## Reader-facing changes

- Reworked every `/science/body/[slug]` page into a denser canonical article layout.
- Removed reader-facing evidence-status/review-workflow banners from body-system pages, cards, and anatomy viewers while keeping editorial review state in the content model.
- Replaced CSS-only body-system hero diagrams with consistent anatomical reference plates built from existing approved site imagery.
- Removed the repeated related-body-system card library from the bottom of every body-system page.
- Rebuilt individual Guides around bottom line -> evidence boundary -> actions -> small optional science bridge -> collapsible sources.
- Removed repeated book CTAs from individual Guides.
- Removed the featured-guide layer from the Guides library so visitors reach the searchable 14-guide library directly.
- Removed the public Community ten-reading curriculum and ten-part email-course section while preserving the challenge tools.
- Replaced the Book's repeated body-system summary grid with one compact three-link Science bridge.
- Removed the generic cross-site pathway grid from Events & Media.
- Removed the duplicated evidence-briefing list from Events & Media; downloadable topic briefs now live only in the canonical Press Kit.
- Removed public source-review status badges from the Press Kit briefing rows.
- Shortened Science body-system cards and removed public editorial-status labels.
- Neutralized source-card metadata that previously exposed "Primary-source review in progress" to readers.

## Preserved

- v40.23 visual identity and navigation;
- all canonical body-system content and source links;
- source-review/noindex publication safeguards;
- all 14 Guides and their action/source records;
- Community challenges;
- learning-series backend, database migration, and operations code for rollback/future reuse;
- anatomy journey and Complete Body Atlas;
- commerce and purchase flows;
- welcome film;
- package dependencies and `package-lock.json`;
- current production deployment remains untouched.

# v40.24 Content Architecture Cleanup

## Goal

Tighten the existing v40.23 site without redesigning it. The release gives each major section a clearer job so the same body-system summaries are not repeated across Science, Guides, Book, Media, Dr. Haddad, and Community.

## Canonical-content hierarchy

- **Science** owns detailed human-study and body-system explanations.
- **Guides** own practical questions and direct actions.
- **Solutions** owns prioritization and exposure-reduction planning.
- **The Book** explains the book and provides a small bridge to Science instead of repeating the Science library.
- **Events & Media** owns talks, appearances, inquiries, and a route to the Press Kit.
- **Press Kit** is the single public home for downloadable media evidence briefings.
- **Dr. Haddad** owns biography, clinical perspective, and the Exposome framing.
- **Community** owns participation, challenges, practice, and project updates rather than a second reading curriculum.

## Body-system pages

The large public "Evidence status" banner and review-workflow labels are removed. Editorial review state still controls indexing and remains in the content model, but the reader sees a cleaner article:

1. compact hero;
2. anatomical reference plate using existing site imagery;
3. short jump navigation;
4. canonical narrative sections;
5. paired "What we know / What we do not know yet" boundary;
6. compact related links;
7. references and source notes;
8. medical boundary.

No scientific claims were strengthened. Pages with incomplete bibliographies retain their noindex behavior and source-note boundary.

## Guides

The Guide experience is reorganized around the reader's task:

1. concise hero and metadata;
2. bottom line;
3. evidence / uncertainty pair;
4. numbered practical actions;
5. at most two optional Science links;
6. collapsible sources;
7. compact medical boundary;
8. three related Guides.

The repeated book-sales block and featured-guide layer are removed. The index still preserves the complete 14-guide catalog, search, and category filters.

## Community

The ten-reading curriculum and ten-part email-course UI are removed from the public page. The existing challenge tools and backend learning-series infrastructure are not deleted, preserving rollback and future reuse. The public Community page now focuses on movement pillars, practical challenges, one simple read/act/share loop, and contact.

## Cross-site deduplication

- The Book replaces repeated body-system cards with three Science deep links.
- Events & Media no longer repeats the six evidence briefings; it links to one Press Kit where the downloadable PDFs live.
- The Press Kit retains the downloadable briefs but no longer presents editorial workflow-status badges as public design elements.
- Science body-system cards no longer show internal review-state badges and use shorter summaries.
- Guides point to no more than two deeper Science routes when useful rather than restating full science narratives.
- Dr. Haddad's Exposome section remains because it directly supports the project's clinical-to-environmental philosophy rather than duplicating a body-system article.

## Preserved internal infrastructure

The existing v40.23 navigation, wordmark, welcome film, commerce mode, footer, anatomy journey, Complete Body Atlas, content records, source URLs, learning-series backend, database migrations, package dependencies, package lock, and production rollback boundary are preserved.

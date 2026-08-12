# Homo Plasticus baseline audit

> **Historical baseline note:** This document records the pre-reconciliation v30 interpretation. It is superseded for current brand, information-architecture, homepage TEDx, and roadmap decisions by `docs/TRANSCRIPT_RECONCILIATION_AUDIT.md` and `DECISIONS.md`.


> Historical note: this document records the v30 visual/content baseline. The v32 native-commerce continuation supersedes its commerce and measurement status; use `CURRENT_STATE.md`, `ROADMAP.md`, and `COMMERCE_SETUP.md` for current launch truth.

Reviewed August 4, 2026 against both supplied Say No To Plastic blueprint chapters and the confirmed Homo Plasticus business goal: educate readers, sell the book, build a permission-based audience, and support future affiliate revenue.

## Decision anchor

Homo Plasticus is the primary brand. The blueprint supplies the narrative, functional, accessibility, and quality requirements. Exact Say No To Plastic naming, rigid header composition, and literal placement rules are adapted where the book-first Homo Plasticus strategy benefits from a different treatment.

Confirmed publishing credits:

- Elie R. Haddad, MD
- With collaboration by Dr. Rudolph Eberwein

## Blueprint coverage

| Blueprint requirement | Implementation | Status |
|---|---|---|
| Global sticky header and one navigation system | Fixed, scroll-aware header with desktop navigation and full-height mobile navigation | Complete |
| Keyboard-operable mobile navigation | Escape close, focus return, opening focus, and focus containment | Complete |
| Core brand system | One continuous navy, ivory, and gold editorial system with serif display type, sans-serif utility type, real subject imagery, and restrained motion | Complete |
| Landing-page narrative | Hero, context, anatomy, evidence, solutions, book, author, TEDx, signup, and footer in the required narrative order | Complete |
| Traffic destinations | Science ledger, solutions, resource library, eight field guides, author, TEDx, community, and recommendations | Complete |
| Book conversion | Book-first hero, scroll-controlled cover and page-turn sequence, dedicated book page, price display, collaborator credit, and first-party checkout-start boundary | Source-complete; native Stripe/R2 activation testing remains |
| Evidence transparency | Original source links, study design, sample, method, reported finding, limitation, and review date | Complete |
| Community capture | Consent-based field-notes forms on the homepage, community page, TEDx page, and footer | Complete, provider delivery activation remains external |
| Contact and support | Labeled form, routing topics, support email, persistence, notification queue, and success/error states | Complete, provider delivery activation remains external |
| Affiliate foundation | Recommendation standard, evaluation criteria, adjacent-disclosure requirement, policy page, and click event | Complete, products remain externally gated |
| Policy foundation | Privacy, terms, refunds, affiliate disclosure, medical disclaimer, editorial policy, accessibility, and contact | Complete, final legal-owner review remains external |
| Search and machine discovery | Canonicals, metadata, robots, sitemap, RSS, llms.txt, Organization, Person, WebSite, Book, and Article schema | Complete |
| Responsive and accessible behavior | 320px-capable layouts, visible focus, reduced motion, semantic headings, alternative text, labeled forms, 48px controls, and 52px form fields | Complete baseline |
| Redirect preservation | `/impact`, `/shop`, and `/refund_returns` permanently redirect to the new destinations | Complete |

## Six operating systems

| System | What works now | External activation still required |
|---|---|---|
| 1. Education and traffic | Search-oriented guides, science ledger, institution links, source-linked content, sitemap, RSS, and internal reading paths | Search Console connection and historical traffic data |
| 2. Book commerce | Provider-neutral CTA boundary, safe WooCommerce fallback, Stripe Session/webhook lifecycle, D1 audit, signed access, private R2 download, email, recovery, and refund-state handling | Final file/metadata, migration, provider secrets, tax confirmation, and full test matrix |
| 3. Audience capture | Subscriber consent, validation, anti-spam field, D1 persistence, welcome-email queue, provider sync adapter, unsubscribe language, and form analytics | Resend credentials, verified sending domain, and broadcast workflow |
| 4. Measurement | Consent choice, first-party event storage, page views, CTA clicks, guide opens, source exits, book views, checkout starts, confirmed purchase, leads, forms, video, and affiliate events | Reporting destination and end-to-end campaign/purchase attribution testing |
| 5. Affiliate commerce | Evaluation framework, evidence-first publication rule, disclosure architecture, category guides, and event support | Approved products, firsthand review records, retailer destinations, and partner identifiers |
| 6. Trust and governance | Confirmed identity, evidence policy, medical boundary, privacy controls, refunds, accessibility route, correction path, contact, and current source links | Owner-approved legal details, licensed final media, and official TEDx recording URL |

## Route inventory

The current source adds three purchase-support pages and four commerce endpoints to the v30 route set, while preserving eight complete field guides, three permanent legacy redirects, XML feed, sitemap, and robots route.

All rendered public pages contain an H1. The homepage contains exactly one H1. Every internal link and fragment identifier resolves in the production Worker build. No public page contains an empty CTA, empty shelf, placeholder, coming-soon panel, pending-film notice, or future-metadata promise.

## Evidence corrections made during this audit

- Corrected the 2025 follicular-fluid study sample description from 18 to 19 clinical participants.
- Replaced the carotid-plaque reference with the current PubMed record.
- Replaced brittle or redirected PNAS, NSF, EPA, AAP, ACOG, UNEP, and EEA destinations with current authoritative pages or primary-paper records.

## Automated release gate

The release gate verifies:

- production build and Worker artifact integrity
- every core route and all eight guide routes
- every internal link and referenced anchor
- required homepage section order and exact publishing credits
- absence of unfinished public-language markers
- permanent legacy redirects
- invalid form and event requests return controlled JSON errors before persistence
- RSS contains all eight field guides
- database schema and migration consistency

## Homepage interaction foundation

The homepage now uses a continuous scroll-to-camera system for six anatomical findings. On WebGL-capable devices, the camera moves through expert-reviewed NIH Human Reference Atlas geometry for the body, vasculature, brain, heart, placenta, and ovary, plus anatomically sourced BodyParts3D geometry for the paired testes and epididymides. The organ navigation drives the same timeline, so direct selection and natural scrolling cannot drift into separate states.

The anatomical renderer is loaded below the fold, caps pixel density, respects reduced-motion preferences, and falls back to a scroll-synchronized sequence made from official atlas previews and an anatomy-derived SVG when WebGL is unavailable. The models are compressed for delivery and visibly attributed under their CC BY 4.0 and CC BY-SA 2.1 JP licenses. Decorative raster composites were removed from the homepage. The approved book artwork is now the sole hero image.

The rest of the homepage follows the same narrative rule: every visual element must advance the reader into the next chapter. The abstract hero orbit, author monogram, material map, oversized cropped circles, and decorative closing grid were removed. The supplied book artwork now explains the project in the first viewport, the supplied author portrait replaces initials, and the supplied TEDx composition replaces an invented stage graphic.

The book chapter is one sticky scroll scene driven by a normalized progress timeline. It moves from the real product image into an open editorial spread, turns two layered pages, updates the reading map, and preserves a direct checkout path. Reduced-motion visitors receive a static cover and reading summary without the page-flip effect.

An uncached build-version endpoint and client guard now revalidate pages restored from browser history or long-lived tabs. This prevents a stale open tab from continuing to show a superseded homepage after a new release.

## Honest boundary

This remains the visual/content baseline. The current author portrait and TEDx composition are supplied working assets and the official TEDx recording is configured. Final licensing confirmation, flat cover/spine/back artwork, sample interior pages, final ebook file/metadata, and native-commerce activation can raise fidelity and operability without changing the page architecture.

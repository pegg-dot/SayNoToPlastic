# Blueprint Traceability and Conflict Map — v39.1

The two preserved blueprint chapters are secondary implementation authorities. They are enforced where they do not conflict with later Dr. Haddad transcript decisions or later explicit project decisions.

## Chapter 1 — Designer setup / design system

| Blueprint section | v39.1 treatment | Requirement IDs |
|---|---|---|
| Project states, backup/versioning, domain only after review | Preserved as deployment/rollback discipline; production v30 remains untouched. | OP-14–OP-17 |
| Page list / route architecture | Current app provides Home, Science, Solutions, Guides/Resources, Book, About, Media, Community, Contact, legal/support routes. TEDx-only route is superseded into Media. | IA-01–IA-12, CF-06 |
| Color tokens | v39.1 defines/uses Midnight Navy, Charcoal, Warm Ivory, Muted Gold, Soft Gold and neutral/error boundaries. | BR-04, DS-01 |
| Typography | Candidate display/sans system and wordmark boundaries exist; final distinctive font/license still owner-approved. | BR-05–BR-07 |
| Spacing/grid/container | Source tokens restored; final compositions require render measurement. | DS-01, QA-01 |
| Responsive breakpoints | Explicit desktop/tablet/mobile rules and exact viewport matrix recorded. | DS-01, QA-01 |
| Reusable buttons/cards/forms | Existing component library and form states; browser focus/touch proof pending. | DS-03, OP-13 |
| Sticky global navigation | Scroll threshold 48px, transparent/top state, 92% navy scrolled state, mobile focus/scroll rails. | DS-02, DS-03 |
| Global image handling | Live text/control rule preserved; responsive hero/kitchen/generation variants added; full crop/performance proof pending. | DS-04 |
| Motion rules | Existing restrained motion + reduced-motion rails; subjective/render proof pending. | DS-05 |
| Accessibility baseline | Source rails exist; exact viewport/zoom/keyboard/reduced-motion proof pending. | OP-13, QA-01 |
| SEO metadata | Home search intent restored; social-card candidate added; final social-preview inspection pending. | OP-09, CF-08 |

## Chapter 2 — Landing-page build

| Blueprint section | v39.1 treatment / authority decision | Requirement IDs |
|---|---|---|
| Hero | **Placement/content partly superseded.** v39.1 uses the approved mother/fetus/placenta artwork and live UI, but keeps the later transcript hero premise and book CTA instead of restoring the older TEDx-oriented hero copy. | HM-01–HM-08, HV-01, CF-06 |
| “This Changes Everything” static anatomy intro | Superseded by the later interactive seven-stage body story where overlapping. The approved maternal/fetal visual language remains useful. | AN-01–AN-18, CF-06 |
| Six static evidence cards | Dedicated Science evidence remains; interactive anatomy is primary Home evidence journey. Static blueprint architecture is not reintroduced as duplicate Home content. | SC-01–SC-12, CF-06 |
| “Where to Start” kitchen Home section | **Placement superseded by transcript.** Approved kitchen/RO imagery and substance move to Solutions so Home stays brief. | HV-02, CF-07, SO-05–SO-12 |
| Book feature | Premium book journey retained; official cover used; no product carousel. | BK-01–BK-12 |
| Dr. Haddad | Live biography + approved imagery principle retained. Exact Chapter 3 source and final photos remain blocked. | AB-01–AB-13, CF-05 |
| TEDx Home section | Superseded. TEDx belongs under Events & Media only. | MC-01–MC-06, CF-06 |
| Join the Movement | Latest rendered user review supersedes the Home placement of the giant generational visual. The approved asset remains on /community with live signup/content separation; provider proof remains blocked. | HV-03, MC-08–MC-11, MC-17 |
| Footer | Blueprint Earth-at-night direction is preserved as historical source, but later rendered user review supersedes the photo treatment. Live inheritance quote remains on a flat dark field with a faint abstract Earth curve; mobile/readability proof remains. | HM-15, HV-04, DS-06 |
| Section transitions | Dark/light editorial rhythm remains a visual-QA acceptance criterion rather than a reason to add decorative separators. | DS-01, DS-05, QA-01 |
| CTA map | Later transcript placement decisions override older TEDx anchors; all current CTAs must still resolve to real destinations. | HM-08, IA rows, links audit |
| Responsive QA | Exact viewport set expanded and preserved in QA-01. | QA-01 |
| Accessibility QA | Keyboard/focus/zoom/reduced-motion/focus-return rails remain release gates. | OP-13, QA-01, MC-18 |
| Performance QA | Hero eager, below-fold media/image dimensions, lazy video/player, heavy-module profiling remain release gates. | OP-12, DS-04, MC-18 |
| Analytics | Consent-aware event infrastructure exists; real provider verification remains pending. | OP-10 |

## Explicit conflict rule

Older blueprint instructions are **not allowed to silently reappear** when later transcript decisions changed the product. In particular:

- No large homepage TEDx section.
- No restoration of a duplicate static evidence architecture that competes with the interactive anatomy story.
- No long detailed kitchen checklist on Home; detailed action belongs in Solutions/Guides.
- The welcome/introduction video is a first-visit popup/replayable experience, not a giant hero block.
- Say No to Plastic is the movement identity; Homo Plasticus is the book.

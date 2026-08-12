# Visual and browser QA runbook

## Entry gate

Use a registry-complete machine or the connected Sites builder.

```bash
npm ci
npm run syntax:audit
npm run ui:audit
npm run clarity:audit
npm run source:audit
npm run links:audit
npm run lint
npm run build
npm test
npm run affiliate:preflight
npm run dev:commerce-preview
```

Do not continue to production activation if any command fails.

## Required viewports

Review each core flow at:

- 1440 × 900
- 1280 × 800
- 1024 × 768
- 768 × 1024
- 430 × 932
- 375 × 667

Also test browser zoom at 200% and text-only enlargement where available.

## Core route matrix

| Route | Required checks |
| --- | --- |
| `/` | first-visit welcome dialog, hero, six anatomy chapters, Chapter 07 exit, solutions, author, media bridge, signup, footer |
| `/science` | evidence cards, source links, limitations, mobile reading order |
| `/solutions` | direct language, practical-action hierarchy, guide links |
| `/homo-plasticus` | official cover, premium book journey, all centralized purchase CTAs, FAQ |
| `/purchase/preview` | no-payment handoff, required email, confirmation, recovery link |
| `/purchase/recover` | privacy-preserving response, keyboard form operation, support path |
| `/resources` | search, filter buttons, result count, empty state, guide cards |
| `/resources/<slug>` | headings, source list, related guide paths, schema output |
| `/media` | TEDx under Media only, current placeholder/feature behavior, inquiry path |
| `/media/press-kit` | biography, topics, assets, contact path |
| `/recommendations` | review-queue state, disclosures, filters when products exist |
| `/contact` | five inquiry categories, validation, loading/error/success, secondary medical boundary |

## Interaction and accessibility scenarios

### Welcome dialog

1. Clear `hp_welcome_film_seen_v1` and reload Home.
2. Confirm focus enters the dialog and cannot tab into the background.
3. Confirm background content is inert to keyboard and pointer access.
4. Close by the visible control and Escape; confirm focus returns.
5. Reopen through the fixed Welcome control.
6. Test the placeholder state and the configured-video state separately.
7. Verify mobile sizing, landscape behavior, captions/transcript link when final media exists, and reduced motion.

### Mobile navigation

1. Open and close with pointer, touch, keyboard, and Escape.
2. Confirm focus remains in the menu while open.
3. Confirm the page behind it is inert and does not scroll.
4. Confirm opening/closing near the welcome dialog never leaves body scrolling locked or prematurely unlocked.

### Anatomy journey

1. Scroll through all six evidence chapters and Chapter 07.
2. Use every chapter button directly by keyboard and touch.
3. Confirm text, source list, progress, and visual state remain synchronized.
4. Enable reduced motion and confirm the static visual updates without animated loops.
5. Disable WebGL or force a model load failure and confirm the static fallback remains understandable.
6. Inspect maternal-fetal model registration and ovary/follicular recognizability with Dr. Haddad before approval.

### Book journey

1. Scroll naturally through all chapters.
2. Use each direct chapter button by keyboard and touch.
3. Confirm the current step is announced and visible.
4. Check the cover, center line, page crops, copy contrast, and CTA placement at every viewport.
5. Enable reduced motion and confirm direct chapter movement is not smooth-animated.

### Forms and commerce preview

1. Submit each form empty and with invalid values.
2. Confirm visible labels, browser validation, pending announcement, disabled duplicate submission, server error, and success state.
3. Confirm Contact success uses Say No to Plastic and the configured support email.
4. Confirm commerce preview creates no payment, order, database row, email, token, download, or analytics purchase event.
5. Confirm every book CTA reaches `/api/checkout`, with preview mode active only under the explicit development flags.

## Evidence capture

Record for each failure:

- route and viewport;
- browser/device and input method;
- expected result and actual result;
- screenshot or short recording;
- console/network error when relevant;
- severity: blocker, high, medium, or polish;
- fix commit/version and retest result.

## Exit criteria

The gate is complete only when:

- all command checks pass;
- no blocker/high visual or interaction defects remain;
- all core routes pass desktop, tablet, and mobile review;
- keyboard, touch, reduced motion, no-WebGL, focus management, and 200% zoom are usable;
- TEDx remains absent from Home;
- all book CTAs remain centralized;
- owner-dependent anatomy/media/product claims are still marked pending until approved.

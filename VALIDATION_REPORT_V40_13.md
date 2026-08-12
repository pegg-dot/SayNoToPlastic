# Validation Report — v40.13 Microplastic Wordmark

Date: 2026-08-08

## Scope
v40.13 is a narrow branding implementation on top of v40.12. The user selected the one-line serif `Say No To Plastic` wordmark with pale plastic letterforms, embedded colorful microplastic fragments, and a restrained falling-particle effect.

The implementation uses the exact approved image as the source. It creates cropped transparent runtime derivatives and wires them into shared site chrome. It does not create another visual variant, change scientific/editorial copy, change routes, alter footer behavior, touch the welcome-film implementation, or modify commerce/dependencies.

## Runtime identity changes
- header `Wordmark` uses `public/brand/sntp-wordmark-microplastic-nav.png`;
- footer primary `Wordmark` uses the higher-resolution `public/brand/sntp-wordmark-microplastic.png`;
- the small decorative footer movement mark uses the same approved artwork;
- accessible home naming stays real text through the wordmark link's `aria-label`;
- editorial prose, metadata, copyright, legal copy, and other semantic uses of the project name remain text.

## Portable regression stack
All passed on the v40.13 working source:
- `npm run syntax:audit` — **104 files, 0 parser failures**.
- `npm run ui:audit` — **12/12**.
- `npm run clarity:audit` — **28/28**.
- `npm run source:audit` — **32/32**.
- `npm run links:audit` — **88 internal references, 0 broken**.
- `npm run homepage:polish` — **34/34**, updated to protect the approved image wordmark instead of the superseded two-part text lockup.
- `npm run science:polish` — **33/33**.
- `npm run solutions:polish` — **33/33**.
- `npm run guides:polish` — **21/21**.
- `npm run book-about:polish` — **23/23**.
- `npm run media-community:polish` — **25/25**.
- `npm run welcome:film` — **32/32**.
- `npm run local:preflight` — **9/9**.
- `npm run operations:audit` — **49/49**.
- `npm run transcript:priority` — **15 resolved checks + 2 explicit gates, 0 failures**.
- `npm run transcript:complete` — **309/309**.
- `npm run audience:preflight` — **12/12**.
- `npm run audience:test` — PASS for none, Resend and Mailchimp adapter contracts.
- `npm run media:preflight` — **0 errors, 4 intentional warnings** for temporary/current media verification.
- `npm run affiliate:preflight` — **0 errors**, expected unpublished-catalog warning.
- `npm run commerce:preflight` — **16 passed / 6 parked warnings / 0 failures**.
- `npm run content:preflight` — PASS.
- modified `scripts/homepage-polish-audit.mjs` passes `node --check`.

## Lockfile / dependency gate
`package-lock.json` remains byte-identical to v40.10-v40.12:
`7915a420ef99c285f0a152256b2ca9742f3b520834be90ab937935af8225e85e`

No lockfile edit, dependency replacement, commerce change, credential, or production change was made.

## Remaining rendered proof
The only new proof gate is visual: run v40.13 locally and inspect the shared brand lockup at the real site breakpoints. Confirm:
1. desktop header wordmark is crisp and does not crowd navigation;
2. scrolled-header state remains clean;
3. tablet/mobile header mark fits beside the menu control;
4. footer wordmark and small movement mark remain legible without materially increasing the compact v40.12 footer height;
5. the existing v40.10 welcome popup still fits in one viewport.

Production Sites v30 remains unchanged.

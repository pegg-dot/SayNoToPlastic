# v40.36 validation report

## Validation completed

- `npm run release:audit`
  - v40.36 release audit: 21 passed, 0 failed
  - inherited complete anatomy audit: 37 passed, 0 failed
  - Podcast / TEDx / newsletter audit: 14 passed, 0 failed
- `npm run audience:preflight`: 13 passed, 0 failed
- `npm run audience:test`: pass for none / Resend / Mailchimp adapter contracts
- `npm run syntax:audit`: 127 TypeScript/TSX files checked, 0 parser failures
- `npm run install:ci`: pass on a clean macOS clone; locked dependencies installed and Vinext available
- `npm run build`: pass; Vinext completed all five build phases and produced the validated Cloudflare deployment artifact

## Build notes

The production build completed successfully. It emitted two non-blocking warning classes:

- the two required Mailchimp Worker secrets are not present in the local build environment; this is expected because secret values are intentionally not stored in source control
- one or more client chunks exceed Vinext/Vite's 500 kB advisory threshold; this is a performance advisory, not a build failure

No TypeScript/parser failure or build-stopping application error was reported.

## Production safety

The Wrangler config declares the two Mailchimp values as required Worker secrets. Production deployment remains intentionally blocked until they are configured on the existing `say-no-to-plastic` Worker. Secret values are not committed to the repository.

Cloudflare authorization to the existing Worker has been verified through Wrangler. Single opt-in is confirmed for new Field Notes subscribers.

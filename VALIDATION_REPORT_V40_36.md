# v40.36 validation report

## Portable validation completed

- `npm run release:audit`
  - v40.36 release audit: 21 passed, 0 failed
  - inherited complete anatomy audit: 37 passed, 0 failed
  - Podcast / TEDx / newsletter audit: 14 passed, 0 failed
- `npm run audience:preflight`: 13 passed, 0 failed
- `npm run audience:test`: pass for none / Resend / Mailchimp adapter contracts
- `npm run syntax:audit`: 127 TypeScript/TSX files checked, 0 parser failures

## Dependency-backed build status

`npm run build` reached the repository's verified build wrapper but stopped because `vinext` was unavailable locally.

The prescribed `npm run install:ci` retry then failed while downloading the locked Vinext package because this sandbox could not resolve `registry.npmjs.org` (`curl: (6) Could not resolve host`). This is an environment/network gate, not a reported TypeScript/parser failure.

The deployment runbook therefore requires `npm run install:ci` and `npm run build` to succeed in the authenticated networked deployment environment before production deployment.

## Production safety

The Wrangler config declares `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` as required secrets. A production deploy must not proceed until both are configured on the existing Worker. Secret values are not committed to the repository.

# v40.34 Change Manifest — Deployment Release Candidate

## Scope
v40.34 is built directly on v40.33. It makes **no visual/product behavior change** to the accepted v40.33 site. It is a release-hygiene pass that aligns regression audits and handoff documentation with the final architecture.

## Changes
- Advanced the build identifier to `v40.34-deployment-release-candidate`.
- Updated legacy regression audits so later explicitly-approved replacements are recognized as compatible successors instead of false regressions.
- Preserved the compact final anatomy-atlas handoff introduced in v40.33; no giant body-preview section was restored.
- Preserved the v40.24 content deduplication: no public ten-reading Community curriculum, no repeated Media briefing grid, and no old pseudo-table-of-contents Book framing was restored.
- Preserved v40.25/v40.26 long-form Guide reading flow and one-row article navigation.
- Preserved v40.28 testicular tissue as chapter 10.
- Preserved v40.33 system-aware microplastic motion.
- Added one consolidated Dr. Haddad external-input checklist.
- Added an explicit ChatGPT Sites deployment runbook for updating the existing Site rather than creating a new one.
- Updated `CURRENT_STATE.md`, `HANDOFF.md`, and `README.md` so their first section identifies v40.34 as the current release candidate.
- Added a dedicated release-candidate audit.

## Safety boundaries unchanged
- No deployment or publication was performed.
- Production Sites v30 was not modified.
- `COMMERCE_MODE=woocommerce` remains the safe production default.
- Native Stripe remains parked unless explicitly approved and configured.
- No secrets, final ebook, banking/tax/identity data, or customer data were added.
- `package-lock.json` remains byte-identical to the approved baseline.

# v40.27 change manifest — final pre-deploy polish

Base: v40.26.

## User-visible corrections

- Removed the large Quick Action Card “Editorial note” panel.
- Preserved the short item-level evidence cautions on contested authored actions 10 and 11.
- Fixed the Community hero so its “Say No To Plastic” eyebrow and heading begin below the fixed header instead of rendering underneath it.
- Preserved the approved full three-generation artwork, signup form, movement content, and all existing routes.

## Operational documentation

- Added `docs/V40_27_PREDEPLOY_CHECKLIST.md`, separating preview deployment, WooCommerce launch, optional native Stripe activation, Dr. Haddad approvals, provider configuration, and post-launch items.
- Updated the parked Quick Action Card approval item to reflect the superseding public presentation.
- Updated inherited audits so the explicit v40.27 removal is treated as a supported replacement: evidence boundaries remain inline rather than in a large public editorial panel.

## Preserved

- Existing site architecture and design.
- `COMMERCE_MODE=woocommerce` default.
- Native checkout remains inactive.
- Package dependencies and `package-lock.json` remain unchanged.
- No production providers, secrets, domain, database, storage, or deployment were modified.

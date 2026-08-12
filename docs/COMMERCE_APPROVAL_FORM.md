# Native ebook commerce approval form

Complete before production activation. Do not place secret values, banking information, identity documents, signed access links, or customer data in this file.

## Product approval

- Final PDF approved by:
- Approval date:
- Local source filename:
- R2 object key:
- SHA-256 checksum:
- Title:
- Subtitle:
- Author credit:
- Collaborator credit:
- Edition:
- Language:
- Publication date:
- Page count:
- ISBN, if assigned:
- Preview/sample allowed: yes / no

## Commercial approval

- Price:
- Currency:
- Stripe Product ID:
- Stripe Price ID:
- Automatic Tax: enabled / disabled
- Tax decision approved by:
- Refund policy approved by:
- Full-refund authority:
- Partial-refund authority:
- Stripe receipt emails: enabled / disabled
- Territory restrictions, if any:

## Account and operations owners

- Stripe primary owner:
- Stripe backup administrator:
- Cloudflare owner:
- D1 owner:
- R2 owner:
- DNS owner:
- Resend owner:
- Support mailbox:
- Support mailbox owner:
- Subscription/unsubscribe owner:
- Operations-secret owner:
- Operations-scheduler owner:
- Dead-job/incident owner:
- Refund owner:
- Rollback owner:

## Technical activation record

- Test D1 migrations through `0005` applied:
- Test R2 object uploaded/checksum confirmed:
- Test Stripe Price created:
- Test webhook created with matching API version:
- Resend domain verified:
- `OPERATIONS_SECRET` configured securely:
- Protected readiness passed:
- Hourly protected drain schedule configured/tested:
- Strict preflight passed:
- Clean build/rendered tests passed:
- Browser/accessibility matrix passed:
- Test purchase passed:
- Payment failure passed:
- Async payment state passed or intentionally disabled:
- Success-page access passed:
- Initial email access passed:
- Recovery passed:
- Outbox provider-failure/backoff/stale-lease recovery passed:
- Eight-attempt terminal state/operator resolution passed:
- Welcome/resubscribe/unsubscribe passed:
- Contact recording/delayed delivery passed:
- Webhook replay passed:
- Full refund revocation passed:
- Partial refund behavior passed:
- Analytics consent/preferences passed:
- WooCommerce rollback tested:

## Production approval

- Live variables/bindings configured:
- Live D1 migrations through `0005` applied:
- Live R2 checksum confirmed:
- Live webhook configured:
- Live readiness passed:
- Live operations schedule active:
- Live smoke purchase approved by:
- Live smoke purchase date:
- Live email/recovery/unsubscribe/Contact checks passed:
- Live refund/revocation verified:
- Production switched to Stripe by:
- Activation date/time:
- Rollback checkpoint:

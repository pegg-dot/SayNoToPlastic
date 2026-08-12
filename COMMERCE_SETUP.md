# Native ebook commerce activation

## Safety model

Native commerce is opt-in. `COMMERCE_MODE=woocommerce` preserves the current external store. Set `COMMERCE_MODE=stripe` only in a non-production environment until every gate below passes.

Stripe hosts the payment form. The application does not collect or store full card numbers. Application storage contains order/provider identifiers, purchase email, amount/currency, status, source, timestamps, fulfillment/recovery/download audit data, and provider delivery IDs.

## Architecture

1. A book CTA posts to `/api/checkout` with a browser-generated attempt UUID.
2. The server creates/reuses a D1 order and Stripe Checkout Session using provider idempotency.
3. Stripe redirects to `/purchase/success?session_id=...`.
4. The success page can fulfill immediately; signed webhooks are the durable asynchronous/replay path.
5. Paid sessions must match the configured product currency and expected amount before access is granted.
6. Paid orders receive HMAC-signed, expiring access URLs; order/refund state is rechecked before each download.
7. The PDF streams from private R2 through `/api/ebook/download` and never belongs under `public/`.
8. Resend sends initial and recovery access messages with provider idempotency. Fulfillment claims use leases so interrupted sends can be retried safely.
9. Email outbox audit records do not store bearer access URLs.
10. Recovery is non-enumerating, rate-limited using a secret-keyed email hash, and only serves paid active orders.
11. Full refunds revoke access; partial refunds preserve access unless the approved policy changes.
12. A protected operations drain retries due recovery/site email and eligible queued purchase fulfillment with bounded attempts.

## 1. Collect and approve inputs

Use:

- `docs/DR_HADDAD_COMMERCE_REQUEST.md`
- `docs/COMMERCE_EXTERNAL_INPUTS.md`
- `docs/COMMERCE_APPROVAL_FORM.md`

Confirm the final PDF, credits/metadata, price/currency, sample permission, refund language, tax decision, territories, receipt preference, account/payout ownership, support mailbox, DNS owner, and launch/rollback owners.

Public product values live in `app/content/book-product.json`. Secrets do not.

## 2. Run the local readiness gate

With a safe local environment file containing no production secrets committed to source:

```bash
npm run commerce:preflight -- \
  --strict \
  --env-file <safe-local-env-file> \
  --ebook <path-to-final-pdf>
```

The command checks product data, D1/R2 bindings, migrations through `0005`, environment structure, PDF signature, and SHA-256 checksum without printing secret values. Record the checksum in the approval form and configure `EBOOK_SHA256`.

## 3. Prepare D1

Apply all migrations through:

```text
drizzle/0005_site_operations.sql
```

Confirm:

- `commerce_orders`
- `commerce_events`
- `commerce_fulfillments`
- `ebook_downloads`
- `recovery_requests`
- unique provider Session/event indexes
- `commerce_fulfillments.claimed_at`, `updated_at`, and `attempt_count`
- subscriber unsubscribe fields and unique token-hash index
- general email-outbox lease, retry, error, and next-attempt fields/index

Do not enable Stripe mode if migration status is uncertain.

## 4. Prepare private R2

- Bind the private bucket as `EBOOKS`.
- Upload the approved PDF at the exact `EBOOK_OBJECT_KEY`.
- Set `Content-Type: application/pdf` when supported.
- Compare the uploaded/source file checksum with `EBOOK_SHA256`.
- Do not enable public bucket access and do not copy the PDF into `public/`.

## 5. Prepare Stripe test mode

Create one Product and one **one-time** Price matching `app/content/book-product.json`. Configure directly in the hosted environment:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_API_VERSION=2026-07-29.dahlia`
- `STRIPE_AUTOMATIC_TAX=true|false` only after the owner/tax decision

Create the test webhook at:

```text
https://<test-host>/api/checkout/webhook
```

Pin the endpoint to the same API version and subscribe at minimum to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `charge.refunded`

Never use live keys on a preview/test host.

## 6. Prepare signed access and email

Configure directly in the hosted environment:

- `PUBLIC_SITE_URL`
- `EBOOK_ACCESS_SECRET` with at least 32 high-entropy characters
- `EBOOK_OBJECT_KEY`
- `EBOOK_DOWNLOAD_FILENAME`
- `EBOOK_SHA256`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SUPPORT_EMAIL`

Verify the Resend domain/subdomain through DNS and confirm the support mailbox receives replies. Initial purchase and recovery links default to 30 days; success-page links default to 7 days. Durations live in `app/content/book-product.json`.


## 7. Protected operations and retry schedule

Configure a hosted `OPERATIONS_SECRET` with at least 32 random characters. Verify:

```text
GET /api/internal/readiness
POST /api/internal/email-outbox?limit=25
Authorization: Bearer <OPERATIONS_SECRET>
```

The drain retries due welcome, Contact, unsubscribe-sync, and ebook-recovery jobs plus eligible queued/failed/stale purchase fulfillment. Both site email and purchase fulfillment stop after eight attempts and remain visible for operator review. Configure an approved authenticated scheduler to call the drain at least hourly after provider activation.

Do not place the secret in source, client code, a public URL, or ordinary logs. See `docs/OPERATIONAL_RESILIENCE.md` and `docs/OPERATIONS.md`.

## 8. Connected-builder gate

Run in an environment with complete package-registry access:

```bash
npm ci
npm run lint
npm run build
npm test
npm run commerce:preflight -- --strict --env-file <safe-env-file> --ebook <final-pdf>
```

Do not proceed on warnings related to provider mismatch, PDF/checksum, missing bindings, migration failure, or secrets.

## 9. Activate only the test environment

Set `COMMERCE_MODE=stripe` only in test. Keep production on WooCommerce.

## 10. Required test matrix

### Checkout and request safety

- One click creates one order and one Session.
- Retrying the same attempt returns the same order/Session.
- Rapid clicks do not create duplicates.
- Wrong-origin, malformed, and oversized bodies are rejected.
- Missing provider configuration is explicit and never marks an order paid.
- Stripe API-version header is present and test webhook events cannot be processed with a live key, or vice versa.
- A paid Session with wrong amount, currency, or product metadata is rejected.

### Payment and webhook states

- Successful card payment grants access.
- Failed/canceled/expired payments grant no access and store the correct state.
- Asynchronous payment remains processing until success.
- Concurrent success-page and webhook fulfillment sends one customer email.
- Duplicate and failed webhook replays are idempotent.
- A stale webhook processing claim can be safely reclaimed.

### Fulfillment and private access

- Success page shows order ID and valid access.
- Initial email arrives once, replies route to support, and its access works.
- Simulate interruption after provider send/before database completion; retry does not send a duplicate and the claim recovers after its lease.
- Outbox records contain no signed bearer URL.
- PDF response is an attachment with private/no-store and nosniff headers.
- Invalid, altered, expired, unpaid, fully refunded, and missing-object states are denied.
- Every download rechecks current order state.

### Recovery and privacy

- Correct email recovers the latest paid active order.
- Optional order ID selects the exact matching paid order.
- Wrong email/order receives the same public response as a match.
- Internal rate limiting activates after three recent requests.
- Recovery email is idempotent per request and access works.
- Provider outage leaves the recovery request queued and the protected drain later completes it.
- No recovery outbox row contains a signed bearer URL.

### Refunds

- Full refund records `refunded`, revokes access, and blocks old links.
- Partial refund records `partially_refunded` and follows approved policy.
- Support can trace provider events without card details.
- Queued/failed/stale purchase fulfillment retries through the protected drain and stops after eight attempts.

### Analytics, accessibility, and mobile

- Checkout/purchase events obey analytics consent and deduplicate per order/device.
- Loading, error, success, access, and recovery states are keyboard- and screen-reader-usable.
- Phone, tablet, and desktop checkout/recovery flows are readable.
- Privacy, terms, refunds, FAQ, price, tax, receipts, and support language match actual behavior.

## 11. Production cutover and rollback

Before cutover:

- export/retain WooCommerce orders and delivery records;
- apply production D1 migrations through `0005`;
- verify production R2 object/checksum;
- configure live Stripe/Resend resources and matching webhook version;
- name payment, support, refund, email, incident, and rollback owners;
- run one authorized live smoke purchase, email, download, recovery, and refund/revocation;
- test rollback by returning `COMMERCE_MODE=woocommerce`.

Immediately before the live smoke/cutover, run the same command with `--production` against a safe live-configuration file. Only then activate Stripe in production. Retain the legacy checkout URL as an immediate rollback boundary until the native path has stable operating history.

## Safe visual preview before provider activation

Run:

```bash
npm run dev:commerce-preview
```

Every existing book CTA still POSTs to `/api/checkout`. In guarded preview mode the endpoint returns `/purchase/preview`, where the site-owned handoff, order-confirmation language, and recovery route can be reviewed without Stripe credentials or a transaction.

Preview mode proves wiring and presentation only. It does not prove Stripe Checkout, webhook signatures, D1 persistence, Resend delivery, R2 access, refund handling, or monitoring. Those remain part of the test-mode activation matrix above.

# Native ebook commerce: external inputs and ownership

The application infrastructure is prepared so approved values can be inserted without redesigning the purchase flow. Production must remain on `COMMERCE_MODE=woocommerce` until inputs, provider resources, operational ownership, and the test matrix are complete.

## What must come from Dr. Haddad or an authorized business owner

### Final digital product

- Final sale-ready ebook PDF and written approval to sell/deliver that exact file.
- Title, subtitle, author/collaborator credit, edition, language, publication date, page count, and ISBN status.
- Preview/sample permission.
- Final cover approval.

The PDF must not be placed in `public/` or sent through ordinary project files. It belongs in private R2. Preflight computes/verifies SHA-256.

### Commercial and legal decisions

- Final one-time price/currency.
- Refund wording and full/partial refund authority.
- Automatic-tax decision based on the appropriate professional advice.
- Territory restrictions, if any.
- Stripe receipt preference.

### Account and payout ownership

Confirm legal account owner, Stripe primary/backup administrators, payout owner, and the people responsible for disputes, refunds, provider notices, and launch approval. Identity, tax, bank, and payout details must be entered directly into Stripe—not chat, email, or source.

### Support, email, and operations ownership

- Final support mailbox and monitoring owner.
- Approved sender name/address.
- DNS owner for the sending domain/subdomain.
- Owner of `OPERATIONS_SECRET` and backup access process.
- Owner of the hourly protected drain schedule.
- Person responsible for dead outbox/fulfillment jobs and incident response.
- Approval of purchase, recovery, unsubscribe, refund, and support wording.

## What the technical owner must configure externally

1. Create/select test and production D1 databases and apply migrations through `0005_site_operations.sql`.
2. Create a private R2 bucket, bind it as `EBOOKS`, and upload the approved PDF at `EBOOK_OBJECT_KEY`.
3. Create the Stripe Product and one-time Price.
4. Create test/live Stripe webhooks at `/api/checkout/webhook` using the pinned API version.
5. Add Stripe, ebook, Resend, support, public-origin, and operations secrets/variables to the hosted environment.
6. Verify the Resend sending domain through DNS and test reply routing.
7. Configure an authenticated scheduler to POST `/api/internal/email-outbox` at least hourly after provider activation.
8. Verify protected `/api/internal/readiness` before test/live use.
9. Run the complete test-mode purchase, delivery, recovery, outbox, unsubscribe, replay, failed-payment, and refund matrix.
10. Run an approved low-risk live smoke lifecycle before production Stripe activation.

## Secret-handling boundary

Never paste or commit:

- Stripe secret/webhook keys;
- Resend API key;
- ebook access-signing secret;
- operations secret;
- banking, identity, tax, or payout information;
- customer/order exports or database copies;
- signed ebook access URLs.

Only non-secret identifiers and approved public metadata may be shared in project chat/source.

## Where approved inputs go

- Public product/publication data: `app/content/book-product.json`
- Provider/delivery values: hosted variables matching `.env.example`
- Private PDF: R2 at `EBOOK_OBJECT_KEY`
- Operational approvals/owners: `docs/COMMERCE_APPROVAL_FORM.md`

## Readiness command

```bash
npm run commerce:preflight -- --strict --env-file <safe-local-env-file> --ebook <path-to-final-pdf>
```

This validates structure, bindings, migrations, product data, PDF signature, and checksum without printing secret values.

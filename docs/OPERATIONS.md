# Say No to Plastic operations

## Pinned business path

Qualified traffic enters through evidence or a guide, learns through the editorial standard, reaches the book, begins checkout through the first-party boundary, receives controlled ebook access, and can recover access without exposing whether an account exists.

## Publishing identity

Book credits remain **Elie R. Haddad, MD** with collaboration by **Dr. Rudolph Eberwein** unless the authorized owner approves a correction. Preserve that credit only in book/product contexts; do not present the collaborator as a movement founder or general spokesperson.

## Owners required before launch

Name primary and backup owners for:

- Stripe account, payouts, disputes, receipts, and provider notices;
- tax and refund decisions;
- D1 migrations/data access;
- private R2 ebook object/checksum;
- Resend/DNS and transactional delivery;
- the selected marketing-audience provider and newsletter policy;
- support, inquiries, subscription preference, and recovery;
- protected operations secret and scheduler;
- webhook/outbox replay and incidents;
- launch approval and WooCommerce rollback.

Record non-secret decisions in `docs/COMMERCE_APPROVAL_FORM.md`.

## Migrations and readiness

Apply all migrations through `drizzle/0005_site_operations.sql`. Before a release, call the protected readiness endpoint and verify `readyForCurrentMode=true`.

Example without exposing the secret in shell history:

```bash
read -s OPERATIONS_SECRET
curl -fsS \
  -H "Authorization: Bearer ${OPERATIONS_SECRET}" \
  https://<host>/api/internal/readiness
unset OPERATIONS_SECRET
```

The public `/api/health` endpoint is only a minimal availability signal. It does not replace readiness.

## Durable email and recovery operations

- Welcome, Contact, unsubscribe synchronization, and ebook recovery use the D1 outbox.
- Jobs use atomic claims, ten-minute leases, exponential retry delay, provider idempotency, payload scrubbing, and an eight-attempt ceiling.
- Initial purchase fulfillment uses a separate commerce lease and the protected drain can retry eligible queued/failed/stale work up to eight attempts.
- Contact inquiries and local unsubscribe state are written before provider delivery.
- Signed ebook access URLs are generated at delivery time and are not stored in outbox payloads.
- Transactional order/access email remains separate from marketing preference.

Invoke the protected drain at least hourly in staging/production after provider activation:

```bash
read -s OPERATIONS_SECRET
curl -fsS -X POST \
  -H "Authorization: Bearer ${OPERATIONS_SECRET}" \
  "https://<host>/api/internal/email-outbox?limit=25"
unset OPERATIONS_SECRET
```

Use a managed scheduler for normal operation. Manual invocation is for testing and incident recovery, not the long-term schedule.

## Dead-job procedure

When a site outbox row reaches `dead` or a commerce fulfillment reaches the retry ceiling:

1. Identify the workflow and last provider error without copying secret/customer content into an ordinary ticket.
2. Confirm the underlying provider, DNS, binding, or configuration issue is fixed.
3. Confirm the local subscriber/order/inquiry state is still valid.
4. Use an approved operator procedure to reset/requeue the individual record; do not bulk reset blindly.
5. Invoke the protected drain and verify both provider and D1 completion.
6. Record incident time, affected workflow, root cause, remediation, owner, and prevention step.

The repository intentionally does not expose a public “reset dead job” endpoint.

## Email and audience activation test matrix

Verify `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPPORT_EMAIL`, and sending-domain DNS. Set `AUDIENCE_PROVIDER` only after the owner selects `mailchimp` or `resend`; otherwise keep `none`. For Mailchimp, verify the API key, server prefix, and audience ID. Test:

- new signup, transactional welcome delivery, and selected audience-provider record creation;
- repeated signup, provider update, unsubscribe, and explicit resubscription;
- visible preference link;
- one-click unsubscribe POST;
- local suppression when provider is unavailable;
- contact recording and delayed notification recovery;
- purchase and recovery email;
- reply routing;
- provider failure, backoff, stale lease, terminal attempt ceiling, and manual resolution.

## Commerce delivery reliability

- Stripe Checkout and Resend requests use provider idempotency.
- Webhook and fulfillment work use atomic claim timestamps; stale claims may be reclaimed after the configured lease.
- Initial email access is anchored to the paid timestamp; recovery access is anchored to its request timestamp.
- Review fulfillments in `sending`, `queued`, or `failed`; never assume a provider request means the database completed.
- Never store or paste signed access URLs in tickets, analytics, or outbox notes.

## Privacy and analytics

- Optional first-party analytics is off until accepted.
- Visitors can change the browser choice on the privacy page or reopen the banner from the footer.
- Email subscription is a separate consent and must not change when analytics preference changes.
- Analytics events are allowlisted, origin checked, size limited, and must never contain message bodies, payment data, email addresses, or signed access URLs.

## Monitoring

Monitor:

- checkout and Stripe request errors;
- signature/mode/amount/currency failures;
- failed/stale webhook claims;
- orders stuck in creation, processing, or blocked configuration;
- outbox `dead`, repeated `failed`, delayed `queued`, or stale `processing` rows;
- commerce fulfillment attempts and stale `sending` rows;
- subscribers stuck in `pending` or `unsubscribe_pending`;
- inquiries not delivered to support;
- missing R2 object/download errors;
- recovery rate limits and support escalations;
- full/partial refunds and revoked access;
- consented engagement and purchase attribution.

Establish weekly reporting for guide engagement, checkout starts, paid orders, conversion, delivery failures, recovery requests, unsubscribes, refunds, and support volume.

## Production cutover

Before cutover, retain WooCommerce records, verify D1/R2 backups and access, verify Stripe/Resend/DNS, apply migration `0005`, configure the protected scheduler, pass strict preflight with the final PDF, run the full test matrix, perform one approved live smoke lifecycle, and exercise immediate rollback to `COMMERCE_MODE=woocommerce`.

## Content and transcript drift control

- Review `docs/PARKED_OWNER_ACTIONS.md` at every launch/status review.
- TEDx and appearances remain under `/media`, not Home.
- The guide editor preserves known/uncertain/action/source structure.
- Affiliate records require complete evidence, tradeoffs, relationship disclosure, and owner/editor approval before `published`.
- Before a content/sequence change, check `docs/TRANSCRIPT_RECONCILIATION_AUDIT.md`, run source/link/clarity audits, and update durable records.

## Release-quality rule

Portable audits are pre-commit gates. Clean install, lint, build, rendered tests, and `docs/VISUAL_QA_RUNBOOK.md` remain the non-negotiable release gate. Source-only checks never prove real browser, provider, clinical-art, or production behavior.

# v37 operational resilience

**Status:** source-complete, provider activation pending  
**Date:** August 6, 2026

## Purpose

The site previously had functional forms and commerce logic, but a provider interruption could still leave work in an ambiguous state. v37 establishes a durable operating boundary: record important user intent first, attempt delivery second, retry safely, stop after a defined ceiling, and preserve enough state for an operator to recover without exposing secrets or signed download links.

## Durable workflows

### Subscriber signup

1. Validate same-origin, body size, honeypot, name, email, and explicit consent.
2. Create a 32-byte random unsubscribe token and store only its SHA-256 hash on the subscriber.
3. Upsert the subscriber as active with consent version/time.
4. Store the raw token only inside the pending welcome outbox payload.
5. Synchronize the provider contact and send the welcome email.
6. On success, replace the outbox payload with `{}`.

A later signup intentionally reactivates an unsubscribed address and issues a new token. Repeating signup for an address that is already active returns success without creating another welcome job.

### Unsubscribe

1. Accept a valid token from the preference form or one-click POST.
2. Find the subscriber by token hash.
3. Mark the subscriber locally unsubscribed before contacting the provider.
4. Queue provider synchronization only when one is not already pending/completed.
5. Return the same public 200 response whether or not a subscriber matched.

Transactional purchase/access messages remain separate from marketing preference.

### Contact inquiry

1. Validate and store the inquiry in D1.
2. Queue the support notification.
3. Attempt immediate delivery.
4. If delivery fails, the inquiry remains recorded and the outbox can retry.

### Ebook recovery

1. Record a privacy-safe recovery request and apply rate limiting.
2. Find only a paid, active order without revealing the match publicly.
3. Queue a recovery job containing order/request identifiers, origin, and issue timestamp—never a signed URL.
4. Recreate the deterministic access URL when the job is delivered.
5. Scrub the payload after success.

### Initial purchase fulfillment

The existing commerce fulfillment lease remains authoritative. The protected drain also selects queued, failed, or stale-sending fulfillment records below the eight-attempt ceiling and invokes the same provider-idempotent send path.

## Outbox contract

Supported site outbox kinds:

- `welcome`
- `contact_notification`
- `subscriber_unsubscribe`
- `ebook_recovery`

Behavior:

- atomic claim;
- ten-minute lease;
- stale-claim recovery;
- exponential delay starting at five minutes and capped at 24 hours;
- deterministic provider idempotency keys;
- maximum eight attempts;
- terminal `dead` state for operator review;
- successful payload replacement with `{}`.

## Protected operations endpoints

### Readiness

```text
GET /api/internal/readiness
Authorization: Bearer <OPERATIONS_SECRET>
```

Returns booleans for D1 connectivity/schema, R2 binding, email configuration, public origin, Stripe, and ebook access. It does not return secret values.

### Drain and retry

```text
POST /api/internal/email-outbox?limit=10
Authorization: Bearer <OPERATIONS_SECRET>
```

Drains due site/recovery jobs and retries queued purchase fulfillment. Limit is clamped to 1–50.

### Public health

```text
GET /api/health
```

Returns only a minimal service/version response. It is not a provider or database readiness check.

## Required deployment operation

After staging provider configuration is ready, invoke the protected drain at least hourly using a Cloudflare scheduled trigger or another approved authenticated scheduler. Do not place `OPERATIONS_SECRET` in source, a public URL, client JavaScript, or ordinary logs.

A scheduled invocation is not yet configured in this portable export because the deployment environment and ownership have not been approved. The endpoint and runbook are ready for that external connection.

## Operator review

Review at least:

- outbox rows in `dead`, `failed`, `queued`, or stale `processing`;
- commerce fulfillment rows in `failed`, `queued`, or stale `sending`;
- contact inquiries not marked sent;
- subscribers with `unsubscribe_pending` or `pending` provider state;
- recovery requests marked `failed` or repeatedly rate-limited;
- provider authentication/domain errors;
- missing private R2 object or access configuration.

Never copy customer messages, signed access URLs, provider secrets, or the private ebook into tickets unless the approved privacy process specifically requires it.

## Validation boundary

Source audits and a SQLite migration test verify the architecture and schema. They do not prove real Resend, Stripe, D1, R2, DNS, scheduler, or browser behavior. Those remain part of non-production integration proof and the launch checklist.

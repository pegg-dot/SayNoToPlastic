# Ten-part learning series — operations and activation

**Candidate:** v40.16 completion pass  
**Sequence key:** `haddad-foundations-v1`  
**Production status:** implemented but inactive until the owner configures the database, email provider, and scheduler.

## Purpose

The Community page offers a consent-based ten-part educational email sequence. The same ten lessons also remain readable on the website without signup. Enrollment is not required to access the science.

The sequence is deliberately scheduled over 30 days. Each message points to an existing canonical route and preserves the site's evidence boundary: detection is not causation; supplied narrative is not a substitute for primary-source review; established medical care remains first.

## Required production configuration

1. Apply all database migrations through `drizzle/0006_learning_series.sql`.
2. Configure the existing `DB` D1 binding.
3. Set `PUBLIC_SITE_URL` to the final HTTPS movement domain.
4. Set a 32-character-or-longer `OPERATIONS_SECRET`.
5. Configure transactional email:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `SUPPORT_EMAIL`
6. Decide whether the broader Field Notes audience should remain `none` or be synchronized through `resend` or `mailchimp`. This is a separate owner decision from transactional lesson delivery.

Never commit populated secret values.

## Durable scheduling flow

1. The visitor submits the Community learning-series form with explicit consent.
2. `/api/subscribe` creates or updates the subscriber, stores the consent record, and calls `enrollInLearningSeries`.
3. The enrollment layer creates ten dated `learning_series` jobs in `email_outbox` and a row in `learning_series_enrollments`.
4. A protected scheduler calls `POST /api/internal/email-outbox?limit=25` with `Authorization: Bearer <OPERATIONS_SECRET>`.
5. The outbox claims due jobs with a lease, verifies that the job matches the enrollment's `next_step`, defers later lessons until the prior lesson succeeds, retries transient failures, sends through Resend, advances the enrollment, and then scrubs the delivered payload. This ordering allows a retry to self-heal if the final job update fails after provider acceptance.
6. A terminal delivery failure - including exhausting retries while transactional email remains unconfigured - marks the enrollment `delivery_failed` and stops the remaining unsent sequence instead of skipping ahead.
7. Unsubscribe immediately marks the local subscriber inactive, cancels unsent learning-series jobs, and queues audience-provider synchronization.

An explicit re-enrollment restarts the sequence and replaces unsent jobs. For an already-active subscriber whose welcome delivery is still pending, the stale welcome job is also replaced after token rotation. This keeps the newly issued unsubscribe token embedded in queued messages aligned with the current subscriber record.

## Scheduler recommendation

Use a trusted server-side cron or Cloudflare scheduled worker every 5–15 minutes. The scheduler must call only the protected POST endpoint. Do not expose `OPERATIONS_SECRET` to browser code, analytics, logs, or public configuration.

Example request shape for an approved operations environment:

```bash
curl --fail --silent --show-error \
  --request POST \
  --header "Authorization: Bearer ${OPERATIONS_SECRET}" \
  "${PUBLIC_SITE_URL}/api/internal/email-outbox?limit=25"
```

The endpoint also retries queued ebook fulfillment work, so one protected scheduler can operate both systems.

## Readiness check

Use the protected endpoint:

```bash
curl --fail --silent --show-error \
  --header "Authorization: Bearer ${OPERATIONS_SECRET}" \
  "${PUBLIC_SITE_URL}/api/internal/readiness"
```

For the current WooCommerce mode, `coreReady` requires the database connection plus the operations schema, including `learning_series_enrollments`. The response reports configuration state without returning secret values.

## Acceptance test before activation

Use a non-production recipient and verify:

- one consent event and one active subscriber row;
- one active enrollment row with `next_step = 1`;
- exactly ten pending learning-series jobs with ascending due dates;
- the first due message contains working reading, preferences, and one-click unsubscribe links;
- a repeated explicit signup restarts rather than duplicates the unsent schedule;
- unsubscribe changes the enrollment to `cancelled` and marks unsent jobs `dead`;
- a later scheduler run does not deliver cancelled lessons;
- later lessons defer while an earlier lesson remains unsent;
- provider failures remain queued or failed under the bounded retry policy rather than being silently dropped;
- a terminal first-lesson failure stops the later schedule instead of delivering lessons out of order;
- no message claims that a body-system association proves causation or offers medical treatment.

## Monitoring

Monitor the following without logging message bodies or unsubscribe tokens:

- pending, queued, failed, processing, sent, and dead outbox counts;
- oldest due job age;
- enrollment counts by `active`, `completed`, and `cancelled`;
- repeated terminal failures;
- provider response IDs and timestamps;
- readiness status after deployments and migrations.

## Safe rollback

To pause delivery without losing consent records:

1. stop the scheduler;
2. leave the database and subscriber rows intact;
3. investigate or correct configuration;
4. resume only after readiness and a test recipient pass.

To cancel the program entirely, stop the scheduler and mark active learning-series enrollments cancelled before any cleanup. Do not delete unsubscribe/suppression records needed to honor user choices.

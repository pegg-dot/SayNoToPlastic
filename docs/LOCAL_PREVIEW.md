# v38 local and builder preview

## Standard preview

In a registry-complete environment:

```bash
npm run install:ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Native commerce flow preview

```bash
npm run dev:commerce-preview
```

Click any ebook purchase control. Every CTA calls the real `/api/checkout` boundary, which returns `/purchase/preview` only because both preview flags are explicitly set by the script.

Preview mode does not create a payment, order, database purchase record, email, access token, download, refund, or purchase event. The actual card-entry screen is Stripe-hosted and appears only after test-provider configuration.

## Welcome film checks

The modal opens automatically on the first homepage visit. To repeat it:

```js
localStorage.removeItem("hp_welcome_film_seen_v1");
location.reload();
```

Verify focus trap/return, inert background, Escape/close/backdrop behavior, body-scroll restoration, mobile layout, and reduced motion. For v40.9 also verify the real portrait film poster is uncropped, Play starts the hosted MP4 with audio only after interaction, replay works after dismissal, and `/media` uses the same film without autoplay.

## Primary routes

- `/` — welcome, six anatomy chapters, Chapter 07, no TEDx section
- `/science` — evidence and sources
- `/solutions` — first action and one-change planner
- `/homo-plasticus` — official cover, book journey, centralized purchase CTAs
- `/purchase/preview` — safe checkout visualization
- `/purchase/recover` — non-enumerating access recovery
- `/email-preferences?token=<test-token>` — unsubscribe interface
- `/resources` — fourteen guides
- `/media` and `/media/press-kit` — Media/TEDx/press materials
- `/recommendations` — fail-closed affiliate state
- `/community` — movement/community path
- `/contact` — inquiry routing and form states
- `/privacy-policy#privacy-choices` — revisable analytics preference
- `/api/health` — minimal public health response

## Portable checks

```bash
npm run syntax:audit
npm run ui:audit
npm run clarity:audit
npm run source:audit
npm run transcript:priority
npm run audience:preflight
npm run audience:test
npm run media:preflight
npm run links:audit
npm run operations:audit
npm run affiliate:preflight
npm run commerce:preflight
```

## Non-production operations checks

After applying migrations through `0005` and configuring a test `OPERATIONS_SECRET`:

```bash
read -s OPERATIONS_SECRET
curl -fsS \
  -H "Authorization: Bearer ${OPERATIONS_SECRET}" \
  http://localhost:5173/api/internal/readiness

curl -fsS -X POST \
  -H "Authorization: Bearer ${OPERATIONS_SECRET}" \
  "http://localhost:5173/api/internal/email-outbox?limit=10"
unset OPERATIONS_SECRET
```

Do not use a production secret in a local preview. Test signup, provider-offline queueing, unsubscribe, Contact, recovery, stale lease, backoff, terminal retry, and manual operator recovery only in an isolated non-production database/provider account.

## Full pre-share gate

```bash
npm run install:ci
npm run lint
npm run build
npm test
npm run affiliate:preflight
npm run commerce:preflight -- --strict --env-file <safe-test-env> --ebook <approved-private-pdf>
```

Then complete `docs/VISUAL_QA_RUNBOOK.md` and `QA_CHECKLIST.md`.

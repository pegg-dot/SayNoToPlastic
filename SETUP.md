# Setup — v40.9

## Requirements

- Node.js `>=22.13.0`
- npm with access to the locked package artifacts
- SQLite for local migration verification
- A Cloudflare/Sites environment only when testing Worker bindings

## Install and validate

```bash
npm run install:ci
npm run syntax:audit
npm run ui:audit
npm run clarity:audit
npm run homepage:polish
npm run science:polish
npm run solutions:polish
npm run guides:polish
npm run book-about:polish
npm run local:preflight
npm run source:audit
npm run transcript:priority
npm run audience:preflight
npm run audience:test
npm run media:preflight
npm run welcome:film
npm run links:audit
npm run operations:audit
npm run affiliate:preflight
npm run commerce:preflight
npm run lint
npm run build
npm test
```

`install:ci` is the project’s locked clean-install wrapper. v40+ includes a macOS-safe path as well as the defensive Sites/Linux path. Do not modify `package-lock.json` to bypass a registry/cache failure.

## Local preview

Normal WooCommerce mode:

```bash
npm run dev
```

Safe native-commerce UI preview without a payment/order:

```bash
npm run dev:commerce-preview
```

The preview command must not be used as evidence that Stripe, D1, R2, email, or fulfillment was tested.

## Environment contract

Copy `.env.example` only into an untracked local/hosted environment. Never commit populated secrets.

Key safe defaults:

```env
PUBLIC_SITE_URL=https://saynotoplastic.com
SUPPORT_EMAIL=support@saynotoplastic.com
COMMERCE_MODE=woocommerce
AUDIENCE_PROVIDER=none
```

### Transactional email

Transactional welcome, contact, ebook, and recovery delivery uses Resend when configured:

```env
RESEND_API_KEY=<secret>
RESEND_FROM_EMAIL=Say No to Plastic <updates@saynotoplastic.com>
```

### Newsletter audience

Choose explicitly:

```env
AUDIENCE_PROVIDER=mailchimp
# or
AUDIENCE_PROVIDER=resend
```

For Mailchimp, also configure the API key, server prefix, and audience ID. See `docs/AUDIENCE_PROVIDER_SETUP.md`.

### Operations

Set a random secret of at least 32 characters in the deployment dashboard:

```env
OPERATIONS_SECRET=<secret>
```

Never pass it to browser code.

## Database

Apply migrations in lexical order through:

```text
drizzle/0005_site_operations.sql
```

Use an isolated preview/local D1 database first. Production migrations require explicit owner/operator approval and a rollback/backup plan.

## Private ebook

- The paid PDF is not in source.
- Upload only to the private `EBOOKS` R2 binding.
- Record the exact object key, download filename, and SHA-256 checksum in hosted configuration.
- Never place the PDF under `public/`.

## Connected Sites import rule

Import v40.9 as a new unpublished candidate when moving this local candidate into the connected Sites builder. Preserve:

- current v30 production;
- the existing v37 unpublished candidate;
- site identity/URL/hosting/storage bindings;
- rollback history.

Do not publish until the full browser QA and owner review are approved.

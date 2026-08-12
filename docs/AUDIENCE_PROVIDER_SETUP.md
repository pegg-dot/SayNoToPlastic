# Audience provider setup

## Why this boundary exists

The meeting transcript discussed Mailchimp, while the operational build later used Resend for transactional delivery. Those are two separate decisions:

- **Transactional email:** welcome message, Contact notification, ebook access/recovery. v38 uses Resend for this role.
- **Marketing audience:** subscriber records used for newsletters and broadcasts. v38 supports Mailchimp or Resend, but chooses neither automatically.

The safe default is:

```env
AUDIENCE_PROVIDER=none
```

This prevents an implementation convenience from becoming an unapproved platform decision.

## Option A — Mailchimp audience

Set these hosted secrets/settings:

```env
AUDIENCE_PROVIDER=mailchimp
MAILCHIMP_API_KEY=<hosted secret>
MAILCHIMP_SERVER_PREFIX=<for example us21>
MAILCHIMP_AUDIENCE_ID=<audience/list id>
```

The adapter:

- adds or updates a consenting subscriber;
- stores first name in `FNAME`;
- changes the member status to `unsubscribed` after a local unsubscribe;
- uses the MD5 digest of the lowercased email as Mailchimp's member identifier;
- never places credentials in source or browser code.

The current form already records explicit local consent. A separate owner decision is still required for double opt-in, campaign defaults, physical-address/legal footer, sender identity, tags/segments, and welcome automation.

## Option B — Resend audience

Set:

```env
AUDIENCE_PROVIDER=resend
RESEND_API_KEY=<hosted secret>
```

The adapter creates/updates the contact and synchronizes global unsubscribe state. Transactional email also requires:

```env
RESEND_FROM_EMAIL=Say No to Plastic <updates@saynotoplastic.com>
SUPPORT_EMAIL=support@saynotoplastic.com
```

## Readiness and tests

```bash
npm run audience:preflight
npm run audience:test
```

After hosted configuration, call the protected readiness endpoint and confirm:

- `audienceProvider` matches the approved provider;
- `audienceConfigured` is `true`;
- `emailConfigured` is `true` for transactional delivery.

Then test with controlled addresses:

1. New signup
2. Repeated signup
3. Welcome delivery
4. Audience record creation
5. Visible unsubscribe link
6. One-click unsubscribe
7. Local suppression before provider synchronization
8. Resubscribe with explicit new consent
9. Provider outage and outbox retry
10. Dead-job operator visibility after the retry ceiling

Do not enable public newsletter claims until those steps pass on the hosted domain.

# Say No To Plastic owner admin setup

The owner admin is intentionally separated from public hosting, deployment, payment, and API-secret controls.

## Approved accounts

Only these email identities are accepted by the application layer:

- `DrElieBeyondPlastic@gmail.com`
- `pegg@gymfinityapp.com`

The application verifies the Cloudflare Access JWT and then checks the email claim against this allowlist. Adding an email only in Cloudflare Access is not enough to bypass the application allowlist.

## Protected paths

Create **one** Cloudflare Access self-hosted application and add both of these public-hostname destinations to that same application:

- `saynotoplastic.com/admin`
- `saynotoplastic.com/admin/*`

Cloudflare documents that a wildcard child path such as `/admin/*` does not cover the parent `/admin` path itself, so both destinations are intentional. Keeping them in the same Access application gives the page and its write API one Application Audience (AUD) tag.

Do not protect the rest of the public site. The Access policy should allow only the two approved emails above. Do not use an `Everyone` allow rule.

## Worker configuration

After creating the Access application, copy:

1. the Cloudflare Access team domain, for example `your-team.cloudflareaccess.com`
2. the Application Audience (AUD) tag for that single admin application

Set them on the production Worker without committing values to Git:

```bash
npx wrangler secret put CF_ACCESS_TEAM_DOMAIN
npx wrangler secret put CF_ACCESS_AUD
```

The code verifies the `Cf-Access-Jwt-Assertion` signature using the team's public Access keys, validates expiry and audience, then validates the email allowlist.

## Database migration

Before using `/admin`, apply the new D1 migration to the existing production database:

```bash
npx wrangler d1 migrations apply saynotoplastic-db --remote
```

Migration `0007_owner_admin.sql` adds:

- `admin_content`
- `admin_content_revisions`

It does not replace or modify the existing subscriber, analytics, commerce, or learning-series tables.

## Current editable fields

The first owner-safe release allows editing only:

- TEDx video URL
- TEDx status: temporary or official
- Spotify podcast URL
- Apple Podcasts URL
- YouTube podcast URL
- Amazon Music podcast URL
- optional short site notice
- optional Events & Media owner update

All URL fields have host allowlists and require HTTPS. Changes are versioned and stored with the authenticated editor email.

## Deliberately excluded

The admin does not expose:

- Cloudflare credentials or deployment controls
- GitHub or repository contents
- Mailchimp API keys
- WooCommerce/payment credentials
- D1 query access
- arbitrary HTML, JavaScript, or CSS
- arbitrary page creation

Those remain developer-controlled because a general-purpose CMS would create unnecessary security and publishing risk.

## Safe deployment order

1. Run the full test/build stack on the release branch.
2. Apply `0007_owner_admin.sql` to the existing production D1 database.
3. Configure one Cloudflare Access application with both `saynotoplastic.com/admin` and `saynotoplastic.com/admin/*` destinations and the two-email allow policy.
4. Set `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` on the Worker.
5. Deploy the validated release.
6. Visit `/admin` from both approved accounts and confirm an unapproved account is rejected.
7. Change a harmless field, verify the public page updates, then clear it back to the source default.

If the migration or admin configuration is unavailable, public TEDx/podcast pages fall back to the source-code values instead of failing.

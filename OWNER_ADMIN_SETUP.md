# Say No To Plastic owner admin setup

The owner admin is intentionally separated from public hosting, deployment, payment, scientific evidence, and API-secret controls. It is a narrow editorial workspace for the kinds of changes Dr. Haddad is likely to make as the project evolves.

## Approved accounts

Only these email identities are accepted by the application layer:

- `DrElieBeyondPlastic@gmail.com`
- `pegg@gymfinityapp.com`

The application verifies the Cloudflare Access JWT and then checks the email claim against this allowlist. Adding an email only in Cloudflare Access is not enough to bypass the application allowlist.

## Protected paths

Create **one** Cloudflare Access self-hosted application and add both of these public-hostname destinations to that same application:

- `saynotoplastic.com/admin`
- `saynotoplastic.com/admin/*`

A wildcard child path such as `/admin/*` does not cover the parent `/admin` path itself, so both destinations are intentional. Keeping them in the same Access application gives the page and its write API one Application Audience (AUD) tag.

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

The first command's **secret name must literally be `CF_ACCESS_TEAM_DOMAIN`**. Enter the `your-team.cloudflareaccess.com` value only after Wrangler prompts for the secret value.

The code verifies the `Cf-Access-Jwt-Assertion` signature using the team's public Access keys, validates issuer, audience, expiry, not-before, and email claims, then applies the application allowlist.

## Database migration

Before using `/admin`, apply the owner-admin D1 migration to the existing production database:

```bash
npx wrangler d1 migrations list saynotoplastic-db --remote
npx wrangler d1 migrations apply saynotoplastic-db --remote
```

Migration `0007_owner_admin.sql` adds:

- `admin_content`
- `admin_content_revisions`

It does not replace or modify the existing subscriber, analytics, commerce, or learning-series tables. The expanded v40.39 editorial workspace reuses these same two tables, so it does **not** need another schema migration.

## Owner workflows

The owner workspace is organized around five practical areas:

### Overview

Shows the number of active overrides, published owner-managed appearances, recent revision history, and quick links into each editing area.

### Homepage

Owner-editable:

- optional site-wide notice
- hero eyebrow
- hero headline
- hero supporting sentence
- homepage Events & Media heading and description
- homepage Field Notes heading and description

Blank values fall back to the reviewed source-code copy.

### Events & Media

Owner-editable:

- Events & Media headline and introduction
- featured owner update
- TEDx video URL
- TEDx temporary/official status
- structured appearances and events

Appearances can be created as drafts and published only when ready. Supported owner-managed item types are event, talk, interview, podcast appearance, and press. Each item can include a date, outlet/venue/platform, HTTPS destination URL, and public description. The list is capped and validated before saving.

### Beyond Plastic podcast

Owner-editable:

- current series label
- current series heading
- current series description
- Spotify link
- Apple Podcasts link
- YouTube link
- Amazon Music link

Provider URL fields use HTTPS and provider-specific host validation where appropriate.

### Press kit

Owner-editable:

- short biography
- extended biography
- media contact email

The evidence briefings, scientific topics, project facts, and editorial boundaries remain source-controlled.

## Revision history and rollback

All owner changes:

- are stored in the existing D1 database
- record the authenticated editor email
- increment a version number
- write the revision and current value atomically
- use optimistic concurrency checks so two editors cannot silently overwrite each other
- can be reset to the reviewed source default
- keep recent versions available in the admin UI

Restoring an older version creates a new current version instead of deleting history.

## Deliberately excluded

The admin does not expose:

- scientific evidence summaries or medical claims
- body-system content or exposure guidance
- Cloudflare credentials or deployment controls
- GitHub or repository contents
- Mailchimp API keys
- WooCommerce/payment credentials
- raw D1 query access
- arbitrary HTML, JavaScript, or CSS
- arbitrary page creation

Those remain developer-controlled because a general-purpose CMS would create unnecessary scientific, security, and publishing risk.

## Safe deployment order

1. Run the full test/build stack on the release branch.
2. Confirm `0007_owner_admin.sql` is applied to the existing production D1 database.
3. Configure one Cloudflare Access application with both `saynotoplastic.com/admin` and `saynotoplastic.com/admin/*` destinations and the two-email allow policy.
4. Set `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` on the Worker with the exact secret names above.
5. Deploy the validated release.
6. Visit `/admin` from both approved accounts and confirm an unapproved account is rejected.
7. Save a harmless draft or copy override, verify the intended public page changes, then reset it to the source default.
8. Add one draft appearance, confirm it is not public, then publish it and confirm it appears on Events & Media.

If the admin database is unavailable, owner-managed public copy and media fall back to source-code defaults instead of taking the public site down.

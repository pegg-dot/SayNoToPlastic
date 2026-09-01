# v40.36 deploy checklist

- [ ] Owner confirms Mailchimp single opt-in or double opt-in.
- [ ] Authenticated deployment environment passes `npm run install:ci`.
- [ ] `npm run release:audit` passes.
- [ ] `npm run audience:preflight` passes.
- [ ] `npm run audience:test` passes.
- [ ] `npm run syntax:audit` passes.
- [ ] `npm run build` passes.
- [ ] `npx wrangler whoami` confirms access to the correct Cloudflare account.
- [ ] `MAILCHIMP_API_KEY` is set via Wrangler secret prompt.
- [ ] `MAILCHIMP_AUDIENCE_ID` is set via Wrangler secret prompt.
- [ ] Existing Worker/D1/commerce configuration is reviewed before deploy.
- [ ] `npx wrangler deploy` succeeds.
- [ ] Home, Podcast, TEDx, Community, Media, Book, Science, and Take Action smoke tests pass.
- [ ] Real Field Notes signup appears in the intended Mailchimp Audience and D1.
- [ ] Repeat signup is safe/idempotent.
- [ ] Unsubscribe updates Mailchimp.
- [ ] Existing WooCommerce book checkout still opens correctly.

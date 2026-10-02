# Production deployment

The production Worker is `say-no-to-plastic` and the canonical public origin is `https://saynotoplastic.com`.

## Why this exists

The repository uses Vinext plus the Cloudflare Vite plugin. The root `wrangler.jsonc` is the **input** configuration. A fresh build generates the deployable Worker and assets under `dist/`, plus `.wrangler/deploy/config.json` pointing Wrangler at the generated configuration.

Deploying from an old checkout can therefore overwrite production with an old application even when GitHub `main` is newer. That failure mode matches the regression where the old homepage book-flip experience returned and newer Spanish/admin work disappeared.

## Only supported production command

```bash
npm run deploy:production
```

That command refuses to deploy unless the local commit exactly matches `origin/main`, runs the full release audit, performs a fresh build, deploys the generated Wrangler config, and verifies:

- the live build marker;
- the static homepage book feature is present instead of the old page-flip section;
- the Spanish route is reachable;
- the admin route is reachable/protected;
- the canonical apex host is healthy.

Do not deploy production from an old `homo_plasticus_v40_*` folder or a stale Downloads checkout.

## www host

`www.saynotoplastic.com` must route to the same `say-no-to-plastic` Worker as the apex domain. The Worker then returns a permanent redirect to `https://saynotoplastic.com`, preserving path and query string. Do not bind `www` to a separate legacy Worker or old hosting target.

## Cloudflare credentials

Production deployment uses the existing Wrangler-authenticated Cloudflare account. Repository GitHub Actions do not currently hold a Cloudflare API token, so GitHub cannot repair production by itself. Do not commit API tokens.

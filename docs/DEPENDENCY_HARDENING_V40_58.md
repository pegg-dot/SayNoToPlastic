# v40.58 Dependency Hardening

## Why this release exists

The v40.57 mobile release was functionally complete, but a final release-closure review found npm advisories in the installed dependency tree. The production dependency audit initially reported six findings, including one critical and three high-severity findings. v40.58 updates the runtime and build stack before the project is handed off as release-complete.

## Validated production dependency baseline

The hardened baseline pins:

- Next.js 16.3.8
- React 19.2.8
- React DOM 19.2.8
- fflate 0.7.5
- react-server-dom-webpack 19.2.8
- Vinext 0.0.50 (retained after compatibility testing)
- Vite 8.3.2
- Cloudflare Vite plugin 1.62.5
- Wrangler 4.147.0
- Next ESLint config 16.3.8
- Vite RSC plugin 0.5.26

The resulting `npm audit --omit=dev` result is **0 production vulnerabilities**: zero critical, high, moderate, or low findings in the production dependency tree.

## Development-tool advisories

A full `npm audit` can still report advisories inside dev/build tooling such as linting, migration tooling, and Vinext's transitive build chain. These packages are not part of the production dependency audit and are not treated as zero-risk merely because they are dev-only. They remain tracked separately.

We intentionally did not run `npm audit fix --force` or accept npm suggestions that would downgrade core tooling across incompatible major versions. Production runtime fixes were applied first, then the complete application release audit and Cloudflare build were rerun on the hardened dependency set.

We also tested Vinext 1.0.1 with the hardened stack. Although it compiled successfully, the rendered route regression produced HTTP 500 responses on multiple previously healthy routes, including Science explainers, Resources, Contact, Community, policy pages, and Spanish science/action pages. That upgrade was rejected and rolled back to Vinext 0.0.50 with Vite RSC 0.5.26. The production dependency audit remains at zero vulnerabilities after the rollback. This is an intentional compatibility boundary, not an untested stale dependency.

## Permanent release protection

GitHub release validation now runs `npm run security:audit:production` after `npm ci`. Any future pull request or push to `main` with a known npm advisory in the production dependency tree will fail before the normal release audit/build completes.

The historical package-lock integrity gate remains in place and now recognizes the validated v40.58 lockfile rather than removing lockfile validation.

## Infrastructure preserved

This hardening does not change:

- Worker identity: `say-no-to-plastic`
- production D1 binding: `DB -> saynotoplastic-db`
- canonical origin: `https://saynotoplastic.com`
- Cloudflare Access owner protection
- Mailchimp secret names or audience integration
- WooCommerce production mode

## Verification before release

The v40.58 release must pass:

```text
npm run security:audit:production
npm run audit:mobile
npm run release:audit
npm run build
```

The application must then be rendered again at the representative mobile widths before merge because the Next/React/Vinext/Vite stack changed even though page source did not.

## Final compatibility results

The final compatible hardened stack completed the same rendered regression used for v40.57: **64 sitemap routes × 430 px, 375 px, and 320 px = 192 rendered checks, 0 flagged**. Interactive phone states also passed for the menu, consent layer, Welcome control, anatomy atlas, owner-login and locked admin surfaces. Phone-landscape atlas checks passed at 844 × 390 and 667 × 375.

A temporary local AdminPanel QA harness was also rerun under the hardened stack at 390 px and 320 px. Page Studio, field editing, phone preview, Today, Field Notes, and Media had no horizontal overflow or undersized controls; all four primary owner tabs remained visible simultaneously at 320 px. The harness was removed before release source was built.

The final full `npm audit` reports 14 findings confined to dev/build tooling: 1 low, 4 moderate, 9 high, 0 critical. The production-only audit remains **0 production vulnerabilities**. These dev-only findings are tracked but were not force-fixed because npm proposes incompatible/downgrade paths for several of them, and the tested Vinext major upgrade caused runtime 500s.

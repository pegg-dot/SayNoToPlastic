# v40.27 pre-deployment and launch checklist

This is the practical handoff between the finished source candidate and a public launch. It separates what is required for an unpublished preview deployment from what is required to turn on live commerce, email, domain, and other production services.

## A. Unpublished preview deployment

These can be done without activating native checkout or marketing email:

1. Import the current version as an unpublished Sites candidate while preserving the existing production site and rollback point.
2. Run clean install/build in the connected runtime and complete the browser QA matrix: desktop, tablet, mobile, keyboard, reduced motion, 200% zoom, print/PDF paths, and external 3D model loading/fallback.
3. Confirm final domain/canonical configuration is still parked until cutover.
4. Do not add production secrets, banking information, customer data, or the final ebook to source/project chat.

## B. Dr. Haddad / authorized-owner approvals before public launch

### Book/product
- Final sale-ready PDF and/or EPUB.
- Final title/subtitle, author/collaborator credit, edition, language, publication date, page count, ISBN status, preview/sample permission, approved download filename, cover approval.
- Final price/currency, territories, tax decision, refund language, and support owner.
- Approval of the final collaborator-credit placement and any controlled live smoke purchase.

### Content/medical
- Final Quick Action Card wording, especially authored items 10 and 11 and the health-protection language.
- Final biography/education/current-work chronology in writing.
- Clinically qualified review/approval of the anatomy scenes and whether the licensed reference models are sufficient.
- Missing/partial primary bibliographies and final medical/editorial wording for source-review body-system topics.

### Brand/media
- Final wordmark/type/license/use approval.
- Approved portrait/media assets and rights/credits.
- Official TEDx replacement URL/date/title/thumbnail rights/captions or transcript when available; verify current temporary and long-form media metadata/rights.
- Additional NBC/interview/podcast/event links Dr. Haddad wants published.

### Audience
- Choose Mailchimp or Resend for the marketing audience.
- Approve double opt-in, sender/reply-to identity, physical mailing address/legal footer, tags/segments, welcome automation, and newsletter owner.

## C. If production remains on WooCommerce

Native Stripe checkout is **not required** for launch. Keep `COMMERCE_MODE=woocommerce` and verify:

1. The real WooCommerce product/checkout destination is correct.
2. The approved ebook is attached to the real product/fulfillment flow.
3. Purchase confirmation gives the buyer download access.
4. Email delivery works.
5. Recovery/support works if the email is lost.
6. Price, refund, tax, territory, and product metadata match the approved public copy.

This is the lowest-risk launch path and preserves the current fallback architecture.

## D. Only if Dr. Haddad explicitly approves native checkout

Native checkout is already implemented but intentionally inactive. Before switching `COMMERCE_MODE=stripe`, configure and prove all of the following:

1. Stripe account ownership/admins/payout/dispute/refund responsibility.
2. Stripe Product + one-time Price.
3. Test and live Stripe webhook at `/api/checkout/webhook` with the pinned API version.
4. Test and production Cloudflare D1 databases with all migrations applied.
5. Private R2 bucket bound as `EBOOKS`; upload the final PDF at `EBOOK_OBJECT_KEY`; verify SHA-256.
6. Resend transactional email and verified sending-domain DNS.
7. Hosted secrets/variables for Stripe, ebook signing, Resend, support, public origin, and operations. Never commit them.
8. `OPERATIONS_SECRET` and an authenticated scheduler that drains the email outbox at least hourly.
9. Protected readiness endpoint passes.
10. Strict commerce preflight passes with the final PDF.
11. Test purchase, failed payment, asynchronous state if enabled, delivery, recovery, unsubscribe, webhook replay, retries, refund/revocation, and WooCommerce rollback all pass.
12. One approved low-risk live smoke lifecycle passes before production cutover.

## E. Domain, email, privacy, analytics, and launch operations

Before public cutover:

- Connect and verify `saynotoplastic.com`, canonical URLs, redirects, and DNS.
- Verify support mailbox and sender identities on the domain.
- Reconcile Privacy Policy with the providers actually enabled at launch.
- Configure and verify analytics only after privacy review; do not collect health/payment/message-body data.
- Validate sitemap/schema/rich results and connect Search Console.
- Establish backups/rollback, monitoring, email-failure ownership, support ownership, refund/dispute ownership, and incident procedure.
- Run final accessibility/performance/browser QA in the hosted candidate.

## F. PDFs and downloadable assets

The site already contains generated public worksheets/challenge/press-brief PDFs. They are not a substitute for the **final ebook PDF**, which is still an owner-supplied private commerce asset and must not be placed in `public/`.

There is no tracked project requirement literally named “PBS.” If “PBS” was shorthand for PDFs, the final ebook PDF is the major missing file; the generated public PDFs already exist and should simply receive final owner/editorial approval.

## G. Optional/post-launch items

These do not need to block a clean first launch if intentionally omitted:

- Affiliate products (catalog can remain empty).
- Additional media appearances not yet supplied.
- Professional sculpture photography.
- Optional trust-logo row.
- Dr. Haddad's requested long-context independent review of the live public site; treat findings as a new versioned post-launch batch.

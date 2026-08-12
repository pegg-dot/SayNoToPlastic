# v40.34 — Everything external needed from Dr. Haddad / the authorized owner

This is the consolidated owner-input list for public launch. It separates **launch blockers** from items that may be intentionally deferred. Do not fill any of these with guesses.

## 1. Must-have before public launch

### A. Final book product
Ask Dr. Haddad to provide or approve:

- The **final sale-ready Homo Plasticus ebook PDF** and written confirmation that this exact file is approved for delivery to buyers.
- Final title and subtitle.
- Final author name and collaborator credit/placement.
- Edition and language.
- Publication date.
- Page count.
- ISBN status/number, if assigned.
- Approved cover.
- Approved download filename.
- Whether a public preview/sample may be published.
- Final one-time price and currency.
- Countries/territories, if restricted.
- Refund wording/authority.
- Tax decision, including whether automatic tax should be enabled if native Stripe is later used. Tax treatment should be confirmed with the appropriate professional.
- Final customer-support owner and mailbox.

**Security boundary:** the final ebook must not be committed under `public/` or pasted into ordinary project chat. For native commerce it belongs in private R2. If WooCommerce remains the production path, attach it through the approved WooCommerce fulfillment flow.

### B. Commerce decision
Dr. Haddad/owner must explicitly choose one launch path:

1. **WooCommerce (recommended first launch / current safe default)**
   - Confirm the real WooCommerce checkout/product URL and product ID.
   - Confirm the price/currency and product metadata.
   - Attach the approved final ebook.
   - Confirm confirmation-page access, delivery email, lost-email recovery/support, refunds, tax, and territories.

2. **Native Stripe checkout (optional; do not activate merely because the code exists)**
   - Approve Stripe as the processor.
   - Confirm legal account owner and primary/backup administrators.
   - Confirm payout owner and the people responsible for disputes/refunds/provider notices.
   - Approve one test transaction and one low-risk live smoke purchase/refund before cutover.
   - Identity, tax, bank, payout, passwords, and secret keys must be entered directly in provider dashboards, never sent through chat/email/source.

### C. Medical/content signoff
Obtain written approval or revised wording for:

- Quick Action Card authored items 10 and 11 and any broad health-protection language.
- Final reverse-osmosis/water guidance.
- Any direct can-liner / heavily packaged-food guidance before using stronger wording.
- The current anatomy/scrollytelling scenes, including whether the licensed educational reference models and the illustrative microplastic motion are acceptable for public education.
- Remaining source-review body-system wording and missing/partial primary bibliographies before presenting those topics as fully source-reviewed.

### D. Biography / credentials / current work
Dr. Haddad must resolve and confirm in writing:

- Medical school wording.
- Internal-medicine residency institution and dates, including the Jackson vs. prior Drexel source conflict.
- Cardiovascular fellowship institution/dates.
- Clinical cardiac electrophysiology fellowship institution/dates.
- Current professional role/work wording and dates.
- The Chapter 3 Part I / Part II or other approved biography source he referenced, so the About page can receive final provenance review.

### E. Brand and media rights
Obtain approval for:

- Final Say No to Plastic wordmark/signature treatment.
- Final font/typeface choice and license/hosting rights if a licensed typeface is used.
- Current portrait and all public photography rights/credits.
- Whether the current white-coat portrait is approved or should be replaced with another portrait.
- Final TEDx official URL/title/date, thumbnail/poster rights, and captions/transcript when available.
- Any NBC, interview, podcast, panel, or event links he wants included, with dates and rights/credits.

### F. Domain, email, and contact ownership
Dr. Haddad/owner must confirm:

- Who controls DNS for `saynotoplastic.com`.
- Final public support address.
- Final sender name/address.
- Who monitors support, media, book/order, research, and partnership inquiries.
- Who is authorized to approve DNS/provider changes at launch.

### G. Newsletter / Field Notes decision
Choose and approve:

- Marketing audience provider: **Mailchimp** or **Resend**. The safe default remains `AUDIENCE_PROVIDER=none` until this is approved.
- Double-opt-in policy.
- Sender/reply-to identity.
- Required physical mailing address/legal footer.
- Audience tags/segments/source attribution.
- Welcome automation wording.
- Newsletter owner/operator.

The visible signup experience should not be treated as production-ready until D1 storage, transactional Resend delivery, the chosen audience provider, unsubscribe, and external-address tests pass in the hosted candidate.

## 2. External items that may be deferred without blocking the first clean launch

These are owner/source requests, but they do not need to block launch if deliberately omitted:

- Additional media appearances not yet supplied.
- Professional sculpture photography and rights.
- Optional trust-logo/affiliation row.
- Final official TEDx replacement if the current media item remains explicitly temporary/pending.
- The ambiguous meeting image described as “not complete,” if it cannot be identified and is not currently published as a false final asset.
- Post-launch independent long-context review by Dr. Haddad's own ChatGPT; treat that as a new versioned review batch.
- Affiliate products; the catalog can remain empty.

## 3. Never ask Dr. Haddad to send these through chat/email

- Passwords.
- API secret keys.
- Stripe webhook secret.
- Bank/payout information.
- Identity/tax documents.
- Customer/order data.
- `OPERATIONS_SECRET`.
- Ebook signing secret.
- Signed ebook access URLs.

Those belong directly in secure provider/hosting dashboards.

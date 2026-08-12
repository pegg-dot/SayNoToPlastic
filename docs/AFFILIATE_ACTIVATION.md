# Affiliate infrastructure activation

Status: infrastructure ready; no products are published.

## What is already connected

- Product catalog: `app/content/affiliate-products.json`
- Typed catalog access: `app/content/affiliate.ts`
- Public recommendation library: `app/components/RecommendationLibrary.tsx`
- Safe known-destination redirect: `app/go/[slug]/route.ts`
- Adjacent commercial disclosure beside every published link
- `rel="sponsored nofollow noopener noreferrer"` on affiliate links
- Click analytics through the existing consent-aware event layer
- Activation validator: `npm run affiliate:preflight`
- Public policy: `/affiliate-disclosure`

## Adding a recommendation

Add a record to `products` in `app/content/affiliate-products.json` with `status: "draft"`. Complete the evidence record, tradeoffs, firsthand-review basis, retailer, HTTPS destination, relationship, disclosure, and review date. Run:

```bash
npm run affiliate:preflight
```

Only change `status` to `published` after editorial and commercial approval. Published records automatically appear on `/recommendations`; the public link resolves through `/go/<slug>`.

## Owner inputs still required

- Affiliate network or retailer account ownership
- Approved payout recipient and tax setup
- Exact affiliate destination URL for each product
- Confirmation of any free sample, sponsorship, discount, or other material connection
- Product-specific evidence and tradeoff review
- Firsthand-use or inspection status
- Approval of the nearby disclosure language

Do not place network passwords, tax documents, bank information, or private API credentials in the repository.

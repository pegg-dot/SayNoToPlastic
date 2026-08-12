# Content operations

The site keeps **intake separate from publication**. A nontechnical owner can fill one of the JSON templates in `docs/content-templates/`; nothing becomes public merely because a template exists.

## Guide intake
Use `guide-intake.json`. Preserve a direct reader question, a plain-language action, visible primary sources, review date, and `publicationStatus: "draft"` until editorial review is complete.

## Evidence study intake
Use `evidence-study-intake.json`. Human evidence should lead when the transcript requires it. Record sample size, the finding in ordinary language, what it means, one material limitation, and the primary source URL.

## Media intake
Use `media-intake.json`. A media record cannot be public until the exact URL, platform/date, rights status, and owner approval are known. The official TEDx link is explicitly owner-gated.

## Affiliate product intake
Use `affiliate-product-intake.json`. A product requires a material/claim source, retailer/destination, commission relationship, adjacent disclosure copy, price-check date, image rights, and review. No empty or invented shelf is allowed.

## Gate
Run `npm run content:preflight`. The gate checks that intake examples default to safe unpublished states and that the public media/affiliate registries do not bypass their existing approval boundaries.

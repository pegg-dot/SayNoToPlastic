"use client";

import { useMemo, useState } from "react";
import type { AffiliateCategory, AffiliateProduct } from "../content/affiliate";
import { TrackedLink } from "./TrackedLink";

export function RecommendationLibrary({ categories, products, disclosure }: { categories: AffiliateCategory[]; products: AffiliateProduct[]; disclosure: string }) {
  const [category, setCategory] = useState("all");
  const visible = useMemo(() => products.filter((product) => category === "all" || product.category === category), [category, products]);

  return (
    <>
      <div className="recommendation-controls">
        <div><span>{products.length} published recommendations</span><p>Only fully reviewed products appear here.</p></div>
        <div role="group" aria-label="Filter recommendations by category">
          <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"}>All</button>
          {categories.map((item) => <button type="button" key={item.slug} onClick={() => setCategory(item.slug)} aria-pressed={category === item.slug}>{item.name}</button>)}
        </div>
      </div>
      {visible.length ? (
        <div className="recommendation-product-grid">
          {visible.map((product) => (
            <article key={product.slug}>
              {product.imageSrc && <img src={product.imageSrc} alt={product.imageAlt || ""} width="900" height="700" loading="lazy" />}
              <span>{categories.find((item) => item.slug === product.category)?.name || product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.summary}</p>
              <dl><div><dt>Use case</dt><dd>{product.useCase}</dd></div><div><dt>Review basis</dt><dd>{product.firsthandStatus.replace("-", " ")}</dd></div><div><dt>Retailer</dt><dd>{product.retailer}</dd></div></dl>
              <div className="affiliate-near-link"><strong>Commercial disclosure</strong><p>{product.disclosure || disclosure}</p></div>
              <TrackedLink className="button dark" href={`/go/${product.slug}`} target="_blank" rel="sponsored nofollow noopener noreferrer" eventName="affiliate_click" label={`recommendation-${product.slug}`}>View recommendation <span>↗</span></TrackedLink>
              <small>Reviewed {product.lastReviewed}. Price, availability, shipping, warranty, and returns are controlled by the retailer.</small>
            </article>
          ))}
        </div>
      ) : (
        <div className="recommendation-empty">
          <span>Review queue active</span>
          <h3>No product is published until the record is complete.</h3>
          <p>The catalog, redirect safety, adjacent disclosures, sponsored-link attributes, evidence fields, and activation checks are ready. Product links will appear automatically after a candidate clears review and its status changes to <code>published</code>.</p>
          <a href="/affiliate-disclosure">Read the affiliate standard →</a>
        </div>
      )}
    </>
  );
}

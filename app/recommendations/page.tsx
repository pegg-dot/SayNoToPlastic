import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { RecommendationLibrary } from "../components/RecommendationLibrary";
import { affiliateCatalog, publishedAffiliateProducts } from "../content/affiliate";

export const metadata: Metadata = {
  title: "Recommended Products | Say No to Plastic",
  description: "Evidence-first lower-plastic household recommendations with visible review criteria, tradeoffs, and affiliate disclosures.",
  alternates: { canonical: "/recommendations" },
};

export default function RecommendationsPage() {
  return <><Header/><main id="main-content" tabIndex={-1} className="inner-page recommendations-page">
    <section className="recommendation-hero"><div><p className="eyebrow">Recommended products</p><h1>Criteria first. Products second.</h1><p>Say No to Plastic recommends only products that pass a documented usefulness and evidence review. Affiliate economics never determine the conclusion.</p></div><aside><span>Publication rule</span><strong>Evidence before economics</strong><p>Every listing must disclose its use case, verified claims, tradeoffs, firsthand-review status, and commercial relationship beside the purchase link.</p></aside></section>

    <section className="recommendation-principles ivory"><div><p className="eyebrow dark">The evaluation record</p><h2>Every product must earn its place.</h2></div><ol><li><span>01</span><div><h3>Define the actual exposure pathway</h3><p>A product must address a specific, repeated use case instead of trading on general anxiety.</p></div></li><li><span>02</span><div><h3>Verify claims and standards</h3><p>Certifications, laboratory methods, scope, exclusions, and maintenance requirements remain visible.</p></div></li><li><span>03</span><div><h3>Use or inspect the real product</h3><p>Firsthand evidence, construction, usability, recurring cost, and failure points become part of the record.</p></div></li><li><span>04</span><div><h3>Compare meaningful alternatives</h3><p>We include lower-cost, lower-waste, and do-nothing-yet options when they are reasonable.</p></div></li><li><span>05</span><div><h3>Disclose the relationship beside the link</h3><p>Readers see when a purchase may earn Say No to Plastic a commission at no added cost.</p></div></li></ol></section>

    <section className="recommendation-catalog"><header><div><p className="eyebrow">The recommendation shelf</p><h2>Published only after review.</h2></div><p>Draft candidates stay invisible. A product becomes public only after its evidence, tradeoffs, relationship, destination, and review status pass an automated activation check.</p></header><RecommendationLibrary categories={affiliateCatalog.categories} products={publishedAffiliateProducts} disclosure={affiliateCatalog.defaultDisclosure}/></section>

    <section className="recommendation-categories ivory"><p className="eyebrow dark">Evaluation desks</p><h2>How we assess the highest-frequency categories</h2><div>{affiliateCatalog.categories.map((category,index)=><article key={category.slug}><span>{String(index+1).padStart(2,"0")}</span><h3>{category.name}</h3><p>{category.description}</p><a href={`/resources/${category.guideSlug}`}>Read the field guide →</a></article>)}</div></section>

    <section className="recommendation-science-boundary ivory"><div><p className="eyebrow dark">Science-to-product boundary</p><h2>A body-system finding is never a product claim.</h2><p>Heart, fertility, pregnancy, kidney, endocrine, digestive, or skin content may explain why a topic matters. It cannot be used to imply that a product prevents disease, removes microplastics from the body, protects a pregnancy, or changes an individual medical outcome.</p></div><div><a href="/science/how-detection-works">How detection works <span>→</span></a><a href="/editorial-policy">Editorial and evidence policy <span>→</span></a><a href="/medical-disclaimer">Medical disclaimer <span>→</span></a></div></section>

    <section className="recommendation-honesty"><div><p className="eyebrow">Selective by design</p><h2>No empty claims. No invented testing.</h2></div><div><p>Purchase links appear only when the product, retailer, claims, disclosure, and evaluation record are complete. Until a product clears that standard, the category guide remains the useful destination.</p><a href="/affiliate-disclosure">Read the affiliate disclosure →</a></div></section>
  </main><Footer/></>;
}

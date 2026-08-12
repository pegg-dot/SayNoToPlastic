import affiliateData from "./affiliate-products.json";

export type AffiliateEvidence = {
  label: string;
  href: string;
};

export type AffiliateProduct = {
  slug: string;
  status: "draft" | "review" | "published" | "retired";
  category: string;
  name: string;
  brand: string;
  summary: string;
  useCase: string;
  tradeoffs: string[];
  evidence: AffiliateEvidence[];
  firsthandStatus: "used" | "inspected" | "documentation-only";
  retailer: string;
  destinationUrl: string;
  relationship: "affiliate" | "sponsored" | "none";
  disclosure: string;
  imageSrc?: string;
  imageAlt?: string;
  priceNote?: string;
  lastReviewed: string;
};

export type AffiliateCategory = {
  slug: string;
  name: string;
  description: string;
  guideSlug: string;
};

export const affiliateCatalog = affiliateData as {
  version: number;
  lastReviewed: string;
  defaultDisclosure: string;
  categories: AffiliateCategory[];
  products: AffiliateProduct[];
};

export const publishedAffiliateProducts = affiliateCatalog.products.filter((product) => product.status === "published");

export function getPublishedAffiliateProduct(slug: string) {
  return publishedAffiliateProducts.find((product) => product.slug === slug);
}

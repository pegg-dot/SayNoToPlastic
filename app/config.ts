import bookProduct from "./content/book-product.json";

const DEFAULT_SITE_URL = "https://saynotoplastic.com";
const DEFAULT_SUPPORT_EMAIL = "WeAreHomoplasticus@gmail.com";

function normalizeSiteUrl(value: string | undefined) {
  const candidate = (value || DEFAULT_SITE_URL).trim().replace(/\/$/, "");
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" || parsed.hostname === "localhost" ? parsed.toString().replace(/\/$/, "") : DEFAULT_SITE_URL;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

function normalizePublicEmail(value: string | undefined) {
  const candidate = (value || DEFAULT_SUPPORT_EMAIL).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : DEFAULT_SUPPORT_EMAIL;
}

/** Final movement identity. Override in preview/deployment without editing source. */
export const SITE_URL = normalizeSiteUrl(
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL : undefined,
);

/** Public-facing support identity. Production readiness requires an explicitly verified inbox. */
export const SUPPORT_EMAIL = normalizePublicEmail(
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SUPPORT_EMAIL || process.env.SUPPORT_EMAIL : undefined,
);

export const BOOK = {
  ...bookProduct,
  amountCents: Math.round(Number(bookProduct.price) * 100),
  purchasePath: "/homo-plasticus",
  // Existing WooCommerce route remains the safe production fallback until native commerce is approved.
  legacyCheckoutUrl: "https://homoplasticus.com/checkout/?add-to-cart=27&quantity=1",
} as const;

export const POLICY_VERSION = "2026-08-06";

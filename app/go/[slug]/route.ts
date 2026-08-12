import { getPublishedAffiliateProduct } from "../../content/affiliate";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getPublishedAffiliateProduct(slug);
  if (!product) return new Response("Recommendation not found.", { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  let destination: URL;
  try {
    destination = new URL(product.destinationUrl);
  } catch {
    return new Response("Recommendation is not configured.", { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  }
  if (destination.protocol !== "https:") return new Response("Recommendation is not configured.", { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  return Response.redirect(destination, 302);
}

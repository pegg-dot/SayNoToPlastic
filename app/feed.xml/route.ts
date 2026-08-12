import { guides } from "../content/guides";
import { bodySystems } from "../content/body-systems";
import { SITE_URL } from "../config";

function xml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);
}

export function GET() {
  const guideItems = guides.map((guide) => {
    const published = new Date(`${guide.publishedDate || "2026-08-03"}T12:00:00Z`).toUTCString();
    return `<item><title>${xml(guide.title)}</title><link>${SITE_URL}/resources/${guide.slug}</link><guid isPermaLink="true">${SITE_URL}/resources/${guide.slug}</guid><description>${xml(guide.description)}</description><category>${xml(guide.category)}</category><pubDate>${published}</pubDate></item>`;
  });
  const scienceItems = bodySystems.map((item) => {
    const published = new Date(`${item.updatedDate}T12:00:00Z`).toUTCString();
    return `<item><title>${xml(item.title)}</title><link>${SITE_URL}/science/body/${item.slug}</link><guid isPermaLink="true">${SITE_URL}/science/body/${item.slug}</guid><description>${xml(item.summary)}</description><category>Body system science</category><pubDate>${published}</pubDate></item>`;
  });
  const methodItems = [
    { title: "How Scientists Detect Microplastics", link: "/science/how-detection-works", description: "Sample collection, laboratory preparation, polymer identification, contamination control, and the limits of detection studies.", category: "Methods" },
    { title: "The Exposome", link: "/science/exposome", description: "A lifetime framework for air, water, food, products, lifestyle, and individual response.", category: "Context" },
    { title: "How to Reduce Your Exposure", link: "/solutions/reduce-exposure", description: "A practical, no-perfection framework for reducing repeated plastic exposure.", category: "Practical action" },
  ].map((item) => `<item><title>${xml(item.title)}</title><link>${SITE_URL}${item.link}</link><guid isPermaLink="true">${SITE_URL}${item.link}</guid><description>${xml(item.description)}</description><category>${item.category}</category><pubDate>Sat, 08 Aug 2026 12:00:00 GMT</pubDate></item>`);
  const items = [...methodItems, ...scienceItems, ...guideItems].join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Say No to Plastic Field Notes</title><link>${SITE_URL}</link><description>Evidence-aware science, body-system context, and practical guidance on microplastics and plastic exposure.</description><language>en-us</language><lastBuildDate>Sat, 08 Aug 2026 12:00:00 GMT</lastBuildDate>${items}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

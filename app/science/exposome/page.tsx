import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { ExposomeMap } from "../../components/ExposomeMap";
import { BodySystemLibrary } from "../../components/BodySystemLibrary";
import { exposomeCategories, exposomeContent } from "../../content/haddad-topics";
import { bodySystems } from "../../content/body-systems";
import { SITE_URL } from "../../config";

export const metadata: Metadata = {
  title: "The Exposome: Lifetime Environmental Exposure | Say No to Plastic",
  description: exposomeContent.description,
  alternates: { canonical: "/science/exposome" },
  openGraph: { title: exposomeContent.title, description: exposomeContent.description, url: `${SITE_URL}/science/exposome`, siteName: "Say No to Plastic", type: "article", images: [{ url: "/evidence.webp", width: 1536, height: 1024, alt: "The exposome and lifetime environmental exposure" }] },
  twitter: { card: "summary_large_image", title: exposomeContent.title, description: exposomeContent.description, images: ["/evidence.webp"] },
};

export default function ExposomePage() {
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: exposomeContent.title, description: exposomeContent.description, dateModified: "2026-08-08", mainEntityOfPage: `${SITE_URL}/science/exposome`, publisher: { "@id": `${SITE_URL}/#organization` } };
  return <><Header skipToContent/><main id="main-content" tabIndex={-1} className="exposome-page">
    <section className="exposome-hero"><div><nav aria-label="Breadcrumb"><a href="/science">Science</a><span>/</span><span>The exposome</span></nav><p className="eyebrow">Lifetime environmental context</p><h1>{exposomeContent.title}</h1><p className="exposome-subtitle">{exposomeContent.subtitle}</p><p>{exposomeContent.description}</p><a className="button gold" href="#map">Explore the five domains <span>↓</span></a></div><aside><span>One exposure</span><i>+</i><span>another</span><i>+</i><span>time</span><strong>Lifetime context</strong></aside></section>
    <section id="map" className="exposome-map-section ivory"><header><p className="eyebrow dark">The model</p><h2>Your health is not shaped by one object or one day.</h2><p>The exposome organizes the world around a person, the cumulative exposure across time, the body's response, and long-term health.</p></header><ExposomeMap /></section>
    <section className="exposome-domains"><header><p className="eyebrow">Five connected domains</p><h2>Use the map to ask better questions.</h2></header><div>{exposomeCategories.map((category, index) => <article key={category.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{category.title}</h3><p>{category.summary}</p><ul>{category.examples.map((example) => <li key={example}>{example}</li>)}</ul><div>{category.related.map((link) => <a key={link.href} href={link.href}>{link.label} <b>→</b></a>)}</div></article>)}</div></section>
    <section className="exposome-response ivory"><div><p className="eyebrow dark">How the body responds</p><h2>Exposure does not act alone.</h2><p>The supplied diagram places genetics, nutrition, exercise, and age between lifetime exposure and long-term health. The same exposure may not have the same meaning for every person or at every life stage.</p></div><ol>{exposomeContent.bodyResponse.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol></section>
    <section className="exposome-closing"><p className="eyebrow">The central idea</p><blockquote>{exposomeContent.closing}</blockquote><small>Concept supplied in {exposomeContent.sourceDocument}. This page is an educational framework, not an individual risk calculator.</small></section>
    <BodySystemLibrary compact items={bodySystems.slice(0, 4)} heading="See how the body-system questions connect" intro="The exposome supplies the wider context; the body-system pages separate what each supplied draft says, what the verified study record establishes, and what remains uncertain." />
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/></>;
}

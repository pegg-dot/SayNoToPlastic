import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { reduceExposureContent, reduceExposureGroups } from "../../content/haddad-topics";
import { SITE_URL } from "../../config";
import { ExposureWorksheet } from "../../components/ExposureWorksheet";

export const metadata: Metadata = {
  title: "How to Reduce Plastic Exposure | Say No to Plastic",
  description: reduceExposureContent.description,
  alternates: { canonical: "/solutions/reduce-exposure" },
  openGraph: { title: reduceExposureContent.title, description: reduceExposureContent.description, url: `${SITE_URL}/solutions/reduce-exposure`, siteName: "Say No to Plastic", type: "article", images: [{ url: "/kitchen.webp", width: 1536, height: 1024, alt: "Practical lower-plastic household choices" }] },
  twitter: { card: "summary_large_image", title: reduceExposureContent.title, description: reduceExposureContent.description, images: ["/kitchen.webp"] },
};

export default function ReduceExposurePage() {
  const schema = { "@context": "https://schema.org", "@type": "HowTo", name: reduceExposureContent.title, description: reduceExposureContent.description, dateModified: "2026-08-08", mainEntityOfPage: `${SITE_URL}/solutions/reduce-exposure`, step: reduceExposureGroups.flatMap((group) => group.actions.map((action) => ({ "@type": "HowToStep", name: group.title, text: action }))) };
  return <><Header skipToContent/><main id="main-content" tabIndex={-1} className="reduce-exposure-page">
    <section className="reduce-exposure-hero"><div><nav aria-label="Breadcrumb"><a href="/solutions">Solutions</a><span>/</span><span>Reduce exposure</span></nav><p className="eyebrow">Practical action</p><h1>{reduceExposureContent.title}</h1><p className="reduce-exposure-subtitle">{reduceExposureContent.subtitle}</p>{reduceExposureContent.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div><a className="button gold" href="#priorities">See the priorities <span>↓</span></a><TrackedLink className="text-link" href="#worksheet" eventName="cta_click" label="reduce-exposure-worksheet">Build a printable plan <span>→</span></TrackedLink></div></div><aside><strong>Progress, not perfection.</strong><p>Start with the highest-frequency plastic contact that is practical to change. Keep medical, hygiene, food-safety, and accessibility needs first.</p></aside></section>
    <section id="priorities" className="reduce-exposure-groups ivory"><header><p className="eyebrow dark">Focus on the biggest sources first</p><h2>Four practical areas, one habit at a time.</h2><p>Not all exposures are equal, and not every household can make the same change. Use the groups below as a decision framework, not a purity test.</p></header><div>{reduceExposureGroups.map((group) => <article id={group.id} key={group.id}><span>{group.number}</span><h3>{group.title}</h3><p>{group.summary}</p><ul>{group.actions.map((action) => <li key={action}>{action}</li>)}</ul><div>{group.links.map((link) => <TrackedLink key={link.href} href={link.href} eventName="cta_click" label={`reduce-${group.id}-${link.label}`}>{link.label} <b>→</b></TrackedLink>)}</div></article>)}</div></section>
    <div id="worksheet" className="exposure-worksheet-anchor"><ExposureWorksheet /></div>
    <section className="reduce-exposure-takeaways"><div><p className="eyebrow">Key takeaways</p><h2>Make the change durable enough to repeat.</h2></div><ol>{reduceExposureContent.takeaways.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol></section>
    <section className="reduce-exposure-reflection ivory"><div><p className="eyebrow dark">Final reflection</p><blockquote>{reduceExposureContent.reflection}</blockquote><small>Editorial source: {reduceExposureContent.sourceDocument}. Practical recommendations remain subject to the site's medical, safety, and evidence boundaries.</small></div><aside><strong>Choose your next route</strong><a href="/solutions#planner">Build a one-change plan <span>→</span></a><a href="/resources">Open the guide library <span>→</span></a><a href="/science/exposome">Understand the exposome <span>→</span></a><a href="/community">Join the field notes <span>→</span></a></aside></section>
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/></>;
}

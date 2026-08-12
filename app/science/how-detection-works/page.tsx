import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { commonPolymers, detectionContent, detectionSteps } from "../../content/haddad-topics";
import { evidenceStudies } from "../../content/evidence";
import { SITE_URL } from "../../config";

export const metadata: Metadata = {
  title: "How Scientists Detect Microplastics | Say No to Plastic",
  description: detectionContent.description,
  alternates: { canonical: "/science/how-detection-works" },
  openGraph: { title: detectionContent.title, description: detectionContent.description, url: `${SITE_URL}/science/how-detection-works`, siteName: "Say No to Plastic", type: "article", images: [{ url: "/evidence.webp", width: 1536, height: 1024, alt: "Laboratory evidence about microplastics" }] },
  twitter: { card: "summary_large_image", title: detectionContent.title, description: detectionContent.description, images: ["/evidence.webp"] },
};

export default function DetectionPage() {
  const methods = Array.from(new Set(evidenceStudies.filter((study) => study.studyType !== "Anatomical context").map((study) => study.method)));
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: detectionContent.title, description: detectionContent.description, dateModified: "2026-08-08", author: { "@type": "Organization", name: "Say No to Plastic" }, mainEntityOfPage: `${SITE_URL}/science/how-detection-works` };
  return <><Header skipToContent/><main id="main-content" tabIndex={-1} className="detection-page">
    <section className="detection-hero"><div><nav aria-label="Breadcrumb"><a href="/science">Science</a><span>/</span><span>Detection</span></nav><p className="eyebrow">Laboratory methods</p><h1>{detectionContent.title}</h1><p className="detection-subtitle">{detectionContent.subtitle}</p><p>{detectionContent.description}</p><div><a className="button gold" href="#steps">See the four steps <span>↓</span></a><TrackedLink className="text-link" href="/science" eventName="cta_click" label="detection-study-record">Open the human study record <span>→</span></TrackedLink></div></div><aside><strong>Detection is the first question.</strong><p>Presence, source, dose, biological response, and disease are separate questions that require separate evidence.</p></aside></section>

    <section id="steps" className="detection-steps ivory"><header><p className="eyebrow dark">The process</p><h2>From biological sample to polymer identification.</h2><p>No single instrument answers every question. A study's method determines what it can measure and what it cannot.</p></header><ol>{detectionSteps.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>

    <section className="detection-reading"><nav aria-label="On this page"><strong>On this page</strong>{detectionContent.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}<a href="#polymers">Common polymers</a><a href="#methods">Methods in the linked studies</a></nav><article>{detectionContent.sections.map((section, index) => <section key={section.id} id={section.id}><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside className="detection-boundary"><p className="eyebrow">The claim ladder</p><h2>Detection is not diagnosis.</h2><div><span>Detected</span><i>→</i><span>Measured exposure</span><i>→</i><span>Biological response</span><i>→</i><span>Human outcome</span><i>→</i><span>Causation</span></div><p>A finding at one step should not be presented as proof at a stronger step.</p></aside></article></section>

    <section id="polymers" className="polymer-library ivory"><div><p className="eyebrow dark">Material identification</p><h2>Common polymer abbreviations.</h2><p>The presence of a polymer name does not identify the exact product that produced the particle. It identifies a material family.</p></div><dl>{commonPolymers.map((polymer) => <div key={polymer.abbreviation}><dt>{polymer.abbreviation}</dt><dd><strong>{polymer.name}</strong><span>{polymer.examples}</span></dd></div>)}</dl></section>

    <section id="methods" className="study-method-index"><div><p className="eyebrow">Methods already named in the verified study record</p><h2>See how the linked human studies were measured.</h2></div><div>{methods.map((method, index) => <article key={method}><span>{String(index + 1).padStart(2, "0")}</span><p>{method}</p></article>)}</div><TrackedLink className="button outline" href="/science" eventName="cta_click" label="detection-open-studies">Read the study-by-study limits <span>→</span></TrackedLink></section>

    <section className="detection-takeaways ivory"><div><p className="eyebrow dark">Key takeaways</p><h2>What to remember when reading a headline.</h2></div><ol>{detectionContent.takeaways.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol><aside><strong>Source and review note</strong><p>{detectionContent.reviewNote}</p><small>Supplied source draft: {detectionContent.sourceDocument}</small></aside></section>
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/></>;
}

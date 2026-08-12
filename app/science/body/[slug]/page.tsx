import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../../components/SiteChrome";
import { TrackedLink } from "../../../components/TrackedLink";
import { BodySystemVisual } from "../../../components/BodySystemVisual";
import { SITE_URL } from "../../../config";
import { bodySystems, getBodySystem } from "../../../content/body-systems";

export function generateStaticParams() {
  return bodySystems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getBodySystem(slug);
  if (!article) return {};
  const title = `${article.title} and Microplastics | Say No to Plastic`;
  return {
    title,
    description: article.summary,
    alternates: { canonical: `/science/body/${article.slug}` },
    openGraph: {
      title,
      description: article.summary,
      url: `${SITE_URL}/science/body/${article.slug}`,
      siteName: "Say No to Plastic",
      type: "article",
      images: [{ url: "/images/science/science-body-overview.webp", width: 1148, height: 767, alt: article.routeLabel }],
    },
    twitter: { card: "summary_large_image", title, description: article.summary, images: ["/images/science/science-body-overview.webp"] },
    robots: article.reviewStatus === "source-review" ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function BodySystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getBodySystem(slug);
  if (!article) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: article.title,
    description: article.summary,
    url: `${SITE_URL}/science/body/${article.slug}`,
    dateModified: article.updatedDate,
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/science#page` },
  };

  return (
    <>
      <Header skipToContent />
      <main id="main-content" tabIndex={-1} className={`body-system-page body-system-page-v24 body-system-page-v25 body-system-page-v26 accent-${article.accent}`}>
        <section className="body-system-hero">
          <div className="body-system-hero-copy">
            <nav aria-label="Breadcrumb"><a href="/science">Science</a><span>/</span><span>{article.navLabel}</span></nav>
            <p className="eyebrow"><span />{article.kicker}</p>
            <h1>{article.title}</h1>
            <p className="body-system-subtitle">{article.subtitle}</p>
            <p className="body-system-deck">{article.summary}</p>
            <div className="body-system-hero-actions"><a className="button gold" href="#overview">Read the overview <span>↓</span></a><TrackedLink className="text-link" href="/science" eventName="cta_click" label={`system-${article.slug}-science`}>Back to Science <span>→</span></TrackedLink></div>
          </div>
          <BodySystemVisual article={article} />
          <aside className="body-system-hero-fact">
            <span>{article.heroFact}</span>
            <p>{article.heroFactLabel}</p>
          </aside>
        </section>

        <section className="body-system-reading">
          <nav className="body-system-inline-nav" aria-label="On this page">
            <strong>On this page</strong>
            {article.sections.map((section, index) => {
              const labels = ["Overview", "Why it matters", "Research", "Meaning"];
              return <a key={section.id} href={`#${section.id}`}>{labels[index] ?? section.title}</a>;
            })}
            <a href="#known-uncertain">Known / uncertain</a>
            <a href="#sources">References</a>
          </nav>
          <article className="body-system-article">
            {article.sections.map((section, index) => (
              <section id={section.id} key={section.id} className="body-system-section">
                <p className="section-index">{String(index + 1).padStart(2, "0")}</p>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}

            <section id="known-uncertain" className="body-system-boundary">
              <div><p className="eyebrow dark">What the material supports</p><h2>What we know</h2><ul>{article.known.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><p className="eyebrow">Still being worked out</p><h2>What we do not know yet</h2><ul>{article.uncertain.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </section>

            <section className="body-system-connections body-system-connections-v24">
              <div><p className="eyebrow dark">Related science</p>{article.relatedEvidence.map((item) => <TrackedLink key={item.href} href={item.href} eventName="cta_click" label={`system-${article.slug}-evidence-${item.label}`}><span>{item.label}</span><b>→</b></TrackedLink>)}</div>
              <div><p className="eyebrow dark">Practical guidance</p>{article.relatedGuides.map((item) => <TrackedLink key={item.href} href={item.href} eventName="cta_click" label={`system-${article.slug}-guide-${item.label}`}><span>{item.label}</span><b>→</b></TrackedLink>)}</div>
            </section>

            <section id="sources" className="body-system-sources body-system-sources-v24">
              <p className="eyebrow dark">References</p>
              <h2>{article.primarySources.length ? "Original sources" : "Source notes"}</h2>
              {article.primarySources.length ? article.primarySources.map((source, index) => (
                <TrackedLink key={source.href} href={source.href} target="_blank" rel="noopener noreferrer" eventName="outbound_source" label={`system-${article.slug}-source-${index + 1}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span><div><strong>{source.label}</strong>{source.note && <p>{source.note}</p>}</div><b>↗</b>
                </TrackedLink>
              )) : <div className="body-system-source-gate"><p>This overview is based on Dr. Haddad&apos;s supplied draft. The original bibliography for several claims is still being assembled before publication signoff.</p></div>}
              {article.reviewStatus !== "verified" && article.primarySources.length > 0 && <p className="body-system-editorial-note">Some broader claims in the supplied draft still require their exact original citations before final publication.</p>}
              <p className="body-system-medical-note">General education only. This page does not diagnose, treat, or replace advice from a qualified healthcare professional. <a href="/medical-disclaimer">Medical disclaimer.</a></p>
            </section>

            <nav className="body-system-return" aria-label="Continue exploring"><a href="/science#body-system-overviews">All body systems <span>→</span></a><a href="/solutions">Practical action <span>→</span></a></nav>
          </article>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

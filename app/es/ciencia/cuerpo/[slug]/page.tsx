import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../../../components/SiteChrome";
import { TrackedLink } from "../../../../components/TrackedLink";
import { BodySystemVisual } from "../../../../components/BodySystemVisual";
import { SITE_URL } from "../../../../config";
import { bodySystemsEs, getBodySystemEs } from "../../../../content/es/body-systems";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return bodySystemsEs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getBodySystemEs(slug);
  if (!article) return {};
  const title = `${article.title} y microplásticos | Say No to Plastic`;
  return {
    title,
    description: article.summary,
    alternates: {
      canonical: `/es/ciencia/cuerpo/${article.slug}`,
      languages: {
        "en-US": `/science/body/${article.slug}`,
        "es-US": `/es/ciencia/cuerpo/${article.slug}`,
      },
    },
    openGraph: {
      title,
      description: article.summary,
      url: `${SITE_URL}/es/ciencia/cuerpo/${article.slug}`,
      siteName: "Say No to Plastic",
      type: "article",
      images: [{ url: "/images/science/science-body-overview.webp", width: 1148, height: 767, alt: article.routeLabel }],
    },
    twitter: { card: "summary_large_image", title, description: article.summary, images: ["/images/science/science-body-overview.webp"] },
    robots: article.reviewStatus === "source-review" ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function BodySystemSpanishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getBodySystemEs(slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: article.title,
    description: article.summary,
    url: `${SITE_URL}/es/ciencia/cuerpo/${article.slug}`,
    dateModified: article.updatedDate,
    inLanguage: "es-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/es/ciencia#page` },
  };

  return (
    <>
      <Header locale="es" skipToContent />
      <main id="main-content" tabIndex={-1} className={`body-system-page body-system-page-v24 body-system-page-v25 body-system-page-v26 accent-${article.accent}`}>
        <section className="body-system-hero">
          <div className="body-system-hero-copy">
            <nav aria-label="Migas de pan"><a href="/es/ciencia">Ciencia</a><span>/</span><span>{article.navLabel}</span></nav>
            <p className="eyebrow"><span />{article.kicker}</p>
            <h1>{article.title}</h1>
            <p className="body-system-subtitle">{article.subtitle}</p>
            <p className="body-system-deck">{article.summary}</p>
            <div className="body-system-hero-actions">
              <a className="button gold" href="#overview">Leer el resumen <span>↓</span></a>
              <TrackedLink className="text-link" href="/es/ciencia" eventName="cta_click" label={`system-es-${article.slug}-science`}>Volver a Ciencia <span>→</span></TrackedLink>
            </div>
          </div>
          <BodySystemVisual article={article} />
          <aside className="body-system-hero-fact">
            <span>{article.heroFact}</span>
            <p>{article.heroFactLabel}</p>
          </aside>
        </section>

        <section className="body-system-reading">
          <nav className="body-system-inline-nav" aria-label="En esta página">
            <strong>En esta página</strong>
            {article.sections.map((section, index) => {
              const labels = ["Resumen", "Por qué importa", "Investigación", "Significado"];
              return <a key={section.id} href={`#${section.id}`}>{labels[index] ?? section.title}</a>;
            })}
            <a href="#known-uncertain">Qué sabemos / qué no</a>
            <a href="#sources">Referencias</a>
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
              <div>
                <p className="eyebrow dark">Lo que respalda el material</p>
                <h2>Lo que sabemos</h2>
                <ul>{article.known.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <p className="eyebrow">Lo que todavía se está resolviendo</p>
                <h2>Lo que aún no sabemos</h2>
                <ul>{article.uncertain.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </section>

            <section className="body-system-connections body-system-connections-v24">
              <div>
                <p className="eyebrow dark">Ciencia relacionada</p>
                {article.relatedEvidence.map((item) => (
                  <TrackedLink key={item.href} href={item.href} eventName="cta_click" label={`system-es-${article.slug}-evidence-${item.label}`}>
                    <span>{item.label}</span><b>→</b>
                  </TrackedLink>
                ))}
              </div>
              <div>
                <p className="eyebrow dark">Orientación práctica</p>
                {article.relatedGuides.map((item) => (
                  <TrackedLink key={item.href} href={item.href} eventName="cta_click" label={`system-es-${article.slug}-guide-${item.label}`}>
                    <span>{item.label}</span><b>→</b>
                  </TrackedLink>
                ))}
              </div>
            </section>

            <section id="sources" className="body-system-sources body-system-sources-v24">
              <p className="eyebrow dark">Referencias</p>
              <h2>{article.primarySources.length ? "Fuentes originales" : "Notas sobre las fuentes"}</h2>
              {article.primarySources.length ? article.primarySources.map((source, index) => (
                <TrackedLink key={source.href} href={source.href} target="_blank" rel="noopener noreferrer" eventName="outbound_source" label={`system-es-${article.slug}-source-${index + 1}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{source.label}</strong>{source.note && <p>{source.note}</p>}</div>
                  <b>↗</b>
                </TrackedLink>
              )) : (
                <div className="body-system-source-gate">
                  <p>Este resumen se basa en el borrador proporcionado por el Dr. Haddad. La bibliografía original de varias afirmaciones todavía se está reuniendo antes de la aprobación final para publicación.</p>
                </div>
              )}
              {article.reviewStatus !== "verified" && article.primarySources.length > 0 && (
                <p className="body-system-editorial-note">Algunas afirmaciones más amplias del borrador proporcionado todavía requieren sus citas originales exactas antes de la publicación final.</p>
              )}
              <p className="body-system-medical-note">
                Solo para educación general. Esta página no diagnostica, trata ni sustituye el consejo de un profesional sanitario cualificado. <a href="/medical-disclaimer">Aviso médico.</a>
              </p>
            </section>

            <nav className="body-system-return" aria-label="Seguir explorando">
              <a href="/es/ciencia#body-system-overviews">Todos los sistemas del cuerpo <span>→</span></a>
              <a href="/es/accion">Acción práctica <span>→</span></a>
            </nav>
          </article>
        </section>
      </main>
      <Footer locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

import type { Metadata } from "next";
import { Footer, Header } from "../../../components/SiteChrome";
import { ExposomeMap } from "../../../components/ExposomeMap";
import { BodySystemLibrary } from "../../../components/BodySystemLibrary";
import { exposomeCategoriesEs, exposomeContentEs } from "../../../content/es/haddad-topics";
import { bodySystemsEs } from "../../../content/es/body-systems";
import { SITE_URL } from "../../../config";

export const metadata: Metadata = {
  title: "El exposoma: exposición ambiental a lo largo de la vida | Say No to Plastic",
  description: exposomeContentEs.description,
  alternates: {
    canonical: "/es/ciencia/exposoma",
    languages: { "en-US": "/science/exposome", "es-US": "/es/ciencia/exposoma" },
  },
  openGraph: {
    title: exposomeContentEs.title,
    description: exposomeContentEs.description,
    url: `${SITE_URL}/es/ciencia/exposoma`,
    siteName: "Say No to Plastic",
    type: "article",
    images: [{ url: "/evidence.webp", width: 1536, height: 1024, alt: "El exposoma y la exposición ambiental a lo largo de la vida" }],
  },
  twitter: { card: "summary_large_image", title: exposomeContentEs.title, description: exposomeContentEs.description, images: ["/evidence.webp"] },
};

export default function ExposomeSpanishPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: exposomeContentEs.title,
    description: exposomeContentEs.description,
    dateModified: "2026-08-08",
    inLanguage: "es-US",
    mainEntityOfPage: `${SITE_URL}/es/ciencia/exposoma`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return <><Header locale="es" skipToContent/><main id="main-content" tabIndex={-1} className="exposome-page">
    <section className="exposome-hero">
      <div>
        <nav aria-label="Migas de pan"><a href="/es/ciencia">Ciencia</a><span>/</span><span>El exposoma</span></nav>
        <p className="eyebrow">Contexto ambiental a lo largo de la vida</p>
        <h1>{exposomeContentEs.title}</h1>
        <p className="exposome-subtitle">{exposomeContentEs.subtitle}</p>
        <p>{exposomeContentEs.description}</p>
        <a className="button gold" href="#map">Explorar los cinco ámbitos <span>↓</span></a>
      </div>
      <aside><span>Una exposición</span><i>+</i><span>otra</span><i>+</i><span>tiempo</span><strong>Contexto de toda la vida</strong></aside>
    </section>

    <section id="map" className="exposome-map-section ivory">
      <header>
        <p className="eyebrow dark">El modelo</p>
        <h2>Tu salud no está determinada por un solo objeto ni por un solo día.</h2>
        <p>El exposoma organiza el mundo que rodea a una persona, la exposición acumulada a lo largo del tiempo, la respuesta del cuerpo y la salud a largo plazo.</p>
      </header>
      <ExposomeMap categories={exposomeCategoriesEs} locale="es" />
    </section>

    <section className="exposome-domains">
      <header><p className="eyebrow">Cinco ámbitos conectados</p><h2>Usa el mapa para hacer mejores preguntas.</h2></header>
      <div>{exposomeCategoriesEs.map((category, index) => <article key={category.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{category.title}</h3><p>{category.summary}</p><ul>{category.examples.map((example) => <li key={example}>{example}</li>)}</ul><div>{category.related.map((link) => <a key={link.href} href={link.href}>{link.label} <b>→</b></a>)}</div></article>)}</div>
    </section>

    <section className="exposome-response ivory">
      <div><p className="eyebrow dark">Cómo responde el cuerpo</p><h2>La exposición no actúa sola.</h2><p>El diagrama proporcionado sitúa la genética, la nutrición, el ejercicio y la edad entre la exposición acumulada y la salud a largo plazo. La misma exposición puede no tener el mismo significado para todas las personas ni en todas las etapas de la vida.</p></div>
      <ol>{exposomeContentEs.bodyResponse.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol>
    </section>

    <section className="exposome-closing">
      <p className="eyebrow">La idea central</p>
      <blockquote>{exposomeContentEs.closing}</blockquote>
      <small>Concepto proporcionado en {exposomeContentEs.sourceDocument}. Esta página es un marco educativo, no una calculadora individual de riesgo.</small>
    </section>

    <BodySystemLibrary
      compact
      locale="es"
      items={bodySystemsEs.slice(0, 4)}
      heading="Cómo se conectan las preguntas por sistemas del cuerpo"
      intro="El exposoma aporta el contexto amplio; las páginas por sistemas separan lo que dice el borrador proporcionado, lo que establece el registro de estudios verificados y lo que sigue siendo incierto."
    />
  </main><Footer locale="es"/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/></>;
}

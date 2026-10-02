import type { Metadata } from "next";
import { Footer, Header } from "../../../components/SiteChrome";
import { TrackedLink } from "../../../components/TrackedLink";
import { commonPolymersEs, detectionContentEs, detectionStepsEs } from "../../../content/es/haddad-topics";
import { evidenceStudiesEs } from "../../../content/es/evidence";
import { SITE_URL } from "../../../config";

export const metadata: Metadata = {
  title: "Cómo detectan los científicos los microplásticos | Say No to Plastic",
  description: detectionContentEs.description,
  alternates: {
    canonical: "/es/ciencia/como-funciona-la-deteccion",
    languages: {
      "en-US": "/science/how-detection-works",
      "es-US": "/es/ciencia/como-funciona-la-deteccion",
    },
  },
  openGraph: {
    title: detectionContentEs.title,
    description: detectionContentEs.description,
    url: `${SITE_URL}/es/ciencia/como-funciona-la-deteccion`,
    siteName: "Say No to Plastic",
    type: "article",
    images: [{ url: "/evidence.webp", width: 1536, height: 1024, alt: "Evidencia de laboratorio sobre microplásticos" }],
  },
  twitter: { card: "summary_large_image", title: detectionContentEs.title, description: detectionContentEs.description, images: ["/evidence.webp"] },
};

export default function DetectionSpanishPage() {
  const methods = Array.from(new Set(evidenceStudiesEs.filter((study) => study.studyType !== "Contexto anatómico").map((study) => study.method)));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: detectionContentEs.title,
    description: detectionContentEs.description,
    dateModified: "2026-08-08",
    inLanguage: "es-US",
    author: { "@type": "Organization", name: "Say No to Plastic" },
    mainEntityOfPage: `${SITE_URL}/es/ciencia/como-funciona-la-deteccion`,
  };

  return <><Header locale="es" skipToContent/><main id="main-content" tabIndex={-1} className="detection-page">
    <section className="detection-hero">
      <div>
        <nav aria-label="Migas de pan"><a href="/es/ciencia">Ciencia</a><span>/</span><span>Detección</span></nav>
        <p className="eyebrow">Métodos de laboratorio</p>
        <h1>{detectionContentEs.title}</h1>
        <p className="detection-subtitle">{detectionContentEs.subtitle}</p>
        <p>{detectionContentEs.description}</p>
        <div>
          <a className="button gold" href="#steps">Ver los cuatro pasos <span>↓</span></a>
          <TrackedLink className="text-link" href="/es/ciencia" eventName="cta_click" label="detection-es-study-record">Abrir el registro de estudios en humanos <span>→</span></TrackedLink>
        </div>
      </div>
      <aside><strong>La detección es la primera pregunta.</strong><p>Presencia, fuente, dosis, respuesta biológica y enfermedad son preguntas distintas que requieren evidencia distinta.</p></aside>
    </section>

    <section id="steps" className="detection-steps ivory">
      <header><p className="eyebrow dark">El proceso</p><h2>De una muestra biológica a la identificación del polímero.</h2><p>Ningún instrumento responde todas las preguntas. El método de un estudio determina qué puede medir y qué no.</p></header>
      <ol>{detectionStepsEs.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
    </section>

    <section className="detection-reading">
      <nav aria-label="En esta página">
        <strong>En esta página</strong>
        {detectionContentEs.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        <a href="#polymers">Polímeros comunes</a>
        <a href="#methods">Métodos en los estudios enlazados</a>
      </nav>
      <article>
        {detectionContentEs.sections.map((section, index) => <section key={section.id} id={section.id}><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
        <aside className="detection-boundary">
          <p className="eyebrow">La escala de afirmaciones</p>
          <h2>Detectar no es diagnosticar.</h2>
          <div><span>Detectado</span><i>→</i><span>Exposición medida</span><i>→</i><span>Respuesta biológica</span><i>→</i><span>Resultado en humanos</span><i>→</i><span>Causalidad</span></div>
          <p>Un hallazgo en un nivel no debe presentarse como prueba de un nivel más fuerte.</p>
        </aside>
      </article>
    </section>

    <section id="polymers" className="polymer-library ivory">
      <div><p className="eyebrow dark">Identificación del material</p><h2>Abreviaturas comunes de polímeros.</h2><p>La presencia del nombre de un polímero no identifica el producto exacto que produjo la partícula. Identifica una familia de materiales.</p></div>
      <dl>{commonPolymersEs.map((polymer) => <div key={polymer.abbreviation}><dt>{polymer.abbreviation}</dt><dd><strong>{polymer.name}</strong><span>{polymer.examples}</span></dd></div>)}</dl>
    </section>

    <section id="methods" className="study-method-index">
      <div><p className="eyebrow">Métodos ya nombrados en el registro verificado de estudios</p><h2>Cómo se midieron los estudios en humanos enlazados.</h2></div>
      <div>{methods.map((method, index) => <article key={method}><span>{String(index + 1).padStart(2, "0")}</span><p>{method}</p></article>)}</div>
      <TrackedLink className="button outline" href="/es/ciencia" eventName="cta_click" label="detection-es-open-studies">Leer las limitaciones estudio por estudio <span>→</span></TrackedLink>
    </section>

    <section className="detection-takeaways ivory">
      <div><p className="eyebrow dark">Puntos clave</p><h2>Qué recordar al leer un titular.</h2></div>
      <ol>{detectionContentEs.takeaways.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
      <aside><strong>Nota sobre fuentes y revisión</strong><p>{detectionContentEs.reviewNote}</p><small>Borrador fuente proporcionado: {detectionContentEs.sourceDocument}</small></aside>
    </section>
  </main><Footer locale="es"/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/></>;
}

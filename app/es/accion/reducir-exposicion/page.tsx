import type { Metadata } from "next";
import { Footer, Header } from "../../../components/SiteChrome";
import { TrackedLink } from "../../../components/TrackedLink";
import { ExposureWorksheet } from "../../../components/ExposureWorksheet";
import { reduceExposureContentEs, reduceExposureGroupsEs } from "../../../content/es/haddad-topics";
import { SITE_URL } from "../../../config";

export const metadata: Metadata = {
  title: "Cómo reducir la exposición al plástico | Say No to Plastic",
  description: reduceExposureContentEs.description,
  alternates: {
    canonical: "/es/accion/reducir-exposicion",
    languages: { "en-US": "/solutions/reduce-exposure", "es-US": "/es/accion/reducir-exposicion" },
  },
  openGraph: {
    title: reduceExposureContentEs.title,
    description: reduceExposureContentEs.description,
    url: `${SITE_URL}/es/accion/reducir-exposicion`,
    siteName: "Say No to Plastic",
    type: "article",
    images: [{ url: "/kitchen.webp", width: 1536, height: 1024, alt: "Opciones prácticas para reducir el uso repetido de plástico" }],
  },
};

export default function ReduceExposureSpanishPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: reduceExposureContentEs.title,
    description: reduceExposureContentEs.description,
    inLanguage: "es-US",
    mainEntityOfPage: `${SITE_URL}/es/accion/reducir-exposicion`,
    step: reduceExposureGroupsEs.flatMap((group) => group.actions.map((action) => ({ "@type": "HowToStep", name: group.title, text: action }))),
  };

  return <>
    <Header locale="es" skipToContent />
    <main id="main-content" tabIndex={-1} className="reduce-exposure-page">
      <section className="reduce-exposure-hero">
        <div>
          <nav aria-label="Migas de pan"><a href="/es/accion">Acción</a><span>/</span><span>Reducir la exposición</span></nav>
          <p className="eyebrow">Acción práctica</p>
          <h1>{reduceExposureContentEs.title}</h1>
          <p className="reduce-exposure-subtitle">{reduceExposureContentEs.subtitle}</p>
          {reduceExposureContentEs.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div><a className="button gold" href="#priorities">Ver las prioridades <span>↓</span></a><TrackedLink className="text-link" href="#worksheet" eventName="cta_click" label="reduce-exposure-es-worksheet">Crear un plan imprimible <span>→</span></TrackedLink></div>
        </div>
        <aside><strong>Se trata de reducir, no de alcanzar la perfección.</strong><p>Empieza por el contacto con plástico que ocurre con mayor frecuencia y que sea práctico cambiar. Mantén primero las necesidades médicas, de higiene, seguridad alimentaria y accesibilidad.</p></aside>
      </section>

      <section id="priorities" className="reduce-exposure-groups ivory">
        <header><p className="eyebrow dark">Concéntrate primero en las fuentes más importantes</p><h2>Cuatro áreas prácticas, un hábito a la vez.</h2><p>No todas las exposiciones son iguales y no todos los hogares pueden hacer el mismo cambio. Usa estos grupos como marco de decisión y haz un cambio realista a la vez.</p></header>
        <div>{reduceExposureGroupsEs.map((group) => <article id={group.id} key={group.id}><span>{group.number}</span><h3>{group.title}</h3><p>{group.summary}</p><ul>{group.actions.map((action) => <li key={action}>{action}</li>)}</ul><div>{group.links.map((link) => <TrackedLink key={link.href} href={link.href} eventName="cta_click" label={`reduce-es-${group.id}-${link.label}`}>{link.label} <b>→</b></TrackedLink>)}</div></article>)}</div>
      </section>

      <div id="worksheet" className="exposure-worksheet-anchor"><ExposureWorksheet locale="es" /></div>

      <section className="reduce-exposure-takeaways"><div><p className="eyebrow">Ideas clave</p><h2>Haz que el cambio sea suficientemente duradero para repetirlo.</h2></div><ol>{reduceExposureContentEs.takeaways.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol></section>

      <section className="reduce-exposure-reflection ivory"><div><p className="eyebrow dark">Reflexión final</p><blockquote>{reduceExposureContentEs.reflection}</blockquote><small>Fuente editorial: {reduceExposureContentEs.sourceDocument}. Las recomendaciones prácticas siguen sujetas a los límites médicos, de seguridad y de evidencia del sitio.</small></div><aside><strong>Elige tu siguiente ruta</strong><a href="/es/accion#planner">Crear un plan de un solo cambio <span>→</span></a><a href="/es/guia-12-pasos">Abrir la guía de 12 pasos <span>→</span></a><a href="/resources">Abrir la biblioteca de guías (en inglés) <span>→</span></a><a href="/es/ciencia/exposoma">Entender el exposoma <span>→</span></a></aside></section>
    </main>
    <Footer locale="es" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  </>;
}

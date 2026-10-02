import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { CheckoutButton } from "../../components/CheckoutButton";
import { BOOK } from "../../config";

export const dynamic = "force-dynamic";

const description = `${BOOK.title}: una investigación para lectores generales sobre el plástico, la evidencia humana emergente y las formas prácticas de reducir la exposición.`;

export const metadata: Metadata = {
  title: `${BOOK.title}, el libro | ${BOOK.author}`,
  description,
  alternates: {
    canonical: "/es/homo-plasticus",
    languages: { "en-US": "/homo-plasticus", "es-US": "/es/homo-plasticus" },
  },
  openGraph: {
    title: `${BOOK.title} | ${BOOK.author}`,
    description,
    url: "/es/homo-plasticus",
    siteName: "Say No to Plastic",
    type: "book",
    images: [{ url: "/book-official.webp", width: 1122, height: 1402, alt: `${BOOK.title} de ${BOOK.author}` }],
  },
};

const faq = [
  { q: "¿Qué formato tiene la edición actual?", a: "La edición actual es un ebook digital que se entrega después de completar la compra." },
  { q: "¿El libro está escrito para científicos?", a: "No. Está pensado para lectores generales que quieren entender con claridad la ciencia, el contexto histórico y las respuestas prácticas." },
  { q: "¿El libro ofrece consejo médico?", a: "No. Es educación pública y no diagnostica, trata ni sustituye la orientación de un profesional de salud cualificado." },
  { q: "¿Qué ocurre después de la compra?", a: "Después de confirmar el pago, la página de compra ofrece acceso seguro y se envía un correo de acceso a la dirección utilizada durante la compra." },
  { q: "¿Qué pasa si pierdo el correo o enlace de descarga?", a: "Usa la página de recuperación de acceso con el correo de compra. Los problemas técnicos reales también pueden enviarse al soporte sin volver a comprar el libro." },
];

const territories = [
  { label: "Orígenes", title: "La era del plástico", body: "Cómo un material creado para durar se integró en la comodidad moderna y en sistemas cotidianos." },
  { label: "Fragmentación", title: "De objetos a partículas", body: "Cómo los plásticos más grandes se degradan y fragmentan en microplásticos y nanoplásticos." },
  { label: "Exposición", title: "Cómo llega el plástico hasta nosotros", body: "Las rutas repetidas que lo ponen en contacto con lo que respiramos, bebemos, comemos, guardamos, calentamos y manipulamos." },
  { label: "Evidencia humana", title: "Lo que están encontrando los investigadores", body: "Qué reportan los estudios humanos en sangre y tejidos, junto con los límites de lo que esos hallazgos pueden demostrar hoy." },
  { label: "Vida diaria", title: "Qué puede cambiar ahora", body: "Formas prácticas de reducir la exposición repetida sin convertir la prevención en un estándar imposible." },
  { label: "Respuesta más amplia", title: "Qué viene después", body: "Cómo las decisiones individuales, las decisiones públicas y las políticas pueden influir en la historia del plástico." },
];

export default function BookSpanishPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: BOOK.title,
    author: { "@type": "Person", name: BOOK.author },
    inLanguage: "es-US",
    url: "https://saynotoplastic.com/es/homo-plasticus",
  };

  return <>
    <Header locale="es" />
    <main id="main-content" tabIndex={-1} className="inner-page book-detail-page">
      <section className="book-page-hero">
        <div className="book-page-visual"><img src="/book-official.webp" width="1100" height="1375" alt={`Portada de ${BOOK.title}`} /></div>
        <div>
          <p className="eyebrow">El libro</p>
          <h1 aria-label={BOOK.title}>Homo<br/>Plasticus</h1>
          <p className="book-subtitle">{BOOK.subtitle}</p>
          <p className="book-byline">{BOOK.author}<br/><span>Con la colaboración de {BOOK.collaborator}</span></p>
          <div className="book-purchase-line"><strong>${BOOK.price}</strong><span>{BOOK.format}<br/>Acceso digital inmediato</span></div>
          <CheckoutButton className="button gold" label="book-page-es-hero">Obtener el ebook <span>↗</span></CheckoutButton>
          <small>Pago seguro mediante el sistema de compra configurado. El acceso se entrega después de confirmar el pago. <a href="/refunds-and-returns">Leer la política.</a></small>
          <div className="book-access-help"><a href="/purchase/recover">Recuperar acceso al ebook →</a><a href="/contact">Obtener soporte técnico →</a></div>
        </div>
      </section>

      <section className="book-premise ivory">
        <div className="section-number">01</div>
        <div>
          <p className="eyebrow dark">Por qué este libro</p>
          <h2>Construimos un mundo alrededor del plástico. Después, el plástico entró en nosotros.</h2>
          <p><em>{BOOK.title}</em> sigue la historia de un material celebrado por su conveniencia a medida que se fragmenta y aparece en el agua, los alimentos, el aire y las preguntas centrales de la biología humana. Reúne contexto histórico, evidencia humana emergente y respuestas prácticas para lectores generales.</p>
        </div>
        <blockquote>“La pregunta ya no es solo si el plástico está dentro de nosotros. La pregunta es qué elegimos hacer con ese conocimiento.”</blockquote>
      </section>

      <section className="book-journey book-territory-section">
        <div className="book-territory-intro">
          <p className="eyebrow">Una investigación más amplia</p>
          <h2>El libro va mucho más allá de un resumen en cuatro partes.</h2>
          <p>Este es un mapa de lectura, no el índice del libro. Muestra el territorio de la investigación sin reducirla a unas pocas etiquetas.</p>
        </div>
        <div className="book-territory-grid">
          {territories.map((item)=><article key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
        </div>
      </section>

      <section className="book-science-bridge ivory">
        <div>
          <p className="eyebrow dark">Profundiza después del libro</p>
          <h2>Explora la evidencia directamente.</h2>
          <p>El libro ofrece la narrativa amplia. La sección de Ciencia reúne estudios detallados, contexto por sistemas del cuerpo y métodos de laboratorio cuando quieras profundizar.</p>
        </div>
        <nav aria-label="Enlaces científicos desde el libro">
          <a href="/es/ciencia"><span>01</span><strong>Estudios en humanos</strong><b>→</b></a>
          <a href="/es/ciencia"><span>02</span><strong>Sistemas del cuerpo</strong><b>→</b></a>
          <a href="/science/how-detection-works"><span>03</span><strong>Cómo funciona la detección</strong><b>→</b></a>
        </nav>
      </section>

      <section className="book-faq">
        <p className="eyebrow">Antes de comprar</p>
        <h2>Preguntas sobre la edición digital</h2>
        {faq.map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
      </section>

      <section className="page-cta book-final-cta">
        <p className="eyebrow">Comienza la investigación completa</p>
        <h2>{BOOK.title}</h2>
        <p>{BOOK.subtitle}</p>
        <strong>${BOOK.price}</strong>
        <CheckoutButton className="button gold" label="book-page-es-final">Obtener acceso inmediato <span>↗</span></CheckoutButton>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    </main>
    <Footer locale="es" />
  </>;
}

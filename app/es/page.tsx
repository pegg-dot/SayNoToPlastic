import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { BodyJourney } from "../components/BodyJourney";
import { HomeRevealObserver } from "../components/HomeRevealObserver";
import { coreRulesEs } from "../content/es/actions";
import { BOOK } from "../config";
import { TrackedLink } from "../components/TrackedLink";
import { CheckoutButton } from "../components/CheckoutButton";
import { MatterField } from "../components/MatterField";
import { ExposureRouteVisual, type ExposureRouteVisualKind } from "../components/ExposureRouteVisual";
import { BEYOND_PLASTIC } from "../content/publications";
import homeStyles from "../home-additions.module.css";
import { SignupForm } from "../components/SignupForm";

export const dynamic = "force-dynamic";

const description = "Una plataforma dirigida por un médico que traduce la investigación sobre microplásticos y nanoplásticos en pasos prácticos para proteger la salud humana y las futuras generaciones.";

export const metadata: Metadata = {
  alternates: {
    canonical: "/es",
    languages: { "en-US": "/", "es-US": "/es" },
  },
  title: "Say No To Plastic | Microplásticos, salud humana y acción práctica",
  description,
  openGraph: {
    title: "Say No To Plastic | Microplásticos, salud humana y acción práctica",
    description,
    url: "/es",
    siteName: "Say No to Plastic",
    type: "website",
    images: [{ url: "/sntp-social-share.webp", width: 1200, height: 630, alt: "Say No to Plastic — ciencia, claridad y acción práctica" }],
  },
};

const exposureRoutes: Array<{ number: string; name: string; kind: ExposureRouteVisualKind; text: string; href: string; linkLabel: string }> = [
  { number: "01", name: "Aire", kind: "air", text: "Las fibras sintéticas y el polvo interior pueden formar parte del aire que respiramos cada día.", href: "/resources/microplastics-indoor-dust", linkLabel: "Abrir la guía de aire interior" },
  { number: "02", name: "Agua", kind: "water", text: "Se ha medido plástico en agua embotellada, agua del grifo y en los sistemas que llevan el agua hasta nosotros.", href: "/resources/microplastics-drinking-water-filter-guide", linkLabel: "Abrir la guía de agua" },
  { number: "03", name: "Almacenamiento de alimentos", kind: "food", text: "Los envases y recipientes de plástico crean un contacto repetido con lo que comemos.", href: "/es/accion", linkLabel: "Ver acciones prácticas" },
  { number: "04", name: "Calor", kind: "heat", text: "Calentar alimentos en plástico es uno de los lugares más claros donde se puede hacer un cambio práctico.", href: "/resources/heating-food-in-plastic", linkLabel: "Abrir la guía sobre calor" },
  { number: "05", name: "Moda rápida", kind: "textiles", text: "La ropa sintética puede liberar microfibras plásticas durante el uso, el lavado y a través del polvo interior.", href: "/resources/synthetic-clothing-microfibers", linkLabel: "Abrir la guía sobre ropa" },
  { number: "06", name: "Cuidado personal", kind: "personal-care", text: "Los productos de cuidado personal y sus envases merecen la misma atención deliberada que los materiales en contacto con alimentos.", href: "/es/accion", linkLabel: "Ver el marco de reducción" },
];

export default function SpanishHome() {
  return (
    <>
      <Header locale="es" />
      <main id="main-content" tabIndex={-1} className="home-v2">
        <HomeRevealObserver />

        <section id="top" className="hp-hero">
          <MatterField className="hp-hero-field" density={74} />
          <div className="hp-hero-shade" />
          <picture className="hp-hero-approved-art">
            <source media="(max-width: 767px)" srcSet="/hero-mobile.webp"/>
            <img src="/hero-desktop.webp" width="1536" height="980" fetchPriority="high" alt=""/>
          </picture>
          <div className="hp-hero-copy">
            <p className="eyebrow"><span />Dirigido por un médico · basado en evidencia</p>
            <h1><em>El contaminante más peligroso es el que ya está dentro de nosotros.</em></h1>
            <p className="hp-hero-deck">Evidencia humana explicada con claridad, seguida de lugares prácticos por donde empezar.</p>
            <div className="hp-hero-actions">
              <CheckoutButton className="button gold" label="homepage-es-hero">Obtener el ebook · ${BOOK.price} <span>↗</span></CheckoutButton>
              <a className="text-link" href="#evidence">Explorar la evidencia <span>↓</span></a>
            </div>
          </div>
          <div className="hp-hero-index"><span>01</span><p>Ciencia · Claridad · Acción</p></div>
        </section>

        <BodyJourney locale="es" />

        <section id="join" className="hp-join">
          <div className="hp-join-copy" data-reveal>
            <div className="hp-section-index light"><span>07</span><p>Mantente conectado</p></div>
            <p className="eyebrow">Field Notes / Boletín</p>
            <h2>Mantente cerca de la investigación.</h2>
            <p>Recibe nuevos resúmenes de investigación, orientación práctica para reducir la exposición, noticias del libro y actualizaciones del proyecto.</p>
            <SignupForm locale="es" buttonLabel="Únete al movimiento" successTitle="Ya estás dentro." successText="Tu suscripción está activa. No necesitas confirmar por correo electrónico." />
          </div>
        </section>

        <section id="exposure" className="exposure-section">
          <header data-reveal>
            <div className="hp-section-index light"><span>03</span><p>Cómo llega hasta nosotros</p></div>
            <p className="eyebrow">Rutas cotidianas</p>
            <h2>La exposición forma parte de la vida ordinaria.</h2>
            <p>Empieza por entender los lugares cotidianos donde el plástico entra en contacto con tu cuerpo, tu hogar y las cosas que usas con más frecuencia.</p>
          </header>
          <div className="exposure-marquee" aria-hidden="true"><span>AIRE · AGUA · ALIMENTOS · CALOR · TEXTILES · CUIDADO PERSONAL · AIRE · AGUA</span></div>
          <div className="exposure-grid">
            {exposureRoutes.map((route) => (
              <article key={route.number} data-reveal>
                <ExposureRouteVisual kind={route.kind} locale="es" />
                <span>{route.number}</span>
                <h3>{route.name}</h3>
                <p>{route.text}</p>
                <TrackedLink href={route.href} eventName="cta_click" label={`home-es-exposure-${route.kind}`}>{route.linkLabel} <b>→</b></TrackedLink>
              </article>
            ))}
          </div>
          <aside className="home-progress-note" data-reveal>
            <span>Progreso, no perfección.</span>
            <p>No necesitas eliminar cada pieza de plástico. Empieza por una fuente repetida que sea práctico cambiar y mantén ese cambio el tiempo suficiente para que se convierta en rutina.</p>
            <TrackedLink href="/es/accion" eventName="cta_click" label="home-es-progress">Elegir un cambio <b>→</b></TrackedLink>
          </aside>
        </section>

        <section id="solutions" className="hp-actions ivory">
          <div className="hp-actions-visual" aria-label="Tres reglas sencillas para empezar">
            <p className="eyebrow dark">Empieza aquí</p>
            <h3>Primero: usa menos plástico.</h3>
            <ol>{coreRulesEs.map((rule) => <li key={rule.number}><span>{rule.number}</span><strong>{rule.title}</strong><small>{rule.detail}</small></li>)}</ol>
          </div>
          <div className="hp-actions-copy" data-reveal>
            <div className="hp-section-index"><span>04</span><p>Acción práctica</p></div>
            <h2>Empieza por el plástico que usas alrededor de alimentos y bebidas todos los días.</h2>
            <p className="lead">Elige una rutina para cambiar primero.</p>
            <TrackedLink className="button navy hp-actions-cta" href="/es/accion" eventName="cta_click" label="home-es-solutions">Elegir el siguiente cambio <span>→</span></TrackedLink>
          </div>
        </section>

        <section className={homeStyles.bookFeature} aria-labelledby="home-book-title">
          <figure className={homeStyles.bookVisual} data-reveal>
            <img src="/book-official.webp" width="1122" height="1402" loading="lazy" alt={`Libro ${BOOK.title} de ${BOOK.author}`} />
          </figure>
          <div className={homeStyles.bookCopy} data-reveal>
            <p className={homeStyles.eyebrow}>El libro</p>
            <h2 id="home-book-title">Homo Plasticus</h2>
            <p className={homeStyles.bookLead}>Una investigación dirigida por un médico sobre cómo el plástico pasó del medio ambiente a la conversación sobre salud humana.</p>
            <p>Descubre la historia más amplia detrás de la investigación, las rutas de exposición, las respuestas prácticas y las decisiones que vienen después.</p>
            <div className={homeStyles.bookMeta}><strong>${BOOK.price}</strong><span>Ebook digital · acceso inmediato</span></div>
            <div className={homeStyles.bookActions}>
              <CheckoutButton className="button gold" label="homepage-es-book">Obtener el ebook <span>↗</span></CheckoutButton>
              <TrackedLink className={homeStyles.bookLink} href="/es/homo-plasticus" eventName="cta_click" label="home-es-book-details">Explorar el libro <span>→</span></TrackedLink>
            </div>
          </div>
        </section>

        <section id="about" className="hp-author ivory">
          <div className="hp-author-copy" data-reveal>
            <div className="hp-section-index"><span>06</span><p>El autor</p></div>
            <p className="eyebrow dark">Detrás de la investigación</p>
            <h2>Un médico siguiendo una señal que suele pasar desapercibida.</h2>
            <p>Elie R. Haddad, MD, es cardiólogo y electrofisiólogo cardíaco con más de dos décadas de experiencia clínica. Homo Plasticus comenzó con una pregunta capaz de cambiar la medicina: ¿qué influencia ambiental estamos pasando por alto?</p>
            <TrackedLink className="button navy" href="/es/sobre-dr-elie-haddad" eventName="cta_click" label="home-es-about">Conocer al Dr. Haddad <span>→</span></TrackedLink>
          </div>
          <figure className="hp-author-portrait" data-reveal>
            <img src="/portrait.webp" width="900" height="1024" loading="lazy" alt="Elie R. Haddad, MD, sentado en su oficina" />
            <figcaption><strong>Elie R. Haddad, MD</strong><span>Cardiólogo · Electrofisiólogo cardíaco · Autor</span></figcaption>
          </figure>
        </section>

        <section className={homeStyles.podcastFeature} aria-labelledby="home-podcast-title">
          <figure className={homeStyles.art} data-reveal><img src={BEYOND_PLASTIC.artwork} width="1200" height="1200" loading="lazy" alt={BEYOND_PLASTIC.artworkAlt} /><figcaption>Beyond Plastic · Where Science Meets Consciousness</figcaption></figure>
          <div className={homeStyles.copy} data-reveal>
            <p className={homeStyles.eyebrow}>Beyond Plastic</p>
            <h2 id="home-podcast-title"><em>Where Science Meets Consciousness</em></h2>
            <p className={homeStyles.lead}>Un podcast que explora las ideas que moldean nuestra salud, nuestra vida y, en última instancia, nuestra humanidad.</p>
            <p>Comienza con <strong>The Plastic Age</strong> y va mucho más allá.</p>
            <TrackedLink className={homeStyles.cta} href="/es/podcast" eventName="cta_click" label="home-es-podcast">Explorar el podcast <span>→</span></TrackedLink>
          </div>
        </section>

        <section className={homeStyles.tedxFeature} aria-labelledby="home-tedx-title">
          <div className={homeStyles.tedxRule}><span>TEDxMiami</span></div>
          <div className={homeStyles.tedxCopy} data-reveal>
            <p className={homeStyles.tedxEyebrow}>Ver la charla TEDx</p>
            <h2 id="home-tedx-title">La herencia invisible de los nanoplásticos</h2>
            <p>¿Qué ocurre cuando un contaminante ambiental se convierte en parte de la historia humana?</p>
            <TrackedLink className={homeStyles.tedxCta} href="/es/tedx" eventName="cta_click" label="home-es-tedx">Ver la charla <span>→</span></TrackedLink>
          </div>
        </section>

        <section className="hp-media-bridge" aria-labelledby="home-es-media-title">
          <div data-reveal>
            <p className="eyebrow">Eventos y medios</p>
            <h2 id="home-es-media-title">Sigue la conversación pública.</h2>
            <p>Charlas, entrevistas, apariciones públicas y recursos de prensa viven en un centro de medios dedicado.</p>
          </div>
          <aside data-reveal>
            <strong>Centro de medios</strong>
            <p>Explora apariciones verificadas y recursos de prensa.</p>
            <TrackedLink className="button gold" href="/media" eventName="cta_click" label="home-es-media">Abrir Eventos y Medios <span>→</span></TrackedLink>
          </aside>
        </section>

      </main>
      <Footer locale="es" />
    </>
  );
}

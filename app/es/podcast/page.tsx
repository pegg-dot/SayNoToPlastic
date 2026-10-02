import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { BEYOND_PLASTIC } from "../../content/publications";
import { getEffectivePodcastPlatforms } from "../../lib/publication-overrides";
import styles from "../../podcast/podcast.module.css";

export const dynamic = "force-dynamic";

const description = "Beyond Plastic: Where Science Meets Consciousness es el podcast del Dr. Elie Haddad sobre salud, medicina, experiencia humana y las fuerzas que moldean cómo vivimos.";

export const metadata: Metadata = {
  title: "Podcast Beyond Plastic | Say No to Plastic",
  description,
  alternates: {
    canonical: "/es/podcast",
    languages: { "en-US": "/podcast", "es-US": "/es/podcast" },
  },
  openGraph: {
    title: "Beyond Plastic: Where Science Meets Consciousness",
    description,
    url: "/es/podcast",
    siteName: "Say No to Plastic",
    type: "website",
    images: [{ url: BEYOND_PLASTIC.artwork, width: 1200, height: 1200, alt: BEYOND_PLASTIC.artworkAlt }],
  },
};

export default async function PodcastSpanishPage() {
  const platforms = await getEffectivePodcastPlatforms();

  return <><Header locale="es" /><main id="main-content" tabIndex={-1} className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <figure className={styles.artworkWrap}>
        <div className={styles.artworkHalo} aria-hidden="true" />
        <img className={styles.artwork} src={BEYOND_PLASTIC.artwork} width="1200" height="1200" alt={BEYOND_PLASTIC.artworkAlt} fetchPriority="high" />
        <figcaption>Beyond Plastic · Dr. Elie Haddad</figcaption>
      </figure>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>Un podcast del Dr. Elie Haddad</p>
        <h1><span>Beyond Plastic:</span> Where Science Meets Consciousness</h1>
        <p className={styles.lead}>Beyond Plastic es un podcast sobre las ideas que moldean nuestra salud, nuestra vida y, en última instancia, nuestra humanidad.</p>
        <p>Conducido por el cardiólogo Dr. Elie Haddad, cada serie explora una pregunta diferente a través de la ciencia, la medicina, la experiencia humana y la conciencia, y examina fuerzas más profundas que influyen en la forma en que vivimos.</p>
      </div>
    </section>

    <section className={styles.story}>
      <div className={styles.storyIndex}><span>01</span><p>Serie actual</p></div>
      <div className={styles.storyCopy}>
        <p className={styles.eyebrow}>The Plastic Age</p>
        <h2>El recorrido comienza con el plástico. No termina allí.</h2>
        <p>Nuestra primera serie, The Plastic Age, sigue la historia de cómo el plástico transformó nuestro mundo, entró en nuestros cuerpos y se convirtió en uno de los desafíos que definen nuestra época.</p>
        <p>Las futuras series irán más allá del plástico hacia otras preguntas sobre salud, bienestar, medio ambiente y lo que significa vivir conscientemente en un mundo que cambia con rapidez.</p>
      </div>
      <aside className={styles.storyAside}>
        <strong>Una serie, no una lista de episodios</strong>
        <p>Este sitio presenta el podcast en conjunto. Los episodios individuales permanecen en las plataformas de escucha, donde se puede explorar cada serie completa.</p>
      </aside>
    </section>

    <section className={styles.listen} aria-labelledby="listen-title">
      <header><p className={styles.eyebrowLight}>Escucha Beyond Plastic</p><h2 id="listen-title">Elige tu plataforma preferida.</h2></header>
      <div className={styles.platformGrid}>
        {platforms.map((platform,index)=><TrackedLink key={platform.name} className={styles.platformCard} href={platform.href} eventName="cta_click" label={`podcast-es-${platform.name.toLowerCase().replace(/\s+/g,"-")}`} target="_blank" rel="noreferrer"><span>{String(index+1).padStart(2,"0")}</span><div><strong>{platform.name}</strong></div><b aria-hidden="true">↗</b></TrackedLink>)}
      </div>
    </section>

    <section className={styles.bridge}>
      <div><p className={styles.eyebrow}>Una plataforma, varias formas de entrar</p><h2>La ciencia es la base. La conversación amplía las preguntas.</h2></div>
      <div className={styles.bridgeLinks}><TrackedLink href="/es/ciencia" eventName="cta_click" label="podcast-es-science">Explorar la ciencia <span>→</span></TrackedLink><TrackedLink href="/es/sobre-dr-elie-haddad" eventName="cta_click" label="podcast-es-about">Conocer al Dr. Haddad <span>→</span></TrackedLink></div>
    </section>
  </main><Footer locale="es" /></>;
}

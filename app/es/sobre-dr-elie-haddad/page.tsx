import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import styles from "../../about-dr-elie-haddad/about.module.css";

export const dynamic = "force-dynamic";

const description = "Conoce a Elie R. Haddad, MD, cardiólogo y electrofisiólogo cardíaco detrás de Say No to Plastic y Homo Plasticus.";

export const metadata: Metadata = {
  title: "Dr. Elie R. Haddad | Say No to Plastic",
  description,
  alternates: {
    canonical: "/es/sobre-dr-elie-haddad",
    languages: { "en-US": "/about-dr-elie-haddad", "es-US": "/es/sobre-dr-elie-haddad" },
  },
  openGraph: {
    title: "Dr. Elie R. Haddad | Say No to Plastic",
    description,
    url: "/es/sobre-dr-elie-haddad",
    siteName: "Say No to Plastic",
    type: "profile",
    images: [{ url: "/portrait.webp", width: 900, height: 1024, alt: "Elie R. Haddad, MD" }],
  },
};

const story = [
  {
    title: "Práctica clínica",
    body: "La cardiología y la electrofisiología cardíaca fueron el punto de partida: ver la enfermedad de cerca, tratarla y preguntarse qué factores podrían estar pasando desapercibidos antes de que aparezca.",
  },
  {
    title: "Una pregunta más amplia",
    body: "La atención se amplió más allá del tratamiento hacia las influencias repetidas que rodean la vida cotidiana: aire, agua, alimentos, productos, hábitos y los entornos por los que las personas pasan con el tiempo.",
  },
  {
    title: "La investigación sobre microplásticos",
    body: "La investigación emergente que reporta material derivado del plástico en sangre y tejidos humanos llevó esa pregunta más lejos. Detectar algo no demuestra automáticamente una enfermedad, pero sí crea un cuerpo de evidencia que merece ser explicado con cuidado.",
  },
  {
    title: "Educación pública",
    body: "La investigación se convirtió en Homo Plasticus, una charla TEDx y Say No to Plastic: un espacio para traducir evidencia en evolución a una orientación clara y práctica sin exagerar lo que la ciencia puede demostrar.",
  },
];

export default function AboutSpanishPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Elie R. Haddad, MD",
    jobTitle: "Cardiólogo y electrofisiólogo cardíaco",
    description,
    url: "/es/sobre-dr-elie-haddad",
    inLanguage: "es-US",
  };

  return (
    <>
      <Header locale="es" skipToContent />
      <main id="main-content" className={styles.page} tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="about-title">
          <figure className={styles.portrait}>
            <div className={styles.portraitFrame}>
              <img src="/portrait.webp" width="900" height="1024" alt="Elie R. Haddad, MD, sentado en una oficina con ropa médica oscura" />
            </div>
            <figcaption><span>Elie R. Haddad, MD</span><span>Cardiólogo · Electrofisiólogo cardíaco</span></figcaption>
          </figure>

          <div className={styles.heroCopy}>
            <p className="eyebrow">Detrás de la ciencia</p>
            <h1 id="about-title">Conoce al Dr. Elie Haddad</h1>
            <p className={styles.heroLead}>El Dr. Elie R. Haddad es cardiólogo y electrofisiólogo cardíaco con más de dos décadas de experiencia clínica, además de autor, educador y conferencista TEDx.</p>
            <p className={styles.heroLead}>Say No to Plastic nació de una pregunta médica: ¿qué influencias ambientales estamos pasando por alto cuando la enfermedad aparece antes, con mayor frecuencia o en personas que no encajan con el patrón esperado?</p>
            <div className={styles.credentials} aria-label="Funciones profesionales">
              <span>Cardiólogo</span><span>Electrofisiólogo cardíaco</span><span>Autor</span><span>Conferencista TEDx</span>
            </div>
            <div className={styles.heroActions}>
              <a className="button gold" href="#why">Leer su historia <span>↓</span></a>
              <TrackedLink className={styles.textAction} href="/media" eventName="cta_click" label="about-es-media">Eventos y medios (en inglés) <span>→</span></TrackedLink>
            </div>
          </div>
        </section>

        <section id="why" className={styles.reason} aria-labelledby="why-title">
          <p className={styles.sectionIndex}>01 · Por qué le importa</p>
          <div className={styles.sectionCopy}>
            <h2 id="why-title">La pregunta comenzó en la consulta.</h2>
            <p>Años cuidando a personas con enfermedad cardiovascular hicieron que el Dr. Haddad se interesara no solo por cómo se trata una enfermedad, sino por qué aparece y qué podría prevenirse.</p>
            <p>Esa investigación se amplió desde la genética y el estilo de vida hacia el mundo que nos rodea. Los microplásticos se convirtieron en una parte de una pregunta mucho más amplia sobre la exposición ambiental repetida a lo largo de la vida.</p>
          </div>
        </section>

        <section className={styles.story} aria-labelledby="story-title">
          <div className={styles.storyHeading}>
            <div><p className={styles.sectionIndex}>02 · El camino</p><h2 id="story-title">De la cardiología a la investigación ambiental.</h2></div>
            <p>El trabajo clínico llevó a una pregunta más amplia; esa pregunta llevó a la investigación, y la investigación llevó a la educación pública.</p>
          </div>
          <div className={styles.storyRows}>
            {story.map((item, index) => (
              <article className={styles.storyRow} key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="work-title">
          <div className={styles.closingCopy}>
            <p className={styles.sectionIndex}>03 · El trabajo ahora</p>
            <h2 id="work-title">Traducir la evidencia. Mantener visible la incertidumbre.</h2>
            <p>A través de Say No to Plastic, el Dr. Haddad conecta investigación humana emergente con orientación práctica para reducir la exposición, manteniendo separadas la detección, la asociación y la causalidad.</p>
          </div>

          <nav className={styles.linkList} aria-label="Explorar el trabajo del Dr. Haddad">
            <TrackedLink href="/es/ciencia" eventName="cta_click" label="about-es-science">Explorar la ciencia <span>→</span></TrackedLink>
            <TrackedLink href="/es/homo-plasticus" eventName="cta_click" label="about-es-book">Explorar Homo Plasticus <span>→</span></TrackedLink>
            <TrackedLink href="/es/tedx" eventName="cta_click" label="about-es-tedx">Ver la charla TEDx <span>→</span></TrackedLink>
          </nav>

          <details className={styles.deeper}>
            <summary>Más sobre el enfoque</summary>
            <div className={styles.deeperBody}>
              <p>El marco más amplio es el exposoma: la influencia acumulada del aire, el agua, los alimentos, los productos, el estilo de vida, la genética, la nutrición, el ejercicio y la edad a lo largo de la vida. Es una forma de hacer mejores preguntas sobre la salud, no una puntuación individual de riesgo.</p>
              <p>Si quieres explorar ese marco, <a href="/es/ciencia/exposoma">conoce el exposoma →</a></p>
            </div>
          </details>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>
      <Footer locale="es" />
    </>
  );
}

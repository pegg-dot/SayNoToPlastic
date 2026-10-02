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
            <p className={styles.kicker}>Médico · Autor · Educador</p>
            <h1 id="about-title">Conoce al Dr. Elie Haddad</h1>
            <p className={styles.heroLead}>El Dr. Elie R. Haddad es cardiólogo y electrofisiólogo cardíaco con más de dos décadas de experiencia clínica, además de autor, educador y conferencista TEDx.</p>
            <p className={styles.heroLead}>Say No to Plastic nació de una pregunta médica: ¿qué influencias ambientales estamos pasando por alto cuando la enfermedad aparece antes, con mayor frecuencia o en personas que no encajan con el patrón esperado?</p>
          </div>
        </section>

        <section className={styles.why} aria-labelledby="why-title">
          <div className={styles.sectionIndex}>01 · Por qué le importa</div>
          <div>
            <p className={styles.eyebrow}>La pregunta clínica</p>
            <h2 id="why-title">La pregunta comenzó en la consulta.</h2>
            <p>Años cuidando a personas con enfermedad cardiovascular hicieron que el Dr. Haddad se interesara no solo por cómo se trata una enfermedad, sino por qué aparece y qué podría prevenirse.</p>
            <p>Esa investigación se amplió desde la genética y el estilo de vida hacia el mundo que nos rodea. Los microplásticos se convirtieron en una parte de una pregunta mucho más amplia sobre la exposición ambiental repetida a lo largo de la vida.</p>
          </div>
        </section>

        <section className={styles.story} aria-labelledby="story-title">
          <header>
            <div><p className={styles.sectionIndex}>02 · El camino</p><h2 id="story-title">De la cardiología a la investigación ambiental.</h2></div>
            <p>El trabajo clínico llevó a una pregunta más amplia; esa pregunta llevó a la investigación, y la investigación llevó a la educación pública.</p>
          </header>
          <ol>
            {story.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></li>)}
          </ol>
        </section>

        <section className={styles.work} aria-labelledby="work-title">
          <div>
            <p className={styles.sectionIndex}>03 · El trabajo ahora</p>
            <h2 id="work-title">Traducir la evidencia. Mantener visible la incertidumbre.</h2>
            <p>A través de Say No to Plastic, el Dr. Haddad conecta investigación humana emergente con orientación práctica para reducir la exposición, manteniendo separadas la detección, la asociación y la causalidad.</p>
          </div>
          <aside>
            <strong>Seguir explorando</strong>
            <TrackedLink href="/es/ciencia" eventName="cta_click" label="about-es-science">La ciencia <span>→</span></TrackedLink>
            <TrackedLink href="/es/accion" eventName="cta_click" label="about-es-action">Acción práctica <span>→</span></TrackedLink>
            <TrackedLink href="/es/tedx" eventName="cta_click" label="about-es-tedx">Charla TEDx <span>→</span></TrackedLink>
          </aside>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}

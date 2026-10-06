import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { SignupForm } from "../../components/SignupForm";
import { listPublishedNewsletters } from "../../lib/newsletters";
import styles from "../../newsletters/newsletters.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Field Notes | Say No To Plastic",
  description: "Lee Field Notes del Dr. Elie Haddad sobre exposición al plástico, investigación emergente y formas prácticas de reducir la exposición repetida.",
  alternates: { canonical: "/es/boletines", languages: { "en-US": "/newsletters", "es-US": "/es/boletines" } },
};

function displayDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

export default async function SpanishNewslettersPage() {
  const newsletters = await listPublishedNewsletters();

  return <><Header locale="es" /><main id="main-content" tabIndex={-1} className={styles.page}>
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Field Notes</p>
      <h1>Investigación que vale la pena entender. Pasos prácticos que vale la pena tomar.</h1>
      <p>Notas del Dr. Elie Haddad sobre la investigación emergente sobre plástico y salud, lo que la evidencia puede y no puede demostrar, y formas prácticas de reducir la exposición repetida.</p>
      <div className={styles.heroActions}>
        <a className={styles.primaryAction} href="#archive-title">Leer las ediciones recientes <span>↓</span></a>
        <a className={styles.secondaryAction} href="#subscribe-field-notes">Suscribirse a Field Notes <span>→</span></a>
      </div>
      <p className={styles.heroNote}>Todas las ediciones publicadas son gratuitas. Suscríbete para recibir nuevas Field Notes por correo electrónico. Las ediciones del archivo se muestran en su idioma original.</p>
    </section>

    <section className={styles.archive} aria-labelledby="archive-title">
      <div className={styles.archiveHeading}>
        <div><p className={styles.eyebrowDark}>Archivo</p><h2 id="archive-title">Field Notes recientes</h2></div>
        <span>{newsletters.length} {newsletters.length === 1 ? "edición publicada" : "ediciones publicadas"}</span>
      </div>
      {newsletters.length ? <div className={styles.grid}>
        {newsletters.map((newsletter) => <article className={styles.card} key={newsletter.id}>
          <div className={styles.cardMeta}><span>Field Notes</span>{newsletter.publishedAt ? <time dateTime={newsletter.publishedAt}>{displayDate(newsletter.publishedAt)}</time> : null}</div>
          <h3><a href={`/newsletters/${newsletter.slug}`}>{newsletter.title}</a></h3>
          {newsletter.excerpt ? <p>{newsletter.excerpt}</p> : null}
          <a className={styles.readLink} href={`/newsletters/${newsletter.slug}`}>Leer esta edición en su idioma original <span>→</span></a>
        </article>)}
      </div> : <div className={styles.empty}><h3>Field Notes están en camino.</h3><p>Las nuevas ediciones aparecerán aquí cuando se publiquen.</p></div>}
    </section>

    <section id="subscribe-field-notes" className={styles.signup}>
      <div><p className={styles.eyebrow}>Field Notes / Boletín</p><h2>Suscríbete para recibir la próxima edición.</h2><p>Resúmenes de investigación, orientación práctica para reducir la exposición y novedades de Say No To Plastic. El archivo completo seguirá abierto para todos.</p></div>
      <SignupForm compact locale="es" buttonLabel="Suscribirse a Field Notes" successTitle="Ya estás dentro." successText="Tu suscripción está activa. No necesitas confirmar por correo electrónico." />
    </section>
  </main><Footer locale="es" /></>;
}

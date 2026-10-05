import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { FeatureVideo } from "../../components/FeatureVideo";
import { TrackedLink } from "../../components/TrackedLink";
import { toVideoFeature } from "../../content/media-content";
import { getEffectiveTedxEntry } from "../../lib/publication-overrides";

export const dynamic = "force-dynamic";

const title = "El futuro de la salud humana (en la era de los nanoplásticos)";
const description = "La charla TEDxMiami del Dr. Elie Haddad sobre microplásticos, nanoplásticos, salud humana y la relación entre el mundo que nos rodea y el mundo dentro de nosotros.";

export const metadata: Metadata = {
  title: `${title} | TEDxMiami | Say No to Plastic`,
  description,
  alternates: {
    canonical: "/es/tedx",
    languages: { "en-US": "/tedx", "es-US": "/es/tedx" },
  },
  openGraph: {
    title: `${title} | Dr. Elie Haddad | TEDxMiami`,
    description,
    url: "/es/tedx",
    siteName: "Say No to Plastic",
    type: "website",
    images: [{ url: "/tedx.webp", width: 1536, height: 1024, alt: "Dr. Elie Haddad hablando en el escenario de TEDxMiami" }],
  },
};

export default async function TedxSpanishPage() {
  const entry = await getEffectiveTedxEntry();
  const video = entry ? toVideoFeature(entry) : null;

  return (
    <>
      <Header locale="es" />
      <main id="main-content" tabIndex={-1} className="media-page">
        <section className="media-hero">
          <div>
            <p className="eyebrow">TEDxMiami</p>
            <h1>{title}</h1>
            <p>Dr. Elie Haddad | TEDxMiami</p>
          </div>
          <aside>
            <span>Charla TEDx</span>
            <strong>Plástico, salud y lo que heredamos.</strong>
            <p>Una historia ambiental que cada vez es también una historia humana.</p>
          </aside>
        </section>

        <section className="media-feature ivory" aria-labelledby="tedx-video-title">
          <div className="media-feature-copy">
            <p className="eyebrow dark">TEDxMiami</p>
            <h2 id="tedx-video-title">{title}</h2>
          </div>
          {entry?.temporary ? <p className="media-temporary-status"><strong>Grabación temporal del público.</strong> No es la publicación oficial de TEDx y será reemplazada cuando esté disponible el video público oficial.</p> : null}
          {video ? (
            <FeatureVideo video={{ ...video, playLabel: "Reproducir charla TEDx", kicker: entry?.temporary ? "Grabación temporal · TEDxMiami" : "TEDxMiami" }} analyticsLabel="tedx-page-es" className="media-video" locale="es" />
          ) : (
            <figure className="media-pending-card">
              <img src="/tedx.webp" width="1536" height="1024" alt="Dr. Elie Haddad hablando en un escenario de TEDxMiami" />
              <figcaption><strong>Video TEDx próximamente</strong></figcaption>
            </figure>
          )}
        </section>

        <section className="media-inquiries ivory">
          <div>
            <p className="eyebrow dark">El futuro de la salud humana (en la era de los nanoplásticos)</p>
            <h2>¿Y si una de las grandes historias ambientales de nuestro tiempo ya no ocurre solo a nuestro alrededor, sino también dentro de nosotros?</h2>
            <p>En <em>El futuro de la salud humana (en la era de los nanoplásticos)</em>, el Dr. Elie Haddad explora la ciencia emergente sobre microplásticos y nanoplásticos en el cuerpo humano y nos invita a reconsiderar la frontera entre la salud ambiental y la salud humana.</p>
            <p>A partir de la medicina, la investigación científica y la historia detrás de Say No to Plastic, la charla trata en última instancia de algo más amplio que el plástico: la relación íntima entre el mundo que creamos a nuestro alrededor y el mundo que creamos dentro de nosotros.</p>
            <a className="button dark" href="#tedx-video-title">Ver la charla TEDx <span>↑</span></a>
          </div>
          <aside>
            <span>Seguir explorando</span>
            <TrackedLink href="/es/ciencia" eventName="cta_click" label="tedx-es-science">La ciencia <b>→</b></TrackedLink>
            <TrackedLink href="/es/accion" eventName="cta_click" label="tedx-es-action">Actúa <b>→</b></TrackedLink>
            <TrackedLink href="/es/sobre-dr-elie-haddad" eventName="cta_click" label="tedx-es-about">Acerca del Dr. Haddad <b>→</b></TrackedLink>
          </aside>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}

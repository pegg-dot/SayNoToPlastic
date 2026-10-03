import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { BOOK, SITE_URL } from "../../config";
import { evidenceChaptersEs } from "../../content/es/evidence";
import { bodySystemsEs } from "../../content/es/body-systems";
import type { EvidenceStudy } from "../../content/evidence";
import { ScienceNavigator } from "../../science/ScienceNavigator";
import { DetectionPrimer } from "../../components/DetectionPrimer";

export const dynamic = "force-dynamic";

const description = "Un registro en español de la evidencia humana sobre microplásticos y nanoplásticos, con resultados, métodos, limitaciones y fuentes originales.";

const scienceChapterVisualsEs: Partial<Record<(typeof evidenceChaptersEs)[number]["id"], { src: string; alt: string; width: number; height: number }>> = {
  blood: {
    src: "/images/science/blood.webp",
    alt: "Ilustración estilizada de células sanguíneas humanas con partículas suspendidas.",
    width: 372,
    height: 269,
  },
  brain: {
    src: "/images/science/brain.webp",
    alt: "Ilustración estilizada de un cerebro humano con partículas suspendidas.",
    width: 370,
    height: 279,
  },
  "heart-arteries": {
    src: "/images/science/heart.webp",
    alt: "Ilustración estilizada de un corazón humano y vasos sanguíneos con partículas suspendidas.",
    width: 372,
    height: 279,
  },
  placenta: {
    src: "/images/science/placenta.webp",
    alt: "Ilustración estilizada de una placenta y vasos ramificados con partículas suspendidas.",
    width: 372,
    height: 279,
  },
  ovary: {
    src: "/images/science/ovary.webp",
    alt: "Ilustración estilizada de un ovario humano con folículos visibles y partículas suspendidas.",
    width: 372,
    height: 269,
  },
  "testicular-tissue": {
    src: "/images/science/testicular-tissue.webp",
    alt: "Ilustración estilizada en corte de tejido testicular humano con partículas suspendidas.",
    width: 370,
    height: 269,
  },
};

export const metadata: Metadata = {
  title: "Plástico en el cuerpo humano: qué encontraron los estudios | Say No to Plastic",
  description,
  alternates: {
    canonical: "/es/ciencia",
    languages: { "en-US": "/science", "es-US": "/es/ciencia" },
  },
  openGraph: {
    title: "Plástico en el cuerpo humano: qué encontraron los estudios",
    description,
    url: "/es/ciencia",
    siteName: "Say No to Plastic",
    type: "article",
    images: [{ url: "/evidence.webp", width: 1536, height: 1024, alt: "Evidencia sobre plástico en sangre y tejidos humanos" }],
  },
};


function StudyDetailsEs({ study }: { study: EvidenceStudy }) {
  const isContext = study.studyType === "Contexto anatómico";
  return (
    <details className="science-v2-details">
      <summary>{isContext ? "Cómo funciona" : "Cómo se realizó el estudio"}<span aria-hidden="true">+</span></summary>
      <div className="science-v2-details-body">
        <dl>
          <div><dt>{isContext ? "Sistema" : "Estudio"}</dt><dd>{study.studyType}</dd></div>
          <div><dt>{isContext ? "Estructuras" : "Muestra"}</dt><dd>{study.sample}</dd></div>
          <div><dt>Método</dt><dd>{study.method}</dd></div>
          <div><dt>{isContext ? "Referencia" : "Publicado"}</dt><dd>{study.year} · {study.journal}</dd></div>
        </dl>
        <p><strong>{isContext ? "Qué explica" : "Límites del estudio"}</strong>{study.limits}</p>
      </div>
    </details>
  );
}

function StudyEs({ study, chapterNumber, studyNumber = 0, totalStudies = 0 }: { study: EvidenceStudy; chapterNumber: number; studyNumber?: number; totalStudies?: number }) {
  const isContext = study.studyType === "Contexto anatómico";
  return (
    <section className={`science-v2-study${isContext ? " science-v2-study-context" : ""}`} aria-labelledby={`${study.id}-title`}>
      {studyNumber > 0 && <p className="science-v2-substudy">Estudio {studyNumber} de {totalStudies}</p>}
      <h3 id={`${study.id}-title`}>{study.headline}</h3>
      <div className="science-v2-result">
        <p className="science-v2-stat"><strong>{study.stat}</strong><span>{study.statLabel}</span></p>
        <div className="science-v2-explanation">
          <p><span>{isContext ? "Cómo funciona" : "Qué encontraron los investigadores"}</span>{study.finding}</p>
          <p><span>Por qué importa</span>{study.meaning}</p>
        </div>
      </div>
      <StudyDetailsEs study={study} />
      <TrackedLink className="science-v2-source" href={study.source} eventName="outbound_source" label={`science-es-${study.id}`} target="_blank" rel="noopener noreferrer">
        <span>{isContext ? "Abrir la referencia anatómica" : "Leer el estudio original"}<small>{study.journal} · {study.year}</small></span>
        <b aria-hidden="true">↗</b>
      </TrackedLink>
      <span className="science-v2-watermark" aria-hidden="true">{String(chapterNumber).padStart(2, "0")}</span>
    </section>
  );
}

export default function ScienceSpanishPage() {
  const researchStudies = evidenceChaptersEs.flatMap((chapter) => chapter.studies).filter((study) => study.studyType !== "Contexto anatómico");
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/es/ciencia#page`,
    url: `${SITE_URL}/es/ciencia`,
    name: "Plástico en el cuerpo humano: qué encontraron los estudios",
    description,
    inLanguage: "es-US",
  };

  return (
    <>
      <Header locale="es" skipToContent />
      <main id="main-content" tabIndex={-1} className="science-v2">
        <section className="science-v2-hero" aria-labelledby="science-title">
          <img className="science-v2-hero-figure" src="/images/science/science-body-overview.webp" width="1148" height="767" alt="" aria-hidden="true" fetchPriority="high" />
          <div className="science-v2-hero-grid" aria-hidden="true" />
          <div className="science-v2-hero-copy">
            <p className="eyebrow"><span />La evidencia humana</p>
            <h1 id="science-title">Se ha encontrado plástico en distintas partes del cuerpo humano.</h1>
            <p className="science-v2-hero-deck">Aquí mostramos qué encontraron realmente los investigadores, en lenguaje claro, con cifras, limitaciones y enlaces a cada estudio original.</p>
          </div>
          <dl className="science-v2-hero-facts">
            <div><dt>{String(researchStudies.length).padStart(2, "0")}</dt><dd>Estudios humanos resumidos</dd></div>
            <div><dt>07</dt><dd>Resúmenes por sistemas del cuerpo</dd></div>
            <div><dt>100%</dt><dd>Fuentes originales enlazadas</dd></div>
          </dl>
        </section>

        <ScienceNavigator locale="es" chapters={evidenceChaptersEs.map(({ id, navLabel }) => ({ id, navLabel }))} />

        <DetectionPrimer locale="es" />

        <section className="science-v2-reading" aria-label="Capítulos de evidencia humana">
          <header className="science-v2-reading-intro">
            <p className="eyebrow dark">Hallazgo por hallazgo</p>
            <h2>Qué encontraron los estudios y por qué merece atención.</h2>
            <p>Detectar una partícula no equivale a diagnosticar una enfermedad. Estos estudios establecen presencia o asociación; no convierten automáticamente esa presencia en causalidad.</p>
          </header>

          {evidenceChaptersEs.map((chapter, chapterIndex) => {
            const chapterVisual = scienceChapterVisualsEs[chapter.id];
            return (
              <article id={chapter.id} className={`science-v2-chapter${chapter.id === "pregnancy" ? " science-v2-chapter-context" : ""}`} key={chapter.id}>
                <header className="science-v2-chapter-heading">
                  <p><span>{String(chapterIndex + 1).padStart(2, "0")}</span>{chapter.eyebrow}</p>
                  <h2>{chapter.title}</h2>
                  {chapter.introduction && <p>{chapter.introduction}</p>}
                  {chapterVisual && (
                    <figure className="science-v2-chapter-visual">
                      <img
                        src={chapterVisual.src}
                        width={chapterVisual.width}
                        height={chapterVisual.height}
                        loading="lazy"
                        alt={chapterVisual.alt}
                      />
                    </figure>
                  )}
                </header>
                <div className="science-v2-chapter-studies">
                  {chapter.studies.map((study, studyIndex) => <StudyEs key={study.id} study={study} chapterNumber={chapterIndex + 1} studyNumber={chapter.studies.length > 1 ? studyIndex + 1 : 0} totalStudies={chapter.studies.length} />)}
                </div>
              </article>
            );
          })}
        </section>

        <section id="body-system-overviews" className="science-v2-context" aria-labelledby="body-system-title">
          <header>
            <p className="eyebrow dark">Contexto biológico</p>
            <h2 id="body-system-title">Explora el cuerpo sistema por sistema.</h2>
            <p>Estas páginas mantienen la misma estructura científica del sitio en inglés: evidencia conocida, incertidumbres, estado de revisión y fuentes primarias claramente separadas.</p>
          </header>
          <div className="science-v2-context-links">
            {bodySystemsEs.map((item, index) => (
              <TrackedLink key={item.slug} href={`/es/ciencia/cuerpo/${item.slug}`} eventName="cta_click" label={`science-es-system-${index + 1}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><small>{item.reviewStatus === "verified" ? "Evidencia verificada" : item.reviewStatus === "partial" ? "Revisión parcial de fuentes" : "Revisión de fuentes pendiente"}</small><strong>{item.title}</strong><p>{item.summary}</p></div>
                <b aria-hidden="true">→</b>
              </TrackedLink>
            ))}
          </div>
        </section>

        <section className="science-v2-next" aria-labelledby="science-next-title">
          <p className="eyebrow"><span />De la evidencia a la acción</p>
          <h2 id="science-next-title">Usa menos plástico. Empieza por las rutinas que repites.</h2>
          <p>La acción puede seguir siendo sencilla. Abre el plan práctico o continúa la investigación completa en <em>{BOOK.title}</em>.</p>
          <div>
            <TrackedLink className="button gold" href="/es/accion" eventName="cta_click" label="science-es-solutions">Ver acciones prácticas <span>→</span></TrackedLink>
            <TrackedLink className="text-link" href="/es/homo-plasticus" eventName="view_book" label="science-es-book">Explorar el libro <span>↗</span></TrackedLink>
          </div>
        </section>
      </main>
      <Footer locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

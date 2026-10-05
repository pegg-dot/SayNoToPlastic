"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AnatomySystemSlug } from "../content/anatomy-system-models";
import { homepageJourney } from "../content/evidence";
import { homepageJourneyEs } from "../content/es/evidence";
import { TrackedLink } from "./TrackedLink";

const AnatomyScene = dynamic(
  () => import("./AnatomyScene").then((module) => module.AnatomyScene),
  { ssr: false, loading: () => <div className="anatomy-loading" aria-hidden="true"><span /></div> },
);

const AnatomySystemViewer = dynamic(
  () => import("./AnatomySystemViewer").then((module) => module.AnatomySystemViewer),
  { ssr: false },
);

type JourneyLocale = "en" | "es";

const systemLinksByLocale: Record<JourneyLocale, Record<string, { href: string; label: string }>> = {
  en: {
    "heart-arteries": { href: "/science/body/cardiovascular-system", label: "Cardiovascular overview" },
    "pregnancy-placenta": { href: "/science/body/pregnancy-early-life", label: "Pregnancy and early-life overview" },
    "follicular-fluid": { href: "/science/body/female-reproductive-health", label: "Female reproductive overview" },
    "endocrine-metabolic-system": { href: "/science/body/endocrine-metabolic-system", label: "Endocrine overview" },
    "kidneys-urinary-system": { href: "/science/body/kidneys-urinary-system", label: "Kidney overview" },
    skin: { href: "/science/body/skin", label: "Skin overview" },
    "digestive-system": { href: "/science/body/digestive-system", label: "Digestive overview" },
  },
  es: {
    "heart-arteries": { href: "/es/ciencia/cuerpo/cardiovascular-system", label: "Resumen cardiovascular" },
    "pregnancy-placenta": { href: "/es/ciencia/cuerpo/pregnancy-early-life", label: "Resumen de embarazo y primeras etapas de vida" },
    "follicular-fluid": { href: "/es/ciencia/cuerpo/female-reproductive-health", label: "Resumen de salud reproductiva femenina" },
    "endocrine-metabolic-system": { href: "/es/ciencia/cuerpo/endocrine-metabolic-system", label: "Resumen endocrino" },
    "kidneys-urinary-system": { href: "/es/ciencia/cuerpo/kidneys-urinary-system", label: "Resumen de riñones" },
    skin: { href: "/es/ciencia/cuerpo/skin", label: "Resumen de la piel" },
    "digestive-system": { href: "/es/ciencia/cuerpo/digestive-system", label: "Resumen digestivo" },
  },
};

const chapterViewers: Partial<Record<string, AnatomySystemSlug>> = {
  blood: "whole-body-atlas",
  "endocrine-metabolic-system": "endocrine-metabolic-system",
  "kidneys-urinary-system": "kidneys-urinary-system",
  skin: "skin",
  "digestive-system": "digestive-system",
};

const journeyCopy = {
  en: {
    visibleAnatomy: "Visible anatomy",
    navLabel: (count: number) => `Explore the ${count} anatomy chapters`,
    anatomyCredit: "3D anatomy:",
    motionNote: "Particle motion follows the displayed anatomy as an educational cue; it is not a measured transport trajectory.",
    introEyebrow: "The evidence, organ by organ",
    introTitle: "Ten chapters. Anatomy in context.",
    introBody: "Each chapter uses the reference anatomy appropriate to that question. Sex- and life-stage-specific models are kept in their own context rather than being presented as one literal person's body.",
    finding: "Finding",
    notProof: "What it does not prove",
    openAtlas: "Open reference atlas",
    open3d: "Open interactive 3D",
    context: "Study context, limits, and sources",
    sources: (chapter: string) => `${chapter} sources`,
    atlasEyebrow: "Interactive anatomy",
    atlasTitle: "Explore the anatomy reference atlas.",
    atlasBody: "Rotate the female reference body and focus the available general systems. Pregnancy, fetal, and reproductive anatomy stay in their dedicated chapters instead of being overlaid into one literal body.",
    atlasButton: "Open anatomy atlas",
    scienceLink: "Explore the science",
    atlasNote: "Educational reference assembly, not a clinical or patient-specific atlas. Particle motion in the anatomy journey is an illustrative spatial cue, not a measured transport trajectory.",
    scienceHref: "/science",
  },
  es: {
    visibleAnatomy: "Anatomía visible",
    navLabel: (count: number) => `Explorar los ${count} capítulos anatómicos`,
    anatomyCredit: "Anatomía 3D:",
    motionNote: "El movimiento de partículas sigue la anatomía mostrada como una señal educativa; no representa una trayectoria de transporte medida.",
    introEyebrow: "La evidencia, órgano por órgano",
    introTitle: "Diez capítulos. Anatomía en contexto.",
    introBody: "Cada capítulo utiliza la anatomía de referencia adecuada para su pregunta. Los modelos específicos por sexo y etapa de vida permanecen en su propio contexto, en lugar de presentarse como el cuerpo literal de una sola persona.",
    finding: "Hallazgo",
    notProof: "Lo que no demuestra",
    openAtlas: "Abrir atlas de referencia",
    open3d: "Abrir 3D interactivo",
    context: "Contexto, límites y fuentes del estudio",
    sources: (chapter: string) => `Fuentes de ${chapter}`,
    atlasEyebrow: "Anatomía interactiva",
    atlasTitle: "Explora el atlas anatómico de referencia.",
    atlasBody: "Rota el cuerpo femenino de referencia y enfoca los sistemas generales disponibles. La anatomía del embarazo, fetal y reproductiva permanece en sus capítulos dedicados en lugar de superponerse dentro de un solo cuerpo literal.",
    atlasButton: "Abrir atlas anatómico",
    scienceLink: "Explorar la ciencia",
    atlasNote: "Conjunto educativo de referencia, no un atlas clínico ni específico de una persona. El movimiento de partículas en el recorrido anatómico es una señal espacial ilustrativa, no una trayectoria de transporte medida.",
    scienceHref: "/es/ciencia",
  },
} as const;

export function BodyJourney({ locale = "en" }: { locale?: JourneyLocale }) {
  const findings = locale === "es" ? homepageJourneyEs : homepageJourney;
  const systemLinks = systemLinksByLocale[locale];
  const copy = journeyCopy[locale];
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [openSlug, setOpenSlug] = useState<AnatomySystemSlug | null>(null);
  const [atlasContextEnabled, setAtlasContextEnabled] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const progressRef = useRef(0);
  const activeRef = useRef(0);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const closeViewer = useCallback(() => {
    setOpenSlug(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setAtlasContextEnabled(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setAtlasContextEnabled(true);
      observer.disconnect();
    }, { rootMargin: "1200px 0px", threshold: 0.01 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const first = stepRefs.current[0];
      const last = stepRefs.current[stepRefs.current.length - 1];
      if (!first || !last) return;

      const pageCenter = window.scrollY + window.innerHeight * 0.5;
      const firstCenter = first.getBoundingClientRect().top + window.scrollY + first.offsetHeight * 0.5;
      const lastCenter = last.getBoundingClientRect().top + window.scrollY + last.offsetHeight * 0.5;
      const normalized = clamp((pageCenter - firstCenter) / Math.max(lastCenter - firstCenter, 1));
      progressRef.current = normalized;

      const next = Math.min(findings.length - 1, Math.max(0, Math.round(normalized * (findings.length - 1))));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    requestUpdate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [findings]);

  function focus(index: number) {
    setActive(index);
    activeRef.current = index;
    progressRef.current = findings.length > 1 ? index / (findings.length - 1) : 0;
    stepRefs.current[index]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  }

  function openViewer(slug: AnatomySystemSlug, trigger: HTMLButtonElement) {
    returnFocusRef.current = trigger;
    setOpenSlug(slug);
  }

  const current = findings[active] ?? findings[0];
  if (!current) return null;

  return (
    <>
      <section ref={sectionRef} id="evidence" className="body-journey" aria-labelledby="body-journey-title">
        <div className="journey-stage">
          <div className="journey-grid" aria-hidden="true" />
          <AnatomyScene progress={progressRef} reducedMotion={reducedMotion} activeIndex={active} loadCompleteContext={atlasContextEnabled} />
          <div className="journey-vignette" aria-hidden="true" />
          <div className="journey-visible-anatomy" aria-hidden="true">
            <span>{copy.visibleAnatomy}</span>
            <small>{current.modelLabel}</small>
          </div>
          <div className="journey-stage-copy" aria-hidden="true">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <p>{current.chapter}</p>
          </div>
          <div className="journey-progress" aria-hidden="true"><i style={{ height: `${((active + 1) / findings.length) * 100}%` }} /></div>
          <nav className="organ-nav" aria-label={copy.navLabel(findings.length)}>
            {findings.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                className={index === active ? "active" : ""}
                onClick={() => focus(index)}
                aria-pressed={index === active}
                aria-controls={`finding-${item.slug}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>{item.chapter}
              </button>
            ))}
          </nav>
          <p className="anatomy-credit">
            {copy.anatomyCredit} <a href="https://3d.nih.gov/collections/hra" target="_blank" rel="noopener noreferrer">NIH Human Reference Atlas, CC BY 4.0</a>
            <span> · </span>
            <a href="https://github.com/MedicalVisionGroup/fetal-smpl" target="_blank" rel="noopener noreferrer">Fetal MRI surface, MIT</a>
            <span> · </span>
            <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noopener noreferrer">BodyParts3D, CC BY-SA 2.1 JP</a>
          </p>
          <p className="anatomy-motion-note" aria-hidden="true">{copy.motionNote}</p>
        </div>

        <div className="journey-story">
          <header className="journey-intro" data-reveal>
            <p className="eyebrow">{copy.introEyebrow}</p>
            <h2 id="body-journey-title">{copy.introTitle}</h2>
            <p>{copy.introBody}</p>
          </header>

          {findings.map((item, index) => {
            const viewerSlug = chapterViewers[item.slug];
            const conciseFinding = item.compactFinding ?? item.finding;
            const conciseMeaning = item.compactMeaning ?? item.meaning;

            return (
              <article
                ref={(node) => { stepRefs.current[index] = node; }}
                data-index={index}
                data-slug={item.slug}
                className={`body-step${index === active ? " active" : ""}`}
                key={item.slug}
                id={`finding-${item.slug}`}
              >
                <div className="finding-marker"><span>{String(index + 1).padStart(2, "0")}</span><b>{item.chapter}</b></div>
                <h3>{item.title}</h3>
                <div className="finding-stat"><strong>{item.stat}</strong><span>{item.statLabel}</span></div>

                <div className="finding-brief">
                  <article>
                    <span>{copy.finding}</span>
                    <p>{conciseFinding}</p>
                  </article>
                  <article>
                    <span>{copy.notProof}</span>
                    <p>{conciseMeaning}</p>
                  </article>
                </div>

                {(viewerSlug || systemLinks[item.slug]) && (
                  <div className="finding-system-actions">
                    {viewerSlug && (
                      <button
                        type="button"
                        className="finding-open-viewer"
                        aria-haspopup="dialog"
                        onClick={(event) => openViewer(viewerSlug, event.currentTarget)}
                      >
                        {viewerSlug === "whole-body-atlas" ? copy.openAtlas : copy.open3d} <span>↗</span>
                      </button>
                    )}
                    {systemLinks[item.slug] && (
                      <TrackedLink className="finding-system-link" href={systemLinks[item.slug].href} eventName="science_topic_open" label={`home-${locale}-system-${item.slug}`}>
                        {systemLinks[item.slug].label} <span>→</span>
                      </TrackedLink>
                    )}
                  </div>
                )}

                <details className="finding-context">
                  <summary>{copy.context} <span>+</span></summary>
                  <div>
                    <p>{item.details}</p>
                    {item.relatedFinding && (
                      <aside className="finding-companion">
                        <p>{item.relatedFinding.eyebrow}</p>
                        <div><strong>{item.relatedFinding.stat}</strong><span>{item.relatedFinding.statLabel}</span></div>
                        <h4>{item.relatedFinding.title}</h4>
                        <small>{item.relatedFinding.text}</small>
                      </aside>
                    )}
                    <div className="finding-sources" aria-label={copy.sources(item.chapter)}>
                      {item.sources.map((source, sourceIndex) => {
                        const external = source.href.startsWith("http");
                        return (
                          <TrackedLink
                            href={source.href}
                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            eventName={external ? "outbound_source" : "science_topic_open"}
                            label={`home-${locale}-source-${item.slug}-${sourceIndex + 1}`}
                            key={source.href}
                          >
                            {source.label} <span>{external ? "↗" : "→"}</span><small>{source.meta}</small>
                          </TrackedLink>
                        );
                      })}
                    </div>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      </section>

      <section className="journey-complete-atlas-compact" aria-labelledby="complete-atlas-title" data-reveal>
        <div className="journey-complete-atlas-compact-copy">
          <p className="eyebrow">{copy.atlasEyebrow}</p>
          <h2 id="complete-atlas-title">{copy.atlasTitle}</h2>
          <p>{copy.atlasBody}</p>
        </div>
        <div className="journey-complete-atlas-compact-actions">
          <button
            type="button"
            className="button gold journey-atlas-button"
            aria-haspopup="dialog"
            onClick={(event) => openViewer("whole-body-atlas", event.currentTarget)}
          >
            {copy.atlasButton} <span>↗</span>
          </button>
          <TrackedLink className="text-link" href={copy.scienceHref} eventName="cta_click" label={`home-${locale}-complete-atlas-science`}>{copy.scienceLink} <span>→</span></TrackedLink>
        </div>
        <small>{copy.atlasNote}</small>
      </section>

      {openSlug && <AnatomySystemViewer key={openSlug} slug={openSlug} locale={locale} onClose={closeViewer} />}
    </>
  );
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

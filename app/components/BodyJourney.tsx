"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AnatomySystemSlug } from "../content/anatomy-system-models";
import { homepageJourney } from "../content/evidence";
import { TrackedLink } from "./TrackedLink";

const AnatomyScene = dynamic(
  () => import("./AnatomyScene").then((module) => module.AnatomyScene),
  { ssr: false, loading: () => <div className="anatomy-loading" aria-hidden="true"><span /></div> },
);

const AnatomySystemViewer = dynamic(
  () => import("./AnatomySystemViewer").then((module) => module.AnatomySystemViewer),
  { ssr: false },
);

const findings = homepageJourney;

const systemLinks: Record<string, { href: string; label: string }> = {
  "heart-arteries": { href: "/science/body/cardiovascular-system", label: "Cardiovascular overview" },
  "pregnancy-placenta": { href: "/science/body/pregnancy-early-life", label: "Pregnancy and early-life overview" },
  "follicular-fluid": { href: "/science/body/female-reproductive-health", label: "Female reproductive overview" },
  "endocrine-metabolic-system": { href: "/science/body/endocrine-metabolic-system", label: "Endocrine overview" },
  "kidneys-urinary-system": { href: "/science/body/kidneys-urinary-system", label: "Kidney overview" },
  skin: { href: "/science/body/skin", label: "Skin overview" },
  "digestive-system": { href: "/science/body/digestive-system", label: "Digestive overview" },
};

const chapterViewers: Partial<Record<string, AnatomySystemSlug>> = {
  blood: "whole-body-atlas",
  "endocrine-metabolic-system": "endocrine-metabolic-system",
  "kidneys-urinary-system": "kidneys-urinary-system",
  skin: "skin",
  "digestive-system": "digestive-system",
};

export function BodyJourney() {
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

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return () => media.removeEventListener("change", updateMotion);
    }

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 },
    );
    revealNodes.forEach((node) => revealObserver.observe(node));

    return () => {
      media.removeEventListener("change", updateMotion);
      revealObserver.disconnect();
    };
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
  }, []);

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

  const current = findings[active];

  return (
    <>
      <section ref={sectionRef} id="evidence" className="body-journey" aria-labelledby="body-journey-title">
        <div className="journey-stage">
          <div className="journey-grid" aria-hidden="true" />
          <AnatomyScene progress={progressRef} reducedMotion={reducedMotion} activeIndex={active} loadCompleteContext={atlasContextEnabled} />
          <div className="journey-vignette" aria-hidden="true" />
          <div className="journey-visible-anatomy" aria-hidden="true">
            <span>Visible anatomy</span>
            <small>{current.modelLabel}</small>
          </div>
          <div className="journey-stage-copy" aria-hidden="true">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <p>{current.chapter}</p>
          </div>
          <div className="journey-progress" aria-hidden="true"><i style={{ height: `${((active + 1) / findings.length) * 100}%` }} /></div>
          <nav className="organ-nav" aria-label={`Explore the ${findings.length} anatomy chapters`}>
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
            3D anatomy: <a href="https://3d.nih.gov/collections/hra" target="_blank" rel="noopener noreferrer">NIH Human Reference Atlas, CC BY 4.0</a>
            <span> · </span>
            <a href="https://github.com/MedicalVisionGroup/fetal-smpl" target="_blank" rel="noopener noreferrer">Fetal MRI surface, MIT</a>
            <span> · </span>
            <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noopener noreferrer">BodyParts3D, CC BY-SA 2.1 JP</a>
          </p>
          <p className="anatomy-motion-note" aria-hidden="true">Particle motion follows the displayed anatomy as an educational cue; it is not a measured transport trajectory.</p>
        </div>

        <div className="journey-story">
          <header className="journey-intro" data-reveal>
            <p className="eyebrow">The evidence, organ by organ</p>
            <h2 id="body-journey-title">Ten chapters. One connected body.</h2>
            <p>All available anatomy stays together in the body while the active chapter brightens and the camera moves closer. Methods, limits, and sources remain available without crowding the screen.</p>
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
                    <span>Finding</span>
                    <p>{conciseFinding}</p>
                  </article>
                  <article>
                    <span>What it does not prove</span>
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
                        {viewerSlug === "whole-body-atlas" ? "Open complete 3D" : "Open interactive 3D"} <span>↗</span>
                      </button>
                    )}
                    {systemLinks[item.slug] && (
                      <TrackedLink className="finding-system-link" href={systemLinks[item.slug].href} eventName="science_topic_open" label={`home-system-${item.slug}`}>
                        {systemLinks[item.slug].label} <span>→</span>
                      </TrackedLink>
                    )}
                  </div>
                )}

                <details className="finding-context">
                  <summary>Study context, limits, and sources <span>+</span></summary>
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
                    <div className="finding-sources" aria-label={`${item.chapter} sources`}>
                      {item.sources.map((source, sourceIndex) => {
                        const external = source.href.startsWith("http");
                        return (
                          <TrackedLink
                            href={source.href}
                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            eventName={external ? "outbound_source" : "science_topic_open"}
                            label={`home-source-${item.slug}-${sourceIndex + 1}`}
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
          <p className="eyebrow">Interactive anatomy</p>
          <h2 id="complete-atlas-title">Explore the complete anatomy atlas.</h2>
          <p>Rotate the reference body, isolate systems, and switch between exterior, cutaway, and system-only views.</p>
        </div>
        <div className="journey-complete-atlas-compact-actions">
          <button
            type="button"
            className="button gold journey-atlas-button"
            aria-haspopup="dialog"
            onClick={(event) => openViewer("whole-body-atlas", event.currentTarget)}
          >
            Open anatomy atlas <span>↗</span>
          </button>
          <TrackedLink className="text-link" href="/science" eventName="cta_click" label="home-complete-atlas-science">Explore the science <span>→</span></TrackedLink>
        </div>
        <small>Educational composite. Particle motion in the anatomy journey is an illustrative spatial cue, not a measured transport trajectory.</small>
      </section>

      {openSlug && <AnatomySystemViewer slug={openSlug} onClose={closeViewer} />}
    </>
  );
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

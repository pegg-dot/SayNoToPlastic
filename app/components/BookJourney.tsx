"use client";

import { useEffect, useRef, useState } from "react";
import { BOOK } from "../config";
import { TrackedLink } from "./TrackedLink";
import { CheckoutButton } from "./CheckoutButton";

const chapters = [
  {
    kicker: "Four windows into a wider inquiry",
    title: "A plastic age became a human-health question.",
    text: "This scroll is a guided preview, not the book's table of contents. Homo Plasticus reaches beyond these four screens into history, exposure, human evidence, practical response and the choices that come next.",
  },
  {
    kicker: "The pathways",
    title: "From convenience to particles and repeated exposure.",
    text: "Follow how durable objects break down and how plastic moves through air, water, food, storage, heat and ordinary contact.",
  },
  {
    kicker: "The evidence",
    title: "What researchers are finding in blood and human tissue.",
    text: "The book brings emerging human findings together in plain language while keeping the limits of the evidence visible.",
  },
  {
    kicker: "The response",
    title: "What knowledge asks us to do next.",
    text: "Move from individual routines to public choices and the larger question of how society reduces unnecessary plastic exposure.",
  },
];

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function BookJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  function goToPhase(index: number) {
    const section = sectionRef.current;
    if (!section) return;
    const phaseStops = [0.08, 0.35, 0.56, 0.82];
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
    window.scrollTo({
      top: sectionTop + distance * phaseStops[index],
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function update() {
      frame = 0;
      const bounds = section!.getBoundingClientRect();
      const distance = Math.max(section!.offsetHeight - window.innerHeight, 1);
      const progress = motion.matches ? 0 : clamp(-bounds.top / distance);
      const lift = clamp(progress / 0.27);
      const open = clamp((progress - 0.31) / 0.11);
      const photo = 1 - clamp((progress - 0.26) / 0.08);
      const turnOne = clamp((progress - 0.43) / 0.15);
      const turnTwo = clamp((progress - 0.65) / 0.15);
      const nextPhase = progress < 0.22 ? 0 : progress < 0.48 ? 1 : progress < 0.65 ? 2 : 3;

      stage!.style.setProperty("--book-lift", lift.toFixed(4));
      stage!.style.setProperty("--book-open", open.toFixed(4));
      stage!.style.setProperty("--book-photo", photo.toFixed(4));
      stage!.style.setProperty("--page-one", turnOne.toFixed(4));
      stage!.style.setProperty("--page-two", turnTwo.toFixed(4));
      stage!.dataset.phase = String(nextPhase);
      setPhase((current) => current === nextPhase ? current : nextPhase);
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    motion.addEventListener("change", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      motion.removeEventListener("change", requestUpdate);
    };
  }, []);

  return (
    <section ref={sectionRef} id="book" className="book-journey-story" aria-labelledby="book-story-title">
      <div ref={stageRef} className="book-story-stage" data-phase="0">
        <div className="book-story-index"><span>05</span><p>The book</p></div>

        <div className="book-story-visual">
          <figure className="book-product-photo">
            <img src="/book-official.webp" width="1122" height="1402" loading="lazy" alt={`${BOOK.title} book by ${BOOK.author}`} />
          </figure>

          <div className="open-book" aria-hidden="true">
            <div className="book-spread-page book-page-left book-page-base">
              <p>Homo Plasticus</p>
              <h3>The investigation</h3>
              <span>Scroll to turn the pages</span>
            </div>
            <div className="book-spread-page book-page-right book-page-base">
              <p>Continue reading</p>
              <h3>The full inquiry begins here.</h3>
              <span>{BOOK.author}</span>
            </div>

            <div className="turning-leaf turning-leaf-two">
              <div className="leaf-face leaf-front">
                <p>Preview 03</p><strong>The evidence</strong><span>What researchers are finding in blood and human tissue, and what those findings can currently support.</span><b>03</b>
              </div>
              <div className="leaf-face leaf-back">
                <p>Preview 04</p><strong>The response</strong><span>How evidence becomes practical action at home and in public life.</span><b>04</b>
              </div>
            </div>

            <div className="turning-leaf turning-leaf-one">
              <div className="leaf-face leaf-front">
                <p>Preview 01</p><strong>The premise</strong><span>How the plastic age became a question about human exposure and health.</span><b>01</b>
              </div>
              <div className="leaf-face leaf-back">
                <p>Preview 02</p><strong>The pathways</strong><span>How durable objects become particles distributed through ordinary life.</span><b>02</b>
              </div>
            </div>
          </div>
        </div>

        <div className="book-story-copy">
          <p className="eyebrow">A physician-led reading journey</p>
          <h2 id="book-story-title">Homo<br />Plasticus</h2>
          <div className="book-chapter-copy">
            {chapters.map((chapter, index) => (
              <article key={chapter.kicker} className={phase === index ? "active" : ""} aria-hidden={phase !== index}>
                <span>{chapter.kicker}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
              </article>
            ))}
          </div>
          <div className="book-story-purchase">
            <p><strong>${BOOK.price}</strong><span>Digital ebook<br />Instant access</span></p>
            <CheckoutButton className="button gold" label="homepage-book-story">Get the ebook <span>↗</span></CheckoutButton>
            <TrackedLink className="text-link" href="/homo-plasticus" eventName="cta_click" label="home-book-details">Explore the book <span>→</span></TrackedLink>
          </div>
        </div>

        <nav className="book-story-progress" aria-label="Book journey preview">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.kicker}
              type="button"
              className={phase >= index ? "active" : ""}
              aria-current={phase === index ? "step" : undefined}
              onClick={() => goToPhase(index)}
            >
              <span className="sr-only">Go to {chapter.kicker.toLowerCase()}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="book-reduced-summary">
        {chapters.slice(1).map((chapter) => <article key={chapter.kicker}><span>{chapter.kicker}</span><h3>{chapter.title}</h3><p>{chapter.text}</p></article>)}
      </div>
    </section>
  );
}

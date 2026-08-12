"use client";

import { useEffect, useState } from "react";
import type { EvidenceChapter } from "../content/evidence";

export function ScienceNavigator({ chapters }: { chapters: Pick<EvidenceChapter, "id" | "navLabel">[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-24% 0px -62%", threshold: [0, 0.08, 0.3] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav className="science-v2-nav" aria-label="Explore evidence by body system">
      <div className="science-v2-nav-inner">
        <span className="science-v2-nav-label">Explore the findings</span>
        <div className="science-v2-nav-links">
          {chapters.map((chapter, index) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className={active === chapter.id ? "is-active" : undefined}
              aria-current={active === chapter.id ? "location" : undefined}
              onClick={() => setActive(chapter.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {chapter.navLabel}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

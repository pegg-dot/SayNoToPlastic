"use client";

import { useEffect, useState } from "react";

const chapters = [
  { id: "clinic", label: "The clinic" },
  { id: "why", label: "The question" },
  { id: "environment", label: "The environment" },
  { id: "evidence", label: "The evidence" },
  { id: "movement", label: "The movement" },
];

export function AboutStoryRail() {
  const [active, setActive] = useState(chapters[0].id);

  useEffect(() => {
    const elements = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -58%", threshold: [0.08, 0.25, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="about-story-rail" aria-label="My story chapters">
      <p>Reading map</p>
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id} className={active === chapter.id ? "is-active" : ""}>
            <a href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

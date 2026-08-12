"use client";

import { useRef, useState } from "react";
import { exposomeCategories } from "../content/haddad-topics";
import { TrackedLink } from "./TrackedLink";

export function ExposomeMap({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(exposomeCategories[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = exposomeCategories.find((item) => item.id === active) ?? exposomeCategories[0];

  function moveTab(index: number) {
    const next = (index + exposomeCategories.length) % exposomeCategories.length;
    const item = exposomeCategories[next];
    setActive(item.id);
    tabRefs.current[next]?.focus();
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveTab(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTab(exposomeCategories.length - 1);
    }
  }

  return (
    <div className={`exposome-map${compact ? " is-compact" : ""}`}>
      <div className="exposome-map-world">
        <span aria-hidden="true">01</span>
        <strong>The world around you</strong>
        <p>Air, water, food, products, and lifestyle combine across time.</p>
      </div>
      <div className="exposome-map-controls" role="tablist" aria-label="Exposome categories">
        {exposomeCategories.map((item, index) => (
          <button
            type="button"
            key={item.id}
            role="tab"
            aria-selected={active === item.id}
            aria-controls={`exposome-panel-${item.id}`}
            id={`exposome-tab-${item.id}`}
            tabIndex={active === item.id ? 0 : -1}
            ref={(element) => { tabRefs.current[index] = element; }}
            onClick={() => setActive(item.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            <span>{item.title}</span>
            <small>{item.examples.slice(0, 2).join(" · ")}</small>
          </button>
        ))}
      </div>
      <section id={`exposome-panel-${current.id}`} role="tabpanel" aria-labelledby={`exposome-tab-${current.id}`} className="exposome-map-panel">
        <p className="eyebrow dark">{current.title}</p>
        <h3>{current.summary}</h3>
        <ul>{current.examples.map((example) => <li key={example}>{example}</li>)}</ul>
        <div>{current.related.map((link) => <TrackedLink key={link.href} href={link.href} eventName="cta_click" label={`exposome-${current.id}-${link.label}`}>{link.label} <span>→</span></TrackedLink>)}</div>
      </section>
      {!compact && <div className="exposome-map-response"><span>02</span><strong>How the body responds</strong><p>Genetics · Nutrition · Exercise · Age</p><i aria-hidden="true">↓</i><span>03</span><strong>Long-term health</strong></div>}
    </div>
  );
}

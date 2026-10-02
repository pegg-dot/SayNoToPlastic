"use client";

import { useRef, useState } from "react";
import { exposomeCategories, type ExposomeCategory } from "../content/haddad-topics";
import type { SiteLocale } from "../lib/i18n";
import { TrackedLink } from "./TrackedLink";

export function ExposomeMap({ compact = false, categories = exposomeCategories, locale = "en" }: { compact?: boolean; categories?: ExposomeCategory[]; locale?: SiteLocale }) {
  const [active, setActive] = useState(categories[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = categories.find((item) => item.id === active) ?? categories[0];

  function moveTab(index: number) {
    const next = (index + categories.length) % categories.length;
    const item = categories[next];
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
      moveTab(categories.length - 1);
    }
  }

  return (
    <div className={`exposome-map${compact ? " is-compact" : ""}`}>
      <div className="exposome-map-world">
        <span aria-hidden="true">01</span>
        <strong>{locale === "es" ? "El mundo que te rodea" : "The world around you"}</strong>
        <p>{locale === "es" ? "Aire, agua, alimentos, productos y estilo de vida se combinan a lo largo del tiempo." : "Air, water, food, products, and lifestyle combine across time."}</p>
      </div>
      <div className="exposome-map-controls" role="tablist" aria-label={locale === "es" ? "Categorías del exposoma" : "Exposome categories"}>
        {categories.map((item, index) => (
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
      {!compact && <div className="exposome-map-response"><span>02</span><strong>{locale === "es" ? "Cómo responde el cuerpo" : "How the body responds"}</strong><p>{locale === "es" ? "Genética · Nutrición · Ejercicio · Edad" : "Genetics · Nutrition · Exercise · Age"}</p><i aria-hidden="true">↓</i><span>03</span><strong>{locale === "es" ? "Salud a largo plazo" : "Long-term health"}</strong></div>}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { coreRules, plannerActions } from "../content/actions";
import { coreRulesEs, plannerActionsEs } from "../content/es/actions";
import type { SiteLocale } from "../lib/i18n";
import { trackEvent } from "./ConsentAnalytics";

const STORAGE_KEY = "say-no-to-plastic-action-plan-v2";

const copy = {
  en: {
    eyebrow: "One next step",
    title: "Choose one change for this week.",
    intro: "Choose one of the same three core rules. When it becomes routine, come back for another. Your choice stays on this device.",
    selected: "of 1 selected",
    choicesLabel: "Everyday changes",
    outputEyebrow: "Your next change",
    empty: "Pick one practical change. That is enough for now.",
    allActions: "See all 12 actions",
  },
  es: {
    eyebrow: "Un siguiente paso",
    title: "Elige un cambio para esta semana.",
    intro: "Elige una de las mismas tres reglas principales. Cuando se vuelva rutina, regresa por otra. Tu elección se queda en este dispositivo.",
    selected: "de 1 seleccionado",
    choicesLabel: "Cambios cotidianos",
    outputEyebrow: "Tu próximo cambio",
    empty: "Elige un cambio práctico. Eso es suficiente por ahora.",
    allActions: "Ver las 12 acciones",
  },
} as const;

export function ActionPlanner({ locale = "en" }: { locale?: SiteLocale }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const text = copy[locale];
  const rules = locale === "es" ? coreRulesEs : coreRules;
  const actions = locale === "es" ? plannerActionsEs : plannerActions;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (Array.isArray(saved)) setSelected(saved.filter((item): item is string => typeof item === "string").slice(0, 1));
      } catch { /* An empty plan is a safe fallback. */ }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [ready, selected]);

  const corePlannerActions = useMemo(() => actions.filter((action) => rules.some((rule) => rule.number === action.number)), [actions, rules]);
  const chosen = useMemo(() => corePlannerActions.filter((action) => selected.includes(action.number)), [selected, corePlannerActions]);

  function toggle(number: string) {
    setSelected((current) => current.includes(number) ? [] : [number]);
    void trackEvent("cta_click", { label: `${locale === "es" ? "solutions-plan-es" : "solutions-plan"}-${number}` });
  }

  return <section className="action-planner" aria-labelledby="plan-title">
    <div className="action-planner-intro">
      <p className="eyebrow">{text.eyebrow}</p>
      <h2 id="plan-title">{text.title}</h2>
      <p>{text.intro}</p>
    </div>
    <div className="action-planner-workspace">
      <p className="action-plan-count" aria-live="polite"><span>{selected.length}</span> {text.selected}</p>
      <div className="action-choice-list" role="list" aria-label={text.choicesLabel}>
        {corePlannerActions.map((action) => {
          const active = selected.includes(action.number);
          return <button type="button" key={action.number} aria-pressed={active} className={active ? "is-selected" : ""} onClick={() => toggle(action.number)}>
            <span>{action.number}</span><strong>{action.shortTitle}</strong><i aria-hidden="true">{active ? "✓" : "+"}</i>
          </button>;
        })}
      </div>
      <div className="action-plan-output">
        <p className="eyebrow">{text.outputEyebrow}</p>
        {chosen.length ? <ol>{chosen.map((action) => <li key={action.number}><span>{action.number}</span><div><strong>{action.title}</strong><p>{action.practical}</p></div></li>)}</ol> : <p className="action-plan-empty">{text.empty}</p>}
        <div className="action-plan-links"><a href={locale === "es" ? "/es/guia-12-pasos" : "/quick-action-card"}>{text.allActions} <span>→</span></a></div>
      </div>
    </div>
  </section>;
}

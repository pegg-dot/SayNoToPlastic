"use client";

import { useEffect, useMemo, useState } from "react";
import { coreRules, plannerActions } from "../content/actions";
import { trackEvent } from "./ConsentAnalytics";

const STORAGE_KEY = "say-no-to-plastic-action-plan-v2";

export function ActionPlanner() {
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

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

  const corePlannerActions = useMemo(() => plannerActions.filter((action) => coreRules.some((rule) => rule.number === action.number)), []);
  const chosen = useMemo(() => corePlannerActions.filter((action) => selected.includes(action.number)), [selected, corePlannerActions]);

  function toggle(number: string) {
    setSelected((current) => current.includes(number) ? [] : [number]);
    void trackEvent("cta_click", { label: `solutions-plan-${number}` });
  }

  return <section className="action-planner" aria-labelledby="plan-title">
    <div className="action-planner-intro">
      <p className="eyebrow">One next step</p>
      <h2 id="plan-title">Choose one change for this week.</h2>
      <p>Choose one of the same three core rules. When it becomes routine, come back for another. Your choice stays on this device.</p>
    </div>
    <div className="action-planner-workspace">
      <p className="action-plan-count" aria-live="polite"><span>{selected.length}</span> of 1 selected</p>
      <div className="action-choice-list" role="list" aria-label="Everyday changes">
        {corePlannerActions.map((action) => {
          const active = selected.includes(action.number);
          return <button type="button" key={action.number} aria-pressed={active} className={active ? "is-selected" : ""} onClick={() => toggle(action.number)}>
            <span>{action.number}</span><strong>{action.shortTitle}</strong><i aria-hidden="true">{active ? "✓" : "+"}</i>
          </button>;
        })}
      </div>
      <div className="action-plan-output">
        <p className="eyebrow">Your next change</p>
        {chosen.length ? <ol>{chosen.map((action) => <li key={action.number}><span>{action.number}</span><div><strong>{action.title}</strong><p>{action.practical}</p></div></li>)}</ol> : <p className="action-plan-empty">Pick one practical change. That is enough for now.</p>}
        <div className="action-plan-links"><a href="/quick-action-card">See all 12 actions <span>→</span></a></div>
      </div>
    </div>
  </section>;
}

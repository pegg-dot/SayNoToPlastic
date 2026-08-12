"use client";

import { useEffect, useState } from "react";
import { learningSeries } from "../content/community-programs";
import { TrackedLink } from "./TrackedLink";
import { trackEvent } from "./ConsentAnalytics";

const STORAGE_KEY = "say-no-to-plastic-learning-path-v1";

export function CommunityLearningPath() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (Array.isArray(stored)) setCompleted([...new Set(stored.filter((item): item is number => Number.isInteger(item) && item >= 1 && item <= learningSeries.length))].sort((a, b) => a - b));
      } catch {
        // An empty learning path is a safe fallback.
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Reading progress still works for the current session.
    }
  }, [completed, ready]);

  function toggle(step: number) {
    setCompleted((current) => current.includes(step) ? current.filter((item) => item !== step) : [...current, step].sort((a, b) => a - b));
    void trackEvent("community_learning_progress", { label: `step-${step}` });
  }

  return <div className="community-learning-path">
    <div className="community-learning-progress" aria-live="polite"><div><span style={{ width: `${(completed.length / learningSeries.length) * 100}%` }} /></div><p><strong>{completed.length}</strong> of {learningSeries.length} readings marked complete</p></div>
    <div className="community-learning-grid">
      {learningSeries.map((item) => {
        const done = completed.includes(item.step);
        return <article key={item.step} className={done ? "is-complete" : ""}>
          <span>{item.number}</span>
          <p className="community-learning-eyebrow">{item.eyebrow}</p>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <div><TrackedLink href={item.href} eventName="community_learning_open" label={`community-learning-${item.number}`}>Open reading <b>→</b></TrackedLink><button type="button" aria-pressed={done} onClick={() => toggle(item.step)}>{done ? "✓ Read" : "Mark as read"}</button></div>
        </article>;
      })}
    </div>
  </div>;
}

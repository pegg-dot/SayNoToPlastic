"use client";

import { useEffect, useMemo, useState } from "react";
import { sevenDayChallenge, thirtyDayChallenge, type ChallengeTask } from "../content/community-programs";
import { TrackedLink } from "./TrackedLink";
import { trackEvent } from "./ConsentAnalytics";

type Plan = "7" | "30";
const STORAGE_PREFIX = "say-no-to-plastic-challenge-v1";

function readStored(plan: Plan) {
  try {
    const value = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}-${plan}`) || "[]");
    const maximum = plan === "7" ? 7 : 30;
    return Array.isArray(value)
      ? [...new Set(value.filter((item): item is number => Number.isInteger(item) && item >= 1 && item <= maximum))].sort((a, b) => a - b)
      : [];
  } catch {
    return [];
  }
}

function TaskRow({ task, checked, onToggle }: { task: ChallengeTask; checked: boolean; onToggle: () => void }) {
  const id = `challenge-task-${task.day}`;
  return <li className={checked ? "is-complete" : ""}><label htmlFor={id}><input id={id} type="checkbox" checked={checked} onChange={onToggle}/><i aria-hidden="true"/><span><b>Day {String(task.day).padStart(2, "0")}</b><strong>{task.title}</strong><small>{task.text}</small></span></label>{task.href && task.linkLabel && <TrackedLink href={task.href} eventName="challenge_resource_open" label={`challenge-day-${task.day}`}>{task.linkLabel} <span>→</span></TrackedLink>}</li>;
}

export function CommunityChallenge() {
  const [plan, setPlan] = useState<Plan>("7");
  const [checked7, setChecked7] = useState<number[]>([]);
  const [checked30, setChecked30] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setChecked7(readStored("7"));
      setChecked30(readStored("30"));
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}-7`, JSON.stringify(checked7));
      localStorage.setItem(`${STORAGE_PREFIX}-30`, JSON.stringify(checked30));
    } catch {
      // Challenge progress still works for the current session.
    }
  }, [checked7, checked30, ready]);

  const tasks = plan === "7" ? sevenDayChallenge : thirtyDayChallenge;
  const checked = plan === "7" ? checked7 : checked30;
  const weeks = useMemo(() => plan === "30" ? [
    tasks.slice(0, 7),
    tasks.slice(7, 14),
    tasks.slice(14, 21),
    tasks.slice(21, 30),
  ] : [tasks], [plan, tasks]);

  function toggle(day: number) {
    const setter = plan === "7" ? setChecked7 : setChecked30;
    setter((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b));
    void trackEvent("community_challenge_progress", { label: `${plan}-day-${day}` });
  }

  function changePlan(next: Plan) {
    setPlan(next);
    void trackEvent("community_challenge_select", { label: `${next}-day` });
  }

  function moveTab(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next: Plan = event.key === "ArrowLeft" || event.key === "Home" ? "7" : "30";
    changePlan(next);
    requestAnimationFrame(() => document.getElementById(`challenge-tab-${next}`)?.focus());
  }

  function reset() {
    if (plan === "7") setChecked7([]); else setChecked30([]);
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}-${plan}`);
    } catch {
      // State has already been reset in memory.
    }
    void trackEvent("community_challenge_reset", { label: `${plan}-day` });
  }

  function print() {
    void trackEvent("cta_click", { label: `community-challenge-${plan}-print` });
    window.print();
  }

  return <section className="community-challenge" aria-labelledby="community-challenge-title" data-print-section>
    <header><div><p className="eyebrow dark">Self-paced challenge</p><h2 id="community-challenge-title">Turn information into a routine you can keep.</h2><p>Use seven days for one focused reset or thirty days for a slower learning-and-action path. This is not a detox, treatment, or purity test.</p></div><aside aria-live="polite"><strong>{checked.length}</strong><span>of {tasks.length} days complete</span><div><i style={{ width: `${(checked.length / tasks.length) * 100}%` }}/></div></aside></header>
    <div className="community-challenge-tabs" role="tablist" aria-label="Challenge length"><button id="challenge-tab-7" type="button" role="tab" aria-selected={plan === "7"} aria-controls="challenge-panel" tabIndex={plan === "7" ? 0 : -1} onKeyDown={moveTab} onClick={() => changePlan("7")}>7-day reset</button><button id="challenge-tab-30" type="button" role="tab" aria-selected={plan === "30"} aria-controls="challenge-panel" tabIndex={plan === "30" ? 0 : -1} onKeyDown={moveTab} onClick={() => changePlan("30")}>30-day practice</button></div>
    <div id="challenge-panel" className="community-challenge-body" role="tabpanel" aria-labelledby={`challenge-tab-${plan}`} tabIndex={0}>
      {weeks.map((week, index) => plan === "30" ? <details key={index} open={index === 0}><summary>Week {index + 1}<span>{week.filter((task) => checked.includes(task.day)).length} / {week.length}</span></summary><ol>{week.map((task) => <TaskRow key={task.day} task={task} checked={checked.includes(task.day)} onToggle={() => toggle(task.day)}/>)}</ol></details> : <ol key="seven-day">{week.map((task) => <TaskRow key={task.day} task={task} checked={checked.includes(task.day)} onToggle={() => toggle(task.day)}/>)}</ol>)}
    </div>
    <footer><div><button className="button navy" type="button" onClick={print}>Print this plan <span>↗</span></button><a className="button outline" href={plan === "7" ? "/downloads/sntp-7-day-challenge.pdf" : "/downloads/sntp-30-day-challenge.pdf"} download>Download blank PDF <span>↓</span></a></div><button className="challenge-reset" type="button" onClick={reset}>Reset {plan}-day progress</button><p>Your progress is stored only on this device. Keep medical care, hygiene, food safety, infant feeding, accessibility, and emergencies ahead of plastic-reduction goals.</p></footer>
  </section>;
}

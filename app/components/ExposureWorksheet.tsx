"use client";

import { useEffect, useMemo, useState } from "react";
import { reduceExposureGroups } from "../content/haddad-topics";
import { trackEvent } from "./ConsentAnalytics";

const STORAGE_KEY = "say-no-to-plastic-exposure-worksheet-v1";

type WorksheetState = {
  checked: string[];
  priority: string;
  note: string;
};

const actions = reduceExposureGroups.flatMap((group) => group.actions.map((text, index) => ({
  id: `${group.id}-${index + 1}`,
  groupId: group.id,
  groupTitle: group.title,
  text,
})));
const actionIds = new Set(actions.map((action) => action.id));

export function ExposureWorksheet() {
  const [checked, setChecked] = useState<string[]>([]);
  const [priority, setPriority] = useState("");
  const [note, setNote] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Partial<WorksheetState>;
        if (Array.isArray(stored.checked)) setChecked([...new Set(stored.checked.filter((item): item is string => typeof item === "string" && actionIds.has(item)))]);
        if (typeof stored.priority === "string" && actionIds.has(stored.priority)) setPriority(stored.priority);
        if (typeof stored.note === "string") setNote(stored.note.slice(0, 500));
      } catch {
        // A blank worksheet is a safe fallback.
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ checked, priority, note } satisfies WorksheetState));
    } catch {
      // The worksheet remains usable when browser storage is unavailable.
    }
  }, [checked, priority, note, ready]);

  const selectedActions = useMemo(() => actions.filter((action) => checked.includes(action.id)), [checked]);
  const primaryAction = actions.find((action) => action.id === priority) || null;

  function toggle(id: string) {
    setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    void trackEvent("worksheet_action_toggle", { label: id });
  }

  function reset() {
    setChecked([]);
    setPriority("");
    setNote("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // State has already been reset in memory.
    }
    void trackEvent("worksheet_reset", { label: "reduce-exposure" });
  }

  function print() {
    void trackEvent("cta_click", { label: "reduce-exposure-worksheet-print" });
    window.print();
  }

  return (
    <section className="exposure-worksheet" aria-labelledby="exposure-worksheet-title" data-print-section>
      <header>
        <div>
          <p className="eyebrow dark">Interactive worksheet</p>
          <h2 id="exposure-worksheet-title">Choose less. Keep what works.</h2>
          <p>Check ideas worth considering, then name one priority. Your choices stay on this device and are not sent to the site.</p>
        </div>
        <aside aria-live="polite"><strong>{checked.length}</strong><span>ideas marked for review</span><small>One priority is enough.</small></aside>
      </header>

      <div className="exposure-worksheet-groups">
        {reduceExposureGroups.map((group) => (
          <fieldset key={group.id}>
            <legend><span>{group.number}</span><strong>{group.title}</strong></legend>
            <p>{group.summary}</p>
            <div>
              {group.actions.map((text, index) => {
                const id = `${group.id}-${index + 1}`;
                const inputId = `worksheet-${id}`;
                return <label key={id} htmlFor={inputId} className={checked.includes(id) ? "is-checked" : ""}><input id={inputId} type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)} /><i aria-hidden="true"/><span>{text}</span></label>;
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="exposure-worksheet-commitment">
        <div>
          <label htmlFor="worksheet-priority">My one priority for the next month</label>
          <select id="worksheet-priority" value={priority} onChange={(event) => { setPriority(event.target.value); void trackEvent("worksheet_priority_select", { label: event.target.value || "none" }); }}>
            <option value="">Choose one practical action</option>
            {(selectedActions.length ? selectedActions : actions).map((action) => <option key={action.id} value={action.id}>{action.groupTitle}: {action.text}</option>)}
          </select>
          <label htmlFor="worksheet-note">What will make this easier to repeat?</label>
          <textarea id="worksheet-note" value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} placeholder="Example: keep the glass container beside the lunch bag." />
        </div>
        <aside>
          <span>Current commitment</span>
          <strong>{primaryAction ? primaryAction.text : "Choose one action, not an entire lifestyle overhaul."}</strong>
          <p>{note || "Add a practical cue, location, or routine that makes the change easier to remember."}</p>
        </aside>
      </div>

      <footer>
        <div><button className="button navy" type="button" onClick={print}>Print or save this worksheet <span>↗</span></button><a className="button outline" href="/downloads/reduce-exposure-worksheet.pdf" download>Download the blank PDF <span>↓</span></a></div>
        <button className="worksheet-reset" type="button" onClick={reset}>Reset saved choices</button>
        <p>Keep established medical, hygiene, food-safety, accessibility, and emergency needs first. This worksheet is educational and does not provide medical advice.</p>
      </footer>
    </section>
  );
}

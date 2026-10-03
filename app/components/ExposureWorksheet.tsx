"use client";

import { useEffect, useMemo, useState } from "react";
import { reduceExposureGroups } from "../content/haddad-topics";
import { reduceExposureGroupsEs } from "../content/es/haddad-topics";
import type { SiteLocale } from "../lib/i18n";
import { trackEvent } from "./ConsentAnalytics";

const STORAGE_KEY = "say-no-to-plastic-exposure-worksheet-v1";

type WorksheetState = {
  checked: string[];
  priority: string;
  note: string;
};

const copy = {
  en: {
    eyebrow: "Interactive worksheet",
    title: "Choose less. Keep what works.",
    intro: "Check ideas worth considering, then name one priority. Your choices stay on this device and are not sent to the site.",
    marked: "ideas marked for review",
    enough: "One priority is enough.",
    priorityLabel: "My one priority for the next month",
    priorityPlaceholder: "Choose one practical action",
    noteLabel: "What will make this easier to repeat?",
    notePlaceholder: "Example: keep the glass container beside the lunch bag.",
    current: "Current commitment",
    currentEmpty: "Choose one action, not an entire lifestyle overhaul.",
    noteEmpty: "Add a practical cue, location, or routine that makes the change easier to remember.",
    print: "Print or save this worksheet",
    download: "Download the blank PDF",
    reset: "Reset saved choices",
    boundary: "Keep established medical, hygiene, food-safety, accessibility, and emergency needs first. This worksheet is educational and does not provide medical advice.",
  },
  es: {
    eyebrow: "Hoja de trabajo interactiva",
    title: "Elige menos. Conserva lo que funciona.",
    intro: "Marca ideas que vale la pena considerar y después elige una prioridad. Tus elecciones se quedan en este dispositivo y no se envían al sitio.",
    marked: "ideas marcadas para revisar",
    enough: "Una prioridad es suficiente.",
    priorityLabel: "Mi prioridad para el próximo mes",
    priorityPlaceholder: "Elige una acción práctica",
    noteLabel: "¿Qué hará que sea más fácil repetir este cambio?",
    notePlaceholder: "Ejemplo: dejar el recipiente de vidrio junto a la bolsa del almuerzo.",
    current: "Compromiso actual",
    currentEmpty: "Elige una acción, no una transformación completa de tu estilo de vida.",
    noteEmpty: "Añade una señal práctica, un lugar o una rutina que haga el cambio más fácil de recordar.",
    print: "Imprimir o guardar esta hoja",
    download: "Descargar el PDF en blanco",
    reset: "Borrar las elecciones guardadas",
    boundary: "Mantén primero las necesidades médicas, de higiene, seguridad alimentaria, accesibilidad y emergencia. Esta hoja es educativa y no ofrece consejo médico.",
  },
} as const;

export function ExposureWorksheet({ locale = "en" }: { locale?: SiteLocale }) {
  const [checked, setChecked] = useState<string[]>([]);
  const [priority, setPriority] = useState("");
  const [note, setNote] = useState("");
  const [ready, setReady] = useState(false);
  const groups = locale === "es" ? reduceExposureGroupsEs : reduceExposureGroups;
  const text = copy[locale];
  const actions = useMemo(() => groups.flatMap((group) => group.actions.map((actionText, index) => ({
    id: `${group.id}-${index + 1}`,
    groupId: group.id,
    groupTitle: group.title,
    text: actionText,
  }))), [groups]);
  const actionIds = useMemo(() => new Set(actions.map((action) => action.id)), [actions]);

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
  }, [actionIds]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ checked, priority, note } satisfies WorksheetState));
    } catch {
      // The worksheet remains usable when browser storage is unavailable.
    }
  }, [checked, priority, note, ready]);

  const selectedActions = useMemo(() => actions.filter((action) => checked.includes(action.id)), [checked, actions]);
  const primaryAction = actions.find((action) => action.id === priority) || null;

  function toggle(id: string) {
    setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    void trackEvent("worksheet_action_toggle", { label: `${locale}:${id}` });
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
    void trackEvent("worksheet_reset", { label: locale === "es" ? "reduce-exposure-es" : "reduce-exposure" });
  }

  function print() {
    void trackEvent("cta_click", { label: locale === "es" ? "reduce-exposure-worksheet-print-es" : "reduce-exposure-worksheet-print" });
    window.print();
  }

  return (
    <section className="exposure-worksheet" aria-labelledby="exposure-worksheet-title" data-print-section>
      <header>
        <div>
          <p className="eyebrow dark">{text.eyebrow}</p>
          <h2 id="exposure-worksheet-title">{text.title}</h2>
          <p>{text.intro}</p>
        </div>
        <aside aria-live="polite"><strong>{checked.length}</strong><span>{text.marked}</span><small>{text.enough}</small></aside>
      </header>

      <div className="exposure-worksheet-groups">
        {groups.map((group) => (
          <fieldset key={group.id}>
            <legend><span>{group.number}</span><strong>{group.title}</strong></legend>
            <p>{group.summary}</p>
            <div>
              {group.actions.map((actionText, index) => {
                const id = `${group.id}-${index + 1}`;
                const inputId = `worksheet-${locale}-${id}`;
                return <label key={id} htmlFor={inputId} className={checked.includes(id) ? "is-checked" : ""}><input id={inputId} type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)} /><i aria-hidden="true"/><span>{actionText}</span></label>;
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="exposure-worksheet-commitment">
        <div>
          <label htmlFor={`worksheet-priority-${locale}`}>{text.priorityLabel}</label>
          <select id={`worksheet-priority-${locale}`} value={priority} onChange={(event) => { setPriority(event.target.value); void trackEvent("worksheet_priority_select", { label: `${locale}:${event.target.value || "none"}` }); }}>
            <option value="">{text.priorityPlaceholder}</option>
            {(selectedActions.length ? selectedActions : actions).map((action) => <option key={action.id} value={action.id}>{action.groupTitle}: {action.text}</option>)}
          </select>
          <label htmlFor={`worksheet-note-${locale}`}>{text.noteLabel}</label>
          <textarea id={`worksheet-note-${locale}`} value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} placeholder={text.notePlaceholder} />
        </div>
        <aside>
          <span>{text.current}</span>
          <strong>{primaryAction ? primaryAction.text : text.currentEmpty}</strong>
          <p>{note || text.noteEmpty}</p>
        </aside>
      </div>

      <footer>
        <div><button className="button navy" type="button" onClick={print}>{text.print} <span>↗</span></button><a className="button outline" href="/downloads/reduce-exposure-worksheet.pdf" download>{text.download} <span>↓</span></a></div>
        <button className="worksheet-reset" type="button" onClick={reset}>{text.reset}</button>
        <p>{text.boundary}</p>
      </footer>
    </section>
  );
}

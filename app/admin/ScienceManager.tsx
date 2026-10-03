"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminContentRecord, OwnerScienceChapterId, OwnerScienceStudy } from "../lib/admin-content";
import styles from "./admin.module.css";

const chapterOptions: Array<{ id: OwnerScienceChapterId; label: string }> = [
  { id: "blood", label: "Bloodstream" },
  { id: "brain", label: "Brain tissue" },
  { id: "heart-arteries", label: "Heart and arteries" },
  { id: "pregnancy", label: "Pregnancy" },
  { id: "placenta", label: "Placenta" },
  { id: "ovary", label: "Ovary and developing eggs" },
  { id: "testicular-tissue", label: "Testicular tissue" },
];

function parseStudies(value: string): OwnerScienceStudy[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as OwnerScienceStudy[] : [];
  } catch {
    return [];
  }
}

function blankStudy(): OwnerScienceStudy {
  return {
    id: `science-${Date.now().toString(36)}`,
    chapterId: "blood",
    headline: "",
    stat: "",
    statLabel: "",
    finding: "",
    meaning: "",
    studyType: "",
    sample: "",
    method: "",
    limits: "",
    year: "",
    journal: "",
    source: "",
    doi: "",
    published: false,
  };
}

function chapterLabel(id: OwnerScienceChapterId) {
  return chapterOptions.find((chapter) => chapter.id === id)?.label || id;
}

export function ScienceManager({
  value,
  saveState,
  onSave,
}: {
  value: string;
  saveState: "idle" | "saving" | "saved" | "error";
  onSave: (value: string) => Promise<AdminContentRecord | null>;
}) {
  const initialStudies = useMemo(() => parseStudies(value), [value]);
  const [studies, setStudies] = useState<OwnerScienceStudy[]>(() => initialStudies);
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(() => initialStudies[0]?.id ?? null);
  const [message, setMessage] = useState("");
  const serialized = useMemo(() => JSON.stringify(studies), [studies]);
  const dirty = serialized !== (value || "[]");
  const selectedStudy = studies.find((study) => study.id === selectedStudyId) ?? studies[0] ?? null;

  useEffect(() => {
    const next = parseStudies(value);
    setStudies(next);
    setSelectedStudyId((current) => current && next.some((study) => study.id === current) ? current : next[0]?.id ?? null);
  }, [value]);

  function patchStudy(id: string, patch: Partial<OwnerScienceStudy>) {
    setMessage("");
    setStudies((current) => current.map((study) => study.id === id ? { ...study, ...patch } : study));
  }

  function addStudy() {
    const next = blankStudy();
    setStudies((current) => [next, ...current]);
    setSelectedStudyId(next.id);
    setMessage("New private draft created. Complete the evidence steps before publishing.");
  }

  function removeStudy(study: OwnerScienceStudy) {
    if (!window.confirm(`Remove “${study.headline || "this science draft"}”? It will disappear from the Science page after you save if it is currently published.`)) return;
    const fallback = studies.find((candidate) => candidate.id !== study.id)?.id ?? null;
    setStudies((current) => current.filter((candidate) => candidate.id !== study.id));
    if (selectedStudyId === study.id) setSelectedStudyId(fallback);
    setMessage("Study removed from this draft. Save to make the removal live.");
  }

  async function save() {
    setMessage("");
    const saved = await onSave(serialized);
    if (saved) setMessage("Science changes saved. Published studies are now live.");
  }

  return (
    <section className={styles.scienceManager}>
      <div className={styles.objectToolbar}>
        <div>
          <p className={styles.kicker}>Human evidence</p>
          <h3>Studies</h3>
          <p>Choose a study, then work through it one step at a time.</p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={addStudy}>+ Add study</button>
      </div>

      <details className={styles.scienceGuardrail}>
        <summary>Why Science has extra safeguards</summary>
        <p>Published studies require a source, finding, why-it-matters explanation, method, sample, limitations, journal, and year. These fields keep the public claim attached to the original evidence and its uncertainty.</p>
      </details>

      {studies.length === 0 ? (
        <div className={styles.emptyBox}>No owner-added studies yet. The reviewed studies already on the Science page remain unchanged.</div>
      ) : (
        <div className={styles.objectWorkbench}>
          <aside className={styles.objectList} aria-label="Owner-added science studies">
            <div className={styles.objectListHeading}><strong>Studies</strong><span>{studies.length}</span></div>
            {studies.map((study) => (
              <button key={study.id} type="button" className={selectedStudy?.id === study.id ? styles.objectListActive : ""} aria-pressed={selectedStudy?.id === study.id} onClick={() => { setSelectedStudyId(study.id); setMessage(""); }}>
                <div><span className={study.published ? styles.newsletterLive : styles.newsletterDraft}>{study.published ? "Published" : "Draft"}</span><small>{chapterLabel(study.chapterId)}</small></div>
                <strong>{study.headline || "Untitled study"}</strong>
                <small>{study.stat ? `${study.stat} · ${study.statLabel || "key result"}` : "No key result yet"}</small>
              </button>
            ))}
          </aside>

          {selectedStudy && (
            <article className={styles.objectDetail}>
              <header className={styles.objectDetailHeader}>
                <div>
                  <span className={selectedStudy.published ? styles.newsletterLive : styles.newsletterDraft}>{selectedStudy.published ? "Published" : "Draft"}</span>
                  <h4>{selectedStudy.headline || "Untitled study"}</h4>
                  <small>{chapterLabel(selectedStudy.chapterId)}</small>
                </div>
                <label className={styles.publishSwitch}>
                  <input type="checkbox" checked={selectedStudy.published} onChange={(event) => patchStudy(selectedStudy.id, { published: event.target.checked })} />
                  <span>{selectedStudy.published ? "Published" : "Keep private"}</span>
                </label>
              </header>

              <div className={styles.sciencePreviewCard}>
                <span>{selectedStudy.stat || "Key result"}</span>
                <div><small>{selectedStudy.statLabel || "What the number represents"}</small><strong>{selectedStudy.headline || "Study headline preview"}</strong><p>{selectedStudy.finding || "The public finding will appear here once entered."}</p></div>
              </div>

              <div className={styles.guidedEditor}>
                <details className={styles.guidedSection} open>
                  <summary><span>1</span><div><strong>What the study found</strong><small>The public-facing finding and why it matters</small></div></summary>
                  <div className={styles.guidedSectionBody}>
                    <label>Body-system chapter<select value={selectedStudy.chapterId} onChange={(event) => patchStudy(selectedStudy.id, { chapterId: event.target.value as OwnerScienceChapterId })}>{chapterOptions.map((chapter) => <option value={chapter.id} key={chapter.id}>{chapter.label}</option>)}</select></label>
                    <label>Study headline<input value={selectedStudy.headline} maxLength={180} placeholder="What did the study find?" onChange={(event) => patchStudy(selectedStudy.id, { headline: event.target.value })} /></label>
                    <div className={styles.scienceTwoCol}>
                      <label>Key number / statistic<input value={selectedStudy.stat} maxLength={80} placeholder="Example: 17 of 22" onChange={(event) => patchStudy(selectedStudy.id, { stat: event.target.value })} /></label>
                      <label>What that number means<input value={selectedStudy.statLabel} maxLength={180} placeholder="people had plastic detected in blood" onChange={(event) => patchStudy(selectedStudy.id, { statLabel: event.target.value })} /></label>
                    </div>
                    <label>What researchers found<textarea value={selectedStudy.finding} maxLength={900} onChange={(event) => patchStudy(selectedStudy.id, { finding: event.target.value })} /></label>
                    <label>Why it matters<textarea value={selectedStudy.meaning} maxLength={900} onChange={(event) => patchStudy(selectedStudy.id, { meaning: event.target.value })} /></label>
                  </div>
                </details>

                <details className={styles.guidedSection}>
                  <summary><span>2</span><div><strong>How the study was done</strong><small>Study design, sample, and method</small></div></summary>
                  <div className={styles.guidedSectionBody}>
                    <div className={styles.scienceTwoCol}>
                      <label>Study type<input value={selectedStudy.studyType} maxLength={180} placeholder="Prospective observational study" onChange={(event) => patchStudy(selectedStudy.id, { studyType: event.target.value })} /></label>
                      <label>Sample<input value={selectedStudy.sample} maxLength={700} placeholder="Who or what was studied?" onChange={(event) => patchStudy(selectedStudy.id, { sample: event.target.value })} /></label>
                    </div>
                    <label>Method<textarea value={selectedStudy.method} maxLength={700} onChange={(event) => patchStudy(selectedStudy.id, { method: event.target.value })} /></label>
                  </div>
                </details>

                <details className={styles.guidedSection}>
                  <summary><span>3</span><div><strong>Limitations & source</strong><small>What it cannot prove and where the evidence comes from</small></div></summary>
                  <div className={styles.guidedSectionBody}>
                    <label>Limitations<textarea value={selectedStudy.limits} maxLength={1000} placeholder="What this study cannot establish" onChange={(event) => patchStudy(selectedStudy.id, { limits: event.target.value })} /></label>
                    <div className={styles.scienceThreeCol}>
                      <label>Year<input value={selectedStudy.year} maxLength={40} placeholder="2026" onChange={(event) => patchStudy(selectedStudy.id, { year: event.target.value })} /></label>
                      <label>Journal<input value={selectedStudy.journal} maxLength={180} onChange={(event) => patchStudy(selectedStudy.id, { journal: event.target.value })} /></label>
                      <label>DOI <small>optional</small><input value={selectedStudy.doi} maxLength={200} placeholder="10.xxxx/..." onChange={(event) => patchStudy(selectedStudy.id, { doi: event.target.value })} /></label>
                    </div>
                    <label>Original source URL<input type="url" value={selectedStudy.source} maxLength={500} placeholder="https://..." onChange={(event) => patchStudy(selectedStudy.id, { source: event.target.value })} /></label>
                  </div>
                </details>
              </div>

              <details className={styles.objectMore}>
                <summary>More actions</summary>
                <div>{selectedStudy.source ? <a href={selectedStudy.source} target="_blank" rel="noreferrer">Open source ↗</a> : null}<button type="button" onClick={() => removeStudy(selectedStudy)}>Remove study</button></div>
              </details>
            </article>
          )}
        </div>
      )}

      {(dirty || Boolean(message) || saveState === "saving" || saveState === "error") && <div className={styles.scienceSaveBar}>
        <div>{message ? <span className={styles.success}>{message}</span> : <span className={styles.saveHint}>{dirty ? "You have unpublished science changes." : "Everything is saved."}</span>}</div>
        <div><a className={styles.secondaryButton} href="/science" target="_blank" rel="noreferrer">View Science page ↗</a><button className={styles.primaryButton} type="button" disabled={!dirty || saveState === "saving"} onClick={() => void save()}>{saveState === "saving" ? "Saving…" : "Save science changes"}</button></div>
      </div>}
    </section>
  );
}

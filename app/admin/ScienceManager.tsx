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
    setStudies((current) => current.map((study) => study.id === id ? { ...study, ...patch } : study));
  }

  function addStudy() {
    const next = blankStudy();
    setStudies((current) => [next, ...current]);
    setSelectedStudyId(next.id);
    setMessage("New study created as a private draft. Fill in the evidence before publishing.");
  }

  function removeStudy(study: OwnerScienceStudy) {
    if (!window.confirm(`Remove “${study.headline || "this science draft"}”? It will disappear from the public Science page after you save if it is currently published.`)) return;
    const fallback = studies.find((candidate) => candidate.id !== study.id)?.id ?? null;
    setStudies((current) => current.filter((candidate) => candidate.id !== study.id));
    if (selectedStudyId === study.id) setSelectedStudyId(fallback);
    setMessage("Study removed from this draft. Save science changes to make that removal live.");
  }

  async function save() {
    setMessage("");
    const saved = await onSave(serialized);
    if (saved) setMessage("Science changes saved. Published studies are now live.");
  }

  return (
    <section className={styles.scienceManager}>
      <div className={styles.scienceManagerHeader}>
        <div>
          <p className={styles.kicker}>Human evidence</p>
          <h3>Studies</h3>
          <p>Choose one study, then edit only that study. Nothing new is public until you mark it Published and save.</p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={addStudy}>+ Add research study</button>
      </div>

      <div className={styles.scienceGuardrail}>
        <strong>Publication guardrails</strong>
        <span>Published studies require a source, finding, why-it-matters explanation, method, sample, limitations, journal, and year. This keeps uncertainty and the original paper attached to every public entry.</span>
      </div>

      {studies.length === 0 ? (
        <div className={styles.emptyBox}>No owner-added studies yet. The reviewed source studies on the Science page remain unchanged.</div>
      ) : (
        <div className={styles.scienceWorkbench}>
          <aside className={styles.scienceStudyNav} aria-label="Owner-added science studies">
            <div className={styles.scienceStudyNavHeading}>
              <strong>Studies</strong>
              <span>{studies.length}</span>
            </div>
            {studies.map((study) => (
              <button
                key={study.id}
                type="button"
                className={selectedStudy?.id === study.id ? styles.scienceStudyNavActive : ""}
                aria-pressed={selectedStudy?.id === study.id}
                onClick={() => { setSelectedStudyId(study.id); setMessage(""); }}
              >
                <div>
                  <span className={study.published ? styles.newsletterLive : styles.newsletterDraft}>{study.published ? "Published" : "Draft"}</span>
                  <small>{chapterLabel(study.chapterId)}</small>
                </div>
                <strong>{study.headline || "Untitled study"}</strong>
                <small>{study.stat ? `${study.stat} · ${study.statLabel || "key result"}` : "No key result entered yet"}</small>
              </button>
            ))}
          </aside>

          {selectedStudy && (
            <article className={styles.scienceStudyEditor}>
              <div className={styles.scienceStudyTop}>
                <div>
                  <span className={selectedStudy.published ? styles.newsletterLive : styles.newsletterDraft}>{selectedStudy.published ? "Published" : "Draft"}</span>
                  <small>{chapterLabel(selectedStudy.chapterId)}</small>
                </div>
                <label className={styles.publishSwitch}>
                  <input
                    type="checkbox"
                    checked={selectedStudy.published}
                    onChange={(event) => patchStudy(selectedStudy.id, { published: event.target.checked })}
                  />
                  <span>{selectedStudy.published ? "Show on Science page" : "Keep private"}</span>
                </label>
              </div>

              <div className={styles.sciencePreviewCard}>
                <span>{selectedStudy.stat || "Key result"}</span>
                <div>
                  <small>{selectedStudy.statLabel || "What the number represents"}</small>
                  <strong>{selectedStudy.headline || "Study headline preview"}</strong>
                  <p>{selectedStudy.finding || "The public finding will appear here once entered."}</p>
                </div>
              </div>

              <div className={styles.scienceFields}>
                <label>Body-system chapter
                  <select value={selectedStudy.chapterId} onChange={(event) => patchStudy(selectedStudy.id, { chapterId: event.target.value as OwnerScienceChapterId })}>
                    {chapterOptions.map((chapter) => <option value={chapter.id} key={chapter.id}>{chapter.label}</option>)}
                  </select>
                </label>
                <label>Study headline
                  <input value={selectedStudy.headline} maxLength={180} placeholder="What did the study find?" onChange={(event) => patchStudy(selectedStudy.id, { headline: event.target.value })} />
                </label>
                <div className={styles.scienceTwoCol}>
                  <label>Key number / statistic
                    <input value={selectedStudy.stat} maxLength={80} placeholder="Example: 17 of 22" onChange={(event) => patchStudy(selectedStudy.id, { stat: event.target.value })} />
                  </label>
                  <label>What that number means
                    <input value={selectedStudy.statLabel} maxLength={180} placeholder="people had plastic detected in blood" onChange={(event) => patchStudy(selectedStudy.id, { statLabel: event.target.value })} />
                  </label>
                </div>
                <label>What researchers found
                  <textarea value={selectedStudy.finding} maxLength={900} onChange={(event) => patchStudy(selectedStudy.id, { finding: event.target.value })} />
                </label>
                <label>Why it matters
                  <textarea value={selectedStudy.meaning} maxLength={900} onChange={(event) => patchStudy(selectedStudy.id, { meaning: event.target.value })} />
                </label>
                <div className={styles.scienceTwoCol}>
                  <label>Study type
                    <input value={selectedStudy.studyType} maxLength={180} placeholder="Prospective observational study" onChange={(event) => patchStudy(selectedStudy.id, { studyType: event.target.value })} />
                  </label>
                  <label>Sample
                    <input value={selectedStudy.sample} maxLength={700} placeholder="Who or what was studied?" onChange={(event) => patchStudy(selectedStudy.id, { sample: event.target.value })} />
                  </label>
                </div>
                <label>Method
                  <textarea value={selectedStudy.method} maxLength={700} onChange={(event) => patchStudy(selectedStudy.id, { method: event.target.value })} />
                </label>
                <label>Limitations
                  <textarea value={selectedStudy.limits} maxLength={1000} placeholder="What this study cannot establish" onChange={(event) => patchStudy(selectedStudy.id, { limits: event.target.value })} />
                </label>
                <div className={styles.scienceThreeCol}>
                  <label>Year
                    <input value={selectedStudy.year} maxLength={40} placeholder="2026" onChange={(event) => patchStudy(selectedStudy.id, { year: event.target.value })} />
                  </label>
                  <label>Journal
                    <input value={selectedStudy.journal} maxLength={180} onChange={(event) => patchStudy(selectedStudy.id, { journal: event.target.value })} />
                  </label>
                  <label>DOI <small>optional</small>
                    <input value={selectedStudy.doi} maxLength={200} placeholder="10.xxxx/..." onChange={(event) => patchStudy(selectedStudy.id, { doi: event.target.value })} />
                  </label>
                </div>
                <label>Original source URL
                  <input type="url" value={selectedStudy.source} maxLength={500} placeholder="https://..." onChange={(event) => patchStudy(selectedStudy.id, { source: event.target.value })} />
                </label>
              </div>

              <div className={styles.scienceStudyFooter}>
                <span>{selectedStudy.published ? "This study will be public after you save." : "This study remains private after you save."}</span>
                <div>
                  {selectedStudy.source ? <a href={selectedStudy.source} target="_blank" rel="noreferrer">Open source ↗</a> : null}
                  <button type="button" onClick={() => removeStudy(selectedStudy)}>Remove study</button>
                </div>
              </div>
            </article>
          )}
        </div>
      )}

      <div className={styles.scienceSaveBar}>
        <div>
          {message ? <span className={styles.success}>{message}</span> : <span className={styles.saveHint}>{dirty ? "You have unsaved science changes." : "Everything is saved."}</span>}
        </div>
        <div>
          <a className={styles.secondaryButton} href="/science" target="_blank" rel="noreferrer">View Science page ↗</a>
          <button className={styles.primaryButton} type="button" disabled={!dirty || saveState === "saving"} onClick={() => void save()}>{saveState === "saving" ? "Saving…" : "Save science changes"}</button>
        </div>
      </div>
    </section>
  );
}

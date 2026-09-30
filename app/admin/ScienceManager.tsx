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
  const [studies, setStudies] = useState<OwnerScienceStudy[]>(() => parseStudies(value));
  const [message, setMessage] = useState("");
  const serialized = useMemo(() => JSON.stringify(studies), [studies]);
  const dirty = serialized !== (value || "");

  useEffect(() => {
    setStudies(parseStudies(value));
  }, [value]);

  function patchStudy(id: string, patch: Partial<OwnerScienceStudy>) {
    setStudies((current) => current.map((study) => study.id === id ? { ...study, ...patch } : study));
  }

  function removeStudy(study: OwnerScienceStudy) {
    if (!window.confirm(`Remove “${study.headline || "this science draft"}”? It will disappear from the public Science page after you save if it is currently published.`)) return;
    setStudies((current) => current.filter((candidate) => candidate.id !== study.id));
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
          <p className={styles.kicker}>Structured research editor</p>
          <h3>Human evidence studies</h3>
          <p>Add research as structured evidence, not as a free-form article. A study stays private until you explicitly mark it Published and save.</p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={() => setStudies((current) => [blankStudy(), ...current])}>+ Add research study</button>
      </div>

      <div className={styles.scienceGuardrail}>
        <strong>Publication guardrails</strong>
        <span>Published studies require a source, finding, why-it-matters explanation, method, sample, limitations, journal, and year. This keeps uncertainty and the original paper attached to every public entry.</span>
      </div>

      {studies.length === 0 ? (
        <div className={styles.emptyBox}>No owner-added studies yet. The reviewed source studies on the Science page remain unchanged.</div>
      ) : (
        <div className={styles.scienceStudyList}>
          {studies.map((study, index) => (
            <article className={styles.scienceStudyEditor} key={study.id}>
              <div className={styles.scienceStudyTop}>
                <div>
                  <span className={study.published ? styles.newsletterLive : styles.newsletterDraft}>{study.published ? "Published" : "Draft"}</span>
                  <small>{chapterLabel(study.chapterId)} · owner-added study {studies.length - index}</small>
                </div>
                <label className={styles.publishSwitch}>
                  <input
                    type="checkbox"
                    checked={study.published}
                    onChange={(event) => patchStudy(study.id, { published: event.target.checked })}
                  />
                  <span>{study.published ? "Show on Science page" : "Keep private"}</span>
                </label>
              </div>

              <div className={styles.sciencePreviewCard}>
                <span>{study.stat || "Key result"}</span>
                <div>
                  <small>{study.statLabel || "What the number represents"}</small>
                  <strong>{study.headline || "Study headline preview"}</strong>
                  <p>{study.finding || "The public finding will appear here once entered."}</p>
                </div>
              </div>

              <div className={styles.scienceFields}>
                <label>Body-system chapter
                  <select value={study.chapterId} onChange={(event) => patchStudy(study.id, { chapterId: event.target.value as OwnerScienceChapterId })}>
                    {chapterOptions.map((chapter) => <option value={chapter.id} key={chapter.id}>{chapter.label}</option>)}
                  </select>
                </label>
                <label>Study headline
                  <input value={study.headline} maxLength={180} placeholder="What did the study find?" onChange={(event) => patchStudy(study.id, { headline: event.target.value })} />
                </label>
                <div className={styles.scienceTwoCol}>
                  <label>Key number / statistic
                    <input value={study.stat} maxLength={80} placeholder="Example: 17 of 22" onChange={(event) => patchStudy(study.id, { stat: event.target.value })} />
                  </label>
                  <label>What that number means
                    <input value={study.statLabel} maxLength={180} placeholder="people had plastic detected in blood" onChange={(event) => patchStudy(study.id, { statLabel: event.target.value })} />
                  </label>
                </div>
                <label>What researchers found
                  <textarea value={study.finding} maxLength={900} onChange={(event) => patchStudy(study.id, { finding: event.target.value })} />
                </label>
                <label>Why it matters
                  <textarea value={study.meaning} maxLength={900} onChange={(event) => patchStudy(study.id, { meaning: event.target.value })} />
                </label>
                <div className={styles.scienceTwoCol}>
                  <label>Study type
                    <input value={study.studyType} maxLength={180} placeholder="Prospective observational study" onChange={(event) => patchStudy(study.id, { studyType: event.target.value })} />
                  </label>
                  <label>Sample
                    <input value={study.sample} maxLength={700} placeholder="Who or what was studied?" onChange={(event) => patchStudy(study.id, { sample: event.target.value })} />
                  </label>
                </div>
                <label>Method
                  <textarea value={study.method} maxLength={700} onChange={(event) => patchStudy(study.id, { method: event.target.value })} />
                </label>
                <label>Limitations
                  <textarea value={study.limits} maxLength={1000} placeholder="What this study cannot establish" onChange={(event) => patchStudy(study.id, { limits: event.target.value })} />
                </label>
                <div className={styles.scienceThreeCol}>
                  <label>Year
                    <input value={study.year} maxLength={40} placeholder="2026" onChange={(event) => patchStudy(study.id, { year: event.target.value })} />
                  </label>
                  <label>Journal
                    <input value={study.journal} maxLength={180} onChange={(event) => patchStudy(study.id, { journal: event.target.value })} />
                  </label>
                  <label>DOI <small>optional</small>
                    <input value={study.doi} maxLength={200} placeholder="10.xxxx/..." onChange={(event) => patchStudy(study.id, { doi: event.target.value })} />
                  </label>
                </div>
                <label>Original source URL
                  <input type="url" value={study.source} maxLength={500} placeholder="https://..." onChange={(event) => patchStudy(study.id, { source: event.target.value })} />
                </label>
              </div>

              <div className={styles.scienceStudyFooter}>
                <span>{study.published ? "This study will be public after you save." : "This study remains private after you save."}</span>
                <div>
                  {study.source ? <a href={study.source} target="_blank" rel="noreferrer">Open source ↗</a> : null}
                  <button type="button" onClick={() => removeStudy(study)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className={styles.scienceSaveBar}>
        <div>
          {message ? <span className={styles.success}>{message}</span> : <span className={styles.saveHint}>{dirty ? "You have unsaved science changes." : "Everything is saved."}</span>}
        </div>
        <div>
          <a className={styles.secondaryButton} href="/science" target="_blank" rel="noreferrer">Open Science page ↗</a>
          <button className={styles.primaryButton} type="button" disabled={!dirty || saveState === "saving"} onClick={() => void save()}>{saveState === "saving" ? "Saving…" : "Save science changes"}</button>
        </div>
      </div>
    </section>
  );
}

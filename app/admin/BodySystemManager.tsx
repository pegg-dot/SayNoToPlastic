"use client";

import { useEffect, useMemo, useState } from "react";
import { bodySystems, type BodySystemArticle } from "../content/body-systems";
import type { AdminContentRecord, OwnerBodySystemOverride, OwnerBodySystemSource } from "../lib/admin-content";
import styles from "./admin.module.css";

function parseOverrides(value: string): OwnerBodySystemOverride[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as OwnerBodySystemOverride[] : [];
  } catch {
    return [];
  }
}

function toOverride(article: BodySystemArticle): OwnerBodySystemOverride {
  return {
    slug: article.slug as OwnerBodySystemOverride["slug"],
    title: article.title,
    subtitle: article.subtitle,
    kicker: article.kicker,
    summary: article.summary,
    heroFact: article.heroFact,
    heroFactLabel: article.heroFactLabel,
    sections: article.sections.map((section) => ({ ...section, paragraphs: [...section.paragraphs] })),
    keyTakeaways: [...article.keyTakeaways],
    known: [...article.known],
    uncertain: [...article.uncertain],
    primarySources: article.primarySources.map((source) => ({ ...source })),
    reviewStatus: article.reviewStatus,
    reviewNote: article.reviewNote,
    updatedDate: article.updatedDate,
  };
}

function today() { return new Date().toISOString().slice(0, 10); }
function lines(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
function paragraphs(value: string) { return value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean); }

export function BodySystemManager({ value, saveState, previewRevision, onSave }: {
  value: string;
  saveState: "idle" | "saving" | "saved" | "error";
  previewRevision: number;
  onSave: (value: string) => Promise<AdminContentRecord | null>;
}) {
  const [overrides, setOverrides] = useState<OwnerBodySystemOverride[]>(() => parseOverrides(value));
  const [selectedSlug, setSelectedSlug] = useState(bodySystems[0].slug);
  const [message, setMessage] = useState("");

  useEffect(() => { setOverrides(parseOverrides(value)); }, [value]);

  const base = bodySystems.find((item) => item.slug === selectedSlug) || bodySystems[0];
  const stored = overrides.find((item) => item.slug === selectedSlug);
  const current = stored || toOverride(base);
  const serialized = useMemo(() => JSON.stringify(overrides), [overrides]);
  const dirty = serialized !== (value || "[]");
  const isCustomized = Boolean(stored);

  function replaceCurrent(next: OwnerBodySystemOverride) {
    setMessage("");
    setOverrides((items) => items.some((item) => item.slug === next.slug)
      ? items.map((item) => item.slug === next.slug ? next : item)
      : [...items, next]);
  }

  function patch(patchValue: Partial<OwnerBodySystemOverride>) {
    replaceCurrent({ ...current, ...patchValue, updatedDate: today() });
  }

  function patchSection(index: number, patchValue: Partial<OwnerBodySystemOverride["sections"][number]>) {
    patch({ sections: current.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patchValue } : section) });
  }

  function patchSource(index: number, patchValue: Partial<OwnerBodySystemSource>) {
    patch({ primarySources: current.primarySources.map((source, sourceIndex) => sourceIndex === index ? { ...source, ...patchValue } : source) });
  }

  function addSource() { patch({ primarySources: [...current.primarySources, { label: "", href: "", note: "" }] }); }
  function removeSource(index: number) { patch({ primarySources: current.primarySources.filter((_, sourceIndex) => sourceIndex !== index) }); }

  function restoreOriginal() {
    if (!isCustomized) return;
    if (!window.confirm(`Reset “${base.navLabel}” to its reviewed website content? You can still recover the current owner version from revision history.`)) return;
    setOverrides((items) => items.filter((item) => item.slug !== selectedSlug));
    setMessage("Reviewed website content selected. Save to make the reset live.");
  }

  async function save() {
    setMessage("");
    const saved = await onSave(serialized);
    if (saved) setMessage("Body-system changes saved.");
  }

  return (
    <section className={styles.bodySystemManager}>
      <div className={styles.objectToolbar}>
        <div>
          <p className={styles.kicker}>Body-system explainers</p>
          <h3>Choose a page</h3>
          <p>See the live page, then open only the part you want to change.</p>
        </div>
      </div>

      <div className={styles.bodySystemLayout}>
        <aside className={styles.objectList} aria-label="Body-system pages">
          <div className={styles.objectListHeading}><strong>Body systems</strong><span>{bodySystems.length}</span></div>
          {bodySystems.map((item) => {
            const customized = overrides.some((override) => override.slug === item.slug);
            return (
              <button key={item.slug} type="button" className={selectedSlug === item.slug ? styles.objectListActive : ""} onClick={() => { setSelectedSlug(item.slug); setMessage(""); }}>
                <div><span className={item.reviewStatus === "verified" ? styles.newsletterLive : styles.newsletterDraft}>{item.reviewStatus === "verified" ? "Reviewed" : "Review needed"}</span><small>{customized ? "Owner edits" : "Reviewed text"}</small></div>
                <strong>{item.navLabel}</strong>
                <small>{item.subtitle}</small>
              </button>
            );
          })}
        </aside>

        <div className={styles.bodySystemEditor}>
          <div className={styles.bodySystemPreview}>
            <div className={styles.livePreviewHeader}>
              <div><span>Live preview</span><small>What visitors see right now</small></div>
              <a href={`/science/body/${selectedSlug}`} target="_blank" rel="noreferrer">Open full page ↗</a>
            </div>
            <div className={styles.bodySystemPreviewFrame}><iframe key={`${selectedSlug}-${previewRevision}`} src={`/science/body/${selectedSlug}?owner_preview=1&owner_preview_revision=${previewRevision}`} title={`${base.navLabel} live preview`} loading="lazy" /></div>
          </div>

          <article className={styles.objectDetail}>
            <header className={styles.objectDetailHeader}>
              <div><span className={current.reviewStatus === "verified" ? styles.newsletterLive : styles.newsletterDraft}>{current.reviewStatus === "verified" ? "Verified" : "Needs review"}</span><h4>{current.title}</h4><small>{base.navLabel}</small></div>
              {isCustomized ? <button className={styles.secondaryButton} type="button" onClick={restoreOriginal}>Reset page</button> : null}
            </header>

            <div className={styles.guidedEditor}>
              <details className={styles.guidedSection} open>
                <summary><span>1</span><div><strong>Page basics</strong><small>Title, summary, and the main fact visitors see first</small></div></summary>
                <div className={styles.guidedSectionBody}>
                  <div className={styles.scienceTwoCol}><label>Page title<input value={current.title} maxLength={180} onChange={(event) => patch({ title: event.target.value })} /></label><label>Small topic label<input value={current.kicker} maxLength={140} onChange={(event) => patch({ kicker: event.target.value })} /></label></div>
                  <label>Subtitle<input value={current.subtitle} maxLength={260} onChange={(event) => patch({ subtitle: event.target.value })} /></label>
                  <label>Opening summary<textarea value={current.summary} maxLength={1200} onChange={(event) => patch({ summary: event.target.value })} /></label>
                  <div className={styles.scienceTwoCol}><label>Hero fact<input value={current.heroFact} maxLength={100} onChange={(event) => patch({ heroFact: event.target.value })} /></label><label>Hero fact explanation<input value={current.heroFactLabel} maxLength={240} onChange={(event) => patch({ heroFactLabel: event.target.value })} /></label></div>
                </div>
              </details>

              <details className={styles.guidedSection}>
                <summary><span>2</span><div><strong>Article sections</strong><small>The deeper explanation visitors read down the page</small></div></summary>
                <div className={styles.guidedSectionBody}>
                  <div className={styles.bodySystemSectionEditors}>
                    {current.sections.map((section, index) => (
                      <details key={section.id} className={styles.bodySystemSectionEditor} open={index === 0}>
                        <summary><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</summary>
                        <div><label>Section title<input value={section.title} maxLength={180} onChange={(event) => patchSection(index, { title: event.target.value })} /></label><label>Paragraphs<textarea value={section.paragraphs.join("\n\n")} onChange={(event) => patchSection(index, { paragraphs: paragraphs(event.target.value) })} /></label></div>
                      </details>
                    ))}
                  </div>
                </div>
              </details>

              <details className={styles.guidedSection}>
                <summary><span>3</span><div><strong>Evidence boundaries</strong><small>What readers should take away, what we know, and what remains uncertain</small></div></summary>
                <div className={styles.guidedSectionBody}>
                  <label>Key takeaways <small>one per line</small><textarea value={current.keyTakeaways.join("\n")} onChange={(event) => patch({ keyTakeaways: lines(event.target.value) })} /></label>
                  <label>What we know <small>one per line</small><textarea value={current.known.join("\n")} onChange={(event) => patch({ known: lines(event.target.value) })} /></label>
                  <label>What remains uncertain <small>one per line</small><textarea value={current.uncertain.join("\n")} onChange={(event) => patch({ uncertain: lines(event.target.value) })} /></label>
                </div>
              </details>

              <details className={styles.guidedSection}>
                <summary><span>4</span><div><strong>Sources & review</strong><small>Primary references and editorial review status</small></div></summary>
                <div className={styles.guidedSectionBody}>
                  <div className={styles.bodySystemSubhead}><strong>Primary sources</strong><button type="button" onClick={addSource}>+ Add source</button></div>
                  <div className={styles.bodySystemSources}>{current.primarySources.length ? current.primarySources.map((source, index) => <div key={index}><label>Source label<input value={source.label} maxLength={220} onChange={(event) => patchSource(index, { label: event.target.value })} /></label><label>Source URL<input type="url" value={source.href} maxLength={500} onChange={(event) => patchSource(index, { href: event.target.value })} /></label><label>Source note <small>optional</small><input value={source.note || ""} maxLength={700} onChange={(event) => patchSource(index, { note: event.target.value })} /></label><button type="button" onClick={() => removeSource(index)}>Remove source</button></div>) : <div className={styles.emptyBox}>No primary sources attached yet.</div>}</div>
                  <div className={styles.scienceTwoCol}><label>Review status<select value={current.reviewStatus} onChange={(event) => patch({ reviewStatus: event.target.value as OwnerBodySystemOverride["reviewStatus"] })}><option value="verified">Verified</option><option value="partial">Partially verified</option><option value="source-review">Source review needed</option></select></label><label>Updated date<input type="date" value={current.updatedDate} onChange={(event) => patch({ updatedDate: event.target.value })} /></label></div>
                  <label>Review note<textarea value={current.reviewNote} maxLength={1000} onChange={(event) => patch({ reviewNote: event.target.value })} /></label>
                </div>
              </details>
            </div>
          </article>
        </div>
      </div>

      {(dirty || Boolean(message) || saveState === "saving" || saveState === "error") && <div className={styles.scienceSaveBar}><div>{message ? <span className={styles.success}>{message}</span> : <span className={styles.saveHint}>You have unpublished body-system changes.</span>}</div><button className={styles.primaryButton} type="button" disabled={!dirty || saveState === "saving"} onClick={() => void save()}>{saveState === "saving" ? "Saving…" : "Save changes"}</button></div>}
    </section>
  );
}

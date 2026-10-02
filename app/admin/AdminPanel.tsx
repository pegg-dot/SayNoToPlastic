"use client";

import { useMemo, useRef, useState } from "react";
import type {
  AdminContentKey,
  AdminContentRecord,
  AdminContentRevision,
  OwnerMediaItem,
  OwnerMediaItemType,
} from "../lib/admin-content";
import type { AdminDashboardMetrics } from "../lib/admin-metrics";
import { OWNER_PAGE_DEFINITIONS, type OwnerPageId } from "../lib/page-editor";
import styles from "./admin.module.css";
import { NewsletterManager } from "./NewsletterManager";
import { ScienceManager } from "./ScienceManager";
import { BodySystemManager } from "./BodySystemManager";

type Field = {
  key: AdminContentKey;
  label: string;
  description: string;
  kind: "url" | "enum" | "text" | "email" | "json";
  maxLength: number;
  allowedValues?: string[];
  placeholder?: string;
  surface?: "field" | "media" | "science";
};

type SaveState = "idle" | "saving" | "saved" | "error";
type SectionId = "dashboard" | "pages" | "media" | "press" | "newsletters";

const sections: Array<{ id: Exclude<SectionId, "press">; label: string }> = [
  { id: "dashboard", label: "Today" },
  { id: "pages", label: "Website" },
  { id: "newsletters", label: "Field Notes" },
  { id: "media", label: "Media" },
];

const fieldGroups: Record<"media" | "press", AdminContentKey[]> = {
  media: ["media.hero_heading", "media.hero_intro", "media.owner_update"],
  press: ["press.short_bio", "press.long_bio", "press.contact_email"],
};

const sectionCopy: Record<"media" | "press", { title: string; body: string; previewHref: string; previewLabel: string }> = {
  media: {
    title: "Events & Media",
    body: "Add appearances or post a current public update.",
    previewHref: "/media",
    previewLabel: "View Events & Media",
  },
  press: {
    title: "Press kit",
    body: "Keep Dr. Haddad's biography and media contact information current.",
    previewHref: "/media/press-kit",
    previewLabel: "View press kit",
  },
};

const friendlyFields: Partial<Record<AdminContentKey, { label: string; help: string }>> = {
  "site.notice": { label: "Announcement banner", help: "A short notice that appears near the top of the website. Leave it off if there is nothing to announce." },
  "home.hero_eyebrow": { label: "Small line above the main headline", help: "The short introductory line at the very top of the homepage." },
  "home.hero_headline": { label: "Main homepage headline", help: "The large sentence visitors see first." },
  "home.hero_deck": { label: "Sentence under the main headline", help: "A short explanation directly below the large headline." },
  "home.media_heading": { label: "Events & Media section title", help: "The heading that introduces talks, interviews, and appearances on the homepage." },
  "home.media_body": { label: "Events & Media section description", help: "The short paragraph below that section title." },
  "home.newsletter_heading": { label: "Newsletter section title", help: "The heading above the Field Notes email signup." },
  "home.newsletter_body": { label: "Newsletter section description", help: "The sentence that explains what subscribers will receive." },
  "media.hero_heading": { label: "Events & Media page headline", help: "The large headline at the top of the Events & Media page." },
  "media.hero_intro": { label: "Events & Media introduction", help: "The opening paragraph under the page headline." },
  "media.owner_update": { label: "Featured update from Dr. Haddad", help: "Optional highlighted news or announcement. Leave blank if there is no current update." },
  "tedx.video_url": { label: "TEDx video link", help: "Paste the YouTube link here when you want to replace the current TEDx recording." },
  "tedx.status": { label: "Is the TEDx video official yet?", help: "Keep Temporary recording until TEDx publishes the official video." },
  "podcast.series_label": { label: "Small podcast label", help: "A short label shown above the main podcast heading." },
  "podcast.series_heading": { label: "Podcast heading", help: "The main headline on the Beyond Plastic page." },
  "podcast.series_body": { label: "Podcast description", help: "The paragraph that explains the current podcast series." },
  "podcast.spotify_url": { label: "Spotify link", help: "Direct link to the Beyond Plastic show on Spotify." },
  "podcast.apple_url": { label: "Apple Podcasts link", help: "Direct link to the show on Apple Podcasts." },
  "podcast.youtube_url": { label: "YouTube link", help: "Channel or playlist where people can watch or listen." },
  "podcast.amazon_url": { label: "Amazon Music link", help: "Direct link to the show on Amazon Music." },
  "press.short_bio": { label: "Short biography", help: "A concise biography for media pages and quick introductions." },
  "press.long_bio": { label: "Full biography", help: "The longer biography used in the press kit." },
  "press.contact_email": { label: "Media contact email", help: "The email journalists or event organizers should use." },
};

function revisionSummary(value: string) {
  if (!value) return "Original website content";
  return value.length > 96 ? `${value.slice(0, 93)}…` : value;
}

function revisionTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function readMediaItems(value: string | undefined) {
  if (!value) return [] as OwnerMediaItem[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as OwnerMediaItem[] : [];
  } catch {
    return [] as OwnerMediaItem[];
  }
}

function blankMediaItem(): OwnerMediaItem {
  return {
    id: `media-${Date.now().toString(36)}`,
    type: "event",
    title: "",
    description: "",
    platform: "",
    date: "",
    url: "",
    published: false,
  };
}

function metricNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function pageName(path: string) {
  const known: Record<string, string> = {
    "/": "Homepage",
    "/science": "The Science",
    "/solutions": "Take Action",
    "/quick-action-card": "12-Step Guide",
    "/podcast": "Podcast",
    "/tedx": "TEDx",
    "/media": "Events & Media",
    "/homo-plasticus": "Homo Plasticus",
    "/about-dr-elie-haddad": "About Dr. Haddad",
  };
  return known[path] || path;
}

export function AdminPanel({
  fields,
  initialContent,
  initialRevisions,
  metrics,
}: {
  fields: Field[];
  initialContent: AdminContentRecord[];
  initialRevisions: AdminContentRevision[];
  metrics: AdminDashboardMetrics;
}) {
  const initialMap = useMemo(() => new Map(initialContent.map((record) => [record.key, record])), [initialContent]);
  const [section, setSection] = useState<SectionId>("dashboard");
  const [selectedPage, setSelectedPage] = useState<OwnerPageId>("homepage");
  const [scienceTool, setScienceTool] = useState<"overview" | "studies" | "body-systems">("overview");
  const [previewRevision, setPreviewRevision] = useState(0);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const [editingKey, setEditingKey] = useState<AdminContentKey | null>(null);
  const [records, setRecords] = useState(() => Object.fromEntries(initialContent.map((record) => [record.key, record])) as Record<AdminContentKey, AdminContentRecord>);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(fields.map((field) => [field.key, initialMap.get(field.key)?.value ?? ""])) as Record<AdminContentKey, string>);
  const [saveStates, setSaveStates] = useState(() => Object.fromEntries(fields.map((field) => [field.key, "idle"])) as Record<AdminContentKey, SaveState>);
  const [messages, setMessages] = useState(() => Object.fromEntries(fields.map((field) => [field.key, ""])) as Record<AdminContentKey, string>);
  const [revisions, setRevisions] = useState(initialRevisions);
  const [mediaItems, setMediaItems] = useState(() => readMediaItems(initialMap.get("media.entries_json")?.value));

  function fieldLabel(key: AdminContentKey) {
    const field = fields.find((candidate) => candidate.key === key);
    return friendlyFields[key]?.label || field?.label || key;
  }

  function goTo(next: SectionId, key?: AdminContentKey) {
    setSection(next);
    setEditingKey(key ?? null);
    if (next !== "pages") setScienceTool("overview");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }

  function pageDefinition() {
    return OWNER_PAGE_DEFINITIONS.find((candidate) => candidate.id === selectedPage) || OWNER_PAGE_DEFINITIONS[0];
  }

  function clearPreviewFocus() {
    const doc = previewFrameRef.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll(".sntp-owner-preview-target").forEach((node) => node.classList.remove("sntp-owner-preview-target"));
  }

  function focusPreview(key: AdminContentKey, scrollEditor = false) {
    const page = pageDefinition();
    const target = page.previewTargets?.find((item) => item.key === key);
    const doc = previewFrameRef.current?.contentDocument;
    if (!target || !doc) return;
    clearPreviewFocus();
    const node = doc.querySelector<HTMLElement>(target.selector);
    if (!node) return;
    node.classList.add("sntp-owner-preview-target");
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    if (scrollEditor) {
      window.setTimeout(() => document.querySelector<HTMLElement>(`[data-admin-field="${key}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }
  }

  function preparePreview() {
    const page = pageDefinition();
    const doc = previewFrameRef.current?.contentDocument;
    if (!doc) return;
    let style = doc.getElementById("sntp-owner-preview-style");
    if (!style) {
      style = doc.createElement("style");
      style.id = "sntp-owner-preview-style";
      style.textContent = `
        [data-sntp-owner-field] { cursor: pointer !important; transition: outline-color .15s ease, box-shadow .15s ease; }
        [data-sntp-owner-field]:hover { outline: 2px dashed rgba(183,132,63,.8) !important; outline-offset: 4px !important; }
        .sntp-owner-preview-target { outline: 3px solid #c28b3c !important; outline-offset: 5px !important; box-shadow: 0 0 0 7px rgba(194,139,60,.14) !important; }
      `;
      doc.head.appendChild(style);
    }
    page.previewTargets?.forEach((target) => {
      doc.querySelectorAll<HTMLElement>(target.selector).forEach((node) => {
        node.dataset.sntpOwnerField = target.key;
      });
    });
    const flagged = doc as Document & { __sntpOwnerPreviewBound?: boolean };
    if (!flagged.__sntpOwnerPreviewBound) {
      flagged.__sntpOwnerPreviewBound = true;
      doc.addEventListener("click", (event) => {
        const rawTarget = event.target as HTMLElement | null;
        const target = rawTarget?.closest?.("[data-sntp-owner-field]") as HTMLElement | null;
        const key = target?.dataset.sntpOwnerField as AdminContentKey | undefined;
        if (!key) return;
        event.preventDefault();
        event.stopPropagation();
        setEditingKey(key);
        window.setTimeout(() => focusPreview(key, true), 0);
      }, true);
    }
    if (editingKey) window.setTimeout(() => focusPreview(editingKey), 0);
  }

  function previewDraft(key: AdminContentKey, value: string) {
    const page = pageDefinition();
    const target = page.previewTargets?.find((item) => item.key === key);
    const doc = previewFrameRef.current?.contentDocument;
    if (!target?.textPreview || !doc || !value.trim()) return;
    const node = doc.querySelector<HTMLElement>(target.selector);
    if (!node) return;
    node.textContent = value;
    node.classList.add("sntp-owner-preview-target");
  }

  function selectField(key: AdminContentKey, open: boolean) {
    if (open) {
      setEditingKey(null);
      clearPreviewFocus();
      setPreviewRevision((current) => current + 1);
      return;
    }
    setEditingKey(key);
    window.setTimeout(() => focusPreview(key), 0);
  }

  function goToPage(page: OwnerPageId, key?: AdminContentKey) {
    setSelectedPage(page);
    setSection("pages");
    setEditingKey(key ?? null);
    setScienceTool("overview");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }

  async function saveValue(key: AdminContentKey, value: string) {
    setSaveStates((current) => ({ ...current, [key]: "saving" }));
    setMessages((current) => ({ ...current, [key]: "" }));
    try {
      const response = await fetch("/admin/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, expectedVersion: records[key]?.version ?? 0 }),
      });
      const body = await response.json() as { error?: string; saved?: AdminContentRecord };
      if (!response.ok || !body.saved) throw new Error(body.error || "Save failed.");
      const saved = body.saved;
      setRecords((current) => ({ ...current, [key]: saved }));
      setDrafts((current) => ({ ...current, [key]: saved.value }));
      setRevisions((current) => [{
        id: -Date.now(),
        key,
        value: saved.value,
        version: saved.version,
        updatedBy: saved.updatedBy || "owner",
        createdAt: saved.updatedAt || new Date().toISOString(),
      }, ...current].slice(0, 80));
      setSaveStates((current) => ({ ...current, [key]: "saved" }));
      setPreviewRevision((current) => current + 1);
      setMessages((current) => ({ ...current, [key]: saved.value ? "Updated on the live site" : "Original website content restored" }));
      window.setTimeout(() => setSaveStates((current) => ({ ...current, [key]: current[key] === "saved" ? "idle" : current[key] })), 2200);
      return saved;
    } catch (error) {
      setSaveStates((current) => ({ ...current, [key]: "error" }));
      setMessages((current) => ({ ...current, [key]: error instanceof Error ? error.message : "Save failed." }));
      return null;
    }
  }

  async function restoreOriginal(key: AdminContentKey) {
    if (!window.confirm(`Restore the original website content for “${fieldLabel(key)}”?`)) return;
    await saveValue(key, "");
  }

  async function saveMediaItems() {
    const serialized = JSON.stringify(mediaItems);
    const saved = await saveValue("media.entries_json", serialized);
    if (saved) setMediaItems(readMediaItems(saved.value));
  }

  function updateMediaItem(id: string, patch: Partial<OwnerMediaItem>) {
    setMediaItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function removeMediaItem(id: string, title: string) {
    const label = title.trim() || "this item";
    if (!window.confirm(`Remove “${label}”? It will not disappear from the live site until you save the media changes.`)) return;
    setMediaItems((current) => current.filter((candidate) => candidate.id !== id));
  }

  function renderField(key: AdminContentKey) {
    const field = fields.find((candidate) => candidate.key === key);
    if (!field || field.surface === "media" || field.kind === "json") return null;
    const copy = friendlyFields[key] || { label: field.label, help: field.description };
    const record = records[key];
    const changed = drafts[key] !== (record?.value ?? "");
    const state = saveStates[key];
    const open = editingKey === key;
    const fieldRevisions = revisions.filter((revision) => revision.key === key).slice(0, 3);

    return (
      <article className={`${styles.settingCard} ${open ? styles.settingCardOpen : ""}`} key={key} data-admin-field={key}>
        <button className={styles.settingSummary} type="button" onClick={() => selectField(key, open)} aria-expanded={open}>
          <div>
            <strong>{copy.label}</strong>
            <span>{copy.help}</span>
          </div>
          <div className={styles.settingStatus}>
            <small>{record?.value ? "Custom version is live" : "Original version is live"}</small>
            <b>{open ? "Close" : "Show + edit"}</b>
          </div>
        </button>

        {open && (
          <div className={styles.settingEditor}>
            <div className={styles.liveState}>
              <span>Live right now</span>
              <strong>{record?.value ? revisionSummary(record.value) : "The website's original content"}</strong>
            </div>

            <label className={styles.editLabel} htmlFor={key}>New version</label>
            {field.kind === "enum" ? (
              <select id={key} value={drafts[key]} onChange={(event) => { const value = event.target.value; setDrafts((current) => ({ ...current, [key]: value })); previewDraft(key, value); }}>
                <option value="">Use original setting</option>
                {field.allowedValues?.map((value) => <option value={value} key={value}>{value === "official" ? "Official TEDx video" : value === "temporary" ? "Temporary recording" : value}</option>)}
              </select>
            ) : field.maxLength > 250 ? (
              <textarea id={key} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => { const value = event.target.value; setDrafts((current) => ({ ...current, [key]: value })); previewDraft(key, value); }} />
            ) : (
              <input id={key} type={field.kind === "url" ? "url" : field.kind === "email" ? "email" : "text"} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => { const value = event.target.value; setDrafts((current) => ({ ...current, [key]: value })); previewDraft(key, value); }} />
            )}

            <div className={styles.editorActions}>
              <div>
                {messages[key] && <span className={state === "error" ? styles.error : styles.success}>{messages[key]}</span>}
                {!messages[key] && <span className={styles.saveHint}>Press Update live site only when you are ready.</span>}
              </div>
              <div>
                {Boolean(record?.value) && <button className={styles.secondaryButton} type="button" disabled={state === "saving"} onClick={() => void restoreOriginal(key)}>Restore original</button>}
                <button className={styles.primaryButton} type="button" disabled={!changed || state === "saving"} onClick={() => void saveValue(key, drafts[key])}>{state === "saving" ? "Updating…" : "Update live site"}</button>
              </div>
            </div>

            {fieldRevisions.length > 0 && (
              <details className={styles.history}>
                <summary>Previous versions</summary>
                <div className={styles.historyList}>
                  {fieldRevisions.map((revision) => (
                    <div className={styles.historyRow} key={`${revision.id}-${revision.version}`}>
                      <div><strong>{revisionTime(revision.createdAt)}</strong><span>{revisionSummary(revision.value)}</span><small>Changed by {revision.updatedBy}</small></div>
                      <button type="button" disabled={revision.value === drafts[key]} onClick={() => setDrafts((current) => ({ ...current, [key]: revision.value }))}>Use this</button>
                    </div>
                  ))}
                </div>
                <p>Choosing a previous version only fills the editor. It will not go live until you press Update live site.</p>
              </details>
            )}
          </div>
        )}
      </article>
    );
  }

  const mediaRecord = records["media.entries_json"];
  const mediaDirty = JSON.stringify(mediaItems) !== (mediaRecord?.value || "");
  const recentRevisions = revisions.slice(0, 4);

  return (
    <div className={styles.workspace}>
      <nav className={styles.tabs} aria-label="Website manager sections">
        {sections.map((item) => {
          const active = section === item.id || (section === "press" && item.id === "media");
          return <button key={item.id} type="button" className={active ? styles.tabActive : ""} onClick={() => goTo(item.id)}>{item.label}</button>;
        })}
      </nav>

      {section === "dashboard" && (
        <div className={styles.dashboard}>
          <section className={styles.welcomeCard}>
            <p className={styles.kicker}>Today</p>
            <h2>What do you want to work on?</h2>
            <p>Choose the kind of work first. The manager will show only the controls you need for that task.</p>
            <div className={styles.actionGrid}>
              <button type="button" onClick={() => goTo("pages")}><span>01</span><strong>Edit the website</strong><small>Choose a page, see it, then edit one section at a time</small></button>
              <button type="button" onClick={() => goTo("newsletters")}><span>02</span><strong>Publish Field Notes</strong><small>Upload the Word document, publish it, then create the Mailchimp draft</small></button>
              <button type="button" onClick={() => goTo("media")}><span>03</span><strong>Add media or an appearance</strong><small>Events, talks, interviews, press, and podcast appearances</small></button>
              <button type="button" onClick={() => goToPage("science")}><span>04</span><strong>Review or add science</strong><small>Human studies and body-system explainers with sources and limitations</small></button>
            </div>
            <div className={styles.quickLinks} aria-label="Common shortcuts">
              <span>Common shortcuts</span>
              <button type="button" onClick={() => goToPage("tedx", "tedx.video_url")}>Replace TEDx video</button>
              <button type="button" onClick={() => goToPage("podcast")}>Update podcast</button>
              <button type="button" onClick={() => goTo("press")}>Edit press kit</button>
            </div>
          </section>

          <section className={styles.activityCard}>
            <div className={styles.sectionTitleRow}>
              <div><p className={styles.kicker}>Site activity</p><h3>Last 30 days</h3></div>
              <small>Traffic numbers only count visitors who allowed anonymous analytics.</small>
            </div>
            {metrics.available ? (
              <>
                <div className={styles.metricGrid}>
                  <article><span>Visitors</span><strong>{metricNumber(metrics.visitors30d)}</strong></article>
                  <article><span>Newsletter subscribers</span><strong>{metricNumber(metrics.newsletterActive)}</strong><small>+{metricNumber(metrics.newsletterNew30d)} new</small></article>
                  <article><span>Contact requests</span><strong>{metricNumber(metrics.contacts30d)}</strong></article>
                  <article><span>Book checkout starts</span><strong>{metricNumber(metrics.checkoutStarts30d)}</strong></article>
                </div>
                <details className={styles.moreStats}>
                  <summary>See more site stats</summary>
                  <div className={styles.moreStatsGrid}>
                    <div><span>Page views</span><strong>{metricNumber(metrics.pageViews30d)}</strong></div>
                    <div><span>Newsletter connection</span><strong>{metrics.newsletterNeedsSync > 0 ? `${metricNumber(metrics.newsletterNeedsSync)} need attention` : "Working"}</strong></div>
                  </div>
                  <div className={styles.topPages}>
                    <strong>Most viewed pages</strong>
                    {metrics.topPages30d.length ? metrics.topPages30d.map((item) => <div key={item.path}><span>{pageName(item.path)}</span><b>{metricNumber(item.views)} views</b></div>) : <p>No page-view data yet.</p>}
                  </div>
                </details>
              </>
            ) : <div className={styles.emptyBox}>Site stats are temporarily unavailable. Editing still works normally.</div>}
          </section>

          <section className={styles.recentCard}>
            <div className={styles.sectionTitleRow}><div><p className={styles.kicker}>Recent changes</p><h3>What was updated lately</h3></div></div>
            {recentRevisions.length ? recentRevisions.map((revision) => (
              <div className={styles.recentRow} key={`${revision.id}-${revision.version}`}>
                <div><strong>{fieldLabel(revision.key)}</strong><span>{revisionSummary(revision.value)}</span></div>
                <small>{revisionTime(revision.createdAt)} · {revision.updatedBy}</small>
              </div>
            )) : <div className={styles.emptyBox}>No owner changes yet. The site is using its original reviewed content.</div>}
          </section>

          <div className={styles.safetyNote}><strong>Protected by structure</strong><span>Scientific evidence is managed only through the structured Science editor with required sources and limitations. Payments, hosting, passwords, and code cannot be changed from this page.</span></div>
        </div>
      )}

      {section === "pages" && (() => {
        const page = OWNER_PAGE_DEFINITIONS.find((candidate) => candidate.id === selectedPage) || OWNER_PAGE_DEFINITIONS[0];
        const isScience = page.kind === "science";
        return (
          <div className={styles.editorPage}>
            <div className={styles.editorHeader}>
              <div>
                <button className={styles.backButton} type="button" onClick={() => goTo("dashboard")}>← Back to home</button>
                <p className={styles.kicker}>Website pages</p>
                <h2>{page.label}</h2>
                <p>{page.description}</p>
              </div>
              <a href={page.href} target="_blank" rel="noreferrer">Open live page ↗</a>
            </div>

            <div className={styles.pageCmsLayout}>
              <aside className={styles.pageTree} aria-label="Website pages">
                <strong>Website pages</strong>
                {OWNER_PAGE_DEFINITIONS.map((item) => (
                  <button key={item.id} type="button" className={item.id === selectedPage ? styles.pageTreeActive : ""} onClick={() => { setSelectedPage(item.id); setEditingKey(null); clearPreviewFocus(); }}>
                    <span>{item.label}</span>
                    <small>{item.href}</small>
                  </button>
                ))}
              </aside>

              <div className={styles.pageCmsMain}>
                {isScience ? (
                  <>
                    <section className={styles.livePreviewCard}>
                      <div className={styles.livePreviewHeader}>
                        <div><span>Live Science page</span><small>Science uses structured fields so evidence, sources, and uncertainty stay together.</small></div>
                        <a href="/science" target="_blank" rel="noreferrer">Full page ↗</a>
                      </div>
                      <div className={styles.livePreviewFrame}>
                        <iframe key={`science-${previewRevision}`} src="/science" title="Science page live preview" loading="lazy" />
                      </div>
                    </section>

                    <div className={styles.pageEditorNote}><strong>Why this editor looks different</strong><span>Science is still a website page, but research cannot safely be edited like ordinary marketing copy. The interface keeps study methods, sample, limitations, sources, and review status attached to the claim.</span></div>

                    <ScienceManager
                      value={records["science.entries_json"]?.value ?? ""}
                      saveState={saveStates["science.entries_json"]}
                      onSave={(value) => saveValue("science.entries_json", value)}
                    />

                    <BodySystemManager
                      value={records["science.body_systems_json"]?.value ?? ""}
                      saveState={saveStates["science.body_systems_json"]}
                      previewRevision={previewRevision}
                      onSave={(value) => saveValue("science.body_systems_json", value)}
                    />
                  </>
                ) : (
                  <div className={styles.contextEditorLayout}>
                    <section className={styles.contextFieldPane}>
                      <div className={styles.settingsIntro}>
                        <p className={styles.kicker}>Edit in context</p>
                        <h3>Click a section here or directly in the preview.</h3>
                        <p>The preview stays beside you. When you choose a field, the exact place it controls is highlighted. Typing into most text fields previews the wording before you publish.</p>
                      </div>
                      {page.note ? <div className={styles.pageEditorNote}><strong>Protected content</strong><span>{page.note}</span></div> : null}
                      <div className={styles.settingsList}>
                        {page.fields.map(renderField)}
                      </div>
                    </section>

                    <section className={`${styles.livePreviewCard} ${styles.contextPreview}`}>
                      <div className={styles.livePreviewHeader}>
                        <div><span>Page preview</span><small>Click highlighted text in the page to edit that exact content.</small></div>
                        <a href={page.href} target="_blank" rel="noreferrer">Full page ↗</a>
                      </div>
                      <div className={styles.livePreviewFrame}>
                        <iframe
                          ref={previewFrameRef}
                          key={`${page.id}-${previewRevision}`}
                          src={page.href}
                          title={`${page.label} live preview`}
                          loading="lazy"
                          onLoad={preparePreview}
                        />
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {section === "newsletters" && (
        <div className={styles.editorPage}>
          <div className={styles.editorHeader}>
            <div><button className={styles.backButton} type="button" onClick={() => goTo("dashboard")}>← Back to home</button><h2>Newsletters</h2><p>Upload the Word document, check the private preview, publish it to the Field Notes archive, then create a Mailchimp draft for final review and sending.</p></div>
            <a href="/newsletters" target="_blank" rel="noreferrer">View Field Notes archive ↗</a>
          </div>
          <NewsletterManager />
        </div>
      )}

      {(section === "media" || section === "press") && (
        <div className={styles.editorPage}>
          <div className={styles.editorHeader}>
            <div><button className={styles.backButton} type="button" onClick={() => goTo("dashboard")}>← Back to home</button><h2>{sectionCopy[section].title}</h2><p>{sectionCopy[section].body}</p></div>
            <a href={sectionCopy[section].previewHref} target="_blank" rel="noreferrer">{sectionCopy[section].previewLabel} ↗</a>
          </div>

          {section === "media" && (
            <section className={styles.mediaManager}>
              <div className={styles.mediaHeader}>
                <div><p className={styles.kicker}>Events and appearances</p><h3>Add something new</h3><p>Create an item as a draft. Turn on Show on site only when it is ready to be public.</p></div>
                <button className={styles.primaryButton} type="button" onClick={() => setMediaItems((current) => [blankMediaItem(), ...current])}>+ Add event or appearance</button>
              </div>
              {mediaItems.length === 0 ? <div className={styles.emptyBox}>No owner-added events or appearances yet.</div> : (
                <div className={styles.mediaList}>
                  {mediaItems.map((item) => (
                    <article className={styles.mediaItem} key={item.id}>
                      <div className={styles.mediaTopRow}>
                        <select value={item.type} aria-label="Item type" onChange={(event) => updateMediaItem(item.id, { type: event.target.value as OwnerMediaItemType })}>
                          <option value="event">Event</option><option value="talk">Talk</option><option value="interview">Interview</option><option value="podcast">Podcast appearance</option><option value="press">Press</option>
                        </select>
                        <label className={styles.publishSwitch}><input type="checkbox" checked={item.published} onChange={(event) => updateMediaItem(item.id, { published: event.target.checked })} /><span>{item.published ? "Show on site" : "Draft only"}</span></label>
                      </div>
                      <label>Title<input type="text" value={item.title} maxLength={140} placeholder="Example: Dr. Haddad at TEDxMiami" onChange={(event) => updateMediaItem(item.id, { title: event.target.value })} /></label>
                      <div className={styles.twoCol}><label>Date<input type="date" value={item.date} onChange={(event) => updateMediaItem(item.id, { date: event.target.value })} /></label><label>Where it appeared<input type="text" value={item.platform} maxLength={100} placeholder="Event, publication, podcast, etc." onChange={(event) => updateMediaItem(item.id, { platform: event.target.value })} /></label></div>
                      <label>Link <small>optional</small><input type="url" value={item.url} maxLength={500} placeholder="https://..." onChange={(event) => updateMediaItem(item.id, { url: event.target.value })} /></label>
                      <label>Short description<textarea value={item.description} maxLength={700} placeholder="What should visitors know?" onChange={(event) => updateMediaItem(item.id, { description: event.target.value })} /></label>
                      <div className={styles.mediaItemFooter}><span>{item.published ? "This will be public after you save." : "This will stay private after you save."}</span><button type="button" onClick={() => removeMediaItem(item.id, item.title)}>Remove</button></div>
                    </article>
                  ))}
                </div>
              )}
              <div className={styles.mediaSaveBar}><span>{mediaDirty ? "You have unsaved changes" : "Everything is saved"}</span><button className={styles.primaryButton} type="button" disabled={!mediaDirty || saveStates["media.entries_json"] === "saving"} onClick={() => void saveMediaItems()}>{saveStates["media.entries_json"] === "saving" ? "Updating…" : "Update live site"}</button></div>
            </section>
          )}

          <section className={styles.settingsList}>
            <div className={styles.settingsIntro}><h3>{section === "media" ? "Page text" : "Biography and contact"}</h3><p>Click Edit beside only the item you want to change.</p></div>
            {fieldGroups[section].map(renderField)}
          </section>
        </div>
      )}
    </div>
  );
}

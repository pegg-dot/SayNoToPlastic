"use client";

import { useMemo, useState } from "react";
import type {
  AdminContentKey,
  AdminContentRecord,
  AdminContentRevision,
  OwnerMediaItem,
  OwnerMediaItemType,
} from "../lib/admin-content";
import type { AdminDashboardMetrics } from "../lib/admin-metrics";
import styles from "./admin.module.css";

type Field = {
  key: AdminContentKey;
  label: string;
  description: string;
  kind: "url" | "enum" | "text" | "email" | "json";
  maxLength: number;
  allowedValues?: string[];
  placeholder?: string;
  surface?: "field" | "media";
};

type SaveState = "idle" | "saving" | "saved" | "error";
type SectionId = "dashboard" | "homepage" | "media" | "podcast" | "press";

const sections: Array<{ id: SectionId; label: string; hint: string }> = [
  { id: "dashboard", label: "Dashboard", hint: "Start here" },
  { id: "homepage", label: "Homepage", hint: "Main message & newsletter" },
  { id: "media", label: "Events & TEDx", hint: "Appearances, updates, video" },
  { id: "podcast", label: "Podcast", hint: "Beyond Plastic" },
  { id: "press", label: "Press kit", hint: "Bio & contact" },
];

const fieldGroups: Record<Exclude<SectionId, "dashboard">, AdminContentKey[]> = {
  homepage: [
    "site.notice",
    "home.hero_eyebrow",
    "home.hero_headline",
    "home.hero_deck",
    "home.media_heading",
    "home.media_body",
    "home.newsletter_heading",
    "home.newsletter_body",
  ],
  media: [
    "media.hero_heading",
    "media.hero_intro",
    "media.owner_update",
    "tedx.video_url",
    "tedx.status",
  ],
  podcast: [
    "podcast.series_label",
    "podcast.series_heading",
    "podcast.series_body",
    "podcast.spotify_url",
    "podcast.apple_url",
    "podcast.youtube_url",
    "podcast.amazon_url",
  ],
  press: ["press.short_bio", "press.long_bio", "press.contact_email"],
};

const sectionCopy: Record<Exclude<SectionId, "dashboard">, { title: string; body: string; previewHref: string; previewLabel: string }> = {
  homepage: {
    title: "Update what visitors see first.",
    body: "Change the homepage wording you manage. Leave any field blank to keep the current site wording.",
    previewHref: "/",
    previewLabel: "Open homepage",
  },
  media: {
    title: "Keep events, appearances, and TEDx current.",
    body: "Add new public appearances as drafts first. Nothing appears on the live Events & Media page until you choose Show on site and save.",
    previewHref: "/media",
    previewLabel: "Open Events & Media",
  },
  podcast: {
    title: "Keep Beyond Plastic up to date.",
    body: "Update the current series wording and verified listening links. Blank fields keep the current site values.",
    previewHref: "/podcast",
    previewLabel: "Open podcast page",
  },
  press: {
    title: "Keep your press information accurate.",
    body: "Update your short bio, extended bio, and media contact. The rest of the press kit stays reviewed and protected.",
    previewHref: "/media/press-kit",
    previewLabel: "Open press kit",
  },
};

function revisionSummary(value: string) {
  if (!value) return "Original site text";
  return value.length > 92 ? `${value.slice(0, 89)}…` : value;
}

function revisionTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
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
  const [records, setRecords] = useState(() => Object.fromEntries(initialContent.map((record) => [record.key, record])) as Record<AdminContentKey, AdminContentRecord>);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(fields.map((field) => [field.key, initialMap.get(field.key)?.value ?? ""])) as Record<AdminContentKey, string>);
  const [saveStates, setSaveStates] = useState(() => Object.fromEntries(fields.map((field) => [field.key, "idle"])) as Record<AdminContentKey, SaveState>);
  const [messages, setMessages] = useState(() => Object.fromEntries(fields.map((field) => [field.key, ""])) as Record<AdminContentKey, string>);
  const [revisions, setRevisions] = useState(initialRevisions);
  const [mediaItems, setMediaItems] = useState(() => readMediaItems(initialMap.get("media.entries_json")?.value));

  function fieldLabel(key: AdminContentKey) {
    return fields.find((field) => field.key === key)?.label || key;
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
      setMessages((current) => ({ ...current, [key]: "Saved to the live site" }));
      window.setTimeout(() => {
        setSaveStates((current) => ({ ...current, [key]: current[key] === "saved" ? "idle" : current[key] }));
      }, 2200);
      return saved;
    } catch (error) {
      setSaveStates((current) => ({ ...current, [key]: "error" }));
      setMessages((current) => ({ ...current, [key]: error instanceof Error ? error.message : "Save failed." }));
      return null;
    }
  }

  async function saveField(key: AdminContentKey) {
    await saveValue(key, drafts[key]);
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
    if (!window.confirm(`Remove ${label}? This will not affect the live site until you click Save media changes.`)) return;
    setMediaItems((current) => current.filter((candidate) => candidate.id !== id));
  }

  function renderField(key: AdminContentKey) {
    const field = fields.find((candidate) => candidate.key === key);
    if (!field || field.surface === "media" || field.kind === "json") return null;
    const record = records[key];
    const changed = drafts[key] !== (record?.value ?? "");
    const state = saveStates[key];
    const fieldRevisions = revisions.filter((revision) => revision.key === key).slice(0, 3);

    return (
      <div className={styles.fieldCard} key={key}>
        <div className={styles.fieldMeta}>
          <label htmlFor={key}>{field.label}</label>
          <p>{field.description}</p>
        </div>

        {field.kind === "enum" ? (
          <select id={key} value={drafts[key]} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}>
            <option value="">Keep current site setting</option>
            {field.allowedValues?.map((value) => <option value={value} key={value}>{value === "official" ? "Official release" : value === "temporary" ? "Temporary recording" : value}</option>)}
          </select>
        ) : field.maxLength > 250 ? (
          <textarea id={key} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} />
        ) : (
          <input id={key} type={field.kind === "url" ? "url" : field.kind === "email" ? "email" : "text"} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} />
        )}

        <div className={styles.fieldFooter}>
          <span>{record?.updatedAt ? `Last saved ${revisionTime(record.updatedAt)}` : "Using the current site wording"}</span>
          <div>
            <button className={styles.resetButton} type="button" disabled={!drafts[key]} onClick={() => setDrafts((current) => ({ ...current, [key]: "" }))}>Restore original</button>
            {messages[key] && <small className={state === "error" ? styles.error : styles.success}>{messages[key]}</small>}
            <button type="button" disabled={!changed || state === "saving"} onClick={() => void saveField(key)}>{state === "saving" ? "Saving…" : "Save to live site"}</button>
          </div>
        </div>

        {fieldRevisions.length > 0 && (
          <details className={styles.history}>
            <summary>Undo or view previous versions</summary>
            <div className={styles.historyList}>
              {fieldRevisions.map((revision) => (
                <div className={styles.historyRow} key={`${revision.id}-${revision.version}`}>
                  <div>
                    <strong>{revisionTime(revision.createdAt)}</strong>
                    <span>{revisionSummary(revision.value)}</span>
                    <small>Changed by {revision.updatedBy}</small>
                  </div>
                  <button type="button" disabled={revision.value === drafts[key]} onClick={() => setDrafts((current) => ({ ...current, [key]: revision.value }))}>Load this version</button>
                </div>
              ))}
            </div>
            <p className={styles.historyNote}>Loading a previous version does not change the live site until you click Save to live site.</p>
          </details>
        )}
      </div>
    );
  }

  const mediaRecord = records["media.entries_json"];
  const mediaDirty = JSON.stringify(mediaItems) !== (mediaRecord?.value || "");
  const publishedMediaCount = mediaItems.filter((item) => item.published).length;
  const overriddenFields = Object.values(records).filter((record) => Boolean(record?.value)).length;
  const recentRevisions = revisions.slice(0, 5);
  const topPageMax = Math.max(1, ...metrics.topPages30d.map((item) => item.views));

  return (
    <div className={styles.workspace}>
      <nav className={styles.sidebar} aria-label="Admin sections">
        <div className={styles.sidebarIntro}>
          <span>Site manager</span>
          <strong>What do you want to update?</strong>
        </div>
        {sections.map((item) => (
          <button key={item.id} type="button" className={section === item.id ? styles.navActive : ""} onClick={() => setSection(item.id)}>
            <strong>{item.label}</strong>
            <small>{item.hint}</small>
          </button>
        ))}
        <div className={styles.sidebarBoundary}>
          <strong>You can undo changes.</strong>
          <p>Each saved text or link change keeps a history. Scientific and medical content stays protected from accidental editing.</p>
        </div>
      </nav>

      <div className={styles.contentArea}>
        {section === "dashboard" && (
          <div className={styles.overview}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Dashboard</p>
              <h2>What would you like to do today?</h2>
              <p>Choose a task below. You do not need to know how the website is built, and every editable text or link change can be restored later.</p>
            </div>

            <div className={styles.quickGrid}>
              <button type="button" onClick={() => setSection("homepage")}><span>Homepage</span><strong>Change the homepage message</strong><small>Headline, announcement, newsletter wording</small></button>
              <button type="button" onClick={() => setSection("media")}><span>Events & TEDx</span><strong>Add an event or appearance</strong><small>Keep it as a draft until you are ready</small></button>
              <button type="button" onClick={() => setSection("media")}><span>TEDx</span><strong>Replace the TEDx video</strong><small>Update the link when the official release arrives</small></button>
              <button type="button" onClick={() => setSection("podcast")}><span>Podcast</span><strong>Update Beyond Plastic</strong><small>Series wording and listening links</small></button>
              <button type="button" onClick={() => setSection("press")}><span>Press kit</span><strong>Update biography or contact</strong><small>Short bio, extended bio, media email</small></button>
            </div>

            <section className={styles.metricsSection}>
              <div className={styles.metricsHeading}>
                <div><p className={styles.eyebrow}>At a glance</p><h3>How the site is doing</h3></div>
                <span>Last 30 days unless noted</span>
              </div>

              {metrics.available ? (
                <>
                  <div className={styles.metricsGrid}>
                    <article><span>Visitors</span><strong>{metricNumber(metrics.visitors30d)}</strong><small>Anonymous analytics sessions</small></article>
                    <article><span>Page views</span><strong>{metricNumber(metrics.pageViews30d)}</strong><small>Pages viewed with analytics consent</small></article>
                    <article><span>Newsletter subscribers</span><strong>{metricNumber(metrics.newsletterActive)}</strong><small>{metricNumber(metrics.newsletterNew30d)} new in the last 30 days</small></article>
                    <article><span>Contact requests</span><strong>{metricNumber(metrics.contacts30d)}</strong><small>Submitted in the last 30 days</small></article>
                    <article><span>Book checkout starts</span><strong>{metricNumber(metrics.checkoutStarts30d)}</strong><small>Anonymous tracked clicks</small></article>
                    <article className={metrics.newsletterNeedsSync > 0 ? styles.metricAttention : styles.metricHealthy}><span>Newsletter sync</span><strong>{metrics.newsletterNeedsSync > 0 ? metricNumber(metrics.newsletterNeedsSync) : "Good"}</strong><small>{metrics.newsletterNeedsSync > 0 ? "Active subscribers still need provider sync" : "Active subscribers are synced"}</small></article>
                  </div>

                  <div className={styles.insightGrid}>
                    <section className={styles.topPages}>
                      <div><span>Most viewed pages</span><small>Anonymous analytics · 30 days</small></div>
                      {metrics.topPages30d.length ? metrics.topPages30d.map((item) => (
                        <div className={styles.topPageRow} key={item.path}>
                          <div><strong>{pageName(item.path)}</strong><small>{item.path}</small></div>
                          <div className={styles.topPageMeter}><i style={{ width: `${Math.max(8, Math.round((item.views / topPageMax) * 100))}%` }} /></div>
                          <b>{metricNumber(item.views)}</b>
                        </div>
                      )) : <p className={styles.emptyMetric}>No consented page-view data has been recorded in the last 30 days yet.</p>}
                    </section>

                    <section className={styles.recentChanges}>
                      <div><span>Recent site changes</span><small>Saved through this admin</small></div>
                      {recentRevisions.length ? recentRevisions.map((revision) => (
                        <div className={styles.recentChangeRow} key={`${revision.id}-${revision.version}`}>
                          <strong>{fieldLabel(revision.key)}</strong>
                          <span>{revisionSummary(revision.value)}</span>
                          <small>{revisionTime(revision.createdAt)} · {revision.updatedBy}</small>
                        </div>
                      )) : <p className={styles.emptyMetric}>No owner edits yet. The site is still using its reviewed built-in content.</p>}
                    </section>
                  </div>

                  <p className={styles.analyticsNote}>Visitor, page-view, and checkout numbers only include people who chose anonymous analytics. Newsletter and contact totals come directly from the site database.</p>
                </>
              ) : (
                <div className={styles.metricsUnavailable}><strong>Metrics are temporarily unavailable.</strong><p>You can still edit the site normally. This does not affect the public website.</p></div>
              )}
            </section>

            <section className={styles.statusStrip}>
              <div><span>Live website</span><strong>Online</strong><small>Open saynotoplastic.com to preview</small></div>
              <div><span>Owner access</span><strong>Protected</strong><small>Only approved accounts can enter</small></div>
              <div><span>Current owner edits</span><strong>{overriddenFields}</strong><small>Fields different from built-in site text</small></div>
              <div><span>Published appearances</span><strong>{publishedMediaCount}</strong><small>Owner-managed items visible publicly</small></div>
            </section>
          </div>
        )}

        {section !== "dashboard" && (
          <>
            <div className={styles.sectionHeadingRow}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>{sections.find((item) => item.id === section)?.label}</p>
                <h2>{sectionCopy[section].title}</h2>
                <p>{sectionCopy[section].body}</p>
              </div>
              <a className={styles.previewLink} href={sectionCopy[section].previewHref} target="_blank" rel="noreferrer">{sectionCopy[section].previewLabel} ↗</a>
            </div>

            {section === "media" && (
              <section className={styles.mediaManager}>
                <div className={styles.mediaManagerHeader}>
                  <div><span>Events & appearances</span><h3>Add something new</h3><p>Create the item, leave it as Draft while you review it, then turn on Show on site when it is ready for the public.</p></div>
                  <button type="button" onClick={() => setMediaItems((current) => [blankMediaItem(), ...current])}>+ Add new item</button>
                </div>

                <div className={styles.mediaItems}>
                  {mediaItems.length === 0 && <div className={styles.emptyState}><strong>No owner-added events or appearances yet.</strong><p>Click Add new item when you have a talk, interview, event, podcast appearance, or press mention to add.</p></div>}
                  {mediaItems.map((item) => (
                    <article className={styles.mediaEditorCard} key={item.id}>
                      <div className={styles.mediaEditorTop}>
                        <select value={item.type} aria-label="Item type" onChange={(event) => updateMediaItem(item.id, { type: event.target.value as OwnerMediaItemType })}>
                          <option value="event">Event</option><option value="talk">Talk</option><option value="interview">Interview</option><option value="podcast">Podcast appearance</option><option value="press">Press</option>
                        </select>
                        <label className={styles.publishToggle}><input type="checkbox" checked={item.published} onChange={(event) => updateMediaItem(item.id, { published: event.target.checked })} /><span>{item.published ? "Show on site" : "Draft"}</span></label>
                      </div>
                      <label className={styles.mediaInputLabel}>Title<input type="text" value={item.title} maxLength={140} placeholder="Example: Dr. Haddad at TEDxMiami" onChange={(event) => updateMediaItem(item.id, { title: event.target.value })} /></label>
                      <div className={styles.mediaEditorRow}>
                        <label className={styles.mediaInputLabel}>Date<input type="date" value={item.date} onChange={(event) => updateMediaItem(item.id, { date: event.target.value })} /></label>
                        <label className={styles.mediaInputLabel}>Where it appeared<input type="text" value={item.platform} maxLength={100} placeholder="Outlet, venue, or platform" onChange={(event) => updateMediaItem(item.id, { platform: event.target.value })} /></label>
                      </div>
                      <label className={styles.mediaInputLabel}>Link <small>Optional</small><input type="url" value={item.url} maxLength={500} placeholder="https://..." onChange={(event) => updateMediaItem(item.id, { url: event.target.value })} /></label>
                      <label className={styles.mediaInputLabel}>Short description<textarea value={item.description} maxLength={700} placeholder="What should a visitor know about this appearance?" onChange={(event) => updateMediaItem(item.id, { description: event.target.value })} /></label>
                      <div className={styles.mediaEditorActions}>
                        <span>{item.published ? "This item will be visible after you save." : "This item stays private after you save."}</span>
                        <button type="button" className={styles.dangerButton} onClick={() => removeMediaItem(item.id, item.title)}>Remove item</button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={styles.mediaSaveBar}>
                  <div>{messages["media.entries_json"] && <small className={saveStates["media.entries_json"] === "error" ? styles.error : styles.success}>{messages["media.entries_json"]}</small>}<span>{mediaDirty ? "You have unsaved media changes" : "All media changes are saved"}</span></div>
                  <button type="button" disabled={!mediaDirty || saveStates["media.entries_json"] === "saving"} onClick={() => void saveMediaItems()}>{saveStates["media.entries_json"] === "saving" ? "Saving…" : "Save media changes"}</button>
                </div>
              </section>
            )}

            <section className={styles.group}>
              <div className={styles.groupHeading}>
                <h3>{section === "homepage" ? "Homepage wording" : section === "media" ? "Page wording and TEDx" : section === "podcast" ? "Beyond Plastic" : "Biography and contact"}</h3>
                <p>Only change what you want. Blank fields keep the current built-in site content.</p>
              </div>
              <div className={styles.fields}>{fieldGroups[section].map(renderField)}</div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

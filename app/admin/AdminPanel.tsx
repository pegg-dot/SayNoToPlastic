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

const sections: Array<{ id: SectionId; label: string }> = [
  { id: "dashboard", label: "Home" },
  { id: "homepage", label: "Homepage" },
  { id: "media", label: "Events & TEDx" },
  { id: "podcast", label: "Podcast" },
  { id: "press", label: "Press kit" },
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
    title: "Homepage",
    body: "Change the wording visitors see on the main page. Nothing changes until you press Update live site.",
    previewHref: "/",
    previewLabel: "View homepage",
  },
  media: {
    title: "Events & TEDx",
    body: "Add appearances, post an update, or replace the TEDx video when the official version is released.",
    previewHref: "/media",
    previewLabel: "View Events & Media",
  },
  podcast: {
    title: "Beyond Plastic podcast",
    body: "Update the podcast description and the places where people can listen.",
    previewHref: "/podcast",
    previewLabel: "View podcast page",
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
      <article className={`${styles.settingCard} ${open ? styles.settingCardOpen : ""}`} key={key}>
        <button className={styles.settingSummary} type="button" onClick={() => setEditingKey(open ? null : key)} aria-expanded={open}>
          <div>
            <strong>{copy.label}</strong>
            <span>{copy.help}</span>
          </div>
          <div className={styles.settingStatus}>
            <small>{record?.value ? "Custom version is live" : "Original version is live"}</small>
            <b>{open ? "Close" : "Edit"}</b>
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
              <select id={key} value={drafts[key]} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}>
                <option value="">Use original setting</option>
                {field.allowedValues?.map((value) => <option value={value} key={value}>{value === "official" ? "Official TEDx video" : value === "temporary" ? "Temporary recording" : value}</option>)}
              </select>
            ) : field.maxLength > 250 ? (
              <textarea id={key} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} />
            ) : (
              <input id={key} type={field.kind === "url" ? "url" : field.kind === "email" ? "email" : "text"} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} />
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
        {sections.map((item) => (
          <button key={item.id} type="button" className={section === item.id ? styles.tabActive : ""} onClick={() => goTo(item.id)}>{item.label}</button>
        ))}
      </nav>

      {section === "dashboard" && (
        <div className={styles.dashboard}>
          <section className={styles.welcomeCard}>
            <p className={styles.kicker}>Website manager</p>
            <h2>What do you want to change?</h2>
            <p>Pick a task. You will always see a clear button before anything is changed on the live website.</p>
            <div className={styles.actionGrid}>
              <button type="button" onClick={() => goTo("homepage")}><span>01</span><strong>Edit the homepage</strong><small>Headlines, announcements, newsletter wording</small></button>
              <button type="button" onClick={() => goTo("media")}><span>02</span><strong>Add an event or appearance</strong><small>Talks, interviews, press, podcast appearances</small></button>
              <button type="button" onClick={() => goTo("media", "tedx.video_url")}><span>03</span><strong>Replace the TEDx video</strong><small>Paste the new YouTube link when it is ready</small></button>
              <button type="button" onClick={() => goTo("podcast")}><span>04</span><strong>Update the podcast</strong><small>Description and listening links</small></button>
              <button type="button" onClick={() => goTo("press")}><span>05</span><strong>Update bio or press contact</strong><small>Biography and media email</small></button>
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

          <div className={styles.safetyNote}><strong>Protected for safety</strong><span>Scientific claims, medical content, payments, hosting, passwords, and code cannot be changed from this page.</span></div>
        </div>
      )}

      {section !== "dashboard" && (
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
            <div className={styles.settingsIntro}><h3>{section === "homepage" ? "Homepage text" : section === "media" ? "Page text and TEDx" : section === "podcast" ? "Podcast details" : "Biography and contact"}</h3><p>Click Edit beside only the item you want to change.</p></div>
            {fieldGroups[section].map(renderField)}
          </section>
        </div>
      )}
    </div>
  );
}

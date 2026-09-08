"use client";

import { useMemo, useState } from "react";
import type {
  AdminContentKey,
  AdminContentRecord,
  AdminContentRevision,
  OwnerMediaItem,
  OwnerMediaItemType,
} from "../lib/admin-content";
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
type SectionId = "overview" | "homepage" | "media" | "podcast" | "press";

const sections: Array<{ id: SectionId; label: string; hint: string }> = [
  { id: "overview", label: "Overview", hint: "What you can safely update" },
  { id: "homepage", label: "Homepage", hint: "Hero, media, newsletter" },
  { id: "media", label: "Events & Media", hint: "Appearances, updates, TEDx" },
  { id: "podcast", label: "Podcast", hint: "Series copy and listening links" },
  { id: "press", label: "Press kit", hint: "Biography and media contact" },
];

const fieldGroups: Record<Exclude<SectionId, "overview">, AdminContentKey[]> = {
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

function revisionSummary(value: string) {
  if (!value) return "Source default / hidden";
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

export function AdminPanel({
  fields,
  initialContent,
  initialRevisions,
}: {
  fields: Field[];
  initialContent: AdminContentRecord[];
  initialRevisions: AdminContentRevision[];
}) {
  const initialMap = useMemo(() => new Map(initialContent.map((record) => [record.key, record])), [initialContent]);
  const [section, setSection] = useState<SectionId>("overview");
  const [records, setRecords] = useState(() => Object.fromEntries(initialContent.map((record) => [record.key, record])) as Record<AdminContentKey, AdminContentRecord>);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(fields.map((field) => [field.key, initialMap.get(field.key)?.value ?? ""])) as Record<AdminContentKey, string>);
  const [saveStates, setSaveStates] = useState(() => Object.fromEntries(fields.map((field) => [field.key, "idle"])) as Record<AdminContentKey, SaveState>);
  const [messages, setMessages] = useState(() => Object.fromEntries(fields.map((field) => [field.key, ""])) as Record<AdminContentKey, string>);
  const [revisions, setRevisions] = useState(initialRevisions);
  const [mediaItems, setMediaItems] = useState(() => readMediaItems(initialMap.get("media.entries_json")?.value));

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
      setMessages((current) => ({ ...current, [key]: "Saved" }));
      window.setTimeout(() => {
        setSaveStates((current) => ({ ...current, [key]: current[key] === "saved" ? "idle" : current[key] }));
      }, 1800);
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
            <option value="">Use source default</option>
            {field.allowedValues?.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
        ) : field.maxLength > 250 ? (
          <textarea id={key} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} />
        ) : (
          <input id={key} type={field.kind === "url" ? "url" : field.kind === "email" ? "email" : "text"} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))} />
        )}

        <div className={styles.fieldFooter}>
          <span>
            {record?.version ? `Version ${record.version}` : "Using source default"}
            {record?.updatedBy ? ` · last changed by ${record.updatedBy}` : ""}
          </span>
          <div>
            <button className={styles.resetButton} type="button" disabled={!drafts[key]} onClick={() => setDrafts((current) => ({ ...current, [key]: "" }))}>Reset to source default</button>
            {messages[key] && <small className={state === "error" ? styles.error : styles.success}>{messages[key]}</small>}
            <button type="button" disabled={!changed || state === "saving"} onClick={() => void saveField(key)}>{state === "saving" ? "Saving…" : "Save change"}</button>
          </div>
        </div>

        {fieldRevisions.length > 0 && (
          <details className={styles.history}>
            <summary>Recent versions</summary>
            <div className={styles.historyList}>
              {fieldRevisions.map((revision) => (
                <div className={styles.historyRow} key={`${revision.id}-${revision.version}`}>
                  <div>
                    <strong>v{revision.version}</strong>
                    <span>{revisionSummary(revision.value)}</span>
                    <small>{revision.updatedBy} · {revisionTime(revision.createdAt)}</small>
                  </div>
                  <button type="button" disabled={revision.value === drafts[key]} onClick={() => setDrafts((current) => ({ ...current, [key]: revision.value }))}>Use this version</button>
                </div>
              ))}
            </div>
            <p className={styles.historyNote}>Loading an older version does not publish it. Click Save change to make it current while preserving the full history.</p>
          </details>
        )}
      </div>
    );
  }

  const mediaRecord = records["media.entries_json"];
  const mediaDirty = JSON.stringify(mediaItems) !== (mediaRecord?.value || "");
  const publishedMediaCount = mediaItems.filter((item) => item.published).length;
  const overriddenFields = Object.values(records).filter((record) => Boolean(record?.value)).length;

  return (
    <div className={styles.workspace}>
      <nav className={styles.sidebar} aria-label="Admin sections">
        <div className={styles.sidebarIntro}>
          <span>Owner workspace</span>
          <strong>Content controls</strong>
        </div>
        {sections.map((item) => (
          <button key={item.id} type="button" className={section === item.id ? styles.navActive : ""} onClick={() => setSection(item.id)}>
            <strong>{item.label}</strong>
            <small>{item.hint}</small>
          </button>
        ))}
        <div className={styles.sidebarBoundary}>
          <strong>Science stays reviewed</strong>
          <p>Medical claims, evidence summaries, body-system content, guides, payments, deployments, and API credentials are intentionally not editable here.</p>
        </div>
      </nav>

      <div className={styles.contentArea}>
        {section === "overview" && (
          <div className={styles.overview}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Overview</p>
              <h2>A simple place to keep the public site current.</h2>
              <p>This dashboard is for the changes Dr. Haddad is likely to make over time: public announcements, homepage messaging, appearances, TEDx, podcast links, and press information.</p>
            </div>

            <div className={styles.stats}>
              <article><span>Editable overrides</span><strong>{overriddenFields}</strong><small>Fields currently different from source defaults</small></article>
              <article><span>Published appearances</span><strong>{publishedMediaCount}</strong><small>Owner-managed items visible on Events & Media</small></article>
              <article><span>Revision history</span><strong>{revisions.length}</strong><small>Recent saved versions available for rollback</small></article>
            </div>

            <div className={styles.quickGrid}>
              <button type="button" onClick={() => setSection("homepage")}><span>Homepage</span><strong>Change public-facing messaging</strong><small>Hero, announcement, media feature, newsletter</small></button>
              <button type="button" onClick={() => setSection("media")}><span>Events & Media</span><strong>Add an appearance or update TEDx</strong><small>Draft first, publish when ready</small></button>
              <button type="button" onClick={() => setSection("podcast")}><span>Podcast</span><strong>Keep Beyond Plastic current</strong><small>Series copy and verified listening links</small></button>
              <button type="button" onClick={() => setSection("press")}><span>Press kit</span><strong>Update biography and contact</strong><small>Plain text, versioned, reversible</small></button>
            </div>

            <section className={styles.guardrail}>
              <div><span>Publishing boundary</span><h3>Owner editing without turning the site into an unsafe general-purpose CMS.</h3></div>
              <p>Every editable field is constrained by type and length. Links are validated, changes are recorded with the signed-in email, and source defaults remain available as a one-click reset.</p>
            </section>
          </div>
        )}

        {section !== "overview" && (
          <>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>{sections.find((item) => item.id === section)?.label}</p>
              <h2>{section === "homepage" ? "Edit the parts visitors see first." : section === "media" ? "Keep public work and appearances current." : section === "podcast" ? "Update Beyond Plastic without touching code." : "Keep press information accurate."}</h2>
              <p>{section === "media" ? "New appearances start as drafts. Publish only after the title, date, description, and destination link are ready." : "Blank fields automatically fall back to the reviewed source copy currently in the site."}</p>
            </div>

            {section === "media" && (
              <section className={styles.mediaManager}>
                <div className={styles.mediaManagerHeader}>
                  <div><span>Appearances & events</span><h3>Public media timeline</h3><p>Add talks, interviews, press, podcast appearances, and events. Draft items stay private until Published is checked and saved.</p></div>
                  <button type="button" onClick={() => setMediaItems((current) => [blankMediaItem(), ...current])}>+ Add appearance</button>
                </div>

                <div className={styles.mediaItems}>
                  {mediaItems.length === 0 && <div className={styles.emptyState}><strong>No owner-managed appearances yet.</strong><p>Add one when there is something new to publish. The existing TEDx feature remains separate below.</p></div>}
                  {mediaItems.map((item) => (
                    <article className={styles.mediaEditorCard} key={item.id}>
                      <div className={styles.mediaEditorTop}>
                        <select value={item.type} aria-label="Appearance type" onChange={(event) => updateMediaItem(item.id, { type: event.target.value as OwnerMediaItemType })}>
                          <option value="event">Event</option><option value="talk">Talk</option><option value="interview">Interview</option><option value="podcast">Podcast appearance</option><option value="press">Press</option>
                        </select>
                        <label className={styles.publishToggle}><input type="checkbox" checked={item.published} onChange={(event) => updateMediaItem(item.id, { published: event.target.checked })} /><span>{item.published ? "Published" : "Draft"}</span></label>
                      </div>
                      <input type="text" value={item.title} maxLength={140} placeholder="Appearance title" aria-label="Appearance title" onChange={(event) => updateMediaItem(item.id, { title: event.target.value })} />
                      <div className={styles.mediaEditorRow}>
                        <input type="date" value={item.date} aria-label="Appearance date" onChange={(event) => updateMediaItem(item.id, { date: event.target.value })} />
                        <input type="text" value={item.platform} maxLength={100} placeholder="Outlet, venue, or platform" aria-label="Outlet, venue, or platform" onChange={(event) => updateMediaItem(item.id, { platform: event.target.value })} />
                      </div>
                      <input type="url" value={item.url} maxLength={500} placeholder="https://... (optional)" aria-label="Appearance URL" onChange={(event) => updateMediaItem(item.id, { url: event.target.value })} />
                      <textarea value={item.description} maxLength={700} placeholder="Short public description" aria-label="Appearance description" onChange={(event) => updateMediaItem(item.id, { description: event.target.value })} />
                      <div className={styles.mediaEditorActions}>
                        <small>Internal ID: {item.id}</small>
                        <button type="button" className={styles.dangerButton} onClick={() => setMediaItems((current) => current.filter((candidate) => candidate.id !== item.id))}>Remove</button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={styles.mediaSaveBar}>
                  <div>{messages["media.entries_json"] && <small className={saveStates["media.entries_json"] === "error" ? styles.error : styles.success}>{messages["media.entries_json"]}</small>}<span>{mediaRecord?.version ? `Version ${mediaRecord.version}` : "No owner media list saved yet"}</span></div>
                  <button type="button" disabled={!mediaDirty || saveStates["media.entries_json"] === "saving"} onClick={() => void saveMediaItems()}>{saveStates["media.entries_json"] === "saving" ? "Saving…" : "Save appearances"}</button>
                </div>
              </section>
            )}

            <section className={styles.group}>
              <div className={styles.groupHeading}>
                <h3>{section === "homepage" ? "Homepage content" : section === "media" ? "Events, TEDx, and public updates" : section === "podcast" ? "Beyond Plastic" : "Press kit"}</h3>
                <p>Each change can be reset to the reviewed source default and recent versions remain available below the field.</p>
              </div>
              <div className={styles.fields}>{fieldGroups[section].map(renderField)}</div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

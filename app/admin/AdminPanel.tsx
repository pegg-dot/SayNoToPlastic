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


type PageFieldGroup = {
  id: string;
  label: string;
  description: string;
  fields: AdminContentKey[];
};

const pageFieldGroups: Partial<Record<OwnerPageId, PageFieldGroup[]>> = {
  homepage: [
    { id: "opening", label: "Opening message", description: "The first words visitors see when they arrive on the homepage.", fields: ["home.hero_eyebrow", "home.hero_headline", "home.hero_deck"] },
    { id: "media", label: "Events & Media", description: "The homepage handoff to talks, interviews, appearances, and press.", fields: ["home.media_heading", "home.media_body"] },
    { id: "field-notes", label: "Field Notes signup", description: "The invitation visitors see before joining the newsletter.", fields: ["home.newsletter_heading", "home.newsletter_body"] },
    { id: "announcement", label: "Announcement", description: "A temporary site-wide notice when there is something important to say.", fields: ["site.notice"] },
  ],
  about: [
    { id: "opening", label: "Opening", description: "Dr. Haddad's introduction and the purpose behind the work.", fields: ["about.hero_title", "about.hero_lead_primary", "about.hero_lead_secondary"] },
    { id: "question", label: "The clinical question", description: "Why this work began and what changed the direction of the research.", fields: ["about.why_title", "about.why_body_primary", "about.why_body_secondary"] },
    { id: "journey", label: "The journey", description: "The bridge from cardiology into environmental research and public education.", fields: ["about.story_title", "about.story_intro"] },
    { id: "current-work", label: "The work now", description: "How the current public work translates evidence for readers.", fields: ["about.closing_title", "about.closing_body"] },
  ],
  book: [
    { id: "premise", label: "Book premise", description: "The central idea and quotation that frame Homo Plasticus.", fields: ["book.premise_title", "book.premise_body", "book.quote"] },
    { id: "territory", label: "What the book covers", description: "How the reading map introduces the book's territory.", fields: ["book.territory_title", "book.territory_intro"] },
    { id: "science-bridge", label: "Bridge to the science", description: "The transition from the book into the evidence library.", fields: ["book.science_bridge_title", "book.science_bridge_body"] },
  ],
  podcast: [
    { id: "opening", label: "Opening", description: "The introduction visitors read at the top of Beyond Plastic.", fields: ["podcast.hero_lead", "podcast.hero_body"] },
    { id: "series", label: "Current series", description: "The label, headline, and description for the current podcast series.", fields: ["podcast.series_label", "podcast.series_heading", "podcast.series_body"] },
    { id: "platforms", label: "Listening links", description: "Where visitors can find the show on each platform.", fields: ["podcast.spotify_url", "podcast.apple_url", "podcast.youtube_url", "podcast.amazon_url"] },
  ],
  tedx: [
    { id: "video", label: "TEDx video", description: "The current recording and whether the official TEDx version is available.", fields: ["tedx.video_url", "tedx.status"] },
    { id: "story", label: "Story beneath the talk", description: "The explanation visitors read after watching the video.", fields: ["tedx.story_title", "tedx.story_body_primary", "tedx.story_body_secondary"] },
  ],
  media: [
    { id: "opening", label: "Page opening", description: "The headline and introduction at the top of Events & Media.", fields: ["media.hero_heading", "media.hero_intro"] },
    { id: "featured-update", label: "Featured update", description: "An optional current note from Dr. Haddad.", fields: ["media.owner_update"] },
  ],
  solutions: [
    { id: "opening", label: "Opening", description: "The first practical message visitors see on Take Action.", fields: ["solutions.hero_title", "solutions.hero_body"] },
    { id: "approach", label: "Dr. Haddad's approach", description: "The short framing that explains how to think about action.", fields: ["solutions.approach_title", "solutions.approach_body"] },
    { id: "core-rules", label: "Three core rules", description: "The introduction above the reviewed three-rule framework.", fields: ["solutions.core_title", "solutions.core_intro"] },
    { id: "framework", label: "Exposure framework", description: "The transition into the deeper exposure-reduction priorities.", fields: ["solutions.framework_title", "solutions.framework_intro"] },
  ],
  guides: [
    { id: "opening", label: "Guide introduction", description: "The title and introduction above Dr. Haddad's authored 12-step card.", fields: ["guides.hero_title", "guides.hero_body"] },
  ],
};

function groupForField(pageId: OwnerPageId, key: AdminContentKey) {
  return pageFieldGroups[pageId]?.find((group) => group.fields.includes(key)) || null;
}

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
  const [activePageGroup, setActivePageGroup] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewRevision, setPreviewRevision] = useState(0);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const [editingKey, setEditingKey] = useState<AdminContentKey | null>(null);
  const [records, setRecords] = useState(() => Object.fromEntries(initialContent.map((record) => [record.key, record])) as Record<AdminContentKey, AdminContentRecord>);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(fields.map((field) => [field.key, initialMap.get(field.key)?.value ?? ""])) as Record<AdminContentKey, string>);
  const [sourceValues, setSourceValues] = useState<Partial<Record<AdminContentKey, string>>>({});
  const [saveStates, setSaveStates] = useState(() => Object.fromEntries(fields.map((field) => [field.key, "idle"])) as Record<AdminContentKey, SaveState>);
  const [messages, setMessages] = useState(() => Object.fromEntries(fields.map((field) => [field.key, ""])) as Record<AdminContentKey, string>);
  const [revisions, setRevisions] = useState(initialRevisions);
  const initialMediaItems = useMemo(() => readMediaItems(initialMap.get("media.entries_json")?.value), [initialMap]);
  const [mediaItems, setMediaItems] = useState(() => initialMediaItems);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(() => initialMediaItems[0]?.id ?? null);

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
      const nodes = doc.querySelectorAll<HTMLElement>(target.selector);
      nodes.forEach((node) => {
        node.dataset.sntpOwnerField = target.key;
      });
      if (target.textPreview && !records[target.key]?.value) {
        const liveText = nodes[0]?.textContent?.trim() || "";
        if (liveText) {
          setSourceValues((current) => current[target.key] ? current : { ...current, [target.key]: liveText });
          setDrafts((current) => current[target.key] ? current : { ...current, [target.key]: liveText });
        }
      }
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
        setActivePageGroup(groupForField(page.id, key)?.id ?? null);
        setEditingKey(key);
        window.setTimeout(() => focusPreview(key), 0);
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
    setActivePageGroup(groupForField(selectedPage, key)?.id ?? null);
    setEditingKey(key);
    window.setTimeout(() => focusPreview(key), 0);
  }

  function goToPage(page: OwnerPageId, key?: AdminContentKey) {
    setSelectedPage(page);
    setSection("pages");
    setEditingKey(key ?? null);
    setActivePageGroup(key ? groupForField(page, key)?.id ?? null : null);
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
      setDrafts((current) => ({ ...current, [key]: saved.value || sourceValues[key] || "" }));
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
      setMessages((current) => ({ ...current, [key]: saved.value ? "Published to the live site." : "Reviewed website text restored." }));
      window.setTimeout(() => setSaveStates((current) => ({ ...current, [key]: current[key] === "saved" ? "idle" : current[key] })), 2200);
      return saved;
    } catch (error) {
      setSaveStates((current) => ({ ...current, [key]: "error" }));
      setMessages((current) => ({ ...current, [key]: error instanceof Error ? error.message : "Save failed." }));
      return null;
    }
  }

  async function restoreOriginal(key: AdminContentKey) {
    if (!window.confirm(`Reset “${fieldLabel(key)}” to the reviewed website text? You can still recover this version from History.`)) return;
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

  function addMediaItem() {
    const next = blankMediaItem();
    setMediaItems((current) => [next, ...current]);
    setSelectedMediaId(next.id);
  }

  function removeMediaItem(id: string, title: string) {
    const label = title.trim() || "this item";
    if (!window.confirm(`Remove “${label}”? It will not disappear from the live site until you save the media changes.`)) return;
    const fallback = mediaItems.find((candidate) => candidate.id !== id)?.id ?? null;
    setMediaItems((current) => current.filter((candidate) => candidate.id !== id));
    if (selectedMediaId === id) setSelectedMediaId(fallback);
  }

  function renderField(key: AdminContentKey, focused = false) {
    const field = fields.find((candidate) => candidate.key === key);
    if (!field || field.surface === "media" || field.kind === "json") return null;
    const copy = friendlyFields[key] || { label: field.label, help: field.description };
    const record = records[key];
    const baseline = record?.value || sourceValues[key] || "";
    const changed = drafts[key] !== baseline;
    const state = saveStates[key];
    const open = focused || editingKey === key;
    const fieldRevisions = revisions.filter((revision) => revision.key === key).slice(0, 5);

    function discardDraft() {
      setDrafts((current) => ({ ...current, [key]: baseline }));
      setMessages((current) => ({ ...current, [key]: "" }));
      setPreviewRevision((current) => current + 1);
    }

    return (
      <article className={`${styles.settingCard} ${open ? styles.settingCardOpen : ""}`} key={key} data-admin-field={key}>
        {focused ? (
          <div className={styles.focusedFieldHeader}>
            <div>
              <p className={styles.editorEyebrow}>Editing</p>
              <strong>{copy.label}</strong>
              <span>{copy.help}</span>
            </div>
            <span className={changed ? styles.unsavedBadge : styles.liveBadge}>{changed ? "Unsaved" : "Live"}</span>
          </div>
        ) : (
          <button className={styles.settingSummary} type="button" onClick={() => selectField(key, open)} aria-expanded={open}>
            <div>
              <strong>{copy.label}</strong>
              <span>{copy.help}</span>
            </div>
            <b>Edit ›</b>
          </button>
        )}

        {open && (
          <div className={styles.settingEditor}>
            <label className={styles.srOnly} htmlFor={key}>{copy.label}</label>
            {field.kind === "enum" ? (
              <select id={key} value={drafts[key]} onChange={(event) => { const value = event.target.value; setDrafts((current) => ({ ...current, [key]: value })); previewDraft(key, value); }}>
                <option value="">Use reviewed website setting</option>
                {field.allowedValues?.map((value) => <option value={value} key={value}>{value === "official" ? "Official TEDx video" : value === "temporary" ? "Temporary recording" : value}</option>)}
              </select>
            ) : field.kind === "text" && field.maxLength > 120 ? (
              <textarea id={key} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => { const value = event.target.value; setDrafts((current) => ({ ...current, [key]: value })); previewDraft(key, value); }} />
            ) : (
              <input id={key} type={field.kind === "url" ? "url" : field.kind === "email" ? "email" : "text"} value={drafts[key]} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => { const value = event.target.value; setDrafts((current) => ({ ...current, [key]: value })); previewDraft(key, value); }} />
            )}

            <div className={styles.editorMeta}>
              {field.kind === "text" ? <span>{drafts[key].length} / {field.maxLength}</span> : <span>Changes appear in the preview before you publish.</span>}
            </div>

            <div className={styles.publishBar}>
              <div>
                {messages[key] && <span className={state === "error" ? styles.error : styles.success}>{messages[key]}</span>}
                {!messages[key] && <span>{changed ? "Your change is only in this editor until you publish it." : "This matches the live site."}</span>}
              </div>
              <div>
                {changed && <button className={styles.secondaryButton} type="button" disabled={state === "saving"} onClick={discardDraft}>Discard</button>}
                <button className={styles.primaryButton} type="button" disabled={!changed || state === "saving"} onClick={() => void saveValue(key, drafts[key])}>{state === "saving" ? "Publishing…" : "Publish change"}</button>
              </div>
            </div>

            <details className={styles.history}>
              <summary>History &amp; restore</summary>
              <div className={styles.historyUtilities}>
                {Boolean(record?.value) && <button className={styles.historyResetButton} type="button" disabled={state === "saving"} onClick={() => void restoreOriginal(key)}>Reset to reviewed website text</button>}
              </div>
              {fieldRevisions.length > 0 ? (
                <div className={styles.historyList}>
                  {fieldRevisions.map((revision) => (
                    <div className={styles.historyRow} key={`${revision.id}-${revision.version}`}>
                      <div><strong>{revisionTime(revision.createdAt)}</strong><span>{revisionSummary(revision.value)}</span><small>Changed by {revision.updatedBy}</small></div>
                      <button type="button" disabled={revision.value === drafts[key]} onClick={() => { setDrafts((current) => ({ ...current, [key]: revision.value })); previewDraft(key, revision.value); }}>Preview this</button>
                    </div>
                  ))}
                </div>
              ) : <p>No owner changes have been published for this section yet.</p>}
              <p>History is a safety net. Nothing from here goes live until you press Publish change.</p>
            </details>
          </div>
        )}
      </article>
    );
  }

  const mediaRecord = records["media.entries_json"];
  const mediaDirty = JSON.stringify(mediaItems) !== (mediaRecord?.value || "");
  const selectedMediaItem = mediaItems.find((item) => item.id === selectedMediaId) ?? mediaItems[0] ?? null;
  const recentRevisions = revisions.slice(0, 3);

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
            <h2>What would you like to do?</h2>
            <p>Pick a task. The workspace will only show what you need for that job.</p>
            <div className={styles.actionGrid}>
              <button type="button" onClick={() => goTo("pages")}><span>W</span><strong>Edit the website</strong><small>Choose a page and change what visitors see</small></button>
              <button type="button" onClick={() => goTo("newsletters")}><span>F</span><strong>Field Notes</strong><small>Import, publish, and prepare the next email</small></button>
              <button type="button" onClick={() => goTo("media")}><span>M</span><strong>Media & appearances</strong><small>Add or update an event, interview, talk, or press item</small></button>
              <button type="button" onClick={() => goToPage("science")}><span>S</span><strong>Science</strong><small>Review studies and body-system explainers safely</small></button>
            </div>
            <details className={styles.quickLinks}>
              <summary>Other common tasks</summary>
              <button type="button" onClick={() => goToPage("tedx", "tedx.video_url")}>Replace TEDx video</button>
              <button type="button" onClick={() => goToPage("podcast")}>Update podcast</button>
              <button type="button" onClick={() => goTo("press")}>Edit press kit</button>
            </details>
          </section>

          <details className={styles.activityCard}>
            <summary className={styles.activitySummary}><div><strong>Site activity</strong><span>Visitors, subscribers, and other recent activity</span></div><b>View</b></summary>
            <div className={styles.activityBody}><div className={styles.sectionTitleRow}><div><p className={styles.kicker}>Last 30 days</p><h3>How the site is doing</h3></div><small>Traffic numbers only count visitors who allowed anonymous analytics.</small></div>
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
          </div></details>

          <section className={styles.recentCard}>
            <div className={styles.sectionTitleRow}><div><p className={styles.kicker}>Recent changes</p><h3>What was updated lately</h3></div></div>
            {recentRevisions.length ? recentRevisions.map((revision) => (
              <div className={styles.recentRow} key={`${revision.id}-${revision.version}`}>
                <div><strong>{fieldLabel(revision.key)}</strong><span>{revisionSummary(revision.value)}</span></div>
                <small>{revisionTime(revision.createdAt)} · {revision.updatedBy}</small>
              </div>
            )) : <div className={styles.emptyBox}>No owner changes yet. The site is using its original reviewed content.</div>}
          </section>

          <details className={styles.safetyNote}><summary>Why this workspace is safe</summary><p>Science keeps required sources and limitations. Payments, hosting, passwords, and code cannot be changed here. Every owner edit keeps revision history.</p></details>
        </div>
      )}

      {section === "pages" && (() => {
        const page = OWNER_PAGE_DEFINITIONS.find((candidate) => candidate.id === selectedPage) || OWNER_PAGE_DEFINITIONS[0];
        const isScience = page.kind === "science";
        const activeField = editingKey && page.fields.includes(editingKey) ? editingKey : null;
        const groups = pageFieldGroups[page.id] ?? [];
        const activeGroup = groups.find((group) => group.id === activePageGroup) || null;
        return (
          <div className={`${styles.editorPage} ${styles.pageStudioPage}`}>
            <div className={styles.pageStudioToolbar}>
              <label className={styles.pageStudioPagePicker}>
                <span>Website page</span>
                <select
                  value={selectedPage}
                  onChange={(event) => goToPage(event.target.value as OwnerPageId)}
                  aria-label="Choose a website page"
                >
                  {OWNER_PAGE_DEFINITIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
                <small>{page.description}</small>
              </label>
              <div className={styles.pageStudioToolbarActions}>
                {!isScience && (
                  <div className={styles.previewDeviceToggle} aria-label="Preview size">
                    <button type="button" className={previewDevice === "desktop" ? styles.previewDeviceActive : ""} aria-pressed={previewDevice === "desktop"} onClick={() => setPreviewDevice("desktop")}>Desktop</button>
                    <button type="button" className={previewDevice === "mobile" ? styles.previewDeviceActive : ""} aria-pressed={previewDevice === "mobile"} onClick={() => setPreviewDevice("mobile")}>Phone</button>
                  </div>
                )}
                <span className={styles.pageStudioLiveStatus}><i aria-hidden="true" />Live</span>
                <a href={page.href} target="_blank" rel="noreferrer">Open this page ↗</a>
              </div>
            </div>

            {isScience ? (
              <div className={styles.scienceWorkspace}>
                {scienceTool === "overview" ? (
                  <>
                    <section className={styles.livePreviewCard}>
                      <div className={styles.livePreviewHeader}>
                        <div><span>Science page</span><small>See the public page before choosing what kind of science content to manage.</small></div>
                      </div>
                      <div className={styles.livePreviewFrame}>
                        <iframe key={`science-${previewRevision}`} src={`/science?owner_preview=1&owner_preview_revision=${previewRevision}`} title="Science page live preview" loading="lazy" />
                      </div>
                    </section>

                    <details className={styles.pageEditorNote}>
                      <summary>Why Science uses a different editor</summary>
                      <span>Research cannot safely be edited like ordinary website copy. Study methods, sample, limitations, sources, and review status stay attached to each claim.</span>
                    </details>

                    <div className={styles.scienceToolGrid}>
                      <button type="button" onClick={() => setScienceTool("studies")}>
                        <span>01</span>
                        <strong>Human evidence studies</strong>
                        <small>Add or review individual studies, sources, methods, limitations, and publication status.</small>
                        <b>Open studies →</b>
                      </button>
                      <button type="button" onClick={() => setScienceTool("body-systems")}>
                        <span>02</span>
                        <strong>Body-system explainers</strong>
                        <small>Edit the deeper cardiovascular, reproductive, endocrine, kidney, skin, digestive, and pregnancy pages.</small>
                        <b>Open body systems →</b>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button className={styles.toolBackButton} type="button" onClick={() => setScienceTool("overview")}>← All Science tools</button>
                    {scienceTool === "studies" ? (
                      <ScienceManager
                        key={`science-studies-${records["science.entries_json"]?.version ?? 0}`}
                        value={records["science.entries_json"]?.value ?? ""}
                        saveState={saveStates["science.entries_json"]}
                        onSave={(value) => saveValue("science.entries_json", value)}
                      />
                    ) : (
                      <BodySystemManager
                        key={`body-systems-${records["science.body_systems_json"]?.version ?? 0}`}
                        value={records["science.body_systems_json"]?.value ?? ""}
                        saveState={saveStates["science.body_systems_json"]}
                        previewRevision={previewRevision}
                        onSave={(value) => saveValue("science.body_systems_json", value)}
                      />
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className={styles.pageStudioLayout}>
                <aside className={styles.pageStudioPanel}>
                  {activeField ? (
                    <>
                      <button className={styles.studioBackButton} type="button" onClick={() => { setEditingKey(null); clearPreviewFocus(); }}>← {activeGroup?.label || "Page sections"}</button>
                      <div className={styles.settingsList}>{renderField(activeField, true)}</div>
                    </>
                  ) : activeGroup ? (
                    <>
                      <button className={styles.studioBackButton} type="button" onClick={() => { setActivePageGroup(null); clearPreviewFocus(); }}>← All page sections</button>
                      <div className={styles.studioPanelIntro}>
                        <p className={styles.kicker}>{page.label}</p>
                        <h3>{activeGroup.label}</h3>
                        <p>{activeGroup.description}</p>
                      </div>
                      <div className={styles.pageFieldList}>
                        {activeGroup.fields.map((key) => {
                          const field = fields.find((candidate) => candidate.key === key);
                          if (!field) return null;
                          const copy = friendlyFields[key] || { label: field.label, help: field.description };
                          return (
                            <button key={key} type="button" onClick={() => selectField(key, false)}>
                              <div><strong>{copy.label}</strong><small>{copy.help}</small></div>
                              <span>›</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.studioPanelIntro}>
                        <p className={styles.kicker}>{page.label}</p>
                        <h3>What would you like to edit?</h3>
                        <p>Choose the part of the page you recognize, or click directly on text in the preview.</p>
                      </div>
                      <div className={styles.pageSectionList}>
                        {groups.map((group) => (
                          <button key={group.id} type="button" onClick={() => { setActivePageGroup(group.id); clearPreviewFocus(); }}>
                            <div><strong>{group.label}</strong><small>{group.description}</small></div>
                            <span>{group.fields.length} {group.fields.length === 1 ? "item" : "items"} <b>›</b></span>
                          </button>
                        ))}
                      </div>
                      {page.note ? <details className={styles.pageEditorNote}><summary>Why some content is locked</summary><span>{page.note}</span></details> : null}
                    </>
                  )}
                </aside>

                <section className={`${styles.pageStudioPreview} ${previewDevice === "mobile" ? styles.pageStudioPreviewMobile : ""}`}>
                  <div className={styles.pageStudioPreviewHint}><span>Preview</span><small>Click editable text to change it</small></div>
                  <div className={styles.pageStudioPreviewFrame}>
                    <iframe
                      ref={previewFrameRef}
                      key={`${page.id}-${previewRevision}-${previewDevice}`}
                      src={`${page.href}${page.href.includes("?") ? "&" : "?"}owner_preview=1&owner_preview_revision=${previewRevision}`}
                      title={`${page.label} live preview`}
                      loading="lazy"
                      onLoad={preparePreview}
                    />
                  </div>
                </section>
              </div>
            )}
          </div>
        );
      })()}

      {section === "newsletters" && (
        <div className={styles.editorPage}>
          <div className={styles.editorHeader}>
            <div><button className={styles.backButton} type="button" onClick={() => goTo("dashboard")}>← Back to Today</button><h2>Field Notes</h2><p>Choose an issue and continue from the next step. Import from Word when you are ready to start a new one.</p></div>
            <a href="/newsletters" target="_blank" rel="noreferrer">View Field Notes archive ↗</a>
          </div>
          <NewsletterManager />
        </div>
      )}

      {(section === "media" || section === "press") && (
        <div className={styles.editorPage}>
          <div className={styles.editorHeader}>
            <div><button className={styles.backButton} type="button" onClick={() => goTo("dashboard")}>← Back to Today</button><h2>{sectionCopy[section].title}</h2><p>{sectionCopy[section].body}</p></div>
            <a href={sectionCopy[section].previewHref} target="_blank" rel="noreferrer">{sectionCopy[section].previewLabel} ↗</a>
          </div>

          <div className={styles.subTabs} aria-label="Media tools">
            <button type="button" className={section === "media" ? styles.subTabActive : ""} aria-pressed={section === "media"} onClick={() => goTo("media")}>Events &amp; Media</button>
            <button type="button" className={section === "press" ? styles.subTabActive : ""} aria-pressed={section === "press"} onClick={() => goTo("press")}>Press kit</button>
          </div>

          {section === "media" && (
            <section className={styles.mediaManager}>
              <div className={styles.mediaHeader}>
                <div><p className={styles.kicker}>Events and appearances</p><h3>Media items</h3><p>Choose an item to edit, or create a new private draft.</p></div>
                <button className={styles.primaryButton} type="button" onClick={addMediaItem}>+ Add event or appearance</button>
              </div>
              {mediaItems.length === 0 || !selectedMediaItem ? <div className={styles.emptyBox}>No owner-added events or appearances yet.</div> : (
                <div className={styles.mediaWorkbench}>
                  <aside className={styles.mediaItemNav} aria-label="Events and media items">
                    <div className={styles.mediaItemNavHeading}><strong>Items</strong><span>{mediaItems.length}</span></div>
                    {mediaItems.map((item) => (
                      <button key={item.id} type="button" className={selectedMediaItem.id === item.id ? styles.mediaItemNavActive : ""} aria-pressed={selectedMediaItem.id === item.id} onClick={() => setSelectedMediaId(item.id)}>
                        <div><span className={item.published ? styles.newsletterLive : styles.newsletterDraft}>{item.published ? "Live" : "Draft"}</span><small>{item.type}</small></div>
                        <strong>{item.title || "Untitled media item"}</strong>
                        <small>{item.date || item.platform || "No date yet"}</small>
                      </button>
                    ))}
                  </aside>

                  <article className={styles.mediaItem} key={selectedMediaItem.id}>
                    <div className={styles.mediaTopRow}>
                      <select value={selectedMediaItem.type} aria-label="Item type" onChange={(event) => updateMediaItem(selectedMediaItem.id, { type: event.target.value as OwnerMediaItemType })}>
                        <option value="event">Event</option><option value="talk">Talk</option><option value="interview">Interview</option><option value="podcast">Podcast appearance</option><option value="press">Press</option>
                      </select>
                      <label className={styles.publishSwitch}><input type="checkbox" checked={selectedMediaItem.published} onChange={(event) => updateMediaItem(selectedMediaItem.id, { published: event.target.checked })} /><span>{selectedMediaItem.published ? "Show on site" : "Keep private"}</span></label>
                    </div>
                    <label>Title<input type="text" value={selectedMediaItem.title} maxLength={140} placeholder="Example: Dr. Haddad at TEDxMiami" onChange={(event) => updateMediaItem(selectedMediaItem.id, { title: event.target.value })} /></label>
                    <div className={styles.twoCol}><label>Date<input type="date" value={selectedMediaItem.date} onChange={(event) => updateMediaItem(selectedMediaItem.id, { date: event.target.value })} /></label><label>Where it appeared<input type="text" value={selectedMediaItem.platform} maxLength={100} placeholder="Event, publication, podcast, etc." onChange={(event) => updateMediaItem(selectedMediaItem.id, { platform: event.target.value })} /></label></div>
                    <label>Link <small>optional</small><input type="url" value={selectedMediaItem.url} maxLength={500} placeholder="https://..." onChange={(event) => updateMediaItem(selectedMediaItem.id, { url: event.target.value })} /></label>
                    <label>Short description<textarea value={selectedMediaItem.description} maxLength={700} placeholder="What should visitors know?" onChange={(event) => updateMediaItem(selectedMediaItem.id, { description: event.target.value })} /></label>
                    <div className={styles.mediaItemFooter}><span>{selectedMediaItem.published ? "This item will be public after you save." : "This item will stay private after you save."}</span></div>
                    <details className={styles.objectMore}>
                      <summary>More actions</summary>
                      <div><button className={styles.dangerMenuButton} type="button" onClick={() => removeMediaItem(selectedMediaItem.id, selectedMediaItem.title)}>Remove item</button></div>
                    </details>
                  </article>
                </div>
              )}
              {(mediaDirty || saveStates["media.entries_json"] === "saving" || Boolean(messages["media.entries_json"])) && <div className={styles.mediaSaveBar}><span>{messages["media.entries_json"] || (mediaDirty ? "You have unsaved media changes." : "Saved.")}</span><button className={styles.primaryButton} type="button" disabled={!mediaDirty || saveStates["media.entries_json"] === "saving"} onClick={() => void saveMediaItems()}>{saveStates["media.entries_json"] === "saving" ? "Saving…" : "Save changes"}</button></div>}
            </section>
          )}

          <section className={styles.settingsList}>
            <div className={styles.settingsIntro}><h3>{section === "media" ? "Page text" : "Biography and contact"}</h3><p>Click Edit beside only the item you want to change.</p></div>
            {fieldGroups[section].map((key) => renderField(key))}
          </section>
        </div>
      )}
    </div>
  );
}

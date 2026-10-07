"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";

type Newsletter = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  sourceFilename: string;
  published: boolean;
  publishedAt: string | null;
  mailchimpCampaignId: string | null;
  mailchimpCreatedAt: string | null;
  mailchimpSentAt: string | null;
  sourceImageCount: number;
  createdAt: string;
};

type RowState = Newsletter & {
  draftTitle: string;
  draftExcerpt: string;
  busy?: "saving" | "publishing" | "mailchimp" | "sending" | "deleting";
  message?: string;
  error?: string;
};

function toRow(item: Newsletter): RowState {
  return { ...item, draftTitle: item.title, draftExcerpt: item.excerpt };
}

function prettyDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function issueStage(row: RowState) {
  if (row.mailchimpSentAt) return { label: "Sent", tone: "done" as const, next: "Sent to subscribers" };
  if (row.mailchimpCampaignId) return { label: "Email ready", tone: "live" as const, next: "Send to subscribers" };
  if (row.published) return { label: "Published", tone: "live" as const, next: "Send to subscribers" };
  return { label: "Draft", tone: "draft" as const, next: "Publish & send" };
}

export function NewsletterManager() {
  const [rows, setRows] = useState<RowState[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [mailchimpUrl, setMailchimpUrl] = useState("https://mailchimp.com/");
  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null;

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const response = await fetch("/admin/api/newsletters", { cache: "no-store" });
        const body = await response.json() as { newsletters?: Newsletter[]; mailchimpUrl?: string; error?: string };
        if (!response.ok || !body.newsletters) throw new Error(body.error || "Unable to load newsletters.");
        if (!active) return;
        const next = body.newsletters.map(toRow);
        setRows(next);
        setSelectedId((current) => current && next.some((row) => row.id === current) ? current : next[0]?.id ?? null);
        if (body.mailchimpUrl) setMailchimpUrl(body.mailchimpUrl);
      } catch (error) {
        if (active) setUploadError(error instanceof Error ? error.message : "Unable to load newsletters.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, []);

  function patchRow(id: number, patch: Partial<RowState>) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  }

  async function upload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    setUploadMessage("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/admin/api/newsletters", { method: "POST", body: form });
      const body = await response.json() as { newsletter?: Newsletter; warnings?: string[]; error?: string };
      if (!response.ok || !body.newsletter) throw new Error(body.error || "Import failed.");
      const next = toRow(body.newsletter);
      setRows((current) => [next, ...current]);
      setSelectedId(next.id);
      setUploadMessage(body.warnings?.[0] || "Imported successfully. Review the preview, then use Publish & send when you are ready.");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Import failed.");
    } finally {
      setUploading(false);
    }
  }

  async function update(row: RowState, patch: { title?: string; excerpt?: string; published?: boolean }, busy: RowState["busy"]) {
    patchRow(row.id, { busy, message: "", error: "" });
    try {
      const response = await fetch(`/admin/api/newsletters/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = await response.json() as { newsletter?: Newsletter; error?: string };
      if (!response.ok || !body.newsletter) throw new Error(body.error || "Update failed.");
      const saved = body.newsletter;
      setRows((current) => current.map((item) => item.id === row.id ? {
        ...toRow(saved),
        message: typeof patch.published === "boolean"
          ? (saved.published ? "Published to Field Notes." : "Removed from the public archive.")
          : "Details saved.",
      } : item));
    } catch (error) {
      patchRow(row.id, { busy: undefined, error: error instanceof Error ? error.message : "Update failed." });
    }
  }

  async function createMailchimp(row: RowState) {
    const mailchimpWindow = window.open("about:blank", "_blank");
    patchRow(row.id, { busy: "mailchimp", message: "", error: "" });
    try {
      const response = await fetch(`/admin/api/newsletters/${row.id}/mailchimp`, { method: "POST" });
      const body = await response.json() as { newsletter?: Newsletter; mailchimpUrl?: string; error?: string };
      if (!response.ok || !body.newsletter) throw new Error(body.error || "Could not create Mailchimp draft.");
      const saved = body.newsletter;
      const destination = body.mailchimpUrl || mailchimpUrl;
      setRows((current) => current.map((item) => item.id === row.id ? {
        ...toRow(saved),
        message: "Email draft created. You can send it from here when ready.",
      } : item));
      if (body.mailchimpUrl) setMailchimpUrl(body.mailchimpUrl);
      if (mailchimpWindow) {
        mailchimpWindow.opener = null;
        mailchimpWindow.location.href = destination;
      }
    } catch (error) {
      if (mailchimpWindow) mailchimpWindow.close();
      patchRow(row.id, { busy: undefined, error: error instanceof Error ? error.message : "Could not create Mailchimp draft." });
    }
  }

  async function sendNewsletter(row: RowState) {
    const imageWarning = row.sourceImageCount > 0
      ? `\n\nImportant: this Word file has ${row.sourceImageCount} embedded image${row.sourceImageCount === 1 ? "" : "s"}. Those images are not included by the importer, so the email will send as text-only unless you build the draft manually in Mailchimp.`
      : "";
    const action = row.published
      ? "Send this Field Note to all currently subscribed Mailchimp contacts now?"
      : "Publish this Field Note to the website and send it to all currently subscribed Mailchimp contacts now?";
    if (!window.confirm(`${action}\n\nThis email send is immediate and cannot be undone.${imageWarning}`)) return;

    patchRow(row.id, { busy: "sending", message: "", error: "" });
    try {
      const response = await fetch(`/admin/api/newsletters/${row.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledgeMissingImages: row.sourceImageCount > 0 }),
      });
      const body = await response.json() as {
        newsletter?: Newsletter;
        mailchimpUrl?: string;
        alreadySentAtMailchimp?: boolean;
        error?: string;
      };
      if (!response.ok || !body.newsletter) {
        if (body.newsletter) {
          setRows((current) => current.map((item) => item.id === row.id ? { ...toRow(body.newsletter as Newsletter), error: body.error || "Could not send this Field Note." } : item));
        }
        throw new Error(body.error || "Could not send this Field Note.");
      }
      const saved = body.newsletter;
      setRows((current) => current.map((item) => item.id === row.id ? {
        ...toRow(saved),
        message: body.alreadySentAtMailchimp
          ? "Mailchimp had already sent this campaign. The website record is now synced."
          : (row.published ? "Sent to subscribers." : "Published to Field Notes and sent to subscribers."),
      } : item));
      if (body.mailchimpUrl) setMailchimpUrl(body.mailchimpUrl);
    } catch (error) {
      patchRow(row.id, { busy: undefined, error: error instanceof Error ? error.message : "Could not send this Field Note." });
    }
  }

  async function removeNewsletter(row: RowState) {
    const publicNote = row.published ? " It will disappear from the public Field Notes archive immediately." : "";
    const emailNote = row.mailchimpCampaignId ? " Its Mailchimp draft will stay in Mailchimp." : "";
    if (!window.confirm(`Delete “${row.title}”?${publicNote}${emailNote} This cannot be undone on the website.`)) return;
    patchRow(row.id, { busy: "deleting", message: "", error: "" });
    try {
      const response = await fetch(`/admin/api/newsletters/${row.id}`, { method: "POST" });
      const body = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) throw new Error(body.error || "Could not delete newsletter.");
      setRows((current) => {
        const next = current.filter((item) => item.id !== row.id);
        setSelectedId(next[0]?.id ?? null);
        return next;
      });
      setUploadMessage(row.mailchimpCampaignId ? "Issue removed from the website manager. Its Mailchimp draft was left untouched." : "Issue removed from the website manager.");
    } catch (error) {
      patchRow(row.id, { busy: undefined, error: error instanceof Error ? error.message : "Could not delete newsletter." });
    }
  }

  const counts = useMemo(() => ({
    drafts: rows.filter((row) => !row.published).length,
    published: rows.filter((row) => row.published).length,
  }), [rows]);

  return (
    <section className={styles.newsletterManager}>
      <div className={styles.objectToolbar}>
        <div>
          <p className={styles.kicker}>Field Notes</p>
          <h3>Your issues</h3>
          <p>Choose an issue to continue where you left off.</p>
        </div>
        <label className={styles.newsletterUpload}>
          <span>{uploading ? "Importing…" : "+ New from Word"}</span>
          <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0] || null; void upload(file); event.currentTarget.value = ""; }} />
        </label>
      </div>

      {uploadMessage ? <div className={styles.newsletterNotice}>{uploadMessage}</div> : null}
      {uploadError ? <div className={styles.newsletterError}>{uploadError}</div> : null}

      {loading ? <div className={styles.emptyBox}>Loading Field Notes…</div> : rows.length === 0 ? (
        <div className={styles.emptyBox}>No issues yet. Import a Word document to create the first one.</div>
      ) : (
        <div className={styles.objectWorkbench}>
          <aside className={styles.objectList} aria-label="Field Notes issues">
            <div className={styles.objectListHeading}>
              <strong>Issues</strong>
              <span>{counts.drafts} draft{counts.drafts === 1 ? "" : "s"} · {counts.published} published</span>
            </div>
            {rows.map((row) => {
              const stage = issueStage(row);
              return (
                <button key={row.id} type="button" className={selected?.id === row.id ? styles.objectListActive : ""} onClick={() => setSelectedId(row.id)}>
                  <div><span className={stage.tone === "live" || stage.tone === "done" ? styles.newsletterLive : styles.newsletterDraft}>{stage.label}</span><small>{prettyDate(row.publishedAt || row.createdAt)}</small></div>
                  <strong>{row.title || "Untitled Field Note"}</strong>
                  <small>{row.excerpt || row.sourceFilename}</small>
                </button>
              );
            })}
          </aside>

          {selected && (() => {
            const detailsDirty = selected.draftTitle !== selected.title || selected.draftExcerpt !== selected.excerpt;
            const stage = issueStage(selected);
            return (
              <article className={styles.objectDetail}>
                <header className={styles.objectDetailHeader}>
                  <div>
                    <span className={stage.tone === "live" || stage.tone === "done" ? styles.newsletterLive : styles.newsletterDraft}>{stage.label}</span>
                    <h4>{selected.title || "Untitled Field Note"}</h4>
                    <small>{selected.sourceFilename} · imported {prettyDate(selected.createdAt)}</small>
                  </div>
                  <a href={`/admin/newsletters/${selected.id}/preview`} target="_blank" rel="noreferrer">Preview issue ↗</a>
                </header>

                <div className={styles.objectProgress} aria-label="Field Notes workflow">
                  <span className={styles.progressDone}>Imported</span>
                  <span className={selected.published ? styles.progressDone : styles.progressCurrent}>Published</span>
                  <span className={selected.mailchimpCampaignId ? styles.progressDone : selected.published ? styles.progressCurrent : ""}>Email ready</span>
                  <span className={selected.mailchimpSentAt ? styles.progressDone : selected.mailchimpCampaignId ? styles.progressCurrent : ""}>Sent</span>
                </div>

                {selected.sourceImageCount > 0 && !selected.mailchimpSentAt ? (
                  <div className={styles.newsletterNotice}>This Word file contains {selected.sourceImageCount} embedded image{selected.sourceImageCount === 1 ? "" : "s"}. The automatic email importer sends the text, headings, links, and lists, but not embedded Word images. Use “Create Mailchimp draft only” below if those images need to be added before sending.</div>
                ) : null}

                <div className={styles.objectNextAction}>
                  <div>
                    <span>Next step</span>
                    <strong>{detailsDirty ? "Save your text changes" : stage.next}</strong>
                    {selected.message ? <small className={styles.success}>{selected.message}</small> : selected.error ? <small className={styles.error}>{selected.error}</small> : null}
                  </div>
                  <div>
                    {detailsDirty ? (
                      <button className={styles.primaryButton} type="button" disabled={Boolean(selected.busy)} onClick={() => void update(selected, { title: selected.draftTitle, excerpt: selected.draftExcerpt }, "saving")}>{selected.busy === "saving" ? "Saving…" : "Save changes"}</button>
                    ) : !selected.mailchimpSentAt ? (
                      <button className={styles.primaryButton} type="button" disabled={Boolean(selected.busy)} onClick={() => void sendNewsletter(selected)}>{selected.busy === "sending" ? "Sending…" : selected.published ? "Send to subscribers" : "Publish & send"}</button>
                    ) : (
                      <a className={styles.primaryButton} href={mailchimpUrl} target="_blank" rel="noreferrer">Open Mailchimp ↗</a>
                    )}
                    {selected.published ? <a className={styles.secondaryButton} href={`/newsletters/${selected.slug}`} target="_blank" rel="noreferrer">View live ↗</a> : null}
                  </div>
                </div>

                <details className={styles.issueDetails}>
                  <summary>Edit issue details</summary>
                  <div className={styles.objectFields}>
                    <label>Title<input value={selected.draftTitle} maxLength={180} onChange={(event) => patchRow(selected.id, { draftTitle: event.target.value })} /></label>
                    <label>Archive description <small>optional</small><textarea value={selected.draftExcerpt} maxLength={320} onChange={(event) => patchRow(selected.id, { draftExcerpt: event.target.value })} /></label>
                  </div>
                </details>

                <details className={styles.objectMore}>
                  <summary>More actions</summary>
                  <div>
                    {!selected.published ? <button type="button" disabled={Boolean(selected.busy)} onClick={() => void update(selected, { published: true }, "publishing")}>Publish without sending</button> : null}
                    {selected.published && !selected.mailchimpCampaignId ? <button type="button" disabled={Boolean(selected.busy)} onClick={() => void createMailchimp(selected)}>{selected.busy === "mailchimp" ? "Creating…" : "Create Mailchimp draft only"}</button> : null}
                    {selected.mailchimpCampaignId ? <a href={mailchimpUrl} target="_blank" rel="noreferrer">Open Mailchimp ↗</a> : null}
                    {selected.published && !selected.mailchimpSentAt ? <button type="button" disabled={Boolean(selected.busy)} onClick={() => void update(selected, { published: false }, "publishing")}>Unpublish from website</button> : null}
                    {!selected.mailchimpSentAt ? <button className={styles.dangerMenuButton} type="button" disabled={Boolean(selected.busy)} onClick={() => void removeNewsletter(selected)}>{selected.busy === "deleting" ? "Deleting…" : "Delete from website manager"}</button> : <span>Sent issues stay published so links in subscribers’ emails keep working.</span>}
                  </div>
                </details>
              </article>
            );
          })()}
        </div>
      )}
    </section>
  );
}

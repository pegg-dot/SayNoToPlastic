"use client";

import { useEffect, useState } from "react";
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
  createdAt: string;
};

type RowState = Newsletter & {
  draftTitle: string;
  draftExcerpt: string;
  busy?: "saving" | "publishing" | "mailchimp" | "deleting";
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

export function NewsletterManager() {
  const [rows, setRows] = useState<RowState[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [mailchimpUrl, setMailchimpUrl] = useState("https://mailchimp.com/");

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/admin/api/newsletters", { cache: "no-store" });
      const body = await response.json() as { newsletters?: Newsletter[]; mailchimpUrl?: string; error?: string };
      if (!response.ok || !body.newsletters) throw new Error(body.error || "Unable to load newsletters.");
      setRows(body.newsletters.map(toRow));
      if (body.mailchimpUrl) setMailchimpUrl(body.mailchimpUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to load newsletters.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

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
      setRows((current) => [toRow(body.newsletter!), ...current]);
      setUploadMessage(body.warnings?.[0] || "Word document imported. Check the preview, then publish when ready.");
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
          ? (saved.published ? "Published on the website." : "Removed from the public archive.")
          : "Newsletter details saved.",
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
        message: "Mailchimp draft created. Review and send it from Mailchimp.",
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

  async function removeNewsletter(row: RowState) {
    const publicNote = row.published ? " It will disappear from the public Field Notes archive immediately." : "";
    const emailNote = row.mailchimpCampaignId ? " Its Mailchimp draft will stay in Mailchimp so an email record is never removed by accident." : "";
    if (!window.confirm(`Delete “${row.title}”?${publicNote}${emailNote} This cannot be undone on the website.`)) return;

    patchRow(row.id, { busy: "deleting", message: "", error: "" });
    try {
      const response = await fetch(`/admin/api/newsletters/${row.id}`, { method: "POST" });
      const body = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) throw new Error(body.error || "Could not delete newsletter.");
      setRows((current) => current.filter((item) => item.id !== row.id));
      setUploadMessage(row.mailchimpCampaignId
        ? "Newsletter deleted from the website manager. Its existing Mailchimp draft was left untouched."
        : "Newsletter deleted from the website manager.");
    } catch (error) {
      patchRow(row.id, { busy: undefined, error: error instanceof Error ? error.message : "Could not delete newsletter." });
    }
  }

  return (
    <section className={styles.newsletterManager}>
      <div className={styles.newsletterIntro}>
        <div>
          <p className={styles.kicker}>Field Notes</p>
          <h3>Publish a newsletter</h3>
          <p>Upload the Word document Dr. Haddad already uses. The website imports the text and formatting, then you can check it before publishing.</p>
        </div>
        <label className={styles.newsletterUpload}>
          <span>{uploading ? "Importing…" : "Upload Word document"}</span>
          <small>.docx · up to 4 MB</small>
          <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0] || null; void upload(file); event.currentTarget.value = ""; }} />
        </label>
      </div>

      <div className={styles.newsletterWorkflow} aria-label="Newsletter publishing workflow">
        <div><span>1</span><strong>Upload</strong><small>Word .docx</small></div>
        <div><span>2</span><strong>Preview</strong><small>Check the website version</small></div>
        <div><span>3</span><strong>Publish</strong><small>Add it to Field Notes</small></div>
        <div><span>4</span><strong>Email</strong><small>Create the Mailchimp draft</small></div>
      </div>

      {uploadMessage ? <div className={styles.newsletterNotice}>{uploadMessage}</div> : null}
      {uploadError ? <div className={styles.newsletterError}>{uploadError}</div> : null}

      {loading ? <div className={styles.emptyBox}>Loading newsletters…</div> : rows.length === 0 ? (
        <div className={styles.emptyBox}>No newsletters have been imported yet. Upload a Word document to create the first one.</div>
      ) : (
        <div className={styles.newsletterList}>
          {rows.map((row) => {
            const detailsDirty = row.draftTitle !== row.title || row.draftExcerpt !== row.excerpt;
            return <article className={styles.newsletterRow} key={row.id}>
              <div className={styles.newsletterRowTop}>
                <div>
                  <span className={row.published ? styles.newsletterLive : styles.newsletterDraft}>{row.published ? "Published" : "Draft"}</span>
                  <small>{row.sourceFilename} · imported {prettyDate(row.createdAt)}</small>
                </div>
                <div className={styles.newsletterLinks}>
                  <a href={`/admin/newsletters/${row.id}/preview`} target="_blank" rel="noreferrer">Preview ↗</a>
                  {row.published ? <a href={`/newsletters/${row.slug}`} target="_blank" rel="noreferrer">Open live issue ↗</a> : null}
                </div>
              </div>

              <h4 className={styles.newsletterCardTitle}>{row.title}</h4>
              <details className={styles.newsletterDetails}>
                <summary>Edit title &amp; archive description</summary>
                <div className={styles.newsletterFields}>
                  <label>Newsletter title<input value={row.draftTitle} maxLength={180} onChange={(event) => patchRow(row.id, { draftTitle: event.target.value })} /></label>
                  <label>Short archive description <small>optional</small><textarea value={row.draftExcerpt} maxLength={320} onChange={(event) => patchRow(row.id, { draftExcerpt: event.target.value })} /></label>
                </div>
              </details>

              <div className={styles.newsletterActions}>
                <div>
                  {row.message ? <span className={styles.success}>{row.message}</span> : null}
                  {row.error ? <span className={styles.error}>{row.error}</span> : null}
                  {!row.message && !row.error ? (
                    <span className={styles.saveHint}>
                      {row.mailchimpCampaignId ? "Email draft ready in Mailchimp." : row.published ? "Website issue is live. Next: create the email draft." : "Draft is private. Next: publish it to the website."}
                    </span>
                  ) : null}
                </div>
                <div className={styles.newsletterPrimaryActions}>
                  {detailsDirty ? (
                    <button className={styles.secondaryButton} type="button" disabled={Boolean(row.busy)} onClick={() => void update(row, { title: row.draftTitle, excerpt: row.draftExcerpt }, "saving")}>{row.busy === "saving" ? "Saving…" : "Save title & description"}</button>
                  ) : null}
                  {!row.published ? (
                    <button className={styles.primaryButton} type="button" disabled={Boolean(row.busy)} onClick={() => void update(row, { published: true }, "publishing")}>{row.busy === "publishing" ? "Publishing…" : "Publish to website"}</button>
                  ) : !row.mailchimpCampaignId ? (
                    <button className={styles.primaryButton} type="button" disabled={Boolean(row.busy)} onClick={() => void createMailchimp(row)}>{row.busy === "mailchimp" ? "Creating…" : "Create Mailchimp draft"}</button>
                  ) : (
                    <a className={styles.primaryButton} href={mailchimpUrl} target="_blank" rel="noreferrer">Open Mailchimp ↗</a>
                  )}
                  <details className={styles.newsletterMore}>
                    <summary aria-label={`More actions for ${row.title}`}>More</summary>
                    <div>
                      {row.published ? <button type="button" disabled={Boolean(row.busy)} onClick={() => void update(row, { published: false }, "publishing")}>{row.busy === "publishing" ? "Updating…" : "Unpublish from website"}</button> : null}
                      <button className={styles.dangerMenuButton} type="button" disabled={Boolean(row.busy)} onClick={() => void removeNewsletter(row)}>{row.busy === "deleting" ? "Deleting…" : "Delete from website manager"}</button>
                    </div>
                  </details>
                </div>
              </div>
            </article>;
          })}
        </div>
      )}
    </section>
  );
}

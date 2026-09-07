"use client";

import { useMemo, useState } from "react";
import type { AdminContentKey, AdminContentRecord } from "../lib/admin-content";
import styles from "./admin.module.css";

type Field = {
  key: AdminContentKey;
  label: string;
  description: string;
  kind: "url" | "enum" | "text";
  maxLength: number;
  allowedValues?: string[];
  placeholder?: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function AdminPanel({
  fields,
  initialContent,
}: {
  fields: Field[];
  initialContent: AdminContentRecord[];
}) {
  const initialMap = useMemo(() => new Map(initialContent.map((record) => [record.key, record])), [initialContent]);
  const [records, setRecords] = useState(() => Object.fromEntries(initialContent.map((record) => [record.key, record])) as Record<AdminContentKey, AdminContentRecord>);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(fields.map((field) => [field.key, initialMap.get(field.key)?.value ?? ""])) as Record<AdminContentKey, string>);
  const [saveStates, setSaveStates] = useState(() => Object.fromEntries(fields.map((field) => [field.key, "idle"])) as Record<AdminContentKey, SaveState>);
  const [messages, setMessages] = useState(() => Object.fromEntries(fields.map((field) => [field.key, ""])) as Record<AdminContentKey, string>);

  async function save(key: AdminContentKey) {
    setSaveStates((current) => ({ ...current, [key]: "saving" }));
    setMessages((current) => ({ ...current, [key]: "" }));

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: drafts[key],
          expectedVersion: records[key]?.version ?? 0,
        }),
      });
      const body = await response.json() as { error?: string; saved?: AdminContentRecord };
      if (!response.ok || !body.saved) throw new Error(body.error || "Save failed.");

      setRecords((current) => ({ ...current, [key]: body.saved as AdminContentRecord }));
      setDrafts((current) => ({ ...current, [key]: body.saved?.value ?? current[key] }));
      setSaveStates((current) => ({ ...current, [key]: "saved" }));
      setMessages((current) => ({ ...current, [key]: "Saved" }));
      window.setTimeout(() => {
        setSaveStates((current) => ({ ...current, [key]: current[key] === "saved" ? "idle" : current[key] }));
      }, 1800);
    } catch (error) {
      setSaveStates((current) => ({ ...current, [key]: "error" }));
      setMessages((current) => ({ ...current, [key]: error instanceof Error ? error.message : "Save failed." }));
    }
  }

  const groups = [
    { title: "TEDx", keys: ["tedx.video_url", "tedx.status"] as AdminContentKey[] },
    { title: "Beyond Plastic podcast", keys: ["podcast.spotify_url", "podcast.apple_url", "podcast.youtube_url", "podcast.amazon_url"] as AdminContentKey[] },
    { title: "Public notices", keys: ["site.notice", "media.owner_update"] as AdminContentKey[] },
  ];

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section className={styles.group} key={group.title}>
          <div className={styles.groupHeading}>
            <h2>{group.title}</h2>
            <p>Only the fields below are owner-editable in this release.</p>
          </div>

          <div className={styles.fields}>
            {group.keys.map((key) => {
              const field = fields.find((candidate) => candidate.key === key);
              if (!field) return null;
              const record = records[key];
              const changed = drafts[key] !== (record?.value ?? "");
              const state = saveStates[key];

              return (
                <div className={styles.fieldCard} key={key}>
                  <div className={styles.fieldMeta}>
                    <label htmlFor={key}>{field.label}</label>
                    <p>{field.description}</p>
                  </div>

                  {field.kind === "enum" ? (
                    <select
                      id={key}
                      value={drafts[key]}
                      onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}
                    >
                      <option value="">Use source default</option>
                      {field.allowedValues?.map((value) => <option value={value} key={value}>{value}</option>)}
                    </select>
                  ) : field.maxLength > 250 ? (
                    <textarea
                      id={key}
                      value={drafts[key]}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  ) : (
                    <input
                      id={key}
                      type={field.kind === "url" ? "url" : "text"}
                      value={drafts[key]}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      onChange={(event) => setDrafts((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  )}

                  <div className={styles.fieldFooter}>
                    <span>
                      {record?.version ? `Version ${record.version}` : "Using source default"}
                      {record?.updatedBy ? ` · last changed by ${record.updatedBy}` : ""}
                    </span>
                    <div>
                      {messages[key] && <small className={state === "error" ? styles.error : styles.success}>{messages[key]}</small>}
                      <button type="button" disabled={!changed || state === "saving"} onClick={() => void save(key)}>
                        {state === "saving" ? "Saving…" : "Save change"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

import { desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { adminContent, adminContentRevisions } from "../../db/admin-schema";

export type AdminContentKey =
  | "tedx.video_url"
  | "tedx.status"
  | "podcast.spotify_url"
  | "podcast.apple_url"
  | "podcast.youtube_url"
  | "podcast.amazon_url"
  | "site.notice"
  | "media.owner_update";

type FieldKind = "url" | "enum" | "text";

type AdminFieldSpec = {
  key: AdminContentKey;
  label: string;
  description: string;
  kind: FieldKind;
  maxLength: number;
  allowedHosts?: string[];
  allowedValues?: string[];
  placeholder?: string;
};

export const ADMIN_CONTENT_FIELDS: AdminFieldSpec[] = [
  {
    key: "tedx.video_url",
    label: "TEDx video URL",
    description: "Temporary or official YouTube URL used on the TEDx and Events & Media pages.",
    kind: "url",
    maxLength: 500,
    allowedHosts: ["youtube.com", "www.youtube.com", "youtu.be"],
    placeholder: "https://www.youtube.com/watch?v=...",
  },
  {
    key: "tedx.status",
    label: "TEDx video status",
    description: "Keep this Temporary until TEDx publishes the official release. Official requires an owner-supplied TEDx video URL.",
    kind: "enum",
    maxLength: 20,
    allowedValues: ["temporary", "official"],
  },
  {
    key: "podcast.spotify_url",
    label: "Spotify show URL",
    description: "Use a direct show URL once verified. Leaving this blank keeps the source-code fallback.",
    kind: "url",
    maxLength: 500,
    allowedHosts: ["open.spotify.com"],
  },
  {
    key: "podcast.apple_url",
    label: "Apple Podcasts URL",
    description: "Use a direct Apple Podcasts show URL once verified.",
    kind: "url",
    maxLength: 500,
    allowedHosts: ["podcasts.apple.com"],
  },
  {
    key: "podcast.youtube_url",
    label: "Podcast YouTube URL",
    description: "Channel or playlist URL for Beyond Plastic.",
    kind: "url",
    maxLength: 500,
    allowedHosts: ["youtube.com", "www.youtube.com", "youtu.be"],
  },
  {
    key: "podcast.amazon_url",
    label: "Amazon Music podcast URL",
    description: "Direct Amazon Music listing for Beyond Plastic.",
    kind: "url",
    maxLength: 500,
    allowedHosts: ["music.amazon.com"],
  },
  {
    key: "site.notice",
    label: "Site notice",
    description: "Optional short public notice. Leave blank to hide it.",
    kind: "text",
    maxLength: 180,
    placeholder: "Optional announcement",
  },
  {
    key: "media.owner_update",
    label: "Events & Media update",
    description: "Optional owner update for the Events & Media page. Leave blank to hide it.",
    kind: "text",
    maxLength: 600,
    placeholder: "Optional public update",
  },
];

const FIELD_MAP = new Map(ADMIN_CONTENT_FIELDS.map((field) => [field.key, field]));

export type AdminContentRecord = {
  key: AdminContentKey;
  value: string;
  version: number;
  updatedBy: string | null;
  updatedAt: string | null;
};

export type AdminContentRevision = {
  id: number;
  key: AdminContentKey;
  value: string;
  version: number;
  updatedBy: string;
  createdAt: string;
};

function normalizeHostname(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function validateUrl(value: string, allowedHosts: string[] | undefined) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter a valid URL.");
  }
  if (url.protocol !== "https:") throw new Error("Only HTTPS URLs are allowed.");
  if (allowedHosts?.length) {
    const hostname = normalizeHostname(url.hostname);
    const allowed = allowedHosts.some((host) => normalizeHostname(host) === hostname);
    if (!allowed) throw new Error(`URL host is not allowed for this field: ${url.hostname}`);
  }
  return url.toString();
}

export function validateAdminContentValue(key: AdminContentKey, rawValue: unknown) {
  const field = FIELD_MAP.get(key);
  if (!field) throw new Error("Unknown admin content field.");
  if (typeof rawValue !== "string") throw new Error("Value must be text.");

  const value = rawValue.trim();
  if (value.length > field.maxLength) throw new Error(`${field.label} is too long.`);
  if (!value) return "";

  if (field.kind === "url") return validateUrl(value, field.allowedHosts);
  if (field.kind === "enum") {
    if (!field.allowedValues?.includes(value)) throw new Error(`Invalid value for ${field.label}.`);
    return value;
  }
  return value;
}

export async function listAdminContent(): Promise<AdminContentRecord[]> {
  const db = await getDb();
  const rows = await db.select().from(adminContent);
  const byKey = new Map(rows.map((row) => [row.key, row]));

  return ADMIN_CONTENT_FIELDS.map((field) => {
    const row = byKey.get(field.key);
    return {
      key: field.key,
      value: row?.value ?? "",
      version: row?.version ?? 0,
      updatedBy: row?.updatedBy ?? null,
      updatedAt: row?.updatedAt ?? null,
    };
  });
}

export async function listAdminContentRevisions(limit = 60): Promise<AdminContentRevision[]> {
  const db = await getDb();
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const rows = await db.select().from(adminContentRevisions).orderBy(desc(adminContentRevisions.id)).limit(safeLimit);

  return rows.flatMap((row) => {
    if (!isAdminContentKey(row.key)) return [];
    return [{
      id: row.id,
      key: row.key,
      value: row.value,
      version: row.version,
      updatedBy: row.updatedBy,
      createdAt: row.createdAt,
    } satisfies AdminContentRevision];
  });
}

export async function getAdminContentValue(key: AdminContentKey) {
  try {
    const db = await getDb();
    const [row] = await db.select().from(adminContent).where(eq(adminContent.key, key)).limit(1);
    return row?.value ?? "";
  } catch (error) {
    console.warn("admin_public_override_unavailable", key, error);
    return "";
  }
}

async function enforceTedxStateConsistency(
  db: Awaited<ReturnType<typeof getDb>>,
  key: AdminContentKey,
  value: string,
) {
  if (key === "tedx.status" && value === "official") {
    const [video] = await db.select().from(adminContent).where(eq(adminContent.key, "tedx.video_url")).limit(1);
    if (!video?.value) {
      throw new Error("Add and save the official TEDx video URL before marking the release official.");
    }
  }

  if (key === "tedx.video_url" && !value) {
    const [status] = await db.select().from(adminContent).where(eq(adminContent.key, "tedx.status")).limit(1);
    if (status?.value === "official") {
      throw new Error("Set TEDx status back to temporary before resetting the official video URL.");
    }
  }
}

export async function setAdminContentValue(input: {
  key: AdminContentKey;
  value: unknown;
  updatedBy: string;
  expectedVersion?: number;
}) {
  const value = validateAdminContentValue(input.key, input.value);
  const db = await getDb();
  const [existing] = await db.select().from(adminContent).where(eq(adminContent.key, input.key)).limit(1);

  if (typeof input.expectedVersion === "number" && (existing?.version ?? 0) !== input.expectedVersion) {
    const error = new Error("This field changed after you opened the page. Refresh before saving again.");
    error.name = "AdminContentConflict";
    throw error;
  }

  await enforceTedxStateConsistency(db, input.key, value);

  const nextVersion = (existing?.version ?? 0) + 1;
  const now = new Date().toISOString();

  const revisionInsert = db.insert(adminContentRevisions).values({
    key: input.key,
    value,
    version: nextVersion,
    updatedBy: input.updatedBy,
    createdAt: now,
  });

  const currentUpsert = db.insert(adminContent).values({
    key: input.key,
    value,
    version: nextVersion,
    updatedBy: input.updatedBy,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: adminContent.key,
    set: {
      value,
      version: nextVersion,
      updatedBy: input.updatedBy,
      updatedAt: now,
    },
  });

  await db.batch([revisionInsert, currentUpsert]);

  return {
    key: input.key,
    value,
    version: nextVersion,
    updatedBy: input.updatedBy,
    updatedAt: now,
  } satisfies AdminContentRecord;
}

export function isAdminContentKey(value: unknown): value is AdminContentKey {
  return typeof value === "string" && FIELD_MAP.has(value as AdminContentKey);
}

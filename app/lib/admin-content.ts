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
  | "podcast.series_label"
  | "podcast.series_heading"
  | "podcast.series_body"
  | "site.notice"
  | "home.hero_eyebrow"
  | "home.hero_headline"
  | "home.hero_deck"
  | "home.media_heading"
  | "home.media_body"
  | "home.newsletter_heading"
  | "home.newsletter_body"
  | "media.hero_heading"
  | "media.hero_intro"
  | "media.owner_update"
  | "media.entries_json"
  | "press.short_bio"
  | "press.long_bio"
  | "press.contact_email";

type FieldKind = "url" | "enum" | "text" | "email" | "json";

type AdminFieldSpec = {
  key: AdminContentKey;
  label: string;
  description: string;
  kind: FieldKind;
  maxLength: number;
  allowedHosts?: string[];
  allowedValues?: string[];
  placeholder?: string;
  surface?: "field" | "media";
};

export type OwnerMediaItemType = "event" | "talk" | "interview" | "podcast" | "press";

export type OwnerMediaItem = {
  id: string;
  type: OwnerMediaItemType;
  title: string;
  description: string;
  platform: string;
  date: string;
  url: string;
  published: boolean;
};

export const ADMIN_CONTENT_FIELDS: AdminFieldSpec[] = [
  {
    key: "site.notice",
    label: "Site-wide notice",
    description: "Optional short announcement shown beneath the main navigation. Leave blank to hide it.",
    kind: "text",
    maxLength: 180,
    placeholder: "Optional announcement",
  },
  {
    key: "home.hero_eyebrow",
    label: "Homepage hero eyebrow",
    description: "Short line above the main homepage headline. Leave blank to keep the reviewed source copy.",
    kind: "text",
    maxLength: 90,
    placeholder: "Physician-led · evidence-based",
  },
  {
    key: "home.hero_headline",
    label: "Homepage hero headline",
    description: "Main public-facing homepage headline. Plain text only.",
    kind: "text",
    maxLength: 180,
    placeholder: "The most dangerous pollutant is the one already inside us.",
  },
  {
    key: "home.hero_deck",
    label: "Homepage hero description",
    description: "Short supporting sentence immediately under the homepage headline.",
    kind: "text",
    maxLength: 240,
    placeholder: "Human evidence, explained clearly, then practical places to start.",
  },
  {
    key: "home.media_heading",
    label: "Homepage media heading",
    description: "Heading for the Events & Media block on the homepage.",
    kind: "text",
    maxLength: 140,
    placeholder: "Follow the public conversation.",
  },
  {
    key: "home.media_body",
    label: "Homepage media description",
    description: "Short description for the Events & Media block on the homepage.",
    kind: "text",
    maxLength: 320,
    placeholder: "Talks, interviews, public appearances, and press resources live in one dedicated media center.",
  },
  {
    key: "home.newsletter_heading",
    label: "Newsletter heading",
    description: "Homepage Field Notes heading.",
    kind: "text",
    maxLength: 120,
    placeholder: "Stay close to the research.",
  },
  {
    key: "home.newsletter_body",
    label: "Newsletter description",
    description: "Homepage Field Notes supporting copy.",
    kind: "text",
    maxLength: 320,
    placeholder: "Receive new research summaries, practical guidance, book news, and updates from the movement.",
  },
  {
    key: "media.hero_heading",
    label: "Events & Media headline",
    description: "Main headline at the top of Events & Media.",
    kind: "text",
    maxLength: 160,
    placeholder: "Make the science clear enough to act on.",
  },
  {
    key: "media.hero_intro",
    label: "Events & Media introduction",
    description: "Opening paragraph on the Events & Media page.",
    kind: "text",
    maxLength: 600,
    placeholder: "Dr. Elie R. Haddad brings a physician's perspective to plastic exposure, human biology, and practical prevention.",
  },
  {
    key: "media.owner_update",
    label: "Featured owner update",
    description: "Optional highlighted update on Events & Media. Leave blank to hide it.",
    kind: "text",
    maxLength: 900,
    placeholder: "Optional public update",
  },
  {
    key: "media.entries_json",
    label: "Appearances and events",
    description: "Structured owner-managed talks, interviews, events, podcasts, and press appearances.",
    kind: "json",
    maxLength: 24_000,
    surface: "media",
  },
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
    key: "podcast.series_label",
    label: "Current podcast series label",
    description: "Small label above the podcast series heading.",
    kind: "text",
    maxLength: 100,
    placeholder: "The Plastic Age",
  },
  {
    key: "podcast.series_heading",
    label: "Podcast series heading",
    description: "Main heading describing the current or upcoming series.",
    kind: "text",
    maxLength: 180,
    placeholder: "The journey begins with plastic. It does not end there.",
  },
  {
    key: "podcast.series_body",
    label: "Podcast series description",
    description: "Editorial description beneath the current series heading.",
    kind: "text",
    maxLength: 900,
    placeholder: "Our first series follows the story of how plastic transformed our world, entered our bodies, and became one of the defining challenges of our time.",
  },
  {
    key: "press.short_bio",
    label: "Short press biography",
    description: "Short biography used on Events & Media and in the press kit. Plain text only.",
    kind: "text",
    maxLength: 900,
  },
  {
    key: "press.long_bio",
    label: "Extended press biography",
    description: "Extended biography used in the press kit. Plain text only.",
    kind: "text",
    maxLength: 2_400,
  },
  {
    key: "press.contact_email",
    label: "Media contact email",
    description: "Email shown in the press kit. Leave blank to use the current support email.",
    kind: "email",
    maxLength: 254,
    placeholder: "name@example.com",
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

function validateEmail(value: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Enter a valid email address.");
  return value.toLowerCase();
}

function validateOwnerMediaItems(raw: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Appearances and events data is invalid.");
  }
  if (!Array.isArray(parsed)) throw new Error("Appearances and events must be a list.");
  if (parsed.length > 20) throw new Error("Keep the owner-managed media list to 20 items or fewer.");

  const ids = new Set<string>();
  const allowedTypes = new Set<OwnerMediaItemType>(["event", "talk", "interview", "podcast", "press"]);
  const items = parsed.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object") throw new Error(`Media item ${index + 1} is invalid.`);
    const item = candidate as Record<string, unknown>;
    const id = typeof item.id === "string" ? item.id.trim().toLowerCase() : "";
    const type = typeof item.type === "string" ? item.type.trim().toLowerCase() as OwnerMediaItemType : "event";
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const description = typeof item.description === "string" ? item.description.trim() : "";
    const platform = typeof item.platform === "string" ? item.platform.trim() : "";
    const date = typeof item.date === "string" ? item.date.trim() : "";
    const url = typeof item.url === "string" ? item.url.trim() : "";
    const published = item.published === true;

    if (!/^[a-z0-9][a-z0-9-]{3,59}$/.test(id)) throw new Error(`Media item ${index + 1} needs a valid internal ID.`);
    if (ids.has(id)) throw new Error(`Duplicate media item ID: ${id}`);
    ids.add(id);
    if (!allowedTypes.has(type)) throw new Error(`Media item ${index + 1} has an unsupported type.`);
    if (!title || title.length > 140) throw new Error(`Media item ${index + 1} needs a title under 140 characters.`);
    if (description.length > 700) throw new Error(`Media item ${index + 1} description is too long.`);
    if (platform.length > 100) throw new Error(`Media item ${index + 1} platform is too long.`);
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Media item ${index + 1} date must use YYYY-MM-DD.`);
    if (url) validateUrl(url, undefined);

    return { id, type, title, description, platform, date, url, published } satisfies OwnerMediaItem;
  });

  return JSON.stringify(items);
}

export function parseOwnerMediaItems(value: string | null | undefined): OwnerMediaItem[] {
  if (!value) return [];
  try {
    return JSON.parse(validateOwnerMediaItems(value)) as OwnerMediaItem[];
  } catch {
    return [];
  }
}

export function validateAdminContentValue(key: AdminContentKey, rawValue: unknown) {
  const field = FIELD_MAP.get(key);
  if (!field) throw new Error("Unknown admin content field.");
  if (typeof rawValue !== "string") throw new Error("Value must be text.");

  const value = rawValue.trim();
  if (value.length > field.maxLength) throw new Error(`${field.label} is too long.`);
  if (!value) return "";

  if (field.kind === "url") return validateUrl(value, field.allowedHosts);
  if (field.kind === "email") return validateEmail(value);
  if (field.kind === "json") return validateOwnerMediaItems(value);
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

export async function listAdminContentRevisions(limit = 80): Promise<AdminContentRevision[]> {
  const db = await getDb();
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 120);
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

export async function getAdminContentValues(keys: AdminContentKey[]) {
  try {
    const db = await getDb();
    const rows = await db.select().from(adminContent);
    const wanted = new Set(keys);
    return Object.fromEntries(rows.filter((row) => wanted.has(row.key as AdminContentKey)).map((row) => [row.key, row.value])) as Partial<Record<AdminContentKey, string>>;
  } catch (error) {
    console.warn("admin_public_overrides_unavailable", error);
    return {} as Partial<Record<AdminContentKey, string>>;
  }
}

export async function getOwnerMediaItems() {
  const value = await getAdminContentValue("media.entries_json");
  return parseOwnerMediaItems(value);
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

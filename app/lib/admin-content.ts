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
  | "press.contact_email"
  | "about.hero_title"
  | "about.hero_lead_primary"
  | "about.hero_lead_secondary"
  | "about.why_title"
  | "about.why_body_primary"
  | "about.why_body_secondary"
  | "about.story_title"
  | "about.story_intro"
  | "about.closing_title"
  | "about.closing_body"
  | "book.premise_title"
  | "book.premise_body"
  | "book.quote"
  | "book.territory_title"
  | "book.territory_intro"
  | "book.science_bridge_title"
  | "book.science_bridge_body"
  | "solutions.hero_title"
  | "solutions.hero_body"
  | "solutions.approach_title"
  | "solutions.approach_body"
  | "solutions.core_title"
  | "solutions.core_intro"
  | "solutions.framework_title"
  | "solutions.framework_intro"
  | "guides.hero_title"
  | "guides.hero_body"
  | "tedx.story_title"
  | "tedx.story_body_primary"
  | "tedx.story_body_secondary"
  | "podcast.hero_lead"
  | "podcast.hero_body"
  | "science.entries_json"
  | "science.body_systems_json";

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
  surface?: "field" | "media" | "science";
};

export type OwnerScienceChapterId = "blood" | "brain" | "heart-arteries" | "pregnancy" | "placenta" | "ovary" | "testicular-tissue";

export type OwnerScienceStudy = {
  id: string;
  chapterId: OwnerScienceChapterId;
  headline: string;
  stat: string;
  statLabel: string;
  finding: string;
  meaning: string;
  studyType: string;
  sample: string;
  method: string;
  limits: string;
  year: string;
  journal: string;
  source: string;
  doi: string;
  published: boolean;
};

export type OwnerBodySystemSlug =
  | "cardiovascular-system"
  | "female-reproductive-health"
  | "endocrine-metabolic-system"
  | "kidneys-urinary-system"
  | "skin"
  | "digestive-system"
  | "pregnancy-early-life";

export type OwnerBodySystemSource = {
  label: string;
  href: string;
  note?: string;
};

export type OwnerBodySystemSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type OwnerBodySystemOverride = {
  slug: OwnerBodySystemSlug;
  title: string;
  subtitle: string;
  kicker: string;
  summary: string;
  heroFact: string;
  heroFactLabel: string;
  sections: OwnerBodySystemSection[];
  keyTakeaways: string[];
  known: string[];
  uncertain: string[];
  primarySources: OwnerBodySystemSource[];
  reviewStatus: "verified" | "partial" | "source-review";
  reviewNote: string;
  updatedDate: string;
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
    key: "science.entries_json",
    label: "Owner-managed science studies",
    description: "Structured owner-managed research records. Drafts stay private until explicitly published.",
    kind: "json",
    maxLength: 60_000,
    surface: "science",
  },
  {
    key: "science.body_systems_json",
    label: "Body-system page updates",
    description: "Structured owner-managed updates to the existing body-system overview pages.",
    kind: "json",
    maxLength: 120_000,
    surface: "science",
  },
  {
    key: "tedx.video_url",
    label: "TEDx video URL",
    description: "Canonical YouTube URL used on the TEDx and Events & Media pages.",
    kind: "url",
    maxLength: 500,
    allowedHosts: ["youtube.com", "www.youtube.com", "youtu.be"],
    placeholder: "https://www.youtube.com/watch?v=...",
  },
  {
    key: "tedx.status",
    label: "TEDx video status",
    description: "Publication status for the TEDx recording. The current canonical release is official.",
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
    key: "about.hero_title",
    label: "About page headline",
    description: "Main headline on Dr. Haddad's About page.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "about.hero_lead_primary",
    label: "About page opening biography",
    description: "First introductory paragraph beside Dr. Haddad's portrait.",
    kind: "text",
    maxLength: 700,
  },
  {
    key: "about.hero_lead_secondary",
    label: "About page project origin",
    description: "Second introductory paragraph explaining why Say No To Plastic exists.",
    kind: "text",
    maxLength: 700,
  },
  {
    key: "about.why_title",
    label: "About page clinic section heading",
    description: "Heading for the section explaining where Dr. Haddad's inquiry began.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "about.why_body_primary",
    label: "About page clinic paragraph",
    description: "First paragraph in the Why he cares section.",
    kind: "text",
    maxLength: 900,
  },
  {
    key: "about.why_body_secondary",
    label: "About page exposure paragraph",
    description: "Second paragraph in the Why he cares section.",
    kind: "text",
    maxLength: 900,
  },
  {
    key: "about.story_title",
    label: "About page path heading",
    description: "Heading above Dr. Haddad's path from cardiology to environmental inquiry.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "about.story_intro",
    label: "About page path introduction",
    description: "Short introduction above the four-part story timeline.",
    kind: "text",
    maxLength: 500,
  },
  {
    key: "about.closing_title",
    label: "About page closing heading",
    description: "Heading in the final section describing the work now.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "about.closing_body",
    label: "About page closing paragraph",
    description: "Final paragraph describing how Say No To Plastic presents evidence and practical guidance.",
    kind: "text",
    maxLength: 900,
  },
  {
    key: "book.premise_title",
    label: "Book page premise heading",
    description: "Main heading in the Why this book section.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "book.premise_body",
    label: "Book page premise paragraph",
    description: "Opening description of the book's investigation.",
    kind: "text",
    maxLength: 1_000,
  },
  {
    key: "book.quote",
    label: "Book page pull quote",
    description: "Prominent quote in the Why this book section.",
    kind: "text",
    maxLength: 500,
  },
  {
    key: "book.territory_title",
    label: "Book page reading-map heading",
    description: "Heading above the six-part reading map.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "book.territory_intro",
    label: "Book page reading-map introduction",
    description: "Short explanation above the reading map.",
    kind: "text",
    maxLength: 600,
  },
  {
    key: "book.science_bridge_title",
    label: "Book page science bridge heading",
    description: "Heading that sends readers from the book to the research section.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "book.science_bridge_body",
    label: "Book page science bridge paragraph",
    description: "Supporting copy that explains what the Science section contains.",
    kind: "text",
    maxLength: 700,
  },
  {
    key: "solutions.hero_title",
    label: "Take Action page headline",
    description: "Main headline at the top of Take Action.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "solutions.hero_body",
    label: "Take Action page introduction",
    description: "Opening paragraph beneath the main headline.",
    kind: "text",
    maxLength: 700,
  },
  {
    key: "solutions.approach_title",
    label: "Dr. Haddad approach heading",
    description: "Short heading in the approach card.",
    kind: "text",
    maxLength: 120,
  },
  {
    key: "solutions.approach_body",
    label: "Dr. Haddad approach paragraph",
    description: "Short explanation in the approach card.",
    kind: "text",
    maxLength: 500,
  },
  {
    key: "solutions.core_title",
    label: "Three core rules heading",
    description: "Heading above the three core rules.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "solutions.core_intro",
    label: "Three core rules introduction",
    description: "Short sentence above the three core rules.",
    kind: "text",
    maxLength: 500,
  },
  {
    key: "solutions.framework_title",
    label: "Exposure framework heading",
    description: "Heading for the section that expands beyond the first three rules.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "solutions.framework_intro",
    label: "Exposure framework introduction",
    description: "Paragraph introducing the broader exposure-reduction framework.",
    kind: "text",
    maxLength: 700,
  },
  {
    key: "guides.hero_title",
    label: "Quick Action Card headline",
    description: "Main headline above the authored 12-step card.",
    kind: "text",
    maxLength: 180,
  },
  {
    key: "guides.hero_body",
    label: "Quick Action Card introduction",
    description: "Introductory paragraph above the authored 12-step card.",
    kind: "text",
    maxLength: 700,
  },
  {
    key: "tedx.story_title",
    label: "TEDx story heading",
    description: "Main heading beneath the TEDx video.",
    kind: "text",
    maxLength: 220,
  },
  {
    key: "tedx.story_body_primary",
    label: "TEDx story first paragraph",
    description: "First paragraph explaining the talk.",
    kind: "text",
    maxLength: 900,
  },
  {
    key: "tedx.story_body_secondary",
    label: "TEDx story second paragraph",
    description: "Second paragraph explaining the larger message of the talk.",
    kind: "text",
    maxLength: 900,
  },
  {
    key: "podcast.hero_lead",
    label: "Podcast opening sentence",
    description: "First paragraph below the Beyond Plastic podcast title.",
    kind: "text",
    maxLength: 500,
  },
  {
    key: "podcast.hero_body",
    label: "Podcast opening description",
    description: "Second paragraph introducing the podcast.",
    kind: "text",
    maxLength: 900,
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

function validateOwnerScienceStudies(raw: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Science study data is invalid.");
  }
  if (!Array.isArray(parsed)) throw new Error("Science studies must be a list.");
  if (parsed.length > 20) throw new Error("Keep owner-managed science studies to 20 items or fewer.");

  const ids = new Set<string>();
  const allowedChapters = new Set<OwnerScienceChapterId>(["blood", "brain", "heart-arteries", "pregnancy", "placenta", "ovary", "testicular-tissue"]);
  const cleanText = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

  const items = parsed.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object") throw new Error(`Science study ${index + 1} is invalid.`);
    const item = candidate as Record<string, unknown>;
    const id = cleanText(item.id, 60).toLowerCase();
    const chapterId = cleanText(item.chapterId, 40) as OwnerScienceChapterId;
    const headline = cleanText(item.headline, 180);
    const stat = cleanText(item.stat, 80);
    const statLabel = cleanText(item.statLabel, 180);
    const finding = cleanText(item.finding, 900);
    const meaning = cleanText(item.meaning, 900);
    const studyType = cleanText(item.studyType, 180);
    const sample = cleanText(item.sample, 700);
    const method = cleanText(item.method, 700);
    const limits = cleanText(item.limits, 1_000);
    const year = cleanText(item.year, 40);
    const journal = cleanText(item.journal, 180);
    const sourceRaw = cleanText(item.source, 500);
    const doi = cleanText(item.doi, 200);
    const published = item.published === true;

    if (!/^[a-z0-9][a-z0-9-]{3,59}$/.test(id)) throw new Error(`Science study ${index + 1} needs a valid internal ID.`);
    if (ids.has(id)) throw new Error(`Duplicate science study ID: ${id}`);
    ids.add(id);
    if (!allowedChapters.has(chapterId)) throw new Error(`Science study ${index + 1} needs a valid body-system chapter.`);

    let source = "";
    if (sourceRaw) source = validateUrl(sourceRaw, undefined);

    if (published) {
      const required = [
        ["headline", headline],
        ["stat", stat],
        ["stat label", statLabel],
        ["finding", finding],
        ["why it matters", meaning],
        ["study type", studyType],
        ["sample", sample],
        ["method", method],
        ["limitations", limits],
        ["year", year],
        ["journal", journal],
        ["source", source],
      ] as const;
      const missing = required.find(([, value]) => !value);
      if (missing) throw new Error(`Science study ${index + 1} cannot be published without ${missing[0]}.`);
    }

    return {
      id,
      chapterId,
      headline,
      stat,
      statLabel,
      finding,
      meaning,
      studyType,
      sample,
      method,
      limits,
      year,
      journal,
      source,
      doi,
      published,
    } satisfies OwnerScienceStudy;
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

export function parseOwnerScienceStudies(value: string | null | undefined): OwnerScienceStudy[] {
  if (!value) return [];
  try {
    return JSON.parse(validateOwnerScienceStudies(value)) as OwnerScienceStudy[];
  } catch {
    return [];
  }
}

function validateOwnerBodySystemOverrides(raw: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Body-system page data is invalid.");
  }
  if (!Array.isArray(parsed)) throw new Error("Body-system page updates must be a list.");
  if (parsed.length > 7) throw new Error("Only the seven reviewed body-system pages can be managed here.");

  const allowedSlugs = new Set<OwnerBodySystemSlug>([
    "cardiovascular-system",
    "female-reproductive-health",
    "endocrine-metabolic-system",
    "kidneys-urinary-system",
    "skin",
    "digestive-system",
    "pregnancy-early-life",
  ]);
  const allowedStatuses = new Set(["verified", "partial", "source-review"]);
  const seen = new Set<string>();
  const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
  const textList = (value: unknown, maxItems: number, maxLength: number) => {
    if (!Array.isArray(value)) return [];
    return value.slice(0, maxItems).map((item) => text(item, maxLength)).filter(Boolean);
  };

  const items = parsed.map((candidate, index) => {
    if (!candidate || typeof candidate !== "object") throw new Error(`Body-system update ${index + 1} is invalid.`);
    const item = candidate as Record<string, unknown>;
    const slug = text(item.slug, 80) as OwnerBodySystemSlug;
    if (!allowedSlugs.has(slug)) throw new Error(`Body-system update ${index + 1} has an unsupported page.`);
    if (seen.has(slug)) throw new Error(`Duplicate body-system update: ${slug}`);
    seen.add(slug);

    const sectionsRaw = Array.isArray(item.sections) ? item.sections.slice(0, 8) : [];
    const sectionIds = new Set<string>();
    const sections = sectionsRaw.map((sectionCandidate, sectionIndex) => {
      if (!sectionCandidate || typeof sectionCandidate !== "object") throw new Error(`Section ${sectionIndex + 1} for ${slug} is invalid.`);
      const section = sectionCandidate as Record<string, unknown>;
      const id = text(section.id, 60).toLowerCase();
      const title = text(section.title, 180);
      const paragraphs = textList(section.paragraphs, 8, 1_400);
      if (!/^[a-z0-9][a-z0-9-]{1,59}$/.test(id)) throw new Error(`Section ${sectionIndex + 1} for ${slug} needs a valid ID.`);
      if (sectionIds.has(id)) throw new Error(`Duplicate section ID for ${slug}: ${id}`);
      sectionIds.add(id);
      if (!title || !paragraphs.length) throw new Error(`Each section for ${slug} needs a title and at least one paragraph.`);
      return { id, title, paragraphs } satisfies OwnerBodySystemSection;
    });

    const sourcesRaw = Array.isArray(item.primarySources) ? item.primarySources.slice(0, 12) : [];
    const primarySources = sourcesRaw.map((sourceCandidate, sourceIndex) => {
      if (!sourceCandidate || typeof sourceCandidate !== "object") throw new Error(`Source ${sourceIndex + 1} for ${slug} is invalid.`);
      const source = sourceCandidate as Record<string, unknown>;
      const label = text(source.label, 220);
      const hrefRaw = text(source.href, 500);
      const note = text(source.note, 700);
      if (!label || !hrefRaw) throw new Error(`Source ${sourceIndex + 1} for ${slug} needs a label and URL.`);
      return { label, href: validateUrl(hrefRaw, undefined), ...(note ? { note } : {}) } satisfies OwnerBodySystemSource;
    });

    const title = text(item.title, 180);
    const subtitle = text(item.subtitle, 260);
    const kicker = text(item.kicker, 140);
    const summary = text(item.summary, 1_200);
    const heroFact = text(item.heroFact, 100);
    const heroFactLabel = text(item.heroFactLabel, 240);
    const keyTakeaways = textList(item.keyTakeaways, 10, 700);
    const known = textList(item.known, 10, 700);
    const uncertain = textList(item.uncertain, 10, 700);
    const reviewStatus = text(item.reviewStatus, 40);
    const reviewNote = text(item.reviewNote, 1_000);
    const updatedDate = /^\d{4}-\d{2}-\d{2}$/.test(text(item.updatedDate, 10)) ? text(item.updatedDate, 10) : new Date().toISOString().slice(0, 10);

    if (!title || !subtitle || !kicker || !summary || !heroFact || !heroFactLabel) {
      throw new Error(`Body-system page ${slug} is missing required page framing.`);
    }
    if (sections.length < 2) throw new Error(`Body-system page ${slug} needs at least two structured sections.`);
    if (!keyTakeaways.length || !known.length || !uncertain.length) {
      throw new Error(`Body-system page ${slug} needs takeaways, known evidence, and uncertainty notes.`);
    }
    if (!allowedStatuses.has(reviewStatus)) throw new Error(`Body-system page ${slug} has an invalid review status.`);
    if (!reviewNote) throw new Error(`Body-system page ${slug} needs a review note.`);
    if (reviewStatus === "verified" && !primarySources.length) {
      throw new Error(`A verified body-system page must include at least one primary source.`);
    }

    return {
      slug,
      title,
      subtitle,
      kicker,
      summary,
      heroFact,
      heroFactLabel,
      sections,
      keyTakeaways,
      known,
      uncertain,
      primarySources,
      reviewStatus: reviewStatus as OwnerBodySystemOverride["reviewStatus"],
      reviewNote,
      updatedDate,
    } satisfies OwnerBodySystemOverride;
  });

  return JSON.stringify(items);
}

export function parseOwnerBodySystemOverrides(value: string | null | undefined): OwnerBodySystemOverride[] {
  if (!value) return [];
  try {
    return JSON.parse(validateOwnerBodySystemOverrides(value)) as OwnerBodySystemOverride[];
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
  if (field.kind === "json") {
    if (key === "science.entries_json") return validateOwnerScienceStudies(value);
    if (key === "science.body_systems_json") return validateOwnerBodySystemOverrides(value);
    return validateOwnerMediaItems(value);
  }
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

export async function getOwnerScienceStudies() {
  const value = await getAdminContentValue("science.entries_json");
  return parseOwnerScienceStudies(value);
}

export async function getOwnerBodySystemOverrides() {
  const value = await getAdminContentValue("science.body_systems_json");
  return parseOwnerBodySystemOverrides(value);
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

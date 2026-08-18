import mediaCatalog from "./media-items.json";

export type WelcomeFilmConfig = {
  status: "pending" | "ready";
  title: string;
  eyebrow: string;
  description: string;
  durationLabel: string;
  youtubeId: string | null;
  hostedVideoSrc: string | null;
  embedUrl: string | null;
  watchUrl: string | null;
  transcriptUrl: string | null;
  posterSrc: string;
  posterAlt: string;
};

export type MediaEntryStatus = "pending_owner_confirmation" | "planned" | "ready";
export type MediaPublicationApproval = "pending" | "owner_confirmed" | "user_authorized";

export type MediaEntry = {
  id: string;
  type: "talk" | "interview" | "podcast" | "news" | "panel" | "event";
  title: string;
  description: string;
  platform: string;
  date: string | null;
  status: MediaEntryStatus;
  sourceUrl: string | null;
  mediaUrl: string | null;
  youtubeId: string | null;
  thumbnail: string;
  thumbnailAlt: string;
  thumbnailRights: string;
  ownerApproved: boolean;
  published: boolean;
  publicationApproval?: MediaPublicationApproval;
  dateStatus?: "verified" | "pending_verification";
  temporary?: boolean;
  replaceWhenOfficialAvailable?: boolean;
  displayStatus?: string;
  playLabel?: string;
  useThumbnailAsPoster?: boolean;
};

export type VideoFeature = {
  youtubeId: string;
  watchUrl: string;
  title: string;
  kicker: string;
  playLabel: string;
  posterSrc?: string;
  posterWidth?: number;
  posterHeight?: number;
  posterAlt?: string;
};

export const MEDIA_ENTRIES = mediaCatalog.entries as MediaEntry[];

export function getMediaEntry(id: string) {
  return MEDIA_ENTRIES.find((entry) => entry.id === id);
}

export function toVideoFeature(entry: MediaEntry): VideoFeature | null {
  const publicationApproved = entry.ownerApproved || entry.publicationApproval === "owner_confirmed" || entry.publicationApproval === "user_authorized";
  if (!entry.published || entry.status !== "ready" || !publicationApproved || !entry.youtubeId || !entry.mediaUrl) return null;
  return {
    youtubeId: entry.youtubeId,
    watchUrl: entry.mediaUrl,
    title: entry.title,
    kicker: entry.displayStatus || `${entry.platform}${entry.date ? ` · ${entry.date}` : ""}`,
    playLabel: entry.playLabel || (entry.type === "interview" ? "Watch the conversation" : "Watch the full talk"),
    posterSrc: entry.useThumbnailAsPoster === false ? undefined : entry.thumbnail,
    posterWidth: entry.useThumbnailAsPoster === false ? undefined : 1536,
    posterHeight: entry.useThumbnailAsPoster === false ? undefined : 1024,
    posterAlt: entry.useThumbnailAsPoster === false ? undefined : entry.thumbnailAlt,
  };
}

/**
 * The user supplied the current welcome film on 2026-08-08.
 * Keep the first-visit modal and replay behavior stable; replace only these media
 * fields if a later owner-approved master supersedes this file.
 */
export const WELCOME_FILM: WelcomeFilmConfig = {
  status: "ready",
  title: "Welcome to Say No to Plastic",
  eyebrow: "A welcome from Dr. Elie R. Haddad",
  description: "Dr. Haddad welcomes visitors to Say No to Plastic and introduces the project before they continue into the evidence and practical guidance.",
  durationLabel: "3 min 28 sec",
  youtubeId: null,
  hostedVideoSrc: "/media/welcome-dr-haddad.mp4",
  embedUrl: null,
  watchUrl: "/media/welcome-dr-haddad.mp4",
  transcriptUrl: null,
  posterSrc: "/media/welcome-dr-haddad-poster.webp",
  posterAlt: "Dr. Elie R. Haddad speaking to camera in medical scrubs",
};

export const MEDIA_KIT = {
  shortBio: "Elie R. Haddad, MD, is a cardiologist and cardiac electrophysiologist with more than two decades of clinical experience. Through Homo Plasticus and Say No to Plastic, he translates emerging research on plastic exposure and human biology into clear public education and practical action.",
  longBio: "Elie R. Haddad, MD, is a cardiologist and cardiac electrophysiologist whose clinical career has centered on the electrical systems of the heart. Homo Plasticus grew from a broader question: what environmental influence are medicine and public health still learning to see? His work brings together emerging research, careful evidence boundaries, and practical exposure-reduction guidance for general audiences, families, clinicians, educators, journalists, and advocates.",
  topics: [
    "What microplastics and nanoplastics research can - and cannot - currently prove",
    "How scientists detect microplastics and prevent laboratory contamination",
    "What artery-plaque and coronary-blood studies found about cardiovascular association",
    "The exposome: how air, water, food, products, lifestyle, and time fit together",
    "What are endocrine-disrupting chemicals?",
    "The intergenerational questions raised by pregnancy and reproductive research",
    "Practical ways to reduce repeated plastic exposure without demanding perfection",
  ],
  facts: [
    ["Movement", "Say No to Plastic"],
    ["Book", "Homo Plasticus"],
    ["Discipline", "Cardiology and cardiac electrophysiology"],
    ["Public work", "Author and public educator · final media inventory pending approval"],
  ] as const,
  assets: [
    { label: "Web portrait", href: "/portrait.webp", note: "Web-resolution image · high-resolution press portrait pending" },
    { label: "Book cover", href: "/book-official.webp", note: "Current web cover · final print-use approval pending" },
    { label: "TEDx stage image", href: "/tedx.webp", note: "Owner approval and rights confirmation required before press reuse" },
  ],
};

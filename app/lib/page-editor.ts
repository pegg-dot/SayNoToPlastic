import type { AdminContentKey } from "./admin-content";

export type OwnerPageId =
  | "homepage"
  | "about"
  | "book"
  | "podcast"
  | "tedx"
  | "media"
  | "solutions"
  | "guides";

export type OwnerPageDefinition = {
  id: OwnerPageId;
  label: string;
  href: string;
  description: string;
  fields: AdminContentKey[];
  note?: string;
};

export const OWNER_PAGE_DEFINITIONS: OwnerPageDefinition[] = [
  {
    id: "homepage",
    label: "Homepage",
    href: "/",
    description: "The main landing page, including the opening message, media handoff, and Field Notes signup.",
    fields: [
      "home.hero_eyebrow",
      "home.hero_headline",
      "home.hero_deck",
      "home.media_heading",
      "home.media_body",
      "home.newsletter_heading",
      "home.newsletter_body",
    ],
  },
  {
    id: "about",
    label: "About Dr. Haddad",
    href: "/about-dr-elie-haddad",
    description: "Dr. Haddad's biography, clinical origin story, and the purpose behind Say No To Plastic.",
    fields: [
      "about.hero_title",
      "about.hero_lead_primary",
      "about.hero_lead_secondary",
      "about.why_title",
      "about.why_body_primary",
      "about.why_body_secondary",
      "about.story_title",
      "about.story_intro",
      "about.closing_title",
      "about.closing_body",
    ],
  },
  {
    id: "book",
    label: "Homo Plasticus",
    href: "/homo-plasticus",
    description: "The public book page, its premise, reading map, and bridge into the research.",
    fields: [
      "book.premise_title",
      "book.premise_body",
      "book.quote",
      "book.territory_title",
      "book.territory_intro",
      "book.science_bridge_title",
      "book.science_bridge_body",
    ],
    note: "Price, checkout behavior, access recovery, and policy copy stay protected because they are tied to commerce and fulfillment.",
  },
  {
    id: "podcast",
    label: "Podcast",
    href: "/podcast",
    description: "The Beyond Plastic introduction, current series, and listening destinations.",
    fields: [
      "podcast.hero_lead",
      "podcast.hero_body",
      "podcast.series_label",
      "podcast.series_heading",
      "podcast.series_body",
      "podcast.spotify_url",
      "podcast.apple_url",
      "podcast.youtube_url",
      "podcast.amazon_url",
    ],
  },
  {
    id: "tedx",
    label: "TEDx",
    href: "/tedx",
    description: "The TEDx talk, video source, and the explanatory story beneath it.",
    fields: [
      "tedx.video_url",
      "tedx.status",
      "tedx.story_title",
      "tedx.story_body_primary",
      "tedx.story_body_secondary",
    ],
  },
  {
    id: "media",
    label: "Events & Media",
    href: "/media",
    description: "The media landing page headline and current public update.",
    fields: [
      "media.hero_heading",
      "media.hero_intro",
      "media.owner_update",
    ],
    note: "Appearances and events are still managed in the dedicated Events & Media tool so they keep their date, type, link, and publish controls.",
  },
  {
    id: "solutions",
    label: "Take Action",
    href: "/solutions",
    description: "The practical-action framing around the reviewed exposure-reduction guidance.",
    fields: [
      "solutions.hero_title",
      "solutions.hero_body",
      "solutions.approach_title",
      "solutions.approach_body",
      "solutions.core_title",
      "solutions.core_intro",
      "solutions.framework_title",
      "solutions.framework_intro",
    ],
    note: "The reviewed action rules and source-backed guidance remain structured content. This editor changes the framing around them.",
  },
  {
    id: "guides",
    label: "12-Step Guide",
    href: "/quick-action-card",
    description: "The introduction to Dr. Haddad's authored Quick Action Card.",
    fields: [
      "guides.hero_title",
      "guides.hero_body",
    ],
    note: "The 12 authored steps and three core rules stay locked to the reviewed source text instead of becoming free-form website copy.",
  },
];

export function getOwnerPageDefinition(id: OwnerPageId) {
  return OWNER_PAGE_DEFINITIONS.find((page) => page.id === id) || OWNER_PAGE_DEFINITIONS[0];
}

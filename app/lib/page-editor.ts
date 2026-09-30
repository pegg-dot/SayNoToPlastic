import type { AdminContentKey } from "./admin-content";

export type OwnerPageId =
  | "homepage"
  | "about"
  | "book"
  | "podcast"
  | "tedx"
  | "media"
  | "solutions"
  | "guides"
  | "science";

export type OwnerPreviewTarget = {
  key: AdminContentKey;
  selector: string;
  textPreview?: boolean;
};

export type OwnerPageDefinition = {
  id: OwnerPageId;
  label: string;
  href: string;
  description: string;
  fields: AdminContentKey[];
  previewTargets?: OwnerPreviewTarget[];
  kind?: "standard" | "science";
  note?: string;
};

export const OWNER_PAGE_DEFINITIONS: OwnerPageDefinition[] = [
  {
    id: "homepage",
    label: "Homepage",
    href: "/",
    description: "The main landing page, including the opening message, media handoff, and Field Notes signup.",
    fields: [
      "site.notice",
      "home.hero_eyebrow",
      "home.hero_headline",
      "home.hero_deck",
      "home.media_heading",
      "home.media_body",
      "home.newsletter_heading",
      "home.newsletter_body",
    ],
    previewTargets: [
      { key: "site.notice", selector: ".site-owner-notice span", textPreview: true },
      { key: "home.hero_eyebrow", selector: ".hp-hero-copy > .eyebrow" },
      { key: "home.hero_headline", selector: ".hp-hero-copy h1 em", textPreview: true },
      { key: "home.hero_deck", selector: ".hp-hero-deck", textPreview: true },
      { key: "home.newsletter_heading", selector: "#join h2", textPreview: true },
      { key: "home.newsletter_body", selector: "#join h2 + p", textPreview: true },
      { key: "home.media_heading", selector: "#home-media-title", textPreview: true },
      { key: "home.media_body", selector: ".hp-media-bridge > div:first-child > p:last-child", textPreview: true },
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
    previewTargets: [
      { key: "about.hero_title", selector: "#about-title", textPreview: true },
      { key: "about.hero_lead_primary", selector: "#about-title + p", textPreview: true },
      { key: "about.hero_lead_secondary", selector: "#about-title + p + p", textPreview: true },
      { key: "about.why_title", selector: "#why-title", textPreview: true },
      { key: "about.why_body_primary", selector: "#why-title + p", textPreview: true },
      { key: "about.why_body_secondary", selector: "#why-title + p + p", textPreview: true },
      { key: "about.story_title", selector: "#story-title", textPreview: true },
      { key: "about.story_intro", selector: "section[aria-labelledby='story-title'] > div:first-child > p:last-child", textPreview: true },
      { key: "about.closing_title", selector: "#work-title", textPreview: true },
      { key: "about.closing_body", selector: "#work-title + p", textPreview: true },
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
    previewTargets: [
      { key: "book.premise_title", selector: ".book-premise h2", textPreview: true },
      { key: "book.premise_body", selector: ".book-premise h2 + p", textPreview: true },
      { key: "book.quote", selector: ".book-premise blockquote", textPreview: true },
      { key: "book.territory_title", selector: ".book-territory-intro h2", textPreview: true },
      { key: "book.territory_intro", selector: ".book-territory-intro h2 + p", textPreview: true },
      { key: "book.science_bridge_title", selector: ".book-science-bridge h2", textPreview: true },
      { key: "book.science_bridge_body", selector: ".book-science-bridge h2 + p", textPreview: true },
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
    previewTargets: [
      { key: "podcast.hero_lead", selector: "main > section:first-of-type h1 + p", textPreview: true },
      { key: "podcast.hero_body", selector: "main > section:first-of-type h1 + p + p", textPreview: true },
      { key: "podcast.series_label", selector: "main > section:nth-of-type(2) > div:nth-child(2) > p:first-child", textPreview: true },
      { key: "podcast.series_heading", selector: "main > section:nth-of-type(2) > div:nth-child(2) > h2", textPreview: true },
      { key: "podcast.series_body", selector: "main > section:nth-of-type(2) > div:nth-child(2) > h2 + p", textPreview: true },
      { key: "podcast.spotify_url", selector: "main > section:nth-of-type(3)" },
      { key: "podcast.apple_url", selector: "main > section:nth-of-type(3)" },
      { key: "podcast.youtube_url", selector: "main > section:nth-of-type(3)" },
      { key: "podcast.amazon_url", selector: "main > section:nth-of-type(3)" },
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
    previewTargets: [
      { key: "tedx.video_url", selector: ".media-feature" },
      { key: "tedx.status", selector: ".media-feature" },
      { key: "tedx.story_title", selector: ".media-inquiries > div h2", textPreview: true },
      { key: "tedx.story_body_primary", selector: ".media-inquiries > div h2 + p", textPreview: true },
      { key: "tedx.story_body_secondary", selector: ".media-inquiries > div h2 + p + p", textPreview: true },
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
    previewTargets: [
      { key: "media.hero_heading", selector: ".media-hero h1", textPreview: true },
      { key: "media.hero_intro", selector: ".media-hero h1 + p", textPreview: true },
      { key: "media.owner_update", selector: ".media-hero" },
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
    previewTargets: [
      { key: "solutions.hero_title", selector: ".solutions-hero > div > h1", textPreview: true },
      { key: "solutions.hero_body", selector: ".solutions-hero > div > h1 + p", textPreview: true },
      { key: "solutions.approach_title", selector: ".solutions-hero aside strong", textPreview: true },
      { key: "solutions.approach_body", selector: ".solutions-hero aside strong + p", textPreview: true },
      { key: "solutions.core_title", selector: "#first-three h2", textPreview: true },
      { key: "solutions.core_intro", selector: "#first-three h2 + p", textPreview: true },
      { key: "solutions.framework_title", selector: "#solutions-exposure-title", textPreview: true },
      { key: "solutions.framework_intro", selector: "#solutions-exposure-title + p", textPreview: true },
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
    previewTargets: [
      { key: "guides.hero_title", selector: ".quick-card-intro h1", textPreview: true },
      { key: "guides.hero_body", selector: ".quick-card-intro h1 + p", textPreview: true },
    ],
    note: "The 12 authored steps and three core rules stay locked to the reviewed source text instead of becoming free-form website copy.",
  },
  {
    id: "science",
    label: "Science",
    href: "/science",
    description: "Research studies and body-system explainers. This page uses structured evidence fields so sources, methods, and uncertainty stay attached.",
    fields: [],
    kind: "science",
  },
];

export function getOwnerPageDefinition(id: OwnerPageId) {
  return OWNER_PAGE_DEFINITIONS.find((page) => page.id === id) || OWNER_PAGE_DEFINITIONS[0];
}

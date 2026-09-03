export type PodcastPlatform = {
  name: "Spotify" | "Apple Podcasts" | "YouTube";
  href: string;
  direct: boolean;
  note?: string;
};

export const BEYOND_PLASTIC = {
  title: "Beyond Plastic",
  subtitle: "Where Science Meets Consciousness",
  artwork: "/podcast/beyond-plastic-artwork.webp",
  artworkAlt: "Beyond Plastic artwork showing a human profile formed from translucent water and suspended particles",
  youtubeChannel: "https://www.youtube.com/@TheWhiteCoatHeartHealer",
  platforms: [
    { name: "Spotify", href: "https://open.spotify.com/search/Beyond%20Plastic%3A%20where%20science%20meets%20consciousness/podcasts", direct: false, note: "Platform search fallback until the direct show URL is confirmed." },
    { name: "Apple Podcasts", href: "https://podcasts.apple.com/us/search?term=Beyond%20Plastic%3A%20where%20science%20meets%20consciousness", direct: false, note: "Platform search fallback until the direct show URL is confirmed." },
    { name: "YouTube", href: "https://www.youtube.com/@TheWhiteCoatHeartHealer", direct: true },
  ] satisfies PodcastPlatform[],
} as const;

// Compatibility registry for homepage/sitemap consumers. This remains the current
// owner-approved temporary recording until TEDx publishes the official release.
export const TEDX_RELEASE = {
  published: true,
  title: "The Invisible Inheritance of Nanoplastics",
  speakerLine: "Dr. Elie Haddad | TEDxMiami",
  officialVideoUrl: "https://www.youtube.com/shorts/6juPFhIh68I",
  officialYoutubeId: "6juPFhIh68I",
} as const;

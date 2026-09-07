import { getMediaEntry, toVideoFeature, type MediaEntry } from "../content/media-content";
import { BEYOND_PLASTIC, type PodcastPlatform } from "../content/publications";
import { getAdminContentValue } from "./admin-content";

function youtubeIdFromUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] ?? null;
    if (host !== "youtube.com") return null;
    if (url.pathname === "/watch") return url.searchParams.get("v");
    const parts = url.pathname.split("/").filter(Boolean);
    if (["shorts", "embed", "live"].includes(parts[0] ?? "")) return parts[1] ?? null;
    return null;
  } catch {
    return null;
  }
}

export async function getEffectiveTedxEntry(): Promise<MediaEntry | null> {
  const source = getMediaEntry("tedx-invisible-inheritance");
  if (!source) return null;

  const [videoUrlOverride, statusOverride] = await Promise.all([
    getAdminContentValue("tedx.video_url"),
    getAdminContentValue("tedx.status"),
  ]);

  const videoUrl = videoUrlOverride || source.mediaUrl || source.sourceUrl;
  const youtubeId = youtubeIdFromUrl(videoUrl) || source.youtubeId;
  const official = statusOverride === "official";
  const temporary = statusOverride === "temporary" ? true : statusOverride === "official" ? false : Boolean(source.temporary);

  return {
    ...source,
    mediaUrl: videoUrl,
    sourceUrl: videoUrl,
    youtubeId,
    temporary,
    displayStatus: official ? "Official TEDxMiami release" : source.displayStatus,
  };
}

export async function getEffectiveTedxVideo() {
  const entry = await getEffectiveTedxEntry();
  return entry ? toVideoFeature(entry) : null;
}

export async function getEffectivePodcastPlatforms(): Promise<PodcastPlatform[]> {
  const [spotify, apple, youtube, amazon] = await Promise.all([
    getAdminContentValue("podcast.spotify_url"),
    getAdminContentValue("podcast.apple_url"),
    getAdminContentValue("podcast.youtube_url"),
    getAdminContentValue("podcast.amazon_url"),
  ]);

  const sourceByName = new Map(BEYOND_PLASTIC.platforms.map((platform) => [platform.name, platform]));
  const platforms: PodcastPlatform[] = [
    spotify ? { name: "Spotify", href: spotify, direct: true } : sourceByName.get("Spotify")!,
    apple ? { name: "Apple Podcasts", href: apple, direct: true } : sourceByName.get("Apple Podcasts")!,
    youtube ? { name: "YouTube", href: youtube, direct: true } : sourceByName.get("YouTube")!,
  ];

  if (amazon) platforms.push({ name: "Amazon Music", href: amazon, direct: true });
  return platforms;
}

export async function getPublicOwnerNotice(key: "site.notice" | "media.owner_update") {
  return getAdminContentValue(key);
}

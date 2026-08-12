"use client";

import { useRef, useState } from "react";
import type { VideoFeature } from "../content/media-content";
import { trackEvent } from "./ConsentAnalytics";
import { TrackedLink } from "./TrackedLink";

export function FeatureVideo({ video, analyticsLabel, className = "" }: { video: VideoFeature; analyticsLabel: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const trackedStart = useRef(false);

  function start() {
    if (!trackedStart.current) {
      trackedStart.current = true;
      void trackEvent("video_start", { label: analyticsLabel, destination: video.watchUrl });
    }
    setPlaying(true);
  }

  return (
    <div className={`video-feature ${className}`.trim()}>
      <div className="video-feature-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button className="video-feature-poster" type="button" onClick={start} aria-label={video.playLabel}>
            {video.posterSrc ? <img src={video.posterSrc} width={video.posterWidth} height={video.posterHeight} alt={video.posterAlt} /> : <span className="video-feature-fallback" aria-hidden="true"><i>SNTP</i></span>}
            <span className="video-feature-play"><i>▶</i><b>{video.playLabel}</b><small>{video.kicker}</small></span>
          </button>
        )}
      </div>
      <TrackedLink href={video.watchUrl} target="_blank" rel="noopener noreferrer" eventName="outbound_video" label={`${analyticsLabel}-youtube`}>
        Open on YouTube <span>↗</span>
      </TrackedLink>
    </div>
  );
}

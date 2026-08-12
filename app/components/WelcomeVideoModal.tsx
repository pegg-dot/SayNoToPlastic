"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WELCOME_FILM } from "../content/media-content";
import { trackEvent } from "./ConsentAnalytics";
import { useBodyScrollLock } from "./useBodyScrollLock";

const STORAGE_KEY = "hp_welcome_film_seen_v1";

function markWelcomeSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {
    // Storage is optional; the replay control and modal remain functional.
  }
}

function prepareWelcomeOverlay() {
  window.dispatchEvent(new Event("hp:welcome-opening"));
}

export function WelcomeVideoModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const autoOpened = useRef(false);
  const autoOpenTimer = useRef<number | null>(null);

  useBodyScrollLock(open);

  const close = useCallback(() => {
    setOpen(false);
    setPlaying(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (pathname !== "/" || autoOpened.current) return;
    autoOpened.current = true;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // The modal still works when storage is unavailable; it simply may reappear later.
    }
    autoOpenTimer.current = window.setTimeout(() => {
      markWelcomeSeen();
      prepareWelcomeOverlay();
      setOpen(true);
      void trackEvent("welcome_film_open", { label: "welcome-film-first-visit" });
      autoOpenTimer.current = null;
    }, 550);
    return () => {
      if (autoOpenTimer.current !== null) window.clearTimeout(autoOpenTimer.current);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const siteShell = document.getElementById("site-shell");
    const priorAriaHidden = siteShell?.getAttribute("aria-hidden") ?? null;
    const priorInert = siteShell?.inert ?? false;
    if (siteShell) {
      siteShell.inert = true;
      siteShell.setAttribute("aria-hidden", "true");
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], iframe, video[controls], [tabindex]:not([tabindex="-1"])',
      ));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      if (siteShell) {
        siteShell.inert = priorInert;
        if (priorAriaHidden === null) siteShell.removeAttribute("aria-hidden");
        else siteShell.setAttribute("aria-hidden", priorAriaHidden);
      }
    };
  }, [open, close]);

  function show() {
    if (autoOpenTimer.current !== null) {
      window.clearTimeout(autoOpenTimer.current);
      autoOpenTimer.current = null;
    }
    markWelcomeSeen();
    prepareWelcomeOverlay();
    setPlaying(false);
    setOpen(true);
    void trackEvent("welcome_film_open", { label: "welcome-film-replay" });
  }

  function startFilm() {
    setPlaying(true);
    void trackEvent("video_start", { label: "welcome-film", destination: WELCOME_FILM.watchUrl || "pending" });
  }

  const canPlay = WELCOME_FILM.status === "ready"
    && Boolean(WELCOME_FILM.youtubeId || WELCOME_FILM.hostedVideoSrc || WELCOME_FILM.embedUrl);

  return (
    <>
      {pathname === "/" && !open && (
        <button ref={triggerRef} className="welcome-film-trigger" type="button" onClick={show} aria-haspopup="dialog">
          <span aria-hidden="true">▶</span>
          <b>Welcome</b>
          <small>From Dr. Haddad</small>
        </button>
      )}
      {open && (
        <div
          className="welcome-film-backdrop"
          role="presentation"
          data-welcome-backdrop
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            ref={dialogRef}
            className="welcome-film-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-film-title"
            aria-describedby="welcome-film-description"
            data-welcome-dialog
          >
            <button ref={closeRef} className="welcome-film-close" type="button" onClick={close} aria-label="Close welcome film">×</button>
            <div className="welcome-film-visual">
              {WELCOME_FILM.status === "ready" && playing && WELCOME_FILM.hostedVideoSrc ? (
                <video controls autoPlay playsInline poster={WELCOME_FILM.posterSrc}>
                  <source src={WELCOME_FILM.hostedVideoSrc} type="video/mp4" />
                  Your browser does not support embedded video.
                </video>
              ) : WELCOME_FILM.status === "ready" && playing && WELCOME_FILM.embedUrl ? (
                <iframe
                  src={WELCOME_FILM.embedUrl}
                  title={WELCOME_FILM.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : WELCOME_FILM.status === "ready" && WELCOME_FILM.youtubeId && playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${WELCOME_FILM.youtubeId}?autoplay=1&rel=0`}
                  title={WELCOME_FILM.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button className="welcome-film-poster" type="button" onClick={canPlay ? startFilm : undefined} disabled={!canPlay}>
                  <img src={WELCOME_FILM.posterSrc} width="900" height="1024" alt={WELCOME_FILM.posterAlt} />
                  <span className="welcome-film-poster-shade" />
                  <span className="welcome-film-play" aria-hidden="true">{WELCOME_FILM.status === "ready" ? "▶" : "01"}</span>
                  <span className="welcome-film-status">{WELCOME_FILM.durationLabel}</span>
                </button>
              )}
            </div>
            <div className="welcome-film-copy">
              <p className="eyebrow">{WELCOME_FILM.eyebrow}</p>
              <h2 id="welcome-film-title">{WELCOME_FILM.title}</h2>
              <p id="welcome-film-description">{WELCOME_FILM.description}</p>
              {WELCOME_FILM.status === "pending" ? (
                <div className="welcome-film-pending-note"><span>Ready for the final film</span><p>The popup, first-visit memory, replay control, responsive layout, and privacy-conscious player are already connected. Only the approved video ID and poster need to be replaced.</p></div>
              ) : !playing ? (
                <button className="button gold" type="button" onClick={startFilm}>Play welcome film <span>▶</span></button>
              ) : null}
              {WELCOME_FILM.transcriptUrl && <a className="welcome-film-transcript" href={WELCOME_FILM.transcriptUrl}>Read transcript <span>↗</span></a>}
              <button className="welcome-film-continue" type="button" onClick={close}>Continue to the site <span>→</span></button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

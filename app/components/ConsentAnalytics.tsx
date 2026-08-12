"use client";

import { useEffect, useRef, useState } from "react";
import { AnalyticsConsent, CONSENT_EVENT, readAnalyticsConsent, writeAnalyticsConsent } from "./privacy-consent";

const SESSION_KEY = "hp_session_v1";

function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "session-unavailable";
  }
}

export async function trackEvent(eventName: string, detail: { label?: string; destination?: string } = {}) {
  if (typeof window === "undefined" || readAnalyticsConsent() !== "accepted") return;
  try {
    await fetch("/api/events", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, path: window.location.pathname, referrer: document.referrer, sessionId: sessionId(), ...detail }),
    });
  } catch {
    // Measurement must never block the reading or purchase experience.
  }
}

export function ConsentAnalytics() {
  const [choice, setChoice] = useState<AnalyticsConsent | null>(null);
  const initialTracked = useRef(false);

  useEffect(() => {
    const update = (event?: Event) => {
      const detail = event instanceof CustomEvent ? event.detail as AnalyticsConsent | undefined : undefined;
      const next = detail === "accepted" || detail === "essential" ? detail : readAnalyticsConsent();
      setChoice(next);
      if (next === "accepted" && !initialTracked.current) {
        initialTracked.current = true;
        void trackEvent("page_view");
        if (window.location.pathname === "/homo-plasticus") void trackEvent("view_book", { label: "book-page" });
      }
    };
    update();
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);

  function choose(next: AnalyticsConsent) {
    writeAnalyticsConsent(next);
    setChoice(next);
  }

  if (choice) return null;
  return <aside className="consent-banner" aria-label="Privacy choices"><div><strong>Your reading, your choice.</strong><p>We use optional first-party analytics to understand which guides help readers. We do not sell personal information or use advertising trackers.</p></div><div className="consent-actions"><button type="button" onClick={() => choose("essential")}>Essential only</button><button type="button" className="consent-accept" onClick={() => choose("accepted")}>Allow anonymous analytics</button></div><a href="/privacy-policy#privacy-choices">Privacy details</a></aside>;
}

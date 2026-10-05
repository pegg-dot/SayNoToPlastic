"use client";

import { useSyncExternalStore } from "react";
import { AnalyticsConsent, CONSENT_EVENT, readAnalyticsConsent, writeAnalyticsConsent } from "./privacy-consent";

function subscribeAnalyticsConsent(update: () => void) {
  window.addEventListener(CONSENT_EVENT, update);
  return () => window.removeEventListener(CONSENT_EVENT, update);
}

export function PrivacyPreferences() {
  const choice = useSyncExternalStore(subscribeAnalyticsConsent, readAnalyticsConsent, () => null);

  function choose(next: AnalyticsConsent) {
    writeAnalyticsConsent(next);
  }

  return <section className="privacy-choice-panel" aria-labelledby="privacy-choice-title">
    <div><p className="eyebrow dark">Privacy choices</p><h2 id="privacy-choice-title">Choose what this browser shares.</h2><p>Essential storage keeps the site usable. Optional first-party analytics records page paths and selected actions only after permission.</p></div>
    <div><p className="privacy-choice-status"><span>Current setting</span><strong>{choice === "accepted" ? "Anonymous analytics allowed" : choice === "essential" ? "Essential only" : "No saved choice"}</strong></p><div className="privacy-choice-actions"><button type="button" className={choice === "essential" ? "is-active" : ""} onClick={() => choose("essential")}>Essential only</button><button type="button" className={choice === "accepted" ? "is-active" : ""} onClick={() => choose("accepted")}>Allow anonymous analytics</button></div><small>This setting applies to this browser. It does not change email subscriptions.</small></div>
  </section>;
}

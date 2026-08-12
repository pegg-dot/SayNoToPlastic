export type AnalyticsConsent = "accepted" | "essential";
export const CONSENT_KEY = "hp_analytics_consent_v1";
export const CONSENT_EVENT = "hp:analytics-consent";

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(choice: AnalyticsConsent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // The in-memory event still updates the interface when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent<AnalyticsConsent>(CONSENT_EVENT, { detail: choice }));
}

export function clearAnalyticsConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // The in-memory event still reopens the interface when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}

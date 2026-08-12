"use client";

import { useId, useRef, useState } from "react";
import { trackEvent } from "./ConsentAnalytics";

type SignupProgram = "field-notes" | "learning-series";

export function SignupForm({
  compact = false,
  program = "field-notes",
  buttonLabel,
  successTitle,
  successText,
}: {
  compact?: boolean;
  program?: SignupProgram;
  buttonLabel?: string;
  successTitle?: string;
  successText?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const fieldId = useId();
  const statusId = `${fieldId}-status`;
  const started = useRef(false);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    void trackEvent("form_start", { label: `signup:${window.location.pathname}` });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          email: form.get("email"),
          website: form.get("website"),
          consent: form.get("consent") === "on",
          source: window.location.pathname,
          program,
        }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      void trackEvent("generate_lead", { label: window.location.pathname });
      setState("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
      void trackEvent("form_error", { label: `signup:${window.location.pathname}` });
      setState("error");
    }
  }

  if (state === "success") {
    return <div className="success" role="status"><span>✓</span><h3>{successTitle || "You're in."}</h3><p>{successText || (program === "learning-series" ? "Your subscription is saved and the ten-part learning series is scheduled. Lesson one begins when the approved email service and scheduler are active." : "Your subscription is saved. Welcome to the Say No to Plastic field notes.")}</p></div>;
  }

  return (
    <form
      className={compact ? "signup-form compact" : "signup-form"}
      onFocus={markStarted}
      onSubmit={submit}
      aria-busy={state === "loading"}
      aria-describedby={statusId}
    >
      <label htmlFor={`${fieldId}-first-name`}>First name<input id={`${fieldId}-first-name`} name="firstName" autoComplete="given-name" required /></label>
      <label htmlFor={`${fieldId}-email`}>Email address<input id={`${fieldId}-email`} name="email" type="email" autoComplete="email" required /></label>
      <label className="hp-field" aria-hidden="true" htmlFor={`${fieldId}-website`}>Website<input id={`${fieldId}-website`} name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="consent-check" htmlFor={`${fieldId}-consent`}><input id={`${fieldId}-consent`} name="consent" type="checkbox" required /> {program === "learning-series" ? "I agree to receive the ten-part learning series plus Say No to Plastic research and practical-action emails. I can unsubscribe at any time." : "I agree to receive Say No to Plastic research, book, and practical-action emails. I can unsubscribe at any time."}</label>
      <button className="button gold" type="submit" disabled={state === "loading"}>{state === "loading" ? "Joining..." : (buttonLabel || (program === "learning-series" ? "Start the ten-part series" : "Get the field notes"))} <span>→</span></button>
      <p id={statusId} className={state === "error" ? "form-error" : "sr-only"} role={state === "error" ? "alert" : "status"} aria-live="polite">
        {state === "loading" ? "Submitting your subscription." : error}
      </p>
    </form>
  );
}

"use client";

import { useId, useRef, useState } from "react";
import { trackEvent } from "./ConsentAnalytics";
import type { SiteLocale } from "../lib/i18n";

type SignupProgram = "field-notes" | "learning-series";

export function SignupForm({
  compact = false,
  program = "field-notes",
  buttonLabel,
  successTitle,
  successText,
  locale = "en",
}: {
  compact?: boolean;
  program?: SignupProgram;
  buttonLabel?: string;
  successTitle?: string;
  successText?: string;
  locale?: SiteLocale;
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
      if (!response.ok) throw new Error(data.error || (locale === "es" ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Please try again."));
      void trackEvent("generate_lead", { label: window.location.pathname });
      setState("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (locale === "es" ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Please try again."));
      void trackEvent("form_error", { label: `signup:${window.location.pathname}` });
      setState("error");
    }
  }

  if (state === "success") {
    return <div className="success" role="status"><span>✓</span><h3>{successTitle || "You're in."}</h3><p>{successText || (program === "learning-series" ? "Your subscription is saved and the ten-part learning series is scheduled. Lesson one begins when the approved email service and scheduler are active." : "You're subscribed to Field Notes. No confirmation email is required.")}</p></div>;
  }

  return (
    <form
      className={compact ? "signup-form compact" : "signup-form"}
      onFocus={markStarted}
      onSubmit={submit}
      aria-busy={state === "loading"}
      aria-describedby={statusId}
    >
      <label htmlFor={`${fieldId}-first-name`}>{locale === "es" ? "Nombre" : "First name"}<input id={`${fieldId}-first-name`} name="firstName" autoComplete="given-name" required /></label>
      <label htmlFor={`${fieldId}-email`}>{locale === "es" ? "Correo electrónico" : "Email address"}<input id={`${fieldId}-email`} name="email" type="email" autoComplete="email" required /></label>
      <label className="hp-field" aria-hidden="true" htmlFor={`${fieldId}-website`}>Website<input id={`${fieldId}-website`} name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="consent-check" htmlFor={`${fieldId}-consent`}><input id={`${fieldId}-consent`} name="consent" type="checkbox" required /> {program === "learning-series" ? (locale === "es" ? "Acepto recibir la serie de diez partes, además de correos de investigación y acción práctica de Say No to Plastic. Puedo cancelar mi suscripción en cualquier momento." : "I agree to receive the ten-part learning series plus Say No to Plastic research and practical-action emails. I can unsubscribe at any time.") : (locale === "es" ? "Acepto recibir correos de Say No to Plastic sobre investigación, el libro y acciones prácticas. Puedo cancelar mi suscripción en cualquier momento." : "I agree to receive Say No to Plastic research, book, and practical-action emails. I can unsubscribe at any time.")}</label>
      <button className="button gold" type="submit" disabled={state === "loading"}>{state === "loading" ? (locale === "es" ? "Registrando..." : "Joining...") : (buttonLabel || (program === "learning-series" ? (locale === "es" ? "Comenzar la serie de diez partes" : "Start the ten-part series") : (locale === "es" ? "Recibir Field Notes" : "Get the field notes")))} <span>→</span></button>
      <p id={statusId} className={state === "error" ? "form-error" : "sr-only"} role={state === "error" ? "alert" : "status"} aria-live="polite">
        {state === "loading" ? (locale === "es" ? "Enviando tu suscripción." : "Submitting your subscription.") : error}
      </p>
    </form>
  );
}

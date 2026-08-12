"use client";

import { useId, useRef, useState } from "react";
import { SUPPORT_EMAIL } from "../config";
import { trackEvent } from "./ConsentAnalytics";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const fieldId = useId();
  const statusId = `${fieldId}-status`;
  const started = useRef(false);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    void trackEvent("form_start", { label: "contact" });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Your inquiry could not be sent.");
      void trackEvent("contact_submit", { label: String(form.get("topic") || "General inquiry") });
      setState("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your inquiry could not be sent.");
      void trackEvent("form_error", { label: "contact" });
      setState("error");
    }
  }

  if (state === "success") {
    return <div className="contact-success" role="status"><span>Received</span><h2>Thank you for reaching out.</h2><p>Your inquiry has been recorded for the Say No to Plastic team. For urgent book-access support, you can also email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></div>;
  }

  return <form className="contact-form" onFocus={markStarted} onSubmit={submit} aria-busy={state === "loading"} aria-describedby={statusId}>
    <label htmlFor={`${fieldId}-name`}>Your name<input id={`${fieldId}-name`} name="name" autoComplete="name" required /></label>
    <label htmlFor={`${fieldId}-email`}>Email address<input id={`${fieldId}-email`} name="email" type="email" autoComplete="email" required /></label>
    <label htmlFor={`${fieldId}-topic`}>Inquiry type<select id={`${fieldId}-topic`} name="topic" defaultValue="Media and speaking"><option>Media and speaking</option><option>Research and science</option><option>Book and orders</option><option>Partnership</option><option>General inquiry</option></select></label>
    <label className="full" htmlFor={`${fieldId}-message`}>Message<textarea id={`${fieldId}-message`} name="message" rows={7} minLength={10} required /></label>
    <label className="hp-field" aria-hidden="true" htmlFor={`${fieldId}-website`}>Website<input id={`${fieldId}-website`} name="website" tabIndex={-1} autoComplete="off" /></label>
    <button className="button gold" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending..." : "Send inquiry"}<span>→</span></button>
    <p id={statusId} className={state === "error" ? "form-error full" : "sr-only"} role={state === "error" ? "alert" : "status"} aria-live="polite">
      {state === "loading" ? "Sending your inquiry." : error}
    </p>
  </form>;
}

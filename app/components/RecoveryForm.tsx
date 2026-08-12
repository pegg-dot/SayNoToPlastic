"use client";

import { useId, useState } from "react";

export function RecoveryForm() {
  const id = useId();
  const statusId = `${id}-status`;
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/purchase/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "The request could not be submitted.");
      setState("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The request could not be submitted.");
      setState("error");
    }
  }

  if (state === "success") {
    return <div className="purchase-status-card" role="status"><span>Request received</span><h2>Check your email.</h2><p>If a paid order matches those details, a fresh access link is on the way. For privacy, this page does not confirm whether an account or order exists.</p></div>;
  }

  return (
    <form className="purchase-recovery-form" onSubmit={submit} aria-busy={state === "loading"} aria-describedby={statusId}>
      <label htmlFor={`${id}-email`}>Purchase email<input id={`${id}-email`} name="email" type="email" autoComplete="email" required disabled={state === "loading"} /></label>
      <label htmlFor={`${id}-order`}>Order number <small>Optional</small><input id={`${id}-order`} name="orderId" autoComplete="off" disabled={state === "loading"} /></label>
      <label className="hp-field" aria-hidden="true" htmlFor={`${id}-website`}>Website<input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" disabled={state === "loading"} /></label>
      <button className="button gold" type="submit" disabled={state === "loading"}>{state === "loading" ? "Requesting..." : "Send a fresh access link"}<span>→</span></button>
      <p id={statusId} className={state === "error" ? "form-error" : "sr-only"} role={state === "error" ? "alert" : "status"} aria-live="polite">
        {state === "loading" ? "Requesting a fresh access link." : error}
      </p>
    </form>
  );
}

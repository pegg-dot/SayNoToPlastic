"use client";

import { useId, useState } from "react";

export function UnsubscribeForm({ token }: { token: string }) {
  const statusId = useId();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function unsubscribe() {
    if (state === "loading" || state === "success") return;
    setState("loading");
    try {
      const response = await fetch("/api/subscription/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error("unsubscribe_failed");
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return <div className="preference-status success" role="status"><span>Preference saved</span><h2>You are unsubscribed.</h2><p>Marketing field notes will stop. Transactional messages may still be sent when needed to deliver or support a purchase.</p><a className="button outline" href="/">Return home <span>→</span></a></div>;
  }

  return <div className="preference-card" aria-describedby={statusId}>
    <span>Email preference</span>
    <h2>Stop the Say No to Plastic field notes?</h2>
    <p>This removes the address connected to this private link from marketing broadcasts. You can subscribe again later through any signup form.</p>
    <button className="button gold" type="button" onClick={unsubscribe} disabled={state === "loading"}>
      {state === "loading" ? "Saving..." : "Unsubscribe"} <span>→</span>
    </button>
    <p id={statusId} className={state === "error" ? "form-error" : "sr-only"} role={state === "error" ? "alert" : "status"} aria-live="polite">
      {state === "loading" ? "Saving your email preference." : state === "error" ? "We could not save the preference. Please try again or contact support." : ""}
    </p>
  </div>;
}

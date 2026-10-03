"use client";

import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BOOK } from "../config";
import { trackEvent } from "./ConsentAnalytics";

export function CheckoutButton({
  label,
  className,
  children,
  onStarted,
}: {
  label: string;
  className?: string;
  children: ReactNode;
  onStarted?: () => void;
}) {
  const pathname = usePathname();
  const isSpanish = pathname?.startsWith("/es") ?? false;
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const controlId = useId();
  const errorId = `${controlId}-checkout-error`;
  const attemptId = useRef<string | null>(null);
  const genericError = isSpanish ? "No se pudo iniciar el pago seguro. Inténtalo de nuevo." : "Checkout could not be started.";

  async function startCheckout() {
    if (state === "loading") return;
    setState("loading");
    setError("");
    onStarted?.();
    void trackEvent("begin_checkout", { label, destination: "/api/checkout" });
    if (typeof window !== "undefined" && "gtag" in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag("event", "begin_checkout", {
        currency: BOOK.currency,
        value: Number(BOOK.price),
        items: [{ item_id: BOOK.productKey, item_name: BOOK.title, price: Number(BOOK.price), quantity: 1 }],
      });
    }
    try {
      attemptId.current ||= crypto.randomUUID();
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: label, attemptId: attemptId.current }),
      });
      const payload = await response.json() as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(isSpanish ? genericError : (payload.error || genericError));
      window.location.assign(payload.url);
    } catch (caught) {
      setError(isSpanish ? genericError : (caught instanceof Error ? caught.message : genericError));
      void trackEvent("form_error", { label: `checkout:${label}` });
      setState("error");
    }
  }

  return (
    <span className="checkout-control" aria-busy={state === "loading"}>
      <button type="button" className={className} onClick={startCheckout} disabled={state === "loading"} aria-describedby={error ? errorId : undefined}>
        {state === "loading" ? (isSpanish ? "Abriendo pago seguro..." : "Opening secure checkout...") : children}
      </button>
      {error && <span id={errorId} className="checkout-error" role="alert">{error}</span>}
    </span>
  );
}

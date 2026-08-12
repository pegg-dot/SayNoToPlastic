"use client";

import type { ReactNode } from "react";
import { trackEvent } from "./ConsentAnalytics";

export function PrintButton({ className = "button gold", label = "quick-action-card-print", children }: { className?: string; label?: string; children: ReactNode }) {
  return <button className={className} type="button" onClick={() => { void trackEvent("cta_click", { label }); window.print(); }}>{children}</button>;
}

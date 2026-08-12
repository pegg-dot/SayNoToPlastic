"use client";

import type { ReactNode } from "react";
import { trackEvent } from "./ConsentAnalytics";
import { BOOK } from "../config";

export function TrackedLink({ href, eventName, label, className, children, target, rel }: { href: string; eventName: string; label: string; className?: string; children: ReactNode; target?: string; rel?: string }) {
  function click() {
    void trackEvent(eventName, { label, destination: href });
    if (eventName === "begin_checkout" && typeof window !== "undefined" && "gtag" in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      const price = Number(BOOK.price);
      gtag("event", "begin_checkout", { currency: BOOK.currency, value: price, items: [{ item_id: "homo-plasticus-ebook", item_name: BOOK.title, price, quantity: 1 }] });
    }
  }
  return <a href={href} onClick={click} className={className} target={target} rel={rel}>{children}</a>;
}

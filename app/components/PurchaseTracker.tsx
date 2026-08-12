"use client";

import { useEffect } from "react";
import { BOOK } from "../config";
import { trackEvent } from "./ConsentAnalytics";

const CONSENT_KEY = "hp_analytics_consent_v1";

export function PurchaseTracker({
  orderId,
  amountTotal,
  currency,
}: {
  orderId: string;
  amountTotal?: number | null;
  currency?: string;
}) {
  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return;
    const storageKey = `hp_purchase_tracked_${orderId}`;
    if (localStorage.getItem(storageKey)) return;
    localStorage.setItem(storageKey, new Date().toISOString());

    void trackEvent("purchase", { label: orderId, destination: BOOK.productKey });
    if ("gtag" in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag("event", "purchase", {
        transaction_id: orderId,
        currency: (currency || BOOK.currency).toUpperCase(),
        value: typeof amountTotal === "number" ? amountTotal / 100 : Number(BOOK.price),
        items: [{ item_id: BOOK.productKey, item_name: BOOK.title, price: Number(BOOK.price), quantity: 1 }],
      });
    }
  }, [amountTotal, currency, orderId]);

  return null;
}

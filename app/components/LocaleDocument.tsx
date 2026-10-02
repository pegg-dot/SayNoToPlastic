"use client";

import { useEffect } from "react";
import type { SiteLocale } from "../lib/i18n";

export function LocaleDocument({ locale }: { locale: SiteLocale }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale === "es" ? "es" : "en";
    return () => {
      document.documentElement.lang = previous || "en";
    };
  }, [locale]);

  return null;
}

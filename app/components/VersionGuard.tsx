"use client";

import { useEffect } from "react";
import { BUILD_VERSION } from "../build-version";

export function VersionGuard() {
  useEffect(() => {
    document.documentElement.dataset.buildVersion = BUILD_VERSION;
    let checking = false;

    async function verifyVersion() {
      if (checking) return;
      checking = true;
      try {
        const response = await fetch(`/api/version?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json() as { version?: string };
        if (payload.version && payload.version !== BUILD_VERSION) window.location.reload();
      } finally {
        checking = false;
      }
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) void verifyVersion();
    }

    function onVisibility() {
      if (document.visibilityState === "visible") void verifyVersion();
    }

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    void verifyVersion();
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}

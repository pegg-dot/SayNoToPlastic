"use client";

import { useEffect } from "react";

let activeLocks = 0;
let previousOverflow = "";

function acquireBodyScrollLock() {
  if (activeLocks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.scrollLocked = "true";
  }
  activeLocks += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);
    if (activeLocks === 0) {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.scrollLocked;
    }
  };
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    return acquireBodyScrollLock();
  }, [active]);
}

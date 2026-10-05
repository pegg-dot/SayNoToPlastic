"use client";

import { useEffect } from "react";

/**
 * Owns homepage reveal behavior independently of any individual section.
 * It also watches for late-mounted client content, so localized/dynamic
 * sections cannot remain permanently transparent after hydration.
 */
export function HomeRevealObserver() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-v2");
    if (!root) return;

    const observed = new Set<HTMLElement>();
    const supportsIntersection = "IntersectionObserver" in window;
    let intersection: IntersectionObserver | null = null;

    if (supportsIntersection) {
      intersection = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const node = entry.target as HTMLElement;
            node.classList.add("is-visible");
            intersection?.unobserve(node);
            observed.delete(node);
          }
        },
        { threshold: 0.14 },
      );
    }

    const register = () => {
      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
      for (const node of nodes) {
        if (node.classList.contains("is-visible") || observed.has(node)) continue;
        if (!intersection) {
          node.classList.add("is-visible");
          continue;
        }
        observed.add(node);
        intersection.observe(node);
      }
    };

    register();
    const mutation = new MutationObserver(register);
    mutation.observe(root, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      intersection?.disconnect();
      observed.clear();
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("route_render_failed", { message: error.message, digest: error.digest });
  }, [error]);

  return <main id="main-content" tabIndex={-1} className="error-page">
    <p className="eyebrow">A page did not finish loading</p>
    <h1>The evidence is still here. This view needs another try.</h1>
    <p>No purchase or form should be repeated automatically. Retry the page, or return home and use the support path if the problem continues.</p>
    <div><button className="button gold" type="button" onClick={reset}>Try again <span>→</span></button><a className="text-link" href="/">Return home <span>↗</span></a><a className="text-link" href="/contact">Report the problem <span>↗</span></a></div>
    {error.digest && <small>Reference: {error.digest}</small>}
  </main>;
}

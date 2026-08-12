"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="error-page global-error"><p className="eyebrow">Say No to Plastic</p><h1>The site could not finish loading.</h1><p>Try once more. If the problem continues, return to the homepage or contact the project team.</p><div><button className="button gold" type="button" onClick={reset}>Try again <span>→</span></button><a className="text-link" href="/">Return home <span>↗</span></a><a className="text-link" href="/contact">Contact support <span>↗</span></a></div></main></body></html>;
}

"use client";

import { useId, useState } from "react";
import { BOOK } from "../config";

export function CommercePreview({ source }: { source: string }) {
  const [complete, setComplete] = useState(false);
  const [email, setEmail] = useState("preview@example.com");
  const emailId = useId();
  const previewOrder = "preview-order-not-stored";

  if (complete) return <div className="commerce-preview-card success"><span>Preview confirmation</span><h2>Your ebook would be ready.</h2><p>A real paid order would now be verified by Stripe, stored in D1, emailed through Resend, and connected to a signed R2 access link.</p><dl><div><dt>Order</dt><dd>{previewOrder}</dd></div><div><dt>Email</dt><dd>{email}</dd></div><div><dt>Delivery</dt><dd>Secure access email + confirmation page</dd></div></dl><a className="button gold" href="/purchase/recover">View access recovery <span>→</span></a><button type="button" onClick={() => setComplete(false)}>Restart preview</button></div>;

  return <form className="commerce-preview-card" onSubmit={(event) => { event.preventDefault(); setComplete(true); }}><span>Local flow preview · no payment</span><h2>Secure checkout handoff</h2><p>The real payment page is hosted by Stripe. This safe local preview lets you inspect the surrounding flow without provider credentials or a charge.</p><div className="commerce-preview-product"><img src="/book-official.webp" width="240" height="300" alt={`${BOOK.title} ebook cover`}/><div><strong>{BOOK.title}</strong><small>{BOOK.format}</small><b>${BOOK.price} {BOOK.currency}</b></div></div><label htmlFor={emailId}>Email for delivery<input id={emailId} name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><dl><div><dt>Source CTA</dt><dd>{source || "direct preview"}</dd></div><div><dt>Payment data</dt><dd>Handled by Stripe in test/live mode</dd></div><div><dt>Current action</dt><dd>Simulated only</dd></div></dl><button className="button gold" type="submit">Complete preview purchase <span>→</span></button><small>No order, email, file access, analytics event, or payment is created by this preview.</small></form>;
}

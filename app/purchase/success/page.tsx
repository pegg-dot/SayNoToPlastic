import type { Metadata } from "next";
import { headers } from "next/headers";
import { Footer, Header } from "../../components/SiteChrome";
import { PurchaseTracker } from "../../components/PurchaseTracker";
import { completeStripeCheckout } from "../../lib/commerce";
import { SITE_URL, SUPPORT_EMAIL } from "../../config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Homo Plasticus purchase confirmation | Say No to Plastic",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId = "" } = await searchParams;
  const requestHeaders = await headers();
  const fallbackSite = new URL(SITE_URL);
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || fallbackSite.host;
  const protocol = requestHeaders.get("x-forwarded-proto") || fallbackSite.protocol.replace(":", "");
  const state = await completeStripeCheckout(sessionId, `${protocol}://${host}/purchase/success`);
  return (
    <>
      {state.status === "ready" && state.orderId && <PurchaseTracker orderId={state.orderId} amountTotal={state.amountTotal} currency={state.currency} />}
      <Header skipToContent />
      <main id="main-content" tabIndex={-1} className="inner-page purchase-page">
        <section className="purchase-hero">
          <div>
            <p className="eyebrow">Purchase confirmation</p>
            <h1>{state.status === "ready" ? "Your ebook is ready." : state.status === "processing" ? "Payment is processing." : "We need to verify your order."}</h1>
            <p>{state.message}</p>
          </div>
          <aside className={`purchase-status-card ${state.status}`}>
            <span>{state.status === "ready" ? "Confirmed" : state.status === "processing" ? "Pending" : "Support available"}</span>
            {state.orderId && <><strong>Order</strong><code>{state.orderId}</code></>}
            {state.email && <p>Access details were prepared for <strong>{state.email}</strong>.</p>}
            {state.accessUrl && <a className="button gold" href={state.accessUrl}>Open secure access <span>→</span></a>}
            {!state.accessUrl && <a className="button outline" href="/purchase/recover">Recover access <span>→</span></a>}
          </aside>
        </section>
        <section className="purchase-help ivory">
          <div><p className="eyebrow dark">Keep your order safe</p><h2>Access can be recovered.</h2></div>
          <div><p>Use the purchase email and order number to request a fresh access link. Payment-card information is handled by the payment provider and is never stored by this site.</p><p>For a payment, refund, or technical-access issue, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and include the order number shown above.</p></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

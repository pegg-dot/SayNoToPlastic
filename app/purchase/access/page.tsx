import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { getAccessPageState } from "../../lib/commerce";
import { SUPPORT_EMAIL } from "../../config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Secure Homo Plasticus ebook access | Say No to Plastic",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function PurchaseAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const state = await getAccessPageState(token);
  return (
    <>
      <Header skipToContent />
      <main id="main-content" tabIndex={-1} className="inner-page purchase-page">
        <section className="purchase-hero access-hero">
          <div>
            <p className="eyebrow">Secure digital access</p>
            <h1>{state.status === "ready" ? "Homo Plasticus is ready." : "This link needs attention."}</h1>
            <p>{state.message}</p>
          </div>
          <aside className={`purchase-status-card ${state.status}`}>
            <span>{state.status === "ready" ? "Verified order" : "Access status"}</span>
            {state.orderId && <><strong>Order</strong><code>{state.orderId}</code></>}
            {state.status === "ready" && state.token ? (
              <form action="/api/ebook/download" method="post">
                <input type="hidden" name="token" value={state.token} />
                <button className="button gold" type="submit">Download the ebook <span>↓</span></button>
              </form>
            ) : (
              <a className="button gold" href="/purchase/recover">Request a fresh link <span>→</span></a>
            )}
            <small>Do not share this access link. Download activity is recorded against the order for support and fraud review.</small>
          </aside>
        </section>
        <section className="purchase-help ivory">
          <div><p className="eyebrow dark">Need help?</p><h2>Recover access without repurchasing.</h2></div>
          <div><p>Request a new access link using the email entered at checkout. A refunded or revoked order cannot download the file.</p><p>For support, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the order number.</p></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

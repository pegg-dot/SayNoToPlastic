import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { RecoveryForm } from "../../components/RecoveryForm";
import { SUPPORT_EMAIL } from "../../config";

export const metadata: Metadata = {
  title: "Recover Homo Plasticus ebook access | Say No to Plastic",
  description: "Request a fresh secure access link for a paid Homo Plasticus ebook order.",
  robots: { index: false, follow: false },
};

export default function RecoverPurchasePage() {
  return (
    <>
      <Header skipToContent />
      <main id="main-content" tabIndex={-1} className="inner-page purchase-page">
        <section className="purchase-recovery-hero">
          <div><p className="eyebrow">Book and order support</p><h1>Recover your ebook access.</h1><p>Enter the email used at checkout. Adding the order number helps identify the exact purchase, but it is optional.</p></div>
          <RecoveryForm />
        </section>
        <section className="purchase-help ivory">
          <div><p className="eyebrow dark">Privacy boundary</p><h2>We do not expose order records.</h2></div>
          <div><p>The response is intentionally the same whether or not an order matches. This prevents the form from revealing who has purchased the book.</p><p>Still stuck? Contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Never send card details by email or through the contact form.</p></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

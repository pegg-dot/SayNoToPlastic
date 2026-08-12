import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { UnsubscribeForm } from "../components/UnsubscribeForm";
import { SUPPORT_EMAIL } from "../config";
import { unsubscribeTokenIsValid } from "../lib/subscription";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Email preferences | Say No to Plastic",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function EmailPreferencesPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const validFormat = unsubscribeTokenIsValid(token);
  return <><Header skipToContent/><main id="main-content" tabIndex={-1} className="inner-page preference-page">
    <section className="preference-hero">
      <div><p className="eyebrow">Email preferences</p><h1>Your inbox stays under your control.</h1><p>Use the private link from a Say No to Plastic email to stop marketing field notes. Purchase and access messages remain separate because they may be needed to fulfill an order.</p></div>
      {validFormat ? <UnsubscribeForm token={token}/> : <div className="preference-status"><span>Private link required</span><h2>This preference link is missing or incomplete.</h2><p>Open the unsubscribe link in the footer of a Say No to Plastic email. For help, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p><a className="button outline" href="/privacy-policy#privacy-choices">Review privacy choices <span>→</span></a></div>}
    </section>
  </main><Footer/></>;
}

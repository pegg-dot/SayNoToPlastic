import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { CommercePreview } from "../../components/CommercePreview";

export const metadata: Metadata = { title: "Homo Plasticus commerce preview | Say No to Plastic", robots: { index: false, follow: false } };

export default async function CommercePreviewPage({searchParams}:{searchParams:Promise<{source?:string}>}){const {source=""}=await searchParams;return <><Header skipToContent/><main id="main-content" tabIndex={-1} className="inner-page commerce-preview-page"><section><div><p className="eyebrow">Native ebook commerce</p><h1>See the flow before activation.</h1><p>Every book CTA reaches the same checkout endpoint. Preview mode shows the site-owned experience while the real Stripe test account, webhook, email, database, and private file remain parked.</p><a href="/homo-plasticus">Return to the book page →</a></div><CommercePreview source={source.slice(0,120)}/></section><aside><strong>What this proves</strong><p>CTA wiring, mode switching, book data, pre-payment messaging, confirmation design, and recovery navigation.</p><strong>What still requires external accounts</strong><p>Stripe-hosted card entry, signed webhook events, D1 order records, Resend delivery, R2 download, refunds, and live monitoring.</p></aside></main><Footer/></>}

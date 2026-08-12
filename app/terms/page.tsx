import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { BOOK } from "../config";

export const metadata: Metadata = { title: "Terms of Use | Say No to Plastic", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <><Header/><main id="main-content" tabIndex={-1} className="inner-page legal-page"><section><p className="eyebrow">Legal</p><h1>Terms of Use</h1><p className="legal-date">Last updated August 10, 2026</p></section><article>
    <h2>Educational purpose</h2><p>Say No to Plastic provides general educational information about plastic pollution, microplastics, nanoplastics, emerging research, and practical exposure reduction. Review the separate <a href="/medical-disclaimer">medical disclaimer</a>.</p>
    <h2>Scientific uncertainty</h2><p>Research in this field is evolving. Detection methods, definitions, and conclusions may change as stronger evidence becomes available. A cited study does not constitute endorsement of every interpretation of that study.</p>
    <h2>No physician-patient relationship</h2><p>Use of this website, its forms, email updates, book materials, or other content does not create a physician-patient relationship with Elie R. Haddad, MD, Dr. Rudolph Eberwein, or any affiliated professional.</p>
    <h2>Worksheets, challenges, and email updates</h2><p>Interactive worksheets and 7-day or 30-day challenges are educational planning tools. They are not detox programs, medical treatment, or guarantees of reduced exposure or improved health. Device-local progress may be lost if browser data is cleared. Email updates are sent only after consent and can be stopped using the unsubscribe method in each message.</p>
    <h2>Purchases</h2><p>The current digital edition of <em>{BOOK.title}</em> is sold through the checkout presented when a purchase begins, for the price and taxes shown there. Access is issued after confirmed payment and can be recovered through the <a href="/purchase/recover">book-access page</a>. Do not share signed access links or distribute the ebook in violation of applicable rights. The <a href="/refunds-and-returns">refund policy</a> applies. Technical-access support never requires sending payment-card information.</p>
    <h2>Affiliate products</h2><p>Outside retailers control purchases made through affiliate links. Their pricing, payment, shipping, warranty, return, support, privacy, and other terms govern the transaction.</p>
    <h2>External links</h2><p>The site links to journals, public institutions, professional profiles, retailers, and other third parties. Say No to Plastic does not control their content, availability, privacy practices, or terms.</p>
    <h2>Intellectual property</h2><p>Say No to Plastic names, original writing, design, Homo Plasticus book materials, and commissioned visual assets are protected by applicable intellectual-property law. Third-party publications remain the property of their respective owners.</p>
    <h2>Acceptable use</h2><p>Do not interfere with the operation or security of the site, submit unlawful material, impersonate another person, scrape protected material in violation of law, attempt to bypass purchase or access controls, or use contact systems for harassment or automated spam.</p>
    <h2>Changes</h2><p>These terms may be revised as the website and its services develop. Continued use after an update constitutes acceptance of the revised terms to the extent permitted by law.</p>
    <h2>Contact</h2><p>Questions about these terms can be submitted through the <a href="/contact">contact page</a>.</p>
  </article></main><Footer/></>;
}

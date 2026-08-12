import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { SUPPORT_EMAIL } from "../config";

export const metadata: Metadata = {
  title: "Accessibility Statement | Say No to Plastic",
  description: "How Say No to Plastic approaches accessible content, navigation, forms, and support.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <><Header/><main id="main-content" tabIndex={-1} className="legal-page"><p className="eyebrow">Accessibility</p><h1>Access should be part of the work.</h1><p className="legal-intro">Say No to Plastic is working toward an experience aligned with WCAG 2.2 Level AA. Accessibility is treated as an ongoing editorial and technical responsibility.</p>
      <section><h2>What the site supports</h2><p>The site uses semantic headings, descriptive page titles, visible keyboard focus, labeled forms, text alternatives for meaningful images, and navigation that can be used by keyboard. Motion is reduced when a device requests reduced motion. Content is written and structured to remain usable when text is enlarged.</p></section>
      <section><h2>Reading and interaction</h2><p>Buttons and links use visible labels, form errors are announced in context, and decorative images are separated from content-bearing images. Source links identify their destinations, while scientific summaries distinguish reported findings from limitations.</p></section>
      <section><h2>Known limits</h2><p>Some linked research, retailer checkout pages, videos, and other third-party services are controlled by their publishers. Their accessibility may differ from this site. Older or external documents may also require a separate reader or accessible-format request.</p></section>
      <section><h2>Request help or report a barrier</h2><p>If a page, form, source, ebook delivery path, or document is difficult to use, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or use the <a href="/contact">contact form</a>. Include the page address, the barrier you encountered, and the format or accommodation that would help. The team will respond with a practical access path and use the report to guide remediation.</p></section>
      <section><h2>Review cycle</h2><p>This statement and the public interface are reviewed whenever a major feature, purchase path, form, or content format changes. Last reviewed August 3, 2026.</p></section>
    </main><Footer/></>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "./final-continuity.css";
import { ConsentAnalytics } from "./components/ConsentAnalytics";
import { AnatomyAtlasEvidenceSync } from "./components/AnatomyAtlasEvidenceSync";
import { BOOK, SITE_URL } from "./config";
import { VersionGuard } from "./components/VersionGuard";
import { WelcomeVideoModal } from "./components/WelcomeVideoModal";

const socialDescription = "Physician-led science, practical exposure reduction, and clear next steps for a world living with plastic.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Say No to Plastic",
  title: { default: "Say No to Plastic | Science, Clarity, Action", template: "%s" },
  description: `Say No to Plastic. Physician-led science, practical exposure reduction, and the book ${BOOK.title} by Elie R. Haddad, MD.`,
  authors: [{ name: "Say No to Plastic", url: SITE_URL }],
  creator: "Say No to Plastic",
  publisher: "Say No to Plastic",
  category: "Public health education",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: "Say No to Plastic",
    description: socialDescription,
    url: SITE_URL,
    siteName: "Say No to Plastic",
    type: "website",
    locale: "en_US",
    images: [{ url: "/sntp-social-share.webp", width: 1200, height: 630, alt: "Say No to Plastic — physician-led science, clarity, and practical action" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Say No to Plastic",
    description: socialDescription,
    images: ["/sntp-social-share.webp"],
  },
  robots: { index: true, follow: true },
  other: { "codex-preview": "development" },
};

const organizationId = `${SITE_URL}/#organization`;
const personId = `${SITE_URL}/#elie-haddad`;
const websiteId = `${SITE_URL}/#website`;
const bookId = `${SITE_URL}/#book`;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": organizationId, name: "Say No to Plastic", url: SITE_URL, slogan: "Science. Clarity. Action." },
    { "@type": "Person", "@id": personId, name: "Elie R. Haddad", honorificSuffix: "MD", jobTitle: "Cardiologist and cardiac electrophysiologist", url: `${SITE_URL}/about-dr-elie-haddad` },
    { "@type": "WebSite", "@id": websiteId, name: "Say No to Plastic", url: SITE_URL, publisher: { "@id": organizationId } },
    { "@type": "Book", "@id": bookId, name: BOOK.title, alternativeHeadline: BOOK.subtitle, author: { "@id": personId }, contributor: { "@type": "Person", name: "Rudolph Eberwein" }, bookFormat: "EBook", inLanguage: "en-US", url: `${SITE_URL}/homo-plasticus`, offers: { "@type": "Offer", price: BOOK.price, priceCurrency: BOOK.currency, availability: "https://schema.org/InStock", url: `${SITE_URL}${BOOK.purchasePath}` } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div id="site-shell">{children}<VersionGuard/><ConsentAnalytics/></div><WelcomeVideoModal/><AnatomyAtlasEvidenceSync/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}

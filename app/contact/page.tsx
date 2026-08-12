import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { ContactForm } from "../components/ContactForm";
import { SUPPORT_EMAIL } from "../config";

export const metadata: Metadata = {
  title: "Contact | Say No to Plastic",
  description: "Ask Say No to Plastic about ebook access, media and speaking, research, partnerships, or general questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <>
    <Header />
    <main id="main-content" tabIndex={-1} className="inner-page">
      <section className="contact-hero">
        <div>
          <p className="eyebrow">Contact Say No to Plastic</p>
          <h1>Ask a question.</h1>
          <p>Choose the subject that best fits your message. The form supports ebook access, media and speaking, research, partnerships, and general questions.</p>
          <div className="contact-routing">
            <span>Ebook access</span><span>Media &amp; speaking</span><span>Research</span><span>Partnerships</span><span>General questions</span>
          </div>
          <div className="direct-contact">
            <span>Direct email</span>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            <p>For ebook access, include the purchaser name and order number when available. Never email payment-card information.</p>
          </div>
        </div>
        <div>
          <ContactForm />
          <p className="contact-boundary-note"><strong>Personal medical questions:</strong> this public-education project cannot diagnose symptoms or provide individual treatment advice. Please use an appropriate healthcare professional or local emergency service for personal care.</p>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}

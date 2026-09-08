import type { Metadata } from "next";
import { Footer, Header } from "./components/SiteChrome";
import { BodyJourney } from "./components/BodyJourney";
import { coreRules } from "./content/actions";
import { BOOK } from "./config";
import { TrackedLink } from "./components/TrackedLink";
import { CheckoutButton } from "./components/CheckoutButton";
import { MatterField } from "./components/MatterField";
import { BookJourney } from "./components/BookJourney";
import { ExposureRouteVisual, type ExposureRouteVisualKind } from "./components/ExposureRouteVisual";
import { BEYOND_PLASTIC } from "./content/publications";
import homeStyles from "./home-additions.module.css";
import { SignupForm } from "./components/SignupForm";
import { getAdminContentValues } from "./lib/admin-content";

export const dynamic = "force-dynamic";

const description = "A physician-led platform translating microplastic and nanoplastic research into practical steps that help protect human health and future generations.";
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Say No To Plastic | Microplastics, Human Health & Practical Solutions",
  description,
  openGraph: { title: "Say No To Plastic | Microplastics, Human Health & Practical Solutions", description, url: "/", siteName: "Say No to Plastic", type: "website", images: [{ url: "/sntp-social-share.webp", width: 1200, height: 630, alt: "Say No to Plastic — physician-led science, clarity, and practical action" }] },
  twitter: { card: "summary_large_image", title: "Say No To Plastic | Microplastics, Human Health & Practical Solutions", description, images: ["/sntp-social-share.webp"] },
};

const exposureRoutes: Array<{ number: string; name: string; kind: ExposureRouteVisualKind; text: string; href: string; linkLabel: string }> = [
  { number: "01", name: "Air", kind: "air", text: "Synthetic fibers and indoor dust can become part of the air we breathe every day.", href: "/resources/microplastics-indoor-dust", linkLabel: "Open the indoor-air guide" },
  { number: "02", name: "Water", kind: "water", text: "Plastic has been measured in bottled water, tap water, and the systems that bring water to us.", href: "/resources/microplastics-drinking-water-filter-guide", linkLabel: "Open the water guide" },
  { number: "03", name: "Food storage", kind: "food", text: "Plastic packaging and storage containers create repeated contact with what we eat.", href: "/science/body/digestive-system", linkLabel: "Explore the digestive system" },
  { number: "04", name: "Heat", kind: "heat", text: "Heating food in plastic is one of the clearest places to make a practical kitchen change.", href: "/resources/heating-food-in-plastic", linkLabel: "Open the heat guide" },
  { number: "05", name: "Fast fashion", kind: "textiles", text: "Synthetic clothing can shed plastic microfibers through wear, washing, and indoor dust.", href: "/resources/synthetic-clothing-microfibers", linkLabel: "Open the clothing guide" },
  { number: "06", name: "Skincare and cosmetics", kind: "personal-care", text: "Personal-care products and their packaging deserve the same deliberate attention as food-contact materials.", href: "/science/body/skin", linkLabel: "Explore skin and contact" },
];

export default async function Home() {
  const ownerCopy = await getAdminContentValues([
    "home.hero_eyebrow",
    "home.hero_headline",
    "home.hero_deck",
    "home.media_heading",
    "home.media_body",
    "home.newsletter_heading",
    "home.newsletter_body",
  ]);

  const heroEyebrow = ownerCopy["home.hero_eyebrow"] || "Physician-led · evidence-based";
  const heroHeadline = ownerCopy["home.hero_headline"] || "The most dangerous pollutant is the one already inside us.";
  const heroDeck = ownerCopy["home.hero_deck"] || "Human evidence, explained clearly—then practical places to start.";
  const mediaHeading = ownerCopy["home.media_heading"] || "Follow the public conversation.";
  const mediaBody = ownerCopy["home.media_body"] || "Talks, interviews, public appearances, and press resources live in one dedicated media center.";
  const newsletterHeading = ownerCopy["home.newsletter_heading"] || "Stay close to the research.";
  const newsletterBody = ownerCopy["home.newsletter_body"] || "Receive new research summaries, practical exposure-reduction guidance, book news, and updates from the movement.";

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="home-v2">

      <section id="top" className="hp-hero">
        <MatterField className="hp-hero-field" density={74} />
        <div className="hp-hero-shade" />
        <picture className="hp-hero-approved-art" aria-hidden="true"><source media="(max-width: 767px)" srcSet="/hero-mobile.webp"/><img src="/hero-desktop.webp" width="1536" height="980" fetchPriority="high" alt=""/></picture>
        <div className="hp-hero-copy">
          <p className="eyebrow"><span />{heroEyebrow}</p>
          <h1><em>{heroHeadline}</em></h1>
          <p className="hp-hero-deck">{heroDeck}</p>
          <div className="hp-hero-actions">
            <CheckoutButton className="button gold" label="homepage-hero">Get the ebook · ${BOOK.price} <span>↗</span></CheckoutButton>
            <a className="text-link" href="#evidence">Enter the body <span>↓</span></a>
          </div>
        </div>
        <div className="hp-hero-index"><span>01</span><p>Science · Clarity · Action</p></div>
      </section>

      <BodyJourney />

      <section id="exposure" className="exposure-section">
        <header data-reveal>
          <div className="hp-section-index light"><span>03</span><p>How it reaches us</p></div>
          <p className="eyebrow">The everyday routes</p>
          <h2>Exposure is built into ordinary life.</h2>
          <p>Start by understanding the everyday places where plastic meets your body, your home, and the things you use most often.</p>
        </header>
        <div className="exposure-marquee" aria-hidden="true"><span>AIR · WATER · FOOD · HEAT · TEXTILES · PERSONAL CARE · AIR · WATER · FOOD</span></div>
        <div className="exposure-grid">
          {exposureRoutes.map((route) => (
            <article key={route.number} data-reveal><ExposureRouteVisual kind={route.kind} /><span>{route.number}</span><h3>{route.name}</h3><p>{route.text}</p><TrackedLink href={route.href} eventName="cta_click" label={`home-exposure-${route.kind}`}>{route.linkLabel} <b>→</b></TrackedLink></article>
          ))}
        </div>
        <aside className="home-progress-note" data-reveal>
          <span>Progress, not perfection.</span>
          <p>You do not need to eliminate every piece of plastic. Start with one repeated source that is practical to change, keep it long enough to become routine, then decide what comes next.</p>
          <TrackedLink href="/solutions/reduce-exposure#worksheet" eventName="cta_click" label="home-progress-worksheet">Build a one-change worksheet <b>→</b></TrackedLink>
        </aside>
      </section>

      <section id="solutions" className="hp-actions ivory">
        <div className="hp-actions-visual" aria-label="Three simple starting rules from Say No to Plastic">
          <p className="eyebrow dark">Start here</p>
          <h3>First: use less plastic.</h3>
          <ol>{coreRules.map((rule) => <li key={rule.number}><span>{rule.number}</span><strong>{rule.title}</strong><small>{rule.detail}</small></li>)}</ol>
        </div>
        <div className="hp-actions-copy" data-reveal>
          <div className="hp-section-index"><span>04</span><p>Practical action</p></div>
          <h2>Start with the plastic you use around food and drinks every day.</h2>
          <p className="lead">Pick one routine to change first.</p>
          <TrackedLink className="button navy hp-actions-cta" href="/solutions" eventName="cta_click" label="home-solutions">Choose one next change <span>→</span></TrackedLink>
        </div>
      </section>

      <BookJourney />

      <section id="about" className="hp-author ivory">
        <div className="hp-author-copy" data-reveal>
          <div className="hp-section-index"><span>06</span><p>The author</p></div>
          <p className="eyebrow dark">Behind the inquiry</p>
          <h2>A physician following an overlooked signal.</h2>
          <p>Elie R. Haddad, MD, is a cardiologist and cardiac electrophysiologist with more than two decades of clinical experience. Homo Plasticus began with the kind of question that changes medicine: what environmental influence are we overlooking?</p>
          <TrackedLink className="button navy" href="/about-dr-elie-haddad" eventName="cta_click" label="home-about">Meet Dr. Haddad <span>→</span></TrackedLink>
        </div>
        <figure className="hp-author-portrait" data-reveal>
          <img src="/portrait.webp" width="900" height="1024" loading="lazy" alt="Elie R. Haddad, MD, seated in his office wearing medical scrubs" />
          <figcaption><strong>Elie R. Haddad, MD</strong><span>Cardiologist · Cardiac electrophysiologist · Author</span></figcaption>
        </figure>
      </section>

      <section className={homeStyles.podcastFeature} aria-labelledby="home-podcast-title">
        <figure className={homeStyles.art} data-reveal><img src={BEYOND_PLASTIC.artwork} width="1200" height="1200" loading="lazy" alt={BEYOND_PLASTIC.artworkAlt} /><figcaption>Beyond Plastic · Where Science Meets Consciousness</figcaption></figure>
        <div className={homeStyles.copy} data-reveal><p className={homeStyles.eyebrow}>Beyond Plastic</p><h2 id="home-podcast-title"><em>Where Science Meets Consciousness</em></h2><p className={homeStyles.lead}>A podcast exploring the ideas that shape our health, our lives, and ultimately, our humanity.</p><p>Beginning with <strong>The Plastic Age</strong> — and going far beyond it.</p><TrackedLink className={homeStyles.cta} href="/podcast" eventName="cta_click" label="home-podcast">Explore the podcast <span>→</span></TrackedLink></div>
      </section>

      <section className={homeStyles.tedxFeature} aria-labelledby="home-tedx-title"><div className={homeStyles.tedxRule}><span>TEDxMiami</span></div><div className={homeStyles.tedxCopy} data-reveal><p className={homeStyles.tedxEyebrow}>Watch the TEDx Talk</p><h2 id="home-tedx-title">The Invisible Inheritance of Nanoplastics</h2><p>What happens when an environmental pollutant becomes part of the human story?</p><TrackedLink className={homeStyles.tedxCta} href="/tedx" eventName="cta_click" label="home-tedx">Watch the talk <span>→</span></TrackedLink></div></section>

      <section className="hp-media-bridge" aria-labelledby="home-media-title">
        <div data-reveal><p className="eyebrow">Events &amp; Media</p><h2 id="home-media-title">{mediaHeading}</h2><p>{mediaBody}</p></div>
        <aside data-reveal><strong>Media desk</strong><p>Explore verified appearances and press resources.</p><TrackedLink className="button gold" href="/media" eventName="cta_click" label="home-media">Open Events &amp; Media <span>→</span></TrackedLink></aside>
      </section>

      <section id="join" className="hp-join">
        <div className="hp-join-copy" data-reveal>
          <div className="hp-section-index light"><span>07</span><p>Stay connected</p></div>
          <p className="eyebrow">Field Notes / Newsletter</p>
          <h2>{newsletterHeading}</h2>
          <p>{newsletterBody}</p>
          <SignupForm buttonLabel="Join the movement" successTitle="You&apos;re in." successText="You&apos;re subscribed. No confirmation email is required." />
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
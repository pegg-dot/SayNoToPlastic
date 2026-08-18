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

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="home-v2">

      <section id="top" className="hp-hero">
        <MatterField className="hp-hero-field" density={74} />
        <div className="hp-hero-shade" />
        <picture className="hp-hero-approved-art" aria-hidden="true"><source media="(max-width: 767px)" srcSet="/hero-mobile.webp"/><img src="/hero-desktop.webp" width="1536" height="980" fetchPriority="high" alt=""/></picture>
        <div className="hp-hero-copy">
          <p className="eyebrow"><span />Physician-led · evidence-based</p>
          <h1><em>The most dangerous pollutant is the one already inside us.</em></h1>
          <p className="hp-hero-deck">Human evidence, explained clearly—then practical places to start.</p>
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
          <ol>
            {coreRules.map((rule) => <li key={rule.number}><span>{rule.number}</span><strong>{rule.title}</strong><small>{rule.detail}</small></li>)}
          </ol>
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

      <section className="hp-media-bridge" aria-labelledby="home-media-title">
        <div data-reveal>
          <p className="eyebrow">Events &amp; Media</p>
          <h2 id="home-media-title">Follow the public conversation.</h2>
          <p>Talks, interviews, public appearances, and press resources live in one dedicated media center, separate from the homepage’s core science-to-action journey.</p>
        </div>
        <aside data-reveal>
          <strong>Media desk</strong>
          <p>Explore verified appearances now and add future links without redesigning the site.</p>
          <TrackedLink className="button gold" href="/media" eventName="cta_click" label="home-media">Open Events &amp; Media <span>→</span></TrackedLink>
        </aside>
      </section>

      <section id="join" className="hp-join">
        <div className="hp-join-copy" data-reveal>
          <div className="hp-section-index light"><span>07</span><p>Stay connected</p></div>
          <p className="eyebrow">Field Notes / Newsletter</p>
          <h2>Coming soon.</h2>
          <p>Research summaries, practical guides, book news, and project updates will be available by email once the mailing platform is connected.</p>
          <small>No email addresses are being collected at launch.</small>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

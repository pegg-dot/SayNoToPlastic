import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { guides } from "../content/guides";
import { TrackedLink } from "../components/TrackedLink";
import { GuideLibrary } from "../components/GuideLibrary";
import styles from "./resources.module.css";

const description = "Evidence-aware guides to microplastics in water, food, indoor air and dust, clothing, fast fashion, skin, cosmetics, personal care, families, and connected science.";
export const metadata: Metadata = { title: "Microplastics Guides | Say No to Plastic", description, alternates: { canonical: "/resources" }, openGraph: { title: "Microplastics Guides | Say No to Plastic", description, url: "/resources", siteName: "Say No to Plastic", type: "website", images: [{ url: "/kitchen.webp", width: 1536, height: 1024, alt: "A practical reading room for lower-plastic household choices" }] }, twitter: { card: "summary_large_image", title: "Microplastics Guides | Say No to Plastic", description, images: ["/kitchen.webp"] } };

const topicRoutes = [
  { number: "01", label: "Water", href: "/resources/microplastics-drinking-water-filter-guide" },
  { number: "02", label: "Food + storage", href: "/resources/heating-food-in-plastic" },
  { number: "03", label: "Air + indoor dust", href: "/resources/microplastics-indoor-dust" },
  { number: "04", label: "Clothing + fast fashion", href: "/resources/synthetic-clothing-microfibers" },
  { number: "05", label: "Skin + personal care", href: "/resources/personal-care-cosmetics-plastic" },
];

export default function ResourcesPage(){return <><Header/><main id="main-content" tabIndex={-1} className="inner-page resources-v2">
  <section className="inner-hero resource-hero">
    <div>
      <p className="eyebrow">Guides</p>
      <h1>Start simple. Go deeper when you need to.</h1>
      <p>Solutions gives you the short version. These guides are for the moment you want the why, the evidence, the tradeoffs, and the practical detail behind a specific question.</p>
    </div>
    <div className="inner-hero-note">
      <span>Reading room</span>
      <p>{guides.length} deeper guides. Read one when it is useful; you do not need to work through the whole library.</p>
      <dl><div><dt>Guides</dt><dd>{guides.length}</dd></div><div><dt>Approach</dt><dd>Practical</dd></div></dl>
    </div>
  </section>

  <section className={styles.topicIntro} aria-labelledby="guide-topics-title">
    <div className={styles.topicIntroHeader}>
      <div><p className="eyebrow">Go deeper by question</p><h2 id="guide-topics-title">Choose the subject you actually need.</h2></div>
      <p>Water, food, inhalation and indoor dust, clothing and fast fashion, and skin or personal-care questions each have a clear starting point. The complete library continues below.</p>
    </div>
    <nav className={styles.topicLinks} aria-label="Featured guide topics">
      {topicRoutes.map((topic) => <TrackedLink key={topic.href} className={styles.topicLink} href={topic.href} eventName="resource_open" label={`resources-topic-${topic.number}`}><span>{topic.number}</span><strong>{topic.label} →</strong></TrackedLink>)}
    </nav>
  </section>

  <section id="guide-library" className="resource-library ivory">
    <div className={styles.libraryShell}><GuideLibrary guides={guides}/></div>
  </section>

  <section className="resource-editorial-link"><TrackedLink className="editorial-callout" href="/editorial-policy" eventName="cta_click" label="resources-editorial-policy"><strong>How are these guides sourced?</strong><span>Read the review, corrections, affiliate, and AI-assistance standards →</span></TrackedLink></section>
</main><Footer/></>}

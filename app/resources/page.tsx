import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { guides } from "../content/guides";
import { TrackedLink } from "../components/TrackedLink";
import { GuideLibrary } from "../components/GuideLibrary";
import styles from "./resources.module.css";

const description = "Evidence-aware guides to microplastics in water, food, indoor air and dust, clothing, fast fashion, skin, cosmetics, personal care, families, and connected science.";
export const metadata: Metadata = { title: "Microplastics Guides | Say No to Plastic", description, alternates: { canonical: "/resources" }, openGraph: { title: "Microplastics Guides | Say No to Plastic", description, url: "/resources", siteName: "Say No to Plastic", type: "website", images: [{ url: "/kitchen.webp", width: 1536, height: 1024, alt: "A practical reading room for lower-plastic household choices" }] }, twitter: { card: "summary_large_image", title: "Microplastics Guides | Say No to Plastic", description, images: ["/kitchen.webp"] } };

export default function ResourcesPage(){return <><Header/><main id="main-content" tabIndex={-1} className="inner-page resources-v2">
  <section className={`${styles.resourceHero} inner-hero resource-hero`}>
    <div>
      <p className="eyebrow">Guides</p>
      <h1>Practical detail, when you want it.</h1>
      <p>Solutions gives you the short version. The guides explain the evidence, tradeoffs, and practical detail behind a specific question.</p>
    </div>
    <div className="inner-hero-note">
      <span>Reading room</span>
      <p>{guides.length} focused guides. Search by question or scan the full library below.</p>
      <dl><div><dt>Guides</dt><dd>{guides.length}</dd></div><div><dt>Approach</dt><dd>Practical</dd></div></dl>
    </div>
  </section>

  <section id="guide-library" className="resource-library ivory">
    <div className={styles.libraryShell}><GuideLibrary guides={guides}/></div>
  </section>

  <section className="resource-editorial-link"><TrackedLink className="editorial-callout" href="/editorial-policy" eventName="cta_click" label="resources-editorial-policy"><strong>How are these guides sourced?</strong><span>Read the review, corrections, affiliate, and AI-assistance standards →</span></TrackedLink></section>
</main><Footer/></>}

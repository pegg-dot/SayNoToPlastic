import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { TrackedLink } from "../components/TrackedLink";
import { BEYOND_PLASTIC } from "../content/publications";
import { getEffectivePodcastPlatforms } from "../lib/publication-overrides";
import styles from "./podcast.module.css";

const description = "Beyond Plastic: Where Science Meets Consciousness is Dr. Elie Haddad's podcast exploring health, medicine, human experience, consciousness, and the forces shaping how we live.";
export const metadata: Metadata = {
  title: "Beyond Plastic Podcast | Say No to Plastic", description, alternates: { canonical: "/podcast" },
  openGraph: { title: "Beyond Plastic: Where Science Meets Consciousness", description, url: "/podcast", siteName: "Say No to Plastic", type: "website", images: [{ url: BEYOND_PLASTIC.artwork, width: 1200, height: 1200, alt: BEYOND_PLASTIC.artworkAlt }] },
  twitter: { card: "summary_large_image", title: "Beyond Plastic: Where Science Meets Consciousness", description, images: [BEYOND_PLASTIC.artwork] },
};

export default async function PodcastPage() {
  const platforms = await getEffectivePodcastPlatforms();

  return <><Header /><main id="main-content" tabIndex={-1} className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <figure className={styles.artworkWrap}><div className={styles.artworkHalo} aria-hidden="true" /><img className={styles.artwork} src={BEYOND_PLASTIC.artwork} width="1200" height="1200" alt={BEYOND_PLASTIC.artworkAlt} fetchPriority="high" /><figcaption>Beyond Plastic · Dr. Elie Haddad</figcaption></figure>
      <div className={styles.heroCopy}><p className={styles.kicker}>A podcast by Dr. Elie Haddad</p><h1><span>Beyond Plastic:</span> Where Science Meets Consciousness</h1><p className={styles.lead}>Beyond Plastic is a podcast about the ideas that shape our health, our lives, and ultimately, our humanity.</p><p>Hosted by cardiologist Dr. Elie Haddad, each series explores a different question through the lenses of science, medicine, human experience and consciousness — looking beyond what we already know to examine the deeper forces shaping the way we live.</p></div>
    </section>
    <section className={styles.story}><div className={styles.storyIndex}><span>01</span><p>The first series</p></div><div className={styles.storyCopy}><p className={styles.eyebrow}>The Plastic Age</p><h2>The journey begins with plastic. It does not end there.</h2><p>Our first series, <strong>The Plastic Age</strong>, follows the remarkable story of how plastic transformed our world, entered our bodies, and became one of the defining challenges of our time.</p><p>Future series will venture beyond plastic into other questions of health, wellness, the environment and what it means to live consciously in a rapidly changing world.</p></div><aside className={styles.storyAside}><strong>Series, not episode feed</strong><p>This site introduces the larger podcast. Individual episodes remain on the listening platforms, where each series can be browsed in full.</p></aside></section>
    <section className={styles.listen} aria-labelledby="listen-title"><header><p className={styles.eyebrowLight}>Listen to Beyond Plastic</p><h2 id="listen-title">Choose your preferred platform.</h2></header><div className={styles.platformGrid}>{platforms.map((platform,index)=><TrackedLink key={platform.name} className={styles.platformCard} href={platform.href} eventName="cta_click" label={`podcast-${platform.name.toLowerCase().replace(/\s+/g,"-")}`} target="_blank" rel="noreferrer"><span>{String(index+1).padStart(2,"0")}</span><div><strong>{platform.name}</strong></div><b aria-hidden="true">↗</b></TrackedLink>)}</div></section>
    <section className={styles.bridge}><div><p className={styles.eyebrow}>One platform, several ways in</p><h2>Science is the foundation. Conversation expands the questions.</h2></div><div className={styles.bridgeLinks}><TrackedLink href="/science" eventName="cta_click" label="podcast-science">Explore the science <span>→</span></TrackedLink><TrackedLink href="/about-dr-elie-haddad" eventName="cta_click" label="podcast-about">Meet Dr. Haddad <span>→</span></TrackedLink></div></section>
  </main><Footer /></>;
}

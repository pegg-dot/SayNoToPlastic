import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { TrackedLink } from "../components/TrackedLink";
import styles from "./about.module.css";

const description = "Meet Elie R. Haddad, MD, the cardiologist and cardiac electrophysiologist behind Say No to Plastic and Homo Plasticus.";

export const metadata: Metadata = {
  title: "Dr. Elie R. Haddad | Say No to Plastic",
  description,
  alternates: { canonical: "/about-dr-elie-haddad" },
  openGraph: {
    title: "Dr. Elie R. Haddad | Say No to Plastic",
    description,
    url: "/about-dr-elie-haddad",
    siteName: "Say No to Plastic",
    type: "profile",
    images: [{ url: "/portrait.webp", width: 900, height: 1024, alt: "Elie R. Haddad, MD" }],
  },
  twitter: { card: "summary", title: "Dr. Elie R. Haddad | Say No to Plastic", description, images: ["/portrait.webp"] },
};

const story = [
  {
    title: "Clinical practice",
    body: "Cardiology and cardiac electrophysiology provided the starting point: seeing disease up close, treating it, and asking what might be missed upstream.",
  },
  {
    title: "A broader question",
    body: "The focus widened beyond treatment to the repeated influences that surround daily life: air, water, food, products, behavior, and the environments people move through over time.",
  },
  {
    title: "The microplastics inquiry",
    body: "Emerging research reporting plastic-derived material in human blood and tissues pushed that question further. Detection does not automatically prove disease, but it created a body of evidence worth explaining carefully.",
  },
  {
    title: "Public education",
    body: "The inquiry became Homo Plasticus, a TEDx talk, and Say No to Plastic—a place to translate evolving research into clear, practical guidance without overstating what science can prove.",
  },
];

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Elie R. Haddad, MD",
    jobTitle: "Cardiologist and cardiac electrophysiologist",
    description,
    url: "/about-dr-elie-haddad",
  };

  return (
    <>
      <Header skipToContent />
      <main id="main-content" className={styles.page} tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="about-title">
          <figure className={styles.portrait}>
            <div className={styles.portraitFrame}>
              <img src="/portrait.webp" width="900" height="1024" alt="Elie R. Haddad, MD, seated in an office wearing dark medical scrubs" />
            </div>
            <figcaption><span>Elie R. Haddad, MD</span><span>Cardiologist · Cardiac electrophysiologist</span></figcaption>
          </figure>

          <div className={styles.heroCopy}>
            <p className="eyebrow">Behind the science</p>
            <h1 id="about-title">Meet Dr. Elie Haddad</h1>
            <p className={styles.heroLead}>Dr. Elie R. Haddad is a cardiologist and cardiac electrophysiologist with more than two decades of clinical experience, as well as an author, educator, and TEDx speaker.</p>
            <p className={styles.heroLead}>Say No to Plastic grew from a physician&apos;s question: what environmental influences are we overlooking when illness appears earlier, more often, and in people who do not fit the expected pattern?</p>
            <div className={styles.credentials} aria-label="Professional roles">
              <span>Cardiologist</span><span>Cardiac electrophysiologist</span><span>Author</span><span>TEDx speaker</span>
            </div>
            <div className={styles.heroActions}>
              <a className="button gold" href="#why">Read his story <span>↓</span></a>
              <TrackedLink className={styles.textAction} href="/media" eventName="cta_click" label="about-media">Events &amp; Media <span>→</span></TrackedLink>
            </div>
          </div>
        </section>

        <section id="why" className={styles.reason} aria-labelledby="why-title">
          <p className={styles.sectionIndex}>01 · Why he cares</p>
          <div className={styles.sectionCopy}>
            <h2 id="why-title">The question started in the clinic.</h2>
            <p>Years of caring for people with cardiovascular disease made Dr. Haddad interested not only in how illness is treated, but why it develops and what might be preventable.</p>
            <p>That inquiry expanded from genetics and lifestyle to the world around us. Microplastics became one part of a much broader question about repeated environmental exposure across a lifetime.</p>
          </div>
        </section>

        <section className={styles.story} aria-labelledby="story-title">
          <div className={styles.storyHeading}>
            <div><p className={styles.sectionIndex}>02 · The path</p><h2 id="story-title">From cardiology to environmental inquiry.</h2></div>
            <p>The important part is the path, not a full CV: clinical work led to a broader question, the question led to research, and the research led to public education.</p>
          </div>
          <div className={styles.storyRows}>
            {story.map((item, index) => (
              <article className={styles.storyRow} key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="work-title">
          <div className={styles.closingCopy}>
            <p className={styles.sectionIndex}>03 · The work now</p>
            <h2 id="work-title">Translate the evidence. Keep the uncertainty visible.</h2>
            <p>Through Say No to Plastic, Dr. Haddad connects emerging human research with practical exposure-reduction guidance, while keeping detection, association, and causation separate.</p>
          </div>

          <nav className={styles.linkList} aria-label="Explore Dr. Haddad's work">
            <TrackedLink href="/science" eventName="cta_click" label="about-science">Explore the science <span>→</span></TrackedLink>
            <TrackedLink href="/homo-plasticus" eventName="cta_click" label="about-book">Explore Homo Plasticus <span>→</span></TrackedLink>
            <TrackedLink href="/media" eventName="cta_click" label="about-media-bottom">Events &amp; Media <span>→</span></TrackedLink>
          </nav>

          <details className={styles.deeper}>
            <summary>More about the approach</summary>
            <div className={styles.deeperBody}>
              <p>The larger frame is the exposome: the accumulated influence of air, water, food, products, lifestyle, genetics, nutrition, exercise, and age across a lifetime. It is a way to ask better questions about health, not an individual risk score.</p>
              <p>If you want that deeper framework, <a href="/science/exposome">explore the exposome →</a></p>
            </div>
          </details>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>
      <Footer />
    </>
  );
}

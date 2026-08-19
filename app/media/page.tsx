import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { TrackedLink } from "../components/TrackedLink";
import { SITE_URL } from "../config";
import styles from "./media.module.css";

const description = "Events, public appearances, the Homo Plasticus sculpture story, and press resources from Say No to Plastic.";
export const metadata: Metadata = {
  title: "Events & Media | Say No to Plastic",
  description,
  alternates: { canonical: "/media" },
  openGraph: { title: "Events & Media | Say No to Plastic", description, url: `${SITE_URL}/media`, siteName: "Say No to Plastic", type: "website", images: [{ url: "/media/homo-plasticus-full.webp", width: 672, height: 1536, alt: "Homo Plasticus sculpture" }] },
};

const storySteps = [
  ["01", "Attention", "An unfamiliar image interrupts the ordinary."],
  ["02", "Curiosity", "The visible fragments create a question."],
  ["03", "Science", "Evidence gives that question context, limits, and meaning."],
  ["04", "Memory", "Emotion gives the scientific message somewhere to stay."],
] as const;

export default function MediaPage() {
  return <><Header/><main id="main-content" tabIndex={-1} className="inner-page media-page">
    <section className={styles.sculptureFeature} aria-labelledby="homo-plasticus-sculpture-title">
      <div className={styles.sculptureGallery}>
        <figure className={styles.sculptureMain}><img src="/media/homo-plasticus-full.webp" width="672" height="1536" loading="eager" fetchPriority="high" alt="Homo Plasticus sculpture, a standing figure holding a fetus with visible plastic fragments embedded through the body"/></figure>
        <figure><img src="/media/homo-plasticus-detail-side.webp" width="792" height="1004" loading="lazy" alt="Side detail of the Homo Plasticus sculpture showing the figure holding the fetus"/></figure>
        <figure><img src="/media/homo-plasticus-detail-front.webp" width="784" height="1018" loading="lazy" alt="Frontal detail of the Homo Plasticus sculpture showing plastic fragments visible through the torso and fetus"/></figure>
      </div>
      <div className={styles.sculptureStory}>
        <p className="eyebrow">Homo Plasticus · The Silent Invasion of Human Health</p>
        <h1 id="homo-plasticus-sculpture-title">Art makes the invisible visible.</h1>
        <p>Scientific evidence can be difficult to hold onto when it stays abstract. <em>Homo Plasticus</em> turns an invisible problem into something a visitor can see, question, and remember.</p>
        <p>The sculpture depicts a woman holding a fetus, with visible plastic fragments embedded throughout both forms. The artwork is not presented as scientific evidence. It is the point of attention that makes someone want to understand the evidence.</p>
        <p>That curiosity is the bridge. Art opens the door; the science explains what has been detected, what remains uncertain, and what practical exposure reduction can look like.</p>
        <div className={styles.sculptureSequence}>{storySteps.map(([number,title,text])=><article key={number}><span>{number}</span><h2>{title}</h2><p>{text}</p></article>)}</div>
        <TrackedLink className="button gold" href="/science" eventName="cta_click" label="media-sculpture-science">Follow the science <span>→</span></TrackedLink>
      </div>
    </section>

    <section className="media-press-bridge ivory"><div><p className="eyebrow dark">For journalists &amp; producers</p><h2>Press resources in one place.</h2><p>Use the current biography, interview topics, project facts, evidence briefings, and available web assets for reporting or production.</p></div><div><a className="button navy" href="/media/press-kit">Open the press kit <span>→</span></a><a className="text-link dark-link" href="/contact">Contact the project <span>→</span></a></div></section>

    <section className="media-signup">
      <div><p className="eyebrow">Field Notes / Newsletter</p><h2>Coming soon.</h2><p>Research summaries, practical guidance, and new public work will be available by email once the mailing platform is connected.</p><small>No email addresses are being collected at launch.</small></div>
    </section>
  </main><Footer/></>;
}

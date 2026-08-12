import type { Metadata } from "next";
import { BOOK, SITE_URL } from "../config";
import { Footer, Header } from "../components/SiteChrome";
import { TrackedLink } from "../components/TrackedLink";
import { evidenceChapters, evidenceStudies, type EvidenceStudy } from "../content/evidence";
import { externalStandards } from "../site-data";
import { ScienceNavigator } from "./ScienceNavigator";
import { DetectionPrimer } from "../components/DetectionPrimer";
import { BodySystemLibrary } from "../components/BodySystemLibrary";
import { bodySystems } from "../content/body-systems";

const description = "A study-by-study human evidence record, body-system explainers, and detection methods for microplastics and nanoplastics.";

export const metadata: Metadata = {
  title: "Plastic in the Human Body: What the Studies Found | Say No to Plastic",
  description,
  alternates: { canonical: "/science" },
  openGraph: {
    title: "Plastic in the Human Body: What the Studies Found",
    description,
    url: `${SITE_URL}/science`,
    siteName: "Say No to Plastic",
    type: "article",
    images: [{ url: "/evidence.webp", width: 1536, height: 1024, alt: "Evidence about plastic in human blood and tissue" }],
  },
  twitter: { card: "summary_large_image", title: "Plastic in the Human Body: What the Studies Found", description, images: ["/evidence.webp"] },
};

const researchStudies = evidenceStudies.filter((study) => study.studyType !== "Anatomical context");

const scienceChapterVisuals: Partial<Record<(typeof evidenceChapters)[number]["id"], { src: string; alt: string; width: number; height: number }>> = {
  blood: {
    src: "/images/science/blood.webp",
    alt: "Stylized illustration of human blood cells with suspended particles.",
    width: 372,
    height: 269,
  },
  brain: {
    src: "/images/science/brain.webp",
    alt: "Stylized illustration of a human brain with suspended particles.",
    width: 370,
    height: 279,
  },
  "heart-arteries": {
    src: "/images/science/heart.webp",
    alt: "Stylized illustration of a human heart and surrounding vessels with suspended particles.",
    width: 372,
    height: 279,
  },
  placenta: {
    src: "/images/science/placenta.webp",
    alt: "Stylized illustration of a placenta and branching vessels with suspended particles.",
    width: 372,
    height: 279,
  },
  ovary: {
    src: "/images/science/ovary.webp",
    alt: "Stylized illustration of a human ovary with visible follicles and suspended particles.",
    width: 372,
    height: 269,
  },
  "testicular-tissue": {
    src: "/images/science/testicular-tissue.webp",
    alt: "Stylized cross-sectional illustration of human testicular tissue with suspended particles.",
    width: 370,
    height: 269,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/science#page`,
  url: `${SITE_URL}/science`,
  name: "Plastic in the Human Body: What the Studies Found",
  description,
  dateModified: "2026-08-05",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: researchStudies.length,
    itemListElement: researchStudies.map((study, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ScholarlyArticle",
        name: study.headline,
        datePublished: study.year,
        isPartOf: { "@type": "Periodical", name: study.journal },
        url: study.source,
        sameAs: study.doi ? `https://doi.org/${study.doi}` : study.source,
      },
    })),
  },
};

function StudyDetails({ study }: { study: EvidenceStudy }) {
  const isContext = study.studyType === "Anatomical context";
  return (
    <details className="science-v2-details">
      <summary>{isContext ? "How the anatomy works" : "How the study was done"}<span aria-hidden="true">+</span></summary>
      <div className="science-v2-details-body">
        <dl>
          <div><dt>{isContext ? "System" : "Study"}</dt><dd>{study.studyType}</dd></div>
          <div><dt>{isContext ? "Structures" : "Sample"}</dt><dd>{study.sample}</dd></div>
          <div><dt>Method</dt><dd>{study.method}</dd></div>
          <div><dt>{isContext ? "Reference" : "Published"}</dt><dd>{study.year} · {study.journal}</dd></div>
        </dl>
        <p><strong>{isContext ? "What this explains" : "Study limits"}</strong>{study.limits}</p>
      </div>
    </details>
  );
}

function Study({ study, chapterNumber, studyNumber = 0 }: { study: EvidenceStudy; chapterNumber: number; studyNumber?: number }) {
  const isContext = study.studyType === "Anatomical context";
  return (
    <section className={`science-v2-study${isContext ? " science-v2-study-context" : ""}`} aria-labelledby={`${study.id}-title`}>
      {studyNumber > 0 && <p className="science-v2-substudy">Study {studyNumber} of 2</p>}
      <h3 id={`${study.id}-title`}>{study.headline}</h3>
      <div className="science-v2-result">
        <p className="science-v2-stat"><strong>{study.stat}</strong><span>{study.statLabel}</span></p>
        <div className="science-v2-explanation">
          <p><span>{isContext ? "How it works" : "What researchers found"}</span>{study.finding}</p>
          <p><span>Why it matters</span>{study.meaning}</p>
        </div>
      </div>
      <StudyDetails study={study} />
      <TrackedLink
        className="science-v2-source"
        href={study.source}
        eventName="outbound_source"
        label={`science-${study.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{isContext ? "Open the anatomical reference" : "Read the original study"}<small>{study.journal} · {study.year}</small></span>
        <b aria-hidden="true">↗</b>
      </TrackedLink>
      <span className="science-v2-watermark" aria-hidden="true">{String(chapterNumber).padStart(2, "0")}</span>
    </section>
  );
}

export default function SciencePage() {
  return (
    <>
      <Header skipToContent />
      <main id="main-content" tabIndex={-1} className="science-v2">
        <section className="science-v2-hero" aria-labelledby="science-title">
          <img
            className="science-v2-hero-figure"
            src="/images/science/science-body-overview.webp"
            width="1148"
            height="767"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <div className="science-v2-hero-grid" aria-hidden="true" />
          <div className="science-v2-hero-copy">
            <p className="eyebrow"><span />The human evidence</p>
            <h1 id="science-title">Plastic has been found throughout the human body.</h1>
            <p className="science-v2-hero-deck">Here is what researchers actually found—in plain language, with the numbers, the study limits, and every original paper.</p>
          </div>
          <dl className="science-v2-hero-facts">
            <div><dt>07</dt><dd>Human research studies</dd></div>
            <div><dt>07</dt><dd>Body-system overviews</dd></div>
            <div><dt>100%</dt><dd>Original papers linked</dd></div>
          </dl>
        </section>

        <ScienceNavigator chapters={evidenceChapters.map(({ id, navLabel }) => ({ id, navLabel }))} />

        <DetectionPrimer />

        <section className="science-v2-reading" aria-label="Human evidence chapters">
          <header className="science-v2-reading-intro">
            <p className="eyebrow dark">Finding by finding</p>
            <h2>What the studies found—and why people are paying attention.</h2>
            <p>Detection is not the same as diagnosis. But these findings establish something important: plastic-derived material has reached human blood, brain, arteries, placenta and reproductive tissue.</p>
          </header>
          {evidenceChapters.map((chapter, chapterIndex) => {
            const chapterVisual = scienceChapterVisuals[chapter.id];
            return (
            <article id={chapter.id} className={`science-v2-chapter${chapter.id === "pregnancy" ? " science-v2-chapter-context" : ""}`} key={chapter.id}>
              <header className="science-v2-chapter-heading">
                <p><span>{String(chapterIndex + 1).padStart(2, "0")}</span>{chapter.eyebrow}</p>
                <h2>{chapter.title}</h2>
                {chapter.introduction && <p>{chapter.introduction}</p>}
                {chapterVisual && (
                  <figure className="science-v2-chapter-visual">
                    <img
                      src={chapterVisual.src}
                      width={chapterVisual.width}
                      height={chapterVisual.height}
                      loading="lazy"
                      alt={chapterVisual.alt}
                    />
                  </figure>
                )}
              </header>
              <div className="science-v2-chapter-studies">
                {chapter.studies.map((study, studyIndex) => <Study key={study.id} study={study} chapterNumber={chapterIndex + 1} studyNumber={chapter.studies.length > 1 ? studyIndex + 1 : 0} />)}
              </div>
            </article>
            );
          })}
        </section>

        <div id="body-system-overviews">
          <BodySystemLibrary
            items={bodySystems}
            heading="Explore the body system by system."
            intro="Open an overview when you want the broader biological context around a study. The detailed source record stays with each topic."
          />
        </div>

        <section className="science-v2-context" aria-labelledby="science-context-title">
          <header>
            <p className="eyebrow dark">The wider context</p>
            <h2 id="science-context-title">How public-health institutions frame the evidence.</h2>
          </header>
          <div className="science-v2-context-links">
            {externalStandards.map((source, index) => (
              <TrackedLink key={source.href} href={source.href} eventName="outbound_source" label={`science-authority-${source.label}`} target="_blank" rel="noopener noreferrer">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><small>{source.label}</small><strong>{source.title}</strong></div>
                <b aria-hidden="true">↗</b>
              </TrackedLink>
            ))}
          </div>
        </section>

        <section className="science-v2-next" aria-labelledby="science-next-title">
          <p className="eyebrow"><span />From evidence to action</p>
          <h2 id="science-next-title">Use less plastic. Start with the routines you repeat.</h2>
          <p>The action can stay simple. Open the practical plan, or continue the full investigation in <em>{BOOK.title}</em>.</p>
          <div>
            <TrackedLink className="button gold" href="/solutions" eventName="cta_click" label="science-solutions">See practical actions <span>→</span></TrackedLink>
            <TrackedLink className="text-link" href="/homo-plasticus" eventName="view_book" label="science-book">Explore the book <span>↗</span></TrackedLink>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

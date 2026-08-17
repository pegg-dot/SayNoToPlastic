import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { SITE_URL } from "../../config";
import { getGuide, guides } from "../../content/guides";
import { getGuideScienceConnections } from "../../content/science-connections";
import styles from "./guide.module.css";

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Say No to Plastic`,
    description: guide.description,
    alternates: { canonical: `/resources/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.description, type: "article", url: `${SITE_URL}/resources/${guide.slug}` },
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const published = guide.publishedDate || "2026-08-03";
  const updated = guide.updatedDate || published;
  const related = [
    ...guides.filter((item) => item.slug !== guide.slug && item.category === guide.category),
    ...guides.filter((item) => item.slug !== guide.slug && item.category !== guide.category),
  ].slice(0, 3);
  const scienceConnections = getGuideScienceConnections(guide.category).slice(0, 2);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: published,
    dateModified: updated,
    author: { "@type": "Organization", name: "Say No to Plastic" },
    publisher: { "@type": "Organization", name: "Say No to Plastic" },
    mainEntityOfPage: `${SITE_URL}/resources/${guide.slug}`,
  };

  return <><Header/><main id="main-content" tabIndex={-1} className={`${styles.guidePage} guide-page guide-page-v25 guide-page-v26`}>
    <header className="guide-hero guide-hero-v25">
      <div className={styles.heroCopy}>
        <p className="eyebrow">{guide.category} field guide</p>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
      </div>
      <aside className={styles.heroMeta} aria-label="Guide details">
        <div><span>Read</span><strong>{guide.readingTime}</strong></div>
        <div><span>Updated</span><strong>{formatDate(updated)}</strong></div>
        <a href="/editorial-policy">How we source guides →</a>
      </aside>
    </header>

    <article className="guide-article guide-article-v25">
      <nav className="guide-inline-nav" aria-label="In this guide">
        <strong>In this guide</strong>
        <a href="#bottom-line">Bottom line</a>
        <a href="#evidence">Evidence</a>
        <a href="#actions">What to do</a>
        <a href="#sources">Sources</a>
      </nav>

      <div className="guide-reading-column">
        <section id="bottom-line" className="guide-lead-v25">
          <p className="eyebrow dark">Bottom line</p>
          <p>{guide.takeaway}</p>
        </section>

        <section id="evidence" className={`${styles.evidenceGrid} guide-prose-section`}>
          <div className={styles.evidenceColumn}>
            <p className="eyebrow dark">The evidence</p>
            <h2>What the evidence supports</h2>
            <div className="guide-prose-copy">
              {guide.known.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>

          <div className={styles.uncertaintyColumn}>
            <p className="eyebrow dark">Where the evidence stops</p>
            <h3>What remains uncertain</h3>
            <div className="guide-prose-copy">
              {guide.uncertain.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
        </section>

        <section id="actions" className="guide-prose-section guide-actions-v25">
          <p className="eyebrow dark">Practical response</p>
          <h2>What you can do now</h2>
          <ol>{guide.actions.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
        </section>

        {scienceConnections.length > 0 && <aside className="guide-deeper-science-v25">
          <div><p className="eyebrow dark">Want the deeper science?</p><p>These pages explain the related evidence in more detail.</p></div>
          <nav aria-label="Related science">{scienceConnections.map((connection) => <TrackedLink key={connection.href} href={connection.href} eventName="science_topic_open" label={`guide-${guide.slug}-science-${connection.href}`}>{connection.title} <span>→</span></TrackedLink>)}</nav>
        </aside>}

        <details id="sources" className="guide-sources-disclosure guide-sources-v25">
          <summary>Sources and further reading <span aria-hidden="true">+</span></summary>
          <div>{guide.sources.map((source, index) => <TrackedLink href={source.href} eventName={source.href.startsWith("http") ? "outbound_source" : "cta_click"} label={`guide-${guide.slug}-source-${index + 1}`} key={source.href} target={source.href.startsWith("http") ? "_blank" : undefined} rel={source.href.startsWith("http") ? "noreferrer" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{source.label}</b><p>{source.title}</p></div><strong>↗</strong></TrackedLink>)}</div>
        </details>

        <aside className="medical-note medical-note-v25"><strong>General education</strong><p>This guide cannot diagnose, treat, or replace advice from a qualified healthcare professional.</p><a href="/medical-disclaimer">Medical disclaimer →</a></aside>
      </div>
    </article>

    <section className="related-guides related-guides-v25 ivory">
      <div className="related-guides-heading"><p className="eyebrow dark">Keep going</p><h2>Related guides</h2></div>
      <div className="related-guide-links-v25">{related.map((item) => <TrackedLink href={`/resources/${item.slug}`} eventName="resource_open" label={`guide-${guide.slug}-related-${item.slug}`} key={item.slug}><span>{item.category}</span><strong>{item.title}</strong><b>→</b></TrackedLink>)}</div>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
  </main><Footer/></>;
}

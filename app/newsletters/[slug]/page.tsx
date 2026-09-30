import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components/SiteChrome";
import { getPublishedNewsletter } from "../../lib/newsletters";
import styles from "../newsletters.module.css";

export const dynamic = "force-dynamic";

function displayDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

export async function generateMetadata(context: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await context.params;
  const newsletter = await getPublishedNewsletter(slug);
  if (!newsletter) return { title: "Field Notes | Say No To Plastic" };
  return {
    title: `${newsletter.title} | Field Notes`,
    description: newsletter.excerpt || "A Field Note from Dr. Elie Haddad and Say No To Plastic.",
    alternates: { canonical: `/newsletters/${newsletter.slug}` },
  };
}

export default async function NewsletterPage(context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const newsletter = await getPublishedNewsletter(slug);
  if (!newsletter) notFound();

  return <><Header /><main id="main-content" tabIndex={-1} className={styles.articlePage}>
    <article className={styles.article}>
      <header className={styles.articleHeader}>
        <a href="/newsletters" className={styles.back}>← Field Notes archive</a>
        <p className={styles.eyebrow}>Field Notes</p>
        <h1>{newsletter.title}</h1>
        {newsletter.publishedAt ? <time dateTime={newsletter.publishedAt}>{displayDate(newsletter.publishedAt)}</time> : null}
      </header>
      <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: newsletter.contentHtml }} />
      <footer className={styles.articleFooter}>
        <strong>Dr. Elie Haddad</strong>
        <span>Say No To Plastic</span>
        <a href="/newsletters">More Field Notes →</a>
      </footer>
    </article>
  </main><Footer /></>;
}

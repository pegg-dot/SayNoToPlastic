import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { SignupForm } from "../components/SignupForm";
import { listPublishedNewsletters } from "../lib/newsletters";
import styles from "./newsletters.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Field Notes | Say No To Plastic",
  description: "Read Field Notes from Dr. Elie Haddad on plastic exposure, emerging research, and practical ways to reduce repeated exposure.",
  alternates: { canonical: "/newsletters" },
};

function displayDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

export default async function NewslettersPage() {
  const newsletters = await listPublishedNewsletters();

  return <><Header /><main id="main-content" tabIndex={-1} className={styles.page}>
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Field Notes</p>
      <h1>Research worth understanding. Practical steps worth taking.</h1>
      <p>Notes from Dr. Elie Haddad on emerging plastic-health research, what the evidence can and cannot show, and practical ways to reduce repeated exposure.</p>
    </section>

    <section className={styles.archive} aria-labelledby="archive-title">
      <div className={styles.archiveHeading}>
        <div><p className={styles.eyebrowDark}>Archive</p><h2 id="archive-title">Latest Field Notes</h2></div>
        <span>{newsletters.length} published issue{newsletters.length === 1 ? "" : "s"}</span>
      </div>
      {newsletters.length ? <div className={styles.grid}>
        {newsletters.map((newsletter) => <article className={styles.card} key={newsletter.id}>
          <div className={styles.cardMeta}><span>Field Notes</span>{newsletter.publishedAt ? <time dateTime={newsletter.publishedAt}>{displayDate(newsletter.publishedAt)}</time> : null}</div>
          <h3><a href={`/newsletters/${newsletter.slug}`}>{newsletter.title}</a></h3>
          {newsletter.excerpt ? <p>{newsletter.excerpt}</p> : null}
          <a className={styles.readLink} href={`/newsletters/${newsletter.slug}`}>Read this issue <span>→</span></a>
        </article>)}
      </div> : <div className={styles.empty}><h3>Field Notes are on the way.</h3><p>New issues will appear here as they are published.</p></div>}
    </section>

    <section className={styles.signup}>
      <div><p className={styles.eyebrow}>Field Notes / Newsletter</p><h2>Get new issues by email.</h2><p>Research summaries, practical exposure-reduction guidance, and updates from Say No To Plastic.</p></div>
      <SignupForm compact buttonLabel="Join Field Notes" successTitle="You’re in." successText="You’re subscribed. No confirmation email is required." />
    </section>
  </main><Footer /></>;
}

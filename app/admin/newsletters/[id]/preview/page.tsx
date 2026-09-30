import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminUser } from "../../../lib/admin-auth";
import { getNewsletterById } from "../../../lib/newsletters";
import styles from "./preview.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Newsletter Preview | Say No To Plastic", robots: { index: false, follow: false } };

export default async function NewsletterPreview(context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return <main className={styles.locked}><p>Admin access required.</p></main>;
  const { id: rawId } = await context.params;
  const newsletter = await getNewsletterById(Number(rawId));
  if (!newsletter) notFound();

  return <main className={styles.page}>
    <div className={styles.previewBar}><div><strong>Private preview</strong><span>{newsletter.published ? "Published" : "Not published yet"}</span></div><a href="/admin">Back to website manager</a></div>
    <article className={styles.article}>
      <header><p>FIELD NOTES</p><h1>{newsletter.title}</h1></header>
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: newsletter.contentHtml }} />
      <footer><strong>Dr. Elie Haddad</strong><span>Say No To Plastic</span></footer>
    </article>
  </main>;
}

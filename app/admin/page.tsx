import type { Metadata } from "next";
import { getAdminUser, adminAllowlist } from "../lib/admin-auth";
import { ADMIN_CONTENT_FIELDS, listAdminContent, listAdminContentRevisions } from "../lib/admin-content";
import { AdminPanel } from "./AdminPanel";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner Admin | Say No to Plastic",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className={styles.locked}>
        <section>
          <p className={styles.eyebrow}>Say No To Plastic</p>
          <h1>Owner admin</h1>
          <p>This area requires the protected Cloudflare Access login.</p>
          <p className={styles.small}>Only approved owner accounts can enter. If you should have access, open this page through the protected saynotoplastic.com/admin route.</p>
        </section>
      </main>
    );
  }

  let content: Awaited<ReturnType<typeof listAdminContent>>;
  let revisions: Awaited<ReturnType<typeof listAdminContentRevisions>>;
  try {
    [content, revisions] = await Promise.all([
      listAdminContent(),
      listAdminContentRevisions(),
    ]);
  } catch (error) {
    console.error("admin_page_content_failed", error);
    return (
      <main className={styles.locked}>
        <section>
          <p className={styles.eyebrow}>Authenticated as {user.email}</p>
          <h1>Admin database setup required</h1>
          <p>The protected login is working, but the owner-content database migration still needs to be applied before changes can be saved.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Say No To Plastic · Owner workspace</p>
          <h1>Site admin</h1>
          <p>Keep the public site current without touching code. Update homepage messaging, appearances, TEDx, Beyond Plastic, and press information from one protected workspace.</p>
        </div>
        <aside>
          <span>Signed in</span>
          <strong>{user.email}</strong>
          <small>{adminAllowlist().length} approved owner accounts</small>
          <a href="/" target="_blank" rel="noreferrer">Open live site ↗</a>
        </aside>
      </header>

      <section className={styles.safety}>
        <strong>Owner editing with guardrails</strong>
        <p>Changes are plain text or validated links, versioned automatically, and recorded with the editor email. Scientific evidence, medical claims, hosting, payments, deployments, source code, and API credentials remain developer-controlled.</p>
      </section>

      <AdminPanel fields={ADMIN_CONTENT_FIELDS} initialContent={content} initialRevisions={revisions} />

      <footer className={styles.footer}>
        <a href="/">Return to Say No To Plastic</a>
        <span>Protected owner admin · noindex · revision history enabled</span>
      </footer>
    </main>
  );
}

import type { Metadata } from "next";
import { getAdminUser, adminAllowlist } from "../lib/admin-auth";
import { ADMIN_CONTENT_FIELDS, listAdminContent, listAdminContentRevisions } from "../lib/admin-content";
import { getAdminDashboardMetrics } from "../lib/admin-metrics";
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
          <h1>Site manager</h1>
          <p>This private page is for approved Say No To Plastic owners.</p>
          <p className={styles.small}>Open saynotoplastic.com/admin and sign in with one of the approved email accounts.</p>
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
          <p className={styles.eyebrow}>Signed in as {user.email}</p>
          <h1>One setup step remains</h1>
          <p>Your login is working, but the owner-content database still needs its setup migration before this page can save changes.</p>
        </section>
      </main>
    );
  }

  const metrics = await getAdminDashboardMetrics();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Say No To Plastic · Private site manager</p>
          <h1>Welcome back.</h1>
          <p>Use this page to update the parts of the website you manage. Choose a task below, make the change, and click save when you are ready for it to appear on the live site.</p>
        </div>
        <aside>
          <span>Signed in as</span>
          <strong>{user.email}</strong>
          <small>{adminAllowlist().length} approved owner accounts</small>
          <a href="/" target="_blank" rel="noreferrer">Open live website ↗</a>
        </aside>
      </header>

      <section className={styles.safety}>
        <strong>You cannot accidentally edit the science or technical setup here.</strong>
        <p>This workspace only exposes approved public text, links, events, TEDx, podcast, and press information. Saved text and link changes keep a history so they can be restored later.</p>
      </section>

      <AdminPanel fields={ADMIN_CONTENT_FIELDS} initialContent={content} initialRevisions={revisions} metrics={metrics} />

      <footer className={styles.footer}>
        <a href="/" target="_blank" rel="noreferrer">Open Say No To Plastic ↗</a>
        <span>Private owner workspace · changes are versioned</span>
      </footer>
    </main>
  );
}

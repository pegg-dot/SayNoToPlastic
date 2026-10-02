import type { Metadata } from "next";
import { getAdminUser, adminAllowlist } from "../lib/admin-auth";
import { ADMIN_CONTENT_FIELDS, listAdminContent, listAdminContentRevisions } from "../lib/admin-content";
import { getAdminDashboardMetrics } from "../lib/admin-metrics";
import { AdminPanel } from "./AdminPanel";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Website Manager | Say No to Plastic",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className={styles.locked}>
        <section>
          <p className={styles.eyebrow}>Say No To Plastic</p>
          <h1>Website manager</h1>
          <p>This is a private page for approved site owners.</p>
          <p className={styles.small}>Sign in with your approved owner email. You do not need a Cloudflare account. If you need step-by-step help, open <a href="/owner-login">the owner sign-in guide</a>.</p>
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
          <p>Your login is working, but the website manager database is not ready yet.</p>
        </section>
      </main>
    );
  }

  const metrics = await getAdminDashboardMetrics();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Say No To Plastic · Private</p>
          <h1>Website manager</h1>
          <p>Manage the public website without touching code. Changes only go live when you use an explicit publish or update button.</p>
        </div>
        <aside>
          <a href="/" target="_blank" rel="noreferrer">View live website ↗</a>
          <div>
            <span>Signed in as</span>
            <strong>{user.email}</strong>
            <small>{adminAllowlist().length} approved accounts</small>
          </div>
        </aside>
      </header>

      <AdminPanel fields={ADMIN_CONTENT_FIELDS} initialContent={content} initialRevisions={revisions} metrics={metrics} />

      <footer className={styles.footer}>
        <a href="/" target="_blank" rel="noreferrer">Open Say No To Plastic ↗</a>
        <span>Private owner page</span>
      </footer>
    </main>
  );
}

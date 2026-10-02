import type { Metadata } from "next";
import styles from "./owner-login.module.css";

export const metadata: Metadata = {
  title: "Website Manager Sign-in | Say No to Plastic",
  robots: { index: false, follow: false },
};

export default function OwnerLoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Say No To Plastic · Private owner access</p>
        <h1>Sign in to manage the website.</h1>
        <p className={styles.lead}>
          You do not need to learn Cloudflare or use GitHub. The website manager is protected by a secure email-code sign-in.
        </p>

        <ol className={styles.steps}>
          <li><span>1</span><div><strong>Open the website manager</strong><p>Use the button below. A secure Cloudflare Access sign-in screen will open.</p></div></li>
          <li><span>2</span><div><strong>Use your approved email</strong><p>Enter <b>DrElieBeyondPlastic@gmail.com</b> and choose the one-time PIN / email-code option.</p></div></li>
          <li><span>3</span><div><strong>Enter the code from your inbox</strong><p>Cloudflare emails a short-lived code. Enter it and you will return directly to the website manager.</p></div></li>
        </ol>

        <a className={styles.button} href="/admin">Open website manager <span aria-hidden="true">→</span></a>

        <div className={styles.help}>
          <strong>If you do not see a one-time PIN option</strong>
          <p>Do not create a Cloudflare account. Contact Nate so the email-code login can be enabled for your address.</p>
        </div>

        <p className={styles.note}>
          If a code does not arrive, check spam for mail from <b>noreply@notify.cloudflare.com</b> and request a fresh code.
        </p>
      </section>
    </main>
  );
}

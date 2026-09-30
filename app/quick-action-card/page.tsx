import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { TrackedLink } from "../components/TrackedLink";
import { PrintButton } from "../components/PrintButton";
import { authoredCardRemember, authoredQuickActionCard, coreRules } from "../content/actions";
import { getAdminContentValues } from "../lib/admin-content";

export const metadata: Metadata = {
  title: "Quick Action Card | Say No to Plastic",
  description: "The 12 immediate steps and three core rules from Homo Plasticus, reproduced as accessible live text.",
  alternates: { canonical: "/quick-action-card" },
};

export default async function QuickActionCardPage() {
  const ownerCopy = await getAdminContentValues(["guides.hero_title", "guides.hero_body"]);
  const heroTitle = ownerCopy["guides.hero_title"] || "Quick Action Card";
  const heroBody = ownerCopy["guides.hero_body"] || "Start with the three core rules. The 12-step card below preserves Dr. Haddad's authored wording rather than replacing it with a different checklist.";
  return <><Header skipToContent /><main id="main-content" tabIndex={-1} className="quick-card-page">
    <section className="quick-card-intro">
      <p className="eyebrow">From Homo Plasticus · page 121</p>
      <h1>{heroTitle}</h1>
      <p>{heroBody}</p>
      <div>
        <PrintButton>Print or save as PDF <span>↗</span></PrintButton>
        <TrackedLink href="/solutions" eventName="cta_click" label="quick-card-back-to-solutions" className="text-link">Choose one change to begin <span>→</span></TrackedLink>
        <TrackedLink href="/solutions/reduce-exposure" eventName="cta_click" label="quick-card-full-exposure-guide" className="text-link">Read the fuller exposure guide <span>→</span></TrackedLink>
      </div>
    </section>

    <article className="quick-card-sheet" aria-labelledby="quick-card-sheet-title">
      <header>
        <p>Quick Action Card</p>
        <h2 id="quick-card-sheet-title">12 Immediate Steps to Protect Yourself from Microplastics</h2>
        <span>Author text reproduced from <em>Homo Plasticus</em>, page 121.</span>
      </header>

      <ol className="quick-card-authored-list">
        {authoredQuickActionCard.map((action) => <li key={action.number}>
          <span>{action.number}</span>
          <div>
            <strong>{action.text}</strong>
            {action.reviewNote && <small>{action.reviewNote}</small>}
          </div>
        </li>)}
      </ol>

      <section className="quick-card-core-rules" aria-labelledby="core-rules-title">
        <p id="core-rules-title">The 3 Core Rules</p>
        <ul>{coreRules.map((rule) => <li key={rule.number}><strong>{rule.title}</strong></li>)}</ul>
      </section>

      <footer className="quick-card-remember">
        <strong>Remember</strong>
        {authoredCardRemember.map((line) => <p key={line}>{line}</p>)}
      </footer>
    </article>

  </main><Footer /></>;
}

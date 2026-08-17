import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { TrackedLink } from "../components/TrackedLink";
import { ActionPlanner } from "../components/ActionPlanner";
import { coreRules } from "../content/actions";
import { reduceExposureGroups } from "../content/haddad-topics";

const description = "A simple starting point for using less plastic around drinking water, food, heat, storage, and everyday products.";
export const metadata: Metadata = {
  title: "Practical Action | Say No to Plastic",
  description,
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Practical Action | Say No to Plastic",
    description,
    url: "/solutions",
    siteName: "Say No to Plastic",
    type: "website",
    images: [{ url: "/kitchen.webp", width: 1536, height: 1024, alt: "Practical lower-plastic choices in the kitchen" }],
  },
  twitter: { card: "summary_large_image", title: "Practical Action | Say No to Plastic", description, images: ["/kitchen.webp"] },
};

export default function SolutionsPage() {
  return <>
    <Header skipToContent />
    <main id="main-content" tabIndex={-1} className="solutions-v2">
      <section className="solutions-hero">
        <div>
          <p className="eyebrow">Practical action</p>
          <h1>First: use less plastic.</h1>
          <p>Do not overcomplicate the first step. Choose less plastic when a practical alternative exists, especially around hot food, drinks, storage, and the products you use every day.</p>
          <div className="solutions-hero-actions">
            <a className="button gold" href="#first-three">See where to start <span>↓</span></a>
            <TrackedLink className="text-link" href="/quick-action-card" eventName="cta_click" label="solutions-quick-card-hero">Open the 12-step card <span>→</span></TrackedLink>
          </div>
        </div>
        <aside>
          <span>Dr. Haddad’s approach</span>
          <strong>Keep it simple.</strong>
          <p>Use less plastic where you can, start with what repeats, and make one practical change at a time.</p>
        </aside>
      </section>

      <section id="first-three" className="solutions-core">
        <header>
          <p className="eyebrow">The three core rules</p>
          <h2>Make the first action unmistakable.</h2>
          <p>Don’t heat plastic. Don’t store food in plastic. Don’t drink from plastic.</p>
        </header>
        <ol>{coreRules.map((rule) => <li key={rule.number}><span>{rule.number}</span><h3>{rule.title}</h3><p>{rule.detail}</p></li>)}</ol>
      </section>

      <section className="solutions-direct ivory" aria-labelledby="solutions-direct-title">
        <div className="solutions-direct-inner">
          <div className="solutions-direct-lead">
            <figure className="solutions-kitchen-figure">
              <picture>
                <source media="(max-width: 767px)" srcSet="/kitchen-mobile.webp" />
                <img src="/kitchen-desktop.webp" width="1536" height="1024" loading="lazy" alt="A lower-plastic kitchen with a stainless reverse-osmosis unit, glass storage, steel drinkware, wood utensils, and cast iron" />
              </picture>
              <figcaption>Start with the materials you touch every day: drinking water, storage, utensils, cups, plates, and hot food.</figcaption>
            </figure>
            <div className="solutions-direct-copy">
              <p className="eyebrow dark">Start in the kitchen</p>
              <h2 id="solutions-direct-title">Three direct changes, with the details separated into guides.</h2>
            </div>
          </div>

          <div className="solutions-direct-grid">
            <TrackedLink href="/resources/microplastics-drinking-water-filter-guide" eventName="cta_click" label="solutions-direct-water">
              <span>01 · Water</span><h3>Avoid routine plastic bottles.</h3><p>Use glass or stainless steel. Compare reverse osmosis and other filters with your local water and maintenance needs.</p><b>Open the water guide →</b>
            </TrackedLink>
            <TrackedLink href="/resources/plastic-kitchen-conversion" eventName="cta_click" label="solutions-direct-kitchen">
              <span>02 · Kitchen</span><h3>Replace the plastic used around heat and food.</h3><p>Start with storage, drinkware, utensils, plates, cups, and the items used every day.</p><b>Open the kitchen guide →</b>
            </TrackedLink>
            <TrackedLink href="/resources/single-use-plastic-foodware" eventName="cta_click" label="solutions-direct-single-use">
              <span>03 · Single-use</span><h3>Reduce disposable plastic foodware where practical.</h3><p>Focus on cups, plates, utensils, takeout containers, and the recurring event or meal that creates the most waste.</p><b>Open the single-use guide →</b>
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="solutions-exposure-framework" aria-labelledby="solutions-exposure-title">
        <header>
          <p className="eyebrow">Beyond the first three rules</p>
          <h2 id="solutions-exposure-title">Use less plastic. Build from there.</h2>
          <p>This is about reduction, not perfection. Apply the same simple approach across food, water, indoor air, clothing, personal care, and the habits that repeat for years.</p>
          <TrackedLink className="button outline" href="/solutions/reduce-exposure" eventName="cta_click" label="solutions-full-reduce-exposure">Read the complete exposure-reduction guide <span>→</span></TrackedLink>
        </header>
        <div>
          {reduceExposureGroups.slice(1).map((group) => (
            <article key={group.id}>
              <span>{group.number}</span>
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
              <ul>{group.actions.slice(0, 3).map((action) => <li key={action}>{action}</li>)}</ul>
              <TrackedLink href={`/solutions/reduce-exposure#${group.id}`} eventName="cta_click" label={`solutions-framework-${group.id}`}>Open this priority <b>→</b></TrackedLink>
            </article>
          ))}
        </div>
      </section>

      <div id="planner"><ActionPlanner /></div>

      <section className="solutions-next">
        <div>
          <p className="eyebrow">More detail, when you need it</p>
          <h2>Start with one change. Go deeper when you need to.</h2>
          <p>Use the full action card for a checklist, the guides for specific questions, or the science record for the evidence behind the recommendations.</p>
        </div>
        <div>
          <TrackedLink href="/solutions/reduce-exposure" eventName="cta_click" label="solutions-reduce-exposure-bottom">Read the complete exposure-reduction guide <span>→</span></TrackedLink>
          <TrackedLink href="/quick-action-card" eventName="cta_click" label="solutions-quick-card-bottom">See all 12 actions <span>→</span></TrackedLink>
          <TrackedLink href="/resources" eventName="cta_click" label="solutions-guides">Open the guides <span>→</span></TrackedLink>
          <TrackedLink href="/science" eventName="cta_click" label="solutions-science">Explore the science <span>→</span></TrackedLink>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}

import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { FeatureVideo } from "../components/FeatureVideo";
import { TrackedLink } from "../components/TrackedLink";
import { toVideoFeature } from "../content/media-content";
import { getEffectiveTedxEntry } from "../lib/publication-overrides";
import { getAdminContentValues } from "../lib/admin-content";

export const dynamic = "force-dynamic";

const title = "The Invisible Inheritance of Nanoplastics";
const description = "Dr. Elie Haddad's TEDxMiami talk on microplastics, nanoplastics, human health, and the relationship between the world around us and the world within us.";

export const metadata: Metadata = {
  title: `${title} | TEDxMiami | Say No to Plastic`,
  description,
  alternates: { canonical: "/tedx", languages: { "en-US": "/tedx", "es-US": "/es/tedx" } },
  openGraph: {
    title: `${title} | Dr. Elie Haddad | TEDxMiami`,
    description,
    url: "/tedx",
    siteName: "Say No to Plastic",
    type: "website",
    images: [{ url: "/tedx.webp", width: 1536, height: 1024, alt: "Dr. Elie Haddad speaking on a TEDxMiami stage" }],
  },
  twitter: { card: "summary_large_image", title: `${title} | Dr. Elie Haddad | TEDxMiami`, description, images: ["/tedx.webp"] },
};

export default async function TedxPage() {
  const [entry, ownerCopy] = await Promise.all([
    getEffectiveTedxEntry(),
    getAdminContentValues(["tedx.story_title", "tedx.story_body_primary", "tedx.story_body_secondary"]),
  ]);
  const video = entry ? toVideoFeature(entry) : null;
  const storyTitle = ownerCopy["tedx.story_title"] || "What if one of the greatest environmental stories of our time is no longer only happening around us, but within us?";
  const storyBodyPrimary = ownerCopy["tedx.story_body_primary"] || "In The Invisible Inheritance of Nanoplastics, Dr. Elie Haddad explores the emerging science of micro- and nanoplastics in the human body and asks us to reconsider the boundary between environmental health and human health.";
  const storyBodySecondary = ownerCopy["tedx.story_body_secondary"] || "Drawing from medicine, scientific research and the story behind Say No To Plastic, the talk is ultimately about something larger than plastic: the intimate relationship between the world we create around us and the world we create within us.";

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="media-page">
        <section className="media-hero">
          <div>
            <p className="eyebrow">TEDxMiami</p>
            <h1>{title}</h1>
            <p>Dr. Elie Haddad | TEDxMiami</p>
          </div>
          <aside>
            <span>TEDx Talk</span>
            <strong>Plastic, health, and what we inherit.</strong>
            <p>An environmental story that is increasingly also a human story.</p>
          </aside>
        </section>

        <section className="media-feature ivory" aria-labelledby="tedx-video-title">
          <div className="media-feature-copy">
            <p className="eyebrow dark">TEDxMiami</p>
            <h2 id="tedx-video-title">{title}</h2>
          </div>
          {video ? (
            <FeatureVideo video={video} analyticsLabel="tedx-page" className="media-video" />
          ) : (
            <figure className="media-pending-card">
              <img src="/tedx.webp" width="1536" height="1024" alt="Dr. Elie Haddad speaking on a TEDxMiami stage" />
              <figcaption><strong>TEDx video coming soon</strong></figcaption>
            </figure>
          )}
        </section>

        <section className="media-inquiries ivory">
          <div>
            <p className="eyebrow dark">The Invisible Inheritance of Nanoplastics</p>
            <h2>{storyTitle}</h2>
            <p>{storyBodyPrimary}</p>
            <p>{storyBodySecondary}</p>
            <a className="button dark" href="#tedx-video-title">Watch the TEDx talk <span>↑</span></a>
          </div>
          <aside>
            <span>Continue exploring</span>
            <TrackedLink href="/science" eventName="cta_click" label="tedx-science">The science <b>→</b></TrackedLink>
            <TrackedLink href="/solutions" eventName="cta_click" label="tedx-action">Take action <b>→</b></TrackedLink>
            <TrackedLink href="/about-dr-elie-haddad" eventName="cta_click" label="tedx-about">About Dr. Haddad <b>→</b></TrackedLink>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}

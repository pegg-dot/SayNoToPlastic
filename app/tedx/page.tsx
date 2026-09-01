import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { FeatureVideo } from "../components/FeatureVideo";
import { TrackedLink } from "../components/TrackedLink";
import { getMediaEntry, toVideoFeature } from "../content/media-content";

const title = "The Invisible Inheritance of Nanoplastics";
const description = "Dr. Elie Haddad's TEDxMiami talk on microplastics, nanoplastics, human health, and the relationship between the world around us and the world within us.";

export const metadata: Metadata = {
  title: `${title} | TEDxMiami | Say No to Plastic`,
  description,
  alternates: { canonical: "/tedx" },
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

export default function TedxPage() {
  const entry = getMediaEntry("tedx-invisible-inheritance");
  const video = entry ? toVideoFeature(entry) : null;

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
            <p className="eyebrow dark">Watch the TEDx talk</p>
            <h2 id="tedx-video-title">{title}</h2>
            {entry?.temporary ? (
              <p>The official TEDx video has not yet been released. The current video is a temporary audience recording and will be replaced here as soon as the official TEDx release becomes available.</p>
            ) : (
              <p>Watch Dr. Haddad&apos;s TEDxMiami talk.</p>
            )}
          </div>
          {video ? (
            <FeatureVideo video={video} analyticsLabel="tedx-page" className="media-video" />
          ) : (
            <figure className="media-pending-card">
              <img src="/tedx.webp" width="1536" height="1024" alt="Dr. Elie Haddad speaking on a TEDxMiami stage" />
              <figcaption><strong>Official TEDx video coming soon</strong></figcaption>
            </figure>
          )}
        </section>

        <section className="media-inquiries ivory">
          <div>
            <p className="eyebrow dark">The Invisible Inheritance of Nanoplastics</p>
            <h2>What if one of the greatest environmental stories of our time is no longer only happening around us, but within us?</h2>
            <p>In <em>The Invisible Inheritance of Nanoplastics</em>, Dr. Elie Haddad explores the emerging science of micro- and nanoplastics in the human body and asks us to reconsider the boundary between environmental health and human health.</p>
            <p>Drawing from medicine, scientific research and the story behind Say No To Plastic, the talk is ultimately about something larger than plastic: the intimate relationship between the world we create around us and the world we create within us.</p>
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

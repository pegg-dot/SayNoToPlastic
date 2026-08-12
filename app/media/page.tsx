import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { FeatureVideo } from "../components/FeatureVideo";
import { SignupForm } from "../components/SignupForm";
import { TrackedLink } from "../components/TrackedLink";
import { getMediaEntry, MEDIA_KIT, toVideoFeature, WELCOME_FILM } from "../content/media-content";

const description = "Explore Dr. Elie R. Haddad's media work, current press resources, and the approval status of upcoming talks, interviews, and public appearances.";
export const metadata: Metadata = {
  title: "Events & Media | Say No to Plastic",
  description,
  alternates: { canonical: "/media" },
  openGraph: { title: "Events & Media | Say No to Plastic", description, url: "/media", siteName: "Say No to Plastic", type: "website", images: [{ url: "/tedx.webp", width: 1536, height: 1024, alt: "Elie R. Haddad, MD, speaking at TEDxMiami" }] },
  twitter: { card: "summary_large_image", title: "Events & Media | Say No to Plastic", description, images: ["/tedx.webp"] },
};


function PendingMedia({ id }: { id: string }) {
  const entry = getMediaEntry(id);
  if (!entry) return null;
  const video = toVideoFeature(entry);
  if (video) return <FeatureVideo video={video} analyticsLabel={`media-${entry.id}`} className="media-video" />;
  return <figure className="media-pending-card">
    <img src={entry.thumbnail} width="1536" height="1024" loading="lazy" alt={entry.thumbnailAlt} />
    <figcaption>
      <span>{entry.platform}</span>
      <strong>Official link pending owner confirmation</strong>
      <p>{entry.description}</p>
      <small>Playback remains disabled until the URL, publication date, thumbnail rights, and owner approval are recorded in the media registry.</small>
    </figcaption>
  </figure>;
}

export default function MediaPage() {
  const tedx = getMediaEntry("tedx-invisible-inheritance");
  const conversation = getMediaEntry("homo-plasticus-conversation");

  return <><Header/><main id="main-content" tabIndex={-1} className="media-page">
    <section className="media-hero">
      <div><p className="eyebrow">Media & speaking</p><h1>Make the science clear enough to act on.</h1><p>Dr. Elie R. Haddad brings a physician&apos;s perspective to plastic exposure, human biology, and practical prevention. Watch the current talks and conversations below; the temporary TEDx recording will be replaced when the official release arrives.</p><div className="media-hero-actions"><a className="button gold" href="#featured-talk">View media status <span>↓</span></a><TrackedLink className="text-link" href="/contact" eventName="cta_click" label="media-hero-contact">Request a conversation <span>→</span></TrackedLink></div></div>
      <aside><span>Media desk</span><strong>Talks, interviews, and press resources</strong><p>TEDx and other public appearances live here—not on the homepage—so the main story remains focused on evidence and action.</p><a href="/media/press-kit">Open the press kit →</a></aside>
    </section>

    <section id="featured-talk" className="media-feature ivory">
      <div className="media-feature-copy"><p className="eyebrow dark">TEDxMiami · temporary recording</p><h2>{tedx?.title ?? "The Invisible Inheritance of Nanoplastics"}</h2><p>A temporary audience-recorded YouTube video is available now. It is not the official TEDx release and will be replaced as soon as the official public video arrives.</p><dl><div><dt>Speaker</dt><dd>Elie R. Haddad, MD</dd></div><div><dt>Platform</dt><dd>{tedx?.platform ?? "TEDxMiami"}</dd></div><div><dt>Status</dt><dd>Temporary audience recording</dd></div></dl></div>
      <PendingMedia id="tedx-invisible-inheritance" />
    </section>

    <section className="media-conversation"><div><p className="eyebrow">Long-form conversation · available now</p><h2>{conversation?.title ?? "A longer conversation"}</h2><p>Watch a longer Homo Plasticus conversation about how the project began, what the emerging human evidence shows, and which practical changes deserve attention.</p></div><PendingMedia id="homo-plasticus-conversation" /></section>

    <section className="media-welcome ivory"><div><p className="eyebrow dark">The welcome film</p><h2>{WELCOME_FILM.title}</h2><p>{WELCOME_FILM.description}</p><span>{WELCOME_FILM.status === "ready" ? `Video live · ${WELCOME_FILM.durationLabel} · captions/transcript pending` : "Welcome film link pending · popup infrastructure live"}</span></div><figure>{WELCOME_FILM.status === "ready" && WELCOME_FILM.hostedVideoSrc ? <video controls playsInline preload="metadata" poster={WELCOME_FILM.posterSrc} aria-label={WELCOME_FILM.title}><source src={WELCOME_FILM.hostedVideoSrc} type="video/mp4"/>Your browser does not support embedded video.</video> : <img src={WELCOME_FILM.posterSrc} width="900" height="1024" loading="lazy" alt={WELCOME_FILM.posterAlt}/>}<figcaption>{WELCOME_FILM.durationLabel}</figcaption></figure></section>

    <section className="media-kit-preview"><div><p className="eyebrow">Press resources</p><h2>Give editors and hosts a clean starting point.</h2><p>{MEDIA_KIT.shortBio}</p><TrackedLink className="button outline" href="/media/press-kit" eventName="cta_click" label="media-press-kit">Open the press kit <span>→</span></TrackedLink></div><aside><span>Current kit includes</span><ul><li>Current short and extended biography</li><li>Interview and speaking topics</li><li>Project facts and editorial boundaries</li><li>Web portrait, book cover, and media approval notes</li></ul><small>High-resolution owner-approved media assets are still parked.</small></aside></section>

    <section className="media-inquiries ivory"><div><p className="eyebrow dark">For editors, producers, and hosts</p><h2>Bring a focused question.</h2><p>For interviews, panels, podcasts, speaking invitations, or research-related requests, include the audience, format, date, and question you want to explore. The team will route the inquiry appropriately.</p><TrackedLink className="button dark" href="/contact" eventName="cta_click" label="media-inquiries-contact">Make an inquiry <span>→</span></TrackedLink></div><aside><span>Useful starting points</span><a href="/media/press-kit">Press kit <b>→</b></a><a href="/about-dr-elie-haddad">Dr. Haddad&apos;s background <b>→</b></a><a href="/science">Research record <b>→</b></a><a href="/editorial-policy">Editorial standard <b>→</b></a></aside></section>

    <section className="media-signup"><div><p className="eyebrow">Stay connected</p><h2>Evidence updates, practical guidance, and new public work.</h2><p>Receive the Say No to Plastic field notes. Unsubscribe at any time.</p></div><SignupForm compact /></section>
  </main><Footer/></>;
}

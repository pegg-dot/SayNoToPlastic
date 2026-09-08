import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { FeatureVideo } from "../components/FeatureVideo";
import { TrackedLink } from "../components/TrackedLink";
import { SignupForm } from "../components/SignupForm";
import { MEDIA_KIT, toVideoFeature, WELCOME_FILM } from "../content/media-content";
import { getEffectiveTedxEntry } from "../lib/publication-overrides";
import { getAdminContentValues, getOwnerMediaItems } from "../lib/admin-content";
import styles from "./media.module.css";

const description = "Explore Dr. Elie R. Haddad's media work, the Homo Plasticus sculpture story, current press resources, and the approval status of upcoming talks and public appearances.";

export const metadata: Metadata = {
  title: "Events & Media | Say No to Plastic",
  description,
  alternates: { canonical: "/media" },
  openGraph: {
    title: "Events & Media | Say No to Plastic",
    description,
    url: "/media",
    siteName: "Say No to Plastic",
    type: "website",
    images: [{ url: "/media/homo-plasticus-full.webp", width: 672, height: 1536, alt: "Homo Plasticus sculpture, a standing figure holding a fetus with visible plastic fragments embedded through the body" }],
  },
  twitter: { card: "summary_large_image", title: "Events & Media | Say No to Plastic", description, images: ["/media/homo-plasticus-full.webp"] },
};

function displayMediaType(type: string) {
  if (type === "press") return "Press";
  if (type === "podcast") return "Podcast appearance";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function displayDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

export default async function MediaPage() {
  const [tedx, ownerCopy, ownerMedia] = await Promise.all([
    getEffectiveTedxEntry(),
    getAdminContentValues(["media.hero_heading", "media.hero_intro", "media.owner_update", "press.short_bio"]),
    getOwnerMediaItems(),
  ]);
  const tedxVideo = tedx ? toVideoFeature(tedx) : null;
  const ownerUpdate = ownerCopy["media.owner_update"] || "";
  const mediaHeading = ownerCopy["media.hero_heading"] || "Make the science clear enough to act on.";
  const mediaIntro = ownerCopy["media.hero_intro"] || "Dr. Elie R. Haddad brings a physician's perspective to plastic exposure, human biology, and practical prevention. Talks, artwork, public appearances, and press resources are different ways into the same evidence-first conversation.";
  const shortBio = ownerCopy["press.short_bio"] || MEDIA_KIT.shortBio;
  const publishedMedia = ownerMedia
    .filter((item) => item.published)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return <><Header /><main id="main-content" tabIndex={-1} className={`media-page ${styles.phase11}`}>
    <section className="media-hero"><div><p className="eyebrow">Events &amp; Media</p><h1>{mediaHeading}</h1><p>{mediaIntro}</p><div className="media-hero-actions"><a className="button gold" href="#homo-plasticus-art">See Homo Plasticus <span>↓</span></a><TrackedLink className="text-link" href="/contact" eventName="cta_click" label="media-hero-contact">Request a conversation <span>→</span></TrackedLink></div></div><aside><span>Media desk</span><strong>Talks, artwork, and press resources</strong><p>Public work lives here so the homepage can stay focused on the evidence and practical action.</p><a href="/media/press-kit">Open the press kit →</a></aside></section>

    {ownerUpdate ? <section className="media-inquiries ivory"><div><p className="eyebrow dark">Owner update</p><h2>Latest from Dr. Haddad</h2><p>{ownerUpdate}</p></div><aside><span>Updated through owner admin</span><p>This note can be changed without a code deployment.</p></aside></section> : null}

    {publishedMedia.length > 0 ? <section className={styles.ownerTimeline} aria-labelledby="owner-media-title"><header><p className="eyebrow">Latest appearances &amp; events</p><h2 id="owner-media-title">Follow the work as it happens.</h2><p>Talks, interviews, events, podcast appearances, and press items published directly by the Say No To Plastic team.</p></header><div className={styles.ownerTimelineGrid}>{publishedMedia.map((item) => <article key={item.id}><div className={styles.ownerTimelineMeta}><span>{displayMediaType(item.type)}</span>{item.date ? <time dateTime={item.date}>{displayDate(item.date)}</time> : null}</div><h3>{item.title}</h3>{item.platform ? <strong>{item.platform}</strong> : null}{item.description ? <p>{item.description}</p> : null}{item.url ? <a href={item.url} target="_blank" rel="noreferrer">Open {item.type === "event" ? "event" : "source"} <b>↗</b></a> : null}</article>)}</div></section> : null}

    <section id="homo-plasticus-art" className="media-sculpture" aria-labelledby="homo-plasticus-art-title"><div className="media-sculpture-visuals"><figure className="media-sculpture-primary"><img src="/media/homo-plasticus-full.webp" width="672" height="1536" loading="eager" alt="Homo Plasticus sculpture, a standing figure holding a fetus with visible plastic fragments embedded through the body" /><figcaption><strong>Homo Plasticus</strong><span>The Silent Invasion of Human Health</span></figcaption></figure><figure className="media-sculpture-detail media-sculpture-detail-one"><img src="/media/homo-plasticus-detail-side.webp" width="792" height="1004" loading="lazy" alt="Side detail of the Homo Plasticus sculpture showing the figure holding the fetus" /></figure><figure className="media-sculpture-detail media-sculpture-detail-two"><img src="/media/homo-plasticus-detail-front.webp" width="784" height="1018" loading="lazy" alt="Frontal detail of the Homo Plasticus sculpture showing plastic fragments visible through the torso and fetus" /></figure></div><div className="media-sculpture-copy"><p className="eyebrow">Homo Plasticus · The Silent Invasion of Human Health</p><h2 id="homo-plasticus-art-title">Art makes the invisible visible.</h2><p className="media-sculpture-lead">Scientific evidence can be difficult to hold onto when it stays abstract. <em>Homo Plasticus</em> turns an invisible problem into something a visitor can see, question, and remember.</p><p>The sculpture depicts a woman holding a fetus, with visible plastic fragments embedded throughout both forms. The artwork is not presented as scientific evidence. It is the point of attention that makes someone want to understand the evidence.</p><p>That curiosity is the bridge. Art opens the door; the science explains what has been detected, what remains uncertain, and what practical exposure reduction can look like.</p><div className="media-sculpture-sequence" aria-label="How the sculpture supports the science story"><div><span>01</span><strong>Attention</strong><p>An unfamiliar image interrupts the ordinary.</p></div><div><span>02</span><strong>Curiosity</strong><p>The visible fragments create a question.</p></div><div><span>03</span><strong>Science</strong><p>The evidence gives that question context and limits.</p></div><div><span>04</span><strong>Memory</strong><p>Emotion helps the scientific message stay with the viewer.</p></div></div><blockquote>“The artwork creates the question. The science carries the answer.”</blockquote><div className="media-sculpture-links"><TrackedLink className="button gold" href="/science" eventName="cta_click" label="sculpture-science">Explore the science <span>→</span></TrackedLink><TrackedLink className="text-link" href="/homo-plasticus" eventName="cta_click" label="sculpture-book">Explore Homo Plasticus <span>→</span></TrackedLink></div></div></section>

    <section id="featured-talk" className="media-feature ivory"><div className="media-feature-copy"><p className="eyebrow dark">TEDxMiami · {tedx?.temporary ? "temporary recording" : "official release"}</p><h2>{tedx?.title ?? "The Invisible Inheritance of Nanoplastics"}</h2><p>{tedx?.temporary ? "A temporary audience-recorded YouTube video is available now. It is not the official TEDx release and will be replaced as soon as the official public video arrives." : "The official TEDxMiami release is available now."}</p><dl><div><dt>Speaker</dt><dd>Elie R. Haddad, MD</dd></div><div><dt>Platform</dt><dd>{tedx?.platform ?? "TEDxMiami"}</dd></div><div><dt>Status</dt><dd>{tedx?.temporary ? "Temporary audience recording" : "Official release"}</dd></div></dl></div>{tedxVideo ? <FeatureVideo video={tedxVideo} analyticsLabel="media-tedx-invisible-inheritance" className="media-video" /> : <figure className="media-pending-card"><img src="/tedx.webp" width="1536" height="1024" loading="lazy" alt="Dr. Elie Haddad speaking on a TEDxMiami stage" /><figcaption><span>TEDxMiami</span><strong>Official link pending owner confirmation</strong></figcaption></figure>}</section>

    <section className="media-welcome ivory"><div><p className="eyebrow dark">The welcome film</p><h2>{WELCOME_FILM.title}</h2><p>{WELCOME_FILM.description}</p><span>{WELCOME_FILM.status === "ready" ? `Video live · ${WELCOME_FILM.durationLabel} · captions/transcript pending` : "Welcome film link pending · popup infrastructure live"}</span></div><figure>{WELCOME_FILM.status === "ready" && WELCOME_FILM.hostedVideoSrc ? <video controls playsInline preload="metadata" poster={WELCOME_FILM.posterSrc} aria-label={WELCOME_FILM.title}><source src={WELCOME_FILM.hostedVideoSrc} type="video/mp4" />Your browser does not support embedded video.</video> : <img src={WELCOME_FILM.posterSrc} width="900" height="1024" loading="lazy" alt={WELCOME_FILM.posterAlt} />}<figcaption>{WELCOME_FILM.durationLabel}</figcaption></figure></section>

    <section className="media-kit-preview"><div><p className="eyebrow">Press resources</p><h2>Give editors and hosts a clean starting point.</h2><p>{shortBio}</p><TrackedLink className="button outline" href="/media/press-kit" eventName="cta_click" label="media-press-kit">Open the press kit <span>→</span></TrackedLink></div><aside><span>Current kit includes</span><ul><li>Current short and extended biography</li><li>Interview and speaking topics</li><li>Project facts and editorial boundaries</li><li>Web portrait, book cover, and media approval notes</li></ul></aside></section>

    <section className="media-inquiries ivory"><div><p className="eyebrow dark">For editors, producers, and hosts</p><h2>Bring a focused question.</h2><p>For interviews, panels, podcasts, speaking invitations, or research-related requests, include the audience, format, date, and question you want to explore. The team will route the inquiry appropriately.</p><TrackedLink className="button dark" href="/contact" eventName="cta_click" label="media-inquiries-contact">Make an inquiry <span>→</span></TrackedLink></div><aside><span>Useful starting points</span><a href="/media/press-kit">Press kit <b>→</b></a><a href="/about-dr-elie-haddad">Dr. Haddad&apos;s background <b>→</b></a><a href="/science">Research record <b>→</b></a><a href="/editorial-policy">Editorial standard <b>→</b></a></aside></section>

    <section className="media-signup"><div><p className="eyebrow">Field Notes / Newsletter</p><h2>Follow new research and public work.</h2><p>Research summaries, practical guidance, and new public work from Say No to Plastic.</p><SignupForm compact buttonLabel="Join the movement" successTitle="You&apos;re in." successText="You&apos;re subscribed. No confirmation email is required." /></div></section>
  </main><Footer /></>;
}
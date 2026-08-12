import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { SignupForm } from "../components/SignupForm";
import { CommunityChallenge } from "../components/CommunityChallenge";

const description = "Join a physician-led community learning how to understand emerging microplastic research and reduce avoidable exposure.";
export const metadata: Metadata = { title: "Join the Movement | Say No to Plastic", description, alternates: { canonical: "/community" }, openGraph: { title: "Join the Movement | Say No to Plastic", description, url: "/community", siteName: "Say No to Plastic", type: "website", images: [{ url: "/generations-full.webp", width: 1024, height: 1536, alt: "A commitment to healthier generations ahead" }] }, twitter: { card: "summary", title: "Join the Movement | Say No to Plastic", description, images: ["/generations-full.webp"] } };

export default function CommunityPage() {
  return <><Header/><main id="main-content" tabIndex={-1} className="inner-page community-v15 community-v16 community-v25 community-v27">
    <section className="community-hero"><picture className="community-visual" aria-hidden="true"><source media="(max-width: 767px)" srcSet="/generations-full-mobile.webp"/><img src="/generations-full.webp" width="1024" height="1536" loading="eager" fetchPriority="high" alt=""/></picture><div><p className="eyebrow">Say No To Plastic</p><h1>For the generations ahead.</h1><p>Join a community learning what new research found, which everyday plastic exposures can be reduced, and how to share practical changes with others.</p><SignupForm/><small>Research summaries, practical guides, and project updates. Unsubscribe at any time.</small></div></section>

    <section className="movement-pillars ivory"><p className="eyebrow dark">The movement</p><div><article><span>01</span><h2>Learn</h2><p>Understand what the evidence found and what it means in everyday language.</p></article><article><span>02</span><h2>Reduce</h2><p>Focus on repeated exposures where practical changes make the most sense.</p></article><article><span>03</span><h2>Share</h2><p>Bring credible information into families, schools, workplaces, and communities.</p></article><article><span>04</span><h2>Advocate</h2><p>Support better research, healthier products, and policies that reduce unnecessary plastic.</p></article></div></section>

    <CommunityChallenge />

    <section className="community-practice community-practice-v25 ivory">
      <div className="community-practice-copy-v25"><p className="eyebrow dark">From information to practice</p><h2>Learn one idea. Change one routine. Share it accurately.</h2><p>Read when you want more depth, act on one practical change, and share only what the evidence supports.</p></div>
      <ol><li><span>01</span><strong>Read</strong><p>Go deeper only when you want the science behind a question.</p></li><li><span>02</span><strong>Act</strong><p>Choose one realistic change from the exposure-reduction guide.</p></li><li><span>03</span><strong>Share</strong><p>Say what is known—and what is still uncertain—without exaggeration.</p></li></ol>
      <div className="community-practice-actions-v25"><a className="button gold" href="/solutions/reduce-exposure#worksheet">Choose one next change <span>→</span></a><a className="text-link" href="/science">Explore the science <span>→</span></a></div>
    </section>

    <section className="community-contact"><div><p className="eyebrow">Ask a question</p><h2>Need ebook help, a source, or a media contact?</h2><p>Use the contact route for general questions, research, partnerships, speaking, media, or ebook access.</p></div><div><a className="button gold" href="/contact">Open contact options <span>→</span></a><a className="text-link" href="/media">Events &amp; Media <span>→</span></a></div></section>
  </main><Footer/></>;
}

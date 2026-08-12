import type { Metadata } from "next";
import { AboutStoryRail } from "../components/AboutStoryRail";
import { Footer, Header } from "../components/SiteChrome";
import { DR_HADDAD_FACTS } from "../content/owner-facts";
import { ExposomeMap } from "../components/ExposomeMap";

const description = "Meet Elie R. Haddad, MD—the cardiologist and cardiac electrophysiologist behind Say No to Plastic and Homo Plasticus.";
export const metadata: Metadata = {
  title: "Dr. Elie R. Haddad | Say No to Plastic",
  description,
  alternates: { canonical: "/about-dr-elie-haddad" },
  openGraph: { title: "Dr. Elie R. Haddad | Say No to Plastic", description, url: "/about-dr-elie-haddad", siteName: "Say No to Plastic", type: "profile", images: [{ url: "/elie-haddad-tedx-profile.jpg", width: 872, height: 1024, alt: "Elie R. Haddad, MD" }] },
  twitter: { card: "summary", title: "Dr. Elie R. Haddad | Say No to Plastic", description, images: ["/elie-haddad-tedx-profile.jpg"] },
};

const principles = [
  { title: "Science Before Sensation", body: "Say what the evidence supports—and say when it is still evolving." },
  { title: "Curiosity Over Certainty", body: "Medicine advances by asking difficult questions before every answer is available." },
  { title: "Progress Over Perfection", body: "Focus on practical changes that can last rather than an impossible standard." },
  { title: "Protect Future Generations", body: "Today's choices help shape the world inherited by those who come next." },
  { title: "Treat Causes, Not Only Symptoms", body: "Prevention deserves attention alongside the treatment of disease." },
  { title: "Hope Inspires Action", body: "Fear may capture attention; hope is what makes change sustainable." },
];

export default function AboutPage() {
  return (
    <>
      <Header skipToContent />
      <main id="main-content" className="about-v2 about-v40-6" tabIndex={-1}>
        <section className="about-v2-hero" aria-labelledby="about-title">
          <div className="about-v2-hero-copy">
            <p className="about-v2-index">01 · The physician</p>
            <h1 id="about-title">Meet the physician behind the movement</h1>
            <div className="about-v2-intro">
              <p>For more than twenty years, I have cared for patients as a cardiologist and cardiac electrophysiologist. The work taught me to ask not only how disease is treated, but why it develops and what might prevent it.</p>
              <p>That question eventually led me beyond the clinic—to the air we breathe, the water we drink, the food we eat, and emerging research on microplastics and nanoplastics in the human body. Say No To Plastic is the continuation of that inquiry.</p>
              <p><strong>A place built on curiosity, evidence, and hope.</strong></p>
            </div>
            <div className="about-v2-signature">
              <div>
                <strong>Dr. Elie Haddad</strong>
                <span>Cardiologist · Cardiac Electrophysiologist · Author · TEDxMiami Speaker</span>
              </div>
              <a className="about-v2-story-link" href="#my-story">Read my story <span>↓</span></a>
            </div>
          </div>

          <figure className="about-v2-portrait">
            <div className="about-v2-portrait-frame">
              <img src="/elie-haddad-tedx-profile.jpg" width="872" height="1024" alt="Elie R. Haddad, MD, wearing a white medical coat" />
            </div>
            <figcaption>
              <span>Elie R. Haddad, MD</span>
              <a href="/media#featured-talk">TEDxMiami media status →</a>
            </figcaption>
          </figure>
        </section>

        <section id="my-story" className="about-v2-story">
          <div className="about-v2-story-intro">
            <p className="about-v2-index dark">02 · My story</p>
            <h2>A question that followed me from one patient to the next.</h2>
            <AboutStoryRail />
          </div>

          <div className="about-v2-story-copy">
            <article id="clinic" data-about-chapter>
              <p className="about-v2-chapter">The clinic</p>
              <p className="about-v2-lead">For years, my world revolved around cardiology: heart attacks, arrhythmias, pacemakers, catheter ablations, and the daily work of helping people recover.</p>
              <p>As the years passed, one question kept following me from patient to patient: not only how do we treat disease, but why is it becoming so common?</p>
            </article>

            <article id="why" className="about-v2-why" data-about-chapter>
              <p className="about-v2-chapter">The question</p>
              <blockquote>Why?</blockquote>
              <p>I began noticing conditions I associated with later life appearing earlier, while metabolic disease, infertility, chronic inflammation, and hormonal disorders seemed increasingly familiar. Treatment mattered—but so did understanding what might be driving the pattern.</p>
            </article>

            <article id="environment" data-about-chapter>
              <p className="about-v2-chapter">The environment</p>
              <p className="about-v2-lead">That question changed the way I looked at health.</p>
              <p>I started looking beyond genetics and lifestyle to the environment around us: air, water, food, and the products we bring into our homes. That curiosity eventually led me into the emerging research on microplastics and nanoplastics.</p>
            </article>

            <article id="evidence" data-about-chapter>
              <p className="about-v2-chapter">The evidence</p>
              <p className="about-v2-lead">Researchers were reporting microscopic plastic particles in human blood and tissue—including the placenta, reproductive tissue, and brain.</p>
              <p>Detection does not automatically prove disease. But the growing evidence raised questions the public deserved to understand clearly, without fear or exaggeration.</p>
            </article>

            <article id="movement" data-about-chapter>
              <p className="about-v2-chapter">The movement</p>
              <p className="about-v2-lead">That inquiry led to public education, <em>Homo Plasticus</em>, my TEDx talk, and ultimately Say No To Plastic.</p>
              <p>I still care for patients in cardiology. I also see clear public education as an extension of medicine: helping people understand the evidence early enough to make thoughtful choices.</p>
            </article>
          </div>
        </section>

        <section className="about-v2-education" aria-labelledby="education-title">
          <div className="about-v2-section-heading">
            <p className="about-v2-index dark">03 · Education</p>
            <h2 id="education-title">Education</h2>
            <p>Medical school and postgraduate training in internal medicine, cardiovascular disease, and clinical cardiac electrophysiology.</p>
          </div>
          <div className="about-v2-education-record">
            <ol className="about-v2-education-list">
              {DR_HADDAD_FACTS.education.map((item, index) => (
                <li key={item.stage}>
                  <time>{String(index + 1).padStart(2, "0")}</time>
                  <strong>{item.stage}</strong>
                  {item.institution && <span>{item.institution}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="about-v2-public" aria-labelledby="public-title">
          <div>
            <p className="about-v2-index">04 · Into public view</p>
            <h2 id="public-title">The inquiry became a book, a talk, and a movement.</h2>
          </div>
          <div className="about-v2-public-paths">
            <a href="/homo-plasticus"><span>01</span><strong>Homo Plasticus</strong><small>Read the physician-led investigation</small><b>Explore the book →</b></a>
            <a href="/media#featured-talk"><span>02</span><strong>TEDxMiami</strong><small>Official public video link pending owner confirmation</small><b>View media status →</b></a>
            <a href="/science"><span>03</span><strong>The evidence</strong><small>Follow the human findings, organ by organ</small><b>Explore the science →</b></a>
          </div>
        </section>

        <section className="about-exposome" aria-labelledby="about-exposome-title">
          <div>
            <p className="about-v2-index">05 · The wider frame</p>
            <h2 id="about-exposome-title">The exposome connects the clinic to the world around us.</h2>
            <p>Dr. Haddad's supplied exposome diagram organizes air, water, food, products, and lifestyle across a lifetime, then places genetics, nutrition, exercise, and age between exposure and long-term health.</p>
            <p>It is not an individual risk score. It is a framework for asking why health cannot be understood through one product, one organ, or one day alone.</p>
            <div><a className="button gold" href="/science/exposome">Explore the exposome <span>→</span></a><a className="text-link" href="/science/body/cardiovascular-system">Follow the cardiovascular inquiry <span>→</span></a></div>
          </div>
          <ExposomeMap compact />
        </section>

        <section className="about-v2-philosophy" aria-labelledby="philosophy-title">
          <div className="about-v2-philosophy-copy">
            <p className="about-v2-index">06 · My philosophy</p>
            <h2 id="philosophy-title">The future of medicine cannot be built on treatment alone.</h2>
            <p>Medicine has taught me the value of treatment and the importance of prevention. That means looking beyond prescriptions to the environments we create and the repeated choices that shape health over time.</p>
            <p>Say No To Plastic grew from that belief: communicate the science honestly, focus on progress rather than perfection, and give people a practical way forward.</p>
          </div>
          <div className="about-v2-principles">
            <p>The principles that guide this work</p>
            <ol>
              {principles.map((principle, index) => (
                <li key={principle.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{principle.title}</h3><p>{principle.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="about-v2-beyond" aria-labelledby="beyond-title">
          <div className="about-v2-beyond-statement">
            <p className="about-v2-index dark">07 · Beyond medicine</p>
            <h2 id="beyond-title">Health emerges from thousands of choices made across a lifetime.</h2>
          </div>
          <div className="about-v2-beyond-copy">
            <p>Science, philosophy, nutrition, human behavior, nature, and the relationships we build have all shaped the way I think about health. That broader perspective is part of Say No To Plastic: an invitation to live with more awareness and responsibility, not more fear.</p>
          </div>
        </section>

        <section className="about-v2-closing" aria-labelledby="closing-title">
          <p className="about-v2-index">08 · Closing reflection</p>
          <div className="about-v2-reflection about-v2-reflection-horizontal">
            <div>
              <p>If there is one message I hope you take away from this page, it is that meaningful change begins with awareness.</p>
              <h2 id="closing-title">Awareness is where change begins.</h2>
            </div>
            <div className="about-v2-reflection-lines">
              <p>We cannot change what we do not see.</p>
              <p>We cannot protect what we do not value.</p>
              <p>We cannot leave a healthier world without asking better questions today.</p>
            </div>
          </div>
          <div className="about-v2-farewell about-v2-farewell-compact">
            <p>Thank you for being here. I invite you to keep exploring the evidence and the practical changes that can reduce unnecessary exposure without sacrificing the joy of living.</p>
            <div className="about-v2-actions">
              <a className="button gold" href="/science">Explore the science <span>→</span></a>
              <a className="button outline" href="/community">Join the movement <span>→</span></a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

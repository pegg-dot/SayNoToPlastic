import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Editorial and Evidence Policy | Say No to Plastic",
  description: "How Say No to Plastic sources, reviews, updates, corrects, and discloses its science and recommendations.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicy() {
  return <><Header/><main id="main-content" tabIndex={-1} className="inner-page legal-page editorial-policy">
    <section><p className="eyebrow">How we work</p><h1>Editorial and Evidence Policy</h1><p className="legal-date">Updated August 8, 2026</p></section>
    <article>
      <h2>Our purpose</h2><p>Say No to Plastic translates emerging research on plastics, microplastics, nanoplastics, plastic-associated chemicals, and human exposure into public education and practical guidance. The goal is useful clarity without exaggerated certainty.</p>
      <h2>Claim ladder</h2><p>We distinguish detection, measured exposure, biological plausibility, laboratory mechanism, observational association, human outcome, and causation. A finding at one level is never presented as proof at a stronger level.</p>
      <h2>Particles are not the same as chemicals</h2><p>Microplastic and nanoplastic particles are discussed separately from bisphenols, phthalates, and other plastic-associated chemicals. A chemical evidence base cannot be silently transferred to particles, and a particle-detection study cannot be presented as proof of an endocrine or metabolic effect.</p>
      <h2>Source hierarchy</h2><p>We prefer original peer-reviewed research, systematic reviews, public-health agencies, professional medical organizations, and official standards. Secondary reporting may help identify a topic, but it should not carry a major scientific claim by itself.</p>
      <h2>Body-system article standard</h2><p>Every body-system overview separates the supplied editorial narrative from the site's verified linked study record. It identifies what is known, what remains uncertain, related practical guides, and the status of the primary-source bibliography. A page marked primary-source review in progress is not ready for production signoff until the underlying papers are attached and reviewed.</p>
      <h2>Detection and contamination control</h2><p>Microplastic measurement is vulnerable to contamination from clothing, containers, air, instruments, and laboratory materials. Study summaries should name the sample, method, quality-control context, detection limits where available, and whether the result represents particle count, polymer mass, or another measurement.</p>
      <h2>Human, animal, cell, and modeling evidence</h2><p>Evidence types are labeled so readers can see what kind of inference is possible. Laboratory or animal findings may help identify a mechanism worth studying; they do not establish that the same effect occurs in people at everyday exposure levels.</p>
      <h2>Limitations beside findings</h2><p>Major evidence summaries state the study design, sample, method, principal finding, and material limitations. Detection is not presented as diagnosis, and association is not presented as causation.</p>
      <h2>Review and authorship</h2><p>Articles identify the publishing organization and update date. Clinical interpretations are reviewed under the editorial direction of Elie R. Haddad, MD. An individual medical-review credit appears only when that reviewer has approved the published version.</p>
      <h2>Source-status labels</h2><p>The site uses three internal publication states: verified primary studies linked, partial primary-source record, and primary-source review in progress. These labels describe the documentation state, not the severity or importance of a topic.</p>
      <h2>Corrections</h2><p>Material corrections should be made promptly and recorded when they change a reader's understanding of the evidence or action. Readers can report a possible error through the <a href="/contact">contact page</a>.</p>
      <h2>Updates</h2><p>Fast-moving topics are reviewed when a major study, public-health assessment, regulation, or product standard changes the conclusion. Older content may remain available with a visible update note when historical context is useful.</p>
      <h2>Product recommendations</h2><p>Recommendations require a defined use case, claim verification, meaningful comparison, practical tradeoffs, and firsthand inspection or use where feasible. A product is never presented as preventing infertility, kidney disease, cardiovascular disease, pregnancy complications, or another medical condition on the basis of a body-system article.</p>
      <h2>Affiliate separation</h2><p>Affiliate relationships are disclosed near relevant purchase links and on the sitewide disclosure page. Editorial conclusions are made independently of commission rate.</p>
      <h2>AI-assisted work</h2><p>Software may assist with research organization, drafting, formatting, code, and quality checks. It cannot serve as a medical reviewer, invent firsthand product use, supply unsupported citations, or make final clinical claims. A human remains responsible for publication.</p>
      <h2>Medical boundary</h2><p>All content is general education. It does not create a physician-patient relationship or provide personal diagnosis, treatment, emergency guidance, laboratory interpretation, or an individual exposure-risk score.</p>
    </article>
  </main><Footer/></>;
}

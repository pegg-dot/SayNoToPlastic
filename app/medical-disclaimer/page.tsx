import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Medical Disclaimer | Say No to Plastic", alternates: { canonical: "/medical-disclaimer" } };

export default function MedicalDisclaimer() {
  return <><Header/><main id="main-content" tabIndex={-1} className="inner-page legal-page">
    <section><p className="eyebrow">Educational boundary</p><h1>Medical Disclaimer</h1><p className="legal-date">Updated August 8, 2026</p></section>
    <article>
      <h2>General education</h2><p>Say No to Plastic provides general educational information about environmental exposure and emerging research. Content is not personal medical advice and is not a substitute for care from a qualified professional.</p>
      <h2>No diagnosis or treatment</h2><p>Do not use this website to diagnose symptoms, select or stop medication, delay evaluation, interpret a test, order microplastic testing, or make an individualized treatment decision.</p>
      <h2>No physician-patient relationship</h2><p>Reading the site, buying the book, joining an email list, or contacting the project does not create a physician-patient relationship with Elie R. Haddad, MD, Dr. Rudolph Eberwein, or any other contributor.</p>
      <h2>Emergencies</h2><p>This site is not monitored for urgent medical requests. In the United States, call 911 for an emergency. For possible poisoning or exposure, contact Poison Control at 1-800-222-1222.</p>
      <h2>Pregnancy, infant feeding, and children</h2><p>Pregnant people, parents, and caregivers should keep established prenatal care, nutrition, medication, infection-prevention, feeding, sterilization, hydration, and food-safety guidance as the priority. Do not stop breastfeeding, change infant formula, alter sterilization, or delay pediatric care because of a general website article.</p>
      <h2>Fertility and reproductive health</h2><p>Detection of particles in follicular fluid, placental tissue, or another reproductive sample does not diagnose infertility, predict an individual pregnancy, or establish that plastic caused a reproductive condition. Discuss personal fertility, menstrual, pregnancy, or hormonal concerns with the appropriate clinician.</p>
      <h2>Heart and blood vessels</h2><p>Microplastic findings in artery plaque or coronary blood do not replace established cardiovascular prevention, emergency evaluation, medication, or follow-up. Chest pain, stroke symptoms, severe shortness of breath, or another urgent symptom requires immediate medical care.</p>
      <h2>Kidney, digestive, endocrine, and skin concerns</h2><p>Body-system pages describe research questions, not clinical tests or treatment plans. Do not attribute kidney disease, digestive symptoms, hormonal changes, skin disease, or another condition to microplastics without a qualified medical evaluation.</p>
      <h2>Exposure-reduction guidance</h2><p>Practical suggestions are general and should be adapted to local water quality, food safety, disability and accessibility needs, allergies, occupational requirements, cost, housing conditions, and medical advice. A safer established practice should not be abandoned merely to avoid plastic.</p>
      <h2>Research uncertainty</h2><p>Microplastic and nanoplastic research is evolving. Findings may change with improved sampling, contamination control, measurement, replication, dose assessment, and human-outcome evidence.</p>
    </article>
  </main><Footer/></>;
}

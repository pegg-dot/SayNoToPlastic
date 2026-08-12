export type PressBrief = {
  slug: string;
  number: string;
  title: string;
  kicker: string;
  description: string;
  pageHref: string;
  pdfHref: string;
  status: "verified" | "partial" | "source-review" | "editorial";
};

export const pressBriefs: PressBrief[] = [
  {
    slug: "cardiovascular-system",
    number: "01",
    title: "Heart and Arteries",
    kicker: "Two human studies, two distinct questions",
    description: "Plaque and coronary-blood findings, established cardiovascular priorities, and the line between association and causation.",
    pageHref: "/science/body/cardiovascular-system",
    pdfHref: "/press-briefs/cardiovascular-system.pdf",
    status: "verified",
  },
  {
    slug: "pregnancy-early-life",
    number: "02",
    title: "Pregnancy and Early Life",
    kicker: "Placental detection with a no-blame boundary",
    description: "The linked placenta study, broader claims still awaiting sources, and established-care-first language for pregnancy and infancy.",
    pageHref: "/science/body/pregnancy-early-life",
    pdfHref: "/press-briefs/pregnancy-early-life.pdf",
    status: "partial",
  },
  {
    slug: "female-reproductive-health",
    number: "03",
    title: "Female Reproductive Health",
    kicker: "Follicular fluid, tissue questions, and uncertainty",
    description: "A source-aware briefing on reproductive samples, fertility questions, endocrine chemicals, and what detection cannot prove.",
    pageHref: "/science/body/female-reproductive-health",
    pdfHref: "/press-briefs/female-reproductive-health.pdf",
    status: "partial",
  },
  {
    slug: "detection-methods",
    number: "04",
    title: "How Detection Works",
    kicker: "From sample collection to polymer identification",
    description: "Collection, preparation, instrument choice, contamination control, and why detection is the first step rather than the final conclusion.",
    pageHref: "/science/how-detection-works",
    pdfHref: "/press-briefs/detection-methods.pdf",
    status: "editorial",
  },
  {
    slug: "particles-vs-endocrine-chemicals",
    number: "05",
    title: "Particles vs. Endocrine-Disrupting Chemicals",
    kicker: "Related subjects, different evidence bases",
    description: "A clear distinction between microplastic particles and chemicals such as BPA and phthalates, with source-review limits visible.",
    pageHref: "/science/body/endocrine-metabolic-system",
    pdfHref: "/press-briefs/particles-vs-endocrine-chemicals.pdf",
    status: "source-review",
  },
  {
    slug: "reduce-exposure",
    number: "06",
    title: "Reducing Exposure",
    kicker: "Progress, not perfection",
    description: "The practical hierarchy: repeated contact around food, drinks, heat, storage, indoor dust, clothing, and personal care.",
    pageHref: "/solutions/reduce-exposure",
    pdfHref: "/press-briefs/reduce-exposure.pdf",
    status: "editorial",
  },
];

export function pressBriefStatus(status: PressBrief["status"]) {
  if (status === "verified") return "Verified primary studies linked";
  if (status === "partial") return "Partial primary-source record";
  if (status === "source-review") return "Primary-source review in progress";
  return "Editorial framework and source notes";
}

export type ScienceConnection = {
  label: string;
  title: string;
  text: string;
  href: string;
};

const detection: ScienceConnection = { label: "Methods", title: "How scientists detect microplastics", text: "Understand collection, sample preparation, polymer identification, and contamination control.", href: "/science/how-detection-works" };
const exposome: ScienceConnection = { label: "Context", title: "The exposome", text: "See how air, water, food, products, lifestyle, and time combine across a lifetime.", href: "/science/exposome" };
const digestive: ScienceConnection = { label: "Body system", title: "The digestive system", text: "Connect food and water exposure with the gut barrier, elimination, and the limits of current evidence.", href: "/science/body/digestive-system" };
const kidneys: ScienceConnection = { label: "Body system", title: "The kidneys and urinary system", text: "Explore filtration, circulation, elimination, and the source-review questions still open.", href: "/science/body/kidneys-urinary-system" };
const skin: ScienceConnection = { label: "Body system", title: "The skin", text: "Separate intact-skin barrier questions from nanoplastics and plastic-associated chemicals.", href: "/science/body/skin" };
const endocrine: ScienceConnection = { label: "Body system", title: "The endocrine and metabolic system", text: "Keep plastic particles distinct from BPA, phthalates, and other endocrine-disrupting chemicals.", href: "/science/body/endocrine-metabolic-system" };
const pregnancy: ScienceConnection = { label: "Life stage", title: "Pregnancy, placenta, and early life", text: "Review the linked placenta finding, the broader supplied draft, and the no-blame evidence boundary.", href: "/science/body/pregnancy-early-life" };
const femaleReproductive: ScienceConnection = { label: "Body system", title: "Female reproductive health", text: "Connect follicular-fluid evidence with ovarian, uterine, hormone, and fertility questions.", href: "/science/body/female-reproductive-health" };
const cardiovascular: ScienceConnection = { label: "Body system", title: "The cardiovascular system", text: "Read the artery-plaque and coronary-blood findings together without turning association into causation.", href: "/science/body/cardiovascular-system" };
const reduce: ScienceConnection = { label: "Action", title: "How to reduce exposure", text: "Use a practical, no-perfection framework across food, water, air, clothing, and personal care.", href: "/solutions/reduce-exposure" };

export const guideScienceConnections: Record<string, ScienceConnection[]> = {
  Water: [digestive, kidneys, exposome],
  Kitchen: [digestive, exposome, reduce],
  Food: [digestive, exposome, reduce],
  Home: [exposome, skin, detection],
  "Personal care": [skin, endocrine, exposome],
  Textiles: [skin, exposome, reduce],
  Families: [pregnancy, femaleReproductive, endocrine],
  Evidence: [cardiovascular, detection, exposome],
};

export function getGuideScienceConnections(category: string) {
  return guideScienceConnections[category] ?? [detection, exposome, reduce];
}

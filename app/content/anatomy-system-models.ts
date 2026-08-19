export type AnatomySystemSlug =
  | "digestive-system"
  | "kidneys-urinary-system"
  | "endocrine-metabolic-system"
  | "skin"
  | "whole-body-atlas";

export type AnatomySystemGroupId =
  | "all"
  | "skin"
  | "brain"
  | "circulation"
  | "heart"
  | "skeleton"
  | "pregnancy"
  | "reproductive"
  | "endocrine"
  | "urinary"
  | "digestive";

export type AnatomySystemGroup = {
  id: AnatomySystemGroupId;
  label: string;
  color: string;
};

export type AnatomyViewerTransform = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};

export type AnatomyViewerModel = {
  id: string;
  label: string;
  fileName: string;
  color: string;
  emissive: string;
  group: Exclude<AnatomySystemGroupId, "all" | "skin">;
  urls: string[];
  sourceUrl: string;
  transform?: AnatomyViewerTransform;
};

export type AnatomySystemModelConfig = {
  slug: AnatomySystemSlug;
  title: string;
  shortTitle: string;
  route: string;
  accent: string;
  summary: string;
  panelKnown: string;
  panelUncertain: string;
  structures: string[];
  scopeNote: string;
  surfaceSystem?: boolean;
  compositeSystem?: boolean;
  reviewStatus?: "verified" | "partial" | "source-review";
  statusLabel?: string;
  groups?: AnatomySystemGroup[];
  models: AnatomyViewerModel[];
};

export const HRA_RELEASE = "v1.2";
export const HRA_LIBRARY_URL = "https://humanatlas.io/3d-reference-library";
export const HRA_LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
export const HRA_REPOSITORY_URL = "https://github.com/hubmapconsortium/ccf-releases/tree/main/v1.2/models";

const HRA_CDN_BASE = `https://cdn.humanatlas.io/hra-releases/${HRA_RELEASE}/models`;
const HRA_RAW_BASE = `https://raw.githubusercontent.com/hubmapconsortium/ccf-releases/main/${HRA_RELEASE}/models`;
const HRA_BLOB_BASE = `https://github.com/hubmapconsortium/ccf-releases/blob/main/${HRA_RELEASE}/models`;

function hraModel(
  id: string,
  label: string,
  fileName: string,
  color: string,
  emissive: string,
  group: AnatomyViewerModel["group"],
): AnatomyViewerModel {
  return {
    id,
    label,
    fileName,
    color,
    emissive,
    group,
    urls: [`${HRA_CDN_BASE}/${fileName}`, `${HRA_RAW_BASE}/${fileName}`],
    sourceUrl: `${HRA_BLOB_BASE}/${fileName}`,
  };
}

function localModel(
  id: string,
  label: string,
  fileName: string,
  color: string,
  emissive: string,
  group: AnatomyViewerModel["group"],
  sourceUrl: string,
  transform?: AnatomyViewerTransform,
): AnatomyViewerModel {
  return {
    id,
    label,
    fileName,
    color,
    emissive,
    group,
    urls: [`/models/anatomy/${fileName}`],
    sourceUrl,
    transform,
  };
}

const kidneyLeft = hraModel("kidney-left", "Left kidney", "VH_F_Kidney_L.glb", "#b45f55", "#4b2221", "urinary");
const kidneyRight = hraModel("kidney-right", "Right kidney", "VH_F_Kidney_R.glb", "#b45f55", "#4b2221", "urinary");
const ureterLeft = hraModel("ureter-left", "Left ureter", "VH_F_Ureter_L.glb", "#d7a06e", "#5b3726", "urinary");
const ureterRight = hraModel("ureter-right", "Right ureter", "VH_F_Ureter_R.glb", "#d7a06e", "#5b3726", "urinary");
const urinaryBladder = hraModel("urinary-bladder", "Urinary bladder", "VH_F_Urinary_Bladder.glb", "#c17872", "#4a292c", "urinary");

const smallIntestine = hraModel("small-intestine", "Small intestine", "VH_F_Small_Intestine.glb", "#d39c76", "#5a3428", "digestive");
const largeIntestine = hraModel("large-intestine", "Large intestine", "SBU_F_Intestine_Large.glb", "#b87d60", "#4b2c25", "digestive");
const liver = hraModel("liver", "Liver", "VH_F_Liver.glb", "#8e4a3d", "#351b19", "digestive");
const digestivePancreas = hraModel("digestive-pancreas", "Pancreas", "VH_F_Pancreas.glb", "#d4ad72", "#594229", "digestive");

const endocrinePancreas = hraModel("endocrine-pancreas", "Pancreas", "VH_F_Pancreas.glb", "#d5ad6f", "#594125", "endocrine");
const thymus = hraModel("thymus", "Thymus", "VH_F_Thymus.glb", "#c98572", "#4d2e2a", "endocrine");
const endocrineOvaryLeft = hraModel("endocrine-ovary-left", "Left ovary", "VH_F_Ovary_L.glb", "#d68d7f", "#552e2d", "endocrine");
const endocrineOvaryRight = hraModel("endocrine-ovary-right", "Right ovary", "VH_F_Ovary_R.glb", "#d68d7f", "#552e2d", "endocrine");

const reproductiveOvaryLeft = hraModel("reproductive-ovary-left", "Left ovary", "VH_F_Ovary_L.glb", "#d68d7f", "#552e2d", "reproductive");
const reproductiveOvaryRight = hraModel("reproductive-ovary-right", "Right ovary", "VH_F_Ovary_R.glb", "#d68d7f", "#552e2d", "reproductive");
const fallopianLeft = hraModel("fallopian-left", "Left fallopian tube", "VH_F_Fallopian_Tube_L.glb", "#c97876", "#4e282b", "reproductive");
const fallopianRight = hraModel("fallopian-right", "Right fallopian tube", "VH_F_Fallopian_Tube_R.glb", "#c97876", "#4e282b", "reproductive");

const groups: AnatomySystemGroup[] = [
  { id: "all", label: "General anatomy", color: "#e1ad63" },
  { id: "skin", label: "Exterior", color: "#d9aa87" },
  { id: "brain", label: "Brain", color: "#d3a36f" },
  { id: "circulation", label: "Circulation", color: "#a95743" },
  { id: "heart", label: "Heart", color: "#a84e40" },
  { id: "skeleton", label: "Pelvis", color: "#b8a895" },
  { id: "endocrine", label: "Endocrine", color: "#d5ad6f" },
  { id: "urinary", label: "Kidneys + urinary", color: "#b45f55" },
  { id: "digestive", label: "Digestive", color: "#a9bf76" },
];

const localHraSource = "https://3d.nih.gov/collections/hra";

/** Shared calibration that keeps the local brain surface inside the reference head. */
export const BRAIN_ALIGNMENT: AnatomyViewerTransform = {
  // The source brain is already positioned near the HRA head. A light upward
  // translation and modest scale reduction keep its full bounds inside the
  // female exterior shell instead of dropping it into the face or neck.
  position: [0, 0.035, 0.005],
  scale: 0.9,
};

/*
 * The reference atlas deliberately excludes pregnancy/fetal and reproductive
 * overlays. Those are sex- and life-stage-specific reference contexts and stay
 * in their dedicated evidence chapters instead of being presented as anatomy
 * that necessarily coexists in one literal individual.
 */
const completeModels: AnatomyViewerModel[] = [
  localModel("complete-vasculature", "Blood vasculature", "vasculature-female.glb", "#a95743", "#4d211a", "circulation", localHraSource),
  localModel("complete-brain", "Brain", "brain.glb", "#d3a36f", "#563a21", "brain", localHraSource, BRAIN_ALIGNMENT),
  localModel("complete-heart", "Heart", "heart.glb", "#a84e40", "#4b1f1b", "heart", localHraSource),
  localModel("complete-pelvis", "Pelvic skeleton", "pelvis-female.glb", "#b8a895", "#3d3730", "skeleton", localHraSource),
  { ...thymus, id: "complete-thymus" },
  { ...endocrinePancreas, id: "complete-endocrine-pancreas" },
  { ...kidneyLeft, id: "complete-kidney-left" },
  { ...kidneyRight, id: "complete-kidney-right" },
  { ...ureterLeft, id: "complete-ureter-left" },
  { ...ureterRight, id: "complete-ureter-right" },
  { ...urinaryBladder, id: "complete-urinary-bladder" },
  { ...smallIntestine, id: "complete-small-intestine" },
  { ...largeIntestine, id: "complete-large-intestine" },
  { ...liver, id: "complete-liver" },
  { ...digestivePancreas, id: "complete-digestive-pancreas" },
];

export const anatomySystemModels: Record<AnatomySystemSlug, AnatomySystemModelConfig> = {
  "kidneys-urinary-system": {
    slug: "kidneys-urinary-system",
    title: "Kidneys and urinary system",
    shortTitle: "Kidneys",
    route: "/science/body/kidneys-urinary-system",
    accent: "#d18470",
    summary: "Rotate the body, reveal the urinary tract, or isolate it for a closer look.",
    panelKnown: "Microplastics have been reported in human kidney tissue, confirming that exposure can reach a filtering organ.",
    panelUncertain: "Researchers do not yet know whether particles are cleared, retained, or harmful to kidney function.",
    structures: ["Left kidney", "Right kidney", "Left ureter", "Right ureter", "Urinary bladder"],
    scopeNote: "An educational orientation using the principal urinary structures available in the HRA female reference model.",
    reviewStatus: "source-review",
    models: [kidneyLeft, kidneyRight, ureterLeft, ureterRight, urinaryBladder],
  },
  "digestive-system": {
    slug: "digestive-system",
    title: "Digestive system",
    shortTitle: "Digestive",
    route: "/science/body/digestive-system",
    accent: "#aabd74",
    summary: "Follow the main digestive organs in body context, then remove the exterior shell.",
    panelKnown: "Food and water are major exposure routes, and particles have been detected in human stool.",
    panelUncertain: "Human effects on the gut barrier, inflammation, and microbiome remain unresolved.",
    structures: ["Small intestine", "Large intestine", "Liver", "Pancreas"],
    scopeNote: "A focused educational assembly of four principal HRA digestive reference surfaces, not a complete clinical gastrointestinal atlas.",
    reviewStatus: "source-review",
    models: [smallIntestine, largeIntestine, liver, digestivePancreas],
  },
  "endocrine-metabolic-system": {
    slug: "endocrine-metabolic-system",
    title: "Endocrine and metabolic system",
    shortTitle: "Endocrine",
    route: "/science/body/endocrine-metabolic-system",
    accent: "#d7a75e",
    summary: "See selected hormone-producing tissues in whole-body context or isolate them.",
    panelKnown: "Plastic-associated chemicals have a broader endocrine evidence base than microplastic particles themselves.",
    panelUncertain: "Direct effects of microplastic particles on human hormone signaling are still being studied.",
    structures: ["Pancreas", "Thymus", "Left ovary", "Right ovary"],
    scopeNote: "This limited scene does not fabricate missing glands such as the thyroid, pituitary, or adrenals.",
    reviewStatus: "source-review",
    models: [endocrinePancreas, thymus, endocrineOvaryLeft, endocrineOvaryRight],
  },
  skin: {
    slug: "skin",
    title: "Skin and exterior surface",
    shortTitle: "Skin",
    route: "/science/body/skin",
    accent: "#d9aa87",
    summary: "Rotate the complete exterior or make the body translucent to see the skin as its outer boundary.",
    panelKnown: "Healthy, intact skin appears to block most microplastic particles.",
    panelUncertain: "Nanoplastics, damaged skin, and plastic-associated chemicals remain separate research questions.",
    structures: ["Complete female exterior skin surface"],
    scopeNote: "A whole-body HRA reference surface, not a patient scan, diagnostic model, or microscopic skin-layer reconstruction.",
    surfaceSystem: true,
    reviewStatus: "source-review",
    models: [],
  },
  "whole-body-atlas": {
    slug: "whole-body-atlas",
    title: "Reference anatomy atlas",
    shortTitle: "Anatomy atlas",
    route: "/science",
    accent: "#d7a75e",
    summary: "Rotate a female reference body, switch general anatomy layers, or focus one available system at a time.",
    panelKnown: "This viewer places compatible licensed reference surfaces into one navigation space for orientation. It does not imply that every model on the site belongs to one individual or life stage.",
    panelUncertain: "Reference geometry varies by source model and body context. This is an educational reference assembly, not a complete clinical atlas or a patient-specific reconstruction.",
    structures: [
      "Female exterior reference surface",
      "Brain, heart, and blood vasculature",
      "Pelvic skeleton",
      "Selected endocrine tissues: thymus and pancreas",
      "Kidneys, ureters, and bladder",
      "Small and large intestine, liver, and pancreas",
    ],
    scopeNote: "Pregnancy, fetal, female-reproductive, and male testicular reference models remain in their dedicated chapters and are intentionally not overlaid here. The atlas also does not include every organ, gland, bone, or microscopic tissue layer.",
    compositeSystem: true,
    reviewStatus: "partial",
    statusLabel: "Educational reference assembly",
    groups,
    models: completeModels,
  },
};

export function getAnatomySystemModel(slug: string) {
  const config = anatomySystemModels[slug as AnatomySystemSlug];
  if (!config) throw new Error(`Unknown anatomy system: ${slug}`);
  return config;
}

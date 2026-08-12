export type LearningSeriesItem = {
  number: string;
  step: number;
  dayOffset: number;
  title: string;
  eyebrow: string;
  text: string;
  href: string;
  emailSubject: string;
  emailLead: string;
  carryForward: string;
};

export type ChallengeTask = {
  day: number;
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
};

export const learningSeriesKey = "haddad-foundations-v1";

export const learningSeries: LearningSeriesItem[] = [
  {
    number: "01",
    step: 1,
    dayOffset: 1,
    title: "How detection works",
    eyebrow: "Methods before meaning",
    text: "Learn how samples are collected, prepared, measured, and protected from contamination.",
    href: "/science/how-detection-works",
    emailSubject: "Field Note 1: How scientists find microplastics",
    emailLead: "Before a health claim can be evaluated, researchers must first show what was measured, in which sample, with which instrument, and under which contamination controls.",
    carryForward: "Detection establishes presence in a defined sample. It does not by itself establish source, dose, biological effect, or disease.",
  },
  {
    number: "02",
    step: 2,
    dayOffset: 4,
    title: "The exposome",
    eyebrow: "Lifetime context",
    text: "Connect air, water, food, products, lifestyle, time, and individual response.",
    href: "/science/exposome",
    emailSubject: "Field Note 2: One exposure is never the whole story",
    emailLead: "The exposome is a way to think about the combined effect of what a person encounters across a lifetime rather than treating one object or one day as the entire explanation.",
    carryForward: "Exposure, time, genetics, nutrition, exercise, age, and other factors interact. The framework is context, not an individual risk calculator.",
  },
  {
    number: "03",
    step: 3,
    dayOffset: 7,
    title: "Heart and arteries",
    eyebrow: "Association without overstatement",
    text: "Read the linked plaque and coronary-blood findings without turning association into causation.",
    href: "/science/body/cardiovascular-system",
    emailSubject: "Field Note 3: What the cardiovascular studies actually found",
    emailLead: "Human studies have reported plastic-derived material in diseased artery plaque and in coronary blood. These findings are important signals, but the study designs cannot prove that plastic directly caused a heart attack or stroke.",
    carryForward: "Established cardiovascular risk factors remain the primary prevention priorities. The plastic findings are a research question, not a replacement for standard care.",
  },
  {
    number: "04",
    step: 4,
    dayOffset: 10,
    title: "Female reproductive health",
    eyebrow: "Tissue detection and fertility questions",
    text: "Connect follicular-fluid evidence with ovarian, uterine, hormone, and fertility questions.",
    href: "/science/body/female-reproductive-health",
    emailSubject: "Field Note 4: Female reproductive health and the evidence boundary",
    emailLead: "Microplastics have been reported in female reproductive samples, including follicular fluid in a linked human study. Detection raises questions about exposure, but it does not establish impaired fertility or reproductive disease.",
    carryForward: "Separate verified study findings from broader supplied narrative, and keep fertility decisions within qualified medical care.",
  },
  {
    number: "05",
    step: 5,
    dayOffset: 13,
    title: "Endocrine and metabolic system",
    eyebrow: "Particles are not the same as chemicals",
    text: "Keep plastic particles distinct from BPA, phthalates, and other endocrine-disrupting chemicals.",
    href: "/science/body/endocrine-metabolic-system",
    emailSubject: "Field Note 5: Plastic particles versus endocrine-disrupting chemicals",
    emailLead: "The evidence concerning BPA, phthalates, and other plastic-associated chemicals is broader and older than the evidence concerning microplastic particles themselves.",
    carryForward: "Do not use evidence about a chemical additive as proof that a particle causes the same outcome. The two evidence bases must remain distinct.",
  },
  {
    number: "06",
    step: 6,
    dayOffset: 16,
    title: "Kidneys and urinary system",
    eyebrow: "Filtration and elimination",
    text: "Explore filtration, elimination, tissue-detection claims, and the current source-review gap.",
    href: "/science/body/kidneys-urinary-system",
    emailSubject: "Field Note 6: What the kidneys can and cannot tell us yet",
    emailLead: "The kidneys continuously filter the bloodstream, making them important to questions about whether microscopic material is eliminated, retained, or biologically active.",
    carryForward: "The supplied draft does not establish that microplastics cause chronic kidney disease. Primary-source review and better human outcome studies remain necessary.",
  },
  {
    number: "07",
    step: 7,
    dayOffset: 19,
    title: "Skin",
    eyebrow: "A barrier, not a panic point",
    text: "Separate the intact-skin barrier from nanoplastic and personal-care chemical questions.",
    href: "/science/body/skin",
    emailSubject: "Field Note 7: Skin is a barrier first",
    emailLead: "Healthy, intact skin is generally treated as an effective barrier against most microplastic particles. Questions about damaged skin, nanoplastics, and chemical absorption are separate and still developing.",
    carryForward: "Inhalation and ingestion remain the primary exposure routes described in the supplied material. Ordinary skin contact should not be framed as a proven disease pathway.",
  },
  {
    number: "08",
    step: 8,
    dayOffset: 22,
    title: "Digestive system",
    eyebrow: "Entry, passage, and uncertainty",
    text: "Follow the path from food and water through the gut barrier, circulation, and elimination.",
    href: "/science/body/digestive-system",
    emailSubject: "Field Note 8: The digestive system is an exposure pathway",
    emailLead: "Food and water can carry particles into the digestive tract. Human stool findings show that at least some ingested material passes through, while questions about absorption and long-term biological effects remain open.",
    carryForward: "Laboratory and animal findings about inflammation or the microbiome cannot be presented as proof of human digestive disease.",
  },
  {
    number: "09",
    step: 9,
    dayOffset: 26,
    title: "Pregnancy and early life",
    eyebrow: "No blame, established care first",
    text: "Review placental detection, broader early-life claims, and the no-blame medical boundary.",
    href: "/science/body/pregnancy-early-life",
    emailSubject: "Field Note 9: Pregnancy, the placenta, and careful language",
    emailLead: "A linked exploratory study detected pigmented microparticles in placental tissue. Broader early-life detection claims in the supplied draft still require their exact primary sources.",
    carryForward: "Detection does not prove miscarriage, birth defects, developmental disorders, or childhood disease. Established prenatal, feeding, sterilization, and food-safety guidance stays first.",
  },
  {
    number: "10",
    step: 10,
    dayOffset: 30,
    title: "Reduce exposure",
    eyebrow: "Progress, not perfection",
    text: "Turn awareness into one practical, repeatable change instead of a purity test.",
    href: "/solutions/reduce-exposure",
    emailSubject: "Field Note 10: Choose one change you can keep",
    emailLead: "Completely avoiding plastic is neither realistic nor necessary. Start with a repeated source that is practical to change, especially around hot food, drinks, storage, dust, clothing, or personal care.",
    carryForward: "Small, consistent changes are more useful than dramatic, short-lived efforts. Keep medical, hygiene, food-safety, and accessibility needs first.",
  },
];

export const sevenDayChallenge: ChallengeTask[] = [
  { day: 1, title: "Notice what repeats", text: "Write down the three plastic contacts that repeat most often in your day. Choose only one to work on first.", href: "/solutions/reduce-exposure", linkLabel: "Use the exposure guide" },
  { day: 2, title: "Change one hot-food habit", text: "Move one reheating or hot-food routine away from plastic when a safe practical alternative is available.", href: "/resources/heating-food-in-plastic", linkLabel: "Review the heat guide" },
  { day: 3, title: "Choose a reusable drink container", text: "Use a glass or stainless-steel bottle or cup for one routine that normally relies on disposable plastic.", href: "/resources/microplastics-drinking-water-filter-guide", linkLabel: "Review the water guide" },
  { day: 4, title: "Store one meal differently", text: "Use glass, ceramic, or stainless steel for one leftover or prepared meal when practical.", href: "/resources/plastic-kitchen-conversion", linkLabel: "Open the kitchen guide" },
  { day: 5, title: "Remove one disposable item", text: "Choose one recurring single-use cup, utensil, plate, or takeout container to avoid or replace.", href: "/resources/single-use-plastic-foodware", linkLabel: "Open the single-use guide" },
  { day: 6, title: "Improve one indoor-air routine", text: "Use a damp-dusting, vacuuming, or ventilation routine that fits your home and outdoor-air conditions.", href: "/resources/microplastics-indoor-dust", linkLabel: "Open the indoor-dust guide" },
  { day: 7, title: "Keep what worked", text: "Review the week. Keep the one change that felt realistic, and explain one evidence-aware idea to someone else.", href: "/editorial-policy", linkLabel: "Use the evidence standard" },
];

const thirtyDayTitles = [
  ["Map your routine", "List repeated plastic contact around food, drinks, storage, clothing, dust, and personal care."],
  ["Choose one priority", "Pick the highest-frequency contact that is realistic to change this month."],
  ["Stop one hot-plastic habit", "Use a safe non-plastic alternative for one reheating or hot-food routine."],
  ["Change one drink routine", "Use glass or stainless steel for one drink you have often."],
  ["Change one storage routine", "Store one recurring leftover or packed meal without plastic when practical."],
  ["Review your water context", "Check local water information and the maintenance needs of any filter you use or consider."],
  ["Week-one review", "Keep the change that worked. Do not add another simply to make the list longer."],
  ["Remove one disposable item", "Target one recurring cup, utensil, plate, bag, or takeout container."],
  ["Damp dust one zone", "Clean one high-use room in a way that removes dust rather than redistributing it."],
  ["Check your vacuum setup", "Confirm that the vacuum is sealed and that filters are maintained according to instructions."],
  ["Ventilate when appropriate", "Open windows or use ventilation only when outdoor air quality, weather, and safety allow."],
  ["Review one garment", "When replacement is already needed, compare durable natural and synthetic options for the actual use."],
  ["Keep serviceable clothing", "Avoid replacing a usable wardrobe simply to complete a challenge."],
  ["Week-two review", "Note which home or clothing change is likely to last."],
  ["Read how detection works", "Learn why collection, blanks, preparation, instrument choice, and contamination control matter."],
  ["Read the exposome", "Place individual plastic choices inside a wider lifetime environmental context."],
  ["Read one verified study chapter", "Choose a study from the Science page and read its sample, method, finding, and limitations."],
  ["Practice the claim ladder", "Rewrite one headline so detection, association, and causation are not confused."],
  ["Compare particles and chemicals", "Keep microplastic-particle evidence separate from BPA, phthalate, and other chemical evidence."],
  ["Choose one body-system overview", "Read its known-versus-uncertain section before sharing the topic."],
  ["Week-three review", "Write one sentence that accurately states what the evidence does not yet show."],
  ["Review one personal-care product", "Check whether a product contains unnecessary synthetic polymers or plastic-associated ingredients, without assuming a health effect."],
  ["Use one product longer", "Prioritize durability and maintenance over replacing items for appearance alone."],
  ["Plan one low-plastic meal routine", "Choose a fresh or minimally packaged option when it fits budget, access, and dietary needs."],
  ["Prepare a reusable kit", "Place the cup, bottle, container, or utensils you actually use where they are easy to remember."],
  ["Share one accurate finding", "Name the study type and its limit when you discuss it with another person."],
  ["Invite one practical change", "Ask a household, school, or workplace to test one realistic reduction rather than demand perfection."],
  ["Review health and safety boundaries", "Keep medical care, hygiene, food safety, infant feeding, accessibility, and emergencies ahead of plastic reduction."],
  ["Choose the next month’s habit", "Add only one new change after the first has become routine."],
  ["Close the loop", "Record what changed, what did not, and which evidence question you want to follow next."],
] as const;

export const thirtyDayChallenge: ChallengeTask[] = thirtyDayTitles.map(([title, text], index) => ({
  day: index + 1,
  title,
  text,
  href: index === 14 ? "/science/how-detection-works"
    : index === 15 ? "/science/exposome"
      : index === 16 ? "/science"
        : index === 21 ? "/resources/personal-care-cosmetics-plastic"
          : index === 27 ? "/medical-disclaimer"
            : "/solutions/reduce-exposure",
  linkLabel: index === 14 ? "Open detection methods"
    : index === 15 ? "Open the exposome"
      : index === 16 ? "Open the study record"
        : index === 21 ? "Open the personal-care guide"
          : index === 27 ? "Read the medical boundary"
            : "Use the exposure guide",
}));

export function getLearningSeriesItem(step: number) {
  return learningSeries.find((item) => item.step === step);
}

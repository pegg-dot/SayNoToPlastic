export const detectionSteps = [
  {
    number: "01",
    title: "Collect a sample",
    text: "Researchers begin with blood, tissue, breast milk, placental tissue, stool, or another defined biological sample.",
  },
  {
    number: "02",
    title: "Prepare it carefully",
    text: "Fats, proteins, and other biological material are removed while the team attempts to preserve any particles that may be present.",
  },
  {
    number: "03",
    title: "Analyze the remaining material",
    text: "Specialized instruments examine particle size, shape, mass, or spectral characteristics, depending on the study method.",
  },
  {
    number: "04",
    title: "Identify the polymer",
    text: "Researchers compare the chemical signature with known materials such as PE, PP, PET, PS, and PVC.",
  },
] as const;

export const commonPolymers = [
  { abbreviation: "PE", name: "Polyethylene", examples: "Bottles, bags, films, and packaging" },
  { abbreviation: "PP", name: "Polypropylene", examples: "Food containers, caps, fibers, and household products" },
  { abbreviation: "PET", name: "Polyethylene terephthalate", examples: "Drink bottles, packaging, and polyester textiles" },
  { abbreviation: "PS", name: "Polystyrene", examples: "Foam and rigid food-service materials" },
  { abbreviation: "PVC", name: "Polyvinyl chloride", examples: "Construction, medical, and household materials" },
] as const;

export const detectionContent = {
  title: "How Scientists Detect Microplastics",
  subtitle: "Finding the invisible",
  description: "A plain-language guide to sample collection, laboratory preparation, polymer identification, contamination control, and the limits of detection studies.",
  sections: [
    {
      id: "why-detection-matters",
      title: "Why detection matters",
      paragraphs: [
        "Microplastics and nanoplastics can be far too small to see with the naked eye. Scientists therefore rely on laboratory technology that can identify not only whether plastic-derived material is present, but also its size, shape, mass, or chemical composition.",
        "Before researchers can ask whether a material affects health, they must answer a more basic question: is it actually present in the sample? Improvements in analytical methods have made it possible to measure material that previously went unnoticed. The supplied draft describes reports across blood, brain, arteries, lungs, reproductive organs, placenta, breast milk, and other human samples; each finding still has to be judged by its own method and source record.",
      ],
    },
    {
      id: "how-it-works",
      title: "How scientists find microplastics",
      paragraphs: [
        "Detection begins with a defined biological sample. The sample is prepared to remove biological material while preserving possible particles. Researchers then use instruments selected for the question they are asking.",
        "Different methods measure different things. Some estimate polymer mass. Others visualize particles, identify spectral signatures, or characterize morphology. Results from different methods should not be treated as perfectly interchangeable.",
      ],
    },
    {
      id: "trust",
      title: "Can we trust these studies?",
      paragraphs: [
        "Because plastic is common in laboratories, clothing, containers, and the surrounding air, contamination control is essential. Strong studies document collection materials, blanks, air controls, instrument cleaning, quality assurance, and the criteria used to identify a polymer.",
        "Methods continue to evolve. A study can be carefully performed and still have limits related to particle size, detection threshold, sample preparation, reference libraries, or the difference between measuring particle count and polymer mass.",
      ],
    },
    {
      id: "meaning",
      title: "What detection can and cannot tell us",
      paragraphs: [
        "Detection establishes that material was measured in a sample using a defined method. It does not automatically establish where the material came from, how long it was present, whether it was absorbed by living tissue, or whether it caused disease.",
        "The next challenge is to connect reliable measurement with exposure pathways, dose, biological response, replication, and human outcomes. Detection is the first step, not the final conclusion.",
      ],
    },
  ],
  takeaways: [
    "Microplastics require specialized laboratory equipment to identify and measure.",
    "Different instruments answer different questions and may report particle count, size, shape, chemistry, or polymer mass.",
    "Strict contamination controls are essential because plastic is common in the environment and the laboratory.",
    "A detected particle is not the same as a diagnosis, mechanism, or proof of harm.",
    "Methods are improving, but comparison across studies still requires care.",
  ],
  sourceDocument: "Detecting microplastics.pdf",
  reviewNote: "This explainer preserves the organization and framing of Dr. Haddad's supplied draft. The verified study record on the Science page links each human study to its original paper and named method.",
} as const;

export type ExposomeCategory = {
  id: string;
  title: string;
  summary: string;
  examples: string[];
  related: { label: string; href: string }[];
};

export const exposomeCategories: ExposomeCategory[] = [
  {
    id: "air",
    title: "Air",
    summary: "What we breathe includes outdoor pollution, indoor dust, pollen, fibers, and other particles.",
    examples: ["PM2.5", "Dust", "Pollen", "Microplastics"],
    related: [
      { label: "Indoor dust guide", href: "/resources/microplastics-indoor-dust" },
      { label: "Synthetic clothing and fibers", href: "/resources/synthetic-clothing-microfibers" },
    ],
  },
  {
    id: "water",
    title: "Water",
    summary: "Drinking water, bottled water, plumbing, treatment, and household filtration are part of the exposure picture.",
    examples: ["Drinking water", "Bottled water", "Local water systems", "Plastic contact"],
    related: [
      { label: "Drinking water guide", href: "/resources/microplastics-drinking-water-filter-guide" },
      { label: "Practical exposure reduction", href: "/solutions/reduce-exposure" },
    ],
  },
  {
    id: "food",
    title: "Food",
    summary: "Food production, processing, packaging, additives, storage, and heat all shape repeated contact.",
    examples: ["Packaging", "Processing", "Pesticides", "Additives"],
    related: [
      { label: "Digestive system", href: "/science/body/digestive-system" },
      { label: "Heating and storing food", href: "/resources/heating-food-in-plastic" },
    ],
  },
  {
    id: "products",
    title: "Products",
    summary: "Cosmetics, cleaning products, clothing, furniture, and household materials create many forms of contact.",
    examples: ["Cosmetics", "Cleaning products", "Clothing", "Furniture", "Plastics"],
    related: [
      { label: "Skin", href: "/science/body/skin" },
      { label: "Personal care guide", href: "/resources/personal-care-cosmetics-plastic" },
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    summary: "Smoking, exercise, stress, sleep, work, and daily routines influence how the body responds to the world around it.",
    examples: ["Smoking", "Exercise", "Stress", "Sleep"],
    related: [
      { label: "Cardiovascular system", href: "/science/body/cardiovascular-system" },
      { label: "Endocrine and metabolic system", href: "/science/body/endocrine-metabolic-system" },
    ],
  },
];

export const exposomeContent = {
  title: "The Exposome",
  subtitle: "Everything around you shapes everything within you",
  description: "The exposome is the combined effect of the air, water, food, products, places, and behaviors encountered across a lifetime.",
  bodyResponse: ["Genetics", "Nutrition", "Exercise", "Age"],
  closing: "Health is shaped not by a single exposure, but by the combined effect of what a person encounters across a lifetime and how the body responds, influencing long-term health.",
  sourceDocument: "Exposome diagram.pdf",
} as const;

export const reduceExposureGroups = [
  {
    id: "food-drink",
    number: "01",
    title: "Food and drink",
    summary: "Start with the plastic that repeatedly touches what you eat and drink.",
    actions: [
      "Replace frequently used plastic kitchen items with wood, ceramic, stainless steel, or glass when practical.",
      "Avoid routine plastic water bottles and use glass or stainless-steel drinkware.",
      "Compare reverse osmosis or another maintained water filter with local water quality and household needs.",
      "Avoid heating food in plastic containers.",
      "Store leftovers in glass, ceramic, or stainless steel when practical.",
      "Reduce single-use plastic foodware and choose fresh or minimally processed foods over heavily packaged alternatives when practical.",
    ],
    links: [
      { label: "Water guide", href: "/resources/microplastics-drinking-water-filter-guide" },
      { label: "Kitchen conversion", href: "/resources/plastic-kitchen-conversion" },
      { label: "Single-use foodware", href: "/resources/single-use-plastic-foodware" },
    ],
  },
  {
    id: "home-air",
    number: "02",
    title: "Home and indoor air",
    summary: "Dust, textiles, furnishings, ventilation, and cleaning shape the indoor environment.",
    actions: [
      "Vacuum and dust regularly using a well-sealed machine with a HEPA filter when possible.",
      "Use damp cleaning methods that remove dust rather than repeatedly moving it into the air.",
      "Ventilate the home when outdoor air quality and weather make it reasonable.",
      "Focus on repeated routines rather than trying to create a particle-free home.",
    ],
    links: [
      { label: "Indoor dust guide", href: "/resources/microplastics-indoor-dust" },
      { label: "Children and household priorities", href: "/resources/children-household-plastic-priorities" },
    ],
  },
  {
    id: "clothing-care",
    number: "03",
    title: "Clothing and personal care",
    summary: "Choose durable materials and review the products that contact skin every day.",
    actions: [
      "Choose natural fibers such as cotton, linen, wool, or hemp when a garment already needs replacement and the material fits the use.",
      "Keep serviceable clothing in use instead of replacing an entire wardrobe.",
      "Review cosmetics and personal-care products for unnecessary synthetic polymers and plastic-associated endocrine-disrupting chemicals.",
      "Prioritize products that are useful, maintainable, and appropriate for the person using them.",
    ],
    links: [
      { label: "Synthetic clothing guide", href: "/resources/synthetic-clothing-microfibers" },
      { label: "Personal care guide", href: "/resources/personal-care-cosmetics-plastic" },
      { label: "Skin overview", href: "/science/body/skin" },
    ],
  },
  {
    id: "habit",
    number: "04",
    title: "Build one habit at a time",
    summary: "The goal is not perfection. The goal is a small change that can be repeated for years.",
    actions: [
      "Identify the highest-frequency plastic contact in your routine.",
      "Choose one realistic replacement or behavior change.",
      "Keep established medical, food-safety, hygiene, and accessibility guidance first.",
      "Review what worked before adding another change.",
      "Share one clear, evidence-aware idea with another person.",
    ],
    links: [
      { label: "12-step quick action card", href: "/quick-action-card" },
      { label: "Choose one next change", href: "/solutions#planner" },
      { label: "Join the community", href: "/community" },
    ],
  },
] as const;

export const reduceExposureContent = {
  title: "How to Reduce Your Exposure",
  subtitle: "Small changes can make a big difference",
  description: "A practical, no-perfection approach to reducing repeated plastic exposure across food, water, heat, storage, clothing, dust, indoor air, and personal care.",
  introduction: [
    "Microplastics have become part of the modern environment and have been detected in air, water, food, and multiple human tissues.",
    "This is not a story about perfection. Completely avoiding plastic is neither realistic nor necessary. The goal is to identify the biggest repeated sources and make simple changes that can reduce exposure across a lifetime.",
    "Think of it as improving the environment one decision at a time.",
  ],
  takeaways: [
    "You do not need to eliminate plastic from your life to make a difference.",
    "Focus first on the biggest and most practical sources of repeated exposure.",
    "Small, consistent changes are more useful than dramatic, short-lived efforts.",
    "Improving the environment around you is a long-term investment, not an emergency cleanse.",
    "Awareness is the first step toward meaningful action.",
  ],
  reflection: "Science helps us understand the problem. Small daily choices become the response. The goal is not fear; it is informed action that protects health, family, and future generations one choice at a time.",
  sourceDocument: "Reduce exposure.pdf",
} as const;

export type BodySystemLink = {
  label: string;
  href: string;
  note?: string;
};

export type BodySystemSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type BodySystemArticle = {
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  kicker: string;
  summary: string;
  routeLabel: string;
  heroFact: string;
  heroFactLabel: string;
  accent: string;
  sections: BodySystemSection[];
  keyTakeaways: string[];
  known: string[];
  uncertain: string[];
  relatedEvidence: BodySystemLink[];
  relatedGuides: BodySystemLink[];
  primarySources: BodySystemLink[];
  sourceDocument: string;
  reviewStatus: "verified" | "partial" | "source-review";
  reviewNote: string;
  updatedDate: string;
};

export const bodySystems: BodySystemArticle[] = [
  {
    slug: "cardiovascular-system",
    navLabel: "Heart and arteries",
    title: "The Cardiovascular System",
    subtitle: "What happens when plastic particles reach the heart and blood vessels?",
    kicker: "Heart and circulation",
    summary: "Human studies have detected plastic-derived material in diseased artery plaque and in coronary blood. The results are important associations, not proof that plastic directly causes heart attacks or strokes.",
    routeLabel: "Heart and blood vessels",
    heroFact: "2",
    heroFactLabel: "human cardiovascular studies summarized on this site",
    accent: "heart",
    sections: [
      {
        id: "overview",
        title: "A system that reaches every organ",
        paragraphs: [
          "The cardiovascular system delivers oxygen and nutrients throughout the body. With every heartbeat, blood travels through a vast network of vessels that sustains cells and tissues. The supplied draft describes that network as nearly 60,000 miles of blood vessels.",
          "For decades, cardiologists have focused on established risk factors such as high blood pressure, elevated cholesterol, diabetes, smoking, obesity, and lack of exercise. Those remain the primary drivers of cardiovascular disease.",
          "Researchers are now asking whether environmental pollutants, including microplastics and nanoplastics, may also interact with the cardiovascular system.",
        ],
      },
      {
        id: "why-it-matters",
        title: "Why the cardiovascular system matters",
        paragraphs: [
          "Blood vessels are in constant contact with what enters the bloodstream. If microscopic plastic particles are inhaled or swallowed and later reach the circulation, the cardiovascular system is one of the first places where they may interact with the body.",
          "The central question is whether particles simply travel through the circulation, accumulate in already diseased areas, or contribute to inflammation, plaque instability, or vessel injury.",
        ],
      },
      {
        id: "research",
        title: "What the human research found",
        paragraphs: [
          "A 2024 study in The New England Journal of Medicine examined carotid artery plaques removed during surgery. Microplastics and nanoplastics were detected in more than half of the plaques studied. People whose plaques contained the detected material had a higher combined rate of heart attack, stroke, or death during follow-up than people whose plaques did not contain detectable material.",
          "A 2026 study in the European Heart Journal examined people undergoing coronary angiography. Plastic particles were detected most often in the acute-heart-attack group: 84 percent, compared with 40 percent in chronic coronary disease and 32 percent in people with normal coronary arteries. The heart-attack group also had the highest measured concentrations and the widest variety of polymers. Polyethylene was the most frequently detected polymer, and higher particle measurements were reported alongside higher inflammatory markers.",
          "Both studies are observational. They identify important signals and associations, but they cannot determine whether plastic caused the cardiovascular events.",
        ],
      },
      {
        id: "meaning",
        title: "What this means",
        paragraphs: [
          "These studies show that plastic-derived material can be present inside diseased arteries and in the coronary circulation of people being treated for heart attack.",
          "They do not prove that microplastics directly cause heart attacks, strokes, or cardiovascular disease. Researchers still need to determine whether the particles actively contribute to disease processes or tend to accumulate where disease is already present.",
        ],
      },
    ],
    keyTakeaways: [
      "Microplastics and nanoplastics have been detected in human carotid artery plaques.",
      "Plastic-containing plaques were associated with a higher combined risk during follow-up in a major human study.",
      "A later coronary-blood study found particles most often in the acute-heart-attack group.",
      "The studies demonstrate association, not direct causation.",
      "Established cardiovascular risk factors remain the primary prevention priorities.",
    ],
    known: [
      "Plastic-derived material has been detected in artery plaque and coronary blood.",
      "The two linked studies used different designs and asked different cardiovascular questions.",
      "Higher particle measurements were associated with cardiovascular outcomes or acute presentation in those studies.",
    ],
    uncertain: [
      "Whether plastic particles directly contribute to plaque instability or vessel injury.",
      "Whether they are a causal factor, a marker of other exposures, or material that accumulates in diseased tissue.",
      "How the findings should influence individual testing or treatment; current evidence does not support routine clinical testing.",
    ],
    relatedEvidence: [
      { label: "Heart and arteries study chapter", href: "/science#heart-arteries", note: "Read the sample, method, result, and limitations for both verified studies." },
      { label: "How scientists detect microplastics", href: "/science/how-detection-works", note: "Understand the laboratory methods behind the findings." },
    ],
    relatedGuides: [
      { label: "Carotid plaque study guide", href: "/resources/microplastics-carotid-plaque-study" },
      { label: "Practical exposure reduction", href: "/solutions/reduce-exposure" },
    ],
    primarySources: [
      { label: "The New England Journal of Medicine, 2024", href: "https://pubmed.ncbi.nlm.nih.gov/38446676/", note: "Microplastics and nanoplastics in atheromas and cardiovascular events." },
      { label: "European Heart Journal, 2026", href: "https://academic.oup.com/eurheartj/advance-article/doi/10.1093/eurheartj/ehag447/8725569", note: "Plastic particles in coronary blood across acute, chronic, and control groups." },
    ],
    sourceDocument: "The heart.pdf",
    reviewStatus: "verified",
    reviewNote: "The central human-study claims are linked to the same primary sources used in the site's verified evidence record.",
    updatedDate: "2026-08-08",
  },
  {
    slug: "female-reproductive-health",
    navLabel: "Female reproductive health",
    title: "Female Reproductive Health",
    subtitle: "Protecting the beginning of life",
    kicker: "Ovaries, eggs, uterus, and fertility",
    summary: "Scientists have detected microplastics in female reproductive environments, including follicular fluid. Detection confirms exposure reached those tissues; it does not establish infertility or reproductive disease.",
    routeLabel: "Ovaries and reproductive health",
    heroFact: "14 of 18",
    heroFactLabel: "follicular-fluid samples had particles detected in the linked 2025 study",
    accent: "ovary",
    sections: [
      {
        id: "overview",
        title: "A delicate biological system",
        paragraphs: [
          "The female reproductive system coordinates hormone production, ovulation, fertilization, and pregnancy. Each stage depends on multiple tissues and signals working together.",
          "Scientists are studying whether environmental exposures, including microplastics, nanoplastics, and endocrine-disrupting chemicals, may influence reproductive health. The research is still evolving.",
        ],
      },
      {
        id: "why-it-matters",
        title: "Why female reproductive health matters",
        paragraphs: [
          "Women are born with the eggs that make up their ovarian reserve. Because those eggs can remain in the body for decades before ovulation, researchers are interested in how lifelong environmental exposures may interact with reproductive tissues.",
          "The topic matters both for the health of women and for questions about future generations.",
        ],
      },
      {
        id: "research",
        title: "What the research has found",
        paragraphs: [
          "Researchers have reported microplastics in female reproductive tissues and environments, including the ovaries, follicular fluid surrounding developing eggs, and uterine tissue.",
          "A 2025 human study detected microplastics in 14 of 18 follicular-fluid samples from women undergoing assisted reproduction. Follicular fluid surrounds and supports a developing egg before ovulation, so the finding shows that exposure reached that immediate reproductive environment.",
          "Researchers are also investigating possible relationships with conditions such as uterine fibroids and endometriosis. The supplied draft does not include primary citations for those claims, and current evidence does not establish that microplastics cause either condition.",
          "Chemicals associated with plastics, including BPA and phthalates, are a related but distinct research area. They should not be treated as interchangeable with the effects of plastic particles themselves.",
        ],
      },
      {
        id: "meaning",
        title: "What this means",
        paragraphs: [
          "The discovery of particles in reproductive tissues confirms that exposure can reach biological environments once assumed to be relatively protected.",
          "Finding particles does not prove they impair fertility, affect egg quality, or directly cause reproductive disease. Researchers are still studying possible effects on egg development, hormone signaling, inflammation, and reproductive outcomes.",
        ],
      },
    ],
    keyTakeaways: [
      "Microplastics have been reported in female reproductive tissues and environments.",
      "A linked 2025 study detected particles in follicular fluid surrounding developing eggs.",
      "Detection does not establish an effect on fertility or pregnancy outcomes.",
      "Plastic-associated endocrine-disrupting chemicals are related to, but distinct from, microplastic particles.",
      "More human research and complete primary-source review are needed.",
    ],
    known: [
      "The linked follicular-fluid study detected particles in 14 of 18 samples.",
      "Follicular fluid is the immediate environment around a developing egg.",
      "The study did not find an association with fertilization, miscarriage, or live birth in that small group.",
    ],
    uncertain: [
      "Whether long-term exposure changes egg quality, ovarian reserve, or fertility.",
      "Whether reported particles in uterine tissue are related to fibroids or endometriosis.",
      "How particle exposure and plastic-associated chemicals interact across a lifetime.",
    ],
    relatedEvidence: [
      { label: "Ovary and developing eggs study chapter", href: "/science#ovary" },
      { label: "Pregnancy and early life", href: "/science/body/pregnancy-early-life" },
      { label: "Endocrine and metabolic system", href: "/science/body/endocrine-metabolic-system" },
    ],
    relatedGuides: [
      { label: "Pregnancy and placenta guide", href: "/resources/microplastics-placenta-pregnancy" },
      { label: "Personal care and cosmetics guide", href: "/resources/personal-care-cosmetics-plastic" },
    ],
    primarySources: [
      { label: "Ecotoxicology and Environmental Safety, 2025", href: "https://pubmed.ncbi.nlm.nih.gov/39947063/", note: "Microplastics in human follicular fluid." },
    ],
    sourceDocument: "Female reproductive.pdf",
    reviewStatus: "partial",
    reviewNote: "The follicular-fluid result is linked to a verified primary paper. Additional claims from the supplied draft require a complete primary bibliography before production publication.",
    updatedDate: "2026-08-08",
  },
  {
    slug: "endocrine-metabolic-system",
    navLabel: "Endocrine and metabolic",
    title: "The Endocrine and Metabolic System",
    subtitle: "The body's chemical messengers",
    kicker: "Hormones, metabolism, and signaling",
    summary: "The endocrine system is a network of hormone-producing tissues. The evidence for endocrine-disrupting chemicals is much broader than the still-developing evidence for microplastic particles themselves.",
    routeLabel: "Hormones and metabolism",
    heroFact: "2",
    heroFactLabel: "different evidence questions: plastic particles and plastic-associated chemicals",
    accent: "endocrine",
    sections: [
      {
        id: "overview",
        title: "The body's chemical messengers",
        paragraphs: [
          "The endocrine system is a network of glands and tissues that produces hormones. Those chemical messengers help regulate growth, metabolism, reproduction, sleep, mood, energy, and many other functions.",
          "Because hormones operate in very small amounts, scientists study whether environmental chemicals can interfere with normal signaling.",
        ],
      },
      {
        id: "why-it-matters",
        title: "Why the endocrine system matters",
        paragraphs: [
          "Unlike the heart or lungs, the endocrine system is not a single organ. It includes the thyroid, pancreas, adrenal glands, ovaries, testes, and other hormone-producing tissues.",
          "Many plastics contain or are manufactured with chemicals such as bisphenols and phthalates. These chemicals have been studied as endocrine disruptors because they may interfere with hormone signaling.",
          "It is important to distinguish these chemicals from microplastic particles. Endocrine-disrupting chemicals have been investigated for decades; research on the endocrine effects of microplastics themselves is much newer.",
        ],
      },
      {
        id: "research",
        title: "What the research is asking",
        paragraphs: [
          "The supplied draft describes human studies linking higher exposure to some endocrine-disrupting chemicals with changes in hormone levels, fertility, puberty, metabolism, obesity, and type 2 diabetes. Those findings do not always prove cause and effect, but they have driven sustained public-health research.",
          "Researchers are now investigating whether microplastics may carry chemicals into the body or contribute through inflammation and oxidative stress. That particle-specific research is still developing.",
          "Scientists are also studying possible relationships with thyroid function, insulin regulation, testosterone, estrogen, and other hormones.",
        ],
      },
      {
        id: "meaning",
        title: "What this means",
        paragraphs: [
          "Hormones work as a coordinated communication system. A disruption can matter only in relation to timing, dose, route, susceptibility, and the specific chemical or particle involved.",
          "The strongest conclusion supported by the supplied material is that plastic-associated chemicals and plastic particles should be discussed separately, with different evidence standards and different levels of certainty.",
        ],
      },
    ],
    keyTakeaways: [
      "The endocrine system regulates many essential body functions.",
      "BPA, phthalates, and related chemicals are not the same thing as microplastic particles.",
      "Plastic-associated chemicals have a larger and longer research record than particle-specific endocrine effects.",
      "Research on whether microplastics influence hormone signaling is still evolving.",
      "Primary citations for the broader endocrine claims were not supplied with the draft and remain a publication gate.",
    ],
    known: [
      "Endocrine tissues form a connected network rather than one isolated organ.",
      "Certain plastic-associated chemicals are studied for their ability to interfere with hormone signaling.",
      "The chemical evidence base and the particle evidence base are different and should not be merged.",
    ],
    uncertain: [
      "Whether everyday microplastic exposure has a measurable endocrine effect in humans.",
      "The relative contribution of particles, additives, inflammation, and other exposures.",
      "What exposure levels, timing, and individual factors would be most important.",
    ],
    relatedEvidence: [
      { label: "Female reproductive health", href: "/science/body/female-reproductive-health" },
      { label: "Testicular tissue study chapter", href: "/science#testicular-tissue" },
      { label: "The exposome", href: "/science/exposome" },
    ],
    relatedGuides: [
      { label: "Personal care and cosmetics", href: "/resources/personal-care-cosmetics-plastic" },
      { label: "Heating and storing food", href: "/resources/heating-food-in-plastic" },
    ],
    primarySources: [],
    sourceDocument: "Endocrine.pdf",
    reviewStatus: "source-review",
    reviewNote: "The supplied narrative did not include its primary bibliography. The page is structured for review, but the broader human claims require source attachment before production signoff.",
    updatedDate: "2026-08-08",
  },
  {
    slug: "kidneys-urinary-system",
    navLabel: "Kidneys and urinary system",
    title: "The Kidneys and Urinary System",
    subtitle: "The body's natural filtration system",
    kicker: "Filtration, circulation, and elimination",
    summary: "The kidneys continuously filter blood. Scientists are studying whether microscopic plastic particles pass through, are eliminated, or remain in kidney tissue, but human outcome evidence is limited.",
    routeLabel: "Kidneys and filtration",
    heroFact: "180 L",
    heroFactLabel: "of blood filtrate processed by the kidneys each day — about 47 gallons in the supplied draft",
    accent: "kidney",
    sections: [
      {
        id: "overview",
        title: "A natural filtration system",
        paragraphs: [
          "The kidneys remove waste products, balance minerals, help regulate blood pressure, and maintain fluid balance. The supplied draft describes them as filtering nearly 180 liters of blood filtrate each day.",
          "Because the kidneys continuously filter the bloodstream, researchers are studying whether they also filter, retain, or eliminate microscopic plastic particles that enter the circulation.",
        ],
      },
      {
        id: "why-it-matters",
        title: "Why the kidneys matter",
        paragraphs: [
          "Material circulating in blood eventually reaches the kidneys. Researchers want to understand whether particles are eliminated, become trapped in tissue, or interact with kidney cells over time.",
          "The smallest particles, including nanoplastics, are of particular interest because size may affect movement across biological barriers.",
        ],
      },
      {
        id: "research",
        title: "What the supplied research summary says",
        paragraphs: [
          "The supplied draft states that microplastics have been detected in donated human kidney tissue. It also describes laboratory studies in which particles were associated with inflammation, oxidative stress, or cellular injury under certain experimental conditions.",
          "Human research remains limited. The supplied material does not establish that microplastics cause chronic kidney disease, kidney failure, or reduced kidney function.",
        ],
      },
      {
        id: "meaning",
        title: "What this means",
        paragraphs: [
          "Detection in kidney tissue would confirm that particles can reach an organ involved in filtration and waste removal. It would not show whether the particles simply pass through or have a lasting biological effect.",
          "Researchers still need better human studies, standardized methods, and direct measures of kidney outcomes.",
        ],
      },
    ],
    keyTakeaways: [
      "The kidneys continuously filter blood and remove waste.",
      "The supplied draft reports detection in donated human kidney tissue.",
      "Laboratory findings cannot be treated as proof of human kidney disease.",
      "There is no definitive evidence in the supplied material that microplastics cause chronic kidney disease.",
      "A complete primary bibliography remains required for publication signoff.",
    ],
    known: [
      "The kidneys are exposed to material circulating in blood.",
      "Particle size is relevant to how material may move through biological systems.",
      "The supplied draft distinguishes tissue detection from demonstrated disease.",
    ],
    uncertain: [
      "How much plastic-derived material reaches or remains in human kidney tissue.",
      "Whether particles are eliminated, retained, or biologically active.",
      "Whether long-term exposure changes kidney function in people.",
    ],
    relatedEvidence: [
      { label: "Bloodstream study chapter", href: "/science#blood" },
      { label: "How scientists detect microplastics", href: "/science/how-detection-works" },
      { label: "The exposome", href: "/science/exposome" },
    ],
    relatedGuides: [
      { label: "Drinking water and filtration", href: "/resources/microplastics-drinking-water-filter-guide" },
      { label: "Practical exposure reduction", href: "/solutions/reduce-exposure" },
    ],
    primarySources: [],
    sourceDocument: "Kidneys.pdf",
    reviewStatus: "source-review",
    reviewNote: "The supplied draft did not include the human kidney-tissue citation or the laboratory references. Those sources must be attached and reviewed before production publication.",
    updatedDate: "2026-08-08",
  },
  {
    slug: "skin",
    navLabel: "Skin",
    title: "The Skin",
    subtitle: "Our largest organ and first line of defense",
    kicker: "Barrier, contact, and personal care",
    summary: "Healthy skin appears to block most microplastic particles. Researchers are still studying nanoplastics, damaged skin, local effects, and plastic-associated chemicals used in products that contact the skin.",
    routeLabel: "Skin and the outside world",
    heroFact: "Barrier first",
    heroFactLabel: "healthy skin is not currently considered a primary route of microplastic entry",
    accent: "skin",
    sections: [
      {
        id: "overview",
        title: "The body's largest organ",
        paragraphs: [
          "Skin forms a protective barrier between the body and the outside world. It helps protect against injury, infection, ultraviolet radiation, moisture loss, and many environmental exposures.",
          "Because skin is in constant contact with clothing, cosmetics, personal-care products, and indoor and outdoor environments, researchers are studying how plastic particles and plastic-associated chemicals interact with it.",
        ],
      },
      {
        id: "why-it-matters",
        title: "Why the skin matters",
        paragraphs: [
          "The outer skin barrier is designed to keep many unwanted substances out. The supplied draft states that healthy, intact skin is generally considered an effective barrier against most microplastics.",
          "Researchers are studying whether very small nanoplastics, damaged skin, or prolonged contact may behave differently.",
        ],
      },
      {
        id: "research",
        title: "What the research is asking",
        paragraphs: [
          "Unlike inhalation and ingestion, the skin is not currently considered a major route by which microplastics enter the body. Most microplastic particles are thought to be too large to penetrate healthy skin.",
          "Researchers are investigating possible local inflammation or oxidative stress and whether the smallest nanoplastics behave differently, particularly when the skin barrier is damaged.",
          "A separate concern involves chemicals associated with plastics and ingredients in cosmetics or personal-care products. Chemical absorption through skin is a different question from particle penetration and must be evaluated separately.",
        ],
      },
      {
        id: "meaning",
        title: "What this means",
        paragraphs: [
          "Current evidence, as summarized in the supplied draft, supports a reassuring first point: intact skin appears to protect the body from most microplastic particles.",
          "The practical focus is therefore not fear of ordinary skin contact, but careful evaluation of products, ingredients, damaged skin, and the still-developing nanoplastic evidence.",
        ],
      },
    ],
    keyTakeaways: [
      "Healthy skin appears to block most microplastic particles.",
      "Inhalation and ingestion remain the primary exposure routes described in the supplied material.",
      "Nanoplastics and damaged skin remain areas of research.",
      "Particle exposure and chemical absorption are different questions.",
      "The supplied draft requires a complete primary-source bibliography before production signoff.",
    ],
    known: [
      "Skin is an effective biological barrier.",
      "Most microplastic particles are larger than the structures that readily cross intact skin.",
      "Personal-care ingredients and packaging can create chemical and material-contact questions distinct from particle penetration.",
    ],
    uncertain: [
      "Whether nanoplastics cross intact or damaged skin in meaningful amounts.",
      "Whether particles settling on skin produce local effects in people.",
      "How product formulation, duration, and skin condition change real-world exposure.",
    ],
    relatedEvidence: [
      { label: "The exposome", href: "/science/exposome" },
      { label: "Endocrine and metabolic system", href: "/science/body/endocrine-metabolic-system" },
      { label: "How scientists detect microplastics", href: "/science/how-detection-works" },
    ],
    relatedGuides: [
      { label: "Personal care and cosmetics", href: "/resources/personal-care-cosmetics-plastic" },
      { label: "Synthetic clothing and microfibers", href: "/resources/synthetic-clothing-microfibers" },
    ],
    primarySources: [],
    sourceDocument: "Skin.pdf",
    reviewStatus: "source-review",
    reviewNote: "The supplied draft did not include the primary literature behind its skin-barrier and nanoplastic statements. Source attachment remains required before production publication.",
    updatedDate: "2026-08-08",
  },
  {
    slug: "digestive-system",
    navLabel: "Digestive system",
    title: "The Digestive System",
    subtitle: "The gateway between the outside world and the body",
    kicker: "Food, water, gut barrier, and elimination",
    summary: "Food and drinking water are major exposure routes. Most ingested material appears to pass through the digestive tract, while researchers study whether the smallest particles cross the intestinal barrier or affect inflammation and the microbiome.",
    routeLabel: "Food, water, and the gut",
    heroFact: "Primary route",
    heroFactLabel: "ingestion is one of the main ways people encounter microplastics",
    accent: "digestive",
    sections: [
      {
        id: "overview",
        title: "A gateway between the outside world and the body",
        paragraphs: [
          "The digestive system processes food and drink, absorbs nutrients, and eliminates waste. It is also one of the primary ways people encounter microplastics and nanoplastics.",
          "Food, drinking water, and material swallowed from the air can introduce microscopic particles into the gastrointestinal tract.",
        ],
      },
      {
        id: "why-it-matters",
        title: "Why the digestive system matters",
        paragraphs: [
          "The digestive tract contains extensive immune tissue, a large microbial community, and a barrier that regulates what passes into the bloodstream. The supplied draft describes nearly 70 percent of the body's immune cells as associated with the digestive system.",
          "Researchers are studying whether long-term particle exposure affects that barrier, intestinal inflammation, or the gut microbiome.",
        ],
      },
      {
        id: "research",
        title: "What the supplied research summary says",
        paragraphs: [
          "Microplastics have been reported in human stool, confirming that particles are consumed and pass through the digestive system.",
          "Laboratory and animal studies suggest that some very small particles may cross the intestinal barrier, while much of the ingested material appears to be eliminated.",
          "Researchers are investigating possible effects on the gut microbiome, inflammation, and barrier integrity. The supplied draft emphasizes that much of this evidence is not yet direct human-outcome evidence.",
          "The material does not establish that dietary microplastics cause inflammatory bowel disease, Crohn's disease, ulcerative colitis, or colon cancer.",
        ],
      },
      {
        id: "meaning",
        title: "What this means",
        paragraphs: [
          "Every meal is an interaction between the body and the outside environment. The fact that particles enter the digestive system is consistent with widespread exposure.",
          "The more difficult questions concern absorbed dose, particle size, how much remains in the body, and whether repeated exposure over decades changes human health.",
        ],
      },
    ],
    keyTakeaways: [
      "Food and drinking water are major exposure routes described in the supplied material.",
      "Microplastics have been reported in human stool.",
      "Most ingested material appears to be eliminated, while the smallest particles may behave differently.",
      "Microbiome, inflammation, and barrier effects remain active research questions.",
      "The supplied draft does not establish that dietary microplastics cause digestive disease.",
    ],
    known: [
      "Particles can enter the digestive tract through food and water.",
      "Human stool findings indicate that at least some ingested material passes through the body.",
      "Laboratory and animal evidence cannot be assumed to predict human disease.",
    ],
    uncertain: [
      "How much ingested material crosses the intestinal barrier in people.",
      "Whether repeated exposure changes the human microbiome or intestinal inflammation.",
      "Whether any detected changes translate into digestive disease.",
    ],
    relatedEvidence: [
      { label: "Bloodstream study chapter", href: "/science#blood" },
      { label: "How scientists detect microplastics", href: "/science/how-detection-works" },
      { label: "The exposome", href: "/science/exposome" },
    ],
    relatedGuides: [
      { label: "Heating and storing food", href: "/resources/heating-food-in-plastic" },
      { label: "Food packaging and takeout", href: "/resources/food-packaging-takeout-plastic" },
      { label: "Drinking water and filtration", href: "/resources/microplastics-drinking-water-filter-guide" },
    ],
    primarySources: [],
    sourceDocument: "GI system.pdf",
    reviewStatus: "source-review",
    reviewNote: "The supplied draft did not include the stool, barrier, microbiome, or inflammation citations. Those primary sources remain required before production signoff.",
    updatedDate: "2026-08-08",
  },
  {
    slug: "pregnancy-early-life",
    navLabel: "Pregnancy and early life",
    title: "Pregnancy, the Placenta, and Early Life",
    subtitle: "Our first environment begins before birth",
    kicker: "Placenta, fetal development, and the first 1,000 days",
    summary: "The placenta study already linked on this site confirms particle detection in placental tissue. Broader claims about cord blood, amniotic fluid, meconium, breast milk, and fetal tissue require their primary bibliography before production publication.",
    routeLabel: "Pregnancy and the first environment",
    heroFact: "4 of 6",
    heroFactLabel: "placentas contained pigmented microparticles in the linked exploratory study",
    accent: "pregnancy",
    sections: [
      {
        id: "overview",
        title: "Our first environment begins before birth",
        paragraphs: [
          "Before birth, oxygen and nutrients reach the developing baby through the placenta. The placenta is an exchange organ connecting separate maternal and fetal circulations.",
          "The supplied draft asks when plastic exposure begins and describes pregnancy as a critical period because major organs are forming rapidly. Its central framing is that exposure may begin before birth and continue during early infancy.",
        ],
      },
      {
        id: "why-it-matters",
        title: "Why pregnancy and early life matter",
        paragraphs: [
          "During pregnancy, the brain, heart, lungs, kidneys, immune system, and reproductive organs begin to form. Researchers therefore pay close attention to environmental material that may reach maternal or fetal tissues.",
          "The goal of this research is not to assign blame or create fear. It is to understand exposure pathways and identify what evidence can support.",
        ],
      },
      {
        id: "research",
        title: "What the research has found",
        paragraphs: [
          "The site's linked exploratory placenta study found 12 pigmented microparticles across four of six placentas, including particles in fetal-facing tissue, maternal-facing tissue, and membranes. Three particles were identified as polypropylene; the remainder matched man-made pigments or coatings.",
          "The broader supplied draft also describes reported detection in umbilical cord blood, amniotic fluid, meconium, breast milk, and fetal tissue. Those claims are preserved here as source-review items because the PDF did not include the underlying citations.",
          "Detection in any of these samples would demonstrate exposure. It would not prove miscarriage, birth defects, developmental disorders, or childhood disease.",
        ],
      },
      {
        id: "meaning",
        title: "What this means",
        paragraphs: [
          "The verified placenta study changed the assumption that placental tissue is completely isolated from environmental particles.",
          "It remains essential to keep established prenatal care, nutrition, medication, infection-prevention, feeding, sterilization, and food-safety guidance ahead of speculative exposure claims.",
        ],
      },
    ],
    keyTakeaways: [
      "A linked exploratory human study detected pigmented microparticles in four of six placentas.",
      "The supplied draft describes additional early-life detections that still need primary citations attached.",
      "Detection does not prove a pregnancy complication or developmental disorder.",
      "Pregnancy and early life are high-priority research periods because development is rapid.",
      "The site uses a no-blame, established-care-first medical boundary.",
    ],
    known: [
      "The verified placenta study used a plastic-free collection protocol and Raman microspectroscopy.",
      "The study was small and confirmed only three particles as a plastic polymer.",
      "The placenta connects separate maternal and fetal circulations through an exchange surface.",
    ],
    uncertain: [
      "The prevalence and amount of particles across pregnancy and early-life samples.",
      "Whether particles cross from mother to fetus and under what conditions.",
      "Whether detected material affects pregnancy, development, or childhood health.",
    ],
    relatedEvidence: [
      { label: "Pregnancy anatomy chapter", href: "/science#pregnancy" },
      { label: "Placenta study chapter", href: "/science#placenta" },
      { label: "Female reproductive health", href: "/science/body/female-reproductive-health" },
    ],
    relatedGuides: [
      { label: "Pregnancy and placenta guide", href: "/resources/microplastics-placenta-pregnancy" },
      { label: "Infant feeding and plastic bottles", href: "/resources/infant-feeding-plastic-bottles" },
      { label: "Children and household priorities", href: "/resources/children-household-plastic-priorities" },
    ],
    primarySources: [
      { label: "Environment International, 2021", href: "https://pubmed.ncbi.nlm.nih.gov/33395930/", note: "Exploratory human placenta detection study." },
    ],
    sourceDocument: "The first 1000 days.pdf",
    reviewStatus: "partial",
    reviewNote: "The placenta claim is linked to the verified primary study. The broader early-life detection claims need their original citations attached before production publication.",
    updatedDate: "2026-08-08",
  },
];

export const bodySystemBySlug = new Map(bodySystems.map((item) => [item.slug, item]));

export const moreSystemCards = bodySystems.filter((item) => [
  "digestive-system",
  "kidneys-urinary-system",
  "endocrine-metabolic-system",
  "skin",
].includes(item.slug));

export function getBodySystem(slug: string) {
  return bodySystemBySlug.get(slug);
}

export type EvidenceStudy = {
  id: string;
  navLabel: string;
  chapter: string;
  context: "maternal" | "male";
  modelLabel: string;
  modelNote?: string;
  headline: string;
  stat: string;
  statLabel: string;
  finding: string;
  meaning: string;
  studyType: string;
  sample: string;
  method: string;
  limits: string;
  year: string;
  journal: string;
  source: string;
  doi?: string;
};


export type HomepageJourneySource = {
  label: string;
  meta: string;
  href: string;
};

export type HomepageJourneyChapter = {
  slug: string;
  chapter: string;
  context: "maternal" | "male";
  modelLabel: string;
  modelNote?: string;
  title: string;
  stat: string;
  statLabel: string;
  finding: string;
  meaning: string;
  compactFinding?: string;
  compactMeaning?: string;
  details: string;
  sources: HomepageJourneySource[];
  relatedFinding?: {
    eyebrow: string;
    stat: string;
    statLabel: string;
    title: string;
    text: string;
  };
};

export type EvidenceChapter = {
  id: string;
  navLabel: string;
  title: string;
  eyebrow: string;
  introduction?: string;
  studies: EvidenceStudy[];
};

const blood: EvidenceStudy = {
  id: "blood-study",
  navLabel: "Blood",
  chapter: "Circulation",
  context: "maternal",
  modelLabel: "Whole-body circulation view",
  modelNote: "The overview keeps the maternal body, brain, heart, pelvis, fetus and placenta in one shared frame.",
  headline: "Plastic was measured in human blood.",
  stat: "17 of 22",
  statLabel: "people had plastic detected in their blood",
  finding: "Researchers detected plastic polymers in blood from 17 of 22 healthy volunteers. Across all samples, the average measured concentration was 1.6 micrograms per milliliter.",
  meaning: "The study showed that plastic-derived material can enter the bloodstream, giving it a route to circulate through the body.",
  studyType: "Human biomonitoring study",
  sample: "22 healthy adult volunteers",
  method: "Double-shot pyrolysis gas chromatography–mass spectrometry",
  limits: "This small first-of-its-kind study measured polymer mass. It did not determine the health effects of the detected material or how long it remained in the blood.",
  year: "2022",
  journal: "Environment International",
  source: "https://pubmed.ncbi.nlm.nih.gov/35367073/",
  doi: "10.1016/j.envint.2022.107199",
};

const brain: EvidenceStudy = {
  id: "brain-study",
  navLabel: "Brain",
  chapter: "Brain",
  context: "maternal",
  modelLabel: "Brain · inside the maternal skull",
  headline: "The brain held far more plastic than the liver or kidneys.",
  stat: "About 50%",
  statLabel: "higher in 2024 brain samples than in 2016 samples",
  finding: "In postmortem samples, researchers measured substantially more micro- and nanoplastic in brain tissue than in liver or kidney tissue. Measured brain concentrations were also about 50 percent higher in samples collected in 2024 than in 2016.",
  meaning: "The finding shows that the smallest plastic particles can reach the brain, an organ protected by the blood–brain barrier.",
  studyType: "Postmortem human tissue study",
  sample: "52 frontal-cortex specimens: 28 collected in 2016 and 24 in 2024, with liver and kidney comparisons plus separate historical and dementia cohorts",
  method: "Pyrolysis gas chromatography–mass spectrometry supported by microscopy",
  limits: "Postmortem research can show where material was present, not what symptoms it caused. The higher levels in dementia samples do not establish that plastic caused dementia.",
  year: "2025",
  journal: "Nature Medicine",
  source: "https://www.nature.com/articles/s41591-024-03453-1",
  doi: "10.1038/s41591-024-03453-1",
};

const coronaryBlood: EvidenceStudy = {
  id: "acute-heart-attack-study",
  navLabel: "Heart attack",
  chapter: "Heart and arteries",
  context: "maternal",
  modelLabel: "Heart · inside the maternal chest",
  headline: "Plastic was detected most often in people being treated for an acute heart attack.",
  stat: "16 of 19",
  statLabel: "acute-heart-attack patients had particles detected",
  finding: "The study detected micro- and nanoplastics in 16 of 19 acute-heart-attack patients (84.2 percent), compared with 8 of 20 people with chronic coronary syndrome and 7 of 22 controls with normal coronary arteries.",
  meaning: "The acute-heart-attack group had both the highest concentrations and the greatest variety of polymers, with the highest levels measured in blood drawn from the coronary circulation around the heart.",
  studyType: "Cross-sectional coronary-blood study",
  sample: "61 people undergoing coronary angiography: 19 with acute heart attack, 20 with chronic coronary syndrome and 22 controls",
  method: "Pyrolysis gas chromatography–mass spectrometry and laser direct infrared spectroscopy",
  limits: "This study found a strong association at one point in time. It cannot determine whether plastic contributed to the heart attack. Smoking was the only independent predictor in the authors’ adjusted analysis.",
  year: "2026",
  journal: "European Heart Journal",
  source: "https://academic.oup.com/eurheartj/advance-article/doi/10.1093/eurheartj/ehag447/8725569",
  doi: "10.1093/eurheartj/ehag447",
};

const carotidPlaque: EvidenceStudy = {
  id: "artery-plaque-study",
  navLabel: "Artery plaque",
  chapter: "Heart and arteries",
  context: "maternal",
  modelLabel: "Arteries · plaque removed during surgery",
  headline: "Plastic in artery plaque was associated with more heart attacks, strokes and deaths.",
  stat: "4.53×",
  statLabel: "higher combined risk during follow-up",
  finding: "Among 257 people followed after surgery to remove carotid-artery plaque, polyethylene was detected in plaque from 150 people and PVC in plaque from 31. Those with micro- or nanoplastics in their plaque had a higher rate of heart attack, stroke or death from any cause during about 34 months of follow-up.",
  meaning: "This was the first major human study to connect plastic found inside diseased arteries with later cardiovascular outcomes.",
  studyType: "Prospective observational study",
  sample: "257 people who completed follow-up after carotid endarterectomy",
  method: "Pyrolysis gas chromatography–mass spectrometry, stable isotope analysis and electron microscopy",
  limits: "The study was observational. It found an association after statistical adjustment, but it did not prove that the plastic in plaque caused the later events.",
  year: "2024",
  journal: "The New England Journal of Medicine",
  source: "https://pubmed.ncbi.nlm.nih.gov/38446676/",
  doi: "10.1056/NEJMoa2309822",
};

const pregnancy: EvidenceStudy = {
  id: "pregnancy-context",
  navLabel: "Pregnancy",
  chapter: "Pregnancy",
  context: "maternal",
  modelLabel: "Pregnant body, fetus, placenta and amnion",
  modelNote: "Mother and fetus have separate circulations connected through the placenta and umbilical cord.",
  headline: "The placenta is the exchange surface between mother and developing baby.",
  stat: "Two",
  statLabel: "separate circulations connected by the placenta",
  finding: "A mother’s blood delivers oxygen and nutrients to the placenta. The fetus receives them through its own circulation and umbilical cord, while carbon dioxide and other waste travel back across the placenta.",
  meaning: "That makes the placenta an especially important place to investigate environmental exposures during pregnancy.",
  studyType: "Anatomical context",
  sample: "Maternal circulation, placenta, umbilical cord and fetal circulation",
  method: "Established human anatomy and physiology",
  limits: "This chapter explains the biological pathway. The human placenta study below establishes detection in tissue; it does not by itself establish an effect on a pregnancy or baby.",
  year: "Current anatomy",
  journal: "NIH Human Reference Atlas",
  source: "https://3d.nih.gov/collections/hra",
};

const placenta: EvidenceStudy = {
  id: "placenta-study",
  navLabel: "Placenta",
  chapter: "Placenta",
  context: "maternal",
  modelLabel: "Placenta and umbilical vessels",
  headline: "Man-made particles were found on both sides of the placenta.",
  stat: "4 of 6",
  statLabel: "placentas contained pigmented microparticles",
  finding: "Researchers found 12 pigmented microparticles across four placentas: five in fetal-facing tissue, four in maternal-facing tissue and three in the membranes surrounding the fetus. Three were identified as polypropylene; the others matched man-made pigments or coatings.",
  meaning: "The particles were not confined to one outer surface. They reached tissues that support the exchange between mother and developing baby.",
  studyType: "Exploratory human tissue study",
  sample: "Six placentas collected after delivery",
  method: "Raman microspectroscopy with a plastic-free collection protocol",
  limits: "This was a tiny detection study, and only three particles were chemically confirmed as a plastic polymer. It did not measure pregnancy complications, fetal development or the health of the children.",
  year: "2021",
  journal: "Environment International",
  source: "https://pubmed.ncbi.nlm.nih.gov/33395930/",
  doi: "10.1016/j.envint.2020.106274",
};

const follicularFluid: EvidenceStudy = {
  id: "follicular-fluid-study",
  navLabel: "Ovary",
  chapter: "Ovary and developing eggs",
  context: "maternal",
  modelLabel: "Whole ovary · eggs develop in microscopic follicles",
  modelNote: "Follicular fluid is the liquid immediately surrounding and supporting a developing egg inside the ovary.",
  headline: "Plastic was found in the fluid surrounding developing human eggs.",
  stat: "14 of 18",
  statLabel: "follicular-fluid samples had particles detected",
  finding: "Researchers detected microplastics in 14 of 18 follicular-fluid samples from women undergoing assisted reproduction. The reported average concentration was 2,191 particles per milliliter.",
  meaning: "Follicular fluid is the liquid immediately surrounding and supporting a developing egg. The finding shows that plastic exposure reached that reproductive environment.",
  studyType: "Human follicular-fluid study",
  sample: "18 women undergoing assisted reproduction",
  method: "Scanning electron microscopy with energy-dispersive X-ray spectroscopy",
  limits: "The study was small. In this group, the researchers did not find an association with fertilization, miscarriage or live birth, so it cannot establish a human fertility effect.",
  year: "2025",
  journal: "Ecotoxicology and Environmental Safety",
  source: "https://pubmed.ncbi.nlm.nih.gov/39947063/",
  doi: "10.1016/j.ecoenv.2025.117868",
};

const testicularTissue: EvidenceStudy = {
  id: "testicular-tissue-study",
  navLabel: "Testicular tissue",
  chapter: "Testicular tissue",
  context: "male",
  modelLabel: "Separate male reproductive specimen",
  modelNote: "This evidence comes from a separate male anatomical context; it is not part of the maternal model.",
  headline: "Plastic was found in every human testicle sample.",
  stat: "23 of 23",
  statLabel: "human samples had plastic-polymer mass detected",
  finding: "Plastic-derived polymer mass was measured in all 23 archived human testicle samples. The average amount measured in human tissue was 328.44 micrograms per gram—about 2.7 times the average in the dog samples studied alongside them.",
  meaning: "The result confirms that microplastics can reach male reproductive tissue. In the dogs, higher levels of some polymers were associated with lower testicular weight, raising questions for future fertility research.",
  studyType: "Cross-species tissue study",
  sample: "23 archived human testicle samples and 47 canine samples",
  method: "Pyrolysis gas chromatography–mass spectrometry",
  limits: "The archived human samples did not include sperm measurements, so the study could not test human fertility. The testicular-weight association was found in dogs, not people.",
  year: "2024",
  journal: "Toxicological Sciences",
  source: "https://academic.oup.com/toxsci/article/200/2/235/7673133",
  doi: "10.1093/toxsci/kfae060",
};

export const evidenceChapters: EvidenceChapter[] = [
  { id: "blood", navLabel: "Blood", title: "Bloodstream", eyebrow: "How plastic moves", studies: [blood] },
  { id: "brain", navLabel: "Brain", title: "Brain tissue", eyebrow: "Across a protective barrier", studies: [brain] },
  { id: "heart-arteries", navLabel: "Heart & arteries", title: "Heart and arteries", eyebrow: "Two cardiovascular signals", introduction: "One study looked at plastic in coronary blood during a heart attack. Another followed people after plastic was found inside artery plaque.", studies: [coronaryBlood, carotidPlaque] },
  { id: "pregnancy", navLabel: "Pregnancy", title: "Pregnancy", eyebrow: "How mother and baby connect", studies: [pregnancy] },
  { id: "placenta", navLabel: "Placenta", title: "Placenta", eyebrow: "At the exchange surface", studies: [placenta] },
  { id: "ovary", navLabel: "Ovary & eggs", title: "Ovary and developing eggs", eyebrow: "The fluid around an egg", studies: [follicularFluid] },
  { id: "testicular-tissue", navLabel: "Testicular tissue", title: "Testicular tissue", eyebrow: "A separate male study", studies: [testicularTissue] },
];

export const evidenceStudies = evidenceChapters.flatMap((chapter) => chapter.studies);

export const homepageJourney: HomepageJourneyChapter[] = [
  {
    slug: "blood",
    chapter: "Whole body and circulation",
    context: blood.context,
    modelLabel: blood.modelLabel,
    modelNote: blood.modelNote,
    title: "Plastic-derived material was measured in human blood.",
    stat: blood.stat,
    statLabel: blood.statLabel,
    finding: "Plastic polymers were detected in 17 of 22 healthy volunteers.",
    meaning: "This shows plastic-derived material can circulate in blood. The study did not test health effects.",
    compactFinding: "Plastic polymers were detected in 17 of 22 volunteers.",
    compactMeaning: "Presence in blood does not show a health effect.",
    details: `${blood.sample}. ${blood.limits}`,
    sources: [{ label: "Original blood study", meta: `${blood.journal}, ${blood.year}`, href: blood.source }],
  },
  {
    slug: "brain",
    chapter: "Brain",
    context: brain.context,
    modelLabel: brain.modelLabel,
    title: "Plastic-derived material was measured in brain tissue.",
    stat: brain.stat,
    statLabel: brain.statLabel,
    finding: "Brain samples contained more plastic-derived material than liver or kidney samples, and 2024 levels were about 50 percent higher than 2016 levels.",
    meaning: "The smallest particles can reach the brain. This study did not show what symptoms they cause.",
    compactFinding: "Brain samples contained more plastic-derived material than liver or kidney samples.",
    compactMeaning: "The study did not identify symptoms or prove disease.",
    details: `${brain.sample}. ${brain.limits}`,
    sources: [{ label: "Original brain-tissue study", meta: `${brain.journal}, ${brain.year}`, href: brain.source }],
  },
  {
    slug: "heart-arteries",
    chapter: "Heart and arteries",
    context: coronaryBlood.context,
    modelLabel: "Heart and coronary circulation inside the maternal chest",
    modelNote: "The coronary-blood and carotid-plaque studies asked different questions and remain separate evidence records.",
    title: "Particles were detected most often during acute heart attack.",
    stat: coronaryBlood.stat,
    statLabel: coronaryBlood.statLabel,
    finding: "Particles were detected in 16 of 19 heart-attack patients, compared with lower rates in two comparison groups.",
    meaning: "The association is important, but it does not prove plastic caused the heart attack.",
    compactFinding: "Particles were detected most often in the heart-attack group.",
    compactMeaning: "The study found an association, not causation.",
    details: `${coronaryBlood.sample}. ${coronaryBlood.limits}`,
    sources: [
      { label: "Original coronary-blood study", meta: `${coronaryBlood.journal}, ${coronaryBlood.year}`, href: coronaryBlood.source },
      { label: "Original artery-plaque study", meta: `${carotidPlaque.journal}, ${carotidPlaque.year}`, href: carotidPlaque.source },
    ],
    relatedFinding: {
      eyebrow: "Related artery-plaque evidence",
      stat: carotidPlaque.stat,
      statLabel: carotidPlaque.statLabel,
      title: "Plastic in plaque was associated with more cardiovascular events during follow-up.",
      text: "The 2024 study was observational and did not prove causation.",
    },
  },
  {
    slug: "pregnancy-placenta",
    chapter: "Pregnancy and placenta",
    context: placenta.context,
    modelLabel: "Maternal torso, uterus, fetus, umbilical connection and placenta",
    modelNote: pregnancy.modelNote,
    title: "Particles were found on both sides of the placenta.",
    stat: placenta.stat,
    statLabel: placenta.statLabel,
    finding: "Researchers found 12 pigmented particles across four of six placentas.",
    meaning: "Particles reached maternal- and fetal-facing tissue. The study did not test pregnancy outcomes.",
    compactFinding: "Twelve pigmented particles were found across four placentas.",
    compactMeaning: "The small study did not measure pregnancy outcomes.",
    details: `${placenta.sample}. ${placenta.limits}`,
    sources: [
      { label: "Human anatomy reference", meta: pregnancy.journal, href: pregnancy.source },
      { label: "Original placenta study", meta: `${placenta.journal}, ${placenta.year}`, href: placenta.source },
    ],
  },
  {
    slug: "follicular-fluid",
    chapter: "Ovary and developing eggs",
    context: follicularFluid.context,
    modelLabel: follicularFluid.modelLabel,
    modelNote: follicularFluid.modelNote,
    title: "Particles were found in fluid surrounding developing eggs.",
    stat: follicularFluid.stat,
    statLabel: follicularFluid.statLabel,
    finding: "Microplastics were detected in 14 of 18 follicular-fluid samples.",
    meaning: "Exposure reached the immediate environment around developing eggs. Fertility effects remain unknown.",
    compactFinding: "Particles were detected in 14 of 18 follicular-fluid samples.",
    compactMeaning: "The study did not establish a fertility effect.",
    details: `${follicularFluid.sample}. ${follicularFluid.limits}`,
    sources: [{ label: "Original follicular-fluid study", meta: `${follicularFluid.journal}, ${follicularFluid.year}`, href: follicularFluid.source }],
  },
  {
    slug: "endocrine-metabolic-system",
    chapter: "Endocrine and metabolic",
    context: "maternal",
    modelLabel: "Selected hormone-producing tissues in whole-body context",
    modelNote: "The visible scene includes pancreas, thymus, and ovaries. It does not fabricate endocrine tissues that are not represented.",
    title: "Four represented hormone-producing tissues come into view.",
    stat: "4 tissues",
    statLabel: "pancreas, thymus, and both ovaries in this reference",
    finding: "Plastic-associated chemicals such as BPA and phthalates have a broader endocrine evidence base than microplastic particles themselves.",
    meaning: "Whether microplastic particles directly alter human hormone signaling remains under study.",
    compactFinding: "Plastic-associated chemicals have the stronger endocrine evidence base.",
    compactMeaning: "Direct particle effects on human hormones remain uncertain.",
    details: "The endocrine system includes the thyroid, pancreas, adrenal glands, ovaries, testes, and other tissues. The supplied review distinguishes chemical additives from plastic particles and remains source-review gated.",
    sources: [{ label: "Full endocrine overview", meta: "Dr. Haddad source review", href: "/science/body/endocrine-metabolic-system" }],
  },
  {
    slug: "kidneys-urinary-system",
    chapter: "Kidneys and urinary system",
    context: "maternal",
    modelLabel: "Kidneys, ureters, and bladder within the body",
    title: "Five urinary structures form one connected pathway.",
    stat: "5 structures",
    statLabel: "two kidneys, two ureters, and the urinary bladder",
    finding: "The supplied review reports detection in donated human kidney tissue, while the primary citation remains under review.",
    meaning: "Detection would show exposure reached a filtering organ. It would not prove kidney disease.",
    compactFinding: "Particles have been reported in donated human kidney tissue.",
    compactMeaning: "Clearance, retention, and effects on kidney function remain unknown.",
    details: "Researchers are studying whether particles pass through, are eliminated, or remain in kidney tissue. Human outcome evidence remains limited.",
    sources: [{ label: "Full kidney overview", meta: "Body-system overview", href: "/science/body/kidneys-urinary-system" }],
  },
  {
    slug: "skin",
    chapter: "Skin and exterior surface",
    context: "maternal",
    modelLabel: "Complete exterior body surface",
    title: "The exterior surface becomes the primary anatomy.",
    stat: "1 surface",
    statLabel: "the complete female exterior reference body",
    finding: "Most microplastic particles are too large to cross healthy, intact skin.",
    meaning: "Researchers are still studying nanoplastics, damaged skin, and plastic-associated chemicals in personal-care products.",
    compactFinding: "Healthy, intact skin appears to block most microplastic particles.",
    compactMeaning: "Nanoplastics and damaged-skin exposure remain open questions.",
    details: "Current evidence suggests inhalation and ingestion remain the primary exposure routes. Skin research is still developing.",
    sources: [{ label: "Full skin overview", meta: "Body-system overview", href: "/science/body/skin" }],
  },
  {
    slug: "digestive-system",
    chapter: "Digestive system",
    context: "maternal",
    modelLabel: "Intestines, liver, and pancreas in whole-body context",
    title: "Four digestive organs come forward in body context.",
    stat: "4 organs",
    statLabel: "small and large intestine, liver, and pancreas",
    finding: "Microplastics have been detected in stool, confirming that ingested particles pass through the digestive system.",
    meaning: "Most appear to be eliminated. Human effects on the gut barrier, inflammation, and microbiome remain uncertain.",
    compactFinding: "Ingested particles routinely pass through the digestive tract.",
    compactMeaning: "Human effects on the gut barrier and microbiome remain uncertain.",
    details: "Very small particles may cross the intestinal barrier, but much of that evidence comes from laboratory and animal research. Direct links to digestive disease have not been established.",
    sources: [{ label: "Full digestive overview", meta: "Body-system overview", href: "/science/body/digestive-system" }],
  },
  {
    slug: "testicular-tissue",
    chapter: "Testicular tissue",
    context: testicularTissue.context,
    modelLabel: testicularTissue.modelLabel,
    modelNote: testicularTissue.modelNote,
    title: "Plastic-derived polymer mass was measured in testicular tissue.",
    stat: testicularTissue.stat,
    statLabel: testicularTissue.statLabel,
    finding: "Polymer mass was measured in all 23 archived human testicle samples.",
    meaning: "The finding confirms presence in tissue. The study could not test human fertility.",
    compactFinding: "Polymer mass was measured in all 23 archived human samples.",
    compactMeaning: "No sperm data were available, so fertility effects remain unknown.",
    details: `${testicularTissue.sample}. ${testicularTissue.limits}`,
    sources: [{ label: "Original testicular-tissue study", meta: `${testicularTissue.journal}, ${testicularTissue.year}`, href: testicularTissue.source }],
  },

];

export const homepageEvidence = homepageJourney;

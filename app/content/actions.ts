export type ActionStep = {
  number: string;
  title: string;
  shortTitle: string;
  practical: string;
  why: string;
  guide?: string;
  note?: string;
};

export type AuthoredCardAction = {
  number: string;
  text: string;
  reviewNote?: string;
};

/**
 * These are the three core rules printed in Homo Plasticus, page 121.
 * Keep the public wording exact. Supporting detail may explain the rule,
 * but must not replace or soften the rule itself.
 */
export const coreRules = [
  {
    number: "01",
    title: "Don’t heat plastic.",
    detail: "Reheat and serve hot food in glass, ceramic, stainless steel, or another suitable non-plastic material.",
  },
  {
    number: "02",
    title: "Don’t store food in plastic.",
    detail: "Use glass, ceramic, or stainless steel for routine food storage when practical.",
  },
  {
    number: "03",
    title: "Don’t drink from plastic.",
    detail: "Use glass or stainless-steel bottles and cups for the drinks you use most often.",
  },
] as const;

/**
 * Verbatim transcription of the supplied Quick Action Card from Homo Plasticus,
 * page 121. Items 10 and 11 remain author-attributed wording pending final
 * clinical/editorial approval; the website must not silently rewrite the source.
 */
export const authoredQuickActionCard: AuthoredCardAction[] = [
  { number: "01", text: "Drink from glass or stainless steel, never plastic bottles." },
  { number: "02", text: "Filter your water (Reverse osmosis or activated carbon)." },
  { number: "03", text: "Never microwave food in plastic." },
  { number: "04", text: "Store food only in glass, ceramic, or steel." },
  { number: "05", text: "Choose natural fiber clothing (cotton, linen, wool)." },
  { number: "06", text: "Vacuum with a HEPA filter + open windows daily." },
  { number: "07", text: "Avoid canned + heavily packaged foods." },
  { number: "08", text: "Use plastic-free cosmetics and skincare." },
  { number: "09", text: "Reduce takeout containers; bring your own glass/steel." },
  {
    number: "10",
    text: "Sweat regularly (sauna, exercise) to eliminate toxins.",
    reviewNote: "Author wording reproduced verbatim. Evidence does not currently establish sauna or exercise as a treatment that removes microplastics.",
  },
  {
    number: "11",
    text: "Add detox foods: broccoli sprouts, seaweed, cilantro, fiber.",
    reviewNote: "Author wording reproduced verbatim. Evidence does not currently establish a specific food or cleanse that removes microplastics.",
  },
  { number: "12", text: "Teach one person about microplastics this week." },
];

export const authoredCardRemember = [
  "Small daily actions → massive lifetime impact.",
  "Your choices protect your hormones, your fertility, your heart, your children, and your future.",
] as const;

/**
 * Plain-language planner choices. These apply the same three core rules without
 * replacing the authored Quick Action Card or creating a second public checklist.
 */
export const plannerActions: ActionStep[] = [
  {
    number: "01",
    title: "Move one hot-food routine out of plastic",
    shortTitle: "Move heat away",
    practical: "Choose one meal or leftover routine and reheat it in glass or ceramic this week.",
    why: "Heat and food contact are the clearest place to begin.",
    guide: "/resources/heating-food-in-plastic",
  },
  {
    number: "02",
    title: "Change one food-storage routine",
    shortTitle: "Change storage",
    practical: "Use glass, ceramic, or stainless steel for one food you store frequently.",
    why: "The goal is to remove plastic from a routine that repeats, not rebuild the whole kitchen overnight.",
    guide: "/resources/plastic-kitchen-conversion",
  },
  {
    number: "03",
    title: "Replace your daily bottle or cup",
    shortTitle: "Change drinkware",
    practical: "Use a glass or stainless-steel bottle or cup for the drink you carry most often.",
    why: "A daily drinking habit is easy to recognize and repeat.",
    guide: "/resources/microplastics-drinking-water-filter-guide",
  },
  {
    number: "04",
    title: "Remove one single-use foodware habit",
    shortTitle: "Skip one disposable",
    practical: "Bring or use a reusable glass, ceramic, or steel option for one recurring takeout or event habit.",
    why: "Disposable cups, plates, utensils, and containers are a direct place to use less plastic.",
    guide: "/resources/single-use-plastic-foodware",
  },
  {
    number: "05",
    title: "Review your water routine",
    shortTitle: "Review water",
    practical: "Reduce routine plastic-bottle use and compare a maintained filtration option with your local water needs.",
    why: "The best system is one that is appropriate for your water and can be maintained correctly.",
    guide: "/resources/microplastics-drinking-water-filter-guide",
  },
  {
    number: "06",
    title: "Choose one natural-fiber replacement",
    shortTitle: "Choose natural fiber",
    practical: "When a worn garment already needs replacing, consider cotton, linen, wool, hemp, or another suitable natural-fiber option.",
    why: "A planned replacement is more useful than a wasteful closet purge.",
    guide: "/resources/synthetic-clothing-microfibers",
  },
];

// Backward-compatible export for components that still expect quickActions.
export const quickActions = plannerActions;

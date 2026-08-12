#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const expect = (condition, message) => checks.push({ ok: Boolean(condition), message });

const home = read("app/page.tsx");
const solutions = read("app/solutions/page.tsx");
const planner = read("app/components/ActionPlanner.tsx");
const actions = read("app/content/actions.ts");
const card = read("app/quick-action-card/page.tsx");
const guides = read("app/content/guides.ts");
const resources = read("app/resources/page.tsx");
const science = read("app/science/page.tsx");

expect(home.includes("First: use less plastic."), "Homepage states the direct first principle.");
expect(home.includes("coreRules.map") && ["Don’t heat plastic.", "Don’t store food in plastic.", "Don’t drink from plastic."].every((rule) => actions.includes(`title: "${rule}"`)), "Homepage explains the exact three core rules in plain language.");
expect(!home.includes("quickActions.slice(0, 5)") && !home.includes("hp-action-list"), "Homepage has one compact action hierarchy rather than adjacent checklists.");
expect(!home.includes("Repetition principle") && !home.includes("routes repeat"), "Rejected ambiguous exposure language is absent from the homepage.");

expect(solutions.includes("First: use less plastic."), "Solutions leads with the direct first step.");
expect(solutions.includes("The first step is simple. The rest is optional depth."), "Solutions separates immediate action from optional detail.");
expect(solutions.includes("Avoid routine plastic bottles.") && solutions.includes("Replace the plastic used around heat and food.") && solutions.includes("Remove disposable plastic foodware"), "Solutions includes direct water, kitchen, and single-use guidance.");
expect(!solutions.includes("solutions-twelve") && !solutions.includes("solutions-rhythm"), "Solutions does not repeat the full card and another priority framework.");
expect(!solutions.includes("Do not turn precaution into panic") && !solutions.includes("frequency × contact × heat"), "Rejected formula-like and caution-first messaging is absent.");

expect(planner.includes("Choose one change for this week."), "Planner asks for one realistic next change.");
expect(planner.includes("slice(0, 1)") && planner.includes("current.includes(number) ? [] : [number]"), "Planner enforces one current selection.");
expect(!planner.includes("Choose three") && !planner.includes("of 3 selected"), "Old multi-choice planner language is absent.");

const authoredBlock = actions.match(/export const authoredQuickActionCard:[\s\S]*?export const authoredCardRemember/)?.[0] ?? "";
const authoredCount = [...authoredBlock.matchAll(/number: "\d{2}"/g)].length;
const plannerCount = [...actions.matchAll(/\{\n\s+number: "\d{2}",\n\s+title:/g)].length;
for (const rule of ["Don’t heat plastic.", "Don’t store food in plastic.", "Don’t drink from plastic."]) {
  expect(actions.includes(`title: "${rule}"`), `Exact core rule is preserved: ${rule}`);
}
expect(authoredCount === 12, "The authored Quick Action Card contains exactly 12 supplied actions.");
expect(plannerCount >= 6, "The separate one-change planner retains practical choices without replacing the authored card.");
expect(actions.includes("Sweat regularly (sauna, exercise) to eliminate toxins.") && actions.includes("Add detox foods: broccoli sprouts, seaweed, cilantro, fiber."), "Contested book wording is preserved rather than silently rewritten.");
expect(actions.includes("Evidence does not currently establish"), "Contested book wording carries a transparent evidence note.");

expect(card.includes("authoredQuickActionCard.map") && card.includes("Author text reproduced from"), "Quick Action Card renders the supplied author text as accessible live content.");
expect(card.includes("action.reviewNote") && actions.includes("Evidence does not currently establish sauna or exercise") && actions.includes("Evidence does not currently establish a specific food or cleanse"), "Quick Action Card distinguishes contested author wording from supported health claims with concise inline cautions.");
expect(card.indexOf("authoredQuickActionCard.map") < card.indexOf("quick-card-core-rules"), "Web card follows the supplied page order: 12 actions, then three core rules.");

expect(!guides.includes("Let very hot food cool before transferring it to plastic storage"), "Explicitly rejected plastic-storage instruction is absent.");
expect(guides.includes("There is no need to cool hot food and then move it into plastic storage."), "Heating guide directly corrects the rejected instruction.");
expect(guides.includes('slug: "plastic-kitchen-conversion"') && guides.includes('slug: "single-use-plastic-foodware"'), "Dedicated kitchen-conversion and single-use guides exist.");
expect(guides.includes("avoid routine plastic water bottles") && guides.includes("reverse osmosis"), "Water guide begins with the requested direct advice and explains reverse osmosis.");

expect(resources.includes("Start simple. Go deeper when you need to."), "Guide library makes detail optional.");
expect(science.includes("Use less plastic. Start with the routines you repeat."), "Science-to-action bridge returns to the same clear principle.");

for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.message}`);
const failed = checks.filter((check) => !check.ok).length;
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);

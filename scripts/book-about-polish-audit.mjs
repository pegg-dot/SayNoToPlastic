#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (path) => readFileSync(join(root, path), "utf8");
const checks = [];
const expect = (condition, message) => checks.push({ ok: Boolean(condition), message });

const book = read("app/homo-plasticus/page.tsx");
const journey = read("app/components/BookJourney.tsx");
const about = read("app/about-dr-elie-haddad/page.tsx");
const ownerFacts = read("app/content/owner-facts.ts");
const css = read("app/globals.css");

expect(book.includes("The book reaches well beyond a four-part summary."), "Dedicated book page explicitly rejects the old four-label-as-whole-book framing.");
expect(book.includes("This is a reading map—not the book&apos;s table of contents."), "Book territory section is transparent that it is not the table of contents.");
expect((book.match(/label:/g) || []).length === 6, "Book page presents six broad territories instead of the old four-card shorthand.");
expect(["The plastic age","From objects to particles","How plastic reaches us","What researchers are finding","What can change now","What comes next"].every((value) => book.includes(value)), "Book territories cover historical context, fragmentation, exposure, human evidence, practical action, and larger response.");
expect(!book.includes('className="chapter-grid"'), "Dedicated book page no longer renders the old four-chapter grid.");
expect(journey.includes("Four windows into a wider inquiry") && journey.includes("guided preview, not the book's table of contents"), "Homepage book journey is framed as a preview rather than a complete chapter map.");
expect(!journey.includes("Reading map 01") && !journey.includes("Reading map 02") && !journey.includes("Reading map 03") && !journey.includes("Reading map 04"), "Homepage book spread no longer labels the four preview screens as the book's reading map.");
expect(journey.includes("Preview 01") && journey.includes("Preview 04"), "Book interaction retains four navigable preview states without implying only four book themes.");

expect(about.includes("Meet the physician behind the movement"), "Dr. Haddad hero remains intact.");
expect(about.includes("02 · My story") && about.includes("The clinic") && about.includes("The question") && about.includes("The environment") && about.includes("The evidence") && about.includes("The movement"), "Condensed About copy preserves the requested cardiology-to-environment-to-public-education narrative arc.");
expect((about.match(/data-about-chapter/g) || []).length === 5, "About story keeps all five narrative chapters while reducing copy density.");
expect(about.includes("03 · Education") && about.includes("<h2 id=\"education-title\">Education</h2>"), "Education remains a dedicated factual section.");
expect(!about.includes("Owner confirmation required") && !about.includes("Not presented as a final credential") && !about.includes("Institution and dates pending"), "Owner-confirmation workflow language is removed from the public About page.");
expect(ownerFacts.includes("St. George’s University School of Medicine") && ownerFacts.includes("Jackson Memorial / Jackson Health"), "Public education data follows the higher-authority transcript/Register names currently available.");
expect(ownerFacts.includes("pending_owner_confirmation") && ownerFacts.includes("source conflict remains recorded internally"), "Education source uncertainty remains recorded internally rather than being silently erased.");
expect(["Science Before Sensation","Curiosity Over Certainty","Progress Over Perfection","Protect Future Generations","Treat Causes, Not Only Symptoms","Hope Inspires Action"].every((value) => about.includes(value)), "All six requested philosophy principles remain after copy reduction.");
expect(about.includes("about-v2-reflection-lines") && !about.includes("<span>We cannot change what we do not see.</span>"), "Closing reflection uses the new horizontal composition instead of the old tall stacked quote.");
expect(about.includes("Thank you for being here."), "Closing farewell is condensed rather than removed.");
expect(css.includes(".about-v40-6 .about-v2-reflection-lines{display:grid;grid-template-columns:repeat(3"), "Desktop closing reflection distributes the three statements horizontally.");
expect(css.includes(".about-v40-6 .about-v2-story-copy article{min-height:54svh"), "About narrative no longer forces each chapter into the previous oversized 72svh reading block.");
expect(css.includes(".book-territory-grid{display:grid;grid-template-columns:repeat(3"), "Book territory layout uses a balanced three-column desktop grid.");
expect(css.includes("@media(max-width:900px)") && css.includes(".book-territory-grid{grid-template-columns:repeat(2"), "Book territory grid has a tablet fallback.");
expect(css.includes("@media(max-width:600px)") && css.includes(".book-territory-grid{grid-template-columns:1fr"), "Book territory grid has a single-column mobile fallback.");

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`[${check.ok ? "PASS" : "FAIL"}] ${check.message}`);
console.log(`[SUMMARY] ${checks.length - failed.length} passed, ${failed.length} failed.`);
if (failed.length) process.exit(1);

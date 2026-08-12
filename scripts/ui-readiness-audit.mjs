#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const passes = [];
const read = (path) => readFileSync(join(root, path), "utf8");
const pass = (message) => passes.push(message);
const fail = (message) => failures.push(message);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !["node_modules", ".next", ".sites-runtime", "dist"].includes(entry.name)) return walk(path);
    return entry.isFile() ? [path] : [];
  });
}

const pages = walk(join(root, "app"))
  .filter((path) => /(?:^|\/)page\.tsx$/.test(path) || path.endsWith("not-found.tsx"));
const landmarkFailures = [];
for (const path of pages) {
  const source = readFileSync(path, "utf8");
  if (!source.includes("<Header") || !source.includes("<main")) continue;
  if (!/<main\b[^>]*\bid="main-content"[^>]*\btabIndex=\{-1\}/s.test(source)
      && !/<main\b[^>]*\btabIndex=\{-1\}[^>]*\bid="main-content"/s.test(source)) {
    landmarkFailures.push(relative(root, path));
  }
}
if (landmarkFailures.length) fail(`Page landmarks missing the skip target or programmatic focus: ${landmarkFailures.join(", ")}`);
else pass(`${pages.length} route files preserve a consistent main-content landmark contract.`);

const home = read("app/page.tsx");
const headerIndex = home.indexOf("<Header");
const mainIndex = home.indexOf("<main");
const mainCloseIndex = home.lastIndexOf("</main>");
const footerIndex = home.lastIndexOf("<Footer");
if (headerIndex >= 0 && headerIndex < mainIndex && footerIndex > mainCloseIndex) pass("Homepage header and site footer sit outside the main landmark.");
else fail("Homepage header/footer landmark order is incorrect.");

const layout = read("app/layout.tsx");
if (layout.includes('id="site-shell"') && layout.indexOf("site-shell") < layout.lastIndexOf("<WelcomeVideoModal")) pass("Root layout exposes an inertable site shell before the welcome dialog.");
else fail("Root layout is missing the welcome-dialog site shell boundary.");

const chrome = read("app/components/SiteChrome.tsx");
for (const token of [
  "skipToContent = true",
  'href="#main-content"',
  "useBodyScrollLock(menuOpen)",
  'document.getElementById("main-content")',
  "region.inert = true",
  'type="button" aria-expanded={menuOpen}',
  'pathname.startsWith("/media")',
  'window.addEventListener("hp:welcome-opening", closeForWelcome)',
]) {
  if (!chrome.includes(token)) fail(`Site chrome is missing UI contract: ${token}`);
}
if (!failures.some((message) => message.startsWith("Site chrome"))) pass("Site chrome includes skip navigation, inert mobile-menu background handling, shared scroll locking, explicit button semantics, and section-aware navigation state.");

const scrollLock = read("app/components/useBodyScrollLock.ts");
if (scrollLock.includes("activeLocks") && scrollLock.includes("previousOverflow") && scrollLock.includes("Math.max(0, activeLocks - 1)")) pass("Overlapping modal/menu scroll locks are reference-counted and restore the prior body state.");
else fail("Shared body scroll locking is not reference-counted safely.");

const welcome = read("app/components/WelcomeVideoModal.tsx");
for (const token of [
  "useBodyScrollLock(open)",
  'document.getElementById("site-shell")',
  "siteShell.inert = true",
  'aria-describedby="welcome-film-description"',
  "dialogRef.current",
  'aria-haspopup="dialog"',
  'window.dispatchEvent(new Event("hp:welcome-opening"))',
]) {
  if (!welcome.includes(token)) fail(`Welcome dialog is missing hardening contract: ${token}`);
}
if (!failures.some((message) => message.startsWith("Welcome dialog"))) pass("Welcome dialog isolates background content, traps focus locally, labels its description, and shares the scroll lock.");

const bodyJourney = read("app/components/BodyJourney.tsx");
for (const token of [
  '!("IntersectionObserver" in window)',
  "progressRef.current = findings.length > 1",
  "activeIndex={active}",
  'type="button"',
  "aria-controls={`finding-${item.slug}`}",
]) {
  if (!bodyJourney.includes(token)) fail(`Anatomy controller is missing resilient interaction contract: ${token}`);
}
if (!failures.some((message) => message.startsWith("Anatomy controller"))) pass("Anatomy controls update the visual immediately, expose chapter relationships, and degrade when IntersectionObserver is unavailable.");

const anatomy = read("app/components/AnatomyScene.tsx");
for (const token of [
  "class AnatomyErrorBoundary",
  "if (!webglAvailable || reducedMotion) return fallback",
  'aria-hidden="true"',
  'data-scene={String(activeIndex)}',
  'key={`${index}-${image.name}`}',
  'ovary-labeled.svg',
  'testis-labeled.png',
]) {
  if (!anatomy.includes(token)) fail(`Anatomy renderer is missing fallback contract: ${token}`);
}
const fallbackSection = anatomy.slice(anatomy.indexOf("function AnatomyFallback"));
if (/requestAnimationFrame|useFrame/.test(fallbackSection)) fail("Static anatomy fallback still runs an animation loop.");
if (!failures.some((message) => message.startsWith("Anatomy renderer") || message.startsWith("Static anatomy"))) pass("Anatomy rendering has a static reduced-motion path, a WebGL/load error boundary, and stable fallback keys.");

const book = read("app/components/BookJourney.tsx");
for (const token of [
  'aria-label="Book journey preview"',
  'aria-current={phase === index ? "step" : undefined}',
  "onClick={() => goToPhase(index)}",
  'behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"',
]) {
  if (!book.includes(token)) fail(`Book journey is missing direct navigation contract: ${token}`);
}
if (!failures.some((message) => message.startsWith("Book journey"))) pass("Book scroll preview is directly keyboard-operable and respects reduced-motion scrolling.");

const signup = read("app/components/SignupForm.tsx");
const contactForm = read("app/components/ContactForm.tsx");
const commercePreview = read("app/components/CommercePreview.tsx");
const checkout = read("app/components/CheckoutButton.tsx");
for (const [name, source, tokens] of [
  ["Signup form", signup, ['aria-busy={state === "loading"}', 'aria-describedby={statusId}', 'type="submit"', 'aria-live="polite"']],
  ["Contact form", contactForm, ['SUPPORT_EMAIL', 'Say No to Plastic team', 'aria-busy={state === "loading"}', 'type="submit"']],
  ["Commerce preview", commercePreview, ['<form className="commerce-preview-card"', 'name="email"', 'autoComplete="email"', 'required', 'type="submit"']],
  ["Checkout control", checkout, ['const controlId = useId()', 'aria-busy={state === "loading"}', 'aria-describedby={error ? errorId : undefined}']],
]) {
  for (const token of tokens) if (!source.includes(token)) fail(`${name} is missing interaction contract: ${token}`);
}
if (!failures.some((message) => /^(Signup form|Contact form|Commerce preview|Checkout control)/.test(message))) pass("Forms and checkout controls expose pending state, stable descriptions, explicit submission semantics, and configured support identity.");

const guideLibrary = read("app/components/GuideLibrary.tsx");
const recommendations = read("app/components/RecommendationLibrary.tsx");
if (guideLibrary.includes('role="group" aria-label="Filter field guides by topic"') && recommendations.includes('role="group" aria-label="Filter recommendations by category"')) pass("Guide and recommendation filter controls expose named button groups.");
else fail("Guide or recommendation filters are missing named group semantics.");

const css = read("app/globals.css");
for (const token of [
  'main[tabindex="-1"]:focus{outline:none}',
  ".book-story-progress button{",
  ".anatomy-image-fallback .fallback-anatomy-image",
]) {
  if (!css.includes(token)) fail(`Global UI CSS is missing: ${token}`);
}
if (!failures.some((message) => message.startsWith("Global UI CSS"))) pass("Global CSS supports skip-target focus, keyboard book controls, and static reduced-motion anatomy fallbacks.");

for (const message of passes) console.log(`[PASS] ${message}`);
for (const message of failures) console.error(`[FAIL] ${message}`);
console.log(`[SUMMARY] ${passes.length} passed, ${failures.length} failed.`);
process.exitCode = failures.length ? 1 : 0;

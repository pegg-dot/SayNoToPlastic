# Admin UX benchmark: Airbnb host tools

Date: 2026-10-02

## Goal

Make the Say No To Plastic owner workspace understandable to a nontechnical owner without removing the safety, revision history, publishing controls, Mailchimp workflow, or structured science requirements.

This is a desktop-first owner-workspace pass. It is not the mobile pass.

## Official Airbnb references reviewed

1. Airbnb Resource Center, **Exploring your hosting tools** (Dec. 10, 2025)
   https://www.airbnb.com/resources/hosting-homes/a/exploring-your-hosting-tools-738

2. Airbnb Resource Center, **Reservations, redesigned** (May 20, 2026)
   https://www.airbnb.com/resources/hosting-homes/a/reservations-redesigned-765

3. Airbnb Resource Center, **Introducing the Listings tab** (updated May 1, 2024)
   https://www.airbnb.com/resources/hosting-homes/a/introducing-the-listings-tab-638

4. Airbnb Resource Center, **More control in the Listings tab** (updated Oct. 21, 2024)
   https://www.airbnb.com/resources/hosting-homes/a/more-control-in-the-listings-tab-677

5. Airbnb Resource Center, **How to get started on Airbnb** (Apr. 22, 2026)
   https://www.airbnb.com/resources/hosting-homes/a/how-to-get-started-on-airbnb-3

6. Airbnb Newsroom, **Airbnb 2025 Summer Release** (May 13, 2025)
   https://news.airbnb.com/product-releases/airbnb-2025-summer-release

## What Airbnb does well that applies here

### 1. Stable top-level mental models

Airbnb groups host work into a small number of durable tabs such as Today, Calendar, Listings, Messages, and Menu. A tab represents a kind of work, not one isolated task.

**Implication for our owner workspace:** Press kit should not compete with Website, Field Notes, and Media as a top-level destination. TEDx and Podcast should not need their own top-level shortcuts when they are website pages.

### 2. Today is about orientation and next actions

Airbnb opens hosts into a Today view that summarizes what is happening and what needs attention. It does not begin with a giant settings matrix.

**Implication:** our first screen should answer:
- What is live?
- Is anything waiting for attention?
- What are the few common things I can do next?
- What changed recently?

Analytics should remain available but should not dominate the first decision.

### 3. Object first, then edit

Airbnb’s Listings flow starts with the listing, then exposes the editable parts of that listing. The listing editor is split into understandable areas instead of presenting every control at once.

**Implication:** our Website flow should be:
1. choose a page;
2. see the page;
3. choose one section;
4. edit that section;
5. publish that one change.

The current page tree is useful, but showing every field accordion beside a preview creates unnecessary scanning.

### 4. Progressive disclosure

Airbnb does not show every possible amenity as one giant uncontrolled form. It organizes details by category and opens the control the host actually chose.

**Implication:** Science should not render every owner-added study as a full long form simultaneously. Choose a study first, then edit that study.

### 5. Actions live where the object lives

The 2026 reservations redesign moved common actions directly onto reservation details instead of making hosts hunt through another area of the app.

**Implication:** preview, edit, publish, source links, and destructive actions should stay next to the page, newsletter, study, or media item they affect.

### 6. The next action is visually obvious

Airbnb Setup guides users through a small sequence and the Listings editor gives clear edit/view actions.

**Implication:** Field Notes should emphasize the next valid action:
- Draft -> Publish
- Published -> Create Mailchimp draft
- Mailchimp draft exists -> Open Mailchimp

Secondary and destructive actions should visually recede.

## Problems in the current owner workspace

### Navigation
- Home, Pages, Events & Media, Press kit, Newsletters mix different levels of the information hierarchy.
- Press kit is a website/media sub-area but is presented as a peer of the whole Website.
- Dashboard quick actions duplicate navigation and expose seven different choices at once.

### Page editing
- Raw page paths are shown in the page list even though the owner does not need URL structure.
- Page list + field accordions + live preview creates three simultaneous things to understand.
- Show + edit, Custom version is live, Original version is live, New version, and Update live site are safe but collectively feel like a settings console instead of direct page editing.

### Science
- The science guardrails are correct.
- The interaction is not: every owner-added study is rendered as a full long form.
- This creates an unnecessarily tall page and makes “which study am I changing?” harder than it should be.

### Field Notes
- The four-step workflow is directionally good.
- Every row can expose Save, Publish/Unpublish, Create Mailchimp draft, Delete, Preview, Open live issue, and Open Mailchimp.
- The correct next action is therefore less obvious than it should be.

### Visual hierarchy
- The large dark owner header looks like a public-facing hero rather than application chrome.
- The owner workspace should feel calm, operational, and predictable.

## v40.51 implementation direction

1. Rename the primary mental models to:
   - Today
   - Website
   - Field Notes
   - Media

2. Keep Press kit under Media instead of as a top-level tab.

3. Reduce Today to four primary actions:
   - Edit website
   - Publish Field Notes
   - Add media
   - Review science

4. Keep TEDx, Podcast, and Press kit as smaller shortcuts rather than peers of the primary actions.

5. Make the Website editor preview-first:
   - page list
   - large live preview
   - focused inspector
   - one editable field at a time

6. Hide raw route paths from the owner-facing page list.

7. Split the Science workspace into two explicit tools:
   - Human evidence studies
   - Body-system explainers

8. Make Human evidence studies selection-first:
   - compact study list
   - one study editor
   - one persistent save bar

9. Make Field Notes status-driven so the next valid action is visually primary and destructive actions are secondary.

10. Preserve all existing APIs, D1 data, revision behavior, publication guardrails, Mailchimp behavior, owner allowlist, preview routes, and live-site content contracts.

## Explicit non-goals

- No mobile redesign in this phase.
- No database schema changes.
- No Mailchimp API changes.
- No Cloudflare Access changes.
- No public website redesign.
- No weakening of science publication requirements.

## v40.55 owner-workspace refinement

Dr. Haddad's direct feedback after the v40.51 release was that the owner workspace was still a little complicated to understand even though the information architecture had improved. He specifically liked how Airbnb keeps powerful host tools seamless and flowy while preserving substantial complexity underneath.

v40.55 therefore moves one layer deeper than navigation cleanup. The owner should think about the object being managed, not the CMS mechanism behind it.

### Interaction model

The workspace now follows one repeated pattern:

1. choose the thing you want to work on;
2. see its current state in context;
3. change one thing at a time;
4. expose one obvious next action;
5. keep history, destructive controls, and implementation detail behind progressive disclosure.

The design rule is: **one object, one context, one obvious next action.**

### Today

Today opens with four durable jobs only: Website, Field Notes, Media, and Science. Secondary shortcuts, analytics, and the explanation of safety boundaries are available but collapsed by default so they do not compete with the owner's next decision.

### Website

Standard pages remain preview-first, but the editor no longer exposes the storage model through phrases such as custom override, original version, or new version. When source-controlled text is currently live, the preview resolves that effective text into the editor so the owner edits the words they actually see.

A selected field has one primary action: **Publish change**. Unsaved work can be discarded. Revision history and reset-to-reviewed-content controls remain available under **History & restore**.

Owner previews use a same-origin `owner_preview=1` mode that suppresses visitor-only welcome and consent overlays inside the iframe. The public site is unchanged when that flag is absent.

### Field Notes

Field Notes is now object-first: a compact issue list selects one issue detail view. The primary action changes with state:

- Draft -> Publish to website
- Published -> Create Mailchimp draft
- Mailchimp draft exists -> Open Mailchimp

Title and archive-description editing is secondary under **Edit issue details**. Unpublish and delete actions live under **More actions**.

### Media

Events and appearances remain selection-first. Only the selected item is edited. The save bar appears only when something actually changed, while removal is hidden under **More actions**. Public/private status remains explicit.

### Science

Science remains intentionally structured. The simplification is sequencing, not removal of safeguards.

Human evidence studies are edited in three guided stages:

1. What the study found
2. How the study was done
3. Limitations & source

Body-system explainers are edited in four stages:

1. Page basics
2. Article sections
3. Evidence boundaries
4. Sources & review

The general Website page tree disappears after entering the Science workspace so the owner sees only one navigation model at a time. Save controls appear only after a real change.

### Preserved contracts

v40.55 does not change the owner database schema, Mailchimp API contract, Cloudflare Access policy, approved owner allowlist, public content storage model, revision history, optimistic concurrency, same-origin write protection, scientific publication requirements, or production infrastructure.

### Validation

The release adds `scripts/v40-55-owner-workspace-audit.mjs` to the full release gate. In addition to source/build validation, the implementation was rendered locally through the built Cloudflare Worker and interaction-tested for direct Website preview editing, Field Notes next-action transitions, Media progressive controls, Science/body-system save behavior, and horizontal overflow at desktop and narrower workspace widths.

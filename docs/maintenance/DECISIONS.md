# Decisions and constraints to preserve

## Identity and voice

- **Say No to Plastic** is the platform, newsletter, and public-health movement. **Homo Plasticus** is the book by Elie R. Haddad, MD, with collaboration by Dr. Rudolph Eberwein.
- The experience is cinematic, editorial, physician-led, and humane—not a generic sustainability template, fear campaign, sterile research database, or generic store.
- Detection and association must never be rewritten as personal diagnosis, established causation, or certainty the research does not support.

## Science and anatomy

- Human findings lead with what researchers found; sample, method, and limits remain available.
- `app/content/evidence.ts` is the shared science source of truth.
- The maternal body is the spatial anchor; brain, heart, placenta/fetus, pelvis, and ovary retain anatomical context.
- The male testicular scene is a separate comparison specimen, never attached to the pregnant female model.
- Do not substitute generated/generic fetus imagery for sourced anatomy or claim muscle-by-muscle/diagnostic accuracy.

## Design system

- Dark navy, ivory reading surfaces, and restrained gold. Current anchors: `#07111d`, `#0b1725`, `#151515`, `#f2eee4`, `#faf7f0`, `#b7843f`, `#d7a967`.
- Serif editorial display/body; sans-serif labels/navigation/metadata.
- Large type, generous spacing, numbered sections, fine rules, and imagery treated as evidence rather than decoration.
- Desktop navigation above 1000px; focus-managed mobile menu below it.
- Motion serves orientation and must preserve reduced-motion behavior.

## Conversion and commerce

- Recommendations remain criteria-first; no compensated product appears without evidence, tradeoffs, cost, adjacent disclosure, and relationship record.
- Never sell “detox,” cleansing, or fertility-protection claims; practical action reduces repeated exposures.
- Every book CTA uses the first-party `/api/checkout` boundary. Components must not hardcode provider checkout URLs.
- `COMMERCE_MODE=woocommerce` is the safety default and production rollback until native commerce is fully activated.
- Stripe hosts card entry. Raw card data must never touch application code, D1, logs, email, or support forms.
- D1 is the order/access audit source; signed links are not sufficient alone. Paid/refunded/access state must be rechecked on every download.
- R2 ebook storage remains private; the final ebook must never be placed under `public/`.
- Stripe webhook events are signature-verified and idempotent. Success-page fulfillment is an immediate convenience path, not a replacement for durable webhooks.
- Browser/server checkout attempt IDs and Stripe idempotency keys prevent accidental duplicate Sessions during retry.
- Recovery must not disclose whether an email/order exists and must be rate limited with a protected email-derived value.
- Full refunds revoke access. Partial refunds are recorded without automatic revocation unless future policy explicitly changes.
- Transactional access messages can be sent independently of marketing subscription status.
- Native mode is not “complete” until migration, final file, provider configuration, and the `COMMERCE_SETUP.md` test matrix pass.

## Forms and data

- Forms retain explicit consent, validate origin/size/honeypot, and avoid medical or payment-card data.
- Optional analytics remains consent-gated. Purchase attribution must deduplicate and never block checkout/access.
- Secrets, databases, customer exports, order data, and the private ebook are excluded from portable source archives.

## Rejected approaches and lessons

- No flat anatomy overlay, independently centered organs, renamed male geometry, or disconnected floating meshes.
- No unlicensed marketplace or AI-generated fetal assets as scientific stand-ins.
- Do not compress Dr. Haddad's owner-provided narrative into generic credential copy.
- Use Say No to Plastic/Field Notes for platform email, not “Homo Plasticus emails.”
- Do not publish empty affiliate shelves, vague Coming Soon copy, unverified studies, or provider-specific promises that the code cannot prove.
- Do not switch production commerce by merely adding keys; require explicit mode change, test evidence, owners, and rollback.

## v32 commerce-readiness decisions — August 6, 2026

- Keep production on `COMMERCE_MODE=woocommerce` until a real provider test and owner approval exist.
- Centralize approved public book data in `app/content/book-product.json`; keep provider credentials and the PDF outside source.
- Pin Stripe requests/webhooks to an explicit API version and reject test/live webhook mismatch.
- Validate paid Session amount and currency before granting access.
- Use provider idempotency for purchase email and deterministic token timestamps so a retry sends the same payload.
- Recover interrupted delivery through a D1 claim lease and attempt count rather than assuming a request completed.
- Do not persist signed bearer access URLs in the email outbox.
- Require strict preflight of bindings, settings, migration, PDF signature, and checksum before test or production activation.
- Treat tax, refund, territories, receipts, legal account ownership, and live activation as authorized-owner decisions rather than developer assumptions.

## v33 mission-content and infrastructure decisions — August 6, 2026

- **Production commerce stays parked.** WooCommerce remains the default until owner inputs and real provider evidence exist.
- **Preview is a distinct guarded mode.** Native-flow visualization requires both `COMMERCE_MODE=preview` and `COMMERCE_PREVIEW_ENABLED=true`; it does not imitate a successful real transaction in storage.
- **Welcome is first-visit, not permanently intrusive.** It auto-opens only on the homepage once per device/browser storage state and remains replayable.
- **The film shell is provider-flexible.** An approved hosted file, generic embed, or YouTube ID can be inserted without rebuilding modal behavior.
- **No fake final film.** The placeholder is visibly a production-pending welcome shell and does not present generated footage as Dr. Haddad.
- **TEDx belongs to Media.** The homepage feature was removed; `/tedx` redirects to the media feature for compatibility.
- **Guides remain evidence-first.** New topics keep known/uncertain/action/source separation and avoid individual diagnosis or product-driven fear.
- **Affiliate publication is fail-closed.** Empty or draft catalog records do not render purchase links. Every published record needs tradeoffs, evidence, relationship, nearby disclosure, review basis/date, and an HTTPS destination.
- **Press assets show limitations.** Current web-resolution assets are downloadable, but the site states when high-resolution or publication approval remains pending.

## v34 transcript reconciliation decisions — August 6, 2026

1. **Requirements precedence is explicit.** Later user decisions override the older landing-page blueprint; the Master Delivery Register derived from the full transcript is the main portable requirements source; primary sources override shorthand dates; existing implementation is not authoritative when it conflicts.
2. **TEDx remains Media-only.** Home may point to a general Events & Media center but may not contain a TEDx-specific section, title, thumbnail, or CTA.
3. **Anatomy is six evidence chapters plus an editorial exit.** Pregnancy and placenta are one maternal-fetal scene. The exit is Chapter 07 but is not a seventh organ/3D camera state.
4. **Cardiovascular evidence remains distinct.** Coronary-blood detection and carotid-plaque outcomes cannot be collapsed into one statistic or causal claim.
5. **The uterus layer is part of the pregnancy composition.** The maternal body, pelvis, uterus, fetus, placenta, and umbilical/placental anatomy should read as one explained orientation assembly.
6. **The current ovary asset is not final clinical art.** Infrastructure may ship, but final signoff requires a recognizable licensed ovary and follicular-fluid inset reviewed in context.
7. **Movement and book identities are separated.** Say No to Plastic is the movement/publisher. *Homo Plasticus* is the book/product. Book-specific purchase/access routes may use both names together.
8. **Contact begins with an invitation, not a warning.** “Ask a question” and routing categories lead. The medical boundary remains visible but secondary.
9. **Official book art is used consistently.** `book-official.webp` is the current product/preview cover. Alternate art stays in the asset inventory until owner rights/usage are confirmed.
10. **Source audits must test transcript structure.** The source gate now enforces chapter count, pregnancy merge, cardiovascular separation, media placement, contact, official cover, and publisher identity.
11. **A partial dependency install is not validation.** Any interrupted or invalid `node_modules` tree must be removed before handoff and cannot be cited as a build or type-check pass.

## v35 UI hardening decisions — August 6, 2026

1. **Do not weaken the lockfile to satisfy a limited build container.** A missing package in the configured mirror is an environment limitation, not permission to ship vendored or substituted production dependencies.
2. **Use one shared reference-counted body lock.** Independent overlays must not overwrite each other's scroll state.
3. **Make modal isolation structural.** `#site-shell` is the background boundary for the welcome dialog; inert state and focus restoration are required behavior.
4. **Every shared-header route gets a skip target by default.** Exceptions must be explicit, not accidental.
5. **Reduced motion means a truly static anatomy path.** Hiding animation while retaining an animation loop is not acceptable.
6. **WebGL and model failure cannot erase the story.** The anatomy section must retain readable, chapter-synchronized fallback imagery.
7. **Book progress is navigation, not decoration.** Chapters must be directly operable by keyboard, touch, and pointer.
8. **Form loading is part of accessibility.** Pending state, duplicate-submit prevention, status announcements, stable descriptions, and explicit submit semantics are required.
9. **Movement identity applies to policies and utility pages.** Say No to Plastic operates the platform; *Homo Plasticus* names the book/product and book-specific communications.
10. **Source readiness is not visual approval.** v35 can be called source-hardened only; rendered, clinical, provider, and production approval remain separate gates.

## v36 clarity and redundancy decisions — August 6, 2026

1. **The first instruction is direct:** use less plastic where practical. Do not make visitors decode a framework before they can act.
2. **Heat and daily use set priority:** hot food/drinks and high-use food-contact items come before low-use or specialized purchases.
3. **One behavior at a time:** the action planner selects one change for the week, not three simultaneous commitments.
4. **One page, one job:** Solutions owns the simple starting path; the Quick Action Card owns the complete 12-action checklist; Guides own topic depth; Science owns evidence.
5. **Remove repeated ledgers:** the homepage does not show both three rules and a second five-action list; Solutions does not repeat the full 12-action card or a second priority taxonomy.
6. **Optional depth stays available:** simplifying the entry point does not remove source links, uncertainty, medical boundaries, or detailed guidance.
7. **Avoid future framework drift:** do not add another named formula, score, hierarchy, or checklist unless it performs a distinct function that existing pages do not.

## v37 operational-resilience decisions — August 6, 2026

1. **Record intent before delivery.** Subscriber consent, inquiry content, local unsubscribe state, and recovery request state must survive an email-provider interruption.
2. **Local unsubscribe is authoritative.** Suppress locally first, then synchronize the provider. The public response must not reveal whether a subscriber exists.
3. **Store the least-powerful token state possible.** Subscriber rows keep only the unsubscribe-token hash. The raw low-privilege token may exist temporarily in an unsent welcome job and is scrubbed after success.
4. **Use one durable outbox for non-commerce site email.** Welcome, Contact notification, unsubscribe synchronization, and ebook recovery share leases, backoff, terminal state, and operator visibility.
5. **Do not retry forever.** General email and queued purchase fulfillment stop after eight attempts. Terminal work remains visible for deliberate operator resolution.
6. **Provider idempotency is part of correctness.** A recovered database claim must reuse a deterministic provider key/payload so interruption after provider acceptance does not create duplicate customer messages.
7. **Never persist signed ebook access URLs in the general outbox.** Recovery jobs store identifiers and issue time, then recreate the signed link only when delivering.
8. **Internal operations fail closed.** Readiness and drain endpoints require a 32+ character hosted bearer secret and expose no secret values or customer records.
9. **A scheduler is external infrastructure, not application guesswork.** The protected drain is ready, but cadence, owner, secret storage, and alerts require approved deployment/provider setup.
10. **Analytics choice remains revisable and separate from email consent.** A visitor can return to Essential only without affecting subscription or transactional delivery.
11. **Baseline security headers must not break the application.** v37 adds safe headers and deliberately defers a strict CSP until the actual video, WebGL, JSON-LD, styles, and browser build can be tested together.
12. **Operational source readiness is not provider proof.** Real Resend, Stripe, D1, R2, DNS, scheduler, and incident behavior remain separate staging/production gates.

---

## v38 transcript-priority decisions — 2026-08-06

### Preserve authored source; do not silently replace it

The photographed Quick Action Card is an authored book asset. v38 reproduces its 12 actions and three core rules exactly as live text. A separate website planner may help a visitor choose one action, but it cannot replace the source card.

### Separate source fidelity from medical endorsement

Potentially unsupported wording remains visibly attributed to the source and carries an evidence boundary. The site does not claim that sauna, exercise, foods, or cleanses remove microplastics. Final public wording is an owner/clinical review gate.

### Use direct first actions

Water, heating/storage, kitchen conversion, and single-use guidance begins with an actionable sentence. Safety/access context follows; it does not obscure the first step.

### Hold conflicting owner facts

When transcript/register and prior site source disagree about education, v38 publishes neither disputed institution as final. Written owner confirmation is required.

### Media is approval-gated data

A file or URL is not an approved media item. Publication requires verified URL, date, platform, rights, and owner approval in the media registry.

### Audience provider is separate from transactional email

Resend transactional delivery does not automatically decide the newsletter platform. `AUDIENCE_PROVIDER=none` is the safe default; Mailchimp and Resend adapters are available for an explicit owner choice.

### Anatomy fallbacks must be recognizable

Decorative generic reproductive shapes are rejected. Stable fallbacks must identify the intended anatomy and remain labeled. Final visual accuracy still requires clinical and rendered review.

### Keep collaborator credit in book contexts

Dr. Rudolph Eberwein’s published collaboration credit remains on the book/byline/schema. It is not expanded into a movement-level profile without explicit approval.


## v40 — user-reviewed homepage polish

1. **Real rendered feedback outranks theoretical visual confidence.** The six 2026-08-07 local screenshots are preserved as defect evidence and drive this batch.
2. **Hero simplicity is now the later authority.** The environmental-problem setup line is no longer required on the first screen after the explicit user review; the core book line remains.
3. **Homepage evidence may be concise without weakening the evidence ledger.** Heart copy is shortened only on Home; primary records remain complete on Science.
4. **Do not repeat the three core rules twice in one action bridge.** Render them from the canonical action source once, then use the second column for a next-step instruction.
5. **Food/storage and heat are separate concepts.** The Home labels are `Food storage` and `Heat` unless a later explicit decision changes them.
6. **Local verification must work on macOS.** Linux-only locking/timeout assumptions may remain in the Sites-specific path only when a safe local fallback exists.

## 2026-08-07 — v40.1 rendered placement decisions

1. **Events & Media background is full-bleed on Home.** The editorial content can remain grid-aligned, but the navy field must not read as a centered card with black gutters.
2. **The generations artwork is removed from Home.** The latest rendered user review supersedes the older blueprint Home placement because the image dominated multiple screens.
3. **The generations requirement is preserved on `/community`.** Do not delete the approved asset or silently erase the three-generation acceptance rule; prove its responsive crop on the dedicated Community experience instead.
4. **Targeted polish preserves approved areas.** When the user explicitly says the rest is liked, do not broaden the correction into an unrelated redesign.


## 2026-08-07 — v40.2 Science rendered-feedback decisions

1. **Treat supplied Science imagery as implementation input, not a generation request.** The runtime uses cropped/converted user-supplied assets only; accidental generated alternatives are discarded and excluded from the package.
2. **Keep Science structurally stable.** The user explicitly likes the page overall, so the pass is surgical: remove the helper block, add requested imagery, and quiet the footer background without broad rewriting.
3. **Keep evidence images separate.** Brain, Heart, Placenta, Testicular tissue, Ovary and Blood are individual chapter visuals. Do not render the six-panel source collage as one live image.
4. **Keep text and evidence live.** Embedded captions from the source collage are cropped out; labels, findings, limits and citations remain accessible live HTML.
5. **Visual art never merges the cardiovascular records.** The heart visual may represent the Heart & arteries chapter, but the 2026 coronary-blood study and 2024 carotid-plaque study remain distinct records and links.
6. **Science footer treatment is page-scoped.** Preserve the approved Earth asset globally; on Science only, reduce it to atmospheric support behind the live quote.

## 2026-08-07 — v40.3 Solutions rendered-feedback decisions

1. **Solutions stays conceptually intact.** The user likes the page overall; this pass repairs visual flow rather than rewriting its guidance.
2. **Full-bleed field, contained content.** The ivory kitchen/guides area fills the viewport, while image, copy and guide cards remain aligned to the editorial max-width.
3. **Remove the visible Solutions evidence strip, not the evidence boundary itself.** The Quick Action Card and medical-disclaimer paths retain the scientific/source boundary; `/solutions` no longer interrupts the action flow with a separate banner.
4. **Later rendered footer feedback supersedes the Earth photo treatment.** Keep the inheritance quote, remove the live Earth-at-night image, and use only a calm dark field with a faint abstract Earth curve. Preserve the old asset and blueprint instruction for provenance.
5. **Visual correction must preserve behavior.** Water/Kitchen/Single-use guide routes, exact core rules and one-change planner logic are protected by the new regression audit.

## v40.5 rendered Guides decision — 2026-08-07
- The `/resources` reading-room ivory field should be full-bleed; the 1240px limit applies to its inner content, not the background field itself.
- “Three useful first reads” should lead a full-width three-card row, not share a narrow split with all three cards.
- The user approved the rest of Guides, so this pass must not trigger broader copy/content redesign.

## v40.6 — later rendered Book/About decisions (2026-08-07)

1. The four Book scroll states are a **preview**, not a claimed table of contents or complete scope. The dedicated Book page now shows broader territory and explicitly says it is not the TOC.
2. Do not add invented book chapters/excerpts to make the page look fuller. Final sample/TOC remains an owner-source gate.
3. The Dr. Haddad page keeps Education, the five-stage narrative arc, six philosophy principles, and final CTAs, but materially reduces prose density.
4. The public Education section must not show internal workflow language such as “Owner confirmation required,” “pending credential,” or source-conflict notes. Provenance uncertainty stays in project records.
5. For current public Education display, use the higher-authority meeting transcript/Master Delivery Register where available. Do not invent missing fellowship institutions or dates.
6. The closing reflection must use the page width on desktop rather than stacking a tall quote column on one side.


## v40.7 — media + community rendered-review decisions (2026-08-07)

1. **Temporary TEDx exception is explicit, not silent.** The raw meeting transcript rejected the phone recording in favor of the future official TEDx release. The later explicit user decision on 2026-08-07 authorizes that exact preserved YouTube recording as a temporary public link. It must be labeled temporary, must not be called official, and must be replaced when the official TEDx video arrives.
2. **Publication authorization is not owner approval.** The registry records `publicationApproval: user_authorized` while keeping `ownerApproved: false`; this prevents the interim decision from being misrepresented as Dr. Haddad's approval.
3. **Do not invent missing media metadata.** The two current YouTube URLs are restored from preserved v30 source, but publication dates remain `pending_verification` until independently confirmed.
4. **Long-form conversation is current media.** Restore the preserved v30 YouTube ID `DJuZBIXeiM8` as a playable Events & Media entry without redesign.
5. **Welcome film remains a configured slot, not a fake asset.** Do not invent a welcome-film URL; switch the status copy from “recording pending” to “link pending” because the user expects Dr. Haddad to send the link.
6. **Community uses the full supplied generational artwork.** On the dedicated Community page, stop cover-cropping the grandmother/mother/boy image; preserve all three generations and verify the result at real viewports. The giant image remains removed from Home.

## v40.9 — real welcome-film integration (2026-08-08)

1. **The user-supplied MP4 is the current welcome-film asset.** Asset placement is no longer treated as an owner-blocked placeholder state.
2. **Do not serve the 248 MB HEVC master directly.** Ship a browser-compatible H.264/AAC portrait derivative with MP4 faststart; preserve the master filename/hash/metadata rather than duplicating the master inside every portable release ZIP.
3. **One canonical film configuration drives all placements.** The first-visit homepage dialog, homepage replay chip, and Events & Media welcome-film section all read from `WELCOME_FILM`.
4. **No sound autoplay.** The first-visit dialog may open automatically, but the film starts only after the visitor explicitly presses Play. The Events & Media player also never autoplays.
5. **Preserve portrait framing.** The supplied 9:16 video/poster use contain rendering; do not crop or stretch Dr. Haddad to fit a landscape slot.
6. **Accessibility proof remains explicit.** The supplied MP4 has no subtitle track. Captions/transcript and five-point spoken-content verification remain launch gates rather than being silently marked complete.

## v40.15 — Dr. Haddad content integration (2026-08-08)

1. **Build on v40.14, do not create a replacement site.** Existing identity, accepted layouts, interactions, routes, resources, and rollback remain the baseline.
2. **One canonical home per long-form topic.** Full supplied narratives live on canonical routes; other pages use teasers, summaries, or cross-links.
3. **Verified evidence remains separate from supplied narrative.** `app/content/evidence.ts` remains authoritative for study-specific statistics, methods, limitations, and primary paper links.
4. **Every body-system page exposes a source state.** `verified`, `partial`, or `source-review` is visible in the page UI and data registry.
5. **Do not index source-review pages.** They are built locally and linked for review, but use `noindex,follow` until bibliography approval.
6. **Do not invent lungs content.** The architecture leaves room for it; no respiratory narrative is created without a supplied source.
7. **Do not turn medical interest into product claims.** Recommendations cannot imply prevention, detoxification, pregnancy protection, or medical outcome change.
8. **Preserve exact source artifacts.** All ten PDFs are bundled under `docs/sources/haddad-content/` with SHA-256 hashes and text extracts.
9. **No dependency or production changes.** Package lock, commerce mode, Sites identity, URL, storage, providers, and production v30 remain untouched.

## v40.16 — completion-pass decisions (2026-08-09)

1. **Enhance the existing site; do not redesign it.** v40.16 mounts new depth inside v40.15 routes and components while preserving approved identity, navigation, welcome film, footer, wordmark, anatomy sequence, guides, and commerce boundaries.
2. **Anatomy depth is optional.** Digestive, kidneys, endocrine, and skin appear as an opt-in hotspot layer and reference drawer; the approved six-scene journey does not become a ten-scene scroll.
3. **Body-system graphics are conceptual.** They explain route structure and evidence questions; they are not patient reconstructions, quantitative dose maps, or proof of biological mechanism.
4. **Progress stays local by default.** Worksheet, reading, and challenge selections use browser storage and remain usable for the current session when storage is blocked. They are not transmitted unless the visitor separately submits a form.
5. **The learning series requires explicit consent and durable operations.** Ten dated outbox jobs, enrollment state, lease/retry handling, readiness, unsubscribe cancellation, and an operations runbook are required before activation.
6. **Explicit re-enrollment restarts the unsent series.** This prevents a fresh subscriber preference token from diverging from tokens embedded in older queued lessons.
7. **Press briefs preserve source status.** Downloadable one-page summaries must state what the material supports, what remains uncertain, and language to avoid. They do not promote a topic beyond its current review state.
8. **Generated PDFs are reproducible review candidates.** The Python generator and hash/page manifest ship with the source. Final public release still requires rendered, editorial, and rights approval.
9. **No respiratory invention.** Lack of a dedicated lungs source remains an explicit content boundary.
10. **No production or dependency workaround.** Sites v30, provider settings, secrets, DNS, storage, commerce default, dependencies, and package lock remain unchanged.

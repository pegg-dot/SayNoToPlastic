# v38 transcript-priority corrections

## Authority

This correction batch is grounded in the source set preserved under `docs/sources/`:

1. `RAW_MEETING_TRANSCRIPT.txt`
2. `MASTER_DELIVERY_REGISTER.md`
3. The supplied Quick Action Card image and official book render
4. The two Master Blueprint chapters
5. Later explicit owner decisions preserved in the project handoff

Passing source tests is not treated as visual or clinical approval.

## Goal

Correct the strongest transcript contradictions before pursuing general polish. The first public action remains simple: use less plastic, especially around heat, food storage, and daily drinks. The supplied book card remains an authored source, not raw material for a replacement checklist.

## Corrections completed

### 1. Authored Quick Action Card restored

- `app/content/actions.ts` preserves all 12 supplied actions and the exact three core rules.
- `app/quick-action-card/page.tsx` renders the source as accessible live text in the order shown on page 121.
- The photographed source is preserved at `docs/sources/images/quick-action-card-page-121.png`.
- Items 10 and 11, and the final health-protection statement, are visibly author-attributed and pending final clinical/editorial approval. They are not converted into standalone treatment or detox claims.
- The one-change planner remains separate and does not replace the book card.

### 2. Directly rejected storage instruction removed

The sentence telling readers to cool hot food and then transfer it into plastic storage is absent. The heating/storage guide now says directly:

- never microwave or reheat food in plastic;
- use glass or suitable ceramic for reheating;
- use glass, ceramic, or stainless steel for routine storage when practical.

### 3. Water guidance simplified

The water guide now begins with the requested first action: avoid routine plastic water bottles when practical and use glass or stainless steel. Reverse osmosis is explained plainly, while local-water quality, certified claims, maintenance, and wastewater remain visible as decision context rather than a barrier to understanding the first step.

### 4. Kitchen conversion and single-use foodware added

Two dedicated source-linked guides now exist:

- `/resources/plastic-kitchen-conversion`
- `/resources/single-use-plastic-foodware`

Solutions links to both directly. The kitchen guide covers storage, drinkware, utensils, plates, cups, and high-use items around heat. The single-use guide covers disposable cups, plates, utensils, takeout containers, and event routines.

### 5. Reproductive fallbacks rebuilt

- `public/images/anatomy/ovary-labeled.svg` is a readable cross-section with follicles, a developing egg, follicular fluid, and fallopian-tube context.
- `public/images/anatomy/testis-labeled.png` is generated from the licensed BodyParts3D testis and epididymis surfaces with a stable labeled view.
- `AnatomyScene.tsx` no longer uses the rejected generic ovary blob or old low-detail testis fallback.
- These remain clinical-review candidates, not final approval. The live WebGL path still uses licensed models.

### 6. Unapproved facts and media moved to explicit pending states

- Education institutions that conflict between supplied sources are withheld in `app/content/owner-facts.ts` and on the About page.
- TEDx and long-form media entries are disabled until URL, date, rights, and owner approval are complete.
- `app/content/media-items.json` is the approval-aware registry.

### 7. Movement and book identity separated

- Movement canonical/support defaults now use `saynotoplastic.com`.
- The existing `homoplasticus.com` WooCommerce URL remains only as the explicit legacy checkout fallback.
- The standalone collaborator profile was removed from the book page. The published collaborator credit remains in the cover/byline/schema where it belongs.

### 8. Newsletter-provider conflict resolved architecturally, not silently

The source no longer assumes that choosing Resend for transactional email also decides the long-term newsletter platform.

- `AUDIENCE_PROVIDER=none` is the safe default.
- `app/lib/audience-service.ts` supports explicit `resend` or `mailchimp` audience synchronization.
- Welcome/contact/ebook email remains a separate Resend transactional concern.
- Protected readiness reports audience provider state.
- No provider is activated without owner configuration.

## Verification

Run:

```bash
npm run syntax:audit
npm run clarity:audit
npm run source:audit
npm run ui:audit
npm run transcript:priority
npm run audience:preflight
npm run audience:test
npm run media:preflight
npm run links:audit
npm run operations:audit
npm run affiliate:preflight
npm run commerce:preflight
```

The dependency-backed build, rendered tests, and browser/viewport review remain a separate Sites/local gate.

## Remaining transcript/design gates

- Final signature wordmark and font/license kit
- Clinical/anatomy approval of reproductive scenes
- Written education/career confirmation
- Official TEDx/media URLs and rights
- Final welcome film, caption file, transcript, and poster
- Final owner-approved ebook and metadata
- Audience-provider selection and verified sender/domain
- Final visual review at every required viewport

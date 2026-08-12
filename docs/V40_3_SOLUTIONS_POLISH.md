# v40.3 Solutions rendered-feedback polish

Date: 2026-08-07

## User-reviewed problem

The user explicitly likes the Solutions page overall, but the lower half lost visual coherence in the local render:

- the kitchen image, caption, headline, and guide cards read as disconnected pieces inside a narrow ivory block;
- the page did not visually fill the viewport or flow cleanly as the user scrolled;
- the visible `Evidence boundary` strip was unwanted;
- the inherited Earth-at-night footer image was still visually distracting;
- the existing guidance itself should remain intact rather than being rewritten.

The four source screenshots are preserved in `docs/reviews/v40.3-solutions/`.

## Implemented corrections

### 1. Full-bleed Solutions action field

The lower kitchen/guides section now uses a full-width ivory background. Its content is constrained inside one `--content-max` editorial grid rather than making the entire section look like a centered card with dark gutters.

### 2. Kitchen image and headline share one composition

The kitchen image, caption, `Start in the kitchen` eyebrow, and direct-change headline now occupy one balanced lead grid. The image has a controlled 16:10 crop and the headline no longer floats below it in a disconnected position.

### 3. Guide cards use one consistent rhythm

Water, Kitchen, and Single-use remain three distinct guide paths. Their source wording and URLs are unchanged, but the cards now use equal compact heights and a consistent border/spacing system.

### 4. Planner alignment tightened

The one-change planner still performs the same function and still restricts selection to one core rule. Its intro and workspace now align to the same editorial width as the preceding section, with less excessive vertical separation.

### 5. Visible Solutions evidence strip removed

The `Evidence boundary` aside is removed from `/solutions` exactly as requested. This does **not** remove the medical/scientific safeguard from the product:

- the authored Quick Action Card still carries its explicit evidence note;
- the medical disclaimer route still exists;
- transcript-priority regression checks continue to protect the contested source wording boundary.

### 6. Footer flattened globally

The repeated rendered feedback on Science and Solutions supersedes the earlier Earth-at-night photo treatment. The footer now keeps the live inheritance quote on a flat navy/black field with only a faint CSS Earth curve. The original Earth source asset remains in the repository for provenance and historical blueprint traceability but is not rendered.

## Protected non-changes

- no change to the three core rules;
- no change to the water, kitchen-conversion, or single-use guide routes;
- no change to one-change planner logic;
- no change to Science evidence records;
- no change to Homepage accepted polish;
- no production/provider/commerce activation;
- no dependency or lockfile change.

## Proof boundary

Source/regression correctness is audited in this package. Pixel-level approval of the new Solutions flow and flattened footer still requires a fresh local browser render at desktop/mobile/200% zoom before the visual requirement can move to proven.

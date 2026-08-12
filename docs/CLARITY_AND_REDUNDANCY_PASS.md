# v36 clarity and redundancy pass

## Why this pass exists

Dr. Haddad's feedback, reinforced by the user's August 6, 2026 clarification, is that the practical message becomes confusing when the site repeats several frameworks for the same action. The first step should be understandable without learning a system:

> Use less plastic. Start with the plastic used every day, especially around heat, food, and drinks.

The deeper evidence, guides, and 12-step card remain available, but they should not compete with that first instruction.

## Content hierarchy adopted

1. **First principle:** use less plastic where a practical alternative exists.
2. **Priority:** keep heat away from plastic and address high-use food/drink items first.
3. **Behavior:** choose one change, repeat it, then add another.
4. **Optional depth:** use the 12-step card, topic guides, and science record when a visitor wants more detail.

## Redundancy removed

### Homepage

- Removed the second five-item action list that repeated the adjacent three-rule list.
- Replaced the abstract “reduce the exposures you repeat” framing with the direct first principle.
- Kept one CTA: choose one next change.

### Solutions

- Replaced “Make the changes that repeat” with “First: use less plastic.”
- Removed the full 12-action ledger from the page because the Quick Action Card already owns that job.
- Removed the separate “useful order” framework, which repeated the three starting rules in different language.
- Reduced the planner from three simultaneous choices to one change for the current week.
- Kept the medical/detox boundary and moved all optional depth into one final section.

### Quick Action Card

- Leads with the first principle and three simple rules.
- Keeps all 12 actions as the detailed checklist required by the project record.
- Tells the reader to choose one action at a time.

### Guides and Science

- Guide library now tells visitors to start simple and open detail only for a specific question.
- Science-to-action bridge uses the same direct principle instead of introducing a new action framework.

## Guardrails

- Simplicity must not erase evidence, caveats, source links, or medical boundaries.
- “Use less plastic” is practical prevention language, not a promise to remove plastic from the body.
- The site must not imply that a perfect plastic-free life is possible or required.
- The 12-action card remains the complete checklist; the Solutions page is the simple starting path.
- Future copy should not introduce a new named formula, hierarchy, score, or multi-step framework unless it adds a genuinely different function.

## Automated contract

Run:

```bash
npm run clarity:audit
```

The audit verifies the direct first principle, one-choice planner, removal of duplicated Solutions/Home action ledgers, preservation of three core rules plus 12 detailed actions, and consistent optional-depth language.

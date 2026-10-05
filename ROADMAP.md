# Roadmap — Say No to Plastic

**Current roadmap date:** October 5, 2026

This roadmap reflects the current post-v40.60.1 product. It replaces older launch-phase roadmaps where later explicit client decisions or completed engineering work have superseded them. Historical documents remain preserved for traceability.

## Phase 1 — Engineering closure and quality hardening

**Status: completed through v40.60.1**

The engineering closure baseline now includes:

- enforced, tested Content Security Policy;
- search/indexing alignment for source-review science pages;
- measured WCAG contrast corrections;
- active-only anatomy fallbacks and optimized browser assets;
- responsive exposure imagery;
- zero production npm vulnerabilities;
- clean lint/syntax/UI/source/link/content audits;
- exact desktop/tablet/mobile viewport proof;
- keyboard, reduced-motion, no-WebGL, 200% reflow, owner Page Studio, and media-embed proof;
- PR validation, guarded production deployment, and live post-deploy verification;
- first-class Spanish homepage parity, including the ten-stage anatomy/evidence journey and a reveal system that is not coupled to the English page.

**Exit condition:** v40.60.1 is merged to `main`, passes GitHub Release validation, is deployed through the existing Worker, and the live domain reproduces the validated quality/security and Spanish-parity behavior, including the 320px Spanish About layout.

## Phase 2 — Owner and clinical acceptance

**Status: external-input driven; not an engineering blocker for the current deployed site**

When Dr. Haddad or an authorized owner provides the input, process it as a versioned change batch:

- replace the temporary audience TEDx recording with the official release and verified metadata;
- confirm any final biography/education chronology changes;
- complete any desired qualified clinical review of anatomy and medical-language presentation;
- approve/replace final portrait, press, sculpture, or other reuse-rights-sensitive media;
- authorize any controlled real purchase/provider/email acceptance test when operational proof is desired.

Do not substitute guesses, generated credentials, fake provider state, or fake transactions for these approvals.

## Phase 3 — Routine owner operations

**Status: ongoing after engineering closure**

Dr. Haddad should be able to use the owner workspace for ordinary editorial work without a code deployment:

- edit supported Website/Page Studio copy;
- publish/manage Field Notes;
- update approved media items;
- manage structured Science/body-system content while preserving review/source safeguards;
- inspect owner metrics and revision history.

Engineering changes should be reserved for new capabilities, infrastructure changes, or defects rather than routine copy maintenance.

## Phase 4 — Maintenance and future upgrades

Trigger a new engineering release only when one of these occurs:

- a verified defect or accessibility/security regression is found;
- Dr. Haddad requests a product change beyond current owner tools;
- an official media/source replacement becomes available;
- a production dependency advisory appears;
- Cloudflare/Vinext/Next changes require compatibility work;
- a compatible Vinext upgrade passes the complete route/browser regression without HTTP 500s;
- commerce/audience infrastructure is intentionally changed by the owner.

For every future release, preserve the current production identities, run the full release/security/browser gates, and update `CURRENT_STATE.md` if product authority or infrastructure truth changes.

## Explicitly superseded roadmap assumptions

Do **not** revive these merely because they appear in older records:

- TEDx must be Media-only. This was superseded by Dr. Haddad's v40.36 request for a compact Home feature, dedicated route, and primary-nav entry.
- A large TEDx-heavy homepage blueprint. The later request authorizes only the compact feature, not the old large architecture.
- Vinext 1.0.1 as a safe upgrade target. It was tested and rejected due to runtime 500 regressions.
- Treating source-review body pages as normal sitemap/indexable content. Current review-state signaling intentionally keeps them direct-access/noindex until review status changes.

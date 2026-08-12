# v40.1 Lower-Home Polish — second local-review correction batch

## Trigger

The user rendered v40 locally at `localhost:5173` and supplied four screenshots captured at 2048×1330. The user explicitly said the rest of the reviewed homepage direction was liked and requested two narrow fixes only.

## Corrections

| Rendered defect | v40.1 correction | Regression protection |
|---|---|---|
| Events & Media navy area looked like a centered block with black gutters. | `.home-v2 .hp-media-bridge` is now full viewport width. Its background fills edge to edge while the inner grid stays aligned to the 1240px editorial content boundary on wide screens. | Events & Media copy, CTA, route, and Home-no-TEDx rule remain intact. |
| Generational artwork immediately below Events & Media consumed multiple viewport heights. | The Home `hp-join-image` picture is removed. The Home newsletter/community text + form remain. | The approved elderly-woman/adult-woman/young-boy asset is **not deleted**: `/community` now renders it with real responsive `<picture>` markup, dedicated mobile derivative, lazy loading, and live HTML content/forms. |

## Authority resolution

Blueprint Chapter 2 originally placed the generations composition in Home's Join section. The latest explicit user review of the actual rendered product supersedes that placement decision. The underlying transcript/Register requirement to preserve the generational visual remains satisfied through the dedicated Community experience and is still proof-gated for desktop/mobile cropping.

## Acceptance before promotion

Source audits prove the structural correction, not visual completion. Re-render Home and confirm: (1) the Events & Media navy background touches both viewport edges; (2) its content remains aligned and readable; (3) no giant generations image appears after it; (4) the newsletter/community section follows cleanly. Separately render `/community` on desktop and mobile and confirm the elderly woman, adult woman, and young boy remain identifiable, especially the boy on mobile.

# Transcript and blueprint conflict log

## Authority order

1. Later explicit user decisions
2. Raw Dr. Haddad transcript
3. Master Delivery Register
4. Verified primary/official factual sources, with owner confirmation where identity/biography is involved
5. Older blueprint chapters
6. Existing implementation

## Resolved conflicts

| Topic | Older instruction | Later / stronger instruction | Decision |
|---|---|---|---|
| TEDx on Home | Blueprint required a full homepage TEDx section and hero TEDx CTA. | Transcript moved TEDx, podcasts, NBC, panels and appearances into Events & Media; user later explicitly required TEDx off Home. | Keep TEDx under Media only. |
| Hero headline | Blueprint used “The greatest pollution crisis is no longer around us. It is within us.” | Transcript asked for shorter language and approved “Plastic is not just an environmental problem,” while preserving the book line. | Use transcript/register hero message. |
| Native checkout | Register says preserve WooCommerce unless explicitly replaced. | User requested native infrastructure but kept activation parked. | WooCommerce stays default; native system remains inactive/preview-only. |
| Quick Action framing | Later user clarification says first principle is “use less plastic.” | The authored page 121 still has three exact core rules and 12 exact actions. | Use “use less plastic” as the page-level frame, but preserve the authored card itself instead of rewriting it. |

## Unresolved conflicts

| Topic | Source A | Source B | Current problem | Required resolution |
|---|---|---|---|---|
| Education timeline | Transcript/register: St. George’s + Jackson Memorial/Health + cardiovascular + electrophysiology. | Current code/prior audit: St. George’s + Drexel residency/fellowships based on an official profile. | v37 silently publishes Drexel despite the transcript. | Dr. Haddad must confirm the final timeline in writing. |
| Newsletter provider | Transcript/register discuss Mailchimp and plug-in infrastructure. | v37 uses Resend contacts/outbox. | Provider architecture changed without a recorded owner decision. | Owner chooses Mailchimp, Resend, or hybrid and approves sender/audience model. |
| TEDx video status | Transcript says wait for the official talk; later explicit user direction (2026-08-07) authorizes the previously supplied phone recording temporarily. | Older v37 mislabeled a hardcoded video official. | v40.7 publishes the preserved phone recording only as `user_authorized`, `ownerApproved=false`, `temporary=true`, with official replacement required. | Keep the current recording visibly temporary/non-official; replace it when the verified official release arrives. |
| Typography | Blueprint specifies Inter + Cormorant Garamond/DM Serif and a wordmark kit. | v37 uses Arial + Georgia/Palatino fallbacks. | Visual identity is an approximation. | Choose licensed typography and design the wordmark kit. |


## CF-09 — European Heart Journal publication year

- **Meeting/Register wording:** the newer acute-heart-attack/coronary-blood study is described as a 2025 European Heart Journal study.
- **Verified project evidence:** `app/content/evidence.ts` and the reconciliation record use the primary publication dated **2026**, DOI `10.1093/eurheartj/ehag447`.
- **Decision:** public-facing scientific metadata follows the verified primary publication record while this disagreement remains permanently documented. Do not regress to 2025 merely because it appears in the meeting/Register.

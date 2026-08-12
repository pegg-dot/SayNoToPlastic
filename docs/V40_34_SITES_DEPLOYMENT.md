# v40.34 — ChatGPT Sites deployment runbook

## Goal
Update the **existing Say No to Plastic ChatGPT Site** using the v40.34 source while preserving the existing Site identity, project/storage bindings, URL history, and rollback point. Do not create a replacement Site unless the owner explicitly chooses to abandon the current Site.

The package already contains the existing Sites project identity in `.openai/hosting.json`:

- project id: `appgprj_6a7123d6fe008191953f038d7221380e`
- D1 binding name: `DB`
- R2 binding name: `EBOOKS`

Do not replace those values casually.

## Before touching the connected Site

1. Keep the current published v30 version intact.
2. Download/store the v40.34 ZIP and checksum locally.
3. Do not put production secrets, bank/tax/identity data, customer data, or the final ebook into the source archive or project chat.
4. Decide whether this pass is only a private preview or a public cutover. The first connected import should be a review pass, not an automatic publish.

## In ChatGPT Sites

1. Open the **original chat where the existing Site was created**, or open **Sites** in the sidebar, locate the existing Say No to Plastic Site, and choose edit.
2. Attach/upload the v40.34 ZIP.
3. Tell the Site builder to treat `homo_plasticus_v40_34` as the authoritative source and preserve the existing Site/project identity, hosting/storage bindings, domain configuration, and rollback ability.
4. Tell it **not to publish yet** and **not to merge old source into v40.34 unless the runtime requires it**. If the connected project contains changes absent from v40.34, require a report before any merge.
5. Keep the normal commerce mode on `woocommerce` unless native Stripe has separately passed its activation checklist.
6. Run the connected clean install/build and browser QA. Review desktop, tablet, mobile, keyboard, reduced motion, 200% zoom, forms, external anatomy model loading/fallback, and the complete atlas.
7. Review the private preview. Save/version the accepted state before any public deployment.
8. Only after owner/editorial approval and provider readiness, choose the intended access setting and publish.

## Suggested import prompt

> I am importing the final externally developed release candidate for the existing connected Say No to Plastic / Homo Plasticus Site. The attached archive is `Homo-Plasticus-Say-No-to-Plastic-v40.34-deployment-release-candidate.zip`. Treat the folder `homo_plasticus_v40_34` as the authoritative application source. Preserve the existing Site identity, project id, URL/history, hosting connection, D1/R2 bindings, domain configuration, and rollback ability. Do not create a new Site. Do not publish yet. Do not alter `package-lock.json`, replace dependencies, add stubs, bypass failed checks, add secrets, add banking/tax/identity/customer data, or add the final ebook to public/source files. Keep `COMMERCE_MODE=woocommerce` for the normal candidate. If the connected project has changes not present in v40.34, report them before modifying anything. Run the clean connected build and QA, give me the private preview, and wait for explicit approval before publishing.

## Public cutover

Before public publication:

- owner/medical/content signoff complete;
- final commerce path verified;
- domain/DNS verified;
- support/sender identities verified;
- visible signup/contact forms proven against D1 + email/audience providers or intentionally disabled until configured;
- Privacy Policy reconciled with enabled providers;
- final browser/accessibility QA complete;
- rollback point saved.

Then publish the reviewed version and connect/verify the custom domain from the Site's settings if it is not already connected.

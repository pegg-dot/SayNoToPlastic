# v40.7 Media + Community polish

Date: 2026-08-07

## User-rendered review decisions

- Events & Media design is approved in direction; do not broadly redesign it.
- Publish the exact temporary phone-recorded TEDx YouTube link already preserved in v30, but label it clearly as temporary and not official.
- Replace that temporary TEDx link when the official TEDx release arrives.
- Restore the existing long-form Homo Plasticus YouTube conversation from v30.
- Keep the welcome-film infrastructure ready; the link is still pending from Dr. Haddad.
- On Community, show the full grandmother / mother / boy artwork instead of cropping the trio.

## Implemented

### TEDx

- Restored YouTube ID `MVnY2vw99SY` from the authoritative v30 project source.
- Registry status is playable and `user_authorized`, while `ownerApproved` remains false.
- Public copy says **temporary audience recording** and explicitly says it is not the official TEDx release.
- `replaceWhenOfficialAvailable` is true.
- Exact publication date is not fabricated; it remains `pending_verification`.

### Long-form conversation

- Restored YouTube ID `DJuZBIXeiM8` and the preserved title `Homo Plasticus: The Silent Invasion of Microplastics and Human Health`.
- Published under the current user instruction.
- Exact publication date remains pending verification rather than guessed.

### Welcome film

- No link was invented.
- Existing popup/player infrastructure remains.
- Public Media status now says the link is pending rather than implying the recording itself is necessarily unfinished.

### Community visual

- `/community` continues to use the supplied `generations.webp` / `generations-mobile.webp`.
- Hero image is eager/high-priority.
- CSS switches the image from `cover` cropping to natural-height `contain`, so the full trio can be judged in the real browser.
- Home still does not contain the oversized generations panel.

## Remaining proof

- Render the two media players and confirm click-to-play behavior, external YouTube links, responsive layout, and analytics.
- Verify exact publication dates and rights/reuse state for current media.
- Replace temporary TEDx entry with official release when received.
- Insert final welcome-film link/poster/captions/transcript when supplied.
- Render `/community` desktop/tablet/mobile and confirm the full trio is visible without an awkwardly oversized result.
## Acceptance ruler / audit result

- Ruler: **178 requirements = 99 proven / 46 proof-gated / 33 blocked**.
- Blocked subtype reconciliation: **23 owner/approval + 8 provider/domain + 2 missing source/context = 33**.
- Targeted Media + Community audit: **22/22 passed**.
- Full nothing-left-behind audit after subtype reconciliation: **299/299 passed**.
- Current media metadata intentionally carries four preflight warnings (authorization separation + unverified dates) and zero errors.


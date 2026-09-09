# Validation Report — v40.17 Interactive Extended-System Anatomy

Date: 2026-08-09

## Status

v40.17 introduced the interactive full-screen Skin, Endocrine, Kidneys/Urinary, and Digestive viewers on top of v40.16. Its source contract is now carried forward by v40.18.

The inherited `npm run anatomy:viewer` audit passes **50/50** in the v40.18 source and in the clean extracted release archive. It verifies model registration, exterior/cutaway/system-only modes, orbit/zoom/pan controls, framing controls, loading/retry/fallback behavior, provenance, accessibility hooks, version compatibility, and package-lock integrity.

## Browser proof boundary

Portable source checks do not replace real-browser acceptance. Final acceptance still requires opening all four viewers on the owner's Mac and checking model alignment, external HRA loading, touch and mouse interaction, keyboard-only navigation, reduced motion, 200% zoom, and offline/retry behavior.

## Production status

Nothing has been deployed or published. Production Sites v30 remains unchanged. See `VALIDATION_REPORT_V40_18.md` for the complete current-candidate regression record.

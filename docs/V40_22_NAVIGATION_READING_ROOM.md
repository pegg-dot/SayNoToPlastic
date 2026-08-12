# v40.22 architecture record — navigation, head alignment, and reading-room rhythm

## Intent

The rendered review identified four presentation problems rather than missing functionality:

1. the opening anatomy image had redundant floating system buttons even though the ten-chapter navigation already exposed those systems;
2. the brain surface was visibly displaced relative to the exterior head;
3. the main Science page repeated an Exposome experience that already had a canonical route and multiple cross-site entry points;
4. the Guides entry grid and ivory reading-room transition looked visually unbalanced.

v40.22 resolves those problems without changing the existing information architecture.

## Anatomy navigation

The floating Endocrine, Kidney, Skin, and Digestive pills were removed. Chapters 07–10 remain in the same two-column chapter navigation as chapters 01–06, so there is one consistent interaction model instead of two competing controls.

## Brain calibration

The local brain GLB is authored near the head in the same Human Reference Atlas coordinate space. The previous extra transform pulled the surface toward the face and neck. v40.22 uses one shared transform:

```ts
position: [0, 0.035, 0.005]
scale: 0.9
```

The same transform is consumed by the scroll scene and Complete Body Atlas. The dedicated audit parses the local GLB bounds and verifies that the calibrated brain remains below the exterior head top and within the upper-head region.

## Science deduplication

The main `/science` route now focuses on:

- how detection works;
- verified human studies;
- body-system context;
- public-health framing;
- practical next steps.

The Exposome remains canonical at `/science/exposome` and remains linked from shared navigation, practical-action content, body-system pages, About, Community, RSS, and sitemap. No Exposome content was deleted.

## Guides layout

The four route cards use a two-by-two desktop grid and one column on small screens. The reading-room background now uses a subtle paper gradient and compressed spacing between featured reads, controls, filters, and the full guide library. This keeps the ivory section intentional rather than appearing as a large blank block.

## Accessibility and behavior

- Chapter buttons remain native buttons with `aria-pressed` and `aria-controls`.
- Guides route cards remain normal links with visible keyboard focus.
- Search, filters, result count, and empty-state announcements are unchanged.
- Reduced-motion behavior and all existing responsive breakpoints remain intact.

## Production boundary

This is a portable source candidate only. Production remains unchanged. Real-browser acceptance must still verify the brain placement, ten-chapter navigation, two-by-two Guides routes, ivory reading-room rhythm, mobile flow, keyboard focus, reduced motion, and 200% zoom.

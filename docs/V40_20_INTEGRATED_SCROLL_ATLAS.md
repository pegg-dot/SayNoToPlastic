# v40.20 — Integrated Scroll Atlas

Date: 2026-08-09

## Product decision

The main anatomy journey and the Complete Body Atlas are two presentations of one registered anatomy system:

- the sticky ten-chapter journey is the guided evidence narrative;
- the Complete Body Atlas is the freely movable exploration surface.

The extended systems are not reserved for the second presentation. They are now part of the main body shown in chapter 01 and remain as contextual layers while the visitor advances through the guided chapters.

## Chapter-01 connected-body overview

The opening whole-body frame contains the compatible local and Human Reference Atlas layers together:

- exterior body surface;
- brain;
- circulation;
- heart;
- pelvic skeleton;
- uterus, ovaries, and fallopian-tube context;
- placenta and fetal reference surface;
- represented endocrine tissues;
- kidneys, ureters, and bladder;
- small and large intestines, liver, and pancreas.

Pregnancy anatomy remains visible but is deliberately less dominant in the opening frame than in the dedicated Pregnancy and Placenta chapter. This keeps urinary, digestive, and endocrine structures readable in the combined view.

The opening overlay labels Endocrine, Kidneys, Skin, and Digestive and moves directly to chapters 07–10. Chapter 01 also includes an **Open complete 3D** action, allowing the freely movable combined atlas to open from within the scroll instead of only after chapter 10.

## Guided focus behavior

Every non-male chapter retains a low-opacity whole-body context. As the visitor scrolls:

- the active system brightens;
- the camera moves to the appropriate body region;
- compatible surrounding structures remain visible as orientation context;
- the exterior shell becomes dominant for the Skin chapter;
- the separate male testicular specimen remains isolated rather than being falsely overlaid into the female reference body.

## Loading architecture

- Local models are loaded through the existing React Three Fiber loader.
- External HRA structures begin loading when the anatomy section approaches the viewport, using a generous root margin so normal scrolling and direct anchor visits start early.
- The scroll, focused viewers, and Complete Body Atlas reuse the shared `anatomyModelCache`.
- The registered HRA CDN path is attempted first and the registered GitHub release path remains the fallback.
- A failed remote layer does not crash the local anatomy sequence; focused viewers retain explicit progress, failure reporting, retry, and conceptual fallback paths.

## Duplicate-surface rule

The pancreas and ovaries participate in more than one biological system. The guided overview avoids showing competing duplicate endocrine copies at full strength. Their endocrine treatment becomes prominent when the Endocrine chapter is focused, while the same physical regions remain represented in the connected-body view.

## Accessibility

- The four opening pins are native buttons and move to the corresponding chapter.
- The Complete Body Atlas opener is a native button with dialog semantics.
- Focus-visible styling is retained.
- Pins and overview overlays are removed on constrained screens where they would obscure the model; all ten chapters remain reachable through the chapter navigation.
- Reduced-motion users keep the existing static anatomy fallback and nonanimated controls.
- The full-screen viewers preserve focus trapping, Escape closure, inert background, scroll locking, and focus return.

## Scientific and anatomical boundary

This is an educational composite assembled from licensed reference surfaces. It is not a patient reconstruction, diagnostic tool, microscopic tissue atlas, or claim that every organ, gland, bone, or tissue layer is represented.

Important limits remain visible:

- the skeleton layer represents the female pelvis, not every bone;
- the endocrine overlay contains the registered structures, not every endocrine gland;
- the separate male testicular chapter is not merged into the female whole-body composite;
- source surfaces originate from multiple reference datasets and are aligned for orientation rather than measurement;
- missing anatomy is not fabricated.

## Browser acceptance boundary

Source-level audits prove registration, loading architecture, layer-state logic, controls, accessibility hooks, responsive rules, documentation, and package integrity. Final browser review must still confirm:

- chapter 01 after all remote layers load;
- visual balance and alignment of every HRA structure;
- direct pin navigation and direct **Open complete 3D** access;
- all ten chapter transitions;
- desktop, tablet, phone, keyboard-only, touch, reduced-motion, and 200% zoom behavior;
- slow-network, failure, retry, cached, and offline-fallback behavior.

Nothing in this release publishes automatically. Production Sites v30 remains untouched.

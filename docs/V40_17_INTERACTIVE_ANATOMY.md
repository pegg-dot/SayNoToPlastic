# v40.17 Interactive Extended-System Anatomy

Date: 2026-08-09

## Purpose

v40.17 upgrades the four optional anatomy reference points introduced in v40.16—digestive system, kidneys and urinary system, endocrine and metabolic system, and skin—from text-only drawers into full-screen interactive 3D reference viewers. The work extends the existing six-chapter anatomy journey; it does not replace or redesign that journey.

## Visitor experience

Selecting any of the four labeled reference points now opens a keyboard-accessible modal viewer. Within the viewer a visitor can:

- drag to rotate the anatomy;
- use a mouse wheel or pinch gesture to zoom;
- Shift-drag to pan;
- frame the selected system or the complete body;
- return to front or rear orientation;
- zoom in, zoom out, or reset;
- switch among Exterior, Cutaway, and System-only layers;
- inspect the exact structures included in the scene;
- read the evidence boundary and open the canonical Science article;
- inspect the model provenance and license.

Exterior mode keeps the complete female body surface visible while rendering the selected system as a restrained x-ray overlay. Cutaway mode makes the body shell translucent. System-only mode removes the exterior shell. The skin viewer uses the complete exterior surface itself as the selected system.

## Open reference models

The exterior surface is the existing local `body-female.glb` asset already used by the anatomy journey. The additional organ surfaces are loaded only after the visitor opens a viewer. They come from the Human Reference Atlas v1.2 3D Reference Object Library:

### Kidneys and urinary system

- `VH_F_Kidney_L.glb`
- `VH_F_Kidney_R.glb`
- `VH_F_Ureter_L.glb`
- `VH_F_Ureter_R.glb`
- `VH_F_Urinary_Bladder.glb`

### Digestive system

- `VH_F_Small_Intestine.glb`
- `SBU_F_Intestine_Large.glb`
- `VH_F_Liver.glb`
- `VH_F_Pancreas.glb`

### Endocrine and metabolic system

- `VH_F_Pancreas.glb`
- `VH_F_Thymus.glb`
- `VH_F_Ovary_L.glb`
- `VH_F_Ovary_R.glb`

### Skin

- existing local complete female exterior surface, `body-female.glb`

The endocrine system is broader than the structures shown. The viewer explicitly states that thyroid, adrenal, pituitary, testicular, and other hormone-producing tissues discussed in the article are not represented in this scene. No decorative geometry is presented as missing anatomy.

## Delivery architecture

The viewer first requests each organ from the official HRA CDN. If that request fails, it tries the same file in the official `hubmapconsortium/ccf-releases` repository through `raw.githubusercontent.com`. Files are requested only for the selected system and can be reused from the browser cache on later opens.

Because the organ files are not duplicated inside the release ZIP:

- the site package remains portable and substantially smaller;
- the first open of a non-skin extended-system viewer requires an internet connection;
- the local body exterior remains available without the external organ files;
- a conceptual system diagram and retry control appear if the organ surfaces cannot load;
- partial success is shown honestly rather than suppressing the viewer.

## Interaction and accessibility

The viewer uses the project's existing React Three Fiber and Three.js dependencies. Orbit controls are imported from the installed Three.js package; no new package or lockfile change is required.

The viewer:

- is portaled outside `#site-shell`;
- marks the site shell inert and `aria-hidden` while open;
- traps Tab and Shift+Tab within the modal;
- closes with Escape, the close button, or the backdrop;
- returns focus to the hotspot that opened it;
- locks page scrolling while open;
- suppresses the welcome-film replay trigger while the viewer owns focus;
- honors `prefers-reduced-motion` by disabling inertial camera damping and CSS animation;
- provides visible loading, partial-load, error, retry, and provenance states;
- uses explicit educational and non-diagnostic language.

## Camera architecture

Camera framing is calculated from the real bounding box of the loaded objects. The same controller can frame either:

- the complete body shell; or
- the selected organ group.

This prevents hard-coded camera coordinates from breaking when a system contains one organ versus several organs. Front, rear, zoom, and reset actions operate on the currently selected framing target.

## Scientific and visual boundary

These models are educational reference surfaces, not a patient-specific reconstruction, diagnostic image, exposure measurement, or disease simulation. Materials, opacity, lighting, and camera presentation are adapted at runtime; the underlying HRA geometry is not edited by the site.

## License and attribution

The HRA reference objects are released under Creative Commons Attribution 4.0 International. Exact files, delivery endpoints, modification notes, and the educational boundary are recorded in `public/models/anatomy/LICENSES.txt`.

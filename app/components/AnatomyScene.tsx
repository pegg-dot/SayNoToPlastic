"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { anatomySystemModels, BRAIN_ALIGNMENT } from "../content/anatomy-system-models";
import type { AnatomyViewerModel } from "../content/anatomy-system-models";
import { loadAnatomyModel } from "../lib/anatomy-model-loader";
import type { LoadedAnatomyModel } from "../lib/anatomy-model-loader";

type AnatomySceneProps = {
  progress: MutableRefObject<number>;
  reducedMotion: boolean;
  activeIndex: number;
  loadCompleteContext: boolean;
};

type LayerKind = "body" | "pregnantBody" | "vasculature" | "brain" | "heart" | "pelvis" | "uterus" | "placenta" | "fetus" | "ovary" | "reproductive" | "endocrine" | "kidneys" | "digestive";

type SceneState = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  layers: Record<LayerKind | "testes" | "particles", number>;
};

const MODEL_URLS = [
  "/models/anatomy/body-female.glb",
  "/models/anatomy/vasculature-female.glb",
  "/models/anatomy/brain.glb",
  "/models/anatomy/heart.glb",
  "/models/anatomy/uterus-female.glb",
  "/models/anatomy/placenta.glb",
  "/models/anatomy/pelvis-female.glb",
  "/models/anatomy/ovary.glb",
  "/models/anatomy/fetus-mri.glb",
];

const CONTEXT_LAYERS: SceneState["layers"] = {
  body: 0.09,
  pregnantBody: 0,
  vasculature: 0.09,
  brain: 0.065,
  heart: 0.075,
  pelvis: 0.075,
  uterus: 0.05,
  placenta: 0.045,
  fetus: 0.045,
  ovary: 0.055,
  reproductive: 0.065,
  endocrine: 0.075,
  kidneys: 0.09,
  digestive: 0.08,
  testes: 0,
  particles: 0.18,
};

const layerState = (overrides: Partial<SceneState["layers"]> = {}): SceneState["layers"] => ({
  ...CONTEXT_LAYERS,
  ...overrides,
});

const completeAtlasModels = anatomySystemModels["whole-body-atlas"].models;
const journeyReproductiveModels = completeAtlasModels.filter((model) => model.group === "reproductive" && model.fileName.includes("Fallopian"));
const journeyEndocrineModels = completeAtlasModels.filter((model) => model.group === "endocrine");
const journeyUrinaryModels = completeAtlasModels.filter((model) => model.group === "urinary");
const journeyDigestiveModels = completeAtlasModels.filter((model) => model.group === "digestive");

/*
 * Ten chapters share one scroll-controlled camera. The opening five evidence
 * chapters are followed by endocrine, kidney, skin, and digestive context, with
 * the separate male testicular-tissue study intentionally closing the journey.
 * Every scene retains a visible complete-atlas context; the selected chapter
 * brightens and moves forward without making the rest of the body disappear.
 * The opening scene deliberately includes every supported system so the added
 * anatomy is part of the main scroll, not only the separate complete-body viewer.
 */
const SCENES: SceneState[] = [
  {
    position: new THREE.Vector3(3.05, 0.1, 10.55),
    target: new THREE.Vector3(0, 0.06, 0),
    layers: layerState({ body: 0, pregnantBody: 0.16, vasculature: 0.58, brain: 0.62, heart: 0.78, pelvis: 0.4, placenta: 0.26, fetus: 0.32, ovary: 0.24, reproductive: 0.42, endocrine: 0.72, kidneys: 0.82, digestive: 0.72, particles: 0.3, uterus: 0.28 }),
  },
  {
    position: new THREE.Vector3(0.28, 2.69, 3.02),
    target: new THREE.Vector3(0, 2.69, 0),
    layers: layerState({ body: 0.08, pregnantBody: 0.08, vasculature: 0.13, brain: 1, heart: 0.08, pelvis: 0.06, placenta: 0.05, fetus: 0.05, particles: 0.22, uterus: 0.04 }),
  },
  {
    position: new THREE.Vector3(0.3, 1.55, 3.08),
    target: new THREE.Vector3(0.05, 1.55, 0),
    layers: layerState({ body: 0.08, pregnantBody: 0.08, vasculature: 0.34, brain: 0.06, heart: 1, pelvis: 0.08, placenta: 0.08, fetus: 0.09, particles: 0.22, uterus: 0.04 }),
  },
  {
    position: new THREE.Vector3(2.78, 0.42, 7.65),
    target: new THREE.Vector3(0, 0.27, 0),
    layers: layerState({ body: 0, pregnantBody: 0.34, vasculature: 0.1, brain: 0.08, heart: 0.22, pelvis: 0.58, placenta: 1, fetus: 1, ovary: 0.07, reproductive: 0.14, particles: 0.24, uterus: 0.9 }),
  },
  {
    position: new THREE.Vector3(-0.18, 0.22, 1.78),
    target: new THREE.Vector3(-0.23, 0.2, -0.15),
    layers: layerState({ body: 0.08, pregnantBody: 0.06, pelvis: 0.24, ovary: 1, reproductive: 0.48, particles: 0.26, uterus: 0.2 }),
  },
  {
    position: new THREE.Vector3(2.2, 0.72, 8.35),
    target: new THREE.Vector3(0, 0.72, 0),
    layers: layerState({ body: 0.1, pregnantBody: 0, vasculature: 0.025, brain: 0.02, heart: 0.02, pelvis: 0.035, uterus: 0.02, placenta: 0.015, fetus: 0.015, ovary: 0.03, reproductive: 0.03, endocrine: 1, kidneys: 0.025, digestive: 0.025, particles: 0.2 }),
  },
  {
    position: new THREE.Vector3(0.42, 0.42, 3.85),
    target: new THREE.Vector3(0, 0.37, 0),
    layers: layerState({ body: 0.11, pregnantBody: 0, vasculature: 0.035, brain: 0.02, heart: 0.02, pelvis: 0.05, uterus: 0.02, placenta: 0.015, fetus: 0.015, ovary: 0.02, reproductive: 0.02, endocrine: 0.025, kidneys: 1, digestive: 0.03, particles: 0.24 }),
  },
  {
    position: new THREE.Vector3(3.0, 0.1, 10.6),
    target: new THREE.Vector3(0, 0.08, 0),
    layers: layerState({ body: 0.86, pregnantBody: 0, vasculature: 0.015, brain: 0.012, heart: 0.012, pelvis: 0.015, uterus: 0.01, placenta: 0.008, fetus: 0.008, ovary: 0.01, reproductive: 0.01, endocrine: 0.012, kidneys: 0.015, digestive: 0.012, particles: 0.16 }),
  },
  {
    position: new THREE.Vector3(0.52, 0.16, 4.12),
    target: new THREE.Vector3(0, 0.2, 0),
    layers: layerState({ body: 0.1, pregnantBody: 0, vasculature: 0.025, brain: 0.02, heart: 0.02, pelvis: 0.04, uterus: 0.02, placenta: 0.015, fetus: 0.015, ovary: 0.02, reproductive: 0.02, endocrine: 0.025, kidneys: 0.03, digestive: 1, particles: 0.22 }),
  },
  {
    position: new THREE.Vector3(0.2, 0.04, 4.9),
    target: new THREE.Vector3(0, 0.02, 0),
    layers: layerState({ body: 0.05, testes: 1, particles: 0.24 }),
  },

];

const PARTICLE_CENTERS = [
  new THREE.Vector3(0, 0.06, 0.18),
  new THREE.Vector3(0, 2.68, 0.12),
  new THREE.Vector3(0.04, 1.53, 0.14),
  new THREE.Vector3(0, 0.28, 0.12),
  new THREE.Vector3(-0.22, 0.2, -0.04),
  new THREE.Vector3(0, 0.75, 0.08),
  new THREE.Vector3(0, 0.38, 0.08),
  new THREE.Vector3(0, 0.86, 0.15),
  new THREE.Vector3(0, 0.2, 0.08),
  new THREE.Vector3(0, 0, 0.1),
];

const PARTICLE_FIELDS = [
  { spread: new THREE.Vector3(2.18, 3.15, 0.76), drift: new THREE.Vector3(0.02, 0, 0), density: 1 },
  { spread: new THREE.Vector3(0.34, 0.26, 0.2), drift: new THREE.Vector3(0, 0.02, 0.03), density: 0.8 },
  { spread: new THREE.Vector3(0.44, 0.38, 0.24), drift: new THREE.Vector3(0.04, 0.02, 0.01), density: 0.86 },
  { spread: new THREE.Vector3(0.88, 0.62, 0.34), drift: new THREE.Vector3(0.06, 0, -0.02), density: 0.88 },
  { spread: new THREE.Vector3(0.24, 0.2, 0.16), drift: new THREE.Vector3(0, -0.01, 0), density: 0.96 },
  { spread: new THREE.Vector3(1.08, 0.98, 0.34), drift: new THREE.Vector3(0.08, 0, 0.02), density: 0.82 },
  { spread: new THREE.Vector3(0.56, 0.68, 0.22), drift: new THREE.Vector3(0, -0.03, 0.01), density: 0.92 },
  { spread: new THREE.Vector3(1.76, 2.52, 0.16), drift: new THREE.Vector3(0.02, 0.06, 0.18), density: 0.78 },
  { spread: new THREE.Vector3(0.64, 0.82, 0.26), drift: new THREE.Vector3(0, -0.02, 0.03), density: 0.88 },
  { spread: new THREE.Vector3(0.34, 0.3, 0.2), drift: new THREE.Vector3(0, 0.01, 0.02), density: 0.94 },
];

type MicroplasticFlowDefinition = {
  label: string;
  curves: THREE.CatmullRomCurve3[];
  speed: number;
  jitter: number;
};

function flowCurve(points: Array<[number, number, number]>, closed = false) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    closed,
    "catmullrom",
    0.42,
  );
}

// These paths are intentionally educational spatial cues. They follow the
// displayed anatomy so the particles read as moving with the active system,
// but they are not presented as measured particle trajectories in people.
const MICROPLASTIC_FLOW_DEFINITIONS: MicroplasticFlowDefinition[] = [
  {
    label: "circulation",
    speed: 0.052,
    jitter: 0.025,
    curves: [
      flowCurve([[0.02, 1.48, 0.2], [0.15, 2.05, 0.16], [0.04, 2.67, 0.13], [-0.15, 2.08, 0.14], [0.02, 1.48, 0.2]], true),
      flowCurve([[0.02, 1.48, 0.18], [0.3, 1.08, 0.16], [0.24, 0.45, 0.15], [0.08, -0.55, 0.13], [-0.22, 0.42, 0.14], [-0.28, 1.04, 0.16], [0.02, 1.48, 0.18]], true),
    ],
  },
  {
    label: "brain tissue",
    speed: 0.037,
    jitter: 0.018,
    curves: [
      flowCurve([[-0.27, 2.67, 0.18], [-0.14, 2.9, 0.16], [0.18, 2.88, 0.15], [0.3, 2.67, 0.17], [0.12, 2.47, 0.18], [-0.18, 2.48, 0.17]], true),
      flowCurve([[-0.12, 2.61, 0.23], [0.05, 2.79, 0.21], [0.2, 2.6, 0.22], [0.02, 2.5, 0.24]], true),
    ],
  },
  {
    label: "heart and arteries",
    speed: 0.07,
    jitter: 0.017,
    curves: [
      flowCurve([[-0.16, 1.45, 0.22], [-0.08, 1.67, 0.2], [0.13, 1.72, 0.18], [0.25, 1.5, 0.2], [0.12, 1.3, 0.21], [-0.1, 1.31, 0.22]], true),
      flowCurve([[0.08, 1.55, 0.17], [0.35, 1.72, 0.16], [0.5, 1.48, 0.15], [0.38, 1.25, 0.17], [0.12, 1.38, 0.18]], true),
    ],
  },
  {
    label: "placenta and pregnancy anatomy",
    speed: 0.033,
    jitter: 0.017,
    curves: [
      flowCurve([[-0.42, 0.33, 0.2], [-0.2, 0.62, 0.18], [0.22, 0.58, 0.18], [0.46, 0.28, 0.19], [0.18, -0.02, 0.2], [-0.2, 0.02, 0.2]], true),
    ],
  },
  {
    label: "ovary and follicular-fluid context",
    speed: 0.04,
    jitter: 0.012,
    curves: [
      flowCurve([[-0.36, 0.2, 0.2], [-0.28, 0.32, 0.19], [-0.16, 0.25, 0.2], [-0.19, 0.1, 0.21]], true),
      flowCurve([[0.16, 0.25, 0.2], [0.28, 0.32, 0.19], [0.37, 0.19, 0.2], [0.23, 0.09, 0.21]], true),
    ],
  },
  {
    label: "endocrine tissue context",
    speed: 0.031,
    jitter: 0.02,
    curves: [
      flowCurve([[-0.34, 0.72, 0.22], [-0.15, 0.92, 0.2], [0.22, 0.9, 0.2], [0.36, 0.68, 0.21], [0.08, 0.52, 0.22], [-0.22, 0.55, 0.22]], true),
      flowCurve([[-0.18, 1.5, 0.2], [0.02, 1.68, 0.18], [0.18, 1.48, 0.2], [0.01, 1.34, 0.21]], true),
    ],
  },
  {
    label: "kidney to ureter to bladder anatomy",
    speed: 0.082,
    jitter: 0.01,
    curves: [
      flowCurve([[-0.38, 0.62, 0.24], [-0.36, 0.45, 0.24], [-0.3, 0.2, 0.23], [-0.2, -0.04, 0.22], [-0.05, -0.25, 0.22]]),
      flowCurve([[0.38, 0.62, 0.24], [0.36, 0.45, 0.24], [0.3, 0.2, 0.23], [0.2, -0.04, 0.22], [0.05, -0.25, 0.22]]),
    ],
  },
  {
    label: "skin surface",
    speed: 0.045,
    jitter: 0.018,
    curves: [
      flowCurve([[-0.42, 2.54, 0.28], [-0.86, 1.92, 0.3], [-1.28, 1.22, 0.31], [-1.48, 0.48, 0.31], [-1.22, -0.32, 0.3], [-0.62, -1.12, 0.29], [-0.42, -2.16, 0.28], [0.42, -2.16, 0.28], [0.62, -1.12, 0.29], [1.22, -0.32, 0.3], [1.48, 0.48, 0.31], [1.28, 1.22, 0.31], [0.86, 1.92, 0.3], [0.42, 2.54, 0.28], [0, 2.82, 0.27]], true),
    ],
  },
  {
    label: "digestive lumen anatomy",
    speed: 0.073,
    jitter: 0.012,
    curves: [
      flowCurve([[0.02, 1.14, 0.24], [0.02, 0.9, 0.24], [-0.12, 0.68, 0.24], [-0.26, 0.48, 0.23], [0.16, 0.36, 0.23], [-0.2, 0.18, 0.23], [0.2, 0.02, 0.23], [-0.18, -0.13, 0.23], [0.16, -0.29, 0.23], [0, -0.47, 0.23]]),
      flowCurve([[-0.34, 0.5, 0.2], [-0.42, 0.16, 0.21], [-0.34, -0.3, 0.21], [0, -0.44, 0.21], [0.34, -0.3, 0.21], [0.42, 0.16, 0.21], [0.34, 0.5, 0.2]]),
    ],
  },
  {
    label: "testicular tissue context",
    speed: 0.038,
    jitter: 0.012,
    curves: [
      flowCurve([[-0.32, 0.03, 0.22], [-0.25, 0.17, 0.21], [-0.11, 0.08, 0.22], [-0.16, -0.08, 0.23]], true),
      flowCurve([[0.11, 0.08, 0.22], [0.25, 0.17, 0.21], [0.32, 0.03, 0.22], [0.16, -0.08, 0.23]], true),
    ],
  },
];

function ease(value: number) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function sceneValue(progress: number) {
  return THREE.MathUtils.clamp(progress, 0, 1) * (SCENES.length - 1);
}

function focusFor(progress: number, index: number) {
  return ease(1 - Math.abs(sceneValue(progress) - index));
}

function materialColor(kind: LayerKind, sourceName: string) {
  const name = sourceName.toLowerCase();
  if (name.includes("vein")) return "#365d76";
  if (name.includes("arter")) return "#bd6848";
  if (kind === "body" || kind === "pregnantBody") return "#9cafb6";
  if (kind === "vasculature") return "#a95743";
  if (kind === "brain") return "#d3a36f";
  if (kind === "heart") return "#a84e40";
  if (kind === "pelvis") return "#b8a895";
  if (kind === "uterus") return "#b56a62";
  if (kind === "placenta") {
    if (name.includes("amnion")) return "#86a9b4";
    if (name.includes("vessel") || name.includes("umbilical")) return "#c57358";
    return "#b76050";
  }
  if (kind === "fetus") return "#d58b73";
  return "#c48269";
}

function sceneLayerOpacity(kind: keyof SceneState["layers"], progress: number) {
  const exact = sceneValue(progress);
  const from = Math.min(Math.floor(exact), SCENES.length - 1);
  const to = Math.min(from + 1, SCENES.length - 1);
  const rawMix = exact - from;
  if (from === 8 && to === 9 && kind === "testes") {
    return SCENES[to].layers.testes * ease((rawMix - 0.52) / 0.35);
  }
  return THREE.MathUtils.lerp(SCENES[from].layers[kind], SCENES[to].layers[kind], ease(rawMix));
}

function renderOrderFor(kind: LayerKind) {
  if (kind === "body" || kind === "pregnantBody") return 1;
  if (kind === "vasculature") return 2;
  if (kind === "placenta") return 4;
  if (kind === "fetus") return 5;
  return 3;
}

function deformForPregnancy(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !(child.geometry instanceof THREE.BufferGeometry)) return;
    const geometry = child.geometry.clone();
    const position = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const y = position.getY(index);
      const z = position.getZ(index);
      const side = Math.max(0, 1 - (x / 0.3) ** 2);
      const vertical = Math.max(0, 1 - ((y - 0.075) / 0.33) ** 2);
      const anterior = THREE.MathUtils.smoothstep(z, -0.09, 0.08);
      const weight = side * vertical * anterior;
      if (weight <= 0) continue;
      position.setZ(index, z + weight * 0.205);
      position.setX(index, x * (1 + weight * 0.1));
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    child.geometry = geometry;
  });
}

function CameraRig({ progress, reducedMotion }: Pick<AnatomySceneProps, "progress" | "reducedMotion">) {
  const target = useMemo(() => new THREE.Vector3(), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const exact = sceneValue(progress.current);
    const from = Math.min(Math.floor(exact), SCENES.length - 1);
    const to = Math.min(from + 1, SCENES.length - 1);
    const mix = reducedMotion ? Math.round(exact - from) : ease(exact - from);
    desiredPosition.lerpVectors(SCENES[from].position, SCENES[to].position, mix);
    target.lerpVectors(SCENES[from].target, SCENES[to].target, mix);
    camera.position.lerp(desiredPosition, reducedMotion ? 1 : 0.105);
    camera.lookAt(target);
  });
  return null;
}

function AnatomicalLayer({
  source,
  kind,
  progress,
  focusIndex,
}: {
  source: GLTF;
  kind: LayerKind;
  progress: MutableRefObject<number>;
  focusIndex: number;
}) {
  const group = useRef<THREE.Group>(null);
  const prepared = useMemo(() => {
    const object = source.scene.clone(true);
    if (kind === "pregnantBody") deformForPregnancy(object);
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.frustumCulled = false;
      child.renderOrder = renderOrderFor(kind);
      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const replacements = sourceMaterials.map((item) => {
        const color = materialColor(kind, item.name || "");
        const material = new THREE.MeshStandardMaterial({
          color,
          emissive: new THREE.Color(color).multiplyScalar(kind === "body" ? 0.1 : 0.18),
          emissiveIntensity: 0.35,
          roughness: kind === "body" || kind === "pregnantBody" ? 0.4 : 0.47,
          metalness: 0,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: kind === "body" || kind === "pregnantBody" || sourceNameIncludes(item.name, "amnion") ? THREE.DoubleSide : THREE.FrontSide,
        });
        material.userData.opacityFactor = sourceNameIncludes(item.name, "amnion") ? 0.22 : 1;
        return material;
      });
      child.material = Array.isArray(child.material) ? replacements : replacements[0];
    });

    return object;
  }, [kind, source.scene]);

  useFrame(() => {
    if (!group.current) return;
    const focus = focusFor(progress.current, focusIndex);
    const opacity = sceneLayerOpacity(kind, progress.current);
    group.current.visible = opacity > 0.006;
    group.current.rotation.y = 0;
    group.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        material.opacity = opacity * (Number(material.userData.opacityFactor) || 1);
        material.emissiveIntensity = THREE.MathUtils.lerp(0.18, 0.62, focus);
      });
    });
  });

  return (
    <group ref={group}>
      <primitive object={prepared} />
    </group>
  );
}

function sourceNameIncludes(name: string | undefined, fragment: string) {
  return (name ?? "").toLowerCase().includes(fragment);
}

function FetalSurface({ source, progress }: { source: GLTF; progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const prepared = useMemo(() => {
    const object = source.scene.clone(true);
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.frustumCulled = false;
      child.renderOrder = renderOrderFor("fetus");
      child.material = new THREE.MeshPhysicalMaterial({
        color: materialColor("fetus", ""),
        emissive: "#6f3328",
        emissiveIntensity: 0.38,
        roughness: 0.68,
        sheen: 0.16,
        sheenColor: new THREE.Color("#f3b39a"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    });
    return object;
  }, [source.scene]);

  useFrame(() => {
    if (!group.current) return;
    const opacity = sceneLayerOpacity("fetus", progress.current);
    const focus = focusFor(progress.current, 3);
    group.current.visible = opacity > 0.006;
    group.current.rotation.y = 0;
    group.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshPhysicalMaterial)) return;
      child.material.opacity = opacity;
      child.material.emissiveIntensity = THREE.MathUtils.lerp(0.24, 0.5, focus);
    });
  });

  return (
    <group
      ref={group}
      position={[-0.006, 0.177, 0.074]}
      rotation={[-Math.PI / 2, 0, -0.08]}
      scale={0.61}
    >
      <primitive object={prepared} />
    </group>
  );
}

function TesticularAtlas({ progress, geometries }: { progress: MutableRefObject<number>; geometries: THREE.BufferGeometry[] }) {
  const group = useRef<THREE.Group>(null);
  const testisMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d39a69", emissive: "#623c2c", roughness: 0.5, transparent: true, opacity: 0, depthWrite: false }), []);
  const epididymisMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#a95c49", emissive: "#4c2821", roughness: 0.52, transparent: true, opacity: 0, depthWrite: false }), []);
  const smoothedGeometries = useMemo(() => geometries.map((geometry) => {
    const smoothed = mergeVertices(geometry.clone(), 0.01);
    smoothed.computeVertexNormals();
    return smoothed;
  }), [geometries]);
  const transform = useMemo(() => {
    const box = new THREE.Box3();
    smoothedGeometries.forEach((geometry) => {
      geometry.computeBoundingBox();
      if (geometry.boundingBox) box.union(geometry.boundingBox);
    });
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    return { center, scale: 1.28 / Math.max(size.x, size.y, size.z) };
  }, [smoothedGeometries]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const focus = focusFor(progress.current, 9);
    const opacity = sceneLayerOpacity("testes", progress.current);
    group.current.visible = opacity > 0.006;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.045 * focus;
    group.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshStandardMaterial)) return;
      child.material.opacity = opacity;
      child.material.emissiveIntensity = THREE.MathUtils.lerp(0.16, child.name === "epididymis" ? 0.52 : 0.48, focus);
    });
  });

  return (
    <group ref={group} scale={transform.scale} rotation={[-Math.PI / 2, 0, 0]}>
      {smoothedGeometries.map((geometry, index) => (
        <mesh
          key={index}
          name={index < 2 ? "testis" : "epididymis"}
          geometry={geometry}
          material={index < 2 ? testisMaterial : epididymisMaterial}
          renderOrder={5}
          position={[-transform.center.x, -transform.center.y, -transform.center.z]}
        />
      ))}
    </group>
  );
}


type JourneyRemoteLayerKind = "reproductive" | "endocrine" | "kidneys" | "digestive";

function useJourneySystemModels(definitions: AnatomyViewerModel[], enabled: boolean) {
  const [records, setRecords] = useState<LoadedAnatomyModel[]>([]);
  const requested = useRef(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  useEffect(() => {
    if (!enabled || requested.current || definitions.length === 0) return;
    requested.current = true;
    definitions.forEach((definition) => {
      void loadAnatomyModel(definition).then((record) => {
        if (!mounted.current) return;
        setRecords((current) => current.some((item) => item.definition.id === record.definition.id)
          ? current
          : [...current, record]);
      }).catch(() => {
        // The scroll sequence remains usable with the local shell if a remote surface is unavailable.
      });
    });
  }, [definitions, enabled]);

  return records;
}

function JourneyRemoteSystemLayer({
  kind,
  focusIndex,
  progress,
  definitions,
  enabled,
}: {
  kind: JourneyRemoteLayerKind;
  focusIndex: number;
  progress: MutableRefObject<number>;
  definitions: AnatomyViewerModel[];
  enabled: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const records = useJourneySystemModels(definitions, enabled);
  const prepared = useMemo(() => records.map((record) => {
    const object = record.gltf.scene.clone(true);
    const materials: THREE.MeshStandardMaterial[] = [];
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.frustumCulled = false;
      child.renderOrder = 4;
      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const replacements = sourceMaterials.map(() => {
        const material = new THREE.MeshStandardMaterial({
          color: record.definition.color,
          emissive: record.definition.emissive,
          emissiveIntensity: 0.45,
          roughness: 0.44,
          metalness: 0,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        materials.push(material);
        return material;
      });
      child.material = Array.isArray(child.material) ? replacements : replacements[0];
    });
    return { record, object, materials };
  }), [records]);

  useEffect(() => () => {
    prepared.forEach((item) => item.materials.forEach((material) => material.dispose()));
  }, [prepared]);

  useFrame(() => {
    if (!group.current) return;
    const opacity = sceneLayerOpacity(kind, progress.current);
    const focus = focusFor(progress.current, focusIndex);
    const overview = focusFor(progress.current, 0);
    group.current.visible = opacity > 0.006;
    prepared.forEach((item) => {
      const sharedEndocrineSurface = kind === "endocrine"
        && (item.record.definition.fileName.includes("Pancreas") || item.record.definition.fileName.includes("Ovary"));
      const sharedSurfaceFactor = Math.max(focus, overview * 0.55);
      const modelOpacity = sharedEndocrineSurface ? opacity * sharedSurfaceFactor : opacity;
      item.materials.forEach((material) => {
        material.opacity = Math.min(1, modelOpacity * THREE.MathUtils.lerp(1, 1.06, overview));
        material.emissiveIntensity = Math.max(
          THREE.MathUtils.lerp(0.3, 0.8, focus),
          THREE.MathUtils.lerp(0.3, 0.58, overview),
        );
        material.needsUpdate = true;
      });
    });
  });

  return (
    <group ref={group}>
      {prepared.map(({ record, object }) => {
        const transform = record.definition.transform;
        const modelScale = transform?.scale;
        const scale = typeof modelScale === "number"
          ? [modelScale, modelScale, modelScale] as [number, number, number]
          : modelScale;
        return (
          <group
            key={record.definition.id}
            position={transform?.position}
            rotation={transform?.rotation}
            scale={scale}
          >
            <primitive object={object} />
          </group>
        );
      })}
    </group>
  );
}

type ParticleShape = "shard" | "flake" | "chip" | "fiber" | "bead" | "film" | "grain";

type MicroplasticPoint = {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  phase: number;
  wobble: number;
  stretch: number;
  thickness: number;
  drift: number;
  tint: string;
};

type MicroplasticShapeConfig = {
  shape: ParticleShape;
  count: number;
  opacity: number;
  points: MicroplasticPoint[];
};

const MICROPLASTIC_PALETTES: Record<ParticleShape, string[]> = {
  shard: ["#f7fbfa", "#dceff1", "#6ed4ff", "#197fd1", "#ff7b28", "#ffd34d", "#67c95f", "#ff77ac", "#9a6cff"],
  flake: ["#f4f7f3", "#d5edf3", "#82d9ff", "#2a8ed5", "#ff973e", "#ffe06b", "#77ce6a", "#ff8ab7", "#b17cff"],
  chip: ["#eef8f8", "#55c7f2", "#126fc0", "#ff6b24", "#f5c744", "#54bf59", "#f66b9d", "#8054c7"],
  fiber: ["#f9faf4", "#65d3ff", "#0d82ca", "#48c767", "#ff746d", "#ffb743", "#bd68e8", "#292c30"],
  bead: ["#f8f6e9", "#9be5f6", "#3d9bda", "#ffa33a", "#f6d55d", "#ff88ab", "#72c667"],
  film: ["#f8ffff", "#d9f4f7", "#a7e5f5", "#70c8e9", "#f4a8c4", "#ffe59a", "#97df97"],
  grain: ["#eee7d5", "#d0ba8b", "#8d7856", "#4d4236", "#292c30", "#dba947", "#65a8bd", "#b56a8c"],
};

function microplasticNoise(index: number, salt: number) {
  const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function createMicroplasticPoints(shape: ParticleShape, count: number) {
  const palette = MICROPLASTIC_PALETTES[shape];

  return Array.from({ length: count }, (_, index) => {
    const n = (salt: number) => microplasticNoise(index + shape.length * 19, salt);
    let size = 0.01;
    let stretch = 1;
    let thickness = 1;

    if (shape === "fiber") {
      size = 0.0028 + n(4) * 0.0048;
      stretch = 4.2 + n(8) * 7.0;
      thickness = 0.2 + n(10) * 0.2;
    } else if (shape === "bead") {
      size = 0.003 + n(4) * 0.007;
      stretch = 0.82 + n(8) * 0.38;
      thickness = 0.9 + n(10) * 0.18;
    } else if (shape === "film") {
      size = 0.0038 + n(4) * 0.011;
      stretch = 0.55 + n(8) * 2.35;
      thickness = 0.05 + n(10) * 0.08;
    } else if (shape === "grain") {
      size = 0.0018 + n(4) * 0.0048;
      stretch = 0.62 + n(8) * 1.05;
      thickness = 0.72 + n(10) * 0.55;
    } else {
      size = 0.0034 + n(4) * 0.0135;
      stretch = 0.42 + n(8) * 2.45;
      thickness = 0.2 + n(10) * 0.92;
    }

    // Keep clear/white pieces common, but force enough saturated fragments to read as real mixed debris.
    const paletteBias = n(12) < 0.28 ? Math.floor(n(13) * Math.min(2, palette.length)) : Math.floor(n(14) * palette.length);

    return {
      x: n(1) * 2 - 1,
      y: n(2) * 2 - 1,
      z: n(3) * 2 - 1,
      size,
      speed: 0.12 + n(5) * 0.32,
      phase: n(6) * Math.PI * 2,
      wobble: 0.008 + n(7) * (shape === "fiber" ? 0.025 : 0.052),
      stretch,
      thickness,
      drift: n(9) * 2 - 1,
      tint: palette[paletteBias],
    };
  });
}

function MicroplasticShapeLayer({
  progress,
  config,
}: {
  progress: MutableRefObject<number>;
  config: MicroplasticShapeConfig;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const center = useMemo(() => new THREE.Vector3(), []);
  const drift = useMemo(() => new THREE.Vector3(), []);
  const spread = useMemo(() => new THREE.Vector3(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const rotation = useMemo(() => new THREE.Euler(), []);

  // Initialize instance colors before the material shader is compiled.
  // `vertexColors` is intentionally NOT enabled below: these meshes do not
  // have per-vertex color attributes, and enabling it makes WebGL multiply
  // the instance tint by a missing/black vertex-color attribute.
  useLayoutEffect(() => {
    if (!mesh.current) return;
    config.points.forEach((point, index) => {
      mesh.current!.setColorAt(index, color.set(point.tint));
    });
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    if (material.current) material.current.needsUpdate = true;
  }, [color, config.points]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const exact = sceneValue(progress.current);
    const from = Math.min(Math.floor(exact), SCENES.length - 1);
    const to = Math.min(from + 1, SCENES.length - 1);
    const mix = ease(exact - from);
    center.lerpVectors(PARTICLE_CENTERS[from], PARTICLE_CENTERS[to], mix);
    spread.lerpVectors(PARTICLE_FIELDS[from].spread, PARTICLE_FIELDS[to].spread, mix);
    drift.lerpVectors(PARTICLE_FIELDS[from].drift, PARTICLE_FIELDS[to].drift, mix);
    const density = THREE.MathUtils.lerp(PARTICLE_FIELDS[from].density, PARTICLE_FIELDS[to].density, mix);
    const opacity = sceneLayerOpacity("particles", progress.current);
    const visibleOpacity = opacity * density;

    mesh.current.visible = visibleOpacity > 0.01;
    config.points.forEach((point, index) => {
      const time = clock.elapsedTime * point.speed + point.phase;
      const offsetX = point.x * spread.x + Math.sin(time) * point.wobble + drift.x * point.drift;
      const offsetY = point.y * spread.y + Math.cos(time * 0.82) * (point.wobble * 1.35) + drift.y * point.drift;
      const offsetZ = point.z * spread.z + Math.sin(time * 0.58) * 0.045 + drift.z * point.drift;
      position.set(center.x + offsetX, center.y + offsetY, center.z + offsetZ);
      rotation.set(
        time * (0.22 + (index % 5) * 0.035),
        time * (0.38 + (index % 7) * 0.026),
        time * 0.31 + index * 0.17,
      );
      quaternion.setFromEuler(rotation);

      switch (config.shape) {
        case "fiber":
          scale.set(point.size * point.thickness, point.size * point.stretch, point.size * point.thickness);
          break;
        case "bead":
          scale.setScalar(point.size * point.stretch);
          break;
        case "film":
          scale.set(point.size * point.stretch, point.size * (0.52 + (index % 4) * 0.18), point.size * point.thickness);
          break;
        case "flake":
          scale.set(point.size * point.stretch, point.size * point.thickness, point.size * (0.6 + (index % 5) * 0.22));
          break;
        case "grain":
          scale.set(point.size * point.stretch, point.size * point.thickness, point.size * (0.72 + (index % 3) * 0.16));
          break;
        default:
          scale.set(point.size * point.stretch, point.size * point.thickness, point.size * (0.62 + (index % 4) * 0.24));
      }

      matrix.compose(position, quaternion, scale);
      mesh.current.setMatrixAt(index, matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (material.current) material.current.opacity = Math.min(0.38, config.opacity * THREE.MathUtils.lerp(0.24, 0.42, visibleOpacity));
  });

  const geometry = config.shape === "fiber"
    ? <torusGeometry args={[0.54, 0.085, 5, 9, 1.85]} />
    : config.shape === "bead"
      ? <icosahedronGeometry args={[1, 1]} />
      : config.shape === "film"
        ? <boxGeometry args={[1, 1, 0.08]} />
        : config.shape === "flake"
          ? <boxGeometry args={[1, 0.18, 0.72]} />
          : config.shape === "chip"
            ? <octahedronGeometry args={[1, 0]} />
            : config.shape === "grain"
              ? <dodecahedronGeometry args={[1, 0]} />
              : <tetrahedronGeometry args={[1, 0]} />;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, config.count]} renderOrder={7}>
      {geometry}
      <meshBasicMaterial
        ref={material}
        color="#ffffff"
        transparent
        opacity={config.opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function MicroplasticField({ progress }: { progress: MutableRefObject<number> }) {
  const shapes = useMemo<MicroplasticShapeConfig[]>(() => [
    { shape: "shard", count: 28, opacity: 0.76, points: createMicroplasticPoints("shard", 28) },
    { shape: "flake", count: 22, opacity: 0.72, points: createMicroplasticPoints("flake", 22) },
    { shape: "chip", count: 18, opacity: 0.8, points: createMicroplasticPoints("chip", 18) },
    { shape: "fiber", count: 18, opacity: 0.84, points: createMicroplasticPoints("fiber", 18) },
    { shape: "bead", count: 14, opacity: 0.82, points: createMicroplasticPoints("bead", 14) },
    { shape: "film", count: 18, opacity: 0.5, points: createMicroplasticPoints("film", 18) },
    { shape: "grain", count: 22, opacity: 0.7, points: createMicroplasticPoints("grain", 22) },
  ], []);

  return (
    <group>
      {shapes.map((shape) => (
        <MicroplasticShapeLayer key={shape.shape} progress={progress} config={shape} />
      ))}
    </group>
  );
}

type FlowParticleShape = ParticleShape;

function FlowingMicroplasticLayer({
  progress,
  shape,
  count,
  opacity,
}: {
  progress: MutableRefObject<number>;
  shape: FlowParticleShape;
  count: number;
  opacity: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const spinQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const rotation = useMemo(() => new THREE.Euler(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const points = useMemo(() => createMicroplasticPoints(shape, count), [shape, count]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    points.forEach((point, index) => mesh.current!.setColorAt(index, color.set(point.tint)));
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    if (material.current) material.current.needsUpdate = true;
  }, [color, points]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const exact = sceneValue(progress.current);
    const sceneIndex = Math.min(MICROPLASTIC_FLOW_DEFINITIONS.length - 1, Math.max(0, Math.round(exact)));
    const definition = MICROPLASTIC_FLOW_DEFINITIONS[sceneIndex];
    const focus = focusFor(progress.current, sceneIndex);
    mesh.current.visible = focus > 0.04;
    if (!mesh.current.visible) return;

    points.forEach((point, index) => {
      const curve = definition.curves[index % definition.curves.length];
      const phase = index / Math.max(points.length, 1) + point.phase / (Math.PI * 2);
      const speedVariance = 0.82 + (index % 7) * 0.045;
      const t = (clock.elapsedTime * definition.speed * speedVariance + phase) % 1;
      curve.getPointAt(t, position);
      curve.getTangentAt(t, tangent).normalize();

      const wobble = definition.jitter * (0.55 + (index % 5) * 0.12);
      position.x += Math.sin(clock.elapsedTime * point.speed + point.phase) * wobble;
      position.y += Math.cos(clock.elapsedTime * point.speed * 0.84 + point.phase) * wobble * 0.6;
      position.z += Math.sin(clock.elapsedTime * point.speed * 0.62 + point.phase) * wobble * 0.8;

      if (shape === "fiber") {
        quaternion.setFromUnitVectors(up, tangent);
        spinQuaternion.setFromAxisAngle(tangent, Math.sin(point.phase) * 0.8);
        quaternion.multiply(spinQuaternion);
        scale.set(point.size * point.thickness * 0.72, point.size * point.stretch * 0.82, point.size * point.thickness * 0.72);
      } else {
        rotation.set(
          clock.elapsedTime * (0.16 + (index % 4) * 0.035) + point.phase,
          clock.elapsedTime * (0.22 + (index % 5) * 0.028),
          point.phase + t * Math.PI * 2,
        );
        quaternion.setFromEuler(rotation);
        if (shape === "bead") {
          scale.setScalar(point.size * 0.82);
        } else if (shape === "film") {
          scale.set(point.size * point.stretch * 0.72, point.size * 0.58, point.size * point.thickness);
        } else {
          scale.set(point.size * point.stretch * 0.78, point.size * point.thickness * 0.86, point.size * 0.76);
        }
      }

      matrix.compose(position, quaternion, scale);
      mesh.current!.setMatrixAt(index, matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (material.current) material.current.opacity = opacity * THREE.MathUtils.smoothstep(focus, 0.04, 0.78);
  });

  const geometry = shape === "fiber"
    ? <cylinderGeometry args={[0.16, 0.1, 1, 6]} />
    : shape === "bead"
      ? <icosahedronGeometry args={[1, 1]} />
      : shape === "film"
        ? <boxGeometry args={[1, 0.72, 0.08]} />
        : shape === "flake"
          ? <boxGeometry args={[1, 0.18, 0.72]} />
          : shape === "chip"
            ? <octahedronGeometry args={[1, 0]} />
            : shape === "grain"
              ? <dodecahedronGeometry args={[1, 0]} />
              : <tetrahedronGeometry args={[1, 0]} />;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} renderOrder={9}>
      {geometry}
      <meshBasicMaterial
        ref={material}
        color="#ffffff"
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function SystemAwareMicroplasticFlow({ progress }: { progress: MutableRefObject<number> }) {
  return (
    <group>
      <FlowingMicroplasticLayer progress={progress} shape="shard" count={16} opacity={0.94} />
      <FlowingMicroplasticLayer progress={progress} shape="flake" count={12} opacity={0.9} />
      <FlowingMicroplasticLayer progress={progress} shape="chip" count={10} opacity={0.94} />
      <FlowingMicroplasticLayer progress={progress} shape="fiber" count={10} opacity={0.9} />
      <FlowingMicroplasticLayer progress={progress} shape="bead" count={8} opacity={0.86} />
      <FlowingMicroplasticLayer progress={progress} shape="film" count={10} opacity={0.7} />
      <FlowingMicroplasticLayer progress={progress} shape="grain" count={10} opacity={0.82} />
    </group>
  );
}

function LoadedAtlas({ progress, loadCompleteContext }: { progress: MutableRefObject<number>; loadCompleteContext: boolean }) {
  const models = useLoader(GLTFLoader, MODEL_URLS, (loader) => loader.setMeshoptDecoder(MeshoptDecoder)) as GLTF[];
  const testisGeometries = useLoader(STLLoader, [
    "/models/anatomy/testis-right.stl",
    "/models/anatomy/testis-left.stl",
    "/models/anatomy/epididymis-right.stl",
    "/models/anatomy/epididymis-left.stl",
  ]);
  return (
    <group>
      <group scale={3.25}>
        <AnatomicalLayer source={models[0]} kind="body" progress={progress} focusIndex={7} />
        <AnatomicalLayer source={models[0]} kind="pregnantBody" progress={progress} focusIndex={0} />
        <AnatomicalLayer source={models[1]} kind="vasculature" progress={progress} focusIndex={0} />
        <group position={BRAIN_ALIGNMENT.position} scale={BRAIN_ALIGNMENT.scale}>
          <AnatomicalLayer source={models[2]} kind="brain" progress={progress} focusIndex={1} />
        </group>
        <AnatomicalLayer source={models[3]} kind="heart" progress={progress} focusIndex={2} />
        <AnatomicalLayer source={models[6]} kind="pelvis" progress={progress} focusIndex={3} />
        <AnatomicalLayer source={models[4]} kind="uterus" progress={progress} focusIndex={3} />
        <group position={[0.012, -0.018, -0.084]}>
          <AnatomicalLayer source={models[5]} kind="placenta" progress={progress} focusIndex={3} />
          <FetalSurface source={models[8]} progress={progress} />
        </group>
        <AnatomicalLayer source={models[7]} kind="ovary" progress={progress} focusIndex={4} />
        <JourneyRemoteSystemLayer
          kind="reproductive"
          focusIndex={4}
          progress={progress}
          definitions={journeyReproductiveModels}
          enabled={loadCompleteContext}
        />
        <JourneyRemoteSystemLayer
          kind="endocrine"
          focusIndex={5}
          progress={progress}
          definitions={journeyEndocrineModels}
          enabled={loadCompleteContext}
        />
        <JourneyRemoteSystemLayer
          kind="kidneys"
          focusIndex={6}
          progress={progress}
          definitions={journeyUrinaryModels}
          enabled={loadCompleteContext}
        />
        <JourneyRemoteSystemLayer
          kind="digestive"
          focusIndex={8}
          progress={progress}
          definitions={journeyDigestiveModels}
          enabled={loadCompleteContext}
        />
      </group>
      <TesticularAtlas progress={progress} geometries={testisGeometries} />
      <MicroplasticField progress={progress} />
      <SystemAwareMicroplasticFlow progress={progress} />
    </group>
  );
}

export function HeroAnatomy() {
  return (
    <img className="hero-anatomy-maternal" src="/images/anatomy/maternal-fetal-cutaway-v1.png" width="1672" height="941" alt="" />
  );
}

class AnatomyErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function AnatomyScene({ progress, reducedMotion, activeIndex, loadCompleteContext }: AnatomySceneProps) {
  const [webglAvailable] = useState(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      ?? canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    return Boolean(context);
  });

  const fallback = <AnatomyFallback activeIndex={activeIndex} />;
  if (webglAvailable === null) return <div className="anatomy-loading" aria-hidden="true"><span /></div>;
  if (!webglAvailable || reducedMotion) return fallback;

  return (
    <AnatomyErrorBoundary fallback={fallback}>
      <Canvas
        className="anatomy-canvas"
        aria-hidden="true"
        role="presentation"
        tabIndex={-1}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.02, 11.25], fov: 32, near: 0.03, far: 25 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <ambientLight intensity={0.8} color="#a9bdc5" />
        <hemisphereLight intensity={1.25} color="#c8d9df" groundColor="#1b0f0b" />
        <directionalLight position={[3.8, 5.2, 5.4]} intensity={3.1} color="#f2c58a" />
        <directionalLight position={[-3.4, 1.6, 3.2]} intensity={2.15} color="#5a8ca0" />
        <pointLight position={[0, -2, 3]} intensity={18} distance={7} color="#b55f3e" />
        <Suspense fallback={null}>
          <LoadedAtlas progress={progress} loadCompleteContext={loadCompleteContext} />
        </Suspense>
        <CameraRig progress={progress} reducedMotion={false} />
      </Canvas>
    </AnatomyErrorBoundary>
  );
}

function AnatomyFallback({ activeIndex }: { activeIndex: number }) {

  const images = [
    { name: "maternal-fetal-cutaway-v1.png", width: 1672, height: 941 },
    { name: "brain.png", width: 237, height: 255 },
    { name: "heart.png", width: 353, height: 293 },
    { name: "maternal-fetal-cutaway-v1.png", width: 1672, height: 941 },
    { name: "ovary-labeled.svg", width: 1200, height: 900 },
    { name: "body.png", width: 1536, height: 1024 },
    { name: "body.png", width: 1536, height: 1024 },
    { name: "body.png", width: 1536, height: 1024 },
    { name: "body.png", width: 1536, height: 1024 },
    { name: "testis-labeled.png", width: 1185, height: 1007 },
  ];
  return (
    <div className="anatomy-image-fallback" data-scene={String(activeIndex)} aria-hidden="true">
      <div className="fallback-atlas-ring" />
      {images.map((image, index) => (
        <img key={`${index}-${image.name}`} className={`fallback-anatomy-image fallback-scene-${index}`} src={`/images/anatomy/${image.name}`} width={image.width} height={image.height} alt="" />
      ))}
      <div className="fallback-fragments">
        {Array.from({ length: 64 }, (_, index) => (
          <i
            key={index}
            data-kind={index % 7 === 0 ? "fiber" : index % 7 === 1 ? "film" : index % 7 === 2 ? "bead" : index % 7 === 3 ? "grain" : index % 7 === 4 ? "flake" : index % 7 === 5 ? "chip" : "shard"}
            style={{
              "--i": index,
              "--x": `${6 + (index * 3.12) % 84}%`,
              "--y": `${9 + (index * 4.6) % 74}%`,
              "--size": `${2.4 + (index % 8) * 1.25}px`,
              "--duration": `${6.4 + (index % 6) * 0.95}s`,
              "--delay": `${(index % 8) * -0.8}s`,
              "--tx": `${-18 + (index % 7) * 6}px`,
              "--ty": `${-24 - (index % 6) * 6}px`,
              "--hue": `${index % 8}`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

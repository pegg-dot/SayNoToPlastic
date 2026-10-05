"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import type {
  AnatomySystemGroupId,
  AnatomySystemModelConfig,
  AnatomySystemSlug,
  AnatomyViewerModel,
} from "../content/anatomy-system-models";
import {
  getAnatomySystemModel,
  HRA_LIBRARY_URL,
  HRA_LICENSE_URL,
  HRA_RELEASE,
  HRA_REPOSITORY_URL,
} from "../content/anatomy-system-models";
import { getBodySystem } from "../content/body-systems";
import { getBodySystemEs } from "../content/es/body-systems";
import { clearAnatomyModelCache, loadAnatomyModel } from "../lib/anatomy-model-loader";
import type { LoadedAnatomyModel } from "../lib/anatomy-model-loader";
import { BodySystemVisual } from "./BodySystemVisual";
import { TrackedLink } from "./TrackedLink";
import { trackEvent } from "./ConsentAnalytics";
import { useBodyScrollLock } from "./useBodyScrollLock";

type ViewMode = "exterior" | "cutaway" | "system";
type FramingMode = "full" | "system";
type CameraAction = "fit-full" | "fit-system" | "front" | "rear" | "zoom-in" | "zoom-out" | "reset";
type CameraCommand = { id: number; action: CameraAction };

type ModelLoadState = {
  loading: boolean;
  completed: number;
  total: number;
  loaded: LoadedAnatomyModel[];
  failures: AnatomyViewerModel[];
};

const SHELL_URL = "/models/anatomy/body-female.glb";

function subscribeClientMounted() {
  return () => undefined;
}

function getClientMounted() {
  return true;
}

function getServerMounted() {
  return false;
}

function subscribeReducedMotion(update: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return false;
}


function useSystemModels(config: AnatomySystemModelConfig, retryToken: number) {
  const [state, setState] = useState<ModelLoadState>(() => ({
    loading: config.models.length > 0,
    completed: 0,
    total: config.models.length,
    loaded: [],
    failures: [],
  }));

  useEffect(() => {
    let cancelled = false;
    const total = config.models.length;
    queueMicrotask(() => {
      if (!cancelled) setState({ loading: total > 0, completed: 0, total, loaded: [], failures: [] });
    });
    if (total === 0) return () => { cancelled = true; };

    config.models.forEach((definition) => {
      void loadAnatomyModel(definition).then((model) => {
        if (cancelled) return;
        setState((current) => {
          const completed = current.completed + 1;
          return {
            ...current,
            completed,
            loading: completed < total,
            loaded: current.loaded.some((item) => item.definition.id === model.definition.id)
              ? current.loaded
              : [...current.loaded, model],
          };
        });
      }).catch(() => {
        if (cancelled) return;
        setState((current) => {
          const completed = current.completed + 1;
          return {
            ...current,
            completed,
            loading: completed < total,
            failures: current.failures.some((item) => item.id === definition.id)
              ? current.failures
              : [...current.failures, definition],
          };
        });
      });
    });

    return () => { cancelled = true; };
  }, [config, retryToken]);

  return state;
}

function prepareScene(source: THREE.Object3D, definition: AnatomyViewerModel) {
  const object = source.clone(true);
  const materials: THREE.MeshStandardMaterial[] = [];
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.frustumCulled = false;
    child.renderOrder = 4;
    const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
    const replacements = sourceMaterials.map(() => {
      const material = new THREE.MeshStandardMaterial({
        color: definition.color,
        emissive: definition.emissive,
        emissiveIntensity: 0.42,
        roughness: 0.43,
        metalness: 0,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      materials.push(material);
      return material;
    });
    child.material = Array.isArray(child.material) ? replacements : replacements[0];
  });
  return { object, materials };
}

function SystemModel({
  record,
  viewMode,
  selected = true,
  visible = true,
}: {
  record: LoadedAnatomyModel;
  viewMode: ViewMode;
  selected?: boolean;
  visible?: boolean;
}) {
  const prepared = useMemo(
    () => prepareScene(record.gltf.scene, record.definition),
    [record.definition, record.gltf.scene],
  );
  const transform = record.definition.transform;
  const position = transform?.position ?? [0, 0, 0];
  const rotation = transform?.rotation ?? [0, 0, 0];
  const scale = transform?.scale ?? 1;

  /* eslint-disable react-hooks/immutability -- Three.js scene clones/materials are intentionally mutated inside their owning render effect. */
  useEffect(() => {
    prepared.object.visible = visible;
    const xray = viewMode === "exterior";
    const baseOpacity = viewMode === "exterior" ? 0.06 : 1;
    const opacity = selected ? baseOpacity : viewMode === "system" ? 0 : viewMode === "cutaway" ? 0.16 : 0.025;
    prepared.materials.forEach((material) => {
      material.opacity = opacity;
      material.visible = visible && opacity > 0.005;
      material.depthTest = !xray;
      material.depthWrite = viewMode === "system" && selected;
      material.emissiveIntensity = selected ? xray ? 0.7 : 0.42 : 0.12;
      material.needsUpdate = true;
    });
  }, [prepared.materials, prepared.object, selected, viewMode, visible]);
  /* eslint-enable react-hooks/immutability */

  useEffect(() => () => {
    prepared.materials.forEach((material) => material.dispose());
  }, [prepared.materials]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={prepared.object} />
    </group>
  );
}

function ReferenceShell({
  groupRef,
  viewMode,
  skinTone,
  showSurfaceOnly,
}: {
  groupRef: MutableRefObject<THREE.Group | null>;
  viewMode: ViewMode;
  skinTone: boolean;
  showSurfaceOnly: boolean;
}) {
  const source = useLoader(GLTFLoader, SHELL_URL, (loader) => loader.setMeshoptDecoder(MeshoptDecoder)) as GLTF;
  const prepared = useMemo(() => {
    const object = source.scene.clone(true);
    const materials: THREE.MeshStandardMaterial[] = [];
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.frustumCulled = false;
      child.renderOrder = 1;
      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const replacements = sourceMaterials.map(() => {
        const material = new THREE.MeshStandardMaterial({
          color: skinTone ? "#d7ab88" : "#7f9da9",
          emissive: skinTone ? "#3f2920" : "#1a3039",
          emissiveIntensity: 0.24,
          roughness: 0.46,
          metalness: 0,
          transparent: true,
          opacity: 0.14,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        materials.push(material);
        return material;
      });
      child.material = Array.isArray(child.material) ? replacements : replacements[0];
    });
    return { object, materials };
  }, [skinTone, source.scene]);

  useEffect(() => {
    const opacity = showSurfaceOnly && viewMode === "system"
      ? 0.94
      : skinTone
        ? viewMode === "cutaway" ? 0.28 : 0.94
        : viewMode === "exterior" ? 0.82 : viewMode === "cutaway" ? 0.13 : 0;
    prepared.materials.forEach((material) => {
      material.opacity = opacity;
      material.visible = opacity > 0.005;
      material.depthWrite = opacity > 0.7;
      material.emissiveIntensity = viewMode === "exterior" || skinTone ? 0.28 : 0.17;
      material.needsUpdate = true;
    });
  }, [prepared.materials, showSurfaceOnly, skinTone, viewMode]);

  useEffect(() => () => {
    prepared.materials.forEach((material) => material.dispose());
  }, [prepared.materials]);

  return <group ref={groupRef}><primitive object={prepared.object} /></group>;
}

function boxForObject(object: THREE.Object3D | null) {
  if (!object) return null;
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return null;
  const size = box.getSize(new THREE.Vector3());
  if (![size.x, size.y, size.z].every(Number.isFinite) || size.lengthSq() < 0.000001) return null;
  return box;
}

function CameraController({
  shellRef,
  systemRef,
  focusRef,
  surfaceFocus,
  framing,
  command,
  readyKey,
  reducedMotion,
}: {
  shellRef: MutableRefObject<THREE.Group | null>;
  systemRef: MutableRefObject<THREE.Group | null>;
  focusRef: MutableRefObject<THREE.Group | null>;
  surfaceFocus: boolean;
  framing: FramingMode;
  command: CameraCommand;
  readyKey: string;
  reducedMotion: boolean;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const pendingRef = useRef<{ action: CameraAction; attempts: number } | null>(null);
  const currentFramingRef = useRef(framing);

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const controls = new OrbitControlsImpl(camera, gl.domElement);
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.075;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.86;
    controls.panSpeed = 0.65;
    controls.screenSpacePanning = true;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
    controlsRef.current = controls;
    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl, reducedMotion]);

  useEffect(() => {
    currentFramingRef.current = framing;
  }, [framing]);

  useEffect(() => {
    pendingRef.current = { action: command.action, attempts: 0 };
  }, [command]);

  useEffect(() => {
    pendingRef.current = { action: framing === "full" ? "fit-full" : "fit-system", attempts: 0 };
  }, [framing, readyKey]);

  /* eslint-disable react-hooks/immutability -- R3F cameras and OrbitControls are imperative objects updated inside the render loop. */
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls || !(camera instanceof THREE.PerspectiveCamera)) return;
    controls.update();

    const pending = pendingRef.current;
    if (!pending) return;
    if (pending.action === "zoom-in" || pending.action === "zoom-out") {
      const factor = pending.action === "zoom-in" ? 0.76 : 1.32;
      const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
      camera.position.copy(controls.target).add(offset);
      controls.update();
      pendingRef.current = null;
      return;
    }

    const wantsFull = pending.action === "fit-full"
      || (pending.action !== "fit-system" && currentFramingRef.current === "full");
    const targetObject = wantsFull || surfaceFocus ? shellRef.current : focusRef.current ?? systemRef.current;
    const fallbackObject = targetObject === shellRef.current ? systemRef.current : shellRef.current;
    const box = boxForObject(targetObject) ?? boxForObject(fallbackObject);
    if (!box) {
      pending.attempts += 1;
      if (pending.attempts > 180) pendingRef.current = null;
      return;
    }

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const heightDistance = size.y / Math.max(2 * Math.tan(verticalFov / 2), 0.001);
    const widthDistance = size.x / Math.max(2 * Math.tan(horizontalFov / 2), 0.001);
    const depthDistance = size.z * 1.2;
    const padding = wantsFull || surfaceFocus ? 1.28 : 1.65;
    const distance = Math.max(heightDistance, widthDistance, depthDistance, 0.35) * padding;
    let direction: THREE.Vector3;
    if (pending.action === "rear") direction = new THREE.Vector3(0, 0.02, -1);
    else if (pending.action === "front" || pending.action === "reset" || pending.action.startsWith("fit-")) direction = new THREE.Vector3(0, 0.02, 1);
    else direction = camera.position.clone().sub(controls.target).normalize();
    if (direction.lengthSq() < 0.01) direction.set(0, 0.02, 1);
    camera.near = Math.max(distance / 500, 0.005);
    camera.far = Math.max(distance * 80, 50);
    camera.updateProjectionMatrix();
    controls.target.copy(center);
    camera.position.copy(center).add(direction.normalize().multiplyScalar(distance));
    controls.minDistance = Math.max(Math.min(size.x, size.y, size.z) * 0.08, distance * 0.08, 0.02);
    controls.maxDistance = Math.max(distance * 8, 10);
    controls.update();
    pendingRef.current = null;
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

function ViewerScene({
  config,
  models,
  viewMode,
  framing,
  command,
  reducedMotion,
  activeGroup,
}: {
  config: AnatomySystemModelConfig;
  models: LoadedAnatomyModel[];
  viewMode: ViewMode;
  framing: FramingMode;
  command: CameraCommand;
  reducedMotion: boolean;
  activeGroup: AnatomySystemGroupId;
}) {
  const shellRef = useRef<THREE.Group | null>(null);
  const systemRef = useRef<THREE.Group | null>(null);
  const focusRef = useRef<THREE.Group | null>(null);
  const selectedModels = activeGroup === "all"
    ? models
    : activeGroup === "skin"
      ? []
      : models.filter((model) => model.definition.group === activeGroup);
  const selectedIds = new Set(selectedModels.map((model) => model.definition.id));
  const contextModels = activeGroup === "all" ? [] : models.filter((model) => !selectedIds.has(model.definition.id));
  const surfaceFocus = Boolean(config.surfaceSystem) || activeGroup === "skin";
  const readyKey = `${config.slug}:${activeGroup}:${models.map((model) => model.definition.id).join(",")}`;

  return (
    <>
      <ambientLight intensity={0.88} color="#b6c8ce" />
      <hemisphereLight intensity={1.45} color="#d4e2e6" groundColor="#190e0b" />
      <directionalLight position={[4.5, 6.2, 6.5]} intensity={3.4} color="#f0c68e" />
      <directionalLight position={[-4.2, 2.3, 4.1]} intensity={2.25} color="#5f94a8" />
      <pointLight position={[0, -2, 4]} intensity={12} distance={12} color={config.accent} />
      <group scale={3.25}>
        <ReferenceShell
          groupRef={shellRef}
          viewMode={viewMode}
          skinTone={surfaceFocus || viewMode === "exterior"}
          showSurfaceOnly={surfaceFocus}
        />
        <group ref={systemRef}>
          <group ref={focusRef}>
            {selectedModels.map((record) => (
              <SystemModel key={record.definition.id} record={record} viewMode={viewMode} selected visible />
            ))}
          </group>
          {contextModels.map((record) => (
            <SystemModel
              key={record.definition.id}
              record={record}
              viewMode={viewMode}
              selected={false}
              visible={viewMode !== "system"}
            />
          ))}
        </group>
      </group>
      <CameraController
        shellRef={shellRef}
        systemRef={systemRef}
        focusRef={focusRef}
        surfaceFocus={surfaceFocus}
        framing={framing}
        command={command}
        readyKey={readyKey}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

type ViewerLocale = "en" | "es";

type ViewerDisplayCopy = {
  title: string;
  route: string;
  summary: string;
  panelKnown: string;
  panelUncertain: string;
  structures: string[];
  scopeNote: string;
};

const anatomyViewerSpanishContent: Record<AnatomySystemSlug, ViewerDisplayCopy> = {
  "kidneys-urinary-system": {
    title: "Riñones y sistema urinario",
    route: "/es/ciencia/cuerpo/kidneys-urinary-system",
    summary: "Rota el cuerpo, revela el tracto urinario o aísla el sistema para observarlo con mayor detalle.",
    panelKnown: "Se han reportado microplásticos en tejido renal humano, lo que confirma que la exposición puede alcanzar un órgano filtrante.",
    panelUncertain: "Todavía no se sabe si las partículas se eliminan, permanecen en el tejido o afectan la función renal.",
    structures: ["Riñón izquierdo", "Riñón derecho", "Uréter izquierdo", "Uréter derecho", "Vejiga urinaria"],
    scopeNote: "Orientación educativa con las principales estructuras urinarias disponibles en el modelo femenino de referencia HRA.",
  },
  "digestive-system": {
    title: "Sistema digestivo",
    route: "/es/ciencia/cuerpo/digestive-system",
    summary: "Sigue los principales órganos digestivos dentro del contexto corporal y después retira la superficie exterior.",
    panelKnown: "Los alimentos y el agua son vías importantes de exposición, y se han detectado partículas en heces humanas.",
    panelUncertain: "Los efectos humanos sobre la barrera intestinal, la inflamación y el microbioma siguen sin resolverse.",
    structures: ["Intestino delgado", "Intestino grueso", "Hígado", "Páncreas"],
    scopeNote: "Conjunto educativo enfocado en cuatro superficies digestivas HRA de referencia; no es un atlas gastrointestinal clínico completo.",
  },
  "endocrine-metabolic-system": {
    title: "Sistema endocrino y metabólico",
    route: "/es/ciencia/cuerpo/endocrine-metabolic-system",
    summary: "Observa tejidos seleccionados que producen hormonas dentro del contexto corporal o aíslalos.",
    panelKnown: "Las sustancias químicas asociadas al plástico tienen una base de evidencia endocrina más amplia que las propias partículas microplásticas.",
    panelUncertain: "Los efectos directos de las partículas microplásticas sobre la señalización hormonal humana todavía están en estudio.",
    structures: ["Páncreas", "Timo", "Ovario izquierdo", "Ovario derecho"],
    scopeNote: "Esta escena limitada no inventa glándulas ausentes del modelo, como tiroides, hipófisis o suprarrenales.",
  },
  skin: {
    title: "Piel y superficie exterior",
    route: "/es/ciencia/cuerpo/skin",
    summary: "Rota la superficie exterior completa o vuelve el cuerpo translúcido para observar la piel como su límite externo.",
    panelKnown: "La piel sana e intacta parece bloquear la mayoría de las partículas microplásticas.",
    panelUncertain: "Los nanoplásticos, la piel dañada y las sustancias químicas asociadas al plástico siguen siendo preguntas de investigación separadas.",
    structures: ["Superficie exterior completa del cuerpo femenino de referencia"],
    scopeNote: "Superficie HRA de cuerpo completo; no es un escaneo de paciente, un modelo diagnóstico ni una reconstrucción microscópica de las capas de la piel.",
  },
  "whole-body-atlas": {
    title: "Atlas anatómico de referencia",
    route: "/es/ciencia",
    summary: "Rota un cuerpo femenino de referencia, cambia las capas anatómicas generales o enfoca un sistema disponible a la vez.",
    panelKnown: "Este visor reúne superficies de referencia compatibles y con licencia en un mismo espacio de navegación para facilitar la orientación. No implica que todos los modelos del sitio pertenezcan a una misma persona o etapa de vida.",
    panelUncertain: "La geometría de referencia varía según el modelo de origen y el contexto corporal. Es un conjunto educativo de referencia, no un atlas clínico completo ni una reconstrucción específica de un paciente.",
    structures: [
      "Superficie exterior femenina de referencia",
      "Cerebro, corazón y vasculatura sanguínea",
      "Esqueleto pélvico",
      "Tejidos endocrinos seleccionados: timo y páncreas",
      "Riñones, uréteres y vejiga",
      "Intestino delgado y grueso, hígado y páncreas",
    ],
    scopeNote: "Los modelos de embarazo, feto, anatomía reproductiva femenina y tejido testicular masculino permanecen en sus capítulos dedicados y no se superponen aquí. El atlas tampoco incluye cada órgano, glándula, hueso o capa microscópica de tejido.",
  },
};

const groupLabelsEs: Partial<Record<AnatomySystemGroupId, string>> = {
  all: "Anatomía general",
  skin: "Exterior",
  brain: "Cerebro",
  circulation: "Circulación",
  heart: "Corazón",
  skeleton: "Pelvis",
  endocrine: "Endocrino",
  urinary: "Riñones + urinario",
  digestive: "Digestivo",
};

const modelLabelsEs: Record<string, string> = {
  "Blood vasculature": "Vasculatura sanguínea",
  Brain: "Cerebro",
  Heart: "Corazón",
  "Pelvic skeleton": "Esqueleto pélvico",
  Pancreas: "Páncreas",
  Thymus: "Timo",
  "Left ovary": "Ovario izquierdo",
  "Right ovary": "Ovario derecho",
  "Left kidney": "Riñón izquierdo",
  "Right kidney": "Riñón derecho",
  "Left ureter": "Uréter izquierdo",
  "Right ureter": "Uréter derecho",
  "Urinary bladder": "Vejiga urinaria",
  "Small intestine": "Intestino delgado",
  "Large intestine": "Intestino grueso",
  Liver: "Hígado",
};

const viewerUi = {
  en: {
    eyebrow: (release: string) => `Interactive 3D reference · HRA ${release}`,
    close: (title: string) => `Close ${title} 3D viewer`,
    canvas: (title: string) => `Interactive three-dimensional model of ${title}. Drag to rotate, scroll or pinch to zoom.`,
    loading: "Loading licensed anatomy",
    loadingProgress: (completed: number, total: number, progress: number) => `${completed} of ${total} reference surfaces · ${progress}%`,
    loadingNote: "Local surfaces appear first. Additional HRA anatomy requires an internet connection on first open.",
    surfacesLoaded: (completed: number, total: number) => `${completed} of ${total} surfaces loaded.`,
    structuresLoaded: (loaded: number, total: number) => `${loaded} of ${total} structures loaded.`,
    retryMissing: "Retry missing surfaces",
    chooseSystem: "Choose anatomy system",
    currentFocus: "Current focus",
    visibleStructures: "Visible structures",
    loadedLegend: (count: number) => `${count} surfaces loaded`,
    skinSurface: "Skin surface",
    bodyLayers: "Body layers",
    camera: "Camera",
    focusSystem: "Focus system",
    fullBody: "Full body",
    front: "Front",
    rear: "Rear",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset",
    instructions: <><span>Drag</span> rotate · <span>Scroll or pinch</span> zoom · <span>Shift + drag</span> pan</>,
    finding: "Finding",
    openQuestion: "Open question",
    included: "Included anatomy",
    completeScience: "Explore the complete science library",
    evidenceOverview: "Read the evidence overview",
    provenance: "3D model provenance",
    provenanceBody: "The exterior and organ surfaces are educational reference objects, not patient-specific scans.",
    releaseDirectory: (release: string) => `Release ${release} model directory`,
    medicalBoundary: "Educational anatomy only. This viewer does not diagnose disease, measure exposure, or show a specific person's body.",
    fallbackMap: ["Brain", "Heart", "Circulation", "Pregnancy", "Endocrine", "Kidneys", "Digestive"],
    fallbackTitle: "The interactive reference could not finish loading.",
    fallbackBody: "The evidence pages remain available. Reconnect and retry to load the licensed anatomy surfaces.",
    fallbackRetry: "Retry 3D models",
  },
  es: {
    eyebrow: (release: string) => `Referencia 3D interactiva · HRA ${release}`,
    close: (title: string) => `Cerrar visor 3D de ${title}`,
    canvas: (title: string) => `Modelo tridimensional interactivo de ${title}. Arrastra para rotar; desplázate o pellizca para acercar.`,
    loading: "Cargando anatomía con licencia",
    loadingProgress: (completed: number, total: number, progress: number) => `${completed} de ${total} superficies de referencia · ${progress}%`,
    loadingNote: "Las superficies locales aparecen primero. La anatomía HRA adicional necesita conexión a internet la primera vez que se abre.",
    surfacesLoaded: (completed: number, total: number) => `${completed} de ${total} superficies cargadas.`,
    structuresLoaded: (loaded: number, total: number) => `${loaded} de ${total} estructuras cargadas.`,
    retryMissing: "Reintentar superficies faltantes",
    chooseSystem: "Elegir sistema anatómico",
    currentFocus: "Foco actual",
    visibleStructures: "Estructuras visibles",
    loadedLegend: (count: number) => `${count} superficies cargadas`,
    skinSurface: "Superficie de la piel",
    bodyLayers: "Capas del cuerpo",
    camera: "Cámara",
    focusSystem: "Enfocar sistema",
    fullBody: "Cuerpo completo",
    front: "Frente",
    rear: "Espalda",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    reset: "Restablecer",
    instructions: <><span>Arrastra</span> para rotar · <span>Desplázate o pellizca</span> para acercar · <span>Mayús + arrastra</span> para mover</>,
    finding: "Hallazgo",
    openQuestion: "Pregunta abierta",
    included: "Anatomía incluida",
    completeScience: "Explorar la biblioteca completa de ciencia",
    evidenceOverview: "Leer el resumen de evidencia",
    provenance: "Procedencia de los modelos 3D",
    provenanceBody: "Las superficies exteriores y de órganos son objetos educativos de referencia, no escaneos específicos de pacientes.",
    releaseDirectory: (release: string) => `Directorio de modelos de la versión ${release}`,
    medicalBoundary: "Anatomía educativa únicamente. Este visor no diagnostica enfermedades, no mide exposición ni representa el cuerpo de una persona específica.",
    fallbackMap: ["Cerebro", "Corazón", "Circulación", "Embarazo", "Endocrino", "Riñones", "Digestivo"],
    fallbackTitle: "La referencia interactiva no pudo terminar de cargar.",
    fallbackBody: "Las páginas de evidencia siguen disponibles. Vuelve a conectarte e inténtalo de nuevo para cargar las superficies anatómicas con licencia.",
    fallbackRetry: "Reintentar modelos 3D",
  },
} as const;

function displayCopyFor(config: AnatomySystemModelConfig, locale: ViewerLocale): ViewerDisplayCopy {
  if (locale === "es") return anatomyViewerSpanishContent[config.slug];
  return {
    title: config.title,
    route: config.route,
    summary: config.summary,
    panelKnown: config.panelKnown,
    panelUncertain: config.panelUncertain,
    structures: config.structures,
    scopeNote: config.scopeNote,
  };
}

function modelLabel(label: string, locale: ViewerLocale) {
  return locale === "es" ? (modelLabelsEs[label] ?? label) : label;
}

class ViewerErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function ViewerFallback({ config, onRetry, locale }: { config: AnatomySystemModelConfig; onRetry: () => void; locale: ViewerLocale }) {
  const article = config.slug === "whole-body-atlas"
    ? undefined
    : locale === "es" ? getBodySystemEs(config.slug) : getBodySystem(config.slug);
  const copy = viewerUi[locale];
  return (
    <div className={`anatomy-viewer-fallback${config.compositeSystem ? " anatomy-viewer-fallback-complete" : ""}`} role="status">
      {article ? <BodySystemVisual article={article} /> : (
        <div className="complete-atlas-fallback-map" aria-hidden="true">
          {copy.fallbackMap.map((label) => <span key={label}>{label}</span>)}
        </div>
      )}
      <div>
        <strong>{copy.fallbackTitle}</strong>
        <p>{copy.fallbackBody}</p>
        <button type="button" onClick={onRetry}>{copy.fallbackRetry}</button>
      </div>
    </div>
  );
}

export function AnatomySystemViewer({ slug, onClose, locale = "en" }: { slug: AnatomySystemSlug; onClose: () => void; locale?: ViewerLocale }) {
  const config = getAnatomySystemModel(slug);
  const display = displayCopyFor(config, locale);
  const copy = viewerUi[locale];
  const isSkin = Boolean(config.surfaceSystem);
  const isComposite = Boolean(config.compositeSystem);
  const mounted = useSyncExternalStore(subscribeClientMounted, getClientMounted, getServerMounted);
  const [viewMode, setViewMode] = useState<ViewMode>(isSkin ? "exterior" : "cutaway");
  const [framing, setFraming] = useState<FramingMode>(isSkin || isComposite ? "full" : "system");
  const [activeGroup, setActiveGroup] = useState<AnatomySystemGroupId>("all");
  const [command, setCommand] = useState<CameraCommand>({ id: 0, action: isSkin || isComposite ? "fit-full" : "fit-system" });
  const [retryToken, setRetryToken] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const loadState = useSystemModels(config, retryToken);

  useBodyScrollLock(true);

  const issueCommand = useCallback((action: CameraAction) => {
    setCommand((current) => ({ id: current.id + 1, action }));
  }, []);

  const retry = useCallback(() => {
    config.models.forEach((model) => clearAnatomyModelCache(model));
    setRetryToken((current) => current + 1);
  }, [config.models]);

  const resetViewer = useCallback(() => {
    const full = isSkin || isComposite;
    setActiveGroup("all");
    setFraming(full ? "full" : "system");
    setViewMode(isSkin ? "exterior" : "cutaway");
    issueCommand("reset");
  }, [isComposite, isSkin, issueCommand]);

  const selectGroup = useCallback((group: AnatomySystemGroupId) => {
    const full = group === "all" || group === "skin";
    setActiveGroup(group);
    setFraming(full ? "full" : "system");
    issueCommand(full ? "fit-full" : "fit-system");
  }, [issueCommand]);

  useEffect(() => {
    void trackEvent("anatomy_viewer_open", { label: slug, destination: display.route });
  }, [display.route, slug]);

  useEffect(() => {
    if (!mounted) return;
    const siteShell = document.getElementById("site-shell");
    const priorAriaHidden = siteShell?.getAttribute("aria-hidden") ?? null;
    const priorInert = siteShell?.inert ?? false;
    const priorBodyState = document.body.dataset.anatomyViewerOpen;
    document.body.dataset.anatomyViewerOpen = "true";
    if (siteShell) {
      siteShell.inert = true;
      siteShell.setAttribute("aria-hidden", "true");
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (siteShell) {
        siteShell.inert = priorInert;
        if (priorAriaHidden === null) siteShell.removeAttribute("aria-hidden");
        else siteShell.setAttribute("aria-hidden", priorAriaHidden);
      }
      if (priorBodyState === undefined) delete document.body.dataset.anatomyViewerOpen;
      else document.body.dataset.anatomyViewerOpen = priorBodyState;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const completeFailure = !isSkin && !loadState.loading && loadState.loaded.length === 0;
  const progress = loadState.total ? Math.round((loadState.completed / loadState.total) * 100) : 100;
  const modeLabels = locale === "es"
    ? isSkin
      ? { exterior: "Superficie de la piel", cutaway: "Translúcido", system: "Solo superficie" }
      : { exterior: "Exterior", cutaway: "Corte", system: "Solo sistema" }
    : isSkin
      ? { exterior: "Skin surface", cutaway: "Translucent", system: "Surface only" }
      : { exterior: "Exterior", cutaway: "Cutaway", system: "System only" };
  const activeGroupSource = config.groups?.find((group) => group.id === activeGroup);
  const activeGroupLabel = locale === "es"
    ? (activeGroupSource ? (groupLabelsEs[activeGroupSource.id] ?? activeGroupSource.label) : "Todos los sistemas")
    : (activeGroupSource?.label ?? "All systems");
  const articleLabel = isComposite ? copy.completeScience : copy.evidenceOverview;

  return createPortal(
    <div
      className="anatomy-viewer-backdrop"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className={`anatomy-viewer-dialog anatomy-viewer-${slug}`}
        data-locale={locale}
        role="dialog"
        aria-modal="true"
        aria-labelledby="anatomy-viewer-title"
        aria-describedby="anatomy-viewer-summary"
      >
        <header className="anatomy-viewer-header">
          <div>
            <p className="eyebrow">{copy.eyebrow(HRA_RELEASE)}</p>
            <h2 id="anatomy-viewer-title">{display.title}</h2>
          </div>
          <button ref={closeRef} type="button" className="anatomy-viewer-close" onClick={onClose} aria-label={copy.close(display.title)}>×</button>
        </header>

        <div className="anatomy-viewer-layout">
          <div className="anatomy-viewer-stage">
            <div className="anatomy-viewer-grid" aria-hidden="true" />
            {!completeFailure ? (
              <ViewerErrorBoundary key={`${slug}:${retryToken}`} fallback={<ViewerFallback config={config} onRetry={retry} locale={locale} />}>
                <Canvas
                  className="anatomy-viewer-canvas"
                  aria-label={copy.canvas(display.title)}
                  role="img"
                  dpr={[1, 1.6]}
                  camera={{ position: [0, 0.1, 8], fov: 34, near: 0.01, far: 100 }}
                  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                  onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.08;
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                  }}
                >
                  <Suspense fallback={null}>
                    <ViewerScene
                      config={config}
                      models={loadState.loaded}
                      viewMode={viewMode}
                      framing={framing}
                      command={command}
                      reducedMotion={reducedMotion}
                      activeGroup={activeGroup}
                    />
                  </Suspense>
                </Canvas>
              </ViewerErrorBoundary>
            ) : <ViewerFallback config={config} onRetry={retry} locale={locale} />}

            {loadState.loading && loadState.loaded.length === 0 && (
              <div className="anatomy-viewer-loading" role="status" aria-live="polite">
                <span aria-hidden="true" />
                <strong>{copy.loading}</strong>
                <p>{copy.loadingProgress(loadState.completed, loadState.total, progress)}</p>
                <small>{copy.loadingNote}</small>
              </div>
            )}

            {loadState.loading && loadState.loaded.length > 0 && (
              <div className="anatomy-viewer-partial" role="status" aria-live="polite">
                <strong>{copy.surfacesLoaded(loadState.completed, loadState.total)}</strong>
                <span>{progress}%</span>
              </div>
            )}

            {!loadState.loading && loadState.failures.length > 0 && loadState.loaded.length > 0 && (
              <div className="anatomy-viewer-partial" role="status">
                <strong>{copy.structuresLoaded(loadState.loaded.length, loadState.total)}</strong>
                <button type="button" onClick={retry}>{copy.retryMissing}</button>
              </div>
            )}

            {config.groups && (
              <nav className="anatomy-viewer-system-filter" aria-label={copy.chooseSystem}>
                {config.groups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    data-anatomy-group={group.id}
                    aria-pressed={activeGroup === group.id}
                    onClick={() => selectGroup(group.id)}
                  >
                    {locale === "es" ? (groupLabelsEs[group.id] ?? group.label) : group.label}
                  </button>
                ))}
              </nav>
            )}

            <div className="anatomy-viewer-legend" aria-label={copy.visibleStructures}>
              <span>{isComposite ? copy.currentFocus : copy.visibleStructures}</span>
              <div>
                {isComposite ? (
                  <>
                    <i style={{ "--legend-color": config.accent } as React.CSSProperties}>{activeGroupLabel}</i>
                    <i style={{ "--legend-color": "#8aa4ae" } as React.CSSProperties}>{copy.loadedLegend(loadState.loaded.length)}</i>
                  </>
                ) : (
                  <>
                    {isSkin && <i style={{ "--legend-color": "#d7ab88" } as React.CSSProperties}>{copy.skinSurface}</i>}
                    {loadState.loaded.map(({ definition }) => (
                      <i key={definition.id} style={{ "--legend-color": definition.color } as React.CSSProperties}>{modelLabel(definition.label, locale)}</i>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="anatomy-viewer-controls" aria-label={locale === "es" ? "Controles de vista 3D" : "3D view controls"}>
              <fieldset>
                <legend>{copy.bodyLayers}</legend>
                {(["exterior", "cutaway", "system"] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={viewMode === mode}
                    onClick={() => setViewMode(mode)}
                  >
                    {modeLabels[mode]}
                  </button>
                ))}
              </fieldset>
              <fieldset>
                <legend>{copy.camera}</legend>
                <button type="button" aria-pressed={framing === "system"} onClick={() => { setFraming("system"); issueCommand("fit-system"); }}>{copy.focusSystem}</button>
                <button type="button" aria-pressed={framing === "full"} onClick={() => { setFraming("full"); issueCommand("fit-full"); }}>{copy.fullBody}</button>
                <button type="button" onClick={() => issueCommand("front")}>{copy.front}</button>
                <button type="button" onClick={() => issueCommand("rear")}>{copy.rear}</button>
                <button type="button" onClick={() => issueCommand("zoom-in")} aria-label={copy.zoomIn}>＋</button>
                <button type="button" onClick={() => issueCommand("zoom-out")} aria-label={copy.zoomOut}>−</button>
                <button type="button" onClick={resetViewer}>{copy.reset}</button>
              </fieldset>
            </div>

            <p className="anatomy-viewer-instructions">{copy.instructions}</p>
          </div>

          <aside className="anatomy-viewer-panel">
            <p id="anatomy-viewer-summary">{display.summary}</p>

            <div className="anatomy-viewer-quick-read">
              <article>
                <h3>{copy.finding}</h3>
                <p>{display.panelKnown}</p>
              </article>
              <article>
                <h3>{copy.openQuestion}</h3>
                <p>{display.panelUncertain}</p>
              </article>
            </div>

            <details className="anatomy-viewer-included">
              <summary>{copy.included} <span>{display.structures.length}</span></summary>
              <ul className="anatomy-viewer-structures">
                {display.structures.map((structure) => <li key={structure}>{structure}</li>)}
              </ul>
              <small>{display.scopeNote}</small>
            </details>

            <TrackedLink className="anatomy-viewer-article" href={display.route} eventName="science_topic_open" label={`anatomy-viewer-${slug}`}>
              {articleLabel} <span>→</span>
            </TrackedLink>

            <details className="anatomy-viewer-provenance">
              <summary>{copy.provenance} <span>+</span></summary>
              <p>{copy.provenanceBody}</p>
              <ul>
                <li><a href={HRA_LIBRARY_URL} target="_blank" rel="noopener noreferrer">HRA 3D Reference Object Library <span>↗</span></a></li>
                <li><a href={HRA_REPOSITORY_URL} target="_blank" rel="noopener noreferrer">{copy.releaseDirectory(HRA_RELEASE)} <span>↗</span></a></li>
                <li><a href={HRA_LICENSE_URL} target="_blank" rel="noopener noreferrer">Creative Commons Attribution 4.0 <span>↗</span></a></li>
              </ul>
            </details>

            <p className="anatomy-viewer-medical-boundary">{copy.medicalBoundary}</p>
          </aside>
        </div>
      </section>
    </div>,
    document.body,
  );
}

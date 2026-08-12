import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { AnatomyViewerModel } from "../content/anatomy-system-models";

export type LoadedAnatomyModel = {
  definition: AnatomyViewerModel;
  gltf: GLTF;
  resolvedUrl: string;
};

type CachedAnatomyModel = {
  gltf: GLTF;
  resolvedUrl: string;
};

const anatomyModelCache = new Map<string, Promise<CachedAnatomyModel>>();

function cacheKey(definition: AnatomyViewerModel) {
  return definition.urls.join("|");
}

function createLoader() {
  const loader = new GLTFLoader();
  loader.setCrossOrigin("anonymous");
  loader.setMeshoptDecoder(MeshoptDecoder);
  return loader;
}

export async function loadAnatomyModel(definition: AnatomyViewerModel): Promise<LoadedAnatomyModel> {
  const key = cacheKey(definition);
  let request = anatomyModelCache.get(key);
  if (!request) {
    request = (async () => {
      let lastError: unknown = null;
      for (const url of definition.urls) {
        try {
          const gltf = await createLoader().loadAsync(url);
          return { gltf, resolvedUrl: url };
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError instanceof Error ? lastError : new Error(`Unable to load ${definition.label}.`);
    })();
    anatomyModelCache.set(key, request);
  }

  try {
    const loaded = await request;
    return { definition, ...loaded };
  } catch (error) {
    anatomyModelCache.delete(key);
    throw error;
  }
}

export function clearAnatomyModelCache(definition?: AnatomyViewerModel) {
  if (definition) anatomyModelCache.delete(cacheKey(definition));
  else anatomyModelCache.clear();
}

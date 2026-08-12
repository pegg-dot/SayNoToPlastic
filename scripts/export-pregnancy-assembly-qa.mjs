#!/usr/bin/env node
/** Export the production pregnancy assembly as layer-separated QA OBJ files. */

import fs from "node:fs";
import path from "node:path";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";

const root = process.argv[2];
const output = process.argv[3];
if (!root || !output) throw new Error("usage: export-pregnancy-assembly-qa.mjs <site-root> <output-dir>");
fs.mkdirSync(output, { recursive: true });

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
await MeshoptDecoder.ready;

async function load(name) {
  const data = fs.readFileSync(path.join(root, "public/models/anatomy", name));
  const array = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  return new Promise((resolve, reject) => loader.parse(array, "", (gltf) => resolve(gltf.scene), reject));
}

function deformForPregnancy(object) {
  object.traverse((child) => {
    if (!child.isMesh || !child.geometry?.attributes?.position) return;
    const geometry = child.geometry.clone();
    const position = geometry.getAttribute("position");
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const y = position.getY(index);
      const z = position.getZ(index);
      const side = Math.max(0, 1 - (x / 0.3) ** 2);
      const vertical = Math.max(0, 1 - ((y - 0.075) / 0.33) ** 2);
      const t = Math.max(0, Math.min(1, (z + 0.09) / 0.17));
      const anterior = t * t * (3 - 2 * t);
      const weight = side * vertical * anterior;
      position.setZ(index, z + weight * 0.205);
      position.setX(index, x * (1 + weight * 0.1));
    }
    geometry.computeVertexNormals();
    child.geometry = geometry;
  });
}

async function exportLayer(filename, sourceName, configure = () => {}) {
  const object = await load(sourceName);
  configure(object);
  object.updateMatrixWorld(true);
  fs.writeFileSync(path.join(output, filename), new OBJExporter().parse(object));
}

await exportLayer("pregnant-body.obj", "body-female.glb", deformForPregnancy);
await exportLayer("vasculature.obj", "vasculature-female.glb");
await exportLayer("brain.obj", "brain.glb");
await exportLayer("heart.obj", "heart.glb");
await exportLayer("pelvis.obj", "pelvis-female.glb");
await exportLayer("uterus.obj", "uterus-female.glb");
await exportLayer("placenta.obj", "placenta.glb", (object) => {
  object.position.set(0.012, -0.018, -0.084);
});
await exportLayer("fetus.obj", "fetus-mri.glb", (object) => {
  object.position.set(0.006, 0.159, -0.01);
  object.rotation.set(-Math.PI / 2, 0, -0.08);
  object.scale.setScalar(0.61);
});

console.log(output);

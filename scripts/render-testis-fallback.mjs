import fs from "node:fs";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const sourceDirectory = new URL("../public/models/anatomy/", import.meta.url);
const outputFile = new URL("../public/images/anatomy/testis.svg", import.meta.url);
const loader = new STLLoader();
const files = [
  ["testis-right.stl", "testis"],
  ["testis-left.stl", "testis"],
  ["epididymis-right.stl", "epididymis"],
  ["epididymis-left.stl", "epididymis"],
];

function readGeometry(name) {
  const bytes = fs.readFileSync(new URL(name, sourceDirectory));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return loader.parse(buffer);
}

const entries = files.map(([name, kind]) => ({ kind, geometry: readGeometry(name) }));
const bounds = new THREE.Box3();
entries.forEach(({ geometry }) => {
  geometry.computeBoundingBox();
  if (geometry.boundingBox) bounds.union(geometry.boundingBox);
});
const center = bounds.getCenter(new THREE.Vector3());
const rotation = new THREE.Matrix4()
  .makeRotationY(THREE.MathUtils.degToRad(-14))
  .premultiply(new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(-7)));
const light = new THREE.Vector3(-0.35, 0.65, 0.68).normalize();
const triangles = [];
const projectedBounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

for (const { kind, geometry } of entries) {
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  for (let index = 0; index < positions.count; index += 3) {
    const vertices = [];
    let depth = 0;
    let normal = new THREE.Vector3();
    for (let offset = 0; offset < 3; offset += 1) {
      const vertex = new THREE.Vector3().fromBufferAttribute(positions, index + offset).sub(center);
      const mapped = new THREE.Vector3(vertex.x, vertex.z, vertex.y).applyMatrix4(rotation);
      vertices.push(mapped);
      depth += mapped.z;
      const sourceNormal = new THREE.Vector3().fromBufferAttribute(normals, index + offset);
      normal.add(new THREE.Vector3(sourceNormal.x, sourceNormal.z, sourceNormal.y).transformDirection(rotation));
      projectedBounds.minX = Math.min(projectedBounds.minX, mapped.x);
      projectedBounds.maxX = Math.max(projectedBounds.maxX, mapped.x);
      projectedBounds.minY = Math.min(projectedBounds.minY, mapped.y);
      projectedBounds.maxY = Math.max(projectedBounds.maxY, mapped.y);
    }
    normal.normalize();
    triangles.push({ kind, vertices, depth: depth / 3, shade: 0.42 + Math.max(0, normal.dot(light)) * 0.58 });
  }
}

triangles.sort((a, b) => a.depth - b.depth);
const width = projectedBounds.maxX - projectedBounds.minX;
const height = projectedBounds.maxY - projectedBounds.minY;
const scale = 760 / Math.max(width, height);
const offsetX = 450 - ((projectedBounds.minX + projectedBounds.maxX) / 2) * scale;
const offsetY = 450 + ((projectedBounds.minY + projectedBounds.maxY) / 2) * scale;

function color(kind, shade) {
  const base = kind === "testis" ? [211, 154, 105] : [169, 92, 73];
  return `rgb(${base.map((channel) => Math.round(channel * shade)).join(",")})`;
}

const polygons = triangles.map(({ kind, vertices, shade }) => {
  const points = vertices.map((vertex) => `${(vertex.x * scale + offsetX).toFixed(2)},${(-vertex.y * scale + offsetY).toFixed(2)}`).join(" ");
  return `<polygon points="${points}" fill="${color(kind, shade)}"/>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900"><defs><filter id="shadow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="18"/><feOffset dy="24"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .46 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#shadow)">${polygons}</g></svg>`;
fs.writeFileSync(outputFile, svg);
console.log(`Rendered ${triangles.length} anatomical triangles to ${outputFile.pathname}`);

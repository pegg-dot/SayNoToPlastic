#!/usr/bin/env python3
"""Export one open fetal-MRI segmentation frame as a neutral OBJ mesh.

Source data: MedicalVisionGroup/fetal-smpl, subject MAP-C507.
The repository publishes the demonstration sequence under its MIT project
license. This exporter preserves the source vertices and triangle topology;
it only recenters the mesh for web-scene placement.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import struct

import numpy as np


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--frame", type=int, default=0)
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


def pad4(data: bytes, fill: bytes = b"\x00") -> bytes:
    return data + fill * ((4 - len(data) % 4) % 4)


def vertex_normals(vertices: np.ndarray, faces: np.ndarray) -> np.ndarray:
    normals = np.zeros_like(vertices, dtype=np.float64)
    triangles = vertices[faces]
    face_normals = np.cross(triangles[:, 1] - triangles[:, 0], triangles[:, 2] - triangles[:, 0])
    for corner in range(3):
        np.add.at(normals, faces[:, corner], face_normals)
    lengths = np.linalg.norm(normals, axis=1, keepdims=True)
    return (normals / np.maximum(lengths, 1e-12)).astype("<f4")


def write_glb(output: Path, vertices: np.ndarray, faces: np.ndarray, frame: int) -> None:
    positions = vertices.astype("<f4")
    normals = vertex_normals(vertices, faces)
    indices = faces.astype("<u4").reshape(-1)
    position_bytes = positions.tobytes()
    normal_bytes = normals.tobytes()
    index_bytes = indices.tobytes()
    binary = position_bytes + normal_bytes + index_bytes

    index_offset = len(position_bytes) + len(normal_bytes)
    document = {
        "asset": {
            "version": "2.0",
            "generator": "Homo Plasticus fetal-MRI exporter",
            "extras": {
                "source": "https://github.com/MedicalVisionGroup/fetal-smpl",
                "subject": "MAP-C507",
                "frame": frame,
                "transformation": "recentered only",
            },
        },
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": "MRI-derived fetal body surface"}],
        "meshes": [{
            "name": "fetal_mri_surface",
            "primitives": [{
                "attributes": {"POSITION": 0, "NORMAL": 1},
                "indices": 2,
                "material": 0,
            }],
        }],
        "materials": [{
            "name": "fetal tissue study material",
            "pbrMetallicRoughness": {
                "baseColorFactor": [0.71, 0.40, 0.35, 1.0],
                "metallicFactor": 0.0,
                "roughnessFactor": 0.58,
            },
            "doubleSided": True,
        }],
        "buffers": [{"byteLength": len(binary)}],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": len(position_bytes), "target": 34962},
            {"buffer": 0, "byteOffset": len(position_bytes), "byteLength": len(normal_bytes), "target": 34962},
            {"buffer": 0, "byteOffset": index_offset, "byteLength": len(index_bytes), "target": 34963},
        ],
        "accessors": [
            {
                "bufferView": 0,
                "componentType": 5126,
                "count": len(positions),
                "type": "VEC3",
                "min": positions.min(axis=0).tolist(),
                "max": positions.max(axis=0).tolist(),
            },
            {"bufferView": 1, "componentType": 5126, "count": len(normals), "type": "VEC3"},
            {"bufferView": 2, "componentType": 5125, "count": len(indices), "type": "SCALAR"},
        ],
    }
    json_bytes = pad4(json.dumps(document, separators=(",", ":")).encode("utf-8"), b" ")
    binary_bytes = pad4(binary)
    total_length = 12 + 8 + len(json_bytes) + 8 + len(binary_bytes)
    with output.open("wb") as glb:
        glb.write(struct.pack("<4sII", b"glTF", 2, total_length))
        glb.write(struct.pack("<I4s", len(json_bytes), b"JSON"))
        glb.write(json_bytes)
        glb.write(struct.pack("<I4s", len(binary_bytes), b"BIN\x00"))
        glb.write(binary_bytes)


def write_obj(output: Path, vertices: np.ndarray, faces: np.ndarray, frame: int) -> None:
    with output.open("w", encoding="utf-8") as obj:
        obj.write("# MRI-derived fetal surface, MedicalVisionGroup/fetal-smpl\n")
        obj.write(f"# MAP-C507 frame {frame}; geometry preserved, recentered only\n")
        obj.write("o fetus_mri_surface\n")
        for x, y, z in vertices:
            obj.write(f"v {x:.9f} {y:.9f} {z:.9f}\n")
        for a, b, c in faces:
            obj.write(f"f {a + 1} {b + 1} {c + 1}\n")


def main() -> None:
    args = parse_args()
    vertices_sequence = np.load(args.source / "segm_vertex_seq.npy", allow_pickle=True)
    faces_sequence = np.load(args.source / "segm_faces_seq.npy", allow_pickle=True)

    if not 0 <= args.frame < len(vertices_sequence):
        raise ValueError(f"frame must be between 0 and {len(vertices_sequence) - 1}")

    vertices = np.asarray(vertices_sequence[args.frame], dtype=np.float64)
    faces = np.asarray(faces_sequence[args.frame], dtype=np.int64)
    if vertices.ndim != 2 or vertices.shape[1] != 3:
        raise ValueError("unexpected vertex array")
    if faces.ndim != 2 or faces.shape[1] != 3:
        raise ValueError("unexpected face array")

    center = (vertices.min(axis=0) + vertices.max(axis=0)) / 2
    vertices = vertices - center
    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.suffix.lower() == ".glb":
        write_glb(args.output, vertices, faces, args.frame)
    else:
        write_obj(args.output, vertices, faces, args.frame)

    extent = vertices.max(axis=0) - vertices.min(axis=0)
    print(
        f"frame={args.frame} vertices={len(vertices)} faces={len(faces)} "
        f"extent_m={extent.tolist()} output={args.output}"
    )


if __name__ == "__main__":
    main()

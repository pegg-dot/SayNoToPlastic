#!/usr/bin/env python3
"""Software-render front and close views of the production pregnancy assembly."""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.collections import PolyCollection
import numpy as np


def parse_obj(path: Path) -> tuple[np.ndarray, np.ndarray]:
    vertices: list[list[float]] = []
    faces: list[list[int]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("v "):
            vertices.append([float(value) for value in line.split()[1:4]])
        elif line.startswith("f "):
            refs = [int(value.split("/")[0]) - 1 for value in line.split()[1:]]
            if len(refs) == 3:
                faces.append(refs)
            elif len(refs) > 3:
                faces.extend([[refs[0], refs[index], refs[index + 1]] for index in range(1, len(refs) - 1)])
    return np.asarray(vertices), np.asarray(faces)


def render_layer(ax, vertices: np.ndarray, faces: np.ndarray, color: str, alpha: float, step: int, yaw: float) -> None:
    faces = faces[::step]
    triangles = vertices[faces]
    normals = np.cross(triangles[:, 1] - triangles[:, 0], triangles[:, 2] - triangles[:, 0])
    lengths = np.maximum(np.linalg.norm(normals, axis=1), 1e-9)
    radians = np.deg2rad(yaw)
    depth = triangles[:, :, 0] * np.sin(radians) + triangles[:, :, 2] * np.cos(radians)
    horizontal = triangles[:, :, 0] * np.cos(radians) - triangles[:, :, 2] * np.sin(radians)
    light_normal = normals[:, 0] * np.sin(radians) + normals[:, 2] * np.cos(radians)
    light = 0.48 + 0.52 * np.abs(light_normal) / lengths
    rgb = np.asarray(plt.matplotlib.colors.to_rgb(color))
    colors = np.concatenate([np.clip(rgb[None, :] * light[:, None], 0, 1), np.full((len(light), 1), alpha)], axis=1)
    order = np.argsort(depth.mean(axis=1))
    projected = np.stack([horizontal, triangles[:, :, 1]], axis=2)[order]
    ax.add_collection(PolyCollection(projected, facecolors=colors[order], edgecolors="none"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    specifications = [
        ("pregnant-body.obj", "#88a1aa", .18, 6),
        ("vasculature.obj", "#b96048", .22, 5),
        ("brain.obj", "#d3a36f", .8, 2),
        ("heart.obj", "#a84e40", .92, 1),
        ("pelvis.obj", "#c7b29d", .3, 2),
        ("placenta.obj", "#ae5649", .48, 1),
        ("fetus.obj", "#d68a73", .96, 1),
    ]
    layers = [(parse_obj(args.source / name), color, alpha, step) for name, color, alpha, step in specifications]

    figure, axes = plt.subplots(1, 2, figsize=(12, 8), facecolor="#07121a")
    for index, ax in enumerate(axes):
        ax.set_facecolor("#07121a")
        for (vertices, faces), color, alpha, step in layers:
            render_layer(ax, vertices, faces, color, alpha, step, 18 if index == 0 else 0)
        ax.set_aspect("equal")
        ax.set_axis_off()
    axes[0].set_xlim(-.56, .56)
    axes[0].set_ylim(-.83, .92)
    axes[0].set_title("Full maternal orientation — production overview", color="#f5efe4", fontsize=14)
    axes[1].set_xlim(-.27, .27)
    axes[1].set_ylim(-.10, .41)
    axes[1].set_title("Pregnancy cutaway crop", color="#f5efe4", fontsize=14)
    figure.suptitle("Production geometry QA — front projection", color="#eab05a", fontsize=16)
    figure.subplots_adjust(left=.02, right=.98, top=.92, bottom=.02, wspace=.05)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    figure.savefig(args.output, dpi=180, facecolor=figure.get_facecolor())
    print(args.output)


if __name__ == "__main__":
    main()

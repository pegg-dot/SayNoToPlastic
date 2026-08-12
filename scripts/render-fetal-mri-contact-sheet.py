#!/usr/bin/env python3
"""Render diagnostic views of the open fetal-MRI meshes without WebGL.

The renderer is deliberately non-destructive: it samples faces only for the
contact sheet and never changes the production mesh.  Orthographic views make
surface completeness and pose easier to compare across sequence frames.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import numpy as np


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--frames", type=int, nargs="+", default=[0, 25, 50, 75, 99])
    parser.add_argument("--face-step", type=int, default=2)
    parser.add_argument("--projection-frame", type=int)
    return parser.parse_args()


def render_view(ax, vertices: np.ndarray, faces: np.ndarray, elev: float, azim: float) -> None:
    tris = vertices[faces]
    collection = Poly3DCollection(
        tris,
        facecolors=(0.76, 0.47, 0.39, 1.0),
        edgecolors=(0.10, 0.16, 0.18, 0.10),
        linewidth=0.08,
        shade=True,
    )
    ax.add_collection3d(collection)
    extent = vertices.max(axis=0) - vertices.min(axis=0)
    center = (vertices.max(axis=0) + vertices.min(axis=0)) / 2
    radius = extent.max() * 0.55
    ax.set_xlim(center[0] - radius, center[0] + radius)
    ax.set_ylim(center[1] - radius, center[1] + radius)
    ax.set_zlim(center[2] - radius, center[2] + radius)
    ax.set_box_aspect((1, 1, 1))
    ax.view_init(elev=elev, azim=azim)
    ax.set_proj_type("ortho")
    ax.set_axis_off()
    ax.set_facecolor("#07121a")


def main() -> None:
    args = parse_args()
    vertex_sequence = np.load(args.source / "segm_vertex_seq.npy", allow_pickle=True)
    face_sequence = np.load(args.source / "segm_faces_seq.npy", allow_pickle=True)
    if args.projection_frame is not None:
        vertices = np.asarray(vertex_sequence[args.projection_frame], dtype=np.float64)
        center = (vertices.min(axis=0) + vertices.max(axis=0)) / 2
        vertices = vertices - center
        figure, axes = plt.subplots(1, 3, figsize=(15, 5), facecolor="#07121a")
        for ax, (a, b, title) in zip(axes, [(0, 2, "X–Z (production front)"), (0, 1, "X–Y"), (1, 2, "Y–Z")]):
            ax.set_facecolor("#07121a")
            ax.scatter(vertices[:, a], vertices[:, b], s=.14, color="#c97964", alpha=.5, linewidths=0)
            ax.set_aspect("equal")
            ax.set_axis_off()
            ax.set_title(title, color="#f5efe4")
        figure.suptitle(f"MAP-C507 frame {args.projection_frame} — axis projections", color="#f5efe4", fontsize=15)
        figure.subplots_adjust(left=.02, right=.98, top=.9, bottom=.02, wspace=.08)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        figure.savefig(args.output, dpi=180, facecolor=figure.get_facecolor())
        print(args.output)
        return

    views = [(12, -72, "view A"), (12, 18, "view B"), (78, -72, "view C")]

    figure = plt.figure(figsize=(15, 9), facecolor="#07121a")
    for row, frame in enumerate(args.frames):
        vertices = np.asarray(vertex_sequence[frame], dtype=np.float64)
        faces = np.asarray(face_sequence[frame], dtype=np.int64)[:: args.face_step]
        center = (vertices.min(axis=0) + vertices.max(axis=0)) / 2
        vertices = vertices - center
        for col, (elev, azim, label) in enumerate(views):
            ax = figure.add_subplot(len(args.frames), len(views), row * len(views) + col + 1, projection="3d")
            render_view(ax, vertices, faces, elev, azim)
            if col == 0:
                ax.text2D(0.01, 0.92, f"frame {frame}", transform=ax.transAxes, color="#eab05a", fontsize=11, weight="bold")
            if row == 0:
                ax.set_title(label, color="#f5efe4", fontsize=11, pad=2)

    figure.suptitle(
        "MAP-C507 fetal MRI surface — diagnostic views (render sampling only)",
        color="#f5efe4",
        fontsize=15,
        y=0.995,
    )
    figure.subplots_adjust(left=0.01, right=0.99, top=0.96, bottom=0.01, wspace=0.0, hspace=0.0)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    figure.savefig(args.output, dpi=150, facecolor=figure.get_facecolor())
    print(args.output)


if __name__ == "__main__":
    main()

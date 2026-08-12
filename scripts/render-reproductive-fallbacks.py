#!/usr/bin/env python3
from pathlib import Path
import numpy as np
import trimesh
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from matplotlib.patches import Ellipse

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / 'public/models/anatomy'
OUT = ROOT / 'public/images/anatomy'
OUT.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Testicular anatomy: render the licensed BodyParts3D-derived STL surfaces.
# ---------------------------------------------------------------------------
parts = [
    ('testis-left.stl', '#d7a16d', 'Testis'),
    ('testis-right.stl', '#d7a16d', 'Testis'),
    ('epididymis-left.stl', '#a95846', 'Epididymis'),
    ('epididymis-right.stl', '#a95846', 'Epididymis'),
]
meshes = []
all_vertices = []
for name, color, label in parts:
    mesh = trimesh.load(MODEL / name, force='mesh', process=False)
    meshes.append((mesh, color, label))
    all_vertices.append(mesh.vertices)
center = np.vstack(all_vertices).mean(axis=0)
scale = np.ptp(np.vstack(all_vertices), axis=0).max()

fig = plt.figure(figsize=(11, 8.2), dpi=140, facecolor="#07111d")
ax = fig.add_axes([0.07, 0.16, 0.86, 0.68], projection="3d")
ax.set_facecolor("#07111d")
for mesh, color, _ in meshes:
    vertices = (mesh.vertices - center) / scale
    # BodyParts coordinates read best with z as vertical and y as depth.
    vertices = vertices[:, [0, 2, 1]]
    faces = vertices[mesh.faces]
    collection = Poly3DCollection(
        faces,
        facecolor=color,
        edgecolor=(0.12, 0.06, 0.04, 0.14),
        linewidth=0.12,
        alpha=1,
    )
    collection.set_zsort("average")
    ax.add_collection3d(collection)

# A frontal, orthographic view makes the paired organs immediately legible.
ax.view_init(elev=2, azim=-88)
ax.set_proj_type("ortho")
ax.set_xlim(-0.46, 0.46)
ax.set_ylim(-0.34, 0.34)
ax.set_zlim(-0.45, 0.45)
ax.set_axis_off()

# Subtle scrotal outline anchors the isolated structures in recognizable anatomy.
scrotum = Ellipse((0.5, 0.46), 0.52, 0.48, transform=fig.transFigure,
                  facecolor=(0.64, 0.30, 0.24, 0.09),
                  edgecolor=(0.93, 0.73, 0.60, 0.55), linewidth=1.4)
fig.add_artist(scrotum)

# Labels stay outside the organs so no anatomy is obscured.
fig.text(0.065, 0.91, "MALE REPRODUCTIVE ANATOMY", color="#cda15e", fontsize=13,
         fontweight="bold", family="DejaVu Sans")
fig.text(0.065, 0.855, "Paired testes with the epididymis along each outer surface",
         color="#f5efe4", fontsize=17, family="DejaVu Serif")
fig.text(0.085, 0.36, "TESTIS", color="#f5efe4", fontsize=12, fontweight="bold")
fig.text(0.73, 0.36, "EPIDIDYMIS", color="#de967d", fontsize=12, fontweight="bold")
fig.lines.extend([
    plt.Line2D([0.17, 0.35], [0.39, 0.48], transform=fig.transFigure, color="#f5efe4", lw=1.3),
    plt.Line2D([0.75, 0.64], [0.39, 0.49], transform=fig.transFigure, color="#de967d", lw=1.3),
])
fig.text(0.065, 0.06, "Licensed BodyParts3D anatomical surfaces · stable fallback view",
         color="#9eb0b8", fontsize=10.5)
plt.savefig(OUT / "testis-labeled.png", facecolor=fig.get_facecolor(),
            bbox_inches="tight", pad_inches=0.03)
plt.close(fig)

# ---------------------------------------------------------------------------
# Ovary: a readable labeled cross-section. The live scene continues to use the
# licensed ovary GLB; this stable fallback explains follicles and follicular fluid.
# ---------------------------------------------------------------------------
ovary_svg = r'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-labelledby="title desc">
<title id="title">Ovary and follicular fluid schematic</title>
<desc id="desc">A labeled cross-section of an ovary showing follicles at several stages and a magnified follicle containing an egg surrounded by follicular fluid.</desc>
<defs>
  <radialGradient id="ovaryFill" cx="42%" cy="35%" r="75%"><stop offset="0" stop-color="#e0a783"/><stop offset=".62" stop-color="#bd6f5f"/><stop offset="1" stop-color="#703d3a"/></radialGradient>
  <radialGradient id="follicleFill"><stop offset="0" stop-color="#f5d4b7"/><stop offset=".44" stop-color="#d98b72"/><stop offset="1" stop-color="#814b4b"/></radialGradient>
  <radialGradient id="fluidFill"><stop offset="0" stop-color="#9fd3d8" stop-opacity=".9"/><stop offset="1" stop-color="#4f8595" stop-opacity=".65"/></radialGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .45 0"/></filter>
</defs>
<g font-family="Arial, Helvetica, sans-serif">
  <text x="70" y="76" fill="#cda15e" font-size="26" font-weight="700" letter-spacing="4">OVARY AND DEVELOPING EGG</text>
  <text x="70" y="116" fill="#f5efe4" font-size="26">Schematic cross-section for the stable fallback view</text>

  <path d="M174 501 C150 332 266 198 448 192 C628 186 736 302 710 471 C684 644 526 726 348 684 C246 660 188 594 174 501Z" fill="#000" opacity=".38" filter="url(#shadow)"/>
  <path d="M174 471 C150 302 266 168 448 162 C628 156 736 272 710 441 C684 614 526 696 348 654 C246 630 188 564 174 471Z" fill="url(#ovaryFill)" stroke="#f0c5a0" stroke-width="6"/>
  <path d="M218 455 C200 330 292 224 442 218 C588 212 673 302 652 430 C632 558 509 622 366 590 C285 572 231 528 218 455Z" fill="#713f42" opacity=".22"/>

  <g stroke="#f2d5bc" stroke-width="4">
    <circle cx="317" cy="315" r="30" fill="url(#follicleFill)"/><circle cx="317" cy="315" r="9" fill="#f7e0c8"/>
    <circle cx="405" cy="269" r="45" fill="url(#follicleFill)"/><circle cx="405" cy="269" r="13" fill="#f7e0c8"/>
    <circle cx="508" cy="326" r="60" fill="url(#follicleFill)"/><circle cx="508" cy="326" r="18" fill="#f7e0c8"/>
    <circle cx="338" cy="451" r="52" fill="url(#follicleFill)"/><circle cx="338" cy="451" r="15" fill="#f7e0c8"/>
    <circle cx="525" cy="482" r="91" fill="url(#fluidFill)"/><circle cx="525" cy="482" r="30" fill="#f5d2aa"/><circle cx="525" cy="482" r="10" fill="#8c4d49"/>
  </g>

  <path d="M699 300 C795 235 859 250 924 305" fill="none" stroke="#d69077" stroke-width="24" stroke-linecap="round"/>
  <path d="M916 298 C950 276 975 270 1001 271 M918 306 C956 307 982 316 1008 331 M910 290 C943 253 965 236 992 225" fill="none" stroke="#d69077" stroke-width="13" stroke-linecap="round"/>
  <text x="824" y="194" fill="#f5efe4" font-size="23" font-weight="700">Fallopian tube</text>
  <path d="M850 207 L835 257" stroke="#f5efe4" stroke-width="2"/>

  <circle cx="950" cy="560" r="148" fill="#0b1721" stroke="#cda15e" stroke-width="4"/>
  <circle cx="950" cy="560" r="108" fill="url(#fluidFill)" stroke="#d9edf0" stroke-width="3"/>
  <circle cx="950" cy="560" r="45" fill="#f5d2aa" stroke="#f8ead9" stroke-width="3"/>
  <circle cx="950" cy="560" r="15" fill="#8c4d49"/>
  <text x="780" y="748" fill="#cda15e" font-size="22" font-weight="700">MAGNIFIED FOLLICLE</text>
  <text x="790" y="782" fill="#f5efe4" font-size="20">The developing egg sits inside</text>
  <text x="790" y="812" fill="#f5efe4" font-size="20">follicular fluid.</text>

  <path d="M604 484 C712 485 762 503 805 530" fill="none" stroke="#cda15e" stroke-width="3" stroke-dasharray="9 8"/>
  <text x="72" y="870" fill="#9eb0b8" font-size="18">Live 3D view uses the licensed ovary model. This cross-section explains the fluid sampled in the human study.</text>
</g>
</svg>'''
(OUT / 'ovary-labeled.svg').write_text(ovary_svg)
print('Wrote', OUT / 'testis-labeled.png')
print('Wrote', OUT / 'ovary-labeled.svg')

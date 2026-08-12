# Transcript visual-alignment audit

## Evidence inspected

- v37 source and CSS
- stored homepage, anatomy, book, portrait, TEDx, kitchen, generation and footer assets
- supplied official book-cover image
- supplied Quick Action Card page 121 image
- Blueprint Chapters 1 and 2

A passing build is not visual approval. Items below remain open until rendered at the required viewports.

## Findings

| Area | Current state | Alignment |
|---|---|---|
| Color system | Close navy/ivory/gold palette, but values diverge from blueprint tokens. | Partial. |
| Typography | Arial + Georgia/Palatino fallbacks, not Inter + Cormorant/DM Serif. No wordmark kit. | Contradicted / approximation. |
| Book cover | Stored `book-official.webp` matches the supplied cover with collaborator credit. | Exact. |
| Homepage maternal visual | Purpose-built maternal-fetal cutaway exists with usable negative space. | Substantial, pending rendered crop review. |
| Brain | Recognizable fallback/model. | Substantial. |
| Heart | Simplified fallback is recognizable, but must be reviewed in context. | Substantial. |
| Pregnancy/placenta | Coherent cutaway and layered model are present. | Substantial, clinical registration review required. |
| Ovary | Current fallback is the elongated generic form Dr. Haddad explicitly criticized. No follicular magnification. | Fails transcript. |
| Testis | Current fallback is an unlabeled low-detail shape/plot; non-scientist recognizability is not established. | Fails transcript. |
| Exposure routes | Text cards/marquee, no representative route visuals. | Partial. |
| Dr. Haddad portrait | Real-looking profile asset, but About uses white coat despite blueprint art direction; owner approval not recorded. | Partial. |
| Events & Media | Structure exists, but final approved inventory/assets/rights are missing. | Owner blocked. |
| Book interaction | Sophisticated source implementation exists. | Browser/viewport approval pending. |
| Mobile/tablet | Responsive CSS exists. | Unverified at required widths. |
| Reduced motion / no WebGL | Fallback logic exists. | Visual equivalence unverified and weak for ovary/testis. |

## Required visual gate

Review at 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 375×667, and 320 px width. Also test 200% zoom, reduced motion, no WebGL, keyboard-only navigation, slow mobile loading, and long translated/zoomed text behavior.

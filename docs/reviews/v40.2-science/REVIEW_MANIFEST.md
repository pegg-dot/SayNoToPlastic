# v40.2 Science review manifest

## User-provided review inputs

- `science-page-before.png` — local `/science` screenshot used to identify the unwanted “How to read this page” block and current hero composition.
- `body-reference.png` — user-provided full-body science illustration requested as a subtle/translucent top-of-page background.
- `organ-reference-collage.png` — user-provided six-panel reference containing Brain, Heart, Placenta, Testicle, Ovary and Blood visuals.

## Runtime derivatives

The website uses only non-generative crops/format conversions of the user-provided assets:

- `public/images/science/science-body-overview.webp`
- `public/images/science/brain.webp`
- `public/images/science/heart.webp`
- `public/images/science/placenta.webp`
- `public/images/science/testicular-tissue.webp`
- `public/images/science/ovary.webp`
- `public/images/science/blood.webp`

The collage captions are intentionally excluded from the runtime crops because study titles, explanations and sources remain live HTML.

## Explicit non-action

No AI-generated replacement image is used by v40.2. The accidental generation attempt during chat review was discarded and is not part of the project package.

## Integrity hashes

```text
319a855f266aee84c2e4ec9d494cd877a8e862d1004210ee5007d4f16bd6fd92  science-page-before.png
0ba71b5b26fec1a603b9f655657df5034d2fd538df4ace2a542112df2d362e88  body-reference.png
3df84c66fa2e68262b2b8412f0b28e4b04eb324159ae28ef00c6b1accb2645c2  organ-reference-collage.png
bedcaf7f1aaacb7bf738774c4bfcb34a87b8322104a6966fa1c030e6517b83bb  public/images/science/science-body-overview.webp
5ee0e4d04bb1bea02ca28e52cf80aa18df9a0b6a659700d4a68b00b23ff5d6da  public/images/science/brain.webp
014bb6041449d18f2c2305ced29271fc6e1c12b70e2ea5c91c814b49d4d3a453  public/images/science/heart.webp
b816005b05f4ed1952b4eb943c337c5fab7f8d5e967a3cc006c4427f4a51bdda  public/images/science/placenta.webp
ee9cdfaf325dd3e1fece2334bd8827c1213424362145c3121143bcbc4b081c57  public/images/science/testicular-tissue.webp
251f544bbbd754f32a4e38d5cbc90e7ee8d32ae46954035f7a63d8ff09a51428  public/images/science/ovary.webp
47b7ce1f9c3d073a46aa2d238d63e517eebd1015f7de7153fcb148882d832f0c  public/images/science/blood.webp
```

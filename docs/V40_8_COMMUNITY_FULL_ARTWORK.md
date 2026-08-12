# v40.8 — Community full-artwork correction

## Rendered defect
The v40.7 Community page still looked cut off even though CSS used `object-fit: contain`. The reason was upstream: `/generations.webp` was itself a tall cropped derivative (700×1536). CSS could not reveal pixels that were no longer present.

## Source-of-truth fix
The authoritative Chapter 2 blueprint contains the complete 1024×1536 three-generation poster as `word/media/image8.png`. v40.8 uses that supplied source—not generated imagery—to create:

- `public/generations-full.webp` — 1024×1536
- `public/generations-full-mobile.webp` — 720×1080

Original blueprint embedded-image SHA-256:
`5b4a9f463f8b9d0625ecc1f955645fd2392d66814b7fcc32f987304a0193297a`

Desktop derivative SHA-256:
`e09bf6648f98562f1097bf1b9d218998b28b7ba98aca0fe9a9eec19138a989c9`

Mobile derivative SHA-256:
`84943096e2985ce536b00b34d46e7527da7089f15ab7f626f56c23923d266e09`

## Layout correction
- Desktop poster uses a 2:3 aspect ratio and `object-fit: contain`.
- Its height is capped with `height:min(78svh,820px)` so the complete poster can fit within a normal desktop viewport rather than spanning multiple screens.
- Tablet/mobile return to natural responsive height.
- Home remains unchanged and still omits the oversized generations image.
- Live Community heading, signup form, consent, and links remain separate HTML; the artwork never replaces real controls.

## Acceptance gate
Source checks prove the complete supplied poster is used. Final acceptance still requires a real local render at desktop and mobile.

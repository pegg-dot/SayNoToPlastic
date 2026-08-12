# v40.10 Welcome Film Integration

Date: 2026-08-08

## Supplied asset
The project user supplied `D93F9F07-B2C5-4261-968C-A0F9676B3B5B.mp4` and explicitly identified it as the current welcome video.

Original file characteristics verified with `ffprobe`:
- 1080 × 1920 portrait (9:16)
- HEVC video + AAC stereo audio
- 30 fps
- 208.07 seconds (~3:28)
- 248,469,754 bytes
- SHA-256: `08080a26a095c897dd7766efbc82ff493c97816b76212622ba1c96500f91fedb`

The uploaded master is not duplicated inside the portable release ZIP because doing so would add roughly 248 MB to every source handoff. Its exact filename, hash, byte size, codec, dimensions and duration are preserved in `app/content/welcome-film-metadata.json` so the owner can archive the master separately and future maintainers can prove which source was used.

## Web derivative
For browser compatibility and payload size, the site ships:
- `/public/media/welcome-dr-haddad.mp4`
- H.264 video + AAC audio
- 540 × 960 portrait (9:16)
- 208.07 seconds
- 35,866,916 bytes
- `faststart` MP4 layout for progressive playback
- SHA-256: `7cfbf206102a907163bec6e4b06c69a8f0b8d51b7ad28ddde589b093bada7175`

The HEVC master is not served directly because cross-browser HEVC support is less reliable than H.264/AAC.

## Poster
A frame from the supplied film is used as the click-to-play poster:
- `/public/media/welcome-dr-haddad-poster.webp`
- 540 × 960
- SHA-256: `7a4ab5505541ae7db16d010c09db15c8c5c486bcc2580fde522f742d4ccb1dd8`

## Placement
The same canonical `WELCOME_FILM` configuration now drives:
1. The automatic first-visit homepage dialog.
2. The fixed homepage “Welcome · From Dr. Haddad” replay control after dismissal.
3. The Welcome Film section on `/media`, where the film can be played inline.

The homepage does **not** gain a large embedded welcome-video section. That preserves the transcript decision that the introduction should be a first-visit popup/replayable experience rather than a giant homepage block.

## Playback behavior
- First homepage visit opens the dialog, but the film does not begin with sound automatically.
- The user explicitly presses Play before the hosted video receives `autoPlay`.
- Replay remains available from the fixed homepage chip.
- Escape, backdrop close, focus trap/return, inert background and shared scroll locking remain unchanged.
- Portrait video and poster use `object-fit: contain`; the supplied frame is not stretched or cropped.
- The `/media` copy uses an inline HTML5 player with `preload="metadata"`, not autoplay.


## v40.10 one-viewport dialog correction
Local rendered review of v40.9 showed that the first-visit dialog was too tall despite correctly containing the portrait film. v40.10 keeps the same media asset and playback behavior but bounds the standard dialog to one viewport, gives the 9:16 film a narrower dedicated column, neutralizes the inherited 640px minimum, compacts the copy pane, and prevents normal modal scrolling. Tablet stays two-column and mobile uses bounded rows. An extreme-zoom/tiny-viewport accessibility exception allows scrolling only when necessary to keep controls reachable.

## Still open before production signoff
The supplied MP4 contains no subtitle track. This environment cannot independently transcribe the spoken audio. Therefore:
- captions remain required;
- a text transcript remains required;
- the spoken film should be checked against the five-point transcript brief (who Dr. Haddad is, the mission, what microplastics are, where they come from, and why the topic matters);
- desktop/tablet/mobile rendered playback remains a real-browser proof gate.

The film asset itself is no longer an owner/provider blocker.

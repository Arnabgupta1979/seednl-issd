# Test record (pilot)

Tested by the pilot author on Windows 11 with the Claude desktop app's built-in browser (Chromium-based), file:// URLs, 2026-11-23.

## Tested
- **E02:** build validated by the reference validator (structure, JS syntax, caption/narration match, 6 scenes, 120 s). Every scene rendered via `window.__ai.render(t)` without errors; scene starts 0/16/36/60/80/102 s. No console errors. All six scenes were visually spot-checked.
- **G01:** scripted walkthrough of all six screens for all three farmers (pick, main and back-up routes, stress test, fit report, debrief, compare table, summary text). No console errors. Fit report visually checked. No horizontal overflow at the pane width used.
- `node --check` passes for `app.js`, `data.js`.

## Recorded narration (added later)
- Local speech-to-text (faster-whisper, small.en) transcribed `Narration_recorded.mp3`: 243 words, matching the script (spelling variants only). Word timestamps drive scene changes and `Captions.vtt`.
- Build re-validated (structure, JS syntax). Validator warns that scenes 1–4 and 6 exceed 160 spoken words per minute: the voice is fast.
- Headless Chrome: the page loads, embedded timings are applied (total 76.4 s), and screenshots at several times show captions matching the scene content. This used a copy with silent stand-in audio of the same length, because the full 1.7 MB file would not load in the preview pane.
- **Not done:** listening to the real audio, checking pronunciation or sync by ear, playing the embedded audio in a normal browser, confirming the voice's source and licence.

## Not tested
- Real keyboard-only run, screen readers (NVDA, VoiceOver), zoom 200%, high-contrast mode (code is written for these but unverified).
- Phone or tablet widths in a real device; Firefox, Safari, Edge.
- Opening via an LMS or iframe; LMS storage behaviour; localStorage opt-in across sessions.
- Audible playback and by-ear sync of the E02 narration, Play/Record in a real session beyond the render checks, MP4 export.
- Content accuracy: no expert review yet.
- The standalone file and the multi-file version were built from the same sources; only the standalone file was run in the browser pane (the pane does not load relative scripts).

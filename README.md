# OPVSCVLA

Six small musical machines. Each is a single self-contained HTML file of pure
Web Audio — no build, no dependencies, no samples, no trackers. The machine
composes; you set the law it obeys.

**Live:** https://cupofghost.github.io/opuscula/

| op. | work | what it is |
|-----|------|-----------|
| I | [PAS SALÉ](./pas-sale/) | zydeco two-step for a synthesized band — G, 148. ENCORE! presses another version. |
| II | [SCALA](./scala/) | Shepard–Risset glissando in just intonation. Ratios exact; the lap loops seamlessly. |
| III | [GRADUS](./gradus/) | Generative species counterpoint after Fux (1725). Six rules are the interface; turn off parallels and it writes organum. |
| IV | [RILLE](./rille/) | Minimal techno on a white-label dubplate — named in German, techno's mother tongue. Six affects steer key, tempo, and space; a diatonic engine keeps the chords in the mode. |
| V | [COCHLEA](./cochlea/) | A just-intonation comma pump. Pure intervals walk a fifth-and-third lattice that never quite closes; the residual comma winds an Archimedean spiral. Every interval pure, every return imperfect. |
| VI | [BOLG](./bolg/) | Generative uilleann piping — named in Irish, the music's mother tongue. A just-intonation chanter over three standing drones; cuts, rolls and crans with the regulators vamping underneath. Reels, jigs, slip jigs, hornpipes and slow airs. |

## Shared grammar

- **space** = play/stop · **r** = another (aliud/encore) · **c** = cut 16-bit WAV
- **The URL hash is the pressing.** Every parameter — seed included — serializes
  into `#…`. Copy the address and the exact opus reloads anywhere.
- Offline render: each work cuts a deterministic WAV of itself.
- iOS: audio requests the `playback` session (ignores the silent switch on
  Safari 17+); resumes across interruptions.

## Running locally

Open any `index.html` directly, or serve the folder with any static server.
GitHub Pages serves it as-is.

## Colophon

Vanilla HTML/CSS/JS. Canvas notation and visualizations are layer-cached;
render loops sleep when idle. `prefers-reduced-motion` respected throughout.

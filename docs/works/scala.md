# op. II — SCALA · `scala/`

A **Shepard–Risset glissando in just intonation** — an endless staircase of pitch
that seems to rise/fall forever without going anywhere.

- **Concept:** several octave-spaced sine "voices" run through a fixed loudness
  window; as one fades out the top, another fades in the bottom, so the octave
  never actually changes. Presets set the ratio set and glide.
- **Just intonation:** ratios are **exact integers, never tempered** — that
  exactness is the point.
- **Execution model:** **live** — controls re-vibe on the fly; the lap loops
  seamlessly.
- **Visualization:** spiral canvas plate; sleeps when idle.
- **WAV cut:** re-renders **one seamless lap** to a 16-bit WAV.
- **`r` = alia** (next ratio).
- **Structure:** constants → state → audio graph → realtime → loop cutter →
  controls → spiral canvas → permalink.

# op. XI — KHÖÖMEI · `khoomei/`

**Mongolian throat singing.** Named in Mongolian (*khöömei*, хөөмий, the pharynx
itself). One voice, two pitches.

- **Concept:** a single synthesized voice — a **rich harmonic glottal drone** — and
  a **cascaded high-Q bandpass** that isolates a **single harmonic** of that drone
  (the whistle). The composed melody automates the bandpass across the harmonic
  series; since the source contains only harmonics of the fundamental, the filter
  can land **only** on one of them — so the **scale is the overtone scale, fixed by
  physics.**
- **Three manners:**
  - **khöömei** — mid, warm overtones;
  - **sygyt** — piercing whistle, high on the ladder, very narrow Q;
  - **kargyraa** — sub-octave growl (adds f0/2 + roughness), lower overtones.
- **Optional** morin-khuur (horse-head fiddle) drone-and-fifth beneath.
- **Execution model:** **live** — re-vibes on any control while the drone keeps
  sounding. Offline WAV cut of the same graph. `r` = another line.
- **Visualization:** harmonic ladder — drone at base, overtone series climbing, a
  glowing marker gliding to the harmonic being sung.

**Structure:** engine → state/RNG → audio (glottal source + cascaded bandpass) →
canvas (ladder) → realtime → OfflineAudioContext WAV → controls → `__iosAudio`
(near bottom) → hash/keys → init.

## Hash params (`#st=&k=&p=&b=&g=&sd`)
| key | control | values |
|-----|---------|--------|
| `st` | style (manner) | `khoomei, sygyt, kargyraa` |
| `k` | drone key | index 0–3: `G(98), A(110), C(131), D(147)` Hz |
| `p` | pace | 34–132 (overtone melody pace) |
| `b` | breath | 0–100 (air/noise in the source) |
| `g` | ground (morin khuur) | toggle 0/1 |
| `sd` | seed | mulberry32 |

*Live re-vibe: controls change while the drone keeps sounding.*

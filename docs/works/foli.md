# op. IX — FOLI · `foli/`

**West African (Mande) djembe & dunun ensemble** as a drum machine. Named in
Maninka (Malinké): *foli* = the rhythm, the playing itself.

- **Concept:** a named **RHYTHM** fixes the interlocking parts — kariñan bell,
  three dununs (kenkeni · sangban · dundunba), sékéré shaker, two djembe
  accompaniments — and the machine **composes the lead djembe solo** over the top.
  Eight rhythms: Kuku, Kassa, Djansa, Sunu; Dundunba, Tiriba, Mendiani, Soli.
  Binary and 12/8 feels. Mute any voice to hear the hole it leaves.
- **Authenticity note:** the **bell timelines are canonical**; the drum parts are
  idiomatic arrangements.
- **Synthesis:** each drum a **struck membrane** (pitched tone with fast
  pitch-drop + hand/stick transient); each bell a cluster of inharmonic partials.
  No samples. The whole cycle renders once into a stereo buffer, peak-normalised.
- **Execution model:** **through-composed** — a fixed arrangement plus a composed
  solo; any control regenerates the buffer and restarts. **Seeded**; `r` = another
  groove; solo "heat" control.
- **Visualization:** polyrhythm as **concentric rings** (one per voice) with a
  sweeping playhead; sleeps when idle.

### Mix notes (recurring)
- **Seamless loop:** decay tails are **folded over the loop point** so the wheel
  turns without a seam. Preserve this if you change the render length.

**Both renderers share an identical signal path** so the WAV matches playback.

## Hash params (`#r=&bpm=&h=&m=&sd`)
| key | control | values |
|-----|---------|--------|
| `r` | rhythm | `kuku, kassa, djansa, dundunba, tiriba, mendiani, sunu, soli` |
| `bpm` | tempo | rhythm sets the default (e.g. Kuku 120, Soli 92) |
| `h` | heat | lead-djembe solo intensity |
| `m` | mute bitmask | ensemble voices in VOICES order (bell, kenkeni, sangban, dundunba, two djembes, shaker, solo) |
| `sd` | seed | mulberry32 |

*Through-composed: any change regenerates the buffer and restarts.*

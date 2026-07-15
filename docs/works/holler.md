# op. VIII — HOLLER · `holler/`

**Appalachian old-time banjo.** One generated AABB fiddle tune, played by **five
right hands.**

- **Concept:** on the banjo **the picking pattern is the music** — clawhammer's
  down-stroke and the Scruggs roll play the same notes yet sound like different
  instruments — so **STYLE is the headline control.** The five hands: clawhammer,
  drop-thumb, two-finger, three-finger (Scruggs) roll, melodic.
- **Tuning/mode:** sawmill and open tunings, four old-time **modes** (Ionian,
  Mixolydian, Dorian, Aeolian), a fixed **fifth-string drone.**
- **Synthesis:** every note a **Karplus–Strong** plucked string (noise burst
  cycled through delay + lowpass = decaying pluck) — **no samples.** The whole
  tune renders once into a mono buffer, body-resonance-shaped and peak-normalised.
- **Optional string-band backing:** guitar boom-chuck, upright bass, foot stomp.
- **Execution model:** **through-composed** — any control regenerates the tune,
  then restarts (a written tune can't re-vibe live). **Seeded** (`mulberry32`);
  `r` = another tune.
- **Visualization:** scrolling **tablature** (five string lines, fret numbers,
  playhead); sleeps when idle.

### Mix notes (recurring)
- Tempo ceiling was **raised 176 → 260 bpm** to reach real old-time speeds.
- The **boom-chuck guitar must not clash with the banjo** — it was explicitly
  de-clashed twice. Keep the backing supporting, not fighting, the banjo.

**Both renderers share an identical signal path**, so the WAV is what you hear.

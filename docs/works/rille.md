# op. IV — RILLE · `rille/`

Seeded **minimal techno** styled as a white-label test pressing. (Renamed from
"Sulcus"; UI translated to German — techno's mother tongue.)

- **Concept:** six **AFFECTUS** (mood) presets steer key, tempo, palette, space
  and density. From a seed the engine generates chords, patterns and arrangement,
  all synthesized. A diatonic engine keeps chords in the mode.
- **Execution model:** **live** — controls re-vibe at the next bar without
  restarting.
- **Seeded** (`mulberry32`); `r` = another version.

### ⚠ Localization rule — do not break this
The **visible UI is German** but the **code identifiers were deliberately kept in
their original (Latin-ish) tongue**. Object keys (`fundus`, `bassus`, `crepitus`,
`manus`, `chordae`, `cantus`, `pulvis`), mood ids (`tenebrae`, `umbra`,
`ferrum`…) and PROGS ids **drive the logic — never rename them.** Only display
`name`/`gloss` strings and labels are German and safe to edit.

- **Visualization:** spinning disc/label canvas; sleeps when idle.
- **Structure:** helpers → engine (diatonic chords → patterns) → state → audio →
  voices → bar scheduler → realtime → disc drawing → WAV cut → UI → permalink.

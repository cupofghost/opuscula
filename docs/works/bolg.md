# op. VI — BOLG · `bolg/`

**Generative uilleann piping** (Irish bagpipes). Named in Irish, the music's
mother tongue.

- **Concept:** a seeded modal **tune grammar** writes reels, jigs, slip jigs,
  hornpipes and slow airs for a **chanter over three standing drones**, with the
  **regulators vamping chords** underneath.
- **Instrument law modelled:** a bagpipe **can't tongue**, so a repeated note must
  be broken by an **ornament (cut, roll or cran) or a stop** — the generator
  expands those ornaments into concrete micro-events.
- **Tuning:** chanter tuned **just against the drones**; its flat seventh is
  **septimal, 7/4**.
- **Execution model:** through-composed; `r` = another tune. **Seeded** (`mulberry32`).
  Pure ENGINE band (grammar, ornaments, tuning, WAV) — no DOM/audio.
- **Cut button label:** `GEARR`.

### Mix notes the user cared about (recurring)
- The **drone must read as the ground** under the chanter (it was lifted for this).
- The **regulator vamp must be actually audible** (it was raised for this).
- Balance so the chanter, drone, and vamp are each legible — don't let the vamp
  disappear or the drone dominate.

**Structure:** ENGINE (grammar → ornaments → tuning → WAV) → state → audio →
GEARR/WAV → regen → ledger canvas → permalink → controls → `__iosAudio` → init.

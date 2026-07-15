# op. V — COCHLEA · `cochlea/`

A **just-intonation comma pump**. Walk a lattice of pure fifths and thirds and
return home — except in pure tuning the lattice **never quite closes**.

- **Concept:** every chord is consonant, but a tiny leftover interval (a **comma**)
  accumulates each lap, so the home note drifts a hair sharp/flat every loop. The
  canvas draws that drift as an **Archimedean spiral that never returns to centre.**
  (Deliberate mirror of Peal, which always comes round; Cochlea never does.)
- **Exact tuning:** arithmetic is done on **exact integer fractions (no floats)**
  over primes **{2, 3, 5, 7}** — that's what makes it truly just.
- **Execution model:** through-composed; `r` = another pump. **Seeded** (`mulberry32`).
- **The ENGINE band is strictly pure:** fraction math, walk generation, event
  planning, and WAV encoding, with **no DOM and no Web Audio** — everything after
  `ENGINE-END` may touch the page/audio; nothing inside it does.
- **Cut button label:** `SECO` (id `#cut` is stable).
- **Structure:** ENGINE (fractions → walk → analysis → plan → WAV) → state → audio
  → SECO/WAV → regen → ledger → spiral canvas → permalink → controls → `__iosAudio`
  → init.

# bolg — session threads

Development history for the `bolg/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### BOLG — AOIS: optional, capped, seeded reed-age drift (op. VI)
**Branch:** `claude/uilleann-pipe-sound-graphics-3zm1mq` (same branch as the
regulator/graphics session above) · **File:** `bolg/index.html` · **Status:**
done, verified headless (Chromium). No new op., no registry changes.

Maintainer's framing: BOLG should stay just intonation where possible, but
real reeds drift — temperature, damp, wear — so model that as an *optional*,
capped, progressive detune, not a toggle that breaks the tuning by default.

- **Confirmed BOLG was already 100% JI** (grepped for `mtof`/semitone-ET —
  zero hits; chanter/drones/regs all resolve through `pcRatio`/`BASE`
  octaves). Nothing to fix there; the ask was additive.
- **AOIS NA RIBÍ** (age of the reeds), a new page-level slider (0–36 "mí",
  default **0**) beside LUAS, hash key `a=` (round-trips through a fresh
  permalink load same as every other control). At 0 every pipe is *exactly*
  just — factory/default behaviour is bit-identical to before this session.
- **The model:** each of the **seven independent reeds** (chanter, 3 drones,
  3 regulator ranks) gets a fixed direction in `[-1,1]`, drawn once from
  `computeReedBias(P.seed)` (a dedicated `mulberry32` stream, XORed off the
  tune's own seed so the composition and the instrument's condition are
  reproducible together but don't fight for the same randomness). Actual
  detune = `(age/36) × TP.reeding.ceiling × bias` — linear in the slider, so
  turning it up is monotonically "more out of tune," capped by a new TIMBRE
  param (**`reeding.ceiling`, default 9¢** — deliberately small, same order
  as the existing octave-kick constant, so "not by a lot" per the ask; a
  worst-case reed at full age is still under a tenth of a semitone off).
  Nothing chases back to true on its own — only re-reeding (turning AOIS back
  down) does.
- **Wiring:** `driftCents()` is read fresh at every chanter note and every
  regulator chord (`scheduleNote`/`scheduleReg`), so those pick up an AOIS
  change on their next entrance with no extra plumbing. Drones are the one
  long-running voice, so the slider's `input` handler also calls
  `applyAgeLive()`, which rides the three live drone oscillators'
  `.detune` via `setTargetAtTime` (τ .15 s) — no transport restart, matching
  the "change-while-playing re-vibes, doesn't restart" convention (unlike
  LUAS/bpm, which already restarts here — precedent for *not* doing that
  wasn't available, so AOIS deliberately does better). `TIMBRE.touch`'s
  existing debounced drone rebuild already re-seats `reeding.ceiling` edits
  made from OFFICINA with no changes needed there. Offline `seco()` cut reads
  the same module-level `reedBias`/`P.age`, so a WAV pressing carries whatever
  AOIS was dialed in, deterministically.
- **Ledger + reader:** new `RIBÍ` ledger row (`0 mí — fresh-reeded, true just
  intonation`, or the months plus a `±x.x¢` ceiling readout at that age) and a
  new reader-notes paragraph ("Tuning, and the reeds' age") explaining the
  conceit in plain language.
- **Verified headless** (`scratchpad/verify-aois.mjs`, alongside the
  pre-existing `verify-bolg.mjs`/`verify-cut.mjs`/`verify-rm.mjs`, all
  re-run clean): age 0 ⇒ exactly zero drift on all seven reeds regardless of
  seed; age scales linearly and monotonically (18 is exactly half of 36's
  drift, every seed checked); every drifted value stays ≤ the TIMBRE ceiling;
  `computeReedBias` is deterministic per seed and differs across seeds; hash
  round-trips `a=` through a real fresh-permalink load; UI slider/label/ledger
  stay in sync after restore; live drag to AOIS 36 while playing visibly
  moves the three live drone oscillators' `.detune`; offline cut at AOIS 30 is
  NaN-free and unclipped. Zero non-font console/page errors.
- **Pick-ups:** the regulator↔freq-index↔rank mapping (`reedBias.regs[i]`
  against `ev.freqs[i]`) assumes chord arrays are always length-3 pc-triples
  (true for every mode in `CHORDS` today) — would need revisiting if a future
  mode ships a chord of a different size. AOIS is deliberately independent of
  the existing `bag` breath LFO (volatile, oscillating, already-shipped) —
  the two are meant to read as separate causes (live breath vs. secular
  condition) and stack additively on the same `.detune` param; no attempt was
  made to unify them.

### BOLG — softer regulators + the whole set now animates (op. VI)
**Branch:** `claude/uilleann-pipe-sound-graphics-3zm1mq` · **File:**
`bolg/index.html` · **Status:** done, verified headless (Chromium). No new
op., no registry changes. Two asks from the maintainer, both landed:

- **Regulators re-voiced — pressed, not struck.** `scheduleReg` had an 8 ms
  linear strike then an immediate `setTargetAtTime` decay (τ≈0.096) — a plucky
  honk. Now: a soft bloom to full over `atk`, held at full until the key lifts
  (`hold`× the note), then a long ring-down (`rel`). Three new TIMBRE `regs`
  params drive it — **atk .045 s · hold .9× · rel .2 s** (were the hard-coded
  .008/immediate/.096); `level`/`tone`/`q` unchanged. Verified in an offline
  render: single chord is NaN-free, peak .26, and still carries ~7 % energy
  in the 0.55–0.75 s window (the old envelope was silent by then). The full
  64-reg-event cut renders clean at peak .54 — the longer tails don't push the
  mix into clip. Doc strings (top-level + group) updated: "bloom in softly and
  sustain … pressed and held, not struck."
- **FIG I is now the full set, and the other pipes animate like the chanter.**
  Was just the chanter maker's-plate. Now, left→right off a shared stock rail:
  the **chanter** (unchanged — holes still fill with the fingering), three
  **drones** (DORDÁIN — graduated pipes with tuning-slide ferrules + end beads;
  a cane glow that **breathes** with the bag LFO and each drone's own slow
  level-sway, plus a bright "column of air" bead riding the wobble; lit only
  while playing + `bor` on), and three **regulators** (RIALTÓIRÍ — keyed pipes
  whose body + keys **flare cane** on each chord strike and **decay over the
  audio release**, `rel`+0.18; lit only while playing + `rgl` on). Note readout
  moved to the **top-right** header (was mid-plate) — deliberately right, not
  left, so the `position:sticky` exit pill can't cover it. Layout is a fraction
  of `chW` so it holds in both the wide (desktop, FIG I ≈34 % strip) and
  stacked (mobile, full-width) figures — screenshot-checked both.
- **Plumbing:** reg strikes were excluded from the UI queue; added a parallel
  `live.regQ` (drained in `loop()` into `regAnim[3]={t,vel}`), reset in
  start/stop. `drawHash` gets a `Math.round(ctx.currentTime*12)` term **only
  while playing and motion allowed**, so the canvas redraws ~12 fps for the
  breath/flare and still sleeps when idle. `prefers-reduced-motion`: drones
  sit steadily lit (no breath/bead motion), no anim tick — verified the RM
  path renders clean.
- **Verify** (`scratchpad/verify-bolg.mjs` + `verify-cut.mjs` + `verify-rm.mjs`,
  playwright-core + bundled Chromium at `chromium-1194/.../chrome`, launched
  `--headless=new` — the 1.48 default `--headless=old` is gone from this binary;
  headless_shell still crashes per the RILLE note, so use full chrome). All
  pass: schema well-formed, offline reg-voice + full cut NaN-free/no-clip, live
  play shows drones=3/regs=3 and reg flares firing, zero non-font page errors,
  both layouts + RM screenshot-checked. Scratchpad not committed (GONGAN/TESSERA
  precedent).
- **Deferred (maintainer, same message):** a *guitar* strum in **HOLLER** (make
  it strum instead of all strings at once) — explicitly "save that for later,"
  untouched here. BOLG has no guitar; the only chordal voice is the regulators.
- **Pick-ups:** the drone "column of air" bead drifts very slowly (0.07–0.11 Hz)
  — fine as ambient life, could tie to the bag rate if more motion is wanted;
  the regulator→pipe mapping lights all three pipes together on a strike (a
  wrist chord), not per-note — per-pipe by pitch is possible if the maintainer
  wants each reg to speak its own note.


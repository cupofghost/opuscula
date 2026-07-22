# tambour — session threads

Development history for the `tambour/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### TAMBOUR — playback fixes + battlefield graphic
**Branch:** `claude/project-working-conventions-hlurpe` · **File:**
`tambour/index.html` · **Status:** done, verified headless (Chromium); on `main`.

Two rounds of maintainer feedback after the op. XIII drop.

**Round 1 — sound.**
- *Clairon was Casio-ish:* rewrote `synClaironNote` from a static sine stack to
  a dynamic brass model — upper partials **bloom in over the attack** (a
  brightness envelope), a breath chiff on the onset, a ~1 kHz formant. That
  spectral motion is the brass cue. Also pulled it back (gain .50→.30).
- *Snares should cut through / "lots of drummers":* the snare is now a **section**
  — `SECT` trebles the caisse claire and doubles the roulante at mix time, each
  copy spread a few ms + across the pan field with a different kit variant and
  seeded jitter (`sRng`). Measured: claire is the loudest voice in the mix
  (peak 2.95 vs clairon 0.12).
- *Patterns just repeated one bar:* calls are now genuinely varying **4-bar**
  phrases (2/4→32 steps, 6/8→24). `'|'`/space bar separators stripped at parse;
  `steps`/`spb`/`beatsPerBar` **derived from the pattern length** at load (see
  the `for(k in CALLS)` block). Tablature draws per-beat + per-bar gridlines.

**Round 2 — the battlefield graphic (the fun one).**
- The `<canvas>` now has **two views**, a `viewMode` toggle (`♪`/`⚔` button on
  the plate): the drum **tablature** (`drawScoreView`, the old view) and a
  side-scrolling **battlefield** (`drawBattle`, a toggle; `viewMode` defaults to
  `'score'`).
- **The march drives a battle.** `buildPulse` bins one phrase's events into a
  PULSE (grosse+snare+cymbal coincidences = the big spikes, "the march hitting
  just right"). `frenchQuality` scores the march from state (cadence bell-curve
  peaked at **120**, ensemble fullness with the **snare worth half**, industrie,
  fantaisie) ≈ 0..1. `battleStep` integrates a **tide** ∈ [-1,1]:
  `push = fq * pulse * 3.4`, `foe = enemy.strength * 0.50`, `tide += (push-foe)*dt*0.5`.
  **Tuning is deliberate — a full on-cadence march wins vs all enemies, a plain
  march beats Spain/Austria but stalemates Russia, a snare-muted/off-cadence
  march is routed. Don't rescale one constant without re-running `scratchpad/sweep.mjs`.**
- **Armies:** `FRENCH` (left, bleu-blanc-rouge) vs `ENEMIES[st.enemy]` (right;
  dropdown `#enemy`, `ENEMY_ORDER` = prussia/britain/russia/austria/spain, each
  a coat/cuff/hat/plume + flag + strength). Figures (`makeArmy`): soldiers +
  a **drummer & bugler (music guys)** + a **flag bearer**, two rows. `modeFor(tide)`
  → advance / hold / **retreat = about-face** / **rout = scatter-and-run**
  (`fig.runX` integrates away from the front). Ground scrolls (`BATTLE.scroll`,
  a marching treadmill + advance bias); French drummer's sticks fall on the
  snare pulse. **Enemy music is a future addition** (their side pushes at a flat
  rate for now — the hook is `enemy.strength`).
- State: `st.enemy` in hash as `en`; `viewMode` is a view pref (not hashed).
- **Verify:** `scratchpad/verify.mjs` now also asserts France advances vs a weak
  enemy with a good march, the snare-mute quality drop, and the view toggle;
  `scratchpad/sweep.mjs` prints the tide outcome per enemy for good/mid/weak
  marches (the balance table). NB: the model-enum section leaves claire+grosse
  muted (mask round-trip) — the battle section resets mutes first.

### TAMBOUR — new machine, op. XIII (French military field drum)
**Branch:** `claude/project-working-conventions-hlurpe` · **File:**
`tambour/index.html` · **Status:** done, verified headless (Chromium). New op.
Registered in `index.html` (card), `README.md` (row), and the file-structure
list above; counts bumped twelve → thirteen everywhere.

An archetypal European war-march engine — snare-focused, martial-industrial,
French mother tongue. Built on the FOLI skeleton (prerendered kit → one master
buffer → realtime loop + offline WAV, identical graph). Design:

- **The law is the call.** Eight *batteries d'ordonnance* (`CALLS`, order in
  `CALL_ORDER`): la-marche, la-générale, la-charge, le-rappel, la-retraite,
  aux-champs, le-ban, la-breloque. Each fixes token patterns per voice over a
  step grid — **2/4 → 16 steps, spb 4** or **6/8 → 12 steps, spb 3**, always
  four walking beats to the phrase. `bpm` is the *cadence* (pas/min), the bass
  drum falls on the foot.
- **Rudiment token language** (`parseVoice`): `.` rest · `o` tap · `O` accent ·
  `f` flam (fla) · `d` drag (ra) · `r` roll unit. Runs of `r` collapse into one
  buzz roll resolving on the next stroke (`emitBuzz`, ~24 ms overlapping soft
  strokes, velocity swelling). Bass/cymbal use only `.`/`o`/`O`.
- **The machine composes the snare's ornaments** (`ornaments`, Fantaisie 0..3):
  drags ahead of accents, ghost taps in gaps, roll fills at phrase ends — a full
  flourish every 4th phrase. Seeded, so it round-trips in the hash.
- **Voices** (`VOICES`, = lane order + mixer): clairon · caisse claire (the
  star) · caisse roulante · grosse caisse · cymbales · enclume (anvil) · bourdon
  (steel drone). Snare = two membrane modes + a rattle of one-pole-highpassed
  noise for the wires; field drum = membrane, snares off; bass = deep membrane +
  beater click; cymbals = decaying metal noise + shimmer; anvil = inharmonic
  metal; **clairon = additive brass locked to partials of `FUND` (116.54 Hz,
  B♭) — a valveless bugle, notes are integer partials only**, synthesised
  per-note in `renderMaster` (durations vary).
- **Industrie 0..3 (`st.industrial`)** is the martial→industrial slide:
  `DRIVE_CURVE` (tanh waveshaper in `buildGraph`, harder each level) + the anvil
  doubling hard accents (`anvilCells`) + the bourdon. **Bourdon gotcha:** it's a
  continuous drone laid in *after* the loop-fold, its component freqs snapped to
  integer multiples of `1/oN` (`m=round(f*oN/SR)`) so it is **perfectly
  seamless** across the loop point — do not add it before the fold or it doubles.
- **Negative-time gotcha:** a flam/drag/ornament grace before the phrase-head
  downbeat rounds below 0; `push` clamps `t` to `≥0` (and `mixHit` guards
  `off<0`). Don't remove either.
- **Canvas is a tablature, not a wheel:** one lane per voice, rudiment glyphs
  (accent = tall capped bar, tap = short, flam/drag = grace ticks, roll = hatch
  band + bracket, bass = block, cymbal = burst, anvil = diamond, clairon = bar
  at partial height, bourdon = band), L/R foot markers under the axis, a red
  playhead. **Static score cached to an offscreen canvas (`oc`/`buildScore`);
  only the playhead + glow redraw** — cheaper than FOLI's per-frame ring.
- Mixer greys out (`.na`) clairon on calls with no bugle, and enclume/bourdon on
  Parade (industrial 0) where they're silent.
- **Verified headless** (`scratchpad/verify.mjs`, playwright-core + the bundled
  Chromium): all 8 calls parse to well-formed events (snare-dominant, rolls
  present, clairon partials in 2..8, no time past end), realtime context runs,
  offline cut renders, `renderMaster` is deterministic and non-silent (peak 0.9,
  RMS ~0.12). The only console error is the Google-Fonts CDN failing under the
  proxy — environmental, same link every machine uses, harmless serif/mono
  fallback.
- **Pick-up ideas:** the calls are idiomatic arrangements, not a claim to one
  authoritative score (stated in the reader notes) — a stricter transcription of
  a specific ordinance is possible. A "fifre" (fife) melodic voice over the
  drums, or a per-call default industrial level, are natural next steps.


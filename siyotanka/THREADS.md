# siyotanka — session threads

Development history for the `siyotanka/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### ŠIYÓTȞAŊKA — brought up to house standard (shell re-skin, op. XXV unchanged)
**Branch:** `claude/lakota-flute-standardization-qub4qd` · **File:**
`siyotanka/index.html` only (full re-skin, ~50%+ changed, so emitted whole).
**Status:** done, verified headless (Chromium/playwright, 36 checks, zero
page errors; scratchpad `verify-siyotanka.mjs`, not committed). No registry
changes — same title, op. number (XXV), concept, TIMBRE id and schema; the
landing card / README row / officina chip / file table all still describe it
correctly. Maintainer's ask: "bring the Lakota flute up to the standard of
the rest of the machines, use DIAMOND as an example." The *engine* (the law
+ synthesis) was already sound; the *shell* was well below house grammar.

- **Adopted the house shell verbatim-in-grammar (DIAMOND/FADÓ):** full head
  metadata (viewport-fit, color-scheme/theme-color, apple-web-app tags,
  icon.svg + preconnect + the Cormorant SC / EB Garamond / IBM Plex Mono
  fonts); the `.pit` framed card; the sticky `.exit` + fixed `.bench` chips
  (bench now points at `../officina/#m=siyotanka`, was the malformed
  `?bench=` form); the `eyebrow / h1 / sub (bold lede) / credit` header
  anatomy; the `.plate` canvas with corner `.tag`s (SCALE · <mode> / status);
  `.pick` Play+Pause buttons, chip selectors for Scale & Key, labelled
  sliders for Pace & Song, dashed `.cut` + `.cutnote`; the rich collapsible
  `.reader` (8 h4 sections — Densmore, the terraced descent, the tuning
  hedge, etc.) replacing the thin open panel; the `.foot`; and a READER'S
  GUIDE comment block. **Went dark-only** (`color-scheme:dark`) like the
  reference machines — the old light-mode `@media` is gone; siyotanka's own
  ochre `--accent #d98a3d` / turquoise `--sky #4fb3a3` palette on warm brown
  `--ground #17110c` is now the single voice.
- **iOS audio + robust save added (were entirely missing — it was the only
  machine of 26 without `__iosAudio`):** the standard `__hint`/`__iosAudio`
  playback-session unlock (attached once when the persistent `ac` is created),
  and the shared tappable-pill `saveWav(blob,filename)` replacing the bare
  `a.click()` download (the encoder itself kept, refactored to
  `encodeWavBlob`). `cut()` now shows "cutting…"/result in the `.cutnote`.
- **Two real defects fixed while re-skinning:**
  - *Looping was broken.* The lap-boundary timer called `play()`, but
    `play()`'s `if(st.playing)return` guard fired first, so a verse never
    re-improvised past the first. Restructured into `play → startLap →
    nextLap` (nextLap bypasses the guard); verified the lap counter now
    advances (verse 1 → verse 2 …). Also made the boundary timer
    **pause-aware** — it now stores remaining time against `ac.currentTime`
    at pause and reschedules on resume, instead of a wall-clock `setTimeout`
    that drifted while suspended.
  - *Offline renders were non-deterministic.* `voice()` drew the per-note
    breath `playbackRate` from `Math.random()`, so no two cuts of the same
    seed matched. Now seeded: `genAll` attaches a per-note `jit=rng()` that
    voice() consumes. Two cuts of a seed are byte-identical within ±1 LSB
    (the residual 190-ish/2.67M samples at maxΔ=1 is Chromium's
    OfflineAudioContext convolver+compressor denormal noise — present in
    every machine with a reverb, not a seeding gap; the score `genAll` is
    exactly byte-identical).
- **Controls note:** the old visible **seed slider was dropped** in favour of
  the house pattern (seed lives in the hash + `r`/Another), matching DIAMOND/
  FADÓ. Scale/Key moved from `<select>`s to chip rows. Pace/Song sliders kept,
  now with word readouts. Hash schema unchanged (`s/sc/k/p/o`), so old links
  still resolve.
- **Canvas** kept the flute-schematic + terrace-trace but rebuilt in the
  plate: added the right-hand **scale ledger** (five degrees as exact ratios,
  tonic in turquoise, the sounding degree boxed — the diamond "data on the
  canvas" move), a live pitch readout in the lane, register chevrons for
  overblown octaves; `prefers-reduced-motion` freezes the scroll. `drawStatic`
  on idle/stop.
- **Verified:** clean load; genAll deterministic per seed / differs across
  seed+lap / ends on tonic / monotonic / NaN-free / ≥6 pitches; Mode-1 JI
  cents exact (6/5, 4/3, 3/2, 9/5) and the neutral 11/9≈347.4¢; ladder
  register-fold exact; play/pause/resume/stop + nextLap loop; offline render
  stereo/non-silent/deterministic(±1 LSB); hash round-trip; OFFICINA bench
  schema (6 groups / 16 params), live `set`, `bulk` reset-then-apply,
  localStorage overlay, `?factory` bypass. Screenshot-checked idle + playing.
- **Pick-up ideas (unchanged from the build thread below):** a real six-hole
  cross-fingering chart; a second Plains melodic form; a double-flute drone
  variant; a distinct overblown-octave timbre. Still deliberately solo.

### ŠIYÓTȞAŊKA — new machine, op. XXV (the Lakota courting flute)
**Branch:** `claude/native-american-music-machine-og4kk6` · **File:**
`siyotanka/index.html` · **Status:** done, verified headless (Chromium, 34
checks, zero page/console errors). New op. Registered in `index.html` (card +
counts), `README.md` (row + count), `officina` (chip), `CLAUDE.md`/this file
(file table + counts); counts bumped twenty-four → twenty-five everywhere
(and the stale "twenty-one" prose lines in `index.html`'s `.sub` + authoring
comments and `README`'s intro corrected to twenty-five in the same pass).
**Renumbered twice at landing, XXIII → XXIV → XXV:** RICERCAR landed as op.
XXIII, then SVARA landed as op. XXIV, both while this was in flight — per the
claiming-by-landing rule this took the next free numeral each time; the
directory name (`siyotanka`) keeps, only the op. number moved. Resolved on
two successive rebases (all threads kept, all cards/rows/chips preserved).
Maintainer's brief: a new machine based on Native American music, a
well-documented tribe, bonus for accurate tuning. One-session build (design +
implement + verify + register), full autonomy.

Answered with the **Plains/Lakota courting flute** (*šiyótȟaŋka*, the "big
prairie-chicken flute") — one of the best-documented Native instrumental
traditions (Frances Densmore, *Teton Sioux Music*, 1918), and the choice that
gives a real **tuning** story: an instrument whose fingering maps to a
pentatonic scale I can state as exact ratios, rather than an oral vocal
tradition with no fixed temperament.

- **The law is the tuning + the fingering.** Three pentatonic scales as exact
  JI ratios over one chosen key: **Minor pentatonic (Mode 1)**
  `[[1,1],[6,5],[4,3],[3,2],[9,5]]` (the traditional/default fingering);
  **Neutral third** swaps 6/5 (316¢) for **11/9 (≈347¢)** — the flat/neutral
  third that measurements of *old* hand-made flutes often show, a genuinely
  documented characteristic, not an invention; **Major pentatonic (Mode 4)**
  `[[1,1],[9,8],[5,4],[3,2],[5,3]]`. Five keys (D/E/F♯/G/A) name the root
  note; the fundamental is one Hz literal per key and every degree above it is
  an exact ratio, so the intervals stay just. Honestly hedged in the reader:
  a Plains flute is hand-made, never equal-tempered, no two alike — the
  machine renders the *mode* in exact JI, and the fingering diagram is a
  schematic ("more holes open, higher"), not one flute's chart.
- **Melodic law = the terraced descent** (the Plains "tumbling strain"). A
  verse is 3–5 free-rhythm phrases; each optionally arcs up to a seeded peak
  (a fifth to an octave-and-a-third above the root) then *terraces down* in
  scale steps to a long-held tonic, with lingering upper-neighbour
  oscillations. Grace notes and "bird" trills are sprinkled by the **Song**
  slider (the law, in the UI — how *many* ornaments), while their *voicing*
  (grace length, trill rate) lives in TIMBRE. **Pace** sets seconds-per-unit
  (how the flute breathes). Verified: verses always end on the tonic;
  deterministic per seed; ≥6 distinct pitches; times monotonic; NaN-free.
- **Synthesis (no samples):** one woody duct-flute tone (a `PeriodicWave`
  harmonic profile through a brightness lowpass), a **breath-noise bed** gated
  to each note (bandpassed white noise), an **attack chiff** (the airstream
  striking the fipple), gentle **finger-vibrato** that blooms after an onset
  delay, a faint **prairie-wind bed** (looping noise → LFO-swept lowpass), and
  an **open-air reverb** (seeded exponential-noise IR, stereo). Master
  limiter holds peak ≤ 1 (offline render peak ≈0.82, rms ≈0.26, NaN-free).
- **Transport = looping verse** (FADÓ precedent): `play()` builds the graph,
  generates + schedules one verse, and a timer re-improvises the next lap
  (which is where a scale/key/pace change re-vibes) — the inter-verse gap
  reads as the player taking a breath. Live TIMBRE: master/flute level, room
  send, and the wind bed ride live; the rest is baked per note (next
  verse/Play). `► HEAR` starts the transport if idle (continuous family).
- **Canvas:** a schematic flute across the top, its six holes filling for the
  sounding note's fingering (far holes open first; register chevrons for
  overblown octaves), over a scrolling **terrace-trace** of the melody with a
  gold/turquoise tonic marker and a live ratio/cents/Hz readout. Static layer
  on stop; `prefers-reduced-motion` freezes the scroll. Palette: red-earth
  ochre `--accent #d98a3d` + prairie-dusk turquoise `--sky #4fb3a3` on warm
  brown; card `--bg #17110c`, emblem a holed flute with rising "song" arcs.
- **TIMBRE:** 16 params / 6 groups (master, flute, vibrato, ornament, wind,
  room). Bridge verbatim (copied from FADÓ/FORFEX); `TIMBRE.touch` ramps the
  live params, `TIMBRE.demo` starts the transport.
- **Verified headless** (`scratchpad/verify-siyotanka.mjs`, playwright + the
  full chrome binary `chromium-1194/chrome-linux/chrome`, `--headless=new`;
  scratchpad not committed, GONGAN/TESSERA precedent): schema well-formed
  (16 params); Mode-1 ratios exact and the JI thirds/fifth land on the right
  cents; ladder register-folding exact (root=fund, octave=×2, fifth=3/2);
  genAll deterministic + differs across seeds + ends on tonic + NaN-free;
  offline render NaN-free/non-silent/≤1/stereo; live play/pause/resume;
  live TIMBRE touch reaches the graph; hash round-trip; OFFICINA bench schema
  announce + set + bulk (reset-then-apply) + localStorage overlay + `?factory`
  bypass. Screenshot-checked (flute + holes + terrace-trace render on theme).
- **Pick-up ideas:** a real six-hole cross-fingering chart (the current
  diagram is a schematic); a second documented Plains melodic form beyond the
  terraced descent; a low-drone "double flute" variant (some Plains flutes
  are doubles); the octave could overblow with its own timbre shift rather
  than the same tone up a register. Deliberately kept **solo/unaccompanied**
  (no drum) — that is how the courting flute was actually played.


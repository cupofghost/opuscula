# diamond — session threads

Development history for the `diamond/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### DIAMOND — new machine, op. XV (Harry Partch's tonality diamond)
**Branch:** `claude/new-machine-concept-uap0bi` · **File:** `diamond/index.html` ·
**Status:** done, verified headless (Chromium). New op. Registered in
`index.html` (card + counts), `README.md` (row), `officina` (chip),
`CLAUDE.md`/this file; counts bumped fourteen → fifteen everywhere.
`diamond/GENESIS.md` (the design brief) deleted per its own instruction —
this thread is the fold-in.

A design-then-implement session: op. XV conceptualized with full creative
freedom (just intonation, otherwise open), written up as a self-contained
brief (`GENESIS.md`, RILLE/HARMONIA precedent), then implemented in the
same session against that brief. **Harry Partch's tonality diamond** —
chosen over raga, Kepler's *Harmonices Mundi*, barbershop, alphorn
(rejections argued in the deleted brief) because it adds the JI *system*
(American experimental line, absent from the catalogue) and **utonality**,
the subharmonic mirror no existing machine touches.

- **Zero ET anywhere** — the first machine with no `mtof` at all. Ratios
  stay integer `[num,den]` pairs end to end (`fold`/`diamondCell`); the only
  Hz literal is `392` (Partch's G, `f = 392 × num/den × 2^k`). Diamond
  matrix, unique-tone counts and root tables verified exactly against the
  brief's hand-derived tables (7/13/19/29 tones at limits 5/7/9/11).
- **The law is the circuit** (`genAll`): a seeded weighted Hamiltonian walk
  of the complete bipartite otonality/utonality graph — every one of the
  2n tonalities visited **exactly once**, strictly alternating (forced by
  the graph, not legislated), starting and ending on **O1** (the plain
  harmonic series). Each step is a weighted pick favouring small-ratio
  (consonant) root moves (`ratioWeight` — weight ∝ 1/(num·den) of the root
  interval). The closing edge — last utonality → cell(o,1) → O1 — always
  exists by construction.
  **Pivot audibility is tautological by construction**, not a runtime
  check bolted on after: `assemble()`'s Cloud-Chamber Bowl ring at
  station *i*'s final bar is `pivots[(i+1)%2n]`, and station *i+1*'s
  Harmonic Canon forces that same tone as its first note — both read the
  same `pivots[]` array, so they can't drift apart.
- **Six of Partch's instruments, synthesized** (`SYN_FN`): Marimba Eroica
  (root on every group-head, arch-cut bar model), Kithara (Karplus–Strong,
  warmed, gliss-strums the tonality at arrival), Harmonic Canon
  (Karplus–Strong double course, seeded stepwise ostinato that mutates one
  step per bar-repeat, density rising toward the station's end), Diamond
  Marimba (a 6(n)-stroke sweep at arrival + sparse off-beat strikes), Boo
  (bandpassed-noise patter alternating the tonality's two highest tones),
  Cloud-Chamber Bowls (detuned beating pair + inharmonic partials, long
  ring). Each voice folds into its own fixed Hz register band
  (`REGBAND`: eroica 49–98 · kithara 98–196 · canon 196–392 · marimba/
  bowls 392–784 · boo 784–1568). Additive meters (PULSE 5/7/9 = 2+3 /
  2+2+3 / 2+2+2+3), dry room send (`wet` default .08 — corporeal, not
  cathedral).
- **Controls:** LIMIT 5/7/9/11 · FLUX linger/walk/storm · LEAN
  utonal/even/otonal (station-bar table `STATION_BARS`; default UTONAL —
  RILLE's rationed-resolution taste made structural: the walk dwells in
  the dark utonalities and passes briskly through the bright) · PULSE
  5/7/9 · TEMPO 200–340 eighths/min. No mixer/mute row — the brief's
  explicit simplification, "the diamond is the interface." GONGAN-family
  skeleton: `genAll`→`assemble`→`renderMaster` (bake-per-(voice,ratio)
  kit, `mixHit`), realtime loop + identical offline WAV cut, loop-fold
  (`renderMaster(true)`) wraps the tail — including the final exit-pivot's
  bowl ring — back over the head, so **the WAV literally starts on the
  homecoming bloom**, no special-casing needed.
- **Canvas:** left, the diamond lattice rotated so the unity diagonal runs
  horizontal (`x=(i+j-(n-1))·DX, y=(j-i)·DY` — the classic Partch layout),
  active tonality's row/column lit and swept at arrival, pivot cell
  pulsing on the final bar, visited diagonals left faintly warm (cleared
  on a new lap). Right, the itinerary: one row per station (O/U glyph,
  root ratio, bridging pivot between rows), home ringed, current station
  boxed. Static layer cached offscreen, rebuilt on station change;
  `prefers-reduced-motion` disables the sweep/pulse animation.
- **TIMBRE:** 42 params in 8 groups (master/room/eroica/kithara/canon/
  marimba/boo/bowls — no separate mixer group, each voice's own `level`
  serves that role). Master out-trim/room-wet/limiter-ceiling ride live;
  instrument edits debounce a rebake (► HEAR convention, no mid-circuit
  restart). Bridge verbatim incl. `TIMBRE.demo` (per-voice auditions).
- **Master chain — de-fuzzed (maintainer: "too distorted").** The first
  cut leaned on a hard `tanh` shaper (`drive` .28) for loudness, which
  fuzzed the whole mix and squashed the dynamics flat. Reworked to
  **shaper (drive .06, warmth only) → glue comp (2.4:1) → brick-wall
  limiter (`limThresh` −1.5 dB, knee 0, ratio 20 — the GONGAN limiter
  precedent) → out trim**; reverb sums pre-limiter so nothing bypasses the
  ceiling. Measured on a fixed pressing: shaper deviation-from-linear
  **70.8 % → 15.1 %**, crest factor **1.99 → 3.66** (the struck bronze
  rings proud again instead of buzzing), output peak 0.76 (limiter holds,
  no clip). The metallic character is pure synthesis (inharmonic bars/
  bowls) and was never the shaper — only the fuzz was removed. `drive` is
  still exposed in officina for anyone who wants the grit back.
- **Verified headless** (playwright + bundled Chromium, run from session
  scratchpad, not committed — matches the GONGAN/TAMBOUR precedent of
  scratchpad tooling): diamond tables/unique-tone-counts/roots exact
  against hand-derived brief tables; journey law swept 4 limits × 3 flux ×
  3 lean × 12–25 seeds (900+ pressings) — alternation, every-tonality-
  once, O1-only-at-station-0, pivot membership, correct closure, station
  lengths all hold; frequencies land in-band and match `392×ratio` folded
  exactly; `renderMaster` deterministic, NaN-free, peak-normalised, loop-
  fold head energy present; every voice non-silent solo; realtime context
  runs; hash round-trips; offline WAV cut clean; OFFICINA schema/set/bulk
  round-trip; zero pageerrors (only the pre-existing Google-Fonts-under-
  proxy console noise every machine hits, per the TAMBOUR/GONGAN
  precedent). Screenshot-checked live render and `another()`/`TIMBRE.demo`
  exercised across all 8 groups with zero errors.
- **Pick-up ideas** (carried from the brief): the full 43-tone Monophony
  scale as a secondary mode; a *Barstow*-style speech-rhythm cantus on the
  Canon; a Quadrangularis Reversum canvas easter egg; per-side pulse
  flavors if the single meter reads flat. Kepler's *Harmonices Mundi* was
  the strongest rejected alternative — a candidate for a future op.


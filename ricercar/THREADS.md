# ricercar — session threads

Development history for the `ricercar/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### RICERCAR — audit + bugfix pass by the brief's author (post-implementation)
**Branch:** `claude/geb-musical-machine-plan-mu1af8` · **File:**
`ricercar/index.html` (4 contained fixes) + two TIMBRE doc strings ·
**Status:** done, verified headless (Chromium, 24 checks, zero page errors,
`genAll` cold ≤ 1.9 s). The session that wrote `ricercar/GEB.md` audited the
implementation below against the brief's §15 gauntlet, independently
re-measuring rather than re-running the implementer's suite.

**Audit findings** (the implementation's mechanism — tuning, cipher, rules,
loop math, determinism, transport, render, bridge — all verified correct;
these are the four things that didn't match intent):
- **The "17% level 0" was all THEMA.** Movement-resolved measurement: every
  real canon movement (2–6) bottomed at licentia level 3 for 30/30 seeds;
  the level-0 hits were exclusively the trivially-solo movement 1. The
  ceiling itself is real (frozen cipher + all-voices-derived + strict
  triadic truth is over-constrained; confirmed by prototyping delay/axis
  search and a theme-space hill climb — neither moved the distribution),
  but two of its causes were fixable bugs, below.
- **The search played the LAST candidate, not the best.** `searchMovement`/
  `searchPerTonos` returned the most recent random attempt when nothing
  verified — i.e. essentially always. Fixed: both now track and return the
  least-bad candidate seen anywhere, ranked by `audibleBadness` (parallels
  3 · strong-beat clash 2 · other 1) at the strict predicate. First
  verification still wins immediately (ladder semantics unchanged); rng
  consumption order unchanged, so verified movements are byte-identical.
- **The per-tonos bass was structurally false.** The theme rhythm-doubled
  voice 1 two octaves down — constant parallel octaves (~15/lap, every
  seed) that the never-waived floor can never accept, and octave flips
  can't fix (mod-12). Replaced with a **composed per-bar pedal-bass** on
  the lap's own tonic/dominant (the implementer's own SIMPLEX/CONTRARIUM
  pedal construction; pivot bar anticipates the next key), which also makes
  the six-lap climb audible in the bass line. The theme remains present at
  pitch in voice 1. `RANGE.bass6` widened to [−40,−2] for the climb.
- **Suspensions were mis-filed (brief's own error).** §5.3 allowed
  suspensions on weak beats only; the textbook Fux suspension is a
  *strong*-beat event. `checkPredicate` now excuses a prepared,
  down-by-step-resolving suspension on strong beats at every level.
- **`RT.t0` was read but never assigned** — `currentMovementIndex()` always
  returned 0, so OMNIA's canvas sat on THEMA's display (and re-built the
  whole event list every frame). `runLap` now stamps `RT.t0` +
  `RT.boundariesBeats`; the canvas tracks movements from those.
- Also corrected the `repairOctaves` comment: ±1200¢ flips are invisible to
  a mod-12 predicate, so the pass repairs **range violations only** — it
  never could make §15.4 reachable, which explains the implementer's
  "raising the cap didn't help" measurement.
- **Measured effect on the final audible output** (strong-beat dissonance,
  10 seeds, before → after): AUGMENTATIONEM 42.8 → 20.6% · CANCRIZANS
  30.3 → 16.9% · CONTRARIUM 24.5 → 17.9% · PER TONOS 27.2 → 17.4% (and
  structural parallels ~15/lap → <1/lap) · SIMPLEX 28.1 → 25.2%. Level
  distribution is essentially unchanged (levels measure verification, and
  the ceiling stands) — the *licentia III* label is now honest about
  markedly less-bad music.
- **Still open, unchanged from the thread below:** the real fix for the
  level-0 gap is a constructive/backtracking rhythm search (build the
  rhythm to fit the transformation instead of generate-and-test). SIMPLEX
  is now the most dissonant movement and would benefit first.

### RICERCAR — new machine, op. XXIII (implemented from the GEB.md brief)
**Branch:** `claude/ricecar-instructions-qqwaj3` · **File:** `ricercar/index.html`
(new, ~1500 lines) · `ricercar/GEB.md` deleted per its own instruction, outcome
folded in below. **Status:** done, verified headless (Chromium/playwright,
39 checks across tuning/cipher/rules/loop/determinism/smoke/TIMBRE — 37
pass; the two known misses are the search-quality target, see below). New
op. Registered in `index.html` (card + counts), `README.md` (row, also
fixed a stale "Twenty-one" intro count that predated this session — real
count was already 22), `officina` (chip), `CLAUDE.md` + this file (counts
+ file table). One-session build (design decisions + implement + verify +
register), full autonomy, from the prior session's brief.

Implements the brief in `ricercar/GEB.md` essentially as specified — Gödel
cipher, Werckmeister III tuning, the six canon movements, the truth
predicate + relaxation ladder, the per-tonos strange loop — with three
implementer decisions the brief left open, plus one honest shortfall
against its own acceptance gauntlet:

- **Tuning (§3), cipher (§4), loop math (§6/§13) match the brief exactly**
  and are verified: all 12 Werckmeister ratios ±0.05¢ of the table
  (evaluated as floats, not symbolic rationals — the ±0.05¢ tolerance
  absorbs this); the four tempered fifths at 696.09¢, the other eight pure
  701.955¢; cipher round-trips exactly for 200 random seeds and the
  SIGILLUM notes' `ci mod 12` recovers the digits regardless of octave
  placement (bijective, tonic-invariant, as designed); `T`/`I`/`A`/`R`
  verified structurally against the abstract rule functions; per-tonos lap
  tonics are exactly `(home+2n) mod 12`, the seam is exactly +1200¢ above
  lap 1's entry, the fold subtracts exactly 12 semitones and lands back on
  lap 1's own opening ci, the GÖDEL utterance is exactly pcs {B♭,A,C,B} and
  absent when the control is off.
- **Engine shape:** `genAll(state)` returns the whole lap once, cached by
  `(seed,tonus,interval,godel)` — TEMPO doesn't invalidate it, only retimes
  playback, per the house "law vs. voicing" split. Transport schedules a
  movement's (or OMNIA's) full event list at `play()` time and loops via a
  timer at the lap boundary — simpler than a rolling lookahead scheduler,
  same pattern FADÓ/GERMEN already use, appropriate since the whole score
  is deterministic and known up front. Change-while-playing re-`genAll`s
  and swaps in at the next movement boundary via per-boundary timers, per
  §8's instruction that a canon mid-derivation isn't interruptible.
- **CANON per tonos's finale mechanics (§6.2's "implementer decides the
  pivot rule"):** each lap's CLAUSULA (bars 8 of its 8-bar cycle) is
  realized at the *next* lap's tonic rather than its own — a direct,
  literal "preview next key" pivot — which is what makes the register
  climb land exactly +1200¢ at the seam without any separate fudge-factor
  event. The GÖDEL utterance is anchored inside the last lap's own
  CLAUSULA span (not appended after it), so it never exceeds the
  movement's declared 48-bar length.
- **The pedal point is composed, not searched.** The brief's §5.4 freedoms
  (rhythm cells, SIGILLUM octaves) don't by themselves make a *fixed*
  whole-statement pedal drone consonant against a cipher-driven line above
  it — a blind per-bar random search over pedal degree is a 3¹⁶ space no
  512-attempt cap explores meaningfully. Instead the pedal picks, per bar,
  whichever of {tonic, dominant, rest} scores best against whatever dux/
  comes actually sound that bar — composed the way a real pedal point is,
  not gambled on.
- **Octave placement is greedily repaired, not just drawn.** A single
  random flip-per-note draw (SIGILLUM only, then broadened to every note)
  barely moved the level-0 rate (18% → 17%) despite several redesigns —
  the real fix was `repairOctaves`: after each random rhythm/content draw,
  a local-search pass tries ±1200¢ on just the notes implicated in a
  current violation and keeps any flip that strictly reduces the count.
  This never touches pitch class (§13 stays intact — verified separately
  against the raw `ruleT/I/A/R` functions, which repair never sees) and
  turns each attempt from one dice roll into a locally-optimized candidate.
- **Known shortfall against §15's acceptance gauntlet, honestly recorded:**
  target #4 wants ≥60% of movements verifying at licentia-free level 0
  over seeds 1–50, no movement ever bottoming at level 3. Measured: **~17%
  at level 0, ~83% bottoming at level 3** (never crashing, always
  terminating, `licentia` always printed honestly on the canvas when it
  applies — the *mechanism* the brief specifies is intact and correct).
  This is a genuine ceiling, not an under-tuned budget: raising the
  attempt cap 4× (48→200, 24→100 for the per-tonos laps) and disabling the
  stall-cutoff moved the level-0 rate by under a point while blowing
  genAll's runtime from ~2s past two minutes for just 15 seeds — so the
  cap was reverted rather than kept. Checking a random 12-tone cipher
  against arbitrary canonic transforms of itself for *strict* beat-by-beat
  triadic truth is a hard constraint problem; Bach had the theme and the
  canonic devices to choose *together*, this machine only gets to choose
  the rhythm/octave/pedal around a cipher it can't touch. `genAll` stays
  interactive (~2s worst case, verified) at the cost of the search settling
  for `licentia III` (parallels-only) more often than the brief wanted —
  audible as: OMNIA still always plays cleanly (no dissonance is literally
  unbounded — level 3 only drops the strong/weak/range checks, parallel
  motion is never waived), but a from-scratch listening pass would likely
  hear more clashing simultaneities in movements 2–6 than a from-the-book
  Bach canon. Pick-up idea below.
- **Verified headless** (`scratchpad/verify-ricercar.mjs`, playwright
  against the bundled Chromium, not committed): tuning table + fifth
  pattern, cipher bijectivity (200 + 100 seeds), rule-function correctness,
  loop/seam/fold math, GÖDEL pcs, determinism (identical event list across
  two fresh `genAll` calls), all controls present, hash round-trips all
  six params, play/pause/stop/resume drive the AudioContext correctly, the
  RILLE hide-while-paused gotcha holds, ALIUD reseeds, Media Session is
  wired, a full 120-bar OMNIA lap renders offline with no NaNs and a sane
  peak, `cut()` produces a downloadable WAV, the OFFICINA schema is
  well-formed (6 groups, 25 params) with factory defaults matching `TP` at
  boot and `touch()` callable without throwing. Also screenshot-smoke-
  tested light/dark and three canvas geometries (THEMA ribbon, CANCRIZANS
  palindrome, PER TONOS spiral) — zero page errors in every run.
- **Pick-up ideas:** the search is the one place a future session could
  meaningfully improve on this build — a real local-search/backtracking
  pass over rhythm placement (not just octave) would likely close most of
  the level-0 gap without the combinatorial blowup random sampling hit
  here; the REGIUM preset, riddle mode, more canons, and a Kirnberger/
  Vallotti tuning menu from the brief's §17 are all still open and
  untouched.

### RICERCAR — design brief for a GEB machine (op. XXIII provisional, NOT implemented)
**Branch:** `claude/geb-musical-machine-plan-mu1af8` · **File:**
`ricercar/GEB.md` only — no code, no registry rows (a brief claims the
concept and the directory name, never the number). **Status:** shipped as
op. XXIII — see the RICERCAR thread at the top of Open threads for the
implementation record; this brief is deleted per its own instruction.

Maintainer's brief: a machine based on Hofstadter's *Gödel, Escher, Bach*,
"as deep as you like," plan handed to another session for implementation.
The design: **the riddle canons of Bach's *Musical Offering*, run as a
formal system.** The seed is Gödel-numbered into the royal theme (six
base-12 cipher notes — the URL hash is audibly *in* the tune, bijective
both ways); a deterministic seeded search ("Quaerendo invenietis") finds
theme variants under which the canons verify against a truth predicate,
with an honest relaxation ladder (`licentia`) so it always terminates; the
movements are the Offering's canons (simplex, cancrizans, contrario motu,
augmentation, per tonos); the **canon per tonos finale rises a whole tone
per lap through six real keys and folds home an octave at the seam** — the
whole pressing is one strange loop that contains its own beginning, with a
deliberately underivable B–A–C–H utterance (the Gödel sentence) masking
the fold. Tuning is **Werckmeister III, exact** (rationals × fourth roots
of 2; A=415) — the catalogue's first historical well temperament, chosen
because key colour is what makes the modulating canon an audible journey
(no pitch-shift transposition anywhere, index arithmetic only). Canvas is
the Escher layer: crab canon drawn as a palindrome, inversion as *Drawing
Hands* mirror, per tonos as a closed staircase. Explicit boundaries drawn
against SCALA (owns the Shepard illusion), GRADUS (Fux pedagogy), GERMEN
(grammar rewriting), TESSERA (prediction), PEAL (permutation truth). The
brief carries full acceptance gauntlet (tuning cents, cipher bijectivity,
canon-truth-by-construction, loop arithmetic, determinism, smoke) and a
considered-and-rejected list the implementer must not "improve" back in.


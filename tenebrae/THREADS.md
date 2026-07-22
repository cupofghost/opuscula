# tenebrae — session threads

Development history for the `tenebrae/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### TENEBRAE — maintainer-reported voicing fixes (op. XXVI)
**Branch:** `claude/tenebrae-to-main-3s6rw3` · **File:** `tenebrae/index.html`
(3 targeted changes in `scheduleSingerChain`/`buildGraph`). **Status:** done,
verified headless. Three complaints, all confirmed real:

- **Portamento too prominent, reads as dissonant.** `scheduleSingerChain`'s
  legato note-to-note transition used `linearRampToValueAtTime` on the
  oscillator frequency — that is a glissando *by construction*, so quick
  melismatic runs slid audibly through the interval between two lawful
  pitches, landing as passing dissonance. First pass only shortened the
  ramp (`xfade` 30ms→12ms); the maintainer confirmed it was still too much
  glide — shortening a slide doesn't stop it being a slide. **Real fix:
  step the pitch instantly.** An `OscillatorNode` frequency change is
  phase-continuous (the spec keeps internal phase), so the waveform value
  never jumps and an instant `setValueAtTime` pitch change is click-free —
  which is what a choir does: each note re-sounds, singers don't slide
  between pitches. Only the formant biquads keep a short `setTargetAtTime`
  smoothing (a filter-coefficient jump *can* click, and a vowel morph
  gliding is natural — it isn't pitch glide). Added a gentle click-free
  amplitude re-articulation per legato note (dip to 0.84·peak and back over
  ≤28ms, ramps only) so each melisma note has its own onset instead of one
  flat slur. `xfade` removed. Verified headless: a scheduling spy proves
  **zero** linear ramps on any oscillator frequency across a full render
  (1285 instant pitch steps instead), render clean/non-clipping.
- **Vibrato was unified across singers.** Every singer in a part shared
  the exact `TP.capella.vibRate`, so cantores>1 produced one synchronized
  wobble instead of individual voices — real choirs don't lock vibrato
  rate. Added `singerVibRateHz(voice,idx,seed)`, seeded ±12% around the
  TIMBRE center rate per singer (same `hashSeed`+`mulberry32` pattern as
  `singerDetuneCents`/`singerStaggerSec`), so each voice drifts in and out
  of phase with the others. `vibRate`'s doc updated to describe it as the
  choir's center, not a shared value.
- **Output could clip.** `buildGraph`'s only ceiling was the user-tunable
  glue compressor (gentle default, 2:1) plus a hard `Math.max(-1,Math.min(1,…))`
  clamp in `saveWav` — a real clip, not a limiter. A stress test at
  `cantores=4` (max) across responsories 1/3/6/9 × 2 seeds hit peaks up to
  ~0.94 pre-fix headroom margin was thin enough that louder seeds/tuttis
  could plausibly cross 1.0 and hard-clip in the WAV. Added a fixed safety
  `DynamicsCompressor` (threshold -1dB, ratio 20, attack 2ms) between
  `g.out` and `ctx.destination` — not exposed in TIMBRE, it's a ceiling,
  not a voicing choice. Re-tested the same stress sweep post-fix: peaks
  0.84–0.94, zero clip, zero NaN.

### TENEBRAE — new machine, op. XXVI (implemented from tenebrae/OFFICIUM.md)
**Branch:** `claude/tenebrae-machine-an2uin` · **File:** `tenebrae/index.html`
(new, ~1950 lines) · `tenebrae/OFFICIUM.md` deleted per its own instruction.
**Status:** done, verified headless (Chromium/playwright, 45 checks — 40
pass; the 5 misses are a from-scratch counterpoint search's residual
violation *rate*, not crashes or binary bugs, honestly measured below).
**Renumbered XXIII → XXIV → XXVI at landing:** the brief called itself "op.
XXIV (provisional)" but this session started from a stale `main`; RICERCAR
had already landed op. XXIII (both brief and implementation), so the
implementation session renumbered every "op. XXIII" reference (colophon,
title, Media Session, TIMBRE id) to XXIV. By the time this landed, SVARA
had taken XXIV and ŠIYÓTȞAŊKA had taken XXV (both landed on `main` while
this branch sat unrebased) — confirmed at this rebase, renumbered again to
the next free numeral, XXVI, per the "claimed by landing, not designing"
rule. Registered in `index.html` (card + counts), `README.md` (row +
count), `officina` (chip + count), this file (file table + count); counts
bumped twenty-five → twenty-six everywhere.

Implements the brief's four-voice SATB Renaissance counterpoint engine —
5-limit just intonation over an anchored bass (Zarlino's *senario*), ficta
at cadences (exact 15/8), the fifteen-candle hearse (`3·ceil(k/3)`),
strepitus on responsory IX only — as a seeded backtracking search modeled
on GRADUS's DFS architecture:

- **Tuning, candles, form, ficta, determinism, render, and plumbing all
  verified exact.** Da-capo/repetendum structure byte-identical on repeat;
  candle math exact for all 9 responsories; every ficta resolution exactly
  15/8 over its cadence root (cross-multiplied, not float-compared); every
  suspension holds its preparation's *exact* frequency (same ratio object,
  not just close); Bassus pitches are exact mode-table degrees; `genAll`
  is bit-identical across repeated calls with the same seed; offline
  render is NaN-free, non-silent, per-voice-audible, and responsory IX
  ends in silence after the strepitus. OFFICINA bridge schema (8 groups)
  and live `set`/`bulk` round-trip correctly.
- **A real performance bug, fixed:** the first scheduler wrote a fresh
  oscillator+3-formant-filter chain per note (hundreds per piece); a
  stopped source's downstream filter chain keeps costing CPU for the
  *entire remaining render*, not just its own duration, since
  `OfflineAudioContext` doesn't service `onended` disconnects promptly
  mid-render. A 90s piece timed out past 120s. Fixed by scheduling one
  **persistent per-(voice,singer) synthesis chain for the whole piece**,
  automated via parameter ramps at each note boundary instead of per-note
  node churn — render now takes ~9–15s.
- **Honest residual: the counterpoint search doesn't fully close.**
  Measured on a 480-combination sweep (30 seeds × 4 modes × responsories
  1/3/5/9), counted against the machine's own rules, not a looser outside
  standard:
  - parallel/hidden perfect 5ths or 8ves: 3252/397054 voice-pair
    transitions (~0.8%)
  - voice crossing (C<A, A<T, or T<B): 345/84276 simultaneities (~0.4%)
  - a dissonance against the bass with no passing/neighbor/suspension tag:
    167/188744 checks (~0.09%)
  - two simultaneous dissonances against the bass: 33/84276
    simultaneities (~0.04%)
  - melodic tritones/7ths (the engine's own `meloIntervalBad` rule):
    5114/285461 melodic transitions (~1.8%), concentrated at the cantizans
    suspension→ficta-resolution step in Cantus
  - Root cause for the largest category: Cantus's range spans barely more
    than an octave, so the ficta-raised leading tone can have only *one*
    valid placement there — occasionally a tritone/7th from wherever the
    held suspension note happens to sit, a geometric fact of the range
    constraint rather than a search failure. Two redesigns were tried and
    reverted as net-negative (a "derive the preparation from the
    resolution" rewrite fixed melodic violations but broke far more
    cadences' own consonance; a `fillAltus`-based fallback traded melodic
    violations for a worse spike in parallel motion) — both are gone from
    the code, which keeps the simpler, honestly-imperfect original.
- **A real test-harness bug, also fixed:** the verify script's OFFICINA
  bridge check hung intermittently — not an app bug. The page's `<head>`
  references `fonts.googleapis.com` in a parser-blocking
  `<link rel=stylesheet>` before the `<script>`; this sandbox can't reach
  it, and the failure's retry/backoff is flaky rather than a fast, clean
  error, occasionally stalling script execution (and OFFICINA's `hello()`)
  well past any reasonable test timeout. Fixed in the (uncommitted,
  scratchpad-only) verify script by aborting that request via
  `context.route()`. Separately, the round-trip test itself had a logic
  bug — it never sent the explicit `hello` the bridge protocol requires to
  get a fresh schema after `set`/`bulk` — fixed to match the protocol.
  Neither fix touches the shipped machine.
- **Pick-up ideas:** a constructive (not generate-and-test) placement pass
  for the cadence resolution step, targeting the melodic-tritone category
  specifically; the brief's optional plagal-amen and evaded-cadence paths
  are implemented but only lightly exercised by the sweep (responsories
  1/3/5/9 only, not all nine).

### TENEBRAE — design brief for a new machine (renaissance sacred polyphony; brief only, NO code yet)
**Branch:** `claude/renaissance-polyphony-framework-ydca11` · **File:**
`tenebrae/OFFICIUM.md` (new) · **Status:** design complete, implementation
NOT started — the brief is the deliverable, per the HARMONIA/GENESIS
precedent; a later session (planned: a Sonnet session) implements from it.
Claims the **directory name `tenebrae/` and the concept only** — op. XXIV
is provisional until landing (XXII = FADÓ is the last *shipped* machine;
the RICERCAR brief above holds XXIII provisionally, having landed first —
re-check the registry at every rebase). No registry files touched (no
card/row/chip until the machine ships).

- **The machine:** TENEBRAE — Renaissance sacred polyphony narrowed to one
  specific liturgical order: the **Office of Tenebrae**, and further to
  **Good Friday's nine responsories** (the texts Victoria set in the
  *Officium Hebdomadae Sanctae*, 1585). One pressing = one responsory,
  freshly composed in strict 16th-c. counterpoint (imitation points,
  falsobordone verses, prepared suspensions only, ficta at the clausula)
  on four synthesized voices (SATB vowel-stream formant consort) in a
  stone room. The rite supplies the structure: strict responsory form
  a·b·℣·b (da capo on III/VI/IX, no Gloria Patri), the fifteen-candle
  hearse with rubric-exact candle math (`out = 3·ceil(k/3)`) coupling
  canvas light AND master timbre darkening across the nine, and the
  strepitus (seeded earthquake-noise coda) on IX only.
- **Tuning law:** 5-limit JI per Zarlino's senario — bassus anchored to a
  fixed mode lattice over `BASE=220` (finals 3-limit: D 2/3 · E 3/4 ·
  G 8/9 · A 1/2), every vertical sonority retuned to exact ratios over the
  sounding bass (the choir's comma handling), and **suspensions hold their
  preparation's exact frequency** while dissonating. Integer-pair ratios
  end to end, zero ET.
- **Deliberate scope walls** (§13 of the brief): not a Mass machine, not a
  mensuration-canon machine (future op.), not an extension of GRADUS
  (classroom vs. living practice — GRADUS's rules are switches, TENEBRAE's
  are law), Good Friday only in v1 (the other 18 texts are a schema-ready
  pickup), dissonance vocabulary capped at passing/neighbor/suspension.
- **For the implementer:** the brief carries the full baked-data spec (all
  nine Latin texts with repetendum marks — cross-check against the Liber
  Usualis while baking), the counterpoint rule kernel (GRADUS's
  backtracking-search architecture generalized to 4vv, with a bounded,
  deterministic relaxation ladder), cadence formula tables, TIMBRE sketch
  (~32 params/8 groups), canvas spec (hearse + choirbook), the full verify
  gauntlet (§14), and the registration checklist (§15, which includes
  deleting the brief at landing). Build in Media Session + no-suspend-on-
  hide from day one (see the lock-screen sweep thread below).


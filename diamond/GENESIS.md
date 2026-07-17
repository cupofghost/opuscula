# DIAMOND · GENESIS — the brief for op. XV

**Status: design complete, implementation NOT started.** This file is the
whole design; a later session implements from it. Written in the style of
`rille/HARMONIA.md` (the house precedent for a no-code brief). The name of
the file is after Partch's book, *Genesis of a Music* — **delete this file
when the machine ships** and fold the result into the HANDOFF thread.

No code below — tables, laws, and acceptance criteria only. Where a concrete
constant appears it is a *baked default* the implementer copies into TIMBRE
or the engine; where a range appears the implementer tunes by ear within it
and records the choice in the HANDOFF thread.

---

## 1 · What this machine is

**DIAMOND — Harry Partch's tonality diamond, played as a journey.** The user
sets the *limit* (how deep the diamond goes: 5, 7, 9, 11) and the weather of
the walk; the machine composes a closed circuit through every tonality the
diamond contains — otonality and utonality in strict alternation, each
modulation pivoting through the one tone the two chords share — and performs
it on a small ensemble of Partch's own instruments, synthesized: Diamond
Marimba, Harmonic Canon, Kithara, Boo, Cloud-Chamber Bowls, Marimba Eroica.

Naming follows the catalogue rule (each machine is named in the tradition's
own tongue): Partch's tongue is American English, and *diamond* is his own
word for the thing. Directory `diamond/`, `TIMBRE.id = 'diamond'`, op. XV.

Why this and not another JI machine: the catalogue's JI is all traditions
(BOLG, KHÖÖMEI, GONGAN) or phenomena (SCALA's illusion, COCHLEA's comma).
DIAMOND adds the *system* — the American experimental line, absent so far —
and specifically **utonality**, the subharmonic mirror no existing machine
touches. And the diamond's geometry gives the machine a law the others had
to legislate: light/dark alternation is *structural* here, not stylistic.

## 2 · Grounding (the research, condensed)

- Partch (1901–1974) burned his early concert works in a potbelly stove and
  rebuilt music from the ratios up: *Genesis of a Music* (1949) lays out
  Monophony, a music of exact small-number ratios sounded on instruments he
  built himself. He rode freight trains through the Depression; *Barstow* is
  hitchhiker graffiti set to speech-melody. His aesthetic is **corporeal** —
  bodily, dry, percussive, theatrical — against what he called the
  "abstraction" of the concert tradition.
- **The tonality diamond** arranges every ratio of odd identities ≤ the limit
  (1, 3, 5, 7, 9, 11) over every other. A column read one way is an
  **otonality** — a harmonic-series chord, the *major* archetype; a row read
  the other way is a **utonality** — the same intervals mirrored downward, a
  subharmonic chord, the *minor* archetype. Partch's 1946 **Diamond Marimba**
  lays the 11-limit diamond out physically so one mallet sweep rips a whole
  tonality.
- Each otonality crosses each utonality in **exactly one cell** — one shared
  tone. That crossing is the machine's modulation: leave a chord through one
  of its own tones, arrive in the mirror chord that tone generates. Partch
  called the shimmer between the two sides **tonal flux**.
- His 1/1 is **G at 392 Hz**; the full Monophony scale is 43 tones, of which
  the diamond supplies 29. This machine plays **the diamond only** — say so
  honestly in the reader notes.

## 3 · The tuning law — no ET anywhere

Everything sounds at

```
f = 392 × R × 2^k        R a diamond ratio, k an integer (register fold)
```

`392` (G) is the engine's only Hz literal; it is **law, not voicing** — it
lives next to the diamond tables, NOT in TIMBRE. There is no `mtof`, no MIDI,
no cents arithmetic in the signal path (cents appear only as display labels).
This is the first machine in the catalogue with **zero equal temperament**.

### 3.1 The diamond (11-limit master table)

Identities `I = [1, 3, 5, 7, 9, 11]` (prefix for lower limits). Cell (o, u)
= o/u folded to [1, 2). Rows = odentity o (read across: **Utonality under
o**), columns = udentity u (read down: **Otonality over u**):

| o\u | 1 | 3 | 5 | 7 | 9 | 11 |
|---|---|---|---|---|---|---|
| **1** | 1/1 | 4/3 | 8/5 | 8/7 | 16/9 | 16/11 |
| **3** | 3/2 | 1/1 | 6/5 | 12/7 | 4/3 | 12/11 |
| **5** | 5/4 | 5/3 | 1/1 | 10/7 | 10/9 | 20/11 |
| **7** | 7/4 | 7/6 | 7/5 | 1/1 | 14/9 | 14/11 |
| **9** | 9/8 | 3/2 | 9/5 | 9/7 | 1/1 | 18/11 |
| **11** | 11/8 | 11/6 | 11/10 | 11/7 | 11/9 | 1/1 |

Store ratios as **integer pairs [num, den]**, folded at build; compare tones
by cross-multiplication, never by float equality. Note the aliases: the
unity diagonal is six cells of 1/1, and 9/3 = 3/1 (cells (9,3) and (3,1)
both sound 3/2; likewise (3,9) and (1,3) both 4/3) — 9 is 3×3 and the
diamond knows it. Unique pitch counts per limit (verify these exactly):

| limit | identities | diamond cells | unique tones | tonalities |
|---|---|---|---|---|
| 5 | 1,3,5 | 9 | **7** | 6 |
| 7 | 1,3,5,7 | 16 | **13** | 8 |
| 9 | +9 | 25 | **19** | 10 |
| 11 | +11 | 36 | **29** | 12 |

The 29 unique tones ascending, with cents for canvas labels (do not use
cents for synthesis): 1/1 0 · 12/11 151 · 11/10 165 · 10/9 182 · 9/8 204 ·
8/7 231 · 7/6 267 · 6/5 316 · 11/9 347 · 5/4 386 · 14/11 418 · 9/7 435 ·
4/3 498 · 11/8 551 · 7/5 583 · 10/7 617 · 16/11 649 · 3/2 702 · 14/9 765 ·
11/7 783 · 8/5 814 · 18/11 853 · 5/3 884 · 12/7 933 · 7/4 969 · 16/9 996 ·
9/5 1018 · 20/11 1035 · 11/6 1049.

### 3.2 Tonalities and their roots

- **Otonality O_u** (column u): the six tones fold(o/u), o ∈ I — a harmonic
  series rooted on fold(1/u). Bright, blazing, "major."
- **Utonality U_o** (row o): the six tones fold(o/u), u ∈ I — subharmonics
  hanging from fold(o/1). Dark, hollow, beating. "Minor," hard-won.
- **Bass root** (what the Marimba Eroica plays, folded deep):
  - O_u → **fold(1/u)** — the series root. O1 1/1 · O3 4/3 · O5 8/5 ·
    O7 8/7 · O9 16/9 · O11 16/11.
  - U_o → **fold(o/3)** — the 10:12:15 minor-triad root of the utonality's
    5-limit frame (derivation: sort {o/1, o/3, o/5}; the o/3 member is the
    "10"). U1 4/3 · U3 1/1 · U5 5/3 · U7 7/6 · U9 3/2 · U11 11/6.
    (A Partch purist would say a utonality has no root — that ambiguity is
    real, but a bass instrument must stand somewhere, and o/3 is where the
    ear puts it. Keep this law; it is verifiable.)

### 3.3 Registers (Hz bands, folded by octaves)

| voice | band (Hz) | note |
|---|---|---|
| Marimba Eroica | 49–98 | G1–G2; the ground |
| Kithara | 98–196 | low strums |
| Harmonic Canon | 196–392 | the ostinato voice |
| Cloud-Chamber Bowls | 392–784 | pivot bells |
| Diamond Marimba | 392–784 | the sweep + strikes |
| Boo | 784–1568 | clicky patter |

Fold every tone into its voice's band by 2^k. Chord *spelling* inside a
band follows the sorted fold — voices never leap registers mid-station.

## 4 · The journey law (the composer)

### 4.1 A closed circuit, every tonality once

A pressing is **one circuit of the whole diamond**: with n identities there
are n otonalities and n utonalities; the journey visits **all 2n exactly
once** and returns home. Because every otonality crosses every utonality
(the diamond is K_{n,n} as a graph), a random Hamiltonian circuit always
exists: seed two permutations and interleave.

- Station 0 = **home = O1**, the G harmonic series — the only place the
  machine fully lands (GONGAN's gong-ageng logic transplanted).
- Strict alternation O → U → O → … is **forced by the pivot mechanic**, not
  legislated: leaving O_u through cell (o, u) arrives at U_o; leaving U_o
  through cell (o, u′) arrives at O_u′.
- The last station (a utonality U_o) exits through cell (o, 1) — its o/1
  tone — which lands O1: closure is always available. The **loop seam is the
  homecoming**; the WAV starts on the bloom and the ring folds across.
- O1 never recurs mid-journey (each tonality once), so home stays earned.

### 4.2 The pivot

The pivot between consecutive stations is **the crossing cell's tone**,
chosen by seeded weights over the current tonality's six cells:

- never pivot through the unity cell into… (careful: the unity cell (o,o)
  of U_o leads to O_o, which is a legal, distinct destination — allowed;
  "never" applies only to identities already visited on the destination side);
- prefer pivots whose destination root moves by a small ratio from the
  current root (weight ∝ 1/(num×den) of the root interval) — the walk
  favors near keys but can leap;
- the pivot tone **must sound**: the Cloud-Chamber Bowl rings it in the
  station's final bar, and it is the first canon tone of the next station
  (the ear crosses the bridge on that one plank).

Verify pivot membership by exact rational identity (same folded [num,den]),
not float closeness. Note the 3/9 alias: pitch-class intersections of two
tonalities can exceed one tone; **the pivot is the crossing cell's tone**,
which is unique as a cell even when its pitch has an alias elsewhere.

### 4.3 Flux and lean (station lengths)

Two chip rows shape the walk's weather. Bars per station:

| | FLUX = LINGER | FLUX = WALK | FLUX = STORM |
|---|---|---|---|
| LEAN = UTONAL | O 2 / U 6 | O 1 / U 3 | O 1 / U 2 |
| LEAN = EVEN | O 4 / U 4 | O 2 / U 2 | O 1 / U 1 |
| LEAN = OTONAL | O 6 / U 2 | O 3 / U 1 | O 2 / U 1 |

Home = **2 × the O figure** (its bloom needs air). Default **LEAN = UTONAL,
FLUX = WALK** — the house taste: the dark side is where the machine dwells,
the bright side is passed through, and only home blooms. (This is RILLE's
rationed-resolution philosophy expressed structurally.) At limit 11 /
WALK / UTONAL the circuit is 5·1 + 6·3 + 2 = 25 bars.

## 5 · Meter and the ensemble

### 5.1 Pulse

Corporeal rhythm, additive meter. One bar = one cycle of the chosen PULSE:

- **5** = 2+3 · **7** = 2+2+3 (default) · **9** = 2+2+2+3

eighth-note grid; group-heads are the strong beats. TEMPO slider = eighths
per minute, 200–340, default 264 (bar ≈ 1.6 s at 7). Seeded micro-timing
±4 ms on non-head strokes (humanize, deterministic).

### 5.2 The instruments (all synthesized, no samples)

Six voices, each a TIMBRE group; synthesis starting points name the house
precedent to crib from:

- **Marimba Eroica** — vast low bars. Modal: fundamental + ~4.0× partial
  (arch-cut bar) + a soft mallet thump; decay ~2.5 s. (GONGAN demung model,
  deeper and woodier.) Plays the station root on group-heads.
- **Kithara** — 6-string plucked lyre. Karplus–Strong (HOLLER's guitar,
  warmed: lowpass ~2200, body lift ~150 Hz); a **gliss strum** spreads the
  six tones over 40–90 ms. Strums the whole tonality at station arrival and
  (stations ≥ 4 bars) at the midpoint. Strum direction = the side: otonal
  up, utonal down.
- **Harmonic Canon** — bright psaltery, the machine's melodist. KS with a
  double course ±3 cents; short sustain. Per station, a seeded ostinato on
  the eighth grid over the six tones (stepwise walk on the sorted set, rare
  leaps, rests on weak eighths), repeating each bar with **one seeded
  mutation per repeat** — a music box being re-plucked. Density rises as
  the station approaches its flux. First tone of each station = the pivot
  tone just heard (§4.2).
- **Diamond Marimba** — bar modes 1 : ~3.9 : ~9.2, fast decay ~0.4 s,
  mallet click. Two duties: the **sweep** — the tonality ripped in 6
  strokes at 30–45 ms spacing at every station arrival (up for otonal,
  down for utonal); and sparse seeded chord-tone strikes off the canon's
  beat.
- **Boo** — bamboo tubes: pitched click, strong chiff, hollow bandpass,
  decay ~0.1 s. Seeded mask on the eighth grid, accents on group-heads,
  alternating two high-folded chord tones. The engine's hi-hat.
- **Cloud-Chamber Bowls** — Pyrex carboy tops. Inharmonic: fundamental +
  ~2.32× + ~3.94× partials, the fundamental a **beating detuned pair**
  (GONGAN kenong waver); decay 4–8 s. Rings the **pivot tone** on the
  final bar's first group-head, sustaining across the modulation; rings
  **1/1** at home.

Texture by side: otonal stations lean marimba/boo (bright, mf); utonal
stations lean kithara/eroica/bowls (dark, p, canon thinned). Home: full
ensemble, strum + sweep + 1/1 bowl + G1 eroica, then decays into the seam.

### 5.3 Master chain

Shaper → compressor → out trim, one small **dry room** send (Partch loathed
cathedral wash — corporeality is a dry stage; default wet low, ~0.08).
Peak target ≤ −1 dBFS (RILLE headroom precedent).

## 6 · Skeleton

**Prerender family** (FOLI/TAMBOUR/GONGAN): `genAll(seed, params)` → the
circuit (stations, pivots, per-station event grids), `renderMaster` → one
master buffer, loop-folded tail (ring across the homecoming seam, GONGAN's
fold), realtime = looped buffer + canvas clock; WAV cut = the same render.
Deterministic throughout. ► HEAR convention: buffer-baked, so **no
mid-play rebake**; edits apply next play, `TIMBRE.demo(group)` auditions
each voice freshly baked (a strum, a sweep, a bowl strike…). OFFICINA
bridge verbatim, `TIMBRE.touch` = master/wet live + debounced rebake flag.

## 7 · Controls, hash, keys

One row of chips per law, house grammar:

- **LIMIT**: 5 · 7 · 9 · **11** (default) — how deep the diamond
- **FLUX**: LINGER · **WALK** · STORM
- **LEAN**: **UTONAL** · EVEN · OTONAL
- **PULSE**: 5 · **7** · 9
- **TEMPO** slider (200–340 eighths/min, default 264) · **SEED** via `r`

Hash `#v1·s<seed>·l<0-3>·f<0-2>·e<0-2>·p<0-2>·b<tempo>` (house style;
every param round-trips; `l` indexes [5,7,9,11]). Keys: **space** play/stop
· **r** another · **c** cut WAV — nothing else; the diamond is the interface.

Changing LIMIT/FLUX/LEAN/PULSE regenerates on next play (prerender family
behavior, like GONGAN's form switch).

## 8 · Canvas

Left, **the diamond itself** — the one image this machine is about:

- The n×n grid rotated 45° (Partch's instrument's orientation), unity
  diagonal horizontal across the middle. Each cell: the ratio as num/den
  stacked, cents faint below. Layer-cache the static grid; rebuild only on
  LIMIT change.
- Active tonality = its **diagonal lit** as a band; the arrival **sweep
  animates along it** (a bright pulse running the diagonal, matching the
  audio's 6 strokes); cells flash on their strikes.
- The **pivot cell pulses** during the station's last bar (while its bowl
  rings), then the lit band rotates to the crossing diagonal — the eye sees
  the modulation as a hinge on one cell.
- The **journey trail**: visited diagonals stay faintly warm, so the
  circuit's coverage is visible; all trails clear at the homecoming.

Right, the **itinerary**: the circuit as a column of station chips —
`O·1/1 → U·5/4? …` — no: label stations by side + root, e.g. `O 1/1`,
`U 5/3`, with the pivot ratio written small between rows; current station
highlighted, home marked with a ring. (This is GONGAN's kepatihan panel
role: the whole form visible at once, the now-point moving through it.)

`prefers-reduced-motion`: no sweep animation, no pulsing — static band +
highlight only. Render loop sleeps when stopped.

## 9 · TIMBRE sketch (~40 params, 8 groups)

`master` (drive, comp threshold/ratio, out trim, wet) · `room` (size,
decay) · `eroica` (partial ratio/gain, decay, thump, level) · `kithara`
(KS tau, damp lowpass, body lift, strum spread ms, level) · `canon` (tau,
brightness, course detune ¢, level) · `marimba` (partials ×2, decay,
click, sweep spacing ms, level) · `boo` (chiff, bandpass Q, decay, level)
· `bowls` (pair beat Hz, partial ratios/gains, decay, level).

The law stays out of TIMBRE: 392, the identity list, the diamond, the
lean/flux tables, register bands. Factory defaults = the literals the
implementer lands on by ear; then the usual OFFICINA registration (chip in
`MACHINES`, schema doc, ► HEAR per group).

## 10 · "On this music" panel (content outline)

Plain-language, house voice: the man who burned his music and started over
from the ratios · hobo years, *Barstow*, corporeality ("a philosophic music
man seduced into carpentry") · what a ratio-as-identity means; otonality
and utonality as the two faces of the same intervals; tonal flux · the
Diamond Marimba, 1946, a chord under one mallet sweep · G = 392, why 43
tones exist and why this machine honestly plays only the diamond's 29 ·
what a pivot modulation is (leave through a tone you already own) · why the
journey ends on the harmonic series (the only chord nature tunes herself).

## 11 · Do not touch / gotchas for the implementer

- **Ratios are integer pairs end to end.** The moment a tone becomes a
  float before the final `392 × num/den × 2^k`, exactness claims die and
  the verify gauntlet will catch it.
- The unity diagonal is **six distinct cells of the same pitch** — cell
  identity ≠ pitch identity (9/3 alias too). The walk works on cells;
  the ear works on pitches; keep the two layers separate in the model.
- The bowls ring **across** station boundaries — schedule their tails past
  the flux; do not cut them at the bar line. The final station's bowl and
  the home bloom overlap by design (the loop fold carries it).
- Strum/sweep grace strokes near t=0: clamp ≥ 0 (TAMBOUR's negative-time
  gotcha applies to any pre-beat spread).
- Home appears **once** in the circuit (station 0 = loop head). Don't also
  emit it at the end — the seam fold IS the return.

## 12 · Considered and rejected (don't "improve" these back in)

- **Raga/alap machine (Hindustani JI):** magnificent tradition, but the
  drone-plus-melody space is BOLG/KHÖÖMEI's; and a credible alap needs a
  melodic intelligence this framework can't yet honor. Future op, not this.
- **Kepler's *Harmonices Mundi*:** planetary glissandi between JI extremes;
  gorgeous canvas, but the machine wouldn't *compose* — it would replay the
  solar system. Parked; the strongest alternative. A future "idea machine"
  alongside SCALA.
- **Barbershop (adaptive JI, ringing 7ths):** the drift-vs-lock tension is
  COCHLEA's comma story retold with voices; and the catalogue already sings
  (NENIA, KHÖÖMEI).
- **Alphorn ranz des vaches:** harmonic-series-only is already TAMBOUR's
  clairon law + KHÖÖMEI's whole premise.
- **The full 43-tone scale:** playing all of Monophony dilutes the one
  legible law (the diamond) and the one legible image (the diamond). The
  43 are a pick-up, not v1.
- **Free wander instead of the Hamiltonian circuit:** a wander revisits and
  omits; "every tonality exactly once, home at the end" is a *law* — PEAL's
  truth condition transplanted to harmony. Keep it.
- **Reverb as glamour:** no. Corporeal = dry. The bowls provide the halo.

## 13 · Acceptance — the verify gauntlet

`scratchpad/verify-diamond.mjs` (playwright-core + bundled Chromium),
house pattern (GONGAN's script is the model). Enumerate then smoke:

1. **Diamond tables**: per limit, the folded matrix equals §3.1 exactly
   (integer-pair equality); unique-tone counts 7/13/19/29; all tones in
   [1,2); unity diagonal all 1/1.
2. **Frequencies**: every scheduled event's Hz = 392 × num/den × 2^k for a
   diamond tone of the active limit (exact within 1e-9 relative); each
   voice inside its §3.3 band.
3. **Journey law** (≥ 40 seeds × all LIMIT/FLUX/LEAN combos): starts at O1;
   strict O/U alternation; every tonality visited exactly once; O1 only at
   station 0; every consecutive pair shares its pivot tone by rational
   identity; final station exits to O1.
4. **Roots**: eroica tones match the §3.2 root tables, folded to 49–98 Hz.
5. **Lengths**: station bars match the §4.3 table; home = 2×O; total bars
   as computed.
6. **Pivot audibility**: the last-bar bowl event's tone == the pivot; the
   next station's first canon tone == the pivot.
7. **Determinism**: `genAll` and `renderMaster` byte-identical across two
   runs with the same seed+params.
8. **Render**: NaN-free, peak-normalized ≤ −1 dBFS, loop-fold head energy
   present, every voice non-silent when soloed.
9. **Plumbing**: realtime context runs; hash round-trips on fresh load;
   WAV cut + encode clean; OFFICINA schema well-formed, set/bulk/
   localStorage round-trip; zero pageerrors.

## 14 · Registration checklist (ship with the code)

- `index.html`: op. XV card (suggested `--bg:#101a17` — glass-dark, the
  bowls' color world); counts fourteen → fifteen wherever stated.
- `README.md`: row XV, house style — open "Harry Partch's tonality diamond
  — named in English, Partch's own tongue and his own word for it…"; state
  otonality/utonality, the pivot walk, every-tonality-once, G = 392, no ET
  at all, all instruments synthesized after Partch's own.
- `HANDOFF.md`: file-structure line, counts, and the open thread updated
  (design → shipped); `CLAUDE.md` count likewise.
- `officina/index.html`: chip in `MACHINES`.
- Delete this file (`diamond/GENESIS.md`) when done.

## 15 · Pick-up ideas (post-v1)

- The **43-tone scale** as a secondary mode (the diamond plus Partch's
  multiple-number ratios) — a second chip row, off by default.
- **Speech-rhythm cantus** after *Barstow* — a talking contour on the
  canon, seeded from a text table (the machine already owes NENIA a debt).
- **Quadrangularis Reversum** (the diamond's mirror instrument) as a canvas
  easter egg; **Spoils of War** percussion color at STORM.
- Per-side pulse flavors (otonal 7, utonal 9) if the single meter reads flat.

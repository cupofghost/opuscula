# RICERCAR · GEB — the brief for op. XXIII (provisional)

**Status: design complete, implementation NOT started.** This file is the
whole design; a later session implements from it. Written in the style of
`diamond/GENESIS.md` / `rille/HARMONIA.md` (the house precedent for a
no-code brief). The file is named after the book it renders — Hofstadter's
*Gödel, Escher, Bach* — **delete this file when the machine ships** and fold
the result into the HANDOFF thread. Per the claiming rule, this brief claims
the **concept and the directory name (`ricercar/`), not the opus number**;
XXIII is provisional until landing.

No code below — tables, laws, and acceptance criteria only. Where a concrete
constant appears it is a *baked default* the implementer copies into TIMBRE
or the engine; where a range appears the implementer tunes by ear within it
and records the choice in the HANDOFF thread.

---

## 1 · What this machine is

**RICERCAR — the riddle canons of Bach's *Musical Offering*, run as a formal
system.** The user sets a seed; the machine spells that seed into a royal
theme (the **Gödel layer** — the theme *is* the pressing), then *seeks* the
canons hidden in it (the **Bach layer** — retrograde, inversion,
augmentation, endless modulation, each found by deterministic search against
a truth predicate, exactly as Bach's inscription *Quaerendo invenietis* —
"seek and you shall find" — told the performers of 1747 to do), and draws
the derivations as impossible figures (the **Escher layer** — the crab canon
as a palindrome that reads both ways, the endlessly rising canon as a
staircase that climbs forever and arrives where it began). The whole
pressing is one **strange loop**: the final canon modulates up a whole tone
per lap, six laps, arrives home an octave high, and the seam folds it back
into its own opening bars. The piece contains itself.

The name: Bach headed the *Musical Offering* with an acrostic — ***R**egis
**I**ussu **C**antio **E**t **R**eliqua **C**anonica **A**rte **R**esoluta*
("at the King's command, the song and the remainder resolved with canonic
art") — spelling **RICERCAR**, the old word for a piece that *seeks*. A
title that is simultaneously a sentence about itself, a musical form, and a
pun is the most GEB object in music history; Hofstadter closes the book with
a dialogue called *Six-Part Ricercar*. Naming follows the catalogue rule
(the tradition's own tongue): the tongue of the 1747 canon inscriptions is
Latin. Directory `ricercar/`, `TIMBRE.id = 'ricercar'`.

**Boundaries against the catalogue** (each was a reason to design this
machine the way it is — see §14):
- **SCALA** owns the Shepard–Risset *illusion*. RICERCAR's endless rise is
  the *canon per tonos* — six discrete, differently-coloured real
  modulations with one honest octave fold at the seam. No Shepard bands.
- **GRADUS** owns Fux species pedagogy. RICERCAR's predicate is the
  narrower *canon truth* check (§5.3), not species counterpoint teaching.
- **GERMEN** owns grammar rewriting (L-systems: symbols → strings).
  RICERCAR's rules transform *whole musical lines* (retrograde, inversion,
  augmentation) — derivation in the proof-theory sense, not rewriting.
- **TESSERA** owns self-reference via *prediction* (information theory).
  RICERCAR's self-reference is *encoding* (Gödel numbering) and *form*
  (the loop that contains itself).
- **PEAL** owns exhaustive-permutation truth. RICERCAR's truth is
  contrapuntal, checked per simultaneity, found by search.

## 2 · Grounding (the research, condensed)

- **May 7, 1747, Potsdam.** Frederick the Great hands the visiting "old
  Bach" a long, chromatic theme at the fortepiano and asks for an improvised
  fugue on it. Bach obliges in three parts, goes home to Leipzig, and mails
  back the *Musical Offering*: two ricercars, a trio sonata, and **ten
  canons on the royal theme** — several of them *riddle canons*, notated as
  a single line plus a Latin hint; the performer must *find* the second
  voice (which transformation, which interval, which delay). One canon
  carries the inscription **Quaerendo invenietis**.
- **The two motto canons** wire structure to meaning: the augmentation canon
  is inscribed *Notulis crescentibus crescat Fortuna Regis* ("as the notes
  grow, may the King's fortune grow"); the modulating canon *Ascendenteque
  Modulatione ascendat Gloria Regis* ("as the modulation ascends, may the
  King's glory ascend"). The **canon per tonos** rises a whole tone per
  repetition and after six is an octave up — it could ascend forever.
- **Hofstadter, *Gödel, Escher, Bach* (1979, Pulitzer 1980)** takes that
  canon as the emblem of the **strange loop**: a hierarchy that, climbed
  level by level, returns you to where you started. The book alternates
  chapters with dialogues whose *form enacts their content* — the *Crab
  Canon* dialogue reads the same forwards and backwards; *Contracrostipunctus*
  hides an acrostic about acrostics and tells of records that break the
  record players that play them (Gödel sentences: true statements a system
  cannot derive); the final dialogue is a six-part ricercar. **Gödel
  numbering** — encoding statements *about* a system as numbers *inside*
  it — is the book's engine of self-reference.
- **Escher** supplies the eyes: *Ascending and Descending* (the Penrose
  stair — the per-tonos canon drawn), *Drawing Hands* (two voices each
  generating the other — an inversion canon drawn), *Möbius Strip II*,
  figure/ground tessellations (the space between voices is also a voice).
- **Werckmeister III** (Andreas Werckmeister, *Musicalische Temperatur*,
  1691): the well temperament of Bach's world. Four fifths (C–G, G–D, D–A,
  B–F♯) each narrowed by ¼ of the Pythagorean comma; all others pure. Every
  key becomes playable and **every key sounds different** — the "key
  colour" that makes a modulating canon an actual journey. It is defined
  *exactly* (rationals times fourth roots of two), so the house rule
  "correctness where the domain has a right answer" applies in full.

## 3 · The tuning law — Werckmeister III, exact, zero ET

The catalogue has JI machines and one 12-TET stowaway (GERMEN); RICERCAR
adds the third thing — a **historical well temperament**, exact by
definition. Everything sounds at

```
f = C4REF × W[pc] × 2^k      pc ∈ [0,12), k an integer (register)
```

The one Hz literal is **A4 = 415** (Baroque Cammerton, a semitone under
modern pitch); `C4REF = 415 / W[9]` (≈ 248.43 Hz), derived, not a second
literal. Both live next to the tuning table as **law, not voicing** — NOT
in TIMBRE. No `mtof`, no cents arithmetic in the signal path (cents are
display labels only). Store `W` as exact expressions evaluated once:

| pc | note | ratio (exact) | cents |
|---|---|---|---|
| 0 | C | 1/1 | 0.0 |
| 1 | C♯ | 256/243 | 90.2 |
| 2 | D | (64/81)·2^(1/2) | 192.2 |
| 3 | E♭ | 32/27 | 294.1 |
| 4 | E | (256/243)·2^(1/4) | 390.2 |
| 5 | F | 4/3 | 498.0 |
| 6 | F♯ | 1024/729 | 588.3 |
| 7 | G | (8/9)·2^(3/4) | 696.1 |
| 8 | G♯ | 128/81 | 792.2 |
| 9 | A | (1024/729)·2^(1/4) | 888.3 |
| 10 | B♭ | 16/9 | 996.1 |
| 11 | B | (128/81)·2^(1/4) | 1092.2 |

Verify at build (see §15): fifths C–G, G–D, D–A, B–F♯ each 696.09 ¢
(701.955 − 5.865, i.e. pure minus ¼ Pythagorean comma); all eight other
fifths pure 701.955 ¢; the four tempered fifths absorb the comma exactly
(4 × 5.865 = 23.46 ¢).

**Transposition is index arithmetic, never pitch-shifting.** A theme in
D minor is the same pc-offsets re-read through `W` — its intervals are
*literally different sizes* than in C minor. This is the whole payoff of
the per-tonos finale: the six laps are six differently-coloured copies, and
the ear knows home when it returns. A `×2^(pc_shift/12)` shortcut would
erase the machine's reason to exist; forbid it (§13).

## 4 · The theme law — the SIGILLUM (Gödel numbering)

Each pressing composes its own royal theme, and the theme **is** the seed.

- **Seed space:** `s ∈ [0, 12^6)` (2,985,984 pressings). Hash stores it in
  decimal; the canvas shows it in base-12 *as the six cipher notes*.
- **The cipher (bijective, both directions exact):** write `s` in base 12,
  digits `d0…d5` (little-endian); each digit is a **chromatic degree above
  the home tonic**, `pc_i = (tonic + d_i) mod 12`. Decoding the six cipher
  notes of any theme recovers `s` exactly. This is honest Gödel numbering:
  a statement about the pressing (its identity) encoded *inside* the
  pressing, in its own alphabet. The URL hash is the pressing (house rule);
  here the *theme* is the hash, audibly.
- **Theme skeleton — 8 bars of 4/4, alla breve feel, four fixed regions:**

| bars | region | pitch content | freedom for the search (§5.4) |
|---|---|---|---|
| 1–2 | CAPUT | rising minor-triad gesture: 1 → ♭3 → 5 | rhythm cell, one optional passing tone |
| 3–5 | SIGILLUM | the six cipher pcs, in order, frozen | octave placement, rhythm, optional interposed passing tones (never reordering/altering cipher pcs) |
| 6–7 | LAMENTUS | chromatic descent 5 → 1 (the royal theme's famous fall) | which chromatic steps are sounded vs passed, rhythm |
| 8 | CLAUSULA | cadence formula onto 1 (in per-tonos laps: elided to a pivot onto V-of-next, §6.3) | ornament choice |

- **Register rule (deterministic):** first note = tonic in octave 4; every
  subsequent note takes the octave placement nearest the previous note
  (tie → below). The search may override octave only inside SIGILLUM, and
  the override is part of the searched state (seeded, deterministic).
- **Rhythm:** each bar draws from a small menu of Baroque cells (♩♩♩♩ ·
  ♪♪♩♩ · dotted pairs · tie-over-the-bar · one-bar hold). The menu is law;
  the *choice* per bar is search state.
- The theme, once found, is **one object reused by every movement** — the
  piece derives everything from one axiom, which is the point.

## 5 · The canon law — rules, truth, and the search

### 5.1 The alphabet of transformations (the rules of inference)

Applied to the whole theme as a line of (pc, octave, onset, dur) events:

| rule | inscription | definition |
|---|---|---|
| `T(i)` | canon simplex | transpose by `i` pcs (index shift through `W`) |
| `D(b)` | — | delay entry by `b` beats |
| `R` | cancrizans | retrograde: reverse onsets and durations exactly |
| `I` | per motum contrarium | chromatic mirror: `pc → (2·tonic − pc) mod 12`, contour inverted |
| `A` | per augmentationem | all durations × 2 |
| `M` | per tonos | the whole texture re-read with `tonic += 2`, register-folded |

A **canon** is the dux (the theme) sounded against a comes that is a
*composition of rules* applied to the same theme — plus, in the finale, the
theme itself as bass. A **derivation** is the rule string; the canvas
prints it like a proof: `THEMA ⊢ R(THEMA)` (§10).

### 5.2 The movements (fixed forms, one per canon of the Offering)

| # | movement | voices | bars |
|---|---|---|---|
| 1 | THEMA | dux alone (cembalo) | 8 |
| 2 | CANON SIMPLEX | dux + `T(i)∘D(2 bars)` + pedal point | 16 |
| 3 | CANON CANCRIZANS | dux + `R` (simultaneous entry — a palindrome) | 16 (8-bar palindrome ×2) |
| 4 | CANON PER MOTUM CONTRARIUM | dux + `I∘D(1 bar)` + pedal | 16 |
| 5 | CANON PER AUGMENTATIONEM, CONTRARIO MOTU | dux stated twice + `A∘I` stated once | 16 |
| 6 | CANON PER TONOS | theme in bass (cantus) + two voices in canon `T(7)∘D(1 bar)` above | 6 laps × 8 = 48 |

Total 120 bars ≈ 5½–7 min per lap at tempo 60–96. The WAV cut is exactly
one lap, seamless (§6.4).

### 5.3 The truth predicate (what makes a canon *true*)

Checked over every simultaneity between sounding voices:

- **Strong beats** (1 and 3): the vertical interval set ⊆ consonances
  {P1, m3, M3, P5, m6, M6, P8} (pc-interval classes {0,3,4,7,8,9}).
- **Weak beats:** dissonance allowed only as passing/neighbour motion
  (approached and left by step) or a suspension (prepared, resolved down
  by step).
- **No parallel perfects:** no consecutive P5→P5 or P8→P8 between the same
  voice pair.
- **Ranges:** each voice within its tessitura (§7); crossing allowed only
  in CANCRIZANS (the crab may cross — its two halves are one line).
- Three-voice movements (2, 4, 6) check all pairs.

### 5.4 QUAERENDO — the search (deterministic, always terminates)

This is the machine's soul: it does what the riddle canon asks of its
performer. Per movement:

1. Derive an RNG stream from `(seed, movementIndex)` — streams are
   independent, order of movements never matters.
2. Enumerate candidate themes by mutating only the freedoms in §4's table
   (rhythm cells, passing tones, SIGILLUM octaves) and, where the movement
   allows, the imitation interval `i` — in seeded order, **cap 512
   attempts** per relaxation level.
3. Score candidates by predicate violations; first zero-violation candidate
   wins. If the cap exhausts, step down a **relaxation ladder** and retry:
   - level 0: full predicate;
   - level 1: weak-beat checks waived;
   - level 2: strong-beat check per beat waived if ≥ half the sounding
     pairs are consonant (parallels still forbidden);
   - level 3: parallels only (never waived — floor, always satisfiable).
4. Record the level reached; the canvas prints it honestly (level 0 shows
   nothing; higher levels show `licentia I/II/III` beside the derivation —
   Bach's era had a word for permitted rule-bending, use it).

Everything is a pure function of the hash — same pressing, same canons,
same WAV, forever. The search runs once in `genAll` and is cached.

### 5.5 The GÖDEL utterance (default on, toggleable)

*Contracrostipunctus* is about the sentence a system cannot derive. Once
per lap, exactly at the strange-loop seam (§6.3), a solo voice sounds
**B–A–C–H** (pcs B♭, A, C, B♮ — the four-note signature Bach wrote into his
final, unfinished fugue). It is *deliberately not a theorem*: no rule
string in §5.1 derives it from the theme, and it is exempted from the
predicate. It is the one true utterance the system cannot prove — and it
sounds while the octave fold happens, so the level-crossing is masked by
the very statement of unprovability. When the toggle is off, the seam is
bare (and slightly audible — that's honest too).

## 6 · The form — one strange loop

### 6.1 Home key

`TONUS` control: home tonic pc, default **C minor** (the Offering's key).
All movements are minor-mode on the home tonic. Werckmeister makes this
choice audible — C minor and F♯ minor are different instruments.

### 6.2 The rise

PER TONOS lap keys: tonic, +2, +4, +6, +8, +10 (from C: c → d → e → f♯ →
g♯ → b♭ → c). Each lap's CLAUSULA is elided into a pivot: the last bar
re-hears the current V as IV-of-next... (implementer: the simple, verified
rule is — final bar sustains the pc common to both keys' dominant chords,
then the next lap enters; the *seam chord* must share ≥ 1 pc with both
laps). Each lap the two canon voices and the bass re-read the same theme
through `W` at the new tonic — the intervals themselves change size lap by
lap. Register climbs truly: no folding during the six laps.

### 6.3 The seam (the loop closes)

After lap 6 the music stands exactly **one octave above** where lap 1
began. At the downbeat where lap 7 would start, the whole texture instead
folds down 12 pcs of register (−1200 ¢, exact) and movement 1 (THEMA)
restates — the piece has arrived at its own beginning. The fold is masked
by (a) the movement boundary (texture thins to one voice anyway) and
(b) the GÖDEL utterance sounding across it (§5.5). You climbed six flights
of Escher's staircase and you are in the lobby.

### 6.4 Transport

The pressing loops THEMA → … → PER TONOS → seam → THEMA endlessly. The
offline render cuts **exactly one lap**, and the WAV is seam-to-seam
loopable (the last sample's tail crossfades into the head, per the TRITAVA
`renderMaster` precedent for seamless loops). A `CANON` control (§9) can
solo a single movement, looping just it — the rapid-audition path.

## 7 · Voices & synthesis (no samples)

Three instruments, all synthesized, Bach-world flavoured but honest about
being oscillators:

- **CEMBALO** (dux, and the solo THEMA voice): Karplus–Strong pluck — the
  house recipe (GERMEN/FADÓ precedent): seeded one-period noise burst into
  a damped feedback delay, cached per (pitch, brightness, decay, seed).
  Slightly nasal EQ tilt; this is the "harpsichord."
- **PRINCIPAL** (comes, and canon voice 2 in the finale): additive organ
  flue — fundamental + a gentle partial stack (both odd and even, rolloff
  param), slow onset chiff (a filtered noise transient), no vibrato (organs
  don't), a very slow tremulant option at depth ~0 by default.
- **PEDAAL** (pedal points, and the finale's bass cantus): bourdon —
  fundamental + a whisper of 3rd partial, sine-adjacent, long envelopes,
  register 2 octaves below middle.
- **Tessituras:** dux C4-centred (±14 pcs), comes above or below per the
  imitation interval, PEDAAL C2–C3. GÖDEL utterance plays on PRINCIPAL,
  solo, mezzo-piano.

**Master chain** (house spine): voices → per-voice gains → gentle shaper →
compressor → dry + convolver send (seeded IR, a stone room ~2.2 s — the
Offering is chamber music in a palace, not a cathedral) → limiter → out.
Offline render uses the identical graph in an OfflineAudioContext.

## 8 · Skeleton (engine shape — the house spine)

- `W[]` + `C4REF` — the tuning law (§3), module-top constants beside the
  cipher and rule tables.
- `genAll(state)` → `{theme, movements[], events[], derivations[],
  relaxLevels[], lapBars}` — cipher decode, theme search per movement
  (§5.4), event assembly for the full 120-bar lap. Pure, seeded, cached;
  re-run only on law changes (seed/tonus/canon/interval/gödel).
- `buildGraph(ctx)` — the §7 graph, realtime and offline from one builder.
- Scheduler: `schedTick` walking `events[]` against `ac.currentTime` with
  lookahead (house pattern); loop wraps at `lapBars`. Change-while-playing:
  law edits re-`genAll` and swap in at the next movement boundary (not next
  bar — a canon mid-derivation is not interruptible; document this in the
  reader notes).
- `cut()` — offline render of one lap, 16-bit WAV, deterministic,
  seam-crossfaded loopable.
- OFFICINA bridge **verbatim** (copy from FORFEX/RILLE — see the FADÓ
  bugfix thread for what happens otherwise), `TIMBRE.touch` ramping live
  nodes, `TIMBRE.demo(group)` auditioning each voice with a few plucked/
  held notes through the real graph (buffer-audition pattern).
- `__iosAudio` + Media Session + silent-anchor: build in from birth, per
  the lock-screen sweep pattern (suspend only on `pagehide`, never on
  visibility-hidden; metadata refresh on start/stop/pause/another;
  next-track = ALIUD). Saves the sweep a stop.

## 9 · Controls, hash, keys

The law is the interface — six controls, no synthesis knobs on the panel:

| control | values | hash | meaning |
|---|---|---|---|
| SIGILLUM (seed) | 0 … 12^6−1 | `s` | the theme's cipher — shown as its six notes |
| TONUS | 12 pcs, default C | `k` | home key (Werckmeister colour) |
| CANON | OMNIA · 1–6 | `c` | full lap, or solo one movement looped |
| INTERVALLUM | 5th · 4th · 8ve | `i` | imitation interval for movements 2 & 6 |
| GÖDEL | on/off, default on | `g` | the unprovable B–A–C–H at the seam |
| TEMPO | 60–96 | `t` | alla breve pace |

Keys: **space** play/stop · **p** pause · **r** ALIUD (new seed) · **c**
cut WAV (house set) · **m** jump to next movement (per-machine, documented
in-page). Hash round-trips all six; the URL is the pressing.

## 10 · Canvas (the Escher layer)

Layer-cached, sleeps when idle, `prefers-reduced-motion` freezes playheads.

- **The derivation line** (top strip): the current movement's Latin title,
  its rule string typeset as a derivation (`THEMA ⊢ I∘D(THEMA)`), its
  historical motto where one exists (*Notulis crescentibus…* /
  *Ascendenteque Modulatione…*), and any `licentia` level (§5.4).
- **The score ribbon** (center): dux and comes as two pitch-contour
  ribbons. Movement-specific geometry is the point:
  - CANCRIZANS renders as a **palindrome**: one ribbon drawn left-to-right
    meets the same ribbon drawn right-to-left; the playhead splits and
    runs both directions from the ends toward the middle (the crab).
  - CONTRARIUM draws the **mirror axis** (the tonic line) with the comes
    reflected below it — *Drawing Hands*: each ribbon is visibly the
    other, flipped.
  - AUGMENTATIONEM: the comes ribbon is the dux ribbon stretched ×2,
    drawn ghosted behind it.
  - PER TONOS: the ribbons wrap around a **looping staircase** — six
    flights arranged in a closed circuit (Penrose-stair perspective is a
    stretch goal; a hexagonal spiral that visibly closes on itself is the
    acceptable floor). The playhead climbs forever.
- **Figure/ground:** the space *between* the two ribbons is filled with a
  shifting tessellated tone (cheap: alternating fill between crossings) —
  Escher's negative space made audible-adjacent.
- **The cipher:** during THEMA, the six SIGILLUM notes carry their base-12
  digits above them, and the strip below spells the seed: the viewer can
  *read the URL off the score*. This is the Gödel layer made visible.
- Palette: candlelit manuscript — near-black ground, bone ink, one gold
  accent for the playhead/derivation, deep red for the GÖDEL utterance.

## 11 · TIMBRE sketch (~28 params, 6 groups)

`master` (level, drive, verb send, limiter ceiling) · `cembalo`
(level, brightness, decay, damp, attack-noise) · `principal` (level,
partials, rolloff, chiff, tremulant depth+rate) · `pedaal` (level, tone,
attack, release) · `room` (seconds, damp, level, predelay) · `pulsus`
(tick level for a subtle beat-1 tactus click, default near-zero).

Law stays out of TIMBRE: `W`, `C4REF`, the cipher, the rule tables, the
predicate thresholds, movement structure, lap keys — none of it is
voicing. Factory defaults must equal the literals they replace (house
rule). Bridge verbatim; `touch` ramps gains/filters live, KS-cache-clearing
edits (brightness/decay) re-bake on next event, per the GERMEN precedent.

## 12 · "On this music" panel (content outline)

Plain-language, the house voice: (1) Potsdam 1747, the King's theme, the
Offering mailed back, what a riddle canon is, *Quaerendo invenietis*;
(2) the two motto canons and the canon per tonos that could rise forever;
(3) Hofstadter 1979 — strange loops, Gödel numbering in one paragraph, why
this book made these canons famous to non-musicians; (4) what this machine
actually does: spells your seed into the theme (your URL is in the tune),
searches for true canons the way the riddle asks, rises through six real
Werckmeister keys and folds home; (5) honesty paragraph: the search can
bend rules (`licentia`), the fold is real (an octave, at the seam), the
B–A–C–H is deliberately underivable, and Werckmeister III is one plausible
Bach tuning, not a proven one; (6) A=415 and why old pitch is low.

## 13 · Do not touch / gotchas for the implementer

- **No pitch-shift transposition** — ever. All transposition re-reads `W`
  (§3). This includes the per-tonos laps AND the imitation interval.
- **Cipher pcs are frozen.** The search may never alter, reorder, or omit
  a SIGILLUM pitch class — bijectivity (§4) is an acceptance test.
- **The search must be exhaustively deterministic**: seeded streams keyed
  `(seed, movementIndex)`, fixed enumeration order, fixed caps. No
  `Math.random`, no time-dependence, no attempt budgets tied to frame
  rate.
- **The comes is derived, never composed.** If a canon won't verify, the
  search changes the *theme's free elements*, not the comes — the comes is
  always exactly a rule string applied to the dux. (This is the machine's
  integrity; a hand-patched comes is a false theorem.)
- **Retrograde reverses durations with onsets** — `R` must satisfy
  `event[k].dur === reversed[n−1−k].dur`; off-by-one here makes a false
  crab that *looks* palindromic on canvas and isn't.
- **The seam fold is −1200 ¢ exactly**, applied to register (`k` in §3),
  not to `W` indices — pc content is already home after +2×6 mod 12.
- **OFFICINA bridge verbatim** — do not reimplement it (the FADÓ
  post-mortem is the cautionary tale: a bespoke bridge crashed the whole
  script at load).
- **GRADUS's predicate is not this predicate.** Don't import species rules
  wholesale; §5.3 is deliberately narrower.
- Registry edits (landing card, README row, officina chip, HANDOFF table)
  are **minimal-diff rows**; re-check the op. number at every rebase —
  XXIII is claimed by landing, not by this brief.

## 14 · Considered and rejected (don't "improve" these back in)

- **Shepard-tone per tonos** — rejected: SCALA owns the illusion, and the
  illusion would *hide* the strange loop this machine exists to expose.
  The fold is honest and masked structurally, not psychoacoustically.
- **MIU / TNT string rewriting as the generator** — rejected: GERMEN
  already renders formal rewriting; and MIU derivations sonified are
  arbitrary — the canons *are* a formal system whose theorems were already
  music.
- **Quoting the 1747 royal theme verbatim as the only theme** — rejected:
  it would delete the Gödel layer (no seed in the theme) and the search
  (Bach already did it). Kept as a pick-up idea (a REGIUM preset, §16).
- **Full Fux species predicate** — rejected: GRADUS's territory, and
  riddle-canon truth is a different (narrower) question than pedagogy.
- **12-TET** ("it's Bach, close enough") — rejected: the per-tonos journey
  is *inaudible as a journey* in ET; key colour is the payoff. GERMEN's ET
  is a noted stowaway, not a precedent.
- **Unbounded search until level-0 truth** — rejected: no termination
  guarantee, nondeterministic runtimes. The relaxation ladder (§5.4) with
  honest `licentia` display is the deterministic, honest alternative.
- **A live "tangled-hierarchy" mode where playback output feeds the
  generator** — rejected for v1: breaks determinism and the offline
  render. The self-containment lives in the form instead (the finale's
  bass *is* the theme; the loop *contains* its own beginning).

## 15 · Acceptance — the verify gauntlet (headless Chromium)

Enumerate the model first, then smoke-test transport and render (house
pattern; scripts in scratchpad, not committed):

1. **Tuning:** all 12 `W` values match the §3 cents table to ±0.05 ¢; the
   tempered/pure fifth pattern is exactly {C–G, G–D, D–A, B–F♯} tempered
   at 696.09 ¢, the rest 701.955 ¢; sum of deviations = one Pythagorean
   comma.
2. **Cipher bijectivity:** for 200 seeds, encode → theme → decode
   round-trips exactly; the six SIGILLUM pcs appear in order in the found
   theme for every movement's final candidate.
3. **Canon truth by construction:** CANCRIZANS comes is the exact
   retrograde (pitch AND duration reversal); CONTRARIUM comes mirrors
   `(2·tonic − pc) mod 12`; AUGMENTATIONEM durations are exactly 2×;
   finale voices are `T(i)∘D(1 bar)` of the bass cantus.
4. **Predicate:** the shipped predicate, re-implemented independently in
   the verify script, confirms each movement's recorded `relaxLevel`; over
   seeds 1–50 (default controls), **no movement bottoms out at level 3**,
   and ≥ 60% of all movements verify at level 0 — if the distribution is
   worse, loosen the theme's freedoms (more rhythm cells, wider SIGILLUM
   octave choice), not the predicate.
5. **The loop:** per-tonos lap tonics are `(k + 2n) mod 12`; lap 6's final
   sounding register is +1200 ¢ (±0.01) above lap 1's entry; the seam
   event applies exactly −1200 ¢; the GÖDEL utterance is pcs {10,9,0,11}
   relative to B♭=10 absolute (B♭–A–C–B), present when `g=1`, absent when
   `g=0`, and appears in no derivation's rule string.
6. **Determinism:** same hash → byte-identical event list and WAV hash
   across two fresh loads; independent of movement solo/OMNIA order.
7. **Smoke:** page loads zero pageerrors; play/pause/stop/ALIUD/cut wired;
   hash round-trips all six params; change-while-playing swaps at movement
   boundary; offline WAV NaN-free, non-silent, peak ≤ 0.92, seam-loopable
   (|last-sample − first-sample| below the drone's own slope, TRITAVA
   test); Media Session metadata updates; hidden-tab keeps context
   running; manual pause survives hide→show (the RILLE gotcha).
8. **TIMBRE:** schema well-formed; factory values equal engine literals;
   bridge announces under `?bench`; `set`/`bulk`/localStorage overlay
   round-trip; `verify-officina.mjs` pattern.

## 16 · Registration checklist (ship with the code)

Landing `index.html` card (suggest `--bg` near-black with gold; emblem: a
small closed staircase of six flights, or the crab palindrome glyph) +
counts bump · `README.md` row + count · `officina` MACHINES chip ·
HANDOFF file-table row + Architecture count · CLAUDE.md count · this
brief **deleted**, outcome folded into a new top Open-threads entry ·
op. number re-checked against `origin/main` at final rebase.

## 17 · Pick-up ideas (post-v1)

- **REGIUM preset:** the actual 1747 royal theme (public domain) as a
  fixed alternative to the seeded theme — cipher off, search on.
- **The riddle mode:** show only the dux and the Latin hint; the listener
  presses a key to reveal (hear) the comes — the machine as puzzle-giver,
  which is what the Offering's canons were.
- **More canons:** the Offering has ten — canon a 4, the spiral canon, the
  mirror fugue could extend the lap.
- **Tuning menu:** Kirnberger III / Vallotti alongside Werckmeister — same
  exact-ratio discipline, audible A/B of the eighteenth-century argument.
- **A licentia inspector:** click the `licentia` badge to see exactly
  which simultaneity was waived — the proof, annotated.

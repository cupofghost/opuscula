# RILLE · HARMONIA — the brief for the tonal recomposition

This file is a **complete implementation brief** for reworking the tonal parts
of `rille/index.html` (op. IV). It was designed in a prior session; the session
reading this now is the implementer. **No design decisions are left open** —
where this brief is silent, keep the current code's behaviour. Follow it in
order; the acceptance gauntlet at the end defines "done".

**How to work:** read `HANDOFF.md` first (house conventions), then this file,
then the marked regions of `rille/index.html`. Develop on the feature branch,
commit with the musical reasoning in the message, push, don't open a PR.
When the work is implemented *and* the gauntlet passes, fold a summary into
`HANDOFF.md`'s open threads and **delete this file** — the repo stays lean;
the reasoning survives in the commit message and the handoff thread.

---

## 1 · Mandate (the maintainer's words, condensed)

- The composition of the tonal parts still isn't right.
- **No major moods or vibes.** Major sonority exists **only** to resolve minor
  progress, occasionally. (Currently ♭VI/♭VII/♭II pass through as major triads
  with a bright ascending "glint" — that is exactly what must go.)
- **No goofy-sounding songs.** Restraint everywhere: no plinky ascending
  figures, no aimless noodling, no octave pops.
- **Simplify the input layout.**
- **Just intonation as far as it can go; temper only where absolutely needed.**
  RILLE currently tunes upper voices just *over the bass* but the bass, the
  chord roots and the lattice anchor are still equal-tempered MIDI. That ends.

Scope is **tonal structure only**: harmony, melody, arpeggio, bass *pitch*.
The rhythm section, arrangement machine, synthesis voices, mixer/deck
architecture, TIMBRE layer and canvas were all approved — do not touch them
except at the exact seams named in §9.

## 2 · Diagnosis — why the current writing misses

1. **Passing majors.** `buildHarm` voices major-quality pool degrees as plain
   major triads (`MAJ_SHAPE=[0,4,7]`) for one bar, and `scheduleBar`'s `'maj'`
   branch plays them as a quick ascending three-note glint. One bright plink in
   a dark hover reads as comic relief — the "goofy" the maintainer hears.
2. **Dorian.** DÄMMERUNG and SOG run dorian for the "bright natural 6th" —
   which is precisely a major vibe smuggled in as a scale degree, and it puts a
   major IV triad in their pools.
3. **The cantus noodles.** A random walk on minor pentatonic, uncorrelated
   with the sounding chord, with random octave pops. Aimless = goofy.
4. **The cadence is generic.** iv → V7sus → V7 → i is correct but anonymous;
   it doesn't *grieve*, it just functions.
5. **ET remnants.** Chord roots, bass notes and the swell anchor go through
   `mtof(midi)`; only the intervals above the bass are just.

## 3 · Grounding (the research)

- **The lament bass.** The stepwise descending tetrachord from tonic down to
  dominant (1–♭7–♭6–5) in minor is the oldest emblem of grief in Western
  music — the ground of Dido's Lament and the chaconne tradition
  ([Wikipedia: Lament bass](https://en.wikipedia.org/wiki/Lament_bass),
  [Empirical Musicology Review on descending bass schemata and negative
  emotion](https://ojs.library.osu.edu/index.php/EMR/article/view/6790/5605)).
  We adopt it as **the** cadence: the release is earned by a slow bass
  descent, not by a chord menu.
- **The minor dominant cannot pull home.** Natural minor's v is minor; the
  leading tone must be *raised* to make a functional V — the entire reason
  harmonic minor exists ([Fundamentals, Function & Form: minor scale
  variants](https://milnepublishing.geneseo.edu/fundamentals-function-form/chapter/16-minor-scale-variants/)).
  Consequence: the **only major third in the whole machine** is the raised
  leading tone inside V, and it exists only to resolve. This is the exact
  shape of the maintainer's rule.
- **Techno is minor and voicing-driven.** Dark electronic practice lives on
  minor 9ths, sus/thirdless voicings and single-chord narratives; brightness
  comes from *openness*, not major thirds ([Attack Magazine, The Theory of
  Techno Pads](https://www.attackmagazine.com/technique/tutorials/the-theory-of-techno-pads-part-1/),
  [Chordoo, dark melodic-techno progressions](https://www.chordoo.com/blog/melodic-techno-chord-progressions-for-dark-atmosphere)).
  Consequence: degrees whose diatonic triad is major (♭VI, ♭VII, ♭II) stay
  available as **bass roots**, but voiced **thirdless** — open fifth + ninth.
  Warmth (SOG) is rebuilt from suspension, not from dorian.
- **5-limit just minor.** The just minor triad is 10:12:15 (m3 = 6/5,
  315.6 ¢); renaissance JI practice covered exactly our modes
  ([Wikipedia: five-limit tuning](https://en.wikipedia.org/wiki/Five-limit_tuning),
  [Xenharmonic wiki: 6/5](https://en.xen.wiki/w/6/5)). The harmonic seventh
  7/4 on the dominant is kept from the current engine.

## 4 · The tuning law — just intonation end to end

**One number in a pressing is equal-tempered: `tonicHz = mtof(g.root)`.**
Everything tonal is derived from it by exact ratios. `mtof` must appear
**exactly once** in the tonal path (percussion is unpitched and out of scope;
the kick's `pitch` constant is not tonal).

### 4.1 Two-level lattice

Every sounding tonal frequency is

```
f = tonicHz × DEG[degree] × SHAPE[k] × 2^n
```

— a **degree-root ratio** (the bar's chord root, fixed against the tonic) times
a **shape ratio** (the voice's interval over that root) times octave folding.
Roots re-anchor to the tonic every bar, so there is **no comma drift** (this is
fixed-lattice JI, not chained — see §13). Composite ratios that leave the
7-note scale (e.g. the 9th of v = 27/16 over tonic) are **correct, not bugs**:
vertical purity over the sounding root always wins.

### 4.2 Degree-root ratios (`DEG`, over the tonic)

| degree | roman | ratio |
|---|---|---|
| 0 | i | 1/1 |
| 1 | ♭II (phrygian) | 16/15 |
| 2 | ♭III | 6/5 |
| 3 | iv | 4/3 |
| 4 | v / V | 3/2 |
| 5 | ♭VI | 8/5 |
| 6 | ♭VII | 16/9 |

### 4.3 Shape ratios (`SHAPES`, over the bar root — replaces semitone `HOVER_SHAPE`)

| id | ratios | replaces | use |
|---|---|---|---|
| `shell9` | [1/1, 6/5, 9/5, 9/4] | [0,3,10,14] | minor degrees, FINSTERNIS/SCHATTEN |
| `stack9` | [1/1, 6/5, 3/2, 9/4] | [0,3,7,14] | minor degrees, TRÄNEN/LEERE |
| `sus9`   | [1/1, 4/3, 9/5, 9/4] | [0,5,10,14] | minor degrees, DÄMMERUNG/SOG (thirdless) |
| `cluster`| [1/1, 45/32, 32/15] | [0,6,13] | EISEN only, unchanged harshness |
| `quint`  | [1/1, 3/2, 9/4] | — new | **every major-quality degree** (♭II/♭VI/♭VII) |
| `dom7sus`| [1/1, 4/3, 3/2, 7/4] | [0,5,7,10] | cadence, suspension bar |
| `dom7`   | [1/1, 5/4, 3/2, 7/4] | [0,4,7,10] | cadence, resolution-charged bar |
| `bloom`  | [1/1, 6/5, 3/2, 9/4] | [0,3,7,14] | cadence, tonic landing |

Swell dyads in `scheduleBar` (the stripped cadence intervals, unchanged in
spirit): dom-sus **[4/3, 7/4]**, dom-raised **[5/4, 7/4]**, tonic **[6/5,
3/2]**, pad-mood hover underlay **[3/2]**, desc bars (new, see §5.3)
**[3/2, 9/4]** — a bare fifth-and-ninth swell over the descending bass.

**The law, checkable:** the ratio **5/4 never sounds over any bar root except
the raised-dominant bar of a cadence.** No shape, arp, bass or melody note may
produce it anywhere else. (Over the V root, 5/4 is 15/8 over the tonic — the
*just leading tone*.)

### 4.4 Registers (Hz folding replaces MIDI folding)

- **Bass root:** fold `DEG[d]` by octaves into `(1/√2, √2]` — i.e.
  `while(r>1.4142)r/=2; while(r<=0.7071)r*=2` — then `bassRootHz = tonicHz×r`.
  This reproduces the old "nearest octave to the key root" band (MIDI ±6).
- **Bass pattern offsets** (`genAll` bass events) become ratios `r` instead of
  semitone `off`: `0→1/1`, `−12→1/2`, `−5→3/4`, `−2→8/9`. (Those four are the
  only offsets the three bass styles emit — verify by reading the generator.)
  A bass note = `bassRootHz × r`.
- **`vBass` signature: takes Hz, not MIDI.** Move the rumble floor into Hz:
  `while(f<41)f*=2` (E1 ≈ 41.2 Hz), sub-oscillator only when `f>=82`,
  25 Hz highpass and all TIMBRE params unchanged.
- **Swell anchor:** fold the bar-root Hz into `[tonicHz, 2·tonicHz)`, then
  dyad ratios ×2 — replaces `mtof(((bRoot-28)%12+12)%12+28+12)` and lands the
  same register.
- **Melody band:** `[4·tonicHz, 4·tonicHz×8/5]` (the old root+24 region,
  capped a minor 6th up — **no octave pops**). One sanctioned exception in
  §6.4.
- **Arp notes:** `barRootHz × SHAPE[idx % len] × 2^oct` where `oct` ∈ {0, 1}
  per §7.

### 4.5 Where ET remains (the complete list)

1. `tonicHz = mtof(g.root)` — the pressing's anchor, so Camelot key labels
   stay truthful.
2. The AUTO-SET seam: the incoming deck's tonic is the ET pitch-class of the
   Camelot target. Inside each track everything is just; only the *hop between
   tracks* is tempered. (Pure 3/2 hops would spiral off the wheel by a
   Pythagorean comma per lap — rejected, §13.)
3. Unpitched percussion constants (kick pitch sweep, hat/clap filters).

Nothing else. Delete `JI[]` and `jf()` once the two-level lattice replaces
them (careful: both decks during a blend each carry their own `tonicHz`).

## 5 · The harmonic law

### 5.1 Two states, two kinds of bar — majors abolished from hover

The 64-bar narrative (`HARMBARS`, `buildHarm`) survives. Bar kinds become:
`'hover' | 'desc' | 'dom' | 'tonic'`. **Delete:** kind `'maj'`, `MAJ_SHAPE`,
the one-bar-major law (nothing needs rationing when nothing major exists), the
glint branch in `scheduleBar`, and kind `'pre'`.

**Hover:** weighted drift in the pool, spans 2–4 bars (major-quality degrees:
1–2 bars — they are now `quint`-voiced, dark, but still passing colour), no
immediate repeats except i. Quality decides the shape:
minor triad degree → the mood's shape; major → `quint`; diminished → dropped
from the pool (keep the existing `chordQual` filter and `poolDegs` truth).

**Tension shaping** (new, small): in the 8 hover bars before a cadence window,
multiply non-tonic weights ×1.5; the **final 2 bars before the window are
forced to degree 0** (the tetrachord needs its "8" to descend from).

### 5.2 The cadence — a lament tetrachord

Every `cad` bars (when `cad>0`), the last 8 bars of the span:

| window bars | kind | bass root (DEG) | voicing / swell |
|---|---|---|---|
| 1–2 | `desc` | ♭VII = 16/9 | `quint`; swell dyad [3/2, 9/4] |
| 3–4 | `desc` | ♭VI = 8/5 | `quint`; swell dyad [3/2, 9/4] |
| 5 | `dom` | V = 3/2 | `dom7sus`; swell [4/3, 7/4] — the suspension |
| 6 | `dom` | V = 3/2 | `dom7`; swell [5/4, 7/4] — **the only major third** |
| 7–8 | `tonic` | i = 1/1 | `bloom`; swell [6/5, 3/2] — home |

With the forced-i bars before the window, the bass walks **1 → ♭7 → ♭6 → 5 → 1**:
the aeolian lament descent, harmonized thirdless until the dominant, the 4–3
suspension resolving across bars 5→6, the leading tone appearing for exactly
one bar (two beats of ache) and landing. The WAV cut still ends resolved
(window fits inside the 64).

- The bass **always follows** the root through `desc`/`dom`/`tonic` (as it
  already does for the cadence kinds); hover keeps the mood's pedal/follow.
- Arps fall silent on `desc`/`dom`/`tonic` bars (currently they only skip
  `dom`/`tonic` — extend to `desc`); the swells and bass carry the descent.
- Melody: see §6.4.
- **`half` is deleted.** A dominant that never resolves is major-as-mood;
  the mandate says major exists to resolve. Moods that shouldn't land simply
  never cadence (`cad:0` — no major, no dominant, ever).

### 5.3 Resolution frequency — the one harmonic control left

Three values, German label **LÖSUNG**: `NIE` (cad 0), `SELTEN` (cad 64 — one
release per cut), `OFT` (cad 32). `PROGS`, the eight-chip recipe menu, and
`harmRecipe` die; each mood carries a default LÖSUNG (§8).

## 6 · The melodic law (cantus — TRÄNEN only, as now)

Replace the pentatonic random walk wholesale.

### 6.1 Material — one sigh cell

A seeded 3-note **descending stepwise cell** in the mood's scale, chosen from
scale-degree triples (1-indexed degrees): `[5,4,♭3]`, `[♭6,5,4]`, `[4,♭3,2]`,
`[♭3,2,1]`. The ♭6→5 fall is the lament semitone — weight `[♭6,5,4]` ×2 in the
seeded choice. **Descending only. No leaps inside the cell.**

### 6.2 Phrase — statement and fading echo over 8 bars

- Bars 1–2: cell A. Bars 3–4: silence. Bars 5–6: cell A′. Bars 7–8: silence.
- A′ = A transposed **down one scale step** (fold back into the band of §4.4 if
  it escapes), or — seeded 50/50 — A with the final note lowered one more step.
- Rhythm: first note enters on step 4 or 6 of the bar (never the downbeat —
  the melody floats), each note ≥ 6 sixteenth-steps long, ≤ 3 notes per
  2 bars. Velocities in the current `.5–.75` range; **no accent spikes**.

### 6.3 Harmony lock (the anti-noodle rule)

The **first and last note of each cell must be a chord tone of the bar the
note starts in** (a member of that bar's shape over its root); the middle note
may be a scale passing tone. Realization: chord tones as
`barRootHz × shapeRatio`; passing tones as `tonicHz × MODE_JI[degree]` folded
to the nearest position between its neighbours, where `MODE_JI` is
äolisch `[1/1, 9/8, 6/5, 4/3, 3/2, 8/5, 9/5]`,
phrygisch `[1/1, 16/15, 6/5, 4/3, 3/2, 8/5, 16/9]`.
If a chosen cell cannot satisfy the lock on the bar it lands on, step the cell
down one degree and retry (seeded, deterministic — at worst it lands on
`[♭3,2,1]` over i, which always locks).

### 6.4 Cadence behaviour

Silent on all `desc`/`dom`/`tonic` bars — **except** one sanctioned figure,
seeded p=0.5 per cadence: on the raised-dominant bar (window bar 6), a single
**ti → do**: `tonicHz×15/8` entering at step 8, resolving to `tonicHz×2` on
the downbeat of the tonic bar, held 2 beats. These two notes sit *below* the
melody band on purpose (the voice drops to speak once). This is the only
melodic material a cadence may carry.

## 7 · The arpeggio law

`g.arpSeq` machinery survives (rates, densities, seeding, swing, offbeat
accents — rhythm was approved). Changes:

- Indices resolve into the new **ratio shapes**: note = `barRootHz ×
  SHAPE[idx % SHAPE.length] × 2^oct`. On `quint` bars the arp automatically
  rolls root–fifth–ninth: spacious, no third — by construction.
- **The octave "reach" (`oct:12`) is TRÄNEN-only, probability .30 → .15.**
  All other moods: never. (It reads as a yelp in the dark moods.)
- Directions per mood are pinned in §8; `'rnd'` remains EISEN-only.
- Delete the `'maj'` glint (§5.1) — nothing replaces it. Absence is the point.

## 8 · The mood table (exact field edits in `MOODS`)

Only these fields change; bpm/root/kick/hats/claps/space/dust/order untouched.
**Roots are untouched → every Camelot key and the whole AUTO-SET table stay
valid.** All seven moods end up äolisch or phrygisch — dorian is abolished
(its natural 6th is the smuggled major vibe; SOG's warmth is rebuilt from
thirdless sus voicings instead).

| mood | mode | pool [deg,weight] | LÖSUNG default | vstyle | arp dir | reach |
|---|---|---|---|---|---|---|
| FINSTERNIS | phrygisch (keep) | [0,3],[1,1],[3,1.5] | NIE (was half-cad — dies) | shell9 | dn | — |
| SCHATTEN | äolisch (keep) | [0,3],[3,1.5],[5,1],[6,1] | SELTEN | shell9 | ud | — |
| TRÄNEN | äolisch (keep) | [0,3],[3,1.5],[4,.8],[5,1] (v added) | OFT | stack9 | up | p=.15 |
| EISEN | phrygisch (keep) | [0,1] | NIE | cluster | rnd | — |
| DÄMMERUNG | **äolisch** (was dorisch) | [0,3],[3,1],[6,1] | OFT | sus9 | ud | — |
| LEERE | äolisch (keep) | [0,4],[3,1] | NIE | stack9 | dn | — |
| SOG | **äolisch** (was dorisch) | [0,3],[3,1.5],[6,1] | SELTEN | sus9 | up | — |

`modeName` strings follow ('äolisch' for the two ex-dorian moods). `follow`
stays a mood constant (FINSTERNIS/SCHATTEN/EISEN/LEERE/SOG pedal, TRÄNEN/
DÄMMERUNG follow) — the UI control for it dies (§9). `M.harm` becomes
`{pool, loesung}`; `cad`/`half` fields die.

## 9 · Input layout — the simplification

**Delete** from the controls column (markup + wiring + state):
- The whole "Progression · die Akkorde" block: `#prog` chips, `#progrd`
  readout, the `PROGS` array, recipe plumbing in `genAll`.
- The `#bassmode` chip row (follow/pedal becomes mood law).

**Add** one row in their place:

```
Lösung · wie oft die Musik heimkehrt
[ NIE (∞) ] [ SELTEN (alle 64) ] [ OFT (alle 32) ]
```

Three chips, mood default pre-selected on mood change, user override sticks
until the next mood change (same pattern the prog chips used). The ledger's
HARMONIK line shows the pool in ♭-aware romans with a superscript 5 on
thirdless degrees, then the ending: e.g. TRÄNEN
`i·iv·v·♭VI⁵ …♭VII–♭VI–V⁷→i` · FINSTERNIS `i·♭II⁵·iv ∞`. Rewrite `harmLabel`
accordingly; `chordLetters` drops with `PROGS` if nothing else uses it.

Final control column, top to bottom: SPIEL/PAUSE · Affekt · **Lösung** ·
Tempo + Neupressung · Mix/AUTO-SET · Spuren · Schnitt · ledger. Nothing else.

**Hash:** new key `l` ∈ {0,1,2} replaces `p` and the bassmode key. Read old
hashes tolerantly: map `p` 0→mood default, 1–2→NIE, 3–4→SELTEN, 5–7→OFT;
ignore the old follow key. Old permalinks re-voice — accepted, precedented
("Old permalinks: harmony differs (by design)" — HANDOFF, narrative-engine
thread). No hash version bump.

## 10 · Copy updates (ship with the code change)

- Reader notes: rewrite **"Longing and release"** — the story is now: hover
  in pure minor · thirdless fifths where colour passes · the lament
  tetrachord descent · the one raised leading tone, tuned 15/8, resolving ·
  everything just from one tonic. Mention Dido/the chaconne tradition in one
  sentence (house style: plain-language history). Update **"Affect and law"**
  where it mentions dorian/SOG brightness (warmth now = open suspension).
- `grep -i "doris\|dorian" rille/index.html README.md index.html HANDOFF.md`
  and fix every hit (SOG/DÄMMERUNG blurbs).
- Ledger/`matrix` strings that print mode names pick up äolisch automatically
  from `modeName` — verify visually.
- `HANDOFF.md`: close this thread per house convention.

## 11 · Do not touch

- Drums and every synthesis interior: `vKick`, `vHatC/O`, `vClap`, `vChord`,
  `vArpN`, `vCantus`, `startDust` — **except** `vBass`'s MIDI→Hz seam (§4.4).
  `vChord`/`vArpN`/`vCantus` already take Hz.
- `TIMBRE` block and the OFFICINA bridge: **zero schema changes.** Every
  existing param keeps its meaning (chords/arp/cantus/bass groups still read).
- Deck/mixer/blend architecture, `newArrange`, the scheduler's lookahead,
  the canvas (the chordae ring reads `arpSeq`, whose event shape is
  unchanged), the iOS block, the offline cut plumbing, Camelot tables and
  `pickHarmonicMove`.
- `bpm`/`root`/rhythm fields of every mood.

## 12 · Considered and rejected — do not "improve" these back in

- **Half cadences** (hang on V7): major held as an unresolved mood = major as
  vibe. Rejected; non-landing moods get `cad:0` instead.
- **Picardy third** (5/4 on the final tonic of a cut): the canonical
  "major-only-to-resolve" device, and gorgeous in JI — but it puts a major
  tonic in the listener's last impression. **Rejected unless the maintainer
  asks for it by name.**
- **Chained-root JI** (each root tuned from the previous chord): pumps the
  syntonic comma and drifts — this catalogue already has a machine *about*
  that (COCHLEA). RILLE anchors every root to the tonic.
- **Pure-3/2 Camelot hops** in AUTO-SET: spirals a Pythagorean comma per lap
  of the wheel; labels would lie. The seam stays ET.
- **Keeping dorian for SOG** with the 6th merely avoided: a scale whose
  signature degree must never sound is the wrong scale.
- **7/5 instead of 45/32 in EISEN's cluster**: softer, but EISEN is meant
  harsh. Revisit only if the maintainer flags it (standing note in HANDOFF).

## 13 · Acceptance — the verify gauntlet

House pattern: **Node structural sweep + headless Chromium smoke** (see the
RILLE threads in HANDOFF.md; playwright-core + bundled Chromium). Write
`scratchpad/verify-rille-tonal.mjs`. All checks below must pass before the
thread closes.

**Node — enumerate the model** (7 moods × 3 Lösungen × ≥40 seeds):

1. `buildHarm` deterministic per seed; every bar has kind ∈ hover/desc/dom/
   tonic; **kind `'maj'` no longer exists anywhere in the file** (grep).
2. **The 5/4 audit (the mandate, mechanized):** enumerate every ratio the
   scheduler can emit (shapes, swell dyads, arp resolutions, bass, cantus);
   assert 5/4-over-bar-root occurs **only** on the raised-dom bar. Equivalent
   tonic-relative check: 15/8 sounds only there.
3. Cadence windows are exactly `[desc·16/9 ×2, desc·8/5 ×2, dom-sus,
   dom-raised, tonic ×2]`, the 2 bars before each window are degree 0, and
   `cad:0` pressings contain **zero** desc/dom/tonic bars and zero 7/4s.
4. Bass roots across a cadence walk 16/9 → 8/5 → 3/2 → 1/1 (octave-folded);
   every bass fundamental ≥ 41 Hz post-floor; sub only when f ≥ 82 Hz.
5. **JI purity:** every emitted frequency equals `tonicHz × q × 2^n` for `q`
   in the closed ratio set of §4 (ε = 1e-9 relative); `mtof` appears exactly
   once in the tonal path (static check).
6. Cantus (TRÄNEN): cells descend stepwise; first/last notes pass the
   chord-tone lock; band `[4t, 32t/5]` respected except the ti–do figure;
   silent on desc/dom/tonic bars except that figure; ≤3 notes per 2 bars.
7. No mood/mode/table contains a major 6th over the tonic (semitone 9 in a
   `mode` array, 5/3 in any ratio table) — dorian is really gone.
8. Arp: `oct>0` only in TRÄNEN, rate ≤ .15 measured over seeds; directions
   per §8; quint-bar arps emit only {1, 3/2, 9/4}×2^n over the root.
9. Mood roots and Camelot numbers unchanged (assert the literal list:
   FINSTERNIS 4A, SCHATTEN 1A, TRÄNEN 8A, EISEN 9A, DÄMMERUNG 7A, LEERE 5A,
   SOG 6A).
10. Hash: `l` round-trips; legacy `p=0..7` maps per §9.

**Chromium — smoke the runtime:**

11. Each mood × each Lösung: play 10+ bars straddling a cadence window
    (where one exists) — zero pageerrors; swells, desc quints and the ti–do
    figure schedule without NaN frequencies.
12. Offline cut renders clean for TRÄNEN/OFT and FINSTERNIS/NIE; the
    TRÄNEN cut's final bars are tonic (the plate ends home).
13. AUTO-SET: one full blend completes with both lattices live, no errors.
14. Ledger shows the new HARMONIK strings; the Lösung chips re-default on
    mood change; OFFICINA bench round-trip still passes
    (`verify-officina.mjs rille`).

**Ears (the maintainer's check, state it in the thread):** render TRÄNEN·OFT
and SOG·SELTEN — no bright plinks, no noodling, the one leading tone lands,
and the whole thing tunes beatlessly against the bass.

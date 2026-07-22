# AMADINDA · OKWAWULA — the brief for op. XXIII

**Status: design complete, implementation NOT started.** This file is the
whole design; a later session implements from it. Written in the style of
`diamond/GENESIS.md` / `rille/HARMONIA.md` (the house precedents for a
no-code brief). The file is named after **okwawula** — "to divide, to
separate" — the second amadinda part, the one that slots into the gaps of
the first and completes the music. This brief is the okunaga (the starting
part); the implementing session plays okwawula. **Delete this file when the
machine ships** and fold the result into the HANDOFF thread.

No code below — tables, laws, and acceptance criteria only. Where a concrete
constant appears it is a *baked default* the implementer copies into TIMBRE
or the engine; where a range appears the implementer tunes by ear within it
and records the choice in the HANDOFF thread.

One terminology note for the record: the maintainer's request said
"equiheptatonic." The Kiganda (Baganda) tuning is **equipentatonic** — five
near-equal steps to the octave, ≈240 ¢ each (equi*hepta*tonic, seven equal
steps, is the Thai/Khmer idealization, a different machine for another day).
This brief designs on the equipentatonic law, which is what the amadinda
actually carries.

---

## 1 · What this machine is

**AMADINDA — the royal log xylophone of Buganda, played by three players of
whom only two compose.** The user sets the law — cycle length, transposition
level (*muko*), ensemble voice, tempo; the machine composes the two
interlocking parts (*okunaga* and *okwawula*) within Kiganda constraints,
then **derives the third part mechanically from the other two**, exactly as
the tradition does. At full speed the combined stream runs too fast for the
ear to follow as one line, and it splinters into *inherent patterns* —
melodies that emerge perceptually but that nobody is playing. That emergence
is the machine's whole subject.

Naming follows the catalogue rule (each machine named in the tradition's own
tongue): Luganda, and *amadinda* is the instrument's own name, the precedent
of FOLI / KHÖÖMEI / GONGAN. Directory `amadinda/`, `TIMBRE.id =
'amadinda'`, **op. XXIII provisional** — renumber at rebase per the
claiming-by-landing rule.

Why this and not another pentatonic machine: the catalogue has JI traditions
(BOLG, KHÖÖMEI, GONGAN), JI systems (DIAMOND, COCHLEA), one non-octave ET
(TRITAVA). AMADINDA adds a tradition whose law is **an equal division of the
octave** — not as a Western compromise but as the tuning's own ideal, proven
by the repertoire itself: the five *miko* transpositions only work because
every step is the same size. And it adds a compositional law no machine has:
**a part that is read off the whole rather than written** (okukoonera), and
music whose real content is emergent, not notated.

## 2 · Grounding (the research, condensed)

- **Buganda** is the largest traditional kingdom of Uganda; its court at the
  Lubiri (the Kabaka's palace, Mengo) kept professional musician guilds for
  centuries: the **amadinda** (12-key log xylophone) and **akadinda**
  (17-key, historically 22) xylophones, the **entenga** (a chime of 12 tuned
  drums plus ensemble drums, playing the same repertoire), the **ennanga**
  arched harp, flutes, lyres. In May 1966 government troops stormed the
  Lubiri (the Battle of Mengo); the court and its music stopped overnight.
  The repertoire survives because **Klaus Wachsmann** (curator, Uganda
  Museum) recorded and measured the instruments in the 1940s–50s, and
  **Gerhard Kubik** learned amadinda playing from the court musician
  **Evaristo Muyinda** and published transcriptions and analyses of the
  repertory (~50 amadinda compositions). Revival ensembles have since
  rebuilt the instruments and practice.
- **Tuning:** Wachsmann's measurements show Kiganda instruments tuned to
  five steps per octave, each near 240 ¢ with per-instrument deviations of a
  few tens of cents — an *equipentatonic* ideal each instrument approximates
  in its own way. There is no third-vs-minor-third distinction, no
  major/minor: five equivalent steps.
- **Amadinda practice (Kubik's account):** twelve keys, numbered 1 (lowest)
  to 12. Two players sit facing each other across the middle ten keys.
  - The **omunazi** plays **okunaga** ("to begin"): an isochronous row of
    notes — every note struck as a **parallel octave** (keys *n* and *n*+5,
    which are an exact octave apart in a 5-step scale) — on the even pulses.
  - The **omwawuzi** plays **okwawula** ("to divide"): the same kind of row,
    also in parallel octaves, exactly **in the gaps** — the odd pulses.
    Combined, they form one unbroken stream at double density.
  - The **omukoonezi** plays **okukoonera** on the two topmost keys, the
    **amatengezzi** (keys 11–12): he **duplicates, two octaves up, every
    occurrence of the two lowest keys (1–2) in the combined stream**. He
    composes nothing; he reads the total image and doubles its bass floor at
    the top of the instrument. The resulting high pattern is an *inherent
    pattern made audible*.
- **Inherent patterns:** at performance speed (the combined stream runs
  roughly eight to ten strokes a second) the ear cannot track the true
  parts; by pitch proximity it regroups the stream into separate melodic
  Gestalten (what auditory psychology calls stream segregation). Kiganda
  composers judge a piece by the patterns that *emerge*, and song texts are
  recognized in them. Kubik documented this in the 1960s; Ligeti later named
  Kiganda xylophone music among the sparks for his late piano études.
- **Miko** (sing. *muko*): the five transposition levels. Because all steps
  are equal, any piece can be shifted by 1–4 scale steps and remain exactly
  itself; the repertoire treats these shifts as standard practice. This is
  the strongest musical argument that the equal division is the law and not
  an approximation.
- **Form:** every piece is a closed cycle, repeated; common okunaga part
  lengths in the amadinda repertory are 12, 18, 24, and 36 notes (the
  combined cycle is twice that in pulses). Pieces begin staggered — okunaga
  alone, okwawula slotting in, okukoonera last — and run until cued off.
  Named classics of the repertory: *Ssematimba ne Kikwabanga*, *Olutalo
  olw'e Nsinsi* (the battle of Nsinsi), *Ganga alula*.

## 3 · The tuning law — equipentatonic, no JI anywhere

Everything sounds at

```
f(key k) = BASE × 2^((k−1)/5)        k = 1…12
```

`BASE` (key 1) is the engine's only Hz literal; it is **law, not voicing** —
it lives next to the scale tables, NOT in TIMBRE. Baked default **BASE =
122 Hz** (implementer may tune by ear in 110–150 and records the choice; low
enough to read as the log bass of the instrument, high enough that the
inharmonic bar partials stay clear). Adjacent keys are exactly 2^(1/5) apart
(240 ¢); keys *n* and *n*+5 are exactly 2:1. **No JI ratios, no 12-TET, no
`mtof`, no MIDI numbers anywhere in the signal path** — cents appear only as
display labels. After TRITAVA (no octave) this is the collection's second
deliberate departure from just intonation, and like TRITAVA it must be
stated plainly in the reader notes: *the equal division is the tradition's
own law, not a compromise.*

Reference table at BASE = 122 (for the implementer's sanity checks; derive,
don't hardcode):

| key | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hz | 122.0 | 140.1 | 161.0 | 184.9 | 212.4 | 244.0 | 280.3 | 322.0 | 369.8 | 424.8 | 488.0 | 560.6 |

**Voicing, not law:** real instruments deviate from the ideal by a few tens
of cents per key. TIMBRE gets `tuning.spread` (default ~6 ¢, range 0–30):
a per-key detune drawn deterministically from the pressing seed. At
`spread = 0` the tuning is mathematically exact 5-TET — that is the state
the acceptance tests measure.

## 4 · The interlock law (the composer)

### 4.1 The parts

- A **part** is a sequence of N **pitch classes** (degrees 0–4), N = the
  cycle length ∈ {12, 18, 24, 36}. Both parts have the same N.
- Every part note sounds as a **parallel octave pair**: degree *d* strikes
  keys (*d*+1) and (*d*+6) simultaneously (keys 1–10 span the two playing
  octaves). Parts are **strictly isochronous** — no rests, no sustains,
  every slot struck. Dynamics are even (small seeded velocity jitter is
  voicing, in TIMBRE, default subtle).
- **Okunaga** occupies even pulses (0, 2, 4, …), **okwawula** odd pulses
  (1, 3, 5, …). The combined cycle is 2N pulses. The two parts never sound
  simultaneously — strict alternation is structural.

### 4.2 Okukoonera — derived, never composed

For every pulse of the combined stream whose degree is **0 or 1**, the third
voice strikes the corresponding amatengezzi key (**11** for degree 0, **12**
for degree 1) at that pulse. That is the entire rule. It is computed from
the two parts at generation time; **there is no control over it and there
must never be one** — the point of the machine is that the third part is
read, not written. (Its notes are single strikes, not octave pairs — the
instrument has no keys above 12.)

### 4.3 The generator and the search

`genAll(seed, N, muko, …)` is seeded, deterministic, run once and cached:

1. **Okunaga** is composed as a seeded contour walk over degrees 0–4:
   steps of −2…+2 (taxed toward ±1), folding at the range edges, organized
   as 2–3 phrase segments (N divides naturally: 12 = 2×6, 18 = 3×6,
   24 = 2×12, 36 = 3×12) where later segments are variations (1–3 degree
   substitutions) of the first — the vocal-skeleton feel of the repertory,
   which derives its parts from song melodies.
2. **Okwawula** is *searched, not just sampled*: generate K candidate rows
   (K = 64, deterministic from the seed stream) by the same walk law, score
   each against okunaga, take the argmax (ties broken by candidate index).
   The score is the machine's ear for inherent patterns:
   - **Low-band density:** fraction of combined pulses with degree ∈ {0,1}
     must be in **[0.25, 0.50]** (hard constraint; this is what makes the
     okukoonera part non-trivial — never silent, never a machine gun).
   - **No stutter:** the combined stream never repeats one degree more than
     3 pulses in a row (hard constraint).
   - **Emergence score (soft, the ranking):** split the combined stream
     into three register bands (low = degrees 0–1, mid = 2–3, top = 4);
     reward each band's onset pattern for *repetition with contrast* — a
     strong cyclic sub-period (autocorrelation at N/2 or N/3) combined with
     at least two distinct inter-onset intervals. Exact weighting is the
     implementer's to tune by ear; the acceptance tests only check the hard
     constraints and determinism.
3. **Okukoonera** is then derived per §4.2.

The walk/search parameters (step taxes, K, score weights) are **law, not
voicing** — they live in the engine, not TIMBRE.

### 4.4 Miko — the five transpositions

`muko ∈ {0,1,2,3,4}` (UI: MUKO I–V). Transposition adds *muko* to every
degree **mod 5** — under equal steps this reproduces the piece exactly,
which is the tradition's own proof of the tuning. Key placement: degree *d*
maps to keys (*d*+1, *d*+6) *after* the mod — i.e. the pattern's octave
placement folds back into the ten playing keys, as it does on the real
instrument when a shifted pattern runs off the top. The okukoonera rule
applies **after** transposition (it always watches degrees 0–1 — the two
lowest *keys*, not two fixed pitch classes of the piece), so changing muko
genuinely recomposes the emergent part: the same piece yields five different
inherent patterns. Say this in the reader notes — it is the most magical
consequence of the law.

### 4.5 The performance arc

- **Entries are staggered, as at court:** okunaga alone for 1 cycle,
  okwawula joins for the next cycle, okukoonera joins on the third; from
  there the full texture loops.
- **Change-while-playing:** tempo/muko/ensemble edits re-vibe at the next
  cycle boundary (keyed off `ac.currentTime`); seed/N changes take a fresh
  generation, also at the boundary.
- **Ending:** on stop, finish the current half-cycle and cut clean (court
  pieces end on cue, not with a ritardando). No fades, no reverb tail
  swells — this music is dry and abrupt.
- **The WAV cut** renders the same arc deterministically: 1 + 1 cycles of
  entries, then enough full cycles to pass ~45–60 s total, ending clean on
  a cycle boundary.

## 5 · Tempo and the ensemble

### 5.1 Pulse

Tempo is expressed as the **combined stream rate** (both parts interleaved),
default **540 strokes/min** (9/sec), range **360–660**. Each player is thus
at half that — the historical performances run the combined stream at
roughly eight to ten strokes a second, fast enough that stream segregation
does the composing. Tempo is a law control (top UI), not TIMBRE.

### 5.2 The instruments (all synthesized, no samples)

Two ensemble voices, same score, user-switchable (ENSEMBLE control):

- **AMADINDA (default)** — twelve hardwood slats over banana stems: struck
  free-bar synthesis. Per key: fundamental + inharmonic bar partials at
  ratios ≈ **1 : 2.76 : 5.40** (free-bar transverse modes; truncate the top
  partial above ~4 kHz), each with its own exponential decay; decays scale
  by register (low keys ≈ 0.5 s → top keys ≈ 0.15 s); a 5–10 ms filtered
  noise thump for the mallet; **no resonators** — the sound is dry, woody,
  loud-attacked. The amatengezzi strikes are the same voice, naturally
  brighter/shorter by register.
- **ENTENGA** — the drum chime: twelve tuned drums carrying the identical
  repertoire. Per drum: membrane modes ≈ **1 : 1.5 : 2.0 : 2.9**, a fast
  initial pitch drop (~60 ¢ over ~40 ms), skin-noise transient, longer
  decays in the bass. Same 5-TET law, same score, same okukoonera — the
  point of including it is that the *law* survives the change of body.

Both voices are **buffer-baked per (voice, key)** and scheduled as strokes —
the FOLI/TAMBOUR family, not a live-oscillator machine. Rebakes on TIMBRE
edits are debounced and apply at next play (never restart mid-play — the
standing rebake convention); **► HEAR** is the instant audition path
(`TIMBRE.demo(group)` plays a few strokes of that voice through the real
graph in a private context).

### 5.3 Master chain

House pattern: per-voice gains (okunaga / okwawula / okukoonera as three
gain taps so the parts can be balanced and solo-auditioned) → gentle shaper
→ compressor → short dry-forward room send (seeded IR, small — a courtyard,
not a hall) → limiter → out. Default mix very dry; reverb is seasoning.
Peak target ≤ .92 on the cut.

## 6 · Skeleton

The spine follows the house shape:

- `SCALE` / `KEYS` tables + `BASE` (law block, top of script)
- `TIMBRE` block + verbatim OFFICINA bridge (copy from FORFEX/RILLE —
  see gotchas)
- `genAll(state)` → `{okunaga[], okwawula[], okukoonera[], score meta}` —
  pure, seeded (mulberry32/xmur3 per house precedent), cached
- `bakeVoices()` → per-(voice,key) buffers from TP
- `buildGraph()` → taps/master chain (realtime) and its offline twin
- `schedTick()` → lookahead scheduler walking the cycle against
  `ac.currentTime`, staggered entries, boundary re-vibe
- `cut()` → OfflineAudioContext render, 16-bit WAV, deterministic
- canvas: layer-cached wheel (see §8), render loop sleeps when idle
- `updateHash()`/`loadHash()`; `__iosAudio` + Media Session + silence
  anchor per the lock-screen sweep (see gotchas)

## 7 · Controls, hash, keys

Controls expose the law, nothing else:

| control | values | notes |
|---|---|---|
| CYCLE (*empagi*) | 12 / 18 / 24 / 36 | okunaga part length |
| MUKO | I–V | transposition level, exact under 5-TET |
| ENSEMBLE | AMADINDA / ENTENGA | same score, different body |
| TEMPO | 360–660 | combined strokes/min, default 540 |
| SEED + ALIUD | — | another pressing |

Labels English-first with the Luganda term carried alongside (the RILLE
lesson: English leads, the tradition's tongue stays visible). The three
part names OKUNAGA / OKWAWULA / OKUKOONERA appear as the canvas/ledger
legend with one-line English glosses.

Hash: `s=<seed>&n=<cycle>&k=<muko>&e=<ens>&t=<tempo>` — every param
round-trips; the hash *is* the pressing.

Keys: **space** play/stop · **p** pause/resume · **r** another · **c** cut
WAV (house standard). Optional per-machine: **1/2/3** toggle-mute the three
parts (audition the interlock the way Kubik teaches it — hear okunaga
alone, then the composite); if included, mutes are session-only, not
hash-serialized (they audition the law, they aren't the pressing).

## 8 · Canvas

The cycle is a closed loop, so the canvas is a **wheel** (the PEAL
precedent): 2N pulse slots around a ring.

- Okunaga slots and okwawula slots in two inks (alternating around the
  ring); each filled dot's radial position encodes its degree (five tracks).
- The okukoonera strikes as sparks on the outer rim — visibly *derived*:
  when a low-degree dot lights, its rim spark lights with it.
- Band arcs (low/mid/top) faintly tinted so the eye can find the inherent
  patterns the ear hears; this is the visualization's one idea — show the
  emergent grouping, not the parts.
- Rotating playhead; entries visibly add rings/inks as they join.
- `prefers-reduced-motion`: static wheel, slot highlight steps without
  animation. Layer-cache the wheel; only the playhead/highlights redraw.

Palette: log-wood and banana-leaf — dark umber field, raw-wood and dry-grass
inks, one hot ember accent for the amatengezzi sparks. Landing card emblem:
twelve slats with the interlock dots over them.

## 9 · TIMBRE sketch (~28 params, 6 groups)

Groups (all voicing, zero law): **master** (level, drive, comp), **bars**
(partial gains ×2, decay, decay-tilt by register, strike hardness),
**mallet** (thump level, noise color), **drums** (mode gains, pitch-drop
depth/time, skin noise, decay) , **balance** (okunaga/okwawula/okukoonera
taps, velocity jitter), **tuning+room** (spread ¢, octave stretch ¢, room
send/size). Factory defaults = the literals the implementer dialed; derived
buffer lengths may scale with edited decays but must equal the old constants
at factory values. `TIMBRE.touch` ramps gains/sends live; bar/drum edits
mark the bake dirty (debounced, applies next play). `TIMBRE.demo(group)`
per §5.2. Add the officina chip to `MACHINES`.

## 10 · "On this music" panel (content outline)

1. The court of the Kabaka — the Lubiri's musician guilds; amadinda,
   akadinda, entenga, ennanga; music as royal institution.
2. How three play twelve keys — okunaga/okwawula interlock in parallel
   octaves; okukoonera read off the total; nobody plays the melody you hear.
3. Inherent patterns — Kubik's term; stream segregation at speed; song
   texts recognized in patterns nobody strikes; the nod to Ligeti's études.
4. The tuning — five equal steps, ~240 ¢; Wachsmann's measurements; the
   miko proof (five transpositions, exact by construction); *equal division
   as the tradition's own law, not a Western grid*.
5. 1966 — the Battle of Mengo, the silencing of the court, survival through
   Muyinda, Wachsmann, Kubik; the revival.
6. What this machine does and honestly does not: generative within the
   documented law, not transcriptions of the historical repertoire; two
   synthesized bodies (log bars, drum chime); named classics exist and this
   machine is not quoting them.

## 11 · Do not touch / gotchas for the implementer

- **Copy the OFFICINA bridge verbatim** from FORFEX or RILLE — do not
  re-implement it. The FADÓ post-mortem is the cautionary tale: a bespoke
  bridge (`window.TIMBRE.touch = …` on a `const TIMBRE`) crashed the whole
  script at load. Wire `TIMBRE.touch`/`TIMBRE.demo` to real functions.
- `TIMBRE.id = 'amadinda'` === the directory name.
- **Law out of TIMBRE:** BASE, the 5-TET formula, cycle lengths, the
  okukoonera rule, miko, walk/search parameters. Voicing in TIMBRE: spread,
  stretch, decays, partials, taps, room.
- **Build in the lock-screen pattern from day one** (the sweep is mid-way
  down the op. list): no `ac.suspend()` on hide — `kick()` only, guarded on
  the pause flag; Media Session (play/pause/stop/next-track → ALIUD);
  silent looping `<audio>` anchor. Follow the COCHLEA-shape notes in the
  sweep thread.
- **No mid-play rebake on TIMBRE edits** (reads as a crash) — dirty flag +
  next play; ► HEAR is the audition path.
- Registry files get **minimal-diff rows only**; re-check the op. number at
  every rebase (XXIII is provisional; the directory name is the claim).
- Strict alternation means the scheduler never fires two parts on one
  pulse — if an implementation "fixes" a perceived flam by nudging offsets,
  it has broken the law, not improved the groove.
- Keep it **dry**. The reflex to add pad/drone/reverb glue must be resisted;
  the tradition's power is the naked interlock.

## 12 · Considered and rejected (don't "improve" these back in)

- **JI-izing the scale** (mapping to a 3-limit or harmonic pentatonic):
  rejected. The documented tuning is the equal division; miko transposition
  is exact *only* under equal steps. The equal temperament here is the
  authenticity, exactly as JI is elsewhere in the catalogue.
- **A knob for okukoonera** (density, register, on/off beyond the part
  mute): never. Derived-not-composed is the machine's thesis.
- **Akadinda mode in v1** (17 keys, triple interlock, two okwawula
  players): a genuinely different law variant — pick-up, not scope creep.
- **Baking Kubik's transcriptions as presets:** the machine composes within
  the law (the GRADUS precedent — Fux's rules, not Fux's examples); the
  named classics are honored in the reader notes instead. Pick-up idea if
  reliable public-domain notations are sourced.
- **A vocal/ennanga voice, ensemble drums, swing/humanized timing:** out.
  Parts are isochronous and even; the machine's motion comes from
  emergence, not groove micro-timing.
- **Free rhythm or rests in the parts:** the parts are strictly isochronous
  rows; that rigidity is what makes the emergent patterns figure against it.

## 13 · Acceptance — the verify gauntlet

Headless Chromium (playwright-core + bundled chromium, the house pattern);
enumerate the model first, then smoke the transport and the render. Zero
page errors throughout.

1. **Tuning law:** at `tuning.spread = 0`, every scheduled frequency equals
   `BASE·2^((k−1)/5)` within float eps; adjacent-key ratio is exactly
   2^(1/5); keys n and n+5 are exactly 2:1. `BASE` is the only Hz literal.
2. **Interlock:** for 40 seeds × all four cycle lengths: okunaga strikes on
   even pulses only, okwawula odd only, both strictly isochronous, every
   part strike a (k, k+5) octave pair within keys 1–10.
3. **Okukoonera derivation:** recompute independently from the two parts
   (combined degree ∈ {0,1} → keys 11/12 at that pulse) and diff against
   the engine's part — exact match, 40 seeds × 4 lengths × 5 miko.
4. **Miko:** the transposed pressing's degree sequence equals the
   original's +k mod 5; all strikes stay within keys 1–10 (+ amatengezzi);
   muko change while playing re-vibes at the cycle boundary.
5. **Generation constraints:** low-band density ∈ [0.25, 0.50] and
   no-stutter hold for every pressing; the candidate search is
   deterministic (same seed → same argmax, twice).
6. **Determinism:** same hash → identical event list and identical WAV
   (hash the rendered buffer); hash round-trips through a fresh load.
7. **Transport:** staggered entries land on cycles 0/1/2; play/pause/stop/
   another clean; change-while-playing applies at the boundary; part mutes
   (if built) affect output.
8. **Cut:** offline render NaN-free, non-silent, peak ≤ .92, ends on a
   cycle boundary, deterministic across two renders.
9. **TIMBRE/OFFICINA:** schema well-formed; bridge is byte-identical to the
   donor machine's; `set`/`bulk`/localStorage overlay round-trip;
   `TIMBRE.touch` on a tap measurably ramps the node; ► HEAR demo emits
   strokes; factory values equal the dialed literals
   (`verify-officina.mjs` pattern).
10. **Lock-screen:** context stays running on simulated hide; manual pause
    survives hide→show without waking (the RILLE pause gotcha); Media
    Session metadata updates on start/stop/ALIUD; silence anchor runs with
    the transport.
11. **Canvas:** reduced-motion honored; render loop sleeps when idle.

## 14 · Registration checklist (ship with the code)

- Landing `index.html`: card (own `--bg`, slat emblem) + counts
  twenty-two → twenty-three + `<meta>` description phrase.
- `README.md`: row + count.
- `HANDOFF.md`: file-table row, Architecture count, new Open-threads entry
  at the top folding in this brief's outcome.
- `CLAUDE.md`: count line.
- `officina/index.html`: `MACHINES` chip.
- In-page: `.exit` pill (back to opvscvla) + `.bench` pill (officina deep
  link), reader panel, keys line.
- **Delete `amadinda/OKWAWULA.md`.**
- All registry edits minimal-diff; rebase onto `origin/main` immediately
  before landing and re-check the op. numeral.

## 15 · Pick-up ideas (post-v1)

- **AKADINDA sibling mode** — 17 keys, okunaga vs. *two* okwawula players
  in triple interlock, part lengths up to 70: a second law under the same
  roof, or its own op.
- **Transcription presets** — the named classics from public-domain
  notation, selectable alongside generated pressings.
- **A "listen like a Muganda" toggle** — visually isolate one inherent
  pattern band at a time while the full audio runs, teaching the ear to
  flip between Gestalten.
- **Ennanga voice** — the harp carries the same interlock idea with sung
  text; a voice + harp machine is nearly a different op. (the FADÓ slot of
  this tradition).
- **OP–XY fork note:** 5-TET fits the device's native per-note tuning
  table (path A, plain notes, no MPE) — a cheap fourth demo for `opxy/`.

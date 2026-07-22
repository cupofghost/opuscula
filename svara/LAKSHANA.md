# SVARA · LAKSHANA — the brief for a Carnatic machine (op. XXIII provisional)

**Status: design complete, implementation NOT started.** This file is the
whole design; a later session implements from it. Written in the style of
`rille/HARMONIA.md` and `diamond/GENESIS.md` (the house precedents for a
no-code brief). The file is named after **rāga lakṣaṇa** — the stated law of
a raga, exactly what this document is — **delete this file when the machine
ships** and fold the result into the HANDOFF thread.

Per the claiming rule this brief claims the **concept and the directory name
(`svara/`), not the opus number** — XXIII is provisional until landing.

No code below — tables, laws, and acceptance criteria only. Where a concrete
constant appears it is a *baked default* the implementer copies into the
engine or TIMBRE; where a range appears the implementer tunes by ear within
it and records the choice in the HANDOFF thread.

---

## 1 · What this machine is

**SVARA — South Indian Carnatic music, composed as swara over the 22
shrutis.** The user picks a **raga** (the melodic law) and a **tala** (the
rhythmic cycle); the machine sings a short concert item — a staged
**ālāpana** (free-rhythm exploration of the raga over the tambura drone),
then a **pallavi** line elaborated through **sangati** variations against
the mridangam, closing with a **korvai** (a thrice-stated cadence that must
land exactly on the downbeat). Every pitch is an exact just ratio from the
classical **22-shruti** grid; every ornament (**gamaka**) is a continuous
curve whose anchor points are exact shrutis.

Naming follows the catalogue rule (each machine named in the tradition's
own tongue): **svara** (Sanskrit, from *svayaṁ rājate* — "that which shines
of itself") is the tradition's own word for the note. Directory `svara/`,
`TIMBRE.id = 'svara'`, op. XXIII provisional.

**This is the raga machine GENESIS §12 parked** ("magnificent tradition,
but a credible alap needs a melodic intelligence this framework can't yet
honor. Future op, not this."). The answer to that objection is Carnatic,
not Hindustani: where a Hindustani ālāp is forty open-ended minutes of
free melodic thought, the Carnatic item is **bounded and lawful at every
level** — the raga's lakshana (ascent/descent automaton, life-notes,
resting-notes, signature phrases) constrains melody the way Fux constrains
GRADUS; sangati is *variation of a fixed line*, not free invention; and
the korvai is pure arithmetic with a right answer, PEAL's truth condition
transplanted to rhythm. The machine never has to be "creative" — it has to
be **correct**, which is what this framework is good at.

Why this and not another drone-plus-melody machine (the other GENESIS
worry — that space is BOLG/KHÖÖMEI's): those machines' laws are a chanter's
fingering and a throat's formants. SVARA's laws are **the shruti grid**
(no other machine renders the comma-pair structure of a living tradition),
**the lakshana automaton** (direction-dependent scales, forbidden plain
notes), and **tala arithmetic** (the korvai identity). The drone is shared
furniture; the laws are new.

## 2 · Grounding (the research, condensed)

- **Shruti** (*śru-*, "that which is heard") is the smallest pitch interval
  the ear resolves as musically distinct; the classical count, from Bharata's
  *Nāṭyaśāstra* (~200 BCE–200 CE) through Śārṅgadeva's *Saṅgīta-ratnākara*
  (13th c.), is **22 to the octave**. They are not an equal division: they
  are the just positions melody actually visits, and ten of the twelve
  semitone regions split into a **pair of shrutis a syntonic comma (81/80,
  the *pramāṇa* shruti, ~21.5¢) apart**. Sa and Pa never split — they are
  *achala* (immovable), the frame the drone holds.
- **Swara** is the sung note — not a point but a *region with a life*: which
  shruti of the pair it sits on, and which gamaka it must carry, depend on
  the raga. The Carnatic maxim is that **the gamaka is the swara's identity,
  not its decoration** — in many ragas certain swaras may never be sung
  plain. Seven swara names (Sa Ri Ga Ma Pa Dha Ni), sixteen named variants
  (*svarasthānas*), twelve positions.
- **Raga lakshana** — a raga is defined by its **ārohana/avarohana**
  (ascending and descending scale, which may omit swaras — *varjya* — or
  zigzag — *vakra*, or differ by direction — *bhāṣāṅga*), its **jīva**
  swaras (life-notes dwelt on), **nyāsa** swaras (legal resting points),
  its gamaka assignments, and signature phrases (**prayogas**).
- **The melakarta system** (Veṅkaṭamakhin, 17th c.): 72 parent scales from
  pure combinatorics — Sa fixed, 6 Ri/Ga combinations × 2 Ma × 6 Dha/Ni
  combinations. The **katapayadi** scheme encodes each mela's number in its
  name's first two syllables. Janya ragas derive from a mela by omission,
  zigzag, or foreign notes.
- **Tala** — the cycle, kept by claps, waves, and finger counts (*kriyā*).
  The downbeat is **samam**; a cadence that fails to land on it is simply
  wrong. A **korvai/mora** states a phrase **three times** (threes are the
  tradition's signature) with equal gaps, arithmetically sized so the last
  stroke falls exactly on samam.
- **The instruments**: the **tambura** drone (pa–sa–sa–SA), whose curved
  *jvāri* bridge makes each string bloom through a cascade of overtones —
  the shruti reference the singer tunes against; the **voice** (Carnatic
  music is voice-first; instruments imitate it), singing *ākāram* (the open
  "aa") in ālāpana; the **mridangam**, whose loaded right head C. V. Raman
  showed produces genuinely **harmonic** partials — a drum tuned to Sa,
  i.e. a pitched member of the JI system, not just a clock.
- Sa is not a fixed concert pitch — each singer chooses their own (*kaṭṭai*).
  This machine bakes one.

## 3 · The tuning law — 22 shrutis, zero ET

Everything sounds at

```
f = SA × R × 2^k        R a shruti ratio [num,den], k an integer register fold
```

**`SA = 196`** (G3, "5 kaṭṭai" — a standard female tonic; a mezzo range
matches FADÓ's precedent) is the engine's only Hz literal; it is **law, not
voicing** — it lives next to the shruti table, NOT in TIMBRE. Ratios are
**integer pairs end to end**; cents appear only as display labels. No
`mtof`, no MIDI, no ET anywhere.

### 3.1 The 22-shruti grid (master table)

Ascending; cents for canvas labels only. The bracketed pairs are the ten
**comma pairs** — two shrutis 81/80 apart sharing one semitone region:

| # | ratio | ¢ | | # | ratio | ¢ |
|---|---|---|---|---|---|---|
| 1 | 1/1 | 0 | | 12 | 45/32 ⌉ | 590 |
| 2 | 256/243 ⌉ | 90 | | 13 | 729/512 ⌋ | 612 |
| 3 | 16/15 ⌋ | 112 | | 14 | 3/2 | 702 |
| 4 | 10/9 ⌉ | 182 | | 15 | 128/81 ⌉ | 792 |
| 5 | 9/8 ⌋ | 204 | | 16 | 8/5 ⌋ | 814 |
| 6 | 32/27 ⌉ | 294 | | 17 | 5/3 ⌉ | 884 |
| 7 | 6/5 ⌋ | 316 | | 18 | 27/16 ⌋ | 906 |
| 8 | 5/4 ⌉ | 386 | | 19 | 16/9 ⌉ | 996 |
| 9 | 81/64 ⌋ | 408 | | 20 | 9/5 ⌋ | 1018 |
| 10 | 4/3 ⌉ | 498 | | 21 | 15/8 ⌉ | 1088 |
| 11 | 27/20 ⌋ | 520 | | 22 | 243/128 ⌋ | 1110 |

Structural facts the verify gauntlet checks exactly: **22 = 2 achala (1/1,
3/2) + 10 comma pairs**; every pair's ratio is exactly 81/80 by
cross-multiplication; all ratios in [1, 2).

### 3.2 Svarasthānas → shrutis

Each variable svarasthāna owns one comma pair; **the raga chooses which
member sounds** (that choice IS the concept of shruti made audible — the
"same" swara sits a comma apart in different ragas):

| svarasthāna | name | pair |
|---|---|---|
| R1 | śuddha ri | 256/243 · 16/15 |
| R2 = G1 | chatuśruti ri | 10/9 · 9/8 |
| R3 = G2 | sādhāraṇa ga | 32/27 · 6/5 |
| G3 | antara ga | 5/4 · 81/64 |
| M1 | śuddha ma | 4/3 · 27/20 |
| M2 | prati ma | 45/32 · 729/512 |
| D1 | śuddha dha | 128/81 · 8/5 |
| D2 = N1 | chatuśruti dha | 5/3 · 27/16 |
| D3 = N2 | kaiśiki ni | 16/9 · 9/5 |
| N3 | kākali ni | 15/8 · 243/128 |

S = 1/1 and P = 3/2, always (achala). The enharmonic identities (R2=G1
etc.) are position aliases; a raga uses each position under exactly one
name — DIAMOND's cell-vs-pitch lesson applies (identity lives in the
model, not in float equality).

### 3.3 The eight ragas (baked lakshana tables)

Curated, not the full 72 — a raga without its gamaka map is a scale, and
the machine renders ragas, not scales (see §12). Ratio assignments are
**baked defaults chosen from each swara's pair**; the implementer may
re-choose *within the pair* by ear and must record the choice — pair
membership is the law, the member is a documented lakshana default.

| raga | mela | ārohana | avarohana | ratios (S,P implied) |
|---|---|---|---|---|
| **ŚAṄKARĀBHARAṆAM** | 29 | S R2 G3 M1 P D2 N3 Ṡ | reverse | R 9/8 · G 5/4 · M 4/3 · D 5/3 · N 15/8 |
| **KALYĀṆI** | 65 | S R2 G3 M2 P D2 N3 Ṡ | reverse | R 9/8 · G 5/4 · M 45/32 · D 5/3 · N 15/8 |
| **KHARAHARAPRIYĀ** | 22 | S R2 G2 M1 P D2 N2 Ṡ | reverse | R 10/9 · G 6/5 · M 4/3 · D 5/3 · N 9/5 |
| **TŌḌI** (Hanumatōḍi) | 8 | S R1 G2 M1 P D1 N2 Ṡ | reverse | R 256/243 · G 32/27 · M 4/3 · D 128/81 · N 16/9 |
| **MĀYĀMĀḶAVAGAUḶA** | 15 | S R1 G3 M1 P D1 N3 Ṡ | reverse | R 16/15 · G 5/4 · M 4/3 · D 8/5 · N 15/8 |
| **MŌHANAM** | janya of 28 | S R2 G3 P D2 Ṡ | reverse | R 9/8 · G 5/4 · D 5/3 |
| **HINDŌḶAM** | janya of 20 | S G2 M1 D1 N2 Ṡ | reverse | G 6/5 · M 4/3 · D 8/5 · N 16/9 |
| **BHAIRAVI** | janya of 20 | S R2 G2 M1 P **D2** N2 Ṡ | Ṡ N2 **D1** P M1 G2 R2 S | R 10/9 · G 6/5 · M 4/3 · D2 5/3 ↑ / D1 8/5 ↓ · N 9/5 |

Deliberate shruti stories baked into these defaults, for the reader notes
and the verify gauntlet:

- **Kharaharapriyā's ri = 10/9** where Śaṅkarābharaṇam's ri = 9/8: the
  same svarasthāna, a pramāṇa shruti apart — the flagship demonstration.
- **Tōḍi takes the *lower* (Pythagorean) member of every pair** — the
  tradition hears Tōḍi's swaras as leaning into the notes below, and every
  one of them lives under kampita (§4.2).
- **Bhairavi is bhāṣāṅga**: chatuśruti dha (5/3) ascending, śuddha dha
  (8/5) descending — the direction-dependent case the automaton (§5.1)
  exists to enforce. Note these are different svarasthānas, not a comma
  pair.
- **Melodic JI keeps what harmonic JI kills**: Śaṅkarābharaṇam's R 9/8
  against D 5/3 is a wolf 40/27 — irrelevant, because this music never
  sounds them together; only against the drone. That is *why* a 22-point
  grid survived in this tradition while Europe tempered it away. (Reader
  note; also the reason the voice needs no chord logic.)

Per-raga metadata the generator reads (baked): **jīva** swaras (dwell
weights), **nyāsa** swaras (legal phrase endings), a **gamaka map**
(§4.3), and 2–4 **prayogas** (signature phrases as swara strings, e.g.
Śaṅkarābharaṇam `S R G M P`, `P D N Ṡ`, `Ṡ N D P M G R S` closings;
Mōhanam `G P D Ṡ D P G`; Tōḍi `D N Ṡ R̄ G̈? — no: stay within sthāyi
limits, implementer picks from standard sources`). Prayogas are seeds for
phrase generation, not verbatim loops.

## 4 · Gamaka — the swara's identity (the melody renderer)

### 4.1 The law

Melody events are **anchor + curve**: the anchor is an exact shruti (the
verifiable part); the gamaka is a continuous pitch path whose **every
turning point is also an exact shruti** (anchor's neighbor in the raga, or
the anchor's own comma twin). Between turning points the path is smooth
(cosine-eased); the curve is sampled deterministically and applied to the
voice's frequency (`setValueCurveAtTime` family — implementer's call), and
the identical arrays drive the offline render.

### 4.2 The gamaka set (v1: five + plain)

| gamaka | motion | typical use |
|---|---|---|
| **dīrgha** (plain) | steady on the anchor | achala swaras; Māyāmāḷavagauḷa's calm |
| **kampita** | oscillation anchor ↔ neighbor shruti, 4–7 Hz scaled to tempo, asymmetric duty (dwell on anchor, flick to neighbor) | Tōḍi ga/dha (mandatory), Kalyāṇi ma toward Pa, Bhairavi ga |
| **jāru** | continuous slide into the anchor from the previous swara (ascending *eṭra* / descending *iṟakka*), 60–200 ms | Mōhanam's leaps, phrase heads |
| **nokku** | grace touch from the swara above at onset, ~80 ms | Śaṅkarābharaṇam ri/dha |
| **sphurita** | re-articulation of a repeated swara with a lower-neighbor flick | repeated notes anywhere |
| **orikkai** | end-of-note flick to the upper neighbor before a descent | phrase tails in sampūrṇa ragas |

### 4.3 The gamaka map (per raga per swara)

Baked table: for each raga, each swara gets `{default gamaka, mandatory?}`.
The maxim to enforce: **in Tōḍi and Bhairavi, ga and dha are never plain**
(kampita mandatory); in Māyāmāḷavagauḷa most swaras are dīrgha (it is the
teaching raga — the calmest of the eight); everywhere, Sa and Pa are dīrgha
(the drone owns them). Kampita depth/rate ranges live in TIMBRE (voicing);
*which* gamaka a swara carries is law and stays out of TIMBRE.

## 5 · The composer

### 5.1 The lakshana automaton (all melody passes through it)

The generator may only move between swaras along **ārohana when rising and
avarohana when falling** — the two scales are directed graphs (successor
lists), which lawfully handles varjya (omitted swaras never appear in that
direction), vakra (zigzag paths followed as written), and bhāṣāṅga
(Bhairavi's two dhas). Phrases must end on **nyāsa** swaras; dwell
durations are weighted toward **jīva** swaras. This is GRADUS's move: the
tradition's rulebook as the generator's type system.

### 5.2 The form (one pressing = one small concert item)

```
ĀLĀPANA  (free rhythm, no tala, no drum)      ~35–50 s
PALLAVI + SANGATI  (tala, mridangam)          6 āvartanas default
KORVAI  (the arithmetic cadence)              last 2 āvartanas
→ land on Sa at samam · drone tail · loop
```

- **Ālāpana, staged** (the traditional build, bounded): stage 1 hovers
  around madhya Sa (mandra ni–ma range); stage 2 opens to Pa; stage 3
  reaches for tara Sa (the one climax touch); stage 4 descends home to a
  nyāsa close. Phrase lengths and breaths seeded; each phrase is a
  constrained walk (automaton + prayoga seeding + jīva dwell); range
  ceiling enforced per stage. No pulse — phrase rhythm is seeded from a
  long/short syllable pool (the machine breathes, it doesn't tick).
- **Pallavi**: one 1-āvartana line generated on the tala grid (automaton
  walk, starts at samam, ends on a nyāsa swara), then repeated with
  **sangati** elaboration — each repeat substitutes plain tones with their
  gamaka forms, subdivides long tones, and widens range slightly; repeat
  N's variation is seeded and *cumulative* (the traditional progressive
  unfolding, and the anti-"sounds like a repeat" cure — RILLE's divisions
  lesson, but it is native to this tradition). Mridangam enters at the
  first samam with sarvalaghu (pattern bank per tala, density arc rising
  with sangati index).
- **Korvai**: over the final two āvartanas, voice and mridangam in rhythmic
  unison state a seeded phrase **three times separated by two equal gaps**,
  sized by the identity in §6.2, final stroke and sung Sa landing exactly
  on samam. Then the drone rings; the loop seam sits in the drone-only air
  (GONGAN's fold — the return to the ālāpana is the encore).

## 6 · Tala and the mridangam

### 6.1 The talas (chip row)

| tala | aṅgas | beats | kriyā accents |
|---|---|---|---|
| **ĀDI** (default) | laghu 4 + dhruta 2 + dhruta 2 | 8 | claps on 1, 5, 7; finger counts 2–4; waves 6, 8 |
| **RŪPAKA** | dhruta 2 + laghu 4 | 6 | claps on 1, 3; wave 2; fingers 4–6 |
| **MIŚRA CHĀPU** | 3 + 2 + 2 | 7 | accents 1, 4, 6 |
| **KHAṆḌA CHĀPU** | 2 + 3 | 5 | accents 1, 3 |

**GATI** (subdivision) chip: chatusra **4** (default) · tiśra 3 · khaṇḍa 5
pulses per beat. TEMPO slider = beats/min, 52–92, default 72 (Ādi āvartana
≈ 6.7 s). A soft **kriyā** voice (clap/finger tick, TRITAVA's PULSUS role)
marks the aṅga structure — quiet, mixable to zero in TIMBRE.

### 6.2 The korvai identity (PEAL's truth condition, in rhythm)

With span = 2 āvartanas × beats × gati pulses, seeded gap g and phrase
length T must satisfy **3T + 2g = span** exactly (T, g integers, T ≥ 4,
g ≥ 0; g ≡ 2·span (mod 3) picks the residue class, seed picks within it).
The phrase itself is a seeded stroke pattern ending **ta-dhin-gi-ṇa-thom**
(the tradition's cadential tag); the third statement's thom is samam.
This equation is verified for every seed × tala × gati — it is the
machine's PEAL-style "is it *true*" check.

### 6.3 Mridangam synthesis (no samples)

Five strokes, modal synthesis (FOLI/TAMBOUR precedent), **right head tuned
to SA** (Raman's harmonicity — the loaded head's partials near-integer, so
the drum is *in the tuning system*):

- **nam** — rim, bright, Sa partials (1, 2, 3×) fast decay
- **dhin** — open ring on Sa, the longest sustain
- **chāpu** — sharp slap, noise + high partials
- **thom** — left head bass, ~SA/2 region with **gumki** pitch swoop
  (a rising bend after the strike — the machine's one *percussion* curve)
- **dhom** — nam + thom struck together

Strokes are **baked buffers** keyed on TIMBRE params (rebake debounced,
no mid-play rebake — the FOLI lesson; ► HEAR is the audition path).
Sarvalaghu = per-tala pattern bank walked with seeded fills, density
rising over sangatis, silent in ālāpana.

## 7 · The other voices

- **Tambura** — four strings, **pa–sa–sa–ṠA** tuning (**sa–sa–ṠA + ma 4/3**
  for the P-less HINDŌḶAM — the traditional accommodation; the table is
  law). Each string a rich harmonic series whose upper partials **bloom and
  recede on a slow cycle** (the jvāri): implement as a plucked series with
  a slowly sweeping resonance emphasis; strings plucked in the traditional
  staggered round, period seeded. Continuous through the whole pressing;
  it is the intonation reference every anchor is verified against.
- **Voice** — the melody. Sung *ākāram*: source (saw/pulse blend) → 3–4
  formant bandpasses on an "aa" vowel + breath noise; gamaka curves drive
  frequency; a gentle onset consonant softening per phrase head. Range
  mandra Pa – tara Sa (≈ SA×3/4 to SA×2 — a mezzo octave-and-a-half).
  Timbral params (formants, breath, brightness) are TIMBRE; **pitch is
  never TIMBRE** (all pitch is law).
- **Kriyā** — the tick of §6.1.

**Master chain**: shaper → compressor → out trim; one room send, modest
default (a concert hall, not a cathedral — wet ~0.12); peak ≤ −1 dBFS
(house headroom).

## 8 · Skeleton

**Scheduler family** (BOLG/FADÓ, not prerender): `genAll(seed, params)` →
`{alapana: [phrases], pallavi: [avartanas], korvai, drum: [events],
tamburaPlan}` cached once; a `schedTick` walks it against `ac.currentTime`
with lookahead; voice phrases are scheduled as osc + curve automation
windows; mridangam strokes are baked-buffer plays; offline render replays
the identical score into an `OfflineAudioContext` for the WAV cut.
Deterministic throughout (one seeded RNG stream, no `Math.random`).

Ship with the **Media Session / lock-screen pattern already in place**
(copy-adapt from COCHLEA per the sweep thread: no hide-suspend, silent
`<audio>` anchor, metadata on start/stop/take-change) so the in-flight
sweep never needs to touch this machine. OFFICINA bridge **verbatim**
(the FADÓ bugfix thread documents the cost of a bespoke one);
`TIMBRE.touch` ramps live nodes (master/room/voice/tambura) and flags
mridangam rebake; `TIMBRE.demo(group)` = one tambura round / a sung Sa–Ri–Sa
with kampita / a stroke sequence / a kriyā bar.

## 9 · Controls, hash, keys

One chip row per law, house grammar:

- **RĀGA**: the eight of §3.3 (default **ŚAṄKARĀBHARAṆAM**)
- **TĀLA**: ĀDI (default) · RŪPAKA · MIŚRA CHĀPU · KHAṆḌA CHĀPU
- **GATI**: **4** · 3 · 5
- **TEMPO** slider (52–92 bpm, default 72) · **SEED** via `r`

Hash `#v1·s<seed>·r<0-7>·t<0-3>·g<0-2>·b<tempo>` — every param
round-trips; changing RĀGA/TĀLA/GATI regenerates at next play. Keys:
**space** play/stop · **p** pause/resume · **r** another · **c** cut WAV.

## 10 · Canvas

Left, **the shruti wheel** — the one image this machine is about: the 22
shrutis as points on a circle (Sa at top, Pa opposite-ish at its 702¢
place; comma pairs drawn as close twins), the active raga's chosen shrutis
lit, the rest faint. A **live pitch needle** traces the voice's actual
frequency around the wheel — so a kampita is *visible* as the needle
swinging between two lit points, and a jāru as a sweep across dark ones.
The needle is the concept of shruti made an image: melody living on, and
between, the 22 points. Layer-cache the wheel; rebuild on raga change.

Right, **the tala lane**: the āvartana as aṅga boxes with kriyā symbols
(clap `|`, wave `O`, finger dots), the beat cursor walking it; sangati
counter; during the korvai a **3× countdown** highlights each statement so
the eye can verify the landing. During ālāpana the lane rests dark and a
small stage indicator (I–IV, range arc) shows instead.

`prefers-reduced-motion`: needle and cursor become discrete steps (no
sweep animation); render loop sleeps when stopped.

## 11 · TIMBRE sketch (~32 params, 6 groups)

`master` (drive, comp threshold/ratio, out trim, wet) · `room` (size,
decay) · `tambura` (jvāri brightness, bloom rate, string stagger,
pluck softness, level) · `voice` (formant set/vowel width, brightness,
breath, onset softness, kampita depth trim, level) · `mridangam` (right
head tone/ring, nam brightness, thom depth, gumki amount, level) ·
`kriya` (tick tone, level).

The law stays out of TIMBRE: SA=196, the shruti table, raga lakshana
tables, gamaka maps, tala/gati tables, the korvai identity, tambura
tuning table. `kampita depth trim` scales *within* the lawful interval,
never past the neighbor shruti (a voicing trim on a lawful motion — same
logic as RILLE's level trims on lawful notes).

## 12 · Considered and rejected (don't "improve" these back in)

- **All 72 melakartas as a free dial.** Seductive combinatorics (and the
  katapayadi law is lovely — see pickups), but a raga without its gamaka
  map and prayogas is just a scale, and the machine would render scales.
  Eight ragas *with lakshana* over a dial of 72 without it. The wheel-of-72
  canvas belongs to that future mode, not v1.
- **Hindustani ālāp instead of the Carnatic item.** The open-ended form is
  exactly what GENESIS §12 rightly feared. The Carnatic item is bounded,
  tala-anchored, and arithmetic at the cadence — every section has a law
  with a right answer.
- **Veena instead of voice.** Easier to synthesize credibly (KS + bends),
  but Carnatic is voice-first and the catalogue already sings (NENIA,
  KHÖÖMEI, VYVID, FADÓ) — the precedent chain exists. Veena is a pickup
  voice, not a v1 substitution.
- **A violin shadow** (the concert texture): real, lovely, doubles the
  melody complexity for one texture win. Pickup.
- **Equal-tempered "close enough" shrutis or cents-based pitch.** The
  entire point is the comma pair. Integer pairs end to end; the gauntlet
  enforces it.
- **Swara-syllable singing (solfège consonants) in v1.** Kalpana swaras
  need per-syllable formant articulation; ākāram delivers the melody law
  without a diction engine. Pickup (§15).
- **Reverb as atmosphere.** Same as DIAMOND: the tambura provides the
  halo. Keep the room modest.

## 13 · Acceptance — the verify gauntlet

`scratchpad/verify-svara.mjs` (playwright-core + bundled Chromium), house
pattern. Enumerate then smoke:

1. **Shruti table**: 22 entries, exact integer pairs of §3.1; ten comma
   pairs at exactly 81/80 by cross-multiplication; 1/1 and 3/2 pairless;
   all in [1, 2).
2. **Anchor law**: every scheduled voice anchor and every gamaka turning
   point = SA × R × 2^k for R in the active raga's assigned set (exact
   rational identity, 1e-9 relative on the final float); tambura strings
   match the tuning table (incl. Hindōḷam's ma variant); mridangam right
   head partials sit on SA.
3. **Automaton** (≥ 40 seeds × all 8 ragas): every melodic step follows
   ārohana rising / avarohana falling; varjya swaras absent in the
   forbidden direction; **Bhairavi never sounds D2 falling or D1 rising**;
   phrases end on nyāsa swaras; ālāpana stage range ceilings respected.
4. **Tala**: āvartana pulse counts exact per tala × gati; kriyā accents on
   aṅga heads; mridangam events on the pulse grid; drum silent during
   ālāpana.
5. **Korvai**: 3T + 2g = span exactly for every seed × tala × gati; three
   statements identical; final stroke and final sung Sa at samam; T ≥ 4,
   g ≥ 0.
6. **Determinism**: `genAll` byte-identical across two runs (same
   seed+params); offline render sample-identical across two cuts.
7. **Render**: NaN-free, peak ≤ −1 dBFS, each voice non-silent when
   soloed; the loop seam falls in drone-only air.
8. **Plumbing**: realtime context runs; pause/resume respects the manual
   flag under visibility churn (the RILLE pause gotcha, re-checked here
   since Media Session ships day one); hash round-trips on fresh load;
   WAV cut clean; OFFICINA schema well-formed, set/bulk/localStorage
   round-trip; zero pageerrors.

## 14 · Registration checklist (ship with the code)

- `index.html`: op. XXIII card (suggested `--bg:#1a1208` — turmeric-dark,
  the kumkum/manjal color world; emblem idea: the shruti wheel itself,
  22 points with the comma twins visible); counts twenty-two →
  twenty-three wherever stated (re-check the registry at rebase — the
  number is provisional until landing).
- `README.md`: row XXIII, house style — open "South Indian Carnatic
  music — svara over the twenty-two shrutis…"; state the comma-pair law,
  raga lakshana as automaton, the korvai identity, voice-first, Raman's
  harmonic drum, zero ET.
- `HANDOFF.md`: file-structure line, counts, the open thread updated
  (design → shipped); `CLAUDE.md` count line likewise.
- `officina/index.html`: chip in `MACHINES`.
- Delete this file (`svara/LAKSHANA.md`) when done.

## 15 · Pick-up ideas (post-v1)

- **Kalpana swaras** — the voice singing solfège syllables (sa-ri-ga…)
  with a small consonant-diction layer; the korvai then *sung by name*.
- **The melakarta wheel** — all 72 as a second mode with a generic gamaka
  map, katapayadi decoding on the canvas (name → number as a live
  display); the 12-chakra wheel is the alternate canvas image.
- **A violin shadow** trailing the voice by a fraction of a beat
  (the concert texture).
- **Neraval / eduppu** — off-samam starts (the pallavi entering after the
  beat) and text-rhythm elaboration; needs the diction layer.
- **More ragas** — Hamsadhvani, Ābhōgi, Madhyamāvati (the concert-closing
  raga — a nice loop-seam joke), each a lakshana table + gamaka map away.
- **Tani āvartanam** — a drum solo section trading with the kriyā before
  the korvai.

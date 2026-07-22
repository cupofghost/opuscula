# INTONATIO — design brief for BANI (provisional op. XXIII)

**Machine:** BANI — Georgian three-part polyphony (*mravalkhmianoba*) with an
adaptive-intonation engine. **Directory:** `bani/` (this brief claims the
concept and the directory name, **not** the opus number — XXIII is provisional
until landing; re-check the registry at every rebase). **File when built:**
`bani/index.html`, single-file, zero deps, per house rules.

**Lifecycle:** this is the design session of a two-session build (SUBLOW/VYVID
precedent). The next session implements `genAll`/`buildGraph`/scheduler/`cut`/
canvas against this brief, verifies headless, registers the op everywhere, and
**deletes this file**, folding the outcome into the HANDOFF Open-threads entry.

---

## §1 The tradition (for the reader notes, and to keep us honest)

Georgian traditional song is **three-part vocal polyphony** — *mravalkhmianoba*
(მრავალხმიანობა, "many-voicedness") — proclaimed a UNESCO Masterpiece of Oral
and Intangible Heritage in 2001 (inscribed 2008). The Kakhetian table song
**"Chakrulo"** flew on the Voyager Golden Record in 1977. It is a living,
sung-at-the-table music: the *supra* (feast) with its *tamada* (toastmaster) is
the natural habitat of the eastern table songs.

The shared spine: a **bass — bani (ბანი)** — sung by everyone, and two upper
parts sung by soloists: **mtkmeli (მთქმელი, "the teller")**, the middle voice
that leads and states the text, and **modzakhili (მოძახილი, "the caller-along")**
above. The regions (*kutkhe*, კუთხე — "corners") realize this spine in
sharply different textures; the machine models three:

- **KAKHETI (east):** long-table drone songs. Two soloists trade long
  melismatic phrases in free rhythm over a slow-moving collective bani drone
  ("Chakrulo", "Mravalzhamier").
- **GURIA (west):** the famous contrapuntal trios — three genuinely
  independent lines, the top being **krimanchuli (კრიმანჭული)**, a rhythmic
  yodel snapping between chest and falsetto on vocables. (The four-part
  *naduri* field-work songs add a fourth "crowing" part, *gamqivani* — reader
  notes only, not modeled.)
- **SVANETI (highlands):** slow homorhythmic chord processions, all three
  voices moving in parallel through archaic, dissonance-rich sonorities
  ("Lile", "Zari", "Kviria").

**The tuning is the point.** The key modern dataset is the 1966 Tbilisi
Conservatory tape recordings of **Artem Erkomaishvili** (1887–1967), the last
master chanter of the old Gurian school, who overdubbed himself singing all
three parts of ~100 chants — probably the earliest self-overdub recordings in
ethnomusicology. Computational analyses of that corpus (Frank Scherbaum &
Nana Mzhavanadze; Meinard Müller & Sebastian Rosenzweig's annotated dataset)
and the Georgian theorists' scale models (Malkhaz Erkvanidze; Zaal Tsereteli &
Levan Veshapidze; cf. Simha Arom & Polo Vallejo's fieldwork) converge on this
picture:

1. **Vertical (harmonic) intervals are tuned near-pure:** fifths ≈ 702 ¢,
   fourths ≈ 498 ¢, octaves ≈ 1200 ¢ — the stable skeleton.
2. **Thirds are neutral** — ≈ 350 ¢, between minor and major, neither 5-limit
   just nor tempered. Sixths correspondingly ≈ 850 ¢.
3. **Melodic seconds are flexible**, clustering around ≈ 170–200 ¢ (the
   quasi-evenly-divided tetrachord of the Tsereteli–Veshapidze and Erkvanidze
   models) rather than sitting on a diatonic whole/half grid.
4. **The pitch reference drifts** over a performance — the ensemble re-anchors
   at each cadence and the tonal center migrates by tens of cents across a
   song, systematically and without anyone minding.

So the tradition's tuning is not a fixed scale at all: it is **adaptive
intonation** — vertical purity negotiated in real time against the bani, with
melodic step-sizes as a softer prior, and drift as the audible residue of that
negotiation. That is the law this machine renders.

## §2 The law — the adaptive-intonation engine (the machine's signature)

**Departure, stated up front:** the collection's other tuned machines (SCALA,
COCHLEA, DIAMOND, TRITAVA, FADÓ…) are exact-ratio JI because their traditions
are exact. Georgian tuning is demonstrably *neither* JI nor ET — the measured
thirds are neutral and the system is context-dependent — so here "correctness
where the domain has a right answer" *requires* an adaptive engine, not a
ratio table. Zero 12-ET anywhere in the traditional mode (ET exists only as
the explicit A/B contrast, §6). One Hz literal: `BASE = 110` (the bani's home
degree; everything else is solved in cents-space relative to it).

**Pitch is solved, not looked up.** Every note event carries symbolic intent
from the grammar (§4): its **degree** in the song's frame, and its **interval
class** against each voice sounding at its onset. The realized pitch (in cents
above `BASE`) is the closed-form weighted mean of three pulls:

```
p = ( Σj wj·(pj + T[icj])  +  wm·(pown_prev + M[step])  +  wa·F[degree] )
    / ( Σj wj + wm + wa )
```

- **Harmonic pull** — for each sounding voice j at realized pitch `pj`, the
  target is `pj + T[icj]`, the interval-class target table (¢):

  | ic | target | weight wj |
  |----|-------:|----------:|
  | unison   | 0    | 5.0 |
  | second   | 180  | 0.8 (the cadential "crunch" is real but soft-tuned) |
  | third    | 350  | 2.5 (neutral — the signature color) |
  | fourth   | 498  | 4.0 |
  | fifth    | 702  | 5.0 |
  | sixth    | 850  | 2.0 |
  | seventh  | 1000 | 0.8 |
  | octave   | 1200 | 4.0 |

- **Melodic pull** (weight `wm = 1.0`) — own previous pitch plus the step
  target `M[step]`: seconds ≈ 172 ¢ (region-nudged: KAKHETI 178, GURIA 168,
  SVANETI 172), thirds = two seconds, fourth = 498, fifth = 702. Signed.
- **Frame pull** (weight `wa`) — a drifting scale frame `F` = origin +
  degree·seconds-grid, `wa = 0.25` for upper voices, **`wa = 2.0` for bani**
  (Scherbaum's measured asymmetry: the bass is the steadiest voice; the
  upper voices tune to *it*, which is why the machine is named BANI).

**Cadence lock:** on line-final sonorities all harmonic weights are ×50, so
finals land on *pure* unison / fifth / octave against the realized bani —
the crunch resolves to a locked consonance by construction, VYVID-convergence
style but earned through the solver rather than a detune ramp.

**Drift is emergent, never scripted:** after every line-final, the frame
origin re-anchors to the *realized* bani cadence pitch
(`F.origin += p_bani_realized − F[cadence_degree]`). The small per-cadence
residues accumulate exactly as in the Erkomaishvili corpus — a few cents per
strophe, tens of cents per song, deterministic per seed. A live meter shows
cumulative drift in cents (COCHLEA precedent).

**Determinism:** the solver is a pure function of (score, weights, order of
evaluation). Evaluation order per onset: bani first, then mtkmeli, then the
top voice — same order every time. Same seed + law ⇒ bit-identical pitch
track; the offline cut re-runs the identical solve.

## §3 Voices and regional grammars

Male ensemble (the table/work/procession repertoires modeled here are
male-sung; stated plainly in the reader notes). Ranges, cents above/below
`BASE=110`: **BANI** −500…+400 · **MTKMELI** +200…+1300 · top voice
(**MODZAKHILI** / **KRIMANCHULI**) +700…+2100 (krimanchuli falsetto flips to
the top of that).

Shared structural laws, all regions:
- **Mtkmeli opens every strophe alone** (the *damts'q'ebi* — "beginner" —
  role); bani enters at his first line-final, the top voice after that.
- Line-finals are unison or open fifth (+octave when the top is high);
  penultimate sonorities prefer the second/fourth crunch (ic-2 against a
  neighbor is *encouraged* on the approach, weight untouched — soft-tuned
  dissonance, per the table).
- The song's very last line cadences to **unison** (Svaneti may keep the open
  fifth — genre flag).
- One shared breath between lines (KHÖÖMEI/VYVID inhale pattern).

**KAKHETI — drone dialogue (rubato).** Bani = slow drone walking
{1/1-degree, subtone, 4th-degree} at phrase boundaries only. Mtkmeli and
modzakhili alternate long melismatic solo phrases (the other sustains or
rests), 5–9 syllables stretched with 2–4-note melismas; free rhythm =
long/short duration grammar over a slow pulse, PROTYAH-style live tempo drag.
**GURIA — counterpoint (metered, brisk).** Three independent rhythmic
streams in a shared meter; krimanchuli sings a patterned yodel ostinato —
pairs of pitches a fourth/fifth+ apart, chest/falsetto alternation on
vocables, register flip per note (§5); mtkmeli carries the text; bani moves
in steady quarters, mostly stepwise. **SVANETI — chord procession (slow,
homorhythmic).** All three voices move together, parallel-ish: the standard
sonority is bani + neutral third + fifth, with full-cluster (2nd+4th)
sonorities on approaches; degree motion mostly stepwise, phrase arcs of 4–6
chords.

## §4 Form, syllables, vocables

Strophic; realtime loops endlessly re-realizing each lap (TESSERA reseed
`seed + lap·0x9E3779B1`); the cut renders one whole song. Seeded pseudo-lyric
syllable stream, Georgian-phonotactic (clusters allowed and characteristic:
*gv-, mts-, brts-, tskh-*; vowels a/e/i/o/u), one shared timeline all voices
articulate (VYVID heterophony pattern). Region vocable tables where the
tradition sings vocables: KAKHETI melisma vowels + "orera / odelia / ari-arali";
GURIA krimanchuli sings **only** vocables ("i-ri-a-o / o-ho-hoi" family);
SVANETI archaic filler ("o-i-da / li-le" family, "lile" reserved for the
opening chord of that mode as a nod). First strophe of every pressing opens
on a fixed syllable per region (VYVID's fixed "ой" precedent): KAKHETI "he-e",
GURIA "a-ba", SVANETI "o-i".

## §5 Synthesis (no samples, VYVID throat as the base recipe)

Per voice: glottal `PeriodicWave` (~36 harmonics, 1/n^tilt, per-singer tilt)
→ **four parallel formant bandpasses** with per-syllable vowel portamento —
but with **male formant tables** (all F1/F2 targets shifted down vs VYVID's;
6-vowel table) — plus a small direct lowpassed path. Consonant noise bursts
on syllable onsets; per-singer independent vibrato/wander/jitter LFOs (adopt
VYVID's *follow-up* state, not its first pass — distinct rates per singer,
never synced); aspiration noise per voice; the shared inhale between lines.

**The krimanchuli register flip is the one new instrument:** two source
recipes — *chest* (full harmonic series, stronger formant path) and
*falsetto* (dominant fundamental, few harmonics, reduced formant energy,
+one tilt) — crossfaded per yodel note with a 10–20 ms flip, pitch and
source switching together. The yodel is scheduled as ordinary note events
(the solver tunes both alternating targets against the ensemble); the flip
is timbre only.

Master chain, house style: per-voice gains → shaper → glue compressor →
brick-wall limiter (−1.5 dB) → trim; convolution room send with a **fixed**
seed (not the song seed) — one room per region flavor is allowed (stone
church decay for SVANETI, dry table room for KAKHETI/GURIA) but each fixed.

## §6 Controls — the law is the interface

- **KUTKHE** (region): KAKHETI / GURIA / SVANETI — texture, grammar, voice
  roster, vocables, room.
- **TSQOBA** (tuning system): **TRADITSIA** (adaptive engine, default) /
  **TEMPERIREBULI** (12-ET: solver replaced by nearest-100¢ snap, same score)
  — the A/B that lets the ear hear what adaptivity *is*; the drift meter
  reads 0 in ET, which is itself the lesson.
- **SIMAGHLE** (pitch height): bani home ± a fourth, cents offset on `BASE`.
- **TEMPO / PROTYAH**: live drag, scheduler reads it per tick (no regen).
- **SEED** + ALIUD; hash serializes `s, k(utkhe), t(sqoba), h(eight), tempo`
  — the hash is the pressing. Keys: space/p/r/c house standard.
- **GADAKHRA meter**: live cumulative drift in cents (display, not a control).

Law changes re-vibe at the next line boundary on a running transport
(change-while-playing convention); they never restart it.

## §7 TIMBRE / OFFICINA

Verbatim bridge (copy from FORFEX/RILLE — *not* reimplemented; the FADÓ
bugfix thread is the cautionary tale). `TIMBRE.id = 'bani'`. Groups:
`master`, `room`, `throat` (shared glottal/formant/vibrato-family), one group
per singer (`bani`, `mtkmeli`, `modzakhili`, `krimanchuli` — levels, tilt,
vibOff), `yodel` (flip time, falsetto recipe), `breath`. Factory defaults ==
the literals they replace. **The law stays out of TIMBRE:** interval targets,
weights, step sizes, grammars, vocables are law, not voicing. `TIMBRE.touch`
ramps live nodes (continuous machine); `TIMBRE.demo(group)` starts the
transport if stopped (KHÖÖMEI-class audition). Add the chip to officina
`MACHINES` at registration.

## §8 Canvas — the vine

Georgia is the cradle of wine and the supra its table: the static layer
(rebuilt only on regeneration) draws the whole realized song as a
**three-tendril grapevine** on a dark band — one tendril per voice (bani
earth-brown, mtkmeli vine-green, top voice amber-gold), vertical position =
realized pitch, tendrils knotting at every cadence unison with a small grape
cluster; strophe boundaries as trellis posts; the frame's drift drawn as the
slow departure of the whole vine from a ruled baseline. Live pass blits the
layer, draws a playhead + current syllable + the GADAKHRA meter.
`prefers-reduced-motion`: freeze the playhead, no redraw loop (VYVID
simplification). Layer cached; loop sleeps when idle.

## §9 Determinism, render, iOS

Seeded generation end-to-end; URL hash is the pressing; `cut()` renders one
full song via OfflineAudioContext, 16-bit WAV, bit-deterministic —
`saveWav`/`encodeWav` **copied verbatim** (the repo's flagged repeat gotcha).
iOS: `playback` session, kick-don't-suspend visibility handling **as landed
by the Media Session sweep** (build it in from day one: `__iosAudio` without
hide-suspend, `__mediaSessionInit/Update`, silent-`<audio>` anchor;
next-track = ALIUD) so the sweep doesn't have to chase this machine later.

## §10 Verification plan (headless Chromium, enumerate-then-smoke)

1. **Solver unit sweep:** target table exact; closed-form mean reproduces
   hand-computed cases; evaluation order fixed; same seed ⇒ identical cents
   track (float-exact) across 20 seeds × 3 regions × both TSQOBA settings.
2. **Law sweep:** mtkmeli-opens-alone; entry order; line-finals within
   0.5 ¢ of pure unison/fifth/octave vs realized bani; penultimate crunch
   present; GURIA yodel alternation + tacet rules; SVANETI homorhythm;
   KAKHETI solo-alternation; final-line unison (fifth allowed in SVANETI).
3. **Drift:** cumulative, reproducible per seed, zero in TEMPERIREBULI;
   meter matches the pitch track's frame origin.
4. **Runtime smoke:** transport play/pause/resume with real context state
   transitions; PROTYAH live drag; law change re-vibes without restart;
   offline cut NaN-free, non-silent, unclipped; hash round-trip; OFFICINA
   schema announce + set/bulk + localStorage overlay round-trip; zero page
   errors throughout. Scripts in scratchpad, not committed (house pattern).

## §11 Registration checklist (ship session)

Landing `index.html` card (+ count), `README.md` row (+ count), officina
`MACHINES` chip, HANDOFF file table + Architecture count, `CLAUDE.md` count —
minimal diffs, all in sync, renumber if XXIII is taken by then. Reader-notes
panel ("on this music") from §1. Delete this brief; fold the outcome into the
HANDOFF thread.

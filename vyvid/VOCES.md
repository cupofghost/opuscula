# VOCES — the design brief for VYVID (provisional op. XVIII)

**Status: scaffold.** This session did the research, the musical law, the sound
design and the page scaffold (`vyvid/index.html` — UI, styles, TIMBRE +
OFFICINA bridge, hash, keys, canvas tuning-ladder, all working; the ENGINE is
stubbed and clearly marked). The next session implements the engine against
this brief, verifies headless, registers the machine, and **deletes this file**
(RILLE/HARMONIA, DIAMOND/GENESIS, SUBLOW/NOTES precedent — fold the outcome
into a HANDOFF.md Open-threads entry).

Per the claiming rule: **op. XVIII is provisional** — re-check the registry at
every rebase; if another machine lands first, renumber (the directory name
`vyvid/` keeps).

---

## 1 · The idea

Four women of a steppe-Crimean village sing together the way their
grandmothers did: one voice **leads out alone** (the *zaspiv* — the solo
intonation that opens every verse), the others **catch it up** and weave
around it in close heterophony, one low voice anchors, and above them all a
single high voice — the **вивід** (*vyvid*, "the leading-out"), also called
подводка — floats a descant that is less a harmony part than a second melody
in the sky. Every line of verse ends the same way: the weave **collapses into
a unison** (the vyvid an octave above it), holds, breathes, begins again.

This is *підголоскова поліфонія* / *подголосочная полифония* — "undervoice
polyphony," the shared texture of Ukrainian and South-Russian village song.
Crimea's Slavic villages (settled from the late 18th century onward, from both
Ukrainian and Russian governorates, often into the same village and the same
family) sang it in both languages from one repertoire pool; the style belongs
to the southern-steppe continuum (Tavria, Kherson, the Kuban). The peninsula's
oldest musics — Crimean Tatar — are a different tradition entirely and are not
attempted here.

The machine composes a strophic song (seeded, deterministic), realizes it
freshly for four synthesized throats each verse, and sings it in the village
tuning — which is the whole point, see §3.

**The name.** VYVID — the machine is named for its crowning voice, as KHÖÖMEI
is named for the throat. Eyebrow: `op. XVIII · вивід`.

## 2 · The law is the tuning + the texture

No keyboard ever stood in these villages. The ensemble tunes to **itself**:
the unison is the anchor, fourths/fifths/octaves are pure, and the third is
**not a point but a zone** — field transcriptions mark it with arrows because
it sits between the piano's keys. And the intonation is *social*: during a
phrase four throats are four individuals (wide, beating unisons); at the line
cadence they **converge and lock**. That convergence law is the machine's
signature and must be exact and verifiable (§3.3).

Zero ET anywhere (DIAMOND/TESSERA precedent): every frequency is
`f = TONIC × VYSOTA × ratio × 2^(cents/1200-style detune)` where **220 is the
only Hz literal** (an alto-comfortable A), `VYSOTA` ∈ {8/9, 1/1, 9/8} (the
pitch chips — villages pitch a song where the voices sit that day), `ratio`
comes from the mode tables below, and the detune term is the intonation model
(cents are a ratio, 2^(c/1200) — not ET). **No `mtof` anywhere.**

## 3 · Tuning (СТРІЙ / STRIY)

### 3.1 · The frame (both striys, exact, 3-limit)

1/1 · 9/8 · 4/3 · 3/2 · 16/9 · 2/1, plus the subtonic below the final at 8/9.
These are the load-bearing intervals and they are always pure.

### 3.2 · The third — the two striys

- **STEPOM** (степом, "as on the steppe" — **default**, the machine's reason
  to exist): the third is **neutral**, rendered exactly as **11/9** (≈347 ¢) —
  the rational center of the measured zone. The per-singer detune walk (§3.3)
  paints the zone's width around it.
- **CHYSTO** (чисто, "purely" — the revival-ensemble manner): the third is
  **6/5**. For A/B listening and for ears that want the book minor.

Sixths (used by ZHURBA/STEP only): minor **8/5** (ZHURBA), major **5/3**
(STEP), in *both* striys — the striy chooses the third only. Upper octaves of
any degree are ×2.

### 3.3 · The intonation model (per singer, seeded, deterministic)

This is where "realistic tuning" lives. All numbers below are **voicing** and
sit in TIMBRE group `striy`; the *rules* are law:

1. **Walk:** each singer carries a bounded random-walk detune, updated once
   per syllable, step ≤ `walkStep` (2.5 ¢), bounds ± `width` (7 ¢). Seeded per
   singer per verse — deterministic, WAV-identical.
2. **Scoop:** every phrase-initial or post-breath note is approached from
   below by `scoopCents` (60) over `scoopMs` (110). Within a slur, steps
   connect by portamento over `portaMs` (80).
3. **Convergence (THE law):** on every line-final sustain, all detunes ramp
   linearly to within ± `lockCents` (1.5) over the first 60 % of the sustain
   and hold locked. Mid-phrase unisons beat; cadential unisons do not.
   *Verify:* scheduled detune at cadence-sustain end ≤ lockCents; mid-phrase
   pairwise spreads within [0, 2×width].
4. **Release fall:** the last note of a line releases with a downward glide of
   `fallCents` (45) as the breath gives out — the sighing let-go of the style.
5. **Vibrato is late and small:** straight tone; on holds longer than
   `vibDelay` (1.1 s) a vibrato of `vibDepth` (9 ¢) at `vibRate` (5.2 Hz)
   fades in. Village voice, not conservatory voice.

## 4 · Modes (ЛАД / LAD) — degrees over the final, exact

T = the striy's third (11/9 or 6/5). All lists include the subtonic 8/9 below
the final; upper extensions ×2 as ranges need.

- **ZHURBA** (журба, "sorrow" — the lyric minor of the protyazhna):
  `8/9 · 1/1 · 9/8 · T · 4/3 · 3/2 · 8/5 · 16/9 · 2/1 · 9/4 · 2T`
- **STEP** (степ — the dorian-bright variant):
  `8/9 · 1/1 · 9/8 · T · 4/3 · 3/2 · 5/3 · 16/9 · 2/1 · 9/4 · 2T`
- **OBRYAD** (обряд, "ritual" — the narrow calendar-song mode; vesnianky live
  here): `8/9 · 1/1 · 9/8 · T · 4/3` only, plus **3/2 for the vyvid's calls**.

Genre defaults (override sticks until the genre changes — RILLE Lösung
precedent): PROTYAZHNA→ZHURBA · VESNIANKA→OBRYAD · KOLYSKOVA→STEP.

## 5 · The four singers (roles are law; their voices are TIMBRE)

Bands are absolute ratio-over-final ranges; roles are hard rules the verify
enumerates.

| role | band | rule |
|---|---|---|
| **ZASPIVUVACHKA** (заспівувачка) — the leader | 8/9 … 16/9 | Sings the skeleton tune. Opens every verse **alone** for the first half-line (the zaspiv); the others join mid-line (the *pidkhoplennia*). Light ornament only. |
| **DRUHA** (друга) — the second | 8/9 … 3/2 | Heterophony against the leader: at any instant she is at the unison or a third below (striy third!), splitting at phrase peaks, **rejoining the unison at every line-final**. Passing seconds only on weak time between two legal sonorities. |
| **BASOK** (басок) — the low voice | 2/3 … 9/8 | Anchors only: {1/1, 8/9, 3/4}. Moves at most once per half-line. Tacet in KOLYSKOVA (a trio). |
| **VYVID** (вивід) — the descant | 3/2 … 9/4 | **Silent during every zaspiv.** Mostly stepwise in the mode's upper octave, loosely contrary to the leader. Line-final: 2/1 (or 3/2 at mid-song internal lines); verse-final: **2/1 over the others' unison 1/1** — the octave crown. |

**Sonority law (verify this):** at any scheduled instant, every sounding
interval against the skeleton tone ∈ {1/1, T, 4/3, 3/2, 8/5 or 5/3, 2/1}
(plus the octave compounds), except marked passing tones (weak time,
stepwise-approached-and-left). Line-final sonority = unison (+ vyvid octave).
Verse-final = unison + octave, converged (§3.3).

## 6 · Genres (ПІСНЯ / PISNYA), form & time

Realtime **loops verses endlessly, re-realizing each lap** (fresh seeded
diminutions over the fixed skeleton — TESSERA's endless-extension spirit);
the WAV cut is one whole song. `PROTYAH` slider (0.75–1.4) stretches all
durations live (no regeneration).

- **PROTYAZHNA** (протяжна — the drawn-out lyric; the machine's heart).
  2 long lines/verse × 4 verses. Line = 7 syllables (4+3), base durations
  drawn per syllable from {0.5, 0.75, 1}×beat (weighted, seeded), stressed
  syllables may bloom into 1–3-note melismas, line-final syllable stretched
  ×3.5 with a fermata feel. Beat ≈ 72/min before PROTYAH. Verse 1 line 1
  begins **"Ой…"** (the genre's own opening breath).
- **VESNIANKA** (веснянка — the spring call). Kolomyika meter **4+4+6**,
  strictly syllabic, beat ≈ 132, 5 verses. Lines 2 and 4 end in the
  **hukannia** whoop: last syllable leaps up ~a fifth with a fast gliss and
  cuts off ("гу-у!") — implement as a quick upward detune ramp + hard release.
  OBRYAD default; bright, forward, a little relentless — it is a call across
  fields.
- **KOLYSKOVA** (колискова — lullaby). 6-syllable lines in a slow 3/8 sway,
  beat ≈ 96, 4 verses, trio (basok tacet), everything softer: scoops halved,
  width halved, vyvid stays low in her band. The convergence law still holds —
  a lullaby's cadence is the most locked of all.

**Breath is structural:** after every line, all voices stop and an inhale
sounds (~0.6 s, noise through a rising bandpass — KHÖÖMEI's `inhale` pattern);
the silence between lines belongs to the song.

## 7 · Pseudo-lyrics (deterministic, drives the vowels)

A seeded syllable stream with Ukrainian phonotactics — not words, but
mouth-true (NENIA precedent, adult and softer):

- Onsets (weighted): ∅ h d k l m n p r s t v z b + rare zh ch sh st dn.
- Vowels (weighted heavy to open): **a .30 · o .24 · y .14 · e .12 · u .12 ·
  i .08** (y = Ukrainian и).
- Coda chance .18 from {n, m, r, s}.
- Syllables group into 2–3-syllable display-words; verse 1 line 1 syllable 1
  is fixed **"oi"**.
- The **vowel of the current syllable drives the formant targets** (§8); the
  line's syllables render under the canvas band, current one lit.

## 8 · Synthesis (all constants already sit in TIMBRE — read `TP.*`)

Per voice (×4, the machine's only pitched sources):

1. **Source:** PeriodicWave glottal buzz, 36 harmonics at 1/n^`tilt`
   (`throat.tilt` .60, per-singer `tiltOff`) — bright, the open-throat
   "white voice" is mostly *loud harmonics*, not noise.
2. **Vowel:** 4 **parallel** bandpasses F1–F4, freqs = vowel table ×
   per-singer `formantScale`, gains [0, g2, g3, g4] dB (−5/−9/−14), Qs
   `q1/q2/q34` (9/11/13); plus a small `direct` lowpassed path so the chest
   never disappears. `openness` (vowels group) scales F1 up to +25 % — the
   throat opened wide. Vowel targets move with `portaMs`-scale smoothing at
   each syllable.

   | vowel | F1 | F2 | F3 | F4 |
   |---|---|---|---|---|
   | a | 800 | 1250 | 2900 | 3900 |
   | e | 620 | 1900 | 2900 | 4000 |
   | y | 480 | 1650 | 2700 | 3900 |
   | i | 350 | 2300 | 3000 | 4100 |
   | o | 520 | 950 | 2850 | 3900 |
   | u | 380 | 800 | 2700 | 3800 |

3. **Envelope:** per-syllable gain env (attack 25–40 ms shaped, legato
   sustain, release with the §3.3 fall). Melisma notes connect inside one
   env.
4. **Ornament & intonation:** all of §3.3, applied via `osc.detune` in cents
   (a pure ratio operation).
5. **Consonants (optional but cheap):** syllable-onset noise bursts —
   s/sh 60 ms bandpassed 4–8 k, stops 15 ms clicks — level `breath.consonant`.
6. **Per singer:** `level`, `formantScale` (zaspiv 1.00 · druha 1.03 ·
   basok 1.06 · vyvid 0.94 — bigger scale = darker/bigger frame), `tiltOff`,
   `pan` (basok +.20, zaspiv −.10, druha +.10, vyvid −.22 — a semicircle in a
   room, not a mix).
7. **Master (house chain):** sum → warmth shaper (`master.drive` .06) → glue
   comp 2.4:1 → brick-wall limiter −1.5 dB / ratio 20 (GONGAN/DIAMOND
   ceiling) → out trim; **seeded** room IR ~1.2 s (village room, wet
   `master.wet` .12, sends post-pan) so the WAV is deterministic.

Realtime = 4 continuous formant chains + scheduler (RILLE-family `schedTick`,
~40 ms timer, ~0.3 s lookahead, off `ac.currentTime`); offline = identical
graph into `OfflineAudioContext`, `saveWav`/`encodeWav` **already in the
scaffold verbatim from KHÖÖMEI** (HANDOFF flags forgetting them as a repeat
gotcha). Pause = `ctx.suspend()` with the `st.paused` guard (already wired).

## 9 · What the scaffold already does (don't redo)

`vyvid/index.html` loads clean (zero pageerrors) with: full page grammar
(palette: night-plum ground, linen band, kalyna-red/black/ochre — the rushnyk
colors), controls (PISNYA/LAD/STRIY/VYSOTA chips, PROTYAH slider, HOLOSY
four-voice toggle row), play/pause/another/cut buttons + shared keys
(space/p/r/c), the "on this music" reader notes (written), colophon, hash
round-trip (`p l s v t m sd`), `chipRow`, iOS unlock, saveWav/encodeWav, the
**TIMBRE block (8 groups, ~40 params, documented) + OFFICINA bridge
verbatim**, the exact LAD/STRIY ratio tables as code (`LADY`, `THIRDS`,
`scaleOf`, `ratHz`), and a canvas that renders the current lad/striy as a
**cents-true ratio ladder** on the linen band. Engine stubs are marked
`/* ==== TO BUILD (VOCES.md §n) ==== */`: `genAll`, `buildGraph`,
`schedTick`, real `play/stop`, `cut`, the live canvas pass, `TIMBRE.touch`
beyond master, `TIMBRE.demo`.

## 10 · Canvas (to build)

The **rushnyk**: the song embroidered. A linen band across the plate; the
whole song's realized score as cross-stitch marks — x = time, y = pitch
within the band, one color-thread per voice (leader kalyna-red, druha black,
basok dark madder, vyvid ochre-gold); **cadence convergences drawn as the
eight-point rushnyk star** where the threads meet; verse boundaries as border
motifs. The current line's syllables render under the band, sung one lit. A
needle-playhead crosses; `prefers-reduced-motion` → needle only. Static band
layer-cached, rebuilt on regeneration only. The scaffold's ratio-ladder
rendering should survive as an idle/READY state or fold into the band's left
margin (implementer's call).

## 11 · TIMBRE / law boundary (already drawn — keep it)

In TIMBRE (voicing): master/room, throat, vowels, striy *widths* (§3.3
numbers), breath/consonant levels, per-singer voice. **Law, never TIMBRE:**
the ratio tables, the striy choice itself, roles/bands, sonority rules,
meters/forms, the convergence *rule*, syllable grammar. `TIMBRE.id='vyvid'`;
add the officina chip at landing. Factory values must stay exactly what the
scaffold ships once the engine sounds — re-voice via OFFICINA + COPY TWEAKS,
not by editing literals.

## 12 · Verify (headless Chromium — the RILLE/SUBLOW pattern)

Enumerate the model, then smoke the runtime:

1. Scale tables exact for all 3 lads × 2 striys (rational arithmetic).
2. Every scheduled frequency = 220 × vysota × ratio × 2^k; no other Hz
   literal in the pitched path; zero `mtof`.
3. Sonority law + roles: sweep 3 genres × 3 lads × ≥20 seeds — zaspiv solo,
   vyvid silence in zaspiv, druha third/unison law, basok anchor set +
   move-rate, line-final unison + vyvid octave, passing-tone conditions.
4. Convergence: cadence detunes ≤ lockCents; mid-phrase spreads ≤ 2×width;
   KOLYSKOVA halved widths.
5. Meters: syllable counts (7 = 4+3; 4+4+6; 6); "oi" opening; hukannia on
   vesnianka lines 2/4 only.
6. Determinism: same hash ⇒ identical event list; realtime lap 2 ≠ lap 1
   (re-realized) but lap 2 deterministic too.
7. Realtime transport runs (no pageerrors), pause/resume holds, offline WAV
   cuts clean/NaN-free with head energy, hash + OFFICINA schema/set/bulk
   round-trip. Playwright note: use the full chrome binary
   (`/opt/pw-browsers/chromium…/chrome`), not headless_shell — see the RILLE
   env note in HANDOFF.

## 13 · At landing

Registry rows (minimal diffs): `index.html` card + count, `README.md` row +
count, HANDOFF file table + count, officina `MACHINES` chip. Re-check the
opus number at every rebase. Update the HANDOFF Open-threads entry (top),
fold this brief in, **delete this file**.

## 14 · Rejected / pick-ups

- **Rejected: sampled anything** (repo law), **12-TET** (the point is the
  striy), a fifth voice (quartet is the frame), simultaneous
  Ukrainian/Russian text rendering (pseudo-lyrics are deliberately
  language-adjacent, not a language).
- **Pick-ups:** a VESILNA (wedding ladkannia) genre — declaimed unison
  blooming heterophonic at line-ends; a second tonic literal an octave down
  for a mixed-voice mode; humanized stagger of the pidkhoplennia (druha
  joining a syllable late); a "far across the field" room (long pre-delay,
  dark tail) as a WHERE-style toggle.

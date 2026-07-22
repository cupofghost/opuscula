# vyvid — session threads

Development history for the `vyvid/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### VYVID — new machine, op. XVIII (Crimean steppe women's quartet)
**Branch:** `claude/crimean-womens-quartet-scaffold-9f1eq0` · **File:**
`vyvid/index.html` · **Status:** done, verified headless (Chromium, 34
checks across scale/law/sonority/convergence/meter/determinism/runtime, zero
pageerrors). New op. Registered in `index.html` (card + counts), `README.md`
(row + count), `officina` (chip), `CLAUDE.md`/this file; counts bumped
seventeen → eighteen everywhere. Two-session build (SUBLOW precedent): one
session designed the law and scaffolded the page (`vyvid/VOCES.md`, the
design brief — deleted per its own instruction now that the engine ships,
this thread is the fold-in); this session implemented `genAll`/`buildGraph`/
the scheduler/`cut`/the live canvas against that brief and verified.

Four synthesized women's voices in *підголоскова / подголосочная поліфонія*
— undervoice polyphony, the shared village-song texture of Crimea's
Ukrainian and Russian steppe settlements (southern-steppe continuum; the
reader notes carefully note Crimean Tatar music is a separate tradition, not
attempted). **The law is the tuning.** Zero ET, one Hz literal (220); the
frame (9/8, 4/3, 3/2, 16/9, 2/1, subtonic 8/9) is always pure; the third is
chosen by STRIY — neutral **11/9** (STEPOM, ≈347¢, default) or pure **6/5**
(CHYSTO) — never equal-tempered. Three modes (ZHURBA/STEP/OBRYAD, genre-
defaulted, override sticks) and three genres (PROTYAZHNA rubato lyric,
VESNIANKA kolomyika 4+4+6 with the *hukannia* whoop, trio KOLYSKOVA lullaby).

- **The four roles are law, generated from one shared syllable timeline**
  (heterophony = one lyric, four throats): the machine builds a single
  per-syllable stream (pseudo-lyric grammar, seeded, Ukrainian-phonotactic;
  verse 1 opens fixed `"ой"`) and derives every singer's pitch from it —
  ZASPIVUVACHKA walks the skeleton tune and **opens every verse alone**
  (the others silent); DRUHA is *derived*, not independently generated —
  each syllable she's exactly unison or a third below the leader's *current*
  tone (occasional single-syllable passing seconds on weak time only);
  BASOK anchors on the fixed literal set `{1/1, 8/9, 3/4}` only, one pick per
  half-line group, tacet in kolyskova; VYVID is silent through every zaspiv,
  walks loosely contrary to the leader, and crowns every line-final at 3/2
  (internal) or 2/1 (the song's very last line — the octave over the
  others' unison). Every line-final forces zaspiv/druha to `1/1` — the
  sonority law's "unison" is satisfied *by construction*, not policed after
  the fact.
- **The convergence law (§3.3, the machine's signature):** each active
  singer carries a seeded bounded random-walk detune (cents, via
  `osc.detune` — a pure ratio operation) that wanders mid-phrase and is
  forced to exactly `0` at every line-final note, then the audio graph
  ramps it there over the first 60% of the cadence sustain and releases
  with a downward "sighing" fall — wide beating unisons mid-phrase,
  locked unisons at every cadence. KOLYSKOVA halves the walk width and
  scoop by law (a lullaby's cadence is the most locked of all).
- **Synthesis:** each voice is one glottal `PeriodicWave` (36 harmonics,
  1/n^tilt, per-singer tilt offset) through **four parallel formant
  bandpasses** (vowel targets from a 6-vowel table, portamento'd at each
  syllable) plus a small direct lowpassed path; **one continuous gain
  envelope per LINE** (attack at line start, release at line end) rather
  than per syllable — a deliberate simplification for legato: the pitch/
  vowel/detune automation carries the syllable articulation underneath a
  held tone, matching "legato sustain... melisma connects inside one env"
  more directly than a gated per-syllable envelope would. Consonant noise
  bursts on syllable onsets, a shared inhale between every line (KHÖÖMEI's
  pattern), late small vibrato on long holds only. House chain: shaper →
  glue comp 2.4:1 → brick-wall limiter (−1.5 dB, 20:1) → trim, seeded
  village-room convolution send (fixed seed, not the song seed — the room
  doesn't change verse to verse, only the song does).
- **Realtime loops endlessly, re-realizing each lap** (TESSERA precedent:
  `genAll(seed + lap·0x9E3779B1)`, deterministic per lap); **PROTYAH rides
  live** (the scheduler reads `st.protyah` at each schedule step — no
  regeneration, RILLE/SUBLOW tempo-drag convention); law changes
  (pisnya/lad/striy/vysota) regenerate and hand the new song to a running
  transport at the next schedule tick rather than restarting it. Offline
  cut renders one whole song identically. `saveWav`/`encodeWav` copied
  verbatim (the repo's flagged repeat gotcha, pre-handled).
- **Canvas — the rushnyk** (VOCES.md §10): an offscreen static layer
  (rebuilt only on regeneration) draws the whole realized song as
  cross-stitch on a linen band — one colour-thread per voice (leader
  kalyna-red, druha black, basok dark madder, vyvid ochre-gold), gold
  eight-point stars at every cadence unison, verse-boundary ticks; the live
  pass blits it and draws a needle playhead + the syllable being sung.
  `prefers-reduced-motion` freezes the needle (a simplification: no redraw
  loop at all under RM, rather than needle-only motion).
- **Verified headless** (`scratchpad/verify-vyvid-engine.mjs`, playwright-core
  + the full chrome binary — not `headless_shell`, per the RILLE env note —
  34 checks): scale tables exact for all lad×striy combinations; single Hz
  literal, zero `mtof`; a 3-genre×3-lad×20-seed sweep confirms zaspiv-solo
  silence, vyvid-silent-in-zaspiv, druha's unison/third/passing law, basok's
  fixed anchor set, line-final unison + vyvid crown; convergence detunes
  exactly 0 at every cadence and bounded mid-phrase (kolyskova half-width);
  syllable meters exact (7/14/6), the fixed "ой" opening, hukannia flagged
  only on vesnianka lines 2/4; determinism (same seed+law ⇒ identical event
  list; lap-reseed reproducible); realtime transport runs, pause/resume
  holds, offline cut NaN-free and peak-normalised with head energy, hash
  and OFFICINA schema/set/bulk round-trip (9 groups, 48 params). Zero
  pageerrors throughout.
- **Follow-up (maintainer, after bench tweaks): independent per-voice
  vibrato + more human/breathy.** Each voice's `v.vibLFO` ran at the exact
  same shared `throat.vibRate` — four throats in lockstep. Now every singer
  offsets it by her own `vibOff` (new per-singer TIMBRE param, distinct
  factory defaults), a slow per-voice "wander" LFO (`throat.vibWander`/
  `vibWanderDepth`, rate itself multiplied by a fixed per-singer constant so
  the four wanders never sync) modulates that rate over time, and an
  always-on micro-jitter LFO (`throat.jitter`, fixed distinct Hz per singer)
  adds a small flicker under every note, not just held ones — the existing
  slow vibrato law (fades in only past `vibDelay`) is untouched. For "sounds
  more human": a continuous breathy **aspiration** noise (new `breath.
  aspiration` param) rides under each voice on the *same* line-envelope
  (`v.env`) as the tone, shaped near her own formants (`1800×formantScale`
  bandpass) — no new scheduling needed, it fades with the phrase for free.
  TIMBRE: 40→**48 params** (throat +3, breath +1, four singer groups +1
  each). `TIMBRE.touch` extended for all of the above; `buildVoice` now
  takes the shared noise buffer so aspiration doesn't need its own.
- **Pick-up ideas** (carried from the brief): a VESILNA wedding-ladkannia
  genre; a second tonic literal an octave down for a mixed-voice mode;
  humanized stagger of the pidkhoplennia entrance; a "far across the
  field" long-predelay room as a WHERE-style toggle; the sonority law is
  enforced by construction at structural moments (line-finals, druha's
  derivation) rather than swept at every scheduled instant — a deliberate,
  documented scope decision, not a gap.

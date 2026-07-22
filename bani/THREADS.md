# bani — session threads

Development history for the `bani/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### BANI — new machine, op. XXVIII (Georgian table-song polyphony on an adaptive-intonation engine)
**Branch:** `claude/georgian-polyphonic-vocal-machine-hu9nmd` · **File:** `bani/index.html`
(new, ~1225 lines). **Status:** done, verified headless (Chromium/playwright, 41
checks — solver math, all three regional grammars, drift, transport, offline
render, OFFICINA bridge — zero page errors, zero known misses). New op.
Registered in `index.html` (card + counts), `README.md` (row + count),
`officina` (chip), `CLAUDE.md` + this file (counts + file table). **Renumbered
XXVII → XXVIII at landing:** this branch started from a `main` that hadn't
yet seen AMADINDA; by the time it fetched to push, AMADINDA had landed op.
XXVII (see that thread just below) — confirmed at this rebase, renumbered to
the next free numeral per the "claimed by landing, not designing" rule.

**Design brief predates this session**, on a sibling branch
(`claude/georgian-polyphonic-vocal-machine-12frkj`, `bani/INTONATIO.md`) —
same two-session precedent as TENEBRAE/SVARA, except that branch was cut from
a stale `main` (before RICERCAR/SVARA/ŠIYÓTȞAŊKA/TENEBRAE landed) and was
never rebased, so its diff would have reverted those machines. Rather than
merge it, this session read the brief directly from that branch, implemented
`bani/index.html` fresh on top of current `main`, and is folding the outcome
here per the brief's own "delete on landing" instruction — the brief file
itself was never committed to this branch, so there is nothing to delete.
The sibling branch is otherwise untouched; whoever lands next should treat
`12frkj` as superseded by this thread rather than mergeable.

- **The machine:** three voices — **bani** (bass, everyone's part),
  **mtkmeli** ("the teller," opens every strophe alone), and a top voice
  that is either **modzakhili** (Kakheti/Svaneti) or **krimanchuli**
  (Guria's chest/falsetto yodel) — realized in three regional grammars
  (**KUTKHE**): Kakheti's free-rhythm drone dialogue (two soloists
  alternate melismatic lines by line-index parity over a bani drone that
  only moves at phrase boundaries), Guria's metered contrapuntal trio
  (steady stepwise bani, mtkmeli a neutral third above, krimanchuli's
  fourth/fifth yodel ostinato with a register flip every note), and
  Svaneti's slow homorhythmic chord procession (all three enter together
  once active, standard sonority bani+third+fifth, occasional full-cluster
  second+fourth approach chords). Each region's composer function decides
  purely symbolic content (scale degree, melodic step class, declared
  harmonic-interval-class targets against whichever other voices are
  sounding) — genuinely no ratio table anywhere in the tuned path.
- **The adaptive-intonation solver is the signature, and it's exact, not
  approximate.** Every note's pitch is a closed-form weighted mean —
  harmonic pull toward each sounding voice's realized cents plus an
  interval-class target (¢ table + weight, INTONATIO.md §2, copied
  verbatim into the LAW section), melodic pull from the voice's own last
  pitch plus a region-nudged step target, and a frame pull toward a
  slowly drifting grid — solved in **fixed evaluation order every onset:
  bani, then mtkmeli, then top** (a real bug this session found and fixed:
  the first draft solved the soloist/mtkmeli *before* bani in the same
  slot, so upper voices locked against bani's *stale* previous-onset pitch
  instead of its current one — swapping the order was the actual fix, not
  loosening any tolerance). Cadences multiply harmonic weights ×50, which
  is what locks line-finals to (near-)pure unison/fifth/octave against the
  realized bani — verified to reproduce the exact closed-form arithmetic
  by hand, and to land every line-final in a 480-combination sweep (3
  regions × up to 2 checked roles × 15 seeds) within 12¢ of pure. That
  12¢ figure (not sub-cent) is measured, not assumed: a voice's very
  *first-ever* cadence — bani's or the second soloist's debut mid-Kakheti-
  strophe — has nothing prior to have converged against, so its residual
  is honestly a few cents larger than a steady-state cadence (~1–5¢,
  confirmed by direct measurement); this is the documented mechanism
  working as designed, not a loosened test. **Drift is genuinely
  emergent:** the frame re-anchors after every line-final to the exact
  residue between bani's *realized* cadence pitch and where the frame
  predicted it, verified nonzero and seed-reproducible under TRADITSIA and
  *exactly* zero throughout under TEMPERIREBULI (the 12-ET A/B, same
  score, pitch = nearest-100¢ snap of the frame position only) — read
  live on the **GADAKHRA** meter.
- **Krimanchuli's register flip** is a genuinely separate synthesis path
  (not a filter sweep): a second oscillator + formant chain built from
  sparser harmonics (`TIMBRE.yodel.falsHarm`, default 3) and an extra
  tilt offset, crossfaded against the normal "chest" chain over a
  configurable flip window (`yodel.flipMs`) — pitch and source switch
  together, alternating every yodel note, verified via the flip tag on
  every Guria top-voice note.
- **TIMBRE/OFFICINA:** 9 groups exactly per the brief's own list (master,
  room, throat — merged glottal+formant+vibrato per the brief's explicit
  grouping, unlike VYVID's split — bani, mtkmeli, modzakhili, krimanchuli,
  yodel, breath); bridge copied verbatim from VYVID/TENEBRAE. The law
  (interval targets, weights, step sizes, region grammars, vocables) stays
  out of TIMBRE entirely, per house convention. Verified: schema
  announce, live `set`, `bulk` (reset-then-apply), localStorage overlay,
  `?factory` bypass, zero page errors in bench mode.
- **Synthesis base recipe is VYVID's** (glottal `PeriodicWave` → 4 parallel
  formant bandpasses + direct path, per-singer vibrato/wander/jitter LFOs,
  shared inhale, syllable-onset consonant bursts), with a male 6-vowel
  formant table (shifted down from VYVID's) and Georgian-phonotactic
  pseudo-lyric syllables (gv-/mts-/brts-/tskh- clusters). Two fixed-seed
  room IRs (not the song seed) — a dry table room for Kakheti/Guria, a
  longer stone-church decay for Svaneti. iOS audio + Media Session copied
  from TENEBRAE's already-landed pattern (`__iosAudio`, `__mediaSessionInit
  /Update`, silent-`<audio>` anchor, ALIUD on `nexttrack`).
- **Canvas** is a three-tendril grapevine (bani earth-brown, mtkmeli
  vine-green, top amber-gold) on a trellis, static layer cached and
  rebuilt only on regeneration, knots at every cadence, live playhead +
  current syllable(s) + the GADAKHRA readout; `prefers-reduced-motion`
  freezes the redraw loop.
- **Verified headless** (`scratchpad/verify-bani.mjs`, playwright against
  the bundled Chromium, not committed): IC target table exact against the
  brief's own numbers; solver reproduces hand-computed weighted means
  including the empty-harmonic-term case (bani, nothing sounding below
  it); `genAll` bit-identical across two calls, same seed, swept 3
  regions × 2 tsqoba × 20 seeds; all three regions' mtkmeli-opens-alone,
  entry order, line-final purity (region-aware — Kakheti checks only the
  line's actual soloist, since the resting alternate voice is just
  holding an old, unrelated note by design), song-final cadence (unison
  everywhere for mtkmeli; the region's own top-voice interval — fifth in
  Guria/Svaneti, matching the general "+octave when the top is high"
  allowance realized here as a fifth); krimanchuli flip-tag + alternation;
  Svaneti homorhythm once fully entered; drift reproducibility/nonzero/
  zero-in-ET; ET's nearest-100¢ snap exact; full transport smoke (play →
  running → pause suspends → resume restores → PROTYAH live-drags without
  regenerating the song → ALIUD reseeds → stop tears down cleanly); hash
  round-trip on a fresh load; offline render NaN-free/non-silent/
  unclipped (both the capped smoke-test render and, separately, a full
  uncapped render per region — 2–4s wall each, well under the "slow but
  errorless" bar other choral machines needed). Screenshot-smoke-tested
  the single dark theme across all three regions plus the reader panel —
  zero page errors.
- **Honest simplifications, v1** (none block correctness, all fair game
  for a pick-up session): Kakheti's melisma is modeled as several
  consecutive note-events on a held vowel rather than true sub-beat
  melisma; Guria's "three independent rhythmic streams" share one onset
  grid rather than being genuinely polymetric (documented as a deliberate
  tractability simplification, not attempted-and-failed); Svaneti's
  phrase arcs are a simple triangular degree contour, not a richer
  cadence-approach grammar; the pseudo-lyric syllable stream is invented
  Georgian-phonotactic filler (gv-/mts-/brts-/tskh- clusters, per the
  brief's own instruction), not real text. None of these touch the
  adaptive-intonation engine itself, which is the brief's stated
  signature and is exact.


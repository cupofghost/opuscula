# FRESH — threads

### 2026-07-22 · improve session — THE VOICE WAS NEVER CONNECTED (maintainer: "i dont hear any voice")

Root cause, embarrassingly simple: `buildVoiceChain` builds the whole formant
chain and feeds `vGain → vLevel`, and `buildGraph` builds `leadVoiceOut` /
`doubleVoiceOut` with their plate/echo sends — **but no line ever connected
`vLevel` to the voice bus.** The entire voiced path (every vowel, every pitched
sound the MC makes) ended in an unconnected node; only consonant noise bursts,
which `consNoise` wires directly to the bus, were audible — faint ticks where
syllables land. Fix: two lines after the chains are built —
`leadChain.vLevel.connect(leadVoiceOut)` / `doubleChain.vLevel.connect(doubleVoiceOut)`.

**Why three verification passes missed it** (build, review, envelope-fix — all
"voice-solo non-silent, PASS"): every gauntlet muted the *bed* and checked the
render wasn't silent, but the consonant noise bursts bypass `vGain`/`vLevel`
and kept the "voice path" above the silence floor. The lesson, for any future
audio-wiring verification here: **an RMS floor proves something sounds, not
that the right thing sounds.** The check that catches this class of bug isolates
the path under test by muting its *siblings inside the voice* too (consStop /
consFric / breath → 0) so the formant chain is the only possible source.
That check now exists (throwaway `scratchpad/`, this session): voiced-path-only
render of a verse bar — line RMS 0.0003 on the broken build (silence-floor
residue through the compressor makeup gain) vs 0.032 fixed, >100×, with the
same render clip-safe and error-free. `dev/verify.mjs fresh` + `dev/check.mjs`
re-run clean; `compose()` untouched, so pressings/hashes are unchanged — the
same links now simply *speak*.

Note for the vocal tuning pass: this is the first time the voice is actually
audible in the mix — every `voice`/`double`/`fx` level was balanced against a
mute MC, so expect the starting mix to need real attention (voice level,
echo sends, duck depth) before fine voicing.

### 2026-07-22 · improve session — voiced-onset envelope fix (the review's deferred item)

Picked up the one concrete audio-quality item the review session deferred to a
later pass (see its entry below): word-initial **voiced** consonants (liquids
l/r, glides w/y, nasals m/n/ng, and voiced-stop bars) were gated near-silent.
`scheduleSyllable` articulates onset consonants *before* the vowel's grid tick
`t` (plosives-as-percussion, so the vowel lands exactly on the beat), but the
per-syllable `vGain` amplitude envelope — which the voiced formant path runs
through — only opened at `t`. Noise-burst consonants (voiceless stops,
fricatives) bypass `vGain` and were fine; voiced onsets, which sound *through*
the formant chain, were nearly muted. Audibly: soft/clipped word-initial
liquids and nasals.

**Fix:** open `vGain` at the first *voiced* onset consonant instead of at `t`.
Walk the onset list, find the first phone with `CONS[..].v`, set `voiceStart`
to its scheduled time (`onsetStart + i*onTime`); voiceless-only onsets keep
`voiceStart = t` (unchanged — their bursts bypass the envelope anyway). Two
guards keep it safe on the persistent shared chain: clamp `voiceStart` up to the
previous syllable's release time (`chain._lastEnd`, tracked per chain; syllables
on a given chain are scheduled in time order, so this is monotonic) so a long
onset stolen into a tight preceding syllable can't rewrite that syllable's tail
ramp, and clamp it down to `t` so it can never open *after* the vowel. Only
synthesis changed — `compose()` is byte-for-byte untouched.

Verified headless (Chromium via `/opt/pw-browsers/chromium`):

- **Targeted before/after mechanism check** (`scratchpad/verify-fresh-voicedonset.mjs`,
  gitignored): renders single syllables with the voiced formant path isolated
  (consonant noise bursts routed to a dead node). "rock" (voiced r onset) now
  measures pre-tick RMS 3.6e-2 — on par with its vowel body (3.5e-2), i.e. the r
  fully sounds; "top" (voiceless t onset) stays 0 on the voiced path before the
  tick (correct — nothing voiced to hear there, and proof the fix doesn't
  falsely energise voiceless onsets). The voiced onset is now clearly louder
  pre-tick than the voiceless one, which is the whole point.
- **No regression:** `dev/verify.mjs fresh` (loads-clean · bench 10/82 ·
  plays-clean · cut-renders-wav, full 17.5 MB WAV downloaded this run) and
  `dev/check.mjs` (bridge/registry/numbering) both clean; the 180-combo model
  gauntlet still PASS (compose untouched); the offline audio gauntlet still PASS
  (shipped peak 0.92 held by the clip-safe normalize, RMS above floor,
  voice-solo non-silent).

Minimal diff — one function (`scheduleSyllable`) touched, no TIMBRE/param
changes, so the planned vocal tuning pass reads the same bench. This clears the
review's only open follow-up; the rest of its "noted, not changed" list was
architecture calls that check out.

### 2026-07-22 · review session — build verified independently, PR'd

Reviewed the build session's work (below) end to end and re-verified rather
than trusting the record: `dev/check.mjs` (bridge byte-identical, registries
agree) and `dev/verify.mjs fresh` (loads-clean · bench-schema 10/82 ·
plays-clean · cut-renders-wav) re-run and passing, plus a fresh independent
model gauntlet (not the build session's script) in real Chromium: 180
seed×style×flow×theme combos, 5400 lines, 1440 couplets — DICT closure, couplet
rhyme-family integrity (incl. the LYRICAL internal plant), monotonic
non-overlapping syllable grids, same-seed determinism, distinct-seed
distinctness, and the hash round-trip all pass with zero page errors. The
architecture calls documented below (precomposed pressing, positive-only
playbackRate, touch-less TIMBRE) all check out against the code.

One fix from review: the `master.duckDepth` bench doc claimed the bed ducks at
each *syllable* onset; the implementation ducks at each *line* onset. Doc
corrected to match the code (behavior unchanged) so the tuning pass reads the
bench truthfully.

Noted for the tuning pass, not changed: voiced onset consonants (l/r/w/y/m/n
and voiced-stop bars) sound through the per-syllable `vGain` envelope, which
only opens at the vowel's grid tick — so onsets stolen from before the tick are
nearly silent for those classes (noise-burst consonants bypass `vGain` and are
unaffected). Audibly this reads as soft/clipped liquid onsets; if the tuning
pass wants them stronger, the envelope needs to open at the first onset
consonant rather than at `t`.

Built `fresh/index.html` from the GENESIS brief in one session, all three
staged scopes (beat / MC / turntables) landed rather than split — the brief's
degrade path (ship stages, note the rest) wasn't needed. Verified headless:
`node dev/verify.mjs fresh` (loads-clean · bench-schema 10 groups/82 params ·
plays-clean · cut-renders-wav) and `node dev/check.mjs` (bridge byte-identical,
all four registries agree, numbering clean) both pass. Two throwaway
`scratchpad/` gauntlets (gitignored, not shipped) exercised the model and the
render:

- **Model enumeration** — 5 seeds × 4 styles × 3 flows × 3 themes (180
  combinations, 5400 lines / 1440 couplets): every emitted word has a DICT
  transcription, every verse couplet's setup/payoff share a rhyme family
  (LYRICAL's internal-rhyme plant checked too), every line's syllable grid is
  monotonic/non-overlapping/inside its bar, same seed → identical `compose()`
  JSON, different seed → different. Caught two real bugs before they shipped:
  several skeleton-template words (back/watch/how/came/put/everybody/feel/
  nobody/yourself/hard/whole/who) missing from DICT, and a `layoutSyllables`
  duration formula (`Math.max(0.4, gap*0.86)`) that could exceed a tight LYRICAL
  syncopation gap and overlap two syllables — fixed to a pure fraction of the
  gap (`gap*0.85`, no additive floor), which is safe by construction since
  every code path guarantees gap > 0 before that line runs.
- **Offline render** — peak < 0 dBFS (the `cut()` clip-safety normalize kicks
  in and holds it), RMS well above a silence floor, and a bed-muted
  (`TP.bass/kit808/kitBreak/stabs/scratch` levels → 0) render still produces
  sound, proving the voice path itself is exercised, not just the beat.
  **A real finding, not a bug:** two `OfflineAudioContext` renders of the
  *identical* graph are not bit-exact in this engine — diffed the raw sample
  arrays directly and found a ~5.96e-7 (exactly 1 float32 ULP) difference
  starting a few thousand samples in, present even with the voice muted, so
  it's the render engine's own non-associative summation order, not this
  machine's logic. With the voice active that 1-ULP seed grows to a ~0.004
  max sample difference by the end of the render — the five parallel
  bandpass formants (Q up to 26) are marginally-stable IIR filters, and any
  resonant filter amplifies a tiny difference in its input over time; this
  is expected DSP behavior, not nondeterminism in the composition. The
  guarantee that *does* hold, and is what "the hash is the pressing" means
  here: `compose(P)` returns byte-identical JSON for the same seed (every
  event's time/pitch/word pinned, checked in the model gauntlet above) —
  the score is exactly reproducible; the rendered waveform for that score is
  the same performance, not bit-identical floats. Worth knowing before
  anyone "fixes" a false render-determinism alarm in a future pass.

**Architecture call, deliberately deviating from the brief's "re-vibe at the
next bar" wording:** FRESH precomposes the *whole* pressing at Run-It time —
one `compose(P)` call builds a flat plan (every syllable, drum hit, bass note,
stab, scratch gesture as an absolute time from `t0`) and `buildGraph()`
schedules all of it at once, exactly like PERSONA (op. XXIX). This is PERSONA's
*actual* behavior, not just its technique: PERSONA's own sliders `stop()` and
regenerate rather than live-splice a running performance. A true bar-quantized
live re-vibe would need to unschedule/reschedule already-queued Web Audio nodes
mid-song, which Web Audio doesn't support — the honest options were a
complex tail-splice scheduler or PERSONA's stop-and-regenerate precedent. Took
the precedent: STYLE/FLOW/THEME/SING/SCRATCH/HYPE/TEMPO/VERSES changes while
playing stop the transport and regenerate the pressing silently; the user
presses Run It again. Documented here so a future session doesn't "fix" this
as a bug.

Other simplifications made in the builder's judgment (all noted so a tuning
pass or improve-pass knows where to look):

- **No negative `playbackRate`.** Reverse tape/vinyl playback via a negative
  AudioBufferSourceNode.playbackRate is spec-legal but unreliably supported
  across engines; every scratch gesture curve (baby/chirp/transformer/
  scribble/backspin) stays positive. The turntablism character comes from
  rate swing + fader gating, not true reverse — audibly convincing, verified
  headless with zero page errors.
- **DICT is ~190 words**, not the brief's 250-320 ceiling: 17 rhyme families
  (~6-9 members each, one stressed-vowel-plus-coda per family, verified by the
  model gauntlet) plus function/content words for the line-skeleton templates.
  Enough for real variety across 180 tested seed/style/flow/theme combos
  without a diminishing-returns vocabulary grind.
- **No letter-by-letter MC-name spelling** (the brief's stretch goal) — the MC
  NAME is generated and displayed/rapped as whole words, not spelled phoneme
  by phoneme. A future pass could add it behind the same DICT the way the
  brief sketched.
- **Loose template grammar, not POS-tagged.** Line skeletons end in a `{R}`
  rhyme slot filled from the chosen family; grammatical fit is genre-loose by
  design (real rap forces nouns into predicate/object slots constantly — "I'm
  on that flow," "bring the noise") rather than a hand-tagged parts-of-speech
  engine.
- **HYPE crowd/echo only** — the brief's stretch "hype-man interjections in the
  gaps" (`yeah!`/`c'mon!`/`fresh!`) were scoped out; HYPE instead scales the
  crowd-response loudness and the echo-throw depth on line endings, which
  reads as the same thing at the mix level for less token cost.
- **`TIMBRE.touch` intentionally absent**, matching PERSONA precedent for a
  one-shot precomposed machine (see the architecture call above): bench edits
  apply on the next Run It; ► HEAR (`TIMBRE.demo`) just starts a fresh
  pressing, also PERSONA's exact pattern.

The `voice`/`prosody`/`double` TIMBRE groups are exhaustive per the brief's
requirement for the planned post-build tuning pass (82 params total across 10
groups). Deleted `fresh/GENESIS.md` per the registration checklist; its
grounding and design reasoning are folded into the machine's own "on this
music" panel and this entry.

### 2026-07-22 · plan session — GENESIS brief for FRESH (late-80s rap & hip hop)

Wrote `fresh/GENESIS.md`: design brief for op. XXX (provisional), a late-80s
rap machine — Devastatin' Dave the Turntable Slave as founding archetype,
reaching across 1984–89 (electro / Run-DMC rock / SP-1200 break era / swing).
Claims the concept + `fresh/` directory. No machine code.

Key design calls, for the build session:

- **Voice = evolved PERSONA.** The formant chain, phoneme tables, and syllable
  scheduler technique come from op. XXIX (study `persona/index.html`, write
  standalone). The rap-specific delta is *prosody*: declination + stress
  accents + boundary tones with a SING morph toward pentatonic sing-song,
  jitter (deliberately un-uncanny, unlike PERSONA), continuous voicing with
  coarticulation, plosives-as-percussion on the grid, schwa reduction.
- **The law = rhyme scheme against the beat**: STYLE (4 beat dialects) ×
  FLOW (PARK/SHOUT/LYRICAL) × THEME (PARTY/BOAST/MESSAGE) + SING/SCRATCH/HYPE.
  Lyrics from a closed hand-transcribed DICT built around rhyme families +
  stock-formula templates; seeded, deterministic, rhyme integrity enumerable.
- **Everything synthesized** incl. the scratched record (deterministic
  pre-rendered buffer + playbackRate gesture curves) and the sampling
  *aesthetic* (grit chain + crackle) — no samples, per house law.
- **Staged build** (beat → MC → turntables/polish), each stage shippable,
  because the machine is deliberately big.
- **A post-build vocal tuning pass is planned** (maintainer + OFFICINA):
  the brief requires the `voice`/`prosody` TIMBRE groups to be exhaustive —
  tuning must never need a code edit.

Open questions left to the builder: final rhyme-family roster and DICT size;
whether the voice-spelled MC-name device (letter phonemes) makes the cut;
duckDepth (scheduled bed dips) vs plain mix levels.

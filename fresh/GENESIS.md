# GENESIS — FRESH (op. XXX, provisional) · late-80s rap & hip hop

**Design brief. No machine code here** — this is the master plan for the build
session. Directory `fresh/` and the concept are claimed; the opus number XXX is
provisional until merged. **This is a big machine — build it in the three
stages at the bottom**, each independently shippable, and if the token budget
runs short, ship the completed stages *well* and log the rest in
`fresh/THREADS.md`.

**Read first:** the lean top matter of `HANDOFF.md`, then skim
`persona/index.html` (op. XXIX) — PERSONA is the repo's formant speech
synthesizer and this machine's voice is an evolution of it. Reuse its
*technique* (vowel/consonant tables, syllable scheduler, OFFICINA bridge, iOS
audio + Media Session blocks) — not by sharing code, but by studying it and
writing FRESH standalone, per house law.

**A post-build vocal tuning pass is already planned** — the maintainer will
hand the finished machine to another session to fine-tune the rap voice through
OFFICINA. Design consequence: **every perceptually relevant voice constant must
be a TIMBRE param** (see the TIMBRE sketch). If a voice quality can't be
reached from the bench without editing code, the build has failed this brief.

---

## Grounding

Rap in its golden late-80s hour, approached the way this catalogue approaches
every tradition: find the *law* the music obeys and make that the interface.

The archetype is **Devastatin' Dave the Turntable Slave** — the 1986 *Zip Zap
Rap* one-man outfit whose album cover became outsider-art legend. Played
straight, not as the meme: Dave is the *complete kit* of the era in one figure —
a solo MC with a drum machine, two turntables, an electro groove, party-rock
couplets, and a message rap ("zip zap rap… don't do drugs" — stay-in-school
sincerity). From that seed the machine reaches across the whole 1984–89 span:
electro boogie (Egyptian Lover, Mantronix), the spare 808 rock of Run-DMC, the
SP-1200 break era (Eric B & Rakim, EPMD, Marley Marl), and the swung end of the
decade.

The deeper grounding, for the "on this music" panel: rap's verbal line runs
through the **dozens** and **signifying**, prison and street **toasts**, the
radio jive of jocks like Jocko Henderson, and Jamaican **toasting** over sound
systems; its instrumental line through Kool Herc's merry-go-round (looping the
**break** between two copies of the same record), Grandmaster Flash's
quick-mix theory and the invention of **scratching** (Grand Wizzard Theodore),
into the drum machines — the TR-808's synthesized kit, then the SP-1200's
gritty 12-bit sampling — that let one person *be* the band. The MC's formulas
("…and I'm here to say", "to the beat y'all", "you don't stop", call-and-
response "say ho!") are the tradition's *fixed grammar*, exactly the way the
I/you ladder is PERSONA's and sol-mi-la is NENIA's: public, formulaic,
endlessly recombined. That recombination is what this machine automates.

Everything is synthesized — the drum machines, the bass, the orchestra hit,
the voice, even the record being scratched. No samples, per house law; the era
itself mostly ran on synthesis anyway, and where it sampled, we synthesize the
*aesthetic* of sampling (grit, lowpass, crackle).

## The law (the interface)

The law of a rap record is **the rhyme scheme against the beat** — where the
rhymes land, how the syllables subdivide the bar, and which break the DJ loops
under it. The user sets the law; the machine writes and performs the record.

Controls (each one a constraint, not a knob on a sound):

- **STYLE** — the beat's dialect, four of them (see The beat): `ELECTRO` ·
  `ROCKBOX` · `BOOM` · `SWING`. Sets kit, pattern family, bass idiom, swing,
  and tempo range.
- **FLOW** — the MC's rhyme law, three archetypes:
  - `PARK` — old-school party flow (the Dave archetype): AABB end-rhyme
    couplets, mostly 8th-notes, sing-song contour, the payoff rhyme squarely
    on beat 4.
  - `SHOUT` — Run-DMC style: staccato, short phrases traded against silence,
    heavy stress, line fragments answered by the double voice.
  - `LYRICAL` — toward Rakim: 16th-note subdivision, internal rhymes
    mid-line as well as line-end, enjambment across barlines.
- **SING** (0–100) — spoken ↔ sing-song: morphs the prosody from free speech
  contours (declination + stress accents) to pitch quantized on the track's
  minor-pentatonic. Dave lives in the upper middle.
- **SCRATCH** (0–100) — how much turntablism punctuates: 0 = none, top =
  cuts on every phrase end plus a scratch break.
- **HYPE** (0–100) — the crowd and the echo: posse doubles on hooks, echo
  throws on line-final words, "say ho!" response density, hype-man
  interjections (`yeah!` `c'mon!` `fresh!`) in the gaps.
- **THEME** — what the rap is about, three routines honoring the archetype:
  `PARTY` (rock-the-house), `BOAST` (skills brag, clean battle rhymes),
  `MESSAGE` (Dave's lane — stay in school, don't do drugs, believe in
  yourself; sincere, not winking).
- **TEMPO** — clamped to the chosen STYLE's era-plausible range.
- **VERSES** — song length; **r** = aliud (new seed), per house keys.

The law stays out of TIMBRE: patterns, vocabulary, templates, phoneme tables,
flow archetypes are model, not voicing.

## Generation — the MC (lyrics, flow, prosody)

All seeded (`mulberry32`, PERSONA-style), run once per pressing, cached; the
URL hash is the pressing.

### 1. Lyric generator — rhyme families × line templates

A **closed, hand-transcribed vocabulary** (like PERSONA's `DICT`, but larger:
target ≈ 250–320 words, ARPAbet-ish syllables, onset|vowel|coda). Its backbone
is **rhyme families**: groups sharing stressed vowel + coda. Spec ≈ 14
families × 4–8 members, chosen to serve the three themes, e.g.:

- `-ay`: say · day · way · play · okay · display · delay
- `-ock`: rock · clock · block · shock · knock · stop*(near)*
- `-ight`: right · night · tight · bright · sight · mic*(slant, own family if cleaner)*
- `-eat`: beat · street · feet · heat · complete · elite
- `-ame`: name · game · fame · same · claim
- `-ool`: school · cool · rule · fool · tool
- `-ind`: mind · find · kind · behind · designed
- `-ave`: wave · brave · save · behave · **dave** *(the archetype gets his family)*
- `-o`: go · know · show · flow · yo · ho
- `-op`: top · drop · stop · hop *(as in hip-hop)*
- plus families serving MESSAGE (`-ug`: drug · thug*(no — keep clean: rug, bug, hug)*, `-ool` above, `-ead`: head · said · ahead) — builder finalizes the roster; **every family member must be in DICT with a verified transcription.**

**Line templates** carry the era's stock grammar — slot-and-filler patterns
with syllable budgets and stress marks. Couplet = SETUP line + PAYOFF line;
both line-final words drawn from one rhyme family (LYRICAL flow additionally
plants a mid-line word from the same or a second family). Template flavor
(these are the tradition's floating formulas, not quotes of any one record):

- `well i'm {MCNAME} and i'm here to say …`
- `i rock the {mic|beat|house|block} {and i|then i} …`
- `from {here} to {…} i'm the {best|freshest} {around|in town}`
- `when i say {hip} you say {hop}` (hook)
- `to the beat y'all · you don't stop · one two three …` (cadence fillers)
- MESSAGE: `stay in school {…}` · `keep your {mind|head} {…}` · `you don't need {…} to be {…}`

An **MC NAME** is generated per seed from a small formula pool
(`{MC|DJ} {Devastatin|Magnificent|Supersonic|Diamond|Double} {D|E|J|Rock|Fresh}`),
displayed in the shell, rapped in the boast templates, and — stretch goal —
spelled letter-by-letter on the beat once per pressing (letter phonemes in
DICT). Every template slot must only ever draw words present in DICT — this is
enumerated in the verify gauntlet.

**Hooks** are call-and-response per THEME, built from the same stock: lead
calls, the crowd voice answers in the gap (`say ho → HO!`), 2–4 bars, repeated
with variation. HYPE scales how thick the response gets.

### 2. Flow mapper — syllables onto the grid

Each line's syllables are placed on a 16th-note grid per FLOW archetype:

- `PARK`: 8th-note spine, anacrusis pickup allowed, payoff rhyme's stressed
  syllable **on beat 4** (or pushed to 4& at higher seed-variation), line ends
  breathe — rest on the 1 before the next line.
- `SHOUT`: 2–5 syllable bursts, hard-quantized, ≥ 8th rests between bursts;
  the double voice answers fragments.
- `LYRICAL`: 16th subdivision with seeded syncopation (swing inherited from
  STYLE), internal-rhyme syllables placed on 2 and 4 or their offbeats,
  enjambment: a couplet may spill its payoff to the next bar's downbeat.

Per-syllable record: `{gridPos, dur, stress(0–2), pitchTarget, word, syll}`.
Stressed syllables get longer vowels and the pitch accents below. Unstressed
vowels **reduce toward schwa** (centralization amount is a TIMBRE param) — this
is a big part of why synthesis reads as speech rather than song. Gaps of ≥ a
beat at phrase ends get an audible **inhale** (filtered noise swell) — the MC
breathes; that's what makes the machine feel like a body at the mic.

### 3. Prosody — the rap voice's pitch law

This is the crux, and the biggest single difference from PERSONA (whose
dead-flat held pitch was the *point*). Rap pitch is **speech intonation,
rhythmically disciplined**. Model per phrase (line):

- **Declination**: baseline starts ≈ +5 semitones above `f0` base, decays
  exponentially to ≈ −2 st across the line (fresh reset each line).
- **Stress accents**: stress-2 syllables get a rise–fall bump (≈ +3 st, rise
  ~60 ms, fall ~120 ms); stress-1 half that.
- **Boundary tones**: statement lines fall a further ≈ −4 st on the final
  syllable; call lines (hooks, questions) rise ≈ +5 st. The PARK payoff
  rhyme takes a characteristic falling third — the old-school sing-song
  cadence.
- **SING morph**: the resulting per-syllable pitch target is pulled toward
  the nearest track-key minor-pentatonic degree with strength = SING/100;
  at high SING also flatten within-vowel movement (chant), at low SING leave
  the full speech contour.
- **Jitter/shimmer**: seeded noise → lowpass → small gain into the source
  oscillator's `detune` (≈ ±0.5–1 %) and a matching whisper of amplitude
  wobble. PERSONA is uncanny-flat on purpose; FRESH must **not** be — the
  jitter depth is a TIMBRE param the tuning pass will lean on.
- Glides between adjacent voiced syllables inside a phrase (portamento a few
  tens of ms) — never PERSONA's instant per-note snap, except at phrase
  starts.

All pitch numbers above are starting values — **every one goes in TIMBRE**
(`prosody` group) so the tuning pass can reach them.

## The beat — four dialects, varied by seed

Patterns are 16-slot velocity arrays per voice with seeded **variation masks**
(kick displacement, hat opens, ghost placement), a **fill** every 4th bar
(snare roll / tom run / cut), and an **event grammar** for form (below). Two
pressings of the same style must groove differently; the same seed must groove
identically. Swing is per-style (applied to offbeat 16ths).

- **ELECTRO** ('84–86, the Dave lane; ~108–126 BPM, straight): TR-808 kit —
  boomy tuned kick with syncopated doubles, clap + snare together, 16th
  closed hats with accent pattern, open hat offbeats, cowbell hits;
  synth-bass: tight-decay square/saw root–octave boogie line (minor
  pentatonic); sparkle: brief portamento zap fills.
- **ROCKBOX** ('84–86 Run-DMC; ~96–104, straight): spare and huge — kick on
  1 and 3&, cracking backbeat snare with a short gated-plate blast, few
  hats; a distorted power-chord stab (detuned saws through a waveshaper)
  once or twice a bar; almost no bass — the kick is the bass.
- **BOOM** ('87–88 break era; ~92–102, light swing 54–58 %): the synthesized
  *funky-drummer feel* — kick with midrange knock, snare with body + crisp
  noise, **ghost-note snares** at low velocity on offbeat 16ths, open hat on
  the &-of-4; the whole kit runs through the **grit chain** (gentle
  waveshaper saturation + lowpass ≈ 9 kHz) — the SP-1200 12-bit aesthetic,
  synthesized — over a seeded **vinyl-crackle bed**; bass: lowpassed saw
  finger-funk line with legato slides.
- **SWING** ('89; ~104–114, heavy swing 60–66 %): new-jack-adjacent — swung
  16th hats with open-hat chokes, kick syncopations landing with the bass,
  brighter snare; stabs get busier.

**Stabs** (all styles, seeded placement): the **orchestra hit** — the era's
Fairlight ORCH5 signature — synthesized as a fast-decay cluster of detuned
saws (root + fifth + octave, slight downward pitch bend) plus a noise burst,
plate send; also a horn jab and a piano jab variant. The orchestra hit doubles
as the **record** that gets scratched.

## The voice — a formant rap synthesizer

Source–filter synthesis, evolved from PERSONA's chain. **One persistent lead
chain** plus **one identical double chain** (hooks, SHOUT answers, crowd
response, ad-libs) — two chains total, never per-syllable node explosions.

Chain (describe → build): sawtooth source (f0 from prosody; detune fed by the
seeded jitter path) → **spectral tilt** highshelf (−N dB above ~3 kHz, TIMBRE)
→ glottal gate ‖ aspiration noise gate → mix → **five parallel bandpass
formants**: F1–F3 phoneme-driven (PERSONA's Peterson & Barney/Klatt tables are
already the male values — reuse the data, verify), F4 ≈ 3300 Hz and F5 ≈ 3750
Hz fixed presence formants at low gain → sum → per-syllable envelope → voice
level → master, with sends to slap echo and plate. Consonants as in PERSONA
(typed table: stop/fric/nasal/liquid/glide, burst bands, voiced bars) with rap
adjustments:

- **Plosives are percussion.** The stressed syllable's vowel onset lands on
  the grid tick; onset consonants *steal time from before the tick* (like a
  drummer's grace notes), bursts short (≤ 30 ms) and hot. Per-class consonant
  gains (stop/fric/nasal) are separate TIMBRE params.
- **Final stops often unreleased** (probability param) — "mic" ends glottal,
  not with a spat k; era diction.
- **Coarticulation**: formants glide (`setTargetAtTime`, tc per transition
  type); the glottal gate does **not** close between voiced phones within a
  phrase — continuous voicing is what separates speech from PERSONA's
  syllable beads.
- Minimum stressed-vowel duration ≈ 60–70 ms — intelligibility floor.

**The era's vocal chain**: slap **echo** (feedback delay, sync ≈ dotted-8th or
250–350 ms; TIMBRE) whose send is *thrown* — automated up on line-final words
per HYPE ("say… say… say…") — plus a modest plate. **Doubles**: the double
chain re-performs hook syllables offset +12–20 ms, detuned ±10–20 cents,
panned opposite — the posse. The crowd "HO!" is the double chain wide, loud,
plate-heavy. Mix law: **the voice sits on top of the beat, always** — set bed
levels down rather than voice up; master chain = shaper → compressor →
limiter, clip-safe (PERSONA's pattern).

## The turntables — scratch synthesis

The **record** is a short buffer (~0.8 s: orchestra hit, and — stretch — the
voice chain saying "fresh") rendered deterministically in a private
`OfflineAudioContext` at regen and cached. Scratching = an
`AudioBufferSourceNode` whose `playbackRate` follows a **gesture curve**
(`setValueCurveAtTime`) through a **crossfader gain** with its own gate curve:

- **baby** — rate swings +1 → −1, fader open;
- **chirp** — short forward burst, fader closes on the tail;
- **transformer** — slow drag with a square-wave fader chop on 16ths;
- **scribble** — fast small alternation;
- **backspin** — rate ramp to ≈ −3, once, as a section turnaround.

Gestures are scheduled at phrase ends, section turnarounds, the intro, and —
at high SCRATCH — a dedicated 4-bar scratch break mid-song. Each gesture uses
a fresh source node; **never overlap two curves on one AudioParam** (that
throws — a known Web Audio trap).

## Form

`intro` (crackle + cuts + "yes yes y'all" + MC name drop) → `verse` (12–16
bars) → `hook` (4–8, call-and-response) → repeat per VERSES → `break` (scratch
solo if SCRATCH high, else stab break) → last hook → `outro` (backspin, echo
throw dies out, sign-off line). Change-while-playing: STYLE/FLOW/HYPE/etc.
re-vibe at the next bar off `ac.currentTime`; SEED/THEME/VERSES regenerate.

## TIMBRE sketch

`TIMBRE.id='fresh'`. Groups (params illustrative — builder finalizes; factory
values must equal the literals they replace; **the `voice`/`prosody` groups
must be exhaustive — the post-build tuning pass works only through them**):

- `voice`: f0 base · formantScale · f1Q/f2Q/f3Q · f2Mix/f3Mix/f4Mix/f5Mix ·
  tilt dB · breath · jitter depth · jitter rate · consStop/consFric/consNas ·
  atk/rel · unreleasedProb · reduction (schwa amount) · level
- `prosody`: declStart/declEnd · accent semitones · finalFall · callRise ·
  glide ms · singKeyOffset
- `double`: offset ms · detune cents · width · level · crowdLevel
- `fx`: echoTime · echoFeedback · echoThrow · plateLevel · plateLen
- `kit808`: kickTune/kickDecay/kickClick · snare · clapSpread · hatDecay ·
  openHatDecay · cowbell levels…
- `kitBreak`: knock · body · ghostLevel · grit (shaper amount) · lpHz ·
  crackleLevel
- `bass`: level · decay · cutoff · glide
- `stabs`: orchDetune · orchDecay · orchBend · level
- `scratch`: recordTone · faderSharp · level
- `master`: gain · duckDepth (if implemented) · room

The **OFFICINA bridge is duplicated verbatim** from a current machine
(`persona/index.html`, the ~25-line IIFE building `TP` + the message handler)
with only `TIMBRE.id` differing; wire `TIMBRE.touch` (realtime: ramp the
running nodes) and `TIMBRE.demo(group)` (► HEAR: a couple of bars of just that
voice — a drum voice plays a few strokes, `voice` raps one line — through the
real graph in a short private context). Add the chip
`['XXX','fresh','FRESH']` to officina's `MACHINES`.

## Canvas

House economy — the model made visible, layer-cached, sleeping when idle:

- **Two platters + mixer** (the wheels of steel): platter rotation integrates
  actual playback — steady spin during the beat, visible wiggle mirroring the
  scratch gesture curve, crossfader nub tracking the gate.
- **The lyric ticker** — current line rendered with per-syllable lighting on
  schedule, and **rhyme-family syllables share a color** across lines: the
  rhyme scheme, the machine's law, literally visible. This is the canvas's
  centerpiece.
- A 16-LED beat lane (current 16th, kick/snare rows).
- `prefers-reduced-motion`: static frame, no spin, ticker updates per line
  not per syllable.

Shell chrome in era palette (dark + one hot accent); MC NAME on the marquee.
"on this music" panel: the Grounding section above in plain language —
dozens/toasting → Herc/Flash/Theodore → 808/SP-1200 → the golden late 80s,
with Devastatin' Dave presented straight as the outsider archetype.

## Keys & hash

Space play/stop · **p** pause · **r** aliud · **c** cut WAV (house keys);
per-machine: **1–4** STYLE · **f** cycle FLOW · **t** cycle THEME · **s**
scratch burst on demand. Hash: `#style.seed36.theme.flow.sing.scratch.hype.tempo.verses`
— full round-trip, hash *is* the pressing.

## Gotchas (day-one requirements)

- **iOS audio + Media Session from day one**: copy PERSONA's `__iosAudio` /
  `__mediaSession*` / silent-element pattern; `playback` session; resume
  across interruption/visibility; test pause (see RILLE's pause gotcha note
  in HANDOFF).
- **Offline render** reuses the *same* scheduling functions against an
  `OfflineAudioContext`; the scratch record buffer is deterministic and may
  be reused; WAV 16-bit; render twice in verify → byte-identical.
- **No `Math.random()` anywhere** — all noise buffers seeded, all choices
  from the seeded rng.
- One persistent voice chain per voice (lead + double); scheduler lookahead
  ~2 bars against `ac.currentTime`.
- `setValueCurveAtTime` overlap throws — fresh nodes per scratch gesture.
- CPU: bake noise (hats/clap/crackle) into seeded buffers once; per-hit spawn
  = source + filter + gain only.
- **Lyric originality**: everything the machine says is generated from its
  own closed vocabulary and stock-formula templates. The floating party
  formulas of the tradition are fair game; **distinctive lines from specific
  records are not** — no quotes. Keep the whole vocabulary clean (the era's
  party rap was).
- Registry sync (landing card, README row, HANDOFF table, officina chip) is
  minimal-diff, re-checked against `origin/main` at the rebase-before-PR.

## Considered and rejected

- **Samples of any kind** — against house law; also the point: synthesize the
  sampling *aesthetic* (grit chain, crackle) instead.
- **AudioWorklet glottal model (LF)** — better voice source in theory, but
  complicates the offline path and the single-file grammar; the
  saw + tilt + jitter source is the right cost. Revisit only in the tuning
  pass if the voice can't get there.
- **Free text input for lyrics** — breaks the closed-vocabulary determinism
  and pronunciation quality; the machine writes its own rhymes. (A future
  improve-pass could add it behind the same DICT.)
- **Bomb-Squad-density collage** ('88 PE wall-of-sound) — a wall of
  synthesized "samples" is its own machine; out of scope. Noted as a
  possible fifth STYLE later.
- **90s boom-bap** — out of era; FRESH is 1984–89.
- **True sidechain ducking** — Web Audio's compressor has no sidechain input;
  if ducking is wanted, schedule small bed-gain dips at voice onsets
  (`master.duckDepth`), else rely on mix levels.

## Verify gauntlet (all headless, zero page errors)

1. **Model enumeration** (node, ~`scratchpad/`): for a spread of seeds ×
   {4 styles × 3 flows × 3 themes}: every emitted token has a DICT
   transcription; couplet payoff words share a rhyme family (LYRICAL: internal
   plants verified too); syllable grid monotonic, non-overlapping, inside its
   phrase; two runs same seed → identical event-list JSON; two seeds →
   different.
2. **Transport smoke** (Chromium headless): boot clean; play ≥ 10 s in each
   STYLE; pause/resume; aliud; hash round-trip (set params → reload → same
   event list); `?bench` announces a well-formed schema; `?factory` bypasses
   overlay; ► HEAR demo per group runs without error.
3. **Offline render**: cut twice → byte-identical WAV; peak < 0 dBFS; RMS
   above a non-silence floor; render with voice solo'd (bed levels 0 via
   bench `set`) and confirm non-silence — the voice path itself is exercised.

## Build stages (ship in this order)

1. **The beat** — shell, model skeleton, hash, transport/scheduler, all four
   STYLEs (kits, patterns, bass, stabs, grit chain, crackle), canvas platters
   + beat lane, TIMBRE + verbatim bridge + touch/demo, iOS/Media Session,
   offline WAV, gauntlet 2–3 minus voice items. *Shippable as an instrumental
   beat machine.*
2. **The MC** — DICT + rhyme families + templates, lyric/flow/prosody
   generators, the two formant chains, echo/doubles/hype, hooks, lyric
   ticker, gauntlet 1 + voice render check. *The machine raps.*
3. **The turntables & polish** — scratch synthesis + gestures + break, form
   events (intro/outro, MC name drop, sign-off), HYPE crowd, "on this music",
   final registry sync + full gauntlet. Degrade path if budget bites:
   backspin-only scratching, note the rest in `THREADS.md`.

## Registration checklist (build PR)

- [ ] `fresh/index.html` — the machine, single file, zero deps
- [ ] Landing `index.html`: card (copy PERSONA's card shape; own `--bg`;
      `op. XXX · MMXXVI`, provisional)
- [ ] `README.md`: row XXX in the catalogue table (house prose density)
- [ ] `HANDOFF.md`: file-table line (minimal diff)
- [ ] `officina/index.html`: `MACHINES` chip `['XXX','fresh','FRESH']`
- [ ] `fresh/THREADS.md`: build session record at top; **delete this
      GENESIS.md** and fold its outcome in
- [ ] Rebase onto `origin/main` before PR; re-verify; opus number flagged
      provisional in the PR body

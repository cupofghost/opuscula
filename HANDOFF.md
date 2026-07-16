# Handoff

Complete orientation for OPVSCVLA. Paste this plus the files in scope at the
start of a session — it's meant to be enough to work without re-explaining.

---

## Architecture

**OPVSCVLA is twelve independent single-file Web Audio machines** plus a static
landing page. There is **no build step, no bundler, no dependencies, no npm, no
samples, no server-side anything.** Each `op.` is one self-contained
`index.html` — inline `<style>`, inline `<script>`, all synthesis in the
Web Audio API. GitHub Pages serves the repo as-is.

The machines share a design *grammar* (see Conventions) but **not code** — each
is deliberately standalone so it can be opened, copied, or shared as a single
file. Do not try to factor shared code across machines; that's a non-goal.

Typical machine shape (varies, but the spine is consistent):
- A **model** — the musical law (a mode/scale, a Camelot wheel, Fux's counterpoint
  rules, a change-ringing method, a rhythm timeline). This is the "interface":
  the user sets the law, the machine composes within it.
- A **generator** (`genAll` / equivalent) that turns seed + params into a
  deterministic score, run once and cached.
- An **audio graph** (`buildGraph` / equivalent) — synthesis voices + a master
  chain (shaper → compressor → sends → out), often with reverb/delay sends.
- A **scheduler** (`schedTick` / `scheduleBar`) that walks the score against
  `ac.currentTime` with lookahead.
- A **canvas** visualization, layer-cached, render loop sleeps when idle.
- **URL-hash serialization** — every param (seed included) round-trips through
  `#…` so a link reproduces the exact pressing.
- An **offline render** path that cuts a deterministic 16-bit WAV.

## Key decisions

- **One file per machine, zero dependencies.** Portability and longevity over
  DRY. A machine must keep working if you save just its `index.html`.
- **The law is the interface.** Controls expose the compositional constraint
  (rules, modes, methods), not knobs on samples. The machine composes; the user
  sets the law it obeys.
- **Deterministic + shareable.** Seeded generation; the URL hash *is* the
  pressing; offline WAV render is deterministic. A shared link or a cut WAV must
  reproduce exactly.
- **Change-while-playing.** Where a machine runs a groove, param changes re-vibe
  at the next bar rather than restarting the transport (keyed off
  `ac.currentTime`, which the scheduler already reads).
- **Correctness where the domain has a right answer.** PEAL verifies every
  method/touch is *true* (no row rung twice); GRADUS enforces Fux's rules;
  tuning machines (SCALA, COCHLEA, BOLG, KHÖÖMEI) use exact just-intonation
  ratios. Don't approximate where the tradition is exact.
- **iOS audio handled deliberately** — `playback` session, resume across
  interruptions/visibility. Watch this when touching transport (see the RILLE
  pause gotcha below).

## File structure

```
index.html          landing page / catalogue; has the ↓HANDOFF download button
README.md            public catalogue + shared grammar
HANDOFF.md           this file (also downloadable from the landing page)
pas-sale/index.html  op. I    PAS SALÉ   — zydeco two-step
scala/index.html     op. II   SCALA      — Shepard–Risset in just intonation
gradus/index.html    op. III  GRADUS     — species counterpoint after Fux
rille/index.html     op. IV   RILLE      — minimal techno dubplate (see threads)
cochlea/index.html   op. V    COCHLEA    — just-intonation comma pump
bolg/index.html      op. VI   BOLG       — generative uilleann piping
peal/index.html      op. VII  PEAL       — English change-ringing
holler/index.html    op. VIII HOLLER     — Appalachian old-time banjo
foli/index.html      op. IX   FOLI       — West African djembe & dunun
nenia/index.html     op. X    NENIA      — playground chant
khoomei/index.html   op. XI   KHÖÖMEI    — Mongolian throat singing
spannung/index.html  op. XII  SPANNUNG   — self-patching modular synth
```

The `op.` roman-numeral order is fixed and lives in `index.html` and `README.md`;
keep all three (page, README, this file) in sync when adding a machine.

## Conventions

**Working process (agreed with the maintainer):**
- Keep this HANDOFF.md current — update it at the **end of every session**
  without being asked (architecture, decisions, structure, threads).
- During iteration, output **patches/diffs, not full-file rewrites.** Emit a
  whole file only when creating it or when changes exceed ~50%.
- Don't restate the request or recap prior turns; answer directly.
- **Keep scope to the module in play** and flag when we've drifted.
- If a large file is pasted but only part is needed, work from that part — don't
  reproduce the whole file back.

**Repo/product conventions:**
- Shared keys: **space** = play/stop · **r** = another (aliud/encore) ·
  **c** = cut 16-bit WAV. Per-machine keys are documented in-page.
- Every machine carries an expandable **"on this music"** panel — plain-language
  history of the idea it renders.
- `prefers-reduced-motion` respected throughout; render loops sleep when idle;
  canvas layers cached.
- Verify audio work **headless (Chromium)**: enumerate the model for
  correctness, then smoke-test the transport/scheduler and offline render for
  runtime errors. See the RILLE threads for the pattern.
- Git: develop on the feature branch, commit with descriptive messages, push;
  **don't open a PR unless asked.** The music-theory / design reasoning tends to
  live in commit messages.

## Open threads

Newest first.

### RILLE — emotional-minor harmony: longing default, rationed resolution
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **File:** `rille/index.html`
· **Status:** done, verified (Node harmony sweep + headless Chromium render); no PR.

Maintainer note: "the notes/harmonies aren't hitting right — vibe should be
emotional, minor, longing; major chords minimal and short; only resolving in
longer emotionally-charged sections." Researched emotional-minor writing and
reworked the harmonic language (not the synthesis). Four moves:

- **A real resolution — the harmonic-minor dominant.** Every mode here is minor,
  so its diatonic *v* has no leading tone and cannot pull home; the loop just
  floated. Added a `dom` chord style to `buildChord`: on the fifth degree it forces
  a **major third (the raised leading tone) + ♭7 → V7**, the one chord that
  genuinely resolves to i. It's reserved for cadences, marked per-progression.
- **`hold` = the charged, sustained cadence.** Progressions now carry a `dom` set
  and a `hold` set. `hold` chords are played as one slow 2-bar **swell** (pad-style)
  instead of short stabs, and the **bass steps V→i** (during `dom`/`hold` the bass
  follows the chord root even in pedal moods). So resolution only *lands* in the
  longer sections; elsewhere the minor hovers, majors stay short/passing.
- **Longing progressions.** New `PROGS` menu: harren (i), senken (i–♭VI), sehnen
  (i–iv), fallen (i–♭VII–♭VI–i aeolian descent), **andalu** (Andalusian cadence
  i–♭VII–♭VI–V), gebet (i–iv–♭VI–V), **aufloesung** (6-chord phrase, one V→i at the
  end). Mood defaults rewritten to match: FINSTERNIS i–♭VI, SCHATTEN i–♭VII–♭VI–i,
  **TRÄNEN i–♭VI–iv–♭VII–V→i** (flagship resolving), EISEN i (drone), DÄMMERUNG
  i–IV–♭VII–V→i, LEERE i (drone), SOG i–IV–V→i.
- **Modes toward longing.** SCHATTEN dorian→**aeolian**. Others kept (phrygian for
  the dark FINSTERNIS/EISEN, aeolian for TRÄNEN/LEERE, dorian for the warmer
  DÄMMERUNG/SOG). `progDom`/`progHold` are new optional mood fields; `g.dom`/`g.hold`
  ride alongside `g.progDeg`. `romanOf`/`chordLetters` take a `dom` arg and print the
  V/`x7`. New in-page "Longing and release" note explains it.
- **Verified:** Node — all 7 mood defaults + 8 progs × seeds (2240 pressings)
  compose with 0 non-cluster ♭9 and 0 structural fails; every `dom` chord confirmed
  a true V7 (leading tone + major third + ♭7), every resolving mood has a V→i tonic
  (e.g. TRÄNEN `…E7→Am`, DÄMMERUNG `…A7→Dm`, SOG `…D7→Gm`). Chromium — the four
  resolving/hovering moods render a full 16-bar phrase (cadence swell + bass V→i)
  with zero pageerrors; live UI ledger shows the prog correctly.
- **Pick-up / caveats:** `dom` assumes the marked step is **degree 4** (the V root);
  keep it there. On **dorian** moods, progs that use degree 5 (fallen/andalu/
  aufloesung) render a passing **vi° (diminished)** rather than ♭VI — valid, adds
  yearning, de-clashed, but if you want ♭VI there switch that mood to aeolian.
  **Permalink note:** this changes the harmony of *every* pressing (mood defaults
  and the `p` prog-index both moved), so links cut before this sound different — by
  design, no hash version bump. The register anchor puts V ~a fifth below the tonic
  stabs (same band, verified in range); lift it if a mood's V feels low.

### HOLLER — clean loop, mellower tone, a fiddle lead
**Branch:** `claude/banjo-loop-sound-design-qjlfm4` · **File:**
`holler/index.html` · **Status:** done, verified headless (Chromium); pushed to
`main`.

Three moves:

- **Seamless loop.** The master render is one pass (`dur`) + a `tail=1.1s`
  ring-off. Realtime looped the *whole* buffer, so every seam had a silent gap,
  and the canvas (which assumes a period of `dur`) drifted 1.1 s per pass. Added
  `makeLoopBuffer(buf,dur)`: cuts to exactly `round(dur*SR)` and **folds the
  ring-off tail back onto the head** (`out[i-L]+=buf[i]` for `i≥L`) so the last
  notes' decay carries over the loop point. `play()` now feeds that; the WAV
  `cut()` still uses the plain one-pass `R.buf` (unchanged, non-looping). Loop
  period is now precisely `dur`, which also re-syncs the playhead. Verified:
  `loopLen==round(dur*SR)`, non-zero head energy (folded ring present), no NaN.
- **Mellowed the timbre.** Softened the Karplus–Strong nail-click chip
  (`.13→.085`); in the body chain added a gentle **lowpass 5.2 kHz Q0.6** and
  eased the top **highshelf +2.5→+1.2 dB** (the `biquad` RBJ helper gained a
  `lowpass` type). Reads warm-on-a-porch rather than brittle. Peaking-330 pot
  resonance and highpass-85 untouched.
- **Added a fiddle part** — a fourth string-band voice (**bit 8** in `backMask`;
  old permalinks without the bit reproduce fiddle-off). It's a **bowed** string,
  so *not* Karplus–Strong: new `fiddleNote()` is additive — a 1/k sawtooth
  spectrum one-pole-rolled at ~3 kHz, bowed attack/release, faint bow-noise, and
  ~5 Hz / ±9 c vibrato. `fiddleEvents()` carries the tune's **melody an octave
  up** (`foldTo …,66,86`) in slurred quarter-notes (held `eighth*2*1.04` so they
  legato) with the odd passing eighth, swung with the lilt; folded into the same
  master buffer in `renderMaster` when `st.backing.fiddle`. New UI toggle
  `#bkFiddle` on its own row above the rhythm section (it's the lead, not the
  boom-chuck). **Default is ON** — the default hash is now `bk=11`
  (guitar+bass+fiddle). Reader "string band" note updated (heterophony);
  `another()` leaves backing as-is.
- **Pick-up:** the tab canvas stays banjo-only by design (it's tablature for the
  right hand — the fiddle isn't drawn, confirmed with the maintainer). If a
  busier fiddle is wanted, raise the passing-eighth probability (`rng()<0.32`) or
  drop it to the full eighth-note line for tight heterophony with the melodic hand.

### RILLE — minimal deep tech mood + smoother chords
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **Files:** `rille/index.html`
(+ mood-count copy in `README.md`, `index.html`) · **Status:** done, verified
(Node model check + headless Chromium render); no PR opened.

Driven by a minimal-deep-tech production guide. Two moves, both additive:

- **New 7th mood — SOG** (`id:'gurges'`, gloss *hypnotisch*): the warm, rolling,
  stripped-back deep-tech pocket the existing six lacked (they lean dark/
  industrial). 123 BPM, Dorian (bright natural 6th), `root:43` → **6A** on the
  Camelot wheel (was unused; keys are derived from `root`, no separate table).
  Rolling deep sub (`bass:'roll'`), soft multi-burst clap, offbeat opens, gentle
  `swing:.07`, moderate `duck:.42`, sparse **open-sus stabs** (`vstyle:'sus9'` —
  no third, deep-house colour; `progDeg:[0,3]` = i–IV). Appended to `MOODS`, so
  the affect button, key, arrangement and hash slot (`o.a`=6) all auto-wire and
  every existing permalink (indices 0–5) is untouched. All moods are minor-family
  → SOG stays on the A ring, participates in AUTO-SET harmonic mixing normally.
- **Smoother chord sound design** (`vChord`, all moods): the stabs bit because the
  detuned saws pushed buzzy upper harmonics through the resonant stab bandpass and
  an 8 ms attack clicked. Added a gentle **warmth lowpass** (pad 2200 / stab 2900
  Hz, Q .4) before `stabBP` and softened the stab attack **8 ms → 22 ms** (detune
  ±6→±5, peak .3→.28). **Timbre only — voicing/`buildChord` untouched**, so the
  earlier ♭9/register fixes still hold. EISEN's `[0,6,13]` cluster stays
  deliberately harsh; the warmth filter just rounds it slightly.
- **Verified:** Node — 7 moods, SOG=6A unique, 1600 SOG pressings compose with 0
  problems, non-cluster ♭9 count 0. Chromium — SOG selects at 123 BPM, full graph
  + `vChord` + `scheduleBar` + offline render run with zero pageerrors, valid
  audio, sus9 voicings correct (G–C–D–A / C–F–G–D). Only console noise is the
  Google-Fonts fetch the sandbox proxy blocks (cosmetic, pre-existing, all works).
- **Pick-up:** SOG uses short sus stabs, not a pad; if a pad-underlay version is
  wanted, flip `stab.pad`. The guide's "warm master saturation" was deliberately
  *not* added — the ask was less-harsh, so I subtracted highs rather than adding
  harmonics. `bpm 123`/`swing .07`/`duck .42` are the feel knobs.
### NENIA — simplified visuals + childlike control labels
**Branch:** `claude/project-working-conventions-xjaafw` · **File:**
`nenia/index.html` (canvas revert + control copy) · **Status:** done, verified
headless; no PR opened. Audio/compose untouched.

Two moves:

- **Rolled back the "whimsical" canvas layer** (the wobbly hand-drawn figures
  with faces/hair, the chalk-doodle backdrop, giggle sparkles, bouncy
  `sayWord` lettering, per-kid bob, and the title-dot bob) — it read as too
  busy. Restored the clean stick-figure style by resetting `nenia/index.html`
  to commit `1bf8558` (the "expand" state), which **keeps the new-game
  animations** (ball arc, hopscotch grid/hopper, arch bridge + filing line).
  `kidFig` is back to the simple `(x,y,c,scale,glow,fallen)` signature; active
  kids just glow. If revisiting whimsy, the busy version is commit `b7a3966`.
- **Reframed every control into child logic** (labels/option text only — all
  `value`s and `id`s unchanged, so the hash + engine are untouched). You pick a
  *person* to lead, not a pitch: "Who starts?" → **Marcus / Erica / Priya /
  Baby Theo** (still map to G/A/B♭/C via the unchanged `keysel` values; Erica =
  the old "A — the usual" default). Likewise "What are we playing?", "How many
  of us?", "How much of a tune?" (was Chant range: trichord/tetratonic/
  pentatonic → "Just the teasing notes / a bit more of a tune / the whole
  sing-song"), "Where are we?" (was Yard), "How fast?" (was Pace), and "ROWDY —
  nobody's quite in tune". The literary "on this music" notes keep the real
  theory terms — the child-framing is only on the interactive choices.
- Verified headless: parse clean, no console errors, clean-style arch/counting
  canvases render, option `value`s confirmed intact (engine unchanged).

### NENIA — expanded the playground-lore machine
**Branch:** `claude/project-working-conventions-xjaafw` · **File:**
`nenia/index.html` (+ catalogue lines in `README.md`, `index.html`) ·
**Status:** done, verified headless; no PR opened.

"More music, more options, more animations." Went from 5 games to 8 and widened
the melodic material.

- **Three new games** (indices 5–7 in `GAMES`/`compose`/`draw`): **BALL-BOUNCE**
  (two-ball; verse then accelerating count, a leg-over on every 4th beat, ends on
  a seeded miss), **HOPSCOTCH** (hop the numbered stones, both feet on the
  rest-squares 4/7/top, seeded wobble-out or a clean run home), **ARCH**
  (London Bridge / Oranges & Lemons — two kids form the bridge, the rest file
  through, it drops on the last word and catches whoever's under). RING was the
  `else` catch-all in `compose`; it's now an explicit `game===4` block and ARCH
  is the fallback.
- **Chant-range option** (`P.scale`, new `#scalesel`): trichord → tetratonic
  (adds `re`, −5) → pentatonic (adds low `do`, −7). `CELLS` gained `lv`-tagged
  cells; `fitCell(rng,n,scale)` filters to cells the range allows. The trichord
  taunt (`CELLS[0]`) stays pure regardless.
- **More options:** children up to 10 (was 8); a third yard, **Gymnasium**
  (`yard===2`), longer/brighter convolution — `makeVerb` and the wet-gain are
  now `[dry,corridor,gym]` lookups.
- **New animations** (in `draw`, early-return branches; new marks folded in
  `stateAt`): bouncing ball arc + leg-swing; a chalk hopscotch grid climbed by a
  hopper that tilts on a wobble; the arch bridge with a filing line that drops
  and rings the caught kid. New percussion voices: `bounce`, `legover`, `roll`,
  `hop`, `landboth`, `archdrop`.
- **Hash bumped v1→v2** (appends `scale`). `readHash` accepts both — v1
  permalinks load with `scale=0`. Verified: 72 game×range×kids combos compose
  with no bad degrees / zero-durations, all six degrees exercised, trichord
  gating holds, live play + hopscotch offline WAV render clean (peak .44), hash
  round-trips.
- **Pick-up:** the *range* option only affects the sung games, not the taunt (by
  design). ARCH could eliminate repeatedly like counting-out instead of a single
  capture, if a longer game is wanted.

### RILLE threads
All in `rille/index.html`.

### RILLE — harmonic auto-mixing between generated tracks (DJ set)
**Branch:** `claude/rille-hiss-pause-4dojix` · **Status:** done, verified
headless; no PR opened.

An **AUTO-SET** toggle turns RILLE from one track into an endless DJ set: every
`SET_BARS` (48) it beatmatches and blends into a fresh track in a
**Camelot-compatible key**, over a long phrase-aligned crossfade with a **bass
swap**. **JETZT →** triggers the next blend by hand (keys: `m` mix, `x` auto). A
readout shows current Camelot key + queued move.

- **Harmonic model (Camelot):** every mood is a minor mode → every track sits on
  the Camelot **A ring**; key = tonic pitch-class. `CAMELOT_PC`/`PC_CAMELOT` map
  both ways; ±1 Camelot = a fifth/fourth. Rendered moves (all minor→minor,
  wheel-legal): same key, +1, −1, +7 (semitone lift), +2 (whole-tone lift).
  `pickHarmonicMove` weights fifths/fourths highest. **B-ring / relative-major
  moves are NOT rendered — the engine has no major mode.** Mood keys: FINSTERNIS
  4A, SCHATTEN 1A, TRÄNEN 8A, EISEN 9A, DÄMMERUNG 7A, LEERE 5A. `genAll` gained a
  `rootOverride`; `st.root` carries the live key.
- **Minimal-techno principles:** long phrase-aligned blends (`BLEND_BARS`=16),
  beatmatch (both decks share one bar clock at `st.bpm`), bass swap (incoming
  low end held out by a highpass until the mid-blend swap so basslines never
  stack), transition-by-subtraction (outgoing stabs/claps/melody stripped at the
  swap, then it fades).
- **Dual-deck architecture:** `buildGraph` is now a shared **mixer** (master
  shaper→comp→out + shared reverb/delay sends). `makeDeck()` hangs a full
  channel-strip per track (part gains, own sidechain duck bus, stab filter, kick
  drive, sends, a **fader**/crossfader, a **bassKill** highpass, and a post-comp
  **deckFloor** for the hiss). Voice functions unchanged — first arg still `G`,
  now a deck with the same field names. `RT.decks[]` holds live decks (1
  normally, 2 during a blend); `schedTick` schedules each at the same `t`.
  `startMix`/`doSwap`/`finishMix` run the blend; outgoing deck retired, incoming
  promoted to primary (`st.g` etc.). Hash gained `k` (key) and `x` (auto).
  `cutPlate` builds one deck; offline WAV stays a single track.
- **Pick-up:** only the A ring is reachable — a major-mode voicing would unlock
  relative/diagonal (B-ring) moves and the full wheel. `SET_BARS`/`BLEND_BARS`
  are consts near the Camelot helpers for pacing tweaks.

### RILLE — hiss was pumped by the kick; added a pause button
**Branch:** `claude/rille-hiss-pause-4dojix` · **Status:** done, verified headless.

- **Hiss un-pumped + lowered:** the surface hiss (`h` noise loop in `startDust`,
  part `pulvis`/STAUB) ran through the master compressor, so the "constant" hiss
  ducked on every kick — nothing a real pressing does. Fix: added `G.floor`, a
  gain tapped **straight to `ac.destination`** after the master comp; hiss routes
  there instead of the part bus. Level `.006 → .004` (× mood `dust`). STAUB mute
  still rides `G.floor.gain`. Crackle/pops stay on the part bus (request was
  about the hiss).
- **Pause button:** `#pause` beside SPIEL (+ `p`). `togglePause()`
  suspends/resumes the AudioContext; everything is keyed off `ac.currentTime`
  (frozen while suspended) so transport + visuals hold and resume exactly.
  Button reads PAUSE↔WEITER. **Gotcha:** the iOS unlock `kick()` auto-resumes any
  non-running context on statechange/visibility — it was instantly undoing the
  pause. Guarded with `if(!st.paused)`.

### RILLE — chord progressions sounded broken/clunky
**Branch:** `claude/rille-chord-dissonance-io1zr6` · **Status:** done, committed,
pushed. No PR.

- **Root cause 1 — a diatonic ♭9 (the "broken" clang):** `buildChord()` stacked
  its ninth at `rel(8)` diatonic steps without checking the interval; on degrees
  whose upper neighbour is a semitone that ninth is a **♭9 (13 semitones)** — an
  avoid-note, baked into the default mood and most progressions. Fix: fold a ♭9
  to the octave (`nine()` → `13 ? 12`); guarded the `sus9` frame against
  aug-4th/dim-5th semitone clusters. `ferrum`'s `[0,6,13]` cluster is
  **intentionally harsh — left alone.** Commit `571907b`.
- **Root cause 2 — every stab in a different register (the "clunk"):** chords
  were voiced root-position at `root+12+base`, leaping up as the progression
  climbed. Fix: anchor each chord root to the octave nearest the key root, moving
  the voicing as a rigid block (intervals untouched). Span ≤10 semitones,
  worst step ≤9, nothing sinks into the bass. Precomputed in `genAll` as
  `g.chords`, read by `scheduleBar`. Commit `ea91fb2`. True nearest-previous
  voice-leading was considered and rejected — it drifted down and lurched ~14
  semitones at the loop point; register-anchoring is loop-stable.
- **Pick-up:** optional next step is light inversion / true voice-leading with
  anti-drift clamping, if parallel-block motion feels stiff. Engine is
  `buildChord` / `genAll` / `scheduleBar`.

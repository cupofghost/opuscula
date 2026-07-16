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

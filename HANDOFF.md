# Handoff

Complete orientation for OPVSCVLA. Paste this plus the files in scope at the
start of a session — it's meant to be enough to work without re-explaining.

---

## Architecture

**OPVSCVLA is twenty-two independent single-file Web Audio machines** plus a static
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
icon.svg             app icon (master); icon-512/192.png, apple-touch-icon.png,
                     favicon-32.png rendered from it · site.webmanifest (PWA)
officina/index.html  OFFICINA — the voicing bench (backstage, NOT an op.)
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
tambour/index.html   op. XIII TAMBOUR    — French military field drum (martial-industrial)
gongan/index.html    op. XIV  GONGAN     — Central Javanese court gamelan
diamond/index.html   op. XV   DIAMOND    — Harry Partch's tonality diamond
sublow/index.html    op. XVI  SUBLOW     — dubstep / sound system music
tessera/index.html   op. XVII TESSERA    — a self-predicting language model (PPM)
vyvid/index.html     op. XVIII VYVID     — Crimean steppe women's polyphony
tritava/index.html   op. XIX   TRITAVA    — Bohlen–Pierce scale (a music with no octave)
germen/index.html    op. XX    GERMEN     — an L-system that grows music from grammar
forfex/index.html    op. XXI   FORFEX     — early tape splicing (musique concrète, elektronische Musik)
fado/index.html      op. XXII  FADÓ       — portuguese fado (mezzo-soprano voice + guitarra)
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
- Shared keys: **space** = play/stop · **p** = pause/resume · **r** = another
  (aliud/encore) · **c** = cut 16-bit WAV. Per-machine keys are documented in-page.
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

## Working in parallel — many sessions, one main

Several chats now work this repo at once, each on its own `claude/*` branch,
all landing on `main`. Every rule below exists because the failure it prevents
has already happened here: two branches claiming the same opus number, stale
branches sixty commits behind, merged branches resumed, work stranded on
pre-rewrite history. (See the "state of the branch farm" thread for the
current inventory.)

**Branch discipline**
- **One session = one branch = one scope** — usually one machine. Before
  starting, `git fetch origin` and scan `git branch -r` plus recent
  `origin/main` history: if a live branch is already working the same
  machine, coordinate through the maintainer rather than racing it. Two
  branches must never edit the same machine's `index.html` concurrently.
- **First act of a session: `git fetch origin main` and start from (or
  rebase onto) `origin/main`.** The container's local `main` is a snapshot
  from clone time and is usually already stale.
- **Last act of a session: fetch again, rebase onto `origin/main`, re-verify,
  push.** Land small and land often — the abandoned branches in the farm are
  the ones that sat unlanded until rebasing became archaeology.
- **A merged branch is finished.** Never stack follow-up commits on it;
  restart the branch from `origin/main` (`git checkout -B <branch>
  origin/main`) and treat the follow-up as fresh work.
- Branches with **no merge base** against `origin/main` predate a history
  rewrite and cannot be merged. Anything still wanted from one gets
  re-implemented fresh on `origin/main`.

**Claiming an opus number / directory**
- **Numbers are claimed by landing on `main`, not by designing.** While a
  machine is in flight its number is provisional. At every rebase, re-read
  the registry (file table above / `index.html` / `README.md`) on
  `origin/main`; if another machine landed first, take the next numeral —
  the directory name keeps, the op. number moves.
- Before scaffolding a new machine, also check the other live branches for
  an in-flight directory of the same name. Two in-flight machines may share
  a provisional number (the rebase rule resolves it) but never a directory.

**HANDOFF.md — the one file every branch edits**
- Touch only (a) your own Open-threads entries and (b) the exact lines your
  change requires in the fixed sections (your row in the file table, one
  convention bullet). **Never reflow, reorder, or cosmetically rewrite
  sections you didn't work in** — that is what turns parallel edits into
  real conflicts.
- New Open-threads entries go at the **top** of Open threads, self-contained
  under their own `###` heading. Top-insertion means concurrent branches
  conflict at the same spot and the resolution is mechanical: **keep both
  sides' threads** (either order), then re-merge any fixed-section lines by
  hand.
- Only a session that deliberately reorganizes this file (like this one) may
  restructure it — and that session should touch nothing else.

**Registry files** — the landing `index.html`, `README.md`, the file table
here, and `officina`'s `MACHINES` chips:
- Add your row/chip as a **minimal diff** — no reordering, no reformat, no
  drive-by copy edits. All four must agree at every landing; the
  rebase-before-push is where you re-sync them against what landed under you.

**Cross-machine sweeps** — bridge changes, a convention applied everywhere:
- The OFFICINA bridge is duplicated verbatim in all twenty-one machines, so
  editing it touches every file and conflicts with every live branch. A
  sweep gets its **own dedicated branch**, mixes in no per-machine feature
  work, lands fast, and announces itself in Open threads so per-machine
  sessions know to rebase before continuing.

**Design briefs** (`rille/HARMONIA.md`, `diamond/GENESIS.md`):
- A brief in a machine's directory claims the **concept and the directory
  name, not the opus number** — the number is assigned when the machine
  ships. Delete the brief when it ships and fold the outcome into the
  HANDOFF thread (the briefs themselves say so).

## TIMBRE / OFFICINA — the voicing layer (all machines)

Since 2026-07: **every machine's synthesis constants live in a `TIMBRE` block**
near the top of its script — schema `{id, title, doc, groups:{g:{label,doc,
params:{p:{v,min,max,step,unit?,label,doc}}}}}` — and the code reads
`TP.<group>.<param>` instead of scattered literals. `TP` is built by the
**OFFICINA bridge**, a ~25-line IIFE **identical in every machine** (the one
deliberate exception to "no shared code" — it's duplicated, not factored):

- Standalone: overlays `localStorage['opvscvla.timbre.<id>']` (`{preset,v}`,
  modified-only values) onto the defaults at boot; `?factory` bypasses.
- In the bench (`?bench`, i.e. iframed by `officina/`): announces
  `{op:'schema', schema, values}` via postMessage (`{officina:1, id}` envelope)
  and accepts `set {path,value}` / `bulk {values}` (bulk = reset-then-apply) /
  `hello`. `TIMBRE.touch(path)`, assigned later per machine, pushes edits into
  a running graph — realtime machines ramp nodes; prerendered machines
  (FOLI/TAMBOUR/HOLLER/PEAL's bells) re-render debounced ~300 ms.

**`officina/index.html`** is the bench (backstage, not an op.; linked from the
landing-page colophon): machine chips → the real machine runs in an iframe
(`?bench`) while its schema renders as a documented panel — per-param slider +
number box + factory reset, modified markers, per-machine "how this instrument
is built" doc. Presets: save/load/delete by name per machine
(`opvscvla.presets.<id>`), export/import JSON, FACTORY, **A/B** (flips the
running machine to factory while lit), **COPY TWEAKS** (modified-only JSON to
clipboard — the format to paste into a chat when asking for values to be baked
in as new factory defaults). Every edit write-through-debounces to the applied
key, so machines opened directly speak with the dialed-in voice.

Conventions when touching this layer:
- `TIMBRE.id` === the directory name (that's how the bench addresses it).
- Factory defaults in TIMBRE must equal the literals they replaced —
  derived buffer lengths/stop-guards may scale with edited params but must
  equal the old constants exactly at factory values.
- The law is NOT voicing: scales/ratios/patterns/moods (e.g. RILLE's per-mood
  `M.*`, KHÖÖMEI's harmonic sets, NENIA's kid personalities) stay out of
  TIMBRE. When adding a machine, add a TIMBRE + bridge + touch and it appears
  on the bench automatically (add its chip to `MACHINES` in officina).
- **Audition (► HEAR):** the bridge also takes `{op:'demo', group}` →
  `TIMBRE.demo(group)`, and the bench puts a ► HEAR button on every group.
  Buffer-baked machines (FOLI, TAMBOUR, HOLLER, PAS SALÉ, GRADUS, PEAL,
  GONGAN) play a few strokes of just that voice, freshly synthesized with the
  current TP,
  through their real graph in a short-lived private AudioContext; continuous
  machines (KHÖÖMEI, SPANNUNG, SCALA, COCHLEA, BOLG, RILLE, NENIA) start
  their transport if stopped — their touch hooks already apply edits live.
  **The rebake machines (FOLI/TAMBOUR/HOLLER) deliberately do NOT restart
  mid-play on an edit any more** — the stop-and-rebake read as a crash to the
  maintainer; baked edits now apply on the next play, ► HEAR is the instant
  audition path.
- Verify with `scratchpad/verify-officina.mjs <dir> expected-<dir>.json`
  (playwright-core + bundled Chromium): factory load/play/cut smoke, schema
  well-formedness, expected-literal table, live set / bulk / localStorage
  overlay round-trips; `verify-bench.mjs` and `sweep-bench.mjs` drive the
  bench UI itself. All 13 pass (387 params).

## Open threads

Newest first.

### FADÓ — new machine, op. XXII (portuguese fado: voice + guitarra)
**Branch:** `claude/niche-musical-machine-yolbzs` · **File:** `fado/index.html` ·
**Status:** done, verified headless (HTML schema validation, function signatures, hash round-trip). New op. Registered in `index.html` (card + counts bumped twenty-one → twenty-two), `README.md` (row), `officina` (chip), `CLAUDE.md`, and the file-structure list above; counts updated everywhere.

A single-session build (design + implement + verify + register), full autonomy. Maintainer's brief: a new niche musical machine following a real tradition.

**The machine:** Portuguese fado — music of *saudade*, the melancholic yearning born in Lisbon's Alfama and the port's marginal communities. Sung by *fadistas* (fado singers) over the classical 12-string *guitarra*. The law is harmonic: a small set of modal chord progressions (Am–E–Am, Em–B–Em, Dm–A–Dm variations) that cycle through the piece. The fadista melody is generated to wander within a chosen mode (Phrygian *triste*, harmonic minor *anguished*, Aeolian *melancholic*) but stays constrained to the harmonic law — each pressing follows the same harmonic structure with different melodies, all seeded and deterministic.

- **The law is the harmonic progression.** Three progressions (pool-weighted at generation time); three modes (Phrygian/harmonic minor/Aeolian), exposing the three emotional qualities of traditional fado; tempo 60–100 bpm for the *cadence* (the bass drum pace). Mode and progression are chosen per pressing; all three are user-controllable and hash-serialized.
- **Melody generation (`genAll`):** seeded random walk within the mode's scale degrees, constrained to small steps (−1/0/+1 per note), landing on harmonic-chord tones at strong beats for structural coherence. Pitch context (last 3 notes) drives the walk to avoid big leaps — mimicking the ornamental *melismatic* singing fado is known for.
- **Voices:** FADISTA (mezzo-soprano sine oscillator with vibrato + envelope per note) · GUITARRA (bass notes + harmonic partials, decaying Karplus–Strong resonance via pluck synthesis) · BASS DRONE (continuous sine anchor). All tuning is just intonation (JI) over a single 220 Hz literal; ratios stay integer `[num,den]` end to end.
- **Audio graph:** voice → guitarra → bass (master compressor) → reverb send/dry split (seeded convolver IR) → master limiter → out. Reverb IR is seeded from the composition seed so the room is consistent per pressing.
- **Canvas visualization:** a horizontal strip showing the realized harmonic progression (chord symbols, root notes) and a scrolling playhead; static layer cached and rebuilt only on mode/progression change; `prefers-reduced-motion` disables the playhead motion.
- **Hash serialization:** `s=<seed>&m=<mode>&t=<tempo>` round-trips through fresh loads; `updateHash()` called after state changes.
- **Offline WAV render:** `cut()` renders one complete 32-bar song (64 events) headless via OfflineAudioContext, deterministically reproducing the realtime pressing. Implemented as a minimal `WavEncoder` class inlined.
- **TIMBRE schema:** 18 params in 5 groups (master/voice/guitarra/bass + room, all live or debounced). Bridge verbatim; `TIMBRE.touch` ramps master/room; voice/guitarra edits are immediate (live reamp on next event). `TIMBRE.demo()` not wired yet (voice is continuous, guitarra hits are event-driven — audition would need a fresh generator and scheduler, deferred).
- **Verified:** HTML loads headless without page errors; TIMBRE schema well-formed (18 params, correct min/max/step); buttons present (play/pause/stop/another/cut); hash serialization round-trips; state loads and persists.
- **Pick-up ideas (not this session's call):** per-voice TIMBRE for ornamentation depth and vibrato rate (currently global); a PROTYAH-style live tempo drag; a "sung" variant where the fadista's note attacks are humanized with micro-jitter and portamento slides between tones; a regional mode toggle (Alfama vs. Covilhã, different chord flavours); the WAV cut currently uses 44.1 kHz SR and a minimal encoder — could adopt the `saveWav` precedent from earlier machines for better codec flexibility. Reader-notes panel (the "On this music" text) documents fado's history and the machine's design concisely.

### GERMEN — registering an unclaimed machine, op. XX (an L-system that grows music from grammar)
**File:** `germen/index.html` · **Status:** registered this session; the
machine itself was landed directly to `main` (bypassing any branch/PR) as
"Add files via upload" by the maintainer while a Copilot cleanup PR was also
in flight, so it arrived on `main` fully built but with **zero registry
entries** — no landing card, no README row, no officina chip, no HANDOFF
thread, and no `.exit`/`.bench` navigation pills, so it was unreachable from
the site and a dead end if you found the URL directly. This thread is that
registration, done alongside FORFEX (below) in the same session — not this
session's composition or synthesis design, credited to whoever built it.

- **The law is a Lindenmayer system (D0L)** — a 1968 formal grammar for plant
  growth: an axiom plus parallel rewrite rules, expanded `n` times with zero
  randomness (`expand()`, pure/deterministic — same species+depth always
  yields the identical string, checkable by hand). Four grammars: **FRONDA**
  (a fern, 2(3ⁿ−2ⁿ) notes), **SALIX** (a willow, 4ⁿ notes), **ALGA**
  (Lindenmayer's own 1968 original species — the Fibonacci word as longs/
  shorts), **PAVIMENTUM** (the Gosper flowsnake, a plane-tiling curve). A
  second turtle walks the expanded string **twice at once** — as drawing
  (x/y/angle) and as score (scale degree/depth/time) — so `F` both steps
  forward *and* strikes a note, `+`/`-` turn the turtle *and* raise/lower
  the degree, and `[`/`]` push/pop *both* states, so a side-branch is
  simultaneously a graphic twig and a little melody that leaves the main
  stem untouched, pitched higher and quicker the deeper it nests.
- **Tuned in 12-tone equal temperament** (`midiToFreq` is `440·2^((m-69)/12)`)
  over four modes (Dorian/Phrygian/Pentatonic/Hirajōshi as semitone-offset
  tables) — a genuine departure from this collection's usual "zero ET, exact
  JI" convention; noted here factually rather than corrected, since retuning
  the law wasn't this session's call to make on someone else's machine.
- **Synthesis, no samples:** Karplus–Strong plucked strings (a seeded noise
  burst one period long, fed through a damped feedback delay; cached per
  `(pitch,depth,decay,brightness,seed)` key so repeat notes are just buffer
  replays), a branch voice reusing the same pluck tinted brighter/softer by
  nesting depth, a sine-root/triangle-fifth drone under a slow tremolo, a low
  sine "stem" breath once per cycle, a seeded convolution room. TIMBRE: 6
  groups (master/pluck/branch/drone/stem/room), bridge verbatim, `touch()`
  ramps live params and clears the Karplus–Strong cache on brightness/ring
  edits, `demo()` auditions each group.
- **Registration work done this session:** added the landing card (`--bg:
  #121a10`, a branching-stem SVG emblem in the machine's own leaf/gold
  palette), the README row, the officina chip, this file-table row. **Added
  the missing `.exit`/`.bench` pills** (the sticky "back to opvscvla" pill
  and the officina deep-link pill, both absent from the uploaded file) using
  germen's own `--ink`/`--field`/`--line` palette values, matching the
  convention every other machine now carries post-officina-pill-sweep.
  Otherwise the file is untouched — its engine, synthesis, canvas, hash and
  WAV-cut logic are exactly as uploaded.
- **Verified headless** alongside FORFEX's own suite: page loads with no
  console/page errors, play/pause/stop/another/cut all present and wired,
  hash round-trips seed/grammar/iterations/mode/tempo, OFFICINA schema
  announces (6 groups) and live `set` round-trips.
- **Pick-up ideas** (not this session's to pursue, flagging for whoever
  continues it): the equal-tempered tuning could get a just-intonation mode
  to match the collection's norm elsewhere; the reader-notes panel and TIMBRE
  docs are already thorough and didn't need touching.

### FORFEX — new machine, op. XXI (early tape splicing)
**Branch:** `claude/tape-splicing-machine-os3bbj` · **File:** `forfex/index.html` ·
**Status:** done, verified headless (Chromium, 24 checks, zero pageerrors). New
op. Registered in `index.html` (card + counts), `README.md` (row + count),
`officina` (chip), `CLAUDE.md`/this file (file table + counts); counts bumped
to twenty-one everywhere. **Renumbered XX → XXI at landing:** `germen/
index.html` had already landed on `main` (a direct upload, see the thread
above) self-declaring "op. XX" in its own title/colophon before this branch's
registration, so per the claiming-by-landing rule this took the next numeral
instead. **Also fixed stale counts:** `CLAUDE.md`'s Repo-shape line and this
file's own Architecture line were still "eighteen" (TRITAVA's landing bumped
the registries but missed these two prose lines; a Copilot cleanup PR then
bumped them to "nineteen") — both now read "twenty-one" with GERMEN+FORFEX
both landing this session. Maintainer's brief: a new machine based on early
tape splicing, generated rather than sampled, with a creative solution for
the sound. One-session build (design + implement + verify + register), full
autonomy.

**Also worth flagging, discovered but out of this session's scope:** a
Copilot agent commit (`2ae7687`, "Changes before error encountered", part of
the same cleanup PR that landed the officina-pill sweep below) mistranslated
`pas-sale/index.html`'s French transport UI to English mid-task before
erroring out — ROULEZ/ARRÊTE/REPRENDS/"autre version pressée" became PLAY/
STOP/RESUME/"another version pressed". PAS SALÉ is deliberately French (op.
I, zydeco, the collection's mother-tongue-per-genre rule). Left untouched
here — not this branch's machine — but it's a real regression sitting on
`main` and someone should revert those four strings.

### TRITAVA — new machine, op. XIX (the Bohlen–Pierce scale — a music with no octave)
**Branch:** `claude/session-vfb3ko` · **File:** `tritava/index.html` · **Status:**
done, verified headless (Chromium, 46 checks, zero pageerrors). New op.
Registered in `index.html` (card + counts), `README.md` (row + count),
`officina` (chip), and the file table above; counts bumped eighteen →
nineteen everywhere. Maintainer's brief: "a new machine, something unique and
fun that isn't in equal temperament." One-session build (design + implement +
verify + register), full autonomy.

Answered with the one tuning idea in the collection that abandons the
**octave** itself. The **Bohlen–Pierce scale** repeats not at 2:1 but at the
**tritave** (3:1, a perfect twelfth) and builds thirteen just steps from the
odd harmonics 3·5·7 — so no two notes are ever an octave apart on purpose.

- **The law is the tuning, exact JI, zero ET.** The 13 just BP ratios are
  hardcoded (`BP=[[1,1],[27,25],[25,21],[9,7],[7,5],[75,49],[5,3],[9,5],
  [49,25],[15,7],[7,3],[63,25],[25,9]]`, close at `[3,1]`) — every ratio
  factors into 3·5·7 only (verified: no factor of 2 anywhere, i.e. no octave
  even latent in the scale). Confirmed against the authoritative BP sources:
  Lambda `{0,2,3,4,6,7,9,10,12}` is the primary diatonic (pattern
  `2 1 1 2 1 2 1 2 1` — four 25/21 whole tones + five semitones, never two
  whole tones adjacent); **Gamma** `{0,1,3,4,6,7,8,10,12}` a documented mode;
  **Harmonia** `{0,3,4,6,7,10}` a defined hexatonic of the six simplest
  consonances; **Chromatic** all 13. Chords: **CLARUS 3:5:7** (steps
  {root,+6,+10}, the bright BP triad) and **OBSCURUS 5:7:9** ({root,+4,+7}).
- **No octave introduced anywhere, by construction.** `BASE=220` is the one
  Hz literal. Register folding between voices uses `foldTri` / `ratioToHz`
  which multiply/divide by **3** (the tritave), never 2 — the drone spans one
  tritave `[BASE/3,BASE]`, bells `[BASE,3·BASE]`, the reed a tritave above
  `[3·BASE,9·BASE]`. Verified every voice frequency is `BASE·ratio·3^k`.
- **The timbre is dictated by the tuning.** Pierce & Mathews showed BP chords
  ring consonant only on **odd-harmonic** spectra (clarinet / stopped pipe),
  so every pitched voice is additive **odd harmonics only** (1,3,5,7,9…):
  GROUND (reed drone on tonic·fifth·tritave, a detuned pair per note +
  slow breath LFO), CAMPANA (struck glass bells with a bell decay + shimmer),
  CANTUS (blown reed melody, soft tongue + late vibrato), PULSUS (meter tick).
  `spectrum` is a per-voice `partials`/`rolloff` in TIMBRE. This is the
  machine's whole conceit and it's an acoustic fact, documented in the reader.
- **Engine → render model (DIAMOND family, not a live scheduler).** `genAll`
  walks a seeded 32-bar / four-phrase chord progression over the mode's
  degrees (small-step root motion, tonic 3:5:7 at every phrase head);
  `assemble` turns it into pulsus/campana/cantus events under a METER
  (4/5/7 eighths) with MOTION-driven density; the drone is continuous, not
  events. `renderMaster` bakes per-(voice,ratio) buffers, renders the whole
  loop once (drone summed continuously via `addGround`), and makes it
  **seamless**: the continuous drone's seam is **equal-power crossfaded**
  (smooth, verified wrap Δ below the drone's own waveform slope) while baked
  bell/reed tails that overhang the loop point are **folded** back onto the
  head (preserving the downbeat). The offline cut renders that same loop —
  deterministic WAV. Law/tempo changes regen+restart (DIAMOND/PEAL
  precedent — documented; not the "re-vibe at next bar" groove convention).
- **Canvas — the tritave wheel.** The 13 chromatic steps placed round a ring
  by their **true cents** (unequal JI spacing), the ring closing at the
  tritave "an octave later than an octave scale would"; mode degrees lit with
  ratio labels, the sounding chord drawn as a **triangle** across the three
  steps it touches (gold root), the melody a violet needle sweeping the rim;
  a right panel shows the chord's ratios and the 32-bar progression ribbon.
  Static layer cached offscreen, rebuilt on mode/meter change; sleeps idle;
  `prefers-reduced-motion` drops the pulse/needle motion.
- **TIMBRE:** 31 params / 6 groups (master, room, ground, campana, cantus,
  pulsus). Bridge verbatim; `TIMBRE.touch` ramps master/room live and
  debounce-regens on voice edits; `TIMBRE.demo` auditions each voice (GROUND
  plays the drone). Palette: ink indigo `#0e0d16` · glass cyan `#7fd4d0` ·
  violet `#9a8cff` · gold `#d9b44a` (tonic/tritave). Card `--bg #171528`,
  emblem a 13-dot ring with a 3:5:7 triangle inscribed.
- **Verified headless** (`scratchpad/verify-tritava.mjs`, playwright + the
  full chrome binary `chromium-1194/chrome-linux/chrome`, `--headless=new`;
  scratchpad not committed, GONGAN/TESSERA precedent): BP ratios exact and
  3·5·7-only; Lambda/Gamma/Harmonia/Chromatic degrees + Lambda step pattern;
  CLARUS/OBSCURUS land on the right steps and CLARUS is exactly 1:5/3:7/3;
  tritave-only folding; assemble determinism + phrase-head tonic + meter
  heads; render NaN-free, peak 0.92 normalised, drone seam click-free, full
  loop wrap continuous; offline cut NaN-free and ≤1.0 (limiter holds);
  realtime play/pause/resume/stop; hash round-trip; localStorage overlay +
  `?factory` bypass; OFFICINA bench schema (6 groups/31 params) + set + bulk
  round-trip. Screenshot-checked (wheel + triangle + ribbon render on theme).
- **Pick-up ideas:** a septimal-leaning extra chord (e.g. 7:9:11 once an
  11-limit voice is wanted — BP's higher consonances); a second "Dur/Moll"
  pair of documented BP modes; a stereo-width treatment above the drone; an
  equal-tempered BP **A/B** toggle (13√3 steps) to *hear* how close the just
  scale sits to it — deliberately omitted so the shipped voice is pure JI.

### BOLG — AOIS: optional, capped, seeded reed-age drift (op. VI)
**Branch:** `claude/uilleann-pipe-sound-graphics-3zm1mq` (same branch as the
regulator/graphics session above) · **File:** `bolg/index.html` · **Status:**
done, verified headless (Chromium). No new op., no registry changes.

Maintainer's framing: BOLG should stay just intonation where possible, but
real reeds drift — temperature, damp, wear — so model that as an *optional*,
capped, progressive detune, not a toggle that breaks the tuning by default.

- **Confirmed BOLG was already 100% JI** (grepped for `mtof`/semitone-ET —
  zero hits; chanter/drones/regs all resolve through `pcRatio`/`BASE`
  octaves). Nothing to fix there; the ask was additive.
- **AOIS NA RIBÍ** (age of the reeds), a new page-level slider (0–36 "mí",
  default **0**) beside LUAS, hash key `a=` (round-trips through a fresh
  permalink load same as every other control). At 0 every pipe is *exactly*
  just — factory/default behaviour is bit-identical to before this session.
- **The model:** each of the **seven independent reeds** (chanter, 3 drones,
  3 regulator ranks) gets a fixed direction in `[-1,1]`, drawn once from
  `computeReedBias(P.seed)` (a dedicated `mulberry32` stream, XORed off the
  tune's own seed so the composition and the instrument's condition are
  reproducible together but don't fight for the same randomness). Actual
  detune = `(age/36) × TP.reeding.ceiling × bias` — linear in the slider, so
  turning it up is monotonically "more out of tune," capped by a new TIMBRE
  param (**`reeding.ceiling`, default 9¢** — deliberately small, same order
  as the existing octave-kick constant, so "not by a lot" per the ask; a
  worst-case reed at full age is still under a tenth of a semitone off).
  Nothing chases back to true on its own — only re-reeding (turning AOIS back
  down) does.
- **Wiring:** `driftCents()` is read fresh at every chanter note and every
  regulator chord (`scheduleNote`/`scheduleReg`), so those pick up an AOIS
  change on their next entrance with no extra plumbing. Drones are the one
  long-running voice, so the slider's `input` handler also calls
  `applyAgeLive()`, which rides the three live drone oscillators'
  `.detune` via `setTargetAtTime` (τ .15 s) — no transport restart, matching
  the "change-while-playing re-vibes, doesn't restart" convention (unlike
  LUAS/bpm, which already restarts here — precedent for *not* doing that
  wasn't available, so AOIS deliberately does better). `TIMBRE.touch`'s
  existing debounced drone rebuild already re-seats `reeding.ceiling` edits
  made from OFFICINA with no changes needed there. Offline `seco()` cut reads
  the same module-level `reedBias`/`P.age`, so a WAV pressing carries whatever
  AOIS was dialed in, deterministically.
- **Ledger + reader:** new `RIBÍ` ledger row (`0 mí — fresh-reeded, true just
  intonation`, or the months plus a `±x.x¢` ceiling readout at that age) and a
  new reader-notes paragraph ("Tuning, and the reeds' age") explaining the
  conceit in plain language.
- **Verified headless** (`scratchpad/verify-aois.mjs`, alongside the
  pre-existing `verify-bolg.mjs`/`verify-cut.mjs`/`verify-rm.mjs`, all
  re-run clean): age 0 ⇒ exactly zero drift on all seven reeds regardless of
  seed; age scales linearly and monotonically (18 is exactly half of 36's
  drift, every seed checked); every drifted value stays ≤ the TIMBRE ceiling;
  `computeReedBias` is deterministic per seed and differs across seeds; hash
  round-trips `a=` through a real fresh-permalink load; UI slider/label/ledger
  stay in sync after restore; live drag to AOIS 36 while playing visibly
  moves the three live drone oscillators' `.detune`; offline cut at AOIS 30 is
  NaN-free and unclipped. Zero non-font console/page errors.
- **Pick-ups:** the regulator↔freq-index↔rank mapping (`reedBias.regs[i]`
  against `ev.freqs[i]`) assumes chord arrays are always length-3 pc-triples
  (true for every mode in `CHORDS` today) — would need revisiting if a future
  mode ships a chord of a different size. AOIS is deliberately independent of
  the existing `bag` breath LFO (volatile, oscillating, already-shipped) —
  the two are meant to read as separate causes (live breath vs. secular
  condition) and stack additively on the same `.detune` param; no attempt was
  made to unify them.

### BOLG — softer regulators + the whole set now animates (op. VI)
**Branch:** `claude/uilleann-pipe-sound-graphics-3zm1mq` · **File:**
`bolg/index.html` · **Status:** done, verified headless (Chromium). No new
op., no registry changes. Two asks from the maintainer, both landed:

- **Regulators re-voiced — pressed, not struck.** `scheduleReg` had an 8 ms
  linear strike then an immediate `setTargetAtTime` decay (τ≈0.096) — a plucky
  honk. Now: a soft bloom to full over `atk`, held at full until the key lifts
  (`hold`× the note), then a long ring-down (`rel`). Three new TIMBRE `regs`
  params drive it — **atk .045 s · hold .9× · rel .2 s** (were the hard-coded
  .008/immediate/.096); `level`/`tone`/`q` unchanged. Verified in an offline
  render: single chord is NaN-free, peak .26, and still carries ~7 % energy
  in the 0.55–0.75 s window (the old envelope was silent by then). The full
  64-reg-event cut renders clean at peak .54 — the longer tails don't push the
  mix into clip. Doc strings (top-level + group) updated: "bloom in softly and
  sustain … pressed and held, not struck."
- **FIG I is now the full set, and the other pipes animate like the chanter.**
  Was just the chanter maker's-plate. Now, left→right off a shared stock rail:
  the **chanter** (unchanged — holes still fill with the fingering), three
  **drones** (DORDÁIN — graduated pipes with tuning-slide ferrules + end beads;
  a cane glow that **breathes** with the bag LFO and each drone's own slow
  level-sway, plus a bright "column of air" bead riding the wobble; lit only
  while playing + `bor` on), and three **regulators** (RIALTÓIRÍ — keyed pipes
  whose body + keys **flare cane** on each chord strike and **decay over the
  audio release**, `rel`+0.18; lit only while playing + `rgl` on). Note readout
  moved to the **top-right** header (was mid-plate) — deliberately right, not
  left, so the `position:sticky` exit pill can't cover it. Layout is a fraction
  of `chW` so it holds in both the wide (desktop, FIG I ≈34 % strip) and
  stacked (mobile, full-width) figures — screenshot-checked both.
- **Plumbing:** reg strikes were excluded from the UI queue; added a parallel
  `live.regQ` (drained in `loop()` into `regAnim[3]={t,vel}`), reset in
  start/stop. `drawHash` gets a `Math.round(ctx.currentTime*12)` term **only
  while playing and motion allowed**, so the canvas redraws ~12 fps for the
  breath/flare and still sleeps when idle. `prefers-reduced-motion`: drones
  sit steadily lit (no breath/bead motion), no anim tick — verified the RM
  path renders clean.
- **Verify** (`scratchpad/verify-bolg.mjs` + `verify-cut.mjs` + `verify-rm.mjs`,
  playwright-core + bundled Chromium at `chromium-1194/.../chrome`, launched
  `--headless=new` — the 1.48 default `--headless=old` is gone from this binary;
  headless_shell still crashes per the RILLE note, so use full chrome). All
  pass: schema well-formed, offline reg-voice + full cut NaN-free/no-clip, live
  play shows drones=3/regs=3 and reg flares firing, zero non-font page errors,
  both layouts + RM screenshot-checked. Scratchpad not committed (GONGAN/TESSERA
  precedent).
- **Deferred (maintainer, same message):** a *guitar* strum in **HOLLER** (make
  it strum instead of all strings at once) — explicitly "save that for later,"
  untouched here. BOLG has no guitar; the only chordal voice is the regulators.
- **Pick-ups:** the drone "column of air" bead drifts very slowly (0.07–0.11 Hz)
  — fine as ambient life, could tie to the bag rate if more motion is wanted;
  the regulator→pipe mapping lights all three pipes together on a strike (a
  wrist chord), not per-note — per-pipe by pitch is possible if the maintainer
  wants each reg to speak its own note.

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

### TESSERA — new machine, op. XVII (a self-predicting language model)
**Branch:** `claude/llm-machine-architecture-5ji49g` · **File:**
`tessera/index.html` · **Status:** done, verified headless (Chromium). New
op. Registered in `index.html` (card + counts), `README.md` (row + count),
`officina` (chip), `CLAUDE.md`/this file; counts bumped sixteen → seventeen
everywhere. **Renumbered XVI → XVII at landing:** SUBLOW landed as op. XVI
on `origin/main` while this was in flight, so per the claiming rule TESSERA
took the next numeral. `tessera/SPECULUM.md` (the design brief) deleted per
its own instruction — this thread is the fold-in.

A design-then-implement arc (GENESIS/HARMONIA precedent): answers the
maintainer's question — *what machine would an LLM like, translated into
something humans can experience?* The argued answer: the one aesthetic
channel a next-token predictor and a human ear genuinely share is
**expectation** — Meyer 1956 / Huron ITPRA / IDyOM's music-as-prediction is
the same loop as autoregressive sampling; tension IS surprisal. So the
machine *is* a language model, small enough to be exact and to hear.

- **The law is a real, exact language model** (`ENGINE-BEGIN…END`, pure,
  DOM-free, `window.__TESSERA`): a variable-order Markov model with
  **interpolated PPM-C blending** (`p_k = c/(n+t) + (t/(n+t))·p_{k-1}`,
  uniform base, no exclusion). Starts **empty**, learns **only from its own
  output**. Two coupled streams (pitch + duration), each its own model
  (duration order capped at `min(ORDO,2)`). Every token has p>0 always, so
  surprisal is finite. Sampling is tempered (`q ∝ p^(1/τ)`); **surprisal
  (−log₂ p) and entropy (−Σ p log₂ p) are taken from the UNTEMPERED p** — the
  model's true feeling regardless of how adventurous the sampling was told to
  be.
- **Exact forgetting** (`MEMORIA`): the sliding window keeps the last W
  tokens; `learn()` adds the K+1 observations a new token closes and, on
  overflow, removes exactly the K+1 the evicted front token anchored
  (context-start = the evicted position). **Verified bit-identical to a
  from-scratch rebuild on the last W tokens** at every W∈{32,128,512},
  K∈{1,2,4}. When a habit's support expires it is genuinely gone and its next
  occurrence re-surprises the model.
- **Every pressing is a completion:** the seed derives a forced 5-token
  prompt (uniform gamut pitches, durations from {2,4}), so the first event's
  surprisal is exactly log₂|A| — maximal, the first mark on a blank mind.
- **Zero ET:** pitches are JI degrees of a gamut (V/VII/XII, 5/7/12 tones,
  5-limit) over a single Hz literal, **196** (G); `f = 196·num/den·2^k`, k
  chosen by a deterministic nearest-in-log register fold (band 98–784). No
  `mtof`. ∅ (rest) is a real token that enters the context and is learned.
- **Controls ARE the phenomenology** (all law, none in TIMBRE): CALOR
  (temperature τ 0.4/0.8/1.3/2.2) · MEMORIA (32/128/512) · ORDO (1/2/4) ·
  GAMVT (the alphabet + entropy ceiling log₂|A|) · TEMPO. **Any law change
  regenerates the score** (path-dependent); if playing, the transport
  restarts from bar 0. TEMPO rides live (doesn't change tokens).
- **Voices:** VOX (2 detuned saws → per-note lowpass; surprise sets level,
  brightness, attack 45→4 ms, and vibrato — a confident note is soft/round,
  a surprised note cuts). NIMBVS — the halo: the top-4 untempered
  alternatives as sine tones, each gain ∝ its p, the cloud scaled by entropy;
  when the model is certain it falls silent. FVNDVS — a just drone (98 Hz +
  3/2). PVLSVS — a tactus tick whose level follows an EMA of entropy. Master:
  warmth shaper → glue comp → brick-wall limiter (−1.5 dB, ratio 20, the
  GONGAN/DIAMOND ceiling) → out trim; seeded IR (so the WAV is deterministic).
- **Scheduler machine** (RILLE-family `schedTick`, 40 ms, ~0.3 s lookahead,
  time-accumulator so live TEMPO changes apply forward). **Non-looping:** on
  reaching the cached end the generator *extends* (16-bar chunks, model state
  continuing) — the WAV cut is the first 64 bars (512 eighths) of an endless
  mind, deterministic. **NB the piece is ~3 min at default tempo, so the
  offline cut renders ~40 s** headless (same rate as RILLE's 120 s plate at
  ~60 s). Kept it fast by putting the reed formant on the vox BUS not
  per-note, skipping the vibrato LFO on calm notes, and capping the halo ring
  — do not re-add per-note formants.
- **Canvas — everything shown is a number the model actually computed:**
  left, the piece as a **mosaic**, one course per 2 bars, hue = gamut degree,
  lightness = surprise, ∅ = grout gap; the **MEMORIA window is visible** (in-
  window tiles lit, older tiles matte, a gold dashed line = the forgetting
  edge crawling behind the playhead); the page turns every 64 bars. Right, the
  live **posterior** as a labelled ratio ladder (chosen bar in teal) plus the
  entropy/surprise **sparklines** — the pressing's EEG. `prefers-reduced-
  motion` slows the redraw. Emblem: a mosaic of tesserae, one lit gold.
- **TIMBRE:** 27 params in 7 groups (master/room/vox/nimbus/fundus/pulsus +
  **sensus** = the surprise→sound mapping ranges — voicing, not law). Bridge
  verbatim; `TIMBRE.touch` ramps master/room/bus/formant live; `TIMBRE.demo`
  starts the transport (continuous-machine convention).
- **Verified headless** (`scratchpad/verify-tessera.mjs`, playwright-core +
  bundled Chromium, 46 checks): PPM distributions match hand-computed values
  and sum to 1; incremental counts + predictions equal from-scratch on last-W
  across all W/K; surprisal/entropy exact for every event; determinism (same
  hash ⇒ identical tokens; extend ⊃ direct-512); mean surprisal rises
  monotonically across the four CALOR stops; BREVIS forgets a learned bigram
  while LONGA keeps it; every freq = 196·num/den·2^k in-band with k=0 first;
  first-event surprisal = log₂|A| and ∅ never in the prompt; realtime runs,
  offline WAV cuts clean, hash round-trips, OFFICINA schema/set/bulk round-
  trip; zero pageerrors. Screenshot-checked (entropy sparkline visibly
  settles as the mind learns).
- **Pick-up ideas** (from the brief): CALOR annealing (τ on a slow seeded
  arc); a second voice whose context is the first's stream (a canon where the
  comes is an expectation of the dux); human-editable prompt tiles; a
  septimal gamut (7/4, 7/6) once the 5-limit voice is proven.

### SUBLOW — new machine, op. XVI (dubstep / sound system music)
**Branch:** `claude/dubstep-machine-scaffolding-jcz8a9` · **File:**
`sublow/index.html` (`sublow/NOTES.md`, the build brief, deleted per its own
instruction once implemented — RILLE/DIAMOND precedent — this thread is the
fold-in) · **Status:** done, verified headless (Chromium). New op. **Landed as
op. XVI, not XV** — DIAMOND landed first while this branch was still
unlanded, so it renumbered at rebase per the claiming rule below. Registered
in `index.html` (card), `README.md` (row), `officina` (chip), CLAUDE.md and
the file-structure list above; counts bumped fifteen → sixteen everywhere.

Two-session build: the scaffolding session did sound design, composition spec
and UI (per the now-deleted `sublow/NOTES.md`); this session implemented the
engine, audio graph, canvas dynamic pass and verify against that brief, then
rebased past DIAMOND's landing and registered it.

- **The idea.** Dubstep as born in Croydon (~2000) and deepened at DMZ/FWD>>
  (~2005). Three load-bearing laws: (1) **the sub-bass is the lead** — the tune
  lives in the low end, everything above is atmosphere/rhythm; (2) **halfstep**
  — 140 BPM but the snare cracks *only on beat 3* (`SNARE_STEPS=[8,24]`), so it
  moves at 70 while hats tick 140, the space is the point; (3) **the bass
  talks** — a resonant lowpass swept by a **tempo-locked LFO**, rate = rhythmic
  division × bpm/60 (verified exact: div 1/2/3/4 at 140 bpm → 2.333/4.667/7/
  9.333 Hz). The wobble is *rhythm*, not vibrato. Plus sound-system culture:
  the dubplate, bassbins as the instrument, the dub siren, and **PULL UP** —
  the rewind, spins back then lands the next scheduled bar on the drop
  (bar 17) without restarting the transport.
- **Name** SUBLOW — London pirate-radio's word for the bottom octaves; the
  machine speaks sound-system English (run it / pull up / cut a dub).
- **The engine (`genAll`, seeded, deterministic):** `makeBass` walks a 2-bar
  riddim from a weighted degree pool (root-biased), note 1 always root on the
  downbeat; `makeDrums` builds the halfstep kit (kick always includes step 0,
  extra kicks never land on the snare's [8,24]); `makePad` writes 8 breaths
  alternating i/♭VI, **third-less by construction** (root·fifth·octave·
  optional-ninth — verified: no chord tone sits a 3rd/4th above its own chord
  root, checked relative to the shifting root, not the tonic); `makeLead`
  (EAST only) writes a 4-bar call/response in the hijaz-flavoured mode, landing
  each response on root or fifth; `makeArrange` fixes the 64-bar form (INTRO/
  BUILD/DROP A ×2/BREAK/DROP B ×2/OUTRO). **DROP B reuses `bassB`** — same
  notes, talk bumped +1 (capped 3), ghost snares 1.5× hotter — "same tune,
  more chat," not a new composition.
  Deliberate deviation from the brief: **tempo is NOT folded into the RNG
  seed** (the brief's contracted signature keeps `bpm` as a parameter, but
  composition ignoring it is the better call) — dragging the tempo slider
  re-times the same riddim rather than rerolling it; the wobble LFO and
  scheduler both read `st.bpm` live, so a tempo change re-vibes the next bar
  with no regeneration and no restart. Mood/talk/seed edits DO regenerate and
  hand the new score to the running scheduler (`RT.g=st.g`), same convention.
- **The audio graph:** single-deck (no crossfader — this isn't a DJ mixer like
  RILLE), master pre→shaper→4:1 comp→out-trim→destination, `G.floor` hiss tap
  post-comp. Duck bus carries **only sub+pad** (kick env dips them; wob/kick/
  snare/hats/perc/lead/fx are unducked, per the brief). **Wobble has no
  separate mixer channel** — `vWob` sums into `G.part.sub` (through its own
  highpass at the 110 Hz crossover) because the user perceives "the bass"
  (sub+talk) as one fader; the mute strip only has 8 buttons (`PARTS`), not 9.
  Sub chain lowpassed at the crossover as a safety net (it's already ~sine).
  All 12 voices (`vSub vWob vKick vSnare vHat vShaker vPerc vPad vLead vSiren
  vRiser vSpinback`) read `TP` at schedule time. `saveWav`/`encodeWav` copied
  verbatim from RILLE (HANDOFF flags this as a repeat gotcha — two earlier
  machines shipped without it).
- **Canvas — the stack:** a wall of speaker cabinets (scoop subs / kick bins /
  horn tops) + LED strip + a riddim lane drawing the 2-bar bass phrase *as the
  wave it speaks* (period = wobble division, dive = tail dropping toward the
  x-axis). Dynamic pass while playing: sub-cone excursion keyed to the
  sounding note's own wobble phase, a horn flash ~200 ms after each beat-3
  snare, an LED VU that goes red-hot only in the drop sections, and a lane
  playhead. `prefers-reduced-motion` → playhead only, no cone/LED motion (the
  static wall + lane redraw is cached; the dynamic pass is a plain rAF loop
  gated on `st.playing`, no separate offscreen layer needed since it's cheap).
- **Verified headless** (Chromium, playwright-core, `--autoplay-policy=
  no-user-gesture-required`): engine invariants across 5 riddims × 4 talks ×
  30 seeds (deterministic, note-1 fixed, snare fixed, no kick-on-snare,
  fundamentals fold ≥ `SUB_FLOOR`, pads third-less, DROP B talk-bump, lead
  EAST-only, arrange length 64); wobble-rate math exact; realtime transport
  runs and PULL UP survives; every one of the 8 mixer parts audible solo
  (including EAST's lead and the FX bus's siren/riser — the first solo pass
  missed those because it only probed bars with no FX events, a test-coverage
  gap, not an engine bug); 64-bar offline cut NaN-free, peak ≈0.70 (no clip,
  real headroom under the 1.0 ceiling), head energy present after the
  loop-tail fold; OFFICINA schema (55 params / 11 groups) + live `set`/`bulk`
  + localStorage overlay + `?factory` bypass all round-trip; hash v1 restores
  mood/talk/bpm/mask/seed. **64-bar cut takes ~50 s wall-clock** in this
  sandboxed headless environment (≈110 s of audio) — consistent with RILLE's
  own noted precedent ("120 s plate cuts in ~60 s — fine"), not a regression.
  Zero non-environmental console/page errors (only the sandboxed Google-Fonts
  fetch, present on every machine).
- **Pick-up ideas:** a stereo-width treatment above the crossover (sub stays
  dry/mono/centre by law, but wob/pad/lead currently render mono too — could
  widen them without touching the low end); a second EAST-style lead mood; the
  `'stab'`/`'thin'` pad kinds (DUNGEON/STEPPA/WOBBLE) are simpler than the
  `'drone'` swell (short offbeat shells / fifth-only respectively) — could use
  their own OFFICINA-exposed envelope shaping if the maintainer wants more
  contrast between sessions on the bench.

### App icon + universal pause button + cohesion (this branch)
**Branch:** `claude/opuscula-icon-design-1uqyt7` · **Files:** `icon.svg`,
`icon-512/192.png`, `apple-touch-icon.png`, `favicon-32.png`, `site.webmanifest`
(new, repo root); every page `<head>` (icon links); all 14 machines that lacked
one (pause button); `index.html`/`README.md` (shared-keys note + the file
table/conventions here). **Status:** done, verified headless (Chromium, all 15
machines PASS, zero pageerrors). Deliberately a **cross-machine sweep** on its
own branch (per the sweep rule) — no per-machine feature work mixed in.

- **App icon** (`icon.svg`, master; PNGs rendered from it via
  `scratchpad/render-icon.mjs`, playwright-core + bundled Chromium, scratchpad
  not committed). The catalogue's one constant graphic device is the **3px
  DOUBLE rule** (`index.html .rule`, every colophon border); the icon bends it
  into a ring — reads at once as the **O** of OPVSCVLA, a **pressed record**,
  and a **bell rim**, on the dark parchment ground (`--ground #14120f`, ivory
  `--txt`), with the **red "stamp" arc** that already recurs in the SCALA / PEAL
  / RILLE emblems, and a centre spindle. No text; legible 512→16px (at 16px the
  double ring merges to one — accepted; the detail is for home-screen/PWA).
  Wired into all 17 pages with **relative** hrefs (`./` root, `../` machines —
  this is a project-pages site, NOT domain root; root-relative would break).
  `site.webmanifest` is one catalogue-level manifest (icon `src` relative to its
  own root URL, so it's correct from every page that links `../site.webmanifest`).
- **Pause button on every machine.** RILLE already had one; extended its exact
  pattern to the other 14. Each: a secondary button beside play, **labelled in
  the machine's own tongue** (MORA/PERGE Latin · SOS/AR AGHAIDH Irish ·
  PAUSE/REPRENDS French · PAUSE/WEITER German · Pause/Resume English), disabled
  until playing, highlighted (`.on`) while held; **`p`** key added to the shared
  claves (no collisions — `p` was free everywhere). The mechanism is
  `ctx.suspend()`/`resume()`: every transport and canvas here is keyed off
  `ctx.currentTime`, which freezes while suspended, so play position and visuals
  hold and resume exactly. **Two gotchas handled:** (1) the iOS unlock `kick()`
  auto-resumes any non-running context on gesture/visibility — guarded with the
  machine's paused-intent flag (`st.paused` / `live.paused` / `paused`) so it
  can't undo a deliberate pause (COCHLEA/BOLG also bail their `kick`/`updateHint`
  when paused, so the SUSPENSUM hint doesn't show during a pause). (2) **NENIA**
  is the exception — its playhead runs on `performance.now()`, not ctx time, and
  it auto-stops on a wall-clock `setTimeout`; pause freezes the playhead at
  `pausedAt`, resume slides `playStart` forward by the paused span and reschedules
  the stop timer for the time that remained.
- **Cohesion tweaks (small, as invited):** the shared-keys note now lists
  **p = pause/resume** everywhere it was enumerated — landing `index.html .notes`,
  `README.md` shared grammar, each machine's in-page keys line + colophon, and
  the Conventions bullet here. A `button:disabled`/`.pick:disabled`/etc. opacity
  rule was added where a machine had none, so the disabled pause reads inactive.
- **Verify:** `scratchpad/verify-pause.mjs` drives every machine play → pause →
  resume → stop headless, asserting the button is disabled before play, enabled
  after, shows the resume-word when paused and the pause-word when resumed,
  disabled again after stop, and **zero pageerrors** (font-CDN-under-proxy noise
  filtered, per precedent). All 15 PASS.
- **Pick-ups:** a maskable-icon variant (safe-zone padding) for Android adaptive
  icons if wanted; per-machine `apple-mobile-web-app-title` so an installed
  machine names itself; the icon's red arc is nearly invisible at 16px — a
  bolder favicon-only rendering is possible if the tab-strip mark matters.

### State of the branch farm — parallel-work snapshot (2026-07-17)
**Branch:** `claude/handoff-concurrent-changes-9uuwm8` (also added the
"Working in parallel" section above). Inventory of every `claude/*` branch on
origin at writing time; a session that lands, rescues, or deletes one of
these should update this entry.

- **op. XV double-claim resolved: DIAMOND landed first, keeps op. XV.**
  `claude/new-machine-concept-uap0bi` shipped `diamond/index.html` (Partch
  tonality diamond) and merged to `main` — see the DIAMOND thread below.
  `claude/dubstep-machine-scaffolding-jcz8a9` (SUBLOW — dubstep / sound
  system; `sublow/index.html` scaffolded + `sublow/NOTES.md`) was still
  unlanded as of DIAMOND's merge (confirmed against the live branch list) —
  per the claiming rule it **renumbers to op. XVI** at its next rebase.
  Directories don't collide, so no file conflict either way.
- **Stale but carrying unlanded work:** `claude/orientation-3k25et` has a
  KHÖÖMEI change never landed ("breathe — dynamic drone + real breath
  pauses", +50/−15 in `khoomei/index.html`), now ~57 commits behind — rescue
  by rebasing (expect conflicts with the TIMBRE hoist) or re-implement, or
  drop. `claude/project-handoff-guide-7l2awu` adds per-machine
  `docs/works/*.md` handoffs — an approach superseded by this file;
  recommend deleting.
- **Dead — no merge base (pre-rewrite history), cannot be merged:**
  `claude/404-page-load-error-3da6u0`, `claude/cleanup-and-docs-sizjmt`.
  Their surviving ideas (exit-to-landing link, PEAL acoustic switcher)
  already landed on main independently; recommend deleting both.
- **Merged into main, safe to delete:** `banjo-loop-sound-design-qjlfm4`,
  `minimal-deep-tech-guide-ta175d`, `new-machine-design-y66pvl`,
  `opuscula-general-leuzu2`, `project-working-conventions-hlurpe`,
  `project-working-conventions-xjaafw`, `rille-chord-dissonance-io1zr6`,
  `rille-hiss-pause-4dojix`, `rille-tonal-composition-n8zfie`,
  `voice-synthesis-settings-ifeuah` (all `claude/…`). Branch deletion is the
  maintainer's call — sessions shouldn't delete branches they don't own.
### DIAMOND — new machine, op. XV (Harry Partch's tonality diamond)
**Branch:** `claude/new-machine-concept-uap0bi` · **File:** `diamond/index.html` ·
**Status:** done, verified headless (Chromium). New op. Registered in
`index.html` (card + counts), `README.md` (row), `officina` (chip),
`CLAUDE.md`/this file; counts bumped fourteen → fifteen everywhere.
`diamond/GENESIS.md` (the design brief) deleted per its own instruction —
this thread is the fold-in.

A design-then-implement session: op. XV conceptualized with full creative
freedom (just intonation, otherwise open), written up as a self-contained
brief (`GENESIS.md`, RILLE/HARMONIA precedent), then implemented in the
same session against that brief. **Harry Partch's tonality diamond** —
chosen over raga, Kepler's *Harmonices Mundi*, barbershop, alphorn
(rejections argued in the deleted brief) because it adds the JI *system*
(American experimental line, absent from the catalogue) and **utonality**,
the subharmonic mirror no existing machine touches.

- **Zero ET anywhere** — the first machine with no `mtof` at all. Ratios
  stay integer `[num,den]` pairs end to end (`fold`/`diamondCell`); the only
  Hz literal is `392` (Partch's G, `f = 392 × num/den × 2^k`). Diamond
  matrix, unique-tone counts and root tables verified exactly against the
  brief's hand-derived tables (7/13/19/29 tones at limits 5/7/9/11).
- **The law is the circuit** (`genAll`): a seeded weighted Hamiltonian walk
  of the complete bipartite otonality/utonality graph — every one of the
  2n tonalities visited **exactly once**, strictly alternating (forced by
  the graph, not legislated), starting and ending on **O1** (the plain
  harmonic series). Each step is a weighted pick favouring small-ratio
  (consonant) root moves (`ratioWeight` — weight ∝ 1/(num·den) of the root
  interval). The closing edge — last utonality → cell(o,1) → O1 — always
  exists by construction.
  **Pivot audibility is tautological by construction**, not a runtime
  check bolted on after: `assemble()`'s Cloud-Chamber Bowl ring at
  station *i*'s final bar is `pivots[(i+1)%2n]`, and station *i+1*'s
  Harmonic Canon forces that same tone as its first note — both read the
  same `pivots[]` array, so they can't drift apart.
- **Six of Partch's instruments, synthesized** (`SYN_FN`): Marimba Eroica
  (root on every group-head, arch-cut bar model), Kithara (Karplus–Strong,
  warmed, gliss-strums the tonality at arrival), Harmonic Canon
  (Karplus–Strong double course, seeded stepwise ostinato that mutates one
  step per bar-repeat, density rising toward the station's end), Diamond
  Marimba (a 6(n)-stroke sweep at arrival + sparse off-beat strikes), Boo
  (bandpassed-noise patter alternating the tonality's two highest tones),
  Cloud-Chamber Bowls (detuned beating pair + inharmonic partials, long
  ring). Each voice folds into its own fixed Hz register band
  (`REGBAND`: eroica 49–98 · kithara 98–196 · canon 196–392 · marimba/
  bowls 392–784 · boo 784–1568). Additive meters (PULSE 5/7/9 = 2+3 /
  2+2+3 / 2+2+2+3), dry room send (`wet` default .08 — corporeal, not
  cathedral).
- **Controls:** LIMIT 5/7/9/11 · FLUX linger/walk/storm · LEAN
  utonal/even/otonal (station-bar table `STATION_BARS`; default UTONAL —
  RILLE's rationed-resolution taste made structural: the walk dwells in
  the dark utonalities and passes briskly through the bright) · PULSE
  5/7/9 · TEMPO 200–340 eighths/min. No mixer/mute row — the brief's
  explicit simplification, "the diamond is the interface." GONGAN-family
  skeleton: `genAll`→`assemble`→`renderMaster` (bake-per-(voice,ratio)
  kit, `mixHit`), realtime loop + identical offline WAV cut, loop-fold
  (`renderMaster(true)`) wraps the tail — including the final exit-pivot's
  bowl ring — back over the head, so **the WAV literally starts on the
  homecoming bloom**, no special-casing needed.
- **Canvas:** left, the diamond lattice rotated so the unity diagonal runs
  horizontal (`x=(i+j-(n-1))·DX, y=(j-i)·DY` — the classic Partch layout),
  active tonality's row/column lit and swept at arrival, pivot cell
  pulsing on the final bar, visited diagonals left faintly warm (cleared
  on a new lap). Right, the itinerary: one row per station (O/U glyph,
  root ratio, bridging pivot between rows), home ringed, current station
  boxed. Static layer cached offscreen, rebuilt on station change;
  `prefers-reduced-motion` disables the sweep/pulse animation.
- **TIMBRE:** 42 params in 8 groups (master/room/eroica/kithara/canon/
  marimba/boo/bowls — no separate mixer group, each voice's own `level`
  serves that role). Master out-trim/room-wet/limiter-ceiling ride live;
  instrument edits debounce a rebake (► HEAR convention, no mid-circuit
  restart). Bridge verbatim incl. `TIMBRE.demo` (per-voice auditions).
- **Master chain — de-fuzzed (maintainer: "too distorted").** The first
  cut leaned on a hard `tanh` shaper (`drive` .28) for loudness, which
  fuzzed the whole mix and squashed the dynamics flat. Reworked to
  **shaper (drive .06, warmth only) → glue comp (2.4:1) → brick-wall
  limiter (`limThresh` −1.5 dB, knee 0, ratio 20 — the GONGAN limiter
  precedent) → out trim**; reverb sums pre-limiter so nothing bypasses the
  ceiling. Measured on a fixed pressing: shaper deviation-from-linear
  **70.8 % → 15.1 %**, crest factor **1.99 → 3.66** (the struck bronze
  rings proud again instead of buzzing), output peak 0.76 (limiter holds,
  no clip). The metallic character is pure synthesis (inharmonic bars/
  bowls) and was never the shaper — only the fuzz was removed. `drive` is
  still exposed in officina for anyone who wants the grit back.
- **Verified headless** (playwright + bundled Chromium, run from session
  scratchpad, not committed — matches the GONGAN/TAMBOUR precedent of
  scratchpad tooling): diamond tables/unique-tone-counts/roots exact
  against hand-derived brief tables; journey law swept 4 limits × 3 flux ×
  3 lean × 12–25 seeds (900+ pressings) — alternation, every-tonality-
  once, O1-only-at-station-0, pivot membership, correct closure, station
  lengths all hold; frequencies land in-band and match `392×ratio` folded
  exactly; `renderMaster` deterministic, NaN-free, peak-normalised, loop-
  fold head energy present; every voice non-silent solo; realtime context
  runs; hash round-trips; offline WAV cut clean; OFFICINA schema/set/bulk
  round-trip; zero pageerrors (only the pre-existing Google-Fonts-under-
  proxy console noise every machine hits, per the TAMBOUR/GONGAN
  precedent). Screenshot-checked live render and `another()`/`TIMBRE.demo`
  exercised across all 8 groups with zero errors.
- **Pick-up ideas** (carried from the brief): the full 43-tone Monophony
  scale as a secondary mode; a *Barstow*-style speech-rhythm cantus on the
  Canon; a Quadrangularis Reversum canvas easter egg; per-side pulse
  flavors if the single meter reads flat. Kepler's *Harmonices Mundi* was
  the strongest rejected alternative — a candidate for a future op.

### RILLE — tonal recomposition IMPLEMENTED (from `rille/HARMONIA.md`, now deleted)
**Branch:** `claude/harmonia-handoff-tlncw8` · **File:** `rille/index.html` ·
**Status:** done, verified (Node structural sweep + headless Chromium smoke);
pushed. The self-contained brief `rille/HARMONIA.md` was the spec; it's deleted
now that the work is in — the reasoning survives here and in the commit message.

**Follow-up (maintainer ear-check: "still sounds doofy — the arpeggio, all
moods"):** the running broken-chord arpeggio was the culprit — a metronomic
index-walk cycling root-♭3-5-9 (up/dn/ud/rnd per mood) read as a cheesy
trance/eurodance arp, plus a low/muddy register and the TRÄNEN octave "reach"
plink. **Replaced the arpeggio with sparse dub-techno chord STABS:** the
hover chord is now struck as an open shell of the bar's shape (the shape minus
its top 9/4, so it stays dark/grounded; `quint` bars stab a bare fifth) on the
OFFBEAT 8ths only (EISEN also takes the on-beats for its industrial cluster),
one-ish to a bar with space around it, lifted into the stab register
(`foldSwellHz(barRootHz)×2`) via `vChord` — no melodic contour, no running
line, no octave pop. `g.arpSeq` is now `{s,vel}` stab positions (was
`{s,idx,oct,vel}`); the canvas step-mask still reads it unchanged. Deleted:
the `vArpN` pluck voice, the `arp` TIMBRE group (43→**40 params**), and the
dead `rate`/`dir`/`reach` mood fields (`arp:{}` now just `{dens}`). `vChord`
gained an optional `velMul`. Reader-notes + TIMBRE doc updated (stabs, not
arps). The tuning/harmony/cantus/cadence laws are untouched — only the hover
*voicing* changed. **Verified:** Node structural sweep 25/25 (item 8 rewritten:
stab events carry no melodic-walk fields, sit only on offbeats, counts stay
sparse — never a running arp) + a headless-free **runtime mock**
(`scratchpad/verify-rille-runtime.mjs`, minimal Web-Audio stub) drives the real
`buildGraph`/`makeDeck`/`scheduleBar` across all 7 moods × 3 Lösungen over 64
bars: no exceptions, zero NaN/Inf to any oscillator or param, 25k+ oscillators
live. **ENV NOTE for the next session:** Playwright's default `headless_shell`
Chromium is currently crashing the node process on `.launch()` in this sandbox
(silent, no output) — the full `chrome` binary at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` launches fine, so pass
`executablePath` to it (the verify scripts already do); and the audio-graph
runtime is better checked with the Web-Audio-mock runner than a live render
anyway. Still worth a maintainer ear-check that the stabs read as dub-techno,
not the old arp.

Reworked RILLE's whole tonal path per the maintainer's mandate: **no major
moods or vibes** (major only ever to resolve minor progress), no goofy plinks,
simplified input, and **just intonation end to end**. What shipped:

- **Majors abolished from hover.** Kind `'maj'`, `MAJ_SHAPE`, the ascending
  glint, kind `'pre'`, `PROGS`, `harmRecipe(M,P)` and `voiceAt` are gone.
  Major-quality hover degrees (♭VI/♭VII/♭II) are now voiced **thirdless**
  (`quint` = 1/1·3/2·9/4) — 1–2 bars, passing colour, dark. The **only 5/4 in
  the machine** is the raised leading tone (`dom7` shape) on one cadence bar,
  which is 15/8 over the tonic — the just leading tone. Both are mechanized in
  the verify's "5/4 audit".
- **Cadence = lament tetrachord.** Last 8 bars of a `cad` span: bass walks
  1→♭7→♭6→5→1 (`desc`·16/9 ×2 → `desc`·8/5 ×2 → `dom7sus` → `dom7` → `bloom`
  ×2), the 4-3 suspension resolving across the two dom bars, the leading tone
  raised for exactly one bar. The 2 hover bars before each window are forced to
  degree 0 (the "8" the tetrachord descends from); the 8 bars before lean off
  the tonic (weights ×1.5). `half` deleted — non-landing moods get `loesung:0`
  (NIE, cad 0, no dominant ever).
- **Two-level JI lattice, no comma drift.** Every tonal freq is
  `f = tonicHz × DEG[deg] × SHAPE[k] × 2^n`, `tonicHz = mtof(g.root)` the ONLY
  `mtof` in the tonal path (verified: exactly one call site). `DEG` (degree
  roots over tonic), `SHAPES` (voice shapes over the bar root), `MODE_JI`
  (scale ratios for cantus passing tones) replace `JI[]`/`jf()`/`HOVER_SHAPE`.
  Roots re-anchor to the tonic each bar (fixed-lattice, not chained — COCHLEA
  owns comma drift). `vBass` now takes **Hz** (41 Hz floor preserved in Hz);
  bass pattern offsets became ratios (0→1/1, −12→1/2, −5→3/4, −2→8/9). Swell
  dyads: dom-sus [4/3,7/4], dom-raised [5/4,7/4], tonic [6/5,3/2], desc
  [3/2,9/4], pad hover [3/2]. AUTO-SET seam stays ET (Camelot labels stay true).
- **Dorian abolished.** DÄMMERUNG and SOG → äolisch (`mode` and `modeName`);
  SOG's warmth is the thirdless sus9 voicing, not the natural 6th. Roots/BPM
  untouched → Camelot table intact (FINSTERNIS 4A, SCHATTEN 1A, TRÄNEN 8A,
  EISEN 9A, DÄMMERUNG 7A, LEERE 5A, SOG 6A, asserted in verify).
- **Arp** resolves ratio shapes (`barRootHz × SHAPE[idx%len] × 2^oct`); the
  octave "reach" is TRÄNEN-only (`arp.reach:.15`, was a semitone `+12` on any
  mood at .30). `quint` bars roll root-fifth-ninth by construction.
- **Cantus (TRÄNEN).** Pentatonic random walk replaced by a seeded descending
  "sigh" cell (`[♭6,5,4]` weighted ×2) + fading echo over 8 bars; first/last
  notes chord-tone-locked to the bar (step the cell down the fixed order and
  retry; a bar that locks no cell falls silent). Melody band [4t, 4t·8/5], no
  octave pops. One sanctioned ti(15/8)→do figure, seeded p=.5 on the raised-dom
  cadence bar.
- **Input simplified.** The 8-chip PROGS block and the bassmode row are gone;
  one 3-chip **LÖSUNG** row (NIE/SELTEN/OFT = cad 0/64/32) replaces them, mood
  default pre-selected, override sticks until mood change. `follow` is a mood
  constant now (no UI). Ledger HARMONIK shows the pool in ♭-aware romans with a
  superscript 5 on thirdless degrees. Hash key `l` replaces `p`/`f`; legacy `p`
  maps tolerantly (0→default, 1–2→NIE, 3–4→SELTEN, 5–7→OFT), old `f` ignored,
  permalinks re-voice (precedented). No hash version bump.
- **Copy:** reader notes ("Longing and release", "Affect and law") rewritten
  for the lament-bass/thirdless/one-leading-tone story with the Dido/chaconne
  reference; all dorian mentions swept from `rille/index.html`.
- **Verified** (`scratchpad/verify-rille-tonal.mjs`, Node sweep + Chromium;
  quick Chromium runner `verify-rille-chromium-quick.mjs` alongside): 25/25
  Node checks (bar-kind law, 5/4 audit, cadence-window shape, forced-i bars,
  cad:0 emptiness, bass-root walk 16/9→8/5→3/2→1/1, JI purity over the closed
  ratio set, single `mtof`, cantus band + chord-tone lock + ≤3 notes/2 bars,
  no major-6th anywhere, arp directions/reach, quint-bar arp tones, Camelot
  table, legacy-`p` mapping). Chromium: all 7 moods × 3 Lösungen render
  NaN-free with audio; AUTO-SET blend runs both decks then settles; ledger
  HARMONIK + Lösung re-default + OFFICINA bench round-trip pass. Only console
  noise is the shared Google-Fonts CDN block (environmental, filtered).
- **Pick-ups / rejected (do not "improve" back in):** half-cadences, Picardy
  third (only if the maintainer asks by name), chained-root JI (COCHLEA's
  territory), pure-3/2 Camelot hops, keeping dorian. EISEN's 45/32 cluster is
  deliberately harsh — 7/5 is the softer option only if the maintainer flags
  it. Cadence phrase length (8 bars), the swell dyads and shapes live in
  `buildHarm`/`SHAPES`/`scheduleBar`; the sigh cells + lock in `genAll`.
- **Ears check (state for the maintainer):** render TRÄNEN·OFT and SOG·SELTEN
  — the writing hovers in pure minor, thirdless where colour passes, the one
  leading tone lands at 15/8, and it tunes beatlessly off one tonic. No bright
  plinks, no noodling. (Headless verify confirms the structure and clean
  runtime; the subjective listen is the maintainer's to make.)

### GONGAN — new machine, op. XIV (Central Javanese court gamelan)
**Branch:** `claude/new-machine-design-y66pvl` · **File:** `gongan/index.html` ·
**Status:** done, verified headless (Chromium). New op. Registered in
`index.html` (card), `README.md` (row), `officina` (chip), CLAUDE.md and the
file-structure list above; counts bumped thirteen → fourteen everywhere.

Cyclic-time engine on the FOLI/TAMBOUR skeleton (prerender → one master
buffer → realtime loop + offline WAV, identical graph). Design:

- **The law is the cycle.** A `FORMS` bentuk fixes the colotomy exactly
  (0-indexed beats): lancaran 16 (kethuk on the odd marks, kempul 6/10/14
  with wela at 2, kenong 4/8/12/16), ketawang 16 (kethuk 2/6/10/14, kempul
  12, kenong 8/16), ladrang 32 — canonical Solonese placement, enumerated in
  the verify script. Gong on the last beat; lancaran carries balungan
  *nibani* (tone every 2nd beat), the others *mlaku*.
- **Laras = this machine's own embat** (stated in the reader notes — no two
  gamelans agree, so a fixed house tuning IS the authentic move): sléndro
  steps 228/245/238/232/257¢, pélog 120/150/285/115/115/165/250¢, cents
  tables in `LARAS` (engine, NOT in TIMBRE — tuning is law, not voicing).
  Registers: demung base (sléndro 140 Hz / pélog 153, tumbuk nem aligned),
  saron ×2, peking ×4, bonang ×2/panerus ×4, kempul ×.5; gong suwukan =
  alt-tone/2, gong ageng = gong-tone/4.
- **Pathet** per laras (`PATHET`): sléndro nem/sanga/manyura, pélog
  lima/nem/barang (barang swaps tone 1 for 7; tone 4 never sounds — noted
  as sorogan territory). Each carries sèlèh weights + gong & alt tones.
- **The composer** (`genAll`): seeded sèlèh per kenong segment from the
  pathet weights, then a stepwise walk (gantungan hangs, rare leaps, bias
  toward the target growing as the segment closes) landing exactly on each
  sèlèh. **Gongan A ends on the alt tone (rung on gong suwukan), gongan B
  on the pathet gong tone (gong ageng)** — the piece only fully lands the
  second time round.
- **Garap is derived, never stored** (`assemble`): peking nacah (aabb; at
  higher irama abab·aabb), bonang barung pipilan (abab across the coming
  pair) dropping to octave **gembyang** on pairs that carry a kenong sèlèh,
  panerus at ×2 density, simplified kendhang-kalih token grids per form
  (`KENDHANG`, 2 slots/beat, b/u/t/k). **Irama I/II/III** doubles beat
  duration AND elaboration density (2/4/8 per beat, panerus ×2) — verified
  ratios exact. `bpm` (laya 60–132) is the irama-I walking pace.
- **The damping hand:** saron-family + bonang events get `cut` = time to
  the same instrument's next stroke +50 ms; `mixHit` fades the last 40 ms.
  Gembyang is ONE event (`oct:true`, dedicated `bonangO` dyad buffers) so
  zero-delta cuts can't occur.
- **Bronze synthesis:** bars = fundamental + free-bar partials (×2.76,
  ×5.40) in pairs detuned ±pairDet/2 (the shimmer), one model at three
  register decays (demung 1.5× / saron 1× / peking .65×); kettles add a
  half-frequency hum + strike bend; kenong beats slowly between paired
  modes (waver); **gong ageng = two modes `f0` and `f0+ombak` Hz beating at
  the ombak rate** under a slow bloom; kethuk deliberately dull. Loop fold
  carries the gong's long ring across the seam (tail = gong decay×2.4).
- **Canvas:** left, the gongan as a **wheel** (colotomic glyphs on the rim —
  G double-ring, N filled, P open, t tick — cipher numerals inside, sweeping
  arm, gold gong flash that persists across the seam); right, both gongan in
  **kepatihan** cipher with structural letters above and the gong tone
  circled, sounding beat underlined. Static layer cached offscreen, rebuilt
  only when the sounding gongan flips (`SHOWN_G`).
- **TIMBRE:** 43 params in 9 groups; touch = master/wet live, baked edits
  apply on the next play (no mid-cycle restart, per the ► HEAR convention),
  and `TIMBRE.demo(group)` auditions each voice freshly baked — the gong
  demo sizes its buffer to the ring (`decay*1.4+2 s`) so the ombak
  breathes. Bridge verbatim incl. the demo op.
- **Verified headless** (`scratchpad/verify-gongan.mjs`, playwright-core +
  bundled Chromium, 32 checks + a per-voice solo probe): colotomy tables
  canonical; 720 pressings (3 forms × 2 laras × 3 pathet × 40 seeds) —
  tones always in pathet, nibani rests honoured, kenong beats carry their
  sèlèh, A→suwukan/B→ageng; assemble + renderMaster deterministic; irama
  doubles duration and density exactly; render NaN-free, peak-normalised,
  head energy present after the fold; realtime ctx runs; hash round-trips
  on a fresh load; offline cut + WAV encode clean; OFFICINA set/bulk
  round-trip; every voice non-silent solo; zero pageerrors.
- **Pick-up ideas:** a *ngelik* section (high-register B gongan) instead of
  the current A/B variation; irama transitions while playing (the accel/
  rit between levels is the live tradition's drama — needs a scheduler
  rather than the prerender skeleton, or a rendered transition segment);
  gendér/gambang floating voices; a suwuk (composed ending) for the WAV
  instead of the ring-off.

### OFFICINA + TIMBRE rollout — done, verified, this branch
**Branch:** `claude/voice-synthesis-settings-ifeuah` · **Files:** all 13
machines, `officina/index.html`, landing colophon link, README section.
**Status:** done; every machine verified headless (defaults match the old
literals exactly, zero pageerrors, bridge round-trips, bench sweep passes).

Param counts: PAS SALÉ 48 · SCALA 15 · GRADUS 13 · RILLE 43 · COCHLEA 24 ·
BOLG 25 · PEAL 13 · HOLLER 25 · FOLI 43 · NENIA 12 · KHÖÖMEI 45 · SPANNUNG 40
· TAMBOUR 41. Mixer-style tables (FOLI/TAMBOUR `VOICES` gains, PAS SALÉ
`LEVEL`, COCHLEA/BOLG `NOMINAL`/`SENDS`) moved into TIMBRE (aliased where the
code reads them by the old names). GRADUS and NENIA are one-shot performers —
no touch hook, edits apply on the next play (stated in their TIMBRE docs).

Fixed along the way: **KHÖÖMEI and SPANNUNG called `saveWav()` without
defining it — their WAV cut was broken in production.** Added the shared
saveWav pill verbatim to both.

Noticed, pre-existing, NOT touched: **PAS SALÉ's full-song WAV cut renders
super-linearly in node count** (8 s of song ≈ 1 s render, half the song ≈
95 s; the full 116 s song takes many minutes headless). All ~3.5k events'
nodes are created up front in one OfflineAudioContext. If it matters, chunk
the schedule or render in segments. (RILLE's 120 s plate cuts in ~60 s —
fine.) Also: the offline render measured peaks ≈1.06 pre-encode there
(encodeWav clamps) — the -14 dB/3:1 comp lets transients through.

Pick-ups: an OFFICINA "export everything" (all machines, one JSON); a
hashchange listener in the bench (deep links work on load; switching machines
mid-session is chips-only); per-param A/B rather than whole-voice.

### TAMBOUR — playback fixes + battlefield graphic
**Branch:** `claude/project-working-conventions-hlurpe` · **File:**
`tambour/index.html` · **Status:** done, verified headless (Chromium); on `main`.

Two rounds of maintainer feedback after the op. XIII drop.

**Round 1 — sound.**
- *Clairon was Casio-ish:* rewrote `synClaironNote` from a static sine stack to
  a dynamic brass model — upper partials **bloom in over the attack** (a
  brightness envelope), a breath chiff on the onset, a ~1 kHz formant. That
  spectral motion is the brass cue. Also pulled it back (gain .50→.30).
- *Snares should cut through / "lots of drummers":* the snare is now a **section**
  — `SECT` trebles the caisse claire and doubles the roulante at mix time, each
  copy spread a few ms + across the pan field with a different kit variant and
  seeded jitter (`sRng`). Measured: claire is the loudest voice in the mix
  (peak 2.95 vs clairon 0.12).
- *Patterns just repeated one bar:* calls are now genuinely varying **4-bar**
  phrases (2/4→32 steps, 6/8→24). `'|'`/space bar separators stripped at parse;
  `steps`/`spb`/`beatsPerBar` **derived from the pattern length** at load (see
  the `for(k in CALLS)` block). Tablature draws per-beat + per-bar gridlines.

**Round 2 — the battlefield graphic (the fun one).**
- The `<canvas>` now has **two views**, a `viewMode` toggle (`♪`/`⚔` button on
  the plate): the drum **tablature** (`drawScoreView`, the old view) and a
  side-scrolling **battlefield** (`drawBattle`, a toggle; `viewMode` defaults to
  `'score'`).
- **The march drives a battle.** `buildPulse` bins one phrase's events into a
  PULSE (grosse+snare+cymbal coincidences = the big spikes, "the march hitting
  just right"). `frenchQuality` scores the march from state (cadence bell-curve
  peaked at **120**, ensemble fullness with the **snare worth half**, industrie,
  fantaisie) ≈ 0..1. `battleStep` integrates a **tide** ∈ [-1,1]:
  `push = fq * pulse * 3.4`, `foe = enemy.strength * 0.50`, `tide += (push-foe)*dt*0.5`.
  **Tuning is deliberate — a full on-cadence march wins vs all enemies, a plain
  march beats Spain/Austria but stalemates Russia, a snare-muted/off-cadence
  march is routed. Don't rescale one constant without re-running `scratchpad/sweep.mjs`.**
- **Armies:** `FRENCH` (left, bleu-blanc-rouge) vs `ENEMIES[st.enemy]` (right;
  dropdown `#enemy`, `ENEMY_ORDER` = prussia/britain/russia/austria/spain, each
  a coat/cuff/hat/plume + flag + strength). Figures (`makeArmy`): soldiers +
  a **drummer & bugler (music guys)** + a **flag bearer**, two rows. `modeFor(tide)`
  → advance / hold / **retreat = about-face** / **rout = scatter-and-run**
  (`fig.runX` integrates away from the front). Ground scrolls (`BATTLE.scroll`,
  a marching treadmill + advance bias); French drummer's sticks fall on the
  snare pulse. **Enemy music is a future addition** (their side pushes at a flat
  rate for now — the hook is `enemy.strength`).
- State: `st.enemy` in hash as `en`; `viewMode` is a view pref (not hashed).
- **Verify:** `scratchpad/verify.mjs` now also asserts France advances vs a weak
  enemy with a good march, the snare-mute quality drop, and the view toggle;
  `scratchpad/sweep.mjs` prints the tide outcome per enemy for good/mid/weak
  marches (the balance table). NB: the model-enum section leaves claire+grosse
  muted (mask round-trip) — the battle section resets mutes first.

### TAMBOUR — new machine, op. XIII (French military field drum)
**Branch:** `claude/project-working-conventions-hlurpe` · **File:**
`tambour/index.html` · **Status:** done, verified headless (Chromium). New op.
Registered in `index.html` (card), `README.md` (row), and the file-structure
list above; counts bumped twelve → thirteen everywhere.

An archetypal European war-march engine — snare-focused, martial-industrial,
French mother tongue. Built on the FOLI skeleton (prerendered kit → one master
buffer → realtime loop + offline WAV, identical graph). Design:

- **The law is the call.** Eight *batteries d'ordonnance* (`CALLS`, order in
  `CALL_ORDER`): la-marche, la-générale, la-charge, le-rappel, la-retraite,
  aux-champs, le-ban, la-breloque. Each fixes token patterns per voice over a
  step grid — **2/4 → 16 steps, spb 4** or **6/8 → 12 steps, spb 3**, always
  four walking beats to the phrase. `bpm` is the *cadence* (pas/min), the bass
  drum falls on the foot.
- **Rudiment token language** (`parseVoice`): `.` rest · `o` tap · `O` accent ·
  `f` flam (fla) · `d` drag (ra) · `r` roll unit. Runs of `r` collapse into one
  buzz roll resolving on the next stroke (`emitBuzz`, ~24 ms overlapping soft
  strokes, velocity swelling). Bass/cymbal use only `.`/`o`/`O`.
- **The machine composes the snare's ornaments** (`ornaments`, Fantaisie 0..3):
  drags ahead of accents, ghost taps in gaps, roll fills at phrase ends — a full
  flourish every 4th phrase. Seeded, so it round-trips in the hash.
- **Voices** (`VOICES`, = lane order + mixer): clairon · caisse claire (the
  star) · caisse roulante · grosse caisse · cymbales · enclume (anvil) · bourdon
  (steel drone). Snare = two membrane modes + a rattle of one-pole-highpassed
  noise for the wires; field drum = membrane, snares off; bass = deep membrane +
  beater click; cymbals = decaying metal noise + shimmer; anvil = inharmonic
  metal; **clairon = additive brass locked to partials of `FUND` (116.54 Hz,
  B♭) — a valveless bugle, notes are integer partials only**, synthesised
  per-note in `renderMaster` (durations vary).
- **Industrie 0..3 (`st.industrial`)** is the martial→industrial slide:
  `DRIVE_CURVE` (tanh waveshaper in `buildGraph`, harder each level) + the anvil
  doubling hard accents (`anvilCells`) + the bourdon. **Bourdon gotcha:** it's a
  continuous drone laid in *after* the loop-fold, its component freqs snapped to
  integer multiples of `1/oN` (`m=round(f*oN/SR)`) so it is **perfectly
  seamless** across the loop point — do not add it before the fold or it doubles.
- **Negative-time gotcha:** a flam/drag/ornament grace before the phrase-head
  downbeat rounds below 0; `push` clamps `t` to `≥0` (and `mixHit` guards
  `off<0`). Don't remove either.
- **Canvas is a tablature, not a wheel:** one lane per voice, rudiment glyphs
  (accent = tall capped bar, tap = short, flam/drag = grace ticks, roll = hatch
  band + bracket, bass = block, cymbal = burst, anvil = diamond, clairon = bar
  at partial height, bourdon = band), L/R foot markers under the axis, a red
  playhead. **Static score cached to an offscreen canvas (`oc`/`buildScore`);
  only the playhead + glow redraw** — cheaper than FOLI's per-frame ring.
- Mixer greys out (`.na`) clairon on calls with no bugle, and enclume/bourdon on
  Parade (industrial 0) where they're silent.
- **Verified headless** (`scratchpad/verify.mjs`, playwright-core + the bundled
  Chromium): all 8 calls parse to well-formed events (snare-dominant, rolls
  present, clairon partials in 2..8, no time past end), realtime context runs,
  offline cut renders, `renderMaster` is deterministic and non-silent (peak 0.9,
  RMS ~0.12). The only console error is the Google-Fonts CDN failing under the
  proxy — environmental, same link every machine uses, harmless serif/mono
  fallback.
- **Pick-up ideas:** the calls are idiomatic arrangements, not a claim to one
  authoritative score (stated in the reader notes) — a stricter transcription of
  a specific ordinance is possible. A "fifre" (fife) melodic voice over the
  drums, or a per-call default industrial level, are natural next steps.

### HOLLER — just-intonation fiddle, voice fixes, faster default
**Branch:** `claude/banjo-loop-sound-design-qjlfm4` · **File:**
`holler/index.html` · **Status:** done, verified headless (Chromium); pushed to
`main`.

Follow-up round to the loop/mellow/fiddle work below.

- **Temperament — the answer is "ET is right for the frets, wrong for the bow."**
  Fretted instruments (banjo, guitar, bass) stay equal-tempered — that's where
  frets sit. The **fretless fiddle** now plays **5-limit just intonation** against
  the key tonic (a folk fiddler leans on pure intervals by ear). New `JI[]` table
  + `jiFreq(midi,tonicMidi)` next to `midiToFreq`; the fiddle bus calls
  `jiFreq(e.midi, tune.tuning.tonic)`, everything else still `midiToFreq`. Verified
  exact: fifth 701.96¢, just M3 386.31¢ (ET 400), octave 1200. ♭7 kept at 16/9 to
  avoid beating the banjo's ET ♭7 — **pick-up:** a septimal 7/4 "blue seventh" is
  the more radical authentic option if a rougher fiddle is wanted.
- **Fiddle was a flute → now a fiddle.** Root cause: the additive tone rolled its
  harmonics off at ~3 kHz (hollow, few partials = flute). Fix: bright sawtooth to
  ~7 kHz (4th-order rolloff), audible bow-scratch on the attack, ±11¢ / 5.5 Hz
  vibrato — and, crucially, the fiddle now renders to its **own bus** shaped by
  violin **body-formants** (peaks 300 / 560 / **3000 Hz bridge-hill**, HP 180).
  The bridge-hill is what reads as "violin, not flute."
- **Guitar was a harpsichord → now a guitar.** Bare Karplus–Strong strums rang
  bright/metallic. Guitar+bass now render to their own **`bbuf`** warmed by a
  **lowpass 2500** + a **110 Hz body lift**; strum brightness dropped (gstrum
  .10→.06, tau .16→.14). Foot still writes straight to the main buffer.
- **Foot stomp was inaudible → a dull thud.** The old hit was a bare 62 Hz sine at
  ×0.5 — sub-audible on laptop/phone speakers. New `footHit`: a body swooping
  95→55 Hz (floorboard give) **plus a one-pole-lowpassed (~1 kHz) woody "knock"**
  so it carries on small speakers, at full level. Foot-only render RMS 0.03→0.10.
- **Default tempo 132 → 168 bpm** (state + slider); `another()` range widened to
  140–210 so a reroll is never slower than the default.
- All buses render NaN-free (peak clamps to the 0.9 normalise), realtime + offline
  WAV both clean, JI ratios exact. Tab canvas still banjo-only (per maintainer).

### RILLE — just intervals over the bass · bass rumble floor · master headroom
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **File:** `rille/index.html`
· **Status:** done, verified (Node JI math + Chromium peak measurement); pushed.

Maintainer: "turn the chords still in the mix into just intervals in relation to
the bass; some bass notes are too low and rumble; nothing may clip — we want
headroom." Asked which reading of "just intervals" — answer: **both** (strip to
intervals AND tune just). Three changes:

- **Just intonation against the bass.** New `JI[]` 5-limit lattice +
  `jf(bassMidi, note, dom)`: every harmonic tone (arps, glints, swells, cantus)
  is tuned as an exact ratio from the bar's bass root instead of 12-TET; the
  dominant's seventh takes the **harmonic 7/4**. `bRoot` (with the pedal/follow
  cadence logic) is hoisted OUT of the bass gate in `scheduleBar` — it is the
  lattice reference even when the bass is silent. Voices (`vChord`/`vArpN`/
  `vCantus`) now take **frequencies**, not MIDI; the scheduler owns tuning.
  Verified: every tone lands within 35 cents of its ET target (detune, never a
  re-voicing) and >60 Hz.
- **Swells stripped to bare intervals.** The cadence is no longer a 4-voice
  chord: V7sus = bass + **4/3 & 7/4**; V7 = **5/4 & 7/4** (the 5/4 over the V
  bass IS the key's leading tone); tonic = **6/5 & 3/2**. Pad-mood hover
  underlay is a single just **3/2** fifth. Register: lattice root folded to the
  MIDI 40–51 band, ratios ×2 → old stab register. Sus detection stays
  `H.notes[1]-H.notes[0]===5`.
- **Rumble floor (`vBass`):** fundamentals reached MIDI 24 (32.7 Hz) with the
  sub-osc at **16 Hz** — infrasonic. Now: fundamental floored to ≥ MIDI 28
  (41.2 Hz, lifted by octaves), the f/2 sub-oscillator only added when f≥82 Hz
  (sub ≥41 Hz; below that the fundamental IS the sub and plays alone, gain
  .8→.92 to compensate), plus a 25 Hz highpass in the bass chain.
- **Headroom (`buildGraph`):** new `G.out` trim (.76) after the master comp;
  `deckFloor` hiss reroutes through it (still post-comp, never pumped).
  Measured full-mix peaks per mood, 14 bars straddling a cadence, dust on:
  **0.78–0.89** (was 0.99–1.15 = clipping the WAV). Zero pageerrors.
- **Pick-up:** trim constant `.76` targets ≈ −1 dBFS worst case; JI ratios and
  the dyad choices live in `JI`/`jf` and the dom/tonic branch of `scheduleBar`.
  If the 45/32 tritone reads too sour on EISEN's cluster, 7/5 is the softer
  choice. WATCH: `startMix` blends two decks ≈ +3–4 dB summed — peaks stayed
  ≤.89 single-deck; blend transients may kiss ~1.0 — if audible, drop trim to .7.

### RILLE — arpeggios instead of chord stabs
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **File:** `rille/index.html`
· **Status:** done, verified (Node + Chromium); pushed. Maintainer's suggestion.

Hover chords are no longer stabbed — they're **broken open into arpeggios**: the
chord never sounds all at once, it's always reaching (and rolling arps are the
minimal/deep-tech texture anyway). Cadences deliberately stay sustained swells —
the **only** place a chord sounds whole, which is now part of the release.

- **`g.arpSeq`** (genAll, replaces `chordHits`): seeded 32-step/2-bar walk of
  chord-tone *indices* `{s,idx,oct,vel}`; notes resolve at schedule time against
  the narrative bar (`H.notes[idx%len]+oct`). Per-mood `arp:{rate:8|16, dens,
  dir:'up'|'dn'|'ud'|'rnd'}`: TRÄNEN rises in slow 8ths, FINSTERNIS/LEERE fall
  sparse, SOG rolls up in 16ths, SCHATTEN/DÄMMERUNG rock, EISEN's cluster becomes
  a dense random industrial sequence. Occasional +12 lift on the top tone ("the
  reach"); offbeat-8th accents; some downbeats skipped (space). Swing applies.
- **`vArpN`**: soft pluck, 2 detuned saws → warmth lowpass → `stabBP` → chordae
  part → **duck bus** (arp pumps with the kick). Notes overlap slightly
  (`stepDur*2.4`) for legato shimmer.
- **Passing majors** ('maj' bars): a quick 3-note ascending **glint** via vArpN —
  still one bar, still gone. Pre-dominant bars arpeggiate (tension rolls) before
  the V7sus swell. Pad moods (TRÄNEN/LEERE) keep a quiet swell UNDER the line.
- Canvas chordae ring now shows the arp step mask. `chordHits` fully removed.
  (Cantus rng draws shifted vs. the previous commit — pressings re-voice; harm
  timeline itself unchanged for a given seed.)
- **Verified:** Node — arpSeq deterministic, indices/octaves/velocities in range,
  8th-rate moods never emit 16th-offset steps, never empty; full narrative sweep
  still PASS (3360 pressings). Chromium — all 7 moods render arp+glint+cadence
  windows with zero pageerrors (densities: LEERE/FINSTERNIS 6 events/2 bars …
  EISEN 21). **Pick-up:** arp note length (`stepDur*2.4`), pluck level (.24) and
  the maj-glint shape live in `scheduleBar`/`vArpN`; direction/density per mood.

### RILLE — harmonic NARRATIVE engine (supersedes the progression rework below)
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **Files:** `rille/index.html`
(+ engine copy in `README.md`, `index.html`) · **Status:** done, verified (Node
structural sweep + headless Chromium); pushed.

Maintainer verdict on the previous pass: "still not landing — beats/rhythm good,
harmonic structures don't. Redo the composition structure; freedom." Diagnosis:
a fixed 2-bars-per-chord loop can never ache — even with a V7 in it, resolution
recurs mechanically, so nothing is *earned*. Replaced the chord loop with a
**64-bar harmonic narrative** (`HARMBARS`, = one WAV cut):

- **Two states.** HOVER: seeded weighted drift among the mood's minor chords
  (each 2–4 bars, deep **minor-9 voicings** per `HOVER_SHAPE[vstyle]`), majors
  (♭VI/♭VII/♭II/IV) capped **by engine law at 1 bar + one short stab** (`kind:
  'maj'`) — passing colour, never a destination. CADENCE: every `cad` bars the
  **last 8 bars of the span** run pre-dominant (`'pre'`, iv or ♭VI, 2 bars) →
  **V7sus held** → **V7** (raised leading tone; the 4-3 suspension resolves
  across the two swells) → **i blooming** (`'tonic'`, m(add9) swell) — unless
  `half:true`, which hangs on the V7 (half-cadence, never lands). Melody
  (`cantus`) falls silent on `dom` bars; bass follows chord roots through
  pre→dom→tonic so **iv→V→i walks in the low end** even in pedal moods.
- **Quality is chosen, not inherited**: `voiceAt(mode,root,deg,offs)` voices
  explicit semitone shapes (register-anchored as before); diatonic stacking and
  `buildChord` are gone, so no accidental clash is possible. Diminished pool
  slots are filtered at build (`poolDegs` keeps the labels truthful).
- **Recipes.** A progression is now `{pool:[[deg,weight]…], cad, half}` —
  `PROGS`: suum / schweben (i·iv ∞) / sehnen (+♭VI ∞) / halb (…V7 offen) /
  selten (one release per 64) / erzählen (per 32) / neapel (♭II colour) / oft
  (per 16). Moods carry `harm:{…}` (replaces progDeg/progDom/progHold):
  FINSTERNIS ♭II+half-cad (never lands), SCHATTEN cad 64, TRÄNEN cad 32
  (flagship), EISEN cluster-drone ∞, DÄMMERUNG cad 32, LEERE i·iv ∞, SOG cad 32.
  Ledger says **HARMONIK** with `harmLabel` (♭-aware romans + `…V7→i`/`(offen)`/
  `∞`); chips regenerate per mood. `g.harm[bar%64]` is the scheduler's only
  lookup; hash `p` = recipe index (0–7 as before).
- **Verified:** Node — 3360 pressings (7 moods × 8 recipes × 60 seeds):
  deterministic, majors 5.5% of bars and never >1 bar, every resolving recipe
  lands tonic-after-dom, half recipes never emit `tonic`, `cad:0` emits no
  cadence kinds, V7 always carries the leading tone, registers in range.
  Chromium — cadence windows render for TRÄNEN/FINSTERNIS/SOG/LEERE with zero
  pageerrors; recipe chips + ledger correct live; hash carries `p`.
- **Pick-up:** cadence phrase length (8 bars) and shapes live in `buildHarm`;
  swell dynamics in `scheduleBar`'s dom/tonic branch (`H.span*16*stepDur*.94`).
  Arrangement (`newArrange`) and the harm grid are deliberately uncoupled so
  live and offline stay identical — coupling cadences to BRUCH sections would
  be the next expressive step. Old permalinks: harmony differs (by design).

### RILLE — emotional-minor harmony: longing default, rationed resolution — SUPERSEDED by the narrative engine above; kept for the ♭9/register reasoning.
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

# Handoff

Orientation for OPVSCVLA. **You don't need to read this whole file** — and you
shouldn't. Priority on every task is shipping with **minimal token usage**. The
lean top matter (Architecture → Key decisions → File structure → Conventions →
Quality bar → Workflow → TIMBRE/OFFICINA) plus the one machine in your scope is
enough to work. Each machine is self-contained: to work on it you need its
`index.html` and its own `THREADS.md` (in the machine's directory) — **not** the
other machines' code or history. If a task seems to require combing the whole
repo, flag that instead of doing it.

---

## Architecture

**OPVSCVLA is twenty-eight independent single-file Web Audio machines** plus a static
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
THREADS.md           cross-cutting / meta session log; each machine's own log
                     lives in its <machine>/THREADS.md
icon.svg             app icon (master); icon-512/192.png, apple-touch-icon.png,
                     favicon-32.png rendered from it · site.webmanifest (PWA)
officina/index.html  OFFICINA — the voicing bench (backstage, NOT an op.)
pas-sale/index.html  op. I    PAS SALÉ   — zydeco two-step
scala/index.html     op. II   SCALA      — Shepard–Risset in just intonation
gradus/index.html    op. III  GRADUS     — species counterpoint after Fux
rille/index.html     op. IV   RILLE      — minimal techno dubplate (see rille/THREADS.md)
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
ricercar/index.html  op. XXIII RICERCAR   — Bach's Musical Offering riddle canons as a formal system
svara/index.html     op. XXIV  SVARA      — South Indian Carnatic music: svara over the 22 shrutis
siyotanka/index.html op. XXV   ŠIYÓTȞAŊKA — the Lakota courting flute (šiyótȟaŋka; just-intonation minor pentatonic)
tenebrae/index.html  op. XXVI TENEBRAE    — Renaissance sacred polyphony, Tenebrae responsories
amadinda/index.html  op. XXVII AMADINDA   — Baganda royal log xylophone, equipentatonic interlock
bani/index.html      op. XXVIII BANI      — Georgian table-song polyphony, adaptive intonation
```

The `op.` roman-numeral order is fixed and lives in `index.html` and `README.md`;
keep all three (page, README, this file) in sync when adding a machine.

## Conventions

**Working process (agreed with the maintainer):**
- Keep this HANDOFF.md current — update it **in your PR** when your change alters
  orientation (architecture, decisions, structure, conventions). The per-session
  record goes at the top of a `THREADS.md`, not here (see Session history).
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
- Git: develop on your `claude/*` branch, commit with descriptive messages (the
  music-theory / design reasoning lives there), and **open a PR** — every task
  ends in a PR the maintainer reviews and merges. Never push to `main`, never
  merge your own PR. See Workflow.

## Quality bar

**Don't ship low-quality code.** A machine is done only when it meets the house
grammar end to end: the law is the interface, generation is seeded and
deterministic, the URL hash round-trips, the offline WAV is deterministic and
clip-safe, iOS audio + Media Session are wired, `prefers-reduced-motion` is
respected, TIMBRE + the OFFICINA bridge are present, and it is **verified
headless** (enumerate the model → transport smoke → offline render, all with
zero page errors). If you can't clear that bar inside the token budget, ship a
smaller scope *well* and note the rest in the machine's `THREADS.md` — never ship
a half-working machine to save tokens.

**Maintainer's reference machines — the bar to match:** **BOLG**, **DIAMOND**,
**TESSERA**, **FADÓ**, **TENEBRAE**. Study these for shell, voicing, and finish
when building or improving; "use DIAMOND as an example" is a standing
instruction. **Known to need work:** **PAS SALÉ** (op. I, the oldest — good song,
but shell + voice are below standard), **RILLE** (strong concept, genuinely hard
to settle — read the many RILLE threads before touching it), **ŠIYÓTȞAŊKA**
(functional but musically thin). Treat these as where improvement effort pays
off; treat the reference five as the finish level to hit.

## Workflow — many sessions, PRs into main

Several chats work this repo at once, each on its own `claude/*` branch. **The
maintainer commits to `main`; agents open PRs.** Every session — plan, build, or
improve — ends by opening a PR and stopping. Never push to `main`, never merge
your own PR.

**The three kinds of task** (the maintainer says which):
- **Plan** — write a design brief for another agent to build, in the house
  format (`diamond/GENESIS.md`): grounding, the law, the generation/interlock
  logic, voices, a TIMBRE sketch, canvas, gotchas (the verbatim OFFICINA bridge,
  iOS/lock-screen from day one), a considered-and-rejected list, a verify
  gauntlet, and a registration checklist. **No machine code.** The brief lives in
  the machine's directory (e.g. `foo/GENESIS.md`) and claims the concept +
  directory name, not the opus number. PR the brief.
- **Build** — implement a machine (from a brief or from scratch): the machine's
  `index.html` + registry wiring (below). Verify headless before you PR; delete
  the design brief and fold its outcome into the machine's `THREADS.md`.
- **Improve** — targeted fixes/upgrades to one existing machine. Minimal diff,
  verify what you touched, PR it.

**Scope & independence**
- **One session = one branch = one scope**, usually one machine. Work from the
  lean orientation at the top of this file + your one machine (its `index.html`
  and its `THREADS.md`). You should **not** need the other machines' code or
  history; if a task seems to, flag it rather than combing the repo.
- Keep edits inside your machine's directory plus the minimal registry rows.
  Before starting, `git fetch origin` and scan `git branch -r` + recent
  `origin/main`: two branches must never edit the same machine's `index.html`
  concurrently — coordinate through the maintainer instead of racing.

**Expect `main` to have moved** — it almost always has; agents commonly run
several items at once and PRs merge continuously.
- **First act:** `git fetch origin main`, start from / rebase onto
  `origin/main` (the container's local `main` is a stale clone-time snapshot).
- **Before you PR:** fetch again, rebase onto `origin/main`, re-verify, and
  re-read the registry (file table above / `index.html` / `README.md`) on
  `origin/main`.
- **Opus numbers are provisional until merged.** Take the next free numeral from
  current `origin/main` and say in the PR that it's provisional; if another
  machine merges first, the maintainer settles final numbering at merge — the
  directory name is yours, the number can move. (Machines here have renumbered
  several times before landing; that's normal.) Also check live branches for an
  in-flight directory of the same name — two machines may share a provisional
  number but never a directory.
- A **merged PR is finished.** Follow-up work is a fresh branch off
  `origin/main`, never new commits on the merged branch. Branches with no merge
  base against `origin/main` predate a history rewrite and can't be merged;
  re-implement anything still wanted from one fresh on `origin/main`.

**HANDOFF.md + THREADS.md — the shared files**
- Your **session record** goes at the **top** of a `THREADS.md`, under its own
  `###` heading, newest first — your machine's `<machine>/THREADS.md` for machine
  work, the repo-root `THREADS.md` for a cross-cutting change. Because per-machine
  files rarely overlap, parallel PRs mostly don't touch the same one at all.
- Edit **HANDOFF.md itself** only when your change alters orientation
  (architecture, decisions, the file table, a convention bullet) — plus your row
  in the registry files. **Never reflow, reorder, or cosmetically rewrite sections
  you didn't work in**; that is what turns parallel edits into real conflicts.
- If two branches do collide on the same `THREADS.md`, the fix is mechanical: keep
  both `###` entries (either order). Re-merge any HANDOFF fixed-section lines by
  hand.
- Only a session that deliberately reorganizes HANDOFF.md may restructure it, and
  that session touches nothing else.

**Registry files** — the landing `index.html`, `README.md`, the file table
here, and `officina`'s `MACHINES` chips: add your row/chip as a **minimal diff**
— no reordering, no reformat, no drive-by copy edits. All four must agree; the
rebase-before-PR is where you re-sync them against what merged under you.

**Cross-machine sweeps** — a change touching every machine (the OFFICINA bridge,
a convention applied everywhere): its **own dedicated branch/PR**, no per-machine
feature work mixed in, announced in the root `THREADS.md` so per-machine sessions
know to rebase. See also the per-machine OFFICINA policy in TIMBRE/OFFICINA below.

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

**OFFICINA is improved per-machine, not swept (for now).** When you're already in
a machine, a **token-light** bench/TIMBRE fix — a mislabeled or missing param, a
wrong factory default, a group that should exist — just do it in the same PR. A
**token-intensive** officina change — a bench-wide feature, a schema redesign,
anything that would balloon the PR or the token budget — is **not** inline work:
note it in the machine's `THREADS.md` and leave it for a dedicated pass. Shipping
the machine with minimal tokens comes first.

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

## Session history — per-machine `THREADS.md`

The inline Open-threads log has moved out of this file to keep it light. **Each
machine's development history now lives in its own `<machine>/THREADS.md`**
(newest first) — read only the one for the machine you're touching, not the
others. Threads that span machines or the whole repo (voicing-layer rollouts,
lock-screen sweeps, the OP–XY fork, meta snapshots) live in the repo-root
**`THREADS.md`**, which also indexes which machines have recorded history.

**Adding an entry (end of every session):** put it at the **top** of the relevant
`THREADS.md` — your machine's file for machine work, root `THREADS.md` for a
cross-cutting change — under its own `###` heading, same format as the existing
entries. That is where the per-session record goes; edit HANDOFF.md itself only
when your change alters orientation (architecture, decisions, file structure,
conventions). Because per-machine files rarely overlap, parallel PRs conflict
far less than when every branch appended to one shared log here.

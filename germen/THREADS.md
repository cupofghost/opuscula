# germen — session threads

Development history for the `germen/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

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


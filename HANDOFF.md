# Handoff

Working notes for in-flight changes. Newest first.

## RILLE — harmonic auto-mixing between generated tracks (DJ set)

**Branch:** `claude/rille-hiss-pause-4dojix`
**File touched:** `rille/index.html`
**Status:** Done, verified headless. No PR opened yet.

### The report
"Expand RILLE to mix between songs. Follow harmonic principles (Camelot wheel).
Use research on what makes minimal techno good and follow the guidelines."
Chosen UX (asked): continuous auto-set + manual trigger; next key "mostly smooth,
occasional lift".

### What it does now
A new **AUTO-SET** toggle turns RILLE from one track into an endless DJ set: every
`SET_BARS` (48) it beatmatches and blends into a fresh generated track in a
**Camelot-compatible key**, over a long phrase-aligned crossfade with a **bass
swap**. **JETZT →** triggers the next blend by hand (keys: `m` mix, `x` auto).
A readout under the controls shows the current Camelot key and the queued move.

### Harmonic model (Camelot)
Every mood is a minor-family mode, so every track sits on the Camelot **A ring**;
its key = tonic pitch-class. `CAMELOT_PC`/`PC_CAMELOT` map both ways; ±1 Camelot =
a perfect fifth/fourth. Moves rendered (all minor→minor, all wheel-legal): same
key, +1 (fifth ↑), −1 (fourth ↑), and the two energy boosts +7 (semitone ↑) and
+2 (whole-tone ↑). `pickHarmonicMove` weights fifths/fourths highest, same-key
sometimes, an energy lift now and then. **B-ring / relative-major moves are not
rendered** — the engine has no major mode. Mood keys: FINSTERNIS 4A, SCHATTEN 1A,
TRÄNEN 8A, EISEN 9A, DÄMMERUNG 7A, LEERE 5A. `genAll` gained a `rootOverride` so a
track can be transposed to any target key; `st.root` carries the live key.

### Minimal-techno principles (from the research)
Long blends (`BLEND_BARS`=16, phrase-aligned), **beatmatch** (both decks share one
bar clock at `st.bpm`), **bass swap** (incoming tops rise first with its low end
held out by a highpass, kick+bass handed over at the mid-blend bar so two
basslines never stack), and **transition by subtraction** (at the swap the
outgoing track's stabs/claps/melody are stripped, then it fades). Incoming starts
from its intro and builds.

### Architecture — dual deck
`buildGraph` is now a shared **mixer** (master shaper→comp→out + shared reverb/
delay sends). `makeDeck()` hangs a full channel-strip per track: part gains, its
own sidechain duck bus, stab filter, kick drive, sends, a **fader** (crossfader),
a **bassKill** highpass (the bass swap), and a post-comp **deckFloor** for the
hiss (still never pumped, now crossfades per deck). Voice functions are unchanged
— their first arg is still called `G` but now receives a deck exposing the same
field names. `RT.decks[]` holds live decks (normally 1, two during a blend);
`schedTick` advances/schedules each at the same `t`. `startMix`/`doSwap`/
`finishMix` run the blend; the outgoing deck is retired and the incoming promoted
to primary (`st.g` etc.), with chips/ledger/hash resynced. Hash gained `k` (key)
and `x` (auto) so a shared link restores the exact key and set mode. `cutPlate`
builds one deck; the offline WAV is still a single track.

### Verification (headless Chromium)
- Camelot: 400 random moves all legal; pc↔number round-trips; mood key table
  correct.
- Full blend sampled live: incoming fader 0→1 over the first half with lows
  killed (bassKill 230), swap hands the low end over (outgoing bassKill 20→230,
  incoming 230→20), outgoing fader →0. End-to-end via the scheduler: `4A→5A`,
  ÜBERGANG section seen, promoted at bar 24 (=start+16), decks 2→1, no errors.
- Auto-set fires a compatible mix; manual JETZT queues one at the next phrase.
- Regressions: pause suspends, multi-deck STAUB mute → part+floor 0, offline WAV
  renders (peak .97). No console/page errors in any run.

### If picking this up
- Only the A ring is reachable; a major-mode voicing would unlock relative/
  diagonal (B-ring) moves and the full wheel.
- `SET_BARS`/`BLEND_BARS` are consts near the Camelot helpers if the set pacing
  wants tuning.

## RILLE — hiss pumped with the kick; added a pause button

**Branch:** `claude/rille-hiss-pause-4dojix`
**File touched:** `rille/index.html`
**Status:** Done, verified headless. No PR opened yet.

### The report
"Lower the hiss a bit and make sure it doesn't get sidechained — doesn't make
sense if it was pressed on a record. Also add a pause button."

### Hiss — lowered + un-pumped
The surface hiss (the `h` noise loop in `startDust`, part `pulvis`/STAUB) ran
through the per-part gain → `G.pre` → master shaper → **master compressor** →
out. That glue compressor ducks the whole bus on every kick, so the "constant"
hiss pumped in time with the beat — nothing a real pressing does; vinyl surface
noise is a steady floor under the stylus.

**Fix:** added `G.floor`, a gain tapped *straight to `ac.destination`*, after the
master compressor. The hiss now routes into `G.floor` instead of the part bus, so
it can't be sidechained by the master comp. Level dropped `.006 → .004` (× the
mood's `dust`). STAUB mute still gates the hiss: the mute handler now also rides
`G.floor.gain` when `pulvis` toggles (and `G.floor` inits from `st.mutes.pulvis`).
The crackle/pops stay on the part bus — the request was about the hiss.

### Pause button
New `#pause` button beside SPIEL (+ `p` key). `togglePause()` suspends/resumes the
AudioContext; because every scheduler + the disc `tick()` are keyed off
`ac.currentTime` (frozen while suspended), the transport and visuals hold and
resume exactly where they left off — no re-sync. Button reads PAUSE↔WEITER,
disabled unless playing, reset by start/stop. `tick()` bails while paused so the
rAF loop ends and resume restarts a single loop.

**Gotcha:** the iOS audio-unlock `kick()` auto-resumes any non-running context on
`statechange`/visibility while the page is visible — it was instantly undoing the
pause. Guarded it with `if(!st.paused)`; `st.paused` is the deliberate-pause flag.

### Verification
Headless Chromium: pause freezes `ac.currentTime` (state→suspended) and resume
advances it; `p` key toggles; STAUB mute drives both `part.pulvis` and `floor` to
0/1; offline WAV render (shared `buildGraph`/`startDust`) renders with the floor
node, no errors.

## RILLE — chord progressions sounded broken/clunky

**Branch:** `claude/rille-chord-dissonance-io1zr6`
**File touched:** `rille/index.html` (chord engine only)
**Status:** Done, committed, pushed. No PR opened yet.

### The report
Rille's chord progressions "often sound bad" — some dissonance is fine, but a lot
of progressions sounded *broken*, not just spicy.

### Root cause 1 — a diatonic ♭9 (the "broken" clang)
`buildChord()` stacked its "ninth" by reaching eight diatonic scale-steps above
the chord root (`rel(8)`) without checking the resulting interval. On any degree
whose upper scale-neighbour is a semitone, that ninth comes out a **♭9 — a minor
ninth (13 semitones) above the root**, the harshest interval in the voicing and a
textbook avoid-note over non-dominant chords.

Trap degrees per mode: **Phrygian i & v · Aeolian ii & v · Dorian ii & vi.**
It was baked into the default mood (tenebrae, Phrygian tonic → `0,3,10,13`) and
into most of the user-selectable progressions, so the very first thing you hear
was a ♭9 grinding against the pedal bass.

**Fix:** fold a ♭9 down to the octave (`nine()` → `13 ? 12`). Also guarded the
`sus9` frame so an augmented 4th / diminished 5th can't grind a semitone cluster
(`sus()`, `fif()`). Everything stays in the mode; four voices preserved.
`ferrum`'s `cluster` voicing `[0,6,13]` is **intentionally harsh — left alone.**
Commit `571907b`.

### Root cause 2 — every stab in a different register (the "clunk")
Chords were voiced root-position at `root+12+base`, so as a progression climbed
the scale the whole voicing leapt up toward an octave — no consistent register.

**Fix:** anchor each chord root to the octave nearest the key root, moving the
voicing as a rigid block (internal intervals untouched → no new clashes).
Result: register span ≤10 semitones, worst chord-to-chord step ≤9, nothing drifts
below the key root into the bass. Voiced progression precomputed once in
`genAll` as `g.chords`, read by `scheduleBar`. Commit `ea91fb2`.

Considered true voice-leading (nearest to *previous* chord) and rejected it: it
drifted the register down over the loop and lurched ~14 semitones at the loop
point, sinking chords into the bass. Register-anchoring is loop-stable.

### Verification
- Enumerated every mode × diatonic voicing (shell9/stack9/sus9) × selectable
  progression = 95 chords → **0 minor-ninth / semitone-cluster clashes** (was ~40).
- Headless Chromium smoke test: `genAll` runs for all 48 mood×prog combos, the
  transport plays and advances bars with **no runtime errors**. ferrum's cluster
  still reads "harsh" by design (expected).

### If picking this up
- Optional next step: light inversion / true voice-leading with anti-drift
  clamping, if the parallel-block motion still feels stiff. Current choice was
  deliberately the stable, idiomatic one.
- The music-theory diagnosis lives in the commit messages; the engine is
  `buildChord` / `genAll` / `scheduleBar` in `rille/index.html`.

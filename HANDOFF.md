# Handoff

Working notes for in-flight changes. Newest first.

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

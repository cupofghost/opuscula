# Handoff

Working notes for in-flight changes. Newest first.

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

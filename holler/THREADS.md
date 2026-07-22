# holler — session threads

Development history for the `holler/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

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


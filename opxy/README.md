# OPVSCVLA → OP–XY — a MIDI fork

A fork of OPVSCVLA that, instead of synthesising sound in the browser, **plays a
[Teenage Engineering OP–XY](https://teenage.engineering/products/op-xy) over
MIDI** — while preserving the just-intonation and non-equal tunings the main
collection cares about. Two proof-of-concept machines demonstrate the two viable
paths for getting a non-12-TET scale onto the device.

> **The one thing to confirm on hardware:** whether the OP–XY honours
> voice-per-channel **MPE input** (independent pitch bend per note across
> channels 2–16). Everything in path A works without it; path B degrades
> gracefully to an N-voice poly-channel pool if it's absent. See "Open risk".

## What travels over MIDI, and what doesn't

MIDI carries **pitch and tuning, not timbre.** These pages hand the *sound* to
the OP–XY's own engines. The "rich harmonics" you hear are the device's, *tuned
to* each machine's exact ratios — not the browser machine's own synthesis. Each
page also runs an **internal audio monitor** that plays the exact target
frequencies, so you can hear the intended tuning with no hardware attached and
compare it against what the device produces.

## The two paths

### Path A — native tuning table (`fado-midi/`)

The OP–XY has a built-in **per-note tuning table** (system settings → tuning):
up to **11 user tunings**, each note settable in **cents + micro-cents**. Any
scale of **≤12 pitch-classes that repeats every octave** — most of OPVSCVLA's
tuned machines — becomes twelve detune values you enter once. After that the
music is ordinary MIDI notes: full polyphony, nothing to bend.

- **Demo:** FADÓ (op. XXII), Portuguese fado over a Pythagorean (3-limit)
  ladder, tonic A.
- **Workflow:** open the page → read the twelve detune values off the *tuning
  table* panel → dial them into a user tuning on the OP–XY → make that tuning
  active → press play. The page sends plain note numbers; the device retunes
  each pitch-class.
- **Covers:** the modal / diatonic JI machines, SCALA, KHÖÖMEI's smaller
  harmonic sets, VYVID's frame, etc.
- **Cannot cover:** anything needing >12 pitches/octave, a non-octave period, or
  tuning that changes while it plays — those are path B.

### Path B — per-note pitch bend / MPE (`tritava-midi/`)

For each note the page finds the nearest 12-TET key, computes the cents needed
to reach the **exact** frequency, puts the note on its **own MIDI channel**, and
sends a 14-bit pitch bend *before* the note-on. One note per channel = an
independent tuning per voice — the MPE idea. With MPE routing that's up to 15
simultaneously, independently-tuned voices.

- **Demo:** TRITAVA (op. XIX), the **Bohlen–Pierce** scale — built from the odd
  harmonics 3·5·7 and closing at the **tritave** (3/1, a perfect twelfth). It
  has *no octave*, so an octave-repeating tuning table literally cannot express
  it. This is where "MPE is needed" is true.
- **Routing options:**
  - **MPE lower zone** — master ch 1, member notes on ch 2–16. Sends an MPE
    configuration message (RPN 6) and a per-channel pitch-bend-range (RPN 0) on
    play (best effort; toggle-able).
  - **Poly-channel pool** — a fixed set of channels round-robined. Works on any
    multitimbral synth that applies pitch bend per channel, capped at the pool
    size. This is the fallback if MPE input isn't honoured.
- **Set the device's bend range to match the page** (default ±2 semitones), or
  every bent note lands at the wrong pitch. Channel allocation is computed
  deterministically over the score timeline, so a given seed always produces the
  same channel/bend assignment.

## The four encoders

Both pages map the OP–XY's **four rotary encoders** (which transmit assignable
MIDI CCs) to the machine's major parameters:

- **FADÓ:** mode · progression · tempo · seed
- **TRITAVA:** mode · meter · motion · tempo

On the device, hold **shift** + rotate an encoder to choose the CC it sends.
In the page, either type that CC number into a slot or press **learn** and move
the encoder to capture it. Incoming values scale to each parameter's range; law
changes re-vibe at the next loop (the collection's change-while-playing
convention). The OP–XY pages its encoders (M2/M3 → eight CCs), so you can reach
more than four parameters if you want to extend the maps.

## Requirements & compatibility

- **Web MIDI API** — Chrome or Edge (desktop). **Safari has no Web MIDI.** This
  matches the repo's "verify headless Chromium" convention. TE's own firmware
  updater runs over browser Web MIDI, so the browser → OP–XY link is a proven
  path.
- **Connection:** USB-C (class-compliant), TRS MIDI, or Bluetooth MIDI. USB-C is
  simplest for a browser.
- No build, no dependencies, no server — same as every OPVSCVLA machine. Open
  the `index.html` directly or serve the folder statically.

## Open risk (why hardware confirmation matters)

Two facts weren't confirmable from documentation alone and change what's in
scope:

1. **Does the OP–XY honour voice-per-channel MPE input?** If yes, path B gives
   ~15-voice independently-tuned polyphony. If it only applies pitch bend
   per-channel without MPE voice allocation, use the poly-channel pool (capped
   at the channel count). The page supports both; only the ceiling changes.
2. **Is the user tuning 12-per-octave or a full 128-note keymap?** If it's a
   full keymap, several path-B machines (e.g. Partch's 43-tone DIAMOND, even
   TRITAVA mapped across the keys) could move to path A. Assumed 12-per-octave
   here.

## Files

```
opxy/
  index.html            fork landing page (links both machines)
  README.md             this file
  fado-midi/index.html  path A — native tuning table (Pythagorean JI)
  tritava-midi/index.html  path B — per-note pitch bend / MPE (Bohlen–Pierce)
```

Each page is standalone and self-contained, faithful to the original machine's
generator (`genAll` / `assemble`) — the models are copied verbatim, only the
output stage (Web Audio → Web MIDI) differs.

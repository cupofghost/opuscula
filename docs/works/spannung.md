# op. XII — SPANNUNG · `spannung/`

**A modular synthesizer.** Named in German (*Spannung* = voltage and tension both;
*Steuerspannung* = control voltage), after Doepfer's Eurorack format and the
Berlin School.

- **Concept:** a **self-patching Eurorack rack.** A master clock drives a
  **16-step sequencer** through a quantizer into a voltage-controlled chain
  (**VCO → VCF → VCA**); a **sample-and-hold** throws a random melody line locked
  to the loop; **noise + envelopes** make the drums; an **LFO** drifts the filter;
  everything mixes out through **dub delay and reverb** into a four-bar loop.
- **Controls:** cutoff, resonance, space, density, analogue drift.
- **Self-drawing:** the rack **draws itself, patch cables and all**, on the canvas.
- **Synthesis:** subtractive voices from scratch (VCO/VCF/VCA), no samples.
- **Execution model:** **live** — the step engine re-vibes on any control while it
  runs. Offline WAV cut of the loop. `r` = another patch.

**Structure:** engine (clock → sequencer → S&H → voices → drums → mixer/FX) →
state/RNG → audio graph → canvas (self-patching rack) → realtime step engine →
OfflineAudioContext WAV → controls → `__iosAudio` → hash/keys → init.

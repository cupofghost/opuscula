# OPVSCVLA

Twelve small musical machines. Each is a single self-contained HTML file of pure
Web Audio — no build, no dependencies, no samples, no trackers. The machine
composes; you set the law it obeys.

**Live:** https://cupofghost.github.io/opuscula/

| op. | work | what it is |
|-----|------|-----------|
| I | [PAS SALÉ](./pas-sale/) | zydeco two-step for a synthesized band — G, 148. ENCORE! presses another version. |
| II | [SCALA](./scala/) | Shepard–Risset glissando in just intonation. Ratios exact; the lap loops seamlessly. |
| III | [GRADUS](./gradus/) | Generative species counterpoint after Fux (1725). Six rules are the interface; turn off parallels and it writes organum. |
| IV | [RILLE](./rille/) | Minimal techno on a white-label dubplate — named in German, techno's mother tongue. Seven affects steer key, tempo, and space (the seventh, SOG, is a warm minimal-deep-tech roll); a diatonic engine keeps the chords in the mode. |
| V | [COCHLEA](./cochlea/) | A just-intonation comma pump. Pure intervals walk a fifth-and-third lattice that never quite closes; the residual comma winds an Archimedean spiral. Every interval pure, every return imperfect. |
| VI | [BOLG](./bolg/) | Generative uilleann piping — named in Irish, the music's mother tongue. A just-intonation chanter over three standing drones; cuts, rolls and crans with the regulators vamping underneath. Reels, jigs, slip jigs, hornpipes and slow airs. |
| VII | [PEAL](./peal/) | English change-ringing — the bells sound permutations, not tunes. Choose a method (Plain Hunt, Plain Bob, Grandsire, Reverse/Double Bob) on five to twelve bells — Doubles through Maximus — and the machine rings every distinct row once and comes round; the "blue line" traces a bell through the changes. On Plain Bob a conductor can call a *touch* — Bobs and Singles splice the courses, each touch searched to be true (no row rung twice). Every method and touch is verified *true*. Synthesized tower bells with true partials — hum, prime, tierce, quint, nominal. |
| VIII | [HOLLER](./holler/) | Appalachian old-time banjo — named in Appalachian English, the music's mother tongue. One generated AABB fiddle tune, played by five right hands: clawhammer, drop-thumb, two-finger, the three-finger (Scruggs) roll, and melodic. On the banjo the picking pattern *is* the music. Sawmill and open tunings, the four old-time modes (Ionian, Mixolydian, Dorian, Aeolian), and a fixed fifth-string drone. An optional string-band backing — guitar boom-chuck, upright bass, foot stomp — can ride underneath. Every note a Karplus–Strong plucked string — no samples. |
| IX | [FOLI](./foli/) | West African djembe & dunun ensemble — named in Maninka (Malinké), where *foli* means the rhythm, the playing itself. Eight named Mande rhythms (Kuku, Kassa, Djansa, Sunu; Dundunba, Tiriba, Mendiani, Soli) of interlocking parts — kariñan bell, three dununs, sékéré shaker, two djembe accompaniments — with a machine-composed lead djembe solo over the top. Mute any voice to hear the hole it leaves. Binary and 12/8 feels; struck-membrane and metal-bell synthesis, no samples. The bell timelines are canonical; the drum parts are idiomatic arrangements. |
| X | [NENIA](./nenia/) | Playground lore — named in Latin (*nenia*, the small jingle beneath literature). The universal children's chant, built on the sol–mi–la trichord. Eight games — taunt, counting-out, clapping, skip rope, ring, ball-bounce, hopscotch, arch — each a fresh nonsense rhyme generated from reduplication-and-ablaut, sung by a yard of detuned formant child-voices. Counting-out really eliminates and the arch really catches; clapping, skip rope and ball-bounce accelerate until the seed trips them. An optional *range* widens the chant from the trichord out to a full pentatonic. The URL hash *is* the rhyme. |
| XI | [KHÖÖMEI](./khoomei/) | Mongolian throat singing — named in Mongolian (*khöömei*, хөөмий, the pharynx itself). One synthesized voice holds a low drone while a razor-narrow resonance amplifies a single harmonic of it: a melody sung out of the drone's own overtone series, the scale fixed by physics. Three manners — khöömei, the piercing whistle *sygyt*, and the sub-octave growl *kargyraa* — with an optional morin-khuur (horse-head fiddle) drone-and-fifth beneath. Rich glottal source, cascaded high-Q bandpass whistle; no samples. |
| XII | [SPANNUNG](./spannung/) | A modular synthesizer — named in German (*Spannung*, voltage and tension both; *Steuerspannung*, control voltage), after the format Doepfer defined in Germany and the Berlin School that ran modular patches for the length of a side. A self-patching Eurorack rack: a master clock drives a sixteen-step sequencer through a quantizer into a voltage-controlled chain (VCO → VCF → VCA), a sample-and-hold throws a random line locked to the loop, noise and envelopes make the drums, an LFO drifts the filter — mixed out through dub delay and reverb into a four-bar loop. Cutoff, resonance, space, density and analogue drift are the controls; the rack draws itself, patch cables and all. |

## Shared grammar

- **space** = play/stop · **r** = another (aliud/encore) · **c** = cut 16-bit WAV
- Every work carries an expandable **“on this music”** panel — a short, plain-language
  history of the musical idea it renders.
- **Change it while it plays.** Where a work runs a groove — Rille and Scala, and
  Peal’s key and speed — the controls take effect on the fly: the music keeps
  running and re-vibes at the next bar rather than starting over.
- **The URL hash is the pressing.** Every parameter — seed included — serializes
  into `#…`. Copy the address and the exact opus reloads anywhere.
- Offline render: each work cuts a deterministic WAV of itself.
- iOS: audio requests the `playback` session (ignores the silent switch on
  Safari 17+); resumes across interruptions.

## Running locally

Open any `index.html` directly, or serve the folder with any static server.
GitHub Pages serves it as-is.

## Colophon

Vanilla HTML/CSS/JS. Canvas notation and visualizations are layer-cached;
render loops sleep when idle. `prefers-reduced-motion` respected throughout.

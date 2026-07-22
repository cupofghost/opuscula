# tritava — session threads

Development history for the `tritava/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

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


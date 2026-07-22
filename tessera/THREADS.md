# tessera — session threads

Development history for the `tessera/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### TESSERA — new machine, op. XVII (a self-predicting language model)
**Branch:** `claude/llm-machine-architecture-5ji49g` · **File:**
`tessera/index.html` · **Status:** done, verified headless (Chromium). New
op. Registered in `index.html` (card + counts), `README.md` (row + count),
`officina` (chip), `CLAUDE.md`/this file; counts bumped sixteen → seventeen
everywhere. **Renumbered XVI → XVII at landing:** SUBLOW landed as op. XVI
on `origin/main` while this was in flight, so per the claiming rule TESSERA
took the next numeral. `tessera/SPECULUM.md` (the design brief) deleted per
its own instruction — this thread is the fold-in.

A design-then-implement arc (GENESIS/HARMONIA precedent): answers the
maintainer's question — *what machine would an LLM like, translated into
something humans can experience?* The argued answer: the one aesthetic
channel a next-token predictor and a human ear genuinely share is
**expectation** — Meyer 1956 / Huron ITPRA / IDyOM's music-as-prediction is
the same loop as autoregressive sampling; tension IS surprisal. So the
machine *is* a language model, small enough to be exact and to hear.

- **The law is a real, exact language model** (`ENGINE-BEGIN…END`, pure,
  DOM-free, `window.__TESSERA`): a variable-order Markov model with
  **interpolated PPM-C blending** (`p_k = c/(n+t) + (t/(n+t))·p_{k-1}`,
  uniform base, no exclusion). Starts **empty**, learns **only from its own
  output**. Two coupled streams (pitch + duration), each its own model
  (duration order capped at `min(ORDO,2)`). Every token has p>0 always, so
  surprisal is finite. Sampling is tempered (`q ∝ p^(1/τ)`); **surprisal
  (−log₂ p) and entropy (−Σ p log₂ p) are taken from the UNTEMPERED p** — the
  model's true feeling regardless of how adventurous the sampling was told to
  be.
- **Exact forgetting** (`MEMORIA`): the sliding window keeps the last W
  tokens; `learn()` adds the K+1 observations a new token closes and, on
  overflow, removes exactly the K+1 the evicted front token anchored
  (context-start = the evicted position). **Verified bit-identical to a
  from-scratch rebuild on the last W tokens** at every W∈{32,128,512},
  K∈{1,2,4}. When a habit's support expires it is genuinely gone and its next
  occurrence re-surprises the model.
- **Every pressing is a completion:** the seed derives a forced 5-token
  prompt (uniform gamut pitches, durations from {2,4}), so the first event's
  surprisal is exactly log₂|A| — maximal, the first mark on a blank mind.
- **Zero ET:** pitches are JI degrees of a gamut (V/VII/XII, 5/7/12 tones,
  5-limit) over a single Hz literal, **196** (G); `f = 196·num/den·2^k`, k
  chosen by a deterministic nearest-in-log register fold (band 98–784). No
  `mtof`. ∅ (rest) is a real token that enters the context and is learned.
- **Controls ARE the phenomenology** (all law, none in TIMBRE): CALOR
  (temperature τ 0.4/0.8/1.3/2.2) · MEMORIA (32/128/512) · ORDO (1/2/4) ·
  GAMVT (the alphabet + entropy ceiling log₂|A|) · TEMPO. **Any law change
  regenerates the score** (path-dependent); if playing, the transport
  restarts from bar 0. TEMPO rides live (doesn't change tokens).
- **Voices:** VOX (2 detuned saws → per-note lowpass; surprise sets level,
  brightness, attack 45→4 ms, and vibrato — a confident note is soft/round,
  a surprised note cuts). NIMBVS — the halo: the top-4 untempered
  alternatives as sine tones, each gain ∝ its p, the cloud scaled by entropy;
  when the model is certain it falls silent. FVNDVS — a just drone (98 Hz +
  3/2). PVLSVS — a tactus tick whose level follows an EMA of entropy. Master:
  warmth shaper → glue comp → brick-wall limiter (−1.5 dB, ratio 20, the
  GONGAN/DIAMOND ceiling) → out trim; seeded IR (so the WAV is deterministic).
- **Scheduler machine** (RILLE-family `schedTick`, 40 ms, ~0.3 s lookahead,
  time-accumulator so live TEMPO changes apply forward). **Non-looping:** on
  reaching the cached end the generator *extends* (16-bar chunks, model state
  continuing) — the WAV cut is the first 64 bars (512 eighths) of an endless
  mind, deterministic. **NB the piece is ~3 min at default tempo, so the
  offline cut renders ~40 s** headless (same rate as RILLE's 120 s plate at
  ~60 s). Kept it fast by putting the reed formant on the vox BUS not
  per-note, skipping the vibrato LFO on calm notes, and capping the halo ring
  — do not re-add per-note formants.
- **Canvas — everything shown is a number the model actually computed:**
  left, the piece as a **mosaic**, one course per 2 bars, hue = gamut degree,
  lightness = surprise, ∅ = grout gap; the **MEMORIA window is visible** (in-
  window tiles lit, older tiles matte, a gold dashed line = the forgetting
  edge crawling behind the playhead); the page turns every 64 bars. Right, the
  live **posterior** as a labelled ratio ladder (chosen bar in teal) plus the
  entropy/surprise **sparklines** — the pressing's EEG. `prefers-reduced-
  motion` slows the redraw. Emblem: a mosaic of tesserae, one lit gold.
- **TIMBRE:** 27 params in 7 groups (master/room/vox/nimbus/fundus/pulsus +
  **sensus** = the surprise→sound mapping ranges — voicing, not law). Bridge
  verbatim; `TIMBRE.touch` ramps master/room/bus/formant live; `TIMBRE.demo`
  starts the transport (continuous-machine convention).
- **Verified headless** (`scratchpad/verify-tessera.mjs`, playwright-core +
  bundled Chromium, 46 checks): PPM distributions match hand-computed values
  and sum to 1; incremental counts + predictions equal from-scratch on last-W
  across all W/K; surprisal/entropy exact for every event; determinism (same
  hash ⇒ identical tokens; extend ⊃ direct-512); mean surprisal rises
  monotonically across the four CALOR stops; BREVIS forgets a learned bigram
  while LONGA keeps it; every freq = 196·num/den·2^k in-band with k=0 first;
  first-event surprisal = log₂|A| and ∅ never in the prompt; realtime runs,
  offline WAV cuts clean, hash round-trips, OFFICINA schema/set/bulk round-
  trip; zero pageerrors. Screenshot-checked (entropy sparkline visibly
  settles as the mind learns).
- **Pick-up ideas** (from the brief): CALOR annealing (τ on a slow seeded
  arc); a second voice whose context is the first's stream (a canon where the
  comes is an expectation of the dux); human-editable prompt tiles; a
  septimal gamut (7/4, 7/6) once the 5-limit voice is proven.


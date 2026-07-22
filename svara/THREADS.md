# svara — session threads

Development history for the `svara/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### SVARA — new machine, op. XXIV (South Indian Carnatic music: svara over the 22 shrutis)
**Branch:** `claude/carnatic-swara-shruti-machine-vs7xs0` · **File:**
`svara/index.html` (new, ~1250 lines); `svara/LAKSHANA.md` deleted per its
own instruction, outcome folded in below. **Status:** done, verified
headless (Chromium/playwright, 37 checks, zero page errors). New op.
Registered in `index.html` (card + counts), `README.md` (row), `officina`
(chip), `CLAUDE.md` + this file (counts + file table). **Renumbered
XXIII → XXIV at landing:** `ricercar/index.html` had already landed on
`main` claiming op. XXIII (see the RICERCAR threads below) before this
branch's rebase, so per the claiming-by-landing rule this took the next
numeral instead — `svara/LAKSHANA.md`'s own provisional-numbering caveat
anticipated exactly this. Implements the design brief essentially as
specified, one implementation session (build + verify + register) from a
prior session's brief.

- **The machine:** pick a **rāga** and a **tāla**; the machine performs a
  bounded concert item — a staged ālāpana (4 stages, tala-free, opens on
  the rāga's own prayoga) over a plucked tambura drone, a pallavi line
  elaborated through **4 cumulative sangati repeats** against a
  modal-synthesis mridangam, then a **korvai** cadence. Scheduler family
  (BOLG/FADÓ): `genAll(seed,params)` returns one flat, time-sorted event
  array scheduled whole at `play()` time (not a rolling lookahead), with
  a lap-boundary timer looping into a fresh pressing — same pattern
  FADÓ/RICERCAR already use.
- **Tuning: the 22-shruti grid, exact JI, zero ET, verified.** Ten comma
  pairs each exactly 81/80 by cross-multiplication (Kharaharapriyā ri
  10/9 vs Śaṅkarābharaṇaṁ ri 9/8 — the same svarasthāna, a pramāṇa shruti
  apart); Sa/Pa achala. `SA=196` the one Hz literal.
- **Melody: raga lakshana as a shared-lattice automaton.** One pitch
  lattice per rāga built from the union of its ārohana/avarohana
  pitch-class sets; `nextUp`/`nextDown` walk only the arohana/avarohana
  successor graph respectively — varjya (an absent pc is just never
  matched) and Bhairavi's bhāṣāṅga two dhas (D2 5/3 arohana-only, D1 8/5
  avarohana-only) fall out of the *same* walk with no special-casing,
  verified structurally. Five gamaka curve types (kampita/jāru/nokku/
  sphurita/orikkai) — every turning point an exact lawful shruti — built
  once in `genAll` as `[tOffset,freq]` keyframe arrays consumed **both**
  by the oscillator's `linearRampToValueAtTime` automation and by the
  canvas needle's interpolation, so the wheel shows exactly what plays.
  Tōḍi/Bhairavi's ga+dha are hard-coded never-plain (`kampitaSet`).
- **Rhythm: the korvai identity solved exactly**, `3T+2g=span` over every
  valid residue-class candidate, seed-picked; verified across all 8
  rāgas × 4 tālas × 3 gatis × 5 seeds (480 `genAll` runs) with zero
  violations. Sarvalaghu mridangam pattern density rises per sangati.
- **Voice is ākāram** (open "aa", no diction layer — a documented v1
  simplification, see pick-ups): sawtooth through 3 fixed vowel-formant
  bandpasses + breath noise; pitch is never TIMBRE, only formant/breath/
  envelope/kampita-depth-trim are. Mridangam's right head partials sit on
  Sa (the brief's Raman-harmonicity claim); tambura is 4 plucked strings
  (Pa·Sa·Sa·Ṡ, Hindōḷam substitutes Ma per the traditional
  accommodation) with a slow bloom LFO on the upper partials standing in
  for jvāri shimmer.
- **Canvas:** the 22-shruti wheel (rāga's swaras lit, live pitch needle
  reading the same curve keyframes the audio plays) + a tāla lane
  (aṅga-head kriyā symbols derived from the tāla's own cumulative aṅga
  lengths — one source of truth for both the audible tick and the
  visual) with an ālāpana-stage / sangati-count / korvai-3×-countdown
  header. `prefers-reduced-motion` disables the needle sweep and cursor.
- **Verified headless** (`scratchpad/verify-svara.mjs`, not committed):
  shruti table exact (22 entries, 10 pairs at 81/80, Sa/Pa pairless, all
  in [1,2)); every scheduled voice-curve frequency matches `SA×ratio×2^k`
  for a shruti of the active rāga (automaton legality, swept); korvai
  identity holds for all 480 combinations above; `genAll` byte-identical
  across two runs same seed; hash round-trips seed/rāga/tāla/gati/tempo
  on a fresh load; full transport smoke (play → AudioContext running →
  pause suspends → resume restores → stop) with zero page errors;
  OFFICINA bench mode announces the 6-group/24-param schema and a live
  `set` round-trips into `TP`; offline render is NaN-free and unclipped.
  A full-length offline cut of an ~85s pressing takes ~40s in this
  headless environment (many oscillators — tambura alone schedules
  hundreds of plucked partials) — slow but errorless, same "CUTTING…"
  pattern as FOLI/TAMBOUR/HOLLER's baked renders.
- **Pick-up ideas (not this session's call, from the brief's §15):**
  kalpana-swara solfège singing (needs a diction layer); the full
  72-melakarta wheel as a second mode; a violin shadow voice; neraval/
  eduppu off-samam entries; more rāgas; a tani āvartanam drum-solo
  section before the korvai.


# amadinda — session threads

Development history for the `amadinda/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### AMADINDA — new machine, op. XXVII (the Baganda royal log xylophone)
**Branch:** `claude/baganda-machine-lznafs` · **File:** `amadinda/index.html`
(new, ~950 lines) · `amadinda/OKWAWULA.md` deleted per its own instruction,
outcome folded in below. **Status:** done, verified headless
(Chromium/playwright, 36 checks, zero page errors). New op. Registered in
`index.html` (card + counts), `README.md` (row + count), `officina` (chip),
`CLAUDE.md` + this file (counts + file table). **Renumbered XXIII → XXVII
at landing:** the brief called itself "op. XXIII (provisional)"; by this
rebase RICERCAR (XXIII), SVARA (XXIV), ŠIYÓTȞAŊKA (XXV), and TENEBRAE
(XXVI) had all landed first — per the claiming-by-landing rule this took
the next free numeral, XXVII; the directory name (`amadinda`) keeps.
Implements the design brief below essentially as specified, one
implementation session (build + verify + register) from a prior session's
brief.

- **The machine:** two seeded parts, **okunaga** (even pulses) and
  **okwawula** (odd pulses), interlock in strict alternation, both always
  struck as parallel octave pairs (key *k* and *k*+5); a third part,
  **okukoonera**, is never composed — it is derived mechanically at
  generation time from whichever combined pulses land on keys 1–2,
  duplicated two octaves up onto the amatengezzi keys 11–12. Controls:
  CYCLE (empagi) 12/18/24/36, MUKO I–V, ENSEMBLE (amadinda bars / entenga
  drum chime), TEMPO (combined strokes/min), SEED. Entries stagger over
  the first three cycles at play (okunaga alone → +okwawula → +okukoonera),
  matching the court practice; tempo/muko/ensemble/seed changes re-vibe at
  the next cycle boundary rather than restarting the transport.
- **Tuning: exact 5-TET, zero just intonation** — `f = BASE·2^((k−1)/5)`,
  `BASE = 122 Hz` the one Hz literal (implementer's choice within the
  brief's 110–150 range, low enough to read as log bass). Verified:
  adjacent keys exactly 2^(1/5) apart, key *n* and *n*+5 exactly 2:1, the
  BASE=122 reference table matches the brief within rounding.
- **The interlock law and its search, verified structurally.** Okunaga is
  a seeded contour walk (steps −2…+2 taxed toward ±1, folded at the
  degree range edges) built as 2–3 phrase segments with 1–3-degree
  variations per repeat, per the brief's §4.3. Okwawula is chosen from
  K=64 candidate walks scored against low-band density ∈[0.25,0.50] and a
  no-stutter cap (run ≤3), plus a soft emergence score (per-band
  autocorrelation at N/2 and N/3, rewarding at least two distinct
  inter-onset intervals) — implementer's own scoring, not specified
  exactly by the brief. **One addition beyond the brief's literal K=64:**
  the hard density constraint is checked across **all five muko
  rotations at once**, not just the canonical orientation, so that
  transposing the same generated piece can never produce an out-of-range
  okukoonera density — the brief's own acceptance test #5 says the
  constraint must hold "for every pressing," which a canonical-only check
  cannot guarantee. K=64 alone leaves ~1% of (seed,N) canons unable to
  find an all-rotation-valid candidate; rather than growing K arbitrarily
  (diminishing returns, measured out to K=1024), a bounded single-position
  local-search repair (≤500 tries, hill-climbing the rotation-violation
  count) fixes the rest — measured 0 failures across 8000 pressings (200
  seeds × 4 cycle lengths × 5 miko × the density+stutter check), repair
  triggered on ~4% of canons, the honest last-resort level never reached.
- **Miko is a pure post-hoc transposition, verified exact.** The
  canonical search runs once per (seed, cycle length), independent of
  muko; `genAll` adds the shift mod 5 to both parts' degrees afterward —
  verified the transposed degree sequence equals the original's +k mod 5
  exactly, for both parts, across 20 seeds × 4 lengths × 4 non-zero miko.
  Okukoonera is then re-derived from the *shifted* combined stream (always
  watching final keys 1–2, per the brief's §4.4), so the same underlying
  piece genuinely yields five different emergent patterns.
- **Voices: two buffer-baked bodies, FOLI/TAMBOUR family, on a live
  RILLE-style lookahead scheduler** — not a single pre-mixed performance
  buffer, since the brief calls for live boundary re-vibe on tempo/muko/
  ensemble/seed changes. `buildKits(ctx,seed)` bakes 12 one-shot buffers
  per voice (amadinda free-bar slats at 1:2.76:5.40 partials, no
  resonators; entenga membrane at 1:1.5:2:2.9 with a fast pitch drop) —
  cheap enough (<5ms for 24 buffers) to rebake fresh at every `play()`/
  `cut()` call and whenever the seed changes at a cycle boundary (the
  per-key detune in `tuning.spread` is seed-derived), which is also what
  makes "no mid-play rebake on a TIMBRE edit" fall out for free: a running
  session's kit only changes at the next fresh `play()`.
- **Transport verified:** staggered entries land on cycles 0/1/2;
  play/pause/stop/another clean (pause suspends/resumes the
  AudioContext); a muko change mid-play is picked up at the next
  boundary without restarting; part mutes (session-only, keys 1/2/3, not
  hash-serialized per the brief) gate scheduling live. Stop lets the
  already-scheduled cycle finish (no fade, no ritardando — the tradition
  is dry and abrupt) before closing the context.
- **Cut:** offline render targets ~48s (1+1 entry cycles then full
  cycles), NaN-free, non-silent, deterministic across two renders same
  seed. **One implementer addition:** a `DynamicsCompressor` limiter alone
  measured peaks up to ~1.06 on dense multi-voice transients (attack time
  not always beating a hard mallet click), so `cut()` also
  deterministically normalizes the rendered buffer to its own measured
  peak if it exceeds .92 — guarantees the brief's ≤.92 target exactly
  without depending on compressor quirks, and preserves full determinism
  (the scale factor is itself a pure function of the already-deterministic
  buffer).
- **TIMBRE/OFFICINA:** 6 groups, 31 params (master, bars, mallet, drums,
  balance, tuning & room) — close to the brief's "~28" estimate. Bridge
  copied verbatim from FORFEX. Live-rampable: master level/drive/comp,
  the three balance gain taps, room send. Bars/mallet/drums partials and
  decays, and tuning spread/room size, only matter at the next bake —
  which every `play()`/`cut()` already does from current `TP`, so no
  separate dirty-flag/debounce bookkeeping was needed at all.
- **Canvas:** the interlock wheel (the brief's own term) — 2N pulse slots
  around a ring, radial position encoding degree (five tracks), okunaga/
  okwawula in two inks, ember rim sparks on every combined pulse landing
  on keys 1–2 once okukoonera has entered, a rotating ember playhead.
  `prefers-reduced-motion` disables the sweep/playhead and stops the
  render loop from re-arming.
- **Verified headless** (`scratchpad/verify-amadinda.mjs`, not committed):
  tuning table exact; 800 generations (40 seeds × 4 lengths × 5 miko)
  checked for strict alternation, octave pairs, key range, and an
  independent recomputation of okukoonera matching the engine's own
  derivation exactly; miko exactness over 20 seeds × 4 lengths × 4 miko;
  density/no-stutter hold for 500 seeds × 4 lengths × 5 miko (10,000
  pressings) with zero violations; `genAll` byte-identical same seed;
  hash round-trips seed/cycle/muko/ensemble/tempo; full transport smoke
  (staggered entries, pause/resume, live muko re-vibe, mutes, stop,
  another); OFFICINA bench announces the schema and live `set` round-trips;
  lock-screen context survives a simulated visibility event; offline
  render NaN-free/non-silent/peak-safe/deterministic; `cut()` produces a
  real downloadable WAV. Screenshot-smoke-tested light/dark and both
  ensembles at N=24/36 — zero page errors in every run.
- **Pick-up ideas (from the brief's §15, not this session's call):** an
  AKADINDA sibling mode (17 keys, two okwawula players, triple interlock);
  transcription presets from the named classics' public-domain notation;
  a "listen like a Muganda" toggle isolating one inherent-pattern band at
  a time visually while the audio runs; an ennanga harp voice; the 5-TET
  tuning table as a cheap fourth OP–XY path-A demo.

### AMADINDA — design brief for a new machine (Baganda equipentatonic interlock)
**Branch:** `claude/baganda-musical-machine-fckn1r` · **File:** `amadinda/OKWAWULA.md`
(design brief — no machine code, no registry rows of its own). **Status:**
shipped as op. XXVII — see the AMADINDA thread at the top of Open threads
for the implementation record; this brief is deleted per its own
instruction. Per the design-brief convention this claimed the **concept
and the directory `amadinda/`, not the op. number** — XXIII was
provisional and moved three times before landing (see above).

- **The machine:** the Baganda (Buganda, Uganda) royal amadinda xylophone —
  two seeded parts (okunaga/okwawula) interlock in strict alternation and
  parallel octaves; the third part (okukoonera, the amatengezzi keys) is
  **derived mechanically from the other two**, never composed; at speed the
  combined stream splinters into Kubik's *inherent patterns*. Controls: cycle
  length (12/18/24/36), MUKO I–V (the five exact transpositions), ensemble
  (amadinda bars / entenga drum chime), tempo, seed.
- **Tuning law: equipentatonic (5-TET, 240 ¢ steps)** — `f = BASE·2^((k−1)/5)`,
  one Hz literal. Second deliberate non-JI machine after TRITAVA; the equal
  division is the tradition's own documented ideal (Wachsmann's measurements;
  the miko transpositions only work because steps are equal) — stated honestly
  in the brief and to-be reader notes. Terminology flag: the request said
  "equiheptatonic," but the Kiganda tuning is equi*penta*tonic (7-equal is the
  Thai/Khmer idealization); the brief records this and designs on 5.
- Brief follows the `diamond/GENESIS.md` house format: grounding, tuning law,
  interlock/generation law (okwawula chosen by a deterministic candidate
  search scored for emergent-pattern quality), performance arc, voices
  (buffer-baked, FOLI family), TIMBRE sketch, canvas wheel, gotchas
  (verbatim OFFICINA bridge — the FADÓ crash lesson; lock-screen pattern from
  day one), considered-and-rejected, a 11-point verify gauntlet, registration
  checklist, pick-ups (akadinda triple interlock, OP–XY path-A demo).


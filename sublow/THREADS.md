# sublow — session threads

Development history for the `sublow/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### SUBLOW — new machine, op. XVI (dubstep / sound system music)
**Branch:** `claude/dubstep-machine-scaffolding-jcz8a9` · **File:**
`sublow/index.html` (`sublow/NOTES.md`, the build brief, deleted per its own
instruction once implemented — RILLE/DIAMOND precedent — this thread is the
fold-in) · **Status:** done, verified headless (Chromium). New op. **Landed as
op. XVI, not XV** — DIAMOND landed first while this branch was still
unlanded, so it renumbered at rebase per the claiming rule below. Registered
in `index.html` (card), `README.md` (row), `officina` (chip), CLAUDE.md and
the file-structure list above; counts bumped fifteen → sixteen everywhere.

Two-session build: the scaffolding session did sound design, composition spec
and UI (per the now-deleted `sublow/NOTES.md`); this session implemented the
engine, audio graph, canvas dynamic pass and verify against that brief, then
rebased past DIAMOND's landing and registered it.

- **The idea.** Dubstep as born in Croydon (~2000) and deepened at DMZ/FWD>>
  (~2005). Three load-bearing laws: (1) **the sub-bass is the lead** — the tune
  lives in the low end, everything above is atmosphere/rhythm; (2) **halfstep**
  — 140 BPM but the snare cracks *only on beat 3* (`SNARE_STEPS=[8,24]`), so it
  moves at 70 while hats tick 140, the space is the point; (3) **the bass
  talks** — a resonant lowpass swept by a **tempo-locked LFO**, rate = rhythmic
  division × bpm/60 (verified exact: div 1/2/3/4 at 140 bpm → 2.333/4.667/7/
  9.333 Hz). The wobble is *rhythm*, not vibrato. Plus sound-system culture:
  the dubplate, bassbins as the instrument, the dub siren, and **PULL UP** —
  the rewind, spins back then lands the next scheduled bar on the drop
  (bar 17) without restarting the transport.
- **Name** SUBLOW — London pirate-radio's word for the bottom octaves; the
  machine speaks sound-system English (run it / pull up / cut a dub).
- **The engine (`genAll`, seeded, deterministic):** `makeBass` walks a 2-bar
  riddim from a weighted degree pool (root-biased), note 1 always root on the
  downbeat; `makeDrums` builds the halfstep kit (kick always includes step 0,
  extra kicks never land on the snare's [8,24]); `makePad` writes 8 breaths
  alternating i/♭VI, **third-less by construction** (root·fifth·octave·
  optional-ninth — verified: no chord tone sits a 3rd/4th above its own chord
  root, checked relative to the shifting root, not the tonic); `makeLead`
  (EAST only) writes a 4-bar call/response in the hijaz-flavoured mode, landing
  each response on root or fifth; `makeArrange` fixes the 64-bar form (INTRO/
  BUILD/DROP A ×2/BREAK/DROP B ×2/OUTRO). **DROP B reuses `bassB`** — same
  notes, talk bumped +1 (capped 3), ghost snares 1.5× hotter — "same tune,
  more chat," not a new composition.
  Deliberate deviation from the brief: **tempo is NOT folded into the RNG
  seed** (the brief's contracted signature keeps `bpm` as a parameter, but
  composition ignoring it is the better call) — dragging the tempo slider
  re-times the same riddim rather than rerolling it; the wobble LFO and
  scheduler both read `st.bpm` live, so a tempo change re-vibes the next bar
  with no regeneration and no restart. Mood/talk/seed edits DO regenerate and
  hand the new score to the running scheduler (`RT.g=st.g`), same convention.
- **The audio graph:** single-deck (no crossfader — this isn't a DJ mixer like
  RILLE), master pre→shaper→4:1 comp→out-trim→destination, `G.floor` hiss tap
  post-comp. Duck bus carries **only sub+pad** (kick env dips them; wob/kick/
  snare/hats/perc/lead/fx are unducked, per the brief). **Wobble has no
  separate mixer channel** — `vWob` sums into `G.part.sub` (through its own
  highpass at the 110 Hz crossover) because the user perceives "the bass"
  (sub+talk) as one fader; the mute strip only has 8 buttons (`PARTS`), not 9.
  Sub chain lowpassed at the crossover as a safety net (it's already ~sine).
  All 12 voices (`vSub vWob vKick vSnare vHat vShaker vPerc vPad vLead vSiren
  vRiser vSpinback`) read `TP` at schedule time. `saveWav`/`encodeWav` copied
  verbatim from RILLE (HANDOFF flags this as a repeat gotcha — two earlier
  machines shipped without it).
- **Canvas — the stack:** a wall of speaker cabinets (scoop subs / kick bins /
  horn tops) + LED strip + a riddim lane drawing the 2-bar bass phrase *as the
  wave it speaks* (period = wobble division, dive = tail dropping toward the
  x-axis). Dynamic pass while playing: sub-cone excursion keyed to the
  sounding note's own wobble phase, a horn flash ~200 ms after each beat-3
  snare, an LED VU that goes red-hot only in the drop sections, and a lane
  playhead. `prefers-reduced-motion` → playhead only, no cone/LED motion (the
  static wall + lane redraw is cached; the dynamic pass is a plain rAF loop
  gated on `st.playing`, no separate offscreen layer needed since it's cheap).
- **Verified headless** (Chromium, playwright-core, `--autoplay-policy=
  no-user-gesture-required`): engine invariants across 5 riddims × 4 talks ×
  30 seeds (deterministic, note-1 fixed, snare fixed, no kick-on-snare,
  fundamentals fold ≥ `SUB_FLOOR`, pads third-less, DROP B talk-bump, lead
  EAST-only, arrange length 64); wobble-rate math exact; realtime transport
  runs and PULL UP survives; every one of the 8 mixer parts audible solo
  (including EAST's lead and the FX bus's siren/riser — the first solo pass
  missed those because it only probed bars with no FX events, a test-coverage
  gap, not an engine bug); 64-bar offline cut NaN-free, peak ≈0.70 (no clip,
  real headroom under the 1.0 ceiling), head energy present after the
  loop-tail fold; OFFICINA schema (55 params / 11 groups) + live `set`/`bulk`
  + localStorage overlay + `?factory` bypass all round-trip; hash v1 restores
  mood/talk/bpm/mask/seed. **64-bar cut takes ~50 s wall-clock** in this
  sandboxed headless environment (≈110 s of audio) — consistent with RILLE's
  own noted precedent ("120 s plate cuts in ~60 s — fine"), not a regression.
  Zero non-environmental console/page errors (only the sandboxed Google-Fonts
  fetch, present on every machine).
- **Pick-up ideas:** a stereo-width treatment above the crossover (sub stays
  dry/mono/centre by law, but wob/pad/lead currently render mono too — could
  widen them without touching the low end); a second EAST-style lead mood; the
  `'stab'`/`'thin'` pad kinds (DUNGEON/STEPPA/WOBBLE) are simpler than the
  `'drone'` swell (short offbeat shells / fifth-only respectively) — could use
  their own OFFICINA-exposed envelope shaping if the maintainer wants more
  contrast between sessions on the bench.


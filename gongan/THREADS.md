# gongan — session threads

Development history for the `gongan/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### GONGAN — new machine, op. XIV (Central Javanese court gamelan)
**Branch:** `claude/new-machine-design-y66pvl` · **File:** `gongan/index.html` ·
**Status:** done, verified headless (Chromium). New op. Registered in
`index.html` (card), `README.md` (row), `officina` (chip), CLAUDE.md and the
file-structure list above; counts bumped thirteen → fourteen everywhere.

Cyclic-time engine on the FOLI/TAMBOUR skeleton (prerender → one master
buffer → realtime loop + offline WAV, identical graph). Design:

- **The law is the cycle.** A `FORMS` bentuk fixes the colotomy exactly
  (0-indexed beats): lancaran 16 (kethuk on the odd marks, kempul 6/10/14
  with wela at 2, kenong 4/8/12/16), ketawang 16 (kethuk 2/6/10/14, kempul
  12, kenong 8/16), ladrang 32 — canonical Solonese placement, enumerated in
  the verify script. Gong on the last beat; lancaran carries balungan
  *nibani* (tone every 2nd beat), the others *mlaku*.
- **Laras = this machine's own embat** (stated in the reader notes — no two
  gamelans agree, so a fixed house tuning IS the authentic move): sléndro
  steps 228/245/238/232/257¢, pélog 120/150/285/115/115/165/250¢, cents
  tables in `LARAS` (engine, NOT in TIMBRE — tuning is law, not voicing).
  Registers: demung base (sléndro 140 Hz / pélog 153, tumbuk nem aligned),
  saron ×2, peking ×4, bonang ×2/panerus ×4, kempul ×.5; gong suwukan =
  alt-tone/2, gong ageng = gong-tone/4.
- **Pathet** per laras (`PATHET`): sléndro nem/sanga/manyura, pélog
  lima/nem/barang (barang swaps tone 1 for 7; tone 4 never sounds — noted
  as sorogan territory). Each carries sèlèh weights + gong & alt tones.
- **The composer** (`genAll`): seeded sèlèh per kenong segment from the
  pathet weights, then a stepwise walk (gantungan hangs, rare leaps, bias
  toward the target growing as the segment closes) landing exactly on each
  sèlèh. **Gongan A ends on the alt tone (rung on gong suwukan), gongan B
  on the pathet gong tone (gong ageng)** — the piece only fully lands the
  second time round.
- **Garap is derived, never stored** (`assemble`): peking nacah (aabb; at
  higher irama abab·aabb), bonang barung pipilan (abab across the coming
  pair) dropping to octave **gembyang** on pairs that carry a kenong sèlèh,
  panerus at ×2 density, simplified kendhang-kalih token grids per form
  (`KENDHANG`, 2 slots/beat, b/u/t/k). **Irama I/II/III** doubles beat
  duration AND elaboration density (2/4/8 per beat, panerus ×2) — verified
  ratios exact. `bpm` (laya 60–132) is the irama-I walking pace.
- **The damping hand:** saron-family + bonang events get `cut` = time to
  the same instrument's next stroke +50 ms; `mixHit` fades the last 40 ms.
  Gembyang is ONE event (`oct:true`, dedicated `bonangO` dyad buffers) so
  zero-delta cuts can't occur.
- **Bronze synthesis:** bars = fundamental + free-bar partials (×2.76,
  ×5.40) in pairs detuned ±pairDet/2 (the shimmer), one model at three
  register decays (demung 1.5× / saron 1× / peking .65×); kettles add a
  half-frequency hum + strike bend; kenong beats slowly between paired
  modes (waver); **gong ageng = two modes `f0` and `f0+ombak` Hz beating at
  the ombak rate** under a slow bloom; kethuk deliberately dull. Loop fold
  carries the gong's long ring across the seam (tail = gong decay×2.4).
- **Canvas:** left, the gongan as a **wheel** (colotomic glyphs on the rim —
  G double-ring, N filled, P open, t tick — cipher numerals inside, sweeping
  arm, gold gong flash that persists across the seam); right, both gongan in
  **kepatihan** cipher with structural letters above and the gong tone
  circled, sounding beat underlined. Static layer cached offscreen, rebuilt
  only when the sounding gongan flips (`SHOWN_G`).
- **TIMBRE:** 43 params in 9 groups; touch = master/wet live, baked edits
  apply on the next play (no mid-cycle restart, per the ► HEAR convention),
  and `TIMBRE.demo(group)` auditions each voice freshly baked — the gong
  demo sizes its buffer to the ring (`decay*1.4+2 s`) so the ombak
  breathes. Bridge verbatim incl. the demo op.
- **Verified headless** (`scratchpad/verify-gongan.mjs`, playwright-core +
  bundled Chromium, 32 checks + a per-voice solo probe): colotomy tables
  canonical; 720 pressings (3 forms × 2 laras × 3 pathet × 40 seeds) —
  tones always in pathet, nibani rests honoured, kenong beats carry their
  sèlèh, A→suwukan/B→ageng; assemble + renderMaster deterministic; irama
  doubles duration and density exactly; render NaN-free, peak-normalised,
  head energy present after the fold; realtime ctx runs; hash round-trips
  on a fresh load; offline cut + WAV encode clean; OFFICINA set/bulk
  round-trip; every voice non-silent solo; zero pageerrors.
- **Pick-up ideas:** a *ngelik* section (high-register B gongan) instead of
  the current A/B variation; irama transitions while playing (the accel/
  rit between levels is the live tradition's drama — needs a scheduler
  rather than the prerender skeleton, or a rendered transition segment);
  gendér/gambang floating voices; a suwuk (composed ending) for the WAV
  instead of the ring-off.


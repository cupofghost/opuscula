# rille — session threads

Development history for the `rille/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### RILLE — harmony recomposed on the LAMENTO GROUND (a tradition with rules)
**Branch:** `claude/rille-edm-aesthetic-fix-m3nik7` · **Files:** `rille/index.html`
only (engine + display + reader notes; UI shell, drums, mix chain, TIMBRE,
judge bridge protocol all untouched). **Status:** done, verified headless
(Chromium, 796 checks + URTEIL bridge smoke, zero page errors; all 7 moods
render NaN-free, peaks ≤ .92). Awaiting maintainer URTEIL listening.

Maintainer mandate: *"fix RILLE once and for all — use a fitting music
tradition or something with rules already in place; minimal aesthetic, EDM
vibe"* (reference track: Isla Den "keepOn" — dreamy melancholic-euphoric).
The chosen tradition: the **descending-tetrachord ground bass (lamento)** —
8·♭7·♭6·5, the codified Western language of longing (Monteverdi/Purcell)
*and* the harmonic skeleton of melancholic EDM. Design honours the standing
"small over sweeping" lesson by replacing only the harmony *generator* every
complaint traced to, keeping everything rated good (beats, mix, arp figure,
cadence voicings, JI system):

- **`buildHarm` rewritten:** the weighted-random hover pool (the "aimless"
  root cause) → a deterministic 8-bar ground cycle ×8. Texture is the
  *Lamento della Ninfa*'s own: the mood's minor-9 `hov` shape **held above
  while only the bass falls** (i → i/♭7 → i/♭6 → v), so the arp never
  touches a major chord tone — the only major left anywhere is the granted
  V7. Ungranted cycles end on the open sigh (minor-9 hanging over the
  dominant bass, no leading tone); every `cad` bars the existing charged
  treatment fires (V7sus → V7, 4-3 suspension, raised leading tone) and the
  **next cycle's downbeat blooms** (`tonic` swell) before the fall resumes.
  `half:true` = charges but hangs, as before. Per-bar `bassOff` carries the
  descent; JI (`jf`) re-tunes every upper tone against the walking bass, so
  the same figure is re-coloured at each step.
- **Divisions (the tradition's cure for "sounds like a repeat"):** `genAll`
  now builds `g.arpDivs` — 8 per-cycle variants of the shaped figure on an
  intensity arc `[0,1,1,2,2,3,2,1]` (density + octave-lifted peaks + vel),
  trim positions re-rolled per cycle from the seed. Also the EDM build.
- **Dorian removed** (DAWN/UNDERTOW → Aeolian): 9/9 "no — too major" in the
  last URTEIL batch; the raised 6th was the structural smuggler the old
  HARMONIA brief named. Warmth now carried by the thirdless sus9 voicing.
- **EISEN:** owns the **passus duriusculus** (chromatic fall, 1 bar/semitone,
  cad:0 — grief with no release; "the harsh passage", so harshness is now
  structural, not accidental). Folded in the unmerged `b1e0354` fix:
  `HOVER_SHAPE.cluster` gets its 4th tone `[0,6,13,18]` (the idx-wrap
  repeated-peak bug). **If branch `claude/rille-snippet-ratings-o62zyv` is
  still unlanded, this supersedes it** (its other fix — Dorian predominant —
  is moot: no Dorian, no pool-based predominant).
- **PROGS simplified 8 → 4** (OWN / LAMENTO / CHROMATIC / OPEN), per the old
  brief's "simplify the input layout". `kind:'maj'` + `MAJ_SHAPE` kept but
  currently unreachable (judge-bridge maj swap = harmless no-op, noted in
  code). `chordQual`/`voiceAt`/`poolDegs`/`chordLetters` removed;
  `groundLetters` shows the bass descent. All moods `follow:true` now except
  none — VOID's drone re-sounds per bar so even it walks the descent; BASS
  HOLDS chip still pedals the tonic (descent then lives in the JI relations).
- **Drop fixes (maintainer: "fix the kicks and other notes dropping"),
  follow-up commit:** the four-on-the-floor is never thinned anymore — the
  random fill kick-drop (`fill && s===12 && rng()<.3`) and VOID's baked-in
  40%-chance missing fourth kick are both removed; BRUCH (the kick+bass
  break) goes 22%→10% chance and 4→2 bars (riser length now follows
  `arr.frac`), and never fires under `JUDGE_FULL` — an URTEIL snippet
  auditions the melody, not arrangement luck. This also resolves the
  DARKNESS "cuts out too much / sounds broken" thread's leading hypothesis.
  Verified headless: kick pattern complete across all moods × 40 seeds,
  BRUCH ≈ 9.9% of phrases at exactly 2 bars, zero breaks in judge mode,
  full suite still 796/796, zero page errors. **Landed on `main`** (both
  commits pushed at the maintainer's request).
- **Open:** needs URTEIL listening. Watch for: ♭6-step composite reading
  "too lush/major" (minor-9 over ♭6 bass = ♭VImaj9 colour — if flagged,
  darken that step's upper structure first, don't rewrite); whether the
  divisions arc is audible enough.

### RILLE — reverted to pre-recomposition · English-first UI · reworked arp · URTEIL harness
**Branch:** `claude/rille-major-chords-a6pm9r` · **Files:** `rille/index.html`
(reverted to `e9846ec` + judge bridge + English-first UI + reworked arp + the
cohesion sweeps' icon links & officina pill grafted back), `rille/judge.html`
(new, backstage — like `officina`, NOT an op.). **Status:** done + verified
headless; **landed on `main`** (rebuilt on latest main so tessera/khoomei/fadó/
germen and the icon+pause+officina-pill sweeps are all preserved — only RILLE's
tonal content reverts, per the ⚠ marker below).

- **Revert:** the recomposition (`c685fc6`) + its dub-techno-stabs follow-up
  (`a271100`) were judged worse than the version before them; RILLE's tonal
  content is back at `e9846ec`. Both stay in git, recoverable.
- **English-first UI** (maintainer: "make everything English, keep the German in
  parens underneath"): mood names via `MOOD_EN` (DARKNESS (Finsternis)…), modes
  via `MODE_EN` (Phrygian/Aeolian/Dorian), sections via `SEC_EN`, every control
  label / ledger / cut-note / hint / keys line. Code ids/keys stay original; the
  German `name` still drives WAV filenames + the parenthetical. Strip is
  English-only (too small). `judge.html` translated; verdict tokens yes/maybe/no.
- **Arp rework** (maintainer: "aimless, no emotional weight, no good resolve"):
  the old generator walked chord tones in a fixed dir and dropped notes at random
  (no motif, nothing landed). Now a SHAPED 2-bar figure — arc to a peak, sigh
  home, **resolve to the root on a long held note** — deterministic rhythm grid
  trimmed by mood density, `dir` sets climb/fall/arch, transposes over the i→iv
  changes. Added optional **per-note length** (`a.len`, engine + `vArpN`; default
  2.4 = old behaviour) so the resolve can sustain; nudged `arp.lvl` .24→.3.
- **URTEIL training tool — simplified to a rapid rate-loop** (maintainer: "too
  complicated… make it more immediate. Just generate parts I can rate… start at
  the melodic section, no lead-in every time"). `judge.html` no longer shows the
  full machine (the engine iframe is hidden offscreen); it's now Next → rate
  (YES/MAYBE/NO, auto-advances) with an optional mood focus + note, results
  copyable as JSON (localStorage `…urteil.v3`). Each snippet is a fresh random
  pressing that **starts already-full** — new `?judge` bridge op `snippet` sets
  `JUDGE_FULL=true`, which `startPlay` reads to force `arr.active` full / section
  VOLL from bar 0, so it drops into the melodic part with no intro build.
  `JUDGE_FULL` stays false for normal play (verified: intro preserved). Also
  linked from RILLE's colophon ("urteil · training" → `judge.html`).
- **Passing-major knob** (still available via the `apply` bridge op): swaps
  `MAJ_SHAPE` live (the `kind:'maj'` glint), length-safe; the resolving 5/4
  leading tone stays.
- **Chat-based training:** short A/B WAVs rendered via RILLE's offline path
  (`scratchpad/render-*.mjs`) — soloed arp before/after, and MAJ_SHAPE candidates
  — sent for by-ear verdicts (the deployed judge tool is the better path now that
  it's on main).
- **Open feedback:** maintainer still dialing the arp by ear (first shaped
  version may resolve too predictably / want more climb, space, or darkness — all
  now adjustable via the grid/shape arrays + `len`). Verified headless
  (`scratchpad/verify-i18n.mjs`, `verify-judge2.mjs`, `verify-plain2.mjs`): plays
  clean, English+German labels render, judge bridge inert without `?judge`,
  MAJ_SHAPE swap live, arp is a 9-note shaped figure. Registry files
  (landing/README/officina) untouched.
### RILLE — tonal recomposition IMPLEMENTED (from `rille/HARMONIA.md`, now deleted)
**⚠ REVERTED** — the maintainer judged this "worse than a day ago"; RILLE was
reverted to `e9846ec` (pre-recomposition) on `claude/rille-major-chords-a6pm9r`
(see the top RILLE thread). Both the recomposition (`c685fc6`) and the parallel
dub-techno-stabs follow-up (`a271100`) are kept in git, recoverable. The
write-ups here are the record of what was tried.
**Branch:** `claude/harmonia-handoff-tlncw8` · **File:** `rille/index.html` ·
**Status:** done, verified (Node structural sweep + headless Chromium smoke);
pushed. The self-contained brief `rille/HARMONIA.md` was the spec; it's deleted
now that the work is in — the reasoning survives here and in the commit message.

**Follow-up (maintainer ear-check: "still sounds doofy — the arpeggio, all
moods"):** the running broken-chord arpeggio was the culprit — a metronomic
index-walk cycling root-♭3-5-9 (up/dn/ud/rnd per mood) read as a cheesy
trance/eurodance arp, plus a low/muddy register and the TRÄNEN octave "reach"
plink. **Replaced the arpeggio with sparse dub-techno chord STABS:** the
hover chord is now struck as an open shell of the bar's shape (the shape minus
its top 9/4, so it stays dark/grounded; `quint` bars stab a bare fifth) on the
OFFBEAT 8ths only (EISEN also takes the on-beats for its industrial cluster),
one-ish to a bar with space around it, lifted into the stab register
(`foldSwellHz(barRootHz)×2`) via `vChord` — no melodic contour, no running
line, no octave pop. `g.arpSeq` is now `{s,vel}` stab positions (was
`{s,idx,oct,vel}`); the canvas step-mask still reads it unchanged. Deleted:
the `vArpN` pluck voice, the `arp` TIMBRE group (43→**40 params**), and the
dead `rate`/`dir`/`reach` mood fields (`arp:{}` now just `{dens}`). `vChord`
gained an optional `velMul`. Reader-notes + TIMBRE doc updated (stabs, not
arps). The tuning/harmony/cantus/cadence laws are untouched — only the hover
*voicing* changed. **Verified:** Node structural sweep 25/25 (item 8 rewritten:
stab events carry no melodic-walk fields, sit only on offbeats, counts stay
sparse — never a running arp) + a headless-free **runtime mock**
(`scratchpad/verify-rille-runtime.mjs`, minimal Web-Audio stub) drives the real
`buildGraph`/`makeDeck`/`scheduleBar` across all 7 moods × 3 Lösungen over 64
bars: no exceptions, zero NaN/Inf to any oscillator or param, 25k+ oscillators
live. **ENV NOTE for the next session:** Playwright's default `headless_shell`
Chromium is currently crashing the node process on `.launch()` in this sandbox
(silent, no output) — the full `chrome` binary at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` launches fine, so pass
`executablePath` to it (the verify scripts already do); and the audio-graph
runtime is better checked with the Web-Audio-mock runner than a live render
anyway. Still worth a maintainer ear-check that the stabs read as dub-techno,
not the old arp.

Reworked RILLE's whole tonal path per the maintainer's mandate: **no major
moods or vibes** (major only ever to resolve minor progress), no goofy plinks,
simplified input, and **just intonation end to end**. What shipped:

- **Majors abolished from hover.** Kind `'maj'`, `MAJ_SHAPE`, the ascending
  glint, kind `'pre'`, `PROGS`, `harmRecipe(M,P)` and `voiceAt` are gone.
  Major-quality hover degrees (♭VI/♭VII/♭II) are now voiced **thirdless**
  (`quint` = 1/1·3/2·9/4) — 1–2 bars, passing colour, dark. The **only 5/4 in
  the machine** is the raised leading tone (`dom7` shape) on one cadence bar,
  which is 15/8 over the tonic — the just leading tone. Both are mechanized in
  the verify's "5/4 audit".
- **Cadence = lament tetrachord.** Last 8 bars of a `cad` span: bass walks
  1→♭7→♭6→5→1 (`desc`·16/9 ×2 → `desc`·8/5 ×2 → `dom7sus` → `dom7` → `bloom`
  ×2), the 4-3 suspension resolving across the two dom bars, the leading tone
  raised for exactly one bar. The 2 hover bars before each window are forced to
  degree 0 (the "8" the tetrachord descends from); the 8 bars before lean off
  the tonic (weights ×1.5). `half` deleted — non-landing moods get `loesung:0`
  (NIE, cad 0, no dominant ever).
- **Two-level JI lattice, no comma drift.** Every tonal freq is
  `f = tonicHz × DEG[deg] × SHAPE[k] × 2^n`, `tonicHz = mtof(g.root)` the ONLY
  `mtof` in the tonal path (verified: exactly one call site). `DEG` (degree
  roots over tonic), `SHAPES` (voice shapes over the bar root), `MODE_JI`
  (scale ratios for cantus passing tones) replace `JI[]`/`jf()`/`HOVER_SHAPE`.
  Roots re-anchor to the tonic each bar (fixed-lattice, not chained — COCHLEA
  owns comma drift). `vBass` now takes **Hz** (41 Hz floor preserved in Hz);
  bass pattern offsets became ratios (0→1/1, −12→1/2, −5→3/4, −2→8/9). Swell
  dyads: dom-sus [4/3,7/4], dom-raised [5/4,7/4], tonic [6/5,3/2], desc
  [3/2,9/4], pad hover [3/2]. AUTO-SET seam stays ET (Camelot labels stay true).
- **Dorian abolished.** DÄMMERUNG and SOG → äolisch (`mode` and `modeName`);
  SOG's warmth is the thirdless sus9 voicing, not the natural 6th. Roots/BPM
  untouched → Camelot table intact (FINSTERNIS 4A, SCHATTEN 1A, TRÄNEN 8A,
  EISEN 9A, DÄMMERUNG 7A, LEERE 5A, SOG 6A, asserted in verify).
- **Arp** resolves ratio shapes (`barRootHz × SHAPE[idx%len] × 2^oct`); the
  octave "reach" is TRÄNEN-only (`arp.reach:.15`, was a semitone `+12` on any
  mood at .30). `quint` bars roll root-fifth-ninth by construction.
- **Cantus (TRÄNEN).** Pentatonic random walk replaced by a seeded descending
  "sigh" cell (`[♭6,5,4]` weighted ×2) + fading echo over 8 bars; first/last
  notes chord-tone-locked to the bar (step the cell down the fixed order and
  retry; a bar that locks no cell falls silent). Melody band [4t, 4t·8/5], no
  octave pops. One sanctioned ti(15/8)→do figure, seeded p=.5 on the raised-dom
  cadence bar.
- **Input simplified.** The 8-chip PROGS block and the bassmode row are gone;
  one 3-chip **LÖSUNG** row (NIE/SELTEN/OFT = cad 0/64/32) replaces them, mood
  default pre-selected, override sticks until mood change. `follow` is a mood
  constant now (no UI). Ledger HARMONIK shows the pool in ♭-aware romans with a
  superscript 5 on thirdless degrees. Hash key `l` replaces `p`/`f`; legacy `p`
  maps tolerantly (0→default, 1–2→NIE, 3–4→SELTEN, 5–7→OFT), old `f` ignored,
  permalinks re-voice (precedented). No hash version bump.
- **Copy:** reader notes ("Longing and release", "Affect and law") rewritten
  for the lament-bass/thirdless/one-leading-tone story with the Dido/chaconne
  reference; all dorian mentions swept from `rille/index.html`.
- **Verified** (`scratchpad/verify-rille-tonal.mjs`, Node sweep + Chromium;
  quick Chromium runner `verify-rille-chromium-quick.mjs` alongside): 25/25
  Node checks (bar-kind law, 5/4 audit, cadence-window shape, forced-i bars,
  cad:0 emptiness, bass-root walk 16/9→8/5→3/2→1/1, JI purity over the closed
  ratio set, single `mtof`, cantus band + chord-tone lock + ≤3 notes/2 bars,
  no major-6th anywhere, arp directions/reach, quint-bar arp tones, Camelot
  table, legacy-`p` mapping). Chromium: all 7 moods × 3 Lösungen render
  NaN-free with audio; AUTO-SET blend runs both decks then settles; ledger
  HARMONIK + Lösung re-default + OFFICINA bench round-trip pass. Only console
  noise is the shared Google-Fonts CDN block (environmental, filtered).
- **Pick-ups / rejected (do not "improve" back in):** half-cadences, Picardy
  third (only if the maintainer asks by name), chained-root JI (COCHLEA's
  territory), pure-3/2 Camelot hops, keeping dorian. EISEN's 45/32 cluster is
  deliberately harsh — 7/5 is the softer option only if the maintainer flags
  it. Cadence phrase length (8 bars), the swell dyads and shapes live in
  `buildHarm`/`SHAPES`/`scheduleBar`; the sigh cells + lock in `genAll`.
- **Ears check (state for the maintainer):** render TRÄNEN·OFT and SOG·SELTEN
  — the writing hovers in pure minor, thirdless where colour passes, the one
  leading tone lands at 15/8, and it tunes beatlessly off one tonic. No bright
  plinks, no noodling. (Headless verify confirms the structure and clean
  runtime; the subjective listen is the maintainer's to make.)

### RILLE — just intervals over the bass · bass rumble floor · master headroom
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **File:** `rille/index.html`
· **Status:** done, verified (Node JI math + Chromium peak measurement); pushed.

Maintainer: "turn the chords still in the mix into just intervals in relation to
the bass; some bass notes are too low and rumble; nothing may clip — we want
headroom." Asked which reading of "just intervals" — answer: **both** (strip to
intervals AND tune just). Three changes:

- **Just intonation against the bass.** New `JI[]` 5-limit lattice +
  `jf(bassMidi, note, dom)`: every harmonic tone (arps, glints, swells, cantus)
  is tuned as an exact ratio from the bar's bass root instead of 12-TET; the
  dominant's seventh takes the **harmonic 7/4**. `bRoot` (with the pedal/follow
  cadence logic) is hoisted OUT of the bass gate in `scheduleBar` — it is the
  lattice reference even when the bass is silent. Voices (`vChord`/`vArpN`/
  `vCantus`) now take **frequencies**, not MIDI; the scheduler owns tuning.
  Verified: every tone lands within 35 cents of its ET target (detune, never a
  re-voicing) and >60 Hz.
- **Swells stripped to bare intervals.** The cadence is no longer a 4-voice
  chord: V7sus = bass + **4/3 & 7/4**; V7 = **5/4 & 7/4** (the 5/4 over the V
  bass IS the key's leading tone); tonic = **6/5 & 3/2**. Pad-mood hover
  underlay is a single just **3/2** fifth. Register: lattice root folded to the
  MIDI 40–51 band, ratios ×2 → old stab register. Sus detection stays
  `H.notes[1]-H.notes[0]===5`.
- **Rumble floor (`vBass`):** fundamentals reached MIDI 24 (32.7 Hz) with the
  sub-osc at **16 Hz** — infrasonic. Now: fundamental floored to ≥ MIDI 28
  (41.2 Hz, lifted by octaves), the f/2 sub-oscillator only added when f≥82 Hz
  (sub ≥41 Hz; below that the fundamental IS the sub and plays alone, gain
  .8→.92 to compensate), plus a 25 Hz highpass in the bass chain.
- **Headroom (`buildGraph`):** new `G.out` trim (.76) after the master comp;
  `deckFloor` hiss reroutes through it (still post-comp, never pumped).
  Measured full-mix peaks per mood, 14 bars straddling a cadence, dust on:
  **0.78–0.89** (was 0.99–1.15 = clipping the WAV). Zero pageerrors.
- **Pick-up:** trim constant `.76` targets ≈ −1 dBFS worst case; JI ratios and
  the dyad choices live in `JI`/`jf` and the dom/tonic branch of `scheduleBar`.
  If the 45/32 tritone reads too sour on EISEN's cluster, 7/5 is the softer
  choice. WATCH: `startMix` blends two decks ≈ +3–4 dB summed — peaks stayed
  ≤.89 single-deck; blend transients may kiss ~1.0 — if audible, drop trim to .7.

### RILLE — arpeggios instead of chord stabs
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **File:** `rille/index.html`
· **Status:** done, verified (Node + Chromium); pushed. Maintainer's suggestion.

Hover chords are no longer stabbed — they're **broken open into arpeggios**: the
chord never sounds all at once, it's always reaching (and rolling arps are the
minimal/deep-tech texture anyway). Cadences deliberately stay sustained swells —
the **only** place a chord sounds whole, which is now part of the release.

- **`g.arpSeq`** (genAll, replaces `chordHits`): seeded 32-step/2-bar walk of
  chord-tone *indices* `{s,idx,oct,vel}`; notes resolve at schedule time against
  the narrative bar (`H.notes[idx%len]+oct`). Per-mood `arp:{rate:8|16, dens,
  dir:'up'|'dn'|'ud'|'rnd'}`: TRÄNEN rises in slow 8ths, FINSTERNIS/LEERE fall
  sparse, SOG rolls up in 16ths, SCHATTEN/DÄMMERUNG rock, EISEN's cluster becomes
  a dense random industrial sequence. Occasional +12 lift on the top tone ("the
  reach"); offbeat-8th accents; some downbeats skipped (space). Swing applies.
- **`vArpN`**: soft pluck, 2 detuned saws → warmth lowpass → `stabBP` → chordae
  part → **duck bus** (arp pumps with the kick). Notes overlap slightly
  (`stepDur*2.4`) for legato shimmer.
- **Passing majors** ('maj' bars): a quick 3-note ascending **glint** via vArpN —
  still one bar, still gone. Pre-dominant bars arpeggiate (tension rolls) before
  the V7sus swell. Pad moods (TRÄNEN/LEERE) keep a quiet swell UNDER the line.
- Canvas chordae ring now shows the arp step mask. `chordHits` fully removed.
  (Cantus rng draws shifted vs. the previous commit — pressings re-voice; harm
  timeline itself unchanged for a given seed.)
- **Verified:** Node — arpSeq deterministic, indices/octaves/velocities in range,
  8th-rate moods never emit 16th-offset steps, never empty; full narrative sweep
  still PASS (3360 pressings). Chromium — all 7 moods render arp+glint+cadence
  windows with zero pageerrors (densities: LEERE/FINSTERNIS 6 events/2 bars …
  EISEN 21). **Pick-up:** arp note length (`stepDur*2.4`), pluck level (.24) and
  the maj-glint shape live in `scheduleBar`/`vArpN`; direction/density per mood.

### RILLE — harmonic NARRATIVE engine (supersedes the progression rework below)
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **Files:** `rille/index.html`
(+ engine copy in `README.md`, `index.html`) · **Status:** done, verified (Node
structural sweep + headless Chromium); pushed.

Maintainer verdict on the previous pass: "still not landing — beats/rhythm good,
harmonic structures don't. Redo the composition structure; freedom." Diagnosis:
a fixed 2-bars-per-chord loop can never ache — even with a V7 in it, resolution
recurs mechanically, so nothing is *earned*. Replaced the chord loop with a
**64-bar harmonic narrative** (`HARMBARS`, = one WAV cut):

- **Two states.** HOVER: seeded weighted drift among the mood's minor chords
  (each 2–4 bars, deep **minor-9 voicings** per `HOVER_SHAPE[vstyle]`), majors
  (♭VI/♭VII/♭II/IV) capped **by engine law at 1 bar + one short stab** (`kind:
  'maj'`) — passing colour, never a destination. CADENCE: every `cad` bars the
  **last 8 bars of the span** run pre-dominant (`'pre'`, iv or ♭VI, 2 bars) →
  **V7sus held** → **V7** (raised leading tone; the 4-3 suspension resolves
  across the two swells) → **i blooming** (`'tonic'`, m(add9) swell) — unless
  `half:true`, which hangs on the V7 (half-cadence, never lands). Melody
  (`cantus`) falls silent on `dom` bars; bass follows chord roots through
  pre→dom→tonic so **iv→V→i walks in the low end** even in pedal moods.
- **Quality is chosen, not inherited**: `voiceAt(mode,root,deg,offs)` voices
  explicit semitone shapes (register-anchored as before); diatonic stacking and
  `buildChord` are gone, so no accidental clash is possible. Diminished pool
  slots are filtered at build (`poolDegs` keeps the labels truthful).
- **Recipes.** A progression is now `{pool:[[deg,weight]…], cad, half}` —
  `PROGS`: suum / schweben (i·iv ∞) / sehnen (+♭VI ∞) / halb (…V7 offen) /
  selten (one release per 64) / erzählen (per 32) / neapel (♭II colour) / oft
  (per 16). Moods carry `harm:{…}` (replaces progDeg/progDom/progHold):
  FINSTERNIS ♭II+half-cad (never lands), SCHATTEN cad 64, TRÄNEN cad 32
  (flagship), EISEN cluster-drone ∞, DÄMMERUNG cad 32, LEERE i·iv ∞, SOG cad 32.
  Ledger says **HARMONIK** with `harmLabel` (♭-aware romans + `…V7→i`/`(offen)`/
  `∞`); chips regenerate per mood. `g.harm[bar%64]` is the scheduler's only
  lookup; hash `p` = recipe index (0–7 as before).
- **Verified:** Node — 3360 pressings (7 moods × 8 recipes × 60 seeds):
  deterministic, majors 5.5% of bars and never >1 bar, every resolving recipe
  lands tonic-after-dom, half recipes never emit `tonic`, `cad:0` emits no
  cadence kinds, V7 always carries the leading tone, registers in range.
  Chromium — cadence windows render for TRÄNEN/FINSTERNIS/SOG/LEERE with zero
  pageerrors; recipe chips + ledger correct live; hash carries `p`.
- **Pick-up:** cadence phrase length (8 bars) and shapes live in `buildHarm`;
  swell dynamics in `scheduleBar`'s dom/tonic branch (`H.span*16*stepDur*.94`).
  Arrangement (`newArrange`) and the harm grid are deliberately uncoupled so
  live and offline stay identical — coupling cadences to BRUCH sections would
  be the next expressive step. Old permalinks: harmony differs (by design).

### RILLE — emotional-minor harmony: longing default, rationed resolution — SUPERSEDED by the narrative engine above; kept for the ♭9/register reasoning.
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **File:** `rille/index.html`
· **Status:** done, verified (Node harmony sweep + headless Chromium render); no PR.

Maintainer note: "the notes/harmonies aren't hitting right — vibe should be
emotional, minor, longing; major chords minimal and short; only resolving in
longer emotionally-charged sections." Researched emotional-minor writing and
reworked the harmonic language (not the synthesis). Four moves:

- **A real resolution — the harmonic-minor dominant.** Every mode here is minor,
  so its diatonic *v* has no leading tone and cannot pull home; the loop just
  floated. Added a `dom` chord style to `buildChord`: on the fifth degree it forces
  a **major third (the raised leading tone) + ♭7 → V7**, the one chord that
  genuinely resolves to i. It's reserved for cadences, marked per-progression.
- **`hold` = the charged, sustained cadence.** Progressions now carry a `dom` set
  and a `hold` set. `hold` chords are played as one slow 2-bar **swell** (pad-style)
  instead of short stabs, and the **bass steps V→i** (during `dom`/`hold` the bass
  follows the chord root even in pedal moods). So resolution only *lands* in the
  longer sections; elsewhere the minor hovers, majors stay short/passing.
- **Longing progressions.** New `PROGS` menu: harren (i), senken (i–♭VI), sehnen
  (i–iv), fallen (i–♭VII–♭VI–i aeolian descent), **andalu** (Andalusian cadence
  i–♭VII–♭VI–V), gebet (i–iv–♭VI–V), **aufloesung** (6-chord phrase, one V→i at the
  end). Mood defaults rewritten to match: FINSTERNIS i–♭VI, SCHATTEN i–♭VII–♭VI–i,
  **TRÄNEN i–♭VI–iv–♭VII–V→i** (flagship resolving), EISEN i (drone), DÄMMERUNG
  i–IV–♭VII–V→i, LEERE i (drone), SOG i–IV–V→i.
- **Modes toward longing.** SCHATTEN dorian→**aeolian**. Others kept (phrygian for
  the dark FINSTERNIS/EISEN, aeolian for TRÄNEN/LEERE, dorian for the warmer
  DÄMMERUNG/SOG). `progDom`/`progHold` are new optional mood fields; `g.dom`/`g.hold`
  ride alongside `g.progDeg`. `romanOf`/`chordLetters` take a `dom` arg and print the
  V/`x7`. New in-page "Longing and release" note explains it.
- **Verified:** Node — all 7 mood defaults + 8 progs × seeds (2240 pressings)
  compose with 0 non-cluster ♭9 and 0 structural fails; every `dom` chord confirmed
  a true V7 (leading tone + major third + ♭7), every resolving mood has a V→i tonic
  (e.g. TRÄNEN `…E7→Am`, DÄMMERUNG `…A7→Dm`, SOG `…D7→Gm`). Chromium — the four
  resolving/hovering moods render a full 16-bar phrase (cadence swell + bass V→i)
  with zero pageerrors; live UI ledger shows the prog correctly.
- **Pick-up / caveats:** `dom` assumes the marked step is **degree 4** (the V root);
  keep it there. On **dorian** moods, progs that use degree 5 (fallen/andalu/
  aufloesung) render a passing **vi° (diminished)** rather than ♭VI — valid, adds
  yearning, de-clashed, but if you want ♭VI there switch that mood to aeolian.
  **Permalink note:** this changes the harmony of *every* pressing (mood defaults
  and the `p` prog-index both moved), so links cut before this sound different — by
  design, no hash version bump. The register anchor puts V ~a fifth below the tonic
  stabs (same band, verified in range); lift it if a mood's V feels low.
### RILLE — minimal deep tech mood + smoother chords
**Branch:** `claude/minimal-deep-tech-guide-ta175d` · **Files:** `rille/index.html`
(+ mood-count copy in `README.md`, `index.html`) · **Status:** done, verified
(Node model check + headless Chromium render); no PR opened.

Driven by a minimal-deep-tech production guide. Two moves, both additive:

- **New 7th mood — SOG** (`id:'gurges'`, gloss *hypnotisch*): the warm, rolling,
  stripped-back deep-tech pocket the existing six lacked (they lean dark/
  industrial). 123 BPM, Dorian (bright natural 6th), `root:43` → **6A** on the
  Camelot wheel (was unused; keys are derived from `root`, no separate table).
  Rolling deep sub (`bass:'roll'`), soft multi-burst clap, offbeat opens, gentle
  `swing:.07`, moderate `duck:.42`, sparse **open-sus stabs** (`vstyle:'sus9'` —
  no third, deep-house colour; `progDeg:[0,3]` = i–IV). Appended to `MOODS`, so
  the affect button, key, arrangement and hash slot (`o.a`=6) all auto-wire and
  every existing permalink (indices 0–5) is untouched. All moods are minor-family
  → SOG stays on the A ring, participates in AUTO-SET harmonic mixing normally.
- **Smoother chord sound design** (`vChord`, all moods): the stabs bit because the
  detuned saws pushed buzzy upper harmonics through the resonant stab bandpass and
  an 8 ms attack clicked. Added a gentle **warmth lowpass** (pad 2200 / stab 2900
  Hz, Q .4) before `stabBP` and softened the stab attack **8 ms → 22 ms** (detune
  ±6→±5, peak .3→.28). **Timbre only — voicing/`buildChord` untouched**, so the
  earlier ♭9/register fixes still hold. EISEN's `[0,6,13]` cluster stays
  deliberately harsh; the warmth filter just rounds it slightly.
- **Verified:** Node — 7 moods, SOG=6A unique, 1600 SOG pressings compose with 0
  problems, non-cluster ♭9 count 0. Chromium — SOG selects at 123 BPM, full graph
  + `vChord` + `scheduleBar` + offline render run with zero pageerrors, valid
  audio, sus9 voicings correct (G–C–D–A / C–F–G–D). Only console noise is the
  Google-Fonts fetch the sandbox proxy blocks (cosmetic, pre-existing, all works).
- **Pick-up:** SOG uses short sus stabs, not a pad; if a pad-underlay version is
  wanted, flip `stab.pad`. The guide's "warm master saturation" was deliberately
  *not* added — the ask was less-harsh, so I subtracted highs rather than adding
  harmonics. `bpm 123`/`swing .07`/`duck .42` are the feel knobs.
### RILLE — harmonic auto-mixing between generated tracks (DJ set)
**Branch:** `claude/rille-hiss-pause-4dojix` · **Status:** done, verified
headless; no PR opened.

An **AUTO-SET** toggle turns RILLE from one track into an endless DJ set: every
`SET_BARS` (48) it beatmatches and blends into a fresh track in a
**Camelot-compatible key**, over a long phrase-aligned crossfade with a **bass
swap**. **JETZT →** triggers the next blend by hand (keys: `m` mix, `x` auto). A
readout shows current Camelot key + queued move.

- **Harmonic model (Camelot):** every mood is a minor mode → every track sits on
  the Camelot **A ring**; key = tonic pitch-class. `CAMELOT_PC`/`PC_CAMELOT` map
  both ways; ±1 Camelot = a fifth/fourth. Rendered moves (all minor→minor,
  wheel-legal): same key, +1, −1, +7 (semitone lift), +2 (whole-tone lift).
  `pickHarmonicMove` weights fifths/fourths highest. **B-ring / relative-major
  moves are NOT rendered — the engine has no major mode.** Mood keys: FINSTERNIS
  4A, SCHATTEN 1A, TRÄNEN 8A, EISEN 9A, DÄMMERUNG 7A, LEERE 5A. `genAll` gained a
  `rootOverride`; `st.root` carries the live key.
- **Minimal-techno principles:** long phrase-aligned blends (`BLEND_BARS`=16),
  beatmatch (both decks share one bar clock at `st.bpm`), bass swap (incoming
  low end held out by a highpass until the mid-blend swap so basslines never
  stack), transition-by-subtraction (outgoing stabs/claps/melody stripped at the
  swap, then it fades).
- **Dual-deck architecture:** `buildGraph` is now a shared **mixer** (master
  shaper→comp→out + shared reverb/delay sends). `makeDeck()` hangs a full
  channel-strip per track (part gains, own sidechain duck bus, stab filter, kick
  drive, sends, a **fader**/crossfader, a **bassKill** highpass, and a post-comp
  **deckFloor** for the hiss). Voice functions unchanged — first arg still `G`,
  now a deck with the same field names. `RT.decks[]` holds live decks (1
  normally, 2 during a blend); `schedTick` schedules each at the same `t`.
  `startMix`/`doSwap`/`finishMix` run the blend; outgoing deck retired, incoming
  promoted to primary (`st.g` etc.). Hash gained `k` (key) and `x` (auto).
  `cutPlate` builds one deck; offline WAV stays a single track.
- **Pick-up:** only the A ring is reachable — a major-mode voicing would unlock
  relative/diagonal (B-ring) moves and the full wheel. `SET_BARS`/`BLEND_BARS`
  are consts near the Camelot helpers for pacing tweaks.

### RILLE — hiss was pumped by the kick; added a pause button
**Branch:** `claude/rille-hiss-pause-4dojix` · **Status:** done, verified headless.

- **Hiss un-pumped + lowered:** the surface hiss (`h` noise loop in `startDust`,
  part `pulvis`/STAUB) ran through the master compressor, so the "constant" hiss
  ducked on every kick — nothing a real pressing does. Fix: added `G.floor`, a
  gain tapped **straight to `ac.destination`** after the master comp; hiss routes
  there instead of the part bus. Level `.006 → .004` (× mood `dust`). STAUB mute
  still rides `G.floor.gain`. Crackle/pops stay on the part bus (request was
  about the hiss).
- **Pause button:** `#pause` beside SPIEL (+ `p`). `togglePause()`
  suspends/resumes the AudioContext; everything is keyed off `ac.currentTime`
  (frozen while suspended) so transport + visuals hold and resume exactly.
  Button reads PAUSE↔WEITER. **Gotcha:** the iOS unlock `kick()` auto-resumes any
  non-running context on statechange/visibility — it was instantly undoing the
  pause. Guarded with `if(!st.paused)`.

### RILLE — chord progressions sounded broken/clunky
**Branch:** `claude/rille-chord-dissonance-io1zr6` · **Status:** done, committed,
pushed. No PR.

- **Root cause 1 — a diatonic ♭9 (the "broken" clang):** `buildChord()` stacked
  its ninth at `rel(8)` diatonic steps without checking the interval; on degrees
  whose upper neighbour is a semitone that ninth is a **♭9 (13 semitones)** — an
  avoid-note, baked into the default mood and most progressions. Fix: fold a ♭9
  to the octave (`nine()` → `13 ? 12`); guarded the `sus9` frame against
  aug-4th/dim-5th semitone clusters. `ferrum`'s `[0,6,13]` cluster is
  **intentionally harsh — left alone.** Commit `571907b`.
- **Root cause 2 — every stab in a different register (the "clunk"):** chords
  were voiced root-position at `root+12+base`, leaping up as the progression
  climbed. Fix: anchor each chord root to the octave nearest the key root, moving
  the voicing as a rigid block (intervals untouched). Span ≤10 semitones,
  worst step ≤9, nothing sinks into the bass. Precomputed in `genAll` as
  `g.chords`, read by `scheduleBar`. Commit `ea91fb2`. True nearest-previous
  voice-leading was considered and rejected — it drifted down and lurched ~14
  semitones at the loop point; register-anchoring is loop-stable.
- **Pick-up:** optional next step is light inversion / true voice-leading with
  anti-drift clamping, if parallel-block motion feels stiff. Engine is
  `buildChord` / `genAll` / `scheduleBar`.

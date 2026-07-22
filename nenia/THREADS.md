# nenia — session threads

Development history for the `nenia/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### NENIA — simplified visuals + childlike control labels
**Branch:** `claude/project-working-conventions-xjaafw` · **File:**
`nenia/index.html` (canvas revert + control copy) · **Status:** done, verified
headless; no PR opened. Audio/compose untouched.

Two moves:

- **Rolled back the "whimsical" canvas layer** (the wobbly hand-drawn figures
  with faces/hair, the chalk-doodle backdrop, giggle sparkles, bouncy
  `sayWord` lettering, per-kid bob, and the title-dot bob) — it read as too
  busy. Restored the clean stick-figure style by resetting `nenia/index.html`
  to commit `1bf8558` (the "expand" state), which **keeps the new-game
  animations** (ball arc, hopscotch grid/hopper, arch bridge + filing line).
  `kidFig` is back to the simple `(x,y,c,scale,glow,fallen)` signature; active
  kids just glow. If revisiting whimsy, the busy version is commit `b7a3966`.
- **Reframed every control into child logic** (labels/option text only — all
  `value`s and `id`s unchanged, so the hash + engine are untouched). You pick a
  *person* to lead, not a pitch: "Who starts?" → **Marcus / Erica / Priya /
  Baby Theo** (still map to G/A/B♭/C via the unchanged `keysel` values; Erica =
  the old "A — the usual" default). Likewise "What are we playing?", "How many
  of us?", "How much of a tune?" (was Chant range: trichord/tetratonic/
  pentatonic → "Just the teasing notes / a bit more of a tune / the whole
  sing-song"), "Where are we?" (was Yard), "How fast?" (was Pace), and "ROWDY —
  nobody's quite in tune". The literary "on this music" notes keep the real
  theory terms — the child-framing is only on the interactive choices.
- Verified headless: parse clean, no console errors, clean-style arch/counting
  canvases render, option `value`s confirmed intact (engine unchanged).

### NENIA — expanded the playground-lore machine
**Branch:** `claude/project-working-conventions-xjaafw` · **File:**
`nenia/index.html` (+ catalogue lines in `README.md`, `index.html`) ·
**Status:** done, verified headless; no PR opened.

"More music, more options, more animations." Went from 5 games to 8 and widened
the melodic material.

- **Three new games** (indices 5–7 in `GAMES`/`compose`/`draw`): **BALL-BOUNCE**
  (two-ball; verse then accelerating count, a leg-over on every 4th beat, ends on
  a seeded miss), **HOPSCOTCH** (hop the numbered stones, both feet on the
  rest-squares 4/7/top, seeded wobble-out or a clean run home), **ARCH**
  (London Bridge / Oranges & Lemons — two kids form the bridge, the rest file
  through, it drops on the last word and catches whoever's under). RING was the
  `else` catch-all in `compose`; it's now an explicit `game===4` block and ARCH
  is the fallback.
- **Chant-range option** (`P.scale`, new `#scalesel`): trichord → tetratonic
  (adds `re`, −5) → pentatonic (adds low `do`, −7). `CELLS` gained `lv`-tagged
  cells; `fitCell(rng,n,scale)` filters to cells the range allows. The trichord
  taunt (`CELLS[0]`) stays pure regardless.
- **More options:** children up to 10 (was 8); a third yard, **Gymnasium**
  (`yard===2`), longer/brighter convolution — `makeVerb` and the wet-gain are
  now `[dry,corridor,gym]` lookups.
- **New animations** (in `draw`, early-return branches; new marks folded in
  `stateAt`): bouncing ball arc + leg-swing; a chalk hopscotch grid climbed by a
  hopper that tilts on a wobble; the arch bridge with a filing line that drops
  and rings the caught kid. New percussion voices: `bounce`, `legover`, `roll`,
  `hop`, `landboth`, `archdrop`.
- **Hash bumped v1→v2** (appends `scale`). `readHash` accepts both — v1
  permalinks load with `scale=0`. Verified: 72 game×range×kids combos compose
  with no bad degrees / zero-durations, all six degrees exercised, trichord
  gating holds, live play + hopscotch offline WAV render clean (peak .44), hash
  round-trips.
- **Pick-up:** the *range* option only affects the sung games, not the taunt (by
  design). ARCH could eliminate repeatedly like counting-out instead of a single
  capture, if a longer game is wanted.


# OPVSCVLA — cross-cutting session threads

Threads that span multiple machines or the whole repo — voicing-layer rollouts,
lock-screen sweeps, the OP–XY fork, meta snapshots — newest first. **Per-machine
history lives in each machine's `<machine>/THREADS.md`**, not here. Orientation
and conventions are in `HANDOFF.md`.

## Where each machine's history lives

Each machine directory carries its own `THREADS.md`. Machines with recorded
history: amadinda, bani, bolg, diamond, fado, forfex, germen, gongan, holler,
nenia, ricercar, rille, siyotanka, sublow, svara, tambour, tenebrae, tessera,
tritava, vyvid. Machines without a `THREADS.md` have no logged sessions yet —
create one (same header format) the first time you touch them.

---

### OFFICINA — three deferred bench pick-ups from the TIMBRE rollout
**Branch:** `claude/officina-tweaks-6qx98v` · **File:** `officina/index.html`
only. **Status:** done, verified headless (synthetic-schema harness, not
committed — see below). Closes the three "Pick-ups" noted when OFFICINA first
shipped (this file, "OFFICINA + TIMBRE rollout"): export everything, a
hashchange listener, and per-param A/B.

- **Export everything.** `pexp` in the per-machine strip only ever exported
  the currently-benched machine. Added a top-level `export everything` button
  above the machine chips (`#pexpall`, new `.allbar` row) that walks
  `MACHINES`, gathers every machine's `opvscvla.timbre.<id>` (applied voice)
  and `opvscvla.presets.<id>` (named presets) that actually have data, and
  downloads one `officina_all.json` (`{officina:'export-all', machines:{...}}`).
  Machines with nothing saved are skipped rather than padding the file with
  empty entries.
- **Hashchange listener.** The `#m=<dir>` deep link only ever resolved once,
  in an IIFE at load — switching machines after that was chips-only, even
  though `pick()` already keeps the hash in sync via `history.replaceState`.
  Factored the IIFE into `applyHash()`, called once at load and again on
  `addEventListener('hashchange', applyHash)`; `pick()`'s existing
  `history.replaceState` (not `location.hash=`) doesn't itself fire
  `hashchange`, so there's no feedback loop. A pasted/edited link or
  browser back/forward now switches the benched machine mid-session.
- **Per-param A/B.** The existing `A/B` button flips the *entire* running
  machine to factory while held — useful, but you lose the mix around the one
  parameter you're actually deciding on. Added a small `a/b` button to every
  param row (visible, like the reset `↺`, only once that param is modified)
  that sends a single `{op:'set'}` holding just that path at its factory
  value while lit, independent of the committed edit shown in the slider/
  number box. Reconciled with the existing controls rather than left to
  collide: editing a param (slider/number/reset) clears its own held toggle,
  and the whole-voice `A/B` clears every per-param toggle when pressed (its
  `bulk` post supersedes them all anyway) — both verified headless.
- **Verified** with a throwaway `dev/scratchpad/verify-officina-tweaks.mjs`
  (not committed, per `.gitignore`'s `scratchpad/`): built the panel from a
  synthetic `{op:'schema'}` postMessage rather than through the real
  `officina/<dir>?bench` iframe, because that cross-frame round-trip is
  currently broken under `file://` in this sandbox on `main` too (confirmed
  via `git stash` before touching anything) — unrelated to this change, not
  fixed here. Checked: panel builds from the injected schema; hashchange
  switches the stagehint/chip highlight; editing a param marks it modified
  and reveals its `a/b`; the per-param toggle flips on/off and is cleared by
  either editing that param or firing the whole-voice `A/B`; `export
  everything` downloads `officina_all.json` containing every machine with
  saved data (and no others) after seeding a second machine's
  `localStorage` key directly. Zero page errors throughout. Also ran
  `node dev/check.mjs` (bridge/registry/numbering) — clean, since no
  machine `index.html` or the bridge itself was touched.
- **Reader panel** (`officina/index.html`'s own "on this bench" doc) updated
  to describe both new controls in the existing Presets section — minimal
  addition, not a rewrite.

### Dev tooling — verify harness, drift checker, machine template, CI
**Branch:** `claude/opuscula-workflow-standards-ljzy2z` · **Files:** new `dev/`
(tooling) + `.github/workflows/ci.yml`; docs wired into `HANDOFF.md` + `CLAUDE.md`;
`.gitignore` adds `dev/node_modules/`. No machine `index.html` touched. **Status:**
done, all 28 machines pass. Implements the five streamlining items the maintainer
asked for.

- **`dev/verify.mjs` — one headless harness for every machine.** Drives each
  machine through the parts of the house grammar guaranteed identical across all
  of them — the OFFICINA bench schema (postMessage) and the space/`c` keyboard
  transport — so there's no per-machine wiring. Checks: `loads-clean` (no
  pageerror/console.error on `?factory`), `bench-schema` (well-formed, `id===dir`,
  params numeric + labelled), `plays-clean` (Space starts an AudioContext),
  `cut-renders-wav` (`c` runs the offline render → RIFF/WAVE download). Replaces
  the per-session throwaway `scratchpad/verify-*.mjs`. `--quick` (structural
  only), `--list`, optional `<machine>/expected.json` for machine-specific
  assertions. Runs machines through a small concurrency pool.
- **Two things learned building it, both real:** (1) `has-canvas` was dropped as
  a check — **PAS SALÉ ships a DOM visual, no canvas**, so a canvas isn't a
  universal invariant. (2) The cut check treats a merely-slow render gracefully:
  PAS SALÉ compiles **116 s** of dense 5-voice audio and renders slower than 240 s
  on this software-GL sandbox, so the check passes on a full WAV download *or* on
  an OfflineAudioContext constructed with no page error (path wired, render just
  slow) — render speed isn't a correctness property. A cut that errors or never
  starts a render still fails. Verified full-WAV renders on a spread of families
  (DIAMOND, AMADINDA, BANI, BOLG, COCHLEA, RILLE, SVARA, PEAL, RICERCAR ~69 MB,
  SUBLOW); PAS SALÉ passes via the graceful path.
- **`dev/check.mjs` — static drift, no browser.** Groups machines by their
  whitespace-normalized OFFICINA bridge and flags any drifted copy (all 28 are
  currently byte-identical); asserts every machine appears in all four registries
  (landing card / README row / officina chip / HANDOFF table); asserts op.
  numbering has no duplicate or gap. `--next` prints the next free numeral
  for the maintainer to stamp at merge.
- **The checker earned its keep on day one.** Rebasing onto current `main` (which
  had gained PERSONA, op. XXIX, while this branch worked), `check.mjs` flagged a
  real bridge drift: PERSONA's copy renamed the local `P`→`Pp` in the bridge's
  `reset`, so it was no longer verbatim. Restored to canonical (one line,
  functionally identical, block-scoped so safe — PERSONA still passes the harness
  fully). That one-line machine-file change is the only non-`dev/`/-doc edit in
  this PR, made solely because the tool caught a genuine house-rule violation.
- **`dev/template/index.html` — the house shell as a minimal *working* machine.**
  Loads, benches, plays, cuts — passes the harness from commit one (verified by
  copying it to a temp dir named `template`). Copy it to `<machine>/index.html`
  and fill the `TODO(law/voices/canvas/reader)` markers; the SHARED blocks
  (canonical OFFICINA bridge, `__iosAudio`, Media Session, `saveWav`, keyboard
  grammar) stay verbatim, which `check.mjs` enforces. Plus `template/expected.json`
  as the example schema.
- **`.github/workflows/ci.yml`** runs `check.mjs` + `verify.mjs` on every PR and
  on `main` (Node 22, installs Chromium, concurrency 3, 30-min cap). **Green is
  the merge signal** — CI carries the mechanical Quality-bar checks so the
  maintainer doesn't hand-verify each PR.
- **Opus numbering (item 5) deferred to merge:** a build agent leaves an `op. ??`
  placeholder or takes `dev/check.mjs --next`; the maintainer stamps the final
  numeral at merge, and `check.mjs` fails CI on a duplicate/gap. Documented in the
  Workflow section of HANDOFF + CLAUDE.
- **Dev-only, quarantined:** everything lives under `dev/` and `.github/`; the
  machines stay one file, zero runtime dependencies. `dev/node_modules/` is
  gitignored.

### Workflow reorganization — PRs into main, per-machine independence, minimal tokens
**Branch:** `claude/opuscula-workflow-standards-ljzy2z` · **Files:** `HANDOFF.md`
+ `CLAUDE.md` (front matter), and the inline Open-threads log split out into
per-machine `<machine>/THREADS.md` files + this repo-root `THREADS.md`. No machine
`index.html` or registry files touched. **Status:** done. Deliberate
reorganization session (the "only a session that reorganizes HANDOFF may
restructure it, and touches nothing else" rule). Maintainer-driven changes:

- **The maintainer now commits to `main`; agents open PRs.** Every task — plan,
  build, or improve — ends in a PR the maintainer reviews and merges. Agents
  never push to `main` or merge their own PR. Replaces the old "land small and
  land often on `main`" model throughout (rewrote the whole parallel-work
  section into the new **Workflow** section; flipped the Git convention in both
  files).
- **Three named task modes** (plan / build / improve), all → PR, documented in
  Workflow so the maintainer can ask for any one and the agent knows the shape.
- **Opus numbers are provisional until *merged*** (was "until landed"). Agent
  takes the next free numeral from `origin/main`, flags it provisional in the
  PR; the maintainer settles final numbering at merge. Directory name is claimed,
  the number can still move.
- **The token fix — the Open-threads log left HANDOFF.md.** It had grown to
  ~2,700 lines / 220 KB, loaded by every session. Each machine's history now
  lives in its own `<machine>/THREADS.md` (20 files, newest-first); threads that
  span machines or the repo (the two lock-screen sweeps, the OFFICINA/TIMBRE
  rollout, the OP–XY fork, the app-icon pass, the branch-farm snapshot) live in
  this root `THREADS.md`. HANDOFF.md dropped from 3,071 to ~300 lines, and its
  old "## Open threads" section is now a short "## Session history" pointer. An
  agent reads only its one machine's file. Entries were moved **verbatim by
  line-range** (no content rewritten); only the redundant "### RILLE threads"
  divider was dropped. Machine-code comments that say "see HANDOFF's X thread"
  still resolve — the pointer redirects to `<machine>/THREADS.md` — so no machine
  files were touched.
- **Each machine is independent / minimal-token first.** New intro states you
  don't need to read the whole HANDOFF: lean top matter + your one machine (its
  `index.html` + its own `THREADS.md`) is enough; you should not comb the other
  machines' code or history, and should flag it if a task seems to require that.
- **New Quality bar section.** Explicit "don't ship low-quality code" checklist
  (law-as-interface, seeded/deterministic, hash round-trip, clip-safe WAV,
  iOS/Media Session, reduced-motion, TIMBRE+bridge, verified headless) + the
  maintainer's reference machines to match (**BOLG, DIAMOND, TESSERA, FADÓ,
  TENEBRAE**) and the ones known to need work (**PAS SALÉ, RILLE, ŠIYÓTȞAŊKA**).
- **OFFICINA is improved per-machine, not swept, for now.** Token-light
  bench/TIMBRE fixes ride along in the machine's PR; token-intensive officina
  work is noted in the machine's `THREADS.md` and left for a dedicated pass.
- Kept intact: the minimal-diff registry discipline, top-insertion of new
  `THREADS.md` entries, the dedicated-branch rule for cross-machine sweeps, the
  design-brief convention, and rebase-onto-`origin/main`-before-PR (agents are
  expected to find `main` has moved since they began).

### Lock-screen playback via Media Session API — sweep in progress (I–V done)
**Branch:** `claude/app-link-request-vj8sml` was the original sweep branch;
the session doing COCHLEA landed on `claude/new-session-owsnx3` instead (its
harness-assigned branch) — same commit as `origin/main` at pickup, so no
history was lost, just a branch-name handoff. Whichever branch picks this up
next: rebase onto `origin/main` first, same as always. **Files done:**
`pas-sale/index.html` (op. I), `scala/index.html` (op. II), `gradus/index.html`
(op. III), `rille/index.html` (op. IV), `cochlea/index.html` (op. V) ·
**Status:** in progress, going down the op. list in order; each machine
verified headless (Chromium) as it lands. Maintainer-requested: listen with
the phone locked/backgrounded.
### Lock-screen playback via Media Session API — sweep in progress (PAS SALÉ, SCALA done)
**Branch:** `claude/app-link-request-vj8sml` · **Files done:** `pas-sale/index.html`
(op. I), `scala/index.html` (op. II) · **Status:** in progress, going down the
op. list in order; each machine verified headless (Chromium) as it lands.
Maintainer-requested: listen with the phone locked/backgrounded.

- **`__iosAudio`'s hide-suspend removed** in each machine touched so far: it
  used to deliberately `ac.suspend()` on `visibilitychange`→hidden (comment:
  "stop the sound when the page is backgrounded"). That was the opposite of
  what's wanted now, so it's gone — the context only ever gets `kick()`ed
  (resumed), never suspended, on visibility/statechange. `pagehide` still
  suspends (real navigation/unload, not backgrounding). Where a machine has
  its own pause flag (SCALA/GRADUS/RILLE's `st.paused`), `kick()` already
  guarded on it — untouched, still respected. **Re-verified the RILLE pause
  gotcha specifically** (headless): manually pause, simulate hide→show,
  confirm the context stays `suspended` (kick() didn't undo it), only then
  resume via the pause button.
- **Media Session added** (`__mediaSessionInit`/`__mediaSessionUpdate`):
  wires lock-screen/notification-shade play/pause/stop to each machine's own
  start/stop/pause functions; next-track maps to whatever that machine calls
  "another take" (PAS SALÉ's `encore()`, SCALA's next-preset cycle, GRADUS's
  `regenerate(true)`/ALIUD, RILLE's `applyChange(true)`/ALIUD). Metadata
  (title/op. number/current-take-as-album) refreshes on every
  start/stop/pause-toggle/take-change — RILLE also refreshes it from
  `finishMix()` (the harmonic auto-blend handoff) and `applyChange()`, since
  both can silently swap the live seed mid-playback.
- **Silent looping `<audio>` anchor** (`__silStart`/`__silStop`, `__SILENCE`
  data-URI, 8kHz/8-bit/50ms, identical in both files so far): pure Web Audio
  doesn't reliably surface an OS "now playing" session or stay exempt from
  background tab-timer throttling; a real (silent) `<audio>` element playing
  alongside does both. Starts/stops with the transport.
- **Verified headless** for all five machines: `ctx.state`/`RT.ctx.state`/
  `RT.ac.state` stays `'running'` after a simulated `visibilitychange`→hidden
  (previously suspended); Media Session metadata/`playbackState` update
  correctly; the silence anchor plays while the transport runs; SCALA's,
  GRADUS's, RILLE's, and COCHLEA's manual pause still suspends/resumes
  correctly under the new visibility logic (hide→show *while paused* checked
  on all four — doesn't wake it). Scripts `scratchpad/verify_pas_sale.js`,
  `scratchpad/verify_scala.js`, `scratchpad/verify_gradus.js`,
  `scratchpad/verify_rille.js`, `scratchpad/verify_cochlea.js` (scratch, not
  committed).
- **COCHLEA shape differs from the other four**, worth flagging for whatever
  machine's next: no `st.paused`-style flag or split `onVis`/`ac.onstatechange`
  pair — pause is `live.paused` + a direct `ctx.suspend()`/`ctx.resume()` in
  `togglePause()` (MORA/PERGE), and `__iosAudio` is a single self-invoking
  IIFE with one `visibilitychange` listener that already branched on
  `document.hidden`. The fix was the same in spirit (stop suspending on
  hide, always `kick()`), just a smaller diff since there was no separate
  `statechange` branch to touch. `kick()`'s existing `if(live.paused)return`
  guard is what protects a manual MORA pause — same gotcha, different flag
  name. "Another take" is `regen({newSeed:true})` (button `ALIUD`); since
  `regen()` already calls `stop()`+`start()` around a live reseed, the
  Media Session metadata refresh comes for free — no extra call needed
  there (unlike RILLE's `finishMix()`).
- **Pattern is a copy-adapt, not a literal duplicate-verbatim** like the
  OFFICINA bridge — each machine's metadata title/op. number, transport
  function names, and "another take" equivalent differ, so every machine
  needs its own look before wiring in the three pieces (suspend-removal,
  Media Session, silence anchor).
- **Pick-up:** continue down the op. list (next: BOLG, op. VI) until all
  machines are done, or until told to stop/reassess.

### OP–XY MIDI fork — feasibility + three proof-of-concept machines (new `opxy/` tree, NOT an op.)
**Branch:** `claude/opuscula-te-opxy-midi-a5vvtf` · **Files:** `opxy/index.html`,
`opxy/README.md`, `opxy/fado-midi/index.html`, `opxy/tritava-midi/index.html`,
`opxy/cochlea-midi/index.html` · **plus one registry line:** a small banner at
the top of the landing `index.html` (its own `.opxy` style + one link to
`./opxy/`) so the fork is reachable from the main page — the maintainer asked
for it there. **Status:** done, verified headless (Chromium, 36 checks, zero JS
pageerrors). No op. cards / README rows / officina chips / file-table rows were
touched (only the one landing banner), so parallel machine-sessions don't
conflict.

Maintainer's brief: a separate version of OPVSCVLA that outputs MIDI to a
Teenage Engineering **OP–XY**, preserving just intonation / non-equal
temperaments, with the four rotary encoders steering major parameters and MPE
where needed. Researched the OP–XY (TE guide + reviews + forums), gave a
feasibility rating (≈8/10, high), then built one machine per tuning path.

- **Key research finding that reframes the whole project:** the OP–XY has a
  **native per-note tuning table** — up to 11 user tunings, each note in cents +
  micro-cents. So for any scale of ≤12 pitch-classes that repeats every octave
  (most of the collection's tuned machines) you do **not** need MPE at all: dial
  the scale into a user tuning once, then send plain MIDI notes. MPE / per-note
  pitch bend is only needed for >12-per-octave, non-octave, or drifting tunings.
- **Also confirmed:** USB-C class-compliant MIDI (TE's own updater runs over
  browser Web MIDI — so browser→OP–XY is a proven path), receives notes + CC +
  clock, pitch bend received with a calibratable range, the 4 encoders send
  assignable CCs (paged M2/M3 → 8), multitimbral 8 tracks / channel-per-track.
- **The one unconfirmed capability** (decides path B's ceiling): whether the
  OP–XY honours **voice-per-channel MPE input**. If not, path B degrades to an
  N-voice poly-channel pool. Also unconfirmed: whether the tuning table is
  12-per-octave or a full 128-note keymap (a full keymap would move DIAMOND /
  TRITAVA to path A). Both want a hardware check before scaling the fork up.
- **The MIDI-carries-pitch-not-timbre caveat** is stated in both pages and the
  README: the OP–XY's engines make the sound, tuned to each machine's ratios;
  the machines' own synthesis (odd-harmonic BP spectra, throat formants, …) does
  not travel. Both pages carry an **internal Web Audio monitor** playing the
  exact target frequencies, so the intended tuning is audible with no hardware
  and is the reference to check the device against.
- **Path A — `fado-midi/` (native tuning table).** FADÓ's Pythagorean (3-limit)
  model copied verbatim (`genAll`, `JI`, modes; progression promoted to an
  explicit param so an encoder can steer it). Generates the twelve detune values
  to dial into the OP–XY, then streams **plain** note-ons — no bend, full poly.
  Verified invariant: plain-note + table-detune reconstructs the exact JI
  frequency (max err 2.8e-13 ¢).
- **Path B — `tritava-midi/` (per-note pitch bend / MPE).** TRITAVA's
  Bohlen–Pierce model copied verbatim (`genAll`/`assemble`/`ratioToHz`, folding
  by tritaves ×3 not octaves). BP has **no octave**, so a tuning table literally
  can't hold it — the sharpest argument for path B. Each note → nearest 12-TET
  key + 14-bit bend to the exact BP freq, on its own channel. **MPE lower-zone**
  routing (master ch1, members 2–16, sends the MPE config + per-channel
  bend-range RPN on play) or a **poly-channel pool** fallback. Channel
  allocation is computed **deterministically over the score timeline** (so a
  seed always yields the same channel/bend assignment); pool exhaustion steals
  the soonest-freeing channel and truncates the previous note so streams never
  overlap. Verified: bend reconstructs exact freq (max err 0.011 ¢ @ ±2 st).
- **Path B (hardest) — `cochlea-midi/` (drifting comma pump).** COCHLEA's
  just-intonation comma pump copied verbatim (the lattice walk, named PUMPS,
  `analyse`, the comma arithmetic over {2,3,5,7}). Where TRITAVA is a scale a
  table can't *hold*, COCHLEA is a tuning a table can't *track*: the tonic is
  carried a whole comma off home every lap (`tonic *= residF`) and never
  returns, so every note's exact just frequency is recomputed against the
  **drifted** tonic and bent to it. Drift is **continuous across loops** (the
  transport carries tonic/lap between chunks; it does not reset) and shown live
  in cents. Same per-note-bend + deterministic channel allocation as TRITAVA.
  Verified: comma arithmetic faithful (syntonica = −21.51 ¢/lap, stasis = 0),
  bend reconstructs exact freq (max err 0.011 ¢), the same chord lands on a
  **different note/bend each lap** (the property a fixed table can't reproduce),
  drift continuous (86 ¢ → 172 ¢ across two chunks).
- **Four encoders → params (all pages):** CC-in via Web MIDI, per-slot editable
  CC number + a `learn` capture, values scale to each param's range, law changes
  re-vibe at the next loop. FADÓ: mode/prog/tempo/seed · TRITAVA: mode/meter/
  motion/tempo · COCHLEA: pump/tempo/drift-direction/seed.
- **Landing link:** a small `.opxy` banner under the subtitle on the main
  `index.html` (mono pill, same visual language as the `.dl` download pill)
  links `./opxy/`; `opxy/index.html` is a 3-card gallery. Minimal-diff, one new
  style block + one element — no card grid or counts touched.
- **Conventions kept:** standalone single-file pages, no build/deps; hash **is**
  the pressing; deterministic; `space`=play/stop, `r`=reseed. Web MIDI is
  Chrome/Edge only (Safari has none) — matches the Chromium-verify convention.
- **Verified headless** (`scratchpad/verify-opxy.mjs`, playwright + full chrome
  `chromium-1194/.../chrome` `--headless=new`; scratchpad not committed, per the
  GONGAN/TESSERA precedent — **36 checks**): all three pages + the landing banner
  load clean; path A tuning math + plain-note invariant + determinism + encoder;
  path B (TRITAVA) BP-has-no-octave + tritave folding + bend reconstruction +
  valid MIDI + non-overlapping channel allocation (incl. pool=2 steal stress) +
  determinism + encoder; path B (COCHLEA) comma arithmetic + drift-shows-in-MIDI
  + continuous-drift + bend reconstruction + allocation + determinism + encoder;
  the landing banner links `./opxy/`; and a **live transport smoke** against a
  fake MIDI output for all three — path A sends note-ons and **no** bend, both
  path-B pages send a bend before every note-on, all send all-notes-off on stop.
- **Pick-up ideas / next steps:** confirm MPE input + tuning-table scope on real
  hardware (decides whether DIAMOND joins path A or needs path B); a tuning-table
  exporter that writes a Scala `.scl`/`.kbm` pair per machine (path A automation);
  an MTS-ESP SysEx path if the OP–XY turns out to accept it (would beat channel
  rotation for COCHLEA's continuous retune); DIAMOND (Partch's 43-tone diamond)
  as a fourth demo — the density stress for path B's channel budget.
### App icon + universal pause button + cohesion (this branch)
**Branch:** `claude/opuscula-icon-design-1uqyt7` · **Files:** `icon.svg`,
`icon-512/192.png`, `apple-touch-icon.png`, `favicon-32.png`, `site.webmanifest`
(new, repo root); every page `<head>` (icon links); all 14 machines that lacked
one (pause button); `index.html`/`README.md` (shared-keys note + the file
table/conventions here). **Status:** done, verified headless (Chromium, all 15
machines PASS, zero pageerrors). Deliberately a **cross-machine sweep** on its
own branch (per the sweep rule) — no per-machine feature work mixed in.

- **App icon** (`icon.svg`, master; PNGs rendered from it via
  `scratchpad/render-icon.mjs`, playwright-core + bundled Chromium, scratchpad
  not committed). The catalogue's one constant graphic device is the **3px
  DOUBLE rule** (`index.html .rule`, every colophon border); the icon bends it
  into a ring — reads at once as the **O** of OPVSCVLA, a **pressed record**,
  and a **bell rim**, on the dark parchment ground (`--ground #14120f`, ivory
  `--txt`), with the **red "stamp" arc** that already recurs in the SCALA / PEAL
  / RILLE emblems, and a centre spindle. No text; legible 512→16px (at 16px the
  double ring merges to one — accepted; the detail is for home-screen/PWA).
  Wired into all 17 pages with **relative** hrefs (`./` root, `../` machines —
  this is a project-pages site, NOT domain root; root-relative would break).
  `site.webmanifest` is one catalogue-level manifest (icon `src` relative to its
  own root URL, so it's correct from every page that links `../site.webmanifest`).
- **Pause button on every machine.** RILLE already had one; extended its exact
  pattern to the other 14. Each: a secondary button beside play, **labelled in
  the machine's own tongue** (MORA/PERGE Latin · SOS/AR AGHAIDH Irish ·
  PAUSE/REPRENDS French · PAUSE/WEITER German · Pause/Resume English), disabled
  until playing, highlighted (`.on`) while held; **`p`** key added to the shared
  claves (no collisions — `p` was free everywhere). The mechanism is
  `ctx.suspend()`/`resume()`: every transport and canvas here is keyed off
  `ctx.currentTime`, which freezes while suspended, so play position and visuals
  hold and resume exactly. **Two gotchas handled:** (1) the iOS unlock `kick()`
  auto-resumes any non-running context on gesture/visibility — guarded with the
  machine's paused-intent flag (`st.paused` / `live.paused` / `paused`) so it
  can't undo a deliberate pause (COCHLEA/BOLG also bail their `kick`/`updateHint`
  when paused, so the SUSPENSUM hint doesn't show during a pause). (2) **NENIA**
  is the exception — its playhead runs on `performance.now()`, not ctx time, and
  it auto-stops on a wall-clock `setTimeout`; pause freezes the playhead at
  `pausedAt`, resume slides `playStart` forward by the paused span and reschedules
  the stop timer for the time that remained.
- **Cohesion tweaks (small, as invited):** the shared-keys note now lists
  **p = pause/resume** everywhere it was enumerated — landing `index.html .notes`,
  `README.md` shared grammar, each machine's in-page keys line + colophon, and
  the Conventions bullet here. A `button:disabled`/`.pick:disabled`/etc. opacity
  rule was added where a machine had none, so the disabled pause reads inactive.
- **Verify:** `scratchpad/verify-pause.mjs` drives every machine play → pause →
  resume → stop headless, asserting the button is disabled before play, enabled
  after, shows the resume-word when paused and the pause-word when resumed,
  disabled again after stop, and **zero pageerrors** (font-CDN-under-proxy noise
  filtered, per precedent). All 15 PASS.
- **Pick-ups:** a maskable-icon variant (safe-zone padding) for Android adaptive
  icons if wanted; per-machine `apple-mobile-web-app-title` so an installed
  machine names itself; the icon's red arc is nearly invisible at 16px — a
  bolder favicon-only rendering is possible if the tab-strip mark matters.

### State of the branch farm — parallel-work snapshot (2026-07-17)
**Branch:** `claude/handoff-concurrent-changes-9uuwm8` (also added the
"Working in parallel" section above). Inventory of every `claude/*` branch on
origin at writing time; a session that lands, rescues, or deletes one of
these should update this entry.

- **op. XV double-claim resolved: DIAMOND landed first, keeps op. XV.**
  `claude/new-machine-concept-uap0bi` shipped `diamond/index.html` (Partch
  tonality diamond) and merged to `main` — see the DIAMOND thread below.
  `claude/dubstep-machine-scaffolding-jcz8a9` (SUBLOW — dubstep / sound
  system; `sublow/index.html` scaffolded + `sublow/NOTES.md`) was still
  unlanded as of DIAMOND's merge (confirmed against the live branch list) —
  per the claiming rule it **renumbers to op. XVI** at its next rebase.
  Directories don't collide, so no file conflict either way.
- **Stale but carrying unlanded work:** `claude/orientation-3k25et` has a
  KHÖÖMEI change never landed ("breathe — dynamic drone + real breath
  pauses", +50/−15 in `khoomei/index.html`), now ~57 commits behind — rescue
  by rebasing (expect conflicts with the TIMBRE hoist) or re-implement, or
  drop. `claude/project-handoff-guide-7l2awu` adds per-machine
  `docs/works/*.md` handoffs — an approach superseded by this file;
  recommend deleting.
- **Dead — no merge base (pre-rewrite history), cannot be merged:**
  `claude/404-page-load-error-3da6u0`, `claude/cleanup-and-docs-sizjmt`.
  Their surviving ideas (exit-to-landing link, PEAL acoustic switcher)
  already landed on main independently; recommend deleting both.
- **Merged into main, safe to delete:** `banjo-loop-sound-design-qjlfm4`,
  `minimal-deep-tech-guide-ta175d`, `new-machine-design-y66pvl`,
  `opuscula-general-leuzu2`, `project-working-conventions-hlurpe`,
  `project-working-conventions-xjaafw`, `rille-chord-dissonance-io1zr6`,
  `rille-hiss-pause-4dojix`, `rille-tonal-composition-n8zfie`,
  `voice-synthesis-settings-ifeuah` (all `claude/…`). Branch deletion is the
  maintainer's call — sessions shouldn't delete branches they don't own.
### OFFICINA + TIMBRE rollout — done, verified, this branch
**Branch:** `claude/voice-synthesis-settings-ifeuah` · **Files:** all 13
machines, `officina/index.html`, landing colophon link, README section.
**Status:** done; every machine verified headless (defaults match the old
literals exactly, zero pageerrors, bridge round-trips, bench sweep passes).

Param counts: PAS SALÉ 48 · SCALA 15 · GRADUS 13 · RILLE 43 · COCHLEA 24 ·
BOLG 25 · PEAL 13 · HOLLER 25 · FOLI 43 · NENIA 12 · KHÖÖMEI 45 · SPANNUNG 40
· TAMBOUR 41. Mixer-style tables (FOLI/TAMBOUR `VOICES` gains, PAS SALÉ
`LEVEL`, COCHLEA/BOLG `NOMINAL`/`SENDS`) moved into TIMBRE (aliased where the
code reads them by the old names). GRADUS and NENIA are one-shot performers —
no touch hook, edits apply on the next play (stated in their TIMBRE docs).

Fixed along the way: **KHÖÖMEI and SPANNUNG called `saveWav()` without
defining it — their WAV cut was broken in production.** Added the shared
saveWav pill verbatim to both.

Noticed, pre-existing, NOT touched: **PAS SALÉ's full-song WAV cut renders
super-linearly in node count** (8 s of song ≈ 1 s render, half the song ≈
95 s; the full 116 s song takes many minutes headless). All ~3.5k events'
nodes are created up front in one OfflineAudioContext. If it matters, chunk
the schedule or render in segments. (RILLE's 120 s plate cuts in ~60 s —
fine.) Also: the offline render measured peaks ≈1.06 pre-encode there
(encodeWav clamps) — the -14 dB/3:1 comp lets transients through.

Pick-ups: an OFFICINA "export everything" (all machines, one JSON); a
hashchange listener in the bench (deep links work on load; switching machines
mid-session is chips-only); per-param A/B rather than whole-voice.


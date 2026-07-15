# OPVSCVLA — project handoff & conventions

> **How to load this:** this file does **not** auto-load — it lives at
> `docs/HANDOFF.md`, not root `CLAUDE.md`, on purpose. Start a code chat by
> pointing Claude at it (see "Starting a chat" below). Read this once; then read
> **only** the one file under `docs/works/<name>.md` for the work you're
> touching. Do **not** read a whole 40–60 KB `index.html` just to orient — the
> per-work file plus the header comment block inside each file's `<script>`
> already summarize the engine.
>
> **Starting a chat:**
> - *Global / architecture / new work / cross-cutting:* `Read docs/HANDOFF.md`.
> - *One machine (e.g. Bolg):* `Read docs/HANDOFF.md and docs/works/bolg.md`.

**What this is:** twelve self-contained web-audio pieces ("small musical
machines"), op. I–XII. Each is one `index.html` of vanilla HTML/CSS/JS Web
Audio. No build, no framework, no dependencies, no samples, no trackers. Live at
https://cupofghost.github.io/opuscula/ (GitHub Pages, served from repo root).

## The catalogue

| op. | folder | in one line |
|-----|--------|-------------|
| I | `pas-sale/` | Zydeco two-step, G/148. **Fixed form**, not seeded. |
| II | `scala/` | Shepard–Risset glissando in just intonation. |
| III | `gradus/` | Species counterpoint after Fux (1725); 6 rule toggles. |
| IV | `rille/` | Minimal techno; **German UI, non-English code ids**. |
| V | `cochlea/` | Just-intonation comma pump; exact fraction math. |
| VI | `bolg/` | Generative uilleann piping; septimal 7/4 chanter. |
| VII | `peal/` | English change-ringing; verified-**true** methods & touches. |
| VIII | `holler/` | Old-time banjo, 5 right hands; Karplus–Strong. |
| IX | `foli/` | Mande djembe/dunun ensemble + composed solo. |
| X | `nenia/` | Playground chant; sol–mi–la; the hash **is** the rhyme. |
| XI | `khoomei/` | Mongolian throat singing; one voice, two pitches. |
| XII | `spannung/` | Self-patching modular synth; 16-step Eurorack. |

## Non-negotiable principles (these are the taste of the project)

1. **Synthesis only — never a sample.** Every sound comes from oscillators,
   noise, Karplus–Strong strings, or modelled struck membranes/bells. If a fix
   would need a sample, it's the wrong fix.
2. **One file, no dependencies.** Each work is a single `index.html`. The only
   external fetch is Google Fonts (EB Garamond + IBM Plex Mono; the landing page
   adds Cormorant SC). No npm, no bundler, no CDN libraries.
3. **Determinism.** Seeded works use `mulberry32` — a seed reproduces the piece
   exactly. Pas Salé is the exception (fixed form; "another" reshuffles).
4. **The WAV must BE what you hear.** The offline "cut" re-renders the *same
   graph* through an `OfflineAudioContext` to a 16-bit WAV. Signal path must be
   identical to realtime. A cut that doesn't match is a bug — see the Pas Salé
   windowed-render revert. Don't ship an unfaithful render.
5. **The URL hash is the pressing.** Every control — seed included — serializes
   into `location.hash`. Copy the address bar → the exact opus reloads anywhere.
6. **Musical authenticity is the whole point.** Just ratios are exact; peals are
   verified true; bell partials are real; names are in the music's mother tongue.
   When unsure, match the tradition, not a convenient approximation. Each work
   carries an expandable **"on this music"** reader panel — keep it accurate.

## Shared architecture (identical across all works)

Every file, top to bottom, is: **PURE ENGINE** (composition + tuning + WAV
encode; no DOM, no Web Audio — often fenced `ENGINE-BEGIN…ENGINE-END`) →
**state** → **audio graph** (synth voices) → **realtime transport**
(look-ahead scheduler) → **WAV cut** (OfflineAudioContext) → **canvas** (the
visualization "plate") → **controls** → `__iosAudio` → **hash + keys** → init.

- **`__iosAudio(ac)` / `__hint(msg)`** — identical boilerplate in every work.
  Requests the `'playback'` audio session (ignores the iOS silent switch on
  Safari 17+), plays a silent blip to open the pipe on first gesture, resumes
  after interruptions, **suspends on `visibilitychange`/`pagehide`** (stops audio
  when backgrounded), re-kicks when visible. Skim past it — it's plumbing.
- **`readHash` / `writeHash`** — `#k=v&k=v`, values `encodeURIComponent`'d,
  written with `history.replaceState`. An `__applying` guard stops the hash from
  being rewritten while a loaded hash is being applied. `sd` = seed.
- **Keys** (bottom of every file): `space` = play/stop · `r` = another
  (aliud/alia/encore/another tune) · `c` = cut a WAV. Ignored when focus is in
  an INPUT/TEXTAREA/SELECT.
- **`saveWav()`** — shared. On Safari/iOS a programmatic download is blocked, so
  the WAV surfaces as a **tappable "Save" pill** rather than auto-downloading.
- **`mulberry32(seed)`** — the tiny seedable PRNG. Same everywhere.

### Two execution models — know which one a work uses before you touch playback

- **Live re-vibe** (controls take effect on the fly; music keeps running,
  re-vibes at the next bar): **Scala, Rille, Peal** (key & speed), **Khöömei,
  Spannung**.
- **Through-composed** (any control change *regenerates* the piece and restarts —
  it's a composition, not a loop): **Gradus, Cochlea, Bolg, Pas-Salé, Holler,
  Foli**. Nenia regenerates the rhyme.

## House style

- **Visual identity:** dark, warm — parchment ink `#e9e2d2`/`--txt` on
  near-black; **EB Garamond** serif body, **IBM Plex Mono** for uppercase
  eyebrows/labels/readouts, per-work accent color (gold, etc.). Each work owns
  its palette but the *structural* CSS (`.exit`, `.plate`, `.controls`, `.chips`,
  `.reader`, `footer`) is shared boilerplate — keep it consistent. Roman-numeral
  opus numbers; "OPVSCVLA" uses classical V-for-U.
- **Accessibility/perf:** `prefers-reduced-motion` disables animation/transitions
  everywhere; canvas render loops **sleep when idle** and cap ~30fps; notation is
  layer-cached; `aria-label`s on canvases; `env(safe-area-inset-*)` for notches.
- **Sticky `.exit` pill** ("← opvscvla") top-left of every work links to `../`.
- **Localization rule (critical, Rille especially):** UI strings may be in the
  music's language, but **code identifiers/keys/ids stay in their original
  tongue — never rename them.** In Rille the object keys and mood ids are Latin
  (`fundus`, `bassus`, `crepitus`, `tenebrae`…); only display `name`/`gloss`
  strings are German. Editing a shown string is safe; renaming an id breaks logic.

## The recurring feedback loop (what the user actually asks for)

After a work is built, the notes are almost always **mix legibility**, not
features. The pattern, from the commit history:

- **Every voice must be legible.** "make the regulator vamp actually audible,"
  "de-clash the boom-chuck guitar," parts must not mask each other.
- **The drone/bass is the ground.** "lift the drone so it reads as the ground
  under the chanter."
- **Restraint on space.** "dial back the reverb so strikes don't muddy,"
  "tighter bell decay." Reverb serves clarity, not size.
- **Loops must be seamless.** "fold decay tails over the loop point."
- **Idiomatic ceilings.** e.g. Holler's tempo ceiling was raised 176→260 bpm to
  reach real old-time speeds.

When making an audio change, **listen to the result end-to-end** (or reason about
the full signal path) before declaring it done; the user hears clashing/masking/
muddiness that a code diff won't reveal.

## Workflow & git

- Commit style: **`Work: lowercase imperative`**, evocative and specific —
  `Bolg: lift the drone so it reads as the ground under the chanter`. New works:
  `Add op. N NAME — <description>`.
- Feature branches are named `claude/<slug>`; work merges to `main` via PR.
  Develop on the branch you're told; don't push elsewhere without asking.
- Don't open a PR unless asked.

## Known gotchas / open items

- **Stale work counts.** The landing `index.html` meta description says "eleven"
  and an internal comment says "ten" — there are **twelve**. Counts have drifted
  before ("fix stale 'four works' count"). Check them when adding a work.
- **Pas Salé WAV render.** A windowed/full-song render was attempted and reverted
  as "not sound-faithful yet" — an open problem. Any Pas Salé cut must match the
  realtime sound before shipping.
- Localized cut-button names per work (Cochlea `SECO`, Bolg `GEARR`, etc.) — the
  `#cut` element id is stable even when the visible label is translated.

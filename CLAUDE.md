# CLAUDE.md

Orientation for OPVSCVLA. **Read `HANDOFF.md` first** — but only its lean top
matter (architecture, key decisions, file structure, conventions, quality bar,
workflow, TIMBRE/OFFICINA) plus the one machine in your scope. Each machine is
self-contained; you don't need the other machines' code or history. Priority is
shipping with **minimal token usage**. This file pins the working conventions so
a session follows them without being re-told.

## Working process

- **The maintainer commits to `main`; agents open PRs.** Every task — plan a
  machine (a design brief for another agent), build a machine, or improve one —
  ends by opening a PR the maintainer reviews and merges. Never push to `main`,
  never merge your own PR.
- **Sessions run in parallel** and `main` will have moved since you began.
  Follow the **Workflow** section of HANDOFF.md: fetch + rebase onto
  `origin/main` at session start *and* again before you PR (local `main` is a
  stale clone-time snapshot); one session = one branch = one scope; a merged PR
  is finished, never resumed; opus numbers are provisional until *merged* —
  take the next free numeral from `origin/main`, flag it provisional in the PR,
  and expect the maintainer to settle final numbering at merge.
- **Don't ship low-quality code.** Meet the Quality-bar checklist in HANDOFF.md
  end to end and verify headless before you PR; match the maintainer's reference
  machines (BOLG, DIAMOND, TESSERA, FADÓ, TENEBRAE). If you can't clear the bar
  in the token budget, ship less scope well and note the rest in the machine's
  `THREADS.md`.
- Your **session record** goes at the **top** of a `THREADS.md` — your machine's
  `<machine>/THREADS.md` for machine work, the repo-root `THREADS.md` for a
  cross-cutting change. In HANDOFF.md touch only the minimal fixed-section lines
  your change needs, and never reflow sections you didn't work in. Registry
  files (`index.html`, `README.md`, HANDOFF file table, officina `MACHINES`) get
  minimal-diff rows only. Cross-machine sweeps (e.g. the duplicated OFFICINA
  bridge) go on a dedicated branch that does nothing else. OFFICINA is otherwise
  improved per-machine: token-light bench fixes ride along in the machine's PR,
  token-intensive ones are noted in the machine's `THREADS.md` and left.
- **Keep orientation current in your PR** without being asked: HANDOFF.md when
  architecture / decisions / file structure / conventions change, and your
  per-session record at the top of the relevant `THREADS.md`. Don't ask the
  maintainer to re-explain.
- During iteration, output **patches/diffs, not full-file rewrites.** Emit a
  whole file only when creating it, or when changes exceed ~50% of it.
- **Don't restate the request or recap prior turns.** Answer directly.
- **Keep scope to the module in play**, and flag when we've drifted.
- If a large file is pasted but only part is needed, work from that part —
  don't reproduce the whole file back.

## Repo shape (see HANDOFF.md for detail)

- Twenty-eight independent single-file Web Audio machines (`op.` dirs) + `index.html`
  landing page. **No build, no bundler, no deps, no npm, no samples, no server.**
- Machines share a design *grammar*, **not code** — each `index.html` is
  deliberately standalone. Don't factor shared code across machines. (One
  deliberate exception: the ~25-line OFFICINA timbre bridge is *duplicated
  verbatim* in every machine — see the TIMBRE/OFFICINA section in HANDOFF.md.)
- Every machine's synthesis constants live in its `TIMBRE` block; the code
  reads `TP.<group>.<param>`. `officina/` (backstage, not an op.) edits them
  live. Don't reintroduce magic numbers into voice code; factory defaults in
  TIMBRE must equal the values they replace.
- Deterministic + shareable: seeded generation, the URL hash *is* the pressing,
  offline WAV render is deterministic.
- The `op.` roman-numeral order lives in `index.html`, `README.md`, and
  `HANDOFF.md` — keep all three in sync when adding a machine.

## Verifying audio work

Verify **headless (Chromium)**: enumerate the model for correctness, then
smoke-test the transport/scheduler and the offline render for runtime errors.
See `rille/THREADS.md` for the pattern.

## Git

Develop on your `claude/*` branch, commit with descriptive messages (the
music-theory / design reasoning lives there), and **open a PR** — every task
ends in a PR the maintainer reviews and merges. Never push to `main`, never
merge your own PR. Rebase onto `origin/main` before you PR; on a `THREADS.md`
conflict keep both sides' `###` entries, and re-merge any HANDOFF fixed-section
lines by hand.

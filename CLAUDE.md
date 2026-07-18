# CLAUDE.md

Orientation for OPVSCVLA. **Read `HANDOFF.md` first** — it is the complete brief
(architecture, key decisions, file structure, conventions, open threads). This
file only pins the working conventions so a session follows them without being
re-told.

## Working process

- **Sessions run in parallel** — other chats are landing other branches on
  `main` right now. Follow the **"Working in parallel"** section of
  HANDOFF.md: fetch + rebase onto `origin/main` at session start *and* again
  before pushing (local `main` is a stale clone-time snapshot); one session =
  one branch = one scope; a merged branch is never resumed; opus numbers and
  directories are claimed by *landing*, not by designing — re-check the
  registry at every rebase and renumber if someone landed first.
- In HANDOFF.md, touch only your own Open-threads entries (added at the
  **top**) plus the minimal lines your change needs in fixed sections. Never
  reflow sections you didn't work in. Registry files (`index.html`,
  `README.md`, HANDOFF file table, officina `MACHINES`) get minimal-diff
  rows only. Cross-machine sweeps (e.g. the duplicated OFFICINA bridge) go
  on a dedicated branch that does nothing else.
- **Keep `HANDOFF.md` current.** Update it at the **end of every session**
  without being asked — architecture, key decisions, file structure,
  conventions, and open threads. It is the single source of orientation; a new
  chat starts by pasting it plus the files in scope, so treat that as complete
  and don't ask the maintainer to re-explain.
- During iteration, output **patches/diffs, not full-file rewrites.** Emit a
  whole file only when creating it, or when changes exceed ~50% of it.
- **Don't restate the request or recap prior turns.** Answer directly.
- **Keep scope to the module in play**, and flag when we've drifted.
- If a large file is pasted but only part is needed, work from that part —
  don't reproduce the whole file back.

## Repo shape (see HANDOFF.md for detail)

- Seventeen independent single-file Web Audio machines (`op.` dirs) + `index.html`
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
See the RILLE threads in HANDOFF.md for the pattern.

## Git

Develop on the feature branch, commit with descriptive messages, push. The
music-theory / design reasoning tends to live in the commit message. **Don't
open a PR unless asked.** Rebase onto `origin/main` before every push; on a
HANDOFF.md conflict, keep both sides' Open-threads entries and re-merge fixed
sections by hand.

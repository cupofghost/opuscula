# dev/ — OPVSCVLA tooling

Dev-only helpers. **None of this ships with the machines** — every `op.` stays
one self-contained `index.html` with zero dependencies. This directory just
lets an agent verify a machine holds the house contract without hand-writing a
playwright harness every session (which is what the ignored `scratchpad/`
`verify-*.mjs` files used to be).

Node 22+. From the repo root:

```sh
cd dev && npm install          # once; installs playwright (gitignored)
npx playwright install chromium # once; the browser CI/local needs

node dev/verify.mjs             # verify every machine
node dev/verify.mjs bolg rille  # verify named machines
node dev/verify.mjs --quick     # skip the play/cut runtime checks (fast)
node dev/verify.mjs --list      # list discovered machines

node dev/check.mjs              # bridge + registry + numbering drift
node dev/check.mjs --next       # print the next free op. numeral (e.g. XXIX)
```

CI (`.github/workflows/ci.yml`) runs both on every PR and on `main`. **Green is
the merge signal** — the maintainer merges PRs, so let CI carry the mechanical
Quality-bar checks instead of hand-verifying each one.

## `verify.mjs` — the harness

Drives every machine through the parts of the house grammar that are guaranteed
identical across all of them, so one harness covers all machines with no
per-machine wiring:

| check | how | what it proves |
|---|---|---|
| `loads-clean` | load `?factory` | no uncaught error / `console.error` on boot |
| `bench-schema` | load `?bench`, read the postMessage schema | TIMBRE schema is well-formed, `id === <dir>`, every param has numeric `v/min/max/step` + a `label` |
| `plays-clean` | press **space** | the shared transport starts an AudioContext with no error |
| `cut-renders-wav` | press **c** | the offline render produces a real RIFF/WAVE download |

A machine may add an **optional** `<machine>/expected.json` for extra assertions
(group/param counts, required substrings) — see `template/expected.json`. No file
means only the generic checks run.

## `check.mjs` — static drift

Catches the two silent-drift classes a many-agent repo accumulates:

- **Bridge identity** — the ~25-line OFFICINA bridge is duplicated verbatim in
  every machine. The checker groups machines by their (whitespace-normalized)
  bridge and flags any copy that has drifted from the majority.
- **Registry agreement + numbering** — every machine must appear in all four
  registries (landing card, README row, officina chip, HANDOFF file table), the
  HANDOFF table must have no missing/extra machines, and op. numbers must be
  unique with no gaps. `--next` prints the next free numeral for the maintainer
  to stamp at merge.

## `template/` — the house shell

`template/index.html` is a **minimal but complete** machine: it loads clean,
serves a bench schema, plays on space, and cuts a WAV — so it passes
`verify.mjs` from the first commit. Copy it to `<machine>/index.html` and fill in
the `TODO(law) / TODO(voices) / TODO(canvas) / TODO(reader)` markers. Leave the
SHARED blocks (OFFICINA bridge, `__iosAudio`, Media Session, `saveWav`, the
keyboard grammar) as they are; `check.mjs` enforces the bridge stays verbatim.

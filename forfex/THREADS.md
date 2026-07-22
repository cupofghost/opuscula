# forfex — session threads

Development history for the `forfex/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### FORFEX — new machine, op. XXI (early tape splicing)
**Branch:** `claude/tape-splicing-machine-os3bbj` · **File:** `forfex/index.html` ·
**Status:** done, verified headless (Chromium, 24 checks, zero pageerrors). New
op. Registered in `index.html` (card + counts), `README.md` (row + count),
`officina` (chip), `CLAUDE.md`/this file (file table + counts); counts bumped
to twenty-one everywhere. **Renumbered XX → XXI at landing:** `germen/
index.html` had already landed on `main` (a direct upload, see the thread
above) self-declaring "op. XX" in its own title/colophon before this branch's
registration, so per the claiming-by-landing rule this took the next numeral
instead. **Also fixed stale counts:** `CLAUDE.md`'s Repo-shape line and this
file's own Architecture line were still "eighteen" (TRITAVA's landing bumped
the registries but missed these two prose lines; a Copilot cleanup PR then
bumped them to "nineteen") — both now read "twenty-one" with GERMEN+FORFEX
both landing this session. Maintainer's brief: a new machine based on early
tape splicing, generated rather than sampled, with a creative solution for
the sound. One-session build (design + implement + verify + register), full
autonomy.

**Also worth flagging, discovered but out of this session's scope:** a
Copilot agent commit (`2ae7687`, "Changes before error encountered", part of
the same cleanup PR that landed the officina-pill sweep below) mistranslated
`pas-sale/index.html`'s French transport UI to English mid-task before
erroring out — ROULEZ/ARRÊTE/REPRENDS/"autre version pressée" became PLAY/
STOP/RESUME/"another version pressed". PAS SALÉ is deliberately French (op.
I, zydeco, the collection's mother-tongue-per-genre rule). Left untouched
here — not this branch's machine — but it's a real regression sitting on
`main` and someone should revert those four strings.


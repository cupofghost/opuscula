# persona — session threads

Development history for the `persona/` machine, newest first. Orientation and
conventions live in the repo-root `HANDOFF.md`; this file is just the log. When
you touch this machine, add your new entry at the **top**, under its own `###`
heading (same format as the others).

---

### PERSONA — drop the source citation, keep the concept (op. XXIX)
**Branch:** `claude/persona-machine-concept-s93z46` · **File:** `persona/index.html`
(prose/comment-only, no synthesis or animation logic changed). **Status:** done,
verified headless (`node dev/verify.mjs persona` — loads-clean · bench-schema
5/28 · plays-clean · cut-renders-wav; `check.mjs` clean).

Maintainer likes the machine but not that it names and cites its source video:
"the concept is only funny if it obviously comes from there but doesn't mention
it." Refocused the whole page on the concept played straight — a **pop-star
android who sings cheerful affirmations** — and stripped every textual reference
to the source.

- **Removed** from meta description, sub-heading, the six reader-note paragraphs,
  and three code comments: the video's title, its creator's name, the android's
  proper name, the year, the YouTube-upload/meme framing, and the phrases
  "the video" / "the original." Where a paragraph leaned on the proper name as
  its subject ("Tara does none of this"), swapped to the pronoun; the technical
  content it carried (formant synthesis, DECtalk/Speak & Spell, Peterson &
  Barney formant tables, Mori's uncanny valley) is all general and stayed.
- **Deliberately kept** the *sung* content unchanged — the `i feel fantastic /
  hey hey hey` refrain and the `run · please leave` cracks. That is the concept
  *performing itself*, not a citation: it's precisely what makes the piece
  "obviously come from there" without the page ever naming the source. Cutting
  it would defeat the joke.
- **Left the animation alone** on request (maintainer is having Kimi redo it) —
  only reworded the one prose/comment line that attributed the head-and-hands
  economy to "the video," not the canvas code itself.

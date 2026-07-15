# op. X — NENIA · `nenia/`

**Playground lore.** Named in Latin (*nenia*, the small jingle beneath
literature). The universal children's chant.

- **Concept:** built on the **sol–mi–la trichord** (the taunt tune every child
  knows). Five games — **taunt, counting-out, clapping, skip rope, ring** — each a
  fresh nonsense rhyme generated from **reduplication-and-ablaut**, sung by a yard
  of **detuned formant child-voices.**
- **Behaviour that mirrors the game:** counting-out **really eliminates**;
  clapping and skip rope **accelerate until the seed trips them.**
- **The URL hash IS the rhyme** — the serialized state is the poem itself.
- **Execution model:** regenerates the rhyme; **seeded** (`mulberry32`); `r` =
  another. Shared conventions: sticky `.exit`, `<details>` reader, `saveWav` pill,
  `__iosAudio`, ≤30 fps canvas.

### Watch-outs
- The **lore banks** (word/rhyme material) were enriched for more rhyme + melodic
  variety and for consistency — when editing them, keep the reduplication-and-
  ablaut structure and the sol–mi–la contour intact.

## Hash params — positional, dot-separated (`#v.seed.game.kids.key.tempo.yard.flags`)
Not `key=value`. Eight fields joined by `.`; field 0 must be `1` (schema version).
| pos | field | values |
|-----|-------|--------|
| 0 | version | must be `1` |
| 1 | seed | base-36 (`mulberry32`) |
| 2 | game | 0–4: taunt, counting-out, clapping, skip rope, ring |
| 3 | kids | 3–8 |
| 4 | key | 0–3 |
| 5 | tempo | 80–140 |
| 6 | yard | 0/1 (yard of voices) |
| 7 | flags | bit0 `rowdy`, bit1 `gig` |

*The hash literally **is** the rhyme — the serialized state reproduces the exact chant.*

# op. III — GRADUS · `gradus/`

**Generative species counterpoint after J. J. Fux, *Gradus ad Parnassum* (1725).**

- **Concept:** the machine lays down a cantus firmus (slow given melody), then
  writes a second voice against it by **weighted-random depth-first search that
  backtracks** when it paints itself into a corner.
- **The interface is the rules:** six **REGULAE** toggles are counterpoint rules
  (no parallel fifths, etc.). Toggling them changes the law the search must
  satisfy — turn off parallels and it writes medieval **organum** instead of
  strict Fux.
- **Execution model:** through-composed — `r` / any control regenerates the score.
- **Seeded** (`mulberry32`) — a seed reproduces a score.
- **Visualization:** canvas **engraves the score as notation**; layer-cached,
  sleeps when idle.
- **Structure:** helpers/PRNG → `ENGINE-BEGIN…ENGINE-END` (cantus firmus →
  counterpoint search; pure, no DOM/audio) → state & driver → notation plate →
  audio → WAV → UI → permalink.

## Hash params (`#s=&m=&sp=&v=&c=&l=&t=&r`)
| key | control | values |
|-----|---------|--------|
| `s` | seed | hex (`mulberry32`) |
| `m` | mode (modus) | index: `dorius, phrygius, lydius, …` |
| `sp` | species | `1`–`4` (I–IV, `data-s`) |
| `v` | voice placement | `1` infra (below) · `0` supra (above) |
| `c` | cantus firmus source | `1` fux · `0` novus |
| `l` | length (longitudo) | 8–13 brevia (default 11) |
| `t` | tempo | slider value |
| `r` | rule bitmask | 6 RULEDEFS: `parallels, direct, crossing, leapfix, contrary, climax` |

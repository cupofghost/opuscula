# op. I — PAS SALÉ · `pas-sale/`

Zydeco two-step for a synthesized Creole band, **G major, 148 bpm**.

- **Concept:** a full band — accordion, frottoir (rubboard), guitar, bass, drums —
  playing a two-step. Named *pas salé* ("salty step").
- **Engine (the exception to the house rule):** **NOT seeded-random.** A fixed
  **70-bar song form** is compiled into a flat, time-sorted event list, then
  synthesized. The **ENCORE!** button (`r`) reshuffles small variations of that
  form — it is not a fresh seed.
- **Execution model:** through-composed. Any change rebuilds the event list.
- **Synthesis:** oscillator/noise voices per instrument; accordion reeds, frottoir
  scrape, drum kit — all from scratch.
- **Structure in file:** pitch utils → material (melody/drums/bass/guitar) → FORM
  → compiler (form→events) → synthesis → transport (live + WAV) → encore/permalink.

### Known issues / watch-outs
- **WAV cut is an open problem.** A windowed/full-song offline render was built and
  **reverted** ("not sound-faithful yet"). The cut must reproduce the realtime
  sound before shipping — don't re-land an unfaithful render.
- Because it's fixed-form, don't add a "seed" control expecting mulberry32
  reproducibility; the reproducibility here is the form itself.

## Hash params (`#s=&t=&m`)
| key | control | values |
|-----|---------|--------|
| `s` | song seed | hex; reshuffled by ENCORE (not a mulberry32 seed) |
| `t` | tempo | 120–168 bpm (default 148) |
| `m` | mute bitmask | bits in order `acc, frot, dr, bs, gt` (accordion, frottoir, drums, bass, guitar) |

*No seed-reproducibility knob — the fixed 70-bar form is the reproducibility.*

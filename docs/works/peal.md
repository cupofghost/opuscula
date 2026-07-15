# op. VII — PEAL · `peal/`

**English change-ringing.** Tower bells ring **permutations, not tunes.**

- **Concept:** start in "rounds" (bells in order 1·2·3…N), and each "change" swaps
  neighbouring bells by a rule called a **method**. Ring change after change
  without repeating a row and you eventually come back to rounds — a Hamiltonian
  path through the permutations. Applied group theory you can hear. (Mirror of
  Cochlea: a peal always comes round.)
- **Methods:** Plain Hunt, Plain Bob, Grandsire, Reverse/Double Bob — on **5–12
  bells** (Doubles through Maximus). The **"blue line"** traces one bell.
- **The conductor / touches:** on Plain Bob a conductor calls **Bobs and Singles**
  at lead ends to splice courses. Truth matters — **no row may be struck twice** —
  so touches are found by a **depth-first search that backs out** the instant a
  lead would repeat a row. **Every method and touch is verified true by
  construction.**
- **Bell synthesis:** each bell is a stack of decaying partials at **real
  tower-bell ratios** — hum ½, prime 1, minor-third **tierce**, quint, nominal 2×
  — which is why bells sound faintly minor even in a major ring. Each pitch is
  pre-rendered once into a buffer, then struck.
- **Acoustic switcher:** Dry → Chapel → Church → Nave.
- **Execution model:** **live** — key and speed re-vibe without restarting.

### Mix notes (recurring)
- Reverb was **dialled back** so strikes don't muddy; **bell decay tightened.**
  Keep space in service of clarity.

**Engine band is pure:** method + N + start row → sequence of permutations, no
DOM/audio, provably true.

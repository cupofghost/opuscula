# TENEBRAE · OFFICIUM — the brief for op. XXIV (provisional)

**Status: design complete, implementation NOT started.** This file is the
whole design; a later session implements from it. Written in the style of
`diamond/GENESIS.md` / `rille/HARMONIA.md` (the house precedent for a
no-code brief). The file is named after Victoria's *Officium Hebdomadae
Sanctae* (1585), the book this machine lives inside — **delete this file
when the machine ships** and fold the result into the HANDOFF thread.

No code below — tables, laws, and acceptance criteria only. Where a
concrete constant appears it is a *baked default* the implementer copies
into TIMBRE or the engine; where a range appears the implementer tunes by
ear within it and records the choice in the HANDOFF thread.

The opus number is **provisional** (XXII = FADÓ is the last shipped
machine at design time; the RICERCAR brief landed first and holds XXIII
provisionally). Per the claiming-by-landing rule, re-check the registry at
every rebase; the directory name `tenebrae/` is what this brief claims.

---

## 1 · What this machine is

**TENEBRAE — the office of darkness, sung by a machine.** Renaissance
sacred polyphony, narrowed to one specific liturgical order: **Tenebrae**,
the pre-dawn Matins of the last three days of Holy Week, and narrowed
again to **one day** — Good Friday (*Feria Sexta in Parasceve*) — and its
**nine responsories**, the texts Tomás Luis de Victoria set in the
*Officium Hebdomadae Sanctae* (Rome, 1585). The user picks a responsory
(I–IX) and a mode; the machine composes a new four-voice setting of that
responsory's actual Latin text in strict sixteenth-century counterpoint —
imitation points, chordal declamation, prepared suspensions, ficta at the
clausula — and sings it on synthesized voices in a stone chapel, exact
just intonation end to end.

The office itself is the machine's second law. Tenebrae is defined by a
piece of liturgical furniture: the **hearse**, a triangular stand of
fifteen candles, one extinguished after each psalm until a single flame
remains, hidden behind the altar, and the office ends in darkness with the
**strepitus** — a violent noise, the earthquake at the death of Christ.
The candle count at any responsory is *fixed by the rubric*, so the
machine's light — canvas and timbre both — darkens across the nine
pressings on a schedule that is verifiable, not stylistic.

Naming follows the catalogue rule (each machine named in the tradition's
own tongue): the liturgy's tongue is Latin, and *tenebrae* — darkness —
is the office's own name. Directory `tenebrae/`, `TIMBRE.id =
'tenebrae'`, op. XXIV (provisional).

Why this and not another vocal machine: the catalogue sings already
(NENIA's playground, KHÖÖMEI's throat, VYVID's steppe, FADÓ's mezzo), and
GRADUS already enforces counterpoint — but GRADUS is the *classroom*
(Fux's 1725 species exercises, two voices over a cantus firmus, the rules
abstracted for pedagogy). TENEBRAE is the *living practice those rules
were distilled from*: four voices, real liturgical text driving the
rhythm, imitation points, a form imposed by the rite, Counter-Reformation
homophony, and an ending the liturgy itself scripts. The law here is the
office, not the exercise.

## 2 · Grounding (the research, condensed)

- **Tenebrae** ("darkness") is the popular name for Matins + Lauds of
  Maundy Thursday, Good Friday, and Holy Saturday, anticipated the evening
  before so the office ends as night deepens. Matins has three
  **nocturns**; each nocturn is three psalms followed by three lessons,
  each lesson answered by a **responsory** — nine responsories per day,
  twenty-seven across the Triduum.
- The **hearse** carries fifteen candles. One is put out after each psalm
  — nine during Matins, five during Lauds — until only the topmost
  remains. During the Benedictus the altar candles go out too; the last
  candle is carried behind the altar, still burning but unseen; after the
  Miserere the assembly makes the **strepitus** (books slammed on stalls
  — the tradition reads it as the earthquake of Matthew 27:51), the
  hidden candle is brought back, and all leave in silence.
- The **responsory** is a strict form: a choral **respond** whose closing
  section is the **repetendum**; a **verse** (℣) sung by reduced voices;
  then the repetendum repeated. In the Triduum the *Gloria Patri* is
  suppressed (everything doxological goes dark), and the **third
  responsory of each nocturn repeats the entire respond** after the
  repetendum — a full da capo. So: R = a·b → ℣ → b, and for responsories
  III, VI, IX: a·b → ℣ → b → a·b.
- **Tomás Luis de Victoria** (c. 1548–1611), the great Spanish
  polyphonist of the Counter-Reformation — priest, associate of Philip
  Neri's Oratory in Rome — published the *Officium Hebdomadae Sanctae* in
  1585: the complete music for Holy Week, including eighteen Tenebrae
  responsories (the second and third nocturns of each day). They are the
  style anchor: four voices (SATB), verses for three upper voices,
  textures alternating point-of-imitation and grave chordal declamation,
  intensely text-driven, dissonance almost entirely prepared suspension.
  Spanish practice also sang Tenebrae psalmody in **falsobordone** —
  root-position chordal recitation — which is the verse's model here.
- **Tuning**: the theory of the age is just. Zarlino (*Le istitutioni
  harmoniche*, 1558) derives consonance from the **senario** — ratios of
  1–6 — i.e. 5-limit just intonation; unaccompanied choirs tune
  vertically pure and bend by commas as the harmony asks. Meantone is the
  keyboard's compromise, not the choir's. This machine sings 5-limit JI
  with the comma handled the way a choir handles it (§3.3).

## 3 · The tuning law — vertical justice over an anchored bass

Everything sounds at

```
f = FINAL × R,   R a ratio of small integers (5-limit), FINAL from §3.1
```

Ratios are **integer pairs [num, den] end to end**; the only float is the
final multiply into Hz. There is no `mtof`, no `2^(x/12)`, no cents
arithmetic in the signal path (cents are display labels only). The one Hz
literal is `BASE = 220` (the tenor's A), and it is **law, not voicing** —
it lives beside the mode tables, NOT in TIMBRE.

### 3.1 Modes and finals

Four church modes (the dark end of the eight, where the Triduum lives),
finals derived from BASE by 3-limit ratios:

| mode | MODUS chip | final | Hz (=BASE×) | character |
|---|---|---|---|---|
| Dorian (I) | DORIVS | D | 2/3 ≈ 146.67 | grave, poised |
| Phrygian (III) | PHRYGIVS | E | 3/4 = 165 | the Passion mode; default |
| Mixolydian (VII) | MIXOLYDIVS | G | 8/9 ≈ 195.56 | the one shaft of light |
| Aeolian (IX) | AEOLIVS | A | 1/2 = 110 | plain grief |

Mode scale, 5-limit, over the final (degrees 1–7; octave equivalence by
2/1 — this music has octaves, unlike some of its shelf-mates):

| mode | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Dorian | 1/1 | 9/8 | 6/5 | 4/3 | 3/2 | 5/3 | 9/5 |
| Phrygian | 1/1 | 16/15 | 6/5 | 4/3 | 3/2 | 8/5 | 9/5 |
| Mixolydian | 1/1 | 9/8 | 5/4 | 4/3 | 3/2 | 5/3 | 16/9 |
| Aeolian | 1/1 | 9/8 | 6/5 | 4/3 | 3/2 | 8/5 | 9/5 |

These tables tune the **bassus** (and any voice sounding alone). Known
wolf pairs inside a fixed 5-limit scale (e.g. Dorian 2–6) are *not* a
problem to fix in the tables — verticals never read two table entries at
once, per §3.3.

### 3.2 Ficta

At an authentic clausula (§5.5) the **cantizans** raises the seventh: the
leading tone sounds at exactly **15/8 over the cadence root** (i.e. 15/16
below the arrival), whatever the table says. Phrygian cadences raise
nothing — the bass falls the 16/15 semitone instead; that IS the Phrygian
cadence. Ficta applies only at cadences (Victoria's accidentals are
almost all cadential); no other chromatic inflection in v1.

### 3.3 Vertical justice (how the comma is handled)

The rule that makes the machine sound like a choir and stays verifiable:

- The **bassus** takes its pitch from the mode table (§3.1), always.
- Every simultaneous sonority is tuned as **exact small ratios over the
  sounding bassus pitch**: major triad 4:5:6, minor 10:12:15, sixth
  chords from the same senario set. Upper voices *re-derive* from the
  bass at each of their note onsets — so an upper voice may sit a comma
  (81/80) away from its own table pitch, exactly as a singer bends to
  tune the chord. Comma differences apply **at note boundaries only**,
  never as an audible slide.
- **The suspension law:** a suspended note *keeps the exact frequency of
  its preparation* while it dissonates (that is what preparation means —
  the singer holds the pitch and the world moves), then resolves down by
  step to a pitch tuned pure against the new bass. The dissonance's
  frequency ratio against the bass is whatever it is; it is not retuned.
- Unisons/octaves between voices are exact by construction (same ratio
  chain). The final sonority of the respond and of the whole piece is a
  **4:5:6 major triad or open 1:2:3** on the final (seeded choice,
  weighted 0.7 to the major — the *tierce de Picardie* is Victoria's
  norm); the major third 5/4 must be exact, that shining pure third over
  darkness being rather the point of the entire enterprise.

## 4 · The office law (form, texts, candles)

### 4.1 One pressing = one responsory

The RESPONSORIVM control picks I–IX (Good Friday's nine; the other
eighteen texts are a pickup, §13). A pressing composes and sings that
responsory complete:

```
respond a → respond b (repetendum) → ℣ verse → b
                                  (III, VI, IX add: → a → b, full da capo)
```

- **Respond**: four voices (Cantus, Altus, Tenor, Bassus).
- **Verse**: three voices, the upper three (CAT) — Victoria's scoring.
  Falsobordone-leaning texture (§5.4).
- **Repetendum repeat**: identical music to the respond's b section, bar
  for bar (the choir repeats; the machine repeats — byte-identical
  events, a verifiable law, and a free gift of structural memory).
- No Gloria Patri anywhere (suppressed in the Triduum — say why in the
  reader panel).
- After the final cadence of responsory **IX only**: the last candles'
  world ends — a beat of silence (2 tactus), then the **strepitus**
  (§6.4), then darkness. IX is the only pressing with a coda.
- Loop behavior: the pressing repeats da capo after a 2-tactus breath
  (offices are cyclic; so are these machines). The WAV cut is **one
  complete pass** including the strepitus on IX.

### 4.2 The candle law

Fifteen candles. The rubric extinguishes one per psalm, and each nocturn
sings its three psalms *before* its three responsories. So while
responsory k (1-indexed 1–9) is sung:

```
candles_out(k) = 3 × ceil(k / 3)          candles_lit(k) = 15 − candles_out(k)
```

i.e. responsories I–III burn 12 candles, IV–VI burn 9, VII–IX burn 6.
(Lauds' five further candles and the hiding of the fifteenth fall after
all nine responsories; the strepitus coda on IX compresses that ending
into this machine's frame — the reader panel says so honestly.)

`candles_lit` drives, deterministically:

- the **canvas light level** (§8) — flames lit/out, ambient glow;
- a **timbral darkening**: a master tilt filter eases down and the room's
  damping rises as candles go out. Depth of both couplings is TIMBRE
  (`master.obscuratio`, default mapping ≈ −0.35 dB/kHz-tilt per 3 candles
  — subtle; nine pressings should read as one long dusk, not nine
  presets);
- a **dynamic easing**: base dynamic drops one notch (≈ −1.5 dB) per
  nocturn.

### 4.3 The texts (the baked data)

The nine Good Friday responsories, Liber Usualis text. Stored as
structured data: syllable arrays with stress flags, phrase boundaries at
the punctuation, the repetendum start marked ¶, phrases flagged
`obscurum` where noted. **The implementer must cross-check every text
against the Liber Usualis (1961, public domain) while baking** — treat
the list below as the design's intent, the Liber as the authority.

1. **Omnes amici mei** dereliquerunt me, et praevaluerunt insidiantes
   mihi: tradidit me quem diligebam: ¶ Et terribilibus oculis plaga
   crudeli percutientes, aceto potabant me.
   ℣ Inter iniquos projecerunt me, et non pepercerunt animae meae.
2. **Velum templi** scissum est, ¶ et omnis terra tremuit: latro de cruce
   clamabat, dicens: Memento mei, Domine, dum veneris in regnum tuum.
   ℣ Petrae scissae sunt, et monumenta aperta sunt, et multa corpora
   sanctorum, qui dormierant, surrexerunt.
3. **Vinea mea electa**, ego te plantavi: ¶ Quomodo conversa es in
   amaritudinem, ut me crucifigeres, et Barabbam dimitteres?
   ℣ Sepivi te, et lapides elegi ex te, et aedificavi turrim.  *(da capo)*
4. **Tamquam ad latronem** existis cum gladiis et fustibus comprehendere
   me: quotidie apud vos eram in templo docens, et non me tenuistis: ¶ et
   ecce flagellatum ducitis ad crucifigendum.
   ℣ Cumque injecissent manus in Jesum, et tenuissent eum, dixit ad eos.
5. **Tenebrae factae sunt** [obscurum], dum crucifixissent Jesum Judaei:
   et circa horam nonam exclamavit Jesus voce magna: Deus meus, ut quid
   me dereliquisti? ¶ Et inclinato capite, emisit spiritum.
   ℣ Exclamans Jesus voce magna, ait: Pater, in manus tuas commendo
   spiritum meum.
6. **Animam meam dilectam** tradidi in manus iniquorum, et facta est mihi
   haereditas mea sicut leo in silva: dedit contra me voces adversarius,
   dicens: Congregamini, et properate ad devorandum illum: posuerunt me
   in deserto solitudinis [obscurum], et luxit super me omnis terra: ¶
   Quia non est inventus qui me agnosceret, et faceret bene.
   ℣ Insurrexerunt in me viri absque misericordia, et non pepercerunt
   animae meae.  *(da capo)*
7. **Tradiderunt me** in manus impiorum, et inter iniquos projecerunt me,
   et non pepercerunt animae meae: congregati sunt adversum me fortes: ¶
   Et sicut gigantes steterunt contra me.
   ℣ Alieni insurrexerunt adversum me, et fortes quaesierunt animam meam.
8. **Jesum tradidit impius** summis principibus sacerdotum, et senioribus
   populi: ¶ Petrus autem sequebatur eum a longe, ut videret finem.
   ℣ Adduxerunt autem eum ad Caipham principem sacerdotum, ubi scribae et
   pharisaei convenerant.
9. **Caligaverunt oculi mei** [obscurum] a fletu meo: quia elongatus est
   a me, qui consolabatur me: ¶ Videte, omnes populi, si est dolor
   similis sicut dolor meus.
   ℣ O vos omnes, qui transitis per viam, attendite et videte.  *(da capo
   · strepitus)*

Worked syllabification example (responsory V, respond opening; `·` =
syllable, CAPS = liturgical stress):

```
TE·ne·brae  FAC·tae  sunt,  dum  cru·ci·fi·XIS·sent  JE·sum  ju·DAE·i
```

Syllabifier law (baked by hand per text, these rules as the guide): split
before a single consonant between vowels; split double consonants; `qu`,
`ch`, `th`, `ph`, and mute+liquid (`tr`, `cr`, `pl`…) stay with the
following vowel; `x` closes its syllable. Stress: penult if the word has
two syllables; for longer words, the accent the Liber prints. **Bake the
accents into the data by hand** — do not implement a Latin prosody
engine; nine texts is a lunch break, an engine is a thesis.

### 4.4 What the text drives

The singing is a **vowel stream** (house precedent: NENIA/VYVID/KHÖÖMEI —
no consonant synthesis; the vowel of each syllable colors the formants,
§6.2). But the text is not decoration — it drives:

- **phrase structure**: one text phrase = one musical phrase (§5.1);
- **rhythm**: declamation maps stressed syllables to longer values on
  stronger beats (§5.4); imitation soggetti take their long-short profile
  from the opening words' stresses;
- **melisma placement**: the last stressed syllable before a cadence
  carries the cadential melisma (2–5 notes); everything else is syllabic
  to Victoria's plainness;
- **darkness**: `obscurum` phrases force low-register homophony, piano
  (§5.4);
- **the canvas**: the current syllable is highlighted in the text line as
  it is sung (§8).

## 5 · The counterpoint engine (the composer)

The generation pipeline is per-phrase, deterministic from
`(seed, responsory, mode, tactus)`. `genAll` produces the complete event
score before a note sounds; the scheduler and the offline render both
read the same score (house separation).

### 5.1 Phrase plan

Split respond and verse texts at `: , . ? ;`. Assign textures:

| phrase | texture |
|---|---|
| first phrase of respond a | **imitation point** (always — the door in) |
| interior phrases | seeded: declamation 0.5 · imitation 0.3 · free polyphony 0.2 |
| any `obscurum` phrase | **declamation**, low register, piano (overrides) |
| last phrase of a, of b | ends in a **cadence formula** (§5.5): a → cofinal, b → final |
| verse phrases | **falsobordone** (§5.4), final verse phrase cadences on cofinal |

Cofinal = degree 5 (Dorian/Aeolian/Mixolydian), degree 4 for Phrygian
(the la-mi world; the ℣ of a Phrygian responsory sitting on A over an E
office is the authentic sound).

### 5.2 The soggetto

Head motif for imitation points, seeded per phrase: 4–7 notes; first
interval a rising 4th, 5th, or minor 3rd from final or cofinal (weights
0.4/0.3/0.3); thereafter stepwise with at most one more leap ≤ 4th,
opposite direction; rhythm = the phrase's first words' stress profile
mapped long–short (stressed = semibreve/dotted minim, unstressed =
minim/semiminim); range ≤ 6th. Entries: voice order seeded from
{TABC, ABCT, BTAC…} (any order, but adjacent entries differ by 4th/5th/
8ve); pitch levels alternate final/cofinal transposition (real answers —
tonal adjustment is a pickup, not v1); time interval 1–2 semibreves.
After all four entries the phrase dissolves into free counterpoint toward
its close.

### 5.3 Free counterpoint (the rule kernel)

Voice-by-voice constrained search against the already-written voices,
GRADUS's architecture generalized (weighted-random proposal, rule check,
backtrack on failure — GRADUS's `P()` rejection-logging pattern is the
model; its rules are switches, these are **not**: this machine's rules
are law, no toggles). Note values: breve, semibreve, minim, semiminim;
semiminims only in pairs, stepwise.

**Vertical rules** (over the sounding bassus):
- consonances: 1/1, 6/5, 5/4, 4/3*, 3/2, 8/5, 5/3, 2/1 and octave
  extensions (*4/3 is consonant only between upper voices, dissonant
  against the bass — the Renaissance line in the sand);
- dissonance only as: **passing/neighbor** on weak minim halves,
  stepwise both sides; or **suspension** prepared as a consonance, struck
  on the strong tactus, resolved down by step (4–3, 7–6, 9–8; 2–3 in the
  bass) — the tuning of a suspension follows §3.3;
- no two voices dissonant against the bass at once.

**Motion rules**: no parallel 5ths/8ves/unisons (including by contrary
motion); no hidden 5ths/8ves in the outer pair unless the cantus moves by
step; voices don't cross (adjacent pairs), don't overlap beyond a 2nd.

**Melodic rules**: steps preferred (weight ~0.7); leaps ≤ 5th plus
ascending minor 6th and octave, every leap ≥ 4th recovered by step in the
opposite direction; no melodic tritones or 7ths; no more than two leaps
running; range per voice ≤ a 9th within a phrase.

**Spacing/ranges** (relative to the mode final f, in ratio·octave terms):
Cantus [2/1·f, 9/2·f], Altus [3/2·f, 3/1·f], Tenor [1/1·f, 2/1·f],
Bassus [1/2·f, 3/2·f]; adjacent upper pairs within an octave, tenor–bass
within a 12th.

**Search discipline**: bounded backtracking (a few hundred proposals per
note, seeded), then graceful relaxation at documented pearl points ONLY:
drop a 4-voice imitation to 3 entries + free filler; then declaim the
phrase instead. Never fail, never loop unbounded, stay deterministic (the
relaxation path is a pure function of the same seed).

### 5.4 Declamation and falsobordone

Chord-stream first, then voicing — this is the robust texture, use it
generously (it is also the historically dominant one in Victoria's
responds):

- **Harmony law**: roots on modal degrees, root motion seeded from
  weights {4th/5th: 0.45, 3rd: 0.25, 2nd: 0.30}, triads root-position or
  first-inversion (weights 0.7/0.3), all pitches from the mode table +
  §3.3 vertical tuning. Degree 7 never takes a root-position triad in
  Phrygian (the diminished trap; use first inversion).
- **Rhythm law**: one chord per syllable; stressed syllables get minim or
  longer on tactus-strong positions, unstressed get minim/semiminim;
  phrase-final syllable gets ≥ semibreve. The four voices move
  homorhythmically, with the cantus allowed one passing minim per two
  bars so the top line breathes.
- **Falsobordone (verse)**: same law, tightened — a recitation chord
  holds for the run of unstressed syllables (repeated-note declamation on
  one sonority), moves only at the phrase's last 2–3 stresses, then the
  cadence formula. Three voices (CAT), the tenor carrying the recitation
  pitch on the cofinal. This is the verse's whole texture; it is also the
  machine at its most liturgical, do not ornament it.
- `obscurum` phrases: declamation law, all voices in the lower third of
  their ranges, dynamics piano, one chord per ~2 syllables (slower), the
  room's wet briefly +20% (darkness has more air).

### 5.5 Cadence formulas

Baked formulas, inserted (not searched) at phrase ends — the one place
the music is allowed to be formulaic, because the tradition's cadences
ARE formulas:

- **Clausula vera** (authentic): cantizans 7–6 suspension → ficta leading
  tone (15/8 law, §3.2) → final; tenorizans 2–1; bassus 5–1; altus fills.
  Used for final cadences in D/A/G modes and all interior cadences on the
  cofinal.
- **Phrygian clausula**: tenorizans falls 16/15 to the final, cantizans
  rises 1 step (no ficta), bassus takes the 4th below; arrival is a
  major 4:5:6 on E per §3.3. The characteristic sound of the whole
  machine at default settings.
- **Plagal close**: iv–I, reserved as a seeded option (p=0.3) for the
  very last cadence of a pressing, after a clausula vera has already
  landed — Victoria's amen gesture.
- Interior phrase cadences weaken by evasion (seeded p≈0.35): the bassus
  steps to 6 instead of 1 (what the treatises call *fuggir la cadenza*) —
  keeps the middle of a respond from over-resolving (RILLE's rationed
  resolution, four hundred years earlier).

### 5.6 Tactus and meter

Tempus imperfectum throughout (duple; the responsories are duple music —
triple-time *proportio* is a pickup, not v1). TACTVS slider = semibreves
per minute, **48–66, default 56**. The strong–weak hierarchy: strong =
semibreve start, half-strong = second minim, weak = minim halves. Seeded
micro-timing: voice onsets stagger ≤ 12 ms on non-unison attacks
(ensemble, not humanize — singers breathe together but speak apart);
deterministic.

## 6 · The voices (synthesis, no samples)

### 6.1 The consort

Four voice sections, each a TIMBRE group: **CANTVS** (boys/falsettists),
**ALTVS**, **TENOR**, **BASSVS**. Each section = `capella.cantores`
singers per part (default **2**, range 1–4): detuned copies (±4–9 cents
seeded, per-singer fixed), onset-staggered per §5.6 — 1 singer sounds
like a cantor's office, 4 like a chapel choir. Verse drops to 1 singer
per part (soloists sing verses — Victoria's practice and a free textural
contrast).

### 6.2 One singer

Source: sawtooth (glottal-rich) through a **formant bank** (3 parallel
bandpasses + a gentle highpass-shelf breath noise, keyed and gated with
the note). Vowel targets per Latin vowel (a e i o u; y→i, ae/oe→e, au→a
then u across the syllable) — base formant table (F1/F2/F3 centers +
bandwidths) is **law** (it is what makes Latin Latin); per-voice-type
formant *scaling* (throat length: Cantus ~1.0 down to Bassus ~0.82) and
brightness tilt are **TIMBRE**. Crib the vocal model from VYVID/NENIA and
darken it: less edge, more hood — this is a chapel, not a steppe.

Envelope: slow-ish attack (30–60 ms, faster on repeated-note declamation),
legato within a phrase (one breath = one phrase; the source runs
continuously across syllables, formants crossfade at syllable boundaries
~40 ms), release into the room at phrase end. Vibrato: **delayed and
narrow** (onset 300–500 ms, depth 6–10 cents, 4.5–5.5 Hz, per-singer
seeded phase) — Renaissance voices warm, they do not wobble; at depth 0
the tuning proofs of §13 must pass exactly, so vibrato is implemented as
a symmetric modulation around the exact frequency.

### 6.3 The chapel

Master chain: voices → per-part gains → bus → tilt filter (the
`obscuratio` coupling, §4.2) → compressor (gentle, 2:1-ish) → **stone
room** convolver send (seeded IR, 2.2–3.2 s RT60 default ~2.6, dark tail
— damping rises as candles go out) → out trim. Peak ≤ −1 dBFS (house
headroom). This machine wants the wash Partch refused — the music was
composed for stone; DIAMOND's dryness rule inverts here, on purpose.

### 6.4 The strepitus

Responsory IX only (§4.1): after 2 tactus of near-silence, a seeded
composite noise event ~1.2–2 s — a deep thud (filtered noise burst +
80–40 Hz sine drop), a clatter layer (a dozen seeded short noise taps,
the slammed books), the room ringing longer than anything before it
(the IR's one fortissimo). Then genuinely nothing: the loop's da capo
breath on IX is 4 tactus of black silence before the candles relight.
TIMBRE group `strepitus` (level, weight, clatter density). It must be
deterministic like everything else — the earthquake is seeded.

## 7 · Controls, hash, keys

House grammar, one chip row per law + slider:

- **RESPONSORIVM**: I II III IV V VI VII VIII IX (default **V**,
  *Tenebrae factae sunt* — the namesake). Chip labels carry the incipit
  as a title/tooltip; the current incipit is displayed in full.
- **MODVS**: SORTE · DORIVS · **PHRYGIVS** (default) · MIXOLYDIVS ·
  AEOLIVS. SORTE draws per pressing from weights {phrygian .35, dorian
  .30, aeolian .25, mixolydian .10} off the seed.
- **TACTVS** slider: 48–66 semibreves/min, default 56.
- **SEED** via `r` (aliud — a new setting of the same text).

Hash `#v1·s<seed>·r<1-9>·m<0-4>·t<tactus>` (m=0 is SORTE); every param
round-trips, the hash is the pressing. Keys: **space** play/stop · **p**
pause · **r** another · **c** cut WAV · **1–9** choose responsory.
Changing responsory/mode/tactus regenerates on next play (render-family
behavior; a responsory is a piece, not a groove — no mid-bar re-vibe).

## 8 · Canvas

Left panel, **the hearse** — the machine's one image:

- Fifteen candles on a triangular stand, drawn tall and spare; lit flames
  flicker gently (layer-cached candle bodies, only flames redraw); out
  candles show ember-and-smoke for a few seconds after a nocturn
  boundary is crossed between pressings, then stand dark. `candles_lit`
  per §4.2. The topmost candle is subtly distinguished (it survives).
- The panel's ambient glow scales with `candles_lit` — responsory IX is
  sung by six flames in a brown-black field. During IX's strepitus the
  flames gutter and the panel goes to black (reduced-motion: a plain
  crossfade).

Right panel, **the choirbook**:

- Four voice bands (C/A/T/B), notes as plain mensural-ish blocks scrolling
  or paged per phrase; imitation entries visibly echo each other;
  suspensions tinted (the dissonance made visible — GRADUS's plate
  language, quieter).
- Under the bands, the **text line**: the current phrase's Latin,
  current syllable lit as it is sung; ¶ marks the repetendum, ℣ the verse.
- A **form ribbon**: `a · b · ℣ · b (· a · b)` with the now-point, plus
  the office strip — nine responsory numerals with their candle counts,
  current one lit.

Palette: near-black **#0d0b09** field · candleflame **#e0a84c** · bone
parchment **#d8cdb4** · smoke **#5a544a** · a deep liturgical violet
**#4a3652** for accents (the Passiontide color). Landing card
`--bg:#141009`, emblem: the triangular hearse as fifteen dots, six lit
gold, the apex dot haloed.

`prefers-reduced-motion`: no flicker, no gutter animation, static flames,
syllable highlight without transition. Render loop sleeps when stopped.

## 9 · Skeleton

**Realtime scheduler + offline render family** (FADÓ/NENIA, not the
prerendered-buffer family): `genAll(seed, params)` → the complete score
(phrases, per-voice note events with [num,den] ratio chains, textures,
cadences, candle state), run once and cached; `buildGraph` → the consort
+ master chain; `schedTick` walks the score with lookahead against
`ac.currentTime`; `cut()` renders the identical score through an
OfflineAudioContext to a deterministic 16-bit WAV. Media Session + the
no-suspend-on-hide visibility law per the current sweep (HANDOFF thread
"Lock-screen playback") — build it in from day one rather than
retrofitting; BOLG (op. VI) onward is the pattern to copy.

OFFICINA: bridge **verbatim** (copy from FORFEX/RILLE — see the FADÓ
bugfix thread for what happens otherwise); `TIMBRE.touch` ramps
master/room/levels live, formant-shape edits apply at the next phrase
boundary (documented in their TIMBRE docs); `TIMBRE.demo(group)` = the
group's part sings a solo clausula vera formula (four notes, through the
real graph); for `strepitus`, one strike, quiet-ish.

## 10 · TIMBRE sketch (~32 params, 8 groups)

`master` (drive, comp threshold/ratio, out trim, obscuratio depth) ·
`aula` (the chapel: RT60, damp, predelay, wet) · `capella` (cantores/part,
detune spread ¢, breath level, vibrato rate/depth/onset, ensemble stagger
ms) · `cantus` / `altus` / `tenor` / `bassus` (level, formant scale,
tilt) · `strepitus` (level, weight, clatter, tail).

The law stays OUT of TIMBRE: BASE=220, finals, mode tables, the senario
tuning, ficta, the counterpoint rules, texts, candle math, form. Factory
defaults = the literals the implementer lands by ear; register the chip
in officina's `MACHINES`.

## 11 · "On this music" panel (content outline)

House voice, plain language: what Tenebrae is — Matins sung the evening
before, the hearse, a candle out per psalm, the last flame hidden, the
strepitus, leaving in darkness · the responsory form and why the machine
repeats itself (the repetendum) · Victoria: Ávila, Rome, Philip Neri's
circle, the 1585 *Officium*, then home to a convent organ loft in Madrid
· why the counterpoint is strict and what a suspension is (holding your
note while the world moves, then yielding) · Zarlino's senario; choirs
tune ratios, keyboards temper — this machine sings ratios · what ficta
is · Trent and the Counter-Reformation's demand that the words be heard —
why so much of this music is chords · honesty notes: vowels only, no
consonants; Good Friday only in v1; the strepitus stands in for Lauds;
new music in an old law — these are not Victoria's notes, they are his
rules.

## 12 · Do not touch / gotchas for the implementer

- **Ratios are integer pairs end to end** (DIAMOND's law): compare by
  cross-multiplication; the vertical-justice retune (§3.3) is a ratio
  composition (chord ratio × bass ratio), never a float readback.
- **The suspension holds its old frequency** (§3.3). If a suspension gets
  retuned against the new bass at the barline, the whole point — the
  pitch that stays while the ground moves — is silently destroyed and no
  ear will tell you, only the verify gauntlet.
- **The repetendum repeat is byte-identical events**, not a regeneration
  with the same seed. Generate b once; the schedule references it twice
  (three times on III/VI/IX).
- Voice sections share a phrase breath: all singers of a part gate
  together; the ≤12 ms stagger is per-onset, not per-phrase drift.
- The formant crossfade at syllable boundaries must not retrigger the
  envelope — one phrase is one note-stream per singer, or the legato
  reads as typing.
- Backtracking must be bounded and its relaxation ladder deterministic
  (§5.3) — an unbounded search is a hang on some seed somewhere, and the
  seed IS the pressing.
- Candle math is rubric, not vibe: `3·ceil(k/3)`, tested. Don't smooth it
  into a linear fade across I–IX.
- `TIMBRE.id = 'tenebrae'` === directory name (bench addressing).
- Register the machine in **all four registries** (landing card + counts,
  README row + count, HANDOFF file table + counts, officina MACHINES) in
  the same landing, minimal-diff rows; re-check the op. numeral at the
  final rebase (claiming-by-landing).

## 13 · Considered and rejected (don't "improve" these back in)

- **A whole Mass Ordinary machine** (Kyrie–Agnus): the natural first
  thought and too broad — an hour of music, five movements, no single
  legible law. The responsory is small, strict, and complete; narrow won.
- **Josquin/Ockeghem mensuration canon** (*Missa prolationum*): a
  magnificent MACHINE-shaped law (one line, four speeds) but a different
  one — process music, PEAL/GERMEN's shelf. A future op., not this one;
  don't let canon tricks creep into the imitation points.
- **Extending GRADUS instead**: GRADUS is the classroom and its interface
  is the rules-as-switches. TENEBRAE's rules are not switches — the law
  here is the office. Different machine, and the catalogue's distinction
  between treatise and practice is worth keeping legible.
- **Meantone tuning**: the keyboard's compromise; choirs sing just
  (Zarlino). Also the house rule: don't approximate where the tradition
  is exact.
- **Consonant synthesis / full text-to-speech**: a thesis, not a machine.
  Vowel-stream is the house voice and reads as sung Latin at a distance,
  which is exactly how Tenebrae is heard.
- **All 27 responsories in v1**: three days × nine texts triples the
  baked data and dilutes the arc (one day = one dusk = one hearse cycle).
  Thursday and Saturday are the obvious pickup — the data schema already
  fits them (add a DIES chip, candle math unchanged).
- **Nota cambiata, consonant 4th, anticipations**: real Palestrina-style
  vocabulary, deliberately out of v1's dissonance set (passing/neighbor/
  suspension only) to keep the rule kernel provable. Pickup, with their
  verify checks, if the music feels too clean.
- **Word-painting engine**: one flag (`obscurum`) is the v1 allowance.
  Resist the rest; Victoria's restraint is the style.

## 14 · Acceptance — the verify gauntlet

`scratchpad/verify-tenebrae.mjs` (playwright-core + bundled Chromium,
GONGAN/TRITAVA's script as the model). Enumerate the model, then smoke
the transport. Across ≥ 30 seeds × 4 modes × responsories {1, 3, 5, 9}:

1. **Form**: event stream is a·b·℣·b (+a·b on III/VI/IX); the repetendum
   repeats are event-identical to b; verse is exactly 3 voices (CAT) at 1
   singer/part; no Gloria Patri (trivially: no extra section); strepitus
   events exist on IX only, after the final cadence + 2 tactus.
2. **Candles**: `candles_out(k) = 3·ceil(k/3)` for k = 1…9; the tilt/
   dynamic couplings read the same table.
3. **Counterpoint sweep** (every generated score): zero parallel or
   contrary 5ths/8ves/unisons between any pair; every dissonance against
   the bass classifies as passing/neighbor (weak, stepwise) or suspension
   (prepared consonant, struck strong, resolved down by step); no
   simultaneous double dissonance; 4/3 against the bass never on a
   strong tactus unstruck... (i.e. only as classified dissonance); voice
   ranges/spacing/crossing per §5.3; melodic intervals legal (no
   tritones/7ths, leaps recovered); semiminims paired and stepwise.
4. **Cadences**: every phrase-final formula matches §5.5; ficta leading
   tone sounds at exactly 15/8 over its cadence root (cross-multiplied,
   not float-compared); Phrygian cadences contain no raised tone and land
   4:5:6 on the final; last sonority of the pressing is 4:5:6 or 1:2:3 on
   the final, exact.
5. **Tuning**: every vertical sonority's non-suspension tones are exact
   small ratios over the sounding bassus (senario set); every suspension's
   dissonating frequency equals its preparation's frequency exactly;
   bassus pitches ∈ mode table × 2^k; finals at BASE×{2/3, 3/4, 8/9, 1/2};
   grep-level check: no `Math.pow(2` / `**(x/12)`-style ET in the signal
   path.
6. **Determinism**: `genAll` byte-identical across two runs per
   (seed, params); the offline render byte-identical across two cuts.
7. **Render**: WAV NaN-free, non-silent, peak ≤ −1 dBFS; every voice
   non-silent when soloed via TIMBRE levels; IX's render ends in the
   strepitus and then true silence.
8. **Plumbing**: realtime play/pause/resume/stop drives ctx states; hash
   round-trips on a fresh load (seed, responsory, mode, tactus); keys
   1–9 switch responsory; OFFICINA schema well-formed, set/bulk/
   localStorage overlay round-trip, `?factory` bypass; Media Session
   metadata updates on start/stop/aliud; context stays running on
   simulated visibility-hide; zero pageerrors end to end.

## 15 · Registration checklist (ship with the code)

- `index.html`: op. XXIV card (or the numeral current at landing) —
  `--bg:#141009`, hearse emblem per §8; counts bumped wherever stated
  (re-check against what has landed — RICERCAR may land before or after).
- `README.md`: row — open with "the office of darkness"; name Victoria
  and the hearse; note vowels-only honestly.
- `HANDOFF.md`: file-table row + counts; a full Open-threads entry (top),
  folding this brief's outcome in; **delete this file** (`tenebrae/
  OFFICIUM.md`) in the landing commit.
- `officina/index.html`: MACHINES chip `tenebrae`.
- Verify gauntlet green (§14) before the final rebase + push.

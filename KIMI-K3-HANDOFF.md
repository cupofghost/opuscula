# Build a machine for OPVSCVLA — a handoff for Kimi k3

You are going to build **one new machine** for a collection called **OPVSCVLA**
(Latin for "little works"). This document is everything you need. You do not
have access to the collection's git repository, and you don't need it — the
whole point of the collection is that **every machine is one self-contained
HTML file**, and this brief inlines every shared piece of code you'd otherwise
copy from a sibling.

**Your deliverable is a single `index.html` file.** Paste it back as one
complete file. A human maintainer will drop it into the repo and do all the
registry wiring (landing page, README, etc.) — you don't touch any of that.

You have **full creative freedom over the concept**, within the constraints
below. The last section of this document is the open brief; read everything
first, then design.

---

## 0. The one non-negotiable: self-contained, zero dependencies

- **One file.** Inline `<style>`, inline `<script>`, all sound made with the
  **Web Audio API**. No build step, no bundler, no npm, no framework, no
  TypeScript, no external JS/CSS.
- **No samples, ever.** Every sound is *synthesized* in code (oscillators,
  noise buffers, `PeriodicWave`, Karplus–Strong, additive, FM, filters). There
  are no audio files, no `<audio>`, no `fetch()` of anything at runtime.
- **No server.** The file must work opened directly from disk (`file://`) and
  served statically. No server-side anything.
- **The single permitted external resource** is a Google Fonts `<link>` in the
  `<head>` (every machine uses one). It must degrade gracefully — always give a
  `system-ui, sans-serif` fallback in your `font-family` so the machine is fully
  functional with no network. Nothing else may be fetched.
- **Pure functions where the music lives.** The compositional core must be
  DOM-free and deterministic so it can be reasoned about and verified.

If you're ever tempted to reach for a library or a sample, that's the signal to
synthesize it instead. Portability and longevity beat DRY here.

---

## 1. What OPVSCVLA *is*

Nineteen (soon twenty — yours) small musical machines. Each renders **one
musical idea** — a tuning system, a compositional rule set, a rhythmic
tradition, a formal process — as a playable, generative, synthesized instrument
in the browser. Examples already in the collection, to calibrate your taste:

- **GRADUS** — generative species counterpoint after Fux (1725); the six
  counterpoint rules *are* the controls. Turn off parallels and it writes organum.
- **PEAL** — English change-ringing; the bells sound *permutations*, not tunes.
  Every method and touch is verified *true* (no row rung twice).
- **SCALA / COCHLEA / DIAMOND / TRITAVA** — tuning machines in exact just
  intonation (Shepard–Risset; a comma pump; Partch's tonality diamond; the
  octave-less Bohlen–Pierce scale). No equal temperament anywhere in the signal.
- **FOLI** — interlocking West African djembe & dunun rhythms; the bell
  timelines are canonical, the drum parts idiomatic.
- **GONGAN** — Central Javanese court gamelan; colotomic cyclic time, a composed
  *balungan* with every other part derived from it by role.
- **TESSERA** — *a machine that predicts itself*: the smallest real language
  model (a variable-order PPM Markov model) that starts empty, learns only from
  its own output, and composes by sampling itself; per-note **surprisal** and
  **entropy** drive everything you hear. It was designed **by an LLM, in answer
  to the question of what machine an LLM would like.** (Keep this one in mind —
  see §9.)

The through-line: **the machine composes; the user sets the law it obeys.**

---

## 2. The five design laws (internalize these)

1. **The law is the interface.** Controls expose the *compositional constraint*
   — a mode, a scale, a rule, a method, a process — not knobs on a sample. The
   user sets the law; the machine composes within it. A machine whose controls
   are "reverb / filter / volume" has missed the point. A machine whose controls
   are "which counterpoint species / which mode / how dense" has it.

2. **Deterministic + shareable.** Generation is **seeded**. The same seed +
   same params always produce the same piece. Every parameter (seed included)
   serializes into the **URL hash** — the hash *is* the pressing; a copied link
   reproduces the exact music anywhere. The offline WAV render is deterministic
   too (seed anything random in it, including reverb impulse responses).

3. **One file, zero dependencies** (see §0). A machine must keep working if you
   save just its `index.html`.

4. **Change-while-playing.** Where a machine runs a groove, a parameter change
   should **re-vibe at the next bar** rather than restarting the transport. The
   scheduler already reads `audioContext.currentTime`, so edits apply forward.
   (Some machines that regenerate the whole score on a law change *do* restart
   — that's acceptable when the change is structural; document which you chose.)

5. **Correctness where the domain has a right answer.** If the tradition is
   exact — a tuning, a permutation rule, a counterpoint law — implement it
   *exactly* and be able to prove it. Don't approximate a just ratio with an
   equal-tempered one; don't let a "true" change-ringing method ring a row
   twice. Where the domain is a matter of taste, take a strong tasteful stance.

---

## 3. The spine of a machine

Almost every machine has this shape. Yours should too (adapt freely):

- **A model** — the musical law, as data + pure functions. A mode/scale as
  ratios, a rule set, a permutation group, a timeline, a Markov model. This is
  the part you can verify in isolation.
- **A generator** — `genAll(seed, params)` (or equivalent). Turns seed + params
  into a **deterministic score** (an event list: `{time, pitch, dur, voice,
  velocity, …}`). Run once, cached; re-run on seed/law change.
- **An audio graph** — `buildGraph(ctx)`. Synthesis voices feeding a **master
  chain**. The house master chain (recurs across the collection, gives good
  loudness without fuzz):

  ```
  voices → [per-voice gains] → busSum
        → waveshaper (gentle warmth, ~0.06 drive)
        → glue compressor (~2.4:1)
        → brick-wall limiter (DynamicsCompressor: threshold −1.5 dB,
                              knee 0, ratio 20, fast attack) 
        → out trim → ctx.destination
  ```
  Reverb/delay sends sum in **before** the limiter so nothing bypasses the
  ceiling. Seed the reverb impulse response so the WAV cut stays deterministic.

- **A driver.** Two families — pick the one that fits your idea:
  - **Live scheduler** (`schedTick`, ~40 ms interval, ~0.3 s lookahead) that
    walks the score against `ctx.currentTime`. Best when the piece is endless /
    loops / re-vibes live (techno, gamelan, throat singing, a language model).
  - **Bake-and-loop** (`renderMaster` into buffers, then loop the buffer). Best
    for struck/plucked ensembles where you synthesize per-voice hits once and
    schedule buffer sources (Partch marimbas, drums, bells). Make the loop seam
    seamless: fold overhanging tails back onto the head, or equal-power
    crossfade continuous drones.
- **A canvas visualization.** Draw the *model*, not a generic spectrum — the
  lattice, the wheel, the permutation "blue line", the mosaic, the rushnyk. See
  §6 for the performance rules.
- **URL-hash serialization** — every param round-trips through `#…` (§7).
- **An offline render** that cuts a deterministic 16-bit WAV (§7).

---

## 4. Copy these verbatim — the shared machinery

These blocks are **identical across the collection**. Reproduce them exactly.
They're the pieces you'd normally copy from a sibling file; since you can't,
here they are.

### 4.1 Seeded RNG (deterministic generation)

```js
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
```

Seed every random choice from one of these (derive sub-streams by XORing the
seed with a constant, e.g. `mulberry32(seed ^ 0x9E3779B1)`, so independent
aspects don't fight for the same randomness).

### 4.2 The `TIMBRE` block + `TP` + the OFFICINA bridge (the voicing layer)

**Every machine's synthesis constants live in one documented `TIMBRE` block**
near the top of the script, and the code reads `TP.<group>.<param>` instead of
scattered magic numbers. A backstage tool called **OFFICINA** iframes any
machine and edits these live. You get that integration for free by including the
bridge below **exactly**.

**Critical distinction — what goes in TIMBRE vs. what doesn't:**
- **TIMBRE = voicing only.** Gains, filter frequencies, attack/decay times,
  detune amounts, harmonic tilts, room size — *how the voices sound*.
- **The LAW is NOT voicing.** Scales, ratios, modes, rules, patterns, moods,
  meter — these stay as their own constants in the model, **out of TIMBRE.**
- **Factory defaults in TIMBRE must equal the literals they replace.** If a
  voice's attack was `0.008`, its TIMBRE default is `0.008`. Derived lengths
  (buffer sizes, guards) may scale with edited params but must equal the old
  constant exactly at factory values.

The schema shape (this is a compact 2-group example — real machines have
6–11 groups, 25–55 params):

```js
const TIMBRE={
  id:'yourmachine',                  // MUST equal the directory name
  title:'YOURMACHINE · op. XX',
  doc:'One paragraph: what the voices are and how they are built. Shown on the bench.',
  groups:{
    master:{label:'master',doc:'Output trim after a gentle warmth shaper, glue compressor and a brick-wall limiter (−1.5 dB, ratio 20 — the house ceiling).',params:{
      trim:{v:.9,min:.3,max:1.3,step:.01,label:'out trim',doc:'final level after the limiter'},
      drive:{v:.06,min:0,max:.5,step:.01,label:'warmth drive',doc:'gentle waveshaper — warmth only at the shipped value'},
      limThresh:{v:-1.5,min:-6,max:0,step:.1,unit:'dB',label:'limiter ceiling',doc:'brick-wall threshold; the mix never exceeds this'},
    }},
    voice:{label:'voice',doc:'The main voice.',params:{
      level:{v:.5,min:0,max:1.2,step:.01,label:'level',doc:'voice bus gain'},
      attack:{v:.008,min:.001,max:.1,step:.001,unit:'s',label:'attack',doc:'onset time'},
      // …every synthesis constant, named, bounded, documented…
    }},
  }
};

/* ---- OFFICINA bridge (identical in every machine — copy verbatim) ------- */
const TP=(()=>{const o={};for(const g in TIMBRE.groups){o[g]={};const P=TIMBRE.groups[g].params;for(const p in P)o[g][p]=P[p].v;}return o;})();
(function(){
  const KEY='opvscvla.timbre.'+TIMBRE.id, qs=new URLSearchParams(location.search);
  const set=(k,v)=>{const i=k.indexOf('.'),g=k.slice(0,i),p=k.slice(i+1);
    if(TP[g]&&(p in TP[g])&&typeof v==='number'&&isFinite(v)){TP[g][p]=v;return true}return false};
  const reset=()=>{for(const g in TIMBRE.groups){const P=TIMBRE.groups[g].params;for(const p in P)TP[g][p]=P[p].v}};
  if(!qs.has('factory')){try{const o=JSON.parse(localStorage.getItem(KEY)||'null');
    if(o&&o.v)for(const k in o.v)set(k,o.v[k]);}catch(e){}}
  if(!qs.has('bench'))return;
  const snap=()=>{const v={};for(const g in TP)for(const p in TP[g])v[g+'.'+p]=TP[g][p];return v};
  const post=m=>{try{parent.postMessage(Object.assign({officina:1,id:TIMBRE.id},m),'*')}catch(e){}};
  const hello=()=>post({op:'schema',schema:{id:TIMBRE.id,title:TIMBRE.title,doc:TIMBRE.doc,groups:TIMBRE.groups},values:snap()});
  addEventListener('message',ev=>{const m=ev.data;if(!m||m.officina!==1||m.id!==TIMBRE.id)return;
    if(m.op==='set'){if(set(m.path,m.value)&&TIMBRE.touch)TIMBRE.touch(m.path)}
    else if(m.op==='bulk'){reset();for(const k in m.values)set(k,m.values[k]);if(TIMBRE.touch)TIMBRE.touch(null)}
    else if(m.op==='demo'){if(TIMBRE.demo)TIMBRE.demo(m.group)}
    else if(m.op==='hello')hello()});
  hello();
})();
```

Then, **later** (after your audio graph exists), assign two optional hooks so
the bench can drive your running machine:

- `TIMBRE.touch = (path) => { … }` — apply an edited value to the *live* graph.
  `path` is `"group.param"`, or `null` meaning "everything changed, re-read all".
  Realtime machines ramp the affected node (`setTargetAtTime`); bake-and-loop
  machines debounce a re-render (~300 ms). **Do not restart the transport on a
  touch** — ramp or re-bake-on-next-play instead.
- `TIMBRE.demo = (group) => { … }` — audition just that group's voice(s) for a
  second or two (a few strokes through a short-lived private `AudioContext`, or,
  for continuous machines, just start the transport). The bench puts a ► HEAR
  button on every group.

`?factory` on the URL bypasses saved edits and plays the shipped voice. This all
works with zero extra effort on your part beyond the block above.

### 4.3 iOS / autoplay audio unlock (copy verbatim, call once with your `AudioContext`)

```js
function __hint(msg){/* your in-page hint element; optional */}
function __iosAudio(ac){
  try{if(navigator.audioSession&&navigator.audioSession.type!=='playback')navigator.audioSession.type='playback';}catch(e){}
  const kick=()=>{try{if(ac.state!=='running'&&ac.state!=='closed')ac.resume().catch(()=>{});}catch(e){}};
  kick();
  try{const b=ac.createBuffer(1,1,22050),s=ac.createBufferSource();s.buffer=b;s.connect(ac.destination);s.start(0);}catch(e){}
  const onVis=()=>{try{
    if(document.visibilityState==='visible')kick();
    else if(ac.state==='running')ac.suspend().catch(()=>{});
  }catch(e){}};
  document.addEventListener('visibilitychange',onVis);
  window.addEventListener('pagehide',()=>{try{if(ac.state==='running')ac.suspend().catch(()=>{});}catch(e){}});
}
```

### 4.4 Pause / resume (the shared `p` key)

Pause is `ac.suspend()`, resume is `ac.resume()`. Because every transport and
canvas is keyed off `ctx.currentTime` (which freezes while suspended), play
position and visuals hold and resume exactly. Keep a `paused` intent flag and
make sure the iOS `kick()` above doesn't auto-resume a *deliberate* pause (guard
`kick` with `if(!paused)`).

### 4.5 URL-hash round-trip (copy the shape)

```js
let __applying=false;
function __state(){ /* return {seed:…, mode:…, tempo:…, …} — every param as a string/number */ }
function __apply(o){ /* set your controls + state from o, then regen/sync UI */ }
function __hashRead(){const h=location.hash.slice(1);if(!h)return null;const o={};
  for(const q of h.split('&')){const i=q.indexOf('=');if(i>0)o[q.slice(0,i)]=decodeURIComponent(q.slice(i+1));}return o;}
function __hashWrite(){if(__applying)return;
  try{const o=__state();history.replaceState(null,'','#'+Object.entries(o).map(([k,v])=>k+'='+v).join('&'));}catch(e){}}
document.addEventListener('click',()=>setTimeout(__hashWrite,140),true);
document.addEventListener('change',()=>setTimeout(__hashWrite,140),true);
// on init: const o=__hashRead(); if(o){__applying=true;__apply(o);__applying=false;} else {regen();} __hashWrite();
```

### 4.6 Offline render → deterministic 16-bit WAV (copy `encodeWav` + `saveWav` verbatim)

Three machines shipped *without* a working WAV cut because someone forgot to
copy these. Copy them exactly. `clamp` is `(x,a,b)=>Math.min(b,Math.max(a,x))`.

```js
function encodeWav(L,R,sr){
  const n=L.length,buf=new ArrayBuffer(44+n*4),d=new DataView(buf);
  const ws=(o,s)=>{for(let i=0;i<s.length;i++)d.setUint8(o+i,s.charCodeAt(i));};
  ws(0,'RIFF');d.setUint32(4,36+n*4,true);ws(8,'WAVE');ws(12,'fmt ');
  d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,2,true);
  d.setUint32(24,sr,true);d.setUint32(28,sr*4,true);d.setUint16(32,4,true);d.setUint16(34,16,true);
  ws(36,'data');d.setUint32(40,n*4,true);
  let o=44;
  for(let i=0;i<n;i++){ d.setInt16(o,clamp(L[i],-1,1)*32767,true);o+=2; d.setInt16(o,clamp(R[i],-1,1)*32767,true);o+=2; }
  return new Blob([buf],{type:'audio/wav'});
}
function saveWav(blob,filename){
  var url=URL.createObjectURL(blob);
  try{var a=document.createElement('a');a.href=url;a.download=filename;a.style.display='none';
    document.body.appendChild(a);a.click();setTimeout(function(){try{a.remove()}catch(e){}},30000);}catch(e){}
  // (optional: also show a floating "⬇ Save WAV" bar for browsers that block the auto-download)
}
```

The cut itself renders your score through an `OfflineAudioContext` **using the
same graph and the same generated score** as realtime, so the WAV is identical
to what you hear:

```js
async function cut(){
  if(!SCORE)regen();
  const durSec = /* total length of one pressing */;
  const ctx=new OfflineAudioContext(2,Math.ceil((durSec+0.4)*SR),SR);   // SR=44100
  const G=buildGraph(ctx);
  for(const e of SCORE.events){ scheduleEvent(G,e,e.time); }             // same scheduler, offline ctx
  const rb=await ctx.startRendering();
  const n=Math.floor(durSec*SR);
  const L=rb.getChannelData(0).slice(0,n), R=rb.getChannelData(1).slice(0,n);
  saveWav(encodeWav(L,R,SR),`yourmachine_seed${st.seed}.wav`);
}
```

---

## 5. The page skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="theme-color" content="#0e0b16">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="color-scheme" content="dark">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>YOURMACHINE — one-line tagline</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{
  color-scheme:dark;
  --ground:#0e0b16; --field:#14101f; --ink:#ece7f6; --dim:#a99fc6;
  /* …a small, deliberate palette — pick colours that mean something for your idea… */
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{background:var(--ground);color:var(--ink);
  font-family:'Archivo',system-ui,sans-serif;   /* always a system fallback */
  min-height:100vh;display:flex;justify-content:center;
  padding:max(14px,env(safe-area-inset-top)) 14px calc(20px + env(safe-area-inset-bottom));}
/* …your styles… */
</style>
</head>
<body>
  <!-- title, controls (the LAW), play/pause/another/cut buttons, canvas -->
  <!-- the "on this music" panel, plus a colophon -->
<script>
  // TIMBRE + bridge, model, genAll, buildGraph, scheduler/render, canvas,
  // hash, cut, controls wiring, init
</script>
</body>
</html>
```

Visual grammar of the collection: **dark parchment/ink grounds**, one or two
mono/display fonts (Archivo, Archivo Black, IBM Plex Mono are common), a small
deliberate palette, generous whitespace, a restrained "printed instrument"
feel. The canvas is the centrepiece and should draw *the model*.

**The "on this music" panel** — every machine carries an expandable
`<details class="reader">` panel with a short, plain-language history of the
idea it renders (what the tradition/theory is, who made it, why it sounds the
way it does). Write it for a curious non-specialist. Example structure:

```html
<details class="reader">
  <summary>on this music</summary>
  <p>…two to five short paragraphs…</p>
</details>
```

---

## 6. Canvas & motion rules

- **Draw the model, not a generic visualizer.** The lattice, wheel, permutation
  line, mosaic, timeline — the picture should teach the idea.
- **Cache the static layer** to an offscreen canvas; rebuild it only when the
  model changes (new seed/mode/meter). The live pass blits the cache and draws
  only the moving parts (a playhead, a lit chord, a needle).
- **The render loop sleeps when idle.** No `requestAnimationFrame` churn when
  nothing is playing. Redraw at a modest rate (~12–30 fps) only while playing.
- **`prefers-reduced-motion`** must be respected: drop the continuous motion
  (breathing/sweeping/pulsing), keep a static or minimally-updating view.
  ```js
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```

---

## 7. Shared controls & conventions

- **Shared keys:** `space` = play/stop · `p` = pause/resume · `r` = another
  (a fresh seed / encore) · `c` = cut 16-bit WAV. Wire these globally but ignore
  them while an `INPUT`/`TEXTAREA`/`SELECT` is focused.
- **`another()`** — reroll the seed and regenerate (the `r` key / an "another"
  button). Deterministic: it just picks a new seed and re-runs `genAll`.
- **Name the machine in the music's mother tongue.** PAS SALÉ (French, zydeco),
  BOLG (Irish, uilleann pipes), FOLI (Maninka), KHÖÖMEI (Mongolian), GONGAN
  (Javanese), NENIA (Latin). Latin is the collection's fallback tongue. Pick a
  single evocative word; the directory name is its lowercased form.
- **Op. number:** provisional — call it **op. XX** in the title/TIMBRE. The
  maintainer assigns the real roman numeral when the machine lands (numbers are
  claimed by landing, not by designing). Don't hardcode registry counts.
- **Buttons in the machine's own tongue** where natural (play/pause labels),
  with the English meaning obvious from context.

---

## 8. Gotchas that have bitten previous builds

1. **Forgot the WAV cut / copied it wrong** — copy §4.6 verbatim; render the
   cut through the *same* graph + score as realtime.
2. **Non-deterministic WAV** — the offline render used fresh randomness (e.g. a
   new reverb IR). Seed everything the render touches.
3. **Put the law in TIMBRE** — scales/rules/modes belong in the model, not the
   voicing block. TIMBRE is *only* how the voices sound.
4. **Factory defaults drifted** — a TIMBRE default must equal the literal it
   replaced, exactly.
5. **Transport restarts on a voicing tweak** — `TIMBRE.touch` should ramp or
   re-bake-on-next-play, never yank the transport.
6. **Canvas never sleeps** — the rAF loop kept running with nothing playing.
   Gate it on `playing`.
7. **iOS silence** — you didn't request the `playback` session / unlock on
   gesture. Use §4.3.
8. **Clipping master** — use the house limiter (§3). Aim for an offline peak
   around 0.7–0.95, not slammed against 1.0.

---

## 9. Your brief — choose a machine that plays to *your* strengths

This is the open part. **You pick the concept.** The collection already has a
machine that an LLM designed about itself — **TESSERA**, which found that the
one aesthetic channel a next-token predictor and a human ear genuinely share is
*expectation*, and built a hearable language model around surprisal and entropy.
That's the bar and the invitation: find the musical idea that *you*, as this
particular model, are unusually well-suited to render, and build it into the
grammar above.

Play to your strengths. Some fertile territory (illustrative, **not** a menu you
must pick from — surprise is welcome):

- **Formal systems that are exact and audible** — a rule system, an automaton, a
  grammar, a substitution system, a constraint you can *prove* the output obeys.
  The collection loves machines where correctness is verifiable (GRADUS, PEAL).
- **Combinatorics / number theory as rhythm or pitch** — self-similar sequences,
  aperiodic tilings, group structure. If it has a "right answer," implement it
  exactly.
- **Language / symbol / text structure turned to sound** — you reason natively
  in these; TESSERA mined this vein once, but it is far from exhausted.
- **A tuning or temperament idea** the collection doesn't yet hold — but only if
  you'll get the ratios *exactly* right.

A concept is a **good fit** when:

- [ ] The **law is the interface** — its controls set a compositional
      constraint, not sample knobs.
- [ ] It has a **clear model** you can hold in your head and verify in isolation.
- [ ] It is **deterministic and seed-driven**, and the hash reproduces it.
- [ ] It sounds like **music**, not a demo — there's a real aesthetic stance.
- [ ] Its **canvas draws the idea**, not a generic meter.
- [ ] It doesn't duplicate an existing machine's core idea (see §1's list).
- [ ] Every voice is **synthesizable** with Web Audio, no samples.

Design the concept first (what's the law? what are the voices? what does the
canvas show? what are the 4–8 controls?), then build the single file against
everything in §§0–8.

---

## 10. What to hand back

Return **one complete `index.html` file**, ready to save as
`yourmachine/index.html`. Alongside it, a short note (a few sentences) covering:

- the **name** (and the tongue it's named in) and a one-line description;
- the **law** — the model, and why the output provably obeys it;
- the **voices** and the **canvas** — what's synthesized and what's drawn;
- the **controls** (the law made interactive) and the shared keys;
- the **TIMBRE** groups & rough param count;
- anything you **could not verify** yourself and want the maintainer to check.

**Do not** try to edit the landing page, README, or any registry — you don't
have them, and the maintainer wires all of that at landing. Your job is the one
self-contained machine. Make it exact, make it sound like music, and make it
something only you would have thought to build.

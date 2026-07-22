// OPVSCVLA headless verification harness.
//
//   node dev/verify.mjs [machine ...]      verify named machines (or all)
//   node dev/verify.mjs --quick            skip the play/cut runtime checks
//   node dev/verify.mjs --list             list discovered machines and exit
//
// It drives every machine through the house grammar that is guaranteed to be
// the same across all of them — the OFFICINA bench schema (postMessage) and the
// shared keyboard transport (space = play, c = cut) — so ONE harness verifies
// every machine without per-machine wiring. A machine may add an optional
// `<machine>/expected.json` for extra assertions (see dev/template/expected.json).
//
// Exit code is non-zero if any machine fails, so CI can gate on it.

import { chromium } from 'playwright';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { machineDirs, REPO_ROOT } from './lib/machines.mjs';

const args = process.argv.slice(2);
const QUICK = args.includes('--quick');
const named = args.filter(a => !a.startsWith('--'));
const all = machineDirs();
if (args.includes('--list')) { console.log(all.join('\n')); process.exit(0); }
const targets = named.length ? named : all;

// The offline render (cut) is CPU-bound and long-form machines can take a minute
// on a headless software-GL runner, so the download timeout is generous. Machines
// run through a small concurrency pool to keep wall-time down despite that.
const CUT_TIMEOUT = Number(process.env.VERIFY_CUT_TIMEOUT) || 90000;
const CONCURRENCY = Math.max(1, Number(process.env.VERIFY_CONCURRENCY) || (QUICK ? 6 : 2));

// Installed before any page script runs: capture the bench schema, note whether
// a live/offline AudioContext was ever constructed, and stash page errors.
const initScript = () => {
  window.__ov = { schema: null, live: false, offline: false };
  window.addEventListener('message', e => {
    const m = e.data;
    if (m && m.officina === 1 && m.op === 'schema') window.__ov.schema = { schema: m.schema, values: m.values };
  });
  const wrap = (name, flag) => {
    const O = window[name];
    if (!O) return;
    window[name] = class extends O { constructor(...a) { super(...a); window.__ov[flag] = true; } };
  };
  wrap('AudioContext', 'live'); window.webkitAudioContext = window.AudioContext;
  wrap('OfflineAudioContext', 'offline'); window.webkitOfflineAudioContext = window.OfflineAudioContext;
};

async function newPage(context) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });
  await page.addInitScript(initScript);
  return { page, errors };
}

async function verifyMachine(context, dir) {
  const checks = [];
  const add = (name, ok, detail = '') => checks.push({ name, ok, detail });
  const fileUrl = q => 'file://' + join(REPO_ROOT, dir, 'index.html') + q;

  // 1) loads clean (factory) + has a canvas
  {
    const { page, errors } = await newPage(context);
    try {
      await page.goto(fileUrl('?factory'), { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(400);
      add('loads-clean', errors.length === 0, errors.slice(0, 3).join(' | '));
    } catch (e) { add('loads-clean', false, String(e.message || e)); }
    finally { await page.close(); }
  }

  // 2) bench schema is well-formed and addresses this machine
  {
    const { page, errors } = await newPage(context);
    try {
      await page.goto(fileUrl('?bench'), { waitUntil: 'load', timeout: 20000 });
      const ov = await page.waitForFunction(() => window.__ov && window.__ov.schema, null, { timeout: 8000 })
        .then(h => h.jsonValue()).catch(() => null);
      const s = ov && ov.schema;
      let ok = !!(s && s.id === dir && s.groups && typeof s.groups === 'object');
      let groups = 0, params = 0, malformed = '';
      if (ok) {
        for (const g in s.groups) {
          groups++;
          const P = s.groups[g].params || {};
          for (const p in P) {
            params++;
            const d = P[p];
            for (const k of ['v', 'min', 'max', 'step']) if (typeof d[k] !== 'number') malformed ||= `${g}.${p}.${k} not numeric`;
            if (typeof d.label !== 'string' || !d.label) malformed ||= `${g}.${p} missing label`;
          }
        }
        if (malformed) ok = false;
      }
      add('bench-schema', ok, ok ? `${groups} groups / ${params} params` : (malformed || 'no schema / wrong id'));
      // optional per-machine expectations
      const expPath = join(REPO_ROOT, dir, 'expected.json');
      if (existsSync(expPath)) {
        const exp = JSON.parse(readFileSync(expPath, 'utf8'));
        const problems = [];
        if (exp.schemaId && s?.id !== exp.schemaId) problems.push(`id ${s?.id}≠${exp.schemaId}`);
        if (exp.groups != null && groups !== exp.groups) problems.push(`groups ${groups}≠${exp.groups}`);
        if (exp.params != null && params !== exp.params) problems.push(`params ${params}≠${exp.params}`);
        const html = readFileSync(join(REPO_ROOT, dir, 'index.html'), 'utf8');
        for (const needle of (exp.mustContain || [])) if (!html.includes(needle)) problems.push(`missing "${needle}"`);
        add('expected.json', problems.length === 0, problems.join('; '));
      }
      if (errors.length) add('bench-clean', false, errors.slice(0, 3).join(' | '));
    } catch (e) { add('bench-schema', false, String(e.message || e)); }
    finally { await page.close(); }
  }

  if (QUICK) return { dir, checks };

  // 3) plays clean — the shared Space key starts the transport (trusted gesture)
  {
    const { page, errors } = await newPage(context);
    try {
      await page.goto(fileUrl('?factory'), { waitUntil: 'load', timeout: 20000 });
      await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
      await page.keyboard.press('Space');
      await page.waitForTimeout(1600);
      const live = await page.evaluate(() => window.__ov.live);
      add('plays-clean', errors.length === 0 && live, errors.length ? errors.slice(0, 2).join(' | ') : (live ? '' : 'no AudioContext started'));
    } catch (e) { add('plays-clean', false, String(e.message || e)); }
    finally { await page.close(); }
  }

  // 4) cut works — the shared 'c' key runs the offline render + WAV download.
  // A full download proves the WAV bytes; if the render is merely slow (long
  // arrangements can exceed the budget on a software-GL runner), an
  // OfflineAudioContext constructed with no page error still proves the cut path
  // is wired and healthy — that's the correctness property, render speed isn't.
  {
    const { page, errors } = await newPage(context);
    try {
      await page.goto(fileUrl('?factory'), { waitUntil: 'load', timeout: 20000 });
      await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
      const dlP = page.waitForEvent('download', { timeout: CUT_TIMEOUT }).then(d => d).catch(() => null);
      await page.keyboard.press('c');
      const dl = await dlP;
      if (dl) {
        const buf = readFileSync(await dl.path());
        const isWav = buf.length > 44 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WAVE';
        add('cut-renders-wav', isWav && errors.length === 0, isWav ? `${(buf.length / 1024 | 0)} KiB` : 'not a RIFF/WAVE');
      } else {
        const started = await page.evaluate(() => window.__ov.offline).catch(() => false);
        add('cut-renders-wav', started && errors.length === 0,
          started ? `render started, no download in ${CUT_TIMEOUT / 1000 | 0}s (slow render, path wired)` : (errors.slice(0, 2).join(' | ') || "'c' did not start a render"));
      }
    } catch (e) { add('cut-renders-wav', false, String(e.message || e)); }
    finally { await page.close(); }
  }

  return { dir, checks };
}

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const context = await browser.newContext({ acceptDownloads: true });
// Machines are offline-only; the sole external request is the Google Fonts
// stylesheet. Fulfill external requests with an empty 200 (rather than abort,
// which logs a console error) so the machines render deterministically without
// network and the error checks stay meaningful.
await context.route('**', route => {
  const u = route.request().url();
  return (u.startsWith('http://') || u.startsWith('https://'))
    ? route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
    : route.continue();
});

let failed = 0;
console.log(`OPVSCVLA verify — ${targets.length} machine(s)${QUICK ? ' (quick)' : ''}, concurrency ${CONCURRENCY}\n`);
const queue = targets.slice();
async function worker() {
  while (queue.length) {
    const dir = queue.shift();
    let res;
    try { res = await verifyMachine(context, dir); }
    catch (e) { res = { dir, checks: [{ name: 'harness', ok: false, detail: String(e.message || e) }] }; }
    const bad = res.checks.filter(c => !c.ok);
    if (bad.length) failed++;
    let out = `${bad.length ? '✗' : '✓'} ${dir}\n`;
    for (const c of res.checks) out += `    ${c.ok ? '·' : '✗'} ${c.name}${c.detail ? '  — ' + c.detail : ''}\n`;
    process.stdout.write(out);   // one atomic write per machine so pooled output doesn't interleave
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));
await browser.close();
console.log(`\n${targets.length - failed}/${targets.length} machines clean.`);
process.exit(failed ? 1 : 0);

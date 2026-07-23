// Shared helpers for the OPVSCVLA dev tooling (verify + check).
// Pure Node, no deps. Machines are discovered from the filesystem so the
// tooling never carries a hand-maintained list to drift out of sync.

import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Directories that live at the repo root but are NOT op. machines.
const NOT_MACHINES = new Set(['officina', 'opxy', 'dev', 'node_modules', 'scratchpad', '.git', '.github']);

// Every top-level directory that carries an index.html and is a real op.
export function machineDirs(root = REPO_ROOT) {
  return readdirSync(root)
    .filter(name => !NOT_MACHINES.has(name) && !name.startsWith('.'))
    .filter(name => { try { return statSync(join(root, name)).isDirectory(); } catch { return false; } })
    .filter(name => existsSync(join(root, name, 'index.html')))
    .sort();
}

export function machineHtml(dir, root = REPO_ROOT) {
  return readFileSync(join(root, dir, 'index.html'), 'utf8');
}

// The OFFICINA bridge is one IIFE anchored on the localStorage key it builds.
// Pull it out and strip whitespace so copies can be compared regardless of
// incidental formatting. Returns null if no bridge is present.
export function extractBridge(html) {
  const anchor = html.indexOf("opvscvla.timbre.");
  if (anchor < 0) return null;
  const start = html.lastIndexOf('(function(){', anchor);
  if (start < 0) return null;
  const end = html.indexOf('})();', anchor);
  if (end < 0) return null;
  return html.slice(start, end + '})();'.length);
}

export const normalize = s => (s || '').replace(/\s+/g, '');

// ---- registry parsing -------------------------------------------------------

export function registries(root = REPO_ROOT) {
  const read = p => (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : '');
  return {
    'index.html': read('index.html'),
    'README.md': read('README.md'),
    'officina/index.html': read('officina/index.html'),
    'HANDOFF.md': read('HANDOFF.md'),
  };
}

const ROMAN = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
export function toRoman(n) { let out = ''; for (const [sym, val] of ROMAN) while (n >= val) { out += sym; n -= val; } return out; }
export function fromRoman(s) {
  const v = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let n = 0; s = (s || '').toUpperCase();
  for (let i = 0; i < s.length; i++) { const c = v[s[i]], nx = v[s[i+1]] || 0; n += c < nx ? -c : c; }
  return n;
}

// English words for a count, e.g. 30 -> "thirty", 29 -> "twenty-nine". Handles
// 0-199, which is all this collection will plausibly reach; returns the digits
// as a fallback beyond that.
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
export function numberWords(n) {
  if (n < 0 || n >= 200) return String(n);
  if (n < 20) return ONES[n];
  if (n < 100) { const o = n % 10; return o ? `${TENS[(n / 10) | 0]}-${ONES[o]}` : TENS[(n / 10) | 0]; }
  const r = n % 100; return 'one hundred' + (r ? ' ' + numberWords(r) : '');
}

// Parse the HANDOFF file table rows: "rille/index.html  op. IV  RILLE  — ..."
export function handoffOpTable(handoffText) {
  const rows = [];
  const re = /^(\S+?)\/index\.html\s+op\.\s+([IVXLCM]+)\s+/gm;
  let m; while ((m = re.exec(handoffText))) rows.push({ dir: m[1], op: fromRoman(m[2]), roman: m[2] });
  return rows;
}

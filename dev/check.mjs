// OPVSCVLA static drift checker (no browser).
//
//   node dev/check.mjs        run all checks, non-zero exit on any failure
//   node dev/check.mjs --next print the next free op. numeral and exit
//
// Catches the two silent-drift classes that hurt a many-agent repo:
//   (a) the OFFICINA bridge — duplicated verbatim in every machine — quietly
//       diverging in one copy;
//   (b) a machine missing from one of the four registries (landing card,
//       README row, officina chip, HANDOFF file table), or the op. numbering
//       colliding / skipping.

import { machineDirs, machineHtml, extractBridge, normalize, registries, handoffOpTable, toRoman } from './lib/machines.mjs';

const dirs = machineDirs();
const problems = [];
const note = m => problems.push(m);

// --- (a) OFFICINA bridge identity -------------------------------------------
// Group machines by the normalized text of their bridge; the plurality group is
// the canonical one, everyone else has drifted (or is missing the bridge).
{
  const byHash = new Map();      // normalized bridge -> [dirs]
  const missing = [];
  for (const dir of dirs) {
    const b = extractBridge(machineHtml(dir));
    if (!b) { missing.push(dir); continue; }
    const key = normalize(b);
    (byHash.get(key) || byHash.set(key, []).get(key)).push(dir);
  }
  if (missing.length) note(`bridge: missing entirely in ${missing.join(', ')}`);
  if (byHash.size > 1) {
    const groups = [...byHash.values()].sort((a, b) => b.length - a.length);
    const canonical = groups[0];
    for (const g of groups.slice(1))
      note(`bridge: drifted in ${g.join(', ')} (differs from the ${canonical.length}-machine canonical copy)`);
  }
}

// --- (b) registry coverage ---------------------------------------------------
{
  const reg = registries();
  const label = { 'index.html': 'landing card', 'README.md': 'README row', 'officina/index.html': 'officina chip', 'HANDOFF.md': 'HANDOFF table' };
  for (const dir of dirs)
    for (const file of Object.keys(reg))
      if (!reg[file].includes(dir)) note(`registry: ${dir} is missing from the ${label[file]} (${file})`);

  // reverse: a registry naming a machine directory that no longer exists
  const known = new Set(dirs);
  const table = handoffOpTable(reg['HANDOFF.md']);
  for (const row of table) if (!known.has(row.dir)) note(`registry: HANDOFF table lists "${row.dir}" but there is no such machine dir`);

  // --- op. numbering: no duplicates, no gaps -------------------------------
  const byOp = new Map();
  for (const row of table) (byOp.get(row.op) || byOp.set(row.op, []).get(row.op)).push(row.dir);
  for (const [op, ds] of byOp) if (ds.length > 1) note(`numbering: op. ${toRoman(op)} claimed by ${ds.join(' AND ')}`);
  if (table.length) {
    const max = Math.max(...table.map(r => r.op));
    for (let i = 1; i <= max; i++) if (!byOp.has(i)) note(`numbering: op. ${toRoman(i)} is skipped (gap in the sequence)`);
  }
  if (table.length !== dirs.length) note(`numbering: HANDOFF table has ${table.length} rows but ${dirs.length} machine dirs exist`);

  if (process.argv.includes('--next')) {
    const max = table.length ? Math.max(...table.map(r => r.op)) : 0;
    console.log(toRoman(max + 1));
    process.exit(0);
  }
}

// --- report ------------------------------------------------------------------
console.log(`OPVSCVLA check — ${dirs.length} machines\n`);
if (!problems.length) { console.log('✓ no drift: bridge identical everywhere, all registries agree, numbering clean.'); process.exit(0); }
for (const p of problems) console.log('✗ ' + p);
console.log(`\n${problems.length} problem(s).`);
process.exit(1);

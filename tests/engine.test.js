// Engine test: loads story.js + logic-engine.js in a vm and checks puzzles.
const fs = require('fs');
const vm = require('vm');
const DIR = require('path').join(__dirname, '..');
const ctx = { console, Math };
vm.createContext(ctx);
for (const f of ['story.js', 'logic-engine.js']) {
  vm.runInContext(fs.readFileSync(`${DIR}/${f}`, 'utf8'), ctx, { filename: f });
}
const { buildCase, PuzzleGenerator, LogicGrid, ClueFormatter, HintEngine, CELL_CONFIRMED, CELL_ELIMINATED, CELL_EMPTY } = vm.runInContext('({ buildCase, PuzzleGenerator, LogicGrid, ClueFormatter, HintEngine, CELL_CONFIRMED, CELL_ELIMINATED, CELL_EMPTY })', ctx);

// Independent brute-force solution counter: enumerate all permutation tuples, keep those consistent with every clue.
function permutations(n) {
  const out = [];
  const rec = (arr, used) => {
    if (arr.length === n) { out.push([...arr]); return; }
    for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; arr.push(i); rec(arr, used); arr.pop(); used[i] = false; }
  };
  rec([], []);
  return out;
}
function clueHolds(clue, perms) {
  // perms[c][i] = item of category c in group i; group index == item of category 0
  const link = (c1, i1, c2) => {
    // find group where category c1 has item i1, return item of c2
    for (let g = 0; g < perms[0].length; g++) if (perms[c1][g] === i1) return perms[c2][g];
  };
  const j = link(clue.cat1, clue.item1, clue.cat2);
  switch (clue.type) {
    case 'positive': return j === clue.item2;
    case 'negative': return j !== clue.item2;
    case 'or': return clue.items2.includes(j);
    case 'neither': return !clue.items2.includes(j);
  }
  throw new Error('unknown clue type ' + clue.type);
}
function countSolutions(numCat, N, clues) {
  const P = permutations(N);
  const id = P[0].slice(); // identity for category 0
  let count = 0;
  const rec = (c, perms) => {
    if (c === numCat) { if (clues.every(cl => clueHolds(cl, perms))) count++; return; }
    for (const p of P) { perms.push(p); rec(c + 1, perms); perms.pop(); if (count > 1) return; }
  };
  rec(1, [id]);
  return count;
}

let failures = 0;
const fail = (m) => { failures++; console.log('FAIL', m); };
const stats = {};
for (const diff of ['makkelijk', 'gemiddeld', 'moeilijk']) {
  const cfg = buildCase(diff);
  stats[diff] = { n: 0, clues: [], types: {} };
  for (let seed = 1; seed <= 40; seed++) {
    const gen = new PuzzleGenerator(cfg.numCategories, cfg.numItems, diff);
    const { solution, clues } = gen.generate(seed * 7919);
    // Latin property
    for (let c = 0; c < cfg.numCategories; c++) {
      const s = new Set(solution.map(g => g[c]));
      if (s.size !== cfg.numItems) fail(`${diff} seed ${seed}: category ${c} not a permutation`);
    }
    // Propagation solves it and matches the solution
    const g = new LogicGrid(cfg.numCategories, cfg.numItems);
    clues.forEach(cl => g.applyClue(cl));
    g.propagate();
    if (!g.isSolved()) fail(`${diff} seed ${seed}: propagation does not solve`);
    if (g.hasContradiction()) fail(`${diff} seed ${seed}: contradiction`);
    for (const grp of solution) {
      for (let a = 0; a < cfg.numCategories; a++) for (let b = a + 1; b < cfg.numCategories; b++) {
        if (g.get(a, b, grp[a], grp[b]) !== CELL_CONFIRMED) fail(`${diff} seed ${seed}: solved grid differs from solution`);
      }
    }
    // Independent uniqueness
    const cnt = countSolutions(cfg.numCategories, cfg.numItems, clues);
    if (cnt !== 1) fail(`${diff} seed ${seed}: ${cnt} solutions`);
    // Clue text renders
    for (const cl of clues) {
      const t = ClueFormatter.format(cl, cfg.categories);
      if (!t || t.includes('undefined')) fail(`${diff} seed ${seed}: bad clue text "${t}"`);
    }
    // Hints: from empty grid, follow hints until solved (must terminate, must never contradict solution)
    const pg = new LogicGrid(cfg.numCategories, cfg.numItems);
    let steps = 0, hint;
    while ((hint = HintEngine.getHint(pg, clues, cfg.categories)) && steps < 500) {
      steps++;
      for (const m of hint.cells) {
        const truth = solution.some(grp => grp[m.catI] === m.itemI && grp[m.catJ] === m.itemJ);
        if ((m.value === CELL_CONFIRMED) !== truth) fail(`${diff} seed ${seed}: hint contradicts solution: ${hint.text}`);
        if (m.value === CELL_CONFIRMED) pg.confirm(m.catI, m.itemI, m.catJ, m.itemJ); else pg.eliminate(m.catI, m.itemI, m.catJ, m.itemJ);
      }
    }
    if (steps >= 500) fail(`${diff} seed ${seed}: hint loop does not terminate`);
    if (!pg.isSolved()) { stats[diff].hintStuck = (stats[diff].hintStuck || 0) + 1; fail(`${diff} seed ${seed}: hints run dry before the puzzle is solved (after ${steps} hints)`); }
    stats[diff].hintSteps = (stats[diff].hintSteps || 0) + steps;
    // Mistake detection: put a wrong ✓ on an empty grid, the first hint must flag it (level 0)
    const wrong = new LogicGrid(cfg.numCategories, cfg.numItems);
    const g0 = solution[0];
    const wrongItem = (g0[1] + 1) % cfg.numItems;
    wrong.set(0, 1, g0[0], wrongItem, CELL_CONFIRMED);
    const h0 = HintEngine.getHint(wrong, clues, cfg.categories);
    if (!h0 || h0.level !== 0 || h0.cells[0].value !== CELL_EMPTY) fail(`${diff} seed ${seed}: mistake not flagged: ${h0 && h0.text}`);
    // Hint levels must be within 0..3 and every hint must name at least one cell
    const chk = HintEngine.getHint(new LogicGrid(cfg.numCategories, cfg.numItems), clues, cfg.categories);
    if (!chk || !chk.cells.length || !chk.text || !chk.detail) fail(`${diff} seed ${seed}: empty-grid hint malformed`);
    // Clue mix constraints
    const pos = clues.filter(c => c.type === 'positive').length;
    if (diff === 'moeilijk' && pos > 1) fail(`${diff} seed ${seed}: ${pos} positive clues`);
    if (diff === 'gemiddeld' && pos > 3) fail(`${diff} seed ${seed}: ${pos} positive clues`);
    if (clues.length > 2 * cfg.numItems + 5) fail(`${diff} seed ${seed}: too many clues (${clues.length})`);
    // Determinism
    const again = new PuzzleGenerator(cfg.numCategories, cfg.numItems, diff).generate(seed * 7919);
    if (JSON.stringify(again) !== JSON.stringify({ solution, clues })) fail(`${diff} seed ${seed}: not deterministic`);

    stats[diff].n++;
    stats[diff].clues.push(clues.length);
    clues.forEach(cl => stats[diff].types[cl.type] = (stats[diff].types[cl.type] || 0) + 1);
  }
}
for (const [d, s] of Object.entries(stats)) {
  const sorted = s.clues.slice().sort((a, b) => a - b);
  console.log(`${d}: puzzles=${s.n} clues min/median/max=${sorted[0]}/${sorted[Math.floor(sorted.length / 2)]}/${sorted[sorted.length - 1]} types=${JSON.stringify(s.types)} hintStuck=${s.hintStuck || 0} avgHints=${(s.hintSteps / s.n).toFixed(1)}`);
}
// Daily: no-seed generate also works
const cfg = buildCase('gemiddeld');
const r = new PuzzleGenerator(3, 4, 'gemiddeld').generate();
if (!r.clues.length) fail('unseeded generate produced no clues');
// Sample clue texts
const sample = new PuzzleGenerator(3, 4, 'gemiddeld').generate(20260902);
console.log('Sample daily clues (seed 20260902):');
sample.clues.forEach((c, i) => console.log(`  ${i + 1}. ${ClueFormatter.format(c, cfg.categories)}`));
const hardCfg = buildCase('moeilijk');
const hard = new PuzzleGenerator(3, 5, 'moeilijk').generate(20260902);
console.log('Sample hard clues (seed 20260902):');
hard.clues.forEach((c, i) => console.log(`  ${i + 1}. ${ClueFormatter.format(c, hardCfg.categories)}`));
const easyCfg = buildCase('makkelijk');
const easy = new PuzzleGenerator(3, 3, 'makkelijk').generate(20260902);
console.log('Sample easy clues (seed 20260902):');
easy.clues.forEach((c, i) => console.log(`  ${i + 1}. ${ClueFormatter.format(c, easyCfg.categories)}`));
// Walk through the hints of the daily puzzle once, printing them (readability check)
{
  const pg = new LogicGrid(3, 4); let n = 0, h;
  console.log('Hint walkthrough (daily, first 6):');
  while ((h = HintEngine.getHint(pg, sample.clues, cfg.categories)) && n < 6) {
    n++; console.log(`  [L${h.level}] ${h.text}\n        ${h.detail}`);
    for (const m of h.cells) { if (m.value === CELL_CONFIRMED) pg.confirm(m.catI, m.itemI, m.catJ, m.itemJ); else pg.eliminate(m.catI, m.itemI, m.catJ, m.itemJ); }
  }
}
console.log(failures ? `\n${failures} FAILURES` : '\nALL ENGINE CHECKS PASSED');
process.exit(failures ? 1 : 0);

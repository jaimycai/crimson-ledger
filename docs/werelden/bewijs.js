// Proves every case in zaken.js the way tests/campaign.test.js does for campaign.js:
// it loads with the same retries as Campaign.generateFor, has exactly one solution, the right world, difficulty and
// number of suspects, a meester case is solvable step by step, and no seed is already used in campaign.js.
//   node docs/werelden/bewijs.js
global.window = {};
require('./ontwerp.js');
const { ZAKEN } = require('./zaken.js');
const { FloorPlan } = require('../../floorplan.js');
const { CAMPAIGN } = require('../../campaign.js');

const themes = Object.fromEntries(window.ONTWERP.map(w => [w.id, w]));
const used = new Set(CAMPAIGN.flatMap(ch => ch.cases.map(c => c.seed)));
const seen = new Set();
let total = 0, ok = 0;
const t0 = Date.now();
for (const ch of ZAKEN) {
  let okCh = 0;
  ch.cases.forEach((c, i) => {
    total++;
    const problems = [];
    if (used.has(c.seed) || seen.has(c.seed)) problems.push(`seed ${c.seed} al in gebruik`);
    seen.add(c.seed);
    let p = null;
    for (let k = 0; k < 12 && !p; k++) p = FloorPlan.generate(c.seed + k * 7919, c.difficulty, themes[ch.theme]);
    if (!p) problems.push('geen puzzel');
    else {
      const sols = FloorPlan.solve(p, 3).length;
      if (sols !== 1) problems.push(`${sols} oplossingen`);
      if (p.difficulty !== c.difficulty) problems.push(`moeilijkheid ${p.difficulty}`);
      if (p.suspects.length !== FloorPlan.DIFF[c.difficulty].suspects) problems.push(`${p.suspects.length} verdachten`);
      if (c.difficulty === 'meester' && !FloorPlan.stepwise(p).solved) problems.push('niet stap voor stap op te lossen');
    }
    if (problems.length) console.log(`FAIL ${ch.key} ${i + 1} "${c.title}": ${problems.join(', ')}`);
    else okCh++;
  });
  ok += okCh;
  console.log(`${okCh === ch.cases.length ? 'ok  ' : 'FAIL'} ${ch.key}: ${okCh}/${ch.cases.length}`);
}
console.log(`\n${ok}/${total} zaken bewezen (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
process.exit(ok === total ? 0 : 1);

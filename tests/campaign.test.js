// Campagne: elke zaak laadt (met dezelfde herkansing als het bord), is uniek oplosbaar, hoort bij het juiste thema en de juiste moeilijkheid.
const { FloorPlan } = require('../floorplan.js');
const { Themes } = require('../themes.js');
const { Campaign, CAMPAIGN } = require('../campaign.js');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const t0 = Date.now();
let total = 0, okCases = 0;
for (const ch of CAMPAIGN) {
  const seeds = new Set();
  let okCh = 0;
  ch.cases.forEach((c, idx) => {
    total++; seeds.add(c.seed);
    const p = Campaign.generateFor(ch.theme, idx, FloorPlan, Themes);
    if (!p) return console.log(`  ${ch.theme} ${idx + 1} "${c.title}": geen puzzel`);
    const sols = FloorPlan.solve(p, 3);
    const good = sols.length === 1 && p.theme.id === ch.theme && p.difficulty === c.difficulty && p.suspects.length === FloorPlan.DIFF[c.difficulty].suspects;
    if (!good) console.log(`  ${ch.theme} ${idx + 1}: ${sols.length} oplossingen / thema ${p.theme.id} / ${p.difficulty}`);
    else okCh++;
  });
  okCases += okCh;
  check(okCh === ch.cases.length, `${ch.theme}: ${okCh}/${ch.cases.length} zaken laden en zijn uniek`);
  check(seeds.size === ch.cases.length, `${ch.theme}: unieke seeds`);
  const diffs = ch.cases.map(c => c.difficulty);
  check(diffs[0] === 'makkelijk' && diffs[diffs.length - 1] === 'moeilijk', `${ch.theme}: loopt op van makkelijk naar moeilijk`);
}
check(okCases === total && total === Campaign.total(), `alle ${total} campagnezaken in orde`);
check(Campaign.starsFor(0, 0) === 3 && Campaign.starsFor(0, 2) === 2 && Campaign.starsFor(1, 0) === 2 && Campaign.starsFor(2, 1) === 1, 'sterrenregels');
check(Campaign.isUnlocked('landhuis', 0) && !Campaign.isUnlocked('landhuis', 1), 'zonder voortgang: alleen de eerste zaak open');
check(Campaign.next('landhuis', 7) === null && Campaign.next('landhuis', 0).title === 'De verdwenen sleutel', 'volgende-zaak-logica');
console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
console.log(failures === 0 ? 'ALLE CAMPAGNE CHECKS PASSED' : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

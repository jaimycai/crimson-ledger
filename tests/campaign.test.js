// Campagne: elke zaak laadt (met dezelfde herkansing als het bord), is uniek oplosbaar, hoort bij het juiste thema en de juiste moeilijkheid.
const { FloorPlan } = require('../floorplan.js');
const { Themes } = require('../themes.js');
const { Campaign, CAMPAIGN } = require('../campaign.js');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const t0 = Date.now();
let total = 0, okCases = 0;
const allSeeds = new Set();
for (const ch of CAMPAIGN) {
  let okCh = 0;
  ch.cases.forEach((c, idx) => {
    total++; allSeeds.add(c.seed);
    const p = Campaign.generateFor(ch.key, idx, FloorPlan, Themes);
    if (!p) return console.log(`  ${ch.key} ${idx + 1} "${c.title}": geen puzzel`);
    const sols = FloorPlan.solve(p, 3);
    const good = sols.length === 1 && p.theme.id === ch.theme && p.difficulty === c.difficulty && p.suspects.length === FloorPlan.DIFF[c.difficulty].suspects;
    if (!good) console.log(`  ${ch.key} ${idx + 1}: ${sols.length} oplossingen / thema ${p.theme.id} / ${p.difficulty}`);
    else okCh++;
  });
  okCases += okCh;
  check(okCh === ch.cases.length, `${ch.key}: ${okCh}/${ch.cases.length} zaken laden en zijn uniek`);
  const diffs = ch.cases.map(c => c.difficulty);
  check(diffs[0] === 'makkelijk' && diffs[diffs.length - 1] === 'moeilijk', `${ch.key}: loopt op van makkelijk naar moeilijk`);
  check(!!(ch.title && ch.intro && ch.outro) && ch.cases.every(c => c.title && c.story), `${ch.key}: titel, intro, outro en verhaaltjes aanwezig`);
}
check(allSeeds.size === total, 'alle seeds uniek over de hele campagne');
check(okCases === total && total === Campaign.total() && total >= 96, `alle ${total} campagnezaken in orde`);

// eindeloos archief
const N = 12; let okArch = 0;
for (let n = 1; n <= N; n++) {
  const p = Campaign.generateFor(Campaign.ARCHIVE, n - 1, FloorPlan, Themes);
  if (p && FloorPlan.solve(p, 3).length === 1 && p.theme.id === Campaign.archive(n).theme) okArch++;
}
check(okArch === N, `archief: ${okArch}/${N} dossiers laden en zijn uniek`);
check(Campaign.archive(1).difficulty === 'makkelijk' && Campaign.archive(200).title === 'Dossier 200' && Campaign.archive(200).seed !== Campaign.archive(199).seed, 'archief is eindeloos genummerd');

check(Campaign.starsFor(0, 0) === 3 && Campaign.starsFor(0, 2) === 2 && Campaign.starsFor(1, 0) === 2 && Campaign.starsFor(2, 1) === 1, 'sterrenregels');
check(Campaign.isUnlocked('landhuis', 0) && !Campaign.isUnlocked('landhuis', 1), 'zonder voortgang: alleen de eerste zaak open');
check(Campaign.chapterOpen('landhuis') && !Campaign.chapterOpen('landhuis-2') && !Campaign.chapterOpen(Campaign.ARCHIVE), 'zonder voortgang: deel I open, deel II en archief dicht');
const n1 = Campaign.next('landhuis', 7);
check(n1 && n1.chapter === 'landhuis-2' && n1.idx === 0 && Campaign.next('landhuis-3', 7) === null && Campaign.next('landhuis', 0).title === 'De verdwenen sleutel' && Campaign.next(Campaign.ARCHIVE, 4).title === 'Dossier 6', 'volgende-zaak-logica: door naar het volgende deel, archief telt door');

// bewijsstukken, briefings, archief per wereld, wereldhulpjes
const items = CAMPAIGN.flatMap(ch => ch.cases.map(c => c.item));
check(items.every(i => i && /^\S+ .+/.test(i)) && new Set(items).size >= 90, `elke zaak heeft een bewijsstuk (icoon + naam), ${new Set(items).size} verschillende`);
check(CAMPAIGN.every(ch => ch.briefing && ch.briefing.length > 40), 'elk deel heeft een briefing van Van Dam');
check(Campaign.isUnlocked(Campaign.ARCHIVE, 0) && !Campaign.isUnlocked(Campaign.ARCHIVE, 1), 'archief: dossier 1 open zodra het archief open is, dossier 2 wacht op dossier 1');
const al = Campaign.archiveList();
check(al.length === 2 && al[0].title === 'Dossier 1' && al[1].title === 'Dossier 2' && al.every(c => c.state === 'locked') && al[0].theme === 'landhuis' && al[1].theme === 'piraten', 'archief op de kaart: dossier 1 en 2 (thema wisselt), dicht zolang het archief dicht is');
check(Campaign.worldTotal('piraten') === 24 && Campaign.worldStars('piraten') === 0 && Campaign.worldDone('piraten') === 0, 'wereldtellers');
check(Campaign.current('landhuis').title === 'Het glas Bordeaux' && Campaign.current('piraten', false) === null && Campaign.nextOverall(null, 'hotel').title === 'Middernacht', 'huidige zaak per wereld en over alle werelden');
console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
console.log(failures === 0 ? 'ALLE CAMPAGNE CHECKS PASSED' : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

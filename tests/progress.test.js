// Punten, weekstrook, zaak van de week, onderscheidingen, bewijsstukken en de mentor: zonder DOM.
const { Progress } = require('../progress.js');
const { Mentor } = require('../mentor.js');
const { Campaign } = require('../campaign.js');
const { FloorPlan } = require('../floorplan.js');
const { Themes } = require('../themes.js');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
// nep-opslag zoals App die biedt
const store = {};
global.App = { storageGet: k => (k in store ? store[k] : null), storageSet: (k, v) => { store[k] = String(v); } };
global.Campaign = Campaign;

// punten
const s1 = Progress.score({ difficulty: 'gemiddeld', elapsed: 120, hintsUsed: 0, attempts: 0 });
check(s1.total === 500 + 125 + 200 + 150 && s1.rows.length === 4, `score gemiddeld, 2 min, zonder hint, in één keer = ${s1.total}`);
const s2 = Progress.score({ difficulty: 'moeilijk', elapsed: 999, hintsUsed: 2, attempts: 1, isDaily: true, isWeekly: true, isArchive: true });
check(s2.total === 800 + 0 + 0 + 0 + 150 + 300 + 100 && s2.rows.length === 7, `score moeilijk met alle bonussen behalve tijd/hint/poging = ${s2.total}`);
check(Progress.points() === 0 && Progress.addPoints(970) === 970 && Progress.points() === 970, 'punten tellen op en worden bewaard');

// weekstrook (woensdag 9 sep 2026)
const wed = new Date(2026, 8, 9, 12);
Progress.logDaily(new Date(2026, 8, 7)); Progress.logDaily(new Date(2026, 8, 8)); Progress.logDaily(new Date(2026, 8, 8));
const week = Progress.week(wed);
check(week.length === 7 && week[0].key === '2026-09-07' && week[6].key === '2026-09-13', 'week loopt van maandag tot en met zondag');
check(week[0].played && week[1].played && !week[2].played && week[2].today && week[3].future && week[6].reward, 'weekstrook: gespeeld, vandaag, toekomst, beloning op zondag');
check(Progress.dailyLog().length === 2 && !Progress.weekFull(wed), 'logboek zonder dubbelen, week nog niet vol');
[9, 10, 11, 12, 13].forEach(d => Progress.logDaily(new Date(2026, 8, d)));
check(Progress.weekFull(wed), 'volle week na zeven dagen');

// zaak van de week
const w = Progress.weekly(wed);
check(w.key === '2026-W37' && w.difficulty === 'moeilijk' && Themes.get(w.theme).id === w.theme && w.title.length > 5, `zaak van de week: ${w.key} · ${w.theme} · ${w.title}`);
check(Progress.weekly(new Date(2026, 8, 16)).seed !== w.seed && Progress.weekly(new Date(2026, 8, 13)).seed === w.seed, 'zelfde seed de hele week, andere seed volgende week');
const wp = FloorPlan.generate(w.seed, w.difficulty, Themes.get(w.theme)) || FloorPlan.generate(w.seed + 7919, w.difficulty, Themes.get(w.theme));
check(!!wp && FloorPlan.solve(wp, 3).length === 1, 'weekzaak laadt en is uniek oplosbaar');
check(!Progress.weekDone(wed), 'weekzaak nog open');
Progress.markWeekDone('deeltekst', wed);
check(Progress.weekDone(wed) && !Progress.weekDone(new Date(2026, 8, 16)) && Progress.weekShare() === 'deeltekst', 'weekzaak afgevinkt voor deze week, deeltekst bewaard');
check(new Set([0, 1, 2, 3, 4, 5, 6, 7].map(d => Progress.dailyTitle(d))).size === 8 && Progress.dailyTitle(30) === Progress.dailyTitle(0), 'dagelijkse titels wisselen en herhalen na dertig dagen');

// onderscheidingen
const base = { solved: 0, clean: 0, streak: 0, elapsed: 300, partsDone: 0, worldsDone: [], threeStars: 0, archiveCount: 0, weekFull: false, weekDone: false, evidence: 0, points: 0, rankTitle: 'Rekruut' };
check(Progress.checkMedals(base).length === 0, 'zonder voortgang geen medaille');
let won = Progress.checkMedals({ ...base, solved: 1, elapsed: 60 });
check(won.map(m => m.id).sort().join() === 'eerste-zaak,snel', 'eerste zaak + snelle speurder: ' + won.map(m => m.title).join(', '));
check(Progress.checkMedals({ ...base, solved: 1, elapsed: 60 }).length === 0 && Progress.medalCount() === 2, 'een medaille krijg je maar één keer');
won = Progress.checkMedals({ ...base, streak: 7, clean: 10, partsDone: 1, worldsDone: ['landhuis'], threeStars: 10, archiveCount: 5, weekFull: true, weekDone: true, evidence: 24, points: 5000, rankTitle: 'Meesterdetective' });
check(won.length === Progress.MEDALS.length - 5 && !won.some(m => ['piraten', 'hotel', 'ruimte'].includes(m.id)), `alle overige ${won.length} medailles behaald in één keer (alleen de drie andere werelden niet)`);
check(Progress.formatDate('2026-01-12') === '12 jan 2026', 'datum in het Nederlands');

// vitrine
check(Progress.evidence('landhuis').length === 24 && Progress.evidence('landhuis').every(e => !e.got && e.icon && e.name), 'vitrine landhuis: 24 lege plekken');
Campaign.save('landhuis', 0, 3);
check(Progress.evidence('landhuis')[0].got && Progress.evidence('landhuis')[0].name === 'Wijnglas' && Progress.evidenceCount() === 1, 'na zaak 1 staat het wijnglas in de vitrine');

// mentor
const p = FloorPlan.generate(5101, 'makkelijk', Themes.get('landhuis'));
const b = Mentor.briefing(p, Campaign.caseAt('landhuis', 0), Campaign.chapter('landhuis'));
check(b.sub === 'Deel I · Zaak 1: Het glas Bordeaux' && b.text.includes('toost') && b.text.length > 60, 'briefing: deel, zaak, verhaaltje en een tip');
check(Mentor.remark({ hintsUsed: 0, attempts: 0, elapsed: 10, rank: 'Speurder' }).includes('Speurder'), 'opmerking spreekt de speler aan met zijn rang');
check(Mentor.remark({ newRank: 'Inspecteur' }).includes('Inspecteur'), 'opmerking bij een nieuwe rang');
const kinds = ['room', 'same-row'];
check(Mentor.introFor(kinds, []).id === 'kamers' && Mentor.introFor(kinds, ['kamers']).id === 'rijen' && Mentor.introFor(kinds, ['kamers', 'rijen']) === null, '"Nieuw!"-uitleg: één per soort, in volgorde');
check(Mentor.INTROS.every(i => i.svg.includes('<svg') && i.text.length > 30) && new Set(Mentor.INTROS.flatMap(i => i.kinds)).size === 17, 'alle 17 soorten verklaringen hebben een uitleg');
check(Mentor.reaction(false, 0) === 'Ik? Nooit!' && Mentor.reaction(true, 0).includes('Hoe wist je dat'), 'reacties bij de beschuldiging');
// verklaringen in de ik-vorm
const st = p.clues.map(c => FloorPlan.statement(c, p));
check(st.every(x => x.text.length > 5) && st.some(x => /^Ik /.test(x.text) || /en ik /.test(x.text)), 'verklaringen in de ik-vorm: ' + st[0].text);

console.log(failures === 0 ? 'ALLE PROGRESS CHECKS PASSED' : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

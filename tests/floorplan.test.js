// Engine-test v2: uniek oplosbaar, moordregel, ankers, minimale sets, hints die niet verklappen.
const { FloorPlan } = require('../floorplan.js');
const POOL = [
  { label: 'Clara', color: '#B85C5C' }, { label: 'Marcus', color: '#5C7AB8' },
  { label: 'Dr. Cross', color: '#8B5CB8' }, { label: 'Thomas', color: '#5C8B5E' },
  { label: 'Isabelle', color: '#B8955C' }
];
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const same = (a, b) => a.x === b.x && a.y === b.y;
const DIFFS = ['makkelijk', 'gemiddeld', 'moeilijk'];
const PER = 25;
const t0 = Date.now();

const kinds = new Set();
let generated = 0, unique = 0, minimal = 0, lshaped = 0, totalClues = 0;
for (const diff of DIFFS) {
  const cfg = FloorPlan.DIFF[diff];
  let okDiff = 0, cluesSum = 0;
  for (let s = 1; s <= PER; s++) {
    const p = FloorPlan.generate(s * 7919 + 13, diff, POOL);
    if (!p) { console.log(`  ${diff} seed ${s}: geen puzzel`); continue; }
    generated++;
    let good = true;

    const sols = FloorPlan.solve(p, 5);
    if (sols.length === 1) unique++; else { good = false; console.log(`  ${diff} seed ${s}: ${sols.length} oplossingen`); }
    if (!sols[0] || !sols[0].every((c, i) => same(c, p.solution[i]))) { good = false; console.log(`  ${diff} seed ${s}: solver vindt andere oplossing`); }

    // moordregel: precies één verdachte in de kamer van het slachtoffer, en dat is de moordenaar
    const inV = p.solution.map((c, i) => FloorPlan.roomOf(p.rooms, c.x, c.y).id === p.victim.roomId ? i : -1).filter(i => i !== -1);
    if (!(inV.length === 1 && inV[0] === p.murderer)) { good = false; console.log(`  ${diff} seed ${s}: moordregel schendt`); }
    if (p.solution.some(c => same(c, p.victim))) { good = false; console.log('  op slachtoffer'); }
    if (p.solution.some(c => p.furniture.has(FloorPlan.key(c.x, c.y)))) { good = false; console.log('  op meubel'); }
    if (new Set(p.solution.map(c => FloorPlan.key(c.x, c.y))).size !== p.solution.length) { good = false; console.log('  dubbele cel'); }

    // elke verdachte heeft een anker (begrensde kandidaten) en het aantal aanwijzingen valt binnen de band
    const cands = FloorPlan.candidates(p);
    if (cands.some(c => c.length > cfg.maxCand)) { good = false; console.log(`  ${diff} seed ${s}: kandidaten te ruim`); }
    if (p.clues.length < cfg.minClues || p.clues.length > cfg.maxClues) { good = false; console.log(`  ${diff} seed ${s}: ${p.clues.length} aanwijzingen`); }
    cluesSum += p.clues.length; totalClues += p.clues.length;

    // minimaal: elke aanwijzing weglaten geeft >1 oplossing of doorbreekt de kandidaatgrens
    const isMinimal = p.clues.every((_, idx) => {
      const trial = { ...p, clues: p.clues.filter((__, j) => j !== idx) };
      const cs = FloorPlan.candidates(trial);
      return cs.some(c => c.length > cfg.maxCand) || FloorPlan.solve(trial, 2).length !== 1;
    });
    if (isMinimal) minimal++;

    p.clueTexts.forEach(t => { if (!/^[A-Z].*\.$/.test(t)) { good = false; console.log('  rare zin:', t); } });
    p.clues.forEach(c => kinds.add(c.kind));
    if (p.rooms.some(rm => { const xs = rm.list.map(c => c.x), ys = rm.list.map(c => c.y);
      return rm.list.length !== (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1); })) lshaped++;

    // hint op leeg bord: wijst een verdachte aan en de echte plek zit tussen de kandidaten
    const h = FloorPlan.hint(p, new Array(p.suspects.length).fill(null));
    if (!(h.type !== 'mistake' && h.cells.some(c => same(c, p.solution[h.suspect])))) { good = false; console.log(`  ${diff} seed ${s}: hint fout`); }
    // hint bij een foute plaatsing: meldt de fout
    const wrong = new Array(p.suspects.length).fill(null);
    const freeWrong = p.rooms.flatMap(rm => rm.list).find(c => !p.furniture.has(FloorPlan.key(c.x, c.y)) && !same(c, p.victim) && !same(c, p.solution[0]) &&
      FloorPlan.roomOf(p.rooms, c.x, c.y).id !== FloorPlan.roomOf(p.rooms, p.solution[0].x, p.solution[0].y).id);
    if (freeWrong) { wrong[0] = freeWrong; const h2 = FloorPlan.hint(p, wrong); if (h2.type !== 'mistake' || h2.suspect !== 0) { good = false; console.log(`  ${diff} seed ${s}: fout niet gemeld`); } }

    if (good) okDiff++;
  }
  check(okDiff >= PER * 0.9, `${diff}: ${okDiff}/${PER} puzzels volledig in orde (gem. ${(cluesSum / Math.max(1, okDiff)).toFixed(1)} aanwijzingen)`);
}
check(generated >= DIFFS.length * PER * 0.9, `generatie slaagt: ${generated}/${DIFFS.length * PER}`);
check(unique === generated, `alle ${generated} puzzels hebben precies één oplossing`);
check(minimal >= generated * 0.95, `${minimal}/${generated} aanwijzingssets zijn minimaal`);
check(kinds.size >= 12, `variatie: ${kinds.size} aanwijzingssoorten (${[...kinds].join(', ')})`);
check(lshaped > 0, `${lshaped} puzzels bevatten een L-vormige kamer`);

// ── thema's: elke wereld genereert geldige, unieke puzzels met eigen inhoud ──
const { THEMES } = require('../themes.js');
for (const th of THEMES) {
  let okTheme = 0, total = 0, hetSeen = false, victimSeen = 0, furnOk = true, susOk = true;
  const furnIds = new Set(th.furniture.map(f => f.id));
  const names = new Set(th.suspects.map(x => x.label));
  for (const diff of DIFFS) for (let s = 1; s <= 8; s++) {
    total++;
    const p = FloorPlan.generate(s * 104729 + th.id.length, diff, th);
    if (!p) continue;
    const sols = FloorPlan.solve(p, 3);
    const uniq = sols.length === 1 && sols[0].every((c, i) => same(c, p.solution[i]));
    if (p.caseText.startsWith(th.victimName)) victimSeen++;
    if ([...p.furniture.values()].some(f => !furnIds.has(f))) furnOk = false;
    if (p.suspects.some(x => !names.has(x.label))) susOk = false;
    if (p.clueTexts.some(t => / het [A-Z]/.test(t)) || / het [A-Z]/.test(p.caseText)) hetSeen = true;
    if (uniq && p.clues.every(c => true)) okTheme++;
  }
  const hasHet = th.rooms.some(r => r.article === 'het');
  check(okTheme >= total * 0.9, `${th.title}: ${okTheme}/${total} puzzels uniek`);
  check(victimSeen === okTheme || victimSeen >= total * 0.9, `${th.title}: zaaktekst noemt ${th.victimName}`);
  check(furnOk && susOk, `${th.title}: alleen eigen meubels en verdachten`);
  check(!hasHet || hetSeen, `${th.title}: lidwoord 'het' wordt gebruikt (${hasHet ? 'ja' : 'n.v.t.'})`);
}
const pir = FloorPlan.generate(77, 'gemiddeld', THEMES[1]);
check(pir && pir.clueTexts.every(t => !/ kamer/.test(t)) && /ruimte/.test(pir.caseText), `piraten: geen 'kamer' maar 'ruimte' in de tekst`);

// oefenzaak-layout: precies één oplossing en de bedoelde
const { Board } = require('../board.js');
const tut = FloorPlan.fromLayout({ ...Board.TUTORIAL, suspects: THEMES[0].suspects.slice(0, 2), theme: THEMES[0] });
const tutSols = FloorPlan.solve(tut, 3);
check(tutSols.length === 1 && tutSols[0].every((c, i) => same(c, tut.solution[i])), 'oefenzaak heeft precies één oplossing: ' + tut.clueTexts.join(' '));
check(FloorPlan.hint(tut, [null, null]).cells.some(c => same(c, tut.solution[0])) || FloorPlan.hint(tut, [null, null]).cells.some(c => same(c, tut.solution[1])), 'hint werkt ook op de oefenzaak');

// verdachtenpool: verschillende zaken hebben verschillende bezettingen
const combos = new Set();
for (let sd = 1; sd <= 20; sd++) { const p = FloorPlan.generate(sd * 31, 'makkelijk', THEMES[0]); if (p) combos.add(p.suspects.map(x => x.label).sort().join('|')); }
check(combos.size >= 8, `verdachtenpool geeft variatie: ${combos.size} verschillende bezettingen in 20 zaken`);

// determinisme
const a = FloorPlan.generate(4242, 'gemiddeld', POOL), b = FloorPlan.generate(4242, 'gemiddeld', POOL);
check(JSON.stringify(a.solution) === JSON.stringify(b.solution) && JSON.stringify(a.clueTexts) === JSON.stringify(b.clueTexts), 'zelfde seed geeft dezelfde puzzel');

// onafhankelijke brute force met de evaluator (alle toewijzingen over alle vrije cellen)
function brute(p) {
  const free = p.rooms.flatMap(rm => rm.list).filter(c => !p.furniture.has(FloorPlan.key(c.x, c.y)) && !same(c, p.victim));
  const n = p.suspects.length, cur = new Array(n).fill(null), used = new Set(); let count = 0;
  (function rec(i) {
    if (count > 1) return;
    if (i === n) { if (FloorPlan.check(p, cur)) count++; return; }
    for (const c of free) { const k = FloorPlan.key(c.x, c.y); if (used.has(k)) continue; used.add(k); cur[i] = c; rec(i + 1); used.delete(k); cur[i] = null; if (count > 1) return; }
  })(0);
  return count;
}
let bruteOk = 0;
for (const seed of [11, 222, 3333, 44444]) { const p = FloorPlan.generate(seed, 'makkelijk', POOL); if (p && brute(p) === 1) bruteOk++; }
check(bruteOk === 4, 'brute force bevestigt uniciteit onafhankelijk van de solver');

// hoek/muur/midden-semantiek op een L-vorm
const L = { list: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1},{x:0,y:2}] }; L.cells = new Set(L.list.map(c => FloorPlan.key(c.x, c.y)));
check(FloorPlan.posOf(L, {x:0,y:0}) === 'hoek' && FloorPlan.posOf(L, {x:2,y:0}) === 'hoek' && FloorPlan.posOf(L, {x:1,y:0}) === 'muur', 'hoek/muur klopt op een L-vormige kamer');

console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
console.log(failures === 0 ? 'ALLE FLOORPLAN CHECKS PASSED' : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

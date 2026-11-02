// Proof for the four worlds of ontwerp-1.6a.js (Oceaanstomer, Ryokan, Koffiefazenda, Zeppelin) and their campaigns.
// 1. The sheet: 12 rooms with 12 distinct colours, furniture ids that are new everywhere (avatars.js, ontwerp.js and the
//    other 1.6 file), 8 suspects (4 f, 4 m, the usual colours, short names unique, each starting with a different letter
//    and not used in another world), 8 parts with a one-sentence intro, and a map accent that stands apart.
// 2. The 256 cases of campagne-1.6a.js, loaded exactly as Campaign.generateFor does (seed + k * 7919, up to 12 tries):
//    exactly one solution, the right world, difficulty, board size and number of suspects, a meester case solvable step
//    by step without guessing (FloorPlan.stepwise), every clue, the case text and the accuse/verdict lines rendered in
//    Dutch without gaps, seeds unique and outside campaign.js and the archive; the chapter format (keys, parts, titles from
//    the sheet, Van Dam at the end, difficulty order as tests/campaign.test.js wants) and the texts (no old names from
//    tests/names.test.js, one or two sentences per story, an item with an icon, no title or item twice in a world).
// 3. With ONTWERP=1 also the design proof from before the cases existed: per world 12 seeds x 4 levels + 24 extra meester.
//   node docs/werelden/bewijs-1.6a.js                 (sheet + 256 cases, about a minute)
//   ONTWERP=1 node docs/werelden/bewijs-1.6a.js       (plus the design proof, two minutes more)
//   ALLEEN_BLAD=1 node docs/werelden/bewijs-1.6a.js   (only the sheet checks)
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
global.window = {};
require('./ontwerp.js');
require('./ontwerp-1.6a.js');
try { require('./ontwerp-1.6b.js'); } catch (e) { /* the other 1.6 file is optional */ }
const { FloorPlan } = require(path.join(ROOT, 'floorplan.js'));
const { THEMES } = require(path.join(ROOT, 'themes.js'));
const { CAMPAIGN } = require(path.join(ROOT, 'campaign.js'));
const { Grammar } = require(path.join(ROOT, 'grammar.js'));
const { CAMPAGNE_16A } = require('./campagne-1.6a.js');
let OTHER_CASES = [];
try { OTHER_CASES = require('./campagne-1.6b.js').CAMPAGNE_16B || []; } catch (e) { /* the other 1.6 campaigns are optional */ }

const MINE = window.ONTWERP_16A;
const OTHER = window.ONTWERP_16B || [];
const LEVELS = ['makkelijk', 'gemiddeld', 'moeilijk', 'meester'];
const SUSPECT_COLORS = ['#B85C5C', '#5C8B5E', '#C2185B', '#B8955C', '#8B5CB8', '#5C7AB8', '#2C3E50', '#D9A441'];
let failures = 0;
const fail = (w, msg) => { failures++; console.log(`FAIL ${w}: ${msg}`); };

// ── colour distance (CIEDE2000), for room colours and map accents ──
const lab = hex => {
  const n = parseInt(hex.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const xyz = [c[0] * 0.4124 + c[1] * 0.3576 + c[2] * 0.1805, c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722, c[0] * 0.0193 + c[1] * 0.1192 + c[2] * 0.9505];
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const [fx, fy, fz] = [xyz[0] / 0.95047, xyz[1], xyz[2] / 1.08883].map(f);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};
function de2000(h1, h2) {
  const [L1, a1, b1] = lab(h1), [L2, a2, b2] = lab(h2), rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cm, 7) / (Math.pow(Cm, 7) + Math.pow(25, 7))));
  const a1p = a1 * (1 + G), a2p = a2 * (1 + G), C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h = (b, a) => { const v = Math.atan2(b, a) / rad; return v < 0 ? v + 360 : v; };
  const h1p = h(b1, a1p), h2p = h(b2, a2p);
  const dL = L2 - L1, dC = C2p - C1p;
  let dh = h2p - h1p; if (C1p * C2p === 0) dh = 0; else if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin(dh * rad / 2);
  const Lm = (L1 + L2) / 2, Cmp = (C1p + C2p) / 2;
  let hm = h1p + h2p; if (C1p * C2p !== 0) hm = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + (h1p + h2p < 360 ? 360 : -360)) / 2 : (h1p + h2p) / 2;
  const T = 1 - 0.17 * Math.cos((hm - 30) * rad) + 0.24 * Math.cos(2 * hm * rad) + 0.32 * Math.cos((3 * hm + 6) * rad) - 0.2 * Math.cos((4 * hm - 63) * rad);
  const SL = 1 + 0.015 * Math.pow(Lm - 50, 2) / Math.sqrt(20 + Math.pow(Lm - 50, 2)), SC = 1 + 0.045 * Cmp, SH = 1 + 0.015 * Cmp * T;
  const RT = -2 * Math.sqrt(Math.pow(Cmp, 7) / (Math.pow(Cmp, 7) + Math.pow(25, 7))) * Math.sin(60 * Math.exp(-Math.pow((hm - 275) / 25, 2)) * rad);
  return Math.sqrt(Math.pow(dL / SL, 2) + Math.pow(dC / SC, 2) + Math.pow(dH / SH, 2) + RT * (dC / SC) * (dH / SH));
}
const minPair = colors => {
  let best = { d: Infinity };
  for (let i = 0; i < colors.length; i++) for (let j = i + 1; j < colors.length; j++) {
    const d = de2000(colors[i].color, colors[j].color);
    if (d < best.d) best = { d, a: colors[i].name, b: colors[j].name };
  }
  return best;
};
const beige = hex => { const [, a, b] = lab(hex); const C = Math.hypot(a, b), hue = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360; return C < 26 && hue > 40 && hue < 100; };

// ── reference: what the released worlds do ──
const releasedBest = Math.max(...THEMES.filter(t => t.rooms.length === 12).map(t => minPair(t.rooms).d));
const knownFurniture = new Set([...THEMES.flatMap(t => t.furniture.map(f => f.id)), ...window.ONTWERP.flatMap(w => w.furniture.map(f => f.id)),
  ...OTHER.flatMap(w => w.furniture.map(f => f.id))]);
const otherNames = new Map();
[...THEMES, ...OTHER].forEach(t => t.suspects.forEach(s => otherNames.set(s.label.split(/\s+/).slice(-1)[0].toLowerCase(), `${t.id}: ${s.label}`)));
const otherAccents = [...THEMES, ...OTHER].map(t => ({ name: t.id, color: t.map.accent }));
const knownRooms = new Set(THEMES.flatMap(t => t.rooms.map(r => r.name)));
const seenIds = new Set();
console.log(`Kamerkleuren: de best gespreide uitgebrachte wereld haalt ΔE ${releasedBest.toFixed(1)} (CIEDE2000)\n`);

// ── the sheet ──
MINE.forEach((w, wi) => {
  if (w.nr !== 17 + wi || w.unlock !== 60 + wi * 4) fail(w.id, `nr ${w.nr} / unlock ${w.unlock}`);
  if (w.rooms.length !== 12) fail(w.id, `${w.rooms.length} kamers`);
  if (new Set(w.rooms.map(r => r.name)).size !== w.rooms.length) fail(w.id, 'dubbele kamernaam');
  if (new Set(w.rooms.map(r => r.color.toUpperCase())).size !== w.rooms.length) fail(w.id, 'dubbele kamerkleur');
  w.rooms.forEach(r => { if (!['de', 'het'].includes(r.article)) fail(w.id, `lidwoord ${r.name}`); });
  const mp = minPair(w.rooms), nBeige = w.rooms.filter(r => beige(r.color)).length;
  if (mp.d < 10) fail(w.id, `kamerkleuren te dicht bij elkaar: ${mp.a} en ${mp.b} (ΔE ${mp.d.toFixed(1)})`);
  if (nBeige > 2) fail(w.id, `${nBeige} beige kamers: ${w.rooms.filter(r => beige(r.color)).map(r => r.name).join(', ')}`);
  if (w.furniture.length < 5 || w.furniture.length > 6) fail(w.id, `${w.furniture.length} meubels`);
  w.furniture.forEach(f => {
    if (knownFurniture.has(f.id) || seenIds.has(f.id)) fail(w.id, `meubel-id ${f.id} bestaat al`);
    seenIds.add(f.id);
    if (!/^een /.test(f.nl)) fail(w.id, `meubel ${f.id}: "${f.nl}"`);
    if (!/^<g[\s>]/.test(f.icon) || /<text/i.test(f.icon) || (f.icon.match(/<g\b/g) || []).length !== (f.icon.match(/<\/g>/g) || []).length) fail(w.id, `icoon ${f.id}`);
  });
  if (w.suspects.length !== 8) fail(w.id, `${w.suspects.length} verdachten`);
  if (w.suspects.filter(s => s.gender === 'f').length !== 4) fail(w.id, 'niet 4 vrouwen en 4 mannen');
  if (w.suspects.map(s => s.color).join() !== SUSPECT_COLORS.join()) fail(w.id, 'verdachtenkleuren wijken af van de vaste acht');
  const shorts = w.suspects.map(s => { const p = s.label.split(/\s+/); while (p.length > 1 && w.titles.includes(p[0].toLowerCase())) p.shift(); return p.join(' '); });
  if (new Set(shorts).size !== 8) fail(w.id, `korte namen niet uniek: ${shorts.join(', ')}`);
  if (new Set(shorts.map(n => n[0])).size !== 8) fail(w.id, `korte namen beginnen niet elk met een andere letter: ${shorts.join(', ')}`);
  w.suspects.forEach((s, i) => {
    if (!s.who || !s.look || !/^an? /.test(s.look)) fail(w.id, `verdachte ${s.label} mist who/look`);
    const last = s.label.split(/\s+/).slice(-1)[0].toLowerCase();
    if (otherNames.has(last)) fail(w.id, `${s.label}: naam al in gebruik (${otherNames.get(last)})`);
    if (!w.titles.includes(s.label.split(/\s+/)[0].toLowerCase()) && shorts[i] === s.label && s.label.includes(' ')) fail(w.id, `${s.label}: titel ontbreekt in titles`);
  });
  if (!w.titles.includes(w.victimName.split(/\s+/)[0].toLowerCase())) fail(w.id, 'titel van het slachtoffer ontbreekt in titles');
  if (w.parts.length !== 8) fail(w.id, `${w.parts.length} delen`);
  w.parts.forEach(([t, s]) => { if (!t || !s || (s.match(/[.!?](\s|$)/g) || []).length !== 1) fail(w.id, `deel "${t}": intro is niet één zin`); });
  const acc = otherAccents.concat(MINE.filter(x => x !== w).map(x => ({ name: x.id, color: x.map.accent })))
    .map(o => ({ ...o, d: de2000(w.map.accent, o.color) })).sort((a, b) => a.d - b.d)[0];
  if (acc.d < 12) fail(w.id, `kaartkleur ${w.map.accent} lijkt op ${acc.name} ${acc.color} (ΔE ${acc.d.toFixed(1)})`);
  const reused = w.rooms.filter(r => knownRooms.has(r.name)).length;
  console.log(`${w.icon} ${w.title} (${w.id}): kamers ΔE ≥ ${mp.d.toFixed(1)} (${mp.a}/${mp.b}), ${nBeige} beige, ${reused}/12 kamernamen al vertaald, ` +
    `kaartkleur ΔE ${acc.d.toFixed(1)} tot ${acc.name}`);
});

// ── the engine ──
const t0 = Date.now();
let total = 0, ok = 0, extraTotal = 0, extraOk = 0;
const prove = (w, seed, level) => {
  const problems = [];
  let p = null;
  for (let k = 0; k < 12 && !p; k++) p = FloorPlan.generate(seed + k * 7919, level, w);
  if (!p) return { problems: ['geen puzzel'] };
  const sols = FloorPlan.solve(p, 3).length;
  if (sols !== 1) problems.push(`${sols} oplossingen`);
  if (p.difficulty !== level) problems.push(`moeilijkheid ${p.difficulty}`);
  if (p.suspects.length !== FloorPlan.DIFF[level].suspects) problems.push(`${p.suspects.length} verdachten`);
  if (level === 'meester' && !FloorPlan.stepwise(p).solved) problems.push('niet stap voor stap op te lossen');
  return { p, problems };
};
console.log('');
if (process.env.ONTWERP && !process.env.ALLEEN_BLAD) MINE.forEach((w, wi) => {
  const rooms = new Set(), furn = new Set(), sus = new Set();
  const per = {};
  LEVELS.forEach(level => {
    per[level] = 0;
    for (let i = 0; i < 12; i++) {
      total++;
      const seed = 600000 + wi * 10000 + LEVELS.indexOf(level) * 1000 + 101 + i * 97;
      const { p, problems } = prove(w, seed, level);
      if (problems.length) { fail(w.id, `${level} seed ${seed}: ${problems.join(', ')}`); continue; }
      ok++; per[level]++;
      p.rooms.forEach(r => rooms.add(r.name)); p.furniture.forEach(f => furn.add(f)); p.suspects.forEach(s => sus.add(s.label));
    }
  });
  let extra = 0;
  for (let i = 0; i < 24; i++) {
    extraTotal++;
    const seed = 600000 + wi * 10000 + 5000 + 101 + i * 97;
    const { problems } = prove(w, seed, 'meester');
    if (problems.length) fail(w.id, `extra meester seed ${seed}: ${problems.join(', ')}`); else { extra++; extraOk++; }
  }
  const n = Object.values(per).reduce((a, b) => a + b, 0);
  console.log(`${n === 48 ? 'ok  ' : 'FAIL'} ${w.id}: ${n}/48 (${LEVELS.map(l => `${l} ${per[l]}/12`).join(', ')}), extra meester ${extra}/24; ` +
    `op de borden: ${rooms.size}/12 kamers, ${furn.size}/${w.furniture.length} meubels, ${sus.size}/8 verdachten`);
});
if (process.env.ONTWERP && !process.env.ALLEEN_BLAD)
  console.log(`\nontwerp: ${ok}/${total} zaken bewezen, plus ${extraOk}/${extraTotal} extra meesterzaken (${((Date.now() - t0) / 1000).toFixed(1)}s)`);

// ── the campaigns ──
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const RANK = { makkelijk: 0, gemiddeld: 1, moeilijk: 2, meester: 3 };
const OLD = (() => {   // the old names that tests/names.test.js forbids in campaign.js
  const src = require('fs').readFileSync(path.join(ROOT, 'tests', 'names.test.js'), 'utf8');
  return eval(src.match(/const OLD = (\[[\s\S]*?\]);/)[1]);
})();
const hasWord = (text, n) => new RegExp('(?<![\\p{L}])' + n.replace('.', '\\.') + '(?![\\p{L}])', 'u').test(text);
const gap = t => typeof t !== 'string' || !t.trim() || /[{}]|undefined|null|NaN|\s{2}|^\s|\s$/.test(t);
const sentences = t => (t.match(/[.!?](?=\s|$)/g) || []).length;
const usedSeeds = new Set(CAMPAIGN.flatMap(ch => ch.cases.map(c => c.seed)));
const otherSeeds = new Set(OTHER_CASES.flatMap(ch => ch.cases.map(c => c.seed)));
const archiveSeed = seed => seed > 200000 && (seed - 200000) % 9973 === 0;
const seenSeed = new Set();
const t1 = Date.now();
let cTotal = 0, cOk = 0;
if (!process.env.ALLEEN_BLAD) {
  console.log('');
  MINE.forEach(w => {
    const chs = CAMPAGNE_16A.filter(ch => ch.theme === w.id);
    const count = { makkelijk: 0, gemiddeld: 0, moeilijk: 0, meester: 0 };
    const titles = new Set(), items = new Set();
    let okW = 0;
    if (chs.length !== 8) fail(w.id, `${chs.length} delen in de campagne`);
    chs.forEach((ch, p) => {
      const where = `${ch.key}`;
      if (ch.key !== (p === 0 ? w.id : `${w.id}-${p + 1}`) || ch.part !== p + 1) fail(where, `sleutel of deelnummer (${ch.key}, ${ch.part})`);
      if (ch.title !== `Deel ${ROMAN[p]} · ${w.parts[p][0]}`) fail(where, `titel "${ch.title}" is niet de titel van het ontwerpblad`);
      if (!ch.icon || gap(ch.intro) || gap(ch.outro) || gap(ch.briefing) || ch.briefing.length <= 40) fail(where, 'icoon, intro, outro of briefing ontbreekt of heeft een gat');
      if (p === 0 && ch.intro !== w.intro) fail(where, 'deel I begint niet met de intro van de wereld');
      if (p === 7 && (!ch.outro.startsWith('Van Dam ') || !ch.outro.endsWith(w.outro))) fail(where, 'het laatste deel eindigt niet met Van Dam en de outro van de wereld');
      if (ch.cases.length !== 8) fail(where, `${ch.cases.length} zaken`);
      const diffs = ch.cases.map(c => c.difficulty);
      // tests/campaign.test.js: oplopend, eindigt op moeilijk of meester, deel I-VI begint met makkelijk
      if (!(RANK[diffs[0]] <= RANK[diffs[7]] && RANK[diffs[7]] >= 2 && (ch.part > 6 || diffs[0] === 'makkelijk'))) fail(where, `moeilijkheid loopt niet op: ${diffs.join(' ')}`);
      for (const text of [ch.intro, ch.outro, ch.briefing, ...ch.cases.flatMap(c => [c.title, c.story, c.item])])
        for (const n of OLD) if (hasWord(text, n)) fail(where, `oude naam "${n}" in "${text}"`);
      ch.cases.forEach((c, i) => {
        cTotal++;
        const problems = [];
        if (gap(c.title) || gap(c.story) || !/^\S+ \S.*$/u.test(c.item || '') || gap(c.item)) problems.push('titel, verhaal of bewijsstuk heeft een gat');
        if (![1, 2].includes(sentences(c.story)) || !/[.!?]$/.test(c.story)) problems.push(`verhaal heeft ${sentences(c.story)} zinnen`);
        if (titles.has(c.title)) problems.push(`titel "${c.title}" staat al in deze wereld`);
        if (items.has(c.item)) problems.push(`bewijsstuk "${c.item}" staat al in deze wereld`);
        titles.add(c.title); items.add(c.item);
        if (!(c.difficulty in RANK)) problems.push(`moeilijkheid ${c.difficulty}`); else count[c.difficulty]++;
        if (!Number.isInteger(c.seed) || usedSeeds.has(c.seed) || otherSeeds.has(c.seed) || seenSeed.has(c.seed) || archiveSeed(c.seed)) problems.push(`seed ${c.seed} al in gebruik`);
        seenSeed.add(c.seed);
        // exactly as Campaign.generateFor: theme, then seed + k * 7919 for up to 12 tries
        let pz = null;
        for (let k = 0; k < 12 && !pz; k++) pz = FloorPlan.generate(c.seed + k * 7919, c.difficulty, w);
        if (!pz) problems.push('geen puzzel');
        else {
          const cfg = FloorPlan.DIFF[c.difficulty];
          const sols = FloorPlan.solve(pz, 3).length;
          if (sols !== 1) problems.push(`${sols} oplossingen`);
          if (pz.theme.id !== w.id || pz.difficulty !== c.difficulty) problems.push(`wereld ${pz.theme.id} / ${pz.difficulty}`);
          if (pz.cols !== cfg.cols || pz.rows !== cfg.rows || pz.suspects.length !== cfg.suspects) problems.push(`${pz.cols}x${pz.rows}, ${pz.suspects.length} verdachten`);
          if (c.difficulty === 'meester' && !FloorPlan.stepwise(pz).solved) problems.push('niet stap voor stap op te lossen');
          const texts = [Grammar.caseText(pz), Grammar.text('board/rule', pz), Grammar.text('board/verdict', pz, { s: pz.murderer, room: pz.victim.roomId }),
            ...pz.rooms.map(r => Grammar.text('board/accuse', pz, { room: r.id })),
            ...pz.clues.flatMap(cl => [Grammar.statement(cl, pz).text, Grammar.clue(cl, pz), Grammar.explain(cl, pz)])];
          const bad = texts.find(gap);
          if (bad !== undefined) problems.push(`tekst met een gat: "${bad}"`);
        }
        if (problems.length) fail(where, `${i + 1} "${c.title}" (seed ${c.seed}): ${problems.join(', ')}`);
        else { cOk++; okW++; }
      });
    });
    console.log(`${okW === 64 ? 'ok  ' : 'FAIL'} ${w.id}: ${okW}/64 zaken bewezen; ${count.makkelijk} makkelijk, ${count.gemiddeld} gemiddeld, ` +
      `${count.moeilijk} moeilijk, ${count.meester} meester`);
  });
  if (CAMPAGNE_16A.length !== 32) fail('campagne', `${CAMPAGNE_16A.length} delen, verwacht 32`);
  console.log(`\ncampagne: ${cOk}/${cTotal} zaken bewezen (${((Date.now() - t1) / 1000).toFixed(1)}s)`);
}
console.log(failures ? `${failures} problemen` : 'Alles in orde.');
process.exit(failures ? 1 : 0);

// Proves the four worlds of ontwerp-1.6b.js and their campaign (campagne-1.6b.js, 4 x 64 cases).
// Campaign: every case loads exactly as Campaign.generateFor loads it (seed + k*7919, k < 12) with the theme of its world,
// has exactly one solution, the right world, difficulty, board size and number of suspects, clue texts without gaps,
// and a meester case is solvable step by step (FloorPlan.stepwise). Seeds are unique across campaign.js, this file and
// campagne-1.6a.js (the other four worlds of 1.6, if it exists). Per part the rules of tests/campaign.test.js hold
// (difficulty rises, parts I-VI start makkelijk, briefing, intro, outro, item with an icon).
// Sheet: 12 rooms with twelve distinct colours (closest pair in CIEDE2000), enough rooms for meester, new furniture ids
// that clash with nothing in avatars.js, themes.js or ontwerp-1.6a.js, eight suspects with unique colours and board
// names, eight parts, and a map colour that stays apart from the other 23 worlds.
//   node docs/werelden/bewijs-1.6b.js
global.window = {};
require('./ontwerp-1.6b.js');
try { require('./ontwerp-1.6a.js'); } catch (e) { /* the other four worlds of 1.6, if their sheet exists */ }
const { CAMPAGNE_16B } = require('./campagne-1.6b.js');
let OTHER_CAMPAIGN = [];
try { OTHER_CAMPAIGN = Object.values(require('./campagne-1.6a.js')).find(Array.isArray) || []; } catch (e) { /* not there yet */ }
const { FloorPlan } = require('../../floorplan.js');
const { THEMES } = require('../../themes.js');
const { CAMPAIGN } = require('../../campaign.js');
const { Avatars } = require('../../avatars.js');

const WORLDS = window.ONTWERP_16B;
const OTHERS_16 = window.ONTWERP_16A || [];
const LEVELS = ['makkelijk', 'gemiddeld', 'moeilijk', 'meester'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const RANK = { makkelijk: 0, gemiddeld: 1, moeilijk: 2, meester: 3 };

// ── colour distance (CIEDE2000) ─────────────────────────────
function lab(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b * 0.0722, z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
function deltaE(c1, c2) {
  const [L1, a1, b1] = lab(c1), [L2, a2, b2] = lab(c2), rad = Math.PI / 180;
  const Cb = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2, G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2, C1 = Math.hypot(ap1, b1), C2 = Math.hypot(ap2, b2);
  let h1 = Math.atan2(b1, ap1) / rad; if (h1 < 0) h1 += 360;
  let h2 = Math.atan2(b2, ap2) / rad; if (h2 < 0) h2 += 360;
  let dh = h2 - h1; if (C1 * C2 === 0) dh = 0; else if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dL = L2 - L1, dC = C2 - C1, dH = 2 * Math.sqrt(C1 * C2) * Math.sin(dh * rad / 2);
  const Lb = (L1 + L2) / 2, Cpb = (C1 + C2) / 2;
  let hb = h1 + h2; if (C1 * C2 !== 0) { if (Math.abs(h1 - h2) > 180) hb += h1 + h2 < 360 ? 360 : -360; hb /= 2; }
  const T = 1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad);
  const dTh = 30 * Math.exp(-(((hb - 275) / 25) ** 2)), Rc = 2 * Math.sqrt(Cpb ** 7 / (Cpb ** 7 + 25 ** 7));
  const Sl = 1 + 0.015 * (Lb - 50) ** 2 / Math.sqrt(20 + (Lb - 50) ** 2), Sc = 1 + 0.045 * Cpb, Sh = 1 + 0.015 * Cpb * T, Rt = -Math.sin(2 * dTh * rad) * Rc;
  return Math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh));
}
const closest = (items, colorOf, nameOf) => {
  let best = { d: Infinity, pair: [] };
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const d = deltaE(colorOf(items[i]), colorOf(items[j]));
    if (d < best.d) best = { d, pair: [nameOf(items[i]), nameOf(items[j])] };
  }
  return best;
};

// ── what is already taken ───────────────────────────────────
const unknownIcon = Avatars.furniture('__geen_meubel__');
const takenFurniture = new Map();
THEMES.forEach(t => t.furniture.forEach(f => takenFurniture.set(f.id, t.id)));
OTHERS_16.forEach(w => w.furniture.forEach(f => takenFurniture.set(f.id, w.id)));
const knownRooms = new Set(THEMES.flatMap(t => t.rooms.map(r => r.name)));
const otherMaps = [...THEMES, ...OTHERS_16].map(t => ({ id: t.id, accent: t.map.accent }));
// board name: the label without its title ("Glaciologe Marina" → "Marina"), as Themes.shortName does once the titles are known
const boardName = label => { const p = label.split(/\s+/); return p.length > 1 ? p.slice(1).join(' ') : p[0]; };

let failures = 0, totalCases = 0, okCases = 0;
const usedSeeds = new Set([...CAMPAIGN, ...OTHER_CAMPAIGN].flatMap(ch => ch.cases.map(c => c.seed)));
const fail = (w, msg) => { failures++; console.log(`  FAIL ${w}: ${msg}`); };
const t0 = Date.now();
const ownFurniture = new Set();

WORLDS.forEach((w, wi) => {
  console.log(`\n${w.icon}  ${w.title} (${w.id}, wereld ${w.nr}, opent na ${w.unlock} zaken)`);
  // sheet checks
  if (w.nr !== 21 + wi) fail(w.id, `nr ${w.nr}`);
  if (w.unlock !== 76 + 4 * wi) fail(w.id, `unlock ${w.unlock}`);
  for (const k of ['id', 'icon', 'title', 'short', 'era', 'tagline', 'intro', 'victimName', 'roomWord', 'roomWordPlural', 'floor', 'outro'])
    if (!w[k] || typeof w[k] !== 'string') fail(w.id, `${k} ontbreekt`);
  if (!w.floorCss || !w.floorCss.light || !w.floorCss.dark || !w.floorNote) fail(w.id, 'vloer zonder css of uitleg');
  if (w.rooms.length !== 12) fail(w.id, `${w.rooms.length} kamers`);
  if (new Set(w.rooms.map(r => r.name)).size !== w.rooms.length) fail(w.id, 'dubbele kamernaam');
  if (w.rooms.some(r => r.article !== 'de' && r.article !== 'het')) fail(w.id, 'lidwoord');
  const meesterRooms = FloorPlan.DIFF.meester.rooms + FloorPlan.DIFF.meester.merges;
  if (w.rooms.length < meesterRooms) fail(w.id, `meester vraagt ${meesterRooms} kamers`);
  const rc = closest(w.rooms, r => r.color, r => r.name);
  if (rc.d < 9) fail(w.id, `kamerkleuren te dicht bij elkaar: ${rc.pair.join(' / ')} ${rc.d.toFixed(1)}`);
  const newRooms = w.rooms.filter(r => !knownRooms.has(r.name)).map(r => r.name);
  console.log(`  kamers: 12, ${12 - newRooms.length} al vertaald, nieuw: ${newRooms.join(', ')}; dichtstbijzijnde kleuren ${rc.pair.join(' / ')} ΔE ${rc.d.toFixed(1)}`);
  if (w.furniture.length < 5 || w.furniture.length > 6) fail(w.id, `${w.furniture.length} meubels`);
  w.furniture.forEach(f => {
    if (takenFurniture.has(f.id)) fail(w.id, `meubel ${f.id} bestaat al in ${takenFurniture.get(f.id)}`);
    if (ownFurniture.has(f.id)) fail(w.id, `meubel ${f.id} dubbel in 1.6b`);
    ownFurniture.add(f.id);
    if (Avatars.furniture(f.id) !== unknownIcon) fail(w.id, `meubel ${f.id} heeft al een icoon in avatars.js`);
    if (!/^een /.test(f.nl)) fail(w.id, `meubel ${f.id}: "${f.nl}"`);
    if (!/^<g>.*<\/g>$/.test(f.icon) || /undefined|NaN/.test(f.icon)) fail(w.id, `icoon ${f.id}`);
  });
  console.log(`  meubels: ${w.furniture.map(f => f.nl.replace(/^een /, '')).join(', ')}`);
  if (w.suspects.length !== 8) fail(w.id, `${w.suspects.length} verdachten`);
  if (new Set(w.suspects.map(s => s.color)).size !== 8) fail(w.id, 'dubbele verdachtenkleur');
  const names = w.suspects.map(s => boardName(s.label));
  if (new Set(names).size !== 8) fail(w.id, 'dubbele korte naam');
  names.forEach(n => { if (n.length > 8) fail(w.id, `korte naam "${n}" te lang voor het bord`); });
  const f = w.suspects.filter(s => s.gender === 'f').length;
  if (f !== 4) fail(w.id, `${f} vrouwen, ${8 - f} mannen`);
  w.suspects.forEach(s => { if (!s.who || !s.look || !['m', 'f'].includes(s.gender)) fail(w.id, `verdachte ${s.label} onvolledig`); });
  console.log(`  verdachten: ${w.suspects.map(s => s.label).join(', ')} (bord: ${names.join(', ')})`);
  if (w.parts.length !== 8 || w.parts.some(p => p.length !== 2 || !p[0] || !p[1])) fail(w.id, 'acht delen met titel en intro');
  const mc = otherMaps.map(o => ({ id: o.id, d: deltaE(w.map.accent, o.accent) })).sort((a, b) => a.d - b.d)[0];
  if (mc.d < 8) fail(w.id, `kaartkleur ${w.map.accent} te dicht bij ${mc.id} (ΔE ${mc.d.toFixed(1)})`);
  console.log(`  kaartkleur ${w.map.accent}: dichtstbijzijnde wereld ${mc.id}, ΔE ${mc.d.toFixed(1)}`);

  // campaign: the eight parts of this world, every case as the app loads it
  const chapters = CAMPAGNE_16B.filter(ch => ch.theme === w.id);
  if (chapters.length !== 8) fail(w.id, `${chapters.length} delen in campagne-1.6b.js`);
  const count = { makkelijk: 0, gemiddeld: 0, moeilijk: 0, meester: 0 };
  const line = [];
  chapters.forEach((ch, pi) => {
    const k = pi === 0 ? w.id : `${w.id}-${pi + 1}`;
    if (ch.key !== k || ch.part !== pi + 1) fail(w.id, `deel ${pi + 1}: sleutel ${ch.key}, part ${ch.part}`);
    if (ch.title !== `Deel ${ROMAN[pi]} · ${w.parts[pi][0]}`) fail(ch.key, `titel "${ch.title}"`);
    if (!ch.icon || !ch.intro || !ch.outro || !(ch.briefing && ch.briefing.length > 40)) fail(ch.key, 'icoon, intro, outro of briefing ontbreekt');
    if (ch.cases.length !== 8) fail(ch.key, `${ch.cases.length} zaken`);
    const diffs = ch.cases.map(c => c.difficulty);
    const first = RANK[diffs[0]], last = RANK[diffs[diffs.length - 1]];
    if (!(first <= last && last >= 2 && (ch.part > 6 || diffs[0] === 'makkelijk'))) fail(ch.key, `moeilijkheid loopt niet op: ${diffs.join(' ')}`);
    let ok = 0, ms = 0;
    ch.cases.forEach((c, i) => {
      totalCases++;
      count[c.difficulty]++;
      const problems = [];
      if (!c.title || !c.story || !/^\S+ .+/.test(c.item || '') || !LEVELS.includes(c.difficulty)) problems.push('titel, verhaal, bewijsstuk of moeilijkheid');
      if (usedSeeds.has(c.seed)) problems.push(`seed ${c.seed} al in gebruik`);
      usedSeeds.add(c.seed);
      const t = Date.now();
      let p = null;
      for (let k2 = 0; k2 < 12 && !p; k2++) p = FloorPlan.generate(c.seed + k2 * 7919, c.difficulty, w);
      if (!p) problems.push('geen puzzel');
      else {
        const cfg = FloorPlan.DIFF[c.difficulty];
        const sols = FloorPlan.solve(p, 3).length;
        if (sols !== 1) problems.push(`${sols} oplossingen`);
        if (p.theme.id !== ch.theme) problems.push(`wereld ${p.theme.id}`);
        if (p.difficulty !== c.difficulty) problems.push(`moeilijkheid ${p.difficulty}`);
        if (p.cols !== cfg.cols || p.rows !== cfg.rows) problems.push(`bord ${p.cols}x${p.rows}`);
        if (p.suspects.length !== cfg.suspects) problems.push(`${p.suspects.length} verdachten`);
        if (c.difficulty === 'meester' && !FloorPlan.stepwise(p).solved) problems.push('niet stap voor stap op te lossen');
        const texts = [...p.clueTexts, p.caseText].join(' ');
        if (/undefined|NaN|\{|\}/.test(texts)) problems.push(`tekst met een gat: ${texts.slice(0, 120)}`);
      }
      ms += Date.now() - t;
      if (problems.length) fail(ch.key, `zaak ${i + 1} "${c.title}" (seed ${c.seed}): ${problems.join(', ')}`); else ok++;
    });
    okCases += ok;
    line.push(`${ROMAN[pi]} ${ok}/8`);
  });
  const last = chapters[7];
  if (last && !last.outro.endsWith(w.outro)) fail(w.id, 'het slot van deel VIII eindigt niet met de outro van de wereld');
  console.log(`  campagne: ${line.join(', ')}`);
  console.log(`  moeilijkheid: ${LEVELS.map(l => `${count[l]} ${l}`).join(', ')}`);
});

console.log(`\n${okCases}/${totalCases} campagnezaken bewezen over ${WORLDS.length} werelden (${((Date.now() - t0) / 1000).toFixed(1)} s); ${failures} fout(en)`);
process.exit(failures === 0 && okCases === totalCases ? 0 : 1);

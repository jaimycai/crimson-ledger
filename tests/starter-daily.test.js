// Startersversie van de dagzaak (1.7): in de eerste week dezelfde seed en wereld als de gewone dagzaak, op Makkelijk.
// Voor elke datum in de komende 400 dagen moet die zaak er zijn (binnen de 12 pogingen van Board.start), precies één
// oplossing hebben, de moordregel volgen en binnen de grenzen van Makkelijk blijven. Daarna, en bij een eerste start die
// zeven dagen of langer geleden is, blijft het de gewone dagzaak op Gemiddeld.
//   node tests/starter-daily.test.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const DIR = path.join(__dirname, '..');
const { FloorPlan } = require('../floorplan.js');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };

// app.js met de bestanden waar dailyCase op leunt, in één lege omgeving (geen DOM); de opslag is een gewoon object
const store = {};
const ctx = { console, setTimeout, clearTimeout, Intl, document: { addEventListener() {}, getElementById: () => null, querySelectorAll: () => [] } };
ctx.globalThis = ctx; ctx.window = ctx;
ctx.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
vm.createContext(ctx);
for (const f of ['themes.js', 'progress.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(DIR, f), 'utf8'), ctx, { filename: f });
vm.runInContext('globalThis.__ = { App, Themes, Progress };', ctx);
const { App, Themes, Progress } = ctx.__;

const seedOf = d => (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) * 3 + 777;
const DAYS = 400, cfg = FloorPlan.DIFF.makkelijk, t0 = Date.now();
const now = new Date();
let made = 0, unique = 0, retries = 0, inBand = 0, labels = 0, normal = 0;
const bad = [];
for (let k = 0; k < DAYS; k++) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + k, 12);
  // een speler die die dag (of tot zes dagen ervoor) voor het eerst opende: startersversie
  store['crimson-first-day'] = Progress.dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (k % 7), 12));
  const c = App.dailyCase(d);
  if (c.starter && c.difficulty === 'makkelijk' && c.seed === seedOf(d) && c.theme === Themes.forDay(App.getDayNumber(d)).id && c.title === Progress.dailyTitle(c.dayNo)) labels++;
  // en zeven dagen na de eerste start: de gewone dagzaak, zelfde seed
  store['crimson-first-day'] = Progress.dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7, 12));
  const g = App.dailyCase(d);
  if (!g.starter && g.difficulty === 'gemiddeld' && g.seed === c.seed && g.theme === c.theme) normal++;
  // precies zoals Board.start: tot 12 pogingen, telkens 7919 verder
  let p = null, i = 0;
  for (; i < 12 && !p; i++) p = FloorPlan.generate(c.seed + i * 7919, 'makkelijk', Themes.get(c.theme));
  if (!p) { bad.push(`${Progress.dayKey(d)}: geen zaak`); continue; }
  made++; if (i > 1) retries++;
  const sols = FloorPlan.solve(p, 3);
  const same = sols.length === 1 && sols[0].every((s, j) => s.x === p.solution[j].x && s.y === p.solution[j].y);
  const inVictimRoom = p.solution.map((s, j) => FloorPlan.roomOf(p.rooms, s.x, s.y).id === p.victim.roomId ? j : -1).filter(j => j !== -1);
  if (same && inVictimRoom.length === 1 && inVictimRoom[0] === p.murderer) unique++;
  else bad.push(`${Progress.dayKey(d)}: ${sols.length} oplossing(en), moordregel ${inVictimRoom.join(',')}/${p.murderer}`);
  const cands = FloorPlan.candidates(p);
  if (p.cols === cfg.cols && p.rows === cfg.rows && p.suspects.length === cfg.suspects && p.clues.length >= cfg.minClues && p.clues.length <= cfg.maxClues && cands.every(x => x.length <= cfg.maxCand)) inBand++;
  else bad.push(`${Progress.dayKey(d)}: buiten de grenzen van Makkelijk`);
}
check(labels === DAYS, `dailyCase in de eerste week: Makkelijk, met dezelfde seed, wereld en titel als de gewone dagzaak (${labels}/${DAYS})`);
check(normal === DAYS, `zeven dagen na de eerste start: weer Gemiddeld, zelfde seed en wereld (${normal}/${DAYS})`);
check(made === DAYS, `elke dag van de komende ${DAYS} een startersversie (${made}/${DAYS}, ${retries} met een extra poging)`);
check(unique === DAYS, `elke startersversie heeft precies één oplossing en volgt de moordregel (${unique}/${DAYS})`);
check(inBand === DAYS, `elke startersversie blijft binnen Makkelijk: ${cfg.cols}×${cfg.rows}, ${cfg.suspects} verdachten, ${cfg.minClues}-${cfg.maxClues} verklaringen (${inBand}/${DAYS})`);
if (bad.length) console.log('  ' + bad.slice(0, 10).join('\n  '));

// de grens: dag 0 t/m 6 na de eerste start, en niet vóór de eerste start
{
  const at = (first, day) => { store['crimson-first-day'] = first; return App.dailyCase(Progress.dateOf(day)); };
  check(at('2026-11-15', '2026-11-15').starter && at('2026-11-15', '2026-11-21').starter && !at('2026-11-15', '2026-11-22').starter, 'eerste start 15 nov: t/m 21 nov de startersversie, vanaf 22 nov Gemiddeld');
  check(!at('2026-11-15', '2026-11-14').starter, 'een dag vóór de eerste start (gemiste dagzaak bestaat dan niet): Gemiddeld');
  check(at('2027-03-25', '2027-03-31').starter && !at('2027-03-25', '2027-04-01').starter, 'over de zomertijd heen telt de grens nog in hele dagen');
  check(!at('kapot', '2026-11-15').starter, 'onleesbare eerste dag: gewoon Gemiddeld');
  delete store['crimson-first-day'];
  check(App.dailyCase(new Date()).starter, 'nog geen eerste dag (allereerste start, vóór Meting.open): vandaag is dag 0');
}
console.log(`(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
console.log(failures ? `${failures} FAILURES` : 'ALLE STARTERSVERSIE CHECKS PASSED');
process.exit(failures ? 1 : 0);

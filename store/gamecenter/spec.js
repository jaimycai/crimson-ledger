// What Game Center in App Store Connect should hold for Crimson Ledger (Jaimy, 15 November 2026): 36 achievements and
// two leaderboards, with a name and descriptions in all 23 store languages and an image per achievement.
// The ids and the rules come from gamecenter.js (the app); the names and "before" descriptions of the 29 achievements
// that mirror a medal come from the medals (progress.js and i18n/<lang>.js); everything else from texts.js.
//   node store/gamecenter/spec.js        prints the table and the problems (lengths, missing texts, murder words)
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');
const { GameCenter } = require(path.join(ROOT, 'gamecenter.js'));
const TEXTS = require('./texts.js');

// store locale → app language (the same list as store/metadata/check-1.6.js); pt-PT has its own texts
const LOCALES = { 'nl-NL': 'nl', 'en-US': 'en', 'en-GB': 'en', 'de-DE': 'de', 'fr-FR': 'fr', 'es-ES': 'es', 'es-MX': 'es',
  'pt-BR': 'pt', 'pt-PT': 'pt-PT', it: 'it', ja: 'ja', ko: 'ko', 'zh-Hans': 'zh', ru: 'ru', tr: 'tr', id: 'id', vi: 'vi',
  'ar-SA': 'ar', 'ur-PK': 'ur', hi: 'hi', 'mr-IN': 'mr', 'bn-BD': 'bn', 'te-IN': 'te' };
// Apple: at most 100 points per achievement and 1000 in all. 930 here, so a few later achievements still fit.
const POINTS = { first_case: 10, first_three_stars: 10, first_part: 15, streak_3: 10, streak_7: 20, streak_30: 50,
  solved_10: 10, solved_50: 25, solved_100: 40, solved_500: 80, first_master: 30, case_of_week: 30, world: 25 };
// Old Apple limits that still hold in practice: a name of 2 to 30 characters, descriptions up to 200 bytes (UTF-8).
const LIMIT = { name: 30, desc: 200 };

const packCache = {};
function pack(lang) {
  if (lang === 'nl') return null;
  if (!packCache[lang]) {
    const ctx = {}; vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'i18n', lang + '.js'), 'utf8'), ctx);
    packCache[lang] = ctx.LANG_PACKS[lang];
  }
  return packCache[lang];
}
const NL_MEDALS = () => require(path.join(ROOT, 'progress.js')).Progress.MEDALS;
const NL_THEMES = () => require(path.join(ROOT, 'themes.js')).THEMES;

// European Portuguese from the Brazilian medal texts: the imperative and two pronoun places
const toPT = s => s.replace(/^Resolva seu /, 'Resolve o teu ').replace(/^Resolva /, 'Resolve ').replace(/^Termine /, 'Termina ')
  .replace(/^Jogue /, 'Joga ').replace(/^Mantenha /, 'Mantém ').replace(/^Ganhe /, 'Ganha ').replace(/ se cala$/, ' cala-se').replace(/ se apaga$/, ' apaga-se');

function medalText(lang, medalId) {
  const base = lang === 'pt-PT' ? 'pt' : lang;
  let t;
  if (base === 'nl') { const m = NL_MEDALS().find(x => x.id === medalId); t = [m.title, m.hint]; }
  else t = pack(base).data.medals[medalId];
  return lang === 'pt-PT' ? t.map(toPT) : t;
}
function worldName(lang, id) {
  const base = lang === 'pt-PT' ? 'pt' : lang;
  return base === 'nl' ? NL_THEMES().find(t => t.id === id).title : pack(base).data.themes[id].title;
}

function achievementText(lang, a) {
  const T = TEXTS[lang];
  if (!T) return null;
  if (a.medal) {
    const [title, before] = medalText(lang, a.medal);
    const name = (T.names && T.names[a.key]) || title;
    const after = a.key.startsWith('world.') ? T.after.world.replace('{w}', worldName(lang, a.key.slice(6))) : T.after[a.key];
    return { name, beforeEarnedDescription: before, afterEarnedDescription: after };
  }
  const n = T.new[a.key];
  return n ? { name: n[0], beforeEarnedDescription: n[1], afterEarnedDescription: n[2] } : null;
}

function spec() {
  const achievements = GameCenter.list().map(a => {
    const loc = {};
    for (const [locale, lang] of Object.entries(LOCALES)) loc[locale] = achievementText(lang, a);
    const nl = loc['nl-NL'] || {};
    return { id: a.id, key: a.key, referenceName: `${nl.name || a.key} (${a.key})`.slice(0, 64), points: POINTS[a.key.startsWith('world.') ? 'world' : a.key],
      showBeforeEarned: true, repeatable: false, image: path.join(__dirname, 'images', `${a.key}.png`), loc };
  });
  const board = (key, extra) => {
    const loc = {};
    for (const [locale, lang] of Object.entries(LOCALES)) {
      const b = TEXTS[lang] && TEXTS[lang].boards[key];
      loc[locale] = b ? Object.assign({ name: b[0], description: b[1] }, b[2] ? { formatterSuffixSingular: ' ' + b[2], formatterSuffix: ' ' + b[3] } : {}) : null;
    }
    return Object.assign({ id: GameCenter.BOARDS[key], key, loc }, extra);
  };
  const leaderboards = [
    board('points', { referenceName: 'Totaal aantal punten (points)', defaultFormatter: 'INTEGER', submissionType: 'BEST_SCORE', scoreSortType: 'DESC',
      scoreRangeStart: 0, scoreRangeEnd: 100000000 }),
    // a recurring leaderboard: a new one every day at 00:00 UTC; the time is in seconds, lower is better
    board('daily_time', { referenceName: 'Snelste dagelijkse zaak (daily_time)', defaultFormatter: 'ELAPSED_TIME_SECOND', submissionType: 'BEST_SCORE', scoreSortType: 'ASC',
      scoreRangeStart: 1, scoreRangeEnd: 86400, recurrenceStartDate: '2026-11-17T00:00:00.000Z', recurrenceDuration: 'PT24H', recurrenceRule: 'FREQ=DAILY;INTERVAL=1' })
  ];
  return { locales: Object.keys(LOCALES), achievements, leaderboards };
}

// the murder-word list of the 1.6 store texts, taken from check-1.6.js so there is one list
function murderWords() {
  const src = fs.readFileSync(path.join(ROOT, 'store', 'metadata', 'check-1.6.js'), 'utf8');
  const a = src.indexOf("const L = '(?<!"), b = src.indexOf('// Apple koppelt losse');
  if (a < 0 || b < a) throw new Error('check-1.6.js: woordenlijst niet gevonden');
  return vm.runInNewContext(src.slice(a, b) + '\nmurderWords;', {});
}

function check(s = spec()) {
  const bad = [], words = murderWords(), bytes = t => Buffer.byteLength(t || '', 'utf8'), chars = t => [...(t || '')].length;
  const total = s.achievements.reduce((n, a) => n + a.points, 0);
  if (total > 1000) bad.push(`punten samen ${total} (max 1000)`);
  for (const a of s.achievements) {
    if (!(a.points >= 1 && a.points <= 100)) bad.push(`${a.key}: ${a.points} punten`);
    if (!fs.existsSync(a.image)) bad.push(`${a.key}: plaatje ontbreekt (${path.relative(ROOT, a.image)})`);
    const names = new Set();
    for (const locale of s.locales) {
      const t = a.loc[locale];
      if (!t || !t.name || !t.beforeEarnedDescription || !t.afterEarnedDescription) { bad.push(`${a.key} ${locale}: tekst ontbreekt`); continue; }
      if (chars(t.name) < 2 || chars(t.name) > LIMIT.name) bad.push(`${a.key} ${locale}: naam ${chars(t.name)} tekens (${t.name})`);
      for (const k of ['beforeEarnedDescription', 'afterEarnedDescription']) if (bytes(t[k]) > LIMIT.desc) bad.push(`${a.key} ${locale}: ${k} ${bytes(t[k])} bytes`);
      if (/\{w\}/.test(t.afterEarnedDescription)) bad.push(`${a.key} ${locale}: {w} niet ingevuld`);
      for (const v of Object.values(t)) { const w = words(v); if (w.length) bad.push(`${a.key} ${locale}: moordwoord ${w.join(', ')} in "${v}"`); }
      names.add(t.name);
    }
  }
  for (const locale of s.locales) {
    const names = s.achievements.map(a => a.loc[locale] && a.loc[locale].name);
    const dup = names.filter((n, i) => n && names.indexOf(n) !== i);
    if (dup.length) bad.push(`${locale}: dubbele namen ${[...new Set(dup)].join(', ')}`);
  }
  for (const l of s.leaderboards) for (const locale of s.locales) {
    const t = l.loc[locale];
    if (!t || !t.name || !t.description) { bad.push(`${l.key} ${locale}: tekst ontbreekt`); continue; }
    if (chars(t.name) > LIMIT.name) bad.push(`${l.key} ${locale}: naam ${chars(t.name)} tekens`);
    if (bytes(t.description) > LIMIT.desc) bad.push(`${l.key} ${locale}: beschrijving ${bytes(t.description)} bytes`);
    for (const v of Object.values(t)) { const w = words(v); if (w.length) bad.push(`${l.key} ${locale}: moordwoord ${w.join(', ')}`); }
  }
  return bad;
}

module.exports = { spec, check, LOCALES, POINTS };

if (require.main === module) {
  const s = spec();
  for (const a of s.achievements) console.log(`${a.id.padEnd(30)} ${String(a.points).padStart(3)}  ${a.loc['nl-NL'].name} | ${a.loc['en-US'].name} | ${a.loc['ja'].name}`);
  for (const l of s.leaderboards) console.log(`${l.id.padEnd(30)} ${l.defaultFormatter} ${l.scoreSortType}  ${l.loc['nl-NL'].name} | ${l.loc['en-US'].name}`);
  const bad = check(s);
  console.log(bad.length ? bad.map(b => 'FOUT  ' + b).join('\n') : `\nalles in orde: ${s.achievements.length} prestaties, ${s.leaderboards.length} ranglijsten, ${s.locales.length} talen, ${s.achievements.reduce((n, a) => n + a.points, 0)} punten`);
  process.exitCode = bad.length ? 1 : 0;
}

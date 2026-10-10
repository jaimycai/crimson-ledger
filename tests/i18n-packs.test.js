// Checks every language file in i18n/ against the English one and against the sentence engine:
// - ui: every gap of the Dutch key is used, no unknown gaps, valid choices ({0|one:…|other:…}, {0|m:…|f:…}),
//   the same HTML tags, nothing empty
// - data and campaign: the same shape as English (every world, room, case …), nothing empty
// - grammar: every template of grammar.js, only known slots, every word form a template asks for exists
//   for every room, piece of furniture and world
// - output: generates cases in every world and checks that every statement, clue, explanation and hint
//   is filled in completely (no "{", no "undefined").
//   node tests/i18n-packs.test.js [lang …]
const fs = require('fs'), path = require('path'), vm = require('vm');
const DIR = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(DIR, f), 'utf8');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const fail = (list, m, max = 8) => { check(list.length === 0, `${m}${list.length ? ` (${list.length}): ` + list.slice(0, max).join(' | ') : ''}`); };

const { GRAMMAR_NL } = require('../grammar.js');
const PLURAL = new Set(['zero', 'one', 'two', 'few', 'many', 'other']), GENDER = new Set(['m', 'f', 'n']);
const langs = process.argv.slice(2).length ? process.argv.slice(2)
  : fs.readdirSync(path.join(DIR, 'i18n')).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)).sort();

// a fresh browser-like world per language, without a DOM
function world(lang) {
  const ctx = { console, Intl, localStorage: { getItem: () => lang, setItem() {} }, navigator: { language: lang, languages: [lang] } };
  vm.createContext(ctx);
  for (const f of ['themes.js', 'campaign.js', 'mentor.js', `i18n/${lang}.js`, 'i18n.js', 'grammar.js', 'floorplan.js']) vm.runInContext(read(f), ctx, { filename: f });
  // a new language registers itself from its meta until it is added to I18n.LANGS
  vm.runInContext(`{ const m = (LANG_PACKS['${lang}'] || {}).meta; if (m && !I18n.supported('${lang}')) { I18n.LANGS.push(['${lang}', m.name, m.dir, m.locale]); globalThis.__new = true; } }`, ctx);
  vm.runInContext('globalThis.__ = { I18n, Grammar, FloorPlan, Themes, THEMES, Mentor, GRAMMAR_NL, isNew: !!globalThis.__new };', ctx);
  return ctx.__;
}
const en = world('en');
const EN = en.I18n.packs().en;

// gaps in a ui text: plain {0} and choices {0|…}
function gaps(s) {
  const plain = new Set(), chosen = new Set(), bad = [];
  for (const m of s.matchAll(/\{(\d+)((?:\|[a-z]+:[^|{}]*)+)?\}/g)) {
    (m[2] ? chosen : plain).add(+m[1]);
    if (m[2]) {
      const keys = m[2].slice(1).split('|').map(p => p.slice(0, p.indexOf(':')));
      const plural = keys.every(k => PLURAL.has(k)), gender = keys.every(k => GENDER.has(k));
      if (!(plural && keys.includes('other')) && !(gender && keys.includes('m') && keys.includes('f'))) bad.push(m[0]);
    }
  }
  return { plain, chosen, bad };
}
const tags = s => (s.match(/<\/?[a-z]+/g) || []).sort().join(',');
// the shape of a value: same keys and array lengths, strings everywhere
function shape(a, b, at, out) {
  if (typeof a === 'string') { if (typeof b !== 'string' || !b.trim()) out.push(at); return; }
  if (Array.isArray(a)) { if (!Array.isArray(b) || b.length !== a.length) { out.push(at + ' (lengte)'); return; } a.forEach((x, i) => shape(x, b[i], `${at}[${i}]`, out)); return; }
  if (a && typeof a === 'object') { if (!b || typeof b !== 'object') { out.push(at); return; } for (const k of Object.keys(a)) shape(a[k], b[k], `${at}.${k}`, out); }
}
// slot names in a grammar template
const slots = s => [...s.matchAll(/\{([a-zA-Z0-9_.]+)(?:\|[^{}]*)?\}/g)].map(m => m[1]);
const KNOWN = new Set(['s', 'b', 'room', 'furn', 'rw', 'rws', 'pos', 'victim', 'n', 'k', 'quote']);
function templatePaths(o, at = '', out = []) {
  for (const [k, v] of Object.entries(o)) typeof v === 'string' ? out.push(at + k) : templatePaths(v, at + k + '/', out);
  return out;
}
const getPath = (o, p) => p.split('/').reduce((x, k) => (x ? x[k] : undefined), o);

for (const lang of langs) {
  console.log(`\n── ${lang} ──`);
  const W = lang === 'en' ? en : world(lang);
  const P = W.I18n.packs()[lang];
  check(!!P && !!P.ui && !!P.data && !!P.campaign && !!P.grammar, 'taalbestand heeft ui, data, campaign en grammar');
  if (!P) continue;
  const m = P.meta || {};
  check(!!m.name && (m.dir === 'ltr' || m.dir === 'rtl') && !!m.locale && (() => { try { return Intl.PluralRules.supportedLocalesOf([m.locale]).length === 1; } catch (e) { return false; } })(), 'meta: naam in de eigen taal, schrijfrichting en een geldige landinstelling');
  if (W.isNew) console.log('NOTE nog niet in I18n.LANGS; komt erbij bij het inbouwen');
  else { const info = W.I18n.LANGS.find(l => l[0] === lang); check(info[1] === m.name && info[2] === m.dir && info[3] === m.locale, 'I18n.LANGS komt overeen met meta'); }

  // ui
  const badGaps = [], badChoice = [], badTags = [], empty = [];
  for (const [k, v] of Object.entries(P.ui)) {
    if (typeof v !== 'string' || !v.trim()) { empty.push(k); continue; }
    const gk = gaps(k), gv = gaps(v);
    const need = new Set([...gk.plain, ...gk.chosen]);
    const missing = [...gk.plain].filter(i => !gv.plain.has(i));
    const extra = [...gv.plain, ...gv.chosen].filter(i => !need.has(i));
    if (missing.length || extra.length) badGaps.push(`${JSON.stringify(k)} → ${JSON.stringify(v)}`);
    if (gv.bad.length) badChoice.push(`${JSON.stringify(v)}: ${gv.bad.join(' ')}`);
    if (tags(k) !== tags(v)) badTags.push(`${JSON.stringify(k)} → ${JSON.stringify(v)}`);
  }
  fail(empty, 'geen lege schermteksten');
  fail(badGaps, 'elk gat van de brontekst staat in de vertaling, geen onbekende gaten', 5);
  fail(badChoice, 'keuzevormen zijn geldig (meervoud met other, geslacht met m en f)', 5);
  fail(badTags, 'dezelfde HTML-tags als de brontekst', 5);
  if (lang !== 'en') fail(Object.keys(EN.ui).filter(k => !(k in P.ui)), 'elke Engelse schermtekst is vertaald');

  // data and campaign
  if (lang !== 'en') {
    const d = [], c = [];
    shape(EN.data, P.data, 'data', d); shape(EN.campaign, P.campaign, 'campaign', c);
    fail(d, 'spelinhoud compleet (werelden, kamers, meubels, verdachten, titels, medailles …)');
    fail(c, 'campagne compleet (elk deel, elke zaak: titel, verhaaltje, bewijsstuk)');
    // Engels laat namen zonder titel weg (ze blijven gelijk); elke andere taal noemt iedereen
    const sus = [];
    for (const th of W.THEMES) for (const s of th.suspects) if (!(((P.data.themes || {})[th.id] || {}).suspects || {})[s.label]) sus.push(`${th.id}/${s.label}`);
    fail(sus, 'elke verdachte heeft een naam in deze taal');
  }

  // grammar
  const G = P.grammar;
  const paths = templatePaths(GRAMMAR_NL.templates);
  fail(paths.filter(p => typeof getPath(G.templates || {}, p) !== 'string' || !getPath(G.templates, p).trim()), 'elk zinsbouwsjabloon is er');
  const unknown = [], lost = [], badForms = [];
  for (const p of paths) {
    const t = getPath(G.templates || {}, p), nl = getPath(GRAMMAR_NL.templates, p);
    if (typeof t !== 'string') continue;
    for (const s of slots(t)) if (!KNOWN.has(s.split('.')[0])) unknown.push(`${p}: {${s}}`);
    // what the Dutch sentence says must stay in the sentence: the same people, numbers and quote, the room or
    // furniture in some form, a position in some form
    const heads = new Set(slots(t).map(s => s.split('.')[0]));
    const plain = new Set(slots(t.replace(/\{[a-zA-Z0-9_.]+\|[^{}]*\}/g, '')).map(s => s.split('.')[0]));
    for (const s of new Set(slots(nl).map(s => s.split('.')[0]))) {
      if (['rw', 'rws'].includes(s)) continue;                       // the room word may be left out or rephrased
      if (['s', 'b', 'n', 'k', 'quote', 'victim'].includes(s) ? !plain.has(s) : !heads.has(s)) lost.push(`${p}: {${s}}`);
    }
    // a word form a template asks for must exist everywhere
    for (const s of slots(t)) {
      const [head, form] = s.split('.');
      if (!form) continue;
      if (head === 'room' && !['the', 'in', 'name'].includes(form)) {
        for (const th of W.THEMES) for (const r of th.rooms) {
          const own = ((G.rooms || {})[th.id] || {})[r.key || r.name];
          if (!own || own[form] === undefined) badForms.push(`${p}: {room.${form}} ontbreekt voor ${th.id}/${r.key || r.name}`);
        }
      }
      if (head === 'furn' && !['a', 'next', 'with'].includes(form)) {
        for (const id of new Set(W.THEMES.flatMap(th => th.furniture.map(f => f.id)))) if (!((G.furniture || {})[id] || {})[form]) badForms.push(`${p}: {furn.${form}} ontbreekt voor ${id}`);
      }
      if (head === 'rw' && !['rw', 'rws'].includes(form)) {
        for (const th of W.THEMES) if (!((G.roomWords || {})[th.id] || {})[form]) badForms.push(`${p}: {rw.${form}} ontbreekt voor ${th.id}`);
      }
      if (head === 'pos' && !['room', 'loose', 'the'].includes(form)) badForms.push(`${p}: {pos.${form}} bestaat niet`);
    }
  }
  fail(unknown, 'alleen bekende gaten in de zinsbouw', 5);
  fail(lost, 'geen persoon, kamer, meubel, getal of citaat kwijt ten opzichte van het Nederlands', 5);
  fail([...new Set(badForms)], 'elke woordvorm die een sjabloon gebruikt, bestaat voor alle kamers, meubels en werelden', 5);
  fail(['hoek', 'muur', 'midden'].filter(id => !(G.positions && G.positions[id] && G.positions[id].room && G.positions[id].loose)), 'posities hoek, muur en midden');

  // output: every sentence of generated cases is filled in
  W.I18n.init();
  check(W.I18n.lang === lang, 'taal start: ' + W.I18n.lang);
  const broken = [], dutch = [];
  const DUTCH = /\b(de|het|een|kamer|ruimte|naast|stond|niemand)\b/;
  let n = 0;
  for (const th of W.Themes.list()) for (const diff of ['makkelijk', 'gemiddeld', 'moeilijk']) for (let seed = 1; seed <= 3; seed++) {
    const p = W.FloorPlan.generate(seed * 104729 + diff.length * 31 + th.id.length, diff, th);
    if (!p) continue;
    const out = [p.caseText, ...p.clueTexts, ...p.clues.map(c => W.FloorPlan.statement(c, p).text), ...p.clues.map(c => W.Mentor.explain(c, p))];
    const empty = p.suspects.map(() => null);
    const wrong = p.solution.map((s, i) => (i === 0 ? { x: (s.x + 1) % p.cols, y: s.y } : s));
    for (const pl of [empty, wrong, p.solution.slice()]) { const h = W.FloorPlan.hint(p, pl); out.push(h.text, W.Mentor.hintAction(h, p, pl)); }
    for (const kind of ['accuse', 'rule']) out.push(W.Grammar.text('board/' + kind, p, { room: p.victim.roomId }));
    out.push(W.Grammar.text('board/verdict', p, { s: p.murderer, room: p.victim.roomId }));
    for (const t of out) { n++; if (!t || /\{|\}|undefined|NaN|null/.test(t)) broken.push(`${th.id}: ${JSON.stringify(t)}`); else if (lang !== 'nl' && DUTCH.test(t) && !['en'].includes(lang)) dutch.push(`${th.id}: ${t}`); }
  }
  fail(broken, `elke gegenereerde zin volledig ingevuld (${n} zinnen)`, 5);
  if (lang !== 'en') fail(dutch, 'geen Nederlandse woorden in gegenereerde zinnen', 5);
}
console.log(failures === 0 ? `\nALLE TAALBESTANDEN IN ORDE (${langs.join(', ')})` : `\n${failures} FAILURES`);
process.exit(failures ? 1 : 0);

// Writes out every screen text and sentence template that has a gap, filled with several numbers, so a
// native reader can see whether the words around a count agree ("1 casi" is wrong, "1 caso" right).
//   node tests/i18n-counts.js <lang>
// For each ui entry: the Dutch key, the English value, and the translation with every gap set to
// 0, 1, 2, 3, 5, 11, 21 and 101. Gaps that hold a name or a title will read oddly — judge only the counts.
const path = require('path'), vm = require('vm'), fs = require('fs');
const lang = process.argv[2];
if (!lang) { console.error('gebruik: node tests/i18n-counts.js <taalcode>'); process.exit(1); }
const DIR = path.join(__dirname, '..');
const ctx = { console, Intl, localStorage: { getItem: () => lang, setItem() {} }, navigator: { language: lang, languages: [lang] } };
vm.createContext(ctx);
for (const f of ['i18n/en.js', `i18n/${lang}.js`, 'i18n.js']) vm.runInContext(fs.readFileSync(path.join(DIR, f), 'utf8'), ctx);
vm.runInContext(`I18n.lang = '${lang}';`, ctx);
const I18n = vm.runInContext('I18n', ctx);
const EN = vm.runInContext('LANG_PACKS.en', ctx), P = vm.runInContext(`LANG_PACKS['${lang}']`, ctx);
const NUMS = [0, 1, 2, 3, 5, 11, 21, 101];
let n = 0;
for (const [k, v] of Object.entries(P.ui)) {
  const gaps = [...new Set([...k.matchAll(/\{(\d+)/g)].map(m => +m[1]))];
  if (!gaps.length) continue;
  n++;
  console.log(`\n#${n} ${JSON.stringify(k)}\n   en: ${JSON.stringify(EN.ui[k])}\n   ${lang}: ${JSON.stringify(v)}`);
  for (const x of NUMS) {
    const vals = []; gaps.forEach(g => { vals[g] = x; });
    console.log(`   ${String(x).padStart(3)} → ${I18n.format(v, vals)}`);
  }
}
// sentence templates with a count: {n} or {k}
const walk = (o, at) => Object.entries(o || {}).forEach(([key, val]) => typeof val === 'string' ? (/\{[nk][}|]/.test(val) && list.push([at + key, val])) : walk(val, at + key + '/'));
const list = [];
walk(P.grammar && P.grammar.templates, '');
for (const [p, t] of list) {
  console.log(`\n# grammar ${p}\n   ${lang}: ${JSON.stringify(t)}`);
  for (const x of NUMS) console.log(`   ${String(x).padStart(3)} → ${t.replace(/\{([nk])((?:\|[a-z]+:[^|{}]*)+)?\}/g, (w, s, o) => (o ? I18n.choose(x, o, w) : String(x)))}`);
}
console.log(`\n${n} schermteksten en ${list.length} zinsbouwsjablonen met een getal (${lang})`);

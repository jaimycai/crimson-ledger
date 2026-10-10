// Builds one language file, i18n/<lang>.js, from the parts a translator writes in i18n/.work/<lang>/:
//   meta.js                       { name, dir, locale }
//   ui*.js, data*.js, campaign*.js, grammar*.js
// Each part holds one JavaScript object literal ({ … }); parts of the same section are merged in file-name
// order, so a big section can be split (ui.1.js, ui.2.js …). A syntax error names the file and line.
//   node build-pack.js <lang>
const fs = require('fs'), path = require('path'), vm = require('vm');
const lang = process.argv[2];
if (!/^[a-z]{2,3}$/.test(lang || '')) { console.error('gebruik: node build-pack.js <taalcode>'); process.exit(1); }
const dir = path.join(__dirname, 'i18n', '.work', lang);
if (!fs.existsSync(dir)) { console.error('geen werkmap: ' + dir); process.exit(1); }

const read = f => {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  try { return vm.runInNewContext('(' + src + '\n)', {}, { filename: f }); }
  catch (e) { console.error(`FOUT in ${f}: ${e.message}\n${(e.stack || '').split('\n').slice(0, 3).join('\n')}`); process.exit(1); }
};
// deep merge: objects merge key by key, everything else is replaced
const merge = (a, b) => {
  for (const [k, v] of Object.entries(b)) a[k] = v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object' ? merge(a[k], v) : v;
  return a;
};
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort((x, y) => x.localeCompare(y, 'en', { numeric: true }));
const pack = { meta: null, ui: {}, data: {}, campaign: {}, grammar: {} };
for (const f of files) {
  const section = f.split('.')[0];
  if (!(section in pack)) { console.log('overgeslagen: ' + f); continue; }
  pack[section] = section === 'meta' ? read(f) : merge(pack[section], read(f));
}
if (!pack.meta) { console.error('meta.js ontbreekt'); process.exit(1); }

const body = Object.entries(pack).map(([k, v]) => `  ${k}: ${JSON.stringify(v, null, 2).replace(/\n/g, '\n  ')}`).join(',\n\n');
const out = `// ============================================================
// ${pack.meta.name} — alles wat het spel in deze taal toont; zelfde opbouw als i18n/en.js.
// Gebouwd met build-pack.js uit i18n/.work/${lang}/; pas de delen daar aan en bouw opnieuw.
// ============================================================

(globalThis.LANG_PACKS = globalThis.LANG_PACKS || {}).${lang} = {
${body}
};

if (typeof module !== 'undefined' && module.exports) module.exports = { pack: globalThis.LANG_PACKS.${lang} };
`;
fs.writeFileSync(path.join(__dirname, 'i18n', lang + '.js'), out);
const n = o => Object.keys(o || {}).length;
console.log(`i18n/${lang}.js: ${n(pack.ui)} schermteksten, ${n(pack.data.themes)} werelden, ${n(pack.campaign)} delen, ${n((pack.grammar || {}).templates)} sjabloongroepen, ${Math.round(Buffer.byteLength(out) / 1024)} kB`);
console.log(`controleer: node tests/i18n-packs.test.js ${lang} && node tests/i18n-keys.test.js`);

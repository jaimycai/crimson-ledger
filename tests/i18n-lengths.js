// Lists screen texts that are much longer than the English: buttons, tabs and labels that may not fit.
// Width counts like the screen does: Chinese and Japanese characters count double, combining marks not at all.
//   node tests/i18n-lengths.js <lang> [ratio=1.45] [maxEnglish=28]
const path = require('path');
const [lang, ratioArg, maxArg] = process.argv.slice(2);
if (!lang) { console.error('gebruik: node tests/i18n-lengths.js <taalcode> [verhouding] [max lengte Engels]'); process.exit(1); }
const ratio = +ratioArg || 1.45, maxEn = +maxArg || 28;
require(path.join(__dirname, '..', 'i18n', 'en.js'));
require(path.join(__dirname, '..', 'i18n', lang + '.js'));
const EN = globalThis.LANG_PACKS.en, P = globalThis.LANG_PACKS[lang];
const width = s => [...String(s).replace(/\{[^}]*\}/g, '0').replace(/<[^>]+>/g, '')]
  .reduce((w, ch) => w + (/\p{M}/u.test(ch) ? 0 : /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/u.test(ch) ? 2 : 1), 0);
const rows = [];
for (const [k, en] of Object.entries(EN.ui)) {
  const t = P.ui[k];
  if (!t || width(en) > maxEn) continue;
  const r = width(t) / Math.max(width(en), 1);
  if (r > ratio) rows.push([r, en, t]);
}
// room labels on the floor plan and world tab names
for (const [w, th] of Object.entries(EN.data.themes)) {
  for (const [nl, en] of Object.entries(th.rooms)) { const t = P.data.themes[w].rooms[nl]; if (t && width(t) > 14) rows.push([width(t) / Math.max(width(en), 1), `kamer ${w}: ${en}`, t]); }
  const t = P.data.themes[w].short; if (t && width(t) > 10) rows.push([width(t) / Math.max(width(th.short), 1), `tab ${w}: ${th.short}`, t]);
}
rows.sort((a, b) => b[0] - a[0]);
for (const [r, en, t] of rows) console.log(`${r.toFixed(2)}×  ${JSON.stringify(en)}  →  ${JSON.stringify(t)}`);
console.log(`${rows.length} teksten om na te kijken (${lang}, korte Engelse teksten tot ${maxEn} tekens, langer dan ${ratio}×; kamernamen boven 14, tabs boven 10)`);

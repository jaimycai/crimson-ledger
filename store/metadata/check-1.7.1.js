// Checks the 1.7.1 keyword fields (store/metadata/1.7.1.json) against the store rules and Jaimy's word rules:
// at most 100 characters, comma-separated without spaces, no duplicates, no word that is already in the locale's name or
// subtitle (the new subtitle where 1.7.1 sets one, else the live one in 1.6.1.json), no brand names, and the MURDER,
// MURDER_TR and FREE regexes of check-1.6.js. Run: node store/metadata/check-1.7.1.js
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'check-1.6.js'), 'utf8');
const { FREE, MURDER, MURDER_TR } = new Function(src.slice(src.indexOf('const L'), src.indexOf('\n', src.indexOf('const MURDER_TR'))) + '\nreturn { FREE, MURDER, MURDER_TR };')();
const BRANDS = /enigmic|murdoku|murdle|tiny crimes|whodoku|cluedoku|cluedo|\bclue\b|gridnoir|roomdoku|murdoria|mysteryic|crimebot|sudoku\.com/i;
const next = require('./1.7.1.json'), live = require('./1.6.1.json');
let bad = 0;
const fail = (l, m) => { bad++; console.log(`FAIL  ${l.padEnd(7)} ${m}`); };
for (const [l, v] of Object.entries(next)) {
  const kw = v.keywords, words = kw.split(',');
  const name = (live[l] || {}).name || '', sub = v.subtitle || (live[l] || {}).subtitle || '';
  if (!live[l]) fail(l, 'locale not in 1.6.1.json');
  if ([...kw].length > 100) fail(l, `${[...kw].length} characters`);
  if (/,\s|\s,|^\s|\s$/.test(kw) || words.some(w => !w)) fail(l, 'space or empty word around a comma');
  const low = words.map(w => w.toLocaleLowerCase(l));
  const dup = low.filter((w, i) => low.indexOf(w) !== i); if (dup.length) fail(l, 'duplicate: ' + dup.join(' '));
  const taken = new Set(`${name} ${sub}`.toLocaleLowerCase(l).split(/[\s:·・,،\-–—]+/).filter(Boolean));
  const inName = low.filter(w => taken.has(w)); if (inName.length) fail(l, 'already in name or subtitle: ' + inName.join(' '));
  for (const [what, txt] of [['keywords', kw], ['subtitle', v.subtitle || '']]) {
    MURDER.lastIndex = 0; MURDER_TR.lastIndex = 0;
    const hit = [...(txt.match(MURDER) || []), ...(txt.match(MURDER_TR) || []), ...(txt.match(FREE) || []), ...(txt.match(BRANDS) || [])];
    if (hit.length) fail(l, `${what}: forbidden word ${hit.join(' ')}`);
  }
  if (v.subtitle && [...v.subtitle].length > 30) fail(l, `subtitle ${[...v.subtitle].length} characters`);
  if (!bad) console.log(`ok    ${l.padEnd(7)} ${String([...kw].length).padStart(3)}${v.subtitle ? '  + subtitle ' + v.subtitle : ''}`);
}
console.log(bad ? `${bad} PROBLEMEN` : 'ALLES IN ORDE');
process.exit(bad ? 1 : 0);

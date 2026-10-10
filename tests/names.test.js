// Character names (docs/PLAN-1.2.md §3): no old name is left in the game texts or in any language file,
// every suspect has a gender, and within a world every short name starts with a different letter.
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..');
const { THEMES, Themes } = require('../themes.js');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };

const OLD = ['Clara', 'Marcus', 'Dr. Cross', 'Thomas', 'Isabelle', 'Rosalind', 'Tante Agnes', 'Aunt Agnes', 'Roodbaard', 'Redbeard',
  'Bootsman Vos', 'Boatswain Vos', 'Ada', 'Kwint', 'Lark', 'Kanonnier Bo', 'Gunner Bo', 'Sal', 'Nik', 'Jansen', 'Milo', 'Bram', 'Rosa', 'Ames', 'Lou',
  'Sol', 'Tamsin', 'Fenna', 'Bas', 'Imke', 'Ruud', 'Vic', 'Piet', 'Otto', 'Ans', 'Kurt', 'Els', 'Mieke', 'Tom', 'Sven', 'Greet', 'Berggids Ilse', 'Mountain Guide Ilse'];
const FILES = ['themes.js', 'campaign.js', 'board.js', 'mentor.js', 'minigame.js', 'app.js',
  ...fs.readdirSync(path.join(DIR, 'i18n')).filter(f => f.endsWith('.js')).map(f => 'i18n/' + f)];
const found = [];
for (const f of FILES) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  for (const n of OLD) if (new RegExp('(?<![\\p{L}])' + n.replace('.', '\\.') + '(?![\\p{L}])', 'u').test(src)) found.push(`${f}: ${n}`);
}
check(found.length === 0, 'geen oude namen meer: ' + found.join(', '));
check(THEMES.every(t => t.suspects.every(s => s.gender === 'f' || s.gender === 'm')), 'elke verdachte heeft een geslacht');
const clash = THEMES.filter(t => new Set(t.suspects.map(s => Themes.shortName(s.label)[0])).size !== t.suspects.length).map(t => t.id);
check(clash.length === 0, 'binnen een wereld begint elke korte naam met een andere letter' + (clash.length ? ': ' + clash.join(', ') : ''));
console.log(failures ? `${failures} FAILURES` : 'ALLE NAMEN CHECKS PASSED');
process.exit(failures ? 1 : 0);

// Writes the source file the translators work from: Dutch (source) and English (reference) side by side for new worlds.
//   node docs/werelden/maak-bron.js <world> [<world> ...]     → docs/werelden/bron-<world>-<world>.json
// The worlds must already be in themes.js, campaign.js, progress.js and i18n/en.js. "who" and "look" come from ontwerp.js
// and are background for the translator only.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
global.window = {};
require('./ontwerp.js');
const { THEMES } = require(path.join(ROOT, 'themes.js'));
const { CAMPAIGN } = require(path.join(ROOT, 'campaign.js'));
const { WEEK_TITLES, Progress } = require(path.join(ROOT, 'progress.js'));
require(path.join(ROOT, 'i18n', 'en.js'));
const EN = globalThis.LANG_PACKS.en;

const ids = process.argv.slice(2);
if (!ids.length) { console.error('gebruik: node docs/werelden/maak-bron.js <wereld> [...]'); process.exit(2); }
const out = { note: 'Dutch is the source, English the reference translation. Suspect "who" and "look" are background for the translator only.', worlds: {} };
for (const id of ids) {
  const t = THEMES.find(x => x.id === id), e = EN.data.themes[id], d = window.ONTWERP.find(x => x.id === id);
  if (!t || !e || !d) throw new Error(`${id}: not in themes.js, en.js or ontwerp.js`);
  const pick = o => ({ title: o.title, short: o.short, victimName: o.victimName, roomWord: o.roomWord, roomWordPlural: o.roomWordPlural, tagline: o.tagline, intro: o.intro, outro: o.outro });
  out.worlds[id] = {
    era: d.era,
    theme: { nl: pick(t), en: pick(e) },
    rooms: t.rooms.map(r => ({ nl: r.name, article: r.article, en: e.rooms[r.name] })),
    furniture: t.furniture.map(f => ({ id: f.id, nl: f.nl, en: e.furniture[f.id] })),
    suspects: t.suspects.map((s, i) => ({ nl: s.label, en: e.suspects[s.label] || s.label, gender: s.gender, who: d.suspects[i].who, look: d.suspects[i].look })),
    week: { nl: WEEK_TITLES[id], en: EN.data.week[id] },
    medal: { nl: (m => [m.title, m.hint])(Progress.MEDALS.find(m => m.id === id)), en: EN.data.medals[id] },
    campaign: CAMPAIGN.filter(ch => ch.theme === id).map(ch => {
      const en = EN.campaign[ch.key];
      return { key: ch.key, nl: { title: ch.title, intro: ch.intro, outro: ch.outro, briefing: ch.briefing, cases: ch.cases.map(c => [c.title, c.story, c.item]) },
               en: { title: en[0], intro: en[1], outro: en[2], briefing: en[3], cases: en[4] } };
    })
  };
}
const file = path.join(__dirname, `bron-${ids.join('-')}.json`);
fs.writeFileSync(file, JSON.stringify(out, null, 1));
console.log(path.relative(ROOT, file), fs.statSync(file).size, 'bytes');

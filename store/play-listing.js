// Winkelteksten voor Google Play, afgeleid van de App Store-teksten, zodat beide winkels hetzelfde zeggen:
//   node store/play-listing.js            schrijft store/play/listing.json en controleert de lengtes
// Titel (30 tekens)        = naam uit store/metadata/1.5.0-namen.json (de namen met genrewoord, store/CONVERSIE.md)
// Korte beschrijving (80)  = ondertitel uit dezelfde namen + de onderregel van plaat 2 uit store/cards-text/<taal>.json
// Volledige beschrijving   = beschrijving van de live App Store-versie (store/metadata/1.4.1.json, 4000 tekens)
// Per taal ook welke platen (store/cards-play-<taal>/) en welke banner (store/play/feature-<taal>.png) erbij horen.
const fs = require('fs');
const path = require('path');

const names = require('./metadata/1.5.0-namen.json');
const texts = require('./metadata/1.4.1.json');

// App Store-taal → [Google Play-taal, taal van de platen]
const MAP = {
  'en-US': ['en-US', 'en'], 'en-GB': ['en-GB', 'en'], 'nl-NL': ['nl-NL', 'nl'], 'de-DE': ['de-DE', 'de'],
  'es-ES': ['es-ES', 'es'], 'es-MX': ['es-419', 'es'], 'fr-FR': ['fr-FR', 'fr'], 'it': ['it-IT', 'it'],
  'pt-BR': ['pt-BR', 'pt'], 'pt-PT': ['pt-PT', 'pt'], 'ru': ['ru-RU', 'ru'], 'tr': ['tr-TR', 'tr'],
  'ar-SA': ['ar', 'ar'], 'ja': ['ja-JP', 'ja'], 'ko': ['ko-KR', 'ko'], 'zh-Hans': ['zh-CN', 'zh'],
  'vi': ['vi', 'vi'], 'id': ['id', 'id'], 'hi': ['hi-IN', 'hi'], 'bn-BD': ['bn-BD', 'bn'],
  'mr-IN': ['mr-IN', 'mr'], 'te-IN': ['te-IN', 'te'], 'ur-PK': ['ur', 'ur']
};
// zinseinde per schrift, voor de las tussen ondertitel en onderregel
const STOP = { ja: '。', zh: '。', ur: '۔ ', hi: '। ', mr: '। ', bn: '। ' };

const out = {}, problems = [];
for (const [asc, [play, cards]] of Object.entries(MAP)) {
  const n = names[asc], t = texts[asc];
  if (!n || !t) { problems.push(`${asc}: tekst ontbreekt`); continue; }
  const sub = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards-text', `${cards}.json`), 'utf8'))[1][2];
  const stop = STOP[cards] || '. ';
  const subtitle = n.subtitle.replace(/[.。۔।\s]+$/, '');
  let short = subtitle + stop.trimEnd() + (stop.endsWith(' ') ? ' ' : '') + sub;
  if ([...short].length > 80) short = subtitle;
  const item = { title: n.name, short, full: t.description, cards, feature: `feature-${cards}.png` };
  const len = s => [...s].length;
  if (len(item.title) > 30) problems.push(`${play}: titel ${len(item.title)} tekens`);
  if (len(item.short) > 80) problems.push(`${play}: korte beschrijving ${len(item.short)} tekens`);
  if (len(item.full) > 4000) problems.push(`${play}: beschrijving ${len(item.full)} tekens`);
  out[play] = item;
}
fs.mkdirSync(path.join(__dirname, 'play'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'play', 'listing.json'), JSON.stringify(out, null, 1) + '\n');
for (const [k, v] of Object.entries(out)) console.log(`${k.padEnd(6)} ${String([...v.title].length).padStart(2)} ${String([...v.short].length).padStart(2)} ${v.title} | ${v.short}`);
if (problems.length) { console.error('PROBLEMEN:\n' + problems.join('\n')); process.exit(1); }

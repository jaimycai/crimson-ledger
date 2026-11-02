// Checks the 1.5 store texts per store locale: lengths, keywords, required facts and the screenshot captions.
//   node store/metadata/check-1.5.js                 every file in store/metadata/1.5.0/
//   node store/metadata/check-1.5.js nl-NL en-US     only these
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '1.5.0');
const CARDS = path.join(__dirname, '..', 'cards-text');
const LIMIT = { name: 30, subtitle: 30, keywords: 100, promotionalText: 170, description: 4000, whatsNew: 4000 };
const BRANDS = /murdle|cluedo|clue\b|enigmic|tiny crimes|murdoku|mysteryic|murdoria/i;
const NOT_IN_TITLE = /\b(free|gratis|gratuit|kostenlos|grátis|gratuito|ücretsiz|бесплатн|#1|best\b|beste\b)/i;
// 240 in Western, Arabic-Indic, Extended Arabic-Indic (Urdu), Devanagari, Bengali and Telugu digits
const N240 = /240|٢٤٠|۲۴۰|२४०|২৪০|౨౪౦/;
// gratis en proberen, per taal (afschrikwoorden voor promotietekst, wat is er nieuw en de onderschriften)
const FREE = /free|gratis|gratuit|kostenlos|grátis|gratuito|ücretsiz|бесплатн|مجان|مفت|मुफ़्त|मुफ्त|मोफत|ফ্রি|বিনামূল্যে|ఉచిత|無料|무료|免费|miễn phí|probeer|try |prova|prueba|experimente|essaie|teste |coba|dene|попробуй|جرّب|آزمائیں|आज़माएँ|खेळून पाहा|খেলে দেখুন|ఆడి చూడండి|お試し|체험|试玩|chơi thử/i;
const APP_LANG = { 'nl-NL': 'nl', 'en-US': 'en', 'en-GB': 'en', 'de-DE': 'de', 'fr-FR': 'fr', 'es-ES': 'es', 'es-MX': 'es',
  'pt-BR': 'pt', 'pt-PT': 'pt', it: 'it', ja: 'ja', ko: 'ko', 'zh-Hans': 'zh', ru: 'ru', tr: 'tr', id: 'id', vi: 'vi',
  'ar-SA': 'ar', 'ur-PK': 'ur', hi: 'hi', 'mr-IN': 'mr', 'bn-BD': 'bn', 'te-IN': 'te' };
const ORDER = JSON.parse(fs.readFileSync(path.join(CARDS, 'nl.json'), 'utf8')).map(r => r[0]);

const want = process.argv.slice(2);
const files = want.length ? want.map(l => l + '.json') : fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
let bad = 0;
const fail = (loc, msg) => { bad++; console.log(`FOUT  ${loc}: ${msg}`); };
const words = s => String(s || '').toLowerCase().split(/[\s,:;·\-–—!?¿¡.'’"()]+/u).filter(w => w.length > 1);

for (const f of files) {
  const loc = f.replace(/\.json$/, '');
  let t;
  try { t = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { fail(loc, 'bestand ontbreekt of is geen JSON: ' + e.message); continue; }
  for (const [k, max] of Object.entries(LIMIT)) {
    if (typeof t[k] !== 'string' || !t[k].trim()) { fail(loc, `${k} ontbreekt`); continue; }
    const n = [...t[k]].length;
    if (n > max) fail(loc, `${k} is ${n} tekens (max ${max})`);
  }
  if (!t.name || !t.name.startsWith('Crimson Ledger')) fail(loc, 'naam begint niet met "Crimson Ledger"');
  for (const k of ['name', 'subtitle']) if (NOT_IN_TITLE.test(t[k] || '')) fail(loc, `${k} bevat een woord dat Apple weigert (gratis/beste/#1)`);
  const kw = String(t.keywords || '');
  if (/,\s/.test(kw)) fail(loc, 'zoekwoorden: spatie na een komma');
  if (BRANDS.test(kw) || BRANDS.test(t.name || '') || BRANDS.test(t.subtitle || '')) fail(loc, 'merknaam van een ander');
  const titleWords = new Set(words(`${t.name} ${t.subtitle}`));
  const kws = kw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const dupT = kws.filter(k => titleWords.has(k));
  if (dupT.length) fail(loc, `zoekwoorden die al in naam/ondertitel staan: ${dupT.join(', ')}`);
  const seen = new Set(); for (const k of kws) { if (seen.has(k)) fail(loc, `zoekwoord dubbel: ${k}`); seen.add(k); }
  // Jaimy, 2-11: niets wat afschrikt. Geen aantal gratis zaken, geen gratis/proberen in de haak; Apple weigert ★.
  for (const k of ['name', 'subtitle', 'promotionalText', 'description', 'whatsNew']) {
    if (N240.test(t[k] || '')) fail(loc, `${k} noemt 240 (geen aantal gratis zaken)`);
    if (/[★☆]/.test(t[k] || '')) fail(loc, `${k} bevat ★ of ☆ (Apple weigert die)`);
  }
  for (const k of ['promotionalText', 'whatsNew']) if (FREE.test(t[k] || '')) fail(loc, `${k} noemt gratis/proberen`);
  const freeInDesc = (String(t.description || '').match(new RegExp(FREE.source, 'gi')) || []).length;
  if (freeInDesc > 1) fail(loc, `beschrijving noemt gratis ${freeInDesc} keer (hooguit één keer, neutraal, in de laatste alinea)`);
  if (/\b(buy|koop|kaufen|acheter|comprar|comprare|satın)\b/i.test(t.promotionalText + ' ' + t.whatsNew)) fail(loc, 'promotietekst of wat-is-nieuw zegt "kopen"');

  const lang = APP_LANG[loc];
  if (!lang) { fail(loc, 'onbekende winkeltaal'); continue; }
  let cards;
  try { cards = JSON.parse(fs.readFileSync(path.join(CARDS, lang + '.json'), 'utf8')); } catch (e) { fail(loc, `cards-text/${lang}.json ontbreekt`); continue; }
  if (cards.map(r => r[0]).join() !== ORDER.join()) fail(loc, `cards-text/${lang}.json: bestanden of volgorde wijken af van nl`);
  for (const r of cards) {
    const txt = r.slice(1).join(' ');
    if (N240.test(txt) || FREE.test(txt)) fail(loc, `cards-text/${lang}.json: beeld ${r[0]} noemt gratis/proberen of 240`);
  }
  if (!bad) console.log(`ok    ${loc}  ${t.name} | ${t.subtitle}`);
}
console.log(bad ? `${bad} FOUT(EN)` : 'ALLES IN ORDE');
process.exit(bad ? 1 : 0);

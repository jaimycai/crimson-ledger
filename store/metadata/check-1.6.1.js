// Checks the 1.6 store texts per store locale: lengths, keywords, required facts and the screenshot captions.
//   node store/metadata/check-1.6.1.js                 every file in store/metadata/1.6.1/
//   node store/metadata/check-1.6.1.js nl-NL en-US     only these
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '1.6.1');
const CARDS = path.join(__dirname, '..', 'cards-text');
const LIMIT = { name: 30, subtitle: 30, keywords: 100, promotionalText: 170, description: 4000, whatsNew: 4000 };
const BRANDS = /murdle|cluedo|clue\b|enigmic|tiny crimes|murdoku|mysteryic|murdoria/i;
const NOT_IN_TITLE = /\b(free|gratis|gratuit|kostenlos|grátis|gratuito|ücretsiz|бесплатн|#1|best\b|beste\b)/i;
// 240 in Western, Arabic-Indic, Extended Arabic-Indic (Urdu), Devanagari, Bengali and Telugu digits
const N240 = /240|٢٤٠|۲۴۰|२४०|২৪০|౨౪౦/;
const STALE = /1[.,   ]?024|١٠٢٤|۱۰۲۴|१०२४|১০২৪|౧౦౨౪/;
// gratis en proberen, per taal (afschrikwoorden voor promotietekst, wat is er nieuw en de onderschriften)
const FREE = /free|gratis|gratuit|kostenlos|grátis|gratuito|ücretsiz|бесплатн|مجان|مفت|मुफ़्त|मुफ्त|मोफत|ফ্রি|বিনামূল্যে|ఉచిత|無料|무료|免费|miễn phí|probeer|try |prova|prueba|experimente|essaie|teste |coba|dene|попробуй|جرّب|آزمائیں|आज़माएँ|खेळून पाहा|খেলে দেখুন|ఆడి చూడండి|お試し|체험|试玩|chơi thử/i;
// Jaimy, 3-11: geen woord voor moord in welke taal dan ook, en vooraan al helemaal niet. Dus geen moord, vermoord,
// moordenaar, doden, doodslag, killer of sluipmoord in naam, ondertitel, zoekwoorden, promotietekst, beschrijving, wat is
// er nieuw of onderschriften, in alle schriften, ook als translitteratie (khun, qatl, hatya). Misdaad, Krimi, crimen en
// dader mogen wel (genre en schuldige, geen daad), maar niet vooraan: dat bewaakt de naamkeuze, niet deze regel.
// Woordgrenzen waar een losse lettergreep vals alarm geeft: Bengaals খুন zit ook in রাখুন/দেখুন, Arabisch قاتل in مقاتل
// (strijder), Vietnamees ám sát in giám sát (toezicht), Russisch убит in трубит, Japans 殺 in 殺到 en 相殺. Een
// voorvoegsel (Arabisch و ف ب ل ك ال, Urdu/Hindi geen) mag voor het woord staan. Zie ook het probleem met مفت in المفتش
// bij FREE hierboven: die regel kijkt naar losse tekens, deze naar woordbegin.
const L = '(?<![\\p{L}\\p{M}])';               // woordbegin in elk schrift
const E = '(?![\\p{L}\\p{M}])';                // woordeinde (\\b kent alleen ASCII)
const AR = L + '(?:[وفبلك]|ال|وال|بال|فال|لل)?';  // Arabisch/Urdu: voorvoegsel toegestaan
const MURDER = new RegExp([
  // Latijns schrift
  L + '(?:moord|vermoord|doodslag|gedood)',                                   // nl
  L + '(?:murder|kill|homicid|assassin|slay|slain)',                          // en (+ fr/it/pt assassin)
  L + '(?:mord|mörder|ermord|getötet|töte|tötung|totschlag|umgebracht)',      // de
  L + '(?:meurtr|tueu[rs]|homicide|(?:tuer|tué|tuée|tués|tuées)' + E + ')',      // fr
  L + '(?:asesin|homic[ií]d|(?:matar|mató|mataron|matou|mataram)' + E + ')',    // es, pt
  L + '(?:omicid|uccis|uccid)',                                               // it
  '(?:bunuh)',                                                                // id (pembunuhan, dibunuh, terbunuh)
  L + '(?:án mạng|giết|sát nhân|hung thủ|ám sát)',                            // vi
  L + '(?:khun|khoon|qatl|qatil|hatya)',                                      // translitteratie (bn, hi, ur, mr)
  // Cyrillisch
  L + '(?:убий|убит|убива|киллер|мокрух)',
  // CJK
  '(?:殺人|殺害|殺され|殺し|人殺|マーダー|キラー|殺人事件)',                       // ja
  '(?:살인|살해|머더|킬러)',                                                    // ko
  '(?:谋杀|凶手|凶案|凶杀|真凶|行凶|元凶|杀人|杀手|杀害|被杀|杀死|剧本杀|命案|遇害)',   // zh
  // Arabisch en Urdu
  AR + '(?:قتل|قاتل|مقتول|قتيل|اغتيال)',
  L + '(?:مرڈر|خونی|خون)',                                                    // ur: murder, khooni, khoon
  // Devanagari (hi, mr), met en zonder nukta
  L + '(?:हत्या|हत्यार|(?:क\\u093C?|\\u0958)त्ल|(?:क\\u093C?|\\u0958)ातिल|(?:ख\\u093C?|\\u0959)(?:ून|ुन)|मर्डर|मारेकरी|किलर)',
  // Bengaals
  L + '(?:খুন|হত্যা|মার্ডার|ঘাতক|নিহত|কিলার|আততা)',
  // Telugu
  L + '(?:హత్య|హంతక|మర్డర్|చంప|కిల్లర్|హతమార్)',
].join('|'), 'giu');
// Turks apart en hoofdlettergevoelig: met /i wordt KATILIM (deelname, met ı) ook "katil".
const MURDER_TR = new RegExp(L + '(?:[kK]atil|KATİL|[cC]inayet|CİNAYET|[öÖ]ldür|ÖLDÜR|[mM]aktul|MAKTUL)', 'gu');
// Arabische klinkertekens en tatweel eruit, anders glipt قُتل langs قتل
const bare = s => String(s || '').replace(/[\u0640\u064B-\u065F\u0670]/g, '');
const murderWords = s => [...bare(s).matchAll(MURDER), ...bare(s).matchAll(MURDER_TR)].map(m => m[0]);
// Apple koppelt losse zoekwoorden aan elkaar: in het Vietnamees mogen deze paren niet samen in naam, ondertitel en
// zoekwoorden staan, anders zoekt de winkel ons toch op het moordwoord.
const VI_PAIRS = [['sát', 'nhân'], ['hung', 'thủ'], ['án', 'mạng']];
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
  // Jaimy, 8 november 2026: genre vooraan, merk achteraan ("Mystery Sudoku: Crimson Ledger"). Een zoeker leest eerst wat
  // het spel is; het onbekende merk vooraan kostte doortikken (store/CONVERSIE.md, "Conversie per land").
  if (!t.name || !t.name.endsWith(': Crimson Ledger') || t.name === ': Crimson Ledger') fail(loc, 'naam is niet "<genre>: Crimson Ledger"');
  for (const k of ['name', 'subtitle']) if (NOT_IN_TITLE.test(t[k] || '')) fail(loc, `${k} bevat een woord dat Apple weigert (gratis/beste/#1)`);
  const kw = String(t.keywords || '');
  if (/,\s/.test(kw)) fail(loc, 'zoekwoorden: spatie na een komma');
  // Jaimy, 8 november 2026: geen 'murder' in welke taal dan ook, ook niet in het onzichtbare trefwoordveld van en-US en
  // en-GB. Dat vervangt het besluit van 4 november; 'murdoku' (merk van een ander) gaat er daarom ook uit.
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
  // 1.6: het aantal zaken van 1.5 (1.024) klopt niet meer sinds de nieuwe werelden
  for (const k of ['promotionalText', 'description', 'whatsNew']) if (STALE.test(t[k] || '')) fail(loc, `${k} noemt nog 1.024 zaken (telling van 1.5)`);
  for (const k of ['promotionalText', 'whatsNew']) if (FREE.test(t[k] || '')) fail(loc, `${k} noemt gratis/proberen`);
  const freeInDesc = (String(t.description || '').match(new RegExp(FREE.source, 'gi')) || []).length;
  if (freeInDesc > 1) fail(loc, `beschrijving noemt gratis ${freeInDesc} keer (hooguit één keer, neutraal, in de laatste alinea)`);
  if (/\b(buy|koop|kaufen|acheter|comprar|comprare|satın)\b/i.test(t.promotionalText + ' ' + t.whatsNew)) fail(loc, 'promotietekst of wat-is-nieuw zegt "kopen"');
  // Jaimy, 3-11: nergens een moordwoord
  for (const k of Object.keys(LIMIT)) {
    const hits = murderWords(t[k]);
    if (hits.length) fail(loc, `${k} bevat een moordwoord: ${[...new Set(hits)].join(', ')}`);
  }
  if (loc === 'vi') {
    const toks = new Set(words(`${t.name} ${t.subtitle}`).concat(kws));
    for (const [a, b] of VI_PAIRS) if (toks.has(a) && toks.has(b)) fail(loc, `naam/ondertitel/zoekwoorden vormen samen "${a} ${b}" (moordwoord)`);
  }

  const lang = APP_LANG[loc];
  if (!lang) { fail(loc, 'onbekende winkeltaal'); continue; }
  let cards;
  try { cards = JSON.parse(fs.readFileSync(path.join(CARDS, lang + '.json'), 'utf8')); } catch (e) { fail(loc, `cards-text/${lang}.json ontbreekt`); continue; }
  if (cards.map(r => r[0]).join() !== ORDER.join()) fail(loc, `cards-text/${lang}.json: bestanden of volgorde wijken af van nl`);
  for (const r of cards) {
    const txt = r.slice(1).join(' ');
    if (N240.test(txt) || FREE.test(txt)) fail(loc, `cards-text/${lang}.json: beeld ${r[0]} noemt gratis/proberen of 240`);
    const mw = murderWords(txt);
    if (mw.length) fail(loc, `cards-text/${lang}.json: beeld ${r[0]} bevat een moordwoord: ${[...new Set(mw)].join(', ')}`);
  }
  if (!bad) console.log(`ok    ${loc}  ${t.name} | ${t.subtitle}`);
}
console.log(bad ? `${bad} FOUT(EN)` : 'ALLES IN ORDE');
process.exit(bad ? 1 : 0);

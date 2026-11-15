// Checks the 1.7.0 release texts per store locale: "What's New" (1.7.0-notes.json) and the promotional text
// (1.7.0-promo.json). Same 23 locales as 1.6.2-notes.json, Apple's lengths, and the word rules of check-1.6.js.
//   node store/metadata/check-1.7.js                 every locale
//   node store/metadata/check-1.7.js nl-NL en-US     only these
const fs = require('fs');
const path = require('path');
const NOTES = path.join(__dirname, '1.7.0-notes.json');
const PROMO = path.join(__dirname, '1.7.0-promo.json');
const REF = path.join(__dirname, '1.6.2-notes.json');   // de 23 winkeltalen van de vorige versie
const FILES = { whatsNew: NOTES, promotionalText: PROMO };
const LIMIT = { whatsNew: 4000, promotionalText: 170 };

// ---- regels overgenomen uit check-1.6.js (niet los aanpassen; eerst daar) ----
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
// ---- einde overgenomen regels ----

const read = (f, label) => {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { console.log(`FOUT  ${label}: bestand ontbreekt of is geen JSON: ${e.message}`); process.exit(1); }
};
const ref = read(REF, path.basename(REF));
const data = { whatsNew: read(NOTES, path.basename(NOTES)), promotionalText: read(PROMO, path.basename(PROMO)) };
const LOCALES = Object.keys(ref);

let bad = 0;
const fail = (loc, msg) => { bad++; console.log(`FOUT  ${loc}: ${msg}`); };
if (LOCALES.length !== 23) fail('1.6.2-notes.json', `${LOCALES.length} winkeltalen, verwacht 23`);
for (const [field, obj] of Object.entries(data)) {
  for (const loc of Object.keys(obj)) if (!LOCALES.includes(loc)) fail(loc, `${path.basename(FILES[field])}: winkeltaal staat niet in 1.6.2-notes.json`);
}

const want = process.argv.slice(2);
for (const loc of want) if (!LOCALES.includes(loc)) fail(loc, 'onbekende winkeltaal');
for (const loc of want.length ? want.filter(l => LOCALES.includes(l)) : LOCALES) {
  const before = bad;
  const len = {};
  for (const [field, max] of Object.entries(LIMIT)) {
    const file = path.basename(FILES[field]);
    const entry = data[field][loc];
    const t = entry && entry[field];
    if (typeof t !== 'string' || !t.trim()) { fail(loc, `${file}: ${field} ontbreekt`); continue; }
    const n = [...t].length;
    len[field] = n;
    if (n > max) fail(loc, `${file}: ${field} is ${n} tekens (max ${max})`);
    // Jaimy, 2-11: geen gratis/proberen in promotietekst en wat is er nieuw
    const free = t.match(FREE);
    if (free) fail(loc, `${file}: ${field} noemt gratis/proberen ("${free[0]}")`);
    // Jaimy, 3-11: nergens een moordwoord
    const hits = murderWords(t);
    if (hits.length) fail(loc, `${file}: ${field} bevat een moordwoord: ${[...new Set(hits)].join(', ')}`);
    // vaste afspraken uit .agents/product-marketing.md: geen ★ of emoji (Apple weigert ★), nooit "koop/buy"
    if (/[★☆]|\p{Extended_Pictographic}/u.test(t)) fail(loc, `${file}: ${field} bevat ★ of een emoji`);
    if (/\b(buy|koop|kaufen|acheter|comprar|comprare|satın)\b/i.test(t)) fail(loc, `${file}: ${field} zegt "kopen"`);
  }
  // vorm van 1.6.2: een haakregel, dan opsommingstekens met "• "
  const wn = data.whatsNew[loc] && data.whatsNew[loc].whatsNew;
  if (typeof wn === 'string') {
    const lines = wn.split('\n');
    if (!lines[0].trim() || lines[0].startsWith('•')) fail(loc, 'whatsNew begint niet met een haakregel');
    const bullets = lines.filter(l => l.startsWith('• ')).length;
    if (bullets < 3) fail(loc, `whatsNew heeft ${bullets} opsommingstekens "• " (minstens 3)`);
  }
  if (bad === before) console.log(`ok    ${loc.padEnd(8)} whatsNew ${String(len.whatsNew).padStart(4)} | promo ${String(len.promotionalText).padStart(3)}`);
}
console.log(bad ? `${bad} FOUT(EN)` : 'ALLES IN ORDE');
process.exit(bad ? 1 : 0);

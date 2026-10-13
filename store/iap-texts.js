// Teksten van de negen in-app-aankopen voor de winkeltalen die in 1.2 bijkomen.
// Namen en de omschrijving van een wereld komen uit de taalbestanden van de app (per taal nagelezen),
// zodat de winkel dezelfde woorden gebruikt als het scherm. Alleen de drie omschrijvingen in OWN zijn
// hier vertaald: de app heeft daar geen zin voor, alleen bevestigingen na een aankoop.
// Nederlands en Engels staan in asc.js. Apple staat 30 tekens toe voor de naam en 45 voor de omschrijving.
//
//   node store/iap-texts.js    toont de tabel en controleert de lengtes
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { I18n } = require(path.join(ROOT, 'i18n.js'));

// winkeltaal in App Store Connect -> taalbestand van de app (zelfde codes als store/metadata/1.2.0.json)
const LOCALES = {
  'ar-SA': 'ar', 'bn-BD': 'bn', 'de-DE': 'de', 'es-ES': 'es', 'es-MX': 'es', 'fr-FR': 'fr', 'hi': 'hi', 'id': 'id',
  'it': 'it', 'ja': 'ja', 'ko': 'ko', 'mr-IN': 'mr', 'pt-BR': 'pt', 'pt-PT': 'pt', 'ru': 'ru', 'te-IN': 'te',
  'tr': 'tr', 'ur-PK': 'ur', 'vi': 'vi', 'zh-Hans': 'zh'
};
const WORLDS = ['hotel', 'ruimte', 'museum', 'trein', 'circus', 'skihut'];
const WORLD_CASES = 48, WORLD_PARTS = 6, HINT_PACK = 10;

// [Crimson Pass, 10 hints, bordthema's en lijsten]: "Alle werelden, onbeperkt hints en alle thema's." /
// "Tien extra hints van Inspecteur Van Dam." / "Drie bordthema's en drie lijsten." Woorden en de naam van
// Van Dam volgen het taalbestand. Een winkeltaal met eigen spelling krijgt een eigen regel (pt-PT).
const OWN = {
  ar: ['كل العوالم، تلميحات بلا حدود وكل السمات.', 'عشرة تلميحات إضافية من المفتش فان دام.', 'ثلاث سمات للوحة وثلاثة إطارات.'],
  bn: ['সব জগৎ, সীমাহীন ইঙ্গিত আর সব থিম।', 'ইন্সপেক্টর ভান ডামের 10টি বাড়তি ইঙ্গিত।', 'বোর্ডের তিনটি থিম আর তিনটি ফ্রেম।'],
  de: ['Alle Welten, unbegrenzte Tipps, alle Designs.', 'Zehn zusätzliche Tipps von Inspektor Van Dam.', 'Drei Brettdesigns und drei Rahmen.'],
  es: ['Todos los mundos, pistas ilimitadas y temas.', 'Diez pistas más del inspector Van Dam.', 'Tres temas de tablero y tres marcos.'],
  fr: ['Tous les mondes, aides illimitées et thèmes.', 'Dix aides en plus de l’inspecteur Van Dam.', 'Trois thèmes de plateau et trois cadres.'],
  hi: ['सारी दुनियाएँ, असीमित संकेत और सारी थीम।', 'इंस्पेक्टर वैन डैम से 10 अतिरिक्त संकेत।', 'तीन बोर्ड थीम और तीन फ़्रेम।'],
  id: ['Semua dunia, hint tanpa batas, semua tema.', 'Sepuluh hint tambahan dari Inspektur Van Dam.', 'Tiga tema papan dan tiga bingkai.'],
  it: ['Tutti i mondi, aiuti illimitati e i temi.', 'Dieci aiuti in più dall’ispettore Van Dam.', 'Tre temi del tabellone e tre cornici.'],
  ja: ['全ワールド、ヒント無制限、全テーマ。', 'ヴァン・ダム警部のヒント10回分。', '盤面テーマ3種とフレーム3種。'],
  ko: ['모든 월드, 힌트 무제한, 모든 테마.', '반 담 경감의 힌트 10개.', '보드 테마 3종과 액자 3종.'],
  mr: ['सर्व जग, अमर्याद संकेत आणि सर्व थीम.', 'निरीक्षक व्हॅन डॅमकडून 10 अतिरिक्त संकेत.', 'तीन पट-थीम आणि तीन फ्रेम.'],
  pt: ['Todos os mundos, dicas ilimitadas e temas.', 'Dez dicas extras do inspetor Van Dam.', 'Três temas de tabuleiro e três molduras.'],
  'pt-PT': ['Todos os mundos, dicas ilimitadas e temas.', 'Dez dicas extra do inspetor Van Dam.', 'Três temas de tabuleiro e três molduras.'],
  ru: ['Все миры, безлимитные подсказки и темы.', 'Десять подсказок от инспектора Ван Дама.', 'Три темы поля и три рамки.'],
  te: ['అన్ని ప్రపంచాలు, అపరిమిత సూచనలు, థీమ్‌లు.', 'ఇన్‌స్పెక్టర్ వాన్ డామ్ నుంచి 10 సూచనలు.', 'మూడు బోర్డు థీమ్‌లు, మూడు ఫ్రేములు.'],
  tr: ['Tüm dünyalar, sınırsız ipucu, tüm temalar.', 'Komiser Van Dam’den on ek ipucu.', 'Üç tahta teması ve üç çerçeve.'],
  ur: ['تمام دنیائیں، لامحدود اشارے اور تمام تھیم۔', 'انسپکٹر وین ڈیم کی طرف سے 10 اضافی اشارے۔', 'تین بورڈ تھیم اور تین فریم۔'],
  vi: ['Mọi thế giới, gợi ý vô hạn và mọi giao diện.', 'Mười gợi ý thêm từ Thanh tra Van Dam.', 'Ba giao diện bàn chơi và ba khung.'],
  zh: ['所有世界、无限提示和所有主题。', '范达姆探长的10次额外提示。', '三款平面图主题和三款头像框。']
};

const len = s => [...s].length;

function build() {
  globalThis.LANG_PACKS = globalThis.LANG_PACKS || {};
  const out = { 'nl.crimsonledger.app.pass': {}, 'nl.crimsonledger.app.hints10': {}, 'nl.crimsonledger.app.cosmetics': {} };
  WORLDS.forEach(w => { out[`nl.crimsonledger.app.world.${w}`] = {}; });
  const before = I18n.lang;
  for (const [locale, code] of Object.entries(LOCALES)) {
    if (!globalThis.LANG_PACKS[code]) globalThis.LANG_PACKS[code] = require(path.join(ROOT, 'i18n', code + '.js')).pack;
    I18n.lang = code;
    const t = k => { const v = I18n.t(k); if (v === k) throw new Error(`${code}: geen vertaling voor "${k}"`); return v; };
    const [pass, hints, cosmetics] = OWN[locale] || OWN[code];
    const parts = I18n.format(t('{0} zaken in {1} delen · {2}'), [WORLD_CASES, WORLD_PARTS, '§']).replace(/\s*·\s*§|§\s*·\s*/, '');
    if (parts.includes('§')) throw new Error(`${code}: wereldomschrijving zonder scheidingsteken`);
    out['nl.crimsonledger.app.pass'][locale] = ['Crimson Pass', pass];
    out['nl.crimsonledger.app.hints10'][locale] = [I18n.format(t('{0} hints'), [HINT_PACK]), hints];
    out['nl.crimsonledger.app.cosmetics'][locale] = [t("Bordthema's en lijsten"), cosmetics];
    const stop = [...pass].pop();   // eindteken van de taal: . । ۔ 。
    WORLDS.forEach(w => {
      const title = I18n.pack().data.themes[w].title;
      out[`nl.crimsonledger.app.world.${w}`][locale] = [title, parts + stop];
    });
  }
  I18n.lang = before;
  for (const [pid, byLocale] of Object.entries(out)) {
    for (const [locale, [name, description]] of Object.entries(byLocale)) {
      if (len(name) > 30) throw new Error(`naam te lang (${len(name)}) voor ${pid} ${locale}: ${name}`);
      if (len(description) > 45) throw new Error(`omschrijving te lang (${len(description)}) voor ${pid} ${locale}: ${description}`);
    }
  }
  return out;
}

module.exports = { build, LOCALES };

if (require.main === module) {
  const table = build();
  for (const locale of Object.keys(LOCALES)) {
    console.log(`\n${locale}`);
    for (const [pid, byLocale] of Object.entries(table)) {
      const [name, description] = byLocale[locale];
      console.log(`  ${pid.replace('nl.crimsonledger.app.', '').padEnd(14)} ${name}  (${len(name)})  |  ${description}  (${len(description)})`);
    }
  }
}

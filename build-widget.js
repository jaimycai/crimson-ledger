// Bouwt de gegevens van de widget "Zaak van vandaag" (ios/App/CrimsonLiveActivity/DailyCaseWidget.swift).
// De widget kan het JavaScript van de app niet draaien, dus dit script rekent de dagzaken vooruit met de code van de
// app zelf (App.dailyCase, Themes, Progress en de taalbestanden): voor elke dag van twee dagen terug tot 400 dagen
// vooruit de wereld en de titel, en per taal de namen van de werelden, de titels en de vaste teksten van de widget.
// build-www.js roept dit aan, dus elke bouw (npm run build, npm run ios, store/release-ios.sh, Xcode Cloud) zet een
// verse versie klaar. Het bestand staat niet in git (.gitignore): het hoort bij de bouw, net als ios/App/App/public.
// Na de laatste dag rekent de widget zelf verder met dezelfde rotatie (alleen als "rotation" true is, zie onder).
//   node build-widget.js             → ios/App/CrimsonLiveActivity/DailyCases.json
//   node build-widget.js /tmp/x.json → een ander bestand (de test bouwt zo in een tijdelijke map)
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'ios', 'App', 'CrimsonLiveActivity', 'DailyCases.json');
const BACK = 2;      // dagen terug: wie in een andere tijdzone woont, kan nog op gisteren staan
const AHEAD = 400;   // dagen vooruit: ruim meer dan de tijd tussen twee versies

// ============================================================
// VASTE TEKSTEN VAN DE WIDGET — Nederlands is de bron. Dezelfde
// woorden als het taalbestand van de app (zaak/Fall/caso/affaire/
// дело/事件 …, streak/Serie/racha/série …) en dezelfde aanspreekvorm.
// Geen woord voor moord (zie tests/widget.test.js).
//   name         naam in de widgetgalerij
//   description  regel onder de naam in de galerij
//   play         de oproep op de widget
//   solved       de dagzaak van vandaag is opgelost (met een ✓ ervoor)
//   tomorrow     regel onder "solved" op de middelgrote widget
//   streak       voorleestekst (VoiceOver) bij 🔥 12; {0} is het aantal dagen
// ============================================================
const WIDGET_TEKST = {
  nl: { name: 'Zaak van vandaag', description: 'Elke dag een nieuwe zaak, met je streak.', play: 'Speel de zaak van vandaag', solved: 'Vandaag opgelost', tomorrow: 'Morgen een nieuwe zaak', streak: 'Streak: {0}' },
  en: { name: 'Today’s case', description: 'A new case every day, with your streak.', play: 'Play today’s case', solved: 'Solved today', tomorrow: 'A new case tomorrow', streak: 'Streak: {0}' },
  de: { name: 'Heutiger Fall', description: 'Jeden Tag ein neuer Fall, mit deiner Serie.', play: 'Spiel den heutigen Fall', solved: 'Heute gelöst', tomorrow: 'Morgen ein neuer Fall', streak: 'Serie: {0}' },
  es: { name: 'Caso de hoy', description: 'Un caso nuevo cada día, con tu racha.', play: 'Juega el caso de hoy', solved: 'Resuelto hoy', tomorrow: 'Mañana, un caso nuevo', streak: 'Racha: {0}' },
  fr: { name: 'Affaire du jour', description: 'Une nouvelle affaire chaque jour, avec ta série.', play: 'Joue l’affaire du jour', solved: 'Résolue aujourd’hui', tomorrow: 'Nouvelle affaire demain', streak: 'Série : {0}' },
  id: { name: 'Kasus hari ini', description: 'Kasus baru setiap hari, lengkap dengan runtunanmu.', play: 'Mainkan kasus hari ini', solved: 'Tuntas hari ini', tomorrow: 'Besok ada kasus baru', streak: 'Runtunan: {0}' },
  it: { name: 'Il caso di oggi', description: 'Un nuovo caso ogni giorno, con la tua serie.', play: 'Gioca il caso di oggi', solved: 'Risolto oggi', tomorrow: 'Domani un nuovo caso', streak: 'Serie: {0}' },
  pt: { name: 'Caso de hoje', description: 'Um caso novo todo dia, com sua sequência.', play: 'Jogue o caso de hoje', solved: 'Resolvido hoje', tomorrow: 'Amanhã tem caso novo', streak: 'Sequência: {0}' },
  tr: { name: 'Bugünün vakası', description: 'Her gün yeni bir vaka, serinle birlikte.', play: 'Bugünün vakasını oyna', solved: 'Bugün çözüldü', tomorrow: 'Yarın yeni bir vaka', streak: 'Seri: {0}' },
  vi: { name: 'Vụ án hôm nay', description: 'Mỗi ngày một vụ án mới, kèm chuỗi ngày của bạn.', play: 'Chơi vụ án hôm nay', solved: 'Đã giải hôm nay', tomorrow: 'Ngày mai có vụ án mới', streak: 'Chuỗi ngày: {0}' },
  ru: { name: 'Дело на сегодня', description: 'Каждый день новое дело и ваша серия.', play: 'Сыграйте сегодняшнее дело', solved: 'Раскрыто сегодня', tomorrow: 'Завтра новое дело', streak: 'Серия: {0}' },
  ar: { name: 'قضية اليوم', description: 'قضية جديدة كل يوم، مع سلسلتك.', play: 'العب قضية اليوم', solved: 'حُلّت اليوم', tomorrow: 'قضية جديدة غدًا', streak: 'أيام متتالية: {0}' },
  ur: { name: 'آج کا کیس', description: 'ہر دن ایک نیا کیس، آپ کے سلسلے کے ساتھ۔', play: 'آج کا کیس کھیلیں', solved: 'آج حل ہو گیا', tomorrow: 'کل نیا کیس آئے گا', streak: 'سلسلہ: {0}' },
  hi: { name: 'आज का केस', description: 'हर दिन एक नया केस, आपकी स्ट्रीक के साथ।', play: 'आज का केस खेलें', solved: 'आज सुलझ गया', tomorrow: 'कल नया केस आएगा', streak: 'स्ट्रीक: {0}' },
  mr: { name: 'आजचे प्रकरण', description: 'दररोज एक नवीन प्रकरण, तुमच्या सलग मालिकेसह.', play: 'आजचे प्रकरण खेळा', solved: 'आज सोडवले', tomorrow: 'उद्या नवीन प्रकरण', streak: 'सलग मालिका: {0}' },
  bn: { name: 'আজকের কেস', description: 'প্রতিদিন একটি নতুন কেস, আপনার ধারার সঙ্গে।', play: 'আজকের কেস খেলুন', solved: 'আজ সমাধান হয়েছে', tomorrow: 'আগামীকাল নতুন কেস', streak: 'ধারা: {0}' },
  te: { name: 'ఈరోజు కేసు', description: 'ప్రతి రోజు ఒక కొత్త కేసు, మీ స్ట్రీక్‌తో.', play: 'ఈరోజు కేసు ఆడండి', solved: 'ఈరోజు ఛేదించారు', tomorrow: 'రేపు కొత్త కేసు', streak: 'స్ట్రీక్: {0}' },
  zh: { name: '今日案件', description: '每天一个新案件，还有你的连胜。', play: '挑战今日案件', solved: '今日已破解', tomorrow: '明天有新案件', streak: '连胜：{0}' },
  ja: { name: '今日の事件', description: '毎日新しい事件。連続記録もひと目で。', play: '今日の事件をプレイ', solved: '今日は解決済み', tomorrow: '明日は新しい事件', streak: '連続記録：{0}' },
  ko: { name: '오늘의 사건', description: '매일 새로운 사건, 연속 기록과 함께.', play: '오늘의 사건 플레이하기', solved: '오늘 해결', tomorrow: '내일 새로운 사건', streak: '연속 기록: {0}' }
};
const KEYS = ['name', 'description', 'play', 'solved', 'tomorrow', 'streak'];

const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// De app in een lege omgeving, in één taal: dezelfde bestanden en dezelfde volgorde als index.html, zonder DOM.
function appIn(lang) {
  const ctx = { document: { addEventListener() {} }, setTimeout, clearTimeout, console };
  ctx.globalThis = ctx; ctx.window = ctx;
  vm.createContext(ctx);
  const run = f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  if (lang !== 'nl') run(`i18n/${lang}.js`);
  ['i18n.js', 'themes.js', 'progress.js', 'app.js'].forEach(run);
  return vm.runInContext(`(() => {
    I18n.lang = ${JSON.stringify(lang)};
    if (I18n.lang !== 'nl') { if (!I18n.pack()) throw new Error('build-widget: taalbestand ${lang} ontbreekt'); I18n.localizeData(); }
    return { App, Themes, I18n, DAILY_TITLES };
  })()`, ctx);
}

function build({ out = OUT, today = new Date(), back = BACK, ahead = AHEAD } = {}) {
  const nl = appIn('nl');
  const langs = nl.I18n.LANGS.map(l => l[0]);
  for (const code of langs) {
    const t = WIDGET_TEKST[code];
    if (!t) throw new Error(`build-widget: geen widgetteksten voor ${code}`);
    for (const k of KEYS) if (!t[k] || !String(t[k]).trim()) throw new Error(`build-widget: ${code}.${k} ontbreekt`);
    if (!t.streak.includes('{0}')) throw new Error(`build-widget: ${code}.streak mist {0}`);
  }
  const themes = nl.Themes.list(), titles = [...nl.DAILY_TITLES];
  if (new Set(titles).size !== titles.length) throw new Error('build-widget: dubbele dagtitels; de widget zoekt een titel op zijn plek');
  const worlds = themes.map(t => ({ id: t.id, icon: t.icon, accent: t.map.accent, ring: t.map.ring }));

  // de dagen, met de app zelf: twaalf uur 's middags, zodat een zomertijdwissel of tijdzone nooit een dag verschuift
  const first = new Date(today.getFullYear(), today.getMonth(), today.getDate() - back, 12);
  const dates = [], days = [];
  let rotation = true;
  for (let i = 0; i <= back + ahead; i++) {
    const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i, 12);
    const c = nl.App.dailyCase(d);
    const w = worlds.findIndex(x => x.id === c.theme), t = titles.indexOf(c.title);
    if (w < 0 || t < 0) throw new Error(`build-widget: dagzaak van ${dayKey(d)} niet gevonden (${c.theme}, ${c.title})`);
    const mod = (n, m) => ((n % m) + m) % m;
    if (w !== mod(c.dayNo, worlds.length) || t !== mod(c.dayNo, titles.length)) rotation = false;
    dates.push(d); days.push([w, t]);
  }

  // per taal: de vertaalde wereldnamen en titels, en een controle dat de app in die taal dezelfde zaak geeft
  const out_langs = {};
  for (const [code, , dir, locale] of nl.I18n.LANGS) {
    const L = code === 'nl' ? nl : appIn(code);
    const lt = [...L.DAILY_TITLES], lw = L.Themes.list().map(t => [t.title, t.short]);
    if (lt.length !== titles.length || lw.length !== worlds.length) throw new Error(`build-widget: ${code} heeft niet evenveel titels of werelden`);
    dates.forEach((d, i) => {
      const c = L.App.dailyCase(d);
      if (c.title !== lt[days[i][1]] || c.theme !== worlds[days[i][0]].id) throw new Error(`build-widget: ${code} geeft op ${dayKey(d)} een andere zaak`);
    });
    out_langs[code] = { locale, dir, worlds: lw, titles: lt, ui: WIDGET_TEKST[code] };
  }

  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
  // epoch: dag 1 van App.getDayNumber; rotation: elke dag hierboven is wereld[dag % 24] en titel[dag % 30], dus de
  // widget mag na de laatste dag zelf verder tellen. Verandert de app die regel, dan wordt dit false en toont de widget
  // na de laatste dag alleen "Speel de zaak van vandaag".
  const epoch = new Date(2026, 0, 1, 12);
  if (nl.App.getDayNumber(epoch) !== 1) throw new Error('build-widget: App.getDayNumber begint niet meer op 1 januari 2026');
  const data = { version, built: dayKey(today), epoch: dayKey(epoch), rotation, first: dayKey(first), days, worlds, langs: out_langs };
  if (out) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(data) + '\n');
  }
  return { data, out, last: dayKey(dates[dates.length - 1]) };
}

if (require.main === module) {
  const r = build({ out: process.argv[2] ? path.resolve(process.argv[2]) : OUT });
  console.log(`${path.relative(process.cwd(), r.out)}: ${r.data.days.length} dagen (${r.data.first} t/m ${r.last}), ${Object.keys(r.data.langs).length} talen, ${(fs.statSync(r.out).size / 1024).toFixed(0)} kB`);
}
module.exports = { build, WIDGET_TEKST, KEYS, OUT };

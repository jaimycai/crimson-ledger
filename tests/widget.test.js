// Widget "Zaak van vandaag" (iOS, November 2026). The widget cannot run the game's JavaScript, so build-widget.js
// computes the daily cases ahead with the app's own code into DailyCases.json. This test checks that file against the
// app independently (App.getDayNumber, THEMES, DAILY_TITLES and the language packs), the rotation the widget uses after
// the last day, that time zones do not shift a day, the fixed texts in all 20 languages (no word for murder), the
// wiring in the Xcode project, and the tap: crimsonledger://daily opens the daily case through App.bindWidget.
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const { execFileSync } = require('child_process');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(DIR, f), 'utf8');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { build, WIDGET_TEKST, KEYS, OUT } = require('../build-widget.js');
const { THEMES } = require('../themes.js');
const { DAILY_TITLES } = require('../progress.js');
const { I18n } = require('../i18n.js');
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const noon = key => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const addDays = (key, n) => { const d = noon(key); return dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12)); };

// App.getDayNumber straight from app.js, in a fresh context (not through build-widget.js)
const appCtx = { document: { addEventListener() {} }, setTimeout, clearTimeout, console };
appCtx.globalThis = appCtx;
vm.runInNewContext(read('app.js') + '\n;globalThis.__App = App;', appCtx);
const dayNumber = d => appCtx.__App.getDayNumber(d);
const pack = code => { const c = {}; c.globalThis = c; vm.runInNewContext(read(`i18n/${code}.js`), c); return c.LANG_PACKS[code]; };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'crimson-widget-'));
const file = path.join(tmp, 'DailyCases.json');
const today = new Date();
build({ out: file, today });
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// ── the days ──
const last = addDays(data.first, data.days.length - 1);
check(data.first === addDays(dayKey(today), -2), `starts two days back (${data.first}), for players a time zone behind`);
check(data.days.length >= 400 && last >= addDays(dayKey(today), 400), `${data.days.length} days, up to ${last} (400 days ahead)`);
check(data.version === JSON.parse(read('package.json')).version && data.built === dayKey(today), 'carries the version and the build date');
check(data.worlds.length === THEMES.length && data.worlds.every((w, i) => w.id === THEMES[i].id && w.icon === THEMES[i].icon
  && w.accent === THEMES[i].map.accent && w.ring === THEMES[i].map.ring), `all ${THEMES.length} worlds with icon and map colours, in THEMES order`);
let bad = [];
data.days.forEach(([w, t], i) => {
  const key = addDays(data.first, i), n = dayNumber(noon(key));
  if (THEMES[w].id !== THEMES[n % THEMES.length].id || DAILY_TITLES[t] !== DAILY_TITLES[n % DAILY_TITLES.length]) bad.push(key);
});
check(bad.length === 0, 'every day is the world and title of App.dailyCase that day (Themes.forDay, Progress.dailyTitle)' + (bad.length ? ': ' + bad.slice(0, 3) : ''));
const nov15 = data.days[Math.round((noon('2026-11-15') - noon(data.first)) / 864e5)];
if (nov15) check(data.worlds[nov15[0]].id === 'skihut' && data.langs.nl.titles[nov15[1]] === 'De lege stoel' && data.langs.en.titles[nov15[1]] === 'The Empty Chair',
  '15 November 2026: De Skihut, "De lege stoel" / "The Empty Chair" (as the app showed that day)');

// the widget's own count after the last day (DailyCaseStore.caseIndex): calendar days since the epoch + 1, then modulo
check(data.rotation === true && data.epoch === '2026-01-01', 'rotation confirmed by the build, epoch 1 January 2026');
const swiftDay = key => Math.round((noon(key) - noon(data.epoch)) / 864e5) + 1;
bad = [];
for (let i = 0; i < 365 * 6; i += 3) { const key = addDays(data.first, i); if (swiftDay(key) !== dayNumber(noon(key))) bad.push(key); }
check(bad.length === 0, 'the widget counts days like App.getDayNumber for six years, across every summer time change' + (bad.length ? ': ' + bad.slice(0, 3) : ''));
check(data.days.every(([w, t], i) => { const n = swiftDay(addDays(data.first, i)); return w === n % data.worlds.length && t === n % DAILY_TITLES.length; }),
  'the table follows that rotation exactly, so counting on after the last day gives the same cases');

// time zones: a build in Honolulu (UTC-10) or Kiritimati (UTC+14) gives the same case on the same date
for (const tz of ['Pacific/Honolulu', 'Pacific/Kiritimati', 'America/Sao_Paulo']) {
  const f = path.join(tmp, tz.replace('/', '-') + '.json');
  execFileSync(process.execPath, [path.join(DIR, 'build-widget.js'), f], { env: { ...process.env, TZ: tz } });
  const other = JSON.parse(fs.readFileSync(f, 'utf8'));
  let same = 0, diff = 0;
  other.days.forEach((d, i) => {
    const j = Math.round((noon(addDays(other.first, i)) - noon(data.first)) / 864e5);
    if (data.days[j]) { if (data.days[j][0] === d[0] && data.days[j][1] === d[1]) same++; else diff++; }
  });
  check(diff === 0 && same > 390, `built in ${tz}: the same case on every shared date (${same} days)`);
}

// ── languages ──
const codes = I18n.LANGS.map(l => l[0]);
check(codes.length === 20 && codes.every(c => data.langs[c]) && Object.keys(data.langs).length === 20, 'all 20 languages of the app');
bad = [];
for (const [code, , dir, locale] of I18n.LANGS) {
  const L = data.langs[code];
  if (L.dir !== dir || L.locale !== locale || L.titles.length !== DAILY_TITLES.length || L.worlds.length !== THEMES.length) { bad.push(code + ' shape'); continue; }
  if (code === 'nl') {
    if (L.titles.some((t, i) => t !== DAILY_TITLES[i]) || L.worlds.some((w, i) => w[0] !== THEMES[i].title || w[1] !== THEMES[i].short)) bad.push('nl');
    continue;
  }
  const P = pack(code).data;
  if (L.titles.some((t, i) => t !== P.daily[i])) bad.push(code + ' titles');
  if (L.worlds.some((w, i) => w[0] !== P.themes[THEMES[i].id].title || w[1] !== (P.themes[THEMES[i].id].short || THEMES[i].short))) bad.push(code + ' worlds');
}
check(bad.length === 0, 'per language the titles and world names of its language pack (data.daily, data.themes), with locale and direction' + (bad.length ? ': ' + bad.join(', ') : ''));

// ── fixed texts ──
check(codes.every(c => WIDGET_TEKST[c] && KEYS.every(k => typeof WIDGET_TEKST[c][k] === 'string' && WIDGET_TEKST[c][k].trim())), 'every fixed text in every language');
check(codes.every(c => WIDGET_TEKST[c].streak.includes('{0}')), 'the streak text has a place for the number');
check(codes.every(c => JSON.stringify(data.langs[c].ui) === JSON.stringify(WIDGET_TEKST[c])), 'the texts are in the data file as written');
check(WIDGET_TEKST.nl.play === 'Speel de zaak van vandaag' && WIDGET_TEKST.nl.name === 'Zaak van vandaag', 'Dutch: "Zaak van vandaag", "Speel de zaak van vandaag"');
bad = [];
for (const c of codes) if (c !== 'nl') for (const k of ['name', 'description', 'play', 'solved', 'tomorrow']) if (WIDGET_TEKST[c][k] === WIDGET_TEKST.nl[k]) bad.push(`${c}.${k}`);
check(bad.length === 0, 'every language has its own words (nothing left in Dutch)' + (bad.length ? ': ' + bad.join(', ') : ''));
// the app's words for "case" per language, so the widget speaks like the game
const caseWord = { nl: 'zaak', en: 'case', de: 'fall', es: 'caso', fr: 'affaire', id: 'kasus', it: 'caso', pt: 'caso', tr: 'vaka', vi: 'vụ án', ru: 'дел',
  ar: 'قضية', ur: 'کیس', hi: 'केस', mr: 'प्रकरण', bn: 'কেস', te: 'కేసు', zh: '案件', ja: '事件', ko: '사건' };
bad = codes.filter(c => !WIDGET_TEKST[c].play.toLowerCase().includes(caseWord[c]) || !WIDGET_TEKST[c].name.toLowerCase().includes(caseWord[c]));
check(bad.length === 0, 'name and call to play use the app\'s word for a case in each language' + (bad.length ? ': ' + bad.join(', ') : ''));
const MURDER = /moord|murder|mord|meurtre|assassin|asesin|homicid|homicíd|omicid|cinayet|pembunuh|giết|án mạng|убий|قتل|हत्या|क़त्ल|कत्ल|खून|খুন|হত্যা|హత్య|谋杀|凶杀|殺人|殺害|살인|kill|dood|tot\b|death|mort\b|muert/i;
bad = codes.flatMap(c => KEYS.filter(k => MURDER.test(WIDGET_TEKST[c][k])).map(k => `${c}.${k}`));
check(bad.length === 0, 'no word for murder or death in any fixed text' + (bad.length ? ': ' + bad.join(', ') : ''));

// ── wiring ──
const pbx = read('ios/App/App.xcodeproj/project.pbxproj');
const count = s => (pbx.match(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
check(count('DailyCaseWidget.swift in Sources') === 2 && count('WidgetSharedState.swift in Sources') === 4 && count('DailyWidgetPlugin.swift in Sources') === 2,
  'Xcode: the widget in the extension, the shared state in both targets, the plugin in the app');
check(count('DailyCases.json in Resources') === 2 && /path = DailyCases\.json; sourceTree = "<group>"/.test(pbx), 'Xcode: DailyCases.json is a resource of the extension');
check(count('CODE_SIGN_ENTITLEMENTS = App/App.entitlements;') === 2 && count('CODE_SIGN_ENTITLEMENTS = CrimsonLiveActivity/CrimsonLiveActivity.entitlements;') === 2,
  'Xcode: entitlements in Debug and Release of both targets');
check(!/PRODUCT_BUNDLE_IDENTIFIER = nl\.crimsonledger\.app\.[A-Za-z]+;/.test(pbx.replace(/nl\.crimsonledger\.app\.LiveActivity/g, '')), 'no new target or bundle ID: the widget lives in the Live Activity extension');
const group = f => (read(f).match(/<key>keychain-access-groups<\/key>\s*<array>\s*<string>([^<]+)<\/string>\s*<\/array>/) || [])[1];
check(group('ios/App/App/App.entitlements') === '$(AppIdentifierPrefix)nl.crimsonledger.shared' && group('ios/App/CrimsonLiveActivity/CrimsonLiveActivity.entitlements') === group('ios/App/App/App.entitlements'),
  'one shared keychain group in both targets, and nothing else (no App Group)');
check(!/application-groups/.test(read('ios/App/App/App.entitlements') + read('ios/App/CrimsonLiveActivity/CrimsonLiveActivity.entitlements')), 'no App Group entitlement');
check(/CaseLiveActivity\(\)\s*\n\s*DailyCaseWidget\(\)/.test(read('ios/App/CrimsonLiveActivity/CrimsonLiveActivity.swift')), 'the widget bundle carries the Live Activity and the widget');
const shared = read('ios/App/CrimsonLiveActivity/WidgetSharedState.swift'), plugin = read('ios/App/App/DailyWidgetPlugin.swift'), widget = read('ios/App/CrimsonLiveActivity/DailyCaseWidget.swift');
const info = read('ios/App/App/Info.plist');
check(/<key>CFBundleURLSchemes<\/key>\s*<array>\s*<string>crimsonledger<\/string>/.test(info) && shared.includes('URL(string: "crimsonledger://daily")'), 'the app opens crimsonledger://daily, the URL the widget uses');
check(/registerPluginInstance\(DailyWidgetPlugin\(\)\)/.test(read('ios/App/App/MainViewController.swift')) && /jsName = "DailyWidget"/.test(plugin), 'plugin DailyWidget registered with the bridge');
// the keys the plugin reads must be the keys the game writes
const js = read('app.js') + read('progress.js') + read('i18n.js');
const keys = [...plugin.matchAll(/get\("(crimson-[a-z-]+)"\)/g)].map(m => m[1]);
check(keys.length === 4 && keys.every(k => js.includes(`'${k}'`)), 'the plugin reads crimson-streak, crimson-freezes, crimson-board-daily-done and crimson-lang, which the game writes: ' + keys.join(', '));
check(/KEY: 'crimson-lang'/.test(read('i18n.js')) && /storageSet\('crimson-streak'/.test(read('app.js')), 'the language and the streak are stored with App.storageSet, so they reach Capacitor Preferences');
check(KEYS.every(k => widget.includes(`ui["${k}"]`)), 'the widget reads every fixed text by its key');
check(/\.supportedFamilies\(\[\.systemSmall, \.systemMedium, \.accessoryRectangular\]\)/.test(widget), 'small, medium and the Lock Screen');
check(/IPHONEOS_DEPLOYMENT_TARGET = 16\.1;/.test(pbx) && !/IPHONEOS_DEPLOYMENT_TARGET = 1[7-9]/.test(pbx) && /#available\(iOS 17\.0, \*\)/.test(widget), 'deployment targets unchanged; iOS 17 API only behind #available');
check(/require\('\.\/build-widget\.js'\)\.build\(\)/.test(read('build-www.js')), 'build-www.js (npm run build, npm run ios, release-ios.sh, Xcode Cloud) makes the data every time');
check(read('.gitignore').split('\n').includes('ios/App/CrimsonLiveActivity/DailyCases.json') && OUT.endsWith(path.join('CrimsonLiveActivity', 'DailyCases.json')), 'the data file is made by the build, not kept in git');

// ── the tap: App.bindWidget ──
function boot({ plugin = true, done = false } = {}) {
  let html = read('index.html');
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${read(src)}</script>`);
  const mock = `<script>
    window.__listeners = {}; window.__adds = 0;
    window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'ios', Plugins: {
      Preferences: { keys: async () => ({ keys: [] }), get: async () => ({ value: null }), set: async () => {}, remove: async () => {} },
      SplashScreen: { hide: async () => {} }${plugin ? `,
      DailyWidget: { addListener: (e, cb) => { window.__adds++; window.__listeners[e] = cb; return { remove: async () => {} }; } }` : ''}
    } };
  </script>`;
  const pre = `<script>localStorage.setItem("crimson-lang", "nl"); localStorage.setItem("crimson-board-tutorial-done", "1");${done ? ' localStorage.setItem("crimson-board-daily-done", new Date().toDateString());' : ''}</script>`;
  html = html.replace('<head>', () => '<head>' + pre).replace(/<link[^>]+>/g, '').replace('<body>', '<body>' + mock)
    .replace('</body>', '<script>window.App = App; window.Board = Board;</script></body>');
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
  return { window: dom.window, errors };
}

(async () => {
  {
    const { window, errors } = boot();
    await sleep(80);
    const { App, Board } = window;
    check(window.__adds === 1 && typeof window.__listeners.open === 'function', 'the game listens to DailyWidget "open" once at start');
    window.__listeners.open({ route: 'other' }); await sleep(100);
    check(App.currentScreen !== 'board', 'another route does nothing');
    window.__listeners.open({ route: 'daily' }); await sleep(300);
    check(App.currentScreen === 'board' && Board.isDaily === true && Board.theme.id === App.dailyCase().theme, 'a tap on the widget opens today\'s daily case (' + (Board.theme && Board.theme.id) + ')');
    const seed = Board.seed;
    window.__listeners.open({ route: 'daily' }); await sleep(200);
    check(App.currentScreen === 'board' && Board.seed === seed, 'during a case a second tap leaves the case alone');
    check(errors.length === 0, 'no JS errors: ' + errors.join(' | '));
  }
  {
    const { window, errors } = boot({ done: true });
    await sleep(80);
    window.__listeners.open({ route: 'daily' }); await sleep(300);
    check(window.App.currentScreen !== 'board', 'daily case already solved today: the app just opens');
    check(errors.length === 0, 'no JS errors (solved)');
  }
  {
    const { window, errors } = boot({ plugin: false });
    await sleep(80);
    check(window.__adds === 0 && errors.length === 0, 'without the plugin (web, Android, older app): nothing, no errors');
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(failures === 0 ? 'ALLE WIDGET CHECKS PASSED' : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})();

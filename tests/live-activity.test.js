// Live Activity (1.6): the game tells the native LiveActivity plugin when a tracked case starts (campaign, daily case,
// case of the week), when the number of placed suspects changes, and when the case ends (solved or left). Nothing for
// free play, the practice case, the web, or when the player turned it off. Also checks the Xcode project: the widget
// extension is embedded, carries the same version and build as the app, and the app declares Live Activities.
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── the Xcode project ──
const pbx = fs.readFileSync(path.join(DIR, 'ios/App/App.xcodeproj/project.pbxproj'), 'utf8');
const versions = [...pbx.matchAll(/MARKETING_VERSION = ([^;]+);/g)].map(m => m[1]);
const builds = [...pbx.matchAll(/CURRENT_PROJECT_VERSION = ([^;]+);/g)].map(m => m[1]);
check(versions.length === 4 && new Set(versions).size === 1, `app and extension share one version (${versions.join(', ')}); bump all four together`);
check(builds.length === 4 && new Set(builds).size === 1, `app and extension share one build number (${builds.join(', ')}); bump all four together`);
check(/PRODUCT_BUNDLE_IDENTIFIER = nl\.crimsonledger\.app\.LiveActivity;/.test(pbx) && /com\.apple\.product-type\.app-extension/.test(pbx)
  && /CrimsonLiveActivity\.appex in Embed Foundation Extensions/.test(pbx), 'widget extension nl.crimsonledger.app.LiveActivity is embedded in the app');
check(/LiveActivityPlugin\.swift in Sources/.test(pbx) && (pbx.match(/CaseActivityAttributes\.swift in Sources/g) || []).length === 4, 'plugin in the app, the shared attributes in both targets');
const appTargets = [...pbx.matchAll(/IPHONEOS_DEPLOYMENT_TARGET = ([\d.]+);/g)].map(m => m[1]);
check(appTargets.filter(v => v === '15.0').length === 4 && appTargets.filter(v => v === '16.1').length === 2, 'app stays on iOS 15.0, the extension asks 16.1');
check(/<key>NSSupportsLiveActivities<\/key>\s*<true\/>/.test(fs.readFileSync(path.join(DIR, 'ios/App/App/Info.plist'), 'utf8')), 'Info.plist of the app: NSSupportsLiveActivities');
check(/registerPluginInstance\(LiveActivityPlugin\(\)\)/.test(fs.readFileSync(path.join(DIR, 'ios/App/App/MainViewController.swift'), 'utf8')), 'plugin registered with the bridge');

// ── the game, in a webview with a fake native iOS ──
function boot({ platform = 'ios', setting = null, lang = 'nl' } = {}) {
  let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
  const mock = `<script>
    window.__calls = [];
    const rec = name => async o => { window.__calls.push([name, JSON.parse(JSON.stringify(o || {}))]); return name === 'start' ? { started: true } : {}; };
    window.Capacitor = { isNativePlatform: () => ${platform !== 'web'}, getPlatform: () => '${platform}', Plugins: {
      Preferences: { keys: async () => ({ keys: [] }), get: async () => ({ value: null }), set: async () => {}, remove: async () => {} },
      SplashScreen: { hide: async () => {} },
      LiveActivity: { isAvailable: async () => ({ available: true, enabled: true }), start: rec('start'), update: rec('update'), end: rec('end') }
    } };
  </script>`;
  const pre = `<script>localStorage.setItem("crimson-lang", "${lang}"); localStorage.setItem("crimson-board-tutorial-done", "1");${setting ? ` localStorage.setItem("crimson-live-activity", "${setting}");` : ''}</script>`
    + (lang === 'nl' ? '' : `<script>${fs.readFileSync(path.join(DIR, `i18n/${lang}.js`), 'utf8')}</script>`);
  html = html.replace('<head>', () => '<head>' + pre).replace(/<link[^>]+>/g, '').replace('<body>', '<body>' + mock)
    .replace('</body>', '<script>window.App = App; window.Board = Board; window.Progress = Progress; window.Campaign = Campaign;</script></body>');
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
  return { window: dom.window, document: dom.window.document, errors };
}
const solve = async (window, document) => {
  const { Board } = window, p = Board.puzzle;
  p.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after();
  document.getElementById('btn-board-check').click();
  document.querySelector(`.murder-opt[data-s="${p.murderer}"]`).click(); await sleep(1100);
};

(async () => {
  {
    const { window, document, errors } = boot();
    await sleep(80);
    const { App, Board, Progress } = window, calls = () => window.__calls, of = n => calls().filter(c => c[0] === n);
    check(!document.getElementById('settings-live').hidden && document.getElementById('chk-live').checked, 'settings: "Live Activity tijdens een zaak" shown on iOS and on by default');

    // daily case: start with the clock, translated texts, the wall-clock start of the clock
    document.getElementById('btn-board-daily').click(); await sleep(300);
    const s = of('start');
    check(s.length === 1 && s[0][1].kind === 'daily' && s[0][1].label === 'Vandaag' && s[0][1].title === Progress.dailyTitle(App.getDayNumber())
      && s[0][1].world === Board.theme.title && s[0][1].icon === Board.theme.icon, 'daily case: one start with label, title, world and icon: ' + JSON.stringify(s[0] && s[0][1]));
    const n = Board.placements.length;
    check(s[0][1].placed === 0 && s[0][1].total === n && s[0][1].progressText === `0 van ${n} verdachten geplaatst` && s[0][1].showClock === true
      && s[0][1].startedAt === Board.startTime && s[0][1].tapText === 'Tik om verder te spelen' && s[0][1].closedText === 'Zaak gesloten', 'start carries progress, clock start and the texts');
    check(s[0][1].id === Board.resumeId(), 'activity id is the case id');

    // placing a suspect: one update; an action without a change in placed suspects: nothing
    const p = Board.puzzle;
    Board.placements[0] = { x: p.solution[0].x, y: p.solution[0].y }; Board.after();
    Board.after();
    check(of('update').length === 1 && of('update')[0][1].placed === 1 && of('update')[0][1].progressText === `1 van ${n} verdachten geplaatst`, 'placing a suspect sends one update (1 van ' + n + ')');
    Board.placements[0] = null; Board.after();
    check(of('update').length === 2 && of('update')[1][1].placed === 0, 'taking it away again updates too');

    // leaving the case: ended at once
    document.getElementById('btn-board-back').click(); await sleep(300);
    check(of('end').length === 1 && of('end')[0][1].solved === false, 'back to the menu ends the activity without a final state');
    Board.after();
    check(of('update').length === 2, 'no updates after leaving');

    // campaign case: label "Zaak 1", starts with the board, and follows the clock after the briefing
    App.startCampaignCase('landhuis', 0, true); await sleep(350);
    const cs = of('start');
    check(cs.length === 2 && cs[1][1].kind === 'campaign' && cs[1][1].label === 'Zaak 1' && cs[1][1].title === 'Het glas Bordeaux' && cs[1][1].world === 'Het Landhuis', 'campaign case: "Zaak 1 · Het glas Bordeaux · Het Landhuis"');
    const beforeGo = of('update').length;
    await sleep(1600);
    document.getElementById('btn-briefing-go').click();
    if (document.getElementById('newclue-modal').classList.contains('active')) document.getElementById('btn-newclue-ok').click();
    check(of('update').length === beforeGo + 1 && Math.abs(of('update').slice(-1)[0][1].startedAt - Board.startTime) < 1500, '"Aan de slag" moves the clock start of the activity to the real start');

    // solved: end with the final state and the time
    await solve(window, document);
    const e = of('end').slice(-1)[0][1];
    check(of('end').length === 2 && e.solved === true && e.timeText === Board.formatTime(Board.elapsed) && e.resultText === `Opgelost in ${Board.formatTime(Board.elapsed)}`, 'solving ends with "Opgelost in ' + e.timeText + '"');

    // case of the week
    document.getElementById('btn-play-again').click(); await sleep(300);
    document.getElementById('btn-week').click(); await sleep(300);
    const ws = of('start').slice(-1)[0][1];
    check(of('start').length === 3 && ws.kind === 'weekly' && ws.label === `Week ${Board.weekly.week}` && ws.title === Board.weekly.title, 'case of the week: "Week ' + Board.weekly.week + '"');

    // the setting: off ends the open case, and no new case starts one
    document.getElementById('chk-live').checked = false; document.getElementById('chk-live').dispatchEvent(new window.Event('change'));
    check(of('end').length === 3 && of('end')[2][1].solved === false && App.storageGet('crimson-live-activity') === '0', 'turning it off ends the open activity and is remembered');
    document.getElementById('btn-board-back').click(); await sleep(300);
    document.getElementById('btn-board-daily').click(); await sleep(300);
    check(of('start').length === 3, 'turned off: a new case starts nothing');
    document.getElementById('chk-live').checked = true; document.getElementById('chk-live').dispatchEvent(new window.Event('change'));
    check(of('start').length === 4 && of('start')[3][1].kind === 'daily', 'turned on during a case: the open case starts at once');
    document.getElementById('btn-board-back').click(); await sleep(300);

    // free play and the practice case are not tracked
    const before = calls().length;
    document.getElementById('btn-board-start').click(); await sleep(300);
    Board.placements[0] = { x: Board.puzzle.solution[0].x, y: Board.puzzle.solution[0].y }; Board.after();
    document.getElementById('btn-board-back').click(); await sleep(300);
    document.getElementById('btn-tutorial').click(); await sleep(300);
    check(calls().length === before, 'free play and the practice case: no calls');

    // the quiet mode (clock off): the activity shows progress instead of the clock
    App.storageSet('crimson-timer-off', '1');
    document.getElementById('btn-board-tutorial-skip').click(); await sleep(300);
    document.getElementById('btn-board-daily').click(); await sleep(300);
    check(of('start').slice(-1)[0][1].showClock === false, 'clock off in the settings: showClock false');
    check(errors.length === 0, 'no JS errors: ' + errors.join(' | '));
  }
  {
    // another language: every text arrives translated
    const { window, document, errors } = boot({ lang: 'de' });
    await sleep(80);
    document.getElementById('btn-board-daily').click(); await sleep(300);
    const st = window.__calls.filter(c => c[0] === 'start').map(c => c[1])[0] || {}, n = window.Board.placements.length;
    check(st.label === 'Heute' && st.progressText === `0 von ${n} Verdächtigen platziert` && st.tapText === 'Tippen, um weiterzuspielen' && st.closedText === 'Fall abgeschlossen',
      'German: ' + [st.label, st.progressText, st.tapText, st.closedText].join(' | '));
    check(document.querySelector('#settings-live span').textContent.trim().endsWith('Live-Aktivität im Fall'), 'German: the setting is translated (the 🔍 becomes the search icon, see Icons.watch)');
    check(errors.length === 0, 'no JS errors (German): ' + errors.join(' | '));
  }
  {
    const { window, document, errors } = boot({ platform: 'web' });
    await sleep(80);
    document.getElementById('btn-board-daily').click(); await sleep(300);
    check(window.__calls.length === 0 && document.getElementById('settings-live').hidden, 'web: no Live Activity and no setting');
    check(errors.length === 0, 'no JS errors (web)');
  }
  {
    const { window, document } = boot({ platform: 'android' });
    await sleep(80);
    document.getElementById('btn-board-daily').click(); await sleep(300);
    check(window.__calls.length === 0 && document.getElementById('settings-live').hidden, 'Android: nothing either');
  }
  console.log(failures === 0 ? 'ALLE LIVE ACTIVITY CHECKS PASSED' : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})();

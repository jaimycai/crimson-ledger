// Game Center (Jaimy, 15 november 2026): the game reports achievements and two leaderboard scores to the native
// GameCenter plugin, each achievement once, with the same rules as the medals in progress.js. Nothing on the web,
// on Android or without a sign-in. Also checks the Xcode project (plugin, entitlement), the loading of gamecenter.js
// and the App Store Connect spec in store/gamecenter/ (every id in the app has texts in all 23 store languages,
// no word for murder, lengths Apple accepts).
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const read = f => fs.readFileSync(path.join(DIR, f), 'utf8');

// ── native side and loading ──
const pbx = read('ios/App/App.xcodeproj/project.pbxproj');
check(/GameCenterPlugin\.swift in Sources/.test(pbx) && (pbx.match(/CODE_SIGN_ENTITLEMENTS = App\/App\.entitlements;/g) || []).length === 2, 'Xcode: plugin in the app target, entitlements in Debug and Release');
check(/<key>com\.apple\.developer\.game-center<\/key>\s*<true\/>/.test(read('ios/App/App/App.entitlements')), 'App.entitlements: com.apple.developer.game-center');
check(/registerPluginInstance\(GameCenterPlugin\(\)\)/.test(read('ios/App/App/MainViewController.swift')), 'plugin registered with the bridge');
const swift = read('ios/App/App/GameCenterPlugin.swift');
check(['authenticate', 'reportAchievement', 'submitScore', 'showDashboard'].every(m => swift.includes(`name: "${m}"`)) && /jsName = "GameCenter"/.test(swift), 'plugin methods: authenticate, reportAchievement, submitScore, showDashboard');
check(/<script src="gamecenter\.js"><\/script>/.test(read('index.html')) && /'gamecenter\.js'/.test(read('build-www.js')) && /'\.\/gamecenter\.js'/.test(read('sw.js')), 'gamecenter.js in index.html, build-www.js and the service worker');

// ── the list of achievements ──
global.App = undefined;
const { GameCenter } = require(path.join(DIR, 'gamecenter.js'));
const { Progress } = require(path.join(DIR, 'progress.js'));
const { THEMES } = require(path.join(DIR, 'themes.js'));
const list = GameCenter.list(), ids = list.map(a => a.id);
check(list.length === 36 && new Set(ids).size === 36, `36 achievements, unique ids (${list.length})`);
check(ids.every(id => /^[A-Za-z0-9_.]{1,100}$/.test(id)), 'ids: letters, digits, _ and . only, at most 100 characters');
check(JSON.stringify(GameCenter.WORLDS) === JSON.stringify(THEMES.map(t => t.id)), 'a world achievement for each of the 24 worlds, in the order of themes.js');
const medalIds = new Set(Progress.MEDALS.map(m => m.id));
check(list.filter(a => a.medal).every(a => medalIds.has(a.medal)), 'every mirrored medal exists in progress.js');
// the rule of a mirrored achievement is the rule of its medal
const samples = [{}, { solved: 1, streak: 3, partsDone: 1, worldsDone: ['landhuis'], weekDone: true }, { solved: 0, streak: 2, partsDone: 0, worldsDone: [] },
  { solved: 12, streak: 7, worldsDone: THEMES.map(t => t.id), weekDone: false }, { streak: 6, worldsDone: ['hanok', 'piraten'] }];
check(list.filter(a => a.medal).every(a => { const m = Progress.MEDALS.find(x => x.id === a.medal); return samples.every(c => !!a.test(c) === (() => { try { return !!m.test(c); } catch (e) { return false; } })()); }),
  'mirrored achievements use the same rule as their medal');
const keysFor = c => list.filter(a => { try { return a.test(c); } catch (e) { return false; } }).map(a => a.key);
check(JSON.stringify(keysFor({ solved: 10, threeStars: 1, masterSolved: 1, streak: 30, worldsDone: [] })) === JSON.stringify(['first_case', 'first_three_stars', 'streak_3', 'streak_7', 'streak_30', 'solved_10', 'first_master']),
  'counters: 10 solved, first ★★★, first master case, 30 days in a row');
check(keysFor({ solved: 500 }).filter(k => k.startsWith('solved_')).length === 4, '500 solved: all four case counters');
check(GameCenter.BOARDS.points === 'crimson.points' && GameCenter.BOARDS.daily_time === 'crimson.daily_time', 'leaderboards crimson.points and crimson.daily_time');

// ── hardening: only known ids reach GameKit, scores stay in the declared ranges ──
const swiftIds = [...new Set(swift.match(/"crimson\.[a-z0-9_.]+"/g).map(x => x.slice(1, -1)))].sort();
check(JSON.stringify(swiftIds) === JSON.stringify([...ids, ...Object.values(GameCenter.BOARDS)].sort()), `Swift: the hard-coded ids are exactly the 36 achievements and 2 leaderboards (${swiftIds.length})`);
check(/achievementIDs\.contains\(id\) else \{ call\.reject/.test(swift) && /leaderboardRanges\[id\] else \{ call\.reject/.test(swift), 'Swift: an unknown achievement or leaderboard id is rejected');
check(/"crimson\.points": 0\.\.\.100_000_000/.test(swift) && /"crimson\.daily_time": 1\.\.\.86_400/.test(swift) && /min\(Double\(range\.upperBound\), raw\)/.test(swift) && /raw\.isFinite, raw >= Double\(range\.lowerBound\)/.test(swift)
  && /percent\.isFinite \? min\(100, max\(0, percent\)\)/.test(swift), 'Swift: value clamped to the range (too high lowered, too low or not finite refused), percent to 0..100');
const C = (b, v) => GameCenter.clampScore(b, v);
check(C('points', NaN) === null && C('points', Infinity) === null && C('points', -Infinity) === null && C('points', '95') === null && C('points', undefined) === null,
  'score: NaN, infinite, text and missing values are dropped');
check(C('points', 12.6) === 13 && C('points', 2e9) === 100000000 && C('points', -5) === null && C('points', 0) === null, 'points: rounded, lowered to 100 000 000, negative and 0 dropped');
check(C('daily_time', 95.5) === 96 && C('daily_time', 90000) === 86400 && C('daily_time', 0) === null && C('daily_time', 0.4) === null && C('daily_time', -3) === null,
  'daily time: rounded, lowered to 86 400 s, below 1 s dropped (not raised to a record)');
check(C('bogus', 5) === null, 'unknown leaderboard: dropped');

// ── no-op outside the iOS app (node itself has no window) ──
(async () => {
  check(GameCenter.native() === null && await GameCenter.achieve('first_case') === false && await GameCenter.score('points', 10) === false, 'node: no plugin, achieve and score do nothing');

  // ── the App Store Connect spec ──
  const { spec, check: specCheck } = require(path.join(DIR, 'store/gamecenter/spec.js'));
  const s = spec();
  check(JSON.stringify(s.achievements.map(a => a.id)) === JSON.stringify(ids), 'spec: the same 36 ids in the same order as gamecenter.js');
  check(JSON.stringify(s.leaderboards.map(l => l.id).sort()) === JSON.stringify(Object.values(GameCenter.BOARDS).sort()), 'spec: the two leaderboards of gamecenter.js');
  check(s.leaderboards.every(l => JSON.stringify([l.scoreRangeStart, l.scoreRangeEnd]) === JSON.stringify(GameCenter.RANGES[l.key])), 'spec: the score ranges in App Store Connect are the ranges the app clamps to');
  const problems = specCheck(s);
  check(problems.length === 0, 'spec: texts in all 23 store languages, lengths, points, no murder words' + (problems.length ? ': ' + problems.slice(0, 8).join(' | ') : ''));

  // ── the game in a webview with a fake native iOS ──
  function boot({ platform = 'ios', authed = true, pre = '', lang = 'nl', throwing = false } = {}) {
    let html = read('index.html');
    html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${read(src)}</script>`);
    const mock = `<script>
      window.__gc = { calls: [], authed: ${authed}, listeners: {}, throwing: ${throwing} };
      const gc = window.__gc;
      window.Capacitor = { isNativePlatform: () => ${platform !== 'web'}, getPlatform: () => '${platform}', Plugins: {
        Preferences: { keys: async () => ({ keys: [] }), get: async () => ({ value: null }), set: async () => {}, remove: async () => {} },
        SplashScreen: { hide: async () => {} },
        GameCenter: {
          authenticate: async o => { gc.calls.push(['authenticate', o]); return { authenticated: gc.authed }; },
          reportAchievement: o => { gc.calls.push(['achievement', o]); if (gc.throwing) throw new Error('bridge'); return Promise.resolve({ ok: gc.authed }); },
          submitScore: o => { gc.calls.push(['score', o]); if (gc.throwing) throw new Error('bridge'); return Promise.resolve({ ok: gc.authed }); },
          showDashboard: async () => { gc.calls.push(['dashboard']); return { shown: true }; },
          addListener: (ev, fn) => { gc.listeners[ev] = fn; return { remove() {} }; }
        }
      } };
    </script>`;
    const head = `<script>localStorage.setItem("crimson-lang", "${lang}"); localStorage.setItem("crimson-board-tutorial-done", "1");${pre}</script>`
      + (lang === 'nl' ? '' : `<script>${read(`i18n/${lang}.js`)}</script>`);
    html = html.replace('<head>', () => '<head>' + head).replace(/<link[^>]+>/g, '').replace('<body>', '<body>' + mock)
      .replace('</body>', '<script>window.App = App; window.Board = Board; window.Progress = Progress; window.GameCenter = GameCenter;</script></body>');
    const errors = [];
    const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
    const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
    const w = dom.window, calls = n => w.__gc.calls.filter(c => c[0] === n).map(c => c[1]);
    return { window: w, document: w.document, errors, calls };
  }
  const solve = async (window, document, secs = 95) => {
    const { Board } = window, p = Board.puzzle;
    Board.startTime = Date.now() - secs * 1000; Board.elapsed = secs;   // as if the case took this long
    p.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after();
    document.getElementById('btn-board-check').click();
    document.querySelector(`.murder-opt[data-s="${p.murderer}"]`).click(); await sleep(1100);
  };
  const back = async document => { const b = document.getElementById('btn-play-again'); if (b) b.click(); await sleep(200); };

  {
    // signed in: the first daily case
    const { window, document, errors, calls } = boot();
    await sleep(120);
    const { Board, Progress: P, App } = window;
    check(calls('authenticate').length === 1 && calls('authenticate')[0].present === true && App.storageGet('crimson-gc-asked') === '1', 'start: one silent authenticate; Apple\'s sign-in sheet may show once (after the practice case)');
    check(!document.getElementById('settings-gc').hidden, 'signed in: the Game Center row shows in Settings');
    document.getElementById('btn-gamecenter').click(); await sleep(20);
    check(calls('dashboard').length === 1, 'the row opens the Game Center dashboard');
    check(calls('achievement').length === 0 && calls('score').length === 0, 'nothing earned yet: no achievements, no score (0 points is not a score)');

    document.getElementById('btn-board-daily').click(); await sleep(300);
    await solve(window, document); await sleep(50);
    const a1 = calls('achievement');
    check(a1.length === 1 && a1[0].id === 'crimson.first_case' && a1[0].percent === 100 && a1[0].banner === false, 'first case: crimson.first_case at 100 %, no Apple banner (the game shows its own medal)');
    const sc = calls('score');
    const pts = sc.filter(x => x.leaderboardId === 'crimson.points'), day = sc.filter(x => x.leaderboardId === 'crimson.daily_time');
    check(pts.length === 1 && pts[0].value === P.points() && P.points() > 0, `total points to crimson.points (${P.points()})`);
    check(day.length === 1 && day[0].value === Math.round(Board.elapsed) && day[0].value > 0, `daily case time to crimson.daily_time (${day[0] && day[0].value} s)`);
    check(JSON.parse(App.storageGet('crimson-gc-sent')).join() === 'first_case', 'remembered as sent');

    // a second case: first_case not again, no daily time (free play), points again
    await back(document);
    document.getElementById('btn-board-start').click(); await sleep(300);
    await solve(window, document); await sleep(50);
    check(calls('achievement').length === 1, 'second case: first_case is not sent again');
    check(calls('score').filter(x => x.leaderboardId === 'crimson.daily_time').length === 1, 'free play: no daily time');
    check(calls('score').filter(x => x.leaderboardId === 'crimson.points').slice(-1)[0].value === P.points(), 'points again after the second case');

    // the tenth case: crimson.solved_10, with Apple's banner (no medal for it)
    const st = JSON.parse(App.storageGet('crimson-board-stats')); st.solved = 9; App.storageSet('crimson-board-stats', JSON.stringify(st));
    await back(document);
    document.getElementById('btn-board-start').click(); await sleep(300);
    await solve(window, document); await sleep(50);
    const a10 = calls('achievement').filter(x => x.id === 'crimson.solved_10');
    check(a10.length === 1 && a10[0].banner === true && calls('achievement').length === 2, 'tenth case: crimson.solved_10 once, with Apple\'s banner');

    // bad ids and values never reach the bridge; values out of range arrive clamped
    const GC = window.GameCenter, nA = calls('achievement').length, nS = calls('score').length;
    const r = await Promise.all([GC.achieve('bogus'), GC.achieve(null), GC.achieve('crimson.first_case'), GC.achieve('__proto__'),
      GC.score('bogus', 5), GC.score('points', NaN), GC.score('points', Infinity), GC.score('daily_time', -1), GC.score('daily_time', 0)]);
    check(r.every(x => x === false) && calls('achievement').length === nA && calls('score').length === nS, 'unknown ids, NaN, infinite and too-low values: nothing sent to the plugin');
    await GC.score('points', 2e9); await GC.score('daily_time', 99999);
    const last = calls('score').slice(-2);
    check(last[0].leaderboardId === 'crimson.points' && last[0].value === 100000000 && last[1].leaderboardId === 'crimson.daily_time' && last[1].value === 86400, 'too-high values arrive lowered to the top of the range');

    // the stored daily time for a later sign-in: dropped when stale, not a whole number in range, or today's case is not solved
    const today = window.Progress.dayKey(), solvedToday = window.App.storageGet('crimson-board-daily-done');
    const replay = (entry, done) => {
      window.App.storageSet('crimson-gc-daily', typeof entry === 'string' ? entry : JSON.stringify(entry));
      window.App.storageSet('crimson-board-daily-done', done ? solvedToday : '');
      const got = GC.pendingDaily();
      return { got, kept: !!window.App.storageGet('crimson-gc-daily') };
    };
    const bad = [[{ day: '2026-01-01', value: 95 }, true, 'a stale day'], [{ day: today, value: 12.5 }, true, 'a fraction'], [{ day: today, value: '95' }, true, 'text'],
      [{ day: today, value: 0 }, true, '0 s'], [{ day: today, value: 999999 }, true, 'too long'], [{ day: today, value: 95 }, false, 'today not solved'], ['{nope', true, 'broken JSON'], [null, true, 'null']];
    const dropped = bad.filter(([e, done]) => { const x = replay(e, done); return x.got === null && !x.kept; }).map(b => b[2]);
    check(dropped.length === bad.length, 'stored daily time dropped for: ' + dropped.join(', '));
    const good = replay({ day: today, value: 95 }, true);
    check(good.got && good.got.value === 95 && good.kept, 'a valid stored daily time of today is kept for the sign-in');
    window.App.storageSet('crimson-gc-daily', JSON.stringify({ day: '2026-01-01', value: 3 }));
    const nDay = calls('score').filter(x => x.leaderboardId === 'crimson.daily_time').length;
    GC.catchUp(); await sleep(20);
    check(calls('score').filter(x => x.leaderboardId === 'crimson.daily_time').length === nDay && !window.App.storageGet('crimson-gc-daily'), 'a stale stored time is not sent at the sign-in, and is removed');
    window.App.storageSet('crimson-board-daily-done', solvedToday);
    check(errors.length === 0, 'no JS errors: ' + errors.join(' | '));
  }
  {
    // medals and progress from before Game Center: reported at the sign-in, quietly, each once (also when the auth event follows)
    const medals = { landhuis: '2026-10-01', weekzaak: '2026-10-02', 'drie-dagen': '2026-10-03', 'eerste-zaak': '2026-10-01' };
    const pre = ` localStorage.setItem("crimson-medals", ${JSON.stringify(JSON.stringify(medals))}); localStorage.setItem("crimson-points", "7300");`
      + ` localStorage.setItem("crimson-gc-asked", "1"); localStorage.setItem("crimson-board-stats", ${JSON.stringify(JSON.stringify({ solved: 57, master: 2 }))});`;
    const { window, errors, calls } = boot({ pre });
    await sleep(120);
    window.__gc.listeners.auth({ authenticated: true }); await sleep(30);
    const got = calls('achievement').map(a => a.id).sort();
    const want = ['crimson.case_of_week', 'crimson.first_case', 'crimson.first_master', 'crimson.solved_10', 'crimson.solved_50', 'crimson.streak_3', 'crimson.world.landhuis'];
    check(JSON.stringify(got) === JSON.stringify(want), 'sign-in: earlier medals and counters become achievements: ' + got.join(', '));
    check(calls('achievement').every(a => a.banner === false), 'catch-up without banners');
    check(calls('authenticate')[0].present === false, 'Apple\'s sign-in sheet was offered before: not again');
    check(calls('score').filter(x => x.leaderboardId === 'crimson.points').length === 1 && calls('score')[0].value === 7300, 'points once (7300), not again for the auth event');
    check(errors.length === 0, 'no JS errors (catch-up)');
  }
  {
    // not signed in: the row stays hidden, nothing is reported; a sign-in later in the session sends it all, with today's daily time
    const { window, document, errors, calls } = boot({ authed: false, pre: ' localStorage.removeItem("crimson-board-tutorial-done");' });
    await sleep(120);
    check(calls('authenticate')[0].present === false && !window.App.storageGet('crimson-gc-asked'), 'first session: no sign-in sheet (the practice case comes first)');
    check(document.getElementById('settings-gc').hidden, 'not signed in: no Game Center row');
    window.App.storageSet('crimson-board-tutorial-done', '1');
    document.getElementById('btn-board-daily').click(); await sleep(300);
    await solve(window, document); await sleep(50);
    check(calls('achievement').length === 0 && calls('score').length === 0, 'not signed in: no achievements, no scores');
    const t = Math.round(window.Board.elapsed);
    window.__gc.authed = true;
    window.__gc.listeners.auth({ authenticated: true }); await sleep(30);
    check(calls('achievement').map(a => a.id).join() === 'crimson.first_case' && !document.getElementById('settings-gc').hidden, 'signed in later: the first case arrives, the row appears');
    const d = calls('score').filter(x => x.leaderboardId === 'crimson.daily_time');
    check(d.length === 1 && d[0].value === t && !window.App.storageGet('crimson-gc-daily'), `today's daily time arrives after all (${t} s)`);
    check(errors.length === 0, 'no JS errors (not signed in)');
  }
  {
    // a bridge that throws: the case still ends on the results screen, nothing is remembered as sent
    const { window, document, errors, calls } = boot({ throwing: true });
    await sleep(120);
    document.getElementById('btn-board-daily').click(); await sleep(300);
    await solve(window, document); await sleep(50);
    check(calls('achievement').length === 1 && window.App.currentScreen === 'results' && !window.App.storageGet('crimson-gc-sent'), 'a failing plugin never breaks a solved case');
    check(errors.length === 0, 'no JS errors (failing plugin): ' + errors.join(' | '));
  }
  for (const platform of ['web', 'android']) {
    const { window, document, errors } = boot({ platform });
    await sleep(120);
    document.getElementById('btn-board-daily').click(); await sleep(300);
    await solve(window, document); await sleep(50);
    check(window.__gc.calls.length === 0 && document.getElementById('settings-gc').hidden && await window.GameCenter.achieve('first_case') === false, `${platform}: no calls, no row, achieve does nothing`);
    check(errors.length === 0, `no JS errors (${platform})`);
  }
  {
    const { document } = boot({ lang: 'de' });
    await sleep(120);
    check(document.getElementById('btn-gamecenter').textContent.trim() === 'Öffnen' && document.querySelector('#settings-gc span').textContent.includes('Game Center'), 'German: "Öffnen", Apple\'s name stays "Game Center"');
  }
  console.log(failures === 0 ? 'ALLE GAME CENTER CHECKS PASSED' : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})();

// iOS-opslag: een lege webview wordt hersteld uit de native opslag (Preferences), elke
// crimson-sleutel wordt gespiegeld, wissen wist beide, en de native splash wordt verborgen.
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
// nep-Capacitor met Preferences (native opslag) en SplashScreen, vóór de app-scripts
const mock = `<script>
  window.__native = { 'crimson-board-stats': '{"solved":5,"clean":2}', 'crimson-streak': '{"count":2,"lastDate":"x"}', 'crimson-board-tutorial-done': '1' };
  window.__splashHidden = 0;
  window.__sent = []; window.fetch = (u, o) => { window.__sent.push(JSON.parse(o.body)); return Promise.resolve({ ok: true }); };
  window.Capacitor = { isNativePlatform: () => true, Plugins: {
    Preferences: {
      keys: async () => ({ keys: Object.keys(window.__native) }),
      get: async ({ key }) => ({ value: key in window.__native ? window.__native[key] : null }),
      set: async ({ key, value }) => { window.__native[key] = value; },
      remove: async ({ key }) => { delete window.__native[key]; }
    },
    SplashScreen: { hide: async () => { window.__splashHidden++; } },
    InAppReview: { requestReview: async () => {} },
    Share: { share: async ({ text }) => { window.__shared = (window.__shared || []).concat(text); if (window.__shareCancel) throw new Error('Share canceled'); return { activityType: window.__shareTarget || '' }; } }
  } };
</script>`;
html = html.replace('<head>', '<head><script>Object.defineProperty(navigator, "language", { value: "nl-NL", configurable: true });</script>').replace(/<link[^>]+>/g, '').replace('<body>', '<body>' + mock).replace('</body>', '<script>window.App = App; window.Board = Board; window.Store = Store;</script></body>');
const errors = [];
const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
const { window } = dom, { document } = window;
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
(async () => {
  await sleep(120);
  const { App } = window;
  check(window.localStorage.getItem('crimson-board-stats') === '{"solved":5,"clean":2}' && window.localStorage.getItem('crimson-streak').includes('"count":2'), 'lege webview hersteld uit de native opslag');
  check(document.getElementById('board-stats').textContent.includes('5 zaken opgelost') && document.getElementById('streak-count').textContent === '2', 'thuisscherm toont de herstelde voortgang: ' + document.getElementById('board-stats').textContent);
  App.storageSet('crimson-theme', 'hotel'); await sleep(10);
  check(window.__native['crimson-theme'] === 'hotel' && window.localStorage.getItem('crimson-theme') === 'hotel', 'nieuwe sleutel staat in localStorage én native');
  App.storageSet('niet-van-ons', '1'); await sleep(10);
  check(!('niet-van-ons' in window.__native), 'alleen crimson-sleutels worden gespiegeld');
  await sleep(1000);
  check(document.getElementById('screen-splash').classList.contains('loaded') && document.getElementById('btn-splash-start').textContent === 'Verder' && window.__splashHidden === 1, 'na het laden: knop "Verder" (er is voortgang) en de native splash is verborgen');
  // beoordeling vragen: drie hoogtepunten, elk hooguit één keer, vanaf vijf zaken en alleen na twee of drie sterren
  const moments = () => JSON.parse(window.localStorage.getItem('crimson-review-moments') || '[]');
  App.maybeAskReview({ stars: 1 });
  check(moments().length === 0, 'zaak met één ster: niet gevraagd');
  // 1.5: from case 3 a three-star solve qualifies; below five cases two stars do not
  App.storageSet('crimson-board-stats', '{"solved":2,"clean":2}');
  App.maybeAskReview({ stars: 3 });
  check(moments().length === 0, 'twee zaken opgelost: nog niet gevraagd');
  App.storageSet('crimson-board-stats', '{"solved":4,"clean":2}');
  App.maybeAskReview({ stars: 2 });
  check(moments().length === 0, 'vier zaken en twee sterren: nog niet gevraagd');
  App.storageSet('crimson-board-stats', '{"solved":5,"clean":2}');
  App.maybeAskReview({ stars: 2 });
  check(moments().join() === 'solved', 'vijf zaken en twee sterren: gevraagd (' + moments().join() + ')');
  App.maybeAskReview({ stars: 3 });
  check(moments().join() === 'solved', 'nog een zaak opgelost: niet opnieuw gevraagd');
  App.maybeAskReview({ weeklyClean: true, stars: 2 });
  check(moments().join() === 'solved,weekclean', 'zaak van de week zonder hint: gevraagd');
  App.streak.count = 7; App.maybeAskReview({ stars: 1 });
  check(moments().join() === 'solved,weekclean', 'zeven dagen op rij maar één ster: niet gevraagd');
  App.maybeAskReview({ stars: 3 });
  check(moments().join() === 'solved,weekclean,streak7', 'zeven dagen op rij: gevraagd');
  App.maybeAskReview({ weeklyClean: true, stars: 3 });
  check(moments().length === 3, 'daarna niet meer');
  // delen: in de app opent het deelvenster (niet eerst het klembord); annuleren geeft geen melding
  App.shareAny('Zaak 7 gesloten'); await sleep(30);
  check((window.__shared || []).join() === 'Zaak 7 gesloten', 'delen opent het deelvenster van de app');
  window.__shareCancel = true; App.shareAny('nog eens'); await sleep(30);
  check(!document.getElementById('toast').classList.contains('show') || !/Delen wordt niet/.test(document.getElementById('toast-text').textContent), 'deelvenster gesloten: geen foutmelding');
  window.__shareCancel = false;
  // 1.6: share_done only when the sheet really shared (not on cancel), with the kind of app it went to
  const sent = e => window.__sent.filter(x => x.e === e);
  check(sent('share').length === 2 && sent('share_done').length === 1, 'tik op delen telt als share, alleen echt delen als share_done (annuleren niet)');
  window.__shareTarget = 'net.whatsapp.WhatsApp.ShareExtension'; App.shareAny('Zaak 8'); await sleep(30);
  window.__shareTarget = 'com.apple.UIKit.activity.Message'; App.shareAny('Zaak 9'); await sleep(30);
  check(sent('share_done').map(x => x.a).join() === ',whatsapp,messages', 'share_done met het soort app: ' + sent('share_done').map(x => x.a).join());
  // 1.6: buy_tap and buy_cancel next to purchase (mock store: 'cancel' closes the sheet without buying)
  App.storageSet('crimson-store-mock', 'cancel');
  await App.buy(window.Store.IDS.pass);
  App.storageSet('crimson-store-mock', '1');
  await App.buy(window.Store.worldId('hotel'));
  const buys = window.__sent.filter(x => /^buy_|^purchase$/.test(x.e)).map(x => `${x.e}:${x.a}`).join(' ');
  check(buys === 'buy_tap:pass buy_cancel:pass buy_tap:world.hotel purchase:world.hotel' && !window.Store.hasPass() && window.Store.ownsWorld('hotel'), 'aankooptellers: ' + buys);
  App.resetProgress(); await sleep(20);
  check(Object.keys(window.__native).filter(k => k.startsWith('crimson-')).length === 0 && !window.localStorage.getItem('crimson-board-stats'), 'wissen wist localStorage én native opslag');
  check(errors.length === 0, 'geen JS-fouten: ' + errors.join(' | '));
  console.log(failures === 0 ? 'ALLE NATIVE CHECKS PASSED' : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})();

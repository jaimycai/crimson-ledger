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
  window.Capacitor = { isNativePlatform: () => true, Plugins: {
    Preferences: {
      keys: async () => ({ keys: Object.keys(window.__native) }),
      get: async ({ key }) => ({ value: key in window.__native ? window.__native[key] : null }),
      set: async ({ key, value }) => { window.__native[key] = value; },
      remove: async ({ key }) => { delete window.__native[key]; }
    },
    SplashScreen: { hide: async () => { window.__splashHidden++; } }
  } };
</script>`;
html = html.replace(/<link[^>]+>/g, '').replace('<body>', '<body>' + mock).replace('</body>', '<script>window.App = App; window.Board = Board;</script></body>');
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
  App.resetProgress(); await sleep(20);
  check(Object.keys(window.__native).filter(k => k.startsWith('crimson-')).length === 0 && !window.localStorage.getItem('crimson-board-stats'), 'wissen wist localStorage én native opslag');
  check(errors.length === 0, 'geen JS-fouten: ' + errors.join(' | '));
  console.log(failures === 0 ? 'ALLE NATIVE CHECKS PASSED' : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})();

// Rive (1.6): de levende streakvlam en Van Dam in de briefing (rive-art.js).
// 1. Offline: de runtime, de wasm en de .riv-bestanden staan in de app (vendor/rive, assets/rive) en de lader vraagt
//    alleen die paden op, met de CDN-terugval uit. 2. Terugval in jsdom: geen Rive = het icoon en de foto zoals in 1.5,
//    zonder fouten, ook als de runtime wel geprobeerd wordt maar niet laadt.
const fs = require('fs'), path = require('path'), vm = require('vm');
const { JSDOM, VirtualConsole } = require('jsdom');
const DIR = path.join(__dirname, '..');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const read = f => fs.readFileSync(path.join(DIR, f));

// ── 1. bestanden en paden ──
{
  const js = read('vendor/rive/rive.js').toString('utf8'), wasm = read('vendor/rive/rive.wasm'), lic = read('vendor/rive/LICENSE').toString('utf8');
  check(js.length > 100000 && /RuntimeLoader/.test(js), `runtime: vendor/rive/rive.js (${(js.length / 1024).toFixed(0)} KB)`);
  check(wasm.slice(0, 4).equals(Buffer.from([0, 0x61, 0x73, 0x6d])), `runtime: vendor/rive/rive.wasm is wasm (${(wasm.length / 1024).toFixed(0)} KB)`);
  check(/MIT License/.test(lic) && /Rive/.test(lic), 'runtime: MIT-licentie van Rive staat ernaast');
  for (const f of ['vlam.riv', 'vandam.riv']) {
    const b = read('assets/rive/' + f);
    check(b.slice(0, 4).toString() === 'RIVE', `bestand: assets/rive/${f} (${(b.length / 1024).toFixed(0)} KB)`);
    check(!/https?:\/\//.test(b.toString('latin1')), `bestand: ${f} verwijst nergens naar buiten`);
  }
  const src = read('rive-art.js').toString('utf8');
  check(!/https?:\/\//.test(src.replace(/\/\/[^\n]*/g, '')), 'rive-art.js: geen enkele URL in de code');
  check(/setWasmFallbackUrl\(null\)/.test(src) && /enableRiveAssetCDN:\s*false/.test(src), 'rive-art.js: CDN-terugval uit, geen CDN voor assets');
  const html = read('index.html').toString('utf8');
  check(/<script src="rive-art.js"><\/script>/.test(html) && !/vendor\/rive/.test(html), 'index.html laadt alleen de lader; de runtime komt pas als hij nodig is');
  const sw = read('sw.js').toString('utf8');
  check(['./rive-art.js', './vendor/rive/rive.js', './vendor/rive/rive.wasm', './assets/rive/vlam.riv', './assets/rive/vandam.riv'].every(f => sw.includes(`'${f}'`)) && !/crimson-ledger-v17'/.test(sw), 'service worker: Rive-bestanden in de cache, cachenaam opgehoogd');
  const www = read('build-www.js').toString('utf8');
  check(/'rive-art.js'/.test(www) && /cpSync\('vendor', 'www\/vendor'/.test(www), 'build-www: lader en vendor/ gaan mee naar www/');
  check(!/rive/i.test(read('build-web-daily.js').toString('utf8')), 'webdagzaak: zonder Rive (geen thuisscherm of briefing daar)');
}

// ── 2. de lader in een nagebootste browser: welke paden vraagt hij op? ──
(async () => {
  {
    const asked = [], wasm = [], made = [];
    const fakeRive = {
      RuntimeLoader: { setWasmUrl: u => wasm.push(['url', u]), setWasmFallbackUrl: u => wasm.push(['fallback', u]) },
      Layout: function (o) { this.o = o; }, Fit: { Contain: 'contain' }, Alignment: { Center: 'center' },
      Rive: function (o) {
        made.push(o);
        this.viewModelInstance = { boolean: () => ({ value: false }), trigger: () => ({ trigger() {} }) };
        this.resizeDrawingSurfaceToCanvas = () => {}; this.play = () => {}; this.cleanup = () => {};
        this.stopRendering = () => {}; this.startRendering = () => {};
        setTimeout(() => o.onLoad(), 0);
      }
    };
    const el = tag => ({ tag, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, remove() {}, appendChild() {}, isConnected: true });
    const ctx = {
      Motion: { ok: true }, WebAssembly, setTimeout, clearTimeout, console,
      requestAnimationFrame: f => setTimeout(f, 0),
      window: { addEventListener() {}, removeEventListener() {} },
      document: {
        createElement: tag => el(tag),
        head: { appendChild: s => { asked.push(s.src); setTimeout(() => { ctx.window.rive = fakeRive; s.onload(); }, 0); } }
      }
    };
    vm.runInNewContext(read('rive-art.js').toString('utf8') + '\n;globalThis.__R = { RiveArt, StreakFlame, LiveMentor };', Object.assign(ctx, { globalThis: ctx }));
    const { RiveArt } = ctx.__R;
    const host = el('span');
    const ctl = await RiveArt.mount(host, { src: 'vlam.riv', stateMachine: 'Vlam', init: c => c.bool('lit', false) });
    check(asked.length === 1 && asked[0] === 'vendor/rive/rive.js', 'lader: runtime uit vendor/rive/rive.js (relatief, dus uit de app zelf): ' + asked.join(', '));
    check(JSON.stringify(wasm) === JSON.stringify([['url', 'vendor/rive/rive.wasm'], ['fallback', null]]), 'lader: wasm uit vendor/rive/, CDN-terugval uit');
    check(made.length === 1 && made[0].src === 'assets/rive/vlam.riv' && made[0].enableRiveAssetCDN === false && made[0].stateMachine === 'Vlam' && made[0].autoBind === true, 'lader: vlam uit assets/rive/, met view model, zonder CDN');
    check(!!ctl && typeof ctl.fire === 'function', 'lader: geeft een besturing terug');
    await RiveArt.mount(host, { src: 'vandam.riv', stateMachine: 'Van Dam' });
    check(asked.length === 1 && made[1].src === 'assets/rive/vandam.riv', 'lader: de runtime wordt maar één keer geladen');
  }

  // ── 3. terugval in jsdom (zoals de andere tests de app laden) ──
  let html = read('index.html').toString('utf8');
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
  html = html.replace('<head>', '<head><script>localStorage.setItem("crimson-lang", "nl");</script>').replace(/<link[^>]+>/g, '')
    .replace('</body>', '<script>window.App = App; window.Board = Board; window.Campaign = Campaign; window.Motion = Motion; window.RiveArt = RiveArt; window.StreakFlame = StreakFlame; window.LiveMentor = LiveMentor;</script></body>');
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
  const { window } = dom, { document } = window;
  await sleep(80);
  const { App, Motion, RiveArt, StreakFlame } = window;
  const riveScripts = () => [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src'));

  check(!Motion.ok && !RiveArt.ok, 'jsdom: geen Web Animations, dus geen Rive');
  const flame = () => document.querySelector('#streak-title .streak-flame');
  check(!!flame() && !flame().querySelector('canvas') && flame().classList.contains('unlit'), 'vlam: icoon zonder canvas, grijs bij streak 0');
  App.streak = { count: 3, lastDate: new Date().toDateString() }; App.updateStreakDisplay();
  check(!flame().classList.contains('unlit') && App.streakAlive(), 'vlam: brandt als vandaag gespeeld');
  App.streak = { count: 3, lastDate: new Date(Date.now() - 86400000).toDateString() }; App.updateStreakDisplay();
  check(!flame().classList.contains('unlit'), 'vlam: brandt nog als gisteren gespeeld');
  App.streak = { count: 3, lastDate: new Date(Date.now() - 5 * 86400000).toDateString() }; App.updateStreakDisplay();
  check(flame().classList.contains('unlit') && !App.streakAlive(), 'vlam: grijs als de streak gebroken is');
  App.storageSet('crimson-streak-seen', '2'); App.streak = { count: 3, lastDate: new Date().toDateString() }; App.updateStreakDisplay();
  App.streakIgnite();
  check(App.storageGet('crimson-streak-seen') === '3' && document.getElementById('streak-count').textContent === '3', 'ontsteken zonder Rive en zonder beweging: getal meteen goed, geen fout');

  // briefing: de foto blijft
  const c = window.Campaign.caseAt('landhuis', 0);
  check(!!c, 'briefing: eerste zaak van het landhuis gevonden');
  window.Board.start(c.difficulty, c.seed, false, c.theme, c); App.showBriefing(c, window.Campaign.chapter('landhuis'));
  check(document.getElementById('briefing-modal').classList.contains('active'), 'briefing staat open');
  const portrait = document.getElementById('briefing-portrait');
  check(!!portrait.querySelector('img.mentor-img[src="assets/vandam.jpg"]') && !portrait.querySelector('canvas'), 'briefing: Van Dam als foto, zonder canvas');
  document.getElementById('btn-briefing-go').click();
  check(!document.getElementById('briefing-modal').classList.contains('active'), 'briefing: Aan de slag sluit hem gewoon');
  check(!riveScripts().some(s => /rive/.test(s)), 'jsdom: de runtime is nooit opgevraagd');

  // ── 4. Rive wordt geprobeerd maar laadt niet (jsdom haalt geen scripts op): terug naar icoon en Web Animation ──
  window.Element.prototype.animate = function () { const a = { onfinish: null, cancel() {}, finish() {} }; setTimeout(() => a.onfinish && a.onfinish(), 20); return a; };
  window.HTMLCanvasElement.prototype.getContext = () => null;
  check(Motion.ok && RiveArt.ok, 'nagebootst: beweging mag, Rive wordt geprobeerd');
  RiveArt.TIMEOUT_MS = 150;
  window.requestIdleCallback = undefined;
  StreakFlame.host = null; StreakFlame.ctl = null; StreakFlame.failed = false;
  App.streak = { count: 4, lastDate: new Date().toDateString() }; App.storageSet('crimson-streak-seen', '3'); App.updateStreakDisplay();
  App.streakIgnite();   // de vlam wacht op Rive
  await sleep(900);
  check(riveScripts().filter(s => /rive/.test(s)).join() === 'vendor/rive/rive.js', 'nagebootst: alleen vendor/rive/rive.js gevraagd: ' + riveScripts().join(', '));
  check(RiveArt.state === 'failed' && StreakFlame.failed && !flame().querySelector('canvas') && !flame().classList.contains('rive-on'), 'nagebootst: laden mislukt, het icoon blijft');
  check(document.getElementById('streak-count').textContent === '4', 'nagebootst: de wachtende ontsteking liep alsnog als Web Animation (getal 4)');
  App.updateStreakDisplay();
  check(!!flame() && !flame().querySelector('canvas'), 'nagebootst: daarna gewoon het icoon, geen nieuwe pogingen');
  window.Board.start(c.difficulty, c.seed, false, c.theme, c); App.showBriefing(c, window.Campaign.chapter('landhuis'));
  await sleep(50);
  check(!!portrait.querySelector('img.mentor-img') && !portrait.querySelector('canvas'), 'nagebootst: briefing houdt de foto');
  document.getElementById('btn-briefing-go').click();

  check(errors.length === 0, 'geen JS-fouten: ' + errors.join(' | '));
  window.close();
  console.log(failures ? `\n${failures} FOUT(EN)` : '\nRive: alles in orde');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

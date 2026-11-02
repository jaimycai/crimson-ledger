// Rive in een echte browser (headless Chrome): de app uit www/ (node build-www.js), op 320, 375 en iPad-breedte,
// met en zonder "Beperk beweging". Controleert dat de vlam en Van Dam als Rive tekenen (of netjes terugvallen),
// dat de wasm laadt en dat geen enkel verzoek de app verlaat. Schermafdrukken in de map die je meegeeft.
//   node build-www.js && node tests/rive-browser.js /tmp/rive-shots
// Niet in npm test: het heeft Chrome nodig (puppeteer). CHROME=<pad> kiest een andere Chrome.
const http = require('http'), fs = require('fs'), path = require('path');
const puppeteer = require('puppeteer');
const ROOT = path.join(__dirname, '..', 'www');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..', 'www-rive-shots'));
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.riv': 'application/octet-stream', '.svg': 'image/svg+xml' };
const served = new Set();
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  served.add(u);
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };

const SIZES = [['320', { width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['375', { width: 375, height: 812, deviceScaleFactor: 3, isMobile: true, hasTouch: true }],
  ['ipad', { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]];

(async () => {
  if (!fs.existsSync(path.join(ROOT, 'vendor/rive/rive.wasm'))) throw new Error('eerst node build-www.js');
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const opts = { headless: true, args: ['--no-sandbox'] };
  if (process.env.CHROME) opts.executablePath = process.env.CHROME;
  const browser = await puppeteer.launch(opts);
  console.log('browser:', await browser.version());
  const outside = [], errors = [];

  async function open(size, reduced, storage) {
    const page = await browser.newPage();
    await page.setViewport(size);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }]);
    await page.setRequestInterception(true);
    page.on('request', r => {
      const u = r.url();
      if (u.startsWith(base) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
      outside.push(u); r.abort();
    });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.evaluateOnNewDocument(s => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
    }, storage);
    await page.goto(base, { waitUntil: 'load' });
    await sleep(300);
    return page;
  }
  const day = k => new Date(Date.now() - k * 86400000).toDateString();
  const seed = (streak, seen) => ({ 'crimson-lang': 'nl', 'crimson-meting': '0', 'crimson-board-tutorial-done': '1', 'crimson-streak': JSON.stringify(streak),
    ...(seen != null ? { 'crimson-streak-seen': String(seen) } : {}) });
  const toMenu = async page => {
    await page.evaluate(() => { const b = document.getElementById('btn-splash-start'); if (b) b.click(); });
    await page.waitForFunction(() => document.querySelector('#screen-menu.active'), { timeout: 5000 });
  };
  const card = async (page, file) => {
    const el = await page.$('#menu-streak');
    await el.evaluate(e => e.scrollIntoView({ block: 'center' }));
    await el.screenshot({ path: path.join(OUT, file) });
  };

  for (const [name, size] of SIZES) {
    for (const reduced of [false, true]) {
      const tag = `${name}-${reduced ? 'rm' : 'motion'}`;
      // 1. thuisscherm met een groeiende streak (2 → 3): ontsteken
      let page = await open(size, reduced, seed({ count: 3, lastDate: day(0) }, 2));
      await toMenu(page);
      const t0 = Date.now();
      const shots = reduced ? [600] : [120, 420, 560, 760, 1300, 2600];
      for (const at of shots) { await sleep(Math.max(0, at - (Date.now() - t0))); await card(page, `${tag}-vlam-${at}.png`); }
      const f = await page.evaluate(() => {
        const el = document.querySelector('#streak-title .streak-flame');
        const cv = el && el.querySelector('canvas');
        return { canvas: !!cv, on: el && el.classList.contains('rive-on'), unlit: el && el.classList.contains('unlit'), state: RiveArt.state,
          lit: StreakFlame.ctl ? StreakFlame.ctl.vm.boolean('lit').value : null, count: document.getElementById('streak-count').textContent,
          w: cv ? cv.width : 0, cssw: cv ? cv.getBoundingClientRect().width : 0 };
      });
      if (reduced) check(!f.canvas && !f.on && f.state === 'idle' && f.count === '3', `${tag}: vlam = icoon, runtime niet geladen, getal 3`);
      else check(f.canvas && f.on && f.state === 'ready' && f.lit === true && f.count === '3' && f.w >= f.cssw * 1.9, `${tag}: Rive-vlam brandt na ontsteken, getal 3, scherp (${f.w}px voor ${f.cssw.toFixed(0)} css-px)`);
      await page.close();

      // 2. gebroken streak: grijs
      page = await open(size, reduced, seed({ count: 4, lastDate: day(5) }, 4));
      await toMenu(page); await sleep(reduced ? 300 : 1400);
      await card(page, `${tag}-vlam-grijs.png`);
      const g = await page.evaluate(() => ({ unlit: document.querySelector('#streak-title .streak-flame').classList.contains('unlit'),
        lit: StreakFlame.ctl ? StreakFlame.ctl.vm.boolean('lit').value : null }));
      check(g.unlit && (reduced ? g.lit === null : g.lit === false), `${tag}: gebroken streak = grijze vlam`);

      // 3. briefing van Van Dam (eerste campagnezaak)
      await page.evaluate(() => App.startCampaignCase('landhuis', 0, true));
      await page.waitForFunction(() => document.querySelector('#briefing-modal.active'), { timeout: 5000 });
      await sleep(reduced ? 500 : 1500);
      const b = await page.evaluate(() => {
        const host = document.getElementById('briefing-portrait'), r = host.getBoundingClientRect(), sheet = document.querySelector('#briefing-modal .modal-content');
        const go = document.getElementById('btn-briefing-go').getBoundingClientRect();
        return { canvas: !!host.querySelector('canvas'), on: host.classList.contains('rive-on'), w: r.width, inView: go.bottom <= innerHeight + 1,
          sheetScroll: sheet.scrollHeight > sheet.clientHeight + 1, talk: LiveMentor.ctl ? LiveMentor.ctl.vm.boolean('talk').value : null };
      });
      await (await page.$('#briefing-modal .modal-content')).screenshot({ path: path.join(OUT, `${tag}-briefing.png`) });
      if (reduced) check(!b.canvas && b.w >= 119, `${tag}: briefing met de foto van Van Dam (${b.w.toFixed(0)} px), geen Rive`);
      else check(b.canvas && b.on && b.talk === true && b.w >= 119, `${tag}: Van Dam leeft (${b.w.toFixed(0)} px) en praat`);
      check(b.inView || b.sheetScroll, `${tag}: knop Aan de slag bereikbaar${b.sheetScroll ? ' (blad scrolt)' : ''}`);
      if (!reduced) {
        await sleep(6000);
        const quiet = await page.evaluate(() => LiveMentor.ctl.vm.boolean('talk').value);
        check(quiet === false, `${tag}: Van Dam stopt vanzelf met praten`);
        await page.evaluate(() => document.getElementById('btn-briefing-go').click());
        await sleep(200);
        check(await page.evaluate(() => !document.querySelector('#briefing-modal.active') && !LiveMentor.visible), `${tag}: Aan de slag sluit de briefing en zet Van Dam stil`);
      }
      await page.close();
    }
  }
  const rive = [...served].filter(u => /rive/.test(u));
  check(['/vendor/rive/rive.js', '/vendor/rive/rive.wasm', '/assets/rive/vlam.riv', '/assets/rive/vandam.riv'].every(u => served.has(u)), 'geladen uit de app: ' + rive.join(', '));
  check(outside.length === 0, 'geen verzoek buiten de app' + (outside.length ? ': ' + [...new Set(outside)].join(', ') : ''));
  check(errors.length === 0, 'geen fouten in de console' + (errors.length ? ': ' + [...new Set(errors)].join(' | ') : ''));
  await browser.close(); server.close();
  console.log(failures ? `\n${failures} FOUT(EN)` : `\nRive in de browser: alles in orde (schermafdrukken in ${OUT})`);
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

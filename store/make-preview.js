// App-preview-video 1290×2796 (430×932 @3x), per taal.
//   node store/make-preview.js <map> [talen...]     (standaard nl en; elke taal met een i18n/<taal>.js)
// Een statische server moet de repo-map serveren (SHOTS_BASE, standaard http://127.0.0.1:8094).
// Neemt een gescripte speelbeurt op via het screencast-kanaal van Chrome en
// schrijft de losse beelden plus een tijdlijn weg. store/encode-preview.swift
// maakt daar een H.264-bestand van dat App Store Connect accepteert.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '/tmp/crimson-preview';
const LANGS = process.argv.slice(3).length ? process.argv.slice(3) : ['nl', 'en'];
const BASE = (process.env.SHOTS_BASE || 'http://127.0.0.1:8094').replace(/\/+$/, '');
// what this records goes to the App Store: only a local server serving this repo
{ const u = new URL(BASE);
  if (u.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(u.hostname)) { console.error(`SHOTS_BASE moet een lokale server zijn (http://127.0.0.1:<poort>), niet ${BASE}`); process.exit(2); } }
const wait = ms => new Promise(r => setTimeout(r, ms));

async function run(lang) {
  const dir = path.join(ROOT, lang);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  // nieuwste Chrome for Testing (mac_arm-131… < mac_arm-153…)
  const chrome = fs.readdirSync(process.env.HOME + '/.cache/puppeteer/chrome').filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop();
  const exe = `${process.env.HOME}/.cache/puppeteer/chrome/${chrome}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
  // --force-device-scale-factor=3 is nodig: zonder die vlag levert het
  // screencast-kanaal 860×1864 in plaats van de volle 1290×2796.
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: fs.existsSync(exe) ? exe : undefined,
    args: ['--force-device-scale-factor=3', '--high-dpi-support=1']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  page.on('pageerror', e => console.log('PAGEERROR', e.message));

  await page.evaluateOnNewDocument(lang => {
    localStorage.setItem('crimson-lang', lang);
    localStorage.setItem('crimson-board-tutorial-done', '1');
    localStorage.setItem('crimson-board-tip-seen', '1');
    localStorage.setItem('crimson-store-mock', '1');
    localStorage.setItem('crimson-board-stats', JSON.stringify({ solved: 21, clean: 9, best: 154 }));
    localStorage.setItem('crimson-points', '9840');
    localStorage.setItem('crimson-streak', JSON.stringify({ count: 6, lastDate: new Date(Date.now() - 86400000).toDateString() }));
    localStorage.setItem('crimson-freezes', '1');
    const camp = {}; [3, 3, 2, 3, 1, 3].forEach((s, i) => { camp['landhuis-' + i] = s; });
    localStorage.setItem('crimson-campaign', JSON.stringify(camp));
    localStorage.setItem('crimson-mini', JSON.stringify({ landhuis: 3 }));
    const d = new Date(); const log = [];
    for (let i = 1; i <= 5; i++) { const x = new Date(d); x.setDate(d.getDate() - i); log.push(x.toISOString().slice(0, 10)); }
    localStorage.setItem('crimson-daily-log', JSON.stringify(log));
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('crimson-medals', JSON.stringify({ first: today, streak3: today, fast: today, nohint: today, part1: today }));
    localStorage.setItem('crimson-newclue-seen', JSON.stringify(['room', 'not-room', 'room-pos', 'near', 'row', 'col', 'same-room', 'not-same-room', 'left-of', 'above', 'furniture', 'alone', 'corner', 'wall', 'middle', 'next-to']));
  }, lang);

  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: ':root{--sat:59px;--sab:34px} #toast, #medal-toast { display: none !important }' });
  await wait(1200);
  await page.evaluate(() => document.getElementById('btn-splash-start').click());
  await wait(900);
  // De video opent meteen op het bord (een zoekresultaat speelt de eerste seconden zonder geluid af):
  // zaak 7 van het Landhuis klaarzetten vóór de opname begint.
  await page.evaluate(() => App.startCampaignCase(Campaign.list()[0].key, 6));
  await wait(700);
  await page.evaluate(() => { const b = document.getElementById('btn-part-go'); if (b && document.getElementById('part-modal').classList.contains('active')) b.click(); });
  await wait(500);
  await page.evaluate(() => { const b = document.getElementById('btn-briefing-go'); if (b) b.click(); });
  await wait(500);
  await page.evaluate(() => { const ok = document.getElementById('btn-newclue-ok'); if (ok && document.getElementById('newclue-modal').classList.contains('active')) ok.click(); });
  await wait(600);

  // opname starten
  const client = await page.createCDPSession();
  const frames = [];
  let n = 0;
  let t0 = null;
  client.on('Page.screencastFrame', async ({ data, sessionId, metadata }) => {
    try { await client.send('Page.screencastFrameAck', { sessionId }); } catch (e) { /* venster al dicht */ }
    const ts = metadata.timestamp;
    if (t0 === null) t0 = ts;
    const file = `f${String(n++).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(dir, file), Buffer.from(data, 'base64'));
    frames.push({ file, t: +(ts - t0).toFixed(4) });
  });
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1290, maxHeight: 2796, everyNthFrame: 1 });

  const tap = sel => page.evaluate(s => { const el = document.querySelector(s); if (el) el.click(); }, sel);

  await wait(1200);                                            // 0.0 – 1.2  het bord met de verklaringen
  // verdachte voor verdachte neerzetten, verklaringen kleuren mee
  const count = await page.evaluate(() => Board.puzzle.solution.length);
  for (let i = 0; i < count; i++) {
    await page.evaluate(i => {
      const p = Board.puzzle;
      Board.placements[i] = { x: p.solution[i].x, y: p.solution[i].y };
      Board.after();
      Board.deckIdx = Math.min(i, p.clues.length - 1);
      if (Board.renderDeck) Board.renderDeck();
    }, i);
    await wait(780);
  }
  await wait(500);                                             // ~1.2 – 8  plaatsen
  await tap('#btn-board-check');
  await wait(1700);                                            // beschuldiging
  await page.evaluate(() => document.querySelector(`.murder-opt[data-s="${Board.puzzle.murderer}"]`).click());
  await wait(2400);                                            // bekentenis + ceremonie
  await page.evaluate(() => { if (Board.skipCeremony) Board.skipCeremony(); });
  await wait(2400);                                            // zaak gesloten
  await page.evaluate(() => App.navigateTo('menu'));
  await wait(300);
  await tap('#btn-campaign');
  await wait(900);                                             // wereldkaart
  await page.evaluate(() => {                                   // rustig scrollen over het pad
    const sc = document.querySelector('#screen-campaign .map-scroll') || document.querySelector('.map-scroll') || document.scrollingElement;
    sc.scrollTo({ top: sc.scrollTop + 620, behavior: 'smooth' });
  });
  await wait(2000);
  await page.evaluate(() => App.navigateTo('menu'));
  await wait(300);
  await tap('#btn-awards');
  await wait(2200);                                            // vitrine

  // een stilstaand scherm levert geen nieuwe beelden: het laatste beeld tot het einde laten staan
  if (frames.length) frames.push({ file: frames[frames.length - 1].file, t: +(Date.now() / 1000 - t0).toFixed(4) });
  await client.send('Page.stopScreencast');
  await wait(300);
  fs.writeFileSync(path.join(dir, 'frames.json'), JSON.stringify({ width: 1290, height: 2796, frames }, null, 0));
  console.log(lang, frames.length, 'beelden,', frames.length ? frames[frames.length - 1].t.toFixed(1) : 0, 'seconden');
  await browser.close();
}

(async () => { for (const l of LANGS) await run(l); })().catch(e => { console.error(e); process.exit(1); });

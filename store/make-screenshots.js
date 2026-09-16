// Maakt de App Store-schermafbeeldingen in het Nederlands en het Engels.
// Gebruik: npx http-server -p 8090 (of python3 -m http.server 8090) in deze map, dan:
//   node store/make-screenshots.js 6.9   (vereist: npm i -D puppeteer, eenmalig)
//   node store/make-screenshots.js 6.5
// App Store Connect kent twee maatgroepen voor de iPhone en accepteert alleen
// de exacte maat van de groep waarin je uploadt:
//   6.9" → 1290×2796, uitvoer store/screenshots/ en store/screenshots-en/
//   6.5" → 1284×2778, uitvoer store/screenshots-65/ en store/screenshots-65-en/


const puppeteer = require('puppeteer'); const fs = require('fs');
const wait = ms => new Promise(r => setTimeout(r, ms));
const path = require('path');
const SIZES = {
  '6.9': { w: 430, h: 932, suffix: '' },        // 1290×2796
  '6.5': { w: 428, h: 926, suffix: '-65' }      // 1284×2778
};
const SIZE = SIZES[process.argv[2] || '6.9'];
if (!SIZE) { console.error('maat moet 6.9 of 6.5 zijn'); process.exit(2); }
const OUT = {
  nl: path.join(__dirname, `screenshots${SIZE.suffix}`),
  en: path.join(__dirname, `screenshots${SIZE.suffix}-en`)
};
async function run(lang) {
  fs.mkdirSync(OUT[lang], { recursive: true });
  const chrome = fs.readdirSync(process.env.HOME + '/.cache/puppeteer/chrome')[0];
  const exe = `${process.env.HOME}/.cache/puppeteer/chrome/${chrome}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
  const browser = await puppeteer.launch({ headless: true, executablePath: fs.existsSync(exe) ? exe : undefined });
  const page = await browser.newPage();
  await page.setViewport({ width: SIZE.w, height: SIZE.h, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  await page.evaluateOnNewDocument(lang => {
    localStorage.setItem('crimson-lang', lang);
    localStorage.setItem('crimson-board-tutorial-done', '1'); localStorage.setItem('crimson-board-tip-seen', '1');
    localStorage.setItem('crimson-store-mock', '1');
    localStorage.setItem('crimson-board-stats', JSON.stringify({ solved: 21, clean: 9, best: 154 }));
    localStorage.setItem('crimson-points', '9840');
    localStorage.setItem('crimson-streak', JSON.stringify({ count: 6, lastDate: new Date(Date.now() - 86400000).toDateString() }));
    localStorage.setItem('crimson-freezes', '1');
    const camp = {}; [3, 3, 2, 3, 1, 3].forEach((s, i) => { camp['landhuis-' + i] = s; }); localStorage.setItem('crimson-campaign', JSON.stringify(camp));
    localStorage.setItem('crimson-mini', JSON.stringify({ 'landhuis': 3 }));
    const d = new Date(); const log = []; for (let i = 1; i <= 5; i++) { const x = new Date(d); x.setDate(d.getDate() - i); log.push(x.toISOString().slice(0, 10)); }
    localStorage.setItem('crimson-daily-log', JSON.stringify(log));
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('crimson-medals', JSON.stringify({ first: today, streak3: today, fast: today, nohint: today, part1: today }));
    localStorage.setItem('crimson-newclue-seen', JSON.stringify(['room', 'not-room', 'room-pos', 'near', 'row', 'col', 'same-room', 'not-same-room', 'left-of', 'above', 'furniture', 'alone', 'corner', 'wall', 'middle', 'next-to']));
  }, lang);
  await page.goto('http://localhost:8090/index.html', { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: ':root{--sat:59px;--sab:34px} #toast, #medal-toast { display: none !important }' });
  await wait(1100);
  await page.evaluate(() => document.getElementById('btn-splash-start').click()); await wait(600);
  await page.evaluate(() => { const t = document.getElementById('toast'); if (t) t.classList.remove('show'); }); await wait(100);
  const shot = async name => { await page.evaluate(() => { document.querySelectorAll('.toast, #toast').forEach(t => t.classList.remove('show', 'active')); }); await page.screenshot({ path: `${OUT[lang]}/${name}.png` }); console.log(lang, name); };
  await shot('01-thuis');
  // wereldkaart
  await page.evaluate(() => document.getElementById('btn-campaign').click()); await wait(900);
  await shot('02-wereldkaart');
  // briefing van zaak 7
  await page.evaluate(() => { App.startCampaignCase(Campaign.list()[0].key, 6); }); await wait(500);
  await page.evaluate(() => { const b = document.getElementById('btn-part-go'); if (b && document.getElementById('part-modal').classList.contains('active')) b.click(); }); await wait(400);
  await shot('03-briefing');
  await page.evaluate(() => { const b = document.getElementById('btn-briefing-go'); if (b) b.click(); }); await wait(400);
  await page.evaluate(() => { const ok = document.getElementById('btn-newclue-ok'); if (ok && document.getElementById('newclue-modal').classList.contains('active')) ok.click(); }); await wait(300);
  // twee verdachten alvast goed neerzetten, derde verklaring open
  await page.evaluate(() => { const p = Board.puzzle; [0, 1].forEach(i => { Board.placements[i] = { x: p.solution[i].x, y: p.solution[i].y }; }); Board.after(); Board.deckIdx = 0; if (Board.renderDeck) Board.renderDeck(); }); await wait(300);
  await shot('04-verklaringen');
  await page.evaluate(() => { const p = Board.puzzle; p.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after(); document.getElementById('btn-board-check').click(); }); await wait(400);
  await shot('05-beschuldiging');
  await page.evaluate(() => document.querySelector(`.murder-opt[data-s="${Board.puzzle.murderer}"]`).click()); await wait(1400);
  await page.evaluate(() => Board.skipCeremony()); await wait(2600);
  await page.evaluate(() => window.scrollTo(0, 0)); await wait(200);
  await shot('06-zaak-gesloten');
  // vitrine
  await page.evaluate(() => { App.navigateTo('menu'); }); await wait(300);
  await page.evaluate(() => document.getElementById('btn-awards').click()); await wait(500);
  await shot('07-vitrine');
  // winkel
  await page.evaluate(() => { App.navigateTo('menu'); }); await wait(200);
  await page.evaluate(() => App.openStore(null)); await wait(400);
  await page.evaluate(() => { const m = document.querySelector('#store-modal .modal-content'); if (m) m.scrollTop = 0; }); await wait(200);
  await shot('08-winkel');
  // een tweede wereld: het circus, met de Pass in bezit zodat hij open staat
  await page.evaluate(() => {
    const m = document.getElementById('store-modal'); if (m) m.classList.remove('active');
    Store.save({ pass: true, worlds: [], cosmetics: false });
  }); await wait(300);
  await page.evaluate(() => {
    const ch = Campaign.list().find(c => c.theme === 'circus') || Campaign.list()[0];
    App.startCampaignCase(ch.key, 2);
  }); await wait(600);
  await page.evaluate(() => { const b = document.getElementById('btn-part-go'); if (b && document.getElementById('part-modal').classList.contains('active')) b.click(); }); await wait(400);
  await page.evaluate(() => { const b = document.getElementById('btn-briefing-go'); if (b) b.click(); }); await wait(400);
  await page.evaluate(() => { const ok = document.getElementById('btn-newclue-ok'); if (ok && document.getElementById('newclue-modal').classList.contains('active')) ok.click(); }); await wait(400);
  await page.evaluate(() => {
    const p = Board.puzzle;
    [0, 1, 2].forEach(i => { Board.placements[i] = { x: p.solution[i].x, y: p.solution[i].y }; });
    Board.after(); Board.deckIdx = 3; if (Board.renderDeck) Board.renderDeck();
  }); await wait(400);
  await shot('09-circus');
  // de hint van Van Dam in drie stappen; eerst terug naar één geplaatste
  // verdachte, anders geeft de hint alleen "iedereen staat goed"
  await page.evaluate(() => {
    const p = Board.puzzle;
    Board.placements = [];
    Board.placements[0] = { x: p.solution[0].x, y: p.solution[0].y };
    Board.after();
  }); await wait(300);
  await page.evaluate(() => document.getElementById('btn-board-hint').click()); await wait(700);
  await shot('10-hint');
  await browser.close();
}
(async () => { await run('nl'); await run('en'); })().catch(e => { console.error(e); process.exit(1); });

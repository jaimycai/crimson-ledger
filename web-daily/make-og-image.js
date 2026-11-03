// Makes web-daily/og-image.png: the 1200×630 link preview of the web daily case (og:image, twitter:card
// summary_large_image). A real floor plan from the app (board.js, landhuis, empty: no suspects placed, so nothing is
// given away), the icon, the name and "Play today's case". Copy rule: puzzle fun, a case every day, logic without
// guessing; no word for murder or killing. English, like the og text of the page (one image for every language).
//   node web-daily/make-og-image.js          → web-daily/og-image.png (then node build-web-daily.js)
// Needs puppeteer and Chrome (~/.cache/puppeteer).
const http = require('http'), fs = require('fs'), path = require('path');
const puppeteer = require('puppeteer');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'og-image.png');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const virtual = {};   // pages made in this script: /__og.html and /__board.png
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (virtual[u]) { res.writeHead(200, { 'Content-Type': TYPES[path.extname(u)] }); return res.end(virtual[u]); }
  const f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
function chromePath() {
  const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
  let v; try { v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop(); } catch (e) { v = null; }
  const exe = v && path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  return exe && fs.existsSync(exe) ? exe : undefined;
}

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath() });
  try {
    // 1. the floor plan, straight from the app
    const app = await browser.newPage();
    await app.setViewport({ width: 430, height: 932, deviceScaleFactor: 3 });
    await app.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await app.evaluateOnNewDocument(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('crimson-lang', 'en');
      localStorage.setItem('crimson-board-tutorial-done', '1');
      localStorage.setItem('crimson-meting', '0');
    });
    await app.goto(base, { waitUntil: 'load' });
    await app.evaluate(() => document.fonts.ready);
    await sleep(400);
    await app.evaluate(() => { Board.start('gemiddeld', 20261103, false, 'landhuis'); App.navigateTo('board'); });
    await sleep(900);
    await app.evaluate(() => document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active')));
    await sleep(300);
    const grid = await app.$('#board-grid');
    const board = await grid.screenshot({ type: 'png', omitBackground: true });
    // 2. the card
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    virtual['/__board.png'] = board;
    virtual['/__og.html'] = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="style.css"><style>
      html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
      body { background: radial-gradient(120% 120% at 15% 10%, #FFFCF7 0%, #FAF5EF 45%, #F0E5D6 100%); font-family: 'Inter', sans-serif; color: #2C1810; }
      .frame { position: absolute; inset: 22px; border: 2px solid #B8955C; border-radius: 26px; }
      .frame::after { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(184, 149, 92, 0.45); border-radius: 19px; }
      .left { position: absolute; left: 78px; top: 76px; width: 600px; }
      .brand { display: flex; align-items: center; gap: 18px; }
      .brand img { width: 88px; height: 88px; border-radius: 22px; box-shadow: 0 6px 16px rgba(44, 24, 16, 0.18); }
      .brand span { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 40px; letter-spacing: -0.5px; }
      .kicker { margin: 40px 0 0; font-size: 21px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #8B6B3A; }
      h1 { margin: 10px 0 0; font-family: 'Playfair Display', serif; font-weight: 800; font-size: 64px; line-height: 1.05; color: #8B2E1C; letter-spacing: -1px; white-space: nowrap; }
      p.sub { margin: 18px 0 0; font-size: 26px; line-height: 1.4; color: #5A3E2B; max-width: 520px; }
      .pill { display: inline-block; margin-top: 28px; padding: 14px 26px; border-radius: 999px; background: #8B2E1C; color: #FAF5EF; font-weight: 700; font-size: 24px; }
      .right { position: absolute; right: 70px; top: 70px; width: 440px; height: 490px; display: flex; align-items: center; justify-content: center; }
      .sheet { background: #fff; border: 2px solid #1A1108; border-radius: 22px; padding: 16px; box-shadow: 0 18px 40px rgba(44, 24, 16, 0.22); transform: rotate(2.5deg); }
      .sheet img { display: block; width: 400px; height: auto; border-radius: 10px; }
      .tag { position: absolute; left: -14px; top: 22px; transform: rotate(-4deg); background: #FAF5EF; border: 2px solid #1A1108; border-radius: 12px; padding: 8px 16px; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 24px; box-shadow: 0 6px 14px rgba(44, 24, 16, 0.16); }
    </style></head><body>
      <div class="frame"></div>
      <div class="left">
        <div class="brand"><img src="icon-512.png" alt=""><span>Crimson Ledger</span></div>
        <p class="kicker">A new case every day</p>
        <h1>Play today’s case</h1>
        <p class="sub">Read the statements, place the suspects, find the culprit. Pure logic, no guessing.</p>
        <span class="pill">Play in your browser</span>
      </div>
      <div class="right"><div class="sheet"><img src="__board.png" alt=""></div><span class="tag">Who was alone?</span></div>
    </body></html>`;
    await page.goto(base + '__og.html', { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await sleep(300);
    await page.screenshot({ path: OUT, type: 'png' });
    console.log(`${path.relative(process.cwd(), OUT)}: 1200×630, ${Math.round(fs.statSync(OUT).size / 1024)} kB`);
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exit(1); });

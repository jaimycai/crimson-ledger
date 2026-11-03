// Builds the In-App Event art for the 1.6 "Major Update" event: a 1920x1080 event card and a 1080x1920 details image.
// The eight new worlds as their own map banners (MapArt.banner, drawn by the app itself) around Inspector Van Dam.
// No words on the art (Apple: avoid text in event media), so one pair serves all 23 store languages. The App Store
// lays the badge, name and short description over the lower part, so the portrait sits in the upper half.
// Needs the repo served on http://127.0.0.1:8094 (any static server on the repo root).
//   node store/events/make-update-art.js            writes update-card.png and update-details.png next to this file
const puppeteer = require('puppeteer-core'); const fs = require('fs'); const path = require('path');
const OUT = __dirname, BASE = process.env.APP_URL || 'http://127.0.0.1:8094/index.html';
const NEW_WORLDS = ['oceaanstomer', 'ryokan', 'fazenda', 'zeppelin', 'poolstation', 'winterpaleis', 'safarilodge', 'hanok'];
const INK = '#1a1108', PAPER = '#f3e9d8';

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => localStorage.setItem('crimson-meting', '0'));
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  const banners = await page.evaluate(ids => ids.map(id => MapArt.banner(id).replace('<svg', '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice"')), NEW_WORLDS);
  const portrait = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../../art/portretten/vandam-zonder-tekst.png')).toString('base64');
  const tile = (svg, w, h) => `<div style="width:${w}px;height:${h}px;border:7px solid ${INK};border-radius:22px;overflow:hidden;
    box-sizing:border-box;background:#fff;box-shadow:0 18px 40px rgba(60,30,10,.28)">${svg}</div>`;
  const face = d => `<div style="width:${d}px;height:${d}px;border-radius:50%;overflow:hidden;border:9px solid ${INK};box-sizing:border-box;
    background:${PAPER};box-shadow:0 24px 60px rgba(60,30,10,.4)"><img src="${portrait}" style="width:100%;height:100%;object-fit:cover"></div>`;

  // Card: 3x3 grid, Van Dam in the middle cell, the eight worlds around him.
  const W = 1920, H = 1080, gap = 26, tw = 560, th = Math.round(tw * 200 / 393);
  const cells = []; let b = 0;
  for (let i = 0; i < 9; i++) cells.push(i === 4 ? `<div style="width:${tw}px;height:${th}px;display:flex;align-items:center;justify-content:center">${face(th + 70)}</div>` : tile(banners[b++], tw, th));
  const card = `<html><body style="margin:0;width:${W}px;height:${H}px;background:${PAPER};display:flex;align-items:center;justify-content:center;overflow:hidden">
    <div style="display:grid;grid-template-columns:repeat(3,${tw}px);gap:${gap}px">${cells.join('')}</div></body></html>`;

  // Details: Van Dam on top, the eight worlds in two columns below him.
  const DW = 1080, DH = 1920, dg = 24, dw = 468, dh = Math.round(dw * 200 / 393);
  const details = `<html><body style="margin:0;width:${DW}px;height:${DH}px;background:${PAPER};display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:56px;overflow:hidden">${face(520)}
    <div style="display:grid;grid-template-columns:repeat(2,${dw}px);gap:${dg}px">${banners.map(s => tile(s, dw, dh)).join('')}</div></body></html>`;

  for (const [name, w, h, html] of [['update-card.png', W, H, card], ['update-details.png', DW, DH, details]]) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(OUT, name) }); console.log(name);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

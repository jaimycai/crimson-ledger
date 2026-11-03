// Promotional image for the promoted in-app purchase "Crimson Pass": 1024x1024, drawn from the app itself.
// The Pass card of the in-app shop (dark crimson gradient, gold) holding a fan of world banners (MapArt.banner): every
// world, opened at once. No text and no app icon (Apple: don't overlay text, don't look like the icon, no screenshots);
// nothing important in the lower-left corner, where the App Store puts the app icon outside the product page.
// Needs the repo served on http://127.0.0.1:8094.
//   node store/promoted/make-pass-art.js            writes pass-1024.png next to this file
const puppeteer = require('puppeteer-core'); const path = require('path');
const BASE = process.env.APP_URL || 'http://127.0.0.1:8094/index.html';
const FAN = ['opgraving', 'ryokan', 'oceaanstomer', 'casino', 'hanok'];
const INK = '#1a1108', GOLD = '#B8955C', GOLD_LIGHT = '#D4B074';

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => localStorage.setItem('crimson-meting', '0'));
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  const banners = await page.evaluate(ids => ids.map(id => MapArt.banner(id).replace('<svg', '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice"')), FAN);
  const S = 1024, cw = 440, ch = Math.round(cw * 200 / 393), n = banners.length;
  // Cards fan out from a pivot far below the centre, like a hand of cards; the middle card on top.
  const cards = banners.map((svg, i) => {
    const t = i - (n - 1) / 2, angle = t * 9, z = 10 - Math.abs(t);
    return `<div style="position:absolute;left:${(S - cw) / 2}px;top:255px;width:${cw}px;height:${ch}px;transform-origin:50% 820px;
      transform:rotate(${angle}deg);z-index:${Math.round(z * 10)};border:8px solid #fbf6ee;outline:4px solid ${INK};border-radius:20px;
      overflow:hidden;box-sizing:border-box;background:#fff;box-shadow:0 22px 44px rgba(0,0,0,.45)">${svg}</div>`;
  }).join('');
  const key = `<svg viewBox="0 0 120 120" width="210" height="210" style="position:absolute;left:${(S - 210) / 2}px;top:592px;z-index:200;
      filter:drop-shadow(0 14px 22px rgba(0,0,0,.5))">
    <circle cx="60" cy="60" r="56" fill="${GOLD}" stroke="${INK}" stroke-width="4"/>
    <circle cx="60" cy="60" r="45" fill="none" stroke="${GOLD_LIGHT}" stroke-width="3" stroke-dasharray="2 5"/>
    <g fill="#fbf6ee" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <circle cx="60" cy="40" r="15"/>
      <path d="M53 52 h14 v34 l-7 7 l-7 -7 z"/>
      <path d="M67 70 h10 v7 h-10 z M67 81 h7 v6 h-7 z"/>
    </g>
    <circle cx="60" cy="40" r="6" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>
  </svg>`;
  const html = `<html><body style="margin:0;width:${S}px;height:${S}px;overflow:hidden;position:relative;
    background:radial-gradient(circle at 50% 38%, #6b3322 0%, #5A2A1C 38%, #2C1810 100%)">
    <div style="position:absolute;inset:34px;border:3px solid ${GOLD};border-radius:28px;opacity:.85"></div>
    <div style="position:absolute;inset:46px;border:1.5px solid ${GOLD_LIGHT};border-radius:20px;opacity:.5"></div>
    ${cards}${key}</body></html>`;
  await page.setViewport({ width: S, height: S, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(__dirname, 'pass-1024.png') }); console.log('pass-1024.png');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

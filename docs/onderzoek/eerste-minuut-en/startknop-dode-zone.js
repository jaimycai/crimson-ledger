// Share of the splash Start button where a tap lands on something else (hit-test grid), and whether a real tap at the centre works.
//   node docs/onderzoek/eerste-minuut-en/startknop-dode-zone.js <baseUrl> <lang> <w> <h>
const puppeteer = require('/Users/jaimycai/Developer/Murdoku/node_modules/puppeteer');
const fs = require('fs'), path = require('path');
const [base, lang, W, H] = process.argv.slice(2);
const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
const v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop();
const exe = path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
(async () => {
  const b = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (iPhone) CrimsonSimulator');
  await p.setViewport({ width: +W, height: +H, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p.setRequestInterception(true);
  p.on('request', r => /^https?:\/\/127\.0\.0\.1/.test(r.url()) ? r.continue() : r.abort());
  await p.evaluateOnNewDocument(l => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', '1'); localStorage.clear(); localStorage.setItem('crimson-lang', l); } }, lang);
  await p.goto(base + '/index.html');
  await p.waitForSelector('#screen-splash.loaded');
  await new Promise(r => setTimeout(r, 1200));
  const res = await p.evaluate(() => {
    const btn = document.getElementById('btn-splash-start'); const r = btn.getBoundingClientRect();
    let dead = 0, tot = 0; const by = {}; const rows = [];
    for (let y = r.top + 1; y < r.bottom - 1; y += 2) { let row = ''; for (let x = r.left + 1; x < r.right - 1; x += 4) { tot++; const t = document.elementFromPoint(x, y); const ok = t && (t === btn || btn.contains(t)); if (!ok) { dead++; const k = t ? (t.id || t.className || t.tagName) : 'none'; by[k] = (by[k] || 0) + 1; } row += ok ? '.' : (t && t.tagName === 'I' ? 'i' : t && t.id === 'splash-status' ? 's' : t && t.id === 'splash-load' ? 'b' : '#'); } rows.push(row); }
    return { btn: { w: Math.round(r.width), h: Math.round(r.height) }, deadShare: +(dead / tot).toFixed(3), by, map: rows, status: document.getElementById('splash-status') && document.getElementById('splash-status').getBoundingClientRect().height };
  });
  // real tap at the centre, then a second tap a bit higher
  const c = await p.evaluate(() => { const r = document.getElementById('btn-splash-start').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top }; });
  await p.touchscreen.tap(c.x, c.y); await new Promise(r => setTimeout(r, 700));
  res.centreTapWorked = await p.evaluate(() => document.querySelector('.screen.active').id !== 'screen-splash');
  if (!res.centreTapWorked) { await p.touchscreen.tap(c.x, c.top + 8); await new Promise(r => setTimeout(r, 700)); res.upperTapWorked = await p.evaluate(() => document.querySelector('.screen.active').id !== 'screen-splash'); }
  console.log(JSON.stringify({ base, lang, size: W + 'x' + H, ...res }));
  await b.close();
})();

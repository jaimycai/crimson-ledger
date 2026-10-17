// Builds the In-App Event art for "Case of the Week": a 1920x1080 event card and a 1080x1920 details image.
// No words on the art, so one pair serves all 23 store languages. Needs the app on http://localhost:8093.
//   node store/events/make-event-art.js
const puppeteer = require('puppeteer-core'); const fs = require('fs'); const path = require('path');
const OUT = __dirname;
(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => localStorage.setItem('crimson-meting', '0'));
  await page.goto('http://localhost:8093/index.html', { waitUntil: 'networkidle0' });
  const svg = await page.evaluate(() => {
    const theme = Themes.get('landhuis') || Themes.list()[0]; let p = null;
    for (let i = 0; i < 8 && !p; i++) p = FloorPlan.generate(4604 + i * 7919, 'meester', theme);
    return App.previewSvg(p).replace('<svg', '<svg width="100%" height="100%"');
  });
  const portrait = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../../art/portretten/vandam-zonder-tekst.png')).toString('base64');
  const html = (w, h, wide) => `<html><body style="margin:0;width:${w}px;height:${h}px;background:#f3e9d8;display:flex;
    flex-direction:${wide ? 'row' : 'column'};align-items:center;justify-content:center;gap:${wide ? 90 : 70}px;overflow:hidden">
    <div style="width:${wide ? 760 : 820}px;height:${wide ? 760 : 820}px;padding:26px;background:#1a1108;border-radius:28px;box-sizing:border-box;
      box-shadow:0 30px 70px rgba(60,30,10,.35)">${svg}</div>
    <img src="${portrait}" style="width:${wide ? 760 : 820}px;height:${wide ? 760 : 820}px;border-radius:50%;object-fit:cover">
  </body></html>`;
  for (const [name, w, h, wide] of [['event-card.png', 1920, 1080, true], ['event-details.png', 1080, 1920, false]]) {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.setContent(html(w, h, wide), { waitUntil: 'load' });
    await page.screenshot({ path: path.join(OUT, name) }); console.log(name);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

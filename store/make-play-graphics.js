// Google Play-afbeeldingen naast de schermafbeeldingen (store/make-store-cards.js play):
//   node store/make-play-graphics.js            (Nederlands en Engels)
//   node store/make-play-graphics.js de ar ja    (elke taal met store/cards-text/<taal>.json)
// uitvoer store/play/feature-<taal>.png (1024×500, de "feature graphic") en store/play/icon-512.png.
// De banner gebruikt de kop en onderregel van de eerste plaat uit store/cards-text/<taal>.json, zodat hij
// hetzelfde zegt als de eerste schermafbeelding. Kluisstand uit DESIGN.md: donker doek, crèmewitte letters,
// rood alleen voor het woord met *sterretjes*, goud voor de naam. Rechts het icoon, links in het donker
// weggevaagd. Een statische server moet de app-map serveren voor de lettertypes (SHOTS_BASE, standaard
// http://127.0.0.1:8094).

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = (process.env.SHOTS_BASE || 'http://127.0.0.1:8094').replace(/\/+$/, '');
const OUT = path.join(__dirname, 'play');
const CODES = process.argv.slice(2).length ? process.argv.slice(2) : ['nl', 'en'];
const { I18n } = require(path.join(ROOT, 'i18n.js'));
const dirOf = code => (I18n.LANGS.find(l => l[0] === code) || [])[2] || 'ltr';

function fontCss() {
  const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
  const faces = css.match(/@font-face\s*{[^}]*}/g) || [];
  const heading = (css.match(/--font-heading:[^;]+;/) || [])[0];
  const body = (css.match(/--font-body:[^;]+;/) || [])[0];
  const a = css.indexOf('/* ── Letters per schrift'), b = css.indexOf('/* ── Reset');
  if (!faces.length || !heading || !body || a < 0 || b < a) throw new Error('style.css: lettertypes niet gevonden');
  return [...faces, `:root { ${heading} ${body} }`, css.slice(a, b)].join('\n')
    .replace(/url\(\s*(['"]?)(?!https?:|data:|\/)([^'")]+)\1\s*\)/g, (m, q, u) => `url('${BASE}/${u}')`);
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const markHl = head => esc(head).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const ICON = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'resources/icon.png')).toString('base64');

const banner = (code, head, sub, fonts) => `<!doctype html>
<html lang="${code}" dir="${dirOf(code)}"><head><meta charset="utf-8"><style>
${fonts}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1024px; height: 500px; }
  body { overflow: hidden; position: relative; background: radial-gradient(120% 140% at 30% 40%, #2A1810 0%, #140B08 70%); -webkit-font-smoothing: antialiased; }
  .art { position: absolute; top: 0; height: 500px; width: 500px; background: url(${ICON}) center / cover;
    -webkit-mask-image: linear-gradient(var(--fade), transparent 0%, rgba(0,0,0,.55) 22%, #000 46%); }
  [dir=ltr] .art { right: 0; --fade: to right; } [dir=rtl] .art { left: 0; --fade: to left; }
  .copy { position: absolute; top: 0; bottom: 0; width: 600px; display: flex; flex-direction: column; justify-content: center; padding: 0 0 0 64px; }
  [dir=rtl] .copy { right: 0; padding: 0 64px 0 0; }
  .name { font-family: var(--font-heading); font-weight: 700; font-size: 22px; letter-spacing: .18em; text-transform: uppercase; color: #E8BE78; }
  .head { margin-top: 14px; font-family: var(--font-body); font-weight: 900; font-size: 64px; line-height: 1.02; letter-spacing: -.01em;
    text-transform: uppercase; color: #FAF5EF; white-space: pre-line; }
  .head em { font-style: normal; color: #E0533A; }
  .sub { margin-top: 16px; font-family: var(--font-body); font-weight: 600; font-size: 22px; line-height: 1.3; color: #C9B7A4; }
</style></head><body>
<div class="art"></div>
<div class="copy"><div class="in"><div class="name">Crimson Ledger</div><div class="head">${markHl(head)}</div><div class="sub">${esc(sub)}</div></div></div>
</body></html>`;

// zelfde aanpak als de platen: letter stap voor stap kleiner tot kop en onderregel binnen de linkerhelft passen
function fit() {
  const inner = document.querySelector('.in'), head = document.querySelector('.head'), sub = document.querySelector('.sub');
  const over = () => inner.offsetHeight > 500 - 60 || head.scrollWidth > head.clientWidth + 1 || sub.scrollWidth > sub.clientWidth + 1;
  let H = 64, S = 22;
  while (over() && H > 34) { H -= 2; head.style.fontSize = H + 'px'; }
  while (over() && S > 14) { S -= 1; sub.style.fontSize = S + 'px'; }
  return { H, S, ok: !over() };
}

function chromePath() {
  const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
  let v; try { v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop(); } catch (e) { v = null; }
  const exe = v && path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  return exe && fs.existsSync(exe) ? exe : undefined;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  // icoon: 512×512, 32-bits PNG zoals Play vraagt
  execFileSync('sips', ['-z', '512', '512', path.join(ROOT, 'resources/icon.png'), '--out', path.join(OUT, 'icon-512.png')], { stdio: 'ignore' });
  const fonts = fontCss();
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath() });
  const problems = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
    let html = '';
    const URL = `${BASE}/__play-banner__.html`;
    await page.setRequestInterception(true);
    page.on('request', req => req.url() === URL ? req.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: html }) : req.continue());
    for (const code of CODES) {
      const [[, head, sub]] = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards-text', `${code}.json`), 'utf8'));
      html = banner(code, head, sub, fonts);
      await page.goto(URL, { waitUntil: 'networkidle0' });
      await page.evaluate(async () => { await document.fonts.ready; });
      const f = await page.evaluate(fit);
      const file = path.join(OUT, `feature-${code}.png`);
      await page.screenshot({ path: file });
      console.log(`${code} feature  kop ${f.H}px onder ${f.S}px${f.ok ? '' : '  PAST NIET'}`);
      if (!f.ok) problems.push(code);
    }
  } finally { await browser.close(); }
  if (problems.length) { console.error('PAST NIET: ' + problems.join(' ')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });

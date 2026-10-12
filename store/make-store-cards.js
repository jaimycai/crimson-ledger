// Schermafbeeldingen met een kop erboven, zoals de meeste App Store-pagina's ze
// tonen, in dezelfde maat als de kale schermafbeeldingen.
//   node store/make-store-cards.js 6.5               (Nederlands en Engels)
//   node store/make-store-cards.js 6.5 de ar ja       (elke taal met store/cards-text/<taal>.json)
// Eerst de kale schermafbeeldingen maken (store/make-screenshots.js, zelfde maat en talen);
// een statische server moet de map van de app serveren voor de lettertypes (SHOTS_BASE, standaard http://127.0.0.1:8094).
//   invoer  store/screenshots{-65}{-<taal>}/   (Nederlands zonder achtervoegsel)
//   uitvoer store/cards{-65}{-<taal>}/
// De teksten staan in store/cards-text/<taal>.json: een lijst van [schermafbeelding, kop, onderregel],
// in de volgorde waarin ze in App Store Connect komen. "\n" in een kop is een vaste regelbreuk.
// Letters per taal zoals in de app (style.css: de @font-face-regels en het blok "Letters per schrift");
// <html lang dir> per taal, rechts-naar-links voor Arabisch en Urdu. Een kop die niet in drie regels past,
// of een woord dat breder is dan de plaat, krijgt stap voor stap een kleinere letter; past het dan nog niet,
// dan meldt het script dat en eindigt het met een fout.

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = (process.env.SHOTS_BASE || 'http://127.0.0.1:8094').replace(/\/+$/, '');
// App Store Connect accepteert per maatgroep maar één formaat:
//   6.9" → 1290×2796   6.5" → 1284×2778
const SIZES = {
  '6.9': { w: 430, h: 932, suffix: '' },
  '6.5': { w: 428, h: 926, suffix: '-65' }
};
const [sizeArg = '6.9', ...codeArgs] = process.argv.slice(2);
const SIZE = SIZES[sizeArg];
if (!SIZE) { console.error('gebruik: node store/make-store-cards.js <6.9|6.5> [talen...]   (standaard: nl en)'); process.exit(2); }
const CODES = codeArgs.length ? codeArgs : ['nl', 'en'];
const tail = code => SIZE.suffix + (code === 'nl' ? '' : '-' + code);
const SRC = code => path.join(__dirname, `screenshots${tail(code)}`);
const OUT = code => path.join(__dirname, `cards${tail(code)}`);
const TEXT = code => path.join(__dirname, 'cards-text', `${code}.json`);

const { I18n } = require(path.join(ROOT, 'i18n.js'));
const dirOf = code => (I18n.LANGS.find(l => l[0] === code) || [])[2] || 'ltr';

// Letters uit style.css: de @font-face-regels, de standaardstapels uit :root en het blok per schrift.
function fontCss() {
  const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
  const faces = css.match(/@font-face\s*{[^}]*}/g) || [];
  const heading = (css.match(/--font-heading:[^;]+;/) || [])[0];
  const body = (css.match(/--font-body:[^;]+;/) || [])[0];
  const a = css.indexOf('/* ── Letters per schrift'), b = css.indexOf('/* ── Reset');
  if (!faces.length || !heading || !body || a < 0 || b < a) throw new Error('style.css: lettertypes niet gevonden (blok "Letters per schrift" verplaatst?)');
  return [...faces, `:root { ${heading} ${body} }`, css.slice(a, b)].join('\n')
    .replace(/url\(\s*(['"]?)(?!https?:|data:|\/)([^'")]+)\1\s*\)/g, (m, q, u) => `url('${BASE}/${u}')`);
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// regelafstand per schrift: Nastaliq en de Indiase schriften zijn hoger dan Latijn
const LEADING = { ur: [1.7, 1.9], ar: [1.4, 1.6], hi: [1.35, 1.55], mr: [1.35, 1.55], bn: [1.35, 1.55], te: [1.4, 1.6], zh: [1.25, 1.5], ja: [1.25, 1.5], ko: [1.25, 1.5], vi: [1.22, 1.45] };

const card = (code, src, head, sub, dark, fonts) => {
  const [lhHead, lhSub] = LEADING[code] || [1.12, 1.4];
  return `<!doctype html>
<html lang="${code}" dir="${dirOf(code)}"><head><meta charset="utf-8">
<style>
${fonts}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${SIZE.w}px; height: ${SIZE.h}px; }
  body {
    overflow: hidden;
    display: flex; flex-direction: column; align-items: center;
    -webkit-font-smoothing: antialiased;
    background: ${dark
      ? 'radial-gradient(120% 80% at 50% 0%, #33261d 0%, #201812 60%, #17110d 100%)'
      : 'radial-gradient(120% 80% at 50% 0%, #fbf5ea 0%, #f2e8d4 55%, #e7d9bd 100%)'};
  }
  /* vaste hoogte, zodat een kop van één, twee of drie regels het toestel
     op alle platen even hoog laat staan */
  .top {
    height: 176px; width: 100%; flex: none;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
  }
  .top-in { width: 100%; display: flex; flex-direction: column; align-items: center; }
  .head {
    font-family: var(--font-heading);
    font-weight: 700; font-size: 30px; line-height: ${lhHead}; text-align: center;
    color: ${dark ? '#f6e9cf' : '#8c2f2f'};
    width: 100%; padding: 0 24px; white-space: pre-line; text-wrap: balance;
    letter-spacing: .005em;
  }
  .sub {
    font-family: var(--font-body);
    font-size: 13.5px; line-height: ${lhSub}; text-align: center;
    color: ${dark ? '#bda787' : '#6b5b48'};
    width: 100%; margin-top: 10px; padding: 0 34px; text-wrap: balance;
  }
  :lang(ko) .head, :lang(ko) .sub { word-break: keep-all; }
  :lang(ja) .head, :lang(ja) .sub, :lang(zh) .head, :lang(zh) .sub { line-break: strict; }
  .rule { width: 46px; height: 2px; margin-top: 16px; background: #a8802c; opacity: .85; flex: none; }
  .phone {
    width: 340px; margin-top: 10px; flex: none;
    border: 3px solid ${dark ? '#0d0a07' : '#2b2118'};
    border-radius: 30px; overflow: hidden;
    box-shadow: 0 18px 40px rgba(0,0,0,${dark ? '.55' : '.28'});
    background: #fff;
  }
  .phone img { display: block; width: 100%; }
</style></head>
<body>
<div class="top"><div class="top-in">
  <div class="head">${esc(head)}</div>
  <div class="sub">${esc(sub)}</div>
  <div class="rule"></div>
</div></div>
<div class="phone"><img src="${src}" alt=""></div>
</body></html>`;
};

// Meet in de pagina en maak de letter kleiner tot alles past: kop hoogstens drie regels,
// onderregel hoogstens drie, geen woord breder dan de plaat, alles binnen de vaste kopruimte
// (met 10px lucht boven en onder: Arabische en Indiase letters steken boven hun regel uit).
function fitInPage() {
  const top = document.querySelector('.top'), inner = document.querySelector('.top-in');
  const head = document.querySelector('.head'), sub = document.querySelector('.sub');
  const lines = el => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
  // breder dan de tekstruimte: kijk naar elke regel van de tekst zelf, niet naar scrollWidth
  // (een te lang woord loopt eerst de opvulling in en scrollWidth ziet dat niet)
  const wide = el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const L = r.left + parseFloat(cs.paddingLeft) - 1, R = r.right - parseFloat(cs.paddingRight) + 1;
    const range = document.createRange(); range.selectNodeContents(el);
    return [...range.getClientRects()].some(q => q.width && (q.left < L || q.right > R));
  };
  let H = 30, S = 13.5;
  const MIN_H = 18, MIN_S = 10.5;
  const state = () => {
    head.style.fontSize = H + 'px'; sub.style.fontSize = S + 'px';
    return { headLines: lines(head), subLines: lines(sub), headWide: wide(head), subWide: wide(sub), tall: inner.offsetHeight > top.clientHeight - 20 };
  };
  let s = state();
  for (let guard = 0; guard < 80; guard++) {
    const headBad = s.headLines > 3 || s.headWide, subBad = s.subLines > 3 || s.subWide;
    if (!headBad && !subBad && !s.tall) break;
    if (headBad && H > MIN_H) H -= 1;
    else if (subBad && S > MIN_S) S -= 0.5;
    else if (s.tall && H > 22) H -= 1;
    else if (s.tall && S > MIN_S) S -= 0.5;
    else if (s.tall && H > MIN_H) H -= 1;
    else break;
    s = state();
  }
  const ok = s.headLines <= 3 && s.subLines <= 3 && !s.headWide && !s.subWide && !s.tall;
  const img = document.querySelector('.phone img');
  return { ...s, H, S, ok, imgOk: !!(img && img.complete && img.naturalWidth) };
}

// welke letters Chrome echt gebruikt voor een element (zo zie je of Hindi in Kohinoor staat, enz.)
async function usedFonts(client, selector) {
  try {
    const { root } = await client.send('DOM.getDocument', { depth: 0 });
    const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId });
    return fonts.sort((a, b) => b.glyphCount - a.glyphCount).map(f => f.familyName).join(', ');
  } catch (e) { return '?'; }
}

function chromePath() {
  const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
  let v; try { v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop(); } catch (e) { v = null; }
  const exe = v && path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  return exe && fs.existsSync(exe) ? exe : undefined;
}

async function run(browser, code, fonts) {
  if (!fs.existsSync(TEXT(code))) throw new Error(`${TEXT(code)} ontbreekt`);
  const list = JSON.parse(fs.readFileSync(TEXT(code), 'utf8'));
  if (!Array.isArray(list) || !list.every(r => Array.isArray(r) && r.length === 3 && r.every(x => typeof x === 'string'))) {
    throw new Error(`${TEXT(code)}: verwacht een lijst van [schermafbeelding, kop, onderregel]`);
  }
  fs.mkdirSync(OUT(code), { recursive: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.setViewport({ width: SIZE.w, height: SIZE.h, deviceScaleFactor: 3 });
  // de plaat komt van dezelfde herkomst als de server, zodat de lettertypes zonder CORS laden;
  // de schermafbeelding gaat er als data-URL in, precies zoals hij op schijf staat
  let html = '';
  const CARD_URL = `${BASE}/__store-card__.html`;
  await page.setRequestInterception(true);
  page.on('request', req => req.url() === CARD_URL
    ? req.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: html })
    : req.continue());
  const client = await page.createCDPSession();
  await client.send('DOM.enable'); await client.send('CSS.enable');
  const problems = [];
  for (let i = 0; i < list.length; i++) {
    const [name, head, sub] = list[i];
    const srcFile = path.join(SRC(code), `${name}.png`);
    if (!fs.existsSync(srcFile)) throw new Error(`${srcFile} ontbreekt: eerst node store/make-screenshots.js ${sizeArg} ${code}`);
    const src = 'data:image/png;base64,' + fs.readFileSync(srcFile).toString('base64');
    html = card(code, src, head, sub, i % 2 === 1, fonts);
    await page.goto(CARD_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => { document.body.offsetHeight; await document.fonts.ready; });
    const fit = await page.evaluate(fitInPage);
    await page.evaluate(async () => { await document.fonts.ready; await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
    const file = path.join(OUT(code), `${String(i + 1).padStart(2, '0')}-${name.slice(3)}.png`);
    await page.screenshot({ path: file });
    const fHead = await usedFonts(client, '.head'), fSub = await usedFonts(client, '.sub');
    console.log(`${code} ${path.basename(file)}  kop ${fit.H}px ${fit.headLines} r. [${fHead}]  onder ${fit.S}px ${fit.subLines} r. [${fSub}]${fit.ok ? '' : '  PAST NIET'}${fit.imgOk ? '' : '  SCHERMAFBEELDING NIET GELADEN'}`);
    if (!fit.ok || !fit.imgOk) problems.push(`${code} ${path.basename(file)}: ${JSON.stringify(fit)}`);
  }
  await page.close();
  return problems;
}

(async () => {
  const fonts = fontCss();
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath(), protocolTimeout: 120000 });
  const problems = [];
  try { for (const code of CODES) problems.push(...await run(browser, code, fonts)); }
  finally { await browser.close(); }
  if (problems.length) { console.error('PROBLEMEN:\n' + problems.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });

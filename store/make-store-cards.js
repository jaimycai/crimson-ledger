// Schermafbeeldingen met een kop erboven, zoals de meeste App Store-pagina's ze
// tonen, in dezelfde maat als de kale schermafbeeldingen.
//   node store/make-store-cards.js 6.5               (Nederlands en Engels)
//   node store/make-store-cards.js 6.5 de ar ja       (elke taal met store/cards-text/<taal>.json)
// Eerst de kale schermafbeeldingen maken (store/make-screenshots.js, zelfde maat en talen);
// een statische server moet de map van de app serveren voor de lettertypes (SHOTS_BASE, standaard http://127.0.0.1:8094).
//   invoer  store/screenshots{-65}{-<taal>}/   (Nederlands zonder achtervoegsel)
//   uitvoer store/cards{-65}{-<taal>}/
// De teksten staan in store/cards-text/<taal>.json: een lijst van [schermafbeelding, kop, onderregel],
// in de volgorde waarin ze in App Store Connect komen. "\n" in een kop is een vaste regelbreuk, *woord* kleurt rood.
// Ontwerp sinds 28-10-2026 (store/CONVERSIE.md, Jaimy koos "optie A in een iPhone"): wat in een zoekresultaat op
// postzegelformaat werkt, zoals bij de koplopers in het genre. Lichte achtergrond met een eigen kleur per plaat,
// korte kop in een dikke schreefloze letter in hoofdletters, het hele scherm in een iPhone die onderaan uit beeld loopt.
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
// Google Play wil hoogstens 2:1, en alleen 9:16 vanaf 1080×1920 komt in aanmerking voor de uitgelichte plekken.
// Daarom "play": 1080×1920, met de 6.5"-schermafbeeldingen in een Android-toestel (een iPhone hoort niet op Google Play).
//   uitvoer store/cards-play{-<taal>}/
const SIZES = {
  '6.9': { w: 430, h: 932, src: '', out: '', frame: 'iphone', top: 222, head: 44, sub: 16, screenW: 366 },
  '6.5': { w: 428, h: 926, src: '-65', out: '-65', frame: 'iphone', top: 222, head: 44, sub: 16, screenW: 366 },
  'play': { w: 360, h: 640, src: '-65', out: '-play', frame: 'android', top: 190, head: 44, sub: 16, screenW: 290 }
};
const [sizeArg = '6.9', ...codeArgs] = process.argv.slice(2);
const SIZE = SIZES[sizeArg];
if (!SIZE) { console.error('gebruik: node store/make-store-cards.js <6.9|6.5|play> [talen...]   (standaard: nl en)'); process.exit(2); }
const CODES = codeArgs.length ? codeArgs : ['nl', 'en'];
const tail = (suffix, code) => suffix + (code === 'nl' ? '' : '-' + code);
const SRC = code => path.join(__dirname, `screenshots${tail(SIZE.src, code)}`);
const OUT = code => path.join(__dirname, `cards${tail(SIZE.out, code)}`);
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

// een eigen lichte kleur per plaat, in een vaste volgorde
const BG = ['#FFF1DC', '#FDE4E1', '#E4EEFB', '#E5F1DF', '#EFE7F8'];
const markHl = head => esc(head).replace(/\*([^*]+)\*/g, '<em>$1</em>');

// iPhone 17 Pro (402 x 874 pt, Dynamic Island 126 x 37), geschaald naar de schermbreedte hier
const SCREEN_W = SIZE.screenW;
const pt = n => Math.round(n * SCREEN_W / 402);
const STATUS = `<div class="status"><span class="time">9:41</span><span class="icons">
  <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
  <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .8 10.4 10.4 0 0 0 .8 3.7L2 5c1.6-1.5 3.7-2.4 6-2.4zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.8 6.8 0 0 0 8 4.4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3zM8 9.6l2.2-2.3a3.2 3.2 0 0 0-4.4 0z"/></svg>
  <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" opacity=".45"/></svg>
</span></div>`;
// Android: statusbalk zoals op een Pixel (tijd links, wifi, bereik en een staande batterij rechts)
const STATUS_ANDROID = `<div class="status-a"><span class="time">9:41</span><span class="icons">
  <svg width="14" height="12" viewBox="0 0 16 12"><path d="M8 11.5 0 3a11.5 11.5 0 0 1 16 0z"/></svg>
  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M12 0v12H0z"/></svg>
  <svg width="8" height="13" viewBox="0 0 8 13"><rect x="2.5" y="0" width="3" height="1.5" rx=".5"/><rect x="0" y="1.2" width="8" height="11.8" rx="1.6"/></svg>
</span></div>`;

const DEVICE_CSS = {
  iphone: `
  .device {
    position: relative; margin-top: 6px; width: ${SCREEN_W + 20}px; flex: none; padding: 3px; border-radius: 64px; direction: ltr;
    background: linear-gradient(135deg, #d9d4cc 0%, #8a857e 18%, #efebe5 50%, #7d7871 82%, #cfcac2 100%);
    box-shadow: 0 30px 60px rgba(60,30,10,.30), 0 6px 14px rgba(60,30,10,.18);
  }
  .bezel { background: #0b0b0c; border-radius: 61px; padding: 7px; }
  .screen { position: relative; border-radius: 54px; overflow: hidden; background: #fff; height: ${pt(874)}px; }
  .screen img { display: block; width: 100%; }
  .island { position: absolute; top: 11px; left: 50%; transform: translateX(-50%); width: ${pt(126)}px; height: ${pt(37)}px; border-radius: 20px; background: #000; z-index: 3; }
  .status { position: absolute; top: 0; left: 0; right: 0; height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 4px 30px 0 40px; z-index: 2; color: #000; font-family: -apple-system, system-ui, sans-serif; }
  .status .time { font-weight: 600; font-size: 16px; letter-spacing: -.01em; }
  .status .icons { display: flex; gap: 6px; align-items: center; } .status svg { fill: currentColor; }
  .btn { position: absolute; width: 4px; border-radius: 2px; left: -3px; background: linear-gradient(90deg, #6f6a64, #cfcac2); }
  .btn.r { left: auto; right: -3px; background: linear-gradient(90deg, #cfcac2, #6f6a64); }`,
  // vlakke donkere rand, smalle gelijke bezel, rond cameragaatje in het midden, knoppen rechts
  android: `
  .device {
    position: relative; margin-top: 6px; width: ${SCREEN_W + 16}px; flex: none; padding: 2px; border-radius: 42px; direction: ltr;
    background: linear-gradient(135deg, #4a4744 0%, #232120 30%, #575350 55%, #1e1c1b 100%);
    box-shadow: 0 26px 52px rgba(60,30,10,.30), 0 6px 14px rgba(60,30,10,.18);
  }
  .bezel { background: #0b0b0c; border-radius: 40px; padding: 6px; }
  .screen { position: relative; border-radius: 34px; overflow: hidden; background: #fff; height: ${Math.round(SCREEN_W * 2778 / 1284)}px; }
  .screen img { display: block; width: 100%; }
  .hole { position: absolute; top: 11px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; border-radius: 50%; background: #000; z-index: 3; box-shadow: inset 0 0 0 2px #1b1b1d; }
  .status-a { position: absolute; top: 0; left: 0; right: 0; height: 34px; display: flex; align-items: center; justify-content: space-between; padding: 0 22px 0 24px; z-index: 2; color: #1b1b1b; font-family: Roboto, 'Google Sans', system-ui, sans-serif; }
  .status-a .time { font-weight: 500; font-size: 13px; }
  .status-a .icons { display: flex; gap: 5px; align-items: center; } .status-a svg { fill: currentColor; }
  .btn.r { position: absolute; width: 3px; border-radius: 2px; right: -2px; background: linear-gradient(90deg, #575350, #2a2826); }`
};
const DEVICE_HTML = {
  iphone: src => `<div class="device">
  <div class="btn" style="top:118px;height:30px"></div><div class="btn" style="top:172px;height:56px"></div><div class="btn" style="top:240px;height:56px"></div>
  <div class="btn r" style="top:196px;height:86px"></div><div class="btn r" style="top:420px;height:52px"></div>
  <div class="bezel"><div class="screen"><div class="island"></div>${STATUS}<img src="${src}" alt=""></div></div>
</div>`,
  android: src => `<div class="device">
  <div class="btn r" style="top:100px;height:34px"></div><div class="btn r" style="top:160px;height:70px"></div>
  <div class="bezel"><div class="screen"><div class="hole"></div>${STATUS_ANDROID}<img src="${src}" alt=""></div></div>
</div>`
};

const card = (code, src, head, sub, i, fonts) => {
  const [lhHead, lhSub] = LEADING[code] || [1.02, 1.3];
  return `<!doctype html>
<html lang="${code}" dir="${dirOf(code)}"><head><meta charset="utf-8">
<style>
${fonts}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${SIZE.w}px; height: ${SIZE.h}px; }
  body {
    overflow: hidden; background: ${BG[i % BG.length]};
    display: flex; flex-direction: column; align-items: center;
    -webkit-font-smoothing: antialiased;
  }
  /* vaste hoogte, zodat een kop van één, twee of drie regels het toestel op alle platen even hoog laat staan */
  .top {
    height: ${SIZE.top}px; width: 100%; flex: none; padding-top: 14px;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
  }
  .top-in { width: 100%; display: flex; flex-direction: column; align-items: center; }
  .head {
    font-family: var(--font-body); font-weight: 900; font-size: ${SIZE.head}px; line-height: ${lhHead};
    letter-spacing: -.01em; text-transform: uppercase; text-align: center; color: #2a1a12;
    width: 100%; padding: 0 22px; white-space: pre-line; text-wrap: balance;
  }
  .head em { font-style: normal; color: #C43E26; }
  .sub {
    font-family: var(--font-body); font-weight: 600; font-size: ${SIZE.sub}px; line-height: ${lhSub};
    text-align: center; color: #5b4636; width: 100%; margin-top: 12px; padding: 0 30px; text-wrap: balance;
  }
  :lang(ko) .head, :lang(ko) .sub { word-break: keep-all; }
  :lang(ja) .head, :lang(ja) .sub, :lang(zh) .head, :lang(zh) .sub { line-break: strict; }
${DEVICE_CSS[SIZE.frame]}
</style></head>
<body>
<div class="top"><div class="top-in">
  <div class="head">${markHl(head)}</div>
  <div class="sub">${esc(sub)}</div>
</div></div>
${DEVICE_HTML[SIZE.frame](src)}
</body></html>`;
};

// Meet in de pagina en maak de letter kleiner tot alles past: kop hoogstens drie regels,
// onderregel hoogstens twee, geen woord breder dan de plaat, alles binnen de vaste kopruimte
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
  let H = 44, S = 16;
  const MIN_H = 24, MIN_S = 12;
  const state = () => {
    head.style.fontSize = H + 'px'; sub.style.fontSize = S + 'px';
    return { headLines: lines(head), subLines: lines(sub), headWide: wide(head), subWide: wide(sub), tall: inner.offsetHeight > top.clientHeight - 20 };
  };
  let s = state();
  for (let guard = 0; guard < 80; guard++) {
    const headBad = s.headLines > 3 || s.headWide, subBad = s.subLines > 2 || s.subWide;
    if (!headBad && !subBad && !s.tall) break;
    if (headBad && H > MIN_H) H -= 1;
    else if (subBad && S > MIN_S) S -= 0.5;
    else if (s.tall && H > 32) H -= 1;
    else if (s.tall && S > MIN_S) S -= 0.5;
    else if (s.tall && H > MIN_H) H -= 1;
    else break;
    s = state();
  }
  const ok = s.headLines <= 3 && s.subLines <= 2 && !s.headWide && !s.subWide && !s.tall;
  const img = document.querySelector('.screen img');
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
  // oude platen weg: na een andere volgorde zouden ze met een andere naam blijven staan
  for (const f of fs.readdirSync(OUT(code))) if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT(code), f));
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
    html = card(code, src, head, sub, i, fonts);
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

// Maakt de App Store-schermafbeeldingen, per taal.
// Een statische server moet de map van de app serveren (geen bouwstap nodig), bijvoorbeeld
//   python3 -m http.server 8094 --bind 127.0.0.1
// en dan:
//   node store/make-screenshots.js 6.5             (Nederlands en Engels)
//   node store/make-screenshots.js 6.5 de fr ja     (elke taal met een i18n/<taal>.js)
//   SHOTS_BASE=http://localhost:8090 node store/make-screenshots.js 6.9 nl
// App Store Connect kent twee maatgroepen voor de iPhone en accepteert alleen
// de exacte maat van de groep waarin je uploadt:
//   6.9" → 1290×2796, uitvoer store/screenshots/, store/screenshots-en/, store/screenshots-<taal>/
//   6.5" → 1284×2778, uitvoer store/screenshots-65/, store/screenshots-65-en/, store/screenshots-65-<taal>/
// Vereist: puppeteer (devDependency) en Chrome for Testing in ~/.cache/puppeteer/chrome.

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const wait = ms => new Promise(r => setTimeout(r, ms));
const BASE = (process.env.SHOTS_BASE || 'http://127.0.0.1:8094').replace(/\/+$/, '');
const SIZES = {
  '6.9': { w: 430, h: 932, suffix: '' },        // 1290×2796
  '6.5': { w: 428, h: 926, suffix: '-65' }      // 1284×2778
};
const [sizeArg = '6.9', ...codeArgs] = process.argv.slice(2);
const SIZE = SIZES[sizeArg];
if (!SIZE) { console.error('gebruik: node store/make-screenshots.js <6.9|6.5> [talen...]   (standaard: nl en)'); process.exit(2); }
const CODES = codeArgs.length ? codeArgs : ['nl', 'en'];

const { I18n } = require(path.join(ROOT, 'i18n.js'));
for (const c of CODES) {
  if (!I18n.supported(c)) { console.error(`onbekende taal: ${c} (kies uit ${I18n.LANGS.map(l => l[0]).join(' ')})`); process.exit(2); }
  if (c !== 'nl' && !fs.existsSync(path.join(ROOT, 'i18n', `${c}.js`))) { console.error(`i18n/${c}.js ontbreekt: eerst node build-pack.js ${c}`); process.exit(2); }
}
const outDir = code => path.join(__dirname, `screenshots${SIZE.suffix}${code === 'nl' ? '' : '-' + code}`);

// nieuwste Chrome for Testing (mac_arm-131… < mac_arm-153…)
function chromePath() {
  const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
  let v; try { v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop(); } catch (e) { v = null; }
  const exe = v && path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  return exe && fs.existsSync(exe) ? exe : undefined;
}

// Wacht tot letters en afbeeldingen (de portretten) er echt staan; geeft kapotte afbeeldingen terug.
async function settle(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images].filter(i => i.getClientRects().length);
    await Promise.all(imgs.map(i => (i.complete && i.naturalWidth)
      ? (i.decode ? i.decode().catch(() => {}) : null)
      : new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); setTimeout(r, 4000); })));
    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    return imgs.filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src'));
  });
}

// De winkel toont de echte App Store-prijzen van de hoofdmarkt van elke taal (store/metadata/prices.json, uit
// store/asc-prices.js), in de schrijfwijze van die markt en met westerse cijfers zoals de app.
const MARKET = { nl: ['NLD', 'nl-NL'], en: ['USA', 'en-US'], de: ['DEU', 'de-DE'], es: ['ESP', 'es-ES'], fr: ['FRA', 'fr-FR'],
  it: ['ITA', 'it-IT'], pt: ['BRA', 'pt-BR'], ru: ['RUS', 'ru-RU'], tr: ['TUR', 'tr-TR'], id: ['IDN', 'id-ID'], vi: ['VNM', 'vi-VN'],
  ar: ['SAU', 'ar-SA'], ur: ['PAK', 'ur-PK'], hi: ['IND', 'hi-IN'], mr: ['IND', 'mr-IN'], bn: ['IND', 'bn-IN'], te: ['IND', 'te-IN'],
  zh: ['SGP', 'zh-SG'], ja: ['JPN', 'ja-JP'], ko: ['KOR', 'ko-KR'] };
function pricesFor(lang) {
  const file = path.join(__dirname, 'metadata', 'prices.json');
  if (!fs.existsSync(file) || !MARKET[lang]) return {};
  const [terr, locale] = MARKET[lang], p = JSON.parse(fs.readFileSync(file, 'utf8'))[terr];
  if (!p) return {};
  const fmt = v => new Intl.NumberFormat(locale + '-u-nu-latn', { style: 'currency', currency: p.currency, minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: Number.isInteger(v) ? 0 : 2 }).format(v);
  const out = {}, A = 'nl.crimsonledger.app';
  for (const [id, v] of Object.entries(p)) if (id !== 'currency') out[id] = p.currency === 'SGD' ? fmt(v).replace('$', 'S$') : fmt(v);
  for (const w of ['hotel', 'ruimte', 'museum', 'trein', 'circus', 'skihut']) out[`${A}.world.${w}`] = out[`${A}.world.circus`];
  return out;
}
async function run(browser, lang) {
  const OUT = outDir(lang);
  fs.mkdirSync(OUT, { recursive: true });
  const ctx = await browser.createBrowserContext();   // eigen opslag per taal
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);
  await page.setViewport({ width: SIZE.w, height: SIZE.h, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  // niets naar buiten: 'CrimsonSimulator' in de user agent zet de tellers van meting.js uit (zoals in de
  // iOS-simulator), en verzoeken buiten de testserver worden afgebroken
  await page.setUserAgent((await browser.userAgent()) + ' CrimsonSimulator');
  await page.setRequestInterception(true);
  page.on('request', r => (r.url().startsWith(BASE + '/') || r.url().startsWith('data:') || r.url().startsWith('blob:')) ? r.continue() : r.abort('blockedbyclient'));
  page.on('pageerror', e => console.log(lang, 'PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.log(lang, 'CONSOLE', m.text()); });
  await page.evaluateOnNewDocument((lang, prices) => {
    localStorage.setItem('crimson-lang', lang);
    localStorage.setItem('crimson-store-prices', JSON.stringify(prices));
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
    localStorage.setItem('crimson-medals', JSON.stringify({ 'eerste-zaak': today, 'drie-dagen': today, snel: today, deel: today }));   // past bij de voortgang hierboven
    localStorage.setItem('crimson-newclue-seen', JSON.stringify(['room', 'not-room', 'room-pos', 'near', 'row', 'col', 'same-room', 'not-same-room', 'left-of', 'above', 'furniture', 'alone', 'corner', 'wall', 'middle', 'next-to']));
  }, lang, pricesFor(lang));
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle0' });
  const got = await page.evaluate(() => document.documentElement.lang);
  if (got !== lang) throw new Error(`${lang}: de app draait in "${got}" (taalbestand niet geladen?)`);
  await page.addStyleTag({ content: ':root{--sat:59px;--sab:34px} #toast, #medal-toast { display: none !important }' });
  await wait(1100);
  await page.evaluate(() => document.getElementById('btn-splash-start').click()); await wait(600);
  await page.evaluate(() => { const t = document.getElementById('toast'); if (t) t.classList.remove('show'); }); await wait(100);
  const shot = async name => {
    await page.evaluate(() => { document.querySelectorAll('.toast, #toast').forEach(t => t.classList.remove('show', 'active')); });
    const broken = await settle(page);
    if (broken.length) console.log(lang, name, 'AFBEELDING ONTBREEKT', broken.join(' '));
    await page.screenshot({ path: `${OUT}/${name}.png` });
    console.log(lang, name);
  };
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
  // een nieuwe wereld uit 1.4 (geen winkel en geen prijzen op schermafbeeldingen): Casino Azur,
  // met de Pass in bezit zodat hij open staat
  await page.evaluate(() => { App.navigateTo('menu'); Store.save({ pass: true, worlds: [], cosmetics: false }); }); await wait(300);
  const playIn = async (theme, idx, placed) => {
    await page.evaluate((theme, idx) => {
      const ch = Campaign.list().find(c => c.theme === theme) || Campaign.list()[0];
      App.startCampaignCase(ch.key, idx);
    }, theme, idx); await wait(600);
    await page.evaluate(() => { const b = document.getElementById('btn-part-go'); if (b && document.getElementById('part-modal').classList.contains('active')) b.click(); }); await wait(400);
    await page.evaluate(() => { const b = document.getElementById('btn-briefing-go'); if (b) b.click(); }); await wait(400);
    await page.evaluate(() => { const ok = document.getElementById('btn-newclue-ok'); if (ok && document.getElementById('newclue-modal').classList.contains('active')) ok.click(); }); await wait(400);
    await page.evaluate(placed => {
      const p = Board.puzzle;
      for (let i = 0; i < placed; i++) Board.placements[i] = { x: p.solution[i].x, y: p.solution[i].y };
      Board.after(); Board.deckIdx = placed; if (Board.renderDeck) Board.renderDeck();
    }, placed); await wait(400);
  };
  await playIn(process.env.SHOTS_NEW_WORLD || 'casino', 2, 3);
  await shot('08-nieuw');
  // een tweede wereld: het circus
  await playIn('circus', 2, 3);
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
  await ctx.close();
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath(), protocolTimeout: 120000 });
  try { for (const code of CODES) await run(browser, code); }
  finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });

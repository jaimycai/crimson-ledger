// Taalcontrole in een echte browser: per schermmaat (320×568 en 375×667) de app openen in één taal,
// fouten verzamelen, tests/overflow-scan.js draaien en van alle belangrijke schermen een PNG maken.
//   node tests/qa-lang.js <taal> <uitvoermap>
// Vereist: een statische server op de map van de app (QA_BASE, standaard http://127.0.0.1:8094),
// puppeteer (devDependency) en Chrome for Testing in ~/.cache/puppeteer/chrome.
// Schrijft PNG's naar <uitvoermap>/<maat>/ en drukt één JSON-object af:
//   { code, viewports: [{ size, checked, overflow, errors, skipped, dutch, blocked }], shots, dir, lang }
//   overflow — tekst die niet past, als { screen, kind, text, where }. kind uit overflowScan: afgekapt, loopt door,
//              buiten beeld, buiten de knop; hier toegevoegd: half buiten de rand, onder of boven afgesneden,
//              pagina te breed
//   errors   — pageerror, console.error, mislukte verzoeken (404 …)
//   skipped  — schermen die de controle niet kon bereiken (geen fout van de app, wel nakijken)
//   dutch    — zichtbare tekst met typisch Nederlandse woorden (alleen bij een andere taal dan nl)
//   blocked  — verzoeken naar buiten de testserver; die worden afgebroken (geen tellers, geen netwerk)
// Exitcode 0 als de ronde af is (ook met vondsten), 1 bij een time-out of crash (dan staat er "error" in de JSON,
// met wat er tot dan toe gevonden was). Time-out: 4 minuten, of QA_TIMEOUT_MS.

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const [code, outArg] = process.argv.slice(2);
if (!code || !outArg) { console.error('gebruik: node tests/qa-lang.js <taal> <uitvoermap>'); process.exit(2); }
const OUTDIR = path.resolve(outArg);
const BASE = (process.env.QA_BASE || 'http://127.0.0.1:8094').replace(/\/+$/, '');
const VIEWPORTS = [{ w: 320, h: 568 }, { w: 375, h: 667 }];
const TOTAL_MS = +process.env.QA_TIMEOUT_MS || 4 * 60 * 1000;   // alles samen; daarna stopt de ronde
const wait = ms => new Promise(r => setTimeout(r, ms));

const { I18n } = require(path.join(ROOT, 'i18n.js'));
if (!I18n.supported(code)) { console.error(`onbekende taal: ${code}`); process.exit(2); }
if (code !== 'nl' && !fs.existsSync(path.join(ROOT, 'i18n', `${code}.js`))) { console.error(`i18n/${code}.js ontbreekt: eerst node build-pack.js ${code}`); process.exit(2); }

// overflow-scan.js, met twee aanpassingen die alleen hier gelden:
//  - de vensters heten in index.html .modal-overlay (niet .modal), anders slaat de scan ze over;
//  - overflowScan('naam') controleert alleen wat nu in beeld is, zodat elk schermpje hieronder mee kan.
function scanSource() {
  let src = fs.readFileSync(path.join(__dirname, 'overflow-scan.js'), 'utf8');
  src = src.replace(/\.modal\.active/g, '.modal-overlay.active');
  const sig = 'async function overflowScan() {', anchor = "  const start = [...document.querySelectorAll('#screen-splash button')]";
  const here = src.includes(sig) && src.includes(anchor);
  if (here) src = src.replace(sig, 'async function overflowScan(onlyHere) {')
    .replace(anchor, '  if (onlyHere) { scan(onlyHere); return { checked, items: out }; }\n' + anchor);
  return { src: src + '\nwindow.overflowScan = overflowScan;', here };
}

function chromePath() {
  const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
  let v; try { v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop(); } catch (e) { v = null; }
  const exe = v && path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  return exe && fs.existsSync(exe) ? exe : undefined;
}

// zelfde startstand als store/make-screenshots.js, plus een afgemaakt deel I (voor de bewijskist)
function seed(lang) {
  localStorage.setItem('crimson-lang', lang);
  localStorage.setItem('crimson-board-tutorial-done', '1'); localStorage.setItem('crimson-board-tip-seen', '1');
  localStorage.setItem('crimson-store-mock', '1');
  localStorage.setItem('crimson-board-stats', JSON.stringify({ solved: 21, clean: 9, best: 154 }));
  localStorage.setItem('crimson-points', '9840');
  localStorage.setItem('crimson-streak', JSON.stringify({ count: 6, lastDate: new Date(Date.now() - 86400000).toDateString() }));
  localStorage.setItem('crimson-freezes', '1');
  if (!sessionStorage.getItem('qa-seeded')) {   // alleen bij de eerste keer laden: wat de app daarna schrijft blijft staan
    sessionStorage.setItem('qa-seeded', '1');
    const camp = {}; [3, 3, 2, 3, 1, 3, 2, 3].forEach((s, i) => { camp['landhuis-' + i] = s; }); localStorage.setItem('crimson-campaign', JSON.stringify(camp));
    localStorage.setItem('crimson-mini', JSON.stringify({ 'landhuis': 3 }));
    const d = new Date(); const log = []; for (let i = 1; i <= 5; i++) { const x = new Date(d); x.setDate(d.getDate() - i); log.push(x.toISOString().slice(0, 10)); }
    localStorage.setItem('crimson-daily-log', JSON.stringify(log));
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('crimson-medals', JSON.stringify({ first: today, streak3: today, fast: today, nohint: today, part1: today }));
    localStorage.setItem('crimson-newclue-seen', JSON.stringify(['room', 'not-room', 'room-pos', 'near', 'row', 'col', 'same-room', 'not-same-room', 'left-of', 'above', 'furniture', 'alone', 'corner', 'wall', 'middle', 'next-to']));
  }
}

// in de pagina: wacht op letters en afbeeldingen (portretten), geef kapotte afbeeldingen terug
async function settle(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images].filter(i => i.getClientRects().length);
    await Promise.all(imgs.map(i => (i.complete && i.naturalWidth)
      ? (i.decode ? i.decode().catch(() => {}) : null)
      : new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); setTimeout(r, 3000); })));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    return imgs.filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src'));
  });
}

// Aanvulling op overflow-scan.js, die tekst in een scrollende bak overslaat (en vrijwel elk scherm en venster
// scrollt verticaal, waardoor ook overflow-x op auto komt). Hier: elke tekstregel die over de rand van zijn
// zichtbare bak of van het scherm heen valt, dus half te zien is. Helemaal buiten de bak telt niet (zo werkt
// het bladerdek). Rijen die met opzet zijwaarts scrollen staan in SIDEWAYS.
function edgeScan(screen) {
  const SIDEWAYS = '.world-tabs, .board-suspects, .theme-picker, .grid-scroll-wrapper';
  const SKIP = 'svg, .board-grid, .tool-badge, .mnode, .mchest, .mmini, .msign';
  const label = e => (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).join('.') : '') || e.tagName.toLowerCase();
  const out = [], W = innerWidth, H = innerHeight;
  const crosses = (a, b, lo, hi) => (a < lo - 1 && b > lo + 1) || (a < hi - 1 && b > hi + 1);
  for (const root of document.querySelectorAll('.screen.active, .modal-overlay.active')) for (const e of root.querySelectorAll('*')) {
    const texts = [...e.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim());
    if (!texts.length || !e.getClientRects().length || e.closest(SKIP) || e.closest(SIDEWAYS)) continue;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    // verticaal telt alleen een vaste bak (overflow hidden/clip) zonder scrollende bak ertussen:
    // half in beeld in een lijst die scrollt is geen fout
    let clipX = null, clipY = null, scrollsY = false;
    for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (!clipX && as.overflowX !== 'visible') clipX = a.getBoundingClientRect();
      if (!clipY && !scrollsY) {
        if (as.overflowY === 'auto' || as.overflowY === 'scroll') scrollsY = true;
        else if (as.overflowY === 'hidden' || as.overflowY === 'clip') clipY = a.getBoundingClientRect();
      }
    }
    const xl = Math.max(0, clipX ? clipX.left : 0), xr = Math.min(W, clipX ? clipX.right : W);
    for (const t of texts) {
      const rg = document.createRange(); rg.selectNodeContents(t);
      const rects = [...rg.getClientRects()].filter(q => q.width > 0);
      const side = rects.some(q => crosses(q.left, q.right, xl, xr));
      const cut = clipY && rects.some(q => crosses(q.top, q.bottom, clipY.top, clipY.bottom));
      if (side || cut) out.push({ screen, kind: side ? 'half buiten de rand' : 'onder of boven afgesneden', text: t.nodeValue.trim().slice(0, 70), where: label(e) });
    }
  }
  return out;
}

// zichtbare tekst met woorden die alleen Nederlands zijn: daar is iets niet vertaald
function dutchInPage() {
  // alleen woorden die in geen van de andere Latijnse talen van de app voorkomen (dus niet "wie", "wissen")
  const WORDS = /(^|[^\p{L}])(het|een|zaak|zaken|niet|jouw|verdachten?|opgelost|punten|wereld|werelden|begrepen|controleer|vandaag|nieuwe|speel|klopt|hoek|muur|naast|stond|geen|wordt|heeft|zijn|nog)(?=$|[^\p{L}])/iu;
  const roots = [...document.querySelectorAll('.screen.active, .modal-overlay.active')];
  const found = [];
  for (const root of roots) {
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const t = n.nodeValue.trim(), el = n.parentElement;
      if (!t || !el || !el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
      if (WORDS.test(t)) found.push(t.slice(0, 80));
    }
  }
  return found;
}

const result = { code, viewports: [], shots: [], dir: null, lang: null };
let browser = null;

async function runViewport(vp) {
  const size = `${vp.w}x${vp.h}`;
  const dir = path.join(OUTDIR, size);
  fs.mkdirSync(dir, { recursive: true });
  const rec = { size, checked: 0, overflow: [], errors: [], skipped: [], dutch: [], blocked: [] };
  result.viewports.push(rec);
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);
  await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on('pageerror', e => rec.errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') rec.errors.push('console: ' + m.text() + (m.location() && m.location().url ? ` (${m.location().url})` : '')); });
  // niets naar buiten: 'CrimsonSimulator' in de user agent zet de tellers van meting.js uit (zoals in de iOS-simulator),
  // en elk verzoek buiten de testserver wordt afgebroken en alleen genoteerd
  await page.setUserAgent((await browser.userAgent()) + ' CrimsonSimulator');
  await page.setRequestInterception(true);
  page.on('request', r => {
    if (r.url().startsWith(BASE + '/') || r.url().startsWith('data:') || r.url().startsWith('blob:')) return r.continue();
    if (!rec.blocked.includes(r.url())) rec.blocked.push(r.url());
    r.abort('blockedbyclient');
  });
  page.on('requestfailed', r => { if (r.url().startsWith(BASE + '/') && !/favicon/.test(r.url())) rec.errors.push(`request failed: ${r.url()} ${r.failure() ? r.failure().errorText : ''}`); });
  page.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) rec.errors.push(`HTTP ${r.status()}: ${r.url()}`); });
  await page.evaluateOnNewDocument(seed, code);
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: '#toast, #medal-toast { display: none !important }' });
  await wait(900);

  const scan = scanSource();
  await page.evaluate(scan.src);
  const seen = new Set();
  const addItems = items => { for (const o of items) { const k = o.screen + '|' + o.kind + '|' + o.text + '|' + o.where; if (!seen.has(k)) { seen.add(k); rec.overflow.push(o); } } };

  // 1. de volledige ronde van overflow-scan.js
  try {
    const r = await page.evaluate(async () => await overflowScan());
    rec.checked += r.checked; addItems(r.items);
  } catch (e) { rec.skipped.push('overflowScan: ' + e.message); }
  // daarna opnieuw laden: schone stand voor de schermafbeeldingen
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: '#toast, #medal-toast { display: none !important }' });
  await wait(900);
  await page.evaluate(scan.src);

  const ev = (fn, ...a) => page.evaluate(fn, ...a);
  const closeModals = () => ev(() => document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active')));
  const toMenu = async () => { await closeModals(); await ev(() => { if (typeof Board !== 'undefined' && Board.stopTimer) Board.stopTimer(); App.navigateTo('menu'); }); await wait(350); };
  const isOpen = id => ev(id => { const m = document.getElementById(id); return !!m && m.classList.contains('active'); }, id);
  let n = 0;
  const shot = async (name, { full = false } = {}) => {
    await ev(() => document.querySelectorAll('.toast, #toast').forEach(t => t.classList.remove('show', 'active')));
    const broken = await settle(page);
    broken.forEach(src => rec.errors.push(`${name}: afbeelding laadt niet: ${src}`));
    if (scan.here) { try { const r = await ev(async s => await overflowScan(s), name); rec.checked += r.checked; addItems(r.items); } catch (e) { rec.skipped.push(`${name}: scan ${e.message}`); } }
    try { addItems(await ev(edgeScan, name)); } catch (e) { rec.skipped.push(`${name}: randcontrole ${e.message}`); }
    const wideBy = await ev(() => document.documentElement.scrollWidth - window.innerWidth);
    if (wideBy > 1) addItems([{ screen: name, kind: 'pagina te breed', text: `${wideBy}px breder dan het scherm`, where: 'html' }]);
    if (code !== 'nl') for (const t of await ev(dutchInPage)) if (!rec.dutch.some(d => d.text === t)) rec.dutch.push({ screen: name, text: t });
    const file = path.join(dir, `${String(++n).padStart(2, '0')}-${name}.png`);
    await page.screenshot({ path: file, fullPage: full });
    result.shots.push(file);
  };
  // één stap: doe iets, maak de foto; mislukt het, noteer het en ga verder vanaf het menu
  const step = async (name, fn) => {
    try { const r = await fn(); if (r === false) rec.skipped.push(`${name}: niet bereikbaar`); }
    catch (e) { rec.skipped.push(`${name}: ${e.message.split('\n')[0]}`); try { await toMenu(); } catch (e2) { /* volgende stap probeert het opnieuw */ } }
  };

  await step('menu', async () => {
    await ev(() => { const b = document.getElementById('btn-splash-start'); if (b && b.offsetParent) b.click(); }); await wait(600);
    await shot('menu', { full: true });
  });
  await step('settings', async () => {
    await ev(() => document.getElementById('btn-settings').click()); await wait(400);
    await shot('settings'); await ev(() => App.hideModal('settings-modal')); await wait(200);
  });
  await step('how', async () => {
    await ev(() => document.getElementById('btn-how').click()); await wait(400);
    await shot('how'); await ev(() => App.hideModal('how-modal')); await wait(200);
  });
  await step('store', async () => {
    await ev(() => App.openStore(null)); await wait(500);
    await ev(() => { const m = document.querySelector('#store-modal .modal-content'); if (m) m.scrollTop = 0; }); await wait(150);
    await shot('store');
    await ev(() => { const m = document.querySelector('#store-modal .modal-content'); if (m) m.scrollTop = m.scrollHeight; }); await wait(250);
    await shot('store-bottom');
    await ev(() => App.hideModal('store-modal')); await wait(200);
  });
  await step('awards', async () => {
    await ev(() => document.getElementById('btn-awards').click()); await wait(500);
    await ev(() => App.showAwardsTab && App.showAwardsTab('medals')); await wait(200);
    await shot('awards', { full: true });
    await ev(() => App.showAwardsTab && App.showAwardsTab('vitrine')); await wait(300);
    await shot('awards-cabinet', { full: true });
    await toMenu();
  });
  await step('free-play', async () => {
    await ev(() => App.navigateTo('free')); await wait(450);
    await shot('free-play', { full: true }); await toMenu();
  });
  await step('world-map', async () => {
    await ev(() => document.getElementById('btn-campaign').click()); await wait(1000);
    await shot('world-map');
    await ev(() => App.openNode(App.mapCurrent || null)); await wait(300);
    if (await ev(() => !document.getElementById('map-pop').hidden)) await shot('map-case-popup');
    await ev(() => App.closeNode());
  });
  await step('part-intro', async () => {
    const ok = await ev(() => { const ch = Campaign.list()[0]; if (!ch) return false; App.showPartSplash(ch, null); return true; });
    if (!ok) return false;
    await wait(1600);   // de cast verschijnt één voor één
    await shot('part-intro-world');
    await ev(() => App.hideModal('part-modal'));
    await ev(() => { const ch = Campaign.chaptersFor(Campaign.list()[0].theme)[1]; if (ch) App.showPartSplash(ch, null); }); await wait(900);
    if (await isOpen('part-modal')) await shot('part-intro-part');
    await ev(() => App.hideModal('part-modal')); await wait(200);
  });
  await step('chest', async () => {
    const ok = await ev(() => { const k = Campaign.list()[0].key; if (!Campaign.chapterDone(k)) return false; App.showChest(k); return true; });
    if (!ok) return false;
    await wait(500); await shot('chest');
    await ev(() => document.getElementById('chest-btn').click()); await wait(1200);
    await shot('chest-open');
    await ev(() => App.hideModal('chest-modal')); await wait(200);
  });
  await step('briefing', async () => {
    // toon de uitleg van een nieuw soort verklaring weer, zodat die ook in beeld komt
    await ev(() => App.storageSet('crimson-newclue-seen', '[]'));
    await ev(() => App.startCampaignCase(Campaign.list()[0].key, 6)); await wait(600);
    await ev(() => { const b = document.getElementById('btn-part-go'); if (b && document.getElementById('part-modal').classList.contains('active')) b.click(); }); await wait(400);
    if (!await isOpen('briefing-modal')) return false;
    await shot('briefing');
    await ev(() => document.getElementById('btn-briefing-go').click()); await wait(500);
  });
  await step('new-clue', async () => {
    if (!await isOpen('newclue-modal')) return false;
    await shot('new-clue');
    await ev(() => document.getElementById('btn-newclue-ok').click()); await wait(300);
  });
  await step('board', async () => {
    await closeModals();
    await ev(() => { const p = Board.puzzle; [0, 1].forEach(i => { Board.placements[i] = { x: p.solution[i].x, y: p.solution[i].y }; }); Board.after(); Board.deckIdx = 0; if (Board.renderDeck) Board.renderDeck(); }); await wait(350);
    await shot('board-statements', { full: true });
    await ev(() => Board.openAllClues()); await wait(400);
    await shot('statements-list');
    await ev(() => App.hideModal('clue-modal')); await wait(200);
  });
  await step('hint', async () => {
    await ev(() => { const p = Board.puzzle; Board.placements = []; Board.placements[0] = { x: p.solution[0].x, y: p.solution[0].y }; Board.after(); }); await wait(300);
    await ev(() => document.getElementById('btn-board-hint').click()); await wait(700);
    if (!await isOpen('hint-modal')) return false;
    await shot('hint');
    await ev(() => App.hideModal('hint-modal')); await wait(200);
  });
  await step('accuse', async () => {
    await closeModals();
    await ev(() => { const p = Board.puzzle; p.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after(); document.getElementById('btn-board-check').click(); }); await wait(500);
    await shot('accuse', { full: true });
  });
  await step('case-closed', async () => {
    await ev(() => document.querySelector(`.murder-opt[data-s="${Board.puzzle.murderer}"]`).click()); await wait(1400);
    await ev(() => Board.skipCeremony()); await wait(2600);
    await closeModals();
    await ev(() => window.scrollTo(0, 0)); await wait(200);
    await shot('case-closed', { full: true });
    await toMenu();
  });
  await step('minigame', async () => {
    const liar = await ev(() => { const ch = Campaign.list().find(c => Campaign.miniKind(c.key) === 'liar'); return !!ch && MiniGame.start(ch.key) && (App.navigateTo('mini'), true); });
    if (!liar) return false;
    await wait(700); await shot('minigame-liar');
    // een fout antwoord: dan staat de zin "… loog" met een naam erin
    await ev(() => { const opts = [...document.querySelectorAll('.mini-card')]; const i = (MiniGame.cur.answer + 1) % opts.length; if (opts[i]) opts[i].click(); }); await wait(500);
    await shot('minigame-answer');
    const mem = await ev(() => { const ch = Campaign.list().find(c => Campaign.miniKind(c.key) === 'memory'); return !!ch && MiniGame.start(ch.key); });
    if (mem) { await wait(500); await shot('minigame-memory-look'); await wait(await ev(() => (MiniGame.LOOK_MS || 4000) + 400)); await shot('minigame-memory-question'); }
    await toMenu();
  });
  await step('tutorial', async () => {
    await ev(() => document.getElementById('btn-tutorial').click()); await wait(700);
    await shot('tutorial', { full: true });
    await ev(() => { if (Board.skipTutorial) Board.skipTutorial(); }); await toMenu();
  });

  if (!result.lang) { result.lang = await ev(() => document.documentElement.lang); result.dir = await ev(() => document.documentElement.dir); }
  await ctx.close();
}

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });
  browser = await puppeteer.launch({ headless: true, executablePath: chromePath(), protocolTimeout: 60000 });
  for (const vp of VIEWPORTS) await runViewport(vp);
}

(async () => {
  let timer, failed = null;
  try {
    const job = main();
    job.catch(() => {});   // na een time-out faalt main() nog als de browser dichtgaat: dat is geen nieuwe fout
    await Promise.race([job, new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`time-out na ${Math.round(TOTAL_MS / 1000)} s`)), TOTAL_MS); })]);
  } catch (e) { failed = e.message; }
  finally {
    clearTimeout(timer);
    if (browser) await Promise.race([browser.close().catch(() => {}), wait(5000)]);
  }
  if (failed) result.error = failed;
  console.log(JSON.stringify(result, null, 2));
  process.exit(failed ? 1 : 0);
})();

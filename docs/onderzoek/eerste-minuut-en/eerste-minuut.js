// First-minute playthrough: splash -> practice case -> case 1, one language, one viewport.
//   node docs/onderzoek/eerste-minuut-en/eerste-minuut.js <baseUrl> <lang|auto> <w> <h> <outdir> [navLangs comma list]
// Prints one JSON object with per-step metrics; writes PNGs to outdir.
const puppeteer = require('/Users/jaimycai/Developer/Murdoku/node_modules/puppeteer');
const fs = require('fs'), path = require('path');
const [base, lang, W, H, outdir, navLangs] = process.argv.slice(2);
fs.mkdirSync(outdir, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
function chromePath() {
  const dir = path.join(process.env.HOME, '.cache/puppeteer/chrome');
  const v = fs.readdirSync(dir).filter(d => !d.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop();
  return path.join(dir, v, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
}
const out = { base, lang, size: `${W}x${H}`, navLangs: navLangs || null, steps: [], errors: [], blocked: [] };

// runs in the page: what the player sees right now
function measure() {
  const vis = el => el && !el.hidden && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
  const R = el => { if (!vis(el)) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), b: Math.round(r.bottom), r: Math.round(r.right) }; };
  const inView = r => r && r.y >= -1 && r.b <= innerHeight + 1 && r.x >= -1 && r.r <= innerWidth + 1;
  const overlap = (a, b) => a && b && !(a.r <= b.x || b.r <= a.x || a.b <= b.y || b.b <= a.y);
  const covered = el => { const r = R(el); if (!r) return null; const cx = r.x + r.w / 2, cy = r.y + r.h / 2; if (cy < 0 || cy > innerHeight) return 'offscreen'; const top = document.elementFromPoint(cx, cy); return top && (top === el || el.contains(top)) ? false : (top ? (top.id || top.className || top.tagName) : 'none'); };
  const $ = id => document.getElementById(id);
  const scr = document.querySelector('.screen.active');
  const modal = [...document.querySelectorAll('.modal-overlay.active')].map(m => m.id);
  const m = { screen: scr && scr.id, modal, innerH: innerHeight, innerW: innerWidth,
    screenScroll: scr ? { sh: scr.scrollHeight, ch: scr.clientHeight } : null,
    docScroll: { sh: document.scrollingElement.scrollHeight, ch: innerHeight } };
  const txt = el => vis(el) ? el.textContent.trim().replace(/\s+/g, ' ') : null;
  if (scr && scr.id === 'screen-splash') {
    m.splash = { tagline: txt(document.querySelector('.splash-tagline')), subtitle: txt(document.querySelector('.splash-subtitle')),
      button: txt($('btn-splash-start')), footer: txt(document.querySelector('.splash-footer')), status: txt($('splash-status')),
      btnRect: R($('btn-splash-start')), btnInView: inView(R($('btn-splash-start'))), loaded: scr.classList.contains('loaded'),
      btnOpacity: vis($('btn-splash-start')) ? getComputedStyle($('btn-splash-start')).opacity : null };
  }
  if (scr && scr.id === 'screen-board') {
    const coach = $('board-coach'), ct = $('board-coach-text');
    const hinted = document.querySelector('#board-grid .bcell.hinted');
    const cR = R(coach), hR = R(hinted), chk = R($('btn-board-check'));
    m.board = {
      diffTag: txt($('board-diff-tag')), caseText: txt($('board-casetext')),
      coachStep: txt($('board-coach-step')), coachText: txt(ct), coachChars: ct && ct.textContent.length, coachWords: ct && ct.textContent.trim().split(/\s+/).length,
      coachRect: cR, coachTextClipped: ct && vis(ct) ? ct.scrollHeight > ct.clientHeight + 1 : null,
      coachLines: ct && vis(ct) ? Math.round(ct.getBoundingClientRect().height / parseFloat(getComputedStyle(ct).lineHeight || 16)) : null,
      skip: txt($('btn-board-tutorial-skip')), skipRect: R($('btn-board-tutorial-skip')),
      hintedRect: hR, hintedInView: inView(hR), hintedCoveredBy: hinted ? covered(hinted) : null, coachOverlapsTarget: overlap(cR, hR),
      gridRect: R($('board-grid')), suspectsRect: R($('board-suspects')), deckRect: R($('clue-deck')), toolsRect: R(document.querySelector('.board-tools')),
      suspects: [...document.querySelectorAll('#board-suspects .sus-chip, #board-suspects button')].filter(vis).map(e => e.textContent.trim().replace(/\s+/g, ' ')).slice(0, 8),
      deckCard: txt(document.querySelector('#clue-track .deck-card.active, #clue-track .clue-card.active, #clue-track > *')),
      deckCards: [...document.querySelectorAll('#clue-track > *')].map(e => e.textContent.trim().replace(/\s+/g, ' ')).slice(0, 6),
      checkLabel: txt($('btn-board-check')), checkRect: chk, checkInView: inView(chk), checkDisabled: $('btn-board-check') && $('btn-board-check').disabled,
      checkCoveredBy: vis($('btn-board-check')) ? covered($('btn-board-check')) : null,
      tools: [...document.querySelectorAll('.board-tools .tool-label')].filter(vis).map(e => e.textContent.trim()),
      help: txt($('btn-board-help')), helpVisible: !!R($('btn-board-help')), tip: txt($('board-tip')),
      accuse: vis($('board-accuse')) ? { title: txt(document.querySelector('.accuse-title')), q: txt($('murder-question')),
        opts: [...document.querySelectorAll('.murder-opt')].map(o => ({ t: o.textContent.trim().replace(/\s+/g, ' '), r: R(o), inView: inView(R(o)), coveredBy: covered(o) })) } : null
    };
  }
  if (scr && scr.id === 'screen-results') {
    m.results = { headline: txt($('results-headline')), verdict: txt($('results-verdict')), desc: txt($('results-description')),
      next: txt($('btn-next-case')), nextRect: R($('btn-next-case')), nextInView: inView(R($('btn-next-case'))),
      again: txt($('btn-play-again')), againRect: R($('btn-play-again')), againInView: inView(R($('btn-play-again'))) };
  }
  if (scr && scr.id === 'screen-campaign') m.map = { play: txt($('btn-map-play')), playRect: R($('btn-map-play')), playInView: inView(R($('btn-map-play'))) };
  if (modal.includes('briefing-modal')) m.briefing = { sub: txt($('briefing-sub')), text: txt($('briefing-text')), chars: ($('briefing-text') || {}).textContent.length, go: txt($('btn-briefing-go')), goRect: R($('btn-briefing-go')), goInView: inView(R($('btn-briefing-go'))) };
  if (modal.includes('newclue-modal')) m.newclue = { text: txt(document.getElementById('newclue')), ok: txt($('btn-newclue-ok')), okInView: inView(R($('btn-newclue-ok'))) };
  if (modal.includes('part-modal') || document.querySelector('.part-splash.active')) m.part = txt(document.querySelector('#part-card'));
  // Dutch leak (same word list as tests/qa-lang.js)
  const WORDS = /(^|[^\p{L}])(het|een|zaak|zaken|niet|jouw|verdachten?|opgelost|punten|wereld|werelden|begrepen|controleer|vandaag|nieuwe|speel|klopt|hoek|muur|naast|stond|geen|wordt|heeft|zijn|nog|sleep|tik|oefenzaak|overslaan|stap)(?=$|[^\p{L}])/iu;
  const found = [];
  for (const root of document.querySelectorAll('.screen.active, .modal-overlay.active')) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) { const t = n.nodeValue.trim(), el = n.parentElement; if (!t || !el || (!el.offsetParent && getComputedStyle(el).position !== 'fixed')) continue; if (WORDS.test(t)) found.push(t.slice(0, 90)); }
  }
  m.dutchVisible = found;
  m.htmlLang = document.documentElement.lang;
  m.i18nLang = typeof I18n !== 'undefined' ? I18n.lang : null;
  return m;
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--no-sandbox', '--lang=' + ((navLangs || 'en-US').split(',')[0])] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 CrimsonSimulator');
    await page.setViewport({ width: +W, height: +H, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.setRequestInterception(true);
    page.on('request', r => { const u = r.url(); if (/^https?:\/\/127\.0\.0\.1/.test(u) || u.startsWith('data:') || u.startsWith('blob:')) r.continue(); else { out.blocked.push(u.slice(0, 120)); r.abort(); } });
    page.on('pageerror', e => out.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
    page.on('console', msg => { if (msg.type() === 'error') out.errors.push('console: ' + msg.text().slice(0, 200)); });
    await page.evaluateOnNewDocument((lang, navLangs) => {
      if (!sessionStorage.getItem('pt-seeded')) { sessionStorage.setItem('pt-seeded', '1'); localStorage.clear(); if (lang && lang !== 'auto') localStorage.setItem('crimson-lang', lang); }
      if (navLangs) { const l = navLangs.split(','); Object.defineProperty(Navigator.prototype, 'languages', { get: () => l }); Object.defineProperty(Navigator.prototype, 'language', { get: () => l[0] }); }
    }, lang, navLangs || '');
    const t0 = Date.now();
    let n = 0;
    const step = async (name, extra = {}) => {
      n++;
      const file = `${String(n).padStart(2, '0')}-${name}.png`;
      await page.screenshot({ path: path.join(outdir, file) });
      const m = await page.evaluate(measure);
      out.steps.push({ name, file, t: Date.now() - t0, ...extra, ...m });
      return m;
    };
    // realistic tap at the centre of an element; reports what was actually under the finger
    const tap = async (sel) => {
      const box = await page.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const top = document.elementFromPoint(cx, cy); return { cx, cy, hit: !!top && (top === e || e.contains(top)), top: top ? (top.id || String(top.className) || top.tagName) : null }; }, sel);
      if (!box) return { sel, missing: true };
      await page.touchscreen.tap(box.cx, box.cy);
      return { sel, ...box };
    };
    await page.goto(base + '/index.html', { waitUntil: 'domcontentloaded' });
    await wait(350);
    await step('splash-loading');
    await page.waitForSelector('#screen-splash.loaded', { timeout: 8000 }).catch(() => {});
    const tLoaded = Date.now() - t0;
    await wait(800);
    await step('splash-ready', { splashLoadedAt: tLoaded });
    let a = await tap('#btn-splash-start'); await wait(700);
    const stillSplash = await page.evaluate(() => document.querySelector('.screen.active').id === 'screen-splash');
    if (stillSplash) { out.splashCentreTapDead = true; const c = await page.evaluate(() => { const r = document.getElementById('btn-splash-start').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 8 }; }); await page.touchscreen.tap(c.x, c.y); }
    await wait(1100);
    await step('tut-step1', { tapped: a });
    // a first-timer often taps the person named in the instruction first: try the suspect chip, then the glowing square
    const chip = await page.evaluate(() => { const c = document.querySelector('#board-suspects .sus-chip, #board-suspects button'); return c ? true : false; });
    if (chip) { const t = await tap('#board-suspects .sus-chip, #board-suspects button'); await wait(500); await step('tut-step1-after-chip-tap', { tapped: t, stepAfter: await page.evaluate(() => Board.tutorialStep) }); }
    a = await tap('#board-grid .bcell.hinted'); await wait(900);
    await step('tut-step2', { tapped: a, stepAfter: await page.evaluate(() => Board.tutorialStep) });
    a = await tap('#board-grid .bcell.hinted'); await wait(900);
    await step('tut-step3', { tapped: a, stepAfter: await page.evaluate(() => Board.tutorialStep) });
    a = await tap('#btn-board-check'); await wait(1200);
    await step('tut-step4-accuse', { tapped: a, stepAfter: await page.evaluate(() => Board.tutorialStep) });
    a = await tap('.murder-opt[data-s="1"]'); await wait(2600);
    await step('tut-results', { tapped: a });
    const nextVisible = await page.evaluate(() => { const b = document.getElementById('btn-next-case'); return !!b && !b.hidden && b.getClientRects().length > 0; });
    if (nextVisible) { a = await tap('#btn-next-case'); await wait(1600); await step('after-results', { tapped: a }); }
    else { a = await tap('#btn-play-again'); await wait(1600); await step('map', { tapped: a }); a = await tap('#btn-map-play'); await wait(2200); await step('after-map-play', { tapped: a }); }
    // part splash (1.4.1 route) -> continue
    for (let i = 0; i < 3; i++) {
      const st = await page.evaluate(() => ({ briefing: !!document.querySelector('#briefing-modal.active'), part: [...document.querySelectorAll('.modal-overlay.active')].map(m => m.id) }));
      if (st.briefing) break;
      const btn = await page.evaluate(() => { const b = [...document.querySelectorAll('.modal-overlay.active button')].find(b => b.getClientRects().length); return b ? (b.id ? '#' + b.id : null) : null; });
      if (!btn) { await wait(1200); continue; }
      a = await tap(btn); await wait(1500); await step('part-continue', { tapped: a });
    }
    await step('case1-briefing');
    const go = await page.evaluate(() => !!document.querySelector('#briefing-modal.active'));
    if (go) { a = await tap('#btn-briefing-go'); await wait(1500); await step('case1-after-go', { tapped: a }); }
    const nc = await page.evaluate(() => !!document.querySelector('#newclue-modal.active'));
    if (nc) { a = await tap('#btn-newclue-ok'); await wait(1000); await step('case1-board', { tapped: a }); }
    out.events = await page.evaluate(() => ({ tutorialDone: localStorage.getItem('crimson-board-tutorial-done'), lang: I18n.lang }));
  } catch (e) { out.fatal = String(e.stack || e).slice(0, 500); }
  await browser.close();
  console.log(JSON.stringify(out));
})();

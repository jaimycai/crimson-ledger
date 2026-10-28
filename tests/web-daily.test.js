// Webdagzaak (docs/play/, build-web-daily.js): dezelfde zaak als de app op dezelfde datum, teksten in alle 20 talen,
// meting met platform 'webdaily', en een kaart om te delen zonder de oplossing.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const DIR = path.join(__dirname, '..');
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── meting.js: de vlag van de webpagina geeft 'webdaily', zonder vlag blijft het 'web' (de app verandert niet) ──
{
  const { Meting } = require('../meting.js');
  global.window = {};
  check(Meting.platform() === 'web', 'meting: zonder vlag platform web (zoals voorheen)');
  global.window = { WEB_DAILY: true };
  check(Meting.platform() === 'webdaily', 'meting: window.WEB_DAILY geeft platform webdaily');
  delete global.window;
}

// ── teksten.js: alle talen van de app, dezelfde sleutels, geen woord voor kopen ──
{
  const { I18n } = require('../i18n.js');
  const { WEB_TEKST } = require('../web-daily/teksten.js');
  const codes = I18n.LANGS.map(l => l[0]);
  const keys = Object.keys(WEB_TEKST.nl);
  check(codes.every(c => WEB_TEKST[c]) && Object.keys(WEB_TEKST).length === codes.length, `teksten: alle ${codes.length} talen`);
  const bad = codes.filter(c => !WEB_TEKST[c] || keys.some(k => typeof WEB_TEKST[c][k] !== 'string' || !WEB_TEKST[c][k].trim()) || Object.keys(WEB_TEKST[c]).length !== keys.length);
  check(bad.length === 0, `teksten: elke taal heeft ${keys.join(', ')}${bad.length ? ' (mist: ' + bad.join(' ') + ')' : ''}`);
  check(codes.every(c => WEB_TEKST[c].next.includes('{0}')), 'teksten: het aftellen heeft overal een plek voor de tijd');
  check(codes.every(c => WEB_TEKST[c].cta.includes('128')), 'teksten: de App Store-knop noemt overal 128 zaken');
  const BUY = /koop|kopen|\bbuy|purchase|kauf|compra|achet|achat|acquist|\bbeli|satın|\bmua\b|куп|شراء|اشتر|خرید|ख़रीद|खरीद|কিনুন|কেনা|కొను|购买|購入|구매/i;
  const buy = codes.filter(c => Object.values(WEB_TEKST[c]).some(t => BUY.test(t)));
  check(buy.length === 0, `teksten: geen woord voor kopen${buy.length ? ' (wel in: ' + buy.join(' ') + ')' : ''}`);
}

// ── bouwen in een tijdelijke map ──
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'webdaily-'));
const { build } = require('../build-web-daily.js');
const info = build(OUT);
{
  const files = fs.readdirSync(OUT);
  check(['index.html', 'board.js', 'gedeeld.js', 'dagzaak.js', 'teksten.js', 'meting.js'].every(f => files.includes(f)), 'bouw: pagina, bord, gedeelde regels, besturing en meting staan erin');
  check(!['app.js', 'campaign.js', 'store.js', 'mapart.js', 'minigame.js', 'sw.js', 'manifest.json'].some(f => files.includes(f)), 'bouw: geen campagne, winkel, kaart, minigame of service worker');
  check(info.packs === 19 && fs.readdirSync(path.join(OUT, 'i18n')).length === 19, 'bouw: 19 taalbestanden (Nederlands is de brontaal)');
  const en = fs.readFileSync(path.join(OUT, 'i18n', 'en.js'), 'utf8');
  check(!/"campaign"/.test(en) && /"ui"/.test(en) && /"grammar"/.test(en), 'bouw: taalbestand zonder campagneteksten, met schermtekst en zinsbouw');
  const html = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
  check(/id="screen-board"/.test(html) && /id="hint-modal"/.test(html) && /window\.WEB_DAILY = true/.test(html), 'bouw: bord en hintvenster uit index.html, vlag voor de meting');
  check(/src="board\.js\?v=[0-9a-f]{8}"/.test(html), 'bouw: scripts met inhoudscode (?v=) tegen een oude cache');
}

// ── een pagina in jsdom met alle scripts ingevoegd ──
function load(file, base, { lang, url, before = '' }) {
  const dir = path.dirname(file);
  let html = fs.readFileSync(file, 'utf8');
  const isWeb = /dagzaak\.js/.test(html);
  html = html.replace(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(dir, src), 'utf8')}</script>`);
  const pack = lang !== 'nl' ? `<script>${fs.readFileSync(path.join(base, 'i18n', lang + '.js'), 'utf8')}</script>` : '';
  html = html.replace('<head>', `<head><script>localStorage.setItem("crimson-lang", "${lang}");${before}</script>${pack}`)
    .replace(/<link[^>]+>/g, '')
    .replace('</body>', '<script>window.App = App; window.Board = Board; window.Themes = Themes; window.Progress = Progress;' +
      (isWeb ? ' window.WebDaily = WebDaily; window.DagLogica = DagLogica;' : '') + '</script></body>');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e.message || e)));
  vc.on('error', (...a) => errors.push(a.join(' ')));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url, virtualConsole: vc });
  return { dom, w: dom.window, errors };
}
const caseOf = B => JSON.stringify({ seed: B.seed, theme: B.theme.id, diff: B.difficulty, solution: B.puzzle.solution, murderer: B.puzzle.murderer,
  clues: B.puzzle.clues, victim: B.puzzle.victim });

(async () => {
  // de app: oefenzaak al gedaan, dan "Speel" bij de dagelijkse zaak (App.bindBoard)
  const app = load(path.join(DIR, 'index.html'), DIR, { lang: 'nl', url: 'http://localhost:8080/', before: 'localStorage.setItem("crimson-board-tutorial-done", "1");' });
  await sleep(80);
  app.w.document.getElementById('btn-board-daily').click();
  await sleep(50);
  const appCase = caseOf(app.w.Board);
  check(app.w.Board.isDaily, 'app: de dagelijkse zaak ligt op het bord');

  // het web, zelfde moment: eerste bezoek via een gedeelde link
  const sent = 'window.__sent = []; window.fetch = (u, o) => { window.__sent.push(JSON.parse(o.body)); return Promise.resolve({ ok: true }); };';
  const web = load(path.join(OUT, 'index.html'), OUT, { lang: 'nl', url: 'http://localhost:8099/play/?s=1', before: sent });
  await sleep(80);
  const { w } = web, $ = id => w.document.getElementById(id);
  const dayNo = app.w.App.getDayNumber();
  check($('wd-title').textContent === app.w.Progress.dailyTitle(dayNo), `web: thuis staat de zaak van vandaag (${$('wd-title').textContent})`);
  check(!$('wd-first').hidden, 'web: eerste bezoek: de oefenzaak gaat voor, met Overslaan');
  check(w.location.search === '', 'web: ?s=1 verdwijnt uit de adresbalk');
  $('wd-skip').click();
  await sleep(300);
  check(w.Board.isDaily && !w.Board.isTutorial, 'web: Overslaan opent de dagelijkse zaak');
  check(caseOf(w.Board) === appCase, 'web: precies dezelfde zaak als in de app (seed, wereld, niveau, oplossing, verklaringen)');

  // oplossen met één hint en één verkeerde beschuldiging: 1 ster, net als in de app
  const B = w.Board;
  $('btn-board-hint').click();
  B.puzzle.solution.forEach((c, i) => { B.placements[i] = { x: c.x, y: c.y }; });
  B.after();
  $('btn-board-check').click();
  const wrong = [...w.document.querySelectorAll('.murder-opt')].find(b => +b.dataset.s !== B.puzzle.murderer);
  wrong.click();
  w.document.querySelector(`.murder-opt[data-s="${B.puzzle.murderer}"]`).click();
  await sleep(1300);
  check(w.document.querySelector('.screen.active').id === 'screen-results', 'web: opgelost → resultaatscherm');
  const r = w.WebDaily.result();
  check(r && r.h === 1 && r.a === 1 && w.DagLogica.starsFor(r.h, r.a) === 1, 'web: resultaat bewaard (1 hint, 1 fout) → 1 ster, de regel van de app');
  const card = $('wd-result').textContent;
  check(card.includes(app.w.Progress.dailyTitle(dayNo)) && /Dag #\d+/.test(card), 'web: kaart met zaaknaam en dagnummer');
  const share = w.WebDaily.shareText(r);
  check(share.split('\n').length === 4 && share.includes('https://jaimycai.github.io/crimson-ledger/play/') && share.includes(`Dag #${dayNo}`), 'web: deeltekst met dag, zaaknaam en link');
  const p = B.puzzle, names = p.suspects.map(s => s.label), rooms = p.rooms.map(x => x.name);
  check(!/[🔪🩸👤🟥🟧🟨🟩🟦🟪🟫]/u.test(share) && !names.some(n => share.includes(n)) && !rooms.some(n => share.includes(n)), 'web: deeltekst zonder plattegrond, namen of kamers (geen spoiler)');
  const cta = w.document.querySelector('#wd-result .wd-cta');
  check(cta && cta.getAttribute('href') === 'https://apps.apple.com/app/id6812534368' && cta.target === '_blank', 'web: één knop naar de App Store');
  cta.addEventListener('click', e => e.preventDefault());
  cta.click();

  // meting: alleen de afgesproken gebeurtenissen, allemaal als webdaily
  await sleep(20);
  const ev = w.__sent.map(e => `${e.e}:${e.a}`);
  check(w.__sent.length > 0 && w.__sent.every(e => e.p === 'webdaily' && e.l === 'nl'), 'meting: alles gaat als platform webdaily');
  check(['open:share', 'start:daily', 'solved:daily', 'cta:appstore'].every(x => ev.includes(x)), `meting: open (via delen), start, opgelost, App Store (${ev.join(' ')})`);
  check(w.__sent.every(e => ['open', 'start', 'solved', 'share', 'cta'].includes(e.e)), 'meting: geen andere gebeurtenissen (hint telt niet mee)');

  // opnieuw laden: vandaag gespeeld, geen tweede zaak
  web.dom.window.close();
  const again = load(path.join(OUT, 'index.html'), OUT, { lang: 'en', url: 'http://localhost:8099/play/', before: `localStorage.setItem("crimson-webdaily-result", ${JSON.stringify(JSON.stringify(r))});` });
  await sleep(80);
  const $2 = id => again.w.document.getElementById(id);
  check($2('wd-daily').hidden && !!again.w.document.querySelector('#wd-home-result .wd-card'), 'web (en): vandaag al opgelost → thuis de kaart, geen tweede zaak');
  check(again.w.document.querySelector('#wd-home-result .wd-cta').textContent.trim() === 'Play 128 cases free in the app', 'web (en): App Store-knop in het Engels');
  check(/Day #\d+/.test(again.w.WebDaily.shareText(r)), 'web (en): deeltekst in het Engels');

  const errs = [...app.errors, ...web.errors, ...again.errors].filter(e => !/Not implemented: (window\.scrollTo|HTMLMediaElement)/.test(e));
  check(errs.length === 0, `geen fouten in de console${errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''}`);
  app.dom.window.close(); again.dom.window.close();
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log(failures ? `${failures} FAILURES` : 'ALLE WEBDAGZAAK CHECKS PASSED');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });

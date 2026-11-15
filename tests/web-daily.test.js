// Webdagzaak (docs/play/, build-web-daily.js): dezelfde zaak als de app op dezelfde datum, teksten in alle 20 talen,
// meting met platform 'webdaily', en een kaart om te delen zonder de oplossing.
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
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
  // 1.6 (referrals review): Smart App Banner, a large link preview, and preview text without a word for murder
  check(/<meta name="apple-itunes-app" content="app-id=6812534368">/.test(html), 'bouw: Smart App Banner voor Safari op iPhone');
  check(/<meta name="twitter:card" content="summary_large_image">/.test(html) && /property="og:image" content="https:\/\/jaimycai\.github\.io\/crimson-ledger\/play\/og-image\.png"/.test(html) && /og:image:width" content="1200"/.test(html) && /og:image:height" content="630"/.test(html), 'bouw: grote linkvoorvertoning (og:image 1200×630, summary_large_image)');
  const png = fs.readFileSync(path.join(OUT, 'og-image.png'));
  check(png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, `bouw: og-image.png is ${png.readUInt32BE(16)}×${png.readUInt32BE(20)}`);
  const meta = [...html.matchAll(/<meta (?:name|property)="(?:description|og:[a-z:]+|twitter:[a-z]+)" content="([^"]*)"/g)].map(m => m[1]).join(' ');
  check(!/murder|moord|kill/i.test(meta) && /every day/.test(meta), 'bouw: voorvertoning zonder woord voor moord, met elke dag een nieuwe zaak');
  check(/href="https:\/\/apps\.apple\.com\/app\/id6812534368\?ct=webdaily-cta&amp;mt=8"/.test(html), 'bouw: App Store-link onderaan met campagnetoken');
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
  // de app: oefenzaak al gedaan, eerste start een maand geleden (dus geen startersversie), dan "Speel" bij de dagelijkse zaak
  const monthAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 30); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
  const app = load(path.join(DIR, 'index.html'), DIR, { lang: 'nl', url: 'http://localhost:8080/', before: `localStorage.setItem("crimson-board-tutorial-done", "1"); localStorage.setItem("crimson-first-day", "${monthAgo}");` });
  await sleep(80);
  app.w.document.getElementById('btn-board-daily').click();
  await sleep(50);
  const appCase = caseOf(app.w.Board);
  check(app.w.Board.isDaily && app.w.Board.difficulty === 'gemiddeld' && !app.w.Board.starter, 'app: de dagelijkse zaak ligt op het bord (Gemiddeld, na de eerste week)');
  // 1.7: in de eerste week speelt de app dezelfde seed en wereld op Makkelijk; het web blijft Gemiddeld
  const fresh = load(path.join(DIR, 'index.html'), DIR, { lang: 'nl', url: 'http://localhost:8080/', before: 'localStorage.setItem("crimson-board-tutorial-done", "1");' });
  await sleep(80);
  fresh.w.document.getElementById('btn-board-daily').click();
  await sleep(50);
  const FB = fresh.w.Board;
  check(FB.isDaily && FB.starter && FB.difficulty === 'makkelijk' && FB.seed === app.w.Board.seed && FB.theme.id === app.w.Board.theme.id && caseOf(FB) !== appCase,
    'app in de eerste week: startersversie met dezelfde seed en wereld, een andere (makkelijkere) zaak');
  fresh.dom.window.close();

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
  check(share.split('\n').length === 4 && share.includes('https://jaimycai.github.io/crimson-ledger/play/?ct=webdaily-share') && share.includes(`Dag #${dayNo}`), 'web: deeltekst met dag, zaaknaam en link (campagnetoken webdaily-share)');
  const p = B.puzzle, names = p.suspects.map(s => s.label), rooms = p.rooms.map(x => x.name);
  check(!/[🔪🩸👤🟥🟧🟨🟩🟦🟪🟫]/u.test(share) && !names.some(n => share.includes(n)) && !rooms.some(n => share.includes(n)), 'web: deeltekst zonder plattegrond, namen of kamers (geen spoiler)');
  const cta = w.document.querySelector('#wd-result .wd-cta');
  check(cta && cta.getAttribute('href') === 'https://apps.apple.com/app/id6812534368?ct=webdaily-cta&mt=8' && cta.target === '_blank', 'web: één knop naar de App Store, met campagnetoken: ' + (cta && cta.getAttribute('href')));
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

  // 1.6: a visitor from the app's daily share (?ct=share-daily) counts as 'share' and takes the token on to the App Store
  const viaApp = load(path.join(OUT, 'index.html'), OUT, { lang: 'nl', url: 'http://localhost:8099/play/?ct=share-daily', before: sent + `localStorage.setItem("crimson-webdaily-result", ${JSON.stringify(JSON.stringify(r))});` });
  await sleep(80);
  const cta3 = viaApp.w.document.querySelector('#wd-home-result .wd-cta'), foot = viaApp.w.document.querySelector('.wd-foot [data-appstore]');
  check(cta3 && cta3.getAttribute('href') === 'https://apps.apple.com/app/id6812534368?ct=share-daily&mt=8' && foot.getAttribute('href') === cta3.getAttribute('href') && viaApp.w.location.search === '', 'web via een deellink uit de app: App Store-links dragen ct=share-daily, adresbalk schoon');
  check(viaApp.w.__sent.some(e => e.e === 'open' && e.a === 'share'), 'web via een deellink uit de app: open telt als share');
  viaApp.dom.window.close();

  // 1.7: uitgedaagd via "Daag een vriend uit" (?ct=challenge-daily): de regel boven de zaak en boven het bord, open telt als
  // challenge, na het oplossen de App Store-kaart met dat token
  const ch = load(path.join(OUT, 'index.html'), OUT, { lang: 'nl', url: 'http://localhost:8099/play/?ct=challenge-daily', before: sent });
  await sleep(80);
  const $c = id => ch.w.document.getElementById(id), CB = ch.w.Board;
  const banner = $c('wd-challenge'), onBoard = $c('wd-challenge-board');
  check(!banner.hidden && banner.textContent.trim() === 'Je bent uitgedaagd: speel de zaak van vandaag' && !!banner.querySelector('svg.ico') &&
    banner.compareDocumentPosition($c('wd-daily')) & ch.w.Node.DOCUMENT_POSITION_FOLLOWING, 'uitgedaagd: de regel staat boven de zaak van vandaag');
  check(ch.w.location.search === '' && ch.w.__sent.some(e => e.e === 'open' && e.a === 'challenge'), 'uitgedaagd: adresbalk schoon, open telt als challenge');
  check(!!onBoard && onBoard.hidden && onBoard.nextElementSibling === ch.w.document.querySelector('#screen-board .board-stage'), 'de regel boven het bord staat klaar, nog verborgen');
  $c('wd-play').click(); await sleep(300);
  check(CB.isTutorial && onBoard.hidden, 'eerst de oefenzaak (eerste bezoek): daar geen regel, de coach praat');
  $c('btn-board-back').click(); await sleep(300);
  $c('wd-skip').click(); await sleep(300);
  check(CB.isDaily && !CB.isTutorial && !onBoard.hidden && /Je bent uitgedaagd/.test(onBoard.textContent) && caseOf(CB) === appCase, 'de zaak van vandaag (dezelfde als in de app), met de regel boven het bord');
  CB.puzzle.solution.forEach((c, i) => { CB.placements[i] = { x: c.x, y: c.y }; });
  CB.after();
  $c('btn-board-check').click();
  ch.w.document.querySelector(`.murder-opt[data-s="${CB.puzzle.murderer}"]`).click();
  await sleep(1300);
  const cta4 = ch.w.document.querySelector('#wd-result .wd-cta');
  check(ch.w.document.querySelector('.screen.active').id === 'screen-results' && cta4 && cta4.getAttribute('href') === 'https://apps.apple.com/app/id6812534368?ct=challenge-daily&mt=8',
    'opgelost: de App Store-kaart, met ct=challenge-daily: ' + (cta4 && cta4.getAttribute('href')));
  ch.w.WebDaily.renderHome();
  check(banner.hidden && $c('wd-daily').hidden, 'thuis na het oplossen: geen uitdaging meer, de kaart met het resultaat');
  const chEn = load(path.join(OUT, 'index.html'), OUT, { lang: 'ar', url: 'http://localhost:8099/play/?ct=challenge-daily', before: sent });
  await sleep(80);
  check(chEn.w.document.getElementById('wd-challenge').textContent.trim() === 'لقد تحدّاك صديق: العب قضية اليوم', 'uitgedaagd (ar): de regel in de taal van de bezoeker');
  ch.dom.window.close(); chEn.dom.window.close();

  // 1.7: de deeltekst van de uitdaging en de regel op het web: in geen enkele taal een woord voor moord (store/metadata/check-1.6.js)
  {
    const src = fs.readFileSync(path.join(DIR, 'store', 'metadata', 'check-1.6.js'), 'utf8');
    const ctx = { require, __dirname: path.join(DIR, 'store', 'metadata'), console };
    vm.runInNewContext(src.slice(0, src.indexOf('const want')) + '\nglobalThis.__mw = murderWords;', Object.assign(ctx, { globalThis: ctx }));
    const KEYS = ['🎯 Daag een vriend uit', 'Ik heb de zaak van vandaag opgelost: {0} in {1}.', 'Lukt het jou ook? Speel hem gratis in je browser:',
      'Je bent uitgedaagd: speel de zaak van vandaag', 'Zal ik je morgen een seintje geven als de nieuwe zaak klaarligt?', 'Startersversie'];
    const hits = [];
    for (const f of fs.readdirSync(path.join(DIR, 'i18n')).filter(f => /^[a-z]{2}\.js$/.test(f))) {
      const c2 = {}; c2.globalThis = c2;
      vm.runInNewContext(fs.readFileSync(path.join(DIR, 'i18n', f), 'utf8'), c2);
      const ui = Object.values(c2.LANG_PACKS)[0].ui;
      for (const k of [...KEYS, ...KEYS.map(k => ui[k])]) { const w = ctx.__mw(k || ''); if (w.length) hits.push(`${f}: ${w.join(',')}`); }
    }
    check(hits.length === 0 && ctx.__mw('moordenaar').length === 1, 'deeltekst en uitdaging: geen moordwoord in 20 talen' + (hits.length ? ' (' + hits.join(' | ') + ')' : ''));
  }

  const errs = [...app.errors, ...fresh.errors, ...web.errors, ...again.errors, ...viaApp.errors, ...ch.errors, ...chEn.errors].filter(e => !/Not implemented: (window\.scrollTo|HTMLMediaElement)/.test(e));
  check(errs.length === 0, `geen fouten in de console${errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''}`);
  app.dom.window.close(); again.dom.window.close();
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log(failures ? `${failures} FAILURES` : 'ALLE WEBDAGZAAK CHECKS PASSED');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });

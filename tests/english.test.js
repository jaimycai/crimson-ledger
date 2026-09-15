// Engelse versie: de app start met crimson-lang=en en alles op het scherm is Engels.
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
html = html.replace('<head>', '<head><script>localStorage.setItem("crimson-lang", "en");</script>').replace(/<link[^>]+>/g, '')
  .replace('</body>', '<script>window.App = App; window.Board = Board; window.FloorPlan = FloorPlan; window.Themes = Themes; window.Campaign = Campaign; window.Progress = Progress; window.Mentor = Mentor; window.MiniGame = MiniGame; window.Store = Store; window.I18n = I18n;</script></body>');
const errors = [];
const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
const { window } = dom, { document } = window;
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const txt = id => (document.getElementById(id) || { textContent: '' }).textContent.trim();
const DUTCH = /\b(zaak|zaken|verdachte|verdachten|kamer|opgelost|vandaag|morgen|speel|verder|terug|instellingen|wereld|dagen|punten)\b/i;
const active = () => document.querySelector('.screen.active').id;

(async () => {
  try {
    await sleep(60);
    const { App, Board, I18n, Store, Campaign } = window;
    check(errors.length === 0, 'geen fouten bij het opstarten in het Engels: ' + errors.join(' | '));
    check(I18n.lang === 'en', 'taal is Engels');
    check(document.documentElement.lang === 'en' && /Crimson Ledger/.test(document.title), 'html lang en titel');
    check(document.querySelector('.lang-btn[data-lang="en"]').classList.contains('active') && !document.querySelector('.lang-btn[data-lang="nl"]').classList.contains('active'), 'taalknop English staat aan');
    check(document.querySelector('.menu-classic').hidden === true, 'klassiek raster verborgen in het Engels');

    // ── thuisscherm ──
    check(/^Today's case: /.test(txt('daily-title')), 'dagelijkse kaart Engels: ' + txt('daily-title'));
    check(txt('daily-bonus') === '🪙 +150 points' && txt('btn-board-daily') === 'Play', 'bonus en knop Engels: ' + txt('daily-bonus') + ' / ' + txt('btn-board-daily'));
    check(txt('campaign-next') === 'Part I · Case 1', 'campagnekaart Engels: ' + txt('campaign-next'));
    check(txt('board-stats') === 'No case solved yet. The first one today?', 'voortgang Engels: ' + txt('board-stats'));
    check(/Recruit/.test(txt('menu-rank')) && /until Sleuth/.test(txt('menu-rank')), 'rang Engels: ' + txt('menu-rank'));
    check(txt('btn-week') === 'Start' && txt('week-title').length > 5 && !DUTCH.test(txt('week-title')), 'zaak van de week Engels: ' + txt('week-title'));
    const quests = [...document.querySelectorAll('#quest-list > *')];
    check(quests.length === 3 && !quests.some(li => DUTCH.test(li.textContent)) && !DUTCH.test(txt('quest-reward')), 'opdrachten Engels: ' + quests.map(l => l.textContent.replace(/\s+/g, ' ').trim()).join(' | ') + ' / ' + txt('quest-reward'));
    const btnFree = document.getElementById('btn-free');
    check(/Free play/.test(btnFree.textContent) && /Pick the world/.test(btnFree.textContent), 'vaste tekst vertaald (Free play): ' + btnFree.textContent.replace(/\s+/g, ' ').trim());
    check(document.getElementById('btn-settings').getAttribute('aria-label') === 'Settings', 'aria-label vertaald');

    // ── werelden en winkel ──
    App.storageSet('crimson-board-stats', JSON.stringify({ solved: 9 })); App.renderThemePicker();
    const cards = [...document.querySelectorAll('.theme-card')];
    check(cards.length === 8 && cards.every(c => !DUTCH.test(c.querySelector('.theme-title, b, strong, h3, span') ? c.textContent : '')), 'acht werelden zonder Nederlands: ' + cards.map(c => c.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)).join(' | '));
    check(/Blackwood Manor|The Manor/.test(cards[0].textContent) && /The Pirate Ship/.test(cards[1].textContent), 'werelden dragen Engelse titels');
    document.querySelector('.theme-card[data-theme="hotel"]').click();
    check(document.getElementById('store-modal').classList.contains('active') && /Crimson Pass/.test(txt('store-lead')) && !DUTCH.test(txt('store-lead')), 'winkel Engels: ' + txt('store-lead'));
    check([...document.querySelectorAll('#store-rows .store-row')].length === 8 && ![...document.querySelectorAll('#store-rows')].some(r => DUTCH.test(r.textContent)), 'winkelrijen Engels');
    App.hideModal('store-modal');

    // ── een zaak spelen ──
    document.getElementById('btn-free').click(); await sleep(300);
    document.getElementById('btn-board-start').click(); await sleep(400);
    check(active() === 'screen-board', 'bord open');
    const clues = [...document.querySelectorAll('#clue-track .bclue-text, .bclue-text')].map(e => e.textContent.trim()).filter(Boolean);
    check(clues.length > 0 && clues.every(c => /^(I |According to|.+ and I )/.test(c)) && !clues.some(c => DUTCH.test(c)), 'verklaringen in het Engels: ' + clues.slice(0, 2).join(' | '));
    const title = txt('board-title') || txt('case-title');
    check(!DUTCH.test(title), 'zaaktitel Engels: ' + title);
    const names = [...document.querySelectorAll('.bclue-name')].map(e => e.textContent.trim());
    check(names.length > 0 && !names.some(n => /^(de |het |Mevrouw|Meneer|Kok|Butler |Majoor|Tante|Bootsman|Dokter )/.test(n)), 'sprekers met Engelse titels: ' + names.join(', '));
    const roomLabels = [...document.querySelectorAll('.room-label, .broom-name, [data-room-name]')].map(e => e.textContent.trim()).filter(Boolean);
    check(!roomLabels.some(r => /\b(keuken|eetkamer|bibliotheek|studeerkamer|salon|hal|kelder|dek|kajuit)\b/i.test(r)), 'kamernamen Engels: ' + roomLabels.slice(0, 4).join(', '));
    const p = Board.puzzle;
    const expl = window.Mentor.explain(p.clues[0], p);
    check(!DUTCH.test(String(expl)), 'uitleg van Van Dam Engels');
    document.getElementById('btn-board-hint').click(); await sleep(50);
    const hintText = txt('hint-text') + ' ' + txt('hint-sub');
    check(hintText.length > 0 && !DUTCH.test(hintText), 'hint Engels: ' + hintText.slice(0, 80));

    // ── omschakelen bewaart de keuze ──
    check(App.storageGet('crimson-lang') === 'en', 'taalkeuze bewaard');
    check(errors.length === 0, 'geen fouten tijdens het spelen in het Engels: ' + errors.join(' | '));
  } catch (e) { failures++; console.log('EXCEPTIE', e && e.stack || e); }
  console.log(failures ? `${failures} FAILURES` : 'ALLE ENGELS CHECKS PASSED');
  process.exit(failures ? 1 : 0);
})();

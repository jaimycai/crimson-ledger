// End-to-end flow test in jsdom: splash -> menu -> daily -> intro -> game -> fill grid -> check -> results.
const fs = require('fs');
const path = require('path');
// jsdom: eerst lokaal (npm install), anders lenen we die van de CrimsonLedger Expo-app
function loadJsdom() {
  try { return require('jsdom'); } catch (e) { /* niet lokaal geïnstalleerd */ }
  return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom');
}
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');

let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
// Inline the scripts so no file loading is needed
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) =>
  `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
html = html.replace(/<link[^>]+>/g, '').replace('</body>', '<script>window.App = App; window.Board = Board;</script></body>');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(String(e.message || e)));
vc.on('error', (...a) => errors.push(a.join(' ')));
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
const { window } = dom;
const { document } = window;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const active = () => document.querySelector('.screen.active').id;
const click = id => document.getElementById(id).click();
let failures = 0;
const check = (cond, msg) => { if (cond) console.log('ok  ', msg); else { failures++; console.log('FAIL', msg); } };

(async () => {
  await sleep(50);
  check(window.App && window.App.currentScreen === 'splash', 'App initialised on splash');
  check(active() === 'screen-splash', 'splash screen active');

  // ── Eerste bezoek: splash → bord-oefenzaak ──
  click('btn-splash-start'); await sleep(350);
  check(active() === 'screen-board' && window.Board.isTutorial, 'first visit: splash goes straight to the board tutorial');
  check(!document.getElementById('board-coach').hidden, 'board coach visible');
  check(document.getElementById('board-coach-step').textContent === 'Stap 1 van 4', 'board step 1');
  const bcell = (x, y) => document.querySelector(`#board-grid .bcell[data-x="${x}"][data-y="${y}"]`);
  bcell(1, 1).click();
  check(!window.Board.placements[0] && window.Board.tutorialStep === 0, 'tap on a non-highlighted board cell is ignored');
  check(bcell(0, 0).classList.contains('hinted'), 'step 1 highlights the corner cell');
  bcell(0, 0).click();
  check(!!window.Board.placements[0] && window.Board.tutorialStep === 1, 'board step 1 done');
  bcell(3, 3).click();
  check(window.Board.tutorialStep === 2 && !document.getElementById('btn-board-check').disabled, 'board step 2 done, check enabled');
  click('btn-board-check');
  check(document.getElementById('murder-modal').classList.contains('active') && window.Board.tutorialStep === 3, 'murder question in tutorial');
  document.querySelector('.murder-opt[data-s="1"]').click(); await sleep(1100);
  check(active() === 'screen-results', 'board tutorial results screen');
  check(document.getElementById('results-headline').textContent === 'Goed gedaan!', 'board tutorial headline');
  check(/Naar de kaart/.test(document.getElementById('btn-play-again').textContent), 'results button text for tutorial: to the map');
  check(document.getElementById('streak-count').textContent === '0', 'tutorial does not count for the streak');
  check(window.localStorage.getItem('crimson-board-tutorial-done') === '1', 'board tutorial marked done');
  click('btn-play-again'); await sleep(350);
  check(active() === 'screen-campaign', 'world map after the board tutorial');
  click('btn-campaign-back'); await sleep(350);
  check(active() === 'screen-menu', 'menu after the map');
  click('btn-tutorial'); await sleep(350);
  check(active() === 'screen-board' && window.Board.isTutorial, 'board tutorial replay from menu');
  click('btn-board-tutorial-skip'); await sleep(350);
  check(active() === 'screen-menu' && !window.Board.isTutorial, 'skip returns to menu');

  // ── Klassiek raster: oefenzaak via het klassieke menu ──
  click('btn-grid-tutorial'); await sleep(350);
  check(active() === 'screen-game', 'grid tutorial from classic menu');
  check(window.App.isTutorial === true, 'tutorial mode on');
  check(!document.getElementById('tutorial-coach').hidden, 'coach panel visible');
  check(document.body.classList.contains('tutorial-mode'), 'body has tutorial-mode class');
  check(document.querySelectorAll('.grid-cell[data-ri]').length === 4, 'tutorial grid has 4 cells');
  check(document.querySelectorAll('.clue-item').length === 2, 'tutorial has 2 clues');
  check(document.getElementById('tutorial-coach-step').textContent === 'Stap 1 van 5', 'step 1 shown');
  check(document.getElementById('btn-check').disabled, 'check disabled at step 1');
  const tcell = (i, j) => document.querySelector(`.grid-cell[data-ri="0"][data-ci="1"][data-ii="${i}"][data-ij="${j}"]`);
  // wrong cell is ignored
  tcell(1, 1).click();
  check(tcell(1, 1).textContent === '' && window.App.tutorialStep === 0, 'tap on a non-highlighted cell is ignored');
  check(tcell(0, 1).classList.contains('hint-highlight'), 'step 1 highlights Clara × Tuin');
  tcell(0, 1).click();
  check(tcell(0, 1).textContent === '✗' && window.App.tutorialStep === 1, 'step 1 done with ✗');
  tcell(0, 0).click();
  check(window.App.tutorialStep === 1, 'step 2: after one tap (✗) still waiting for ✓');
  tcell(0, 0).click();
  check(tcell(0, 0).textContent === '✓' && window.App.tutorialStep === 2, 'step 2 done with ✓');
  tcell(1, 0).click();
  check(window.App.tutorialStep === 3, 'step 3 done with ✗');
  tcell(1, 1).click(); tcell(1, 1).click();
  check(window.App.tutorialStep === 4, 'step 4 done with ✓');
  check(document.getElementById('tutorial-coach-step').textContent === 'Stap 5 van 5', 'final step shown');
  check(!document.getElementById('btn-check').disabled, 'check enabled at final step');
  click('btn-check');
  check(window.App.solved === true, 'tutorial solved');
  await sleep(1600);
  check(active() === 'screen-results', 'tutorial results screen');
  check(document.getElementById('results-headline').textContent === 'Goed gedaan!', 'tutorial headline');
  check(document.getElementById('btn-play-again').textContent === 'Naar het hoofdmenu', 'results button text for tutorial');
  check(document.getElementById('streak-count').textContent === '0', 'tutorial does not count for the streak');
  click('btn-play-again'); await sleep(350);
  check(active() === 'screen-menu', 'menu after tutorial');
  check(window.App.isTutorial === false && !document.body.classList.contains('tutorial-mode'), 'tutorial mode off');
  check(window.localStorage.getItem('crimson-tutorial-done') === '1', 'tutorial marked done');
  // Replay from menu, then skip
  click('btn-grid-tutorial'); await sleep(350);
  check(active() === 'screen-game' && window.App.isTutorial, 'grid tutorial replay from menu');
  click('btn-tutorial-skip'); await sleep(350);
  check(active() === 'screen-menu' && !window.App.isTutorial, 'grid skip returns to menu');
  // Fresh window with tutorial done: splash goes to menu
  {
    const dom2 = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
    await sleep(50);
    dom2.window.localStorage.setItem('crimson-tutorial-done', '1');
    dom2.window.localStorage.setItem('crimson-board-tutorial-done', '1');
    dom2.window.document.getElementById('btn-splash-start').click(); await sleep(350);
    check(dom2.window.document.querySelector('.screen.active').id === 'screen-menu', 'returning visitor: splash goes to menu');
    dom2.window.close();
  }
  check(document.getElementById('daily-date').textContent.length > 5, 'daily date rendered: ' + document.getElementById('daily-date').textContent);

  // How-it-works modal
  click('btn-how'); check(document.getElementById('how-modal').classList.contains('active'), 'how modal opens');
  click('btn-close-how'); check(!document.getElementById('how-modal').classList.contains('active'), 'how modal closes');

  // Daily case
  click('btn-daily'); await sleep(350);
  check(active() === 'screen-intro', 'intro after daily');
  check(document.getElementById('intro-text').children.length === 4, 'intro paragraphs rendered');
  check(document.getElementById('intro-suspects').children.length === 4, 'four suspect chips (gemiddeld)');

  click('btn-start-case'); await sleep(350);
  check(active() === 'screen-game', 'game screen');
  const cells = document.querySelectorAll('.grid-cell[data-ri]');
  check(cells.length === 3 * 16, `48 interactive cells rendered (got ${cells.length})`);
  const clueCount = document.querySelectorAll('.clue-item').length;
  check(clueCount > 0, `clues rendered: ${clueCount}`);
  check(document.getElementById('btn-check').disabled, 'check button disabled on empty grid');

  // Hint on empty grid
  click('btn-hint');
  check(document.getElementById('hint-modal').classList.contains('active'), 'hint modal opens');
  check(document.getElementById('hint-text').textContent.length > 10, 'hint text: ' + document.getElementById('hint-text').textContent);
  check(document.querySelectorAll('.grid-cell.hint-highlight').length >= 1, 'hint highlights a cell');
  click('btn-close-hint');

  // Cell cycling
  const c0 = cells[0];
  c0.click(); check(c0.classList.contains('eliminated') && c0.textContent === '✗', 'first click -> ✗');
  c0.click(); check(c0.classList.contains('confirmed') && c0.textContent === '✓', 'second click -> ✓');
  c0.click(); check(!c0.classList.contains('confirmed') && c0.textContent === '', 'third click -> empty');

  // Wrong answer: confirm a cell that is wrong, plus N-1 more to enable check
  const App = window.App;
  const sol = App.solution; // groups: group[cat] = item
  const findCell = (ri, ci, ii, ij) =>
    document.querySelector(`.grid-cell[data-ri="${ri}"][data-ci="${ci}"][data-ii="${ii}"][data-ij="${ij}"]`) ||
    document.querySelector(`.grid-cell[data-ri="${ci}"][data-ci="${ri}"][data-ii="${ij}"][data-ij="${ii}"]`);
  const confirmCell = (ri, ci, ii, ij) => { const el = findCell(ri, ci, ii, ij); el.click(); el.click(); };
  // wrong cell for suspect 0 in category 1
  const wrongLoc = (sol[0][1] + 1) % 4;
  confirmCell(0, 1, 0, wrongLoc);
  for (let s = 1; s < 4; s++) confirmCell(0, 1, s, sol[s][1]);
  check(!document.getElementById('btn-check').disabled, 'check enabled after 4 confirmations');
  click('btn-check');
  check(document.querySelectorAll('.grid-cell.error').length === 1, 'one error cell highlighted');
  check(document.querySelectorAll('.grid-cell.correct').length === 3, 'three correct cells highlighted');
  check(App.attempts === 1 && !App.solved, 'attempt counted, not solved');
  check(document.getElementById('toast').classList.contains('show'), 'toast shown');

  // Reset then fill the true solution everywhere
  click('btn-reset');
  check(document.querySelectorAll('.grid-cell.confirmed').length === 0, 'reset clears grid');
  for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) for (const grp of sol) confirmCell(a, b, grp[a], grp[b]);
  check(document.querySelectorAll('.grid-cell.confirmed').length === 12, '12 confirmed cells');
  click('btn-check');
  check(App.solved === true, 'solved flag set');
  await sleep(1600);
  check(active() === 'screen-results', 'results screen shown');
  check(document.getElementById('results-headline').textContent === 'Zaak Gesloten!', 'headline: ' + document.getElementById('results-headline').textContent);
  check(document.getElementById('results-solution').querySelectorAll('.results-solution-row').length === 4, 'solution rows rendered');
  check(document.getElementById('stat-attempts').textContent === '2', 'attempts stat = 2');
  check(document.getElementById('btn-play-again').textContent === 'Naar het menu', 'results button text for normal case');
  check(document.getElementById('stat-hints').textContent === '1', 'hints stat = 1');
  check(document.getElementById('streak-count').textContent === '1', 'streak became 1');
  const share = App.generateEmojiGrid();
  check(share.split('\n').length === 4 && share.includes('🟩'), 'emoji grid generated');

  // Play again -> menu -> free play hard (5 items)
  click('btn-play-again'); await sleep(350);
  check(active() === 'screen-menu', 'back to menu');
  document.querySelector('.difficulty-btn[data-difficulty="moeilijk"]').click();
  click('btn-freeplay'); await sleep(350);
  click('btn-start-case'); await sleep(350);
  check(document.querySelectorAll('.grid-cell[data-ri]').length === 3 * 25, 'hard: 75 cells');
  check(document.getElementById('game-diff-tag').textContent === 'Moeilijk', 'hard tag shown');
  click('btn-back-menu2'); await sleep(350);
  check(active() === 'screen-menu', 'back button from game works');

  check(errors.length === 0, 'no JS errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  console.log(failures ? `\n${failures} FAILURES` : '\nALL E2E CHECKS PASSED');
  window.close();
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });

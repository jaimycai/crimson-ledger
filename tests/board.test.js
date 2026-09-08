// Interactietest v2: slachtoffer, plaatsen, lerende hints, moordenaarsvraag, resultaat, dagelijkse zaak.
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
html = html.replace(/<link[^>]+>/g, '').replace('</body>', '<script>window.App = App; window.Board = Board; window.FloorPlan = FloorPlan; window.Themes = Themes; window.Campaign = Campaign;</script></body>');
const errors = [];
const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e)));
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8080/', virtualConsole: vc });
const { window } = dom, { document } = window;
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { if (c) console.log('ok  ', m); else { failures++; console.log('FAIL', m); } };
const cellAt = (x, y) => document.querySelector(`#board-grid .bcell[data-x="${x}"][data-y="${y}"]`);
const active = () => document.querySelector('.screen.active').id;

(async () => {
  try {
    await sleep(60);
    const { Board, App, FloorPlan } = window;

    // ── menu: plattegrondzaak is de hoofdknop ──
    check(!!document.getElementById('btn-board-daily') && !!document.getElementById('btn-board-start'), 'menu heeft dagelijkse + vrije plattegrondzaak');
    check(document.getElementById('board-stats').textContent.includes('Nog geen'), 'voortgang start leeg: ' + document.getElementById('board-stats').textContent);
    check(document.getElementById('menu-rank').textContent.includes('Rekruut') && document.getElementById('menu-rank').textContent.includes('tot Speurder'), 'rang start als Rekruut: ' + document.getElementById('menu-rank').textContent);

    // ── themakiezer + sloten ──
    check(document.querySelectorAll('.theme-card').length === 4, 'vier thema\'s in het menu');

    // ── moeilijkheidskiezer: mini-plattegrond + verdachten/afmeting per niveau ──
    check(document.querySelectorAll('.difficulty-preview svg').length === 3, 'drie mini-plattegronden in de moeilijkheidskiezer');
    const metaHard = document.querySelector('.difficulty-meta[data-meta="moeilijk"]');
    check(metaHard.textContent.includes('8×8') && metaHard.querySelectorAll('i').length === 5, 'moeilijk toont 8×8 en vijf verdachten: ' + metaHard.textContent);
    check(document.querySelector('.difficulty-meta[data-meta="makkelijk"]').querySelectorAll('i').length === 3, 'makkelijk toont drie verdachten');
    const previewBefore = document.querySelector('.difficulty-preview[data-preview="gemiddeld"]').innerHTML;
    check(document.querySelector('.theme-card[data-theme="piraten"]').classList.contains('locked'), 'piratenschip is bij start vergrendeld');
    document.querySelector('.theme-card[data-theme="piraten"]').click();
    check(App.selectedTheme === 'landhuis', 'vergrendeld thema kan niet gekozen worden');
    App.storageSet('crimson-board-stats', JSON.stringify({ solved: 9 })); App.renderThemePicker();
    check(document.querySelectorAll('.theme-card.locked').length === 0, 'na 9 zaken is alles open');
    document.querySelector('.theme-card[data-theme="piraten"]').click();
    check(App.selectedTheme === 'piraten' && document.querySelector('.theme-card[data-theme="piraten"]').classList.contains('active'), 'thema kiezen werkt en wordt onthouden');
    check(document.querySelector('.difficulty-preview[data-preview="gemiddeld"]').innerHTML !== previewBefore, 'mini-plattegrond volgt het gekozen thema');
    document.getElementById('btn-board-start').click(); await sleep(300);
    check(Board.theme.id === 'piraten' && document.getElementById('board-grid').dataset.floor === 'planks', 'vrij spel gebruikt het gekozen thema + vloer');
    check(document.getElementById('board-casetext').textContent.includes('Kapitein Zwartoog'), 'zaaktekst: ' + document.getElementById('board-casetext').textContent);
    check(document.querySelectorAll('#board-grid .bfurn svg').length === Board.puzzle.furniture.size, 'piratenmeubels getekend');
    check(!!document.querySelector('.sus-chip .av-suspect'), 'piratenportretten getekend');
    Board.stopTimer(); App.navigateTo('menu'); await sleep(300);

    check(Board.start('gemiddeld', 12345, false), 'plattegrondzaak start');

    // ── Potlood: eerste keer een uitleg, daarna niet meer ──
    document.getElementById('toast').classList.remove('show');
    document.getElementById('btn-board-mark').click();
    check(Board.mode === 'mark' && document.getElementById('toast').classList.contains('show') && document.getElementById('toast-text').textContent.includes('Potlood'), 'potlood geeft eerste keer uitleg');
    document.getElementById('toast').classList.remove('show');
    Board.setMode('place'); document.getElementById('btn-board-mark').click();
    check(Board.mode === 'mark' && !document.getElementById('toast').classList.contains('show'), 'uitleg komt maar één keer');
    Board.setMode('place');
    const p = Board.puzzle;
    App.navigateTo('board'); await sleep(300);
    check(active() === 'screen-board', 'bordscherm actief');
    check(document.getElementById('board-casetext').textContent.includes(Board.theme.victimName), 'zaaktekst noemt het slachtoffer bij naam: ' + document.getElementById('board-casetext').textContent);
    check(!!document.querySelector('#board-grid .bvictim'), 'slachtoffer staat op de kaart');
    check(document.querySelectorAll('.bclue').length === p.clues.length && p.clues.length >= 4, `${p.clues.length} aanwijzingskaarten met nummer`);
    check(document.querySelectorAll('.bclue-num').length === p.clues.length, 'kaarten genummerd');
    check(!document.getElementById('board-tip').hidden, 'eerste keer: tip zichtbaar');
    document.getElementById('btn-board-tip-close').click();
    check(document.getElementById('board-tip').hidden, 'tip sluit en onthoudt dat');

    // ── slachtoffervakje weigert, maar vertelt wie het is ──
    Board.active = 0;
    cellAt(p.victim.x, p.victim.y).click();
    check(!Board.placements[0], 'slachtoffervakje kan niet bezet worden');
    const peekV = cellAt(p.victim.x, p.victim.y).querySelector('.bpeek');
    check(!!peekV && peekV.textContent === Board.theme.victimName, 'tik op het slachtoffer toont de naam: ' + (peekV && peekV.textContent));
    const [fk, ftype] = [...p.furniture.entries()][0];
    const [fx, fy] = fk.split(',').map(Number);
    cellAt(fx, fy).click();
    const peekF = cellAt(fx, fy).querySelector('.bpeek');
    check(!!peekF && peekF.textContent === p.furnitureNl[ftype] && !cellAt(p.victim.x, p.victim.y).querySelector('.bpeek'), 'tik op een meubel toont wat het is: ' + (peekF && peekF.textContent));

    // ── aanwijzingen: meubel-icoon in de tekst, tikken laat kamer/meubel oplichten ──
    const fi = p.clues.findIndex(c => c.furniture);
    check(fi === -1 || !!document.querySelector(`.bclue[data-clue="${fi}"] .bclue-furn svg`), 'meubel-icoon staat in de aanwijzing');
    const ri = p.clues.findIndex(c => c.room !== undefined && !c.pos);
    if (ri !== -1) {
      document.querySelector(`.bclue[data-clue="${ri}"]`).click();
      const roomCells = p.rooms.find(r => r.id === p.clues[ri].room).list.length;
      check(document.querySelectorAll('#board-grid .bcell.lit').length === roomCells && document.querySelector(`.bclue[data-clue="${ri}"]`).classList.contains('active'), `tik op aanwijzing laat de kamer oplichten (${roomCells} vakjes)`);
      Board.clearFocus();
      check(document.querySelectorAll('#board-grid .bcell.lit').length === 0 && !document.querySelector('.bclue.active'), 'oplichten stopt weer');
    }

    // ── plaatsen ──
    const t0 = p.solution[0];
    cellAt(t0.x, t0.y).click();
    check(!!cellAt(t0.x, t0.y).querySelector('.bsus') && Board.active === 1, 'tik plaatst verdachte en schuift door');
    check(document.querySelector('.sus-chip[data-s="0"]').classList.contains('placed'), 'kiezer toont geplaatst');
    // live feedback: goed geplaatst = geen rode kaart, kloppende aanwijzingen krijgen een vinkje
    const okNow = p.clues.filter(c => FloorPlan.holds(c, Board.placements, p) === true).length;
    check(document.querySelectorAll('.bclue.bad').length === 0 && document.querySelectorAll('.bclue.ok').length === okNow, `live-status: ${okNow} kloppende aanwijzing(en) groen, geen rode`);

    // ── lerende hint: legt uit, plaatst niets ──
    const placedBefore = Board.placements.filter(Boolean).length;
    Board.hint();
    check(document.getElementById('hint-modal').classList.contains('active'), 'hintvenster opent');
    check(Board.placements.filter(Boolean).length === placedBefore, 'hint plaatst niemand');
    check(document.getElementById('hint-text').textContent.length > 10, 'hinttekst: ' + document.getElementById('hint-text').textContent);
    check(document.querySelectorAll('#board-grid .bcell.hinted').length >= 1, 'hint markeert kandidaatvakjes');
    App.hideModal('hint-modal');

    // ── foute plaatsing: hint meldt de fout ──
    const wrongCell = p.rooms.flatMap(r => r.list).find(c => !p.furniture.has(FloorPlan.key(c.x, c.y)) &&
      !(c.x === p.victim.x && c.y === p.victim.y) && !p.solution.some(s => s.x === c.x && s.y === c.y) &&
      FloorPlan.roomOf(p.rooms, c.x, c.y).id !== FloorPlan.roomOf(p.rooms, p.solution[1].x, p.solution[1].y).id);
    Board.active = 1; cellAt(wrongCell.x, wrongCell.y).click();
    const badNow = p.clues.filter(c => FloorPlan.holds(c, Board.placements, p) === false).length;
    check(document.querySelectorAll('.bclue.bad').length === badNow, `live-status: ${badNow} geschonden aanwijzing(en) rood`);
    Board.hint();
    check(/verkeerd|niet op de juiste plek|twee verdachten/.test(document.getElementById('hint-text').textContent), 'hint meldt foute plaatsing: ' + document.getElementById('hint-text').textContent);
    App.hideModal('hint-modal');
    const hintsSoFar = Board.hintsUsed;

    // ── controleren met fout → poging geteld, geen modal ──
    p.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; });
    Board.placements[1] = wrongCell; Board.after();
    document.getElementById('btn-board-check').click();
    check(Board.attempts === 1 && !document.getElementById('murder-modal').classList.contains('active'), 'foute controle telt een poging');

    // ── alles goed → moordenaarsvraag ──
    Board.placements[1] = { x: p.solution[1].x, y: p.solution[1].y }; Board.after();
    document.getElementById('btn-board-check').click();
    check(document.getElementById('murder-modal').classList.contains('active'), 'moordenaarsvraag verschijnt');
    check(document.querySelectorAll('.murder-opt').length === p.suspects.length, 'alle verdachten als optie');
    const wrongOpt = document.querySelector(`.murder-opt[data-s="${(p.murderer + 1) % p.suspects.length}"]`);
    wrongOpt.click();
    check(Board.attempts === 2 && document.getElementById('murder-modal').classList.contains('active'), 'foute moordenaar: poging geteld, vraag blijft');
    document.querySelector(`.murder-opt[data-s="${p.murderer}"]`).click();
    await sleep(300);
    check(Board.solved && active() === 'screen-results', 'juiste moordenaar → resultaatscherm');
    check(document.getElementById('results-headline').textContent === 'Zaak Gesloten!', 'kop');
    check(!document.getElementById('btn-next-case').hidden && document.getElementById('btn-next-case').textContent.includes('Nog een zaak'), 'vrij spel biedt meteen een volgende zaak aan');
    check(document.getElementById('results-verdict').textContent.includes(p.suspects[p.murderer].label), 'verdict noemt de moordenaar');
    check(document.querySelectorAll('.results-solution-row').length === p.suspects.length, 'oplossing per verdachte');
    check(document.getElementById('stat-hints').textContent === String(hintsSoFar), 'hints-stat klopt');
    check(document.getElementById('stat-attempts').textContent === '3', 'pogingen-stat = 3');
    const share = Board.shareText();
    check(share.includes('Crimson Ledger · ' + Board.theme.title) && share.includes('🔪') && share.includes('🩸'), 'deeltekst met thema en kaart');
    document.getElementById('btn-share').click(); await sleep(50);
    check(errors.length === 0, 'delen vanuit plattegrondzaak zonder eerder rasterspel geeft geen fout');
    check(document.getElementById('board-stats').textContent.includes('10 zaken opgelost'), 'voortgang bijgewerkt: ' + document.getElementById('board-stats').textContent);
    check(document.getElementById('menu-rank').textContent.includes('Rechercheur') && document.getElementById('menu-rank').textContent.includes('nog 5 zaken tot Inspecteur'), 'rang na 10 zaken: ' + document.getElementById('menu-rank').textContent);

    // ── dagelijkse zaak → streak ──
    document.getElementById('btn-play-again').click(); await sleep(300);
    check(active() === 'screen-menu', 'terug naar menu');
    document.getElementById('btn-board-daily').click(); await sleep(300);
    check(active() === 'screen-board' && Board.isDaily, 'dagelijkse plattegrondzaak gestart');
    check(Board.theme.id === window.Themes.forDay(App.getDayNumber()).id, 'dagelijkse zaak gebruikt het thema van vandaag: ' + Board.theme.title);
    const d = Board.puzzle;
    d.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after();
    document.getElementById('btn-board-check').click();
    document.querySelector(`.murder-opt[data-s="${d.murderer}"]`).click(); await sleep(300);
    check(document.getElementById('streak-count').textContent === '1', 'streak = 1 na dagelijkse zaak');
    check(document.getElementById('board-daily-date').textContent.includes('opgelost'), 'menu toont: vandaag opgelost');

    // ── oefenzaak op het bord ──
    document.getElementById('btn-tutorial').click(); await sleep(300);
    check(active() === 'screen-board' && Board.isTutorial && !document.getElementById('board-coach').hidden, 'oefenzaak start met coach');
    check(document.getElementById('board-coach-step').textContent === 'Stap 1 van 4', 'stap 1');
    cellAt(1, 1).click();
    check(!Board.placements[0] && Board.tutorialStep === 0, 'verkeerd vakje wordt genegeerd');
    check(cellAt(0, 0).classList.contains('hinted'), 'doelvakje licht op');
    cellAt(0, 0).click();
    check(!!Board.placements[0] && Board.tutorialStep === 1 && Board.active === 1, 'stap 1 klaar, Marcus geselecteerd');
    cellAt(3, 3).click();
    check(Board.tutorialStep === 2 && /Controleer/.test(document.getElementById('board-coach-text').textContent), 'stap 2 klaar → controleer');
    document.getElementById('btn-board-check').click();
    check(document.getElementById('murder-modal').classList.contains('active') && /Marcus/.test(document.getElementById('murder-question').textContent), 'moordenaarsvraag met uitleg');
    document.querySelector('.murder-opt[data-s="1"]').click(); await sleep(300);
    check(active() === 'screen-results' && document.getElementById('results-headline').textContent === 'Goed gedaan!', 'oefenzaak afgerond');
    check(App.storageGet('crimson-board-tutorial-done') === '1' && !Board.isTutorial, 'oefenzaak gemarkeerd als gedaan');
    check(Board.loadStats().solved === 11, 'oefenzaak telt niet mee als opgeloste zaak (blijft 11: 9 voorgeladen + vrij spel + dagelijks)');

    // ── campagne ──
    document.getElementById('btn-campaign').click(); await sleep(300);
    check(active() === 'screen-campaign', 'campagnescherm opent');
    check(document.querySelectorAll('.chapter').length === 13 && document.querySelectorAll('.case-card').length === 99, `12 delen + archief, 96 zaken + 3 dossiers (${document.querySelectorAll('.chapter').length} secties, ${document.querySelectorAll('.case-card').length} kaarten)`);
    check(document.querySelector('.case-card[data-chapter="landhuis-2"][data-idx="0"]').classList.contains('locked') && document.querySelector('.case-card[data-chapter="archief"][data-idx="0"]').classList.contains('locked'), 'deel II en archief nog dicht');
    check(!document.querySelector('.case-card[data-chapter="landhuis"][data-idx="0"]').classList.contains('locked') &&
          document.querySelector('.case-card[data-chapter="landhuis"][data-idx="1"]').classList.contains('locked'), 'zaak 1 open, zaak 2 nog dicht');
    document.querySelector('.case-card[data-chapter="landhuis"][data-idx="0"]').click(); await sleep(300);
    check(active() === 'screen-board' && Board.campaignCase && Board.campaignCase.title === 'Het glas Bordeaux', 'campagnezaak 1 gestart');
    check(document.getElementById('board-casetext').textContent.includes('toost'), 'verhaaltje in de zaaktekst');
    const cp = Board.puzzle;
    cp.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after();
    document.getElementById('btn-board-check').click();
    document.querySelector(`.murder-opt[data-s="${cp.murderer}"]`).click(); await sleep(300);
    check(active() === 'screen-results' && !document.getElementById('results-stars').hidden && document.querySelector('.stars').textContent === '★★★', 'drie sterren zonder hint en in één keer');
    check(!document.getElementById('btn-next-case').hidden && /De verdwenen sleutel/.test(document.getElementById('btn-next-case').textContent), 'volgende-zaak-knop');
    check(window.Campaign.stars('landhuis', 0) === 3 && window.Campaign.isUnlocked('landhuis', 1), 'voortgang bewaard, zaak 2 open');
    document.getElementById('btn-next-case').click(); await sleep(300);
    check(active() === 'screen-board' && Board.campaignCase.idx === 1, 'volgende zaak start direct');
    Board.stopTimer(); App.navigateTo('menu'); await sleep(300);
    check(document.getElementById('campaign-progress').textContent.startsWith('1 van 96'), 'menu toont campagnevoortgang');

    // ── geluid ──
    const sb = document.getElementById('btn-sound');
    check(/Geluid aan/.test(sb.textContent), 'geluid staat standaard aan');
    sb.click();
    check(/Geluid uit/.test(sb.textContent) && App.storageGet('crimson-sound') === '0', 'geluid uitzetten wordt onthouden');
    check(/rel="manifest" href="manifest.json"/.test(fs.readFileSync(path.join(DIR, 'index.html'), 'utf8')) && fs.existsSync(path.join(DIR, 'sw.js')) && fs.existsSync(path.join(DIR, 'icon-512.png')), 'manifest, service worker en iconen aanwezig');

    // ── instellingen: voortgang wissen in twee tikken ──
    document.getElementById('btn-settings').click();
    check(document.getElementById('settings-modal').classList.contains('active'), 'instellingen openen');
    const rb = document.getElementById('btn-reset-progress');
    rb.click(); check(/Zeker/.test(rb.textContent) && (Board.loadStats().solved || 0) > 0, 'eerste tik vraagt bevestiging, wist nog niets');
    rb.click(); check((Board.loadStats().solved || 0) === 0 && document.getElementById('streak-count').textContent === '0' && window.Campaign.doneCount() === 0, 'tweede tik wist alle voortgang');
    check(document.querySelectorAll('.theme-card.locked').length === 3, 'thema-sloten weer dicht na wissen');
    document.getElementById('btn-close-settings').click();
    check(fs.existsSync(path.join(DIR, 'privacy.html')) && fs.existsSync(path.join(DIR, 'support.html')) && fs.existsSync(path.join(DIR, 'icon-1024.png')), 'privacy, support en 1024-icoon aanwezig');

    // ── klassiek raster blijft bereikbaar ──
    check(!!document.getElementById('btn-daily') && !!document.getElementById('btn-freeplay'), 'klassiek raster blijft bereikbaar');
    check(errors.length === 0, 'geen JS-fouten: ' + errors.join(' | '));
    console.log(''); console.log(failures === 0 ? 'ALLE BOARD CHECKS PASSED' : `${failures} FAILURES`);
  } catch (e) { console.log('EXCEPTIE:', e.message, (e.stack || '').split('\n')[1]); failures++; }
  process.exit(failures === 0 ? 0 : 1);
})();

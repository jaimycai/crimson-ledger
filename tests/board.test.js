// Interactietest v2: slachtoffer, plaatsen, lerende hints, moordenaarsvraag, resultaat, dagelijkse zaak.
const fs = require('fs'), path = require('path');
function loadJsdom() { try { return require('jsdom'); } catch (e) {} return require('/Users/jaimycai/Documents/Claude/CrimsonLedger/app/node_modules/jsdom'); }
const { JSDOM, VirtualConsole } = loadJsdom();
const DIR = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>${fs.readFileSync(path.join(DIR, src), 'utf8')}</script>`);
html = html.replace(/<link[^>]+>/g, '').replace('</body>', '<script>window.App = App; window.Board = Board; window.FloorPlan = FloorPlan; window.Themes = Themes; window.Campaign = Campaign; window.Progress = Progress; window.Mentor = Mentor;</script></body>');
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

    // ── thuisscherm: dagelijkse zaak, weekstrook, zaak van de week, campagne, vrij spel ──
    check(!!document.getElementById('btn-board-daily') && !!document.getElementById('btn-board-start'), 'menu heeft dagelijkse + vrije plattegrondzaak');
    check(/Zaak van vandaag: /.test(document.getElementById('daily-title').textContent) && /\+150 punten/.test(document.getElementById('daily-bonus').textContent), 'dagelijkse kaart met titel en bonus: ' + document.getElementById('daily-title').textContent);
    check(document.querySelectorAll('#week-strip .wday').length === 7 && !!document.querySelector('#week-strip .wday.today') && document.querySelectorAll('#week-strip .wday.played').length === 0, 'weekstrook: zeven dagen, vandaag gemarkeerd, nog niets gespeeld');
    check(document.getElementById('week-title').textContent.length > 5 && document.getElementById('btn-week').textContent === 'Start' && document.getElementById('btn-week-share').hidden, 'zaak van de week klaar om te starten: ' + document.getElementById('week-title').textContent);
    check(document.getElementById('campaign-next').textContent === 'Deel I · Zaak 1' && document.getElementById('campaign-icon').textContent === '🏚️', 'campagnekaart wijst naar de eerste zaak');
    document.getElementById('btn-free').click(); await sleep(300);
    check(active() === 'screen-free', 'vrij spelen opent een eigen scherm');
    document.getElementById('btn-free-back').click(); await sleep(300);
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
    // verklaringen: naam + tekst in de ik-vorm, portret van de spreker, inspecteur bij een lege kamer
    const firstClue = document.querySelector('.bclue[data-clue="0"]');
    check(firstClue.querySelector('.bclue-name').textContent.length > 1 && /^(Ik |Volgens|.+ en ik )/.test(firstClue.querySelector('.bclue-text').textContent.trim()), 'verklaring in de ik-vorm: ' + firstClue.querySelector('.bclue-name').textContent + ': ' + firstClue.querySelector('.bclue-text').textContent.trim());
    const ei = p.clues.findIndex(c => c.kind === 'empty-room');
    check(ei === -1 || !!document.querySelector(`.bclue[data-clue="${ei}"] .bclue-mentor img`), 'lege kamer wordt door de inspecteur voorgelezen');
    const pi = p.clues.findIndex(c => c.a !== undefined);
    check(pi === -1 || document.querySelectorAll(`.bclue[data-clue="${pi}"] .bclue-pair .bclue-ava`).length === 2, 'verklaring over twee personen toont twee portretten');
    // "Nieuw!"-uitleg: één kaart, verdwijnt na Begrepen en komt niet terug
    check(!!document.getElementById('newclue') && !!Board.newIntro && document.getElementById('newclue-modal').classList.contains('active'), 'eerste zaak: "Nieuw in dit deel" in een eigen venster, klok staat stil: ' + (Board.newIntro && Board.newIntro.title));
    check(Board.timerId === null && document.querySelectorAll('#board-clues .newclue').length === 0, 'uitleg staat niet tussen de verklaringen en de klok wacht');
    const introId = Board.newIntro.id;
    document.getElementById('btn-newclue-ok').click();
    check(!document.getElementById('newclue') && !document.getElementById('newclue-modal').classList.contains('active') && JSON.parse(App.storageGet('crimson-newclue-seen')).includes(introId), 'Begrepen sluit de uitleg en onthoudt dat');
    check(Board.timerId !== null, 'na Begrepen loopt de klok');
    // scheidingslijn: tik = meer tekst (kleiner bord), nog een tik = groot bord
    Board.toggleRead();
    check(document.getElementById('screen-board').classList.contains('read') || document.getElementById('board-grid').getBoundingClientRect().width === 0, 'tik op de lijn: meer tekst (in jsdom zonder layout: geen fout)');
    Board.setBoardSize(1e4, true, 360);
    check(!document.getElementById('screen-board').classList.contains('read') && App.storageGet('crimson-board-read') === null, 'groot bord: geen onthouden voorkeur');
    Board.setBoardSize(240, true, 360);
    check(document.getElementById('board-grid').style.getPropertyValue('--board-px') === '240px' && App.storageGet('crimson-board-read') === '240' && document.getElementById('clue-handle-label').textContent === 'Groter bord', 'meer tekst: bord 240px, onthouden, knop zegt Groter bord');
    // een volgende zaak begint met dezelfde verdeling, ook al is het scherm dan
    // nog verborgen en valt er dus niets te meten (Board.start roept applyRead aan)
    document.getElementById('board-grid').style.removeProperty('--board-px');
    Board.applyRead();
    check(document.getElementById('board-grid').style.getPropertyValue('--board-px') === '240px' && document.getElementById('screen-board').classList.contains('read'), 'volgende zaak begint met dezelfde verdeling');
    Board.setBoardSize(1e4, true, 360);
    Board.applyRead();
    check(!document.getElementById('board-grid').style.getPropertyValue('--board-px') && !document.getElementById('screen-board').classList.contains('read'), 'groot bord blijft groot bij een nieuwe zaak');
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
    check(document.querySelectorAll('.bclue.bad').length === 0 && document.querySelectorAll('.bclue.ok').length === okNow && document.querySelectorAll('.bclue-state.ok').length === okNow, `live-status: ${okNow} kloppende verklaring(en) groen met "Klopt", geen rode`);

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
    check(Board.attempts === 1 && !document.getElementById('screen-board').classList.contains('accusing'), 'foute controle telt een poging');

    // ── alles goed → moordenaarsvraag ──
    Board.placements[1] = { x: p.solution[1].x, y: p.solution[1].y }; Board.after();
    document.getElementById('btn-board-check').click();
    check(document.getElementById('screen-board').classList.contains('accusing'), 'moordenaarsvraag verschijnt');
    check(!document.getElementById('board-accuse').hidden && document.getElementById('board-grid').querySelectorAll('.bcell').length > 0, 'beschuldiging op het bordscherm zelf, plattegrond blijft staan');
    const rooms0 = [...document.querySelectorAll('.murder-opt .accuse-room')].map(e => e.textContent);
    check(rooms0.length === p.suspects.length && rooms0.every((r, i) => r === FloorPlan.roomOf(p.rooms, Board.placements[i].x, Board.placements[i].y).name), 'bij elke verdachte staat zijn kamer: ' + rooms0.join(', '));
    const roomCells = p.rooms.find(r => r.id === p.victim.roomId).cells.size;
    check(document.querySelectorAll('#board-grid .bcell.murder-room').length === roomCells, `kamer van het slachtoffer licht op (${roomCells} vakjes)`);
    document.getElementById('btn-accuse-back').click();
    check(!document.getElementById('screen-board').classList.contains('accusing') && document.getElementById('board-accuse').hidden && document.querySelectorAll('.bcell.murder-room').length === 0, 'Terug naar het bord: paneel weg, kamer weer gewoon');
    document.getElementById('btn-board-check').click();
    check(document.getElementById('screen-board').classList.contains('accusing'), 'opnieuw Controleer: vraag terug');
    check(document.querySelectorAll('.murder-opt').length === p.suspects.length, 'alle verdachten als optie');
    check(document.querySelectorAll('.accuse-ava').length === p.suspects.length && document.getElementById('murder-reaction').hidden, 'beschuldiging: portretten op een rij, nog geen reactie');
    const wrongS = (p.murderer + 1) % p.suspects.length;
    const wrongOpt = document.querySelector(`.murder-opt[data-s="${wrongS}"]`);
    wrongOpt.click();
    check(Board.attempts === 2 && document.getElementById('screen-board').classList.contains('accusing'), 'foute moordenaar: poging geteld, vraag blijft');
    const react = document.getElementById('murder-reaction');
    check(!react.hidden && react.classList.contains('wrong') && react.textContent.includes(p.suspects[wrongS].label), 'de verkeerde ontkent: ' + react.textContent.trim());
    document.querySelector(`.murder-opt[data-s="${p.murderer}"]`).click();
    check(react.classList.contains('right') && react.textContent.includes(p.suspects[p.murderer].label) && !Board.solved, 'de dader bekent, resultaat volgt even later: ' + react.textContent.trim());
    await sleep(1100);
    check(Board.solved && active() === 'screen-results', 'juiste moordenaar → resultaatscherm');
    check(document.getElementById('results-headline').textContent === 'Zaak Opgelost!', 'kop');
    // ceremonie: stempel, sterren, score, rang, opmerking van Van Dam
    check(!document.getElementById('results-panel').hidden && document.querySelectorAll('#score-rows .score-row').length === 4 && /Basis/.test(document.getElementById('score-rows').textContent), 'scorepaneel met vier regels');
    check(Board.cerTimers.length > 0, 'ceremonie loopt');
    document.getElementById('screen-results').click();
    check(Board.cerTimers.length === 0 && document.querySelectorAll('#screen-results .pending').length === 0, 'tik slaat de ceremonie over: alles zichtbaar');
    const tot = +document.getElementById('score-total').dataset.v;
    check(tot === Board.score.total && tot >= 500 && document.getElementById('score-total').textContent === `${tot} punten` && window.Progress.points() === tot, `punten: ${tot}, opgeteld bij het totaal`);
    check(/Van Dam merkt op/.test(document.getElementById('results-mentor').textContent) && /Rekruut|Speurder|Rechercheur/.test(document.getElementById('results-mentor').textContent), 'Van Dam merkt iets op: ' + document.getElementById('results-mentor').querySelector('p').textContent);
    check(/Rechercheur/.test(document.getElementById('results-rank').textContent) && document.querySelector('#results-rank .rank-bar i').style.width === '29%', 'rangbalk op het resultaat: ' + document.getElementById('results-rank').textContent);
    check(Board.medalsWon.some(m => m.id === 'eerste-zaak') && document.getElementById('medal-toast').classList.contains('show') && /Eerste zaak/.test(document.getElementById('medal-toast-text').textContent), 'onderscheiding "Eerste zaak" met toast');
    check(document.querySelectorAll('.results-solution-ava').length === p.suspects.length, 'portretten bij "waar iedereen stond"');
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
    document.querySelector(`.murder-opt[data-s="${d.murderer}"]`).click(); await sleep(1100);
    check(document.getElementById('streak-count').textContent === '1', 'streak = 1 na dagelijkse zaak');
    check(document.getElementById('board-daily-date').textContent.includes('opgelost'), 'menu toont: vandaag opgelost');
    check(document.querySelectorAll('#week-strip .wday.played').length === 1 && document.querySelector('#week-strip .wday.today').classList.contains('played'), 'weekstrook: vandaag afgevinkt');
    check(/Dagelijkse zaak/.test(document.getElementById('score-rows').textContent) && document.getElementById('daily-bonus').textContent.includes('opgelost') && document.getElementById('btn-board-daily').textContent === 'Nog een zaak', 'dagelijkse bonus geteld, kaart toont opgelost');

    // ── zaak van de week ──
    document.getElementById('btn-play-again').click(); await sleep(300);
    document.getElementById('btn-week').click(); await sleep(300);
    check(active() === 'screen-board' && Board.isWeekly && Board.difficulty === 'moeilijk' && /Week \d+/.test(document.getElementById('board-diff-tag').textContent), 'zaak van de week gestart: ' + document.getElementById('board-diff-tag').textContent);
    const wk = Board.puzzle;
    wk.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after();
    document.getElementById('btn-board-check').click();
    document.querySelector(`.murder-opt[data-s="${wk.murderer}"]`).click(); await sleep(1100);
    check(active() === 'screen-results' && /Zaak van de week/.test(document.getElementById('score-rows').textContent), 'weekzaak opgelost met bonus');
    check(window.Progress.weekDone() && document.getElementById('btn-week').textContent === 'Nog eens' && !document.getElementById('btn-week-share').hidden, 'weekkaart toont opgelost + delen');
    check(Board.medalsWon.some(m => m.id === 'weekzaak'), 'onderscheiding "Zaak van de week"');

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
    check(document.getElementById('screen-board').classList.contains('accusing') && /Marcus/.test(document.getElementById('murder-question').textContent), 'moordenaarsvraag met uitleg');
    document.querySelector('.murder-opt[data-s="1"]').click(); await sleep(1100);
    check(active() === 'screen-results' && document.getElementById('results-headline').textContent === 'Goed gedaan!' && document.getElementById('results-panel').hidden, 'oefenzaak afgerond, zonder scorepaneel');
    check(App.storageGet('crimson-board-tutorial-done') === '1' && !Board.isTutorial, 'oefenzaak gemarkeerd als gedaan');
    check(/Naar de kaart/.test(document.getElementById('btn-play-again').textContent), 'na de oefenzaak: knop naar de kaart');
    document.getElementById('btn-play-again').click(); await sleep(300);
    check(active() === 'screen-campaign' && !!document.querySelector('.mnode.open .mnode-pin'), 'oefenzaak eindigt op de kaart bij zaak 1');
    document.getElementById('btn-campaign-back').click(); await sleep(300);
    check(Board.loadStats().solved === 12, 'oefenzaak telt niet mee als opgeloste zaak (blijft 12: 9 voorgeladen + vrij spel + dagelijks + weekzaak)');

    // ── campagne: één doorlopende wereldkaart ──
    document.getElementById('btn-campaign').click(); await sleep(300);
    check(active() === 'screen-campaign', 'wereldkaart opent');
    check(document.querySelectorAll('.map-world').length === 5 && document.querySelectorAll('.map-banner').length === 4 && document.querySelectorAll('.map-banner .mapart').length === 4, 'één pad: vier werelden met een getekende banner, dan het archief');
    check(document.querySelectorAll('.mnode').length === 98 && document.querySelectorAll('.msign').length === 13, `96 zaken + 2 dossiers, 13 wegwijzers (${document.querySelectorAll('.mnode').length} knopen)`);
    check(document.querySelectorAll('.world-tab').length === 4 && document.querySelectorAll('.world-tab small').length === 0, 'vier werelden in de kiezer, alles open na 12 zaken');
    check(document.getElementById('campaign-total').textContent === '★ 0/288', 'sterrenteller over de hele campagne');
    const node = (ch, i) => document.querySelector(`.mnode[data-chapter="${ch}"][data-idx="${i}"]`);
    check(node('landhuis', 0).classList.contains('open') && !!node('landhuis', 0).querySelector('.mnode-pin') && node('landhuis', 1).classList.contains('locked') && node('landhuis-2', 0).classList.contains('locked') && node('archief', 0).classList.contains('locked') && node('piraten', 0).classList.contains('open') && !node('piraten', 0).querySelector('.mnode-pin'), 'zaak 1 open met pion; zaak 2, deel II en archief dicht; piraten zaak 1 open zonder pion');
    check(/Speel zaak 1 · Het glas Bordeaux/.test(document.getElementById('btn-map-play').textContent) && !document.getElementById('btn-map-play').disabled, 'grote knop: ' + document.getElementById('btn-map-play').textContent);
    check(document.querySelectorAll('.map-path path').length === 5 && document.querySelectorAll('.mapprop').length === 96, 'pad per sectie en 96 decoraties langs het pad');
    node('landhuis', 1).click();
    check(!document.getElementById('map-pop').hidden && /Los eerst zaak 1 op/.test(document.getElementById('map-pop').textContent) && !document.getElementById('btn-pop-play'), 'dichte knoop legt uit wat er eerst moet');
    document.querySelector('.world-tab[data-theme="ruimte"]').click();
    check(App.mapWorld === 'ruimte' && document.querySelector('.world-tab.active').dataset.theme === 'ruimte' && document.getElementById('map-scroll').scrollTop === App.mapSections.find(s => s.theme === 'ruimte').top, 'wereldkiezer scrollt naar Station Orion');
    document.querySelector('.world-tab[data-theme="landhuis"]').click();
    node('landhuis', 0).click();
    check(/Zaak 1: Het glas Bordeaux/.test(document.getElementById('map-pop').textContent) && /Makkelijk/.test(document.getElementById('map-pop').textContent) && /☆☆☆/.test(document.getElementById('map-pop').textContent), 'open knoop: titel, niveau, beste score');
    document.getElementById('btn-pop-play').click(); await sleep(300);
    // eerste zaak van een deel: eerst "Nieuw deel", dan de briefing van Van Dam
    check(document.getElementById('part-modal').classList.contains('active') && document.getElementById('part-title').textContent === 'Deel I · Het diner' && active() !== 'screen-board', '"Nieuw deel"-splash voor deel I');
    document.getElementById('btn-part-go').click(); await sleep(300);
    check(active() === 'screen-board' && Board.campaignCase && Board.campaignCase.title === 'Het glas Bordeaux', 'campagnezaak 1 gestart');
    check(document.getElementById('briefing-modal').classList.contains('active') && /Deel I · Zaak 1/.test(document.getElementById('briefing-sub').textContent) && /toost/.test(document.getElementById('briefing-text').textContent) && Board.timerId === null, 'briefing van Van Dam, klok staat stil');
    document.getElementById('btn-briefing-go').click();
    // na de briefing volgt de uitleg van een nieuwe soort verklaring (als die er is); de klok wacht tot Begrepen
    const introOpen = document.getElementById('newclue-modal').classList.contains('active');
    check(!document.getElementById('briefing-modal').classList.contains('active') && (introOpen ? Board.timerId === null && !!Board.newIntro : Board.timerId !== null), introOpen ? 'Aan de slag: eerst de uitleg, klok wacht' : 'Aan de slag: klok loopt');
    if (introOpen) document.getElementById('btn-newclue-ok').click();
    check(!document.getElementById('newclue-modal').classList.contains('active') && Board.timerId !== null, 'klok loopt op het bord');
    check(document.getElementById('board-casetext').textContent.includes('toost'), 'verhaaltje in de zaaktekst');
    const cp = Board.puzzle;
    cp.solution.forEach((c, i) => { Board.placements[i] = { x: c.x, y: c.y }; }); Board.after();
    document.getElementById('btn-board-check').click();
    document.querySelector(`.murder-opt[data-s="${cp.murderer}"]`).click(); await sleep(1100);
    Board.skipCeremony();
    check(active() === 'screen-results' && [...document.querySelectorAll('.rstar')].map(s => s.textContent).join('') === '★★★', 'drie sterren zonder hint en in één keer');
    check(!document.getElementById('btn-next-case').hidden && /De verdwenen sleutel/.test(document.getElementById('btn-next-case').textContent) && !document.getElementById('btn-map').hidden, 'volgende-zaak-knop en "Naar de kaart"');
    check(window.Campaign.stars('landhuis', 0) === 3 && window.Campaign.isUnlocked('landhuis', 1), 'voortgang bewaard, zaak 2 open');
    document.getElementById('btn-map').click(); await sleep(300);
    check(active() === 'screen-campaign' && node('landhuis', 0).classList.contains('done') && node('landhuis', 0).querySelector('.mnode-stars').textContent === '★★★' && node('landhuis', 1).classList.contains('open') && document.getElementById('campaign-total').textContent === '★ 3/288', 'kaart bijgewerkt: zaak 1 klaar met drie sterren, zaak 2 open');
    document.getElementById('btn-map-play').click(); await sleep(300);
    check(active() === 'screen-board' && Board.campaignCase.idx === 1 && !document.getElementById('part-modal').classList.contains('active') && document.getElementById('briefing-modal').classList.contains('active'), 'grote knop start zaak 2 met briefing, zonder deel-splash');
    document.getElementById('btn-briefing-go').click();
    Board.stopTimer(); App.navigateTo('menu'); await sleep(300);
    check(document.getElementById('campaign-progress').textContent.startsWith('1 van 96') && document.getElementById('campaign-next').textContent === 'Deel I · Zaak 2', 'menu toont campagnevoortgang en de volgende zaak');

    // ── vitrine & bureau ──
    document.getElementById('btn-awards').click(); await sleep(300);
    check(active() === 'screen-awards' && document.querySelectorAll('.medal').length === window.Progress.MEDALS.length && document.querySelectorAll('.medal.got').length >= 2, `vitrine: ${document.querySelectorAll('.medal.got').length} van ${document.querySelectorAll('.medal').length} medailles behaald`);
    check(/punten/.test(document.getElementById('awards-points').textContent) && document.getElementById('medal-count').textContent === String(document.querySelectorAll('.medal.got').length), 'punten en medailleteller in de kop');
    document.querySelector('.awards-tab[data-tab="vitrine"]').click();
    check(!document.getElementById('awards-vitrine').hidden && document.getElementById('awards-medals').hidden && document.querySelectorAll('.shelf').length === 4 && document.querySelectorAll('.ev').length === 96 && document.querySelectorAll('.ev:not(.miss)').length === 1 && /Wijnglas/.test(document.querySelector('.ev:not(.miss)').textContent), 'vitrine: vier planken, 96 plekken, het wijnglas staat erin');
    document.getElementById('btn-awards-back').click(); await sleep(300);

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
    rb.click(); check((Board.loadStats().solved || 0) === 0 && document.getElementById('streak-count').textContent === '0' && window.Campaign.doneCount() === 0 && window.Progress.points() === 0 && window.Progress.medalCount() === 0, 'tweede tik wist alle voortgang, ook punten en medailles');
    check(document.querySelectorAll('.theme-card.locked').length === 3, 'thema-sloten weer dicht na wissen');
    document.getElementById('btn-close-settings').click();
    check(fs.existsSync(path.join(DIR, 'privacy.html')) && fs.existsSync(path.join(DIR, 'support.html')) && fs.existsSync(path.join(DIR, 'icon-1024.png')), 'privacy, support en 1024-icoon aanwezig');

    // ── startscherm: laadbalk vol, knop zichtbaar ──
    check(document.getElementById('screen-splash').classList.contains('loaded') && document.querySelector('#splash-load i').style.width === '100%', 'startscherm: laadbalk vol en knop onthuld');

    // ── klassiek raster blijft bereikbaar ──
    check(!!document.getElementById('btn-daily') && !!document.getElementById('btn-freeplay'), 'klassiek raster blijft bereikbaar');
    check(errors.length === 0, 'geen JS-fouten: ' + errors.join(' | '));
    console.log(''); console.log(failures === 0 ? 'ALLE BOARD CHECKS PASSED' : `${failures} FAILURES`);
  } catch (e) { console.log('EXCEPTIE:', e.message, (e.stack || '').split('\n')[1]); failures++; }
  process.exit(failures === 0 ? 0 : 1);
})();

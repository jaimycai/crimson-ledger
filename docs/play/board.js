// Vertaalhulp: gebruikt de taalmotor (i18n.js) als die er is, anders de Nederlandse tekst.
const BD_T = (s, ...v) => { const g = typeof globalThis !== 'undefined' ? globalThis.T : undefined; if (typeof g === 'function') return g(s, ...v); return typeof s === 'string' ? s : s.map((x, i) => x + (i < v.length ? String(v[i]) : '')).join(''); };
// ============================================================
// BOARD v2 — plattegrondzaak: plaats de verdachten, vind wie
// alleen was met het slachtoffer. Eén bord per scherm, mobiel.
// ============================================================

const Board = {
  puzzle: null,
  placements: null,   // array per verdachte: {x,y} | null
  marks: null,        // "x,y" -> Set(suspectIndex)
  crosses: null,      // 1.6: kruisjes, "x,y" -> Set(suspectIndex): deze verdachte stond hier niet
  clueDone: null,     // aanwijzingen die de speler heeft afgevinkt
  history: null,
  hintRefs: null,     // {cells, clues} van de laatste hint
  active: 0,
  mode: 'place',      // place | mark | cross | erase
  zoom: 1,            // 1.6: 1 = het hele bord; groter = ingezoomd (alleen borden vanaf 8×8)
  startTime: 0,
  timerId: null,
  elapsed: 0,
  hintsUsed: 0,
  attempts: 0,
  solved: false,
  isDaily: false,
  isTutorial: false,
  tutorialStep: 0,
  campaignCase: null,
  difficulty: 'gemiddeld',
  seed: 0,
  focusClue: null,    // aangetikte aanwijzing (kamer/meubel licht op)
  focusTimer: null,
  peekTimer: null,
  newRank: null,      // rang die met deze zaak is bereikt
  rankInfo: null,     // rang voor/na, voor de rangbalk op het resultaatscherm
  isWeekly: false,    // zaak van de week
  weekly: null,
  missedDay: null,    // gemiste dagzaak die alsnog wordt gespeeld (1.6): { key, dayNo, title, date }
  afloop: null,       // "Zo zat het" van de laatst opgeloste zaak (pas na het oplossen berekend)
  newIntro: null,     // "Nieuw!"-uitleg bij een nog niet geziene soort verklaring
  score: null,        // { rows, total } van de laatste zaak
  medalsWon: [],
  cerTimers: [],      // ceremonie: uitgestelde stappen
  cuTimers: [],       // ceremonie: lopende tellers

  // ── Oefenzaak: vaste kleine plattegrond met begeleiding ────
  TUTORIAL: {
    cols: 5, rows: 4, difficulty: 'tutorial',
    layout: [[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1]],
    rooms: [{ name: 'Woonkamer', article: 'de', color: '#E8A798' }, { name: 'Keuken', article: 'de', color: '#9FC8C8' }],
    furniture: { '2,0': 'kast', '0,3': 'stoel', '2,3': 'tv', '4,3': 'plant', '4,2': 'doos' },
    victim: { x: 4, y: 0 },
    solution: [{ x: 0, y: 0 }, { x: 3, y: 3 }],
    murderer: 1,
    clues: [{ kind: 'room-pos', s: 0, room: 0, pos: 'hoek' }, { kind: 'next-to', s: 1, furniture: 'plant' }]
  },
  TUTORIAL_STEPS: [
    { suspect: 0, cell: { x: 0, y: 0 }, text: 'Aanwijzing 1: Lady Clementine was in de Woonkamer, in een hoek. Drie hoeken zijn bezet door meubels, dus blijft er één over. Sleep Clementine naar het oplichtende vakje, of tik erop.' },
    { suspect: 1, cell: { x: 3, y: 3 }, text: 'Aanwijzing 2: Meneer Hargrove stond direct naast een plant. Naast de plant is maar één vakje vrij. Sleep Hargrove erheen, of tik erop.' },
    { action: 'check', text: 'Iedereen staat op zijn plek. Tik op Controleer.' },
    { action: 'murder', text: 'De spelregel: alleen de moordenaar was in de kamer van het slachtoffer. Hargrove staat in de Keuken — kies Hargrove.' }
  ],

  startTutorial() {
    const theme = Themes.get('landhuis');
    const suspects = theme.suspects.slice(0, 2);
    const puzzle = FloorPlan.fromLayout({ ...this.TUTORIAL, suspects, theme });
    Object.assign(this, {
      puzzle, theme, difficulty: 'tutorial', seed: 0, isDaily: false, isTutorial: true, tutorialStep: 0, campaignCase: null,
      placements: new Array(2).fill(null), marks: new Map(), crosses: new Map(), clueDone: new Set(), history: [], hintRefs: null,
      active: 0, mode: 'place', hintsUsed: 0, attempts: 0, solved: false, elapsed: 0, focusClue: null, newRank: null, okCount: 0,
      isWeekly: false, weekly: null, missedDay: null, afloop: null, newIntro: null, score: null, medalsWon: []
    });
    this.prepareAfloop();
    document.getElementById('board-diff-tag').textContent = BD_T('🎓 Oefenzaak');
    document.getElementById('board-casetext').textContent = `${theme.icon} ${puzzle.caseText}`;
    const grid = document.getElementById('board-grid');
    grid.classList.remove('solved');
    grid.dataset.floor = theme.floor;
    document.getElementById('board-tip').hidden = true;
    this.endAccuse();
    this.deckIdx = 0;
    this.renderIntro();
    document.getElementById('board-coach').hidden = false;
    document.getElementById('btn-board-hint').disabled = true;
    this.resetZoom();
    this.renderBoard(); this.renderSuspects(); this.renderClues();
    this.fitBoard();
    this.showTutorialStep();
    this.startTimer();
    return true;
  },

  showTutorialStep() {
    const step = this.TUTORIAL_STEPS[this.tutorialStep];
    if (!step) return;
    // 1.5 metric: where in the practice case new players stop (40% did not reach case 1)
    if (!this.tutSent) this.tutSent = new Set();
    if (!this.tutSent.has(this.tutorialStep) && !App.storageGet('crimson-board-tutorial-done') && typeof Meting !== 'undefined') {
      this.tutSent.add(this.tutorialStep); Meting.send('tut_step', '', this.tutorialStep + 1);
    }
    document.getElementById('board-coach-step').textContent = BD_T`Stap ${this.tutorialStep + 1} van ${this.TUTORIAL_STEPS.length}`;
    document.getElementById('board-coach-text').textContent = step.text;
    this.hintRefs = step.cell ? { cells: [step.cell], clues: [this.tutorialStep] } : null;
    if (step.suspect !== undefined) this.active = step.suspect;
    // het dek volgt de uitleg: de verklaring waar de stap over gaat staat vooraan
    if (step.cell && this.tutorialStep < this.puzzle.clues.length) this.deckIdx = this.tutorialStep;
    this.after(true);
  },

  skipTutorial() {
    if (typeof Meting !== 'undefined') Meting.send('tut_skip', '', this.tutorialStep + 1);
    this.isTutorial = false;
    this.stopTimer();
    document.getElementById('board-coach').hidden = true;
    document.getElementById('btn-board-hint').disabled = false;
    App.storageSet('crimson-board-tutorial-done', '1');
  },

  buzz(ms) {
    try {
      const H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (H && H.impact) return H.impact({ style: ms > 20 ? 'MEDIUM' : 'LIGHT' }).catch(() => {});
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (e) { /* niet ondersteund */ }
  },

  // ── Starten ───────────────────────────────────────────────
  start(difficultyId, seed, isDaily = false, themeId, campaignCase = null, opts = {}) {
    const theme = Themes.get(themeId);
    let puzzle = null;
    const base = seed || (Date.now() % 1000000);
    for (let i = 0; i < 12 && !puzzle; i++) puzzle = FloorPlan.generate(base + i * 7919, difficultyId, theme);
    if (!puzzle) return false;
    if (typeof Meting !== 'undefined' && !opts.tutorial) Meting.send('start', isDaily ? 'daily' : campaignCase ? 'campaign' : opts.missed ? 'missed' : 'free', (this.loadStats().solved || 0));

    Object.assign(this, {
      puzzle, theme, difficulty: difficultyId, seed: base, isDaily,
      placements: new Array(puzzle.suspects.length).fill(null),
      marks: new Map(), crosses: new Map(), clueDone: new Set(), history: [], hintRefs: null, lastCell: null,
      active: 0, mode: 'place', hintsUsed: 0, attempts: 0, solved: false, elapsed: 0, isTutorial: false, tutorialStep: 0, campaignCase,
      focusClue: null, newRank: null, okCount: 0, isWeekly: !!opts.weekly, weekly: opts.weekly || null, score: null, medalsWon: [],
      missedDay: !isDaily && opts.missed ? opts.missed : null, afloop: null,
      dailyDoneBefore: App.storageGet('crimson-board-daily-done') === new Date().toDateString(),
      freeHint: false, stuckOffered: false, lastActionAt: Date.now(), hintEarned: false
    });
    document.getElementById('btn-board-hint').classList.remove('pulse');
    this.prepareAfloop();   // "Zo zat het" van een vorige zaak weg; deze verschijnt pas na het oplossen
    this.elapsedBase = 0;
    const resumed = this.restoreResume();
    // één "Nieuw!"-uitleg per zaak, voor de eerste soort verklaring die de speler nog niet kent
    this.newIntro = typeof Mentor !== 'undefined' ? Mentor.introFor(puzzle.clues.map(c => c.kind), this.introsSeen()) : null;
    // meester (1.6): de eerste keer ook de kaart over lege rijen en kolommen
    if (!this.newIntro && difficultyId === 'meester' && !this.introsSeen().includes(this.EMPTY_LINES_ID)) this.newIntro = this.emptyLinesCard();
    this.endAccuse();
    this.deckIdx = 0;
    document.getElementById('board-coach').hidden = true;
    document.getElementById('btn-board-hint').disabled = false;

    const diff = DIFFICULTY[difficultyId] || DIFFICULTY.gemiddeld;
    document.getElementById('board-diff-tag').textContent = campaignCase
      ? (campaignCase.chapter === Campaign.ARCHIVE ? `📁 ${campaignCase.title}` : `📖 ${campaignCase.idx + 1}. ${campaignCase.title}`)
      : this.isWeekly ? BD_T`🗓️ Week ${this.weekly.week}`
      : this.missedDay ? `📅 ${this.missedDayLabel()} · ${BD_T('Gemist')}` : (isDaily ? '📅 ' : '') + diff.label;
    const L = (typeof I18n !== 'undefined' ? I18n : { joinSentences: (...p) => p.filter(Boolean).join(' '), asSentence: t => (t ? t + '.' : '') });
    const lead = campaignCase ? campaignCase.story : this.isWeekly ? L.asSentence(this.weekly.title) : '';
    document.getElementById('board-casetext').textContent = `${theme.icon} ${L.joinSentences(lead, puzzle.caseText)}`;
    const grid = document.getElementById('board-grid');
    grid.classList.remove('solved');
    grid.dataset.floor = theme.floor || 'checker';

    const tip = document.getElementById('board-tip');
    tip.hidden = !!App.storageGet('crimson-board-tip-seen');

    this.resetZoom();
    this.renderBoard();
    this.renderSuspects();
    this.renderClues();
    this.renderCells();
    this.updateTools();
    this.fitBoard();
    this.startTimer();
    // campagnezaak: eerst de briefing van Van Dam, de uitleg volgt na "Aan de slag"
    this.renderIntro();
    if (!campaignCase) this.showIntro();
    if (resumed) App.showToast('⏯️', BD_T('Je gaat verder waar je was.'));
    return true;
  },

  // ── Verder waar je was (1.3) ──────────────────────────────
  // Eén onafgemaakte zaak blijft bewaard (campagne, dagelijkse zaak, zaak van de week): plaatsingen, stipjes,
  // afgevinkte verklaringen, tijd, hints en pogingen. Open je dezelfde zaak opnieuw, dan ga je daar verder.
  RESUME_KEY: 'crimson-resume',
  resumeId() {
    if (this.isTutorial) return null;
    if (this.campaignCase) return `c:${this.campaignCase.chapter}:${this.campaignCase.idx}`;
    if (this.isWeekly && this.weekly) return `w:${this.weekly.key}:${this.weekly.theme}`;
    if (this.isDaily) return `d:${new Date().toDateString()}`;
    if (this.missedDay) return `m:${this.missedDay.key}`;
    return null;
  },
  saveResume() {
    const id = this.resumeId();
    if (!id || this.solved) return;
    const marks = [...this.marks].map(([k, s]) => [k, [...s]]);
    const crosses = [...this.crosses].map(([k, s]) => [k, [...s]]);
    App.storageSet(this.RESUME_KEY, JSON.stringify({ id, seed: this.seed, placements: this.placements, marks, crosses,
      done: [...this.clueDone], elapsed: this.elapsed || 0, hints: this.hintsUsed, attempts: this.attempts }));
  },
  restoreResume() {
    const id = this.resumeId();
    if (!id) return false;
    let s = null;
    try { s = JSON.parse(App.storageGet(this.RESUME_KEY) || 'null'); } catch (e) { s = null; }
    if (!s || s.id !== id || s.seed !== this.seed || !Array.isArray(s.placements) || s.placements.length !== this.placements.length) return false;
    const n = this.puzzle.cols, m = this.puzzle.rows;
    this.placements = s.placements.map(c => (c && Number.isInteger(c.x) && c.x >= 0 && c.x < n && c.y >= 0 && c.y < m ? { x: c.x, y: c.y } : null));
    const sets = list => new Map((list || []).filter(e => Array.isArray(e) && Array.isArray(e[1])).map(([k, v]) => [k, new Set(v)]));
    this.marks = sets(s.marks);
    this.crosses = sets(s.crosses);
    this.clueDone = new Set((s.done || []).filter(i => Number.isInteger(i)));
    this.hintsUsed = s.hints || 0;
    this.attempts = s.attempts || 0;
    this.elapsedBase = Math.max(0, s.elapsed || 0);
    return this.placements.some(Boolean) || this.marks.size > 0 || this.crosses.size > 0;
  },
  clearResume() { App.storageSet(this.RESUME_KEY, ''); },
  // "di 27 okt" in de taal van de speler
  missedDayLabel() {
    const m = this.missedDay;
    if (!m) return '';
    try { return Progress.dateOf(m.key).toLocaleDateString(typeof I18n !== 'undefined' ? I18n.locale() : 'nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }); }
    catch (e) { return m.key; }
  },

  startTimer() {
    clearInterval(this.timerId);
    this.startTime = Date.now() - (this.elapsedBase || 0) * 1000;
    const el = document.getElementById('board-timer');
    const tick = () => {
      this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      el.textContent = this.formatTime(this.elapsed);
      this.checkStuck();
    };
    tick();
    this.timerId = setInterval(tick, 1000);
    if (App.liveCase) App.liveCase('clock');   // Live Activity (1.6): start, or follow the restarted clock
  },
  stopTimer() { clearInterval(this.timerId); this.timerId = null; },
  formatTime(s) { return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; },

  // ── Bord tekenen ──────────────────────────────────────────
  renderBoard() {
    const p = this.puzzle;
    const grid = document.getElementById('board-grid');
    grid.style.setProperty('--cols', p.cols);
    grid.style.setProperty('--rows', p.rows);
    const roomAt = (x, y) => FloorPlan.roomOf(p.rooms, x, y);

    let html = '';
    for (let y = 0; y < p.rows; y++) for (let x = 0; x < p.cols; x++) {
      const room = roomAt(x, y);
      const edges = [];
      if (!roomAt(x, y - 1) || roomAt(x, y - 1).id !== room.id) edges.push('wt');
      if (!roomAt(x, y + 1) || roomAt(x, y + 1).id !== room.id) edges.push('wb');
      if (!roomAt(x - 1, y) || roomAt(x - 1, y).id !== room.id) edges.push('wl');
      if (!roomAt(x + 1, y) || roomAt(x + 1, y).id !== room.id) edges.push('wr');
      html += `<button type="button" class="bcell${(x + y) % 2 === 0 ? ' dark' : ''} ${edges.join(' ')}" ` +
              `data-x="${x}" data-y="${y}" style="--room:${room.color}" ` +
              `aria-label="${BD_T`Rij ${y + 1}, kolom ${x + 1}, ${room.name}`}"></button>`;
    }
    // kamernaam op de onderste rij van de kamer (werkt ook bij L-vormen)
    p.rooms.forEach(room => {
      const maxY = Math.max(...room.list.map(c => c.y));
      const xs = room.list.filter(c => c.y === maxY).map(c => c.x);
      const left = ((Math.min(...xs) + Math.max(...xs) + 1) / 2 / p.cols) * 100;
      const top = ((maxY + 1) / p.rows) * 100;
      const span = ((Math.max(...xs) - Math.min(...xs) + 1) / p.cols) * 100;
      html += `<span class="room-label" data-w="${span}" data-home="${maxY}:${Math.min(...xs)}:${Math.max(...xs)}" data-runs="${this.labelRuns(room).map(r => r.join(':')).join(';')}" style="left:${left}%;top:${top}%">${room.name}</span>`;
    });
    grid.innerHTML = html;
    this.fitLabels(grid);
    grid.querySelectorAll('.bcell').forEach(c => c.addEventListener('click', () => { if (!this.dragDone) this.onCell(+c.dataset.x, +c.dataset.y); }));
  },

  // Plekken voor een kamernaam (1.6): stukken rij zonder meubel of slachtoffer, van de onderste rij naar boven,
  // per rij het langste stuk eerst, als [y, x0, x1]. fitLabels kiest het eerste stuk waar de naam op past, zodat
  // een kamernaam geen meubel bedekt (vooral als je inzoomt: dan zijn de vakjes groot en past hij bijna altijd).
  labelRuns(room) {
    const p = this.puzzle, key = FloorPlan.key, mine = new Set(room.list.map(c => key(c.x, c.y)));
    const free = (x, y) => mine.has(key(x, y)) && !p.furniture.has(key(x, y)) && !(p.victim.x === x && p.victim.y === y);
    const runs = [];
    [...new Set(room.list.map(c => c.y))].sort((a, b) => b - a).forEach(y => {
      const row = [];
      for (let x = 0, x0 = null; x <= p.cols; x++) {
        const ok = x < p.cols && free(x, y);
        if (ok && x0 === null) x0 = x;
        if (!ok && x0 !== null) { row.push([y, x0, x - 1]); x0 = null; }
      }
      runs.push(...row.sort((a, b) => (b[2] - b[1]) - (a[2] - a[1])));
    });
    return runs;
  },

  // ── Verdachtenkiezer ──────────────────────────────────────
  renderSuspects() {
    const wrap = document.getElementById('board-suspects');
    const p = this.puzzle;
    wrap.innerHTML = p.suspects.map((s, i) => {
      const c = this.placements[i];
      const room = c ? FloorPlan.roomOf(p.rooms, c.x, c.y) : null;
      return `<button type="button" class="sus-chip${i === this.active ? ' active' : ''}${c ? ' placed' : ''}" data-s="${i}" style="--sc:${s.color}">
         <span class="sus-ava">${Avatars.suspect(s, i)}</span>
         <span class="sus-name">${s.label}${room ? `<small>✓ ${room.name}</small>` : ''}</span>
       </button>`;
    }).join('');
    wrap.querySelectorAll('.sus-chip').forEach(b => b.addEventListener('click', () => {
      if (this.dragDone) return;
      this.active = +b.dataset.s;
      if (this.mode === 'erase') this.setMode('place');
      this.renderSuspects();
    }));
  },

  // ── Verklaringen: elke aanwijzing als getuigenis in de ik-vorm ──
  // Portret + naam van wie spreekt (twee portretten bij een verklaring over
  // twee personen; het rapport van de inspecteur bij een lege kamer), de
  // uitspraak in een tekstballon, en live of hij klopt (groen), geschonden
  // wordt (rood) of nog open staat. Tikken laat kamer/meubel oplichten.
  clueAvatars(clue) {
    const s = this.puzzle.suspects, st = FloorPlan.statement(clue, this.puzzle);
    const ava = i => `<span class="bclue-ava">${Avatars.suspect(s[i], i)}</span>`;
    if (!st.who.length) return `<span class="bclue-ava bclue-mentor"><img src="${Mentor.img}" alt=""></span>`;
    if (st.who.length === 2) return `<span class="bclue-pair">${ava(st.who[0])}${ava(st.who[1])}</span>`;
    return ava(st.who[0]);
  },
  clueState(clue) {
    const h = FloorPlan.holds(clue, this.placements, this.puzzle);
    return h === true ? 'ok' : h === false ? 'bad' : '';
  },
  clueHtml(clue, i) {
    let t = FloorPlan.statement(clue, this.puzzle).text || this.puzzle.clueTexts[i];
    if (clue.furniture) {
      // het icoontje komt achter het meubel zoals de zin het noemt ("naast een plant", "рядом с растением"),
      // nooit midden in een verbogen woord; vindt het geen hele woordvorm, dan achter de zin
      const icon = `<span class="bclue-furn">${Avatars.furniture(clue.furniture)}</span>`;
      const f = Grammar.furn(this.puzzle, clue.furniture);
      const forms = [...new Set(Object.values(f).filter(v => typeof v === 'string' && v))].sort((a, b) => b.length - a.length);
      const endsWord = c => !c || !/[\p{L}\p{M}]/u.test(c) || /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(c);
      let at = -1, len = 0;
      for (const form of forms) {
        for (let i = t.indexOf(form); i !== -1 && at === -1; i = t.indexOf(form, i + 1)) if (endsWord(t[i + form.length])) { at = i; len = form.length; }
        if (at !== -1) break;
      }
      if (at === -1) return `${t} ${icon}`;
      // het laatste woord van de meubelnaam, het icoontje en leestekens erachter breken niet los van elkaar
      const head = t.slice(0, at + len), word = t.slice(at, at + len).match(/\S+$/)[0], tail = t.slice(at + len).match(/^[^\s\p{L}\p{N}]*/u)[0];
      t = head.slice(0, head.length - word.length) + `<span class="bclue-tail">${word}${icon}${tail}</span>` + t.slice(at + len + tail.length);
    }
    return t;
  },
  introsSeen() { try { return JSON.parse(App.storageGet('crimson-newclue-seen') || '[]'); } catch (e) { return []; } },
  // "Nieuw in dit deel": één uitleg per zaak in een eigen venster, zodat de
  // verklaringen zelf alle ruimte houden. De klok staat stil zolang je leest.
  renderIntro() {
    const host = document.getElementById('newclue-host');
    if (!host) return;
    const t = this.newIntro, p = this.puzzle;
    // het voorbeeld komt uit deze zaak zelf: de eerste verklaring van deze soort
    let example = '';
    if (t && p) {
      const ci = p.clues.findIndex(c => t.kinds.includes(c.kind));
      const st = ci >= 0 ? FloorPlan.statement(p.clues[ci], p) : null;
      if (st && st.text) {
        const who = st.who.length ? Grammar.who(p.suspects[st.who[0]]) : Mentor.name;
        example = `<p class="newclue-ex">${BD_T`In deze zaak zegt <b>${who}</b>: “${st.text}”`}</p>`;
      }
    }
    host.innerHTML = t && !this.isTutorial
      ? `<div class="modal-handle"></div><div class="newclue" id="newclue"><span class="ribbon ribbon-gold">${BD_T('Nieuw in dit deel')}</span>
        <div class="newclue-body"><div><h3>${t.title}</h3><p>${t.text}</p></div><span class="newclue-pic">${t.svg}</span></div>
        ${example}
        <button type="button" class="btn btn-dark btn-block" id="btn-newclue-ok">${BD_T('Begrepen')}</button></div>`
      : '';
    const ok = document.getElementById('btn-newclue-ok');
    if (ok) ok.addEventListener('click', () => this.dismissIntro());
  },
  showIntro() {
    if (!this.newIntro || this.isTutorial || !document.getElementById('newclue')) return;
    this.stopTimer();
    App.showModal('newclue-modal');
  },
  dismissIntro() {
    if (this.newIntro) {
      const seen = this.introsSeen();
      if (!seen.includes(this.newIntro.id)) seen.push(this.newIntro.id);
      App.storageSet('crimson-newclue-seen', JSON.stringify(seen));
    }
    this.newIntro = null;
    App.hideModal('newclue-modal');
    this.renderIntro();
    if (!this.solved && this.puzzle) this.startTimer();
  },
  renderClues() {
    const list = document.getElementById('board-clues');
    const refs = this.hintRefs ? new Set(this.hintRefs.clues) : new Set();
    const p = this.puzzle;
    let html = p.clues.map((clue, i) => {
      const st = FloorPlan.statement(clue, p);
      const state = this.solved ? 'ok' : this.clueState(clue);
      const done = this.clueDone.has(i);
      const color = st.who.length ? p.suspects[st.who[0]].color : 'var(--gold)';
      const name = st.who.length ? p.suspects[st.who[0]].label : Mentor.name;
      const label = state === 'ok' ? `<span class="bclue-state ok">${BD_T('✓ Klopt')}</span>` : state === 'bad' ? `<span class="bclue-state bad">${BD_T('✗ Klopt niet')}</span>` : '';
      return `<div class="bclue${done ? ' done' : ''}${refs.has(i) ? ' hint-ref' : ''}${state ? ' ' + state : ''}${this.focusClue === i ? ' active' : ''}" data-clue="${i}" style="--sc:${color}">
        <span class="bclue-num">${i + 1}</span>
        ${this.clueAvatars(clue)}
        <div class="bclue-body"><div class="bclue-head"><span class="bclue-name">${name}</span>${label}</div><p class="bclue-text">${this.clueHtml(clue, i)}</p></div>
        <button type="button" class="bclue-check" data-clue="${i}" aria-label="Verklaring afvinken">${done ? '✓' : ''}</button>
      </div>`;
    }).join('');
    list.innerHTML = html;
    list.querySelectorAll('.bclue').forEach(c => c.addEventListener('click', () => {
      const i = +c.dataset.clue;
      App.hideModal('clue-modal');
      this.setDeck(i);
    }));
    list.querySelectorAll('.bclue-check').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      this.toggleDone(+b.dataset.clue);
    }));
    this.renderDeck();
  },

  // ── Verklaringendek ───────────────────────────────────────
  // Eén verklaring tegelijk, groot en leesbaar. Swipen, pijltjes of de stippen
  // gaan naar de volgende; "Alle" opent de hele lijst in een venster.
  toggleDone(i) {
    if (this.clueDone.has(i)) this.clueDone.delete(i); else { this.clueDone.add(i); this.questBump('ticked'); }
    this.renderClues();
    this.saveResume();
  },
  // opdracht van vandaag bijwerken (stil; de melding komt op het resultaatscherm of het menu)
  questBump(key, n = 1) {
    if (this.isTutorial || typeof Progress === 'undefined' || !Progress.questBump) return;
    const done = Progress.questBump(key, n);
    if (done.length && typeof App !== 'undefined' && App.questToast) App.questToast(done);
  },
  clueCard(i, cls) {
    const p = this.puzzle, clue = p.clues[i];
    const st = FloorPlan.statement(clue, p);
    const state = this.solved ? 'ok' : this.clueState(clue);
    const done = this.clueDone.has(i);
    const color = st.who.length ? p.suspects[st.who[0]].color : 'var(--gold)';
    const name = st.who.length ? p.suspects[st.who[0]].label : Mentor.name;
    const label = state === 'ok' ? `<span class="bclue-state ok">${BD_T('✓ Klopt')}</span>` : state === 'bad' ? `<span class="bclue-state bad">${BD_T('✗ Klopt niet')}</span>` : '';
    return `<div class="${cls}${done ? ' done' : ''}${state ? ' ' + state : ''}" data-clue="${i}" style="--sc:${color}">
      <span class="bclue-num">${i + 1}</span>
      ${this.clueAvatars(clue)}
      <div class="bclue-body"><div class="bclue-head"><span class="bclue-name">${name}</span>${label}</div><p class="bclue-text">${this.clueHtml(clue, i)}</p></div>
      <button type="button" class="bclue-check" data-clue="${i}" aria-label="Verklaring afvinken">${done ? '✓' : ''}</button>
    </div>`;
  },
  renderDeck() {
    const track = document.getElementById('clue-track');
    if (!track || !this.puzzle) return;
    const p = this.puzzle, n = p.clues.length;
    if (!(this.deckIdx >= 0) || this.deckIdx >= n) this.deckIdx = 0;
    const i = this.deckIdx;
    track.innerHTML = this.clueCard(i, 'dclue');
    const card = track.firstElementChild;
    card.addEventListener('click', () => this.focusOnClue(i));
    card.querySelector('.bclue-check').addEventListener('click', e => { e.stopPropagation(); this.toggleDone(i); });
    const dots = document.getElementById('clue-dots');
    dots.innerHTML = p.clues.map((c, j) => {
      const st = this.solved ? 'ok' : this.clueState(c);
      return `<button type="button" class="cdot${j === i ? ' on' : ''}${st ? ' ' + st : ''}${this.clueDone.has(j) ? ' done' : ''}" data-clue="${j}" aria-label="Verklaring ${j + 1}"></button>`;
    }).join('');
    dots.querySelectorAll('.cdot').forEach(d => d.addEventListener('click', () => this.setDeck(+d.dataset.clue)));
    document.getElementById('btn-clue-prev').disabled = n < 2;
    document.getElementById('btn-clue-next').disabled = n < 2;
    document.getElementById('btn-clue-all').textContent = BD_T`Alle ${n}`;
  },
  setDeck(i) {
    const n = this.puzzle ? this.puzzle.clues.length : 0;
    if (!n) return;
    this.clearFocus();
    this.deckIdx = ((i % n) + n) % n;
    this.renderDeck();
    this.focusOnClue(this.deckIdx);
  },
  // volgende/vorige, maar sla verklaringen over die je al hebt afgevinkt
  stepDeck(dir) {
    const n = this.puzzle ? this.puzzle.clues.length : 0;
    if (!n) return;
    let i = this.deckIdx;
    for (let k = 0; k < n; k++) {
      i = ((i + dir) % n + n) % n;
      if (!this.clueDone.has(i) || this.clueDone.size >= n) break;
    }
    this.setDeck(i);
  },
  openAllClues() {
    this.renderClues();
    App.showModal('clue-modal');
  },

  // ── Aanwijzing aantikken: laat zien waar het over gaat ────
  clearFocus() {
    clearTimeout(this.focusTimer);
    this.focusClue = null;
    document.querySelectorAll('#board-grid .bcell.lit, #board-grid .bcell.lit-furn, #board-grid .bcell.lit-sus').forEach(el => el.classList.remove('lit', 'lit-furn', 'lit-sus'));
    document.querySelectorAll('.bclue.active, .sus-chip.lit').forEach(el => el.classList.remove('active', 'lit'));
  },
  focusOnClue(i) {
    const p = this.puzzle, clue = p.clues[i];
    const again = this.focusClue === i;
    this.clearFocus();
    if (again || !clue) return;
    this.focusClue = i;
    const card = document.querySelector(`.bclue[data-clue="${i}"]`);
    if (card) card.classList.add('active');

    const lit = new Set(), litFurn = new Set();
    const room = clue.room !== undefined ? p.rooms.find(r => r.id === clue.room) : null;
    const roomsToScan = room ? [room] : (clue.pos ? p.rooms : []);
    roomsToScan.forEach(rm => rm.list.forEach(c => {
      if (clue.pos && FloorPlan.posOf(rm, c) !== clue.pos) return;
      lit.add(FloorPlan.key(c.x, c.y));
    }));
    if (clue.furniture) p.furniture.forEach((type, k) => { if (type === clue.furniture) litFurn.add(k); });
    document.querySelectorAll('#board-grid .bcell').forEach(el => {
      const k = FloorPlan.key(+el.dataset.x, +el.dataset.y);
      if (lit.has(k)) el.classList.add('lit');
      if (litFurn.has(k)) el.classList.add('lit-furn');
    });
    [clue.s, clue.a, clue.b].filter(v => v !== undefined).forEach(s => {
      const chip = document.querySelector(`.sus-chip[data-s="${s}"]`);
      if (chip) chip.classList.add('lit');
      const c = this.placements[s];   // staat hij al op het bord? dan licht zijn vakje op
      const cell = c && document.querySelector(`#board-grid .bcell[data-x="${c.x}"][data-y="${c.y}"]`);
      if (cell) cell.classList.add('lit-sus');
    });
    // ingezoomd: de kamer van de verklaring in beeld schuiven
    if (this.zoom > 1 && room) this.centerOn(room.list);
    this.buzz(8);
    this.focusTimer = setTimeout(() => this.clearFocus(), 2600);
  },

  // ── Tik op een meubel of het slachtoffer: wat is dit? ─────
  peek(x, y) {
    const p = this.puzzle, k = FloorPlan.key(x, y);
    const el = document.querySelector(`#board-grid .bcell[data-x="${x}"][data-y="${y}"]`);
    if (!el) return;
    const furn = p.furniture.get(k);
    const name = furn ? (p.furnitureNl[furn] || furn) : (p.theme.victimName || 'het slachtoffer');
    document.querySelectorAll('.bpeek').forEach(b => b.remove());
    const tag = document.createElement('span');
    tag.className = 'bpeek' + (y === 0 ? ' below' : '') + (x === 0 ? ' l' : x === p.cols - 1 ? ' r' : '');
    tag.textContent = name;
    el.appendChild(tag);
    this.buzz(8);
    clearTimeout(this.peekTimer);
    this.peekTimer = setTimeout(() => tag.remove(), 1600);
  },

  // ── Celinhoud ─────────────────────────────────────────────
  renderCells() {
    const p = this.puzzle;
    const byCell = new Map();
    this.placements.forEach((c, i) => { if (c) byCell.set(FloorPlan.key(c.x, c.y), i); });
    const hinted = new Set(this.hintRefs ? this.hintRefs.cells.map(c => FloorPlan.key(c.x, c.y)) : []);
    // spelregel live: twee verdachten in de kamer van het slachtoffer = conflict
    const inVictimRoom = this.placements.filter(c => c && FloorPlan.roomOf(p.rooms, c.x, c.y).id === p.victim.roomId);
    const conflict = new Set(inVictimRoom.length > 1 ? inVictimRoom.map(c => FloorPlan.key(c.x, c.y)) : []);
    const auto = this.autoCrosses();

    document.querySelectorAll('#board-grid .bcell').forEach(el => {
      const x = +el.dataset.x, y = +el.dataset.y, k = FloorPlan.key(x, y);
      const furn = p.furniture.get(k), who = byCell.get(k), marked = this.marks.get(k);
      const isVictim = p.victim.x === x && p.victim.y === y;
      let inner = '';
      if (furn) inner += `<span class="bfurn">${Avatars.furniture(furn)}</span>`;
      if (isVictim) inner += `<span class="bvictim">${Avatars.victim()}</span>`;
      if (who !== undefined) inner += `<span class="bsus">${Avatars.suspect(p.suspects[who], who)}</span><span class="bname" style="--sc:${p.suspects[who].color}">${Themes.shortName(p.suspects[who].label)}</span>`;
      if (marked && marked.size) inner += '<span class="bmarks">' + [...marked].map(i => `<i style="background:${p.suspects[i].color}"></i>`).join('') + '</span>';
      // kruisjes: eigen kruisjes vol, automatisch weggestreept (rij en kolom van wie al staat) licht
      const own = this.crosses.get(k), struck = auto.get(k);
      if (who === undefined && !furn && !isVictim && ((own && own.size) || (struck && struck.size))) {
        const ids = [...new Set([...(own || []), ...(struck || [])])].sort((a, b) => a - b);
        inner += '<span class="bx">' + ids.map(i => `<i class="${own && own.has(i) ? 'own' : 'auto'}" style="--c:${p.suspects[i].color}"></i>`).join('') + '</span>';
      }
      el.innerHTML = inner;
      el.classList.toggle('has-sus', who !== undefined);
      el.classList.toggle('occupied', !!furn || isVictim);
      el.classList.toggle('hinted', hinted.has(k));
      el.classList.toggle('conflict', conflict.has(k));
      el.classList.toggle('murder-room', !!this.accusing && FloorPlan.roomOf(p.rooms, x, y).id === p.victim.roomId);
    });
    this.fitNames();
  },

  // ── Tik op een cel ────────────────────────────────────────
  onCell(x, y) {
    if (this.solved) return;
    if (this.isTutorial) {
      const step = this.TUTORIAL_STEPS[this.tutorialStep];
      if (!step || !step.cell || this.mode !== 'place' || x !== step.cell.x || y !== step.cell.y) return this.flash(x, y);
    }
    const p = this.puzzle, k = FloorPlan.key(x, y);
    const occupant = this.placements.findIndex(c => c && c.x === x && c.y === y);
    const snap = () => this.snap();
    this.lastCell = { x, y };

    if (this.mode === 'erase') {
      if (occupant === -1 && !this.marks.has(k) && !this.crosses.has(k)) return;
      this.history.push(snap());
      if (occupant !== -1) this.placements[occupant] = null;
      this.marks.delete(k);
      this.crosses.delete(k);
      return this.after();
    }
    if (p.furniture.has(k) || (p.victim.x === x && p.victim.y === y)) return this.peek(x, y);

    // potlood (stipje: kan hier staan) en kruisje (staat hier niet) sluiten elkaar per verdachte uit
    if (this.mode === 'mark' || this.mode === 'cross') {
      if (this.mode === 'cross' && occupant !== -1) return this.flash(x, y);   // hier staat al iemand
      this.history.push(snap());
      const [mine, other] = this.mode === 'mark' ? [this.marks, this.crosses] : [this.crosses, this.marks];
      const set = mine.get(k) || new Set();
      if (set.has(this.active)) set.delete(this.active);
      else {
        set.add(this.active);
        const o = other.get(k);
        if (o) { o.delete(this.active); if (!o.size) other.delete(k); }
      }
      set.size ? mine.set(k, set) : mine.delete(k);
      Sound.play('mark');
      return this.after();
    }

    if (occupant === this.active) {                     // nog eens tikken = weghalen
      this.history.push(snap());
      this.placements[this.active] = null;
      return this.after();
    }
    if (occupant !== -1) return this.flash(x, y);       // iemand anders staat er al

    this.history.push(snap());
    this.placements[this.active] = { x, y };
    this.buzz(12);
    Sound.play('place');
    this.sparks(x, y);
    this.questBump('placed');
    const next = this.placements.findIndex(c => !c);
    if (next !== -1) this.active = next;                // door naar de volgende
    this.after();
    if (this.isTutorial) { this.tutorialStep++; this.showTutorialStep(); }
  },

  // kleine vonkjes bij het neerzetten van een verdachte
  sparks(x, y) {
    const el = document.querySelector(`#board-grid .bcell[data-x="${x}"][data-y="${y}"]`);
    if (!el) return;
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      const a = (i / 7) * Math.PI * 2 + Math.random() * 0.5, r = 16 + Math.random() * 14;
      s.style.setProperty('--dx', `${Math.cos(a) * r}px`);
      s.style.setProperty('--dy', `${Math.sin(a) * r}px`);
      el.appendChild(s);
      setTimeout(() => s.remove(), 600);
    }
  },
  cloneMarks(src = this.marks) { const m = new Map(); src.forEach((v, k) => m.set(k, new Set(v))); return m; },
  // één stap voor Terug: plaatsingen, stipjes en kruisjes
  snap() { return { placements: this.placements.slice(), marks: this.cloneMarks(), crosses: this.cloneMarks(this.crosses) }; },
  // Rij en kolom automatisch wegstrepen (1.6, instelling, standaard aan): wie op het bord staat, krijgt een licht
  // kruisje op de andere vrije vakjes van zijn rij en kolom. Alleen weergave: het volgt de plaatsingen (dus ook
  // Terug), wordt niet bewaard en is geen spelregel.
  AUTOSTRIKE_KEY: 'crimson-autostrike',
  autoStrikeOn() { return App.storageGet(this.AUTOSTRIKE_KEY) !== '0'; },
  autoCrosses() {
    const p = this.puzzle, out = new Map();
    if (!p || this.isTutorial || !this.autoStrikeOn()) return out;
    const taken = new Set(this.placements.filter(Boolean).map(c => FloorPlan.key(c.x, c.y)));
    const add = (x, y, i) => {
      const k = FloorPlan.key(x, y);
      if (taken.has(k) || p.furniture.has(k) || (p.victim.x === x && p.victim.y === y)) return;
      if (!out.has(k)) out.set(k, new Set());
      out.get(k).add(i);
    };
    this.placements.forEach((c, i) => {
      if (!c) return;
      for (let x = 0; x < p.cols; x++) add(x, c.y, i);
      for (let y = 0; y < p.rows; y++) add(c.x, y, i);
    });
    return out;
  },

  // 1.5: in the first three cases of the Manor, a minute without any move turns the next hint into a free one, outside
  // the day allowance (target: 90% of new players solve case 1; 40% used to stop before it)
  STUCK_SECONDS: 60,
  stuckEligible() {
    const c = this.campaignCase;
    if (!c || this.solved || this.isTutorial || this.stuckOffered || typeof Campaign === 'undefined') return false;
    const first = Campaign.list()[0];
    return !!first && c.chapter === first.key && c.idx < 3;
  },
  checkStuck() {
    if (!this.stuckEligible() || Date.now() - (this.lastActionAt || Date.now()) < this.STUCK_SECONDS * 1000) return;
    this.stuckOffered = true; this.freeHint = true;
    document.getElementById('btn-board-hint').classList.add('pulse');
    // 1.6: Van Dam points at the statement the hint would use; the rest dims until the next move
    const h = FloorPlan.hint(this.puzzle, this.placements), ci = h && h.clues && h.clues.length ? h.clues[0] : -1;
    if (ci >= 0) { this.deckIdx = ci; this.renderDeck(); }
    const card = ci >= 0 ? document.querySelector('#clue-track > *') : null;
    const shown = card && typeof Motion !== 'undefined'
      && Motion.stuck(document.getElementById('screen-board'), card, document.getElementById('clue-deck'), Mentor.img, BD_T('Kijk eens goed naar deze verklaring. Je volgende hint is gratis.'));
    if (!shown) App.showToast('💡', BD_T('Vastgelopen? Je volgende hint is gratis.'));
    if (typeof Meting !== 'undefined') Meting.send('stuck_hint', '', this.campaignCase.idx + 1);
  },
  // 1.5 metric: a case left without solving it (campaign: case number in its part; tutorial: the step)
  countQuit() {
    if (!this.puzzle || this.solved || typeof Meting === 'undefined') return;
    if (this.isTutorial) return Meting.send('quit', 'tutorial', this.tutorialStep + 1);
    Meting.send('quit', this.isDaily ? 'daily' : this.campaignCase ? 'campaign' : 'free', this.campaignCase ? this.campaignCase.idx + 1 : 0);
  },

  after(keepHint = false) {
    this.lastActionAt = Date.now();
    if (typeof Motion !== 'undefined') Motion.stuckClear();
    if (!keepHint) this.hintRefs = null;
    // een aanwijzing die net groen wordt, mag je horen
    const ok = this.puzzle.clues.filter(c => FloorPlan.holds(c, this.placements, this.puzzle) === true).length;
    if (ok > (this.okCount || 0) && !this.solved) Sound.play('clue');
    this.okCount = ok;
    this.renderCells();
    this.renderSuspects();
    this.renderClues();
    this.updateTools();
    this.saveResume();
    if (App.liveCase) App.liveCase('progress');
  },

  flash(x, y) {
    const el = document.querySelector(`#board-grid .bcell[data-x="${x}"][data-y="${y}"]`);
    if (!el) return;
    el.classList.add('shake');
    this.buzz(30);
    Sound.play('error');
    setTimeout(() => el.classList.remove('shake'), 300);
  },

  undo() {
    const prev = this.history.pop();
    if (!prev) return;
    this.placements = prev.placements;
    this.marks = prev.marks;
    this.crosses = prev.crosses || new Map();
    this.after();
  },

  // ── Lerende hint: legt uit, plaatst nooit ─────────────────
  hint() {
    if (this.solved) return;
    if (this.isTutorial) return this.showTutorialStep();
    // drie gratis per dag; daarna een hintpakket of de Crimson Pass
    const free = this.freeHint;
    if (!free && typeof Store !== 'undefined' && !Store.canHint()) return App.openStore('hint');
    const h = FloorPlan.hint(this.puzzle, this.placements);
    this.hintsUsed++;
    if (free) { this.freeHint = false; document.getElementById('btn-board-hint').classList.remove('pulse'); }
    else if (typeof Store !== 'undefined') Store.useHint();
    if (typeof Meting !== 'undefined') Meting.send('hint');
    this.hintRefs = { cells: h.cells || [], clues: h.clues || [] };
    if (this.zoom > 1 && this.hintRefs.cells.length) this.centerOn(this.hintRefs.cells);   // ingezoomd: de vakjes van de hint in beeld
    if (h.suspect !== undefined && h.suspect !== -1) this.active = h.suspect;
    this.after(true);
    const p = this.puzzle, $ = id => document.getElementById(id);
    $('hint-text').textContent = h.text;
    const left = typeof Store !== 'undefined' ? Store.hintsLeft() : Infinity;
    $('hint-sub').textContent = BD_T`Hint ${this.hintsUsed} · deze zaak levert nu maximaal ★★ op` + (left === Infinity ? '' : BD_T` · nog ${left} {0|one:hint|other:hints}`);
    // 1. kijk naar: de verklaring(en) waar het om gaat, of de spelregel
    const clues = (h.clues || []).slice(0, 1);   // één kaart: zo blijft "Doe dit" in beeld
    $('hint-clues').innerHTML = clues.length
      ? clues.map(i => this.clueCard(i, 'dclue')).join('')
      : `<div class="hint-rule">${Grammar.text('board/rule', p)}</div>`;
    $('hint-clues').querySelectorAll('.bclue-check').forEach(b => b.remove());
    // 2. dat betekent: uitleg in gewone taal met de namen van deze zaak
    const meaning = clues.length ? clues.map(i => Mentor.explain(p.clues[i], p)).filter(Boolean).join(' ') : (h.detail || '');
    $('hint-detail-text').textContent = meaning;
    $('hint-detail').hidden = !meaning;
    // 3. doe dit
    $('hint-action').textContent = Mentor.hintAction(h, p, this.placements);
    // het dek springt naar die verklaring, zodat hij na het sluiten in beeld blijft
    if (clues.length) { this.deckIdx = clues[0]; this.renderDeck(); }
    App.showModal('hint-modal');
  },

  updateTools() {
    const all = this.placements.every(Boolean);
    const checkBtn = document.getElementById('btn-board-check');
    checkBtn.disabled = !all || this.solved;
    // alles staat en elke aanwijzing klopt: de knop trekt de aandacht
    checkBtn.classList.toggle('ready', all && !this.solved && this.puzzle.clues.every(c => FloorPlan.holds(c, this.placements, this.puzzle) === true));
    document.getElementById('btn-board-undo').disabled = this.history.length === 0;
    ['place', 'mark', 'cross', 'erase'].forEach(m => { const b = document.getElementById('btn-board-' + m); if (b) b.classList.toggle('active', this.mode === m); });
    // hoeveel hints je nog hebt (∞ met de Pass)
    const badge = document.getElementById('hint-badge');
    if (badge && typeof Store !== 'undefined') {
      badge.hidden = !!this.isTutorial;
      badge.textContent = Store.hintLabel();
      badge.classList.toggle('empty', !Store.canHint());
    }
  },
  setMode(m) {
    if (this.isTutorial) m = 'place';
    if (m === 'mark' && this.mode !== 'mark' && !App.storageGet('crimson-pencil-tip-seen')) {
      App.storageSet('crimson-pencil-tip-seen', '1');
      App.showToast('✏️', BD_T('Potlood: zet een stipje op vakjes waar iemand zou kúnnen staan. Met Plaats zet je iemand echt neer, met Gum haal je het weer weg.'));
    }
    if (m === 'cross' && this.mode !== 'cross' && !App.storageGet('crimson-cross-tip-seen')) {
      App.storageSet('crimson-cross-tip-seen', '1');
      App.showToast('✖️', BD_T('Kruisje: tik een vakje waar de gekozen verdachte niet kan staan. Nog eens tikken haalt het kruisje weg.'));
    }
    this.mode = m;
    this.updateTools();
  },

  // ── Controleren → moordenaarsvraag → resultaat ────────────
  check() {
    if (this.solved) return;
    const p = this.puzzle;
    let wrong = 0;
    this.placements.forEach((c, i) => {
      if (!c) return;
      const t = p.solution[i];
      if (c.x === t.x && c.y === t.y) return;
      wrong++;
      const el = document.querySelector(`#board-grid .bcell[data-x="${c.x}"][data-y="${c.y}"]`);
      if (el) { el.classList.add('bad'); setTimeout(() => el.classList.remove('bad'), 1800); }
    });
    if (wrong > 0) {
      this.attempts++;
      const total = this.placements.length;
      App.showToast(wrong === 1 ? '🔥' : '❌', wrong === 1
        ? BD_T`Bijna! Nog één verdachte staat verkeerd. ${total - 1} van de ${total} staan al goed.`
        : BD_T`${wrong} verdachten staan verkeerd, ${total - wrong} staan goed. Gebruik een hint als je vastzit.`);
      return;
    }
    this.askMurderer();
  },

  askMurderer() {
    const p = this.puzzle;
    const q = p.rooms.find(x => x.id === p.victim.roomId);
    if (this.isTutorial) { this.tutorialStep = 3; this.showTutorialStep(); }
    document.getElementById('murder-question').textContent = this.isTutorial
      ? this.TUTORIAL_STEPS[3].text
      : Grammar.text('board/accuse', p, { room: q.id });
    const wrap = document.getElementById('murder-options');
    // onder elke naam de kamer waar hij staat: de conclusie is dan één blik
    wrap.innerHTML = p.suspects.map((s, i) => {
      const c = this.placements[i];
      const room = c ? FloorPlan.roomOf(p.rooms, c.x, c.y) : null;
      return `<button type="button" class="murder-opt accuse-opt" data-s="${i}">
         <span class="accuse-ava">${Avatars.suspect(s, i)}</span><span class="accuse-name">${s.label}</span>
         <span class="accuse-room">${room ? room.name : ''}</span>
       </button>`;
    }).join('');
    wrap.querySelectorAll('.murder-opt').forEach(b => b.addEventListener('click', () => this.answerMurderer(+b.dataset.s, b)));
    const react = document.getElementById('murder-reaction');
    react.hidden = true; react.innerHTML = '';
    // geen venster over het bord: het paneel komt onderin, de plattegrond blijft
    // zichtbaar en de kamer van het slachtoffer licht op
    this.accusing = true;
    this.resetZoom();
    document.getElementById('screen-board').classList.add('accusing');
    const panel = document.getElementById('board-accuse');
    panel.hidden = false; panel.scrollTop = 0;
    this.fitBoard();
    this.renderCells();
    Sound.play('clue');
  },
  endAccuse() {
    this.accusing = false;
    const screen = document.getElementById('screen-board'), panel = document.getElementById('board-accuse');
    if (screen) screen.classList.remove('accusing');
    if (panel) panel.hidden = true;
  },
  // "Terug naar het bord": even de verklaringen nalezen, daarna opnieuw Controleer
  cancelAccuse() {
    clearTimeout(this.finishTimer); this.finishTimer = null;
    if (typeof Motion !== 'undefined') Motion.confessEnd();
    this.endAccuse();
    this.fitBoard();
    if (this.puzzle) this.renderCells();
  },

  // De beschuldigde reageert: ontkenning bij de verkeerde, bekentenis bij de juiste.
  answerMurderer(i, btn) {
    const s = this.puzzle.suspects[i];
    const react = document.getElementById('murder-reaction');
    const bubble = (cls, text) => {
      react.hidden = false;
      react.className = `accuse-reaction ${cls}`;
      react.innerHTML = `<span class="accuse-ava-sm">${Avatars.suspect(s, i)}</span><span><b>${s.label}:</b> <span class="react-q">${I18n.quote(text)}</span></span>`;
      if (react.scrollIntoView) react.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    if (i !== this.puzzle.murderer) {
      this.attempts++;
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 300);
      bubble('wrong', Mentor.reaction(false, this.attempts + i));
      Sound.play('error');
      if (typeof Motion !== 'undefined') Motion.haptic('error'); else this.buzz(30);
      return;
    }
    document.querySelectorAll('.murder-opt').forEach(b => { b.disabled = true; });
    btn.classList.add('guilty');
    bubble('right', Mentor.reaction(true, this.attempts + i));
    Sound.play('clue');
    clearTimeout(this.finishTimer);
    // 1.6: the confession plays first (about two seconds); a tap anywhere skips it
    const show = typeof Motion !== 'undefined' ? Motion.confess(btn, react, BD_T('Jij was het!')) : 0;
    if (!show) this.buzz(12);
    const token = this.finishTimer = setTimeout(() => end(), show || 700);
    const skip = () => { if (this.finishTimer === token) end(); else document.removeEventListener('pointerdown', skip, true); };
    const end = () => {
      clearTimeout(token); this.finishTimer = null;
      document.removeEventListener('pointerdown', skip, true);
      if (typeof Motion !== 'undefined') Motion.confessEnd();
      this.endAccuse(); this.finish();
    };
    if (show) setTimeout(() => { if (this.finishTimer === token) document.addEventListener('pointerdown', skip, true); }, 250);
  },

  medalCtx() {
    const st = this.loadStats();
    const worldsDone = Themes.list().map(t => t.id).filter(id => Campaign.chaptersFor(id).every(ch => Campaign.chapterDone(ch.key)));
    return {
      solved: st.solved || 0, clean: st.clean || 0, masterSolved: st.master || 0, streak: App.streak.count || 0, elapsed: this.elapsed,
      partsDone: Campaign.list().filter(ch => Campaign.chapterDone(ch.key)).length, worldsDone,
      threeStars: Campaign.threeStarCount(), archiveCount: Campaign.archiveCount(),
      weekFull: Progress.weekFull(), weekDone: Progress.weekDone(), evidence: Progress.evidenceCount(),
      points: Progress.points(), rankTitle: App.rankFor(st.solved || 0).title, rankLevel: App.rankFor(st.solved || 0).level,
      questsAll: Progress.questsAllDone(), freezeUsed: App.storageGet('crimson-freeze-used') === '1'
    };
  },

  finish() {
    this.solved = true;
    this.clearResume();
    this.stopTimer();
    if (App.liveCase) App.liveCase('solved');
    document.getElementById('board-grid').classList.add('solved');
    this.updateTools();
    if (this.isTutorial) {
      App.storageSet('crimson-board-tutorial-done', '1');
      if (typeof Meting !== 'undefined') Meting.send('tutorial_done');
      document.getElementById('board-coach').hidden = true;
      document.getElementById('btn-board-hint').disabled = false;
      App.mode = 'board';
      this.showResults();
      this.isTutorial = false;
      App.navigateTo('results');
      return;
    }
    Sound.play('win');
    const solvedBefore = this.loadStats().solved || 0;
    const before = App.rankFor(solvedBefore);
    this.saveStats();
    const solvedAfter = this.loadStats().solved || 0;
    if (typeof Meting !== 'undefined') Meting.send('solved', this.isDaily ? 'daily' : this.campaignCase ? 'campaign' : this.missedDay ? 'missed' : 'free', solvedAfter);
    const after = App.rankFor(solvedAfter);
    this.newRank = after.title !== before.title ? after.title : null;
    this.rankInfo = { before, after, solvedBefore, solvedAfter };
    this.chestKey = null;
    if (this.campaignCase) {
      const k = this.campaignCase.chapter;
      const starsNow = Campaign.starsFor(this.hintsUsed, this.attempts), starsBefore = Campaign.stars(k, this.campaignCase.idx);
      Campaign.save(k, this.campaignCase.idx, starsNow);
      // 1.5: hints are earned by playing well (Supercell-style): +1 the first time a case gets three stars
      this.hintEarned = starsNow === 3 && starsBefore < 3 && typeof Store !== 'undefined' && !Store.hasPass();
      if (this.hintEarned) { Store.addHints(1); if (typeof Meting !== 'undefined') Meting.send('hint_earned'); }
      // deel af en de bewijskist nog dicht: die komt na de ceremonie
      if (k !== Campaign.ARCHIVE && Campaign.chapterDone(k) && !Campaign.chestOpened(k)) this.chestKey = k;
    }
    if (this.isDaily) {
      App.updateStreak();
      App.storageSet('crimson-board-daily-done', new Date().toDateString());
      App.scheduleReminder();
    }
    // gemiste dagzaak: telt als zaak en voor medailles, maar raakt de streak niet (eigen logboek, geen daily-log)
    if (this.missedDay) Progress.logLate(this.missedDay.key);
    // punten, zaak van de week, onderscheidingen
    this.score = Progress.score({
      difficulty: this.difficulty, elapsed: this.elapsed, hintsUsed: this.hintsUsed, attempts: this.attempts,
      isDaily: this.isDaily && !this.dailyDoneBefore, isWeekly: this.isWeekly && !Progress.weekDone(),
      isArchive: !!this.campaignCase && this.campaignCase.chapter === Campaign.ARCHIVE
    });
    Progress.addPoints(this.score.total);
    if (this.isWeekly) Progress.markWeekDone(this.shareText());
    // opdrachten van vandaag
    const stars = this.campaignCase ? Campaign.starsFor(this.hintsUsed, this.attempts) : 0;
    this.questsDone = [];
    const bump = (k, ok = true) => { if (ok) this.questsDone.push(...Progress.questBump(k)); };
    bump('solved'); bump('clean', this.hintsUsed === 0); bump('fast', this.elapsed <= 180); bump('daily', this.isDaily);
    bump('campaign', !!this.campaignCase && this.campaignCase.chapter !== Campaign.ARCHIVE); bump('firsttry', this.attempts === 0); bump('threestar', stars === 3);
    Progress.logPlayHour();
    this.medalsWon = Progress.checkMedals(this.medalCtx());
    this.medalsShown = false;
    App.mode = 'board';
    this.writeLedger();
    // 1.6: a wave of gold over the rooms, then the board folds away into the result
    const go = () => {
      this.showResults();
      App.updateBoardStats();
      App.navigateTo('results');
      if (this.hintEarned) App.showToast('💡', BD_T('+1 hint voor ★★★'));
      App.maybeAskReview({ weeklyClean: this.isWeekly && this.hintsUsed === 0, stars: Campaign.starsFor(this.hintsUsed, this.attempts) });
    };
    if (typeof Motion !== 'undefined') Motion.boardOut(document.getElementById('board-grid'), go); else go();
  },
  // 1.6 ledger: the culprit of every solved campaign case, so the results screen can write the part's ledger
  LEDGER_KEY: 'crimson-ledger-book',
  ledgerBook() { try { return JSON.parse(App.storageGet(this.LEDGER_KEY) || '{}'); } catch (e) { return {}; } },
  writeLedger() {
    const c = this.campaignCase;
    if (!c || c.chapter === Campaign.ARCHIVE) return;
    const book = this.ledgerBook();
    book[Campaign.id(c.chapter, c.idx)] = this.puzzle.suspects[this.puzzle.murderer].label;
    App.storageSet(this.LEDGER_KEY, JSON.stringify(book));
  },
  // the last three solved cases of this part, the new one last; it writes itself during the ceremony
  renderLedger() {
    const box = document.getElementById('results-ledger');
    if (!box) return;
    const c = this.campaignCase, ch = c && c.chapter !== Campaign.ARCHIVE ? Campaign.chapter(c.chapter) : null;
    box.hidden = !ch || this.isTutorial;
    box.textContent = '';
    if (box.hidden) return;
    const book = this.ledgerBook(), rows = [];
    for (let i = c.idx; i >= 0 && rows.length < 3; i--) {
      const k = Campaign.id(c.chapter, i);
      if (book[k] && ch.cases[i]) rows.unshift({ title: `${i + 1}. ${ch.cases[i].title}`, who: book[k], now: i === c.idx });
    }
    const el = (tag, cls, text) => { const e = document.createElement(tag); e.className = cls; if (text) e.textContent = text; return e; };
    box.appendChild(el('div', 'lg-head', `${BD_T('Grootboek')} · ${ch.title}`));
    rows.forEach(r => {
      const row = el('div', `lg-row${r.now ? ' now' : ''}${r.now && typeof Motion !== 'undefined' && Motion.ok ? ' pending' : ''}`);
      row.append(el('span', 'lg-case', r.title), el('span', 'lg-who', r.who));
      box.appendChild(row);
    });
    if (Campaign.chapterDone(c.chapter)) box.appendChild(el('div', 'lg-sum'));
    box.insertAdjacentHTML('beforeend', '<svg class="lg-nib" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l3-9 9-9 6 6-9 9z" fill="#2C1810"/><path d="M3 21l5-5" stroke="#B8955C" stroke-width="1.5"/></svg>');
  },
  // medailles pas tonen als de ceremonie klaar is (of overgeslagen)
  flushMedals() {
    if (this.medalsShown) return;
    this.medalsShown = true;
    (this.medalsWon || []).forEach(m => App.showMedal(m));
    const q = this.questsDone || [];
    if (q.length && App.questToast) setTimeout(() => App.questToast(q), (this.medalsWon || []).length ? 1800 : 300);
    if (App.streakToasts) setTimeout(() => App.streakToasts(), q.length ? 3600 : 300);
    this.questsDone = [];
    // laatste zaak van een deel: de bewijskist, het grote moment
    if (this.chestKey && App.showChest) { const k = this.chestKey; this.chestKey = null; setTimeout(() => App.showChest(k), 900); }
  },

  // ── Voortgang ─────────────────────────────────────────────
  loadStats() {
    try { return JSON.parse(App.storageGet('crimson-board-stats') || '{}'); } catch (e) { return {}; }
  },
  saveStats() {
    const st = this.loadStats();
    st.solved = (st.solved || 0) + 1;
    st.best = st.best || {};
    if (!st.best[this.difficulty] || this.elapsed < st.best[this.difficulty]) st.best[this.difficulty] = this.elapsed;
    if (this.hintsUsed === 0) st.clean = (st.clean || 0) + 1;
    if (this.difficulty === 'meester') st.master = (st.master || 0) + 1;
    App.storageSet('crimson-board-stats', JSON.stringify(st));
  },

  showResults() {
    const p = this.puzzle;
    const m = p.suspects[p.murderer];
    const q = p.rooms.find(x => x.id === p.victim.roomId);
    const $ = id => document.getElementById(id);
    this.skipCeremony(true);
    $('results-icon').hidden = true;
    $('results-stamp').style.borderColor = '';
    $('results-headline').textContent = this.isTutorial ? BD_T('Goed gedaan!') : BD_T('Zaak opgelost!');
    $('results-verdict').textContent = Grammar.text('board/verdict', p, { s: Grammar.who(m), room: q.id });
    // laatste zaak van een deel: de afsluiting van dat deel
    const chap = this.campaignCase ? Campaign.chapter(this.campaignCase.chapter) : null;
    const finale = chap && this.campaignCase.idx === chap.cases.length - 1 ? chap.outro : null;
    $('results-description').textContent = this.isTutorial
      ? BD_T('Zo werkt elke zaak: plaats iedereen met de verklaringen, en wijs dan aan wie alleen was met het slachtoffer. Tijd voor een echte zaak.')
      : (finale || '');
    // The daily reminder is the strongest pull back the next day. Offer it after a daily case and after each of the first three
    // solved cases (most new players start in the campaign and would otherwise never see it), never during the practice case.
    const remindBtn = $('btn-remind');
    const earlySolve = !this.isDaily && (this.loadStats().solved || 0) <= 3;
    if (remindBtn) remindBtn.hidden = !((this.isDaily || earlySolve) && !this.isTutorial && App.notif() && !App.reminderEnabled());

    // scorepaneel: stempel, sterren, punten, rang; en de opmerking van Van Dam
    const panel = $('results-panel'), mentor = $('results-mentor');
    panel.hidden = this.isTutorial;
    mentor.hidden = this.isTutorial;
    $('results-stars').hidden = false;
    ['results-stamp', 'score-total-row', 'results-rank', 'results-mentor'].forEach(id => $(id).classList.add('pending'));
    const st = Campaign.starsFor(this.hintsUsed, this.attempts);
    $('results-stars').innerHTML = [0, 1, 2].map(i => `<span class="rstar pending${i < st ? '' : ' off'}">${i < st ? '★' : '☆'}</span>`).join('');
    const sc = this.score || Progress.score({ difficulty: this.difficulty, elapsed: this.elapsed, hintsUsed: this.hintsUsed, attempts: this.attempts });
    $('score-rows').innerHTML = sc.rows.map(([label, v], i) =>
      `<div class="score-row pending"><span>${label}</span><b class="${i === 0 ? '' : v > 0 ? 'plus' : 'zero'}" data-v="${v}">${i === 0 ? v : '+' + v}</b></div>`).join('');
    $('score-total').textContent = BD_T`${sc.total} punten`;
    $('score-total').dataset.v = sc.total;
    const ri = this.rankInfo || {};
    const after = ri.after || App.rankFor(this.loadStats().solved || 0);
    const before = ri.before || after;
    const left = after.next ? after.next.at - (ri.solvedAfter || 0) : 0;
    $('results-rank').innerHTML =
      (this.newRank ? `<span class="rank-new">🎖 ${BD_T`Nieuwe rang: ${this.newRank}`}</span>` : `<span class="rank-title">🎖 ${after.title}</span>`) +
      `<span class="rank-next">${after.next ? BD_T`Volgende: ${after.next.title} · nog ${left} {1|one:zaak|other:zaken}` : BD_T('Hoogste rang bereikt')}</span>` +
      `<span class="rank-bar"><i style="width:${Math.round((this.newRank ? 0 : before.progress) * 100)}%" data-to="${Math.round(after.progress * 100)}"></i></span>`;
    const remark = Mentor.remark({ hintsUsed: this.hintsUsed, attempts: this.attempts, elapsed: this.elapsed, newRank: this.newRank,
                                   rank: before.title, isWeekly: this.isWeekly, stars: st });
    mentor.innerHTML = `<img src="${Mentor.sketch}" alt=""><div><span class="mentor-label">${BD_T('Van Dam merkt op')}</span><p>${I18n.quote(remark)}</p></div>`;

    // waar iedereen stond
    const solEl = $('results-solution');
    solEl.innerHTML = `<span class="label">${BD_T('Waar iedereen stond')}</span>`;
    p.suspects.forEach((s, i) => {
      const r = FloorPlan.roomOf(p.rooms, p.solution[i].x, p.solution[i].y);
      const row = document.createElement('div');
      row.className = 'results-solution-row';
      row.innerHTML = `<span class="results-solution-ava">${Avatars.suspect(s, i)}</span><b>${s.label}</b>` +
                      `<span class="results-solution-room">${Grammar.room(p, r.id).the}${i === p.murderer ? ' 🔪' : ''}</span>`;
      solEl.appendChild(row);
    });

    // knoppen: volgende zaak, kaart, menu
    $('btn-play-again').textContent = this.isTutorial ? BD_T('🗺️ Naar de kaart') : BD_T('Naar het menu');
    $('btn-play-again').dataset.to = this.isTutorial ? 'map' : 'menu';
    const nextBtn = $('btn-next-case'), mapBtn = $('btn-map'), teaser = $('results-next');
    mapBtn.hidden = !(this.campaignCase && !this.isTutorial);
    if (teaser) teaser.hidden = true;
    if (this.campaignCase && !this.isTutorial) {
      const next = Campaign.next(this.campaignCase.chapter, this.campaignCase.idx);
      nextBtn.hidden = !next;
      nextBtn.textContent = next ? BD_T`▶ Volgende zaak: ${next.title}` : BD_T('▶ Volgende zaak');
      nextBtn.onclick = next ? () => App.startCampaignCase(next.chapter, next.idx) : null;
      // hierna: het verhaaltje van de volgende zaak en hoe ver je in dit deel bent
      if (teaser && next && next.chapter !== Campaign.ARCHIVE) {
        const ch = Campaign.chapter(next.chapter);
        const done = ch.cases.filter((_, i) => Campaign.stars(ch.key, i) > 0).length;
        const left = ch.cases.length - done;
        $('results-next-title').textContent = `${next.idx + 1}. ${next.title}`;
        $('results-next-story').textContent = next.story;
        $('results-next-bar').innerHTML = `<span>${ch.title}</span><i><b style="width:${Math.round(done / ch.cases.length * 100)}%"></b></i><span>${left === 0 ? BD_T('af!') : left === 1 ? BD_T('nog 1 zaak') : BD_T`nog ${left} zaken`}</span>`;
        teaser.hidden = false;
      }
    } else if (!this.isTutorial && this.missedDay && Progress.missedDays().length) {
      // gemiste dagzaak: de volgende gemiste dag ligt klaar
      const nextMissed = Progress.missedDays()[0];
      nextBtn.hidden = false;
      nextBtn.textContent = BD_T('▶ Volgende gemiste dagzaak');
      nextBtn.onclick = () => App.startMissedDaily(nextMissed.key);
    } else if (!this.isTutorial) {
      // vrij spel, dagelijkse zaak of zaak van de week: meteen door kunnen
      nextBtn.hidden = false;
      nextBtn.textContent = BD_T`▶ Nog een zaak · ${this.theme.title}`;
      const diff = this.isDaily ? 'gemiddeld' : this.isWeekly ? 'meester' : this.difficulty, themeId = this.theme.id;
      nextBtn.onclick = () => {
        if (Board.start(diff, 0, false, themeId)) App.navigateTo('board');
        else App.showToast('⚠️', BD_T('Kon geen plattegrond genereren, probeer opnieuw.'));
      };
    } else if (this.isTutorial && typeof Campaign !== 'undefined' && Campaign.list().length) {
      // right after the practice case: straight into the first real case, not via the map (only 48% reached case 1 that way)
      const first = Campaign.list()[0], c0 = Campaign.caseAt(first.key, 0);
      nextBtn.hidden = !c0 || Campaign.stars(first.key, 0) > 0;
      if (c0) { nextBtn.textContent = BD_T`▶ Volgende zaak: ${c0.title}`; nextBtn.onclick = () => App.startCampaignCase(first.key, 0, true); }
    } else { nextBtn.hidden = true; }
    this.prepareAfloop();
    $('stat-time').textContent = this.formatTime(this.elapsed);
    $('stat-difficulty').textContent = (DIFFICULTY[this.difficulty] || DIFFICULTY.gemiddeld).label;
    $('stat-hints').textContent = this.hintsUsed;
    $('stat-attempts').textContent = this.attempts + 1;
    this.renderLedger();
    if (this.isTutorial) this.revealAll(); else this.ceremony();
  },

  // ── Zo zat het (1.6) ──────────────────────────────────────
  // Na het oplossen: de beslissende verklaringen (FloorPlan.decisive) in de drie stappen van de hint: kijk naar
  // (de verklaringskaarten), dat betekent (Grammar.explain) en dus (de spelregel en het oordeel). Dezelfde
  // bouwstenen als de hint, dus in elke taal al goed. Plus het bewijsstuk van een campagnezaak.
  // Ingeklapt; de inhoud wordt pas gebouwd als de speler hem opent, en nooit voordat de zaak is opgelost.
  prepareAfloop() {
    const box = document.getElementById('results-afloop'), body = document.getElementById('afloop-body');
    if (!box || !body) return;
    body.innerHTML = '';
    box.open = false;
    box.hidden = !(this.solved && !this.isTutorial && this.puzzle);
    if (!box.dataset.bound) {
      box.dataset.bound = '1';
      box.addEventListener('toggle', () => { if (box.open) this.renderAfloop(); });
    }
  },
  renderAfloop() {
    const body = document.getElementById('afloop-body');
    if (!body) return '';
    if (!this.solved || this.isTutorial || !this.puzzle) { body.innerHTML = ''; return ''; }
    const p = this.puzzle;
    if (!this.afloop) this.afloop = FloorPlan.decisive(p);
    const d = this.afloop;
    const L = typeof I18n !== 'undefined' ? I18n : { joinSentences: (...x) => x.filter(Boolean).join(' ') };
    const step = (label, html) => `<div class="hint-step afloop-step"><span class="hint-step-label">${label}</span>${html}</div>`;
    const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let html = step(BD_T('1 · Kijk naar'), `<div class="hint-clues afloop-clues">${d.clues.map(i => this.clueCard(i, 'dclue afloop-clue')).join('')}</div>`);
    // twee verklaringen of minder: wat ze betekenen; bij een rij alibi's één zin over wat ze samen zeggen
    const meaning = d.clues.length <= 2 ? L.joinSentences(...d.clues.map(i => Mentor.explain(p.clues[i], p)))
                                        : BD_T('Zo kon niemand anders bij het slachtoffer zijn.');
    html += step(BD_T('2 · Dat betekent'), `<p class="hint-meaning">${esc(meaning)}</p>`);
    const m = p.suspects[p.murderer], q = p.rooms.find(x => x.id === p.victim.roomId);
    html += step(BD_T('3 · Dus'),
      `<p class="afloop-rule">${esc(Grammar.text('board/rule', p))}</p><p class="afloop-verdict">${esc(Grammar.text('board/verdict', p, { s: Grammar.who(m), room: q.id }))}</p>`);
    // het bewijsstuk van een campagnezaak (staat nu in de vitrine)
    const item = this.campaignCase && this.campaignCase.item;
    if (item) {
      const sp = item.indexOf(' ');
      html += `<div class="afloop-item"><span class="afloop-item-icon">${esc(sp > 0 ? item.slice(0, sp) : '📦')}</span>` +
              `<span class="afloop-item-text"><span class="afloop-item-label">${BD_T('Bewijsstuk in je vitrine')}</span><b>${esc(sp > 0 ? item.slice(sp + 1) : item)}</b></span></div>`;
    }
    body.innerHTML = html;
    // kaarten zoals in de hint, zonder afvinken, status of doorstreping
    body.querySelectorAll('.bclue-check, .bclue-state').forEach(el => el.remove());
    body.querySelectorAll('.afloop-clue').forEach(el => el.classList.remove('done'));
    return body.textContent;
  },

  // ── Ceremonie: stempel → sterren → score telt op → rang. Tik = overslaan. ──
  ceremony() {
    const $ = id => document.getElementById(id);
    const screen = $('screen-results');
    const T = (fn, ms) => this.cerTimers.push(setTimeout(fn, ms));
    const show = el => { if (el) el.classList.remove('pending'); };
    // 1.6: the stamp rises first and lands STAMP_HIT ms later; everything after it moves along
    const M = typeof Motion !== 'undefined' && Motion.ok ? Motion : null, L = M ? M.STAMP_HIT : 0;
    if (M) T(() => M.stamp($('results-stamp')), 80);
    T(() => {
      if (!M) show($('results-stamp'));
      screen.classList.add('shake-paper'); this.confetti();
      Sound.play('stamp');
      if (M) M.impact($('results-stamp'), $('results-panel')); else this.buzz(30);
      T(() => screen.classList.remove('shake-paper'), 450);
    }, 80 + L);
    document.querySelectorAll('#results-stars .rstar').forEach((el, i) => T(() => { show(el); if (!el.classList.contains('off')) Sound.play('star'); }, 520 + L + i * 190));
    const rows = [...document.querySelectorAll('#score-rows .score-row')];
    rows.forEach((r, i) => T(() => { show(r); const b = r.querySelector('b'); this.countUp(b, +b.dataset.v, 260, i === 0 ? '' : '+'); }, 1080 + L + i * 170));
    const tRows = 1080 + L + rows.length * 170;
    T(() => { if (typeof Motion !== 'undefined') Motion.ledgerWrite($('results-ledger')); }, tRows + 160);
    T(() => { show($('score-total-row')); this.countUp($('score-total'), +$('score-total').dataset.v, 520, '', '', n => BD_T`${n} punten`); }, tRows);
    T(() => {
      show($('results-rank'));
      const bar = document.querySelector('#results-rank .rank-bar i');
      if (bar) bar.style.width = bar.dataset.to + '%';
      if (this.newRank) Sound.play('rank');
    }, tRows + 320);
    T(() => { show($('results-mentor')); this.cerTimers = []; this.flushMedals(); }, tRows + 640);
  },
  // fmt(n) geeft de hele tekst, zodat een taal het woord bij het getal kan laten passen ("1 очко", "5 очков")
  countUp(el, to, ms, prefix = '', suffix = '', fmt = null) {
    if (!el) return;
    const start = Date.now();
    const id = setInterval(() => {
      const k = Math.min(1, (Date.now() - start) / ms);
      const n = Math.round(to * k);
      el.textContent = fmt ? fmt(n) : prefix + n + suffix;
      if (k >= 1) clearInterval(id);
    }, 30);
    this.cuTimers.push(id);
  },
  skipCeremony(silent = false) {
    this.cerTimers.forEach(t => clearTimeout(t)); this.cerTimers = [];
    this.cuTimers.forEach(t => clearInterval(t)); this.cuTimers = [];
    if (!silent) { this.revealAll(); this.flushMedals(); }
  },
  revealAll() {
    const screen = document.getElementById('screen-results');
    if (typeof Motion !== 'undefined') Motion.finish(screen);
    screen.classList.remove('shake-paper');
    screen.querySelectorAll('.pending').forEach(el => el.classList.remove('pending'));
    document.querySelectorAll('#score-rows .score-row b').forEach((b, i) => { b.textContent = (i === 0 ? '' : '+') + b.dataset.v; });
    const tot = document.getElementById('score-total');
    if (tot && tot.dataset.v) tot.textContent = BD_T`${tot.dataset.v} punten`;
    const bar = document.querySelector('#results-rank .rank-bar i');
    if (bar) bar.style.width = bar.dataset.to + '%';
  },
  confetti() {
    if (typeof Motion !== 'undefined' && Motion.confetti()) return;   // 1.6: paper that flutters down
    const box = document.getElementById('confetti');
    if (!box) return;
    const colors = ['#B8955C', '#D4B074', '#8B2E1C', '#A8432E', '#2E7D32', '#FFFFFF'];
    let html = '';
    for (let i = 0; i < 44; i++) {
      const x = (Math.random() * 100).toFixed(1), dx = Math.round((Math.random() - 0.5) * 160), r = Math.round(Math.random() * 720 - 360);
      const d = (1.6 + Math.random() * 1.2).toFixed(2), dl = (Math.random() * 0.35).toFixed(2), sz = 6 + Math.round(Math.random() * 8);
      html += `<i class="cf" style="--x:${x}%;--dx:${dx}px;--r:${r}deg;--d:${d}s;--dl:${dl}s;--s:${sz}px;--c:${colors[i % colors.length]}"></i>`;
    }
    box.innerHTML = html;
    setTimeout(() => { if (box.innerHTML === html) box.innerHTML = ''; }, 3200);
  },

  // Spoiler-free result card with a link back (1.5). It used to draw the floor plan with every suspect, the victim and the
  // culprit, which gave the case away to whoever saw it and pointed nowhere: a share could never become a download.
  // Daily cases link to the free web daily (same case today, playable without installing); everything else to the store.
  SHARE_PLAY_URL: 'https://jaimycai.github.io/crimson-ledger/play/',
  SHARE_STORE_URL: 'https://apps.apple.com/app/id6812534368',
  // App Store campaign links (1.6): ct names the channel, so App Store Connect (App Analytics, Sources → Campaigns) counts
  // the downloads per channel: share-case, share-week, share-daily (the web daily passes its own ct on to the App Store),
  // webdaily-cta, webdaily-share. Apple attributes a campaign only together with the provider token (pt) of the
  // account; it is not in this repo yet. Copy it from App Analytics → Campaigns → "Generate a campaign link" into
  // STORE_PT and every link carries it. Without pt the links work as before.
  STORE_PT: '',
  storeLink(ct) { return `${this.SHARE_STORE_URL}?${this.STORE_PT ? `pt=${this.STORE_PT}&` : ''}ct=${ct}&mt=8`; },
  playLink(ct) { return `${this.SHARE_PLAY_URL}?ct=${ct}`; },
  shareText() {
    const diff = DIFFICULTY[this.difficulty] || DIFFICULTY.gemiddeld;
    const stars = Campaign.starsFor(this.hintsUsed, this.attempts);
    const what = this.isWeekly ? BD_T` · Zaak van de week: ${this.weekly.title}`
      : this.campaignCase ? ` · ${this.campaignCase.chapter === Campaign.ARCHIVE ? '' : this.campaignCase.idx + 1 + '. '}${this.campaignCase.title}` : '';
    return [
      `${this.theme.icon} Crimson Ledger · ${this.theme.title}${this.isDaily ? BD_T` · Dag #${App.getDayNumber()}` : this.missedDay ? BD_T` · Dag #${this.missedDay.dayNo}` : ''}${what}`,
      `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${diff.icon} ${diff.label} · ⏱ ${this.formatTime(this.elapsed)} · 💡 ${this.hintsUsed}`,
      // one square per accusation: red for a wrong one, green for the culprit
      '🟥'.repeat(this.attempts) + '🟩',
      this.isDaily && App.streak.count > 1 ? BD_T`🔥 ${App.streak.count} dagen streak!` : '',
      '', this.isDaily ? this.playLink('share-daily') : this.storeLink(this.isWeekly ? 'share-week' : this.missedDay ? 'share-daily' : 'share-case')
    ].filter((x, i, a) => x || (i > 0 && a[i - 1])).join('\n');
  },

  // ── Bord passend maken ────────────────────────────────────
  // De plattegrond krijgt precies de ruimte die overblijft: geen afgekapte
  // rijen, geen gat boven de gereedschapsbalk, op elk schermformaat.
  fitBoard() {
    const stage = document.querySelector('.board-stage');
    const grid = document.getElementById('board-grid');
    if (!stage || !grid || !this.puzzle) return;
    const h = stage.clientHeight - 16, w = stage.clientWidth - 24;
    if (h <= 0 || w <= 0) return;   // scherm nog niet in beeld
    const ratio = this.puzzle.cols / this.puzzle.rows;
    const width = Math.floor(Math.max(160, Math.min(w, 460, h * ratio)));
    this.baseW = width; this.baseH = Math.floor(width / ratio);
    this.updateBoardActs();
    if (this.zoom > 1) { this.zoomTo(this.zoom, this.viewAnchor()); this.fitToolLabels(); return; }   // ingezoomd: hetzelfde stuk in beeld
    grid.style.width = `${width}px`;
    grid.style.height = `${this.baseH}px`;
    this.fitLabels(grid);
    this.fitToolLabels();
    this.fitNames();
    // eerst gemeten met een reserveletter? dan opnieuw zodra de echte letters er zijn
    if (typeof document !== 'undefined' && document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => { this.fitLabels(grid); this.fitToolLabels(); this.fitNames(); });
  },
  // De labels onder de gereedschapsknoppen zijn klein; in langere talen ("Подсказка") worden ze kleiner
  // in plaats van uit hun knop te lopen, tot 7 px (alleen op het kleinste scherm).
  fitToolLabels() {
    if (typeof getComputedStyle === 'undefined') return;
    document.querySelectorAll('.board-tools .tool-label').forEach(el => {
      el.style.fontSize = '';
      const box = el.closest('.tool');
      if (!box || !el.offsetWidth) return;
      let fs = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > el.clientWidth + 1 && fs > 7) { fs -= 0.25; el.style.fontSize = `${fs}px`; }
    });
  },
  // Een naamkaartje op het bord toont de korte naam liefst helemaal: eerst mag het een kwart vakje breder
  // worden dan het vakje, dan wordt de letter kleiner (tot 6 px); pas daarna een beletselteken.
  fitNames() {
    if (typeof getComputedStyle === 'undefined' || typeof document === 'undefined') return;
    const cut = el => el.scrollWidth > el.clientWidth;   // ook een halve pixel te veel geeft al een beletselteken
    const grid = document.getElementById('board-grid'), g = grid && grid.getBoundingClientRect();
    document.querySelectorAll('#board-grid .bname').forEach(el => {
      el.style.fontSize = ''; el.style.maxWidth = ''; el.style.left = ''; el.style.right = ''; el.style.transform = '';
      if (!el.offsetWidth || !cut(el)) return;
      el.style.maxWidth = '125%';
      let fs = parseFloat(getComputedStyle(el).fontSize);
      while (cut(el) && fs > 6.1) { fs = Math.max(6, fs - 0.25); el.style.fontSize = `${fs}px`; }
      // aan de rand van het bord niet over de rand heen: dan tegen de kant van het vakje aan
      const r = el.getBoundingClientRect();
      if (g && r.left < g.left) { el.style.left = '0'; el.style.transform = 'none'; }
      else if (g && r.right > g.right) { el.style.left = 'auto'; el.style.right = '0'; el.style.transform = 'none'; }
    });
  },
  // Een kamernaam mag niet breder worden dan de onderste rij van zijn kamer, anders loopt hij over
  // de buurkamer (smalle kamers, lange namen in sommige talen): eerst iets kleiner, dan over twee regels.
  fitLabels(grid) {
    const gw = grid && grid.clientWidth;
    if (!gw || typeof getComputedStyle === 'undefined') return;
    const labels = [...grid.querySelectorAll('.room-label')];
    const cols = +grid.style.getPropertyValue('--cols') || 0, rows = +grid.style.getPropertyValue('--rows') || 0;
    labels.forEach(el => {
      el.classList.remove('wrap', 'clip'); el.style.fontSize = ''; el.style.maxWidth = '';
      // 1.6: op het eerste stuk rij zonder meubel waar de naam helemaal op past; anders midden op de onderste rij.
      // Het hele bord: alleen de onderste rij (daar zoekt het oog de naam); ingezoomd mag hij een rij hoger.
      if (el.dataset.home && cols && rows) {
        const homeY = +el.dataset.home.split(':')[0];
        const runs = (el.dataset.runs || '').split(';').filter(Boolean).map(r => r.split(':').map(Number)).filter(r => this.zoom > 1 || r[0] === homeY);
        // past hij nergens: ingezoomd het breedste vrije stuk (daar wordt hij kleiner of gaat hij over twee regels)
        const fit = runs.find(([, x0, x1]) => el.offsetWidth <= gw * (x1 - x0 + 1) / cols + 2) ||
          (this.zoom > 1 && runs.length ? runs.reduce((a, b) => (b[2] - b[1] > a[2] - a[1] ? b : a)) : null);
        const [y, x0, x1] = fit || el.dataset.home.split(':').map(Number);
        el.style.left = `${((x0 + x1 + 1) / 2 / cols) * 100}%`;
        el.style.top = `${((y + 1) / rows) * 100}%`;
        el.dataset.w = ((x1 - x0 + 1) / cols) * 100;
      }
      const max = gw * (+el.dataset.w || 100) / 100 + 4;
      if (el.offsetWidth <= max) return;
      el.style.fontSize = `${Math.max(7, parseFloat(getComputedStyle(el).fontSize) * 0.85)}px`;
      if (el.offsetWidth <= max) return;
      el.classList.add('wrap'); el.style.maxWidth = `${Math.max(max, 44)}px`;
      // meer dan drie regels = een woord dat letter voor letter breekt: dan op één regel inkorten
      if (el.offsetHeight > parseFloat(getComputedStyle(el).fontSize) * 3.6) { el.classList.remove('wrap'); el.classList.add('clip'); el.style.maxWidth = `${Math.max(max, 28)}px`; }
    });
    // Lopen twee namen dan nog over elkaar (een smalle kamer van één rij hoog), dan wordt de naam
    // van de smalste kamer op één regel ingekort met een beletselteken.
    for (let pass = 0; pass < 3; pass++) {
      const rs = labels.map(el => el.getBoundingClientRect());
      let changed = false;
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = rs[i], b = rs[j];
        if (!(a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1)) continue;
        const [first, second] = +labels[i].dataset.w <= +labels[j].dataset.w ? [labels[i], labels[j]] : [labels[j], labels[i]];
        const el = first.classList.contains('clip') ? second : first;
        if (el.classList.contains('clip')) continue;
        el.classList.remove('wrap'); el.classList.add('clip');
        el.style.maxWidth = `${Math.max(gw * (+el.dataset.w || 100) / 100, 28)}px`;
        changed = true;
      }
      if (!changed) break;
    }
  },
  bindFit() {
    let t = null;
    const fit = () => { clearTimeout(t); t = setTimeout(() => this.fitBoard(), 60); };
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
  },

  // ── Inzoomen (1.6) ────────────────────────────────────────
  // Borden vanaf 8×8 zijn op een kleine telefoon klein (9×9 op 320 px: vakjes van 22 px). De vergrootknop in de
  // bovenbalk zoomt in rond het laatst aangetikte vakje; knijpen (aanraking) of ctrl/trackpad + scrollen (muis)
  // zoomt traploos. Ingezoomd verschuif je het bord door te slepen vanaf een vakje zonder verdachte (een
  // verdachte slepen verplaatst hem, zoals altijd) of met het scrollwiel. Eén tik op de knop: weer het hele bord.
  // Het bord wordt echt groter opgemaakt (geen schaal), dus kamernamen, naamkaartjes en stipjes houden hun
  // maat terwijl de vakjes groeien: ze bedekken minder, en fitLabels zet een kamernaam naast de meubels.
  ZOOM_MAX: 3,
  canZoom() { const p = this.puzzle; return !!p && !this.isTutorial && !this.accusing && Math.max(p.cols, p.rows) >= 8; },
  // de stand van de vergrootknop: vakjes van zo'n 48 px, minstens 1,6× en hoogstens 2,6×
  zoomTarget() { return Math.max(1.6, Math.min(2.6, 48 / ((this.baseW || 300) / this.puzzle.cols))); },
  stageEl() { return typeof document !== 'undefined' ? document.querySelector('#screen-board .board-stage') : null; },
  resetZoom() {
    this.zoom = 1; this.pan = null;
    const stage = this.stageEl(), grid = typeof document !== 'undefined' && document.getElementById('board-grid');
    if (stage) stage.classList.remove('zoomed');
    if (grid) grid.style.transform = '';
    this.updateBoardActs();
  },
  // z: zoomfactor; anchor: het punt van het bord (fx, fy als deel van breedte en hoogte) dat op plek sx, sy van het
  // podium moet komen. live: tijdens knijpen, dan nog niet alle labels opnieuw passen.
  zoomTo(z, anchor, live = false) {
    const stage = this.stageEl(), grid = document.getElementById('board-grid');
    if (!stage || !grid || !this.puzzle || !this.baseW) return;
    z = Math.min(this.ZOOM_MAX, Math.max(1, z || 1));
    if (z < 1.05 || !this.canZoom()) { const was = this.zoom > 1; this.resetZoom(); if (was) this.fitBoard(); return; }
    const cw = stage.clientWidth, ch = stage.clientHeight;
    const a = anchor || { fx: 0.5, fy: 0.5, sx: cw / 2, sy: ch / 2 };
    this.zoom = z;
    stage.classList.add('zoomed');
    grid.style.width = `${this.baseW * z}px`;
    grid.style.height = `${this.baseH * z}px`;
    this.panTo(a.sx - a.fx * this.baseW * z, a.sy - a.fy * this.baseH * z);
    if (!live) { this.fitLabels(grid); this.fitNames(); }
    this.updateBoardActs();
  },
  // verschuiven, maar nooit verder dan de rand van het bord; past het in een richting, dan in het midden
  panTo(x, y) {
    const stage = this.stageEl(), grid = document.getElementById('board-grid');
    if (!stage || !grid || this.zoom <= 1) return;
    const cw = stage.clientWidth, ch = stage.clientHeight, gw = this.baseW * this.zoom, gh = this.baseH * this.zoom;
    x = gw <= cw ? (cw - gw) / 2 : Math.min(0, Math.max(cw - gw, x));
    y = gh <= ch ? (ch - gh) / 2 : Math.min(0, Math.max(ch - gh, y));
    this.pan = { x, y };
    grid.style.transform = `translate(${x}px, ${y}px)`;
  },
  // ingezoomd: deze vakjes (hun midden) midden in beeld
  centerOn(cells) {
    const stage = this.stageEl(), p = this.puzzle;
    if (!stage || !p || this.zoom <= 1 || !cells || !cells.length) return;
    const fx = cells.reduce((a, c) => a + c.x + 0.5, 0) / cells.length / p.cols, fy = cells.reduce((a, c) => a + c.y + 0.5, 0) / cells.length / p.rows;
    this.panTo(stage.clientWidth / 2 - fx * this.baseW * this.zoom, stage.clientHeight / 2 - fy * this.baseH * this.zoom);
  },
  // het punt van het bord dat nu midden in beeld staat (om na een draai of nieuwe maat daar te blijven)
  viewAnchor() {
    const stage = this.stageEl();
    if (!stage || !this.pan || this.zoom <= 1) return null;
    const cw = stage.clientWidth, ch = stage.clientHeight, gw = this.baseW * this.zoom, gh = this.baseH * this.zoom;
    return { fx: Math.min(1, Math.max(0, (cw / 2 - this.pan.x) / gw)), fy: Math.min(1, Math.max(0, (ch / 2 - this.pan.y) / gh)), sx: cw / 2, sy: ch / 2 };
  },
  toggleZoom() {
    if (this.zoom > 1) { this.resetZoom(); this.fitBoard(); return; }
    if (!this.canZoom()) return;
    const p = this.puzzle, stage = this.stageEl();
    const c = this.lastCell || (this.hintRefs && this.hintRefs.cells && this.hintRefs.cells[0]) || null;
    const at = c ? { fx: (c.x + 0.5) / p.cols, fy: (c.y + 0.5) / p.rows } : { fx: 0.5, fy: 0.5 };
    this.zoomTo(this.zoomTarget(), { ...at, sx: stage.clientWidth / 2, sy: stage.clientHeight / 2 });
    this.buzz(8);
  },
  // knoppen in de bovenbalk: vergrootglas alleen bij grote borden, "?" niet in de oefenzaak
  updateBoardActs() {
    if (typeof document === 'undefined') return;
    const help = document.getElementById('btn-board-help');
    if (help) help.hidden = !!this.isTutorial;
    const b = document.getElementById('btn-board-zoom');
    if (!b) return;
    const on = this.zoom > 1;
    b.hidden = !on && !this.canZoom();
    if (b.dataset.on === String(on)) return;
    b.dataset.on = String(on);
    b.classList.toggle('on', on);
    if (typeof Icons !== 'undefined') b.innerHTML = Icons.html(on ? 'zoom-out' : 'zoom-in');
    b.setAttribute('aria-label', on ? BD_T('Heel bord') : BD_T('Inzoomen'));
  },
  // na slepen of knijpen geen tik op het vakje eronder
  swallowClick() { this.dragDone = true; setTimeout(() => { this.dragDone = false; }, 0); },
  bindZoom() {
    const stage = this.stageEl(), grid = document.getElementById('board-grid');
    if (!stage || !grid) return;
    const pts = new Map();
    let pinch = null, pan = null, raf = 0, job = null;
    const frame = fn => { job = fn; if (!raf) raf = requestAnimationFrame(() => { raf = 0; const f = job; job = null; if (f) f(); }); };
    const local = (x, y) => { const r = stage.getBoundingClientRect(); return { sx: x - r.left, sy: y - r.top }; };
    const onBoard = (x, y) => { const g = grid.getBoundingClientRect(); return { fx: (x - g.left) / g.width, fy: (y - g.top) / g.height }; };
    stage.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button > 0) return;
      if (e.isPrimary) pts.clear();   // een nieuwe eerste vinger (of muis): wat er nog stond is blijven hangen
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2 && e.pointerType !== 'mouse' && this.canZoom()) {
        const [a, b] = [...pts.values()];
        if (this.cancelDrag) this.cancelDrag();
        pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: this.zoom, ...onBoard((a.x + b.x) / 2, (a.y + b.y) / 2) };
        pan = null;
        return;
      }
      if (pts.size === 1 && this.zoom > 1 && this.pan && !(this.isDragging && this.isDragging())) {
        pan = { id: e.pointerId, x0: e.clientX, y0: e.clientY, px: this.pan.x, py: this.pan.y, moved: false };
      }
    });
    document.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size >= 2) {
        const [a, b] = [...pts.values()], P = pinch;
        const z = P.z0 * Math.hypot(a.x - b.x, a.y - b.y) / P.d0;
        const at = { fx: P.fx, fy: P.fy, ...local((a.x + b.x) / 2, (a.y + b.y) / 2) };
        frame(() => this.zoomTo(z, at, true));
        return;
      }
      if (pan && e.pointerId === pan.id) {
        const P = pan, dx = e.clientX - P.x0, dy = e.clientY - P.y0;
        if (!P.moved && Math.hypot(dx, dy) < 6) return;
        P.moved = true;
        frame(() => this.panTo(P.px + dx, P.py + dy));
      }
    }, { passive: true });
    const end = e => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pinch) {
        if (pts.size >= 2) return;
        pinch = null;
        this.swallowClick();
        frame(() => {
          if (this.zoom < 1.15) { if (this.zoom > 1) { this.resetZoom(); this.fitBoard(); } }
          else { this.fitLabels(grid); this.fitNames(); }
        });
        return;
      }
      if (pan && e.pointerId === pan.id) { if (pan.moved) this.swallowClick(); pan = null; }
    };
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
    // muis en trackpad: ctrl + scrollen (zo meldt de trackpad ook knijpen) zoomt, gewoon scrollen verschuift
    let settle = null;
    stage.addEventListener('wheel', e => {
      if (e.ctrlKey && this.canZoom()) {
        e.preventDefault();
        const step = Math.max(-50, Math.min(50, e.deltaY));   // een muiswiel geeft grote stappen, een trackpad kleine
        this.zoomTo(this.zoom * Math.exp(-step * 0.01), { ...onBoard(e.clientX, e.clientY), ...local(e.clientX, e.clientY) }, true);
        clearTimeout(settle);
        settle = setTimeout(() => { if (this.zoom > 1) { this.fitLabels(grid); this.fitNames(); } }, 160);
      } else if (this.zoom > 1 && this.pan) {
        e.preventDefault();
        this.panTo(this.pan.x - e.deltaX, this.pan.y - e.deltaY);
      }
    }, { passive: false });
  },

  // ── Uitleg op aanvraag (1.6) ──────────────────────────────
  // De "?" in de bovenbalk toont alle uitlegkaarten opnieuw (dezelfde als de "Nieuw in dit deel"-kaarten):
  // eerst de soorten die in deze zaak voorkomen, dan de rest. Bij meester eerst een kaart over lege rijen en
  // kolommen. De klok staat stil zolang je leest.
  EMPTY_LINES_ID: 'leeg-rijen',
  emptyLinesCard() {
    return {
      id: this.EMPTY_LINES_ID, kinds: [], title: BD_T('Lege rijen en kolommen'),
      text: BD_T('Op dit bord zijn er meer rijen en kolommen dan verdachten. Veel rijen en kolommen blijven dus leeg, en twee verdachten mogen best op dezelfde rij of in dezelfde kolom staan. Alleen de verklaringen tellen.'),
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#F3EDE3" stroke="#1A1108" stroke-width="3"/><path d="M13.2 2v56M24.4 2v56M35.6 2v56M46.8 2v56M2 13.2h56M2 24.4h56M2 35.6h56M2 46.8h56" stroke="#1A1108" stroke-opacity="0.2"/><rect x="3.5" y="24.4" width="53" height="11.2" fill="#8B2E1C" opacity="0.18"/><circle cx="18.8" cy="30" r="4.5" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="41.2" cy="30" r="4.5" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/><circle cx="30" cy="52.4" r="4.5" fill="#5C8B5E" stroke="#1A1108" stroke-width="1.5"/></svg>'
    };
  },
  helpCards() {
    const p = this.puzzle, kinds = new Set(p ? p.clues.map(c => c.kind) : []);
    const intros = typeof Mentor !== 'undefined' ? Mentor.INTROS : [];
    const here = i => i.kinds.some(k => kinds.has(k));
    return [
      ...(this.difficulty === 'meester' && !this.isTutorial ? [{ ...this.emptyLinesCard(), here: true }] : []),
      ...intros.filter(here).map(i => ({ ...i, here: true })),
      ...intros.filter(i => !here(i))
    ];
  },
  openHelp() {
    const host = document.getElementById('help-cards');
    if (!host || !this.puzzle) return;
    host.innerHTML = this.helpCards().map(c => `<div class="help-card${c.here ? ' here' : ''}" data-help="${c.id}">
        <span class="newclue-pic">${c.svg}</span>
        <div class="help-card-body"><h4>${c.title}</h4>${c.here ? `<span class="help-here">${BD_T('In deze zaak')}</span>` : ''}<p>${c.text}</p></div>
      </div>`).join('');
    this.helpPaused = !!this.timerId && !this.solved;
    if (this.helpPaused) this.stopTimer();
    App.showModal('help-modal');
    const sheet = host.closest('.modal-content');
    if (sheet) sheet.scrollTop = 0;
  },
  closeHelp() {
    App.hideModal('help-modal');
    if (!this.helpPaused) return;
    this.helpPaused = false;
    if (!this.solved && this.puzzle) { this.elapsedBase = this.elapsed || 0; this.startTimer(); }
  },

  // ── Slepen: een verdachte van de balk of van het bord naar een vakje ──
  // Tikken blijft werken (eerst de verdachte, dan het vakje); slepen is
  // directer. Een geplaatste verdachte sleep je naar een ander vakje, op een
  // ander persoon (dan wisselen ze) of van het bord af.
  bindDrag() {
    const grid = document.getElementById('board-grid'), strip = document.getElementById('board-suspects');
    if (!grid || !strip) return;
    let d = null;
    // voor inzoomen (bindZoom): sleept er iemand, en een tweede vinger breekt het slepen af
    this.isDragging = () => !!d;
    this.cancelDrag = () => {
      if (!d) return;
      if (d.ghost) d.ghost.remove();
      d.src.classList.remove('dragging');
      this.markDrop(null);
      d = null;
    };
    const begin = (e, s, from, src) => {
      if (this.solved || this.accusing || (e.button && e.button > 0)) return;
      d = { s, from, src, id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, ghost: null };
    };
    strip.addEventListener('pointerdown', e => {
      const chip = e.target.closest('.sus-chip');
      if (chip) begin(e, +chip.dataset.s, null, chip);
    });
    grid.addEventListener('pointerdown', e => {
      const cell = e.target.closest('.bcell');
      if (!cell || this.mode === 'erase') return;
      const x = +cell.dataset.x, y = +cell.dataset.y;
      const s = this.placements.findIndex(c => c && c.x === x && c.y === y);
      if (s !== -1) begin(e, s, { x, y }, cell);
    });
    const cellAt = (cx, cy) => {
      if (!document.elementFromPoint) return null;
      const el = document.elementFromPoint(cx, cy);
      return el ? el.closest('#board-grid .bcell') : null;
    };
    document.addEventListener('pointermove', e => {
      if (!d || e.pointerId !== d.id) return;
      if (!d.moved) {
        if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 8) return;
        d.moved = true;
        d.ghost = this.makeGhost(d.s);
        d.src.classList.add('dragging');
        this.buzz(8);
      }
      d.ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      this.markDrop(cellAt(e.clientX, e.clientY), d);
    }, { passive: true });
    const end = e => {
      if (!d || e.pointerId !== d.id) return;
      const drag = d; d = null;
      if (!drag.moved) return;                        // gewone tik: de click-handler doet de rest
      this.markDrop(null);
      drag.src.classList.remove('dragging');
      if (drag.ghost) drag.ghost.remove();
      this.dragDone = true; setTimeout(() => { this.dragDone = false; }, 0);
      if (e.type === 'pointercancel') return;
      const cell = cellAt(e.clientX, e.clientY);
      if (cell) this.dropSuspect(drag.s, +cell.dataset.x, +cell.dataset.y, drag.from);
      else if (drag.from) this.liftSuspect(drag.s);   // naast het bord losgelaten: weer van het bord af
    };
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
  },
  makeGhost(s) {
    const g = document.createElement('div');
    g.className = 'drag-ghost';
    g.innerHTML = Avatars.suspect(this.puzzle.suspects[s], s);
    document.body.appendChild(g);
    return g;
  },
  markDrop(cell, d) {
    document.querySelectorAll('#board-grid .bcell.drop-ok, #board-grid .bcell.drop-bad').forEach(el => el.classList.remove('drop-ok', 'drop-bad'));
    if (!cell || !d) return;
    cell.classList.add(this.canDrop(d.s, +cell.dataset.x, +cell.dataset.y, d.from) ? 'drop-ok' : 'drop-bad');
  },
  canDrop(s, x, y, from) {
    const p = this.puzzle, k = FloorPlan.key(x, y);
    if (this.isTutorial) {
      const step = this.TUTORIAL_STEPS[this.tutorialStep];
      if (!step || !step.cell || x !== step.cell.x || y !== step.cell.y || s !== step.suspect) return false;
    }
    if (p.furniture.has(k) || (p.victim.x === x && p.victim.y === y)) return false;
    const occupant = this.placements.findIndex(c => c && c.x === x && c.y === y);
    return occupant === -1 || occupant === s || !!from;   // op iemand anders: alleen wisselen vanaf het bord
  },
  dropSuspect(s, x, y, from = null) {
    if (this.solved) return false;
    if (from && from.x === x && from.y === y) return false;
    if (!this.canDrop(s, x, y, from)) { this.flash(x, y); Sound.play('error'); return false; }
    const occupant = this.placements.findIndex(c => c && c.x === x && c.y === y);
    this.history.push(this.snap());
    if (occupant !== -1 && occupant !== s) this.placements[occupant] = from;   // van plek wisselen
    this.placements[s] = { x, y };
    this.lastCell = { x, y };
    this.buzz(12);
    Sound.play('place');
    this.sparks(x, y);
    this.questBump('placed');
    const next = this.placements.findIndex(c => !c);
    this.active = next !== -1 ? next : s;
    this.after();
    if (this.isTutorial) { this.tutorialStep++; this.showTutorialStep(); }
    return true;
  },
  liftSuspect(s) {
    if (this.solved || !this.placements[s]) return false;
    this.history.push(this.snap());
    this.placements[s] = null;
    this.active = s;
    this.buzz(8);
    Sound.play('mark');
    this.after();
    return true;
  },

  // ── Swipen tussen de verklaringen ─────────────────────────
  bindDeck() {
    const track = document.getElementById('clue-track');
    if (!track) return;
    let x0 = 0, y0 = 0, on = false;
    track.addEventListener('pointerdown', e => { on = true; x0 = e.clientX; y0 = e.clientY; });
    track.addEventListener('pointerup', e => {
      if (!on) return;
      on = false;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        // van rechts naar links lezen (Arabisch, Urdu): naar rechts vegen is verder
        const rtl = document.documentElement.dir === 'rtl';
        this.stepDeck((dx < 0) !== rtl ? 1 : -1);
      }
    });
    track.addEventListener('pointercancel', () => { on = false; });
    document.getElementById('btn-clue-prev').addEventListener('click', () => this.stepDeck(-1));
    document.getElementById('btn-clue-next').addEventListener('click', () => this.stepDeck(1));
    document.getElementById('btn-clue-all').addEventListener('click', () => this.openAllClues());
    document.getElementById('btn-clue-close').addEventListener('click', () => App.hideModal('clue-modal'));
  },

  bind() {
    this.bindDeck();
    this.bindDrag();
    this.bindFit();
    document.getElementById('btn-accuse-back').addEventListener('click', () => this.cancelAccuse());
    document.getElementById('btn-board-place').addEventListener('click', () => this.setMode('place'));
    document.getElementById('btn-board-mark').addEventListener('click',  () => this.setMode('mark'));
    document.getElementById('btn-board-erase').addEventListener('click', () => this.setMode('erase'));
    // 1.6 (ook in de webdagzaak, die een deel van index.html overneemt: daarom elk element eerst opzoeken)
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('btn-board-cross', () => this.setMode('cross'));
    on('btn-board-zoom', () => this.toggleZoom());
    on('btn-board-help', () => this.openHelp());
    on('btn-help-close', () => this.closeHelp());
    // instelling: rij en kolom automatisch wegstrepen (standaard aan)
    const chkX = document.getElementById('chk-autostrike');
    if (chkX) {
      chkX.checked = this.autoStrikeOn();
      chkX.addEventListener('change', () => { App.storageSet(this.AUTOSTRIKE_KEY, chkX.checked ? '1' : '0'); if (this.puzzle) this.renderCells(); });
    }
    this.bindZoom();
    document.getElementById('btn-board-undo').addEventListener('click',  () => this.undo());
    document.getElementById('btn-board-hint').addEventListener('click',  () => this.hint());
    document.getElementById('btn-board-check').addEventListener('click', () => this.check());
    document.getElementById('btn-board-tutorial-skip').addEventListener('click', () => { this.skipTutorial(); App.navigateTo('menu'); });
    document.getElementById('btn-board-tip-close').addEventListener('click', () => {
      App.storageSet('crimson-board-tip-seen', '1');
      document.getElementById('board-tip').hidden = true;
    });
    // ceremonie overslaan met een tik
    document.getElementById('screen-results').addEventListener('click', () => { if (this.cerTimers.length) this.skipCeremony(); });
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Board };

// ============================================================
// BOARD v2 — plattegrondzaak: plaats de verdachten, vind wie
// alleen was met het slachtoffer. Eén bord per scherm, mobiel.
// ============================================================

const Board = {
  puzzle: null,
  placements: null,   // array per verdachte: {x,y} | null
  marks: null,        // "x,y" -> Set(suspectIndex)
  clueDone: null,     // aanwijzingen die de speler heeft afgevinkt
  history: null,
  hintRefs: null,     // {cells, clues} van de laatste hint
  active: 0,
  mode: 'place',      // place | mark | erase
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
    { suspect: 0, cell: { x: 0, y: 0 }, text: 'Aanwijzing 1: Clara was in de Woonkamer, in een hoek. Drie hoeken zijn bezet door meubels, dus blijft er één over. Tik op het oplichtende vakje.' },
    { suspect: 1, cell: { x: 3, y: 3 }, text: 'Aanwijzing 2: Marcus stond direct naast een plant. Naast de plant is maar één vakje vrij. Tik erop.' },
    { action: 'check', text: 'Iedereen staat op zijn plek. Tik op Controleer.' },
    { action: 'murder', text: 'De spelregel: alleen de moordenaar was in de kamer van het slachtoffer. Marcus staat in de Keuken — kies Marcus.' }
  ],

  startTutorial() {
    const theme = Themes.get('landhuis');
    const suspects = theme.suspects.slice(0, 2);
    const puzzle = FloorPlan.fromLayout({ ...this.TUTORIAL, suspects, theme });
    Object.assign(this, {
      puzzle, theme, difficulty: 'tutorial', seed: 0, isDaily: false, isTutorial: true, tutorialStep: 0, campaignCase: null,
      placements: new Array(2).fill(null), marks: new Map(), clueDone: new Set(), history: [], hintRefs: null,
      active: 0, mode: 'place', hintsUsed: 0, attempts: 0, solved: false, elapsed: 0, focusClue: null, newRank: null, okCount: 0,
      isWeekly: false, weekly: null, newIntro: null, score: null, medalsWon: []
    });
    document.getElementById('board-diff-tag').textContent = '🎓 Oefenzaak';
    document.getElementById('board-casetext').textContent = `${theme.icon} ${puzzle.caseText}`;
    const grid = document.getElementById('board-grid');
    grid.classList.remove('solved');
    grid.dataset.floor = theme.floor;
    document.getElementById('board-tip').hidden = true;
    document.getElementById('board-coach').hidden = false;
    document.getElementById('btn-board-hint').disabled = true;
    this.renderBoard(); this.renderSuspects(); this.renderClues();
    this.showTutorialStep();
    this.startTimer();
    return true;
  },

  showTutorialStep() {
    const step = this.TUTORIAL_STEPS[this.tutorialStep];
    if (!step) return;
    document.getElementById('board-coach-step').textContent = `Stap ${this.tutorialStep + 1} van ${this.TUTORIAL_STEPS.length}`;
    document.getElementById('board-coach-text').textContent = step.text;
    this.hintRefs = step.cell ? { cells: [step.cell], clues: [this.tutorialStep] } : null;
    if (step.suspect !== undefined) this.active = step.suspect;
    this.after(true);
  },

  skipTutorial() {
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

    Object.assign(this, {
      puzzle, theme, difficulty: difficultyId, seed: base, isDaily,
      placements: new Array(puzzle.suspects.length).fill(null),
      marks: new Map(), clueDone: new Set(), history: [], hintRefs: null,
      active: 0, mode: 'place', hintsUsed: 0, attempts: 0, solved: false, elapsed: 0, isTutorial: false, tutorialStep: 0, campaignCase,
      focusClue: null, newRank: null, okCount: 0, isWeekly: !!opts.weekly, weekly: opts.weekly || null, score: null, medalsWon: [],
      dailyDoneBefore: App.storageGet('crimson-board-daily-done') === new Date().toDateString()
    });
    // één "Nieuw!"-uitleg per zaak, voor de eerste soort verklaring die de speler nog niet kent
    this.newIntro = typeof Mentor !== 'undefined' ? Mentor.introFor(puzzle.clues.map(c => c.kind), this.introsSeen()) : null;
    document.getElementById('board-coach').hidden = true;
    document.getElementById('btn-board-hint').disabled = false;

    const diff = DIFFICULTY[difficultyId] || DIFFICULTY.gemiddeld;
    document.getElementById('board-diff-tag').textContent = campaignCase
      ? (campaignCase.chapter === Campaign.ARCHIVE ? `📁 ${campaignCase.title}` : `📖 ${campaignCase.idx + 1}. ${campaignCase.title}`)
      : this.isWeekly ? `🗓️ Week ${this.weekly.week}` : (isDaily ? '📅 ' : '') + diff.label;
    const lead = campaignCase ? campaignCase.story + ' ' : this.isWeekly ? this.weekly.title + '. ' : '';
    document.getElementById('board-casetext').textContent = `${theme.icon} ${lead}${puzzle.caseText}`;
    const grid = document.getElementById('board-grid');
    grid.classList.remove('solved');
    grid.dataset.floor = theme.floor || 'checker';

    const tip = document.getElementById('board-tip');
    tip.hidden = !!App.storageGet('crimson-board-tip-seen');

    this.renderBoard();
    this.renderSuspects();
    this.renderClues();
    this.renderCells();
    this.updateTools();
    this.startTimer();
    return true;
  },

  startTimer() {
    clearInterval(this.timerId);
    this.startTime = Date.now();
    const el = document.getElementById('board-timer');
    const tick = () => {
      this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      el.textContent = this.formatTime(this.elapsed);
    };
    tick();
    this.timerId = setInterval(tick, 1000);
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
              `aria-label="Rij ${y + 1}, kolom ${x + 1}, ${room.name}"></button>`;
    }
    // kamernaam op de onderste rij van de kamer (werkt ook bij L-vormen)
    p.rooms.forEach(room => {
      const maxY = Math.max(...room.list.map(c => c.y));
      const xs = room.list.filter(c => c.y === maxY).map(c => c.x);
      const left = ((Math.min(...xs) + Math.max(...xs) + 1) / 2 / p.cols) * 100;
      const top = ((maxY + 1) / p.rows) * 100;
      html += `<span class="room-label" style="left:${left}%;top:${top}%">${room.name}</span>`;
    });
    grid.innerHTML = html;
    grid.querySelectorAll('.bcell').forEach(c => c.addEventListener('click', () => this.onCell(+c.dataset.x, +c.dataset.y)));
  },

  // ── Verdachtenkiezer ──────────────────────────────────────
  renderSuspects() {
    const wrap = document.getElementById('board-suspects');
    wrap.innerHTML = this.puzzle.suspects.map((s, i) =>
      `<button type="button" class="sus-chip${i === this.active ? ' active' : ''}${this.placements[i] ? ' placed' : ''}" data-s="${i}">
         <span class="sus-ava">${Avatars.suspect(s, i)}</span>
         <span class="sus-name">${s.label}</span>
       </button>`).join('');
    wrap.querySelectorAll('.sus-chip').forEach(b => b.addEventListener('click', () => {
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
      const nl = this.puzzle.furnitureNl[clue.furniture] || clue.furniture;
      const icon = `<span class="bclue-furn">${Avatars.furniture(clue.furniture)}</span>`;
      t = t.includes(nl) ? t.replace(nl, `${nl}${icon}`) : `${t} ${icon}`;
    }
    return t;
  },
  introsSeen() { try { return JSON.parse(App.storageGet('crimson-newclue-seen') || '[]'); } catch (e) { return []; } },
  dismissIntro() {
    if (this.newIntro) {
      const seen = this.introsSeen();
      if (!seen.includes(this.newIntro.id)) seen.push(this.newIntro.id);
      App.storageSet('crimson-newclue-seen', JSON.stringify(seen));
    }
    this.newIntro = null;
    this.renderClues();
  },
  renderClues() {
    const list = document.getElementById('board-clues');
    const refs = this.hintRefs ? new Set(this.hintRefs.clues) : new Set();
    const p = this.puzzle;
    let html = '';
    if (this.newIntro && !this.isTutorial) {
      const t = this.newIntro;
      html += `<div class="newclue" id="newclue"><span class="ribbon ribbon-gold">Nieuw in dit deel</span>
        <div class="newclue-body"><div><h3>${t.title}</h3><p>${t.text}</p></div><span class="newclue-pic">${t.svg}</span></div>
        <button type="button" class="btn btn-dark btn-block" id="btn-newclue-ok">Begrepen</button></div>`;
    }
    html += p.clues.map((clue, i) => {
      const st = FloorPlan.statement(clue, p);
      const state = this.solved ? 'ok' : this.clueState(clue);
      const done = this.clueDone.has(i);
      const color = st.who.length ? p.suspects[st.who[0]].color : 'var(--gold)';
      const name = st.who.length ? p.suspects[st.who[0]].label : Mentor.name;
      const label = state === 'ok' ? '<span class="bclue-state ok">✓ Klopt</span>' : state === 'bad' ? '<span class="bclue-state bad">✗ Klopt niet</span>' : '';
      return `<div class="bclue${done ? ' done' : ''}${refs.has(i) ? ' hint-ref' : ''}${state ? ' ' + state : ''}${this.focusClue === i ? ' active' : ''}" data-clue="${i}" style="--sc:${color}">
        <span class="bclue-num">${i + 1}</span>
        ${this.clueAvatars(clue)}
        <div class="bclue-body"><div class="bclue-head"><span class="bclue-name">${name}</span>${label}</div><p class="bclue-text">${this.clueHtml(clue, i)}</p></div>
        <button type="button" class="bclue-check" data-clue="${i}" aria-label="Verklaring afvinken">${done ? '✓' : ''}</button>
      </div>`;
    }).join('');
    list.innerHTML = html;
    list.querySelectorAll('.bclue').forEach(c => c.addEventListener('click', () => this.focusOnClue(+c.dataset.clue)));
    list.querySelectorAll('.bclue-check').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      const i = +b.dataset.clue;
      this.clueDone.has(i) ? this.clueDone.delete(i) : this.clueDone.add(i);
      this.renderClues();
    }));
    const ok = document.getElementById('btn-newclue-ok');
    if (ok) ok.addEventListener('click', () => this.dismissIntro());
  },

  // ── Aanwijzing aantikken: laat zien waar het over gaat ────
  clearFocus() {
    clearTimeout(this.focusTimer);
    this.focusClue = null;
    document.querySelectorAll('#board-grid .bcell.lit, #board-grid .bcell.lit-furn').forEach(el => el.classList.remove('lit', 'lit-furn'));
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
    });
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

    document.querySelectorAll('#board-grid .bcell').forEach(el => {
      const x = +el.dataset.x, y = +el.dataset.y, k = FloorPlan.key(x, y);
      const furn = p.furniture.get(k), who = byCell.get(k), marked = this.marks.get(k);
      const isVictim = p.victim.x === x && p.victim.y === y;
      let inner = '';
      if (furn) inner += `<span class="bfurn">${Avatars.furniture(furn)}</span>`;
      if (isVictim) inner += `<span class="bvictim">${Avatars.victim()}</span>`;
      if (who !== undefined) inner += `<span class="bsus">${Avatars.suspect(p.suspects[who], who)}</span>`;
      if (marked && marked.size) inner += '<span class="bmarks">' + [...marked].map(i => `<i style="background:${p.suspects[i].color}"></i>`).join('') + '</span>';
      el.innerHTML = inner;
      el.classList.toggle('has-sus', who !== undefined);
      el.classList.toggle('occupied', !!furn || isVictim);
      el.classList.toggle('hinted', hinted.has(k));
      el.classList.toggle('conflict', conflict.has(k));
    });
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
    const snap = () => ({ placements: this.placements.slice(), marks: this.cloneMarks() });

    if (this.mode === 'erase') {
      if (occupant === -1 && !this.marks.has(k)) return;
      this.history.push(snap());
      if (occupant !== -1) this.placements[occupant] = null;
      this.marks.delete(k);
      return this.after();
    }
    if (p.furniture.has(k) || (p.victim.x === x && p.victim.y === y)) return this.peek(x, y);

    if (this.mode === 'mark') {
      this.history.push(snap());
      const set = this.marks.get(k) || new Set();
      set.has(this.active) ? set.delete(this.active) : set.add(this.active);
      set.size ? this.marks.set(k, set) : this.marks.delete(k);
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
  cloneMarks() { const m = new Map(); this.marks.forEach((v, k) => m.set(k, new Set(v))); return m; },

  after(keepHint = false) {
    if (!keepHint) this.hintRefs = null;
    // een aanwijzing die net groen wordt, mag je horen
    const ok = this.puzzle.clues.filter(c => FloorPlan.holds(c, this.placements, this.puzzle) === true).length;
    if (ok > (this.okCount || 0) && !this.solved) Sound.play('clue');
    this.okCount = ok;
    this.renderCells();
    this.renderSuspects();
    this.renderClues();
    this.updateTools();
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
    this.after();
  },

  // ── Lerende hint: legt uit, plaatst nooit ─────────────────
  hint() {
    if (this.solved) return;
    if (this.isTutorial) return this.showTutorialStep();
    const h = FloorPlan.hint(this.puzzle, this.placements);
    this.hintsUsed++;
    this.hintRefs = { cells: h.cells || [], clues: h.clues || [] };
    if (h.suspect !== undefined && h.suspect !== -1) this.active = h.suspect;
    this.after(true);
    document.getElementById('hint-text').textContent = h.text;
    document.getElementById('hint-detail-text').textContent = h.detail || '';
    document.getElementById('hint-detail').hidden = !h.detail;
    App.showModal('hint-modal');
  },

  updateTools() {
    const all = this.placements.every(Boolean);
    const checkBtn = document.getElementById('btn-board-check');
    checkBtn.disabled = !all || this.solved;
    // alles staat en elke aanwijzing klopt: de knop trekt de aandacht
    checkBtn.classList.toggle('ready', all && !this.solved && this.puzzle.clues.every(c => FloorPlan.holds(c, this.placements, this.puzzle) === true));
    document.getElementById('btn-board-undo').disabled = this.history.length === 0;
    ['place', 'mark', 'erase'].forEach(m => document.getElementById('btn-board-' + m).classList.toggle('active', this.mode === m));
  },
  setMode(m) {
    if (this.isTutorial) m = 'place';
    if (m === 'mark' && this.mode !== 'mark' && !App.storageGet('crimson-pencil-tip-seen')) {
      App.storageSet('crimson-pencil-tip-seen', '1');
      App.showToast('✏️', 'Potlood: zet een stipje op vakjes waar iemand zou kúnnen staan. Met Plaats zet je iemand echt neer, met Gum haal je het weer weg.');
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
      App.showToast('❌', `${wrong} ${wrong === 1 ? 'verdachte staat' : 'verdachten staan'} verkeerd. Gebruik een hint als je vastzit.`);
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
      : `Iedereen staat op zijn plek. Wie was alleen met het slachtoffer in ${q.article || 'de'} ${q.name}?`;
    const wrap = document.getElementById('murder-options');
    wrap.innerHTML = p.suspects.map((s, i) =>
      `<button type="button" class="murder-opt accuse-opt" data-s="${i}">
         <span class="accuse-ava">${Avatars.suspect(s, i)}</span><span class="accuse-name">${s.label}</span>
       </button>`).join('');
    wrap.querySelectorAll('.murder-opt').forEach(b => b.addEventListener('click', () => this.answerMurderer(+b.dataset.s, b)));
    const react = document.getElementById('murder-reaction');
    react.hidden = true; react.innerHTML = '';
    App.showModal('murder-modal');
  },

  // De beschuldigde reageert: ontkenning bij de verkeerde, bekentenis bij de juiste.
  answerMurderer(i, btn) {
    const s = this.puzzle.suspects[i];
    const react = document.getElementById('murder-reaction');
    const bubble = (cls, text) => {
      react.hidden = false;
      react.className = `accuse-reaction ${cls}`;
      react.innerHTML = `<span class="accuse-ava-sm">${Avatars.suspect(s, i)}</span><span><b>${s.label}:</b> “${text}”</span>`;
    };
    if (i !== this.puzzle.murderer) {
      this.attempts++;
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 300);
      bubble('wrong', Mentor.reaction(false, this.attempts + i));
      Sound.play('error');
      this.buzz(30);
      return;
    }
    document.querySelectorAll('.murder-opt').forEach(b => { b.disabled = true; });
    btn.classList.add('guilty');
    bubble('right', Mentor.reaction(true, this.attempts + i));
    Sound.play('clue');
    this.buzz(12);
    clearTimeout(this.finishTimer);
    this.finishTimer = setTimeout(() => { App.hideModal('murder-modal'); this.finish(); }, 700);
  },

  medalCtx() {
    const st = this.loadStats();
    const worldsDone = Themes.list().map(t => t.id).filter(id => Campaign.chaptersFor(id).every(ch => Campaign.chapterDone(ch.key)));
    return {
      solved: st.solved || 0, clean: st.clean || 0, streak: App.streak.count || 0, elapsed: this.elapsed,
      partsDone: Campaign.list().filter(ch => Campaign.chapterDone(ch.key)).length, worldsDone,
      threeStars: Campaign.threeStarCount(), archiveCount: Campaign.archiveCount(),
      weekFull: Progress.weekFull(), weekDone: Progress.weekDone(), evidence: Progress.evidenceCount(),
      points: Progress.points(), rankTitle: App.rankFor(st.solved || 0).title
    };
  },

  finish() {
    this.solved = true;
    this.stopTimer();
    document.getElementById('board-grid').classList.add('solved');
    this.updateTools();
    if (this.isTutorial) {
      App.storageSet('crimson-board-tutorial-done', '1');
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
    const after = App.rankFor(solvedAfter);
    this.newRank = after.title !== before.title ? after.title : null;
    this.rankInfo = { before, after, solvedBefore, solvedAfter };
    if (this.campaignCase) {
      Campaign.save(this.campaignCase.chapter, this.campaignCase.idx, Campaign.starsFor(this.hintsUsed, this.attempts));
    }
    if (this.isDaily) {
      App.updateStreak();
      App.storageSet('crimson-board-daily-done', new Date().toDateString());
      App.scheduleReminder();
    }
    // punten, zaak van de week, onderscheidingen
    this.score = Progress.score({
      difficulty: this.difficulty, elapsed: this.elapsed, hintsUsed: this.hintsUsed, attempts: this.attempts,
      isDaily: this.isDaily && !this.dailyDoneBefore, isWeekly: this.isWeekly && !Progress.weekDone(),
      isArchive: !!this.campaignCase && this.campaignCase.chapter === Campaign.ARCHIVE
    });
    Progress.addPoints(this.score.total);
    if (this.isWeekly) Progress.markWeekDone(this.shareText());
    this.medalsWon = Progress.checkMedals(this.medalCtx());
    this.medalsShown = false;
    App.mode = 'board';
    this.showResults();
    App.updateBoardStats();
    App.navigateTo('results');
    App.maybeAskReview();
  },
  // medailles pas tonen als de ceremonie klaar is (of overgeslagen)
  flushMedals() {
    if (this.medalsShown) return;
    this.medalsShown = true;
    (this.medalsWon || []).forEach(m => App.showMedal(m));
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
    $('results-headline').textContent = this.isTutorial ? 'Goed gedaan!' : 'Zaak Opgelost!';
    $('results-verdict').textContent = `${m.label} was alleen met het slachtoffer in ${q.article || 'de'} ${q.name}.`;
    // laatste zaak van een deel: de afsluiting van dat deel
    const chap = this.campaignCase ? Campaign.chapter(this.campaignCase.chapter) : null;
    const finale = chap && this.campaignCase.idx === chap.cases.length - 1 ? chap.outro : null;
    $('results-description').textContent = this.isTutorial
      ? 'Zo werkt elke zaak: plaats iedereen met de verklaringen, en wijs dan aan wie alleen was met het slachtoffer. Tijd voor een echte zaak.'
      : (finale || '');
    const remindBtn = $('btn-remind');
    if (remindBtn) remindBtn.hidden = !(this.isDaily && !this.isTutorial && App.notif() && !App.reminderEnabled());

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
    $('score-total').textContent = `${sc.total} punten`;
    $('score-total').dataset.v = sc.total;
    const ri = this.rankInfo || {};
    const after = ri.after || App.rankFor(this.loadStats().solved || 0);
    const before = ri.before || after;
    const left = after.next ? after.next.at - (ri.solvedAfter || 0) : 0;
    $('results-rank').innerHTML =
      (this.newRank ? `<span class="rank-new">🎖 Nieuwe rang: ${this.newRank}</span>` : `<span class="rank-title">🎖 ${after.title}</span>`) +
      `<span class="rank-next">${after.next ? `Volgende: ${after.next.title} · nog ${left} ${left === 1 ? 'zaak' : 'zaken'}` : 'Hoogste rang bereikt'}</span>` +
      `<span class="rank-bar"><i style="width:${Math.round((this.newRank ? 0 : before.progress) * 100)}%" data-to="${Math.round(after.progress * 100)}"></i></span>`;
    const remark = Mentor.remark({ hintsUsed: this.hintsUsed, attempts: this.attempts, elapsed: this.elapsed, newRank: this.newRank,
                                   rank: before.title, isWeekly: this.isWeekly, stars: st });
    mentor.innerHTML = `<img src="${Mentor.sketch}" alt=""><div><span class="mentor-label">Van Dam merkt op</span><p>“${remark}”</p></div>`;

    // waar iedereen stond
    const solEl = $('results-solution');
    solEl.innerHTML = '<span class="label">Waar iedereen stond</span>';
    p.suspects.forEach((s, i) => {
      const r = FloorPlan.roomOf(p.rooms, p.solution[i].x, p.solution[i].y);
      const row = document.createElement('div');
      row.className = 'results-solution-row';
      row.innerHTML = `<span class="results-solution-ava">${Avatars.suspect(s, i)}</span><b>${s.label}</b>` +
                      `<span class="results-solution-room">${r.article || 'de'} ${r.name}${i === p.murderer ? ' 🔪' : ''}</span>`;
      solEl.appendChild(row);
    });

    // knoppen: volgende zaak, kaart, menu
    $('btn-play-again').textContent = this.isTutorial ? '🗺️ Naar de kaart' : 'Naar het menu';
    $('btn-play-again').dataset.to = this.isTutorial ? 'map' : 'menu';
    const nextBtn = $('btn-next-case'), mapBtn = $('btn-map');
    mapBtn.hidden = !(this.campaignCase && !this.isTutorial);
    if (this.campaignCase && !this.isTutorial) {
      const next = Campaign.next(this.campaignCase.chapter, this.campaignCase.idx);
      nextBtn.hidden = !next;
      nextBtn.textContent = next ? `▶ Volgende zaak: ${next.title}` : '▶ Volgende zaak';
      nextBtn.onclick = next ? () => App.startCampaignCase(next.chapter, next.idx) : null;
    } else if (!this.isTutorial) {
      // vrij spel, dagelijkse zaak of zaak van de week: meteen door kunnen
      nextBtn.hidden = false;
      nextBtn.textContent = `▶ Nog een zaak · ${this.theme.title}`;
      const diff = this.isDaily ? 'gemiddeld' : this.isWeekly ? 'moeilijk' : this.difficulty, themeId = this.theme.id;
      nextBtn.onclick = () => {
        if (Board.start(diff, 0, false, themeId)) App.navigateTo('board');
        else App.showToast('⚠️', 'Kon geen plattegrond genereren, probeer opnieuw.');
      };
    } else { nextBtn.hidden = true; }
    $('stat-time').textContent = this.formatTime(this.elapsed);
    $('stat-difficulty').textContent = (DIFFICULTY[this.difficulty] || DIFFICULTY.gemiddeld).label;
    $('stat-hints').textContent = this.hintsUsed;
    $('stat-attempts').textContent = this.attempts + 1;
    if (this.isTutorial) this.revealAll(); else this.ceremony();
  },

  // ── Ceremonie: stempel → sterren → score telt op → rang. Tik = overslaan. ──
  ceremony() {
    const $ = id => document.getElementById(id);
    const screen = $('screen-results');
    const T = (fn, ms) => this.cerTimers.push(setTimeout(fn, ms));
    const show = el => { if (el) el.classList.remove('pending'); };
    T(() => {
      show($('results-stamp')); screen.classList.add('shake-paper'); this.confetti();
      Sound.play('stamp'); this.buzz(30);
      T(() => screen.classList.remove('shake-paper'), 450);
    }, 80);
    document.querySelectorAll('#results-stars .rstar').forEach((el, i) => T(() => { show(el); if (!el.classList.contains('off')) Sound.play('star'); }, 520 + i * 190));
    const rows = [...document.querySelectorAll('#score-rows .score-row')];
    rows.forEach((r, i) => T(() => { show(r); const b = r.querySelector('b'); this.countUp(b, +b.dataset.v, 260, i === 0 ? '' : '+'); }, 1080 + i * 170));
    const tRows = 1080 + rows.length * 170;
    T(() => { show($('score-total-row')); this.countUp($('score-total'), +$('score-total').dataset.v, 520, '', ' punten'); }, tRows);
    T(() => {
      show($('results-rank'));
      const bar = document.querySelector('#results-rank .rank-bar i');
      if (bar) bar.style.width = bar.dataset.to + '%';
      if (this.newRank) Sound.play('rank');
    }, tRows + 320);
    T(() => { show($('results-mentor')); this.cerTimers = []; this.flushMedals(); }, tRows + 640);
  },
  countUp(el, to, ms, prefix = '', suffix = '') {
    if (!el) return;
    const start = Date.now();
    const id = setInterval(() => {
      const k = Math.min(1, (Date.now() - start) / ms);
      el.textContent = prefix + Math.round(to * k) + suffix;
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
    screen.classList.remove('shake-paper');
    screen.querySelectorAll('.pending').forEach(el => el.classList.remove('pending'));
    document.querySelectorAll('#score-rows .score-row b').forEach((b, i) => { b.textContent = (i === 0 ? '' : '+') + b.dataset.v; });
    const tot = document.getElementById('score-total');
    if (tot && tot.dataset.v) tot.textContent = `${tot.dataset.v} punten`;
    const bar = document.querySelector('#results-rank .rank-bar i');
    if (bar) bar.style.width = bar.dataset.to + '%';
  },
  confetti() {
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

  shareText() {
    const p = this.puzzle;
    const diff = DIFFICULTY[this.difficulty] || DIFFICULTY.gemiddeld;
    const sq = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬜', '⬛', '🟥', '🟧', '🟨'];
    const byCell = new Map(p.solution.map((c, i) => [FloorPlan.key(c.x, c.y), i]));
    const rows = [];
    for (let y = 0; y < p.rows; y++) {
      let line = '';
      for (let x = 0; x < p.cols; x++) {
        const k = FloorPlan.key(x, y);
        if (p.victim.x === x && p.victim.y === y) line += '🩸';
        else if (byCell.has(k)) line += byCell.get(k) === p.murderer ? '🔪' : '👤';
        else line += sq[FloorPlan.roomOf(p.rooms, x, y).id % sq.length];
      }
      rows.push(line);
    }
    const what = this.isWeekly ? ` · Zaak van de week: ${this.weekly.title}`
      : this.campaignCase ? ` · ${this.campaignCase.chapter === Campaign.ARCHIVE ? '' : this.campaignCase.idx + 1 + '. '}${this.campaignCase.title}` : '';
    return [
      `${this.theme.icon} Crimson Ledger · ${this.theme.title}${this.isDaily ? ` · Dag #${App.getDayNumber()}` : ''}${what}`,
      `${diff.icon} ${diff.label} · ⏱ ${this.formatTime(this.elapsed)} · 💡 ${this.hintsUsed} · 🔁 ${this.attempts + 1}${this.score ? ` · 🪙 ${this.score.total} punten` : ''}`,
      '', ...rows, '',
      this.isDaily && App.streak.count > 1 ? `🔥 ${App.streak.count} dagen streak!` : ''
    ].filter(Boolean).join('\n');
  },

  bind() {
    document.getElementById('btn-board-place').addEventListener('click', () => this.setMode('place'));
    document.getElementById('btn-board-mark').addEventListener('click',  () => this.setMode('mark'));
    document.getElementById('btn-board-erase').addEventListener('click', () => this.setMode('erase'));
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

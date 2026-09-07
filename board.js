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
      active: 0, mode: 'place', hintsUsed: 0, attempts: 0, solved: false, elapsed: 0
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
  start(difficultyId, seed, isDaily = false, themeId, campaignCase = null) {
    const theme = Themes.get(themeId);
    let puzzle = null;
    const base = seed || (Date.now() % 1000000);
    for (let i = 0; i < 12 && !puzzle; i++) puzzle = FloorPlan.generate(base + i * 7919, difficultyId, theme);
    if (!puzzle) return false;

    Object.assign(this, {
      puzzle, theme, difficulty: difficultyId, seed: base, isDaily,
      placements: new Array(puzzle.suspects.length).fill(null),
      marks: new Map(), clueDone: new Set(), history: [], hintRefs: null,
      active: 0, mode: 'place', hintsUsed: 0, attempts: 0, solved: false, elapsed: 0, isTutorial: false, tutorialStep: 0, campaignCase
    });
    document.getElementById('board-coach').hidden = true;
    document.getElementById('btn-board-hint').disabled = false;

    const diff = DIFFICULTY[difficultyId] || DIFFICULTY.gemiddeld;
    document.getElementById('board-diff-tag').textContent = campaignCase ? `📖 ${campaignCase.idx + 1}. ${campaignCase.title}` : (isDaily ? '📅 ' : '') + diff.label;
    document.getElementById('board-casetext').textContent = `${theme.icon} ${campaignCase ? campaignCase.story + ' ' : ''}${puzzle.caseText}`;
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

  // ── Aanwijzingskaarten ────────────────────────────────────
  clueAvatars(clue) {
    const s = this.puzzle.suspects;
    const ava = i => `<span class="bclue-ava">${Avatars.suspect(s[i], i)}</span>`;
    if (clue.s !== undefined) return ava(clue.s);
    if (clue.a !== undefined) return `<span class="bclue-pair">${ava(clue.a)}${ava(clue.b)}</span>`;
    return `<span class="bclue-ava bclue-house">🏠</span>`;
  },
  renderClues() {
    const list = document.getElementById('board-clues');
    const refs = this.hintRefs ? new Set(this.hintRefs.clues) : new Set();
    list.innerHTML = this.puzzle.clues.map((clue, i) => {
      const color = clue.s !== undefined ? this.puzzle.suspects[clue.s].color
                  : clue.a !== undefined ? this.puzzle.suspects[clue.a].color : 'var(--border)';
      return `<div class="bclue${this.clueDone.has(i) ? ' done' : ''}${refs.has(i) ? ' hint-ref' : ''}" data-clue="${i}">
        <span class="bclue-bar" style="background:${color}"></span>
        <span class="bclue-num">${i + 1}</span>
        ${this.clueAvatars(clue)}
        <p class="bclue-text">${this.puzzle.clueTexts[i]}</p>
      </div>`;
    }).join('');
    list.querySelectorAll('.bclue').forEach(c => c.addEventListener('click', () => {
      const i = +c.dataset.clue;                       // tikken = afvinken als "verwerkt"
      this.clueDone.has(i) ? this.clueDone.delete(i) : this.clueDone.add(i);
      c.classList.toggle('done', this.clueDone.has(i));
    }));
  },

  // ── Celinhoud ─────────────────────────────────────────────
  renderCells() {
    const p = this.puzzle;
    const byCell = new Map();
    this.placements.forEach((c, i) => { if (c) byCell.set(FloorPlan.key(c.x, c.y), i); });
    const hinted = new Set(this.hintRefs ? this.hintRefs.cells.map(c => FloorPlan.key(c.x, c.y)) : []);

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
    if (p.furniture.has(k) || (p.victim.x === x && p.victim.y === y)) return this.flash(x, y);

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
    const next = this.placements.findIndex(c => !c);
    if (next !== -1) this.active = next;                // door naar de volgende
    this.after();
    if (this.isTutorial) { this.tutorialStep++; this.showTutorialStep(); }
  },

  cloneMarks() { const m = new Map(); this.marks.forEach((v, k) => m.set(k, new Set(v))); return m; },

  after(keepHint = false) {
    if (!keepHint) this.hintRefs = null;
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
    document.getElementById('btn-board-check').disabled = !all || this.solved;
    document.getElementById('btn-board-undo').disabled = this.history.length === 0;
    ['place', 'mark', 'erase'].forEach(m => document.getElementById('btn-board-' + m).classList.toggle('active', this.mode === m));
  },
  setMode(m) { if (this.isTutorial) m = 'place'; this.mode = m; this.updateTools(); },

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
      `<button type="button" class="murder-opt" data-s="${i}">
         <span class="sus-ava">${Avatars.suspect(s, i)}</span><span>${s.label}</span>
       </button>`).join('');
    wrap.querySelectorAll('.murder-opt').forEach(b => b.addEventListener('click', () => this.answerMurderer(+b.dataset.s, b)));
    App.showModal('murder-modal');
  },

  answerMurderer(i, btn) {
    if (i !== this.puzzle.murderer) {
      this.attempts++;
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 300);
      App.showToast('🤔', 'Nee. Kijk op de plattegrond: wie staat er in de kamer van het slachtoffer?');
      return;
    }
    App.hideModal('murder-modal');
    this.finish();
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
    this.saveStats();
    if (this.campaignCase) {
      Campaign.save(this.campaignCase.theme, this.campaignCase.idx, Campaign.starsFor(this.hintsUsed, this.attempts));
    }
    if (this.isDaily) {
      App.updateStreak();
      App.storageSet('crimson-board-daily-done', new Date().toDateString());
    }
    App.mode = 'board';
    this.showResults();
    App.updateBoardStats();
    App.navigateTo('results');
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
    document.getElementById('results-icon').textContent = '✓';
    document.getElementById('results-stamp').style.borderColor = 'var(--success)';
    document.getElementById('results-headline').textContent = this.isTutorial ? 'Goed gedaan!' : 'Zaak Gesloten!';
    document.getElementById('results-verdict').textContent = `${m.label} was alleen met het slachtoffer in ${q.article || 'de'} ${q.name}.`;
    document.getElementById('results-description').textContent = this.isTutorial
      ? 'Zo werkt elke zaak: plaats iedereen met de aanwijzingen, en wijs dan aan wie alleen was met het slachtoffer. Tijd voor een echte zaak.'
      : (this.hintsUsed === 0 ? 'Zonder één hint. ' : '') + (this.theme.outro || 'De moordenaar is gepakt.');

    const solEl = document.getElementById('results-solution');
    solEl.innerHTML = '<span class="label">Waar iedereen stond</span>';
    p.suspects.forEach((s, i) => {
      const r = FloorPlan.roomOf(p.rooms, p.solution[i].x, p.solution[i].y).name;
      const row = document.createElement('div');
      row.className = 'results-solution-row';
      row.innerHTML = `<span class="results-solution-dot" style="background:${s.color}"></span>${s.label} — ${r}${i === p.murderer ? ' 🔪' : ''}`;
      solEl.appendChild(row);
    });
    document.getElementById('btn-play-again').textContent = this.isTutorial ? 'Naar het hoofdmenu' : 'Opnieuw Spelen';
    const starsEl = document.getElementById('results-stars');
    const nextBtn = document.getElementById('btn-next-case');
    if (this.campaignCase && !this.isTutorial) {
      const st = Campaign.starsFor(this.hintsUsed, this.attempts);
      starsEl.hidden = false;
      starsEl.innerHTML = `<span class="stars">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span><span class="stars-label">${st === 3 ? 'Vlekkeloos: geen hint, in één keer.' : st === 2 ? 'Sterk. Zonder hint én in één keer is drie sterren.' : 'Opgelost. Probeer het nog eens zonder hint.'}</span>`;
      const next = Campaign.next(this.campaignCase.theme, this.campaignCase.idx);
      nextBtn.hidden = !next;
      nextBtn.textContent = next ? `▶ Volgende zaak: ${next.title}` : '▶ Volgende zaak';
      nextBtn.onclick = next ? () => App.startCampaignCase(next.theme, next.idx) : null;
    } else { starsEl.hidden = true; nextBtn.hidden = true; }
    document.getElementById('stat-time').textContent = this.formatTime(this.elapsed);
    document.getElementById('stat-difficulty').textContent = (DIFFICULTY[this.difficulty] || DIFFICULTY.gemiddeld).label;
    document.getElementById('stat-hints').textContent = this.hintsUsed;
    document.getElementById('stat-attempts').textContent = this.attempts + 1;
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
    return [
      `${this.theme.icon} Crimson Ledger · ${this.theme.title}${this.isDaily ? ` · Dag #${App.getDayNumber()}` : ''}${this.campaignCase ? ` · ${this.campaignCase.idx + 1}. ${this.campaignCase.title}` : ''}`,
      `${diff.icon} ${diff.label} · ⏱ ${this.formatTime(this.elapsed)} · 💡 ${this.hintsUsed} · 🔁 ${this.attempts + 1}`,
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
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Board };

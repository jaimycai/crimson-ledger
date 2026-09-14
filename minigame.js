// ============================================================
// MINIGAME — tussenstops op de wereldkaart, zoals de oefenrondes
// op het pad van Duolingo. Kort (drie rondes), op een plattegrond
// van dezelfde wereld, met punten als beloning.
//   liar   — "Wie liegt?": iedereen staat op zijn plek, drie
//            verklaringen, één ervan is gelogen. Tik de leugenaar.
//   memory — "Vluchtige blik": kijk vier tellen naar de plattegrond,
//            dan verdwijnt iedereen. Waar stond …?
// ============================================================

const MiniGame = {
  ROUNDS: 3, LOOK_MS: 4000,
  POINTS_ROUND: 50, POINTS_FIRST: 150,
  key: null, kind: 'liar', round: 0, score: 0, puzzle: null, cur: null, locked: false, used: [],
  NAMES: { liar: '🎯 Wie liegt?', memory: '👁️ Vluchtige blik' },

  // kleine, vaste toevalsgenerator (zelfde als in de plattegrond-generator)
  rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; },
  roomOf(p, c) { return FloorPlan.roomOf(p.rooms, c.x, c.y); },

  // ── Ronde-inhoud, zonder DOM (zo is het te testen) ─────────
  puzzleFor(key, round, day = 0) {
    const ch = Campaign.chapter(key);
    if (!ch) return null;
    const theme = Themes.get(ch.theme);
    const seed = 700000 + ch.part * 1000 + Themes.list().findIndex(t => t.id === ch.theme) * 100 + round * 7 + day * 13;
    for (let i = 0; i < 12; i++) { const p = FloorPlan.generate(seed + i * 7919, 'makkelijk', theme); if (p) return p; }
    return null;
  },
  // Wie liegt?: twee ware verklaringen uit de zaak, één gelogen kamer. Precies één is fout.
  liarRound(p, r) {
    const n = p.suspects.length;
    const liar = Math.floor(r() * n);
    const real = this.roomOf(p, p.solution[liar]);
    const others = p.rooms.filter(rm => rm.id !== real.id);
    const lie = { kind: 'room', s: liar, room: others[Math.floor(r() * others.length)].id };
    const truths = p.clues.filter(c => c.kind !== 'empty-room' && FloorPlan.holds(c, p.solution, p) === true && !FloorPlan.statement(c, p).who.includes(liar));
    const pick = [];
    while (pick.length < 2 && truths.length) pick.push(truths.splice(Math.floor(r() * truths.length), 1)[0]);
    while (pick.length < 2) { const s = (liar + 1 + pick.length) % n; pick.push({ kind: 'room', s, room: this.roomOf(p, p.solution[s]).id }); }
    const cards = [...pick.map(c => ({ clue: c, lie: false })), { clue: lie, lie: true }];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    return { cards, answer: cards.findIndex(c => c.lie) };
  },
  // Vluchtige blik: één verdachte, drie kamers om uit te kiezen (waarvan één de echte)
  memoryRound(p, r, used = []) {
    const n = p.suspects.length;
    let s = Math.floor(r() * n);
    for (let k = 0; k < n && used.includes(s); k++) s = (s + 1) % n;
    const real = this.roomOf(p, p.solution[s]);
    const others = p.rooms.filter(rm => rm.id !== real.id);
    for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
    const options = [real, ...others.slice(0, 2)];
    for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
    return { s, options, answer: options.findIndex(o => o.id === real.id) };
  },
  // punten voor een potje: 50 per goede ronde, 150 extra bij de eerste keer alles goed
  pointsFor(score, first) { return score * this.POINTS_ROUND + (first && score === this.ROUNDS ? this.POINTS_FIRST : 0); },

  // ── Plattegrond tekenen (zelfde opmaak als het bord, zonder knoppen) ──
  gridHtml(p, placements, showSuspects = true) {
    const roomAt = (x, y) => FloorPlan.roomOf(p.rooms, x, y);
    const byCell = new Map();
    (placements || []).forEach((c, i) => { if (c) byCell.set(FloorPlan.key(c.x, c.y), i); });
    let html = '';
    for (let y = 0; y < p.rows; y++) for (let x = 0; x < p.cols; x++) {
      const room = roomAt(x, y), k = FloorPlan.key(x, y), edges = [];
      if (!roomAt(x, y - 1) || roomAt(x, y - 1).id !== room.id) edges.push('wt');
      if (!roomAt(x, y + 1) || roomAt(x, y + 1).id !== room.id) edges.push('wb');
      if (!roomAt(x - 1, y) || roomAt(x - 1, y).id !== room.id) edges.push('wl');
      if (!roomAt(x + 1, y) || roomAt(x + 1, y).id !== room.id) edges.push('wr');
      let inner = '';
      const furn = p.furniture.get(k), who = byCell.get(k);
      if (furn) inner += `<span class="bfurn">${Avatars.furniture(furn)}</span>`;
      if (p.victim.x === x && p.victim.y === y) inner += `<span class="bvictim">${Avatars.victim()}</span>`;
      if (showSuspects && who !== undefined) inner += `<span class="bsus">${Avatars.suspect(p.suspects[who], who)}</span><span class="bname" style="--sc:${p.suspects[who].color}">${Themes.shortName(p.suspects[who].label)}</span>`;
      html += `<span class="bcell${(x + y) % 2 === 0 ? ' dark' : ''} ${edges.join(' ')}${who !== undefined ? ' has-sus' : ''}" data-x="${x}" data-y="${y}" data-room="${room.id}" style="--room:${room.color}">${inner}</span>`;
    }
    p.rooms.forEach(room => {
      const maxY = Math.max(...room.list.map(c => c.y));
      const xs = room.list.filter(c => c.y === maxY).map(c => c.x);
      const left = ((Math.min(...xs) + Math.max(...xs) + 1) / 2 / p.cols) * 100;
      html += `<span class="room-label" style="left:${left}%;top:${((maxY + 1) / p.rows) * 100}%">${room.name}</span>`;
    });
    return html;
  },
  renderGrid(showSuspects) {
    const g = document.getElementById('mini-grid'), p = this.puzzle;
    g.style.setProperty('--cols', p.cols); g.style.setProperty('--rows', p.rows);
    g.dataset.floor = p.theme.floor || 'checker';
    g.innerHTML = this.gridHtml(p, p.solution, showSuspects);
  },
  ava(i) { return `<span class="bclue-ava">${Avatars.suspect(this.puzzle.suspects[i], i)}</span>`; },
  speakers(clue) {
    const st = FloorPlan.statement(clue, this.puzzle), s = this.puzzle.suspects;
    if (!st.who.length) return { html: `<span class="bclue-ava bclue-mentor"><img src="${Mentor.img}" alt=""></span>`, name: Mentor.name, text: st.text };
    if (st.who.length === 2) return { html: `<span class="bclue-pair">${this.ava(st.who[0])}${this.ava(st.who[1])}</span>`, name: s[st.who[0]].label, text: st.text };
    return { html: this.ava(st.who[0]), name: s[st.who[0]].label, text: st.text };
  },

  // ── Spelverloop ────────────────────────────────────────────
  start(key) {
    const ch = Campaign.chapter(key);
    if (!ch) return false;
    const day = typeof Progress !== 'undefined' && Progress.dayNumber ? Progress.dayNumber() : 0;
    Object.assign(this, { key, kind: Campaign.miniKind(key), round: 0, score: 0, used: [], locked: false, puzzle: null, cur: null, day });
    this.r = this.rng(4242 + day * 13 + ch.part * 97 + key.length);
    document.getElementById('mini-title').textContent = this.NAMES[this.kind];
    document.getElementById('mini-sub').textContent = `${Themes.get(ch.theme).icon} ${ch.title}`;
    document.getElementById('mini-result').hidden = true;
    document.getElementById('mini-body').hidden = false;
    clearTimeout(this.lookTimer); clearInterval(this.lookTick);
    this.nextRound();
    return true;
  },
  renderDots() {
    document.getElementById('mini-dots').innerHTML = Array.from({ length: this.ROUNDS }, (_, i) =>
      `<i class="mdot${i < this.round - 1 ? (this.results[i] ? ' ok' : ' bad') : i === this.round - 1 ? ' on' : ''}"></i>`).join('');
  },
  nextRound() {
    this.round++;
    this.locked = false;
    if (this.round > this.ROUNDS) return this.finish();
    this.results = this.results && this.round > 1 ? this.results : [];
    this.puzzle = this.puzzleFor(this.key, this.round, this.day);
    if (!this.puzzle) return this.finish();
    this.renderDots();
    if (this.kind === 'liar') this.renderLiar(); else this.renderMemory();
  },
  renderLiar() {
    this.cur = this.liarRound(this.puzzle, this.r);
    this.renderGrid(true);
    document.getElementById('mini-q').textContent = `Ronde ${this.round}: iedereen staat op zijn plek. Wie liegt?`;
    const opts = document.getElementById('mini-options');
    opts.innerHTML = this.cur.cards.map((c, i) => {
      const sp = this.speakers(c.clue);
      return `<button type="button" class="dclue mini-card" data-i="${i}">${sp.html}<span class="bclue-body"><span class="bclue-name">${sp.name}</span><span class="bclue-text">${sp.text}</span></span></button>`;
    }).join('');
    opts.querySelectorAll('.mini-card').forEach(b => b.addEventListener('click', () => this.answer(+b.dataset.i)));
  },
  renderMemory() {
    this.cur = this.memoryRound(this.puzzle, this.r, this.used);
    this.used.push(this.cur.s);
    this.renderGrid(true);
    const s = this.puzzle.suspects[this.cur.s];
    document.getElementById('mini-q').textContent = `Ronde ${this.round}: kijk goed waar iedereen staat…`;
    const opts = document.getElementById('mini-options');
    let left = Math.round(this.LOOK_MS / 1000);
    opts.innerHTML = `<span class="mini-look" id="mini-look">👁️ Onthoud het… <b>${left}</b></span>`;
    clearInterval(this.lookTick);
    this.lookTick = setInterval(() => { left--; const b = document.querySelector('#mini-look b'); if (b) b.textContent = Math.max(0, left); if (left <= 0) clearInterval(this.lookTick); }, 1000);
    clearTimeout(this.lookTimer);
    this.lookTimer = setTimeout(() => {
      this.renderGrid(false);
      document.getElementById('mini-q').innerHTML = `Waar stond <b>${s.label}</b>?`;
      opts.innerHTML = `<div class="mini-ask">${this.ava(this.cur.s)}<span>${s.label}</span></div>` +
        `<div class="mini-rooms">${this.cur.options.map((o, i) => `<button type="button" class="mini-room" data-i="${i}">${o.name}</button>`).join('')}</div>`;
      opts.querySelectorAll('.mini-room').forEach(b => b.addEventListener('click', () => this.answer(+b.dataset.i)));
    }, this.LOOK_MS);
  },
  answer(i) {
    if (this.locked) return;
    this.locked = true;
    const right = i === this.cur.answer;
    this.results[this.round - 1] = right;
    if (right) this.score++;
    const sel = this.kind === 'liar' ? '.mini-card' : '.mini-room';
    document.querySelectorAll(sel).forEach((b, j) => {
      b.disabled = true;
      if (j === this.cur.answer) b.classList.add('right');
      else if (j === i) b.classList.add('wrong');
    });
    if (this.kind === 'memory') {
      this.renderGrid(true);   // laat zien waar hij echt stond
      const c = this.puzzle.solution[this.cur.s];
      const cell = document.querySelector(`#mini-grid .bcell[data-x="${c.x}"][data-y="${c.y}"]`);
      if (cell) cell.classList.add(right ? 'good' : 'bad');
    } else {
      const liar = this.cur.cards[this.cur.answer].clue.s;
      const c = this.puzzle.solution[liar];
      const cell = document.querySelector(`#mini-grid .bcell[data-x="${c.x}"][data-y="${c.y}"]`);
      if (cell) cell.classList.add('lit');
    }
    document.getElementById('mini-q').textContent = right ? `Goed gezien! +${this.POINTS_ROUND} punten` : (this.kind === 'liar' ? `Nee: ${this.puzzle.suspects[this.cur.cards[this.cur.answer].clue.s].label} loog.` : `Nee, daar stond ${this.puzzle.suspects[this.cur.s].label}.`);
    Sound.play(right ? 'clue' : 'error');
    if (typeof Board !== 'undefined' && Board.buzz) Board.buzz(right ? 12 : 30);
    this.renderDots();
    setTimeout(() => this.nextRound(), right ? 1000 : 1700);
  },
  finish() {
    clearTimeout(this.lookTimer); clearInterval(this.lookTick);
    const first = Campaign.saveMini(this.key, this.score);
    const pts = this.pointsFor(this.score, first);
    if (pts) Progress.addPoints(pts);
    const perfect = this.score === this.ROUNDS;
    Sound.play(perfect ? 'win' : 'clue');
    const res = document.getElementById('mini-result');
    const ch = Campaign.chapter(this.key);
    res.innerHTML = `<div class="mini-result-card">
      <span class="mini-result-score">${'★'.repeat(this.score)}${'☆'.repeat(this.ROUNDS - this.score)}</span>
      <h2>${perfect ? 'Scherp gezien!' : this.score ? 'Bijna allemaal' : 'Volgende keer beter'}</h2>
      <p>${this.score} van de ${this.ROUNDS} goed${pts ? ` · <b>+${pts} punten</b>` : ''}${first && perfect ? ' (eerste keer alles goed: bonus!)' : ''}</p>
      <div class="mini-result-actions">
        <button type="button" class="btn btn-secondary btn-block" id="btn-mini-again">🔁 Nog een keer</button>
        <button type="button" class="btn btn-primary btn-block" id="btn-mini-map">🗺️ Terug naar de kaart</button>
      </div></div>`;
    res.hidden = false;
    document.getElementById('mini-body').hidden = true;
    document.getElementById('btn-mini-again').addEventListener('click', () => this.start(this.key));
    document.getElementById('btn-mini-map').addEventListener('click', () => App.openMap(ch.theme));
    if (typeof App !== 'undefined' && App.updateBoardStats) App.updateBoardStats();
  },
  bind() {
    const back = document.getElementById('btn-mini-back');
    if (back) back.addEventListener('click', () => { clearTimeout(this.lookTimer); clearInterval(this.lookTick); const ch = Campaign.chapter(this.key); App.openMap(ch ? ch.theme : undefined); });
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { MiniGame };

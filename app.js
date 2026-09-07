// ============================================================
// CRIMSON LEDGER — App Controller
// Navigatie, logic grid gameplay, hints, timer, dagelijkse zaak
// ============================================================

const App = {
  // ── Status ─────────────────────────────────────────────────
  currentScreen: 'splash',
  selectedDifficulty: 'gemiddeld',
  isDaily: false,
  mode: 'grid',
  selectedTheme: 'landhuis',
  isTutorial: false,
  tutorialStep: 0,

  // Zaak
  caseConfig: null,
  solution: null,
  clues: null,

  // Spelstatus
  playerGrid: null,
  hintsUsed: 0,
  attempts: 0,
  solved: false,

  // Timer
  timer: { seconds: 0, interval: null, running: false },

  // Streak
  streak: { count: 0, lastDate: null },

  // ══════════════════════════════════════════════════════════
  //  INITIALISATIE
  // ══════════════════════════════════════════════════════════
  init() {
    this.loadStreak();
    this.bindNavigation();
    this.bindGameControls();
    this.bindDifficultySelector();
    this.bindBoard();
    this.bindCampaign();
    this.bindSound();
    this.bindSettings();
    this.registerServiceWorker();
    this.updateDailyDate();
    this.updateStreakDisplay();
  },

  // ══════════════════════════════════════════════════════════
  //  PLATTEGRONDZAAK
  // ══════════════════════════════════════════════════════════
  bindBoard() {
    if (!document.getElementById('btn-board-start')) return;
    Board.bind();
    this.selectedTheme = this.storageGet('crimson-theme') || 'landhuis';
    this.renderThemePicker();
    const launch = (seed, daily) => {
      const diff = daily ? 'gemiddeld' : (this.selectedDifficulty || 'gemiddeld');
      const themeId = daily ? Themes.forDay(this.getDayNumber()).id : this.selectedTheme;
      if (Board.start(diff, seed, daily, themeId)) this.navigateTo('board');
      else this.showToast('⚠️', 'Kon geen plattegrond genereren, probeer opnieuw.');
    };
    document.getElementById('btn-board-start').addEventListener('click', () => launch(0, false));
    document.getElementById('btn-board-daily').addEventListener('click', () => launch(this.getDailySeed() * 3 + 777, true));
    document.getElementById('btn-board-back').addEventListener('click', () => { Board.stopTimer(); this.navigateTo('menu'); });
    this.updateBoardStats();
  },

  // ══════════════════════════════════════════════════════════
  //  CAMPAGNE
  // ══════════════════════════════════════════════════════════
  bindCampaign() {
    if (!document.getElementById('btn-campaign')) return;
    document.getElementById('btn-campaign').addEventListener('click', () => { this.renderCampaign(); this.navigateTo('campaign'); });
    document.getElementById('btn-campaign-back').addEventListener('click', () => this.navigateTo('menu'));
    this.updateCampaignProgress();
  },

  updateCampaignProgress() {
    const el = document.getElementById('campaign-progress');
    if (el) el.textContent = `${Campaign.doneCount()} van ${Campaign.total()} zaken opgelost`;
  },

  renderCampaign() {
    const list = document.getElementById('campaign-list');
    document.getElementById('campaign-total').textContent = `${Campaign.doneCount()}/${Campaign.total()}`;
    list.innerHTML = Campaign.list().map(ch => {
      const th = Themes.get(ch.theme);
      const themeOpen = this.themeUnlocked(th);
      const cases = ch.cases.map((c, idx) => {
        const stars = Campaign.stars(ch.theme, idx);
        const open = themeOpen && Campaign.isUnlocked(ch.theme, idx);
        const d = DIFFICULTY[c.difficulty] || {};
        return `<button type="button" class="case-card${open ? '' : ' locked'}${stars ? ' done' : ''}" data-theme="${ch.theme}" data-idx="${idx}" ${open ? '' : 'disabled'}>
          <span class="case-num">${open ? idx + 1 : '🔒'}</span>
          <span class="case-body"><span class="case-title">${c.title}</span><span class="case-meta">${d.icon || ''} ${d.label || ''}</span></span>
          <span class="case-stars">${stars ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : ''}</span>
        </button>`;
      }).join('');
      const lockNote = themeOpen ? '' : `<p class="chapter-lock">🔒 Los eerst ${th.unlock} zaken op (vrij spel of dagelijks) om dit hoofdstuk te openen.</p>`;
      return `<section class="chapter"><h3 class="chapter-title">${th.icon} ${th.title}</h3><p class="chapter-tag">${th.tagline}</p>${lockNote}<div class="case-grid">${cases}</div></section>`;
    }).join('');
    list.querySelectorAll('.case-card:not(.locked)').forEach(b => b.addEventListener('click', () => this.startCampaignCase(b.dataset.theme, +b.dataset.idx)));
  },

  startCampaignCase(themeId, idx) {
    const c = Campaign.chapter(themeId).cases[idx];
    const cc = { theme: themeId, idx, ...c };
    if (Board.start(c.difficulty, c.seed, false, themeId, cc)) this.navigateTo('board');
    else this.showToast('⚠️', 'Deze zaak kon niet geladen worden.');
  },

  // ══════════════════════════════════════════════════════════
  //  GELUID + PWA
  // ══════════════════════════════════════════════════════════
  bindSound() {
    const btn = document.getElementById('btn-sound');
    if (!btn) return;
    Sound.init(this.storageGet('crimson-sound'));
    const label = () => { btn.textContent = Sound.enabled ? '🔊 Geluid aan' : '🔇 Geluid uit'; };
    label();
    btn.addEventListener('click', () => { Sound.toggle(); this.storageSet('crimson-sound', Sound.enabled ? '1' : '0'); label(); Sound.play('ui'); });
  },

  bindSettings() {
    const btn = document.getElementById('btn-settings');
    if (!btn) return;
    btn.addEventListener('click', () => { this.resetArmed = false; document.getElementById('btn-reset-progress').textContent = 'Wissen'; this.showModal('settings-modal'); });
    document.getElementById('btn-close-settings').addEventListener('click', () => this.hideModal('settings-modal'));
    // twee tikken: eerst bevestigen, dan wissen (geen confirm(): werkt niet in elke WebView)
    document.getElementById('btn-reset-progress').addEventListener('click', e => {
      if (!this.resetArmed) { this.resetArmed = true; e.target.textContent = 'Zeker? Tik nogmaals'; return; }
      this.resetProgress();
      e.target.textContent = 'Gewist';
      this.resetArmed = false;
    });
  },

  resetProgress() {
    try {
      Object.keys(localStorage).filter(k => k.startsWith('crimson-')).forEach(k => localStorage.removeItem(k));
    } catch (e) { /* privémodus */ }
    this.streak = { count: 0, lastDate: null };
    this.selectedTheme = 'landhuis';
    this.updateStreakDisplay();
    this.updateBoardStats();
    this.showToast('🧹', 'Alle voortgang is gewist.');
  },

  registerServiceWorker() {
    try {
      if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) return;
      const secure = location.protocol === 'https:' || location.hostname === 'localhost';
      if (secure && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    } catch (e) { /* niet beschikbaar */ }
  },

  themeUnlocked(t) { return (t.unlock || 0) <= (Board.loadStats().solved || 0); },

  renderThemePicker() {
    const wrap = document.getElementById('theme-picker');
    if (!wrap) return;
    const solved = Board.loadStats().solved || 0;
    if (!this.themeUnlocked(Themes.get(this.selectedTheme))) this.selectedTheme = Themes.list().find(t => this.themeUnlocked(t)).id;
    wrap.innerHTML = Themes.list().map(t => {
      const locked = !this.themeUnlocked(t);
      const need = (t.unlock || 0) - solved;
      return `
      <button type="button" class="theme-card${t.id === this.selectedTheme ? ' active' : ''}${locked ? ' locked' : ''}" data-theme="${t.id}" title="${t.tagline}">
        <span class="theme-swatches">${t.rooms.slice(0, 4).map(r => `<i style="background:${r.color}"></i>`).join('')}</span>
        <span class="theme-icon">${locked ? '🔒' : t.icon}</span>
        <span class="theme-title">${t.title}</span>
        ${locked ? `<span class="theme-lock">nog ${need} ${need === 1 ? 'zaak' : 'zaken'}</span>` : ''}
      </button>`; }).join('');
    wrap.querySelectorAll('.theme-card').forEach(b => b.addEventListener('click', () => {
      const t = Themes.get(b.dataset.theme);
      if (!this.themeUnlocked(t)) {
        const need = (t.unlock || 0) - (Board.loadStats().solved || 0);
        return this.showToast('🔒', `Los nog ${need} ${need === 1 ? 'zaak' : 'zaken'} op om ${t.title} te openen. De dagelijkse zaak telt mee.`);
      }
      this.selectedTheme = t.id;
      this.storageSet('crimson-theme', this.selectedTheme);
      this.renderThemePicker();
    }));
  },

  updateBoardStats() {
    this.renderThemePicker();
    this.updateCampaignProgress();
    const el = document.getElementById('board-stats');
    const dateEl = document.getElementById('board-daily-date');
    if (!el) return;
    const st = Board.loadStats();
    const done = this.storageGet('crimson-board-daily-done') === new Date().toDateString();
    if (dateEl) dateEl.textContent = done ? 'Vandaag opgelost ✓' : `Vandaag: ${Themes.forDay(this.getDayNumber()).title}`;
    if (!st.solved) { el.textContent = 'Nog geen zaak opgelost. Vandaag de eerste?'; return; }
    const best = Object.entries(st.best || {}).map(([d, sec]) => `${(DIFFICULTY[d] || {}).label || d} ${Board.formatTime(sec)}`).join(' · ');
    el.textContent = `${st.solved} ${st.solved === 1 ? 'zaak' : 'zaken'} opgelost${st.clean ? ` · ${st.clean} zonder hint` : ''}${best ? ` · beste: ${best}` : ''}`;
  },

  // ══════════════════════════════════════════════════════════
  //  NAVIGATIE
  // ══════════════════════════════════════════════════════════
  navigateTo(screenId) {
    const current = document.querySelector('.screen.active');
    const next = document.getElementById(`screen-${screenId}`);
    if (!next || current === next) return;

    current.classList.add('fade-out');
    setTimeout(() => {
      current.classList.remove('active', 'fade-out');
      next.classList.add('active');
      this.currentScreen = screenId;
    }, 250);
  },

  bindNavigation() {
    // Splash → Menu
    document.getElementById('btn-splash-start').addEventListener('click', () => {
      if (this.storageGet('crimson-board-tutorial-done')) {
        this.navigateTo('menu');
      } else {
        Board.startTutorial();   // eerste keer: meteen spelen, niet lezen
        this.navigateTo('board');
      }
    });

    // Oefenzaak opnieuw (bord) en klassieke raster-oefenzaak
    document.getElementById('btn-tutorial').addEventListener('click', () => {
      Board.startTutorial();
      this.navigateTo('board');
    });
    document.getElementById('btn-grid-tutorial').addEventListener('click', () => {
      this.startTutorial();
    });
    document.getElementById('btn-tutorial-skip').addEventListener('click', () => {
      this.endTutorial();
      this.stopTimer();
      this.navigateTo('menu');
    });

    // Menu → Dagelijkse zaak
    document.getElementById('btn-daily').addEventListener('click', () => {
      this.isTutorial = false;
      this.isDaily = true;
      this.setupCase('gemiddeld', this.getDailySeed());
      this.navigateTo('intro');
    });

    // Menu → Vrij spel
    document.getElementById('btn-freeplay').addEventListener('click', () => {
      this.isTutorial = false;
      this.isDaily = false;
      this.setupCase(this.selectedDifficulty);
      this.navigateTo('intro');
    });

    // Intro → Game
    document.getElementById('btn-start-case').addEventListener('click', () => {
      this.startGame();
      this.navigateTo('game');
    });

    // Terug-knoppen
    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.navigateTo('menu');
    });
    document.getElementById('btn-back-menu2').addEventListener('click', () => {
      this.stopTimer();
      if (this.isTutorial) this.endTutorial();
      this.navigateTo('menu');
    });

    // Hoe werkt het
    document.getElementById('btn-how').addEventListener('click', () => {
      this.showModal('how-modal');
    });
    document.getElementById('btn-close-how').addEventListener('click', () => {
      this.hideModal('how-modal');
    });

    // Hint modal
    document.getElementById('btn-close-hint').addEventListener('click', () => {
      this.hideModal('hint-modal');
    });

    // Opnieuw spelen
    document.getElementById('btn-play-again').addEventListener('click', () => {
      if (this.isTutorial) this.endTutorial();
      this.navigateTo('menu');
    });

    // Deel resultaat
    document.getElementById('btn-share').addEventListener('click', () => {
      this.shareResult();
    });
  },

  // ══════════════════════════════════════════════════════════
  //  MOEILIJKHEID
  // ══════════════════════════════════════════════════════════
  bindDifficultySelector() {
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDifficulty = btn.dataset.difficulty;
      });
    });
  },

  // ══════════════════════════════════════════════════════════
  //  ZAAK OPZETTEN
  // ══════════════════════════════════════════════════════════
  setupCase(difficultyId, seed) {
    this.caseConfig = buildCase(difficultyId);
    const gen = new PuzzleGenerator(
      this.caseConfig.numCategories,
      this.caseConfig.numItems,
      difficultyId
    );
    const result = gen.generate(seed);
    this.solution = result.solution;
    this.clues = result.clues;

    // Genereer aanwijzingstekst
    this.clues.forEach(clue => {
      clue.text = ClueFormatter.format(clue, this.caseConfig.categories);
    });

    // Vul intro-scherm
    this.populateIntro();
  },

  populateIntro() {
    const theme = this.caseConfig.theme;
    document.getElementById('intro-label').textContent =
      `Zaak — ${theme.title} · ${this.caseConfig.difficulty.label}`;
    document.getElementById('intro-title').textContent = theme.title;

    const textEl = document.getElementById('intro-text');
    textEl.innerHTML = '';
    theme.intro.long.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      textEl.appendChild(p);
    });

    // Verdachtenchips
    const suspectsEl = document.getElementById('intro-suspects');
    suspectsEl.innerHTML = '';
    const suspectCat = this.caseConfig.categories.find(c => c.type === 'suspect');
    if (suspectCat) {
      suspectCat.items.forEach(item => {
        const chip = document.createElement('span');
        chip.className = 'intro-suspect-chip';
        chip.innerHTML = `<span class="intro-suspect-dot" style="background:${item.color}"></span>${item.label}`;
        suspectsEl.appendChild(chip);
      });
    }
  },

  // ══════════════════════════════════════════════════════════
  //  SPEL STARTEN
  // ══════════════════════════════════════════════════════════
  startGame() {
    this.playerGrid = new LogicGrid(
      this.caseConfig.numCategories,
      this.caseConfig.numItems
    );
    this.hintsUsed = 0;
    this.attempts = 0;
    this.solved = false;

    // Update topbar
    const theme = this.caseConfig.theme;
    document.getElementById('game-title').textContent =
      this.isTutorial && theme.subtitle ? theme.subtitle : theme.title;
    document.getElementById('game-diff-tag').textContent = this.caseConfig.difficulty.label;
    this.updateHintButton();

    // Reset timer
    this.timer.seconds = 0;
    this.updateTimerDisplay();
    this.startTimer();

    // Render
    this.renderGrid();
    this.renderClues();
    this.updateCheckButton();

    document.body.classList.toggle('tutorial-mode', this.isTutorial);
    document.getElementById('tutorial-coach').hidden = !this.isTutorial;

    // Eerste keer: korte uitleg tonen (niet tijdens de oefenzaak)
    if (!this.isTutorial && !this.storageGet('crimson-seen-how')) {
      this.storageSet('crimson-seen-how', '1');
      this.showModal('how-modal');
    }
  },

  // ══════════════════════════════════════════════════════════
  //  OEFENZAAK — begeleide tutorial
  // ══════════════════════════════════════════════════════════
  startTutorial() {
    this.isTutorial = true;
    this.isDaily = false;
    this.tutorialStep = 0;
    this.caseConfig = buildCase('tutorial');
    this.solution = TUTORIAL_CASE.solution;
    this.clues = TUTORIAL_CASE.clues.map(clue => ({
      ...clue,
      text: ClueFormatter.format(clue, this.caseConfig.categories)
    }));
    this.storageSet('crimson-seen-how', '1'); // de oefenzaak vervangt de uitleg
    this.startGame();
    this.showTutorialStep();
    this.navigateTo('game');
  },

  endTutorial() {
    this.isTutorial = false;
    this.storageSet('crimson-tutorial-done', '1');
    document.body.classList.remove('tutorial-mode');
    document.getElementById('tutorial-coach').hidden = true;
  },

  showTutorialStep() {
    const steps = TUTORIAL_CASE.steps;
    const step = steps[this.tutorialStep];
    if (!step) return;

    document.getElementById('tutorial-coach-step').textContent =
      `Stap ${this.tutorialStep + 1} van ${steps.length}`;
    document.getElementById('tutorial-coach-text').textContent = step.text;

    // Markeer de cel en de aanwijzing van deze stap
    document.querySelectorAll('.grid-cell.hint-highlight').forEach(c => c.classList.remove('hint-highlight'));
    document.querySelectorAll('.clue-item').forEach(c => c.classList.remove('clue-active'));
    if (step.cell) {
      const { catI, catJ, itemI, itemJ } = step.cell;
      const cell = this.findCell(catI, catJ, itemI, itemJ);
      if (cell) cell.classList.add('hint-highlight');
    }
    if (step.clue !== undefined) {
      const clueEl = document.querySelectorAll('.clue-item')[step.clue];
      if (clueEl) clueEl.classList.add('clue-active');
    }
    this.updateCheckButton();
  },

  /** Verwerk een tik tijdens de oefenzaak. Geeft true terug als de tik is toegestaan. */
  tutorialAllowsClick(ri, ci, ii, ij) {
    const step = TUTORIAL_CASE.steps[this.tutorialStep];
    if (!step || !step.cell) return false;
    const c = step.cell;
    const same = (c.catI === ri && c.catJ === ci && c.itemI === ii && c.itemJ === ij)
              || (c.catI === ci && c.catJ === ri && c.itemI === ij && c.itemJ === ii);
    if (!same) this.showToast('👆', 'Tik op de gemarkeerde cel.');
    return same;
  },

  tutorialAfterClick(newState) {
    const step = TUTORIAL_CASE.steps[this.tutorialStep];
    const wanted = step.mark === 'v' ? CELL_CONFIRMED : CELL_ELIMINATED;
    if (newState === wanted) {
      this.tutorialStep++;
      this.showTutorialStep();
    }
  },

  // ══════════════════════════════════════════════════════════
  //  DEDUCTIERASTER RENDEREN
  // ══════════════════════════════════════════════════════════
  // Inhoud van een cel: bij ✓ verschijnt het portret van het rij-item
  // (de persoon stapt het vakje in), bij ✗ alleen het kruis.
  // Let op: de tekstinhoud blijft exact '✓' / '✗' / '' voor de tests.
  cellInner(state, rowCat, i) {
    if (state === CELL_CONFIRMED) {
      const cat = this.caseConfig.categories[rowCat];
      return `<span class="cell-portrait">${Avatars.tile(cat.type, cat.items[i], i)}</span>` +
             `<span class="cell-mark cell-mark-v">✓</span>`;
    }
    if (state === CELL_ELIMINATED) {
      return `<span class="cell-mark cell-mark-x">✗</span>`;
    }
    return '';
  },

  // Kruisdraad: markeer rij + kolom en de bijbehorende portretkoppen
  setCrosshair(cell) {
    this.clearCrosshair();
    if (!cell) return;
    const { ri, ci, ii, ij } = cell.dataset;
    document.querySelectorAll(`.grid-cell[data-ri="${ri}"][data-ii="${ii}"]`)
      .forEach(c => c.classList.add('cross-row'));
    document.querySelectorAll(`.grid-cell[data-ci="${ci}"][data-ij="${ij}"]`)
      .forEach(c => c.classList.add('cross-col'));
    document.querySelectorAll(`.row-label[data-hcat="${ri}"][data-hitem="${ii}"], .item-header[data-hcat="${ci}"][data-hitem="${ij}"]`)
      .forEach(h => h.classList.add('hdr-active'));
    cell.classList.add('cross-focus');
  },

  clearCrosshair() {
    document.querySelectorAll('.cross-row, .cross-col, .cross-focus')
      .forEach(c => c.classList.remove('cross-row', 'cross-col', 'cross-focus'));
    document.querySelectorAll('.hdr-active').forEach(h => h.classList.remove('hdr-active'));
  },

  renderGrid() {
    const cats = this.caseConfig.categories;
    const N = this.caseConfig.numItems;
    const numCats = this.caseConfig.numCategories;

    // Voor 3 categorieën (0, 1, 2):
    // Kolommen: cat1-items, separator, cat2-items (als numCats > 2)
    // Rijen: cat0-items, separator, cat2-items in rijen met cat1-kolommen

    const colCats = []; // Categorieën langs de bovenkant
    for (let c = 1; c < numCats; c++) colCats.push(c);

    const rowSections = [{ cat: 0, label: cats[0].name }];
    if (numCats > 2) {
      // Onderste secties: cat2 × cat1
      for (let c = numCats - 1; c >= 2; c--) {
        rowSections.push({ cat: c, label: cats[c].name });
      }
    }

    let html = `<table class="deduction-table grid-n${N}">`;

    // ── Koprij 1: categorie-namen ──
    html += '<thead><tr><td class="corner"></td><td class="corner"></td>';
    colCats.forEach((cc, idx) => {
      html += `<th colspan="${N}" class="cat-header">${cats[cc].name}</th>`;
      if (idx < colCats.length - 1) html += '<td class="sep-col"></td>';
    });
    html += '</tr>';

    // ── Koprij 2: item-namen ──
    html += '<tr><td class="corner"></td><td class="corner"></td>';
    colCats.forEach((cc, idx) => {
      for (let j = 0; j < N; j++) {
        const hIt = cats[cc].items[j];
        html += `<th class="item-header" data-hcat="${cc}" data-hitem="${j}">` +
                `<span class="hdr-tile">${Avatars.tile(cats[cc].type, hIt, j)}</span>` +
                `<span class="hdr-label"><span>${hIt.label}</span></span></th>`;
      }
      if (idx < colCats.length - 1) html += '<td class="sep-col"></td>';
    });
    html += '</tr></thead><tbody>';

    // ── Rij-secties ──
    rowSections.forEach((section, sIdx) => {
      const rowCat = section.cat;

      for (let i = 0; i < N; i++) {
        html += '<tr>';

        // Categorie-label (alleen bij eerste rij van sectie)
        if (i === 0) {
          html += `<td class="cat-row-label" rowspan="${N}">${section.label}</td>`;
        }

        // Item-label
        const rIt = cats[rowCat].items[i];
        html += `<td class="row-label" data-hcat="${rowCat}" data-hitem="${i}">` +
                `<span class="row-label-inner"><span class="hdr-label">${rIt.label}</span>` +
                `<span class="hdr-tile">${Avatars.tile(cats[rowCat].type, rIt, i)}</span></span></td>`;

        // Cellen per kolom-categorie
        colCats.forEach((colCat, cIdx) => {
          // Bepaal welke subgrid dit is
          // Voor sectie 0 (rowCat=0): cat0 × colCat
          // Voor sectie 1 (rowCat=2): cat2 × cat1
          // Maar alleen de relevante kolom-categorieën tonen

          // Als rowCat === colCat: geen subgrid (skip)
          if (rowCat === colCat) {
            // Geen deelraster voor een categorie tegen zichzelf: één leeg blok
            html += `<td class="blank-block" colspan="${N}"></td>`;
          } else {
            for (let j = 0; j < N; j++) {
              const state = this.playerGrid.get(rowCat, colCat, i, j);
              const cls = state === CELL_CONFIRMED ? 'confirmed' : state === CELL_ELIMINATED ? 'eliminated' : '';
              const inner = this.cellInner(state, rowCat, i);
              html += `<td class="grid-cell ${cls}" data-ri="${rowCat}" data-ci="${colCat}" data-ii="${i}" data-ij="${j}">${inner}</td>`;
            }
          }

          if (cIdx < colCats.length - 1) html += '<td class="sep-col"></td>';
        });

        html += '</tr>';
      }

      // Separator rij tussen secties
      if (sIdx < rowSections.length - 1) {
        const totalCols = 2 + colCats.length * N + (colCats.length - 1);
        html += `<tr class="sep-row"><td colspan="${totalCols}"></td></tr>`;
      }
    });

    html += '</tbody></table>';
    document.getElementById('grid-wrapper').innerHTML = html;

    // Bind click handlers
    document.querySelectorAll('.grid-cell[data-ri]').forEach(cell => {
      cell.addEventListener('click', () => this.onCellClick(cell));
      cell.addEventListener('pointerenter', () => this.setCrosshair(cell));
    });
    const wrap = document.getElementById('grid-wrapper');
    if (wrap && !wrap.dataset.crossBound) {
      wrap.dataset.crossBound = '1';
      wrap.addEventListener('pointerleave', () => this.clearCrosshair());
    }
  },

  // ══════════════════════════════════════════════════════════
  //  CEL KLIK — wissel: leeg → ✗ → ✓ → leeg
  // ══════════════════════════════════════════════════════════
  onCellClick(cellEl) {
    if (this.solved) return;

    const ri = parseInt(cellEl.dataset.ri);
    const ci = parseInt(cellEl.dataset.ci);
    const ii = parseInt(cellEl.dataset.ii);
    const ij = parseInt(cellEl.dataset.ij);

    if (this.isTutorial && !this.tutorialAllowsClick(ri, ci, ii, ij)) return;

    const current = this.playerGrid.get(ri, ci, ii, ij);
    let next;

    if (current === CELL_EMPTY) {
      next = CELL_ELIMINATED;
    } else if (current === CELL_ELIMINATED) {
      next = CELL_CONFIRMED;
    } else {
      next = CELL_EMPTY;
    }

    this.playerGrid.set(ri, ci, ii, ij, next);

    // Update cel visueel (zonder volledige re-render)
    cellEl.innerHTML = this.cellInner(next, ri, ii);
    cellEl.className = 'grid-cell'; // wist ook hint-highlight/error
    if (next === CELL_CONFIRMED) {
      cellEl.classList.add('cell-pop');
      setTimeout(() => cellEl.classList.remove('cell-pop'), 320);
    }
    if (next === CELL_CONFIRMED) cellEl.classList.add('confirmed');
    if (next === CELL_ELIMINATED) cellEl.classList.add('eliminated');

    // Re-add data attributes
    cellEl.dataset.ri = ri;
    cellEl.dataset.ci = ci;
    cellEl.dataset.ii = ii;
    cellEl.dataset.ij = ij;

    this.updateCheckButton();
    if (this.isTutorial) this.tutorialAfterClick(next);
  },

  // ══════════════════════════════════════════════════════════
  //  AANWIJZINGEN RENDEREN
  // ══════════════════════════════════════════════════════════
  renderClues() {
    const list = document.getElementById('clue-list');
    list.innerHTML = '';
    this.clues.forEach((clue, idx) => {
      const li = document.createElement('li');
      li.className = 'clue-item';
      li.textContent = clue.text;
      li.addEventListener('click', () => {
        // Highlight de gerelateerde clue
        document.querySelectorAll('.clue-item').forEach(c => c.classList.remove('clue-active'));
        li.classList.add('clue-active');
      });
      list.appendChild(li);
    });
  },

  // ══════════════════════════════════════════════════════════
  //  CONTROLEER ANTWOORD
  // ══════════════════════════════════════════════════════════
  bindGameControls() {
    document.getElementById('btn-check').addEventListener('click', () => {
      this.checkSolution();
    });
    document.getElementById('btn-hint').addEventListener('click', () => {
      this.showHint();
    });
    document.getElementById('btn-reset').addEventListener('click', () => {
      this.resetGrid();
    });
  },

  updateCheckButton() {
    // Enable "Controleer" als er minstens numItems bevestigde cellen zijn
    const N = this.caseConfig.numItems;
    let confirmedCount = 0;
    for (let i = 0; i < this.caseConfig.numCategories; i++) {
      for (let j = i + 1; j < this.caseConfig.numCategories; j++) {
        const g = this.playerGrid.cells[`${i}-${j}`];
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            if (g[r][c] === CELL_CONFIRMED) confirmedCount++;
          }
        }
      }
    }
    // Minimaal numItems bevestigingen per subgrid nodig
    const minNeeded = this.caseConfig.numItems;
    let enabled = confirmedCount >= minNeeded;
    if (this.isTutorial) {
      const step = TUTORIAL_CASE.steps[this.tutorialStep];
      enabled = enabled && !!step && !step.cell; // pas bij de laatste stap
    }
    document.getElementById('btn-check').disabled = !enabled;
  },

  checkSolution() {
    this.attempts++;
    const N = this.caseConfig.numItems;
    const numCats = this.caseConfig.numCategories;
    let allCorrect = true;
    let missing = 0; // juiste ✓'s die nog ontbreken
    const errorCells = [];
    const correctCells = [];

    // Bouw oplossings-lookup
    const solutionLookup = {};
    for (let ci = 0; ci < numCats; ci++) {
      for (let cj = ci + 1; cj < numCats; cj++) {
        solutionLookup[`${ci}-${cj}`] = {};
        for (const group of this.solution) {
          solutionLookup[`${ci}-${cj}`][group[ci]] = group[cj];
        }
      }
    }

    // Controleer elke bevestigde cel
    for (let ci = 0; ci < numCats; ci++) {
      for (let cj = ci + 1; cj < numCats; cj++) {
        const g = this.playerGrid.cells[`${ci}-${cj}`];
        const sol = solutionLookup[`${ci}-${cj}`];

        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            if (g[r][c] === CELL_CONFIRMED) {
              if (sol[r] === c) {
                correctCells.push({ ri: ci, ci: cj, ii: r, ij: c });
              } else {
                allCorrect = false;
                errorCells.push({ ri: ci, ci: cj, ii: r, ij: c });
              }
            }
          }

          // Check of de juiste cel bevestigd is
          const correctCol = sol[r];
          if (g[r][correctCol] !== CELL_CONFIRMED) {
            allCorrect = false;
            missing++;
          }
        }
      }
    }

    if (allCorrect) {
      this.onSolved();
    } else {
      // Toon fouten
      this.highlightCells(errorCells, 'error');
      this.highlightCells(correctCells, 'correct');
      if (errorCells.length === 0) {
        this.showToast('🕵️', `Alles wat je hebt gemarkeerd klopt, maar de zaak is nog niet rond: nog ${missing} ✓ te gaan.`);
      } else {
        this.showToast('❌', `Niet helemaal juist: ${errorCells.length} ✓ klopt niet. Kijk naar de rode cellen.`);
      }

      // Verwijder highlights na 2 seconden
      setTimeout(() => {
        document.querySelectorAll('.grid-cell.error, .grid-cell.correct').forEach(cell => {
          cell.classList.remove('error', 'correct');
        });
      }, 2000);
    }
  },

  highlightCells(cells, className) {
    cells.forEach(({ ri, ci, ii, ij }) => {
      const cell = this.findCell(ri, ci, ii, ij);
      if (cell) cell.classList.add(className);
    });
  },

  /** Zoek de DOM-cel voor een categoriepaar, in beide richtingen */
  findCell(catI, catJ, itemI, itemJ) {
    return document.querySelector(
      `.grid-cell[data-ri="${catI}"][data-ci="${catJ}"][data-ii="${itemI}"][data-ij="${itemJ}"]`
    ) || document.querySelector(
      `.grid-cell[data-ri="${catJ}"][data-ci="${catI}"][data-ii="${itemJ}"][data-ij="${itemI}"]`
    );
  },

  onSolved() {
    this.solved = true;
    this.stopTimer();

    // Update streak als dagelijks
    if (this.isDaily) {
      this.updateStreak();
    }
    if (this.isTutorial) {
      this.storageSet('crimson-tutorial-done', '1');
    }

    this.showToast('🎉', 'Zaak opgelost!');
    setTimeout(() => {
      this.showResults(true);
      this.navigateTo('results');
    }, 1200);
  },

  // ══════════════════════════════════════════════════════════
  //  HINT
  // ══════════════════════════════════════════════════════════
  showHint() {
    const hint = HintEngine.getHint(
      this.playerGrid,
      this.clues,
      this.caseConfig.categories
    );

    if (!hint) {
      this.showToast('🤔', 'Geen hints beschikbaar. Probeer het raster te controleren.');
      return;
    }

    this.hintsUsed++;
    this.updateHintButton();

    // Toon hint modal
    document.getElementById('hint-text').textContent = hint.text;
    document.getElementById('hint-detail-text').textContent = hint.detail;
    document.getElementById('hint-detail').open = hint.level === 0; // fout: uitleg direct open
    this.showModal('hint-modal');

    // Markeer de aanwijzing waar de hint naar verwijst
    document.querySelectorAll('.clue-item').forEach(c => c.classList.remove('clue-active'));
    if (hint.clueIndex !== undefined) {
      const clueEl = document.querySelectorAll('.clue-item')[hint.clueIndex];
      if (clueEl) {
        clueEl.classList.add('clue-active');
        if (clueEl.scrollIntoView) clueEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    // Highlight relevante cellen
    if (hint.cells) {
      document.querySelectorAll('.grid-cell.hint-highlight').forEach(c =>
        c.classList.remove('hint-highlight')
      );
      hint.cells.forEach(({ catI, itemI, catJ, itemJ, value }) => {
        const cell = this.findCell(catI, catJ, itemI, itemJ);
        if (!cell) return;
        cell.classList.add('hint-highlight');
        if (value === CELL_EMPTY) cell.classList.add('error'); // foute markering
      });
    }
  },

  updateHintButton() {
    document.getElementById('btn-hint').textContent =
      this.hintsUsed ? `💡 Hint · ${this.hintsUsed}` : '💡 Hint';
  },

  // ══════════════════════════════════════════════════════════
  //  RESET GRID
  // ══════════════════════════════════════════════════════════
  resetGrid() {
    this.playerGrid = new LogicGrid(
      this.caseConfig.numCategories,
      this.caseConfig.numItems
    );
    this.renderGrid();
    this.updateCheckButton();
    this.showToast('↺', 'Raster gereset');
  },

  // ══════════════════════════════════════════════════════════
  //  RESULTATEN
  // ══════════════════════════════════════════════════════════
  showResults(isCorrect) {
    this.mode = 'grid';
    const outro = isCorrect ? this.caseConfig.theme.outro.correct : this.caseConfig.theme.outro.incorrect;

    document.getElementById('results-icon').textContent = isCorrect ? '✓' : '✗';
    document.getElementById('results-stamp').style.borderColor =
      isCorrect ? 'var(--success)' : 'var(--error)';
    document.getElementById('results-headline').textContent = outro.headline;
    document.getElementById('results-verdict').textContent = outro.sub;
    document.getElementById('results-description').textContent = outro.text;

    // Oplossing tonen
    const solEl = document.getElementById('results-solution');
    solEl.innerHTML = '<span class="label">De Oplossing</span>';
    const cats = this.caseConfig.categories;
    this.solution.forEach(group => {
      const row = document.createElement('div');
      row.className = 'results-solution-row';
      const suspectCat = cats[0];
      const color = suspectCat.items[group[0]].color || 'var(--accent)';
      row.innerHTML = `<span class="results-solution-dot" style="background:${color}"></span>`;
      const parts = group.map((itemIdx, catIdx) => cats[catIdx].items[itemIdx].label);
      row.innerHTML += parts.join(' — ');
      solEl.appendChild(row);
    });

    document.getElementById('btn-play-again').textContent =
      this.isTutorial ? 'Naar het hoofdmenu' : 'Opnieuw Spelen';

    // Stats
    document.getElementById('stat-time').textContent = this.formatTime(this.timer.seconds);
    document.getElementById('stat-difficulty').textContent = this.caseConfig.difficulty.label;
    document.getElementById('stat-hints').textContent = this.hintsUsed;
    document.getElementById('stat-attempts').textContent = this.attempts;
  },

  // ══════════════════════════════════════════════════════════
  //  DEEL RESULTAAT
  // ══════════════════════════════════════════════════════════
  shareResult() {
    const diff = this.caseConfig ? this.caseConfig.difficulty : { icon: '', label: '' };
    const dayStr = this.isDaily ? ` Dag #${this.getDayNumber()}` : '';
    const text = this.mode === 'board' ? Board.shareText() : [
      `🔍 Crimson Ledger${dayStr}`,
      `${diff.icon} ${diff.label} · ⏱ ${this.formatTime(this.timer.seconds)} · 💡 ${this.hintsUsed} hints`,
      ``,
      this.generateEmojiGrid(),
      ``,
      this.isDaily && this.streak.count > 1 ? `🔥 ${this.streak.count} dagen streak!` : '',
    ].filter(Boolean).join('\n');

    const viaShare = () => navigator.share
      ? navigator.share({ text }).catch(() => {})
      : Promise.reject(new Error('no share'));
    const viaClipboard = () => navigator.clipboard
      ? navigator.clipboard.writeText(text).then(() => this.showToast('📋', 'Resultaat gekopieerd naar klembord!'))
      : Promise.reject(new Error('no clipboard'));

    viaClipboard()
      .catch(viaShare)
      .catch(() => this.showToast('⚠️', 'Delen wordt niet ondersteund in deze browser.'));
  },

  generateEmojiGrid() {
    const N = this.caseConfig.numItems;
    const numCats = this.caseConfig.numCategories;
    let emoji = '';

    // Bouw oplossings-lookup
    const solLookup = {};
    for (let ci = 0; ci < numCats; ci++) {
      for (let cj = ci + 1; cj < numCats; cj++) {
        solLookup[`${ci}-${cj}`] = {};
        for (const group of this.solution) {
          solLookup[`${ci}-${cj}`][group[ci]] = group[cj];
        }
      }
    }

    // Eerste subgrid als emoji
    const g = this.playerGrid.cells[`0-1`];
    const sol = solLookup[`0-1`];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (g[r][c] === CELL_CONFIRMED) {
          emoji += sol[r] === c ? '🟩' : '🟥';
        } else if (g[r][c] === CELL_ELIMINATED) {
          emoji += '⬛';
        } else {
          emoji += '⬜';
        }
      }
      emoji += '\n';
    }

    return emoji.trim();
  },

  // ══════════════════════════════════════════════════════════
  //  DAGELIJKSE ZAAK & STREAK
  // ══════════════════════════════════════════════════════════
  getDailySeed() {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  },

  getDayNumber() {
    // Dagen sinds 1 jan 2026
    const start = new Date(2026, 0, 1);
    const now = new Date();
    return Math.floor((now - start) / 86400000) + 1;
  },

  updateDailyDate() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('daily-date').textContent =
      now.toLocaleDateString('nl-NL', options);
  },

  storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* privémodus: negeren */ }
  },

  loadStreak() {
    try {
      const saved = this.storageGet('crimson-streak');
      if (saved) this.streak = JSON.parse(saved);
    } catch (e) { /* ignore */ }
  },

  updateStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (this.streak.lastDate === today) return; // Al gespeeld

    if (this.streak.lastDate === yesterday) {
      this.streak.count++;
    } else {
      this.streak.count = 1;
    }
    this.streak.lastDate = today;

    this.storageSet('crimson-streak', JSON.stringify(this.streak));
    this.updateStreakDisplay();
  },

  updateStreakDisplay() {
    document.getElementById('streak-count').textContent = this.streak.count;
  },

  // ══════════════════════════════════════════════════════════
  //  TIMER
  // ══════════════════════════════════════════════════════════
  startTimer() {
    if (this.timer.running) return;
    this.timer.running = true;
    this.timer.interval = setInterval(() => {
      this.timer.seconds++;
      this.updateTimerDisplay();
    }, 1000);
  },

  stopTimer() {
    this.timer.running = false;
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
      this.timer.interval = null;
    }
  },

  updateTimerDisplay() {
    document.getElementById('game-timer').textContent =
      this.formatTime(this.timer.seconds);
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  // ══════════════════════════════════════════════════════════
  //  UI HULPMIDDELEN
  // ══════════════════════════════════════════════════════════
  showModal(id) { document.getElementById(id).classList.add('active'); },
  hideModal(id) { document.getElementById(id).classList.remove('active'); },

  showToast(icon, text) {
    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast-text').textContent = text;
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};


// ── Opstarten ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());

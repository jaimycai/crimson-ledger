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
    this.bootSplash();
    this.loadStreak();
    this.bindNavigation();
    this.bindGameControls();
    this.bindDifficultySelector();
    this.bindBoard();
    this.bindCampaign();
    this.bindHome();
    this.bindSound();
    this.bindSettings();
    this.registerServiceWorker();
    this.updateDailyDate();
    this.updateStreakDisplay();
    this.renderHome();
    this.scheduleReminder();
  },

  // ══════════════════════════════════════════════════════════
  //  OPSTART: laadbalk op het startscherm, dan de knop; het native
  //  laadscherm (zelfde beeld) gaat pas weg als de webversie er staat.
  // ══════════════════════════════════════════════════════════
  bootSplash() {
    const screen = document.getElementById('screen-splash'), bar = document.querySelector('#splash-load i');
    if (!screen || !bar) return;
    const set = pct => { bar.style.width = pct + '%'; };
    set(30);
    const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready.catch(() => {}) : Promise.resolve();
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(r => window.addEventListener('load', r, { once: true }));
    fonts.then(() => set(70));
    loaded.then(() => set(85));
    const done = () => {
      if (screen.classList.contains('loaded')) return;
      set(100);
      const btn = document.getElementById('btn-splash-start');
      if (btn && this.storageGet('crimson-board-tutorial-done')) btn.textContent = 'Verder';
      screen.classList.add('loaded');
      this.hideNativeSplash();
    };
    // minstens 0,9 s te zien, hooguit 2,5 s wachten (fonts of load die niet komen)
    const minWait = new Promise(r => setTimeout(r, 900));
    Promise.race([Promise.all([fonts, loaded, minWait]), new Promise(r => setTimeout(r, 2500))]).then(done, done);
  },
  // Eén keer vragen om een beoordeling (eigen ReviewPlugin in ios/App/App, SKStoreReviewController),
  // pas na vijf opgeloste zaken en niet meteen: de speler is dan net klaar met de ceremonie.
  maybeAskReview() {
    try {
      const C = window.Capacitor;
      const P = C && ((C.Plugins && C.Plugins.InAppReview) || (typeof C.registerPlugin === 'function' && C.registerPlugin('InAppReview')));
      if (!P || !C.isNativePlatform || !C.isNativePlatform() || this.storageGet('crimson-review-asked')) return;
      if ((Board.loadStats().solved || 0) < 5) return;
      this.storageSet('crimson-review-asked', '1');
      setTimeout(() => { P.requestReview().catch(() => {}); }, 3500);
    } catch (e) { /* niet beschikbaar */ }
  },
  hideNativeSplash() {
    try {
      const P = window.Capacitor && window.Capacitor.Plugins;
      if (P && P.SplashScreen) P.SplashScreen.hide({ fadeOutDuration: 250 }).catch(() => {});
    } catch (e) { /* web */ }
  },

  // ══════════════════════════════════════════════════════════
  //  PLATTEGRONDZAAK
  // ══════════════════════════════════════════════════════════
  bindBoard() {
    if (!document.getElementById('btn-board-start')) return;
    Board.bind();
    this.selectedTheme = this.storageGet('crimson-theme') || 'landhuis';
    this.renderThemePicker();
    const launch = (seed, daily, themeId) => {
      const diff = daily ? 'gemiddeld' : (this.selectedDifficulty || 'gemiddeld');
      if (Board.start(diff, seed, daily, themeId || this.selectedTheme)) this.navigateTo('board');
      else this.showToast('⚠️', 'Kon geen plattegrond genereren, probeer opnieuw.');
    };
    document.getElementById('btn-board-start').addEventListener('click', () => launch(0, false));
    document.getElementById('btn-board-daily').addEventListener('click', () => {
      const done = this.storageGet('crimson-board-daily-done') === new Date().toDateString();
      launch(done ? 0 : this.getDailySeed() * 3 + 777, !done, Themes.forDay(this.getDayNumber()).id);
    });
    document.getElementById('btn-board-back').addEventListener('click', () => { Board.stopTimer(); this.navigateTo('menu'); });
    this.updateBoardStats();
  },

  // ══════════════════════════════════════════════════════════
  //  CAMPAGNE: WERELDKAART, BRIEFING VAN VAN DAM, NIEUW DEEL
  // ══════════════════════════════════════════════════════════
  mapWorld: 'landhuis',
  mapCurrent: null,
  partThen: null,
  bindCampaign() {
    if (!document.getElementById('btn-campaign')) return;
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('btn-campaign', () => { const c = this.nextCampaignCase(); this.openMap(c ? c.theme : (this.storageGet('crimson-last-world') || 'landhuis')); });
    on('btn-campaign-back', () => this.navigateTo('menu'));
    on('btn-map-play', () => this.playCurrent());
    on('btn-briefing-go', () => { this.hideModal('briefing-modal'); Board.startTimer(); Board.showIntro(); });
    on('btn-part-go', () => { this.hideModal('part-modal'); const f = this.partThen; this.partThen = null; if (f) f(); });
    document.getElementById('map-pop').addEventListener('click', e => { if (e.target.id === 'map-pop') this.closeNode(); });
    const scroll = document.getElementById('map-scroll');
    scroll.addEventListener('scroll', () => {
      if (this.spyPending) return;
      this.spyPending = true;
      (window.requestAnimationFrame || setTimeout)(() => { this.spyPending = false; this.mapSpy(); });
    }, { passive: true });
    this.updateCampaignProgress();
  },
  nextCampaignCase() { return Campaign.nextOverall(t => this.themeUnlocked(Themes.get(t)), this.storageGet('crimson-last-world')); },
  caseLabel(c) {
    if (!c) return 'Alles opgelost';
    if (c.chapter === Campaign.ARCHIVE) return `Archief · ${c.title}`;
    return `${Campaign.chapter(c.chapter).title.split(' · ')[0]} · Zaak ${c.idx + 1}`;
  },
  updateCampaignProgress() {
    const el = document.getElementById('campaign-progress');
    if (!el) return;
    el.textContent = `${Campaign.doneCount()} van ${Campaign.total()} zaken opgelost`;
    const c = this.nextCampaignCase();
    const nx = document.getElementById('campaign-next'), ic = document.getElementById('campaign-icon');
    if (nx) nx.textContent = this.caseLabel(c);
    if (ic) ic.textContent = c ? Themes.get(c.theme).icon : '📖';
  },

  openMap(themeId) {
    if (themeId) this.mapWorld = Themes.get(themeId).id;
    this.renderMap();
    this.navigateTo('campaign');
    setTimeout(() => this.scrollToCurrent(), 320);   // pas als het scherm zichtbaar is heeft de scrollbak een hoogte
  },
  MAP_X: [50, 80, 50, 20],   // slingerpad: midden, rechts, midden, links
  // Alles op één doorlopend pad: per wereld een banner, wegwijzers per deel en 24 knopen; daarna het archief.
  mapLayout(W = 393) {
    const BH = Math.round(W * 200 / 393) + 16;   // banner schaalt mee met de breedte
    const solved = Board.loadStats().solved || 0;
    const sections = [], nodes = [];
    let y = 0, k = 0;
    Themes.list().forEach(th => {
      const themeOpen = this.themeUnlocked(th);
      const sec = { theme: th.id, th, open: themeOpen, need: Math.max(0, (th.unlock || 0) - solved), top: y, items: [],
                    stars: Campaign.worldStars(th.id), total: Campaign.worldTotal(th.id), done: Campaign.worldDone(th.id) };
      y += BH;   // banner
      let num = 0;
      Campaign.chaptersFor(th.id).forEach(ch => {
        const open = Campaign.chapterOpen(ch.key, themeOpen);
        sec.items.push({ type: 'sign', title: ch.title, open, done: Campaign.chapterDone(ch.key), y: y + 10 });
        y += 88;
        ch.cases.forEach((c, idx) => {
          num++;
          const stars = Campaign.stars(ch.key, idx);
          const unlocked = open && Campaign.isUnlocked(ch.key, idx);
          const it = { type: 'node', theme: th.id, chapter: ch.key, idx, num, title: c.title, story: c.story, difficulty: c.difficulty, stars,
                       state: stars ? 'done' : unlocked ? 'open' : 'locked', x: this.MAP_X[k % this.MAP_X.length], y };
          sec.items.push(it); nodes.push(it); k++; y += 96;
        });
      });
      y += 24;
      sec.height = y - sec.top;
      sections.push(sec);
    });
    const archOpen = Campaign.chapterOpen(Campaign.ARCHIVE);
    const arch = { theme: 'archief', th: null, open: archOpen, need: 0, top: y, items: [], archive: true };
    y += 8;
    arch.items.push({ type: 'sign', title: '📁 Het archief · eindeloos', open: archOpen, done: false, y: y + 10 });
    y += 88;
    Campaign.archiveList(2).forEach(c => {
      const it = { type: 'node', theme: c.theme, chapter: Campaign.ARCHIVE, idx: c.idx, num: c.title, title: c.title, story: c.story, difficulty: c.difficulty,
                   stars: Campaign.stars(Campaign.ARCHIVE, c.idx), state: c.state, archive: true, x: this.MAP_X[k % this.MAP_X.length], y };
      arch.items.push(it); nodes.push(it); k++; y += 96;
    });
    y += 40;
    arch.height = y - arch.top;
    sections.push(arch);
    return { sections, nodes, height: y };
  },
  renderMap() {
    const screen = document.getElementById('screen-campaign');
    if (!screen) return;
    const scroll = document.getElementById('map-scroll'), canvas = document.getElementById('map-canvas');
    const W = canvas.clientWidth || 393;
    const L = this.mapLayout(W);
    this.mapSections = L.sections;
    const current = L.nodes.find(n => n.state === 'open') || null;
    this.mapCurrent = current;
    const allStars = Campaign.list().reduce((n, ch) => n + ch.cases.reduce((m, _, i) => m + Campaign.stars(ch.key, i), 0), 0);
    document.getElementById('campaign-total').textContent = `★ ${allStars}/${Campaign.total() * 3}`;
    // wereldkiezer: springt naar de banner van die wereld
    document.getElementById('world-tabs').innerHTML = Themes.list().map(t => {
      const sec = L.sections.find(s => s.theme === t.id);
      return `<button type="button" class="world-tab" data-theme="${t.id}">${t.icon} ${t.short}${sec.need > 0 ? `<small>nog ${sec.need} ${sec.need === 1 ? 'zaak' : 'zaken'}</small>` : ''}</button>`;
    }).join('');
    document.querySelectorAll('.world-tab').forEach(b => b.addEventListener('click', () => this.scrollToWorld(b.dataset.theme)));
    // secties: banner, pad, decoraties, wegwijzers, knopen
    canvas.style.height = `${L.height}px`;
    canvas.innerHTML = L.sections.map(sec => {
      const th = sec.th, accent = th ? th.map.accent : '#5A3E2B', ring = th ? th.map.ring : '#B8955C';
      const nodesIn = sec.items.filter(i => i.type === 'node');
      const d = nodesIn.map((i, n) => (n ? 'L' : 'M') + (i.x * W / 100).toFixed(1) + ' ' + (i.y - sec.top)).join(' ');
      let html = `<div class="map-world map-${sec.theme}${sec.open ? '' : ' locked'}" data-theme="${sec.theme}" style="top:${sec.top}px;height:${sec.height}px;--wa:${accent};--wr:${ring}">`;
      if (th) {
        const sub = sec.open ? `${sec.done} van ${sec.total} zaken · ★ ${sec.stars}/${sec.total * 3}`
                             : `🔒 Los nog ${sec.need} ${sec.need === 1 ? 'zaak' : 'zaken'} op (vrij spel of dagelijks) om deze wereld te openen`;
        html += `<div class="map-banner">${MapArt.banner(th.id)}<div class="map-banner-card"><b>${th.icon} ${th.title}</b><span>${sub}</span></div></div>`;
      }
      html += `<svg class="map-path" width="${W}" height="${sec.height}" viewBox="0 0 ${W} ${sec.height}" aria-hidden="true"><path d="${d}"/></svg>`;
      if (th) nodesIn.forEach((it, i) => {
        const px = it.x === 20 ? 64 : it.x === 80 ? 36 : (i % 2 ? 12 : 88);
        html += `<span class="mapprop-wrap" style="left:${px}%;top:${it.y - sec.top + 46}px">${MapArt.prop(th.id, i)}</span>`;
      });
      sec.items.forEach(it => {
        const yy = it.y - sec.top;
        if (it.type === 'sign') { html += `<span class="msign${it.done ? ' done' : it.open ? '' : ' locked'}" style="top:${yy}px">${it.open ? '' : '🔒 '}${it.title}</span>`; return; }
        const stars = it.stars ? '★'.repeat(it.stars) + '☆'.repeat(3 - it.stars) : '';
        html += `<button type="button" class="mnode ${it.state}" style="left:${it.x}%;top:${yy}px" data-chapter="${it.chapter}" data-idx="${it.idx}" aria-label="${it.archive ? it.title : 'Zaak ' + it.num + ': ' + it.title}">` +
                `${it.state === 'locked' ? '🔒' : it.archive ? '📁' : it.num}${stars ? `<span class="mnode-stars">${stars}</span>` : ''}${it === current ? '<span class="mnode-pin">🕵️</span>' : ''}</button>`;
      });
      return html + '</div>';
    }).join('');
    canvas.querySelectorAll('.mnode').forEach(b => b.addEventListener('click', () =>
      this.openNode(L.nodes.find(n => n.chapter === b.dataset.chapter && n.idx === +b.dataset.idx))));
    this.closeNode();
    // grote knop onderin
    const play = document.getElementById('btn-map-play');
    if (current) { play.disabled = false; play.textContent = `▶ Speel ${current.archive ? current.title : 'zaak ' + current.num + ' · ' + current.title}`; }
    else { play.disabled = true; play.textContent = '✓ Alles opgelost'; }
    this.mapTarget = current || L.nodes[L.nodes.length - 1];
    setTimeout(() => this.scrollToCurrent(), 0);
  },
  scrollToCurrent() {
    const scroll = document.getElementById('map-scroll');
    if (!scroll || !this.mapTarget || !scroll.clientHeight) return;
    scroll.scrollTop = Math.max(0, this.mapTarget.y - scroll.clientHeight * 0.45);
    this.mapSpy();
  },
  scrollToWorld(themeId) {
    const sec = (this.mapSections || []).find(s => s.theme === themeId);
    if (!sec) return;
    const scroll = document.getElementById('map-scroll');
    this.mapWorld = themeId;
    this.markWorldTab(themeId);
    if (typeof scroll.scrollTo === 'function') { try { scroll.scrollTo({ top: sec.top, behavior: 'smooth' }); return; } catch (e) { /* oudere webview */ } }
    scroll.scrollTop = sec.top;
  },
  markWorldTab(themeId) {
    document.querySelectorAll('.world-tab').forEach(b => {
      const on = b.dataset.theme === themeId;
      if (on && !b.classList.contains('active') && typeof b.scrollIntoView === 'function') { try { b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } catch (e) { /* oud */ } }
      b.classList.toggle('active', on);
    });
  },
  // welke wereld is in beeld? (kiezer volgt het scrollen)
  mapSpy() {
    const scroll = document.getElementById('map-scroll');
    if (!scroll || !this.mapSections) return;
    const pos = scroll.scrollTop + (scroll.clientHeight || 520) * 0.4;
    let cur = this.mapSections[0];
    this.mapSections.forEach(s => { if (!s.archive && s.top <= pos) cur = s; });
    if (cur) this.mapWorld = cur.theme;
    this.markWorldTab(this.mapWorld);
  },
  openNode(it) {
    if (!it) return;
    const pop = document.getElementById('map-pop');
    const d = DIFFICULTY[it.difficulty] || {};
    const stars = it.stars ? '★'.repeat(it.stars) + '☆'.repeat(3 - it.stars) : '☆☆☆';
    const locked = it.state === 'locked';
    const th = Themes.get(it.theme);
    const lockText = !this.themeUnlocked(th) && !it.archive ? `Los eerst ${th.unlock} zaken op (vrij spel of dagelijks) om ${th.title} te openen.`
      : it.archive ? (Campaign.chapterOpen(Campaign.ARCHIVE) ? 'Los eerst het vorige dossier op.' : `Het archief opent na ${Campaign.ARCHIVE_UNLOCK} campagnezaken.`)
      : it.idx === 0 ? 'Maak eerst het vorige deel af.' : `Los eerst zaak ${it.num - 1} op.`;
    pop.innerHTML = `<div class="map-pop-card" style="--wa:${th.map.accent};--wr:${th.map.ring}">
      <div class="map-pop-head"><h3>${it.archive ? `${it.title} · ${th.icon}` : `Zaak ${it.num}: ${it.title}`}</h3><span class="diff-pill diff-${it.difficulty}">${d.icon || ''} ${d.label || it.difficulty}</span></div>
      <p>${locked ? '🔒 ' + lockText : it.story}</p>
      <div class="map-pop-row"><span class="map-pop-best">Beste score: <b>${stars}</b></span>${locked ? '' : `<button type="button" class="btn btn-primary btn-sm" id="btn-pop-play">${it.stars ? 'Speel opnieuw' : 'Speel'}</button>`}</div>
    </div>`;
    pop.hidden = false;
    const b = document.getElementById('btn-pop-play');
    if (b) b.addEventListener('click', () => { this.closeNode(); this.startCampaignCase(it.chapter, it.idx); });
  },
  closeNode() { const pop = document.getElementById('map-pop'); if (pop) { pop.hidden = true; pop.innerHTML = ''; } },
  playCurrent() { if (this.mapCurrent) this.startCampaignCase(this.mapCurrent.chapter, this.mapCurrent.idx); },

  partsSeen() { try { return JSON.parse(this.storageGet('crimson-parts-seen') || '[]'); } catch (e) { return []; } },
  // Eerste zaak van een deel: eerst de "Nieuw deel"-splash, dan de briefing van Van Dam, dan het bord.
  startCampaignCase(key, idx) {
    const c = Campaign.caseAt(key, idx);
    if (!c) return this.showToast('⚠️', 'Deze zaak kon niet geladen worden.');
    const ch = Campaign.chapter(key);
    const go = () => {
      if (!Board.start(c.difficulty, c.seed, false, c.theme, c)) return this.showToast('⚠️', 'Deze zaak kon niet geladen worden.');
      this.storageSet('crimson-last-world', c.theme);
      this.navigateTo('board');
      this.showBriefing(c, ch);
    };
    if (ch && idx === 0 && !this.partsSeen().includes(key)) this.showPartSplash(ch, go); else go();
  },
  showBriefing(c, ch) {
    const b = Mentor.briefing(Board.puzzle, c, ch);
    document.getElementById('briefing-sub').textContent = b.sub;
    document.getElementById('briefing-text').textContent = `“${b.text}”`;
    Board.stopTimer();   // de klok loopt pas na "Aan de slag"
    this.showModal('briefing-modal');
  },
  showPartSplash(ch, then) {
    const th = Themes.get(ch.theme);
    document.getElementById('part-icon').textContent = th.icon;
    document.getElementById('part-title').textContent = ch.title;
    document.getElementById('part-intro').textContent = ch.intro;
    document.getElementById('btn-part-go').textContent = `Begin ${ch.title.split(' · ')[0]}`;
    const seen = this.partsSeen();
    if (!seen.includes(ch.key)) { seen.push(ch.key); this.storageSet('crimson-parts-seen', JSON.stringify(seen)); }
    this.partThen = then;
    this.showModal('part-modal');
  },

  // ══════════════════════════════════════════════════════════
  //  THUISSCHERM: dagelijkse zaak, weekstrook, zaak van de week
  // ══════════════════════════════════════════════════════════
  bindHome() {
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('btn-free', () => this.navigateTo('free'));
    on('btn-free-back', () => this.navigateTo('menu'));
    on('btn-awards', () => this.openAwards());
    on('btn-awards-back', () => this.navigateTo('menu'));
    on('menu-rank', () => this.openAwards());
    on('btn-week', () => this.startWeekly());
    on('btn-week-share', () => this.shareAny(Progress.weekShare()));
    on('btn-map', () => { if (Board.campaignCase) this.openMap(Board.campaignCase.theme); else this.navigateTo('menu'); });
    document.querySelectorAll('.awards-tab').forEach(t => t.addEventListener('click', () => this.showAwardsTab(t.dataset.tab)));
  },
  renderHome() {
    const set = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
    if (!document.getElementById('daily-title')) return;
    const dayNo = this.getDayNumber(), theme = Themes.forDay(dayNo);
    const done = this.storageGet('crimson-board-daily-done') === new Date().toDateString();
    set('daily-title', `Zaak van vandaag: ${Progress.dailyTitle(dayNo)}`);
    set('daily-text', `${theme.icon} ${theme.title}. ${theme.tagline}`);
    set('daily-bonus', done ? '✓ Vandaag opgelost' : `🪙 +${Progress.DAILY_BONUS} punten`);
    set('btn-board-daily', done ? 'Nog een zaak' : 'Speel');
    this.renderWeek();
    const w = Progress.weekly(), wdone = Progress.weekDone(), wt = Themes.get(w.theme);
    set('week-title', w.title);
    set('week-text', wdone
      ? `Opgelost! Week ${w.week} · ${wt.icon} ${wt.title}. Volgende week ligt er een nieuwe zaak.`
      : `Week ${w.week} · ${wt.icon} ${wt.title} · moeilijk. Elke week één speciale zaak; iedereen speelt dezelfde. Deel je resultaat met andere speurders.`);
    set('week-bonus', wdone ? '✓ Opgelost' : `🪙 +${Progress.WEEK_BONUS} punten`);
    set('btn-week', wdone ? 'Nog eens' : 'Start');
    const ws = document.getElementById('btn-week-share');
    if (ws) ws.hidden = !wdone;
    this.updateCampaignProgress();
  },
  renderWeek() {
    const strip = document.getElementById('week-strip');
    if (!strip) return;
    const days = Progress.week();
    strip.innerHTML = days.map(d => `<span class="wday${d.played ? ' played' : ''}${d.today ? ' today' : ''}${d.future ? ' future' : ''}${d.reward ? ' reward' : ''}"><i>${d.played ? '✓' : d.reward ? '🏅' : d.label[0]}</i>${d.label}</span>`).join('');
    const note = document.getElementById('streak-note');
    const today = days.find(d => d.today);
    if (note) note.textContent = today && today.played ? 'Vandaag gespeeld. Tot morgen!' : 'Speel vandaag om je streak te houden';
  },
  startWeekly() {
    const w = Progress.weekly();
    if (Board.start(w.difficulty, w.seed, false, w.theme, null, { weekly: w })) this.navigateTo('board');
    else this.showToast('⚠️', 'Kon geen plattegrond genereren, probeer opnieuw.');
  },

  // ══════════════════════════════════════════════════════════
  //  VITRINE & BUREAU: onderscheidingen en bewijsstukken
  // ══════════════════════════════════════════════════════════
  openAwards() { this.renderAwards(); this.navigateTo('awards'); },
  showAwardsTab(tab) {
    document.querySelectorAll('.awards-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('awards-medals').hidden = tab !== 'medals';
    document.getElementById('awards-vitrine').hidden = tab !== 'vitrine';
  },
  renderAwards() {
    const have = Progress.medals(), n = Object.keys(have).length;
    document.getElementById('awards-points').textContent = `🪙 ${Progress.points()} punten`;
    document.getElementById('medal-count').textContent = n;
    document.getElementById('awards-medals').innerHTML =
      `<div class="medals-head"><h3>Medailleoverzicht</h3><span>${n} van de ${Progress.MEDALS.length} behaald</span></div>` +
      Progress.MEDALS.map(m => `<div class="medal${have[m.id] ? ' got' : ''}"><span class="medal-icon">${m.icon}</span><span class="medal-body"><span class="medal-title">${m.title}</span><span class="medal-sub">${have[m.id] ? 'Behaald op ' + Progress.formatDate(have[m.id]) : m.hint}</span></span></div>`).join('');
    const total = Progress.evidenceCount();
    document.getElementById('awards-vitrine').innerHTML =
      `<div class="medals-head"><h3>Bewijsstukken</h3><span>${total} van de ${Campaign.total()} verzameld</span></div>` +
      Themes.list().map(t => {
        const ev = Progress.evidence(t.id), got = ev.filter(e => e.got).length;
        return `<div class="shelf-world"><h4>${t.icon} ${t.title} <small>${got}/${ev.length}</small></h4><div class="shelf">${ev.map(e =>
          `<span class="ev${e.got ? '' : ' miss'}" title="${e.title}"><i>${e.icon}</i><b>${e.got ? e.name : 'Gesloten'}</b></span>`).join('')}</div><div class="shelf-bar"><i style="width:${Math.round(got / ev.length * 100)}%"></i></div></div>`;
      }).join('');
  },
  medalQueue: [],
  medalShowing: false,
  showMedal(m) { this.medalQueue.push(m); if (!this.medalShowing) this.pumpMedals(); },
  pumpMedals() {
    const m = this.medalQueue.shift(), t = document.getElementById('medal-toast');
    if (!m || !t) { this.medalShowing = false; return; }
    this.medalShowing = true;
    document.getElementById('medal-toast-icon').textContent = m.icon;
    document.getElementById('medal-toast-text').textContent = `Nieuwe trofee: “${m.title}” ontgrendeld.`;
    t.classList.add('show');
    Sound.play('medal');
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => this.pumpMedals(), 400); }, 2800);
  },

  // ══════════════════════════════════════════════════════════
  //  DAGELIJKSE HERINNERING (alleen in de iOS-app, lokale melding)
  // ══════════════════════════════════════════════════════════
  notif() {
    try { const P = window.Capacitor && window.Capacitor.Plugins; return (P && P.LocalNotifications) || null; } catch (e) { return null; }
  },
  reminderEnabled() { return this.storageGet('crimson-reminder') === '1'; },
  async setReminder(on) {
    const LN = this.notif();
    if (!LN) return false;
    if (!on) {
      this.storageSet('crimson-reminder', '0');
      try { await LN.cancel({ notifications: [{ id: 1 }] }); } catch (e) { /* niets gepland */ }
      return false;
    }
    try {
      const perm = await LN.requestPermissions();
      if (perm.display !== 'granted') { this.showToast('🔕', 'Meldingen staan uit. Zet ze aan bij Instellingen › Crimson Ledger.'); return false; }
    } catch (e) { return false; }
    this.storageSet('crimson-reminder', '1');
    await this.scheduleReminder();
    return true;
  },
  // Eén melding, elke keer opnieuw gepland: vandaag 18:30 als de dagelijkse zaak nog open staat, anders morgen.
  async scheduleReminder() {
    const LN = this.notif();
    if (!LN || !this.reminderEnabled()) return;
    const doneToday = this.storageGet('crimson-board-daily-done') === new Date().toDateString();
    const at = new Date(); at.setHours(18, 30, 0, 0);
    if (doneToday || at <= new Date()) at.setDate(at.getDate() + 1);
    const streak = this.streak.count || 0;
    const body = streak > 1 ? `Je dagelijkse zaak wacht. Houd je streak van ${streak} dagen vast.` : 'Er ligt een nieuwe zaak op je bureau. Wie was alleen met het slachtoffer?';
    try {
      await LN.cancel({ notifications: [{ id: 1 }] }).catch(() => {});
      await LN.schedule({ notifications: [{ id: 1, title: 'Crimson Ledger', body, schedule: { at, allowWhileIdle: true } }] });
    } catch (e) { /* geen meldingen beschikbaar */ }
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
    // dagelijkse herinnering: alleen tonen als de app lokale meldingen heeft (iOS)
    const row = document.getElementById('settings-reminder'), chk = document.getElementById('chk-reminder');
    if (row && chk) {
      row.hidden = !this.notif();
      chk.checked = this.reminderEnabled();
      chk.addEventListener('change', async () => { chk.checked = await this.setReminder(chk.checked); });
    }
    const rb = document.getElementById('btn-remind');
    if (rb) rb.addEventListener('click', async () => {
      if (await this.setReminder(true)) { rb.hidden = true; this.showToast('🔔', 'Ingesteld: elke dag om 18:30 een herinnering.'); }
    });
  },

  resetProgress() {
    try {
      Object.keys(localStorage).filter(k => k.startsWith('crimson-')).forEach(k => this.storageRemove(k));
    } catch (e) { /* privémodus */ }
    const P = this.prefs();
    if (P) P.keys().then(({ keys }) => (keys || []).filter(k => k.startsWith('crimson-')).forEach(k => P.remove({ key: k }).catch(() => {}))).catch(() => {});
    this.streak = { count: 0, lastDate: null };
    this.selectedTheme = 'landhuis';
    this.updateStreakDisplay();
    this.updateBoardStats();
    this.renderHome();
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
    this.renderDifficultyPreviews();
  },

  // ── Moeilijkheidskiezer: mini-plattegrond in het gekozen thema ──
  // Vaste seeds per niveau, zodat het voorbeeld rustig blijft; de echte
  // zaak gebruikt een andere seed, dus het voorbeeld verklapt niets.
  PREVIEW_SEEDS: { makkelijk: 1301, gemiddeld: 2402, moeilijk: 3503 },
  previewCache: {},
  renderDifficultyPreviews() {
    if (typeof FloorPlan === 'undefined' || typeof Themes === 'undefined') return;
    const theme = Themes.get(this.selectedTheme);
    if (!theme) return;
    Object.keys(this.PREVIEW_SEEDS).forEach(d => {
      const prev = document.querySelector(`.difficulty-preview[data-preview="${d}"]`);
      const meta = document.querySelector(`.difficulty-meta[data-meta="${d}"]`);
      if (!prev || !meta) return;
      const cacheKey = `${theme.id}:${d}`;
      let puzzle = this.previewCache[cacheKey];
      if (!puzzle) {
        const base = this.PREVIEW_SEEDS[d];
        for (let i = 0; i < 8 && !puzzle; i++) puzzle = FloorPlan.generate(base + i * 7919, d, theme);
        if (puzzle) this.previewCache[cacheKey] = puzzle;
      }
      const cfg = FloorPlan.DIFF[d] || FloorPlan.DIFF.gemiddeld;
      prev.innerHTML = puzzle ? this.previewSvg(puzzle) : '';
      const dots = theme.suspects.slice(0, cfg.suspects).map(su => `<i style="background:${su.color}"></i>`).join('');
      meta.innerHTML = `${dots}<span>${cfg.cols}×${cfg.rows}</span>`;
      meta.title = `${cfg.suspects} verdachten · ${cfg.cols} bij ${cfg.rows} vakjes`;
    });
  },
  previewSvg(p) {
    const C = 10, W = p.cols * C, H = p.rows * C;
    const roomAt = (x, y) => FloorPlan.roomOf(p.rooms, x, y);
    let cells = '', walls = '';
    for (let y = 0; y < p.rows; y++) for (let x = 0; x < p.cols; x++) {
      const room = roomAt(x, y);
      cells += `<rect x="${x * C}" y="${y * C}" width="${C}" height="${C}" fill="${room.color}"/>`;
      cells += `<rect x="${x * C}" y="${y * C}" width="${C}" height="${C}" fill="${(x + y) % 2 === 0 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.3)'}"/>`;
      const r = roomAt(x + 1, y), b = roomAt(x, y + 1);
      if (r && r.id !== room.id) walls += `M${(x + 1) * C} ${y * C}v${C}`;
      if (b && b.id !== room.id) walls += `M${x * C} ${(y + 1) * C}h${C}`;
    }
    let people = '';
    p.suspects.forEach((su, i) => {
      const c = p.solution[i];
      people += `<circle cx="${c.x * C + C / 2}" cy="${c.y * C + C / 2}" r="${C * 0.33}" fill="${su.color}" stroke="#1A1108" stroke-width="0.9"/>`;
    });
    const v = p.victim;
    people += `<path d="M${v.x * C + 3} ${v.y * C + 3}l4 4m0-4l-4 4" stroke="#B3261E" stroke-width="1.4" stroke-linecap="round" fill="none"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${cells}<path d="${walls}" stroke="#1A1108" stroke-width="1.1" fill="none"/>` +
           `<rect x="0.7" y="0.7" width="${W - 1.4}" height="${H - 1.4}" fill="none" stroke="#1A1108" stroke-width="1.4"/>${people}</svg>`;
  },

  // ── Rang: zichtbare voortgang in het menu en op het resultaatscherm ──
  RANKS: [[0, 'Rekruut'], [3, 'Speurder'], [8, 'Rechercheur'], [15, 'Inspecteur'], [25, 'Hoofdinspecteur'], [40, 'Meesterdetective']],
  rankFor(solved) {
    let idx = 0;
    this.RANKS.forEach(([at], i) => { if (solved >= at) idx = i; });
    const [at, title] = this.RANKS[idx];
    const nx = this.RANKS[idx + 1];
    const next = nx ? { at: nx[0], title: nx[1] } : null;
    return { title, next, progress: next ? (solved - at) / (next.at - at) : 1 };
  },

  updateBoardStats() {
    this.renderThemePicker();
    this.renderHome();
    const el = document.getElementById('board-stats');
    const dateEl = document.getElementById('board-daily-date');
    if (!el) return;
    const st = Board.loadStats();
    const rankEl = document.getElementById('menu-rank');
    if (rankEl) {
      const solved = st.solved || 0, r = this.rankFor(solved);
      const left = r.next ? r.next.at - solved : 0;
      rankEl.innerHTML = `<span class="rank-title">🎖 ${r.title}</span>` + (r.next
        ? `<span class="rank-bar"><i style="width:${Math.round(r.progress * 100)}%"></i></span><span class="rank-next">nog ${left} ${left === 1 ? 'zaak' : 'zaken'} tot ${r.next.title}</span>`
        : '<span class="rank-next">hoogste rang bereikt</span>');
    }
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

    // Terug: na de oefenzaak op het bord meteen de kaart in, anders het menu
    document.getElementById('btn-play-again').addEventListener('click', () => {
      if (this.isTutorial) this.endTutorial();
      if (document.getElementById('btn-play-again').dataset.to === 'map') this.openMap('landhuis');
      else this.navigateTo('menu');
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
      this.isTutorial ? 'Naar het hoofdmenu' : 'Naar het menu';
    document.getElementById('btn-play-again').dataset.to = 'menu';
    document.getElementById('btn-next-case').hidden = true;
    document.getElementById('results-stars').hidden = true;
    document.getElementById('btn-remind').hidden = true;
    ['results-panel', 'results-mentor', 'btn-map'].forEach(id => { document.getElementById(id).hidden = true; });
    document.getElementById('confetti').innerHTML = '';
    document.getElementById('results-stamp').classList.remove('pending');

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

    this.shareAny(text);
  },
  shareAny(text) {
    if (!text) return;
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

  // Voortgang staat in localStorage (web én app). In de iOS-app wordt elke
  // crimson-sleutel ook in de native opslag (UserDefaults) gezet: die zit in
  // de iCloud-/iTunes-back-up en overleeft het wissen van webview-data.
  // Bij het opstarten wordt een lege webview daaruit hersteld.
  prefs() {
    try { const P = window.Capacitor && window.Capacitor.Plugins; return (P && P.Preferences) || null; } catch (e) { return null; }
  },
  storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* privémodus: negeren */ }
    const P = this.prefs();
    if (P && String(key).startsWith('crimson-')) P.set({ key, value: String(value) }).catch(() => {});
  },
  storageRemove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* negeren */ }
    const P = this.prefs();
    if (P) P.remove({ key }).catch(() => {});
  },
  async restoreFromNative() {
    const P = this.prefs();
    if (!P) return;
    try {
      let hasLocal = false;
      try { for (let i = 0; i < localStorage.length; i++) if (String(localStorage.key(i)).startsWith('crimson-')) { hasLocal = true; break; } } catch (e) { /* geen localStorage */ }
      if (hasLocal) return;
      const { keys } = await P.keys();
      for (const key of (keys || []).filter(k => k.startsWith('crimson-'))) {
        const { value } = await P.get({ key });
        if (value !== null && value !== undefined) { try { localStorage.setItem(key, value); } catch (e) { /* negeren */ } }
      }
    } catch (e) { /* geen native opslag */ }
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
    Progress.logDaily();
    this.updateStreakDisplay();
  },

  updateStreakDisplay() {
    document.getElementById('streak-count').textContent = this.streak.count;
    this.renderWeek();
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
document.addEventListener('DOMContentLoaded', () => {
  App.restoreFromNative().then(() => App.init(), () => App.init());
  setTimeout(() => App.hideNativeSplash(), 5000);   // vangnet: nooit blijven hangen op het native laadscherm
});

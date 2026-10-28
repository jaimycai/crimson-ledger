// ============================================================
// DAGZAAK OP HET WEB — besturing van docs/play/.
// Speelt alleen de oefenzaak (eerste bezoek) en de dagelijkse zaak
// van vandaag, met het bord van de app (board.js) en dezelfde regels:
// seed, wereld en titel per datum komen uit de app (gedeeld.js wordt
// bij het bouwen uit app.js en campaign.js gehaald). Geen campagne,
// winkel, punten, rangen of meldingen. Na het oplossen: een
// spoilervrije kaart om te delen en één knop naar de App Store.
// ============================================================
const APP_STORE_URL = 'https://apps.apple.com/app/id6812534368';
const SHARE_URL = 'https://jaimycai.github.io/crimson-ledger/play/';
const RESULT_KEY = 'crimson-webdaily-result';
// meting: alleen deze gebeurtenissen gaan naar crimson-meting (platform 'webdaily')
const WEB_EVENTS = new Set(['open', 'start', 'solved', 'share', 'cta']);

// board.js praat met App; dit is het deel dat de webpagina nodig heeft (de rest doet hier niets)
const App = {
  currentScreen: 'home',
  mode: 'board',
  streak: { count: 0 },
  getDailySeed: DagLogica.getDailySeed,
  getDayNumber: DagLogica.getDayNumber,
  storageGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  storageSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privémodus */ } },
  storageRemove(k) { try { localStorage.removeItem(k); } catch (e) { /* privémodus */ } },
  showModal(id) { document.getElementById(id).classList.add('active'); },
  hideModal(id) { document.getElementById(id).classList.remove('active'); },
  showToast(icon, text) {
    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast-text').textContent = text;
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  },
  navigateTo(id) { WebDaily.go(id === 'menu' ? 'home' : id); },
  rankFor() { return { title: '', level: 0, progress: 0, next: null }; },
  notif() { return false; },
  reminderEnabled() { return false; },
  scheduleReminder() {}, updateStreak() {}, updateBoardStats() {}, maybeAskReview() {},
  questToast() {}, streakToasts() {}, showMedal() {}, showChest() {}, openStore() {}, startCampaignCase() {}
};

const WebDaily = {
  via: 'direct',     // 'share' als de bezoeker via een gedeelde link kwam (?s=1)
  playing: null,     // { n, day } van de dagzaak die nu op het bord ligt
  clock: null,

  $(id) { return document.getElementById(id); },
  today() { const n = App.getDayNumber(); return { n, day: Progress.dayKey(), theme: Themes.forDay(n), title: Progress.dailyTitle(n) }; },
  result() {
    try { const r = JSON.parse(App.storageGet(RESULT_KEY) || 'null'); return r && r.day === Progress.dayKey() ? r : null; } catch (e) { return null; }
  },
  resumable() {
    try { const s = JSON.parse(App.storageGet(Board.RESUME_KEY) || 'null'); return !!s && s.id === `d:${new Date().toDateString()}`; } catch (e) { return false; }
  },
  dayLabel(n) { return T(' · Dag #{0}', n).replace(/^\s*·\s*/, ''); },

  init() {
    try {
      const q = new URLSearchParams(location.search);
      if (q.has('s')) { this.via = 'share'; history.replaceState(null, '', location.pathname); }
    } catch (e) { /* oude browser */ }
    const send = Meting.send.bind(Meting);
    Meting.send = (e, a = '', n = 0) => { if (WEB_EVENTS.has(e)) send(e, e === 'open' && !a ? this.via : a, n); };

    I18n.init();
    document.title = `Crimson Ledger · ${T('Zaak van vandaag')}`;
    document.documentElement.dataset.timer = 'on';
    if (typeof Progress !== 'undefined') Progress.questBump = null;   // geen opdrachten van vandaag op het web
    Icons.KEEP += ', .wd-card';                                        // de kaart toont emoji zoals de gedeelde tekst
    Icons.fill(); Icons.watch();
    Sound.init(App.storageGet('crimson-sound'));
    Board.bind();
    Board.finish = () => this.finish();
    this.bind();
    this.renderStatic();
    this.renderHome();
    this.clock = setInterval(() => this.tick(), 1000);
    Meting.open();
  },

  bind() {
    const on = (id, fn) => this.$(id).addEventListener('click', fn);
    on('wd-play', () => {
      if (this.result()) return;
      if (!App.storageGet('crimson-board-tutorial-done') && !this.resumable()) this.startTutorial(); else this.startDaily();
    });
    on('wd-skip', () => { App.storageSet('crimson-board-tutorial-done', '1'); this.startDaily(); });
    on('wd-to-daily', () => this.startDaily());
    on('btn-board-back', () => { if (!Board.solved) Board.saveResume(); Board.stopTimer(); this.go('home'); });
    on('btn-close-hint', () => App.hideModal('hint-modal'));
    ['hint-modal', 'clue-modal'].forEach(id => this.$(id).addEventListener('click', e => { if (e.target.id === id) App.hideModal(id); }));
    on('wd-sound', () => { Sound.toggle(); App.storageSet('crimson-sound', Sound.enabled ? '1' : '0'); this.soundLabel(); Sound.play('ui'); });
    this.$('wd-lang').addEventListener('change', e => I18n.set(e.target.value));
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('[data-appstore]');
      if (a) Meting.send('cta', 'appstore', +a.dataset.appstore || 0);
    });
  },

  // ── Schermen ─────────────────────────────────────────────
  go(id) {
    const current = document.querySelector('.screen.active'), next = this.$(`screen-${id}`);
    if (!next || current === next) return;
    if (id === 'home') this.renderHome();
    current.classList.add('fade-out');
    setTimeout(() => {
      current.classList.remove('active', 'fade-out');
      next.classList.add('active');
      App.currentScreen = id;
      window.scrollTo(0, 0);
      if (id === 'board') Board.fitBoard();
    }, 220);
  },

  startTutorial() {
    Board.startTutorial();
    Meting.send('start', 'tutorial', 0);
    this.go('board');
  },
  // precies zoals de app (App.bindBoard, knop "Speel" bij de dagelijkse zaak): gemiddeld, seed = datum × 3 + 777,
  // de wereld van de dag. Zo ligt op het web dezelfde zaak als in de app op die datum.
  startDaily() {
    if (this.result()) { this.go('home'); return; }
    const d = this.today();
    this.playing = { n: d.n, day: d.day };
    if (Board.start('gemiddeld', App.getDailySeed() * 3 + 777, true, d.theme.id)) this.go('board');
    else App.showToast('⚠️', T('Kon geen plattegrond genereren, probeer opnieuw.'));
  },

  // Vervangt Board.finish: geen punten, rangen, streak of campagne; wel dezelfde sterrenregel als de app.
  finish() {
    const B = Board;
    B.solved = true;
    B.clearResume();
    B.stopTimer();
    this.$('board-grid').classList.add('solved');
    B.updateTools();
    const tutorial = B.isTutorial;
    let r = null;
    if (tutorial) {
      App.storageSet('crimson-board-tutorial-done', '1');
      this.$('board-coach').hidden = true;
      this.$('btn-board-hint').disabled = false;
      B.isTutorial = false;
      Meting.send('solved', 'tutorial', 0);
    } else {
      B.saveStats();
      App.storageSet('crimson-board-daily-done', new Date().toDateString());
      const p = this.playing || this.today();
      r = { day: p.day, n: p.n, t: B.elapsed, h: B.hintsUsed, a: B.attempts };
      App.storageSet(RESULT_KEY, JSON.stringify(r));
      Meting.send('solved', 'daily', B.loadStats().solved || 0);
    }
    Sound.play('win');
    this.showSolved(tutorial, r);
  },

  showSolved(tutorial, r) {
    const p = Board.puzzle, m = p.suspects[p.murderer], q = p.rooms.find(x => x.id === p.victim.roomId);
    this.$('wd-headline').textContent = tutorial ? T('Goed gedaan!') : T('Zaak opgelost!');
    this.$('wd-verdict').textContent = Grammar.text('board/verdict', p, { s: Grammar.who(m), room: q.id });
    this.$('wd-badge').hidden = !tutorial;
    this.$('wd-desc').textContent = tutorial
      ? T('Zo werkt elke zaak: plaats iedereen met de verklaringen, en wijs dan aan wie alleen was met het slachtoffer. Tijd voor een echte zaak.') : '';
    const next = this.$('wd-to-daily');
    next.hidden = !tutorial || !!this.result();
    next.textContent = T('▶ Volgende zaak: {0}', this.today().title);
    this.renderResult(this.$('wd-result'), tutorial ? null : r, 1);
    this.go('results');
    setTimeout(() => { Board.confetti(); Sound.play('stamp'); Board.buzz(30); }, 320);
  },

  // ── Thuis ────────────────────────────────────────────────
  renderStatic() {
    const sel = this.$('wd-lang');
    sel.innerHTML = I18n.LANGS.map(([code, name]) => `<option value="${code}"${code === I18n.lang ? ' selected' : ''}>${name}</option>`).join('');
    sel.setAttribute('aria-label', T('🌍 Taal').replace(/^\S+\s*/, ''));
    this.$('wd-lang-code').textContent = I18n.lang.toUpperCase();
    this.$('wd-tagline').textContent = T('Speur. Redeneer. Ontmasker.');
    // hoe het werkt: de stappen uit "Hoe werkt het?" van de app, in de volgorde waarin je speelt
    this.$('wd-how-title').textContent = T('Hoe werkt het?');
    this.$('wd-step1').textContent = T('Lees de verklaringen');
    this.$('wd-step2').textContent = T('Plaats de verdachten');
    this.$('wd-step3').textContent = T('Wijs de moordenaar aan');
    this.$('wd-rule').textContent = T('Alleen de moordenaar was in de kamer van het slachtoffer. Niemand anders.');
    this.$('wd-brandline').textContent = WT('brand');
    this.$('wd-privacy').textContent = T('Privacy');
    this.$('wd-first-text').textContent = WT('practice');
    this.$('wd-skip').textContent = T('Overslaan');
    document.querySelectorAll('[data-appstore]').forEach(a => { a.href = APP_STORE_URL; });
    this.soundLabel();
  },
  soundLabel() { this.$('wd-sound').textContent = Sound.enabled ? T('🔊 Geluid aan') : T('🔇 Geluid uit'); },

  renderHome() {
    const d = this.today(), r = this.result();
    this.$('wd-ribbon').textContent = T('Zaak van vandaag');
    let date = '';
    try { date = new Date().toLocaleDateString(I18n.locale(), { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { /* oude browser */ }
    this.$('wd-date').textContent = [date, this.dayLabel(d.n)].filter(Boolean).join(' · ');
    this.$('wd-title').textContent = d.title;
    this.$('wd-world').textContent = T('{0} {1}. {2}', d.theme.icon, d.theme.title, d.theme.tagline);
    this.$('wd-hook').textContent = T('Er ligt een nieuwe zaak op je bureau. Wie was alleen met het slachtoffer?');
    // vandaag al opgelost: de kaart met het resultaat neemt de plaats van de zaak in
    this.$('wd-daily').hidden = !!r;
    const first = !r && !App.storageGet('crimson-board-tutorial-done') && !this.resumable();
    this.$('wd-play').textContent = this.resumable() ? T('Verder') : T('Speel');
    this.$('wd-first').hidden = !first;
    this.$('wd-how').hidden = !!r;
    const box = this.$('wd-home-result');
    box.hidden = !r;
    this.renderResult(box, r, 2);
  },

  // ── Resultaat: kaart, delen, App Store, aftellen ─────────
  stars(r) { return DagLogica.starsFor(r.h, r.a); },
  shareText(r) {
    const s = this.stars(r), th = Themes.forDay(r.n);
    return [
      `Crimson Ledger · ${this.dayLabel(r.n)}`,
      `${th.icon} ${Progress.dailyTitle(r.n)}`,
      `${'⭐'.repeat(s)}${'☆'.repeat(3 - s)} ⏱️ ${Board.formatTime(r.t)} · 💡 ${r.h} · 🔁 ${r.a + 1}`,
      `${SHARE_URL}?s=1`
    ].join('\n');
  },
  // place: 1 = net opgelost, 2 = thuis (vandaag al opgelost); gaat als getal mee met de klik naar de App Store
  renderResult(box, r, place) {
    box.innerHTML = '';
    if (!r) return;
    const s = this.stars(r), th = Themes.forDay(r.n), esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    box.innerHTML = `
      <div class="wd-card" role="group" aria-label="${esc(T('Zaak opgelost!'))}">
        <div class="wd-card-head"><span class="wd-card-brand">Crimson Ledger</span><span class="wd-card-day">${esc(this.dayLabel(r.n))}</span></div>
        <div class="wd-card-title">${th.icon} ${esc(Progress.dailyTitle(r.n))}</div>
        <div class="wd-card-row">
          <span class="wd-card-stars" aria-label="${s}/3">${[0, 1, 2].map(i => `<i class="${i < s ? 'on' : ''}">${i < s ? '★' : '☆'}</i>`).join('')}</span>
          <span class="wd-card-stamp">${esc(T('Zaak Gesloten'))}</span>
        </div>
        <div class="wd-card-stats">
          <span><small>${esc(T('Tijd'))}</small>⏱️ ${Board.formatTime(r.t)}</span>
          <span><small>${esc(T('Hints'))}</small>💡 ${r.h}</span>
          <span><small>${esc(T('Pogingen'))}</small>🔁 ${r.a + 1}</span>
        </div>
      </div>
      <button type="button" class="btn btn-dark btn-block wd-share">${esc(T('📤 Deel resultaat'))}</button>
      <div class="wd-promo">
        <img class="wd-promo-icon" src="icon-192.png" alt="" width="52" height="52">
        <div class="wd-promo-text"><b>Crimson Ledger</b><span>${esc(WT('ctaSub'))}</span></div>
        <a class="btn btn-primary btn-block wd-cta" href="${APP_STORE_URL}" data-appstore="${place}" target="_blank" rel="noopener">${esc(WT('cta'))}</a>
      </div>
      <p class="wd-next"><span>${esc(T('Vandaag gespeeld. Tot morgen!'))}</span> <b class="wd-count"></b></p>`;
    box.querySelector('.wd-share').addEventListener('click', () => this.share(r));
    Icons.fill(box);
    this.tick();
  },

  share(r) {
    const text = this.shareText(r), s = this.stars(r);
    const copied = () => { App.showToast('📋', T('Resultaat gekopieerd naar klembord!')); Meting.send('share', 'copy', s); };
    const fail = () => App.showToast('⚠️', T('Delen wordt niet ondersteund in deze browser.'));
    const copy = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(copied);
      // oudere browsers: via een verborgen tekstvak
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand && document.execCommand('copy');
      ta.remove();
      return ok ? Promise.resolve(copied()) : Promise.reject(new Error('geen klembord'));
    };
    // telefoon: het deelvenster van het toestel; computer: naar het klembord (zoals Wordle)
    const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    if (touch && navigator.share) {
      navigator.share({ text }).then(() => Meting.send('share', 'native', s), err => {
        if (err && err.name === 'AbortError') return;
        copy().catch(fail);
      });
    } else copy().catch(fail);
  },

  // aftellen tot middernacht (de zaak van morgen); om middernacht staat thuis de nieuwe zaak klaar
  tick() {
    const now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
    const left = Math.max(0, Math.round((end - now) / 1000));
    const hms = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60].map(v => String(v).padStart(2, '0')).join(':');
    document.querySelectorAll('.wd-count').forEach(el => { el.textContent = WT('next', hms); });
    const day = Progress.dayKey(now);
    if (this.shownDay && this.shownDay !== day && App.currentScreen === 'home') this.renderHome();
    this.shownDay = day;
  }
};

document.addEventListener('DOMContentLoaded', () => WebDaily.init());

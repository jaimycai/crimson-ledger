// ============================================================
// GAME CENTER — prestaties en twee ranglijsten in Apple's Games-app, zodat vrienden het spel daar zien.
// Alleen in de iOS-app (ios/App/App/GameCenterPlugin.swift); op het web, op Android en in de tests doet
// alles hier niets. Het spel wacht nergens op: elke aanroep mag mislukken zonder dat de speler iets merkt.
//
// De prestaties volgen de onderscheidingen in progress.js (zelfde regels, zelfde tellers uit Board.medalCtx):
// waar een medaille bestaat, telt die ook (een medaille van vóór Game Center geeft de prestatie bij de
// eerstvolgende aanmelding). Elke prestatie gaat één keer naar Apple (crimson-gc-sent).
//   GameCenter.achieve('first_case')       prestatie crimson.first_case op 100 %
//   GameCenter.score('points', 4200)       ranglijst crimson.points (totaal aantal punten, hoog is beter)
//   GameCenter.score('daily_time', 95)     ranglijst crimson.daily_time (dagzaak in seconden, laag is beter, elke dag nieuw)
// De teksten, punten en plaatjes in App Store Connect staan in store/gamecenter/ (node store/gamecenter/asc-gc.js).
// ============================================================

const GameCenter = {
  PREFIX: 'crimson.',
  SENT_KEY: 'crimson-gc-sent',
  ASKED_KEY: 'crimson-gc-asked',
  DAILY_KEY: 'crimson-gc-daily',
  BOARDS: { points: 'crimson.points', daily_time: 'crimson.daily_time' },
  // de 24 werelden in vaste volgorde: de ids staan voor altijd in App Store Connect
  WORLDS: ['landhuis', 'piraten', 'hotel', 'ruimte', 'museum', 'trein', 'circus', 'skihut', 'hacienda', 'opera', 'opgraving', 'casino',
    'filmstudio', 'karavaan', 'abdij', 'vuurtoren', 'oceaanstomer', 'ryokan', 'fazenda', 'zeppelin', 'poolstation', 'winterpaleis', 'safarilodge', 'hanok'],
  // [sleutel, test op Board.medalCtx(), medaille in progress.js die hetzelfde betekent]
  list() {
    if (this._list) return this._list;
    const A = [
      ['first_case', c => c.solved >= 1, 'eerste-zaak'],
      ['first_three_stars', c => c.threeStars >= 1],
      ['first_part', c => c.partsDone >= 1, 'deel'],
      ...this.WORLDS.map(w => [`world.${w}`, c => (c.worldsDone || []).includes(w), w]),
      ['streak_3', c => c.streak >= 3, 'drie-dagen'],
      ['streak_7', c => c.streak >= 7, 'zeven-dagen'],
      ['streak_30', c => c.streak >= 30],
      ['solved_10', c => c.solved >= 10],
      ['solved_50', c => c.solved >= 50],
      ['solved_100', c => c.solved >= 100],
      ['solved_500', c => c.solved >= 500],
      ['first_master', c => c.masterSolved >= 1],
      ['case_of_week', c => !!c.weekDone, 'weekzaak']
    ];
    return (this._list = A.map(([key, test, medal]) => ({ key, id: this.PREFIX + key, test, medal: medal || null })));
  },

  authed: false,
  inflight: new Set(),
  native() {
    try {
      const C = typeof window !== 'undefined' ? window.Capacitor : null;
      if (!C || !C.isNativePlatform || !C.isNativePlatform() || !C.getPlatform || C.getPlatform() !== 'ios') return null;
      return (C.Plugins && C.Plugins.GameCenter) || null;
    } catch (e) { return null; }
  },
  get(k) { return typeof App !== 'undefined' ? App.storageGet(k) : null; },
  set(k, v) { if (typeof App !== 'undefined') App.storageSet(k, v); },
  sent() { try { return JSON.parse(this.get(this.SENT_KEY) || '[]'); } catch (e) { return []; } },

  // de prestaties die nu verdiend zijn: de regel op de tellers, of de medaille die al eerder kwam
  earned(ctx) {
    const medals = typeof Progress !== 'undefined' ? Progress.medals() : {};
    return this.list().filter(a => { try { return (a.medal && medals[a.medal]) || !!a.test(ctx || {}); } catch (e) { return false; } }).map(a => a.key);
  },

  achieve(key, banner = true) {
    const P = this.native(), a = this.list().find(x => x.key === key);
    if (!P || !a || !this.authed || this.inflight.has(key) || this.sent().includes(key)) return Promise.resolve(false);
    this.inflight.add(key);
    // via Promise.resolve: also an exception inside the bridge becomes a quiet false, never a break in Board.finish
    return Promise.resolve().then(() => P.reportAchievement({ id: a.id, percent: 100, banner })).then(r => {
      this.inflight.delete(key);
      if (!r || !r.ok) return false;
      const s = this.sent();
      if (!s.includes(key)) { s.push(key); this.set(this.SENT_KEY, JSON.stringify(s)); }
      return true;
    }, () => { this.inflight.delete(key); return false; });
  },
  score(board, value) {
    const P = this.native(), id = this.BOARDS[board], v = Math.round(+value);
    if (!P || !id || !this.authed || !isFinite(v) || v <= 0) return Promise.resolve(false);   // 0 is no score yet
    if (board === 'points' && this.lastPoints === v) return Promise.resolve(true);
    if (board === 'points') this.lastPoints = v;
    const done = ok => { if (!ok && board === 'points' && this.lastPoints === v) this.lastPoints = null; return ok; };
    return Promise.resolve().then(() => P.submitScore({ leaderboardId: id, value: v })).then(r => done(!!(r && r.ok)), () => done(false));
  },

  ctx() { try { return typeof Board !== 'undefined' && Board.medalCtx ? Board.medalCtx() : {}; } catch (e) { return {}; } },
  // Board.finish: na de punten en de medailles van deze zaak. Een eigen medaille op het scherm: dan geen banner van Apple erbij.
  solved(b) {
    if (!this.native()) return;
    try { this.report(b); } catch (e) { /* Game Center mag een zaak nooit breken */ }
  },
  report(b) {
    const today = typeof Progress !== 'undefined' ? Progress.dayKey() : '';
    if (b && b.isDaily && !b.dailyDoneBefore && b.elapsed > 0) {
      const t = Math.round(b.elapsed);
      this.set(this.DAILY_KEY, JSON.stringify({ day: today, value: t }));   // vangnet: ook als de speler zich pas later aanmeldt
      this.score('daily_time', t).then(ok => { if (ok) this.set(this.DAILY_KEY, ''); });
    }
    if (!this.authed) return;
    const medals = this.list().filter(a => a.medal).map(a => a.key);
    this.earned(this.ctx()).forEach(k => this.achieve(k, !medals.includes(k)));
    if (typeof Progress !== 'undefined') this.score('points', Progress.points());
  },
  // na de aanmelding: wat al eerder verdiend is (zonder banners), de punten, en een dagtijd van vandaag die nog niet aankwam
  sync() {
    if (!this.native() || !this.authed) return;
    try { this.catchUp(); } catch (e) { /* stil */ }
  },
  catchUp() {
    this.earned(this.ctx()).forEach(k => this.achieve(k, false));
    if (typeof Progress !== 'undefined') this.score('points', Progress.points());
    let d = null;
    try { d = JSON.parse(this.get(this.DAILY_KEY) || 'null'); } catch (e) { d = null; }
    if (d && typeof Progress !== 'undefined' && d.day === Progress.dayKey()) this.score('daily_time', d.value).then(ok => { if (ok) this.set(this.DAILY_KEY, ''); });
  },

  // App.init. Apple's aanmeldvenster hooguit één keer, en niet in de allereerste sessie (dan eerst de oefenzaak).
  init() {
    const P = this.native();
    if (!P || this.started) return;
    this.started = true;
    const row = typeof document !== 'undefined' ? document.getElementById('settings-gc') : null;
    const btn = typeof document !== 'undefined' ? document.getElementById('btn-gamecenter') : null;
    if (btn) btn.addEventListener('click', () => { Promise.resolve().then(() => P.showDashboard()).catch(() => {}); });
    const state = r => {
      const was = this.authed;
      this.authed = !!(r && r.authenticated);
      if (row) row.hidden = !this.authed;
      if (this.authed && !was) this.sync();
    };
    try { if (P.addListener) P.addListener('auth', state); } catch (e) { /* geen events */ }
    const present = !!this.get('crimson-board-tutorial-done') && !this.get(this.ASKED_KEY);
    if (present) this.set(this.ASKED_KEY, '1');
    try { P.authenticate({ present }).then(state, () => {}); } catch (e) { /* stil */ }
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { GameCenter };

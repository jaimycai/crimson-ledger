// ============================================================
// PROGRESS — punten, onderscheidingen (medailles), bewijsstukken
// voor de vitrine, de weekstrook van de dagelijkse zaak en de
// zaak van de week. Alles lokaal, geen account. Geen DOM: ook in
// node te testen.
// ============================================================

const DAILY_TITLES = [
  'Giftige kruiden', 'Het lege glas', 'De gestopte klok', 'Een natte jas', 'De verkeerde sleutel',
  'Stilte na twaalven', 'Het gebroken slot', 'De laatste getuige', 'Voetstappen boven', 'De open la',
  'Het verdwenen mes', 'Twee kopjes thee', 'De vergeten brief', 'Rook zonder vuur', 'Het dubbele alibi',
  'De koude kachel', 'Een deur op een kier', 'De verwisselde jas', 'Het zwijgende personeel', 'De lege stoel',
  'Sporen in het stof', 'Het late bezoek', 'De gesloten gordijnen', 'Een naam te veel', 'Het scheve schilderij',
  'De verdwenen handschoen', 'Middernacht min één', 'De tweede sleutel', 'Het gebroken glas', 'De laatste ronde'
];
const WEEK_TITLES = {
  landhuis: ['Het mysterie van de testamenten', 'De nacht van de drie klokken', 'Het geheim van de oostvleugel', 'Het diner van de leugenaars'],
  piraten:  ['Het complot in de kombuis', 'De muiterij op de Zwarte Meeuw', 'De kaart met twee kruizen', 'De vloek van het lege vat'],
  hotel:    ['De code van kamer 404', 'De laatste sleutel van Aurora', 'Het bal van de maskers', 'De gast die nooit uitcheckte'],
  ruimte:   ['Het signaal uit sector 7', 'De koepel van Orion', 'De sluis die vanzelf openging', 'Het logboek zonder laatste regel']
};
const WEEK_THEMES = ['landhuis', 'piraten', 'hotel', 'ruimte'];

const Progress = {
  // ── opslag (via App, zodat privémodus nooit crasht) ──
  get(k) { return typeof App !== 'undefined' ? App.storageGet(k) : null; },
  set(k, v) { if (typeof App !== 'undefined') App.storageSet(k, v); },
  json(k, fallback) { try { const v = JSON.parse(this.get(k) || 'null'); return v === null ? fallback : v; } catch (e) { return fallback; } },

  // ── Punten ─────────────────────────────────────────────────
  BASE: { makkelijk: 300, gemiddeld: 500, moeilijk: 800 },
  PAR:  { makkelijk: 150, gemiddeld: 240, moeilijk: 420 },   // seconden waarbinnen er tijdbonus is
  DAILY_BONUS: 150, WEEK_BONUS: 300, ARCHIVE_BONUS: 100,
  points() { return +this.get('crimson-points') || 0; },
  addPoints(n) { const t = this.points() + n; this.set('crimson-points', String(t)); return t; },
  // score van één zaak: rijen [label, punten] en het totaal
  score(o) {
    const base = this.BASE[o.difficulty] || this.BASE.gemiddeld;
    const par = this.PAR[o.difficulty] || this.PAR.gemiddeld;
    const time = Math.round(Math.max(0, 1 - (o.elapsed || 0) / par) * 250);
    const rows = [['Basis', base], ['Tijdbonus', time], ['Zonder hint', o.hintsUsed === 0 ? 200 : 0], ['In één keer', o.attempts === 0 ? 150 : 0]];
    if (o.isDaily) rows.push(['Dagelijkse zaak', this.DAILY_BONUS]);
    if (o.isWeekly) rows.push(['Zaak van de week', this.WEEK_BONUS]);
    if (o.isArchive) rows.push(['Archiefdossier', this.ARCHIVE_BONUS]);
    return { rows, total: rows.reduce((n, r) => n + r[1], 0) };
  },

  // ── Dagelijkse zaak: logboek + weekstrook ──────────────────
  dayKey(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
  dailyLog() { return this.json('crimson-daily-log', []); },
  logDaily(d = new Date()) {
    const log = this.dailyLog(), k = this.dayKey(d);
    if (!log.includes(k)) { log.push(k); this.set('crimson-daily-log', JSON.stringify(log.slice(-400))); }
    return log;
  },
  // maandag t/m zondag van de week waarin `now` valt
  week(now = new Date()) {
    const log = new Set(this.dailyLog());
    const monday = new Date(now); monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const today = this.dayKey(now);
    return ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((label, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const key = this.dayKey(d);
      return { label, key, played: log.has(key), today: key === today, future: key > today, reward: i === 6 };
    });
  },
  weekFull(now = new Date()) { return this.week(now).every(d => d.played); },
  dailyTitle(dayNumber) { return DAILY_TITLES[((dayNumber % DAILY_TITLES.length) + DAILY_TITLES.length) % DAILY_TITLES.length]; },

  // ── Zaak van de week (ISO-week, vaste seed, moeilijk) ──────
  isoWeek(d = new Date()) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = t.getUTCFullYear();
    const week = Math.ceil(((t - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
    return { year: y, week };
  },
  weekKey(d = new Date()) { const w = this.isoWeek(d); return `${w.year}-W${String(w.week).padStart(2, '0')}`; },
  weekly(d = new Date()) {
    const w = this.isoWeek(d), n = w.year * 53 + w.week;
    return { key: this.weekKey(d), seed: 300000 + n * 31, theme: WEEK_THEMES[n % WEEK_THEMES.length], difficulty: 'moeilijk',
             title: WEEK_TITLES[WEEK_THEMES[n % WEEK_THEMES.length]][Math.floor(n / WEEK_THEMES.length) % 4], week: w.week };
  },
  weekDone(d = new Date()) { return this.get('crimson-week-done') === this.weekKey(d); },
  markWeekDone(shareText, d = new Date()) { this.set('crimson-week-done', this.weekKey(d)); if (shareText) this.set('crimson-week-share', shareText); },
  weekShare() { return this.get('crimson-week-share') || ''; },

  // ── Onderscheidingen ───────────────────────────────────────
  MEDALS: [
    { id: 'eerste-zaak',   icon: '🔍', title: 'Eerste zaak',           hint: 'Los je eerste zaak op',                                     test: c => c.solved >= 1 },
    { id: 'drie-dagen',    icon: '🔥', title: 'Drie dagen op rij',     hint: 'Speel drie dagen achter elkaar de dagelijkse zaak',          test: c => c.streak >= 3 },
    { id: 'zeven-dagen',   icon: '📅', title: 'Zeven dagen op rij',    hint: 'Houd een streak van zeven dagen vast',                       test: c => c.streak >= 7 },
    { id: 'volle-week',    icon: '🏅', title: 'Volle week',            hint: 'Speel elke dag van de week, van maandag tot en met zondag',  test: c => !!c.weekFull },
    { id: 'zonder-hint',   icon: '💡', title: 'Tien keer zonder hint', hint: 'Los tien zaken op zonder één hint',                          test: c => c.clean >= 10 },
    { id: 'snel',          icon: '⚡', title: 'Snelle speurder',       hint: 'Los een zaak op binnen anderhalve minuut',                   test: c => c.elapsed > 0 && c.elapsed <= 90 },
    { id: 'deel',          icon: '📖', title: 'Eerste deel voltooid',  hint: 'Maak een deel van de campagne af',                           test: c => c.partsDone >= 1 },
    { id: 'landhuis',      icon: '🏚️', title: 'Blackwood zwijgt',      hint: 'Maak alle drie de delen van Het Landhuis af',                test: c => c.worldsDone.includes('landhuis') },
    { id: 'piraten',       icon: '🏴‍☠️', title: 'Kapitein van de Meeuw', hint: 'Maak alle drie de delen van Het Piratenschip af',           test: c => c.worldsDone.includes('piraten') },
    { id: 'hotel',         icon: '🏨', title: 'Sleutel van Aurora',    hint: 'Maak alle drie de delen van Grand Hotel Aurora af',          test: c => c.worldsDone.includes('hotel') },
    { id: 'ruimte',        icon: '🚀', title: 'Orion gaat uit',        hint: 'Maak alle drie de delen van Station Orion af',               test: c => c.worldsDone.includes('ruimte') },
    { id: 'vlekkeloos',    icon: '⭐', title: 'Vlekkeloos',            hint: 'Haal tien keer drie sterren in de campagne',                 test: c => c.threeStars >= 10 },
    { id: 'archivaris',    icon: '📁', title: 'Archivaris',            hint: 'Los vijf archiefdossiers op',                                test: c => c.archiveCount >= 5 },
    { id: 'weekzaak',      icon: '🗓️', title: 'Zaak van de week',      hint: 'Los een zaak van de week op',                                test: c => !!c.weekDone },
    { id: 'verzamelaar',   icon: '🗄️', title: 'Verzamelaar',           hint: 'Verzamel 24 bewijsstukken in de vitrine',                    test: c => c.evidence >= 24 },
    { id: 'punten',        icon: '🪙', title: 'Vijfduizend punten',    hint: 'Verzamel 5000 punten',                                       test: c => c.points >= 5000 },
    { id: 'meester',       icon: '🎖️', title: 'Meesterdetective',      hint: 'Bereik de hoogste rang',                                     test: c => c.rankTitle === 'Meesterdetective' }
  ],
  medals() { return this.json('crimson-medals', {}); },
  medalCount() { return Object.keys(this.medals()).length; },
  // controleer alle nog niet behaalde medailles; geeft de nieuw behaalde terug
  checkMedals(ctx) {
    const have = this.medals(), won = [];
    for (const m of this.MEDALS) {
      if (have[m.id]) continue;
      let ok = false;
      try { ok = !!m.test(ctx); } catch (e) { ok = false; }
      if (ok) { have[m.id] = this.dayKey(); won.push(m); }
    }
    if (won.length) this.set('crimson-medals', JSON.stringify(have));
    return won;
  },
  formatDate(key) {
    if (!key) return '';
    const [y, m, d] = key.split('-').map(Number);
    const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    return `${d} ${months[(m || 1) - 1]} ${y}`;
  },

  // ── Vitrine: één bewijsstuk per opgeloste campagnezaak ─────
  evidence(themeId) {
    if (typeof Campaign === 'undefined') return [];
    return Campaign.chaptersFor(themeId).flatMap(ch => ch.cases.map((c, i) => {
      const sp = (c.item || '📦 Bewijsstuk').indexOf(' ');
      return { icon: c.item.slice(0, sp), name: c.item.slice(sp + 1), got: Campaign.stars(ch.key, i) > 0, title: c.title, part: ch.part };
    }));
  },
  evidenceCount() {
    if (typeof Campaign === 'undefined') return 0;
    return WEEK_THEMES.reduce((n, t) => n + this.evidence(t).filter(e => e.got).length, 0);
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Progress, DAILY_TITLES, WEEK_TITLES };

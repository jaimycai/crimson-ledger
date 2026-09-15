// ============================================================
// STORE — de winkel: Crimson Pass, hintpakket, wereldpakketten en
// bordthema's. Eenmalige aankopen via StoreKit (StorePlugin.swift);
// in de browser en in tests een nep-winkel (crimson-store-mock).
// Wat je bezit staat lokaal (crimson-store) en wordt bij elke start
// vergeleken met wat Apple weet, dus herinstalleren is geen probleem.
// Regels: geen levens, geen wachttijden, geen advertenties. Wat gratis
// is blijft gratis: Landhuis en Piratenschip, de dagelijkse zaak, de
// zaak van de week en het archief in álle werelden.
// ============================================================

const Store = {
  APP: 'nl.crimsonledger.app',
  IDS: {
    pass: 'nl.crimsonledger.app.pass',
    hints: 'nl.crimsonledger.app.hints10',
    cosmetics: 'nl.crimsonledger.app.cosmetics'
  },
  worldId(id) { return `${this.APP}.world.${id}`; },
  FREE_WORLDS: ['landhuis', 'piraten'],
  FREE_HINTS_PER_DAY: 3,
  HINT_PACK: 10,
  // vaste prijzen als App Store Connect (nog) niet bereikbaar is
  PRICES: { pass: '€ 4,99', hints: '€ 0,99', cosmetics: '€ 1,99', world: '€ 1,99' },
  SKINS: [
    { id: 'papier', name: 'Papier', free: true },
    { id: 'nacht', name: 'Nacht' },
    { id: 'sepia', name: 'Sepia' },
    { id: 'kraft', name: 'Kraftpapier' }
  ],
  FRAMES: [
    { id: 'geen', name: 'Geen lijst', free: true },
    { id: 'goud', name: 'Gouden lijst' },
    { id: 'zilver', name: 'Zilveren lijst' },
    { id: 'crimson', name: 'Crimson lijst' }
  ],

  get(k) { return typeof App !== 'undefined' ? App.storageGet(k) : null; },
  set(k, v) { if (typeof App !== 'undefined') App.storageSet(k, v); },
  json(k, fb) { try { const v = JSON.parse(this.get(k) || 'null'); return v === null ? fb : v; } catch (e) { return fb; } },

  // ── Bezit ──────────────────────────────────────────────────
  state() { return this.json('crimson-store', { pass: false, worlds: [], cosmetics: false }); },
  save(st) { this.set('crimson-store', JSON.stringify(st)); },
  hasPass() { return !!this.state().pass; },
  ownsCosmetics() { const st = this.state(); return !!st.pass || !!st.cosmetics; },
  isPaidWorld(id) { return !this.FREE_WORLDS.includes(id); },
  ownsWorld(id) {
    if (!this.isPaidWorld(id)) return true;
    const st = this.state();
    return !!st.pass || (st.worlds || []).includes(id);
  },
  paidWorlds() { return typeof Themes !== 'undefined' ? Themes.list().map(t => t.id).filter(id => this.isPaidWorld(id)) : []; },

  // ── Hints: drie per dag gratis, daarna een pakket of de Pass ──
  dayKey() { return typeof Progress !== 'undefined' ? Progress.dayKey() : new Date().toDateString(); },
  hintsBought() { return Math.max(0, +this.get('crimson-hints') || 0); },
  hintsToday() { const t = this.json('crimson-hints-day', null); return t && t.day === this.dayKey() ? t.used : 0; },
  freeLeft() { return Math.max(0, this.FREE_HINTS_PER_DAY - this.hintsToday()); },
  hintsLeft() { return this.hasPass() ? Infinity : this.freeLeft() + this.hintsBought(); },
  canHint() { return this.hintsLeft() > 0; },
  // boekt een hint af: eerst de gratis van vandaag, dan de gekochte
  useHint() {
    if (this.hasPass()) return true;
    if (this.freeLeft() > 0) { this.set('crimson-hints-day', JSON.stringify({ day: this.dayKey(), used: this.hintsToday() + 1 })); return true; }
    if (this.hintsBought() > 0) { this.set('crimson-hints', String(this.hintsBought() - 1)); return true; }
    return false;
  },
  hintLabel() { const n = this.hintsLeft(); return n === Infinity ? '∞' : String(n); },

  // ── Wat een aankoop oplevert ──────────────────────────────
  grant(productId) {
    const st = this.state();
    if (productId === this.IDS.pass) st.pass = true;
    else if (productId === this.IDS.cosmetics) st.cosmetics = true;
    else if (productId === this.IDS.hints) { this.set('crimson-hints', String(this.hintsBought() + this.HINT_PACK)); return st; }
    else {
      const w = this.paidWorlds().find(id => this.worldId(id) === productId);
      if (w && !(st.worlds || []).includes(w)) st.worlds = [...(st.worlds || []), w];
    }
    this.save(st);
    return st;
  },
  applyEntitlements(ids) {
    const st = this.state();
    st.pass = ids.includes(this.IDS.pass) || !!st.pass;
    st.cosmetics = ids.includes(this.IDS.cosmetics) || !!st.cosmetics;
    const worlds = new Set(st.worlds || []);
    this.paidWorlds().forEach(w => { if (ids.includes(this.worldId(w))) worlds.add(w); });
    st.worlds = [...worlds];
    this.save(st);
    return st;
  },

  // ── Verbinding met Apple (of de nep-winkel) ──────────────
  plugin() { try { const P = window.Capacitor && window.Capacitor.Plugins; return (P && P.Store) || null; } catch (e) { return null; } },
  mock() { return !this.plugin() && this.get('crimson-store-mock') === '1'; },
  available() { return !!this.plugin() || this.mock(); },
  allIds() { return [this.IDS.pass, this.IDS.hints, this.IDS.cosmetics, ...this.paidWorlds().map(w => this.worldId(w))]; },
  async refresh() {
    const P = this.plugin();
    if (!P) return this.state();
    try { const r = await P.entitlements(); return this.applyEntitlements(r.ids || []); } catch (e) { return this.state(); }
  },
  // prijzen uit App Store Connect; onthouden zodat de winkel meteen iets toont
  async loadPrices() {
    const P = this.plugin();
    if (!P) return this.json('crimson-store-prices', {});
    try {
      const r = await P.products({ ids: this.allIds() });
      const map = {};
      (r.products || []).forEach(p => { map[p.id] = p.price; });
      this.set('crimson-store-prices', JSON.stringify(map));
      return map;
    } catch (e) { return this.json('crimson-store-prices', {}); }
  },
  price(productId) {
    const map = this.json('crimson-store-prices', {});
    if (map[productId]) return map[productId];
    if (productId === this.IDS.pass) return this.PRICES.pass;
    if (productId === this.IDS.hints) return this.PRICES.hints;
    if (productId === this.IDS.cosmetics) return this.PRICES.cosmetics;
    return this.PRICES.world;
  },
  // koopt één product; geeft { ok, state } terug
  async buy(productId) {
    if (this.mock()) { this.grant(productId); return { ok: true, state: 'purchased' }; }
    const P = this.plugin();
    if (!P) return { ok: false, state: 'unavailable' };
    try {
      const r = await P.purchase({ id: productId });
      if (r.state === 'purchased') { this.grant(productId); return { ok: true, state: 'purchased' }; }
      return { ok: false, state: r.state || 'unknown' };
    } catch (e) { return { ok: false, state: 'error', error: String(e && e.message || e) }; }
  },
  async restore() {
    if (this.mock()) return this.state();
    const P = this.plugin();
    if (!P) return this.state();
    try { const r = await P.restore(); return this.applyEntitlements(r.ids || []); } catch (e) { return this.state(); }
  },

  // ── Uiterlijk (bordthema en portretlijst) ─────────────────
  skin() { const s = this.get('crimson-skin') || 'papier'; return this.SKINS.some(x => x.id === s) ? s : 'papier'; },
  frame() { const f = this.get('crimson-frame') || 'geen'; return this.FRAMES.some(x => x.id === f) ? f : 'geen'; },
  canUse(item) { return !!item.free || this.ownsCosmetics(); },
  setSkin(id) { const it = this.SKINS.find(x => x.id === id); if (!it || !this.canUse(it)) return false; this.set('crimson-skin', id); this.applyLook(); return true; },
  setFrame(id) { const it = this.FRAMES.find(x => x.id === id); if (!it || !this.canUse(it)) return false; this.set('crimson-frame', id); this.applyLook(); return true; },
  applyLook() {
    if (typeof document === 'undefined') return;
    const skin = this.ownsCosmetics() ? this.skin() : 'papier', frame = this.ownsCosmetics() ? this.frame() : 'geen';
    document.documentElement.dataset.skin = skin;
    document.documentElement.dataset.frame = frame;
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Store };

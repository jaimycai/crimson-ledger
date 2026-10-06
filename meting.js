// ============================================================
// METING — anonieme tellers. De app stuurt alleen de naam van een
// gebeurtenis en een paar grove kenmerken (platform, taal, versie,
// een getal). Geen id, geen toestelkenmerk, geen account. Uit te
// zetten in Instellingen; staat hij uit, dan gaat er niets weg.
// ============================================================
const Meting = {
  URL: 'https://crimson-meting.spaarplan-data.workers.dev/e',
  VERSION: '1.1.3',
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { if (typeof App !== 'undefined') App.storageSet(k, v); else { try { localStorage.setItem(k, v); } catch (e) { /* privémodus */ } } },
  on() { return this.get('crimson-meting') !== '0'; },
  // De iOS-simulator zet 'CrimsonSimulator' in de user agent (MainViewController): testruns tellen niet mee.
  test() { return typeof navigator !== 'undefined' && /CrimsonSimulator/.test(navigator.userAgent || ''); },
  setOn(v) { this.set('crimson-meting', v ? '1' : '0'); },
  platform() {
    try { const C = window.Capacitor; if (C && C.isNativePlatform && C.isNativePlatform()) return C.getPlatform() === 'android' ? 'android' : 'ios'; } catch (e) { /* web */ }
    return 'web';
  },
  lang() { return (typeof I18n !== 'undefined' && I18n.lang === 'en') ? 'en' : 'nl'; },
  day(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
  // stuurt één teller; faalt stil (offline is normaal voor dit spel)
  send(e, a = '', n = 0) {
    if (!this.on() || this.test() || typeof fetch === 'undefined') return;
    try {
      fetch(this.URL, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ e, a: String(a), n: Number(n) || 0, p: this.platform(), l: this.lang(), v: this.VERSION }) }).catch(() => {});
    } catch (err) { /* geen netwerk */ }
  },
  // één keer per dag: hoeveel dagen na de eerste start komt iemand terug
  open() {
    const today = this.day();
    let first = this.get('crimson-first-day');
    if (!first) { first = today; this.set('crimson-first-day', first); }
    if (this.get('crimson-meting-day') === today) return;
    this.set('crimson-meting-day', today);
    const dn = Math.max(0, Math.round((new Date(today) - new Date(first)) / 864e5));
    this.send('open', '', Math.min(dn, 400));
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = { Meting };

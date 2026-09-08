// ============================================================
// SOUND — kleine gesynthetiseerde geluiden via WebAudio, geen
// bestanden. Uit te zetten in het menu.
// ============================================================
const Sound = {
  enabled: true,
  ctx: null,

  init(stored) {
    this.enabled = stored !== '0';
    const unlock = () => { this.ensure(); if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {}); };
    ['pointerdown', 'touchstart', 'keydown'].forEach(ev => document.addEventListener(ev, unlock, { once: true, passive: true }));
  },
  ensure() {
    if (this.ctx) return this.ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    } catch (e) { this.ctx = null; }
    return this.ctx;
  },
  toggle() { this.enabled = !this.enabled; return this.enabled; },

  tone(freq, dur, type = 'sine', gain = 0.08, when = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime + when);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + when); o.stop(ctx.currentTime + when + dur + 0.02);
  },
  play(name) {
    if (!this.enabled) return;
    try {
      if (name === 'place')      { this.tone(660, 0.07, 'triangle', 0.07); this.tone(990, 0.05, 'triangle', 0.04, 0.03); }
      else if (name === 'error') { this.tone(160, 0.12, 'sawtooth', 0.05); }
      else if (name === 'mark')  { this.tone(440, 0.05, 'square', 0.03); }
      else if (name === 'win')   { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.07, i * 0.09)); }
      else if (name === 'ui')    { this.tone(520, 0.04, 'sine', 0.03); }
      else if (name === 'clue')  { this.tone(784, 0.06, 'triangle', 0.05, 0.12); this.tone(1175, 0.1, 'triangle', 0.05, 0.19); }
    } catch (e) { /* audio niet beschikbaar */ }
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = { Sound };

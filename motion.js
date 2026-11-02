// Beweging 1.6: de grote momenten van een zaak (keuze Jaimy, 2 november 2026; voorbeelden in versie 2 van de
// keuzepagina). De stempel, de bekentenis, het bord dat je uitslag wordt, het grootboek, de streakvlam, Van Dam die
// wijst na stilzitten en het laadscherm met zinnetjes. Alles met Web Animations en één canvas voor deeltjes, zonder
// bibliotheek. Zonder element.animate (jsdom, een oude webview) of met "Beperk beweging" laat elke functie meteen het
// eindbeeld zien, zodat het spel werkt zoals vóór 1.6. Teksten komen vertaald binnen vanuit app.js en board.js.
const Motion = {
  STAMP_MS: 560,
  STAMP_HIT: 482,      // ms vanaf de start van de stempel tot de klap op het papier
  PAPER: ['#8B2E1C', '#B8955C', '#D4B074', '#A8432E', '#2E7D32', '#F4EAD5'],

  get ok() {
    try {
      if (typeof Element === 'undefined' || typeof Element.prototype.animate !== 'function') return false;
      return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) { return false; }
  },

  // Trilling per soort moment: light, medium en heavy zijn één tik; success, warning en error het patroon van iOS.
  // Zo voelt een foute beschuldiging anders dan de goede (tot 1.5 trilden ze hetzelfde).
  haptic(kind) {
    try {
      const H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      const style = { light: 'LIGHT', medium: 'MEDIUM', heavy: 'HEAVY' }[kind];
      const type = { success: 'SUCCESS', warning: 'WARNING', error: 'ERROR' }[kind];
      if (H && style && H.impact) return H.impact({ style }).catch(() => {});
      if (H && type && H.notification) return H.notification({ type }).catch(() => {});
      if (navigator.vibrate) navigator.vibrate({ light: 8, medium: 18, heavy: 30, success: [12, 60, 18], warning: [20, 80, 20], error: [30, 50, 30, 50, 30] }[kind] || 15);
    } catch (e) { /* geen trilling op dit toestel */ }
  },

  play(el, frames, opts) {
    if (!el || !this.ok) return null;
    try { return el.animate(frames, opts); } catch (e) { return null; }
  },
  center(el) { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; },
  // Spoelt de animaties van dit scherm door naar het eind (tikken om de ceremonie over te slaan). CSS-animaties blijven
  // staan: een oneindige kan niet eindigen.
  finish(root) {
    if (!root || typeof root.getAnimations !== 'function') return;
    root.getAnimations({ subtree: true }).forEach(a => {
      if ((typeof CSSAnimation !== 'undefined' && a instanceof CSSAnimation) || (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition)) return;
      try { a.finish(); } catch (e) { /* oneindig */ }
    });
  },

  // ── Deeltjes: één canvas over het hele scherm; zwaartekracht, luchtweerstand, draaien; papier fladdert ──
  fx: null, parts: [], raf: 0, last: 0,
  burst(x, y, o) {
    if (!this.ok) return;
    if (!this.fx || !this.fx.isConnected) {
      this.fx = document.createElement('canvas');
      this.fx.className = 'mo-fx';
      this.fx.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.fx);
    }
    if (!this.fx.getContext || !this.fx.getContext('2d')) return;
    const R = (a, b) => a + Math.random() * (b - a), spread = o.spread || 0;
    for (let i = 0; i < o.n; i++) {
      const a = R(o.a0, o.a1), v = R(o.v0, o.v1);
      this.parts.push({ x: x + R(-spread, spread), y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: R(0, 6.3), vr: R(-0.3, 0.3),
        s: R(o.s0, o.s1), c: o.cols[i % o.cols.length], life: 1, ph: R(0, 6.3), o });
    }
    if (!this.raf) { this.last = performance.now(); this.raf = requestAnimationFrame(t => this.step(t)); }
  },
  step(t) {
    const c = this.fx, g = c.getContext('2d'), dpr = window.devicePixelRatio || 1, W = window.innerWidth, H = window.innerHeight;
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const dt = Math.min(32, t - this.last) / 16.7;
    this.last = t;
    this.parts = this.parts.filter(p => p.life > 0 && p.y < H + 40 && p.y > -80);
    for (const p of this.parts) {
      const o = p.o;
      p.vy += o.grav * dt; p.vx *= Math.pow(o.drag, dt); p.vy *= Math.pow(o.drag, dt);
      if (o.flutter) p.vx += Math.sin(t / 180 + p.ph) * 0.08 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= o.fade * dt;
      g.save();
      g.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
      g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c;
      if (o.shape === 'paper') { g.scale(1, Math.abs(Math.cos(t / 120 + p.ph))); g.fillRect(-p.s, -p.s * 0.6, p.s * 2, p.s * 1.2); }
      else {
        if (o.shape === 'spark') g.globalCompositeOperation = 'lighter';
        g.beginPath(); g.arc(0, 0, Math.max(0, o.shape === 'spark' ? p.s * p.life : p.s), 0, 6.3); g.fill();
      }
      g.restore();
    }
    this.raf = this.parts.length ? requestAnimationFrame(tt => this.step(tt)) : 0;
    if (!this.raf) g.clearRect(0, 0, W, H);
  },
  // papieren confetti die van boven naar beneden fladdert; false als er geen beweging is (dan doet board.js de oude)
  confetti() {
    if (!this.ok) return false;
    const W = window.innerWidth;
    this.burst(W / 2, -12, { n: 80, spread: W / 2, a0: 1.2, a1: 1.95, v0: 1, v1: 5, s0: 3, s1: 6, grav: 0.14, drag: 0.975, fade: 0.006, cols: this.PAPER, shape: 'paper', flutter: true });
    return true;
  },

  // ── 1. De stempel: komt omhoog, hangt even boven het papier en valt hard. Geeft de tijd tot de klap terug. ──
  stamp(el) {
    if (!el) return 0;
    if (!this.ok) { el.classList.remove('pending'); return 0; }
    el.style.transition = 'none';   // de CSS-overgang van .pending zou over de animatie heen lopen
    el.classList.remove('pending');
    const a = this.play(el, [
      { opacity: 0, transform: 'translateY(-10px) scale(2.3) rotate(-18deg)', easing: 'cubic-bezier(.2,.7,.3,1)' },
      { opacity: 0.95, transform: 'translateY(-30px) scale(2.6) rotate(-15deg)', offset: 0.55, easing: 'ease-in-out' },
      { opacity: 1, transform: 'translateY(-36px) scale(2.65) rotate(-15deg)', offset: 0.72, easing: 'cubic-bezier(.7,0,.9,.4)' },
      { opacity: 1, transform: 'translateY(0) scale(.95) rotate(-7deg)', offset: 0.86, easing: 'cubic-bezier(.2,.8,.3,1)' },
      { opacity: 1, transform: 'rotate(-7deg)' }
    ], { duration: this.STAMP_MS });
    const done = () => { el.style.transition = ''; };
    if (a) { a.onfinish = done; a.oncancel = done; } else done();
    return this.STAMP_HIT;
  },
  // de klap: inkt spat weg, stof waait op, het papier deukt in en veert terug, één zware tik
  impact(stamp, paper) {
    if (!this.ok || !stamp) return;
    this.haptic('heavy');
    const [x, y] = this.center(stamp);
    const ink = getComputedStyle(stamp).color || '#2E7D32';
    this.burst(x, y, { n: 26, a0: 0, a1: 6.3, v0: 2, v1: 7, s0: 1.5, s1: 3.4, grav: 0.12, drag: 0.94, fade: 0.022, cols: [ink], shape: 'dot' });
    this.burst(x, y + 8, { n: 16, a0: 3.4, a1: 6, v0: 1, v1: 3, s0: 4, s1: 9, grav: -0.02, drag: 0.96, fade: 0.018, cols: ['rgba(140,120,100,.22)'], shape: 'dot' });
    this.play(paper, [
      { transform: 'none' }, { transform: 'translateY(3px) scaleY(.975)', offset: 0.1 },
      { transform: 'translateY(-1px) scaleY(1.006)', offset: 0.45 }, { transform: 'none' }
    ], { duration: 560, easing: 'ease-out' });
  },

  // ── 2. De bekentenis: het licht valt weg rond de dader, "Jij was het!" slaat erop, het portret trilt uit, barst
  //    en verbleekt; dan typt de bekentenis zich letter voor letter. Geeft de duur terug (0 = geen beweging). ──
  confess(btn, react, accuseText) {
    if (!this.ok || !btn) return 0;
    this.confessEnd();
    const [x, y] = this.center(btn);
    const vig = document.createElement('div');
    vig.className = 'mo-vig';
    vig.style.setProperty('--x', `${x}px`); vig.style.setProperty('--y', `${y}px`);
    const tag = document.createElement('span');
    tag.className = 'mo-accuse';
    tag.textContent = accuseText;
    tag.style.left = `${x}px`; tag.style.top = `${btn.getBoundingClientRect().top + 2}px`;   // boven het portret, zodat de barst te zien is
    document.body.append(vig, tag);
    this.confessEls = [vig, tag];
    const ava = btn.querySelector('.accuse-ava') || btn;
    const quote = react && react.querySelector('.react-q');
    const full = quote ? quote.textContent : '';
    if (react) react.hidden = true;
    const at = (ms, fn) => { const id = setTimeout(fn, ms); this.confessTimers.push(id); };
    this.play(vig, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, fill: 'forwards' });
    this.play(btn, [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }], { duration: 560, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
    this.play(tag, [
      { opacity: 0, transform: 'translate(-50%, -50%) scale(2.6) rotate(-12deg)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1) rotate(-4deg)' }
    ], { duration: 220, delay: 380, easing: 'cubic-bezier(.7,0,.9,.4)', fill: 'both' });
    at(600, () => {
      this.haptic('success');
      if (typeof Sound !== 'undefined') Sound.play('stamp');
      this.play(ava, [
        { transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(-7px) rotate(-4deg)' }, { transform: 'translateX(6px) rotate(3deg)' },
        { transform: 'translateX(-5px) rotate(-2deg)' }, { transform: 'translateX(4px) rotate(1deg)' }, { transform: 'translateX(-2px) rotate(0)' },
        { transform: 'translateX(1px) rotate(0)' }, { transform: 'translateX(0) rotate(0)' }
      ], { duration: 520 });
    });
    at(780, () => this.haptic('light'));
    at(940, () => this.haptic('light'));
    at(1020, () => {
      ava.classList.add('mo-cracked');
      ava.insertAdjacentHTML('beforeend', '<svg class="mo-crack" viewBox="0 0 100 100" aria-hidden="true"><path d="M54 4 L47 30 L57 42 L45 63 L51 84"/><path d="M57 42 L77 50 L86 69"/><path d="M47 30 L27 38"/></svg>');
      ava.querySelectorAll('.mo-crack path').forEach((p, i) => this.play(p, [{ strokeDashoffset: 120 }, { strokeDashoffset: 0 }], { duration: 250, delay: i * 80, easing: 'ease-out', fill: 'both' }));
      this.play(ava, [{ filter: 'brightness(2.2)' }, { filter: 'grayscale(.85) contrast(1.15) brightness(.92)' }], { duration: 600, easing: 'ease-out', fill: 'forwards' });
    });
    at(1180, () => {
      if (react) react.hidden = false;
      if (quote && full) this.type(quote, full, 820);
    });
    at(2150, () => this.play(vig, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }));
    return 2300;
  },
  confessEls: [], confessTimers: [],
  confessEnd() {
    this.confessTimers.forEach(clearTimeout); this.confessTimers = [];
    this.confessEls.forEach(el => el.remove()); this.confessEls = [];
  },
  // tekst letter voor letter (graphemen, zodat Hindi, Bengaals en emoji heel blijven)
  type(el, text, ms) {
    let chars;
    try { chars = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map(s => s.segment); } catch (e) { chars = Array.from(text); }
    const t0 = performance.now();
    const tick = t => {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = chars.slice(0, Math.round(chars.length * k)).join('');
      if (k < 1 && el.isConnected) requestAnimationFrame(tick); else el.textContent = text;
    };
    el.textContent = '';
    requestAnimationFrame(tick);
  },

  // ── 3. Het bord wordt je uitslag: een golf van goud over de kamers, papier vliegt op, het bord klapt weg. ──
  boardOut(grid, done) {
    if (!this.ok || !grid) return done();
    const cells = [...grid.querySelectorAll('.bcell')];
    let max = 0;
    cells.forEach(el => {
      const d = (+el.dataset.x || 0) + (+el.dataset.y || 0);
      max = Math.max(max, d);
      this.play(el, [
        { transform: 'scale(1)', filter: 'none' },
        { transform: 'scale(1.14)', filter: 'brightness(1.3) sepia(.7) saturate(1.6)', offset: 0.4 },
        { transform: 'scale(1)', filter: 'none' }
      ], { duration: 360, delay: d * 24, easing: 'ease-out' });
    });
    this.haptic('success');
    setTimeout(() => {
      const [x, y] = this.center(grid);
      this.burst(x, y, { n: 44, a0: 3.6, a1: 5.8, v0: 6, v1: 12, s0: 3, s1: 6, grav: 0.22, drag: 0.97, fade: 0.008, cols: this.PAPER, shape: 'paper', flutter: true });
      const a = this.play(grid, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-10px) scale(.3)', opacity: 0 }],
        { duration: 380, easing: 'cubic-bezier(.6,-0.4,.7,.2)', fill: 'forwards' });
      setTimeout(() => { done(); setTimeout(() => { if (a) a.cancel(); }, 450); }, 300);
    }, Math.min(max * 24, 420) + 300);
  },

  // ── 4. Het grootboek: de pen schrijft de nieuwe regel, dan slaat de naam van de dader erop. ──
  ledgerWrite(box) {
    const row = box && box.querySelector('.lg-row.now');
    if (!row) return;
    row.classList.remove('pending');
    if (!this.ok) return;
    const cs = row.querySelector('.lg-case'), who = row.querySelector('.lg-who'), nib = box.querySelector('.lg-nib');
    const rtl = getComputedStyle(box).direction === 'rtl';
    const w = cs.offsetWidth, x0 = rtl ? cs.offsetLeft + w : cs.offsetLeft, y0 = row.offsetTop + row.offsetHeight / 2 - 16;
    this.play(cs, [{ clipPath: rtl ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 600, easing: 'linear', fill: 'backwards' });
    if (nib) this.play(nib, [
      { opacity: 1, transform: `translate(${x0}px, ${y0}px)` },
      { opacity: 1, transform: `translate(${rtl ? x0 - w : x0 + w}px, ${y0}px)`, offset: 0.9 },
      { opacity: 0, transform: `translate(${rtl ? x0 - w : x0 + w}px, ${y0 - 6}px)` }
    ], { duration: 680, easing: 'linear' });
    this.haptic('light');
    this.play(who, [
      { opacity: 0, transform: 'scale(2.2) rotate(-8deg)', filter: 'blur(3px)', easing: 'cubic-bezier(.5,0,.75,0)' },
      { opacity: 1, transform: 'scale(.92) rotate(-2deg)', filter: 'blur(0)', offset: 0.65, easing: 'ease-out' },
      { opacity: 1, transform: 'rotate(-2deg)', filter: 'blur(0)' }
    ], { duration: 380, delay: 660, fill: 'backwards' });
    setTimeout(() => this.haptic('medium'), 660 + 250);
  },

  // ── 5. De streakvlam: de grijze vlam zuigt in, ontbrandt met een ring en vonken, het getal rolt door. ──
  flame(flameEl, countEl, from, to, today) {
    if (!this.ok || !flameEl) return;
    this.haptic('light');
    this.play(flameEl, [
      { transform: 'scale(1)', color: '#A89C92' },
      { transform: 'scale(.8)', color: '#A89C92', offset: 0.25 },
      { transform: 'scale(1.32)', color: '#F2A33A', offset: 0.38 },
      { transform: 'scale(.92)', offset: 0.55 },
      { transform: 'scale(1.06)', offset: 0.72 },
      { transform: 'scale(.98)', offset: 0.86 },
      { transform: 'scale(1)' }
    ], { duration: 1300, easing: 'ease-in-out' });
    setTimeout(() => {
      this.haptic('success');
      const ring = document.createElement('span');
      ring.className = 'mo-ring';
      flameEl.appendChild(ring);
      const a = this.play(ring, [{ opacity: 0.9, transform: 'scale(.4)' }, { opacity: 0, transform: 'scale(2.2)' }], { duration: 600, easing: 'ease-out' });
      if (a) a.onfinish = () => ring.remove(); else ring.remove();
      const [x, y] = this.center(flameEl);
      this.burst(x, y - 4, { n: 34, a0: 4.1, a1: 5.3, v0: 2, v1: 6, s0: 1.2, s1: 3, grav: -0.05, drag: 0.97, fade: 0.016, cols: ['#F7C66A', '#EE7A27', '#FFE7A3'], shape: 'spark' });
    }, 330);
    if (countEl && from !== to) {
      countEl.textContent = from;
      setTimeout(() => {
        const out = this.play(countEl, [{ transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' }, { transform: 'translateY(-60%)', opacity: 0, filter: 'blur(2px)' }], { duration: 150, easing: 'ease-in' });
        const swap = () => {
          countEl.textContent = to;
          this.play(countEl, [{ transform: 'translateY(60%)', opacity: 0, filter: 'blur(2px)' }, { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' }], { duration: 340, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        };
        if (out) out.onfinish = swap; else swap();
      }, 420);
    }
    const mark = today && today.querySelector('i');
    if (mark) this.play(mark, [{ transform: 'scale(.6)' }, { transform: 'scale(1)' }], { duration: 500, delay: 760, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
  },

  // ── 6. Van Dam wijst na stilzitten: de rest dimt, de verklaring die helpt komt omhoog en wiebelt, zijn tip typt
  //    zich. Weg bij de volgende zet (stuckClear vanuit Board.after). ──
  stuckOn: false,
  stuck(screen, card, host, img, text) {
    if (!screen || !card || !host) return false;
    this.stuckClear();
    this.stuckOn = true;
    screen.classList.add('mo-stuck');
    card.classList.add('mo-lift');
    const tip = document.createElement('div');
    tip.className = 'mo-tip';
    tip.setAttribute('role', 'status');
    const pic = document.createElement('img');
    pic.src = img; pic.alt = '';
    const say = document.createElement('span');
    say.textContent = text;
    tip.append(pic, say);
    host.appendChild(tip);
    if (this.ok) {
      this.haptic('light');
      this.play(card, [{ rotate: '0deg' }, { rotate: '-1.6deg' }, { rotate: '1.6deg' }, { rotate: '-1deg' }, { rotate: '.6deg' }, { rotate: '0deg' }], { duration: 800, delay: 450, easing: 'ease-in-out' });
      this.play(tip, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 600, fill: 'backwards', easing: 'ease-out' });
      setTimeout(() => { if (say.isConnected) this.type(say, text, 1300); }, 600);
    }
    return true;
  },
  stuckClear() {
    if (!this.stuckOn) return;
    this.stuckOn = false;
    document.querySelectorAll('.mo-stuck').forEach(el => el.classList.remove('mo-stuck'));
    document.querySelectorAll('.mo-lift').forEach(el => el.classList.remove('mo-lift'));
    document.querySelectorAll('.mo-tip').forEach(el => el.remove());
  },

  // ── 7. Laadscherm: zinnetjes wisselen met een zachte vervaging tot de knop er is. Geeft een stopfunctie terug. ──
  lines(el, lines, every = 520) {
    if (!el || !lines.length) return () => {};
    let i = 0;
    el.textContent = lines[0];
    const id = setInterval(() => {
      i = (i + 1) % lines.length;
      if (!this.ok) { el.textContent = lines[i]; return; }
      const out = this.play(el, [{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(4px)', transform: 'translateY(-5px)' }], { duration: 180, fill: 'forwards' });
      const next = () => {
        el.textContent = lines[i];
        if (out) out.cancel();
        this.play(el, [{ opacity: 0, filter: 'blur(4px)', transform: 'translateY(5px)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }], { duration: 240, easing: 'ease-out' });
      };
      if (out) out.onfinish = next; else next();
    }, every);
    return () => clearInterval(id);
  }
};
if (typeof window !== 'undefined') window.Motion = Motion;

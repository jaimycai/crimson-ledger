// Rive (1.6, keuze Jaimy 2 november 2026): de levende streakvlam op het thuisscherm en Van Dam groot in de briefing.
// De bestanden komen uit art/rive/ (gen_vlam.py, gen_vandam.py) en staan gebouwd in assets/rive/; de runtime
// (@rive-app/canvas-lite 2.49.0, MIT) staat in vendor/rive/ en wordt pas geladen als er voor het eerst een Rive-canvas
// nodig is. Alles offline: de wasm komt uit dezelfde map, de terugval naar een CDN staat uit.
// Zonder Rive (geen Web Animations zoals in jsdom, "Beperk beweging", geen WebAssembly, laden mislukt) blijft alles
// zoals in 1.5: het vlamicoon met Motion.flame en de stilstaande foto van Van Dam.
const RiveArt = {
  VENDOR: 'vendor/rive/',
  ASSETS: 'assets/rive/',
  TIMEOUT_MS: 8000,
  disabled: false,     // noodrem (tests): true = nooit Rive
  promise: null,
  state: 'idle',       // idle | loading | ready | failed

  // Alleen waar beweging mag en kan. Motion.ok is al onwaar in jsdom, bij "Beperk beweging" en zonder element.animate.
  get ok() {
    try {
      if (this.disabled || this.state === 'failed') return false;
      if (typeof window === 'undefined' || typeof document === 'undefined') return false;
      if (typeof Motion === 'undefined' || !Motion.ok) return false;
      return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
    } catch (e) { return false; }
  },

  // De runtime één keer laden (een <script> uit vendor/rive/). Geeft het rive-object of null.
  load() {
    if (this.promise) return this.promise;
    if (!this.ok) return Promise.resolve(null);
    this.state = 'loading';
    this.promise = new Promise(resolve => {
      let done = false;
      const finish = r => { if (done) return; done = true; clearTimeout(timer); resolve(r); };
      const timer = setTimeout(() => finish(null), this.TIMEOUT_MS);
      if (window.rive && window.rive.Rive) return finish(this.setup(window.rive));
      const s = document.createElement('script');
      s.src = this.VENDOR + 'rive.js';
      s.async = true;
      s.onload = () => finish(window.rive && window.rive.Rive ? this.setup(window.rive) : null);
      s.onerror = () => finish(null);
      document.head.appendChild(s);
    }).then(r => { this.state = r ? 'ready' : 'failed'; return r; });
    return this.promise;
  },
  setup(rive) {
    try {
      rive.RuntimeLoader.setWasmUrl(this.VENDOR + 'rive.wasm');
      rive.RuntimeLoader.setWasmFallbackUrl(null);   // nooit naar het CDN
      return rive;
    } catch (e) { return null; }
  },

  // Zet een Rive-canvas in host (dat er zelf de maat voor geeft via CSS). Tot het eerste beeld staat de terugval
  // (icoon of foto) er gewoon; daarna krijgt host de klasse rive-on. Geeft een besturing of null.
  //   init(ctl): waarden zetten vóór het eerste beeld (bijv. lit=false voor het ontsteken)
  mount(host, { src, stateMachine, init }) {
    return this.load().then(rive => {
      if (!rive || !host || !host.isConnected) return null;
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.className = 'rive-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        host.appendChild(canvas);
        let r = null, settled = false;
        const fail = () => {
          if (settled) return;
          settled = true; clearTimeout(timer);
          try { if (r) r.cleanup(); } catch (e) { /* al weg */ }
          canvas.remove();
          resolve(null);
        };
        const timer = setTimeout(fail, this.TIMEOUT_MS);
        try {
          r = new rive.Rive({
            src: this.ASSETS + src, canvas, stateMachine, autoplay: false, autoBind: true, enableRiveAssetCDN: false,
            layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
            onLoad: () => {
              if (settled) return;
              settled = true; clearTimeout(timer);
              const ctl = this.control(r, host, canvas);
              if (!ctl.vm) { try { r.cleanup(); } catch (e) { /* niets */ } canvas.remove(); return resolve(null); }
              r.resizeDrawingSurfaceToCanvas();
              try { if (init) init(ctl); } catch (e) { /* een fout in init mag de vlam niet slopen */ }
              r.play();
              requestAnimationFrame(() => requestAnimationFrame(() => host.classList.add('rive-on')));
              resolve(ctl);
            },
            onLoadError: fail
          });
        } catch (e) { fail(); }
      });
    });
  },

  // Besturing van één Rive-instantie: view-modelwaarden zetten, triggers vuren, tekenen stoppen buiten beeld.
  control(r, host, canvas) {
    const vm = r.viewModelInstance;
    let paused = false, visible = true, io = null;
    const sync = () => { try { if (paused || !visible) r.stopRendering(); else r.startRendering(); } catch (e) { /* niets */ } };
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); sync(); });
      io.observe(canvas);
    }
    const onResize = () => { try { r.resizeDrawingSurfaceToCanvas(); } catch (e) { /* niets */ } };
    window.addEventListener('resize', onResize);
    return {
      vm, rive: r, host, canvas,
      bool(name, v) { try { const p = vm.boolean(name); if (p) p.value = !!v; } catch (e) { /* onbekende naam */ } },
      fire(name) { try { const p = vm.trigger(name); if (p) p.trigger(); } catch (e) { /* onbekende naam */ } },
      pause() { paused = true; sync(); },
      resume() { paused = false; sync(); onResize(); },
      destroy() {
        if (io) io.disconnect();
        window.removeEventListener('resize', onResize);
        try { r.cleanup(); } catch (e) { /* niets */ }
        canvas.remove(); host.classList.remove('rive-on');
      }
    };
  }
};

// ── De streakvlam in de titel van de streakkaart ──
// Brandt zolang de streak leeft (vandaag of gisteren gespeeld, of een vrije dag vangt het gat op), grijs bij 0 of
// een gebroken streak. Bij groei: eerst grijs, dan ontsteken (zuigt in, ring, vonken) en het getal rolt door.
const StreakFlame = {
  host: null, ctl: null, failed: false, lit: true, pending: null,

  // Na elke updateStreakDisplay staat er een nieuwe <span class="streak-flame"> in de titel; de levende vlam blijft
  // dezelfde node (één Rive-instantie) en neemt de plek van de nieuwe over.
  render(title, lit) {
    const span = title && title.querySelector('.streak-flame');
    if (!span) return;
    this.lit = !!lit;
    span.classList.toggle('unlit', !lit);
    if (this.failed || !RiveArt.ok) return;
    if (this.host) {
      if (this.host !== span) span.replaceWith(this.host);
      this.host.classList.toggle('unlit', !lit);
      if (this.ctl && !this.pending) this.ctl.bool('lit', lit);
      return;
    }
    this.host = span;
    const start = () => {
      RiveArt.mount(this.host, {
        src: 'vlam.riv', stateMachine: 'Vlam',
        init: ctl => ctl.bool('lit', this.pending ? false : this.lit)
      }).then(ctl => {
        if (!ctl) return this.giveUp();
        this.ctl = ctl;
        if (this.pending) { const p = this.pending; this.pending = null; this.runIgnite(p); }
      });
    };
    // niet tijdens het opstarten: eerst het thuisscherm tekenen, dan de runtime
    if (typeof requestIdleCallback === 'function') requestIdleCallback(start, { timeout: 700 }); else setTimeout(start, 300);
  },

  // Rive lukte niet: terug naar het icoon, en een wachtende ontsteking alsnog als Web Animation.
  giveUp() {
    this.failed = true;
    const p = this.pending; this.pending = null;
    if (p && typeof Motion !== 'undefined') Motion.flame(this.host, p.countEl, p.from, p.to, p.today);
  },

  // true = Rive doet de vlam (nu of zodra hij geladen is); false = de beller gebruikt Motion.flame op het icoon
  ignite(countEl, from, to, today) {
    if (this.failed || !RiveArt.ok || !this.host || !this.host.isConnected) return false;
    const p = { countEl, from, to, today };
    if (this.ctl) this.runIgnite(p); else this.pending = p;
    return true;
  },
  runIgnite(p) {
    const ctl = this.ctl;
    ctl.bool('lit', false);
    if (p.countEl && p.from !== p.to) p.countEl.textContent = p.from;
    // even grijs laten zien, dan ontsteken; het getal en de dag in de weekstrook volgen Motion.flame (zonder vlam)
    setTimeout(() => {
      ctl.fire('ignite');
      if (typeof Motion !== 'undefined') Motion.flame(null, p.countEl, p.from, p.to, p.today, { rive: true });
    }, 260);
  }
};

// ── Van Dam in de briefing: ademt, knippert, praat zolang je de tekst leest ──
const LiveMentor = {
  ctl: null, host: null, failed: false, loading: false, visible: false, talkTimer: null, wanted: null,

  // Hoe lang hij praat: ongeveer leestempo (zo'n 17 tekens per seconde), tussen 2,5 en 7 seconden.
  talkMs(text) { return Math.max(2500, Math.min(7000, Math.round(String(text || '').length * 60))); },

  show(host, text) {
    this.visible = true;
    if (this.failed || !RiveArt.ok || !host) return;
    const ms = this.talkMs(text);
    const go = ctl => {
      if (!this.visible) return;
      ctl.resume();
      ctl.bool('talk', true);
      clearTimeout(this.talkTimer);
      this.talkTimer = setTimeout(() => ctl.bool('talk', false), ms);
    };
    if (this.ctl && this.host === host) return go(this.ctl);
    this.wanted = go;
    if (this.loading) return;
    this.loading = true; this.host = host;
    RiveArt.mount(host, { src: 'vandam.riv', stateMachine: 'Van Dam' }).then(ctl => {
      this.loading = false;
      if (!ctl) { this.failed = true; return; }
      this.ctl = ctl;
      if (this.visible && this.wanted) this.wanted(ctl); else ctl.pause();
    });
  },

  // Aan de slag (of de briefing gaat dicht): stil en niet meer tekenen.
  hide() {
    this.visible = false;
    clearTimeout(this.talkTimer);
    if (this.ctl) { this.ctl.bool('talk', false); this.ctl.pause(); }
  },

  // happy | hmm: voor later (reacties van Van Dam elders), de briefing gebruikt ze nu niet
  react(kind) { if (this.ctl && this.visible) this.ctl.fire(kind); }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { RiveArt, StreakFlame, LiveMentor };

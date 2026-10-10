// ============================================================
// I18N — taal van de app. Nederlands is de brontaal in de code;
// elke andere taal staat in één eigen bestand, i18n/<taal>.js,
// en alleen de gekozen taal wordt geladen (load, onderaan).
// Drie manieren om tekst te tonen:
//   T`Zaak ${n}: ${title}`  — tekst in de code (sjabloon met gaten)
//   T('Verder')             — losse tekst
//   I18n.translateDom()     — vaste tekst in index.html
// Een vertaling kan een gat laten kiezen: {0|one:zaak|other:zaken}
// kiest op het getal (Intl.PluralRules), {0|m:…|f:…} op het geslacht
// van een naam. Spelinhoud (werelden, zaken, medailles …) wordt bij
// het opstarten ter plekke vervangen (localizeData), dus de rest van
// de code hoeft niets van talen te weten. Zinnen waarin een kamer,
// meubel of naam wordt ingevoegd, bouwt grammar.js.
// Wisselen van taal = herladen.
// ============================================================

const I18n = {
  lang: 'nl',
  // [code, naam in de eigen taal, schrijfrichting, landinstelling voor datums en getallen]
  // Volgorde in de taalkeuze: Nederlands en Engels, dan per schrift.
  LANGS: [
    ['nl', 'Nederlands', 'ltr', 'nl-NL'],
    ['en', 'English', 'ltr', 'en-GB'],
    ['de', 'Deutsch', 'ltr', 'de-DE'],
    ['es', 'Español', 'ltr', 'es'],
    ['fr', 'Français', 'ltr', 'fr-FR'],
    ['id', 'Bahasa Indonesia', 'ltr', 'id-ID'],
    ['pt', 'Português', 'ltr', 'pt-BR'],
    ['vi', 'Tiếng Việt', 'ltr', 'vi-VN'],
    ['ru', 'Русский', 'ltr', 'ru-RU'],
    ['ar', 'العربية', 'rtl', 'ar-u-nu-latn'],
    ['ur', 'اردو', 'rtl', 'ur-PK'],
    ['hi', 'हिन्दी', 'ltr', 'hi-IN'],
    ['mr', 'मराठी', 'ltr', 'mr-u-nu-latn'],
    ['bn', 'বাংলা', 'ltr', 'bn-u-nu-latn'],
    ['te', 'తెలుగు', 'ltr', 'te-IN'],
    ['zh', '简体中文', 'ltr', 'zh-CN'],
    ['ja', '日本語', 'ltr', 'ja-JP']
  ],
  KEY: 'crimson-lang',
  packs() { return (typeof globalThis !== 'undefined' && globalThis.LANG_PACKS) || {}; },
  // het taalbestand van de huidige taal; Nederlands heeft er geen nodig
  pack() { return this.lang === 'nl' ? null : this.packs()[this.lang] || null; },
  supported(code) { return this.LANGS.some(l => l[0] === code); },
  info(code) { return this.LANGS.find(l => l[0] === (code || this.lang)) || this.LANGS[0]; },
  dir() { return this.info()[2]; },
  locale() { return this.info()[3]; },
  read() { try { return localStorage.getItem(this.KEY); } catch (e) { return null; } },
  detect() {
    const saved = this.read();
    if (this.supported(saved)) return saved;
    const nav = typeof navigator === 'undefined' ? [] : (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
    for (const n of nav) {
      const tag = String(n).toLowerCase(), code = tag.split(/[-_]/)[0];
      if (code === 'zh' && /hant|-tw|-hk|-mo/.test(tag)) continue;   // traditioneel Chinees: geen vereenvoudigd tonen
      if (this.supported(code)) return code;
    }
    return 'en';
  },
  // Het taalbestand inladen terwijl de pagina nog wordt gelezen, zodat het klaarstaat
  // voordat de rest van het spel start. In de tests staat het er al.
  load() {
    const lang = this.detect();
    if (lang === 'nl' || this.packs()[lang] || typeof document === 'undefined' || document.readyState !== 'loading') return;
    document.write(`<script src="i18n/${lang}.js"><\/script>`);
  },
  init() {
    this.lang = this.detect();
    if (this.lang !== 'nl' && !this.pack()) this.lang = 'nl';   // taalbestand ontbreekt: dan de brontaal
    if (typeof document !== 'undefined') { document.documentElement.lang = this.lang; document.documentElement.dir = this.dir(); }
    if (this.lang !== 'nl') { this.localizeData(); this.translateDom(); }
    return this.lang;
  },
  // kiezen in de instellingen: onthouden en opnieuw laden
  set(lang) {
    if (!this.supported(lang)) return;
    try { localStorage.setItem(this.KEY, lang); } catch (e) { /* privémodus */ }
    if (typeof App !== 'undefined' && App.storageSet) App.storageSet(this.KEY, lang);
    if (typeof location !== 'undefined' && location.reload) location.reload();
  },

  // ── Tekst in de code ───────────────────────────────────────
  dict() { const p = this.pack(); return p && p.ui ? p.ui : null; },
  t(key) { const d = this.dict(); return d && d[key] ? d[key] : key; },
  template(strings, vals) {
    const key = strings.map((s, i) => s + (i < vals.length ? `{${i}}` : '')).join('');
    const d = this.dict();
    return this.format(d && d[key] ? d[key] : key, vals);
  },
  format(tpl, vals) {
    return tpl.replace(/\{(\d+)((?:\|[a-z]+:[^|{}]*)+)?\}/g, (whole, i, opts) => (opts ? this.choose(vals[+i], opts, whole) : String(vals[+i])));
  },
  // "|m:hij|f:zij" of "|one:zaak|other:zaken": kies de vorm die bij de waarde past.
  // Een naam draagt zijn geslacht als String met .gender (Grammar.who); zonder geslacht geldt m.
  choose(v, opts, whole) {
    const map = {};
    opts.slice(1).split('|').forEach(p => { const i = p.indexOf(':'); map[p.slice(0, i)] = p.slice(i + 1); });
    if (map.m !== undefined || map.f !== undefined) {
      const g = (v && v.gender) || 'm';
      return map[g] !== undefined ? map[g] : (map.m !== undefined ? map.m : map.f);
    }
    const n = Number(v);
    if (v !== null && v !== '' && !isNaN(n)) {
      if (n === 0 && map.zero !== undefined) return map.zero;
      let cat = n === 1 ? 'one' : 'other';
      try { cat = new Intl.PluralRules(this.locale()).select(n); } catch (e) { /* oude browser */ }
      if (map[cat] !== undefined) return map[cat];
    }
    return map.other !== undefined ? map.other : whole;
  },

  // ── Vaste tekst in de pagina ───────────────────────────────
  translateDom(root) {
    if (typeof document === 'undefined') return;
    root = root || document.body;
    const D = this.dict();
    if (!D) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const p = n.parentNode;
      if (!p || p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE') return;
      const raw = n.nodeValue, key = raw.trim();
      if (key && D[key]) n.nodeValue = raw.replace(key, D[key]);
    });
    root.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el => {
      ['aria-label', 'title', 'placeholder'].forEach(a => {
        const v = el.getAttribute(a);
        if (v && D[v]) el.setAttribute(a, D[v]);
      });
    });
    const title = document.querySelector('title');
    if (title && D[title.textContent]) title.textContent = D[title.textContent];
  },

  // ── Spelinhoud ter plekke vervangen ────────────────────────
  localizeData() {
    const P = this.pack();
    if (!P || !P.data) return;
    const DATA = P.data, CAMP = P.campaign;
    const article = DATA.article !== undefined ? DATA.article : '';
    // werelden; de Nederlandse kamernaam blijft bewaard als sleutel voor de zinsbouw
    if (typeof THEMES !== 'undefined') THEMES.forEach(t => {
      const e = DATA.themes[t.id]; if (!e) return;
      ['title', 'short', 'victimName', 'roomWord', 'roomWordPlural', 'tagline', 'intro', 'outro'].forEach(k => { if (e[k]) t[k] = e[k]; });
      t.rooms.forEach(r => { r.key = r.key || r.name; if (e.rooms[r.key]) r.name = e.rooms[r.key]; r.article = article; });
      t.furniture.forEach(f => { if (e.furniture[f.id]) f.nl = e.furniture[f.id]; });
      t.suspects.forEach(s => {
        const nl = s.label;
        if (e.suspects[nl]) s.label = e.suspects[nl];
        if (e.suspectShort && e.suspectShort[nl] && typeof Themes !== 'undefined') Themes.SHORT[s.label] = e.suspectShort[nl];
        if (e.suspectRef && e.suspectRef[nl] && typeof Themes !== 'undefined') Themes.REF[s.label] = e.suspectRef[nl];
      });
    });
    // campagne
    if (CAMP && typeof CAMPAIGN !== 'undefined') CAMPAIGN.forEach(ch => {
      const e = CAMP[ch.key]; if (!e) return;
      ch.title = e[0]; ch.intro = e[1]; ch.outro = e[2]; ch.briefing = e[3];
      ch.cases.forEach((c, i) => { const x = e[4][i]; if (x) { c.title = x[0]; c.story = x[1]; c.item = x[2]; } });
    });
    if (typeof ARCHIVE_STORIES !== 'undefined' && DATA.archiveStories) ARCHIVE_STORIES.splice(0, ARCHIVE_STORIES.length, ...DATA.archiveStories);
    // titels, medailles, opdrachten
    if (typeof DAILY_TITLES !== 'undefined') DAILY_TITLES.splice(0, DAILY_TITLES.length, ...DATA.daily);
    if (typeof WEEK_TITLES !== 'undefined') Object.keys(DATA.week).forEach(k => { WEEK_TITLES[k] = DATA.week[k]; });
    if (typeof Progress !== 'undefined') {
      Progress.MEDALS.forEach(m => { const e = DATA.medals[m.id]; if (e) { m.title = e[0]; m.hint = e[1]; } });
      Progress.QUESTS.forEach(q => { if (DATA.quests[q.id]) q.text = DATA.quests[q.id]; });
    }
    // Van Dam
    if (typeof Mentor !== 'undefined') {
      Mentor.name = DATA.mentorName;
      Mentor.TIPS.forEach(t => { if (DATA.tips[t[0]]) t[1] = DATA.tips[t[0]]; });
      Mentor.INTROS.forEach(i => { const e = DATA.intros[i.id]; if (e) { i.title = e[0]; i.text = e[1]; } });
      Mentor.REACT_WRONG.splice(0, Mentor.REACT_WRONG.length, ...DATA.reactWrong);
      Mentor.REACT_RIGHT.splice(0, Mentor.REACT_RIGHT.length, ...DATA.reactRight);
    }
    // rangen, niveaus, oefenzaak
    if (typeof App !== 'undefined' && App.RANKS) App.RANKS.forEach(r => { if (DATA.ranks[r[1]]) r[1] = DATA.ranks[r[1]]; });
    if (typeof DIFFICULTY !== 'undefined') Object.keys(DATA.difficulty).forEach(k => { if (DIFFICULTY[k]) DIFFICULTY[k].label = DATA.difficulty[k]; });
    if (typeof Board !== 'undefined' && Board.TUTORIAL_STEPS) Board.TUTORIAL_STEPS.forEach((s, i) => { if (DATA.boardTutorial[i]) s.text = DATA.boardTutorial[i]; });
    if (typeof Board !== 'undefined' && Board.TUTORIAL) Board.TUTORIAL.rooms.forEach(r => { r.key = r.key || r.name; const n = DATA.themes.landhuis.rooms[r.key]; if (n) r.name = n; r.article = article; });
  }
};

// T`…` met gaten, of T('…') voor losse tekst
function T(strings, ...vals) {
  if (typeof strings === 'string') return I18n.t(strings);
  return I18n.template(strings, vals);
}

I18n.load();

if (typeof module !== 'undefined' && module.exports) module.exports = { I18n, T };

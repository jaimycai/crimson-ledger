// ============================================================
// GRAMMAR — zinsbouw per taal voor alle zinnen waarin een kamer,
// een meubel, een positie, het kamerwoord of een naam wordt
// ingevoegd (verklaringen, aanwijzingen, de uitleg van Van Dam,
// hints, de vraag bij het beschuldigen). Een woordenboek is daar
// niet genoeg: in veel talen verandert een woord met de zin mee
// ("в кухне", "रसोई में", "in der Küche").
//
// Een taal levert sjablonen met benoemde gaten:
//   {s} {b}          naam van de spreker/het onderwerp, de tweede persoon
//   {room}           de kamer met lidwoord ("de Keuken", "the Kitchen")
//   {room.in}        de kamer als plaats ("in de Keuken") — vorm per taal
//   {furn}           het meubel met onbepaald lidwoord ("een plant")
//   {furn.next} {furn.with}   "naast een plant", "met een plant"
//   {rw} {rws}       het kamerwoord van de wereld (kamer, ruimte, wagon …), meervoud
//   {rw.<vorm>}      een vaste woordgroep met het kamerwoord, per taal en wereld
//   {pos} {pos.loose}         positie in een genoemde kamer / los ("in een hoek van een kamer")
//   {victim} {n} {k} {quote} {nrs}
// en keuzevormen {var|key:tekst|key:tekst}: key m/f kiest op het geslacht van
// een persoon, key zero/one/two/few/many/other op een getal (Intl.PluralRules).
//
// Nederlands is de brontaal hieronder. Engels en de andere talen
// staan in hun eigen taalbestand (LANG_PACKS.<taal>.grammar); wat
// een taal niet zelf invult, leidt de motor af uit de spelgegevens.
// ============================================================

const GRAMMAR_NL = {
  positions: {
    hoek:   { room: 'in een hoek', loose: 'in een hoek van een {rw}' },
    muur:   { room: 'tegen een muur, niet in een hoek', loose: 'tegen een muur, niet in een hoek' },
    midden: { room: 'in het midden, niet tegen een muur', loose: 'midden in een {rw}, niet tegen een muur' }
  },
  derive: { roomIn: 'in {room}', furnNext: 'naast {furn}', furnWith: 'met {furn}', victimDefault: 'Het slachtoffer' },
  templates: {
    statement: {
      'room': 'Ik was in {room}.',
      'not-room': 'Ik was niet in {room}.',
      'room-pos': 'Ik was in {room}, {pos}.',
      'pos': 'Ik stond {pos.loose}.',
      'room-with': 'Ik was in een {rw} met {furn}.',
      'next-to': 'Ik stond direct naast {furn}.',
      'room-next': 'Ik was in {room}, direct naast {furn}.',
      'same-room': 'Ik was in dezelfde {rw} als {b}.',
      'diff-room': 'Ik was niet in dezelfde {rw} als {b}.',
      'adjacent': 'Ik stond direct naast {b}.',
      'not-adjacent': 'Ik stond niet direct naast {b}.',
      'same-row': '{b} en ik stonden op dezelfde rij.',
      'same-col': '{b} en ik stonden in dezelfde kolom.',
      'left-of': 'Ik stond links van {b} op de plattegrond.',
      'above': 'Ik stond hoger op de plattegrond dan {b}.',
      'empty-room': 'Volgens het rapport was er niemand in {room}.',
      'alone': 'Ik was alleen in de {rw}.'
    },
    clue: {
      'room': '{s} was in {room}.',
      'not-room': '{s} was niet in {room}.',
      'room-pos': '{s} was in {room}, {pos}.',
      'pos': '{s} stond {pos.loose}.',
      'room-with': '{s} was in een {rw} met {furn}.',
      'next-to': '{s} stond direct naast {furn}.',
      'room-next': '{s} was in {room}, direct naast {furn}.',
      'same-room': '{s} en {b} waren in dezelfde {rw}.',
      'diff-room': '{s} en {b} waren niet in dezelfde {rw}.',
      'adjacent': '{s} stond direct naast {b}.',
      'not-adjacent': '{s} stond niet direct naast {b}.',
      'same-row': '{s} en {b} stonden op dezelfde rij.',
      'same-col': '{s} en {b} stonden in dezelfde kolom.',
      'left-of': '{s} stond links van {b} op de plattegrond.',
      'above': '{s} stond hoger op de plattegrond dan {b}.',
      'empty-room': 'Er was niemand in {room}.',
      'alone': '{s} was alleen in de {rw}.'
    },
    caseText: '{victim} werd gevonden in {room}. De moordenaar was de enige die zich in die {rw} bevond.',
    explain: {
      'room': '{s} moet ergens in {room} staan. Elk vrij vakje van die {rw} kan.',
      'not-room': '{s} mag overal staan, behalve in {room}.',
      'room-pos.hoek': '{s} staat in een hoek van {room}. Een hoek is een vakje dat twee muren van die {rw} raakt.',
      'room-pos.muur': '{s} staat tegen een muur van {room}, niet in een hoek. Zo\'n vakje raakt precies één muur.',
      'room-pos.midden': '{s} staat in het midden van {room}. Zo\'n vakje raakt geen enkele muur.',
      'pos.hoek': '{s} staat in een hoek van een {rw}. Een hoek is een vakje dat twee muren van die {rw} raakt. In welke {rw} weet je nog niet.',
      'pos.muur': '{s} staat tegen een muur van een {rw}, niet in een hoek. Zo\'n vakje raakt precies één muur. In welke {rw} weet je nog niet.',
      'pos.midden': '{s} staat in het midden van een {rw}. Zo\'n vakje raakt geen enkele muur. In welke {rw} weet je nog niet.',
      'room-with': '{s} staat in een {rw} waar {furn} staat. Zoek eerst dat meubel; elk vrij vakje in die {rw} kan.',
      'next-to': '{s} staat op het vakje links, rechts, boven of onder {furn}. Schuin telt niet.',
      'room-next': '{s} staat in {room}, recht naast {furn}: links, rechts, boven of onder, niet schuin.',
      'same-room': '{s} en {b} staan in dezelfde {rw}. Weet je waar één van de twee staat, dan weet je ook de {rw} van de ander.',
      'diff-room': '{s} en {b} staan in twee verschillende {rws}.',
      'adjacent': '{s} en {b} staan op vakjes die elkaar raken: links, rechts, boven of onder. Een muur ertussen mag.',
      'not-adjacent': '{s} staat niet op een vakje dat {b} raakt (links, rechts, boven of onder). Schuin ernaast mag wel.',
      'same-row': '{s} en {b} staan op dezelfde rij: even hoog op de plattegrond, ook als dat in verschillende {rws} is.',
      'same-col': '{s} en {b} staan in dezelfde kolom: recht boven of onder elkaar. Muren tellen niet.',
      'left-of': '{s} staat in een kolom links van {b}, in welke {rw} dan ook.',
      'above': '{s} staat in een rij hoger dan {b}, in welke {rw} dan ook.',
      'empty-room': 'In {room} staat niemand. Die {rw} kun je overslaan.',
      'alone': '{s} staat in een {rw} waar verder niemand staat.'
    },
    hint: {
      'wrong': '{s} staat verkeerd. Aanwijzing {n} zegt: "{quote}"',
      'two-in-victim-room': 'Er staan twee verdachten in de {rw} van het slachtoffer. Alleen de moordenaar was daar.',
      'start.one': 'Begin met {s}: er zijn nog maar {n} mogelijke vakjes, in {room}.',
      'start.spread': 'Begin met {s}: er zijn nog maar {n} mogelijke vakjes, verdeeld over {k} {rws}.'
    },
    action: {
      'now': ' Nu staat {s} in {room}.',
      'two-in-victim-room': 'In {room} mag maar één persoon staan: de moordenaar. Sleep één van de twee naar een andere {rw}.',
      'then': ' Zet {s} daarna ergens in {room}.',
      'deduce': 'Er is maar één vakje over: het oplichtende vakje. Sleep {s} daarheen.',
      'deduce.in': 'Er is maar één vakje over: het oplichtende vakje in {room}. Sleep {s} daarheen.',
      'narrow': '{s} kan nog op {n} vakjes staan; ze lichten goud op. Zet daar een stipje met het Potlood en probeer ze één voor één: bij elk vakje kijk je of de andere verklaringen nog kloppen.',
      'narrow.in': '{s} kan nog op {n} vakjes staan; ze lichten goud op, in {room}. Zet daar een stipje met het Potlood en probeer ze één voor één: bij elk vakje kijk je of de andere verklaringen nog kloppen.',
      'done': 'Iedereen staat goed. Tik op Controleer en wijs daarna aan wie alleen in {room} staat.'
    },
    board: {
      'accuse': 'Iedereen staat op zijn plek. Wie was alleen met het slachtoffer in {room}?',
      'verdict': '{s} was alleen met het slachtoffer in {room}.',
      'rule': '📜 De spelregel: alleen de moordenaar was in de {rw} van het slachtoffer.'
    }
  }
};

const Grammar = {
  // de grammatica van de huidige taal; ontbrekende delen vallen terug op het Nederlands
  pack() {
    const p = typeof I18n !== 'undefined' && I18n.pack ? I18n.pack() : null;
    return (p && p.grammar) || GRAMMAR_NL;
  },
  tpl(path) {
    const get = (o) => path.split('/').reduce((x, k) => (x ? x[k] : undefined), o);
    const own = get(this.pack().templates || {});
    return own !== undefined ? own : get(GRAMMAR_NL.templates);
  },

  // ── woorden met hun vormen ──────────────────────────────────
  // Een naam als tekst met het geslacht erbij, zodat een keuzevorm {s|m:…|f:…} kan kiezen.
  who(s) { const w = new String(s.label); w.gender = s.gender || 'm'; return w; },
  worldOf(base) { return (base.theme && base.theme.id) || ''; },
  room(base, id) {
    const q = base.rooms.find(x => x.id === id);
    const own = (((this.pack().rooms || {})[this.worldOf(base)]) || {})[q.key || q.name] || {};
    const the = own.the || [q.article === undefined ? 'de' : q.article, q.name].filter(Boolean).join(' ');
    const d = this.pack().derive || GRAMMAR_NL.derive;
    // eigen vormen uit het taalbestand (gen, dat, gender …) gaan mee, zodat een sjabloon {room.gen} kan gebruiken
    return Object.assign({}, own, { name: own.name || q.name, the, in: own.in || this.fill(d.roomIn || 'in {room}', { room: the }) });
  },
  furn(base, id) {
    const own = (this.pack().furniture || {})[id] || {};
    const a = own.a || (base.furnitureNl && base.furnitureNl[id]) || id;
    const d = this.pack().derive || GRAMMAR_NL.derive;
    return Object.assign({}, own, { a, next: own.next || this.fill(d.furnNext, { furn: a }), with: own.with || this.fill(d.furnWith, { furn: a }) });
  },
  rw(base) {
    const th = base.theme || {};
    const own = (this.pack().roomWords || {})[this.worldOf(base)] || {};
    return Object.assign({ rw: th.roomWord || 'kamer', rws: th.roomWordPlural || 'kamers' }, own);
  },
  pos(id) {
    const own = (this.pack().positions || {})[id];
    return own || GRAMMAR_NL.positions[id] || { room: '', loose: '' };
  },

  // ── sjablonen invullen ──────────────────────────────────────
  // Waarden mogen een tekst, een getal, een naam (String met .gender) of een object met vormen zijn.
  fill(tpl, vars) {
    if (tpl === undefined || tpl === null) return '';
    let out = String(tpl);
    for (let pass = 0; pass < 4 && out.includes('{'); pass++) {
      out = out.replace(/\{([a-zA-Z0-9_.]+)((?:\|[a-z]+:[^|{}]*)+)?\}/g, (whole, name, opts) => {
        const [head, form] = name.split('.');
        const v = vars[head];
        if (opts) return this.choose(v, opts, whole);
        if (v === undefined || v === null) return whole;
        if (form) return v[form] !== undefined ? String(v[form]) : whole;
        return typeof v === 'object' && !(v instanceof String) && v.the !== undefined ? v.the
             : typeof v === 'object' && !(v instanceof String) && v.a !== undefined ? v.a
             : typeof v === 'object' && !(v instanceof String) && v.rw !== undefined ? v.rw
             : String(v);
      });
    }
    return out;
  },
  // {var|m:…|f:…} of {var|one:…|few:…|other:…}: dezelfde keuze als in I18n.format
  choose(v, opts, whole) { return typeof I18n !== 'undefined' && I18n.choose ? I18n.choose(v, opts, whole) : whole; },

  // ── de zinnen van het spel ──────────────────────────────────
  vars(clue, base) {
    const v = { rw: this.rw(base) };
    const rw = v.rw;
    v.rws = rw.rws;
    const s = clue.s !== undefined ? clue.s : clue.a;
    if (s !== undefined) v.s = this.who(base.suspects[s]);
    if (clue.b !== undefined) v.b = this.who(base.suspects[clue.b]);
    if (clue.room !== undefined) v.room = this.room(base, clue.room);
    if (clue.furniture !== undefined) v.furn = this.furn(base, clue.furniture);
    if (clue.pos !== undefined) {
      const p = this.pos(clue.pos);
      v.pos = { the: this.fill(p.room, { rw, rws: rw.rws }), room: this.fill(p.room, { rw, rws: rw.rws }), loose: this.fill(p.loose, { rw, rws: rw.rws }) };
    }
    return v;
  },
  clue(clue, base) { return this.fill(this.tpl('clue/' + clue.kind), this.vars(clue, base)); },
  statement(clue, base) {
    const text = this.fill(this.tpl('statement/' + clue.kind), this.vars(clue, base));
    if (clue.kind === 'empty-room') return { who: [], text };
    if (clue.b !== undefined) return { who: [clue.a, clue.b], text };
    return { who: [clue.s], text };
  },
  caseText(base) {
    const d = this.pack().derive || GRAMMAR_NL.derive;
    const victim = base.theme && base.theme.victimName ? base.theme.victimName : (d.victimDefault || GRAMMAR_NL.derive.victimDefault);
    return this.fill(this.tpl('caseText'), { victim, room: this.room(base, base.victim.roomId), rw: this.rw(base) });
  },
  explain(clue, base) {
    const key = clue.kind === 'room-pos' || clue.kind === 'pos' ? `${clue.kind}.${clue.pos}` : clue.kind;
    return this.fill(this.tpl('explain/' + key), this.vars(clue, base));
  },
  // vrije zinnen: hint, action, board — extra = { s: index, room: id, n, k, quote, … }
  text(path, base, extra = {}) {
    const v = { rw: this.rw(base) };
    v.rws = v.rw.rws;
    for (const [k, x] of Object.entries(extra)) {
      if (k === 's' || k === 'b') v[k] = typeof x === 'number' ? this.who(base.suspects[x]) : x;
      else if (k === 'room') v.room = typeof x === 'number' ? this.room(base, x) : x;
      else v[k] = x;
    }
    return this.fill(this.tpl(path), v);
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Grammar, GRAMMAR_NL };

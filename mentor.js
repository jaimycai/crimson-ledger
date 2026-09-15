// Vertaalhulp: gebruikt de taalmotor (i18n.js) als die er is, anders de Nederlandse tekst.
const MT_T = (s, ...v) => { const g = typeof globalThis !== 'undefined' ? globalThis.T : undefined; if (typeof g === 'function') return g(s, ...v); return typeof s === 'string' ? s : s.map((x, i) => x + (i < v.length ? String(v[i]) : '')).join(''); };
// ============================================================
// MENTOR — Inspecteur Van Dam: briefing voor een campagnezaak,
// een opmerking erna, de "Nieuw!"-uitleg bij een nieuw soort
// verklaring en de reacties bij de beschuldiging.
// ============================================================

const Mentor = {
  name: 'Inspecteur Van Dam',
  img: 'assets/vandam.jpg',
  sketch: 'assets/vandam-sketch.jpg',

  // Tip per soort verklaring; de eerste die in de zaak voorkomt wint.
  TIPS: [
    ['same-row',     'Let op de verklaring over een rij: een rij loopt van links naar rechts, dwars door de muren heen.'],
    ['same-col',     'Een kolom loopt van boven naar beneden over de hele plattegrond. Muren tellen niet.'],
    ['left-of',      '"Links van" gaat over de hele plattegrond: de een staat een kolom verder naar links, in welke kamer dan ook.'],
    ['above',        '"Hoger op de plattegrond" betekent dichter bij de bovenkant, ongeacht de kamer.'],
    ['not-adjacent', '"Niet direct naast" sluit alleen de vier vakjes ernaast uit. Schuin telt niet als naast.'],
    ['adjacent',     '"Direct naast" is het vakje links, rechts, boven of onder. Nooit schuin.'],
    ['alone',        'Wie alleen was in een kamer, sluit alle anderen daar uit. Handig om kamers weg te strepen.'],
    ['empty-room',   'Een lege kamer volgens het rapport: daar hoef je niemand te proberen.'],
    ['pos',          'Een hoek raakt twee muren, "tegen een muur" raakt er één en "in het midden" raakt er geen.'],
    ['room-pos',     'Kijk welke hoeken of muurvakjes in die kamer nog vrij zijn. Meubels bezetten er vaak een paar.'],
    ['room-with',    'Een kamer "met een plant" kan ook een kamer met meer meubels zijn. Zoek eerst de plant.'],
    ['next-to',      'Tik op de verklaring: het meubel licht op. Alleen de vakjes ernaast komen in aanmerking.'],
    ['room-next',    'Kamer én meubel samen: meestal blijft er dan nog maar één vakje over.'],
    ['diff-room',    'Niet in dezelfde kamer: zet eerst de persoon vast van wie je het meeste weet.'],
    ['same-room',    'Dezelfde kamer: vind eerst de kamer van de één, dan ken je die van de ander ook.'],
    ['not-room',     'Een "niet in" streept een kamer weg. Combineer dat met de spelregel over het slachtoffer.'],
    ['room',         'De duidelijkste verklaring: plaats deze persoon als eerste.']
  ],
  tipFor(puzzle) {
    const kinds = new Set((puzzle && puzzle.clues || []).map(c => c.kind));
    const t = this.TIPS.find(([k]) => kinds.has(k));
    return t ? t[1] : 'Begin bij de verklaring die het minste ruimte overlaat.';
  },

  // Briefing vóór een campagnezaak: het verhaaltje plus één tip die bij deze zaak past.
  briefing(puzzle, c, chapter) {
    const part = chapter ? chapter.title.split(' · ')[0] : null;
    const sub = c.chapter === 'archief' ? MT_T`Archief · ${c.title}` : MT_T`${part} · Zaak ${c.idx + 1}: ${c.title}`;
    return { sub, text: `${c.story} ${this.tipFor(puzzle)}` };
  },

  // Opmerking op het resultaatscherm.
  remark(o) {
    const you = o.rank || MT_T('Rekruut');
    const pick = arr => arr[Math.abs(o.elapsed || 0) % arr.length];
    if (o.finale) return o.finale;
    if (o.newRank) return MT_T`Je hebt je nieuwe rang verdiend, ${o.newRank}. Ik zou zeggen: op naar de volgende zaak.`;
    if (o.isWeekly) return MT_T`De zaak van de week is gesloten, ${you}. Deel het resultaat, dan weet de rest van het bureau het ook.`;
    if (o.hintsUsed === 0 && o.attempts === 0) return pick([
      MT_T`Uitstekend speurwerk, ${you}. Geen hint, geen fout. Zo hoort het.`,
      MT_T`Vlekkeloos, ${you}. Ik had het zelf niet beter gekund.`,
      MT_T`Drie sterren. De dader had geen schijn van kans, ${you}.`
    ]);
    if (o.hintsUsed === 0) return pick([
      MT_T`Zonder hint, ${you}. Volgende keer ook in één keer?`,
      MT_T`Goed gezien, ${you}. Eén foute gok, maar je hebt hem.`
    ]);
    if (o.attempts === 0) return MT_T`In één keer goed, ${you}. Probeer het de volgende keer eens zonder hint.`;
    return pick([
      MT_T`Opgelost, ${you}. Hints zijn er om te gebruiken, maar kijk of je ze de volgende keer kunt missen.`,
      MT_T`De zaak is rond, ${you}. Lees de verklaringen twee keer, dan heb je de hints niet nodig.`
    ]);
  },

  // "Nieuw!"-kaarten: één keer uitleg per soort verklaring, met een klein plaatje.
  INTROS: [
    { id: 'kamers', kinds: ['room', 'not-room'], title: 'Kamers',
      text: 'Een verdachte vertelt in welke kamer hij was. Zoek die kamer op de plattegrond en zet hem daar ergens neer. Zegt iemand dat hij ergens NIET was? Dan mag hij overal staan, behalve in die kamer.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="30" height="56" fill="#E8A798"/><rect x="32" y="2" width="26" height="56" fill="#9FC8C8"/><path d="M32 2v56" stroke="#1A1108" stroke-width="3"/><rect x="2" y="2" width="56" height="56" fill="none" stroke="#1A1108" stroke-width="3"/><circle cx="17" cy="30" r="7" fill="#8B2E1C" stroke="#1A1108" stroke-width="1.5"/></svg>' },
    { id: 'hoeken', kinds: ['room-pos', 'pos'], title: 'Hoeken en muren',
      text: 'Elke kamer heeft drie soorten vakjes. In een hoek: het vakje raakt twee muren van de kamer (rood op het plaatje). Tegen een muur: het vakje raakt maar één muur (goud). In het midden: het vakje raakt geen enkele muur (groen).',
      svg: '<svg viewBox="0 0 60 60"><g stroke="#1A1108" stroke-width="1"><rect x="2" y="2" width="18" height="18" fill="#C62828"/><rect x="21" y="2" width="18" height="18" fill="#D4B074"/><rect x="40" y="2" width="18" height="18" fill="#C62828"/><rect x="2" y="21" width="18" height="18" fill="#D4B074"/><rect x="21" y="21" width="18" height="18" fill="#2E7D32"/><rect x="40" y="21" width="18" height="18" fill="#D4B074"/><rect x="2" y="40" width="18" height="18" fill="#C62828"/><rect x="21" y="40" width="18" height="18" fill="#D4B074"/><rect x="40" y="40" width="18" height="18" fill="#C62828"/></g><rect x="2" y="2" width="56" height="56" fill="none" stroke="#1A1108" stroke-width="3"/></svg>' },
    { id: 'meubels', kinds: ['room-with', 'next-to', 'room-next'], title: 'Meubels',
      text: 'Direct naast een meubel betekent: het vakje links, rechts, boven of onder dat meubel. Schuin telt niet mee. Weet je niet wat een meubel is? Tik erop, dan zie je de naam.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#F0CE8E" stroke="#1A1108" stroke-width="3"/><g fill="#8B2E1C" opacity="0.55"><rect x="21" y="3" width="18" height="18"/><rect x="3" y="21" width="18" height="18"/><rect x="39" y="21" width="18" height="18"/><rect x="21" y="39" width="18" height="18"/></g><text x="30" y="36" font-size="16" text-anchor="middle">🪴</text></svg>' },
    { id: 'samen', kinds: ['same-room', 'diff-room', 'alone'], title: 'Samen of alleen',
      text: 'In dezelfde kamer: zet ze allebei in die ene kamer. Niet in dezelfde kamer: zet ze in twee verschillende kamers. Ik was alleen: niemand anders mag in die kamer staan.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="30" fill="#E3B7D6"/><rect x="2" y="32" width="56" height="26" fill="#A8BEE0"/><path d="M2 32h56" stroke="#1A1108" stroke-width="3"/><rect x="2" y="2" width="56" height="56" fill="none" stroke="#1A1108" stroke-width="3"/><circle cx="18" cy="17" r="6" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="40" cy="17" r="6" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/><circle cx="30" cy="45" r="6" fill="#5C8B5E" stroke="#1A1108" stroke-width="1.5"/></svg>' },
    { id: 'naast', kinds: ['adjacent', 'not-adjacent'], title: 'Naast elkaar',
      text: 'Direct naast iemand betekent: hun vakjes raken elkaar met een kant, links, rechts, boven of onder. Schuin telt niet mee. Een muur ertussen mag wel, als de vakjes maar naast elkaar liggen.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#C7D9A0" stroke="#1A1108" stroke-width="3"/><circle cx="21" cy="30" r="7" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="39" cy="30" r="7" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/><path d="M28 30h4" stroke="#1A1108" stroke-width="2"/></svg>' },
    { id: 'rijen', kinds: ['same-row', 'same-col'], title: 'Rijen en kolommen',
      text: 'Een rij loopt van links naar rechts over de hele plattegrond. Een kolom loopt van boven naar onder. Op dezelfde rij mag dus ook in een andere kamer zijn: muren tellen niet mee.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#F3EDE3" stroke="#1A1108" stroke-width="3"/><path d="M30 2v56" stroke="#1A1108" stroke-width="3"/><rect x="3" y="21" width="54" height="18" fill="#8B2E1C" opacity="0.35"/><circle cx="16" cy="30" r="6" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="44" cy="30" r="6" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/></svg>' },
    { id: 'links', kinds: ['left-of', 'above'], title: 'Links en hoger',
      text: 'Links van iemand betekent: in een kolom verder naar links, ook als dat in een andere kamer is. Hoger dan iemand betekent: in een rij dichter bij de bovenkant van de plattegrond.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#D9B8A0" stroke="#1A1108" stroke-width="3"/><path d="M30 2v56" stroke="#1A1108" stroke-width="3"/><circle cx="14" cy="18" r="6" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="46" cy="42" r="6" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/><path d="M22 22l16 14" stroke="#1A1108" stroke-width="2" stroke-dasharray="3 3"/></svg>' },
    { id: 'leeg', kinds: ['empty-room'], title: 'Lege kamers',
      text: 'Volgens het rapport was er niemand in die kamer. Zet daar dus niemand neer: die kamer kun je helemaal overslaan.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#B9AEDC" stroke="#1A1108" stroke-width="3"/><path d="M14 14l32 32M46 14L14 46" stroke="#C62828" stroke-width="5" stroke-linecap="round"/></svg>' }
  ],
  introFor(kinds, seen) {
    const set = new Set(kinds);
    return this.INTROS.find(i => !seen.includes(i.id) && i.kinds.some(k => set.has(k))) || null;
  },

  // ── Hint in drie stappen: kijk naar, dat betekent, doe dit ──
  // Legt één verklaring uit in gewone taal, met de namen en kamers van deze
  // zaak, en zegt precies wat de speler nu moet doen.
  explain(clue, p) {
    const N = i => p.suspects[i].label;
    const R = id => { const q = p.rooms.find(x => x.id === id); return `${q.article || 'de'} ${q.name}`; };
    const F = f => p.furnitureNl[f] || f;
    const rw = p.theme.roomWord || 'kamer', rws = p.theme.roomWordPlural || 'kamers';
    const pos = (id, room) => id === 'muur' ? MT_T`tegen een muur van ${room}, niet in een hoek. Zo'n vakje raakt precies één muur.`
      : id === 'midden' ? MT_T`in het midden van ${room}. Zo'n vakje raakt geen enkele muur.`
      : MT_T`in een hoek van ${room}. Een hoek is een vakje dat twee muren van die ${rw} raakt.`;
    switch (clue.kind) {
      case 'room':         return MT_T`${N(clue.s)} moet ergens in ${R(clue.room)} staan. Elk vrij vakje van die ${rw} kan.`;
      case 'not-room':     return MT_T`${N(clue.s)} mag overal staan, behalve in ${R(clue.room)}.`;
      case 'room-pos':     return MT_T`${N(clue.s)} staat ${pos(clue.pos, R(clue.room))}`;
      case 'pos':          return MT_T`${N(clue.s)} staat ${pos(clue.pos, MT_T`een ${rw}`)} In welke ${rw} weet je nog niet.`;
      case 'room-with':    return MT_T`${N(clue.s)} staat in een ${rw} waar ${F(clue.furniture)} staat. Zoek eerst dat meubel; elk vrij vakje in die ${rw} kan.`;
      case 'next-to':      return MT_T`${N(clue.s)} staat op het vakje links, rechts, boven of onder ${F(clue.furniture)}. Schuin telt niet.`;
      case 'room-next':    return MT_T`${N(clue.s)} staat in ${R(clue.room)}, recht naast ${F(clue.furniture)}: links, rechts, boven of onder, niet schuin.`;
      case 'same-room':    return MT_T`${N(clue.a)} en ${N(clue.b)} staan in dezelfde ${rw}. Weet je waar één van de twee staat, dan weet je ook de ${rw} van de ander.`;
      case 'diff-room':    return MT_T`${N(clue.a)} en ${N(clue.b)} staan in twee verschillende ${rws}.`;
      case 'adjacent':     return MT_T`${N(clue.a)} en ${N(clue.b)} staan op vakjes die elkaar raken: links, rechts, boven of onder. Een muur ertussen mag.`;
      case 'not-adjacent': return MT_T`${N(clue.a)} staat niet op een vakje dat ${N(clue.b)} raakt (links, rechts, boven of onder). Schuin ernaast mag wel.`;
      case 'same-row':     return MT_T`${N(clue.a)} en ${N(clue.b)} staan op dezelfde rij: even hoog op de plattegrond, ook als dat in verschillende ${rws} is.`;
      case 'same-col':     return MT_T`${N(clue.a)} en ${N(clue.b)} staan in dezelfde kolom: recht boven of onder elkaar. Muren tellen niet.`;
      case 'left-of':      return MT_T`${N(clue.a)} staat in een kolom links van ${N(clue.b)}, in welke ${rw} dan ook.`;
      case 'above':        return MT_T`${N(clue.a)} staat in een rij hoger dan ${N(clue.b)}, in welke ${rw} dan ook.`;
      case 'empty-room':   return MT_T`In ${R(clue.room)} staat niemand. Die ${rw} kun je overslaan.`;
      case 'alone':        return MT_T`${N(clue.s)} staat in een ${rw} waar verder niemand staat.`;
      default: return '';
    }
  },
  // Wat moet de speler nu doen? h = uitkomst van FloorPlan.hint.
  hintAction(h, p, placements) {
    const N = i => p.suspects[i].label;
    const rw = p.theme.roomWord || 'kamer';
    const roomOf = c => FloorPlan.roomOf(p.rooms, c.x, c.y);
    const name = h.suspect !== undefined && h.suspect !== -1 ? N(h.suspect) : '';
    const vroom = p.rooms.find(r => r.id === p.victim.roomId);
    if (h.type === 'mistake') {
      const cur = placements[h.suspect] ? roomOf(placements[h.suspect]) : null;
      const where = cur ? MT_T` Nu staat ${name} in ${cur.article || 'de'} ${cur.name}.` : '';
      if (!h.clues.length && /twee verdachten/.test(h.text)) return MT_T`In ${vroom.article || 'de'} ${vroom.name} mag maar één persoon staan: de moordenaar. Sleep één van de twee naar een andere ${rw}.`;
      const c = h.clues.length ? p.clues[h.clues[0]] : null;
      const target = c && c.room !== undefined && c.kind !== 'not-room' && c.kind !== 'empty-room' ? p.rooms.find(r => r.id === c.room) : null;
      return MT_T`Sleep ${name} van het bord af.${where}${target ? MT_T` Zet ${name} daarna ergens in ${target.article || 'de'} ${target.name}.` : MT_T(' Lees de verklaring hierboven nog eens en probeer een vakje dat erbij past.')}`;
    }
    if (h.type === 'deduce') {
      const q = h.cells[0] ? roomOf(h.cells[0]) : null;
      return MT_T`Er is maar één vakje over: het oplichtende vakje${q ? MT_T` in ${q.article || 'de'} ${q.name}` : ''}. Sleep ${name} daarheen.`;
    }
    if (h.type === 'narrow') {
      const rooms = [...new Set(h.cells.map(c => roomOf(c).name))];
      return MT_T`${name} kan nog op ${h.cells.length} vakjes staan; ze lichten goud op${rooms.length === 1 ? MT_T`, in de ${rooms[0]}` : ''}. Zet daar een stipje met het Potlood en probeer ze één voor één: bij elk vakje kijk je of de andere verklaringen nog kloppen.`;
    }
    return MT_T`Iedereen staat goed. Tik op Controleer en wijs daarna aan wie alleen in ${vroom.article || 'de'} ${vroom.name} staat.`;
  },

  // Reacties bij de beschuldiging.
  REACT_WRONG: ['Ik? Nooit!', 'Dat meen je niet.', 'Ik was daar niet eens!', 'Vraag het de anderen maar.', 'Kijk nog eens op de plattegrond.'],
  REACT_RIGHT: ['… Hoe wist je dat?', '… Goed dan. Ik was het.', 'Ik had het bijna gered.', '… Je hebt me door.'],
  reaction(right, n) {
    const arr = right ? this.REACT_RIGHT : this.REACT_WRONG;
    return arr[Math.abs(n || 0) % arr.length];
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = { Mentor };

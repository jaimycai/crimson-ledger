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
    const sub = c.chapter === 'archief' ? `Archief · ${c.title}` : `${part} · Zaak ${c.idx + 1}: ${c.title}`;
    return { sub, text: `${c.story} ${this.tipFor(puzzle)}` };
  },

  // Opmerking op het resultaatscherm.
  remark(o) {
    const you = o.rank || 'Rekruut';
    const pick = arr => arr[Math.abs(o.elapsed || 0) % arr.length];
    if (o.finale) return o.finale;
    if (o.newRank) return `Je hebt je nieuwe rang verdiend, ${o.newRank}. Ik zou zeggen: op naar de volgende zaak.`;
    if (o.isWeekly) return `De zaak van de week is gesloten, ${you}. Deel het resultaat, dan weet de rest van het bureau het ook.`;
    if (o.hintsUsed === 0 && o.attempts === 0) return pick([
      `Uitstekend speurwerk, ${you}. Geen hint, geen fout. Zo hoort het.`,
      `Vlekkeloos, ${you}. Ik had het zelf niet beter gekund.`,
      `Drie sterren. De dader had geen schijn van kans, ${you}.`
    ]);
    if (o.hintsUsed === 0) return pick([
      `Zonder hint, ${you}. Volgende keer ook in één keer?`,
      `Goed gezien, ${you}. Eén foute gok, maar je hebt hem.`
    ]);
    if (o.attempts === 0) return `In één keer goed, ${you}. Probeer het de volgende keer eens zonder hint.`;
    return pick([
      `Opgelost, ${you}. Hints zijn er om te gebruiken, maar kijk of je ze de volgende keer kunt missen.`,
      `De zaak is rond, ${you}. Lees de verklaringen twee keer, dan heb je de hints niet nodig.`
    ]);
  },

  // "Nieuw!"-kaarten: één keer uitleg per soort verklaring, met een klein plaatje.
  INTROS: [
    { id: 'kamers', kinds: ['room', 'not-room'], title: 'Kamers',
      text: 'Een verdachte zegt in welke kamer hij was, of juist niet. Zoek de kamernaam op de plattegrond; tik op de verklaring en de kamer licht op.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="30" height="56" fill="#E8A798"/><rect x="32" y="2" width="26" height="56" fill="#9FC8C8"/><path d="M32 2v56" stroke="#1A1108" stroke-width="3"/><rect x="2" y="2" width="56" height="56" fill="none" stroke="#1A1108" stroke-width="3"/><circle cx="17" cy="30" r="7" fill="#8B2E1C" stroke="#1A1108" stroke-width="1.5"/></svg>' },
    { id: 'hoeken', kinds: ['room-pos', 'pos'], title: 'Hoeken en muren',
      text: 'In een hoek = een hoekvakje van de kamer (rood). Tegen een muur = raakt één muur (goud). In het midden = raakt geen muur (groen).',
      svg: '<svg viewBox="0 0 60 60"><g stroke="#1A1108" stroke-width="1"><rect x="2" y="2" width="18" height="18" fill="#C62828"/><rect x="21" y="2" width="18" height="18" fill="#D4B074"/><rect x="40" y="2" width="18" height="18" fill="#C62828"/><rect x="2" y="21" width="18" height="18" fill="#D4B074"/><rect x="21" y="21" width="18" height="18" fill="#2E7D32"/><rect x="40" y="21" width="18" height="18" fill="#D4B074"/><rect x="2" y="40" width="18" height="18" fill="#C62828"/><rect x="21" y="40" width="18" height="18" fill="#D4B074"/><rect x="40" y="40" width="18" height="18" fill="#C62828"/></g><rect x="2" y="2" width="56" height="56" fill="none" stroke="#1A1108" stroke-width="3"/></svg>' },
    { id: 'meubels', kinds: ['room-with', 'next-to', 'room-next'], title: 'Meubels',
      text: '"Direct naast" een meubel is het vakje links, rechts, boven of onder ervan. Nooit schuin. Tik op een meubel om te zien wat het is.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#F0CE8E" stroke="#1A1108" stroke-width="3"/><g fill="#8B2E1C" opacity="0.55"><rect x="21" y="3" width="18" height="18"/><rect x="3" y="21" width="18" height="18"/><rect x="39" y="21" width="18" height="18"/><rect x="21" y="39" width="18" height="18"/></g><text x="30" y="36" font-size="16" text-anchor="middle">🪴</text></svg>' },
    { id: 'samen', kinds: ['same-room', 'diff-room', 'alone'], title: 'Samen of alleen',
      text: 'Twee mensen in dezelfde kamer, of juist niet. Plaats eerst degene van wie je het meeste weet, dan volgt de ander. "Alleen" sluit alle anderen uit die kamer uit.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="30" fill="#E3B7D6"/><rect x="2" y="32" width="56" height="26" fill="#A8BEE0"/><path d="M2 32h56" stroke="#1A1108" stroke-width="3"/><rect x="2" y="2" width="56" height="56" fill="none" stroke="#1A1108" stroke-width="3"/><circle cx="18" cy="17" r="6" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="40" cy="17" r="6" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/><circle cx="30" cy="45" r="6" fill="#5C8B5E" stroke="#1A1108" stroke-width="1.5"/></svg>' },
    { id: 'naast', kinds: ['adjacent', 'not-adjacent'], title: 'Naast elkaar',
      text: '"Direct naast" iemand anders: de vakjes raken elkaar met een zijde. Schuin telt niet. Een muur ertussen mag wél, als de vakjes maar naast elkaar liggen.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#C7D9A0" stroke="#1A1108" stroke-width="3"/><circle cx="21" cy="30" r="7" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="39" cy="30" r="7" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/><path d="M28 30h4" stroke="#1A1108" stroke-width="2"/></svg>' },
    { id: 'rijen', kinds: ['same-row', 'same-col'], title: 'Rijen en kolommen',
      text: 'Een rij loopt van links naar rechts, een kolom van boven naar beneden. Allebei over de hele plattegrond: muren tellen niet mee.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#F3EDE3" stroke="#1A1108" stroke-width="3"/><path d="M30 2v56" stroke="#1A1108" stroke-width="3"/><rect x="3" y="21" width="54" height="18" fill="#8B2E1C" opacity="0.35"/><circle cx="16" cy="30" r="6" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="44" cy="30" r="6" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/></svg>' },
    { id: 'links', kinds: ['left-of', 'above'], title: 'Links en hoger',
      text: '"Links van" en "hoger dan" gaan over de hele plattegrond, niet over één kamer. Links = een kolom verder naar links; hoger = dichter bij de bovenkant.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#D9B8A0" stroke="#1A1108" stroke-width="3"/><path d="M30 2v56" stroke="#1A1108" stroke-width="3"/><circle cx="14" cy="18" r="6" fill="#B85C5C" stroke="#1A1108" stroke-width="1.5"/><circle cx="46" cy="42" r="6" fill="#5C7AB8" stroke="#1A1108" stroke-width="1.5"/><path d="M22 22l16 14" stroke="#1A1108" stroke-width="2" stroke-dasharray="3 3"/></svg>' },
    { id: 'leeg', kinds: ['empty-room'], title: 'Lege kamers',
      text: 'Volgens het rapport was er niemand in die kamer. Streep de hele kamer weg: daar hoef je niemand te proberen.',
      svg: '<svg viewBox="0 0 60 60"><rect x="2" y="2" width="56" height="56" fill="#B9AEDC" stroke="#1A1108" stroke-width="3"/><path d="M14 14l32 32M46 14L14 46" stroke="#C62828" stroke-width="5" stroke-linecap="round"/></svg>' }
  ],
  introFor(kinds, seen) {
    const set = new Set(kinds);
    return this.INTROS.find(i => !seen.includes(i.id) && i.kinds.some(k => set.has(k))) || null;
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

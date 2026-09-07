// ============================================================
// CASE DATA — Geherstructureerd voor Logic Grid Puzzels
// Categorieën, items, aanwijzingtemplates, verhaallijn
// ============================================================

// ── Moeilijkheidsconfiguratie ────────────────────────────────
const DIFFICULTY = {
  tutorial: {
    id: 'tutorial',
    label: 'Oefenzaak',
    icon: '🎓',
    desc: 'Leer de basis in dertig seconden',
    numCategories: 2,
    numItems: 2,
    hidden: true // niet in de moeilijkheidskeuze
  },
  makkelijk: {
    id: 'makkelijk',
    label: 'Makkelijk',
    icon: '🟢',
    desc: 'Perfect om te beginnen',
    numCategories: 3,
    numItems: 3
  },
  gemiddeld: {
    id: 'gemiddeld',
    label: 'Gemiddeld',
    icon: '🟡',
    desc: 'Een stevige uitdaging',
    numCategories: 3,
    numItems: 4
  },
  moeilijk: {
    id: 'moeilijk',
    label: 'Moeilijk',
    icon: '🔴',
    desc: 'Alleen voor doorgewinterde speurders',
    numCategories: 3,
    numItems: 5
  }
};

// ── Case Thema ───────────────────────────────────────────────
const CASE_THEME = {
  id: 'de-rode-kamer',
  title: 'De Rode Kamer',
  subtitle: 'Wie vermoordde Dr. Blackwood?',

  intro: {
    short: 'Dr. Edward Blackwood, 58, werd dood aangetroffen in zijn privéstudeerkamer. Het gif in zijn wijn, {aantal} verdachten, en een huis vol geheimen. Ontdek wie het deed, waar, en waarmee.',
    long: [
      'Dr. Edward Blackwood, 58, werd dood aangetroffen in zijn studeerkamer — een ruimte bekend als "De Rode Kamer".',
      'De doodsoorzaak: een zeldzaam gif in een glas Bordeaux.',
      '{Aantal} personen hadden toegang. {Aantal} motieven. {Aantal} geheimen.',
      'Los de puzzel op. Volg de aanwijzingen. Pak de moordenaar.'
    ]
  },

  // Categorieën — items worden geselecteerd op basis van numItems
  categories: [
    {
      type: 'suspect',
      name: 'Verdachte',
      icon: '👤',
      items: [
        { label: 'Clara',    full: 'Clara Blackwood',      color: '#B85C5C', desc: 'De echtgenote. 25 jaar getrouwd.' },
        { label: 'Marcus',   full: 'Marcus Hale',          color: '#5C7AB8', desc: 'De zakenpartner. €200.000 schuld.' },
        { label: 'Dr. Cross',full: 'Dr. Vivian Cross',     color: '#8B5CB8', desc: 'De rivaal. Gestolen onderzoek.' },
        { label: 'Thomas',   full: 'Thomas Reed',          color: '#5C8B5E', desc: 'De butler. 30 jaar in dienst.' },
        { label: 'Isabelle', full: 'Isabelle Fontaine',    color: '#B8955C', desc: 'De patiënte. Verkeerde diagnose.' }
      ]
    },
    {
      type: 'location',
      name: 'Locatie',
      icon: '📍',
      items: [
        { label: 'Studeerkamer', color: '#8B4513' },
        { label: 'Keuken',      color: '#CD853F' },
        { label: 'Tuin',        color: '#2E8B57' },
        { label: 'Kelder',      color: '#696969' },
        { label: 'Bibliotheek', color: '#8B6914' }
      ]
    },
    {
      type: 'weapon',
      name: 'Wapen',
      icon: '🔪',
      items: [
        { label: 'Gif',        article: 'het', color: '#9B59B6' },
        { label: 'Mes',        article: 'het', color: '#7F8C8D' },
        { label: 'Touw',       article: 'het', color: '#D4A574' },
        { label: 'Kandelaar',  article: 'de',  color: '#F39C12' },
        { label: 'Revolver',   article: 'de',  color: '#2C3E50' }
      ]
    }
  ],

  // Outro teksten
  outro: {
    correct: {
      headline: 'Zaak Gesloten!',
      sub: 'De waarheid komt altijd boven.',
      text: 'Door scherp logisch denken heb je het mysterie van De Rode Kamer ontrafeld. De moordenaar is gepakt.'
    },
    incorrect: {
      headline: 'Zaak Gesloten.',
      sub: 'Maar gerechtigheid vereist precisie.',
      text: 'Je conclusie was niet helemaal juist. Bekijk de oplossing om te zien waar het werkelijk naartoe leidde.'
    }
  }
};

// ── Oefenzaak (begeleide tutorial) ───────────────────────────
// Vaste puzzel, vaste aanwijzingen en een stappenplan dat de speler
// bij de hand neemt. Markeringen: 'x' = ✗, 'v' = ✓.
const TUTORIAL_CASE = {
  theme: {
    id: 'oefenzaak',
    title: 'Oefenzaak',
    subtitle: 'De verdwenen sleutel',
    intro: {
      short: 'Een sleutel is verdwenen. Twee verdachten, twee plekken. Leer in vier tikken hoe je een zaak oplost.',
      long: ['Een sleutel is verdwenen. Twee verdachten, twee plekken. Leer in vier tikken hoe je een zaak oplost.']
    },
    categories: [
      {
        type: 'suspect', name: 'Verdachte', icon: '👤',
        items: [
          { label: 'Clara',  full: 'Clara Blackwood', color: '#B85C5C' },
          { label: 'Marcus', full: 'Marcus Hale',     color: '#5C7AB8' }
        ]
      },
      {
        type: 'location', name: 'Locatie', icon: '📍',
        items: [
          { label: 'Keuken', color: '#CD853F' },
          { label: 'Tuin',   color: '#2E8B57' }
        ]
      }
    ],
    outro: {
      correct: {
        headline: 'Goed gedaan!',
        sub: 'Je kent nu de basis.',
        text: 'Zo werkt elke zaak: lees de aanwijzingen, streep weg wat niet kan (✗) en bevestig wat overblijft (✓). Elke rij en kolom krijgt precies één ✓. Tijd voor een echte zaak.'
      },
      incorrect: {
        headline: 'Bijna.',
        sub: 'Kijk nog eens naar de aanwijzingen.',
        text: 'Streep weg wat niet kan en bevestig wat overblijft.'
      }
    }
  },
  // Clara → Keuken, Marcus → Tuin
  solution: [[0, 0], [1, 1]],
  clues: [
    { type: 'negative', cat1: 0, item1: 0, cat2: 1, item2: 1 }, // Clara was niet in de Tuin
    { type: 'positive', cat1: 0, item1: 1, cat2: 1, item2: 1 }  // Marcus was in de Tuin
  ],
  steps: [
    {
      clue: 0, cell: { catI: 0, itemI: 0, catJ: 1, itemJ: 1 }, mark: 'x',
      text: 'Aanwijzing 1 zegt dat Clara niet in de Tuin was. Tik één keer op de gemarkeerde cel om een ✗ te zetten.'
    },
    {
      cell: { catI: 0, itemI: 0, catJ: 1, itemJ: 0 }, mark: 'v',
      text: 'Er zijn maar twee plekken en de Tuin valt af. Clara was dus in de Keuken. Tik twee keer op de cel voor een ✓.'
    },
    {
      cell: { catI: 0, itemI: 1, catJ: 1, itemJ: 0 }, mark: 'x',
      text: 'Elke plek hoort bij precies één verdachte. De Keuken is van Clara, dus Marcus was daar niet. Tik één keer voor een ✗.'
    },
    {
      clue: 1, cell: { catI: 0, itemI: 1, catJ: 1, itemJ: 1 }, mark: 'v',
      text: 'Aanwijzing 2 bevestigt het: Marcus was in de Tuin. Tik twee keer voor een ✓.'
    },
    {
      text: 'De zaak is rond: elke rij en elke kolom heeft precies één ✓. Tik op Controleer.'
    }
  ]
};

/**
 * Bouw een case-configuratie op basis van moeilijkheidsgraad.
 * Selecteert het juiste aantal items per categorie.
 */
function buildCase(difficultyId) {
  const diff = DIFFICULTY[difficultyId];
  const source = difficultyId === 'tutorial' ? TUTORIAL_CASE.theme : CASE_THEME;
  const cats = [];

  for (let c = 0; c < diff.numCategories; c++) {
    const srcCat = source.categories[c];
    cats.push({
      type: srcCat.type,
      name: srcCat.name,
      icon: srcCat.icon,
      items: srcCat.items.slice(0, diff.numItems)
    });
  }

  // Vul het aantal verdachten in de introtekst in
  const woorden = { 2: 'twee', 3: 'drie', 4: 'vier', 5: 'vijf', 6: 'zes' };
  const aantal = woorden[diff.numItems] || String(diff.numItems);
  const vul = t => t.replace(/\{aantal\}/g, aantal)
                    .replace(/\{Aantal\}/g, aantal.charAt(0).toUpperCase() + aantal.slice(1));
  const theme = {
    ...source,
    intro: { short: vul(source.intro.short), long: source.intro.long.map(vul) }
  };

  return {
    theme,
    difficulty: diff,
    categories: cats,
    numCategories: diff.numCategories,
    numItems: diff.numItems
  };
}

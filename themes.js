// ============================================================
// THEMES — werelden voor de plattegrondzaak. Elk thema levert
// kamers (met lidwoord en kleur), meubels (id + Nederlandse naam),
// verdachten (naam, kleur, portretstijl), slachtoffer, verhaal en
// vloerpatroon. De engine en het bord zijn thema-onafhankelijk.
// ============================================================

const THEMES = [
  {
    id: 'landhuis', unlock: 0, icon: '🏚️', title: 'Het Landhuis', short: 'Landhuis',
    map: { accent: '#8B2E1C', ring: '#B8955C' }, tagline: 'Een diner, een glas Bordeaux, en een gastheer die niet meer opstaat.',
    intro: 'Landgoed Blackwood, 1927. Na het diner blijft de gastheer in zijn stoel zitten. Het glas is leeg, het huis vol geheimen.',
    victimName: 'Dr. Edward Blackwood', roomWord: 'kamer', roomWordPlural: 'kamers', floor: 'checker',
    rooms: [
      { name: 'Woonkamer', article: 'de', color: '#E8A798' }, { name: 'Keuken', article: 'de', color: '#9FC8C8' },
      { name: 'Eetkamer', article: 'de', color: '#E3B7D6' }, { name: 'Bibliotheek', article: 'de', color: '#F0CE8E' },
      { name: 'Slaapkamer', article: 'de', color: '#A8BEE0' }, { name: 'Badkamer', article: 'de', color: '#C7D9A0' },
      { name: 'Garage', article: 'de', color: '#D9B8A0' }, { name: 'Hal', article: 'de', color: '#B9AEDC' },
      { name: 'Wasruimte', article: 'de', color: '#8FC5D8' }, { name: 'Studeerkamer', article: 'de', color: '#E5B0A8' },
      { name: 'Serre', article: 'de', color: '#BFD8B0' }, { name: 'Kelder', article: 'de', color: '#D6C3A5' }
    ],
    furniture: [
      { id: 'plant', nl: 'een plant' }, { id: 'tv', nl: 'een televisie' }, { id: 'kast', nl: 'een boekenkast' },
      { id: 'stoel', nl: 'een fauteuil' }, { id: 'doos', nl: 'een kist' }
    ],
    suspects: [
      { label: 'Clara',     color: '#B85C5C', style: { hair: 1 } },
      { label: 'Marcus',    color: '#5C7AB8', style: { hair: 0, moustache: true } },
      { label: 'Dr. Cross', color: '#8B5CB8', style: { hair: 2, glasses: true } },
      { label: 'Thomas',    color: '#5C8B5E', style: { hair: 3, bowtie: true } },
      { label: 'Isabelle',  color: '#B8955C', style: { hair: 4 } },
      { label: 'Rosalind',  color: '#C2185B', style: { hair: 2 } },
      { label: 'Majoor Pike', color: '#2C3E50', style: { hair: 3, moustache: true } },
      { label: 'Tante Agnes', color: '#7B5E3B', style: { hair: 1, glasses: true } }
    ],
    outro: 'De geheimen van Landgoed Blackwood liggen op tafel. De moordenaar is gepakt.'
  },
  {
    id: 'piraten', unlock: 2, icon: '🏴‍☠️', title: 'Het Piratenschip', short: 'Piratenschip',
    map: { accent: '#B8762E', ring: '#D9A066' }, tagline: 'De kapitein is dood en niemand verlaat het schip.',
    intro: 'De Zwarte Meeuw ligt stil op een spiegelgladde zee. Kapitein Zwartoog reageert niet meer op geroep. De bemanning kijkt elkaar aan.',
    victimName: 'Kapitein Zwartoog', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'planks',
    rooms: [
      { name: 'Kajuit', article: 'de', color: '#D9A066' }, { name: 'Ruim', article: 'het', color: '#A88B6B' },
      { name: 'Kombuis', article: 'de', color: '#E0B27A' }, { name: 'Dek', article: 'het', color: '#C9B48E' },
      { name: 'Kanonnendek', article: 'het', color: '#B59A7A' }, { name: 'Voorraadkamer', article: 'de', color: '#C4A484' },
      { name: 'Slaapvertrek', article: 'het', color: '#D6B899' }, { name: 'Kaartenkamer', article: 'de', color: '#E6C89E' },
      { name: 'Brig', article: 'de', color: '#9E8B75' }, { name: 'Stuurhut', article: 'de', color: '#CFAE86' }
    ],
    furniture: [
      { id: 'kanon', nl: 'een kanon' }, { id: 'ton', nl: 'een ton' }, { id: 'schatkist', nl: 'een schatkist' },
      { id: 'touw', nl: 'een opgerold touw' }, { id: 'lantaarn', nl: 'een lantaarn' }
    ],
    suspects: [
      { label: 'Roodbaard',   color: '#B3261E', style: { hair: 0, hat: 'tricorn', beard: true } },
      { label: 'Bootsman Vos',color: '#5C7AB8', style: { hair: 3, hat: 'bandana', eyepatch: true } },
      { label: 'Kok Ada',     color: '#B8955C', style: { hair: 2, hat: 'bandana' } },
      { label: 'Stuurman Kwint', color: '#5C8B5E', style: { hair: 4, moustache: true } },
      { label: 'Juffrouw Lark', color: '#8B5CB8', style: { hair: 1, hat: 'tricorn' } },
      { label: 'Kanonnier Bo', color: '#2C3E50', style: { hair: 3, hat: 'bandana', beard: true } },
      { label: 'Dokter Sal',   color: '#C2185B', style: { hair: 2, glasses: true } },
      { label: 'Scheepsjongen Nik', color: '#7B5E3B', style: { hair: 4, hat: 'bandana' } }
    ],
    outro: 'De Zwarte Meeuw hijst de zeilen. De moordenaar zit in de brig.'
  },
  {
    id: 'hotel', unlock: 5, icon: '🏨', title: 'Grand Hotel Aurora', short: 'Grand Hotel',
    map: { accent: '#B9707A', ring: '#E3B7B0' }, tagline: 'Om middernacht viel het licht uit.',
    intro: 'Nieuwjaarsnacht in Grand Hotel Aurora. Om klokslag twaalf ging het licht uit. Toen het terugkwam, lag de eigenaar op de marmeren vloer.',
    victimName: 'Hoteleigenaar Valentijn Aurora', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'marble',
    rooms: [
      { name: 'Lobby', article: 'de', color: '#E7C9A9' }, { name: 'Bar', article: 'de', color: '#C99AA6' },
      { name: 'Restaurant', article: 'het', color: '#F0D9A8' }, { name: 'Balzaal', article: 'de', color: '#D8C3E0' },
      { name: 'Suite', article: 'de', color: '#B9CDE5' }, { name: 'Spa', article: 'de', color: '#A9D6D2' },
      { name: 'Keuken', article: 'de', color: '#D9D2B8' }, { name: 'Bibliotheek', article: 'de', color: '#D2B48C' },
      { name: 'Terras', article: 'het', color: '#C5DBB0' }, { name: 'Receptie', article: 'de', color: '#E3B7B0' },
      { name: 'Wijnkelder', article: 'de', color: '#B79A93' }, { name: 'Rookkamer', article: 'de', color: '#C8B8A2' }
    ],
    furniture: [
      { id: 'piano', nl: 'een piano' }, { id: 'koffer', nl: 'een koffer' }, { id: 'palm', nl: 'een palm' },
      { id: 'sofa', nl: 'een sofa' }, { id: 'trolley', nl: 'een roomservice-wagentje' }
    ],
    suspects: [
      { label: 'Gravin Delacroix', color: '#8B5CB8', style: { hair: 2, glasses: true } },
      { label: 'Portier Jansen',   color: '#5C7AB8', style: { hair: 0, hat: 'cap', moustache: true } },
      { label: 'Pianist Milo',     color: '#2C3E50', style: { hair: 4, bowtie: true } },
      { label: 'Mevrouw Sato',     color: '#B85C5C', style: { hair: 1 } },
      { label: 'Journalist Bram',  color: '#5C8B5E', style: { hair: 3, hat: 'tophat' } },
      { label: 'Chef Rosa',        color: '#B3261E', style: { hair: 2, hat: 'cap' } },
      { label: 'Butler Ames',      color: '#7B5E3B', style: { hair: 3, bowtie: true, moustache: true } },
      { label: 'Danseres Lou',     color: '#C2185B', style: { hair: 4 } }
    ],
    outro: 'Het orkest speelt weer. De moordenaar wordt door de politie de lobby uit begeleid.'
  },
  {
    id: 'ruimte', unlock: 9, icon: '🚀', title: 'Station Orion', short: 'Station Orion',
    map: { accent: '#4A6B8A', ring: '#5FC9C9' }, tagline: 'De sluizen zijn dicht. Iedereen is nog aan boord.',
    intro: 'Ruimtestation Orion, 2189. De commandant meldt zich niet voor haar dienst. Alle luchtsluizen zijn vergrendeld: de dader is nog aan boord.',
    victimName: 'Commandant Ilse Varga', roomWord: 'module', roomWordPlural: 'modules', floor: 'grid',
    rooms: [
      { name: 'Brug', article: 'de', color: '#9DB7D6' }, { name: 'Laboratorium', article: 'het', color: '#B6D5C9' },
      { name: 'Kantine', article: 'de', color: '#E3C58E' }, { name: 'Machinekamer', article: 'de', color: '#C1B3A0' },
      { name: 'Slaapcabine', article: 'de', color: '#C7BEE3' }, { name: 'Luchtsluis', article: 'de', color: '#B0C4CC' },
      { name: 'Kas', article: 'de', color: '#B8D9A1' }, { name: 'Ziekenboeg', article: 'de', color: '#E7C6C6' },
      { name: 'Opslag', article: 'de', color: '#D0C9BD' }, { name: 'Observatorium', article: 'het', color: '#A6AED6' },
      { name: 'Werkplaats', article: 'de', color: '#D9C7A6' }
    ],
    furniture: [
      { id: 'console', nl: 'een console' }, { id: 'capsule', nl: 'een slaapcapsule' }, { id: 'robot', nl: 'een onderhoudsrobot' },
      { id: 'krat', nl: 'een krat' }, { id: 'kweekbak', nl: 'een kweekbak' }
    ],
    suspects: [
      { label: 'Dr. Nkemelu',     color: '#8B5CB8', style: { hair: 4, hat: 'helmet' } },
      { label: 'Piloot Reyes',    color: '#B3261E', style: { hair: 0, hat: 'helmet', moustache: true } },
      { label: 'Ingenieur Sol',   color: '#B8955C', style: { hair: 2, glasses: true } },
      { label: 'Botanist Tamsin', color: '#5C8B5E', style: { hair: 1 } },
      { label: 'Kadet Yuki',      color: '#5C7AB8', style: { hair: 3, hat: 'helmet' } },
      { label: 'Kok Dima',        color: '#D9A441', style: { hair: 0, beard: true } },
      { label: 'Officier Paz',    color: '#2C3E50', style: { hair: 2, hat: 'helmet', glasses: true } },
      { label: 'Bioloog Wren',    color: '#C2185B', style: { hair: 1, hat: 'helmet' } }
    ],
    outro: 'De sluizen gaan weer open. De moordenaar vliegt geboeid mee naar huis.'
  }
];

const Themes = {
  list: () => THEMES,
  get: id => THEMES.find(t => t.id === id) || THEMES[0],
  forDay: dayNumber => THEMES[((dayNumber % THEMES.length) + THEMES.length) % THEMES.length]
};

if (typeof module !== 'undefined' && module.exports) module.exports = { THEMES, Themes };

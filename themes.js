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
      { label: 'Lady Clementine',     gender: 'f', color: '#B85C5C', style: { hair: 1 } },
      { label: 'Meneer Hargrove',    gender: 'm', color: '#5C7AB8', style: { hair: 0, moustache: true } },
      { label: 'Dr. Quill', gender: 'f', color: '#8B5CB8', style: { hair: 2, glasses: true } },
      { label: 'Mortimer',    gender: 'm', color: '#5C8B5E', style: { hair: 3, bowtie: true } },
      { label: 'Juniper',  gender: 'f', color: '#B8955C', style: { hair: 4 } },
      { label: 'Odette',  gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Majoor Pike', gender: 'm', color: '#2C3E50', style: { hair: 3, moustache: true } },
      { label: 'Tante Agatha', gender: 'f', color: '#7B5E3B', style: { hair: 1, glasses: true } }
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
      { label: 'Barnaby',   gender: 'm', color: '#B3261E', style: { hair: 0, hat: 'tricorn', beard: true } },
      { label: 'Bootsman Grimsby',gender: 'm', color: '#5C7AB8', style: { hair: 3, hat: 'bandana', eyepatch: true } },
      { label: 'Kok Saffron',     gender: 'f', color: '#B8955C', style: { hair: 2, hat: 'bandana' } },
      { label: 'Stuurman Ronan', gender: 'm', color: '#5C8B5E', style: { hair: 4, moustache: true } },
      { label: 'Juffrouw Coral', gender: 'f', color: '#8B5CB8', style: { hair: 1, hat: 'tricorn' } },
      { label: 'Kanonnier Thorne', gender: 'm', color: '#2C3E50', style: { hair: 3, hat: 'bandana', beard: true } },
      { label: 'Dokter Marlow',   gender: 'f', color: '#C2185B', style: { hair: 2, glasses: true } },
      { label: 'Scheepsjongen Pip', gender: 'm', color: '#7B5E3B', style: { hair: 4, hat: 'bandana' } }
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
      { label: 'Gravin Delacroix', gender: 'f', color: '#8B5CB8', style: { hair: 2, glasses: true } },
      { label: 'Portier Otis',   gender: 'm', color: '#5C7AB8', style: { hair: 0, hat: 'cap', moustache: true } },
      { label: 'Pianist Felix',     gender: 'm', color: '#2C3E50', style: { hair: 4, bowtie: true } },
      { label: 'Mevrouw Sato',     gender: 'f', color: '#B85C5C', style: { hair: 1 } },
      { label: 'Journalist Vance',  gender: 'm', color: '#5C8B5E', style: { hair: 3, hat: 'tophat' } },
      { label: 'Chef Brigitte',        gender: 'f', color: '#B3261E', style: { hair: 2, hat: 'cap' } },
      { label: 'Butler Winslow',      gender: 'm', color: '#7B5E3B', style: { hair: 3, bowtie: true, moustache: true } },
      { label: 'Danseres Lulu',     gender: 'f', color: '#C2185B', style: { hair: 4 } }
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
      { label: 'Dr. Nkemelu',     gender: 'm', color: '#8B5CB8', style: { hair: 4, hat: 'helmet' } },
      { label: 'Piloot Reyes',    gender: 'm', color: '#B3261E', style: { hair: 0, hat: 'helmet', moustache: true } },
      { label: 'Ingenieur Vega',   gender: 'f', color: '#B8955C', style: { hair: 2, glasses: true } },
      { label: 'Botanist Fern', gender: 'f', color: '#5C8B5E', style: { hair: 1 } },
      { label: 'Kadet Yuki',      gender: 'm', color: '#5C7AB8', style: { hair: 3, hat: 'helmet' } },
      { label: 'Kok Dima',        gender: 'm', color: '#D9A441', style: { hair: 0, beard: true } },
      { label: 'Officier Paz',    gender: 'f', color: '#2C3E50', style: { hair: 2, hat: 'helmet', glasses: true } },
      { label: 'Bioloog Wren',    gender: 'f', color: '#C2185B', style: { hair: 1, hat: 'helmet' } }
    ],
    outro: 'De sluizen gaan weer open. De moordenaar vliegt geboeid mee naar huis.'
  },
  {
    id: 'museum', unlock: 12, icon: '🏛️', title: 'Het Museum', short: 'Museum',
    map: { accent: '#2F6F6D', ring: '#D4A64A' }, tagline: 'Na sluitingstijd. Alle deuren op slot, één conservator op de vloer.',
    intro: 'Het Museum van Vlierbeek, nacht. Het alarm ging niet af, de deuren zaten dicht, en de conservator ligt tussen de beelden. Wie binnen was, is nog binnen.',
    victimName: 'Conservator Adriaan Vos', roomWord: 'zaal', roomWordPlural: 'zalen', floor: 'terrazzo',
    rooms: [
      { name: 'Egyptische Zaal', article: 'de', color: '#E3C58E' }, { name: 'Schilderijenzaal', article: 'de', color: '#E8A798' },
      { name: 'Dinozaal', article: 'de', color: '#B8D9A1' }, { name: 'Kluis', article: 'de', color: '#C1B3A0' },
      { name: 'Werkplaats', article: 'de', color: '#D9C7A6' }, { name: 'Museumwinkel', article: 'de', color: '#E3B7D6' },
      { name: 'Hal', article: 'de', color: '#B9AEDC' }, { name: 'Archief', article: 'het', color: '#F0CE8E' },
      { name: 'Beeldentuin', article: 'de', color: '#BFD8B0' }, { name: 'Depot', article: 'het', color: '#D0C9BD' },
      { name: 'Kantoor', article: 'het', color: '#A8BEE0' }, { name: 'Museumcafé', article: 'het', color: '#9FC8C8' }
    ],
    furniture: [
      { id: 'sarcofaag', nl: 'een sarcofaag' }, { id: 'schilderij', nl: 'een schilderij' }, { id: 'skelet', nl: 'een dinoskelet' },
      { id: 'vitrine', nl: 'een vitrine' }, { id: 'beeld', nl: 'een standbeeld' }
    ],
    suspects: [
      { label: 'Gids Margot',          gender: 'f', color: '#B85C5C', style: { hair: 1, glasses: true } },
      { label: 'Curator Ellery',         gender: 'm', color: '#5C7AB8', style: { hair: 0, bowtie: true } },
      { label: 'Restaurateur Iris',   gender: 'f', color: '#8B5CB8', style: { hair: 2 } },
      { label: 'Nachtwaker Gus',     gender: 'm', color: '#2C3E50', style: { hair: 3, hat: 'cap', moustache: true } },
      { label: 'Professor Adebayo',   gender: 'm', color: '#7B5E3B', style: { hair: 4, glasses: true, beard: true } },
      { label: 'Kunsthandelaar Lucian',  gender: 'm', color: '#B8955C', style: { hair: 3, hat: 'tophat' } },
      { label: 'Stagiair Noor',       gender: 'f', color: '#C2185B', style: { hair: 1 } },
      { label: 'Schoonmaker Hugo',    gender: 'm', color: '#5C8B5E', style: { hair: 0, hat: 'cap' } }
    ],
    outro: 'Het alarm gaat weer aan. De dader gaat mee, de collectie blijft.'
  },
  {
    id: 'trein', unlock: 16, icon: '🚂', title: 'De Nachttrein', short: 'Nachttrein',
    map: { accent: '#1F4E3D', ring: '#C9A227' }, tagline: 'Twaalf wagons, één tunnel, en een conducteur die zijn ronde nooit afmaakte.',
    intro: 'De nachttrein naar Wenen, 1934. In een tunnel valt het licht uit. Als het terugkomt, ligt de conducteur in de restauratiewagen. De volgende halte is pas om zes uur.',
    victimName: 'Conducteur Leon Marchetti', roomWord: 'wagon', roomWordPlural: 'wagons', floor: 'carpet',
    rooms: [
      { name: 'Restauratiewagen', article: 'de', color: '#E8A798' }, { name: 'Salonwagen', article: 'de', color: '#E3C58E' },
      { name: 'Coupé A', article: 'de', color: '#A8BEE0' }, { name: 'Coupé B', article: 'de', color: '#C7BEE3' },
      { name: 'Bagagewagen', article: 'de', color: '#D6C3A5' }, { name: 'Keukenwagen', article: 'de', color: '#9FC8C8' },
      { name: 'Postwagen', article: 'de', color: '#D9B8A0' }, { name: 'Barwagen', article: 'de', color: '#E3B7D6' },
      { name: 'Kolenwagen', article: 'de', color: '#C1B3A0' }, { name: 'Dienstruimte', article: 'de', color: '#BFD8B0' },
      { name: 'Locomotief', article: 'de', color: '#B0C4CC' }, { name: 'Balkon', article: 'het', color: '#F0CE8E' }
    ],
    furniture: [
      { id: 'hutkoffer', nl: 'een hutkoffer' }, { id: 'samovar', nl: 'een samovar' }, { id: 'grammofoon', nl: 'een grammofoon' },
      { id: 'bank', nl: 'een bank' }, { id: 'kroonluchter', nl: 'een kroonluchter' }
    ],
    suspects: [
      { label: 'Barones Von Stahl',   gender: 'f', color: '#8B5CB8', style: { hair: 2, glasses: true } },
      { label: 'Goochelaar Orlando',     gender: 'm', color: '#2C3E50', style: { hair: 0, hat: 'tophat', moustache: true } },
      { label: 'Schaakmeester Ivo',   gender: 'm', color: '#5C7AB8', style: { hair: 3, beard: true } },
      { label: 'Verpleegster Hedda',    gender: 'f', color: '#B85C5C', style: { hair: 1 } },
      { label: 'Reiziger Sami',       gender: 'm', color: '#B8955C', style: { hair: 4, hat: 'cap' } },
      { label: 'Actrice Lola',        gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Stoker Jules',        gender: 'm', color: '#5C8B5E', style: { hair: 0, hat: 'bandana' } },
      { label: 'Weduwe Duval',        gender: 'f', color: '#7B5E3B', style: { hair: 1, glasses: true } }
    ],
    outro: 'Bij zonsopgang rijdt de trein het station binnen. Eén reiziger stapt uit in handboeien.'
  },
  {
    id: 'circus', unlock: 20, icon: '🎪', title: 'Het Circus', short: 'Circus',
    map: { accent: '#B3261E', ring: '#F5D67A' }, tagline: 'De voorstelling is voorbij, de tent gaat dicht, en de directeur ligt in de piste.',
    intro: 'Circus Zano, de laatste voorstelling van het seizoen. Het publiek is naar huis, de tent gaat dicht, en directeur Zano ligt in het zaagsel van de piste. De artiesten zijn er nog allemaal.',
    victimName: 'Directeur Ferdinand Zano', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'zaagsel',
    rooms: [
      { name: 'Piste', article: 'de', color: '#E8A798' }, { name: 'Tribune', article: 'de', color: '#F0CE8E' },
      { name: 'Kleedwagen', article: 'de', color: '#E3B7D6' }, { name: 'Dierentent', article: 'de', color: '#B8D9A1' },
      { name: 'Kassa', article: 'de', color: '#9FC8C8' }, { name: 'Kantine', article: 'de', color: '#E3C58E' },
      { name: 'Werkplaats', article: 'de', color: '#D9C7A6' }, { name: 'Directiewagen', article: 'de', color: '#C7BEE3' },
      { name: 'Stalling', article: 'de', color: '#D6C3A5' }, { name: 'Kostuumwagen', article: 'de', color: '#B9AEDC' },
      { name: 'Ingang', article: 'de', color: '#A8BEE0' }, { name: 'Opslagtent', article: 'de', color: '#D0C9BD' }
    ],
    furniture: [
      { id: 'circuskanon', nl: 'een circuskanon' }, { id: 'trapeze', nl: 'een trapeze' }, { id: 'spiegelkast', nl: 'een spiegelkast' },
      { id: 'popcornkar', nl: 'een popcornkar' }, { id: 'kooi', nl: 'een leeuwenkooi' }
    ],
    suspects: [
      { label: 'Clown Pippo',          gender: 'm', color: '#B3261E', style: { hair: 0 } },
      { label: 'Trapezeartiest Mira',  gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Leeuwentemmer Gunther',   gender: 'm', color: '#B8955C', style: { hair: 3, moustache: true } },
      { label: 'Waarzegster Zora',     gender: 'f', color: '#8B5CB8', style: { hair: 1, hat: 'bandana' } },
      { label: 'Sterke Man Boris',     gender: 'm', color: '#2C3E50', style: { hair: 0, beard: true, moustache: true } },
      { label: 'Kaartverkoopster Dottie',    gender: 'f', color: '#5C8B5E', style: { hair: 4, glasses: true } },
      { label: 'Jongleur Teo',         gender: 'm', color: '#5C7AB8', style: { hair: 3, hat: 'cap' } },
      { label: 'Dierenarts Nadia',     gender: 'f', color: '#7B5E3B', style: { hair: 1, glasses: true } }
    ],
    outro: 'De tent wordt afgebroken. Het zaagsel wordt weggeveegd, en met het zaagsel het laatste spoor.'
  },
  {
    id: 'skihut', unlock: 24, icon: '🏔️', title: 'De Skihut', short: 'Skihut',
    map: { accent: '#3E5A6E', ring: '#DCEBF0' }, tagline: 'Een lawine sluit het dal af. Zeven gasten, één kachel, en een gastheer die niet meer opwarmt.',
    intro: 'Berghut Edelweiss, hoog in de Alpen. Een lawine sluit de enige weg af. Binnen: zeven gasten, één kachel, en een gastheer die bij het vuur niet meer opwarmt.',
    victimName: 'Gastheer Anton Berger', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'balken',
    rooms: [
      { name: 'Gelagkamer', article: 'de', color: '#E3C58E' }, { name: 'Keuken', article: 'de', color: '#9FC8C8' },
      { name: 'Slaapzaal', article: 'de', color: '#C7BEE3' }, { name: 'Skiberging', article: 'de', color: '#B0C4CC' },
      { name: 'Sauna', article: 'de', color: '#E8A798' }, { name: 'Terras', article: 'het', color: '#DCEBF0' },
      { name: 'Kelder', article: 'de', color: '#D6C3A5' }, { name: 'Zolder', article: 'de', color: '#D9C7A6' },
      { name: 'Wasruimte', article: 'de', color: '#8FC5D8' }, { name: 'Voorraadkamer', article: 'de', color: '#D0C9BD' },
      { name: 'Speelkamer', article: 'de', color: '#F0CE8E' }, { name: 'Hal', article: 'de', color: '#B9AEDC' }
    ],
    furniture: [
      { id: 'kachel', nl: 'een kachel' }, { id: 'slee', nl: 'een slee' }, { id: 'skirek', nl: 'een skirek' },
      { id: 'gewei', nl: 'een gewei' }, { id: 'fondue', nl: 'een fonduepan' }
    ],
    suspects: [
      { label: 'Skilerares Astrid',     gender: 'f', color: '#B85C5C', style: { hair: 1 } },
      { label: 'Bergredder Bjorn',       gender: 'm', color: '#5C8B5E', style: { hair: 3, beard: true } },
      { label: 'Toeriste Hana',        gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Kok Luigi',            gender: 'm', color: '#B8955C', style: { hair: 0, moustache: true } },
      { label: 'Fotograaf Emil',       gender: 'm', color: '#5C7AB8', style: { hair: 4, glasses: true } },
      { label: 'Dokter Ingrid',         gender: 'f', color: '#8B5CB8', style: { hair: 2, glasses: true } },
      { label: 'Jongen Kai',           gender: 'm', color: '#D9A441', style: { hair: 3, hat: 'cap' } },
      { label: 'Berggids Freya',        gender: 'f', color: '#2C3E50', style: { hair: 1, hat: 'bandana' } }
    ],
    outro: 'De hut is dicht, de sneeuw ligt weer stil. Jij weet wat eronder lag.'
  },
  {
    id: 'hacienda', unlock: 28, icon: '🌵', title: 'Hacienda San Isidro', short: 'Hacienda',
    map: { accent: '#A0522D', ring: '#F3DCC4' }, tagline: 'Het agavefeest van San Isidro. Muziek op de patio, en een patrón die niet meer opstaat.',
    intro: 'Hacienda San Isidro, Jalisco, 1952. De agave is geoogst en de hele familie viert feest. Dan ligt Don Rafael in de stokerij, tussen de koperen ketels.',
    victimName: 'Don Rafael Ortega', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'tegels',
    rooms: [
      { name: 'Patio', article: 'de', color: '#F0CE8E' }, { name: 'Stokerij', article: 'de', color: '#D9A36F' },
      { name: 'Kelder', article: 'de', color: '#C9B79C' }, { name: 'Kapel', article: 'de', color: '#E3B7D6' },
      { name: 'Keuken', article: 'de', color: '#9FC8C8' }, { name: 'Eetzaal', article: 'de', color: '#E8A798' },
      { name: 'Stal', article: 'de', color: '#C7D9A0' }, { name: 'Salon', article: 'de', color: '#B9AEDC' },
      { name: 'Veranda', article: 'de', color: '#BFD8B0' }, { name: 'Bibliotheek', article: 'de', color: '#D6C3A5' },
      { name: 'Wasruimte', article: 'de', color: '#8FC5D8' }, { name: 'Klokkentoren', article: 'de', color: '#A8BEE0' }
    ],
    furniture: [
      { id: 'agave', nl: 'een agave' }, { id: 'ketel', nl: 'een koperen ketel' }, { id: 'gitaar', nl: 'een gitaar' },
      { id: 'hangmat', nl: 'een hangmat' }, { id: 'pinata', nl: 'een piñata' }
    ],
    suspects: [
      { label: 'Doña Inés',             gender: 'f', color: '#B85C5C', style: { hair: 2 } },
      { label: 'Mariachi Rubén',        gender: 'm', color: '#5C8B5E', style: { hair: 0, moustache: true } },
      { label: 'Kokkin Lupita',         gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Voorman Esteban',       gender: 'm', color: '#B8955C', style: { hair: 3, beard: true, hat: 'cap' } },
      { label: 'Schilderes Paloma',     gender: 'f', color: '#8B5CB8', style: { hair: 1 } },
      { label: 'Neef Tomás',            gender: 'm', color: '#5C7AB8', style: { hair: 0, moustache: true } },
      { label: 'Notaris Guzmán',        gender: 'm', color: '#2C3E50', style: { hair: 3, glasses: true } },
      { label: 'Zuster Bárbara',        gender: 'f', color: '#D9A441', style: { hair: 2, hat: 'bandana' } }
    ],
    outro: 'De ketels koelen af, de muziek is stil. Jij weet wat er in de ketel zat.'
  },
  {
    id: 'opera', unlock: 32, icon: '🎭', title: 'Opéra Lumière', short: 'Opera',
    map: { accent: '#7A1430', ring: '#E8C77A' }, tagline: 'Rood fluweel, kristallen kroonluchters en een uitverkochte première. Alleen de directeur komt na de pauze niet terug.',
    intro: 'Opéra Lumière, Parijs, 1891. Goud, kristal en rood fluweel tot in de nok, en de première is uitverkocht. In de pauze ligt directeur Gaston Leclerc achter het toneel, onder het touwwerk.',
    victimName: 'Directeur Gaston Leclerc', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'parket',
    rooms: [
      { name: 'Toneel', article: 'het', color: '#F2C46D' }, { name: 'Coulisse', article: 'de', color: '#CDB89A' },
      { name: 'Orkestbak', article: 'de', color: '#7FB3B0' }, { name: 'Kleedkamer', article: 'de', color: '#F0A6A0' },
      { name: 'Foyer', article: 'de', color: '#9FCBA8' }, { name: 'Loge', article: 'de', color: '#D9737F' },
      { name: 'Rekwisietenkamer', article: 'de', color: '#D9B48A' }, { name: 'Toneelkelder', article: 'de', color: '#93A9C9' },
      { name: 'Kostuumatelier', article: 'het', color: '#E7A9CF' }, { name: 'Directiekamer', article: 'de', color: '#B3A1D6' },
      { name: 'Repetitiezaal', article: 'de', color: '#8CC3DE' }, { name: 'Trappenhuis', article: 'het', color: '#EAD9B0' }
    ],
    furniture: [
      { id: 'paspop', nl: 'een paspop' }, { id: 'harp', nl: 'een harp' }, { id: 'masker', nl: 'een masker' },
      { id: 'boeket', nl: 'een boeket' }, { id: 'toneelkijker', nl: 'een toneelkijker' }
    ],
    suspects: [
      { label: 'Diva Colette',          gender: 'f', color: '#C2185B', style: { hair: 4 } },
      { label: 'Tenor Matteo',          gender: 'm', color: '#5C7AB8', style: { hair: 4, moustache: true } },
      { label: 'Dirigent Armand',       gender: 'm', color: '#2C3E50', style: { hair: 4 } },
      { label: 'Danseres Ninon',        gender: 'f', color: '#8B5CB8', style: { hair: 2 } },
      { label: 'Kostumière Eloise',     gender: 'f', color: '#D9A441', style: { hair: 2, glasses: true } },
      { label: 'Baron Viktor',          gender: 'm', color: '#B8955C', style: { hair: 3, moustache: true, hat: 'tophat' } },
      { label: 'Toneelmeester Hugo',    gender: 'm', color: '#5C8B5E', style: { hair: 3, beard: true, hat: 'cap' } },
      { label: 'Recensente Simone',     gender: 'f', color: '#B85C5C', style: { hair: 1 } }
    ],
    outro: 'Het doek valt voor de laatste keer. Het applaus is voor jou.'
  },
  {
    id: 'opgraving', unlock: 36, icon: '🏺', title: 'Het Graf van Nefer-Ankh', short: 'Opgraving',
    map: { accent: '#1F4E79', ring: '#E3C27A' }, tagline: 'Luxor, 1922. Een verzegelde deur, een vloek op de drempel, en een lord die de eerste stap niet overleeft.',
    intro: 'Vallei der Koningen, november 1922. Na zes jaar graven vindt de expeditie een verzegelde deur. Lord Ashcombe gaat als eerste naar binnen. Hij komt er niet meer uit.',
    victimName: 'Lord Edmund Ashcombe', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'zandsteen',
    rooms: [
      { name: 'Grafkamer', article: 'de', color: '#F2C46D' }, { name: 'Voorkamer', article: 'de', color: '#D9B48A' },
      { name: 'Schatkamer', article: 'de', color: '#9FCBA8' }, { name: 'Gang', article: 'de', color: '#C9B79C' },
      { name: 'Werktent', article: 'de', color: '#E8A798' }, { name: 'Slaaptent', article: 'de', color: '#B3A1D6' },
      { name: 'Kampvuur', article: 'het', color: '#F3B57A' }, { name: 'Donkere kamer', article: 'de', color: '#93A9C9' },
      { name: 'Keuken', article: 'de', color: '#9FC8C8' }, { name: 'Voorraadkamer', article: 'de', color: '#D0C9BD' },
      { name: 'Stal', article: 'de', color: '#C7D9A0' }, { name: 'Ziekenboeg', article: 'de', color: '#8CC3DE' }
    ],
    furniture: [
      { id: 'canope', nl: 'een canopenkruik' }, { id: 'olielamp', nl: 'een olielamp' }, { id: 'kameel', nl: 'een kameel' },
      { id: 'papyrus', nl: 'een papyrusrol' }, { id: 'zeef', nl: 'een zeef' }
    ],
    suspects: [
      { label: 'Professor Hartley',     gender: 'm', color: '#B85C5C', style: { hair: 3, moustache: true, glasses: true } },
      { label: 'Lady Rosamund',         gender: 'f', color: '#5C8B5E', style: { hair: 1 } },
      { label: 'Tekenares Maud',        gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Opzichter Ahmed',       gender: 'm', color: '#B8955C', style: { hair: 0, beard: true } },
      { label: 'Correspondente Ivy',    gender: 'f', color: '#8B5CB8', style: { hair: 4 } },
      { label: 'Kameeldrijver Omar',    gender: 'm', color: '#5C7AB8', style: { hair: 0 } },
      { label: 'Egyptologe Edith',      gender: 'f', color: '#2C3E50', style: { hair: 2, glasses: true } },
      { label: 'Verzamelaar Von Hagen', gender: 'm', color: '#D9A441', style: { hair: 3, beard: true, hat: 'tophat' } }
    ],
    outro: 'Het graf is weer dicht. De vloek bestond niet. De dader wel.'
  },
  {
    id: 'casino', unlock: 40, icon: '🎰', title: 'Casino Azur', short: 'Casino',
    map: { accent: '#0F5E4A', ring: '#E8C77A' }, tagline: 'Monte Carlo, Grand Prix-weekend 1960. Fiches, champagne, en een eigenaar die zijn laatste gok verliest.',
    intro: 'Casino Azur, Monte Carlo, mei 1960. Het is Grand Prix-weekend en alle tafels zijn vol. Om middernacht ligt eigenaar Lorenzo Vitali in zijn eigen kluis, tussen de stapels fiches.',
    victimName: 'Eigenaar Lorenzo Vitali', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'ruiten',
    rooms: [
      { name: 'Speelzaal', article: 'de', color: '#9FCBA8' }, { name: 'Pokerkamer', article: 'de', color: '#7FB3B0' },
      { name: 'Kluis', article: 'de', color: '#C9B79C' }, { name: 'Bar', article: 'de', color: '#F2C46D' },
      { name: 'Terras', article: 'het', color: '#8CC3DE' }, { name: 'Garderobe', article: 'de', color: '#D0C9BD' },
      { name: 'Directiekamer', article: 'de', color: '#B3A1D6' }, { name: 'Balzaal', article: 'de', color: '#E7A9CF' },
      { name: 'Keuken', article: 'de', color: '#C7D9A0' }, { name: 'Jachthaven', article: 'de', color: '#93A9C9' },
      { name: 'Garage', article: 'de', color: '#D9B48A' }, { name: 'Salon', article: 'de', color: '#D9737F' }
    ],
    furniture: [
      { id: 'roulette', nl: 'een roulettewiel' }, { id: 'fiches', nl: 'een stapel fiches' }, { id: 'fruitautomaat', nl: 'een fruitautomaat' },
      { id: 'champagnetoren', nl: 'een champagnetoren' }, { id: 'shaker', nl: 'een cocktailshaker' }
    ],
    suspects: [
      { label: 'Croupier Marcel',       gender: 'm', color: '#B85C5C', style: { hair: 0, moustache: true } },
      { label: 'Zangeres Gigi',         gender: 'f', color: '#5C8B5E', style: { hair: 4 } },
      { label: 'Erfgename Delphine',    gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Coureur Rocco',         gender: 'm', color: '#B8955C', style: { hair: 4 } },
      { label: 'Bankier Sterling',      gender: 'm', color: '#8B5CB8', style: { hair: 3 } },
      { label: 'Fotomodel Tess',        gender: 'f', color: '#5C7AB8', style: { hair: 1 } },
      { label: 'Gokker Jack',           gender: 'm', color: '#2C3E50', style: { hair: 3, hat: 'tophat' } },
      { label: 'Huisdetective Nora',   gender: 'f', color: '#D9A441', style: { hair: 1, glasses: true } }
    ],
    outro: 'De tafels zijn leeg, de fiches geteld. Het huis wint niet altijd.'
  },
  {
    id: 'filmstudio', unlock: 44, icon: '🎬', title: 'Paradise Pictures', short: 'Filmstudio',
    map: { accent: '#26232E', ring: '#F2C46D' }, tagline: 'Hollywood, 1931. De eerste geluidsfilm van de studio, en een baas die zijn laatste scène niet haalt.',
    intro: 'Paradise Pictures, Hollywood, 1931. De studio draait zijn eerste geluidsfilm. Na de laatste opname van de dag ligt studiobaas Samuel Gold in de projectiezaal, terwijl de film nog loopt.',
    victimName: 'Studiobaas Samuel Gold', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'beton',
    rooms: [
      { name: 'Studiohal', article: 'de', color: '#F2C46D' }, { name: 'Montagekamer', article: 'de', color: '#93A9C9' },
      { name: 'Kleedkamer', article: 'de', color: '#F0A6A0' }, { name: 'Kantine', article: 'de', color: '#C7D9A0' },
      { name: 'Rekwisietenkamer', article: 'de', color: '#D9B48A' }, { name: 'Projectiezaal', article: 'de', color: '#B3A1D6' },
      { name: 'Werkplaats', article: 'de', color: '#C9B79C' }, { name: 'Directiekamer', article: 'de', color: '#D9737F' },
      { name: 'Geluidsstudio', article: 'de', color: '#7FB3B0' }, { name: 'Archief', article: 'het', color: '#D0C9BD' },
      { name: 'Buitenset', article: 'de', color: '#E9C9A0' }, { name: 'Poort', article: 'de', color: '#8CC3DE' }
    ],
    furniture: [
      { id: 'filmcamera', nl: 'een filmcamera' }, { id: 'schijnwerper', nl: 'een schijnwerper' }, { id: 'regiestoel', nl: 'een regiestoel' },
      { id: 'klapbord', nl: 'een klapbord' }, { id: 'filmspoel', nl: 'een filmspoel' }
    ],
    suspects: [
      { label: 'Filmster Vivian',           gender: 'f', color: '#B85C5C', style: { hair: 1 } },
      { label: 'Regisseur Baxter',          gender: 'm', color: '#5C8B5E', style: { hair: 0, glasses: true, hat: 'cap' } },
      { label: 'Schrijfster Peggy',         gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Stuntman Hank',             gender: 'm', color: '#B8955C', style: { hair: 3, hat: 'bandana' } },
      { label: 'Cameraman Lenny',           gender: 'm', color: '#8B5CB8', style: { hair: 0, hat: 'cap' } },
      { label: 'Grimeuse Rita',             gender: 'f', color: '#5C7AB8', style: { hair: 4, hat: 'bandana' } },
      { label: 'Agent Sid',                 gender: 'm', color: '#2C3E50', style: { hair: 3, moustache: true } },
      { label: 'Starlet Joy',               gender: 'f', color: '#D9A441', style: { hair: 4 } }
    ],
    outro: 'De lampen gaan uit en de film is in het blik. Het einde klopt eindelijk.'
  },
  {
    id: 'karavaan', unlock: 48, icon: '🐫', title: 'Karavanserai Al-Nour', short: 'Karavaan',
    map: { accent: '#0E6E73', ring: '#F2C46D' }, tagline: 'Een oase op de oude specerijenroute. Twaalf kamelen, acht reizigers, en een karavaanleider die niet meer vertrekt.',
    intro: 'Karavanserai Al-Nour, een oase op de oude specerijenroute. De karavaan rust één nacht binnen de muren. Bij zonsopgang ligt karavaanleider Idris bij de kamelen, en de poort is de hele nacht dicht geweest.',
    victimName: 'Karavaanleider Idris', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'mozaiek',
    rooms: [
      { name: 'Binnenplaats', article: 'de', color: '#F2C46D' }, { name: 'Bazaar', article: 'de', color: '#E8A798' },
      { name: 'Theehuis', article: 'het', color: '#9FCBA8' }, { name: 'Badhuis', article: 'het', color: '#8CC3DE' },
      { name: 'Waterput', article: 'de', color: '#93A9C9' }, { name: 'Gastenkamer', article: 'de', color: '#B3A1D6' },
      { name: 'Tapijtwinkel', article: 'de', color: '#D9737F' }, { name: 'Poort', article: 'de', color: '#C9B79C' },
      { name: 'Dakterras', article: 'het', color: '#F3B57A' }, { name: 'Stal', article: 'de', color: '#C7D9A0' },
      { name: 'Keuken', article: 'de', color: '#9FC8C8' }, { name: 'Voorraadkamer', article: 'de', color: '#D0C9BD' }
    ],
    furniture: [
      { id: 'tapijt', nl: 'een tapijt' }, { id: 'specerijen', nl: 'een mand specerijen' }, { id: 'kruik', nl: 'een waterkruik' },
      { id: 'zadel', nl: 'een kameelzadel' }, { id: 'weegschaal', nl: 'een koperen weegschaal' }
    ],
    suspects: [
      { label: 'Koopvrouw Layla',           gender: 'f', color: '#B85C5C', style: { hair: 4, hat: 'bandana' } },
      { label: 'Gids Tariq',                gender: 'm', color: '#5C8B5E', style: { hair: 0, hat: 'bandana' } },
      { label: 'Tapijthandelaar Yusuf',     gender: 'm', color: '#C2185B', style: { hair: 0, beard: true, hat: 'cap' } },
      { label: 'Reizigster Beatrix',        gender: 'f', color: '#B8955C', style: { hair: 1, hat: 'helmet' } },
      { label: 'Theeschenker Hamid',        gender: 'm', color: '#8B5CB8', style: { hair: 2, hat: 'cap' } },
      { label: 'Sterrenkijker Zahra',       gender: 'f', color: '#5C7AB8', style: { hair: 4, hat: 'bandana' } },
      { label: 'Bewaker Karim',             gender: 'm', color: '#2C3E50', style: { hair: 3, moustache: true } },
      { label: 'Dichteres Samira',          gender: 'f', color: '#D9A441', style: { hair: 2 } }
    ],
    outro: 'De karavaan trekt verder. Achter de poort blijft één geheim minder achter.'
  },
  {
    id: 'abdij', unlock: 52, icon: '⛪', title: 'De Abdij van Sint-Aldric', short: 'Abdij',
    map: { accent: '#3D4A2E', ring: '#E3C27A' }, tagline: 'Een abdij in de bergen, 1327. Een verboden boek, een gesloten bibliotheek, en een abt die de nacht niet overleeft.',
    intro: 'Abdij van Sint-Aldric, winter 1327. De sneeuw sluit de bergpas af. Na het nachtgebed ligt abt Bertram in het scriptorium, met inkt aan zijn vingers.',
    victimName: 'Abt Bertram', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'plavuizen',
    rooms: [
      { name: 'Scriptorium', article: 'het', color: '#F2C46D' }, { name: 'Kapel', article: 'de', color: '#E3B7D6' },
      { name: 'Kruidentuin', article: 'de', color: '#C7D9A0' }, { name: 'Bibliotheek', article: 'de', color: '#D9B48A' },
      { name: 'Refter', article: 'de', color: '#E8A798' }, { name: 'Slaapzaal', article: 'de', color: '#B3A1D6' },
      { name: 'Kloostergang', article: 'de', color: '#C9B79C' }, { name: 'Kelder', article: 'de', color: '#D0C9BD' },
      { name: 'Keuken', article: 'de', color: '#9FC8C8' }, { name: 'Klokkentoren', article: 'de', color: '#93A9C9' },
      { name: 'Ziekenboeg', article: 'de', color: '#8CC3DE' }, { name: 'Bakkerij', article: 'de', color: '#F3B57A' }
    ],
    furniture: [
      { id: 'lessenaar', nl: 'een schrijflessenaar' }, { id: 'kandelaar', nl: 'een kandelaar' }, { id: 'bijenkorf', nl: 'een bijenkorf' },
      { id: 'vijzel', nl: 'een vijzel' }, { id: 'zandloper', nl: 'een zandloper' }
    ],
    suspects: [
      { label: 'Broeder Anselm',            gender: 'm', color: '#B85C5C', style: { hair: 0, beard: true } },
      { label: 'Broeder Cuthbert',          gender: 'm', color: '#5C8B5E', style: { hair: 0 } },
      { label: 'Novice Elias',              gender: 'm', color: '#C2185B', style: { hair: 2 } },
      { label: 'Pelgrim Gisela',            gender: 'f', color: '#B8955C', style: { hair: 1, hat: 'tophat' } },
      { label: 'Kruidenvrouw Hilde',        gender: 'f', color: '#8B5CB8', style: { hair: 4, hat: 'bandana' } },
      { label: 'Gravin Mathilde',           gender: 'f', color: '#5C7AB8', style: { hair: 3 } },
      { label: 'Verluchtster Odile',        gender: 'f', color: '#2C3E50', style: { hair: 1 } },
      { label: 'Kelderbroeder Waldo',       gender: 'm', color: '#D9A441', style: { hair: 0, beard: true } }
    ],
    outro: 'De klok luidt voor het avondgebed. Het boek staat weer op zijn plank.'
  },
  {
    id: 'vuurtoren', unlock: 56, icon: '🌊', title: 'Vuurtoren Grauwkaap', short: 'Vuurtoren',
    map: { accent: '#2A4D69', ring: '#F5E6B8' }, tagline: '1900. Een eiland, een storm van drie dagen, en een vuurtoren die voor het eerst in twintig jaar donker is.',
    intro: 'Vuurtoren Grauwkaap, november 1900. Een storm sluit het eiland af van de wal. Om middernacht gaat het licht uit. Boven in de lantaarnkamer ligt wachter Silas Mourne.',
    victimName: 'Vuurtorenwachter Silas Mourne', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'kasseien',
    rooms: [
      { name: 'Lantaarnkamer', article: 'de', color: '#F2C46D' }, { name: 'Wenteltrap', article: 'de', color: '#D0C9BD' },
      { name: 'Wachtershuis', article: 'het', color: '#E8A798' }, { name: 'Steiger', article: 'de', color: '#D9B48A' },
      { name: 'Botenhuis', article: 'het', color: '#9FCBA8' }, { name: 'Seinkamer', article: 'de', color: '#B3A1D6' },
      { name: 'Klif', article: 'het', color: '#C9B79C' }, { name: 'Strand', article: 'het', color: '#EBD7A6' },
      { name: 'Keuken', article: 'de', color: '#9FC8C8' }, { name: 'Kelder', article: 'de', color: '#93A9C9' },
      { name: 'Werkplaats', article: 'de', color: '#C7D9A0' }, { name: 'Voorraadkamer', article: 'de', color: '#E3B7D6' }
    ],
    furniture: [
      { id: 'boei', nl: 'een reddingsboei' }, { id: 'fuik', nl: 'een kreeftenfuik' }, { id: 'misthoorn', nl: 'een misthoorn' },
      { id: 'stormlamp', nl: 'een stormlamp' }, { id: 'verrekijker', nl: 'een verrekijker' }
    ],
    suspects: [
      { label: 'Assistent Jonas',           gender: 'm', color: '#B85C5C', style: { hair: 2, hat: 'cap' } },
      { label: 'Huishoudster Martha',       gender: 'f', color: '#5C8B5E', style: { hair: 4 } },
      { label: 'Visser Bartel',             gender: 'm', color: '#C2185B', style: { hair: 0, beard: true, hat: 'helmet' } },
      { label: 'Loodsman Kees',             gender: 'm', color: '#B8955C', style: { hair: 3, moustache: true, hat: 'cap' } },
      { label: 'Vogelkundige Dorien',       gender: 'f', color: '#8B5CB8', style: { hair: 1, glasses: true } },
      { label: 'Schipbreukeling Lev',       gender: 'm', color: '#5C7AB8', style: { hair: 2 } },
      { label: 'Onderwijzeres Wilma',       gender: 'f', color: '#2C3E50', style: { hair: 3, glasses: true } },
      { label: 'Telegrafiste Fien',         gender: 'f', color: '#D9A441', style: { hair: 2 } }
    ],
    outro: 'Het licht draait weer. Elke schipper ziet het, en jij weet wie het doofde.'
  },
  // ── 1.6: wereld 17-24 (ontwerp in docs/werelden/ontwerp-1.6a.js en ontwerp-1.6b.js) ──
  {
    id: 'oceaanstomer', unlock: 60, icon: '🚢', title: 'SS Halcyon', short: 'Oceaanstomer',
    map: { accent: '#004048', ring: '#C9A227' }, tagline: 'Mei 1910. Vijf dagen tot New York, de komeet van Halley boven het dek, en een reder die de overkant niet haalt.',
    intro: 'SS Halcyon, mei 1910, midden op de Atlantische Oceaan. Op het promenadedek kijkt iedereen naar de komeet van Halley. Alleen reder Ambrose Kingsley niet: hij ligt in de rookkamer, naast een sigaar die nog smeult.',
    victimName: 'Reder Ambrose Kingsley', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'teakdek',
    rooms: [
      { name: 'Promenadedek', article: 'het', color: '#8CC3DE' }, { name: 'Balzaal', article: 'de', color: '#E7A9CF' },
      { name: 'Rookkamer', article: 'de', color: '#C9A27E' }, { name: 'Eetzaal', article: 'de', color: '#F2C46D' },
      { name: 'Suite', article: 'de', color: '#B3A1D6' }, { name: 'Machinekamer', article: 'de', color: '#9AA5B1' },
      { name: 'Brug', article: 'de', color: '#7FB3B0' }, { name: 'Radiokamer', article: 'de', color: '#D6E39A' },
      { name: 'Kombuis', article: 'de', color: '#F0957A' }, { name: 'Ruim', article: 'het', color: '#DDD3C0' },
      { name: 'Bibliotheek', article: 'de', color: '#C9677A' }, { name: 'Serre', article: 'de', color: '#9FCBA8' }
    ],
    furniture: [
      { id: 'stuurrad', nl: 'een stuurrad' }, { id: 'scheepstelegraaf', nl: 'een scheepstelegraaf' }, { id: 'dekstoel', nl: 'een dekstoel' },
      { id: 'scheepsbel', nl: 'een scheepsbel' }, { id: 'hoedendoos', nl: 'een hoedendoos' }
    ],
    suspects: [
      { label: 'Kapitein Grant',           gender: 'm', color: '#B85C5C', style: { hair: 0, beard: true, hat: 'cap' } },
      { label: 'Stewardess Molly',          gender: 'f', color: '#5C8B5E', style: { hair: 2 } },
      { label: 'Vliegenierster Solange',    gender: 'f', color: '#C2185B', style: { hair: 4, hat: 'cap' } },
      { label: 'Professor Lund',            gender: 'm', color: '#B8955C', style: { hair: 3, glasses: true } },
      { label: 'Suffragette Harriet',       gender: 'f', color: '#8B5CB8', style: { hair: 1, hat: 'tophat' } },
      { label: 'Marconist Arthur',          gender: 'm', color: '#5C7AB8', style: { hair: 0 } },
      { label: 'Hoofdmachinist Doyle',      gender: 'm', color: '#2C3E50', style: { hair: 3, moustache: true } },
      { label: 'Hoedenmaakster Edna',       gender: 'f', color: '#D9A441', style: { hair: 4, hat: 'tophat' } }
    ],
    outro: 'De Halcyon meert af in New York. Op de kade staat de politie te wachten, en jij weet voor wie.'
  },
  {
    id: 'ryokan', unlock: 64, icon: '🏮', title: 'Ryokan Tsukikage', short: 'Ryokan',
    map: { accent: '#5B2A4E', ring: '#E28AA5' }, tagline: 'Kyoto, 1925. Kersenbloesem in de tuin, warm water in de onsen, en een herbergier die zijn ochtendthee niet meer drinkt.',
    intro: 'Ryokan Tsukikage, in de heuvels bij Kyoto, april 1925. De kersen bloeien en alle kamers zijn vol. Bij de ochtendthee ontbreekt herbergier Genzo Kurata. Hij ligt in het theehuis, naast een kom die nog warm is.',
    victimName: 'Herbergier Genzo Kurata', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'tatami',
    rooms: [
      { name: 'Gastenkamer', article: 'de', color: '#F2C46D' }, { name: 'Onsen', article: 'de', color: '#8CC3DE' },
      { name: 'Theehuis', article: 'het', color: '#C9A27E' }, { name: 'Tuin', article: 'de', color: '#F0B8C8' },
      { name: 'Keuken', article: 'de', color: '#7FB3B0' }, { name: 'Veranda', article: 'de', color: '#F0957A' },
      { name: 'Hal', article: 'de', color: '#DDD3C0' }, { name: 'Eetzaal', article: 'de', color: '#D9737F' },
      { name: 'Bamboebos', article: 'het', color: '#9FCBA8' }, { name: 'Voorraadkamer', article: 'de', color: '#D6E39A' },
      { name: 'Steiger', article: 'de', color: '#9AA5B1' }, { name: 'Wasruimte', article: 'de', color: '#B3A1D6' }
    ],
    furniture: [
      { id: 'steenlantaarn', nl: 'een stenen lantaarn' }, { id: 'tetsubin', nl: 'een ijzeren theepot' }, { id: 'byobu', nl: 'een gouden kamerscherm' },
      { id: 'bonsai', nl: 'een bonsai' }, { id: 'wagasa', nl: 'een papieren parasol' }, { id: 'futon', nl: 'een futon' }
    ],
    suspects: [
      { label: 'Gastvrouw Fumiko',          gender: 'f', color: '#B85C5C', style: { hair: 2 } },
      { label: 'Kok Takeshi',               gender: 'm', color: '#5C8B5E', style: { hair: 0, hat: 'bandana' } },
      { label: 'Theemeesteres Chiyo',       gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Ingenieur Isamu',          gender: 'm', color: '#B8955C', style: { hair: 3, glasses: true } },
      { label: 'Fotografe Sachiko',         gender: 'f', color: '#8B5CB8', style: { hair: 1, hat: 'cap' } },
      { label: 'Tuinman Goro',              gender: 'm', color: '#5C7AB8', style: { hair: 0 } },
      { label: 'Plantkundige Evelyn',       gender: 'f', color: '#2C3E50', style: { hair: 1, hat: 'tophat' } },
      { label: 'Prentmaker Hiroshi',          gender: 'm', color: '#D9A441', style: { hair: 3 } }
    ],
    outro: 'De sneeuw dekt de tuin toe en de bron dampt. Elke gast mag naar huis, op één na.'
  },
  {
    id: 'fazenda', unlock: 68, icon: '☕', title: 'Fazenda Boa Esperança', short: 'Koffiefazenda',
    map: { accent: '#4A2C1A', ring: '#D9614A' }, tagline: 'Brazilië, 1926. Koffiebessen op de droogvloer, muziek op de veranda, en een koffiebaron die de oogst niet meer telt.',
    intro: 'Fazenda Boa Esperança, São Paulo, juni 1926. De oogst is binnen en de droogvloer ligt vol koffiebessen. Op het oogstfeest ontbreekt koffiebaron Augusto Valadares. Hij ligt in de branderij, tussen de zakken.',
    victimName: 'Koffiebaron Augusto Valadares', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'cementtegels',
    rooms: [
      { name: 'Droogvloer', article: 'de', color: '#F0957A' }, { name: 'Koffieveld', article: 'het', color: '#8FC79A' },
      { name: 'Pakhuis', article: 'het', color: '#DDD3C0' }, { name: 'Branderij', article: 'de', color: '#C49A7A' },
      { name: 'Veranda', article: 'de', color: '#8CC3DE' }, { name: 'Kapel', article: 'de', color: '#E7A9CF' },
      { name: 'Stal', article: 'de', color: '#D6E39A' }, { name: 'Keuken', article: 'de', color: '#7FB3B0' },
      { name: 'Eetkamer', article: 'de', color: '#D9737F' }, { name: 'Salon', article: 'de', color: '#B3A1D6' },
      { name: 'Studeerkamer', article: 'de', color: '#9AA5B1' }, { name: 'Serre', article: 'de', color: '#F2D36D' }
    ],
    furniture: [
      { id: 'koffiezak', nl: 'een koffiezak' }, { id: 'koffiemolen', nl: 'een koffiemolen' }, { id: 'koffiestruik', nl: 'een koffiestruik' },
      { id: 'papegaai', nl: 'een papegaai' }, { id: 'schommelstoel', nl: 'een schommelstoel' }
    ],
    suspects: [
      { label: 'Dona Celeste',              gender: 'f', color: '#B85C5C', style: { hair: 1 } },
      { label: 'Rentmeester Joaquim',       gender: 'm', color: '#5C8B5E', style: { hair: 0, moustache: true, hat: 'tophat' } },
      { label: 'Lerares Giulia',            gender: 'f', color: '#C2185B', style: { hair: 2 } },
      { label: 'Koffieproever Bento',       gender: 'm', color: '#B8955C', style: { hair: 3, moustache: true, skin: '#8D5524' } },
      { label: 'Pianiste Zélia',            gender: 'f', color: '#8B5CB8', style: { hair: 4 } },
      { label: 'Agronoom Hideo',            gender: 'm', color: '#5C7AB8', style: { hair: 0 } },
      { label: 'Inkoper Mulder',            gender: 'm', color: '#2C3E50', style: { hair: 3, beard: true, hat: 'cap' } },
      { label: 'Dokter Lúcia',              gender: 'f', color: '#D9A441', style: { hair: 1, hat: 'cap' } }
    ],
    outro: 'De droogvloer is leeg en de boeken kloppen weer. Op de veranda speelt de muziek verder.'
  },
  {
    id: 'zeppelin', unlock: 72, icon: '☁️', title: 'Luchtschip Cirrus', short: 'Zeppelin',
    map: { accent: '#665A80', ring: '#A9B8C8' }, tagline: '1929. Drie dagen boven de oceaan, niemand kan uitstappen, en de bouwer van het luchtschip landt niet mee.',
    intro: 'Luchtschip Cirrus, augustus 1929. Drie dagen drijft het schip boven de oceaan, op weg naar Rio de Janeiro. Na het diner ligt constructeur Anton Falk in de kaartenkamer, met de koers nog in zijn hand.',
    victimName: 'Constructeur Anton Falk', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'aluminium',
    rooms: [
      { name: 'Salon', article: 'de', color: '#B3A1D6' }, { name: 'Eetzaal', article: 'de', color: '#F2C46D' },
      { name: 'Slaapcabine', article: 'de', color: '#8CC3DE' }, { name: 'Kombuis', article: 'de', color: '#F0957A' },
      { name: 'Bar', article: 'de', color: '#C9677A' }, { name: 'Kaartenkamer', article: 'de', color: '#C9A27E' },
      { name: 'Radiokamer', article: 'de', color: '#D6E39A' }, { name: 'Stuurgondel', article: 'de', color: '#7FB3B0' },
      { name: 'Motorgondel', article: 'de', color: '#9AA5B1' }, { name: 'Loopbrug', article: 'de', color: '#DDD3C0' },
      { name: 'Postkamer', article: 'de', color: '#9FCBA8' }, { name: 'Uitkijkpost', article: 'de', color: '#E7A9CF' }
    ],
    furniture: [
      { id: 'luchtschroef', nl: 'een propeller' }, { id: 'sextant', nl: 'een sextant' }, { id: 'postzak', nl: 'een postzak' },
      { id: 'wereldbol', nl: 'een wereldbol' }, { id: 'schrijfmachine', nl: 'een schrijfmachine' }
    ],
    suspects: [
      { label: 'Commandant Brandt',         gender: 'm', color: '#B85C5C', style: { hair: 0, beard: true, hat: 'cap' } },
      { label: 'Verslaggeefster Daisy',     gender: 'f', color: '#5C8B5E', style: { hair: 1 } },
      { label: 'Navigator Mateus',          gender: 'm', color: '#C2185B', style: { hair: 4 } },
      { label: 'Weerkundige Liv',           gender: 'f', color: '#B8955C', style: { hair: 2, glasses: true } },
      { label: 'Monteur Rudi',             gender: 'm', color: '#8B5CB8', style: { hair: 3, hat: 'cap' } },
      { label: 'Tennisster Josette',        gender: 'f', color: '#5C7AB8', style: { hair: 1, hat: 'bandana' } },
      { label: 'Diplomaat Vidal',          gender: 'm', color: '#2C3E50', style: { hair: 3, moustache: true } },
      { label: 'Postmeesteres Elsbeth',     gender: 'f', color: '#D9A441', style: { hair: 2 } }
    ],
    outro: 'Het luchtschip ligt vast aan de mast. De koers klopte, en nu klopt de rest ook.'
  },
  {
    id: 'poolstation', unlock: 76, icon: '🐧', title: 'Poolstation Zuiderkruis', short: 'Poolstation',
    map: { accent: '#233A8C', ring: '#8FE3B9' }, tagline: 'Antarctica, 1958. Vier maanden poolnacht, acht overwinteraars, en een stationsleider die het midwinterfeest niet haalt.',
    intro: 'Poolstation Zuiderkruis, juni 1958. Het is midwinter in Antarctica: al weken geen zon, en geen vliegtuig tot de lente. Tijdens het midwinterfeest blijft één stoel leeg. Stationsleider Gunnar Holm ligt in de radiokamer, de koptelefoon nog op.',
    victimName: 'Stationsleider Gunnar Holm', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'traanplaat',
    rooms: [
      { name: 'Radiokamer', article: 'de', color: '#F2C46D' }, { name: 'Kennel', article: 'de', color: '#F5E6B8' },
      { name: 'Laboratorium', article: 'het', color: '#B6D5C9' }, { name: 'Kantine', article: 'de', color: '#E5B0A8' },
      { name: 'Slaapzaal', article: 'de', color: '#B3A1D6' }, { name: 'Machinekamer', article: 'de', color: '#C9B79C' },
      { name: 'Ziekenboeg', article: 'de', color: '#D9737F' }, { name: 'Voorraadkamer', article: 'de', color: '#E3B7D6' },
      { name: 'Werkplaats', article: 'de', color: '#C7D9A0' }, { name: 'Weerhut', article: 'de', color: '#8CC3DE' },
      { name: 'Observatorium', article: 'het', color: '#7FB3B0' }, { name: 'Sneeuwtunnel', article: 'de', color: '#DCEBF0' }
    ],
    furniture: [
      { id: 'zender', nl: 'een radiotoestel' }, { id: 'sledehond', nl: 'een sledehond' }, { id: 'weerballon', nl: 'een weerballon' },
      { id: 'sneeuwrups', nl: 'een sneeuwrups' }, { id: 'microscoop', nl: 'een microscoop' }
    ],
    suspects: [
      { label: 'Marconist Ole',             gender: 'm', color: '#B85C5C', style: { hair: 0, beard: true } },
      { label: 'Glaciologe Marina',         gender: 'f', color: '#5C8B5E', style: { hair: 1, hat: 'cap' } },
      { label: 'Dokter Kenji',              gender: 'm', color: '#C2185B', style: { hair: 3, glasses: true } },
      { label: 'Meteorologe Ruth',          gender: 'f', color: '#B8955C', style: { hair: 4, glasses: true } },
      { label: 'Hondenmenner Rewi',         gender: 'm', color: '#8B5CB8', style: { hair: 0, hat: 'cap', skin: '#C68642' } },
      { label: 'Monteur Lieve',             gender: 'f', color: '#5C7AB8', style: { hair: 2, hat: 'bandana' } },
      { label: 'Kok Mateo',                 gender: 'm', color: '#2C3E50', style: { hair: 3, moustache: true } },
      { label: 'Natuurkundige Hélène',      gender: 'f', color: '#D9A441', style: { hair: 1 } }
    ],
    outro: 'De zon staat weer boven het ijs. Het eerste vliegtuig brengt post, en neemt de dader mee naar huis.'
  },
  {
    id: 'winterpaleis', unlock: 80, icon: '❄️', title: 'Paleis Zvezdin', short: 'Winterpaleis',
    map: { accent: '#A03A6A', ring: '#E4ECF4' }, tagline: 'Sint-Petersburg, oudejaarsavond 1899. Een bevroren Neva, de laatste wals van de eeuw, en een graaf die zijn toost niet meer uitbrengt.',
    intro: 'Paleis Zvezdin, Sint-Petersburg, oudejaarsavond 1899. De Neva ligt bevroren en in de balzaal speelt het orkest de laatste wals van de eeuw. Om middernacht zou graaf Andrej Zvezdin een toost uitbrengen. Hij ligt in de bibliotheek, het glas nog vol.',
    victimName: 'Graaf Andrej Zvezdin', roomWord: 'kamer', roomWordPlural: 'kamers', floor: 'intarsia',
    rooms: [
      { name: 'Balzaal', article: 'de', color: '#F2C46D' }, { name: 'Bibliotheek', article: 'de', color: '#C9B79C' },
      { name: 'Kapel', article: 'de', color: '#F5E6B8' }, { name: 'IJsbaan', article: 'de', color: '#DCEBF0' },
      { name: 'Serre', article: 'de', color: '#C7D9A0' }, { name: 'Spiegelzaal', article: 'de', color: '#B3A1D6' },
      { name: 'Rookkamer', article: 'de', color: '#F0A6A0' }, { name: 'Keuken', article: 'de', color: '#8FC5D8' },
      { name: 'Trappenhuis', article: 'het', color: '#B6D5C9' }, { name: 'Eetzaal', article: 'de', color: '#D9737F' },
      { name: 'Garderobe', article: 'de', color: '#E3B7D6' }, { name: 'Koetshuis', article: 'het', color: '#93A9C9' }
    ],
    furniture: [
      { id: 'balalaika', nl: 'een balalaika' }, { id: 'matroesjka', nl: 'een matroesjka' }, { id: 'juwelenei', nl: 'een juwelenei' },
      { id: 'schaatsen', nl: 'een paar schaatsen' }, { id: 'ijszwaan', nl: 'een ijszwaan' }, { id: 'kaviaar', nl: 'een kaviaarschaal' }
    ],
    suspects: [
      { label: 'Gravin Jelena',             gender: 'f', color: '#B85C5C', style: { hair: 2 } },
      { label: 'Componist Sergej',          gender: 'm', color: '#5C8B5E', style: { hair: 4, glasses: true } },
      { label: 'Schaatsster Vera',          gender: 'f', color: '#C2185B', style: { hair: 1, hat: 'cap' } },
      { label: 'Goudsmid Pavel',            gender: 'm', color: '#B8955C', style: { hair: 3, beard: true } },
      { label: 'Gouvernante Mabel',         gender: 'f', color: '#8B5CB8', style: { hair: 2 } },
      { label: 'Luitenant Dmitri',          gender: 'm', color: '#5C7AB8', style: { hair: 0, moustache: true } },
      { label: 'Hofmeester Fjodor',         gender: 'm', color: '#2C3E50', style: { hair: 3, beard: true } },
      { label: 'Fotografe Sofia',           gender: 'f', color: '#D9A441', style: { hair: 4 } }
    ],
    outro: 'De kaarsen zijn uit en de nieuwe eeuw is begonnen. Het laatste geheim van de oude heb jij opgelost.'
  },
  {
    id: 'safarilodge', unlock: 84, icon: '🦒', title: 'Twiga Lodge', short: 'Safarilodge',
    map: { accent: '#7A5A14', ring: '#F2A65A' }, tagline: 'Kenia, 1974. Een miljoen gnoes op de vlakte, een lodge vol gasten, en een filmer die zijn laatste opname niet meer ziet.',
    intro: 'Twiga Lodge, Maasai Mara, augustus 1974. De grote trek is begonnen: een miljoen gnoes trekken langs de lodge en elke tent is bezet. Na het kampvuur ligt natuurfilmer Rupert Vane in de donkere kamer, tussen zijn filmrollen.',
    victimName: 'Natuurfilmer Rupert Vane', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'sisal',
    rooms: [
      { name: 'Veranda', article: 'de', color: '#F3B57A' }, { name: 'Waterpoel', article: 'de', color: '#8CC3DE' },
      { name: 'Kampvuur', article: 'het', color: '#F2C46D' }, { name: 'Bar', article: 'de', color: '#D9737F' },
      { name: 'Slaaptent', article: 'de', color: '#C9B79C' }, { name: 'Landingsbaan', article: 'de', color: '#E5B0A8' },
      { name: 'Uitkijktoren', article: 'de', color: '#C7D9A0' }, { name: 'Keuken', article: 'de', color: '#7FB3B0' },
      { name: 'Donkere kamer', article: 'de', color: '#B9AEDC' }, { name: 'Kantoor', article: 'het', color: '#DCEBF0' },
      { name: 'Garage', article: 'de', color: '#B6D5C9' }, { name: 'Eetzaal', article: 'de', color: '#EBD7A6' }
    ],
    furniture: [
      { id: 'safariwagen', nl: 'een safariwagen' }, { id: 'klamboe', nl: 'een klamboe' }, { id: 'windzak', nl: 'een windzak' },
      { id: 'acacia', nl: 'een acacia' }, { id: 'giraf', nl: 'een houten giraf' }, { id: 'sisalmand', nl: 'een sisalmand' }
    ],
    suspects: [
      { label: 'Eigenares Wambui',          gender: 'f', color: '#B85C5C', style: { hair: 4, hat: 'bandana', skin: '#8D5524' } },
      { label: 'Gids Otieno',               gender: 'm', color: '#5C8B5E', style: { hair: 0, hat: 'cap', skin: '#8D5524' } },
      { label: 'Dierenarts Njeri',          gender: 'f', color: '#C2185B', style: { hair: 3, skin: '#8D5524' } },
      { label: 'Piloot Kiprono',            gender: 'm', color: '#B8955C', style: { hair: 3, skin: '#8D5524' } },
      { label: 'Chef Hamisi',               gender: 'm', color: '#8B5CB8', style: { hair: 0, beard: true, hat: 'cap', skin: '#8D5524' } },
      { label: 'Journaliste Amina',         gender: 'f', color: '#5C7AB8', style: { hair: 4, skin: '#8D5524' } },
      { label: 'Geluidsman Felix',          gender: 'm', color: '#2C3E50', style: { hair: 1 } },
      { label: 'Biologe Hanne',             gender: 'f', color: '#D9A441', style: { hair: 2 } }
    ],
    outro: 'De gnoes trekken verder en de lodge wordt stil. De laatste opname is van jou.'
  },
  {
    id: 'hanok', unlock: 88, icon: '🌕', title: 'Hanok Dalbit', short: 'Hanok',
    map: { accent: '#45745F', ring: '#F5E6B8' }, tagline: 'Joseon, 1795. Een volle oogstmaan, een familie die thuiskomt, en een heer des huizes die zijn laatste gedicht niet afmaakt.',
    intro: 'Hanok Dalbit, in de bergen van Joseon, herfst 1795. Het is Chuseok: de oogstmaan is vol en de hele familie is thuis. Na het maanfeest ligt heer Yun Jae-ho in het paviljoen bij de vijver, naast een gedicht van drie regels.',
    victimName: 'Heer Yun Jae-ho', roomWord: 'kamer', roomWordPlural: 'kamers', floor: 'hanji',
    rooms: [
      { name: 'Binnenplaats', article: 'de', color: '#EBD7A6' }, { name: 'Theekamer', article: 'de', color: '#C7D9A0' },
      { name: 'Keuken', article: 'de', color: '#F3B57A' }, { name: 'Studeerkamer', article: 'de', color: '#B9AEDC' },
      { name: 'Paviljoen', article: 'het', color: '#8CC3DE' }, { name: 'Bibliotheek', article: 'de', color: '#DCEBF0' },
      { name: 'Gastenkamer', article: 'de', color: '#F0A6A0' }, { name: 'Kruidentuin', article: 'de', color: '#B6D5C9' },
      { name: 'Poort', article: 'de', color: '#D9737F' }, { name: 'Voorouderhal', article: 'de', color: '#D0C9BD' },
      { name: 'Kruikenterras', article: 'het', color: '#7FB3B0' }, { name: 'Voorraadkamer', article: 'de', color: '#E3B7D6' }
    ],
    furniture: [
      { id: 'gayageum', nl: 'een gayageum' }, { id: 'kimchipot', nl: 'een kimchipot' }, { id: 'janggu', nl: 'een trom' },
      { id: 'maanvaas', nl: 'een maanvaas' }, { id: 'inktsteen', nl: 'een inktsteen' }, { id: 'theetafel', nl: 'een theetafeltje' }
    ],
    suspects: [
      { label: 'Vrouwe Kang',               gender: 'f', color: '#B85C5C', style: { hair: 2 } },
      { label: 'Student Sang-u',            gender: 'm', color: '#5C8B5E', style: { hair: 0, hat: 'tophat' } },
      { label: 'Geneesvrouw So-yeon',       gender: 'f', color: '#C2185B', style: { hair: 2, hat: 'cap' } },
      { label: 'Schilder Dae-ho',           gender: 'm', color: '#B8955C', style: { hair: 3, beard: true, hat: 'cap' } },
      { label: 'Borduurster Yeon-i',        gender: 'f', color: '#8B5CB8', style: { hair: 1 } },
      { label: 'Tolk Hak-su',               gender: 'm', color: '#5C7AB8', style: { hair: 0, glasses: true, hat: 'tophat' } },
      { label: 'Kokkin Sun-i',              gender: 'f', color: '#2C3E50', style: { hair: 2, hat: 'bandana' } },
      { label: 'Marskramer Deok-su',        gender: 'm', color: '#D9A441', style: { hair: 0, hat: 'cap' } }
    ],
    outro: 'De maan staat weer vol boven de bergen. Het gedicht is af, en de laatste regel schreef jij.'
  }
];

// Korte naam voor op het bord: "Majoor Pike" → "Pike", "Dr. Quill" → "Quill", "Lady Clementine" → "Clementine".
const TITLES = new Set(['dr.', 'majoor', 'tante', 'kok', 'bootsman', 'stuurman', 'juffrouw', 'kanonnier', 'dokter', 'scheepsjongen',
  'gravin', 'portier', 'pianist', 'mevrouw', 'journalist', 'chef', 'butler', 'danseres', 'piloot', 'ingenieur', 'botanist', 'kadet',
  'officier', 'bioloog', 'gids', 'curator', 'restaurateur', 'nachtwaker', 'professor', 'stagiair', 'schoonmaker', 'kunsthandelaar',
  'barones', 'goochelaar', 'schaakmeester', 'verpleegster', 'reiziger', 'actrice', 'stoker', 'weduwe', 'conducteur',
  'clown', 'trapezeartiest', 'leeuwentemmer', 'waarzegster', 'sterke', 'man', 'kaartverkoper', 'kaartverkoopster', 'lady', 'meneer', 'jongleur', 'dierenarts',
  'skilerares', 'bergredder', 'toeriste', 'fotograaf', 'jongen', 'berggids', 'gastheer',
  'doña', 'mariachi', 'kokkin', 'voorman', 'schilderes', 'neef', 'notaris', 'zuster', 'don',
  'diva', 'tenor', 'dirigent', 'kostumière', 'baron', 'toneelmeester', 'recensente', 'directeur',
  'tekenares', 'opzichter', 'correspondente', 'kameeldrijver', 'egyptologe', 'verzamelaar',
  'croupier', 'zangeres', 'erfgename', 'coureur', 'bankier', 'fotomodel', 'gokker', 'huisdetective', 'eigenaar',
  'studiobaas', 'filmster', 'regisseur', 'schrijfster', 'stuntman', 'cameraman', 'grimeuse', 'agent', 'starlet',
  'karavaanleider', 'koopvrouw', 'tapijthandelaar', 'reizigster', 'theeschenker', 'sterrenkijker', 'bewaker', 'dichteres',
  'abt', 'broeder', 'novice', 'pelgrim', 'kruidenvrouw', 'verluchtster', 'kelderbroeder',
  'vuurtorenwachter', 'assistent', 'huishoudster', 'visser', 'loodsman', 'vogelkundige', 'schipbreukeling', 'onderwijzeres', 'telegrafiste',
  'reder', 'kapitein', 'stewardess', 'vliegenierster', 'suffragette', 'marconist', 'hoofdmachinist', 'hoedenmaakster',
  'herbergier', 'gastvrouw', 'theemeesteres', 'fotografe', 'tuinman', 'plantkundige', 'prentmaker',
  'koffiebaron', 'dona', 'rentmeester', 'lerares', 'koffieproever', 'pianiste', 'agronoom', 'inkoper',
  'constructeur', 'commandant', 'verslaggeefster', 'navigator', 'weerkundige', 'monteur', 'tennisster', 'diplomaat', 'postmeesteres',
  'stationsleider', 'glaciologe', 'meteorologe', 'hondenmenner', 'natuurkundige',
  'graaf', 'componist', 'schaatsster', 'goudsmid', 'gouvernante', 'luitenant', 'hofmeester',
  'natuurfilmer', 'eigenares', 'journaliste', 'geluidsman', 'biologe',
  'heer', 'vrouwe', 'student', 'geneesvrouw', 'schilder', 'borduurster', 'tolk', 'marskramer',
  // Engels
  'major', 'aunt', 'lady', 'mr.', 'cook', 'boatswain', 'helmsman', 'miss', 'gunner', 'cabin', 'boy', 'countess', 'doorman', 'mrs', 'dancer', 'pilot', 'engineer',
  'cadet', 'officer', 'biologist', 'guide', 'restorer', 'night', 'guard', 'art', 'dealer', 'intern', 'cleaner', 'baroness', 'magician', 'chess', 'master',
  'nurse', 'traveller', 'actress', 'widow', 'trapeze', 'artist', 'lion', 'tamer', 'fortune', 'teller', 'strongman', 'ticket', 'seller', 'juggler', 'vet',
  'ski', 'instructor', 'mountain', 'rescuer', 'tourist', 'photographer', 'young', 'host', 'chief',
  'nephew', 'notary', 'sister', 'painter', 'foreman', 'conductor', 'seamstress', 'stage', 'manager', 'critic',
  'correspondent', 'camel', 'driver', 'egyptologist', 'collector',
  'singer', 'heiress', 'racing', 'banker', 'model', 'gambler', 'house', 'detective', 'owner', 'doctor', 'mrs.',
  'studio', 'boss', 'film', 'star', 'director', 'writer', 'make-up', 'stuntman', 'cameraman', 'agent', 'starlet',
  'caravan', 'leader', 'merchant', 'carpet', 'tea', 'server', 'stargazer', 'poet',
  'abbot', 'brother', 'novice', 'pilgrim', 'herb', 'woman', 'illuminator', 'cellarer',
  'keeper', 'assistant', 'housekeeper', 'fisherman', 'ornithologist', 'castaway', 'schoolteacher', 'telegraphist',
  'shipowner', 'captain', 'aviatrix', 'wireless', 'operator', 'milliner',
  'innkeeper', 'hostess', 'gardener', 'botanist', 'printmaker',
  'coffee', 'overseer', 'teacher', 'taster', 'pianist', 'agronomist', 'buyer',
  'designer', 'commander', 'reporter', 'meteorologist', 'mechanic', 'tennis', 'diplomat', 'postmistress',
  'station', 'radio', 'glaciologist', 'dog', 'handler', 'physicist',
  'count', 'composer', 'skater', 'goldsmith', 'governess', 'lieutenant',
  'wildlife', 'filmmaker', 'sound', 'recordist',
  'lord', 'healer', 'embroiderer', 'interpreter', 'peddler']);

const PARTICLES = new Set(['von', 'van', 'de', 'der', 'den', 'du', 'la', 'le', 'di', 'da']);

// Gegraveerd portret per verdachte, in de stijl van Van Dam (Higgsfield, bron in art/portretten/).
THEMES.forEach(t => t.suspects.forEach((s, i) => { s.portrait = `assets/portretten/${t.id}-${i}.webp`; }));

const Themes = {
  list: () => THEMES,
  get: id => THEMES.find(t => t.id === id) || THEMES[0],
  // korte naam per vertaalde naam, uit het taalbestand (data.themes.<wereld>.suspectShort); gevuld door I18n.localizeData
  SHORT: {},
  // vorm van de naam midden in een zin, per vertaalde naam (data.themes.<wereld>.suspectRef), als een taal die heeft
  REF: {},
  shortName(label) {
    if (this.SHORT[label]) return this.SHORT[label];
    const parts = String(label || '').trim().split(/\s+/);
    while (parts.length > 1 && TITLES.has(parts[0].toLowerCase())) parts.shift();   // "Sterke Man Boris" → "Boris"
    // a name particle stays with the name: "Barones Von Stahl" → "Von Stahl", not "Von"
    if (parts.length > 1 && PARTICLES.has(parts[0].toLowerCase())) return parts.join(' ');
    return parts[0] || '';
  },
  forDay: dayNumber => THEMES[((dayNumber % THEMES.length) + THEMES.length) % THEMES.length]
};

if (typeof module !== 'undefined' && module.exports) module.exports = { THEMES, Themes };

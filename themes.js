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
  }
];

// Korte naam voor op het bord: "Majoor Pike" → "Pike", "Dr. Quill" → "Quill", "Lady Clementine" → "Clementine".
const TITLES = new Set(['dr.', 'majoor', 'tante', 'kok', 'bootsman', 'stuurman', 'juffrouw', 'kanonnier', 'dokter', 'scheepsjongen',
  'gravin', 'portier', 'pianist', 'mevrouw', 'journalist', 'chef', 'butler', 'danseres', 'piloot', 'ingenieur', 'botanist', 'kadet',
  'officier', 'bioloog', 'gids', 'curator', 'restaurateur', 'nachtwaker', 'professor', 'stagiair', 'schoonmaker', 'kunsthandelaar',
  'barones', 'goochelaar', 'schaakmeester', 'verpleegster', 'reiziger', 'actrice', 'stoker', 'weduwe', 'conducteur',
  'clown', 'trapezeartiest', 'leeuwentemmer', 'waarzegster', 'sterke', 'man', 'kaartverkoper', 'kaartverkoopster', 'lady', 'meneer', 'jongleur', 'dierenarts',
  'skilerares', 'bergredder', 'toeriste', 'fotograaf', 'jongen', 'berggids', 'gastheer',
  // Engels
  'major', 'aunt', 'lady', 'mr.', 'cook', 'boatswain', 'helmsman', 'miss', 'gunner', 'cabin', 'boy', 'countess', 'doorman', 'mrs', 'dancer', 'pilot', 'engineer',
  'cadet', 'officer', 'biologist', 'guide', 'restorer', 'night', 'guard', 'art', 'dealer', 'intern', 'cleaner', 'baroness', 'magician', 'chess', 'master',
  'nurse', 'traveller', 'actress', 'widow', 'trapeze', 'artist', 'lion', 'tamer', 'fortune', 'teller', 'strongman', 'ticket', 'seller', 'juggler', 'vet',
  'ski', 'instructor', 'mountain', 'rescuer', 'tourist', 'photographer', 'young', 'host', 'chief']);

const Themes = {
  list: () => THEMES,
  get: id => THEMES.find(t => t.id === id) || THEMES[0],
  shortName(label) {
    const parts = String(label || '').trim().split(/\s+/);
    while (parts.length > 1 && TITLES.has(parts[0].toLowerCase())) parts.shift();   // "Sterke Man Boris" → "Boris"
    return parts[0] || '';
  },
  forDay: dayNumber => THEMES[((dayNumber % THEMES.length) + THEMES.length) % THEMES.length]
};

if (typeof module !== 'undefined' && module.exports) module.exports = { THEMES, Themes };

// Design sheets for four of the eight worlds of 1.6 (PLAN-1.6.md, "Keuze Jaimy", 2 November 2026): Poolstation,
// Winterpaleis, Safarilodge and Hanok in de bergen. Same shape as window.ONTWERP in ontwerp.js; the other four worlds of
// 1.6 are designed in their own file. Shown by ontwerpblad-1.6b.html, proven by bewijs-1.6b.js
// (node docs/werelden/bewijs-1.6b.js). After Jaimy's yes each item becomes the themes.js entry, the portrait prompts
// and the campaign parts, as with the worlds of 1.4.
// nr is the place on the map (17-20 are the other four), unlock follows on 72 in steps of four.
// Room names that already exist in another world (Keuken, Kelder, Bibliotheek, Balzaal, ...) are reused on purpose:
// they are translated in all 19 languages with every word form. Each world brings three or four new room names.
// Room colours: twelve distinct hues per world. bewijs-1.6b.js measures the closest pair (CIEDE2000); every world
// here keeps at least 9 apart, the released worlds keep 1.5 to 7.6.
// floor: four new floor styles. floorCss holds the background for a light and a dark cell, exactly as it goes into
// style.css (.board-grid[data-floor="<floor>"] .bcell::before and .bcell.dark::before); floorNote says why.
// Suspect colours follow the fixed order of the 1.4 worlds. "look" is the portrait brief (English, like "era").
// Periods are chosen on purpose: Antarctica in the International Geophysical Year; Saint Petersburg at the turn of the
// century, in a private palace (not the Tsar's); Kenya in 1974, an independent country, at a Kenyan-owned lodge where
// owner, guide, vet, pilot, chef and journalist are suspects with their own trade; Korea in 1795, late Joseon, at
// Chuseok, far from the occupation and the war. Cosy mystery, no gore.
window.ONTWERP_16B = [
  {
    id: 'poolstation', nr: 21, unlock: 76, icon: '🐧', title: 'Poolstation Zuiderkruis', short: 'Poolstation',
    era: 'an international research station in Antarctica during the polar night of 1958',
    map: { accent: '#233A8C', ring: '#8FE3B9' },
    tagline: 'Antarctica, 1958. Vier maanden poolnacht, acht overwinteraars, en een stationsleider die het midwinterfeest niet haalt.',
    intro: 'Poolstation Zuiderkruis, juni 1958. Het is midwinter in Antarctica: al weken geen zon, en geen vliegtuig tot de lente. Tijdens het midwinterfeest blijft één stoel leeg. Stationsleider Gunnar Holm ligt in de radiokamer, de koptelefoon nog op.',
    victimName: 'Stationsleider Gunnar Holm', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'traanplaat',
    floorNote: 'Stalen traanplaat, zoals in de barakken en de machinekamer van een poolstation: korte ribbels, om en om liggend en staand.',
    floorCss: {
      light: 'radial-gradient(2.6px 0.9px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 0 0 / 10px 10px, radial-gradient(2.6px 0.9px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 5px 5px / 10px 10px, radial-gradient(0.9px 2.6px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 5px 0 / 10px 10px, radial-gradient(0.9px 2.6px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 0 5px / 10px 10px, rgba(255, 255, 255, 0.34)',
      dark: 'radial-gradient(2.6px 0.9px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 0 0 / 10px 10px, radial-gradient(2.6px 0.9px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 5px 5px / 10px 10px, radial-gradient(0.9px 2.6px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 5px 0 / 10px 10px, radial-gradient(0.9px 2.6px at 50% 50%, rgba(70, 90, 110, 0.17) 0 70%, transparent 100%) 0 5px / 10px 10px, rgba(20, 40, 60, 0.05)'
    },
    rooms: [
      { name: 'Radiokamer', article: 'de', color: '#F2C46D' }, { name: 'Kennel', article: 'de', color: '#F5E6B8' },
      { name: 'Laboratorium', article: 'het', color: '#B6D5C9' }, { name: 'Kantine', article: 'de', color: '#E5B0A8' },
      { name: 'Slaapzaal', article: 'de', color: '#B3A1D6' }, { name: 'Machinekamer', article: 'de', color: '#C9B79C' },
      { name: 'Ziekenboeg', article: 'de', color: '#D9737F' }, { name: 'Voorraadkamer', article: 'de', color: '#E3B7D6' },
      { name: 'Werkplaats', article: 'de', color: '#C7D9A0' }, { name: 'Weerhut', article: 'de', color: '#8CC3DE' },
      { name: 'Observatorium', article: 'het', color: '#7FB3B0' }, { name: 'Sneeuwtunnel', article: 'de', color: '#DCEBF0' }
    ],
    // icon: the <g> for avatars.js (viewBox 0 0 40 40, same strokes as the other worlds)
    furniture: [
      { id: 'zender', nl: 'een radiotoestel',
        icon: '<g><path d="M28 12 L33 3" stroke="#4A4A4A" stroke-width="1.3" stroke-linecap="round"/><circle cx="33" cy="3" r="1.3" fill="#B3261E"/><path d="M31 21 q5 1 4.5 7" fill="none" stroke="#1A1A1A" stroke-width="1"/><rect x="3" y="12" width="29" height="19" rx="2" fill="#6B7A5E" stroke="#2C3324" stroke-width="1.3"/><rect x="6" y="15" width="13" height="7" rx="1" fill="#F5E6B8" stroke="#2C3324" stroke-width="0.9"/><path d="M8 18.5 h9" stroke="#7A5A1C" stroke-width="0.7"/><path d="M8 17 v3 M10.5 17 v3 M13 17 v3 M15.5 17 v3" stroke="#7A5A1C" stroke-width="0.5"/><path d="M12 15.6 v5.8" stroke="#B3261E" stroke-width="1.1"/><circle cx="25.5" cy="18.5" r="3.4" fill="#2C2C2C" stroke="#111" stroke-width="0.9"/><path d="M25.5 15.8 v2.4" stroke="#BFC9D4" stroke-width="1.1" stroke-linecap="round"/><g fill="#2C3324"><circle cx="8" cy="26.5" r="1.1"/><circle cx="11.5" cy="26.5" r="1.1"/><circle cx="15" cy="26.5" r="1.1"/></g><circle cx="25.5" cy="26.5" r="1.8" fill="#F39C12" stroke="#7A5A1C" stroke-width="0.7"/><rect x="5" y="31" width="4" height="3" fill="#2C3324"/><rect x="26" y="31" width="4" height="3" fill="#2C3324"/><rect x="32.5" y="27.5" width="5" height="8" rx="2.2" fill="#2C2C2C" stroke="#111" stroke-width="0.8"/><path d="M33.5 30 h3 M33.5 32 h3" stroke="#6B6B6B" stroke-width="0.6"/></g>' },
      { id: 'sledehond', nl: 'een sledehond',
        icon: '<g><path d="M12 26 v8 M16 26 v8 M24 26 v8 M28 26 v8" stroke="#5A6470" stroke-width="2.4" stroke-linecap="round"/><path d="M9 19 q-7 -2 -4 -10 q5 -2 6 5" fill="#8A97A3" stroke="#3B4652" stroke-width="1.1" stroke-linejoin="round"/><path d="M7.5 20 q1 -6 9 -6 h9 q5 0 6 5 q0 8 -6 9 h-13 q-6 0 -5 -8z" fill="#8A97A3" stroke="#3B4652" stroke-width="1.2"/><path d="M11 26.3 q8 2.6 16 0" fill="none" stroke="#F3EDE3" stroke-width="2.4" stroke-linecap="round"/><path d="M21.5 14.4 v13.4" stroke="#B3261E" stroke-width="2.2"/><path d="M26 17 l0.5 -10 l3.6 4.6 l3.2 -4.6 l1.2 9.5 q4 2 4 5 q0 2.2 -2.3 2.2 h-6 q-4 0 -4.2 -3.3z" fill="#8A97A3" stroke="#3B4652" stroke-width="1.2" stroke-linejoin="round"/><path d="M30.5 18.4 q2.2 -2.6 4.4 0 q3 0.8 3.8 3.2 h-6 q-2.2 0 -2.2 -3.2z" fill="#F3EDE3"/><circle cx="38" cy="21.2" r="1" fill="#1A1108"/><circle cx="31.8" cy="15.6" r="0.9" fill="#1A1108"/></g>' },
      { id: 'weerballon', nl: 'een weerballon',
        icon: '<g><path d="M20 25.5 q-3 4 0 8.5" fill="none" stroke="#5A6470" stroke-width="0.9"/><circle cx="20" cy="13.5" r="11" fill="#FAF5EF" stroke="#8A97A3" stroke-width="1.3"/><path d="M26 6.5 q5 6 0.5 14" fill="none" stroke="#DCE3EA" stroke-width="2.6" stroke-linecap="round"/><path d="M14 8 q2 -2.5 5 -3" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/><path d="M18.4 24 h3.2 l-1.6 2.6z" fill="#8A97A3"/><rect x="16" y="33.5" width="8" height="5" rx="1" fill="#F39C12" stroke="#7A5A1C" stroke-width="1"/><path d="M18 36 h4" stroke="#7A5A1C" stroke-width="0.8"/></g>' },
      { id: 'sneeuwrups', nl: 'een sneeuwrups',
        icon: '<g><path d="M8 21 v-5 q0 -2 2 -2 h5 l3.5 -6 h11 q2 0 2 2 v11z" fill="#E0632A" stroke="#7A2A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M19.3 9.6 h4 v4.8 h-6.8z" fill="#DCEBF0" stroke="#7A2A1C" stroke-width="0.8" stroke-linejoin="round"/><rect x="25" y="9.6" width="4.4" height="4.8" fill="#DCEBF0" stroke="#7A2A1C" stroke-width="0.8"/><rect x="4" y="20.5" width="32" height="4.5" rx="1.2" fill="#C24E1E" stroke="#7A2A1C" stroke-width="1"/><circle cx="34.3" cy="18.6" r="1.4" fill="#F5D67A" stroke="#7A5A1C" stroke-width="0.6"/><rect x="2.5" y="26" width="16" height="8.5" rx="4.2" fill="#3B3B3B" stroke="#111" stroke-width="1"/><rect x="21.5" y="26" width="16" height="8.5" rx="4.2" fill="#3B3B3B" stroke="#111" stroke-width="1"/><g fill="#8A97A3" stroke="#111" stroke-width="0.5"><circle cx="7" cy="30.2" r="2"/><circle cx="14" cy="30.2" r="2"/><circle cx="26" cy="30.2" r="2"/><circle cx="33" cy="30.2" r="2"/></g></g>' },
      { id: 'microscoop', nl: 'een microscoop',
        icon: '<g><path d="M8 35 h21 v-2.5 q0 -2 -2 -2 h-17 q-2 0 -2 2z" fill="#2C2C2C" stroke="#111" stroke-width="1"/><path d="M25 30.5 q7 -9 -1 -19" fill="none" stroke="#3B3B3B" stroke-width="3.6" stroke-linecap="round"/><rect x="9" y="23" width="16" height="2.8" rx="1" fill="#3B3B3B"/><rect x="11.5" y="21.8" width="9" height="1.3" fill="#8CC3DE"/><path d="M11.5 6 l5.6 -1.6 l5.2 15.2 l-4.4 1.4z" fill="#BFC9D4" stroke="#3B3B3B" stroke-width="1.1" stroke-linejoin="round"/><path d="M10.2 4.6 l7.4 -2.2 l0.9 2.8 l-7.4 2.2z" fill="#3B3B3B"/><path d="M17.6 20.8 l3.6 -1.1 l0.9 2.4 l-3.4 1z" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.6"/><circle cx="27.6" cy="20.5" r="2.3" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.8"/></g>' }
    ],
    suspects: [
      { label: 'Marconist Ole', gender: 'm', color: '#B85C5C', who: 'Noorse radioman, de enige stem naar de buitenwereld',
        look: 'a Norwegian radio operator in his thirties, short blond beard, Fair Isle knitted sweater, headphones around his neck, pencil behind his ear' },
      { label: 'Glaciologe Marina', gender: 'f', color: '#5C8B5E', who: 'Sovjetonderzoekster op uitwisseling, boort ijs van duizenden jaren oud',
        look: 'a Soviet glaciologist in her forties, short practical hair, fur ushanka hat with the flaps tied up, quilted padded jacket, a long cylinder of ice core in gloved hands' },
      { label: 'Dokter Kenji', gender: 'm', color: '#C2185B', who: 'Arts van de Japanse expeditie, verzorgt mensen én honden',
        look: 'a Japanese expedition doctor in his thirties, round wire glasses, neat side-parted hair, white coat over a thick wool turtleneck, stethoscope' },
      { label: 'Meteorologe Ruth', gender: 'f', color: '#B8955C', who: 'Amerikaanse weervrouw, laat twee keer per dag een ballon op',
        look: 'an American meteorologist in her thirties, short curls, horn-rimmed glasses, red parka with a fur-trimmed hood down, clipboard with weather charts' },
      { label: 'Hondenmenner Rewi', gender: 'm', color: '#8B5CB8', who: 'Komt uit Nieuw-Zeeland en kent elke hond bij naam',
        look: 'a Maori dog handler from New Zealand in his twenties, broad warm smile, woollen beanie, windproof anorak, sealskin mittens, a dog harness over his shoulder' },
      { label: 'Monteur Lieve', gender: 'f', color: '#5C7AB8', who: 'Belgische mecanicien, houdt de generator en de sneeuwrups aan de praat',
        look: 'a Belgian mechanic in her thirties, hair tied back under a knitted cap, oil-stained overalls over a wool sweater, a large spanner in hand' },
      { label: 'Kok Mateo', gender: 'm', color: '#2C3E50', who: 'Argentijnse kok, tovert van blikken en sneeuw een feestmaal',
        look: 'an Argentine cook in his forties, thick dark moustache, white apron over a checked flannel shirt, rolled sleeves, a ladle in hand' },
      { label: 'Natuurkundige Hélène', gender: 'f', color: '#D9A441', who: 'Franse onderzoekster, meet elke nacht het poollicht',
        look: 'a French physicist in her thirties, dark bob, polo-neck sweater under a duffle coat, a notebook full of aurora sketches and a small brass instrument' }
    ],
    parts: [
      ['Het midwinterfeest', 'Kaarsen, een taart uit blik en één lege stoel. De stationsleider ligt in de radiokamer.'],
      ['Radiostilte', 'De zender zwijgt. Iemand heeft er een radiobuis uitgehaald.'],
      ['De sneeuwstorm', 'Drie dagen storm, en wie naar buiten gaat, volgt het touw. Eén touw is losgemaakt.'],
      ['De ijskern', 'Een kern van tienduizend jaar oud ijs ligt in stukken. Niet per ongeluk.'],
      ['Het poollicht', 'Groen licht boven de basis. Iedereen kijkt omhoog, behalve één.'],
      ['De hondenslee', 'Een tocht naar het depot, twee dagen heen. De slee komt terug met de verkeerde lading.'],
      ['De weerballon', 'Twee keer per dag gaat er een ballon op. Vandaag hing er een briefje aan.'],
      ['De eerste zon', 'Na vier maanden komt de zon terug, en het vliegtuig. Nog één nacht onder het poollicht.']
    ],
    outro: 'De zon staat weer boven het ijs. Het eerste vliegtuig brengt post, en neemt de dader mee naar huis.'
  },
  {
    id: 'winterpaleis', nr: 22, unlock: 80, icon: '❄️', title: 'Paleis Zvezdin', short: 'Winterpaleis',
    era: "a nobleman's palace on the frozen Neva in Saint Petersburg on New Year's Eve 1899",
    map: { accent: '#A03A6A', ring: '#E4ECF4' },
    tagline: 'Sint-Petersburg, oudejaarsavond 1899. Een bevroren Neva, de laatste wals van de eeuw, en een graaf die zijn toost niet meer uitbrengt.',
    intro: 'Paleis Zvezdin, Sint-Petersburg, oudejaarsavond 1899. De Neva ligt bevroren en in de balzaal speelt het orkest de laatste wals van de eeuw. Om middernacht zou graaf Andrej Zvezdin een toost uitbrengen. Hij ligt in de bibliotheek, het glas nog vol.',
    victimName: 'Graaf Andrej Zvezdin', roomWord: 'kamer', roomWordPlural: 'kamers', floor: 'intarsia',
    floorNote: 'Ingelegd paleisparket, zoals in de Petersburgse paleizen: om en om een vak met een ingelegd paneel en een vak met smalle stroken.',
    floorCss: {
      light: 'repeating-linear-gradient(90deg, rgba(90, 50, 20, 0.10) 0 1px, transparent 1px 25%), rgba(255, 255, 255, 0.30)',
      dark: 'linear-gradient(rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.20)) center / 60% 60% no-repeat, linear-gradient(rgba(90, 50, 20, 0.08), rgba(90, 50, 20, 0.08)) center / 68% 68% no-repeat, rgba(90, 50, 20, 0.04)'
    },
    rooms: [
      { name: 'Balzaal', article: 'de', color: '#F2C46D' }, { name: 'Bibliotheek', article: 'de', color: '#C9B79C' },
      { name: 'Kapel', article: 'de', color: '#F5E6B8' }, { name: 'IJsbaan', article: 'de', color: '#DCEBF0' },
      { name: 'Serre', article: 'de', color: '#C7D9A0' }, { name: 'Spiegelzaal', article: 'de', color: '#B3A1D6' },
      { name: 'Rookkamer', article: 'de', color: '#F0A6A0' }, { name: 'Keuken', article: 'de', color: '#8FC5D8' },
      { name: 'Trappenhuis', article: 'het', color: '#B6D5C9' }, { name: 'Eetzaal', article: 'de', color: '#D9737F' },
      { name: 'Garderobe', article: 'de', color: '#E3B7D6' }, { name: 'Koetshuis', article: 'het', color: '#93A9C9' }
    ],
    furniture: [
      { id: 'balalaika', nl: 'een balalaika',
        icon: '<g><path d="M20 22 V4.5" stroke="#5A3A1E" stroke-width="2.6" stroke-linecap="round"/><path d="M17.8 1.5 h4.4 l-0.6 5 h-3.2z" fill="#3B2A1B"/><path d="M16.8 3 h-1.6 M16.8 5 h-1.6 M23.2 3 h1.6 M23.2 5 h1.6" stroke="#C9A227" stroke-width="1"/><path d="M20 13 Q27 22 34 35 Q20 38.5 6 35 Q13 22 20 13z" fill="#D99A4E" stroke="#7A4A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M13.5 30.5 Q20 18 26.5 30.5" fill="#C27A36" stroke="#7A4A1C" stroke-width="0.8"/><circle cx="20" cy="25" r="1.8" fill="#3B2A1B"/><path d="M16.5 33.5 h7" stroke="#3B2A1B" stroke-width="1.3"/><path d="M19.2 6 V33.5 M20 6 V33.5 M20.8 6 V33.5" stroke="#F3EDE3" stroke-width="0.45"/></g>' },
      { id: 'matroesjka', nl: 'een matroesjka',
        icon: '<g><path d="M31 21 q-4 0 -4 4 q-2 1.6 -2 5 q0 5 6 5 q6 0 6 -5 q0 -3.4 -2 -5 q0 -4 -4 -4z" fill="#2E6DA4" stroke="#1A3A5A" stroke-width="1"/><circle cx="31" cy="25.2" r="2.2" fill="#F2D3B3" stroke="#1A3A5A" stroke-width="0.6"/><path d="M29 30.5 q2 2.6 4 0" fill="none" stroke="#F5E6B8" stroke-width="1.1"/><path d="M15 5 q-7.5 0 -7.5 7.5 q-3.5 3 -3.5 10.5 q0 12.5 11 12.5 q11 0 11 -12.5 q0 -7.5 -3.5 -10.5 q0 -7.5 -7.5 -7.5z" fill="#B3261E" stroke="#5A1A12" stroke-width="1.2"/><circle cx="15" cy="12.5" r="4.6" fill="#F2D3B3" stroke="#5A1A12" stroke-width="0.8"/><path d="M10.6 11.6 q4.4 -4.2 8.8 0 q-1.6 -2.6 -4.4 -2.6 q-2.8 0 -4.4 2.6z" fill="#7A3E1C"/><circle cx="13.2" cy="14.2" r="0.9" fill="#E8798F"/><circle cx="16.8" cy="14.2" r="0.9" fill="#E8798F"/><circle cx="13.6" cy="12.4" r="0.5" fill="#1A1108"/><circle cx="16.4" cy="12.4" r="0.5" fill="#1A1108"/><ellipse cx="15" cy="26" rx="6" ry="7" fill="#F5E6B8" stroke="#5A1A12" stroke-width="0.8"/><circle cx="15" cy="24.5" r="2.4" fill="#B3261E"/><circle cx="15" cy="24.5" r="0.9" fill="#F2C14E"/><path d="M15 27 v3.5 M12.6 29.2 q2.4 -1.2 4.8 0" stroke="#3F7D4E" stroke-width="1" fill="none"/></g>' },
      { id: 'juwelenei', nl: 'een juwelenei',
        icon: '<g><path d="M13.5 37 h13 l-2.2 -4.6 h-8.6z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1"/><path d="M20 3.5 q10.5 0 10.5 16 q0 13 -10.5 13 q-10.5 0 -10.5 -13 q0 -16 10.5 -16z" fill="#C2507E" stroke="#7A5A1C" stroke-width="1.3"/><path d="M10.4 15 q9.6 4 19.2 0 M9.6 23.5 q10.4 4 20.8 0" fill="none" stroke="#E0B95A" stroke-width="1.7"/><path d="M20 3.5 V32.5" stroke="#E0B95A" stroke-width="1.2"/><path d="M14 7.5 q-3 4 -3.6 10" fill="none" stroke="#E79AB8" stroke-width="1.4" stroke-linecap="round"/><g fill="#FAF5EF" stroke="#7A5A1C" stroke-width="0.6"><circle cx="20" cy="17" r="1.6"/><circle cx="20" cy="25.6" r="1.6"/><circle cx="14" cy="16.6" r="1.1"/><circle cx="26" cy="16.6" r="1.1"/><circle cx="14" cy="25" r="1.1"/><circle cx="26" cy="25" r="1.1"/></g><circle cx="20" cy="3" r="1.7" fill="#8CC3DE" stroke="#C9A227" stroke-width="0.9"/></g>' },
      { id: 'schaatsen', nl: 'een paar schaatsen',
        icon: '<g><path d="M18 4 h8 l0.8 11 q7 1 9.5 3.4 q0.8 1.8 -1 2.6 h-17.3z" fill="#E3DCCB" stroke="#5A4A3A" stroke-width="1.1" stroke-linejoin="round"/><path d="M16.5 24 h21 q3 0 2.5 -2.5" fill="none" stroke="#8A97A3" stroke-width="1.6" stroke-linecap="round"/><path d="M20 21 v3 M33 20.5 v3.5" stroke="#5A6470" stroke-width="1.2"/><path d="M6 11 h9 l1 13 q8 1 11 4 q1 2 -1 3 h-20z" fill="#FAF5EF" stroke="#3B2A1B" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 14 l4.5 1.5 M9 17 l4.5 1.5 M9 20 l4.5 1.5 M9.5 23 l4.5 1.5" stroke="#B3261E" stroke-width="0.9"/><rect x="6" y="31" width="5" height="2" fill="#3B2A1B"/><path d="M8 33 v3 M23 31 v5" stroke="#5A6470" stroke-width="1.4"/><path d="M3 36 h25 q4.5 0 4 -3.5" fill="none" stroke="#8A97A3" stroke-width="2" stroke-linecap="round"/></g>' },
      { id: 'ijszwaan', nl: 'een ijszwaan',
        icon: '<g><ellipse cx="20" cy="34" rx="15" ry="3.2" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.1"/><path d="M7 26 q2 6.5 13 6.5 q11 0 14 -9 q-6 3.4 -11 1.4 q-4 -1.6 -5 -5.6 q-1 -5 1.6 -8.6 q2 -3 0 -5.4 q-3 -2.2 -5.8 0.6 q-1.6 1.8 0 3.6 q2.6 0.6 1.6 3.6 q-2 5.4 -0.2 9.6 q-5 -1.6 -8.2 3.3z" fill="#DCEBF0" stroke="#5A8AA8" stroke-width="1.2" stroke-linejoin="round"/><path d="M21 26.5 q6 0.4 10.5 -2.4 M20 29.4 q7 0.4 11.6 -3.2" fill="none" stroke="#8CC3DE" stroke-width="1"/><path d="M13 8.3 l-3.6 1.5 l3.6 0.9z" fill="#8CC3DE" stroke="#5A8AA8" stroke-width="0.5"/><path d="M16 10 q-1 3 1 4" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/><path d="M31 4.5 l1 3.2 l3.2 1 l-3.2 1 l-1 3.2 l-1 -3.2 l-3.2 -1 l3.2 -1z" fill="#8CC3DE"/></g>' },
      { id: 'kaviaar', nl: 'een kaviaarschaal',
        icon: '<g><path d="M31 15.5 L37 7.5" stroke="#E8DCC8" stroke-width="1.5" stroke-linecap="round"/><path d="M4.5 19 h31 q-1 11 -15.5 11 q-14.5 0 -15.5 -11z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.2"/><path d="M7.5 24 q12.5 5 25 0" fill="none" stroke="#DCE3EA" stroke-width="1.2"/><path d="M17 30 h6 l1.2 4 h-8.4z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1"/><rect x="11" y="34" width="18" height="2.6" rx="1.2" fill="#8A97A3" stroke="#5A6470" stroke-width="0.8"/><path d="M6.5 19 l2.6 -4 l2.6 2.8 l3 -5 l2.4 4 l3.2 -3.6 l2.4 3.6 l3 -4.6 l2.8 4.2 l2.4 -2.6 l2.2 5.2z" fill="#F3F8FA" stroke="#8CC3DE" stroke-width="0.8" stroke-linejoin="round"/><ellipse cx="20" cy="17.5" rx="7" ry="2.6" fill="#2C2C2C" stroke="#5A6470" stroke-width="0.9"/><g fill="#6B6B6B"><circle cx="16.5" cy="17.3" r="0.7"/><circle cx="19" cy="16.6" r="0.7"/><circle cx="21.6" cy="17.6" r="0.7"/><circle cx="24" cy="16.9" r="0.7"/><circle cx="18.6" cy="18.4" r="0.7"/></g><ellipse cx="30" cy="16.6" rx="2" ry="1.2" fill="#F3EDE3" stroke="#B8B0A0" stroke-width="0.5" transform="rotate(-50 30 16.6)"/></g>' }
    ],
    suspects: [
      { label: 'Gravin Jelena', gender: 'f', color: '#B85C5C', who: 'Zus van de graaf, gastvrouw van het nieuwjaarsbal',
        look: 'an elegant Russian countess in her forties, dark hair in a high chignon with a diamond aigrette, pale blue silk ball gown, long white gloves, pearl necklace' },
      { label: 'Componist Sergej', gender: 'm', color: '#5C8B5E', who: 'Schreef een nieuwe wals voor de laatste minuut van de eeuw',
        look: 'a young Russian composer in his twenties, unruly dark hair, pince-nez, velvet jacket with a loose cravat, sheet music under his arm' },
      { label: 'Schaatsster Vera', gender: 'f', color: '#C2185B', who: 'Kampioene kunstrijden, schaatst om middernacht op de vijver',
        look: 'a figure skater in her twenties, braid pinned under a fur toque, fitted velvet skating jacket with braided frogging, white skates slung over her shoulder' },
      { label: 'Goudsmid Pavel', gender: 'm', color: '#B8955C', who: 'Maakte het juwelenei dat om middernacht open zou gaan',
        look: "a meticulous goldsmith in his fifties, grey goatee, jeweller's loupe pushed up on his forehead, dark frock coat, a small velvet box in his hands" },
      { label: 'Gouvernante Mabel', gender: 'f', color: '#8B5CB8', who: 'Engelse gouvernante, leert de kinderen van de graaf Engels en geduld',
        look: 'an English governess in her thirties, hair in a neat bun, high-necked grey dress with a cameo brooch, a small book in hand, alert eyes' },
      { label: 'Luitenant Dmitri', gender: 'm', color: '#5C7AB8', who: 'Officier van de garde, danst met iedereen behalve zijn verloofde',
        look: 'a dashing guards officer in his thirties, waxed moustache, white dress uniform with gold epaulettes and a sash, plumed helmet under his arm' },
      { label: 'Hofmeester Fjodor', gender: 'm', color: '#2C3E50', who: 'Leidt al veertig jaar het personeel van het paleis',
        look: 'a dignified major-domo in his sixties, white side whiskers, dark livery with silver buttons, white gloves, a heavy ring of keys' },
      { label: 'Fotografe Sofia', gender: 'f', color: '#D9A441', who: 'Fotografeert het bal voor een tijdschrift, met magnesiumflits',
        look: 'a modern woman photographer in her thirties, short wavy hair, tailored jacket with a high collar, a wooden plate camera with a flash pan' }
    ],
    parts: [
      ['De laatste wals', 'Om middernacht klinkt de toost op de nieuwe eeuw. De graaf is er niet bij.'],
      ['Het juwelenei', 'Om middernacht zou het ei opengaan. Het is leeg.'],
      ['De ijsbaan', 'Fakkels rond de bevroren vijver. Op het ijs staan sporen van drie paar schaatsen.'],
      ['De spiegelzaal', 'Honderd spiegels en honderd gasten. Eén spiegelbeeld klopt niet.'],
      ['De arrenslee', 'Een tocht over de bevroren Neva. Er vertrekken vier sleeën, er komen er drie terug.'],
      ['Het verzegelde bericht', 'Een brief met het zegel van het hof. Iemand heeft hem al gelezen.'],
      ['De ijsgang', 'In april breekt het ijs op de Neva. Met de schotsen komt een geheim boven.'],
      ['Het laatste bal', 'Het paleis gaat dicht voor de zomer. Nog één wals onder de kroonluchters.']
    ],
    outro: 'De kaarsen zijn uit en de nieuwe eeuw is begonnen. Het laatste geheim van de oude heb jij opgelost.'
  },
  {
    id: 'safarilodge', nr: 23, unlock: 84, icon: '🦒', title: 'Twiga Lodge', short: 'Safarilodge',
    era: 'a Kenyan-owned safari lodge in the Maasai Mara during the great migration of 1974',
    map: { accent: '#7A5A14', ring: '#F2A65A' },
    tagline: 'Kenia, 1974. Een miljoen gnoes op de vlakte, een lodge vol gasten, en een filmer die zijn laatste opname niet meer ziet.',
    intro: 'Twiga Lodge, Maasai Mara, augustus 1974. De grote trek is begonnen: een miljoen gnoes trekken langs de lodge en elke tent is bezet. Na het kampvuur ligt natuurfilmer Rupert Vane in de donkere kamer, tussen zijn filmrollen.',
    victimName: 'Natuurfilmer Rupert Vane', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'sisal',
    floorNote: 'Gevlochten sisalmatten, zoals op de veranda en in de tenten van een lodge: om en om liggend en staand gevlochten.',
    floorCss: {
      light: 'repeating-linear-gradient(0deg, rgba(122, 82, 54, 0.10) 0 1.5px, transparent 1.5px 4px), rgba(255, 240, 215, 0.32)',
      dark: 'repeating-linear-gradient(90deg, rgba(122, 82, 54, 0.10) 0 1.5px, transparent 1.5px 4px), rgba(122, 82, 54, 0.05)'
    },
    rooms: [
      { name: 'Veranda', article: 'de', color: '#F3B57A' }, { name: 'Waterpoel', article: 'de', color: '#8CC3DE' },
      { name: 'Kampvuur', article: 'het', color: '#F2C46D' }, { name: 'Bar', article: 'de', color: '#D9737F' },
      { name: 'Slaaptent', article: 'de', color: '#C9B79C' }, { name: 'Landingsbaan', article: 'de', color: '#E5B0A8' },
      { name: 'Uitkijktoren', article: 'de', color: '#C7D9A0' }, { name: 'Keuken', article: 'de', color: '#7FB3B0' },
      { name: 'Donkere kamer', article: 'de', color: '#B9AEDC' }, { name: 'Kantoor', article: 'het', color: '#DCEBF0' },
      { name: 'Garage', article: 'de', color: '#B6D5C9' }, { name: 'Eetzaal', article: 'de', color: '#EBD7A6' }
    ],
    furniture: [
      { id: 'safariwagen', nl: 'een safariwagen',
        icon: '<g><path d="M14 11.5 v-3 h17 v3" fill="none" stroke="#5A4A22" stroke-width="1.3" stroke-linejoin="round"/><path d="M3 27 v-6 q0 -1.5 1.5 -1.5 h7 l3 -8 h18 q2.5 0 2.5 2.5 v13z" fill="#F3EDE3" stroke="#3B2A1B" stroke-width="1.3" stroke-linejoin="round"/><path d="M16 11.5 l-1.5 6.5 M21 11.5 l-1 9 M27 11.5 l-1.4 8 M32 13 l-1.6 7" stroke="#2C2C2C" stroke-width="1.6" stroke-linecap="round"/><path d="M5 22.5 l3 -2.8 M7.6 26 l3.6 -4 M34 19 l-2 7.5" stroke="#2C2C2C" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 13 h4.5 v6 h-6.8z" fill="#9DB7D6" stroke="#3B2A1B" stroke-width="0.8" stroke-linejoin="round"/><rect x="22.5" y="13" width="7" height="6" fill="#9DB7D6" stroke="#3B2A1B" stroke-width="0.8"/><rect x="1.5" y="25.5" width="36" height="3" rx="1.2" fill="#7A5236" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="10" cy="29.5" r="4.3" fill="#2C2C2C" stroke="#111" stroke-width="1"/><circle cx="10" cy="29.5" r="1.6" fill="#BFC9D4"/><circle cx="29" cy="29.5" r="4.3" fill="#2C2C2C" stroke="#111" stroke-width="1"/><circle cx="29" cy="29.5" r="1.6" fill="#BFC9D4"/><circle cx="3.6" cy="22.5" r="1.2" fill="#F5D67A" stroke="#7A5A1C" stroke-width="0.5"/></g>' },
      { id: 'klamboe', nl: 'een klamboe',
        icon: '<g><path d="M20 0.5 V3.5" stroke="#7A5236" stroke-width="1"/><path d="M20 3.5 Q9 14 6 27 H34 Q31 14 20 3.5z" fill="#FAF5EF" fill-opacity="0.9" stroke="#B8B0A0" stroke-width="1"/><path d="M20 4 Q15 15 13 27 M20 4 Q25 15 27 27 M20 4 V27" fill="none" stroke="#D9D2C2" stroke-width="0.8"/><ellipse cx="20" cy="4" rx="2.8" ry="1.1" fill="none" stroke="#7A5236" stroke-width="1"/><rect x="4" y="26" width="32" height="6" rx="1.5" fill="#D9534F" stroke="#7A2A1C" stroke-width="1"/><path d="M4.5 29 h31" stroke="#F2C14E" stroke-width="1.2" stroke-dasharray="3 2"/><path d="M6 32 v4 M34 32 v4" stroke="#5A3A1E" stroke-width="2" stroke-linecap="round"/></g>' },
      { id: 'windzak', nl: 'een windzak',
        icon: '<g><path d="M9 36.5 V4" stroke="#5A6470" stroke-width="2" stroke-linecap="round"/><path d="M4.5 36.5 h9" stroke="#3B2A1B" stroke-width="2" stroke-linecap="round"/><path d="M10 6 L35 10 L35 15 L10 19z" fill="#F07A1A" stroke="#7A3E1C" stroke-width="1.1" stroke-linejoin="round"/><path d="M15 6.8 L20.5 7.7 L20.5 17.3 L15 18.2z M26 8.6 L30.5 9.3 L30.5 15.7 L26 16.4z" fill="#FAF5EF"/><path d="M10 6 L35 10 L35 15 L10 19z" fill="none" stroke="#7A3E1C" stroke-width="1.1" stroke-linejoin="round"/><path d="M10 5.5 v14" stroke="#3B2A1B" stroke-width="1.4"/></g>' },
      { id: 'acacia', nl: 'een acacia',
        icon: '<g><ellipse cx="20" cy="35.5" rx="12" ry="2" fill="#C9A86A"/><path d="M19.5 35.5 q1 -8 -4.5 -15 M20.5 35.5 q0 -9 6.5 -15 M20 27 q-1 -4 1.5 -7.5" fill="none" stroke="#5A3A1E" stroke-width="2.2" stroke-linecap="round"/><path d="M2.5 18 q2 -7.5 10.5 -7.5 q4 -4 9 -2 q5 -3 10 1 q6.5 1 6.5 8.5 q-8.5 3 -18 2 q-10 1 -18 -2z" fill="#7A9A4A" stroke="#3F5A22" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 13.5 q6 -3 12 -2 M24 11 q4 -1 7 1" stroke="#A8C46A" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>' },
      { id: 'giraf', nl: 'een houten giraf',
        icon: '<g><rect x="9" y="35" width="18" height="3" rx="1" fill="#5A3A1E"/><path d="M12 35 v-10 M15.5 35 v-10 M21.5 35 v-10 M25 35 v-10" stroke="#B2753F" stroke-width="1.9" stroke-linecap="round"/><path d="M11 26.5 q0 -5.5 5 -5.5 h7 q4 0 4 4 q0 2.5 -2.5 2.5 h-11.5 q-2 0 -2 -1z" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.1"/><path d="M22.5 22 L28 7 l3.2 1.2 l-3.4 15.3z" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.1" stroke-linejoin="round"/><path d="M27 6.5 q2 -3.4 5.2 -2.2 l5 3 q1 1.6 -1.2 2.1 l-6 0.2 q-3 0 -3 -3.1z" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.1" stroke-linejoin="round"/><path d="M29 4.5 v-3 M31.4 4.6 v-3" stroke="#5A3A1E" stroke-width="1.1" stroke-linecap="round"/><g fill="#7A4A1C"><circle cx="14.5" cy="23.5" r="1.3"/><circle cx="19" cy="24.6" r="1.2"/><circle cx="23.5" cy="23.4" r="1.2"/><circle cx="26.4" cy="15" r="1"/><circle cx="25.2" cy="19.5" r="1"/><circle cx="28" cy="11" r="0.9"/></g><circle cx="31.2" cy="6.2" r="0.6" fill="#1A1108"/><path d="M11 23.5 q-3 1 -3 5" stroke="#5A3A1E" stroke-width="0.9" fill="none"/></g>' },
      { id: 'sisalmand', nl: 'een sisalmand',
        icon: '<g><path d="M10.5 17 q9.5 -15 19 0" fill="none" stroke="#7A4A1C" stroke-width="2.4"/><path d="M7 17 h26 q0 17 -13 17 q-13 0 -13 -17z" fill="#E3C58E" stroke="#7A5236" stroke-width="1.2" stroke-linejoin="round"/><path d="M7.3 21 h25.4" stroke="#B3261E" stroke-width="2.2"/><path d="M8.4 25.5 h23.2" stroke="#2E6DA4" stroke-width="2"/><path d="M10.6 30 h18.8" stroke="#3F7D4E" stroke-width="1.8"/><path d="M11 18 l1.5 2 M15 18 l1.5 2 M19 18 l1.5 2 M23 18 l1.5 2 M27 18 l1.5 2" stroke="#B8955C" stroke-width="0.7"/><path d="M6.5 17 h27" stroke="#7A4A1C" stroke-width="1.8" stroke-linecap="round"/></g>' }
    ],
    suspects: [
      { label: 'Eigenares Wambui', gender: 'f', color: '#B85C5C', who: 'Bouwde de lodge op met haar man en kent elke gast bij naam',
        look: 'a Kenyan lodge owner in her fifties, colourful kitenge headwrap, tailored khaki safari dress, reading glasses on a beaded chain, a warm but shrewd gaze' },
      { label: 'Gids Otieno', gender: 'm', color: '#5C8B5E', who: 'Hoofdgids, ziet een luipaard op een kilometer afstand',
        look: 'a Kenyan safari guide in his thirties, khaki shirt with a lodge badge, wide-brimmed bush hat, binoculars around his neck, easy smile' },
      { label: 'Dierenarts Njeri', gender: 'f', color: '#C2185B', who: 'Werkt voor het wildreservaat en telt de neushoorns',
        look: 'a Kenyan wildlife vet in her thirties, short natural hair, khaki field shirt with rolled sleeves, stethoscope, a leather vet bag' },
      { label: 'Piloot Kiprono', gender: 'm', color: '#B8955C', who: 'Vliegt de gasten in met zijn kleine propellervliegtuig',
        look: 'a Kenyan bush pilot in his thirties, aviator sunglasses pushed up on his forehead, short-sleeved pilot shirt with epaulettes, headset around his neck' },
      { label: 'Chef Hamisi', gender: 'm', color: '#8B5CB8', who: 'Komt uit Mombasa en kookt de beste pilau van de vlakte',
        look: "a Kenyan chef from the Swahili coast in his forties, embroidered kofia cap, white chef's jacket, neatly trimmed beard, a wooden spoon in hand" },
      { label: 'Journaliste Amina', gender: 'f', color: '#5C7AB8', who: 'Schrijft voor een krant in Nairobi een reportage over de grote trek',
        look: 'a Kenyan newspaper journalist in her twenties, big rounded afro, round sunglasses, patterned 1970s blouse, notebook and a portable cassette recorder' },
      { label: 'Geluidsman Felix', gender: 'm', color: '#2C3E50', who: 'Neemt voor de film de geluiden van de savanne op',
        look: 'a German sound recordist in his thirties, long hair and sideburns, headphones, khaki vest with many pockets, a reel-to-reel tape recorder on a strap' },
      { label: 'Biologe Hanne', gender: 'f', color: '#D9A441', who: 'Deense onderzoekster, volgt al twee jaar dezelfde leeuwen',
        look: 'a Danish lion researcher in her thirties, sun-bleached ponytail, freckles, faded field shirt, a notebook and a radio-tracking antenna' }
    ],
    parts: [
      ['De grote trek', 'Een miljoen gnoes op de vlakte. Na het kampvuur ligt de filmer in de donkere kamer.'],
      ['Het negatief', 'Eén filmrol is ontwikkeld. Op de laatste foto staat iemand die er niet hoort.'],
      ['De waterpoel', 'Bij nacht komt alles drinken. In de modder staan ook schoenafdrukken.'],
      ['De lange regens', 'De landingsbaan staat blank. Niemand kan weg, niemand kan erin.'],
      ['De ballonvaart', 'Bij zonsopgang gaat de ballon op. Hij landt met één passagier te veel.'],
      ['De vliegende dokter', 'Een vliegtuigje landt met een dokter aan boord. Niemand had erom gevraagd.'],
      ['Jamhuri-dag', 'Feest voor de onafhankelijkheid: muziek, geroosterd vlees en de hele lodge vrij. Bijna de hele lodge.'],
      ['Afscheid van de vlakte', 'De trek gaat terug naar het zuiden. Nog één avond bij het kampvuur.']
    ],
    outro: 'De gnoes trekken verder en de lodge wordt stil. De laatste opname is van jou.'
  },
  {
    id: 'hanok', nr: 24, unlock: 88, icon: '🌕', title: 'Hanok Dalbit', short: 'Hanok',
    era: "a scholar's hanok in the mountains of Joseon Korea at the Chuseok harvest moon festival of 1795",
    map: { accent: '#45745F', ring: '#F5E6B8' },
    tagline: 'Joseon, 1795. Een volle oogstmaan, een familie die thuiskomt, en een heer des huizes die zijn laatste gedicht niet afmaakt.',
    intro: 'Hanok Dalbit, in de bergen van Joseon, herfst 1795. Het is Chuseok: de oogstmaan is vol en de hele familie is thuis. Na het maanfeest ligt heer Yun Jae-ho in het paviljoen bij de vijver, naast een gedicht van drie regels.',
    victimName: 'Heer Yun Jae-ho', roomWord: 'kamer', roomWordPlural: 'kamers', floor: 'hanji',
    floorNote: 'Geolied papier op een vloerverwarming (ondol), zoals in een hanok: glanzende vellen die met een smalle naad over elkaar liggen.',
    floorCss: {
      light: 'linear-gradient(rgba(150, 105, 40, 0.22) 1px, transparent 1px) 0 0 / 50% 50%, linear-gradient(rgba(150, 105, 40, 0.12) 1px, transparent 1px) 0 2.5px / 50% 50%, linear-gradient(90deg, rgba(150, 105, 40, 0.22) 1px, transparent 1px) 0 0 / 50% 50%, linear-gradient(90deg, rgba(150, 105, 40, 0.12) 1px, transparent 1px) 2.5px 0 / 50% 50%, linear-gradient(135deg, rgba(255, 244, 214, 0.42), rgba(255, 255, 255, 0.12))',
      dark: 'linear-gradient(rgba(150, 105, 40, 0.22) 1px, transparent 1px) 0 0 / 50% 50%, linear-gradient(rgba(150, 105, 40, 0.12) 1px, transparent 1px) 0 2.5px / 50% 50%, linear-gradient(90deg, rgba(150, 105, 40, 0.22) 1px, transparent 1px) 0 0 / 50% 50%, linear-gradient(90deg, rgba(150, 105, 40, 0.12) 1px, transparent 1px) 2.5px 0 / 50% 50%, rgba(150, 105, 40, 0.07)'
    },
    rooms: [
      { name: 'Binnenplaats', article: 'de', color: '#EBD7A6' }, { name: 'Theekamer', article: 'de', color: '#C7D9A0' },
      { name: 'Keuken', article: 'de', color: '#F3B57A' }, { name: 'Studeerkamer', article: 'de', color: '#B9AEDC' },
      { name: 'Paviljoen', article: 'het', color: '#8CC3DE' }, { name: 'Bibliotheek', article: 'de', color: '#DCEBF0' },
      { name: 'Gastenkamer', article: 'de', color: '#F0A6A0' }, { name: 'Kruidentuin', article: 'de', color: '#B6D5C9' },
      { name: 'Poort', article: 'de', color: '#D9737F' }, { name: 'Voorouderhal', article: 'de', color: '#D0C9BD' },
      { name: 'Kruikenterras', article: 'het', color: '#7FB3B0' }, { name: 'Voorraadkamer', article: 'de', color: '#E3B7D6' }
    ],
    furniture: [
      { id: 'gayageum', nl: 'een gayageum',
        icon: '<g><path d="M6.5 31 q-3 2.5 -2 7 M9 33 q-1.8 2.6 -0.6 6 M11.5 34.4 q-0.8 2.4 0.6 5" fill="none" stroke="#E8DCC8" stroke-width="1.1" stroke-linecap="round"/><g transform="rotate(-38 20 20)"><rect x="0.5" y="15" width="39" height="10" rx="3" fill="#C8874A" stroke="#5A3A1E" stroke-width="1.2"/><rect x="2" y="16.5" width="36" height="7" rx="2" fill="#D99A5E"/><path d="M4 17.6 H36 M4 19.2 H36 M4 20.8 H36 M4 22.4 H36" stroke="#FAF5EF" stroke-width="0.55"/><g fill="#F3EDE3" stroke="#5A3A1E" stroke-width="0.5"><path d="M13 18.4 l1 -2 l1 2z"/><path d="M17 20 l1 -2 l1 2z"/><path d="M21 21.6 l1 -2 l1 2z"/><path d="M25 23.2 l1 -2 l1 2z"/></g><rect x="2" y="15" width="2.6" height="10" fill="#3B2A1B"/><rect x="34.6" y="15" width="2.6" height="10" fill="#3B2A1B"/></g></g>' },
      { id: 'kimchipot', nl: 'een kimchipot',
        icon: '<g><path d="M13 11 h14 q8 4 8 13 q0 11 -15 11 q-15 0 -15 -11 q0 -9 8 -13z" fill="#7A4A26" stroke="#3B2A1B" stroke-width="1.3"/><path d="M12 20.5 q2 -3.4 4 0 q2 3.4 4 0 q2 -3.4 4 0 q2 3.4 4 0" fill="none" stroke="#C9A06A" stroke-width="1.1"/><path d="M9.2 18 q-1.6 6 0.6 11" fill="none" stroke="#A8703E" stroke-width="1.8" stroke-linecap="round"/><rect x="11.5" y="9.5" width="17" height="2.6" rx="1.2" fill="#5A3A1E" stroke="#3B2A1B" stroke-width="0.8"/><path d="M11 10 q9 -7 18 0z" fill="#8B5A30" stroke="#3B2A1B" stroke-width="1.2" stroke-linejoin="round"/><circle cx="20" cy="5.6" r="1.5" fill="#3B2A1B"/></g>' },
      { id: 'janggu', nl: 'een trom',
        icon: '<g><path d="M29 5.5 L37.5 1.5" stroke="#B8955C" stroke-width="1.6" stroke-linecap="round"/><path d="M8 9 q8 3.5 10.5 8.5 v5 q-2.5 5 -10.5 8.5z M32 9 q-8 3.5 -10.5 8.5 v5 q2.5 5 10.5 8.5z" fill="#B3261E" stroke="#5A1A12" stroke-width="1.1" stroke-linejoin="round"/><rect x="18" y="17" width="4" height="6" fill="#7A2A1C" stroke="#5A1A12" stroke-width="0.8"/><path d="M8.5 9.5 L31.5 30.5 M8.5 30.5 L31.5 9.5 M8.5 15 L31.5 25 M8.5 25 L31.5 15" stroke="#E0B95A" stroke-width="0.9"/><ellipse cx="8" cy="20" rx="4.2" ry="11.5" fill="#F3EDE3" stroke="#5A3A1E" stroke-width="1.2"/><ellipse cx="8" cy="20" rx="2.6" ry="8.8" fill="none" stroke="#2E6DA4" stroke-width="1.1"/><ellipse cx="32" cy="20" rx="4.2" ry="11.5" fill="#F3EDE3" stroke="#5A3A1E" stroke-width="1.2"/><ellipse cx="32" cy="20" rx="2.6" ry="8.8" fill="none" stroke="#2E6DA4" stroke-width="1.1"/></g>' },
      { id: 'maanvaas', nl: 'een maanvaas',
        icon: '<g><ellipse cx="20" cy="36.5" rx="10" ry="1.6" fill="#C9B79C"/><path d="M14.5 7.5 h11 v1.5 q10.5 3 10.5 13.5 q0 14 -16 14 q-16 0 -16 -14 q0 -10.5 10.5 -13.5z" fill="#F7F2E6" stroke="#8A7A60" stroke-width="1.3"/><rect x="14" y="5" width="12" height="3.4" rx="1.2" fill="#EFE8D6" stroke="#8A7A60" stroke-width="1"/><path d="M4.6 22 q15.4 2.4 30.8 0" fill="none" stroke="#E3DCC8" stroke-width="1"/><path d="M9.5 16 q-2.6 6.5 0 12" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M30.5 15.5 q2.6 6.5 0.4 13" stroke="#E8E0CC" stroke-width="2" fill="none" stroke-linecap="round"/></g>' },
      { id: 'inktsteen', nl: 'een inktsteen',
        icon: '<g><rect x="3" y="17" width="23" height="17" rx="2.6" fill="#3B3B3B" stroke="#111" stroke-width="1.2"/><rect x="6" y="20" width="17" height="11" rx="2" fill="#262626"/><path d="M7 21.5 q7.5 -1.4 15 0 v2.6 h-15z" fill="#2E3A55"/><g transform="rotate(-14 15 26.5)"><rect x="8.5" y="24.5" width="13" height="4" rx="0.8" fill="#141414" stroke="#5A5A5A" stroke-width="0.6"/><rect x="12.5" y="25.3" width="4.5" height="2.4" fill="#C9A227"/></g><path d="M29 33.5 L36.5 5" stroke="#B8955C" stroke-width="2.4" stroke-linecap="round"/><path d="M30 13 l3 0.8 M31.7 19 l2 0.5" stroke="#7A5A1C" stroke-width="0.8"/><path d="M27.6 32.6 l2.6 0.7 l-2.4 5.6 q-1.4 -0.6 -1.2 -2z" fill="#1A1A1A"/></g>' },
      { id: 'theetafel', nl: 'een theetafeltje',
        icon: '<g><path d="M8.5 24 q-1 6 0 11.5 M31.5 24 q1 6 0 11.5 M20 26.5 v10" stroke="#5A3A1E" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M4.5 20.5 v2.6 q15.5 6.4 31 0 v-2.6" fill="#7A4220" stroke="#3B2A1B" stroke-width="1.1"/><ellipse cx="20" cy="20.5" rx="15.5" ry="4.2" fill="#9C5A2E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M14 19.4 q0 -6 5 -6 q5 0 5 6z" fill="#B6D5C9" stroke="#3F6B5A" stroke-width="0.9"/><path d="M24 15.5 q3 -0.5 3.6 -3" fill="none" stroke="#3F6B5A" stroke-width="1"/><circle cx="19" cy="12.6" r="1" fill="#3F6B5A"/><path d="M7.8 18.2 q0 2.4 2.6 2.4 q2.6 0 2.6 -2.4z M27 18.6 q0 2.4 2.6 2.4 q2.6 0 2.6 -2.4z" fill="#B6D5C9" stroke="#3F6B5A" stroke-width="0.8"/></g>' }
    ],
    suspects: [
      { label: 'Vrouwe Kang', gender: 'f', color: '#B85C5C', who: 'Vrouw des huizes, houdt de sleutels van de voorraadkamer',
        look: 'a dignified Joseon noblewoman in her fifties, hair in a low chignon with a long silver binyeo hairpin, jade-green jeogori jacket and deep blue chima skirt, a ring of household keys' },
      { label: 'Student Sang-u', gender: 'm', color: '#5C8B5E', who: 'Zoon des huizes, studeert voor het staatsexamen',
        look: 'a young Joseon scholar of about twenty, black horsehair gat hat, white dopo robe, a bound book of classics, earnest face' },
      { label: 'Geneesvrouw So-yeon', gender: 'f', color: '#C2185B', who: 'Komt uit het dal met kruiden en acupunctuurnaalden',
        look: 'a Joseon woman physician in her thirties, hair in a neat chignon under a black garima headpiece, plain indigo hanbok, a cloth roll of needles and a herb pouch' },
      { label: 'Schilder Dae-ho', gender: 'm', color: '#B8955C', who: 'Schildert het maanfeest voor de familie',
        look: 'a genre painter in his forties, wispy beard, soft black cap, grey robe spattered with ink, brushes in a bamboo holder' },
      { label: 'Borduurster Yeon-i', gender: 'f', color: '#8B5CB8', who: 'Nicht van de familie, borduurt een kamerscherm voor haar eigen bruiloft',
        look: 'a young woman of about nineteen, long single braid with a red daenggi ribbon, rose-pink jeogori and white chima, an embroidery hoop with a crane design' },
      { label: 'Tolk Hak-su', gender: 'm', color: '#5C7AB8', who: 'Net terug van het gezantschap naar Peking',
        look: 'a court interpreter in his forties, black gat hat, blue official robe, round spectacles from Beijing, a small wooden box of books' },
      { label: 'Kokkin Sun-i', gender: 'f', color: '#2C3E50', who: 'Leidt de keuken en weet wat er in elke pot zit',
        look: 'a sturdy head cook in her fifties, hair wrapped in a white cloth, sleeves tied back, apron over a plain hanbok, a large wooden ladle' },
      { label: 'Marskramer Deok-su', gender: 'm', color: '#D9A441', who: 'Trekt langs de dorpen met waren en nieuws',
        look: 'a cheerful travelling peddler in his thirties, round bamboo hat with white cotton tufts, short jacket and wide trousers, a wooden A-frame pack on his back' }
    ],
    parts: [
      ['De oogstmaan', 'Chuseok, de maan is vol. In het paviljoen ligt de heer des huizes, en zijn gedicht is niet af.'],
      ['Het onvoltooide gedicht', 'Op de rol staan drie regels. De vierde schreef iemand anders.'],
      ['De kimchimaand', 'Het hele dorp maakt kimchi voor de winter. In één pot zit iets anders.'],
      ['Het staatsexamen', 'De zoon reist naar Hanyang voor het examen. Iemand kende de vragen al.'],
      ['De eerste sneeuw', 'Sneeuw sluit het bergpad af. In de theekamer brandt de hele nacht licht.'],
      ['De tolk uit Peking', 'De tolk komt terug met een bril, een klok en een geheim.'],
      ['Seollal', 'Nieuwjaar: buigen voor de ouderen en yut spelen op de binnenplaats. Iemand speelt vals.'],
      ['Bloesem in de bergen', "De azalea's kleuren de helling roze. Nog één avond thee in het paviljoen."]
    ],
    outro: 'De maan staat weer vol boven de bergen. Het gedicht is af, en de laatste regel schreef jij.'
  }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { ONTWERP_16B: window.ONTWERP_16B };

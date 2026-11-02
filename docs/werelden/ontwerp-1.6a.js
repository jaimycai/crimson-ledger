// Design sheets for four of the eight worlds of 1.6 (PLAN-1.6.md, "Keuze Jaimy", 2 November 2026): Oceaanstomer, Ryokan,
// Koffiefazenda and Zeppelin. Same shape as window.ONTWERP in ontwerp.js (see its header); shown by ontwerpblad-1.6a.html,
// proven by bewijs-1.6a.js. After Jaimy's yes this becomes the themes.js entries, the portrait prompts and the campaign parts.
// The other four worlds of 1.6 have their own file; furniture ids are kept unique across both.
// Years are chosen outside painful periods: the liner sails in May 1910 (Halley's comet, not the Titanic year 1912), the
// ryokan is in 1925 (between the 1923 earthquake and the 1927 crisis), the fazenda in 1926 (before the 1929 coffee crash
// and the 1930 revolution), the airship in 1929 (before the 1930s and the Hindenburg).
// Room names that already exist in a released world are reused on purpose (translated in all 19 languages); new ones:
// Promenadedek, Radiokamer, Onsen, Tuin, Bamboebos, Droogvloer, Koffieveld, Pakhuis, Branderij, Stuurgondel, Motorgondel,
// Loopbrug, Postkamer, Uitkijkpost.
// titles: the first words of the suspect and victim names that are a role, for TITLES in themes.js (short name on the board).
// floor: four new floor styles (teakdek, tatami, cementtegels, aluminium); the sheet shows them, style.css gets them later.
window.ONTWERP_16A = [
  {
    id: 'oceaanstomer', nr: 17, unlock: 60, icon: '🚢', title: 'SS Halcyon', short: 'Oceaanstomer',
    era: "a luxury ocean liner crossing the Atlantic from Southampton to New York in May 1910, the month of Halley's comet",
    map: { accent: '#004048', ring: '#C9A227' },
    tagline: 'Mei 1910. Vijf dagen tot New York, de komeet van Halley boven het dek, en een reder die de overkant niet haalt.',
    intro: 'SS Halcyon, mei 1910, midden op de Atlantische Oceaan. Op het promenadedek kijkt iedereen naar de komeet van Halley. Alleen reder Ambrose Kingsley niet: hij ligt in de rookkamer, naast een sigaar die nog smeult.',
    victimName: 'Reder Ambrose Kingsley', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'teakdek',
    floorNote: 'teakdek: smalle teakhouten planken met zwarte naden, zoals op het promenadedek',
    rooms: [
      { name: 'Promenadedek', article: 'het', color: '#8CC3DE' }, { name: 'Balzaal', article: 'de', color: '#E7A9CF' },
      { name: 'Rookkamer', article: 'de', color: '#C9A27E' }, { name: 'Eetzaal', article: 'de', color: '#F2C46D' },
      { name: 'Suite', article: 'de', color: '#B3A1D6' }, { name: 'Machinekamer', article: 'de', color: '#9AA5B1' },
      { name: 'Brug', article: 'de', color: '#7FB3B0' }, { name: 'Radiokamer', article: 'de', color: '#D6E39A' },
      { name: 'Kombuis', article: 'de', color: '#F0957A' }, { name: 'Ruim', article: 'het', color: '#DDD3C0' },
      { name: 'Bibliotheek', article: 'de', color: '#C9677A' }, { name: 'Serre', article: 'de', color: '#9FCBA8' }
    ],
    furniture: [
      { id: 'stuurrad', nl: 'een stuurrad',
        icon: '<g><g stroke-linecap="round"><path d="M20 2 V6.4 M20 33.6 V38 M2 20 H6.4 M33.6 20 H38 M7.3 7.3 L10.1 10.1 M32.7 32.7 L29.9 29.9 M32.7 7.3 L29.9 10.1 M7.3 32.7 L10.1 29.9" stroke="#3B2A1B" stroke-width="3.8"/><path d="M20 2 V6.4 M20 33.6 V38 M2 20 H6.4 M33.6 20 H38 M7.3 7.3 L10.1 10.1 M32.7 32.7 L29.9 29.9 M32.7 7.3 L29.9 10.1 M7.3 32.7 L10.1 29.9" stroke="#A86B3C" stroke-width="2.2"/></g><path d="M20 6 V34 M6 20 H34 M10.1 10.1 L29.9 29.9 M29.9 10.1 L10.1 29.9" stroke="#7A4A22" stroke-width="1.8"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#3B2A1B" stroke-width="4.6"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#A86B3C" stroke-width="2.8"/><circle cx="20" cy="20" r="3.8" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2"/><circle cx="20" cy="20" r="1.2" fill="#7A5A1C"/></g>' },
      { id: 'scheepstelegraaf', nl: 'een scheepstelegraaf',
        icon: '<g><path d="M16.5 25 h7 l2 9 h-11z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2" stroke-linejoin="round"/><rect x="11" y="33.5" width="18" height="3" rx="1" fill="#7A5A1C"/><circle cx="20" cy="15" r="11" fill="#E0B95A" stroke="#7A5A1C" stroke-width="1.3"/><circle cx="20" cy="15" r="8" fill="#FAF5EF" stroke="#7A5A1C" stroke-width="0.9"/><path d="M13.07 19 A8 8 0 0 0 26.93 19 L20 15z" fill="#B3261E" opacity="0.85"/><path d="M20 15 V7.4 M20 15 L14.3 9.3 M20 15 L25.7 9.3 M20 15 H12.2 M20 15 H27.8" stroke="#8A7A60" stroke-width="0.7"/><path d="M20 15 L27 7.5" stroke="#3B2A1B" stroke-width="2" stroke-linecap="round"/><circle cx="27.6" cy="6.8" r="2.1" fill="#B3261E" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="20" cy="15" r="1.7" fill="#3B2A1B"/></g>' },
      { id: 'dekstoel', nl: 'een dekstoel',
        icon: '<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 24.5 V35 M32 24.5 V35 M22 24.5 V35" stroke="#7A5236" stroke-width="2.2"/><path d="M5.5 6.5 L11.5 24.5 H35" stroke="#7A5236" stroke-width="2.4"/><path d="M8.6 17 H17.5 V24" stroke="#7A5236" stroke-width="1.7"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#5A1A12" stroke-width="5.6"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#FAF5EF" stroke-width="4.2"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#C0392B" stroke-width="2.6"/><path d="M7.6 8.5 L12.6 21.6 H33.6" stroke="#FAF5EF" stroke-width="0.9"/></g>' },
      { id: 'scheepsbel', nl: 'een scheepsbel',
        icon: '<g><path d="M9 6.5 h22" stroke="#5A3A1E" stroke-width="2.6" stroke-linecap="round"/><path d="M20 7 v4.5" stroke="#7A5A1C" stroke-width="2.4"/><path d="M12.5 28 q0 -17 7.5 -17 q7.5 0 7.5 17 l3 2.5 h-21z" fill="#E0B95A" stroke="#7A5A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M11 27 h18" stroke="#7A5A1C" stroke-width="1"/><path d="M15.6 25 q-0.6 -7 2.4 -10.5" fill="none" stroke="#FFF3C4" stroke-width="1.5" stroke-linecap="round"/><circle cx="20" cy="32.6" r="2.1" fill="#7A5A1C"/><path d="M20 34.6 q-2.6 2 -0.6 4.6" stroke="#C7A06A" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>' },
      { id: 'hoedendoos', nl: 'een hoedendoos',
        icon: '<g><path d="M8 22 v10 a12 3.6 0 0 0 24 0 v-10" fill="#E7A9CF" stroke="#7A3A5C" stroke-width="1.2"/><path d="M12 24.7 v10.4 M16.5 25.4 v10.6 M23.5 25.4 v10.6 M28 24.7 v10.4" stroke="#FAF5EF" stroke-width="1.3"/><ellipse cx="20" cy="22" rx="12.6" ry="3.6" fill="#F3C6DF" stroke="#7A3A5C" stroke-width="1.2"/><ellipse cx="20" cy="17.6" rx="13.8" ry="3" fill="#3B4E6B" stroke="#1A1108" stroke-width="1.1"/><path d="M14 17.6 q0 -8 6 -8 q6 0 6 8z" fill="#4A6080" stroke="#1A1108" stroke-width="1.1"/><path d="M14.3 15 q5.7 1.8 11.4 0" fill="none" stroke="#B3261E" stroke-width="1.9"/><path d="M24 12.6 q7 -10 12.5 -7 q-5.5 0.4 -12.5 7z" fill="#FAF5EF" stroke="#8A7A60" stroke-width="0.8"/></g>' }
    ],
    suspects: [
      { label: 'Kapitein Harrow', gender: 'm', color: '#B85C5C', who: 'Voert het bevel, dit is zijn laatste oversteek',
        look: 'a dignified ocean liner captain in his sixties, neat white beard, navy double-breasted uniform with gold braid on the sleeves, white-topped peaked cap' },
      { label: 'Stewardess Molly', gender: 'f', color: '#5C8B5E', who: 'Zorgt voor de hutten van de eerste klasse en kent elke sleutel',
        look: 'a brisk ship stewardess in her twenties, hair in a neat bun under a small white cap, starched white apron over a dark uniform dress, a ring of cabin keys' },
      { label: 'Vliegenierster Solange', gender: 'f', color: '#C2185B', who: 'Vliegt in de herfst op de grote vliegshow van New York',
        look: 'a daring French aviatrix in her thirties, short dark curls, leather flying cap with goggles pushed up, fitted leather coat, long silk scarf' },
      { label: 'Professor Lund', gender: 'm', color: '#B8955C', who: 'Zweedse sterrenkundige, fotografeert de komeet',
        look: 'a Swedish astronomer in his fifties, unruly grey hair, round spectacles, rumpled tweed suit, a brass telescope under his arm' },
      { label: 'Suffragette Harriet', gender: 'f', color: '#8B5CB8', who: 'Geeft in Amerika lezingen over stemrecht voor vrouwen',
        look: 'an English suffragette and writer in her forties, large hat, purple white and green sash across her chest, high-collared blouse, a bundle of pamphlets' },
      { label: 'Marconist Arthur', gender: 'm', color: '#5C7AB8', who: 'Bedient de draadloze telegraaf, dag en nacht',
        look: 'a young wireless operator in his twenties, neatly parted hair, headphones over his ears, waistcoat, pencil behind his ear, a message form in his hand' },
      { label: 'Hoofdmachinist Doyle', gender: 'm', color: '#2C3E50', who: 'Houdt de machines draaiend, diep in het schip',
        look: 'a broad-shouldered chief engineer in his fifties, thick sideburns, soot on one cheek, officer jacket over a boiler suit, an oil can in his hand' },
      { label: 'Hoedenmaakster Edna', gender: 'f', color: '#D9A441', who: 'Opent in New York een hoedenwinkel aan Fifth Avenue',
        look: 'a stylish milliner in her thirties, enormous Edwardian hat with ostrich feathers, lace blouse, hat pins in her lapel, a striped hatbox' }
    ],
    titles: ['reder', 'kapitein', 'stewardess', 'vliegenierster', 'professor', 'suffragette', 'marconist', 'hoofdmachinist', 'hoedenmaakster'],
    parts: [
      ['De komeet van Halley', 'Iedereen staat op het promenadedek naar de komeet te kijken, behalve de reder.'],
      ['Het laatste telegram', 'Om middernacht komt er een telegram uit New York, en de marconist zegt niet voor wie.'],
      ['De tafel van de kapitein', 'Twaalf gasten aan de tafel van de kapitein, en na de soep is één stoel leeg.'],
      ['De mist', 'Twee dagen dichte mist: de stoomfluit klinkt elke minuut en niemand ziet verder dan de reling.'],
      ['Het parelsnoer', 'Een parelsnoer ligt niet meer in de kluis van de purser, en het schip kan nergens aanleggen.'],
      ['Het bal', 'In de balzaal wordt gewalst tot diep in de nacht, en één danser wisselt steeds van partner.'],
      ['Het tussendek', 'Op het tussendek reizen vijfhonderd landverhuizers naar een nieuw leven, en één van hen zag iets.'],
      ['De lichten van New York', 'De skyline komt in zicht: nog één nacht aan boord om de zaak te sluiten.']
    ],
    outro: 'De Halcyon meert af in New York. Op de kade staat de politie te wachten, en jij weet voor wie.'
  },
  {
    id: 'ryokan', nr: 18, unlock: 64, icon: '🏮', title: 'Ryokan Tsukikage', short: 'Ryokan',
    era: 'a traditional Japanese ryokan inn with its own hot spring in the wooded hills outside Kyoto, during the cherry blossom season of 1925',
    map: { accent: '#5B2A4E', ring: '#E28AA5' },
    tagline: 'Kyoto, 1925. Kersenbloesem in de tuin, warm water in de onsen, en een herbergier die zijn ochtendthee niet meer drinkt.',
    intro: 'Ryokan Tsukikage, in de heuvels bij Kyoto, april 1925. De kersen bloeien en alle kamers zijn vol. Bij de ochtendthee ontbreekt herbergier Genzo Kurata. Hij ligt in het theehuis, naast een kom die nog warm is.',
    victimName: 'Herbergier Genzo Kurata', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'tatami',
    floorNote: 'tatami: rietmatten met donkere stoffen randen, om en om dwars gelegd',
    rooms: [
      { name: 'Gastenkamer', article: 'de', color: '#F2C46D' }, { name: 'Onsen', article: 'de', color: '#8CC3DE' },
      { name: 'Theehuis', article: 'het', color: '#C9A27E' }, { name: 'Tuin', article: 'de', color: '#F0B8C8' },
      { name: 'Keuken', article: 'de', color: '#7FB3B0' }, { name: 'Veranda', article: 'de', color: '#F0957A' },
      { name: 'Hal', article: 'de', color: '#DDD3C0' }, { name: 'Eetzaal', article: 'de', color: '#D9737F' },
      { name: 'Bamboebos', article: 'het', color: '#9FCBA8' }, { name: 'Voorraadkamer', article: 'de', color: '#D6E39A' },
      { name: 'Steiger', article: 'de', color: '#9AA5B1' }, { name: 'Wasruimte', article: 'de', color: '#B3A1D6' }
    ],
    furniture: [
      { id: 'steenlantaarn', nl: 'een stenen lantaarn',
        icon: '<g stroke-linejoin="round"><rect x="12" y="33" width="16" height="3.2" rx="0.8" fill="#A9AA9F" stroke="#4E5550" stroke-width="1.1"/><rect x="17" y="25" width="6" height="8" fill="#BFC0B5" stroke="#4E5550" stroke-width="1.1"/><path d="M11.5 21.5 h17 l-2 3.5 h-13z" fill="#A9AA9F" stroke="#4E5550" stroke-width="1.1"/><rect x="14" y="13.5" width="12" height="8" fill="#BFC0B5" stroke="#4E5550" stroke-width="1.1"/><rect x="16.5" y="15.2" width="7" height="4.6" fill="#F5D67A" stroke="#7A5A1C" stroke-width="0.9"/><path d="M5.5 14.8 Q13 13.4 15 9 H25 Q27 13.4 34.5 14.8z" fill="#A9AA9F" stroke="#4E5550" stroke-width="1.1"/><path d="M18 9 q2 -5 4 0z" fill="#BFC0B5" stroke="#4E5550" stroke-width="1"/><circle cx="20" cy="4.6" r="1.6" fill="#BFC0B5" stroke="#4E5550" stroke-width="1"/><path d="M12.5 33 q2.2 -2.2 4.5 0 M24 33 q2 -1.6 4 0" stroke="#5C8B5E" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>' },
      { id: 'tetsubin', nl: 'een ijzeren theepot',
        icon: '<g><path d="M12 15 Q20 3 28 15" fill="none" stroke="#2C2C2C" stroke-width="2.2" stroke-linecap="round"/><path d="M29 25 q5 -1 7 -8" fill="none" stroke="#1A1108" stroke-width="4.2" stroke-linecap="round"/><path d="M29 25 q5 -1 7 -8" fill="none" stroke="#5A5A5A" stroke-width="2.2" stroke-linecap="round"/><path d="M7 25 q0 -10 13 -10 q13 0 13 10 q0 9 -13 9 q-13 0 -13 -9z" fill="#4A4A4A" stroke="#1A1108" stroke-width="1.3"/><g fill="#727272"><circle cx="12.0" cy="19.5" r="0.85"/><circle cx="15.2" cy="19.5" r="0.85"/><circle cx="18.4" cy="19.5" r="0.85"/><circle cx="21.6" cy="19.5" r="0.85"/><circle cx="24.8" cy="19.5" r="0.85"/><circle cx="28.0" cy="19.5" r="0.85"/><circle cx="9.5" cy="23" r="0.85"/><circle cx="13.0" cy="23" r="0.85"/><circle cx="16.5" cy="23" r="0.85"/><circle cx="20.0" cy="23" r="0.85"/><circle cx="23.5" cy="23" r="0.85"/><circle cx="27.0" cy="23" r="0.85"/><circle cx="30.5" cy="23" r="0.85"/><circle cx="9.5" cy="26.5" r="0.85"/><circle cx="13.0" cy="26.5" r="0.85"/><circle cx="16.5" cy="26.5" r="0.85"/><circle cx="20.0" cy="26.5" r="0.85"/><circle cx="23.5" cy="26.5" r="0.85"/><circle cx="27.0" cy="26.5" r="0.85"/><circle cx="30.5" cy="26.5" r="0.85"/><circle cx="11.5" cy="30" r="0.85"/><circle cx="14.9" cy="30" r="0.85"/><circle cx="18.3" cy="30" r="0.85"/><circle cx="21.7" cy="30" r="0.85"/><circle cx="25.1" cy="30" r="0.85"/><circle cx="28.5" cy="30" r="0.85"/></g><ellipse cx="20" cy="15.6" rx="5.5" ry="1.7" fill="#3A3A3A" stroke="#1A1108" stroke-width="1"/><circle cx="20" cy="13.4" r="1.5" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.6"/></g>' },
      { id: 'byobu', nl: 'een gouden kamerscherm',
        icon: '<g stroke-linejoin="round"><path d="M3.5 11 L12 8 V31 L3.5 34z" fill="#E8C66A" stroke="#3B2A1B" stroke-width="1.2"/><path d="M12 8 L20.5 11 V34 L12 31z" fill="#D4AE4E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20.5 11 L29 8 V31 L20.5 34z" fill="#E8C66A" stroke="#3B2A1B" stroke-width="1.2"/><path d="M29 8 L37.5 11 V34 L29 31z" fill="#D4AE4E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M4.5 27.5 Q11 21.5 16.5 23.5 Q24 26 34.5 15" fill="none" stroke="#5A3A1E" stroke-width="1.4" stroke-linecap="round"/><path d="M24 23.5 q2 -4 5 -5" fill="none" stroke="#5A3A1E" stroke-width="1" stroke-linecap="round"/><g fill="#F3B6C6" stroke="#B3476A" stroke-width="0.6"><circle cx="9" cy="23.6" r="1.7"/><circle cx="14.5" cy="22.2" r="1.7"/><circle cx="21" cy="24.6" r="1.7"/><circle cx="28.6" cy="18.6" r="1.7"/><circle cx="31.5" cy="17.6" r="1.5"/><circle cx="34.6" cy="13.6" r="1.6"/><circle cx="26.5" cy="21.8" r="1.4"/></g></g>' },
      { id: 'bonsai', nl: 'een bonsai',
        icon: '<g><path d="M9 30 h22 l-2.5 5 h-17z" fill="#3B5E8C" stroke="#1F3550" stroke-width="1.2" stroke-linejoin="round"/><rect x="7.5" y="28.5" width="25" height="2.6" rx="1" fill="#4A72A3" stroke="#1F3550" stroke-width="1"/><path d="M20 28.5 q-4.5 -4 0 -8 q4 -4 -1 -9.5" fill="none" stroke="#6B4423" stroke-width="3" stroke-linecap="round"/><path d="M19.6 20.4 q4 -1 7 -4.2 M19.3 15 q-4 0 -7.2 2.2" fill="none" stroke="#6B4423" stroke-width="1.8" stroke-linecap="round"/><g fill="#3F7D4E" stroke="#24502F" stroke-width="1"><ellipse cx="11" cy="17.5" rx="6" ry="3.2"/><ellipse cx="28" cy="15" rx="6.5" ry="3.4"/><ellipse cx="18" cy="8.5" rx="6.5" ry="3.4"/></g><g fill="#6FA36A"><ellipse cx="10" cy="16.5" rx="3" ry="1.2"/><ellipse cx="27" cy="14" rx="3.2" ry="1.2"/><ellipse cx="17" cy="7.5" rx="3.2" ry="1.2"/></g></g>' },
      { id: 'wagasa', nl: 'een papieren parasol',
        icon: '<g><path d="M20 18 L25.5 37" stroke="#7A5236" stroke-width="1.9" stroke-linecap="round"/><path d="M3 21 Q20 -2 37 21 Q20 15 3 21z" fill="#C0392B" stroke="#6A1C14" stroke-width="1.2" stroke-linejoin="round"/><path d="M8.2 17.4 Q20 2.6 31.8 17.4" fill="none" stroke="#FAF5EF" stroke-width="1.5"/><path d="M20 9.6 L6.4 19.9 M20 9.6 L11.5 18.75 M20 9.6 V18 M20 9.6 L28.5 18.75 M20 9.6 L33.6 19.9" stroke="#6A1C14" stroke-width="0.7"/><circle cx="20" cy="8.4" r="1.5" fill="#3B2A1B"/></g>' },
      { id: 'futon', nl: 'een futon',
        icon: '<g><rect x="5" y="27" width="30" height="7.5" rx="3.2" fill="#2E4A7A" stroke="#1A2A45" stroke-width="1.2"/><g fill="#FAF5EF" opacity="0.85"><circle cx="10" cy="30.8" r="0.9"/><circle cx="15" cy="30.8" r="0.9"/><circle cx="20" cy="30.8" r="0.9"/><circle cx="25" cy="30.8" r="0.9"/><circle cx="30" cy="30.8" r="0.9"/></g><rect x="6.5" y="20.5" width="27" height="7" rx="3" fill="#FAF5EF" stroke="#8A7A60" stroke-width="1.1"/><path d="M10 24 h20" stroke="#C9B79C" stroke-width="0.9" stroke-dasharray="2 2"/><rect x="8" y="14" width="24" height="7" rx="3" fill="#D9737F" stroke="#7A2A3C" stroke-width="1.1"/><path d="M11.5 18 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6 l2 -1.6 l2 1.6" fill="none" stroke="#FAF5EF" stroke-width="0.8"/><rect x="13" y="8.5" width="14" height="6" rx="2.8" fill="#E8D49A" stroke="#7A5A1C" stroke-width="1.1"/></g>' }
    ],
    suspects: [
      { label: 'Gastvrouw Fumiko', gender: 'f', color: '#B85C5C', who: 'Ontvangt al twintig jaar elke gast bij de deur',
        look: 'a gracious ryokan hostess in her fifties, hair in a neat traditional chignon with a lacquered comb, plum-coloured kimono with a dark obi, hands folded, attentive eyes' },
      { label: 'Kok Takeshi', gender: 'm', color: '#5C8B5E', who: 'Kookt elke avond een maaltijd van elf kleine gangen',
        look: 'a meticulous kaiseki chef in his forties, cropped hair, white cotton headband, white chef coat, holding a lacquered tray with small dishes' },
      { label: 'Theemeesteres Chiyo', gender: 'f', color: '#C2185B', who: 'Leidt de theeceremonie, al veertig jaar',
        look: 'a serene tea ceremony master in her sixties, grey hair in a low bun, subdued grey kimono, a bamboo tea whisk in her hands' },
      { label: 'Ingenieur Tetsuo', gender: 'm', color: '#B8955C', who: 'Wil een spoorlijn door het bamboebos aanleggen',
        look: 'an ambitious railway engineer in his thirties, western three-piece suit, round wire glasses, slicked-back hair, rolled blueprints under his arm' },
      { label: 'Fotografe Sachiko', gender: 'f', color: '#8B5CB8', who: 'Fotografeert de bloesem voor een tijdschrift in Osaka',
        look: 'a modern young photographer in her twenties, short bobbed hair, cloche hat, drop-waist western dress, folding camera on a strap' },
      { label: 'Tuinman Goro', gender: 'm', color: '#5C7AB8', who: 'Verzorgt het mos en de bomen sinds zijn twaalfde',
        look: 'an elderly gardener in his sixties, cropped grey hair, indigo work jacket, straw sandals, a bamboo rake and pruning shears' },
      { label: 'Plantkundige Evelyn', gender: 'f', color: '#2C3E50', who: 'Kwam uit Engeland om de kersenbomen te bestuderen',
        look: 'an English botanist in her forties, sensible tweed jacket, wide-brimmed sun hat, magnifying glass, a sprig of cherry blossom pressed in a notebook' },
      { label: 'Prentmaker Shiro', gender: 'm', color: '#D9A441', who: 'Snijdt houtsneden van Kyoto voor verzamelaars overzee',
        look: 'a woodblock print artist in his forties, short cropped hair, dark work kimono with tied-back sleeves, carving tool in hand, a print of cherry blossoms' }
    ],
    titles: ['herbergier', 'gastvrouw', 'kok', 'theemeesteres', 'ingenieur', 'fotografe', 'tuinman', 'plantkundige', 'prentmaker'],
    parts: [
      ['Kersenbloesem', 'De kersen bloeien en alle kamers zijn vol, maar de herbergier komt niet naar de ochtendthee.'],
      ['De theeceremonie', 'Elke beweging ligt vast, en toch zet iemand de kom verkeerd neer.'],
      ['De kostbare theekom', 'Een theekom van driehonderd jaar oud is uit de nis in de gastenkamer verdwenen.'],
      ['De onsen', "Het warme water is er voor de gasten, maar om drie uur 's nachts brandt er nog licht bij de bron."],
      ['Het bamboebos', 'In het bamboebos ritselt het altijd, ook als er geen wind staat.'],
      ['Het regenseizoen', 'Drie weken regen: niemand gaat naar buiten, en toch staan er natte voetstappen in de gang.'],
      ['Het maanfeest', 'Iedereen kijkt naar de volle maan boven de rivier, behalve één gast.'],
      ['De eerste sneeuw', 'Sneeuw op het mos en de lantaarns aan: nog één avond in de ryokan.']
    ],
    outro: 'De sneeuw dekt de tuin toe en de bron dampt. Elke gast mag naar huis, op één na.'
  },
  {
    id: 'fazenda', nr: 19, unlock: 68, icon: '☕', title: 'Fazenda Boa Esperança', short: 'Koffiefazenda',
    era: 'a coffee plantation estate in the green hills of São Paulo state, Brazil, at harvest time in 1926',
    map: { accent: '#4A2C1A', ring: '#D9614A' },
    tagline: 'Brazilië, 1926. Koffiebessen op de droogvloer, muziek op de veranda, en een koffiebaron die de oogst niet meer telt.',
    intro: 'Fazenda Boa Esperança, São Paulo, juni 1926. De oogst is binnen en de droogvloer ligt vol koffiebessen. Op het oogstfeest ontbreekt koffiebaron Augusto Valadares. Hij ligt in de branderij, tussen de zakken.',
    victimName: 'Koffiebaron Augusto Valadares', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'cementtegels',
    floorNote: 'cementtegels: Braziliaanse ladrilhos met een bloemmotief dat over vier tegels doorloopt',
    rooms: [
      { name: 'Droogvloer', article: 'de', color: '#F0957A' }, { name: 'Koffieveld', article: 'het', color: '#8FC79A' },
      { name: 'Pakhuis', article: 'het', color: '#DDD3C0' }, { name: 'Branderij', article: 'de', color: '#C49A7A' },
      { name: 'Veranda', article: 'de', color: '#8CC3DE' }, { name: 'Kapel', article: 'de', color: '#E7A9CF' },
      { name: 'Stal', article: 'de', color: '#D6E39A' }, { name: 'Keuken', article: 'de', color: '#7FB3B0' },
      { name: 'Eetkamer', article: 'de', color: '#D9737F' }, { name: 'Salon', article: 'de', color: '#B3A1D6' },
      { name: 'Studeerkamer', article: 'de', color: '#9AA5B1' }, { name: 'Serre', article: 'de', color: '#F2D36D' }
    ],
    furniture: [
      { id: 'koffiezak', nl: 'een koffiezak',
        icon: '<g stroke-linejoin="round"><path d="M10 13 q-3.5 10.5 -1 21 q11 3 22 0 q2.5 -10.5 -1 -21z" fill="#C7A06A" stroke="#7A5236" stroke-width="1.3"/><path d="M10.5 13.5 q1 -6.5 4.5 -4.5 q2 2.6 5 1.4 q3 -1.4 5 -1.4 q3.5 -1.5 4.5 4.5z" fill="#D9B989" stroke="#7A5236" stroke-width="1.2"/><path d="M10.6 14.6 q9.4 2.6 18.8 0" fill="none" stroke="#5A3A1E" stroke-width="1.8" stroke-linecap="round"/><path d="M9.6 20 q10.4 1.6 20.8 0 M9 29.6 q11 1.6 22 0" fill="none" stroke="#3F7D4E" stroke-width="1.5"/><ellipse cx="20" cy="24.8" rx="3.3" ry="4.3" fill="#5A3A1E" transform="rotate(25 20 24.8)"/><path d="M19 21.4 q2.6 3.2 0.6 6.8" fill="none" stroke="#C7A06A" stroke-width="0.9"/></g>' },
      { id: 'koffiemolen', nl: 'een koffiemolen',
        icon: '<g><rect x="9" y="20" width="22" height="15" rx="1.2" fill="#8B5A2B" stroke="#3B2A1B" stroke-width="1.2"/><rect x="12" y="26.5" width="16" height="5.5" rx="1" fill="#6B4423" stroke="#3B2A1B" stroke-width="0.9"/><circle cx="20" cy="29.2" r="1.1" fill="#C9A227"/><rect x="8" y="18.5" width="24" height="2.4" rx="0.8" fill="#6B4423" stroke="#3B2A1B" stroke-width="0.9"/><path d="M12 18.5 q8 -9 16 0z" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.2"/><path d="M20 12.5 v-4 h10 v-3" fill="none" stroke="#3B2A1B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="28.5" y="1.8" width="3" height="4.6" rx="1.4" fill="#6B4423" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="20" cy="13" r="1.8" fill="#7A5A1C"/></g>' },
      { id: 'koffiestruik', nl: 'een koffiestruik',
        icon: '<g><ellipse cx="20" cy="35" rx="11" ry="2.2" fill="#9C6B43"/><path d="M20 35 V10 M20 24 L11 16 M20 28 L30 20 M20 18 L28 11" stroke="#6B4423" stroke-width="1.6" stroke-linecap="round" fill="none"/><g fill="#2E7D4F" stroke="#1B4D30" stroke-width="0.8"><ellipse cx="12.5" cy="12.5" rx="4.4" ry="2" transform="rotate(-35 12.5 12.5)"/><ellipse cx="8.5" cy="18.5" rx="4.4" ry="2" transform="rotate(20 8.5 18.5)"/><ellipse cx="26.5" cy="7" rx="4.4" ry="2" transform="rotate(-30 26.5 7)"/><ellipse cx="31.5" cy="12.5" rx="4.4" ry="2" transform="rotate(20 31.5 12.5)"/><ellipse cx="32" cy="21" rx="4.4" ry="2" transform="rotate(-15 32 21)"/><ellipse cx="20" cy="7" rx="4.2" ry="1.9" transform="rotate(90 20 7)"/><ellipse cx="13.5" cy="25.5" rx="4.4" ry="2" transform="rotate(-25 13.5 25.5)"/><ellipse cx="27.5" cy="28" rx="4.4" ry="2" transform="rotate(25 27.5 28)"/></g><g fill="#C62828" stroke="#6A1C14" stroke-width="0.6"><circle cx="16" cy="20.5" r="1.7"/><circle cx="17.8" cy="22.6" r="1.7"/><circle cx="15" cy="23.2" r="1.6"/><circle cx="23.4" cy="23.6" r="1.7"/><circle cx="25.4" cy="25" r="1.6"/><circle cx="23" cy="26.2" r="1.6"/><circle cx="22.4" cy="14" r="1.6"/><circle cx="24.2" cy="15.6" r="1.6"/></g></g>' },
      { id: 'papegaai', nl: 'een papegaai',
        icon: '<g stroke-linejoin="round"><path d="M4 28.5 h24" stroke="#7A5236" stroke-width="2.4" stroke-linecap="round"/><path d="M21 25 L32 38 L27.5 38.5 L18.5 27z" fill="#2E6DA4" stroke="#1F3550" stroke-width="1"/><path d="M21.5 25.5 L30 36.5" stroke="#D32F2F" stroke-width="1.6"/><ellipse cx="18.5" cy="19.5" rx="6" ry="8.6" fill="#D32F2F" stroke="#6A1C14" stroke-width="1.2" transform="rotate(-18 18.5 19.5)"/><path d="M19.5 14 q8 4 6 14.5 q-6 -2.5 -7.5 -9z" fill="#F2C14E" stroke="#7A5A1C" stroke-width="1"/><path d="M21 19 q4.4 3.2 4.3 9.2 q-4 -2.2 -5.3 -6.4z" fill="#2E6DA4" stroke="#1F3550" stroke-width="0.9"/><circle cx="15" cy="10" r="5.2" fill="#D32F2F" stroke="#6A1C14" stroke-width="1.2"/><ellipse cx="13.4" cy="10.6" rx="2.6" ry="2.1" fill="#FAF5EF"/><circle cx="13.6" cy="10.2" r="0.95" fill="#1A1108"/><path d="M10.6 8.6 q-4.4 0.6 -3.6 5.4 q1.6 -2 3.8 -2.2z" fill="#EDE6D6" stroke="#3B2A1B" stroke-width="0.9"/><path d="M14 28.5 v-2 M18 28.5 v-2" stroke="#3B2A1B" stroke-width="1.4" stroke-linecap="round"/></g>' },
      { id: 'schommelstoel', nl: 'een schommelstoel',
        icon: '<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M26.5 21 L30.8 6 L34 6.8 L30 22z" fill="#E3C58E" stroke="#7A5236" stroke-width="1"/><path d="M27.6 17 l4.6 0.8 M28.6 13 l4.6 0.8 M29.6 9.2 l4.4 0.8" stroke="#B8955C" stroke-width="0.7"/><path d="M4.5 32.5 Q19 39 35 31" stroke="#5A3A1E" stroke-width="2.6"/><path d="M10 35 L12 22.5 M28 35.4 L28.6 22.5" stroke="#7A5236" stroke-width="2"/><path d="M10 22.5 H30" stroke="#7A5236" stroke-width="2.6"/><path d="M29 22.5 L33.5 4.5" stroke="#7A5236" stroke-width="2.2"/><path d="M30.8 14.5 H14.5 Q11.5 14.5 11.6 18 L11.8 22.5" stroke="#7A5236" stroke-width="1.8"/><path d="M14.6 14.5 q-3 -3 -6 -1" stroke="#7A5236" stroke-width="1.4"/></g>' }
    ],
    suspects: [
      { label: 'Dona Celeste', gender: 'f', color: '#B85C5C', who: 'Dochter van de koffiebaron, doet al tien jaar de boeken',
        look: 'a sharp-eyed Brazilian woman in her thirties, wavy bobbed hair, cream drop-waist dress, pearl earrings, a leather ledger under her arm' },
      { label: 'Rentmeester Joaquim', gender: 'm', color: '#5C8B5E', who: 'Leidt de oogst en betaalt elke zaterdag de plukkers',
        look: 'a weathered estate manager in his fifties, wide-brimmed felt hat, grey moustache, riding boots, a pocket watch on a chain' },
      { label: 'Lerares Giulia', gender: 'f', color: '#C2185B', who: 'Kwam als kind uit Italië en geeft nu les op de fazendaschool',
        look: 'a warm schoolteacher in her twenties, dark hair in a loose knot, white blouse with a cameo brooch, a stack of slates under her arm' },
      { label: 'Koffieproever Bento', gender: 'm', color: '#B8955C', who: 'Proeft elke partij en bepaalt de prijs in Santos',
        look: 'a distinguished Afro-Brazilian coffee taster in his fifties, short grey hair, neat moustache, white linen suit, a silver tasting spoon and a small cup' },
      { label: 'Pianiste Zélia', gender: 'f', color: '#8B5CB8', who: 'Speelt choro op de veranda, te gast uit Rio',
        look: 'a lively Brazilian pianist in her thirties, sleek finger-waved hair, beaded evening dress, long necklace, sheet music in her hand' },
      { label: 'Agronoom Hideo', gender: 'm', color: '#5C7AB8', who: 'Kwam uit Japan en kweekt een nieuwe koffiesoort',
        look: 'a thoughtful Japanese-Brazilian agronomist in his thirties, short neat hair, rolled shirtsleeves, khaki trousers with braces, a coffee seedling in a small pot' },
      { label: 'Inkoper Mulder', gender: 'm', color: '#2C3E50', who: 'Koopt koffie voor een branderij in Amsterdam',
        look: 'a Dutch coffee buyer in his forties, light linen suit, straw boater hat, trimmed blond beard, a notebook full of prices' },
      { label: 'Dokter Lúcia', gender: 'f', color: '#D9A441', who: "Rijdt te paard langs alle fazenda's in de vallei",
        look: 'a country doctor in her forties, practical riding skirt and jacket, hair pinned under a small hat, leather medical bag, stethoscope around her neck' }
    ],
    titles: ['koffiebaron', 'dona', 'rentmeester', 'lerares', 'koffieproever', 'pianiste', 'agronoom', 'inkoper', 'dokter'],
    parts: [
      ['Het oogstfeest', 'De droogvloer ligt vol bessen, en de koffiebaron komt niet naar zijn eigen feest.'],
      ['De droogvloer', 'Elke dag worden de bessen gekeerd, en vannacht heeft iemand er een spoor door getrokken.'],
      ['Het junifeest', 'Een vreugdevuur, vlaggetjes en een quadrille op het erf, en één danser mist zijn partner.'],
      ['De koffietrein', 'Driehonderd zakken gaan per trein naar Santos, en er komen er tweehonderdnegenennegentig aan.'],
      ['De proeverij', 'In Santos is één partij beter dan alle andere, en niemand weet van welke struik hij komt.'],
      ['De nachtvorst', 'Eén nacht vorst kan een hele oogst kosten, en vannacht liep er iemand met een lantaarn tussen de struiken.'],
      ['De nieuwe struik', 'De agronoom kweekt een nieuwe koffiesoort, en iemand wil het zaad hebben.'],
      ['De laatste zak', 'De laatste zak is gewogen: nog één avond muziek op de veranda.']
    ],
    outro: 'De droogvloer is leeg en de boeken kloppen weer. Op de veranda speelt de muziek verder.'
  },
  {
    id: 'zeppelin', nr: 20, unlock: 72, icon: '☁️', title: 'Luchtschip Cirrus', short: 'Zeppelin',
    era: 'a luxury passenger airship drifting above the Atlantic Ocean on its way to Rio de Janeiro in the summer of 1929',
    map: { accent: '#665A80', ring: '#A9B8C8' },
    tagline: '1929. Drie dagen boven de oceaan, niemand kan uitstappen, en de bouwer van het luchtschip landt niet mee.',
    intro: 'Luchtschip Cirrus, augustus 1929. Drie dagen drijft het schip boven de oceaan, op weg naar Rio de Janeiro. Na het diner ligt constructeur Anton Falk in de kaartenkamer, met de koers nog in zijn hand.',
    victimName: 'Constructeur Anton Falk', roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: 'aluminium',
    floorNote: 'aluminium: lichte metalen platen met een naad en rijen klinknagels',
    rooms: [
      { name: 'Salon', article: 'de', color: '#B3A1D6' }, { name: 'Eetzaal', article: 'de', color: '#F2C46D' },
      { name: 'Slaapcabine', article: 'de', color: '#8CC3DE' }, { name: 'Kombuis', article: 'de', color: '#F0957A' },
      { name: 'Bar', article: 'de', color: '#C9677A' }, { name: 'Kaartenkamer', article: 'de', color: '#C9A27E' },
      { name: 'Radiokamer', article: 'de', color: '#D6E39A' }, { name: 'Stuurgondel', article: 'de', color: '#7FB3B0' },
      { name: 'Motorgondel', article: 'de', color: '#9AA5B1' }, { name: 'Loopbrug', article: 'de', color: '#DDD3C0' },
      { name: 'Postkamer', article: 'de', color: '#9FCBA8' }, { name: 'Uitkijkpost', article: 'de', color: '#E7A9CF' }
    ],
    furniture: [
      { id: 'luchtschroef', nl: 'een propeller',
        icon: '<g><path d="M6 29.5 A15.5 15.5 0 0 0 11 34.5 M34 10.5 A15.5 15.5 0 0 0 29 5.5" fill="none" stroke="#7A8794" stroke-width="1.4" stroke-dasharray="2.2 2" stroke-linecap="round"/><path d="M20 20 C16.5 15.5 12 9 7.5 5.5 C4.5 3.5 2.5 6.5 4.5 9.5 C8 14 14 17.5 20 20z" fill="#A86B3C" stroke="#5A3A1E" stroke-width="1.2" stroke-linejoin="round"/><path d="M20 20 C23.5 24.5 28 31 32.5 34.5 C35.5 36.5 37.5 33.5 35.5 30.5 C32 26 26 22.5 20 20z" fill="#A86B3C" stroke="#5A3A1E" stroke-width="1.2" stroke-linejoin="round"/><path d="M7.5 5.5 C4.5 3.5 2.5 6.5 4.5 9.5 C5.2 10.4 6 11.2 6.9 12 L10.4 8.2 C9.4 7.2 8.5 6.3 7.5 5.5z" fill="#C9A227" stroke="#5A3A1E" stroke-width="0.9" stroke-linejoin="round"/><path d="M32.5 34.5 C35.5 36.5 37.5 33.5 35.5 30.5 C34.8 29.6 34 28.8 33.1 28 L29.6 31.8 C30.6 32.8 31.5 33.7 32.5 34.5z" fill="#C9A227" stroke="#5A3A1E" stroke-width="0.9" stroke-linejoin="round"/><path d="M8.5 10 q5 5 11 9.5 M31.5 30 q-5 -5 -11 -9.5" fill="none" stroke="#D9A36F" stroke-width="1"/><circle cx="20" cy="20" r="4.6" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.2"/><circle cx="20" cy="20" r="1.6" fill="#5A6470"/></g>' },
      { id: 'sextant', nl: 'een sextant',
        icon: '<g stroke-linecap="round" stroke-linejoin="round"><path d="M20 5 L8.5 29 M20 5 L31.5 29" stroke="#7A5A1C" stroke-width="3.4"/><path d="M20 5 L8.5 29 M20 5 L31.5 29" stroke="#E0B95A" stroke-width="1.8"/><path d="M7.5 29 Q20 36 32.5 29" fill="none" stroke="#7A5A1C" stroke-width="4.6"/><path d="M7.5 29 Q20 36 32.5 29" fill="none" stroke="#E0B95A" stroke-width="3"/><path d="M10 30.7 l0.6 -1.4 M13 31.9 l0.4 -1.5 M16.5 32.6 l0.2 -1.6 M20 32.8 v-1.6 M23.5 32.6 l-0.2 -1.6 M27 31.9 l-0.4 -1.5 M30 30.7 l-0.6 -1.4" stroke="#7A5A1C" stroke-width="0.7"/><path d="M20 5 L24.5 33.5" stroke="#3B2A1B" stroke-width="1.6"/><rect x="10.5" y="15" width="16" height="3.8" rx="1.4" fill="#4A4A4A" stroke="#1A1108" stroke-width="0.9"/><rect x="25.8" y="14.4" width="2.6" height="5" rx="0.8" fill="#2C2C2C"/><rect x="17.2" y="3" width="5.6" height="4.4" rx="0.6" fill="#DCEBF0" stroke="#5A6470" stroke-width="1"/><circle cx="20" cy="5.2" r="1.3" fill="#7A5A1C"/></g>' },
      { id: 'postzak', nl: 'een postzak',
        icon: '<g stroke-linejoin="round"><g transform="rotate(-12 20 10)"><rect x="12.5" y="4" width="15" height="10" fill="#FAF5EF" stroke="#3B2A1B" stroke-width="0.9"/><rect x="13.6" y="5.1" width="12.8" height="7.8" fill="none" stroke="#B3261E" stroke-width="1.4" stroke-dasharray="2 2"/><rect x="13.6" y="5.1" width="12.8" height="7.8" fill="none" stroke="#1F4E79" stroke-width="1.4" stroke-dasharray="2 2" stroke-dashoffset="2"/><rect x="22.4" y="6.6" width="2.6" height="3" fill="#D9A441"/></g><path d="M9.5 15 q-3.5 10 -0.5 20 q11 3 22 0 q3 -10 -0.5 -20z" fill="#8A97A3" stroke="#3B4450" stroke-width="1.3"/><path d="M10.4 16 q9.6 3 19.2 0" fill="none" stroke="#5A3A1E" stroke-width="1.8" stroke-linecap="round"/><path d="M13 22 h14 v8 h-14z" fill="#DCE3EA" stroke="#3B4450" stroke-width="0.9"/><path d="M15 25 h10 M15 27.4 h7" stroke="#5A6470" stroke-width="0.8"/></g>' },
      { id: 'wereldbol', nl: 'een wereldbol',
        icon: '<g><path d="M20 31 v4 M13 36 h14" stroke="#7A5236" stroke-width="2.2" stroke-linecap="round"/><path d="M9.6 8.4 A14 14 0 0 0 30.4 29.6" fill="none" stroke="#C9A227" stroke-width="2.2"/><circle cx="20" cy="19" r="11" fill="#8CC3DE" stroke="#1F4E79" stroke-width="1.2"/><g fill="#9FCBA8" stroke="#3F7D4E" stroke-width="0.8" stroke-linejoin="round"><path d="M11.5 13 q3 -4 7 -2.5 q1 3 -2 4.5 q-0.5 3 -2 6 q-2.5 -0.5 -3 -3.5 q-1.5 -2 0 -4.5z"/><path d="M16.5 22.5 q2.5 -0.5 3 2 q-0.5 4 -2 6 q-2 -2 -2 -5z"/><path d="M22.5 11 q4 -1 6.5 1.5 q-1 3 -3.5 3 q1.5 4 -0.5 7.5 q-2.5 -1 -3 -5 q-2 -2 0.5 -7z"/></g><ellipse cx="20" cy="19" rx="5" ry="11" fill="none" stroke="#1F4E79" stroke-width="0.6" opacity="0.6"/><path d="M9 19 h22" stroke="#1F4E79" stroke-width="0.6" opacity="0.6"/></g>' },
      { id: 'schrijfmachine', nl: 'een schrijfmachine',
        icon: '<g stroke-linejoin="round"><rect x="12" y="3.5" width="16" height="11" fill="#FAF5EF" stroke="#8A7A60" stroke-width="1"/><path d="M14.5 7 h11 M14.5 9.6 h8" stroke="#8A97A3" stroke-width="0.8"/><rect x="6" y="12.5" width="28" height="4" rx="2" fill="#2C2C2C" stroke="#111" stroke-width="1"/><path d="M34 14.5 h2.6 v-4" stroke="#BFC9D4" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M8 17 h24 l3 15 h-30z" fill="#3A3A3A" stroke="#111" stroke-width="1.2"/><path d="M15 17 q5 5 10 0" fill="#555" stroke="#111" stroke-width="0.8"/><g fill="#FAF5EF" stroke="#111" stroke-width="0.5"><circle cx="11.5" cy="24" r="1.2"/><circle cx="15" cy="24" r="1.2"/><circle cx="18.5" cy="24" r="1.2"/><circle cx="22" cy="24" r="1.2"/><circle cx="25.5" cy="24" r="1.2"/><circle cx="29" cy="24" r="1.2"/><circle cx="10.5" cy="27.5" r="1.2"/><circle cx="14" cy="27.5" r="1.2"/><circle cx="17.5" cy="27.5" r="1.2"/><circle cx="21" cy="27.5" r="1.2"/><circle cx="24.5" cy="27.5" r="1.2"/><circle cx="28" cy="27.5" r="1.2"/><circle cx="31.5" cy="27.5" r="1.2"/></g><rect x="13" y="29.6" width="14" height="1.6" rx="0.8" fill="#FAF5EF" stroke="#111" stroke-width="0.5"/></g>' }
    ],
    suspects: [
      { label: 'Commandant Brandt', gender: 'm', color: '#B85C5C', who: 'Voert het bevel, al twintig jaar in de lucht',
        look: 'an airship commander in his fifties, trimmed grey beard, dark uniform jacket, white peaked cap, binoculars around his neck' },
      { label: 'Verslaggeefster Daisy', gender: 'f', color: '#5C8B5E', who: 'Schrijft over de reis voor kranten in drie landen',
        look: 'an adventurous newspaper reporter in her thirties, sleek dark bob, tailored tweed suit, aviator scarf, a fountain pen and notebook' },
      { label: 'Navigator Mateus', gender: 'm', color: '#C2185B', who: 'Braziliaan, kent de wind boven de evenaar',
        look: 'a young Brazilian navigator in his twenties, dark curly hair, open-collared uniform shirt, a rolled chart under his arm, pencil behind his ear' },
      { label: 'Weerkundige Liv', gender: 'f', color: '#B8955C', who: 'Leest de wolken en kiest de koers',
        look: 'a Norwegian meteorologist in her thirties, fair hair pinned in a low knot, thick knitted cardigan, round spectacles, a brass barometer in her hands' },
      { label: 'Monteur Bruno', gender: 'm', color: '#8B5CB8', who: 'Houdt de vijf motoren draaiend, buiten in de gondels',
        look: 'a cheerful engine mechanic in his thirties, woollen cap, grease on one cheek, overalls with rolled sleeves, a spanner in his hand' },
      { label: 'Tennisster Josette', gender: 'f', color: '#5C7AB8', who: 'Speelt volgende week een toernooi in Rio',
        look: 'a famous tennis champion in her twenties, bandeau headband over bobbed hair, white pleated tennis dress, cardigan over her shoulders, a wooden racket' },
      { label: 'Diplomaat Moreau', gender: 'm', color: '#2C3E50', who: 'Wil namens zijn land tien luchtschepen kopen',
        look: 'a polished French diplomat in his fifties, silver hair, waxed silver moustache, dark morning coat, a rosette in his lapel, leather document case' },
      { label: 'Postmeesteres Elsbeth', gender: 'f', color: '#D9A441', who: 'Bewaakt vijftigduizend brieven met zeldzame postzegels',
        look: 'a meticulous postmistress in her forties, hair in a tight bun, uniform jacket with brass buttons, an ink stamp in her hand, a sack of airmail beside her' }
    ],
    titles: ['constructeur', 'commandant', 'verslaggeefster', 'navigator', 'weerkundige', 'monteur', 'tennisster', 'diplomaat', 'postmeesteres'],
    parts: [
      ['Boven de wolken', 'Na het diner komt de constructeur niet meer uit de kaartenkamer, en uitstappen kan niet.'],
      ['De luchtpost', 'Vijftigduizend brieven aan boord, en één envelop is opengestoomd.'],
      ['Tegenwind', 'Zware tegenwind boven de oceaan houdt iedereen een nacht langer aan boord.'],
      ['De motorgondel', 'Eén van de vijf motoren valt stil, en de monteur weet niet waarom.'],
      ['De loopbrug', 'Hoog in het schip loopt een smalle brug tussen de gaszakken, en in het stof staan verse voetstappen.'],
      ['Het weerbericht', 'Volgens de weerkundige komt er mist, en die mist komt voor iemand precies op tijd.'],
      ['De evenaar', 'Bij de evenaar wordt iedereen gedoopt, en één passagier ontbreekt.'],
      ['Boven de baai van Rio', 'De Suikerbroodberg komt in zicht: nog één rondje boven de baai voordat het schip landt.']
    ],
    outro: 'Het luchtschip ligt vast aan de mast. De koers klopte, en nu klopt de rest ook.'
  }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { ONTWERP_16A: window.ONTWERP_16A };

// Design sheets for the new worlds of 1.4 (PLAN-1.4.md). Same shape as a world in themes.js, plus what the sheet needs:
// a portrait description per suspect (for art/portretten/prompts.js) and the eight parts with a one-line intro.
// Shown by ontwerpblad.html (worlds that are not in themes.js yet; ?alle shows every sheet). After Jaimy's yes this
// becomes the themes.js entry, the portrait prompts and the campaign parts. nr is the world's place on the map.
// Room names that already exist in another world (Keuken, Kelder, Bibliotheek, Wasruimte) are reused on purpose:
// they are translated in all 19 languages with every word form.
// Room colours: twelve distinct hues per world (at most two beige), so neighbouring rooms stay apart on the board.
// floor: 'tegels' (terracotta tiles) and 'parket' (herringbone) are new floor styles; the sheet shows them, style.css gets them.
window.ONTWERP = [
  {
    id: 'hacienda', nr: 9, unlock: 28, icon: '🌵', title: 'Hacienda San Isidro', short: 'Hacienda',
    era: 'a tequila hacienda in Jalisco, Mexico, in 1952',
    map: { accent: '#A0522D', ring: '#F3DCC4' },
    tagline: 'Het agavefeest van San Isidro. Muziek op de patio, en een patrón die niet meer opstaat.',
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
    // icon: the <g> for avatars.js (viewBox 0 0 40 40, same strokes as the other worlds)
    furniture: [
      { id: 'agave', nl: 'een agave',
        icon: '<g><ellipse cx="20" cy="33" rx="11" ry="2.6" fill="#9C6B43"/><g fill="#6E9E8A" stroke="#2F5546" stroke-width="1.1" stroke-linejoin="round"><path d="M17 32 L3 22 L19 30z"/><path d="M23 32 L37 22 L21 30z"/><path d="M17 32 L7 10 L20 29z"/><path d="M23 32 L33 10 L20 29z"/><path d="M18 32 L20 4 L22 32z"/></g></g>' },
      { id: 'ketel', nl: 'een koperen ketel',
        icon: '<g><path d="M22 13 q9 -5 12 5 v12" fill="none" stroke="#9C5326" stroke-width="2.2" stroke-linecap="round"/><circle cx="17" cy="23" r="9" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.4"/><path d="M11 17 q6 -9 12 0" fill="#D98B4E" stroke="#7A3E1C" stroke-width="1.3"/><rect x="15.5" y="9" width="3" height="4" fill="#7A3E1C"/><ellipse cx="13.5" cy="21" rx="2" ry="3.4" fill="#F0B98A" opacity="0.7"/><rect x="9" y="31" width="16" height="3" rx="1" fill="#3B2A1B"/><rect x="31" y="30" width="5" height="4" rx="1" fill="#7A5236" stroke="#3B2A1B" stroke-width="1"/></g>' },
      { id: 'gitaar', nl: 'een gitaar',
        icon: '<g><path d="M22 19 L33 7" stroke="#5A3A1E" stroke-width="3" stroke-linecap="round"/><path d="M31 4 l4 -1 l1 4 l-3 2z" fill="#3B2A1B"/><g stroke="#7A4A1C" stroke-width="1.4"><ellipse cx="15" cy="27" rx="8" ry="7" fill="#D99A4E"/><ellipse cx="21" cy="20" rx="5.5" ry="5" fill="#D99A4E"/></g><ellipse cx="15" cy="27" rx="7.3" ry="6.3" fill="#D99A4E"/><ellipse cx="21" cy="20" rx="4.8" ry="4.3" fill="#D99A4E"/><circle cx="17" cy="24" r="2.4" fill="#3B2A1B"/><path d="M11 30 l4 -4" stroke="#5A3A1E" stroke-width="1.6"/></g>' },
      { id: 'hangmat', nl: 'een hangmat',
        icon: '<g><path d="M6 7 v26 M34 7 v26" stroke="#7A5236" stroke-width="2.4" stroke-linecap="round"/><path d="M6 12 Q20 32 34 12 Q20 24 6 12z" fill="#D9534F" stroke="#7A2A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 15 Q20 28 31 15" fill="none" stroke="#F2C14E" stroke-width="1.6"/><path d="M12 19 Q20 26 28 19" fill="none" stroke="#2E9CCA" stroke-width="1.3"/></g>' },
      { id: 'pinata', nl: 'een piñata',
        icon: '<g><path d="M20 0 v6" stroke="#3B2A1B" stroke-width="1.1"/><path d="M17.2 15.7 L20.0 6.0 L22.8 15.7z" fill="#E84393" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M23.2 15.9 L33.0 13.5 L26.0 20.8z" fill="#2E9CCA" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M26.0 21.2 L33.0 28.5 L23.2 26.1z" fill="#F39C12" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M22.8 26.3 L20.0 36.0 L17.2 26.3z" fill="#3FAE6A" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M16.8 26.1 L7.0 28.5 L14.0 21.2z" fill="#E84393" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><path d="M14.0 20.8 L7.0 13.5 L16.8 15.9z" fill="#2E9CCA" stroke="#3B2A1B" stroke-width="1.1" stroke-linejoin="round"/><circle cx="20" cy="21" r="6.4" fill="#F2C14E" stroke="#7A5A1C" stroke-width="1.2"/></g>' }
    ],
    suspects: [
      { label: 'Doña Inés', gender: 'f', color: '#B85C5C', who: 'Weduwe van Don Rafael, vrouw des huizes',
        look: 'a proud widow in her fifties, black hair in a low bun with a tortoiseshell comb, black lace mantilla over the shoulders, small gold cross' },
      { label: 'Mariachi Rubén', gender: 'm', color: '#5C8B5E', who: 'Zanger van het feestorkest',
        look: 'a handsome mariachi singer in his thirties, thin moustache, charro jacket with silver buttons, wide bow tie, hat hanging on his back' },
      { label: 'Kokkin Lupita', gender: 'f', color: '#C2185B', who: 'Kookt al dertig jaar op de hacienda',
        look: 'a warm cook in her forties, braids pinned around her head, embroidered blouse, apron, rebozo shawl over one shoulder' },
      { label: 'Voorman Esteban', gender: 'm', color: '#B8955C', who: 'Leidt de agaveoogst op het land',
        look: 'a weathered field foreman in his fifties, broad straw hat, grey stubble, work shirt with rolled sleeves, a coa harvesting tool over his shoulder' },
      { label: 'Schilderes Paloma', gender: 'f', color: '#8B5CB8', who: 'Gast uit de stad, schildert de oogst',
        look: 'a bohemian painter in her thirties, flowers braided into dark hair, bold earrings, paint-stained smock, direct gaze' },
      { label: 'Neef Tomás', gender: 'm', color: '#5C7AB8', who: 'Neef en erfgenaam, net terug uit de hoofdstad',
        look: 'a slick young man in his twenties, oiled side-parted hair, sharp double-breasted suit, pencil moustache, cigarette case in hand' },
      { label: 'Notaris Guzmán', gender: 'm', color: '#2C3E50', who: 'Bewaart het testament',
        look: 'a fussy notary in his sixties, round spectacles, bald with grey fringe, three-piece suit, leather document case' },
      { label: 'Zuster Bárbara', gender: 'f', color: '#D9A441', who: 'Non uit de kapel van de hacienda',
        look: 'a calm nun in her forties, simple dark habit and white wimple, wooden rosary, observant eyes' }
    ],
    parts: [
      ['Het agavefeest', 'De oogst is binnen. Muziek, vuurwerk en een stokerij die op slot zit.'],
      ['De stokerij', 'De koperen ketels zijn nog warm. Iemand heeft de kraan opengezet.'],
      ['Het testament', 'De notaris leest voor. Niet iedereen hoort zijn naam.'],
      ['De kapel', 'De kaarsen branden de hele nacht. Eén bank bleef leeg.'],
      ['Dag van de Doden', 'Goudsbloemen op het altaar, suikerschedels op tafel. En één foto te veel.'],
      ['Het droge seizoen', 'De put staat leeg. Wie heeft het water verkocht?'],
      ['De paardenmarkt', 'Kopers uit drie dorpen. Eén paard komt niet terug.'],
      ['Afscheid van San Isidro', 'De hacienda wordt verkocht. Eén laatste feest op de patio.']
    ],
    outro: 'De ketels koelen af, de muziek is stil. Jij weet wat er in de ketel zat.'
  },
  {
    id: 'opera', nr: 10, unlock: 32, icon: '🎭', title: 'Opéra Lumière', short: 'Opera',
    era: 'a grand opera house in Paris on a premiere night in 1891',
    map: { accent: '#7A1430', ring: '#E8C77A' },
    tagline: 'Rood fluweel, kristallen kroonluchters en een uitverkochte première. Alleen de directeur komt na de pauze niet terug.',
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
      { id: 'paspop', nl: 'een paspop',
        icon: '<g><path d="M20 27 v6 M14 36 L20 32 L26 36" stroke="#3B2A1B" stroke-width="1.8" fill="none" stroke-linecap="round"/><rect x="18" y="4" width="4" height="4" rx="1" fill="#7A5236"/><path d="M13 9 q7 -4 14 0 q2 6 -1.5 10 q2.5 4 2.5 9 h-16 q0 -5 2.5 -9 q-3.5 -4 -1.5 -10z" fill="#E8DCC8" stroke="#7A5A1C" stroke-width="1.3" stroke-linejoin="round"/><path d="M13.5 18 h13" stroke="#C62828" stroke-width="1.2"/><path d="M15 18 v1.6 M18 18 v1.6 M21 18 v1.6 M24 18 v1.6" stroke="#C62828" stroke-width="0.7"/></g>' },
      { id: 'harp', nl: 'een harp',
        icon: '<g><path d="M15 7.2 V33.2 M18.5 6.9 V29.5 M22 7.5 V25.8 M25.5 9.1 V22.1 M29 11.7 V18.4" stroke="#E8DCC8" stroke-width="0.9"/><path d="M11 8 Q22 2 33 15" fill="none" stroke="#C9A227" stroke-width="2.6" stroke-linecap="round"/><path d="M11 7 V34" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/><path d="M33 15 L15 34" stroke="#7A5236" stroke-width="3.4" stroke-linecap="round"/><rect x="8" y="33" width="12" height="3" rx="1" fill="#7A5A1C"/><circle cx="11" cy="6" r="2" fill="#E0B95A" stroke="#7A5A1C" stroke-width="0.8"/></g>' },
      { id: 'masker', nl: 'een masker',
        icon: '<g><path d="M29 24 L34 37" stroke="#7A5236" stroke-width="1.8" stroke-linecap="round"/><path d="M29 12 q7 -9 4 -11 q-2 6 -6 9z" fill="#B3261E"/><path d="M6 16 Q20 8 34 16 Q33 26 25 25 Q20 22 15 25 Q7 26 6 16z" fill="#F2F0EA" stroke="#3B2A1B" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 14.5 Q20 7.5 32 14.5" fill="none" stroke="#C9A227" stroke-width="1.5"/><ellipse cx="14" cy="18" rx="3.2" ry="2" fill="#3B2A1B"/><ellipse cx="26" cy="18" rx="3.2" ry="2" fill="#3B2A1B"/></g>' },
      { id: 'boeket', nl: 'een boeket',
        icon: '<g><ellipse cx="10" cy="20" rx="3.2" ry="1.8" fill="#3F7D4E" transform="rotate(-30 10 20)"/><ellipse cx="30" cy="20" rx="3.2" ry="1.8" fill="#3F7D4E" transform="rotate(30 30 20)"/><path d="M13 21 L20 36 L27 21z" fill="#EDE6D6" stroke="#8A7A60" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 28 h8" stroke="#B3261E" stroke-width="2.2"/><g stroke="#7A0F35" stroke-width="1"><circle cx="14" cy="17" r="4.5" fill="#C2185B"/><circle cx="26" cy="17" r="4.5" fill="#C2185B"/><circle cx="20" cy="12" r="5" fill="#D81B60"/></g><g fill="none" stroke="#7A0F35" stroke-width="0.9"><path d="M20 10 a2 2 0 1 1 -2 2"/><path d="M14 15.5 a1.6 1.6 0 1 1 -1.6 1.6"/><path d="M26 15.5 a1.6 1.6 0 1 1 -1.6 1.6"/></g></g>' },
      { id: 'toneelkijker', nl: 'een toneelkijker',
        icon: '<g><path d="M31 30 L36 38" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/><rect x="6" y="11" width="12" height="15" rx="3.5" fill="#F1E7D6" stroke="#7A5A1C" stroke-width="1.2"/><rect x="22" y="11" width="12" height="15" rx="3.5" fill="#F1E7D6" stroke="#7A5A1C" stroke-width="1.2"/><rect x="17.5" y="14" width="5" height="6" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.8"/><path d="M6.5 16 h11 M22.5 16 h11" stroke="#C9A227" stroke-width="1.6"/><circle cx="12" cy="28" r="5" fill="#3B4E6B" stroke="#C9A227" stroke-width="1.8"/><circle cx="28" cy="28" r="5" fill="#3B4E6B" stroke="#C9A227" stroke-width="1.8"/><path d="M9.8 26.6 a2.6 2.6 0 0 1 2.6 -2 M25.8 26.6 a2.6 2.6 0 0 1 2.6 -2" fill="none" stroke="#DCEBF0" stroke-width="1"/></g>' }
    ],
    suspects: [
      { label: 'Diva Colette', gender: 'f', color: '#C2185B', who: 'De sopraan, ster van de première',
        look: 'a glamorous opera diva in her thirties, piled-up curls with a jewelled tiara, off-shoulder velvet gown, fur stole, haughty look' },
      { label: 'Tenor Matteo', gender: 'm', color: '#5C7AB8', who: 'Italiaanse tenor, haar tegenspeler',
        look: 'a dashing Italian tenor in his thirties, wavy hair, curled moustache, embroidered stage doublet with a ruff collar' },
      { label: 'Dirigent Armand', gender: 'm', color: '#2C3E50', who: 'Leidt het orkest, al dertig jaar aan het huis',
        look: 'a severe conductor in his sixties, wild white hair, white tie and tailcoat, baton in hand, intense frown' },
      { label: 'Danseres Ninon', gender: 'f', color: '#8B5CB8', who: 'Jongste ballerina van het corps',
        look: 'a young ballerina in her late teens, hair in a tight bun, tulle tutu bodice, ribbon at the neck, wide nervous eyes' },
      { label: 'Kostumière Eloise', gender: 'f', color: '#D9A441', who: 'Maakt alle kostuums, kent elke naad',
        look: 'a sharp seamstress in her forties, measuring tape around the neck, pins in her collar, high-necked blouse, pince-nez' },
      { label: 'Baron Viktor', gender: 'm', color: '#B8955C', who: 'Geldschieter van de opera',
        look: 'a wealthy baron in his fifties, monocle, mutton-chop whiskers, opera cape over evening dress, silver-topped cane' },
      { label: 'Toneelmeester Hugo', gender: 'm', color: '#5C8B5E', who: 'Bedient het touwwerk en de valluiken',
        look: 'a burly stagehand chief in his forties, flat cap, rolled shirtsleeves, braces, coil of rope on his shoulder, short beard' },
      { label: 'Recensente Simone', gender: 'f', color: '#B85C5C', who: 'Schrijft voor Le Figaro, gevreesd om haar pen',
        look: 'an elegant critic in her thirties, short dark hair under a small feathered hat, high-collared jacket, notebook and pencil, raised eyebrow' }
    ],
    parts: [
      ['De première', 'Uitverkocht tot in de nok. In de pauze is de directeur weg.'],
      ['Achter het doek', 'Touwen, valluiken en contragewichten. Eén touw is doorgesneden.'],
      ['De verdwenen partituur', 'De nieuwe aria is gestolen, een uur voor de voorstelling.'],
      ['Het gemaskerd bal', 'Iedereen draagt een masker. Wie stond er naast wie?'],
      ['De toneelkelder', 'Onder het toneel ligt een tweede gebouw. Daar dwaalt iemand.'],
      ['Generale repetitie', 'Alles moet perfect. Eén rekwisiet is echt.'],
      ['De tournee', 'Wenen, Milaan, Londen. De moeilijkheden reizen mee.'],
      ['Laatste voorstelling', 'Het gebouw sluit. Nog één keer gaat het doek op.']
    ],
    outro: 'Het doek valt voor de laatste keer. Het applaus is voor jou.'
  },
  {
    id: 'opgraving', nr: 11, unlock: 36, icon: '🏺', title: 'Het Graf van Nefer-Ankh', short: 'Opgraving',
    era: 'an archaeological dig in the Valley of the Kings, Egypt, in 1922',
    map: { accent: '#1F4E79', ring: '#E3C27A' },
    tagline: 'Luxor, 1922. Een verzegelde deur, een vloek op de drempel, en een lord die de eerste stap niet overleeft.',
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
      { id: 'canope', nl: 'een canopenkruik',
        icon: '<g><path d="M12 16 h16 v12 q0 6 -8 6 q-8 0 -8 -6z" fill="#E3D3B0" stroke="#7A5A1C" stroke-width="1.3"/><path d="M12.4 21 h15.2 M12.4 25 h15.2" stroke="#1F4E79" stroke-width="1.2"/><rect x="11" y="14" width="18" height="3" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="1"/><path d="M15.5 9 L17 2.5 L19 8z M24.5 9 L23 2.5 L21 8z" fill="#2C2C2C"/><path d="M15 14 q0 -6 5 -6 q5 0 5 6z" fill="#2C2C2C" stroke="#111" stroke-width="1"/><path d="M20 10.5 l7 1.8 l-6 1.2z" fill="#2C2C2C"/><circle cx="21" cy="10.4" r="0.8" fill="#E0B95A"/></g>' },
      { id: 'olielamp', nl: 'een olielamp',
        icon: '<g><path d="M9 24 q-5 -4 0 -7" fill="none" stroke="#7A3E1C" stroke-width="2"/><path d="M8 26 q12 -12 22 -2 l6 -2 q-2 6 -8 6 h-16 q-4 0 -4 -2z" fill="#C8743A" stroke="#7A3E1C" stroke-width="1.3" stroke-linejoin="round"/><ellipse cx="19" cy="21.5" rx="3" ry="1.2" fill="#3B2A1B"/><path d="M35 21 q-3 -5 1 -10 q3 5 -1 10z" fill="#F39C12" stroke="#B3261E" stroke-width="0.8"/><path d="M12 27 h16" stroke="#F0B98A" stroke-width="1" opacity="0.7"/></g>' },
      { id: 'kameel', nl: 'een kameel',
        icon: '<g><path d="M11 24 v10 M15 24 v10 M24 24 v10 M28 24 v10" stroke="#7A4A1C" stroke-width="2" stroke-linecap="round"/><path d="M7 22 q0 -5 5 -6 q3 -6 7 -1 q3 -7 8 -1 q4 1 4 6 q0 3 -3 3 h-18 q-3 0 -3 -1z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M30 20 q3 -2 3 -8 q0 -3 3 -3 q3 0 3 2 l-1 1 h-2 q-1 4 -1 8 q0 3 -3 3z" fill="#D9A36F" stroke="#7A4A1C" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 17.5 h11 v3.5 h-11z" fill="#B3261E" opacity="0.85"/><path d="M14 21 h11" stroke="#F2C14E" stroke-width="1"/><circle cx="36.5" cy="10.5" r="0.7" fill="#3B2A1B"/></g>' },
      { id: 'papyrus', nl: 'een papyrusrol',
        icon: '<g><rect x="9" y="12" width="22" height="16" fill="#EDE0B8" stroke="#8A7A60" stroke-width="1.2"/><rect x="5" y="10" width="5" height="20" rx="2.5" fill="#D9C38A" stroke="#7A5A1C" stroke-width="1.2"/><rect x="30" y="10" width="5" height="20" rx="2.5" fill="#D9C38A" stroke="#7A5A1C" stroke-width="1.2"/><g stroke="#1F4E79" stroke-width="1" fill="none"><circle cx="14.5" cy="17" r="1.6"/><path d="M19 14.5 v5 M21 14.5 q2 2.5 0 5 M25 15.5 l2 2.5 l-2 2.5 M13 23.5 h4 M20 22 l1 3 l1 -3 M24.5 23.5 h3"/></g></g>' },
      { id: 'zeef', nl: 'een zeef',
        icon: '<g><path d="M6 33 q14 -7 28 0z" fill="#E3C58E" stroke="#B8955C" stroke-width="1"/><path d="M10 21 v11 M29 25 v7" stroke="#7A5236" stroke-width="1.8" stroke-linecap="round"/><path d="M7 14 l26 6 l-2 8 l-26 -6z" fill="#F3EDE3" stroke="#7A5236" stroke-width="2" stroke-linejoin="round"/><path d="M9.5 17.5 l20.5 4.7 M8.5 20.5 l20.5 4.7 M13 15.4 l-2 7.6 M18 16.5 l-2 7.6 M23 17.7 l-2 7.6 M28 18.8 l-2 7.6" stroke="#8A7A60" stroke-width="0.6"/></g>' }
    ],
    suspects: [
      { label: 'Professor Hartley', gender: 'm', color: '#B85C5C', who: 'Leidt de opgraving, al zes jaar in de vallei',
        look: 'a stern archaeologist in his fifties, pith helmet, round spectacles, grey moustache, khaki field jacket with many pockets' },
      { label: 'Lady Rosamund', gender: 'f', color: '#5C8B5E', who: 'Nicht van Lord Ashcombe, voor het eerst in Egypte',
        look: 'an English aristocrat in her twenties, cloche hat with a sun veil, pearl necklace, linen travelling dress, parasol over her shoulder' },
      { label: 'Tekenares Maud', gender: 'f', color: '#C2185B', who: 'Tekent elke vondst voordat iemand hem aanraakt',
        look: 'an expedition artist in her thirties, short practical bob, sleeves rolled up, pencil behind her ear, sketchbook in hand' },
      { label: 'Opzichter Ahmed', gender: 'm', color: '#B8955C', who: 'Leidt de ploeg van honderd gravers',
        look: 'an Egyptian dig foreman in his forties, white turban, neat beard, striped galabiya, calm authoritative look' },
      { label: 'Correspondente Ivy', gender: 'f', color: '#8B5CB8', who: 'Schrijft voor een krant in New York',
        look: 'an American newspaper correspondent in her thirties, short wavy hair under a beret, trench coat, notebook and camera strap' },
      { label: 'Kameeldrijver Omar', gender: 'm', color: '#5C7AB8', who: 'Brengt water en post uit Luxor',
        look: 'a young camel driver in his twenties, keffiyeh head scarf, bright smile, rope and a leather water bag over his shoulder' },
      { label: 'Egyptologe Clara', gender: 'f', color: '#2C3E50', who: 'Wilde dit graf zelf vinden',
        look: 'a rival Egyptologist in her forties, tightly pinned hair, wire spectacles, high-collared blouse, magnifying glass on a chain' },
      { label: 'Verzamelaar Von Hagen', gender: 'm', color: '#D9A441', who: 'Koopt wat de musea niet krijgen',
        look: 'a German antiquities collector in his sixties, white linen suit, panama hat, monocle, silver-headed walking stick' }
    ],
    parts: [
      ['De verzegelde deur', 'Zes jaar zand, één deur. Lord Ashcombe gaat als eerste naar binnen.'],
      ['De vloek', 'Op de drempel staat een vloek. Het kamp gelooft hem.'],
      ['De schatkamer', 'Goud tot aan het plafond. Eén beeldje ontbreekt.'],
      ['De zandstorm', 'Drie dagen zandstorm. Niemand komt het kamp in of uit.'],
      ['De pers komt', 'Correspondenten uit Londen en Caïro. Iedereen wil de eerste foto.'],
      ['De sarcofaag', 'Het deksel gaat eraf. Eronder ligt meer dan één geheim.'],
      ['De Nijl af', 'De vondsten gaan per boot naar Caïro. Eén kist komt niet aan.'],
      ['Terug naar het zand', 'Het graf gaat dicht. Nog één nacht bij het kampvuur.']
    ],
    outro: 'Het graf is weer dicht. De vloek bestond niet. De dader wel.'
  },
  {
    id: 'casino', nr: 12, unlock: 40, icon: '🎰', title: 'Casino Azur', short: 'Casino',
    era: 'a luxurious casino in Monte Carlo on Grand Prix weekend in 1960',
    map: { accent: '#0F5E4A', ring: '#E8C77A' },
    tagline: 'Monte Carlo, Grand Prix-weekend 1960. Fiches, champagne, en een eigenaar die zijn laatste gok verliest.',
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
      { id: 'roulette', nl: 'een roulettewiel',
        icon: '<g><circle cx="20" cy="20" r="15" fill="#5A3A1E" stroke="#3B2A1B" stroke-width="1.3"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#B3261E" stroke-width="4"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#1A1108" stroke-width="4" stroke-dasharray="3.3 3.3"/><circle cx="20" cy="20" r="7.5" fill="#2E7D32" stroke="#3B2A1B" stroke-width="0.8"/><path d="M20 13 v14 M13 20 h14" stroke="#C9A227" stroke-width="1.6"/><circle cx="20" cy="20" r="2.2" fill="#E0B95A" stroke="#7A5A1C" stroke-width="0.8"/><circle cx="28.5" cy="13.5" r="1.4" fill="#FFFFFF" stroke="#8A97A3" stroke-width="0.5"/></g>' },
      { id: 'fiches', nl: 'een stapel fiches',
        icon: '<g><path d="M6 16 v15 a7 2.5 0 0 0 14 0 v-15" fill="#B3261E" stroke="#3B2A1B" stroke-width="1.2"/><path d="M6 20.5 h14 M6 25 h14 M6 29.5 h14" stroke="#FAF5EF" stroke-width="1" stroke-dasharray="2 2"/><ellipse cx="13" cy="16" rx="7" ry="2.5" fill="#D9534F" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 24 v8 a7 2.5 0 0 0 14 0 v-8" fill="#1F4E79" stroke="#3B2A1B" stroke-width="1.2"/><path d="M20 28 h14" stroke="#FAF5EF" stroke-width="1" stroke-dasharray="2 2"/><ellipse cx="27" cy="24" rx="7" ry="2.5" fill="#2E6DA4" stroke="#3B2A1B" stroke-width="1.2"/><ellipse cx="27" cy="24" rx="3" ry="1" fill="none" stroke="#FAF5EF" stroke-width="0.8"/><ellipse cx="13" cy="16" rx="3" ry="1" fill="none" stroke="#FAF5EF" stroke-width="0.8"/></g>' },
      { id: 'fruitautomaat', nl: 'een fruitautomaat',
        icon: '<g><path d="M28 21 h4 v-11" fill="none" stroke="#8A97A3" stroke-width="1.8"/><circle cx="32" cy="9" r="2.4" fill="#B3261E" stroke="#7A2A1C" stroke-width="0.8"/><rect x="8" y="9" width="20" height="25" rx="3" fill="#C9A227" stroke="#7A5A1C" stroke-width="1.3"/><path d="M8 13 q10 -8 20 0" fill="#B3261E" stroke="#7A5A1C" stroke-width="1.2"/><rect x="11" y="15" width="14" height="8" rx="1" fill="#FAF5EF" stroke="#3B2A1B" stroke-width="1"/><path d="M15.7 15 v8 M20.3 15 v8" stroke="#3B2A1B" stroke-width="0.8"/><circle cx="13.4" cy="19" r="1.5" fill="#B3261E"/><circle cx="18" cy="19" r="1.5" fill="#B3261E"/><path d="M21.4 17.4 l1.6 3.2 l1.6 -3.2z" fill="#2E7D32"/><rect x="11" y="27" width="14" height="4" rx="1" fill="#3B2A1B"/></g>' },
      { id: 'champagnetoren', nl: 'een champagnetoren',
        icon: '<g><rect x="3" y="34.5" width="34" height="2.5" rx="1" fill="#C9A227" stroke="#7A5A1C" stroke-width="0.9"/><path d="M5.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M10 31.2 v3.3 M7.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20 31.2 v3.3 M17.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M25.5 29 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M30 31.2 v3.3 M27.8 34.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M10.5 21 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15 23.2 v3.3 M12.8 26.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20.5 21 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M25 23.2 v3.3 M22.8 26.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><path d="M15.5 13 q4.5 4.5 9 0z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M20 15.2 v3.3 M17.8 18.5 h4.4" stroke="#7A5A1C" stroke-width="0.9"/><g fill="#FAF5EF" stroke="#C9A227" stroke-width="0.5"><circle cx="20" cy="8" r="1.1"/><circle cx="23" cy="5" r="0.8"/><circle cx="17.5" cy="4.5" r="0.7"/></g></g>' },
      { id: 'shaker', nl: 'een cocktailshaker',
        icon: '<g><path d="M14 14 h12 l-2 20 h-8z" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.3" stroke-linejoin="round"/><path d="M15 14 q5 -4 10 0" fill="#BFC9D4" stroke="#5A6470" stroke-width="1.2"/><rect x="18.5" y="7" width="3" height="4" rx="1" fill="#BFC9D4" stroke="#5A6470" stroke-width="1"/><path d="M14.6 19 h10.8" stroke="#5A6470" stroke-width="1"/><path d="M17 21 v10" stroke="#FFFFFF" stroke-width="1.4" opacity="0.8"/><path d="M27 22 h10 l-5 5z" fill="#F5E6B8" stroke="#7A5A1C" stroke-width="0.9"/><path d="M32 27 v6 M29.5 33 h5" stroke="#7A5A1C" stroke-width="1"/><circle cx="33" cy="23.6" r="1" fill="#2E7D32"/></g>' }
    ],
    suspects: [
      { label: 'Croupier Marcel', gender: 'm', color: '#B85C5C', who: 'Leidt de roulettetafel en ziet elke inzet',
        look: 'a precise croupier in his forties, slicked-back hair, thin moustache, white dinner jacket with black bow tie, rake in hand' },
      { label: 'Zangeres Gigi', gender: 'f', color: '#5C8B5E', who: 'Zingt elke avond in de bar',
        look: 'a glamorous nightclub singer in her twenties, platinum bouffant hair, sparkling evening gown, long gloves, vintage microphone' },
      { label: 'Erfgename Delphine', gender: 'f', color: '#C2185B', who: 'Verspeelt elk jaar een fortuin, met plezier',
        look: 'a wealthy heiress in her thirties, elegant updo, diamond earrings, silk evening gown, long cigarette holder' },
      { label: 'Coureur Rocco', gender: 'm', color: '#B8955C', who: 'Rijdt zondag de Grand Prix',
        look: 'a dashing Italian racing driver in his thirties, tousled hair, leather racing jacket, driving goggles pushed up on his forehead' },
      { label: 'Bankier Sterling', gender: 'm', color: '#8B5CB8', who: 'Leende de eigenaar te veel geld',
        look: 'a cool English banker in his fifties, silver hair, tuxedo, pocket square, cufflinks, a faint smirk' },
      { label: 'Fotomodel Tess', gender: 'f', color: '#5C7AB8', who: 'Staat op elke foto van het weekend',
        look: 'a fashion model in her twenties, sleek bob, bold eyeliner, polka-dot dress, big sunglasses pushed up into her hair' },
      { label: 'Gokker Duke', gender: 'm', color: '#2C3E50', who: 'Wint te vaak om toeval te zijn',
        look: 'a professional American gambler in his forties, fedora, loosened tie, cigar, a stack of chips in his hand' },
      { label: 'Huisdetective Fenna', gender: 'f', color: '#D9A441', who: 'Let op valsspelers, in dienst van het casino',
        look: "the casino's house detective, a woman in her forties, sharp tailored suit, short hair, observant eyes, small notebook" }
    ],
    parts: [
      ['De grote avond', 'Grand Prix-weekend. Alle tafels vol, en om middernacht één stoel leeg.'],
      ['De kluis', 'De kluis stond open. Er ontbreekt niets, behalve de eigenaar.'],
      ['Rien ne va plus', 'Het roulettewiel draait. Iemand weet al waar het balletje valt.'],
      ['De Grand Prix', 'Motoren door de straten. Op de tribune zit iemand niet waar hij zei.'],
      ['Het jacht', 'Een feest aan boord in de haven. Eén sloep is weg.'],
      ['Het valse spel', 'Gemerkte kaarten aan tafel drie. Wie deelt er?'],
      ['Het galabal', 'Smoking verplicht. Eén gast draagt de hele avond handschoenen.'],
      ['De laatste inzet', 'Het casino krijgt een nieuwe eigenaar. Nog één spel tot sluitingstijd.']
    ],
    outro: 'De tafels zijn leeg, de fiches geteld. Het huis wint niet altijd.'
  }
];

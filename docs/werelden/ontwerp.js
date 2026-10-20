// Design sheets for the new worlds of 1.4 (PLAN-1.4.md). Same shape as a world in themes.js, plus what the sheet needs:
// a portrait description per suspect (for art/portretten/prompts.js) and the eight parts with a one-line intro.
// Shown by ontwerpblad.html (worlds that are not in themes.js yet; ?alle shows every sheet). After Jaimy's yes this
// becomes the themes.js entry, the portrait prompts and the campaign parts. nr is the world's place on the map;
// portraits: true once assets/portretten/<world>-<n>.webp exist. Cases of approved worlds wait in zaken.js.
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
    id: 'opgraving', nr: 11, unlock: 36, portraits: true, icon: '🏺', title: 'Het Graf van Nefer-Ankh', short: 'Opgraving',
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
      { label: 'Egyptologe Edith', gender: 'f', color: '#2C3E50', who: 'Wilde dit graf zelf vinden',
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
    id: 'casino', nr: 12, unlock: 40, portraits: true, icon: '🎰', title: 'Casino Azur', short: 'Casino',
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
      { label: 'Gokker Jack', gender: 'm', color: '#2C3E50', who: 'Wint te vaak om toeval te zijn',
        look: 'a professional American gambler in his forties, fedora, loosened tie, cigar, a stack of chips in his hand' },
      { label: 'Huisdetective Nora', gender: 'f', color: '#D9A441', who: 'Let op valsspelers, in dienst van het casino',
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
  },
  {
    id: "filmstudio", nr: 13, unlock: 44, portraits: true, icon: "🎬", title: "Paradise Pictures", short: "Filmstudio",
    era: "a Hollywood film studio in 1931",
    map: { accent: "#26232E", ring: "#F2C46D" },
    tagline: "Hollywood, 1931. De eerste geluidsfilm van de studio, en een baas die zijn laatste scène niet haalt.",
    intro: "Paradise Pictures, Hollywood, 1931. De studio draait zijn eerste geluidsfilm. Na de laatste opname van de dag ligt studiobaas Samuel Gold in de projectiezaal, terwijl de film nog loopt.",
    victimName: "Studiobaas Samuel Gold", roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: "beton",
    rooms: [
      { name: "Studiohal", article: "de", color: "#F2C46D" }, { name: "Montagekamer", article: "de", color: "#93A9C9" },
      { name: "Kleedkamer", article: "de", color: "#F0A6A0" }, { name: "Kantine", article: "de", color: "#C7D9A0" },
      { name: "Rekwisietenkamer", article: "de", color: "#D9B48A" }, { name: "Projectiezaal", article: "de", color: "#B3A1D6" },
      { name: "Werkplaats", article: "de", color: "#C9B79C" }, { name: "Directiekamer", article: "de", color: "#D9737F" },
      { name: "Geluidsstudio", article: "de", color: "#7FB3B0" }, { name: "Archief", article: "het", color: "#D0C9BD" },
      { name: "Buitenset", article: "de", color: "#E9C9A0" }, { name: "Poort", article: "de", color: "#8CC3DE" }
    ],
    furniture: [
      { id: "filmcamera", nl: "een filmcamera",
        icon: "<g><path d=\"M14 30 L10 38 M20 30 v8 M26 30 L30 38\" stroke=\"#3B2A1B\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><rect x=\"9\" y=\"18\" width=\"20\" height=\"12\" rx=\"2\" fill=\"#2C2C2C\" stroke=\"#111\" stroke-width=\"1.2\"/><path d=\"M29 21 l6 -2 v10 l-6 -2z\" fill=\"#4A4A4A\" stroke=\"#111\" stroke-width=\"1\"/><circle cx=\"14\" cy=\"12\" r=\"5.5\" fill=\"#4A4A4A\" stroke=\"#111\" stroke-width=\"1.2\"/><circle cx=\"25\" cy=\"12\" r=\"5.5\" fill=\"#4A4A4A\" stroke=\"#111\" stroke-width=\"1.2\"/><circle cx=\"14\" cy=\"12\" r=\"1.6\" fill=\"#BFC9D4\"/><circle cx=\"25\" cy=\"12\" r=\"1.6\" fill=\"#BFC9D4\"/><circle cx=\"35.5\" cy=\"24\" r=\"2\" fill=\"#BFC9D4\" stroke=\"#111\" stroke-width=\"0.8\"/></g>" },
      { id: "schijnwerper", nl: "een schijnwerper",
        icon: "<g><path d=\"M17 24 v9 M11 37 L17 33 L23 37\" stroke=\"#3B2A1B\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M28 13 L38 7 V27 L28 21z\" fill=\"#F5E6B8\" opacity=\"0.75\"/><rect x=\"7\" y=\"10\" width=\"19\" height=\"14\" rx=\"3\" fill=\"#8A97A3\" stroke=\"#3B2A1B\" stroke-width=\"1.2\"/><path d=\"M10 13 v8 M13 13 v8\" stroke=\"#5A6470\" stroke-width=\"1\"/><circle cx=\"25\" cy=\"17\" r=\"4.2\" fill=\"#F5D67A\" stroke=\"#7A5A1C\" stroke-width=\"1\"/></g>" },
      { id: "regiestoel", nl: "een regiestoel",
        icon: "<g><path d=\"M10 36 L28 22 M28 36 L10 22\" stroke=\"#7A5236\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M10 6 v16 M28 6 v16\" stroke=\"#7A5236\" stroke-width=\"2\"/><rect x=\"10\" y=\"8\" width=\"18\" height=\"7\" fill=\"#B3261E\" stroke=\"#7A2A1C\" stroke-width=\"1\"/><rect x=\"9\" y=\"20\" width=\"20\" height=\"3.5\" fill=\"#B3261E\" stroke=\"#7A2A1C\" stroke-width=\"1\"/><path d=\"M13 11.5 h12\" stroke=\"#F2C14E\" stroke-width=\"1\"/></g>" },
      { id: "klapbord", nl: "een klapbord",
        icon: "<g><rect x=\"7\" y=\"16\" width=\"26\" height=\"18\" rx=\"1.5\" fill=\"#2C2C2C\" stroke=\"#111\" stroke-width=\"1.2\"/><path d=\"M10 22 h20 M10 27 h20\" stroke=\"#FAF5EF\" stroke-width=\"0.8\"/><path d=\"M7 15 L32 8 L33.5 13 L8.5 20z\" fill=\"#FAF5EF\" stroke=\"#111\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><path d=\"M12 13.6 l2.5 4.5 M17.5 12.2 l2.5 4.5 M23 10.7 l2.5 4.5 M28.5 9.2 l2.5 4.5\" stroke=\"#111\" stroke-width=\"2\"/></g>" },
      { id: "filmspoel", nl: "een filmspoel",
        icon: "<g><path d=\"M26 25 q6 4 11 2 v6 q-6 2 -12 -2z\" fill=\"#2C2C2C\"/><path d=\"M28 28.5 h1.5 M31.5 29.7 h1.5 M35 30 h1.5\" stroke=\"#FAF5EF\" stroke-width=\"1\"/><circle cx=\"17\" cy=\"18\" r=\"12\" fill=\"#8A97A3\" stroke=\"#3B2A1B\" stroke-width=\"1.3\"/><g fill=\"#FAF5EF\" stroke=\"#3B2A1B\" stroke-width=\"0.8\"><circle cx=\"17\" cy=\"10.5\" r=\"3\"/><circle cx=\"24\" cy=\"15.5\" r=\"3\"/><circle cx=\"21.5\" cy=\"24\" r=\"3\"/><circle cx=\"12.5\" cy=\"24\" r=\"3\"/><circle cx=\"10\" cy=\"15.5\" r=\"3\"/></g><circle cx=\"17\" cy=\"18\" r=\"2.5\" fill=\"#3B2A1B\"/></g>" }
    ],
    suspects: [
      { label: "Filmster Vivian", gender: "f", color: "#B85C5C", who: "De ster van de nieuwe film",
        look: "a glamorous film star in her thirties, platinum finger waves, pencilled eyebrows, satin gown with a fur collar" },
      { label: "Regisseur Baxter", gender: "m", color: "#5C8B5E", who: "Regisseert de eerste geluidsfilm van de studio",
        look: "a film director in his fifties, flat cap, round glasses, tweed jacket, megaphone in hand" },
      { label: "Schrijfster Peggy", gender: "f", color: "#C2185B", who: "Schreef het script en herschrijft het elke dag",
        look: "a sharp screenwriter in her thirties, short bob, cardigan, pencil behind her ear, typed script pages" },
      { label: "Stuntman Hank", gender: "m", color: "#B8955C", who: "Valt voor de ster van daken en paarden",
        look: "a rugged stuntman in his thirties, broken nose, cowboy hat, bandana, leather vest" },
      { label: "Cameraman Lenny", gender: "m", color: "#8B5CB8", who: "Ziet alles door zijn lens",
        look: "a cameraman in his forties, cap worn backwards, rolled sleeves, a light meter on a cord around his neck" },
      { label: "Grimeuse Rita", gender: "f", color: "#5C7AB8", who: "Maakt elke dag de gezichten van de sterren",
        look: "a make-up artist in her forties, hair tied in a scarf, powder brush in hand, smock with many pockets" },
      { label: "Agent Sid", gender: "m", color: "#2C3E50", who: "Onderhandelt over elk contract in de studio",
        look: "a fast-talking talent agent in his forties, pinstripe suit, slicked hair, cigar, carnation in his buttonhole" },
      { label: "Starlet Joy", gender: "f", color: "#D9A441", who: "Kreeg net haar eerste rol",
        look: "a hopeful young starlet of about twenty, curly hair with a bow, polka-dot dress, wide eager smile" }
    ],
    parts: [
      ["De laatste opname", "Na de laatste opname van de dag loopt de film nog. De studiobaas staat niet meer op."],
      ["De verdwenen filmrol", "De enige kopie van de nieuwe film is weg. De première is over een week."],
      ["De stuntscène", "Een sprong van het dak, honderd keer geoefend. Vandaag ging het mis."],
      ["De geluidsfilm", "De eerste film met geluid. De microfoons horen meer dan de bedoeling was."],
      ["De auditie", "Honderd kandidaten, één rol. Eén van hen komt niet terug van de proefopname."],
      ["De brand in het archief", "Oude films branden snel. Iemand wist dat."],
      ["Op locatie", "Een western in de woestijn. Tien wagens, één watervat te weinig."],
      ["Het grote gala", "De film is af. Op het gala gaan de lichten nog één keer aan."]
    ],
    outro: "De lampen gaan uit en de film is in het blik. Het einde klopt eindelijk."
  },
  {
    id: "karavaan", nr: 14, unlock: 48, portraits: true, icon: "🐫", title: "Karavanserai Al-Nour", short: "Karavaan",
    era: "a caravanserai at a desert oasis on the old spice route, around 1900",
    map: { accent: "#0E6E73", ring: "#F2C46D" },
    tagline: "Een oase op de oude specerijenroute. Twaalf kamelen, acht reizigers, en een karavaanleider die niet meer vertrekt.",
    intro: "Karavanserai Al-Nour, een oase op de oude specerijenroute. De karavaan rust één nacht binnen de muren. Bij zonsopgang ligt karavaanleider Idris bij de kamelen, en de poort is de hele nacht dicht geweest.",
    victimName: "Karavaanleider Idris", roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: "mozaiek",
    rooms: [
      { name: "Binnenplaats", article: "de", color: "#F2C46D" }, { name: "Bazaar", article: "de", color: "#E8A798" },
      { name: "Theehuis", article: "het", color: "#9FCBA8" }, { name: "Badhuis", article: "het", color: "#8CC3DE" },
      { name: "Waterput", article: "de", color: "#93A9C9" }, { name: "Gastenkamer", article: "de", color: "#B3A1D6" },
      { name: "Tapijtwinkel", article: "de", color: "#D9737F" }, { name: "Poort", article: "de", color: "#C9B79C" },
      { name: "Dakterras", article: "het", color: "#F3B57A" }, { name: "Stal", article: "de", color: "#C7D9A0" },
      { name: "Keuken", article: "de", color: "#9FC8C8" }, { name: "Voorraadkamer", article: "de", color: "#D0C9BD" }
    ],
    furniture: [
      { id: "tapijt", nl: "een tapijt",
        icon: "<g><rect x=\"5\" y=\"13\" width=\"30\" height=\"15\" rx=\"2\" fill=\"#B3261E\" stroke=\"#5A1A12\" stroke-width=\"1.2\"/><path d=\"M9 13 v15 M31 13 v15\" stroke=\"#F2C14E\" stroke-width=\"1.6\"/><path d=\"M14 20.5 l3 -4 l3 4 l-3 4z M20 20.5 l3 -4 l3 4 l-3 4z\" fill=\"#1F4E79\"/><path d=\"M5 28 v3 M8 28 v3 M32 28 v3 M35 28 v3 M5 10 v3 M8 10 v3 M32 10 v3 M35 10 v3\" stroke=\"#F2C14E\" stroke-width=\"1\"/></g>" },
      { id: "specerijen", nl: "een mand specerijen",
        icon: "<g><path d=\"M6 24 h28 l-3 10 h-22z\" fill=\"#C7A06A\" stroke=\"#7A5236\" stroke-width=\"1.2\"/><path d=\"M8 28 h24\" stroke=\"#7A5236\" stroke-width=\"0.8\"/><path d=\"M9 24 q4 -10 8 0z\" fill=\"#E8A33C\" stroke=\"#9C6B1E\" stroke-width=\"0.9\"/><path d=\"M16 24 q4 -12 8 0z\" fill=\"#B3261E\" stroke=\"#6A1C14\" stroke-width=\"0.9\"/><path d=\"M23 24 q4 -9 8 0z\" fill=\"#E3C14A\" stroke=\"#9C7A1E\" stroke-width=\"0.9\"/></g>" },
      { id: "kruik", nl: "een waterkruik",
        icon: "<g><path d=\"M15 8 h10 l-1 4 q7 4 7 13 q0 9 -11 9 q-11 0 -11 -9 q0 -9 7 -13z\" fill=\"#C8743A\" stroke=\"#7A3E1C\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><path d=\"M11 22 h18\" stroke=\"#F2C14E\" stroke-width=\"1.4\"/><path d=\"M12.5 26 h15\" stroke=\"#1F4E79\" stroke-width=\"1\"/><ellipse cx=\"20\" cy=\"8\" rx=\"5\" ry=\"1.4\" fill=\"#7A3E1C\"/></g>" },
      { id: "zadel", nl: "een kameelzadel",
        icon: "<g><path d=\"M6 26 q14 -10 28 0 v4 h-28z\" fill=\"#7A5236\" stroke=\"#3B2A1B\" stroke-width=\"1.2\"/><path d=\"M10 26 v-10 M30 26 v-10\" stroke=\"#C9A227\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><circle cx=\"10\" cy=\"15\" r=\"2\" fill=\"#C9A227\"/><circle cx=\"30\" cy=\"15\" r=\"2\" fill=\"#C9A227\"/><path d=\"M6 30 h28 v3 h-28z\" fill=\"#B3261E\" stroke=\"#5A1A12\" stroke-width=\"1\"/><path d=\"M9 33 v3 M14 33 v3 M19 33 v3 M24 33 v3 M29 33 v3\" stroke=\"#F2C14E\" stroke-width=\"1\"/></g>" },
      { id: "weegschaal", nl: "een koperen weegschaal",
        icon: "<g><path d=\"M20 8 v24 M12 34 h16\" stroke=\"#9C7A1E\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M8 12 h24\" stroke=\"#C9A227\" stroke-width=\"2\"/><circle cx=\"20\" cy=\"8\" r=\"2\" fill=\"#C9A227\"/><path d=\"M8 12 l-4 10 M8 12 l4 10 M32 12 l-4 10 M32 12 l4 10\" stroke=\"#9C7A1E\" stroke-width=\"0.8\"/><path d=\"M3 22 q5 4 10 0z M27 22 q5 4 10 0z\" fill=\"#E0B95A\" stroke=\"#9C7A1E\" stroke-width=\"1\"/></g>" }
    ],
    suspects: [
      { label: "Koopvrouw Layla", gender: "f", color: "#B85C5C", who: "Handelt in saffraan en kaneel",
        look: "a shrewd spice merchant in her forties, patterned headscarf, gold bangles, embroidered robe, a small brass scale" },
      { label: "Gids Tariq", gender: "m", color: "#5C8B5E", who: "Kent elke duin tussen hier en de zee",
        look: "a desert guide in his thirties, indigo turban wrapped down to the chin, keen eyes, camel stick" },
      { label: "Tapijthandelaar Yusuf", gender: "m", color: "#C2185B", who: "Verkoopt tapijten aan iedereen die stilstaat",
        look: "a jovial carpet merchant in his fifties, round cap, grey beard, striped kaftan, rolled carpet under his arm" },
      { label: "Reizigster Beatrix", gender: "f", color: "#B8955C", who: "Reist alleen en schrijft er een boek over",
        look: "a European woman traveller in her thirties, pith helmet with a scarf, linen jacket, travel journal" },
      { label: "Theeschenker Hamid", gender: "m", color: "#8B5CB8", who: "Schenkt de thee en hoort elk gesprek",
        look: "a young tea server in his twenties, small cap, embroidered vest, ornate brass teapot held high" },
      { label: "Sterrenkijker Zahra", gender: "f", color: "#5C7AB8", who: "Leest de weg in de sterren",
        look: "an astronomer and navigator in her forties, head scarf with tiny stars, brass astrolabe in her hands" },
      { label: "Bewaker Karim", gender: "m", color: "#2C3E50", who: "Bewaakt de poort, de hele nacht",
        look: "a stern caravanserai guard in his forties, thick moustache, sash, sheathed curved dagger, ring of keys" },
      { label: "Dichteres Samira", gender: "f", color: "#D9A441", who: "Schrijft gedichten over elke reiziger",
        look: "a young poet in her twenties, flowing scarf, kohl-lined eyes, reed pen and a small book of verses" }
    ],
    parts: [
      ["De poort gaat dicht", "De karavaan rust één nacht binnen de muren. Bij zonsopgang ligt de karavaanleider bij de kamelen."],
      ["De verdwenen saffraan", "Tien zakken saffraan, een fortuin. Bij het tellen zijn het er negen."],
      ["Het theehuis", "In het theehuis hoort iedereen alles. Eén gesprek hoorde niemand."],
      ["De bazaar", "Marktdag in de oase. Duizend stemmen, en één ervan liegt."],
      ["De nacht van de sterren", "De sterrenkijker leest de weg voor de tocht. Ze ziet een licht dat er niet hoort."],
      ["Het badhuis", "In de damp van het badhuis ziet niemand elkaar. Bijna niemand."],
      ["De lange tocht", "Twintig dagen door de woestijn. Elke avond telt de gids de kamelen."],
      ["Afscheid van de oase", "De karavaan trekt verder. Nog één avond op het dakterras, onder de sterren."]
    ],
    outro: "De karavaan trekt verder. Achter de poort blijft één geheim minder achter."
  },
  {
    id: "abdij", nr: 15, unlock: 52, portraits: true, icon: "⛪", title: "De Abdij van Sint-Aldric", short: "Abdij",
    era: "a medieval abbey in the mountains in the winter of 1327",
    map: { accent: "#3D4A2E", ring: "#E3C27A" },
    tagline: "Een abdij in de bergen, 1327. Een verboden boek, een gesloten bibliotheek, en een abt die de nacht niet overleeft.",
    intro: "Abdij van Sint-Aldric, winter 1327. De sneeuw sluit de bergpas af. Na het nachtgebed ligt abt Bertram in het scriptorium, met inkt aan zijn vingers.",
    victimName: "Abt Bertram", roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: "plavuizen",
    rooms: [
      { name: "Scriptorium", article: "het", color: "#F2C46D" }, { name: "Kapel", article: "de", color: "#E3B7D6" },
      { name: "Kruidentuin", article: "de", color: "#C7D9A0" }, { name: "Bibliotheek", article: "de", color: "#D9B48A" },
      { name: "Refter", article: "de", color: "#E8A798" }, { name: "Slaapzaal", article: "de", color: "#B3A1D6" },
      { name: "Kloostergang", article: "de", color: "#C9B79C" }, { name: "Kelder", article: "de", color: "#D0C9BD" },
      { name: "Keuken", article: "de", color: "#9FC8C8" }, { name: "Klokkentoren", article: "de", color: "#93A9C9" },
      { name: "Ziekenboeg", article: "de", color: "#8CC3DE" }, { name: "Bakkerij", article: "de", color: "#F3B57A" }
    ],
    furniture: [
      { id: "lessenaar", nl: "een schrijflessenaar",
        icon: "<g><path d=\"M10 36 l3 -16 M30 36 l-3 -16\" stroke=\"#7A5236\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M6 20 L34 14 L35 18 L7 24z\" fill=\"#8B6A46\" stroke=\"#3B2A1B\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/><path d=\"M10 18.5 L20 16.4 L21 10 L11 12z\" fill=\"#FAF5EF\" stroke=\"#8A7A60\" stroke-width=\"0.9\"/><path d=\"M20 16.4 L30 14.3 L29 8 L21 10z\" fill=\"#F3EDE3\" stroke=\"#8A7A60\" stroke-width=\"0.9\"/><path d=\"M28 9 q4 -6 6 -7\" stroke=\"#3B2A1B\" stroke-width=\"1\" fill=\"none\"/></g>" },
      { id: "kandelaar", nl: "een kandelaar",
        icon: "<g><path d=\"M14 36 h12 M20 36 v-20\" stroke=\"#4A4A4A\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M15 36 q5 -6 10 0\" fill=\"none\" stroke=\"#4A4A4A\" stroke-width=\"1.6\"/><rect x=\"16\" y=\"14\" width=\"8\" height=\"3\" rx=\"1\" fill=\"#4A4A4A\"/><rect x=\"17.5\" y=\"6\" width=\"5\" height=\"8\" fill=\"#F3EDE3\" stroke=\"#8A7A60\" stroke-width=\"0.9\"/><path d=\"M20 6 q-2 -3 0 -5 q2 2 0 5z\" fill=\"#F39C12\"/></g>" },
      { id: "bijenkorf", nl: "een bijenkorf",
        icon: "<g><path d=\"M8 32 q0 -24 12 -24 q12 0 12 24z\" fill=\"#D9B45A\" stroke=\"#7A5A1C\" stroke-width=\"1.3\"/><path d=\"M9 26 h22 M10.5 20 h19 M13.5 14 h13\" stroke=\"#9C7A1E\" stroke-width=\"1.2\"/><path d=\"M17 32 q3 -5 6 0z\" fill=\"#3B2A1B\"/><rect x=\"5\" y=\"32\" width=\"30\" height=\"3\" rx=\"1\" fill=\"#7A5236\"/><g fill=\"#F2C14E\" stroke=\"#3B2A1B\" stroke-width=\"0.6\"><ellipse cx=\"33\" cy=\"12\" rx=\"2\" ry=\"1.4\"/><ellipse cx=\"6\" cy=\"16\" rx=\"2\" ry=\"1.4\"/></g></g>" },
      { id: "vijzel", nl: "een vijzel",
        icon: "<g><path d=\"M24 6 L16 22\" stroke=\"#7A5236\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M8 20 h24 q-1 12 -12 12 q-11 0 -12 -12z\" fill=\"#BFC9D4\" stroke=\"#5A6470\" stroke-width=\"1.3\"/><path d=\"M14 32 h12 v3 h-12z\" fill=\"#8A97A3\" stroke=\"#5A6470\" stroke-width=\"1\"/><g fill=\"#5C8B5E\"><path d=\"M11 20 q1 -4 4 -4 q0 3 -4 4z\"/><path d=\"M29 20 q-1 -4 -4 -4 q0 3 4 4z\"/></g></g>" },
      { id: "zandloper", nl: "een zandloper",
        icon: "<g><path d=\"M13 8 h14 q0 6 -7 11 q-7 -5 -7 -11z M13 32 h14 q0 -6 -7 -11 q-7 5 -7 11z\" fill=\"#DCEBF0\" opacity=\"0.85\"/><path d=\"M14.5 12 h11 q-1 4 -5.5 7 q-4.5 -3 -5.5 -7z M14 32 q6 -8 12 0z\" fill=\"#E3C58E\"/><path d=\"M12 8 q0 7 7 12 q-7 5 -7 12 M28 8 q0 7 -7 12 q7 5 7 12\" fill=\"none\" stroke=\"#7A5236\" stroke-width=\"1.4\"/><rect x=\"10\" y=\"5\" width=\"20\" height=\"3\" rx=\"1\" fill=\"#7A5236\" stroke=\"#3B2A1B\" stroke-width=\"1\"/><rect x=\"10\" y=\"32\" width=\"20\" height=\"3\" rx=\"1\" fill=\"#7A5236\" stroke=\"#3B2A1B\" stroke-width=\"1\"/></g>" }
    ],
    suspects: [
      { label: "Broeder Anselm", gender: "m", color: "#B85C5C", who: "Bewaart de sleutels van de bibliotheek",
        look: "an elderly librarian monk in his sixties, tonsure, grey beard, black Benedictine habit, large key ring" },
      { label: "Broeder Cuthbert", gender: "m", color: "#5C8B5E", who: "Kweekt de kruiden en mengt de dranken",
        look: "a stout herbalist monk in his forties, tonsure, rosy cheeks, habit with rolled sleeves, a bundle of dried herbs" },
      { label: "Novice Elias", gender: "m", color: "#C2185B", who: "Kwam deze zomer naar de abdij",
        look: "a young novice of about eighteen, short hair, plain grey habit, nervous eyes, wax tablet" },
      { label: "Pelgrim Gisela", gender: "f", color: "#B8955C", who: "Op weg naar Rome, gestrand door de sneeuw",
        look: "a pilgrim woman in her thirties, wide-brimmed hat with a scallop shell, travelling cloak, wooden staff" },
      { label: "Kruidenvrouw Hilde", gender: "f", color: "#8B5CB8", who: "Komt uit het dorp met kruiden voor de zieken",
        look: "a village herb woman in her fifties, linen head cloth, weathered face, basket of herbs" },
      { label: "Gravin Mathilde", gender: "f", color: "#5C7AB8", who: "Betaalt de abdij en wil er iets voor terug",
        look: "a noble countess in her forties, fur-trimmed mantle, jewelled circlet over a veil, proud gaze" },
      { label: "Verluchtster Odile", gender: "f", color: "#2C3E50", who: "Schildert de gouden letters in de boeken",
        look: "a young illuminator of manuscripts in her twenties, ink-stained fingers, plain wimple, fine brush in hand" },
      { label: "Kelderbroeder Waldo", gender: "m", color: "#D9A441", who: "Beheert de voorraden en de kelder",
        look: "a burly cellarer monk in his fifties, tonsure, heavy jaw, leather apron over the habit, keys at his belt" }
    ],
    parts: [
      ["De dode abt", "Na het nachtgebed ligt abt Bertram in het scriptorium, met inkt aan zijn vingers."],
      ["Het verboden boek", "Eén boek mag niemand lezen. Iemand heeft het gelezen."],
      ["De kruidentuin", "Elk kruid geneest. Bijna elk kruid."],
      ["De lange winter", "De pas is dicht tot het voorjaar. De kelder wordt elke week leger."],
      ["Het bezoek van de bisschop", "De bisschop komt een nieuwe abt kiezen. Niet iedereen wil dat hij aankomt."],
      ["Vuur in het scriptorium", "Perkament brandt snel. Eén boek is gered, door de verkeerde."],
      ["De pelgrims", "Twaalf pelgrims vragen om onderdak. Elf vertrekken weer."],
      ["Het laatste getijde", "Het voorjaar komt. Nog één nacht in de kloostergang."]
    ],
    outro: "De klok luidt voor het avondgebed. Het boek staat weer op zijn plank."
  },
  {
    id: "vuurtoren", nr: 16, unlock: 56, portraits: true, icon: "🌊", title: "Vuurtoren Grauwkaap", short: "Vuurtoren",
    era: "a lighthouse island off a stormy coast in 1900",
    map: { accent: "#2A4D69", ring: "#F5E6B8" },
    tagline: "1900. Een eiland, een storm van drie dagen, en een vuurtoren die voor het eerst in twintig jaar donker is.",
    intro: "Vuurtoren Grauwkaap, november 1900. Een storm sluit het eiland af van de wal. Om middernacht gaat het licht uit. Boven in de lantaarnkamer ligt wachter Silas Mourne.",
    victimName: "Vuurtorenwachter Silas Mourne", roomWord: 'ruimte', roomWordPlural: 'ruimtes', floor: "kasseien",
    rooms: [
      { name: "Lantaarnkamer", article: "de", color: "#F2C46D" }, { name: "Wenteltrap", article: "de", color: "#D0C9BD" },
      { name: "Wachtershuis", article: "het", color: "#E8A798" }, { name: "Steiger", article: "de", color: "#D9B48A" },
      { name: "Botenhuis", article: "het", color: "#9FCBA8" }, { name: "Seinkamer", article: "de", color: "#B3A1D6" },
      { name: "Klif", article: "het", color: "#C9B79C" }, { name: "Strand", article: "het", color: "#EBD7A6" },
      { name: "Keuken", article: "de", color: "#9FC8C8" }, { name: "Kelder", article: "de", color: "#93A9C9" },
      { name: "Werkplaats", article: "de", color: "#C7D9A0" }, { name: "Voorraadkamer", article: "de", color: "#E3B7D6" }
    ],
    furniture: [
      { id: "boei", nl: "een reddingsboei",
        icon: "<g><circle cx=\"20\" cy=\"20\" r=\"14.5\" fill=\"none\" stroke=\"#C9A227\" stroke-width=\"0.9\" stroke-dasharray=\"2 2\"/><path d=\"M20 7 a13 13 0 1 0 0.01 0z M20 13.5 a6.5 6.5 0 1 1 -0.01 0z\" fill-rule=\"evenodd\" fill=\"#FAF5EF\"/><circle cx=\"20\" cy=\"20\" r=\"9.75\" fill=\"none\" stroke=\"#B3261E\" stroke-width=\"6.5\" stroke-dasharray=\"7.66 7.66\"/><circle cx=\"20\" cy=\"20\" r=\"13\" fill=\"none\" stroke=\"#3B2A1B\" stroke-width=\"1.3\"/><circle cx=\"20\" cy=\"20\" r=\"6.5\" fill=\"none\" stroke=\"#3B2A1B\" stroke-width=\"1.3\"/></g>" },
      { id: "fuik", nl: "een kreeftenfuik",
        icon: "<g><path d=\"M5 30 V20 q15 -14 30 0 V30z\" fill=\"#C7A06A\" stroke=\"#7A5236\" stroke-width=\"1.3\"/><path d=\"M10 30 V16 M15 30 V12.5 M20 30 V11 M25 30 V12.5 M30 30 V16 M5 25 h30\" stroke=\"#7A5236\" stroke-width=\"1\"/><rect x=\"4\" y=\"30\" width=\"32\" height=\"3\" rx=\"1\" fill=\"#7A5236\"/><path d=\"M30 22 q4 -4 7 -2 M31 25 q4 -2 6 0\" stroke=\"#B3261E\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"/></g>" },
      { id: "misthoorn", nl: "een misthoorn",
        icon: "<g><path d=\"M14 22 v12 M10 36 h12\" stroke=\"#3B2A1B\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><path d=\"M8 18 L30 10 V30 L8 22z\" fill=\"#C9A227\" stroke=\"#7A5A1C\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><ellipse cx=\"30\" cy=\"20\" rx=\"3.5\" ry=\"10\" fill=\"#E0B95A\" stroke=\"#7A5A1C\" stroke-width=\"1.2\"/><rect x=\"4\" y=\"17\" width=\"5\" height=\"6\" rx=\"1\" fill=\"#7A5236\" stroke=\"#3B2A1B\" stroke-width=\"1\"/></g>" },
      { id: "stormlamp", nl: "een stormlamp",
        icon: "<g><path d=\"M15 9 q5 -5 10 0\" fill=\"none\" stroke=\"#3B2A1B\" stroke-width=\"1.6\"/><rect x=\"13\" y=\"9\" width=\"14\" height=\"4\" rx=\"1\" fill=\"#B3261E\" stroke=\"#5A1A12\" stroke-width=\"1\"/><path d=\"M14 13 q-3 9 0 16 h12 q3 -7 0 -16z\" fill=\"#F5E6B8\" stroke=\"#3B2A1B\" stroke-width=\"1.2\"/><path d=\"M20 18 q-3 4 0 8 q3 -4 0 -8z\" fill=\"#F39C12\"/><path d=\"M14 13 v16 M26 13 v16\" stroke=\"#B3261E\" stroke-width=\"1.6\"/><rect x=\"12\" y=\"29\" width=\"16\" height=\"5\" rx=\"1.5\" fill=\"#B3261E\" stroke=\"#5A1A12\" stroke-width=\"1\"/></g>" },
      { id: "verrekijker", nl: "een verrekijker",
        icon: "<g><path d=\"M8 36 L18 24 M28 36 L18 24 M18 24 v12\" stroke=\"#7A5236\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><path d=\"M6 20 L32 10 L34 15 L8 25z\" fill=\"#C9A227\" stroke=\"#7A5A1C\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/><path d=\"M14 17.2 L15.6 21.8 M24 13.4 L25.6 18\" stroke=\"#7A5A1C\" stroke-width=\"1.4\"/><circle cx=\"33\" cy=\"12.5\" r=\"2.4\" fill=\"#DCEBF0\" stroke=\"#7A5A1C\" stroke-width=\"1\"/></g>" }
    ],
    suspects: [
      { label: "Assistent Jonas", gender: "m", color: "#B85C5C", who: "Hielp de wachter, al drie jaar",
        look: "a young assistant lighthouse keeper in his twenties, knitted sweater, peaked cap, oil can in hand" },
      { label: "Huishoudster Martha", gender: "f", color: "#5C8B5E", who: "Kookt en poetst in het wachtershuis",
        look: "a sturdy housekeeper in her fifties, bonnet, shawl, apron, firm mouth" },
      { label: "Visser Bartel", gender: "m", color: "#C2185B", who: "Vist rond het eiland sinds zijn tiende",
        look: "a weathered fisherman in his sixties, oilskin sou'wester hat, white beard, pipe" },
      { label: "Loodsman Kees", gender: "m", color: "#B8955C", who: "Brengt schepen veilig de haven in",
        look: "a harbour pilot in his forties, navy pea coat with brass buttons, captain's cap, spyglass" },
      { label: "Vogelkundige Dorien", gender: "f", color: "#8B5CB8", who: "Telt de zeevogels voor een museum",
        look: "an ornithologist in her thirties, tweed jacket, field glasses, a feather in her hat band, notebook" },
      { label: "Schipbreukeling Lev", gender: "m", color: "#5C7AB8", who: "Spoelde aan na de storm, zonder papieren",
        look: "a shipwreck survivor in his thirties, wet tousled hair, torn shirt, a blanket around his shoulders" },
      { label: "Onderwijzeres Wilma", gender: "f", color: "#2C3E50", who: "Leert de vissersjongens lezen",
        look: "the island schoolteacher in her forties, hair in a tight bun, high-collared blouse, spectacles on a chain" },
      { label: "Telegrafiste Fien", gender: "f", color: "#D9A441", who: "Seint elk bericht naar de wal",
        look: "a young telegraph operator in her twenties, short curls, waistcoat, sleeve garters, a telegraph key in front of her" }
    ],
    parts: [
      ["Het licht gaat uit", "Om middernacht gaat het licht uit. Boven in de lantaarnkamer ligt de wachter."],
      ["De schipbreuk", "In de storm loopt een schip op de rotsen. Eén man spoelt aan."],
      ["De mist", "Drie dagen mist. De misthoorn blaast elk kwartier, en één keer te vaak."],
      ["Het logboek", "Elke nacht schreef de wachter in het logboek. De laatste bladzijde is eruit gescheurd."],
      ["De bevoorradingsboot", "Eens per maand komt de boot. Deze keer neemt hij iets mee terug."],
      ["De vogeltrek", "Duizenden vogels rusten op het eiland. Eén van de vogelaars rust niet."],
      ["De winterstorm", "De zwaarste storm in twintig jaar. Het eiland is drie weken afgesloten."],
      ["Het laatste licht", "Er komt een nieuwe wachter. Nog één nacht onder het draaiende licht."]
    ],
    outro: "Het licht draait weer. Elke schipper ziet het, en jij weet wie het doofde."
  }
];

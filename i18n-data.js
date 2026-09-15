// ============================================================
// I18N-DATA — Engelse vertalingen van de spelinhoud (werelden,
// titels, medailles, opdrachten, Van Dam). De zaken van de
// campagne staan in i18n-campaign.js. Bij taal "en" worden de
// Nederlandse gegevens bij het opstarten ter plekke vervangen
// (I18n.localizeData), zodat de rest van de code niets hoeft te weten.
// ============================================================

const I18N_DATA = {
  ranks: { Rekruut: 'Recruit', Speurder: 'Sleuth', Rechercheur: 'Detective', Inspecteur: 'Inspector', Hoofdinspecteur: 'Chief Inspector', Meesterdetective: 'Master Detective' },
  difficulty: { makkelijk: 'Easy', gemiddeld: 'Medium', moeilijk: 'Hard' },
  themes: {
    landhuis: {
      title: 'The Manor', short: 'Manor', victimName: 'Dr. Edward Blackwood', roomWord: 'room', roomWordPlural: 'rooms',
      tagline: 'A dinner, a glass of Bordeaux, and a host who never gets up again.',
      intro: 'Blackwood Manor, 1927. After dinner the host stays in his chair. The glass is empty, the house full of secrets.',
      outro: 'The secrets of Blackwood Manor are on the table. The murderer is caught.',
      rooms: { Woonkamer: 'Living Room', Keuken: 'Kitchen', Eetkamer: 'Dining Room', Bibliotheek: 'Library', Slaapkamer: 'Bedroom', Badkamer: 'Bathroom', Garage: 'Garage', Hal: 'Hall', Wasruimte: 'Laundry', Studeerkamer: 'Study', Serre: 'Conservatory', Kelder: 'Cellar' },
      furniture: { plant: 'a plant', tv: 'a television', kast: 'a bookcase', stoel: 'an armchair', doos: 'a crate' },
      suspects: { 'Majoor Pike': 'Major Pike', 'Tante Agnes': 'Aunt Agnes' }
    },
    piraten: {
      title: 'The Pirate Ship', short: 'Pirate Ship', victimName: 'Captain Blackeye', roomWord: 'room', roomWordPlural: 'rooms',
      tagline: 'The captain is dead and nobody leaves the ship.',
      intro: 'The Black Gull lies becalmed on a mirror-flat sea. The captain does not answer. Nobody leaves the ship until the murderer is found.',
      outro: 'The Black Gull hoists her sails. The murderer stays in the brig.',
      rooms: { Kajuit: 'Cabin', Ruim: 'Hold', Kombuis: 'Galley', Dek: 'Deck', Kanonnendek: 'Gun Deck', Voorraadkamer: 'Storeroom', Slaapvertrek: 'Crew Quarters', Kaartenkamer: 'Chart Room', Brig: 'Brig', Stuurhut: 'Wheelhouse', Kapiteinshut: "Captain's Cabin", Kruitkamer: 'Powder Room', Voorsteven: 'Bow', Achtersteven: 'Stern' },
      furniture: { kanon: 'a cannon', ton: 'a barrel', schatkist: 'a treasure chest', touw: 'a coiled rope', lantaarn: 'a lantern' },
      suspects: { Roodbaard: 'Redbeard', 'Bootsman Vos': 'Boatswain Vos', 'Kok Ada': 'Cook Ada', 'Stuurman Kwint': 'Helmsman Kwint', 'Juffrouw Lark': 'Miss Lark', 'Kanonnier Bo': 'Gunner Bo', 'Dokter Sal': 'Doctor Sal', 'Scheepsjongen Nik': 'Cabin Boy Nik' }
    },
    hotel: {
      title: 'Grand Hotel Aurora', short: 'Grand Hotel', victimName: 'Hotel owner Valentijn Aurora', roomWord: 'room', roomWordPlural: 'rooms',
      tagline: 'At midnight the lights went out.',
      intro: "Grand Hotel Aurora, New Year's Eve. On the stroke of twelve the lights went out. When they came back, the owner lay on the marble floor.",
      outro: 'The lights of Grand Hotel Aurora go out. This time for good.',
      rooms: { Lobby: 'Lobby', Receptie: 'Reception', Restaurant: 'Restaurant', Balzaal: 'Ballroom', Bar: 'Bar', Keuken: 'Kitchen', Bibliotheek: 'Library', Spa: 'Spa', Wijnkelder: 'Wine Cellar', Suite: 'Suite', Wasserij: 'Laundry', Rookkamer: 'Smoking Room', 'Kamer 12': 'Room 12', Portiersloge: "Doorman's Lodge", Personeelskamer: 'Staff Room', Terras: 'Terrace', Salon: 'Salon' },
      furniture: { piano: 'a piano', koffer: 'a suitcase', palm: 'a palm', sofa: 'a sofa', trolley: 'a room-service trolley' },
      suspects: { 'Gravin Delacroix': 'Countess Delacroix', 'Portier Jansen': 'Doorman Jansen', 'Mevrouw Sato': 'Mrs Sato', 'Danseres Lou': 'Dancer Lou' }
    },
    ruimte: {
      title: 'Station Orion', short: 'Station Orion', victimName: 'Commander Ilse Varga', roomWord: 'module', roomWordPlural: 'modules',
      tagline: 'The airlocks are sealed. Everyone is still aboard.',
      intro: 'Space station Orion, 2189. The commander does not report for duty. Every airlock is sealed: the culprit is still aboard.',
      outro: 'The airlocks open again. The murderer flies home in handcuffs.',
      rooms: { Brug: 'Bridge', Laboratorium: 'Laboratory', Kantine: 'Canteen', Machinekamer: 'Engine Room', Slaapcabine: 'Sleeping Cabin', Luchtsluis: 'Airlock', Kas: 'Greenhouse', Ziekenboeg: 'Sick Bay', Opslag: 'Storage', Observatorium: 'Observatory', Werkplaats: 'Workshop' },
      furniture: { console: 'a console', capsule: 'a sleep pod', robot: 'a maintenance robot', krat: 'a crate', kweekbak: 'a grow tray' },
      suspects: { 'Piloot Reyes': 'Pilot Reyes', 'Ingenieur Sol': 'Engineer Sol', 'Kadet Yuki': 'Cadet Yuki', 'Kok Dima': 'Cook Dima', 'Officier Paz': 'Officer Paz', 'Bioloog Wren': 'Biologist Wren' }
    },
    museum: {
      title: 'The Museum', short: 'Museum', victimName: 'Chief Curator Adriaan Vos', roomWord: 'gallery', roomWordPlural: 'galleries',
      tagline: 'After closing time. Every door locked, one curator on the floor.',
      intro: 'The Vlierbeek Museum, at night. The alarm never went off, the doors were locked, and the chief curator lies among the statues. Whoever was inside is still inside.',
      outro: 'The alarm is switched back on. The culprit leaves, the collection stays.',
      rooms: { 'Egyptische Zaal': 'Egyptian Gallery', Schilderijenzaal: 'Painting Gallery', Dinozaal: 'Dinosaur Hall', Kluis: 'Vault', Werkplaats: 'Workshop', Museumwinkel: 'Museum Shop', Hal: 'Entrance Hall', Archief: 'Archive', Beeldentuin: 'Sculpture Garden', Depot: 'Depot', Kantoor: 'Office', 'Museumcafé': 'Museum Café' },
      furniture: { sarcofaag: 'a sarcophagus', schilderij: 'a painting', skelet: 'a dinosaur skeleton', vitrine: 'a display case', beeld: 'a statue' },
      suspects: { 'Gids Fenna': 'Guide Fenna', 'Restaurateur Imke': 'Restorer Imke', 'Nachtwaker Ruud': 'Night Guard Ruud', 'Kunsthandelaar Vic': 'Art Dealer Vic', 'Stagiair Noor': 'Intern Noor', 'Schoonmaker Piet': 'Cleaner Piet' }
    },
    trein: {
      title: 'The Night Train', short: 'Night Train', victimName: 'Conductor Leon Marchetti', roomWord: 'carriage', roomWordPlural: 'carriages',
      tagline: 'Twelve carriages, one tunnel, and a conductor who never finished his rounds.',
      intro: 'The night train to Vienna, 1934. In a tunnel the lights go out. When they come back, the conductor lies in the dining car. The next stop is not until six.',
      outro: 'At sunrise the train pulls into the station. One passenger steps off in handcuffs.',
      rooms: { Restauratiewagen: 'Dining Car', Salonwagen: 'Lounge Car', 'Coupé A': 'Compartment A', 'Coupé B': 'Compartment B', Bagagewagen: 'Luggage Car', Keukenwagen: 'Kitchen Car', Postwagen: 'Mail Car', Barwagen: 'Bar Car', Kolenwagen: 'Coal Tender', Dienstruimte: 'Staff Room', Locomotief: 'Locomotive', Balkon: 'Rear Platform' },
      furniture: { hutkoffer: 'a steamer trunk', samovar: 'a samovar', grammofoon: 'a gramophone', bank: 'a bench seat', kroonluchter: 'a chandelier' },
      suspects: { 'Barones Von Stahl': 'Baroness Von Stahl', 'Goochelaar Otto': 'Magician Otto', 'Schaakmeester Ivo': 'Chess Master Ivo', 'Verpleegster Ans': 'Nurse Ans', 'Reiziger Sami': 'Traveller Sami', 'Actrice Lola': 'Actress Lola', 'Weduwe Duval': 'Widow Duval' }
    },
    circus: {
      title: 'The Circus', short: 'Circus', victimName: 'Director Ferdinand Zano', roomWord: 'area', roomWordPlural: 'areas',
      tagline: 'The show is over, the tent is closing, and the director lies in the ring.',
      intro: 'Circus Zano, last show of the season. The audience has gone home, the tent is closing, and Director Zano lies in the sawdust of the ring. Every performer is still here.',
      outro: 'The tent comes down. The sawdust is swept away, and with it the last trace.',
      rooms: { Piste: 'Ring', Tribune: 'Stands', Kleedwagen: 'Dressing Wagon', Dierentent: 'Animal Tent', Kassa: 'Box Office', Kantine: 'Canteen', Werkplaats: 'Workshop', Directiewagen: "Director's Wagon", Stalling: 'Stables', Kostuumwagen: 'Costume Wagon', Ingang: 'Entrance', Opslagtent: 'Storage Tent' },
      furniture: { circuskanon: 'a circus cannon', trapeze: 'a trapeze', spiegelkast: 'a mirror cabinet', popcornkar: 'a popcorn cart', kooi: "a lion's cage" },
      suspects: { 'Trapezeartiest Mira': 'Trapeze Artist Mira', 'Leeuwentemmer Kurt': 'Lion Tamer Kurt', 'Waarzegster Zora': 'Fortune Teller Zora', 'Sterke Man Boris': 'Strongman Boris', 'Kaartverkoper Els': 'Ticket Seller Els', 'Jongleur Teo': 'Juggler Teo', 'Dierenarts Nadia': 'Vet Nadia' }
    },
    skihut: {
      title: 'The Ski Lodge', short: 'Ski Lodge', victimName: 'Host Anton Berger', roomWord: 'room', roomWordPlural: 'rooms',
      tagline: 'An avalanche seals the valley. Seven guests, one stove, and a host who never warms up again.',
      intro: 'Edelweiss lodge, high in the Alps. An avalanche closes the only road. Inside: seven guests, one stove, and a host by the fire who never warms up again.',
      outro: 'The lodge is closed, the snow lies still again. You know what was underneath.',
      rooms: { Gelagkamer: 'Lounge', Keuken: 'Kitchen', Slaapzaal: 'Dormitory', Skiberging: 'Ski Room', Sauna: 'Sauna', Terras: 'Terrace', Kelder: 'Cellar', Zolder: 'Attic', Wasruimte: 'Laundry', Voorraadkamer: 'Pantry', Speelkamer: 'Games Room', Hal: 'Hall' },
      furniture: { kachel: 'a stove', slee: 'a sledge', skirek: 'a ski rack', gewei: 'a set of antlers', fondue: 'a fondue pot' },
      suspects: { 'Skilerares Mieke': 'Ski Instructor Mieke', 'Bergredder Tom': 'Mountain Rescuer Tom', 'Toeriste Hana': 'Tourist Hana', 'Kok Luigi': 'Cook Luigi', 'Fotograaf Sven': 'Photographer Sven', 'Dokter Greet': 'Doctor Greet', 'Jongen Kai': 'Young Kai', 'Berggids Ilse': 'Mountain Guide Ilse' }
    }
  },
  daily: [
    'Poisonous Herbs', 'The Empty Glass', 'The Stopped Clock', 'A Wet Coat', 'The Wrong Key',
    'Silence After Twelve', 'The Broken Lock', 'The Last Witness', 'Footsteps Upstairs', 'The Open Drawer',
    'The Missing Knife', 'Two Cups of Tea', 'The Forgotten Letter', 'Smoke Without Fire', 'The Double Alibi',
    'The Cold Stove', 'A Door Ajar', 'The Swapped Coat', 'The Silent Staff', 'The Empty Chair',
    'Tracks in the Dust', 'The Late Visit', 'The Drawn Curtains', 'One Name Too Many', 'The Crooked Painting',
    'The Missing Glove', 'Midnight Minus One', 'The Second Key', 'The Broken Glass', 'The Last Round'
  ],
  week: {
    landhuis: ['The Mystery of the Wills', 'The Night of the Three Clocks', 'The Secret of the East Wing', 'The Dinner of Liars'],
    piraten:  ['The Plot in the Galley', 'Mutiny on the Black Gull', 'The Map with Two Crosses', 'The Curse of the Empty Barrel'],
    hotel:    ['The Code of Room 404', 'The Last Key of Aurora', 'The Masked Ball', 'The Guest Who Never Checked Out'],
    ruimte:   ['The Signal from Sector 7', 'The Dome of Orion', 'The Airlock That Opened Itself', 'The Log Without a Last Line'],
    museum:   ['The Night of the Sarcophagus', 'The Painting That Looked Back', 'The Case Without Glass', 'The Secret of Gallery 7'],
    trein:    ['The Four-Minute Tunnel', 'The Ticket Without a Name', 'The Locked Compartment', 'The Last Stop Before Vienna'],
    circus:   ['The Act Without Applause', 'The Cannon That Fired Late', 'The Clown with Two Faces', 'The Night the Tent Fell Silent'],
    skihut:   ['The Stove That Went Out', 'Tracks That Never Came Back', 'The Night of the Second Avalanche', 'The Last Guest of Edelweiss']
  },
  medals: {
    'eerste-zaak': ['First Case', 'Solve your first case'],
    'drie-dagen': ['Three Days Running', 'Play the daily case three days in a row'],
    'zeven-dagen': ['Seven Days Running', 'Keep a seven-day streak'],
    'volle-week': ['Full Week', 'Play every day of the week, Monday to Sunday'],
    'zonder-hint': ['Ten Without a Hint', 'Solve ten cases without a single hint'],
    'snel': ['Quick Sleuth', 'Solve a case within a minute and a half'],
    'deel': ['First Part Complete', 'Finish a part of the campaign'],
    'landhuis': ['Blackwood Falls Silent', 'Finish every part of The Manor'],
    'piraten': ['Captain of the Gull', 'Finish every part of The Pirate Ship'],
    'hotel': ['Key to Aurora', 'Finish every part of Grand Hotel Aurora'],
    'ruimte': ['Orion Goes Dark', 'Finish every part of Station Orion'],
    'museum': ['Night Guard of Vlierbeek', 'Finish every part of The Museum'],
    'trein': ['Terminus', 'Finish every part of The Night Train'],
    'circus': ['The Tent Comes Down', 'Finish every part of The Circus'],
    'skihut': ['The Last Descent', 'Finish every part of The Ski Lodge'],
    'opdrachten': ['All Quests', 'Finish all three quests of a day'],
    'vrije-dag': ['Saved by a Streak Freeze', 'Let a streak freeze save your streak'],
    'vlekkeloos': ['Flawless', 'Earn three stars ten times in the campaign'],
    'archivaris': ['Archivist', 'Solve five archive files'],
    'weekzaak': ['Case of the Week', 'Solve a case of the week'],
    'verzamelaar': ['Collector', 'Collect 24 pieces of evidence in the cabinet'],
    'punten': ['Five Thousand Points', 'Collect 5000 points'],
    'meester': ['Master Detective', 'Reach the highest rank']
  },
  quests: {
    zaak: 'Solve a case', twee: 'Solve two cases', zonder: 'Solve a case without a hint', snel: 'Solve a case within three minutes',
    plaats: 'Place eight suspects', vink: 'Tick off three statements', dagelijks: 'Play the daily case', campagne: 'Play a campaign case',
    eenkeer: 'Name the culprit on the first try', sterren: 'Earn three stars in a case'
  },
  tips: {
    'same-row': 'Watch the statement about a row: a row runs from left to right, straight through the walls.',
    'same-col': 'A column runs from top to bottom across the whole floor plan. Walls do not count.',
    'left-of': '"Left of" is about the whole floor plan: one stands a column further left, in any room.',
    'above': '"Higher on the floor plan" means closer to the top, whatever the room.',
    'not-adjacent': '"Not directly next to" only rules out the four squares beside them. Diagonal does not count as next to.',
    'adjacent': '"Directly next to" is the square left, right, above or below. Never diagonal.',
    'alone': 'Whoever was alone in a room rules everyone else out of it. Handy for crossing off rooms.',
    'empty-room': 'An empty room according to the report: nobody needs trying there.',
    'pos': 'A corner touches two walls, "against a wall" touches one and "in the middle" touches none.',
    'room-pos': 'Look which corner or wall squares in that room are still free. Furniture often takes a few.',
    'room-with': 'A room "with a plant" can be a room with more furniture too. Find the plant first.',
    'next-to': 'Tap the statement: the furniture lights up. Only the squares beside it qualify.',
    'room-next': 'Room and furniture together: usually only one square is left.',
    'diff-room': 'Not in the same room: first pin down the person you know most about.',
    'same-room': 'Same room: find one room first, then you know the other one too.',
    'not-room': 'A "not in" crosses off a room. Combine it with the rule about the victim.',
    'room': 'The clearest statement: place this person first.',
    fallback: 'Start with the statement that leaves the least room.'
  },
  intros: {
    kamers: ['Rooms', 'A suspect tells you which room they were in. Find that room on the floor plan and put them somewhere inside it. Does someone say they were NOT somewhere? Then they can stand anywhere except in that room.'],
    hoeken: ['Corners and walls', 'Every room has three kinds of square. In a corner: the square touches two walls of the room (red in the picture). Against a wall: the square touches only one wall (gold). In the middle: the square touches no wall at all (green).'],
    meubels: ['Furniture', 'Directly next to a piece of furniture means: the square left, right, above or below it. Diagonal does not count. Not sure what something is? Tap it to see its name.'],
    samen: ['Together or alone', 'In the same room: put both of them in that one room. Not in the same room: put them in two different rooms. I was alone: nobody else may stand in that room.'],
    naast: ['Next to each other', 'Directly next to someone means: their squares touch on one side, left, right, above or below. Diagonal does not count. A wall in between is fine, as long as the squares are side by side.'],
    rijen: ['Rows and columns', 'A row runs from left to right across the whole floor plan. A column runs from top to bottom. On the same row can also mean in another room: walls do not count.'],
    links: ['Left and higher', 'Left of someone means: in a column further to the left, even if that is in another room. Higher than someone means: in a row closer to the top of the floor plan.'],
    leeg: ['Empty rooms', 'According to the report nobody was in that room. So put nobody there: you can skip that room entirely.']
  },
  reactWrong: ['Me? Never!', "You can't be serious.", "I wasn't even there!", 'Ask the others.', 'Look at the floor plan again.'],
  reactRight: ['… How did you know?', '… Fine. It was me.', 'I almost got away with it.', '… You saw right through me.'],
  archiveStories: [
    'An old file from the archive. The facts are cold, the question is not.',
    'Nobody ever closed this case. Until now.',
    'The witnesses disagree. The floor plan does not.',
    'The report was short. Too short.',
    'Everyone had an alibi. One of them did not hold.',
    'The file lay at the bottom of the pile. For a reason.',
    "The culprit's name is crossed out. You fill it in again.",
    'Solved, according to the archive. Not according to the facts.'
  ],
  mentorName: 'Inspector Van Dam',
  boardTutorial: [
    'Statement 1: Clara was in the Living Room, in a corner. Three corners are taken by furniture, so one is left. Drag Clara to the glowing square, or tap it.',
    'Statement 2: Marcus stood directly next to a plant. Only one square next to the plant is free. Drag Marcus there, or tap it.',
    'Everyone is in place. Tap Check.',
    'The rule: only the murderer was in the room of the victim. Marcus is in the Kitchen — choose Marcus.'
  ]
};

if (typeof module !== 'undefined' && module.exports) module.exports = { I18N_DATA };

# Translation task 1.6 — worlds 17-24

Your task message names the language and the file number N: **24** for SS Halcyon, Ryokan Tsukikage, Fazenda Boa
Esperança and the Airship Cirrus (worlds 17-20), **25** for Southern Cross Station, the Zvezdin Palace, Twiga Lodge and
Hanok Dalbit (worlds 21-24). You add those four worlds to **one** existing language pack of Crimson Ledger. Everything
else in that pack is done and must stay as it is. Read `docs/TRANSLATION-BRIEF.md` first (rules for logic, gaps, names,
tone, length, grammar); the 1.4 brief (`docs/werelden/VERTAALOPDRACHT-1.4.md`) shows how the previous worlds were done.

## Source

`docs/werelden/bron-1.6.json` holds everything to translate for all eight worlds, Dutch (source) and English (reference)
side by side: per world the theme texts, 12 rooms (with the Dutch article), 5 or 6 pieces of furniture, 8 suspects (with
gender and a short description of who they are and how they look, for context only), 4 weekly case titles, 1 medal, and
8 campaign parts of 8 cases each. The same Dutch is in `themes.js`, `campaign.js` and `progress.js`; English is in
`i18n/en.js`. Translate only the four worlds of your number.

## Where to write

The work folder `i18n/.work/<code>/` is not in git (it lives in the main checkout). Work on a checkout that already
contains worlds 17-24 (`themes.js`, `campaign.js`, `progress.js`, `i18n/en.js` with the new worlds); if you work in a
separate worktree, copy `i18n/.work/<code>/` there first. Add three new files with your number N and do not edit the
existing ones:

| File | Contents |
|---|---|
| `data.N.js` | `{ themes: { <world>: {…}, … }, week: { <world>: [4], … }, medals: { <world>: [title, hint], … } }` |
| `campaign.N.js` | `{ <world>: [...], '<world>-2': [...], … '<world>-8': [...] }` for each world, each `[title, intro, outro, briefing, [[case title, story, item] × 8]]` |
| `grammar.N.js` | `{ rooms: { <world>: {…}, … }, furniture: { <id>: {…} for each new piece }, roomWords: { <world>: {…}, … } }` |

Each world in `data.N.js` has exactly the keys your pack already uses for `skihut`: `title, short, victimName,
roomWord, roomWordPlural, tagline, intro, outro, rooms, furniture, suspects, suspectShort`, plus `suspectRef` if your
pack has it for other worlds. Keys of `rooms`, `suspects`, `suspectShort`, `suspectRef` are the Dutch names; keys of
`furniture` are the ids.

`grammar.N.js` must give **every form your templates use** for each new room, piece of furniture and room word. Copy the
shape from your own `grammar.*.js` (look at how `skihut` rooms, `kachel`/`fondue` and `roomWords.skihut` are written) and
fill in every key. If your pack defines no per-room forms (like English), add only what it defines for other worlds.
The room word is `ruimte` for Oceaanstomer, Ryokan, Fazenda, Zeppelin, Poolstation and Safarilodge, and `kamer` for
Winterpaleis and Hanok: give `roomWords` for all four worlds of your number. Room names that already exist in other worlds
(Balzaal, Bibliotheek, Kapel, Keuken, Eetzaal, Gastenkamer, Kruidentuin, Poort, Slaaptent, Donkere kamer, Kampvuur,
Trappenhuis, Garderobe …; the source lists every room): reuse your existing translation and forms for them, unless the
world needs another word (an airship's Salon is a lounge, a fazenda's Salon a parlour).

Then build and check:

1. `node build-pack.js <code>`
2. `node tests/i18n-packs.test.js <code>` — must end with all checks passed (no missing forms, no Dutch left in
   sentences, every suspect named, every short name present). With only one of the two rounds done, leave the other four
   worlds out: `I18N_SKIP_WORLDS=poolstation,winterpaleis,safarilodge,hanok node tests/i18n-packs.test.js <code>` after
   round 24, or `I18N_SKIP_WORLDS=oceaanstomer,ryokan,fazenda,zeppelin …` if 25 comes first.
3. `node tests/grammar-snapshot.js i18n/.work/<code>/sentences-N.json <code>` and read at least 80 generated
   sentences that mention the new rooms, furniture or suspects (all four worlds, statements, clues, hints, Van Dam's
   explanations): grammar, gender agreement with the speaker, natural word order, unchanged logic. Fix and repeat.
4. `node store/iap-texts.js` once both rounds are in: the world title is also the name of the in-app purchase and must
   fit in 30 characters (the script stops on anything longer).
5. Add a short section `## 1.6 <world names>` to `i18n/.work/<code>/notes.md`: your choices for room names,
   titles of the suspects, anything a reviewer should check.

Do not edit any file outside `i18n/.work/<code>/` except the rebuilt `i18n/<code>.js`. Do not commit.

## General notes for 1.6

- **Short names.** `suspectShort` is the given name without the title, in your script. Within a world every short name
  starts with a different letter in Dutch and English (`tests/names.test.js`); keep them easy to tell apart in your
  script too.
- **Room labels** are printed on the floor plan: short (≤ 12 Latin characters, ≤ 6 CJK). World `short` names are the
  tabs above the map: keep them as short as your other worlds' tabs.
- **Items** (third element of each case): keep the emoji, translate only the words after it.
- **Campaign tone**: short, dry sentences; one idea per sentence; keep every number and every fact. A story may
  mention a room or a person; it never changes the puzzle.
- Part titles start with your existing word for "Part" and the Roman numeral, exactly like your other parts.
- Parts VI-VIII are mostly master cases; their briefings repeat advice your pack already phrases for the 1.3 parts
  (pencil, big nine-by-nine board, empty rooms): reuse your wording.

## Content notes: SS Halcyon, Ryokan Tsukikage, Fazenda Boa Esperança, the Airship Cirrus (N = 24)

- **Names.** Keep the given names: Grant, Molly, Solange, Lund, Harriet, Arthur, Doyle, Edna (victim Ambrose Kingsley);
  Fumiko, Takeshi, Chiyo, Isamu, Sachiko, Goro, Evelyn, Hiroshi (victim Genzo Kurata); Celeste, Joaquim, Giulia,
  Bento, Zélia, Hideo, Mulder, Lúcia (victim Augusto Valadares); Brandt, Daisy, Mateus, Liv, Rudi, Josette, Vidal,
  Elsbeth (victim Anton Falk). Latin-script languages keep the accents. Japanese writes the Japanese names as a
  Japanese reader expects them (kanji with the obvious reading, or kana if unsure); Chinese and Korean write them as
  they usually write Japanese names. Other scripts transliterate.
- **Titles.** Reder (shipowner, the victim's title), Kapitein (ship's captain), Stewardess, Vliegenierster (aviatrix,
  a woman pilot of 1910), Professor, Suffragette (keep the loanword where your language uses it), Marconist (wireless
  operator of 1910), Hoofdmachinist (chief engineer of a ship), Hoedenmaakster (milliner, female); Herbergier
  (innkeeper, victim), Gastvrouw (hostess of the inn), Kok (chef of the inn's kitchen), Theemeesteres (tea-ceremony
  master, female), Ingenieur (railway engineer), Fotografe (photographer, female), Tuinman (gardener), Plantkundige
  (botanist, female), Prentmaker (woodblock printmaker); Koffiebaron (coffee baron, victim), Dona (Portuguese
  honorific: keep it where your language knows Dona/Doña, as with Doña Inés), Rentmeester (estate overseer), Lerares
  (schoolteacher, female), Koffieproever (coffee taster and grader), Pianiste (pianist, female), Agronoom (agronomist),
  Inkoper (coffee buyer for a roaster), Dokter (country doctor, female); Constructeur (the airship's designer, victim),
  Commandant (airship commander), Verslaggeefster (reporter, female), Navigator, Weerkundige (meteorologist, female),
  Monteur (engine mechanic), Tennisster (tennis star, female), Diplomaat, Postmeesteres (postmistress).
- **Rooms.** Promenadedek = promenade deck (outdoor: pick the natural preposition), Rookkamer = smoking room, Eetzaal =
  dining saloon, Suite, Machinekamer = engine room, Brug = the ship's bridge (not a river bridge), Radiokamer = radio
  room (also in Zeppelin and Poolstation), Kombuis = galley, Ruim = cargo hold, Serre = palm court; Onsen = hot-spring
  bath (keep "onsen" if your language knows it), Theehuis = tea house in the garden, Tuin = garden, Hal = entrance hall,
  Bamboebos = bamboo grove, Steiger = jetty on the river, Wasruimte = washroom; Droogvloer = coffee drying terrace
  (outdoor), Koffieveld = coffee field (outdoor), Pakhuis = warehouse, Branderij = roastery, Salon = parlour;
  Salon = the airship's lounge, Slaapcabine = sleeping cabin, Kaartenkamer = chart room, Stuurgondel = control car
  (the gondola under the hull where the ship is steered), Motorgondel = engine car, Loopbrug = catwalk inside the hull,
  Postkamer = mail room, Uitkijkpost = lookout on top of the hull.
- **Furniture.** stuurrad = ship's wheel, scheepstelegraaf = engine-order telegraph, dekstoel = deckchair, scheepsbel =
  ship's bell, hoedendoos = hatbox; steenlantaarn = stone garden lantern, tetsubin = cast-iron teapot, byobu = golden
  folding screen, bonsai, wagasa = oiled-paper parasol, futon; koffiezak = jute coffee sack, koffiemolen = coffee
  grinder, koffiestruik = coffee bush, papegaai = parrot (a macaw), schommelstoel = rocking chair; luchtschroef =
  propeller, sextant, postzak = mailbag, wereldbol = globe, schrijfmachine = typewriter.
- **Words in the stories.** Halley's comet (May 1910), the purser and his safe, tussendek = steerage, emigrants,
  Long Island; tatami, geta, dango, a raku bowl, sake, moon viewing; the feast of São João with a bonfire and a
  quadrille, choro (Brazilian music), Santos and Campinas, guilders, corn cake; the line-crossing ceremony at the
  equator (the commander as Neptune), Sugarloaf Mountain, the mooring mast. Use what your language calls them.

## Content notes: Southern Cross Station, the Zvezdin Palace, Twiga Lodge, Hanok Dalbit (N = 25)

- **Names.** Keep the given names: Ole, Marina, Kenji, Nancy, Rewi, Lieve, Diego, Hélène (victim Gunnar Holm; the
  stories also name the dog Kaho); Jelena, Sergej, Vera, Pavel, Mabel, Dmitri, Fjodor, Irina (victim Andrej Zvezdin:
  Russian writes these in Cyrillic, other languages in their usual transliteration of Russian names); Wambui, Otieno,
  Njeri, Kiprono, Hamisi, Amina, Felix, Birgit (victim Rupert Vane); Kang, Sang-u, Ok-hwa, Dae-ho, Yeon-i, Hak-su,
  Bok-sun, Man-sik (victim Yun Jae-ho: Korean writes these in Hangul, Chinese and Japanese as they usually write
  Korean names, others transliterate). "Yun Jae-ho" is family name first.
- **Titles.** Stationsleider (station leader, victim), Marconist (radio operator), Glaciologe (glaciologist, female),
  Dokter (expedition doctor), Meteorologe (meteorologist, female), Hondenmenner (dog handler / musher), Monteur
  (mechanic — here a woman, Lieve), Kok (cook), Natuurkundige (physicist, female); Graaf (count, victim), Gravin
  (countess, keep as in your other worlds), Componist, Schaatsster (figure skater, female), Goudsmid (goldsmith),
  Gouvernante (governess), Luitenant (lieutenant of the guards), Hofmeester (major-domo of the palace); Natuurfilmer
  (wildlife filmmaker, victim), Eigenares (owner of the lodge, female), Gids (safari guide), Dierenarts (wildlife vet,
  female), Piloot (bush pilot), Chef (chef), Journaliste (journalist, female), Geluidsman (sound recordist), Biologe
  (biologist, female); Heer (the lord of the house, a scholar-noble, victim), Vrouwe (lady of the house), Student
  (scholar studying for the state examination), Geneesvrouw (woman healer and physician), Schilder (painter), Borduurster
  (embroiderer, female), Tolk (court interpreter), Kokkin (head cook, female, keep as in Hacienda), Marskramer
  (travelling peddler).
- **Rooms.** Kennel = dog kennel, Laboratorium, Kantine = mess hall, Slaapzaal = bunk room, Machinekamer = generator
  room, Ziekenboeg = sickbay, Weerhut = weather hut, Observatorium, Sneeuwtunnel = tunnel under the snow between the
  huts; IJsbaan = ice rink on a frozen pond (outdoor), Serre = winter garden, Spiegelzaal = hall of mirrors,
  Trappenhuis = grand staircase (as in Opera), Garderobe = cloakroom, Koetshuis = coach house; Waterpoel = waterhole
  (outdoor), Kampvuur = the campfire area (outdoor), Slaaptent = sleeping tent, Landingsbaan = airstrip (outdoor),
  Uitkijktoren = lookout tower, Donkere kamer = darkroom, Kantoor = office; Binnenplaats = courtyard, Theekamer = tea
  room, Paviljoen = pavilion by the pond, Voorouderhal = ancestral hall (shrine of the ancestors), Kruikenterras =
  terrace of earthenware kimchi jars (outdoor).
- **Furniture.** zender = radio set, sledehond = sled dog, weerballon = weather balloon, sneeuwrups = snowcat (a
  tracked snow vehicle), microscoop = microscope; balalaika, matroesjka = matryoshka doll, juwelenei = jewelled egg
  (no brand name), schaatsen = a pair of skates, ijszwaan = ice sculpture of a swan, kaviaar = bowl of caviar;
  safariwagen = safari truck, klamboe = mosquito net, windzak = windsock, acacia = acacia tree, giraf = wooden giraffe
  carving, sisalmand = woven sisal basket; gayageum = Korean zither (keep the word), kimchipot = kimchi jar, janggu =
  "een trom" in Dutch, an hourglass drum, maanvaas = moon jar (round white porcelain), inktsteen = inkstone, theetafel =
  small tea table.
- **Keep as they are**, written as your language writes them: Chuseok, songpyeon, tteokguk, yut, Seollal, hanji,
  Hanyang (old Seoul), Jamhuri Day (Kenya's independence day, 12 December), benga (Kenyan music), mate (the drink),
  reels 39 and 40 ("rol 39 en 40"); the item 🇰🇪 Keniaanse vlag is the flag of Kenya. Twiga Lodge is Kenyan-owned:
  no colonial words for the staff or the guests.

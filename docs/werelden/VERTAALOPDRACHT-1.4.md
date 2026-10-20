# Translation task 1.4 — new worlds

Your task message names the worlds, the source file and the file number N (20 for Hacienda and Opera, 21 for the
Tomb of Nefer-Ankh and Casino Azur, and so on). You add those worlds to **one** existing language pack of Crimson Ledger. Everything else in that pack is done
and must stay as it is. Read `docs/TRANSLATION-BRIEF.md` first (rules for logic, gaps, names, tone, length, grammar).

## Source

The source file (`docs/werelden/bron-1.4.json` for worlds 9-10, `docs/werelden/bron-<world>-<world>.json` after that) holds everything to translate, Dutch (source) and English (reference) side by side:
per world the theme texts, 12 rooms (with the Dutch article), 5 pieces of furniture, 8 suspects (with gender and a
short description of who they are and how they look, for context only), 4 weekly case titles, 1 medal, and 8 campaign
parts of 8 cases each. The same Dutch is in `themes.js`, `campaign.js` and `progress.js`; English is in `i18n/en.js`.

## Where to write

Only in `i18n/.work/<code>/`. Add three new files with your number N and do not edit the existing ones:

| File | Contents |
|---|---|
| `data.N.js` | `{ themes: { <world>: {…}, … }, week: { <world>: [4], … }, medals: { <world>: [title, hint], … } }` |
| `campaign.N.js` | `{ <world>: [...], '<world>-2': [...], … '<world>-8': [...] }` for each world, each `[title, intro, outro, briefing, [[case title, story, item] × 8]]` |
| `grammar.N.js` | `{ rooms: { <world>: {…}, … }, furniture: { <id>: {…} for each new piece }, roomWords: { <world>: {…}, … } }` |

Each world in `data.N.js` has exactly the keys your pack already uses for `skihut`: `title, short, victimName,
roomWord, roomWordPlural, tagline, intro, outro, rooms, furniture, suspects, suspectShort`, plus `suspectRef` if your
pack has it for other worlds. Keys of `rooms`, `suspects`, `suspectShort`, `suspectRef` are the Dutch names; keys of
`furniture` are the ids.

`grammar.N.js` must give **every form your templates use** for each new room, piece of furniture and room word. Copy the shape from your own `grammar.*.js` (look at how `skihut` rooms, `kachel`/`fondue` and
`roomWords.skihut` are written) and fill in every key. If your pack defines no per-room forms (like English), add only
what it defines for other worlds. Room names that already exist in other worlds (the source lists every room; check your own data files): reuse
your existing translation and forms for them.

Then build and check:

1. `node build-pack.js <code>`
2. `node tests/i18n-packs.test.js <code>` — must end with all checks passed (no missing forms, no Dutch left in
   sentences, every suspect named, every short name present).
3. `node tests/grammar-snapshot.js i18n/.work/<code>/sentences-N.json <code>` and read at least 80 generated
   sentences that mention the new rooms, furniture or suspects (both worlds, statements, clues, hints, Van Dam's
   explanations): grammar, gender agreement with the speaker, natural word order, unchanged logic. Fix and repeat.
4. Add a short section `## 1.4 <world names>` to `i18n/.work/<code>/notes.md`: your choices for room names,
   titles of the suspects, anything a reviewer should check.

## Content notes: Hacienda and Opera (N = 20)

- **Names.** Keep the given names (Inés, Rubén, Lupita, Esteban, Paloma, Tomás, Guzmán, Bárbara, Colette, Matteo,
  Armand, Ninon, Eloise, Viktor, Hugo, Simone; victims Don Rafael Ortega and Gaston Leclerc). Latin-script
  languages keep the Spanish and French accents. Other scripts transliterate as that script usually writes Spanish,
  Italian and French names. Translate titles and professions: Doña, Mariachi, Kokkin (cook, female), Voorman (field
  foreman), Schilderes (painter, female), Neef (nephew and heir), Notaris (notary), Zuster (nun, "Sister"), Diva,
  Tenor, Dirigent (conductor), Danseres (ballet dancer), Kostumière (seamstress of the costumes), Baron,
  Toneelmeester (stage manager who runs the ropes and trapdoors), Recensente (critic, female). Keep "Doña" and
  "Don" where your language knows them from Spanish; "Mariachi" stays a loanword.
- **Short names** (`suspectShort`): the given name without the title, in your script.
- **Room labels** are printed on the floor plan: short (≤ 12 Latin characters, ≤ 6 CJK). Loge is a private box in
  the auditorium; Coulisse is the wings/side stage; Toneelkelder is the space under the stage with the trapdoors;
  Kostuumatelier is the costume workshop; Stokerij is the tequila distillery; Klokkentoren is the bell tower of the
  hacienda chapel.
- **Furniture**: ketel is a copper still (tequila), toneelkijker are opera glasses, paspop is a dress form/tailor's
  dummy, pinata is a piñata.
- **Items** (third element of each case): keep the emoji, translate only the words after it.
- **Campaign tone**: short, dry sentences; one idea per sentence; keep every number and every fact. A story may
  mention a room or a person; it never changes the puzzle.
- Part titles start with your existing word for "Part" and the Roman numeral, exactly like your other parts
  (`'Часть I · …'`, `'Teil I · …'`).

## Content notes: the Tomb of Nefer-Ankh and Casino Azur (N = 21)

- **Names.** Keep the given names (Hartley, Rosamund, Maud, Ahmed, Ivy, Omar, Edith, Von Hagen; Marcel, Gigi, Delphine,
  Rocco, Sterling, Tess, Jack, Nora; victims Lord Edmund Ashcombe and Lorenzo Vitali; the queen Nefer-Ankh). "Von Hagen"
  is one short name (the particle stays). Translate titles: Professor, Lady (keep as in your Manor world), Tekenares
  (expedition artist, female), Opzichter (dig foreman), Correspondente (newspaper correspondent, female), Kameeldrijver
  (camel driver), Egyptologe (Egyptologist, female), Verzamelaar (antiquities collector); Croupier, Zangeres (singer,
  female), Erfgename (heiress), Coureur (racing driver), Bankier (banker), Fotomodel (fashion model), Gokker (gambler),
  Huisdetective (the casino's own house detective, female). "Eigenaar" (owner) is the victim's title.
- **Rooms.** Grafkamer = burial chamber, Voorkamer = antechamber, Schatkamer = treasury, Gang = corridor of the tomb,
  Werktent / Slaaptent = work tent / sleeping tent, Kampvuur = the campfire area (an outdoor spot: pick the natural
  preposition), Donkere kamer = photographer's darkroom; Speelzaal = main gaming room, Pokerkamer, Kluis = vault, Bar,
  Garderobe = cloakroom, Directiekamer = the owner's office, Balzaal = ballroom, Jachthaven = marina (outdoor).
- **Furniture.** canope = canopic jar, olielamp = clay oil lamp, kameel = camel, papyrus = papyrus scroll, zeef = an
  archaeologist's sieve; roulette = roulette wheel, fiches = a stack of casino chips, fruitautomaat = slot machine,
  champagnetoren = champagne tower of glasses, shaker = cocktail shaker.
- Roulette, poker and Grand Prix terms: use what players in your language say ("Faites vos jeux" and "Rien ne va plus"
  are French casino calls; keep them in French where your casinos use them, otherwise translate).

Do not edit any file outside `i18n/.work/<code>/` except the rebuilt `i18n/<code>.js`. Do not commit.

# Translation task 1.4 — two new worlds: Hacienda San Isidro and Opéra Lumière

You add two new worlds to **one** existing language pack of Crimson Ledger. Everything else in that pack is done
and must stay as it is. Read `docs/TRANSLATION-BRIEF.md` first (rules for logic, gaps, names, tone, length, grammar).

## Source

`docs/werelden/bron-1.4.json` holds everything to translate, Dutch (source) and English (reference) side by side:
per world the theme texts, 12 rooms (with the Dutch article), 5 pieces of furniture, 8 suspects (with gender and a
short description of who they are and how they look, for context only), 4 weekly case titles, 1 medal, and 8 campaign
parts of 8 cases each. The same Dutch is in `themes.js`, `campaign.js` and `progress.js`; English is in `i18n/en.js`.

## Where to write

Only in `i18n/.work/<code>/`. Add three new files and do not edit the existing ones:

| File | Contents |
|---|---|
| `data.20.js` | `{ themes: { hacienda: {…}, opera: {…} }, week: { hacienda: [4], opera: [4] }, medals: { hacienda: [title, hint], opera: [title, hint] } }` |
| `campaign.20.js` | `{ hacienda: [...], 'hacienda-2': [...], … 'hacienda-8', opera: [...], 'opera-2' … 'opera-8' }`, each `[title, intro, outro, briefing, [[case title, story, item] × 8]]` |
| `grammar.20.js` | `{ rooms: { hacienda: {…}, opera: {…} }, furniture: { agave, ketel, gitaar, hangmat, pinata, paspop, harp, masker, boeket, toneelkijker }, roomWords: { hacienda: {…}, opera: {…} } }` |

Each world in `data.20.js` has exactly the keys your pack already uses for `skihut`: `title, short, victimName,
roomWord, roomWordPlural, tagline, intro, outro, rooms, furniture, suspects, suspectShort`, plus `suspectRef` if your
pack has it for other worlds. Keys of `rooms`, `suspects`, `suspectShort`, `suspectRef` are the Dutch names; keys of
`furniture` are the ids.

`grammar.20.js` must give **every form your templates use** for each of the 24 new rooms, 10 new pieces of furniture
and 2 new room words. Copy the shape from your own `grammar.*.js` (look at how `skihut` rooms, `kachel`/`fondue` and
`roomWords.skihut` are written) and fill in every key. If your pack defines no per-room forms (like English), add only
what it defines for other worlds. Four room names already exist in other worlds (Kelder, Keuken, Bibliotheek,
Wasruimte): reuse your existing translation and forms for them.

Then build and check:

1. `node build-pack.js <code>`
2. `node tests/i18n-packs.test.js <code>` — must end with all checks passed (no missing forms, no Dutch left in
   sentences, every suspect named, every short name present).
3. `node tests/grammar-snapshot.js i18n/.work/<code>/sentences-1.4.json <code>` and read at least 80 generated
   sentences that mention the new rooms, furniture or suspects (both worlds, statements, clues, hints, Van Dam's
   explanations): grammar, gender agreement with the speaker, natural word order, unchanged logic. Fix and repeat.
4. Add a short section `## 1.4 Hacienda and Opera` to `i18n/.work/<code>/notes.md`: your choices for room names,
   titles of the suspects, anything a reviewer should check.

## Content notes

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

Do not edit any file outside `i18n/.work/<code>/` except the rebuilt `i18n/<code>.js`. Do not commit.

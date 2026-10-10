# Translation brief — Crimson Ledger

Crimson Ledger is a logic murder-mystery puzzle for phones. The player places suspects on a floor plan using
their statements, then names the one person who was alone with the victim. Inspector Van Dam is the dry,
kind mentor who explains things. The game ships in 20 languages; Dutch is the source language in the code and
English (`i18n/en.js`) is the reference translation.

You translate one language. You write **only** inside `i18n/.work/<code>/` and then build `i18n/<code>.js`
with `node build-pack.js <code>`. Do not edit any other file.

## 1. What a language file contains

Look at `i18n/en.js`: your file has the same five sections.

| Section | What it is | Source |
|---|---|---|
| `meta` | `{ name, dir, locale }` — given in your task, copy it exactly | — |
| | `data.article` is the article in front of a room name in plain sentences; leave it `''` if your language has none or if `grammar.rooms` gives every room its own forms | |
| `ui` | every screen text. **Keys are the Dutch source texts and never change.** Values are your translation | translate the English value; read the Dutch key for nuance |
| `data` | game content: 8 worlds (title, rooms, furniture, suspects, room word, story texts), ranks, difficulty names, daily and weekly case titles, medals, quests, Van Dam's tips, intros and reactions, archive stories, the tutorial | same keys as English |
| `campaign` | 48 parts × 8 cases: `[title, intro, outro, briefing, [[case title, one-line story, evidence item], …]]` | same keys and order as English |
| `grammar` | how sentences with rooms, furniture, positions and names are built (section 4) | English grammar + `grammar.js` |

Write the parts as plain object literals (one `{ … }` per file, comments allowed, nothing else) in
`i18n/.work/<code>/`: `meta.js`, `ui.1.js`, `ui.2.js` …, `data.1.js` …, `campaign.1.js` …, `grammar.1.js` ….
Parts of one section are merged in file-name order, so split big sections into files of a manageable size
(for example `campaign.1.js` with the first 16 parts). Then run `node build-pack.js <code>`.

## 2. Rules for every text

- **Logic first.** This is a logic puzzle: a translation must never change what a statement means.
  - "directly next to" = on the square to the left, right, above or below; never diagonal.
  - "in a corner" = a square touching two walls of its room; "against a wall, not in a corner" = touching
    exactly one wall; "in the middle, not against a wall" = touching no wall.
  - "to the left of X on the floor plan" = in any column further left; "higher on the floor plan than X" =
    in any row further up; "on the same row" / "in the same column" = anywhere on that row or column.
  - "in a room with a plant" = in the room that contains that piece of furniture, anywhere in it.
  - "I was alone in the room" = no other suspect in my room.
- **Gaps.** `{0}`, `{1}` … in a `ui` value must all appear (order may change). Never invent a gap. When a gap holds a suspect's name you may write `{0.ref}` or `{0.short}` for the in-sentence form or the name without title.
- **Choices.** A gap can choose a form:
  - number: `{0|one:case|other:cases}` — categories `zero one two few many other` as `Intl.PluralRules` uses them
    for your locale; always include `other`. Example Russian: `ещё {0} {0|one:дело|few:дела|many:дел|other:дела}`.
  - gender of a person: `{0|m:был|f:была}` — names carry their gender. Keys `m` and `f` (and `n` for a room word).
  - Korean particles: `{0|c:이|v:가}` picks by whether the word ends in a final consonant (batchim) — `c` after a closed syllable, `v` after an open one (also works on names and rooms in templates: `{s|c:이|v:가}`).
  - The choice only prints the chosen text; write the plain `{0}` too where the number or name must show.
- **Keep** HTML tags (`<b>…</b>`), emoji, `★`, `·`, `—`, numbers, and line structure. Keep "Crimson Ledger" and
  "Crimson Pass" in Latin letters. Digits stay Western (0–9).
- **Tone** (DESIGN.md §7): short, plain, dry. One idea per sentence. No hype words ("discover", "ultimate",
  "dive into"), no exclamation marks unless the source has one. Van Dam is calm and a bit wry.
- **Address the player** the way good games in your language do (given in your task). Stay consistent.
- **Length.** Buttons, tabs, chips and labels: about the length of the English, at most ~1.3×. Room names are
  printed on the floor plan in small capitals: keep them short (aim ≤ 12 Latin characters or ≤ 6 CJK
  characters). World short names (`short`) are tab labels: one short word.
- **Consistency.** First make a glossary (`i18n/.work/<code>/glossary.md`) of the core terms and use them
  everywhere: case, suspect, statement, clue, floor plan, room, square, victim, murderer, Check, Pencil, Eraser,
  Undo, Hint, accuse, rank names, world names, daily case, case of the week, streak, streak freeze, points,
  evidence chest, archive.

## 3. Names

- Suspects: keep the given name; translate the title or profession ("Cook Saffron" → "Повар Саффрон",
  "Lady Clementine" → "Леди Клементина"). In non-Latin scripts write the name the way that script usually
  writes foreign names. Every one of the 64 suspects needs an entry in `data.themes.<world>.suspects`,
  keyed by the Dutch label (see `themes.js`; English lists only the ones whose label differs).
- Each suspect also needs a **short name** for the board chips, without title: `data.themes.<world>.suspectShort`,
  keyed by the Dutch label like `suspects` (`'Kok Saffron': 'Саффрон'`). Usually the given name; for "Barones Von
  Stahl" the short name is "Von Stahl" in your script.
- Each suspect has a gender in `themes.js` (`gender: 'f' | 'm'`); the stories match it.
- **Names never change form.** Do not inflect a name (no case endings on names). Build sentences so the name
  stays in its dictionary form: make the name the subject, or put it after a word that takes the plain form
  (Russian "что и {b}", "чем {b}"; Hindi/Marathi/Bengali/Telugu postpositions written after the name are fine).
- Victims (`victimName`) and Inspector Van Dam (`mentorName`): transliterate; keep "Van Dam" recognisable.
- The tutorial (`data.boardTutorial`) quotes two statements about Lady Clementine and Mr. Hargrove; keep the
  wording in line with how your grammar renders those statements.

## 4. Grammar: sentences with rooms, furniture, positions and names

`grammar.js` builds these sentences from templates. Read its header and `GRAMMAR_NL`, and the English
`grammar` in `i18n/en.js`. Your `grammar` section:

```js
{
  positions: { hoek: { room: '…', loose: '…' }, muur: { … }, midden: { … } },  // "in a corner" / "in a corner of a {rw}"
  derive: { roomIn: 'in {room}', furnNext: 'next to {furn}', furnWith: 'with {furn}', victimDefault: 'The victim' },
  rooms: { <world>: { <Dutch room name>: { the: '…', in: '…', /* any other form you use */ } } },
  furniture: { <furniture id>: { a: '…', next: '…', with: '…', /* other forms */ } },
  roomWords: { <world>: { rw: '…', rws: '…', gender: 'm' | 'f' | 'n', /* other forms */ } },
  templates: { statement: {…}, clue: {…}, caseText: '…', explain: {…}, hint: {…}, action: {…}, board: {…} }
}
```

Slots in templates:

| Slot | Meaning |
|---|---|
| `{s}` | the suspect the sentence is about. In `statement` templates `{s}` is the **speaker** ("I …"): the name is not printed there, but use `{s|m:…|f:…}` for verbs or adjectives that agree with the speaker ("я был/была", "मैं था/थी", "seul/seule"). |
| `{b}` | the other suspect (two-person sentences). `{b.short}` / `{s.short}` is the name without title (from `suspectShort`); `{b.ref}` / `{s.ref}` is the form for the middle of a sentence if your language needs one (an article, a lower-case title): give it per suspect in `data.themes.<world>.suspectRef`, keyed by the Dutch label; without it `.ref` is the plain label |
| `{room}` | a room, in the form `rooms.<world>.<room>.the` (for English: "the Kitchen"); `{room.in}` the locative ("in the Kitchen", "на кухне", "रसोई में"); `{room.<form>}` any form you define |
| `{furn}` | a piece of furniture with an indefinite article if your language has one ("a plant"); `{furn.next}` "next to a plant", `{furn.with}` "with a plant", `{furn.<form>}` |
| `{rw}` `{rws}` | the room word of the world (room, cabin, module, hall, carriage …), singular and plural; `{rw.<form>}`; `{rw|m:…|f:…|n:…}` agrees with the room word's gender |
| `{pos}` `{pos.loose}` | a position phrase: inside a named room (`positions.<id>.room`) or "of a room" (`positions.<id>.loose`, may use `{rw}`) |
| `{victim}` `{n}` `{k}` `{quote}` | victim name, numbers, a quoted clue |

- Every template key of `GRAMMAR_NL.templates` must exist. Keep every person, number, room, furniture and quote
  the Dutch sentence has; you may rephrase the room word.
- If your language needs a form per room or per piece of furniture (case, preposition, article, gender),
  define it for **every** room of every world (93 rooms) and every piece of furniture (40). The check fails if a
  form a template uses is missing anywhere.
- Rooms: `data.themes.<world>.rooms` holds the short label shown on the plan (nominative, no article).
  `grammar.rooms` holds the forms used inside sentences.

## 5. Check and review

1. `node build-pack.js <code>`
2. `node tests/i18n-packs.test.js <code>` and `node tests/i18n-keys.test.js` — both must pass.
3. `node tests/grammar-snapshot.js i18n/.work/<code>/sentences.json <code>` writes every generated sentence of
   144 cases (statements, clues, Van Dam's explanations, hints). Read at least 150 of them, across all worlds and
   all sentence kinds, as a native reader: grammar, agreement with the speaker's gender, natural word order,
   correct logic. Fix the templates or forms and repeat.
4. Write `i18n/.work/<code>/notes.md`: choices you made (address form, terms, how you handle names and room
   forms), and anything a reviewer should look at.

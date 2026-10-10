# Store brief — App Store texts per language (version 1.2)

Source: `store/metadata/1.2.0.json`, locale `en-US` (and `nl-NL` for nuance). Background on the choices in
`store/ASO.md`. Use the glossary of your language in `i18n/.work/<code>/glossary.md`, so the store says what
the app says (world names, ranks, "case", "suspect", "Crimson Pass").

Write `store/metadata/1.2.0/<store-locale>.json` with one object:

```json
{ "name": "…", "subtitle": "…", "keywords": "…", "promotionalText": "…", "description": "…", "whatsNew": "…" }
```

## Limits (App Store Connect rejects anything longer)

| Field | Limit | What it is for |
|---|---|---|
| `name` | 30 characters | `Crimson Ledger: ` + a short hook in your language that people actually search for this kind of game (for example "detective game", "murder mystery", "find the culprit"). The brand stays in Latin letters. |
| `subtitle` | 30 characters | a plain descriptor: murder-mystery logic puzzles |
| `keywords` | **100 bytes in UTF-8** (non-Latin letters take 2–3 bytes each) | comma-separated, no spaces around commas, singular forms, no word that is already in the name or subtitle (Apple indexes those already), no other apps' or brands' names (never Cluedo, Clue, Murdle, Sherlock). Pick the terms a player in your market types: detective, murder, mystery, puzzle, logic, riddle, crime, culprit, suspect, offline, daily, whodunit — in your language, plus "sudoku" if people in your market use it for logic puzzles. |
| `promotionalText` | 170 characters | the hook: find the culprit, 96 free cases, a new case every day, no ads, no subscription, plays offline |
| `description` | 4000 characters | translate the English description faithfully and naturally; keep the section headings (in capitals where your script has them) and the facts exactly (numbers, worlds, prices model). The language paragraph says the game plays in 17 languages. |
| `whatsNew` | 4000 characters (keep it short) | translate the English one |

## Rules

- Facts must match the game: 8 worlds, 384 cases in 48 parts, 96 free cases (two free worlds), three free hints a
  day, 23 awards, gift worlds after 7 and 30 days of daily cases, no ads, no account, no subscription, the
  Crimson Pass as one purchase. Use the new names (the example statement mentions Mortimer).
- No claims the game cannot back ("best", "#1", "ultimate"), no prices, no emoji in name or subtitle.
- Write for your market, not word for word: a native player should feel the text was written in their language.
- Check: `node -e "const t=require('./store/metadata/1.2.0/<locale>.json'); for (const [k,v] of Object.entries(t)) console.log(k, [...v].length, Buffer.byteLength(v))"`
  and keep every field inside its limit (keywords counted in bytes).

## Store locales

| App language | Store locale(s) |
|---|---|
| de | de-DE |
| es | es-ES and es-MX (one neutral Spanish text may serve both; adapt a word if one market says it differently) |
| fr | fr-FR (fr-CA may reuse it) |
| id | id |
| pt | pt-BR |
| vi | vi |
| ru | ru |
| ar | ar-SA |
| ur | ur |
| hi | hi |
| mr | mr |
| bn | bn-BD |
| te | te |
| zh | zh-Hans |
| ja | ja |

The codes for the four languages Apple added in 2026 (Bangla, Marathi, Telugu, Urdu) are checked when the texts
are uploaded; the file name only needs to be one of the codes above.

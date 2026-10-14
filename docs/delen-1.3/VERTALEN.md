# Translation brief — Crimson Ledger 1.3 additions

You translate the new 1.3 texts into ONE language (given in your task). Everything else in the game is already
translated; read your language's existing work to match its voice, terms and names exactly.

Read first:
- `docs/TRANSLATION-BRIEF.md` (rules: logic first, tone, names never inflected, gaps `{0}`, plural choices, length).
- `i18n/.work/<code>/glossary.md` and `notes.md` (your language's terms and choices).
- `i18n/en.js` (reference English) and the Dutch source in `campaign.js` / the code.

## What is new

1. **Campaign parts VII and VIII of all eight worlds** (16 parts, 128 cases). Source: `campaign.js`, keys
   `landhuis-7`, `landhuis-8`, `piraten-7` … `skihut-8`; English in `i18n/en.js` under `campaign`. Same format as
   your existing campaign parts: `'<key>': [title, intro, outro, briefing, [[case title, story, item] ×8]]`.
   - Part titles follow your existing pattern for parts I–VI (e.g. "Teil VII · …").
   - The briefings are Van Dam's reasoning tips for hard cases: keep the logic exact ("directly next to" = left,
     right, above or below, never diagonal; "in a corner" = touches two walls of its room; "left of" = any column
     further left; "higher" = any row further up). Use your language's existing words for statement, square, room,
     floor plan, pencil, dots, victim, murderer, master level.
   - Suspects' names: exactly as your `data.themes.<world>.suspects` / `suspectShort` / `suspectRef` give them, and
     never inflected (see the brief §3). Evidence items: emoji + short noun, like your existing items.
2. **Master difficulty**: `data.difficulty.meester` (English "Master"), and two picker texts in `ui`:
   `'Meester'` (button label) and `'Voor echte kenners'` (English "For true experts").
3. **Other new screen texts** (`ui`, keys are the Dutch source, English value in `i18n/en.js` after the comment
   `// 1.3`): `'Je gaat verder waar je was.'`, `'⏱️ Klok tijdens een zaak'`, and
   `'Week {0} · {1} {2} · {3}. Elke week één speciale zaak op meesterniveau; iedereen speelt dezelfde. Deel je resultaat met andere speurders.'`
   ({3} is the master level's name; keep every gap).
4. **New award**: `data.medals.meesterzaken` = [title, description] (English ['Master Sleuth', 'Solve five
   master-level cases']).

## Where to write

Only in `i18n/.work/<code>/`, as new files so nothing existing is touched:
- `campaign.13.js` (and `campaign.14.js` if you want to split): `{ 'landhuis-7': [...], ... }`
- `ui.13.js`: `{ 'Meester': '…', 'Voor echte kenners': '…', 'Je gaat verder waar je was.': '…', '⏱️ Klok tijdens een zaak': '…', 'Week {0} · …': '…' }`
- `data.13.js`: `{ difficulty: { meester: '…' }, medals: { meesterzaken: ['…', '…'] } }`

Then: `node build-pack.js <code>`, `node tests/i18n-packs.test.js <code>` (must pass), `node tests/i18n-keys.test.js`
(your language must have no missing text). Read your 16 parts once more as a native reader before you finish.
Check the master picker at 320 px: `QA_TIMEOUT_MS=900000 node tests/qa-lang.js <code> <scratch dir>` and look at the
free-play screenshot; the four difficulty buttons must not cut text. Do not edit other files, do not commit.

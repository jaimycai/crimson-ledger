# Keywords 1.7.1: Spanish, Portuguese, French, German, Italian, Dutch

18 November 2026. A proposal for the keyword field of es-ES, es-MX, pt-BR, pt-PT, fr-FR, de-DE, it and nl-NL in
version 1.7.1. The fields are in `store/metadata/zoekwoorden-1.7.1/eu.json`. Nothing has been uploaded. Nothing goes live
until the owner approves it. The names stay as they are, and no subtitle change is proposed.

## In short

1. **A weak top 10 is not enough. Few apps may match the phrase.** With 0 ratings outside the Netherlands we are in the
   real top 12 in two cases only. The first is when the search is our name ("sudoku enigma" BR #2, "sudoku mistero" IT
   #1, "sudoku enquête" FR #4, "mystery sudoku" #1 to #4 in 12 of the 13 stores through the en-GB name). The second is
   when a keyword plus "sudoku" makes a phrase that few apps use ("sudoku culpable" MX #2, "sudoku coupable" FR #4,
   "sudoku colpevole" IT #4, "sudoku mystère" FR #7, "sudoku giallo" IT #8, "sudoku charadas" BR #8). On "sudoku
   detective" in MX, 7 of the top 10 have under 100 ratings, but 140 apps match it, and we are #22. Across 31 API
   measurements where the match came from the subtitle or the keyword field, our rank was a median of 0.34 times the pool
   size (range 0.12 to 0.85). So a top 10 needs a phrase that roughly 30 apps or fewer match.
2. **The fields are built around that.** Each one keeps the words that rank now. It drops brain-game words whose top 10
   are apps with 10,000 to 250,000 ratings, where we are far outside the top 12. It adds words that pair with "sudoku" or
   with a word already in the field to form a phrase with a small, weak pool. Each added word appears in a hint or in the
   name of an on-topic competitor.
3. **Honest limit.** Small pools mean little competition. Usually they also mean few searches. The hinted phrases with
   real demand ("sudoku crimen" 3/5, "resolver casos" 4/1, "casos criminais" 4/1, "enquête criminelle" 3/1, "detektiv
   spiele" 3/1, "detective game" 3/1) have pools of 70 to 190 apps. There we are #24 to #54 or outside the top 200. Those positions move
   with ratings and downloads, not with the keyword field. The fields keep those words so we climb when ratings come.

## Method

1. **Which fields each store reads.** Apple's "App Store localizations" table, fetched with curl on 18-11 (table below).
2. **Real search terms.** Apple's search hints (`MZSearchHints`, per storefront through `X-Apple-Store-Front`). We sent
   540 queries: the seeds in each language, the seed plus a space, three-letter prefixes, and "sudoku " plus a letter.
   "3/5" means: after 3 typed characters, at position 5. Where today's hints have nothing, the hint from the 4-11 baseline
   (`docs/onderzoek/ZOEKWOORDEN-2026-11.md`) is shown as "(… on 4-11)".
3. **Competition.** The real store's top 12 for 737 term × store pairs, from `apps.apple.com/<cc>/iphone/search` (the
   store's own web search, without personal signals, so a phone can differ by a few places). It gives local rating
   counts and subtitles. On top of that, the iTunes Search
   API (`limit=200`) for 95 pairs, which gives our rank beyond 12 and the pool (how many apps match). "On topic" counts the
   top 10 apps whose name or subtitle has a detective, mystery, crime or logic-puzzle word.
4. **Choice.** A term qualifies when it is real (a hint, or an exact name phrase of on-topic competitors), its top 10 has
   several apps under 100 ratings or is off topic, and the game truthfully is that. Then each locale's field was built
   from single words that combine with the name and subtitle.
5. **Checks.** A scratch script ran the exact MURDER and FREE regexes from `store/metadata/check-1.6.js`, plus a brand
   list (Enigmic, Murdoku, Murdle, Tiny Crimes, Whodoku, Motive, Cluedoku, Clue/Cluedo, GridNoir, Murdoria, Mysteryic,
   Crimson Ledger). It also checked length, spaces, words already in the name or subtitle, and singular/plural pairs. All
   eight fields pass.

## Did the hints endpoint work?

Yes, with or without the language part of the header (the language part changes nothing; hints are per storefront). After
about 250 quick calls Apple answered HTTP 429 with `Retry-After: 1690` (28 minutes). Other jobs were using the same
connection at the same time. After the wait, the rest ran at one call per 6 seconds without trouble. The iTunes Search API
throttled hard (HTTP 403/429), so it covered only 95 pairs. The real-store search page carried the competition analysis.
Note: hints for "speurders" (NL) and "na pista" (BR) are classifieds and car apps, not searches for our genre.

## Which fields each store reads (Apple's table, 18-11)

| Store | Reads | Note |
|---|---|---|
| ES | es-ES, en-GB (and Catalan) | |
| MX, CO, AR | es-MX, en-GB | es-MX is also read by the **US** store |
| BR | pt-BR, en-GB | pt-BR is also read by the US store |
| PT | pt-PT, en-GB | |
| FR | fr-FR, en-GB | fr-FR is also read by the US store |
| BE | en-GB (default), nl-NL, fr-FR | the nl and fr fields both count here |
| CH | de-DE (default), en-GB, fr-FR, it | "sudoku mistero" #1 and "sudoku enquête" #2 in CH come from it and fr |
| DE, AT | de-DE, en-GB | Apple has one German localization |
| IT | it, en-GB | |
| NL | nl-NL, en-GB | |

Apple does not join words across two localizations (measured on 4-11). But each store does read the en-GB name. That is
why "mystery sudoku" ranks #1 to #4 everywhere except PT. That is also why the local fields need no "mystery", "offline",
"logic", "puzzle" or "detective games": en-GB carries them. The en-GB proposal (`zoekwoorden-1.7.1/en.json`) keeps
offline, crime and deduction. If that changes, "sudoku offline" in these stores goes with it.

## Per storefront

Legend: **Hint?** = shortest prefix/position in today's hints. **Our rank now** = real-store top 12 (or API rank 13-200
with the pool size). "not top 12" = not on the store page. **Ratings** = local rating counts of positions 1, 5 and 10.

### ES · Spain (es-ES + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku culpable | sudoku culprit | no | #3 | 57 / 0 / 2 | 10/10, 10 under 100 | keep culpable |
| sudoku sospechosos | sudoku suspects | no | #9 | 38 / 4 / 2 | 10/10, 9 under 100 | keep sospechoso |
| sudoku acertijos | sudoku riddles | no | #7 | 103 / 29k / 32 | 10/10, 6 under 100 | covered by subtitle |
| mystery sudoku | (English) | no | #1 | 0 / 0 / 0 | 10/10, 6 under 100 | covered by the en-GB name |
| sudoku crimen | crime sudoku | 3/5 | #54 (pool 73) | 2.5k / 31 / 13k | 10/10, 6 under 100 | keep crimen |
| sudoku misterio | mystery sudoku | no | #25 (pool 78) | 2.5k / 57 / 2 | 10/10, 7 under 100 | keep misterio |
| sudoku detective | detective sudoku | 8/1 | #26 (pool 150) | 38 / 1 / 103 | 10/10, 7 under 100 | covered by name + subtitle |
| sudoku sin anuncios | sudoku without ads | 3/3 | #54 (pool 158) | 362 / 45 / 1 | 9/10, 5 under 100 | keep sin, anuncios |
| resolver casos | solve cases | 4/1 | not top 12 | 2 / 2 / 93 | 10/10, 5 under 100 | keep resolver, caso |
| pistas sudoku | sudoku clues | 6/7 | not top 12 | 0 / 316 / 0 | 10/10, 4 under 100 | keep pista |
| sudoku criminal | criminal sudoku | no | not top 12 | 46 / 1 / 0 | 10/10, 10 under 100 | add criminal |
| sudoku investigación | investigation sudoku | no | not top 12 | 0 / 2 / 0 | 10/10, 10 under 100 | add investigación |
| juegos de investigación | investigation games | 11/2 | not top 12 | 2 / 1k / 7 | 9/10, 5 under 100 | add investigación |
| acertijos lógicos | logic riddles | no | not top 12 | 0 / 0 / 2 | 10/10, 10 under 100 | add lógico |
| resolver crimenes | solve crimes | 4/4 | not top 12 | 2 / 11 / 1 | 10/10, 8 under 100 | skip: needs crímenes, the plural of crimen |
| sudoku sin conexion | sudoku offline | 7/2 | not top 12 | 133.5k / 316 / 32k | 9/10, 3 under 100 | drop conexión |
| juegos mentales | brain games | 15/3 | not top 12 | 32k / 2.9k / 7.9k | 7/10 | not winnable; rompecabezas (hint 3/4) dropped for the same reason |
| juegos de detectives | detective games | 10/3 | not top 12 | 3 / 2.5k / 2 | 9/10, 3 under 100 | not winnable |
| quien es el culpable | who is the culprit | no | not top 12 | 0 / – / – | 2/2, 2 under 100 (only 2 results) | skip: no hint |
| noir | noir | 4/1 | not top 12 | 84 / 892 / 27 | 4/10, 7 under 100 | skip: off topic |

### MX · Mexico (es-MX + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku culpable | sudoku culprit | no | #2 | 7 / 0 / 0 | 10/10, 10 under 100 | keep culpable |
| sudoku sospechosos | sudoku suspects | no | #4 | 117 / 0 / 0 | 10/10, 9 under 100 | keep sospechoso |
| sudoku detectives | sudoku detectives | no | #10 | 645 / 0 / 0 | 10/10, 7 under 100 | covered by name + subtitle |
| mystery sudoku | (English) | no | #3 | 0 / 11 / 313k | 9/10, 5 under 100 | covered by the en-GB name |
| sudoku crimen | crime sudoku | 4/8 | #31 (pool 70) | 11 / 7 / 0 | 10/10, 8 under 100 | keep crimen |
| sudoku detective | detective sudoku | no | #22 (pool 140) | 7 / 0 / 2 | 10/10, 7 under 100 | covered by name + subtitle |
| sudoku misterio | mystery sudoku | no | #21 (pool 79) | 645 / 0 / 0 | 10/10, 8 under 100 | keep misterio |
| resolver casos | solve cases | 4/1 | not top 12 | 61 / 0 / 0 | 10/10, 5 under 100 | keep resolver, caso |
| sudoku criminal | criminal sudoku | no | not top 12 | 31 / 0 / 0 | 10/10, 10 under 100 | add criminal |
| sudoku investigación | investigation sudoku | no | not top 12 | 1 / 0 / 0 | 10/10, 10 under 100 | add investigación |
| juegos de investigación | investigation games | 13/1 | not top 12 | 7 / 355 / 0 | 10/10, 4 under 100 | add investigación |
| acertijos lógicos | logic riddles | no | not top 12 | 0 / 0 / 1 | 10/10, 10 under 100 | add lógico |
| sudoku sin internet | sudoku without internet | 8/2 | – | 18.3k / 27 / 0 | 9/10, 6 under 100 | drop internet |
| juegos de detectives | detective games | 10/1 | – | 4.3k / 7 / 970 | 9/10, 2 under 100 | not winnable |
| quien fue | who did it | no | – (pool 4) | 0 / – / – | 3/4, 4 under 100 (only 4 results) | skip: no hint |

### CO · Colombia (es-MX + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| mystery sudoku | (English) | no | #2 | 0 / 81k / 1.8k | 9/10, 5 under 100 | covered by the en-GB name |
| sudoku detective | detective sudoku | no | #10 | 3 / 0 / 0 | 10/10, 8 under 100 | covered by name + subtitle |
| sudoku crimen | crime sudoku | 7/10 | #12 | 284 / 256 / 0 | 10/10, 8 under 100 | keep crimen |
| resolver crimenes | solve crimes | no | not top 12 | 10 / 52 / 2 | 10/10, 6 under 100 | skip (see ES) |
| resolver casos | solve cases | no | not top 12 | 88 / 686 / 0 | 10/10, 6 under 100 | keep resolver, caso |

### AR · Argentina (es-MX + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| mystery sudoku | (English) | no | #2 | 0 / 9 / 0 | 9/10, 6 under 100 | covered by the en-GB name |
| sudoku detective | detective sudoku | no | #10 | 3 / 0 / 0 | 10/10, 8 under 100 | covered by name + subtitle |
| sudoku crimen | crime sudoku | 7/9 | not top 12 | 158 / 175 / 0 | 10/10, 8 under 100 | keep crimen |
| resolver casos | solve cases | no | not top 12 | 5 / 0 / 518 | 10/10, 5 under 100 | keep resolver, caso |

### BR · Brazil (pt-BR + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku enigma | sudoku riddle | no | #2 (pool 169) | 768 / 18 / 28 | 10/10, 6 under 100 | covered by name |
| mystery sudoku | (English) | no | #3 | 1 / 0 / 618k | 9/10, 7 under 100 | covered by the en-GB name |
| sudoku charadas | sudoku riddles | no | #8 | 0 / 1 / 3 | 10/10, 9 under 100 | keep charadas |
| sudoku culpado | sudoku culprit | no | #9 | 0 / 7 / 0 | 10/10, 10 under 100 | keep culpado |
| sudoku investigação | investigation sudoku | no | #10 | 18 / 0 / 0 | 10/10, 10 under 100 | keep investigação |
| sudoku suspeito | sudoku suspect | no | #12 | 29k / 0 / 3 | 10/10, 9 under 100 | keep suspeito |
| sudoku detetive | detective sudoku | 8/2 | #43 (pool 151) | 7 / 0 / 5 | 10/10, 9 under 100 | covered by name + subtitle |
| sudoku crime | crime sudoku | no | #36 (pool 115) | 106 / 8.4k / 577 | 9/10, 6 under 100 | keep crime |
| sudoku misterio | mystery sudoku | no | #33 (pool 77) | 106 / 0 / 0 | 10/10, 8 under 100 | keep mistério |
| caso criminal | criminal case | 4/2 | not top 12 | 3.2k / 254 / 2 | 9/10, 4 under 100 | add criminal |
| casos criminais | criminal cases | 4/1 | – (pool 173) | 100 / 914 / 1 | 10/10, 5 under 100 | add criminal (plural not stemmed, see text) |
| resolver casos criminais | solve criminal cases | 4/7 | not top 12 | 4 / 2 / 0 | 9/10, 5 under 100 | add resolver |
| sudoku com dicas | sudoku with hints | 8/5 | not top 12 | 0 / 0 / – | 8/8, 8 under 100 (only 8 results) | add dicas |
| sudoku criminal | criminal sudoku | no | not top 12 | 7 / 0 / 0 | 10/10, 9 under 100 | add criminal |
| jogo de detetive | detective game | 9/9 | not top 12 | 3.5k / 16 / 254 | 8/10, 4 under 100 | covered by subtitle, not winnable |
| raciocinio logico | logical reasoning | 10/1 | not top 12 | 165.2k / 260k / 12.2k | 6/10 | drop raciocínio |
| sudoku offline | sudoku offline | 7/2 | – | 24k / 0 / 3 | 10/10, 7 under 100 | drop offline (en-GB has it) |
| quem foi | who did it | no | not top 12 | 0 / – / – | 2/4, 4 under 100 (only 4 results) | skip: no hint |

### PT · Portugal (pt-PT + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku culpado | sudoku culprit | no | #9 | 0 / 0 / 0 | 10/10, 10 under 100 | keep culpado |
| sudoku charadas | sudoku riddles | no | #10 | 0 / 0 / 0 | 9/10, 10 under 100 | keep charadas |
| sudoku detetive | detective sudoku | no | #47 (pool 130) | 2 / 2 / 0 | 10/10, 7 under 100 | covered by name + subtitle |
| sudoku crime | crime sudoku | 7/3 | #51 (pool 107) | 1.1k / 1 / 0 | 10/10, 8 under 100 | keep crime |
| sudoku enigma | sudoku riddle | no | #23 (pool 163) | 77 / 0 / 19 | 10/10, 6 under 100 | covered by name |
| mystery sudoku | (English) | no | not top 12 | 140 / 1.9k / 0 | 10/10, 7 under 100 | covered by the en-GB name |
| resolver crimes | solve crimes | 5/1 | not top 12 | 507 / 326 / 4.3k | 9/10, 4 under 100 | add resolver |
| sudoku dedução | deduction sudoku | no | not top 12 | 19 / 2 / 0 | 10/10, 9 under 100 | skip: no hint, no competitor name |
| enigmas de lógica | logic riddles | 7/6 | – (pool 176) | 1 / 1 / 0 | 9/10, 5 under 100 | keep lógica |
| quebra cabeças | jigsaw puzzles | 14/1 | – | 5.6k / 2.2k / 3.5k | 10/10, 1 under 100 | drop quebra, cabeças |

### FR · France (fr-FR + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku enquête | investigation sudoku | no | #4 | 185 / 30 / 0 | 10/10, 9 under 100 | covered by name |
| sudoku coupable | sudoku culprit | no | #4 | 13 / 2 / 0 | 10/10, 10 under 100 | keep coupable |
| sudoku criminel | criminal sudoku | no | #6 | 0 / 933 / 0 | 10/10, 9 under 100 | keep criminelle |
| sudoku mystère | mystery sudoku | no | #7 | 13 / 4 / 0 | 10/10, 9 under 100 | keep mystère |
| sudoku policier | police sudoku | no | #9 | 0 / 0 / 0 | 10/10, 10 under 100 | keep policière |
| sudoku détective | detective sudoku | no | #12 | 0 / 185 / 0 | 10/10, 9 under 100 | covered by name + subtitle |
| mystery sudoku | (English) | no | #4 | 0 / 9.8k / 0 | 10/10, 8 under 100 | covered by the en-GB name |
| qui est le coupable | who is the culprit | 8/2 | not top 12 | 2 / 2k / 14 | 8/10, 4 under 100 | add est, le |
| trouver le coupable | find the culprit | no | not top 12 | 0 / 0 / – | 7/8, 7 under 100 (only 8 results) | skip: no hint, no competitor name |
| enquête criminelle | criminal investigation | 3/1 | #24 (pool 140) | 1.3k / 574 / 4 | 9/10, 5 under 100 | keep criminelle |
| enquête policière | police investigation | 3/4 | #33 (pool 162) | 1.3k / 574 / 95 | 9/10, 3 under 100 | keep policière |
| jeu d'enquête | investigation game | 6/3 | #27 | 1.3k / 361 / 42 | 10/10, 1 under 100 | covered by name + subtitle |
| suspect | suspect | 7/3 | not top 12 | 9.8k / 110k / 0 | 6/10, 4 under 100 | add suspect |
| sudoku hors ligne sans pub | sudoku offline, no ads | 8/4 | not top 12 | 2 / 276 / 38 | 9/10, 7 under 100 | keep hors, ligne |
| énigmes policières | detective riddles | no | not top 12 | 0 / 0 / 361 | 10/10, 7 under 100 | keep énigme, policière |
| énigmes logiques | logic riddles | 4/1 | not top 12 | 56 / 367 / 2.8k | 8/10, 3 under 100 | keep logique |
| casse tête | brain teaser | no | not top 12 | 149k / 5k / 2.2k | 9/10 | drop casse, tête |
| jeu de réflexion | thinking game | 8/4 | not top 12 | 60k / 2.2k / 4.8k | 5/10 | drop réflexion |

### BE · Belgium (en-GB + nl-NL + fr-FR)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku enquête | investigation sudoku (fr) | no | #2 | 183 / 37 / 1 | 10/10, 9 under 100 | covered by fr name |
| mystery sudoku | (English) | no | #4 | 37 / 183 / 0 | 10/10, 8 under 100 | covered by the en-GB name |
| sudoku mystère | mystery sudoku (fr) | no | not top 12 | 1 / 0 / 937 | 10/10, 8 under 100 | keep mystère (fr) |
| detective spel | detective game (nl) | no | not top 12 | 12 / 162 / 1 | 10/10, 7 under 100 | keep spel (nl) |
| detective game | detective game | no | not top 12 | 36 / 31 / 1 | 10/10, 6 under 100 | covered by nl subtitle |

### CH · Switzerland (de-DE + en-GB + fr-FR + it)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku mistero | mystery sudoku (it) | no | #1 | 0 / 166 / 2 | 10/10, 9 under 100 | covered by it name |
| sudoku enquête | investigation sudoku (fr) | no | #2 | 166 / 2 / 0 | 10/10, 9 under 100 | covered by fr name |
| mystery sudoku | (English) | no | #3 | 1 / 14 / 0 | 9/10, 9 under 100 | covered by the en-GB name |
| sudoku detektiv | detective sudoku (de) | no | not top 12 | 2 / 2 / 0 | 10/10, 9 under 100 | keep detektiv (de) |
| krimi sudoku | crime sudoku (de) | no | not top 12 | 14 / 2 / 1 | 10/10, 9 under 100 | keep krimi (de) |

### DE · Germany (de-DE + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| mystery sudoku | (English) | no | #4 | 0 / 6 / 0 | 10/10, 7 under 100 | covered by the en-GB name |
| sudoku detektivspiel | sudoku detective game | no | #9 | 6 / 969 / 1 | 10/10, 9 under 100 | covered by name + subtitle |
| sudoku täter | sudoku culprit | no | #12 | 13 / 4 / 0 | 10/10, 10 under 100 | keep täter |
| detektiv spiele | detective games | 3/1 | – | 4 / 13 / 10.2k | 10/10, 3 under 100 | add spiele |
| krimi spiele | crime games | 3/4 | – | 8 / 10 / 33 | 10/10, 5 under 100 | keep krimi, add spiele |
| fälle lösen | solve cases | 4/10 | not top 12 | 8 / 2 / 10.2k | 10/10, 6 under 100 | keep fälle, lösen |
| ermittler | investigator | 9/1 | not top 12 | 8 / 393 / 47 | 10/10, 5 under 100 | add ermittler |
| sudoku ermittler | investigator sudoku | no | not top 12 | 47 / 0 / 0 | 10/10, 10 under 100 | add ermittler |
| sudoku verdächtige | sudoku suspects | no | not top 12 | 119 / 4 / 0 | 10/10, 9 under 100 | add verdächtige |
| täter finden | find the culprit | no | not top 12 | 0 / 0 / 0 | 8/10, 10 under 100 | skip: no hint, no competitor name |
| sudoku kriminalfall | criminal case sudoku | no | not top 12 | 6 / 0 / – | 7/7, 7 under 100 (only 7 results) | add kriminalfälle (competitor name word) |
| krimi sudoku | crime sudoku | no | not top 12 | 969 / 1 / 13 | 10/10, 9 under 100 | keep krimi |
| sudoku detektiv | detective sudoku | no | not top 12 | 4 / 969 / 0 | 10/10, 9 under 100 | keep detektiv |
| krimi logik | crime logic | no | not top 12 | 13 / 969 / 0 | 10/10, 9 under 100 | keep logik |
| sudoku ohne werbung | sudoku without ads | 7/3 | not top 12 | 1.2k / 3 / 4.1k | 10/10, 1 under 100 | covered by name + subtitle |
| denkspiele | brain games | 10/2 | not top 12 | 40.5k / 7.3k / 3.8k | 4/10 | drop |
| knobelspiele | puzzle games | 6/1 | not top 12 | 40.5k / 6.4k / 3.6k | 8/10 | drop |
| gehirnjogging | brain training | 13/2 | not top 12 | 40.5k / 131k / 1.5k | 6/10 | drop |
| logikrätsel | logic puzzles | 11/1 | not top 12 | 2k / 2.5k / 1.8k | 10/10 | drop |

### AT · Austria (de-DE + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| mystery sudoku | (English) | no | #4 | 18 / 91 / 0 | 10/10, 9 under 100 | covered by the en-GB name |
| sudoku detektiv | detective sudoku | no | not top 12 | 0 / 0 / 0 | 10/10, 10 under 100 | keep detektiv |
| krimi sudoku | crime sudoku | no | not top 12 | 91 / 0 / 0 | 10/10, 10 under 100 | keep krimi |
| detektivspiel | detective game | no | not top 12 | 45 / 0 / 48 | 10/10, 7 under 100 | covered by subtitle, not winnable |

### IT · Italy (it + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| sudoku mistero | mystery sudoku | no | #1 (pool 52) | 0 / 461 / 10 | 10/10, 9 under 100 | covered by name |
| mystery sudoku | (English) | no | #2 | 0 / 10k / 0 | 10/10, 8 under 100 | covered by the en-GB name |
| sudoku colpevole | sudoku culprit | no | #4 | 11 / 0 / 0 | 10/10, 10 under 100 | keep colpevole |
| sudoku investigatore | investigator sudoku | no | #5 | 0 / 0 / 0 | 10/10, 10 under 100 | keep investigatore |
| sudoku investigativo | investigative sudoku | no | #8 (pool 33) | 1 / 6 / 0 | 10/10, 10 under 100 | keep investigatore |
| giallo sudoku | crime-fiction sudoku | no | #7 | 0 / 0 / 0 | 10/10, 10 under 100 | keep giallo |
| sudoku giallo | crime-fiction sudoku | no | #8 | 10 / 1 / 0 | 10/10, 10 under 100 | keep giallo |
| risolvi casi | solve cases | 7/2 | #7 | 1k / 297 / 36 | 10/10, 5 under 100 | covered by subtitle |
| sudoku crimine | crime sudoku | no | #10 | 22 / 11 / 0 | 10/10, 9 under 100 | keep crimine |
| sudoku detective | detective sudoku | no | #18 (pool 132) | 11 / 6 / 3 | 10/10, 9 under 100 | keep detective |
| giochi di indagine | investigation games | 8/1 | not top 12 | 553 / 2 / 7 | 7/10, 7 under 100 | add indagine |
| sudoku indagine | investigation sudoku | no | not top 12 | 22 / 0 / 0 | 10/10, 10 under 100 | add indagine |
| sudoku sospettati | sudoku suspects | no | not top 12 | 11 / 6 / 1 | 10/10, 10 under 100 | skip: no hint, no competitor name |
| casi irrisolti | unsolved cases | no | not top 12 | 3 / 2 / – | 9/9, 9 under 100 (only 9 results) | add irrisolti |
| gioco investigativo | investigation game | 13/1 | not top 12 | 293 / 93 / 2 | 10/10, 5 under 100 | add gioco |
| indizi | clues | 6/2 | not top 12 | 3.5k / 26 / 53 | 10/10, 6 under 100 | keep indizi |
| enigmi e misteri | riddles and mysteries | 6/4 | not top 12 | 19 / 243 / 81 | 9/10, 6 under 100 | keep enigmi |
| rompicapo | brain teaser | 9/2 | not top 12 | 36k / 298 / 81k | 8/10, 1 under 100 | drop |
| giochi logica | logic games | 6/1 | not top 12 | 36k / 144 / 17k | 7/10 | drop logica |
| indovinelli | riddles | 11/1 | not top 12 | 1.2k / 34k / 80 | 6/10, 3 under 100 | drop |
| sudoku offline | sudoku offline | 7/1 | – | 25k / 2.8k / 2.8k | 9/10, 2 under 100 | drop offline (en-GB has it) |
| risolvi il caso | solve the case | 4/2 | not top 12 | 1k / 73 / 2.4k | 9/10, 3 under 100 | skip: needs caso, singular of subtitle casi |
| sudoku delitto | crime sudoku | no | not top 12 | 0 / 0 / 0 | 10/10, 10 under 100 | skip: delitto often means murder |

### NL · Netherlands (nl-NL + en-GB)

| Term | Gloss | Hint? | Our rank now | Ratings #1 / #5 / #10 | On topic? | Verdict |
|---|---|---|---|---|---|---|
| mystery sudoku | mystery sudoku | no | #3 | 2 / 1 / 749 | 10/10, 7 under 100 | covered by name |
| sudoku dader | sudoku culprit | no | #4 | 0 / 0 / 0 | 10/10, 10 under 100 | keep dader |
| mysterie sudoku | mystery sudoku | no | #4 | 2 / 1 / 31 | 10/10, 8 under 100 | keep mysterie |
| sudoku zaak | sudoku case | no | #9 | 10 / 1 / 0 | 10/10, 10 under 100 | keep zaak |
| mystery denksport | mystery brain sport | no | #2 | 6k / – / – | 3/3, 2 under 100 (only 3 results) | keep denksport |
| detective spel | detective game | no | #152 (pool 179) | 5 / 2.1k / 20 | 9/10, 7 under 100 | keep spel |
| detective spelletjes | detective games | no | not top 12 | 11 / 4 / 93 | 10/10, 9 under 100 | keep spelletjes |
| detective game | detective game | 3/1 | not top 12 | 13.3k / 127 / 379 | 9/10, 4 under 100 | covered by subtitle |
| sudoku zonder reclame | sudoku without ads | 8/1 | not top 12 | 1 / 1 / 329 | 10/10, 6 under 100 | covered by name + subtitle |
| vind de dader | find the culprit | no | not top 12 | 1 / – / – | 3/3, 3 under 100 (only 3 results) | add vind |
| zaak oplossen | solve the case | no | not top 12 | 0 / 0 / – | 5/5, 5 under 100 (only 5 results) | skip: no hint, no competitor name |
| sudoku verdachte | sudoku suspect | no | not top 12 | 1 / 0 / 0 | 10/10, 10 under 100 | add verdachte |
| misdaad | crime | 7/8 | not top 12 | 0 / 87 / 67 | 6/10, 5 under 100 | keep misdaad |
| detective puzzel | detective puzzle | no | not top 12 | 2.1k / 0 / 2 | 10/10, 6 under 100 | keep puzzel |
| mystery raadsel | mystery riddle | no | #12 | 1k / 5 / 0 | 10/10, 6 under 100 | keep raadsel |
| hersentraining | brain training | 14/1 | not top 12 | 12k / 53 / 547 | 4/10, 1 under 100 | drop |
| logische puzzels | logic puzzles | 8/1 | not top 12 | 1.3k / 85 / 20 | 10/10, 2 under 100 | drop logische |
| sudoku offline | sudoku offline | 7/4 | not top 12 | 44 / 14k / 0 | 9/10, 4 under 100 | drop offline (en-GB has it) |
| speurders | sleuths | 8/1 | not top 12 | 11k / 20k / 3.9k | 0/10 | skip: a classifieds site |
| detective spellen | detective games | no | – (pool 43) | 0 / 437 / 462 | 6/10, 4 under 100 | skip: plural of spel |

## The fields

| Locale | Keywords | Characters | Bytes |
|---|---|---|---|
| es-ES | `culpable,sospechoso,crimen,misterio,sin,anuncios,resolver,caso,investigación,criminal,pista,lógico` | 98 | 100 |
| es-MX | `culpable,sospechoso,crimen,misterio,sin,anuncios,resolver,caso,investigación,criminal,pista,lógico` | 98 | 100 |
| pt-BR | `crime,criminal,caso,resolver,mistério,charadas,culpado,suspeito,investigação,dicas,pista,lógica` | 95 | 99 |
| pt-PT | `crime,criminal,caso,resolver,mistério,charadas,culpado,suspeito,investigação,lógica` | 83 | 87 |
| fr-FR | `mystère,policière,criminelle,coupable,qui,est,le,crime,énigme,suspect,hors,ligne,logique` | 88 | 91 |
| de-DE | `krimi,detektiv,täter,fälle,lösen,ermittler,verdächtige,kriminalfälle,logik,spiele` | 81 | 86 |
| it | `giallo,investigatore,colpevole,crimine,detective,indizi,indagine,enigmi,irrisolti,gioco` | 87 | 87 |
| nl-NL | `dader,mysterie,misdaad,zaak,spel,spelletjes,puzzel,raadsel,vind,verdachte,denksport` | 83 | 83 |

All are at most 100 characters and at most 100 bytes. Apple's help page counts bytes, and whether it indexes past byte
100 is unknown, so the accented fields were kept at 100 bytes or less. pt-PT, fr-FR, de-DE, it and nl-NL leave room on
purpose: the remaining candidates there had no hint and no competitor name (see below). The rules hold: no spaces after commas, no word from
the name or subtitle, no murder word, nothing caught by FREE, no brand. Three judgement calls for the owner:
- es "lógico" next to the subtitle word "lógica": a different word (adjective, not the noun's plural).
- nl "spel" plus "spelletjes": both were already in the field; one is the diminutive plural.
- fr "est" and "le": function words, added because "qui est le coupable" (hint 8/2) does not find us without them,
  while "qui coupable" puts us #6 of 7.

No subtitle suggestion. Where the subtitle forms the search phrase, it already ranks ("sudoku acertijos" ES #7, "risolvi
casi" IT #7, "sudoku détective" FR #12, "sudoku detektivspiel" DE #9). No alternative was clearly better.

## Dropped, and why

| Locale | Dropped | Why |
|---|---|---|
| es-ES | conexión, rompecabezas, enigma | "sudoku sin conexión" top 10 is 133k/316/32k ratings, and we are not in its top 12 (MX "sudoku sin conexion": not in the API top 200). "rompecabezas" is held by Brain Test-type apps. "sudoku enigma" has a pool of 104 and no phrase hint; it was cut for room |
| es-MX | internet, rompecabezas, enigma | "sudoku sin internet": 18k-163k ratings at the top, not in the top 200 |
| pt-BR | raciocínio, offline | "raciocínio lógico" 10/1 has a top 10 of 165k/260k/12k ratings, 0 under 100. "sudoku offline": not in the top 200, and en-GB has offline |
| pt-PT | raciocínio, offline, puzzle, quebra, cabeças, detective, pista | "quebra cabeças" has 1 of 10 under 100 ratings. puzzle, detective and offline are carried by en-GB. pista has no Portugal hint |
| fr-FR | casse, tête, réflexion | "casse tête" and "jeu de réflexion": 0 of 10 under 100 ratings (Brain Test 149k, Impulse 60k) |
| de-DE | denkspiele, knobelspiele, gehirnjogging, logikrätsel, offline | 0 of 10 under 100 ratings in each of the first four top 10s, and we are not in their top 12; "sudoku offline" has 2 of 10, and en-GB carries offline |
| it | rompicapo, logica, indovinelli, offline | 1 to 3 of 10 under 100 ratings, next to Impulse (36k) and Brain Test (62k); "sudoku offline" not in the API top 200 |
| nl-NL | hersentraining, logische, offline | "hersentraining" and "logische puzzels": at most 2 of 10 under 100 ratings. Offline is carried by en-GB |

Not added, on purpose:
- crímenes (es) and criminais (pt): the plurals of crimen and criminal, which the rules forbid. They would help with
  "resolver crímenes" (hint 4/4) and "casos criminais" (hint 4/1).
- quién/fue, quem/foi, wie (nl): their pools are tiny (1 to 4 apps), but the hints never show "quién fue", "quem foi" or
  "wie is de dader".
- trouver (fr, "trouver le coupable": 8 results, all 0 ratings), finden (de, "täter finden": 10 of 10 under 100),
  sospettato (it), oplossen (nl, "zaak oplossen": 5 results) and dedução (pt): small and weak, but no hint and no
  on-topic competitor name. Easy to add if the owner accepts tiny-pool terms without that evidence.
- caso (it): the singular of the subtitle word "casi" (for "risolvi il caso", 4/2).
- delitto (it): "sudoku del delitto" is a name phrase of four tiny competitors. But "delitto" usually means murder in
  Italian mystery titles. It is not in the MURDER regex. The owner's call.
- noir: the hints are dark-mode and photo apps, and the word does not describe the game.
- speurder (nl): the hint "speurders" is a classifieds site.
- Murder words, brands and "Murdoku" as usual.

## What to measure after 1.7.1

Seven and fourteen days after approval: the real-store top 12 for every row above (script and raw data from this run:
`hints.py`, `web.py`, `search.py`, raw JSON; scratchpad only, not in the repo). Expected first movers: "sudoku criminal"
(es), "sudoku investigación" and "juegos de investigación" (es), "giochi di indagine"/"sudoku indagine" (it), "sudoku
ermittler"/"ermittler" (de), "qui est le coupable" (fr), "sudoku com dicas" (br), "vind de dader" (nl).

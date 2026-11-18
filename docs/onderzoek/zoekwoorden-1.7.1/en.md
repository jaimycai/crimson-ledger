# Keywords 1.7.1, English (en-US and en-GB)

18 November 2026, measured 22:30 to 23:40 CET against the live version 1.7.0. Proposal only: nothing is uploaded. The
fields are in `store/metadata/zoekwoorden-1.7.1/en.json`. Name and subtitle stay as they are.

## In short

1. **en-GB does most of the work.** The UK, Canada, Australia and India all show and index the en-GB text (we have no
   en-CA or en-AU). en-US counts only in the US (and, per the earlier research, Japan).
2. **The field alone will not reach a top 10 at 0 ratings.** Of about 100 terms checked, we are in the store's top 12
   only for "mystery sudoku" (US #3), "crime puzzle" (CA #12) and "find the culprit" (IN #12). Words that are already
   in the field rank 24 ("find the culprit"), 47 ("culprit") and 152 ("whodunnit") in the US API, or not at all
   ("deduction"). Apps with the term in their name and a few downloads beat us. The field decides where we climb first
   once ratings and downloads come in.
3. **The weakest real terms, on topic:** culprit and find the culprit, whodunnit, mystery case, crime puzzle and crime
   solving, investigation (games), solve crime and solve mystery, deduction. In GB, CA, AU and IN most of their top 10
   are apps under 100 ratings.
4. **Out:** games (the category is already searchable), brain, adults, variants, and offline in en-US. **In:**
   investigation, solve, find (en-GB), cosy (en-GB), whodunit (en-US).
5. **No subtitle change.** Nothing in the data points to a clearly better subtitle. Our problem is ratings and
   downloads, not wording: the US API does not list us at all for "detective logic", the first two words of the
   current subtitle.

## Method

1. **Fields per store.** Apple's "App Store localizations" table, fetched with curl. Checked with words that sit in one
   field only ("crimson ledger <word>", control word "zzqqvv"), and with the iTunes lookup per store to see which text
   each store shows.
2. **Real search terms.** Apple's search hints (`MZSearchHints`) per store for the seeds detective, mystery, logic,
   puzzle, sudoku, whodunit, deduction, clue, case, suspect, brain, crime, riddle, cozy, noir and grid, each on its own
   and followed by " a" to " z", plus 17 short extras and the 104 full candidate terms.
3. **Competition.** For 104 candidate terms in 5 stores: the App Store web search page
   (`apps.apple.com/<cc>/iphone/search?term=`), which gives the real store order of the first 12 results with Apple's
   rounded rating counts, and the iTunes Search API (`limit=200`) for our position where the API allowed it.
4. **Weak top 10:** several apps under about 100 ratings, or off-topic apps. **On topic:** how many of the top 10 have a
   detective, mystery, logic or puzzle word in their name or subtitle (automatic; a skincare app called "Culprit" or a
   tax "deduction" app counts as off-topic).
5. **Fields** built per locale from single words that combine with "Mystery Sudoku" and "Detective logic puzzle, no
   ads", most valuable first. Checked with the MURDER, FREE and BRANDS regexes read from `store/metadata/check-1.6.js`,
   plus length, spaces, words already in name or subtitle, and singular/plural pairs.

## Which fields count in which store

| Store | Apple's table | Measured | English field that counts |
|---|---|---|---|
| US | English (US); also Arabic, Chinese (Simpl. and Trad.), French, Korean, Portuguese (Brazil), Russian, Spanish (Mexico), Vietnamese | fr-FR word "criminelle" and es-MX word "acertijos" find us | en-US |
| GB | English (UK) | "criminelle" does not find us | en-GB |
| CA | English (Canada); also French (Canada) | We have neither. The store shows the en-GB text ("cosy whodunnit", "9.30pm"). "criminelle" (fr-FR) finds us, "acertijos" (es-MX) does not | en-GB, plus fr-FR |
| AU | English (Australia); also English (UK) | The store shows the en-GB text. "criminelle" does not find us | en-GB |
| IN | English (UK); also Bangla, Gujarati, Hindi, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, Urdu | "riddle" (in hi, te and ur-PK) finds us; te "thriller", ur "investigation", mr "reasoning" and bn "goyenda" give 0 results, so of these only hi counts | en-GB, plus hi |

- **English (UK) is the default language in 135 stores and an extra language in 37 more**, among them France, Germany,
  Italy, Spain, the Netherlands, Brazil, Mexico, Korea, Russia, Hong Kong, Taiwan, Sweden and Switzerland. English
  (US) is an extra language only in Japan. Every en-GB word therefore also counts far outside these five stores.
- **Category words count.** "crimson ledger board" finds us at #1 in the US and GB although "board" is in no field
  (our subcategory is Board); "crimson ledger strategy" does not. So `games` in the field adds nothing.
- **Descriptions do not count** ("spoil", "confess", "ryokan": no hit). **In-app event text seems to:** "find" is only
  in the en-US keywords, yet "crimson ledger find" finds us in all five stores. The Case of the Week event says "Can
  you find the culprit?" and runs until 25 November. After that, en-GB needs `find` in the field.
- Not resolved: "crimson ledger brain" also finds us in the US, while "brain" sits only in en-GB, hi and ur-PK. Either
  the US reads more than Apple's table says, or Apple matched it another way.

## Did the hints endpoint work?

Yes, with a limit. It answers with up to 10 suggestions per prefix. After about 400 requests at 0.6 s apart it returned
HTTP 429 with a Retry-After of 19 to 28 minutes. At 1.5 s apart it ran for about 1,000 more requests before the next
29-minute block, where the run stopped. Prefixes answered: US 462, GB 506, IN 506, CA 115, AU 90. GB and IN got
everything; the US all but about 50 of the a to z extensions (from "noir u" on); CA and AU got the seeds, the extras
and the full candidate terms, but almost none of the a to z extensions. Hints mix search terms and app names; only
search terms count as evidence here.

The iTunes Search API was the bigger problem: HTTP 403 after a few dozen calls, then one answer per 30 to 90 seconds.
Our API rank is known for 47 terms, all in the US. The web search page filled in the top 10, but it shows only 12
results.

## Candidate terms per store

How to read: **Seen as hint?** = the shortest prefix that suggested the term and its position ("culprit" #1 = typing
"culprit" shows it first); "no" = asked, not suggested. **Our rank now** = place on the store page (top 12) or in the
iTunes API (top 200); "not in API list" = the API returns up to 200 apps and we are not among them; "–" = not in the
store's top 12 and the API was not asked. **Ratings** = rating counts of #1, #5 and #10 on the store page, as Apple
rounds them; "0" = no count shown. **On topic** = top-10 apps that are detective, mystery, logic or puzzle games.

### United States (US)

| Term | Seen as hint? | Our rank now | Ratings #1 / #5 / #10 | On topic | Verdict |
|---|---|---|---|---|---|
| mystery sudoku | "mystery sudoku" #2 | 3 (store), 8 (API) | 0 / 3 / 1 (7 under 100) | 7/10 | name phrase: covered |
| sudoku detective | "sudoku detective" #4 | 55 (API) | 15 / 39K / 59K (3 under 100) | 8/10 | name + subtitle: covered |
| detective sudoku | "detective sudoku" #1 | 88 (API) | 10 / 35K / 18K (3 under 100) | 8/10 | name + subtitle: covered |
| detective puzzle | "detective p" #2 | not in API list | 4.1K / 0 / 1 (3 under 100) | 9/10 | subtitle: covered, strong |
| logic puzzle | "logic" #1 | not in API list | 39K / 24K / 36 (2 under 100) | 7/10 | subtitle: covered, strong |
| sudoku no ads | "sudoku" #3 | not in API list | 12K / 4.4K / 60 (2 under 100) | 9/10 | name + subtitle: covered |
| whodunnit | "whodunnit" #1 | 152 (API) | 399 / 0 / 0 (5 under 100) | 10/10 | keep |
| whodunit | "whodunit" #3 | not in API list | 399 / 3 / 2 (6 under 100) | 9/10 | add (en-US) |
| culprit | "culprit" #1 | 47 (API) | 219 / 0 / 0 (7 under 100) | 4/10 | keep |
| find the culprit | "culprit" #8 | 24 (API) | 1.2K / 3K / 203 (5 under 100) | 8/10 | keep find |
| deduction | "deduction" #4 | not in API list | 0 / 0 / 0 (9 under 100) | 5/10 | keep |
| logical deduction games | "deduction" #5 | – | 59K / 0 / 24K (2 under 100) | 9/10 | via deduction |
| crime puzzle | "crime p" #2 | not in API list | 2.6K / 22 / 0 (5 under 100) | 10/10 | keep crime |
| crime solving | "crime s" #10 | not in API list | 11K / 36K / 0 (5 under 100) | 10/10 | keep crime, solving |
| investigation | not asked | not in API list | 11K / 159 / 1 (5 under 100) | 8/10 | add |
| crime investigation | "crime i" #3 | – | 11K / 153 / 0 (3 under 100) | 10/10 | via crime, investigation |
| solve crimes | "solve crimes" #1 | – | 11K / 36K / 8.3K (4 under 100) | 10/10 | add solve |
| solve mystery | "solve mystery" #2 | – | 11K / 4.5K / 110K (4 under 100) | 9/10 | via solve |
| mystery case | "mystery c" #2 | – | 19 / 16 / 0 (7 under 100) | 9/10 | keep case |
| mystery solving games | "mystery s" #3 | not in API list | 11K / 56K / 59K (1 under 100) | 10/10 | via solving |
| cozy mystery | no | 94 (API) | 0 / 6.5K / 11K (3 under 100) | 8/10 | keep cozy |
| cozy detective | no | not in API list | 50 / 11 / 8 (9 under 100) | 10/10 | via cozy |
| cosy games | "cosy games" #1 | – | 8.8K / 9.5K / 5 (3 under 100) | 0/10 | not in en-US |
| daily puzzle | "daily puzzle" #2 | not in API list | 35K / 3 / 3 (5 under 100) | 7/10 | keep daily |
| logic grid | "logic" #10 | not in API list | 39K / 0 / 1 (4 under 100) | 10/10 | keep grid |
| sudoku offline | "sudoku" #5 | not in API list | 1.9M / 665K / 39K (2 under 100) | 7/10 | drop offline (en-US) |
| detective games | "detective" #1 | not in API list | 11K / 2.9K / 159 (1 under 100) | 10/10 | drop games: category is indexed; strong |
| mystery games | "mystery" #1 | not in API list | 56K / 268K / 849 (0 under 100) | 9/10 | name word; strong |
| puzzle games for adults | "puzzle" #3 | – | 853K / 951 / 497K (0 under 100) | 5/10 | drop adults: strong |
| sudoku variants | "sudoku v" #1 | not in API list | 1.7K / 39K / 59K (1 under 100) | 6/10 | drop variants: wants rule variants |
| brain puzzle | "brain" #2 | – | 33K / 1.5M / 80K (0 under 100) | 4/10 | drop brain: strong |
| suspect | "suspect" #3 | not in API list | 57K / 1 / 1.4K (6 under 100) | 7/10 | drop: brand-led, strong #1 |
| sleuth | no | not in API list | 0 / 0 / 1 (9 under 100) | 2/10 | drop: no hint, off-topic |
| inspector | "inspector" #2 | not in API list | 4 / 1 / 0 (9 under 100) | 0/10 | drop: off-topic |
| detective story | "detective s" #1 | not in API list | 53 / 49 / 5.8K (6 under 100) | 10/10 | drop: story games |
| logical reasoning | "logical reasoning" #1 | – | 13 / 0 / 0 (7 under 100) | 4/10 | drop: aptitude tests |
| who did it | "who did it" #1 | not in API list | 34 / 0 / 175K (4 under 100) | 8/10 | drop: needs who+did+it, no room |
| mystery riddles | "mystery r" #6 | – | 614 / 0 / 7.3K (3 under 100) | 9/10 | drop riddle: no room |

### United Kingdom (GB)

| Term | Seen as hint? | Our rank now | Ratings #1 / #5 / #10 | On topic | Verdict |
|---|---|---|---|---|---|
| mystery sudoku | no | – | 0 / 15k / 8.7k (3 under 100) | 7/10 | name phrase: covered |
| sudoku detective | no | – | 2 / 15k / 12 (3 under 100) | 8/10 | name + subtitle: covered |
| detective sudoku | "detective sudoku" #1 | – | 0 / 9.8k / 860 (3 under 100) | 7/10 | name + subtitle: covered |
| detective puzzle | no | – | 6.7k / 0 / 6 (6 under 100) | 10/10 | subtitle: covered, strong |
| logic puzzle | "logic" #2 | – | 6.6k / 3.1k / 0 (4 under 100) | 7/10 | subtitle: covered, strong |
| sudoku no ads | "sudoku" #5 | – | 813 / 511 / 9.8k (1 under 100) | 7/10 | name + subtitle: covered |
| whodunnit | no | – | 119 / 0 / 22 (9 under 100) | 9/10 | keep |
| whodunit | "whodunit" #3 | – | 119 / 0 / 0 (9 under 100) | 9/10 | en-GB keeps whodunnit only |
| culprit | "culprit" #1 | – | 22k / 284 / 0 (8 under 100) | 6/10 | keep |
| find the culprit | "culprit" #5 | – | 0 / 45 / 0 (7 under 100) | 8/10 | add find |
| deduction | no | – | 0 / 0 / 0 (8 under 100) | 7/10 | keep |
| logical deduction games | "deduction g" #7 | – | 6.7k / 6.6k / 0 (5 under 100) | 9/10 | via deduction |
| crime puzzle | no | – | 290 / 0 / 58 (8 under 100) | 10/10 | keep crime |
| crime solving | "crime s" #5 | – | 8.6k / 951 / 4 (5 under 100) | 10/10 | keep crime, solving |
| investigation | "investigation" #3 | – | 8.6k / 71k / 0 (6 under 100) | 9/10 | add |
| crime investigation | "crime" #6 | – | 38 / 951 / 168 (4 under 100) | 8/10 | via crime, investigation |
| solve crimes | "solve" #3 | – | 8.6k / 80 / 0 (7 under 100) | 10/10 | add solve |
| solve mystery | "solve mystery" #1 | – | 8.6k / 0 / 4.7k (4 under 100) | 9/10 | via solve |
| mystery case | "mystery c" #2 | – | 87 / 1 / 0 (9 under 100) | 9/10 | keep case |
| mystery solving games | "mystery s" #3 | – | 3 / 14k / 16k (4 under 100) | 10/10 | via solving |
| cozy mystery | no | – | 17 / 134 / 5 (7 under 100) | 8/10 | keep cozy |
| cozy detective | no | – | 17 / 0 / 22 (9 under 100) | 9/10 | via cozy |
| cosy games | "cosy" #1 | – | 4.4k / 322 / 32 (3 under 100) | 0/10 | add cosy: filler, weak (off-topic top 10) |
| daily puzzle | "daily puzzle" #1 | – | 7.2k / 8.8k / 0 (6 under 100) | 5/10 | keep daily |
| logic grid | "logic g" #4 | – | 3.3k / 3.1k / 0 (2 under 100) | 10/10 | keep grid |
| sudoku offline | "sudoku" #6 | – | 336k / 66k / 0 (1 under 100) | 9/10 | keep offline |
| detective games | "detective" #1 | – | 8.6k / 52 / 80 (4 under 100) | 10/10 | drop games: category is indexed; strong |
| mystery games | "mystery" #1 | – | 14k / 33 / 27k (2 under 100) | 8/10 | name word; strong |
| puzzle games for adults | "puzzle" #2 | – | 75k / 22k / 134k (0 under 100) | 5/10 | drop adults: strong |
| sudoku variants | "sudoku variants" #3 | – | 375 / 260 / 10k (1 under 100) | 5/10 | drop variants: wants rule variants |
| brain puzzle | "brain" #1 | – | 3.2k / 2k / 892 (1 under 100) | 5/10 | drop brain: strong |
| suspect | "suspect" #3 | – | 8.6k / 0 / 0 (8 under 100) | 10/10 | drop: brand-led, strong #1 |
| sleuth | no | – | 0 / 1 / 0 (10 under 100) | 5/10 | drop: no hint, off-topic |
| inspector | "inspector" #1 | – | 0 / 0 / 0 (10 under 100) | 0/10 | drop: off-topic |
| detective story | no | – | 6 / 71k / 0 (5 under 100) | 10/10 | drop: story games |
| logical reasoning | "logical reasoning" #1 | – | 7 / 0 / 0 (9 under 100) | 5/10 | drop: aptitude tests |
| who did it | "who did" #1 | – | 4 / 2.8k / 0 (8 under 100) | 5/10 | drop: needs who+did+it, no room |
| mystery riddles | "mystery r" #4 | – | 205 / 91 / 23 (5 under 100) | 7/10 | drop riddle: no room |

### Canada (CA)

| Term | Seen as hint? | Our rank now | Ratings #1 / #5 / #10 | On topic | Verdict |
|---|---|---|---|---|---|
| mystery sudoku | no | – | 1 / 8K / 15K (4 under 100) | 6/10 | name phrase: covered |
| sudoku detective | no | – | 16 / 258K / 5.8K (3 under 100) | 9/10 | name + subtitle: covered |
| detective sudoku | "detective s" #3 | – | 5 / 5.8K / 2.6K (3 under 100) | 7/10 | name + subtitle: covered |
| detective puzzle | no | – | 312 / 5 / 10 (7 under 100) | 10/10 | subtitle: covered, strong |
| logic puzzle | "logic" #1 | – | 7.3K / 4.7K / 10 (3 under 100) | 6/10 | subtitle: covered, strong |
| sudoku no ads | "sudoku" #6 | – | 55 / 3K / 0 (2 under 100) | 9/10 | name + subtitle: covered |
| whodunnit | no | – | 11 / 2 / 1 (9 under 100) | 9/10 | keep |
| whodunit | no | – | 11 / 0 / 42 (10 under 100) | 9/10 | en-GB keeps whodunnit only |
| culprit | "culprit" #1 | – | 0 / 4 / 0 (8 under 100) | 5/10 | keep |
| find the culprit | "culprit" #4 | – | 0 / 33 / 0 (7 under 100) | 8/10 | add find |
| deduction | no | – | 1.9K / 39K / 22 (6 under 100) | 5/10 | keep |
| logical deduction games | "deduction game" #5 | – | 7.3K / 1 / 3 (6 under 100) | 8/10 | via deduction |
| crime puzzle | no | 12 (store) | 312 / 88 / 1 (6 under 100) | 10/10 | keep crime |
| crime solving | "crime" #3 | – | 1K / 19 / 1 (7 under 100) | 9/10 | keep crime, solving |
| investigation | "investigation" #2 | – | 1K / 6K / 0 (6 under 100) | 8/10 | add |
| crime investigation | not asked | – | 6K / 10 / 124 (5 under 100) | 9/10 | via crime, investigation |
| solve crimes | "solve" #6 | – | 1K / 6K / 0 (6 under 100) | 10/10 | add solve |
| solve mystery | "solve" #7 | – | 1K / 1 / 0 (7 under 100) | 9/10 | via solve |
| mystery case | "mystery" #10 | – | 1 / 1.3K / 626 (7 under 100) | 9/10 | keep case |
| mystery solving games | no | – | 1K / 1 / 1 (6 under 100) | 10/10 | via solving |
| cozy mystery | no | – | 0 / 43 / 3.6K (7 under 100) | 7/10 | keep cozy |
| cozy detective | no | – | 43 / 2 / 0 (10 under 100) | 9/10 | via cozy |
| cosy games | "cosy" #2 | – | 12 / 4.3K / 1.6K (5 under 100) | 1/10 | add cosy: filler, weak (off-topic top 10) |
| daily puzzle | "daily puzzle" #1 | – | 5.8K / 7 / 0 (4 under 100) | 6/10 | keep daily |
| logic grid | "logic" #10 | – | 5.2K / 2 / 1.8K (1 under 100) | 10/10 | keep grid |
| sudoku offline | "sudoku" #4 | – | 36K / 148 / 27 (4 under 100) | 8/10 | keep offline |
| detective games | "detective" #1 | – | 1K / 320 / 281 (3 under 100) | 10/10 | drop games: category is indexed; strong |
| mystery games | "mystery" #1 | – | 32K / 1.1K / 19K (2 under 100) | 9/10 | name word; strong |
| puzzle games for adults | no | – | 28K / 2.2K / 9.8K (0 under 100) | 2/10 | drop adults: strong |
| sudoku variants | no | – | 268 / 37K / 0 (3 under 100) | 5/10 | drop variants: wants rule variants |
| brain puzzle | "brain" #1 | – | 2.3K / 1.2K / 7.4K (3 under 100) | 6/10 | drop brain: strong |
| suspect | "suspect" #1 | – | 4.9K / 1 / 0 (8 under 100) | 9/10 | drop: brand-led, strong #1 |
| sleuth | no | – | 0 / 0 / 0 (10 under 100) | 5/10 | drop: no hint, off-topic |
| inspector | "inspector" #1 | – | 10 / 0 / 0 (10 under 100) | 0/10 | drop: off-topic |
| detective story | no | – | 6 / 1 / 320 (6 under 100) | 10/10 | drop: story games |
| logical reasoning | no | – | 3 / 7.3K / 0 (9 under 100) | 2/10 | drop: aptitude tests |
| who did it | "who did" #1 | – | 7 / 62 / 14K (7 under 100) | 7/10 | drop: needs who+did+it, no room |
| mystery riddles | not asked | – | 107 / 19K / 15 (7 under 100) | 8/10 | drop riddle: no room |

### Australia (AU)

| Term | Seen as hint? | Our rank now | Ratings #1 / #5 / #10 | On topic | Verdict |
|---|---|---|---|---|---|
| mystery sudoku | no | – | 0 / 16K / 6.5K (2 under 100) | 7/10 | name phrase: covered |
| sudoku detective | no | – | 1 / 7.8K / 8.8K (3 under 100) | 8/10 | name + subtitle: covered |
| detective sudoku | "detective sudoku" #1 | – | 0 / 7.8K / 18 (3 under 100) | 6/10 | name + subtitle: covered |
| detective puzzle | no | – | 124 / 1 / 0 (7 under 100) | 10/10 | subtitle: covered, strong |
| logic puzzle | "logic" #1 | – | 2.7K / 1.2K / 2 (4 under 100) | 7/10 | subtitle: covered, strong |
| sudoku no ads | "sudoku" #3 | – | 263 / 3.7K / 11K (4 under 100) | 9/10 | name + subtitle: covered |
| whodunnit | no | – | 11 / 1 / 1 (9 under 100) | 10/10 | keep |
| whodunit | no | – | 16 / 11 / 1 (10 under 100) | 9/10 | en-GB keeps whodunnit only |
| culprit | "culprit" #1 | – | 0 / 1 / 45 (8 under 100) | 6/10 | keep |
| find the culprit | "culprit" #4 | – | 1 / 17 / 0 (9 under 100) | 8/10 | add find |
| deduction | no | – | 1.2K / 0 / 1 (9 under 100) | 2/10 | keep |
| logical deduction games | "deduction game" #4 | – | 2.7K / 2.6K / 0 (5 under 100) | 9/10 | via deduction |
| crime puzzle | no | – | 124 / 1 / 4 (7 under 100) | 10/10 | keep crime |
| crime solving | "crime solving" #1 | – | 886 / 17K / 119 (6 under 100) | 10/10 | keep crime, solving |
| investigation | "investigation" #2 | – | 886 / 69 / 0 (6 under 100) | 10/10 | add |
| crime investigation | not asked | – | 295 / 354 / 0 (5 under 100) | 8/10 | via crime, investigation |
| solve crimes | "solve" #3 | – | 886 / 0 / 0 (6 under 100) | 10/10 | add solve |
| solve mystery | "solve" #5 | – | 295 / 0 / 250 (5 under 100) | 9/10 | via solve |
| mystery case | not asked | – | 295 / 2.8K / 0 (8 under 100) | 8/10 | keep case |
| mystery solving games | no | – | 2.2K / 2 / 1 (6 under 100) | 10/10 | via solving |
| cozy mystery | no | – | 1 / 0 / 69 (8 under 100) | 7/10 | keep cozy |
| cozy detective | no | – | 0 / 1 / 0 (9 under 100) | 9/10 | via cozy |
| cosy games | "cosy" #2 | – | 2.4K / 45 / 2 (4 under 100) | 1/10 | add cosy: filler, weak (off-topic top 10) |
| daily puzzle | "daily puzzle" #1 | – | 2.7K / 1 / 0 (6 under 100) | 7/10 | keep daily |
| logic grid | "logic grid" #2 | – | 1.5K / 1 / 393 (3 under 100) | 10/10 | keep grid |
| sudoku offline | "sudoku" #4 | – | 152K / 0 / 0 (7 under 100) | 7/10 | keep offline |
| detective games | "detective" #1 | – | 886 / 2.8K / 140 (4 under 100) | 10/10 | drop games: category is indexed; strong |
| mystery games | "mystery" #1 | – | 17K / 2.2K / 1.8K (2 under 100) | 9/10 | name word; strong |
| puzzle games for adults | no | – | 7.3K / 12K / 46K (1 under 100) | 3/10 | drop adults: strong |
| sudoku variants | no | – | 179 / 78 / 5.1K (3 under 100) | 6/10 | drop variants: wants rule variants |
| brain puzzle | "brain" #2 | – | 1.5K / 90K / 16K (1 under 100) | 4/10 | drop brain: strong |
| suspect | "suspect" #2 | – | 2.1K / 1 / 0 (7 under 100) | 10/10 | drop: brand-led, strong #1 |
| sleuth | no | – | 0 / 2 / 0 (10 under 100) | 5/10 | drop: no hint, off-topic |
| inspector | "inspector" #7 | – | 0 / 0 / 0 (10 under 100) | 0/10 | drop: off-topic |
| detective story | no | – | 2 / 2 / 4 (8 under 100) | 10/10 | drop: story games |
| logical reasoning | "logic" #7 | – | 9 / 2 / 0 (8 under 100) | 3/10 | drop: aptitude tests |
| who did it | "who did it" #5 | – | 1 / 7.1K / 7 (6 under 100) | 6/10 | drop: needs who+did+it, no room |
| mystery riddles | not asked | – | 62 / 2 / 19 (7 under 100) | 9/10 | drop riddle: no room |

### India (IN)

| Term | Seen as hint? | Our rank now | Ratings #1 / #5 / #10 | On topic | Verdict |
|---|---|---|---|---|---|
| mystery sudoku | no | – | 0 / 382k / 2.1k (6 under 100) | 8/10 | name phrase: covered |
| sudoku detective | no | – | 0 / 18 / 4 (10 under 100) | 10/10 | name + subtitle: covered |
| detective sudoku | "detective sudoku" #1 | – | 0 / 0 / 0 (10 under 100) | 10/10 | name + subtitle: covered |
| detective puzzle | no | – | 51 / 4 / 288 (7 under 100) | 10/10 | subtitle: covered, strong |
| logic puzzle | "logic" #6 | – | 1 / 0 / 0 (6 under 100) | 7/10 | subtitle: covered, strong |
| sudoku no ads | "sudoku n" #1 | – | 86 / 1 / 0 (8 under 100) | 7/10 | name + subtitle: covered |
| whodunnit | no | – | 4 / 84 / 1 (10 under 100) | 10/10 | keep |
| whodunit | no | – | 18 / 0 / 0 (10 under 100) | 10/10 | en-GB keeps whodunnit only |
| culprit | "culprit" #2 | – | 0 / 2.2k / 29 (9 under 100) | 7/10 | keep |
| find the culprit | "culprit" #5 | 12 (store) | 32 / 0 / 0 (10 under 100) | 6/10 | add find |
| deduction | no | – | 0 / 0 / 3.2k (8 under 100) | 6/10 | keep |
| logical deduction games | "deduction" #10 | – | 1.6k / 141 / 8 (6 under 100) | 10/10 | via deduction |
| crime puzzle | no | – | 2.5k / 0 / 1 (9 under 100) | 10/10 | keep crime |
| crime solving | no | – | 3.8k / 1.2k / 0 (6 under 100) | 7/10 | keep crime, solving |
| investigation | "investigation" #2 | – | 2.5k / 0 / 0 (5 under 100) | 8/10 | add |
| crime investigation | "crime" #1 | – | 2.5k / 2 / 5 (4 under 100) | 10/10 | via crime, investigation |
| solve crimes | no | – | 2 / 3.8k / 62 (5 under 100) | 10/10 | add solve |
| solve mystery | "solve" #9 | – | 84 / 2.5k / 62 (4 under 100) | 10/10 | via solve |
| mystery case | "mystery c" #4 | – | 326 / 756 / 0 (7 under 100) | 8/10 | keep case |
| mystery solving games | "mystery" #3 | – | 11k / 84 / 2.7k (4 under 100) | 9/10 | via solving |
| cozy mystery | no | – | 2.7k / 1 / 7 (8 under 100) | 5/10 | keep cozy |
| cozy detective | no | – | 4.6k / 0 / 0 (8 under 100) | 8/10 | via cozy |
| cosy games | "cosy" #2 | – | 1.2k / 19 / 24 (5 under 100) | 2/10 | add cosy: filler, weak (off-topic top 10) |
| daily puzzle | "daily puzzle" #1 | – | 149 / 50 / 0 (6 under 100) | 4/10 | keep daily |
| logic grid | "logic g" #2 | – | 46 / 1 / 421 (7 under 100) | 10/10 | keep grid |
| sudoku offline | "sudoku" #3 | – | 13k / 4 / 1 (5 under 100) | 8/10 | keep offline |
| detective games | "detective" #1 | – | 288 / 1.2k / 113 (2 under 100) | 10/10 | drop games: category is indexed; strong |
| mystery games | "mystery" #1 | – | 1.2k / 756 / 84 (1 under 100) | 9/10 | name word; strong |
| puzzle games for adults | "puzzle games for adults" #1 | – | 3.2k / 2.6k / 421 (1 under 100) | 3/10 | drop adults: strong |
| sudoku variants | no | – | 66 / 3 / 0 (10 under 100) | 6/10 | drop variants: wants rule variants |
| brain puzzle | "brain" #2 | – | 1.9k / 5.1k / 4 (2 under 100) | 5/10 | drop brain: strong |
| suspect | "suspect" #2 | – | 722 / 528 / 0 (5 under 100) | 6/10 | drop: brand-led, strong #1 |
| sleuth | no | – | 0 / 0 / 0 (9 under 100) | 7/10 | drop: no hint, off-topic |
| inspector | no | – | 0 / 0 / 0 (10 under 100) | 0/10 | drop: off-topic |
| detective story | no | – | 1 / 9 / 29 (8 under 100) | 10/10 | drop: story games |
| logical reasoning | "logic" #7 | – | 120 / 0 / 0 (8 under 100) | 3/10 | drop: aptitude tests |
| who did it | no | – | 0 / 125 / 1.4k (5 under 100) | 4/10 | drop: needs who+did+it, no room |
| mystery riddles | "mystery r" #7 | – | 2 / 7k / 1.6k (4 under 100) | 10/10 | drop riddle: no room |

## Chosen fields

**en-US** (96 characters, 96 bytes; counts in the US)

`whodunnit,whodunit,culprit,find,deduction,crime,investigation,solving,solve,case,cozy,daily,grid`

- Was: `games,whodunnit,deduction,culprit,crime,grid,cozy,offline,daily,case,solving,adults,find,variants`
- Out: games, offline, adults, variants. In: whodunit, investigation, solve.
- With the name and subtitle this covers, among others: whodunnit, whodunit, culprit, find the culprit, deduction
  puzzle, crime puzzle, crime mystery, crime solving, crime investigation, investigation games, solve crimes, solve
  mystery, mystery case, mystery solving games, cozy mystery, cozy detective, daily puzzle, logic grid.
- whodunit next to whodunnit because in the US the field word "whodunnit" ranks us 152 for "whodunnit" but not at all
  for "whodunit", and the US top 10 for "whodunit" has 6 apps under 100 ratings.

**en-GB** (100 characters, 100 bytes; counts in GB, CA, AU, IN and about 170 other stores)

`whodunnit,culprit,find,deduction,crime,investigation,solving,solve,case,cozy,daily,grid,offline,cosy`

- Was: `games,whodunnit,deduction,culprit,crime,grid,cozy,offline,daily,case,solving,brain,adults,variants`
- Out: games, brain, adults, variants. In: find, investigation, solve, cosy.
- `find` keeps "find the culprit" after the Case of the Week event ends on 25 November. India already lists us at #12
  for that term, and its top 10 is 10 of 10 apps under 100 ratings.
- `offline` stays here (not in en-US): "sudoku offline" is a top-6 hint in all four stores, and the top 10 is weaker
  outside the UK (AU 7, IN 5, CA 4 apps under 100 ratings).
- `cosy` is the weakest word in the field: the British spelling of a word our en-GB description uses, and "cosy games"
  is the first or second hint for "cosy" in all five stores, but that top 10 is cosy life games. It fills the last 5
  characters.

Both fields pass: at most 100 characters (all ASCII, so also 100 bytes), commas without spaces, no word from the name
or subtitle, no singular/plural pair, no "app", no "free", no competitor name, and no match for MURDER, FREE or BRANDS
from `check-1.6.js`.

**Subtitle:** no suggestion (`null`). The one term that does better than the rest without being in our name is "find
the culprit" (US API 24, IN store 12), but swapping the subtitle for it would drop "detective" and "no ads", which
carry "sudoku detective" (US 55) and "detective sudoku" (US 88). The data does not clearly favour either.

## Where we expect the most

1. **find the culprit.** A hint in all five stores (#4 to #8 after "culprit"); 5 to 10 of the top 10 under 100
   ratings; we are already 24 in the US API and #12 on the Indian store page.
2. **culprit.** First hint for "culprit" in the US, GB, CA and AU, second in IN; 7 to 9 of the top 10 under 100,
   and 3 to 6 of them are not games (skincare, print, pattern apps); US API 47.
3. **whodunnit / whodunit.** 9 or 10 of the top 10 under 100 ratings in GB, CA, AU and IN, 5 or 6 in the US; nearly
   all on topic; US API 152 for whodunnit.
4. **mystery case.** Second hint after "mystery c" in the US and GB, fourth in IN; 7 to 9 of the top 10 under 100.
5. **crime puzzle and crime solving.** "crime solving" is a top-5 hint in GB, CA and AU, "crime puzzle" in the US;
   5 to 9 of the top 10 under 100; we are already #12 for "crime puzzle" in Canada.

## Dropped terms and why

| Term | Why |
|---|---|
| games | The category is already searchable ("crimson ledger board" test), so the word adds nothing. Its phrases are strong anyway: "detective games" and "mystery games" have 288 to 56k ratings at #1 and at most 4 of 10 under 100 |
| brain | "brain puzzle": #1 has 1.5k to 33k ratings, at most 3 of 10 under 100 |
| adults | "puzzle games for adults", "sudoku for adults": 0 to 2 of 10 under 100, #1 up to 853k ratings |
| variants | "sudoku variants" wants rule variants (killer, thermo, sandwich), which we are not; US and GB have 1 of 10 under 100 |
| offline (en-US only) | US "sudoku offline": #1 1.9M, #5 665k ratings |
| suspect | Real (#1 to #3), but led by the Suspects games (57k ratings in the US, 8.6k in GB) |
| sleuth | Not suggested as a search term in any of the five stores, only inside app names; the top 10 is tiny "sleuth" apps of every kind |
| inspector, alibi | Top 10 is inspection, business and screen-time apps |
| noir | "noir detective" is very weak (10 of 10 under 100), but the game is not noir |
| detective story | Real (US "detective s" #1), but the top 10 is narrative and phone-snoop games; wrong players |
| reasoning, logical | "logical reasoning" is real (#1), but the top 10 is aptitude and LSAT test apps |
| who did it | Real (first hint in the US, GB and CA) and weak in GB (8 of 10 under 100), but it needs three words and "Who Did It?" is also an app name. Next in line if a word goes |
| riddle | "riddle games" is strong everywhere; "mystery riddles" is medium; no room. India already gets "riddle" from the hi field |
| cozy games | Off-topic (life sims) and strong. `cozy` stays for "cozy mystery" and "cozy detective": no hints, but cozy is a name word of on-topic competitors, and outside the US their top 10 has 7 to 10 apps under 100 |
| whodunit (en-GB) | No room. The earlier research found that en-GB "whodunnit" also matches "whodunit" |
| clue, murder words, murdoku, murdle, competitor names | Owner's rules |

Note: one competitor writes "Whodunit?™" in its name. The word itself is in the dictionary and our own description uses
it, so it is kept; the owner may still want to drop `whodunit` from en-US.

## What this does not tell us

- **Volumes.** Apple does not publish them; hint position mixes popularity and app names.
- **API is not the store.** US "mystery sudoku": store #3, API #8.
- **Our own name phrase does not rank outside the US.** In GB, CA, AU and IN we are not in the top 12 for "mystery
  sudoku", while apps with 0 or 1 ratings are. Downloads per store probably weigh in. Keywords cannot fix that; ratings
  outside the Netherlands can.
- **Re-measure** the same terms 7 and 14 days after 1.7.1 is live (store page and API). The scripts and raw answers
  were kept outside the repo, in the session's scratchpad.

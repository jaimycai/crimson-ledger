# App Store keywords 1.7.1: Arabic, Russian, Turkish, Hindi, Bangla, Marathi, Telugu, Urdu (18 November 2026)

Proposal for the keyword fields of `ar-SA`, `ru`, `tr`, `hi`, `bn-BD`, `mr-IN`, `te-IN` and `ur-PK` in version 1.7.1, plus one
subtitle suggestion (Arabic). The fields are in `store/metadata/zoekwoorden-1.7.1/arru.json`. Nothing was uploaded, nothing was
committed, and App Store Connect was not called. Live today: 1.7.0 (released 17 November) with the store texts of 1.6.1, 0 ratings
in all these storefronts.

## Bottom line

1. **Saudi Arabia is the only storefront here where we rank.** Top 10 today: لعبة محقق (detective game) #4, العاب غموض (mystery
   games) #5, لعبه محقق جنائي (criminal detective game) #6, تحقيق جنائي (criminal investigation) #10, plus our own name terms. The
   Arabic field keeps every word behind those and swaps dead weight for three new real terms.
2. **Russia, Türkiye, India and Pakistan: outside the top 10 on every generic term**, even where all ten apps above us have under
   100 ratings and even on our own name phrase (RU "судоку детектив", TR "dedektif sudoku", IN "mystery sudoku"). With 0 ratings
   and about 7 downloads a day the keyword field is not the bottleneck there. The new fields complete real phrases we could not
   match at all (RU "игра", TR "dedektiflik", hi "logical reasoning games"), but expect small moves, not jumps.
3. **Four of the eight fields are not indexed anywhere we can test**: `mr-IN`, `te-IN` and `bn-BD` (India) and `ur-PK` (Pakistan and
   India). Words that are only in those fields never find us, also with the store page set to that language. Bangladesh has no App
   Store. Those four fields stay as in 1.6.1 (te-IN minus one word); changing them cannot move a rank.
4. **`hi` counts in India, but only its Latin words.** jasoos and paheli find us; the Devanagari keywords रहस्य, सुराग and मुजरिम never
   do. The hi field becomes a Latin field for India phrases that en-GB cannot complete.
5. **Apple indexes the whole 100-character field in Arabic and Russian** (the last words, at bytes 162-185, find us). This settles
   the open bytes question from 4 November for these fields.
6. **Normalisation, measured:** Arabic strips ال, folds أ/إ/آ to ا and ة to ه, and maps قضية to قضايا. Turkish now stems suffixes on
   both sides (unlike 4 November), but not -lı or -lik. Russian stems well, but "игра" (game) is not in our text and the category
   does not count as a word.

## Method

Public sources only, 18 November 2026 22:25 to 19 November 00:10 CET. Scripts and raw data in
`/private/tmp/claude-501/-Users-jaimycai/4b665c0e-1f47-4ec1-80b1-80218956e1fb/scratchpad/kw-arru/`.

1. **Which fields count where.** Apple's "App Store localizations" table (fetched with curl), then tests against the live texts:
   search "crimson ledger" plus one word that sits in only one field, with a control word that sits nowhere. 78 tests, table below.
2. **Real terms.** Apple's search-hints endpoint (`MZSearchHints`, `X-Apple-Store-Front: <id>,29`) per storefront: each seed in the
   local language (detective, mystery, logic, puzzle, sudoku, riddle, deduction, culprit, case, suspect, crime, clue, brain/IQ game),
   its first 2-3 letters, the seed plus a space, and the seed plus a space and a common next letter. "Hint 3/1" means the term was
   suggested after 3 typed characters, at position 1. Where today's run has no hint, the hint from the 4 November baseline is shown
   ("4-11").
3. **Competition.** The App Store's own web search page (`apps.apple.com/<cc>/iphone/search`, local names via `l=ar`, `l=tr`, `l=hi`)
   for 244 terms: the real result order, subtitles and rating counts of the top 10. Our app shows there as an in-app event card,
   not a plain result; a reader that only takes plain results misses us. The iTunes Search API (`limit=200`) gave our rank beyond
   the top 10 for 27 terms; for the rest it answered 403 (see "What did not work").
4. **Weak top 10:** several apps under about 100 ratings, or apps that are off topic. "On topic" counts the other apps in the top
   10 whose name or subtitle is about detectives, mysteries, crime, logic or puzzles.

**Did the hints endpoint work?** Yes. All storefronts answered except Bangladesh (empty: no store). The language part of the
store-front header made no difference (`143479-28,29`, `143479,29` and `143479-2,29` gave the same lists). Rate limit: two 429s
with `Retry-After` of about 1,700 seconds, shared with parallel keyword runs on this machine. Complete runs: SA (293 queries),
RU (223), TR (194). India: 121 queries before the second 429. Pakistan, the UAE and Egypt: not run ("not run" in their
hint column; Pakistan shows the 4 November baseline where it had one).

## Which localizations each storefront indexes

| Storefront | Apple's table: default + additional | Measured today |
|---|---|---|
| Saudi Arabia (SA) | English (U.K.) + Arabic | en-GB + ar-SA, whole field |
| UAE (AE) | English (U.K.) + Arabic | en-GB + ar-SA (قضايا, last word, finds us) |
| Egypt (EG) | English (U.K.) + Arabic, French | en-GB + ar-SA (same test) |
| Russia (RU) | Russian + English (U.K.), Ukrainian | ru, whole field |
| Türkiye (TR) | English (U.K.) + Turkish | tr, whole field |
| India (IN) | English (U.K.) + Bangla, Gujarati, Hindi, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, Urdu | en-GB + hi (Latin words only). mr-IN, te-IN, bn-BD and ur-PK: nothing found, also with the store in that language |
| Pakistan (PK) | English (U.K.) + Urdu | en-GB only. ur-PK keywords, subtitle and name word جاسوسی find nothing, also with the store in Urdu |
| Bangladesh (BD) | not in the table | no store: Search API 0 results, hints empty |

So en-GB is the default field in SA, AE, EG, TR, IN and PK, and the only field Pakistan reads. It is outside this proposal.

**Tests** against the live texts (1.7.0 carries the 1.6.1 fields). "Finds us" = we are in the result list of the store's web
search.

| Store | Search "crimson ledger" + | Where that word is | Finds us? |
|---|---|---|---|
| SA | قضايا | ar-SA keywords, bytes 162-173 | yes |
| SA | مشتبه | ar-SA keywords, bytes 152-162 | yes |
| SA | انترنت | ar-SA keywords, bytes 139-151 | yes |
| SA | جاني | nowhere (جنائي is in the field) | yes |
| SA | مين | nowhere | no |
| AE | قضايا | ar-SA keywords, last word | yes |
| EG | قضايا | ar-SA keywords, last word | yes |
| RU | тайна | ru keywords, bytes 175-185 | yes |
| RU | улики | ru keywords, bytes 164-174 | yes |
| RU | взрослых | ru keywords, bytes 140-156 | yes |
| RU | детективная | ru keywords has детективные | yes |
| RU | детективный | ru keywords has детективные | no |
| RU | логический | ru keywords has логические | yes |
| RU | головоломка | ru keywords has головоломки | yes |
| RU | сыщики | ru keywords has сыщик | yes |
| RU | тайны | ru keywords has тайна | yes |
| RU | загадка | ru keywords has загадки | yes |
| RU | логику | ru subtitle has логика | yes |
| RU | реклама | ru subtitle has рекламы | yes |
| RU | детективы | ru subtitle has детектив | yes |
| RU | игра | nowhere (category is Games) | no |
| RU | расследования | ru keywords has расследование | yes |
| RU | преступление | nowhere | no |
| RU | мышление | nowhere (control) | no |
| TR | gizemli | tr keywords, bytes 100-107 | yes |
| TR | çözme | tr keywords | yes |
| TR | mantik | tr keywords has mantık | yes |
| TR | suclu | tr keywords has suçlu | yes |
| TR | cozme | tr keywords has çözme | yes |
| TR | reklamsiz | tr subtitle has reklamsız | yes |
| TR | turkce | tr keywords has türkçe | yes |
| TR | oyun | tr subtitle oyunu, keywords oyunları | yes |
| TR | oyunlar | tr subtitle oyunu, keywords oyunları | yes |
| TR | gizemi | tr name gizem | yes |
| TR | dedektifler | tr subtitle has only dedektif | yes |
| TR | bulmacalar | tr keywords has bulmaca | yes |
| TR | suçlular | tr keywords has suçlu | yes |
| TR | vakalar | tr keywords has vaka | yes |
| TR | bilmece | nowhere (control) | no |
| TR | internet | tr keywords has internetsiz | yes |
| TR | oyunlarda | tr subtitle oyunu, keywords oyunları | yes |
| TR | reklam | tr subtitle has reklamsız | yes |
| TR | mantıklı | tr keywords has mantık | no |
| IN | मुजरिम | hi keywords, last word | no |
| IN | खेळ | mr-IN keywords | no |
| IN | తెలివి | te-IN keywords | no |
| IN | খেলা | bn-BD keywords | no |
| IN | suspect | ur-PK keywords only | no |
| IN | logical | mr-IN keywords; en-GB subtitle has logic | yes |
| IN | goyenda | bn-BD keywords only | no |
| IN | investigation | ur-PK keywords only | no |
| IN | thriller | te-IN keywords only | no |
| IN | reasoning | mr-IN keywords only | no |
| IN | jasoos | hi keywords only | yes |
| IN | zzqqvv | nowhere (control) | no |
| IN | जासूस | hi keywords; hi name has जासूसी | yes |
| IN | रहस्य | hi keywords, bytes 74-88 | no |
| IN | सुराग | hi keywords | no |
| IN | অপরাধী | bn-BD keywords | no |
| IN | దోషి | te-IN keywords | no |
| IN | गुन्हेगार | mr-IN keywords | no |
| IN | whodunnit | en-GB keywords | yes |
| IN | thriller (store in te) | te-IN keywords only | no |
| IN | reasoning (store in mr) | mr-IN keywords only | no |
| IN | goyenda (store in bn) | bn-BD keywords only | no |
| IN | investigation (store in ur) | ur-PK keywords only | no |
| IN | रहस्य (store in en) | hi keywords, bytes 74-88 | no |
| IN | पहेली | hi subtitle; hi keywords has paheli | yes |
| IN | दिमागी | hi subtitle | no |
| IN | paheli | hi keywords only | yes |
| PK | investigation | ur-PK keywords only | no |
| PK | jasoos | hi keywords only (control) | no |
| PK | whodunnit | en-GB keywords | yes |
| PK | پہیلیاں | ur-PK subtitle | no |
| PK | investigation (store in ur) | ur-PK keywords only | no |
| PK | منطقی | ur-PK subtitle | no |
| PK | riddle | ur-PK keywords only | no |
| PK | جاسوسی | ur-PK name | no |

## Saudi Arabia (ar-SA)

Name `سودوكو المحقق: Crimson Ledger`, subtitle `ألغاز ذكاء بوليسية بلا إعلانات`.

| Term | Gloss | Hint? | Our rank now | Ratings #1/#5/#10 | On topic | Verdict |
|---|---|---|---|---|---|---|
| لعبة محقق | detective game | yes 3/5 | #4 | 65/17/4 | 7/9 | keep (name + لعبة); top 10 now |
| لعبه محقق جنائي | criminal detective game | yes 3/1 | #6 | 17/2/0 | 9/9 | keep جنائي; top 10 now |
| محقق جنائي | criminal detective | no | >10 (API #21) | 172/668/65 | 10/10 | keep; near top 10 |
| تحقيق جنائي | criminal investigation | yes 3/1 | #10 | 17/0/0 | 9/9 | keep; #10, stronger if moved to subtitle |
| محقق | detective | yes 3/3 | >10 | 65/3/1.6k | 10/10 | in name; rest is ranking strength |
| العاب محقق | detective games | yes 3/4 | >10 (API: not in 200) | 17/24k/0 | 5/10 | keep العاب |
| العاب تحقيق | investigation games | yes 3/5 | >10 | 17/0/0 | 8/10 | keep |
| لعبة تحقيق | investigation game | yes 5/3 | >10 (API #57) | 17/9/0 | 10/10 | keep |
| تحقيق | investigation | yes 3/7 | >10 (API: not in 200) | 9/2/6 | 10/10 | keep (needed for combos) |
| لغز الجريمة | crime puzzle | yes 3/1 | >10 (API #66) | 680/7/4 | 6/10 | keep لغز, جريمة |
| حل الجريمة | solve the crime | no | >10 (API: not in 200) | 1.6k/0/0 | 7/10 | no hint; skip حل |
| جريمة | crime | yes 5/1 | >10 (API: not in 200) | 9/82/15 | 10/10 | keep (one form; ال is stripped) |
| لعبة جريمة | crime game | no | >10 (API #119) | 96/3/2.1k | 9/10 | covered |
| العاب جريمة | crime games | no | >10 (API #114) | 7/680/11 | 10/10 | covered |
| غموض | mystery | yes 2/6 | >10 (API #153) | 18/104/74 | 8/10 | keep |
| لعبة غموض | mystery game | yes 2/9 | >10 | 6/0/3 | 7/10 | keep |
| العاب غموض | mystery games | yes 2/8 | #5 | 200/0/1 | 6/9 | keep; top 10 now |
| لغز | puzzle, riddle | yes 2/2 | >10 | 183k/146k/43k | 7/10 | keep (cheap; needed for لغز الجريمة) |
| الغاز | puzzles | yes 2/4 | >10 | 6.1k/43/80k | 6/10 | drop from field: same token as ألغاز in subtitle |
| الغاز ذكاء | IQ puzzles | yes 5/5 | >10 | 5.8k/113k/0 | 8/10 | out of reach |
| لعبة ذكاء | IQ game | yes 6/1 | >10 | 8.2k/79k/1.8k | 6/10 | out of reach |
| العاب ذكاء | IQ games | yes 2/6 | >10 | 113k/149k/7.3k | 6/10 | out of reach |
| العاب تفكير | thinking games | yes 11/1 | >10 | 375k/0/3 | 6/10 | keep تفكير (cheap, 4 apps <100) |
| العاب منطق | logic games | no | >10 | 657/0/8.9k | 9/10 | weak hint; use منطقي |
| لغز منطقي | logic puzzle | no | >10 | 2.2k/1.4k/4 | 10/10 | add منطقي (name word of logic-puzzle rivals) |
| الجاني | the culprit | no | >10 | 0/7/26 | 1/10 | no hint; skip |
| مين الجاني | who is the culprit (dialect) | no | >10 | 3/1/0 | 0/10 | no hint; skip |
| من الجاني | who is the culprit | no | >10 | 3/30/3 | 0/10 | no hint; skip |
| اكشف الجاني | expose the culprit | no | >10 | 436/0/– | 3/9 | no hint; skip |
| سودوكو | sudoku | yes 2/6 | >10 | 42k/6.9k/1.4k | 10/10 | out of reach (42k) |
| سودوكو محقق | detective sudoku | no | #1 | 0/0/0 | 9/9 | #1 (name) |
| سودوكو بدون نت | sudoku offline | yes 3/3 | >10 | 0/8.2k/0 | 8/10 | keep بدون, نت |
| سودوكو بدون اعلانات | sudoku without ads | no | #10 | 0/0/0 | 7/9 | #10 now |
| سودوكو الغاز | sudoku puzzles | no | >10 | 2.8k/15/11 | 10/10 | covered |
| العاب بوليسية | detective-genre games | no | #10 | 49k/19/0 | 7/9 | #10 now (subtitle) |
| لعبة بوليسية | detective-genre game | no | >10 | 19/0/71 | 7/10 | covered |
| مشتبه | suspect | no | >10 | 5/6/0 | 8/10 | no hint; drop |
| قضايا | cases | no | >10 | 3.7k/1/225 | 0/10 | swap for قضية (hint form) |
| فوازير | quiz riddles | yes 3/3 | >10 | 2/0/146k | 2/10 | off topic |
| حزورة | quiz riddle | yes 3/1 | >10 | 3/2/10 | 3/10 | off topic (word quizzes) |
| استنتاج | deduction | no | >10 | 1.4k/25/97 | 5/10 | no hint; skip |
| المجرم | the criminal | no | >10 | 50k/0/3.8k | 2/10 | off topic |
| لعبة المجرم | the criminal game | no | >10 | 0/50k/60k | 2/10 | off topic |
| تحري | sleuthing | no | >10 | 0/5/1.7k | 2/10 | add (rival name word, weak top 10) |
| العاب الغاز | puzzle games | yes 7/7 | >10 | 5.8k/147k/146k | 5/10 | out of reach |
| الغاز بدون نت | puzzles offline | yes 3/5 | >10 | 1.1k/0/5.6k | 5/10 | covered (subtitle + field) |
| لغز ذكاء | IQ puzzle | no | >10 | 287k/680/6.1k | 10/10 | out of reach |
| لعبة غموض وتحقيق | mystery and investigation game | no | >10 | 11/0/0 | 10/10 | covered |
| detective sudoku | (en-GB field) | yes 4-11 11/9 | #8 | 0/1/0 | 9/9 | en-GB, #8 now |
| mystery sudoku | (en-GB name) | no | #2 | 0/183k/0 | 8/9 | en-GB name, #2 now |
| detective games | (en-GB field) | yes 9/1 | >10 | 6.9k/668/17 | 10/10 | en-GB, out of reach |
| قضية لم تحل | unsolved case | yes 2/6 | >10 | 65/74/6.9k | 8/10 | skip: it is CrimeBot's Arabic name |
| قضية | case | yes 2/8 | >10 | 9/1/0 | 7/10 | add (2/8 hint, 9 of 10 <100) |
| لعبة لغز | puzzle game | yes 6/5 | >10 | 77k/287k/5.8k | 7/10 | out of reach |
| لعبة سودوكو | sudoku game | yes 6/2 | >10 | 42k/1.8k/532 | 10/10 | out of reach |
| العاب بدون اعلانات | games without ads | yes 7/5 | >10 | 80k/20k/300k | 4/10 | out of reach |
| لغز بدون نت | puzzle offline | yes 5/1 | >10 | 1.3k/1/0 | 6/10 | covered |
| العاب عقل | brain games | yes 7/9 | >10 | 113k/21k/4 | 7/10 | out of reach; skip |
| سودوكو بدون انترنت | sudoku without internet | no | >10 | 4/8.2k/0 | 6/10 | keep انترنت |
| العاب بدون انترنت | games without internet | yes 7/4 | >10 | 18k/109k/27k | 2/10 | out of reach |
| لعبة ذكاء بدون نت | IQ game offline | yes 6/2 | >10 | 183k/79k/1 | 5/10 | out of reach |

**Article and spelling.** Apple folds the forms together, so one bare form per word is enough: البوليسية, السودوكو, الغموض, الذكاء,
التحقيق and اللغز all find our bare words; اعلانات finds إعلانات; لعبه finds لعبة; "محقق فانوس" finds the app named "محقق الفانوس".
That made three words in the 1.6.1 field duplicates: محقق (the name has المحقق), الجريمة (next to جريمة) and الغاز (the subtitle has
ألغاز). Broken plurals are partly mapped: "crimson ledger قضية" finds the field word قضايا. The field uses the singular قضية
because that is the form people type (hint 2/8). ألغاز/الغاز: keep the hamza form in the subtitle, nothing extra in the field.

**Subtitle suggestion: `ألغاز تحقيق جنائي بلا إعلانات`** ("criminal-investigation puzzles, no ads", 29 characters). بوليسية got no
hint at all, and every ذكاء phrase is held by apps with 5,800 to 287,000 ratings. تحقيق جنائي is a 3/1 hint, nine of the top ten have
under 100 ratings, and we already reach #10 with both words only in the keyword field. In the subtitle they weigh more, and they
also serve لعبه محقق جنائي (3/1, #6 today). If you take it, use this field instead:
`لعبة,العاب,غموض,جريمة,لغز,قضية,بدون,نت,انترنت,تفكير,منطقي,تحري,ذكاء` (67 characters).

## UAE and Egypt (same ar-SA field)

**UAE (AE)**

| Term | Gloss | Hint? | Our rank now | Ratings #1/#5/#10 | On topic | Verdict |
|---|---|---|---|---|---|---|
| لعبة محقق | detective game | not run | >10 | 1/12/1 | 9/10 | same field as SA |
| محقق | detective | not run | >10 | 1/928/0 | 8/10 | name word |
| تحقيق جنائي | criminal investigation | not run | #10 | 1/0/0 | 8/9 | #10 now |
| جريمة | crime | not run | >10 | 4/0/1 | 8/10 | keep |
| الجاني | the culprit | not run | >10 | 280/33/2 | 1/10 | no hint, off-topic list |
| سودوكو | sudoku | not run | >10 | 23k/1.5k/0 | 9/10 | out of reach |
| detective sudoku | (en-GB field) | not run | >10 | 0/0/0 | 10/10 | en-GB |
| mystery sudoku | (en-GB name) | not run | #3 | 0/0/2 | 8/9 | en-GB name, #3 |

**Egypt (EG)**

| Term | Gloss | Hint? | Our rank now | Ratings #1/#5/#10 | On topic | Verdict |
|---|---|---|---|---|---|---|
| لعبة محقق | detective game | not run | >10 | 3/86/0 | 9/10 | 10 of 10 <100; same field as SA |
| محقق | detective | not run | >10 | 0/3/25 | 8/10 | name word |
| تحقيق جنائي | criminal investigation | not run | >10 | 0/0/0 | 9/10 | 10 of 10 <100 |
| جريمة | crime | not run | >10 | 0/2/8 | 10/10 | keep |
| الجاني | the culprit | not run | >10 | 64/64/31 | 0/10 | off-topic list |
| سودوكو | sudoku | not run | >10 | 29k/1.5k/8 | 10/10 | out of reach |
| detective sudoku | (en-GB field) | not run | >10 | 0/0/7 | 10/10 | en-GB |
| mystery sudoku | (en-GB name) | not run | >10 | 0/20k/0 | 8/10 | en-GB name |

Both stores are small: nearly every top 10 has only apps under 100 ratings. The ar-SA field serves them as is.

## Russia (ru)

Name `Судоку: Crimson Ledger`, subtitle `Детектив и логика без рекламы`.

| Term | Gloss | Hint? | Our rank now | Ratings #1/#5/#10 | On topic | Verdict |
|---|---|---|---|---|---|---|
| детектив | detective | yes 3/10 | >10 (API: not in 200) | 679/2.5k/3.7k | 8/10 | in subtitle; strong list |
| детективные игры | detective games | yes 3/7 | >10 (API #122) | 49/0/3 | 10/10 | add игра (we lack the 2nd word) |
| детективная игра | detective game | yes 8/5 | >10 | 7/3/47 | 10/10 | add игра |
| игра детектив | game detective | yes 13/1 | >10 | 679/35/0 | 8/10 | add игра |
| игры детектив | games detective | yes 4-11 13/2 | >10 | 650/3.7k/0 | 10/10 | add игра |
| детективы | detectives | yes 8/10 | >10 | 7/3/650 | 10/10 | covered by subtitle |
| сыщик | sleuth | yes 3/1 | >10 | 9.8k/7.7k/77k | 9/10 | keep (3/1), list is strong |
| игра сыщик | sleuth game | yes 3/2 | >10 | 5.5k/0/0 | 9/10 | add игра |
| расследование | investigation | yes 13/2 | >10 (API: not in 200) | 924/2/835 | 9/10 | keep |
| игра расследование | investigation game | yes 13/5 | >10 | 924/1.3k/0 | 9/10 | add игра |
| игры расследования | investigation games | yes 13/1 | >10 | 924/679/0 | 10/10 | add игра |
| тайна | mystery, secret | yes 5/4 | >10 (API: not in 200) | 4.2k/1.3k/1 | 9/10 | keep |
| тайны | mysteries | yes 5/9 | >10 | 4.2k/180/0 | 10/10 | covered by тайна |
| загадки | riddles | yes 3/4 | >10 | 145k/7/77k | 7/10 | keep as filler; list is strong |
| загадки на логику | logic riddles | yes 3/5 | >10 | 75/10k/77k | 8/10 | out of reach |
| логические загадки | logical riddles | yes 10/5 | >10 | 10k/19k/0 | 9/10 | out of reach |
| головоломки | puzzles | yes 3/2 | >10 | 145k/50k/136k | 7/10 | keep (for головоломки детектив) |
| логические головоломки | logic puzzles | yes 12/1 | >10 | 6.1k/1.7k/47k | 8/10 | out of reach; drop логические |
| головоломки для взрослых | puzzles for adults | yes 11/2 | >10 | 23k/18k/85k | 7/10 | out of reach; drop взрослых |
| логика | logic | yes 3/4 | >10 | 145k/50k/13k | 6/10 | in subtitle; out of reach |
| логические игры | logic games | yes 3/2 | >10 | 145k/18k/9.8k | 6/10 | out of reach |
| судоку | sudoku | yes 3/1 | >10 | 184k/11k/3 | 10/10 | name; out of reach |
| судоку детектив | sudoku detective | yes 6/3 | >10 (API #37) | 35/37/1 | 10/10 | name + subtitle; 6 of the top 10 carry both words in their name |
| детектив судоку | detective sudoku | yes 10/2 | >10 | 35/37/5.5k | 10/10 | same as above |
| судоку без рекламы | sudoku without ads | yes 3/8 | >10 | 47k/2.9k/0 | 10/10 | name + subtitle |
| судоку без интернета | sudoku without internet | yes 3/3 | >10 | 184k/29k/58 | 8/10 | keep интернета |
| судоку загадка | sudoku riddle | no | >10 | 37/3/1 | 10/10 | no hint |
| судоку логика | sudoku logic | no | >10 (API #28) | 61/32/3 | 10/10 | name + subtitle; API #28 |
| преступление | crime | yes 12/1 | >10 | 7/0/0 | 9/10 | no room; 4-11 hint 6/1, next candidate |
| преступник | criminal | yes 10/1 | >10 | 595/0/0 | 4/10 | off topic list |
| кто виноват | who is to blame | no | >10 | 0/–/– | 0/3 | no hint; drop кто |
| виновник | culprit | no | >10 | 0/–/– | 0/1 | no hint |
| дедукция | deduction | yes 8/1 | >10 | 10k/35/0 | 9/10 | add (hint, 7 of 10 <100) |
| улики | clues, evidence | yes 5/1 | >10 | 7.7k/65/2 | 8/10 | keep |
| подозреваемый | suspect | no | >10 | 37/1/0 | 7/10 | no hint |
| следователь | investigator | yes 11/1 | >10 | 924/7/4.0k | 8/10 | add (hint, 7 of 10 <100) |
| головоломка детектив | puzzle detective | yes 20/1 | >10 | 1.8k/2/3 | 10/10 | covered |
| кто преступник | who is the criminal | no | >10 | 107/–/– | 0/1 | no hint |
| найди преступника | find the criminal | no | >10 | 83/–/– | 2/2 | no hint |
| детективные головоломки | detective puzzles | no | >10 | 2.8k/0/2 | 10/10 | covered |
| детективная головоломка | detective puzzle | no | >10 | 835/0/1.3k | 10/10 | covered |
| головоломки детектив | puzzles detective | yes 13/6 | >10 | 37/7/514 | 9/10 | covered |
| детектив расследование | detective investigation | yes 8/2 | >10 | 2.5k/679/3 | 10/10 | covered |
| детектив без интернета | detective without internet | yes 8/7 | >10 | 679/2/514 | 8/10 | covered (интернета) |
| судоку оффлайн | sudoku offline | yes 6/8 | >10 | 184k/0/0 | 9/10 | out of reach (184k at #1) |
| судоку офлайн | sudoku offline (other spelling) | yes 8/4 | >10 | 184k/47k/0 | 10/10 | out of reach |
| игра следователь | investigator game | yes 11/2 | >10 | 7/113/0 | 10/10 | add игра + следователь |
| игра на логику | logic game | yes 14/4 | >10 | 145k/20k/690k | 7/10 | out of reach |
| игры логика | games logic | yes 6/5 | >10 | 124/3/91k | 6/10 | out of reach |
| игра преступник | criminal game | yes 10/2 | >10 | 0/11/0 | 3/10 | off topic |
| тест на логику | logic test | yes 14/1 | >10 | 19k/15k/91k | 7/10 | off topic |

Six of the top ten carry both "судоку" and "детектив" in their name (Roomdoku, Cluedoku, Murdox and others), so our own phrase
"судоку детектив" stays out of reach from the field. The gap the field can close is "игра": "crimson ledger игра" finds nothing, so every
"game" phrase misses us on one word. With игра, eight real phrases can match fully: детективные игры, детективная игра, игра
детектив, игры детектив, игра сыщик, игра расследование, игры расследования, игра следователь. Morphology is not a problem:
детективная, логический, головоломка, сыщики, тайны, загадка, логику, детективы and расследования all find our forms. One odd gap:
детективный (masculine) does not find детективные.

## Türkiye (tr)

Name `Gizem Sudoku: Crimson Ledger`, subtitle `Reklamsız dedektif oyunu`.

| Term | Gloss | Hint? | Our rank now | Ratings #1/#5/#10 | On topic | Verdict |
|---|---|---|---|---|---|---|
| dedektif | detective | yes 3/6 | >10 | 239/0/2 | 9/10 | in subtitle |
| dedektif oyunu | detective game | yes 3/7 | >10 (API: not in 200) | 4/51/3 | 10/10 | in subtitle; ranking strength |
| dedektif oyunları | detective games | yes 3/1 | >10 (API: not in 200) | 77/3.7k/46 | 7/10 | covered by subtitle (stemming) |
| dedektiflik | detective work | yes 11/2 | >10 | 18/3/48 | 8/10 | add (not stemmed to dedektif) |
| gizem | mystery | yes 5/4 | >10 | 491/1/10 | 7/10 | in name |
| gizem oyunu | mystery game | yes 5/3 | >10 | 0/7.0k/2 | 9/10 | covered |
| gizem oyunları | mystery games | yes 3/8 | >10 | 77/46/307 | 6/10 | covered |
| gizemli | mysterious | no | >10 | 8.1k/1/1 | 10/10 | keep (-li is not stemmed) |
| gizemli oyunlar | mysterious games | yes 5/4 | >10 | 8/7.0k/1 | 5/10 | keep gizemli |
| suç oyunları | crime games | yes 3/1 | >10 (API: not in 200) | 2/51/3 | 6/10 | keep suç |
| suç | crime | no | >10 | 15k/158/11 | 9/10 | keep |
| suçlu | culprit | no | >10 | 114/103/0 | 7/10 | keep |
| suçlu bulma | find the culprit | no | #6 | 50/0/– | 5/6 | keep; #6 now |
| suçlu bulma oyunu | find-the-culprit game | yes 3/2 | #6 | 307/1/– | 4/5 | keep; #6 now |
| suçlu kim | who is the culprit | yes 3/4 | >10 | 18/348k/0 | 8/10 | keep kim |
| vaka | case | yes 4/6 | >10 (API: not in 200) | 602/51/0 | 8/10 | keep |
| vaka oyunu | case game | yes 4/1 | >10 | 18/8/8 | 9/10 | keep |
| vaka çözme | case solving | no | >10 | 51/310/0 | 9/10 | covered |
| polisiye | crime fiction | yes 8/2 | >10 (API: not in 200) | 8.9k/3.7k/2 | 8/10 | keep |
| polisiye oyun | crime-fiction game | no | >10 | 470/3/239 | 8/10 | covered |
| zeka oyunları | IQ games | yes 3/1 | >10 | 136k/5/19k | 7/10 | out of reach; drop zeka |
| zeka oyunu | IQ game | yes 3/3 | >10 | 136k/7/180k | 8/10 | out of reach |
| akıl oyunları | mind games | yes 3/6 | >10 | 136k/984/48k | 9/10 | out of reach; drop akıl |
| mantık oyunları | logic games | yes 6/1 | >10 | 49k/89k/348k | 7/10 | out of reach |
| mantık bulmacaları | logic puzzles | no | >10 | 26/175/177 | 10/10 | keep mantık, bulmaca |
| bulmaca | puzzle | yes 3/3 | >10 | 49k/1.2k/6.1k | 9/10 | keep (for mantık bulmacası) |
| bilmece | riddle | yes 7/4 | >10 | 86k/86k/2.6k | 6/10 | out of reach |
| sudoku | sudoku | yes 3/1 | >10 | 23k/78/3 | 10/10 | name; out of reach |
| sudoku türkçe | sudoku Turkish | yes 3/2 | >10 | 23k/3/2 | 10/10 | keep türkçe |
| sudoku reklamsız | sudoku ad-free | yes 3/5 | >10 | 171/152k/0 | 9/10 | name + subtitle |
| sudoku internetsiz | sudoku offline | yes 3/4 | >10 | 23k/3/3 | 10/10 | keep internetsiz |
| dedektif sudoku | detective sudoku | yes 10/2 | >10 | 2/0/0 | 9/10 | name + subtitle |
| gizem sudoku | mystery sudoku (our name) | no | #3 | 0/1/1 | 9/9 | #3 (name) |
| şüpheli | suspect | no | >10 | 3.7k/1/3 | 6/10 | no hint; skip |
| ipucu | clue, hint | no | >10 | 75/32/7 | 3/10 | add (hint ipucu oyunları) |
| olay çözme | solving the incident | yes 10/1 | >10 | 51/0/– | 7/9 | no room |
| suç çözme | crime solving | no | >10 | 51/1/56 | 10/10 |  |
| gizem çözme | mystery solving | yes 5/2 | >10 | 510/2/8 | 7/10 |  |
| mantık | logic | yes 4-11 6/4 | >10 | 8.2k/38k/2.7k | 7/10 |  |
| zeka | intelligence | yes 3/8 | >10 | 136k/7/2.8k | 9/10 |  |
| dedektif ol | be a detective | yes 8/3 | >10 | 8/90/8.9k | 6/10 | no room |
| dedektif sensin | you are the detective | yes 10/1 | >10 | 4/8.9k/2 | 8/10 | no room |
| ipucu oyunları | clue games | no | >10 | 3/4/8.9k | 7/10 | add ipucu |
| olay yeri inceleme | crime scene investigation | yes 3/7 | >10 | 8.9k/18/3.1k | 6/10 | off topic (crime-scene sims) |
| sudoku oyunu | sudoku game | yes 8/2 | >10 | 152k/2/411 | 10/10 | out of reach |
| mantık bulmacası | logic puzzle | no | >10 | 7/294/2 | 10/10 | keep mantık, bulmaca |
| dedektiflik oyunu | detective-work game | yes 8/4 | >10 | 18/0/0 | 10/10 | add dedektiflik (9 of 10 <100) |

Turkish stemming changed since 4 November: dedektifler finds dedektif, vakalar finds vaka, bulmacalar finds bulmaca, reklam finds
reklamsız and internet finds internetsiz. So oyunları is already covered by oyunu in the subtitle. Not stemmed: -lı/-lik
(mantıklı does not find mantık), so gizemli stays and dedektiflik comes in. Diacritics are folded: mantik, suclu, cozme,
reklamsiz and turkce all find us.

## India (hi; en-GB is the default)

| Term | Gloss | Hint? | Our rank now | Ratings #1/#5/#10 | On topic | Verdict |
|---|---|---|---|---|---|---|
| detective games | English | yes 3/1 | >10 (API: not in 200) | 288/1.2k/113 | 10/10 | en-GB covers it; ranking strength |
| detective game | English | yes 14/1 | >10 | 2.5k/14/9 | 10/10 | en-GB |
| detective | English | yes 3/7 | >10 | 2.5k/62/0 | 10/10 | en-GB |
| mystery games | English | yes 3/2 | >10 | 1.2k/756/84 | 9/10 | en-GB |
| mystery game | English | yes 12/1 | >10 | 26k/3.8k/3.1k | 6/10 | out of reach (26k) |
| logic games | English | yes 3/4 | >10 | 38k/145k/0 | 10/10 | out of reach |
| logic puzzles | English | yes 3/10 | >10 | 1.6k/46/0 | 10/10 | en-GB |
| logical reasoning games | English | yes 5/5 | >10 | 120/0/1 | 10/10 | add logical, reasoning, games to hi |
| logical reasoning | English | yes 5/7 | >10 | 120/0/0 | 9/10 | add to hi |
| riddle games | English | yes 6/1 | >10 | 1.3k/787/38k | 10/10 | keep riddle in hi (cheap); list is strong |
| riddles | English | yes 6/3 | >10 | 1.3k/23k/38k | 10/10 | keep riddle |
| crime game | English | yes 5/3 | >10 | 795/0/28k | 7/10 | off-topic gang games |
| crime games | English | yes 4-11 11/1 | >10 | 113/1/0 | 9/10 | en-GB |
| iq games | English | yes 2/1 | >10 | 38k/322/23k | 10/10 | out of reach; iq also feeds the Detective IQ brand |
| detective iq | English | yes 3/10 | >10 | 288/61/0 | 9/10 | brand of a rival; skip |
| brain games | English | yes 3/7 | >10 | 38k/16k/7.6k | 10/10 | out of reach |
| sudoku no ads | English | yes 13/1 | >10 | 86/1/0 | 10/10 | en-GB name + subtitle |
| sudoku offline | English | yes 3/7 | >10 | 13k/4/1 | 10/10 | en-GB |
| detective sudoku | English | yes 16/1 | >10 | 0/0/0 | 10/10 | en-GB name + subtitle |
| mystery sudoku | English | no | >10 | 0/382k/2.1k | 8/10 | en-GB name; not in top 12 in India |
| crime sudoku | English | no | >10 | 51/0/0 | 10/10 | en-GB |
| whodunnit | English | no | >10 | 4/84/1 | 10/10 | en-GB |
| deduction | English | no | >10 | 0/0/32 | 9/10 | en-GB |
| find the culprit | English | yes 7/5 | >10 | 32/0/0 | 10/10 | add find, culprit to hi (10 of 10 <100) |
| suspect | English | yes 7/1 | >10 | 722/528/0 | 8/10 | skip: Suspects is a rival app |
| logic grid | English | yes 4-11 10/2 | >10 | 46/1/421 | 10/10 | en-GB |
| detective puzzle | English | no | >10 | 51/4/288 | 10/10 | en-GB |
| crime puzzle | English | no | >10 | 2.5k/0/29 | 10/10 | en-GB |
| mystery puzzle | English | no | >10 | 1.6k/32/3.8k | 10/10 | en-GB |
| जासूसी गेम | detective game (Hindi) | no | >10 | 28/36/– | 0/6 | Devanagari keywords do not match; skip |
| जासूस | detective (Hindi) | no | >10 | 0/0/3.1k | 3/10 | matched via name/jasoos |
| जासूसी | detective-, spy- (Hindi) | no | >10 | 0/263/371 | 3/10 | name word |
| पहेली | puzzle, riddle (Hindi) | no | >10 | 9/9/67k | 2/10 | subtitle word |
| पहेलियाँ | riddles (Hindi) | no | >10 | 333/12k/1.8k | 5/10 | skip |
| रहस्य | mystery (Hindi) | no | >10 | 19/0/61 | 2/10 | Devanagari keyword never matched; drop |
| दिमागी पहेली | brain puzzle (Hindi) | no | >10 | 11/0/– | 3/5 | subtitle |
| सुडोकू | sudoku (Hindi) | no | >10 | 13k/27/17k | 6/10 | name |
| jasoos | detective (Hinglish) | no | >10 | 0/0/0 | 1/10 | keep (also catches जासूस) |
| jasoosi game | detective game (Hinglish) | no | #2 | 0/–/– | 1/1 | #2 (tiny list) |
| paheli | riddle (Hinglish) | no | >10 | 53/1/1 | 6/10 | keep (also catches पहेली) |
| hindi paheli | Hindi riddle | no | >10 | 11/14/0 | 5/10 | keep hindi |
| investigation games | English | yes 13/1 | >10 | 2.5k/2/84 | 10/10 | add investigation to hi |
| crime investigation | English | yes 5/1 | >10 | 2.5k/2/5 | 10/10 | add crime, investigation to hi |
| mystery solving games | English | yes 7/2 | >10 | 0/84/25k | 10/10 | en-GB |
| jasoosi | detective- (Hinglish) | no | #2 | 0/–/– | 1/1 | #2 (tiny list) |

India reads en-GB and the Latin words of hi. The new hi field takes the India phrases en-GB cannot complete on its own, because
Apple does not combine words across fields: logical reasoning games, find the culprit, investigation games, crime investigation.
jasoos, jasoosi, paheli and hindi stay: no hint data (the India run stopped at the 429), but "crimson ledger जासूस" and "पहेली"
find us while no Devanagari keyword does, which suggests Hindi-script searches reach us through these Latin forms. Devanagari
words in the hi subtitle are a mixed picture (पहेली yes, दिमागी no); no subtitle suggestion.

## Pakistan (en-GB only)

| Term | Gloss | Hint? | Our rank now | Ratings #1/#5/#10 | On topic | Verdict |
|---|---|---|---|---|---|---|
| detective game | English | yes 4-11 3/3 | >10 | 402/16/0 | 10/10 | en-GB only (ur-PK not indexed) |
| detective games | English | yes 4-11 15/1 | >10 | 1.3k/69/6 | 9/10 | en-GB only (ur-PK not indexed) |
| detective | English | yes 4-11 3/5 | >10 | 402/15/410 | 9/10 | en-GB only (ur-PK not indexed) |
| mystery game | English | not run | >10 | 8.8k/49/0 | 8/10 | en-GB only (ur-PK not indexed) |
| mystery games | English | not run | >10 | 19/402/0 | 8/10 | en-GB only (ur-PK not indexed) |
| sudoku | English | yes 4-11 3/1 | >10 | 2.9k/45/2 | 10/10 | en-GB only (ur-PK not indexed) |
| sudoku offline | English | not run | >10 | 3/0/0 | 10/10 | en-GB only (ur-PK not indexed) |
| brain games | English | yes 4-11 3/7 | >10 | 6.0k/1/1.2k | 9/10 | en-GB only (ur-PK not indexed) |
| logic games | English | not run | >10 | 1.3k/98/0 | 9/10 | en-GB only (ur-PK not indexed) |
| logic puzzle | English | not run | >10 | 63/0/1 | 10/10 | en-GB only (ur-PK not indexed) |
| riddles | English | not run | >10 | 38/56/0 | 10/10 | en-GB only (ur-PK not indexed) |
| crime game | English | not run | >10 | 402/3/1 | 8/10 | en-GB only (ur-PK not indexed) |
| crime sudoku | English | not run | >10 | 4/6/0 | 10/10 | en-GB only (ur-PK not indexed) |
| detective sudoku | English | yes 4-11 16/1 | >10 | 0/4/0 | 10/10 | en-GB only (ur-PK not indexed) |
| mystery sudoku | English | not run | >10 | 0/6.0k/113 | 8/10 | en-GB only (ur-PK not indexed) |
| whodunnit | English | not run | >10 | 0/1/0 | 10/10 | en-GB only (ur-PK not indexed) |
| جاسوسی | detective- (Urdu) | not run | >10 | 63/6/2 | 0/10 | ur-PK name; not indexed |
| جاسوس | detective (Urdu) | not run | >10 | 0/63/2 | 2/10 | ur-PK not indexed |
| جاسوسی گیم | detective game (Urdu) | not run | >10 | 1/0/0 | 0/10 | ur-PK not indexed |
| پہیلی | riddle (Urdu) | not run | >10 | 12/22/1.5k | 0/10 | ur-PK not indexed |
| پہیلیاں | riddles (Urdu) | not run | >10 | 12/22/1.5k | 0/10 | ur-PK not indexed |
| سوڈوکو | sudoku (Urdu) | not run | >10 | 8/36/875 | 0/10 | ur-PK not indexed |
| دماغی کھیل | brain games (Urdu) | not run | >10 | –/–/– | 0/0 | ur-PK not indexed |
| iq games | English | not run | >10 | 6.0k/26/3 | 9/10 | en-GB only (ur-PK not indexed) |

Everything in Pakistan runs on en-GB. The Urdu terms have off-topic top 10s (we would likely lead "جاسوسی" if ur-PK were indexed).
Worth a separate look at en-GB, and a support question to Apple about why the ur-PK localization is not searchable.

## The fields

| Locale | Keywords | Characters | Bytes |
|---|---|---|---|
| ar-SA | `جنائي,تحقيق,لعبة,العاب,غموض,جريمة,لغز,قضية,بدون,نت,انترنت,تفكير,منطقي,تحري` | 74 | 135 |
| ru | `игра,детективные,расследование,сыщик,дедукция,следователь,улики,тайна,головоломки,интернета,загадки` | 99 | 188 |
| tr | `vaka,polisiye,suç,suçlu,bulma,dedektiflik,internetsiz,türkçe,gizemli,çözme,mantık,bulmaca,kim,ipucu` | 99 | 106 |
| hi | `logical,reasoning,games,find,culprit,investigation,crime,riddle,jasoos,jasoosi,paheli,hindi` | 91 | 91 |
| bn-BD | unchanged from 1.6.1 | 87 | 167 |
| mr-IN | unchanged from 1.6.1 | 95 | 197 |
| te-IN | 1.6.1 minus క్లూ (clue, a banned brand word in English) | 82 | 152 |
| ur-PK | unchanged from 1.6.1 | 96 | 96 |

All eight pass the rules: at most 100 characters, no space after a comma, no word from the locale's name or subtitle (also after
Arabic normalisation), no duplicates, no brand or competitor name, and the MURDER and FREE regexes of
`store/metadata/check-1.6.js` (copied verbatim at run time) find nothing. The ar-SA subtitle suggestion passes the same checks.

## Dropped, and why

| Locale | Dropped | Why |
|---|---|---|
| ar-SA | محقق, الجريمة, الغاز | duplicates after Apple's normalisation (name المحقق, جريمة, subtitle ألغاز) |
| ar-SA | قضايا | replaced by the hinted singular قضية; Apple maps one to the other |
| ar-SA | مشتبه | no hint; competitors use it only in subtitles |
| ar-SA (not added) | الجاني, مين, حل, استنتاج | no hint; the الجاني top 10 is unrelated apps |
| ar-SA (not added) | قضية لم تحل (لم, تحل) | 2/6 hint, but it is the Arabic name of CrimeBot |
| ar-SA (not added) | حزورة, فوازير, عقل | word-quiz apps or top 10 with 21,000-113,000 ratings |
| ru | логические | every phrase (логические игры, головоломки, загадки) led by 6,100-145,000 ratings |
| ru | взрослых | "для взрослых" phrases led by 18,000-85,000 ratings |
| ru | кто | no usable phrase; the strong one is a murder phrase |
| ru (not added) | преступление | no room; next in line (8 of 10 under 100 ratings, 4-11 hint 6/1) |
| ru (not added) | квест, мистика, iq | not what the game is, or brand-adjacent |
| tr | oyunları | covered by oyunu in the subtitle (stemming) |
| tr | zeka, akıl | zeka/akıl oyunları led by 136,000 ratings |
| tr (not added) | olay, sensin, ol | real but weaker; no room (dedektif sensin: 9 of 10 under 100, hint only on the full phrase) |
| tr (not added) | şüpheli, bilmece | no hint / word-quiz top 10 with 86,000 ratings |
| hi | detective, logic, brain | duplicates of en-GB, which India reads too |
| hi | जासूस, रहस्य, मिस्ट्री, सुराग, तर्क, केस, मुजरिम | Devanagari keywords never find us |
| hi (not added) | iq, suspect, clue | brand-adjacent (Detective IQ, Suspects, Clue) |
| te-IN | క్లూ | the word clue; rule against Clue |

## Five terms to watch

1. **SA تحقيق جنائي** (criminal investigation): hint 3/1, 9 of 10 under 100 ratings (#1 has 17), we are #10 (API #11). Stronger
   with the subtitle suggestion. AE: also #10.
2. **RU детективные игры** (detective games): hint 3/7, 6 of 10 under 100 ratings (#1 49, #10 3), API #122 because "игра" was
   missing. Same fix for детективная игра (hint 8/5, ratings 7/3/47) and игры расследования (no rival has
   it in the name).
3. **TR dedektiflik oyunu** (detective-work game): hint 8/4, 9 of 10 under 100 ratings (#1 18, #5 0, #10 0); -lik is not stemmed,
   so the word has to be in the field.
4. **RU дедукция** (deduction): hint 8/1, 7 of 10 under 100 ratings, none with the word in the name; also completes "логика и
   дедукция" with логика from the subtitle.
5. **IN logical reasoning games**: hint 5/5 (4-11: 3/9), 8 of 10 under 100 ratings, none with the phrase in the name, all on topic.

## What did not work

- **iTunes Search API:** 403 for most of the evening, shared with other keyword runs on this machine. Only 27 deeper ranks; the
  "our rank" column is otherwise "in the top 10 or not", from the web search page.
- **Hints:** India stopped after 121 queries (429, `Retry-After` 1,729 s); Pakistan, the UAE and Egypt were not run (Pakistan
  falls back to the 4 November hints, the UAE and Egypt had none).
- **Hinglish and Indic-script hints:** none collected, so jasoos, jasoosi, paheli and hindi are kept on test evidence, not on hints.
- **Web search is a proxy.** The `l=` parameter switches the store language on the web page; a phone set to Telugu or Urdu could
  behave differently. The product-page check for the Telugu and Urdu names hit a 429.
- **Search volume:** not public; hint order is the evidence.

## After the release

Repeat the tests 7 days after 1.7.1 goes live: "crimson ledger" + игра (RU), dedektiflik (TR), reasoning (IN, now in hi) and
قضية (SA), and the canary words that stay unique to the unindexed fields: thriller (te-IN), marathi (mr-IN), goyenda (bn-BD),
suspect (ur-PK, in India) and investigation (ur-PK, in Pakistan). If a canary starts to find us, that field is indexed and worth
a real proposal. Then re-measure the top 10 of the terms above.

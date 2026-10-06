# App Store-vindbaarheid (ASO), oktober 2026

Gekozen door een sparringronde van acht agents (zoekwoorden, aantrekkingskracht, concurrentie; daarna kritiek over
en weer, een jury en een controle op Apple-regels en feiten), op 6-7 oktober 2026. Jaimy liet de keuze aan Claude.
De teksten zelf staan in `store/metadata/1.1.2.json`; ingediend als versie 1.1.2 (build 10) op 7 oktober.

## Gekozen

- **nl-NL**: Crimson Ledger: Vind de dader · Logische puzzels met een moord  
  zoekwoorden: `sudoku,moordmysterie,detective,spel,zonder,reclame,internet,offline,mysterie,raadsel,misdaad,wifi`
- **en-US**: Crimson Ledger: Cozy Whodunnit · Murder mystery logic puzzles  
  zoekwoorden: `detective,sudoku,whodunit,culprit,find,killer,who,murderer,crime,solve,case,deduction,daily,suspect`
- **en-GB** (nieuw): Crimson Ledger: Detective Game · Find the culprit: logic puzzle  
  zoekwoorden: `murder,sudoku,mystery,cosy,crime,offline,riddle,whodunnit,killer,case,solve,daily,sleuth,suspect,who`

Hoofdtaal: advies **en-US** (nu nog nl-NL; de auto-modus liet Claude dit niet wijzigen, gaat mee in 1.1.3).
Tweede subcategorie: Strategie werd Bordspel.

## Waarom

Measured today: US and UK search index only our Dutch primary ('crimson ledger murder' misses us, 'crimson ledger moordmysterie' finds us), while NL indexes Dutch plus its English (U.K.) slot. So en-US becomes primary and en-GB serves Dutch users who search in English. At 0 ratings only title matches reach the top 12, so each name takes a term it can win. nl-NL 'Vind de dader' is the owner's friendlier hook and the TikTok line; 'moord' and 'logische puzzels' move to the subtitle, 'moordmysterie' to keywords. en-US 'Cozy Whodunnit' is friendly and takes the US's top 'whod' hint, while 'detective games' has no app under 22 ratings in its US top 12. en-GB 'Detective Game' takes NL's top 'det' hint, where 2-11-rating title matches rank. 'Murder mystery' stays only as a subtitle descriptor. The copy sells 96 free cases, no ads, no subscription.

## Wat de controleur aanscherpte

- fix: descriptionEdits (nl-NL #3, en-US #3): gift worlds: 'Speel je zeven dagen op rij' and 'Play seven days in a row' overstate the rule. In the code the streak only goes up when the daily case is solved: board.js calls App.updateStreak only if isDaily. Store.giftForStreak then gives the next locked paid world at 7 and 30 days, and gives nothing to Pass o
- fix: descriptionEdits (nl-NL #1): practice case: 'Nieuw in dit soort puzzels?' is a word-for-word copy of 'New to this kind of puzzle?'. 'Nieuw in' does not go with a puzzle type, so a Dutch reader stumbles over it.
- fix: descriptionEdits (nl-NL #4, en-US #4): Made in the Netherlands: 'Door één maker, in het Nederlands en het Engels.' and 'By one independent developer, in English and Dutch.' squeeze two facts into one fragment, so it reads as if the maker is 'in Dutch and English'. A native speaker would notice.
- note: locales.en-US.descriptionOpening: 'left of Marcus' is clue shorthand that reads clipped in running prose.
- note: descriptionEdits (en-US #5): '(96 cases together)' is not idiomatic English.
- note: locales.en-US.name: 'Whodunnit' is a dictionary word. But the US store has 'Whodunit?™: Murder Mystery' (MVP Games, 367 ratings, claims ™) and 'Whodunnit: Murder Mystery Game' (107 ratings). With our 'Murder mystery' subtitle, the listing echoes both names. No app is called 'Cozy Whodunnit' and our brand comes first, s
- note: extraLocalizations.en-GB.subtitle: 'Find the culprit' is also the full name of a 0-rating app ('Find The Culprit' by ELAGAME), which is #1 for that query in NL. The phrase is a plain description of our core action, matches 'Vind de dader', and is not a popular app name, so 2.3.7 does not apply.
- note: keywords (nl-NL, en-US, en-GB): sudoku: The game has no sudoku rule. floorplan.js only requires that the murderer alone was in the victim's room; there is no one-per-row or one-per-column constraint. But 'murder sudoku' is what the market calls this genre (Whodoku, Enigmic and Mysteryic use it), and the live 1.1.1 keywords in both locales
- note: otherLevers: App Privacy: Verified. meting.js sends anonymous counters to crimson-meting.spaarplan-data.workers.dev. They are on by default and can be switched off in Settings. privacy.html describes them, but store/APP-STORE-INVULLEN.md line 62 still answers 'no data collected'. The new description now mentions the counters
- note: evidence and otherLevers priority 1: indexing claim: 'The English stores index only the Dutch primary' claims more than the data shows. In the US and UK, our brand plus 'sudoku' (in both keyword sets), 'misdaad' or 'speurder' also fails to find us. Yet the iTunes lookup shows the English listing live in the US and UK. So it looks as if only the Dutch 
- note: whatsNew (written by assemble.js, outside the proposal): 'Verder kleine verbeteringen' and 'Minor improvements' must be true for build 10. Meting.VERSION is '1.1.2', so this build is not identical to 1.1.1. A generic note is allowed for minor changes (guideline 2.3.12).

## Volgende hefbomen (op volgorde)

1. Ship 1.1.2 in this order. First, in App Information, set Primary Language to English (U.S.). Then add English (U.K.). Only after that, fill nl-NL, en-US and en-GB from this listing. Build store/metadata/1.1.2.json with assemble.js, and stop if it prints 'skipped edit' or 'own edit not found once'. (About 30 minutes in App Store Connect. Build 10 is already uploaded.)
1. Correct the App Privacy answers before submitting. Declare Usage Data > Product Interaction for Analytics, not linked to the user and not used for tracking. (About 10 minutes)
2. Run the case of the week as an In-App Event in nl-NL, en-US and en-GB. nl: 'Zaak van de week', short text 'Vind de dader in de moordpuzzel van deze week' (46). en: 'Case of the Week', short text 'Find the culprit in this week's whodunnit' (42). (Medium: one 1920x1080 card template, texts per locale, a review per event, at most 31 days each)
2. Change the second subcategory from Strategy to Board. (Trivial: App Information, ships with 1.1.2)
2. Rebuild screenshot 1 in the nl and en sets around the new hook: 'Vind de dader.' / 'Find the culprit.' over the floor plan, with one green statement and 'Wie was alleen met het slachtoffer?'. No prices on screenshots. (Medium: store/make-store-cards.js)
2. In 1.1.3, ask for a rating at up to three high points: after the 2nd solved case, at the 7-day gift world, and after a case of the week solved without hints. Never ask after a wrong accusation. (Low: app.js, next build)
3. Align TikTok with the store. Use the display name 'Crimson Ledger · vind de dader', the hook 'Kun jij de dader vinden?', the app name on screen in every post, and a pinned comment 'Zoek Crimson Ledger in de App Store'. (Trivial)
3. Re-measure 7 and 14 days after release with apps.apple.com search (the real top 12) and the hints, and log the results in LOGBOEK. Indexing tests: US 'crimson ledger deduction' (en-US only) and NL/GB 'crimson ledger riddle' (en-GB only). Ranking terms: NL moord, moordmysterie, detective game, detective spel, puzzels zonder internet, find the culprit, murder sudoku; US whodunnit, cozy whodunnit, murder mystery puzzle. (Low: one script run per check)
3. Keep a fallback en-US name ready in case App Review objects to 'Whodunnit': 'Crimson Ledger: Cozy Mystery' (28). (Trivial)
4. Rotate the promotional text weekly with the case of the week, always keeping 'Geen reclame, geen abonnement'. (Low)
4. Give creators who post this puzzle genre a free Crimson Pass through an offer code, with no script and no paid post. Ask them to mark the post as made with a gifted product. (Low to medium: create the codes and test redemption)
5. Later, once traffic allows: a custom product page assigned to the keywords 'murder sudoku' and 'moord sudoku', showing the floor plan as a logic puzzle first. (Medium: a separate screenshot set)

## Meten

7 en 14 dagen na goedkeuring van 1.1.2: zoekposities opnieuw meten (NL, US, GB) en in LOGBOEK.md zetten,
met dezelfde termen als op 4 en 5 oktober plus "vind de dader", "cozy whodunnit", "detective game".

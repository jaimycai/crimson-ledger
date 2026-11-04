# Zoekwoorden Crimson Ledger: onderzoek en nulmeting (4 november 2026)

Vraag van Jaimy, 4-11-2026: "er moeten betere keywords waar mensen naar zoeken zoals sudoku, murdoku etc etc, kijk bij
competitors". 94% van de downloads komt uit App Store-zoeken. De voorstellen staan in `store/metadata/1.6.0/<taal>.json` en
`store/metadata/1.6.0.json`; `node store/metadata/check-1.6.js` geeft ALLES IN ORDE. Niets is geüpload en niets is gecommit.

## In het kort

1. **En-GB is ons zwaarste zoekwoordveld.** Elke winkel leest twee of meer taalvelden. En-GB telt mee in 12 van onze 14
   prioriteitsmarkten (standaardtaal in Saoedi-Arabië, Turkije en India; extra taal in Brazilië, Mexico, Frankrijk,
   Nederland, Rusland, Korea, Duitsland, Spanje en Italië). Alleen de VS en Japan lezen het niet: die lezen en-US.
2. **Apple koppelt geen woorden tussen twee taalvelden.** Een zoekterm van twee woorden moet in één taal compleet zijn.
   Dus "sudoku" moet in elke taal zelf in naam, ondertitel of zoekwoorden staan (gemeten, zie §2).
3. **Sudoku in de naam is een ruil die loont, maar wel een ruil.** In nl, de, es, pt en ru schuift het genrewoord (detective)
   van de naam naar de ondertitel, waar het minder zwaar telt. Op kaal "sudoku" halen we de top 10 voorlopig niet (VS: 8 van
   de 10 apps boven de 10.000 beoordelingen, mediaan 218.460). De winst zit in "sudoku crimen", "sudoku detetive", "sudoku sin
   anuncios": daar staan bijna alleen kleine apps. En in conversie: wie sudoku zoekt, ziet het woord (`store/CONVERSIE.md`).
4. **"Murdoku" is de sterkste term die we niet hebben.** Op "mur" staat hij bovenaan in BR, MX, FR, NL, RU, IN, DE, ES, PT;
   op "murd" ook in de VS, GB, SA, JP en IT. De top 10 is klein. Maar het is een geregistreerd merk (Canada, VK; VS
   aangevraagd) van Studios Digivoid Inc., ook voor downloadbare logicaspellen. Apple verbiedt het in zoekwoorden. Advies:
   niet opnemen. Jaimy beslist (§5).
5. **Plurals en categoriewoorden hoeven niet.** Apple vindt enkelvoud ook op meervoud (en, nl, es, fr, pt, ru; niet tr) en
   vindt "games", "juegos", "jeux", "Spiele", "giochi", "oyunlar", "игры", "jogos" via de categorie. Dat maakt plek vrij.
6. **Wat we niet kunnen weten:** zoekvolumes. Apple geeft ze niet openbaar. Het bewijs is de volgorde in Apple's
   zoeksuggesties en wie er in de top 10 staat (§7).
7. **1.6.0 (build 21) is op 3-11 ingediend; de App Store toont nog 1.4.1.** Naam, ondertitel en zoekwoorden kunnen alleen mee
   met een versie die nog bewerkbaar is. Deze teksten gaan dus alleen mee als 1.6.0 wordt teruggetrokken of pas met de
   volgende versie. Dat is de keuze van Jaimy.

## 1. Hoe gemeten

Op 4-11-2026 tussen 18:30 en 20:10 (CET), alleen openbare bronnen, geen App Store Connect.

| Bron | Wat het zegt | Omvang |
|---|---|---|
| Zoeksuggesties (`MZSearchHints`, per winkel via `X-Apple-Store-Front`), prefix voor prefix | Wat zoekers typen. "3/1" = na 3 getypte tekens op plek 1 | ~4.700 aanvragen, 21 winkels |
| iTunes Search API, `limit=200` | Onze rang 1-200 en de top 15 met beoordelingen | 1.180 combinaties term × winkel |
| Zoekpagina `apps.apple.com/<cc>/iphone/search` | De echte top 12 in de winkel, met ondertitels | 1.180 combinaties |
| Test "crimson ledger + woord" tegen de live teksten van 1.4.1 | Welk taalveld in welke winkel telt | ~100 tests met controlewoord |
| USPTO TSDR, CIPO, Trademark Dashboard, uitgevers | Merkstatus | zie §5 |

Beide Apple-eindpunten hebben een limiet. De suggesties gaven twee keer een 429 met `Retry-After`, die zijn gerespecteerd.
Daardoor is de prefixloop na de eerste vier winkels ingekort (3, 4 en 6 tekens plus de volledige term).

Leeswijzer voor de tabellen: **Hint** = kortste prefix/plek in de suggesties. **Rang** = iTunes-rang 1-200, "–" = niet
gevonden. **Top 12** = plek op de zoekpagina. **<1k** en **>10k** = aantal apps in de top 10 onder 1.000 of boven 10.000
beoordelingen. Een term met veel <1k en een korte hint is wat we zoeken.

## 2. Welke velden tellen in welke winkel

Apple's [tabel met talen per winkel](https://developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations/)
zegt niets over zoeken, dus getest met woorden die in maar één taal van de live 1.4.1 staan, en een controlewoord dat
nergens staat.

| Winkel | Gemeten: telt mee | Bewijs |
|---|---|---|
| NL, DE, FR, ES, IT, BR, MX, RU, KR, PT | eigen taal + en-GB | "crimson ledger whodunnit" (alleen en-GB) vindt ons in alle tien; controle "zzqqvv" niet |
| SA, TR, IN, ID, VN, SG | en-GB + eigen taal | idem; SA "غموض", TR "polisiye", SG "悬疑" vinden ons ook |
| JP | ja + en-US, **niet** en-GB | "whodunit" (en-US) wel, "whodunnit" (en-GB) niet |
| VS | en-US + es-MX, pt-BR, ru, ko, ar-SA, vi, zh-Hans, fr | "acertijo", "raciocínio", "тайна", "용의자", "غموض", "giải", "悬疑", "énigme" vinden ons; nl-NL "moordmysterie" niet |

Andere metingen die de voorstellen sturen:

- **Geen koppeling tussen talen.** "whodunnit zaak" in NL (en-GB + nl-NL): 0 resultaten. Ook "raadsel sleuth", "whodunnit
  polisiye" (TR), "sleuth raciocínio" (BR): 0 resultaten. Elke taal moet haar eigen combinaties kunnen maken.
- **Categorie telt als woord.** "crimson ledger games" en "board" vinden ons in GB, terwijl die woorden niet in en-GB staan;
  "strategy" niet. Zo ook Spiele, jeux, juegos, giochi, oyunlar, игры, jogos. Niet in NL ("spellen") en niet in SA
  ("ألعاب"). Hoe zwaar dit weegt tegen een zoekwoord weten we niet. Daarom blijft `games` in en-US en en-GB staan
  ("detective games" is de sterkste genreterm); in de talen met weinig ruimte is het categoriewoord geschrapt.
- **Enkelvoud vindt meervoud.** nl raadsel→raadsels, puzzel→puzzels; es pista→pistas, caso→casos; fr énigme→énigmes, ook
  zonder accent; pt enigma→enigmas; ru загадка→загадки; it giallo→gialli. **Niet** in het Turks (bulmaca vindt bulmacalar
  niet) en niet bij it colpevole→colpevoli. Turkse vormen staan daarom los in het veld.
- **Spelling.** en-GB "whodunnit" vindt ook "whodunit", andersom niet (JP). Daarom `whodunnit` in beide Engelse velden.
- **Bytes of tekens.** Apple's [naslag voor het zoekwoordveld](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/)
  zegt 100 bytes. `check-1.6.js` telt tekens. De API accepteerde op 2-11 ja met 237 bytes zonder fout (`meta.log`). Of Apple
  voorbij 100 bytes indexeert is onbekend. Daarom staat in elk veld het belangrijkste woord vooraan, en blijven de Latijnse
  talen waar het kan onder 100 bytes (uitzonderingen: tr 109, vi 114). Test na de release: §8.

## 3. Concurrenten

Beoordelingen op 4-11-2026. "16 winkels" = som over US, ES, MX, BR, FR, DE, NL, IT, JP, TR, SA, RU, KR, GB, IN, PT. "Top 12"
= zo vaak in de top 12 van onze 1.180 metingen.

| App | Ondertitel (VS) | VS | 16 winkels | Top 12 | Sinds |
|---|---|---:|---:|---:|---|
| Enigmic: Crime Puzzle Cases | Murder Sudoku Detective Clues | 2.346 | 10.553 | 318 | mei 2026 |
| Whodoku - Murder sudoku | The true crime Sudoku | 62 | 369 | 207 | jul 2026 |
| Murder Sudoku: Tiny Crimes | Cozy Murdoku to Go | 250 | 1.733 | 171 | jun 2026 |
| Sudoku Detective: Murder Case | Clues, Suspects, Logic Puzzle | 15 | 120 | 135 | jul 2026 |
| Detective Sudoku | Unsolved Case Logic Puzzles | 9 | 44 | 129 | jul 2026 |
| Murder Sudoku GridNoir | 3000+ daily logic cases | 31 | 226 | 108 | mei 2026 |
| Murder Sudoku: Cozy Culprits | Murdoku: Mystery Logic Puzzle | 9 | 40 | 106 | jul 2026 |
| Cluedoku: Detective Sudoku | Daily murder mystery cases | 7 | 146 | 102 | aug 2026 |
| Detective Files: Mystery Cases | Use logic & solve puzzle | 5.942 | 7.840 | 96 | apr 2026 |
| Roomdoku: Sudoku Whodunit | Logic mystery in your pocket | 3 | 11 | 94 | mei 2026 |
| Murder Sudoku: Mystery Cases | Cozy Detective Logic Puzzles | 72 | 88 | 75 | sep 2026 |
| Murder Sudoku Logic Puzzles | Brain logic sudoku puzzles (elders: "Murdle, Murdoku inspired") | 31 | 101 | 59 | jun 2026 |
| Motive: Murder Mystery Sudoku | Detective Games, Logic Puzzles | 0 | 2 | 59 | sep 2026 |
| Murder Matrix: Logic Puzzles | Solve a new case every day | 33 | 176 | 54 | jun 2026 |
| Crimoku: Puzle, lógica, crimen | Crime Logic Puzzle | 11 | 69 | 45 | mei 2026 |
| Mysteryic: Murder Sudoku Game | Logic Puzzle Detective Cases | 0 | 3 | 39 | aug 2026 |

Terugkerende woorden (28 genre-apps, VS). Namen: murder 19, sudoku 17, mystery 9, detective 8, logic 4, puzzle 3, cases 3,
whodunit 3. Ondertitels: logic 16, puzzle(s) 15, crime 6, detective 6, mystery 5, cases 5, solve 4, cozy 3. In de lokale winkels
hetzelfde beeld met lokale woorden: krimi en rätsel (DE), detective en misterio (ES/MX), detetive en mistério (BR/PT), giallo en
rompicapo (IT), 추리 en 사건 (KR), детектив en головоломки (RU). Het genre noemt zich "sudoku + moord"; zonder dat woord
blijven **sudoku + mystery/detective/logic** over, en die staan precies in onze namen.

Grote buren die we niet inhalen, en die de termen "logic puzzle" en "brain teaser" bezet houden: Logic Puzzles - Clue Game
(58.654), Cross Logic (49.376), Logic Grid Puzzles (39.183), Brain Test (1,5 mln), Sudoku.com (1,9 mln), Killer Sudoku by
Sudoku.com (218.460).

## 4. Bevindingen per prioriteitsmarkt

| Markt | Sterkste vraag (hint) | Kleine top 10 om te winnen | Wij nu (1.4.1) | Gevolg |
|---|---|---|---|---|
| **VS** | detective games 3/1, logic puzzles 3/4, mystery games 3/5, whodunnit 4/1, deduction puzzle 4/1 | whodunit (9 van 10 onder 1k), sudoku detective (7), crime puzzle (5), deduction (6) | crime sudoku 5, culprit 30 | Naam blijft. `brain,teaser` eruit (10 van 10 boven 10k), `grid,daily,variants,whodunnit` erin |
| **Saoedi-Arabië** | لغز 2/2, غموض 2/5, لعبه محقق جنائي 3/1, تحقيق جنائي 3/2, محقق 3/2, لعبة محقق 3/4, جريمة 4/1 | لعبة محقق (10), محقق (9), جريمة (9), لغز الجريمة (9) | سودوكو محقق 1, لعبه محقق جنائي 4, لعبة محقق 21, لغز الجريمة 30 | 1.6 liet جريمة vallen; terug in het verborgen veld. Grootste kans per moeite |
| **Japan** | 謎解き, ナンプレ, 脳トレ, 論理パズル 1/1; 数独, 探偵 1/2; 犯人探し 1/4; 推理ゲーム 1/7 | 推理パズル (6), 探偵 (6), 推理ゲーム (6) | 数独 犯人 3, 犯人探し 41 | 数独 is merk van Nikoli; naam wordt ナンプレ×謎解き (§6) |
| **Brazilië** | murdoku 3/1, enigma 3/1, raciocínio lógico 3/2, detetive 3/7, sudoku sem anúncio 4/6 | sudoku sem anúncio (10), sudoku crime (9), sudoku detetive (9), jogo de detetive (7) | culpado 1, sudoku crime 10, sudoku detetive 13 | Naam Sudoku Enigma; ondertitel met detetive en sem anúncios |
| **Mexico** | murdoku 3/1, acertijos 3/3, detective 3/4, sudoku crimen 4/8, juegos de detectives 10/1 | sudoku crimen (10), sudoku detective (10), juegos de misterio (8), juego de detectives (8) | sudoku crimen 22, detective 30, sudoku detective 15 | Naam Sudoku; acertijos in de ondertitel |
| **Turkije** | dedektif oyunları, suç oyunları, zeka oyunları 3/1; sudoku türkçe 3/2; dedektif oyunu 3/4; sudoku reklamsız 3/5 | vaka (10), dedektif oyunu (8), dedektif (8), gizem oyunları (6) | sudoku dedektif 2, gizem sudoku 3, dedektif oyunu 152 | Geen stemming: `oyunları`, `suç`, `suçlu`, `bulma`, `türkçe` los |
| **Frankrijk** | murdoku 3/1, enquête criminelle 3/1, énigmes logiques 3/3, enquête policière 3/4, casse tête 3/6, sudoku hors ligne 3/6 | enquête criminelle (7), sudoku enquête (10), sudoku détective (10) | sudoku enquête 7, jeu d'enquête 26 | Naam blijft; `criminelle,casse,tête,hors,ligne` erin |
| **Nederland** | murdoku 3/1, detective game 3/1, raadsels 3/2, sudoku denksport 3/3, detective 3/4, denksport 3/6 | detective game (8), detective spel (9), sudoku zonder reclame (9), misdaad spel (9) | dader 1, sudoku zonder reclame 13, detective sudoku 18 | Naam Mystery Sudoku; detective game naar de ondertitel |
| **Rusland** | murdoku 3/1, сыщик 3/1, логические игры 3/2, головоломки 3/2, загадки 3/4, детективные игры 3/8, судоку без рекламы 3/8 | судоку детектив (10), расследование (8), детектив (5), детективные игры (5) | судоку детектив 17, судоку без рекламы 65 | Naam Судоку; детектив in de ondertitel |
| **India** | murdoku, detective games, iq games 3/1; logic games, mystery games 3/3 | detective games (6), logic grid (8), sudoku no ads (7) | crime sudoku 9, detective sudoku 42 | Eigen schrift: bijna geen suggesties. En-GB doet het werk; hi, mr, te, bn dragen Latijnse woorden |
| **Zuid-Korea** | 추리게임 1/1, 스도쿠 1/4, 논리퍼즐 1/5, 탐정게임 2/1, 범인 찾기 2/1, 수수께끼 2/1 | 논리 퍼즐 (9), 범인 (8), 추리 게임 (7) | 범죄 스도쿠 6, 범인 찾기 28 | Naam blijft; aaneengeschreven vormen in het veld |
| **Duitsland** | murdoku 3/1, detektiv spiele, rätsel spiele 3/1; logik spiele 3/2; sudoku ohne werbung 3/4; krimi spiele 3/6; detektiv 4/5 | detektiv (6), krimi (6), detektiv spiele (5) | sudoku detektiv 8, krimi sudoku 26 | Naam Rätsel-Sudoku; Detektivspiel naar de ondertitel |
| **Spanje** | murdoku 3/1, murdoku español 3/2, detective 3/2, murdle 3/3, sudoku sin anuncios 3/3, sudoku crimen 3/5, acertijos 3/5 | sudoku crimen (9), sudoku detective (9), sudoku sin anuncios (8) | sudoku crimen 20, detective 50 | Naam Sudoku; `crimen` vooraan in het veld (mag niet in de naam, regel 3-11) |
| **Italië** | murdoku 3/2, detective game 3/2, rompicapo 3/2, detective 3/3, sudoku senza pubblicità 3/6, risolvi casi 4/2 | sudoku senza pubblicità (10), risolvi casi (5) | sudoku giallo 3, sudoku mistero 7 | Naam en ondertitel zijn al goed; `investigatore,indovinelli,crimine` erin |

Let op: op dit moment scoren we op termen met een moordwoord, door de live 1.4.1 (MX en ES "quien es el asesino" 1, BR "quem
matou" 2, IT "sudoku omicidio" 3, TR "cinayet sudoku" 5, NL "moordmysterie" 6). Die posities verdwijnen met 1.6, ook zonder dit
voorstel. Dat is het gevolg van de regel van 3-11. In de nulmeting staan ze met een `*`.

## 5. Murdoku en Murdle

### Murdoku

- **Wat het is.** Boekenreeks van puzzelmaker Manuel Garand uit Montreal. Deel 1 verscheen op 28-10-2025 bij [Puzzlewright
  Press](https://www.hachettebookgroup.com/titles/manuel-garand/murdoku/9781454961796/), met edities bij onder meer
  [Penguin](https://www.penguin.co.uk/books/476207/murdoku-by-garand-m/9781405985451) en Planeta. De uitgever meldt meer dan
  een miljoen exemplaren. In Spaanse pers is het al een soortnaam ("los Murdokus",
  [Hipertextual, juli 2026](https://hipertextual.com/actualidad/me-he-vuelto-adicto-a-los-murdokus-y-ahora-he-encontrado-el-juego-perfecto-para-el-movil-hay-miles-y-son-100-gratis/)).
- **Merk.** MURDOKU staat op naam van **Studios Digivoid Inc.** (Longueuil, Québec):
  - Canada: [geregistreerd als TMA1459099 op 30-10-2026](https://ised-isde.canada.ca/cipo/trademark-search/2421268), klassen 9, 16, 25, 28, 41, 42.
  - VK: [UK00004336152, geregistreerd op 1-5-2026](https://www.trademarkdashboard.com/uk/UK00004336152), zelfde klassen (secundaire bron; het register zelf gaf een captcha).
  - VS: [aanvraag 99677726](https://tsdr.uspto.gov/statusview/sn99677726), ingediend 2-3-2026, nog geen registratie; op 16-10-2026 opgeschort.
  - EU en Spanje: niet kunnen vaststellen. TMview en eSearch weren geautomatiseerde aanvragen; zoeken vond niets, wat niets bewijst.
  - Klasse 9 dekt letterlijk downloadbare software voor logicaspellen: dezelfde waar als wij verkopen. In de drie landen
    staan merkgemachtigden op het dossier. Een openbaar verband tussen Digivoid en Garand vond ik niet.
- **Officiële app.** Op 31-7-2026 bestond die [volgens iPhoned](https://www.iphoned.nl/nieuws/murdoku-iphone/) niet. De klasse 9-aanvraag wijst erop dat
  er wel iets kan komen.
- **Wie het woord nu gebruikt.** Murdoku: Cozy Murder Sudoku (naam, sinds 25-9-2026), 数独杀 - Murdoku (naam), Tiny Crimes
  ("Cozy Murdoku to Go"), Cozy Culprits ("Murdoku: Mystery Logic Puzzle"), Murder Sudoku Logic Puzzles ("Murdle, Murdoku
  inspired"). Ze staan vandaag live. Dat bewijst niet dat het mag: de Canadese registratie is vijf dagen oud.
- **Wie er scoort op "murdoku".** VS: Whodoku (62), Enigmic (2.346), Tiny Crimes (250), Murder Sudoku - Crime Puzzle (2), Detective
  Files (5.942). Ook apps zonder het woord in naam of ondertitel staan er, dus Apple zoekt hier niet alleen op tekst (hun
  verborgen zoekwoorden kennen we niet). In BR, MX, FR, NL, ES, IT: 7 tot 9 van de 10 apps onder 1.000 beoordelingen.

Vraag: hoe hoog staat het in de suggesties?

| Winkel | "mur" → murdoku | "murd" → murdoku | "murd" → murdle | "murdl" → murdle |
|---|---|---|---|---|
| US | – | 1 | 2 | 2 |
| SA | 4 | 1 | – | – |
| JP | 5 | 1 | – | – |
| BR | 1 | 1 | – | 1 |
| MX | 1 | 1 | 2 | 1 |
| TR | 2 | 2 | 1 | 1 |
| FR | 1 | 1 | – | – |
| NL | 1 | 1 | 3 | 1 |
| RU | 1 | 1 | 4 | 1 |
| IN | 1 | 1 | – | – |
| KR | – | – | – | – |
| DE | 1 | 1 | – | 1 |
| ES | 1 | 1 | 3 | 1 |
| IT | 2 | 1 | – | – |
| GB | 2 | 1 | 3 | 1 |
| PT | 1 | 1 | – | – |
| ID | – | 1 | – | – |
| VN | 1 | 1 | 3 | 1 |
| PK | – | – | – | – |
| SG | 1 | 1 | – | – |

### Murdle

Dagelijkse puzzel en boekenreeks van G.T. Karber ([murdle.com](https://murdle.com/) noemt hem als maker en toont geen iOS-app).
In de suggesties meestal minder sterk dan Murdoku: "murd" plek 1 in TR, 2 in de VS en MX, 3 in GB, NL en ES. De top 10 op "murdle" is ook lastiger:
NYT Games, Logic Puzzles (58.654), Wordle-klonen. Merkstatus in de VS, op naam van **A Red Herring Corporation** (Los Angeles;
het register noemt Karber niet):

| Serienummer | Klasse | Status |
|---|---|---|
| [98191541](https://tsdr.uspto.gov/statusview/sn98191541) | 16, boeken en tijdschriften | Geregistreerd 8-10-2024 (7526939) |
| [98191555](https://tsdr.uspto.gov/statusview/sn98191555) | 41, online puzzels | Geregistreerd 8-10-2024 (7526940) |
| [98191545](https://tsdr.uspto.gov/statusview/sn98191545) | 28, bordspellen en logicapuzzels | Geregistreerd 24-3-2026 (8188339) |
| [98191535](https://tsdr.uspto.gov/statusview/sn98191535) | 9, mobiele app met puzzelspel | Toegestaan, nog geen gebruik aangetoond; vierde verlenging 14-8-2026 |

### Apple's regel en het risico

[Richtlijn 2.3.7](https://developer.apple.com/app-store/review/guidelines/#accurate-metadata) noemt expliciet "trademarked
terms, popular app names" als wat je niet in metadata mag stoppen, en geeft Apple het recht zoekwoorden te wijzigen. De
[naslag voor het zoekwoordveld](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/)
zegt ook dat namen van andere apps of bedrijven niet zijn toegestaan. Richtlijn 5.2.1 verbiedt beschermd materiaal van
anderen zonder toestemming.

| Risico | Hoe het gaat | Inschatting |
|---|---|---|
| Afwijzing bij de review | Reviewer ziet het zoekwoord, wijst af op 2.3.7 | Mogelijk, niet zeker. Herstel is het woord schrappen en opnieuw indienen: dagen vertraging |
| Klacht van de merkhouder | Via het [App Store Content Dispute-formulier](https://www.apple.com/legal/intellectual-property/dispute-forms/app-store/). Apple vraagt de aanbieder het met de klager op te lossen | Reëel: registraties zijn vers, gemachtigden staan klaar, klasse 9 is exact onze waar |
| Verwijdering of accountgevolgen | Bij herhaling of als een klacht niet wordt opgelost (2.3.7, 5.2) | Klein, maar de schade is groot: één app, één account, 94% zoekverkeer |
| Openbaar spoor | Onze repo is openbaar, dus `store/metadata/*.json` toont het "verborgen" veld aan iedereen | Zeker. Een merkhouder hoeft niet te raden |

Wat ik niet kon vinden: een openbaar geval van Apple-actie op juist deze woorden. Het risico is dus redenering, geen statistiek.

### Advies

**Murdoku en Murdle niet opnemen, in geen enkel veld.** De winst is reëel maar onbekend van omvang; de regel is expliciet, de
merkhouder bestaat en het staat al in de vaste afspraken (`.agents/product-marketing.md`). Ik heb ze dus niet toegevoegd.
`check-1.6.js` blokkeert ze ook.

Als Jaimy het risico wel wil nemen: alleen `murdoku`, alleen in het verborgen veld, alleen in en-GB (bereikt 12 van de 14
markten) en en-US. Nooit in naam, ondertitel, beschrijving of onderschriften. Dat vraagt een wijziging in `BRANDS` in
`check-1.6.js` en in de vaste afspraken, en het is pas weg te halen met een nieuwe versie. Eerst meten wat 1.6 zonder het woord
doet is goedkoop: als "detective" + "sudoku" + "logic" ons al in de top 12 op "murdoku" brengen, is de vraag opgelost.

## 6. Voorstel per taal

Naam: "Crimson Ledger: …", hoogstens 30 tekens, dus 14 tekens voor het genrewoord. "Sudoku Detective", "Detektiv-Sudoku", "Sudoku
Misterio" en "Sudoku Detetive" passen net niet (31-32 tekens). "Sudoku Crimen" en "Krimi-Sudoku" passen wel, maar misdaadwoorden
mogen niet vooraan (regel 3-11). Daarom waar nodig kaal "Sudoku" met het genrewoord in de ondertitel: Apple telt naam en
ondertitel samen voor "sudoku detective".

**en-US** · naam blijft: Mystery Sudoku · ondertitel blijft: Detective logic puzzle, no ads

- Oud: `games,brain,teaser,whodunit,cozy,culprit,case,solving,suspect,deduction,sleuth,offline,crime,adults`
- Nieuw (97 tekens, 97 bytes): `games,whodunnit,deduction,culprit,crime,grid,cozy,offline,daily,case,solving,adults,find,variants`
- Waarom: Telt in de VS en Japan. Naam blijft: sudoku plus mystery. Eruit: brain, teaser (top 10 alleen apps boven 10k), suspect ("suspects" is 3/1 maar een merk met 57k), sleuth (geen hint), whodunit (whodunnit dekt beide). Erin: whodunnit (4/1), grid ("logic grid puzzles"), daily, find ("find the culprit": 7 van 10 klein, rang 29), variants ("sudoku variants" 8/1).

**en-GB** · naam blijft: Mystery Sudoku · ondertitel blijft: Detective logic puzzle, no ads

- Oud: `games,brain,teaser,whodunnit,cosy,culprit,case,solving,suspect,deduction,sleuth,offline,crime,who`
- Nieuw (98 tekens, 98 bytes): `games,whodunnit,deduction,culprit,crime,grid,cozy,offline,daily,case,solving,brain,adults,variants`
- Waarom: Het zwaarste veld: standaard in SA, TR, IN, ID, VN, PK, extra in NL, DE, FR, ES, IT, BR, MX, RU, KR, PT. `cozy` in plaats van `cosy` (cozy games 3/2 tegen cosy games 4/1, en de andere markten schrijven cozy). `brain` blijft ("brain puzzle" 3/4; in SA, TR, IN is de top 10 zwakker), `teaser` weg (7 van 10 boven 10k).

**ar-SA** · naam blijft: سودوكو المحقق · ondertitel blijft: ألغاز ذكاء بوليسية بلا إعلانات

- Oud: `العاب,الغاز,بدون,نت,انترنت,تحقيق,جنائي,ذهنية,تفكير,للكبار,غموض,قضايا,منطق,مشتبه,محقق,لعبة,لغز`
- Nieuw (94 tekens, 172 bytes): `محقق,جنائي,تحقيق,جريمة,الجريمة,لعبة,العاب,غموض,الغاز,لغز,بدون,نت,تفكير,منطق,انترنت,مشتبه,قضايا`
- Waarom: Naam en ondertitel blijven. جريمة en الجريمة terug (جريمة 4/1, لغز الجريمة 3/8, 9 van 10 klein; 1.6 liet ze vallen; in het verborgen veld mogen misdaadwoorden). جنائي en تحقيق vooraan (لعبه محقق جنائي 3/1, تحقيق جنائي 3/2). Eruit: ذهنية, للكبار (geen hint).

**ja** · naam: 数独×謎解き → **ナンプレ×謎解き** · ondertitel blijft: 犯人探しの推理ゲーム・広告なし

- Oud: `ナンプレ,探偵,ミステリー,パズル,脳トレ,ロジック,オフライン,暇つぶし,容疑者,刑事,捜査,アリバイ,手がかり,証言,論理,犯罪,サスペンス,頭の体操,名探偵,本格,推理パズル,事件`
- Nieuw (91 tekens, 231 bytes): `数独,探偵,論理,事件,解決,脳トレ,パズル,ロジック,ミステリー,オフライン,暇つぶし,犯罪,手がかり,名探偵,サスペンス,頭の体操,容疑者,刑事,捜査,アリバイ,証言,推理パズル`
- Waarom: Naam: 数独 is merk van Nikoli; ナンプレ is ook 1/1 en 6 van de 10 topapps zijn gelijk. 数独 alleen nog in het veld (besluit Jaimy, zie boven). Erin: 解決 (事件解決ゲーム 1/5). Eruit: 本格.

**pt-BR** · naam: Detetive → **Sudoku Enigma** · ondertitel: Sudoku de mistério e lógica → **Jogo de detetive, sem anúncios**

- Oud: `jogo,jogos,crime,culpado,enigma,quem,foi,caso,pistas,offline,raciocínio,wifi,sem,anúncios`
- Nieuw (90 tekens, 95 bytes): `crime,mistério,lógica,raciocínio,offline,charadas,investigação,culpado,caso,pista,suspeito`
- Waarom: Naam: enigma is 3/1, sudoku 3/1; "Sudoku Detetive" wordt 31 tekens. Ondertitel: detetive 3/7, "sudoku sem anúncio" 4/6 met 10 van 10 klein; "jogo" telt samen met de categorie. Veld: jogo, jogos, quem, foi, wifi eruit; mistério en lógica uit de oude ondertitel, charadas, investigação, suspeito erin. `crime` vooraan ("sudoku crime": rang 10).

**es-MX** · naam: Detectives → **Sudoku** · ondertitel: Sudoku de misterio y lógica → **Detective, acertijos y lógica**

- Oud: `juegos,crimen,acertijos,culpable,pistas,caso,sospechoso,quién,sin,anuncios,internet,resolver,enigma`
- Nieuw (97 tekens, 97 bytes): `crimen,misterio,sin,anuncios,internet,resolver,culpable,pista,enigma,caso,sospechoso,rompecabezas`
- Waarom: Naam: sudoku 3/1; "Sudoku Misterio" wordt 31 tekens, "Sudoku Crimen" mag niet vooraan. Ondertitel: detective 3/4, acertijos 3/3 (juegos komt van de categorie, dus ook "juegos de detectives" 10/1 en "juegos de acertijos" 6/2). `crimen` vooraan: "sudoku crimen" 4/8, 10 van 10 klein. Telt ook in de VS.

**tr** · naam blijft: Gizem Sudoku · ondertitel blijft: Reklamsız dedektif oyunu

- Oud: `kim,bul,çözme,bulmaca,mantık,zeka,akıl,polisiye,internetsiz,dedektiflik,şüpheli,oyunları,suçlu,vaka`
- Nieuw (100 tekens, 109 bytes): `oyunları,suç,suçlu,bulma,kim,zeka,bulmaca,mantık,türkçe,internetsiz,vaka,polisiye,akıl,çözme,gizemli`
- Waarom: Naam en ondertitel blijven. Turks kent geen stemming, dus losse vormen. Erin: suç (suç oyunları 3/1), bulma (suçlu bulma oyunu 3/2), türkçe (sudoku türkçe 3/2), gizemli (4/4). Eruit: bul, dedektiflik, şüpheli.

**fr-FR** · naam blijft: Sudoku Enquête · ondertitel blijft: Jeu de détective, sans pub

- Oud: `policière,logique,crime,coupable,internet,mystère,énigme,déduction,suspect,indice,jeux,réflexion`
- Nieuw (94 tekens, 99 bytes): `criminelle,policière,logique,énigme,casse,tête,mystère,crime,coupable,réflexion,hors,ligne,qui`
- Waarom: Naam en ondertitel blijven: ze dragen al sudoku en enquête. Erin: criminelle (enquête criminelle 3/1, 7 van 10 klein), casse + tête (3/6), hors + ligne (sudoku hors ligne 3/6), qui. Eruit: jeux (categorie), internet, déduction, suspect, indice.

**nl-NL** · naam: Detective Game → **Mystery Sudoku** · ondertitel: Sudoku-puzzels zonder reclame → **Detective game zonder reclame**

- Oud: `logische,denksport,spelletjes,offline,internet,wifi,mystery,mysterie,raadsel,dader,zaak,verdachte`
- Nieuw (100 tekens, 100 bytes): `denksport,puzzel,spelletjes,spel,logische,raadsel,offline,mysterie,misdaad,dader,zaak,hersentraining`
- Waarom: Naam: sudoku 3/1; en-GB heeft dezelfde naam, dus NL ziet overal "Mystery Sudoku". Ondertitel: detective game 3/1 (8 van 10 klein) en zonder reclame (9 van 10 klein). Veld: denksport vooraan (sudoku denksport 3/3), puzzel 3/3, spel ("detective spel": 9 van 10 klein), misdaad, hersentraining 4/1. Eruit: internet, wifi, mystery (nu naam), verdachte.

**ru** · naam: Детектив → **Судоку** · ondertitel: Судоку-головоломка без рекламы → **Детектив и логика без рекламы**

- Oud: `кто,детективные,игры,логические,головоломки,расследование,интернета,оффлайн,сыщик,улики,загадки,дело`
- Nieuw (97 tekens, 184 bytes): `сыщик,логические,головоломки,детективные,расследование,загадки,интернета,взрослых,кто,улики,тайна`
- Waarom: Naam: судоку 3/1; "Судоку-детектив" wordt 31 tekens. Ondertitel: детектив 3/10, логика, "судоку без рекламы" 3/8. Veld: сыщик vooraan (3/1), взрослых ("логические игры для взрослых" 3/3), тайна. Eruit: игры (categorie), оффлайн, дело.

**ko** · naam blijft: 추리 스도쿠 · ondertitel blijft: 광고 없는 범인 찾기 탐정 게임

- Oud: `명탐정,사건,용의자,범죄,형사,수사,수수께끼,미스터리,단서,알리바이,증거,진술,퍼즐,논리,두뇌,오프라인,매일,숫자,크라임,브레인,미궁,추리게임`
- Nieuw (87 tekens, 219 bytes): `추리게임,탐정게임,논리퍼즐,논리게임,논리,수수께끼,퍼즐,두뇌,범죄,사건,미스터리,오프라인,명탐정,용의자,단서,증거,수사,매일,알리바이,두뇌퍼즐,형사,추리퀴즈`
- Waarom: Naam en ondertitel blijven. Aaneengeschreven vormen die Koreanen typen: 추리게임 1/1, 탐정게임 2/1, 논리퍼즐 1/5, 논리게임 2/2, 두뇌퍼즐 2/3. Eruit: 크라임, 브레인, 미궁, 진술, 숫자 (geen hint).

**de-DE** · naam: Detektivspiel → **Rätsel-Sudoku** · ondertitel: Sudoku-Rätsel ohne Werbung → **Detektivspiel ohne Werbung**

- Oud: `detektiv,spiele,krimi,logik,logikrätsel,denkspiele,offline,internet,wlan,täter,fälle,lösen,wer,war`
- Nieuw (96 tekens, 100 bytes): `detektiv,krimi,logik,logikrätsel,denkspiele,knobelspiele,offline,täter,fälle,lösen,gehirnjogging`
- Waarom: Naam: rätsel 3/3, "rätsel spiele" 3/1; "Detektiv-Sudoku" wordt 31 tekens, "Krimi-Sudoku" mag niet vooraan. Ondertitel: Detektivspiel en "sudoku ohne werbung" 3/4. Veld: `detektiv` los voor "detektiv spiele" 3/1, gehirnjogging 3/1, knobelspiele 3/7. Eruit: spiele (categorie), internet, wlan, wer, war.

**es-ES** · naam: Detectives → **Sudoku** · ondertitel: Sudoku de misterio y lógica → **Detective, acertijos y lógica**

- Oud: `juegos,crimen,acertijos,culpable,pistas,caso,sospechoso,quién,sin,anuncios,offline,resolver,enigma`
- Nieuw (97 tekens, 98 bytes): `crimen,misterio,sin,anuncios,conexión,resolver,culpable,pista,enigma,caso,sospechoso,rompecabezas`
- Waarom: Als MX. Spanje is de thuismarkt van het genre: "sudoku crimen" 3/5, "sudoku sin anuncios" 3/3. `conexión` voor "sudoku sin conexión" (7/3).

**it** · naam blijft: Sudoku Mistero · ondertitel blijft: Risolvi casi, senza pubblicità

- Oud: `detective,giochi,offline,logica,giallo,colpevole,rompicapo,investigativi,enigmi,indizi,sospettato`
- Nieuw (99 tekens, 99 bytes): `detective,rompicapo,logica,enigmi,giallo,offline,colpevole,investigatore,indovinelli,indizi,crimine`
- Waarom: Naam en ondertitel blijven, ze dekken "risolvi casi" 4/2 en "sudoku senza pubblicità" 3/6. Veld: rompicapo naar voren (3/2), investigatore 4/4, indovinelli 3/10, crimine. Eruit: giochi (categorie), investigativi, sospettato.

**pt-PT** · naam: Detetive → **Sudoku Enigma** · ondertitel: Sudoku de mistério e lógica → **Jogo de detetive, sem anúncios**

- Oud: `jogo,jogos,crime,culpado,enigma,detective,puzzle,offline,pistas,caso,quem,foi,raciocínio,anúncios`
- Nieuw (94 tekens, 98 bytes): `crime,mistério,lógica,raciocínio,offline,charadas,culpado,caso,puzzle,quebra,cabeças,detective`
- Waarom: Zelfde naam en ondertitel als BR. "sudoku crime" 3/4 via het veld, enigmas 3/3, quebra-cabeças 3/1, detective 3/10.

**id** · naam blijft: Sudoku Misteri · ondertitel blijft: Game detektif, asah otak

- Oud: `tanpa,iklan,teka,teki,pelaku,siapa,kasus,tersangka,logika,offline,kriminal,cari,puzzle,petunjuk`
- Nieuw (96 tekens, 96 bytes): `teka,teki,logika,offline,tanpa,iklan,tebak,kasus,pelaku,kriminal,tersangka,puzzle,siapa,petunjuk`
- Waarom: Naam en ondertitel blijven. Volgorde naar hint (teka teki 3/2), tebak 3/5 in plaats van cari.

**vi** · naam blijft: Sudoku Thám Tử · ondertitel blijft: Game phá án, không quảng cáo

- Oud: `trinh,thủ,bí,ẩn,giải,suy,luận,vụ,phạm,nghi,tội,offline,logic,câu,đố,điều,tra,trò,chơi,trí,tuệ`
- Nieuw (89 tekens, 114 bytes): `trinh,logic,trí,tuệ,trò,chơi,câu,đố,giải,suy,luận,bí,ẩn,điều,tra,offline,vụ,phạm,nghi,tội`
- Waarom: Naam en ondertitel blijven. Volgorde naar hint (trinh thám 4/7, game trí tuệ 6/3). `thủ` eruit: zonder nut en het hoort bij een moordwoord.

**hi** · naam blijft: जासूसी सुडोकू · ondertitel blijft: दिमागी पहेली, बिना विज्ञापन

- Oud: `hindi,paheli,jasoos,jasoosi,detective,game,brain,जासूस,रहस्य,मिस्ट्री,सुराग,तर्क,केस,मुजरिम,गेम`
- Nieuw (99 tekens, 171 bytes): `detective,logic,riddle,brain,paheli,jasoos,jasoosi,hindi,जासूस,रहस्य,मिस्ट्री,सुराग,तर्क,केस,मुजरिम`
- Waarom: In eigen schrift wordt bijna niet gezocht (0 of 1 suggestie). `game`, `गेम` eruit (categorie), logic, riddle erin: Latijnse termen die India typt.

**mr-IN** · naam blijft: रहस्य सुडोकू · ondertitel blijft: गुप्तहेर कोडी, जाहिराती नाहीत

- Oud: `marathi,investigation,detective,game,गुन्हेगार,संशयित,सुगावा,गूढ,तर्क,डिटेक्टिव,प्रकरण,मेंदू,खेळ`
- Nieuw (95 tekens, 197 bytes): `logical,reasoning,detective,marathi,गुन्हेगार,संशयित,सुगावा,गूढ,तर्क,डिटेक्टिव,प्रकरण,मेंदू,खेळ`
- Waarom: Als hi. `game`, `investigation` eruit; logical, reasoning erin ("logical reasoning games" 3/9).

**te-IN** · naam blijft: మిస్టరీ సుడోకు · ondertitel blijft: డిటెక్టివ్ ఆట, ప్రకటనలు లేవు

- Oud: `telugu,thriller,iq,mind,detective,game,దోషి,నేరం,రహస్యం,లాజిక్,పజిల్,కేసు,క్లూ,తెలివి`
- Nieuw (87 tekens, 165 bytes): `mind,iq,riddle,detective,thriller,telugu,దోషి,నేరం,రహస్యం,లాజిక్,పజిల్,కేసు,క్లూ,తెలివి`
- Waarom: Als hi. `game` eruit, riddle erin ("riddle games" 4/1).

**bn-BD** · naam blijft: রহস্য সুডোকু · ondertitel blijft: গোয়েন্দা ধাঁধা, বিজ্ঞাপন নেই

- Oud: `bangla,bengali,goyenda,dhadha,detective,game,অপরাধী,তদন্ত,সূত্র,যুক্তি,কেস,ডিটেকটিভ,মগজ,খেলা`
- Nieuw (87 tekens, 167 bytes): `detective,goyenda,dhadha,bangla,bengali,অপরাধী,তদন্ত,সূত্র,যুক্তি,কেস,ডিটেকটিভ,মগজ,খেলা`
- Waarom: `game` eruit (categorie). Winkel BD geeft geen data; geschreven op basis van India.

**ur-PK** · naam blijft: جاسوسی سوڈوکو · ondertitel blijft: منطقی پہیلیاں، بغیر اشتہارات

- Oud: `sudoku,mystery,detective,game,offline,logic,puzzle,brain,crime,whodunit,riddle,investigation,suspect`
- Nieuw (96 tekens, 96 bytes): `sudoku,mystery,detective,offline,logic,puzzle,brain,crime,whodunnit,riddle,investigation,suspect`
- Waarom: `game` eruit (categorie), whodunit wordt whodunnit.

**zh-Hans** · naam blijft: 侦探推理数独 · ondertitel blijft: 破案解谜游戏·找出真相·单机无广告

- Zoekwoorden ongewijzigd: `探案,刑侦,犯罪,悬疑,烧脑,线索,谜题,神探,益智,离线,逻辑,九宫格,脑力,嫌疑人,证词,密室,智力,休闲,悬案,每日,不在场证明,侦探游戏,推理游戏,谜案`
- Waarom: Ongewijzigd. Niet te koop in China; telt in de VS en Singapore, en daar is de vraag in dit schrift klein.

**Besluiten die Jaimy nog moet nemen:**

1. **Japan, 数独.** Nikoli noemt 数独/SUDOKU zijn geregistreerde merk en [waarschuwde in 2023](https://automaton-media.com/articles/newsjp/20230829-262055/) dat apps die de naam
   zonder toestemming gebruiken niets met het bedrijf te maken hebben. Het heeft een [eigen app](https://apps.apple.com/jp/app/id6444442602). ナンプレ is [de soortnaam](https://www.weblio.jp/content/%E6%95%B0%E7%8B%AC). Veel
   apps gebruiken 数独 toch. Het Japanse register zelf heb ik niet gezien. Het voorstel haalt het uit de naam
   (ナンプレ×謎解き) en laat het in het verborgen veld. Strikt volgens de merkenregel moet het daar ook weg; dan vervalt een sterke
   zoekterm, al geeft Apple op 数独 en ナンプレ voor 6 van de 10 topapps dezelfde. Eén woord schrappen uit `ja.json` is genoeg.
2. **Sudoku Crimen.** In ES suggestie 5 na "sud", top 10 met 9 van 10 kleine apps. Het zwaarste woord voor Spanje en Mexico,
   maar "crimen" mag niet vooraan. Het staat nu vooraan in het verborgen veld. Als Jaimy misdaadwoorden vooraan toch toestaat,
   is "Crimson Ledger: Sudoku Crimen" de eerste wijziging. Geen moordwoord; wel afwijking van de regel van 3-11.
3. **`store/PERS.md`** noemt de namen van 1.6 in het feitenblad. Aanpassen zodra de namen vaststaan.

## 7. Wat niet vaststaat

- **Zoekvolume.** Niet openbaar. Apple's zoekpopulariteit zit in Apple Ads en die gebruiken we niet. De suggestievolgorde is een
  mengsel van populariteit en appnamen; "3/1" is sterk binnen die drie letters, maar zegt niet hoeveel mensen dat zijn, en is
  tussen markten niet vergelijkbaar. "murdoku" op plek 1 op "mur" kan ook komen doordat weinig andere woorden zo beginnen.
- **Rang.** De iTunes-API is niet de winkel. De twee lopen meestal gelijk op, met een paar plekken verschil (VS "murdoku": 3 en 4
  omgedraaid). Rang hangt ook af van downloads en beoordelingen, die we hier niet zien. De top 12 is zonder persoonlijke
  voorkeuren opgehaald, en kan voor een echte telefoon verschillen.
- **Nulmeting is 1.4.1.** Alle rangen zijn gemeten met de live teksten van 1.4.1, niet die van 1.6.
- **Merken.** EU en Spanje niet vastgesteld; VK via een secundaire bron; de reden van de Amerikaanse opschorting niet gelezen.
  Dit is geen juridisch advies.
- **Gewicht van categoriewoorden en van het veld voorbij 100 bytes.** Onbekend.
- **Bangladesh.** De winkel geeft geen resultaten en geen suggesties, dus bn-BD is geschreven op basis van India.
- **China.** De app is daar niet te koop; zh-Hans telt in de VS en Singapore. Dat veld is niet gewijzigd.
- **Moedertaalcontrole.** Geen moedertaalspreker heeft de nieuwe ondertitels gezien (es, pt, de, nl, ru). Het zijn korte,
  gangbare zinnen, maar een blik van een moedertaalspreker kost weinig.

## 8. Na de release meten

Herhaal 7 en 14 dagen na goedkeuring: dezelfde termen als in de nulmeting hieronder (iTunes Search `limit=200` en de
zoekpagina). Daarnaast drie tests:

1. **Bytes:** vindt "crimson ledger <laatste woord>" ons in JP (推理パズル), KR (추리퀴즈), RU (тайна), SA (قضايا)? Zo niet, dan
   telt Apple tot 100 bytes en moeten die velden korter.
2. **Categorie:** rang op "juegos de detectives" (MX, zonder `juegos` in het veld) tegen "detective games" (VS, met `games`).
3. **Murdoku zonder het woord:** rang op "murdoku" in alle winkels.

## 9. Nulmeting per winkel (4-11-2026, live versie 1.4.1)

`*` = meetterm met een moordwoord of merknaam; kan niet in de metadata. n.g. = niet gemeten. Gesorteerd op hint, sterkste eerst.

#### US · Verenigde Staten

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| sudoku | 2/2 | – | – | 1 | 8 |
| detective games | 3/1 | – | – | 2 | 5 |
| cozy games | 3/4 | – | – | 0 | 6 |
| logic puzzles | 3/4 | – | – | 1 | 8 |
| *murdle | 3/4 | – | – | 4 | 5 |
| brain games | 3/5 | – | – | 0 | 10 |
| *killer sudoku | 3/5 | – | – | 3 | 3 |
| mystery games | 3/5 | – | – | 1 | 7 |
| puzzle games for adults | 3/5 | – | – | 1 | 9 |
| sudoku offline | 3/5 | – | – | 3 | 6 |
| detective | 3/7 | – | – | 2 | 3 |
| sudoku no ads | 3/7 | – | – | 4 | 5 |
| puzzle solving games | 3/8 | – | – | 0 | 10 |
| deduction puzzle | 4/1 | – | – | 5 | 3 |
| *murdoku | 4/1 | – | – | 6 | 2 |
| whodunnit | 4/1 | – | – | 5 | 4 |
| culprit | 4/2 | 30 | – | 5 | 4 |
| clue game | 4/3 | – | – | 0 | 7 |
| *murder mystery | 4/5 | – | – | 2 | 7 |
| logic games | 4/8 | – | – | 1 | 8 |
| who did it | 5/3 | – | – | 5 | 5 |
| logic grid puzzles | 5/4 | – | – | 1 | 5 |
| crime games | 5/7 | – | – | 3 | 6 |
| find the culprit | 5/8 | 29 | – | 7 | 1 |
| logic grid | 5/9 | – | – | 2 | 5 |
| crime puzzle | 7/1 | – | – | 5 | 4 |
| case solving | 7/2 | – | – | 2 | 3 |
| grid puzzle | 7/2 | – | – | 2 | 6 |
| daily puzzles | 7/3 | – | – | 5 | 4 |
| brain teaser | 7/5 | – | – | 0 | 10 |
| logic sudoku | 7/6 | – | – | 1 | 7 |
| crime solving | 7/10 | – | – | 4 | 4 |
| *murder sudoku | 8/1 | – | – | 9 | 0 |
| sudoku puzzle | 8/1 | – | – | 0 | 10 |
| sudoku variants | 8/1 | – | – | 2 | 4 |
| deduction | 8/2 | – | – | 6 | 3 |
| mystery puzzle | 9/2 | – | – | 3 | 6 |
| sudoku crime | 9/2 | 43 | – | 7 | 2 |
| mystery detective games | 9/4 | – | – | 4 | 5 |
| detective puzzle | 11/1 | – | – | 1 | 4 |
| detective sudoku | 12/1 | – | – | 6 | 4 |
| solve crimes | 12/1 | – | – | 3 | 5 |
| cozy detective |  | – | – | 4 | 2 |
| cozy mystery |  | – | – | 4 | 3 |
| crime sudoku |  | 5 | – | 5 | 3 |
| daily puzzle |  | – | – | 5 | 4 |
| detective game |  | – | – | 2 | 6 |
| detective mystery |  | – | – | 5 | 3 |
| logic grid puzzle |  | – | – | 1 | 6 |
| logic puzzle |  | – | – | 2 | 7 |
| mystery cases |  | – | – | 5 | 3 |
| mystery game |  | – | – | 1 | 9 |
| mystery sudoku |  | 82 | – | 2 | 8 |
| puzzle mystery |  | – | – | 1 | 6 |
| sleuth |  | – | – | 8 | 2 |
| sudoku detective |  | 128 | – | 7 | 2 |
| sudoku mystery |  | 62 | – | 3 | 7 |
| suspect |  | – | – | 4 | 5 |
| whodunit |  | – | – | 9 | 1 |

#### SA · Saoedi-Arabië

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| لغز | 2/2 | – | – | 1 | 6 |
| غموض | 2/5 | 120 | – | 10 | 0 |
| sudoku | 2/6 | – | – | 3 | 2 |
| العاب غموض | 2/6 | – | – | 7 | 1 |
| سودوكو | 2/6 | 107 | – | 2 | 3 |
| لعبة غموض | 2/9 | 30 | – | 10 | 0 |
| لعبه محقق جنائي | 3/1 | 4 | 4 | 10 | 0 |
| الغاز | 3/2 | – | – | 2 | 5 |
| تحقيق جنائي | 3/2 | 12 | 11 | 10 | 0 |
| محقق | 3/2 | 94 | – | 9 | 0 |
| العاب محقق | 3/3 | – | – | 3 | 3 |
| سودوكو بدون نت | 3/3 | 6 | 6 | 7 | 1 |
| detective games | 3/4 | – | – | 7 | 0 |
| *murdoku | 3/4 | – | – | 10 | 0 |
| الغاز الذكاء | 3/4 | – | – | 0 | 5 |
| لعبة محقق | 3/4 | 21 | 7 | 10 | 0 |
| العاب تحقيق | 3/5 | – | – | 8 | 0 |
| الغاز بدون نت | 3/5 | 45 | – | 2 | 4 |
| تحقيق | 3/6 | – | – | 8 | 0 |
| لغز الجريمة | 3/8 | 30 | – | 9 | 0 |
| العاب ذكاء | 3/9 | – | – | 1 | 6 |
| جريمة | 4/1 | – | – | 9 | 0 |
| لعبة تحقيق | 4/5 | 52 | – | 10 | 0 |
| حل الغاز | 4/6 | – | – | 2 | 5 |
| logic puzzles | 5/3 | – | – | 4 | 2 |
| mystery games | 5/5 | – | – | 6 | 0 |
| brain teaser | 7/4 | – | – | 1 | 5 |
| العاب الغاز | 7/7 | – | – | 0 | 6 |
| العاب تفكير | 8/3 | – | – | 0 | 8 |
| *لعبة القاتل | 9/3 | 181 | – | 5 | 4 |
| detective sudoku | 11/9 | 10 | 11 | 10 | 0 |
| crime puzzle |  | 126 | – | 8 | 0 |
| crime sudoku |  | 4 | 4 | 10 | 0 |
| deduction |  | 135 | – | 10 | 0 |
| detective game |  | – | – | 7 | 0 |
| detective puzzle |  | – | – | 8 | 0 |
| grid puzzle |  | – | – | 8 | 1 |
| *killer sudoku |  | 97 | – | 6 | 1 |
| logic games |  | – | – | 3 | 2 |
| logic grid |  | – | – | 8 | 1 |
| logic puzzle |  | – | – | 4 | 1 |
| *murder sudoku |  | 19 | – | 10 | 0 |
| *murdle |  | – | – | 8 | 0 |
| mystery game |  | – | – | 5 | 0 |
| mystery puzzle |  | – | – | 6 | 0 |
| mystery sudoku |  | 5 | 8 | 8 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 32 | – | 10 | 0 |
| الجاني |  | – | – | 10 | 0 |
| العاب بوليسية |  | – | – | 7 | 2 |
| العاب منطق |  | – | – | 4 | 3 |
| حل الجريمة |  | 11 | 8 | 9 | 0 |
| سودوكو الجريمة |  | 6 | 4 | 10 | 0 |
| *سودوكو القاتل |  | 14 | 8 | 9 | 0 |
| سودوكو المحقق |  | 2 | 2 | 10 | 0 |
| سودوكو بدون اعلانات |  | 13 | 8 | 10 | 0 |
| سودوكو بدون انترنت |  | – | – | 9 | 1 |
| سودوكو جريمة |  | 6 | 3 | 10 | 0 |
| سودوكو محقق |  | 1 | 2 | 10 | 0 |
| لعبة بوليسية |  | – | – | 7 | 2 |
| *من القاتل |  | 159 | – | 3 | 5 |
| *من هو القاتل |  | – | – | 0 | 9 |
| مين الجاني |  | – | – | 10 | 0 |

#### JP · Japan

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| ナンプレ | 1/1 | – | – | 0 | 8 |
| パズル | 1/1 | – | – | 0 | 10 |
| 脳トレ | 1/1 | – | – | 0 | 9 |
| 論理パズル | 1/1 | – | – | 4 | 3 |
| 謎解き | 1/1 | – | – | 3 | 6 |
| 探偵 | 1/2 | – | – | 6 | 0 |
| 数独 | 1/2 | – | – | 2 | 6 |
| 謎解きゲーム | 1/2 | – | – | 3 | 6 |
| 犯人 | 1/3 | 66 | – | 2 | 4 |
| 事件 | 1/4 | – | – | 2 | 3 |
| 数独 無料 | 1/4 | – | – | 1 | 6 |
| 犯人探し | 1/4 | 41 | – | 5 | 2 |
| 論理 | 1/4 | – | – | 5 | 2 |
| 事件解決ゲーム | 1/5 | – | – | 4 | 4 |
| *殺人 | 1/5 | – | – | 4 | 4 |
| 謎解きパズル | 1/5 | – | – | 3 | 5 |
| 推理 | 1/6 | – | – | 6 | 2 |
| 犯人探しゲーム | 1/6 | 50 | – | 5 | 4 |
| 推理ゲーム | 1/7 | – | – | 6 | 4 |
| 論理ゲーム | 1/7 | – | – | 3 | 3 |
| 事件簿 | 1/10 | – | – | 6 | 0 |
| 数独 広告なし | 1/10 | 133 | – | 3 | 3 |
| ロジック | 2/1 | – | – | 0 | 5 |
| ロジックパズル | 2/2 | – | – | 3 | 4 |
| 探偵ゲーム | 2/3 | – | – | 3 | 4 |
| *マーダーミステリー | 2/4 | – | – | 5 | 3 |
| 推理パズル | 2/4 | – | – | 6 | 1 |
| ミステリー | 2/7 | – | – | 2 | 2 |
| ナンプレ 広告なし | 2/9 | 133 | – | 4 | 2 |
| *キラー数独 | 2/10 | – | – | 4 | 3 |
| sudoku | 3/1 | – | – | 1 | 7 |
| *killer sudoku | 3/4 | – | – | 4 | 3 |
| *murdoku | 3/5 | – | – | 9 | 1 |
| ミステリーゲーム | 3/5 | – | – | 3 | 3 |
| logic puzzle | 5/7 | – | – | 4 | 4 |
| brain teaser |  | – | – | 2 | 3 |
| crime puzzle |  | – | – | 5 | 2 |
| crime sudoku |  | 6 | 4 | 10 | 0 |
| deduction |  | – | – | 7 | 1 |
| detective game |  | – | – | 7 | 1 |
| detective games |  | – | – | 7 | 1 |
| detective puzzle |  | – | – | 5 | 0 |
| detective sudoku |  | 31 | – | 9 | 0 |
| grid puzzle |  | – | – | 1 | 2 |
| logic games |  | – | – | 1 | 3 |
| logic grid |  | – | – | 6 | 0 |
| logic puzzles |  | – | – | 2 | 3 |
| *murder sudoku |  | 42 | – | 10 | 0 |
| *murdle |  | – | – | 6 | 0 |
| mystery game |  | – | – | 5 | 1 |
| mystery puzzle |  | – | – | 1 | 3 |
| mystery sudoku |  | 60 | – | 9 | 1 |
| sudoku variants |  | – | – | 9 | 0 |
| whodunit |  | 142 | – | 10 | 0 |
| ナンプレ 推理 |  | 41 | – | 9 | 1 |
| ナンプレ 推理ゲーム |  | 32 | – | 8 | 2 |
| 事件 推理 |  | 137 | – | 2 | 1 |
| 数独 ミステリー |  | 28 | – | 8 | 1 |
| 数独 探偵 |  | 23 | 12 | 10 | 0 |
| 数独 推理 |  | 36 | – | 7 | 2 |
| 数独 犯人 |  | 3 | 1 | 10 | 0 |
| *殺人数独 |  | 16 | 6 | 10 | 0 |
| 犯人当て |  | 107 | – | 3 | 4 |

#### BR · Brazilië

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| enigma | 3/1 | – | – | 6 | 1 |
| *murdoku | 3/1 | – | – | 8 | 2 |
| sudoku | 3/1 | – | – | 2 | 8 |
| raciocinio logico | 3/2 | – | – | 1 | 7 |
| quebra cabeça | 3/3 | – | – | 1 | 9 |
| sudoku offline | 3/3 | – | – | 5 | 5 |
| detetive | 3/7 | – | – | 6 | 0 |
| *killer sudoku | 4/1 | – | – | 7 | 3 |
| jogo enigma | 4/3 | – | – | 4 | 4 |
| sudoku sem anuncio | 4/6 | – | – | 10 | 0 |
| raciocinio | 4/8 | – | – | 0 | 8 |
| charadas | 4/9 | – | – | 4 | 1 |
| logic puzzles | 4/9 | – | – | 4 | 3 |
| *murdle | 5/1 | – | – | 6 | 0 |
| passatempo | 6/1 | – | – | 1 | 6 |
| crime detective | 6/2 | 175 | 9 | 5 | 1 |
| *assassino | 6/4 | – | – | 6 | 3 |
| detetive criminal | 6/4 | – | – | 6 | 0 |
| logic games | 6/6 | – | – | 4 | 2 |
| charadas e enigmas | 6/7 | – | – | 7 | 1 |
| jogos raciocinio | 6/7 | – | – | 0 | 8 |
| enigmas | 7/5 | – | – | 5 | 1 |
| sudoku detetive | 8/2 | 13 | 8 | 9 | 0 |
| sudoku sem anúncios | 8/6 | – | – | 9 | 0 |
| jogo de crime | 13/1 | – | – | 6 | 1 |
| jogos de crime | 14/1 | – | – | 5 | 1 |
| resolver crimes | 15/1 | – | – | 6 | 0 |
| jogos de logica | 15/2 | – | – | 3 | 4 |
| jogo de detetive | 16/1 | – | – | 7 | 0 |
| jogo de misterio | 16/1 | – | – | 3 | 0 |
| jogos de detetive | 17/1 | – | – | 7 | 0 |
| *assassinato |  | 51 | – | 6 | 0 |
| brain teaser |  | – | – | 0 | 5 |
| crime puzzle |  | 93 | – | 6 | 1 |
| crime sudoku |  | 4 | 5 | 10 | 0 |
| culpado |  | 1 | 1 | 9 | 0 |
| deduction |  | – | – | 8 | 1 |
| detective game |  | – | – | 5 | 1 |
| detective games |  | – | – | 4 | 0 |
| detective puzzle |  | – | – | 5 | 1 |
| detective sudoku |  | 19 | – | 10 | 0 |
| grid puzzle |  | – | – | 3 | 2 |
| *jogo de assassinato |  | 68 | – | 7 | 0 |
| jogo de investigação |  | – | – | 5 | 1 |
| jogos de investigação |  | – | – | 7 | 0 |
| jogos de lógica |  | – | – | 4 | 4 |
| jogos de mistério |  | – | – | 5 | 0 |
| logic grid |  | – | – | 6 | 1 |
| logic puzzle |  | – | – | 5 | 1 |
| *murder sudoku |  | 23 | – | 10 | 0 |
| mystery game |  | – | – | 4 | 1 |
| mystery games |  | – | – | 3 | 1 |
| mystery puzzle |  | – | – | 4 | 1 |
| mystery sudoku |  | 11 | 12 | 9 | 1 |
| quem foi |  | – | – | 3 | 0 |
| *quem matou |  | 2 | 2 | 3 | 0 |
| raciocínio logico |  | – | – | 2 | 7 |
| *sudoku assassinato |  | 3 | 3 | 10 | 0 |
| sudoku crime |  | 10 | 9 | 9 | 0 |
| sudoku enigma |  | 31 | – | 9 | 0 |
| sudoku logica |  | – | – | 2 | 4 |
| sudoku misterio |  | 12 | – | 9 | 1 |
| sudoku mistério |  | 12 | 12 | 9 | 1 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 51 | – | 10 | 0 |

#### MX · Mexico

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| *asesino | 3/1 | – | – | 7 | 2 |
| *murdoku | 3/1 | – | – | 8 | 2 |
| rompecabezas | 3/1 | – | – | 1 | 8 |
| sudoku | 3/1 | – | – | 2 | 6 |
| acertijos | 3/3 | 53 | – | 5 | 3 |
| detective | 3/4 | 30 | – | 6 | 0 |
| misterio | 3/5 | – | – | 7 | 0 |
| pistas | 3/8 | – | – | 3 | 3 |
| enigma | 3/9 | – | – | 7 | 2 |
| *killer sudoku | 4/1 | – | – | 7 | 3 |
| *murdle | 4/2 | – | – | 8 | 0 |
| *murder sudoku | 4/3 | 39 | – | 9 | 0 |
| acertijo mental | 4/4 | – | – | 3 | 6 |
| mystery games | 4/7 | – | – | 6 | 0 |
| crimen | 4/8 | – | – | 9 | 0 |
| logic puzzles | 4/8 | – | – | 3 | 4 |
| sudoku crimen | 4/8 | 22 | – | 10 | 0 |
| *quien es el asesino | 4/9 | 1 | 1 | 5 | 0 |
| juegos de acertijos | 6/2 | – | – | 5 | 3 |
| crime sudoku | 6/6 | 7 | 5 | 10 | 0 |
| resolver crimenes | 6/8 | – | – | 8 | 0 |
| juegos acertijos | 6/10 | – | – | 5 | 3 |
| juegos de misterio | 8/1 | – | – | 8 | 0 |
| sudoku sin internet | 8/1 | – | – | 4 | 4 |
| sudoku sin anuncios | 8/9 | – | – | 7 | 3 |
| juego detective | 9/3 | – | – | 6 | 0 |
| detective files | 9/5 | – | – | 7 | 0 |
| juegos de detectives | 10/1 | – | – | 7 | 0 |
| detectives | 10/2 | – | – | 8 | 1 |
| detective sudoku | 16/1 | 11 | 12 | 10 | 0 |
| juegos de logica | 16/1 | – | – | 5 | 3 |
| acertijos de logica |  | – | – | 4 | 3 |
| *asesinato |  | 94 | – | 8 | 0 |
| brain teaser |  | – | – | 1 | 4 |
| crime puzzle |  | 139 | – | 7 | 0 |
| culpable |  | 18 | 12 | 8 | 1 |
| deduction |  | – | – | 8 | 1 |
| detective game |  | – | – | 6 | 0 |
| detective games |  | – | – | 7 | 0 |
| detective puzzle |  | – | – | 7 | 0 |
| enigmas |  | – | – | 7 | 1 |
| grid puzzle |  | – | – | 5 | 2 |
| juego de detectives |  | 134 | – | 8 | 0 |
| juegos de crimen |  | – | – | 2 | 4 |
| juegos de lógica |  | – | – | 5 | 4 |
| logic games |  | – | – | 2 | 4 |
| logic grid |  | – | – | 8 | 0 |
| logic puzzle |  | – | – | 5 | 1 |
| mystery game |  | – | – | 4 | 0 |
| mystery puzzle |  | – | – | 5 | 0 |
| mystery sudoku |  | 14 | – | 9 | 0 |
| quien fue |  | – | – | 2 | 1 |
| *quien mato |  | – | – | 0 | 9 |
| *sudoku asesinato |  | 8 | 7 | 10 | 0 |
| sudoku crímenes |  | – | – | 7 | 0 |
| sudoku detective |  | 15 | 10 | 10 | 0 |
| sudoku enigma |  | 11 | – | 9 | 0 |
| sudoku español |  | – | – | 1 | 2 |
| sudoku logico |  | 169 | – | 2 | 2 |
| sudoku misterio |  | 19 | – | 10 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 46 | – | 10 | 0 |

#### TR · Turkije

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| dedektif oyunları | 3/1 | 111 | – | 6 | 0 |
| suç oyunları | 3/1 | – | – | 8 | 0 |
| sudoku | 3/1 | – | – | 4 | 4 |
| zeka oyunları | 3/1 | – | – | 1 | 7 |
| bulmaca oyunları | 3/2 | – | – | 1 | 7 |
| detective | 3/2 | – | – | 7 | 0 |
| *murdoku | 3/2 | – | – | 9 | 0 |
| suçlu bulma oyunu | 3/2 | – | – | 3 | 0 |
| sudoku türkçe | 3/2 | – | – | 5 | 3 |
| bulmaca | 3/3 | – | – | 1 | 6 |
| zeka oyunu | 3/3 | – | – | 2 | 8 |
| dedektif oyunu | 3/4 | 152 | – | 8 | 0 |
| suçlu kim | 3/4 | – | – | 4 | 5 |
| sudoku internetsiz | 3/4 | – | – | 5 | 3 |
| sudoku reklamsız | 3/5 | 158 | – | 6 | 2 |
| akıl oyunları | 3/6 | – | – | 2 | 7 |
| dedektif | 3/7 | – | – | 8 | 0 |
| detective games | 3/7 | – | – | 7 | 0 |
| gizem oyunları | 3/7 | – | – | 6 | 0 |
| mantık oyunları | 4/1 | – | – | 1 | 7 |
| *murdle | 4/1 | – | – | 10 | 0 |
| vaka oyunu | 4/1 | 21 | – | 9 | 0 |
| *killer sudoku | 4/2 | – | – | 7 | 2 |
| *cinayet | 4/3 | – | – | 9 | 0 |
| *katil kim | 4/3 | – | – | 6 | 1 |
| gizemli oyunlar | 4/4 | – | – | 4 | 2 |
| vaka | 4/4 | – | – | 10 | 0 |
| *cinayet oyunu | 4/5 | 52 | – | 8 | 1 |
| gizem çözme | 4/5 | – | – | 7 | 0 |
| bulmaca oyunu | 4/6 | – | – | 1 | 8 |
| gizem oyunu | 4/6 | 137 | – | 8 | 0 |
| *katili bul | 4/7 | – | – | 8 | 1 |
| logic puzzles | 4/7 | – | – | 7 | 3 |
| bulmacalar | 4/10 | – | – | 3 | 6 |
| gizem | 4/10 | – | – | 8 | 0 |
| polisiye | 6/2 | – | – | 7 | 1 |
| mystery games | 6/3 | – | – | 4 | 1 |
| mantık | 6/4 | – | – | 1 | 3 |
| detective sudoku | 16/1 | 15 | – | 10 | 0 |
| brain teaser |  | – | – | 2 | 4 |
| *cinayet sudoku |  | 5 | 4 | 9 | 0 |
| crime puzzle |  | 165 | – | 6 | 0 |
| crime sudoku |  | 7 | 6 | 10 | 0 |
| dedektif sudoku |  | 4 | 6 | 10 | 0 |
| deduction |  | – | – | 6 | 0 |
| detective game |  | – | – | 8 | 0 |
| detective puzzle |  | – | – | 9 | 0 |
| gizem sudoku |  | 3 | 5 | 10 | 0 |
| grid puzzle |  | – | – | 7 | 2 |
| *katil sudoku |  | 8 | 10 | 9 | 0 |
| logic games |  | – | – | 5 | 2 |
| logic grid |  | – | – | 7 | 1 |
| logic puzzle |  | – | – | 8 | 1 |
| mantık bulmacaları |  | – | – | 3 | 2 |
| mantık sudoku |  | 171 | – | 5 | 1 |
| *murder sudoku |  | 27 | – | 10 | 0 |
| mystery game |  | – | – | 4 | 0 |
| mystery puzzle |  | – | – | 5 | 0 |
| mystery sudoku |  | 13 | – | 8 | 0 |
| olay çözme |  | – | – | 4 | 0 |
| polisiye oyun |  | 49 | – | 9 | 0 |
| suç çözme |  | – | – | 9 | 0 |
| suç sudoku |  | – | – | 6 | 0 |
| suçlu bulma |  | – | – | 4 | 0 |
| sudoku dedektif |  | 2 | 3 | 10 | 0 |
| sudoku gizem |  | 3 | 5 | 10 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 64 | – | 10 | 0 |

#### FR · Frankrijk

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| enquête criminelle | 3/1 | – | – | 7 | 1 |
| *murdoku | 3/1 | – | – | 9 | 1 |
| sudoku | 3/1 | – | – | 1 | 6 |
| enquete | 3/2 | – | – | 5 | 0 |
| énigmes logiques | 3/3 | – | – | 3 | 4 |
| enquête policière | 3/4 | 37 | – | 4 | 2 |
| logique | 3/4 | – | – | 2 | 6 |
| sudoku hors ligne | 3/6 | – | – | 3 | 5 |
| enquete logique | 3/7 | – | – | 5 | 1 |
| *meurtre | 3/7 | 84 | – | 4 | 1 |
| *enquete meurtre | 3/9 | 91 | – | 7 | 0 |
| *killer sudoku | 4/1 | 114 | – | 5 | 3 |
| *jeu de meurtre | 4/3 | 62 | – | 5 | 0 |
| jeu logique | 5/1 | – | – | 1 | 7 |
| jeu reflexion | 5/3 | – | – | 0 | 7 |
| jeu d'enquête | 6/1 | 26 | – | 4 | 1 |
| qui est le coupable | 6/2 | – | – | 2 | 0 |
| logic puzzle | 6/4 | – | – | 3 | 3 |
| sudoku sans pub | 6/6 | – | – | 5 | 3 |
| jeux de détective | 9/1 | – | – | 4 | 1 |
| jeu policier | 12/1 | 48 | – | 7 | 0 |
| *murder sudoku | 13/1 | 18 | – | 10 | 0 |
| jeux d'enquête | 14/1 | – | – | 5 | 1 |
| detective game | 14/2 | – | – | 4 | 2 |
| jeu de logique | 14/2 | – | – | 1 | 6 |
| detective games | 15/1 | – | – | 3 | 2 |
| jeux de logique | 15/3 | – | – | 0 | 8 |
| detective sudoku | 16/1 | 15 | – | 9 | 0 |
| brain teaser |  | – | – | 0 | 7 |
| casse tête |  | – | – | 0 | 8 |
| casse-tête |  | – | – | 0 | 8 |
| coupable |  | 19 | – | 7 | 1 |
| crime puzzle |  | 94 | – | 5 | 1 |
| crime sudoku |  | 5 | 5 | 10 | 0 |
| deduction |  | – | – | 8 | 2 |
| détective |  | – | – | 7 | 1 |
| detective puzzle |  | – | – | 5 | 2 |
| énigme |  | – | – | 1 | 6 |
| énigmes |  | – | – | 2 | 3 |
| enquête |  | 102 | – | 4 | 1 |
| grid puzzle |  | – | – | 4 | 4 |
| jeu de détective |  | – | – | 4 | 2 |
| jeu de mystère |  | – | – | 2 | 4 |
| jeu de réflexion |  | – | – | 1 | 6 |
| jeu enquête |  | 61 | – | 3 | 2 |
| jeux de réflexion |  | – | – | 0 | 9 |
| logic games |  | – | – | 5 | 3 |
| logic grid |  | – | – | 6 | 2 |
| logic puzzles |  | – | – | 3 | 4 |
| *meurtrier |  | – | – | 8 | 1 |
| *murdle |  | – | – | 3 | 2 |
| mystère |  | – | – | 2 | 3 |
| mystery game |  | – | – | 2 | 3 |
| mystery games |  | – | – | 1 | 3 |
| mystery puzzle |  | – | – | 1 | 4 |
| mystery sudoku |  | 9 | 9 | 8 | 0 |
| sudoku crime |  | 9 | 9 | 10 | 0 |
| sudoku détective |  | 18 | – | 10 | 0 |
| sudoku enquête |  | 7 | 7 | 10 | 0 |
| sudoku français |  | – | – | 2 | 2 |
| sudoku logique |  | – | – | 1 | 3 |
| *sudoku meurtre |  | 8 | 8 | 10 | 0 |
| sudoku mystère |  | 17 | – | 9 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| trouver le coupable |  | – | – | 5 | 0 |
| whodunit |  | 50 | – | 10 | 0 |

#### NL · Nederland

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| detective game | 3/1 | – | – | 8 | 1 |
| *murdoku | 3/1 | – | – | 8 | 0 |
| puzzel games | 3/1 | – | – | 0 | 8 |
| sudoku | 3/1 | 164 | – | 2 | 5 |
| *murder sudoku | 3/2 | 48 | – | 9 | 0 |
| raadsels | 3/2 | – | – | 2 | 5 |
| puzzel | 3/3 | – | – | 0 | 6 |
| sudoku denksport | 3/3 | – | – | 2 | 4 |
| detective | 3/4 | – | – | 7 | 1 |
| *killer sudoku | 3/4 | – | – | 7 | 3 |
| sudoku offline | 3/4 | 170 | – | 5 | 4 |
| denk spelletjes | 3/5 | – | – | 2 | 5 |
| denksport | 3/6 | – | – | 8 | 0 |
| logic puzzle | 3/7 | – | – | 6 | 2 |
| puzzel spelletjes | 3/8 | – | – | 1 | 7 |
| hersentraining | 4/1 | – | – | 5 | 3 |
| speurders | 4/1 | – | – | 3 | 6 |
| mystery games | 4/2 | – | – | 6 | 2 |
| denkspellen | 4/3 | – | – | 3 | 5 |
| *murdle | 4/3 | – | – | 7 | 0 |
| mystery | 4/3 | – | – | 5 | 2 |
| speurtocht | 4/3 | – | – | 8 | 2 |
| *moord | 4/4 | 11 | 11 | 8 | 0 |
| logische puzzels | 4/8 | – | – | 3 | 3 |
| denkspel | 4/10 | – | – | 2 | 6 |
| logic games | 6/4 | – | – | 3 | 2 |
| puzzels | 7/1 | – | – | 0 | 7 |
| sudoku zonder reclame | 8/1 | 13 | – | 9 | 1 |
| detective sudoku | 11/4 | 18 | – | 9 | 0 |
| logic puzzles | 13/1 | – | – | 6 | 2 |
| brain teaser |  | – | – | 2 | 4 |
| breinbreker |  | – | – | 9 | 0 |
| breinbrekers |  | – | – | 2 | 4 |
| crime puzzle |  | – | – | 7 | 1 |
| crime sudoku |  | 8 | 8 | 9 | 0 |
| dader |  | 1 | 1 | 10 | 0 |
| deduction |  | 149 | – | 9 | 0 |
| detective games |  | – | – | 8 | 1 |
| detective puzzel |  | – | – | 5 | 1 |
| detective puzzle |  | – | – | 7 | 1 |
| detective spel |  | – | – | 9 | 0 |
| detective spellen |  | – | – | 10 | 0 |
| detective spelletjes |  | – | – | 9 | 1 |
| detectivespel |  | – | – | 6 | 0 |
| grid puzzle |  | – | – | 5 | 2 |
| hersenkrakers |  | – | – | 8 | 0 |
| logic grid |  | – | – | 8 | 0 |
| logica puzzel |  | – | – | 3 | 3 |
| logische puzzel |  | – | – | 3 | 1 |
| logische spelletjes |  | – | – | 2 | 3 |
| misdaad |  | 141 | – | 8 | 0 |
| misdaad puzzel |  | 43 | – | 8 | 0 |
| misdaad spel |  | 63 | – | 9 | 0 |
| *moord sudoku |  | 14 | – | 9 | 0 |
| *moordmysterie |  | 6 | 10 | 7 | 0 |
| *moordspel |  | – | – | 4 | 0 |
| mysterie |  | – | – | 5 | 2 |
| mysterie spel |  | 122 | – | 7 | 1 |
| mystery game |  | – | – | 6 | 2 |
| mystery puzzle |  | – | – | 6 | 1 |
| mystery sudoku |  | 14 | – | 9 | 0 |
| puzzelspel |  | – | – | 0 | 4 |
| puzzelspellen |  | – | – | 6 | 0 |
| raadsel |  | – | – | 2 | 3 |
| speurder |  | – | – | 10 | 0 |
| sudoku nederlands |  | – | – | 3 | 3 |
| sudoku variants |  | – | – | 10 | 0 |
| vind de dader |  | 1 | 1 | 3 | 0 |
| whodunit |  | 40 | – | 9 | 0 |
| wie is de dader |  | – | – | 1 | 0 |
| *wie is de moordenaar |  | – | – | 0 | 0 |

#### RU · Rusland

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| *murdoku | 3/1 | – | – | 8 | 1 |
| sudoku | 3/1 | – | – | 2 | 6 |
| судоку | 3/1 | 166 | – | 2 | 6 |
| сыщик | 3/1 | 93 | – | 1 | 2 |
| головоломки | 3/2 | – | – | 1 | 6 |
| игра сыщик | 3/2 | – | – | 5 | 1 |
| логические игры | 3/2 | – | – | 1 | 7 |
| логические игры для взрослых | 3/3 | – | – | 1 | 5 |
| судоку без интернета | 3/3 | 104 | – | 4 | 3 |
| *убийца | 3/3 | – | – | 1 | 3 |
| загадки | 3/4 | – | – | 2 | 7 |
| логика | 3/4 | – | – | 2 | 5 |
| головоломки без интернета | 3/5 | – | – | 0 | 8 |
| *киллер судоку | 3/5 | 103 | – | 6 | 2 |
| загадки на логику | 3/6 | – | – | 2 | 6 |
| детективные игры | 3/8 | – | – | 5 | 0 |
| судоку без рекламы | 3/8 | 65 | – | 5 | 3 |
| *убийство | 3/9 | – | – | 2 | 2 |
| *killer sudoku | 3/10 | 101 | – | 6 | 2 |
| детектив | 3/10 | – | – | 5 | 0 |
| *murdle | 4/4 | – | – | 8 | 0 |
| *кто убийца | 4/6 | 12 | – | 3 | 3 |
| расследование | 4/6 | – | – | 8 | 0 |
| детективы | 4/7 | – | – | 4 | 0 |
| тайна | 5/4 | – | – | 8 | 0 |
| преступление | 6/1 | – | – | 8 | 0 |
| logic puzzles | 6/4 | – | – | 4 | 3 |
| игры расследования | 6/4 | – | – | 8 | 0 |
| логические загадки | 6/5 | – | – | 1 | 5 |
| игра расследование | 6/6 | – | – | 7 | 0 |
| судоку детектив | 6/6 | 17 | – | 10 | 0 |
| детективная игра | 8/6 | – | – | 7 | 0 |
| игра детектив | 13/1 | – | – | 5 | 2 |
| игры детектив | 13/2 | – | – | 4 | 0 |
| детектив судоку | 15/1 | 12 | – | 10 | 0 |
| логические головоломки | 22/1 | – | – | 1 | 5 |
| brain teaser |  | – | – | 1 | 5 |
| crime puzzle |  | – | – | 7 | 1 |
| crime sudoku |  | 4 | 6 | 10 | 0 |
| deduction |  | 174 | – | 6 | 2 |
| detective game |  | – | – | 7 | 0 |
| detective games |  | – | – | 8 | 0 |
| detective puzzle |  | – | – | 7 | 0 |
| detective sudoku |  | 17 | 8 | 9 | 0 |
| grid puzzle |  | – | – | 4 | 2 |
| logic games |  | – | – | 1 | 5 |
| logic grid |  | – | – | 5 | 3 |
| logic puzzle |  | – | – | 4 | 2 |
| *murder sudoku |  | 25 | – | 10 | 0 |
| mystery game |  | – | – | 6 | 1 |
| mystery games |  | – | – | 5 | 0 |
| mystery puzzle |  | – | – | 4 | 3 |
| mystery sudoku |  | 15 | – | 9 | 1 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 36 | – | 10 | 0 |
| головоломки логические |  | – | – | 1 | 5 |
| кто виноват |  | – | – | 3 | 0 |
| судоку загадка |  | 18 | – | 7 | 0 |
| судоку логика |  | 139 | – | 8 | 0 |
| судоку на русском |  | – | – | 2 | 3 |
| *судоку убийство |  | 7 | 6 | 10 | 0 |

#### IN · India

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| detective games | 3/1 | – | – | 6 | 1 |
| iq games | 3/1 | – | – | 1 | 7 |
| *murdoku | 3/1 | – | – | 8 | 0 |
| puzzle games | 3/1 | – | – | 1 | 8 |
| sudoku | 3/1 | – | – | 2 | 3 |
| logic games | 3/3 | – | – | 2 | 5 |
| mystery games | 3/3 | – | – | 3 | 3 |
| sudoku free | 3/3 | – | – | 5 | 3 |
| brain games | 3/7 | – | – | 2 | 7 |
| sudoku offline | 3/7 | – | – | 5 | 4 |
| detective | 3/8 | – | – | 6 | 1 |
| detective iq | 3/9 | – | – | 6 | 1 |
| logical reasoning games | 3/9 | – | – | 9 | 0 |
| mind games | 3/9 | – | – | 0 | 8 |
| *murder mystery | 3/9 | – | – | 6 | 1 |
| logic puzzles | 3/10 | – | – | 4 | 5 |
| riddle games | 4/1 | – | – | 4 | 3 |
| crime game | 4/2 | – | – | 7 | 2 |
| *killer sudoku | 4/2 | – | – | 7 | 2 |
| riddles | 4/8 | – | – | 4 | 3 |
| sudoku no ads | 8/1 | – | – | 7 | 3 |
| logic grid | 10/2 | – | – | 8 | 1 |
| crime games | 11/1 | – | – | 6 | 2 |
| brain teaser | 12/1 | – | – | 3 | 5 |
| detective sudoku | 16/1 | 42 | – | 10 | 0 |
| crime puzzle |  | – | – | 6 | 1 |
| crime sudoku |  | 9 | – | 10 | 0 |
| deduction |  | – | – | 8 | 0 |
| detective game |  | – | – | 7 | 1 |
| detective puzzle |  | – | – | 8 | 0 |
| grid puzzle |  | – | – | 6 | 2 |
| logic puzzle |  | – | – | 7 | 0 |
| *murder sudoku |  | 59 | – | 10 | 0 |
| *murdle |  | – | – | 7 | 1 |
| mystery game |  | – | – | 4 | 3 |
| mystery puzzle |  | – | – | 5 | 0 |
| mystery sudoku |  | 78 | – | 10 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 179 | – | 10 | 0 |
| whodunnit |  | 156 | – | 10 | 0 |
| कोडी |  | – | – | 2 | 2 |
| गुप्तहेर |  | – | – | 0 | 0 |
| जासूस |  | – | – | 5 | 0 |
| जासूसी |  | – | – | 4 | 0 |
| जासूसी गेम |  | – | – | 6 | 0 |
| दिमागी गेम |  | – | – | 5 | 0 |
| दिमागी पहेली |  | – | – | 4 | 0 |
| पहेलियाँ |  | – | – | 2 | 5 |
| पहेली |  | – | – | 3 | 3 |
| मराठी कोडी |  | – | – | 0 | 0 |
| *मर्डर सुडोकू |  | – | – | 0 | 0 |
| सुडोकु |  | – | – | 3 | 3 |
| सुडोकू |  | – | – | 5 | 2 |
| డిటెక్టివ్ |  | – | – | 0 | 0 |
| పజిల్ |  | – | – | 0 | 0 |
| రహస్యం |  | – | – | 0 | 0 |
| సుడోకు |  | – | – | 0 | 0 |
| సుడోకు ఆట |  | – | – | 0 | 0 |
| సుడోకు గేమ్ |  | – | – | 0 | 0 |

#### KR · Zuid-Korea

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| 두뇌 게임 | 1/4 | – | – | 0 | 6 |
| 스도쿠 | 1/4 | – | – | 3 | 5 |
| 추리 | 1/4 | – | – | 6 | 1 |
| 퍼즐 | 1/6 | – | – | 1 | 5 |
| 범인 찾기 | 2/1 | 28 | – | 6 | 0 |
| *살인 | 2/1 | – | – | 3 | 1 |
| 수수께끼 | 2/1 | – | – | 2 | 3 |
| 범인 | 2/2 | 135 | – | 8 | 0 |
| 탐정 | 2/2 | – | – | 6 | 1 |
| 논리 퍼즐 | 2/10 | – | – | 9 | 1 |
| sudoku | 3/1 | – | – | 3 | 4 |
| *killer sudoku | 3/5 | – | – | 4 | 3 |
| 미스터리 | 4/3 | – | – | 4 | 1 |
| logic puzzle | 4/9 | – | – | 4 | 1 |
| *머더 미스터리 | 4/9 | – | – | 10 | 0 |
| 추리 게임 | 5/1 | – | – | 7 | 0 |
| *킬러 스도쿠 | 6/1 | – | – | 6 | 3 |
| brain teaser |  | – | – | 4 | 1 |
| crime puzzle |  | – | – | 6 | 0 |
| crime sudoku |  | 7 | – | 10 | 0 |
| deduction |  | – | – | 8 | 0 |
| detective game |  | – | – | 6 | 0 |
| detective games |  | – | – | 7 | 0 |
| detective puzzle |  | – | – | 8 | 0 |
| detective sudoku |  | 46 | – | 10 | 0 |
| grid puzzle |  | – | – | 6 | 2 |
| logic games |  | – | – | 4 | 1 |
| logic grid |  | – | – | 8 | 1 |
| logic puzzles |  | – | – | 6 | 2 |
| *murder sudoku |  | 57 | – | 10 | 0 |
| *murdle |  | – | – | 8 | 0 |
| *murdoku |  | – | – | 9 | 0 |
| mystery game |  | – | – | 6 | 1 |
| mystery puzzle |  | – | – | 7 | 0 |
| mystery sudoku |  | 74 | – | 8 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 145 | – | 10 | 0 |
| 미스터리 스도쿠 |  | 51 | – | 8 | 0 |
| 범죄 스도쿠 |  | 6 | 6 | 7 | 0 |
| 사건 |  | – | – | 8 | 1 |
| 사건 해결 |  | – | – | 8 | 0 |
| *살인 스도쿠 |  | 13 | – | 10 | 0 |
| 스도쿠 광고 없는 |  | 95 | – | 9 | 1 |
| 스도쿠 광고없음 |  | – | – | 10 | 0 |
| 스도쿠 무료 |  | – | – | 5 | 3 |
| 스도쿠 추리 |  | 28 | – | 8 | 0 |
| 추리 스도쿠 |  | 125 | – | 8 | 0 |
| 추리 퍼즐 |  | – | – | 8 | 1 |
| 탐정 게임 |  | – | – | 7 | 0 |
| 탐정 스도쿠 |  | 17 | – | 9 | 0 |

#### DE · Duitsland

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| detektiv spiele | 3/1 | – | – | 5 | 1 |
| *murdoku | 3/1 | – | – | 9 | 1 |
| rätsel spiele | 3/1 | – | – | 0 | 4 |
| sudoku | 3/1 | – | – | 1 | 6 |
| logik spiele | 3/2 | – | – | 1 | 7 |
| *wer ist der mörder | 3/2 | – | – | 6 | 2 |
| *mörder | 3/3 | – | – | 3 | 2 |
| rätsel | 3/3 | – | – | 1 | 5 |
| denkspiele | 3/4 | – | – | 1 | 7 |
| detective games | 3/4 | – | – | 4 | 3 |
| *killer sudoku | 3/4 | – | – | 7 | 2 |
| sudoku ohne werbung | 3/4 | – | – | 1 | 4 |
| krimi spiele | 3/6 | – | – | 4 | 1 |
| knobelspiele | 3/7 | – | – | 1 | 5 |
| *mordfall lösen | 4/2 | 46 | – | 7 | 1 |
| tatort | 4/3 | – | – | 5 | 2 |
| sudoku offline | 4/4 | – | – | 2 | 6 |
| detektiv | 4/5 | 147 | – | 6 | 2 |
| logik rätsel | 4/6 | – | – | 0 | 4 |
| *mord | 4/6 | – | – | 4 | 1 |
| krimi | 4/7 | – | – | 6 | 1 |
| *mordfall | 4/7 | 26 | – | 7 | 1 |
| *murdle | 5/1 | – | – | 4 | 0 |
| logikrätsel | 6/1 | – | – | 2 | 2 |
| logic puzzle | 6/2 | – | – | 3 | 3 |
| logikspiele | 6/2 | – | – | 0 | 4 |
| logic games | 6/5 | – | – | 2 | 4 |
| rätselspiele | 12/1 | – | – | 0 | 3 |
| logic puzzles | 13/1 | – | – | 4 | 3 |
| detektivspiele | 13/2 | 35 | – | 7 | 0 |
| gehirnjogging | 13/2 | – | – | 2 | 5 |
| sudoku rätsel | 13/8 | – | – | 1 | 6 |
| sudoku deutsch | 14/1 | – | – | 3 | 4 |
| detective sudoku | 16/1 | 31 | – | 10 | 0 |
| brain teaser |  | – | – | 2 | 5 |
| crime puzzle |  | – | – | 8 | 0 |
| crime sudoku |  | 10 | 10 | 10 | 0 |
| deduction |  | – | – | 8 | 1 |
| denkspiel |  | – | – | 0 | 8 |
| detective game |  | – | – | 3 | 3 |
| detective puzzle |  | – | – | 7 | 1 |
| detektiv sudoku |  | 9 | 9 | 10 | 0 |
| detektivspiel |  | – | – | 7 | 0 |
| grid puzzle |  | – | – | 5 | 2 |
| krimi rätsel |  | – | – | 8 | 0 |
| krimi sudoku |  | 26 | – | 10 | 0 |
| krimispiele |  | – | – | 5 | 1 |
| logic grid |  | – | – | 6 | 0 |
| logik sudoku |  | – | – | 3 | 3 |
| *mord sudoku |  | 24 | – | 10 | 0 |
| *mörder sudoku |  | 16 | – | 10 | 0 |
| *murder sudoku |  | 44 | – | 10 | 0 |
| mystery game |  | – | – | 0 | 3 |
| mystery puzzle |  | – | – | 2 | 4 |
| mystery sudoku |  | 29 | – | 8 | 1 |
| sudoku detektiv |  | 8 | 8 | 10 | 0 |
| sudoku krimi |  | 25 | – | 10 | 0 |
| sudoku variants |  | – | – | 9 | 0 |
| täter |  | 58 | – | 9 | 0 |
| wer war es |  | – | – | 2 | 7 |
| whodunit |  | 94 | – | 10 | 0 |

#### ES · Spanje

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| *murdoku | 3/1 | – | – | 7 | 1 |
| sudoku | 3/1 | – | – | 2 | 4 |
| detective | 3/2 | 50 | – | 7 | 0 |
| *murdle | 3/3 | – | – | 6 | 0 |
| sudoku sin anuncios | 3/3 | – | – | 8 | 2 |
| rompecabezas | 3/4 | – | – | 1 | 4 |
| acertijos | 3/5 | – | – | 3 | 2 |
| *asesino | 3/5 | – | – | 7 | 1 |
| logic puzzles | 3/5 | – | – | 5 | 3 |
| sudoku crimen | 3/5 | 20 | – | 9 | 0 |
| *murder sudoku | 3/6 | 32 | – | 9 | 0 |
| enigma | 3/8 | – | – | 5 | 1 |
| resolver crimenes | 4/4 | – | – | 8 | 0 |
| crimen | 4/5 | – | – | 6 | 0 |
| misterio | 4/7 | – | – | 4 | 1 |
| pistas | 4/10 | – | – | 2 | 3 |
| logic games | 6/4 | – | – | 4 | 1 |
| crime sudoku | 6/6 | 9 | 9 | 9 | 0 |
| enigmas | 7/1 | – | – | 3 | 2 |
| sudoku sin conexion | 7/3 | – | – | 5 | 5 |
| juegos de misterio | 8/1 | – | – | 3 | 1 |
| sudoku detective | 8/1 | 14 | – | 9 | 0 |
| juego detective | 9/1 | – | – | 8 | 0 |
| detective game | 9/3 | – | – | 8 | 1 |
| juegos de detectives | 10/2 | – | – | 6 | 1 |
| detectives | 10/3 | 163 | – | 6 | 2 |
| detective sudoku | 16/1 | 9 | 9 | 9 | 0 |
| juegos de logica | 16/2 | – | – | 2 | 3 |
| *quien es el asesino | 19/1 | 1 | 1 | 4 | 0 |
| acertijos de logica |  | – | – | 2 | 5 |
| *asesinato |  | 123 | – | 5 | 1 |
| brain teaser |  | – | – | 1 | 2 |
| crime puzzle |  | – | – | 5 | 2 |
| culpable |  | 16 | – | 9 | 0 |
| deduction |  | – | – | 8 | 0 |
| detective games |  | – | – | 5 | 2 |
| detective puzzle |  | – | – | 7 | 1 |
| grid puzzle |  | – | – | 6 | 2 |
| juego de detectives |  | 158 | – | 7 | 0 |
| juegos de crimen |  | – | – | 2 | 3 |
| juegos de lógica |  | – | – | 2 | 4 |
| *killer sudoku |  | – | – | 6 | 2 |
| logic grid |  | – | – | 7 | 1 |
| logic puzzle |  | – | – | 6 | 1 |
| mystery game |  | – | – | 2 | 2 |
| mystery puzzle |  | – | – | 2 | 1 |
| mystery sudoku |  | 14 | – | 8 | 0 |
| quien fue |  | – | – | 1 | 1 |
| *quien mato |  | – | – | 1 | 9 |
| *sudoku asesinato |  | 8 | 8 | 9 | 0 |
| sudoku crímenes |  | – | – | 7 | 0 |
| sudoku enigma |  | 13 | – | 9 | 0 |
| sudoku español |  | – | – | 4 | 3 |
| sudoku logico |  | 145 | – | 2 | 2 |
| sudoku misterio |  | 22 | – | 8 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 62 | – | 9 | 0 |

#### IT · Italië

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| sudoku | 3/1 | – | – | 1 | 5 |
| detective game | 3/2 | – | – | 6 | 1 |
| *murdoku | 3/2 | – | – | 8 | 1 |
| rompicapo | 3/2 | – | – | 2 | 4 |
| detective | 3/3 | 45 | – | 4 | 1 |
| sudoku offline | 3/4 | – | – | 4 | 4 |
| *killer sudoku | 3/5 | – | – | 8 | 2 |
| logica | 3/6 | – | – | 3 | 5 |
| sudoku senza pubblicità | 3/6 | – | – | 10 | 0 |
| enigmistica | 3/7 | – | – | 2 | 5 |
| enigmi | 3/8 | – | – | 4 | 0 |
| indovinelli | 3/10 | – | – | 2 | 4 |
| *risolvi omicidi | 4/1 | – | – | 8 | 0 |
| *omicidio | 4/2 | 57 | – | 6 | 2 |
| risolvi casi | 4/2 | – | – | 5 | 1 |
| *omicidi | 4/3 | 64 | – | 3 | 2 |
| *assassino | 4/4 | – | – | 4 | 2 |
| *giochi omicidi | 4/4 | 75 | – | 5 | 0 |
| giallo | 4/7 | 89 | – | 4 | 4 |
| gialli | 4/9 | 107 | – | 8 | 0 |
| giochi gialli | 6/1 | – | – | 1 | 4 |
| giochi logica | 6/1 | – | – | 2 | 6 |
| logic puzzle | 6/2 | – | – | 4 | 4 |
| logic games | 6/5 | – | – | 1 | 4 |
| mistero | 6/8 | – | – | 2 | 2 |
| giochi di mistero | 7/1 | – | – | 4 | 1 |
| crimine | 7/3 | – | – | 5 | 0 |
| giochi investigativi | 8/4 | – | – | 2 | 3 |
| gioco investigativo | 13/1 | 90 | – | 7 | 1 |
| logic puzzles | 13/1 | – | – | 3 | 5 |
| investigativo | 13/2 | 149 | – | 7 | 0 |
| detective sudoku | 16/1 | 7 | 7 | 10 | 0 |
| giochi detective | 16/1 | – | – | 3 | 3 |
| giochi di logica | 16/2 | – | – | 2 | 6 |
| brain teaser |  | – | – | 1 | 4 |
| chi è stato |  | 8 | 8 | 4 | 3 |
| colpevole |  | 13 | – | 9 | 0 |
| crime puzzle |  | – | – | 5 | 1 |
| crime sudoku |  | 4 | 5 | 10 | 0 |
| deduction |  | – | – | 8 | 0 |
| *delitto |  | 16 | – | 9 | 0 |
| detective games |  | – | – | 5 | 0 |
| detective puzzle |  | – | – | 8 | 0 |
| grid puzzle |  | – | – | 5 | 2 |
| logic grid |  | – | – | 8 | 0 |
| *murder sudoku |  | 26 | – | 10 | 0 |
| *murdle |  | – | – | 8 | 0 |
| mystery game |  | – | – | 0 | 2 |
| mystery puzzle |  | – | – | 1 | 2 |
| mystery sudoku |  | 12 | 12 | 9 | 1 |
| sudoku crimine |  | – | – | 10 | 0 |
| sudoku detective |  | 12 | 12 | 10 | 0 |
| sudoku giallo |  | 3 | 3 | 10 | 0 |
| sudoku investigativo |  | 3 | 3 | 10 | 0 |
| sudoku italiano |  | – | – | 2 | 2 |
| sudoku logica |  | – | – | 2 | 3 |
| sudoku mistero |  | 7 | 7 | 10 | 0 |
| *sudoku omicidio |  | 3 | 3 | 10 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 47 | – | 10 | 0 |

#### GB · Verenigd Koninkrijk

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| sudoku | 2/3 | – | – | 1 | 6 |
| detective games | 3/1 | – | – | 6 | 2 |
| cozy games | 3/2 | – | – | 2 | 4 |
| *killer sudoku | 3/2 | – | – | 6 | 2 |
| *murdoku | 3/2 | – | – | 8 | 1 |
| mystery games | 3/2 | – | – | 3 | 3 |
| puzzle games for adults | 3/2 | – | – | 1 | 8 |
| sudoku no ads | 3/3 | – | – | 4 | 3 |
| detective | 3/6 | – | – | 7 | 1 |
| *murder mystery | 3/6 | – | – | 4 | 2 |
| sudoku offline | 3/6 | – | – | 2 | 6 |
| logic puzzles | 3/7 | – | – | 3 | 3 |
| cosy games | 4/1 | – | – | 3 | 3 |
| culprit | 4/2 | 23 | – | 9 | 1 |
| crime games | 4/3 | – | – | 5 | 1 |
| *murdle | 4/3 | – | – | 5 | 0 |
| brain games | 4/4 | – | – | 0 | 10 |
| daily puzzles | 4/6 | – | – | 6 | 1 |
| solve crime | 4/6 | – | – | 6 | 2 |
| who did it | 5/2 | – | – | 4 | 4 |
| logic games | 5/4 | – | – | 3 | 4 |
| find the culprit | 5/5 | 29 | – | 9 | 0 |
| logic grid puzzles | 5/5 | – | – | 4 | 1 |
| grid puzzle | 6/7 | – | – | 2 | 2 |
| logic sudoku | 7/3 | – | – | 2 | 5 |
| crime solving | 7/5 | – | – | 4 | 3 |
| logic grid | 7/6 | – | – | 5 | 0 |
| mystery puzzle | 9/3 | – | – | 3 | 3 |
| detective sudoku | 12/1 | – | – | 6 | 2 |
| brain teaser |  | – | – | 0 | 8 |
| case solving |  | – | – | 5 | 2 |
| clue game |  | – | – | 2 | 1 |
| cosy mystery |  | – | – | 6 | 2 |
| cozy mystery |  | – | – | 3 | 2 |
| crime puzzle |  | – | – | 8 | 0 |
| crime sudoku |  | 38 | – | 4 | 3 |
| daily puzzle |  | – | – | 5 | 1 |
| deduction |  | – | – | 5 | 1 |
| deduction puzzle |  | – | – | 5 | 1 |
| detective game |  | – | – | 5 | 3 |
| detective mystery |  | – | – | 8 | 1 |
| detective puzzle |  | – | – | 7 | 1 |
| logic puzzle |  | – | – | 3 | 0 |
| *murder sudoku |  | – | – | 10 | 0 |
| mystery cases |  | – | – | 6 | 2 |
| mystery game |  | – | – | 1 | 2 |
| mystery sudoku |  | – | – | 2 | 3 |
| puzzle mystery |  | – | – | 2 | 2 |
| sleuth |  | – | – | 9 | 1 |
| solve crimes |  | – | – | 6 | 2 |
| sudoku crime |  | 58 | – | 7 | 2 |
| sudoku detective |  | 173 | – | 8 | 2 |
| sudoku mystery |  | – | – | 2 | 3 |
| sudoku puzzle |  | – | – | 0 | 5 |
| sudoku variants |  | – | – | 5 | 2 |
| suspect |  | – | – | 5 | 2 |
| whodunit |  | – | – | 9 | 0 |
| whodunnit |  | – | – | 5 | 1 |

#### PT · Portugal

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| *murdoku | 3/1 | – | – | 7 | 1 |
| sudoku | 3/1 | – | – | 5 | 1 |
| *murder sudoku | 3/2 | 44 | – | 9 | 0 |
| detetive | 3/3 | – | – | 10 | 0 |
| enigmas | 3/3 | – | – | 6 | 1 |
| *killer sudoku | 3/4 | – | – | 6 | 1 |
| sudoku crime | 3/4 | 32 | – | 9 | 0 |
| logic puzzles | 4/4 | – | – | 5 | 1 |
| raciocínio | 4/5 | – | – | 4 | 2 |
| logic games | 4/7 | – | – | 5 | 0 |
| charadas | 4/9 | – | – | 9 | 0 |
| jogos de detetive | 6/2 | – | – | 9 | 0 |
| detective games | 6/5 | – | – | 9 | 0 |
| sudoku sem anúncios | 8/8 | 33 | – | 9 | 1 |
| jogo de detetive | 16/1 | – | – | 9 | 0 |
| *assassinato |  | 55 | – | 10 | 0 |
| brain teaser |  | – | – | 4 | 1 |
| crime puzzle |  | – | – | 7 | 0 |
| crime sudoku |  | 27 | – | 9 | 0 |
| culpado |  | 25 | – | 10 | 0 |
| deduction |  | – | – | 9 | 0 |
| detective game |  | – | – | 9 | 0 |
| detective puzzle |  | – | – | 8 | 0 |
| detective sudoku |  | 37 | – | 9 | 0 |
| enigma |  | – | – | 8 | 1 |
| grid puzzle |  | – | – | 8 | 1 |
| jogo de crime |  | – | – | 8 | 0 |
| jogo de mistério |  | – | – | 8 | 0 |
| jogos de lógica |  | – | – | 1 | 3 |
| logic grid |  | – | – | 9 | 1 |
| logic puzzle |  | – | – | 8 | 0 |
| *murdle |  | – | – | 8 | 1 |
| mystery game |  | – | – | 6 | 0 |
| mystery puzzle |  | – | – | 7 | 0 |
| mystery sudoku |  | 64 | – | 8 | 0 |
| passatempos |  | – | – | 7 | 2 |
| quebra cabeças |  | – | – | 2 | 0 |
| quem foi |  | – | – | 3 | 0 |
| *quem matou |  | – | – | 1 | 0 |
| *sudoku assassinato |  | 11 | 11 | 9 | 0 |
| sudoku detetive |  | 39 | – | 9 | 0 |
| sudoku enigma |  | 74 | – | 7 | 1 |
| sudoku mistério |  | 28 | – | 9 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 80 | – | 9 | 0 |

#### ID · Indonesië

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| sudoku | 3/1 | – | – | 5 | 2 |
| detective game | 3/2 | – | – | 3 | 0 |
| teka teki | 3/2 | – | – | 3 | 3 |
| sudoku offline | 3/3 | – | – | 6 | 1 |
| teka teki silang | 3/4 | – | – | 6 | 1 |
| detektif | 3/5 | 147 | – | 6 | 0 |
| tebak | 3/5 | – | – | 5 | 2 |
| asah otak | 3/8 | – | – | 4 | 4 |
| *killer sudoku | 3/8 | – | – | 7 | 1 |
| game asah otak | 4/1 | – | – | 3 | 4 |
| *murdoku | 4/1 | – | – | 9 | 1 |
| logic puzzle | 4/8 | – | – | 7 | 2 |
| misteri | 4/9 | – | – | 6 | 0 |
| logika | 4/10 | – | – | 4 | 4 |
| game logika | 6/1 | – | – | 4 | 4 |
| *game pembunuhan | 6/1 | 67 | – | 8 | 0 |
| game teka teki | 6/1 | – | – | 3 | 3 |
| game detektif | 6/3 | 66 | – | 7 | 0 |
| game misteri | 6/6 | – | – | 7 | 0 |
| teka teki logika | 6/6 | – | – | 3 | 3 |
| game kasus | 10/1 | 64 | – | 8 | 0 |
| game kriminal | 13/1 | 71 | – | 9 | 0 |
| logic puzzles | 13/1 | – | – | 5 | 4 |
| detective sudoku | 16/1 | 47 | – | 10 | 0 |
| brain teaser |  | – | – | 1 | 2 |
| crime puzzle |  | – | – | 6 | 0 |
| crime sudoku |  | 12 | – | 10 | 0 |
| deduction |  | – | – | 10 | 0 |
| detective games |  | – | – | 5 | 0 |
| detective puzzle |  | – | – | 8 | 0 |
| grid puzzle |  | – | – | 8 | 1 |
| logic games |  | – | – | 5 | 2 |
| logic grid |  | – | – | 9 | 1 |
| *murder sudoku |  | 58 | – | 10 | 0 |
| *murdle |  | – | – | 10 | 0 |
| mystery game |  | – | – | 2 | 1 |
| mystery puzzle |  | – | – | 8 | 0 |
| mystery sudoku |  | 75 | – | 9 | 0 |
| *pembunuhan |  | 81 | – | 8 | 0 |
| siapa pelaku |  | 1 | 1 | 1 | 0 |
| sudoku detektif |  | 8 | 8 | 10 | 0 |
| sudoku indonesia |  | – | – | 9 | 0 |
| sudoku kriminal |  | 6 | 9 | 9 | 0 |
| sudoku logika |  | – | – | 7 | 2 |
| sudoku misteri |  | 18 | – | 10 | 0 |
| sudoku tanpa iklan |  | 39 | – | 9 | 0 |
| sudoku teka teki |  | – | – | 7 | 1 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 143 | – | 10 | 0 |

#### VN · Vietnam

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| game suy luận | 3/1 | 62 | – | 10 | 0 |
| *murdoku | 3/1 | – | – | 9 | 1 |
| sudoku | 3/1 | – | – | 2 | 3 |
| *killer sudoku | 3/2 | – | – | 7 | 1 |
| suy luận | 3/2 | 96 | – | 10 | 0 |
| detective game | 3/3 | – | – | 6 | 0 |
| sudoku không quảng cáo | 3/3 | 175 | – | 5 | 3 |
| câu đố | 3/4 | – | – | 1 | 7 |
| giải đố | 3/5 | – | – | 1 | 4 |
| phá án | 3/5 | – | – | 8 | 1 |
| *murdle | 3/7 | – | – | 9 | 1 |
| thám tử | 3/7 | 97 | – | 7 | 2 |
| game thám tử | 4/2 | 96 | – | 7 | 2 |
| game trinh thám | 4/6 | 45 | – | 7 | 1 |
| trinh thám | 4/7 | 82 | – | 8 | 1 |
| logic puzzle | 4/8 | – | – | 8 | 0 |
| game phá án | 6/1 | – | – | 7 | 1 |
| game giải đố | 6/2 | – | – | 4 | 4 |
| game trí tuệ | 6/3 | – | – | 3 | 5 |
| điều tra | 6/4 | – | – | 8 | 1 |
| game điều tra | 6/10 | – | – | 10 | 0 |
| game logic | 10/1 | – | – | 2 | 4 |
| game câu đố | 11/1 | – | – | 4 | 5 |
| logic puzzles | 13/1 | – | – | 3 | 3 |
| detective sudoku | 16/1 | 15 | 12 | 10 | 0 |
| trò chơi trí tuệ | 16/1 | – | – | 1 | 5 |
| *án mạng |  | – | – | 2 | 6 |
| bí ẩn |  | – | – | 7 | 2 |
| brain teaser |  | – | – | 1 | 5 |
| crime puzzle |  | 134 | – | 7 | 0 |
| crime sudoku |  | 4 | 4 | 10 | 0 |
| deduction |  | 155 | – | 10 | 0 |
| detective games |  | – | – | 9 | 0 |
| detective puzzle |  | – | – | 9 | 0 |
| *game án mạng |  | – | – | 0 | 6 |
| grid puzzle |  | – | – | 7 | 1 |
| *hung thủ |  | – | – | 5 | 3 |
| logic games |  | – | – | 2 | 5 |
| logic grid |  | – | – | 7 | 1 |
| *murder sudoku |  | 22 | – | 9 | 0 |
| mystery game |  | – | – | 8 | 0 |
| mystery puzzle |  | – | – | 7 | 0 |
| mystery sudoku |  | 11 | 12 | 8 | 1 |
| *sudoku án mạng |  | 2 | 3 | 3 | 6 |
| sudoku bí ẩn |  | 3 | 2 | 9 | 0 |
| sudoku phá án |  | 1 | 1 | 6 | 1 |
| sudoku thám tử |  | 2 | 2 | 9 | 0 |
| sudoku tiếng việt |  | – | – | 1 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 23 | – | 10 | 0 |

#### PK · Pakistan

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| puzzle games | 3/1 | – | – | 2 | 1 |
| sudoku | 3/1 | – | – | 9 | 0 |
| *murder mystery | 3/2 | – | – | 9 | 0 |
| detective game | 3/3 | – | – | 9 | 0 |
| detective | 3/5 | – | – | 9 | 0 |
| brain games | 3/7 | – | – | 6 | 0 |
| detective games | 15/1 | – | – | 8 | 0 |
| detective sudoku | 16/1 | 23 | – | 10 | 0 |
| brain teaser |  | – | – | 5 | 0 |
| crime puzzle |  | – | – | 9 | 0 |
| crime sudoku |  | 5 | – | 10 | 0 |
| deduction |  | – | – | 10 | 0 |
| detective puzzle |  | – | – | 9 | 0 |
| grid puzzle |  | – | – | 9 | 0 |
| *killer sudoku |  | – | – | 9 | 0 |
| logic games |  | – | – | 7 | 0 |
| logic grid |  | – | – | 9 | 0 |
| logic puzzle |  | – | – | 9 | 0 |
| logic puzzles |  | – | – | 5 | 0 |
| *murder sudoku |  | 55 | – | 10 | 0 |
| *murdle |  | – | – | 9 | 0 |
| *murdoku |  | – | – | 9 | 0 |
| mystery game |  | – | – | 9 | 0 |
| mystery puzzle |  | – | – | 8 | 1 |
| mystery sudoku |  | 55 | – | 9 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 124 | – | 10 | 0 |
| whodunnit |  | 87 | – | 10 | 0 |
| پہیلی |  | – | – | 3 | 2 |
| پہیلیاں |  | – | – | 3 | 2 |
| جاسوس |  | – | – | 9 | 1 |
| جاسوسی |  | – | – | 10 | 0 |
| جاسوسی گیم |  | – | – | 9 | 0 |
| سوڈوکو |  | – | – | 1 | 1 |
| *مرڈر سوڈوکو |  | – | – | 10 | 0 |

#### SG · Singapore

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| 益智游戏 | 1/1 | – | – | 6 | 1 |
| *剧本杀 | 1/2 | – | – | 8 | 0 |
| 数独 | 1/2 | – | – | 5 | 1 |
| 解谜 | 1/5 | – | – | 7 | 0 |
| detective game | 3/1 | – | – | 9 | 0 |
| *murdoku | 3/1 | – | – | 9 | 0 |
| sudoku | 3/1 | – | – | 6 | 1 |
| *killer sudoku | 3/3 | – | – | 7 | 1 |
| mystery game | 4/1 | – | – | 8 | 0 |
| logic puzzle | 4/6 | – | – | 8 | 0 |
| detective sudoku | 16/1 | 35 | – | 10 | 0 |
| brain teaser |  | – | – | 4 | 0 |
| crime puzzle |  | – | – | 9 | 0 |
| crime sudoku |  | 10 | – | 10 | 0 |
| deduction |  | – | – | 8 | 0 |
| detective games |  | – | – | 8 | 0 |
| detective puzzle |  | – | – | 9 | 0 |
| grid puzzle |  | – | – | 8 | 0 |
| logic games |  | – | – | 7 | 1 |
| logic grid |  | – | – | 9 | 0 |
| logic puzzles |  | – | – | 7 | 0 |
| *murder sudoku |  | 51 | – | 10 | 0 |
| *murdle |  | – | – | 8 | 0 |
| mystery puzzle |  | – | – | 9 | 0 |
| mystery sudoku |  | 64 | – | 10 | 0 |
| sudoku variants |  | – | – | 10 | 0 |
| whodunit |  | 157 | – | 10 | 0 |
| 侦探 |  | – | – | 10 | 0 |
| 侦探数独 |  | 34 | – | 10 | 0 |
| 侦探游戏 |  | – | – | 10 | 0 |
| *凶手 |  | – | – | 9 | 0 |
| 悬疑 |  | – | – | 10 | 0 |
| 悬疑游戏 |  | – | – | 10 | 0 |
| 推理 |  | – | – | 9 | 0 |
| 推理数独 |  | 128 | – | 9 | 0 |
| 推理游戏 |  | – | – | 10 | 0 |
| 数独 侦探 |  | 34 | – | 10 | 0 |
| 数独 推理 |  | 128 | – | 9 | 0 |
| 数独 无广告 |  | – | – | 10 | 0 |
| 烧脑 |  | – | – | 10 | 0 |
| 烧脑游戏 |  | – | – | 9 | 0 |
| 破案 |  | 44 | – | 9 | 0 |
| 破案游戏 |  | 175 | – | 10 | 0 |
| 解谜游戏 |  | – | – | 8 | 0 |
| *谋杀 |  | – | – | 10 | 0 |
| *谋杀数独 |  | 9 | 9 | 9 | 0 |
| 逻辑 |  | – | – | 8 | 0 |
| 逻辑推理 |  | – | – | 10 | 0 |
| 逻辑游戏 |  | – | – | 7 | 0 |

#### TW · Taiwan

| Term | Hint | Rang | Top 12 | <1k | >10k |
|---|---|---|---|---|---|
| 數獨 | 1/1 | – | – | 3 | 6 |
| 邏輯遊戲 | 1/1 | – | – | 3 | 5 |
| 偵探遊戲 | 1/2 | – | – | 5 | 0 |
| 解謎遊戲 | 1/4 | – | – | 5 | 1 |
| 偵探 | 1/5 | – | – | 5 | 0 |
| 解謎 | 1/5 | – | – | 7 | 1 |
| 益智 | 1/8 | – | – | 1 | 6 |
| 推理 | 1/9 | – | – | 7 | 0 |
| 推理遊戲 | 1/10 | – | – | 6 | 0 |
| 偵探數獨 | 2/9 | – | – | 7 | 1 |
| sudoku | 3/1 | – | – | 2 | 4 |
| *murdle | 3/4 | – | – | 8 | 0 |
| *murder sudoku |  | 56 | – | 9 | 0 |
| *murdoku |  | – | – | 8 | 2 |
| 推理數獨 |  | – | – | 8 | 1 |
| 數獨 推理 |  | – | – | 9 | 1 |
| *謀殺數獨 |  | – | – | 7 | 0 |
| 邏輯 |  | – | – | 2 | 3 |

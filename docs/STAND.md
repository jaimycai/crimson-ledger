# Stand van Crimson Ledger

*Bijgewerkt 13 oktober 2026, op `main` f3de005. Dit is het startpunt voor een nieuwe sessie: eerst dit
bestand, dan alleen de bestanden die bij de taak horen. Werk het bij aan het eind van elke sessie.*

## Wie werkt waaraan

Er werken twee soorten sessies aan deze repo: een sessie op de Mac (pusht rechtstreeks naar `main`) en
cloudsessies (werken op een eigen `claude/...`-branch met een pull request). Om dubbel werk te voorkomen:

1. Begin met `git fetch origin` en lees `git log HEAD..origin/main`. Wat daar staat, is al gedaan.
2. Kijk ook naar de open pull requests en de branches `origin/claude/*` (`git branch -r`). Werk dat daar
   nog wacht, staat nog niet op `main` maar is wel gedaan. Lees de tabel hieronder in die branch.
3. Zet hieronder één regel met wat je gaat doen en push die meteen. Is het klaar, zet dan de stand erbij;
   haal de regel weg zodra het op `main` staat.
4. Raak geen bestanden aan die een andere regel hieronder claimt.

| Sinds | Sessie | Taak | Bestanden |
|---|---|---|---|
| 13 okt | cloud, branch `claude/kind-feynman-ocvzz9` | Aankoopteksten in de talen van 1.2. Klaar; wacht op samenvoegen van PR #1, daarna `node store/asc.js iap-locs` op de Mac. | `store/iap-texts.js`, `store/asc.js` (alleen `iapLocalizations`) |

## Wat live staat

| | Stand | Bron |
|---|---|---|
| iOS-app | Live sinds 22 sep (1.0, build 5), id 6812534368. 1.1 live sinds 3 okt. | `store/OPNAME.md`, `store/social/LOGBOEK.md` |
| Laatste inzending | 1.1.2 (build 10) op 7 okt, met nieuwe winkelteksten. Uitkomst staat niet in de repo. | `store/ASO.md` |
| 1.2 bij Apple | Onbekend. Op 12 okt is de versie in App Store Connect voorbereid; Apple weigerde indienen zonder support-URL in de nieuwe talen, dat is hersteld (c491e9d). Of 1.2 daarna is ingediend, staat niet in de repo. De Mac-sessie zet dit in `store/social/LOGBOEK.md`. | `store/asc-release.js` |
| Nederland (EU) | De NL-winkel toont de app (zoekposities gemeten op 4 en 12 okt). | `store/social/LOGBOEK.md` |
| Cijfers | 7 dagen tot 8 okt: 245 vertoningen, 31 paginaweergaven, 7 downloads, 0 aankopen, 0 beoordelingen. 12 okt: "moordmysterie" van plek 2 naar 4, mogelijk door de NL-naam van 1.1.2 (niet gemeten). | `store/social/LOGBOEK.md` |
| Featuring | Nominatie "App Enhancements" ingediend op 4 okt. | `store/NOMINATIE.md` |
| Android | Bundel ligt klaar (`versionName` 1.2.0), nog geen Play Console-account. | `store/PLAY-STORE.md` |
| TikTok | Carrousels via Metricool haalden bereik (237, 268, 78 views); de vier die rechtstreeks in TikTok Studio zijn gepland, bleven op 0. Te testen: de route van plaatsen. Formaat C (uitleg) vervalt. Op 13 okt niet gemeten (Chrome niet verbonden). | `store/social/LOGBOEK.md` |
| Kanaalnaam | "Crimson Ledger · Crime Sudoku". YouTube heeft hem; TikTok kan sinds 13 okt worden aangepast. | `store/social/LOGBOEK.md` |

## Versie 1.2: klaar

- Versie 1.2.0, build 12 (iOS, Android, `package.json`, instellingen).
- 20 talen, met zinsbouw per taal, meervoud, rechts naar links voor Arabisch en Urdu en letters per schrift.
  Elke taal is op 12 okt op echte schermen (320 en 375 px) nagelezen en verbeterd (`tests/qa-lang.js`).
- Nieuwe namen voor de verdachten, 64 gegraveerde portretten, Tabler-iconen, het beeldmerk op het
  openingsscherm. Portretlijsten uit de winkel staan nu ook om de verdachten.
- Beoordelingsvraag op drie momenten (`app.js`, `maybeAskReview`).
- Winkelteksten voor 23 winkeltalen in `store/metadata/1.2.0.json`. Engelse naam: "Crimson Ledger: Crime Sudoku".
- Schermafbeeldingen en winkelplaten in elke taal (`store/make-screenshots.js`, `store/make-store-cards.js`,
  bijschriften in `store/cards-text/`). Beeld 1 noemt 384 zaken, geen reclame en elke dag een nieuwe.
  Alleen nl en en staan in git; de andere achttien talen maak je opnieuw (samen ongeveer 200 MB).
- Echte App Store-prijzen per markt op de platen (`store/asc-prices.js`).
- Bouwen en uploaden zonder Xcode-inlog: `store/release-ios.sh` (alleen op de Mac).
- Aankoopteksten (negen producten) in 21 winkeltalen: `store/iap-texts.js` haalt namen en
  wereldomschrijvingen uit de taalbestanden van de app; drie korte omschrijvingen zijn apart vertaald en
  nagelezen. `node store/asc.js iap-locs` zet ze in App Store Connect (op de Mac).

## Versie 1.2: wat nog moet

| # | Stap | Wie |
|---|---|---|
| 1 | Nakijken of 1.2 (build 12) is ingediend, en wat Apple zegt. | Mac-sessie of Jaimy |
| 2 | `node store/asc.js iap-locs` draaien, zodat de aankopen in elke taal een naam hebben. Een aankoop die in beoordeling zit, staat op slot; het script meldt dat per taal en gaat door. | Mac-sessie |
| 3 | Nieuwe featuring-nominatie voor 1.2 met 20 talen, minstens drie weken vooruit. | Mac-sessie, na akkoord van Jaimy |
| 4 | 7 en 14 dagen na goedkeuring de zoekposities meten (NL, US, GB en de grote nieuwe talen). | Mac-sessie |

## Daarna: de lijst uit de Enigmic-analyse

Volledige tabel in `store/ENIGMIC.md` §6. Wat het meest oplevert en wie het moet doen:

| Actie | Wie |
|---|---|
| Android in Google Play (Enigmic haalt de helft van zijn downloads daar) | Jaimy: Play Console-account ($25) en ID-controle; daarna Claude |
| Gratis Crimson Pass-codes voor kleine TikTok-makers (ES, NL, VS) | Jaimy maakt codes en verstuurt |
| Pers: iPhoned.nl, iCulture.nl, Androidworld.nl (concept in `store/PERS.md`) | Jaimy verstuurt |
| Steunmoment van Van Dam na zaak 10 en aan het eind van de gratis werelden | Claude (cloud kan) |
| Hints verdienen zonder reclame (dagelijkse zaak, reeks van 7) | Claude (cloud kan) |
| iPad-versie met eigen schermafbeeldingen | Claude, indienen op de Mac |
| Voortgang in iCloud, zonder account | Claude (native code, testen op de Mac) |
| Gezinsdeling aan voor de Pass (kan daarna niet meer uit) | Jaimy |
| Apple Small Business Program (15% in plaats van 30%) | Jaimy; stand niet in de repo, nakijken |

## Wat een cloudsessie kan en wat niet

Kan: code, tests (`npm test`, ruim tien minuten), schermafbeeldingen met Chromium, winkelteksten en
vertalingen, documenten, git en pull requests.

Kan niet: bouwen of uploaden (`store/release-ios.sh`), App Store Connect via de API (de sleutel staat in
`~/.appstoreconnect` op de Mac), TikTok Studio, Metricool en Buffer in Chrome, Higgsfield (kost credits;
prijs vooraf noemen).

## Regels die altijd gelden

- Elke puzzel heeft precies één oplossing en is met logica op te lossen; hints verklappen geen antwoord.
- Gebruik nooit de namen MurDoku, Murdle of Cluedo in de app of in winkelteksten.
- Geen reclame, geen account, geen abonnement, geen volg-SDK's.
- Niets publiceren, versturen of indienen zonder akkoord van Jaimy.

# Stand van Crimson Ledger

*Bijgewerkt 10 oktober 2026, op commit 1c71b68. Dit is het startpunt voor een nieuwe sessie: eerst dit
bestand, dan alleen de bestanden die bij de taak horen. Werk het bij aan het eind van elke sessie.*

## Wat live staat

| | Stand | Bron |
|---|---|---|
| iOS-app | Live sinds 22 sep (1.0, build 5), id 6812534368. 1.1 live sinds 3 okt. | `store/OPNAME.md`, `store/social/LOGBOEK.md` |
| Laatste inzending | 1.1.2 (build 10) op 7 okt, met nieuwe winkelteksten (NL "Vind de dader", US "Cozy Whodunnit", GB "Detective Game"). Uitkomst staat niet in de repo: nakijken in App Store Connect. | `store/ASO.md` |
| Code | Staat op 1.1.3, build 11. Die versie is nooit ingediend; alles gaat mee in 1.2. | `package.json`, `meting.js`, Xcode-project |
| Nederland (EU) | De NL-winkel toont de app: op 4 okt is daar de zoekpositie gemeten. De DSA-handelaarsstatus is dus afgerond (afgeleid, niet apart gecontroleerd). | `store/social/LOGBOEK.md` |
| Cijfers | 7 dagen tot 8 okt: 245 vertoningen, 31 paginaweergaven, 7 downloads. 11 nieuwe spelers in de meting, 0 aankopen, 0 beoordelingen. | `store/social/LOGBOEK.md` |
| Featuring | Nominatie "App Enhancements" ingediend op 4 okt. | `store/NOMINATIE.md` |
| Android | Bundel ligt klaar, nog geen Play Console-account. | `store/PLAY-STORE.md` |
| TikTok | @crimsonledger.app. Beste post: carrousel, 235 views. Carrousels 01 t/m 04 van week 2 staan gepland in TikTok Studio; 05 t/m 21 (12 t/m 17 okt) nog niet. | `store/TIKTOK-PLAN.md` §10, `store/social/LOGBOEK.md` |
| Kanaalnaam | "Crimson Ledger · Crime Sudoku". YouTube @crimsonledgerapp heeft hem al; TikTok kan pas vanaf 13 okt wijzigen. Buffer: TikTok gekoppeld, YouTube wacht op Jaimy. | `store/social/LOGBOEK.md` |

## Versie 1.2: klaar in de code

- 20 talen: Nederlands, Engels, de vijftien meest gesproken talen, plus Italiaans, Turks en Koreaans. Eén
  bestand per taal in `i18n/`, zinsbouw per taal, meervoud via `Intl.PluralRules`, rechts naar links voor
  Arabisch en Urdu, letters per schrift.
- Nieuwe namen voor de verdachten (plan §3), met geslacht per verdachte.
- 64 gegraveerde portretten in de stijl van Van Dam (`assets/portretten/`, 1,6 MB).
- Tabler-iconen in plaats van emoji, het beeldmerk op het openingsscherm.
- Smalle schermen (320 en 375 px) zonder overlap; de overloopscan is schoon in alle talen.
- Beoordelingsvraag op drie momenten: tweede opgeloste zaak, 7 dagen op rij, zaak van de week zonder hint
  (`app.js`, `maybeAskReview`).
- Winkelteksten voor 23 winkeltalen in `store/metadata/1.2.0.json`, met het lokale woord voor
  "murder sudoku" in de ondertitel.
- `npm test` is groen op 1c71b68 (10 okt, in een cloudsessie): alle vijftien testbestanden, alle negentien
  taalbestanden.

## Versie 1.2: wat nog moet

| # | Stap | Wie | Kan in de cloud? |
|---|---|---|---|
| 1 | Versie naar 1.2.0 en build 12: `package.json`, `meting.js` (`VERSION`), Xcode (`MARKETING_VERSION`, `CURRENT_PROJECT_VERSION`), Android (`versionName`, `versionCode`). | Claude | Ja |
| 2 | Teksten van de negen in-app-aankopen in de achttien nieuwe talen (naam max. 30 tekens, omschrijving max. 45). Bron: `store/METADATA.md`, onderaan. | Claude | Ja |
| 3 | Schermafbeeldingen per taal, ten minste es, de, pt, it, fr naast nl en en. Volgens Enigmic-actie 4: één zaak van leeg bord tot "Zaak gesloten", een groot getal en "Geen reclame" op beeld 1. | Claude | Ja (`store/make-store-cards.js`, Chromium staat in de container) |
| 4 | Bouwen en uploaden in Xcode. | Jaimy | Nee, vraagt de Mac |
| 5 | Teksten, schermafbeeldingen en aankopen in App Store Connect zetten (`store/asc-release.js`, `store/asc-assets.js`). | Claude op de Mac, of Jaimy | Nee, de API-sleutel staat alleen op de Mac |
| 6 | Nieuwe featuring-nominatie voor 1.2 met 20 talen, minstens drie weken vooruit. | Claude op de Mac, na akkoord | Nee |

## Daarna: de lijst uit de Enigmic-analyse

Volledige tabel in `store/ENIGMIC.md` §6. Wat het meest oplevert en wie het moet doen:

| Actie | Wie |
|---|---|
| Android in Google Play (Enigmic haalt de helft van zijn downloads daar) | Jaimy: Play Console-account ($25) en ID-controle; daarna Claude |
| Gratis Crimson Pass-codes voor kleine TikTok-makers (ES, NL, VS) | Jaimy maakt codes en verstuurt |
| Pers: iPhoned.nl, iCulture.nl, Androidworld.nl (concept in `store/PERS.md`) | Jaimy verstuurt |
| Steunmoment van Van Dam na zaak 10 en aan het eind van de gratis werelden | Claude |
| Hints verdienen zonder reclame (dagelijkse zaak, reeks van 7) | Claude |
| iPad-versie met eigen schermafbeeldingen | Claude, indienen door Jaimy |
| Voortgang in iCloud, zonder account | Claude (native code, testen op de Mac) |
| Gezinsdeling aan voor de Pass (kan daarna niet meer uit) | Jaimy |
| Apple Small Business Program (15% in plaats van 30%) | Jaimy; stand niet in de repo, nakijken |

## Wat een cloudsessie kan en wat niet

Kan: code, tests (`npm test`, ruim tien minuten), schermafbeeldingen met Chromium, winkelteksten en
vertalingen, documenten, git en pull requests.

Kan niet: bouwen in Xcode, App Store Connect via de API (de sleutel staat in `~/.appstoreconnect` op de Mac),
TikTok Studio, Metricool en Buffer in Chrome, Higgsfield (kost credits; prijs vooraf noemen).

## Regels die altijd gelden

- Elke puzzel heeft precies één oplossing en is met logica op te lossen; hints verklappen geen antwoord.
- Gebruik nooit de namen MurDoku, Murdle of Cluedo in de app of in winkelteksten.
- Geen reclame, geen account, geen abonnement, geen volg-SDK's.
- Niets publiceren, versturen of indienen zonder akkoord van Jaimy.

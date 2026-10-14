# Stand van Crimson Ledger

*Bijgewerkt 14 oktober 2026, op `main` 51bd7ca. Dit is het startpunt voor een nieuwe sessie: eerst dit
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
| 14 okt | cloud, branch `claude/kind-feynman-ocvzz9` | Nieuw logo. Onderzoek klaar, tien Higgsfield-opdrachten staan in `art/logo/prompts.js`. Mac-sessie van 14 okt: tien proeven gemaakt (ruw in `art/logo/ruw/`, buiten git), keuzeblad als artifact https://claude.ai/artifact/24rYzVVMmRLwbHn8v2N7F7. Jaimy vindt ze alle tien niet mooi. Nieuwe stap: 38 echte App Store-iconen als referentie (https://claude.ai/artifact/7M4goug6WXKVxWVHkR2GHz); Jaimy koos nr. 2, Detective Files: Mystery Cases (cartoon van dichtbij, dikke lijnen, warme kleuren, sfeervol decor). Ronde 2: acht proeven met Van Dam in die stijl (`node art/logo/prompts.js ronde2`, blad met `node art/logo/blad.js ronde2`), op hetzelfde keuzeblad gezet. **Jaimy koos op 14 okt `r2-rode-draad`** (Van Dam, achterdochtig, hand aan zijn snor, bord met rode draad). Ingezet in app, startscherm, web, Android en TikTok-avatar; versie 1.2.1 (13). Pas dan worden de iconen vervangen. | `art/logo/`, later `icon-*.png`, `resources/`, `ios/App/App/Assets.xcassets/`, `android/app/src/main/res/`, het `splash-mark` in `index.html`, `store/social/tiktok-avatar.png` |

## Voor de Mac-sessie

Klaargezet door een cloudsessie op 14 okt. Doe het in deze volgorde, zonder tussendoor te vragen:

1. `git pull`.
2. **Aankoopteksten:** `node store/asc.js iap-locs` (met de sleutel uit `~/.appstoreconnect`). Meld per taal
   "toegevoegd" of "MISLUKT", en zet het resultaat in `store/social/LOGBOEK.md`.
3. **Logo-proeven:** `node art/logo/prompts.js` geeft tien opdrachten. Maak ze meteen in Higgsfield
   (gpt_image_2_5, high, 1k, 1:1); Jaimy heeft een abonnement, dus je hoeft niet eerst naar de kosten te vragen.
   Geef bij elke opdracht met `referentie: assets/vandam.jpg` dat portret mee als referentiebeeld.
4. Download elk beeld met `art/logo/haal.sh <id> <url>`, maak het keuzeblad met `node art/logo/blad.js` en laat
   `art/logo/blad.html` aan Jaimy zien (bijvoorbeeld als artifact). De ruwe beelden blijven buiten git.
**Gedaan op 14 okt (Mac):** stap 2 (189 aankoopteksten toegevoegd, 17 bestaande nl/en op slot, zie `store/social/LOGBOEK.md`), stap 3 en 4 (tien proeven, keuzeblad als artifact, link in de tabel hierboven). Open: stap 5.

5. Zet de keuze van Jaimy hier in het overzicht. Het vervangen van de iconen (app, startscherm, winkel, kanalen)
   en versie 1.2.1 volgen daarna.

## Wat live staat

| | Stand | Bron |
|---|---|---|
| iOS-app | Live sinds 22 sep (1.0, build 5), id 6812534368. 1.1 live sinds 3 okt. | `store/OPNAME.md`, `store/social/LOGBOEK.md` |
| 1.1.2 | Goedgekeurd op 7 okt (mail van App Store Connect). | `store/ASO.md` |
| 1.2 bij Apple | Build 1.2.0 (12) op TestFlight op 12 okt. **Goedgekeurd op 13 okt** om 12:09 (mail "Review of your Crimson Ledger: Crime Sudoku submission is complete"). Of hij automatisch is vrijgegeven, staat niet in de mail. | mailbox van het ontwikkelaarsaccount |
| Nederland (EU) | De NL-winkel toont de app (zoekposities gemeten op 4 en 12 okt). | `store/social/LOGBOEK.md` |
| Cijfers | 7 dagen tot 8 okt: 245 vertoningen, 31 paginaweergaven, 7 downloads, 0 aankopen, 0 beoordelingen. 12 okt: "moordmysterie" van plek 2 naar 4, mogelijk door de NL-naam van 1.1.2 (niet gemeten). | `store/social/LOGBOEK.md` |
| Featuring | Nominatie "App Enhancements" ingediend op 4 okt. | `store/NOMINATIE.md` |
| Android | Bundel ligt klaar (`versionName` 1.2.0), nog geen Play Console-account. | `store/PLAY-STORE.md` |
| TikTok | Carrousels via Metricool haalden bereik (237, 268, 78 views); de vier die rechtstreeks in TikTok Studio zijn gepland, bleven op 0. Te testen: de route van plaatsen. Formaat C (uitleg) vervalt. Op 13 okt niet gemeten (Chrome niet verbonden). | `store/social/LOGBOEK.md` |
| Kanaalnaam | "Crimson Ledger · Crime Sudoku". YouTube heeft hem; TikTok kan sinds 13 okt worden aangepast. | `store/social/LOGBOEK.md` |

## Versie 1.2: goedgekeurd op 13 okt

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

## Na 1.2: wat nog moet

| # | Stap | Wie |
|---|---|---|
| 1 | Aankoopteksten naar App Store Connect (stap 2 hierboven). **Gedaan 14 okt** voor 20 winkeltalen. Apple beoordeelt gewijzigde aankoopteksten; ze kunnen mee met versie 1.2.1, samen met het nieuwe logo. | Mac-sessie, Jaimy klikt ja |
| 2 | Nieuwe featuring-nominatie voor 1.2 met 20 talen, minstens drie weken vooruit. | Mac-sessie, na akkoord van Jaimy |
| 3 | 7 en 14 dagen na goedkeuring de zoekposities meten (NL, US, GB en de grote nieuwe talen). | Mac-sessie |

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
`~/.appstoreconnect` op de Mac), TikTok Studio, Metricool en Buffer in Chrome, Higgsfield (alleen op de Mac gekoppeld; Jaimy heeft een
abonnement).

## Regels die altijd gelden

- Elke puzzel heeft precies één oplossing en is met logica op te lossen; hints verklappen geen antwoord.
- Gebruik nooit de namen MurDoku, Murdle of Cluedo in de app of in winkelteksten.
- Geen reclame, geen account, geen abonnement, geen volg-SDK's.
- Niets publiceren, versturen of indienen zonder akkoord van Jaimy.

# Plan 1.4 en 1.5: acht nieuwe werelden (20 oktober 2026)

Aanleiding (Jaimy, 20 okt): "512 zaken" is geen sterke haak; er moeten minstens 200 zaken bij, in nieuwe werelden die we ontwerpen.
Jaimy koos op 20 okt alle acht voorgestelde werelden. Elke wereld volgt de vaste opbouw: 8 delen x 8 zaken = 64 zaken, 8 verdachten.
Acht werelden = 512 zaken erbij, 1.024 in totaal.

| # | Wereld (werktitel) | Tijd en plek | Waarom |
|---|---|---|---|
| 9 | Hacienda | Mexico, 1950: wijngaard, patio, bodega | Spanje en Latijns-Amerika zijn ons grootste publiek |
| 10 | Opera | Parijs, 1890: coulissen, kleedkamers, orkestbak | Klassieke whodunit-sfeer |
| 11 | Opgraving | Egypte, 1922: graftombe, tenten, kampvuur | Avontuur, sterk beeld voor video |
| 12 | Casino | Monte Carlo, 1960: speelzaal, kluis, terras | Glamour; VS en VK |
| 13 | Filmstudio | Hollywood, 1930: decors, montagekamer, kleedkamer | Groot in de VS |
| 14 | Bazaar en karavaan | Oase: markt, karavanserai, tenten | Downloads uit Saoedi-Arabië |
| 15 | Abdij | Middeleeuwen: scriptorium, kapel, kruidentuin | Klassiek kloostermysterie |
| 16 | Vuurtoreneiland | 1900: vuurtoren, steiger, wachtershuis | Storm, eiland, niemand kan weg |

## Wat één wereld vraagt (gemeten aan De Skihut)
1. **Ontwerpblad** (eerst, Jaimy keurt goed): titel, korte naam, tagline, intro, slachtoffer, kleur van de kaart, 4-6 kamers met
   meubels, 8 verdachten (naam, korte naam, geslacht, kleur, uiterlijk), bodemsoort. Bron: `themes.js` (~28 regels per wereld).
2. **Portretten**: 8 gravures in de vaste stijl (`art/portretten/prompts.js`, Higgsfield gpt_image_2_5, high, 1k, 1:1, Van Dam als
   stijlreferentie). Credits: 270 beschikbaar op 20 okt; de prijs per beeld toont Higgsfield bij het maken. Eerst noemen, dan Jaimy's ja.
3. **Kaart**: banner en kleur in `mapart.js`; plek op het kronkelpad.
4. **Campagne**: 8 delen met titel, intro en slot; 64 zaken met titel, verhaaltje van één zin, bewijsstuk, moeilijkheid en seed
   (`campaign.js`). Elke seed door de engine laten bewijzen (één oplossing, zonder gokken).
5. **Vertalingen**: alle teksten in 19 talen, plus de woordvormen voor kamers en meubels die de zinsbouw per taal vraagt; de tests
   (`tests/i18n-*.test.js`, `names.test.js`, `english.test.js`) moeten groen. Gebruik `docs/TRANSLATION-BRIEF.md`.
6. **Winkel**: aankoop per nieuwe wereld (en opnemen in de Crimson Pass), teksten in 23 talen, schermafbeeldingen bijwerken, wat-is-nieuw.
   Nieuwe aankopen gaan mee met de review van de versie.
7. **Testen** in de browser en op de simulator; daarna bouwen en indienen (`store/release-ios.sh`, `store/asc-release.js`).

## Volgorde
- Per wereld eerst het ontwerpblad naar Jaimy (één pagina met kleur, kamers, verdachten); pas na zijn ja portretten en zaken.
- Twee werelden tegelijk ontwerpen, zodat er niet acht keer dezelfde fout in zit (vakmanschap §1, één categorie tegelijk).
- Winkeltekst: geen getal als haak ("1.024 zaken" alleen in de beschrijving), wel "elke dag een nieuwe zaak" en de werelden.
EOF

## Stand
- 20 okt: ontwerpbladen Hacienda (wereld 9) en Opera (wereld 10) klaar in `docs/werelden/` (`ontwerp.js` met de gegevens,
  `ontwerpblad.html` toont ze met een echt bord uit de motor, `blad-*.jpg` voor de telefoon). Nieuw: tien meubeliconen en twee
  vloeren (`tegels`, `parket`). De motor maakt per wereld 48 van 48 zaken over alle vier niveaus. Wacht op Jaimy's ja.
- 20 okt, later: Jaimy keurde beide werelden goed ("Opera mag iets aantrekkelijker": fluweelrood met goud, rijkere kamerkleuren,
  toneelkijker in plaats van lessenaar, nieuwe tagline). 128 zaken geschreven (seeds 101101+ en 111101+), nu in `campaign.js`. Portretten: na Jaimy's ja gemaakt, 24 credits
  (saldo nu 246,76); `assets/portretten/{hacienda,opera}-<n>.webp`, uitgesneden met `art/portretten/snij.py`.
- 20-21 okt: beide werelden ingebouwd: `themes.js`, `campaign.js` (640 zaken), `avatars.js` (10 meubels), `style.css`
  (vloeren `tegels`, `parket`, kaartachtergrond), `mapart.js` (banner en 7 decoraties), `progress.js` (weektitels, rotatie
  over 10 werelden, medaille). Board.js bewaart een weekzaak nu per week én wereld. Engels zelf geschreven; de 18 andere talen
  elk door een vertaalagent en een tweede agent nagelezen (`docs/werelden/VERTAALOPDRACHT-1.4.md`, bron `bron-1.4.json`).
  `npm test` volledig groen.
- 21 okt: aankopen `nl.crimsonledger.app.world.hacienda` (6825075336) en `.world.opera` (6825075487) aangemaakt met
  `store/asc-iap-wereld.js`: niet-verbruikbaar, € 1,99 met Nederland als basis (zelfde prijzen als De Skihut), 175 landen,
  23 talen, reviewscreenshot `store/screenshots/review-<wereld>.png`. De Crimson Pass hoeft niet te veranderen: de app geeft
  elke betaalde wereld vrij met de Pass. Ze gaan mee met de review van 1.4 (`node store/asc.js submit`).
  Nog te doen: wat-is-nieuw, winkeltekst en schermafbeeldingen bijwerken (aantallen werelden), en daarna wereld 11 tot en met 16.
- 21 okt: ontwerpbladen wereld 11 "Het Graf van Nefer-Ankh" (Egypte 1922, lapis met goud, vloer `zandsteen`) en wereld 12
  "Casino Azur" (Monte Carlo 1960, groen vilt met goud, vloer `ruiten`) in `docs/werelden/ontwerp.js`; het blad toont nu
  alleen werelden die nog niet in de app staan (`?alle` toont alles). Motor: 48/48 per wereld. Wacht op Jaimy's ja.
  Losse fix: korte naam houdt een voorvoegsel ("Barones Von Stahl" → "Von Stahl", stond als "Von" op het bord).
- 21 okt: Jaimy keurde wereld 11 en 12 goed. 16 portretten gemaakt (24 credits, saldo 222,76), uitgesneden naar
  `assets/portretten/{opgraving,casino}-<n>.webp`. 128 zaken in `docs/werelden/zaken.js` (seeds 121101+ en 131101+),
  `node docs/werelden/bewijs.js` bewijst ze alle 128. Volgende stap voor deze twee: inbouw en vertalingen, zoals bij 9-10.

- 21 okt: wereld 11 en 12 ingebouwd zoals 9-10: `themes.js`, `campaign.js` (768 zaken), `avatars.js`, `style.css` (vloeren
  `zandsteen`, `ruiten`), `mapart.js`, `progress.js`; Engels zelf geschreven, de 18 andere talen elk door een vertaalagent en een
  nalezer (`bron-opgraving-casino.json`, inhoudsnotities N = 21 in de vertaalopdracht). De huisdetective Nora heet nergens zoals
  de rang van de speler (bijvoorbeeld "Enquêtrice Nora", "Jefa de seguridad Nora"). Losse fix: Spaans circus en opera zeggen
  nu "el despacho" (was "El director … en el despacho del director"). `npm test` volledig groen; Frans casino en Japans graf
  in de browser bekeken.
- 21 okt: wereld 13-16 (Filmstudio, Karavaan, Abdij, Vuurtoren): ontwerp in `ontwerp.js`, 32 portretten (48 credits, saldo
  174,76) in `assets/portretten/`, vloeren en kaartachtergronden in `style.css`. 256 zaken in `docs/werelden/zaken-13-14.js` en
  `zaken-15-16.js` (seeds 141101+ tot 171101+), alle 256 bewezen. Engels voor thema's en campagne staat klaar (nog buiten de app).
  Volgende stap: inbouw en vertalingen, zoals bij 11-12.
- 21 okt: aankopen `nl.crimsonledger.app.world.opgraving` (6825097935) en `.world.casino` (6825098062) aangemaakt op dezelfde
  manier, READY_TO_SUBMIT, met reviewscreenshot.
- 21-22 okt: wereld 13-16 ingebouwd: `themes.js` (16 werelden, titelwoorden NL/EN), `campaign.js` (1.024 zaken), `progress.js`
  (weektitels, rotatie over 16 werelden, 4 medailles, 32 in totaal); Engels in `en.js`. De 18 andere talen in twee rondes per
  taal (N = 22 Filmstudio en Karavaan, N = 23 Abdij en Vuurtoren), elk door een vertaler en een nalezer
  (`bron-filmstudio-karavaan.json`, `bron-abdij-vuurtoren.json`). Nieuw in de pakkettest: `I18N_SKIP_WORLDS=…` slaat werelden
  over die een vertaler nog niet heeft. Losse fix: Spaans graf zegt «la explanada de la fogata» (geen dubbele «zona»).
  `npm test` volledig groen; Arabische karavaan (RTL) en Duitse abdij in de browser bekeken.
- 22 okt: aankopen `.world.filmstudio` (6825110776), `.world.karavaan` (6825111119), `.world.abdij` (6825111281) en
  `.world.vuurtoren` (6825111505), READY_TO_SUBMIT. Winkeltekst 1.4 (beschrijving met 16 werelden en wat-is-nieuw) in 23 talen
  in `store/metadata/1.4.0.json`, elke beschrijving onder 4.000 tekens. Nog te doen: schermafbeeldingen, build, indienen
  zodra 1.3.1 door de review is.
- 22 okt: winkelscreenshots 6,5" opnieuw gemaakt in 20 talen (`make-screenshots.js`, `make-store-cards.js`); kaartteksten
  zonder zaakaantal als haak: "Zestien werelden, één kronkelpad / Van makkelijk naar moeilijk, van Luxor tot Hollywood" en
  "Tweeëndertig onderscheidingen". Uploaden met `node store/asc-assets.js screenshots 1.4.0` zodra versie 1.4.0 bestaat.
- 22 okt: versie 1.4.0 (16) gebouwd en geüpload (`store/release-ios.sh`). Versie 1.4.0 aanmaken in App Store Connect kan nog
  niet: 1.3.1 (15) staat sinds 20 okt op WAITING_FOR_REVIEW ("You cannot create a new version of the App in the current state").

## Indienen zodra 1.3.1 door de review is
1. `node store/asc-release.js status` → 1.3.1 is READY_FOR_SALE (of afgewezen).
2. `node store/asc-release.js prepare 1.4.0 16 store/metadata/1.4.0.json` (versie, build 16, wat-is-nieuw).
3. `node store/asc-release.js metadata 1.4.0 store/metadata/1.4.0.json` (beschrijving in 23 talen).
4. `node store/asc-assets.js screenshots 1.4.0` (kaarten uit `store/cards-65*`).
5. `node store/asc.js submit` met de acht wereldaankopen (hacienda, opera, opgraving, casino, filmstudio, karavaan, abdij,
   vuurtoren), dan `node store/asc-release.js submit 1.4.0`. Controleer daarna welke build eraan hangt.

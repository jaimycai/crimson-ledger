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
  toneelkijker in plaats van lessenaar, nieuwe tagline). 128 zaken staan in `docs/werelden/zaken.js` (vorm van `CAMPAIGN`,
  seeds 101101+ en 111101+); `node docs/werelden/bewijs.js` bewijst ze alle 128. Ze gaan pas naar `campaign.js` en `themes.js`
  samen met de vertalingen, zodat de tests groen blijven. Portretten: 1,5 credit per stuk, 24 voor 16 (saldo 270,76); wacht op ja.

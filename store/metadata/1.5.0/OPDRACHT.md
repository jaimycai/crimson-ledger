# Opdracht: de winkelpagina van 1.5 per taal (31-10-2026)

Jaimy, 31-10: "onze landing page moet perfect zijn in elke taal zodat we een hoge conversie hebben."

## Waarom

App Store Connect, 16-29 okt: 11.918 vertoningen (99% via zoeken) → 537 paginabezoeken (4,5%) → 122 downloads (1,0%).
52 van die 122 downloads kwamen rechtstreeks uit het zoekresultaat, zonder de pagina te openen. In een zoekresultaat
ziet iemand alleen: icoon, **naam**, sterren, en de **eerste drie schermafbeeldingen**. Per land:

| Winkel | Vertoningen | Download per vertoning |
|---|---|---|
| VS | 2.674 | 0,67% |
| Saoedi-Arabië | 2.078 | 0,63% |
| Japan | 1.425 | 0,28% |
| Brazilië | 745 | 0,13% |
| Mexico | 712 | 0,84% |
| Turkije | 567 | 0,35% |
| Frankrijk | 501 | 2,8% |
| Colombia | 342 | 2,1% |
| Nederland | 292 | 4,8% |
| Spanje | 217 | 3,7% |

Oorzaken en concurrentie per land staan in `store/CONVERSIE.md`; de verkoopstijl (Supercell, geen "koop") in
`store/TEKST-1.4.1.md`. Lees beide eerst.

## Wat jij levert, per winkeltaal die je krijgt

1. `store/metadata/1.5.0/<locale>.json` met precies deze velden:
   `{ "name", "subtitle", "keywords", "promotionalText", "description", "whatsNew" }`
2. Voor elke app-taal die je krijgt: `store/cards-text/<taal>.json` (de onderschriften van de negen
   schermafbeeldingen), in hetzelfde formaat als nu.

Schrijf niets anders, commit niets, draai geen App Store Connect-scripts.

## Feiten (moeten kloppen, nergens meer of minder beloven)

- 16 werelden, 1.024 zaken, elke dag een nieuwe zaak, een zaak van de week op meesterniveau.
- **240 zaken gratis**: twee hele werelden (Het Landhuis, Het Piratenschip; 128 zaken) plus **deel I (8 zaken) van
  elke andere wereld** (14 × 8 = 112). Dat is nieuw in 1.5: je kunt elke wereld gratis proberen.
- **Hints verdienen** (nieuw in 1.5): iedereen begint met 10 hints en krijgt er één bij voor elke zaak die voor het
  eerst drie sterren haalt. Daarnaast nog steeds 3 hints per dag gratis.
- **Gratis hint als je vastzit** (nieuw in 1.5): in de eerste zaken is de volgende hint gratis na een minuut zonder zet.
- **Delen zonder spoilers** (nieuw in 1.5): de deelkaart toont sterren en tijd, niet de oplossing, met een link.
- **Nu ook op de iPad** (nieuw in 1.5).
- Hints leggen uit, verklappen nooit. Elke zaak heeft precies één oplossing, zonder gokken.
- Geen reclame, geen abonnement, geen account, werkt offline. 20 talen in het spel. 32 onderscheidingen.
- De Crimson Pass opent alles in één keer (één aankoop, geen abonnement). Zeg nooit "koop"/"buy" in de verkopende
  tekst; geld staat hooguit één keer neutraal in de beschrijving, zoals nu.

## Regels

- **Naam** max 30 tekens, **ondertitel** max 30, **zoekwoorden** max 100 tekens, komma's zonder spaties,
  **promotietekst** max 170, **beschrijving** en **wat is er nieuw** max 4.000.
- Begin bij het voorstel in `store/metadata/1.5.0-namen.json` (genrewoord in de naam). Verbeter het als je op grond
  van het zoekresultaat in jouw winkel iets beters vindt, en zeg dan waarom.
- Zoekwoorden: geen woorden die al in naam of ondertitel staan (Apple telt die al mee), geen meervoud naast enkelvoud,
  geen merknamen van anderen (geen Murdle, Cluedo, Enigmic, Tiny Crimes, MurDoku), geen "gratis/free", geen
  "app/game" als dat in de categorie al vanzelf spreekt.
- Naam en ondertitel: geen "gratis/free", geen prijs, geen "#1"/"beste" (Apple 2.3.7).
- Schrijf als een moedertaalspreker die copywriter is, niet als vertaler. Korte zinnen, actief, concreet. Gebruik de
  woorden die spelers in jouw land echt typen en zeggen. Behoud de toon van het spel (gezellige detective, geen gore).
- **Promotietekst**: de haak. Eén idee: "Elke wereld nu gratis te proberen: 240 zaken" of beter, in jouw taal.
- **Beschrijving**: neem de huidige van je taal (`store/metadata/1.4.1.json`) als basis. Eerste drie regels zijn wat
  mensen zien vóór "meer": maak die het sterkst (wat is het spel, waarom eerlijk, 240 gratis, geen reclame). Werk de
  feiten bij (240 gratis, hints verdienen, iPad). Kopjes in hoofdletters met een werkwoord.
- **Wat is er nieuw**: als een evenement, zoals in 1.4.1. Titel voor de update, dan per nieuw ding één regel met een
  uitroep. Inhoud: elke wereld gratis proberen (240 zaken), hints verdienen, gratis hint bij vastzitten, delen zonder
  spoilers, iPad, kleine verbeteringen. Kort.
- **Onderschriften schermafbeeldingen** (`store/cards-text/<taal>.json`): negen regels
  `[bestand, kop, onderregel]`; kop 2-4 woorden, `\n` = vaste regelbreuk, `*woord*` = accentkleur. Beeld 1 moet in jouw
  taal zeggen dat dit een sudoku met een moord is (het genrewoord dat mensen zoeken). Beeld 3 (`08-nieuw`): zet er
  **240 gratis** in (nu staat er 128). De eerste drie beelden zijn wat in het zoekresultaat staat: maak die het
  duidelijkst. Bestandsnamen en volgorde niet veranderen.

## Onderzoek dat je doet (kort, per winkel)

- Zoekresultaat van je winkel voor het genrewoord en één of twee varianten:
  `curl -s "https://itunes.apple.com/search?term=<woord>&country=<land>&entity=software&limit=15"` en kijk naar
  `trackName` en de eerste regels van `description` van de top 10. Waar staan wij (`trackId` 6812534368)? Welke woorden
  gebruiken de nummers 1-3 in hun naam?
- Lees je eigen tekst daarna als een speler die het zoekresultaat ziet: zou jij tikken?

## Controle (moet slagen voor je klaar bent)

- `node store/metadata/check-1.5.js <locale> [<locale> ...]` — lengtes, zoekwoorden, verplichte feiten.
- `node store/make-store-cards.js 6.5 <taal>` — de onderschriften moeten passen (het script meldt het als een kop niet
  in drie regels past). Er draait een server op http://127.0.0.1:8094. Bekijk daarna zelf beeld 1-3 in
  `store/cards-65-<taal>/` (Nederlands: `store/cards-65/`).

## Wat je terugmeldt

Per winkeltaal: de naam en ondertitel, de promotietekst, de kop van beeld 1-3, wat je veranderde ten opzichte van het
voorstel en waarom (met de zoekresultaten die je zag), en twijfels die een moedertaalspreker zou moeten nakijken.

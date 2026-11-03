# De Engelse eerste minuut: waarom Engelse nieuwe spelers afhaken (3 november 2026)

Vervolg op `docs/onderzoek/AHA-2026-11.md` §4 ("Engels valt uit de toon, al vóór de eerste zaak"). Bronnen: de ruwe
tellerrijen (`/stats?days=365`, 2 okt t/m 3 nov 2026, alleen iOS), `node store/meting-aha.js`, en een speelronde in
headless Chrome van splash tot het bord van zaak 1, in het Engels, Nederlands en Duits, op 390×844 en 375×667, voor de
live versie 1.4.1 (`git archive 1135dab`) en voor 1.6.0 (HEAD `6c810a9`, nu bij Apple). Alleen onderzocht, niets in de
app veranderd. Bewijsbeelden en de twee scripts staan in `docs/onderzoek/eerste-minuut-en/`.

## In het kort

1. **Een derde van de "Engelse nieuwe spelers" is geen speler maar een Apple-toestel.** 18 van de 52 Engelse eerste
   starts vallen op een versie die het publiek die dag nog niet had (of nooit kreeg) of op een verouderde versie. Samen:
   0 oefenzaken, 0 zaken, 0 keer terug, wel 12 keer de winkel geopend. Precies wat App Review doet. Zonder hen maakt
   **50%** van de Engelse spelers de oefenzaak af in plaats van 33%. Dat is ruim een derde van het gat.
2. **Het gat dat overblijft zit niet in de Engelse app.** De Engelse eerste minuut werkt in de speelronde precies zoals de
   Nederlandse en de Duitse: de kortste teksten, geen Nederlands, niets afgesneden, het doelvakje nooit bedekt, de
   taalkeuze klopt voor en-US, en-GB en en-IN. Het verschil zit op elke trede (ook van zaak 3 naar dag 1: 2 van 10 tegen
   35 van 67). Dat past bij een ander publiek, niet bij één blokkade in de oefenzaak. Wie dat publiek is, kunnen de tellers
   niet zeggen (§4.2).
3. **Een fout die iedereen raakt, in elke taal: het midden van de startknop doet niets.** De onzichtbare laadbalk ligt
   na het laden nog over de knop. Live (1.4.1) is 14% van de knop dood, precies in het midden; in 1.6.0 is het 37%,
   omdat de statusregel er nu ook overheen ligt. Met één CSS-regel is dat weg (getest).
4. **Kleinste fixes**, op volgorde (§5): (a) sandbox-toestellen (App Review, TestFlight) niet meer als speler tellen,
   (b) `pointer-events: none` op laadbalk en statusregel, (c) oefenzaak stap 1 en 2 met de handeling vooraan,
   (d) bij de eerste start de apparaatregio meesturen, zodat we weten wie "Engels" is.

## 1. Wat de tellers zeggen

### 1.1 Wie zitten er in de Engelse groep

| Groep (iOS, 2 okt – 3 nov) | Eerste starts | Oefenzaak af | Zaak 1 | Zaak 3 | Terug dag 1 | Winkel geopend |
|---|---|---|---|---|---|---|
| Engels, Apple-toestellen (zie onder) | 18 | 0 (0%) | 0 | 0 | 0 | 12 |
| Engels, overig | 34 | 17 (**50%**, 95%-int. 34–66%) | 15 (44%) | 10 (29%) | 2 (**6%**, 2–19%) | 7 |
| Alle andere talen | 136 | 108 (**79%**, 72–85%) | 80 (59%) | 67 (49%) | 35 (**26%**, 19–34%) | 41 |
| Andere talen zonder Nederlands | 113 | 92 (81%) | 67 (59%) | – | 27 (24%) | – |

Verschil Engels-overig tegen de rest: oefenzaak p = 0,001, dag 1 p = 0,01 (Fisher). Met de Apple-toestellen erbij
(17 van 52 tegen 108 van 136) p < 0,000001. Het gat is dus echt, maar half zo groot als het leek.

**Hoe de Apple-toestellen herkend zijn** (dag | versielabel | aantal; versielabels uit `Meting.version()`):

- *Versie nog niet bij het publiek:* 2-10 · 1.1 · 2 (1.1 live op 3 okt); 4-10 · 1.1.1 · 1; 7-10 · 1.1.2 · 1 (goedgekeurd
  7 okt); 12-10 · 1.1.3 · 2 (= 1.2.0, goedgekeurd 13 okt); **20-10 · 1.3.1 · 1** (1.3.1 is nooit uitgebracht, op 22 okt
  ingetrokken: dit kan alleen de reviewer zijn); 21-10 · 1.4.0 · 1 en 22-10 · 1.4.0 · 2 (ingediend 22 okt); 25-10 ·
  1.4.1 · 1 (eerste niet-Engelse 1.4.1-speler pas op 27 okt); **3-11 · 1.6.0 · 2** (in review sinds 3 nov 00:40). Samen 13.
- *Verouderde versie* (de winkel gaf toen al een nieuwere): 8-10 en 15-10 · 1.1; 10-10, 16-10 en 23-10 · 1.1.1. Samen 5.
  Ook hier: alleen de winkel open (5 keer), 0 oefenzaken. Vermoedelijk Apple die iets anders beoordeelt met de live
  build (aankopen, het In-App Event, de A/B-test van de productpagina).
- Het patroon: **elke versie begint op iOS met Engelse eerste starts, vóór welke andere taal ook**, en die openen de
  winkel (`store_open cosmetics`/`world`) in plaats van te spelen. `store/REVIEW-NOTES.txt` stuurt de reviewer ook
  naar Instellingen → Winkel.
- Niet afgetrokken (twijfel): 9-10 · 1.1.2 (vóór de eerste NL-speler, maar loste zaken op en deelde 3 keer, dus een
  echte speler); 13-10 en 14-10 · 1.1.3 (winkel open, geen oefenzaak; 1.2.1 en 1.3.0 lagen toen bij Apple onder
  hetzelfde label). Zijn dat ook reviewers, dan zakt het echte Engelse gat nog iets.

Gevolg voor de hele AHA-analyse: van de 188 nieuwe iOS-spelers zijn er ~170 echt. Oefenzaak af wordt dan 74% (niet 66%)
en dag 1 22% (37 van 168, niet 20%).

### 1.2 Op welke stap haken ze af?

De tellers per stap (`tut_step`, `tut_skip`, `quit`) zitten pas in 1.5/1.6 (`board.js:96-117`, `board.js:724-727`).
1.5 is nooit uitgebracht en 1.6.0 ligt nog bij Apple, dus **van echte spelers is er nog geen enkele stapmeting**. Wat er is
(allemaal 3 november, 1.6.0):

| Taal | Eerste starts | `tut_step` | `tut_skip` | `quit` |
|---|---|---|---|---|
| en | 2 | stap 1: 2 | – | `tutorial 1`: 2 |
| vi | 0 | stap 1: 2, stap 2: 1 | bij stap 2: 1 | – |
| id | 0 | stap 1: 1 | – | `tutorial 1`: 1, `daily`: 1 |

`quit tutorial 1` is een tik op ← bij stap 1 (`app.js:151` → `Board.countQuit`). De twee Engelse zijn de reviewers van
1.6.0: oefenzaak open, ← terug, verder niets. De vi- en id-rijen hebben geen eerste start, dus bestaande installaties
(eigen toestellen of testers). Conclusie: **"afhaken bij stap 1" is in de Engelse data tot nu toe alleen App Review.**

### 1.3 Een meetfout die Engels groter maakt dan het is

"Overslaan" stuurt geen `tutorial_done` (`board.js:111-117`; sinds 1.5 alleen `tut_skip`). Wie overslaat en meteen
speelt, telt dus als "oefenzaak niet af". In de Engelse groep wijst daar iets op: zaak 1 / oefenzaak = 15/17 = 0,88
tegen 80/108 = 0,74 bij de rest, en er zijn Engelse dagen met 0 oefenzaken maar wel gespeelde zaken (15-10: 0 oefenzaken,
4 gestart, 2 opgelost, 4 hints). Een deel van de Engelse "uitval" is overslaan-en-spelen. Na 1.6 is dat te zien met
`tut_skip`; tot dan: oefenzaak af + `tut_skip` samen tellen als "door de oefenzaak heen".

## 2. De speelronde

**Opzet.** Puppeteer met Chrome for Testing 153, iPhone-user-agent plus `CrimsonSimulator` (dus geen tellers) en alle
verzoeken buiten de testserver afgebroken; aanraaktikken in het midden van elk element, met controle wat er onder de
vinger ligt (`elementFromPoint`); `prefers-reduced-motion: no-preference`; lege localStorage; `crimson-lang` = en, nl, de;
390×844 en 375×667; 1.4.1 en 1.6.0. Twaalf rondes, plus drie met taalherkenning in plaats van een vaste taal
(en-US, en-IN, pl-PL). Elke ronde: splash → Start → oefenzaak stap 1-4 → "Goed gedaan!" → Volgende zaak → briefing →
"Nieuw in dit deel" → bord van zaak 1. Alle vijftien rondes kwamen zonder fout tot het bord van zaak 1.

| 1.4.1, 375×667 (iPhone SE/8) | Engels | Nederlands | Duits |
|---|---|---|---|
| Startknop | Start | Begin | Start |
| Stap 1, tekst | 169 tekens, 31 woorden, **5 regels** | 182 tekens, 6 regels | 178 tekens, 7 regels |
| Stap 2, tekst | 132 tekens, 4 regels | 134 tekens, 5 regels | 140 tekens, 6 regels |
| Stap 3 noemt de knop | "Tap Check." = knop **Check** | "Tik op Controleer." = Controleer | "Tippe auf Prüfen." = Prüfen |
| Doelvakje stap 1 en 2 | 50 px, in beeld, niet bedekt | idem | idem |
| Coachkaart over het doel? | nee | nee | nee |
| Bordscherm bij stap 1 | 722 px hoog (55 px scrollen) | 742 px | 762 px |
| Gereedschap en Controleer bij stap 1-2 | onder de vouw | onder de vouw | onder de vouw |
| Bij stap 3 | past (667 px), Check in beeld | idem | idem |
| Beschuldiging, beide namen | in beeld, niet bedekt | idem | idem |
| "Volgende zaak" na de oefenzaak | in beeld | in beeld | in beeld |
| Zichtbaar Nederlands | 0 | – | 0 |
| Splash klaar / stap 1 in beeld | ~1,0 s / ~1,9 s na openen | idem | idem |

Beelden: `eerste-minuut-en/141-en-375-stap1.png`, `141-nl-375-stap1.png`, `141-de-375-stap1.png` (zelfde opbouw,
Engels één regel korter), `141-en-375-stap4.png`, `141-en-375-goed-gedaan.png`, `141-en-390-briefing-zaak1.png`,
`160-en-375-stap1.png` (1.6.0, gelijk aan 1.4.1).

Wat alleen Engels zou kunnen raken, nagelopen en in orde:
- **Woorden die niet bij de knoppen passen:** "Tap Check" ↔ knop "Check"; "Skip" ↔ "Skip"; "Statement 1" ↔ de kaart
  "1 · Lady Clementine · I was in the Living Room, in a corner." Klopt.
- **"or tap it":** in het Engels kan "it" alleen het vakje zijn (Clementine zou "her" zijn). Duidelijker dan in het
  Spaans en Frans, waar "tócala"/"touche-la" ook op Clementine kan slaan, en die talen halen 80%.
- **Getallen en meervoud:** "Step 1 of 4", "Next case: The Glass of Bordeaux"; geen fouten.
- **Ontbrekende vertalingen:** en.js mist drie winkelzinnen die de andere talen wel hebben (`Los te koop` e.a.), maar
  die worden nergens meer gebruikt. Geen lek.
- **De "?"-uitlegkaart** (1.6.0, zaak 1): Engels 1.748 tekens, Nederlands 1.785, beide scrollen, knop "Close" bereikbaar.
- **Taalherkenning** (`i18n.js` `detect`): en-US, en-GB, en-IN en en-AU → Engels; in Chrome met alleen
  `navigator.languages` = en-US of en-IN draait de hele eerste minuut Engels.

Wat iedereen raakt (geen verklaring voor Engels, wel voor de eerste minuut):
- **De startknop** (§4.3).
- **Stap 1 en 2 zetten de handeling achteraan**: eerst twee zinnen redeneren, dan pas "Drag … or tap it". Op 375 px vijf
  tot zeven regels vóór je weet wat je moet doen. Tik je eerst op Clementine zelf (de naam in de opdracht), dan gebeurt er
  niets zichtbaars (ze is al gekozen; de stap blijft 1).
- **Op 375×667 staan gereedschap en Controleer bij stap 1-2 onder de vouw.** Niet nodig voor die stappen; bij stap 3
  past alles weer.
- **Zaak 1 is meteen vol**: de briefing gaat over kolommen, de kaart "Nieuw in dit deel" over meubels, en de "?"-kaart
  noemt voor deze zaak ook rijen/kolommen en links/hoger. Drie soorten verklaringen in de eerste echte zaak.

## 3. Taal op een Engelse iPhone, en de winkel

- **Taalkeuze klopt** voor en-US, en-GB en en-IN (§2). De app declareert 20 talen (`CFBundleLocalizations`) met Engels als
  ontwikkeltaal.
- **Maar elke niet-ondersteunde apparaattaal komt ook in het Engels uit**: pl, sv, da, nb, fi, cs, el, he, th, uk, ro,
  hu, ms, zh-Hant (Taiwan, Hongkong) → `en` (getest met `I18n.detect`; iOS valt zelf ook terug op de ontwikkeltaal). De
  teller zegt dan `l = en`. De groep "Engels" is dus: Engelstaligen + iedereen met een Engelse iPhone in een ander land
  (Saoedi-Arabië was 13-19 okt het grootste downloadland, 12 van 64) + iedereen met een taal die we niet hebben.
  Hoe groot elk deel is, is met de tellers niet te zien.
- **De Engelse winkelpagina belooft niets wat de rest niet belooft.** Promotietekst, beschrijving en kaarten zijn in alle
  talen dezelfde ("You are the detective … A guided practice case shows you how."; kaart 1 in 1.6: "Sudoku, but with a
  mystery"). De eerste minuut levert dat: oefenzaak, dan zaak 1.
- **Zoekwoorden lokken geen verkeerd publiek** (iTunes-zoek-API, 3 nov): in de VS niet in de top 200 voor "killer sudoku",
  "sudoku", "murder mystery", "detective" of "whodunit"; wel #5 op "crime sudoku" en #1 op de merknaam. De Engelse
  downloaders zoeken dus naar dit genre, en zien daar Enigmic (2.162 beoordelingen), Murder Sudoku: Tiny Crimes en Whodoku
  naast ons (0 beoordelingen in de VS volgens `store/GROEI.md`, 17 okt). In ES/MX/FR/IT/BR zijn er weinig of geen vertaalde concurrenten.

## 4. Oorzaken, gerangschikt

### 4.1 App Review en andere Apple-toestellen tellen als Engelse spelers — zeker, ~40% van het gat

Bewijs: §1.1. 18 van 52 Engelse eerste starts, 0 oefenzaken, 12 keer de winkel. Na aftrek: oefenzaak 33% → 50%
(gat van 47 naar 29 punten). Dit is geen probleem van de app, maar van de meting: zolang reviewers meetellen, ziet elke
release eruit alsof Engels slechter wordt.

### 4.2 Een ander publiek achter "Engels" — waarschijnlijk, de rest van het gat, niet te bewijzen met deze tellers

Bewijs dat het geen fout in de Engelse app is: §2 (zelfde werking, kortste tekst, niets bedekt of afgesneden) en het
verloop: het gat zit op elke trede, ook ná de oefenzaak (zaak 3 → dag 1: 20% tegen 52%). Een blokkade in de oefenzaak
zou alleen de eerste trede raken. Drie kandidaten, alle drie Engels-specifiek:
- **Niet-moedertaalsprekers**: alle niet-ondersteunde talen en Engelse iPhones buiten Engelstalige landen. Voor hen is
  een opdracht van 31 woorden waarin de handeling als laatste komt, zwaarder dan voor een Spanjaard in het Spaans.
- **Keuze uit sterke concurrenten** in de Engelse winkel: wie "crime sudoku" zoekt, probeert er een paar en houdt de
  bekende. Past bij lage dag 1, ook bij wie wel speelde.
- **Overslaan-en-spelen** (§1.3): maakt de oefenzaakcijfers lager dan het gedrag.

### 4.3 De startknop is in het midden dood — zeker, alle talen, kost een tik

`index.html:46-48`: de laadbalk (`.splash-load`, 200×8 px) en de statusregel (`.splash-status`, sinds 1.6) liggen
absoluut gepositioneerd over het midden van de knop. Na het laden zijn ze onzichtbaar (`style.css:2248`, `:2775`,
`opacity: 0`) maar vangen nog tikken op; de knop heeft na het laden geen `transform` meer en ligt daardoor onder ze.
Gemeten met een raster van tikpunten over de knop (260×45 px):

| | Dood deel van de knop | Tik precies in het midden |
|---|---|---|
| 1.4.1 (live) | 14% (balk over het midden) | doet niets |
| 1.6.0 | 37% (balk + onderste 10 px door de statusregel) | doet niets |
| 1.6.0 met de fix uit §5b | 0,5% (alleen de ronde hoeken) | werkt |

De tweede tik (iets hoger) werkt wel, dus niemand zit vast, maar het eerste wat een nieuwe speler doet, mislukt. Speelt
in elke taal, verklaart het Engelse gat niet. Beeld: `eerste-minuut-en/141-en-390-splash.png`.

### 4.4 Oefenzaak: handeling achteraan, op klein scherm onder de vouw — mogelijk, alle talen

Zie §2. Weegt zwaarder voor wie in een tweede taal leest (§4.2).

## 5. Kleinste fixes

Let op: een andere sessie werkt nu aan de onboarding in een worktree. Fix (b) en (c) raken bestanden die die sessie
waarschijnlijk ook aanraakt; daar afstemmen. Fix (a) en (d) raken alleen de meting.

**(a) Sandbox-toestellen niet meer tellen** (App Review en TestFlight draaien met een sandbox-bon).
`ios/App/App/MainViewController.swift:16-18`, nu:
```swift
        #if targetEnvironment(simulator)
        descriptor.appendedUserAgentString = [descriptor.appendedUserAgentString, "CrimsonSimulator"].compactMap { $0 }.joined(separator: " ")
        #endif
```
wordt:
```swift
        #if targetEnvironment(simulator)
        let tag: String? = "CrimsonSimulator"
        #else
        // App Review en TestFlight: sandbox-bon. Niet als nieuwe speler meetellen.
        let tag: String? = Bundle.main.appStoreReceiptURL?.lastPathComponent == "sandboxReceipt" ? "CrimsonSandbox" : nil
        #endif
        if let tag = tag { descriptor.appendedUserAgentString = [descriptor.appendedUserAgentString, tag].compactMap { $0 }.joined(separator: " ") }
```
en `meting.js:18`: `/CrimsonSimulator/` → `/Crimson(Simulator|Sandbox)/`. Kanttekeningen: de sandbox-bon is de gangbare
manier om TestFlight/App Review te herkennen, maar Apple documenteert het niet voor App Review; eerst controleren met een
TestFlight-build dat de tellers stoppen. `feedback()` gebruikt dezelfde `test()`, dus berichten van TestFlight komen dan
ook niet meer aan. Tot deze build live is: in `store/meting-aha.js` de 18 (dag | versie)-paren uit §1.1 uitsluiten.

**(b) Startknop overal tikbaar.** `style.css:2248`:
`#screen-splash.loaded .splash-load { opacity: 0; }` → `#screen-splash.loaded .splash-load { opacity: 0; pointer-events: none; }`
en `style.css:2775`:
`#screen-splash.loaded .splash-status { opacity: 0; }` → `#screen-splash.loaded .splash-status { opacity: 0; pointer-events: none; }`
(Getest door de regel in de pagina te zetten: dood deel 37% → 0,5%, tik in het midden werkt, in 1.4.1 en 1.6.0.)

**(c) Oefenzaak stap 1 en 2: eerst wat je doet, dan waarom.** `i18n/en.js:603-604`, nu 169 en 132 tekens:
- stap 1 → `'Tap the glowing square. Lady Clementine was in a corner of the Living Room, and this is the only free one.'` (106 tekens)
- stap 2 → `'Tap the glowing square. Mr. Hargrove stood next to the plant, and this is the only free square beside it.'` (105 tekens)

Bron in het Nederlands, `board.js:58-59`:
- stap 1 → `'Tik op het oplichtende vakje. Lady Clementine was in een hoek van de Woonkamer, en dit is de enige vrije hoek.'`
- stap 2 → `'Tik op het oplichtende vakje. Meneer Hargrove stond naast de plant, en dit is het enige vrije vakje ernaast.'`

Slepen blijft werken; het hoeft alleen niet meer in de zin. De andere 18 talen in hun bron (`i18n/.work/<taal>/`, dan
`node build-pack.js`). "Statement 1:" valt weg; de kaart onderin toont het nummer al. Dit is een verbetering voor
iedereen, maar met de huidige tellers geen bewezen oorzaak van het Engelse gat: na 1.6 meet `tut_step` of stap 1 de
plek is waar mensen stoppen. Optioneel, zelfde gedachte: op klein scherm (≤ 700 px hoog) het gereedschap tijdens stap 1-2
inklappen, zodat het bord en het doel samen met de kaart in beeld blijven.

**(d) Weten wie "Engels" is.** Bij de eerste start (`meting.js:53`, `this.send('open', '', …)`) de regio van het toestel
meesturen in `a`, alleen als `n = 0`, bijvoorbeeld `us`, `gb`, `sa`, `pl`. Eerst in de simulator nakijken wat
`navigator.language` en `Intl.DateTimeFormat().resolvedOptions().locale` in de webview geven bij toesteltaal Pools /
regio Polen en bij Engels / Saoedi-Arabië: geeft de webview alleen de app-taal, dan moet de regio van de native kant
komen (`Locale.current.region`, net als hierboven via de user agent). De worker accepteert `a` al (tot 24 tekens,
`[a-z0-9_:.-]`); de privacytekst noemt dan ook de regio. Botst met het voorstel in AHA §6 (profiel in `a` bij `n ≥ 1`)
niet: dat gebruikt `a` alleen vanaf dag 1.

## 6. Uitgesloten

Taalherkenning (en-US/GB/IN/AU goed), Nederlands in de Engelse schermen (0), ontbrekende Engelse teksten (alleen drie
ongebruikte), knopnamen in de uitleg, meervoud en getallen, de startknoptekst, de "?"-kaart, coachkaart over het doel
(in geen enkele ronde), knoppen buiten beeld bij de stap waar je ze nodig hebt, laadtijd (gelijk in alle talen),
de winkelbelofte (gelijk in alle talen), zoekwoorden die een ander publiek trekken ("killer sudoku", "murder mystery":
niet in de top 200).

## 7. Grenzen

- Geen speler-id: alles over de Apple-toestellen is afgeleid uit dag, versie en gedrag. Sterk patroon, geen bewijs per toestel.
- De Engelse rest is klein (34 spelers, 2 terug op dag 1); de intervallen in §1.1 zijn breed.
- Headless Chrome is geen WKWebView: tikken, lettertypes en de veilige zones van een echte iPhone kunnen iets verschillen.
  De dode zone op de startknop volgt uit de CSS-stapeling en speelt in WebKit hetzelfde, maar is niet op een toestel getest.
- Stapmetingen van echte spelers bestaan pas als 1.6 live is.

## Opnieuw draaien

Na de release van 1.6: `node store/meting-aha.js` met de Apple-toestellen eruit (§1.1, of automatisch na fix a), en per
taal `tut_step`/`tut_skip`/`quit` naast elkaar. De speelronde: een statische server op de app-map, dan
`node docs/onderzoek/eerste-minuut-en/eerste-minuut.js http://127.0.0.1:<poort> <taal|auto> <breedte> <hoogte> <uitvoermap> [apparaattalen]`
(schrijft PNG's per stap en één JSON met maten) en `node docs/onderzoek/eerste-minuut-en/startknop-dode-zone.js
http://127.0.0.1:<poort> <taal> 390 844`. Eén ronde tegelijk: parallel laten draaien overbelast `python3 -m http.server`.

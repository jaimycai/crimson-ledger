# Crimson Ledger web — plan en status

Gebaseerd op het herbouwplan uit de Antigravity-chat (1 sept 2026) en het marktonderzoek.
Bijgewerkt: 2 september 2026.

## Fasen

| Fase | Inhoud | Status |
| --- | --- | --- |
| 1 | Logic-grid engine, raster-UI, basis gameplay, 3 niveaus | ✅ klaar en getest |
| 2 | Lerend hintsysteem | ✅ herbouwd op 2 sept: 6 regels, loopt elke puzzel uit, meldt fouten |
| 2 | Verkorte onboarding (< 30 s tot eerste puzzel) | ✅ oefenzaak: eerste "Begin" gaat direct een begeleide 2×2-zaak in (5 stappen, overslaan kan), daarna het menu; opnieuw speelbaar vanuit het menu |
| 3 | Dagelijkse zaak, streak, deelbaar emoji-resultaat | ✅ in app.js |
| 4 | Tweetaligheid NL/EN (`i18n.js`) | ⬜ |
| 4 | Hoofdstukken met meerdere zaken en terugkerende personages | ⬜ |

## Wat er op 2 september is gebeurd

- Hersteld: `story.js` en `logic-engine.js` waren op 1 sept meeverhuisd naar
  `../CrimsonLedger/docs/legacy-web-prototype/`, en `app.js` was overschreven door een oude
  editor-buffer (Sudoku-versie). Alle drie teruggezet.
- Generator: gewogen mix van aanwijzingstypen per niveau (positief / negatief / of / noch),
  minimale set, max. 1 directe aanwijzing op Moeilijk, max. 3 op Gemiddeld.
  Gemeten (40 seeds per niveau): Makkelijk 3–5 aanwijzingen, Gemiddeld 6–8, Moeilijk 9–12.
- Nederlandse tekst: lidwoorden per wapen (het Mes, de Kandelaar), alle categorieparen gedekt.
- HintEngine: fout in raster → directe aanwijzing → rij/kolom wegstrepen → laatste cel →
  of-aanwijzing oplossen → kruisverwijzing tussen blokken. Elke hint heeft een korte tekst
  (niveau 1) en een uitleg (niveau 2), en markeert de aanwijzing in de lijst.
- app.js: onderscheid "fout" en "nog niet compleet" bij Controleer, deel-fallback, uitleg bij
  eerste zaak, localStorage veilig in privémodus.
- Tests in `tests/` (engine + jsdom-spelflow), `npm test`.
- Oefenzaak (`TUTORIAL_CASE` in story.js): vaste puzzel Clara/Marcus × Keuken/Tuin, twee
  aanwijzingen, stappenplan met coach-tekst; alleen de gemarkeerde cel accepteert tikken.
  Wordt na afronden of overslaan onthouden (`crimson-tutorial-done`).
- Hint-teller op de hintknop.

## Wat er op 8 september is gebeurd (na de eerste telefoontest van de iOS-build)

Feedback van Jaimy: "Elimineer" past niet op het startscherm; de kleuren van de
moeilijkheidskeuze zijn niet mooi; in het spel moet alles op één scherm (bord en
verdachten vast, aanwijzingen scrollen); wat is het verschil tussen Plaats en Markeer;
de foutmelding-popup viel achter het Dynamic Island.

- Tagline: "Speur. Redeneer. Ontmasker." (splash, titel, meta-omschrijving).
- Moeilijkheidskiezer: drie kaarten naast elkaar met een mini-plattegrond in het gekozen
  thema (vaste seeds, `App.renderDifficultyPreviews`), verdachten als stipjes en de
  bordmaat (6×6 / 7×7 / 8×8).
- Spelscherm: `100dvh`, bord + verdachtenstrook vast, aanwijzingen scrollen in hun eigen
  vak; bordbreedte volgt de schermhoogte zodat er ruimte blijft voor aanwijzingen.
- Veilige randen: `viewport-fit=cover` + `--sat`/`--sab` op alle schermen, ook de toast.
- Toast: onder de veilige rand, nooit breder dan het scherm, tikken gaan erdoorheen.
- "Markeer" heet nu "Potlood" (✏️); eerste keer een uitleg-toast, ook in "Hoe werkt het?".
- Tests: `tests/board.test.js` dekt previews, themawissel en de eenmalige Potlood-uitleg.
- iOS: `npm run build && npx cap sync ios` gedaan; `ios/App/App/public` is bijgewerkt.

Tweede ronde feedback (zelfde avond, Station Orion op de telefoon): meubel-iconen alleen zijn
te moeilijk ("slaapcapsule", "de module"); het spel trekt je niet genoeg naar binnen.

- Aanwijzingen: meubel-icoon staat nu in de zin zelf; "in een hoek van de module" werd
  "in een hoek" (kamernaam staat al in de zin); tik op een meubel of het slachtoffer toont
  een naamkaartje (`Board.peek`); tik op een aanwijzing laat de kamer, de meubels en de
  genoemde verdachten oplichten (`Board.focusOnClue`).
- Live feedback (de "trekkracht"): elke kaart toont direct of hij klopt met wat er staat
  (groen ✓ als alle genoemde verdachten staan en het klopt, rood ✗ bij een schending,
  via `FloorPlan.holds`); twee verdachten in de kamer van het slachtoffer krijgen een rode
  rand; staat alles goed, dan pulseert Controleer. Het eigen afvinkje is het rondje rechts.
- Doorspelen: na vrij spel of de dagelijkse zaak staat er meteen "Nog een zaak · thema".
- Voortgang: rang in het menu met balk (Rekruut → Speurder 3 → Rechercheur 8 →
  Inspecteur 15 → Hoofdinspecteur 25 → Meesterdetective 40, `App.rankFor`); nieuwe rang
  wordt op het resultaatscherm gemeld.
- Beslissing: fouten direct tonen (zoals sudoku-apps) in plaats van pas bij Controleer —
  Jaimy vindt het spel te moeilijk en wil dat spelers blijven; de hint-engine blijft
  bestaan voor de uitleg.

Derde ronde (zelfde avond): "32 zaken is veel te weinig, we gaan hier zo doorheen" en "wat kan er
nog meer beter, en push het".

- Campagne: 96 vaste zaken in 12 delen (drie per wereld, elk deel acht zaken met eigen titel,
  intro en afsluiting). Deel II/III gaan open als het vorige deel af is; de laatste zaak van een
  deel toont de afsluiting en "Volgende zaak" loopt door naar het volgende deel. Voortgang van
  deel I gebruikt dezelfde sleutels als voorheen (`landhuis-0` …), dus niets gaat verloren.
- Eindeloos archief: genummerde dossiers (`Campaign.archive(n)`, thema wisselt per dossier,
  moeilijkheid loopt mee, seed `200000 + n·9973`), open na 8 campagnezaken; de lijst toont de
  laatste drie opgeloste en de volgende drie. Nooit op.
- Dagelijkse herinnering (alleen iOS, `@capacitor/local-notifications`): schakelaar in de
  instellingen en een knop op het resultaatscherm na de dagelijkse zaak. Eén melding, elke keer
  opnieuw gepland: vandaag 18:30 als de dagelijkse zaak nog open staat, anders morgen; de tekst
  noemt de streak. Op het web onzichtbaar.
- Geluid `clue` als een aanwijzing groen wordt.
- Tests: campagne-test bewijst alle 96 zaken + 12 dossiers uniek oplosbaar, unieke seeds,
  hoofdstuklogica; bordtest dekt de nieuwe campagnelijst (13 secties, 99 kaarten).

## App Store-controle (8 sep, avond)

Gecontroleerd en in orde: Info.plist (`ITSAppUsesNonExemptEncryption` = false, alleen portret,
alleen iPhone → geen iPad-schermafbeeldingen), launch screen, app-icoon 1024×1024 zonder alpha,
privacy- en supportpagina live op GitHub Pages (HTTP 200), meldingen opt-in, geen login/ads/IAP.
Gefixt: de Privacy/Support-links in de instellingen deden in de iOS-app niets (Capacitor geeft
`target=_blank` door aan iOS, dat een `capacitor://`-URL niet kan openen) → nu publieke https-URL's
die Safari openen (richtlijn 5.1.1 eist een bereikbare privacyverklaring in de app). Gefixt:
schermafbeeldingen waren van de oude UI (richtlijn 2.3.3) → acht nieuwe op 1290×2796.
Resterend risico: richtlijn 4.2 (minimale functionaliteit) voor web-gebaseerde apps; antwoord
staat in `store/CHECKLIST.md`.

## Naar een episch spel (analyse 8 sep, nog niet gebouwd)

Wat Candy Crush en Plants vs Zombies hebben en wij nog niet, in volgorde van effect:
1. **Een zichtbare reis**: een levelkaart per wereld (kronkelpad met genummerde knopen, jouw
   pion, sterren per knoop) in plaats van een lijst.
2. **Steeds iets nieuws**: nieuwe aanwijzingstypen per deel met een "Nieuw!"-kaartje, en twee
   nieuwe spelelementen: *de leugenaar* (één verklaring is vals: die van de moordenaar) en
   *de getuige* (één extra aanwijzing op afroep). Vraagt generator-werk (uniciteit).
3. **Juice**: Zaak Gesloten-ceremonie met stempel-klap, confetti, sterren die één voor één
   binnenvliegen, scoreteller met bonussen (tijd, geen hint, in één keer), rangbalk die
   oploopt; deeltjes bij elke plaatsing.
4. **Personages die praten**: aanwijzingen als verklaringen in de ik-vorm met tekstballon,
   reactie van de beschuldigde, een mentor (Inspecteur) tussen de zaken.
5. **Score en XP** als basis voor rang en later Game Center-ranglijsten.
6. **Muziek per wereld** (loop) plus stingers.
7. **Onderscheidingen en verzamelingen** (bewijsstukken per opgeloste zaak in een vitrine).
8. **Dagelijkse beloningskalender** en een wekelijkse zaak met deelbare uitslag.

## De epische update (9 sep, gebouwd naar de Figma-mock-ups in `Murdoku (3)/`)

Alles uit "Naar een episch spel" behalve de nieuwe spelelementen (leugenaar/getuige) en muziek:

- **Thuisscherm** (`index.html`, `App.renderHome`): kop met rang en rangbalk (tik → vitrine),
  kaart "Dagelijkse zaak" met wisselende titel (`Progress.dailyTitle`, 30 titels) en +150 punten,
  streakkaart met **weekstrook** ma–zo (`Progress.week`, logboek `crimson-daily-log`, zondag =
  medaille "Volle week"), kaart **Zaak van de week** (`Progress.weekly`: ISO-week → vaste seed,
  thema wisselt per week, titel per wereld, moeilijk, +300 punten, deelbare uitslag bewaard),
  navigatiekaarten "Verder met de campagne: Deel II · Zaak 3" en "Vrij spelen" (eigen scherm
  `#screen-free` met de wereld- en niveaukiezer).
- **Wereldkaart** (`App.renderMap`, `#screen-campaign`): per wereld een slingerpad over een
  achtergrondillustratie (`assets/map-*.jpg`, uit de mock-ups, 640px JPEG), wegwijzers per deel,
  knopen dicht/open (pulserende ring + pion 🕵️)/klaar met sterren, popover per knoop (titel,
  niveau, verhaaltje, beste score, Speel), wereldkiezer met "nog N zaken", sterrenteller
  "★ 12/72", grote knop "▶ Speel zaak 6 · De tuinman zwijgt". Na deel III loopt het pad door in
  het archief; archiefdossiers zijn nu **per wereld** (dossier 1, 5, 9 … voor het landhuis;
  `Campaign.archiveFor`, `isUnlocked` en `next` per wereld).
- **Inspecteur Van Dam** (`mentor.js`, portretten `assets/vandam*.jpg`): briefing vóór elke
  campagnezaak (verhaaltje + één tip die bij de soorten verklaringen in die zaak past; de klok
  loopt pas na "Aan de slag"), opmerking op het resultaatscherm die de speler met zijn rang
  aanspreekt, **"Nieuw deel"-splash** (rood, één keer per deel; `crimson-parts-seen`).
- **Verklaringen** (`FloorPlan.statement`, `Board.renderClues`): elke aanwijzing als getuigenis
  in de ik-vorm met portret en naam van de spreker (twee portretten bij twee personen; lege
  kamer = het rapport van Van Dam), tekstballon, live "✓ Klopt" / "✗ Klopt niet", afvinken =
  doorgestreept. **"Nieuw in dit deel"-kaart** met plaatje, één per zaak voor de eerste nog
  onbekende soort (`Mentor.INTROS`, 8 groepen, `crimson-newclue-seen`).
- **Beschuldiging**: portretten op een rij; de verkeerde ontkent in een rode ballon ("Ik?
  Nooit!"), de dader bekent in een groene ("… Hoe wist je dat?") en 0,7 s later volgt het resultaat.
- **Zaak Gesloten-ceremonie** (`Board.showResults/ceremony`): stempel klapt neer met
  papier-schudden en confetti, drie sterren vliegen één voor één binnen, score telt op (Basis
  300/500/800 · Tijdbonus tot +250 · Zonder hint +200 · In één keer +150 · dagelijks +150 ·
  week +300 · archief +100), totaal in Playfair, rangbalk loopt op met "🎖 Nieuwe rang", dan
  Van Dam. Alles in ≈2,5 s, tik = overslaan. Daarna "Waar iedereen stond" met portretten,
  "Volgende zaak", "Deel resultaat", "Naar de kaart". Sterren nu ook bij vrij spel en dagelijks.
- **Punten** (`crimson-points`) en **onderscheidingen** (`Progress.MEDALS`, 17 stuks, met
  datum; gouden toast na de ceremonie) en **vitrine** (`#screen-awards`: per wereld een plank met
  24 bewijsstukken, één per opgeloste campagnezaak, `item` in `campaign.js`; dicht = silhouet).
- Geluiden: stempel, ster, rang, medaille.
- Tests: `tests/progress.test.js` (punten, week, weekzaak, medailles, vitrine, mentor,
  verklaringen), bordtest dekt thuisscherm, kaart, splash, briefing, verklaringen, Nieuw!-kaart,
  beschuldiging, ceremonie, punten, weekzaak, vitrine. Alle 6 suites groen.

## Laadscherm, lettertypes en opslag (9 sep, avond)

- Jaimy vond het native laadscherm (app-icoon in een vierkant) lelijk. Nu: het native
  laadscherm is een render van het echte startscherm (`splash-2732.png`, gemaakt met puppeteer
  op 393×852 met veilige randen, in het asset-catalog gezet), de Capacitor-splash blijft staan
  tot de webversie er is (`launchAutoHide: false`, `App.hideNativeSplash`), en op het
  startscherm loopt een laadbalk vol (`App.bootSplash`: fonts + load, minstens 0,9 s, hooguit
  2,5 s) waarna "Begin" (of "Verder" voor wie al gespeeld heeft) verschijnt. De ring om de
  badge pulseert pas na het laden, zodat de overgang onzichtbaar is.
- Lettertypes (Playfair Display, Inter; latin, variabel, 126 KB) staan nu in `assets/fonts/` en
  worden niet meer van Google geladen: offline en in de app ziet alles er hetzelfde uit.
- Voortgang: alle `crimson-*`-sleutels staan in localStorage én (in de iOS-app) in de native
  opslag via `@capacitor/preferences` (UserDefaults, zit in de iCloud-back-up). Bij het opstarten
  wordt een lege webview daaruit hersteld (`App.restoreFromNative`); wissen wist beide.
  Geen accounts: voortgang is per toestel.

## Eén doorlopende wereldkaart, eigen illustraties, App Store-voorbereiding (10 sep)

Jaimy's feedback: de AI-achtergronden van de kaart pasten niet bij het ontwerp; per wereld
een aparte pagina voelde niet als Candy Crush/Duolingo; de app moet "echt een stuk beter"
voor de App Store en later hoog in de rankings.

- **Eén pad** (`App.mapLayout/renderMap`): alle vier de werelden en het archief achter elkaar
  in één scrollbare kaart; per wereld een sectie met eigen vloerpatroon (dambord, planken,
  marmer, raster: dezelfde vloeren als op het bord), een **getekende banner** in de platte
  stijl van de portretten (`mapart.js`: landhuis bij avond, de Zwarte Meeuw op zee, de gevel
  van Aurora, Station Orion) en decoraties langs het pad (bomen, fontein, anker, palm,
  planeet …, 7 per wereld). De wereldkiezer bovenin springt naar de banner en volgt het
  scrollen. De AI-plaatjes zijn weg (380 KB kleiner). Archief weer één doorlopende reeks
  dossiers aan het eind van het pad.
- **Na de oefenzaak** meteen de kaart in ("🗺️ Naar de kaart") in plaats van het menu: de
  speler ziet zaak 1 pulseren en de grote speelknop.
- **Vonkjes** bij het neerzetten van een verdachte (`Board.sparks`).
- **Beoordeling vragen** (eigen `ReviewPlugin.swift` in `ios/App/App`, aangemeld in
  `MainViewController.swift`; `App.maybeAskReview`): één keer, na de vijfde opgeloste zaak, 3,5 s
  na het resultaat. De community-plugin `@capacitor-community/in-app-review` linkte niet (zijn
  iOS 17-pad trekt SwiftUI mee), vandaar tien regels Swift met `SKStoreReviewController`. Apple's SKStoreReviewController
  bepaalt zelf of het venster echt verschijnt (max. 3× per jaar). Beoordelingen zijn de
  belangrijkste rankingfactor die we vanuit de app kunnen beïnvloeden.

## Naar de top van de App Store (analyse 10 sep)

Wat de ranking bepaalt: downloads (snelheid + volume), beoordelingen (aantal en cijfer),
retentie/gebruik, en zoektermen. Wat daarvoor nog nodig is, op volgorde van effect:
1. **Engelse versie** (i18n van UI, campagne, verklaringen, Van Dam). De Nederlandse markt is
   klein; "murder mystery logic puzzle" is een grote Engelstalige niche. Grootste hefboom.
2. **Productpagina**: 6–8 schermafbeeldingen met korte koppen ("De verdachten praten",
   "Eén pad door vier werelden"), een App Preview-video van 15–20 s (kaart → verklaringen →
   Zaak Gesloten), ondertitel en zoekwoorden getest via App Store Connect.
3. **Game Center**: ranglijst voor de zaak van de week en prestaties gekoppeld aan de
   onderscheidingen. Zichtbaar in de App Store en goed voor retentie.
4. **Nieuwe mechanieken per deel** (de leugenaar, de getuige) zodat deel II en III echt
   anders spelen; nu verschilt alleen de moeilijkheid.
5. **Seizoensevents**: een themaweek (kerst op het landhuis) met eigen bewijsstukken.
6. **Delen als afbeelding** (plattegrond + stempel) in plaats van alleen tekst: gratis
   marketing via WhatsApp/Instagram.
7. **Muziek per wereld** en meer geluid.
8. **Meting**: zonder analytics (privacy) weten we niets over retentie; overweeg
   privacyvriendelijke, anonieme telling van "dag 1/7/30 terug" via App Store Connect-
   statistieken (die zijn er standaard) voordat er iets in de app komt.

## Leesbaar bord en een overzichtelijke beschuldiging (11 sep)

Telefoontest van Jaimy: "De balk met opties kan iets naar beneden en ik kan zo de
tekst niet meer lezen om de puzzel op te lossen. Dat is essentieel. De laatste stap
om te kiezen wie de moordenaar is begrijp ik niet zo. Want je kan alleen kiezen
tussen de personages en niet terug naar de kaart en daardoor niet overzichtelijk."

Wat er is veranderd:

- **Meer ruimte voor de verklaringen.** De gereedschapsbalk gebruikt de veilige
  zone onderin zuiniger (93 → 67 px hoog) en het bord is standaard kleiner, zodat
  de verklaringenlijst van 149 naar 240 px groeit: twee hele kaarten in beeld in
  plaats van anderhalve.
- **Zelf de verdeling kiezen.** Tussen de verdachtenbalk en de verklaringen zit
  een lijn met het label "Meer tekst" / "Groter bord". Eén tik wisselt, slepen
  zet de grens waar je hem hebben wilt. De keuze wordt onthouden in
  `crimson-board-read`.
- **"Nieuw in dit deel" is een eigen venster** geworden in plaats van een kaart
  bovenaan de lijst — die at de halve leesruimte op. De klok staat stil zolang
  het venster open staat, en het verschijnt pas na de briefing van Van Dam.
- **De beschuldiging blijft op het bord.** Geen venster meer over de plattegrond:
  een paneel schuift onderin, de plattegrond blijft staan, de kamer van het
  slachtoffer licht rood op en de rest vervaagt. Onder elke naam staat de kamer
  waar die verdachte staat, zodat de conclusie één blik is. "← Terug naar het
  bord" staat vast onderin en brengt je terug naar de verklaringen; Controleer
  opent de vraag opnieuw.

## Openstaande punten (volgorde van voorstel)

1. App Store: stappen in `store/CHECKLIST.md` (Apple-account, archiveren, uploaden).
2. Engelse versie (i18n): zie "Naar de top van de App Store".
3. Nieuwe spelelementen per deel: *de leugenaar* en *de getuige*. Vraagt generator-werk.
4. Game Center (weekranglijst, prestaties); App Preview-video; delen als afbeelding.
5. Vierde moeilijkheid "Expert" (9×9, zes verdachten) als beloning vanaf rang Inspecteur.
6. Muziek per wereld (loop) plus stingers.

## Beslissingen

- 2026-09-01 — Naam Crimson Ledger, geen MurDoku/Murdle/Cluedo — juridisch risico en verwarring.
- 2026-09-01 — Sudoku vervangen door logic-grid — dat is het echte genre.
- 2026-09-02 — Moeilijkheid via de mix van aanwijzingstypen, niet via het aantal — anders wordt "moeilijk" twintig keer "X was niet in Y".
- 2026-09-02 — Hints wijzen de fout in het raster als eerste aan — anders leidt een fout tot hints die nergens toe leiden.
- 2026-09-02 — Geen auto-wegstrepen na ✓ — een hint legt de techniek uit, de speler zet de kruisjes zelf.
- 2026-09-02 — Oefenzaak is 2 categorieën × 2 items met een vast stappenplan, geen gegenereerde puzzel — voorspelbaar, in dertig seconden klaar, en hij vervangt de uitleg-modal bij de eerste keer.

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

## Leesbaar bord en een overzichtelijke beschuldiging (11-12 sep)

Telefoontest van Jaimy: "De balk met opties kan iets naar beneden en ik kan zo de
tekst niet meer lezen om de puzzel op te lossen. Dat is essentieel. De laatste stap
om te kiezen wie de moordenaar is begrijp ik niet zo. Want je kan alleen kiezen
tussen de personages en niet terug naar de kaart en daardoor niet overzichtelijk."
Daarna, na de eerste poging: "Het is nog steeds niet opgelost."

De eerste poging (kleinere balk, kleiner bord, sleepbare scheidingslijn) hielp te
weinig: een lijst met vijf tot acht kaartjes past nooit fatsoenlijk onder een
plattegrond op een telefoon. Daarom is de opzet zelf veranderd.

- **Verklaringendek in plaats van een lijst.** Onder de verdachtenbalk staat nu
  één verklaring tegelijk, groot (0,96 rem) en volledig zichtbaar, met portret,
  naam, live status en een afvinkrondje. Swipen, de pijltjes of de stippen gaan
  naar de volgende; de stippen laten in kleur zien welke verklaringen kloppen
  (groen), geschonden worden (rood) of afgevinkt zijn. "Volgende" slaat
  afgevinkte verklaringen over. Dit patroon komt uit kaart- en verhaalspellen op
  mobiel: één ding tegelijk, groot genoeg om te lezen zonder te scrollen.
- **"Alle N" opent de hele lijst** in een venster met vaste sluitknop. Tik een
  verklaring en het dek springt erheen, het venster sluit en de kamer licht op
  het bord op. Overzicht wanneer je het wilt, rust wanneer je het niet wilt.
- **Het bord vult wat er overblijft.** De plattegrond wordt in JavaScript
  gemeten en passend gemaakt (`Board.fitBoard`), met meeschalende rastercellen
  in plaats van vaste vierkanten. Geen afgekapte rijen, geen gat boven de
  gereedschapsbalk, op elk formaat. Op een iPhone 15 Pro groeide het bord van
  299 naar 369 px; op een iPhone SE past alles nog steeds.
- **De gereedschapsbalk staat tegen de onderrand**, met alleen de veilige zone
  eronder (93 → 62 px hoog).
- **"Nieuw in dit deel" is een eigen venster** geworden in plaats van een kaart
  bovenaan de lijst. De klok staat stil zolang het venster open staat, en het
  verschijnt pas na de briefing van Van Dam.
- **De beschuldiging blijft op het bord.** Geen venster meer over de plattegrond:
  een paneel schuift onderin, de plattegrond blijft staan, de kamer van het
  slachtoffer licht op en de rest vervaagt. Onder elke naam staat de kamer waar
  die verdachte staat, zodat de conclusie één blik is. "← Terug naar het bord"
  staat vast onderin; Controleer opent de vraag opnieuw.

Gecontroleerd op 375×667, 393×852 en 430×932 met echte veilige zones: vierkante
vakjes, balk precies op de onderrand, en het beschuldigingspaneel volledig in
beeld zonder te scrollen.

## Slepen, begrijpelijke uitleg, 192 zaken en de retentie-ronde (14 sep)

Telefoontest van Jaimy: verdachten willen slepen in plaats van eerst tikken;
bij de moordenaarsvraag wil je de plattegrond kunnen zien; de tekst van "Nieuw
in dit deel" was onbegrijpelijk; 96 zaken zijn te snel uitgespeeld; en: "doe
onderzoek naar Duolingo en Candy Crush, hoe houd je iemand zo lang mogelijk in
het spel".

### Wat er is gebouwd

- **Slepen.** Een verdachte sleep je van de balk naar een vakje (schaduwportret
  volgt je vinger, het doelvakje krijgt een groene of rode stippellijn). Een
  geplaatste verdachte sleep je naar een ander vakje, op iemand anders (dan
  wisselen ze) of van het bord af (dan is hij weg). Tikken werkt nog precies zo
  als eerst. `Board.bindDrag/dropSuspect/liftSuspect`.
- **Uitleg in gewone taal.** De acht "Nieuw in dit deel"-teksten zijn herschreven
  voor een kind van tien, en elk venster toont nu een voorbeeld uit de zaak zelf:
  "In deze zaak zegt Tante Agnes: 'Ik was in de Garage, direct naast een
  boekenkast.'"
- **192 campagnezaken.** Elke wereld heeft nu zes delen van acht zaken (delen IV
  t/m VI zijn nieuw: Een jaar later / De bruiloft / Het geheim van Blackwood;
  De nieuwe kapitein / Het spookschip / Zwartoogs schat; De heropening / Het
  congres / De laatste nacht van Aurora; Orion herstart / De vreemde capsule /
  De laatste omloop). Elk deel begint met een makkelijke zaak om op adem te komen
  en eindigt met de zwaarste. 576 sterren, 192 bewijsstukken in de vitrine.
- **De beschuldiging op het bord** (al gebouwd op 11 sep): de plattegrond blijft
  zichtbaar, de kamer van het slachtoffer licht op, onder elke naam staat zijn
  kamer, en "Terug naar het bord" staat vast onderin.

### Retentie-onderzoek: wat Duolingo en Candy Crush doen, en wat we overnemen

Bronnen: Deconstructor of Fun over Duolingo's streaks (spelers met een streak van
7+ dagen blijven 2,4× vaker terugkomen; streak freezes worden verdiend via
kisten, dagelijkse opdrachten en mijlpalen, juist niet gekocht, zodat wie ze het
hardst nodig heeft ze ook heeft), StriveCloud/Medium over Duolingo's Daily
Quests (dagelijkse en maandelijkse opdrachten voor langere sessies) en leagues
(+25% voltooide lessen), het NCBI-onderzoek naar "near-misses" in Candy Crush
(een bijna-gehaald level geeft de sterkste drang om door te spelen; het spel
zegt letterlijk "you only needed 2 more"), de Candy Crush Daily Bonus-kalender
(inlogreeks met oplopende beloning, reset bij een gemiste dag), en de
retentiebenchmarks voor puzzelgames (dag 1 ≈ 32%, dag 7 ≈ 12%, dag 30 ≈ 5%;
dag 1 = begrijpt de speler het spel, dag 7 = houdt de economie het vol, dag 30
= is er genoeg inhoud). Eén studie: de dagelijkse herinnering van 's ochtends
naar lunchtijd verschuiven gaf +18% dag-7-retentie.

Bewust niet overgenomen: levens, energie, wachttijden, koopbare boosts en
leaderboards met vreemden. Wel overgenomen, klein en zonder betaalmuur:

1. **Opdrachten van vandaag** (`Progress.questsFor/questBump`): drie kleine doelen
   per dag, elke dag anders (los een zaak op, zonder hint, binnen drie minuten,
   zet acht verdachten neer, vink drie verklaringen af, speel de dagelijkse zaak,
   een campagnezaak, wijs de dader in één keer aan, drie sterren). Elk doel 100
   punten, alle drie +200 punten en een vrije dag. Kaart op het startscherm met
   voortgangsbalkjes; een toast op het resultaatscherm als er een klaar is.
2. **Vrije dagen** (streak freeze, `Progress.freezes`): maximaal twee op voorraad,
   verdiend bij elke vijf dagen streak en bij alle opdrachten van een dag. Mis
   je één dag, dan vult een vrije dag het gat en blijft de streak staan. Nooit te
   koop. Medaille "Gered door een vrije dag".
3. **Streak loopt gevaar**: na 17:00 zonder gespeelde zaak wordt de streak-regel
   op het startscherm rood ("Je streak van 6 dagen loopt vanavond af. Speel één
   zaak."), en de herinnering zegt hetzelfde als er geen vrije dag is.
4. **Herinnering op je eigen speeltijd**: de app onthoudt op welk uur je zaken
   oplost en stuurt de herinnering een uur ná je gewone tijd (je bent kennelijk
   niet geweest); zonder gegevens om 18:30.
5. **Bijna-feedback** bij Controleer: "Bijna! Nog één verdachte staat verkeerd.
   3 van de 4 staan al goed." in plaats van alleen "1 verdachte staat verkeerd".
6. **Hierna** op het resultaatscherm: titel en verhaaltje van de volgende zaak,
   plus een balkje "Deel I · Het diner, nog 7 zaken". Dat is de Candy
   Crush-"volgend level ligt al klaar"-trek, en het Zeigarnik-effect van een
   onaf deel.
7. **Inhoud voor dag 30**: 192 zaken plus het eindeloze archief.

Nog niet gedaan, wel kansrijk: een weekcompetitie met vrienden via Game Center
(Duolingo's leagues zijn de sterkste sociale haak, maar vragen accounts), een
maandelijkse opdracht met een grote beloning, en een "welkom terug"-kaart na
een paar dagen afwezigheid.

## Kaart met tussenstops, minigames en bewijskisten (14 sep, avond)

Jaimy: "de wereldkaart heeft nog steeds 4 thema's en dit moet uitgebreider nu
we verdubbeld zijn. Net zoals bij Duolingo moeten hier minigames komen in de
kaart, en als we naar een volgend deel of thema gaan moet er iets komen dat ik
weer een wow heb en een reden om verder te spelen."

Wat Duolingo op zijn pad doet: elke unit een eigen kleur en kop, tussendoor
oefenrondes en kisten, en een trofee-moment aan het eind van een unit. Dat is
vertaald naar de kaart:

- **Elk deel is een eigen strook** met eigen sfeer: deel I helder, II schemer,
  III storm (regenstrepen), IV daglicht, V feest (confetti), VI nacht met
  sterren. De wegwijzer van elk deel draagt een icoon (🍷 📜 ⛈️ 🗝️ 💍 🚪 …) en
  een teller "3/8". Zo zijn 24 delen 24 herkenbare plekken in plaats van één
  lange rij.
- **Minigame halverwege elk deel** (open na zaak 4), afwisselend per deel:
  *Wie liegt?* (iedereen staat op zijn plek op een plattegrond van die wereld,
  drie verklaringen, één is gelogen, tik de leugenaar) en *Vluchtige blik*
  (vier tellen kijken, dan verdwijnt iedereen: waar stond …?). Drie rondes, 50
  punten per goede ronde, 150 extra bij de eerste keer alles goed, altijd
  opnieuw te spelen (de rondes wisselen per dag). `minigame.js`.
- **Bewijskist aan het eind van elk deel** (open zodra alle acht zaken af
  zijn): na de ceremonie van de laatste zaak schuift de kist in beeld, tik om
  te openen: deksel klapt open, gloed, stralen, en de beloningen springen
  tevoorschijn (+300 punten, een vrije dag, een stempel; +1000 bij het laatste
  deel van een wereld). Daaronder meteen de knop "▶ Deel II · De erfgenamen".
  Wie een deel al af had, vindt de kist op de kaart met "Open mij!". Stempels
  staan per wereld in de vitrine. `App.showChest/openChest`,
  `Campaign.openChest`, sleutels `crimson-chests` en `crimson-mini`.
- **Nieuwe wereld = onthulling**: de kaart van het deel is nu in de kleur van de
  wereld met langzaam draaiende stralen; bij deel I komt de banner van de
  wereld erbovenop en verschijnen alle acht verdachten één voor één, met wat
  je te wachten staat (aantal delen en zaken, minigames, kisten). Bij een
  nieuw deel: icoon, titel, intro en de belofte van de kist.

## Wie is wie, en twee nieuwe werelden (15 sep)

Jaimy: "in game vind ik het lastig om te herkennen wie wie is … als ik naar de
volgende stap ga ben ik alweer kwijt wie wie is. Na Station Orion moeten andere
thema's komen, dit mag je bedenken en samen met Figma."

- **Wie is wie.** Elke geplaatste verdachte draagt op het bord een naamkaartje
  in zijn eigen kleur ("Pike", "Cross", "Nik": `Themes.shortName`). In de
  kiezer staat onder een geplaatste naam zijn kamer ("✓ Kelder"), de rand van
  de chip heeft de kleur van de verdachte, en als je een verklaring aantikt
  licht niet alleen de kamer op maar ook het vakje van de spreker. Ook in de
  minigames.
- **Het Museum** (wereld 5, open na 12 zaken): nacht in het Museum van
  Vlierbeek, conservator Adriaan Vos, terrazzovloer, twaalf zalen (Egyptische
  Zaal, Dinozaal, Kluis, Depot …), meubels sarcofaag / schilderij / dinoskelet /
  vitrine / standbeeld, cast Gids Fenna, Curator Bas, Restaurateur Imke,
  Nachtwaker Ruud, Professor Adebayo, Kunsthandelaar Vic, Stagiair Noor,
  Schoonmaker Piet. Delen: Na sluitingstijd · De verdwenen diamant · De
  tentoonstelling · Het depot · De nacht van de dino's · Het geheim van
  Vlierbeek.
- **De Nachttrein** (wereld 6, open na 16 zaken): de nachttrein naar Wenen,
  1934, conducteur Leon Marchetti, tapijtvloer, twaalf wagons (Restauratiewagen,
  Salonwagen, Coupé A/B, Locomotief …), meubels hutkoffer / samovar /
  grammofoon / bank / kroonluchter, cast Barones Von Stahl, Goochelaar Otto,
  Schaakmeester Ivo, Verpleegster Ans, Reiziger Sami, Actrice Lola, Stoker
  Jules, Weduwe Duval. Delen: Vertrek · De sneeuw · De grens · De Oriënt-route
  · Het feest in de salonwagen · Eindstation.
- Elke wereld heeft eigen kaartkunst (banner en zeven decoraties), een eigen
  kaartachtergrond, weektitels, een wereldmedaille en 48 bewijsstukken. Totaal
  nu 288 zaken, 864 sterren, 36 minigames en 36 bewijskisten.
- **Figma**: `docs/werelden.html` is een conceptbord met alle zes werelden
  (banner, palet, cast, meubels, ruimtes, delen) en twee ideeën voor daarna,
  **Het Circus** en **De Skihut**. Het staat in Figma als
  "Crimson Ledger · Werelden" (https://www.figma.com/design/RCm5uHCwOEnYs4CJDxnr29)
  om samen verder te tekenen; de pagina is via de capture-toolbar opnieuw te
  vangen na wijzigingen.

## Hints in drie stappen, sterren op de kaart, Circus en Skihut (15 sep, avond)

Jaimy: hints moeten makkelijker te begrijpen zijn; Circus en Skihut uit Figma
moeten af en in het spel; de sterren op de kaart zijn "helemaal niet
overzichtelijk"; en de vraag of levens zoals bij Duolingo inkomsten kunnen
opleveren; als alles af is een Engelse versie met een taalkeuze in de
instellingen.

- **Hint van Van Dam in drie stappen.** Geen losse zin meer over "aanwijzing 2",
  maar: **1 · Kijk naar** (de verklaring zelf als kaart, met portret), **2 · Dat
  betekent** (uitleg in gewone taal met de namen en kamers van deze zaak:
  "Clara staat op het vakje links, rechts, boven of onder een boekenkast. Schuin
  telt niet."), **3 · Doe dit** ("Er is maar één vakje over: het oplichtende
  vakje in de Kelder. Sleep Clara daarheen." / bij een fout: "Sleep Clara van
  het bord af. Nu staat Clara in de Woonkamer. …"). De knop heet "Laat zien op
  het bord", het dek springt naar die verklaring, en de kop zegt eerlijk dat een
  hint de zaak op maximaal twee sterren zet. `Mentor.explain`, `Mentor.hintAction`.
- **Sterren op de kaart.** Opgeloste zaken zijn nu gevuld in de wereldkleur met
  een groen vinkje; eronder een wit pilletje met drie sterren waarvan de gemiste
  grijs zijn. De wegwijzer van een deel telt "3/8 · ★ 7". Onder de wereldkiezer
  staat de regel: ★★★ zonder hint én in één keer, ★★ één van de twee, ★
  opgelost. Dezelfde uitleg staat in het venster van een zaak.
- **Het Circus** (wereld 7, open na 20 zaken): directeur Ferdinand Zano in de
  piste, zaagselvloer, ruimtes Piste, Tribune, Kleedwagen, Dierentent, Kassa …;
  meubels circuskanon, trapeze, spiegelkast, popcornkar, leeuwenkooi; cast Clown
  Pippo, Trapezeartiest Mira, Leeuwentemmer Kurt, Waarzegster Zora, Sterke Man
  Boris, Kaartverkoper Els, Jongleur Teo, Dierenarts Nadia. Delen: De laatste
  voorstelling · De verdwenen leeuw · Het spiegelpaleis · Op tournee · De nieuwe
  directeur · De tent gaat dicht.
- **De Skihut** (wereld 8, open na 24 zaken): gastheer Anton Berger bij een koude
  kachel, houten balkenvloer, ruimtes Gelagkamer, Sauna, Skiberging, Terras,
  Zolder …; meubels kachel, slee, skirek, gewei, fonduepan; cast Skilerares
  Mieke, Bergredder Tom, Toeriste Hana, Kok Luigi, Fotograaf Sven, Dokter Greet,
  Jongen Kai, Berggids Ilse. Delen: De lawine · Sneeuwblind · De nacht van de
  storm · Dooi · Het skifeest · De laatste afdaling.
- Totaal nu **acht werelden, 384 zaken, 1152 sterren, 48 minigames en 48
  bewijskisten**. Het Figma-bord "Crimson Ledger · Werelden" is opnieuw gevangen
  met de acht gebouwde werelden en twee nieuwe ideeën: Het Kasteel en De
  Onderzeeër.

### Levens en inkomsten: advies

Levens zoals bij Duolingo raden we af voor dit spel. Bij een taal-app straffen
hartjes fouten tijdens het oefenen; hier is een verkeerd geplaatste verdachte
juist de manier waarop je leert redeneren, en een kind dat na drie fouten moet
wachten stopt (dat is precies de "wachten of betalen"-muur die Apple in de
categorie Kids ook streng bekijkt). De inkomstenkant van Duolingo zit bovendien
niet in de hartjes zelf maar in het abonnement dat ze weghaalt.

Wat wél past bij een logica-puzzel, in volgorde van kansrijkheid:

1. **Crimson Pass** (eenmalige aankoop, bijvoorbeeld € 4,99, of € 1,99 per
   maand): alle werelden vanaf 3, onbeperkte hints, twee extra vrije dagen per
   week, en de exclusieve werelden die daarna komen (Kasteel, Onderzeeër).
   Gratis blijven Het Landhuis en Het Piratenschip volledig speelbaar, plus de
   dagelijkse zaak, de zaak van de week en het archief.
2. **Hints als de zachte grens** (dit is de "energie" van puzzelgames): drie
   hints per dag gratis, daarna een beloningsvideo kijken voor één hint, of de
   Pass. Hints beperken raakt nooit de voortgang: je kunt altijd doorspelen
   zonder hint.
3. **Wereldpakketten** los te koop (€ 1,99 per wereld) voor wie geen abonnement
   wil.
4. **Cosmetica**: bordthema's (nacht, sepia), portretlijsten, een eigen
   detectivenaam op het resultaatscherm.

Bewust niet: levens, wachttijden, loot boxes, en advertenties in het spel zelf
(alleen de vrijwillige beloningsvideo voor een hint). Dit is nog niet gebouwd;
het vraagt StoreKit-producten in App Store Connect en een keuze voor prijzen.

### Engels (en later meer talen): plan

Alles is nu nog vaste Nederlandse tekst in de code. Volgorde van aanpak:

1. Een `i18n.js` met een `t(key, vars)`-functie en per taal een woordenboek;
   de taal in instellingen (Nederlands / English), onthouden in
   `crimson-lang`, en bij de eerste start de taal van het toestel.
2. Eerst de systeemteksten: alle knoppen, schermen, opdrachten, medailles,
   hints, uitleg, verklaringen (de zinnen in `FloorPlan.statement` en
   `formatClue`), Van Dam.
3. Dan de inhoud: kamers, meubels, verdachtennamen (titels vertalen, namen
   houden), 48 delen met intro/outro/briefing, 384 zaaktitels en verhaaltjes,
   week- en dagtitels. Dat is het grootste stuk en vraagt een goede vertaler.
4. App Store-teksten en schermafbeeldingen per taal.

Later talen: Duits en Frans zijn logisch (markten met veel puzzelspelers en
dezelfde speelstijl); daarvoor moet het woordenboek alleen worden uitgebreid.

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

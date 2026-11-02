# Crimson Ledger: Dynamic Island en Live Activities, voorbeelden om uit te kiezen (02-11-2026)

Vraag van Jaimy (2 november): "mobile app animations toevoegen (Apple's Dynamic Island) … zelf veel voorbeelden
opzoeken op het internet, alternatief dan Mobbin, en eerst laten zien zodat ik kan kiezen en daaruit onze prototype
toepassen." Dit stuk is de keuzelijst. Er is nog niets gebouwd.

Zusterstuk: `docs/onderzoek/MELDINGEN-ANIMATIES-2026-11.md` (meldingen en animaties in de app). Daar heten de
voorbeelden M… en A…; hier heten ze **D1–D30** en de ideeën **DI-1–DI-5**.

**Schermafbeeldingen** staan in
`/private/tmp/claude-501/-Users-jaimycai/4b665c0e-1f47-4ec1-80b1-80218956e1fb/scratchpad/onderzoek-di/`
(36 stuks, genummerd; lijst onderaan). Dat is een tijdelijke map: kopieer ze naar de repo als je ze wilt bewaren.
Alle beelden zijn schermafdrukken van openbare webpagina's; er is niets gedownload. Mobbin is niet gebruikt.

## In het kort

- **Wat het is.** Een Live Activity is een kaartje dat een lopende gebeurtenis met een begin en een eind volgt. Het
  staat op het toegangsscherm en (iPhone 14 Pro en nieuwer) in het Dynamic Island, en verschijnt vanzelf ook op de
  Apple Watch, in de Mac-menubalk en in CarPlay.
- **Wat het best past bij ons:** de klok en voortgang van een **lopende zaak** (DI-1), met een **eindstand met stempel**
  (DI-2). Dat volgt Apple's regels letterlijk, werkt volledig lokaal (geen server) en de klok tikt zonder updates.
  Daarna, als je wilt: **"streak op het spel"** 's avonds (DI-3) en **"zaak van de week sluit"** op zondag (DI-4).
- **Beste voorbeelden om naar te kijken:** Citymapper (D27, scherm 03: alle standen op één plaat), Uber (D26, scherm
  13 en 14), Flighty (D25), Forest (D12), het Duolingo XP-concept (D10, scherm 37), en als waarschuwing de Duolingo-
  reclame (D9, scherm 15) en Merge Adventure (D11, scherm 16).
- **Techniek.** Een Widget Extension in Xcode (SwiftUI) plus een eigen Swift-brug zoals onze `StorePlugin` en
  `ReviewPlugin`. Geen push-server nodig. Live Activities vragen iOS 16.1; de app mag op iOS 15 blijven.
- **Regels.** Geen reclame of aanbiedingen, alleen gebeurtenissen met een begin en eind, hoogstens 8 uur actief
  (12 uur op het toegangsscherm), 4 KB gegevens, animaties hooguit 2 seconden.
- **Nieuw.** iOS 26: Live Activities **inplannen** op een tijdstip, CarPlay, Mac-menubalk, AlarmKit. iOS 27: het
  eiland ook **liggend** (compacte weergave moet in een cirkel van 28 pt passen), StandBy op 200 %, en de iPhone 18 Pro
  toont tot drie activiteiten (de derde alleen van het systeem).

---

## 1. De vijf standen in één oogopslag

Bron: Apple HIG Live Activities (laatst bijgewerkt 13-10-2026), scherm 01 en 02.

| Stand | Wanneer | Maat (iPhone 6,9″ / 6,3″, in pt) | Wat erin hoort |
|---|---|---|---|
| **Compact** (links + rechts van de camera) | Eén Live Activity actief, app niet open | 62,33×36,67 / 52,33×36,67 per kant | Eén ding dat nu telt; links en rechts lezen als één geheel |
| **Minimal** (los bolletje) | Twee of meer activiteiten tegelijk | 36,67–45 × 36,67 | Het allerbelangrijkste getal, liefst geen logo maar een waarde (de Timer toont de resterende tijd) |
| **Expanded** | Lang drukken, of een update met alert | 408 × 84–160 | Vergrote versie van compact; strak rond de camera |
| **Toegangsscherm** | Altijd, onderaan het toegangsscherm | 408 × 84–160 | Eigen opmaak (geen meldingskopie), marge 14 pt, eigen achtergrondkleur mag |
| **Beperkte breedte** (nieuw, iOS 27 liggend) | Eiland liggend | 28×28 (cirkel) | Afkorting of symbool, geen hele zin; alleen links mag, dan verdwijnt rechts |

Overige plekken: **StandBy** (toegangsscherm-weergave ×2), **Apple Watch** Smart Stack en **CarPlay** (samenvoeging
van compact links+rechts, of een eigen `.small`-weergave), **Mac-menubalk** (compact; klik opent iPhone-mirroring).
Het eiland heeft altijd een zwarte achtergrond; Apple raadt "bold colors" aan om herkenbaar te zijn. Gebruik een
logo zonder kader, nooit het hele app-icoon.

---

## 2. Overzicht van de 30 voorbeelden

Legenda "past bij ons": ★★★ direct bruikbaar, ★★ idee lenen, ★ alleen inspiratie, ✗ niet doen.

| # | Voorbeeld (maker) | Soort | Wat het toont | Beweging | Past | Scherm |
|---|---|---|---|---|---|---|
| D1 | LogicGrid (JAMSoft) | dagelijkse logicapuzzel | aftellen van een getimede ronde | lopende timer | ★★★ | 19 |
| D2 | Daily City Planner (T. Ruiz-López) | dagelijkse deductiepuzzel | "today's commission" + seizoensthema | thema-wissel | ★★★ | 23 |
| D3 | Sudoku+ | sudoku | snel hervatten vanuit het eiland | geen | ★★ | 20 |
| D4 | NineCells | multiplayer-sudoku | wedstrijd op toegangsscherm en eiland | rode puls laatste 10 s (in app) | ★★ | 21 |
| D5 | Mechanym | dagelijkse woordpuzzel | hoe je ronde ervoor staat | personage reageert (in app) | ★★ | 22 |
| D6 | Keeping Score! | scorebord voor spellen | tot 4 spelers + afteltimer | lopende timer | ★★ | 33 |
| D7 | Pixel Pals (Christian Selig) | virtueel huisdier | dier dat rent/slaapt in het eiland | ~1 beeld/s via fonttruc | ★ | 11, 18 |
| D8 | Hit the Island (Kriss Smolka) | spel rond het eiland | bal tegen het eiland | eiland "schrikt" | ✗ | 34 |
| D9 | Duolingo | taal + streak | streak-aftelling vóór middernacht; reclame-incident | aftellen | ★★★ / ✗ | 15 |
| D10 | Duolingo XP Boost (concept, zach zhu) | gamificatie | dubbele XP nog 14:59 | aftellen | ★★★ | 37 |
| D11 | Merge Adventure | mobiel spel | "Claim your offer" nog 7:49:59 | aftellen + balk | ✗ | 16 |
| D12 | Forest | focus, gamified | boom groeit + aftellen | lopende timer | ★★★ | 24 |
| D13 | Tiimo (iPhone-app van het jaar 2025) | planner/focus | taak + "43 min 9 s" + balk + ring | balk, ring | ★★ | 25 |
| D14 | Structured | dagplanner | focustimer | aftellen | ★ | — |
| D15 | Wakeout | pauzecoach | icoontje + aftellen tot volgende pauze | rustig vs. groot | ★★ | 05 |
| D16 | LookUp | woordenboek | leesstand; laatste woord + definitie | geen | ★★ | 08 |
| D17 | Gentler Streak | training | workout en hartslagzones | live waarden | ★ | — |
| D18 | Klok-Timer en AlarmKit (Apple) | timer | resterende tijd, pauze/stop | aftellen + ring | ★★ | 29 |
| D19 | Crouton | kookstappen | stap + timer, stapel van stappen | aftellen | ★★ | 10 |
| D20 | SmartGym | training | oefening + rustteller | ring telt af | ★ | 06 |
| D21 | Kounts / Exam Countdown | aftellen naar gebeurtenis | verschijnt vanzelf in de laatste uren | aftellen | ★★ | 32, 36 |
| D22 | Apple Sports | sport | stand, play-by-play, ingepland | cijferovergang | ★★ | 26, 01 |
| D23 | MLB-app (WWDC26-voorbeeld) | honkbal | stand, inning, honken-ruitje | cijferovergang | ★★ | 01, 27 |
| D24 | FotMob | voetbal | meerdere wedstrijden in één | rouleren | ★ | — |
| D25 | Flighty (Apple Design Award 2023) | vlucht | gate + aftellen → voortgangsbalk; ring | fasewissel | ★★★ | 04, 12, 17, 35 |
| D26 | Uber | rit | ophalen over X min, auto op balk | niet-lineaire balk | ★★★ | 13, 14 |
| D27 | Citymapper | OV-reis | icoon + "2 min" per fase | fasewissel | ★★★ | 03 |
| D28 | CARROT Weather | weer | regen binnen het uur + grafiek | grafiek | ★ | 09 |
| D29 | Apollo | Reddit-app | aantal reacties, beste reactie | teller | ★ | 07 |
| D30 | Dribbble/Behance-concepten | ontwerpen | score, timer, tracking | wisselend | ★ | 30 |

---

## 3. De voorbeelden, één voor één

Waar een bron een stand niet beschrijft, staat er "niet beschreven". Er is niets ingevuld op gevoel.

### A. Puzzels en spellen (het dichtst bij ons)

**D1. LogicGrid: Daily Logic Puzzles (JAMSoft Inc).** Een dagelijkse rooster-deductiepuzzel met één wereldwijde
dagpuzzel en streak, dus bijna ons genre. In versie 3.4 kwam: "Timed games now show a live countdown on the Lock
Screen and in the Dynamic Island", plus een opt-in avondherinnering als de dagpuzzel nog open staat (dat laatste is
een melding, geen Live Activity). Compact, minimal en expanded: niet beschreven; de kern is een lopende afteltimer.
*Past bij ons:* ★★★. Precies DI-1 voor een concurrent. Let op: zij doen het alleen in de getimede modus; wij hebben
de klok standaard aan, met een "rustige stand" zonder klok. Bronnen: release notes zoals geïndexeerd op
https://apppage.net/preview/ios/6753323322 (zelf geblokkeerd door een botcontrole, niet omzeild) en de App Store-pagina
https://apps.apple.com/app/id6753323322 (scherm 19; de huidige tekst noemt de Live Activity niet meer).

**D2. Daily City Planner (Tomás Ruiz-López).** Elke dag één stadsplattegrond-deductiepuzzel met één oplossing:
qua gevoel een broertje van onze plattegrond. De App Store-tekst: "Widgets and Live Activities to keep today's
commission close". In oktober 2026 kreeg het een Halloween-thema "including a themed Live Activity" tot 31 oktober.
Standen: niet beschreven. *Past bij ons:* ★★★ voor het idee "de opdracht van vandaag" en voor **seizoensthema's** (wij
hebben werelden en thema's per dag). Bron: https://appagg.com/ios-games/puzzle/daily-city-planner-44188133.html en
https://truizlop.github.io/daily-city-planner-site/ (scherm 23).

**D3. Sudoku+ Classic Puzzle.** Sinds maart 2023: "Welcome to Dynamic Island, quick resume game from Dynamic Island
just one tap" en hervatten vanaf het toegangsscherm. De App Store-schermen hebben een eigen plaat "Dynamic Island" en
"Live Activity" (scherm 20). Een tik op het eiland brengt je terug in je bord. *Past bij ons:* ★★. Het nut (terug
naar je zaak) is goed; zonder klok of voortgang is het wel een kale snelkoppeling. Wij hebben al een
hervat-sleutel (`Board.RESUME_KEY`), dus de tik kan direct naar de zaak. Bron:
https://apps.apple.com/us/app/sudoku-classic-puzzle/id1467609353

**D4. NineCells | Multiplayer Sudoku.** Realtime sudoku-duels, dagelijkse puzzel met streak en vries-dagen, en
"Lock Screen / Dynamic Island Live Activities". In de app: "a bold 'Your Turn!' cue, and a gentle red pulse in the
last 10 seconds". Standen van de Live Activity: niet beschreven. *Past bij ons:* ★★ als bron voor één spanningsmoment:
een kleurwissel van goud naar rood als een tijdbonus bijna verloopt (in een Live Activity kan dat als stille kleurwissel
via een update, niet als echte puls). Bron: https://apps.apple.com/us/app/ninecells-multiplayer-sudoku/id6762876916
(scherm 21).

**D5. Mechanym: Daily Word Puzzle.** Dagelijkse woordpuzzel met een "machine"-personage met een geheime regel.
"Widgets and Live Activities show how your round stands." Standen: niet beschreven. *Past bij ons:* ★★. "Hoe je ronde
ervoor staat" is voor ons: hoeveel verdachten nog over, hoeveel aanwijzingen afgevinkt. Het personage dat reageert,
lijkt op wat Van Dam bij ons kan doen. Bron: https://apps.apple.com/us/app/mechanym-daily-word-puzzle/id6816660925
(scherm 22).

**D6. Keeping Score!** Scorebord voor bord- en kaartspellen. Toegangsscherm: speltitel, tot 4 spelers met score,
afteltimer bij getimede spellen. Compact: "score summary". Expanded: titel, spelerslijst, timer. Minimal: het app-icoon
(volgens Apple juist níet ideaal; liever een waarde). Alleen lezen: je kunt er niet mee scoren. Start vanzelf als
een spel loopt. *Past bij ons:* ★★, vooral de nuchtere opbouw. Bron:
https://www.keepingscore.app/docs/beyond-the-basics/live-activities/ (scherm 33).

**D7. Pixel Pals (Christian Selig).** Pixel-huisdieren die in het eiland rennen, slapen of spelen; ook op het
toegangsscherm. Lang drukken: naam plus knoppen Instellingen, Voeren, Spelen (die openen de app). Het eiland wordt er
iets breder van. De animatie is opvallend: ontwikkelaars op r/iOSProgramming vragen hoe een "continuous 1fps
animation" lukt; het antwoord in de draad is "Using image as a font" (een eigen lettertype met animatiebeelden dat met
een tikkende tijdtekst van glyph wisselt). *Past bij ons:* ★. Wow, maar er is geen gebeurtenis met een eind, en Apple
beperkt elke activiteit tot 8 uur. Wel bruikbaar als **truc** voor een klein bewegend vergrootglas of Van Dam (DI-5).
Bronnen: https://www.macstories.net/reviews/ios-16-1-and-apps-with-live-activities-the-macstories-roundup-part-1/
(scherm 11), https://apps.apple.com/us/app/pixel-pals-widget-pet-game/id6443919232 (scherm 18),
https://www.reddit.com/r/iOSProgramming/comments/1l1yc6s/how_the_heck_did_they_get_a_1fps_animation_in_the/

**D8. Hit the Island (Kriss Smolka).** Pong-achtig spel: je kaatst een bal tegen het eiland, dat "reacts and animates
when it's struck". Dit is geen Live Activity maar een spel in de app dat het eiland als doel gebruikt. *Past bij ons:*
✗. Leuk voor 2022, maar Apple's HIG zegt nu: "Don't add elements to your app that draw attention to the Dynamic
Island." Bron: https://www.macrumors.com/2022/09/16/hit-the-island-dynamic-island-game-iphone-14-pro/ (scherm 34).

**D9. Duolingo (streak-aftelling én reclame-incident).** Twee kanten van hetzelfde bedrijf.
- *Goed:* een Reddit-gebruiker (r/ios, januari 2025): "If you haven't practiced today and it's approaching midnight…
  there's a live activity, counting down and encouraging you to keep your streak alive. … there's a cute icon in the
  Dynamic Island." Ook retention.blog: "Duolingo primarily uses them for streak and lesson reminders."
- *Fout:* in januari 2026 toonde Duolingo in het eiland en op het toegangsscherm "Claim your Super offer!" met een
  aftelling (59:19) voor het betaalde abonnement (scherm 15). MacRumors noemt het een overtreding van de HIG-regel
  "Don't use a Live Activity to display ads or promotions."

*Past bij ons:* ★★★ voor de streak-aftelling (DI-3), ✗ voor alles wat naar de Crimson Pass of de winkel wijst. De
grens is dun: dezelfde aftelvorm met een aanbieding erin is reclame. Bronnen:
https://www.reddit.com/r/ios/comments/1i9idnb/why_dont_more_apps_take_full_advantage_of_these/ ,
https://www.retention.blog/p/widgets-and-live-activities ,
https://www.macrumors.com/2026/01/02/duolingo-dynamic-island-ad/

**D10. Duolingo XP Boost: Live Activity & Dynamic Island (concept van zach zhu, Dribbble, december 2023).** Geen
echte Duolingo-schermen, wel het mooiste speelse voorbeeld dat ik vond (scherm 37). Toegangsscherm: gele kaart met Duo
en een "2x"-badge, "Your XP Boost is activated! Double XP for the next 14m 59s". Compact: Duo links, "14m" rechts.
Expanded: Duo groot links, "14:59 / XP Boost remaining" rechts in groot wit cijfer. *Past bij ons:* ★★★ als
**beeldtaal**: mascotte links, één groot getal rechts, merkkleur in de kaart. Voor ons: een stempel of Van Dam links en
de klok of de streak rechts. Bron: https://dribbble.com/shots/23943203-Duolingo-XP-Boost-Live-Activity-Dynamic-Island

**D11. Merge Adventure (mobiel spel, maart 2025).** Op het toegangsscherm: "Claim Your Offer! Remaining 7:49:59" met
een voortgangsbalk en een stopwatchje, plus het systeemvenster "Allow Live Activities from Merge Adventure?"
(scherm 16). De schrijver bij Gamigion noemt het juichend "monetization". *Past bij ons:* ✗. Dit is precies wat Apple
verbiedt (geen reclame, en Richtlijn 4.5.3: Live Activities niet gebruiken voor "unsolicited messages"). Handig om te
zien: iOS vraagt de speler op het toegangsscherm zelf om toestemming ("Don't Allow" / "Allow"); wie zich één keer
gestoord voelt, zet het voor de hele app uit. Bron: https://www.gamigion.com/apple-live-activities-being-used-in-a-mobile-game/

### B. Gewoontes, focus en leren

**D12. Forest.** Je plant een boom die groeit zolang je je telefoon laat liggen. Toegangsscherm: boom in een
cirkel, aftelling (24:23) en knoppen "Keep" en "Turn Off". Eiland: boompje links, tijd (24:17) rechts (scherm 24).
*Past bij ons:* ★★★. Het beste bewijs dat een gamified beeld (de boom) plus één getal werkt. Voor ons: een dossiermap
die zich vult, of een vergrootglas, plus de klok. Bronnen:
https://www.macrumors.com/2022/10/24/live-activities-dynamic-island-apps/ ,
https://onesignal.com/blog/12-examples-of-apps-using-live-activities-to-enrich-their-ux/

**D13. Tiimo (iPhone-app van het jaar 2025).** Eiland: taak-emoji links, "Get your toughest work done 42:43".
Toegangsscherm: taaknaam, "43 min 9 secs", een dunne voortgangsbalk en rechts een ring met icoon (scherm 25). De
timer start vanzelf als een geplande taak begint. *Past bij ons:* ★★. Rustig, warm en leesbaar; de combinatie
balk + ring + één zin is een goed sjabloon voor ons toegangsscherm. Bronnen:
https://www.tiimoapp.com/product/widgets-live-activities ,
https://www.tiimoapp.com/resource-hub/tiimo-winner-2025-app-store-awards

**D14. Structured.** Dagplanner; de Live Activity is een focustimer die laat zien hoeveel tijd er nog is. Apple
lichtte de app uit bij "See Live Activities on Mac" (iOS 26). *Past bij ons:* ★. Bronnen:
https://www.macrumors.com/2022/10/24/live-activities-dynamic-island-apps/ ,
https://apps.apple.com/mo/ipad/story/id1828255084?l=en-GB

**D15. Wakeout.** Pauzecoach. Compact: een klein icoon (bijvoorbeeld een waterfles) met een aftelling tot de
volgende gezonde pauze. Twee intensiteiten: korte pauzes zijn "passive; if you don't pay attention, they dismiss
themselves", een echte bewegingspauze is "a big state change on screen" (scherm 05). *Past bij ons:* ★★. Een goede
les voor DI-3: het meeste moet rustig blijven en alleen het echte moment (streak verloopt bijna) mag opvallen.
Bron: Apple, "Spotlight on: The Dynamic Island", https://developer.apple.com/news/?id=mis6swzt

**D16. LookUp (Vidit Bhargava).** Woordenboek met een "leesstand": je zet een leestimer, de app gaat naar het
eiland, en als je een woord kopieert en op het eiland tikt, opent LookUp met de definitie. Lang drukken of
toegangsscherm: het laatst opgezochte woord met definitie en knoppen (scherm 08). MacStories noemt het "one of the most
interesting and innovative uses of Live Activities". *Past bij ons:* ★★. Het eiland als **notitieboekje**: het laatste
bewijsstuk of de laatst geschrapte verdachte in de uitgeklapte stand. Bron:
https://www.macstories.net/reviews/ios-16-1-and-apps-with-live-activities-the-macstories-roundup-part-1/

**D17. Gentler Streak.** Trainingsapp (Apple Watch-app van het jaar 2022) met een Live Activity voor de workout en
hartslagzones; de eerste sessie gratis, daarna premium. Standen: niet beschreven. *Past bij ons:* ★, vooral de naam
en toon ("streak" zonder schuldgevoel). Bron:
https://bgr.com/tech/gentler-streak-adds-live-activity-support-in-app-mirror-tracking/

### C. Timers en aftellen

**D18. Timer in de Klok-app en AlarmKit (Apple).** De norm voor timers. Apple's HIG: "the Timer app's minimal Live
Activity presentation displays the remaining time instead of a static icon." Sinds iOS 26 krijgen andere apps
hetzelfde via **AlarmKit** ("countdowns right on your Lock Screen", alarmen die Focus mogen doorbreken). Op de iPhone 18
Pro toont het eiland bij twee activiteiten nu ook bij de tweede de resterende tijd (9to5Mac: "Before, it only showed
a timer icon", scherm 29). *Past bij ons:* ★★ als maatstaf: ons minimal moet een **waarde** tonen (klok of
voortgangsring), geen logo. Bronnen: HIG (scherm 01), https://developer.apple.com/videos/play/wwdc2025/230/ ,
https://9to5mac.com/2026/09/22/iphone-18-pros-best-dynamic-island-feature-is-one-apple-barely-mentioned/

**D19. Crouton (Devin Davies).** Recepten. Eiland: de lopende timer van een stap. Lang drukken: miniatuur van het
recept plus knoppen (die openen de app). Toegangsscherm: een stapel kaarten, één per stap met een lopende timer en de
staptekst. Lopen er twee timers, dan komt de tweede pas als de eerste klaar is (scherm 10). *Past bij ons:* ★★. "Stap +
tijd" is voor ons "aanwijzing 7 van 12 + klok". Bron:
https://www.macstories.net/reviews/ios-16-1-and-apps-with-live-activities-the-macstories-roundup-part-1/

**D20. SmartGym (Matt Abras).** Toont soort en duur van de huidige oefening en een grote rustteller (een ring met
"27"). Abras schrapte hartslag en calorieën: "I had to focus on staying out of the way" (scherm 06). *Past bij ons:*
★. Les: schrap. Bron: https://developer.apple.com/news/?id=mis6swzt

**D21. Kounts en Exam Countdown.** Aftellen naar een datum. Kounts: op de dag zelf verschijnt een "self-ticking"
aftelling op het toegangsscherm en in het eiland, "with no toggles or setup"; tik opent het evenement. Exam Countdown:
"When your next exam is less than 12 hours away" komt er een Live Activity met vak en resterende tijd, en "It goes away
by itself once the exam starts" (scherm 32, 36). *Past bij ons:* ★★ voor DI-4 (de zaak van de week sluit zondag om
middernacht): pas in de laatste uren, en daarna vanzelf weg. Bronnen: https://kounts.app/live-activity-countdown ,
https://examcountdown.app/help/live-activity/

### D. Sport en score

**D22. Apple Sports.** Sinds iOS 18 voor alle teams: live stand en play-by-play op het toegangsscherm, in het eiland
en op de Watch. Je kunt een activiteit **inplannen** voor een wedstrijd die nog niet begonnen is, en voor favoriete
teams start hij vanzelf. Versie 4.5 (oktober 2026) toont tijdens onderbrekingen kerncijfers. Een veeg naar links stopt
één wedstrijd; het team-schakelaartje blijft aan (scherm 26). *Past bij ons:* ★★. Het inplannen is precies wat DI-3 en
DI-4 nodig hebben, en Apple geeft per team een eigen aan/uit-knop: zo hoort de bediening eruit te zien. Bronnen:
https://www.macrumors.com/2024/08/29/apple-sports-live-activities-and-more/ ,
https://support.apple.com/guide/apple-sports-app/follow-games-in-real-time-apdc0cb7ad64/web ,
https://appdook.com/news/how-to-follow-teams-live-activities-apple-sports-app-iphone

**D23. MLB-app (Apple's eigen voorbeeld).** De hoofdplaat van de HIG (scherm 01): compact "KC 7 · SF 6"; uitgeklapt
de teams groot met werpercijfers, in het midden een **ruitje met de honken** en "Bot 9th 3-2, 2 out". Apple gebruikt de
MLB-app ook in WWDC26-sessie 223 ("score, current inning, key updates"). OneSignal noemt: stand, inning, outs,
worpen, lopers op de honken. *Past bij ons:* ★★. Het honken-ruitje is een prachtig voorbeeld van een **mini-graphic
die een toestand vertelt** in een paar punten. Voor ons: een mini-plattegrond met ingevulde kamers. Bronnen: HIG,
https://developer.apple.com/videos/play/wwdc2026/223/ (scherm 27), OneSignal (zie D12).

**D24. FotMob.** Volgt meerdere voetbalwedstrijden in één Live Activity. Apple raadt dit aan: "prefer a single Live
Activity that uses a dynamic layout and rotates through events." *Past bij ons:* ★. Alleen relevant als we ooit
dagzaak en weekzaak tegelijk volgen: dan één activiteit, niet twee. Bron: OneSignal (zie D12), HIG.

### E. De beste "wow"-voorbeelden in het algemeen

**D25. Flighty (Apple Design Award 2023, Interaction).** Start vanzelf drie uur voor vertrek. Vóór vertrek: gate en
een **aftelling** tot vertrek in het compacte eiland, opgebouwd als een vertrekbord ("Those signs have one line per
flight"). Bij een belangrijke wijziging (vertraging) **klapt het eiland zelf uit**. Na het wegrijden schakelt alles naar
**voortgangsbalken en tellers** die zonder internet blijven kloppen; de **minimal is een ringdiagram** van de
vluchtduur (scherm 04, 12, 17, 35). *Past bij ons:* ★★★. Drie lessen: (1) de inhoud wisselt per fase, (2) alles
wat tijd is, rekent het toestel zelf uit, (3) alleen écht nieuws mag het eiland openklappen. Bronnen:
https://developer.apple.com/news/?id=mis6swzt , https://developer.apple.com/news/?id=970ncww4 ,
https://9to5mac.com/2022/10/24/flighty-dynamic-island-iphone-live-activities/

**D26. Uber.** Het team ordende de inhoud streng: P0 tijd tot ophalen of aankomst, P1 kenteken en foto van auto en
chauffeur, P2 de voortgang van de rit. Eiland per fase: "Uber" (zoeken), "Uber 8 min" (onderweg), "1 min" (bijna),
een zwaaiend handje met chauffeursfoto (aangekomen), "3:42 PM" (in de auto). Toegangsscherm: "Pickup in 2 min", kenteken,
auto, en een balk waarop een autootje rijdt (scherm 13, 14). Slimste vondst: een **niet-lineaire balk** — "the last 20%
of the progress bar represents the last 2 min of the progress no matter how long the whole waiting time is." Ze moesten
ook zorgen dat de aankomsttijd niet met de klok van de telefoon verward werd. Resultaat: 2,26 % minder annuleringen
door chauffeurs en 2,13 % door reizigers. *Past bij ons:* ★★★. De P0/P1/P2-volgorde is de methode die ik voor DI-1
gebruik. Bron: https://www.uber.com/us/en/blog/live-activity-on-ios/

**D27. Citymapper.** De mooiste plaat in dit onderzoek (scherm 03): voor drie fasen (in de trein, bij je halte,
lopend naar je bestemming) alle standen naast elkaar. Compact: metro-icoon + "2 min", "Now", of loopmannetje + "2 min".
Expanded: "1 stop to Montgomery · 2 min" / "Get off now at Montgomery". Toegangsscherm (licht en donker): een lijn met
haltes, je positie als blauwe stip, "Get off soon", aankomst 10:04. "OK the bus will be here in 10 minutes — now 5 —
now 2." Ze schrapten zelfs bocht-voor-bocht-aanwijzingen: "We didn't want it to get in your way." *Past bij ons:* ★★★.
Laat zien hoe één ontwerp per fase van inhoud wisselt maar dezelfde vorm houdt. Bron:
https://developer.apple.com/news/?id=mis6swzt

**D28. CARROT Weather.** Verschijnt alleen als er binnen het uur neerslag komt. Eiland: soort neerslag en wanneer.
Uitgeklapt en toegangsscherm: een grafiek van intensiteit en duur (scherm 09). *Past bij ons:* ★. Mooi principe: alleen
verschijnen als het ertoe doet. Bron: MacStories (zie D16).

**D29. Apollo (Christian Selig).** Volg een Reddit-draad live: compact "the current number of comments", uitgeklapt
"high-performing comments". Selig: "It's like you write four lines and the widgets are done." (scherm 07). *Past bij
ons:* ★. Bron: https://developer.apple.com/news/?id=mis6swzt

**D30. Concepten op Dribbble en Behance.** De tag "Live Activity" op Dribbble (scherm 30) heeft o.a. "Live Score with
Dynamic Island", "Dynamic Island | Tabata Timer App", "📆 Coming event — iOS Live activities", "Domino's Order Tracking
Live Activity" en het Duolingo-concept uit D10. Op Behance staat "Dynamic Island Animation - Live Score App" (Hasan
Aydın, 2022; de pagina gaf bij het fotograferen een fout). *Past bij ons:* ★. Concepten negeren vaak de echte grenzen
(geen vrije animatie, max. 2 s, zwart eiland); goed voor sfeer, niet voor techniek. Bronnen:
https://dribbble.com/tags/live-activity , https://www.behance.net/gallery/152421917/Dynamic-Island-Animation-Live-Score-App

---

## 4. Wat er technisch nodig is in onze Capacitor-app

**Uitgangspunt in de repo** (gecontroleerd op 02-11): Capacitor 7.6.9, CocoaPods, deployment target iOS 15.0, eigen
Swift-plugins `ReviewPlugin` en `StorePlugin` die in `MainViewController.capacitorDidLoad()` worden aangemeld met
`bridge?.registerPluginInstance(...)`. De dagzaak is een seed per datum (lokaal), de klok per zaak rekent op de
wandklok (`Board.startTimer`: `startTime = Date.now() - elapsedBase*1000`), en er is een hervat-sleutel. Er is geen
eigen server voor spelgegevens. Goed nieuws: alles wat hieronder staat kan **zonder server**.

### 4.1 Onderdelen

1. **Widget Extension** in Xcode (File › New › Target › Widget Extension, "Include Live Activity"). Daarin een
   `ActivityConfiguration` met SwiftUI voor toegangsscherm, expanded, compact links/rechts en minimal. Deployment
   target van de extensie: iOS 16.1 of hoger. De app zelf mag op iOS 15 blijven; aanroepen staan achter
   `if #available(iOS 16.2, *)`.
2. **Gedeeld model** `CaseActivityAttributes: ActivityAttributes` met vaste gegevens (zaaknaam, wereld, of het de dag- of
   weekzaak is) en een `ContentState` (fase, voortgang, startdatum van de klok, streak). Het bestand hoort bij beide
   targets. Totaal hooguit **4 KB**.
3. **Info.plist van de app:** `NSSupportsLiveActivities = YES`. Alleen als we ooit veel updates per uur sturen ook
   `NSSupportsLiveActivitiesFrequentUpdates`.
4. **Eigen Swift-brug** `LiveActivityPlugin` (zelfde vorm als `StorePlugin`): `isAvailable`, `start`, `update`, `end`,
   later `schedule`. Aanmelden in `MainViewController`. JS roept hem aan vanuit `Board` (start bij "Aan de slag",
   update bij een afgevinkte aanwijzing, end bij oplossen of stoppen).
5. **Lettertype en beeld.** Eigen fonts moeten in de extensie zitten (alleen OFL-fonts, zie `DESIGN.md`). Afbeeldingen
   uit de asset-catalogus van de extensie; een App Group is alleen nodig als de app beelden doorgeeft (Uber deed dat
   voor chauffeursfoto's). Voor ons volstaan vaste assets.
6. **Testen** op een echte iPhone met eiland; push, Always-On en StandBy kun je alleen daar goed zien. Bouwen met
   iOS 27-API's (`isDynamicIslandLimitedInWidth`) vraagt de iOS 27-SDK; zet die achter `#if compiler(>=…)` zoals bij
   Spaarplan als de winkelbouw nog op Xcode 26 draait.

### 4.2 Eigen brug of een plugin?

| Optie | Voor | Tegen |
|---|---|---|
| **Eigen Swift-brug** (aanrader) | Zelfde patroon als onze twee plugins; volledig eigen SwiftUI-ontwerp; geen afhankelijkheid | ~150 regels Swift om zelf te onderhouden |
| `@capgo/capacitor-live-activities` | JSON-opmaak zonder Swift, timerreeksen, beelden via App Group | v8 onderhouden, v7 "on demand"; generieke opmaak beperkt het ontwerp; de extensie heeft toch een renderer nodig |
| `capacitor-live-activity` (Kisimedia, ook als fork `@hassankbrian/…` 7.5.1) | Capacitor ≥ 7, eenvoudige start/update/end | Werkt met een generiek `GenericAttributes`-woordenboek; ontwerp blijft in eigen SwiftUI |
| `ludufre/capacitor-live-activities` | JSON-opmaak, voorbeelden voor scorebord en bezorging | Extra pod in de extensie |
| `@ciabosoftwaresolutions/capacitor-live-activities` | Ook Android Live Updates | Vraagt Capacitor 8 |

Een plugin bespaart weinig: het ontwerp (de SwiftUI-kant) moeten we hoe dan ook zelf maken. Bronnen:
https://capgo.app/docs/plugins/live-activities/getting-started/ , https://github.com/Cap-go/capacitor-live-activities ,
https://www.npmjs.com/package/@hassankbrian/capacitor-live-activity ,
https://github.com/ludufre/capacitor-live-activities ,
https://github.com/ciabosoftwaresolutions/capacitor-live-activities

### 4.3 Starten en bijwerken: lokaal, ingepland of via push

| Manier | Sinds | Wat het vraagt | Voor ons |
|---|---|---|---|
| **Lokaal starten** (`Activity.request`) | iOS 16.1 | App moet op de voorgrond zijn | DI-1, DI-2 |
| **Lokaal bijwerken / beëindigen** | iOS 16.1 | Kan ook als de app op de achtergrond nog draait | voortgang, eindstand |
| **Tikken zonder updates** (`Text(timerInterval:)`, `ProgressView(timerInterval:)`) | iOS 16 | Niets: het toestel rekent zelf | de klok, aftellingen |
| **Knoppen** (`Button(intent:)` met `LiveActivityIntent`) | iOS 17 | App Intents in de extensie | eventueel "Pauze" |
| **Ingepland starten** (`request(…, start:)`, met verplichte `AlertConfiguration`) | iOS 26 | Aanvraag terwijl de app open is; start later vanzelf | DI-3, DI-4 |
| **Push-to-start** (APNs-token) | iOS 17.2 | Eigen pushserver + APNs-sleutel | niet nodig |
| **Broadcast-kanaal** (één push voor iedereen) | iOS 18 | Kanaal via Apple's API | niet nodig |

Belangrijk voor onze klok: omdat `Board` op de wandklok rekent, kan de Live Activity met
`Text(timerInterval: start...Date.distantFuture, countsDown: false)` exact dezelfde tijd tonen zonder één update. In de
"rustige stand" (klok uit) tonen we voortgang in plaats van tijd. Bronnen:
https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities ,
https://developer.apple.com/documentation/activitykit/starting-and-updating-live-activities-with-activitykit-push-notifications ,
https://docs.teak.io/ios/latest/live-activities.html

### 4.4 Wat je níet kunt (en wat concepten vaak vergeten)

- **Geen vrije animatie.** "the system ignores any animation modifiers … and uses the system's animation timing".
  Wat wel kan: overgangen bij een update (vervagend tekstwissel, `numericText` voor cijfers, opacity, scale, slide),
  SF-symbool-overgangen, en tikkende timers en balken. Hooguit **2 seconden** per animatie. Op Always-On geen animatie.
- **Geen netwerk in de extensie**, geen eigen toestand; alleen wat de app of een push meegeeft (Uber-blog).
- **Een tik opent de app**; knoppen werken via App Intents (iOS 17+), op CarPlay nooit.
- **Frame-animatie** kan alleen met trucs (fonttruc van Pixel Pals, D7); dat is broos en kost tijd.

---

## 5. Wat Apple toestaat en weigert

**Uit de HIG (versie 13-10-2026) en de ActivityKit-documentatie:**

- **Alleen voor gebeurtenissen met een begin en een eind**, "short to medium duration activities that don't exceed
  eight hours".
- **Maximale duur:** 8 uur actief; daarna beëindigt het systeem hem en haalt hem uit het eiland. Op het
  toegangsscherm blijft hij nog tot 4 uur, dus **maximaal 12 uur** zichtbaar.
- **Geen reclame:** "Don't use a Live Activity to display ads or promotions." (Duolingo en Merge Adventure, D9 en D11.)
- **Geen gevoelige informatie** zichtbaar op het toegangsscherm.
- **Herkenbaar en leesbaar:** eigen stijl in licht én donker, logo zonder kader, nooit het app-icoon, tekst medium of
  zwaarder.
- **Geen elementen in je app die naar het eiland wijzen.**
- **Bijwerken alleen bij nieuwe inhoud**; **alerts alleen voor essentiële updates** (een alert laat het scherm
  oplichten en het eiland uitklappen), en **niet tegelijk een pushmelding voor hetzelfde**.
- **Meteen beëindigen** als de gebeurtenis voorbij is, met een eigen wegtijd: "In most cases, 15 to 30 minutes is
  adequate."
- **In de app uit te zetten**: "Consider offering controls that allow people to turn off a Live Activity in the app";
  anders zetten mensen Live Activities in Instellingen helemaal uit.
- **Eén activiteit die roteert** liever dan meerdere naast elkaar.
- **Data:** statisch + dynamisch samen hooguit **4 KB**. Push-updates hebben een **uurbudget** (prioriteit 5 of 10).
- **Aantal:** er is een systeemgrens aan gelijktijdige (en ingeplande) activiteiten; fouten netjes afvangen.

**Uit de App Store-richtlijnen:** 4.5.3: "Do not use Apple Services to spam, phish, or send unsolicited messages to
customers, including Game Center, Push Notifications, Live Activities, etc." Een avond-aftelling die de speler niet zelf
aanzette, kan daaronder vallen. Daarom zijn DI-3 en DI-4 **opt-in**.

**Praktijk:** Duolingo toonde een abonnementsaanbieding met aftelling in het eiland (januari 2026); MacRumors kon het
later niet meer reproduceren, dus vermoedelijk teruggedraaid na klachten. Retention.blog noemt ook "Explode" als app
die Live Activities promotioneel inzet.

Bronnen: https://developer.apple.com/design/human-interface-guidelines/live-activities ,
https://developer.apple.com/app-store/review/guidelines/ (4.5.3),
https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities

---

## 6. Nieuw in iOS 26 en iOS 27

**iOS 26 (september 2025)**
- **Inplannen:** `Activity.request(attributes:content:pushType:style:alertConfiguration:start:)` start een activiteit
  op een gekozen tijdstip, ook als de app dan op de achtergrond is. Een `AlertConfiguration` is verplicht. Ingeplande
  activiteiten tellen mee voor de limiet. (Apple Sports deed dit al sinds iOS 18.)
- **CarPlay Dashboard** en **Mac-menubalk** (macOS Tahoe, via iPhone-mirroring), zonder codewijziging. Met
  `.supplementalActivityFamilies([.small])` en `@Environment(\.activityFamily)` maak je een eigen kleine weergave voor
  CarPlay en de Apple Watch.
- **iPadOS 26** gebruikt Live Activities voor Background Tasks.
- **AlarmKit:** timers en wekkers van andere apps op het toegangsscherm en in het eiland, zoals de Klok-app.
- Apple zelf: Live Activities voor workouts in Fitness en voor boardingpassen in Wallet.

**iOS 27 (september 2026)**
- Het eiland toont Live Activities ook **liggend**. Compact kan dan niet breder worden:
  `@Environment(\.isDynamicIslandLimitedInWidth)` laat je een smallere versie tonen. HIG: pas compact en minimal in een
  **cirkel van 28 pt**; gebruik een afkorting of symbool; alleen links mag ook.
- **StandBy** toont de toegangsscherm-weergave op 200 %. Met `showsWidgetContainerBackground` en
  `.activityBackgroundTint(_:)` vul je het hele scherm netjes.
- **iPhone 18 Pro**: kleiner eiland, tot **drie** activiteiten tegelijk, maar de derde is volgens code-onderzoeker pdfu
  altijd een systeemactiviteit (muziek, navigatie). Bij twee activiteiten krijgt de tweede meer ruimte.
- Een ontwikkelaar meldt op de Apple-forums dat op iOS 27.0 `colorScheme` in een Live Activity altijd `.dark` geeft
  (één melding, niet bevestigd door Apple): ons ontwerp moet in het donker sowieso goed zijn.

Bronnen: https://developer.apple.com/videos/play/wwdc2026/223/ (scherm 27),
https://developer.apple.com/videos/play/wwdc2025/278/ ,
https://9to5mac.com/2025/12/04/ios-26-made-live-activities-even-better-on-iphone-heres-whats-new/ ,
https://www.macrumors.com/2026/06/21/five-ios-27-features-you-may-have-missed/ ,
https://www.macrumors.com/2026/09/09/iphone-18-pro-features-smaller-dynamic-island/ (scherm 28),
https://www.macrumors.com/2026/10/05/iphone-18-pro-three-live-activities-dynamic-island/ ,
https://developer.apple.com/forums/thread/838826

---

## 7. Ideeën voor Crimson Ledger

Kleuren in het eiland (altijd zwart): de **kluisstand** uit `DESIGN.md`: goud `#E8BE78` voor de klok, rood `#C43E26`
alleen voor het slachtoffer of "bijna te laat", tekst `#FAF5EF`. Op het toegangsscherm in licht: papier `#FAF5EF`
met inkt `#2C1810` en wijnrood `#8B2E1C`; in donker het kluisdoek `#140B08`.

### DI-1. "Dossier open": de lopende zaak (aanrader voor het prototype)

Start bij "Aan de slag" (de klok begint daar ook), stil en zonder alert. Je ziet hem pas als je de app verlaat; in de
app zelf toont het eiland je eigen activiteit niet. Eindigt bij oplossen, bij "terug naar menu" of na 8 uur.

```
Compact      [🔍 ▮▮▮▯▯]  (camera)  [ 07:42 ]        links voortgang, rechts de klok in goud
Minimal      ( ◔ )  ring = deel van het bord ingevuld
Expanded     🔍 Het glas Bordeaux            07:42
             De Wijnkelder · Zaak van vandaag
             [▪▪▪▪▪▫▫▫▫]  3 verdachten over · 7/12 aanwijzingen
Toegangsscherm  zelfde als expanded, op papier; mini-plattegrond met ingevulde kamers; tik = verder met je zaak
Liggend (iOS 27)  alleen links: ( ◔ ) in 28 pt
```

- **Prioriteit (Uber-methode):** P0 klok (of in de rustige stand: voortgang), P1 hoeveel verdachten over, P2 zaaknaam
  en wereld.
- **Beweging:** de klok tikt vanzelf; bij elke afgevinkte aanwijzing een `numericText`-overgang op "7/12" en de ring
  schuift (systeemovergang, < 2 s). Geen alerts.
- **Techniek:** lokaal starten, lokaal bijwerken (alleen bij afvinken, dus weinig updates), klok via
  `Text(timerInterval:)`. Tik opent de app; de hervat-sleutel brengt je terug op het bord.
- **Regels:** volledig binnen de HIG (een taak met begin en eind, < 8 uur). Schakelaar in Instellingen: "Zaak volgen
  op toegangsscherm".
- **Geïnspireerd door:** D1 LogicGrid (getimede ronde), D3 Sudoku+ (hervatten), D12 Forest (beeld + getal), D19
  Crouton (stap + tijd), D23 MLB (mini-graphic), D25 Flighty (ring in minimal), D26 Uber (P0/P1/P2).

### DI-2. "Gesloten": de eindstand met stempel en de volgende zaak

Als de zaak is opgelost terwijl de activiteit loopt, beëindigt de app hem met een eindstand en een wegtijd van
15–30 minuten (eiland: meteen weg; toegangsscherm: blijft nog even staan).

```
Toegangsscherm   GESLOTEN ▸ (stempel)   Het glas Bordeaux
                 Opgelost in 8:41 · +120 punten · 🔥 13 dagen
                 Volgende zaak om 00:00            ← alleen bij de dagzaak
```

- **Beweging:** de enige "grote" overgang die mag: de stempel komt in met een scale-overgang, de punten tellen met
  `numericText` (beide binnen 2 s; geen confetti, dat kan niet).
- **Regels:** precies wat Apple bedoelt met "custom dismissal time" (zoals Uber na een rit). De regel "Volgende zaak om
  00:00" is informatie, geen aanbieding; geen Crimson Pass of winkel noemen.
- **Geïnspireerd door:** D26 Uber (eindstand na de rit), D22 Apple Sports (eindstand), D10 Duolingo XP-concept
  (één groot getal), onze eigen stempelceremonie (zie het zusterstuk, deel 0).

### DI-3. "Streak op het spel": avond-aftelling tot middernacht (opt-in)

Alleen als de speler het aanzet, alleen als de streak minstens 3 dagen is en de dagzaak nog open staat. Start
ingepland om bijvoorbeeld 20:00 (of het gebruikelijke speeluur + 1, zoals de meldingen nu al doen) en loopt tot
middernacht (4 uur, binnen de 8). Lost de speler de zaak op, dan eindigt hij meteen met "Streak veilig".

```
Compact      [🔥 12]  (camera)  [ 3:59:12 ]     rechts aftellen tot 00:00
Minimal      ( 🔥 )  met ring die leegloopt
Expanded     Van Dam: "Je dossier van vandaag ligt nog open."
             🔥 12 dagen · nog 3:59:12          [Zaak van vandaag]
Laatste uur  getal en ring van goud naar rood (één update, geen alert)
```

- **Techniek:** iOS 26+: inplannen met `start:` wanneer de app overdag opent (of bij het oplossen voor morgen, dat
  moet getest worden: hoe ver vooruit je mag plannen staat niet in de documentatie). Oudere iOS: niets, de bestaande
  melding blijft. Aftelling via `Text(timerInterval:countsDown: true)`.
- **Regels:** opt-in (richtlijn 4.5.3), niet tegelijk met de avondmelding voor hetzelfde (HIG); kies per speler één
  van de twee. Nooit een aanbieding (Duolingo-incident).
- **Geïnspireerd door:** D9 Duolingo (streak-aftelling), D1 LogicGrid (avondnudge), D10 XP-concept (mascotte +
  getal), D15 Wakeout (rustig tot het echt telt), D22 Apple Sports (inplannen, eigen schakelaar).

### DI-4. "Zaak van de week sluit": zondagavond

De zaak van de week loopt maandag t/m zondag (`Progress.weekly()`). Als hij zondag om 18:00 nog open staat en de
speler dit aanzette: een ingeplande activiteit tot zondag 23:59, met de weekstrook.

```
Expanded / toegangsscherm
             🗓️ Zaak van de week · Week 45
             ma di wo do vr za zo
             ●  ●  ●  ○  ●  ●  ◐        ← gespeelde dagen
             Sluit over 5:12:40          [Openen]
Compact      [🗓️]  (camera)  [ 5:12 ]
```

- **Waarom pas zondag:** een hele week kan niet (max. 8 uur), en een week lang in beeld zou opdringerig zijn.
- **Geïnspireerd door:** D21 Kounts en Exam Countdown (alleen in de laatste uren, verdwijnt vanzelf), D27 Citymapper
  (de lijn met haltes = de weekstrook), D23 MLB (mini-graphic), D24 FotMob/HIG (één activiteit; als DI-1 ook loopt,
  toont DI-1 de weekstrook in plaats van een tweede activiteit).

### DI-5. "Van Dam in het eiland": een bewegend detail bovenop DI-1 (optioneel, wow)

Een klein vergrootglas dat over het compacte eiland zwiept, of Van Dams silhouet dat een pagina omslaat, als laag
op DI-1.

- **Techniek:** echte animatie mag niet; het kan alleen met de fonttruc van Pixel Pals (een eigen lettertype met
  beelden per glyph, gestuurd door een tikkende tijdtekst) of met de systeemovergangen bij een update. Dat is werk,
  breekbaar per iOS-versie, en staat stil op Always-On.
- **Advies:** pas na DI-1, en alleen als het prototype het waard blijkt. Begin met een stilstaand symbool dat bij elke
  afgevinkte aanwijzing een SF-symboolovergang krijgt.
- **Geïnspireerd door:** D7 Pixel Pals, D10 XP-concept, D5 Mechanym (personage dat reageert).

### Voorgestelde volgorde en keuzevragen voor Jaimy

1. **Prototype:** DI-1 + DI-2 samen (één activiteit, twee eindtoestanden). Klein, lokaal, geen regelrisico.
2. **Daarna** naar keuze DI-3 en/of DI-4 (iOS 26+, opt-in), afgestemd met de meldingen uit het zusterstuk.
3. **DI-5** alleen als extra.

Keuzes die ik van je nodig heb:
- Compact rechts: **de klok** (spanning, de tijdbonus loopt) of **de voortgang** (rustiger)?
- Minimal: **ring van het bord** of **vergrootglas-symbool**? (Apple raadt een waarde aan.)
- Mag DI-3 er komen, en zo ja, vervangt hij voor die spelers de avondmelding?
- Beeldtaal: **kluisstand** (donker, goud) of **papier** (licht) op het toegangsscherm?

---

## 8. Schermafbeeldingen en hun bron

Map: `/private/tmp/claude-501/-Users-jaimycai/4b665c0e-1f47-4ec1-80b1-80218956e1fb/scratchpad/onderzoek-di/`

| Bestand | Wat | Bron |
|---|---|---|
| 01-apple-hig-live-activities.png | HIG-kop met MLB-voorbeeld (compact en expanded) | https://developer.apple.com/design/human-interface-guidelines/live-activities |
| 02-apple-hig-anatomie.png | Compact: links en rechts van de camera | idem |
| 03-apple-spotlight-citymapper.png | Citymapper, alle standen in drie fasen | https://developer.apple.com/news/?id=mis6swzt |
| 04-apple-spotlight-flighty.png | Flighty in eiland en op toegangsscherm | idem |
| 05-apple-spotlight-wakeout.png | Wakeout | idem |
| 06-apple-spotlight-smartgym.png | SmartGym, rustteller "27" | idem |
| 07-apple-spotlight-apollo.png | Apollo | idem |
| 08-macstories-lookup.png | LookUp, leesstand | https://www.macstories.net/reviews/ios-16-1-and-apps-with-live-activities-the-macstories-roundup-part-1/ |
| 09-macstories-carrot.png | CARROT Weather | idem |
| 10-macstories-crouton.png | Crouton | idem |
| 11-macstories-pixelpals.png | Pixel Pals, eiland en uitgeklapt met Voeren/Spelen | idem |
| 12-macstories-flighty.png | Flighty | idem |
| 13-uber-blog-hierarchie.png | Uber, P0/P1/P2 op toegangsscherm | https://www.uber.com/us/en/blog/live-activity-on-ios/ |
| 14-uber-blog-dynamic-island-fases.png | Uber, vijf fasen in het eiland | idem |
| 15-macrumors-duolingo-reclame.png | Duolingo "Claim your Super offer! 59:19" | https://www.macrumors.com/2026/01/02/duolingo-dynamic-island-ad/ |
| 16-gamigion-merge-adventure-aanbieding.png | Merge Adventure, aanbieding + toestemmingsvenster | https://www.gamigion.com/apple-live-activities-being-used-in-a-mobile-game/ |
| 17-apple-behind-the-design-flighty.png | Flighty, Behind the Design | https://developer.apple.com/news/?id=970ncww4 |
| 18-appstore-pixel-pals.png | Pixel Pals App Store | https://apps.apple.com/us/app/pixel-pals-widget-pet-game/id6443919232 |
| 19-appstore-logicgrid.png | LogicGrid App Store | https://apps.apple.com/app/id6753323322 |
| 20-appstore-sudokuplus.png | Sudoku+, platen "Dynamic Island" en "Live Activity" | https://apps.apple.com/us/app/sudoku-classic-puzzle/id1467609353 |
| 21-appstore-ninecells.png | NineCells App Store | https://apps.apple.com/us/app/ninecells-multiplayer-sudoku/id6762876916 |
| 22-appstore-mechanym.png | Mechanym App Store | https://apps.apple.com/us/app/mechanym-daily-word-puzzle/id6816660925 |
| 23-daily-city-planner-site.png | Daily City Planner, website | https://truizlop.github.io/daily-city-planner-site/ |
| 24-macrumors-forest.png | Forest, toegangsscherm en eiland | https://www.macrumors.com/2022/10/24/live-activities-dynamic-island-apps/ |
| 25-tiimo-live-activities.png | Tiimo, eiland en toegangsscherm | https://www.tiimoapp.com/product/widgets-live-activities |
| 26-macrumors-apple-sports.png | Apple Sports op toegangsscherm en Watch | https://www.macrumors.com/2024/08/29/apple-sports-live-activities-and-more/ |
| 27-wwdc26-live-activities-essentials.png | WWDC26-sessie 223 | https://developer.apple.com/videos/play/wwdc2026/223/ |
| 28-macrumors-iphone18pro-drie-activiteiten.png | iPhone 18 Pro, drie activiteiten | https://www.macrumors.com/2026/09/09/iphone-18-pro-features-smaller-dynamic-island/ |
| 29-9to5mac-iphone18pro-twee-activiteiten.png | iPhone 18 Pro, tweede activiteit met meer info | https://9to5mac.com/2026/09/22/iphone-18-pros-best-dynamic-island-feature-is-one-apple-barely-mentioned/ |
| 30-dribbble-tag-live-activity.png | Dribbble-tag "Live Activity" | https://dribbble.com/tags/live-activity |
| 32-kounts-aftellen.png | Kounts | https://kounts.app/live-activity-countdown |
| 33-keepingscore-docs.png | Keeping Score! | https://www.keepingscore.app/docs/beyond-the-basics/live-activities/ |
| 34-macrumors-hit-the-island.png | Hit the Island | https://www.macrumors.com/2022/09/16/hit-the-island-dynamic-island-game-iphone-14-pro/ |
| 35-9to5mac-flighty.png | Flighty in eiland en op toegangsscherm | https://9to5mac.com/2022/10/24/flighty-dynamic-island-iphone-live-activities/ |
| 36-examcountdown.png | Exam Countdown | https://examcountdown.app/help/live-activity/ |
| 37-dribbble-duolingo-xp-boost-concept.png | Duolingo XP Boost-concept (zach zhu) | https://dribbble.com/shots/23943203-Duolingo-XP-Boost-Live-Activity-Dynamic-Island |

Niet gelukt: Behance (paginafout) en apppage.net (botcontrole; niet omzeild). Nummer 31 ontbreekt daarom.
Cookievensters zijn waar mogelijk geweigerd ("Reject all", "Do not consent").

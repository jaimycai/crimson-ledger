# Crimson Ledger: meldingen en animaties, voorbeelden om uit te kiezen (02-11-2026)

Doel: eerst laten zien wat anderen doen, dan kiezen, dan pas bouwen. Twee lijsten (meldingen en animaties), elk met een tabel, een korte alinea per voorbeeld en aan het eind 6 ideeën voor Crimson Ledger met de voorbeelden die ze inspireerden.

Mobbin is niet gebruikt. Bronnen:
- **Pushkeen**: archief van echte iOS-meldingen, met tijdstip en soms de afbeelding.
- **60fps.design**: opnames van animaties in echte iOS-apps, met beschrijving.
- **Live CSS van NYT Games**: de keyframes van Wordle en Connections, uitgelezen in de browser op 02-11-2026.
- Verder Apple HIG, WWDC, helppagina's (LinkedIn, Snapchat, BeReal, NYT), blogs van Duolingo, Rive en Puzzmo, LottieFiles, Rive Marketplace, Dribbble, CodePen, Reddit en vakartikelen.

Labels: **[S]** sterk (primaire bron of het product zelf), **[M]** middel (degelijke uitgever, of een ontwikkelaar die cijfers noemt), **[Z]** zwak (blog, verkoper of anekdote).

Schermafbeeldingen van de openbare pagina's staan in `/private/tmp/claude-501/-Users-jaimycai/4b665c0e-1f47-4ec1-80b1-80218956e1fb/scratchpad/onderzoek-anim/`. Die map is tijdelijk: kopieer wat je wilt houden. De kolom "Beeld" noemt de bestandsnaam.

---

## 0. Wat de app nu al doet (startpunt, zodat de ideeën geen dubbel werk zijn)

### Meldingen
- **Toestemming in context.** De knop "🔔 Herinner me morgen aan de dagelijkse zaak" verschijnt op het resultaatscherm na de dagelijkse zaak en na de eerste drie opgeloste zaken. Instellingen hebben een schakelaar (`board.js` showResults, `app.js` bindSettings). Het iOS-venster komt pas na een tik.
- **Een reeks van vijf lokale meldingen** (id 1-5) op dag 0, 1, 2, 4 en 6. Ze worden bij elke opening opnieuw gepland (`app.js` scheduleReminder). Het tijdstip is een uur na het gebruikelijke speeluur (tussen 9 en 21 uur), anders 18:30.
- **Tekst.** De titel is altijd "Crimson Ledger". De eerste melding hangt af van de streak:
  - zonder vrije dag: "Je streak van N dagen loopt vanavond af. Eén zaak is genoeg."
  - met vrije dag: "Je dagelijkse zaak wacht. Houd je streak van N dagen vast."
  - Meldingen 2 tot en met 5 zijn letterlijk dezelfde zin: "Er ligt een nieuwe zaak op je bureau. Wie was alleen met het slachtoffer?"
- **Wat ontbreekt.** Geen afbeelding, geen knoppen, geen `threadIdentifier`, geen eigen geluid, geen tekst voor verborgen voorvertoning en geen aparte streakredder 's avonds. "Loopt vanavond af" kan om 10:00 's ochtends komen als je meestal om 9 uur speelt.
- **Klein foutje.** De bevestiging zegt "Ingesteld: elke dag om 18:30 een herinnering." en de instelling heet "Dagelijkse herinnering (18:30)". De app plant echter op het gebruikelijke uur plus één.
- **Plugin.** `@capacitor/local-notifications` 7.0.7 op Capacitor 7.6.9.
  - Kan al: `attachments` (afbeelding, ook GIF), `actionTypeId` plus `registerActionTypes` (knoppen), `threadIdentifier`, `summaryArgument`, `sound`, `extra` en `iosHiddenPreviewsBodyPlaceholder`.
  - Kan nog niet: `interruptionLevel` en `relevanceScore`. Die komen pas in 8.1.0, en 8.x vraagt Capacitor 8.

### Animaties
- **Ceremonie "Zaak opgelost"** (`board.js` ceremony, `style.css` rond regel 2000). Tikken slaat alles over.
  - Na 80 ms valt de stempel in: van scale 2.4 en -20° naar rust, met een transition van 0,45 s op `cubic-bezier(0.34,1.56,0.64,1)`. Tegelijk schudt het papier 0,4 s, vallen 44 CSS-confettistukjes (1,6–2,8 s, ease-in), klinkt het geluid `stamp` en trilt de telefoon met impact MEDIUM.
  - De sterren komen op 520 ms plus 190 ms per ster.
  - De scoreregels komen op 1080 ms plus 170 ms per regel. Elke regel telt op met een **lineaire** `setInterval`-teller van 260 ms.
  - Het totaal telt in 520 ms. De rangbalk groeit in 0,9 s. Daarna volgen de opmerking van Van Dam en de medailles.
- **Medaille-toast.** Een strook met emoji en de tekst "Nieuwe trofee: '…' ontgrendeld.", 2,8 s lang, geluid `medal`. De medaille zelf beweegt niet.
- **Beschuldigen.**
  - Fout: de knop schudt 0,3 s, er komt een rode ballon en de telefoon trilt MEDIUM.
  - Goed: een bekentenisballon schuift in 0,25 s omhoog, de telefoon trilt LIGHT, en na 700 ms volgt de ceremonie.
- **Hint.** De gratis hint laat de knop pulseren. Vakjes en verklaringen knipperen met `hint-pulse` (1 s, 3×).
- **Bewijskist.** Schudt in een lus. Bij openen springen de beloningen op (0,5 s veer, 180 ms na elkaar), met confetti en trillen.
- **Overige beweging.**
  - Deel-splash: lichtstralen (40 s) en avatars die opspringen.
  - Kaart: een pulserende knoop en een dobberende pin.
  - Neerzetten van een verdachte: vonkjes en `cell-pop` (0,32 s veer).
- **Schermwissel.** 0,3 s uitfaden, dan infaden (`navigateTo`).
- **Laadscherm.** Een laadbalk, daarna verschijnt de knop.
- **Streak.** Alleen tekst ("🔥 N dagen streak") plus een weekstrook. Het ophogen is niet geanimeerd. Een gebruikte vrije dag is een toast.
- **Trillen.** Alleen impact LIGHT of MEDIUM, en voor goed (stempel) en fout (verkeerde verdachte) is het **dezelfde** MEDIUM. Trillen kun je niet apart uitzetten.
- **Minder beweging.** `prefers-reduced-motion` dekt confetti, papier, kaart en hintknop, maar niet de schuddende kist of de stralen van de deel-splash.

---

# Deel 1. Meldingen

## 1.1 Wat iOS biedt, en wat met onze plugin kan

| Mogelijkheid | Wat het doet | Kan nu (plugin 7.0.7)? | Bron |
|---|---|---|---|
| **Afbeelding of GIF** (attachment) | Miniatuur rechts in de melding, groot bij uitklappen. Een GIF beweegt in de uitgeklapte weergave. Apple: meldingen met media hebben meer kans om bovenaan de samenvatting te staan. | Ja: `attachments: [{ id, url: 'res:///…png' }]` met een bestand in de app-bundel | WWDC21 "Send communication and Time Sensitive notifications" [S]; Airship FAQ (formaten jpg, gif, png) [M] |
| **Knoppen** (notification actions) | Tot 4 knoppen in de uitgeklapte melding, met icoon. HIG: korte werkwoorden, geen knop die alleen de app opent, liever niet-destructief. | Ja: `registerActionTypes` en `actionTypeId`; reageren via `localNotificationActionPerformed` | Apple HIG Notifications [S] |
| **Titel** | HIG: zet de app-naam niet in de titel (iOS toont het icoon al), gebruik de titel voor nuttige informatie. Volledige zinnen en zinshoofdletters. | Ja: alleen tekst aanpassen | Apple HIG Notifications [S] |
| **Groeperen** | `threadIdentifier` stapelt onze meldingen. `summaryArgument` geeft de stapel een samenvattingsregel. | Ja | Capacitor-docs [S] |
| **Tekst bij verborgen voorvertoning** | Als iemand "voorvertoning verbergen" aan heeft, krijgt hij een generieke regel in plaats van "Melding". | Ja: `iosHiddenPreviewsBodyPlaceholder` op het actietype | Apple HIG [S], plugin-definities [S] |
| **Eigen geluid** | Kort en herkenbaar (HIG). Een stempel of typemachinebel past bij ons. | Ja: `sound: 'stempel.wav'` in de bundel | Apple HIG [S] |
| **Onderbrekingsniveau** | Passive (stil), Active (standaard), Time Sensitive (door Focus en samenvatting heen) en Critical (alleen met toestemming van Apple). HIG: Time Sensitive alleen bij iets dat nu of binnen een uur gebeurt, en nooit voor marketing. iOS vraagt de speler bij de eerste Time Sensitive-melding of hij die wil houden. | Nee: plugin 8.1+ en Capacitor 8 nodig, of een kleine native patch. Time Sensitive vraagt ook de capability in Xcode. | Apple HIG Managing notifications [S]; Capacitor-docs [S] |
| **Relevantiescore** | Bepaalt welke melding uit onze stapel bovenaan de geplande samenvatting staat. | Nee (8.1+) | WWDC21 [S]; Capacitor-docs [S] |
| **Communicatiemelding** | Gezicht van de afzender groot, app-icoon klein. Alleen voor echte berichten tussen mensen (SiriKit-intent). Duolingo gebruikt dit voor vriendenduwtjes. | Nee: native plus Intents nodig. Voor een fictieve Van Dam is het riskant bij de App Review. | Apple HIG [S]; mszpro.com [M]; Reddit r/duolingo [Z] |
| **Voorlopige toestemming** (provisional) | Meldingen komen stil in het Berichtencentrum zonder vooraf te vragen, met knoppen "Houden" en "Uit". | Nee: native patch (staat al in het retentieonderzoek) | Apple-docs [S] |
| **Samenvatting en Focus** | Wie een geplande samenvatting heeft, ziet Active-meldingen pas op het samenvattingsmoment. Met Apple Intelligence kan iOS een stapel ook samenvatten, dus de eerste woorden moeten de kern dragen. | Werkt vanzelf | WWDC21 [S]; Airship benchmarks 2025 [M] |

Twee HIG-zinnen die direct over ons gaan:
- "Avoid sending multiple notifications for the same thing." Onze meldingen 2 tot en met 5 zijn dezelfde zin.
- "Avoid including your app name." Onze titel is altijd "Crimson Ledger".

## 1.2 Wat werkt volgens cijfers

- **Beeld in de melding.**
  - Airship: +56% directe opens bij meldingen met een groot beeld (Android, bijna 5 miljoen berichten, 2016) [M].
  - OneSignal: +60% doorklik bij meldingen met beeld (analyse van 90 miljard meldingen) [M].
  - Airship 2025: gemiddeld +22% bij rich push [M].
  - Een peer-reviewed CHI-studie onder 6.866 gebruikers vond dat een afbeelding, een icoon of een **knop** de respons verhoogt. Klikken waren 's ochtends lager en 's middags en 's avonds hoger [S].
  - Bronnen: airship.com/blog/ios-10-rich-notifications-faqs/, onesignal.com/blog/insights-from-118-billion-push-notifications-sent-through-onesignal/, growth.airship.com/…/Airship-2025-Push-Notification-Benchmarks-EN.pdf, dl.acm.org/doi/10.1145/3290607.3312993.
- **Persoonlijk en gericht.** Airship 2025: berichten op maat gemiddeld +37% opens [M]. OneSignal: gesegmenteerde meldingen +21% doorklik [M].
- **Vernieuwen loont** (Duolingo, KDD 2020). Een bandit-algoritme kiest per leerling uit vaste sjablonen. Nieuwe sjablonen winnen het van herhaalde, en de beste tekst verschilt per publiek [S]. blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/; research.duolingo.com/papers/yancey.kdd20.pdf. Het retentieonderzoek noemt ook +2,2% D1 en +2,0% D7 door betere teksten.
- **Timing.**
  - Duolingo plant de volgende herinnering 23,5 uur na de laatste sessie, en dag 3–4 beslist of iemand terugkomt [M] (subclub.com, al in het retentieonderzoek).
  - Een streakredder rond 22 uur ervaren gebruikers als positief [M] (lennysnewsletter.com).
  - LinkedIn stuurt om 21 uur alleen als je die dag nog niet gespeeld hebt [Z, ervaringsverslag].
- **Animatie rond de streak.** De nieuwe streakanimatie verhoogde de kans dat een nieuwe leerling na 7 dagen nog speelt met +1,7% [M]. blog.duolingo.com/how-duolingo-streak-builds-habit/
- **Toestemming.** Games halen op iOS gemiddeld 20,6% toestemming [M]. Vragen op een beloningsmoment na een eigen tussenscherm verdubbelde dat van 25% naar 50% [M] (al in het retentieonderzoek).
- **Terughoudendheid werkt ook.** NYT Games stuurt bewust geen streakmeldingen, terwijl spelers er zelf om vragen [M]. Puzzmo noemt streaks "a sort of unhealthy system" en laat je een verloren streak terugverdienen met 3 dagen spelen [S].

## 1.3 Voorbeelden (18)

| # | App | Letterlijke tekst (titel / tekst) | Wanneer | Waarom het werkt | Bron | Beeld |
|---|---|---|---|---|---|---|
| M1 | Duolingo, avondredder | "🚨Last chance! Practice by midnight to keep your {N} day Streak going" · "Your streak is in danger! / Complete a lesson now to keep your 1 day streak alive" · "Lose 1 day? 😢 / Practice now to keep your streak alive" | 20:30–23:00, alleen als er die dag nog niets gedaan is | Een deadline in plaats van een advies; verlies van een concreet getal; laat genoeg om nog te handelen | duolingo.fandom.com/wiki/Notification_Messages [Z]; pushkeen.ai/apps/Duolingo [S]; dontsnooze.io/blog/duolingo-guilt-notification-teardown/ [Z] | m01 |
| M2 | Duolingo, kleine vraag | "Hi, it's Duo. 👋🏼 / Reminding you to practice Greek. Got 3 minutes now?" · "⏰ Take 3 minutes to be a learner! / Keep your daily habit going with a quick Greek lesson" | Elke dag rond hetzelfde uur (in het archief steeds 15:47) | Maakt de vraag klein en concreet: "3 minuten" | pushkeen.ai/apps/Duolingo [S] | m01 |
| M3 | Duolingo, terugkomen | "🥺 Hi, it's Duo! I missed you / It has been 3 days. It's not too late to come back and practice today!" | Na 3 dagen weg | Benoemt het gat zonder te straffen; "not too late" haalt de drempel weg; dag 3–4 is het beslismoment | pushkeen.ai/apps/Duolingo [S] | m01 |
| M4 | Duolingo, afscheid | "Goodbye, I guess / You're over it, I can tell. I'll stop bothering you." (met **een afbeelding van een gekwetste Duo**) · "Hi! It's Zari! / Duo says you're ignoring him 😔 We'll stop these reminders, but please come back soon!" | Laatste melding van de reeks na lang wegblijven | Kondigt het einde aan; iemand die stopt, zet meldingen niet uit; omgekeerde psychologie; in het zichtbare deel van het archief de enige melding met een plaatje | pushkeen.ai/apps/Duolingo [S] | m01 |
| M5 | Duolingo, personages | "Lily / there's a Greek lesson here if you want it" · "Hey, It's Lily. 📒 It would be a bummer to lose that {N} day Streak. Just saying." · "Falstaff / Keep your {N} day Streak. Because you're smarter than the average bear." | Afwisselend door de dag | Een andere stem per personage voorkomt gewenning (KDD: nieuw wint van herhaald); de naam staat in de **titel** | pushkeen.ai/apps/Duolingo [S]; duolingo.fandom.com [Z] | m01 |
| M6 | Duolingo, vriendenduwtje | Een duwtje van een vriend dat eruitziet als een gewoon chatbericht van die vriend ("It looks like a legit direct message notification") | Als een vriend op "nudge" tikt | Sociale verantwoordelijkheid; het gezicht van een echte persoon; Apple staat dit alleen toe voor echte personen | reddit.com/r/duolingo/comments/1he0jly/ [Z] | – |
| M7 | LinkedIn Games | "Continue your 1-day streak." → "You're on fire! 3-day streak" → "500-day streak! Don't break it now" (21:00) · na het spelen: "Congrats! Share your score" | Reminder 's avonds als je nog niet gespeeld hebt; felicitatie direct na de winst | De tekst groeit mee met de streak. De schakelaar "Keep your streak" zit **op de streakkaart** van het resultaatscherm | linkedin.com/help/linkedin/answer/a6296670 [S]; medium.com/product-powerhouse/500-days-of-linkedin-games… [Z]; towardsdatascience.com/a-product-data-scientists-take-on-linkedin-games-after-500-days-of-play/ [Z] | m04, m05 |
| M8 | Snapchat | In de app een ⌛ naast de streak; de herinnering per streak heet "Get notified 1 hour before your streak ends" | Laatste uur voor de streak afloopt; alleen aan als je het per vriend inschakelt | Eerst een zichtbaar signaal in de app, pas daarna een melding; toestemming per streak; precies het laatste uur | help.snapchat.com (Streaks en Streak reminders) [S]; snaporbitlab.com [Z] | m06 |
| M9 | BeReal | "⚠️ Time to BeReal. ⚠️ / 2 min left to capture a BeReal and see what your friends are up to!" | Eén keer per dag op een willekeurig tijdstip, voor iedereen in de regio tegelijk | Eén melding per dag is de hele belofte; een kort venster; een gedeeld moment; kan niet uit en voelt toch niet als spam | help.bereal.com [S]; arxiv.org/html/2408.02883 [M] | m07 |
| M10 | Finch | Titel "From Baby Pancake" / "I'm feeling hopeful. How did your day go?" · "Baby Pancake just woke up 🌞 / Pancake is waiting for you" (08:00) · "You have a visitor! / A birb is waving over to you." | 's Ochtends een vast wekmoment, 's avonds een gevoelsvraag | Het personage is de afzender (titel), zorgzaam en zonder schuldgevoel; geen opdracht, wat de HIG ook wil | pushkeen.ai/apps/Finch [S] | m08 |
| M11 | Headspace | "Mindful Moment / Mindfulness beats mindlessness, every day." · "Mindful Moment / What's your positive intention for the day?" | Elke dag rond 09:01 | De waarde zit in de melding zelf; vast uur; vaste titel als rubriek | pushkeen.ai/apps/Headspace [S] | m09 |
| M12 | Royal Match, evenement | "⚡ Lightning Rush started ⚡ / Get unlimited lives during the 1 hour long competition! ❤️" · "Last 30 minutes of Lightning Rush! ⏳" · "Lightning Rush finished! 🏁 / Come and check your results! 🎁" | Begin, laatste 30 minuten en einde van een tijdelijk evenement | Een melding met een duidelijk begin en eind; "je uitslag staat klaar" wekt nieuwsgierigheid | pushkeen.ai/apps/Royal%20Match [S] | m10 |
| M13 | Royal Match, personage | "King Robert needs your help to beat levels! Enjoy Royal Match now! 🎉" · "It's time for a royal break! ☕🍰" | Rond 13:54, in de lunchpauze | Een personage vraagt om hulp; spelen als pauze en niet als plicht; tijdstip bij een natuurlijk moment | pushkeen.ai/apps/Royal%20Match [S] | m10 |
| M14 | Clash Royale, Tiny Tower, Gardenscapes | Letterlijke tekst niet openbaar gevonden. Strekking: "kist is klaar om te openen", "verdieping is af", "harten weer vol", "evenement begint of eindigt" | Als een timer afloopt die de speler zelf startte | Een afspraak die de speler zelf maakte; de melding houdt een belofte in. Een schrijver die de meldingen uitzette, kwam "much less" terug | cjleo.com/blog/time-is-micro-money/ [Z]; jyx.jyu.fi (scriptie over retentie in F2P) [M] | m17 |
| M15 | NYT Games | Alleen opt-in: een melding "when the newest daily puzzle is available" (Crossword). Geen streakmeldingen. Jonathan Knight: "We don't need to hook you, addict you." | Als de nieuwe puzzel live gaat, alleen als je het aanzet | Vertrouwen en "time well spent"; spelers vragen zelf om herinneringen | help.nytimes.com (Crossword) [S]; pcgamer.com/…/one-of-wordles-most-requested-features… [M] | m11 |
| M16 | Puzzmo | Geen streakmelding; "you can always recover a lost streak by playing 3 days in a row" | – | Haalt de angst weg; een verloren streak verdien je terug in plaats van te kopen | blog.puzzmo.com/posts/2026/10/19/daily-challenge-release/ [S] | m18 |
| M17 | Apple Fitness | "You can still close your Move ring by doing a brisk 15-minute walk." | Laat op de dag, alleen als de ring nog open is | Eén concrete, haalbare stap met een getal; het doel is zichtbaar | apple.com/watch/close-your-rings/ ("a nudge to close your rings at the end of each day") [S]; Reddit r/AppleWatch voor de letterlijke tekst [Z] | m14 |
| M18 | Apple Agenda en Herinneringen | Knop "Snooze" in de melding | Bij een agendamelding | Een knop die werk bespaart zonder de app te openen; precies het voorbeeld dat Apple in de HIG geeft | Apple HIG Notifications [S] | m13 |

**M1. Duolingo, de avondredder.**
- Hoe laat iets komt, verandert wat het is. Om 9 uur is "doe je les" een advies, om 22:40 met "340 dagen" erbij is het een aftelling (dontsnooze).
- Pushkeen toont de echte tijden: 20:26, 20:31 en 22:14.
- Het getal staat in de titel ("Lose 1 day?"), dus het valt op zonder uitklappen.
- Voor ons: de "loopt vanavond af"-tekst moet ook 's avonds komen, niet op het speeluur.

**M2. Duolingo, "Got 3 minutes?"**
- Wie terugkomt, schat eerst de moeite in. "3 minuten" haalt die drempel weg.
- Apple doet hetzelfde met "a brisk 15-minute walk" (M17).
- Voor ons: een dagelijkse zaak duurt een paar minuten; zeg dat.

**M3. Duolingo, terugkomen na 3 dagen.**
- Zacht ("I missed you") en zonder verlies te benadrukken.
- Komt precies op dag 3, het moment dat Duolingo zelf beslissend noemt.

**M4. Duolingo, het afscheid.**
- De reeks stopt met een melding die het stoppen aankondigt, met een plaatje van een teleurgestelde Duo.
- In het zichtbare deel van het archief is dat de enige melding met een plaatje. Het beeld zit dus op de emotioneel sterkste melding.
- Het houdt de toestemming in leven: wie hoort dat het ophoudt, zet meldingen niet uit.

**M5. Duolingo, de personages.**
- Lily, Falstaff, Oscar en Zari hebben elk een eigen toon (verveeld, bot, opschepperig).
- De naam staat in de titel, als afzender. Dat verklaart waarom het archief zo afwisselend is: nieuwigheid scoort (KDD).
- Wij hebben Van Dam, en de verdachten van de dagelijkse zaak.

**M6. Duolingo, het vriendenduwtje.**
- Een duwtje dat eruitziet als een echt chatbericht werkt omdat het van een mens komt.
- Apple staat de communicatievorm alleen toe voor echte personen.
- Voor ons pas relevant als er ooit vrienden in de app komen. Nu niet.

**M7. LinkedIn Games.**
- De tekst groeit met de streak mee: van "Continue your 1-day streak" naar "You're on fire! 3-day streak".
- De herinnering zet je aan op de streakkaart van het resultaatscherm, op het moment dat je trots bent.
- Na het spelen volgt een tweede melding om te delen.

**M8. Snapchat.**
- De ⌛ in de app is het eerste signaal. De melding is een extra die je per streak aanzet, en komt pas een uur voor het einde.
- Weinig meldingen, en ze komen precies op tijd.

**M9. BeReal.**
- Eén melding per dag is het hele product. Doordat ze zeldzaam en voorspelbaar is, voelt ze niet als spam.
- De tijdsdruk (2 minuten) maakt het een gebeurtenis.
- Voor ons: de zaak van de week kan zo'n "nu"-moment krijgen.

**M10. Finch.**
- De titel "From Baby Pancake" maakt de melding een bericht van een personage.
- De ochtendmelding "just woke up 🌞" begint een ritueel, niet een plicht.
- Geen schuldgevoel, wel een band.

**M11. Headspace.**
- Elke ochtend om 09:01 dezelfde rubriektitel met een korte gedachte. De melding geeft iets, ook als je niet tikt.
- Voor ons: "Van Dams aantekening van de dag", een speurdersregel of een detail uit de wereld.

**M12. Royal Match, het evenement.**
- Een evenement met een begin-, eind- en uitslagmelding geeft drie natuurlijke momenten.
- "Come and check your results! 🎁" werkt omdat er iets klaarligt.
- Voor ons: de zaak van de week.

**M13. Royal Match, het personage.**
- "King Robert needs your help" maakt van spelen een reddingsactie.
- "It's time for a royal break" plaatst het spel in de lunchpauze. Beide komen rond 13:54.

**M14. Wachttimers (Clash Royale, Tiny Tower, Gardenscapes).**
- De speler startte zelf iets (een kist, een verdieping), dus de melding is een afspraak en geen onderbreking.
- De schrijver van cjleo kwam in Clash Royale en Tiny Tower veel minder vaak terug nadat hij de meldingen had uitgezet.
- In de scriptie stuurde Candy Crush geen eigen pushmeldingen (alleen via Facebook), en de onderzoeker speelde het daardoor minder.
- Voor ons: de bewijskist of een "dossier wordt onderzocht"-timer zou zo'n afspraak kunnen zijn. Dat is wel een nieuw systeem.

**M15. NYT Games.**
- Bewust geen streakmeldingen. Alleen een opt-in voor "nieuwe puzzel staat klaar".
- Een tegenwicht: de merkbelofte "time well spent" kan zwaarder wegen dan een paar procent extra opens.

**M16. Puzzmo.**
- Geen push. Een verloren streak komt terug na 3 dagen spelen.
- Past bij het onderzoek dat een gebroken streak benadrukken de motivatie verlaagt (JCR, al in het retentieonderzoek).

**M17. Apple Fitness.**
- Alleen als het doel nog open is, laat op de dag, met een concrete stap en een getal.

**M18. Apple Agenda en Herinneringen.**
- De HIG-norm voor knoppen: een knop moet iets doen zonder de app te openen (Snooze).
- Een knop "Open" is volgens Apple dubbel, want de melding zelf opent de app al.

## 1.4 Ideeën voor Crimson Ledger (meldingen)

**N1. Van Dam schrijft: titel als afzender, afwisselende sjablonen, de zaak van vandaag bij naam.**
*Geïnspireerd door M5 (Duolingo-personages), M10 (Finch "From Baby Pancake"), M2 (3 minuten), de HIG (geen app-naam in de titel, niet steeds hetzelfde) en KDD (nieuw wint van herhaald).*

- Titel "Van Dam" of de zaaknaam in plaats van "Crimson Ledger".
- Per situatie 3–4 sjablonen die rouleren: streak 0, streak 2 of meer, dag 3 terugkomen, dag 7 afscheid.
- De dagelijkse zaak is een vaste seed per datum. Bij het plannen kun je dus de titel en een verdachte van die dag in de tekst zetten, zonder spoiler.
- Voorbeelden:
  - "Van Dam / Vandaag: Het glas Bordeaux. Vijf verdachten, één leugen. Drie minuten?"
  - "Van Dam / Drie dagen geen rapport, Rekruut. Het archief wacht nog; het is niet te laat."
  - Dag 7: "Van Dam / Ik leg je dossier even weg. Als je terugkomt, ligt er een nieuwe zaak klaar."
- Zet `threadIdentifier: 'crimson-dossier'` en `summaryArgument: 'Van Dam'` erbij.
- Herstel ook de bevestiging en het instellinglabel ("18:30"), zodat ze het echte tijdstip noemen.
- Werk: klein, maar 23 talen vertalen.

**N2. Rijke melding: Van Dams schets of het dossier als afbeelding.**
*Geïnspireerd door M4 (Duolingo zet een beeld op de sterkste melding), Airship, OneSignal en CHI (+22 tot +60%, plus de effecten van beeld en knop), en WWDC21 (media maakt de kans groter om bovenaan de samenvatting te staan).*

- Begin met 4–6 vaste afbeeldingen in de bundel en gebruik ze via `attachments: [{ id: 'vandam', url: 'res:///assets/vandam-sketch.jpg' }]`:
  - Van Dams schets (`assets/vandam-sketch.jpg` bestaat al)
  - een dichte bewijskist
  - de rode stempel
  - een dossiermap per wereld
- De afscheidsmelding krijgt de serieuze Van Dam.
- Later kan een kleine GIF van de stempel; die beweegt als je de melding uitklapt.
- In Capacitor wijst `res:///` naar de webmap in de bundel (`config.appLocation`). Controleer of `build-www.js` de bestanden meeneemt.
- iOS verplaatst een bijlage naar zijn eigen opslag. Test op een toestel of een bestand rechtstreeks uit de bundel werkt. Anders kopieer je het eerst naar een tijdelijke map en geef je een `file://`-URL.

**N3. Een aparte streakredder 's avonds, met knoppen.**
*Geïnspireerd door M1 (Duolingo 🚨 rond 22 uur), M7 (LinkedIn 21:00, alleen als je niet speelde), M8 (Snapchat 1 uur vooraf), M17 (concrete stap), M18 (Snooze) en de HIG (Time Sensitive alleen binnen een uur).*

- Alleen bij een streak van 2 of meer en een open dagelijkse zaak.
- Een eigen melding om 21:30 (of 2,5 uur voor middernacht): "Je streak: 6 dagen 🔥 / Om middernacht sluit het dossier. Eén zaak van drie minuten houdt hem in leven."
- Knoppen via `registerActionTypes`:
  - "Herinner me om 23:00", zonder de app te openen
  - "Vandaag niet", annuleert de redder voor vandaag; niet-destructief, zonder verwijt
- Geen knop "Open", want de melding opent de app al. Tikken opent **direct** de dagelijkse zaak (via `extra`), niet het menu.
- De ochtendtekst "loopt vanavond af" vervalt dan.
- Later, met plugin 8.1+: alleen de laatste-uurmelding op `timeSensitive`.
- Let op: of een knop zonder de app te openen goed in de JS-laag aankomt, moet je testen op een toestel.

**N4. De toestemmingsvraag op de streakkaart, met een voorbeeldmelding.**
*Geïnspireerd door M7 (LinkedIn "Keep your streak" op de streakkaart), flaregames (+opt-in op een beloningsmoment), M10 en M5 (een stem die je herkent), en Duolingo "Allow Notifications Sheet" (60fps.design 0275).*

- De knop "Herinner me" bestaat al. De verbetering: laat in het tussenscherm zien hoe de melding eruit gaat zien, als een nagebootste melding in iOS-stijl met Van Dams gezicht en de echte tekst van morgen.
- Daaronder [Houd mijn streak vast] [Niet nu]. Pas de eerste knop roept het iOS-venster op.
- Zet hem op de streakregel van het resultaatscherm, op het trotse moment.

**N5. De zaak van de week als evenement: begin en laatste kans.**
*Geïnspireerd door M12 (Royal Match: start, laatste 30 minuten, uitslag), M9 (BeReal: één vast moment) en M15 (terughoudend en opt-in).*

- Maximaal twee meldingen per week, alleen voor wie herinneringen aan heeft. Tel ze mee binnen de grens van 7 dagen.
- Maandag: "Zaak van de week: [titel] / Meesterniveau. Iedereen krijgt dezelfde zaak."
- Zondag 19:00, als hij nog open staat: "Laatste avond: [titel] / Het dossier gaat om middernacht dicht."

**N6. Netjes stoppen, en een verloren streak laten terugverdienen.**
*Geïnspireerd door M4 (Duolingo-afscheid), M3 (dag 3 "not too late"), M16 (Puzzmo: terug met 3 dagen spelen), LinkedIn (herstel van een streak) en JCR (een gebroken streak benadrukken werkt averechts).*

- De reeks eindigt op dag 7 met een afscheid in plaats van stilte.
- Wie zijn streak verloor (zonder vrije dag), krijgt de volgende dag één melding: "Van Dam / Je oude streak van 12 dagen ligt nog in het archief. Los vandaag en morgen een zaak op en hij is terug."
- Vraagt het terugverdienen uit het retentieonderzoek (aanbeveling 5) als functie.

---

# Deel 2. Animaties in de app

Alles hieronder kan in onze WKWebView. CSS met transform en opacity is het lichtst en loopt op de GPU. GSAP mag. Lottie (lottie-web of dotLottie) en Rive (web-runtime, canvas of WASM) draaien ook in een web-view, maar dan heb je een ontwerper of een gekocht bestand nodig.

## 2.1 Voorbeelden (24)

| # | App of maker | Wat beweegt (duur, easing) | Moment bij ons | Bron | CSS/JS in web-view? | Beeld |
|---|---|---|---|---|---|---|
| A1 | Wordle (NYT) | Tegel draait in twee helften: 250 ms `ease-in` rotateX 0→-90°, kleur wissel, 250 ms -90→0°, tegel na tegel. Letter typen: pop 100 ms (scale 0.8→1.1). Ongeldig: rij schudt 600 ms (±4 px). Winst: rij springt 1000 ms (-30, +5, -15, +2 px) | De oplossing onthullen, rij voor rij | Live CSS nytimes.com/games/wordle, 02-11-2026 [S] | Ja, puur CSS | a01 |
| A2 | Connections (NYT) | Indienen: 4 kaarten springen -10 px, 0,3 s `ease-in`, 0,1 s na elkaar. Fout: schudden ±5 px, 0,2 s × 1,5, en een foutbolletje krimpt weg (1.2→0.4→0). Goed: de groep wordt een gekleurde balk met een pulse naar scale 1.2 (0,3 s linear) en tekst die in 0,5 s infadet | Controleer en beschuldigen | Live CSS nytimes.com/games/connections, 02-11-2026 [S] | Ja, puur CSS | a02 |
| A3 | Duolingo, streak +1 | Grijze vlam vat vlam met een veer-overshoot, teller rolt (17→18), flits en draaiende zonnestralen, weekkalender schuift op, vinkje springt, dan pas de knop. Effect: +1,7% D7 bij nieuwe leerlingen | Streak ophogen na de dagelijkse zaak | 60fps.design/shots/duolingo-18-day-streak-animation en …-185-day-… [S]; blog.duolingo.com/how-duolingo-streak-builds-habit/ [M] | Ja: SVG plus CSS of GSAP; vlam ook als Lottie | a05, a03 |
| A4 | Duolingo, mijlpalen | Alleen op mijlpaaldagen verandert Duo in een feniks ("power-up"); timing is per ontwerp bijgeschaafd | 7 en 30 dagen (cadeauwereld) | blog.duolingo.com/streak-milestone-design-animation/ [M] | Ja, met een tekening of Lottie | a04 |
| A5 | Duolingo, vrije dag | IJslaag rond de vlam springt in scherven, vlam wordt oranje, teller verspringt met een veer, weekdag krijgt een ijsicoon | "Vrije dag gebruikt" (nu een toast) | 60fps.design/shots/duolingo-streak-freeze-animation [S] | Ja: CSS-scherven of `clip-path` | a06 |
| A6 | Duolingo, les klaar | Statistiekkaarten schuiven één voor één op met veer en een tellende cijferrol, elk met een eigen geluidje; mascotte bovenaan | Scoreregels in de ceremonie | 60fps.design/shots/duolingo-perfect-lesson-slow-clap en …-lesson-complete-head-explode-animation [S] | Ja | a08 |
| A7 | Duolingo, kist | Elke tik laat de kist zacht wiebelen; opwaarderen geeft een kleurgolf over het scherm; openen geeft een flits, edelstenen stuiteren omlaag en een teller tikt. Dit was Duolingo's eerste gebruik van Rive | Bewijskist | 60fps.design/shots/duolingo-chest-open-interaction [S]; rive.app/blog/creative-technologists… [M] | Ja (CSS of GSAP); Rive voor de mooie versie | a07, a27 |
| A8 | Duolingo, knop | Een knop met dikte: `box-shadow: 0 4px` en bij `:active` `translateY(4px)` zonder schaduw, 0,15 s | Alle hoofdknoppen | ibedwi.dev/blog/exploration-duolingo-button [Z]; medium.com/@lilskyjuicebytes [Z] | Ja, puur CSS | a09 |
| A9 | Xbox, achievement | Een rond icoon met trofee springt op, groeit uit tot een balk, de tekst schuift erin; de zeldzame variant krijgt een glans en een ander geluid | Medaille-toast | codepen.io/ItsMeStevieG/pen/RwmGpzO [M] (namaak in CSS, laat zien dat het kan) | Ja, CSS plus audio | – (CodePen toonde een botcontrole) |
| A10 | Apple Fitness | Tik op een 3D-metalen medaille: ze schaalt naar het midden (gedeeld element), achtergrond wordt zwart, ze draait met een veer, tekst fadet in | Medaille bekijken in het medailleoverzicht | 60fps.design/shots/apple-fitness-metal-badge-showcase [S] | Ja: CSS 3D `rotateY` met een metaalverloop | a11 |
| A11 | Spark, zilveren medaille | Medaille valt en stuitert elastisch op zijn plek, sterretjes springen eromheen, cijfers fadeen na elkaar in | Medaille op het resultaatscherm in plaats van een losse toast | 60fps.design/shots/spark-silver-medal-animation [S] | Ja | a12 |
| A12 | Return of the Obra Dinn | Na drie juiste lotsbestemmingen: een muzikaal accent, en de regels veranderen van **handschrift in drukletter**, "permanent in het grootboek gestempeld" | De oplossing: wie waar stond, het grootboek wordt bijgewerkt | filmstories.co.uk/features/exploring-return-of-the-obra-dinns-rule-of-three/ [M]; timpcarbone.com (PDF) [Z] | Ja: tekst laten oplossen, `clip-path`-veeg of inktvlek | a13 |
| A13 | Ace Attorney | De dader krijgt een eenmalige, overdreven "breakdown". In latere delen eerst een wijsgebaar met camerabeweging, daarna schudden, flitsen en een vervormd portret | De verdachte bekent | aceattorney.fandom.com/wiki/Breakdown [Z]; thegamer.com/ace-attorney-best-breakdowns/ [Z]; Wikipedia Ace Attorney [M] | Ja: GSAP-tijdlijn of CSS (schudden, flits, portret wisselen) | a14 |
| A14 | Candy Crush | Na 1–2 s niets doen knipperen of wiebelen de snoepjes van een mogelijke zet, elke paar seconden opnieuw. Spelers klaagden dat het te snel kwam, nu kan het uit | Een hintje bij lang stilzitten | candycrush.fandom.com/wiki/Hint_Moves [Z]; screenrant.com [Z]; reddit.com/r/candycrush [Z] | Ja | a15 |
| A15 | Chess.com Daily Solver | Punten vliegen naar een balk met een tikkende teller; puzzelstukjes vormen een streak en vliegen als badge naar de balk; op de padkaart schuift een pion naar het volgende level; "Level Completed!" met vuurwerk | Overgang naar de volgende zaak via de kaart | 60fps.design/shots/chess-daily-solver-level-jump-fireworks-animation [S] | Ja (GSAP voor het pad) | a16 |
| A16 | Monopoly Go | Hangslot springt eraf, het grijze eiland groeit iets en kleurt in met een vonkenregen | Nieuw deel of nieuwe wereld op de kaart | 60fps.design/shots/monopoly-go-city-progress-path-animation [S] | Ja: filter grayscale→0 en scale | a17 |
| A17 | Duolingo, laadscherm | De ogen van de mascotte knipperen, dan schaalt het hele laadscherm op en "vlieg je erdoorheen" naar het menu | Laadscherm naar menu | 60fps.design/shots/duolingo-splash [S] | Ja | a18 |
| A18 | Corner, laden | Een pil toont wisselende statusregels ("adding spots you saved…", "curating places for you…") terwijl spelden vallen; de pil wordt de knop "let me in" | Laadscherm (nu een kale balk) | 60fps.design/shots/corner-map-getting-ready-animation [S] | Ja | a19 |
| A19 | LottieFiles, "Approved Stamp" (Anu Menon) | Stempel daalt, raakt het papier, laat een vet "Approved" achter; 7,5 KB dotLottie, gratis licentie | Stempel bij "Zaak opgelost" | lottiefiles.com/free-animation/approved-stamp-A4svAPaEV9 [S] | Ja: lottie-web of dotLottie, of zelf in CSS (onze stempel bestaat al) | a20 |
| A20 | Rive, "Dynamic streak fire" (aristote) | Vlam met het getal erin; het getal past zijn opmaak aan bij 1, 2 of 3 cijfers (data binding en een state machine) | Streak-icoon in het menu | rive.app/marketplace/27337-51650-dynamic-streak-fire/ [S] (licentie CC BY: naamsvermelding verplicht) | Ja: Rive-runtime voor het web | a21 |
| A21 | Angry Birds en vele games, sterren | Sterren komen één voor één binnen met een eigen geluid; lege plekken zijn zichtbaar | Sterren in de ceremonie (hebben we al) | angrybirds.fandom.com/wiki/Star [Z]; dribbble.com/shots/18712479-Game-UI-Elements-Star-animation [Z] | Ja | a22 |
| A22 | Apple HIG haptics plus Capacitor Haptics | Systeempatronen volgens hun betekenis (`notification` SUCCESS/WARNING/ERROR, `selectionChanged`, `impact`). Hetzelfde patroon nooit voor goed en fout. Trillen is los uit te zetten. Laat het trillen even sterk en scherp zijn als de animatie | Alle feedback | developer.apple.com/design/human-interface-guidelines/playing-haptics [S]; plugin-definities @capacitor/haptics 7 [S] | Ja: plugin staat er al | a23 |
| A23 | Opal (tegenvoorbeeld) | Streak 1→0: de vlam krimpt, verliest gloed, een grijze 0 schaalt in | Niet doen. Een verloren streak benadrukken verlaagt de motivatie | 60fps.design/shots/opal-streak-1-day-to-0-day-text-animation [S]; JCR (retentieonderzoek) [S] | – | a24 |
| A24 | Sudoku-app, voltooid | Goud-zwarte deeltjes knallen uit, het hele rooster krimpt tot een compacte kaart met de tijd, een achievement-toast zakt van boven, de cijfers schuiven op | Bord naar resultaat als één beweging (nu een fade) | 60fps.design/shots/sudoku-complete-confetti-animation [S] | Ja: FLIP-techniek of GSAP Flip | a26 |

**A1. Wordle.**
- Het "flip"-gevoel komt van twee helften `ease-in` (versnellen naar de kant, dan terugvallen), met de kleurwissel precies in het midden, als de tegel op zijn zijkant staat.
- De winnende rij springt met afnemende sprongen (-30, +5, -15, +2, 0 px): een eenvoudige stuiter met keyframes, zonder veerfunctie.
- Getallen rechtstreeks uit de live CSS.

**A2. Connections.**
- Voor de uitslag springen de gekozen kaarten **na elkaar** op (0,1 s tussen elke kaart). Dat geeft een "controle"-ritme vóór goed of fout.
- Een fout kost zichtbaar iets: een bolletje krimpt weg. Dat is duidelijker dan alleen schudden.

**A3. Duolingo, streak +1.**
- De vaste volgorde in alle streakopnames: grijze vlam, ontbranding met overshoot, teller rolt, weekkalender, vinkje, knop. De knop komt altijd laatst, zodat je het moment niet wegtikt.
- Dit is de animatie waarvan Duolingo +1,7% D7 meldt.

**A4. Duolingo, mijlpalen.**
- De gewone dag krijgt de standaardanimatie; mijlpalen krijgen een "power-up" van het personage. Zo blijft het bijzonder.

**A5. Duolingo, vrije dag.**
- Een gebruikte vrije dag is een **redding** en wordt zo gevierd: het ijs breekt en de vlam leeft. Bij ons is het nu een tekstregel.

**A6. Duolingo, les klaar.**
- Kaarten met tellende cijfers en per kaart een geluid. Wij doen al regels na elkaar.
- Het verschil zit in de easing (onze teller is lineair) en in een eigen tik per regel.

**A7. Duolingo, de kist.**
- Elke tik op de dichte kist geeft een wiebel, en dat bouwt spanning op. Openen is een flits plus fysica.
- Onze kist schudt in een lus en opent bij de eerste tik. Een of twee "tik-wiebels" ervoor geven meer spanning.

**A8. Duolingo, de knop.**
- De knop heeft dikte (schaduw van 4 px) en zakt bij een druk in 0,15 s. Dat voelt fysiek en kost niets.

**A9. Xbox, de achievement.**
- Het bekendste "ontgrendeld"-moment in games: rond icoon, dan een balk, dan tekst, met een eigen geluid. Een zeldzame variant voor zeldzame medailles.
- Onze toast is nu een tekstregel met emoji.

**A10. Apple Fitness.**
- Medailles zijn tastbaar: metaal, 3D, draaibaar.
- Een "showcase" bij tikken maakt de verzameling waardevol.

**A11. Spark.**
- De medaille landt in het resultaatscherm met een stuiter, in plaats van in een losse toast erna. Dat bundelt het moment.

**A12. Obra Dinn.**
- Het beste voorbeeld voor ons: een speurspel waarin bevestiging betekent dat je aantekeningen **officieel** worden. Handschrift wordt drukletter in een grootboek.
- Crimson **Ledger** is letterlijk een grootboek.

**A13. Ace Attorney.**
- De dader valt door de mand met een eigen, overdreven animatie. Spelers onthouden die als het hoogtepunt van de zaak.
- Bij ons nu: een ballon en een lichte tik.

**A14. Candy Crush.**
- Bewijst dat een hintje bij stilzitten werkt, en ook dat te vroeg irriteert. Spelers vroegen om "seconden later" en kregen een uit-knop.
- Voor ons: pas na 45–60 s, alleen in zaak 1–3, alleen een duwtje naar de hintknop of de juiste verklaring, nooit het antwoord.

**A15. Chess.com Daily Solver.**
- Na een opgeloste puzzel schuift de pion op de kaart door naar het volgende level. Je ziet je voortgang voordat je verder speelt.

**A16. Monopoly Go.**
- Ontgrendelen als verandering van grijs naar kleur. Voor ons nieuwe deel of nieuwe wereld.

**A17. Duolingo, laadscherm.**
- Een knipoog van het personage, dan de zoom erdoorheen. Geen harde wissel.

**A18. Corner.**
- Laden wordt een verhaaltje met statusregels, en de laadbalk verandert in de knop.

**A19. LottieFiles, stempel.**
- Laat zien wat een stempel "echt" maakt: een daling, een kort indrukken (squash), dan de inkt.
- Onze CSS-stempel mist het indrukken en de inkt.

**A20. Rive, streakvlam.**
- Een vlam met het getal erin die zich aanpast aan het aantal cijfers.

**A21. Sterren.**
- Wij doen dit al goed (190 ms na elkaar, geluid per ster).
- Verbeteringen: een iets hogere toon per ster, een korte squash bij de landing en een lichte tik per ster.

**A22. Haptics.**
- Apple: een patroon moet één betekenis hebben. Wij gebruiken MEDIUM voor de stempel én voor een foute beschuldiging.
- `notification` SUCCESS/ERROR bestaat in onze plugin. Trillen hoort ook uit te kunnen.

**A23. Opal.**
- Laat zien hoe "streak verloren" eruitziet als animatie. Juist dat moeten we niet vieren.

**A24. Sudoku.**
- Het bord verdwijnt niet, het wordt de resultaatkaart. Eén doorlopende beweging in plaats van een schermwissel.

**Bibliotheken die in de web-view passen**
- **GSAP**: timelines, Flip en MotionPath; sinds 2025 met plug-ins gratis.
- **canvas-confetti**: vormen en emoji als confetti, met een optie om rekening te houden met minder beweging.
- **lottie-web of dotLottie**: voor A19.
- **Rive web-runtime**: voor A20 en A7.

Begin met CSS. GSAP alleen voor de lange reeksen: ceremonie, bekentenis, kaartovergang.

## 2.2 Ideeën voor Crimson Ledger (animaties)

**D1. Het grootboek wordt bijgewerkt: de oplossing als ceremonie.**
*Geïnspireerd door A12 (Obra Dinn: handschrift wordt drukletter), A1 (Wordle-flip), A19 (stempel met indrukken) en A24 (bord krimpt tot kaart).*

- Na de bekentenis krimpt het bord tot de kopkaart van het resultaatscherm.
- De rijen "Waar iedereen stond" verschijnen eerst in handschrift.
- Dan wordt rij na rij "ingeschreven": een Wordle-flip van 250 + 250 ms met `ease-in`, en tussen de rijen 120 ms. Na de flip is het de drukletter, met een kleine inktvlek.
- De rij van de dader komt als laatste, met 🔪, en dan pas de stempel.
- De stempel krijgt een indrukmoment: scale 1.0→0.94→1 in 120 ms, met een inktrand die uitloopt.
- Vervang de confetti door papiersnippers en inktspatten in onze kleuren.
- Geheel onder 2,5 s, tikken slaat over.

**D2. De bekentenis: de verdachte valt door de mand.**
*Geïnspireerd door A13 (Ace Attorney-breakdown), A2 (Connections: eerst springen, dan uitslag, een foutbolletje) en A22 (haptics met betekenis).*

- Bij Controleer springen de geplaatste verdachten één voor één op (0,3 s, 0,1 s na elkaar).
- Bij de juiste beschuldiging:
  - de anderen worden dof
  - het portret van de dader zoomt in, met een rode flits en 250 ms schudden
  - de bekentenis typt zich in (25 ms per letter, tik maakt hem af)
  - de telefoon geeft `notification SUCCESS`
- Bij een foute beschuldiging krimpt een "geduldbolletje" van Van Dam weg (zoals bij Connections) en geeft de telefoon `notification ERROR`.
- Nu staat er 700 ms en een lichte tik. Dit mag 1,2 s worden.

**D3. Een streakvlam die groeit, en een vrije dag die het ijs breekt.**
*Geïnspireerd door A3 (Duolingo streak +1, +1,7% D7), A4 (mijlpalen), A5 (ijs breekt), A20 (Rive-vlam) en A23 en JCR (verlies niet animeren).*

- Na de dagelijkse zaak volgt een kort streakmoment, als blad over het resultaat of als regel bovenaan:
  - grijze vlam ontbrandt (scale 0.6→1.15→1, veer van 500 ms)
  - het getal rolt van oud naar nieuw (400 ms)
  - de dag in de weekstrook krijgt een vinkje-pop
  - de knop komt als laatste
- Op 7 en 30 dagen een speciale variant: Van Dams insigne of een gouden vlam, met de cadeauwereld.
- Een gebruikte vrije dag: de vlam zit in ijs dat breekt, in plaats van de toast "Vrije dag gebruikt".
- Een verloren streak krijgt **geen** animatie.
- Vlam als SVG met CSS, of de gratis LottieFiles "Flame – Streak" (12 KB).

**D4. Medailles als achievement, en een vitrine om ze te bekijken.**
*Geïnspireerd door A9 (Xbox-achievement), A11 (Spark-medaille in het resultaat), A10 (Apple Fitness metaal en 3D) en de `BadgeImage`-pop van NYT (scale 1→1.2→1, live CSS).*

- De medaille-toast wordt een rond insigne:
  - het springt op (0→1.15→1, 350 ms veer)
  - het groeit uit tot een balk (400 ms)
  - de titel schuift in
- Zeldzame medailles krijgen een glansveeg en een ander geluid. De telefoon geeft `notification SUCCESS`.
- In het medailleoverzicht opent een tik de vitrine: de medaille schaalt naar het midden, de achtergrond wordt donker, en je kunt haar met je vinger draaien (`rotateY` met een metaalverloop).

**D5. Naar de volgende zaak via de kaart.**
*Geïnspireerd door A15 (Chess.com: de pion schuift op de padkaart), A16 (Monopoly Go: grijs wordt kleur) en A17 (Duolingo: zoom erdoorheen).*

- "▶ Volgende zaak" toont eerst 1 s een strook van de kaart:
  - de pin springt in een boog (600 ms, ease-in-out) van de opgeloste knoop naar de volgende
  - de opgeloste knoop krijgt een ✓-stempeltje
  - de voortgangsbalk van het deel loopt op
- Daarna zoom je in op het nieuwe bord.
- Na de laatste zaak van een deel springt het slot van het volgende deel eraf.
- Tikken slaat over. Totaal maximaal 1,2 s, zodat het het "één tik naar de volgende zaak"-principe uit het retentieonderzoek niet vertraagt.

**D6. Kleine dingen die alles beter laten voelen: knoppen, trillen, hint en laden.**
*Geïnspireerd door A8 (Duolingo-knop), A22 (HIG haptics), A14 (Candy Crush, maar later en met een uit-knop), A18 (Corner-statusregels), A17 (laadscherm) en A6 (tellende cijfers met easing).*

- **Knoppen** krijgen dikte en zakken in (0,15 s), met een lichte tik.
- **Eén trilpatroon per betekenis:**
  - `selectionChanged` bij neerzetten en bladeren
  - `impact LIGHT` op knoppen
  - `notification SUCCESS` bij zaak opgelost en medailles
  - `notification ERROR` bij een foute beschuldiging
  - `notification WARNING` bij een tegenstrijdigheid
- Een schakelaar **"Trillen"** in Instellingen.
- **De teller** loopt met `easeOutCubic` in plaats van lineair.
- **Hint na stilzitten:** na 45–60 s zonder zet, alleen in zaak 1–3, wiebelt de hintknop één keer (en de gratis "Vast?"-hint uit het retentieonderzoek). Met een schakelaar.
- **Laadscherm:** statusregels onder de balk ("Getuigen verhoren…", "Plattegrond tekenen…", "Dossier openen…"). De balk verandert in de knop en zoomt dan door naar het menu.
- **Minder beweging:** zet de schuddende kist en de stralen van de deel-splash ook stil bij `prefers-reduced-motion`.

---

## Bronnen per screenshot (map `onderzoek-anim/`)

Meldingen: m01 pushkeen Duolingo (met de afscheidsmelding met plaatje) · m03 Duolingo-blog over meldingskeuze · m04 LinkedIn-help streaks · m05 Towards Data Science over LinkedIn Games · m06 Snapchat streakherinnering · m07 BeReal-melding in de arXiv-studie · m08 pushkeen Finch · m09 pushkeen Headspace · m10 pushkeen Royal Match · m11 PC Gamer over NYT en meldingen · m12 Apple HIG Managing notifications · m13 Apple HIG Notifications · m14 Apple Close your rings · m15 Airship rich push · m16 Capacitor Local Notifications · m17 cjleo over wachtmeldingen · m18 Puzzmo-blog.

Animaties: a01 Wordle · a02 Connections · a03 Duolingo-blog streak +1,7% D7 · a04 Duolingo-blog mijlpaal · a05 Duolingo 18 dagen · a06 Duolingo vrije dag · a07 Duolingo kist · a08 Duolingo perfecte les · a09 Duolingo-knop CSS · a11 Apple Fitness-medaille · a12 Spark-medaille · a13 Obra Dinn · a14 Ace Attorney-breakdowns (TheGamer) · a15 Candy Crush-hint (ScreenRant) · a16 Chess.com Daily Solver · a17 Monopoly Go · a18 Duolingo-laadscherm · a19 Corner laden · a20 LottieFiles-stempel · a21 Rive-streakvlam · a22 Dribbble-sterren · a23 Apple HIG haptics · a24 Opal streak naar 0 · a25 Dribbble vergrootglas-loader · a26 Sudoku voltooid · a27 Rive over Duolingo-beloningen · a28 LottieFiles-streakvlam · a29 Dribbble Rive-achievementbadge.

Let op: 60fps.design toont video's. De schermafbeelding is één beeld; de beschrijving in de tabel komt van de pagina zelf.

Niet vastgelegd: de Duolingo- en Ace Attorney-wiki (Fandom), de BeReal-helppagina en CodePen gaven een Cloudflare-botcontrole. Die is niet omzeild. Voor BeReal, Ace Attorney en Candy Crush staat er een andere openbare pagina in de map; de wiki- en CodePen-teksten zijn via zoekresultaten gelezen.
